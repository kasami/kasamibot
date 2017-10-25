import * as ExtensionLib from "../lib/extension";

import {Roomtype} from "../enums/roomtype";

import * as RoomRepository from "../repository/Room";

/**
 * Get distance between to positions for creeps
 */
export function getDistanseBetween(position1: RoomPosition, position2: RoomPosition): number {
    return PathFinder.search(position1, {pos: position2, range: 1}).path.length - 1;
}

export function getKitingRoomCallback(roomName: string): CostMatrix {
    let room = Game.rooms[roomName];
    // In this example `room` will always exist, but since PathFinder
    // supports searches which span multiple rooms you should be careful!
    if (!room) return new PathFinder.CostMatrix;

    let costs = new PathFinder.CostMatrix;

    room.find(FIND_STRUCTURES).forEach(function(structure: Structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
            costs.set(structure.pos.x, structure.pos.y, 2);
        } else
        if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
            !(structure instanceof OwnedStructure && structure.my))) {
        // Can't walk through non-walkable buildings
        costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });

    room.find(FIND_HOSTILE_CREEPS, {
        filter: function(c: Creep) {
            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
        }
    }).forEach(function(hostileCreep: Creep) {
        for (let x = -3; x < 4; x++) {
            for (let y = -3; y < 4; y++) {
                costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 10);
                if (Math.abs(x) < 3 && Math.abs(y) < 3) {
                    costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 20);
                }
            }
        }
    });

    room.find(FIND_CREEPS).forEach(function(creep: Creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });
    return costs;
}

export function getOffroadRoomCallback(roomName: string): CostMatrix {
    let room = Game.rooms[roomName];
    // In this example `room` will always exist, but since PathFinder
    // supports searches which span multiple rooms you should be careful!
    if (!room) return new PathFinder.CostMatrix;

    let costs = new PathFinder.CostMatrix;

    room.find(FIND_STRUCTURES).forEach(function(structure: Structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
            costs.set(structure.pos.x, structure.pos.y, 20);
        } else
        if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
            !(structure instanceof OwnedStructure && structure.my))) {
        // Can't walk through non-walkable buildings
        costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });

    room.find(FIND_CREEPS).forEach(function(creep: Creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });
    return costs;
}

export function getRoadPathBetween(pos1: RoomPosition, pos2: RoomPosition, allowSK: boolean = false): RoomPosition[] {
    let callback = getRoomCallbackForRoadbuilding;
    if (allowSK) {
        callback = getRoomCallbackForRoadbuildingSKallowed;
    }
    let path = findRoadPath({pos: pos1}, {pos: pos2}, callback);
    if (path === undefined) {
        console.log("Problem with roadBuilding between " + pos1 + " and " + pos2);
        return [];
    }
    return path;
}


function findRoadPath(origin: {pos: RoomPosition}, destination: {pos: RoomPosition}, cMatrix: (roomName: string) => CostMatrix | boolean): RoomPosition[] | undefined {
    let options = {
        ignoreCreeps: true,
        range: 1,
        maxOps: 40000,
        obstacles: [],
    };

    let allowedRooms: string[] = [origin.pos.roomName].concat(RoomRepository.getAllOutposts(Game.rooms[origin.pos.roomName]));

    let callback = (roomName: string): CostMatrix | boolean => {

        if (allowedRooms) {
            if (!_.contains(allowedRooms, roomName)) {
                return false;
            }
        }

        let outcome = cMatrix(roomName);
        return outcome;
    };

    return PathFinder.search(origin.pos, {pos: destination.pos, range: options.range}, {
        maxOps: options.maxOps,
        plainCost: 2,
        roomCallback: callback,
        swampCost: 3,
    } ).path;
}

