"use strict";
function removeAllWalls(room) {
    let walls = room.find(FIND_STRUCTURES, { filter: function (x) { return x.structureType === STRUCTURE_WALL; } });
    for (let wall of walls) {
        wall.destroy();
    }
    room.memory.removeWalls = undefined;
}
exports.removeAllWalls = removeAllWalls;
function removeAllHostileStructures(room) {
    let structures = room.find(FIND_HOSTILE_STRUCTURES);
    for (let s of structures) {
        if (!(s.structureType === STRUCTURE_TERMINAL && s.store[RESOURCE_ENERGY] > 5000) &&
            !(s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 5000)) {
            s.destroy();
        }
    }
    let constSites = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    for (let s of constSites) {
        s.remove();
    }
}
exports.removeAllHostileStructures = removeAllHostileStructures;
function removeAllFriendlyStructures(room, saveEnergyBuildings = false) {
    let structures = room.find(FIND_MY_STRUCTURES);
    if (saveEnergyBuildings === true) {
        structures = _.filter(structures, (s) => s.structureType !== STRUCTURE_TERMINAL && s.structureType !== STRUCTURE_STORAGE);
    }
    for (let s of structures) {
        s.destroy();
    }
    let constSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    for (let s of constSites) {
        s.remove();
    }
}
exports.removeAllFriendlyStructures = removeAllFriendlyStructures;
function getVitalBuildings(room) {
    return room.find(FIND_MY_STRUCTURES, { filter: function (s) {
            return s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER ||
                s.structureType === STRUCTURE_TERMINAL || s.structureType === STRUCTURE_STORAGE ||
                s.structureType === STRUCTURE_NUKER || s.structureType === STRUCTURE_POWER_SPAWN;
        } });
}
exports.getVitalBuildings = getVitalBuildings;
