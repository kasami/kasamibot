import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as RoomClaimer from "../roles/RoomClaimer";
import * as ExpansionWorker from "../roles/ExpansionWorker";

import * as ProfileUtilities from "../utilities/Profiles";
import * as RoomUtilities from "../utilities/Room";
import * as ScoutingUtilities from "../utilities/Scouting";

import * as ScoutingManager from "../managers/Scouting";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import * as RoomLib from "../lib/room";

import {Order} from "../classes/Order";

import * as IntelLib from "../lib/intel";
import * as SpawnLib from "../lib/spawn";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";


export class ExpansionManager extends Manager {
    private roomService: RoomService;
    private creepService: CreepService;

    private hasRun = false;

    readonly MEMORY_EXPANSIONGOING = "expansionGoing";
    readonly MEMORY_EXPANSIONSTARTED = "expansionStarted";
    readonly MEMORY_LASTRUN = "lastRun";
    readonly MEMORY_LASTRUN_BOT_EVAL = "lastRunBotEval";
    readonly MEMORY_LASTRUN_BOT_EXPAND = "lastRunBotExpand";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("ExpansionManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.RoomClaimer, RoomClaimer.run);
            this.creepService.runCreeps(Role.ExpansionWorker, ExpansionWorker.run);

            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let roomsWithExpansion = this.roomService.getNormalWithExpansion();
                let roomsWithDismantleTarget = this.roomService.getNormalWithDismantleTarget();
                this.orderExpansionCreeps(roomsWithExpansion);
                this.orderDismantleClaimer(roomsWithDismantleTarget);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        } else
        if (pri === ManagerPriority.Trivial) {
            if (Memory.settings.bot === true) {
                let lastRunEval = this.getValue(this.MEMORY_LASTRUN_BOT_EVAL);
                if (lastRunEval === undefined || lastRunEval + 50 < Game.time) {
                    let rooms = this.roomService.getNormalRooms();
                    this.setValue(this.MEMORY_LASTRUN_BOT_EVAL, Game.time);
                    for (let room of rooms) {
                        if (evaluateExpansions(room)) {
                            return;
                        }
                    }
                }
                let lastRunExpand = this.getValue(this.MEMORY_LASTRUN_BOT_EXPAND);
                if (lastRunExpand === undefined || lastRunExpand + 1000 < Game.time) {
                    let target = this.getValue(this.MEMORY_EXPANSIONGOING);
                    if (target !== undefined) {
                        let started = this.getValue(this.MEMORY_EXPANSIONSTARTED);
                        let expansion = Game.rooms[target];
                        if (expansion !== undefined && expansion.controller !== undefined && expansion.controller.my) {
                            target = undefined;
                            this.setValue(this.MEMORY_EXPANSIONGOING, undefined);
                            this.setValue(this.MEMORY_EXPANSIONSTARTED, undefined);
                        } else
                        if (started + 5000 < Game.time) {
                            Memory.rooms[target].badExpansion = true;
                            target = undefined;
                            this.setValue(this.MEMORY_EXPANSIONGOING, undefined);
                            this.setValue(this.MEMORY_EXPANSIONSTARTED, undefined);
                        }
                    }
                    if (target === undefined) {
                        target = this.expandIfPossible();
                        if (target !== false) {
                            this.setValue(this.MEMORY_EXPANSIONGOING, target);
                            this.setValue(this.MEMORY_EXPANSIONSTARTED, Game.time);
                        }
                    }
                    this.setValue(this.MEMORY_LASTRUN_BOT_EXPAND, Game.time);
                }
            }
        }
        if (pri === ManagerPriority.Overflow && !this.hasRun) {
            let roomsWithExpansion = this.roomService.getNormalWithExpansion();
            let roomsWithDismantleTarget = this.roomService.getNormalWithDismantleTarget();
            this.orderExpansionCreeps(roomsWithExpansion);
            this.orderDismantleClaimer(roomsWithDismantleTarget);
            this.setValue(this.MEMORY_LASTRUN, Game.time);
        }
    }

    private expandIfPossible(): string | boolean {
        let rooms = this.roomService.getMyRooms();
        if (rooms.length === Game.gcl.level) {
            return false;
        }
        if (Game.cpu.limit < rooms.length * 11) {
            return false;
        }

        let possibleRooms: Room[] = [];

        let requiredLevel = RoomLevel.CivilizedColony;
        if (rooms.length > 5) {
            requiredLevel = RoomLevel.Town;
        } else
        if (rooms.length > 1) {
            requiredLevel = RoomLevel.AdvancedColony;
        }

        for (let r of this.roomService.getNormalRooms()) {
            if (RoomRepository.getRoomLevel(r) >= requiredLevel && !r.hasExpansion() && !r.isUnderSiege()) {
                possibleRooms.push(r);
            }
        }

        if (possibleRooms.length === 0) {
            return false;
        }
        let room: Room | undefined;
        let expansion: string | undefined;
        let value: number | undefined;

        for (let r of possibleRooms) {
            let target = this.getBestExpansionTarget(r);
            if (target !== undefined) {
                if (value === undefined || value < target.value) {
                    room = r;
                    expansion = target.roomName;
                    value = target.value;
                }
            }
        }
        if (expansion === undefined || room === undefined || value === undefined) {
            return false;
        }

        let spawnPos = SpawnLib.findSpawnLocation(expansion);
        if (spawnPos === undefined) {
            console.log("Room " + room.name + " wanted to make an expansion at room " + expansion + ", but could not find spawnlocation.");
            return false;
        }


        room.memory.expansion = expansion;
        RoomRepository.setBasePosition(expansion, spawnPos.pos);
        console.log("Room " + room.name + " is making an expansion at room " + expansion + " with a value of " + value);

        return expansion;
    }

    private getBestExpansionTarget(room: Room): {roomName: string, value: number} | undefined {
        if (room.memory.expansionTargets === undefined || Object.keys(room.memory.expansionTargets).length === 0) {
            return undefined;
        }
        let target: string | undefined;
        let value: number | undefined;

        let ownedMinerals = Object.keys(RoomUtilities.getMinerals());

        for (let t of Object.keys(room.memory.expansionTargets)) {
            if (room.memory.expansionTargets[t] !== false && room.memory.expansionTargets[t] !== true && room.memory.expansionTargets[t] > 0) {
                let allRooms = this.roomService.getNormalRooms();
                let exp = Game.rooms[t];
                if (exp !== undefined && exp.controller !== undefined && exp.controller.level > 0 && exp.controller.my) {
                    continue;
                }

                if (Memory.rooms[t] !== undefined && Memory.rooms[t].badExpansion === true) {
                    continue;
                }

                if (IntelLib.roomHostility(t) > 1){
                    continue;
                }
                let tooClose = false;
                for (let r of allRooms) {
                    if (r.memory.neighbours !== undefined && r.memory.neighbours.oneAway !== undefined && r.memory.neighbours.twoAway !== undefined) {
                        if (_.contains(r.memory.neighbours.oneAway, t) || _.contains(r.memory.neighbours.twoAway, t)) {
                            tooClose = true;
                            continue;
                        }
                    }
                }
                let modValue = room.memory.expansionTargets[t] as number;
                if (_.contains(room.memory.neighbours.threeAway, exp)) {
                    modValue = modValue - 20;
                }
                if (_.contains(room.memory.neighbours.fourAway, exp)) {
                    modValue = modValue + 20;
                }

                let mineralInRoom = IntelLib.mineralType(t);
                if (mineralInRoom !== undefined && !_.contains(ownedMinerals, mineralInRoom)) {
                    modValue = modValue + 120;
                    if (mineralInRoom === RESOURCE_CATALYST) {
                        modValue = modValue + 80;
                    }
                }

                let roomsOneAway = ScoutingUtilities.getRoomsOneAway(t);
                let skroom = _.filter(roomsOneAway, (o) => RoomRepository.isSKRoom(o));
                if (skroom.length > 0) {
                    let mineralInLairRoom = IntelLib.mineralType(skroom[0]);
                    if (mineralInLairRoom !== undefined && !_.contains(ownedMinerals, mineralInLairRoom) && mineralInLairRoom !== mineralInRoom) {
                        modValue = modValue + 50;
                    }
                }

                for (let n of ScoutingUtilities.getRoomsOneAway(t)) {
                    if (IntelLib.isOccupied(n)) {
                        modValue = modValue - 50;
                    }
                }
                for (let n of ScoutingUtilities.getRoomsTwoAway(t)) {
                    if (IntelLib.isOccupied(n)) {
                        modValue = modValue - 20;
                    }
                }

                if (!tooClose && (value === undefined || value < modValue)) {
                    target = t;
                    value = modValue;
                }
            }
        }

        if (target !== undefined && value !== undefined) {
            return {roomName: target, value: value};
        }
        return undefined;
    }

    private orderExpansionCreeps(roomsWithExpansion: Room[]) {
        for (let room of roomsWithExpansion) {
            if (room.memory.expansion !== undefined) {
                if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 5000) {
                    continue;
                }

                if (IntelLib.isOccupied(room.memory.expansion) && Memory.settings.bot === true) {
                    console.log("Room " + room.name + " is dropping expansion to " + room.memory.expansion + " because it is tagged as occupied.");
                    Memory.rooms[room.memory.expansion].isExpansion = undefined;
                    Memory.rooms[room.memory.expansion].starttime = undefined;
                    room.memory.expansion = undefined;
                    room.memory.expansionRoute = undefined;
                    return;
                }

                if (Memory.settings.bot === true && Memory.rooms[room.memory.expansion] !== undefined && 
                    Memory.rooms[room.memory.expansion].starttime !== undefined && Memory.rooms[room.memory.expansion].starttime + 20000 < Game.time) {
                    let expRoom = Game.rooms[room.memory.expansion];
                    if (expRoom === undefined || expRoom.controller === undefined || expRoom.controller.level < 2 || expRoom.getSpawn() === undefined) {
                        console.log("Room " + room.name + " is dropping expansion to " + room.memory.expansion + " because it looks like it can't get established.");
                        Memory.rooms[room.memory.expansion].isExpansion = undefined;
                        Memory.rooms[room.memory.expansion].starttime = undefined;
                        room.memory.expansion = undefined;
                        room.memory.expansionRoute = undefined;
                    }
                    return;
                }

                if (Game.rooms[room.memory.expansion] === undefined ||
                !(Game.rooms[room.memory.expansion].controller as Controller).my) {
                    this.orderRoomClaimer(room);
                    if (Memory.rooms[room.memory.expansion] !== undefined && Memory.rooms[room.memory.expansion].starttime === undefined) {
                        Memory.rooms[room.memory.expansion].starttime = Game.time;
                    }
                }
                if (Game.rooms[room.memory.expansion] !== undefined &&
                (Game.rooms[room.memory.expansion].controller as Controller).my) {
                    if (RoomRepository.getRoomLevel(Game.rooms[room.memory.expansion]) === undefined ||
                    RoomRepository.getRoomLevel(Game.rooms[room.memory.expansion]) < RoomLevel.DefendedColony) {
                        this.orderExpansionWorker(room);
                        Game.rooms[room.memory.expansion].memory.isExpansion = true;
                        if (Memory.rooms[room.memory.expansion] === undefined || Memory.rooms[room.memory.expansion].starttime === undefined) {
                            Memory.rooms[room.memory.expansion].starttime = Game.time;
                        }
                        buildSpawnForExpansion(Game.rooms[room.memory.expansion]);
                    } else {
                        Game.rooms[room.memory.expansion].memory.isExpansion = undefined;
                        room.memory.expansion = undefined;
                        room.memory.expansionRoute = undefined;
                    }
                }
                // Order a guard to watch over the expansion
                this.orderExpansionGuard(room, room.memory.expansion);
            }
        }
    }

    private orderDismantleClaimer(roomsWithDismantleTarget: Room[]) {
        for (let room of roomsWithDismantleTarget) {
            if (room.memory.dismantleTargetRoom !== undefined) {
                this.orderRoomClaimer(room, room.memory.dismantleTargetRoom);
                if (Memory.rooms[room.memory.dismantleTargetRoom] === undefined) {
                    Memory.rooms[room.memory.dismantleTargetRoom] = {};
                }
                Memory.rooms[room.memory.dismantleTargetRoom].isBeingDismantled = true;
                room.memory.dismantleTargetRoom = undefined;
            }
        }
    }

    private orderExpansionGuard(room: Room, expansion: string): void {
        let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 5);
        let current = this.creepService.getCreeps(Role.OutpostDefender, null, expansion).length;
        let ordered = OrdersRepository.getCreepsInQueueWithHomeRoom(room, Role.OutpostDefender, expansion);

        if (current + ordered === 0) {
            let order = new Order();
            order.body = ProfileUtilities.getRangerBody(usedTier);
            order.priority = Priority.Important;
            order.memory = {role: Role.OutpostDefender, target: expansion, tier: usedTier, homeroom: expansion};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderRoomClaimer(room: Room, targetRoom: string | undefined = undefined): void {
        if (targetRoom === undefined) {
            targetRoom = room.memory.expansion;
        }
        if (targetRoom === undefined) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierSwampClaimer(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 1);
        let currentTiers = this.creepService.getNumberOfTiers(Role.RoomClaimer, targetRoom);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.RoomClaimer, targetRoom);
        let neededTiers = 1;

        if (neededTiers > currentTiers + orderedTiers) {
            let order = new Order();
            order.body = ProfileUtilities.getSwampClaimerBody(usedTier);
            if (room.controller !== undefined && room.controller.level < 4) {
                order.body = ProfileUtilities.getClaimerBody(usedTier);
            }
            order.priority = Priority.Critical;
            order.memory = {role: Role.RoomClaimer, target: targetRoom, tier: usedTier};
            if (room.memory.expansionRoute !== undefined) {
                order.memory.route = room.memory.expansionRoute;
            }

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderExpansionWorker(room: Room): void {
        let targetRoom: string = room.memory.expansion;
        let maxTier = ProfileUtilities.getMaxTierHaulerEngineer(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(Role.ExpansionWorker, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.ExpansionWorker, targetRoom);
        let needed = sourceCountForExpansion(room);

        if (needed > current + ordered) {
            let order = new Order();
            order.body = ProfileUtilities.getHaulerEngineerBody(maxTier);
            order.priority = Priority.Standard;
            order.memory = {role: Role.ExpansionWorker, target: targetRoom, tier: maxTier};
            if (room.memory.expansionRoute !== undefined) {
                order.memory.route = room.memory.expansionRoute;
            }

            OrdersRepository.orderCreep(room, order);
        }
    }
}

function buildSpawnForExpansion(expansion: Room) {
    let spawnFlag = expansion.find(FIND_FLAGS, {filter: function(f: Flag) {return f.name === "Spawn";}}) as Flag[];
    if (spawnFlag !== undefined && spawnFlag.length === 1 && Object.keys(Game.constructionSites).length < 95) {
        spawnFlag[0].pos.createConstructionSite(STRUCTURE_SPAWN);
        spawnFlag[0].remove();
    }
}

function sourceCountForExpansion(room: Room): number {
    let targetRoom = Game.rooms[room.memory.expansion];
    if (!(targetRoom instanceof Room)) {
        return 0;
    }
    let sources = targetRoom.getSources().length;
    let outposts = RoomRepository.getBasicOutposts(targetRoom);
    for (let outpost of outposts) {
        if (IntelLib.hasIntel(outpost) ) {
            sources += IntelLib.sourceCount(outpost);
        } else {
            ScoutingManager.orderScouting(room, outpost);
        }
    }
    return sources;
}

function evaluateExpansions(room: Room): boolean {
    if (room.memory.expansionTargets === undefined) {
        if (room.memory.neighbours === undefined || room.memory.neighbours.threeAway === undefined ||
        room.memory.neighbours.fourAway === undefined || room.memory.neighbours.fiveAway === undefined) {
            return false;
        }
        let possible = room.memory.neighbours.threeAway.concat(room.memory.neighbours.fourAway, room.memory.neighbours.fiveAway)
        room.memory.expansionTargets = {};
        for (let n of possible) {
            if (!RoomLib.roomIsHighway(n) && !RoomRepository.isMiddleRoom(n)) {
                room.memory.expansionTargets[n] = true;
            }
        }
    }

    for (let n of Object.keys(room.memory.expansionTargets)) {
        if (room.memory.expansionTargets[n] === true) {
            let value = evaluateExpansion(n);
            if (value !== undefined) {
                let spawn = SpawnLib.findSpawnLocation(n);
                if (spawn === undefined) {
                    room.memory.expansionTargets[n] = false;
                } else {
                    room.memory.expansionTargets[n] = value + spawn.value;
                }
                return true;
            }
        }
    }

    return false;
}

export function evaluateExpansion(roomName: string): number | undefined {
    let baseSources = IntelLib.sourceIds(roomName);
    let baseController = IntelLib.controllerId(roomName);
    if (baseSources.length === 0 || baseController === null) {
        return undefined;
    }
    let value = getSwampValue(roomName);
    if (baseSources.length > 1) {
        value = 100;
    }

    let outpostValue = getOutpostsValue(roomName);
    if (outpostValue === undefined) {
        return undefined;
    }

    value = value + outpostValue;
    console.log("Expansion-value for " + roomName + " is " + value);
    return value;
}

function getSwampValue(roomName: string): number {
    let plain = 0;
    let swamp = 0;
    let terrain: string;

    for (let x of _.range(1, 49)) {
        for (let y of _.range(1, 49)) {
            terrain = Game.map.getTerrainAt(x, y, roomName);
            if (terrain === 'swamp') {
                swamp++;
            } else
            if (terrain === 'plain') {
                plain++;
            }
        }
    }
    if (swamp === 0) {
        return 60;
    }
    if (plain === 0) {
        return 0;
    }
    if (plain > swamp) {
        return 30;
    }
    return Math.max(Math.min(Math.ceil((30 * (plain/swamp)) - 30), 60), -30);
}

export function getOutpostsValue(roomName: string): number | undefined {
    let roomsOneAway = ScoutingUtilities.getRoomsOneAway(roomName);
    let roomsTwoAway = ScoutingUtilities.getRoomsTwoAway(roomName);
    let closeRooms = roomsOneAway.concat(roomsTwoAway);

    let value = 0;
    let count = 6;
    if (_.filter(roomsOneAway, (o) => RoomRepository.isSKRoom(o)).length > 0) {
        value = value + 100;
        count = 4;
    }

    let potOutposts = _.filter(closeRooms, function (r: string) { return !RoomLib.roomIsHighway(r) && !RoomRepository.isMiddleRoom(r)});

    let values: {roomName: string, value: number | undefined}[] = [];
    for (let o of potOutposts) {
        let distance = 2;
        if (_.contains(roomsOneAway, o)) {
            distance = 1;
        }
        let outpostValue = getOutpostValue(o, distance);
        if (outpostValue === undefined) {
            // Not enough data about outposts to evaluate expansion
            return undefined;
        }
        values.push({roomName: o, value: outpostValue});
    }

    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();

    let c = 0;
    let outposts: string[] = [];
    for (let v of values) {
        if (c < count && v.value !== undefined) {
            value = value + v.value;
            outposts.push(v.roomName);
            c++;
        }
    }

    return value;
}

function getOutpostValue(outpost: string, distance: number): number | undefined {
    if (!IntelLib.hasIntel(outpost)) {
        return undefined;
    }
    let sources = IntelLib.sourceCount(outpost);
    let value = Math.ceil(sources * 30 / distance);
    return value;
}


/**

Math for using CLAIM to speed up downgrade

1 extra per tick: 5 CLAIM, 5 MOVE - 3250
Estimated effect: 400 ticks
Cost: ~8 energy per tick

Cost for double downgrade-speed for lvl 8: 75 000 -> 600 000 energy
Cost for double downgrade-speed for lvl 7: 50 000 -> 400 000 energy
Cost for double downgrade-speed for lvl 6: 30 000 -> 240 000 energy
Cost for double downgrade-speed for lvl 5: 20 000 -> 160 000 energy
Cost for double downgrade-speed for lvl 4: 10 000 -> 80 000 energy
Cost for double downgrade-speed for lvl 3:   5000 -> 40 000 energy
Cost for double downgrade-speed for lvl 2:   2500 -> 20 000 energy
Cost for double downgrade-speed for lvl 1: 10 000 -> 80 000 energy

Full downgrade from lvl 8 costs: ~1 500 000 energy
Takes normally 400 000 ticks, 21 days.
For 1.5M energy you can reduce it to ~11 days.

Largest downgrader possible at RCL 7 is 1.
Largest downgrader possible at RCL 8 is 3.

For RCL 8 with 15 CLAIM-downgrader:
Costs about 6M and reduces time to ~6 days.

Conclusion: Not worth it unless you really need the room.

Can be useful to block upgrading.

 */
