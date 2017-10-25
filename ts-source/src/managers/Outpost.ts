import * as ProfileUtilities from "../utilities/Profiles";
import * as ScoutingUtilities from "../utilities/Scouting";
import * as PathfindingUtilities from "../utilities/Pathfinding";

import * as RoomRepository from "../repository/Room";
import * as OrdersRepository from "../repository/Orders";

import * as OutpostReserver from "../roles/OutpostReserver";
import * as OutpostDefender from "../roles/OutpostDefender";
import * as OutpostSupporter from "../roles/OutpostSupporter";
import * as OutpostWarrior from "../roles/OutpostWarrior";

import * as IntelLib from "../lib/intel";
import * as RoomLib from "../lib/room";
import * as OperationLib from "../lib/operation";

import {Order} from "../classes/Order";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";


export class OutpostManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";
    readonly MEMORY_LASTRUN_OUTPOSTLIST = "lastRunOutpostList";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("OutpostManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {

            this.creepService.runCreeps(Role.OutpostReserver, OutpostReserver.run);
            this.creepService.runCreeps(Role.OutpostDefender, OutpostDefender.run);
            this.creepService.runCreeps(Role.OutpostSupporter, OutpostSupporter.run);
            this.creepService.runCreeps(Role.OutpostWarrior, OutpostWarrior.run);

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 10 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony || room.isExpansion()) {
                        this.orderOutpostDefenders(room);
                    }

                    if (room.isExpansion()) {
                        continue;
                    }

                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.DefendedColony &&
                    (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] > 500)) {
                        this.orderOutpostReservers(room);

                        this.orderJanitors(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        } else
        if (pri === ManagerPriority.Low) {
            let lastRunOutpostList = this.getValue(this.MEMORY_LASTRUN_OUTPOSTLIST);
            if (lastRunOutpostList === undefined || lastRunOutpostList < Game.time) {
                let updated = false;
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    let result = this.maintainOutpostList(room);
                    if (result && !updated) {
                        updated = true;
                    }
                }
                if (updated) {
                    this.setValue(this.MEMORY_LASTRUN_OUTPOSTLIST, Game.time + 20);
                } else {
                    this.setValue(this.MEMORY_LASTRUN_OUTPOSTLIST, Game.time + 500);
                }
            }
        }
    }

    private orderJanitors(room: Room): void {
        let outposts = RoomRepository.getBasicOutposts(room);
        if (!room.memory.praiseroomHibernated) {
            outposts = outposts.concat(room.memory.praiseroom);
        }
        for (let outpost of outposts) {
            if (IntelLib.hasIntel(outpost) && !IntelLib.hasInvaders(outpost)) {
                let outpostRoom = Game.rooms[outpost];
                if (outpostRoom !== undefined) {
                    let roadcount = outpostRoom.find(FIND_MY_CONSTRUCTION_SITES).length;
                    if (roadcount > 0) {
                        let neededTiers = Math.ceil(roadcount/6);
                        this.orderJanitor(room, neededTiers);
                    }
                }
            }
        }
        let lairs = RoomRepository.getLairOutposts(room);
        for (let outpost of lairs) {
            if (IntelLib.hasIntel(outpost) && !IntelLib.hasInvaders(outpost)) {
                let outpostRoom = Game.rooms[outpost];
                if (outpostRoom !== undefined) {
                    let roadcount = outpostRoom.find(FIND_MY_CONSTRUCTION_SITES).length
                    if (roadcount > 0) {
                        let neededTiers = Math.ceil(roadcount/6);
                        this.orderJanitor(room, neededTiers);
                    }
                }
            }
        }
    }

    private orderJanitor(room: Room, neededTiers: number): void {

        let maxTier = ProfileUtilities.getMaxTierDistanceWorker(room.energyCapacityAvailable);

        if (maxTier < 1) {
            return;
        }

        let current = this.creepService.getCreeps(Role.Janitor, room.name).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.Janitor, room.name);

        if (current + ordered > 1) {
            return;
        }

        let usedTier = maxTier;
        let currentTiers = this.creepService.getNumberOfTiers(Role.Janitor, room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.Janitor, room.name);

        //console.log("Kiterstatus: " + outpost + ": " + currentTiers + " + " + orderedTiers + " av " + neededTiers)
        if (neededTiers >= currentTiers + orderedTiers) {
            let order = new Order();
            order.body = ProfileUtilities.getDistanceWorkerBody(usedTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.Janitor, target: room.name, tier: usedTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderOutpostDefenders(room: Room): void {
        // If there's invaders in our outposts, order killers
        if (IntelLib.hasHostiles(room.name)) {
            this.orderOutpostDefender(room, room.name);
        }
        let outposts = RoomRepository.getBasicOutposts(room);
        for (let outpost of outposts) {
            if (IntelLib.hasHostiles(outpost) && Memory.rooms[outpost] !== undefined &&
                (Memory.rooms[outpost].undefendable === undefined || Memory.rooms[outpost].undefendable < Game.time)) {
                this.orderOutpostDefender(room, outpost);
            }
        }
    }

    private orderOutpostDefender(room: Room, outpost: string): void {
        let current = this.creepService.getCreeps(Role.OutpostDefender, null, room.name);
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.OutpostDefender);

        if (current.length > 0) {
            for (let d of current) {
                let state = d.getState();
                if (state === OutpostDefender.State.WaitingForSupport) {
                    this.orderOutpostSupporter(room);
                } else
                if (state === OutpostDefender.State.WaitingForWarrior) {
                    this.orderOutpostSupporter(room);
                    this.orderOutpostWarrior(room);
                }
            }
        }

        if (current.length + ordered > 0) {
            if (current.length > 0) {
                if (current[0].memory.target === undefined) {
                    current[0].memory.target = outpost;
                }
            }
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
        let usedTier = maxTier;
        let order = new Order();
        order.body = ProfileUtilities.getRangerBody(usedTier);
        order.priority = Priority.Critical;
        order.memory = {role: Role.OutpostDefender, target: outpost, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderOutpostSupporter(room: Room) {
        let current = this.creepService.getCreeps(Role.OutpostSupporter, null, room.name);
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.OutpostSupporter);

        if (current.length + ordered > 0) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierSupporter(room.energyCapacityAvailable);
        let usedTier = maxTier;
        let order = new Order();
        order.body = ProfileUtilities.getSupporterBody(usedTier);
        order.priority = Priority.Important;
        order.memory = {role: Role.OutpostSupporter, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderOutpostWarrior(room: Room) {
        let current = this.creepService.getCreeps(Role.OutpostWarrior, null, room.name);
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.OutpostWarrior);

        if (current.length + ordered > 0) {
            return;
        }

        let maxTier = ProfileUtilities.getMaxTierRogue(room.energyCapacityAvailable);
        let usedTier = maxTier;
        let order = new Order();
        order.body = ProfileUtilities.getRogueBody(usedTier);
        order.priority = Priority.Important;
        order.memory = {role: Role.OutpostWarrior, tier: usedTier};

        OrdersRepository.orderCreep(room, order);
    }

    private orderOutpostReservers(room: Room): void {
        // If the room has any outposts that is not reserved or reserved is
        // less than 1000, order so we have 2 tiers of claimers there.
        let outposts = RoomRepository.getBasicOutposts(room);
        for (let outpost of outposts) {
            if (IntelLib.hasIntel(outpost) && (Memory.rooms[outpost].isPraiseRoom !== true || room.memory.praiseroomHibernated === true)) {
                if (!IntelLib.hasInvaders(outpost) && IntelLib.isReservedByMeFor(outpost) < 1000) {
                    let controllerPos = IntelLib.controllerPos(outpost);
                    let controllerId = IntelLib.controllerId(outpost);
                    if (controllerPos !== null && controllerId !== null) {
                        this.orderOutpostReserver(room, controllerPos, controllerId);
                    }
                }
            }
        }
    }

    private orderOutpostReserver(room: Room, controllerpos: RoomPosition, controllerid: string): void {
        let maxTier = ProfileUtilities.getMaxTierClaimer(room.energyCapacityAvailable);

        if (maxTier < 1) {
            return;
        }
        let usedTier = Math.min(10, maxTier);
        let currentTiers = this.creepService.getNumberOfTiers(Role.OutpostReserver,
        "$" + controllerpos.roomName + "-" + controllerid);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.OutpostReserver,
        "$" + controllerpos.roomName + "-" + controllerid);
        let neededTiers = 1;

        if (neededTiers > currentTiers + orderedTiers) {
            let order = new Order();
            order.body = ProfileUtilities.getClaimerBody(usedTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.OutpostReserver,
                target: "$" + controllerpos.roomName + "-" + controllerid, tier: usedTier};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private maintainOutpostList(room: Room): boolean {
        if (room.memory.neighbours === undefined || room.memory.neighbours.oneAway === undefined) {
            return false;
        }

        let roomLevel = RoomRepository.getRoomLevel(room);
        let currentOutposts = RoomRepository.getAllOutposts(room);
        let wanted = 0;

        if (Memory.settings.bot === true) {
            for (let o of currentOutposts) {
                if (IntelLib.isOccupied(o)) {
                    console.log("Outpost " + o + " seems to be occupied by an unknown force, reseting outposts for room " + room.name);
                    room.memory.outposts = undefined;
                    return true;
                }

                if (IntelLib.isOwnedByMe(o)) {
                    console.log("Outpost " + o + " seems to be owned by me, reseting outposts for room " + room.name);
                    room.memory.outposts = undefined;
                    return true;
                }
                if (Memory.rooms[o] !== undefined && Memory.rooms[o].undefendable > Game.time) {
                    console.log("Outpost " + o + " seems to be undefendable, reseting outposts for room " + room.name);
                    room.memory.outposts = undefined;
                    return true;
                }
            }
        }

        if (roomLevel >= RoomLevel.CityReadyForExpansion && Memory.settings.bot === true) {
            wanted = 6;
        } else
        if (roomLevel >= RoomLevel.TownReadyForExpansion) {
            wanted = 4;
        } else {
            wanted = 2;
        }

        if (Memory.settings.slow === true && Memory.settings.bot === true) {
            if (roomLevel >= RoomLevel.CityReadyForExpansion) {
                wanted = 3;
            } else
            if (roomLevel >= RoomLevel.TownReadyForExpansion) {
                wanted = 2;
            } else {
                wanted = 1;
            }
        }

        let closeSKrooms = _.filter(room.memory.neighbours.oneAway, (o: string) => RoomRepository.isSKRoom(o));
        if (roomLevel >= RoomLevel.TownReadyForExpansion) {
            if (closeSKrooms.length > 0) {
                wanted = wanted - 1;
            }
        }

        if (currentOutposts.length < wanted) {
            if (room.memory.outposts === undefined) {
                room.memory.outposts = [];
            }
            if ((roomLevel >= RoomLevel.TownReadyForExpansion) &&
            closeSKrooms.length > 0 && !_.contains(room.memory.outposts, closeSKrooms[0])) {
                room.memory.outposts.push(closeSKrooms[0]);
                console.log("Added outpost for room " + room.name + ": " + closeSKrooms[0]);
                return true;
            }
            let nextOutpost = this.getNextOutpost(room.name);
            if (nextOutpost !== undefined) {
                if ((roomLevel >= RoomLevel.TownReadyForExpansion) &&
                closeSKrooms.length > 0 && !_.contains(room.memory.outposts, closeSKrooms[0])) {
                    nextOutpost = closeSKrooms[0];
                }
                room.memory.outposts.push(nextOutpost);
                console.log("Added outpost for room " + room.name + ": " + nextOutpost);
                return true;
            } else {
                if (Memory.settings.bot === true) {
                    this.guardNextWantedOutpost(room);
                }
            }
        }
        return false;
    }

    private guardNextWantedOutpost(room: Room) {
        if (room.controller === undefined || room.controller.level < 5) {
            return;
        }
        let nextWantedOutpost = this.getNextOutpost(room.name, true);
        if (nextWantedOutpost === undefined || IntelLib.isOwned(nextWantedOutpost)) {
            return;
        }

        if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 50000) {
            return;
        }

        if (!OperationLib.roomIsHavingActiveGuardOperation(nextWantedOutpost)) {
            OperationLib.createGuardOutpostOperation(room, nextWantedOutpost);
        }
    }

    private getNextOutpost(roomName: string, alsoHostile: boolean = false): string | undefined {
        let oneAway: string[] = ScoutingUtilities.getRoomsOneAway(roomName);
        let neighbours: string[] = oneAway;
        let potOutposts: string[] = [];

        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].outposts !== undefined) {
            for (let o of Memory.rooms[roomName].outposts) {
                neighbours = neighbours.concat(ScoutingUtilities.getRoomsOneAway(o));
            }
            potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName && !_.contains(Memory.rooms[roomName].outposts, o));
        } else {
            potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName);
        }

        potOutposts = _.filter(potOutposts, (o) => Memory.rooms[o] === undefined || Memory.rooms[o].undefendable === undefined || Memory.rooms[o].undefendable < Game.time);

        let allOutpostsTaken = RoomRepository.getAllOutpostsInAllRooms(this.roomService.getNormalRooms());

        if (Memory.settings.bot === true) {
            for (let o of oneAway) {
                if ((Memory.rooms[roomName].outposts === undefined || !_.contains(Memory.rooms[roomName].outposts, o)) && _.contains(allOutpostsTaken, o)) {
                    let owner = RoomRepository.getOwnerOfOutpost(o, this.roomService.getNormalRooms());
                    if (owner !== undefined) {
                        let ownerOneAway = ScoutingUtilities.getRoomsOneAway(owner.name);
                        if (!_.contains(ownerOneAway, o)) {
                            console.log("Outpost " + o + " seems to be reserved by " + owner.name + ", but should be owned by " +
                            roomName + ". Reseting outposts for " + owner.name);
                            owner.memory.outposts = [];
                        }
                    }
                }
            }
        }

        potOutposts = _.filter(potOutposts, (o) => !_.contains(allOutpostsTaken, o));

        if (!alsoHostile) {
            potOutposts = _.filter(potOutposts, (o) => !IntelLib.isOccupied(o));
        }

        potOutposts = _.filter(potOutposts, (o) => !IntelLib.isOwnedByMe(o));

        let values: {roomName: string, value: number | undefined}[] = [];
        for (let o of potOutposts) {
            values.push({roomName: o, value: getOutpostValue(roomName, o)});
        }

        values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();

        if (values.length > 0) {
            return values[0].roomName;
        }
    }
}


