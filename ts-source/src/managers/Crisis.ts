import * as ProfileUtilities from "../utilities/Profiles";

import * as OrdersRepository from "../repository/Orders";

import * as Pioneer from "../roles/Pioneer";

import * as OperationLib from "../lib/operation";

import * as RoomRepository from "../repository/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {Order} from "../classes/Order";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import {log} from "../tools/Logger";

export class CrisisManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    private hasRun = false;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("CrisisManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 500 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    this.checkIfRoomNeedsEnergyConvoy(room);
                    checkIfRoomSeemsDead(room);
                    this.checkIfWeNeedPioneer(room);
                    if (Memory.settings.bot === true) {
                        this.checkIfRoomShouldBeAbandoned(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        } else
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.Pioneer, Pioneer.run);
        } else
        if (pri === ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    this.checkIfRoomNeedsEnergyConvoy(room);
                    checkIfRoomSeemsDead(room);
                    this.checkIfWeNeedPioneer(room);
                    if (Memory.settings.bot === true) {
                        this.checkIfRoomShouldBeAbandoned(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        }
    }

    private checkIfRoomShouldBeAbandoned(room: Room) {
        let level = RoomRepository.getRoomLevel(room);
        if (level === RoomLevel.Metropolis) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 7) {
                log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        } else
        if (level === RoomLevel.City) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 5) {
                log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        } else
        if (level >= RoomLevel.CivilizedColony) {
            if (RoomRepository.getNumberOfSourcesMined(room) < 3) {
                log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
                this.abandonRoom(room);
                return;
            }
        }
    }

    private abandonRoom(room: Room) {
        if (room.controller === undefined) {
            return;
        }
        let creepsInRoom = room.find(FIND_MY_CREEPS) as Creep[];
        for (let c of creepsInRoom) {
            c.suicide();
        }
        room.memory.badExpansion = true;
        room.controller.unclaim();
    }

    private checkIfWeNeedPioneer(room: Room): void {
        if (room.isExpansion()) {
            return;
        }
        let spawnedPioneers = this.creepService.getCreeps(Role.Pioneer, null, room.name).length;
        let orderedPioneers = OrdersRepository.getCreepsInQueue(room, Role.Pioneer, room.name);
        let spawnedMiners = this.creepService.getCreeps(Role.ContainerMiner, null, room.name).length;
        let spawnedHaulers = this.creepService.getCreeps(Role.ContainerHauler, null, room.name).length +
            this.creepService.getCreeps(Role.EnergyHauler, null, room.name).length;

        if (RoomRepository.getAllOutposts(room).length === 0) {
            return;
        }

        if (spawnedPioneers < 3 && orderedPioneers === 0 && spawnedMiners < 2 && spawnedHaulers < 2) {
            orderPioneer(room);
            let expansionWorkers = this.creepService.getCreeps(Role.ExpansionWorker, null, room.name).length;
            if (expansionWorkers === 0) {
                this.requestExpansionWorker(room);
            }
        } else
        if (room.getBaseContainer() === undefined && (room.storage === undefined || !room.storage.isActive()) &&
            (room.terminal === undefined || !room.terminal.isActive())){
                let expansionWorkers = this.creepService.getCreeps(Role.ExpansionWorker, null, room.name).length;
                if (expansionWorkers < 2) {
                    this.requestExpansionWorker(room);
                }
        }
    }

    private requestExpansionWorker(room: Room) {
        let providerRoom: Room | undefined;
        let distance: number | undefined;
        let allRooms = this.roomService.getNormalRooms();
        for (let r of allRooms) {
            if (r.name !== room.name) {
                let d = Game.map.getRoomLinearDistance(room.name, r.name);
                if (distance === undefined || d < distance) {
                    providerRoom = r;
                    distance = d;
                }
            }
        }
        if (providerRoom !== undefined) {
            this.orderExpansionWorker(providerRoom, room.name);
        }
    }

    private orderExpansionWorker(room: Room, targetRoom: string): void {
        let maxTier = ProfileUtilities.getMaxTierHaulerEngineer(room.energyCapacityAvailable);
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.ExpansionWorker, targetRoom);

        if (ordered === 0) {
            let order = new Order();
            order.body = ProfileUtilities.getHaulerEngineerBody(maxTier);
            order.priority = Priority.Low;
            order.memory = {role: Role.ExpansionWorker, target: targetRoom, tier: maxTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private checkIfRoomNeedsEnergyConvoy(room: Room) {
        let level = RoomRepository.getRoomLevel(room);
        if (level >= RoomLevel.CivilizedColony && (room.terminal === undefined || !room.terminal.isActive()) &&
        room.storage !== undefined && room.storage.isActive() && room.storage.store[RESOURCE_ENERGY] < 10000 &&
        !OperationLib.roomIsReceiveingHaulOperation(room.name)) {
            OperationLib.createCrisisHaulOperation(room.name, this.roomService.getNormalRooms());
        }
    }
}

function orderPioneer(room: Room): void {
    let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyAvailable);

    if (maxTier < 1) {
        return;
    }

    let order = new Order();
    order.body = ProfileUtilities.getEngineerBody(maxTier);
    order.priority = Priority.Blocker;
    order.memory = {role: Role.Pioneer, target: room.name, tier: maxTier};

    OrdersRepository.orderCreep(room, order);
}

function checkIfRoomSeemsDead(room: Room) {
    let creepsInRoom = room.find(FIND_MY_CREEPS) as Creep[];
    if (creepsInRoom.length < 2 && RoomRepository.getRoomLevel(room) >= RoomLevel.BasicColonyReadyForExpansion) {
        OrdersRepository.clearOrders(room);
    }
}
