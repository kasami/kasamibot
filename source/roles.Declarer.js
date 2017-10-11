"use strict";
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToTarget"] = 1] = "MovingToTarget";
    State[State["Declaring"] = 2] = "Declaring";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToTarget);
    }
    switch (creep.getState()) {
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.Declaring:
            runDeclaring(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToTarget);
            break;
    }
}
exports.run = run;
;
function runMovingToTarget(creep) {
    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            Logger_1.log.info("Declarer " + creep.name + " has no target room, is being removed.", creep.room.name);
            creep.suicide();
            return;
        }
    }
    if (targetRoom === creep.room.name) {
        creep.setState(State.Declaring);
        runDeclaring(creep);
    }
    else {
        creep.travelToRoom(targetRoom, { allowHostile: false, allowSK: false, ignoreRoads: true });
    }
}
function runDeclaring(creep) {
    if (creep.room.name === creep.memory.target && creep.room.controller !== undefined) {
        let targetController = creep.room.controller;
        if (creep.pos.roomName !== creep.room.name || creep.pos.getRangeTo(targetController) > 1) {
            creep.travelTo(targetController);
        }
        else {
            let quote = "This room is property of the AYCE alliance. Stay away from this and neighbouring rooms.";
            creep.signController(targetController, quote);
            creep.memory.target = undefined;
        }
    }
    else {
        creep.memory.target = undefined;
        creep.setState(State.MovingToTarget);
    }
}
function getNextTargetRoom(creep) {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.target = creep.memory.route.shift();
    }
    else {
        creep.memory.target = undefined;
    }
    return creep.memory.target;
}
