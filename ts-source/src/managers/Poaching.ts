import * as ProfileUtilities from "../utilities/Profiles";
import * as PathfindingUtilities from "../utilities/Pathfinding";
import * as OrdersRepository from "../repository/Orders";

import * as PoachGuard from "../roles/PoachGuard";
import * as PoachMiner from "../roles/PoachMiner";
import * as PoachHauler from "../roles/PoachHauler";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as IntelLib from "../lib/intel";

import {Order} from "../classes/Order";

import * as RoomRepository from "../repository/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";
import {Hostility} from "../enums/hostility";

import {log} from "../tools/Logger";

export class PoachingManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";
    readonly MEMORY_LASTRUNBOT = "lastRunBot";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("PoachingManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (Memory.settings.slow === true) {
            return;
        }

        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.PoachGuard, PoachGuard.run);
        } else
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.PoachHauler, PoachHauler.run);
            this.creepService.runCreeps(Role.PoachMiner, PoachMiner.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 50 < Game.time) {
                let rooms = this.roomService.getNormalRoomsNotAbandoned();
                for (let room of rooms) {
                    if (room.memory.poaching !== undefined && !room.isUnderSiege() && RoomRepository.getRoomLevel(room) >= RoomLevel.City) {
                        this.runPoaching(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
        if (pri === ManagerPriority.Trivial) {
            if (Memory.settings.bot === true) {
                let lastRunBot = this.getValue(this.MEMORY_LASTRUNBOT);
                if (lastRunBot === undefined || lastRunBot + 500 < Game.time) {
                    let rooms = this.roomService.getNormalRoomsNotAbandoned();
                    for (let room of rooms) {
                        if (RoomRepository.getRoomLevel(room) >= RoomLevel.City && !room.isUnderSiege()) {
                            this.setBotPoachingRoom(room);
                        }
                    }
                    this.setValue(this.MEMORY_LASTRUNBOT, Game.time);
                }
            }
        }
    }

    runPoaching(room: Room) {
        for (let outpost of room.memory.poaching as string[]) {
            let o = Game.rooms[outpost];
            if (o !== undefined) {
                let mineral = o.getMineral();
                if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
                room.storage !== undefined && (room.storage.store[mineral.mineralType] === undefined || room.storage.store[mineral.mineralType] < 250000) &&
                _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
                    let guards = this.creepService.getCreeps(Role.PoachGuard, outpost).length;
                    if (guards > 0) {
                        this.orderPoachMiners(room, mineral);
                        this.orderPoachHaulers(room, mineral);
                    } else {
                        this.orderPoachGuard(room, outpost);
                    }
                }
            } else {
                let intelTime = IntelLib.intelTime(outpost);
                let mineralTicks = IntelLib.mineralTicks(outpost);
                if (intelTime === undefined || mineralTicks === undefined || (intelTime + mineralTicks < Game.time)) {
                    this.orderPoachGuard(room, outpost);
                }
            }
        }
    }

    setBotPoachingRoom(room: Room) {
        if (room.memory.poaching !== undefined && room.memory.poaching.length > 0) {
            this.checkIfPoachIsFinished(room);
        }
        if (room.memory.poaching === undefined || room.memory.poaching.length === 0) {
            this.checkIfWeCanPoach(room);
        }

    }

    checkIfPoachIsFinished(room: Room) {
        for (let outpost of room.memory.poaching as string[]) {
            let intelTime = IntelLib.intelTime(outpost);
            let mineralTicks = IntelLib.mineralTicks(outpost);
            if (intelTime !== undefined && mineralTicks !== undefined) {
                log.info("Poaching of minerals in room " + outpost + " seems to be finished. Removing it from list.", room.name);
                room.memory.poaching = undefined;
                return;
            }
        }
    }

    checkIfWeCanPoach(room: Room) {
        if (room.memory.neighbours === undefined || room.memory.neighbours.twoAway === undefined || room.memory.neighbours.threeAway === undefined) {
            return;
        }
        let secondNeighbours = _.filter(room.memory.neighbours.twoAway, (r: string) => RoomRepository.isMiddleRoom(r));
        let thirdNeighbours = _.filter(room.memory.neighbours.threeAway, (r: string) => RoomRepository.isMiddleRoom(r));
        let potNeighbours = secondNeighbours.concat(thirdNeighbours);
        if (potNeighbours.length === 0) {
            return;
        }
        let allOutposts = RoomRepository.getAllOutpostsInAllRooms(this.roomService.getNormalRooms());
        let allPoachrooms = RoomRepository.getAllPoachroomsInAllRooms(this.roomService.getNormalRooms());
        let possiblePoachrooms = _.filter(potNeighbours, (r: string) => !_.contains(allOutposts, r) && !_.contains(allPoachrooms, r));
        if (possiblePoachrooms.length === 0) {
            return;
        }
        for (let possibleRoom of possiblePoachrooms) {
            let intelTime = IntelLib.intelTime(possibleRoom);
            let mineralTicks = IntelLib.mineralTicks(possibleRoom);
            let hostility = IntelLib.roomHostility(possibleRoom);
            if (hostility < Hostility.HarmlessHostiles && intelTime !== undefined && (mineralTicks === undefined || (intelTime + mineralTicks < Game.time))) {
                log.alert("Poaching of minerals in room " + possibleRoom + " started. ", room.name);
                room.memory.poaching = [possibleRoom];
                return;
            }
        }

    }

    orderPoachHaulers(room: Room, mineral: Mineral) {
        if (room.storage === undefined) {
            return;
        }
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.PoachHauler, mineral.id);
        let currentMiners = this.creepService.getCreeps(Role.PoachMiner, mineral.id).length;

        if (orderedTiers > 0 || currentMiners === 0) {
            return;
        }

        let currentTiers = this.creepService.getNumberOfTiers(Role.PoachHauler, mineral.id);
        let wantedTiers = Math.ceil(currentMiners * 2.5 * PathfindingUtilities.getDistanseBetween(room.storage.pos, mineral.pos) / 10);

        if (orderedTiers + currentTiers >= wantedTiers) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierOffroadHauler(room.energyCapacityAvailable);

        let order = new Order();
        order.body = ProfileUtilities.getOffroadHaulerBody(maxTier);
        order.priority = Priority.Standard;
        order.memory = {role: Role.PoachHauler, target: mineral.id, tier: maxTier};

        OrdersRepository.orderCreep(room, order);
    }

    orderPoachMiners(room: Room, mineral: Mineral) {
        let wanted = Math.min(mineral.getMiningPositions().length, 3);
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PoachMiner, mineral.id);
        let current = this.creepService.getCreeps(Role.PoachMiner, mineral.id).length;

        if (ordered > 0 || current + ordered >= wanted) {
            return;
        }

        let order = new Order();
        order.body = ProfileUtilities.getPoachMinerBody();
        order.priority = Priority.Standard;
        order.memory = {role: Role.PoachMiner, target: mineral.id, tier: 1};

        OrdersRepository.orderCreep(room, order);
    }

    orderPoachGuard(room: Room, targetRoom: string) {
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.PoachGuard, targetRoom);
        if (ordered > 0) {
            return;
        }

        let currentCreeps = this.creepService.getCreeps(Role.PoachGuard, targetRoom).length;
        if (currentCreeps > 0) {
            return;
        }
        let guardOrder = new Order();
        guardOrder.body = ProfileUtilities.getPoachGuardBody();
        guardOrder.priority = Priority.Critical;
        guardOrder.memory = {role: Role.PoachGuard, target: targetRoom, tier: 1};

        OrdersRepository.orderCreep(room, guardOrder);
    }
}
