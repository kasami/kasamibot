/**
 * Praiser
 *
 * Used for praising in the praisingroom
 *
 * MEMORY
 *   target - roomName for praiseRoom
 *   structureid - id for structure that needs repairing or constructionsite that needs constructing
 *
 */

import * as _Common from "../rolelib/common";


import * as PositionLib from "../lib/position";
import * as PrayerLib from "../lib/prayer";

import {PraiseStatus} from "../enums/praisestatus";
import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    MoveToPraiseroom = 1,
    GetEnergyFromStorage = 2,
    Praising = 3,
    Constructing = 5,
    Renewing = 6,
    SuperPraising = 7,
    DoublePraising = 8,
    Fortify = 9
}


export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.MoveToPraiseroom);
    }

    checkIfPraisingIsFinished(creep);

    switch(creep.getState()) {
        case State.MoveToPraiseroom:
            runMoveToPraiseroom(creep);
            break;
        case State.GetEnergyFromStorage:
            runGetEnergyFromStorage(creep);
            break;
        case State.Praising:
            runPraising(creep);
            break;
        case State.SuperPraising:
            runSuperPraising(creep);
            break;
        case State.DoublePraising:
            runDoublePraising(creep);
            break;
        case State.Constructing:
            runConstructing(creep);
            break;
        case State.Renewing:
            runRenewing(creep);
            break;
        case State.Fortify:
            runFortify(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MoveToPraiseroom);
            break;
    }
}

function runMoveToPraiseroom(creep: Creep) {
    let praiseroom: string = creep.memory.target;

    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(praiseroom);
    } else {
        if (creep.memory.role === Role.PraiserSupport) {
            creep.setState(State.DoublePraising)
            runDoublePraising(creep);
        } else {
            creep.setState(State.Constructing)
            runConstructing(creep);
        }
    }
}

function runRenewing(creep: Creep) {
    if (creep.room.memory.praiseStatus === PraiseStatus.Praising || creep.room.memory.praiseStatus === PraiseStatus.Reestablishing) {
        creep.setState(State.SuperPraising);
        return;
    }

    let spawn = creep.room.getSpawn();
    if (creep.ticksToLive > 1400 || spawn === undefined ||
    (creep.room.energyAvailable < 50 && creep.carry.energy === 0)) {
        creep.room.memory.renewing = undefined;
        creep.setState(State.Praising)
        runPraising(creep);
        return;
    }

    let distanceToSpawn = creep.pos.getRangeTo(spawn.pos);

    if (distanceToSpawn > 1) {
        creep.moveTo(spawn);
    } else {
        if (creep.carry.energy > 0 && spawn.energy < spawn.energyCapacity / 2) {
            creep.transfer(spawn, RESOURCE_ENERGY);
        } else
        if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity &&
        creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
        spawn.renewCreep(creep);
    }

    if (creep.room.controller === undefined) {
        return;
    }

    let distanceToSite = creep.pos.getRangeTo(creep.room.controller);

    if (distanceToSite < 4) {
        let response = creep.upgradeController(creep.room.controller);
        if (response === OK) {
            if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
            }
            if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
            } else {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
            }
        }
    }
}

function runGetEnergyFromStorage(creep: Creep) {
    if (creep.carry.energy > 0) {
        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter:
            (s: Structure) => s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_TERMINAL ||
            s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_LAB}) as ConstructionSite[];
        if (constructionsites.length > 0) {
            creep.setState(State.Constructing)
            runConstructing(creep);
            return;
        }

        creep.setState(State.Praising);
        runPraising(creep);
        return;
    }

    if (creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);

        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        } else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    }
}

function runSuperPraising(creep: Creep) {

    if (creep.room.controller === undefined) {
        log.error("Praising in room without owned controller", creep.room.name);
        return;
    }

    if (!creep.room.controller.my) {
        if (creep.fatigue === 0) {
            moveAwayFromController(creep);
        }
        return;
    }

    if (creep.memory.checkRamparts) {
        creep.memory.checkRamparts = undefined;
        creep.setState(State.Fortify);
        runFortify(creep);
        return;
    }

    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
    creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
        let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
        let range = creep.pos.getRangeTo(wantedPos);
        if (range === 1) {
            creep.moveTo(wantedPos, {ignoreCreeps: true});
        } else
        if (range > 1) {
            creep.moveTo(wantedPos);
        }
    }

    if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }

    let response = creep.upgradeController(creep.room.controller);
    if (response === OK) {
        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
        }
        if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
        } else {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
        }
    }
}

