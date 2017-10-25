/**
 * ExpansionWorker
 *
 * Used to build up expansions up to RCL 4, with storage
 *
 * MEMORY
 *   target - roomName for expansion-room
 *   sourceId - id for source
 *   sourcePos = RoomPosition (x, y, roomName) for assigned source
 *   controllerid - id for controller in expansion
 *   constructionid - id for constructionsite to build up
 *   fillingid - id for filling energy
 *   pickupid - id for energy pickup (storage/terminal or resource)
 *
 * STATE
 *   Idle - Not currently doing any work
 *   MovingToSource - Moving to assigned source
 *   Mining - Mining assigned source
 *   Upgrading - Upgrading controller in expansion
 *   Constructing - Building construction site in expansion
 */

import * as IntelLib from "../lib/intel";
import * as RoomRepository from "../repository/Room";

import * as PositionLib from "../lib/position";
import * as RouteTravel from "../rolelib/routetravel";
import {Role} from "../enums/role";

import {log} from "../tools/Logger";

enum State {
    MoveToExpansion = 1,
    MovingToSource = 2,
    Mining = 3,
    Upgrading = 4,
    Constructing = 5,
    FillingBase = 6,
    TankUpInHomeroom = 7,
    DecideWhatToDoWithEnergy = 8,
    DecideWhereToGetEnergy = 9,
    ScavengeEnergy = 10,
    GetEnergyFromStructure = 11,
    Renewing = 12,
    RemoveHostileConstructionSites = 13,
    Repairing = 14
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUpInHomeroom);
    }

    switch(creep.getState()) {
        case State.MoveToExpansion:
            runMoveToExpansion(creep);
            break;
        case State.RemoveHostileConstructionSites:
            runRemoveHostileConstructionSites(creep);
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
        case State.Repairing:
            runRepairing(creep);
            break;
        case State.FillingBase:
            runFillingBase(creep);
            break;
        case State.TankUpInHomeroom:
            runTankUpInHomeroom(creep);
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
        case State.Renewing:
            runRenewing(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.TankUpInHomeroom);
            break;
    }
};

function runRenewing(creep: Creep) {
    let spawn = creep.room.getSpawn();
    if (creep.ticksToLive > 1400 || spawn === undefined || spawn.spawning ||
    (creep.room.energyAvailable < 50 && creep.carry.energy === 0)) {
        creep.room.memory.renewing = undefined;
        creep.setState(State.DecideWhatToDoWithEnergy);
        return;
    }

    let distanceToSpawn = creep.pos.getRangeTo(spawn.pos);

    if (distanceToSpawn > 1) {
        creep.moveTo(spawn);
    } else {
        if (creep.carry.energy > 0 && spawn.energy < spawn.energyCapacity / 2) {
            creep.transfer(spawn, RESOURCE_ENERGY);
        }
        spawn.renewCreep(creep);
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
    // Renew if possible and life is less than 800

    if (creep.room.memory.renewing !== undefined) {
        let renewingNow = Game.getObjectById(creep.room.memory.renewing);
        if (renewingNow === null) {
            creep.room.memory.renewing = undefined;
        }
    }

    if (creep.ticksToLive < 800 && creep.room.energyAvailable > 200 &&
    creep.room.memory.renewing === undefined && creep.room.storage === undefined) {
        let spawn = creep.room.getSpawn();
        if (spawn !== undefined && !spawn.spawning) {
            creep.room.memory.renewing = creep.id;
            creep.setState(State.Renewing);
            runRenewing(creep);
            return;
        }
    }

    // If there is any non-empty enemy structures (storage or terminal) with energy, grab it there
    let structuresWithEnergy = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function(c: Storage | Terminal) {
        return (c.structureType === STRUCTURE_STORAGE || c.structureType === STRUCTURE_TERMINAL) &&
            c.store[RESOURCE_ENERGY] > 1000; }}) as Structure[];

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

function runTankUpInHomeroom(creep: Creep) {

    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
    creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);

        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        } else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    } else {
        creep.setState(State.MoveToExpansion);
        runMoveToExpansion(creep);
    }
}

function runMoveToExpansion(creep: Creep) {
    let expansionRoom: string = creep.memory.target;

    if (expansionRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
        RouteTravel.travelByRoute(creep, {avoidKeepers: true, preferHighway: true, allowSK: true, ignoreRoads: true, allowHostile: false}, true);
    } else {
        creep.setState(State.RemoveHostileConstructionSites)
        runRemoveHostileConstructionSites(creep);
    }
}

