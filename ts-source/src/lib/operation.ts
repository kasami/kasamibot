import * as OperationHaul from "../operations/Haul";
import * as OperationGuard from "../operations/Guard";

import {IOperationData} from "../operations/_OperationData";
import {OperationType} from "../enums/operationtypes";

function addOperation(operation: IOperationData) {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    Memory.operations.push(operation);
}

export function roomIsReceiveingHaulOperation(roomName: string): boolean {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }

    if (Memory.operations.length === 0) {
        return false;
    }
    for (let o of Memory.operations as IOperationData[]) {
        if (o.active && o.operationtype === OperationType.Haul && (o as OperationHaul.Data).to === roomName) {
            return true;
        }
    }
    return false;
}

export function roomIsHavingActiveGuardOperation(roomName: string): boolean {
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }

    if (Memory.operations.length === 0) {
        return false;
    }
    for (let o of Memory.operations as IOperationData[]) {
        if (o.active && o.operationtype === OperationType.Guard && (o as OperationGuard.Data).targetRoom === roomName) {
            return true;
        }
    }
    return false;
}

export function createGuardOutpostOperation(room: Room, targetRoom: string): boolean {
    let op: OperationGuard.Data = new OperationGuard.Data();
    op.operationtype = OperationType.Guard;
    op.room = room.name;
    op.targetRoom = targetRoom;
    op.victoryCondition = OperationGuard.VictoryCondition.Gametime;
    op.victoryValue = Game.time + 8000;
    addOperation(op);
    console.log("Starting a operation from room " + room.name + " to guard outpost " + targetRoom + ", because it is wanted as outpost.");
    return true;
}

export function createCrisisHaulOperation(roomName: string, allRooms: Room[]): boolean {
    let provider = findCrisisHaulProvider(roomName, allRooms);
    if (provider === undefined) {
        return false;
    }
    let op: OperationHaul.Data = new OperationHaul.Data();
    op.operationtype = OperationType.Haul;
    op.from = provider.name;
    op.to = roomName;
    if (provider.controller !== undefined && provider.controller.level > 6) {
        op.amount = 20;
    } else {
        op.amount = 10;
    }
    op.victoryCondition = OperationHaul.VictoryCondition.Gametime;
    op.victoryValue = Game.time + 5000;
    addOperation(op);
    console.log("Starting a crisisconvoy from room " + provider + " to room " + roomName+", supplying 20 energy a tick.");
    return true;
}

export function findCrisisHaulProvider(roomName: string, providers: Room[]): Room | undefined {
    let provider: Room | undefined = undefined;
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
