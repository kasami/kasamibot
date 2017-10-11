"use strict";
function roomHasCreepThatNeedsBoosting(room) {
    return room.memory.boostTarget !== undefined;
}
exports.roomHasCreepThatNeedsBoosting = roomHasCreepThatNeedsBoosting;
function roomIsCurrentlyBoosting(room) {
    return room.memory.boosting;
}
exports.roomIsCurrentlyBoosting = roomIsCurrentlyBoosting;
function setRoomIsBoosting(room) {
    room.memory.boosting = true;
}
exports.setRoomIsBoosting = setRoomIsBoosting;
function getCreepThatNeedsBoosting(room) {
    return Game.getObjectById(room.memory.boostTarget);
}
exports.getCreepThatNeedsBoosting = getCreepThatNeedsBoosting;
function getBoostHauler(room) {
    let bh = Game.getObjectById(room.memory.boostHauler);
    if (bh === null) {
        room.memory.boostHauler = undefined;
    }
    return bh;
}
exports.getBoostHauler = getBoostHauler;
function removeBoostingFromRoom(room) {
    room.memory.boostTarget = undefined;
    room.memory.boostStage = undefined;
    room.memory.boostHauler = undefined;
    room.memory.boosting = undefined;
}
exports.removeBoostingFromRoom = removeBoostingFromRoom;
function enableCreepIfDisabled(creep) {
    if (creep instanceof Creep) {
        creep.enable();
    }
}
exports.enableCreepIfDisabled = enableCreepIfDisabled;
function boostTargetInPosition(creep, position) {
    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
        return true;
    }
    return false;
}
exports.boostTargetInPosition = boostTargetInPosition;
function boostHaulerInPosition(creep, position) {
    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
        return true;
    }
    return false;
}
exports.boostHaulerInPosition = boostHaulerInPosition;
function removeWantedBoostTypeFromCreepMemory(creep, type) {
    creep.memory.boost = _.filter(creep.memory.boost, function (t) { return t !== type; });
    if (creep.memory.boost.length === 0) {
        creep.memory.boost = undefined;
    }
}
exports.removeWantedBoostTypeFromCreepMemory = removeWantedBoostTypeFromCreepMemory;
function creepIsBoosted(creep, type) {
    let validateBodypart = getBodyPartForBoost(type);
    for (let b of creep.body) {
        if (b.type === validateBodypart && b.boost !== type) {
            return false;
        }
    }
    return true;
}
exports.creepIsBoosted = creepIsBoosted;
function getTargetBoostingPosition(lab) {
    return new RoomPosition(lab.pos.x + 1, lab.pos.y, lab.pos.roomName);
}
exports.getTargetBoostingPosition = getTargetBoostingPosition;
function getHaulerBoostingPosition(lab) {
    return new RoomPosition(lab.pos.x, lab.pos.y - 1, lab.pos.roomName);
}
exports.getHaulerBoostingPosition = getHaulerBoostingPosition;
function setAsBoostHauler(room, creep) {
    room.memory.boostHauler = creep.id;
    creep.disable();
}
exports.setAsBoostHauler = setAsBoostHauler;
function getWantedBoosts(creep) {
    if (creep.memory.boost === undefined || creep.memory.boost.length === 0) {
        return { type: "", count: 0 };
    }
    let type = creep.memory.boost[0];
    let bodypart = getBodyPartForBoost(type);
    let count = creep.getActiveBodyparts(bodypart);
    return { type: type, count: count };
}
exports.getWantedBoosts = getWantedBoosts;
function doWeHaveMineralsRequired(room, mineral, count) {
    if (room.terminal === undefined) {
        return false;
    }
    if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < count) {
        return false;
    }
    return true;
}
exports.doWeHaveMineralsRequired = doWeHaveMineralsRequired;
function getBodyPartForBoost(boost) {
    switch (boost) {
        case RESOURCE_CATALYZED_UTRIUM_ACID:
            return ATTACK;
        case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
            return WORK;
        case RESOURCE_CATALYZED_KEANIUM_ACID:
            return CARRY;
        case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
            return RANGED_ATTACK;
        case RESOURCE_CATALYZED_LEMERGIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
            return HEAL;
        case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
            return MOVE;
        case RESOURCE_CATALYZED_GHODIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_GHODIUM_ALKALIDE:
            return TOUGH;
        case RESOURCE_UTRIUM_ACID:
            return ATTACK;
        case RESOURCE_UTRIUM_ALKALIDE:
            return WORK;
        case RESOURCE_KEANIUM_ACID:
            return CARRY;
        case RESOURCE_KEANIUM_ALKALIDE:
            return RANGED_ATTACK;
        case RESOURCE_LEMERGIUM_ACID:
            return WORK;
        case RESOURCE_LEMERGIUM_ALKALIDE:
            return HEAL;
        case RESOURCE_ZYNTHIUM_ACID:
            return WORK;
        case RESOURCE_ZYNTHIUM_ALKALIDE:
            return MOVE;
        case RESOURCE_GHODIUM_ACID:
            return WORK;
        case RESOURCE_GHODIUM_ALKALIDE:
            return TOUGH;
        case RESOURCE_UTRIUM_HYDRIDE:
            return ATTACK;
        case RESOURCE_UTRIUM_OXIDE:
            return WORK;
        case RESOURCE_KEANIUM_HYDRIDE:
            return CARRY;
        case RESOURCE_KEANIUM_OXIDE:
            return RANGED_ATTACK;
        case RESOURCE_LEMERGIUM_HYDRIDE:
            return WORK;
        case RESOURCE_LEMERGIUM_OXIDE:
            return HEAL;
        case RESOURCE_ZYNTHIUM_HYDRIDE:
            return WORK;
        case RESOURCE_ZYNTHIUM_OXIDE:
            return MOVE;
        case RESOURCE_GHODIUM_HYDRIDE:
            return WORK;
        case RESOURCE_GHODIUM_OXIDE:
            return TOUGH;
        default:
            return "ERROR";
    }
}
exports.getBodyPartForBoost = getBodyPartForBoost;
