"use strict";
const _Manager_1 = require("./managers._Manager");
const ProfileUtilities = require("./utilities.Profiles");
const PathfindingUtilities = require("./utilities.Pathfinding");
const Upgrader = require("./roles.Upgrader");
const UpgraderHauler = require("./roles.UpgraderHauler");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const Order_1 = require("./classes.Order");
const EnergyLib = require("./lib.energy");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
class UpgradeManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("UpgradeManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            this.creepService.runCreeps(role_1.Role.UpgraderWithBoost, Upgrader.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.UpgraderWithoutBoost, Upgrader.run);
            this.creepService.runCreeps(role_1.Role.UpgraderHauler, UpgraderHauler.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                this.setPraiseBoosting(rooms);
                this.buildUpgradeStorage(rooms);
                this.orderUpgradeUnits(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    setPraiseBoosting(rooms) {
        if (Memory.settings.slow === true) {
            return;
        }
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned() || room.isExpansion())
                continue;
            if (room.controller.my && room.controller.level < 8 && room.storage !== undefined) {
                if (room.storage.store[RESOURCE_ENERGY] > 300000 && room.memory.praiseBoost !== true) {
                    console.log("Automatic praiseboost started in room: " + room.name);
                    room.memory.praiseBoost = true;
                    room.memory.praiseBoostAutomatic = true;
                }
                else if (room.storage.store[RESOURCE_ENERGY] < 100000 && room.memory.praiseBoost === true && room.memory.praiseBoostAutomatic === true) {
                    console.log("Automatic praiseboost stopped in room: " + room.name);
                    room.memory.praiseBoost = undefined;
                    room.memory.praiseBoostAutomatic = undefined;
                }
            }
            else if (room.controller.my && room.controller.level === 8 && room.memory.praiseBoost === true) {
                room.memory.praiseBoost = undefined;
                room.memory.praiseBoostAutomatic = undefined;
            }
        }
    }
    buildUpgradeStorage(rooms) {
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned())
                continue;
            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion && RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.AdvancedColony) {
                room.controller.buildControllerContainer();
            }
            else if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.AdvancedColony) {
                room.controller.buildControllerLink();
            }
        }
    }
    orderUpgradeUnits(rooms) {
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned() || room.isExpansion())
                continue;
            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && (room.controller.hasContainer() || room.controller.hasLink())) {
                this.orderUpgraders(room.controller);
            }
            if (room.memory.praiseBoost && room.controller.level < 8) {
                this.orderControllerHauler(room.controller);
            }
        }
    }
    orderControllerHauler(controller) {
        if (controller.room.storage === undefined) {
            return;
        }
        let praisingPerTick = Math.floor(this.creepService.getNumberOfTiers(role_1.Role.Upgrader, controller.id) * 2.5);
        let distanceFromStorage = PathfindingUtilities.getDistanseBetween(controller.room.storage.pos, controller.pos);
        let neededTiers = Math.floor((praisingPerTick * distanceFromStorage * 2) / 100);
        let activeUpgraders = this.creepService.getCreeps(role_1.Role.Upgrader, null, controller.room.name);
        let activeTiers = this.creepService.getNumberOfTiers(role_1.Role.UpgraderHauler, null, controller.room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(controller.room, role_1.Role.UpgraderHauler);
        if (activeUpgraders.length > 1 && activeTiers + orderedTiers < neededTiers) {
            let usedTier = Math.max(4, Math.min((neededTiers), ProfileUtilities.getMaxTierHauler(controller.room.energyCapacityAvailable)));
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerBody(usedTier);
            order.priority = priority_1.Priority.Standard;
            order.memory = { role: role_1.Role.UpgraderHauler, target: controller.id, tier: usedTier };
            OrdersRepository.orderCreep(controller.room, order);
        }
    }
    orderUpgraders(controller) {
        let needed = 1;
        let activeCreeps = this.creepService.getCreeps(role_1.Role.Upgrader, controller.id);
        let ordered = OrdersRepository.getCreepsInQueue(controller.room, role_1.Role.Upgrader, controller.id);
        if (controller.level === 8) {
            let energyLimit = 200000;
            if (Memory.settings.powerfocus === true) {
                energyLimit = 450000;
            }
            if (controller.ticksToDowngrade < 10000 ||
                (controller.room.storage !== undefined && controller.room.storage.store.energy > energyLimit)) {
                needed = 1;
            }
            else {
                return;
            }
        }
        else if (controller.room.storage === undefined && EnergyLib.roomIsFull(controller.room)) {
            let controllerContainer = controller.getContainer();
            if (ordered === 0 && controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] > (controllerContainer.storeCapacity / 2)) {
                needed = Math.min(activeCreeps.length + 1, 7);
            }
        }
        else if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] > 200000 && controller.level === 5) {
            needed = 2;
        }
        else if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] < 30000) {
            return;
        }
        let activeWorkerparts = Math.floor(this.creepService.getNumberOfTiers(role_1.Role.Upgrader, controller.id) * 2.5);
        let orderedWorkerparts = Math.floor(OrdersRepository.getNumberOfTiersInQueue(controller.room, role_1.Role.Upgrader, controller.id) * 2.5);
        let active = activeCreeps.length;
        if (controller.room.storage !== undefined) {
            for (let c of activeCreeps) {
                if (c.ticksToLive !== undefined && c.ticksToLive < 100) {
                    active--;
                }
            }
        }
        let energyInRoom = 0;
        if (controller.room.storage !== undefined) {
            energyInRoom += controller.room.storage.store[RESOURCE_ENERGY];
        }
        if (controller.room.terminal !== undefined) {
            energyInRoom += controller.room.terminal.store[RESOURCE_ENERGY];
        }
        if (controller.room.memory.praiseBoost && controller.level < 8 && energyInRoom > 50000) {
            if (controller.level < 7) {
                needed = 3;
            }
            else {
                needed = 5;
            }
        }
        if (active + ordered < needed && (activeWorkerparts + orderedWorkerparts < 60 || controller.room.memory.praiseBoost)) {
            let usedTier = ProfileUtilities.getMaxTierStationaryWorker(controller.room.energyCapacityAvailable);
            let boost = undefined;
            if (controller.level === 8) {
                usedTier = Math.min(usedTier, 6);
            }
            if (!controller.room.memory.praiseBoost && controller.room.getBoostLab() !== undefined && controller.room.terminal !== undefined &&
                controller.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] >= 1000) {
                boost = [RESOURCE_CATALYZED_GHODIUM_ACID];
            }
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getStationaryWorkerBody(usedTier);
            order.priority = priority_1.Priority.Standard;
            if (active > 3) {
                order.priority = priority_1.Priority.Low;
            }
            order.memory = { role: role_1.Role.Upgrader, target: controller.id, tier: usedTier, boost: boost };
            OrdersRepository.orderCreep(controller.room, order);
        }
    }
}
exports.UpgradeManager = UpgradeManager;
