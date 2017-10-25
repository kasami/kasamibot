import * as PathfindingUtilities from "../utilities/Pathfinding";

StructureController.prototype.getContainerPosition = function(): RoomPosition | undefined {
    if (this.room.memory.controllerContainerPos !== undefined) {
        let pos = this.room.memory.controllerContainerPos;
        return new RoomPosition(pos.x, pos.y, pos.roomName)
    }
    let positions: RoomPosition[] = this.getPossibleContainerPositions();

    if (positions.length === 0) {
        return this.getOkeyContainerPosition();
    }

    if (positions.length === 1) {
        return positions[0];
    }

    let spawn = this.room.getSpawn();
    if (!(spawn instanceof Spawn)) {
        return undefined;
    }
    let storagepos = new RoomPosition(spawn.pos.x, spawn.pos.y + 3, spawn.pos.roomName);
    let distanceToStorage: number[] = [];
    for (let positionId in positions) {
        let position = positions[positionId];
        distanceToStorage[positionId] = PathfindingUtilities.getDistanseBetween(position, storagepos);
    }

    let minDistanseId: string | undefined = undefined;
    for (let positionId in distanceToStorage) {
        if (minDistanseId === undefined || distanceToStorage[parseInt(positionId)] < distanceToStorage[parseInt(minDistanseId)]) {
            minDistanseId = positionId;
        }
    }

    if (minDistanseId !== undefined) {
        this.room.memory.controllerContainerPos = positions[parseInt(minDistanseId)];
        return positions[parseInt(minDistanseId)];
    }
    return undefined;
}

StructureController.prototype.getPossibleContainerPositions = function(): RoomPosition[] {
    let positions: RoomPosition[] = [];
    for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y++) {
            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
            if ((Math.abs(x) === 2 || Math.abs(y) === 2) && position.hasFreeSpaceAround()) {
                positions.push(position);
            }
        }
    }
    return positions;
};

StructureController.prototype.getOkeyContainerPosition = function(): RoomPosition | undefined {
    let bestPos: RoomPosition | undefined = undefined;
    let freeSpace = 0;
    for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y++) {
            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
            if ((Math.abs(x) === 2 || Math.abs(y) === 2)) {
                let free = position.getFreeSpaceAround();
                if (position === undefined || freeSpace < free) {
                    bestPos = position;
                    freeSpace = free;
                }
            }
        }
    }
    return bestPos;
};


StructureController.prototype.buildControllerContainer = function(): void {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return;
    }

    containerpos.createConstructionSite(STRUCTURE_CONTAINER);
}

StructureController.prototype.buildControllerLink = function(): void {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return;
    }

    let buildings = containerpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let b of buildings) {
        if (b.structureType === STRUCTURE_CONTAINER) {
            b.destroy();
        }
    }

    containerpos.createConstructionSite(STRUCTURE_LINK);
}

StructureController.prototype.hasContainer = function(): boolean {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return false;
    }

    let buildings = containerpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let b of buildings) {
        if (b.structureType === STRUCTURE_CONTAINER) {
            return true;
        }
    }

    return false;
}

StructureController.prototype.hasLink = function(): boolean {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return false;
    }

    let buildings = containerpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let b of buildings) {
        if (b.structureType === STRUCTURE_LINK) {
            return true;
        }
    }

    return false;
}

StructureController.prototype.getContainer = function(): Container | undefined {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return undefined;
    }

    let buildings = containerpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let b of buildings) {
        if (b.structureType === STRUCTURE_CONTAINER) {
            return b as Container;
        }
    }
    return undefined;
}

StructureController.prototype.getContainerOrLink = function(): Link | Container | undefined {
    let containerpos = this.getContainerPosition() as RoomPosition;
    if (containerpos === undefined) {
        return undefined;
    }

    let buildings = containerpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let b of buildings) {
        if (b.structureType === STRUCTURE_CONTAINER || b.structureType === STRUCTURE_LINK) {
            return b as Link | Container;
        }
    }
    return undefined;
}
