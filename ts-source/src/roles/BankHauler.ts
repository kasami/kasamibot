/**
 * BankHauler
 *
 * Used to move power from destroyed PowerBanks back to base.
 *
 * MEMORY
 *   target - id for powerbank to destroy
 *   healerInPosition - indicates when a healer is ready
 *
 * STATE
 *   MovingToBankPosition - Moving to the position of the bank
 *   WaitForPower - Waiting for the bank to be destroyed
 *   PickUpPower - Pick up power
 *   ReturnToBase - Return to base with power
 */

import * as _BankRobbers from "../rolelib/bankrobbers";

import {log} from "../tools/Logger";

enum State {
    MovingToBankPosition = 1,
    WaitForPower = 2,
    PickUpPower = 3,
    ReturnToBase = 4
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MovingToBankPosition);
    }

    switch(creep.getState()) {
        case State.MovingToBankPosition:
            runMovingToBankPosition(creep);
            break;
        case State.WaitForPower:
            runWaitForPower(creep);
            break;
        case State.PickUpPower:
            runPickUpPower(creep);
            break;
        case State.ReturnToBase:
            runReturnToBase(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBankPosition);
            break;
    }
}

function runMovingToBankPosition(creep: Creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);

    if (creep.room.name !== bankPosition.roomName || creep.isAtBorder() || creep.pos.getRangeTo(bankPosition) > 7) {
        creep.travelTo({pos: bankPosition}, {preferHighway: true, allowHostile: false});
    } else {
        creep.setState(State.WaitForPower);
        runWaitForPower(creep);
    }
}


function runWaitForPower(creep: Creep) {
    let bank = Game.getObjectById(creep.memory.target) as StructurePowerBank;
    if (bank === null) {
        creep.setState(State.PickUpPower);
        runPickUpPower(creep);
    }
}

function runPickUpPower(creep: Creep) {
    if (creep.carry.power === creep.carryCapacity) {
        creep.setState(State.ReturnToBase);
        runReturnToBase(creep);
    } else {
        let powerStack = getPowerStackInRoom(creep);

        if (powerStack !== null) {
            if (creep.pos.getRangeTo(powerStack) === 1) {
                creep.pickup(powerStack);
            } else {
                if (creep.fatigue === 0) {
                    creep.moveTo(powerStack);
                }
            }
        } else
        if (creep.carry.power > 0) {
            creep.setState(State.ReturnToBase);
            runReturnToBase(creep);
        } else {
            creep.suicide();
        }
    }
}

function runReturnToBase(creep: Creep) {
    if (creep.carry === undefined || creep.carry.power === undefined) {
        creep.suicide();
    }

    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom.storage !== undefined) {
        if (creep.room.name === homeroom.name && creep.pos.getRangeTo(homeroom.storage) === 1) {
            creep.transfer(homeroom.storage, RESOURCE_POWER);
        } else {
            creep.travelTo(homeroom.storage, {preferHighway: true});
        }
    } else {
        log.error("BankHauler " + creep.name + " is missing homeroom or storage in home room", creep.memory.homeroom);
    }
}


function getPowerStackInRoom(creep: Creep): Resource | null {
    let powerStacks = creep.room.find(FIND_DROPPED_RESOURCES, {filter: function(r: Resource) {
        return r.resourceType === RESOURCE_POWER;
    }}) as Resource[];
    if (powerStacks !== undefined && powerStacks.length > 0) {
        return powerStacks[0];
    } else {
        return null;
    }
}
