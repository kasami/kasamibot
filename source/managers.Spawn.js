"use strict";
const _Manager_1 = require("./managers._Manager");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const OrdersUtilities = require("./utilities.Orders");
const ProfileUtilities = require("./utilities.Profiles");
const Logger_1 = require("./tools.Logger");
const RoomRepository = require("./repository.Room");
const ExtensionLib = require("./lib.extension");
class SpawnManager extends _Manager_1.Manager {
    constructor(roomService) {
        super("SpawnManager");
        this.roomService = roomService;
    }
    run() {
        let rooms = this.roomService.getNormalRooms();
        for (let room of rooms) {
            let spawns = _.filter(room.getSpawns(), function (s) { return !s.spawning; });
            if (spawns.length > 0) {
                this.processQueue(room, spawns);
            }
        }
    }
    processQueue(room, spawns) {
        if (room.memory.orders === undefined) {
            room.memory.orders = [];
            return;
        }
        let spawn = spawns[0];
        if (spawns.length === 0 || spawn.spawning || room.memory.orders.length === 0) {
            return;
        }
        room.memory.orders.sort(function (a, b) {
            return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0);
        });
        let order = room.memory.orders.shift();
        if (order.twinOrder !== undefined) {
            if ((spawns.length < 2 || spawns[1] === undefined || spawns[1].spawning) && room.controller !== undefined && room.controller.level > 6) {
                room.memory.orders.unshift(order);
                return;
            }
            let twinSpawn = spawns[0];
            let name = OrdersUtilities.makeRoleName(order.twinOrder.memory.role) + "-" + "T" + order.twinOrder.memory.tier + "-" + OrdersUtilities.makeRandomCreepId();
            let response = twinSpawn.spawnCreep(order.twinOrder.body, name, { memory: order.twinOrder.memory, energyStructures: this.getEnergyStructures(room) });
            if (response < 0) {
                room.memory.orders.unshift(order);
                return;
            }
            else {
                if (Memory.stats['room.' + room.name + '.creepCost'] !== undefined) {
                    Memory.stats['room.' + room.name + '.creepCost'] += ProfileUtilities.getCostForBody(order.twinOrder.body);
                }
                Logger_1.log.info("Spawned: " + role_1.Role[Game.creeps[name].memory.role] + " T" + order.twinOrder.memory.tier + " (" + Game.creeps[name].memory.target + ") - " + name, room.name);
            }
            order.twinOrder = undefined;
            order.priority = priority_1.Priority.Blocker;
            room.memory.orders.unshift(order);
            return;
        }
        let name = OrdersUtilities.makeRoleName(order.memory.role) + "-" + "T" + order.memory.tier + "-" + OrdersUtilities.makeRandomCreepId();
        if (room.name !== spawn.room.name) {
            order.memory.homeroom = room.name;
        }
        let response = spawn.spawnCreep(order.body, name, { memory: order.memory, energyStructures: this.getEnergyStructures(room) });
        if (response < 0) {
            room.memory.orders.unshift(order);
        }
        else {
            if (room.name === spawn.room.name) {
                if (Memory.stats['room.' + room.name + '.creepCost'] !== undefined) {
                    Memory.stats['room.' + room.name + '.creepCost'] += ProfileUtilities.getCostForBody(order.body);
                }
                Logger_1.log.info("Spawned: " + role_1.Role[Game.creeps[name].memory.role] + " T" + order.memory.tier + " (" + Game.creeps[name].memory.target + ") - " + name, spawn.room.name);
            }
            else {
                Logger_1.log.info("Spawned: For " + room.name + " " +
                    role_1.Role[Game.creeps[name].memory.role] + " T" + order.memory.tier + " (" + Game.creeps[name].memory.target + ") - " +
                    name, spawn.room.name);
            }
        }
    }
    getEnergyStructures(room) {
        let basePosition = RoomRepository.getBasePosition(room);
        if (basePosition === undefined) {
            return undefined;
        }
        if (room.memory.energyStructureCache === undefined || room.memory.energyStructureTimestamp === undefined ||
            room.memory.energyStructureTimestamp + 50 < Game.time) {
            let spawn = room.find(FIND_MY_SPAWNS);
            let extensions = ExtensionLib.getExtensions(room, basePosition);
            let energyStructures = spawn.concat(extensions);
            room.memory.energyStructureCache = JSON.stringify(_.map(energyStructures, (s) => s.id));
            room.memory.energyStructureTimestamp = Game.time;
            return energyStructures;
        }
        let ids = JSON.parse(room.memory.energyStructureCache);
        let structures = _.filter(_.map(ids, (s) => Game.getObjectById(s)), (a) => a !== null);
        return structures;
    }
}
exports.SpawnManager = SpawnManager;
