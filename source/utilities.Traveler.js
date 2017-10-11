"use strict";
const RoomRepository = require("./repository.Room");
const IntelLib = require("./lib.intel");
const TravelLib = require("./lib.travel");
const REPORT_CPU_THRESHOLD = 50;
const DEFAULT_MAXOPS = 20000;
const DEFAULT_STUCK_VALUE = 3;
class Traveler {
    constructor() {
        if (!Memory.empire) {
            Memory.empire = {};
        }
        if (!Memory.empire.hostileRooms) {
            Memory.empire.hostileRooms = {};
        }
        this.memory = Memory.empire;
    }
    findAllowedRooms(origin, destination, options = {}) {
        _.defaults(options, { restrictDistance: 16 });
        if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, destination) > options.restrictDistance) {
            return {};
        }
        let allowedRooms = { [origin]: true, [destination]: true };
        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName) => {
                if (options.routeCallback) {
                    let outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, roomName) > options.restrictDistance) {
                    return false;
                }
                let parsed;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }
                    let fMod = parsed[1] % 10;
                    let sMod = parsed[2] % 10;
                    let isSK = !(fMod === 5 && sMod === 5) &&
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
    findTravelPath(origin, destination, options = {}) {
        _.defaults(options, {
            ignoreCreeps: true,
            range: 1,
            maxOps: DEFAULT_MAXOPS,
            obstacles: [],
        });
        let allowedRooms;
        if (options.useFindRoute || (options.useFindRoute === undefined &&
            Game.map.getRoomLinearDistance(origin.pos.roomName, destination.pos.roomName) > 2)) {
            allowedRooms = this.findAllowedRooms(origin.pos.roomName, destination.pos.roomName, options);
        }
        let callback = (roomName) => {
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
            }
            else if (this.memory.hostileRooms[roomName] && !options.allowHostile) {
                return false;
            }
            let room = Game.rooms[roomName];
            if (!room) {
                return new PathFinder.CostMatrix();
            }
            let matrix;
            if (options.ignoreStructures) {
                matrix = new PathFinder.CostMatrix();
                if (!options.ignoreCreeps) {
                    Traveler.addCreepsToMatrix(room, matrix);
                }
            }
            else if (options.ignoreCreeps || roomName !== origin.pos.roomName) {
                matrix = this.getStructureMatrix(room);
            }
            else {
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
        return PathFinder.search(origin.pos, { pos: destination.pos, range: options.range }, {
            maxOps: options.maxOps,
            plainCost: options.ignoreRoads ? 1 : 2,
            roomCallback: callback,
            swampCost: options.ignoreRoads ? 5 : 10,
        });
    }
    travelTo(creep, destination, options = {}, enemyCheck = false) {
        if (enemyCheck && (creep.memory.lastEnemyCheck === undefined || creep.memory.lastEnemyCheck + 5 < Game.time)) {
            if ((IntelLib.hasDangerousHostiles(creep.room.name) && TravelLib.isCloseToHostile(creep)) ||
                (RoomRepository.isSKRoom(creep.room.name) && TravelLib.isCloseToSourceKeeper(creep))) {
                creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false };
                creep.memory.lastEnemyCheck = Game.time;
            }
        }
        if (!creep.memory._travel) {
            creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false };
        }
        let travelData = creep.memory._travel;
        if (creep.fatigue > 0) {
            travelData.tick = Game.time;
            return ERR_BUSY;
        }
        if (!destination) {
            return ERR_INVALID_ARGS;
        }
        if (Game.time % 10 === 0 && !travelData.portalCheck && RoomRepository.isPortalRoom(creep.pos.roomName)) {
            let portals = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
            if (portals.length > 0) {
                travelData.portalCheck = true;
                delete travelData.path;
            }
        }
        let rangeToDestination = creep.pos.getRangeTo(destination);
        if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && options.range !== undefined && !(options.range >= 1)) {
                if (options.returnData) {
                    options.returnData.nextPos = destination.pos;
                }
                return creep.move(creep.pos.getDirectionTo(destination));
            }
            return OK;
        }
        let hasMoved = true;
        if (travelData.prev) {
            travelData.prev = Traveler.initPosition(travelData.prev);
            if (creep.pos.inRangeTo(travelData.prev, 0)) {
                hasMoved = false;
                travelData.stuck++;
            }
            else {
                travelData.stuck = 0;
            }
        }
        if (travelData.stuck >= DEFAULT_STUCK_VALUE && !options.ignoreStuck) {
            options.ignoreCreeps = false;
            delete travelData.path;
        }
        if (Game.time - travelData.tick > 1 && hasMoved) {
            delete travelData.path;
        }
        travelData.tick = Game.time;
        if (!travelData.dest || travelData.dest.x !== destination.pos.x || travelData.dest.y !== destination.pos.y ||
            travelData.dest.roomName !== destination.pos.roomName) {
            delete travelData.path;
        }
        if (!travelData.path) {
            if (creep.spawning) {
                return ERR_BUSY;
            }
            travelData.dest = destination.pos;
            travelData.prev = undefined;
            let cpu = Game.cpu.getUsed();
            let ret = this.findTravelPath(creep, destination, options);
            travelData.cpu += (Game.cpu.getUsed() - cpu);
            travelData.count++;
            if (travelData.cpu > REPORT_CPU_THRESHOLD) {
            }
            if (ret.incomplete) {
                options.useFindRoute = true;
                ret = this.findTravelPath(creep, destination, options);
            }
            travelData.path = Traveler.serializePath(creep.pos, ret.path);
            travelData.stuck = 0;
        }
        if (!travelData.path || travelData.path.length === 0) {
            return creep.moveTo(destination);
        }
        if (travelData.prev && travelData.stuck === 0) {
            travelData.path = travelData.path.substr(1);
        }
        travelData.prev = creep.pos;
        let nextDirection = parseInt(travelData.path[0], 10);
        if (options.returnData) {
            options.returnData.nextPos = Traveler.positionAtDirection(creep.pos, nextDirection);
        }
        return creep.move(nextDirection);
    }
    getStructureMatrix(room) {
        this.refreshMatrices();
        if (!this.structureMatrixCache[room.name]) {
            let matrix = new PathFinder.CostMatrix();
            this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
        }
        return this.structureMatrixCache[room.name];
    }
    static initPosition(pos) {
        return new RoomPosition(pos.x, pos.y, pos.roomName);
    }
    static addStructuresToMatrix(room, matrix, roadCost) {
        for (let structure of room.find(FIND_STRUCTURES)) {
            if (structure instanceof StructureRampart) {
                if (!structure.my) {
                    matrix.set(structure.pos.x, structure.pos.y, 0xff);
                }
            }
            else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, roadCost);
            }
            else if (structure.structureType !== STRUCTURE_CONTAINER) {
                matrix.set(structure.pos.x, structure.pos.y, 0xff);
            }
        }
        for (let constructionSite of room.find(FIND_CONSTRUCTION_SITES)) {
            if (constructionSite.structureType !== STRUCTURE_ROAD && constructionSite.structureType !== STRUCTURE_CONTAINER && constructionSite.structureType !== STRUCTURE_RAMPART) {
                matrix.set(constructionSite.pos.x, constructionSite.pos.y, 0xff);
            }
        }
        return matrix;
    }
    getCreepMatrix(room) {
        this.refreshMatrices();
        if (!this.creepMatrixCache[room.name]) {
            this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room).clone());
        }
        return this.creepMatrixCache[room.name];
    }
    static addCreepsToMatrix(room, matrix) {
        room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
        return matrix;
    }
    static addHostilesToMatrix(room, matrix) {
        let hostiles = room.find(FIND_HOSTILE_CREEPS);
        let c, x, y, xpos, ypos;
        for (c of hostiles) {
            for (x = -5; x < 6; x++) {
                for (y = -5; y < 6; y++) {
                    xpos = c.pos.x + x;
                    ypos = c.pos.y + y;
                    if (xpos > 0 && xpos < 49 && ypos > 0 && ypos < 49) {
                        matrix.set(xpos, ypos, 50);
                    }
                }
            }
        }
        return matrix;
    }
    static addBasePositionsToMatrix(room, matrix) {
        if (room.controller !== undefined && room.controller.my && room.controller.level > 3 && room.storage !== undefined) {
            matrix.set(room.storage.pos.x, room.storage.pos.y - 1, 10);
            matrix.set(room.storage.pos.x, room.storage.pos.y + 1, 10);
            matrix.set(room.storage.pos.x, room.storage.pos.y - 4, 10);
        }
        return matrix;
    }
    static serializePath(startPos, path) {
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
    refreshMatrices() {
        if (Game.time !== this.currentTick) {
            this.currentTick = Game.time;
            this.structureMatrixCache = {};
            this.creepMatrixCache = {};
        }
    }
    static positionAtDirection(origin, direction) {
        let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        return new RoomPosition(origin.x + offsetX[direction], origin.y + offsetY[direction], origin.roomName);
    }
}
exports.Traveler = Traveler;
exports.traveler = new Traveler();
