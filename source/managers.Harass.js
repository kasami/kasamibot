"use strict";
const _Manager_1 = require("./managers._Manager");
const MilitaryLib = require("./lib.military");
const HarassLib = require("./lib.harass");
const IntelLib = require("./lib.intel");
const RoomRepository = require("./repository.Room");
const roomlevel_1 = require("./enums.roomlevel");
const harasstype_1 = require("./enums.harasstype");
const Logger_1 = require("./tools.Logger");
class HarassManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("HarassManager");
        this.MEMORY_LASTRUN_LOTTERY = "lastRunLottery";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (Memory.settings.bot !== true || Memory.settings.passive === true) {
            return;
        }
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            let lastRunLottery = this.getValue(this.MEMORY_LASTRUN_LOTTERY);
            if (lastRunLottery === undefined || lastRunLottery + 500 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                for (let room of rooms) {
                    if (this.roomShouldTryToHarass(room)) {
                        let targetRoom = this.findHarassTarget(room);
                        if (targetRoom === undefined) {
                            continue;
                        }
                        let attackType = this.findHarassType(room, targetRoom);
                        this.orderAttackType(room, targetRoom, attackType);
                        Logger_1.log.alert("Room " + room.name + " won the lottery and is allowed to harass " + targetRoom + " with " + harasstype_1.HarassType[attackType] + "!", room.name);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN_LOTTERY, Game.time);
            }
        }
    }
    roomShouldTryToHarass(room) {
        return _.random(1, 10) === 10 && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.SimpleColony &&
            (room.memory.orders === undefined || room.memory.orders.length < 3) &&
            ((room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) ||
                (room.storage === undefined && room.find(FIND_MY_CREEPS).length) > 2);
    }
    orderAttackType(room, target, type) {
        switch (type) {
            case harasstype_1.HarassType.T3BoostedWreckerTeam:
                let boostedT3 = HarassLib.getT3BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT3 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT3, [], [target], 3);
                }
                break;
            case harasstype_1.HarassType.T2BoostedWreckerTeam:
                let boostedT2 = HarassLib.getT2BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT2 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT2, [], [target], 2);
                }
                break;
            case harasstype_1.HarassType.T1BoostedWreckerTeam:
                let boostedT1 = HarassLib.getT1BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT1 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT1, [], [target], 1);
                }
                break;
            case harasstype_1.HarassType.Drainer:
                if (room.controller !== undefined && room.controller.level > 0 && room.controller.my) {
                    MilitaryLib.orderDrainer(room, room.controller.level, [target]);
                }
                break;
            case harasstype_1.HarassType.Harasser:
                MilitaryLib.orderHarasser(room, target);
                break;
        }
    }
    findHarassTarget(room) {
        if (room.memory.neighbours === undefined) {
            return undefined;
        }
        let pool = [];
        if (room.memory.neighbours.oneAway !== undefined) {
            for (let r of room.memory.neighbours.oneAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    pool.push(r, r, r, r, r, r, r, r);
                    if (IntelLib.isOwned(r)) {
                        pool.push(r, r);
                    }
                }
            }
        }
        if (room.memory.neighbours.twoAway !== undefined) {
            for (let r of room.memory.neighbours.twoAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    pool.push(r, r, r, r, r);
                    if (IntelLib.isOwned(r)) {
                        pool.push(r, r);
                    }
                }
            }
        }
        if (room.memory.neighbours.threeAway !== undefined) {
            for (let r of room.memory.neighbours.threeAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    pool.push(r, r, r);
                    if (IntelLib.isOwned(r)) {
                        pool.push(r, r);
                    }
                }
            }
        }
        if (room.memory.neighbours.fourAway !== undefined) {
            for (let r of room.memory.neighbours.fourAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    pool.push(r);
                    if (IntelLib.isOwned(r)) {
                        pool.push(r, r);
                    }
                }
            }
        }
        if (room.memory.neighbours.fiveAway !== undefined) {
            for (let r of room.memory.neighbours.fiveAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    if (IntelLib.isOwned(r)) {
                        pool.push(r, r);
                    }
                }
            }
        }
        if (room.memory.neighbours.sixAway !== undefined) {
            for (let r of room.memory.neighbours.sixAway) {
                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
                    if (IntelLib.isOwned(r)) {
                        pool.push(r);
                    }
                }
            }
        }
        let chosen = pool[(_.random(0, pool.length - 1))];
        return chosen;
    }
    findHarassType(room, target) {
        let pool = [];
        if (IntelLib.isOwned(target)) {
            if (IntelLib.towerCount(target) === 0) {
                pool.push(harasstype_1.HarassType.Harasser);
            }
            else {
                if (HarassLib.canSendT3BoostedWreckerTeam(room, target)) {
                    pool.push(harasstype_1.HarassType.T3BoostedWreckerTeam);
                }
                if (HarassLib.canSendT2BoostedWreckerTeam(room, target)) {
                    pool.push(harasstype_1.HarassType.T2BoostedWreckerTeam);
                }
                if (HarassLib.canSendT1BoostedWreckerTeam(room, target)) {
                    pool.push(harasstype_1.HarassType.T1BoostedWreckerTeam);
                }
                if (pool.length === 0) {
                    pool.push(harasstype_1.HarassType.Drainer);
                }
            }
        }
        else {
            pool.push(harasstype_1.HarassType.Harasser);
        }
        let chosen = pool[(_.random(0, pool.length - 1))];
        return chosen;
    }
}
exports.HarassManager = HarassManager;
