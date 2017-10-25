/**
 * Pioneer
 *
 * Used to build up bases up to RCL 4, with storage
 *
 * MEMORY
 *   sourceId - id for source
 *   sourcePos = RoomPosition (x, y, roomName) for assigned source
 *   controllerid - id for controller
 *   constructionid - id for constructionsite to build up
 *   fillingid - id for filling energy
 *   pickupid - id for energy pickup (storage/terminal or resource)
 *
 */

import * as IntelLib from "../lib/intel";
import * as RoomRepository from "../repository/Room";
import * as PositionLib from "../lib/position";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    MovingToSource = 1,
    Mining = 2,
    Upgrading = 3,
    Constructing = 4,
    FillingBase = 5,
    DecideWhatToDoWithEnergy = 6,
    DecideWhereToGetEnergy = 7,
    ScavengeEnergy = 8,
    GetEnergyFromStructure = 9,
    RemoveHostileConstructionSites = 10,
    MoveToHomeroom = 11
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToSource);
    }

    switch(creep.getState()) {
        case State.RemoveHostileConstructionSites:
            runRemoveHostileConstructionSites(creep);
            break;
        case State.MoveToHomeroom:
            runMoveToHomeroom(creep);
            break;
        case State.MovingToSource:
            runMovingToSource(creep);
            break;
        case State.Mining:
            runMining(creep);
            break;
        case State.Upgrading:
            runUpgrading(creep);
            break;
        case State.Constructing:
            runConstructing(creep);
            break;
        case State.FillingBase:
            runFillingBase(creep);
            break;
        case State.ScavengeEnergy:
            runScavengeEnergy(creep);
            break;
        case State.GetEnergyFromStructure:
            runGetEnergyFromStructure(creep);
            break;
        case State.DecideWhatToDoWithEnergy:
            runDecideWhatToDoWithEnergy(creep);
            break;
        case State.DecideWhereToGetEnergy:
            runDecideWhereToGetEnergy(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MovingToSource);
            break;
    }
};

function runMoveToHomeroom(creep: Creep) {
    let homeroom: string = creep.memory.homeroom;
    if (homeroom !== creep.room.name || PositionLib.positionIsBorder(creep.pos) ) {
        creep.travelToRoom(homeroom, {maxOps: 4000, ignoreRoads: true}, true);
    } else {
        creep.setState(State.RemoveHostileConstructionSites)
        runRemoveHostileConstructionSites(creep);
    }
}

function runScavengeEnergy(creep: Creep) {
    if (creep.carry.energy === creep.carryCapacity) {
        creep.setState(State.DecideWhatToDoWithEnergy);
        runDecideWhatToDoWithEnergy(creep);
        return;
    }

    let resource = Game.getObjectById(creep.memory.pickupid) as Resource;

    if (resource instanceof Resource && resource.amount > creep.carryCapacity / 10) {
        let distanceToResource = creep.pos.getRangeTo(resource.pos);

        if (distanceToResource > 1) {
            creep.moveTo(resource);
        } else {
            creep.pickup(resource);
        }
    } else {
        if (creep.carry.energy > 0) {
            creep.setState(State.DecideWhatToDoWithEnergy);
            runDecideWhatToDoWithEnergy(creep);
        }
        else {
            creep.setState(State.DecideWhereToGetEnergy);
            runDecideWhereToGetEnergy(creep);
        }
    }
}

function runGetEnergyFromStructure(creep: Creep) {
    if (creep.carry.energy === creep.carryCapacity) {
        creep.setState(State.DecideWhatToDoWithEnergy);
        runDecideWhatToDoWithEnergy(creep);
        return;
    }

    let structure = Game.getObjectById(creep.memory.pickupid) as Terminal | Storage;

    if ((structure instanceof StructureTerminal || structure instanceof StructureStorage) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity) {
        let distanceToStructure = creep.pos.getRangeTo(structure.pos);

        if (distanceToStructure > 1) {
            creep.moveTo(structure);
        } else {
            creep.withdraw(structure, RESOURCE_ENERGY);
        }
    } else {
        if (creep.carry.energy > 0) {
            creep.setState(State.DecideWhatToDoWithEnergy);
            runDecideWhatToDoWithEnergy(creep);
        }
        else {
            creep.setState(State.DecideWhereToGetEnergy);
            runDecideWhereToGetEnergy(creep);
        }
    }
}

