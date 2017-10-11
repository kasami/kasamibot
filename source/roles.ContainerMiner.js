"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const _Common = require("./rolelib.common");
const Order_1 = require("./classes.Order");
const priority_1 = require("./enums.priority");
var State;
(function (State) {
    State[State["MovingToContainer"] = 1] = "MovingToContainer";
    State[State["BuildingContainer"] = 2] = "BuildingContainer";
    State[State["Mining"] = 3] = "Mining";
})(State || (State = {}));
function run(creep) {
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
    switch (creep.getState()) {
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
exports.run = run;
function runMovingToContainer(creep) {
    let targetSource = getTargetSource(creep);
    if (targetSource === null) {
        creep.travelToRoom(getTargetRoomname(creep));
    }
    else {
        let containerPos = targetSource.getContainerPosition();
        if (containerPos !== undefined) {
            if (creep.room.name === getTargetRoomname(creep) && creep.pos.getRangeTo(containerPos) === 0) {
                if (targetSource.hasMiningContainer()) {
                    creep.setState(State.Mining);
                    return;
                }
                else {
                    creep.setState(State.BuildingContainer);
                    return;
                }
            }
            creep.travelTo({ pos: containerPos }, { range: 0 });
        }
        else {
            creep.travelTo(targetSource);
        }
    }
}
function runBuildingContainer(creep) {
    let container = getContainer(creep);
    if (container !== null) {
        creep.setState(State.Mining);
    }
    else {
        let constrSite = getConstructionSite(creep);
        if (constrSite !== null) {
            let source = getTargetSource(creep);
            if (source === null) {
                console.log("Error with missing source for ContainerMiner: " + creep.room.name);
                return;
            }
            if (creep.carry[RESOURCE_ENERGY] > (creep.carryCapacity / 2)) {
                creep.build(constrSite);
            }
            else {
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
function runMining(creep) {
    let source = getTargetSource(creep);
    if (source === null) {
        console.log("Error with missing source for ContainerMiner: " + creep.room.name);
        return;
    }
    let container = getContainer(creep);
    if (container === null) {
        creep.setState(State.BuildingContainer);
    }
    else {
        if (container.hits < 200000 && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
            creep.repair(container);
        }
        else if (source.energy > 0 && container.store[RESOURCE_ENERGY] < container.storeCapacity) {
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
function getTargetRoomname(creep) {
    if (creep.memory.targetRoom === undefined) {
        creep.memory.targetRoom = creep.memory.target.split("-")[0];
    }
    return creep.memory.targetRoom;
}
function getTargetSource(creep) {
    if (creep.memory.source === undefined) {
        creep.memory.source = creep.memory.target.split("-")[1];
    }
    return Game.getObjectById(creep.memory.source);
}
function getContainer(creep) {
    if (creep.memory.container !== undefined) {
        let container = Game.getObjectById(creep.memory.container);
        if (container === null) {
            creep.memory.container = undefined;
        }
        else {
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
function getConstructionSite(creep) {
    if (creep.memory.csite !== undefined) {
        let csite = Game.getObjectById(creep.memory.csite);
        if (csite === null) {
            creep.memory.csite = undefined;
        }
        else {
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
function setOrderCopyTick(creep) {
    let source = getTargetSource(creep);
    let spawn = Game.rooms[creep.memory.homeroom].getSpawn();
    if (source instanceof Source && spawn instanceof StructureSpawn) {
        creep.memory.orderCopyTick = Math.ceil((PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos)) + (creep.memory.tier * 3) * 1.1);
    }
    else {
        creep.memory.orderCopyTick = -1;
    }
}
function orderMyCopy(creep) {
    if (Game.rooms[creep.memory.homeroom] === undefined || !RoomRepository.hasOutpost(Game.rooms[creep.memory.homeroom], creep.memory.targetRoom)
        || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege()) {
        return;
    }
    let order = new Order_1.Order();
    order.body = _.map(creep.body, (p) => p.type);
    order.priority = priority_1.Priority.Important;
    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
}
