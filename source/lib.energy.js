"use strict";
const RoomUtilities = require("./utilities.Room");
function roomIsFull(room) {
    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
        if (room.energyAvailable < room.energyCapacityAvailable) {
            return false;
        }
        let baseContainer = room.getBaseContainer();
        if (baseContainer !== undefined && !(baseContainer.store[RESOURCE_ENERGY] < baseContainer.storeCapacity - 50)) {
            let controllerContainer = room.controller.getContainer();
            if (controllerContainer !== undefined) {
                if (controllerContainer.store[RESOURCE_ENERGY] > 1000) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
exports.roomIsFull = roomIsFull;
function getBuildingIdForTanking(room) {
    if (room.storage !== undefined) {
        return room.storage.id;
    }
    let baseContainer = room.getBaseContainer();
    if (baseContainer instanceof StructureContainer) {
        return baseContainer.id;
    }
    if (room.terminal !== undefined) {
        return room.terminal.id;
    }
    let containersInRoom = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
    for (let container of containersInRoom) {
        return container.id;
    }
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
    for (let spawn of spawnsInRoom) {
        return spawn.id;
    }
    console.log("Error: No place found for tanking energy in room: " + room.name);
    return "";
}
exports.getBuildingIdForTanking = getBuildingIdForTanking;
function getBuildingIdForDump(room, creep) {
    if (room.storage !== undefined && room.storage.isActive()) {
        return room.storage.id;
    }
    if (room.terminal !== undefined && room.terminal.isActive()) {
        return room.terminal.id;
    }
    let baseContainer = room.getBaseContainer();
    if (baseContainer !== undefined && baseContainer.store[RESOURCE_ENERGY] < 1500) {
        return baseContainer.id;
    }
    let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    for (let tower of towersInRoom) {
        if (tower.energy < tower.energyCapacity - 50) {
            return tower.id;
        }
    }
    if (creep.room.name === room.name) {
        let closestExtensionOrSpawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function (e) {
                return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
            } });
        if (closestExtensionOrSpawn !== undefined && closestExtensionOrSpawn !== null) {
            return closestExtensionOrSpawn.id;
        }
    }
    else {
        let extensionsAndSpawns = room.find(FIND_MY_STRUCTURES, { filter: function (e) {
                return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
            } });
        if (extensionsAndSpawns.length > 0) {
            return extensionsAndSpawns[(_.random(0, extensionsAndSpawns.length - 1))].id;
        }
    }
    let controllerContainer = room.controller.getContainer();
    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < 1000 &&
        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] > 500) {
        return controllerContainer.id;
    }
    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < (controllerContainer.storeCapacity - 100) &&
        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] === baseContainer.storeCapacity) {
        return controllerContainer.id;
    }
    if (baseContainer instanceof StructureContainer) {
        return baseContainer.id;
    }
    let spawn = room.getSpawn();
    if (spawn !== undefined) {
        return spawn.id;
    }
    console.log("Error: No place found for dumping energy in room: " + room.name);
    return "";
}
exports.getBuildingIdForDump = getBuildingIdForDump;