function runDecideWhereToGetEnergy(creep: Creep) {
    // If there is any non-empty enemy structures (storage or terminal) with energy, grab it there
    let structuresWithEnergy = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(c: Storage | Terminal) {
        return (c.structureType === STRUCTURE_STORAGE || c.structureType === STRUCTURE_TERMINAL) &&
            c.store[RESOURCE_ENERGY] > 50; }}) as Structure[];

    if (structuresWithEnergy.length > 0) {
        creep.memory.pickupid = creep.pos.findClosestByRange(structuresWithEnergy).id;
        creep.setState(State.GetEnergyFromStructure);
        runGetEnergyFromStructure(creep);
        return;
    }

    // Scavange for resources
    let pilesWithEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: function(c: Resource) {
        return c.resourceType === RESOURCE_ENERGY && c.amount > creep.carryCapacity / 3; }}) as Resource[];

    if (pilesWithEnergy.length > 0) {
        creep.memory.pickupid = creep.pos.findClosestByRange(pilesWithEnergy).id;
        creep.setState(State.ScavengeEnergy);
        runScavengeEnergy(creep);
        return;
    }

    // If no resources to pickup from piles or structures, go mining
    creep.setState(State.MovingToSource);
    runMovingToSource(creep);
}

function runRemoveHostileConstructionSites(creep: Creep) {
    let conSites = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: (c: ConstructionSite) => c.structureType !== STRUCTURE_EXTRACTOR}) as ConstructionSite | undefined;

    if (conSites !== null && conSites !== undefined) {
        creep.travelTo(conSites, {maxOps: 4000, ignoreRoads: true})
    } else {
        creep.setState(State.DecideWhatToDoWithEnergy)
    }
}

function runDecideWhatToDoWithEnergy(creep: Creep) {
    if (creep.carry.energy < 5 ) {
        creep.setState(State.MovingToSource);
        runMovingToSource(creep);
        return;
    }

    let controller = creep.room.controller;
    if (controller !== undefined && (controller.ticksToDowngrade < 2000 || controller.progress > controller.progressTotal)) {
        creep.setState(State.Upgrading);
        runUpgrading(creep);
        return;
    }

    // If there is any non-full extensions/spawns/towers, fill them
    let structuresNeedingEnergy: Structure[] = [];
    if (creep.room.controller !== undefined && creep.room.controller.level === 3) {
        structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(c: Extension | Spawn | Tower) {
            return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER) &&
                c.energy < c.energyCapacity; }}) as Structure[];
    } else {
        structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
            filter: function(c: Extension | Spawn | Tower) {
            return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER) &&
                c.energy < c.energyCapacity - 20; }}) as Structure[];
    }

    if (structuresNeedingEnergy.length > 0) {
        creep.memory.fillingid = creep.pos.findClosestByRange(structuresNeedingEnergy).id;
        creep.setState(State.FillingBase);
        runFillingBase(creep);
        return;
    }

    // Decide what to do with the energy it has
    // If there is any construction sites, build them
    let importantConstructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (c: ConstructionSite) => c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_SPAWN}) as ConstructionSite[];

    if (importantConstructionSitesInRoom.length > 0)  {
        creep.memory.constructionid = creep.pos.findClosestByRange(importantConstructionSitesInRoom).id;
        creep.setState(State.Constructing);
        runConstructing(creep);
        return;
    }

    let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

    if (constructionSitesInRoom.length > 0)  {
        creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
        creep.setState(State.Constructing);
        runConstructing(creep);
        return;
    }

    // If storage is built and active, put energy there.
    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
        creep.memory.fillingid = creep.room.storage.id;
        creep.setState(State.FillingBase);
        runFillingBase(creep);
        return;
    }

    // Else, upgrade
    creep.setState(State.Upgrading);
    runUpgrading(creep);
}

function runMovingToSource(creep: Creep) {
    // Move to source, and if range === 1, start mining
    if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
        setTargetSource(creep);
        if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
            log.error("Could not set source for ExpansionWorker", creep.room.name);
            return;
        }
    }

    let sourcePos = new RoomPosition(creep.memory.sourcePos.x, creep.memory.sourcePos.y, creep.memory.sourcePos.roomName);

    if (sourcePos instanceof RoomPosition) {
        if (creep.room.name !== sourcePos.roomName || creep.pos.getRangeTo(sourcePos) > 1) {
            creep.travelTo({pos: sourcePos}, {maxOps: 4000, ignoreRoads: true});
        } else {
            creep.setState(State.Mining);
            runMining(creep);
        }
    } else {
        log.error("Invalid sourcePos for ExpansionWorker", creep.room.name);
    }

}

function runMining(creep: Creep) {
    // Mine the source, and if full, decide what to do next
    let source = Game.getObjectById(creep.memory.sourceId) as Source;
    if (source === null || source.room.name !== creep.room.name || creep.pos.getRangeTo(source.pos) > 1) {
        creep.setState(State.MovingToSource);
        runMovingToSource(creep);
        return;
    }

    if (creep.carry.energy === creep.carryCapacity) {
        if (!creep.isInHomeroom()) {
            let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

            if (constructionSitesInRoom.length > 0)  {
                creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
                creep.setState(State.Constructing);
                runConstructing(creep);
                return;
            }
        }
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }

    if (source.energy > 0) {
        let responseHarvest = creep.harvest(source);
        if (responseHarvest === OK) {
            if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
            }
            Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
        }
    }
}

