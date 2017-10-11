"use strict";
const ExtensionLib = require("./lib.extension");
const roomtype_1 = require("./enums.roomtype");
const RoomRepository = require("./repository.Room");
function getDistanseBetween(position1, position2) {
    return PathFinder.search(position1, { pos: position2, range: 1 }).path.length - 1;
}
exports.getDistanseBetween = getDistanseBetween;
function getKitingRoomCallback(roomName) {
    let room = Game.rooms[roomName];
    if (!room)
        return new PathFinder.CostMatrix;
    let costs = new PathFinder.CostMatrix;
    room.find(FIND_STRUCTURES).forEach(function (structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
            costs.set(structure.pos.x, structure.pos.y, 2);
        }
        else if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
                !(structure instanceof OwnedStructure && structure.my))) {
            costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });
    room.find(FIND_HOSTILE_CREEPS, {
        filter: function (c) {
            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
        }
    }).forEach(function (hostileCreep) {
        for (let x = -3; x < 4; x++) {
            for (let y = -3; y < 4; y++) {
                costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 10);
                if (Math.abs(x) < 3 && Math.abs(y) < 3) {
                    costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 20);
                }
            }
        }
    });
    room.find(FIND_CREEPS).forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });
    return costs;
}
exports.getKitingRoomCallback = getKitingRoomCallback;
function getOffroadRoomCallback(roomName) {
    let room = Game.rooms[roomName];
    if (!room)
        return new PathFinder.CostMatrix;
    let costs = new PathFinder.CostMatrix;
    room.find(FIND_STRUCTURES).forEach(function (structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
            costs.set(structure.pos.x, structure.pos.y, 20);
        }
        else if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
                !(structure instanceof OwnedStructure && structure.my))) {
            costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });
    room.find(FIND_CREEPS).forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });
    return costs;
}
exports.getOffroadRoomCallback = getOffroadRoomCallback;
function getRoadPathBetween(pos1, pos2, allowSK = false) {
    let callback = getRoomCallbackForRoadbuilding;
    if (allowSK) {
        callback = getRoomCallbackForRoadbuildingSKallowed;
    }
    let path = findRoadPath({ pos: pos1 }, { pos: pos2 }, callback);
    if (path === undefined) {
        console.log("Problem with roadBuilding between " + pos1 + " and " + pos2);
        return [];
    }
    return path;
}
exports.getRoadPathBetween = getRoadPathBetween;
function findRoadPath(origin, destination, cMatrix) {
    let options = {
        ignoreCreeps: true,
        range: 1,
        maxOps: 40000,
        obstacles: [],
    };
    let allowedRooms = [origin.pos.roomName].concat(RoomRepository.getAllOutposts(Game.rooms[origin.pos.roomName]));
    let callback = (roomName) => {
        if (allowedRooms) {
            if (!_.contains(allowedRooms, roomName)) {
                return false;
            }
        }
        let outcome = cMatrix(roomName);
        return outcome;
    };
    return PathFinder.search(origin.pos, { pos: destination.pos, range: options.range }, {
        maxOps: options.maxOps,
        plainCost: 2,
        roomCallback: callback,
        swampCost: 3,
    }).path;
}
function getRoomCallbackForRoadbuilding(roomName, allowSK = false) {
    let room = Game.rooms[roomName];
    let costs = new PathFinder.CostMatrix;
    if (allowSK !== true) {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let fMod = parsed[1] % 10;
        let sMod = parsed[2] % 10;
        let isSK = !(fMod === 5 && sMod === 5) &&
            ((fMod >= 4) && (fMod <= 6)) &&
            ((sMod >= 4) && (sMod <= 6));
        if (isSK) {
            let x, y, t;
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
    let x, y, t;
    for (x = 0; x < 50; x++) {
        for (y = 0; y < 50; y++) {
            t = Game.map.getTerrainAt(x, y, roomName);
            if (t === "plain") {
                costs.set(x, y, 2);
            }
            else if (t === "swamp") {
                costs.set(x, y, 3);
            }
        }
    }
    if (!room) {
        return costs;
    }
    ;
    if (allowSK === true) {
        room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) { return s.structureType === STRUCTURE_KEEPER_LAIR; } }).forEach(function (lair) {
            let x, y, t;
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
    room.find(FIND_SOURCES).forEach(function (source) {
        let pos = source.pos;
        let containerpos = source.getContainerPosition();
        if (containerpos !== undefined) {
            pos = containerpos;
        }
        let x, y, t;
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                if (t === "plain" || t === "swamp") {
                    costs.set(pos.x + x, pos.y + y, 8);
                }
            }
        }
    });
    room.find(FIND_MINERALS).forEach(function (mineral) {
        let pos = mineral.pos;
        let containerpos = mineral.getContainerPosition();
        if (containerpos !== undefined) {
            pos = containerpos;
        }
        let x, y, t;
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                if (t === "plain" || t === "swamp") {
                    costs.set(pos.x + x, pos.y + y, 8);
                }
            }
        }
    });
    room.find(FIND_STRUCTURES).forEach(function (structure) {
        if (structure.structureType === STRUCTURE_ROAD) {
            costs.set(structure.pos.x, structure.pos.y, 1);
        }
        else if (structure.structureType === STRUCTURE_CONTROLLER) {
            let pos = structure.pos;
            let containerpos = structure.getContainerPosition();
            if (containerpos !== undefined) {
                pos = containerpos;
            }
            let x, y, t;
            for (x = -1; x < 2; x++) {
                for (y = -1; y < 2; y++) {
                    t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
                    if (t === "plain" || t === "swamp") {
                        costs.set(pos.x + x, pos.y + y, 8);
                    }
                }
            }
        }
        else if (structure.structureType !== STRUCTURE_CONTAINER &&
            (structure.structureType !== STRUCTURE_RAMPART ||
                !(structure instanceof OwnedStructure && structure.my))) {
            costs.set(structure.pos.x, structure.pos.y, 0xff);
        }
    });
    if (room.controller !== undefined && room.controller.my && room.memory.t === roomtype_1.Roomtype.Normal) {
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
exports.getRoomCallbackForRoadbuilding = getRoomCallbackForRoadbuilding;
function getRoomCallbackForRoadbuildingSKallowed(roomName) {
    return getRoomCallbackForRoadbuilding(roomName, true);
}
exports.getRoomCallbackForRoadbuildingSKallowed = getRoomCallbackForRoadbuildingSKallowed;
