"use strict";
const _Manager_1 = require("./managers._Manager");
const roomtype_1 = require("./enums.roomtype");
const Praiser = require("./roles.Praiser");
const PraiserHauler = require("./roles.PraiserHauler");
const PraiserLeader = require("./roles.PraiserLeader");
const ProfileUtilities = require("./utilities.Profiles");
const PathfindingUtilities = require("./utilities.Pathfinding");
const PrayerLib = require("./lib.prayer");
const BuildLib = require("./lib.build");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const role_1 = require("./enums.role");
const praisestatus_1 = require("./enums.praisestatus");
const priority_1 = require("./enums.priority");
const Logger_1 = require("./tools.Logger");
class PraiseroomManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("PraiseroomManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            this.creepService.runCreeps(role_1.Role.PraiserWithBoost, Praiser.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.PraiserLeader, PraiserLeader.run);
            this.creepService.runCreeps(role_1.Role.PraiserOfficer, PraiserLeader.run);
            let praiseRooms = this.roomService.getPraiseRooms();
            for (let praiseRoom of praiseRooms) {
                if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
                    if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising ||
                        praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.PreparingReset ||
                        praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
                        this.runPraising(praiseRoom);
                    }
                }
            }
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 30 < Game.time) {
                let roomsWithPraiseroom = this.roomService.getNormalWithPraiseroom();
                this.runPraiserooms(roomsWithPraiseroom);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.PraiserWithoutBoost, Praiser.run);
            this.creepService.runCreeps(role_1.Role.PraiserSupport, Praiser.run);
            this.creepService.runCreeps(role_1.Role.PraiserHauler, PraiserHauler.run);
        }
    }
    runPraiserooms(roomsWithPraiseroom) {
        for (let room of roomsWithPraiseroom) {
            let praiseRoom = Game.rooms[room.memory.praiseroom];
            if (praiseRoom === undefined || (praiseRoom.controller !== undefined && !praiseRoom.controller.my && !room.memory.praiseroomHibernated)) {
                this.orderRoomClaimer(room, room.memory.praiseroom);
                if (Memory.rooms[room.memory.praiseroom] === undefined) {
                    Memory.rooms[room.memory.praiseroom] = {};
                }
                Memory.rooms[room.memory.praiseroom].isPraiseRoom = true;
            }
            praiseRoom.memory.t = roomtype_1.Roomtype.Praiseroom;
            if (!room.memory.praiseroomHibernated) {
                this.buildPraiseBuildings(praiseRoom);
            }
            else {
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.PreparingHibernate;
            }
            if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
                this.setPraiseStatus(praiseRoom);
                this.orderPraisers(room, praiseRoom.name, this.getWantedPraiserCount(praiseRoom));
                if (this.isDoublePraising(praiseRoom)) {
                    this.orderPraiserSupporters(room, praiseRoom.name);
                }
                if (this.shouldWeOrderHaulers(praiseRoom)) {
                    this.orderPraiserHaulers(room, praiseRoom.name);
                }
                if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising || praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.PreparingReset ||
                    praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
                    this.orderPraiserLeader(room, praiseRoom.name);
                }
                if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising && this.isDoublePraising(praiseRoom)) {
                    this.orderPraiserOfficer(room, praiseRoom.name);
                }
            }
        }
    }
    isDoublePraising(praiseRoom) {
        if (praiseRoom.controller === undefined) {
            return false;
        }
        if (praiseRoom.controller.level !== 7 || praiseRoom.memory.doublepraiser !== true) {
            return false;
        }
        if (praiseRoom.find(FIND_MY_SPAWNS).length !== 2) {
            return false;
        }
        let spawn = praiseRoom.getSpawn();
        if (spawn === undefined) {
            return false;
        }
        if (PrayerLib.getContainer(praiseRoom, spawn.pos) === undefined) {
            return false;
        }
        return true;
    }
    runPraising(praiseRoom) {
        let spawn = praiseRoom.getSpawn();
        let storage = praiseRoom.storage;
        if (spawn === undefined || storage === undefined) {
            Logger_1.log.error("Praiseroom missing spawn or storage", praiseRoom.name);
            return;
        }
        let leader = this.getPraiserLeader(praiseRoom);
        let creepInHealingPos = this.getHealingPraiser(praiseRoom, storage.pos);
        let nextCreepInHealingPos = this.getNextHealingPraiser(praiseRoom, storage.pos);
        if (praiseRoom.memory.rotationDone) {
            this.boostPraisersIfShouldAndCan(praiseRoom);
            praiseRoom.memory.rotationDone = undefined;
            if (creepInHealingPos !== undefined) {
                creepInHealingPos.memory.checkRamparts = true;
            }
        }
        if ((Game.time % 366 === 0 && (creepInHealingPos === undefined || (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1470))) ||
            (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1485 &&
                (nextCreepInHealingPos === undefined || (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 100)))) {
            this.assignPositionsToPraisers(praiseRoom, storage);
            Logger_1.log.info("Rotating praisers in praiserroom", praiseRoom.name);
            praiseRoom.memory.rotationDone = true;
        }
        if (leader !== undefined && leader.ticksToLive < 1000) {
            spawn.renewCreep(leader);
        }
        else if (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 10) {
            spawn.renewCreep(nextCreepInHealingPos);
        }
        else if (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive < 1485 &&
            ((creepInHealingPos.body[0].boost && creepInHealingPos.ticksToLive < 10) || !creepInHealingPos.body[0].boost)) {
            spawn.renewCreep(creepInHealingPos);
        }
        let spawn2 = PrayerLib.getSpawn2(praiseRoom, spawn.pos);
        if (!this.isDoublePraising(praiseRoom) || spawn2 === undefined) {
            return;
        }
        let officer = this.getPraiserOfficer(praiseRoom);
        let supporterInHealingPos = this.getHealingSupporter(praiseRoom, storage.pos);
        let nextSupporterInHealingPos = this.getNextHealingSupporter(praiseRoom, storage.pos);
        if (praiseRoom.memory.rotationDone) {
            this.assignPositionsToSupporters(praiseRoom, spawn2);
        }
        if (officer !== undefined && officer.ticksToLive < 1000) {
            spawn2.renewCreep(officer);
        }
        else if (nextSupporterInHealingPos !== undefined && nextSupporterInHealingPos.ticksToLive < 10) {
            spawn2.renewCreep(nextSupporterInHealingPos);
        }
        else if (supporterInHealingPos !== undefined && supporterInHealingPos.ticksToLive < 1485) {
            spawn2.renewCreep(supporterInHealingPos);
        }
    }
    boostPraisersIfShouldAndCan(praiseRoom) {
        if (praiseRoom.storage === undefined || praiseRoom.terminal === undefined || praiseRoom.controller === undefined) {
            return;
        }
        let creepInBoostingPos = this.getBoostingPraiser(praiseRoom, praiseRoom.storage.pos);
        if (creepInBoostingPos === undefined || creepInBoostingPos.body[0].boost || creepInBoostingPos.ticksToLive < 1470) {
            return;
        }
        if (praiseRoom.controller.level < 6 || praiseRoom.controller.level > 7 ||
            (praiseRoom.controller.level === 7 && praiseRoom.controller.progress > praiseRoom.controller.progressTotal * 0.95)) {
            return;
        }
        let lab = PrayerLib.getBoosterLab(praiseRoom, praiseRoom.storage.pos);
        if (lab === undefined) {
            return;
        }
        if (lab.mineralAmount === lab.mineralCapacity && lab.mineralType === RESOURCE_CATALYZED_GHODIUM_ACID) {
            lab.boostCreep(creepInBoostingPos);
            Logger_1.log.info("Boosting praisers in praiserroom", praiseRoom.name);
        }
    }
    assignPositionsToPraisers(praiseRoom, storage) {
        let positions = PrayerLib.getPraiserPositions(praiseRoom, storage.pos);
        let praisers = this.getPraisersSortedByTicksToLive(praiseRoom);
        for (let posIndex in positions) {
            if (praisers[posIndex] instanceof Creep) {
                praisers[posIndex].memory.wantedPos = positions[posIndex];
            }
            else {
                return;
            }
        }
    }
    getPraisersSortedByTicksToLive(praiseRoom) {
        let praisers = this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name);
        return praisers.sort(function (a, b) {
            return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
        });
    }
    assignPositionsToSupporters(praiseRoom, spawn2) {
        let positions = PrayerLib.getSupporterPositions(praiseRoom, spawn2.pos);
        let praisers = this.getSupportersSortedByTicksToLive(praiseRoom);
        for (let posIndex in positions) {
            if (praisers[posIndex] instanceof Creep) {
                praisers[posIndex].memory.wantedPos = positions[posIndex];
            }
            else {
                return;
            }
        }
    }
    getSupportersSortedByTicksToLive(praiseRoom) {
        let praisers = this.creepService.getCreeps(role_1.Role.PraiserSupport, praiseRoom.name);
        return praisers.sort(function (a, b) {
            return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
        });
    }
    getBoostingPraiser(room, storagePos) {
        let boostPos = PrayerLib.getBoostCreepPos(room, storagePos);
        let atPos = boostPos.lookFor(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }
    getHealingPraiser(room, storagePos) {
        let healPos = PrayerLib.getHealCreepPos(room, storagePos);
        let atPos = healPos.lookFor(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }
    getHealingSupporter(room, storagePos) {
        let healPos = PrayerLib.getHealSupporterPos(room, storagePos);
        let atPos = healPos.lookFor(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }
    getNextHealingPraiser(room, storagePos) {
        let healPos = PrayerLib.getNextHealCreepPos(room, storagePos);
        let atPos = healPos.lookFor(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }
    getNextHealingSupporter(room, storagePos) {
        let healPos = PrayerLib.getNextHealSupporterPos(room, storagePos);
        let atPos = healPos.lookFor(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }
    getPraiserLeader(praiseRoom) {
        let leaders = this.creepService.getCreeps(role_1.Role.PraiserLeader, praiseRoom.name);
        if (leaders.length > 0) {
            return leaders[0];
        }
        return undefined;
    }
    getPraiserOfficer(praiseRoom) {
        let leaders = this.creepService.getCreeps(role_1.Role.PraiserOfficer, praiseRoom.name);
        if (leaders.length > 0) {
            return leaders[0];
        }
        return undefined;
    }
    setPraiseStatus(praiseRoom) {
        if (praiseRoom.controller === undefined || !praiseRoom.controller.my) {
            return;
        }
        else if (praiseRoom.memory.praiseStatus == praisestatus_1.PraiseStatus.PreparingHibernate) {
            if (this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name).length === 0) {
                praiseRoom.controller.unclaim();
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Hiberate;
            }
        }
        else if (praiseRoom.controller.level < 6 || (praiseRoom.controller.level === 6 && praiseRoom.terminal === undefined)) {
            if (praiseRoom.terminal === undefined) {
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Establishing;
            }
            else {
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Reestablishing;
            }
        }
        else if (praiseRoom.controller.level === 8) {
            if (praiseRoom.storage !== undefined && praiseRoom.storage.store[RESOURCE_ENERGY] > praiseRoom.storage.storeCapacity - 10000) {
                if (praiseRoom.memory.praiseStatus !== praisestatus_1.PraiseStatus.Reestablishing) {
                    this.removePraisersForReset(praiseRoom);
                    praiseRoom.controller.unclaim();
                }
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Reestablishing;
            }
            else {
                if (praiseRoom.memory.praiseStatus !== praisestatus_1.PraiseStatus.PreparingReset) {
                    this.removePraisersForReset(praiseRoom);
                }
                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.PreparingReset;
            }
        }
        else if (praiseRoom.storage !== undefined && praiseRoom.terminal !== undefined) {
            praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Praising;
        }
        else {
            Logger_1.log.error("PraiseManager could not find a valid status for praiseroom", praiseRoom.name);
        }
    }
    removePraisersForReset(praiseRoom) {
        let currentPraisers = this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name);
        let count = 0;
        for (let praiser of currentPraisers) {
            count++;
            if (count > 6) {
                praiser.suicide();
            }
        }
        let currentSupporters = this.creepService.getCreeps(role_1.Role.PraiserSupport, praiseRoom.name);
        for (let supporter of currentSupporters) {
            supporter.suicide();
        }
    }
    shouldWeOrderHaulers(praiseRoom) {
        return praiseRoom.terminal === undefined ||
            (!praiseRoom.terminal.isActive() && praiseRoom.storage !== undefined &&
                praiseRoom.storage.isActive() && praiseRoom.storage.store[RESOURCE_ENERGY] < 950000);
    }
    getWantedPraiserCount(praiseRoom) {
        switch (praiseRoom.memory.praiseStatus) {
            case praisestatus_1.PraiseStatus.Establishing:
                return 3;
            case praisestatus_1.PraiseStatus.Reestablishing:
                return 6;
            case praisestatus_1.PraiseStatus.Praising:
                return 7;
            default:
                return 0;
        }
    }
    buildPraiseBuildings(room) {
        if (room.controller === undefined || !room.controller.my) {
            return;
        }
        let spawn = room.getSpawn();
        if (spawn === undefined && room.controller.level > 0) {
            let flags = room.find(FIND_FLAGS, { filter: (f) => f.name === "praise" && f.pos.roomName === room.name });
            if (flags.length === 1) {
                let flag = flags[0];
                if (room.find(FIND_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_SPAWN }).length > 0) {
                    flag.remove();
                }
                else {
                    let spawnPos = PrayerLib.getSpawn1Pos(room, flag.pos);
                    BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
                }
            }
            else if (room.storage !== undefined) {
                let spawnPos = PrayerLib.getSpawn1Pos(room, room.storage.pos);
                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
            }
        }
        else if (spawn instanceof StructureSpawn) {
            let spawnPos = spawn.pos;
            if (room.controller.level >= 4 && room.storage === undefined) {
                let storagePos = PrayerLib.getStoragePos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, storagePos, 0, 0, true, false);
            }
            if (room.controller.level >= 6 && room.terminal === undefined) {
                let terminalPos = PrayerLib.getTerminalPos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, terminalPos, 0, 0, true, false);
            }
            if (room.controller.level === 6 && room.storage !== undefined) {
                let labPos = PrayerLib.getLabPos(room, room.storage.pos);
                BuildLib.buildIfNotPresent(STRUCTURE_LAB, labPos, 0, 0, true, false);
            }
            if (room.controller.level > 5) {
                buildRampartsOnImportantBuildings(room);
            }
            if (room.controller.level === 7 && room.memory.doublepraiser === true) {
                let spawn2pos = PrayerLib.getSpawn2Pos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawn2pos, 0, 0, true, false);
                let containerpos = PrayerLib.getContainerPos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_CONTAINER, containerpos, 0, 0, true, false);
            }
        }
    }
    orderRoomClaimer(room, targetRoom) {
        let maxTier = ProfileUtilities.getMaxTierClaimer(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 1);
        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.RoomClaimer, targetRoom);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.RoomClaimer, targetRoom);
        let neededTiers = 1;
        if (neededTiers > currentTiers + orderedTiers) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getClaimerBody(usedTier);
            order.priority = priority_1.Priority.Critical;
            order.memory = { role: role_1.Role.RoomClaimer, target: targetRoom, tier: usedTier };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderPraiserHaulers(room, targetRoom) {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(role_1.Role.PraiserHauler, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserHauler, targetRoom);
        let needed = 10;
        let praiseRoom = Game.rooms[targetRoom];
        if (room.storage !== undefined && praiseRoom !== undefined && praiseRoom.controller !== undefined) {
            needed = Math.ceil(PathfindingUtilities.getDistanseBetween(room.storage.pos, praiseRoom.controller.pos) / 5);
        }
        if (needed > current + ordered) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = priority_1.Priority.Standard;
            order.memory = { role: role_1.Role.PraiserHauler, target: targetRoom, tier: maxTier };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderPraiserLeader(room, targetRoom) {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(role_1.Role.PraiserLeader, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserLeader, targetRoom);
        if (current + ordered === 0) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = priority_1.Priority.Important;
            order.memory = { role: role_1.Role.PraiserLeader, target: targetRoom, tier: maxTier };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderPraiserOfficer(room, targetRoom) {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(role_1.Role.PraiserOfficer, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserOfficer, targetRoom);
        if (current + ordered === 0) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = priority_1.Priority.Important;
            order.memory = { role: role_1.Role.PraiserOfficer, target: targetRoom, tier: maxTier };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderPraisers(room, targetRoom, needed) {
        let current = this.creepService.getCreeps(role_1.Role.Praiser, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Praiser, targetRoom);
        if (needed > current + ordered) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getPraiserBody();
            order.priority = priority_1.Priority.Important;
            order.memory = { role: role_1.Role.Praiser, target: targetRoom, tier: 1 };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderPraiserSupporters(room, targetRoom) {
        let current = this.creepService.getCreeps(role_1.Role.PraiserSupport, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserSupport, targetRoom);
        if (7 > current + ordered) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getPraiserBody();
            order.priority = priority_1.Priority.Standard;
            order.memory = { role: role_1.Role.PraiserSupport, target: targetRoom, tier: 1 };
            OrdersRepository.orderCreep(room, order);
        }
    }
}
exports.PraiseroomManager = PraiseroomManager;
function buildRampartsOnImportantBuildings(room) {
    let spawn1 = room.getSpawn();
    if (spawn1 === undefined) {
        return;
    }
    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn1.pos, 0, 0, true, false);
    if (room.storage === undefined) {
        return;
    }
    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.storage.pos, 0, 0, true, false);
    if (room.terminal !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.terminal.pos, 0, 0, true, false);
    }
    let lab = PrayerLib.getBoosterLab(room, room.storage.pos);
    if (lab !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, lab.pos, 0, 0, true, false);
    }
    let spawn2 = PrayerLib.getSpawn2(room, spawn1.pos);
    if (spawn2 !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn2.pos, 0, 0, true, false);
    }
}