function runUpgrading(creep: Creep) {
    if (creep.carry.energy === 0) {
        creep.setState(State.DecideWhereToGetEnergy);
        runDecideWhereToGetEnergy(creep);
        return;
    }

    if (!creep.isInHomeroom()) {
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }

    // Move to controller, and upgrade
    let controller = creep.room.controller;
    if (controller !== undefined && controller.my) {
        let range = creep.pos.getRangeTo(controller);
        if (range > 3) {
            creep.travelTo(controller, {maxOps: 4000, ignoreRoads: true});
        } else
        {
            if (range === 3) {
                creep.travelTo(controller, {maxOps: 4000, ignoreRoads: true});
            }
            let response = creep.upgradeController(controller);
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
    } else {
        creep.setState(State.DecideWhatToDoWithEnergy);
        runDecideWhatToDoWithEnergy(creep);
    }
}

function runConstructing(creep: Creep) {
    if (creep.carry.energy === 0) {
        creep.setState(State.DecideWhereToGetEnergy);
        runDecideWhereToGetEnergy(creep);
        return;
    }

    let constructionSite = Game.getObjectById(creep.memory.constructionid) as ConstructionSite;
    if (constructionSite === null) {
        if (!creep.isInHomeroom()) {
            creep.setState(State.MoveToHomeroom);
            runMoveToHomeroom(creep);
            return;
        }
        creep.setState(State.DecideWhatToDoWithEnergy);
        runDecideWhatToDoWithEnergy(creep);
        return;
    }
    // Move to constructionsite, and construct
    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
        creep.travelTo(constructionSite, {maxOps: 4000, ignoreRoads: true});
    }
}

function runFillingBase(creep: Creep) {
    if (creep.carry.energy === 0) {
        creep.setState(State.DecideWhereToGetEnergy);
        runDecideWhereToGetEnergy(creep);
        return;
    }
    // Move to base, and fill expansions, towers and spawns

    let fillingSite = Game.getObjectById(creep.memory.fillingid) as StructureExtension | StructureTower | StructureSpawn | StructureStorage;
    if (!(fillingSite instanceof StructureStorage) && (fillingSite === null || fillingSite.energy === fillingSite.energyCapacity)) {
        creep.setState(State.DecideWhatToDoWithEnergy);
        runDecideWhatToDoWithEnergy(creep);
        return;
    }

    if (creep.transfer(fillingSite, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.travelTo(fillingSite, {maxOps: 4000, ignoreRoads: true});
    }
}

/* Support function */

function getCountOfWorkersForSource(sourceid: string, homeroom: Room): number {
    let count = 0;
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.sourceId === sourceid &&
            creep.memory.role === Role.Pioneer) {
                count++;
        }
    }

    for (let order of homeroom.memory.orders){
        if (order.memory.sourceId === sourceid &&
            order.memory.role === Role.Pioneer) {
            count++;
        }
    }

    return count;
}

function setTargetSource(creep: Creep) {
    let homeRoom = Game.rooms[creep.memory.homeroom];
    if (creep.memory.target !== undefined) {
        creep.memory.sourceId = creep.memory.target;
        creep.memory.sourcePos = getPosForSource(homeRoom, creep.memory.target);
        if (creep.memory.sourcePos !== undefined) {
            return;
        }
    }

    if (!(homeRoom instanceof Room)) {
        log.error("Could not access homeroom for Pioneer", creep.room.name);
        return;
    }
    let sources = homeRoom.getSources();
    let outposts = RoomRepository.getBasicOutposts(homeRoom);
    for (let c of _.range(0, 10)) {
        for (let source of sources) {
            if (getCountOfWorkersForSource(source.id, homeRoom) === c) {
                creep.memory.sourceId = source.id;
                creep.memory.target = source.id;
                creep.memory.sourcePos = source.pos;
                return;
            }
        }

        for (let outpost of outposts) {
            if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
                for (let sourceId of IntelLib.sourceIds(outpost)) {
                    if (getCountOfWorkersForSource(sourceId, homeRoom) === c) {
                        creep.memory.sourceId = sourceId;
                        creep.memory.target = sourceId;
                        creep.memory.sourcePos = IntelLib.sourcePos(outpost, sourceId);
                        return;
                    }
                }
            }
        }
    }
}

function getPosForSource(homeRoom: Room, sourceId: string) {
    let sources = homeRoom.getSources();
    let outposts = RoomRepository.getBasicOutposts(homeRoom);
    for (let source of sources) {
        if (source.id === sourceId) {
            return source.pos;
        }
    }

    for (let outpost of outposts) {
        if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
            for (let sId of IntelLib.sourceIds(outpost)) {
                if (sId === sourceId) {
                    return IntelLib.sourcePos(outpost, sourceId);
                }
            }
        }
    }
}
