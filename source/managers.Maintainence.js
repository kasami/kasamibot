"use strict";
const _Manager_1 = require("./managers._Manager");
const OrdersRepository = require("./repository.Orders");
const ProfileUtilities = require("./utilities.Profiles");
const Order_1 = require("./classes.Order");
const RoomLib = require("./lib.room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const Janitor = require("./roles.Janitor");
class MaintainenceManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("MaintainenceManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.Janitor, Janitor.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (RoomLib.roomShouldHaveJanitors(room)) {
                        this.orderJanitor(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    orderJanitor(room) {
        let ordered = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.Janitor, room.name);
        let spawned = this.creepService.getNumberOfTiers(role_1.Role.Janitor, room.name);
        if (ordered + spawned > 0) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierDistanceWorker(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getDistanceWorkerBody(maxTier);
        order.priority = priority_1.Priority.Important;
        order.memory = { role: role_1.Role.Janitor, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.MaintainenceManager = MaintainenceManager;