export function getRoomCallbackForRoadbuilding(roomName: string, allowSK: boolean = false): CostMatrix {
    let room = Game.rooms[roomName];

    let costs = new PathFinder.CostMatrix;

    if (allowSK !== true) {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
        let fMod = parsed[1] % 10;
        let sMod = parsed[2] % 10;
        let isSK =  !(fMod === 5 && sMod === 5) &&
            ((fMod >= 4) && (fMod <= 6)) &&
            ((sMod >= 4) && (sMod <= 6));
        if (isSK) {
            let x: number, y: number, t: string;
            for (x = 0; x < 50; x++) {
                for (y = 0; y < 50; y++) {
                    t = Game.map.getTerrainAt(x, y, roomName);
                    if (t === "plain" || t === "swamp") {
                        costs.set(x, y, 0xfe);
                    }
                }
            }
            return costs;
        }
    }

    let x: number, y: number, t: string;
    for (x = 0; x < 50; x++) {
        for (y = 0; y < 50; y++) {
            t = Game.map.getTerrainAt(x, y, roomName);
            if (t === "plain") {
                costs.set(x, y, 2);
            } else
            if ( t === "swamp") {
                costs.set(x, y, 3);
            }
        }
    }

    if (!room) {
        return costs;
    };

    if (allowSK === true) {
        room.find(FIND_HOSTILE_STRUCTURES, {filter: function(s: StructureKeeperLair) { return s.structureType === STRUCTURE_KEEPER_LAIR;}}).forEach(function (lair: Structure) {
            let x: number, y: number, t: string;
            for (x = -2; x < 3; x++) {
                for (y = -2; y < 3; y++) {
                    t = Game.map.getTerrainAt(lair.pos.x + x, lair.pos.y + y, roomName);
                    if (t === "plain" || t === "swamp") {
                        costs.set(lair.pos.x + x, lair.pos.y + y, 12);
                    }
                }
            }
        });
    }

    room.find(FIND_SOURCES).forEach(function (source: Source) {
        let pos = source.pos;
        let containerpos = source.getContainerPosition();
        if (containerpos !== undefined) {
            pos = containerpos;
        }
        let x: number, y: number, t: string;
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                if (t === "plain" || t === "swamp") {
                    costs.set(pos.x + x, pos.y + y, 8);
                }
            }
        }
    });
    room.find(FIND_MINERALS).forEach(function (mineral: Mineral) {
        let pos = mineral.pos;
        let containerpos = mineral.getContainerPosition();
        if (containerpos !== undefined) {
            pos = containerpos;
        }
        let x: number, y: number, t: string;
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                if (t === "plain" || t === "swamp") {
                    costs.set(pos.x + x, pos.y + y, 8);
                }
            }
        }
    });
    room.find(FIND_STRUCTURES).forEach(function(structure: Structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
        // Favor existing roads over building new ones
            costs.set(structure.pos.x, structure.pos.y, 1);
        } else
        if (structure.structureType === STRUCTURE_CONTROLLER) {
            let pos = structure.pos;
            let containerpos = (structure as StructureController).getContainerPosition();
            if (containerpos !== undefined) {
                pos = containerpos;
            }
            let x: number, y: number, t: string;
            for (x = -1; x < 2; x++) {
                for (y = -1; y < 2; y++) {
                    t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                    if (t === "plain" || t === "swamp") {
                        costs.set(pos.x + x, pos.y + y, 8);
                    }
                }
            }
        } else
        if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
            !(structure instanceof OwnedStructure && structure.my))) {
        // Can't walk through non-walkable buildings
        costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });

    if (room.controller !== undefined && room.controller.my && room.memory.t === Roomtype.Normal) {
        let basePos = RoomRepository.getBasePosition(room);
        if (basePos !== undefined) {
            let exts = ExtensionLib.getExtensionPositions(room, basePos);
            for (let epos of exts) {
                costs.set(epos.x, epos.y, 0xFE);
            }

            costs.set(basePos.x - 2, basePos.y + 1, 0xFE);
            costs.set(basePos.x - 3, basePos.y + 2, 0xFE);
            costs.set(basePos.x - 3, basePos.y + 3, 0xFE);
            costs.set(basePos.x - 2, basePos.y + 2, 0xFE);
            costs.set(basePos.x + 2, basePos.y + 1, 0xFE);
            costs.set(basePos.x + 3, basePos.y + 2, 0xFE);
            costs.set(basePos.x + 3, basePos.y + 3, 0xFE);
            costs.set(basePos.x + 2, basePos.y + 2, 0xFE);

            costs.set(basePos.x - 1, basePos.y - 1, 0xFE);
            costs.set(basePos.x + 1, basePos.y - 1, 0xFE);

            costs.set(basePos.x, basePos.y + 2, 0xFE);
            costs.set(basePos.x, basePos.y + 3, 0xFE);
            costs.set(basePos.x - 1, basePos.y + 4, 0xFE);
            costs.set(basePos.x + 1, basePos.y + 4, 0xFE);
            costs.set(basePos.x - 2, basePos.y + 5, 0xFE);
            costs.set(basePos.x - 1, basePos.y + 5, 0xFE);
            costs.set(basePos.x, basePos.y + 5, 0xFE);
            costs.set(basePos.x + 1, basePos.y + 5, 0xFE);
            costs.set(basePos.x + 2, basePos.y + 5, 0xFE);
            costs.set(basePos.x - 2, basePos.y + 6, 0xFE);
            costs.set(basePos.x - 1, basePos.y + 6, 0xFE);
            costs.set(basePos.x, basePos.y + 6, 0xFE);
            costs.set(basePos.x + 1, basePos.y + 6, 0xFE);
            costs.set(basePos.x + 2, basePos.y + 6, 0xFE);
            costs.set(basePos.x - 1, basePos.y + 7, 0xFE);
            costs.set(basePos.x, basePos.y + 7, 0xFE);
            costs.set(basePos.x + 1, basePos.y + 7, 0xFE);

        }
    }

    return costs;
}


export function getRoomCallbackForRoadbuildingSKallowed(roomName: string): CostMatrix {
    return getRoomCallbackForRoadbuilding(roomName, true);
}
