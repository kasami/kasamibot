import * as EnergyLib from "../lib/energy";
import * as PathfindingUtilities from "../utilities/Pathfinding";
import * as _Common from "../rolelib/common";

import * as RoomRepository from "../repository/Room";

import {RoomLevel} from "../enums/roomlevel";

enum State {
    Tanking = 1,
    Dumping = 2
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.Tanking);
    }

    switch(creep.getState()) {
        case State.Tanking:
            runTanking(creep);
            break;
        case State.Dumping:
            runDumping(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.Tanking);
            break;
    }
}

function runTanking(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.setState(State.Dumping);
        runDumping(creep);
        return;
    }

    checkIfOutdated(creep);

    if (creep.memory.targetRoom === undefined) {
        getTargetRoom(creep);
    }

    if (_Common.targetRoomHasInvaders(creep, creep.memory.targetRoom) || _Common.stayAwayFromSourceKeeper(creep)) {
        return;
    }

    let container = Game.getObjectById(creep.memory.container) as Container;

    if (container === null) {
        if (creep.room.name === creep.memory.targetRoom) {
            if (!setMyContainer(creep)) {
                return;
            }
        } else {
            if (creep.memory.targetSource === undefined) {
                getTargetSource(creep);
            }
            if (creep.memory.targetSourcePos === undefined) {
                getTargetSourcePos(creep, creep.memory.targetSource);
            }
            if (creep.memory.targetSourcePos !== undefined) {
                creep.travelTo({pos: new RoomPosition(creep.memory.targetSourcePos.x, creep.memory.targetSourcePos.y, creep.memory.targetSourcePos.roomName)});
            } else {
                creep.travelToRoom(creep.memory.targetRoom);
            }
            return;
        }
    }
    let response = creep.withdraw(container, RESOURCE_ENERGY);
    if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
        creep.travelTo(container);
    } else
    if (response === ERR_NOT_ENOUGH_RESOURCES) {
        creep.setState(State.Dumping);
        runDumping(creep);
    }
}

function runDumping(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.setState(State.Tanking)
        return;
    }
    if (creep.memory.targetRoom === undefined) {
        getTargetRoom(creep);
    }

    setOutdatedTick(creep);

    if (creep.memory.dropof === undefined) {
        setMyDropof(creep);
    }

    let storage = Game.getObjectById(creep.memory.dropof) as Structure;
    if (!(storage instanceof StructureContainer) && Game.time % 3 === 0 && Game.rooms[creep.memory.homeroom] instanceof Room && RoomRepository.getRoomLevel(Game.rooms[creep.memory.homeroom]) < RoomLevel.CivilizedColony) {
        setMyDropof(creep);
    }
    if (!(storage instanceof Structure)) {
        setMyDropof(creep);
        storage = Game.getObjectById(creep.memory.dropof) as Structure;
    }

    let response = creep.transfer(storage, RESOURCE_ENERGY);

    if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
        creep.travelTo(storage);
    } else
    if (response === ERR_FULL) {
        setMyDropof(creep);
    }
}

function setMyContainer(creep: Creep): boolean {
    if (creep.memory.targetSource === undefined) {
        getTargetSource(creep);
    }
    let container = (Game.getObjectById(creep.memory.targetSource) as Source).getMiningContainer();
    if (container === null) {
        return false;
    }
    creep.memory.container = container.id;
    return true;
}

function setMyDropof(creep: Creep): void {
    creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.memory.homeroom], creep);
}

/**
 * Sets the time when the creep should not start a new haul.
 * Distance from storage to container times two plus 20 %.
 */
function setOutdatedTick(creep: Creep): void {
    if (creep.memory.outdatedTick !== undefined) {
        return;
    }
    let storage = Game.rooms[creep.memory.homeroom].storage as Structure;
    let container = Game.getObjectById(creep.memory.container) as Container;

    if (storage === undefined) {
        let spawn = creep.room.getSpawn();
        if (spawn === undefined) {
            return;
        }
        storage = spawn;
    }
    if (storage.pos === undefined || container === null || container.pos === undefined) {
        return;
    }
    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, container.pos);
    creep.memory.outdatedTick = Math.ceil((distance * 2) * 1.2);
}

function checkIfOutdated(creep: Creep): boolean {
    if (creep.memory.outdatedTick === undefined) {
        return false;
    }
    if (creep.memory.outdatedTick > creep.ticksToLive) {
        //console.log("ContainerHauler " + creep.name + " dismissed because a trip takes " + creep.memory.outdatedTick + " ticks and it only has " + creep.ticksToLive + " left. " + creep.name + " " + creep.room.name + "(" + creep.memory.container + ")");
        creep.suicide();
        return true;
    }
    return false;
}

function getTargetRoom(creep: Creep): void {
    creep.memory.targetRoom = creep.memory.target.split("-")[0];
}

function getTargetSource(creep: Creep): void {
    creep.memory.targetSource = creep.memory.target.split("-")[1];
}

function getTargetSourcePos(creep: Creep, sourceId: string): void {
    if (Memory.sources[sourceId] !== undefined && Memory.sources[sourceId].containerPos && Memory.sources[sourceId].containerPos.x !== undefined &&
    Memory.sources[sourceId].containerPos.y !== undefined && Memory.sources[sourceId].containerPos.roomName !== undefined) {
        creep.memory.targetSourcePos = new RoomPosition(Memory.sources[sourceId].containerPos.x, Memory.sources[sourceId].containerPos.y, Memory.sources[sourceId].containerPos.roomName);
    }
}
