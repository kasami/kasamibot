/**
 * Declarer
 *
 * Used to sign rooms for declaring this as future AYCE property
 *
 * MEMORY
 *   target - target room for either waypoint or for wrecking
 *   route - list of target rooms to be visited
 *
 * STATE
 *   MovingToTarget - Moving to target room
 *   Declaring - Declaring target room as owned
 */

import {log} from "../tools/Logger";

enum State {
    MovingToTarget = 1,
    Declaring = 2
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToTarget);
    }

    switch(creep.getState()) {
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.Declaring:
            runDeclaring(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToTarget);
            break;
    }
};

function runMovingToTarget(creep: Creep): void {
    let targetRoom: string | undefined = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            log.info("Declarer " + creep.name + " has no target room, is being removed.", creep.room.name);
            creep.suicide();
            return;
        }
    }

    if (targetRoom === creep.room.name) {
        creep.setState(State.Declaring);
        runDeclaring(creep);
    } else {
        creep.travelToRoom(targetRoom, {allowHostile: false, allowSK: false, ignoreRoads: true});
    }
}

function runDeclaring(creep: Creep): void {
    if (creep.room.name === creep.memory.target && creep.room.controller !== undefined) {
        let targetController = creep.room.controller;
        if (creep.pos.roomName !== creep.room.name || creep.pos.getRangeTo(targetController) > 1) {
            creep.travelTo(targetController);
        } else {
            let quote = "This room is property of the AYCE alliance. Stay away from this and neighbouring rooms."
            creep.signController(targetController, quote);
            creep.memory.target = undefined;
        }
    } else {
        creep.memory.target = undefined;
        creep.setState(State.MovingToTarget);
    }
}

function getNextTargetRoom(creep: Creep): string | undefined {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.target = creep.memory.route.shift();
    } else {
        creep.memory.target = undefined;
    }
    return creep.memory.target;
}
