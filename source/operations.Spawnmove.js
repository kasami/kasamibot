"use strict";
const _Manager_1 = require("./managers._Manager");
const operationtypes_1 = require("./enums.operationtypes");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const ProfileUtilities = require("./utilities.Profiles");
var MoveState;
(function (MoveState) {
    MoveState[MoveState["Waiting"] = 1] = "Waiting";
    MoveState[MoveState["Preparing"] = 2] = "Preparing";
    MoveState[MoveState["Moving"] = 3] = "Moving";
    MoveState[MoveState["Finished"] = 4] = "Finished";
})(MoveState || (MoveState = {}));
(function (VictoryCondition) {
    VictoryCondition[VictoryCondition["Spawnmoved"] = 1] = "Spawnmoved";
})(exports.VictoryCondition || (exports.VictoryCondition = {}));
var VictoryCondition = exports.VictoryCondition;
class Data {
    constructor() {
        this.operationtype = operationtypes_1.OperationType.Spawnmove;
        this.active = true;
        this.state = 1;
    }
}
exports.Data = Data;
function run(operation, pri, creepService) {
    if (pri === _Manager_1.ManagerPriority.Standard && Game.time % 5 === 0) {
        if (operation.state === MoveState.Waiting) {
            checkIfWeCanStartPreparing(operation);
        }
        else if (operation.state === MoveState.Preparing) {
            checkIfWeCanStartMoving(operation, creepService);
        }
        else if (operation.state === MoveState.Moving) {
            checkIfSpawnHasBeenBuilt(operation);
        }
    }
}
exports.run = run;
function victoryConditionReached(operation) {
    if (operation.state === MoveState.Finished) {
        return true;
    }
    else {
        return false;
    }
}
exports.victoryConditionReached = victoryConditionReached;
function checkIfWeCanStartPreparing(operation) {
    let room = Game.rooms[operation.roomName];
    if (room === undefined || room.controller === undefined || room.controller.level < 4 || !room.controller.my || room.energyCapacityAvailable === SPAWN_ENERGY_CAPACITY) {
        return;
    }
    let spawn = room.getSpawn();
    if (spawn === undefined || Object.keys(Game.constructionSites).length > 0) {
        return;
    }
    if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 25000) {
        return;
    }
    operation.state = MoveState.Preparing;
}
function checkIfWeCanStartMoving(operation, creepService) {
    let room = Game.rooms[operation.roomName];
    if (room === undefined) {
        return;
    }
    let spawn = room.getSpawn();
    if (spawn === undefined) {
        return;
    }
    let builders = _.filter(creepService.getCreeps(role_1.Role.BaseBuilder, operation.roomName, operation.roomName), (c) => c.ticksToLive < 1500 && c.ticksToLive > 200);
    if (builders.length < 3) {
        orderBaseBuilders(room, creepService);
        return;
    }
    let enemies = room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        return;
    }
    if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 20000) {
        return;
    }
    spawn.destroy();
    operation.state = MoveState.Moving;
}
function checkIfSpawnHasBeenBuilt(operation) {
    let room = Game.rooms[operation.roomName];
    if (room === undefined) {
        return;
    }
    let basePos = getBasePos(operation);
    if (basePos === undefined) {
        return;
    }
    let spawn = room.getSpawn();
    if (spawn !== undefined) {
        if (spawn.pos.x === basePos.x && spawn.pos.y === basePos.y) {
            operation.state = MoveState.Finished;
        }
        else {
            spawn.destroy();
        }
    }
    else {
        basePos.createConstructionSite(STRUCTURE_SPAWN);
    }
}
function orderBaseBuilders(room, creepService) {
    let current = creepService.getCreeps(role_1.Role.BaseBuilder, room.name, room.name).length;
    let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseBuilder, room.name);
    if (current < 4 && ordered === 0) {
        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getConsultantBody(maxTier);
        order.priority = priority_1.Priority.Important;
        order.memory = { role: role_1.Role.BaseBuilder, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
}
function getBasePos(operation) {
    if (operation.victoryValue.x !== undefined && operation.victoryValue.y !== undefined) {
        return new RoomPosition(operation.victoryValue.x, operation.victoryValue.y, operation.roomName);
    }
}
