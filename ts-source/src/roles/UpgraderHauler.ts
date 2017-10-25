/**
 * UpgraderHauler
 *
 * Used to move energy to upgraders
 *
 * MEMORY
 *   upgrader - id for creep to give energy
 *
 */

import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as _Common from "../rolelib/common";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    TankUp = 1,
    GiveEnergyToCreep = 2,
    DropEnergyInContainer = 3
}


export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUp);
    }

    switch(creep.getState()) {
        case State.TankUp:
            runTankUp(creep);
            break;
        case State.GiveEnergyToCreep:
            runGiveEnergyToCreep(creep);
            break;
        case State.DropEnergyInContainer:
            runDropEnergyInContainer(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.TankUp);
            break;
    }
}

function runTankUp(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity &&
    creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);

        if (creep.room.storage.store[RESOURCE_ENERGY] < 2000) {
            return;
        }

        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        } else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    } else {
        if ((creep.room.controller as Controller).hasContainer()) {
            creep.setState(State.DropEnergyInContainer);
            runDropEnergyInContainer(creep);
        } else {
            creep.setState(State.GiveEnergyToCreep);
            runGiveEnergyToCreep(creep);
        }
    }
}

function runGiveEnergyToCreep(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.TankUp);
        runTankUp(creep);
        return;
    }

    let upgrader = Game.getObjectById(creep.memory.upgrader) as Creep | null;
    if (upgrader === null || upgrader.carry.energy > upgrader.carryCapacity - 50) {
        creep.memory.upgrader = undefined;
        upgrader = findUpgraderToProvide(creep);
    }


    if (upgrader === null) {
        if (creep.room.controller === undefined) {
            _Common.moveOffRoad(creep);
            return;
        }
        let rangeToController = creep.pos.getRangeTo(creep.room.controller);
        if (rangeToController > 5) {
            creep.travelTo(creep.room.controller)
        } else {
            _Common.moveOffRoad(creep);
        }
        return;
    }

    let distanceToUpgrader = creep.pos.getRangeTo(upgrader.pos);

    if (distanceToUpgrader > 1) {
        creep.moveTo(upgrader);
    } else {
        creep.transfer(upgrader, RESOURCE_ENERGY);
        creep.memory.upgrader = undefined;
    }

}


function runDropEnergyInContainer(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.TankUp);
        runTankUp(creep);
        return;
    }

    let container = (creep.room.controller as Controller).getContainer();
    if (container === undefined) {
        creep.setState(State.GiveEnergyToCreep);
        runGiveEnergyToCreep(creep);
        return;
    }

    let distanceToUpgrader = creep.pos.getRangeTo(container.pos);

    if (distanceToUpgrader > 1) {
        creep.moveTo(container);
    } else {
        if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
            creep.transfer(container, RESOURCE_ENERGY);
        }
    }

}

function findUpgraderToProvide(creep: Creep): Creep | null {
    let creeps = creep.room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === Role.Upgrader && c.carry.energy < c.carryCapacity / 2});
    if (creeps.length > 0) {
        let closest = creep.pos.findClosestByRange(creeps) as Creep;
        creep.memory.upgrader = closest.id;
        return closest;
    }
    return null;
}

function shouldShouldAnotherRun(creep: Creep): boolean {
    if (creep.room.storage === undefined) {
        return false;
    }
    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, creep.room.storage.pos);
    return creep.ticksToLive > distanceToTerminal * 3;
}
