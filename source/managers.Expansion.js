"use strict";
const _Manager_1 = require("./managers._Manager");
const RoomClaimer = require("./roles.RoomClaimer");
const ExpansionWorker = require("./roles.ExpansionWorker");
const ProfileUtilities = require("./utilities.Profiles");
const RoomUtilities = require("./utilities.Room");
const ScoutingUtilities = require("./utilities.Scouting");
const ScoutingManager = require("./managers.Scouting");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const RoomLib = require("./lib.room");
const Order_1 = require("./classes.Order");
const IntelLib = require("./lib.intel");
const SpawnLib = require("./lib.spawn");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
class ExpansionManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("ExpansionManager");
        this.hasRun = false;
        this.MEMORY_EXPANSIONGOING = "expansionGoing";
        this.MEMORY_EXPANSIONSTARTED = "expansionStarted";
        this.MEMORY_LASTRUN = "lastRun";
        this.MEMORY_LASTRUN_BOT_EVAL = "lastRunBotEval";
        this.MEMORY_LASTRUN_BOT_EXPAND = "lastRunBotExpand";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.RoomClaimer, RoomClaimer.run);
            this.creepService.runCreeps(role_1.Role.ExpansionWorker, ExpansionWorker.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let roomsWithExpansion = this.roomService.getNormalWithExpansion();
                let roomsWithDismantleTarget = this.roomService.getNormalWithDismantleTarget();
                this.orderExpansionCreeps(roomsWithExpansion);
                this.orderDismantleClaimer(roomsWithDismantleTarget);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Trivial) {
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
                        }
                        else if (started + 5000 < Game.time) {
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
        if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
            let roomsWithExpansion = this.roomService.getNormalWithExpansion();
            let roomsWithDismantleTarget = this.roomService.getNormalWithDismantleTarget();
            this.orderExpansionCreeps(roomsWithExpansion);
            this.orderDismantleClaimer(roomsWithDismantleTarget);
            this.setValue(this.MEMORY_LASTRUN, Game.time);
        }
    }
    expandIfPossible() {
        let rooms = this.roomService.getMyRooms();
        if (rooms.length === Game.gcl.level) {
            return false;
        }
        if (Game.cpu.limit < rooms.length * 11) {
            return false;
        }
        let possibleRooms = [];
        let requiredLevel = roomlevel_1.RoomLevel.CivilizedColony;
        if (rooms.length > 5) {
            requiredLevel = roomlevel_1.RoomLevel.Town;
        }
        else if (rooms.length > 1) {
            requiredLevel = roomlevel_1.RoomLevel.AdvancedColony;
        }
        for (let r of this.roomService.getNormalRooms()) {
            if (RoomRepository.getRoomLevel(r) >= requiredLevel && !r.hasExpansion() && !r.isUnderSiege()) {
                possibleRooms.push(r);
            }
        }
        if (possibleRooms.length === 0) {
            return false;
        }
        let room;
        let expansion;
        let value;
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
    getBestExpansionTarget(room) {
        if (room.memory.expansionTargets === undefined || Object.keys(room.memory.expansionTargets).length === 0) {
            return undefined;
        }
        let target;
        let value;
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
                if (IntelLib.roomHostility(t) > 1) {
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
                let modValue = room.memory.expansionTargets[t];
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
            return { roomName: target, value: value };
        }
        return undefined;
    }
    orderExpansionCreeps(roomsWithExpansion) {
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
                    !Game.rooms[room.memory.expansion].controller.my) {
                    this.orderRoomClaimer(room);
                    if (Memory.rooms[room.memory.expansion] !== undefined && Memory.rooms[room.memory.expansion].starttime === undefined) {
                        Memory.rooms[room.memory.expansion].starttime = Game.time;
                    }
                }
                if (Game.rooms[room.memory.expansion] !== undefined &&
                    Game.rooms[room.memory.expansion].controller.my) {
                    if (RoomRepository.getRoomLevel(Game.rooms[room.memory.expansion]) === undefined ||
                        RoomRepository.getRoomLevel(Game.rooms[room.memory.expansion]) < roomlevel_1.RoomLevel.DefendedColony) {
                        this.orderExpansionWorker(room);
                        Game.rooms[room.memory.expansion].memory.isExpansion = true;
                        if (Memory.rooms[room.memory.expansion] === undefined || Memory.rooms[room.memory.expansion].starttime === undefined) {
                            Memory.rooms[room.memory.expansion].starttime = Game.time;
                        }
                        buildSpawnForExpansion(Game.rooms[room.memory.expansion]);
                    }
                    else {
                        Game.rooms[room.memory.expansion].memory.isExpansion = undefined;
                        room.memory.expansion = undefined;
                        room.memory.expansionRoute = undefined;
                    }
                }
                this.orderExpansionGuard(room, room.memory.expansion);
            }
        }
    }
    orderDismantleClaimer(roomsWithDismantleTarget) {
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
    orderExpansionGuard(room, expansion) {
        let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 5);
        let current = this.creepService.getCreeps(role_1.Role.OutpostDefender, null, expansion).length;
        let ordered = OrdersRepository.getCreepsInQueueWithHomeRoom(room, role_1.Role.OutpostDefender, expansion);
        if (current + ordered === 0) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getRangerBody(usedTier);
            order.priority = priority_1.Priority.Important;
            order.memory = { role: role_1.Role.OutpostDefender, target: expansion, tier: usedTier, homeroom: expansion };
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderRoomClaimer(room, targetRoom = undefined) {
        if (targetRoom === undefined) {
            targetRoom = room.memory.expansion;
        }
        if (targetRoom === undefined) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierSwampClaimer(room.energyCapacityAvailable);
        let usedTier = Math.min(maxTier, 1);
        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.RoomClaimer, targetRoom);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.RoomClaimer, targetRoom);
        let neededTiers = 1;
        if (neededTiers > currentTiers + orderedTiers) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getSwampClaimerBody(usedTier);
            if (room.controller !== undefined && room.controller.level < 4) {
                order.body = ProfileUtilities.getClaimerBody(usedTier);
            }
            order.priority = priority_1.Priority.Critical;
            order.memory = { role: role_1.Role.RoomClaimer, target: targetRoom, tier: usedTier };
            if (room.memory.expansionRoute !== undefined) {
                order.memory.route = room.memory.expansionRoute;
            }
            OrdersRepository.orderCreep(room, order);
        }
    }
    orderExpansionWorker(room) {
        let targetRoom = room.memory.expansion;
        let maxTier = ProfileUtilities.getMaxTierHaulerEngineer(room.energyCapacityAvailable);
        let current = this.creepService.getCreeps(role_1.Role.ExpansionWorker, targetRoom).length;
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.ExpansionWorker, targetRoom);
        let needed = sourceCountForExpansion(room);
        if (needed > current + ordered) {
            let order = new Order_1.Order();
            order.body = ProfileUtilities.getHaulerEngineerBody(maxTier);
            order.priority = priority_1.Priority.Standard;
            order.memory = { role: role_1.Role.ExpansionWorker, target: targetRoom, tier: maxTier };
            if (room.memory.expansionRoute !== undefined) {
                order.memory.route = room.memory.expansionRoute;
            }
            OrdersRepository.orderCreep(room, order);
        }
    }
}
exports.ExpansionManager = ExpansionManager;
function buildSpawnForExpansion(expansion) {
    let spawnFlag = expansion.find(FIND_FLAGS, { filter: function (f) { return f.name === "Spawn"; } });
    if (spawnFlag !== undefined && spawnFlag.length === 1 && Object.keys(Game.constructionSites).length < 95) {
        spawnFlag[0].pos.createConstructionSite(STRUCTURE_SPAWN);
        spawnFlag[0].remove();
    }
}
function sourceCountForExpansion(room) {
    let targetRoom = Game.rooms[room.memory.expansion];
    if (!(targetRoom instanceof Room)) {
        return 0;
    }
    let sources = targetRoom.getSources().length;
    let outposts = RoomRepository.getBasicOutposts(targetRoom);
    for (let outpost of outposts) {
        if (IntelLib.hasIntel(outpost)) {
            sources += IntelLib.sourceCount(outpost);
        }
        else {
            ScoutingManager.orderScouting(room, outpost);
        }
    }
    return sources;
}
function evaluateExpansions(room) {
    if (room.memory.expansionTargets === undefined) {
        if (room.memory.neighbours === undefined || room.memory.neighbours.threeAway === undefined ||
            room.memory.neighbours.fourAway === undefined || room.memory.neighbours.fiveAway === undefined) {
            return false;
        }
        let possible = room.memory.neighbours.threeAway.concat(room.memory.neighbours.fourAway, room.memory.neighbours.fiveAway);
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
                }
                else {
                    room.memory.expansionTargets[n] = value + spawn.value;
                }
                return true;
            }
        }
    }
    return false;
}
function evaluateExpansion(roomName) {
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
exports.evaluateExpansion = evaluateExpansion;
function getSwampValue(roomName) {
    let plain = 0;
    let swamp = 0;
    let terrain;
    for (let x of _.range(1, 49)) {
        for (let y of _.range(1, 49)) {
            terrain = Game.map.getTerrainAt(x, y, roomName);
            if (terrain === 'swamp') {
                swamp++;
            }
            else if (terrain === 'plain') {
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
    return Math.max(Math.min(Math.ceil((30 * (plain / swamp)) - 30), 60), -30);
}
function getOutpostsValue(roomName) {
    let roomsOneAway = ScoutingUtilities.getRoomsOneAway(roomName);
    let roomsTwoAway = ScoutingUtilities.getRoomsTwoAway(roomName);
    let closeRooms = roomsOneAway.concat(roomsTwoAway);
    let value = 0;
    let count = 6;
    if (_.filter(roomsOneAway, (o) => RoomRepository.isSKRoom(o)).length > 0) {
        value = value + 100;
        count = 4;
    }
    let potOutposts = _.filter(closeRooms, function (r) { return !RoomLib.roomIsHighway(r) && !RoomRepository.isMiddleRoom(r); });
    let values = [];
    for (let o of potOutposts) {
        let distance = 2;
        if (_.contains(roomsOneAway, o)) {
            distance = 1;
        }
        let outpostValue = getOutpostValue(o, distance);
        if (outpostValue === undefined) {
            return undefined;
        }
        values.push({ roomName: o, value: outpostValue });
    }
    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();
    let c = 0;
    let outposts = [];
    for (let v of values) {
        if (c < count && v.value !== undefined) {
            value = value + v.value;
            outposts.push(v.roomName);
            c++;
        }
    }
    return value;
}
exports.getOutpostsValue = getOutpostsValue;
function getOutpostValue(outpost, distance) {
    if (!IntelLib.hasIntel(outpost)) {
        return undefined;
    }
    let sources = IntelLib.sourceCount(outpost);
    let value = Math.ceil(sources * 30 / distance);
    return value;
}
