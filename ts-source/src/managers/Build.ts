import * as ProfileUtilities from "../utilities/Profiles";

import * as RoomLib from "../lib/room";
import * as BaseLib from "../lib/base";
import * as BuildLib from "../lib/build";
import * as StructureLib from "../lib/structure";
import * as ExtensionLib from "../lib/extension";

import * as BaseBuilder from "../roles/BaseBuilder";

import * as RoomRepository from "../repository/Room";
import * as OrdersRepository from "../repository/Orders";

import {Order} from "../classes/Order";

import {Role} from "../enums/role";
import {RoomLevel} from "../enums/roomlevel";
import {Priority} from "../enums/priority";

import {log} from "../tools/Logger";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

export class BuildManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN_DISMANTLE = "lastRunDismantle";
    readonly MEMORY_LASTRUN_BUILD = "lastRunBuild";
    readonly MEMORY_LASTRUN_ORDER = "lastRunOrder";
    readonly MEMORY_TICKLASTINDEX = "tickIndex";
    readonly MEMORY_LASTINDEX = "lastIndex";
    readonly MEMORY_ROOMINDEX = "roomIndex";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("BuildManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Low) {

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
            } else
            if (lastRunOrder === undefined || lastRunOrder + 40 < Game.time) {
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
            } else
            if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
            } else
            if (lastRunBuild === undefined || lastRunBuild + 20 < Game.time) {
                let roomIndex = this.getValue(this.MEMORY_ROOMINDEX) as number;
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
        } else
        if (pri === ManagerPriority.Trivial) {

            if (Game.flags["Ext"] !== undefined) {
                let flag = Game.flags["Ext"] as Flag;
                ExtensionLib.simExtensions(flag.pos);
            }
            this.creepService.runCreeps(Role.BaseBuilder, BaseBuilder.run);
        }
    }

    private orderBaseBuilders(room: Room): void {
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.BaseBuilder, room.name);
        let spawned = this.creepService.getCreeps(Role.BaseBuilder, room.name).length

        if (ordered + spawned > 1) {
            return;
        }

        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.BaseBuilder, room.name);
        let spawnedTiers = this.creepService.getNumberOfTiers(Role.BaseBuilder, room.name)

        let neededTiers = Math.ceil(BuildLib.getConstructionPointsInRoom(room) / 5000);
        if (orderedTiers + spawnedTiers >= neededTiers) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, Math.max(neededTiers, 4));
        if (room.controller !== undefined && room.controller.level !== undefined && room.controller.level === 8) {
            usedTier = Math.min(maxTier, Math.max(neededTiers, 8));
        }

        let order = new Order();
        order.body = ProfileUtilities.getConsultantBody(usedTier);
        order.priority = Priority.Standard;
        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            order.priority = Priority.Important;
        }
        order.memory = {role: Role.BaseBuilder, target: room.name, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }
}

