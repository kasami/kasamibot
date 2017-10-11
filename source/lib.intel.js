"use strict";
const hostility_1 = require("./enums.hostility");
const Logger_1 = require("./tools.Logger");
function hasIntel(roomName) {
    if (global.intel === undefined) {
        global.intel = {};
    }
    if (global.intel[roomName] === undefined) {
        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].i !== undefined) {
            if (Memory.rooms[roomName].i.t !== undefined) {
                Memory.rooms[roomName].i = JSON.stringify(Memory.rooms[roomName].i);
            }
            global.intel[roomName] = JSON.parse(Memory.rooms[roomName].i);
            return true;
        }
    }
    else {
        return true;
    }
    return false;
}
exports.hasIntel = hasIntel;
function needsNewIntel(roomName) {
    if ((!hasIntel(roomName) || global.intel[roomName].t + 20000 < Game.time) && Game.map.isRoomAvailable(roomName)) {
        return true;
    }
    return false;
}
exports.needsNewIntel = needsNewIntel;
function hasInvaders(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h === hostility_1.Hostility.Invaders) {
        return true;
    }
    return false;
}
exports.hasInvaders = hasInvaders;
function hasHostiles(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h > hostility_1.Hostility.None) {
        return true;
    }
    return false;
}
exports.hasHostiles = hasHostiles;
function hasDangerousHostiles(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h > hostility_1.Hostility.HarmlessHostiles) {
        return true;
    }
    return false;
}
exports.hasDangerousHostiles = hasDangerousHostiles;
function isOccupied(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h >= hostility_1.Hostility.Reserved) {
        return true;
    }
    return false;
}
exports.isOccupied = isOccupied;
function towerCount(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].towers !== undefined) {
        return global.intel[roomName].towers;
    }
    return 0;
}
exports.towerCount = towerCount;
function isInsafeMode(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].safeMode !== undefined) {
        return (global.intel[roomName].t + global.intel[roomName].safeMode > Game.time);
    }
    return false;
}
exports.isInsafeMode = isInsafeMode;
function isOwned(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h >= hostility_1.Hostility.Controlled) {
        return true;
    }
    return false;
}
exports.isOwned = isOwned;
function roomHostility(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].h !== undefined) {
        return global.intel[roomName].h;
    }
    return hostility_1.Hostility.None;
}
exports.roomHostility = roomHostility;
function roomLevel(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].l !== undefined) {
        return global.intel[roomName].l;
    }
    return undefined;
}
exports.roomLevel = roomLevel;
function isReservedByMe(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
        return true;
    }
    return false;
}
exports.isReservedByMe = isReservedByMe;
function isReservedByMeFor(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
        return global.intel[roomName].res;
    }
    return 0;
}
exports.isReservedByMeFor = isReservedByMeFor;
function isOwnedByMe(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res === undefined) {
        return true;
    }
    return false;
}
exports.isOwnedByMe = isOwnedByMe;
function sourceCount(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
        return Object.keys(global.intel[roomName].s).length;
    }
    return 0;
}
exports.sourceCount = sourceCount;
function sourceIds(roomName) {
    let sourceIds = [];
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
        for (let id of Object.keys(global.intel[roomName].s)) {
            sourceIds.push(id);
        }
    }
    return sourceIds;
}
exports.sourceIds = sourceIds;
function mineralType(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
        let split = global.intel[roomName].m.split("-");
        if (split.length === 4) {
            return split[1];
        }
    }
}
exports.mineralType = mineralType;
function mineralPos(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
        let split = global.intel[roomName].m.split("-");
        if (split.length === 4) {
            return new RoomPosition(split[2], split[3], roomName);
        }
    }
}
exports.mineralPos = mineralPos;
function sourcePos(roomName, sourceId) {
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined && global.intel[roomName].s[sourceId] !== undefined) {
        return makeRoomPosForSourceInfo(roomName, global.intel[roomName].s[sourceId]);
    }
    Logger_1.log.error("IntelLib had to make a fake sourcepos for source " + sourceId, roomName);
    return new RoomPosition(25, 25, roomName);
}
exports.sourcePos = sourcePos;
function controllerPos(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
        return makeRoomPosForControllerInfo(roomName, global.intel[roomName].c);
    }
    return null;
}
exports.controllerPos = controllerPos;
function controllerId(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
        return makeIdForControllerInfo(global.intel[roomName].c);
    }
    return null;
}
exports.controllerId = controllerId;
function mineralTicks(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].mtime !== undefined) {
        return global.intel[roomName].mtime;
    }
    return undefined;
}
exports.mineralTicks = mineralTicks;
function intelTime(roomName) {
    if (hasIntel(roomName) && global.intel[roomName].t !== undefined) {
        return global.intel[roomName].t;
    }
    return undefined;
}
exports.intelTime = intelTime;
function makeRoomPosForSourceInfo(roomName, ipos) {
    let split = ipos.split("-");
    if (split.length === 2) {
        return new RoomPosition(+split[0], +split[1], roomName);
    }
    Logger_1.log.error("IntelLib had to make a fake sourcepos for sourceinfo: " + ipos, roomName);
    return new RoomPosition(25, 25, roomName);
}
function makeRoomPosForControllerInfo(roomName, ipos) {
    let split = ipos.split("-");
    if (split.length === 3) {
        return new RoomPosition(+split[1], +split[2], roomName);
    }
    Logger_1.log.error("IntelLib had to make a fake controllerpos: " + ipos, roomName);
    return new RoomPosition(25, 25, roomName);
}
function makeIdForControllerInfo(ipos) {
    let split = ipos.split("-");
    if (split.length === 3) {
        return split[0];
    }
    Logger_1.log.error("IntelLib had to make a fake controllerid: " + ipos, "");
    return "";
}
function saveIntelForRoom(room) {
    let hostiles = room.find(FIND_HOSTILE_CREEPS);
    var intel = {};
    if (room.memory.i !== undefined) {
        if (room.memory.i.t !== undefined) {
            room.memory.i = JSON.stringify(room.memory.i);
        }
        intel = JSON.parse(room.memory.i);
    }
    intel.t = Game.time;
    intel.h = getRoomHostility(room, hostiles);
    if (Memory.settings.bot === true) {
        registerAllThreats(room, hostiles);
    }
    if (room.controller !== undefined) {
        intel.c = room.controller.id + "-" + room.controller.pos.x + "-" + room.controller.pos.y;
        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
            room.controller.reservation.username !== Memory.settings.user && !(room.controller.my)) {
            intel.o = room.controller.reservation.username;
        }
        else {
            intel.o = undefined;
        }
        if (room.controller.level >= 1 && !room.controller.my) {
            intel.l = room.controller.level;
        }
        else {
            intel.l = undefined;
        }
        if (room.controller.level >= 3 && !room.controller.my) {
            intel.towers = room.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER }).length;
        }
        else {
            intel.towers = undefined;
        }
        if ((room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user) || room.controller.my) {
            intel.my = true;
        }
        else {
            intel.my = undefined;
        }
        if (room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user && !room.controller.my) {
            intel.res = room.controller.reservation.ticksToEnd;
        }
        else {
            intel.res = undefined;
        }
        if (room.controller.safeMode) {
            intel.safeMode = room.controller.safeMode;
        }
        else {
            intel.safeMode = undefined;
        }
    }
    let mineral = room.getMineral();
    if (mineral !== undefined) {
        intel.mtime = mineral.ticksToRegeneration;
    }
    if (intel.s === undefined) {
        intel.s = registerSourceInfo(room);
    }
    if (intel.m === undefined) {
        intel.m = registerMineralInfo(room);
    }
    if (global.intel === undefined) {
        global.intel = {};
    }
    global.intel[room.name] = intel;
    room.memory.i = JSON.stringify(intel);
}
exports.saveIntelForRoom = saveIntelForRoom;
function registerSourceInfo(room) {
    let sourceInfo = {};
    let sources = room.find(FIND_SOURCES);
    if (sources.length > 0) {
        for (let source of sources) {
            sourceInfo[source.id] = source.pos.x + "-" + source.pos.y;
        }
    }
    return sourceInfo;
}
function registerMineralInfo(room) {
    let minerals = room.find(FIND_MINERALS);
    if (minerals.length > 0) {
        return minerals[0].id + "-" + minerals[0].mineralType + "-" + minerals[0].pos.x + "-" + minerals[0].pos.y;
    }
    return undefined;
}
function getRoomHostility(room, hostiles) {
    if (room.controller !== undefined) {
        Memory.empire.hostileRooms[room.name] = undefined;
        if (room.controller.level >= 1 && !room.controller.my) {
            if (Memory.empire !== undefined && Memory.empire.hostileRooms !== undefined && !_.contains(Object.keys(Memory.empire.hostileRooms), room.name)) {
                Memory.empire.hostileRooms[room.name] = room.controller.level;
            }
            return hostility_1.Hostility.Controlled;
        }
        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
            room.controller.reservation.username !== Memory.settings.user && room.controller.reservation.ticksToEnd > 0) {
            return hostility_1.Hostility.Reserved;
        }
    }
    let highest = hostility_1.Hostility.None;
    if (hostiles.length > 0) {
        for (let hostile of hostiles) {
            if (hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
                if (dangerousHostile(hostile)) {
                    return hostility_1.Hostility.Hostiles;
                }
                else {
                    if (highest !== hostility_1.Hostility.Invaders) {
                        highest = hostility_1.Hostility.HarmlessHostiles;
                    }
                }
            }
            if (hostile["owner"]["username"] === "Invader") {
                highest = hostility_1.Hostility.Invaders;
            }
        }
    }
    return highest;
}
function dangerousHostile(hostile) {
    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
}
function registerAllThreats(room, hostiles) {
    if (room.controller === undefined || hostiles.length === 0) {
        return;
    }
    if (room.controller.my || (room.controller.reservation !== undefined &&
        room.controller.reservation.username !== undefined && room.controller.reservation.username === Memory.settings.user)) {
        for (let hostile of hostiles) {
            if (hostile.body.length > 1 && hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
                if (room.controller.my) {
                    if (hostile.body.length > 10) {
                        if (hostile.body[0].boost !== undefined) {
                            addThreatToPlayer(hostile["owner"]["username"], 30);
                        }
                        else {
                            addThreatToPlayer(hostile["owner"]["username"], 10);
                        }
                    }
                    else {
                        addThreatToPlayer(hostile["owner"]["username"], 5);
                    }
                }
                else {
                    if (hostile.body.length > 10) {
                        addThreatToPlayer(hostile["owner"]["username"], 2);
                    }
                    else {
                        addThreatToPlayer(hostile["owner"]["username"], 1);
                    }
                }
            }
        }
    }
}
function addThreatToPlayer(name, threat) {
    if (Memory.playerthreat === undefined) {
        Memory.playerthreat = {};
    }
    if (Memory.playerthreat[name] === undefined) {
        Memory.playerthreat[name] = threat;
    }
    else {
        Memory.playerthreat[name] += threat;
    }
}
