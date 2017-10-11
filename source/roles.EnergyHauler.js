"use strict";
const EnergyLib = require("./lib.energy");
const PathfindingUtilities = require("./utilities.Pathfinding");
const _Common = require("./rolelib.common");
var State;
(function (State) {
    State[State["Idle"] = 1] = "Idle";
    State[State["Tanking"] = 2] = "Tanking";
    State[State["Dumping"] = 3] = "Dumping";
})(State || (State = {}));
function run(creep) {
    if (_Common.moveHomeAndHealIfHurt(creep)) {
        return;
    }
    if (_Common.isCloseToSourceKeeper(creep)) {
        let dest = _Common.getTravelDestinasion(creep);
        if (dest !== undefined) {
            if (_Common.positionIsCloseToSourceKeeper(dest)) {
                _Common.stayAwayFromSourceKeeper(creep);
            }
            else {
                creep.travelTo({ pos: dest }, { avoidKeepers: true });
            }
        }
        else {
            _Common.stayAwayFromSourceKeeper(creep);
        }
        return;
    }
    if (!creep.hasState()) {
        creep.setState(State.Idle);
    }
    switch (creep.getState()) {
        case State.Idle:
            runIdle(creep);
            break;
        case State.Tanking:
            runTanking(creep);
            break;
        case State.Dumping:
            runDumping(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.Idle);
            break;
    }
}
exports.run = run;
function runIdle(creep) {
    if (creep.memory.sleepUntil !== undefined && creep.memory.sleepUntil > Game.time) {
        _Common.moveOffRoad(creep);
        return;
    }
    let target = getSourceIdForEnergyHauler(creep.getHomeroom(), creep);
    if (target !== undefined) {
        setSourceInfo(creep, target);
        creep.setState(State.Tanking);
    }
    else {
        creep.memory.sleepUntil = Game.time + 5;
    }
}
function runTanking(creep) {
    if (creep.memory.containerPos === undefined || creep.memory.containerPos.roomName === undefined) {
        console.log("EnergyHauler without Containerpos: " + creep.name);
        creep.setState(State.Idle);
        removeSourceInfo(creep);
        return;
    }
    if (_Common.targetRoomHasInvaders(creep, creep.memory.containerPos.roomName)) {
        return;
    }
    let containerPos = new RoomPosition(creep.memory.containerPos.x, creep.memory.containerPos.y, creep.memory.containerPos.roomName);
    if (containerPos.roomName === creep.pos.roomName) {
        let container = Game.getObjectById(creep.memory.container);
        if (container === null) {
            console.log("Error with containerID for Energyhauler" + creep.room.name);
            creep.setState(State.Idle);
            removeSourceInfo(creep);
            return;
        }
        if (creep.pos.getRangeTo(container) > 1) {
            creep.travelTo({ pos: containerPos });
        }
        else {
            creep.withdraw(container, RESOURCE_ENERGY);
            creep.setState(State.Dumping);
            removeSourceInfo(creep);
        }
    }
    else {
        creep.travelTo({ pos: containerPos });
    }
}
function runDumping(creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.setState(State.Idle);
        runIdle(creep);
        return;
    }
    if (creep.memory.dropof === undefined) {
        creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.getHomeroom()], creep);
    }
    let storage = Game.getObjectById(creep.memory.dropof);
    if (creep.memory.dropof === undefined || storage === null) {
        console.log("Error with dropof for energyhauler in room " + creep.getHomeroom());
        creep.memory.dropof = undefined;
        return;
    }
    if (storage.pos.roomName === creep.pos.roomName) {
        let range = creep.pos.getRangeTo(storage);
        if (range > 5) {
            creep.travelTo(storage);
        }
        else if (range > 1) {
            creep.moveTo(storage);
        }
        else {
            creep.transfer(storage, RESOURCE_ENERGY);
            creep.memory.dropof = undefined;
        }
    }
    else {
        creep.travelTo(storage);
    }
}
function removeSourceInfo(creep) {
    creep.memory.container = undefined;
    creep.memory.containerPos = undefined;
    creep.memory.target = undefined;
    creep.memory.dropof = undefined;
}
function setSourceInfo(creep, sourceId) {
    let sourceInfo = Memory.sources[sourceId];
    creep.memory.container = sourceInfo.container;
    if (sourceInfo.containerPos === undefined) {
        console.log("Positioninfo for source missing: " + sourceId);
        let source = Game.getObjectById(sourceId);
        if (source instanceof Source) {
            creep.memory.containerPos = source.getContainerPosition();
        }
    }
    else {
        creep.memory.containerPos = new RoomPosition(sourceInfo.containerPos.x, sourceInfo.containerPos.y, sourceInfo.containerPos.roomName);
    }
    creep.memory.target = sourceId;
    creep.memory.dropof = undefined;
}
function canTravelToSource(creep, sourceId) {
    let sourceInfo = Memory.sources[sourceId];
    if (sourceInfo === undefined || sourceInfo.containerPos === undefined || sourceInfo.containerPos.roomName === undefined) {
        return true;
    }
    let pos = new RoomPosition(sourceInfo.containerPos.x, sourceInfo.containerPos.y, sourceInfo.containerPos.roomName);
    let distance = PathfindingUtilities.getDistanseBetween(creep.pos, pos);
    if (Math.ceil((distance * 2) * 1.2) > creep.ticksToLive) {
        return false;
    }
    return true;
}
function getSourceIdForEnergyHauler(roomName, creep) {
    if (Game.rooms[roomName] === undefined) {
        return undefined;
    }
    let room = Game.rooms[roomName];
    if (room.memory.dumpSources === undefined || room.memory.dumpSources.length === 0) {
        return undefined;
    }
    for (let s of room.memory.dumpSources) {
        if (canTravelToSource(creep, s)) {
            _.remove(room.memory.dumpSources, (id) => id === s);
            return s;
        }
    }
    creep.suicide();
    return undefined;
}