export function placeBuildings(room: Room): void {
    let basePosition = RoomRepository.getBasePosition(room);
    if (!basePosition) {
        return;
    }

    if (room.controller === undefined || room.controller.level < 2) {
        return;
    }

    let level = RoomRepository.getRoomLevel(room);

    if (level > RoomLevel.BasicColonyReadyForExpansion && level < RoomLevel.CivilizedColony &&
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

    // Spawn
    let spawn = room.getSpawn();
    let ramparts = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_RAMPART}) as StructureRampart[];
    if (spawn === undefined && ramparts.length === 0 && room.controller !== undefined && room.controller.safeMode === undefined) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getSpawnPositions(), 1);
    } else {
        buildIfPossible(room, basePosition, STRUCTURE_SPAWN, BaseLib.getSpawnPositions(), BaseLib.getPossibleSpawnCount(room));
    }

    if (spawn === undefined) {
        return;
    }

    // Towers
    buildIfPossible(room, basePosition, STRUCTURE_TOWER, BaseLib.getTowerPositions(), BaseLib.getPossibleTowerCount(room));

    // Extensions
    ExtensionLib.destroyExtensionsNotCorrectlyPlaced(room, basePosition);
    let extensions = ExtensionLib.getExtensionPositions(room, basePosition);
    buildIfPossibleRoomPosition(room, STRUCTURE_EXTENSION, extensions, BaseLib.getPossibleExtensionsCount(room))

    // Storage
    if (level >= RoomLevel.DefendedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, basePosition, 0, 3, false, false);
    }

    // Roads
    if (level >= RoomLevel.SimpleColonyReadyForExpansion) {
        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getColonyRoadPositions());
        buildIfPossibleRoomPosition(room, STRUCTURE_ROAD, ExtensionLib.getRoadPositions(room, basePosition));
    }
    if (level >= RoomLevel.CivilizedColony) {
        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getCityRoadPositions());
    }

    // Baselink
    if (level >= RoomLevel.CivilizedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_LINK, basePosition, -1, 4, false, true);
    }

    // Fortresswalls
    if (level < RoomLevel.Town && level >= RoomLevel.SimpleColony) {
        buildIfPossible(room, null, STRUCTURE_RAMPART, BaseLib.getImportantBuildingPositions(room), undefined, true);
    }

    if (level >= RoomLevel.Town) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getFortressWallPositions(), undefined, true);
    }
    if (level >= RoomLevel.Metropolis) {
        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getShellWallPositions(), undefined, true);
    }

    if (level >= RoomLevel.AdvancedColonyReadyForExpansion) {
        BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, basePosition, 2, 2, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 4, false, true);
    }

    if (level >= RoomLevel.Town) {
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 6, false, true);
    }

    if (level >= RoomLevel.City) {
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition,-1, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition,-1, 6, false, true);
    }

    if (level >= RoomLevel.Metropolis) {
        BuildLib.buildIfNotPresent(STRUCTURE_POWER_SPAWN, basePosition, -2, 2, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_NUKER, basePosition, -2, 5, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_OBSERVER, basePosition, -2, 6, false, true);

        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 6, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition,-1, 7, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 7, false, true);
        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 7, false, true);
    }
}

function buildIfPossible(room: Room, spawnpos: RoomPosition | null, structureType: string, positions: number[][],
        possible: number | undefined = undefined, keepRoad: boolean = false): void {
    let needed = 100;
    if (spawnpos === null) {
        spawnpos = new RoomPosition(0, 0, room.name);
    }
    if (possible !== undefined) {
        let current = room.find(FIND_STRUCTURES, {filter: function(s: Structure) { return s.structureType === structureType; }}).length;
        let ordered = room.find(FIND_CONSTRUCTION_SITES, {filter: function(s: Structure) { return s.structureType === structureType; }}).length;
        if (possible <= current + ordered) {
            return;
        }
        needed = possible - current - ordered;
        log.info("Building: " + needed + " " + structureType, room.name);
    }

    let positionCounter = 0;

    while (needed > 0 && positionCounter < positions.length) {
        if (BuildLib.buildIfNotPresent(structureType, spawnpos, positions[positionCounter][0], positions[positionCounter][1], keepRoad)) {
            needed--;
        }
        positionCounter++;
    }
}

function buildIfPossibleRoomPosition(room: Room, structureType: string, positions: RoomPosition[],
    possible: number | undefined = undefined, keepRoad: boolean = false): void {
    let needed = 100;
    if (possible !== undefined) {
        let current = room.find(FIND_STRUCTURES, {filter: function(s: Structure) { return s.structureType === structureType; }}).length;
        let ordered = room.find(FIND_CONSTRUCTION_SITES, {filter: function(s: Structure) { return s.structureType === structureType; }}).length;
        if (possible <= current + ordered) {
            return;
        }
        needed = possible - current - ordered;
        log.info("Building: " + needed + " " + structureType, room.name);
    }

    let positionCounter = 0;

    let nullPosition = new RoomPosition(0, 0, room.name);
    while (needed > 0 && positionCounter < positions.length) {
        if (BuildLib.buildIfNotPresent(structureType, nullPosition , positions[positionCounter].x, positions[positionCounter].y, keepRoad)) {
            needed--;
        }
        positionCounter++;
    }
}

