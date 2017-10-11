"use strict";
const Logger_1 = require("./tools.Logger");
const roomlevel_1 = require("./enums.roomlevel");
const roomtype_1 = require("./enums.roomtype");
const SpawnLib = require("./lib.spawn");
const IntelLib = require("./lib.intel");
function getBasePosition(room) {
    if (room.memory.b !== undefined) {
        return longPos(room.memory.b, room.name);
    }
    else {
        if (Memory.settings.bot) {
            let basepos = SpawnLib.findSpawnLocation(room.name, true);
            if (basepos !== undefined) {
                SpawnLib.createSpawnmoveOperation(room, basepos.pos);
                room.memory.b = shortPos(basepos.pos);
                return basepos.pos;
            }
        }
        let spawnsInRoom = room.find(FIND_MY_SPAWNS);
        if (spawnsInRoom.length > 0) {
            room.memory.b = shortPos(spawnsInRoom[0].pos);
            return spawnsInRoom[0].pos;
        }
    }
    return undefined;
}
exports.getBasePosition = getBasePosition;
function setBasePosition(roomName, pos) {
    if (Memory.rooms[roomName] === undefined) {
        Memory.rooms[roomName] = {};
    }
    Memory.rooms[roomName].b = shortPos(pos);
}
exports.setBasePosition = setBasePosition;
function roomShouldBuild(room) {
    return room.memory.t === roomtype_1.Roomtype.Normal && room.memory.isBeingDismantled !== true &&
        (room.storage === undefined || !room.storage.isActive() || room.storage.store[RESOURCE_ENERGY] > 20000);
}
exports.roomShouldBuild = roomShouldBuild;
function getRoomLevel(room) {
    if (room.memory.l === undefined) {
        return roomlevel_1.RoomLevel.BasicColony;
    }
    return room.memory.l;
}
exports.getRoomLevel = getRoomLevel;
;
function setRoomLevel(room, level) {
    Logger_1.log.alert("Roomlevel changed to: " + roomlevel_1.RoomLevel[level], room.name);
    room.memory.l = level;
}
exports.setRoomLevel = setRoomLevel;
;
function hasOutpost(room, outpost) {
    return _.contains(room.memory.outposts, outpost);
}
exports.hasOutpost = hasOutpost;
function getAllOutposts(room) {
    if (room.memory.outposts === undefined) {
        return [];
    }
    return room.memory.outposts;
}
exports.getAllOutposts = getAllOutposts;
function getAllOutpostsInAllRooms(rooms) {
    let outposts = [];
    for (let r of rooms) {
        outposts = outposts.concat(r.memory.outposts);
    }
    return outposts;
}
exports.getAllOutpostsInAllRooms = getAllOutpostsInAllRooms;
function getAllPoachroomsInAllRooms(rooms) {
    let outposts = [];
    for (let r of rooms) {
        outposts = outposts.concat(r.memory.poaching);
    }
    return outposts;
}
exports.getAllPoachroomsInAllRooms = getAllPoachroomsInAllRooms;
function getNumberOfSourcesMined(room) {
    let sourceCount = room.find(FIND_SOURCES).length;
    for (let outpost of room.memory.outposts) {
        if (IntelLib.hasIntel(outpost)) {
            sourceCount += IntelLib.sourceIds(outpost).length;
        }
    }
    return sourceCount;
}
exports.getNumberOfSourcesMined = getNumberOfSourcesMined;
function getOwnerOfOutpost(outpost, rooms) {
    for (let r of rooms) {
        if (r.memory.outposts !== undefined && _.contains(r.memory.outposts, outpost)) {
            return r;
        }
    }
    return undefined;
}
exports.getOwnerOfOutpost = getOwnerOfOutpost;
function getBasicOutposts(room) {
    let outposts = [];
    if (room.memory.outposts === undefined) {
        return outposts;
    }
    for (let s of room.memory.outposts) {
        if (!isMiddleRoom(s)) {
            outposts.push(s);
        }
    }
    return outposts;
}
exports.getBasicOutposts = getBasicOutposts;
function getLairOutposts(room) {
    let outposts = [];
    if (room.memory.outposts === undefined) {
        return outposts;
    }
    for (let s of room.memory.outposts) {
        if (isMiddleRoom(s)) {
            outposts.push(s);
        }
    }
    return outposts;
}
exports.getLairOutposts = getLairOutposts;
function getLastIndex() {
    let last = 1;
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true && room.memory.index !== undefined) {
            if (last < room.memory.index) {
                last = room.memory.index;
            }
        }
    }
    return last;
}
exports.getLastIndex = getLastIndex;
function getRoomForIndex(index) {
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true && room.memory.index === index) {
            return room;
        }
    }
    return undefined;
}
exports.getRoomForIndex = getRoomForIndex;
function getIndex(room) {
    if (room.memory.index !== undefined) {
        return room.memory.index;
    }
    let rooms = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true) {
            rooms.push(room);
        }
    }
    let used = _.map(rooms, (r) => r.memory.index);
    let counter = 1;
    while (counter < 100) {
        if (!_.contains(used, counter)) {
            room.memory.index = counter;
            return counter;
        }
        counter++;
    }
    Logger_1.log.error("Error assigning roomindex to room.", room.name);
    return 0;
}
exports.getIndex = getIndex;
function isMiddleRoom(roomName) {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }
    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isSK = ((fMod >= 4) && (fMod <= 6)) &&
        ((sMod >= 4) && (sMod <= 6));
    return isSK;
}
exports.isMiddleRoom = isMiddleRoom;
function isSKRoom(roomName) {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }
    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isSK = !(fMod === 5 && sMod === 5) &&
        ((fMod >= 4) && (fMod <= 6)) &&
        ((sMod >= 4) && (sMod <= 6));
    return isSK;
}
exports.isSKRoom = isSKRoom;
function isPortalRoom(roomName) {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }
    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isPortal = (fMod === 5 && sMod === 5);
    return isPortal;
}
exports.isPortalRoom = isPortalRoom;
function shortPos(pos) {
    return pos.x + "-" + pos.y;
}
function longPos(pos, roomName) {
    let split = pos.split("-");
    return new RoomPosition(+split[0], +split[1], roomName);
}
function getClosestPortalroom(roomName) {
    let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
    let fMod = Math.floor(parsed[2] / 10) * 10 + 5;
    let sMod = Math.floor(parsed[4] / 10) * 10 + 5;
    let closestPortal = parsed[1] + fMod + parsed[3] + sMod;
    return closestPortal;
}
exports.getClosestPortalroom = getClosestPortalroom;
