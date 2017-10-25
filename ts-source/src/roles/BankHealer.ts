/**
 * BankHealer
 *
 * Used to heal BankAttacker while destroying PowerBanks.
 *
 * MEMORY
 *   target - id for powerbank to destroy
 *   targetToHeal - id for bankattacker to heal
 *
 * STATE
 *   MovingToBankRoom - Moving to the room with the bank
 *   FindingTargetToHeal - Finding a target to heal
 *   MovingToTargetToHeal - Moving to the target to heal
 *   HealingTarget - Is healing the target when needed
 */

import * as _BankRobbers from "../rolelib/bankrobbers";

import {Role} from "../enums/role";
import {log} from "../tools/Logger";

enum State {
    MovingToBankRoom = 1,
    FindingTargetToHeal = 2,
    MovingToTargetToHeal = 3,
    HealingTarget = 4
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MovingToBankRoom);
    }

    switch(creep.getState()) {
        case State.MovingToBankRoom:
            runMoveToBankRoom(creep);
            break;
        case State.FindingTargetToHeal:
            runFindingTargetToHeal(creep);
            break;
        case State.MovingToTargetToHeal:
            runMovingToTargetToHeal(creep);
            break;
        case State.HealingTarget:
            runHealingTarget(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBankRoom);
            break;
    }
}

function runMoveToBankRoom(creep: Creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);

    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 5) {
        creep.travelTo({pos: bankPosition}, {preferHighway: true, allowHostile: false});
    } else {
        creep.setState(State.FindingTargetToHeal);
        runFindingTargetToHeal(creep);
    }
}

function runFindingTargetToHeal(creep: Creep) {
    if (Game.time % 5 === 0) {
        let targetToHeal = getTargetToHeal(creep);

        if (targetToHeal instanceof Creep) {
            creep.memory.targetToHeal = targetToHeal.id;
            targetToHeal.memory.healer = creep.id;
            creep.setState(State.MovingToTargetToHeal);
            runMovingToTargetToHeal(creep);
        }
    }
}

function runMovingToTargetToHeal(creep: Creep) {
    let targetToHeal = getTargetToHeal(creep);
    if (targetToHeal !== null) {
        if (creep.pos.getRangeTo(targetToHeal) > 1) {
            creep.travelTo(targetToHeal);
        } else {
            targetToHeal.memory.healerInPosition = true;
            creep.setState(State.HealingTarget);
            runHealingTarget(creep);
        }
    } else {
        creep.setState(State.FindingTargetToHeal);
    }
}

function runHealingTarget(creep: Creep) {
    let targetToHeal = getTargetToHeal(creep);
    if (targetToHeal !== null) {
        creep.heal(targetToHeal);
    } else {
        creep.suicide();
    }
}

function getTargetToHeal(creep: Creep): Creep | null {
    if (creep.memory.targetToHeal !== undefined) {
        return Game.getObjectById(creep.memory.targetToHeal) as Creep;
    }

    let targetToHeal = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: function(c: Creep) {
        return c.memory.role === Role.BankAttacker && c.memory.healerInPosition === undefined && c.ticksToLive > 300;
    }}) as Creep;

    if (targetToHeal instanceof Creep) {
        return targetToHeal;
    }
    return null;
}