function runRemoveHostileConstructionSites(creep: Creep) {
    let conSites = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: (c: ConstructionSite) => c.structureType !== STRUCTURE_EXTRACTOR}) as ConstructionSite | undefined;

    if (conSites !== null && conSites !== undefined) {
        creep.travelTo(conSites, {range: 0});
    } else {
        creep.setState(State.DecideWhatToDoWithEnergy);
    }
}

function runDecideWhatToDoWithEnergy(creep: Creep) {

    if (creep.memory.target !== creep.room.name) {
        creep.setState(State.MoveToExpansion);
        runMoveToExpansion(creep);
        return;
    }

    // Renew if possible and life is less than 200
    if (creep.room.isExpansion() && creep.ticksToLive < 400 && creep.room.memory.renewing === undefined && creep.room.storage === undefined && creep.room.energyAvailable > 50) {
        let spawn = creep.room.getSpawn();
        if (spawn !== undefined && !spawn.spawning) {
            creep.room.memory.renewing = creep.id;
            creep.setState(State.Renewing);
            runRenewing(creep);
            return;
        }
    }

    if (creep.carry.energy < 10 ) {
        creep.setState(State.MovingToSource);
        runMovingToSource(creep);
        return;
    }

    let ramparts = creep.room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_RAMPART}) as StructureRampart[];
    if (ramparts.length > 0) {
        let lowestId = ramparts[0].id;
        let lowestHits = ramparts[0].hits;
        for (let r of ramparts) {
            if (r.hits < lowestHits) {
                lowestHits = r.hits;
                lowestId = r.id;
            }
        }
        if (lowestHits < 20000) {
            creep.memory.rampartId = lowestId;
            creep.setState(State.Repairing);
            runRepairing(creep);
            return;
        }
    }

    if (creep.room.controller !== undefined && creep.room.controller.ticksToDowngrade < 2000) {
        creep.setState(State.Upgrading);
        runUpgrading(creep);
        return;
    }

    // If there is any non-full extensions/spawns/towers, fill them
    let structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
        filter: function(c: Extension | Spawn | Tower) {
        return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_STORAGE) &&
            c.energy < c.energyCapacity - 30; }}) as Structure[];

    if (structuresNeedingEnergy.length > 0) {
        creep.memory.fillingid = creep.pos.findClosestByRange(structuresNeedingEnergy).id;
        creep.setState(State.FillingBase);
        runFillingBase(creep);
        return;
    }

    // Decide what to do with the energy it has
    // If there is any construction sites, build them
    let expansion = Game.rooms[creep.memory.target];
    if (!(expansion instanceof Room)) {
        log.error("Expansion " + creep.memory.target, creep.room.name);
        creep.setState(State.MoveToExpansion);
        runMoveToExpansion(creep);
        return;
    }

    let importantConstructionSitesInRoom = expansion.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (c: ConstructionSite) => c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_SPAWN}) as ConstructionSite[];

    if (importantConstructionSitesInRoom.length > 0)  {
        creep.memory.constructionid = creep.pos.findClosestByRange(importantConstructionSitesInRoom).id;
        creep.setState(State.Constructing);
        runConstructing(creep);
        return;
    }

    let constructionSitesInRoom = expansion.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

    if (constructionSitesInRoom.length > 0) {
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
            creep.travelTo({pos: sourcePos}, {allowHostile: false});
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
        if (creep.memory.target !== creep.room.name) {
            let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

            if (constructionSitesInRoom.length > 0) {
                creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
                creep.setState(State.Constructing);
                runConstructing(creep);
                return;
            }
        }
        creep.setState(State.MoveToExpansion);
        runMoveToExpansion(creep);
        return;
    }

    if (source.energy > 0) {
        let responseHarvest = creep.harvest(source);
        if (responseHarvest === OK) {
            if (Memory.stats['room.' + creep.memory.target + '.energyHarvested'] === undefined) {
                Memory.stats['room.' + creep.memory.target + '.energyHarvested'] = 0;
            }
            Memory.stats['room.' + creep.memory.target + '.energyHarvested'] += creep.getWorkerParts() * 2;
        }
    }
}