export function listNextOutposts(roomName: string) {
    let neighbours: string[] = ScoutingUtilities.getRoomsOneAway(roomName);
    let potOutposts: string[] = [];
    if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].outposts !== undefined) {
        for (let o of Memory.rooms[roomName].outposts) {
            neighbours = neighbours.concat(ScoutingUtilities.getRoomsOneAway(o));
        }
        potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName && !_.contains(Memory.rooms[roomName].outposts, o));
    } else {
        potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName);
    }

    let values: {roomName: string, value: number | undefined}[] = [];
    for (let o of potOutposts) {
        values.push({roomName: o, value: getOutpostValue(roomName, o)});
    }

    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();

    console.log("Room " + roomName + " outpost-values (best first)")
    for (let o of values) {
        console.log(o["roomName"] + ": " + o["value"]);
    }
}

export function evaluateOutposts(roomName: string) {
    let closeRooms =
        ScoutingUtilities.getRoomsOneAway(roomName).concat(
        ScoutingUtilities.getRoomsTwoAway(roomName),
        ScoutingUtilities.getRoomsThreeAway(roomName)
    );

    let potOutposts = _.filter(closeRooms, function (r: string) { return !RoomLib.roomIsHighway(r) && !RoomRepository.isMiddleRoom(r)});

    let values: {roomName: string, value: number | undefined}[] = [];
    for (let o of potOutposts) {
        values.push({roomName: o, value: getOutpostValue(roomName, o)});
    }

    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();

    return values;
}

export function getOutpostValue(homeroom: string, outpost: string): number | undefined {
    let room = Game.rooms[homeroom];
    let basepos = IntelLib.controllerPos(homeroom);
    if (room !== undefined && room.storage !== undefined) {
        basepos = room.storage.pos;
    }
    if (basepos === null) {
        return undefined;
    }

    let sources = IntelLib.sourceIds(outpost);

    let value = 1000;
    if (sources.length > 1) {
        value = 1500;
    }
    for (let s of sources) {
        value = value - (PathfindingUtilities.getDistanseBetween(basepos, IntelLib.sourcePos(outpost, s)) * 4);
    }

    let controllerPos = IntelLib.controllerPos(outpost);
    if (controllerPos === null) {
        return undefined;
    }
    value = value - (PathfindingUtilities.getDistanseBetween(basepos, controllerPos) * 2);

    return value;
}
