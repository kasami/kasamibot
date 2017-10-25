import * as ProfilesUtilities from "../utilities/Profiles";

import {Order}  from "../classes/Order";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import {log} from "../tools/Logger";

export function orderCreep(room: Room, order: Order): boolean {
    let costOfCreep = ProfilesUtilities.getCostForBody(order.body);
    if (costOfCreep > room.energyCapacityAvailable) {
        log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (order.body.length === 0 ) {
        log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (order.body.length > 50 ) {
        log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.memory), room.name);
        return false;
    }
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }

    if (order.twinOrder !== undefined) {
        let costOfCreep = ProfilesUtilities.getCostForBody(order.twinOrder.body);
        if (costOfCreep > room.energyCapacityAvailable) {
            log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
        if (order.twinOrder.body.length === 0 ) {
            log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
        if (order.twinOrder.body.length > 50 ) {
            log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.twinOrder.memory), room.name);
            return false;
        }
    }

    room.memory.orders.push(order);
    log.info("Ordered: " + Role[order.memory.role] + " T" + order.memory.tier +
        " (" + order.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
    if (order.twinOrder !== undefined) {
        log.info("Ordered: " + Role[order.twinOrder.memory.role] + " T" + order.twinOrder.memory.tier +
            " (" + order.twinOrder.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
    }

    return true;
}

/**
 * Get number of workerparts on creep-orders with role and target, where each can be set as null.
 */
export function getNumberOfTiersInQueue(room: Room, role: Role | null = null, target: string | null = null): number {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }

    let count = 0;
    for (let order of room.memory.orders){
        if ((target === null || order.memory.target === target) &&
            (role === null || order.memory.role === role)) {
            if (order.memory.tier) {
                count += order.memory.tier;
            } else {
                count++;
            }
        }
        if ((order as Order).twinOrder !== undefined) {
            if ((target === null || order.twinOrder.memory.target === target) &&
                (role === null || order.twinOrder.memory.role === role)) {
                if (order.twinOrder.memory.tier) {
                    count += order.twinOrder.memory.tier;
                } else {
                    count++;
                }
            }
        }
    }
    return count;
}

/**
 * Get number of creep-orders with role and target, where each can be set as null.
 */
export function getCreepsInQueue(room: Room, role: Role | null = null, target: string | null = null): number {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }

    let count = 0;
    for (let order of room.memory.orders){
        if ((target === null || order.memory.target === target) &&
            (role === null || order.memory.role === role)) {
            count++;
        }
        if ((order as Order).twinOrder !== undefined) {
            if ((target === null || order.twinOrder.memory.target === target) &&
                (role === null || order.twinOrder.memory.role === role)) {
                count++;
            }
        }
    }
    return count;
}

export function getCreepsInQueueWithHomeRoom(room: Room, role: Role | null = null, homeroom: string | null = null): number {
    if (room.memory.orders === undefined) {
        room.memory.orders = [];
    }

    let count = 0;
    for (let order of room.memory.orders){
        if ((homeroom === null || order.memory.homeroom === homeroom) &&
            (role === null || order.memory.role === role)) {
            count++;
        }
    }
    return count;
}

export function orderedBaseHaulerIsTooExpensive(room: Room): boolean {
    if (room.memory.orders === undefined) {
        return false;
    }
    let spawns = room.getSpawns();
    for (let s of spawns) {
        if (s.spawning) {
            return false;
        }
    }

    for (let order of room.memory.orders){
        if ((order.memory.role === Role.BaseHauler)) {
            order.priority = Priority.Critical;
            return (order.memory.tier * 150) > room.energyAvailable;
        }
    }

    return false;
}

export function clearOrders(room: Room): void {
    room.memory.orders = [];
    log.info("Clearing order queue for room", room.name);
}
