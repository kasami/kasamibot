import * as SourceUtilities from "../utilities/Source";
import * as ProfileUtilities from "../utilities/Profiles";


import * as ContainerHauler from "../roles/ContainerHauler";
import * as EnergyHauler from "../roles/EnergyHauler";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

import {Order} from "../classes/Order";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import {log} from "../tools/Logger";

export class HaulingManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("HaulingManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.ContainerHauler, ContainerHauler.run);
            this.creepService.runCreeps(Role.EnergyHauler, EnergyHauler.run);
            this.creepService.runCreeps(Role.SKHauler, ContainerHauler.run);

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                for (let room of rooms) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.City) {
                        this.organizeEnergyHauling(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }

    private organizeEnergyHauling(room: Room) {
        let activeHaulers = this.creepService.getCreeps(Role.EnergyHauler, null, room.name);
        let sourcesIds = SourceUtilities.getSourcesNeedingHauling(room);

        let sourcesBeingServiced: string[] = [];
        for (let h of activeHaulers) {
            if (h.memory.target !== undefined) {
                sourcesBeingServiced.push(h.memory.target);
            }
        }
        room.memory.dumpSources = _.difference(sourcesIds, sourcesBeingServiced);

        let orderedHaulers = OrdersRepository.getCreepsInQueue(room, Role.EnergyHauler);

        if (orderedHaulers < 2) {
            let currentIdleHaulers = this.creepService.getIdleEnergyHaulers(room.name).length;
            if (currentIdleHaulers === 0) {
                if (room.memory.dumpSources !== undefined && room.memory.dumpSources.length > 0) {
                    orderEnergyhauler(room);
                }
            }
            if (Memory.settings.logEnergyhauling) {
                log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length + " (" + currentIdleHaulers + " idle)", room.name);
            }
        } else {
            if (Memory.settings.logEnergyhauling) {
                log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length, room.name);
            }
        }
    }
}

function orderEnergyhauler(room: Room) {
    let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);

    let order = new Order();
    order.body = ProfileUtilities.getHaulerBody(maxTier);
    order.priority = Priority.Standard;
    if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 10000) {
        order.priority = Priority.Important;
    }
    order.memory = {role: Role.EnergyHauler, target: undefined, tier: maxTier};

    OrdersRepository.orderCreep(room, order);
}
