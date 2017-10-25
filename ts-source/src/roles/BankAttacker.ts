/**
 * BankAttacker
 *
 * Used together with BankHealer to destroy PowerBanks.
 *
 * MEMORY
 *   target - id for powerbank to destroy
 *   healerInPosition - indicates when a healer is ready
 *
 * STATE
 *   MovingToBankRoom - Moving to the room with the bank
 *   MovingToAttackPosition - Moving close to bank
 *   WaitingForHealer - Waiting for dedicated healer to be in position
 *   DestroyingBank - Is attacking the PowerBank
 */

import * as _BankRobbers from "../rolelib/bankrobbers";

import {log} from "../tools/Logger";

enum State {
    MovingToBankRoom = 1,
    MovingToAttackPosition = 2,
    WaitingForHealer = 3,
    DestroyingBank = 4
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToBankRoom);
    }

    switch(creep.getState()) {
        case State.MovingToBankRoom:
            runMoveToBankRoom(creep);
            break;
        case State.MovingToAttackPosition:
            runMoveToBank(creep);
            break;
        case State.WaitingForHealer:
            runWaitingForHealer(creep);
            break;
        case State.DestroyingBank:
            runDestroyingBank(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBankRoom);
            break;
    }
}

function runMoveToBankRoom(creep: Creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);

    if (creep.room.name !== bankPosition.roomName) {
        creep.travelTo({pos: bankPosition}, {allowHostile: false, preferHighway: true});
    } else {
        creep.setState(State.MovingToAttackPosition);
        runMoveToBank(creep);
    }
}

function runMoveToBank(creep: Creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);

    if (creep.pos.getRangeTo(bankPosition) > 1) {
        creep.moveTo({pos: bankPosition});
    } else {
        creep.setState(State.WaitingForHealer);
        runWaitingForHealer(creep);
    }
}

function runWaitingForHealer(creep: Creep) {
    if (creep.memory.healerInPosition) {
        creep.setState(State.DestroyingBank);
        runDestroyingBank(creep);
    }
}

function runDestroyingBank(creep: Creep) {
    let bank = getBank(creep);
    if (bank !== null) {
        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
            creep.attack(bank);
        }
    } else {
        creep.suicide();
    }
}

function getBank(creep: Creep): StructurePowerBank | null {
    return Game.getObjectById(creep.memory.target) as StructurePowerBank;
}
