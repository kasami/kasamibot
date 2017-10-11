"use strict";
const RoomUtilities = require("./utilities.Room");
const _Manager_1 = require("./managers._Manager");
class LinkManager extends _Manager_1.Manager {
    constructor(roomService) {
        super("LinkManager");
        this.roomService = roomService;
    }
    ;
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
            let rooms = this.roomService.getNormalRooms();
            for (let room of rooms) {
                runLinks(room);
            }
        }
    }
}
exports.LinkManager = LinkManager;
function runLinks(room) {
    if (room.controller === undefined) {
        return;
    }
    if (Game.time % 2 === 0) {
        let baseLink = room.getBaseLink();
        let controllerLink = room.controller.getContainerOrLink();
        if (baseLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink.energy < 200) {
            baseLink.transferEnergy(controllerLink);
        }
    }
}
function roomIsEmpty(room) {
    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
        let containersInRoom = room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER } });
        for (let container of containersInRoom) {
            if (container.store[RESOURCE_ENERGY] < 100) {
                return true;
            }
        }
    }
    return false;
}
exports.roomIsEmpty = roomIsEmpty;
function buildingHasEnergy(building, amount = 0) {
    if (building.structureType === STRUCTURE_CONTAINER) {
        return building.store[RESOURCE_ENERGY] > 0;
    }
    return building.energy > amount;
}
exports.buildingHasEnergy = buildingHasEnergy;
function canTakeEnergy(building, amount = 0) {
    if (!(building instanceof Structure)) {
        return false;
    }
    if (building.structureType === STRUCTURE_CONTAINER) {
        return building.store[RESOURCE_ENERGY] > amount;
    }
    return building.energy === building.energyCapacity;
}
exports.canTakeEnergy = canTakeEnergy;
