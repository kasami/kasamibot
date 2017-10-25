
import * as ProfileUtilities from "../utilities/Profiles";
import * as SourceUtilities from "../utilities/Source";
import * as OrdersRepository from "../repository/Orders";

import * as MineralMiner from "../roles/MineralMiner";
import * as MineralHauler from "../roles/MineralHauler";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as IntelLib from "../lib/intel";

import {Order} from "../classes/Order";

import * as RoomRepository from "../repository/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

export class MineralManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    private hasRun = false;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("MineralManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 50 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                this.mineMinerals(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        } else
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.MineralMiner, MineralMiner.run);
            this.creepService.runCreeps(Role.MineralHauler, MineralHauler.run);
        } else
        if (pri === ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                this.mineMinerals(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private mineMinerals(rooms: Room[]) {
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town) {
                if (room.memory.miningMinerals) {
                    let mineral = room.getMineral();
                    if (mineral !== undefined && room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
                        _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                        this.orderMineralMiner(room);
                        this.orderMineralHauler(room, mineral);
                    }
                } else {
                    prepareMineralMining(room);
                }
            }

            let lairs = RoomRepository.getLairOutposts(room);
            if (RoomRepository.getRoomLevel(room)  >= RoomLevel.City && (lairs.length > 0 || room.memory.praiseroom !== undefined)) {
                let mineralOutposts: string[] = lairs
                if (room.memory.praiseroomHibernated !== true) {
                    mineralOutposts = lairs.concat(room.memory.praiseroom);
                }
                for (let outpost of mineralOutposts) {
                    let outpostRoom = Game.rooms[outpost];

                    if (!IntelLib.hasInvaders(outpost) && outpostRoom !== undefined &&
                    (outpostRoom.controller === undefined || outpostRoom.controller.level > 5)) {
                        let mineral = outpostRoom.getMineral();
                        if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
                         room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
                         _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                            if (mineral.hasMiningContainer() && mineral.hasExtractor()) {
                                this.orderSKMineralMiner(room, mineral);
                                this.orderMineralHauler(room, mineral);
                            } else {
                                prepareExternalMineralMining(mineral);
                            }
                        }
                    }
                }
            }
        }
    }

    private orderMineralMiner(room: Room) {
        let target = room.getMineral();
        if (target === undefined || target.ticksToRegeneration !== undefined) {
            return;
        }
        if (!target.hasMiningContainer()) {
            return;
        }
        let currentWorkers = this.creepService.getCreeps(Role.MineralMiner, target.id).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, Role.MineralMiner, target.id);
        let maxCount = 1;

        if (orderedWorkers + currentWorkers >= maxCount) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);

        let order = new Order();
        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
        order.priority = Priority.Standard;
        order.memory = {role: Role.MineralMiner, target: target.id, tier: maxTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderMineralHauler(room: Room, mineral: Mineral) {
        if (mineral === undefined) {
            return;
        }
        let container = mineral.getMiningContainer();
        if (container === null || _.sum(container.store) === 0) {
            return;
        }
        let target = mineral.room.name + "-" + mineral.id;

        let currentWorkers = this.creepService.getCreeps(Role.MineralHauler, target).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, Role.MineralHauler, target);

        if (orderedWorkers + currentWorkers >= 1) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let neededTiers = SourceUtilities.getTiersRequiredForMineralHauling(mineral, room);
        let usedTier = Math.min(maxTier, Math.max(neededTiers, 2));

        let order = new Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = Priority.Standard;
        order.memory = {role: Role.MineralHauler, target: target, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderSKMineralMiner(room: Room, mineral: Mineral) {
        let target = mineral;
        if (target === undefined || target.ticksToRegeneration !== undefined) {
            return;
        }
        if (!target.hasMiningContainer()) {
            return;
        }
        let currentWorkers = this.creepService.getCreeps(Role.MineralMiner, target.id).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, Role.MineralMiner, target.id);
        let maxCount = 1;

        if (orderedWorkers + currentWorkers >= maxCount) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);

        let order = new Order();
        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
        order.priority = Priority.Standard;
        order.memory = {role: Role.MineralMiner, target: target.id, tier: maxTier};

        OrdersRepository.orderCreep(room, order);
    }
}

function prepareMineralMining(room: Room) {
    let mineral = room.getMineral();
    if (mineral) {
        let structsAtMineral = mineral.pos.lookFor(LOOK_STRUCTURES) as Structure[];
        if (structsAtMineral.length > 0 && structsAtMineral[0].structureType === STRUCTURE_EXTRACTOR) {
            let extractor = structsAtMineral[0] as StructureExtractor;
            if (extractor.my) {
                room.memory.miningMinerals = true;
            } else {
                extractor.destroy();
            }
        } else {
            mineral.buildMiningContainer();
            mineral.buildExtractor();
        }
    }
}

function prepareExternalMineralMining(mineral: Mineral) {
    if (mineral.room.memory.isPraiseRoom && mineral.room.controller !== undefined && mineral.room.controller.my && mineral.room.controller.level >= 6) {
        mineral.buildExtractor();
    }
    if (mineral && !mineral.hasMiningContainer()) {
        mineral.buildMiningContainer();
    }
}