function runUpgrading(creep: Creep) {
    if (creep.carry.energy === 0) {
        creep.setState(State.DecideWhereToGetEnergy);
        runDecideWhereToGetEnergy(creep);
        return;
    }

    // Move to controller, and upgrade
    let controller = creep.room.controller;
    if (controller instanceof StructureController) {
        let range = creep.pos.getRangeTo(controller);
        if (range > 3) {
            creep.travelTo(controller);
        } else
        {
            if (range === 3) {
                creep.travelTo(controller);
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

function runRepairing(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (creep.memory.target === creep.room.name) {
            creep.setState(State.DecideWhereToGetEnergy);
            runDecideWhereToGetEnergy(creep);
            return;
        } else {
            creep.setState(State.MoveToExpansion);
            runMoveToExpansion(creep);
            return;
        }
    }

    if (creep.room.controller !== undefined && creep.room.controller.level < 2) {
        creep.setState(State.Upgrading);
        runUpgrading(creep);
        return;
    }

    let rampart = Game.getObjectById(creep.memory.rampartId) as StructureRampart;
    if (rampart === null || rampart.hits > 50000) {
        if (creep.memory.target === creep.room.name) {
            creep.setState(State.DecideWhatToDoWithEnergy);
            runDecideWhatToDoWithEnergy(creep);
            return;
        } else {
            creep.setState(State.MoveToExpansion);
            runMoveToExpansion(creep);
            return;
        }

    }
    let result = creep.repair(rampart);

    if (result === ERR_RCL_NOT_ENOUGH) {
        creep.setState(State.Upgrading);
        runUpgrading(creep);
        return;
    }

    // Move to constructionsite, and construct
    if (result === ERR_NOT_IN_RANGE) {
        creep.travelTo(rampart);
    }
}

function runConstructing(creep: Creep) {
    if (creep.carry.energy === 0) {
        if (creep.memory.target === creep.room.name) {
            creep.setState(State.DecideWhereToGetEnergy);
            runDecideWhereToGetEnergy(creep);
            return;
        } else {
            creep.setState(State.MoveToExpansion);
            runMoveToExpansion(creep);
            return;
        }
    }

    let constructionSite = Game.getObjectById(creep.memory.constructionid) as ConstructionSite;
    if (constructionSite === null) {
        if (creep.memory.target === creep.room.name) {
            creep.setState(State.DecideWhatToDoWithEnergy);
            runDecideWhatToDoWithEnergy(creep);
            return;
        } else {
            creep.setState(State.MoveToExpansion);
            runMoveToExpansion(creep);
            return;
        }

    }
    let result = creep.build(constructionSite);

    if (result === ERR_RCL_NOT_ENOUGH) {
        creep.setState(State.Upgrading);
        runUpgrading(creep);
        return;
    }

    // Move to constructionsite, and construct
    if (result === ERR_NOT_IN_RANGE) {
        creep.travelTo(constructionSite);
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
        creep.travelTo(fillingSite);
    }
}

/* Support function */

function getCountOfWorkersForSource(sourceid: string, homeroom: Room): number {
    let count = 0;
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.sourceId === sourceid &&
            creep.memory.role === Role.ExpansionWorker) {
                count++;
        }
    }

    for (let order of homeroom.memory.orders){
        if (order.memory.sourceId === sourceid &&
            order.memory.role === Role.ExpansionWorker) {
            count++;
        }
    }

    return count;
}

function setTargetSource(creep: Creep) {
    let targetRoom = Game.rooms[creep.memory.target];
    let homeRoom = Game.rooms[creep.memory.homeroom];

    if (!(targetRoom instanceof Room)) {
        log.error("Could not access target room for ExpansionWorker", creep.room.name);
        return;
    }
    if (!(homeRoom instanceof Room)) {
        log.error("Could not access homeroom for ExpansionWorker", creep.room.name);
        return;
    }

    let sources = targetRoom.getSources();
    let outposts = RoomRepository.getBasicOutposts(targetRoom);

    for (let i of _.range(0, 10)) {
        for (let source of sources) {
            if (getCountOfWorkersForSource(source.id, homeRoom) === i) {
                creep.memory.sourceId = source.id;
                creep.memory.sourcePos = source.pos;
                return;
            }
        }

        for (let outpost of outposts) {
            if (IntelLib.hasIntel(outpost)) {
                for (let sourceId of IntelLib.sourceIds(outpost)) {
                    if (getCountOfWorkersForSource(sourceId, homeRoom) === i) {
                        creep.memory.sourceId = sourceId;
                        creep.memory.sourcePos = IntelLib.sourcePos(outpost, sourceId);
                        return;
                    }
                }
            }
        }
    }

    if (sources.length > 0) {
        let r = _.random(0, sources.length - 1);
        creep.memory.sourceId = sources[r].id;
        creep.memory.sourcePos = sources[r].pos;
    }
}
