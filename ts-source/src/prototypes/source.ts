

Source.prototype.memoryCheck = function(): void {
    if (Memory.sources === undefined) {
        Memory.sources = {};
    }
    if (Memory.sources[this.id] === undefined) {
        Memory.sources[this.id] = {};
    }
}

Source.prototype.hasMiningContainer = function(): boolean {
    return this.getMiningContainer() !== null;
}

Source.prototype.setMiningContainerId = function(id: string): void {
    this.memoryCheck();
    Memory.sources[this.id]["container"] = id;
}

Source.prototype.getMiningContainer = function(): StructureContainer | null {
    this.memoryCheck();
    if (Memory.sources[this.id]["container"] === undefined) {
        return null;
    }

    let container = Game.getObjectById(Memory.sources[this.id]["container"]) as Container;
    if (container === null) {
        Memory.sources[this.id]["container"] = undefined;
    }
    return container;
}

// TODO: Caching
Source.prototype.getMiningContainerConstructionSite = function(): ConstructionSite | null {
    this.memoryCheck();
    let position = this.getContainerPosition() as RoomPosition | undefined;
    if (position !== undefined) {
        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES) as ConstructionSite[];
        for (let structure of structures) {
            if (structure instanceof ConstructionSite && (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_CONTAINER)) {
                return structure;
            }
        }
    }
    return null;
}

Source.prototype.buildMiningContainer = function(): void {
    this.memoryCheck();
    let containerPosition = this.getContainerPosition() as RoomPosition | undefined;
    if (containerPosition !== undefined) {
        let structures = containerPosition.lookFor(LOOK_STRUCTURES);
        for (let structure of structures) {
            if (structure instanceof StructureContainer) {
                Memory.sources[this.id]["container"] = structure.id;
            } else
            if (structure instanceof StructureLink) {
                structure.destroy();
            }
        }
    } else {
        return;
    }
    containerPosition.createConstructionSite(STRUCTURE_CONTAINER);
}

// TODO: Caching
Source.prototype.getMiningPositions = function(): RoomPosition[] {
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

Source.prototype.getContainerPosition = function(): RoomPosition | undefined {
    this.memoryCheck();
    if (Memory.sources[this.id].containerPos !== undefined) {
        let pos = Memory.sources[this.id].containerPos;
        return new RoomPosition(pos.x, pos.y, pos.roomName)
    }
    let positions: RoomPosition[] = this.getMiningPositions();

    if (positions.length === 1) {
        Memory.sources[this.id].containerPos = positions[0];
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

    if (neighbours.length === 0) {
        Memory.sources[this.id].containerPos = positions[0];
        return positions[0];
    }

    let maxPosId: string | undefined = undefined;
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
}

// TODO: Caching
Source.prototype.getContainerMiningPositions = function(): RoomPosition[]{
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

Source.prototype.getDistanceFrom = function (roomName: string): number | undefined {
    this.memoryCheck();
    if (Memory.sources[this.id].basedistance !== undefined && Memory.sources[this.id].basedistanceRoom !== undefined &&
    Memory.sources[this.id].basedistanceRoom === roomName) {
        return Memory.sources[this.id].basedistance;
    }
    return undefined;
}

Source.prototype.setDistanceFrom = function (roomName: string, distance: number): void {
    this.memoryCheck();
    Memory.sources[this.id].basedistance = distance;
    Memory.sources[this.id].basedistanceRoom = roomName;
}
