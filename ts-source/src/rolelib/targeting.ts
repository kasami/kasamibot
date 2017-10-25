export function getFriendsList(): string[] {
    if (Memory.friendly === undefined) {
        Memory.friendly = [];
    }
    return Memory.friendly;
}

export function isCreepHostile(creep: Creep): boolean {
    return _.indexOf(getFriendsList(), creep.owner.username) < 0;
}

export function filterFriendlyCreepsFromList(creeps: Creep[]): Creep[] {
    return _.filter(creeps, function (c: Creep ) {
        return _.indexOf(getFriendsList(), c.owner.username) < 0;
    });
}

export function filterStructuresOnBigRamparts(structures: Structure[]): Structure[] {
    return _.filter(structures, function(s: Structure) {
        let atPos = s.pos.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART && sAtPos.hits > 100000) {
                return false;
            }
        }
        return true;
    });
}
export function filterConstructionSitesOnRamparts(structures: ConstructionSite[]): ConstructionSite[] {
    return _.filter(structures, function(s: ConstructionSite) {
        let atPos = s.pos.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART) {
                return false;
            }
        }
        return true;
    });
}

export function filterFriendlyStructuresFromList(structures: Structure[]): Structure[] {
    return _.filter(structures, function (s: Structure ) {
        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
    });
}
export function filterFriendlyConstructionSitesFromList(structures: ConstructionSite[]): ConstructionSite[] {
    return _.filter(structures, function (s: ConstructionSite ) {
        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
    });
}

export function filterPillageableStructuresFromList(structures: Structure[]): Structure[] {
    return _.filter(structures, function (s: Structure ) {
        return !((s.structureType === STRUCTURE_STORAGE && _.sum((s as StructureStorage).store) > 50000) ||
        (s.structureType === STRUCTURE_TERMINAL && _.sum((s as StructureTerminal).store) > 50000));
    });
}



export function findHostileVitalStructures(room: Room, pillage: boolean = false): Structure[] {
    let structures = room.find(FIND_HOSTILE_STRUCTURES, {filter: function (s: Structure) {
        return s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN ||
        s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_TERMINAL;
    }}) as Structure[];
    if (pillage) {
        structures = filterPillageableStructuresFromList(structures);
    }
    return filterFriendlyStructuresFromList(structures);
}

export function findHostileStructures(room: Room): Structure[] {
    let structures = room.find(FIND_HOSTILE_STRUCTURES, {filter: function (s: Structure) {
        return s.structureType !== STRUCTURE_CONTROLLER && s.structureType !== STRUCTURE_RAMPART &&
        s.structureType !== STRUCTURE_POWER_BANK && s.structureType !== STRUCTURE_TERMINAL;
    }}) as Structure[];
    return filterFriendlyStructuresFromList(structures);
}

export function findHostileConstructionSites(room: Room): ConstructionSite[] {
    let structures = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: function (s: Structure) {
        return s.structureType !== STRUCTURE_EXTRACTOR;
    }}) as ConstructionSite[];
    return filterFriendlyConstructionSitesFromList(structures);
}

export function findClosestHostileCreepsInRoom(pos: RoomPosition): Creep | undefined | null {
    return pos.findClosestByRange(findHostileCreepsInRoom(Game.rooms[pos.roomName]));
}

export function findHostileCreepsInRoom(room: Room, includeNPCs: boolean = true): Creep[] {
    let creeps = room.find(FIND_HOSTILE_CREEPS) as Creep[];
    if (includeNPCs === false) {
        creeps = _.filter(creeps,
            (c: Creep) => c.owner.username !== "Invader" && c.owner.username !== "Source Keeper");
    }
    return filterFriendlyCreepsFromList(creeps);
}

export function findHostileCreepsInRangedRange(pos: RoomPosition): Creep[] {
    let creeps = pos.findInRange(FIND_HOSTILE_CREEPS, 3) as Creep[];
    return filterFriendlyCreepsFromList(creeps);
}

export function getPrioritizedTarget(creep: Creep): Creep | null {
    let enemiesInRoom = findHostileCreepsInRoom(creep.room);
    if (enemiesInRoom.length < 1) {
        return null;
    }

    // Find closest attack/heal/ranged_attack-creature
    let closestDangerousCreep = creep.pos.findClosestByPath(enemiesInRoom, {
        filter: function(c: Creep) {
            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
        }
    }) as Creep;
    if (closestDangerousCreep !== null && closestDangerousCreep !== undefined) {
        return closestDangerousCreep;
    }

    // Find others
    let closestCreep = creep.pos.findClosestByPath(enemiesInRoom) as Creep;
    if (closestCreep !== undefined) {
        return closestCreep;
    }
    return null;
}



export function getPrioritizedTargetIncludingVitalBuildings(creep: Creep): Creep | Structure | null {
    let hostileCreep = getPrioritizedTarget(creep);
    if (hostileCreep !== null) {
        return hostileCreep;
    }
    let structures = findHostileVitalStructures(creep.room);

    // Find structures
    let closestStructure = creep.pos.findClosestByPath(structures) as Structure;
    if (closestStructure !== undefined) {
        return closestStructure;
    }
    return null;
}
