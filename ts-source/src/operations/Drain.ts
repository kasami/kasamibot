/**
 * Operation: Drain
 *
 * Used to drain a hostile room for energy, using drainers
 *
 * End-condition:
 * - Hostile room energy reaches 0 (storage + towers)
 *
 * Pause-condition: TODO: Not implemented
 * - Drainers die with more than 500 ticks left
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
import * as PathfindingUtilities from "../utilities/Pathfinding";

export enum VictoryCondition {
    HostileRoomEnergy = 1,
    Gametime = 2
}

export class Data implements IOperationData {
    operationtype: OperationType = OperationType.Drain;
    /** Is the operation currenty active TODO: use this with pauseconditions? */
    active: boolean = true;
    /** Victory-condition for operation */
    victoryCondition: VictoryCondition;
    /** Victory-condition value */
    victoryValue: any;
    /** Room to spawn units */
    spawnRoom: string;
    /** Toom to drain */
    targetRoom: string;
    /** Route to room to drain */
    targetRoute: string[];
    /** What tier of drainers to use */
    tier: number;

    distanceToTargetRoom?: number; // TODO: Not implemented usage
}

export function run(operation: Data, creepService: CreepService, pri: ManagerPriority): void {
    if (pri === ManagerPriority.Standard) {
        if (Game.time % 50 === 0) {
            checkDrainerAmount(operation, creepService);
        }
    }
}

export function victoryConditionReached(operation: Data): boolean {
    let targetRoom = Game.rooms[operation.targetRoom];
    if (!(targetRoom instanceof Room)) {
        return false;
    }
    switch(operation.victoryCondition) {
        case VictoryCondition.HostileRoomEnergy:
            let towers = targetRoom.find(FIND_HOSTILE_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER}) as StructureTower[];
            let towerEnergy = _.sum(towers, (t: StructureTower) => t.energy);
            if (towerEnergy === 0 && (targetRoom.storage === undefined || targetRoom.storage.store[RESOURCE_ENERGY] === 0 ) &&
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

function checkDrainerAmount(operation: Data, creepService: CreepService) {
    let spawnRoom = Game.rooms[operation.spawnRoom];
    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
        return;
    }

    if (operation.distanceToTargetRoom === undefined) {
        let toPos = new RoomPosition(25, 25, operation.targetRoom);
        operation.distanceToTargetRoom = PathfindingUtilities.getDistanseBetween(spawnRoom.storage.pos, toPos);
    }

    let current = creepService.getCreeps(Role.Drainer, null, operation.spawnRoom).length;
    let ordered = OrdersRepository.getCreepsInQueue(spawnRoom, Role.Drainer);

    if (current + ordered < 2) {
        let order = new Order();
        order.body = ProfileUtilities.getDrainerBody(operation.tier);
        order.priority = Priority.Low;
        order.memory = {role: Role.Drainer, route: operation.targetRoute, tier: operation.tier};

        OrdersRepository.orderCreep(spawnRoom, order);
    }

}
