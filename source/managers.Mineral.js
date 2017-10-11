"use strict";
const ProfileUtilities = require("./utilities.Profiles");
const SourceUtilities = require("./utilities.Source");
const OrdersRepository = require("./repository.Orders");
const MineralMiner = require("./roles.MineralMiner");
const MineralHauler = require("./roles.MineralHauler");
const _Manager_1 = require("./managers._Manager");
const IntelLib = require("./lib.intel");
const Order_1 = require("./classes.Order");
const RoomRepository = require("./repository.Room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
class MineralManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("MineralManager");
        this.hasRun = false;
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 50 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                this.mineMinerals(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.MineralMiner, MineralMiner.run);
            this.creepService.runCreeps(role_1.Role.MineralHauler, MineralHauler.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                this.mineMinerals(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    mineMinerals(rooms) {
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town) {
                if (room.memory.miningMinerals) {
                    let mineral = room.getMineral();
                    if (mineral !== undefined && room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
                        _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                        this.orderMineralMiner(room);
                        this.orderMineralHauler(room, mineral);
                    }
                }
                else {
                    prepareMineralMining(room);
                }
            }
            let lairs = RoomRepository.getLairOutposts(room);
            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City && (lairs.length > 0 || room.memory.praiseroom !== undefined)) {
                let mineralOutposts = lairs;
                if (room.memory.praiseroomHibernated !== true) {
                    mineralOutposts = lairs.concat(room.memory.praiseroom);
                }
                for (let outpost of mineralOutposts) {
                    let outpostRoom = Game.rooms[outpost];
                    if (!IntelLib.hasInvaders(outpost) && outpostRoom !== undefined &&
                        (outpostRoom.controller === undefined || outpostRoom.controller.level > 5)) {
                        let mineral = outpostRoom.getMineral();
                        if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
                            room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
                            _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                            if (mineral.hasMiningContainer() && mineral.hasExtractor()) {
                                this.orderSKMineralMiner(room, mineral);
                                this.orderMineralHauler(room, mineral);
                            }
                            else {
                                prepareExternalMineralMining(mineral);
                            }
                        }
                    }
                }
            }
        }
    }
    orderMineralMiner(room) {
        let target = room.getMineral();
        if (target === undefined || target.ticksToRegeneration !== undefined) {
            return;
        }
        if (!target.hasMiningContainer()) {
            return;
        }
        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralMiner, target.id).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralMiner, target.id);
        let maxCount = 1;
        if (orderedWorkers + currentWorkers >= maxCount) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.MineralMiner, target: target.id, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderMineralHauler(room, mineral) {
        if (mineral === undefined) {
            return;
        }
        let container = mineral.getMiningContainer();
        if (container === null || _.sum(container.store) === 0) {
            return;
        }
        let target = mineral.room.name + "-" + mineral.id;
        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralHauler, target).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralHauler, target);
        if (orderedWorkers + currentWorkers >= 1) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let neededTiers = SourceUtilities.getTiersRequiredForMineralHauling(mineral, room);
        let usedTier = Math.min(maxTier, Math.max(neededTiers, 2));
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.MineralHauler, target: target, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderSKMineralMiner(room, mineral) {
        let target = mineral;
        if (target === undefined || target.ticksToRegeneration !== undefined) {
            return;
        }
        if (!target.hasMiningContainer()) {
            return;
        }
        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralMiner, target.id).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralMiner, target.id);
        let maxCount = 1;
        if (orderedWorkers + currentWorkers >= maxCount) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.MineralMiner, target: target.id, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.MineralManager = MineralManager;
function prepareMineralMining(room) {
    let mineral = room.getMineral();
    if (mineral) {
        let structsAtMineral = mineral.pos.lookFor(LOOK_STRUCTURES);
        if (structsAtMineral.length > 0 && structsAtMineral[0].structureType === STRUCTURE_EXTRACTOR) {
            let extractor = structsAtMineral[0];
            if (extractor.my) {
                room.memory.miningMinerals = true;
            }
            else {
                extractor.destroy();
            }
        }
        else {
            mineral.buildMiningContainer();
            mineral.buildExtractor();
        }
    }
}
function prepareExternalMineralMining(mineral) {
    if (mineral.room.memory.isPraiseRoom && mineral.room.controller !== undefined && mineral.room.controller.my && mineral.room.controller.level >= 6) {
        mineral.buildExtractor();
    }
    if (mineral && !mineral.hasMiningContainer()) {
        mineral.buildMiningContainer();
    }
}
