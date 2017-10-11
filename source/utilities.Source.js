"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const roomlevel_1 = require("./enums.roomlevel");
const RoomRepository = require("./repository.Room");
const IntelLib = require("./lib.intel");
function getTiersRequiredForPioneerMining(tier, possibleMiningPositions, spawnPos, sourcePos) {
    const ticksToFill = 25;
    let distance = PathfindingUtilities.getDistanseBetween(spawnPos, sourcePos);
    let workerpartsNeeded = 5;
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}
exports.getTiersRequiredForPioneerMining = getTiersRequiredForPioneerMining;
function getTiersRequiredForDistanceMining(source, spawn, tier) {
    const ticksToFill = 25;
    let energyPerTick = (source.energyCapacity / 300);
    let workerpartsNeeded = energyPerTick / 2;
    let possibleMiningPositions = getNumberOfPossibleMiningPositions(source);
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    let distance = PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos);
    let timeUsedForMining = ticksToFill / (ticksToFill + (distance * 2));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}
exports.getTiersRequiredForDistanceMining = getTiersRequiredForDistanceMining;
function getWorkerPartsRequiredForContainerMining(tier) {
    let energyPerTick = 10;
    let workerpartsNeeded = (energyPerTick / 2);
    let possibleMiningPositions = 3;
    let possibleWorkerpartsWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsWithTier);
    return workerpartsPossbleAtSource;
}
exports.getWorkerPartsRequiredForContainerMining = getWorkerPartsRequiredForContainerMining;
function getRequiredEnergyHaulers(room, maxTier) {
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
exports.getRequiredEnergyHaulers = getRequiredEnergyHaulers;
function getTiersRequiredForContainerHauling(sourcePos, homeRoom, sourceSize) {
    let storage = homeRoom.storage;
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
    if (RoomRepository.getRoomLevel(homeRoom) < roomlevel_1.RoomLevel.CivilizedColony) {
        energyPerTrip = energyPerTrip + 30;
    }
    return Math.ceil(1.2 * energyPerTrip / 100);
}
exports.getTiersRequiredForContainerHauling = getTiersRequiredForContainerHauling;
function getTiersRequiredForMineralHauling(mineral, homeRoom) {
    let storage = homeRoom.storage;
    let spawn = homeRoom.getSpawn();
    if (storage === undefined && spawn !== undefined) {
        storage = spawn;
    }
    if (storage === undefined) {
        console.log("No spawn or storage found for mineralhaulers homeroom.");
        return 0;
    }
    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, mineral.pos);
    let mineralsPerTick = 4;
    let timeUsedForRoundtrip = (distance * 2);
    let mineralsPerTrip = timeUsedForRoundtrip * mineralsPerTick;
    return Math.ceil(1.2 * mineralsPerTrip / 100);
}
exports.getTiersRequiredForMineralHauling = getTiersRequiredForMineralHauling;
function getTiersRequiredForOutpostDistanceMining(sourcePos, energyCap, spawn, tier, possibleMiningPositions, distance) {
    const ticksToFill = 25;
    let energyPerTick = (energyCap / 300);
    let workerpartsNeeded = energyPerTick / 2;
    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
    if (sourcePos === spawn.pos) {
        console.log("Should never happend");
    }
    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
    return workerpartsNeededWithTravel;
}
exports.getTiersRequiredForOutpostDistanceMining = getTiersRequiredForOutpostDistanceMining;
function getNumberOfPossibleMiningPositions(source) {
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
exports.getNumberOfPossibleMiningPositions = getNumberOfPossibleMiningPositions;
function getAllMinedSources(rooms) {
    let minedSources = [];
    for (let i = 0; i < rooms.length; i++) {
        minedSources = minedSources.concat(getAllSourcesInRoom(rooms[i]));
    }
    return minedSources;
}
exports.getAllMinedSources = getAllMinedSources;
function getAllSourcesInRoom(room) {
    return room.find(FIND_SOURCES);
}
exports.getAllSourcesInRoom = getAllSourcesInRoom;
function getDistanceToSource(room, source) {
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
function getSourcesNeedingHauling(room) {
    let sources = [];
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
    return _.shuffle(_.map(sources, function (c) { return c.id; }));
}
exports.getSourcesNeedingHauling = getSourcesNeedingHauling;
