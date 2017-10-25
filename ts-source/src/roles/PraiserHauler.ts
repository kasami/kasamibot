/**
 * PraiserHauler
 *
 * Used to move energy from homeroom to praiseroom
 *
 * MEMORY
 *   target - roomName for praiseRoom
 *   structureid - id for structure that needs energy
 *   praiser - id for creep to give energy
 *
 */

import * as PositionLib from "../lib/position";
import * as PathfindingUtilities from "../utilities/Pathfinding";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    TankUpInHomeroom = 1,
    MoveToPraiseroom = 2,
    DecideWhereToPutEnergy = 3,
    MoveToHomeroom = 4,
    TransferEnergyToStructure = 5,
    GiveEnergyToCreep = 6
}


export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.TankUpInHomeroom);
    }

    switch(creep.getState()) {
        case State.TankUpInHomeroom:
            runTankUpInHomeroom(creep);
            break;
        case State.MoveToPraiseroom:
            runMoveToPraiseroom(creep);
            break;
        case State.DecideWhereToPutEnergy:
            runDecideWhereToPutEnergy(creep);
            break;
        case State.TransferEnergyToStructure:
            runTransferEnergyToStructure(creep);
            break;
        case State.GiveEnergyToCreep:
            runGiveEnergyToCreep(creep);
            break;
        case State.MoveToHomeroom:
            runMoveToHomeroom(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MoveToHomeroom);
            break;
    }
}

function runTankUpInHomeroom(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
    creep.room.terminal !== undefined && creep.room.storage !== undefined) {
        let pickUpStructure: StructureStorage | StructureTerminal = creep.room.storage;
        if (creep.room.storage.store[RESOURCE_ENERGY] < 10000) {
            pickUpStructure = creep.room.terminal;
        }
        let distanceToStorage = creep.pos.getRangeTo(pickUpStructure.pos);

        if (distanceToStorage > 1) {
            creep.moveTo(pickUpStructure);
        } else {
            creep.withdraw(pickUpStructure, RESOURCE_ENERGY);
        }
    } else {
        creep.setState(State.MoveToPraiseroom);
        runMoveToPraiseroom(creep);
    }
}

function runMoveToPraiseroom(creep: Creep) {
    let praiseroom: string = creep.memory.target;

    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(praiseroom);
    } else {
        creep.setState(State.DecideWhereToPutEnergy)
        runDecideWhereToPutEnergy(creep);
    }
}

function runDecideWhereToPutEnergy(creep: Creep) {
    if (creep.room.terminal !== undefined && creep.room.terminal.isActive()) {
        creep.memory.structureid = creep.room.terminal.id;
        creep.setState(State.TransferEnergyToStructure);
        runTransferEnergyToStructure(creep);
        return;
    }

    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
        creep.memory.structureid = creep.room.storage.id;
        creep.setState(State.TransferEnergyToStructure);
        runTransferEnergyToStructure(creep);
        return;
    }

    creep.setState(State.GiveEnergyToCreep);
    runGiveEnergyToCreep(creep);
}

function runTransferEnergyToStructure(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }

    let structure = Game.getObjectById(creep.memory.structureid) as Storage | Container | Terminal;
    if (structure === null) {
        creep.setState(State.DecideWhereToPutEnergy)
        runDecideWhereToPutEnergy(creep);
        return;
    }

    let distanceToStorage = creep.pos.getRangeTo(structure.pos);

    if (distanceToStorage > 3) {
        creep.travelTo(structure);
    } else
    if (distanceToStorage > 1) {
        creep.moveTo(structure);
    } else {
        creep.transfer(structure, RESOURCE_ENERGY);
    }
}

function runGiveEnergyToCreep(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }

    let praiser = Game.getObjectById(creep.memory.praiser) as Creep;
    if (praiser === null || praiser.carry.energy === praiser.carryCapacity) {
        creep.memory.praiser = undefined;
        findPraiserToProvide(creep);
        return;
    }

    let distanceToPraiser = creep.pos.getRangeTo(praiser.pos);

    if (distanceToPraiser > 1) {
        creep.moveTo(praiser);
    } else {
        creep.transfer(praiser, RESOURCE_ENERGY);
        creep.memory.praiser = undefined;
    }

}

function runMoveToHomeroom(creep: Creep) {
    let homeroom: string = creep.memory.homeroom;

    if (homeroom !== creep.room.name) {
        creep.travelToRoom(homeroom);
    } else {
        creep.setState(State.TankUpInHomeroom)
        runTankUpInHomeroom(creep);
    }
}

function findPraiserToProvide(creep: Creep) {
    let creeps = creep.room.find(FIND_MY_CREEPS, {filter: (c: Creep) => c.memory.role === Role.Praiser && c.carry.energy < c.carryCapacity / 2});
    if (creeps.length > 0) {
        let closest = creep.pos.findClosestByRange(creeps) as Creep;
        creep.memory.praiser = closest.id;
    }
}

function shouldShouldAnotherRun(creep: Creep): boolean {
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom == undefined || homeroom.terminal === undefined) {
        return true;
    }
    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, homeroom.terminal.pos);
    return creep.ticksToLive > distanceToTerminal * 2.1;
}
