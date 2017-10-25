import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as OrdersRepository from "../repository/Orders";

import * as ProfileUtilities from "../utilities/Profiles";

import {Order} from "../classes/Order";

import * as RoomLib from "../lib/room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import * as Janitor from "../roles/Janitor";

export class MaintainenceManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("MaintainenceManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.Janitor, Janitor.run);
        } else
        if (pri === ManagerPriority.Low) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
            let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (RoomLib.roomShouldHaveJanitors(room)) {
                        this.orderJanitor(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private orderJanitor(room: Room): void {
        let ordered = OrdersRepository.getNumberOfTiersInQueue(room, Role.Janitor, room.name);
        let spawned = this.creepService.getNumberOfTiers(Role.Janitor, room.name)
        if (ordered + spawned > 0) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierDistanceWorker(room.energyCapacityAvailable);

        let order = new Order();
        order.body = ProfileUtilities.getDistanceWorkerBody(maxTier);
        order.priority = Priority.Important;
        order.memory = {role: Role.Janitor, target: room.name, tier: maxTier};

        OrdersRepository.orderCreep(room, order);
    }
}


