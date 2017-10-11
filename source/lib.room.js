"use strict";
const roomlevel_1 = require("./enums.roomlevel");
const RoomRepository = require("./repository.Room");
function getAllRoomsBeingDismantled() {
    let rooms = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey];
        if (room.controller !== undefined && room.controller.my === true &&
            room.memory.isBeingDismantled === true) {
            rooms.push(room);
        }
    }
    return rooms;
}
exports.getAllRoomsBeingDismantled = getAllRoomsBeingDismantled;
;
function wallsShouldBeRemoved(room) {
    return room.memory.removeWalls === true ||
        (room.controller !== undefined && (room.controller.level === 1 || room.controller.level === 3));
}
exports.wallsShouldBeRemoved = wallsShouldBeRemoved;
function roomShouldHaveJanitors(room) {
    if (room.storage === undefined) {
        let container = room.getBaseContainer();
        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
            container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
    }
    else {
        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
            room.storage.store[RESOURCE_ENERGY] > 5000 && !room.isExpansion();
    }
}
exports.roomShouldHaveJanitors = roomShouldHaveJanitors;
function roomShouldHaveBuilders(room) {
    if (room.storage === undefined) {
        let container = room.getBaseContainer();
        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
            container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
    }
    else {
        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
            room.storage.store[RESOURCE_ENERGY] > 10000 && !room.isExpansion();
    }
}
exports.roomShouldHaveBuilders = roomShouldHaveBuilders;
function roomIsHighway(roomName) {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    return (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
}
exports.roomIsHighway = roomIsHighway;
