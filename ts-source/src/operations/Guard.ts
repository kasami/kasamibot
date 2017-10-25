/**
 * Operation: Guard
 *
 * Used to guard a room, making sure a Ranger is there at all times
 *
 * End-condition:
 * - Time
 *
 */

import {ManagerPriority} from "../managers/_Manager";
import {OperationType} from "../enums/operationtypes";
import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import {IOperationData} from "../operations/_OperationData";

import * as OrdersRepository from "../repository/Orders";

import {CreepService} from "../services/Creep";

import {Order} from "../classes/Order";

import * as ProfileUtilities from "../utilities/Profiles";

export enum VictoryCondition {
    Gametime = 1
}

export class Data implements IOperationData {
    operationtype: OperationType = OperationType.Guard;
    /** Is the operation currenty active TODO: use this with pauseconditions? */
    active: boolean = true;
    /** Victory-condition for operation */
    victoryCondition: VictoryCondition;
    /** Victory-condition value */
    victoryValue: any;
    /** Room used to spawn guards */
    room: string;
    /** Room to guard */
    targetRoom: string;

    /* Last tick we ordered a guard */
    lastOrder: number | undefined;
    /* Unittype to use for guarding */
    unitType: Role;
}

export function run(operation: Data, creepService: CreepService, pri: ManagerPriority): void {
    if (pri === ManagerPriority.Low) {
        if (Game.time % 50 === 0) {
            orderUnitsIfNeeded(operation, creepService);
        }
    }
}

export function victoryConditionReached(operation: Data): boolean {
    switch(operation.victoryCondition) {
        case VictoryCondition.Gametime:
            if (Game.time > operation.victoryValue + 10000) {
                operation.active = false;
                return true;
            }
    }
    return false;
}

function orderUnitsIfNeeded(operation: Data, creepService: CreepService) {
    if (Game.time > operation.victoryValue) {
        return;
    }
    let spawnRoom = Game.rooms[operation.room];
    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
        return;
    }

    if (operation.unitType === undefined) {
        if (_.random(1, 10) > 5) {
            operation.unitType = Role.Ranger;
        } else {
            operation.unitType = Role.Paladin;
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
            case Role.Ranger:
                orderRanger(spawnRoom, operation.targetRoom);
                break;
            case Role.Paladin:
                orderPaladin(spawnRoom, operation.targetRoom);
                break;
            default:
                break;
        }
    }

    if (spawnRoom.controller === undefined || spawnRoom.controller.level < 8) {
        return;
    }

    let otherType = Role.Paladin;
    if (operation.unitType === otherType) {
        otherType = Role.Ranger;
    }

    current = creepService.getCreeps(otherType, operation.targetRoom, spawnRoom.name).length;
    ordered = OrdersRepository.getCreepsInQueue(spawnRoom, otherType, operation.targetRoom);

    if (current + ordered === 0) {
        switch (otherType) {
            case Role.Ranger:
                orderRanger(spawnRoom, operation.targetRoom);
                break;
            case Role.Paladin:
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

function orderRanger(spawnRoom: Room, targetRoom: string) {

    let maxTier = ProfileUtilities.getMaxTierRanger(spawnRoom.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = Priority.Important;
    order.memory = {role: Role.Ranger, target: targetRoom, tier: maxTier};

    OrdersRepository.orderCreep(spawnRoom, order);
}

function orderPaladin(spawnRoom: Room, targetRoom: string) {
    
    let maxTier = ProfileUtilities.getMaxTierPaladin(spawnRoom.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getPaladinBody(maxTier);
    order.priority = Priority.Important;
    order.memory = {role: Role.Paladin, target: targetRoom, tier: maxTier};

    OrdersRepository.orderCreep(spawnRoom, order);
}