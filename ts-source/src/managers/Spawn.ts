import {Manager} from "../managers/_Manager";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";

import {Order}  from "../classes/Order";

import * as OrdersUtilities from "../utilities/Orders";
import * as ProfileUtilities from "../utilities/Profiles";

import {log} from "../tools/Logger";

import * as RoomRepository from "../repository/Room";

import * as ExtensionLib from "../lib/extension";

import {RoomService} from "../services/Room";

export class SpawnManager extends Manager {

    private roomService: RoomService;

    constructor(roomService: RoomService) {
        super("SpawnManager");
        this.roomService = roomService;
    }

    public run (): void {
        let rooms = this.roomService.getNormalRooms();
        for (let room of rooms) {
            let spawns = _.filter(room.getSpawns(), function (s: Spawn) { return !s.spawning;});

            if (spawns.length > 0) {
                this.processQueue(room, spawns);
            }
        }
    }

    private processQueue(room: Room, spawns: Spawn[]): void {

        if (room.memory.orders === undefined) {
            room.memory.orders = [];
            return;
        }

        let spawn = spawns[0];

        if (spawns.length === 0 || spawn.spawning || room.memory.orders.length === 0) {
            return;
        }

        room.memory.orders.sort(
            function(a: Order, b: Order) {
                return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0);
            });

        let order = room.memory.orders.shift() as Order;

        if (order.twinOrder !== undefined) {
            if ((spawns.length < 2 || spawns[1] === undefined || spawns[1].spawning) && room.controller !== undefined && room.controller.level > 6) {
                room.memory.orders.unshift(order);
                return;
            }
            let twinSpawn = spawns[0];
            let name = OrdersUtilities.makeRoleName(order.twinOrder.memory.role) + "-" + "T" + order.twinOrder.memory.tier + "-" + OrdersUtilities.makeRandomCreepId();

            let response = twinSpawn.spawnCreep(order.twinOrder.body, name, {memory: order.twinOrder.memory, energyStructures: this.getEnergyStructures(room)})
            //let response = twinSpawn.createCreep(order.twinOrder.body, name, order.twinOrder.memory);

            if (response < 0) {
                room.memory.orders.unshift(order);
                return;
            } else {
                if (Memory.stats['room.' + room.name + '.creepCost'] !== undefined) {
                    Memory.stats['room.' + room.name + '.creepCost'] += ProfileUtilities.getCostForBody(order.twinOrder.body);
                }
                log.info("Spawned: " + Role[Game.creeps[name].memory.role] + " T" + order.twinOrder.memory.tier + " (" + Game.creeps[name].memory.target + ") - " + name, room.name);
            }
            order.twinOrder = undefined;
            order.priority = Priority.Blocker;
            room.memory.orders.unshift(order);
            return;
        }

        let name = OrdersUtilities.makeRoleName(order.memory.role) + "-" + "T" + order.memory.tier + "-" + OrdersUtilities.makeRandomCreepId();
        if (room.name !== spawn.room.name) {
            order.memory.homeroom = room.name;
        }
        let response = spawn.spawnCreep(order.body, name, {memory: order.memory, energyStructures: this.getEnergyStructures(room)})
        //let response = spawn.createCreep(order.body, name, order.memory);

        if (response < 0) {
            room.memory.orders.unshift(order);
        } else {
            if (room.name === spawn.room.name) {
                if (Memory.stats['room.' + room.name + '.creepCost'] !== undefined) {
                    Memory.stats['room.' + room.name + '.creepCost'] += ProfileUtilities.getCostForBody(order.body);
                }
                log.info("Spawned: " + Role[Game.creeps[name].memory.role] + " T" + order.memory.tier + " (" + Game.creeps[name].memory.target + ") - " + name, spawn.room.name);
            } else {
                log.info("Spawned: For " + room.name + " " +
                    Role[Game.creeps[name].memory.role] + " T" + order.memory.tier + " (" + Game.creeps[name].memory.target + ") - " +
                    name, spawn.room.name);

            }
        }
    }

    private getEnergyStructures(room: Room): Structure[] | undefined {
        let basePosition = RoomRepository.getBasePosition(room);
        if (basePosition === undefined) {
            return undefined;
        }

        if (room.memory.energyStructureCache === undefined || room.memory.energyStructureTimestamp === undefined ||
        room.memory.energyStructureTimestamp + 50 < Game.time) {
            let spawn = room.find(FIND_MY_SPAWNS) as Structure[];
            let extensions = ExtensionLib.getExtensions(room, basePosition);
            let energyStructures = spawn.concat(extensions);
            room.memory.energyStructureCache = JSON.stringify(_.map(energyStructures, (s: Structure) => s.id));
            room.memory.energyStructureTimestamp = Game.time;
            return energyStructures;
        }

        let ids = JSON.parse(room.memory.energyStructureCache) as string[];
        let structures = _.filter(_.map(ids, (s: string) => Game.getObjectById(s)), (a: Structure | null) => a !== null) as Structure[];
        return structures;
    }
}
