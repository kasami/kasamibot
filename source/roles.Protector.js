"use strict";
const Logger_1 = require("./tools.Logger");
const BaseLib = require("./lib.base");
const RoomRepository = require("./repository.Room");
var State;
(function (State) {
    State[State["MoveToPosition"] = 1] = "MoveToPosition";
    State[State["Fortify"] = 2] = "Fortify";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MoveToPosition);
    }
    switch (creep.getState()) {
        case State.MoveToPosition:
            runMoveToPosition(creep);
            break;
        case State.Fortify:
            runFortify(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MoveToPosition);
            break;
    }
}
exports.run = run;
function runMoveToPosition(creep) {
    let basepos = RoomRepository.getBasePosition(creep.room);
    if (basepos === undefined) {
        console.log("Error with roomposition, Protector do not know where to move: " + creep.room.name);
        creep.disable();
        return;
    }
    let position = new RoomPosition(basepos.x, basepos.y + 2, basepos.roomName);
    if (creep.pos.getRangeTo(position) > 0) {
        creep.moveTo(position);
    }
    else {
        creep.setState(State.Fortify);
        return;
    }
}
function runFortify(creep) {
    if (creep.room.storage === undefined) {
        console.log("Error with storage, Protector can not tank: " + creep.room.name);
        creep.disable();
        return;
    }
    if (creep.carry[RESOURCE_ENERGY] < (creep.getActiveBodyparts(WORK) * 2)) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }
    let target = getTargetWall(creep);
    if (target !== null) {
        let response = creep.repair(target);
        if (response === OK) {
            if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
                Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
            }
            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
        }
    }
}
function getTargetWall(creep) {
    if (creep.memory.freq === undefined) {
        creep.memory.freq = Math.floor(Math.random() * 50) + 100;
    }
    let wall = Game.getObjectById(creep.memory.wallid);
    if (wall === null || Game.time % creep.memory.freq === 0) {
        wall = getMostDamagedWall(creep);
        if (wall !== null) {
            creep.memory.wallid = wall.id;
        }
    }
    return wall;
}
function getMostDamagedWall(creep) {
    let walls = BaseLib.getFortressRamparts(creep.room);
    let wall = null;
    let wallHP = WALL_HITS_MAX;
    for (let s of walls) {
        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
            if (s.hits < wallHP) {
                wall = s;
                wallHP = s.hits;
            }
        }
    }
    return wall;
}
