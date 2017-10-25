/**
 * OutpostSupporter
 *
 * Used to defend outposts around a room together with an OutpostDefender
 *
 */

import {State as DefenderState} from "../roles/OutpostDefender";

import * as _Military from "../rolelib/military";
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

    let hasHealed = healIfNeeded(creep);

    switch(creep.getState()) {
        case State.Standby:
            runStandby(creep);
            break;
        case State.FollowingDefender:
            if (!hasHealed) {
                creep.heal(creep);
            }
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
    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) <= 3) {
        creep.rangedAttack(targetEnemy);
    } else {
        _Military.rangedAttackToEnemiesAround(creep);
    }

    if (creep.pos.getRangeTo(defender) === 1) {
        creep.moveTo(defender.pos, {ignoreCreeps: true});
    } else {
        creep.travelTo(defender);
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

function healIfNeeded(creep: Creep): boolean {
    if (creep.getActiveBodyparts(HEAL) < 1) {
        return true;
    }
    let defender = getDefender(creep);
    let warrior = getWarrior(creep);

    let lowestHp = creep;

    if (defender !== undefined && creep.pos.getRangeTo(defender) < 4 && defender.missingHits() > lowestHp.missingHits()) {
        lowestHp = defender;
    }
    if (warrior !== undefined && creep.pos.getRangeTo(warrior) < 4 && warrior.missingHits() > lowestHp.missingHits()) {
        lowestHp = warrior;
    }

    if (lowestHp.missingHits() > 0) {
        creep.heal(lowestHp);
        return true;
    }
    return false;
}

function getDefender(creep: Creep): Creep | undefined {
    let defender = Game.getObjectById(creep.memory.defender) as Creep;
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    return defender;
}

function getWarrior(creep: Creep): Creep | undefined {
    let defender = Game.getObjectById(creep.memory.defender) as Creep;
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    let warrior = Game.getObjectById(defender.memory.warrior) as Creep;
    if (warrior === null) {
        return undefined;
    }
    return warrior;
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
        return c.memory.role === Role.OutpostDefender && c.memory.supporter === undefined;
    }}) as Creep[];
    if (defenders.length > 0) {
        creep.memory.defender = defenders[0].id;
        defenders[0].memory.supporter = creep.id;
        return defenders[0];
    }
    return undefined;
}
