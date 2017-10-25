/**
 * BankRanger
 *
 * Used for attacking PowerBanks, with focus on protecting the room and haulers.
 *
 * MEMORY
 *   target - id for powerbank to destroy
 *   hostileTarget - id for hostile target to attack
 *
 * STATE
 *   MovingToBank - Moving to the bank
 *   AttackingBank - Attacking the bank
 *   DefendingBankroom - Defending bankroom from enemies
 */

import * as _Military from "../rolelib/military";
import * as _Targeting from "../rolelib/targeting";
import * as _BankRobbers from "../rolelib/bankrobbers";

import {log} from "../tools/Logger";

enum State {
    MovingToBank = 1,
    AttackingBank = 2,
    DefendingBankroom = 3
}

export function run(creep: Creep) {
    healIfNeeded(creep);

    if (!creep.hasState()) {
        creep.setState(State.MovingToBank);
    }

    switch(creep.getState()) {
        case State.MovingToBank:
            runMoveToBank(creep);
            break;
        case State.AttackingBank:
            runAttackingBank(creep);
            break;
        case State.DefendingBankroom:
            runDefendingBankroom(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBank);
            break;
    }
}

function runMoveToBank(creep: Creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);

    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 3) {
        creep.travelTo({pos: bankPosition}, {preferHighway: true, allowHostile: false});
    } else {
        creep.setState(State.AttackingBank);
        runAttackingBank(creep);
    }
}

function runAttackingBank(creep: Creep) {

    if (Game.time % 13 === 0) {
        if (checkForHostiles(creep)) {
            creep.setState(State.DefendingBankroom);
            runDefendingBankroom(creep);
            return;
        }
    }

    let bank = getBank(creep);
    if (bank !== null) {
        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
            creep.rangedAttack(bank);
        }
    } else {
        // TODO: Protect haulers
    }
}

function runDefendingBankroom(creep: Creep) {
    if (Game.time % 5 === 0) {
        checkForHostiles(creep);
    }

    let target = Game.getObjectById(creep.memory.hostileTarget) as Creep | null;
    if (target === null) {
        creep.memory.hostileTarget = undefined;
        creep.setState(State.MovingToBank);
        runMoveToBank(creep);
        return;
    }

    _Military.kiteAndAttack(creep, target);
}

function healIfNeeded(creep: Creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }
}

function getBank(creep: Creep): StructurePowerBank | null {
    return Game.getObjectById(creep.memory.target) as StructurePowerBank;
}

function checkForHostiles(creep: Creep): boolean {
    let target = _Targeting.getPrioritizedTarget(creep);
    if (target !== null) {
        creep.memory.hostileTarget = target.id;
        return true;
    }
    return false;
}
