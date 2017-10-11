Source.prototype.memoryCheck = function () {
    if (Memory.sources === undefined) {
        Memory.sources = {};
    }
    if (Memory.sources[this.id] === undefined) {
        Memory.sources[this.id] = {};
    }
};
Source.prototype.hasMiningContainer = function () {
    return this.getMiningContainer() !== null;
};
Source.prototype.setMiningContainerId = function (id) {
    this.memoryCheck();
    Memory.sources[this.id]["container"] = id;
};
Source.prototype.getMiningContainer = function () {
    this.memoryCheck();
    if (Memory.sources[this.id]["container"] === undefined) {
        return null;
    }
    let container = Game.getObjectById(Memory.sources[this.id]["container"]);
    if (container === null) {
        Memory.sources[this.id]["container"] = undefined;
    }
    return container;
};
Source.prototype.getMiningContainerConstructionSite = function () {
    this.memoryCheck();
    let position = this.getContainerPosition();
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES);
        for (let structure of structures) {
            if (structure instanceof ConstructionSite && (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_CONTAINER)) {
                return structure;
            }
        }
    }
    return null;
};
Source.prototype.buildMiningContainer = function () {
    this.memoryCheck();
    let containerPosition = this.getContainerPosition();
    if (containerPosition !== undefined) {
        let structures = containerPosition.lookFor(LOOK_STRUCTURES);
        for (let structure of structures) {
            if (structure instanceof StructureContainer) {
                Memory.sources[this.id]["container"] = structure.id;
            }
            else if (structure instanceof StructureLink) {
                structure.destroy();
            }
        }
    }
    else {
        return;
    }
    containerPosition.createConstructionSite(STRUCTURE_CONTAINER);
};
Source.prototype.getMiningPositions = function () {
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
Source.prototype.getContainerPosition = function () {
    this.memoryCheck();
    if (Memory.sources[this.id].containerPos !== undefined) {
        let pos = Memory.sources[this.id].containerPos;
        return new RoomPosition(pos.x, pos.y, pos.roomName);
    }
    let positions = this.getMiningPositions();
    if (positions.length === 1) {
        Memory.sources[this.id].containerPos = positions[0];
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
    if (neighbours.length === 0) {
        Memory.sources[this.id].containerPos = positions[0];
        return positions[0];
    }
    let maxPosId = undefined;
    for (let positionId in neighbours) {
        if (maxPosId === undefined || neighbours[parseInt(positionId)] > neighbours[parseInt(maxPosId)]) {
            maxPosId = positionId;
        }
    }
    if (maxPosId !== undefined) {
        Memory.sources[this.id].containerPos = positions[parseInt(maxPosId)];
        return positions[parseInt(maxPosId)];
    }
    return undefined;
};
Source.prototype.getContainerMiningPositions = function () {
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
Source.prototype.getDistanceFrom = function (roomName) {
    this.memoryCheck();
    if (Memory.sources[this.id].basedistance !== undefined && Memory.sources[this.id].basedistanceRoom !== undefined &&
        Memory.sources[this.id].basedistanceRoom === roomName) {
        return Memory.sources[this.id].basedistance;
    }
    return undefined;
};
Source.prototype.setDistanceFrom = function (roomName, distance) {
    this.memoryCheck();
    Memory.sources[this.id].basedistance = distance;
    Memory.sources[this.id].basedistanceRoom = roomName;
};
