"use strict";
const _Manager_1 = require("./managers._Manager");
const roomlevel_1 = require("./enums.roomlevel");
const Protector = require("./roles.Protector");
const BuildLib = require("./lib.build");
const BaseLib = require("./lib.base");
const WallLib = require("./lib.wall");
const ProfileUtilities = require("./utilities.Profiles");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const Order_1 = require("./classes.Order");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
class WallManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("WallManager");
        this.MEMORY_LASTRUN_BORDERWALL = "lastRunBorderWall";
        this.MEMORY_LASTINDEX = "lastIndex";
        this.MEMORY_ROOMINDEX = "roomIndex";
        this.MEMORY_TICKLASTINDEX = "tickIndex";
        this.MEMORY_LASTRUN_BASEBUILDER = "lastRunBaseBuilder";
        this.MEMORY_LASTRUN_PROTECTOR = "lastRunProtector";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.Protector, Protector.run);
            let lastRunBaseBuilder = this.getValue(this.MEMORY_LASTRUN_BASEBUILDER);
            if (lastRunBaseBuilder === undefined || (lastRunBaseBuilder + 300) < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    let needed = roomNeedsBaseBuilder(room);
                    if (needed > 0) {
                        this.orderBaseBuilder(room, needed);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN_BASEBUILDER, Game.time);
            }
            let lastRunProtector = this.getValue(this.MEMORY_LASTRUN_PROTECTOR);
            if (lastRunProtector === undefined || (lastRunProtector + 1000) < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    if (roomNeedsProtector(room)) {
                        this.orderProtector(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN_PROTECTOR, Game.time);
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Trivial) {
            let lastRunBorderWall = this.getValue(this.MEMORY_LASTRUN_BORDERWALL);
            let tickLastIndex = this.getValue(this.MEMORY_TICKLASTINDEX);
            if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
            }
            else if (lastRunBorderWall === undefined || lastRunBorderWall + 100 < Game.time) {
                let roomIndex = this.getValue(this.MEMORY_ROOMINDEX);
                if (roomIndex === undefined) {
                    roomIndex = 1;
                }
                let room = RoomRepository.getRoomForIndex(roomIndex);
                if (room !== undefined && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.CivilizedColony &&
                    room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) {
                    this.buildBorderWall(room);
                    this.buildControllerWall(room);
                }
                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
                if (lastIndex === undefined) {
                    console.log("Error with lastIndex in WallManager.");
                    return;
                }
                let nextIndex = roomIndex + 1;
                if (nextIndex > lastIndex) {
                    nextIndex = 1;
                }
                this.setValue(this.MEMORY_ROOMINDEX, nextIndex);
                this.setValue(this.MEMORY_LASTRUN_BORDERWALL, Game.time);
            }
        }
        if (pri === _Manager_1.ManagerPriority.Trivial && Game.time === 1) {
            let room = Game.rooms["E83Ndd9"];
            if (room !== undefined) {
                if (room.name === "E83Ndd9" && Game.time % 20 === 0) {
                    this.simBorderWall(room);
                }
                if (room.name === "E82Nff4" && Game.time % 20 === 0) {
                    this.simOuterWall(room);
                }
                if (Game.time % 20 === 17) {
                    deleteAllFlags();
                }
            }
        }
    }
    orderBaseBuilder(room, count = 1) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseBuilder, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.BaseBuilder, room.name).length;
        if (ordered + spawned >= count) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getConsultantBody(maxTier);
        order.priority = priority_1.Priority.Trivial;
        order.memory = { role: role_1.Role.BaseBuilder, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderProtector(room) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Protector, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.Protector, room.name).length;
        if (ordered + spawned >= 1) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierProtector(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getProtectorBody(maxTier);
        order.priority = priority_1.Priority.Trivial;
        order.memory = { role: role_1.Role.Protector, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    buildBorderWall(room) {
        if (WallLib.wallConstructionLimitReached() || room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
            return;
        }
        let borderwall = getBorderwall(room);
        let rampartIndex = makeRampartListForBorderwall(borderwall);
        for (let posId of Object.keys(borderwall)) {
            let posIdInt = parseInt(posId);
            if (rampartIndex[posIdInt]) {
                BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, borderwall[posIdInt], 0, 0, true, false);
            }
            else {
                BuildLib.buildIfNotPresent(STRUCTURE_WALL, borderwall[posIdInt], 0, 0, true, false);
            }
        }
    }
    buildControllerWall(room) {
        if (WallLib.wallConstructionLimitReached() || room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 || room.controller === undefined) {
            return;
        }
        let controllerPos = room.controller.pos;
        for (let x of [-1, 0, 1]) {
            for (let y of [-1, 0, 1]) {
                if (controllerPos.x + x > 0 && controllerPos.x + x < 49 && controllerPos.y + y > 0 && controllerPos.y + y < 49
                    && (x !== 0 || y !== 0)) {
                    let pos = new RoomPosition(controllerPos.x + x, controllerPos.y + y, controllerPos.roomName);
                    let terrain = Game.map.getTerrainAt(pos);
                    if (terrain === 'plain' || terrain === 'swamp') {
                        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, pos, 0, 0, true, false);
                    }
                }
            }
        }
    }
    simBorderWall(room) {
        let borderwall = calculateBorderwall(room);
        let rampartIndex = makeRampartListForBorderwall(borderwall);
        for (let posId of Object.keys(borderwall)) {
            let posIdInt = parseInt(posId);
            if (rampartIndex[posIdInt]) {
                borderwall[posIdInt].createFlag(undefined, COLOR_GREEN, COLOR_GREEN);
            }
            else {
                borderwall[posIdInt].createFlag(undefined, COLOR_RED, COLOR_RED);
            }
        }
    }
    simOuterWall(room) {
        console.log("Simulating outer wall for room: " + room.name);
        let basePos = RoomRepository.getBasePosition(room);
        if (basePos === undefined) {
            return;
        }
        if (basePos.y > 40) {
            console.log("Room could not build outer wall because room is too low: " + room.name);
        }
        let cpu = Game.cpu.getUsed();
        let startPos = new RoomPosition(basePos.x + 1, basePos.y + 9, basePos.roomName);
        let endPos = new RoomPosition(basePos.x - 1, basePos.y + 9, basePos.roomName);
        if (basePos.y === 39) {
            startPos = new RoomPosition(basePos.x + 1, basePos.y + 8, basePos.roomName);
            endPos = new RoomPosition(basePos.x - 1, basePos.y + 8, basePos.roomName);
        }
        else if (basePos.y === 40) {
            startPos = new RoomPosition(basePos.x + 1, basePos.y + 7, basePos.roomName);
            endPos = new RoomPosition(basePos.x - 1, basePos.y + 7, basePos.roomName);
        }
        let costMatrix = getOuterWallRoomCallback(room, basePos, true);
        let costMatrix2 = getOuterWallRoomCallback(room, basePos, false);
        let ret = PathFinder.search(startPos, { pos: endPos, range: 1 }, {
            roomCallback: () => costMatrix,
            maxRooms: 1,
        });
        if (ret.incomplete) {
            console.log("Failed to make outer wall for room: " + room.name);
            return;
        }
        let ret2 = PathFinder.search(ret.path[ret.path.length - 2], ret.path[1], {
            roomCallback: () => costMatrix2,
            maxRooms: 1,
        });
        if (ret2.incomplete) {
            console.log("Failed to make last path for outer wall for room: " + room.name);
            return;
        }
        let wallPath = ret.path.concat(ret2.path);
        let wallPositions = makeWallpositionsFromPath(wallPath);
        let neededPositions = [];
        for (let pos of wallPositions) {
            if (outerwallPositionNeeded(pos)) {
                neededPositions.push(pos);
            }
        }
        console.log("Cost for borderwallpositions: " + (Game.cpu.getUsed() - cpu));
        for (let pos of neededPositions) {
            pos.createFlag();
        }
        console.log("Cost for borderwallpositions including flagplacement: " + (Game.cpu.getUsed() - cpu));
    }
}
exports.WallManager = WallManager;
function roomNeedsBaseBuilder(room) {
    if (room.isAbandoned() || room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 25000) {
        return 0;
    }
    if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.CivilizedColony) {
        return 0;
    }
    let lowestHp = undefined;
    let walls = room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) });
    for (let wall of walls) {
        if (lowestHp === undefined || wall.hits < lowestHp) {
            lowestHp = wall.hits;
        }
    }
    if (lowestHp !== undefined) {
        room.memory.lowestWall = lowestHp;
    }
    if (lowestHp !== undefined && lowestHp < WallLib.desiredWallHitsForRoom(room)) {
        let lowWalls = (lowestHp < (WallLib.desiredWallHitsForRoom(room) / 3));
        if (lowWalls && room.storage.store[RESOURCE_ENERGY] > 250000) {
            return 4;
        }
        else if (lowWalls || room.storage.store[RESOURCE_ENERGY] > 250000) {
            return 2;
        }
        return 1;
    }
    return 0;
}
function roomNeedsProtector(room) {
    if (room.isAbandoned() || room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 250000) {
        return false;
    }
    if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.CivilizedColony) {
        return false;
    }
    let fortressRamparts = BaseLib.getFortressRamparts(room);
    let lowestHp = undefined;
    for (let wall of fortressRamparts) {
        if (lowestHp === undefined || wall.hits < lowestHp) {
            lowestHp = wall.hits;
        }
    }
    if (lowestHp !== undefined) {
        room.memory.lowestFortress = lowestHp;
    }
    if (lowestHp !== undefined) {
        return lowestHp < WallLib.desiredFortressHitsForRoom(room);
    }
    return false;
}
function getBorderwall(room) {
    if (room.memory.borderwall !== undefined) {
        return _.map(JSON.parse(room.memory.borderwall), (p) => WallLib.longPos(p, room.name));
    }
    else {
        let borderwall = calculateBorderwall(room);
        room.memory.borderwall = JSON.stringify(_.map(borderwall, (p) => WallLib.shortPos(p)));
        return borderwall;
    }
}
function calculateBorderwall(room) {
    if (room.storage === undefined) {
        return [];
    }
    let positions = [];
    for (let x of [1, 2, 47, 48]) {
        for (let y of _.range(1, 49)) {
            let pos = new RoomPosition(x, y, room.name);
            if (posShouldBeBorderWall(pos)) {
                positions.push(pos);
            }
        }
    }
    for (let y of [1, 2, 47, 48]) {
        for (let x of _.range(3, 47)) {
            let pos = new RoomPosition(x, y, room.name);
            if (posShouldBeBorderWall(pos)) {
                positions.push(pos);
            }
        }
    }
    let neededPositions = [];
    let costMatrix = WallLib.getBorderwallRoomCallback(positions);
    for (let pos of positions) {
        if (borderwallPositionNeeded(room.storage, pos, positions, costMatrix)) {
            neededPositions.push(pos);
        }
    }
    return neededPositions;
}
function posShouldBeBorderWall(pos) {
    let terrain = Game.map.getTerrainAt(pos);
    if (terrain === "swamp" || terrain === "plain") {
        let closestExit = pos.findClosestByRange(FIND_EXIT);
        if (pos.getRangeTo(closestExit) === 2) {
            return true;
        }
    }
    return false;
}
function makeRampartListForBorderwall(neededPositions) {
    let ramparts = [];
    for (let posId of Object.keys(neededPositions)) {
        let posIdInt = parseInt(posId);
        let structs = neededPositions[posIdInt].lookFor(LOOK_STRUCTURES);
        if (structs.length > 0) {
            for (let s of structs) {
                if (s.structureType === STRUCTURE_WALL) {
                    ramparts[posIdInt] = false;
                }
                else if (s.structureType === STRUCTURE_RAMPART) {
                    ramparts[posIdInt] = true;
                }
                else {
                    ramparts[posIdInt] = true;
                }
            }
        }
    }
    for (let posId of Object.keys(neededPositions)) {
        let posIdInt = parseInt(posId);
        if (ramparts[posIdInt] !== undefined) {
            continue;
        }
        else if (neededPositions[posIdInt].x === 1 || neededPositions[posIdInt].x === 48 || neededPositions[posIdInt].y === 1 || neededPositions[posIdInt].y === 48) {
            ramparts[posIdInt] = false;
        }
        else if (posIdInt === 0) {
            ramparts[posIdInt] = true;
        }
        else if (posIdInt === 1) {
            ramparts[posIdInt] = false;
        }
        else if (posIdInt === ramparts.length - 1) {
            ramparts[posIdInt] = true;
        }
        else if (neededPositions[posIdInt].getRangeTo(neededPositions[posIdInt - 1]) > 1) {
            ramparts[posIdInt] = true;
        }
        else if ((posIdInt + 1 < neededPositions.length) && neededPositions[posIdInt].getRangeTo(neededPositions[posIdInt + 1]) > 1) {
            ramparts[posIdInt] = true;
        }
        else if (ramparts[posIdInt - 2] === false && ramparts[posIdInt - 1] === false) {
            ramparts[posIdInt] = true;
        }
        else {
            ramparts[posIdInt] = false;
        }
    }
    return ramparts;
}
function makeWallpositionsFromPath(path) {
    let positions = [];
    for (let i of _.range(0, path.length)) {
        positions.push(path[i]);
        if (path[i].x !== path[(i + 1) % path.length].x &&
            path[i].y !== path[(i + 1) % path.length].y) {
            if (Game.map.getTerrainAt(path[(i + 1) % path.length].x, path[i].y, path[i].roomName) !== "wall") {
                positions.push(new RoomPosition(path[i].x, path[(i + 1) % path.length].y, path[i].roomName));
            }
        }
    }
    return positions;
}
function outerwallPositionNeeded(pos) {
    return Game.map.getTerrainAt(pos) !== "wall";
}
exports.outerwallPositionNeeded = outerwallPositionNeeded;
function borderwallPositionNeeded(storage, pos, positions, cm) {
    let ret = PathFinder.search(pos, { pos: storage.pos, range: 1 }, {
        plainCost: 1,
        swampCost: 1,
        roomCallback: () => cm,
        maxRooms: 1,
    });
    for (let p of ret.path) {
        for (let wallP of positions) {
            if (p.x === wallP.x && p.y === wallP.y) {
                return false;
            }
        }
    }
    return true;
}
function getOuterWallRoomCallback(room, basePos, withHorizontal) {
    let costs = new PathFinder.CostMatrix;
    for (let x of _.range(0, 50)) {
        for (let y of _.range(0, 50)) {
            let terrain = Game.map.getTerrainAt(x, y, room.name);
            if (terrain === "wall") {
                costs.set(x, y, 1);
            }
            else if (x < 2 || x > 47 || y < 2 || y > 47) {
                costs.set(x, y, 0xff);
            }
            else {
                costs.set(x, y, 5);
            }
        }
    }
    let startx = basePos.x - 8;
    let starty = basePos.y - 9;
    for (let x of _.range(1, 16)) {
        for (let y of _.range(1, 18)) {
            costs.set(startx + x, starty + y, 0xfe);
        }
    }
    let structures = _.filter(room.find(FIND_MY_STRUCTURES), (s) => s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART);
    let roads = _.filter(room.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_ROAD);
    for (let s of roads) {
        costs.set(s.pos.x, s.pos.y, 10);
    }
    for (let s of structures) {
        costs.set(s.pos.x, s.pos.y, 0xfe);
    }
    if (withHorizontal) {
        for (let y of _.range(basePos.y, 50)) {
            costs.set(basePos.x, y, 0xff);
        }
    }
    return costs;
}
function deleteAllFlags() {
    let flags = Game.flags;
    for (let f in flags) {
        Game.flags[f].remove();
    }
}
exports.deleteAllFlags = deleteAllFlags;
