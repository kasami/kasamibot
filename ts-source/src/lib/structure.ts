export function removeAllWalls(room: Room): void {
    let walls = room.find(FIND_STRUCTURES, {filter: function (x: Structure) { return x.structureType === STRUCTURE_WALL; }}) as StructureWall[];

    for (let wall of walls) {
        wall.destroy();
    }
    room.memory.removeWalls = undefined;
}

export function removeAllHostileStructures(room: Room): void {
    let structures = room.find(FIND_HOSTILE_STRUCTURES) as Structure[];

    for (let s of structures) {
        if (!(s.structureType === STRUCTURE_TERMINAL && (s as StructureTerminal).store[RESOURCE_ENERGY] > 5000) &&
        !(s.structureType === STRUCTURE_STORAGE && (s as StructureStorage).store[RESOURCE_ENERGY] > 5000)) {
            s.destroy();
        }
    }

    let constSites = room.find(FIND_HOSTILE_CONSTRUCTION_SITES) as ConstructionSite[];

    for (let s of constSites) {
        s.remove();
    }
}

export function removeAllFriendlyStructures(room: Room, saveEnergyBuildings: boolean = false): void {
    let structures = room.find(FIND_MY_STRUCTURES) as Structure[];

    if (saveEnergyBuildings === true) {
        structures = _.filter(structures, (s: Structure) => s.structureType !== STRUCTURE_TERMINAL && s.structureType !== STRUCTURE_STORAGE);
    }

    for (let s of structures) {
        s.destroy();
    }

    let constSites = room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

    for (let s of constSites) {
        s.remove();
    }
}

export function getVitalBuildings(room: Room): Structure[] {
    return room.find(FIND_MY_STRUCTURES, {filter: function(s: Structure) {
        return s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER ||
               s.structureType === STRUCTURE_TERMINAL || s.structureType === STRUCTURE_STORAGE ||
               s.structureType === STRUCTURE_NUKER || s.structureType === STRUCTURE_POWER_SPAWN
    }}) as Structure[];
}
