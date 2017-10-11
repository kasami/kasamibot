"use strict";
const ProfileUtilities = require("./utilities.Profiles");
const PathfindingUtilities = require("./utilities.Pathfinding");
const OrdersRepository = require("./repository.Orders");
const PoachGuard = require("./roles.PoachGuard");
const PoachMiner = require("./roles.PoachMiner");
const PoachHauler = require("./roles.PoachHauler");
const _Manager_1 = require("./managers._Manager");
const IntelLib = require("./lib.intel");
const Order_1 = require("./classes.Order");
const RoomRepository = require("./repository.Room");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
const hostility_1 = require("./enums.hostility");
const Logger_1 = require("./tools.Logger");
class PoachingManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("PoachingManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.MEMORY_LASTRUNBOT = "lastRunBot";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (Memory.settings.slow === true) {
            return;
        }
        if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.PoachGuard, PoachGuard.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.PoachHauler, PoachHauler.run);
            this.creepService.runCreeps(role_1.Role.PoachMiner, PoachMiner.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 50 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (room.memory.poaching !== undefined && !room.isUnderSiege() && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City) {
                        this.runPoaching(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            if (Memory.settings.bot === true) {
                let lastRunBot = this.getValue(this.MEMORY_LASTRUNBOT);
                if (lastRunBot === undefined || lastRunBot + 500 < Game.time) {
                    let rooms = this.roomService.getNormalRoomsNotAbandoned();
                    for (let room of rooms) {
                        if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City && !room.isUnderSiege()) {
                            this.setBotPoachingRoom(room);
                        }
                    }
                    this.setValue(this.MEMORY_LASTRUNBOT, Game.time);
                }
            }
        }
    }
    runPoaching(room) {
        for (let outpost of room.memory.poaching) {
            let o = Game.rooms[outpost];
            if (o !== undefined) {
                let mineral = o.getMineral();
                if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
                    room.storage !== undefined && (room.storage.store[mineral.mineralType] === undefined || room.storage.store[mineral.mineralType] < 250000) &&
                    _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                    let guards = this.creepService.getCreeps(role_1.Role.PoachGuard, outpost).length;
                    if (guards > 0) {
                        this.orderPoachMiners(room, mineral);
                        this.orderPoachHaulers(room, mineral);
                    }
                    else {
                        this.orderPoachGuard(room, outpost);
                    }
                }
            }
            else {
                let intelTime = IntelLib.intelTime(outpost);
                let mineralTicks = IntelLib.mineralTicks(outpost);
                if (intelTime === undefined || mineralTicks === undefined || (intelTime + mineralTicks < Game.time)) {
                    this.orderPoachGuard(room, outpost);
                }
            }
        }
    }
    setBotPoachingRoom(room) {
        if (room.memory.poaching !== undefined && room.memory.poaching.length > 0) {
            this.checkIfPoachIsFinished(room);
        }
        if (room.memory.poaching === undefined || room.memory.poaching.length === 0) {
            this.checkIfWeCanPoach(room);
        }
    }
    checkIfPoachIsFinished(room) {
        for (let outpost of room.memory.poaching) {
            let intelTime = IntelLib.intelTime(outpost);
            let mineralTicks = IntelLib.mineralTicks(outpost);
            if (intelTime !== undefined && mineralTicks !== undefined) {
                Logger_1.log.info("Poaching of minerals in room " + outpost + " seems to be finished. Removing it from list.", room.name);
                room.memory.poaching = undefined;
                return;
            }
        }
    }
    checkIfWeCanPoach(room) {
        if (room.memory.neighbours === undefined || room.memory.neighbours.twoAway === undefined || room.memory.neighbours.threeAway === undefined) {
            return;
        }
        let secondNeighbours = _.filter(room.memory.neighbours.twoAway, (r) => RoomRepository.isMiddleRoom(r));
        let thirdNeighbours = _.filter(room.memory.neighbours.threeAway, (r) => RoomRepository.isMiddleRoom(r));
        let potNeighbours = secondNeighbours.concat(thirdNeighbours);
        if (potNeighbours.length === 0) {
            return;
        }
        let allOutposts = RoomRepository.getAllOutpostsInAllRooms(this.roomService.getNormalRooms());
        let allPoachrooms = RoomRepository.getAllPoachroomsInAllRooms(this.roomService.getNormalRooms());
        let possiblePoachrooms = _.filter(potNeighbours, (r) => !_.contains(allOutposts, r) && !_.contains(allPoachrooms, r));
        if (possiblePoachrooms.length === 0) {
            return;
        }
        for (let possibleRoom of possiblePoachrooms) {
            let intelTime = IntelLib.intelTime(possibleRoom);
            let mineralTicks = IntelLib.mineralTicks(possibleRoom);
            let hostility = IntelLib.roomHostility(possibleRoom);
            if (hostility < hostility_1.Hostility.HarmlessHostiles && intelTime !== undefined && (mineralTicks === undefined || (intelTime + mineralTicks < Game.time))) {
                Logger_1.log.alert("Poaching of minerals in room " + possibleRoom + " started. ", room.name);
                room.memory.poaching = [possibleRoom];
                return;
            }
        }
    }
    orderPoachHaulers(room, mineral) {
        if (room.storage === undefined) {
            return;
        }
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.PoachHauler, mineral.id);
        let currentMiners = this.creepService.getCreeps(role_1.Role.PoachMiner, mineral.id).length;
        if (orderedTiers > 0 || currentMiners === 0) {
            return;
        }
        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.PoachHauler, mineral.id);
        let wantedTiers = Math.ceil(currentMiners * 2.5 * PathfindingUtilities.getDistanseBetween(room.storage.pos, mineral.pos) / 10);
        if (orderedTiers + currentTiers >= wantedTiers) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierOffroadHauler(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getOffroadHaulerBody(maxTier);
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.PoachHauler, target: mineral.id, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderPoachMiners(room, mineral) {
        let wanted = Math.min(mineral.getMiningPositions().length, 3);
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PoachMiner, mineral.id);
        let current = this.creepService.getCreeps(role_1.Role.PoachMiner, mineral.id).length;
        if (ordered > 0 || current + ordered >= wanted) {
            return;
        }
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getPoachMinerBody();
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.PoachMiner, target: mineral.id, tier: 1 };
        OrdersRepository.orderCreep(room, order);
    }
    orderPoachGuard(room, targetRoom) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PoachGuard, targetRoom);
        if (ordered > 0) {
            return;
        }
        let currentCreeps = this.creepService.getCreeps(role_1.Role.PoachGuard, targetRoom).length;
        if (currentCreeps > 0) {
            return;
        }
        let guardOrder = new Order_1.Order();
        guardOrder.body = ProfileUtilities.getPoachGuardBody();
        guardOrder.priority = priority_1.Priority.Critical;
        guardOrder.memory = { role: role_1.Role.PoachGuard, target: targetRoom, tier: 1 };
        OrdersRepository.orderCreep(room, guardOrder);
    }
}
exports.PoachingManager = PoachingManager;
