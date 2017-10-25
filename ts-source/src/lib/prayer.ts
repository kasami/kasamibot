export function getSpawn1Pos(room: Room, storagepos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
        case "E":
            return new RoomPosition(storagepos.x, storagepos.y - 2, storagepos.roomName);
        default: // South is default
            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
    }
}

export function getSpawn2Pos(room: Room, spawn1pos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y - 2, spawn1pos.roomName);
        default: // South is default
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
    }
}

export function getContainerPos(room: Room, spawn1pos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x, spawn1pos.y - 2, spawn1pos.roomName);
        default: // South is default
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
    }
}

export function getStoragePos(room: Room, spawn1pos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
        default: // South is default
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
    }
}

export function getTerminalPos(room: Room, spawn1pos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
        default: // South is default
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
    }
}

export function getLabPos(room: Room, storagepos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
        case "E":
            return new RoomPosition(storagepos.x + 2, storagepos.y, storagepos.roomName);
        default: // South is default
            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
    }
}

export function getBoostCreepPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
    }
}

export function getHealCreepPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
    }
}

export function getNextHealCreepPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
    }
}


export function getHealSupporterPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 4, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
    }
}

export function getNextHealSupporterPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 5, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
    }
}

export function getLeaderPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
    }
}

export function getOfficerPos(room: Room, storagePos: RoomPosition): RoomPosition {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 3, storagePos.roomName);
        default: // South is default
            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
    }
}


export function getContainer(room: Room, spawn1pos: RoomPosition): StructureContainer | undefined {
    let pos = getContainerPos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_CONTAINER) {
            return s as StructureContainer;
        }
    }
    return undefined;
}

export function getSpawn2(room: Room, spawn1pos: RoomPosition): StructureSpawn | undefined {
    let pos = getSpawn2Pos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_SPAWN) {
            return s as StructureSpawn;
        }
    }
    return undefined;
}

export function getBoosterLab(room: Room, storagePos: RoomPosition): StructureLab | undefined {
    let pos = getLabPos(room, storagePos);
    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_LAB) {
            return s as StructureLab;
        }
    }
    return undefined;
}

export function getSupplyContainer(room: Room, spawn1pos: RoomPosition): StructureContainer | undefined {
    let pos = getContainerPos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_CONTAINER) {
            return s as StructureContainer;
        }
    }
    return undefined;
}

export function getPraiserPositions(room: Room, storagePos: RoomPosition): RoomPosition[] {
    switch (room.memory.direction) {
        case "S":
            return [
                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName)
            ]
        case "E":
            return [
                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName)
            ]
        default: // South is default
            return [
                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName)
            ]
    }
}

export function getSupporterPositions(room: Room, spawn2Pos: RoomPosition): RoomPosition[] {
    switch (room.memory.direction) {
        case "S":
            console.log("Supporter-rotation not fixed for south (prayerroom)");
            return [
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y + 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y + 1, spawn2Pos.roomName)
            ]
        case "E":
            return [
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y + 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y + 1, spawn2Pos.roomName)
            ]
        default: // South is default
            console.log("Supporter-rotation not fixed for south (prayerroom)");
            return [
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y + 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y + 1, spawn2Pos.roomName)
            ]
    }
}
