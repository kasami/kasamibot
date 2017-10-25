import * as RoomUtilities from "../utilities/Room";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {RoomService} from "../services/Room";

export class LinkManager extends Manager {

    private roomService: RoomService;
;

    constructor(roomService: RoomService) {
        super("LinkManager");
        this.roomService = roomService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            let rooms = this.roomService.getNormalRooms();
            for (let room of rooms) {
                runLinks(room);
            }
        }
    }
}

function runLinks(room: Room) {
    if (room.controller === undefined) {
        return;
    }
    if (Game.time % 2 === 0) {
        let baseLink = room.getBaseLink()
        let controllerLink = room.controller.getContainerOrLink()
        if (baseLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink.energy < 200) {
            baseLink.transferEnergy(controllerLink);
        }
    }
}

export function roomIsEmpty(room: Room): boolean {
    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
        let containersInRoom = room.find(FIND_STRUCTURES, {
            filter: {structureType: STRUCTURE_CONTAINER}}) as Container[];
        for (let container of containersInRoom) {
            if (container.store[RESOURCE_ENERGY] < 100) {
                return true;
            }
        }
    }
    return false;
}

export function buildingHasEnergy(building: Structure, amount: number = 0): boolean {
    if (building.structureType === STRUCTURE_CONTAINER) {
        return (building as Container).store[RESOURCE_ENERGY] > 0;
    }
    return (building as Spawn).energy > amount;
}

export function canTakeEnergy(building: Structure, amount: number = 0): boolean {
    if (!(building instanceof Structure)) {
        return false;
    }
    if (building.structureType === STRUCTURE_CONTAINER) {
        return (building as Container).store[RESOURCE_ENERGY] > amount;
    }
    return (building as Spawn).energy === (building as Spawn).energyCapacity;
}