function getBaseContainer(basePos: RoomPosition, room: Room): Structure | undefined {
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

/*
Plans for new structure-layout:
http://screeps.dissi.me

{"name":"textExport","buildings":{"extension":{"pos":[{"x":18,"y":13},{"x":19,"y":13},{"x":20,"y":13},{"x":21,"y":13},{"x":22,"y":13},{"x":23,"y":13},{"x":24,"y":13},{"x":18,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":24,"y":14},{"x":18,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":24,"y":15},{"x":15,"y":16},{"x":18,"y":16},{"x":20,"y":16},{"x":21,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":27,"y":16},{"x":16,"y":17},{"x":19,"y":17},{"x":21,"y":17},{"x":23,"y":17},{"x":26,"y":17},{"x":15,"y":18},{"x":17,"y":18},{"x":25,"y":18},{"x":27,"y":18},{"x":16,"y":19},{"x":26,"y":19},{"x":15,"y":20},{"x":17,"y":20},{"x":25,"y":20},{"x":27,"y":20},{"x":16,"y":21},{"x":26,"y":21},{"x":15,"y":22},{"x":17,"y":22},{"x":25,"y":22},{"x":27,"y":22},{"x":16,"y":23},{"x":26,"y":23},{"x":15,"y":24},{"x":17,"y":24},{"x":19,"y":24},{"x":25,"y":24},{"x":27,"y":24},{"x":16,"y":25},{"x":18,"y":25},{"x":24,"y":25},{"x":26,"y":25},{"x":15,"y":26},{"x":17,"y":26},{"x":19,"y":26},{"x":25,"y":26},{"x":27,"y":26}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":18,"y":19},{"x":24,"y":19},{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":22},{"x":24,"y":22}]},"observer":{"pos":[{"x":18,"y":20}]},"nuker":{"pos":[{"x":24,"y":20}]},"link":{"pos":[{"x":18,"y":21},{"x":19,"y":21},{"x":23,"y":21}]},"powerSpawn":{"pos":[{"x":24,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":20,"y":23},{"x":20,"y":24},{"x":22,"y":24},{"x":23,"y":24},{"x":20,"y":25},{"x":21,"y":25},{"x":23,"y":25},{"x":21,"y":26},{"x":22,"y":26},{"x":23,"y":26}]},"terminal":{"pos":[{"x":22,"y":23}]}}}
{"name":"textExport","buildings":{"extension":{"pos":[{"x":15,"y":13},{"x":17,"y":13},{"x":19,"y":13},{"x":21,"y":13},{"x":23,"y":13},{"x":25,"y":13},{"x":27,"y":13},{"x":14,"y":14},{"x":16,"y":14},{"x":18,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":24,"y":14},{"x":26,"y":14},{"x":28,"y":14},{"x":15,"y":15},{"x":17,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":25,"y":15},{"x":27,"y":15},{"x":14,"y":16},{"x":16,"y":16},{"x":18,"y":16},{"x":20,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":26,"y":16},{"x":28,"y":16},{"x":15,"y":17},{"x":17,"y":17},{"x":19,"y":17},{"x":21,"y":17},{"x":23,"y":17},{"x":25,"y":17},{"x":27,"y":17},{"x":14,"y":18},{"x":16,"y":18},{"x":26,"y":18},{"x":28,"y":18},{"x":15,"y":19},{"x":17,"y":19},{"x":25,"y":19},{"x":27,"y":19},{"x":14,"y":20},{"x":16,"y":20},{"x":26,"y":20},{"x":28,"y":20},{"x":15,"y":21},{"x":17,"y":21},{"x":25,"y":21},{"x":27,"y":21},{"x":14,"y":22},{"x":16,"y":22},{"x":26,"y":22},{"x":28,"y":22},{"x":17,"y":23},{"x":25,"y":23},{"x":27,"y":23}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":18,"y":19},{"x":24,"y":19},{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":22},{"x":24,"y":22}]},"observer":{"pos":[{"x":18,"y":20}]},"nuker":{"pos":[{"x":24,"y":20}]},"link":{"pos":[{"x":18,"y":21},{"x":19,"y":21},{"x":23,"y":21}]},"powerSpawn":{"pos":[{"x":24,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":20,"y":23},{"x":19,"y":24},{"x":21,"y":24},{"x":22,"y":24},{"x":19,"y":25},{"x":20,"y":25},{"x":22,"y":25},{"x":20,"y":26},{"x":21,"y":26},{"x":22,"y":26}]},"terminal":{"pos":[{"x":22,"y":23}]}}}
{"name":"textExport","buildings":{"extension":{"pos":[{"x":15,"y":13},{"x":17,"y":13},{"x":19,"y":13},{"x":21,"y":13},{"x":23,"y":13},{"x":25,"y":13},{"x":27,"y":13},{"x":14,"y":14},{"x":16,"y":14},{"x":18,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":24,"y":14},{"x":26,"y":14},{"x":28,"y":14},{"x":15,"y":15},{"x":17,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":25,"y":15},{"x":27,"y":15},{"x":14,"y":16},{"x":16,"y":16},{"x":18,"y":16},{"x":20,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":26,"y":16},{"x":28,"y":16},{"x":15,"y":17},{"x":17,"y":17},{"x":19,"y":17},{"x":21,"y":17},{"x":23,"y":17},{"x":25,"y":17},{"x":27,"y":17},{"x":14,"y":18},{"x":16,"y":18},{"x":26,"y":18},{"x":28,"y":18},{"x":15,"y":19},{"x":17,"y":19},{"x":25,"y":19},{"x":27,"y":19},{"x":14,"y":20},{"x":16,"y":20},{"x":26,"y":20},{"x":28,"y":20},{"x":15,"y":21},{"x":17,"y":21},{"x":25,"y":21},{"x":27,"y":21},{"x":14,"y":22},{"x":16,"y":22},{"x":26,"y":22},{"x":28,"y":22},{"x":17,"y":23},{"x":25,"y":23},{"x":27,"y":23}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":18,"y":19},{"x":24,"y":19},{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":22},{"x":24,"y":22}]},"observer":{"pos":[{"x":18,"y":20}]},"nuker":{"pos":[{"x":24,"y":20}]},"link":{"pos":[{"x":18,"y":21},{"x":19,"y":21}]},"terminal":{"pos":[{"x":23,"y":21}]},"powerSpawn":{"pos":[{"x":24,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":21,"y":23},{"x":19,"y":24},{"x":20,"y":24},{"x":22,"y":24},{"x":19,"y":25},{"x":21,"y":25},{"x":22,"y":25},{"x":19,"y":26},{"x":20,"y":26},{"x":21,"y":26}]}}}
{"name":"textExport","buildings":{"extension":{"pos":[{"x":20,"y":13},{"x":21,"y":13},{"x":22,"y":13},{"x":19,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":23,"y":14},{"x":18,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":24,"y":15},{"x":18,"y":16},{"x":20,"y":16},{"x":21,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":15,"y":17},{"x":18,"y":17},{"x":19,"y":17},{"x":21,"y":17},{"x":23,"y":17},{"x":24,"y":17},{"x":27,"y":17},{"x":14,"y":18},{"x":16,"y":18},{"x":26,"y":18},{"x":28,"y":18},{"x":15,"y":19},{"x":17,"y":19},{"x":25,"y":19},{"x":27,"y":19},{"x":14,"y":20},{"x":16,"y":20},{"x":26,"y":20},{"x":28,"y":20},{"x":15,"y":21},{"x":17,"y":21},{"x":25,"y":21},{"x":27,"y":21},{"x":14,"y":22},{"x":16,"y":22},{"x":26,"y":22},{"x":28,"y":22},{"x":15,"y":23},{"x":17,"y":23},{"x":25,"y":23},{"x":27,"y":23},{"x":14,"y":24},{"x":16,"y":24},{"x":26,"y":24},{"x":28,"y":24},{"x":15,"y":25},{"x":17,"y":25},{"x":25,"y":25},{"x":27,"y":25},{"x":14,"y":26},{"x":16,"y":26},{"x":26,"y":26},{"x":28,"y":26}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":18,"y":19},{"x":24,"y":19},{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":22},{"x":24,"y":22}]},"observer":{"pos":[{"x":18,"y":20}]},"nuker":{"pos":[{"x":24,"y":20}]},"link":{"pos":[{"x":18,"y":21},{"x":19,"y":21}]},"terminal":{"pos":[{"x":23,"y":21}]},"powerSpawn":{"pos":[{"x":24,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":20,"y":23},{"x":21,"y":23},{"x":19,"y":24},{"x":20,"y":24},{"x":22,"y":24},{"x":19,"y":25},{"x":21,"y":25},{"x":22,"y":25},{"x":20,"y":26},{"x":21,"y":26}]}}}
{"name":"textExport","buildings":{"extension":{"pos":[{"x":16,"y":13},{"x":17,"y":13},{"x":18,"y":13},{"x":20,"y":13},{"x":21,"y":13},{"x":22,"y":13},{"x":24,"y":13},{"x":25,"y":13},{"x":26,"y":13},{"x":16,"y":14},{"x":18,"y":14},{"x":19,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":23,"y":14},{"x":24,"y":14},{"x":26,"y":14},{"x":16,"y":15},{"x":17,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":25,"y":15},{"x":26,"y":15},{"x":17,"y":16},{"x":18,"y":16},{"x":20,"y":16},{"x":21,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":25,"y":16},{"x":18,"y":17},{"x":19,"y":17},{"x":23,"y":17},{"x":24,"y":17},{"x":16,"y":18},{"x":26,"y":18},{"x":15,"y":19},{"x":17,"y":19},{"x":25,"y":19},{"x":27,"y":19},{"x":16,"y":20},{"x":26,"y":20},{"x":15,"y":21},{"x":17,"y":21},{"x":25,"y":21},{"x":27,"y":21},{"x":16,"y":22},{"x":26,"y":22},{"x":15,"y":23},{"x":17,"y":23},{"x":25,"y":23},{"x":27,"y":23},{"x":16,"y":24},{"x":26,"y":24},{"x":15,"y":25},{"x":17,"y":25},{"x":25,"y":25},{"x":27,"y":25},{"x":16,"y":26}]},"link":{"pos":[{"x":21,"y":17},{"x":20,"y":23}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":18,"y":19},{"x":24,"y":19},{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":22},{"x":24,"y":22}]},"observer":{"pos":[{"x":18,"y":20}]},"nuker":{"pos":[{"x":24,"y":20}]},"powerSpawn":{"pos":[{"x":19,"y":21}]},"terminal":{"pos":[{"x":23,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":22,"y":23},{"x":20,"y":24},{"x":21,"y":24},{"x":23,"y":24},{"x":20,"y":25},{"x":22,"y":25},{"x":23,"y":25},{"x":20,"y":26},{"x":21,"y":26},{"x":22,"y":26}]}}}

Best?
{"name":"textExport","buildings":{"extension":{"pos":[{"x":16,"y":13},{"x":17,"y":13},{"x":18,"y":13},{"x":20,"y":13},{"x":21,"y":13},{"x":22,"y":13},{"x":24,"y":13},{"x":25,"y":13},{"x":26,"y":13},{"x":16,"y":14},{"x":18,"y":14},{"x":19,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":23,"y":14},{"x":24,"y":14},{"x":26,"y":14},{"x":16,"y":15},{"x":17,"y":15},{"x":19,"y":15},{"x":21,"y":15},{"x":23,"y":15},{"x":25,"y":15},{"x":26,"y":15},{"x":17,"y":16},{"x":18,"y":16},{"x":20,"y":16},{"x":21,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":25,"y":16},{"x":18,"y":17},{"x":19,"y":17},{"x":23,"y":17},{"x":24,"y":17},{"x":15,"y":19},{"x":16,"y":19},{"x":17,"y":19},{"x":25,"y":19},{"x":26,"y":19},{"x":27,"y":19},{"x":15,"y":20},{"x":17,"y":20},{"x":25,"y":20},{"x":27,"y":20},{"x":15,"y":21},{"x":16,"y":21},{"x":26,"y":21},{"x":27,"y":21},{"x":15,"y":22},{"x":17,"y":22},{"x":25,"y":22},{"x":27,"y":22},{"x":15,"y":23},{"x":16,"y":23},{"x":17,"y":23},{"x":25,"y":23},{"x":26,"y":23},{"x":27,"y":23}]},"link":{"pos":[{"x":21,"y":17},{"x":20,"y":23}]},"spawn":{"pos":[{"x":20,"y":18},{"x":22,"y":18},{"x":21,"y":19}]},"tower":{"pos":[{"x":19,"y":20},{"x":23,"y":20},{"x":18,"y":21},{"x":24,"y":21},{"x":18,"y":22},{"x":24,"y":22}]},"powerSpawn":{"pos":[{"x":19,"y":21}]},"terminal":{"pos":[{"x":23,"y":21}]},"storage":{"pos":[{"x":21,"y":22}]},"lab":{"pos":[{"x":22,"y":23},{"x":20,"y":24},{"x":21,"y":24},{"x":23,"y":24},{"x":20,"y":25},{"x":22,"y":25},{"x":23,"y":25},{"x":20,"y":26},{"x":21,"y":26},{"x":22,"y":26}]},"nuker":{"pos":[{"x":19,"y":24}]},"observer":{"pos":[{"x":19,"y":25}]}}}
Inner high wall: 25 ramparts

Beachhead (not permanent, just inside the portal):
{"name":"textExport","buildings":{"rampart":{"pos":[{"x":23,"y":19}]},"extension":{"pos":[{"x":17,"y":20},{"x":19,"y":20},{"x":27,"y":20},{"x":29,"y":20},{"x":18,"y":21},{"x":20,"y":21},{"x":28,"y":21},{"x":17,"y":22},{"x":19,"y":22},{"x":27,"y":22},{"x":29,"y":22},{"x":18,"y":23},{"x":20,"y":23},{"x":26,"y":23},{"x":28,"y":23},{"x":17,"y":24},{"x":19,"y":24},{"x":27,"y":24},{"x":29,"y":24},{"x":18,"y":25},{"x":20,"y":25},{"x":22,"y":25},{"x":24,"y":25},{"x":26,"y":25},{"x":28,"y":25},{"x":17,"y":26},{"x":19,"y":26},{"x":21,"y":26},{"x":23,"y":26},{"x":25,"y":26},{"x":27,"y":26},{"x":29,"y":26},{"x":18,"y":27},{"x":20,"y":27},{"x":22,"y":27},{"x":24,"y":27},{"x":26,"y":27},{"x":28,"y":27},{"x":17,"y":28},{"x":19,"y":28},{"x":21,"y":28},{"x":23,"y":28},{"x":25,"y":28},{"x":27,"y":28},{"x":29,"y":28}]},"tower":{"pos":[{"x":21,"y":20},{"x":25,"y":20},{"x":21,"y":22},{"x":25,"y":22},{"x":21,"y":24},{"x":25,"y":24}]},"storage":{"pos":[{"x":22,"y":21}]},"spawn":{"pos":[{"x":24,"y":21},{"x":26,"y":21},{"x":23,"y":24}]},"lab":{"pos":[{"x":22,"y":23}]},"terminal":{"pos":[{"x":24,"y":23}]}}}

Roomtype Fort:
1-exit rooms with small passages (2-3) that is heavily fortified (300M ramparts)
Preferably exits to sk-room or highway, and has 2 sources and a good mineral

6 distributed towers around entrance for surviving nukes
2 links for sources
1 for flower
1 for entrance


*/
