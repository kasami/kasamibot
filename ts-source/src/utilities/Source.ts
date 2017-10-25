/**
 * Is actually resource-utilities
 */

import * as PathfindingUtilities from "../utilities/Pathfinding";

import {RoomLevel} from "../enums/roomlevel";

import * as RoomRepository from "../repository/Room";

import * as IntelLib from "../lib/intel";


export function getTiersRequiredForPioneerMining(tier: number, possibleMiningPositions: number, spawnPos: RoomPosition, sourcePos: RoomPosition): number {
    const ticksToFill = 25; // 50 capacity / 2 mined per tick
    let distance = PathfindingUtilities.getDistanseBetween(spawnPos, sourcePos);
    let workerpartsNeeded = 5;
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}

/**
 * Get number of workerparts needed to distancemine a source to spawn.
 * Based on 1 move every tick, ie. enough move-parts.
 * TODO: Legg til caching.
 */
export function getTiersRequiredForDistanceMining(source: Source, spawn: Spawn, tier: number): number {
    const ticksToFill = 25; // 50 capacity / 2 mined per tick
    let energyPerTick = (source.energyCapacity / 300);
    let workerpartsNeeded = energyPerTick / 2; // energy per tick / 2 mined per tick
    let possibleMiningPositions = getNumberOfPossibleMiningPositions(source);
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    let distance = PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos);
    let timeUsedForMining = ticksToFill / (ticksToFill + (distance * 2));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}

export function getWorkerPartsRequiredForContainerMining(tier: number /*, sourcePos: RoomPosition, homeRoom: Room*/): number {
    let energyPerTick = 10; // TODO: Fix for actual number (source.energyCapacity / 300);
    let workerpartsNeeded = (energyPerTick / 2); // energy per tick / 2 mined per tick - I add 2 for making sure I have enough when traveling and dumping.
    let possibleMiningPositions = 3; //TODO: Fix for actual number source.getContainerMiningPositions().length;
    let possibleWorkerpartsWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsWithTier);
    return workerpartsPossbleAtSource;
}

export function getRequiredEnergyHaulers(room: Room, maxTier: number): number {
    let spawn = room.getSpawn();
    if (spawn === undefined) {
        return 0;
    }
    let energyDistancePerHauler = maxTier * 50;
    let energyDistance = 0;

    let sourcesInRoom = getAllSourcesInRoom(room);
    for (let source of sourcesInRoom) {
        let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, source.pos);
        energyDistance += 10 * distance;
    }

    let outposts = RoomRepository.getBasicOutposts(room);
    for (let outpost of outposts) {
        if (IntelLib.hasIntel(outpost)) {
            for (let sourceId of IntelLib.sourceIds(outpost)) {
                let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, IntelLib.sourcePos(outpost, sourceId));
                    energyDistance += 10 * distance;
            }
        }
    }

    let lairs = RoomRepository.getLairOutposts(room);
    for (let outpost of lairs) {
        if (IntelLib.hasIntel(outpost)) {
            for (let sourceId of IntelLib.sourceIds(outpost)) {
                let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, IntelLib.sourcePos(outpost, sourceId));
                energyDistance += 16 * distance;
            }
        }
    }

    return Math.ceil(energyDistance / energyDistancePerHauler);
}

export function getTiersRequiredForContainerHauling(sourcePos: RoomPosition, homeRoom: Room, sourceSize: number): number {
    let storage = homeRoom.storage as Structure;
    let spawn = homeRoom.getSpawn();
    if (storage === undefined && spawn !== undefined) {
        storage = spawn;
    }
    if (storage === undefined) {
        console.log("No spawn or storage found for containerhaulers homeroom.");
        return 0;
    }
    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, sourcePos);
    let energyPerTick = Math.ceil(sourceSize / 300);
    let timeUsedForRoundtrip = (distance * 2);
    let energyPerTrip = timeUsedForRoundtrip * energyPerTick;
    if (RoomRepository.getRoomLevel(homeRoom) < RoomLevel.CivilizedColony) {
        energyPerTrip = energyPerTrip + 30;
    }
    return Math.ceil(1.2 * energyPerTrip / 100);
}

