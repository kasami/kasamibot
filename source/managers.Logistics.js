"use strict";
const _Manager_1 = require("./managers._Manager");
const ProfileUtilities = require("./utilities.Profiles");
const BaseHauler = require("./roles.BaseHauler");
const BaseCourier = require("./roles.BaseCourier");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const Order_1 = require("./classes.Order");
const role_1 = require("./enums.role");
const roomlevel_1 = require("./enums.roomlevel");
const priority_1 = require("./enums.priority");
class LogisticsManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("LogisticsManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            this.creepService.runCreeps(role_1.Role.BaseHauler, BaseHauler.run);
            this.creepService.runCreeps(role_1.Role.BaseCourier, BaseCourier.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                this.orderTransportUnits(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    orderTransportUnits(rooms) {
        for (let room of rooms) {
            if (this.shouldOrderBaseCourier(room)) {
                this.orderBaseCourier(room);
            }
            if (this.shouldOrderBaseHaulers(room)) {
                this.orderBaseHauler(room);
            }
        }
    }
    shouldOrderBaseCourier(room) {
        if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.AdvancedColony) {
            return false;
        }
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseCourier, room.name);
        let active = this.creepService.getCreeps(role_1.Role.BaseCourier, room.name);
        if (ordered + active.length > 0) {
            if (ordered === 0 && active.length === 1 && active[0].ticksToLive < 100) {
                return true;
            }
            return false;
        }
        return true;
    }
    shouldOrderBaseHaulers(room) {
        if (room.isExpansion() || RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.DefendedColony) {
            return false;
        }
        if (room.storage === undefined || !room.storage.isActive()) {
            let baseContainer = room.getBaseContainer();
            if (baseContainer === undefined) {
                return false;
            }
        }
        let orderedbaseHaulers = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseHauler, room.name);
        let activeBaseHaulers = this.creepService.getCreeps(role_1.Role.BaseHauler, room.name);
        if (room.isUnderSiege() && (orderedbaseHaulers + activeBaseHaulers.length) < 2 && room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            return true;
        }
        if (orderedbaseHaulers > 0) {
            if (activeBaseHaulers.length === 0 && orderedbaseHaulers < 2 && OrdersRepository.orderedBaseHaulerIsTooExpensive(room)) {
                return true;
            }
            return false;
        }
        if (RoomRepository.getRoomLevel(room) === roomlevel_1.RoomLevel.CivilizedColony && room.storage !== undefined &&
            room.storage.store[RESOURCE_ENERGY] > 200000 && activeBaseHaulers.length < 2) {
            return true;
        }
        if (activeBaseHaulers.length > 0) {
            if (activeBaseHaulers[0].ticksToLive < 200 && activeBaseHaulers.length === 1) {
                return true;
            }
            return false;
        }
        return true;
    }
    orderBaseHauler(room) {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let usedTier = maxTier;
        let count = this.creepService.getCreeps(role_1.Role.BaseHauler, room.name).length;
        if (count === 0) {
            usedTier = ProfileUtilities.getMaxTierHauler(room.energyAvailable);
            if (usedTier < 1) {
                usedTier = 1;
            }
        }
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        if (count > 0 && room.isUnderSiege()) {
            order.priority = priority_1.Priority.Important;
        }
        else if (room.storage === undefined) {
            order.priority = priority_1.Priority.Low;
        }
        else {
            order.priority = priority_1.Priority.Blocker;
        }
        order.memory = { role: role_1.Role.BaseHauler, target: room.name, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderBaseCourier(room) {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let usedTier = Math.ceil(maxTier / 2);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = priority_1.Priority.Important;
        order.memory = { role: role_1.Role.BaseCourier, target: room.name, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.LogisticsManager = LogisticsManager;
