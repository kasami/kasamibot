"use strict";
const _Manager_1 = require("./managers._Manager");
const operationtypes_1 = require("./enums.operationtypes");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const ProfileUtilities = require("./utilities.Profiles");
(function (VictoryCondition) {
    VictoryCondition[VictoryCondition["Gametime"] = 1] = "Gametime";
})(exports.VictoryCondition || (exports.VictoryCondition = {}));
var VictoryCondition = exports.VictoryCondition;
class Data {
    constructor() {
        this.operationtype = operationtypes_1.OperationType.Guard;
        this.active = true;
    }
}
exports.Data = Data;
function run(operation, creepService, pri) {
    if (pri === _Manager_1.ManagerPriority.Low) {
        if (Game.time % 50 === 0) {
            orderUnitsIfNeeded(operation, creepService);
        }
    }
}
exports.run = run;
function victoryConditionReached(operation) {
    switch (operation.victoryCondition) {
        case VictoryCondition.Gametime:
            if (Game.time > operation.victoryValue + 10000) {
                operation.active = false;
                return true;
            }
    }
    return false;
}
exports.victoryConditionReached = victoryConditionReached;
function orderUnitsIfNeeded(operation, creepService) {
    if (Game.time > operation.victoryValue) {
        return;
    }
    let spawnRoom = Game.rooms[operation.room];
    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
        return;
    }
    if (operation.unitType === undefined) {
        if (_.random(1, 10) > 5) {
            operation.unitType = role_1.Role.Ranger;
        }
        else {
            operation.unitType = role_1.Role.Paladin;
        }
    }
    if (spawnRoom.storage === undefined || spawnRoom.storage.store[RESOURCE_ENERGY] < 20000) {
        return;
    }
    if (operation.lastOrder !== undefined && operation.lastOrder + 1500 > Game.time) {
        return;
    }
    let current = creepService.getCreeps(operation.unitType, operation.targetRoom, spawnRoom.name).length;
    let ordered = OrdersRepository.getCreepsInQueue(spawnRoom, operation.unitType, operation.targetRoom);
    if (current + ordered === 0) {
        operation.lastOrder = Game.time;
        switch (operation.unitType) {
            case role_1.Role.Ranger:
                orderRanger(spawnRoom, operation.targetRoom);
                break;
            case role_1.Role.Paladin:
                orderPaladin(spawnRoom, operation.targetRoom);
                break;
            default:
                break;
        }
    }
    if (spawnRoom.controller === undefined || spawnRoom.controller.level < 8) {
        return;
    }
    let otherType = role_1.Role.Paladin;
    if (operation.unitType === otherType) {
        otherType = role_1.Role.Ranger;
    }
    current = creepService.getCreeps(otherType, operation.targetRoom, spawnRoom.name).length;
    ordered = OrdersRepository.getCreepsInQueue(spawnRoom, otherType, operation.targetRoom);
    if (current + ordered === 0) {
        switch (otherType) {
            case role_1.Role.Ranger:
                orderRanger(spawnRoom, operation.targetRoom);
                break;
            case role_1.Role.Paladin:
                orderPaladin(spawnRoom, operation.targetRoom);
                break;
            default:
                break;
        }
    }
    if (spawnRoom.controller === undefined || spawnRoom.controller.level < 8) {
        return;
    }
}
function orderRanger(spawnRoom, targetRoom) {
    let maxTier = ProfileUtilities.getMaxTierRanger(spawnRoom.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = priority_1.Priority.Important;
    order.memory = { role: role_1.Role.Ranger, target: targetRoom, tier: maxTier };
    OrdersRepository.orderCreep(spawnRoom, order);
}
function orderPaladin(spawnRoom, targetRoom) {
    let maxTier = ProfileUtilities.getMaxTierPaladin(spawnRoom.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getPaladinBody(maxTier);
    order.priority = priority_1.Priority.Important;
    order.memory = { role: role_1.Role.Paladin, target: targetRoom, tier: maxTier };
    OrdersRepository.orderCreep(spawnRoom, order);
}
