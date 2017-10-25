/**
 * Operation: Spawnmove
 *
 * Spawnmove is a special operation used by the bot to move a randomly placed spawn into the base.
 *
 * End-condition:
 * - Spawn is built in the right place (Basepos)
 *
 */

import {CreepService} from "../services/Creep";

import {ManagerPriority} from "../managers/_Manager";
import {OperationType} from "../enums/operationtypes";
import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import * as OrdersRepository from "../repository/Orders";

import {IOperationData} from "../operations/_OperationData";

import {Order} from "../classes/Order";

import * as ProfileUtilities from "../utilities/Profiles";

enum MoveState {
    Waiting = 1,
    Preparing = 2,
    Moving = 3,
    Finished = 4
}

export enum VictoryCondition {
    Spawnmoved = 1
}

export class Data implements IOperationData {
    operationtype: OperationType = OperationType.Spawnmove;
    /** Is the operation currenty active TODO: use this with pauseconditions? */
    active: boolean = true;
    /** Victory-condition for operation */
    victoryCondition: VictoryCondition;
    /** Victory-condition value */
    victoryValue: RoomPosition;
    /** Roomname */
    roomName: string;
    /** The current state of the move */
    state: MoveState = 1;
}

export function run(operation: Data, pri: ManagerPriority, creepService: CreepService): void {
    if (pri === ManagerPriority.Standard && Game.time % 5 === 0) {
        if (operation.state === MoveState.Waiting) {
            checkIfWeCanStartPreparing(operation);
        } else
        if (operation.state === MoveState.Preparing) {
            checkIfWeCanStartMoving(operation, creepService);
        } else
        if (operation.state === MoveState.Moving) {
            checkIfSpawnHasBeenBuilt(operation);
        }
    }
}

export function victoryConditionReached(operation: Data): boolean {
    if (operation.state === MoveState.Finished) {
        return true;
    } else {
        return false;
    }
}

function checkIfWeCanStartPreparing(operation: Data) {
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

function checkIfWeCanStartMoving(operation: Data, creepService: CreepService) {
    let room = Game.rooms[operation.roomName];
    if (room === undefined) {
        return;
    }
    let spawn = room.getSpawn();
    if (spawn === undefined) {
        return;
    }
    let builders = _.filter(creepService.getCreeps(Role.BaseBuilder, operation.roomName, operation.roomName),
        (c: Creep) => c.ticksToLive < 1500 && c.ticksToLive > 200);
    if (builders.length < 3) {
        orderBaseBuilders(room, creepService);
        return;
    }
    let enemies = room.find(FIND_HOSTILE_CREEPS) as Creep[];
    if (enemies.length > 0) {
        return;
    }
    if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 20000) {
        return;
    }

    spawn.destroy();
    operation.state = MoveState.Moving;
}

function checkIfSpawnHasBeenBuilt(operation: Data) {
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
        } else {
            spawn.destroy();
        }
    } else {
        basePos.createConstructionSite(STRUCTURE_SPAWN);
    }
}

function orderBaseBuilders(room: Room, creepService: CreepService) {
    let current = creepService.getCreeps(Role.BaseBuilder, room.name, room.name).length;
    let ordered = OrdersRepository.getCreepsInQueue(room, Role.BaseBuilder, room.name);

    if (current < 4 && ordered === 0) {
        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
        let order = new Order();
        order.body = ProfileUtilities.getConsultantBody(maxTier);
        order.priority = Priority.Important;
        order.memory = {role: Role.BaseBuilder, target: room.name, tier: maxTier};

        OrdersRepository.orderCreep(room, order);
    }
}

function getBasePos(operation: Data): RoomPosition | undefined {
    if (operation.victoryValue.x !== undefined && operation.victoryValue.y !== undefined) {
        return new RoomPosition(operation.victoryValue.x, operation.victoryValue.y, operation.roomName);
    }
}
