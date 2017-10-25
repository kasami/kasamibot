/**
 * To start using Traveler, require it in main.js:
 * Example: var Traveler = require('Traveler.js');
 *
 * Check the footer of this file for suggestions on how to access it at various scopes
 *
 */

import * as RoomRepository from "../repository/Room";

import * as IntelLib from "../lib/intel";
import * as TravelLib from "../lib/travel";

export interface TravelData {
    stuck: number;
    dest: RoomPosition;
    prev: RoomPosition | undefined;
    path: string;
    tick: number;
    cpu: number;
    count: number;
    portalCheck: boolean;
}

export interface TravelToOptions {
    ignoreRoads?: boolean;
    ignoreCreeps?: boolean;
    ignoreStuck?: boolean;
    ignoreStructures?: boolean;
    avoidKeepers?: boolean;
    preferHighway?: boolean;
    allowHostile?: boolean;
    allowSK?: boolean;
    range?: number;
    obstacles?: {pos: RoomPosition}[];
    roomCallback?: (roomName: string, ignoreCreeps: boolean) => CostMatrix | boolean;
    routeCallback?: (roomName: string) => number;
    returnData?: { nextPos?: RoomPosition; };
    restrictDistance?: number;
    useFindRoute?: boolean;
    maxOps?: number;
}

interface PathfinderReturn {
    path: RoomPosition[];
    ops: number;
    cost: number;
    incomplete: boolean;
}

const REPORT_CPU_THRESHOLD = 50;
const DEFAULT_MAXOPS = 20000;
const DEFAULT_STUCK_VALUE = 3;

export class Traveler {

    private memory: {
        hostileRooms: {[roomName: string]: number | undefined}
    };
    private structureMatrixCache: {[roomName: string]: CostMatrix};
    private creepMatrixCache: {[roomName: string]: CostMatrix};
    private currentTick: number;

    constructor() {
        // change this memory path to suit your needs
        if (!Memory.empire) { Memory.empire = {}; }
        if (!Memory.empire.hostileRooms) { Memory.empire.hostileRooms = {}; }
        this.memory = Memory.empire;
    }

