"use strict";
const SourceUtilities = require("./utilities.Source");
const ProfileUtilities = require("./utilities.Profiles");
const ScoutingManager = require("./managers.Scouting");
const ContainerMiner = require("./roles.ContainerMiner");
const IntelLib = require("./lib.intel");
const Order_1 = require("./classes.Order");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
const _Manager_1 = require("./managers._Manager");
class MiningManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("MiningManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.ContainerMiner, ContainerMiner.run);
            this.creepService.runCreeps(role_1.Role.SKMiner, ContainerMiner.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (!room.isExpansion()) {
                        this.organizeEnergyMining(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    organizeEnergyMining(room) {
        let roomlevel = RoomRepository.getRoomLevel(room);
        let lairs = RoomRepository.getLairOutposts(room);
        if (roomlevel >= roomlevel_1.RoomLevel.City && lairs.length > 0) {
            for (let outpost of lairs) {
                if (!RoomRepository.isPortalRoom(outpost) || IntelLib.hasInvaders(outpost)) {
                    this.orderSKGuard(room, outpost);
                }
                if (RoomRepository.isPortalRoom(outpost) && IntelLib.hasInvaders(outpost)) {
                    this.orderPortalGuard(room, outpost);
                }
            }
        }
        if ((room.storage !== undefined && _.sum(room.storage.store) > (STORAGE_CAPACITY * 0.95))) {
            return;
        }
        let sources = SourceUtilities.getAllSourcesInRoom(room);
        if (roomlevel === undefined || roomlevel < roomlevel_1.RoomLevel.DefendedColony) {
            let sources = room.getSources();
            let outposts = RoomRepository.getBasicOutposts(room);
            for (let source of sources) {
                this.orderPioneers(room, source.id, source.pos, source.getMiningPositions().length);
            }
            for (let outpost of outposts) {
                if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
                    for (let sourceId of IntelLib.sourceIds(outpost)) {
                        let count = 1;
                        let source = Game.getObjectById(sourceId);
                        if (source !== null) {
                            count = source.getMiningPositions().length;
                        }
                        this.orderPioneers(room, sourceId, IntelLib.sourcePos(outpost, sourceId), count);
                    }
                }
            }
        }
        else {
            for (let source of sources) {
                this.orderContainerMiners(room, source.id, source.room.name);
                if (roomlevel < roomlevel_1.RoomLevel.City) {
                    this.orderContainerHaulers(room, source.id, source.room.name, source.pos);
                }
            }
            let outposts = RoomRepository.getBasicOutposts(room);
            for (let outpost of outposts) {
                if (!IntelLib.hasInvaders(outpost)) {
                    for (let sourceId of IntelLib.sourceIds(outpost)) {
                        this.orderContainerMiners(room, sourceId, outpost);
                        if (roomlevel < roomlevel_1.RoomLevel.City) {
                            this.orderContainerHaulers(room, sourceId, outpost, IntelLib.sourcePos(outpost, sourceId));
                        }
                    }
                }
                if (!IntelLib.hasIntel(outpost)) {
                    ScoutingManager.orderScouting(room, outpost);
                }
            }
            if (roomlevel >= roomlevel_1.RoomLevel.City && lairs.length > 0) {
                for (let outpost of lairs) {
                    if (!IntelLib.hasInvaders(outpost)) {
                        for (let sourceId of IntelLib.sourceIds(outpost)) {
                            this.orderContainerMiners(room, sourceId, outpost, true);
                        }
                    }
                }
            }
        }
    }
    orderPortalGuard(room, targetRoom) {
        let current = this.creepService.getCreeps(role_1.Role.SKGuard, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.SKGuard, targetRoom);
        if (current + ordered > 0) {
            return;
        }
        let lairs = RoomRepository.getLairOutposts(room);
        for (let outpost of lairs) {
            let guards = this.creepService.getCreeps(role_1.Role.SKGuard, outpost);
            for (let guard of guards) {
                if (guard.ticksToLive > 200) {
                    guard.memory.target = targetRoom;
                    console.log("SK-guard being reordered to portalroom:" + guard.id);
                    return;
                }
            }
        }
        this.orderSKGuard(room, targetRoom);
    }
    orderSKGuard(room, targetRoom) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.SKGuard);
        if (ordered > 0) {
            return;
        }
        let currentCreeps = this.creepService.getCreeps(role_1.Role.SKGuard, targetRoom);
        let current = currentCreeps.length;
        if (currentCreeps.length === 1 && (currentCreeps[0].ticksToLive > 300 || currentCreeps[0].ticksToLive === undefined)) {
            return;
        }
        if (current + ordered > 1) {
            return;
        }
        let guardOrder = new Order_1.Order();
        guardOrder.body = ProfileUtilities.getSKGuardBody();
        guardOrder.priority = priority_1.Priority.Critical;
        guardOrder.memory = { role: role_1.Role.SKGuard, target: targetRoom, tier: 1, token: "" + Game.time };
        let healerOrder = new Order_1.Order();
        healerOrder.body = ProfileUtilities.getSKHealerBody();
        healerOrder.priority = priority_1.Priority.Critical;
        healerOrder.memory = { role: role_1.Role.SKHealer, target: targetRoom, tier: 1, token: "" + Game.time };
        healerOrder.twinOrder = guardOrder;
        OrdersRepository.orderCreep(room, healerOrder);
    }
    orderPioneers(room, sourceId, sourcePos, miningPositions) {
        let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyCapacityAvailable);
        let spawn = room.getSpawn();
        if (spawn === undefined) {
            return;
        }
        let currentCreeps = this.creepService.getCreeps(role_1.Role.Pioneer, sourceId, room.name).length;
        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.Pioneer, sourceId, room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.Pioneer, sourceId);
        let wantedTiers = SourceUtilities.getTiersRequiredForPioneerMining(maxTier, miningPositions, spawn.pos, sourcePos);
        if (orderedTiers === 0 && currentTiers < wantedTiers && currentCreeps < 10) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getEngineerBody(maxTier);
            order.priority = priority_1.Priority.Standard;
            order.memory = { role: role_1.Role.Pioneer, tier: maxTier, target: sourceId };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderContainerMiners(room, sourceId, sourceRoom, skroom = false) {
        let target = sourceRoom + "-" + sourceId;
        let currentWorkers = this.creepService.getCreeps(role_1.Role.ContainerMiner, target);
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.ContainerMiner, target);
        if (currentWorkers.length > 1) {
            for (let c of currentWorkers) {
                c.memory.orderCopyTick = -1;
            }
        }
        if (orderedWorkers + currentWorkers.length > 0) {
            return;
        }
        if (room.controller === undefined || room.controller.level < 1) {
            console.log("Can not find controller in room: " + room.controller + " - " + room.name);
            return;
        }
        let usedTier = room.controller.level;
        let order = new Order_1.Order();
        if (skroom) {
            order.body = ProfileUtilities.getSkMinerBody(usedTier);
        }
        else {
            order.body = ProfileUtilities.getMinerBody(usedTier);
        }
        order.priority = priority_1.Priority.Standard;
        if (room.name === sourceRoom) {
            order.priority = priority_1.Priority.Important;
        }
        order.memory = { role: role_1.Role.ContainerMiner, target: target, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderContainerHaulers(room, sourceId, sourceRoom, sourcePos) {
        let target = sourceRoom + "-" + sourceId;
        let source = Game.getObjectById(sourceId);
        if (!(source instanceof Source) || !source.hasMiningContainer()) {
            return;
        }
        let currentMinersAtSource = this.creepService.getCreeps(role_1.Role.ContainerMiner, target).length;
        if (currentMinersAtSource < 1) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let neededTiers = SourceUtilities.getTiersRequiredForContainerHauling(sourcePos, room, 3000);
        let usedTier = Math.min(maxTier, neededTiers);
        let neededHaulers = 1;
        if (neededTiers > maxTier) {
            neededHaulers = 2;
            usedTier = Math.min(maxTier, Math.ceil(neededTiers / 2));
        }
        let currentWorkers = this.creepService.getCreeps(role_1.Role.ContainerHauler, target).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.ContainerHauler, target);
        if (orderedWorkers + currentWorkers >= neededHaulers) {
            return;
        }
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = priority_1.Priority.Standard;
        if (currentWorkers > 0) {
            order.priority = priority_1.Priority.Low;
        }
        if (room.name === sourceRoom) {
            order.priority = priority_1.Priority.Important;
        }
        order.memory = { role: role_1.Role.ContainerHauler, target: target, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.MiningManager = MiningManager;
