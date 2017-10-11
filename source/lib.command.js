"use strict";
class CommandOrder {
}
exports.CommandOrder = CommandOrder;
function addCommandOrder(order) {
    if (Memory.commandOrders === undefined) {
        Memory.commandOrders = [];
    }
    Memory.commandOrders.push(order);
}
exports.addCommandOrder = addCommandOrder;
function commandOrderIsValid(order) {
    if (!(Game.rooms[order.room] instanceof Room)) {
        return false;
    }
    return true;
}
exports.commandOrderIsValid = commandOrderIsValid;
