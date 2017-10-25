import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";
import {Roomtype} from "../enums/roomtype";

import * as Praiser from "../roles/Praiser";
import * as PraiserHauler from "../roles/PraiserHauler";
import * as PraiserLeader from "../roles/PraiserLeader";

import * as ProfileUtilities from "../utilities/Profiles";
import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as PrayerLib from "../lib/prayer";
import * as BuildLib from "../lib/build";

import * as OrdersRepository from "../repository/Orders";

import {Order} from "../classes/Order";

import {Role} from "../enums/role";
import {PraiseStatus} from "../enums/praisestatus";
import {Priority} from "../enums/priority";

import {log} from "../tools/Logger";

export class PraiseroomManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("PraiseroomManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            this.creepService.runCreeps(Role.PraiserWithBoost, Praiser.run);
        } else
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.PraiserLeader, PraiserLeader.run);
            this.creepService.runCreeps(Role.PraiserOfficer, PraiserLeader.run);

            let praiseRooms = this.roomService.getPraiseRooms();
            for (let praiseRoom of praiseRooms) {
                if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
                    if (praiseRoom.memory.praiseStatus === PraiseStatus.Praising ||
                        praiseRoom.memory.praiseStatus === PraiseStatus.PreparingReset ||
                        praiseRoom.memory.praiseStatus === PraiseStatus.Reestablishing) {
                        this.runPraising(praiseRoom);
                    }
                }
            }

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 30 < Game.time) {
                let roomsWithPraiseroom = this.roomService.getNormalWithPraiseroom();
                this.runPraiserooms(roomsWithPraiseroom);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        } else
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.PraiserWithoutBoost, Praiser.run);
            this.creepService.runCreeps(Role.PraiserSupport, Praiser.run);
            this.creepService.runCreeps(Role.PraiserHauler, PraiserHauler.run);
        }
    }

    private runPraiserooms(roomsWithPraiseroom: Room[]) {
        for (let room of roomsWithPraiseroom) {
            let praiseRoom = Game.rooms[room.memory.praiseroom];
            if (praiseRoom === undefined || (praiseRoom.controller !== undefined && !praiseRoom.controller.my && !room.memory.praiseroomHibernated)) {
                this.orderRoomClaimer(room, room.memory.praiseroom);
                if (Memory.rooms[room.memory.praiseroom] === undefined) {
                    Memory.rooms[room.memory.praiseroom] = {};
                }
                Memory.rooms[room.memory.praiseroom].isPraiseRoom = true;
            }
            praiseRoom.memory.t = Roomtype.Praiseroom;
            if (!room.memory.praiseroomHibernated) {
                this.buildPraiseBuildings(praiseRoom);
            } else {
                praiseRoom.memory.praiseStatus = PraiseStatus.PreparingHibernate;
            }

            if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
                this.setPraiseStatus(praiseRoom);

                this.orderPraisers(room, praiseRoom.name, this.getWantedPraiserCount(praiseRoom));

                if (this.isDoublePraising(praiseRoom)) {
                    this.orderPraiserSupporters(room, praiseRoom.name);
                }

                if (this.shouldWeOrderHaulers(praiseRoom)) {
                    this.orderPraiserHaulers(room, praiseRoom.name);
                }

                if (praiseRoom.memory.praiseStatus === PraiseStatus.Praising || praiseRoom.memory.praiseStatus === PraiseStatus.PreparingReset ||
                praiseRoom.memory.praiseStatus === PraiseStatus.Reestablishing) {
                    this.orderPraiserLeader(room, praiseRoom.name);
                }

                if (praiseRoom.memory.praiseStatus === PraiseStatus.Praising && this.isDoublePraising(praiseRoom)) {
                    this.orderPraiserOfficer(room, praiseRoom.name);
                }
            }
        }
    }

    private isDoublePraising(praiseRoom: Room): boolean {
        if (praiseRoom.controller === undefined) {
            return false;
        }

        if (praiseRoom.controller.level !== 7 || praiseRoom.memory.doublepraiser !== true) {
            return false;
        }
        if (praiseRoom.find(FIND_MY_SPAWNS).length !== 2) {
            return false;
        }
        let spawn = praiseRoom.getSpawn();
        if (spawn === undefined) {
            return false;
        }
        if (PrayerLib.getContainer(praiseRoom, spawn.pos) === undefined) {
            return false;
        }
        return true;
    }

    private runPraising(praiseRoom: Room) {
        let spawn = praiseRoom.getSpawn();
        let storage = praiseRoom.storage;
        if (spawn === undefined || storage === undefined) {
            log.error("Praiseroom missing spawn or storage", praiseRoom.name);
            return;
        }

        let leader = this.getPraiserLeader(praiseRoom);
        let creepInHealingPos = this.getHealingPraiser(praiseRoom, storage.pos);
        let nextCreepInHealingPos = this.getNextHealingPraiser(praiseRoom, storage.pos);


        if (praiseRoom.memory.rotationDone) {
            this.boostPraisersIfShouldAndCan(praiseRoom);
            praiseRoom.memory.rotationDone = undefined;
            if (creepInHealingPos !== undefined) {
                creepInHealingPos.memory.checkRamparts = true;
            }
        }

        if ((Game.time % 366 === 0 && (creepInHealingPos === undefined || (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1470))) ||
            (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1485 &&
            (nextCreepInHealingPos === undefined || (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 100))))
        {
            this.assignPositionsToPraisers(praiseRoom, storage);
            log.info("Rotating praisers in praiserroom", praiseRoom.name);
            praiseRoom.memory.rotationDone = true;
        }

        if (leader !== undefined && leader.ticksToLive < 1000) {
            spawn.renewCreep(leader);
        } else
        if (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 10 ) {
            spawn.renewCreep(nextCreepInHealingPos);
        } else
        if (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive < 1485 &&
        ((creepInHealingPos.body[0].boost && creepInHealingPos.ticksToLive < 10) || !creepInHealingPos.body[0].boost)) {
            spawn.renewCreep(creepInHealingPos);
        }

        let spawn2 = PrayerLib.getSpawn2(praiseRoom, spawn.pos);
        if (!this.isDoublePraising(praiseRoom) || spawn2 === undefined) {
            return;
        }
        let officer = this.getPraiserOfficer(praiseRoom);
        let supporterInHealingPos = this.getHealingSupporter(praiseRoom, storage.pos);
        let nextSupporterInHealingPos = this.getNextHealingSupporter(praiseRoom, storage.pos);

        if (praiseRoom.memory.rotationDone) {
            this.assignPositionsToSupporters(praiseRoom, spawn2);
        }

        if (officer !== undefined && officer.ticksToLive < 1000) {
            spawn2.renewCreep(officer);
        } else
        if (nextSupporterInHealingPos !== undefined && nextSupporterInHealingPos.ticksToLive < 10 ) {
            spawn2.renewCreep(nextSupporterInHealingPos);
        } else
        if (supporterInHealingPos !== undefined && supporterInHealingPos.ticksToLive < 1485) {
            spawn2.renewCreep(supporterInHealingPos);
        }
    }

    private boostPraisersIfShouldAndCan(praiseRoom: Room) {
        if (praiseRoom.storage === undefined || praiseRoom.terminal === undefined || praiseRoom.controller === undefined) {
            return;
        }
        let creepInBoostingPos = this.getBoostingPraiser(praiseRoom, praiseRoom.storage.pos);
        if (creepInBoostingPos === undefined || creepInBoostingPos.body[0].boost || creepInBoostingPos.ticksToLive < 1470) {
            return;
        }
        if (praiseRoom.controller.level < 6 || praiseRoom.controller.level > 7 ||
        (praiseRoom.controller.level === 7 && praiseRoom.controller.progress > praiseRoom.controller.progressTotal * 0.95)) {
            return;
        }
        let lab = PrayerLib.getBoosterLab(praiseRoom, praiseRoom.storage.pos);
        if (lab === undefined) {
            return;
        }
        if (lab.mineralAmount === lab.mineralCapacity && lab.mineralType === RESOURCE_CATALYZED_GHODIUM_ACID) {
            lab.boostCreep(creepInBoostingPos);
            log.info("Boosting praisers in praiserroom", praiseRoom.name);
        }
    }

    private assignPositionsToPraisers(praiseRoom: Room, storage: StructureStorage) {
        let positions = PrayerLib.getPraiserPositions(praiseRoom, storage.pos);
        let praisers = this.getPraisersSortedByTicksToLive(praiseRoom);
        for (let posIndex in positions) {
            if (praisers[posIndex] instanceof Creep) {
                praisers[posIndex].memory.wantedPos = positions[posIndex];
            } else {
                return;
            }
        }
    }

    private getPraisersSortedByTicksToLive(praiseRoom: Room): Creep[] {
        let praisers = this.creepService.getCreeps(Role.Praiser, praiseRoom.name) as Creep[];
        return praisers.sort(
            function(a: Creep, b: Creep) {
                return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
            });
    }

    private assignPositionsToSupporters(praiseRoom: Room, spawn2: StructureSpawn) {
        let positions = PrayerLib.getSupporterPositions(praiseRoom, spawn2.pos);
        let praisers = this.getSupportersSortedByTicksToLive(praiseRoom);
        for (let posIndex in positions) {
            if (praisers[posIndex] instanceof Creep) {
                praisers[posIndex].memory.wantedPos = positions[posIndex];
            } else {
                return;
            }
        }
    }

    private getSupportersSortedByTicksToLive(praiseRoom: Room): Creep[] {
        let praisers = this.creepService.getCreeps(Role.PraiserSupport, praiseRoom.name) as Creep[];
        return praisers.sort(
            function(a: Creep, b: Creep) {
                return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
            });
    }

    private getBoostingPraiser(room: Room, storagePos: RoomPosition): Creep | undefined {
        let boostPos = PrayerLib.getBoostCreepPos(room, storagePos);
        let atPos = boostPos.lookFor<Creep>(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }

    private getHealingPraiser(room: Room, storagePos: RoomPosition): Creep | undefined {
        let healPos = PrayerLib.getHealCreepPos(room, storagePos)
        let atPos = healPos.lookFor<Creep>(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }

    private getHealingSupporter(room: Room, storagePos: RoomPosition): Creep | undefined {
        let healPos = PrayerLib.getHealSupporterPos(room, storagePos)
        let atPos = healPos.lookFor<Creep>(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }

    private getNextHealingPraiser(room: Room, storagePos: RoomPosition): Creep | undefined {
        let healPos = PrayerLib.getNextHealCreepPos(room, storagePos);
        let atPos = healPos.lookFor<Creep>(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }

    private getNextHealingSupporter(room: Room, storagePos: RoomPosition): Creep | undefined {
        let healPos = PrayerLib.getNextHealSupporterPos(room, storagePos);
        let atPos = healPos.lookFor<Creep>(LOOK_CREEPS);
        if (atPos.length > 0) {
            return atPos[0];
        }
        return undefined;
    }

    private getPraiserLeader(praiseRoom: Room): Creep | undefined {
        let leaders = this.creepService.getCreeps(Role.PraiserLeader, praiseRoom.name) as Creep[];
        if (leaders.length > 0) {
            return leaders[0];
        }
        return undefined;
    }

    private getPraiserOfficer(praiseRoom: Room): Creep | undefined {
        let leaders = this.creepService.getCreeps(Role.PraiserOfficer, praiseRoom.name) as Creep[];
        if (leaders.length > 0) {
            return leaders[0];
        }
        return undefined;
    }

    private setPraiseStatus(praiseRoom: Room) {
        if (praiseRoom.controller === undefined || !praiseRoom.controller.my) {
            return;
        } else
        if (praiseRoom.memory.praiseStatus == PraiseStatus.PreparingHibernate) {
            if (this.creepService.getCreeps(Role.Praiser, praiseRoom.name).length === 0) {
                praiseRoom.controller.unclaim();
                praiseRoom.memory.praiseStatus = PraiseStatus.Hiberate;
            }
        } else
        if (praiseRoom.controller.level < 6 || (praiseRoom.controller.level === 6 && praiseRoom.terminal === undefined)) {
            if (praiseRoom.terminal === undefined) {
                praiseRoom.memory.praiseStatus = PraiseStatus.Establishing;
            } else {
                praiseRoom.memory.praiseStatus = PraiseStatus.Reestablishing;
            }
        } else
        if (praiseRoom.controller.level === 8) {
            if (praiseRoom.storage !== undefined && praiseRoom.storage.store[RESOURCE_ENERGY] > praiseRoom.storage.storeCapacity - 10000) {
                if (praiseRoom.memory.praiseStatus !== PraiseStatus.Reestablishing) {
                    this.removePraisersForReset(praiseRoom);
                    praiseRoom.controller.unclaim();
                }
                praiseRoom.memory.praiseStatus = PraiseStatus.Reestablishing;
            } else {
                if (praiseRoom.memory.praiseStatus !== PraiseStatus.PreparingReset) {
                    this.removePraisersForReset(praiseRoom);
                }
                praiseRoom.memory.praiseStatus = PraiseStatus.PreparingReset;
            }
        } else
        if (praiseRoom.storage !== undefined && praiseRoom.terminal !== undefined) {
            praiseRoom.memory.praiseStatus = PraiseStatus.Praising;
        } else {
            log.error("PraiseManager could not find a valid status for praiseroom", praiseRoom.name);
        }
    }

    private removePraisersForReset(praiseRoom: Room) {
        let currentPraisers = this.creepService.getCreeps(Role.Praiser, praiseRoom.name);
        let count = 0;
        for (let praiser of currentPraisers) {
            count++;
            if (count > 6) {
                praiser.suicide();
            }
        }
        let currentSupporters = this.creepService.getCreeps(Role.PraiserSupport, praiseRoom.name);
        for (let supporter of currentSupporters) {
            supporter.suicide();
        }
    }

    private shouldWeOrderHaulers(praiseRoom: Room) {
        return praiseRoom.terminal === undefined ||
            (!praiseRoom.terminal.isActive() && praiseRoom.storage !== undefined &&
            praiseRoom.storage.isActive() && praiseRoom.storage.store[RESOURCE_ENERGY] < 950000);
    }

    private getWantedPraiserCount(praiseRoom: Room): number {
        switch(praiseRoom.memory.praiseStatus) {
            case PraiseStatus.Establishing:
                return 3;
            case PraiseStatus.Reestablishing:
                return 6;
            case PraiseStatus.Praising:
                return 7;
            default:
                return 0;
        }
    }

    private buildPraiseBuildings(room: Room) {
        if (room.controller === undefined || !room.controller.my) {
            return;
        }
        let spawn = room.getSpawn();
        if (spawn === undefined && room.controller.level > 0) {
            let flags = room.find(FIND_FLAGS, {filter: (f: Flag) => f.name === "praise" && f.pos.roomName === room.name}) as Flag[];
            if (flags.length === 1) {
                let flag = flags[0];
                if (room.find(FIND_CONSTRUCTION_SITES, {filter: (c: ConstructionSite) => c.structureType === STRUCTURE_SPAWN}).length > 0) {
                    flag.remove();
                } else {
                    let spawnPos = PrayerLib.getSpawn1Pos(room, flag.pos);
                    BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
                }
            } else
            if (room.storage !== undefined) {
                let spawnPos = PrayerLib.getSpawn1Pos(room, room.storage.pos);
                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
            }
        } else
        if (spawn instanceof StructureSpawn) {
            let spawnPos = spawn.pos;
            if (room.controller.level >= 4 && room.storage === undefined) {
                let storagePos = PrayerLib.getStoragePos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, storagePos, 0, 0, true, false);
            }
            if (room.controller.level >= 6 && room.terminal === undefined) {
                let terminalPos = PrayerLib.getTerminalPos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, terminalPos, 0, 0, true, false);
            }
            if (room.controller.level === 6 && room.storage !== undefined) {
                let labPos = PrayerLib.getLabPos(room, room.storage.pos);
                BuildLib.buildIfNotPresent(STRUCTURE_LAB, labPos, 0, 0, true, false);
            }

            if (room.controller.level > 5) {
                buildRampartsOnImportantBuildings(room);
            }

            if (room.controller.level === 7 && room.memory.doublepraiser === true) {
                let spawn2pos = PrayerLib.getSpawn2Pos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawn2pos, 0, 0, true, false);
                let containerpos = PrayerLib.getContainerPos(room, spawnPos);
                BuildLib.buildIfNotPresent(STRUCTURE_CONTAINER, containerpos, 0, 0, true, false);
            }
        }
    }


    private orderRoomClaimer(room: Room, targetRoom: string): void {
        let maxTier = ProfileUtilities.getMaxTierClaimer(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 1);
        let currentTiers = this.creepService.getNumberOfTiers(Role.RoomClaimer, targetRoom);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.RoomClaimer, targetRoom);
        let neededTiers = 1;

        if (neededTiers > currentTiers + orderedTiers) {
            let order = new Order();
            order.body = ProfileUtilities.getClaimerBody(usedTier);
            order.priority = Priority.Critical;
            order.memory = {role: Role.RoomClaimer, target: targetRoom, tier: usedTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderPraiserHaulers(room: Room, targetRoom: string): void {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(Role.PraiserHauler, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PraiserHauler, targetRoom);
        let needed = 10;
        let praiseRoom = Game.rooms[targetRoom];
        if (room.storage !== undefined && praiseRoom !== undefined && praiseRoom.controller !== undefined) {
            needed = Math.ceil(PathfindingUtilities.getDistanseBetween(room.storage.pos, praiseRoom.controller.pos) / 5);
        }

        if (needed > current + ordered) {
            let order = new Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.PraiserHauler, target: targetRoom, tier: maxTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderPraiserLeader(room: Room, targetRoom: string): void {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(Role.PraiserLeader, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PraiserLeader, targetRoom);

        if (current + ordered === 0) {
            let order = new Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = Priority.Important;
            order.memory = {role: Role.PraiserLeader, target: targetRoom, tier: maxTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderPraiserOfficer(room: Room, targetRoom: string): void {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(Role.PraiserOfficer, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PraiserOfficer, targetRoom);

        if (current + ordered === 0) {
            let order = new Order();
            order.body = ProfileUtilities.getHaulerBody(maxTier);
            order.priority = Priority.Important;
            order.memory = {role: Role.PraiserOfficer, target: targetRoom, tier: maxTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderPraisers(room: Room, targetRoom: string, needed: number): void {
        let current = this.creepService.getCreeps(Role.Praiser, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.Praiser, targetRoom);

        if (needed > current + ordered) {
            let order = new Order();
            order.body = ProfileUtilities.getPraiserBody();
            order.priority = Priority.Important;
            order.memory = {role: Role.Praiser, target: targetRoom, tier: 1};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderPraiserSupporters(room: Room, targetRoom: string): void {
        let current = this.creepService.getCreeps(Role.PraiserSupport, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PraiserSupport, targetRoom);

        if (7 > current + ordered) {
            let order = new Order();
            order.body = ProfileUtilities.getPraiserBody();
            order.priority = Priority.Standard;
            order.memory = {role: Role.PraiserSupport, target: targetRoom, tier: 1};

            OrdersRepository.orderCreep(room, order);
        }
    }
}

function buildRampartsOnImportantBuildings(room: Room) {
    let spawn1 = room.getSpawn();
    if (spawn1 === undefined) {
        return;
    }
    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn1.pos, 0, 0, true, false);
    if (room.storage === undefined) {
        return;
    }
    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.storage.pos, 0, 0, true, false);

    if (room.terminal !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.terminal.pos, 0, 0, true, false);
    }

    let lab = PrayerLib.getBoosterLab(room, room.storage.pos);
    if (lab !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, lab.pos, 0, 0, true, false);
    }

    let spawn2 = PrayerLib.getSpawn2(room, spawn1.pos);
    if (spawn2 !== undefined) {
        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn2.pos, 0, 0, true, false);
    }
}



/**
The PraiseManager is responsive for rooms used to praise GCL (energy -> GCL).

Phases:
- Establishing
  Pushes the room up to RCL 6, and builds a spawn, terminal, lab and storage.
  Also establishes defenses, towers and ramparts on all buildings and along the border.
  Uses a container up to lvl 4, and then the storage. Energy is hauled from a neighbouring room. (RCL 8)
  Builders are built in the neighbouring room.
- Praising
  Uses 7 max size upgraders and a single hauler for moving energy
  RCL 1-5: Also uses haulers to move energy into the room
  RCL 6-7: Energy is sent by the terminal
- Preparing reset
  Upgraders are dismissed, and energy is maxed in storage and terminal.
  When the room is full of energy (1250 000), the room is unclaimed.
- Reestablishing
  Claims the room, and sends upgraders, hauler etc

  Energy needed (only RCL) for
  lvl 4 (storage): 180 000
  lvl 6 (terminal): 1800 000
  lvl 8 (reestablishing): 16 380 000 (about double if we boost)

Praise per tick: 36*7 = 252 (504 with boost)
Price for upgraders: 4150 (3 per tick), 20 per tick for all

Ticks to get to lvl 4: 800 ticks
Ticks to get to lvl 6: 8000 ticks
Ticks before reestablishing: 75 000 ticks (4-5 days)

 */
