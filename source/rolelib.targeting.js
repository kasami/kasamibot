"use strict";
function getFriendsList() {
    if (Memory.friendly === undefined) {
        Memory.friendly = [];
    }
    return Memory.friendly;
}
exports.getFriendsList = getFriendsList;
function isCreepHostile(creep) {
    return _.indexOf(getFriendsList(), creep.owner.username) < 0;
}
exports.isCreepHostile = isCreepHostile;
function filterFriendlyCreepsFromList(creeps) {
    return _.filter(creeps, function (c) {
        return _.indexOf(getFriendsList(), c.owner.username) < 0;
    });
}
exports.filterFriendlyCreepsFromList = filterFriendlyCreepsFromList;
function filterStructuresOnBigRamparts(structures) {
    return _.filter(structures, function (s) {
        let atPos = s.pos.lookFor(LOOK_STRUCTURES);
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART && sAtPos.hits > 100000) {
                return false;
            }
        }
        return true;
    });
}
exports.filterStructuresOnBigRamparts = filterStructuresOnBigRamparts;
function filterConstructionSitesOnRamparts(structures) {
    return _.filter(structures, function (s) {
        let atPos = s.pos.lookFor(LOOK_STRUCTURES);
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART) {
                return false;
            }
        }
        return true;
    });
}
exports.filterConstructionSitesOnRamparts = filterConstructionSitesOnRamparts;
function filterFriendlyStructuresFromList(structures) {
    return _.filter(structures, function (s) {
        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
    });
}
exports.filterFriendlyStructuresFromList = filterFriendlyStructuresFromList;
function filterFriendlyConstructionSitesFromList(structures) {
    return _.filter(structures, function (s) {
        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
    });
}
exports.filterFriendlyConstructionSitesFromList = filterFriendlyConstructionSitesFromList;
function filterPillageableStructuresFromList(structures) {
    return _.filter(structures, function (s) {
        return !((s.structureType === STRUCTURE_STORAGE && _.sum(s.store) > 50000) ||
            (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) > 50000));
    });
}
exports.filterPillageableStructuresFromList = filterPillageableStructuresFromList;
function findHostileVitalStructures(room, pillage = false) {
    let structures = room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) {
            return s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN ||
                s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_TERMINAL;
        } });
    if (pillage) {
        structures = filterPillageableStructuresFromList(structures);
    }
    return filterFriendlyStructuresFromList(structures);
}
exports.findHostileVitalStructures = findHostileVitalStructures;
function findHostileStructures(room) {
    let structures = room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) {
            return s.structureType !== STRUCTURE_CONTROLLER && s.structureType !== STRUCTURE_RAMPART &&
                s.structureType !== STRUCTURE_POWER_BANK && s.structureType !== STRUCTURE_TERMINAL;
        } });
    return filterFriendlyStructuresFromList(structures);
}
exports.findHostileStructures = findHostileStructures;
function findHostileConstructionSites(room) {
    let structures = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: function (s) {
            return s.structureType !== STRUCTURE_EXTRACTOR;
        } });
    return filterFriendlyConstructionSitesFromList(structures);
}
exports.findHostileConstructionSites = findHostileConstructionSites;
function findClosestHostileCreepsInRoom(pos) {
    return pos.findClosestByRange(findHostileCreepsInRoom(Game.rooms[pos.roomName]));
}
exports.findClosestHostileCreepsInRoom = findClosestHostileCreepsInRoom;
function findHostileCreepsInRoom(room, includeNPCs = true) {
    let creeps = room.find(FIND_HOSTILE_CREEPS);
    if (includeNPCs === false) {
        creeps = _.filter(creeps, (c) => c.owner.username !== "Invader" && c.owner.username !== "Source Keeper");
    }
    return filterFriendlyCreepsFromList(creeps);
}
exports.findHostileCreepsInRoom = findHostileCreepsInRoom;
function findHostileCreepsInRangedRange(pos) {
    let creeps = pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    return filterFriendlyCreepsFromList(creeps);
}
exports.findHostileCreepsInRangedRange = findHostileCreepsInRangedRange;
function getPrioritizedTarget(creep) {
    let enemiesInRoom = findHostileCreepsInRoom(creep.room);
    if (enemiesInRoom.length < 1) {
        return null;
    }
    let closestDangerousCreep = creep.pos.findClosestByPath(enemiesInRoom, {
        filter: function (c) {
            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
        }
    });
    if (closestDangerousCreep !== null && closestDangerousCreep !== undefined) {
        return closestDangerousCreep;
    }
    let closestCreep = creep.pos.findClosestByPath(enemiesInRoom);
    if (closestCreep !== undefined) {
        return closestCreep;
    }
    return null;
}
exports.getPrioritizedTarget = getPrioritizedTarget;
function getPrioritizedTargetIncludingVitalBuildings(creep) {
    let hostileCreep = getPrioritizedTarget(creep);
    if (hostileCreep !== null) {
        return hostileCreep;
    }
    let structures = findHostileVitalStructures(creep.room);
    let closestStructure = creep.pos.findClosestByPath(structures);
    if (closestStructure !== undefined) {
        return closestStructure;
    }
    return null;
}
exports.getPrioritizedTargetIncludingVitalBuildings = getPrioritizedTargetIncludingVitalBuildings;
