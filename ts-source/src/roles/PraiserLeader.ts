/**
 * PraiserLeader
 *
 * Used for leading praising in the praisingroom
 *
 * MEMORY
 *   target - roomName for praiseRoom
 *   spawnid - id for spawn used for
 *
 */

import * as PositionLib from "../lib/position";
import * as PrayerLib from "../lib/prayer";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    MoveToPraiseroom = 1,
    MoveToPosition = 2,
    EnergyDistribution = 3,
    SupplyTowers = 4,
    SupplyLab = 5,
    EnergyDistributionContainer = 6
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MoveToPraiseroom);
    }

    switch(creep.getState()) {
        case State.MoveToPraiseroom:
            runMoveToPraiseroom(creep);
            break;
        case State.MoveToPosition:
            runMoveToPosition(creep);
            break;
        case State.EnergyDistribution:
            runEnergyDistribution(creep);
            break;
        case State.SupplyTowers:
            runSupplyTowers(creep);
            break;
        case State.SupplyLab:
            runSupplyLab(creep);
            break;
        case State.EnergyDistributionContainer:
            runEnergyDistributionContainer(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MoveToPraiseroom);
            break;
    }
};

function runMoveToPraiseroom(creep: Creep) {
    let praiseroom: string = creep.memory.target;

    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(praiseroom);
    } else {
        creep.setState(State.MoveToPosition)
        runMoveToPosition(creep);
    }
}

function runMoveToPosition(creep: Creep) {
    let praiseroom = Game.rooms[creep.memory.target];

    if (praiseroom === undefined || praiseroom.name !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.setState(State.MoveToPraiseroom);
        return;
    } else
    if (praiseroom.storage !== undefined) {
        let creepPos = PrayerLib.getLeaderPos(praiseroom, praiseroom.storage.pos);
        if (creep.memory.role === Role.PraiserOfficer) {
            creepPos = PrayerLib.getOfficerPos(praiseroom, praiseroom.storage.pos);
        }
        if (creep.pos.getRangeTo(creepPos) > 0) {
            creep.moveTo(creepPos);
        } else {
            if (creep.memory.role === Role.PraiserOfficer) {
                creep.setState(State.EnergyDistributionContainer);
            } else {
                creep.setState(State.EnergyDistribution);
            }
        }
    }
}

function runEnergyDistribution(creep: Creep) {
    let spawn = creep.room.getSpawn();
    if ((creep.room.storage === undefined && creep.room.terminal === undefined) || spawn === undefined) {
        log.error("Storage, spawn or terminal missing in praiseroom", creep.room.name);
        return;
    }

    if (Game.time % 66 === 33 && labNeedMinerals(creep.room) !== undefined && creep.room.terminal !== undefined &&
    creep.room.terminal.isActive() && creep.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            creep.transfer(creep.room.terminal, RESOURCE_ENERGY);
        }
        creep.setState(State.SupplyLab);
        return;
    }

    if (Game.time % 66 === 0 && creep.room.terminal !== undefined && towerNeedEnergy(creep.room) !== undefined) {
        if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
        }
        creep.setState(State.SupplyTowers);
        return;
    }

    // Transfer energy to spawn or storage
    if (creep.carry[RESOURCE_ENERGY] > 0) {
        if (Game.time % 30 === 0 && creep.room.storage !== undefined) {
            let lab = PrayerLib.getBoosterLab(creep.room, creep.room.storage.pos);
            if (lab !== undefined && lab.energy < lab.energyCapacity && lab.isActive()) {
                creep.transfer(lab, RESOURCE_ENERGY);
            }
        } else
        if (spawn.energy < spawn.energyCapacity / 2) {
            creep.transfer(spawn, RESOURCE_ENERGY);
        } else
        if (creep.room.storage !== undefined && creep.room.terminal !== undefined &&
        creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacity - creep.carryCapacity &&
        creep.room.terminal.store[RESOURCE_ENERGY] > 50000) {
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
        }
    } else
    if (creep.room.terminal !== undefined && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity &&
    creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
    } else
    if (creep.room.storage !== undefined && (creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_ENERGY] === 0) &&
    creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }
}

function runEnergyDistributionContainer(creep: Creep) {
    let spawn1 = creep.room.getSpawn();
    if ((creep.room.storage === undefined && creep.room.terminal === undefined) || spawn1 === undefined) {
        log.error("Storage, spawn or terminal missing in praiseroom", creep.room.name);
        return;
    }

    let spawn2 = PrayerLib.getSpawn2(creep.room, spawn1.pos);
    let container = PrayerLib.getContainer(creep.room, spawn1.pos);
    if (spawn2 === undefined || container === undefined) {
        log.error("Spawn2 or container missing in praiseroom", creep.room.name);
        return;
    }

    // Transfer energy to spawn or storage
    if (creep.carry[RESOURCE_ENERGY] > 0) {
        if (spawn2.energy < spawn2.energyCapacity / 2) {
            creep.transfer(spawn2, RESOURCE_ENERGY);
        } else
        if (creep.room.terminal !== undefined &&
        container.store[RESOURCE_ENERGY] < container.storeCapacity * 0.7 &&
        creep.room.terminal.store[RESOURCE_ENERGY] > 50000) {
            creep.transfer(container, RESOURCE_ENERGY);
        }
    } else
    if (creep.room.terminal !== undefined && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity &&
    creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
    }
}

function runSupplyLab(creep: Creep) {
    if (creep.room.terminal === undefined || creep.room.storage === undefined) {
        creep.setState(State.EnergyDistribution);
        return;
    }
    let lab = PrayerLib.getBoosterLab(creep.room, creep.room.storage.pos);
    if (lab === undefined) {
        creep.setState(State.EnergyDistribution);
        return;
    }
    if (creep.carry[RESOURCE_ENERGY] > 0) {
        creep.transfer(creep.room.storage, RESOURCE_ENERGY)
        return;
    }
    if (lab.mineralAmount < lab.mineralCapacity && creep.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > (lab.mineralCapacity - lab.mineralAmount)) {
        if (creep.carry[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
            creep.transfer(lab, RESOURCE_CATALYZED_GHODIUM_ACID);
        } else {
            creep.withdraw(creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
        }
    } else {
        if (creep.carry[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
            creep.transfer(creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
        }
        creep.setState(State.EnergyDistribution);
    }
}

function runSupplyTowers(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.setState(State.MoveToPosition);
        return;
    }
    let tower = towerNeedEnergy(creep.room);
    if (tower !== undefined) {
        let range = creep.pos.getRangeTo(tower);
        if (range > 1) {
            creep.moveTo(tower);
        } else {
            creep.transfer(tower, RESOURCE_ENERGY);
        }
    } else {
        creep.setState(State.MoveToPosition);
    }
}

function towerNeedEnergy(room: Room): StructureTower | undefined {
    let towers = room.find(FIND_STRUCTURES, {filter:
        (s: StructureTower) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity / 1.2}) as StructureTower[];
    if (towers.length > 0) {
        return towers[0];
    }
    return undefined;
}

function labNeedMinerals(room: Room): StructureLab | undefined {
    if (room.terminal === undefined || room.storage === undefined) {
        return undefined;
    }
    let lab = PrayerLib.getBoosterLab(room, room.storage.pos);
    if (lab !== undefined && lab.mineralAmount < lab.mineralCapacity) {
        return lab;
    }
    return undefined;
}

