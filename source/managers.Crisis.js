"use strict";
const ProfileUtilities = require("./utilities.Profiles");
const OrdersRepository = require("./repository.Orders");
const Pioneer = require("./roles.Pioneer");
const OperationLib = require("./lib.operation");
const RoomRepository = require("./repository.Room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
const _Manager_1 = require("./managers._Manager");
const Order_1 = require("./classes.Order");
const Logger_1 = require("./tools.Logger");
class CrisisManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("CrisisManager");
        this.hasRun = false;
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 500 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    this.checkIfRoomNeedsEnergyConvoy(room);
                    checkIfRoomSeemsDead(room);
                    this.checkIfWeNeedPioneer(room);
                    if (Memory.settings.bot === true) {
                        this.checkIfRoomShouldBeAbandoned(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.Pioneer, Pioneer.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    this.checkIfRoomNeedsEnergyConvoy(room);
                    checkIfRoomSeemsDead(room);
                    this.checkIfWeNeedPioneer(room);
                    if (Memory.settings.bot === true) {
                        this.checkIfRoomShouldBeAbandoned(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        }
    }
    checkIfRoomShouldBeAbandoned(room) {
        let level = RoomRepository.getRoomLevel(room);
        if (level === roomlevel_1.RoomLevel.Metropolis) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 7) {
                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        }
        else if (level === roomlevel_1.RoomLevel.City) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 5) {
                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        }
        else if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 3) {
                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        }
    }
    abandonRoom(room) {
        if (room.controller === undefined) {
            return;
        }
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        for (let c of creepsInRoom) {
            c.suicide();
        }
        room.memory.badExpansion = true;
        room.controller.unclaim();
    }
    checkIfWeNeedPioneer(room) {
        if (room.isExpansion()) {
            return;
        }
        let spawnedPioneers = this.creepService.getCreeps(role_1.Role.Pioneer, null, room.name).length;
        let orderedPioneers = OrdersRepository.getCreepsInQueue(room, role_1.Role.Pioneer, room.name);
        let spawnedMiners = this.creepService.getCreeps(role_1.Role.ContainerMiner, null, room.name).length;
        let spawnedHaulers = this.creepService.getCreeps(role_1.Role.ContainerHauler, null, room.name).length +
            this.creepService.getCreeps(role_1.Role.EnergyHauler, null, room.name).length;
        if (RoomRepository.getAllOutposts(room).length === 0) {
            return;
        }
        if (spawnedPioneers < 3 && orderedPioneers === 0 && spawnedMiners < 2 && spawnedHaulers < 2) {
            orderPioneer(room);
            let expansionWorkers = this.creepService.getCreeps(role_1.Role.ExpansionWorker, null, room.name).length;
            if (expansionWorkers === 0) {
                this.requestExpansionWorker(room);
            }
        }
        else if (room.getBaseContainer() === undefined && (room.storage === undefined || !room.storage.isActive()) &&
            (room.terminal === undefined || !room.terminal.isActive())) {
            let expansionWorkers = this.creepService.getCreeps(role_1.Role.ExpansionWorker, null, room.name).length;
            if (expansionWorkers < 2) {
                this.requestExpansionWorker(room);
            }
        }
    }
    requestExpansionWorker(room) {
        let providerRoom;
        let distance;
        let allRooms = this.roomService.getNormalRooms();
        for (let r of allRooms) {
            if (r.name !== room.name) {
                let d = Game.map.getRoomLinearDistance(room.name, r.name);
                if (distance === undefined || d < distance) {
                    providerRoom = r;
                    distance = d;
                }
            }
        }
        if (providerRoom !== undefined) {
            this.orderExpansionWorker(providerRoom, room.name);
        }
    }
    orderExpansionWorker(room, targetRoom) {
        let maxTier = ProfileUtilities.getMaxTierHaulerEngineer(room.energyCapacityAvailable);
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.ExpansionWorker, targetRoom);
        if (ordered === 0) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerEngineerBody(maxTier);
            order.priority = priority_1.Priority.Low;
            order.memory = { role: role_1.Role.ExpansionWorker, target: targetRoom, tier: maxTier };
            OrdersRepository.orderCreep(room, order);
        }
    }
    checkIfRoomNeedsEnergyConvoy(room) {
        let level = RoomRepository.getRoomLevel(room);
        if (level >= roomlevel_1.RoomLevel.CivilizedColony && (room.terminal === undefined || !room.terminal.isActive()) &&
            room.storage !== undefined && room.storage.isActive() && room.storage.store[RESOURCE_ENERGY] < 10000 &&
            !OperationLib.roomIsReceiveingHaulOperation(room.name)) {
            OperationLib.createCrisisHaulOperation(room.name, this.roomService.getNormalRooms());
        }
    }
}
exports.CrisisManager = CrisisManager;
function orderPioneer(room) {
    let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyAvailable);
    if (maxTier < 1) {
        return;
    }
    let order = new Order_1.Order();
    order.body = ProfileUtilities.getEngineerBody(maxTier);
    order.priority = priority_1.Priority.Blocker;
    order.memory = { role: role_1.Role.Pioneer, target: room.name, tier: maxTier };
    OrdersRepository.orderCreep(room, order);
}
function checkIfRoomSeemsDead(room) {
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    if (creepsInRoom.length < 2 && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) {
        OrdersRepository.clearOrders(room);
    }
}
