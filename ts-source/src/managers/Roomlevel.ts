import * as RoomUtilities from "../utilities/Room";
import * as OrdersRepository from "../repository/Orders";

import {RoomLevel} from "../enums/roomlevel";

import * as RoomRepository from "../repository/Room";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {RoomService} from "../services/Room";

export class RoomlevelManager extends Manager {

    private roomService: RoomService;

    private hasRunUpdate = false;

    readonly MEMORY_LASTRUN_UPDATE = "lastRunUpdate";
    readonly MEMORY_LASTRUN_CRISIS = "lastRunCrisis";

    constructor(roomService: RoomService) {
        super("RoomlevelManager");
        this.roomService = roomService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Low) {
            let lastRunUpdate = this.getValue(this.MEMORY_LASTRUN_UPDATE);
            if (lastRunUpdate === undefined || lastRunUpdate + 100 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    updateRoomLevel(room);
                }
                this.setValue(this.MEMORY_LASTRUN_UPDATE, Game.time);
                this.hasRunUpdate = true;
            }

            let lastRunCrisis = this.getValue(this.MEMORY_LASTRUN_CRISIS);
            if (lastRunCrisis === undefined || lastRunCrisis + 500 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    checkRoomLevel(room);
                }
                this.setValue(this.MEMORY_LASTRUN_CRISIS, Game.time);
            }
        } else
        if (pri === ManagerPriority.Overflow && !this.hasRunUpdate) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN_UPDATE);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    updateRoomLevel(room);
                }
                this.setValue(this.MEMORY_LASTRUN_UPDATE, Game.time);
            }
        }
    }
}

function updateRoomLevel(room: Room) {
    switch (RoomRepository.getRoomLevel(room)) {
        case RoomLevel.BasicColony:
            basicColonyCheck(room);
            break;
        case RoomLevel.BasicColonyReadyForExpansion:
            basicColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.SimpleColony:
            simpleColonyCheck(room);
            break;
        case RoomLevel.SimpleColonyReadyForExpansion:
            simpleColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.DefendedColony:
            defendedColonyCheck(room);
            break;
        case RoomLevel.DefendedColonyReadyForExpansion:
            defendedColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.CivilizedColony:
            civilizedColonyCheck(room);
            break;
        case RoomLevel.CivilizedColonyReadyForExpansion:
            civilizedColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.AdvancedColony:
            advancedColonyCheck(room);
            break;
        case RoomLevel.AdvancedColonyReadyForExpansion:
            advancedColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.Town:
            townCheck(room);
            break;
        case RoomLevel.TownReadyForExpansion:
            townReadyForExpansionCheck(room);
            break;
        case RoomLevel.City:
            cityCheck(room);
            break;
        case RoomLevel.CityReadyForExpansion:
            cityColonyReadyForExpansionCheck(room);
            break;
        case RoomLevel.Metropolis:
            metropolisCheck(room);
            break;
        default:
            RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
            break;
    }
}



function checkRoomLevel(room: Room) {
    let level = RoomRepository.getRoomLevel(room);
    if (level > RoomLevel.BasicColony) {
        if (room.getSpawn() === undefined) {
            RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= RoomLevel.DefendedColony && level < RoomLevel.CivilizedColony) {
        if (room.getBaseContainer() === undefined && room.storage === undefined) {
            RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= RoomLevel.CivilizedColony) {
        if (room.storage === undefined) {
            RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= RoomLevel.Town) {
        if (room.terminal === undefined) {
            RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
            return;
        }
    }
}

/**
 * RoomLevelChecks
 */

function basicColonyCheck(room: Room) {
    if (
    RoomUtilities.hasAtLeastSpawns(room, 1) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.BasicColony) &&
    RoomUtilities.controllerLevelAtLeast(room, 2)) {
        RoomRepository.setRoomLevel(room, RoomLevel.BasicColonyReadyForExpansion);
    }
}

function basicColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.BasicColonyReadyForExpansion) &&
    RoomUtilities.hasAtLeastExtensions(room, 5)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.SimpleColony);
    } else
    if (
    RoomUtilities.controllerLevelBelow(room, 2) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.BasicColonyReadyForExpansion)){
        RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
    }
}

function simpleColonyCheck(room: Room) {
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.SimpleColony) &&
    RoomUtilities.controllerLevelAtLeast(room, 3)) {
        RoomRepository.setRoomLevel(room, RoomLevel.SimpleColonyReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.SimpleColony) &&
    RoomUtilities.controllerLevelBelow(room, 2)){
        RoomRepository.setRoomLevel(room, RoomLevel.BasicColony);
    }
}

function simpleColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasActiveTower(room) &&
    RoomUtilities.hasAtLeastExtensions(room, 10) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.SimpleColonyReadyForExpansion)) {
        RoomRepository.setRoomLevel(room, RoomLevel.DefendedColony);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.SimpleColonyReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 3)){
        RoomRepository.setRoomLevel(room, RoomLevel.SimpleColony);
    }
}

