"use strict";
const IntelLib = require("./lib.intel");
const RoomRepository = require("./repository.Room");
function getAllControlledRooms() {
    let rooms = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom !== true) {
            rooms.push(room);
        }
    }
    return rooms;
}
exports.getAllControlledRooms = getAllControlledRooms;
;
function getAllPraiseRooms() {
    let rooms = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom === true) {
            rooms.push(room);
        }
    }
    return rooms;
}
exports.getAllPraiseRooms = getAllPraiseRooms;
;
function getMinerals() {
    let minerals = {};
    let rooms = getAllControlledRooms();
    for (let room of rooms) {
        let mineral = room.getMineral();
        if (mineral instanceof Mineral) {
            if (minerals[mineral.mineralType] !== undefined) {
                minerals[mineral.mineralType]++;
            }
            else {
                minerals[mineral.mineralType] = 1;
            }
        }
        if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
            let praiseroom = room.memory.praiseroom;
            if (Game.rooms[praiseroom] instanceof Room) {
                let mineral = Game.rooms[praiseroom].getMineral();
                if (mineral instanceof Mineral) {
                    if (minerals[mineral.mineralType] !== undefined) {
                        minerals[mineral.mineralType]++;
                    }
                    else {
                        minerals[mineral.mineralType] = 1;
                    }
                }
            }
        }
        if (room.memory.poaching !== undefined) {
            for (let o of room.memory.poaching) {
                let mineral = IntelLib.mineralType(o);
                if (mineral !== undefined) {
                    if (minerals[mineral] !== undefined) {
                        minerals[mineral]++;
                    }
                    else {
                        minerals[mineral] = 1;
                    }
                }
            }
        }
        let lairs = RoomRepository.getLairOutposts(room);
        for (let outpost of lairs) {
            let mineral = IntelLib.mineralType(outpost);
            if (mineral !== undefined) {
                if (minerals[mineral] !== undefined) {
                    minerals[mineral]++;
                }
                else {
                    minerals[mineral] = 1;
                }
            }
        }
    }
    return minerals;
}
exports.getMinerals = getMinerals;
;
function hasContainer(room) {
    let baseContainer = room.getBaseContainer();
    return baseContainer !== undefined;
}
exports.hasContainer = hasContainer;
function getOutpostMineralContainers(room) {
    let containers = [];
    let lairs = RoomRepository.getLairOutposts(room);
    for (let outpostName of lairs) {
        if (Game.rooms[outpostName] !== undefined) {
            let mineral = Game.rooms[outpostName].getMineral();
            if (mineral !== undefined) {
                let container = mineral.getMiningContainer();
                if (container !== null) {
                    containers.push(container);
                }
            }
        }
    }
    return containers;
}
exports.getOutpostMineralContainers = getOutpostMineralContainers;
function getProcessingLabs(room) {
    let basePosition = RoomRepository.getBasePosition(room);
    if (basePosition === undefined) {
        return [];
    }
    let spawnPos = basePosition;
    let labs = [];
    let positions = [[-1, 5], [-1, 6], [-1, 7], [0, 7], [1, 7], [2, 5], [2, 6]];
    for (let p of positions) {
        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
        let structs = labPos.lookFor(LOOK_STRUCTURES);
        for (let s of structs) {
            if (s.structureType === STRUCTURE_LAB) {
                labs.push(s.id);
            }
        }
    }
    return labs;
}
exports.getProcessingLabs = getProcessingLabs;
function getSupplyLabs(room) {
    let basePosition = RoomRepository.getBasePosition(room);
    if (basePosition === undefined) {
        return [];
    }
    let spawnPos = basePosition;
    let labs = [];
    let positions = [[0, 5], [1, 6]];
    for (let p of positions) {
        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
        let structs = labPos.lookFor(LOOK_STRUCTURES);
        for (let s of structs) {
            if (s.structureType === STRUCTURE_LAB) {
                labs.push(s.id);
            }
        }
    }
    return labs;
}
exports.getSupplyLabs = getSupplyLabs;
function hasAtLeastExtensions(room, count) {
    let extensionsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } });
    return extensionsInRoom.length >= count;
}
exports.hasAtLeastExtensions = hasAtLeastExtensions;
function hasAtLeastSpawns(room, count) {
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
    return spawnsInRoom.length >= count;
}
exports.hasAtLeastSpawns = hasAtLeastSpawns;
function hasAtLeastLabs(room, count) {
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LAB } });
    return spawnsInRoom.length >= count;
}
exports.hasAtLeastLabs = hasAtLeastLabs;
function hasActiveTower(room) {
    let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    for (let tower of towersInRoom) {
        if (tower.energy < tower.energyCapacity / 2) {
            return false;
        }
    }
    if (towersInRoom.length > 0) {
        return true;
    }
    return false;
}
exports.hasActiveTower = hasActiveTower;
function hasTerminal(room) {
    return (room.terminal !== undefined && room.terminal.my && room.terminal.isActive());
}
exports.hasTerminal = hasTerminal;
function hasStorage(room) {
    return (room.storage !== undefined && room.storage.my && room.storage.isActive());
}
exports.hasStorage = hasStorage;
function roomlevelIsAt(room, roomlevel) {
    return RoomRepository.getRoomLevel(room) === roomlevel;
}
exports.roomlevelIsAt = roomlevelIsAt;
function controllerLevelAtLeast(room, level) {
    return room.controller.level >= level;
}
exports.controllerLevelAtLeast = controllerLevelAtLeast;
function controllerLevelBelow(room, level) {
    return room.controller.level < level;
}
exports.controllerLevelBelow = controllerLevelBelow;