export function getTiersRequiredForMineralHauling(mineral: Mineral, homeRoom: Room): number {
    let storage = homeRoom.storage as Structure;
    let spawn = homeRoom.getSpawn();
    if (storage === undefined && spawn !== undefined) {
        storage = spawn;
    }
    if (storage === undefined) {
        console.log("No spawn or storage found for mineralhaulers homeroom.");
        return 0;
    }
    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, mineral.pos);
    let mineralsPerTick = 4; // Todo, hardcoded, need to be maintained.
    let timeUsedForRoundtrip = (distance * 2);
    let mineralsPerTrip = timeUsedForRoundtrip * mineralsPerTick;
    return Math.ceil(1.2 * mineralsPerTrip / 100);
}

export function getTiersRequiredForOutpostDistanceMining(
    sourcePos: RoomPosition, energyCap: number, spawn: Spawn, tier: number,
    possibleMiningPositions: number, distance: number ): number {
    const ticksToFill = 25; // 50 capacity / 2 mined per tick
    let energyPerTick = (energyCap / 300);
    let workerpartsNeeded = energyPerTick / 2; // energy per tick / 2 mined per tick
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    if (sourcePos === spawn.pos) {
        console.log("Should never happend");
    }
    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}
/*
Math:
useless_time_per_1500 = 2 * distance from spawn to source
efficiency = (1300 - useless_time_per_1500) / 1500
worker_parts = ceil (10 / efficiency)
miners_needed = ceil (12 / (2 * 2 * tier))

Example:
distance from spawn: 12
efficiency = 85 %
worker-parts = 12
miners = 3 T1, 2 T2, 1 T3

*/

/**
 * Get number of positions that can mine a source
 * TODO: Legg til caching.
 */
export function getNumberOfPossibleMiningPositions(source: Source): number {
    let count = 0;
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            let position = new RoomPosition(source.pos.x + x, source.pos.y + y, source.room.name);
            if (!(position.x === source.pos.x && position.y === source.pos.y)) {
                let atPosition = position.lookFor(LOOK_TERRAIN);
                if (atPosition[0] === "swamp" || atPosition[0] === "plain") {
                    count++;
                }
            }
        }
    }
    return count;
}

/**
 * Gets all mined sources. Currently mined sources means sources in rooms where I have a spawn.
 */
export function getAllMinedSources(rooms: Room[]): Source[] {
    let minedSources: Source[] = [];
    for (let i = 0; i < rooms.length; i++) {
        minedSources = minedSources.concat(getAllSourcesInRoom(rooms[i]));
    }
    return minedSources;
}

/**
 * Gets all sources in a room.
 * TODO: Caching
 */
export function getAllSourcesInRoom(room: Room): Source[] {
    return room.find(FIND_SOURCES) as Source[];
}

function getDistanceToSource(room: Room, source: Source): number {
    let saved = source.getDistanceFrom(room.name);
    if (saved === undefined) {
        let spawn = room.getSpawn();
        if (spawn === undefined) {
            return 50;
        }
        let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, source.pos);
        source.setDistanceFrom(room.name, distance);
        return distance;
    }
    return saved;
}

export function getSourcesNeedingHauling(room: Room): string[] {
    let sources: Source[] = [];

    for (let source of getAllSourcesInRoom(room)) {
        let container = source.getMiningContainer();
        if (container instanceof StructureContainer) {
            let distanceFromBase = getDistanceToSource(room, source);
            let limit = 1400 - (distanceFromBase * 16);
            if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
                sources.push(source);
            }
        }
    }

    let outposts = RoomRepository.getBasicOutposts(room);
    for (let outpost of outposts) {
        if (Game.rooms[outpost] !== undefined) {
            for (let source of getAllSourcesInRoom(Game.rooms[outpost])) {
                let container = source.getMiningContainer();
                if (container instanceof StructureContainer) {
                    let distanceFromBase = getDistanceToSource(room, source);
                    let limit = 1400 - (distanceFromBase * 16);
                    if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
                        sources.push(source);
                    }
                }
            }
        }
    }

    let lairs = RoomRepository.getLairOutposts(room);
    for (let outpost of lairs) {
        if (Game.rooms[outpost] !== undefined) {
            for (let source of getAllSourcesInRoom(Game.rooms[outpost])) {
                let container = source.getMiningContainer();
                if (container instanceof StructureContainer) {
                    let distanceFromBase = getDistanceToSource(room, source);
                    let limit = 1400 - (distanceFromBase * 28);
                    if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
                        sources.push(source);
                    }
                }
            }
        }
    }

    return _.shuffle(_.map(sources, function (c: Source) {return c.id}));
}
