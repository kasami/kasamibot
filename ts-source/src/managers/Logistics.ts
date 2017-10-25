import {Manager, ManagerPriority} from "../managers/_Manager";

import * as ProfileUtilities from "../utilities/Profiles";

import * as BaseHauler from "../roles/BaseHauler";
import * as BaseCourier from "../roles/BaseCourier";


import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Order} from "../classes/Order";

import {Role} from "../enums/role";
import {RoomLevel} from "../enums/roomlevel";
import {Priority} from "../enums/priority";

export class LogisticsManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    public constructor(roomService: RoomService, creepService: CreepService) {
        super("LogisticsManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            this.creepService.runCreeps(Role.BaseHauler, BaseHauler.run);
            this.creepService.runCreeps(Role.BaseCourier, BaseCourier.run);

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                this.orderTransportUnits(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private orderTransportUnits(rooms: Room[]) {
        for (let room of rooms) {
            if (this.shouldOrderBaseCourier(room)) {
                this.orderBaseCourier(room);
            }
            if (this.shouldOrderBaseHaulers(room)) {
                this.orderBaseHauler(room);
            }
        }
    }

    private shouldOrderBaseCourier (room: Room): boolean {
        if (RoomRepository.getRoomLevel(room) < RoomLevel.AdvancedColony) {
            return false;
        }
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.BaseCourier, room.name);
        let active = this.creepService.getCreeps(Role.BaseCourier, room.name);
        if (ordered + active.length > 0) {
            if (ordered === 0 && active.length === 1 && active[0].ticksToLive < 100) {
                return true;
            }
            return false;
        }
        return true;
    }
    private shouldOrderBaseHaulers (room: Room): boolean {
        if (room.isExpansion() || RoomRepository.getRoomLevel(room) < RoomLevel.DefendedColony) {
            return false;
        }
        if (room.storage === undefined || !room.storage.isActive()) {
            let baseContainer = room.getBaseContainer();
            if (baseContainer === undefined) {
                return false;
            }
        }
        let orderedbaseHaulers = OrdersRepository.getCreepsInQueue(room, Role.BaseHauler, room.name);
        let activeBaseHaulers = this.creepService.getCreeps(Role.BaseHauler, room.name);
        if (room.isUnderSiege() && (orderedbaseHaulers + activeBaseHaulers.length) < 2 && room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            return true;
        }
        if (orderedbaseHaulers > 0) {
            if (activeBaseHaulers.length === 0 && orderedbaseHaulers < 2 && OrdersRepository.orderedBaseHaulerIsTooExpensive(room)) {
                return true;
            }
            return false;
        }
        if (RoomRepository.getRoomLevel(room) === RoomLevel.CivilizedColony && room.storage !== undefined &&
        room.storage.store[RESOURCE_ENERGY] > 200000 && activeBaseHaulers.length < 2) {
            return true;
        }
        if (activeBaseHaulers.length > 0) {
            if (activeBaseHaulers[0].ticksToLive < 200 && activeBaseHaulers.length === 1) {
                return true;
            }
            return false;
        }
        return true;
    }

    private orderBaseHauler(room: Room): void {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let usedTier = maxTier;
        let count = this.creepService.getCreeps(Role.BaseHauler, room.name).length;

        if (count === 0) {
            usedTier = ProfileUtilities.getMaxTierHauler(room.energyAvailable);
            if (usedTier < 1) {
                usedTier = 1;
            }
        }

        let order = new Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);

        if (count > 0 && room.isUnderSiege()) {
            order.priority = Priority.Important;

        } else
        if (room.storage === undefined) {
            order.priority = Priority.Low;
        }
        else {
            order.priority = Priority.Blocker;
        }
        order.memory =  {role: Role.BaseHauler, target: room.name, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderBaseCourier(room: Room): void {
        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
        let usedTier = Math.ceil(maxTier / 2);

        let order = new Order();
        order.body = ProfileUtilities.getHaulerBody(usedTier);
        order.priority = Priority.Important;
        order.memory =  {role: Role.BaseCourier, target: room.name, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }
}
