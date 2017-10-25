/**
 * TeamHealer
 *
 * Used in teams with other creeps, always moving towards him and healing either the
 * teammate or himself.
 *
 * MEMORY
 *   teammate - id for teammate
 *
 * STATE
 *   Waiting - Waiting for teammate to spawn
 *   Moving - Moving to teammate
 */

import * as _Common from "../rolelib/common";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    Waiting = 1,
    Moving = 2
}

export function run(creep: Creep) {
    creep.notifyWhenAttacked(false);

    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }

    switch(creep.getState()) {
        case State.Waiting:
            runIdle(creep);
            break;
        case State.Moving:
            runMoving(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
};

function runIdle(creep: Creep): void {
    let teammate = findPossibleTeammate(creep);

    if (teammate instanceof Creep) {
        creep.memory.teammate = teammate.id;
        teammate.memory.healer = creep.id;
        creep.setState(State.Moving);
        runMoving(creep);
    } else {
        healSelf(creep);
        _Common.moveOffRoad(creep);
    }
}

function runMoving(creep: Creep) {
    let teammate = getTeammate(creep);

    if (teammate instanceof Creep) {
        let rangeToTeammate = creep.pos.getRangeTo(teammate.pos);
        moveToTeammate(creep, teammate, rangeToTeammate);
        healSelfOrTeammate(creep, teammate, rangeToTeammate)

    } else {
        log.error("TeamHealer " + creep.name + " seems to have lost it's teammate.", creep.room.name);
        creep.memory.teammate = undefined;
        creep.setState(State.Waiting);
    }
}

function healSelf(creep: Creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }
}

function healSelfOrTeammate(creep: Creep, teammate: Creep, range: number) {
    if (range > 3) {
        creep.heal(creep);
    } else {
        if (getMissingHitpoints(creep) > getMissingHitpoints(teammate)) {
            creep.heal(creep);
        } else {
            if (range > 1) {
                creep.rangedHeal(teammate);
            } else {
                creep.heal(teammate);
            }
        }
    }
}

function moveToTeammate(creep: Creep, teammate: Creep, range: number) {
    if (creep.memory.doNotMove === true) {
        creep.memory.doNotMove = undefined;
        return;
    }
    if (range > 1) {
        creep.moveTo(teammate);
    } else {
        if (teammate.fatigue === 0) {
            creep.moveTo(teammate.pos, {ignoreCreeps: true});
        }
    }
}

function getTeammate(creep: Creep): Creep | null {
    let teammate = Game.getObjectById(creep.memory.teammate) as Creep;
    return teammate;
}

function findPossibleTeammate(creep: Creep): Creep | null {
    let possibleTeammates = creep.room.find(FIND_MY_CREEPS, {filter:
        function(c: Creep) {
            return (c.memory.role === Role.TeamWrecker || c.memory.role === Role.TeamWarrior) &&
            c.memory.healer === undefined;
        }
    }) as Creep[];
    if (possibleTeammates.length > 0) {
        return possibleTeammates[0];
    }
    return null;
}

function getMissingHitpoints(creep: Creep): number {
    return creep.hitsMax - creep.hits;
}
