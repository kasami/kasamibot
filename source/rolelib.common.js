"use strict";
const PathFindingUtilities = require("./utilities.Pathfinding");
const RoomRepository = require("./repository.Room");
const IntelLib = require("./lib.intel");
function targetRoomHasInvaders(creep, targetRoom) {
    if (targetRoom === creep.getHomeroom()) {
        return false;
    }
    if (IntelLib.hasIntel(targetRoom)) {
        if (IntelLib.hasDangerousHostiles(targetRoom)) {
            if (creep.room.name === targetRoom || (creep.room.name !== targetRoom && (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49))) {
                creep.travelToRoom(creep.getHomeroom(), undefined, true);
            }
            else {
                moveOffRoad(creep);
            }
            return true;
        }
    }
    return false;
}
exports.targetRoomHasInvaders = targetRoomHasInvaders;
function moveHomeAndHealIfHurt(creep) {
    if (creep.hits < creep.hitsMax - 100) {
        if (!creep.isInHomeroom() || (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49)) {
            creep.travelToRoom(creep.getHomeroom());
        }
        else {
            moveOffRoad(creep);
        }
        return true;
    }
    return false;
}
exports.moveHomeAndHealIfHurt = moveHomeAndHealIfHurt;
function getTravelDestinasion(creep) {
    if (creep.memory._travel !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest.roomName !== undefined) {
        return new RoomPosition(creep.memory._travel.dest.x, creep.memory._travel.dest.y, creep.memory._travel.dest.roomName);
    }
    return undefined;
}
exports.getTravelDestinasion = getTravelDestinasion;
function isCloseToSourceKeeper(creep, time = 10, distance = 5) {
    if (!isInSKRoom(creep)) {
        return false;
    }
    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    if (nearby.length > 0) {
        return true;
    }
    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
        } });
    if (lairSpawningSoon.length > 0) {
        return true;
    }
    return false;
}
exports.isCloseToSourceKeeper = isCloseToSourceKeeper;
function positionIsCloseToSourceKeeper(position, time = 2, distance = 6) {
    if (!RoomRepository.isSKRoom(position.roomName) || Game.rooms[position.roomName] === undefined) {
        return false;
    }
    let nearby = position.findInRange(FIND_HOSTILE_CREEPS, 5);
    if (nearby.length > 0) {
        return true;
    }
    let lairSpawningSoon = position.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
        } });
    if (lairSpawningSoon.length > 0) {
        return true;
    }
    return false;
}
exports.positionIsCloseToSourceKeeper = positionIsCloseToSourceKeeper;
function stayAwayFromSourceKeeper(creep, time = 10, distance = 5) {
    if (!isInSKRoom(creep)) {
        return false;
    }
    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    if (nearby.length > 0) {
        if (creep.pos.getRangeTo(nearby[0]) < distance) {
            creep.moveTo(getFleeMove(creep, nearby[0].pos));
        }
        else {
            moveOffRoad(creep);
        }
        return true;
    }
    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
        } });
    if (lairSpawningSoon.length > 0) {
        if (creep.pos.getRangeTo(lairSpawningSoon[0]) < distance) {
            creep.moveTo(getFleeMove(creep, lairSpawningSoon[0].pos));
        }
        else {
            moveOffRoad(creep);
        }
        return true;
    }
    return false;
}
exports.stayAwayFromSourceKeeper = stayAwayFromSourceKeeper;
function moveOffRoad(creep) {
    let atPos = creep.pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_ROAD) {
            let offroadPosition = getOffroadMovePosition(creep);
            creep.moveTo(offroadPosition);
            return true;
        }
    }
    return false;
}
exports.moveOffRoad = moveOffRoad;
function moveRandomDirection(creep) {
    creep.move(getRandomDirection());
}
exports.moveRandomDirection = moveRandomDirection;
function getRandomDirection() {
    let possibleDirections = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
    return possibleDirections[(Math.floor(Math.random() * possibleDirections.length))];
}
function getOffroadMovePosition(creep) {
    let path = PathFinder.search(creep.pos, { pos: creep.pos, range: 10 }, {
        plainCost: 1,
        swampCost: 2,
        flee: true,
        roomCallback: PathFindingUtilities.getOffroadRoomCallback,
        maxRooms: 1
    }).path;
    for (let pos of path) {
        let structs = pos.lookFor(LOOK_STRUCTURES);
        let creeps = pos.lookFor(LOOK_CREEPS);
        if (structs.length === 0 && creeps.length === 0) {
            return pos;
        }
    }
    return path[0];
}
function getFleeMove(creep, position) {
    return PathFinder.search(creep.pos, { pos: position, range: 7 }, {
        plainCost: 1,
        swampCost: 10,
        flee: true,
        roomCallback: PathFindingUtilities.getKitingRoomCallback,
        maxRooms: 1
    }).path[0];
}
function isInSKRoom(creep) {
    return RoomRepository.isSKRoom(creep.room.name);
}
