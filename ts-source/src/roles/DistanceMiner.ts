import * as EnergyLib from "../lib/energy";
import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as IntelLib from "../lib/intel";

export function run(creep: Creep) {
    let sourcePos: RoomPosition;
    if (creep.memory.target.startsWith("$")) {
        sourcePos = getRoomPosForOutpostSource(creep.memory.target);
    } else {
        sourcePos = (Game.getObjectById(creep.memory.target) as Source).pos;
    }
    let dropofbuilding = Game.getObjectById(creep.memory.dropof) as Structure;

    if (creep.isFinishedDumping()) {
        creep.stopDumping();
        checkIfOutdated(creep);
    }

    if (creep.isFinishedMining()) {
        creep.startDumping();
        requestDropOfId(creep);
        dropofbuilding = Game.getObjectById(creep.memory.dropof) as Structure;
        setOutdatedTick(creep);
    }

    if (creep.isDumping()) {
        if (Game.time % 10 === 0 && !(dropofbuilding instanceof StructureStorage)) {
            requestDropOfId(creep);
            dropofbuilding = Game.getObjectById(creep.memory.dropof) as Structure;
        }
        let response = creep.transfer(dropofbuilding, RESOURCE_ENERGY);
        switch (response) {
            case ERR_NOT_IN_RANGE:
                creep.travelTo(dropofbuilding);
                break;
            case ERR_FULL:
                requestDropOfId(creep);
                break;
            default:
                break;
        }
    } else {
        if (sourcePos.roomName !== creep.room.name) {
            creep.travelTo({pos: sourcePos});
        } else {

            let response = creep.harvest(getSourceWithId(creep.memory.target));
            if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_ENOUGH_RESOURCES) {
                creep.travelTo({pos: sourcePos});
            } else
            if (response === OK) {
                if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
                }
                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
            }
        }
    }
};

/**
 * Sets the time when the creep should not start a new haul.
 * Distance from storage to container times two plus 20 %.
 */
function setOutdatedTick(creep: Creep): void {
    if (creep.memory.outdatedTick !== undefined) {
        return;
    }
    let storage = Game.rooms[creep.memory.homeroom].storage as Structure;
    let source = getSourceWithId(creep.memory.target);

    if (storage === undefined || source === undefined) {
        let spawn = creep.room.getSpawn();
        if (spawn === undefined) {
            return;
        }
        storage = spawn;
    }
    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, source.pos);
    creep.memory.outdatedTick = Math.ceil(25 + ((distance * 2) * 1.1));
}

function checkIfOutdated(creep: Creep): boolean {
    if (creep.memory.outdatedTick === undefined) {
        return false;
    }
    if (creep.memory.outdatedTick > creep.ticksToLive) {
        //console.log("DistanceMiner " + creep.name + " dismissed because a trip takes " + creep.memory.outdatedTick + " ticks and it only has " + creep.ticksToLive + " left. " + creep.name + " " + creep.room.name + " (" + creep.memory.target + ")");
        creep.suicide();
        return true;
    }
    return false;
}

function requestDropOfId(creep: Creep): void {
   if (creep.memory.target.startsWith("$")) {
        creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.memory.homeroom], creep);
    } else {
        creep.memory.dropof = EnergyLib.getBuildingIdForDump(creep.room, creep);
    }
}

function getRoomPosForOutpostSource(target: string): RoomPosition {
    let roomname = target.substr(1).split("-")[0];
    let sourceid = target.substr(1).split("-")[1];
    let sourcePos = IntelLib.sourcePos(roomname, sourceid);
    return sourcePos;
}

function getSourceWithId(target: string): Source {
   if (target.startsWith("$")) {
        return Game.getObjectById(target.substr(1).split("-")[1]) as Source;
    } else {
        return Game.getObjectById(target) as Source;
    }
}
