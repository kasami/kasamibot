"use strict";
const SourceUtilities = require("./utilities.Source");
const ProfileUtilities = require("./utilities.Profiles");
const ContainerHauler = require("./roles.ContainerHauler");
const EnergyHauler = require("./roles.EnergyHauler");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
const Order_1 = require("./classes.Order");
const _Manager_1 = require("./managers._Manager");
const Logger_1 = require("./tools.Logger");
class HaulingManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("HaulingManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.ContainerHauler, ContainerHauler.run);
            this.creepService.runCreeps(role_1.Role.EnergyHauler, EnergyHauler.run);
            this.creepService.runCreeps(role_1.Role.SKHauler, ContainerHauler.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                for (let room of rooms) {
                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City) {
                        this.organizeEnergyHauling(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
    organizeEnergyHauling(room) {
        let activeHaulers = this.creepService.getCreeps(role_1.Role.EnergyHauler, null, room.name);
        let sourcesIds = SourceUtilities.getSourcesNeedingHauling(room);
        let sourcesBeingServiced = [];
        for (let h of activeHaulers) {
            if (h.memory.target !== undefined) {
                sourcesBeingServiced.push(h.memory.target);
            }
        }
        room.memory.dumpSources = _.difference(sourcesIds, sourcesBeingServiced);
        let orderedHaulers = OrdersRepository.getCreepsInQueue(room, role_1.Role.EnergyHauler);
        if (orderedHaulers < 2) {
            let currentIdleHaulers = this.creepService.getIdleEnergyHaulers(room.name).length;
            if (currentIdleHaulers === 0) {
                if (room.memory.dumpSources !== undefined && room.memory.dumpSources.length > 0) {
                    orderEnergyhauler(room);
                }
            }
            if (Memory.settings.logEnergyhauling) {
                Logger_1.log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length + " (" + currentIdleHaulers + " idle)", room.name);
            }
        }
        else {
            if (Memory.settings.logEnergyhauling) {
                Logger_1.log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length, room.name);
            }
        }
    }
}
exports.HaulingManager = HaulingManager;
function orderEnergyhauler(room) {
    let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getHaulerBody(maxTier);
    order.priority = priority_1.Priority.Standard;
    if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 10000) {
        order.priority = priority_1.Priority.Important;
    }
    order.memory = { role: role_1.Role.EnergyHauler, target: undefined, tier: maxTier };
    OrdersRepository.orderCreep(room, order);
}
