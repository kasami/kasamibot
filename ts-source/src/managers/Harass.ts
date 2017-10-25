import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as MilitaryLib from "../lib/military";
import * as HarassLib from "../lib/harass";
import * as IntelLib from "../lib/intel";

import * as RoomRepository from "../repository/Room";

import {RoomLevel} from "../enums/roomlevel";
import {HarassType} from "../enums/harasstype";

import {log} from "../tools/Logger";

export class HarassManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN_LOTTERY = "lastRunLottery";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("HarassManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (Memory.settings.bot !== true || Memory.settings.passive === true) {
            return;
        }
        if (pri === ManagerPriority.Trivial) {
            let lastRunLottery = this.getValue(this.MEMORY_LASTRUN_LOTTERY);
            if (lastRunLottery === undefined || lastRunLottery + 500 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                for (let room of rooms) {
                    if (this.roomShouldTryToHarass(room))
                    {
                        let targetRoom = this.findHarassTarget(room);
                        if (targetRoom === undefined) {
                            continue;
                        }
                        let attackType = this.findHarassType(room, targetRoom);
                        this.orderAttackType(room, targetRoom, attackType);
                        log.alert("Room " + room.name + " won the lottery and is allowed to harass " + targetRoom + " with " + HarassType[attackType] +"!", room.name);

                    }
                }
                this.setValue(this.MEMORY_LASTRUN_LOTTERY, Game.time);
            }
        }
    }

    private roomShouldTryToHarass(room: Room):boolean {
        return _.random(1, 10) === 10 && RoomRepository.getRoomLevel(room) >= RoomLevel.SimpleColony &&
            (room.memory.orders === undefined || room.memory.orders.length < 3) &&
            ((room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) ||
            (room.storage === undefined && room.find(FIND_MY_CREEPS).length) > 2);
    }

    private orderAttackType(room: Room, target: string, type: HarassType) {
        switch(type) {
            case HarassType.T3BoostedWreckerTeam:
                let boostedT3 = HarassLib.getT3BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT3 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT3, [], [target], 3);
                }
                break;
            case HarassType.T2BoostedWreckerTeam:
                let boostedT2 = HarassLib.getT2BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT2 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT2, [], [target], 2);
                }
                break;
            case HarassType.T1BoostedWreckerTeam:
                let boostedT1 = HarassLib.getT1BoostedWreckerTeamTierForRoom(room, target);
                if (boostedT1 !== undefined) {
                    MilitaryLib.orderTeamWrecker(room, boostedT1, [], [target], 1);
                }
                break;
            case HarassType.Drainer:
                if (room.controller !== undefined && room.controller.level > 0 && room.controller.my) {
                    MilitaryLib.orderDrainer(room, room.controller.level, [target]);
                }
                break;
            case HarassType.Harasser:
                MilitaryLib.orderHarasser(room, target);
                break;
        }
    }

    private findHarassTarget(room: Room): string | undefined {
        if (room.memory.neighbours === undefined) {
            return undefined;
        }

        let pool: string[] = [];

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

    private findHarassType(room: Room, target: string): HarassType {
        let pool: HarassType[] = [];

        if (IntelLib.isOwned(target)) {
            if (IntelLib.towerCount(target) === 0) {
                pool.push(HarassType.Harasser);
            } else {
                if (HarassLib.canSendT3BoostedWreckerTeam(room, target)) {
                    pool.push(HarassType.T3BoostedWreckerTeam);
                }
                if (HarassLib.canSendT2BoostedWreckerTeam(room, target)) {
                    pool.push(HarassType.T2BoostedWreckerTeam);
                }
                if (HarassLib.canSendT1BoostedWreckerTeam(room, target)) {
                    pool.push(HarassType.T1BoostedWreckerTeam);
                }
                if (pool.length === 0) {
                    pool.push(HarassType.Drainer);
                }
            }
        } else {
            pool.push(HarassType.Harasser);
        }

        let chosen = pool[(_.random(0, pool.length - 1))];
        return chosen;
    }
}
