"use strict";
const OperationHaul = require("./operations.Haul");
const OperationGuard = require("./operations.Guard");
const operationtypes_1 = require("./enums.operationtypes");
function addOperation(operation) {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    Memory.operations.push(operation);
}
function roomIsReceiveingHaulOperation(roomName) {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    if (Memory.operations.length === 0) {
        return false;
    }
    for (let o of Memory.operations) {
        if (o.active && o.operationtype === operationtypes_1.OperationType.Haul && o.to === roomName) {
            return true;
        }
    }
    return false;
}
exports.roomIsReceiveingHaulOperation = roomIsReceiveingHaulOperation;
function roomIsHavingActiveGuardOperation(roomName) {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    if (Memory.operations.length === 0) {
        return false;
    }
    for (let o of Memory.operations) {
        if (o.active && o.operationtype === operationtypes_1.OperationType.Guard && o.targetRoom === roomName) {
            return true;
        }
    }
    return false;
}
exports.roomIsHavingActiveGuardOperation = roomIsHavingActiveGuardOperation;
function createGuardOutpostOperation(room, targetRoom) {
    let op = new OperationGuard.Data();
    op.operationtype = operationtypes_1.OperationType.Guard;
    op.room = room.name;
    op.targetRoom = targetRoom;
    op.victoryCondition = OperationGuard.VictoryCondition.Gametime;
    op.victoryValue = Game.time + 8000;
    addOperation(op);
    console.log("Starting a operation from room " + room.name + " to guard outpost " + targetRoom + ", because it is wanted as outpost.");
    return true;
}
exports.createGuardOutpostOperation = createGuardOutpostOperation;
function createCrisisHaulOperation(roomName, allRooms) {
    let provider = findCrisisHaulProvider(roomName, allRooms);
    if (provider === undefined) {
        return false;
    }
    let op = new OperationHaul.Data();
    op.operationtype = operationtypes_1.OperationType.Haul;
    op.from = provider.name;
    op.to = roomName;
    if (provider.controller !== undefined && provider.controller.level > 6) {
        op.amount = 20;
    }
    else {
        op.amount = 10;
    }
    op.victoryCondition = OperationHaul.VictoryCondition.Gametime;
    op.victoryValue = Game.time + 5000;
    addOperation(op);
    console.log("Starting a crisisconvoy from room " + provider + " to room " + roomName + ", supplying 20 energy a tick.");
    return true;
}
exports.createCrisisHaulOperation = createCrisisHaulOperation;
function findCrisisHaulProvider(roomName, providers) {
    let provider = undefined;
    for (let r of providers) {
        if (roomName !== r.name && Game.map.getRoomLinearDistance(roomName, r.name) < 5) {
            if (r.storage !== undefined && r.storage.store[RESOURCE_ENERGY] > 100000) {
                if (provider === undefined || provider.storage === undefined ||
                    r.storage.store[RESOURCE_ENERGY] > provider.storage.store[RESOURCE_ENERGY]) {
                    provider = r;
                }
            }
        }
    }
    if (provider !== undefined) {
        return provider;
    }
}
exports.findCrisisHaulProvider = findCrisisHaulProvider;
