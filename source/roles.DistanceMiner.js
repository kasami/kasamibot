"use strict";
const EnergyLib = require("./lib.energy");
const PathfindingUtilities = require("./utilities.Pathfinding");
const IntelLib = require("./lib.intel");
function run(creep) {
    let sourcePos;
    if (creep.memory.target.startsWith("$")) {
        sourcePos = getRoomPosForOutpostSource(creep.memory.target);
    }
    else {
        sourcePos = Game.getObjectById(creep.memory.target).pos;
    }
    let dropofbuilding = Game.getObjectById(creep.memory.dropof);
    if (creep.isFinishedDumping()) {
        creep.stopDumping();
        checkIfOutdated(creep);
    }
    if (creep.isFinishedMining()) {
        creep.startDumping();
        requestDropOfId(creep);
        dropofbuilding = Game.getObjectById(creep.memory.dropof);
        setOutdatedTick(creep);
    }
    if (creep.isDumping()) {
        if (Game.time % 10 === 0 && !(dropofbuilding instanceof StructureStorage)) {
            requestDropOfId(creep);
            dropofbuilding = Game.getObjectById(creep.memory.dropof);
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
    }
    else {
        if (sourcePos.roomName !== creep.room.name) {
            creep.travelTo({ pos: sourcePos });
        }
        else {
            let response = creep.harvest(getSourceWithId(creep.memory.target));
            if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_ENOUGH_RESOURCES) {
                creep.travelTo({ pos: sourcePos });
            }
            else if (response === OK) {
                if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
                }
                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
            }
        }
    }
}
exports.run = run;
;
function setOutdatedTick(creep) {
    if (creep.memory.outdatedTick !== undefined) {
        return;
    }
    let storage = Game.rooms[creep.memory.homeroom].storage;
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
function checkIfOutdated(creep) {
    if (creep.memory.outdatedTick === undefined) {
        return false;
    }
    if (creep.memory.outdatedTick > creep.ticksToLive) {
        creep.suicide();
        return true;
    }
    return false;
}
function requestDropOfId(creep) {
    if (creep.memory.target.startsWith("$")) {
        creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.memory.homeroom], creep);
    }
    else {
        creep.memory.dropof = EnergyLib.getBuildingIdForDump(creep.room, creep);
    }
}
function getRoomPosForOutpostSource(target) {
    let roomname = target.substr(1).split("-")[0];
    let sourceid = target.substr(1).split("-")[1];
    let sourcePos = IntelLib.sourcePos(roomname, sourceid);
    return sourcePos;
}
function getSourceWithId(target) {
    if (target.startsWith("$")) {
        return Game.getObjectById(target.substr(1).split("-")[1]);
    }
    else {
        return Game.getObjectById(target);
    }
}
