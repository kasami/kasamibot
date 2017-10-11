"use strict";
const _Manager_1 = require("./managers._Manager");
const operationtypes_1 = require("./enums.operationtypes");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const ProfileUtilities = require("./utilities.Profiles");
const PathfindingUtilities = require("./utilities.Pathfinding");
(function (VictoryCondition) {
    VictoryCondition[VictoryCondition["RoomLevel"] = 1] = "RoomLevel";
    VictoryCondition[VictoryCondition["Gametime"] = 2] = "Gametime";
})(exports.VictoryCondition || (exports.VictoryCondition = {}));
var VictoryCondition = exports.VictoryCondition;
class Data {
    constructor() {
        this.operationtype = operationtypes_1.OperationType.Haul;
        this.active = true;
    }
}
exports.Data = Data;
function run(operation, creepService, pri) {
    if (pri === _Manager_1.ManagerPriority.Low) {
        if (Game.time % 50 === 0) {
            checkHaulerAmount(operation, creepService);
        }
    }
}
exports.run = run;
function victoryConditionReached(operation) {
    let toRoom = Game.rooms[operation.to];
    if (!(toRoom instanceof Room)) {
        return false;
    }
    switch (operation.victoryCondition) {
        case VictoryCondition.RoomLevel:
            if (toRoom.controller !== undefined && toRoom.controller.level >= operation.victoryValue) {
                operation.active = false;
                return true;
            }
            break;
        case VictoryCondition.Gametime:
            if (Game.time > operation.victoryValue) {
                operation.active = false;
                return true;
            }
    }
    return false;
}
exports.victoryConditionReached = victoryConditionReached;
function checkHaulerAmount(operation, creepService) {
    let fromRoom = Game.rooms[operation.from];
    if (!(fromRoom instanceof Room) || fromRoom.storage === undefined) {
        return;
    }
    let maxTier = ProfileUtilities.getMaxTierOffroadHauler(fromRoom.energyCapacityAvailable);
    if (operation.haulersNeeded === undefined) {
        let toRoom = Game.rooms[operation.to];
        let toPos = new RoomPosition(25, 25, operation.to);
        if (toRoom instanceof Room && toRoom.storage !== undefined) {
            toPos = toRoom.storage.pos;
        }
        let distance = PathfindingUtilities.getDistanseBetween(fromRoom.storage.pos, toPos);
        let tiersNeeded = (operation.amount * distance * 2 / 50);
        operation.haulersNeeded = Math.ceil(tiersNeeded / maxTier);
    }
    let current = creepService.getCreeps(role_1.Role.OperationHauler, operation.to, operation.from).length;
    let ordered = OrdersRepository.getCreepsInQueue(fromRoom, role_1.Role.OperationHauler, operation.to);
    if (current + ordered < operation.haulersNeeded) {
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getOffroadHaulerBody(maxTier);
        order.priority = priority_1.Priority.Low;
        order.memory = { role: role_1.Role.OperationHauler, target: operation.to, tier: maxTier };
        OrdersRepository.orderCreep(fromRoom, order);
    }
}
