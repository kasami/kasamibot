import {RoomLevel} from "../enums/roomlevel";

import * as RoomRepository from "../repository/Room";

export function getAllRoomsBeingDismantled(): Room[] {
    let rooms: Room[] = [];

    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled === true)
        {
            rooms.push(room);
        }
    }

    return rooms;
};

export function wallsShouldBeRemoved(room: Room) {
    return room.memory.removeWalls === true ||
        (room.controller !== undefined && (room.controller.level === 1 || room.controller.level === 3));
}

export function roomShouldHaveJanitors(room: Room) {
    if (room.storage === undefined) {
        let container = room.getBaseContainer();
        return RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony && room.controller !== undefined &&
        container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
    } else {
        return RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony && room.controller !== undefined &&
        room.storage.store[RESOURCE_ENERGY] > 5000 && !room.isExpansion();
    }
}

export function roomShouldHaveBuilders(room: Room) {
    if (room.storage === undefined) {
        let container = room.getBaseContainer();
        return RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony && room.controller !== undefined &&
        container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
    } else {
        return RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony && room.controller !== undefined &&
        room.storage.store[RESOURCE_ENERGY] > 10000 && !room.isExpansion();
    }
}

export function roomIsHighway(roomName: string): boolean {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
    return (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
}


