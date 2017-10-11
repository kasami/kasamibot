"use strict";
const RoomRepository = require("./repository.Room");
const roomlevel_1 = require("./enums.roomlevel");
function desiredWallHitsForRoom(room) {
    let roomlevel = RoomRepository.getRoomLevel(room);
    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
        if (roomlevel >= roomlevel_1.RoomLevel.City) {
            return 100000;
        }
        else {
            return 20000;
        }
    }
    if (roomlevel >= roomlevel_1.RoomLevel.Metropolis) {
        return 10000000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.City) {
        return 1000000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.Town) {
        return 250000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.AdvancedColony) {
        return 100000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.CivilizedColony) {
        return 50000;
    }
    return 0;
}
exports.desiredWallHitsForRoom = desiredWallHitsForRoom;
function desiredFortressHitsForRoom(room) {
    let roomlevel = RoomRepository.getRoomLevel(room);
    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
        if (roomlevel >= roomlevel_1.RoomLevel.City) {
            return 500000;
        }
        else {
            return 100000;
        }
    }
    if (roomlevel >= roomlevel_1.RoomLevel.Metropolis) {
        if (room.memory.lowestWall !== undefined) {
            return Math.max(room.memory.lowestWall * 2, 5000000);
        }
        else {
            return 5000000;
        }
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.City) {
        return 5000000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.Town) {
        return 2000000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.AdvancedColony) {
        return 100000;
    }
    else if (roomlevel >= roomlevel_1.RoomLevel.CivilizedColony) {
        return 500000;
    }
    return 0;
}
exports.desiredFortressHitsForRoom = desiredFortressHitsForRoom;
function getBorderwallRoomCallback(wallPositions) {
    let costs = new PathFinder.CostMatrix;
    for (let p of wallPositions) {
        costs.set(p.x, p.y, 0xfe);
    }
    return costs;
}
exports.getBorderwallRoomCallback = getBorderwallRoomCallback;
function shortPos(pos) {
    return pos.x + "-" + pos.y;
}
exports.shortPos = shortPos;
function longPos(pos, roomName) {
    let split = pos.split("-");
    return new RoomPosition(+split[0], +split[1], roomName);
}
exports.longPos = longPos;
function wallConstructionLimitReached() {
    return Object.keys(Game.constructionSites).length > 60;
}
exports.wallConstructionLimitReached = wallConstructionLimitReached;
