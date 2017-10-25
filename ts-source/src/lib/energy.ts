import * as RoomUtilities from "../utilities/Room";

export function roomIsFull(room: Room): boolean {
    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
        if (room.energyAvailable < room.energyCapacityAvailable) {
            return false;
        }
        let baseContainer = room.getBaseContainer();
        if (baseContainer !== undefined && !(baseContainer.store[RESOURCE_ENERGY] < baseContainer.storeCapacity - 50)) {
            let controllerContainer = (room.controller as StructureController).getContainer();
            if (controllerContainer !== undefined) {
                if (controllerContainer.store[RESOURCE_ENERGY] > 1000) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}

export function getBuildingIdForTanking(room: Room): string {

    // Storage
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

    let containersInRoom = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}) as Container[];
    for (let container of containersInRoom) {
      return container.id;
    }

    // Spawn ellers
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}}) as Spawn[];
    for (let spawn of spawnsInRoom) {
      return spawn.id;
    }

    // Kommer vi hit må det være et tomt rom.
    console.log("Error: No place found for tanking energy in room: " + room.name);
    return "";
}

/**
 * Provides a structure-id for where the creep should dump energy.
 */
export function getBuildingIdForDump(room: Room, creep: Creep): string {

    if (room.storage !== undefined && room.storage.isActive()) {
        return room.storage.id;
    }

    if (room.terminal !== undefined && room.terminal.isActive()) {
        return room.terminal.id;
    }

    // Finner room.container
    let baseContainer = room.getBaseContainer();
    if (baseContainer !== undefined && baseContainer.store[RESOURCE_ENERGY] < 1500) {
        return baseContainer.id;
    }

    // Tower
    let towersInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}) as Tower[];
    for (let tower of towersInRoom) {
      if (tower.energy < tower.energyCapacity - 50) {
          return tower.id;
      }
    }

    // Extension or spawn
    if (creep.room.name === room.name) {
        let closestExtensionOrSpawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: function (e: Extension | Spawn) {
            return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
        }}) as Extension | Spawn;
        if (closestExtensionOrSpawn !== undefined && closestExtensionOrSpawn !== null) {
            return closestExtensionOrSpawn.id;
        }
    } else {
        let extensionsAndSpawns = room.find(FIND_MY_STRUCTURES, {filter: function (e: Extension | Spawn) {
            return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
        }}) as Structure[];
        if (extensionsAndSpawns.length > 0) {
            return extensionsAndSpawns[(_.random(0, extensionsAndSpawns.length - 1))].id;
        }
    }

    // Hvis room.container har mer enn 500 og vi har en controller.container med mindre enn 1000, bruk DENNE
    let controllerContainer = (room.controller as StructureController).getContainer();
    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < 1000 &&
        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] > 500) {
        return controllerContainer.id;
    }

    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < (controllerContainer.storeCapacity - 100) &&
        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] === baseContainer.storeCapacity) {
        return controllerContainer.id;
    }

    // Ellers room-container
    if (baseContainer instanceof StructureContainer) {
        return baseContainer.id;
    }

    // Spawn ellers, skal vel aldri skje, siden vi prøver tidligere
    let spawn = room.getSpawn();
    if (spawn !== undefined) {
      return spawn.id;
    }

    // Kommer vi hit må det være et tomt rom.
    console.log("Error: No place found for dumping energy in room: " + room.name);
    return "";
}