    public findAllowedRooms(origin: string, destination: string,
                            options: TravelToOptions = {}): {[roomName: string]: boolean } {
        _.defaults(options, { restrictDistance: 16 });
        if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, destination) > options.restrictDistance) { return {}; }
        let allowedRooms = { [ origin ]: true, [ destination ]: true };
        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName: string) => {

                if (options.routeCallback) {
                    let outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }

                if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, roomName) > options.restrictDistance) { return false; }
                let parsed: any;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) { parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any; }
                    let fMod = parsed[1] % 10;
                    let sMod = parsed[2] % 10;
                    let isSK =  !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                    if (isSK) {
                        return 10;
                    }
                }
                if (!options.allowHostile && this.memory.hostileRooms[roomName] &&
                    roomName !== destination && roomName !== origin) {
                    return Number.POSITIVE_INFINITY;
                }

                return 2.5;
            },
        });
        if (!_.isArray(ret)) {
            console.log(`couldn't findRoute to ${destination}`);
            if (Memory.empire !== undefined) {
                if (Memory.empire.inaccessible === undefined) {
                    Memory.empire.inaccessible = [];
                }
                if (!_.contains(Memory.empire.inaccessible, destination)) {
                    Memory.empire.inaccessible.push(destination);
                }
            }
            return {};
        }
        for (let value of ret) {
            allowedRooms[value.room] = true;
        }

        return allowedRooms;
    }

    public findTravelPath(origin: {pos: RoomPosition}, destination: {pos: RoomPosition},
                          options: TravelToOptions = {}): PathfinderReturn | any {
        _.defaults(options, {
            ignoreCreeps: true,
            range: 1,
            maxOps: DEFAULT_MAXOPS,
            obstacles: [],
        });

        let allowedRooms: {[roomName: string]: boolean };
        if (options.useFindRoute || (options.useFindRoute === undefined &&
            Game.map.getRoomLinearDistance(origin.pos.roomName, destination.pos.roomName) > 2)) {
            allowedRooms = this.findAllowedRooms(origin.pos.roomName, destination.pos.roomName, options);
        }

        let callback = (roomName: string): CostMatrix | boolean => {

            if (options.roomCallback) {
                if (options.ignoreCreeps === undefined) {
                    options.ignoreCreeps = true;
                }
                let outcome = options.roomCallback(roomName, options.ignoreCreeps);
                if (outcome !== undefined) {
                    return outcome;
                }
            }

            if (allowedRooms) {
                if (!allowedRooms[roomName]) {
                    return false;
                }
            } else if (this.memory.hostileRooms[roomName] && !options.allowHostile) {
                return false;
            }

            let room = Game.rooms[roomName];
            //if (!room) { return false; }
            if (!room) { return new PathFinder.CostMatrix(); }

            let matrix: CostMatrix;
            if (options.ignoreStructures) {
                matrix = new PathFinder.CostMatrix();
                if (!options.ignoreCreeps) {
                    Traveler.addCreepsToMatrix(room, matrix);
                }
            } else if (options.ignoreCreeps || roomName !== origin.pos.roomName) {
                matrix = this.getStructureMatrix(room);
            } else {
                matrix = this.getCreepMatrix(room);
            }

            if (options.avoidKeepers) {
                matrix = Traveler.addHostilesToMatrix(room, matrix);
            }

            matrix = Traveler.addBasePositionsToMatrix(room, matrix);

            if (options.obstacles === undefined) {
                options.obstacles = [];
            }

            for (let obstacle of options.obstacles) {
                matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
            }

            return matrix;
        };

        if (options.range === undefined) {
            options.range = 1;
        }

        if (options.maxOps === undefined) {
            options.maxOps = DEFAULT_MAXOPS;
        }

        return PathFinder.search(origin.pos, {pos: destination.pos, range: options.range}, {
            maxOps: options.maxOps,
            plainCost: options.ignoreRoads ? 1 : 2,
            roomCallback: callback,
            swampCost: options.ignoreRoads ? 5 : 10,
        } );
    }

    public travelTo(creep: Creep, destination: {pos: RoomPosition}, options: TravelToOptions = {}, enemyCheck: boolean = false): number {

        if (enemyCheck && (creep.memory.lastEnemyCheck === undefined || creep.memory.lastEnemyCheck + 5 < Game.time)) {
            if ((IntelLib.hasDangerousHostiles(creep.room.name) && TravelLib.isCloseToHostile(creep)) ||
                (RoomRepository.isSKRoom(creep.room.name) && TravelLib.isCloseToSourceKeeper(creep))) {
                creep.memory._travel = {stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false} as TravelData;
                creep.memory.lastEnemyCheck = Game.time;

            }
        }

        // initialize data object
        if (!creep.memory._travel) {
            creep.memory._travel = {stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false} as TravelData;
        }
        let travelData: TravelData = creep.memory._travel;

        if (creep.fatigue > 0) {
            travelData.tick = Game.time;
            return ERR_BUSY;
        }

        if (!destination) {
            return ERR_INVALID_ARGS;
        }

        if (Game.time % 10 === 0 && !travelData.portalCheck && RoomRepository.isPortalRoom(creep.pos.roomName)) {
            let portals = creep.room.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_PORTAL});
            if (portals.length > 0) {
                travelData.portalCheck = true;
                delete travelData.path;
            }
        }

        // manage case where creep is nearby destination
        let rangeToDestination = creep.pos.getRangeTo(destination);
        if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && options.range !== undefined && !(options.range >= 1)) {
                if (options.returnData) { options.returnData.nextPos = destination.pos; }
                return creep.move(creep.pos.getDirectionTo(destination));
            }
            return OK;
        }

        // check if creep is stuck
        let hasMoved = true;
        if (travelData.prev) {
            travelData.prev = Traveler.initPosition(travelData.prev);
            if (creep.pos.inRangeTo(travelData.prev, 0)) {
                hasMoved = false;
                travelData.stuck++;
            } else {
                travelData.stuck = 0;
            }
        }

        // handle case where creep is stuck
        if (travelData.stuck >= DEFAULT_STUCK_VALUE && !options.ignoreStuck) {
            options.ignoreCreeps = false;
            delete travelData.path;
        }

        // handle case where creep wasn't traveling last tick and may have moved, but destination is still the same
        if (Game.time - travelData.tick > 1 && hasMoved) {
            delete travelData.path;
        }
        travelData.tick = Game.time;

        // delete path cache if destination is different
        if (!travelData.dest || travelData.dest.x !== destination.pos.x || travelData.dest.y !== destination.pos.y ||
            travelData.dest.roomName !== destination.pos.roomName) {
            delete travelData.path;
        }

        // pathfinding
        if (!travelData.path) {
            if (creep.spawning) { return ERR_BUSY; }

            travelData.dest = destination.pos;
            travelData.prev = undefined;
            let cpu = Game.cpu.getUsed();
            let ret = this.findTravelPath(creep, destination, options);
            travelData.cpu += (Game.cpu.getUsed() - cpu);
            travelData.count++;
            if (travelData.cpu > REPORT_CPU_THRESHOLD) {
                //console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${_.round(travelData.cpu, 2)},\n` +
                //    `origin: ${creep.pos}, dest: ${destination.pos}`);
            }
            if (ret.incomplete) {
                //console.log(`TRAVELER: incomplete path for ${creep.name}`);
                options.useFindRoute = true;
                ret = this.findTravelPath(creep, destination, options);
                //console.log(`attempting path without findRoute was ${ret.incomplete ? "not" : ""} successful`);
            }
            travelData.path = Traveler.serializePath(creep.pos, ret.path);
            travelData.stuck = 0;
        }
        if (!travelData.path || travelData.path.length === 0) {
            //console.log("ErrNoPath: from " + creep.pos + " to " + destination.pos + " - creep: " + creep.id);
            return creep.moveTo(destination);
        }

        // consume path and move
        if (travelData.prev && travelData.stuck === 0) {
            travelData.path = travelData.path.substr(1);
        }
        travelData.prev = creep.pos;
        let nextDirection = parseInt(travelData.path[0], 10);
        if (options.returnData) { options.returnData.nextPos = Traveler.positionAtDirection(creep.pos, nextDirection); }
        return creep.move(nextDirection);
    }

    public getStructureMatrix(room: Room): CostMatrix {
        this.refreshMatrices();
        if (!this.structureMatrixCache[room.name]) {
            let matrix = new PathFinder.CostMatrix();
            this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
        }
        return this.structureMatrixCache[room.name];
    }

    public static initPosition(pos: RoomPosition) {
        return new RoomPosition(pos.x, pos.y, pos.roomName);
    }

    public static addStructuresToMatrix(room: Room, matrix: CostMatrix, roadCost: number): CostMatrix {
        for (let structure of room.find<Structure>(FIND_STRUCTURES)) {
            if (structure instanceof StructureRampart) {
                if (!structure.my) {
                    matrix.set(structure.pos.x, structure.pos.y, 0xff);
                }
            } else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, roadCost);
            } else if (structure.structureType !== STRUCTURE_CONTAINER) {
                // Can't walk through non-walkable buildings
                matrix.set(structure.pos.x, structure.pos.y, 0xff);
            }
        }
        for (let constructionSite of room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES)) {
            if (constructionSite.structureType !== STRUCTURE_ROAD && constructionSite.structureType !== STRUCTURE_CONTAINER && constructionSite.structureType !== STRUCTURE_RAMPART) {
                // Can't walk through non-walkable buildings
                matrix.set(constructionSite.pos.x, constructionSite.pos.y, 0xff);
            }
        }
        return matrix;
    }

    public getCreepMatrix(room: Room) {
        this.refreshMatrices();
        if (!this.creepMatrixCache[room.name]) {
            this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room).clone());
        }
        return this.creepMatrixCache[room.name];
    }

    public static addCreepsToMatrix(room: Room, matrix: CostMatrix): CostMatrix {
        room.find<Creep>(FIND_CREEPS).forEach((creep: Creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff) );
        return matrix;
    }

    public static addHostilesToMatrix(room: Room, matrix: CostMatrix): CostMatrix {
        let hostiles = room.find(FIND_HOSTILE_CREEPS) as Creep[];
        let c: Creep, x: number, y: number, xpos: number, ypos: number;
        for (c of hostiles) {
            for (x = -5; x < 6; x++) {
                for (y = -5; y < 6; y++) {
                    xpos = c.pos.x + x;
                    ypos = c.pos.y + y;
                    if (xpos > 0  && xpos < 49 && ypos > 0 && ypos < 49) {
                        matrix.set(xpos, ypos, 50);
                    }
                }
            }
        }
        return matrix;
    }

    public static addBasePositionsToMatrix(room: Room, matrix: CostMatrix): CostMatrix {
        if (room.controller !== undefined && room.controller.my && room.controller.level > 3 && room.storage !== undefined) {
            matrix.set(room.storage.pos.x, room.storage.pos.y - 1, 10);
            matrix.set(room.storage.pos.x, room.storage.pos.y + 1, 10);
            matrix.set(room.storage.pos.x, room.storage.pos.y - 4, 10);
        }
        return matrix;
    }


    public static serializePath(startPos: RoomPosition, path: RoomPosition[]): string {
        let serializedPath = "";
        let lastPosition = startPos;
        for (let position of path) {
            if (position.roomName === lastPosition.roomName) {
                serializedPath += lastPosition.getDirectionTo(position);
            }
            lastPosition = position;
        }
        return serializedPath;
    }

    private refreshMatrices() {
        if (Game.time !== this.currentTick) {
            this.currentTick = Game.time;
            this.structureMatrixCache = {};
            this.creepMatrixCache = {};
        }
    }

    private static positionAtDirection(origin: RoomPosition, direction: number): RoomPosition {
        let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        return new RoomPosition(origin.x + offsetX[direction], origin.y + offsetY[direction], origin.roomName);
    }
}

// uncomment this to have an instance of traveler available through import
export const traveler = new Traveler();

// uncomment to assign an instance to global
// global.traveler = new Traveler();

// uncomment this block to assign a function to Creep.prototype: creep.travelTo(destination)
/*
const traveler = new Traveler();
Creep.prototype.travelTo = function(destination: {pos: RoomPosition}, options?: TravelToOptions) {
    return traveler.travelTo(this, destination, options);
};
*/
