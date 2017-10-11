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
    VictoryCondition[VictoryCondition["HostileRoomEnergy"] = 1] = "HostileRoomEnergy";
    VictoryCondition[VictoryCondition["Gametime"] = 2] = "Gametime";
})(exports.VictoryCondition || (exports.VictoryCondition = {}));
var VictoryCondition = exports.VictoryCondition;
class Data {
    constructor() {
        this.operationtype = operationtypes_1.OperationType.Drain;
        this.active = true;
    }
}
exports.Data = Data;
function run(operation, creepService, pri) {
    if (pri === _Manager_1.ManagerPriority.Standard) {
        if (Game.time % 50 === 0) {
            checkDrainerAmount(operation, creepService);
        }
    }
}
exports.run = run;
function victoryConditionReached(operation) {
    let targetRoom = Game.rooms[operation.targetRoom];
    if (!(targetRoom instanceof Room)) {
        return false;
    }
    switch (operation.victoryCondition) {
        case VictoryCondition.HostileRoomEnergy:
            let towers = targetRoom.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
            let towerEnergy = _.sum(towers, (t) => t.energy);
            if (towerEnergy === 0 && (targetRoom.storage === undefined || targetRoom.storage.store[RESOURCE_ENERGY] === 0) &&
                (targetRoom.terminal === undefined || targetRoom.terminal.store[RESOURCE_ENERGY] === 0)) {
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
function checkDrainerAmount(operation, creepService) {
    let spawnRoom = Game.rooms[operation.spawnRoom];
    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
        return;
    }
    if (operation.distanceToTargetRoom === undefined) {
        let toPos = new RoomPosition(25, 25, operation.targetRoom);
        operation.distanceToTargetRoom = PathfindingUtilities.getDistanseBetween(spawnRoom.storage.pos, toPos);
    }
    let current = creepService.getCreeps(role_1.Role.Drainer, null, operation.spawnRoom).length;
    let ordered = OrdersRepository.getCreepsInQueue(spawnRoom, role_1.Role.Drainer);
    if (current + ordered < 2) {
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getDrainerBody(operation.tier);
        order.priority = priority_1.Priority.Low;
        order.memory = { role: role_1.Role.Drainer, route: operation.targetRoute, tier: operation.tier };
        OrdersRepository.orderCreep(spawnRoom, order);
    }
}
