"use strict";
const ProfileUtilities = require("./utilities.Profiles");
const OrdersRepository = require("./repository.Orders");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const Order_1 = require("./classes.Order");
function orderWrecker(room, route) {
    let maxTier = ProfileUtilities.getMaxTierOffroadWorkOnly(room.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getOffroadWorkOnlyBody(maxTier);
    order.priority = priority_1.Priority.Standard;
    order.memory = {
        role: role_1.Role.Wrecker,
        target: undefined,
        tier: maxTier,
        route: route
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderWrecker = orderWrecker;
function orderDrainer(room, tier, route) {
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getDrainerBody(tier);
    order.priority = priority_1.Priority.Important;
    order.memory = {
        role: role_1.Role.Drainer,
        target: undefined,
        tier: tier,
        route: route
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderDrainer = orderDrainer;
function orderPaladin(room, route) {
    let maxTier = ProfileUtilities.getMaxTierPaladin(room.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getPaladinBody(maxTier);
    order.priority = priority_1.Priority.Important;
    order.memory = {
        role: role_1.Role.Paladin,
        target: undefined,
        tier: maxTier,
        route: route
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderPaladin = orderPaladin;
function orderRanger(room, route) {
    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = priority_1.Priority.Important;
    order.memory = {
        role: role_1.Role.Ranger,
        target: undefined,
        tier: maxTier,
        route: route
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderRanger = orderRanger;
function orderHarasser(room, target) {
    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getRangerBody(maxTier);
    order.priority = priority_1.Priority.Standard;
    order.memory = {
        role: role_1.Role.Harasser,
        target: target,
        tier: maxTier
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderHarasser = orderHarasser;
function orderTagger(room, target) {
    let targetRoom = Game.rooms[target];
    if (targetRoom === undefined || targetRoom.controller === undefined || !targetRoom.controller.my) {
        let claimerOrder = new Order_1.Order();
        claimerOrder.body = ProfileUtilities.getClaimerBody(1);
        claimerOrder.priority = priority_1.Priority.Critical;
        claimerOrder.memory = {
            role: role_1.Role.RoomClaimer,
            target: target,
            tier: 1
        };
        OrdersRepository.orderCreep(room, claimerOrder);
    }
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getTaggerBody();
    order.priority = priority_1.Priority.Important;
    order.memory = {
        role: role_1.Role.Tagger,
        target: target,
        tier: 1
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderTagger = orderTagger;
function orderDeclarer(room, route) {
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getScoutBody(1);
    order.priority = priority_1.Priority.Trivial;
    order.memory = {
        role: role_1.Role.Declarer,
        route: route,
        tier: 1
    };
    OrdersRepository.orderCreep(room, order);
}
exports.orderDeclarer = orderDeclarer;
function orderTeamWrecker(room, tier, route, targets, boostLevel) {
    let healerorder = new Order_1.Order();
    healerorder.priority = priority_1.Priority.Critical;
    healerorder.memory = {
        role: role_1.Role.TeamHealer,
        target: undefined,
        tier: tier };
    switch (boostLevel) {
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
    let wreckerorder = new Order_1.Order();
    wreckerorder.priority = priority_1.Priority.Critical;
    wreckerorder.memory = {
        role: role_1.Role.TeamWrecker,
        target: undefined,
        tier: tier,
        route: route,
        targets: targets
    };
    switch (boostLevel) {
        case 0:
            wreckerorder.body = ProfileUtilities.getB0TeamWreckerBody(tier);
            break;
        case 1:
            wreckerorder.body = ProfileUtilities.getB1TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_GHODIUM_OXIDE, RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_KEANIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE];
            break;
        case 2:
            wreckerorder.body = ProfileUtilities.getB2TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ACID, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE];
            break;
        case 3:
            wreckerorder.body = ProfileUtilities.getB3TeamWreckerBody(tier);
            wreckerorder.memory.boost = [RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE];
            break;
    }
    healerorder.twinOrder = wreckerorder;
    OrdersRepository.orderCreep(room, healerorder);
}
exports.orderTeamWrecker = orderTeamWrecker;
