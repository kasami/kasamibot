Room.prototype.getHostileCreeps = function () {
    return this.find(FIND_HOSTILE_CREEPS);
};
Room.prototype.getHostileCreepsNotAtBorder = function () {
    return _.filter(this.getHostileCreeps(), function (c) { return !c.isAtBorder(); });
};
Room.prototype.hasHostileCreeps = function () {
    return this.getHostileCreeps().length > 0;
};
Room.prototype.getSpawns = function () {
    return this.find(FIND_MY_SPAWNS);
};
Room.prototype.getSpawn = function () {
    let spawns = this.getSpawns();
    if (spawns.length === 0) {
        return undefined;
    }
    return spawns[0];
};
Room.prototype.getSources = function () {
    return this.find(FIND_SOURCES);
};
Room.prototype.getMineral = function () {
    let minerals = this.find(FIND_MINERALS);
    if (minerals.length > 0) {
        return minerals[0];
    }
    return undefined;
};
Room.prototype.hasFreeSpawnCapacity = function () {
    let spawns = this.getSpawns();
    if (spawns === undefined || spawns.length < 1) {
        return false;
    }
    for (let spawn of spawns) {
        if (!spawn.spawning) {
            return true;
        }
    }
    return false;
};
Room.prototype.getFreeSpawn = function () {
    let spawns = this.getSpawns();
    if (spawns === undefined || spawns.length < 1) {
        return undefined;
    }
    for (let spawn of spawns) {
        if (!spawn.spawning) {
            return spawn;
        }
    }
    return undefined;
};
Room.prototype.getBoostLab = function () {
    if (this.memory.b === undefined) {
        return undefined;
    }
    let split = this.memory.b.split("-");
    let pos = new RoomPosition(+split[0], +split[1], this.name);
    let structures = (new RoomPosition(pos.x + 1, pos.y + 4, pos.roomName)).lookFor(LOOK_STRUCTURES);
    for (let s of structures) {
        if (s.structureType === STRUCTURE_LAB) {
            return s;
        }
    }
    return undefined;
};
Room.prototype.getPowerSpawn = function () {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.powerspawn !== undefined) {
        let powerspawn = Game.getObjectById(this.memory.powerspawn);
        if (powerspawn instanceof StructurePowerSpawn) {
            return powerspawn;
        }
        else {
            this.memory.powerspawn = undefined;
        }
    }
    let powerspawn = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_POWER_SPAWN });
    if (powerspawn.length > 0) {
        this.memory.powerspawn = powerspawn[0].id;
        return powerspawn[0];
    }
    return undefined;
};
Room.prototype.getNuker = function () {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.nuker !== undefined) {
        let nuker = Game.getObjectById(this.memory.nuker);
        if (nuker instanceof StructureNuker) {
            return nuker;
        }
        else {
            this.memory.nuker = undefined;
        }
    }
    let nuker = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_NUKER });
    if (nuker.length > 0) {
        this.memory.nuker = nuker[0].id;
        return nuker[0];
    }
    return undefined;
};
Room.prototype.getObserver = function () {
    if (this.controller === undefined || this.controller.level < 8) {
        return undefined;
    }
    if (this.memory.observer !== undefined) {
        let observer = Game.getObjectById(this.memory.observer);
        if (observer instanceof StructureObserver) {
            return observer;
        }
        else {
            this.memory.observer = undefined;
        }
    }
    let observer = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_OBSERVER });
    if (observer.length > 0) {
        this.memory.observer = observer[0].id;
        return observer[0];
    }
    return undefined;
};
Room.prototype.getBaseContainer = function () {
    let c = Game.getObjectById(this.memory["roomContainer"]);
    if (c instanceof StructureContainer) {
        return c;
    }
    return undefined;
};
Room.prototype.getBaseLink = function () {
    if (this.memory.b === undefined) {
        return undefined;
    }
    let split = this.memory.b.split("-");
    let pos = new RoomPosition(+split[0], +split[1], this.name);
    let structures = (new RoomPosition(pos.x - 1, pos.y + 4, pos.roomName)).lookFor(LOOK_STRUCTURES);
    for (let s of structures) {
        if (s.structureType === STRUCTURE_LINK) {
            return s;
        }
    }
    return undefined;
};
Room.prototype.hasLabArea = function () {
    if (this.memory.lab === undefined || this.memory.lab.operational === undefined) {
        return false;
    }
    return this.memory.lab.operational === true;
};
Room.prototype.getProcessingLabs = function () {
    let labs = [];
    if (this.memory.lab !== undefined && this.memory.lab.processingLabs !== undefined) {
        labs = _.map(this.memory.lab.processingLabs, function (id) {
            return Game.getObjectById(id);
        });
    }
    let boostLab = this.getBoostLab();
    if (this.memory.boosting !== true && boostLab !== undefined) {
        labs.push(boostLab);
    }
    return labs;
};
Room.prototype.getSupplyingLabs = function () {
    if (this.memory.lab === undefined || this.memory.lab.supplyingLabs === undefined) {
        return [];
    }
    return _.map(this.memory.lab.supplyingLabs, function (id) {
        return Game.getObjectById(id);
    });
};
Room.prototype.isExpansion = function () {
    return this.memory.isExpansion === true;
};
Room.prototype.hasExpansion = function () {
    return this.memory.expansion !== undefined;
};
Room.prototype.isAbandoned = function () {
    return this.memory.isBeingDismantled === true;
};
Room.prototype.isUnderSiege = function () {
    return this.memory.defcon !== undefined && this.memory.defcon > 1;
};
