"use strict";
const ProfileUtilities = require("./utilities.Profiles");
const RoomLib = require("./lib.room");
const BaseLib = require("./lib.base");
const BuildLib = require("./lib.build");
const StructureLib = require("./lib.structure");
const ExtensionLib = require("./lib.extension");
const BaseBuilder = require("./roles.BaseBuilder");
const RoomRepository = require("./repository.Room");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const role_1 = require("./enums.role");
const roomlevel_1 = require("./enums.roomlevel");
const priority_1 = require("./enums.priority");
const Logger_1 = require("./tools.Logger");
const _Manager_1 = require("./managers._Manager");
class BuildManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("BuildManager");
        this.MEMORY_LASTRUN_DISMANTLE = "lastRunDismantle";
        this.MEMORY_LASTRUN_BUILD = "lastRunBuild";
        this.MEMORY_LASTRUN_ORDER = "lastRunOrder";
        this.MEMORY_TICKLASTINDEX = "tickIndex";
        this.MEMORY_LASTINDEX = "lastIndex";
        this.MEMORY_ROOMINDEX = "roomIndex";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            let lastRunDismantle = this.getValue(this.MEMORY_LASTRUN_DISMANTLE);
            let lastRunOrder = this.getValue(this.MEMORY_LASTRUN_ORDER);
            let lastRunBuild = this.getValue(this.MEMORY_LASTRUN_BUILD);
            let tickLastIndex = this.getValue(this.MEMORY_TICKLASTINDEX);
            if (lastRunDismantle === undefined || lastRunDismantle + 40 < Game.time) {
                let roomsBeingDismantled = RoomLib.getAllRoomsBeingDismantled();
                if (roomsBeingDismantled.length > 0) {
                    for (let room of roomsBeingDismantled) {
                        StructureLib.removeAllHostileStructures(room);
                        if (RoomLib.wallsShouldBeRemoved(room)) {
                            StructureLib.removeAllWalls(room);
                        }
                        if (room.memory.isBeingDismantledEverything) {
                            StructureLib.removeAllFriendlyStructures(room);
                        }
                        if (room.memory.isBeingDismantledEverythingExceptEnergy) {
                            StructureLib.removeAllFriendlyStructures(room, true);
                        }
                    }
                }
                this.setValue(this.MEMORY_LASTRUN_DISMANTLE, Game.time);
            }
            else if (lastRunOrder === undefined || lastRunOrder + 40 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                if (rooms.length > 0) {
                    for (let room of rooms) {
                        if (RoomLib.wallsShouldBeRemoved(room)) {
                            StructureLib.removeAllWalls(room);
                            StructureLib.removeAllHostileStructures(room);
                        }
                        if (RoomLib.roomShouldHaveBuilders(room)) {
                            this.orderBaseBuilders(room);
                        }
                    }
                }
                this.setValue(this.MEMORY_LASTRUN_ORDER, Game.time);
            }
            else if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
            }
            else if (lastRunBuild === undefined || lastRunBuild + 20 < Game.time) {
                let roomIndex = this.getValue(this.MEMORY_ROOMINDEX);
                if (roomIndex === undefined) {
                    roomIndex = 1;
                }
                let room = RoomRepository.getRoomForIndex(roomIndex);
                if (room !== undefined && RoomRepository.roomShouldBuild(room)) {
                    placeBuildings(room);
                }
                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
                if (lastIndex === undefined) {
                    console.log("Error with lastIndex in RoadManager.");
                    return;
                }
                let nextIndex = roomIndex + 1;
                if (nextIndex > lastIndex) {
                    nextIndex = 1;
                }
                this.setValue(this.MEMORY_ROOMINDEX, nextIndex);
                this.setValue(this.MEMORY_LASTRUN_BUILD, Game.time);
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Trivial) {
            if (Game.flags["Ext"] !== undefined) {
                let flag = Game.flags["Ext"];
                ExtensionLib.simExtensions(flag.pos);
            }
            this.creepService.runCreeps(role_1.Role.BaseBuilder, BaseBuilder.run);
        }
    }
    orderBaseBuilders(room) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseBuilder, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.BaseBuilder, room.name).length;
        if (ordered + spawned > 1) {
            return;
        }
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.BaseBuilder, room.name);
        let spawnedTiers = this.creepService.getNumberOfTiers(role_1.Role.BaseBuilder, room.name);
        let neededTiers = Math.ceil(BuildLib.getConstructionPointsInRoom(room) / 5000);
        if (orderedTiers + spawnedTiers >= neededTiers) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, Math.max(neededTiers, 4));
        if (room.controller !== undefined && room.controller.level !== undefined && room.controller.level === 8) {
            usedTier = Math.min(maxTier, Math.max(neededTiers, 8));
        }
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getConsultantBody(usedTier);
        order.priority = priority_1.Priority.Standard;
        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            order.priority = priority_1.Priority.Important;
        }
        order.memory = { role: role_1.Role.BaseBuilder, target: room.name, tier: usedTier };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.BuildManager = BuildManager;
