Mineral.prototype.memoryCheck = function () {
    if (Memory.minerals === undefined) {
        Memory.minerals = {};
    }
    if (Memory.minerals[this.id] === undefined) {
        Memory.minerals[this.id] = {};
    }
};
Mineral.prototype.hasExtractor = function () {
    let structures = this.pos.lookFor(LOOK_STRUCTURES);
    for (let structure of structures) {
        if (structure instanceof StructureExtractor) {
            return true;
        }
    }
    return false;
};
Mineral.prototype.hasMiningContainer = function () {
    return this.getMiningContainer() !== null;
};
Mineral.prototype.buildExtractor = function () {
    return this.pos.createConstructionSite(STRUCTURE_EXTRACTOR) === 0;
};
Mineral.prototype.setMiningContainerId = function (id) {
    this.memoryCheck();
    Memory.minerals[this.id]["container"] = id;
};
Mineral.prototype.getMiningContainer = function () {
    this.memoryCheck();
    if (Memory.minerals[this.id]["container"] === undefined) {
        this.buildMiningContainer();
        return null;
    }
    let container = Game.getObjectById(Memory.minerals[this.id]["container"]);
    if (container === null) {
        Memory.minerals[this.id]["container"] = undefined;
    }
    return container;
};
Mineral.prototype.getMiningContainerConstructionSite = function () {
    this.memoryCheck();
    let position = this.getContainerPosition();
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES);
        for (let structure of structures) {
            if (structure instanceof ConstructionSite && structure.structureType === STRUCTURE_CONTAINER) {
                return structure;
            }
        }
    }
    return null;
};
Mineral.prototype.buildMiningContainer = function () {
    this.memoryCheck();
    let position = this.getContainerPosition();
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_STRUCTURES);
        for (let structure of structures) {
            if (structure instanceof StructureContainer) {
                Memory.minerals[this.id]["container"] = structure.id;
            }
        }
    }
    else {
        return;
    }
    position.createConstructionSite(STRUCTURE_CONTAINER);
};
Mineral.prototype.getMiningPositions = function () {
    let positions = [];
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
            if (!(position.x === this.pos.x && position.y === this.pos.y)) {
                let terrainAtPositon = Game.map.getTerrainAt(position);
                if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
                    positions.push(position);
                }
            }
        }
    }
    return positions;
};
Mineral.prototype.getContainerPosition = function () {
    this.memoryCheck();
    if (Memory.minerals[this.id].containerPos !== undefined) {
        let pos = Memory.minerals[this.id].containerPos;
        return new RoomPosition(pos.x, pos.y, pos.roomName);
    }
    let positions = this.getMiningPositions();
    if (positions.length === 1) {
        return positions[0];
    }
    let neighbours = [];
    for (let positionId in positions) {
        let position = positions[positionId];
        for (let potNeighbour of positions) {
            if ((Math.abs(position.x - potNeighbour.x) + Math.abs(position.y - potNeighbour.y) === 1) ||
                (Math.abs(position.x - potNeighbour.x) === 1 && Math.abs(position.y - potNeighbour.y) === 1)) {
                if (neighbours[positionId] === undefined) {
                    neighbours[positionId] = 1;
                }
                else {
                    neighbours[positionId] = neighbours[positionId] + 1;
                }
            }
        }
    }
    let maxPosId = undefined;
    for (let positionId in neighbours) {
        if (maxPosId === undefined || neighbours[parseInt(positionId)] > neighbours[parseInt(maxPosId)]) {
            maxPosId = positionId;
        }
    }
    if (maxPosId !== undefined) {
        Memory.minerals[this.id].containerPos = positions[parseInt(maxPosId)];
        return positions[parseInt(maxPosId)];
    }
    return undefined;
};
Mineral.prototype.getContainerMiningPositions = function () {
    let positions = this.getMiningPositions();
    let containerPosition = this.getContainerPosition();
    let miningPositions = [];
    for (let position of positions) {
        if ((Math.abs(containerPosition.x - position.x) + Math.abs(containerPosition.y - position.y) < 2) ||
            (Math.abs(containerPosition.x - position.x) === 1 && Math.abs(containerPosition.y - position.y) === 1)) {
            miningPositions.push(position);
        }
    }
    return miningPositions;
};