function runDoublePraising(creep: Creep) {

    if (creep.room.controller === undefined) {
        log.error("Praising in room without owned controller", creep.room.name);
        return;
    }

    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
    creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
        let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
        let range = creep.pos.getRangeTo(wantedPos);
        if (range === 1) {
            creep.moveTo(wantedPos, {ignoreCreeps: true});
        } else
        if (range > 1) {
            creep.moveTo(wantedPos);
        }
    } else {
        let c = Game.getObjectById(creep.memory.containerId) as StructureContainer | null;
        if (c !== null) {
            creep.moveTo(c);
        }
    }

    let container = Game.getObjectById(creep.memory.containerId) as StructureContainer | null;
    if (container === null) {
        let spawn1 = creep.room.getSpawn()
        if (spawn1 === undefined) {
            log.error("Spawn1 missing in praiseroom", creep.room.name);
            return;
        }
        let tempContainer = PrayerLib.getContainer(creep.room, spawn1.pos);
        if (tempContainer === undefined) {
            log.error("Container missing in praiseroom", creep.room.name);
            return;
        }
        creep.memory.containerId = tempContainer.id;
        container = tempContainer;
    }
    if (creep.carry.energy < creep.carryCapacity) {
        creep.withdraw(container, RESOURCE_ENERGY);
    }

    let response = creep.upgradeController(creep.room.controller);
    if (response === OK) {
        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
        }
        Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
    }
}

function runFortify(creep: Creep) {
    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
        creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
            let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
            let range = creep.pos.getRangeTo(wantedPos);
            if (range > 0) {
                creep.memory.rampart = undefined;
                creep.setState(State.SuperPraising);
                runSuperPraising(creep);
                return;   
            }
        }

    let target = Game.getObjectById(creep.memory.rampart) as StructureRampart | null;
    if (target !== null && target.hits > 1000000) {
        creep.memory.rampart = undefined;
        target = null;
    }
    if (target === null) {
        let ramparts = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, {filter: (s: Structure) => s.structureType === STRUCTURE_RAMPART && s.hits < 500000}) as StructureRampart[];
        if (ramparts.length === 0) {
            creep.memory.rampart = undefined;
            creep.setState(State.SuperPraising);
            runSuperPraising(creep);
            return;
        }
        target = ramparts[0];
        creep.memory.rampart = target.id;
    }

    if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }

    creep.repair(target);
}

function moveAwayFromController(creep: Creep) {
    _Common.moveOffRoad(creep)
}

function runPraising(creep: Creep) {
    if (creep.room.memory.praiseStatus === PraiseStatus.Praising || creep.room.memory.praiseStatus === PraiseStatus.Reestablishing) {
        creep.setState(State.SuperPraising);
        return;
    }

    if (creep.carry.energy === 0) {
        creep.setState(State.GetEnergyFromStorage)
        runGetEnergyFromStorage(creep);
        return;
    }

    if (Game.time % 20 === 2 && creep.ticksToLive < 500 && creep.room.memory.renewing === undefined && creep.carry.energy > 0) {
        creep.room.memory.renewing = creep.id;
        creep.setState(State.Renewing);
        runRenewing(creep);
        return;
    }

    if (Game.time % 333 === 0) {
        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];
        if (constructionsites.length > 0) {
            creep.setState(State.Constructing)
            runConstructing(creep);
            return;
        }
    }

    if (creep.room.controller === undefined || !creep.room.controller.my) {
        log.error("Praising in room without owned controller", creep.room.name);
        return;
    }

    let distanceToSite = creep.pos.getRangeTo(creep.room.controller);

    if (distanceToSite > 3) {
        creep.moveTo(creep.room.controller);
    } else {
        if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity / 2 &&
        creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }

        let response = creep.upgradeController(creep.room.controller);
        if (response === OK) {
            if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
            }
            if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
            } else {
                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
            }
        }
    }

}

function runConstructing(creep: Creep) {
    if (creep.carry.energy === 0 && creep.room.storage !== undefined) {
        creep.setState(State.GetEnergyFromStorage)
        return;
    }

    let constructionsite = Game.getObjectById(creep.memory.structureid);

    if (constructionsite === null) {
        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter:
        (c: ConstructionSite) => c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_STORAGE ||
        c.structureType === STRUCTURE_TERMINAL || c.structureType === STRUCTURE_LAB || c.structureType === STRUCTURE_TOWER}) as ConstructionSite[];
        if (constructionsites.length > 0) {
            creep.memory.structureid = constructionsites[0].id;
            constructionsite = constructionsites[0];
        }
    }

    if (constructionsite instanceof ConstructionSite) {
        if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity / 2 &&
        creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }

        let distanceToSite = creep.pos.getRangeTo(constructionsite.pos);

        if (distanceToSite > 3) {
            creep.moveTo(constructionsite);
        } else {
            creep.build(constructionsite);
        }
    } else {
        creep.memory.structureid = undefined;
        creep.setState(State.Praising);
    }
}

function checkIfPraisingIsFinished(creep: Creep) {
    if (Game.time % 155 === 0 && creep.memory.target === creep.pos.roomName &&
    ((creep.room.controller !== undefined && creep.room.controller.level === 8) || creep.room.memory.praiseStatus === PraiseStatus.Inactive)) {
        log.alert("Praiser dismissed, room has reached lvl 8.", creep.room.name);
        if (creep.room.storage !== undefined && creep.carry[RESOURCE_ENERGY] > 0) {
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
        }
    }
}
