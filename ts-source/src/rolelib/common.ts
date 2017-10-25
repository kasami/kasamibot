/**
 * Common is used for instructions that is commonly used by multiple creeps
 */

import * as PathFindingUtilities from "../utilities/Pathfinding";
import * as RoomRepository from "../repository/Room";

import * as IntelLib from "../lib/intel";


export function targetRoomHasInvaders(creep: Creep, targetRoom: string): boolean {
    if (targetRoom === creep.getHomeroom()) {
        return false;
    }
    if (IntelLib.hasIntel(targetRoom)) {
        if (IntelLib.hasDangerousHostiles(targetRoom)) {
            if (creep.room.name === targetRoom || (creep.room.name !== targetRoom && (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49))) {
                creep.travelToRoom(creep.getHomeroom(), undefined, true);
            } else {
                moveOffRoad(creep);
            }
            return true;
        }
    }
    return false;
}

export function moveHomeAndHealIfHurt(creep: Creep): boolean {
    if (creep.hits < creep.hitsMax - 100) {
        if (!creep.isInHomeroom() || (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49)) {
            creep.travelToRoom(creep.getHomeroom());
        } else {
            moveOffRoad(creep);
        }
        return true;
    }
    return false;
}

export function getTravelDestinasion(creep: Creep): RoomPosition | undefined {
    if (creep.memory._travel !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest.roomName !== undefined) {
        return new RoomPosition(creep.memory._travel.dest.x, creep.memory._travel.dest.y, creep.memory._travel.dest.roomName);
    }
    return undefined;
}

export function isCloseToSourceKeeper(creep: Creep, time: number = 10, distance: number = 5):boolean {

    if (!isInSKRoom(creep)) {
        return false;
    }
    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5) as Creep[];
    if (nearby.length > 0) {
        return true;
    }
    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, {filter: function (l: StructureKeeperLair) {
        return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
    }}) as StructureKeeperLair[];
    if (lairSpawningSoon.length > 0) {
        return true;
    }
    return false;
}

export function positionIsCloseToSourceKeeper(position: RoomPosition, time: number = 2, distance: number = 6):boolean {
    if (!RoomRepository.isSKRoom(position.roomName) || Game.rooms[position.roomName] === undefined) {
        return false;
    }
    let nearby = position.findInRange(FIND_HOSTILE_CREEPS, 5) as Creep[];
    if (nearby.length > 0) {
        return true;
    }
    let lairSpawningSoon = position.findInRange(FIND_HOSTILE_STRUCTURES, distance, {filter: function (l: StructureKeeperLair) {
        return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
    }}) as StructureKeeperLair[];
    if (lairSpawningSoon.length > 0) {
        return true;
    }
    return false;
}



export function stayAwayFromSourceKeeper(creep: Creep, time: number = 10, distance: number = 5):boolean {

    if (!isInSKRoom(creep)) {
        return false;
    }
    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5) as Creep[];
    if (nearby.length > 0) {
        if (creep.pos.getRangeTo(nearby[0]) < distance) {
            creep.moveTo(getFleeMove(creep, nearby[0].pos));
        } else {
            moveOffRoad(creep);
        }
        return true;
    }
    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, {filter: function (l: StructureKeeperLair) {
        return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
    }}) as StructureKeeperLair[];
    if (lairSpawningSoon.length > 0) {
        if (creep.pos.getRangeTo(lairSpawningSoon[0]) < distance) {
            creep.moveTo(getFleeMove(creep, lairSpawningSoon[0].pos));
        } else {
            moveOffRoad(creep);
        }
        return true;
    }
    return false;
}

export function moveOffRoad(creep: Creep): boolean {
    let atPos = creep.pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_ROAD) {
            let offroadPosition = getOffroadMovePosition(creep);
            creep.moveTo(offroadPosition);
            return true;
        }
    }
    return false;
}

export function moveRandomDirection(creep: Creep) {
    creep.move(getRandomDirection());
}

function getRandomDirection() {
    let possibleDirections = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
    return possibleDirections[(Math.floor(Math.random() * possibleDirections.length))];
}

function getOffroadMovePosition(creep: Creep): RoomPosition {
    let path = PathFinder.search(creep.pos, {pos: creep.pos, range: 10},
    {
        plainCost: 1,
        swampCost: 2,
        flee: true,
        roomCallback: PathFindingUtilities.getOffroadRoomCallback,
        maxRooms: 1
    }).path;
    for (let pos of path) {
        let structs = pos.lookFor(LOOK_STRUCTURES) as Structure[];
        let creeps = pos.lookFor(LOOK_CREEPS) as Structure[];
        if (structs.length === 0 && creeps.length === 0) {
            return pos;
        }
    }
    return path[0];
}

function getFleeMove(creep: Creep, position: RoomPosition): RoomPosition {
    return PathFinder.search(creep.pos, {pos: position, range: 7},
    {
        plainCost: 1,
        swampCost: 10,
        flee: true,
        roomCallback: PathFindingUtilities.getKitingRoomCallback,
        maxRooms: 1
    }).path[0];
}

function isInSKRoom(creep: Creep): boolean {
    return RoomRepository.isSKRoom(creep.room.name);
}
