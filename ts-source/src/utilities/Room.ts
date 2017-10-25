import {RoomLevel} from "../enums/roomlevel";
import * as IntelLib from "../lib/intel";

import * as RoomRepository from "../repository/Room";

/**
 * Gets all rooms I control
 */
export function getAllControlledRooms(): Room[] {
    let rooms: Room[] = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom !== true) {
            rooms.push(room);
        }
    }
    return rooms;
};

export function getAllPraiseRooms(): Room[] {
    let rooms: Room[] = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom === true) {
            rooms.push(room);
        }
    }
    return rooms;
};

export function getMinerals(): {string: number} {
    let minerals: any = {};
    let rooms = getAllControlledRooms();
    for (let room of rooms) {
        let mineral = room.getMineral();
        if (mineral instanceof Mineral) {
            if (minerals[mineral.mineralType] !== undefined) {
                minerals[mineral.mineralType]++;
            } else {
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
                    } else {
                        minerals[mineral.mineralType] = 1;
                    }
                }
            }
        }
        if (room.memory.poaching !== undefined) {
            for (let o of room.memory.poaching as string[]) {
                let mineral = IntelLib.mineralType(o);
                if (mineral !== undefined) {
                    if (minerals[mineral] !== undefined) {
                        minerals[mineral]++;
                    } else {
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
                } else {
                    minerals[mineral] = 1;
                }
            }
        }
    }
    return minerals;
};

export function hasContainer(room: Room): boolean {
    let baseContainer = room.getBaseContainer();
    return baseContainer !== undefined;
}

export function getOutpostMineralContainers(room: Room): Container[] {
    let containers: Container[] = [];
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

export function getProcessingLabs(room: Room): string[] {
    let basePosition = RoomRepository.getBasePosition(room);
    if (basePosition === undefined) {
        return [];
    }
    let spawnPos = basePosition;
    let labs: string[] = [];
    let positions = [[-1, 5], [-1, 6], [-1, 7], [0, 7], [1, 7], [2, 5], [2, 6]];

    for (let p of positions) {
        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
        let structs = labPos.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of structs) {
            if (s.structureType === STRUCTURE_LAB) {
                labs.push(s.id);
            }
        }
    }
    return labs;
}

export function getSupplyLabs(room: Room): string[] {
    let basePosition = RoomRepository.getBasePosition(room);
    if (basePosition === undefined) {
        return [];
    }
    let spawnPos = basePosition;
    let labs: string[] = [];
    let positions = [[0, 5], [1, 6]];

    for (let p of positions) {
        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
        let structs = labPos.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of structs) {
            if (s.structureType === STRUCTURE_LAB) {
                labs.push(s.id);
            }
        }
    }
    return labs;
}

export function hasAtLeastExtensions(room: Room, count: number): boolean {
    let extensionsInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}) as Extension[];
    return extensionsInRoom.length >= count;
}

export function hasAtLeastSpawns(room: Room, count: number): boolean {
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}}) as Spawn[];
    return spawnsInRoom.length >= count;
}

export function hasAtLeastLabs(room: Room, count: number): boolean {
    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LAB}}) as Lab[];
    return spawnsInRoom.length >= count;
}

export function hasActiveTower(room: Room): boolean {
    let towersInRoom = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}) as Tower[];
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

export function hasTerminal(room: Room): boolean {
    return (room.terminal !== undefined && room.terminal.my && room.terminal.isActive());
}

export function hasStorage(room: Room): boolean {
    return (room.storage !== undefined && room.storage.my && room.storage.isActive());
}

export function roomlevelIsAt(room: Room, roomlevel: RoomLevel): boolean {
    return RoomRepository.getRoomLevel(room) === roomlevel;
}

export function controllerLevelAtLeast(room: Room, level: number): boolean {
    return (room.controller as Controller).level >= level;
}

export function controllerLevelBelow(room: Room, level: number): boolean {
    return (room.controller as Controller).level < level;
}