function placeBuildings(room) {
    let basePosition = RoomRepository.getBasePosition(room);
    if (!basePosition) {
        return;
    }
    if (room.controller === undefined || room.controller.level < 2) {
        return;
    }
    let level = RoomRepository.getRoomLevel(room);
    if (level > roomlevel_1.RoomLevel.BasicColonyReadyForExpansion && level < roomlevel_1.RoomLevel.CivilizedColony &&
        (room.storage === undefined || !room.storage.isActive())) {
        let baseContainer = getBaseContainer(basePosition, room);
        if (baseContainer === undefined) {
            BuildLib.buildIfNotPresent(STRUCTURE_CONTAINER, basePosition, 0, 2, true, false);
        }
    }
    if (room.storage !== undefined && room.storage.isActive()) {
        let baseContainer = getBaseContainer(basePosition, room);
        if (baseContainer !== undefined) {
            baseContainer.destroy();
        }
    }
    let spawn = room.getSpawn();
    let ramparts = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART });
    if (spawn === undefined && ramparts.length === 0 && room.controller !== undefined && room.controller.safeMode === undefined) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getSpawnPositions(), 1);
    }
    else {
        buildIfPossible(room, basePosition, STRUCTURE_SPAWN, BaseLib.getSpawnPositions(), BaseLib.getPossibleSpawnCount(room));
    }
    if (spawn === undefined) {
        return;
    }
    buildIfPossible(room, basePosition, STRUCTURE_TOWER, BaseLib.getTowerPositions(), BaseLib.getPossibleTowerCount(room));
    ExtensionLib.destroyExtensionsNotCorrectlyPlaced(room, basePosition);
    let extensions = ExtensionLib.getExtensionPositions(room, basePosition);
    buildIfPossibleRoomPosition(room, STRUCTURE_EXTENSION, extensions, BaseLib.getPossibleExtensionsCount(room));
    if (level >= roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, basePosition, 0, 3, false, false);
    }
    if (level >= roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion) {
        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getColonyRoadPositions());
        buildIfPossibleRoomPosition(room, STRUCTURE_ROAD, ExtensionLib.getRoadPositions(room, basePosition));
    }
    if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getCityRoadPositions());
    }
    if (level >= roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_LINK, basePosition, -1, 4, false, true);
    }
    if (level < roomlevel_1.RoomLevel.Town && level >= roomlevel_1.RoomLevel.SimpleColony) {
        buildIfPossible(room, null, STRUCTURE_RAMPART, BaseLib.getImportantBuildingPositions(room), undefined, true);
    }
    if (level >= roomlevel_1.RoomLevel.Town) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getFortressWallPositions(), undefined, true);
    }
    if (level >= roomlevel_1.RoomLevel.Metropolis) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getShellWallPositions(), undefined, true);
    }
    if (level >= roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, basePosition, 2, 2, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 4, false, true);
    }
    if (level >= roomlevel_1.RoomLevel.Town) {
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 6, false, true);
    }
    if (level >= roomlevel_1.RoomLevel.City) {
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 6, false, true);
    }
    if (level >= roomlevel_1.RoomLevel.Metropolis) {
        BuildLib.buildIfNotPresent(STRUCTURE_POWER_SPAWN, basePosition, -2, 2, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_NUKER, basePosition, -2, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_OBSERVER, basePosition, -2, 6, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 6, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 7, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 7, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 7, false, true);
    }
}
exports.placeBuildings = placeBuildings;
function buildIfPossible(room, spawnpos, structureType, positions, possible = undefined, keepRoad = false) {
    let needed = 100;
    if (spawnpos === null) {
        spawnpos = new RoomPosition(0, 0, room.name);
    }
    if (possible !== undefined) {
        let current = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; } }).length;
        let ordered = room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; } }).length;
        if (possible <= current + ordered) {
            return;
        }
        needed = possible - current - ordered;
        Logger_1.log.info("Building: " + needed + " " + structureType, room.name);
    }
    let positionCounter = 0;
    while (needed > 0 && positionCounter < positions.length) {
        if (BuildLib.buildIfNotPresent(structureType, spawnpos, positions[positionCounter][0], positions[positionCounter][1], keepRoad)) {
            needed--;
        }
        positionCounter++;
    }
}
function buildIfPossibleRoomPosition(room, structureType, positions, possible = undefined, keepRoad = false) {
    let needed = 100;
    if (possible !== undefined) {
        let current = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; } }).length;
        let ordered = room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; } }).length;
        if (possible <= current + ordered) {
            return;
        }
        needed = possible - current - ordered;
        Logger_1.log.info("Building: " + needed + " " + structureType, room.name);
    }
    let positionCounter = 0;
    let nullPosition = new RoomPosition(0, 0, room.name);
    while (needed > 0 && positionCounter < positions.length) {
        if (BuildLib.buildIfNotPresent(structureType, nullPosition, positions[positionCounter].x, positions[positionCounter].y, keepRoad)) {
            needed--;
        }
        positionCounter++;
    }
}
function getBaseContainer(basePos, room) {
    let containerPos = new RoomPosition(basePos.x, basePos.y + 2, basePos.roomName);
    if (containerPos !== undefined) {
        let structures = containerPos.lookFor(LOOK_STRUCTURES);
        for (let structure of structures) {
            if (structure instanceof StructureContainer) {
                room.memory["roomContainer"] = structure.id;
                return structure;
            }
        }
    }
}
