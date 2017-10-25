/**
 * ContainerHauler
 *
 * Used to mine energy from sources into a container.
 *
 * MEMORY
 *   target - id for source to carry energy from
 *   container - id for container to carry energy from
 *   containerPos = RoomPosition (x, y, roomName) for container to carry energy from
 *   dropof - id for structure to be used for dumping the energy
 *   sleepUntil - GameTime for when the creep should wake up again
 *
 * STATE
 *   Idle - Not currently doing any work
 *   Tanking - Getting energy from container
 *   Dumping - Returning to base with energy
 */

import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as OrdersRepository from "../repository/Orders";

import * as RoomRepository from "../repository/Room";
import * as _Common from "../rolelib/common";

import {Order} from "../classes/Order";

import {Priority} from "../enums/priority";

enum State {
    MovingToContainer = 1,
    BuildingContainer = 2,
    Mining = 3
}

export function run(creep: Creep) {
    if (_Common.targetRoomHasInvaders(creep, creep.memory.targetRoom)) {
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            creep.drop(RESOURCE_ENERGY);
        }
        creep.setState(State.MovingToContainer);
        return;
    }

    if (_Common.stayAwayFromSourceKeeper(creep)) {
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            creep.drop(RESOURCE_ENERGY);
        }
        creep.setState(State.MovingToContainer);
        return;
    }

    if (!creep.hasState()) {
        creep.setState(State.MovingToContainer);
    }

    if (creep.memory.orderCopyTick === undefined) {
        setOrderCopyTick(creep);
    }

    if (creep.memory.orderCopyTick === creep.ticksToLive) {
        orderMyCopy(creep);
    }

    switch(creep.getState()) {
        case State.MovingToContainer:
            runMovingToContainer(creep);
            break;
        case State.BuildingContainer:
            runBuildingContainer(creep);
            break;
        case State.Mining:
            runMining(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MovingToContainer);
            break;
    }
}

function runMovingToContainer(creep: Creep) {
    let targetSource = getTargetSource(creep);
    if (targetSource === null) {
        creep.travelToRoom(getTargetRoomname(creep));
    } else {
        let containerPos = targetSource.getContainerPosition();
        if (containerPos !== undefined) {
            if (creep.room.name === getTargetRoomname(creep) && creep.pos.getRangeTo(containerPos) === 0) {
                if (targetSource.hasMiningContainer()) {
                    creep.setState(State.Mining);
                    return;
                } else {
                    creep.setState(State.BuildingContainer);
                    return;
                }
            }
            creep.travelTo({pos: containerPos}, {range: 0});
        } else {
            creep.travelTo(targetSource);
        }
    }
}

function runBuildingContainer(creep: Creep) {
    let container = getContainer(creep);
    if (container !== null) {
        creep.setState(State.Mining);
    } else {
        let constrSite = getConstructionSite(creep);
        if (constrSite !== null) {
            let source = getTargetSource(creep);
            if (source === null) {
                console.log("Error with missing source for ContainerMiner: " + creep.room.name);
                return;
            }
            if (creep.carry[RESOURCE_ENERGY] > (creep.carryCapacity / 2)) {
                creep.build(constrSite);
            } else {
                let responseHarvest = creep.harvest(source);
                if (responseHarvest === OK) {
                    if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
                        Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
                    }
                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
                }
            }
        }
    }

}

function runMining(creep: Creep) {
    let source = getTargetSource(creep);
    if (source === null) {
        console.log("Error with missing source for ContainerMiner: " + creep.room.name);
        return;
    }
    let container = getContainer(creep);
    if (container === null) {
        creep.setState(State.BuildingContainer);
    } else {
        if (container.hits < 200000 && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
            creep.repair(container);
        } else
        if (source.energy > 0 && container.store[RESOURCE_ENERGY] < container.storeCapacity) {
            let responseHarvest = creep.harvest(source);
            if (responseHarvest === OK) {
                if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
                }
                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
            }
        }
    }
}
function getTargetRoomname(creep: Creep): string {
    if (creep.memory.targetRoom === undefined) {
        creep.memory.targetRoom = creep.memory.target.split("-")[0];
    }
    return creep.memory.targetRoom;
}

function getTargetSource(creep: Creep): Source | null {
    if (creep.memory.source === undefined) {
        creep.memory.source = creep.memory.target.split("-")[1];
    }
    return Game.getObjectById(creep.memory.source) as Source;
}

function getContainer(creep: Creep): StructureContainer | null {
    if (creep.memory.container !== undefined) {
        let container = Game.getObjectById(creep.memory.container) as StructureContainer;
        if (container === null) {
            creep.memory.container = undefined;
        } else {
            return container;
        }
    }
    let source = getTargetSource(creep);
    if (source !== null) {
        let container = source.getMiningContainer();
        if (container !== null) {
            creep.memory.container = container.id;
            return container;
        }
    }
    return null;
}

function getConstructionSite(creep: Creep): ConstructionSite | null {
    if (creep.memory.csite !== undefined) {
        let csite = Game.getObjectById(creep.memory.csite) as ConstructionSite;
        if (csite === null) {
            creep.memory.csite = undefined;
        } else {
            return csite;
        }
    }
    let source = getTargetSource(creep);
    if (source !== null) {
        let csite = source.getMiningContainerConstructionSite();
        if (csite !== null) {
            creep.memory.csite = csite.id;
            return csite;
        }
        source.buildMiningContainer();
    }
    return null;
}

function setOrderCopyTick(creep: Creep) {
    let source = getTargetSource(creep);
    let spawn = Game.rooms[creep.memory.homeroom].getSpawn() as Spawn;
    if (source instanceof Source && spawn instanceof StructureSpawn) {
        creep.memory.orderCopyTick = Math.ceil((PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos)) + (creep.memory.tier * 3) * 1.1);
    }
    else {
        creep.memory.orderCopyTick = -1;
    }
}

function orderMyCopy(creep: Creep) {
    if(Game.rooms[creep.memory.homeroom] === undefined || !RoomRepository.hasOutpost(Game.rooms[creep.memory.homeroom], creep.memory.targetRoom)
        || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege()) {
        return;
    }

    let order = new Order();
    order.body = _.map(creep.body, (p) => p.type);
    order.priority = Priority.Important;
    order.memory = {role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier};

    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
}
