import * as ProfileUtilities from "../utilities/Profiles";

import * as OrdersRepository from "../repository/Orders";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import {Order} from "../classes/Order";

export function orderWrecker(room: Room, route: string[]): void {
    let maxTier = ProfileUtilities.getMaxTierOffroadWorkOnly(room.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getOffroadWorkOnlyBody(maxTier);
    order.priority = Priority.Standard;
    order.memory = {
        role: Role.Wrecker,
        target: undefined,
        tier: maxTier,
        route: route
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderDrainer(room: Room, tier: number, route: string[]): void {
    //let maxTier = ProfileUtilities.getMaxTierOffroadWorkOnly(room.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getDrainerBody(tier);
    order.priority = Priority.Important;
    order.memory = {
        role: Role.Drainer,
        target: undefined,
        tier: tier,
        route: route
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderPaladin(room: Room, route: string[]): void {
    let maxTier = ProfileUtilities.getMaxTierPaladin(room.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getPaladinBody(maxTier);
    order.priority = Priority.Important;
    order.memory = {
        role: Role.Paladin,
        target: undefined,
        tier: maxTier,
        route: route
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderRanger(room: Room, route: string[]): void {
    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = Priority.Important;
    order.memory = {
        role: Role.Ranger,
        target: undefined,
        tier: maxTier,
        route: route
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderHarasser(room: Room, target: string): void {
    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
    let order = new Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = Priority.Standard;
    order.memory = {
        role: Role.Harasser,
        target: target,
        tier: maxTier
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderTagger(room: Room, target: string): void {

    let targetRoom = Game.rooms[target];

    if (targetRoom === undefined || targetRoom.controller === undefined || !targetRoom.controller.my) {
        let claimerOrder = new Order();
        claimerOrder.body = ProfileUtilities.getClaimerBody(1);
        claimerOrder.priority = Priority.Critical;
        claimerOrder.memory = {
            role: Role.RoomClaimer,
            target: target,
            tier: 1
        }
        OrdersRepository.orderCreep(room, claimerOrder);
    }

    let order = new Order();
    order.body = ProfileUtilities.getTaggerBody();
    order.priority = Priority.Important;
    order.memory = {
        role: Role.Tagger,
        target: target,
        tier: 1
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderDeclarer(room: Room, route: string[]): void {
    let order = new Order();
    order.body = ProfileUtilities.getScoutBody(1);
    order.priority = Priority.Trivial;
    order.memory = {
        role: Role.Declarer,
        route: route,
        tier: 1
    };

    OrdersRepository.orderCreep(room, order);
}

export function orderTeamWrecker(room: Room, tier: number, route: string[], targets: string[], boostLevel: number): void {
    let healerorder = new Order();
    healerorder.priority = Priority.Critical;
    healerorder.memory = {
        role: Role.TeamHealer,
        target: undefined,
        tier: tier};
    switch(boostLevel) {
        case 0:
            healerorder.body = ProfileUtilities.getB0TeamHealerBody(tier);
            break;
        case 1:
            healerorder.body = ProfileUtilities.getB1TeamHealerBody(tier);
            healerorder.memory.boost = [RESOURCE_GHODIUM_OXIDE, RESOURCE_LEMERGIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE];
            break;
        case 2:
            healerorder.body = ProfileUtilities.getB2TeamHealerBody(tier);
            healerorder.memory.boost = [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE];
            break;
        case 3:
            healerorder.body = ProfileUtilities.getB3TeamHealerBody(tier);
            healerorder.memory.boost = [RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE];
            break;
    }

    let wreckerorder = new Order();
    wreckerorder.priority = Priority.Critical;
    wreckerorder.memory = {
        role: Role.TeamWrecker,
        target: undefined,
        tier: tier,
        route: route,
        targets: targets
    };
    switch(boostLevel) {
        case 0:
            wreckerorder.body = ProfileUtilities.getB0TeamWreckerBody(tier);
            break;
        case 1:
            wreckerorder.body = ProfileUtilities.getB1TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_GHODIUM_OXIDE, RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_KEANIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE]
            break;
        case 2:
            wreckerorder.body = ProfileUtilities.getB2TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ACID, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE]
            break;
        case 3:
            wreckerorder.body = ProfileUtilities.getB3TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]
            break;
    }

    healerorder.twinOrder = wreckerorder;

    OrdersRepository.orderCreep(room, healerorder);
}
