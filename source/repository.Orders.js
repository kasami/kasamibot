"use strict";
const ProfilesUtilities = require("./utilities.Profiles");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const Logger_1 = require("./tools.Logger");
function orderCreep(room, order) {
    let costOfCreep = ProfilesUtilities.getCostForBody(order.body);
    if (costOfCreep > room.energyCapacityAvailable) {
        Logger_1.log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (order.body.length === 0) {
        Logger_1.log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (order.body.length > 50) {
        Logger_1.log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }
    if (order.twinOrder !== undefined) {
        let costOfCreep = ProfilesUtilities.getCostForBody(order.twinOrder.body);
        if (costOfCreep > room.energyCapacityAvailable) {
            Logger_1.log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
        if (order.twinOrder.body.length === 0) {
            Logger_1.log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
        if (order.twinOrder.body.length > 50) {
            Logger_1.log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
    }
    room.memory.orders.push(order);
    Logger_1.log.info("Ordered: " + role_1.Role[order.memory.role] + " T" + order.memory.tier +
        " (" + order.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
    if (order.twinOrder !== undefined) {
        Logger_1.log.info("Ordered: " + role_1.Role[order.twinOrder.memory.role] + " T" + order.twinOrder.memory.tier +
            " (" + order.twinOrder.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
    }
    return true;
}
exports.orderCreep = orderCreep;
function getNumberOfTiersInQueue(room, role = null, target = null) {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }
    let count = 0;
    for (let order of room.memory.orders) {
        if ((target === null || order.memory.target === target) &&
            (role === null || order.memory.role === role)) {
            if (order.memory.tier) {
                count += order.memory.tier;
            }
            else {
                count++;
            }
        }
        if (order.twinOrder !== undefined) {
            if ((target === null || order.twinOrder.memory.target === target) &&
                (role === null || order.twinOrder.memory.role === role)) {
                if (order.twinOrder.memory.tier) {
                    count += order.twinOrder.memory.tier;
                }
                else {
                    count++;
                }
            }
        }
    }
    return count;
}
exports.getNumberOfTiersInQueue = getNumberOfTiersInQueue;
function getCreepsInQueue(room, role = null, target = null) {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }
    let count = 0;
    for (let order of room.memory.orders) {
        if ((target === null || order.memory.target === target) &&
            (role === null || order.memory.role === role)) {
            count++;
        }
        if (order.twinOrder !== undefined) {
            if ((target === null || order.twinOrder.memory.target === target) &&
                (role === null || order.twinOrder.memory.role === role)) {
                count++;
            }
        }
    }
    return count;
}
exports.getCreepsInQueue = getCreepsInQueue;
function getCreepsInQueueWithHomeRoom(room, role = null, homeroom = null) {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }
    let count = 0;
    for (let order of room.memory.orders) {
        if ((homeroom === null || order.memory.homeroom === homeroom) &&
            (role === null || order.memory.role === role)) {
            count++;
        }
    }
    return count;
}
exports.getCreepsInQueueWithHomeRoom = getCreepsInQueueWithHomeRoom;
function orderedBaseHaulerIsTooExpensive(room) {
    if (room.memory.orders === undefined) {
        return false;
    }
    let spawns = room.getSpawns();
    for (let s of spawns) {
        if (s.spawning) {
            return false;
        }
    }
    for (let order of room.memory.orders) {
        if ((order.memory.role === role_1.Role.BaseHauler)) {
            order.priority = priority_1.Priority.Critical;
            return (order.memory.tier * 150) > room.energyAvailable;
        }
    }
    return false;
}
exports.orderedBaseHaulerIsTooExpensive = orderedBaseHaulerIsTooExpensive;
function clearOrders(room) {
    room.memory.orders = [];
    Logger_1.log.info("Clearing order queue for room", room.name);
}
exports.clearOrders = clearOrders;