function defendedColonyCheck(room: Room) {
    if (
    RoomUtilities.controllerLevelAtLeast(room, 4) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.DefendedColony)) {
        RoomRepository.setRoomLevel(room, RoomLevel.DefendedColonyReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.DefendedColony) &&
    RoomUtilities.controllerLevelBelow(room, 3)) {
        RoomRepository.setRoomLevel(room, RoomLevel.SimpleColony);
    }
}

function defendedColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasStorage(room) &&
    RoomUtilities.hasAtLeastExtensions(room, 20) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.DefendedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.CivilizedColony);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.DefendedColonyReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 4)){
        RoomRepository.setRoomLevel(room, RoomLevel.DefendedColony);
    }
}

function civilizedColonyCheck(room: Room) {
    if (
    RoomUtilities.controllerLevelAtLeast(room, 5) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CivilizedColony)) {
        RoomRepository.setRoomLevel(room, RoomLevel.CivilizedColonyReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CivilizedColony) &&
    (RoomUtilities.controllerLevelBelow(room, 4) || !RoomUtilities.hasStorage(room))) {
        RoomRepository.setRoomLevel(room, RoomLevel.DefendedColony);
    }
}

function civilizedColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasAtLeastExtensions(room, 30) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CivilizedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.AdvancedColony);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CivilizedColonyReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 5)){
        RoomRepository.setRoomLevel(room, RoomLevel.CivilizedColony);
    }
}

function advancedColonyCheck(room: Room) {
    if (
    RoomUtilities.controllerLevelAtLeast(room, 6) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.AdvancedColony)) {
        RoomRepository.setRoomLevel(room, RoomLevel.AdvancedColonyReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.AdvancedColony) &&
    RoomUtilities.controllerLevelBelow(room, 5)) {
        RoomRepository.setRoomLevel(room, RoomLevel.CivilizedColony);
    }
}

function advancedColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasTerminal(room) &&
    RoomUtilities.hasAtLeastExtensions(room, 40) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.AdvancedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.Town);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.AdvancedColonyReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 6)){
        RoomRepository.setRoomLevel(room, RoomLevel.AdvancedColony);
    }
}

function townCheck(room: Room) {
    if (
    RoomUtilities.controllerLevelAtLeast(room, 7) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.Town)) {
        RoomRepository.setRoomLevel(room, RoomLevel.TownReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.Town) &&
    (RoomUtilities.controllerLevelBelow(room, 6) || !RoomUtilities.hasTerminal(room))) {
        RoomRepository.setRoomLevel(room, RoomLevel.AdvancedColony);
    }
    if (room.memory.lab === undefined) {
        room.memory.lab = {};
    }
    if (RoomUtilities.hasAtLeastLabs(room, 3)) {
        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
            room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 0) {
                room.memory.lab.operational = true;
            } else {
                room.memory.lab.operational = false;
            }
        }
    } else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}

function townReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasAtLeastSpawns(room, 2) &&
    RoomUtilities.hasAtLeastExtensions(room, 50) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.TownReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.City);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.TownReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 7)){
        RoomRepository.setRoomLevel(room, RoomLevel.Town);
    }
}

function cityCheck(room: Room) {
    if (
    RoomUtilities.controllerLevelAtLeast(room, 8) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.City)) {
        RoomRepository.setRoomLevel(room, RoomLevel.CityReadyForExpansion);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.City) &&
    RoomUtilities.controllerLevelBelow(room, 7)) {
        RoomRepository.setRoomLevel(room, RoomLevel.Town);
        return;
    }
    if (room.memory.lab === undefined) {
        room.memory.lab = {};
    }
    if (RoomUtilities.hasAtLeastLabs(room, 6)) {
        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
            room.memory.lab.processingLabs.length < 3 || room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 3) {
                room.memory.lab.operational = true;
            } else {
                room.memory.lab.operational = false;
            }
        }
    } else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}

function cityColonyReadyForExpansionCheck(room: Room) {
    if (
    RoomUtilities.hasAtLeastSpawns(room, 3) &&
    RoomUtilities.hasAtLeastExtensions(room, 60) &&
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CityReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, RoomLevel.Metropolis);
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.CityReadyForExpansion) &&
    RoomUtilities.controllerLevelBelow(room, 8)){
        RoomRepository.setRoomLevel(room, RoomLevel.City);
    }
}

function metropolisCheck(room: Room) {
    if (room.memory.lab === undefined) {
        room.memory.lab = {};
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.Metropolis) &&
    !RoomUtilities.hasStorage(room)) {
        RoomRepository.setRoomLevel(room, RoomLevel.DefendedColony);
        return;
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.Metropolis) &&
    !RoomUtilities.hasTerminal(room)) {
        RoomRepository.setRoomLevel(room, RoomLevel.AdvancedColony);
        return;
    } else
    if (
    RoomUtilities.roomlevelIsAt(room, RoomLevel.Metropolis) &&
    RoomUtilities.controllerLevelBelow(room, 8)) {
        RoomRepository.setRoomLevel(room, RoomLevel.City);
        return;
    }
    if (RoomUtilities.hasAtLeastLabs(room, 10)) {
        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
            room.memory.lab.processingLabs.length < 7 || room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 7) {
                room.memory.lab.operational = true;
            } else {
                room.memory.lab.operational = false;
            }
        }
    } else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}
