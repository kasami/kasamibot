import * as SourceUtilities from "../utilities/Source";
import * as ProfileUtilities from "../utilities/Profiles";

import * as ScoutingManager from "../managers/Scouting";

import * as ContainerMiner from "../roles/ContainerMiner";

import * as IntelLib from "../lib/intel";

import {Order} from "../classes/Order";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

export class MiningManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("MiningManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.ContainerMiner, ContainerMiner.run);
            this.creepService.runCreeps(Role.SKMiner, ContainerMiner.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (!room.isExpansion()) {
                        this.organizeEnergyMining(room)
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private organizeEnergyMining(room: Room) {
        let roomlevel = RoomRepository.getRoomLevel(room);

        let lairs = RoomRepository.getLairOutposts(room);
        if (roomlevel >= RoomLevel.City && lairs.length > 0) {
            for (let outpost of lairs) {
                if (!RoomRepository.isPortalRoom(outpost) || IntelLib.hasInvaders(outpost)) {
                    this.orderSKGuard(room, outpost);
                }

                if (RoomRepository.isPortalRoom(outpost) && IntelLib.hasInvaders(outpost)) {
                    this.orderPortalGuard(room, outpost);
                }
            }
        }

        if ((room.storage !== undefined && _.sum(room.storage.store) > (STORAGE_CAPACITY * 0.95))) {
            return;
        }
        let sources = SourceUtilities.getAllSourcesInRoom(room);
        if (roomlevel === undefined || roomlevel < RoomLevel.DefendedColony) {
            let sources = room.getSources();
            let outposts = RoomRepository.getBasicOutposts(room);
            for (let source of sources) {
                this.orderPioneers(room, source.id, source.pos, source.getMiningPositions().length);
            }

            for (let outpost of outposts) {
                if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
                    for (let sourceId of IntelLib.sourceIds(outpost)) {
                        let count = 1;
                        let source = Game.getObjectById(sourceId) as Source | null;
                        if (source !== null) {
                            count = source.getMiningPositions().length;
                        }
                        this.orderPioneers(room, sourceId, IntelLib.sourcePos(outpost, sourceId), count);
                    }
                }
            }
        } else {
            for (let source of sources) {
                this.orderContainerMiners(room, source.id, source.room.name);
                if (roomlevel < RoomLevel.City) {
                    this.orderContainerHaulers(room, source.id, source.room.name, source.pos);
                }
            }

            let outposts = RoomRepository.getBasicOutposts(room);
            for (let outpost of outposts) {
                if (!IntelLib.hasInvaders(outpost)) {
                    for (let sourceId of IntelLib.sourceIds(outpost)) {
                        this.orderContainerMiners(room, sourceId, outpost);
                        if (roomlevel < RoomLevel.City) {
                            this.orderContainerHaulers(room, sourceId, outpost, IntelLib.sourcePos(outpost, sourceId));
                        }
                    }
                }
                if (!IntelLib.hasIntel(outpost)) {
                    ScoutingManager.orderScouting(room, outpost);
                }
            }

        if (roomlevel >= RoomLevel.City && lairs.length > 0) {
            for (let outpost of lairs) {
                if (!IntelLib.hasInvaders(outpost)) {
                    for (let sourceId of IntelLib.sourceIds(outpost)) {
                        this.orderContainerMiners(room, sourceId, outpost, true);
                    }
                }
            }
        }
        }
    }

    private orderPortalGuard(room: Room, targetRoom: string) {
        let current = this.creepService.getCreeps(Role.SKGuard, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.SKGuard, targetRoom);
        if (current + ordered > 0) {
            return;
        }

        let lairs = RoomRepository.getLairOutposts(room);
        for (let outpost of lairs) {
            let guards = this.creepService.getCreeps(Role.SKGuard, outpost);
            for (let guard of guards) {
                if (guard.ticksToLive > 200) {
                    guard.memory.target = targetRoom;
                    console.log("SK-guard being reordered to portalroom:" + guard.id);
                    return;
                }
            }
        }
        this.orderSKGuard(room, targetRoom);
    }

    private orderSKGuard(room: Room, targetRoom: string) {
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.SKGuard);
        if (ordered > 0) {
            return;
        }

        let currentCreeps = this.creepService.getCreeps(Role.SKGuard, targetRoom);
        let current = currentCreeps.length;
        if (currentCreeps.length === 1 && (currentCreeps[0].ticksToLive > 300 || currentCreeps[0].ticksToLive === undefined)) {
            return;
        }
        if (current + ordered > 1) {
            return;
        }
        let guardOrder = new Order();
        guardOrder.body = ProfileUtilities.getSKGuardBody();
        guardOrder.priority = Priority.Critical;
        guardOrder.memory = {role: Role.SKGuard, target: targetRoom, tier: 1, token: ""+Game.time};

        let healerOrder = new Order();
        healerOrder.body = ProfileUtilities.getSKHealerBody();
        healerOrder.priority = Priority.Critical;
        healerOrder.memory = {role: Role.SKHealer, target: targetRoom, tier: 1, token: ""+Game.time};

        healerOrder.twinOrder = guardOrder;

        OrdersRepository.orderCreep(room, healerOrder);
    }

    /**
     * Used in the beginning to order engineers for starting up a base.
     * Should order an engineer if it does not already has enough and none is being built.
     * Number of engineers needed is described in startup-manager.
     */
    private orderPioneers(room: Room, sourceId: string, sourcePos: RoomPosition, miningPositions: number): void {
        let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyCapacityAvailable);
        let spawn = room.getSpawn();
        if (spawn === undefined) {
            return;
        }
        let currentCreeps = this.creepService.getCreeps(Role.Pioneer, sourceId, room.name).length;
        let currentTiers = this.creepService.getNumberOfTiers(Role.Pioneer, sourceId, room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.Pioneer, sourceId);
        let wantedTiers = SourceUtilities.getTiersRequiredForPioneerMining(maxTier, miningPositions, spawn.pos, sourcePos);

        if (orderedTiers === 0 && currentTiers < wantedTiers && currentCreeps < 10) {
            let order = new Order();
            order.body = ProfileUtilities.getEngineerBody(maxTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.Pioneer, tier: maxTier, target: sourceId};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderContainerMiners(room: Room, sourceId: string, sourceRoom: string, skroom: boolean = false): void {
        let target = sourceRoom + "-" + sourceId;
        let currentWorkers = this.creepService.getCreeps(Role.ContainerMiner, target);
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, Role.ContainerMiner, target);
        if (currentWorkers.length > 1) {
            for(let c of currentWorkers) {
                c.memory.orderCopyTick = -1;
            }
        }
        if (orderedWorkers + currentWorkers.length > 0) {
            return;
        }

        if (room.controller === undefined || room.controller.level < 1) {
            console.log("Can not find controller in room: " + room.controller + " - " + room.name);
            return;
        }

        let usedTier = room.controller.level;

        let order = new Order();
        if (skroom) {
            order.body = ProfileUtilities.getSkMinerBody(usedTier);
        } else {
            order.body = ProfileUtilities.getMinerBody(usedTier);
        }
        order.priority = Priority.Standard;
        if (room.name === sourceRoom) {
            order.priority = Priority.Important;
        }
        order.memory = {role: Role.ContainerMiner, target: target, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderContainerHaulers(room: Room, sourceId: string, sourceRoom: string, sourcePos: RoomPosition): void {
        let target = sourceRoom + "-" + sourceId;
        let source = Game.getObjectById(sourceId);
        if (!(source instanceof Source) || !source.hasMiningContainer()) {
            return;
        }
        let currentMinersAtSource = this.creepService.getCreeps(Role.ContainerMiner, target).length;
        if (currentMinersAtSource < 1) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let neededTiers = SourceUtilities.getTiersRequiredForContainerHauling(sourcePos, room, 3000);
        let usedTier = Math.min(maxTier, neededTiers);
        let neededHaulers = 1;
        if (neededTiers > maxTier) {
            neededHaulers = 2;
            usedTier = Math.min(maxTier, Math.ceil(neededTiers / 2));
        }

        let currentWorkers = this.creepService.getCreeps(Role.ContainerHauler, target).length;
        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, Role.ContainerHauler, target);
        if (orderedWorkers + currentWorkers >= neededHaulers) {
            return;
        }

        let order = new Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = Priority.Standard;
        if (currentWorkers > 0) {
            order.priority = Priority.Low;
        }
        if (room.name === sourceRoom) {
            order.priority = Priority.Important;
        }
        order.memory = {role: Role.ContainerHauler, target: target, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }
}
