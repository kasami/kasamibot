/**
 * OutpostSupporter
 *
 * Used to defend outposts around a room together with an OutpostDefender
 *
 */

import {State as DefenderState} from "../roles/OutpostDefender";

import * as _Common from "../rolelib/common";

import * as PositionLib from "../lib/position";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    Standby = 1,
    FollowingDefender = 2,
}

export function run(creep: Creep) {
    creep.notifyWhenAttacked(false);

    if (!creep.hasState()) {
        creep.setState(State.Standby);
    }

    switch(creep.getState()) {
        case State.Standby:
            runStandby(creep);
            break;
        case State.FollowingDefender:
            runFollowingDefender(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Standby);
            break;
    }
};

function runFollowingDefender(creep: Creep): void {
    let defender = getDefender(creep);
    if (defender === undefined) {
        creep.setState(State.Standby);
        return;
    }

    if (defender.getState() == DefenderState.Standby) {
        creep.setState(State.Standby);
        return;
    }

    let targetEnemy = getTargetEnemy(defender);
    if (creep.getActiveBodyparts(ATTACK) === 0) {
        creep.moveTo(defender);
    } else
    if (targetEnemy !== undefined && targetEnemy.pos.roomName === creep.pos.roomName && defender.pos.roomName === creep.pos.roomName) {
        if (creep.pos.getRangeTo(targetEnemy) === 1) {
            creep.moveTo(targetEnemy.pos, {ignoreCreeps: true});
        } else {
            creep.moveTo(targetEnemy);
        }
    } else {
        creep.travelTo(defender);
    }
    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) === 1) {
        creep.say("Yeeha!");
        creep.attack(targetEnemy);
    }
}

function runStandby(creep: Creep): void {
    let defender = getDefender(creep);
    if (defender === undefined) {
        defender = findDefenderToHeal(creep);
    }
    if (defender !== undefined) {
        let state = defender.getState();
        if (state !== DefenderState.Standby) {
            creep.setState(State.FollowingDefender);
            runFollowingDefender(creep);
            return;
        }
    }

    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
        creep.travelToRoom(homeroom, {allowHostile: false});
        return;
    }

    _Common.moveOffRoad(creep);
}

function getDefender(creep: Creep): Creep | undefined {
    let defender = Game.getObjectById(creep.memory.defender) as Creep;
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    return defender;
}

function getTargetEnemy(defender: Creep): Creep | Structure | undefined {
    let targetEnemy = Game.getObjectById(defender.memory.targetEnemy) as Creep | Structure | null;
    if (targetEnemy === null) {
        return undefined;
    }
    return targetEnemy;
}

function findDefenderToHeal(creep: Creep): Creep | undefined {
    let defenders = creep.room.find(FIND_MY_CREEPS, {filter: function(c: Creep) {
        return c.memory.role === Role.OutpostDefender && c.memory.warrior === undefined;
    }}) as Creep[];
    if (defenders.length > 0) {
        creep.memory.defender = defenders[0].id;
        defenders[0].memory.warrior = creep.id;
        return defenders[0];
    }
    return undefined;
}
