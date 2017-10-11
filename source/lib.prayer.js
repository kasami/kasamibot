"use strict";
function getSpawn1Pos(room, storagepos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
        case "E":
            return new RoomPosition(storagepos.x, storagepos.y - 2, storagepos.roomName);
        default:
            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
    }
}
exports.getSpawn1Pos = getSpawn1Pos;
function getSpawn2Pos(room, spawn1pos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y - 2, spawn1pos.roomName);
        default:
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
    }
}
exports.getSpawn2Pos = getSpawn2Pos;
function getContainerPos(room, spawn1pos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x, spawn1pos.y - 2, spawn1pos.roomName);
        default:
            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
    }
}
exports.getContainerPos = getContainerPos;
function getStoragePos(room, spawn1pos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
        default:
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
    }
}
exports.getStoragePos = getStoragePos;
function getTerminalPos(room, spawn1pos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
        case "E":
            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
        default:
            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
    }
}
exports.getTerminalPos = getTerminalPos;
function getLabPos(room, storagepos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
        case "E":
            return new RoomPosition(storagepos.x + 2, storagepos.y, storagepos.roomName);
        default:
            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
    }
}
exports.getLabPos = getLabPos;
function getBoostCreepPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
    }
}
exports.getBoostCreepPos = getBoostCreepPos;
function getHealCreepPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
    }
}
exports.getHealCreepPos = getHealCreepPos;
function getNextHealCreepPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
    }
}
exports.getNextHealCreepPos = getNextHealCreepPos;
function getHealSupporterPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 4, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
    }
}
exports.getHealSupporterPos = getHealSupporterPos;
function getNextHealSupporterPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 5, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
    }
}
exports.getNextHealSupporterPos = getNextHealSupporterPos;
function getLeaderPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
    }
}
exports.getLeaderPos = getLeaderPos;
function getOfficerPos(room, storagePos) {
    switch (room.memory.direction) {
        case "S":
            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
        case "E":
            return new RoomPosition(storagePos.x + 1, storagePos.y - 3, storagePos.roomName);
        default:
            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
    }
}
exports.getOfficerPos = getOfficerPos;
function getContainer(room, spawn1pos) {
    let pos = getContainerPos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_CONTAINER) {
            return s;
        }
    }
    return undefined;
}
exports.getContainer = getContainer;
function getSpawn2(room, spawn1pos) {
    let pos = getSpawn2Pos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_SPAWN) {
            return s;
        }
    }
    return undefined;
}
exports.getSpawn2 = getSpawn2;
function getBoosterLab(room, storagePos) {
    let pos = getLabPos(room, storagePos);
    let atPos = pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_LAB) {
            return s;
        }
    }
    return undefined;
}
exports.getBoosterLab = getBoosterLab;
function getSupplyContainer(room, spawn1pos) {
    let pos = getContainerPos(room, spawn1pos);
    let atPos = pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_CONTAINER) {
            return s;
        }
    }
    return undefined;
}
exports.getSupplyContainer = getSupplyContainer;
function getPraiserPositions(room, storagePos) {
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
            ];
        case "E":
            return [
                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName)
            ];
        default:
            return [
                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName),
                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName)
            ];
    }
}
exports.getPraiserPositions = getPraiserPositions;
function getSupporterPositions(room, spawn2Pos) {
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
            ];
        case "E":
            return [
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y + 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y + 1, spawn2Pos.roomName)
            ];
        default:
            console.log("Supporter-rotation not fixed for south (prayerroom)");
            return [
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y - 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y + 1, spawn2Pos.roomName),
                new RoomPosition(spawn2Pos.x, spawn2Pos.y + 1, spawn2Pos.roomName)
            ];
    }
}
exports.getSupporterPositions = getSupporterPositions;
