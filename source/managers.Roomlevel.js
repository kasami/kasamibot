"use strict";
const RoomUtilities = require("./utilities.Room");
const OrdersRepository = require("./repository.Orders");
const roomlevel_1 = require("./enums.roomlevel");
const RoomRepository = require("./repository.Room");
const _Manager_1 = require("./managers._Manager");
class RoomlevelManager extends _Manager_1.Manager {
    constructor(roomService) {
        super("RoomlevelManager");
        this.hasRunUpdate = false;
        this.MEMORY_LASTRUN_UPDATE = "lastRunUpdate";
        this.MEMORY_LASTRUN_CRISIS = "lastRunCrisis";
        this.roomService = roomService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
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
        }
        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRunUpdate) {
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
exports.RoomlevelManager = RoomlevelManager;
function updateRoomLevel(room) {
    switch (RoomRepository.getRoomLevel(room)) {
        case roomlevel_1.RoomLevel.BasicColony:
            basicColonyCheck(room);
            break;
        case roomlevel_1.RoomLevel.BasicColonyReadyForExpansion:
            basicColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.SimpleColony:
            simpleColonyCheck(room);
            break;
        case roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion:
            simpleColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.DefendedColony:
            defendedColonyCheck(room);
            break;
        case roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion:
            defendedColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.CivilizedColony:
            civilizedColonyCheck(room);
            break;
        case roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion:
            civilizedColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.AdvancedColony:
            advancedColonyCheck(room);
            break;
        case roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion:
            advancedColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.Town:
            townCheck(room);
            break;
        case roomlevel_1.RoomLevel.TownReadyForExpansion:
            townReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.City:
            cityCheck(room);
            break;
        case roomlevel_1.RoomLevel.CityReadyForExpansion:
            cityColonyReadyForExpansionCheck(room);
            break;
        case roomlevel_1.RoomLevel.Metropolis:
            metropolisCheck(room);
            break;
        default:
            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
            break;
    }
}
function checkRoomLevel(room) {
    let level = RoomRepository.getRoomLevel(room);
    if (level > roomlevel_1.RoomLevel.BasicColony) {
        if (room.getSpawn() === undefined) {
            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= roomlevel_1.RoomLevel.DefendedColony && level < roomlevel_1.RoomLevel.CivilizedColony) {
        if (room.getBaseContainer() === undefined && room.storage === undefined) {
            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
        if (room.storage === undefined) {
            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
            return;
        }
    }
    if (level >= roomlevel_1.RoomLevel.Town) {
        if (room.terminal === undefined) {
            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
            return;
        }
    }
}
function basicColonyCheck(room) {
    if (RoomUtilities.hasAtLeastSpawns(room, 1) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColony) &&
        RoomUtilities.controllerLevelAtLeast(room, 2)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion);
    }
}
function basicColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) &&
        RoomUtilities.hasAtLeastExtensions(room, 5)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
    }
    else if (RoomUtilities.controllerLevelBelow(room, 2) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
    }
}
function simpleColonyCheck(room) {
    if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColony) &&
        RoomUtilities.controllerLevelAtLeast(room, 3)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColony) &&
        RoomUtilities.controllerLevelBelow(room, 2)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
    }
}
function simpleColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.hasActiveTower(room) &&
        RoomUtilities.hasAtLeastExtensions(room, 10) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 3)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
    }
}
function defendedColonyCheck(room) {
    if (RoomUtilities.controllerLevelAtLeast(room, 4) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColony)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColony) &&
        RoomUtilities.controllerLevelBelow(room, 3)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
    }
}
function defendedColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.hasStorage(room) &&
        RoomUtilities.hasAtLeastExtensions(room, 20) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 4)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
    }
}
function civilizedColonyCheck(room) {
    if (RoomUtilities.controllerLevelAtLeast(room, 5) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColony)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColony) &&
        (RoomUtilities.controllerLevelBelow(room, 4) || !RoomUtilities.hasStorage(room))) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
    }
}
function civilizedColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.hasAtLeastExtensions(room, 30) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 5)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
    }
}
function advancedColonyCheck(room) {
    if (RoomUtilities.controllerLevelAtLeast(room, 6) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColony)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColony) &&
        RoomUtilities.controllerLevelBelow(room, 5)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
    }
}
function advancedColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.hasTerminal(room) &&
        RoomUtilities.hasAtLeastExtensions(room, 40) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 6)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
    }
}
function townCheck(room) {
    if (RoomUtilities.controllerLevelAtLeast(room, 7) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Town)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.TownReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Town) &&
        (RoomUtilities.controllerLevelBelow(room, 6) || !RoomUtilities.hasTerminal(room))) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
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
            }
            else {
                room.memory.lab.operational = false;
            }
        }
    }
    else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}
function townReadyForExpansionCheck(room) {
    if (RoomUtilities.hasAtLeastSpawns(room, 2) &&
        RoomUtilities.hasAtLeastExtensions(room, 50) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.TownReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.TownReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 7)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
    }
}
function cityCheck(room) {
    if (RoomUtilities.controllerLevelAtLeast(room, 8) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.City)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CityReadyForExpansion);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.City) &&
        RoomUtilities.controllerLevelBelow(room, 7)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
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
            }
            else {
                room.memory.lab.operational = false;
            }
        }
    }
    else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}
function cityColonyReadyForExpansionCheck(room) {
    if (RoomUtilities.hasAtLeastSpawns(room, 3) &&
        RoomUtilities.hasAtLeastExtensions(room, 60) &&
        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CityReadyForExpansion)) {
        OrdersRepository.clearOrders(room);
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Metropolis);
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CityReadyForExpansion) &&
        RoomUtilities.controllerLevelBelow(room, 8)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
    }
}
function metropolisCheck(room) {
    if (room.memory.lab === undefined) {
        room.memory.lab = {};
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
        !RoomUtilities.hasStorage(room)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
        return;
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
        !RoomUtilities.hasTerminal(room)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
        return;
    }
    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
        RoomUtilities.controllerLevelBelow(room, 8)) {
        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
        return;
    }
    if (RoomUtilities.hasAtLeastLabs(room, 10)) {
        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
            room.memory.lab.processingLabs.length < 7 || room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 7) {
                room.memory.lab.operational = true;
            }
            else {
                room.memory.lab.operational = false;
            }
        }
    }
    else {
        room.memory.lab.operational = false;
        room.memory.lab.processingLabs = undefined;
        room.memory.lab.supplyingLabs = undefined;
    }
}
