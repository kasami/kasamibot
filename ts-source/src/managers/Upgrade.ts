import {Manager, ManagerPriority} from "../managers/_Manager";

import * as ProfileUtilities from "../utilities/Profiles";
import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as Upgrader from "../roles/Upgrader";
import * as UpgraderHauler from "../roles/UpgraderHauler";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Order} from "../classes/Order";

import * as EnergyLib from "../lib/energy";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

export class UpgradeManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("UpgradeManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            this.creepService.runCreeps(Role.UpgraderWithBoost, Upgrader.run);
        } else
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.UpgraderWithoutBoost, Upgrader.run);
            this.creepService.runCreeps(Role.UpgraderHauler, UpgraderHauler.run);

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                this.setPraiseBoosting(rooms);
                this.buildUpgradeStorage(rooms);
                this.orderUpgradeUnits(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private setPraiseBoosting(rooms: Room[]) {
        if (Memory.settings.slow === true) {
            return;
        }
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned() || room.isExpansion()) continue;

            if (room.controller.my && room.controller.level < 8 && room.storage !== undefined) {
                if (room.storage.store[RESOURCE_ENERGY] > 300000 && room.memory.praiseBoost !== true) {
                    console.log("Automatic praiseboost started in room: " + room.name);
                    room.memory.praiseBoost = true;
                    room.memory.praiseBoostAutomatic = true;
                } else
                if (room.storage.store[RESOURCE_ENERGY] < 100000 && room.memory.praiseBoost === true && room.memory.praiseBoostAutomatic === true) {
                    console.log("Automatic praiseboost stopped in room: " + room.name);
                    room.memory.praiseBoost = undefined;
                    room.memory.praiseBoostAutomatic = undefined;
                }
            } else
            if (room.controller.my && room.controller.level === 8 && room.memory.praiseBoost === true) {
                room.memory.praiseBoost = undefined;
                room.memory.praiseBoostAutomatic = undefined;
            }
        }
    }

    private buildUpgradeStorage(rooms: Room[]) {
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned()) continue;

            if (RoomRepository.getRoomLevel(room) >= RoomLevel.SimpleColonyReadyForExpansion && RoomRepository.getRoomLevel(room) < RoomLevel.AdvancedColony) {
                room.controller.buildControllerContainer();
            } else if (RoomRepository.getRoomLevel(room) >= RoomLevel.AdvancedColony) {
                room.controller.buildControllerLink();
            }
        }
    }

    private orderUpgradeUnits(rooms: Room[]) {
        for (let room of rooms) {
            if (room.controller === undefined || room.isAbandoned() || room.isExpansion()) continue;

            if (RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony && (room.controller.hasContainer() || room.controller.hasLink())) {
                this.orderUpgraders(room.controller);
            }
            if (room.memory.praiseBoost && room.controller.level < 8) {
                this.orderControllerHauler(room.controller);
            }
        }
    }

    private orderControllerHauler(controller: Controller): void {
        if (controller.room.storage === undefined) {
            return;
        }
        let praisingPerTick = Math.floor(this.creepService.getNumberOfTiers(Role.Upgrader, controller.id) * 2.5);
        let distanceFromStorage = PathfindingUtilities.getDistanseBetween(controller.room.storage.pos, controller.pos);

        let neededTiers = Math.floor((praisingPerTick * distanceFromStorage * 2) / 100);

        let activeUpgraders = this.creepService.getCreeps(Role.Upgrader, null, controller.room.name);
        let activeTiers = this.creepService.getNumberOfTiers(Role.UpgraderHauler, null, controller.room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(controller.room, Role.UpgraderHauler);

        if (activeUpgraders.length > 1 && activeTiers + orderedTiers < neededTiers) {
            let usedTier = Math.max(4, Math.min((neededTiers), ProfileUtilities.getMaxTierHauler(controller.room.energyCapacityAvailable)));

            let order = new Order();
            order.body = ProfileUtilities.getHaulerBody(usedTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.UpgraderHauler, target: controller.id, tier: usedTier};

            OrdersRepository.orderCreep(controller.room, order);
        }
    }

    private orderUpgraders(controller: Controller): void {
        let needed = 1;
        let activeCreeps = this.creepService.getCreeps(Role.Upgrader, controller.id);

        let ordered = OrdersRepository.getCreepsInQueue(controller.room, Role.Upgrader, controller.id);
        if (controller.level === 8) {
            let energyLimit = 200000;
            if (Memory.settings.powerfocus === true) {
                energyLimit = 450000;
            }
            if (controller.ticksToDowngrade < 10000 ||
                (controller.room.storage !== undefined && controller.room.storage.store.energy > energyLimit)) {
                needed = 1;
            } else {
                return;
            }
        } else
        if (controller.room.storage === undefined && EnergyLib.roomIsFull(controller.room)) {
            let controllerContainer = controller.getContainer();
            if (ordered === 0 && controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] > (controllerContainer.storeCapacity / 2)) {
                needed = Math.min(activeCreeps.length + 1, 7);
            }
        } else
        if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] > 200000 && controller.level === 5) {
            needed = 2;
        } else
        if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] < 30000) {
            return;
        }

        let activeWorkerparts = Math.floor(this.creepService.getNumberOfTiers(Role.Upgrader, controller.id) * 2.5);
        let orderedWorkerparts = Math.floor(OrdersRepository.getNumberOfTiersInQueue(controller.room, Role.Upgrader, controller.id) * 2.5);

        let active = activeCreeps.length;
        if (controller.room.storage !== undefined) {
            for (let c of activeCreeps) {
                if (c.ticksToLive !== undefined && c.ticksToLive < 100) {
                    active--;
                }
            }
        }

        let energyInRoom = 0;
        if (controller.room.storage !== undefined) {
            energyInRoom += controller.room.storage.store[RESOURCE_ENERGY];
        }
        if (controller.room.terminal !== undefined) {
            energyInRoom += controller.room.terminal.store[RESOURCE_ENERGY];
        }

        if (controller.room.memory.praiseBoost && controller.level < 8 && energyInRoom > 50000) {
            if (controller.level < 7) {
                needed = 3;
            } else {
                needed = 5;
            }
        }

        if (active + ordered < needed && (activeWorkerparts + orderedWorkerparts < 60 || controller.room.memory.praiseBoost)) {
            let usedTier = ProfileUtilities.getMaxTierStationaryWorker(controller.room.energyCapacityAvailable);

            let boost: string[] | undefined = undefined;
            if (controller.level === 8) {
                usedTier = Math.min(usedTier, 6);
            }

            if (!controller.room.memory.praiseBoost && controller.room.getBoostLab() !== undefined && controller.room.terminal !== undefined &&
            controller.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] >= 1000) {
                boost = [RESOURCE_CATALYZED_GHODIUM_ACID];
            }

            let order = new Order();
            order.body = ProfileUtilities.getStationaryWorkerBody(usedTier);
            order.priority = Priority.Standard;
            if (active > 3) {
                order.priority = Priority.Low;
            }
            order.memory = {role: Role.Upgrader, target: controller.id, tier: usedTier, boost: boost};

            OrdersRepository.orderCreep(controller.room, order);
        }
    }
}
