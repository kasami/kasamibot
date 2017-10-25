Mineral.prototype.memoryCheck = function(): void {
    if (Memory.minerals === undefined) {
        Memory.minerals = {};
    }
    if (Memory.minerals[this.id] === undefined) {
        Memory.minerals[this.id] = {};
    }
}

Mineral.prototype.hasExtractor = function(): boolean {
    let structures = this.pos.lookFor(LOOK_STRUCTURES);
    for (let structure of structures) {
        if (structure instanceof StructureExtractor) {
            return true;
        }
    }
    return false;
}

Mineral.prototype.hasMiningContainer = function(): boolean {
    return this.getMiningContainer() !== null;
}

Mineral.prototype.buildExtractor = function(): boolean {
    return (this.pos as RoomPosition).createConstructionSite(STRUCTURE_EXTRACTOR) === 0;
}

Mineral.prototype.setMiningContainerId = function(id: string): void {
    this.memoryCheck();
    Memory.minerals[this.id]["container"] = id;
}

Mineral.prototype.getMiningContainer = function(): Container | null {
    this.memoryCheck();
    if (Memory.minerals[this.id]["container"] === undefined) {
        this.buildMiningContainer();
        return null;
    }

    let container = Game.getObjectById(Memory.minerals[this.id]["container"]) as Container;
    if (container === null) {
        Memory.minerals[this.id]["container"] = undefined;
    }
    return container;
}

Mineral.prototype.getMiningContainerConstructionSite = function(): ConstructionSite | null {
    this.memoryCheck();
    let position = this.getContainerPosition() as RoomPosition | undefined;
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES) as ConstructionSite[];
        for (let structure of structures) {
            if (structure instanceof ConstructionSite && structure.structureType === STRUCTURE_CONTAINER) {
                return structure;
            }
        }
    }
    return null;
}

Mineral.prototype.buildMiningContainer = function(): void {
    this.memoryCheck();
    let position = this.getContainerPosition() as RoomPosition | undefined;
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_STRUCTURES);
        for (let structure of structures) {
            if (structure instanceof StructureContainer) {
                Memory.minerals[this.id]["container"] = structure.id;
            }
        }
    } else {
        return;
    }
    position.createConstructionSite(STRUCTURE_CONTAINER);
}

// TODO: Caching
Mineral.prototype.getMiningPositions = function(): RoomPosition[] {
    let positions: RoomPosition[] = [];
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

// TODO: Caching
Mineral.prototype.getContainerPosition = function(): RoomPosition | undefined {
    this.memoryCheck();
    if (Memory.minerals[this.id].containerPos !== undefined) {
        let pos = Memory.minerals[this.id].containerPos;
        return new RoomPosition(pos.x, pos.y, pos.roomName)
    }
    let positions: RoomPosition[] = this.getMiningPositions();

    if (positions.length === 1) {
        return positions[0];
    }

    let neighbours: number[] = [];
    for (let positionId in positions) {
        let position = positions[positionId];
        for (let potNeighbour of positions) {
            if((Math.abs(position.x - potNeighbour.x) + Math.abs(position.y - potNeighbour.y) === 1) ||
            (Math.abs(position.x - potNeighbour.x) === 1 && Math.abs(position.y - potNeighbour.y) === 1)) {
                if (neighbours[positionId] === undefined) {
                    neighbours[positionId] = 1;
                } else {
                    neighbours[positionId] = neighbours[positionId] + 1;
                }
            }
        }
    }

    let maxPosId: string | undefined = undefined;
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
}

// TODO: Caching
Mineral.prototype.getContainerMiningPositions = function(): RoomPosition[]{
    let positions: RoomPosition[] = this.getMiningPositions();
    let containerPosition: RoomPosition = this.getContainerPosition();
    let miningPositions: RoomPosition[] = [];

    for (let position of positions) {
        if((Math.abs(containerPosition.x - position.x) + Math.abs(containerPosition.y - position.y) < 2) ||
        (Math.abs(containerPosition.x - position.x) === 1 && Math.abs(containerPosition.y - position.y) === 1)) {
            miningPositions.push(position);
        }
    }

    return miningPositions;
}
