module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	let version = "1.0.0";
	const Core = __webpack_require__(1);
	const Command_1 = __webpack_require__(141);
	try {
	    var config = require("config");
	    if (config !== undefined) {
	        if (Memory.settings === undefined) {
	            Memory.settings = {};
	            console.log("* * * * * * * * * * * * *");
	            console.log(" Loading KasamiBot " + version + " ");
	            console.log("* * * * * * * * * * * * *");
	        }
	        if (config.bot !== undefined) {
	            if (Memory.settings.bot === undefined) {
	                console.log("Running as bot: " + config.bot);
	                Memory.settings.bot = config.bot;
	            }
	        }
	        if (config.passive !== undefined) {
	            if (Memory.settings.passive === undefined) {
	                console.log("Running as passive bot: " + config.passive);
	                Memory.settings.passive = config.passive;
	            }
	        }
	        if (config.slow !== undefined) {
	            if (Memory.settings.slow === undefined) {
	                console.log("Running as slow bot: " + config.slow);
	                Memory.settings.slow = config.slow;
	            }
	        }
	        if (config.creditsToMaintain !== undefined) {
	            if (Memory.settings.creditsToMaintain === undefined) {
	                console.log("Credits to maintain: " + config.creditsToMaintain);
	                Memory.settings.creditsToMaintain = config.creditsToMaintain;
	            }
	        }
	        if (config.powerfocus !== undefined) {
	            if (Memory.settings.powerfocus === undefined) {
	                console.log("Focusing on power processing: " + config.powerfocus);
	                Memory.settings.powerfocus = config.powerfocus;
	            }
	        }
	    }
	}
	catch (e) {
	}
	function loop() {
	    Core.run();
	    Command_1.command.initCommands();
	}
	exports.loop = loop;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(2);
	__webpack_require__(21);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	const _Manager_1 = __webpack_require__(14);
	const Memory_1 = __webpack_require__(28);
	const Intel_1 = __webpack_require__(29);
	const Upgrade_1 = __webpack_require__(31);
	const Interface_1 = __webpack_require__(37);
	const Logistics_1 = __webpack_require__(38);
	const Expansion_1 = __webpack_require__(42);
	const Roomlevel_1 = __webpack_require__(59);
	const Scouting_1 = __webpack_require__(48);
	const Outpost_1 = __webpack_require__(60);
	const Mineral_1 = __webpack_require__(69);
	const Defense_1 = __webpack_require__(73);
	const Wall_1 = __webpack_require__(80);
	const Boost_1 = __webpack_require__(84);
	const Operation_1 = __webpack_require__(90);
	const Praiseroom_1 = __webpack_require__(93);
	const Military_1 = __webpack_require__(99);
	const Market_1 = __webpack_require__(87);
	const Crisis_1 = __webpack_require__(113);
	const Link_1 = __webpack_require__(115);
	const Spawn_1 = __webpack_require__(116);
	const Hauling_1 = __webpack_require__(118);
	const Mining_1 = __webpack_require__(121);
	const Power_1 = __webpack_require__(49);
	const Trade_1 = __webpack_require__(86);
	const Build_1 = __webpack_require__(123);
	const Maintainence_1 = __webpack_require__(126);
	const Road_1 = __webpack_require__(128);
	const Lab_1 = __webpack_require__(129);
	const Poaching_1 = __webpack_require__(130);
	const Harass_1 = __webpack_require__(134);
	const Creep_1 = __webpack_require__(137);
	const Room_1 = __webpack_require__(138);
	const Stats = __webpack_require__(139);
	const SegmentRepository = __webpack_require__(140);
	function run() {
	    logUsedCpu(() => (Memory.stats = {}), "ReadMemory", _Manager_1.ManagerPriority.Critical);
	    if ((Game.time % 3) === 0) {
	        global.intel = undefined;
	    }
	    if (Memory.settings === undefined) {
	        Memory.settings = {};
	        Memory.settings.bot = true;
	    }
	    if (Memory.settings.creditsToMaintain === undefined) {
	        Memory.settings.creditsToMaintain = 250000;
	    }
	    if (Memory.settings.loggingLevel === undefined) {
	        Memory.settings.loggingLevel = 3;
	    }
	    if (Memory.settings.user === undefined) {
	        Memory.settings.user = getUserName();
	    }
	    let creepService = new Creep_1.CreepService();
	    let roomService = new Room_1.RoomService();
	    for (let room of roomService.getMyRooms()) {
	        Memory.stats['room.' + room.name + '.energyHarvested'] = 0;
	        Memory.stats['room.' + room.name + '.energyUpgraded'] = 0;
	        Memory.stats['room.' + room.name + '.wallsRepaired'] = 0;
	        Memory.stats['room.' + room.name + '.creepCpu'] = 0;
	        Memory.stats['room.' + room.name + '.creepCost'] = 0;
	    }
	    let cpuLimit = getCpuLimit();
	    let managerList = [
	        new Memory_1.MemoryManager(),
	        new Intel_1.IntelManager(),
	        new Upgrade_1.UpgradeManager(roomService, creepService),
	        new Interface_1.InterfaceManager(),
	        new Logistics_1.LogisticsManager(roomService, creepService),
	        new Expansion_1.ExpansionManager(roomService, creepService),
	        new Roomlevel_1.RoomlevelManager(roomService),
	        new Scouting_1.ScoutingManager(roomService, creepService),
	        new Outpost_1.OutpostManager(roomService, creepService),
	        new Mineral_1.MineralManager(roomService, creepService),
	        new Defense_1.DefenseManager(roomService, creepService),
	        new Boost_1.BoostManager(roomService, creepService),
	        new Operation_1.OperationManager(roomService, creepService),
	        new Praiseroom_1.PraiseroomManager(roomService, creepService),
	        new Military_1.MilitaryManager(roomService, creepService),
	        new Market_1.MarketManager(),
	        new Crisis_1.CrisisManager(roomService, creepService),
	        new Link_1.LinkManager(roomService),
	        new Mining_1.MiningManager(roomService, creepService),
	        new Hauling_1.HaulingManager(roomService, creepService),
	        new Power_1.PowerManager(roomService, creepService),
	        new Trade_1.TradeManager(roomService),
	        new Build_1.BuildManager(roomService, creepService),
	        new Maintainence_1.MaintainenceManager(roomService, creepService),
	        new Road_1.RoadManager(roomService),
	        new Lab_1.LabManager(roomService),
	        new Wall_1.WallManager(roomService, creepService),
	        new Poaching_1.PoachingManager(roomService, creepService),
	        new Harass_1.HarassManager(roomService, creepService)
	    ];
	    let spawnManager = new Spawn_1.SpawnManager(roomService);
	    let lastRun;
	    let level = _Manager_1.ManagerPriority.Critical;
	    for (let manager of managerList) {
	        logUsedCpu(manager, manager.constructor.name, _Manager_1.ManagerPriority.Critical, _Manager_1.ManagerPriority.Critical);
	        lastRun = manager.constructor.name;
	    }
	    for (let manager of managerList) {
	        if (Game.cpu.getUsed() < cpuLimit) {
	            logUsedCpu(manager, manager.constructor.name, _Manager_1.ManagerPriority.Standard, _Manager_1.ManagerPriority.Standard);
	            lastRun = manager.constructor.name;
	            level = _Manager_1.ManagerPriority.Standard;
	        }
	    }
	    for (let manager of managerList) {
	        if (Game.cpu.getUsed() < cpuLimit) {
	            logUsedCpu(manager, manager.constructor.name, _Manager_1.ManagerPriority.Low, _Manager_1.ManagerPriority.Low);
	            lastRun = manager.constructor.name;
	            level = _Manager_1.ManagerPriority.Low;
	        }
	    }
	    for (let manager of managerList) {
	        if (Game.cpu.getUsed() < cpuLimit) {
	            logUsedCpu(manager, manager.constructor.name, _Manager_1.ManagerPriority.Trivial, _Manager_1.ManagerPriority.Trivial);
	            lastRun = manager.constructor.name;
	            level = _Manager_1.ManagerPriority.Trivial;
	        }
	    }
	    if (Game.cpu.bucket > 9500) {
	        for (let manager of managerList) {
	            if (Game.cpu.getUsed() < cpuLimit) {
	                logUsedCpu(manager, manager.constructor.name, _Manager_1.ManagerPriority.Overflow, _Manager_1.ManagerPriority.Overflow);
	                lastRun = manager.constructor.name;
	                level = _Manager_1.ManagerPriority.Overflow;
	            }
	        }
	    }
	    if (Game.cpu.getUsed() < cpuLimit) {
	        level = 6;
	    }
	    logUsedCpu(spawnManager, "SpawnManager", _Manager_1.ManagerPriority.Critical);
	    Memory.stats['cpu.level'] = level;
	    if (Memory.settings.bot !== true) {
	        logUsedCpu(Stats.recordStats, "Stats", _Manager_1.ManagerPriority.Critical, roomService.getMyRooms());
	        SegmentRepository.saveStats();
	    }
	    delete Memory.stats;
	}
	exports.run = run;
	function getCpuLimit() {
	    if (Game.cpu.bucket > 9900) {
	        return Game.cpu.limit * 1.6;
	    }
	    else if (Game.cpu.bucket > 9600) {
	        return Game.cpu.limit * 1.3;
	    }
	    else if (Game.cpu.bucket > 9200) {
	        return Game.cpu.limit * 1.1;
	    }
	    else if (Game.cpu.bucket > 8600) {
	        return Game.cpu.limit * 0.9;
	    }
	    else if (Game.cpu.bucket > 8000) {
	        return Game.cpu.limit * 0.8;
	    }
	    else if (Game.cpu.bucket > 7000) {
	        return Game.cpu.limit * 0.7;
	    }
	    else {
	        return Game.cpu.limit * 0.5;
	    }
	}
	function logUsedCpu(func, name, pri, ...args) {
	    let cpuUsed = Game.cpu.getUsed();
	    let result = undefined;
	    if (func instanceof _Manager_1.Manager) {
	        result = func.run(pri);
	    }
	    else {
	        result = func(...args);
	    }
	    let usedCpu = Game.cpu.getUsed() - cpuUsed;
	    Memory.stats['cpu.manager.' + name + "." + pri] = usedCpu;
	    if (Memory.stats['cpu.manager.' + name + ".total"] === undefined) {
	        Memory.stats['cpu.manager.' + name + ".total"] = usedCpu;
	    }
	    else {
	        Memory.stats['cpu.manager.' + name + ".total"] += usedCpu;
	    }
	    return result;
	}
	function getUserName() {
	    let spawnNames = Object.keys(Game.spawns);
	    if (spawnNames.length === 0) {
	        return;
	    }
	    return Game.spawns[spawnNames[0]].owner.username;
	}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	StructureController.prototype.getContainerPosition = function () {
	    if (this.room.memory.controllerContainerPos !== undefined) {
	        let pos = this.room.memory.controllerContainerPos;
	        return new RoomPosition(pos.x, pos.y, pos.roomName);
	    }
	    let positions = this.getPossibleContainerPositions();
	    if (positions.length === 0) {
	        return this.getOkeyContainerPosition();
	    }
	    if (positions.length === 1) {
	        return positions[0];
	    }
	    let spawn = this.room.getSpawn();
	    if (!(spawn instanceof Spawn)) {
	        return undefined;
	    }
	    let storagepos = new RoomPosition(spawn.pos.x, spawn.pos.y + 3, spawn.pos.roomName);
	    let distanceToStorage = [];
	    for (let positionId in positions) {
	        let position = positions[positionId];
	        distanceToStorage[positionId] = PathfindingUtilities.getDistanseBetween(position, storagepos);
	    }
	    let minDistanseId = undefined;
	    for (let positionId in distanceToStorage) {
	        if (minDistanseId === undefined || distanceToStorage[parseInt(positionId)] < distanceToStorage[parseInt(minDistanseId)]) {
	            minDistanseId = positionId;
	        }
	    }
	    if (minDistanseId !== undefined) {
	        this.room.memory.controllerContainerPos = positions[parseInt(minDistanseId)];
	        return positions[parseInt(minDistanseId)];
	    }
	    return undefined;
	};
	StructureController.prototype.getPossibleContainerPositions = function () {
	    let positions = [];
	    for (let x = -2; x < 3; x++) {
	        for (let y = -2; y < 3; y++) {
	            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
	            if ((Math.abs(x) === 2 || Math.abs(y) === 2) && position.hasFreeSpaceAround()) {
	                positions.push(position);
	            }
	        }
	    }
	    return positions;
	};
	StructureController.prototype.getOkeyContainerPosition = function () {
	    let bestPos = undefined;
	    let freeSpace = 0;
	    for (let x = -2; x < 3; x++) {
	        for (let y = -2; y < 3; y++) {
	            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
	            if ((Math.abs(x) === 2 || Math.abs(y) === 2)) {
	                let free = position.getFreeSpaceAround();
	                if (position === undefined || freeSpace < free) {
	                    bestPos = position;
	                    freeSpace = free;
	                }
	            }
	        }
	    }
	    return bestPos;
	};
	StructureController.prototype.buildControllerContainer = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return;
	    }
	    containerpos.createConstructionSite(STRUCTURE_CONTAINER);
	};
	StructureController.prototype.buildControllerLink = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return;
	    }
	    let buildings = containerpos.lookFor(LOOK_STRUCTURES);
	    for (let b of buildings) {
	        if (b.structureType === STRUCTURE_CONTAINER) {
	            b.destroy();
	        }
	    }
	    containerpos.createConstructionSite(STRUCTURE_LINK);
	};
	StructureController.prototype.hasContainer = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return false;
	    }
	    let buildings = containerpos.lookFor(LOOK_STRUCTURES);
	    for (let b of buildings) {
	        if (b.structureType === STRUCTURE_CONTAINER) {
	            return true;
	        }
	    }
	    return false;
	};
	StructureController.prototype.hasLink = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return false;
	    }
	    let buildings = containerpos.lookFor(LOOK_STRUCTURES);
	    for (let b of buildings) {
	        if (b.structureType === STRUCTURE_LINK) {
	            return true;
	        }
	    }
	    return false;
	};
	StructureController.prototype.getContainer = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return undefined;
	    }
	    let buildings = containerpos.lookFor(LOOK_STRUCTURES);
	    for (let b of buildings) {
	        if (b.structureType === STRUCTURE_CONTAINER) {
	            return b;
	        }
	    }
	    return undefined;
	};
	StructureController.prototype.getContainerOrLink = function () {
	    let containerpos = this.getContainerPosition();
	    if (containerpos === undefined) {
	        return undefined;
	    }
	    let buildings = containerpos.lookFor(LOOK_STRUCTURES);
	    for (let b of buildings) {
	        if (b.structureType === STRUCTURE_CONTAINER || b.structureType === STRUCTURE_LINK) {
	            return b;
	        }
	    }
	    return undefined;
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ExtensionLib = __webpack_require__(4);
	const roomtype_1 = __webpack_require__(9);
	const RoomRepository = __webpack_require__(10);
	function getDistanseBetween(position1, position2) {
	    return PathFinder.search(position1, { pos: position2, range: 1 }).path.length - 1;
	}
	exports.getDistanseBetween = getDistanseBetween;
	function getKitingRoomCallback(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_ROAD) {
	            costs.set(structure.pos.x, structure.pos.y, 2);
	        }
	        else if (structure.structureType !== STRUCTURE_CONTAINER &&
	            (structure.structureType !== STRUCTURE_RAMPART ||
	                !(structure instanceof OwnedStructure && structure.my))) {
	            costs.set(structure.pos.x, structure.pos.y, 0xff);
	        }
	    });
	    room.find(FIND_HOSTILE_CREEPS, {
	        filter: function (c) {
	            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
	        }
	    }).forEach(function (hostileCreep) {
	        for (let x = -3; x < 4; x++) {
	            for (let y = -3; y < 4; y++) {
	                costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 10);
	                if (Math.abs(x) < 3 && Math.abs(y) < 3) {
	                    costs.set(hostileCreep.pos.x, hostileCreep.pos.y, 20);
	                }
	            }
	        }
	    });
	    room.find(FIND_CREEPS).forEach(function (creep) {
	        costs.set(creep.pos.x, creep.pos.y, 0xff);
	    });
	    return costs;
	}
	exports.getKitingRoomCallback = getKitingRoomCallback;
	function getOffroadRoomCallback(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_ROAD) {
	            costs.set(structure.pos.x, structure.pos.y, 20);
	        }
	        else if (structure.structureType !== STRUCTURE_CONTAINER &&
	            (structure.structureType !== STRUCTURE_RAMPART ||
	                !(structure instanceof OwnedStructure && structure.my))) {
	            costs.set(structure.pos.x, structure.pos.y, 0xff);
	        }
	    });
	    room.find(FIND_CREEPS).forEach(function (creep) {
	        costs.set(creep.pos.x, creep.pos.y, 0xff);
	    });
	    return costs;
	}
	exports.getOffroadRoomCallback = getOffroadRoomCallback;
	function getRoadPathBetween(pos1, pos2, allowSK = false) {
	    let callback = getRoomCallbackForRoadbuilding;
	    if (allowSK) {
	        callback = getRoomCallbackForRoadbuildingSKallowed;
	    }
	    let path = findRoadPath({ pos: pos1 }, { pos: pos2 }, callback);
	    if (path === undefined) {
	        console.log("Problem with roadBuilding between " + pos1 + " and " + pos2);
	        return [];
	    }
	    return path;
	}
	exports.getRoadPathBetween = getRoadPathBetween;
	function findRoadPath(origin, destination, cMatrix) {
	    let options = {
	        ignoreCreeps: true,
	        range: 1,
	        maxOps: 40000,
	        obstacles: [],
	    };
	    let allowedRooms = [origin.pos.roomName].concat(RoomRepository.getAllOutposts(Game.rooms[origin.pos.roomName]));
	    let callback = (roomName) => {
	        if (allowedRooms) {
	            if (!_.contains(allowedRooms, roomName)) {
	                return false;
	            }
	        }
	        let outcome = cMatrix(roomName);
	        return outcome;
	    };
	    return PathFinder.search(origin.pos, { pos: destination.pos, range: options.range }, {
	        maxOps: options.maxOps,
	        plainCost: 2,
	        roomCallback: callback,
	        swampCost: 3,
	    }).path;
	}
	function getRoomCallbackForRoadbuilding(roomName, allowSK = false) {
	    let room = Game.rooms[roomName];
	    let costs = new PathFinder.CostMatrix;
	    if (allowSK !== true) {
	        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	        let fMod = parsed[1] % 10;
	        let sMod = parsed[2] % 10;
	        let isSK = !(fMod === 5 && sMod === 5) &&
	            ((fMod >= 4) && (fMod <= 6)) &&
	            ((sMod >= 4) && (sMod <= 6));
	        if (isSK) {
	            let x, y, t;
	            for (x = 0; x < 50; x++) {
	                for (y = 0; y < 50; y++) {
	                    t = Game.map.getTerrainAt(x, y, roomName);
	                    if (t === "plain" || t === "swamp") {
	                        costs.set(x, y, 0xfe);
	                    }
	                }
	            }
	            return costs;
	        }
	    }
	    let x, y, t;
	    for (x = 0; x < 50; x++) {
	        for (y = 0; y < 50; y++) {
	            t = Game.map.getTerrainAt(x, y, roomName);
	            if (t === "plain") {
	                costs.set(x, y, 2);
	            }
	            else if (t === "swamp") {
	                costs.set(x, y, 3);
	            }
	        }
	    }
	    if (!room) {
	        return costs;
	    }
	    ;
	    if (allowSK === true) {
	        room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) { return s.structureType === STRUCTURE_KEEPER_LAIR; } }).forEach(function (lair) {
	            let x, y, t;
	            for (x = -2; x < 3; x++) {
	                for (y = -2; y < 3; y++) {
	                    t = Game.map.getTerrainAt(lair.pos.x + x, lair.pos.y + y, roomName);
	                    if (t === "plain" || t === "swamp") {
	                        costs.set(lair.pos.x + x, lair.pos.y + y, 12);
	                    }
	                }
	            }
	        });
	    }
	    room.find(FIND_SOURCES).forEach(function (source) {
	        let pos = source.pos;
	        let containerpos = source.getContainerPosition();
	        if (containerpos !== undefined) {
	            pos = containerpos;
	        }
	        let x, y, t;
	        for (x = -1; x < 2; x++) {
	            for (y = -1; y < 2; y++) {
	                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
	                if (t === "plain" || t === "swamp") {
	                    costs.set(pos.x + x, pos.y + y, 8);
	                }
	            }
	        }
	    });
	    room.find(FIND_MINERALS).forEach(function (mineral) {
	        let pos = mineral.pos;
	        let containerpos = mineral.getContainerPosition();
	        if (containerpos !== undefined) {
	            pos = containerpos;
	        }
	        let x, y, t;
	        for (x = -1; x < 2; x++) {
	            for (y = -1; y < 2; y++) {
	                t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
	                if (t === "plain" || t === "swamp") {
	                    costs.set(pos.x + x, pos.y + y, 8);
	                }
	            }
	        }
	    });
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_ROAD) {
	            costs.set(structure.pos.x, structure.pos.y, 1);
	        }
	        else if (structure.structureType === STRUCTURE_CONTROLLER) {
	            let pos = structure.pos;
	            let containerpos = structure.getContainerPosition();
	            if (containerpos !== undefined) {
	                pos = containerpos;
	            }
	            let x, y, t;
	            for (x = -1; x < 2; x++) {
	                for (y = -1; y < 2; y++) {
	                    t = Game.map.getTerrainAt(pos.x + x, pos.y + y, roomName);
	                    if (t === "plain" || t === "swamp") {
	                        costs.set(pos.x + x, pos.y + y, 8);
	                    }
	                }
	            }
	        }
	        else if (structure.structureType !== STRUCTURE_CONTAINER &&
	            (structure.structureType !== STRUCTURE_RAMPART ||
	                !(structure instanceof OwnedStructure && structure.my))) {
	            costs.set(structure.pos.x, structure.pos.y, 0xff);
	        }
	    });
	    if (room.controller !== undefined && room.controller.my && room.memory.t === roomtype_1.Roomtype.Normal) {
	        let basePos = RoomRepository.getBasePosition(room);
	        if (basePos !== undefined) {
	            let exts = ExtensionLib.getExtensionPositions(room, basePos);
	            for (let epos of exts) {
	                costs.set(epos.x, epos.y, 0xFE);
	            }
	            costs.set(basePos.x - 2, basePos.y + 1, 0xFE);
	            costs.set(basePos.x - 3, basePos.y + 2, 0xFE);
	            costs.set(basePos.x - 3, basePos.y + 3, 0xFE);
	            costs.set(basePos.x - 2, basePos.y + 2, 0xFE);
	            costs.set(basePos.x + 2, basePos.y + 1, 0xFE);
	            costs.set(basePos.x + 3, basePos.y + 2, 0xFE);
	            costs.set(basePos.x + 3, basePos.y + 3, 0xFE);
	            costs.set(basePos.x + 2, basePos.y + 2, 0xFE);
	            costs.set(basePos.x - 1, basePos.y - 1, 0xFE);
	            costs.set(basePos.x + 1, basePos.y - 1, 0xFE);
	            costs.set(basePos.x, basePos.y + 2, 0xFE);
	            costs.set(basePos.x, basePos.y + 3, 0xFE);
	            costs.set(basePos.x - 1, basePos.y + 4, 0xFE);
	            costs.set(basePos.x + 1, basePos.y + 4, 0xFE);
	            costs.set(basePos.x - 2, basePos.y + 5, 0xFE);
	            costs.set(basePos.x - 1, basePos.y + 5, 0xFE);
	            costs.set(basePos.x, basePos.y + 5, 0xFE);
	            costs.set(basePos.x + 1, basePos.y + 5, 0xFE);
	            costs.set(basePos.x + 2, basePos.y + 5, 0xFE);
	            costs.set(basePos.x - 2, basePos.y + 6, 0xFE);
	            costs.set(basePos.x - 1, basePos.y + 6, 0xFE);
	            costs.set(basePos.x, basePos.y + 6, 0xFE);
	            costs.set(basePos.x + 1, basePos.y + 6, 0xFE);
	            costs.set(basePos.x + 2, basePos.y + 6, 0xFE);
	            costs.set(basePos.x - 1, basePos.y + 7, 0xFE);
	            costs.set(basePos.x, basePos.y + 7, 0xFE);
	            costs.set(basePos.x + 1, basePos.y + 7, 0xFE);
	        }
	    }
	    return costs;
	}
	exports.getRoomCallbackForRoadbuilding = getRoomCallbackForRoadbuilding;
	function getRoomCallbackForRoadbuildingSKallowed(roomName) {
	    return getRoomCallbackForRoadbuilding(roomName, true);
	}
	exports.getRoomCallbackForRoadbuildingSKallowed = getRoomCallbackForRoadbuildingSKallowed;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	function simExtensions(basePos) {
	    let cpu = Game.cpu.getUsed();
	    let extensionInfo = getRoomExtensionPositions(basePos);
	    console.log("Extensionmath: " + (Game.cpu.getUsed() - cpu));
	    console.log("Number of extensions: " + extensionInfo.ext.length);
	    for (let e of extensionInfo.ext) {
	        let p = longPosRoom(e);
	        new RoomVisual(p.roomName).rect(p.x - 0.5, p.y - 0.5, 1, 1);
	    }
	    for (let e of extensionInfo.roads) {
	        let p = longPosRoom(e);
	        new RoomVisual(p.roomName).rect(p.x - 0.5, p.y - 0.5, 1, 1, { fill: "#0000FF" });
	    }
	    new RoomVisual(basePos.roomName).rect(basePos.x - 3.5, basePos.y - 1.5, 7, 7, { fill: "#FFFF00" });
	    new RoomVisual(basePos.roomName).rect(basePos.x - 2.5, basePos.y + 5.5, 5, 1, { fill: "#FFFF00" });
	    new RoomVisual(basePos.roomName).rect(basePos.x - 1.5, basePos.y + 6.5, 3, 1, { fill: "#FFFF00" });
	}
	exports.simExtensions = simExtensions;
	function getExtensionPositions(room, basePos) {
	    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
	        let posInfo = getRoomExtensionPositions(basePos);
	        room.memory.extPos = JSON.stringify(posInfo.ext);
	        room.memory.extRoads = JSON.stringify(posInfo.roads);
	    }
	    let positionInfo = JSON.parse(room.memory.extPos);
	    let positions = [];
	    for (let p of positionInfo) {
	        positions.push(longPosRoom(p));
	    }
	    return positions;
	}
	exports.getExtensionPositions = getExtensionPositions;
	function getExtensions(room, basePos) {
	    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
	        let posInfo = getRoomExtensionPositions(basePos);
	        room.memory.extPos = JSON.stringify(posInfo.ext);
	        room.memory.extRoads = JSON.stringify(posInfo.roads);
	    }
	    let positionInfo = JSON.parse(room.memory.extPos);
	    let exts = [];
	    for (let p of positionInfo) {
	        let position = longPosRoom(p);
	        let atpos = position.lookFor(LOOK_STRUCTURES);
	        for (let s of atpos) {
	            if (s.structureType === STRUCTURE_EXTENSION) {
	                exts.push(s);
	            }
	        }
	    }
	    return exts;
	}
	exports.getExtensions = getExtensions;
	function getExtensionRoads(room, basePos) {
	    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
	        let posInfo = getRoomExtensionPositions(basePos);
	        room.memory.extPos = JSON.stringify(posInfo.ext);
	        room.memory.extRoads = JSON.stringify(posInfo.roads);
	    }
	    let positionInfo = JSON.parse(room.memory.extRoads);
	    let extroads = [];
	    for (let p of positionInfo) {
	        let position = longPosRoom(p);
	        let atpos = position.lookFor(LOOK_STRUCTURES);
	        for (let s of atpos) {
	            if (s.structureType === STRUCTURE_ROAD) {
	                extroads.push(s);
	            }
	        }
	    }
	    return extroads;
	}
	exports.getExtensionRoads = getExtensionRoads;
	function destroyExtensionsNotCorrectlyPlaced(room, basePos) {
	    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
	        let posInfo = getRoomExtensionPositions(basePos);
	        room.memory.extPos = JSON.stringify(posInfo.ext);
	        room.memory.extRoads = JSON.stringify(posInfo.roads);
	    }
	    let count = 0;
	    let positionInfo = JSON.parse(room.memory.extPos);
	    let extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
	    for (let e of extensions) {
	        if (!_.contains(positionInfo, shortPosRoom(e.pos))) {
	            count++;
	            e.destroy();
	        }
	    }
	    if (count > 0) {
	        console.log("Running destroy extensions in room " + room.name);
	        console.log("Room " + room.name + " destroyed " + count + " extensions.");
	    }
	    let linkpos = new RoomPosition(basePos.x, basePos.y - 2, basePos.roomName);
	    let atPos = linkpos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_LINK) {
	            s.destroy();
	            console.log("Destroyed outdated link");
	        }
	    }
	}
	exports.destroyExtensionsNotCorrectlyPlaced = destroyExtensionsNotCorrectlyPlaced;
	function getRoadPositions(room, basePos) {
	    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
	        let posInfo = getRoomExtensionPositions(basePos);
	        room.memory.extPos = JSON.stringify(posInfo.ext);
	        room.memory.extRoads = JSON.stringify(posInfo.roads);
	    }
	    let positionInfo = JSON.parse(room.memory.extRoads);
	    let positions = [];
	    for (let p of positionInfo) {
	        positions.push(longPosRoom(p));
	    }
	    return positions;
	}
	exports.getRoadPositions = getRoadPositions;
	function getRoomExtensionPositions(basePos) {
	    let roadPositions = [];
	    let extPositions = [];
	    addMainWings(basePos, extPositions, roadPositions);
	    extPositions = _.uniq(extPositions);
	    for (let r of roadPositions) {
	        _.pull(extPositions, r);
	    }
	    if (extPositions.length < 60) {
	        addLowerWings(basePos, extPositions, roadPositions);
	    }
	    extPositions = _.uniq(extPositions);
	    for (let r of roadPositions) {
	        _.pull(extPositions, r);
	    }
	    removeExtensionToVitalTargets(basePos, extPositions);
	    if (extPositions.length > 60) {
	        extPositions = extPositions.slice(0, 60);
	    }
	    else if (extPositions.length < 60) {
	        addSingleExtensions(basePos, extPositions);
	    }
	    return { ext: extPositions, roads: roadPositions };
	}
	exports.getRoomExtensionPositions = getRoomExtensionPositions;
	function addSingleExtensions(basePos, extPositions) {
	    let cm = new PathFinder.CostMatrix;
	    for (let x of _.range(0, 50)) {
	        for (let y of _.range(0, 50)) {
	            let terrain = Game.map.getTerrainAt(x, y, basePos.roomName);
	            if (terrain === "wall") {
	                cm.set(x, y, 1);
	            }
	            else if (x < 3 || x > 46 || y < 3 || y > 46) {
	                cm.set(x, y, 1);
	            }
	        }
	    }
	    for (let x of _.range(-3, 4)) {
	        for (let y of _.range(-1, 6)) {
	            cm.set(basePos.x + x, basePos.y + y, 1);
	        }
	    }
	    for (let x of _.range(-2, 3)) {
	        cm.set(basePos.x + x, basePos.y + 6, 1);
	    }
	    for (let x of _.range(-1, 2)) {
	        cm.set(basePos.x + x, basePos.y + 7, 1);
	    }
	    for (let p of extPositions) {
	        let t = p.split("-");
	        cm.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 1);
	    }
	    let room = Game.rooms[basePos.roomName];
	    if (room !== undefined) {
	        if (room.controller !== undefined) {
	            let controllerPos = room.controller.getContainerPosition();
	            if (controllerPos !== undefined) {
	                cm.set(controllerPos.x, controllerPos.y, 1);
	            }
	        }
	        let sources = room.getSources();
	        if (sources.length > 0) {
	            for (let s of sources) {
	                let scontpos = s.getContainerPosition();
	                if (scontpos !== undefined) {
	                    cm.set(scontpos.x, scontpos.y, 1);
	                }
	            }
	        }
	    }
	    let possiblePositions = [];
	    for (let x of _.range(3, 47)) {
	        for (let y of _.range(3, 47)) {
	            if (cm.get(x, y) === 0 && x % 2 === y % 2 && posOnlyHasOneNeighbour(x, y, cm)) {
	                if (!_.contains(extPositions, shortPosRoomMaker(x, y, basePos.roomName))) {
	                    let p = new RoomPosition(x, y, basePos.roomName);
	                    if (getRangeToClosestVital(p) > 2) {
	                        possiblePositions.push(p);
	                    }
	                }
	            }
	        }
	    }
	    if (IntelLib.hasIntel(basePos.roomName)) {
	        let extcm = new PathFinder.CostMatrix();
	        for (let p of extPositions) {
	            let t = p.split("-");
	            extcm.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 0xFF);
	        }
	        let counter = 50;
	        while (extPositions.length < 60 && counter > 0 && possiblePositions.length > 0) {
	            let bestPos = basePos.findClosestByRange(possiblePositions);
	            let pathDistance = PathFinder.search(basePos, { pos: bestPos, range: 1 }, { plainCost: 1, swampCost: 1, maxRooms: 1, roomCallback: function (r) {
	                    if (Game.rooms[r] === undefined) {
	                        return extcm;
	                    }
	                    return extcm;
	                } }).path.length - 1;
	            let range = basePos.getRangeTo(bestPos);
	            if (pathDistance <= range * 1.5) {
	                extPositions.push(shortPosRoom(bestPos));
	            }
	            _.pull(possiblePositions, bestPos);
	            counter--;
	        }
	    }
	}
	function getRangeToClosestVital(p) {
	    let vitalTargets = [];
	    if (!IntelLib.hasIntel(p.roomName)) {
	        return 25;
	    }
	    for (let sId of IntelLib.sourceIds(p.roomName)) {
	        vitalTargets.push(IntelLib.sourcePos(p.roomName, sId));
	    }
	    let mPos = IntelLib.mineralPos(p.roomName);
	    if (mPos !== undefined) {
	        vitalTargets.push(mPos);
	    }
	    let cPos = IntelLib.controllerPos(p.roomName);
	    if (cPos !== null) {
	        vitalTargets.push(cPos);
	    }
	    let range = 10;
	    for (let t of vitalTargets) {
	        let r = p.getRangeTo(t);
	        if (r < range) {
	            range = r;
	        }
	    }
	    return range;
	}
	function posOnlyHasOneNeighbour(x, y, cm) {
	    if (cm.get(x - 1, y) === 1 && cm.get(x + 1, y) === 1) {
	        return false;
	    }
	    if (cm.get(x, y - 1) === 1 && cm.get(x, y + 1) === 1) {
	        return false;
	    }
	    return true;
	}
	function removeExtensionToVitalTargets(basePos, extPositions) {
	    let roomName = basePos.roomName;
	    if (!IntelLib.hasIntel(roomName)) {
	        return;
	    }
	    let vitalTargets = [];
	    for (let sId of IntelLib.sourceIds(roomName)) {
	        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
	    }
	    let cPos = IntelLib.controllerPos(roomName);
	    if (cPos !== null) {
	        vitalTargets.push(cPos);
	    }
	    let mPos = IntelLib.mineralPos(roomName);
	    if (mPos !== undefined) {
	        vitalTargets.push(mPos);
	    }
	    let cm = getExtensionRoomCallback(extPositions);
	    for (let vital of vitalTargets) {
	        let ret = PathFinder.search(basePos, { pos: vital, range: 1 }, {
	            plainCost: 1,
	            swampCost: 1,
	            roomCallback: () => cm,
	            maxRooms: 1,
	        });
	        if (ret.cost > 200) {
	            for (let p of ret.path) {
	                _.pull(extPositions, shortPosRoom(p));
	            }
	        }
	    }
	}
	function getExtensionRoomCallback(extPositions) {
	    let costs = new PathFinder.CostMatrix;
	    for (let p of extPositions) {
	        let t = p.split("-");
	        costs.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 0xfe);
	    }
	    return costs;
	}
	function addLowerWings(basePos, extPositions, roadPositions) {
	    for (let s of [-1, 1]) {
	        roadPositions.push(shortPosRoomMaker(basePos.x + (s * 3), basePos.y + 1, basePos.roomName));
	        roadPositions.push(shortPosRoomMaker(basePos.x + (s * 4), basePos.y + 2, basePos.roomName));
	        for (let i of [5, 6]) {
	            let testPos = new RoomPosition(basePos.x + (s * i), basePos.y - 2 + i, basePos.roomName);
	            if (buildableAroundPos(testPos) && getRangeToClosestVital(testPos) > 3) {
	                roadPositions.push(shortPosRoom(testPos));
	                addPositionsAround(testPos, extPositions);
	            }
	            else {
	                break;
	            }
	        }
	        let t1 = Game.map.getTerrainAt(basePos.x + (s * 4), basePos.y + 1, basePos.roomName);
	        if (t1 === "swamp" || t1 === "plain") {
	            if (!(basePos.x + (s * 4) < 3 || basePos.x + (s * 4) > 46 || basePos.y + 1 < 3 || basePos.y + 1 > 46)) {
	                extPositions.push(shortPosRoomMaker(basePos.x + (s * 4), basePos.y + 1, basePos.roomName));
	            }
	        }
	        let t2 = Game.map.getTerrainAt(basePos.x + (s * 5), basePos.y + 1, basePos.roomName);
	        if (t2 === "swamp" || t2 === "plain") {
	            if (!(basePos.x + (s * 5) < 3 || basePos.x + (s * 5) > 46 || basePos.y + 1 < 3 || basePos.y + 1 > 46)) {
	                extPositions.push(shortPosRoomMaker(basePos.x + (s * 5), basePos.y + 1, basePos.roomName));
	            }
	        }
	    }
	}
	function addMainWings(basePos, extPositions, roadPositions) {
	    roadPositions.push(shortPosRoomMaker(basePos.x, basePos.y - 1, basePos.roomName));
	    for (let s of [-1, 1]) {
	        roadPositions.push(shortPosRoomMaker(basePos.x + (s * 1), basePos.y - 2, basePos.roomName));
	        for (let i of [2, 3, 4]) {
	            let testPos = new RoomPosition(basePos.x + (s * i), basePos.y - 1 - i, basePos.roomName);
	            if (buildableAroundPos(testPos) && getRangeToClosestVital(testPos) > 3) {
	                roadPositions.push(shortPosRoom(testPos));
	                addPositionsAround(testPos, extPositions);
	            }
	            else {
	                break;
	            }
	            if (i === 4) {
	                for (let s2 of [-1, 1]) {
	                    for (let j of [1, 2]) {
	                        let newTestPos = new RoomPosition(testPos.x + (s * s2 * j), testPos.y + (s2 * j), testPos.roomName);
	                        if (buildableAroundPos(newTestPos) && getRangeToClosestVital(testPos) > 3) {
	                            roadPositions.push(shortPosRoom(newTestPos));
	                            addPositionsAround(newTestPos, extPositions);
	                        }
	                        else {
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        let t = Game.map.getTerrainAt(basePos.x + (s * 3), basePos.y - 1, basePos.roomName);
	        if (t === "swamp" || t === "plain") {
	            extPositions.push(shortPosRoomMaker(basePos.x + (s * 3), basePos.y - 1, basePos.roomName));
	        }
	    }
	}
	function buildableAroundPos(pos) {
	    let count = 0;
	    for (let x of [-1, 0, 1]) {
	        for (let y of [-1, 0, 1]) {
	            if (pos.x + x < 3 || pos.x + x > 46 || pos.y + y < 3 || pos.y + y > 46) {
	                return false;
	            }
	            let terrain = Game.map.getTerrainAt(pos.x + x, pos.y + y, pos.roomName);
	            if (terrain !== "swamp" && terrain !== "plain") {
	                if (x === 0 && y === 0) {
	                    return false;
	                }
	                else if (count > 2) {
	                    return false;
	                }
	                count++;
	            }
	        }
	    }
	    return true;
	}
	function addPositionsAround(pos, list) {
	    for (let x of [-1, 0, 1]) {
	        for (let y of [-1, 0, 1]) {
	            if (x !== 0 || y !== 0) {
	                let terrain = Game.map.getTerrainAt(pos.x + x, pos.y + y, pos.roomName);
	                if (terrain === "swamp" || terrain === "plain") {
	                    list.push(shortPosRoomMaker(pos.x + x, pos.y + y, pos.roomName));
	                }
	            }
	        }
	    }
	}
	function shortPosRoomMaker(x, y, roomName) {
	    return x + "-" + y + "-" + roomName;
	}
	function shortPosRoom(pos) {
	    return pos.x + "-" + pos.y + "-" + pos.roomName;
	}
	function longPosRoom(pos) {
	    let split = pos.split("-");
	    return new RoomPosition(+split[0], +split[1], split[2]);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const hostility_1 = __webpack_require__(6);
	const Logger_1 = __webpack_require__(7);
	function hasIntel(roomName) {
	    if (global.intel === undefined) {
	        global.intel = {};
	    }
	    if (global.intel[roomName] === undefined) {
	        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].i !== undefined) {
	            if (Memory.rooms[roomName].i.t !== undefined) {
	                Memory.rooms[roomName].i = JSON.stringify(Memory.rooms[roomName].i);
	            }
	            global.intel[roomName] = JSON.parse(Memory.rooms[roomName].i);
	            return true;
	        }
	    }
	    else {
	        return true;
	    }
	    return false;
	}
	exports.hasIntel = hasIntel;
	function needsNewIntel(roomName) {
	    if ((!hasIntel(roomName) || global.intel[roomName].t + 20000 < Game.time) && Game.map.isRoomAvailable(roomName)) {
	        return true;
	    }
	    return false;
	}
	exports.needsNewIntel = needsNewIntel;
	function hasInvaders(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h === hostility_1.Hostility.Invaders) {
	        return true;
	    }
	    return false;
	}
	exports.hasInvaders = hasInvaders;
	function hasHostiles(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h > hostility_1.Hostility.None) {
	        return true;
	    }
	    return false;
	}
	exports.hasHostiles = hasHostiles;
	function hasDangerousHostiles(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h > hostility_1.Hostility.HarmlessHostiles) {
	        return true;
	    }
	    return false;
	}
	exports.hasDangerousHostiles = hasDangerousHostiles;
	function isOccupied(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h >= hostility_1.Hostility.Reserved) {
	        return true;
	    }
	    return false;
	}
	exports.isOccupied = isOccupied;
	function towerCount(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].towers !== undefined) {
	        return global.intel[roomName].towers;
	    }
	    return 0;
	}
	exports.towerCount = towerCount;
	function isInsafeMode(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].safeMode !== undefined) {
	        return (global.intel[roomName].t + global.intel[roomName].safeMode > Game.time);
	    }
	    return false;
	}
	exports.isInsafeMode = isInsafeMode;
	function isOwned(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h >= hostility_1.Hostility.Controlled) {
	        return true;
	    }
	    return false;
	}
	exports.isOwned = isOwned;
	function roomHostility(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].h !== undefined) {
	        return global.intel[roomName].h;
	    }
	    return hostility_1.Hostility.None;
	}
	exports.roomHostility = roomHostility;
	function roomLevel(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].l !== undefined) {
	        return global.intel[roomName].l;
	    }
	    return undefined;
	}
	exports.roomLevel = roomLevel;
	function isReservedByMe(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
	        return true;
	    }
	    return false;
	}
	exports.isReservedByMe = isReservedByMe;
	function isReservedByMeFor(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
	        return global.intel[roomName].res;
	    }
	    return 0;
	}
	exports.isReservedByMeFor = isReservedByMeFor;
	function isOwnedByMe(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res === undefined) {
	        return true;
	    }
	    return false;
	}
	exports.isOwnedByMe = isOwnedByMe;
	function sourceCount(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
	        return Object.keys(global.intel[roomName].s).length;
	    }
	    return 0;
	}
	exports.sourceCount = sourceCount;
	function sourceIds(roomName) {
	    let sourceIds = [];
	    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
	        for (let id of Object.keys(global.intel[roomName].s)) {
	            sourceIds.push(id);
	        }
	    }
	    return sourceIds;
	}
	exports.sourceIds = sourceIds;
	function mineralType(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
	        let split = global.intel[roomName].m.split("-");
	        if (split.length === 4) {
	            return split[1];
	        }
	    }
	}
	exports.mineralType = mineralType;
	function mineralPos(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
	        let split = global.intel[roomName].m.split("-");
	        if (split.length === 4) {
	            return new RoomPosition(split[2], split[3], roomName);
	        }
	    }
	}
	exports.mineralPos = mineralPos;
	function sourcePos(roomName, sourceId) {
	    if (hasIntel(roomName) && global.intel[roomName].s !== undefined && global.intel[roomName].s[sourceId] !== undefined) {
	        return makeRoomPosForSourceInfo(roomName, global.intel[roomName].s[sourceId]);
	    }
	    Logger_1.log.error("IntelLib had to make a fake sourcepos for source " + sourceId, roomName);
	    return new RoomPosition(25, 25, roomName);
	}
	exports.sourcePos = sourcePos;
	function controllerPos(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
	        return makeRoomPosForControllerInfo(roomName, global.intel[roomName].c);
	    }
	    return null;
	}
	exports.controllerPos = controllerPos;
	function controllerId(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
	        return makeIdForControllerInfo(global.intel[roomName].c);
	    }
	    return null;
	}
	exports.controllerId = controllerId;
	function mineralTicks(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].mtime !== undefined) {
	        return global.intel[roomName].mtime;
	    }
	    return undefined;
	}
	exports.mineralTicks = mineralTicks;
	function intelTime(roomName) {
	    if (hasIntel(roomName) && global.intel[roomName].t !== undefined) {
	        return global.intel[roomName].t;
	    }
	    return undefined;
	}
	exports.intelTime = intelTime;
	function makeRoomPosForSourceInfo(roomName, ipos) {
	    let split = ipos.split("-");
	    if (split.length === 2) {
	        return new RoomPosition(+split[0], +split[1], roomName);
	    }
	    Logger_1.log.error("IntelLib had to make a fake sourcepos for sourceinfo: " + ipos, roomName);
	    return new RoomPosition(25, 25, roomName);
	}
	function makeRoomPosForControllerInfo(roomName, ipos) {
	    let split = ipos.split("-");
	    if (split.length === 3) {
	        return new RoomPosition(+split[1], +split[2], roomName);
	    }
	    Logger_1.log.error("IntelLib had to make a fake controllerpos: " + ipos, roomName);
	    return new RoomPosition(25, 25, roomName);
	}
	function makeIdForControllerInfo(ipos) {
	    let split = ipos.split("-");
	    if (split.length === 3) {
	        return split[0];
	    }
	    Logger_1.log.error("IntelLib had to make a fake controllerid: " + ipos, "");
	    return "";
	}
	function saveIntelForRoom(room) {
	    let hostiles = room.find(FIND_HOSTILE_CREEPS);
	    var intel = {};
	    if (room.memory.i !== undefined) {
	        if (room.memory.i.t !== undefined) {
	            room.memory.i = JSON.stringify(room.memory.i);
	        }
	        intel = JSON.parse(room.memory.i);
	    }
	    intel.t = Game.time;
	    intel.h = getRoomHostility(room, hostiles);
	    if (Memory.settings.bot === true) {
	        registerAllThreats(room, hostiles);
	    }
	    if (room.controller !== undefined) {
	        intel.c = room.controller.id + "-" + room.controller.pos.x + "-" + room.controller.pos.y;
	        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
	            room.controller.reservation.username !== Memory.settings.user && !(room.controller.my)) {
	            intel.o = room.controller.reservation.username;
	        }
	        else {
	            intel.o = undefined;
	        }
	        if (room.controller.level >= 1 && !room.controller.my) {
	            intel.l = room.controller.level;
	        }
	        else {
	            intel.l = undefined;
	        }
	        if (room.controller.level >= 3 && !room.controller.my) {
	            intel.towers = room.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER }).length;
	        }
	        else {
	            intel.towers = undefined;
	        }
	        if ((room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user) || room.controller.my) {
	            intel.my = true;
	        }
	        else {
	            intel.my = undefined;
	        }
	        if (room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user && !room.controller.my) {
	            intel.res = room.controller.reservation.ticksToEnd;
	        }
	        else {
	            intel.res = undefined;
	        }
	        if (room.controller.safeMode) {
	            intel.safeMode = room.controller.safeMode;
	        }
	        else {
	            intel.safeMode = undefined;
	        }
	    }
	    let mineral = room.getMineral();
	    if (mineral !== undefined) {
	        intel.mtime = mineral.ticksToRegeneration;
	    }
	    if (intel.s === undefined) {
	        intel.s = registerSourceInfo(room);
	    }
	    if (intel.m === undefined) {
	        intel.m = registerMineralInfo(room);
	    }
	    if (global.intel === undefined) {
	        global.intel = {};
	    }
	    global.intel[room.name] = intel;
	    room.memory.i = JSON.stringify(intel);
	}
	exports.saveIntelForRoom = saveIntelForRoom;
	function registerSourceInfo(room) {
	    let sourceInfo = {};
	    let sources = room.find(FIND_SOURCES);
	    if (sources.length > 0) {
	        for (let source of sources) {
	            sourceInfo[source.id] = source.pos.x + "-" + source.pos.y;
	        }
	    }
	    return sourceInfo;
	}
	function registerMineralInfo(room) {
	    let minerals = room.find(FIND_MINERALS);
	    if (minerals.length > 0) {
	        return minerals[0].id + "-" + minerals[0].mineralType + "-" + minerals[0].pos.x + "-" + minerals[0].pos.y;
	    }
	    return undefined;
	}
	function getRoomHostility(room, hostiles) {
	    if (room.controller !== undefined) {
	        Memory.empire.hostileRooms[room.name] = undefined;
	        if (room.controller.level >= 1 && !room.controller.my) {
	            if (Memory.empire !== undefined && Memory.empire.hostileRooms !== undefined && !_.contains(Object.keys(Memory.empire.hostileRooms), room.name)) {
	                Memory.empire.hostileRooms[room.name] = room.controller.level;
	            }
	            return hostility_1.Hostility.Controlled;
	        }
	        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
	            room.controller.reservation.username !== Memory.settings.user && room.controller.reservation.ticksToEnd > 0) {
	            return hostility_1.Hostility.Reserved;
	        }
	    }
	    let highest = hostility_1.Hostility.None;
	    if (hostiles.length > 0) {
	        for (let hostile of hostiles) {
	            if (hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
	                if (dangerousHostile(hostile)) {
	                    return hostility_1.Hostility.Hostiles;
	                }
	                else {
	                    if (highest !== hostility_1.Hostility.Invaders) {
	                        highest = hostility_1.Hostility.HarmlessHostiles;
	                    }
	                }
	            }
	            if (hostile["owner"]["username"] === "Invader") {
	                highest = hostility_1.Hostility.Invaders;
	            }
	        }
	    }
	    return highest;
	}
	function dangerousHostile(hostile) {
	    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
	}
	function registerAllThreats(room, hostiles) {
	    if (room.controller === undefined || hostiles.length === 0) {
	        return;
	    }
	    if (room.controller.my || (room.controller.reservation !== undefined &&
	        room.controller.reservation.username !== undefined && room.controller.reservation.username === Memory.settings.user)) {
	        for (let hostile of hostiles) {
	            if (hostile.body.length > 1 && hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
	                if (room.controller.my) {
	                    if (hostile.body.length > 10) {
	                        if (hostile.body[0].boost !== undefined) {
	                            addThreatToPlayer(hostile["owner"]["username"], 30);
	                        }
	                        else {
	                            addThreatToPlayer(hostile["owner"]["username"], 10);
	                        }
	                    }
	                    else {
	                        addThreatToPlayer(hostile["owner"]["username"], 5);
	                    }
	                }
	                else {
	                    if (hostile.body.length > 10) {
	                        addThreatToPlayer(hostile["owner"]["username"], 2);
	                    }
	                    else {
	                        addThreatToPlayer(hostile["owner"]["username"], 1);
	                    }
	                }
	            }
	        }
	    }
	}
	function addThreatToPlayer(name, threat) {
	    if (Memory.playerthreat === undefined) {
	        Memory.playerthreat = {};
	    }
	    if (Memory.playerthreat[name] === undefined) {
	        Memory.playerthreat[name] = threat;
	    }
	    else {
	        Memory.playerthreat[name] += threat;
	    }
	}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	(function (Hostility) {
	    Hostility[Hostility["None"] = 0] = "None";
	    Hostility[Hostility["HarmlessHostiles"] = 1] = "HarmlessHostiles";
	    Hostility[Hostility["Invaders"] = 2] = "Invaders";
	    Hostility[Hostility["Hostiles"] = 3] = "Hostiles";
	    Hostility[Hostility["Reserved"] = 4] = "Reserved";
	    Hostility[Hostility["Controlled"] = 5] = "Controlled";
	})(exports.Hostility || (exports.Hostility = {}));
	var Hostility = exports.Hostility;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const loglevel_1 = __webpack_require__(8);
	class Logger {
	    setLogLevel(newLevel) {
	        Memory.settings.loggingLevel = newLevel;
	    }
	    _log(message, room, logLevel, color = '#ffffff') {
	        if (logLevel <= Memory.settings.loggingLevel) {
	            console.log("<span style='color:" + color + "'><a href='#!/room/" + Game.shard.name + "/" + room + "'>" + room +
	                "</a> " + message + "</span>");
	        }
	    }
	    debug(message, room) {
	        this._log(message, room, loglevel_1.LogLevel.DEBUG, '#6e6770');
	    }
	    info(message, room) {
	        this._log(message, room, loglevel_1.LogLevel.INFO);
	    }
	    warning(message, room) {
	        this._log(message, room, loglevel_1.LogLevel.WARN, '#f4c542');
	    }
	    error(message, room) {
	        this._log(message, room, loglevel_1.LogLevel.ERROR, '#e50000');
	    }
	    alert(message, room) {
	        this._log(message, room, loglevel_1.LogLevel.ALERT, '#ff00d0');
	    }
	}
	exports.Logger = Logger;
	exports.log = new Logger();


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	(function (LogLevel) {
	    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
	    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
	    LogLevel[LogLevel["WARN"] = 3] = "WARN";
	    LogLevel[LogLevel["INFO"] = 4] = "INFO";
	    LogLevel[LogLevel["DEBUG"] = 5] = "DEBUG";
	})(exports.LogLevel || (exports.LogLevel = {}));
	var LogLevel = exports.LogLevel;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	(function (Roomtype) {
	    Roomtype[Roomtype["Normal"] = 1] = "Normal";
	    Roomtype[Roomtype["Beachhead"] = 2] = "Beachhead";
	    Roomtype[Roomtype["Praiseroom"] = 3] = "Praiseroom";
	    Roomtype[Roomtype["Decoration"] = 4] = "Decoration";
	    Roomtype[Roomtype["NormalAndNotExpansion"] = 101] = "NormalAndNotExpansion";
	    Roomtype[Roomtype["NormalWithExpansion"] = 102] = "NormalWithExpansion";
	    Roomtype[Roomtype["NormalWithDismantleTarget"] = 103] = "NormalWithDismantleTarget";
	    Roomtype[Roomtype["NormalWithAcceleratedPraising"] = 104] = "NormalWithAcceleratedPraising";
	    Roomtype[Roomtype["Expanion"] = 105] = "Expanion";
	    Roomtype[Roomtype["My"] = 106] = "My";
	    Roomtype[Roomtype["NormalWithPraiseroom"] = 107] = "NormalWithPraiseroom";
	    Roomtype[Roomtype["BeingAbandoned"] = 108] = "BeingAbandoned";
	    Roomtype[Roomtype["NormalNotAbandoned"] = 109] = "NormalNotAbandoned";
	    Roomtype[Roomtype["NormalUnderSiege"] = 110] = "NormalUnderSiege";
	})(exports.Roomtype || (exports.Roomtype = {}));
	var Roomtype = exports.Roomtype;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Logger_1 = __webpack_require__(7);
	const roomlevel_1 = __webpack_require__(11);
	const roomtype_1 = __webpack_require__(9);
	const SpawnLib = __webpack_require__(12);
	const IntelLib = __webpack_require__(5);
	function getBasePosition(room) {
	    if (room.memory.b !== undefined) {
	        return longPos(room.memory.b, room.name);
	    }
	    else {
	        if (Memory.settings.bot) {
	            let basepos = SpawnLib.findSpawnLocation(room.name, true);
	            if (basepos !== undefined) {
	                SpawnLib.createSpawnmoveOperation(room, basepos.pos);
	                room.memory.b = shortPos(basepos.pos);
	                return basepos.pos;
	            }
	        }
	        let spawnsInRoom = room.find(FIND_MY_SPAWNS);
	        if (spawnsInRoom.length > 0) {
	            room.memory.b = shortPos(spawnsInRoom[0].pos);
	            return spawnsInRoom[0].pos;
	        }
	    }
	    return undefined;
	}
	exports.getBasePosition = getBasePosition;
	function setBasePosition(roomName, pos) {
	    if (Memory.rooms[roomName] === undefined) {
	        Memory.rooms[roomName] = {};
	    }
	    Memory.rooms[roomName].b = shortPos(pos);
	}
	exports.setBasePosition = setBasePosition;
	function roomShouldBuild(room) {
	    return room.memory.t === roomtype_1.Roomtype.Normal && room.memory.isBeingDismantled !== true &&
	        (room.storage === undefined || !room.storage.isActive() || room.storage.store[RESOURCE_ENERGY] > 20000);
	}
	exports.roomShouldBuild = roomShouldBuild;
	function getRoomLevel(room) {
	    if (room.memory.l === undefined) {
	        return roomlevel_1.RoomLevel.BasicColony;
	    }
	    return room.memory.l;
	}
	exports.getRoomLevel = getRoomLevel;
	;
	function setRoomLevel(room, level) {
	    Logger_1.log.alert("Roomlevel changed to: " + roomlevel_1.RoomLevel[level], room.name);
	    room.memory.l = level;
	}
	exports.setRoomLevel = setRoomLevel;
	;
	function hasOutpost(room, outpost) {
	    return _.contains(room.memory.outposts, outpost);
	}
	exports.hasOutpost = hasOutpost;
	function getAllOutposts(room) {
	    if (room.memory.outposts === undefined) {
	        return [];
	    }
	    return room.memory.outposts;
	}
	exports.getAllOutposts = getAllOutposts;
	function getAllOutpostsInAllRooms(rooms) {
	    let outposts = [];
	    for (let r of rooms) {
	        outposts = outposts.concat(r.memory.outposts);
	    }
	    return outposts;
	}
	exports.getAllOutpostsInAllRooms = getAllOutpostsInAllRooms;
	function getAllPoachroomsInAllRooms(rooms) {
	    let outposts = [];
	    for (let r of rooms) {
	        outposts = outposts.concat(r.memory.poaching);
	    }
	    return outposts;
	}
	exports.getAllPoachroomsInAllRooms = getAllPoachroomsInAllRooms;
	function getNumberOfSourcesMined(room) {
	    let sourceCount = room.find(FIND_SOURCES).length;
	    for (let outpost of room.memory.outposts) {
	        if (IntelLib.hasIntel(outpost)) {
	            sourceCount += IntelLib.sourceIds(outpost).length;
	        }
	    }
	    return sourceCount;
	}
	exports.getNumberOfSourcesMined = getNumberOfSourcesMined;
	function getOwnerOfOutpost(outpost, rooms) {
	    for (let r of rooms) {
	        if (r.memory.outposts !== undefined && _.contains(r.memory.outposts, outpost)) {
	            return r;
	        }
	    }
	    return undefined;
	}
	exports.getOwnerOfOutpost = getOwnerOfOutpost;
	function getBasicOutposts(room) {
	    let outposts = [];
	    if (room.memory.outposts === undefined) {
	        return outposts;
	    }
	    for (let s of room.memory.outposts) {
	        if (!isMiddleRoom(s)) {
	            outposts.push(s);
	        }
	    }
	    return outposts;
	}
	exports.getBasicOutposts = getBasicOutposts;
	function getLairOutposts(room) {
	    let outposts = [];
	    if (room.memory.outposts === undefined) {
	        return outposts;
	    }
	    for (let s of room.memory.outposts) {
	        if (isMiddleRoom(s)) {
	            outposts.push(s);
	        }
	    }
	    return outposts;
	}
	exports.getLairOutposts = getLairOutposts;
	function getLastIndex() {
	    let last = 1;
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true && room.memory.index !== undefined) {
	            if (last < room.memory.index) {
	                last = room.memory.index;
	            }
	        }
	    }
	    return last;
	}
	exports.getLastIndex = getLastIndex;
	function getRoomForIndex(index) {
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true && room.memory.index === index) {
	            return room;
	        }
	    }
	    return undefined;
	}
	exports.getRoomForIndex = getRoomForIndex;
	function getIndex(room) {
	    if (room.memory.index !== undefined) {
	        return room.memory.index;
	    }
	    let rooms = [];
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true) {
	            rooms.push(room);
	        }
	    }
	    let used = _.map(rooms, (r) => r.memory.index);
	    let counter = 1;
	    while (counter < 100) {
	        if (!_.contains(used, counter)) {
	            room.memory.index = counter;
	            return counter;
	        }
	        counter++;
	    }
	    Logger_1.log.error("Error assigning roomindex to room.", room.name);
	    return 0;
	}
	exports.getIndex = getIndex;
	function isMiddleRoom(roomName) {
	    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
	        return false;
	    }
	    let fMod = parsed[1] % 10;
	    let sMod = parsed[2] % 10;
	    let isSK = ((fMod >= 4) && (fMod <= 6)) &&
	        ((sMod >= 4) && (sMod <= 6));
	    return isSK;
	}
	exports.isMiddleRoom = isMiddleRoom;
	function isSKRoom(roomName) {
	    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
	        return false;
	    }
	    let fMod = parsed[1] % 10;
	    let sMod = parsed[2] % 10;
	    let isSK = !(fMod === 5 && sMod === 5) &&
	        ((fMod >= 4) && (fMod <= 6)) &&
	        ((sMod >= 4) && (sMod <= 6));
	    return isSK;
	}
	exports.isSKRoom = isSKRoom;
	function isPortalRoom(roomName) {
	    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
	        return false;
	    }
	    let fMod = parsed[1] % 10;
	    let sMod = parsed[2] % 10;
	    let isPortal = (fMod === 5 && sMod === 5);
	    return isPortal;
	}
	exports.isPortalRoom = isPortalRoom;
	function shortPos(pos) {
	    return pos.x + "-" + pos.y;
	}
	function longPos(pos, roomName) {
	    let split = pos.split("-");
	    return new RoomPosition(+split[0], +split[1], roomName);
	}
	function getClosestPortalroom(roomName) {
	    let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
	    let fMod = Math.floor(parsed[2] / 10) * 10 + 5;
	    let sMod = Math.floor(parsed[4] / 10) * 10 + 5;
	    let closestPortal = parsed[1] + fMod + parsed[3] + sMod;
	    return closestPortal;
	}
	exports.getClosestPortalroom = getClosestPortalroom;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";
	(function (RoomLevel) {
	    RoomLevel[RoomLevel["BasicColony"] = 0] = "BasicColony";
	    RoomLevel[RoomLevel["BasicColonyReadyForExpansion"] = 1] = "BasicColonyReadyForExpansion";
	    RoomLevel[RoomLevel["SimpleColony"] = 2] = "SimpleColony";
	    RoomLevel[RoomLevel["SimpleColonyReadyForExpansion"] = 3] = "SimpleColonyReadyForExpansion";
	    RoomLevel[RoomLevel["DefendedColony"] = 4] = "DefendedColony";
	    RoomLevel[RoomLevel["DefendedColonyReadyForExpansion"] = 5] = "DefendedColonyReadyForExpansion";
	    RoomLevel[RoomLevel["CivilizedColony"] = 6] = "CivilizedColony";
	    RoomLevel[RoomLevel["CivilizedColonyReadyForExpansion"] = 7] = "CivilizedColonyReadyForExpansion";
	    RoomLevel[RoomLevel["AdvancedColony"] = 8] = "AdvancedColony";
	    RoomLevel[RoomLevel["AdvancedColonyReadyForExpansion"] = 9] = "AdvancedColonyReadyForExpansion";
	    RoomLevel[RoomLevel["Town"] = 10] = "Town";
	    RoomLevel[RoomLevel["TownReadyForExpansion"] = 11] = "TownReadyForExpansion";
	    RoomLevel[RoomLevel["City"] = 12] = "City";
	    RoomLevel[RoomLevel["CityReadyForExpansion"] = 13] = "CityReadyForExpansion";
	    RoomLevel[RoomLevel["Metropolis"] = 14] = "Metropolis";
	})(exports.RoomLevel || (exports.RoomLevel = {}));
	var RoomLevel = exports.RoomLevel;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const OperationSpawnmove = __webpack_require__(13);
	const IntelLib = __webpack_require__(5);
	const operationtypes_1 = __webpack_require__(15);
	function createSpawnmoveOperation(room, basePos) {
	    let op = new OperationSpawnmove.Data();
	    op.operationtype = operationtypes_1.OperationType.Spawnmove;
	    op.roomName = room.name;
	    op.victoryCondition = OperationSpawnmove.VictoryCondition.Spawnmoved;
	    op.victoryValue = basePos;
	    if (Memory.operations === undefined) {
	        Memory.operations = [];
	    }
	    Memory.operations.push(op);
	    console.log("Starting a operation to move the spawn in room " + room.name + ". It will start when we have a storage at RCL 4.");
	    return true;
	}
	exports.createSpawnmoveOperation = createSpawnmoveOperation;
	function findSpawnLocation(roomName, firstRoom = false) {
	    let matrix = new PathFinder.CostMatrix;
	    for (let x of [0, 1, 2, 47, 48, 49]) {
	        for (let y of _.range(0, 50)) {
	            matrix.set(x, y, 1);
	        }
	    }
	    for (let y of [0, 1, 2, 47, 48, 49]) {
	        for (let x of _.range(3, 57)) {
	            matrix.set(x, y, 1);
	        }
	    }
	    for (let x of _.range(3, 47)) {
	        for (let y of _.range(3, 47)) {
	            if (Game.map.getTerrainAt(x, y, roomName) === "wall") {
	                matrix.set(x, y, 1);
	            }
	        }
	    }
	    let distance = 0;
	    let found = true;
	    let max = 1;
	    while (distance < 25) {
	        distance++;
	        found = false;
	        for (let x of _.range(1, 49)) {
	            for (let y of _.range(1, 49)) {
	                if (matrix.get(x, y) === distance) {
	                    for (let x2 of [-1, 0, 1]) {
	                        for (let y2 of [-1, 0, 1]) {
	                            if (matrix.get(x + x2, y + y2) === 0) {
	                                matrix.set(x + x2, y + y2, distance + 1);
	                                max = distance + 1;
	                                found = true;
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	    if (max < 5 && !firstRoom) {
	        console.log("Did not find a spawnposition for room " + roomName);
	        return undefined;
	    }
	    let perfect = [];
	    let okey = [];
	    let possible = [];
	    for (let x of _.range(7, 43)) {
	        for (let y of _.range(7, 40)) {
	            if (matrix.get(x, y) >= 5 &&
	                matrix.get(x, y + 3) >= 4) {
	                let pos = new RoomPosition(x, y, roomName);
	                if (matrix.get(x + 4, y - 7) >= 3 && matrix.get(x - 4, y - 7) >= 5) {
	                    perfect.push(pos);
	                }
	                else if (matrix.get(x - 2, y) >= 7) {
	                    okey.push(pos);
	                }
	                else {
	                    let distanceToWall = matrix.get(pos.x, pos.y);
	                    if (distanceToWall > Math.max(4, max - 4)) {
	                        possible.push(pos);
	                    }
	                }
	            }
	        }
	    }
	    if (firstRoom) {
	        perfect = removeTrickyPositions(roomName, perfect);
	        okey = removeTrickyPositions(roomName, okey);
	        possible = removeTrickyPositions(roomName, possible);
	    }
	    perfect = filterDistanceToVitalPositions(roomName, perfect);
	    if (perfect.length > 0) {
	        if (perfect.length > 10) {
	            perfect = _.sample(perfect, 10);
	        }
	        let chosen = findBestSpawnPosition(roomName, perfect);
	        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
	        console.log("Found perfect spawnlocation for " + roomName + ": " + spawnpos);
	        return { pos: spawnpos, value: 20 };
	    }
	    okey = filterDistanceToVitalPositions(roomName, okey);
	    if (okey.length > 0) {
	        if (okey.length > 10) {
	            okey = _.sample(okey, 10);
	        }
	        let chosen = findBestSpawnPosition(roomName, okey);
	        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
	        console.log("Found okey spawnlocation for " + roomName + ": " + spawnpos);
	        return { pos: spawnpos, value: 0 };
	    }
	    possible = filterDistanceToVitalPositions(roomName, possible);
	    if (possible.length > 0) {
	        if (possible.length > 10) {
	            possible = _.sample(possible, 10);
	        }
	        let chosen = findBestSpawnPosition(roomName, possible);
	        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
	        console.log("Found possible spawnlocation for " + roomName + ": " + spawnpos);
	        return { pos: spawnpos, value: -20 };
	    }
	    if (firstRoom === true) {
	        for (let x of _.range(1, 49)) {
	            for (let y of _.range(1, 49)) {
	                if (matrix.get(x, y) === max - 1) {
	                    let spawnpos = new RoomPosition(x, y - 2, roomName);
	                    return { pos: spawnpos, value: -100 };
	                }
	            }
	        }
	    }
	    console.log("Did not find a spawnposition for room " + roomName);
	    return undefined;
	}
	exports.findSpawnLocation = findSpawnLocation;
	function removeTrickyPositions(roomName, positions) {
	    let room = Game.rooms[roomName];
	    if (room === undefined) {
	        return positions;
	    }
	    let spawn = room.getSpawn();
	    if (spawn === undefined) {
	        return positions;
	    }
	    let allowed = [];
	    for (let p of positions) {
	        if ((p.x !== spawn.pos.x || (p.y !== spawn.pos.y && p.y !== spawn.pos.y - 1)) &&
	            (p.x !== spawn.pos.x - 2 || p.y !== spawn.pos.y + 1)) {
	            allowed.push(p);
	        }
	        else {
	            console.log("Filtered out tricky position from possible basepositions");
	        }
	    }
	    return allowed;
	}
	function findBestSpawnPosition(roomName, positions) {
	    if (positions.length < 1) {
	        console.log("ERROR: Trying to choose among zero spawnpositions in room " + roomName);
	        return new RoomPosition(25, 25, roomName);
	    }
	    let chosen = positions[0];
	    let distance = getTargetsDistance(roomName, chosen);
	    for (let p of positions) {
	        let d = getTargetsDistance(roomName, p);
	        if (d < distance) {
	            chosen = p;
	            distance = d;
	        }
	    }
	    return chosen;
	}
	function getTargetsDistance(roomName, basePos) {
	    if (!IntelLib.hasIntel(roomName)) {
	        return 100;
	    }
	    let distance = 0;
	    for (let sId of IntelLib.sourceIds(roomName)) {
	        distance += basePos.getRangeTo(IntelLib.sourcePos(roomName, sId));
	    }
	    let cPos = IntelLib.controllerPos(roomName);
	    if (cPos !== null) {
	        distance += basePos.getRangeTo(cPos);
	    }
	    return distance;
	}
	function filterDistanceToVitalPositions(roomName, positions) {
	    let filtered = [];
	    if (!IntelLib.hasIntel(roomName)) {
	        return positions;
	    }
	    let vitalTargets = [];
	    for (let sId of IntelLib.sourceIds(roomName)) {
	        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
	    }
	    let mPos = IntelLib.mineralPos(roomName);
	    if (mPos !== undefined) {
	        vitalTargets.push(mPos);
	    }
	    for (let p of positions) {
	        let validPosition = true;
	        for (let v of vitalTargets) {
	            if (p.getRangeTo(v) < 6) {
	                validPosition = false;
	            }
	        }
	        let cPos = IntelLib.controllerPos(roomName);
	        if (cPos !== null) {
	            if (p.getRangeTo(cPos) < 8) {
	                validPosition = false;
	            }
	        }
	        if (validPosition) {
	            filtered.push(p);
	        }
	    }
	    return filtered;
	}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const operationtypes_1 = __webpack_require__(15);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const ProfileUtilities = __webpack_require__(19);
	var MoveState;
	(function (MoveState) {
	    MoveState[MoveState["Waiting"] = 1] = "Waiting";
	    MoveState[MoveState["Preparing"] = 2] = "Preparing";
	    MoveState[MoveState["Moving"] = 3] = "Moving";
	    MoveState[MoveState["Finished"] = 4] = "Finished";
	})(MoveState || (MoveState = {}));
	(function (VictoryCondition) {
	    VictoryCondition[VictoryCondition["Spawnmoved"] = 1] = "Spawnmoved";
	})(exports.VictoryCondition || (exports.VictoryCondition = {}));
	var VictoryCondition = exports.VictoryCondition;
	class Data {
	    constructor() {
	        this.operationtype = operationtypes_1.OperationType.Spawnmove;
	        this.active = true;
	        this.state = 1;
	    }
	}
	exports.Data = Data;
	function run(operation, pri, creepService) {
	    if (pri === _Manager_1.ManagerPriority.Standard && Game.time % 5 === 0) {
	        if (operation.state === MoveState.Waiting) {
	            checkIfWeCanStartPreparing(operation);
	        }
	        else if (operation.state === MoveState.Preparing) {
	            checkIfWeCanStartMoving(operation, creepService);
	        }
	        else if (operation.state === MoveState.Moving) {
	            checkIfSpawnHasBeenBuilt(operation);
	        }
	    }
	}
	exports.run = run;
	function victoryConditionReached(operation) {
	    if (operation.state === MoveState.Finished) {
	        return true;
	    }
	    else {
	        return false;
	    }
	}
	exports.victoryConditionReached = victoryConditionReached;
	function checkIfWeCanStartPreparing(operation) {
	    let room = Game.rooms[operation.roomName];
	    if (room === undefined || room.controller === undefined || room.controller.level < 4 || !room.controller.my || room.energyCapacityAvailable === SPAWN_ENERGY_CAPACITY) {
	        return;
	    }
	    let spawn = room.getSpawn();
	    if (spawn === undefined || Object.keys(Game.constructionSites).length > 0) {
	        return;
	    }
	    if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 25000) {
	        return;
	    }
	    operation.state = MoveState.Preparing;
	}
	function checkIfWeCanStartMoving(operation, creepService) {
	    let room = Game.rooms[operation.roomName];
	    if (room === undefined) {
	        return;
	    }
	    let spawn = room.getSpawn();
	    if (spawn === undefined) {
	        return;
	    }
	    let builders = _.filter(creepService.getCreeps(role_1.Role.BaseBuilder, operation.roomName, operation.roomName), (c) => c.ticksToLive < 1500 && c.ticksToLive > 200);
	    if (builders.length < 3) {
	        orderBaseBuilders(room, creepService);
	        return;
	    }
	    let enemies = room.find(FIND_HOSTILE_CREEPS);
	    if (enemies.length > 0) {
	        return;
	    }
	    if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 20000) {
	        return;
	    }
	    spawn.destroy();
	    operation.state = MoveState.Moving;
	}
	function checkIfSpawnHasBeenBuilt(operation) {
	    let room = Game.rooms[operation.roomName];
	    if (room === undefined) {
	        return;
	    }
	    let basePos = getBasePos(operation);
	    if (basePos === undefined) {
	        return;
	    }
	    let spawn = room.getSpawn();
	    if (spawn !== undefined) {
	        if (spawn.pos.x === basePos.x && spawn.pos.y === basePos.y) {
	            operation.state = MoveState.Finished;
	        }
	        else {
	            spawn.destroy();
	        }
	    }
	    else {
	        basePos.createConstructionSite(STRUCTURE_SPAWN);
	    }
	}
	function orderBaseBuilders(room, creepService) {
	    let current = creepService.getCreeps(role_1.Role.BaseBuilder, room.name, room.name).length;
	    let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseBuilder, room.name);
	    if (current < 4 && ordered === 0) {
	        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getConsultantBody(maxTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.BaseBuilder, target: room.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	function getBasePos(operation) {
	    if (operation.victoryValue.x !== undefined && operation.victoryValue.y !== undefined) {
	        return new RoomPosition(operation.victoryValue.x, operation.victoryValue.y, operation.roomName);
	    }
	}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	(function (ManagerPriority) {
	    ManagerPriority[ManagerPriority["Critical"] = 1] = "Critical";
	    ManagerPriority[ManagerPriority["Standard"] = 2] = "Standard";
	    ManagerPriority[ManagerPriority["Low"] = 3] = "Low";
	    ManagerPriority[ManagerPriority["Trivial"] = 4] = "Trivial";
	    ManagerPriority[ManagerPriority["Overflow"] = 5] = "Overflow";
	    ManagerPriority[ManagerPriority["None"] = 6] = "None";
	})(exports.ManagerPriority || (exports.ManagerPriority = {}));
	var ManagerPriority = exports.ManagerPriority;
	class Manager {
	    constructor(name) {
	        this.name = name;
	        this.memoryCheck();
	    }
	    memoryCheck() {
	        if (Memory.manager === undefined) {
	            Memory.manager = {};
	        }
	        if (Memory.manager[this.name] === undefined) {
	            Memory.manager[this.name] = {};
	        }
	    }
	    getValue(name) {
	        return Memory.manager[this.name][name];
	    }
	    setValue(name, value) {
	        Memory.manager[this.name][name] = value;
	    }
	}
	exports.Manager = Manager;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";
	(function (OperationType) {
	    OperationType[OperationType["Haul"] = 0] = "Haul";
	    OperationType[OperationType["Drain"] = 1] = "Drain";
	    OperationType[OperationType["Guard"] = 2] = "Guard";
	    OperationType[OperationType["Spawnmove"] = 3] = "Spawnmove";
	})(exports.OperationType || (exports.OperationType = {}));
	var OperationType = exports.OperationType;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	(function (Role) {
	    Role[Role["Protector"] = 0] = "Protector";
	    Role[Role["RampartDefender"] = 1] = "RampartDefender";
	    Role[Role["BaseRanger"] = 2] = "BaseRanger";
	    Role[Role["Ranger"] = 3] = "Ranger";
	    Role[Role["OutpostSupporter"] = 4] = "OutpostSupporter";
	    Role[Role["OutpostWarrior"] = 5] = "OutpostWarrior";
	    Role[Role["BaseHauler"] = 6] = "BaseHauler";
	    Role[Role["ProximityScout"] = 7] = "ProximityScout";
	    Role[Role["OutpostReserver"] = 8] = "OutpostReserver";
	    Role[Role["Pioneer"] = 9] = "Pioneer";
	    Role[Role["RoomClaimer"] = 10] = "RoomClaimer";
	    Role[Role["MineralMiner"] = 11] = "MineralMiner";
	    Role[Role["ExpansionWorker"] = 12] = "ExpansionWorker";
	    Role[Role["ContainerMiner"] = 13] = "ContainerMiner";
	    Role[Role["ContainerHauler"] = 14] = "ContainerHauler";
	    Role[Role["OutpostDefender"] = 15] = "OutpostDefender";
	    Role[Role["Janitor"] = 16] = "Janitor";
	    Role[Role["Upgrader"] = 17] = "Upgrader";
	    Role[Role["PoachGuard"] = 18] = "PoachGuard";
	    Role[Role["TeamHealer"] = 19] = "TeamHealer";
	    Role[Role["TeamWarrior"] = 20] = "TeamWarrior";
	    Role[Role["TeamWrecker"] = 21] = "TeamWrecker";
	    Role[Role["PoachMiner"] = 22] = "PoachMiner";
	    Role[Role["PoachHauler"] = 23] = "PoachHauler";
	    Role[Role["BaseBuilder"] = 24] = "BaseBuilder";
	    Role[Role["Harasser"] = 25] = "Harasser";
	    Role[Role["PraiserSupport"] = 26] = "PraiserSupport";
	    Role[Role["SKGuard"] = 27] = "SKGuard";
	    Role[Role["BankAttacker"] = 28] = "BankAttacker";
	    Role[Role["BankHealer"] = 29] = "BankHealer";
	    Role[Role["BankHauler"] = 30] = "BankHauler";
	    Role[Role["BaseCourier"] = 31] = "BaseCourier";
	    Role[Role["SKMiner"] = 32] = "SKMiner";
	    Role[Role["SKHauler"] = 33] = "SKHauler";
	    Role[Role["SKHealer"] = 34] = "SKHealer";
	    Role[Role["BankRanger"] = 35] = "BankRanger";
	    Role[Role["MineralHauler"] = 36] = "MineralHauler";
	    Role[Role["EnergyHauler"] = 37] = "EnergyHauler";
	    Role[Role["Signer"] = 38] = "Signer";
	    Role[Role["PraiserOfficer"] = 39] = "PraiserOfficer";
	    Role[Role["Wrecker"] = 41] = "Wrecker";
	    Role[Role["Drainer"] = 42] = "Drainer";
	    Role[Role["Paladin"] = 43] = "Paladin";
	    Role[Role["Praiser"] = 44] = "Praiser";
	    Role[Role["PraiserHauler"] = 45] = "PraiserHauler";
	    Role[Role["Tagger"] = 46] = "Tagger";
	    Role[Role["PraiserLeader"] = 47] = "PraiserLeader";
	    Role[Role["Declarer"] = 48] = "Declarer";
	    Role[Role["UpgraderHauler"] = 49] = "UpgraderHauler";
	    Role[Role["OperationHauler"] = 50] = "OperationHauler";
	    Role[Role["UpgraderWithBoost"] = 1001] = "UpgraderWithBoost";
	    Role[Role["UpgraderWithoutBoost"] = 1002] = "UpgraderWithoutBoost";
	    Role[Role["PraiserWithBoost"] = 1003] = "PraiserWithBoost";
	    Role[Role["PraiserWithoutBoost"] = 1004] = "PraiserWithoutBoost";
	})(exports.Role || (exports.Role = {}));
	var Role = exports.Role;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	"use strict";
	(function (Priority) {
	    Priority[Priority["Blocker"] = 0] = "Blocker";
	    Priority[Priority["Critical"] = 1] = "Critical";
	    Priority[Priority["Important"] = 2] = "Important";
	    Priority[Priority["Standard"] = 3] = "Standard";
	    Priority[Priority["Low"] = 4] = "Low";
	    Priority[Priority["Trivial"] = 5] = "Trivial";
	    Priority[Priority["Overflow"] = 6] = "Overflow";
	})(exports.Priority || (exports.Priority = {}));
	var Priority = exports.Priority;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfilesUtilities = __webpack_require__(19);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const Logger_1 = __webpack_require__(7);
	function orderCreep(room, order) {
	    let costOfCreep = ProfilesUtilities.getCostForBody(order.body);
	    if (costOfCreep > room.energyCapacityAvailable) {
	        Logger_1.log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.memory), room.name);
	        return false;
	    }
	    if (order.body.length === 0) {
	        Logger_1.log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.memory), room.name);
	        return false;
	    }
	    if (order.body.length > 50) {
	        Logger_1.log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.memory), room.name);
	        return false;
	    }
	    if (room.memory.orders === undefined) {
	        room.memory.orders = [];
	    }
	    if (order.twinOrder !== undefined) {
	        let costOfCreep = ProfilesUtilities.getCostForBody(order.twinOrder.body);
	        if (costOfCreep > room.energyCapacityAvailable) {
	            Logger_1.log.error("Creep ordered that is more expensive than the room is able to handle: " + JSON.stringify(order.twinOrder.memory), room.name);
	            return false;
	        }
	        if (order.twinOrder.body.length === 0) {
	            Logger_1.log.error("Invalid creep ordered, empty body: " + JSON.stringify(order.twinOrder.memory), room.name);
	            return false;
	        }
	        if (order.twinOrder.body.length > 50) {
	            Logger_1.log.error("Invalid creep ordered, body larger than 50: " + JSON.stringify(order.twinOrder.memory), room.name);
	            return false;
	        }
	    }
	    room.memory.orders.push(order);
	    Logger_1.log.info("Ordered: " + role_1.Role[order.memory.role] + " T" + order.memory.tier +
	        " (" + order.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
	    if (order.twinOrder !== undefined) {
	        Logger_1.log.info("Ordered: " + role_1.Role[order.twinOrder.memory.role] + " T" + order.twinOrder.memory.tier +
	            " (" + order.twinOrder.memory.target + ") - Queue: " + (room.memory.orders.length - 1), room.name);
	    }
	    return true;
	}
	exports.orderCreep = orderCreep;
	function getNumberOfTiersInQueue(room, role = null, target = null) {
	    if (room.memory.orders === undefined) {
	        room.memory.orders = [];
	    }
	    let count = 0;
	    for (let order of room.memory.orders) {
	        if ((target === null || order.memory.target === target) &&
	            (role === null || order.memory.role === role)) {
	            if (order.memory.tier) {
	                count += order.memory.tier;
	            }
	            else {
	                count++;
	            }
	        }
	        if (order.twinOrder !== undefined) {
	            if ((target === null || order.twinOrder.memory.target === target) &&
	                (role === null || order.twinOrder.memory.role === role)) {
	                if (order.twinOrder.memory.tier) {
	                    count += order.twinOrder.memory.tier;
	                }
	                else {
	                    count++;
	                }
	            }
	        }
	    }
	    return count;
	}
	exports.getNumberOfTiersInQueue = getNumberOfTiersInQueue;
	function getCreepsInQueue(room, role = null, target = null) {
	    if (room.memory.orders === undefined) {
	        room.memory.orders = [];
	    }
	    let count = 0;
	    for (let order of room.memory.orders) {
	        if ((target === null || order.memory.target === target) &&
	            (role === null || order.memory.role === role)) {
	            count++;
	        }
	        if (order.twinOrder !== undefined) {
	            if ((target === null || order.twinOrder.memory.target === target) &&
	                (role === null || order.twinOrder.memory.role === role)) {
	                count++;
	            }
	        }
	    }
	    return count;
	}
	exports.getCreepsInQueue = getCreepsInQueue;
	function getCreepsInQueueWithHomeRoom(room, role = null, homeroom = null) {
	    if (room.memory.orders === undefined) {
	        room.memory.orders = [];
	    }
	    let count = 0;
	    for (let order of room.memory.orders) {
	        if ((homeroom === null || order.memory.homeroom === homeroom) &&
	            (role === null || order.memory.role === role)) {
	            count++;
	        }
	    }
	    return count;
	}
	exports.getCreepsInQueueWithHomeRoom = getCreepsInQueueWithHomeRoom;
	function orderedBaseHaulerIsTooExpensive(room) {
	    if (room.memory.orders === undefined) {
	        return false;
	    }
	    let spawns = room.getSpawns();
	    for (let s of spawns) {
	        if (s.spawning) {
	            return false;
	        }
	    }
	    for (let order of room.memory.orders) {
	        if ((order.memory.role === role_1.Role.BaseHauler)) {
	            order.priority = priority_1.Priority.Critical;
	            return (order.memory.tier * 150) > room.energyAvailable;
	        }
	    }
	    return false;
	}
	exports.orderedBaseHaulerIsTooExpensive = orderedBaseHaulerIsTooExpensive;
	function clearOrders(room) {
	    room.memory.orders = [];
	    Logger_1.log.info("Clearing order queue for room", room.name);
	}
	exports.clearOrders = clearOrders;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	function getB3TeamWreckerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, 4, [TOUGH]);
	    body = addToBody(body, tier * 4, [TOUGH]);
	    body = addToBody(body, 14, [WORK]);
	    if (tier > 1) {
	        body = addToBody(body, 6, [WORK]);
	    }
	    body = addToBody(body, 2, [RANGED_ATTACK]);
	    if (tier > 1) {
	        body = addToBody(body, 2, [RANGED_ATTACK]);
	    }
	    body = addToBody(body, 6, [MOVE]);
	    if (tier === 2) {
	        body = addToBody(body, 3, [MOVE]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 4, [MOVE]);
	    }
	    return body;
	}
	exports.getB3TeamWreckerBody = getB3TeamWreckerBody;
	function getB3TeamHealerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, 4, [TOUGH]);
	    body = addToBody(body, tier * 4, [TOUGH]);
	    body = addToBody(body, tier * 8, [HEAL]);
	    body = addToBody(body, 4, [MOVE]);
	    if (tier === 2) {
	        body = addToBody(body, 3, [MOVE]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 6, [MOVE]);
	    }
	    return body;
	}
	exports.getB3TeamHealerBody = getB3TeamHealerBody;
	function getB2TeamWreckerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, 12, [TOUGH]);
	    body = addToBody(body, 13, [WORK]);
	    if (tier === 2) {
	        body = addToBody(body, 2, [WORK]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 7, [WORK]);
	    }
	    body = addToBody(body, 1 + tier, [RANGED_ATTACK]);
	    body = addToBody(body, 9, [MOVE]);
	    if (tier === 2) {
	        body = addToBody(body, 1, [MOVE]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 3, [MOVE]);
	    }
	    return body;
	}
	exports.getB2TeamWreckerBody = getB2TeamWreckerBody;
	function getB2TeamHealerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, 4, [TOUGH]);
	    if (tier > 1) {
	        body = addToBody(body, 8, [TOUGH]);
	    }
	    body = addToBody(body, 8, [HEAL]);
	    if (tier === 2) {
	        body = addToBody(body, 10, [TOUGH]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 14, [TOUGH]);
	    }
	    body = addToBody(body, 4, [MOVE]);
	    if (tier === 2) {
	        body = addToBody(body, 6, [MOVE]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 8, [MOVE]);
	    }
	    return body;
	}
	exports.getB2TeamHealerBody = getB2TeamHealerBody;
	function getB1TeamWreckerBody(tier) {
	    if (tier > 1) {
	        tier = 1;
	    }
	    let body = [];
	    body = addToBody(body, 10, [TOUGH]);
	    body = addToBody(body, 16, [WORK]);
	    body = addToBody(body, 6, [RANGED_ATTACK]);
	    body = addToBody(body, 16, [MOVE]);
	    return body;
	}
	exports.getB1TeamWreckerBody = getB1TeamWreckerBody;
	function getB1TeamHealerBody(tier) {
	    if (tier > 1) {
	        tier = 1;
	    }
	    let body = [];
	    body = addToBody(body, 10, [TOUGH]);
	    body = addToBody(body, 18, [HEAL]);
	    body = addToBody(body, 14, [MOVE]);
	    return body;
	}
	exports.getB1TeamHealerBody = getB1TeamHealerBody;
	function getB0TeamWreckerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, 10, [WORK]);
	    body = addToBody(body, 12, [MOVE]);
	    if (tier === 2) {
	        body = addToBody(body, 8, [MOVE]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 13, [MOVE]);
	    }
	    if (tier === 2) {
	        body = addToBody(body, 6, [WORK]);
	    }
	    if (tier === 3) {
	        body = addToBody(body, 11, [WORK]);
	    }
	    body = addToBody(body, 2, [RANGED_ATTACK]);
	    if (tier > 1) {
	        body = addToBody(body, 2, [RANGED_ATTACK]);
	    }
	    return body;
	}
	exports.getB0TeamWreckerBody = getB0TeamWreckerBody;
	function getB0TeamHealerBody(tier) {
	    if (tier > 3) {
	        tier = 3;
	    }
	    let body = [];
	    body = addToBody(body, tier * 3, [HEAL]);
	    body = addToBody(body, tier * 7, [MOVE]);
	    body = addToBody(body, tier * 4, [HEAL]);
	    return body;
	}
	exports.getB0TeamHealerBody = getB0TeamHealerBody;
	function getPoachGuardBody() {
	    let body = [];
	    body = addToBody(body, 25, [MOVE]);
	    body = addToBody(body, 20, [ATTACK]);
	    body = addToBody(body, 5, [HEAL]);
	    return body;
	}
	exports.getPoachGuardBody = getPoachGuardBody;
	function getPoachMinerBody() {
	    let body = [];
	    body = addToBody(body, 15, [MOVE]);
	    body = addToBody(body, 30, [WORK]);
	    body = addToBody(body, 5, [CARRY]);
	    return body;
	}
	exports.getPoachMinerBody = getPoachMinerBody;
	function getPraiserBody() {
	    let body = [];
	    body = addToBody(body, 42, [WORK]);
	    body = addToBody(body, 2, [CARRY]);
	    body = addToBody(body, 6, [MOVE]);
	    return body;
	}
	exports.getPraiserBody = getPraiserBody;
	function getSKGuardBody() {
	    let body = [];
	    body = addToBody(body, 2, [RANGED_ATTACK]);
	    body = addToBody(body, 21, [MOVE]);
	    body = addToBody(body, 15, [ATTACK]);
	    body = addToBody(body, 4, [RANGED_ATTACK]);
	    return body;
	}
	exports.getSKGuardBody = getSKGuardBody;
	function getSKHealerBody() {
	    let body = [];
	    body = addToBody(body, 2, [HEAL]);
	    body = addToBody(body, 15, [MOVE]);
	    body = addToBody(body, 13, [HEAL]);
	    return body;
	}
	exports.getSKHealerBody = getSKHealerBody;
	function getBankAttacker() {
	    let body = [];
	    body = addToBody(body, 20, [MOVE]);
	    body = addToBody(body, 20, [ATTACK]);
	    return body;
	}
	exports.getBankAttacker = getBankAttacker;
	function getBankRanger() {
	    let body = [];
	    body = addToBody(body, 23, [MOVE]);
	    body = addToBody(body, 16, [RANGED_ATTACK]);
	    body = addToBody(body, 7, [HEAL]);
	    return body;
	}
	exports.getBankRanger = getBankRanger;
	function getEngineerBody(tier) {
	    if (tier > 12) {
	        tier = 12;
	    }
	    return addToBody([], tier, [WORK, CARRY, MOVE, MOVE]);
	}
	exports.getEngineerBody = getEngineerBody;
	function getMaxTierEngineer(energy) {
	    return getMaxTier(energy, getEngineerBody, 12);
	}
	exports.getMaxTierEngineer = getMaxTierEngineer;
	function getTaggerBody() {
	    let body = addToBody([], 1, [WORK, MOVE]);
	    body = addToBody(body, 10, [CARRY, MOVE]);
	    return body;
	}
	exports.getTaggerBody = getTaggerBody;
	function getHaulerEngineerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    return addToBody([], tier, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
	}
	exports.getHaulerEngineerBody = getHaulerEngineerBody;
	function getMaxTierHaulerEngineer(energy) {
	    return getMaxTier(energy, getHaulerEngineerBody, 8);
	}
	exports.getMaxTierHaulerEngineer = getMaxTierHaulerEngineer;
	function getConsultantBody(tier) {
	    if (tier > 16) {
	        tier = 16;
	    }
	    return addToBody([], tier, [WORK, CARRY, MOVE]);
	}
	exports.getConsultantBody = getConsultantBody;
	function getMaxTierConsultant(energy) {
	    return getMaxTier(energy, getConsultantBody, 16);
	}
	exports.getMaxTierConsultant = getMaxTierConsultant;
	function getWorkerBody(tier) {
	    if (tier > 16) {
	        tier = 16;
	    }
	    let body = [];
	    body = addToBody(body, Math.floor(tier / 2), [WORK, WORK, MOVE]);
	    body = addToBody(body, Math.ceil(tier / 2), [WORK, CARRY, MOVE]);
	    return body;
	}
	exports.getWorkerBody = getWorkerBody;
	function getMaxTierWorker(energy) {
	    return getMaxTier(energy, getWorkerBody, 16);
	}
	exports.getMaxTierWorker = getMaxTierWorker;
	function getMinerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    body = addToBody(body, 3, [WORK, WORK, MOVE]);
	    if (tier === 8) {
	        body = addToBody(body, 2, [WORK, WORK, MOVE]);
	    }
	    body = addToBody(body, 1, [CARRY]);
	    return body;
	}
	exports.getMinerBody = getMinerBody;
	function getMaxTierMiner(energy) {
	    return getMaxTier(energy, getMinerBody, 8);
	}
	exports.getMaxTierMiner = getMaxTierMiner;
	function getSkMinerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    body = addToBody(body, 4, [WORK, WORK, MOVE]);
	    if (tier === 8) {
	        body = addToBody(body, 3, [WORK, WORK, MOVE]);
	    }
	    body = addToBody(body, 1, [CARRY]);
	    return body;
	}
	exports.getSkMinerBody = getSkMinerBody;
	function getMaxTierSkMiner(energy) {
	    return getMaxTier(energy, getSkMinerBody, 8);
	}
	exports.getMaxTierSkMiner = getMaxTierSkMiner;
	function getStationaryWorkerBody(tier) {
	    if (tier > 13) {
	        tier = 13;
	    }
	    let body = [];
	    body = addToBody(body, Math.floor(Math.min(tier, 12) / 2), [WORK, WORK, WORK, MOVE]);
	    body = addToBody(body, Math.ceil(Math.min(tier, 12) / 2), [WORK, WORK, CARRY, MOVE]);
	    if (tier === 13) {
	        body = addToBody(body, 1, [WORK, MOVE]);
	    }
	    return body;
	}
	exports.getStationaryWorkerBody = getStationaryWorkerBody;
	function getMaxTierStationaryWorker(energy) {
	    return getMaxTier(energy, getStationaryWorkerBody, 13);
	}
	exports.getMaxTierStationaryWorker = getMaxTierStationaryWorker;
	function getProtectorBody(tier) {
	    if (tier > 4) {
	        tier = 4;
	    }
	    let body = [];
	    body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
	    body = addToBody(body, tier, [CARRY, MOVE]);
	    body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
	    return body;
	}
	exports.getProtectorBody = getProtectorBody;
	function getMaxTierProtector(energy) {
	    return getMaxTier(energy, getProtectorBody, 4);
	}
	exports.getMaxTierProtector = getMaxTierProtector;
	function getOffroadWorkerBody(tier) {
	    if (tier > 12) {
	        tier = 12;
	    }
	    let body = [];
	    body = addToBody(body, tier - 1, [WORK, WORK, MOVE, MOVE]);
	    body = addToBody(body, 1, [WORK, CARRY, MOVE, MOVE]);
	    return body;
	}
	exports.getOffroadWorkerBody = getOffroadWorkerBody;
	function getMaxTierOffroadWorker(energy) {
	    return getMaxTier(energy, getOffroadWorkerBody, 12);
	}
	exports.getMaxTierOffroadWorker = getMaxTierOffroadWorker;
	function getDistanceWorkerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    return addToBody([], tier, [CARRY, CARRY, MOVE, WORK, CARRY, MOVE]);
	}
	exports.getDistanceWorkerBody = getDistanceWorkerBody;
	function getMaxTierDistanceWorker(energy) {
	    return getMaxTier(energy, getDistanceWorkerBody, 8);
	}
	exports.getMaxTierDistanceWorker = getMaxTierDistanceWorker;
	function getWorkOnlyBody(tier) {
	    if (tier > 16) {
	        tier = 16;
	    }
	    return addToBody([], tier, [WORK, WORK, MOVE]);
	}
	exports.getWorkOnlyBody = getWorkOnlyBody;
	function getMaxTierWorkOnly(energy) {
	    return getMaxTier(energy, getWorkOnlyBody, 16);
	}
	exports.getMaxTierWorkOnly = getMaxTierWorkOnly;
	function getOffroadWorkOnlyBody(tier) {
	    if (tier > 25) {
	        tier = 25;
	    }
	    return addToBody([], tier, [WORK, MOVE]);
	}
	exports.getOffroadWorkOnlyBody = getOffroadWorkOnlyBody;
	function getMaxTierOffroadWorkOnly(energy) {
	    return getMaxTier(energy, getWorkOnlyBody, 25);
	}
	exports.getMaxTierOffroadWorkOnly = getMaxTierOffroadWorkOnly;
	function getHaulerBody(tier) {
	    if (tier > 16) {
	        tier = 16;
	    }
	    return addToBody([], tier, [CARRY, CARRY, MOVE]);
	}
	exports.getHaulerBody = getHaulerBody;
	function getMaxTierHauler(energy) {
	    return getMaxTier(energy, getHaulerBody, 16);
	}
	exports.getMaxTierHauler = getMaxTierHauler;
	function getOffroadHaulerBody(tier) {
	    if (tier > 25) {
	        tier = 25;
	    }
	    return addToBody([], tier, [CARRY, MOVE]);
	}
	exports.getOffroadHaulerBody = getOffroadHaulerBody;
	function getMaxTierOffroadHauler(energy) {
	    return getMaxTier(energy, getOffroadHaulerBody, 25);
	}
	exports.getMaxTierOffroadHauler = getMaxTierOffroadHauler;
	function getClaimerBody(tier) {
	    if (tier > 25) {
	        tier = 25;
	    }
	    return addToBody([], tier, [CLAIM, MOVE]);
	}
	exports.getClaimerBody = getClaimerBody;
	function getMaxTierClaimer(energy) {
	    return getMaxTier(energy, getClaimerBody, 25);
	}
	exports.getMaxTierClaimer = getMaxTierClaimer;
	function getSwampClaimerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    return addToBody([], tier, [MOVE, MOVE, MOVE, MOVE, CLAIM, MOVE]);
	}
	exports.getSwampClaimerBody = getSwampClaimerBody;
	function getMaxTierSwampClaimer(energy) {
	    return getMaxTier(energy, getClaimerBody, 8);
	}
	exports.getMaxTierSwampClaimer = getMaxTierSwampClaimer;
	function getScoutBody(tier) {
	    if (tier > 50) {
	        tier = 50;
	    }
	    return addToBody([], tier, [MOVE]);
	}
	exports.getScoutBody = getScoutBody;
	function getMaxTierScout(energy) {
	    return getMaxTier(energy, getScoutBody, 50);
	}
	exports.getMaxTierScout = getMaxTierScout;
	function getHealerBody(tier) {
	    if (tier > 25) {
	        tier = 25;
	    }
	    let body = [];
	    body = addToBody(body, tier, [HEAL]);
	    body = addToBody(body, tier, [MOVE]);
	    return body;
	}
	exports.getHealerBody = getHealerBody;
	function getMaxTierHealer(energy) {
	    return getMaxTier(energy, getHealerBody, 25);
	}
	exports.getMaxTierHealer = getMaxTierHealer;
	function getWarriorBody(tier) {
	    if (tier > 12) {
	        tier = 12;
	    }
	    let body = [];
	    body = addToBody(body, tier, [TOUGH]);
	    body = addToBody(body, tier, [ATTACK, MOVE]);
	    body = addToBody(body, tier, [MOVE]);
	    return body;
	}
	exports.getWarriorBody = getWarriorBody;
	function getMaxTierWarrior(energy) {
	    return getMaxTier(energy, getWarriorBody, 12);
	}
	exports.getMaxTierWarrior = getMaxTierWarrior;
	function getRogueBody(tier) {
	    if (tier > 24) {
	        tier = 24;
	    }
	    let body = [];
	    body = addToBody(body, tier, [ATTACK]);
	    body = addToBody(body, tier, [MOVE]);
	    return body;
	}
	exports.getRogueBody = getRogueBody;
	function getMaxTierRogue(energy) {
	    return getMaxTier(energy, getRogueBody, 24);
	}
	exports.getMaxTierRogue = getMaxTierRogue;
	function getBaseRangerBody(tier) {
	    if (tier > 12) {
	        tier = 12;
	    }
	    let body = [];
	    body = addToBody(body, tier, [RANGED_ATTACK, RANGED_ATTACK]);
	    body = addToBody(body, tier, [MOVE, MOVE]);
	    return body;
	}
	exports.getBaseRangerBody = getBaseRangerBody;
	function getMaxTierBaseRanger(energy) {
	    return getMaxTier(energy, getBaseRangerBody, 12);
	}
	exports.getMaxTierBaseRanger = getMaxTierBaseRanger;
	function getRangerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    switch (tier) {
	        case 1:
	        case 2:
	            body = addToBody(body, tier, [RANGED_ATTACK, MOVE]);
	            break;
	        case 3:
	            body = addToBody(body, 2, [RANGED_ATTACK]);
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            body = addToBody(body, 2, [MOVE]);
	            break;
	        case 4:
	            body = addToBody(body, 4, [RANGED_ATTACK]);
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            ;
	            body = addToBody(body, 4, [MOVE]);
	            break;
	        case 5:
	            body = addToBody(body, 5, [RANGED_ATTACK]);
	            body = addToBody(body, 2, [HEAL, MOVE]);
	            body = addToBody(body, 5, [MOVE]);
	            break;
	        case 6:
	            body = addToBody(body, 6, [RANGED_ATTACK]);
	            body = addToBody(body, 3, [HEAL, MOVE]);
	            body = addToBody(body, 6, [MOVE]);
	            break;
	        case 7:
	            body = addToBody(body, 15, [RANGED_ATTACK]);
	            body = addToBody(body, 5, [HEAL, MOVE]);
	            body = addToBody(body, 15, [MOVE]);
	            break;
	        case 8:
	            body = addToBody(body, 17, [RANGED_ATTACK]);
	            body = addToBody(body, 8, [HEAL, MOVE]);
	            body = addToBody(body, 17, [MOVE]);
	            break;
	    }
	    return body;
	}
	exports.getRangerBody = getRangerBody;
	function getMaxTierRanger(energy) {
	    return getMaxTier(energy, getRangerBody, 8);
	}
	exports.getMaxTierRanger = getMaxTierRanger;
	function getSupporterBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    switch (tier) {
	        case 1:
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            break;
	        case 2:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 3:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 2, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 4:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 3, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 5:
	            body = addToBody(body, 2, [RANGED_ATTACK]);
	            body = addToBody(body, 4, [HEAL, MOVE]);
	            body = addToBody(body, 2, [MOVE]);
	            break;
	        case 6:
	            body = addToBody(body, 3, [RANGED_ATTACK]);
	            body = addToBody(body, 5, [HEAL, MOVE]);
	            body = addToBody(body, 3, [MOVE]);
	            break;
	        case 7:
	            body = addToBody(body, 5, [RANGED_ATTACK]);
	            body = addToBody(body, 10, [HEAL, MOVE]);
	            body = addToBody(body, 5, [MOVE]);
	            break;
	        case 8:
	            body = addToBody(body, 10, [RANGED_ATTACK]);
	            body = addToBody(body, 15, [HEAL, MOVE]);
	            body = addToBody(body, 10, [MOVE]);
	            break;
	    }
	    return body;
	}
	exports.getSupporterBody = getSupporterBody;
	function getMaxTierSupporter(energy) {
	    return getMaxTier(energy, getSupporterBody, 8);
	}
	exports.getMaxTierSupporter = getMaxTierSupporter;
	function getPaladinBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    switch (tier) {
	        case 1:
	        case 2:
	            body = addToBody(body, tier, [MOVE, ATTACK]);
	            break;
	        case 3:
	            body = addToBody(body, 3, [ATTACK]);
	            body = addToBody(body, 3, [MOVE]);
	            body = addToBody(body, 1, [MOVE, HEAL]);
	            break;
	        case 4:
	            body = addToBody(body, 6, [ATTACK]);
	            body = addToBody(body, 6, [MOVE]);
	            body = addToBody(body, 1, [MOVE, HEAL]);
	            break;
	        case 5:
	            body = addToBody(body, 8, [ATTACK]);
	            body = addToBody(body, 8, [MOVE]);
	            body = addToBody(body, 2, [MOVE, HEAL]);
	            break;
	        case 6:
	            body = addToBody(body, 10, [ATTACK]);
	            body = addToBody(body, 10, [MOVE]);
	            body = addToBody(body, 3, [MOVE, HEAL]);
	            break;
	        case 7:
	        case 8:
	            body = addToBody(body, 20, [ATTACK]);
	            body = addToBody(body, 20, [MOVE]);
	            body = addToBody(body, 5, [MOVE, HEAL]);
	            break;
	    }
	    return body;
	}
	exports.getPaladinBody = getPaladinBody;
	function getMaxTierPaladin(energy) {
	    return getMaxTier(energy, getPaladinBody, 8);
	}
	exports.getMaxTierPaladin = getMaxTierPaladin;
	function getDrainerBody(tier) {
	    if (tier > 8) {
	        tier = 8;
	    }
	    let body = [];
	    switch (tier) {
	        case 1:
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            break;
	        case 2:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 1, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 3:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 2, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 4:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 3, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 5:
	            body = addToBody(body, 1, [RANGED_ATTACK]);
	            body = addToBody(body, 5, [HEAL, MOVE]);
	            body = addToBody(body, 1, [MOVE]);
	            break;
	        case 6:
	            body = addToBody(body, 2, [RANGED_ATTACK]);
	            body = addToBody(body, 6, [HEAL, MOVE]);
	            body = addToBody(body, 2, [MOVE]);
	            break;
	        case 7:
	            body = addToBody(body, 5, [RANGED_ATTACK]);
	            body = addToBody(body, 15, [HEAL, MOVE]);
	            body = addToBody(body, 5, [MOVE]);
	            break;
	        case 8:
	            body = addToBody(body, 5, [RANGED_ATTACK]);
	            body = addToBody(body, 20, [HEAL, MOVE]);
	            body = addToBody(body, 5, [MOVE]);
	            break;
	    }
	    return body;
	}
	exports.getDrainerBody = getDrainerBody;
	function getMaxTierDrainer(energy) {
	    return getMaxTier(energy, getDrainerBody, 8);
	}
	exports.getMaxTierDrainer = getMaxTierDrainer;
	function getKiterBody(tier) {
	    if (tier > 10) {
	        tier = 10;
	    }
	    return addToBody([], tier, [RANGED_ATTACK, MOVE, HEAL, MOVE]);
	}
	exports.getKiterBody = getKiterBody;
	function getMaxTierKiter(energy) {
	    return getMaxTier(energy, getKiterBody, 10);
	}
	exports.getMaxTierKiter = getMaxTierKiter;
	function getCostForBody(body) {
	    let cost = 0;
	    for (let bodypart of body) {
	        cost += getCostForBodypart(bodypart);
	    }
	    return cost;
	}
	exports.getCostForBody = getCostForBody;
	function getMaxTier(energy, bodyfunction, maxTier) {
	    let tier = 0;
	    let maxReached = false;
	    for (let i = 1; !maxReached; i++) {
	        let cost = getCostForBody(bodyfunction(i));
	        if (cost > energy || i > maxTier) {
	            maxReached = true;
	        }
	        else {
	            tier = i;
	        }
	    }
	    return tier;
	}
	function getCostForBodypart(bodypart) {
	    switch (bodypart) {
	        case TOUGH: return 10;
	        case MOVE: return 50;
	        case CARRY: return 50;
	        case ATTACK: return 80;
	        case WORK: return 100;
	        case RANGED_ATTACK: return 150;
	        case HEAL: return 250;
	        case CLAIM: return 600;
	        default: return 0;
	    }
	}
	function addToBody(body, count, parts) {
	    for (let i = 0; i < count; i++) {
	        for (let part of parts) {
	            body.push(part);
	        }
	    }
	    return body;
	}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";
	class Order {
	}
	exports.Order = Order;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Traveler_1 = __webpack_require__(22);
	Creep.prototype.hasState = function () {
	    return this.memory.state !== undefined;
	};
	Creep.prototype.getState = function () {
	    return this.memory.state;
	};
	Creep.prototype.setState = function (state) {
	    this.memory.state = state;
	};
	Creep.prototype.getHomeroom = function () {
	    return this.memory.homeroom;
	};
	Creep.prototype.isInHomeroom = function () {
	    return this.memory.homeroom === this.room.name;
	};
	Creep.prototype.isPrioritized = function () {
	    return this.memory.prioritized === true;
	};
	Creep.prototype.setPrioritized = function () {
	    this.memory.prioritized = true;
	};
	Creep.prototype.setNotPrioritized = function () {
	    this.memory.prioritized = false;
	};
	Creep.prototype.travelTo = function (destination, options, enemyCheck) {
	    if (options) {
	        if (options.allowHostile !== false) {
	            options.allowHostile = true;
	        }
	        if (options.maxOps === undefined) {
	            options.maxOps = 10000;
	        }
	    }
	    else {
	        options = { allowHostile: true, maxOps: 10000 };
	    }
	    return Traveler_1.traveler.travelTo(this, destination, options, enemyCheck);
	};
	Creep.prototype.travelToRoom = function (roomName, options, enemyCheck) {
	    if (options) {
	        options.range = 20;
	    }
	    else {
	        options = { range: 20 };
	    }
	    return this.travelTo({ pos: new RoomPosition(25, 25, roomName) }, options, enemyCheck);
	};
	Creep.prototype.missingHits = function () {
	    return this.hitsMax - this.hits;
	};
	Creep.prototype.isHurt = function () {
	    return this.hits < this.hitsMax;
	};
	Creep.prototype.isRenewing = function () {
	    return this.memory.renewing === true;
	};
	Creep.prototype.startRenewing = function () {
	    this.memory.renewing = true;
	};
	Creep.prototype.stopRenewing = function () {
	    this.memory.renewing = false;
	};
	Creep.prototype.isEmpty = function () {
	    return this.carry.energy === 0;
	};
	Creep.prototype.isFull = function () {
	    return _.sum(this.carry) === this.carryCapacity;
	};
	Creep.prototype.isDumping = function () {
	    return this.memory.dumping === true;
	};
	Creep.prototype.isFinishedDumping = function () {
	    return this.isDumping() && this.isEmpty();
	};
	Creep.prototype.isFinishedMining = function () {
	    return !this.isDumping() && this.isFull();
	};
	Creep.prototype.startDumping = function () {
	    this.memory.dumping = true;
	};
	Creep.prototype.stopDumping = function () {
	    this.memory.dumping = false;
	};
	Creep.prototype.isTanking = function () {
	    return this.memory.tanking === true;
	};
	Creep.prototype.isFinishedTanking = function () {
	    return this.isTanking() && this.isFull();
	};
	Creep.prototype.isInNeedOfTanking = function () {
	    return !this.isTanking() && this.isEmpty();
	};
	Creep.prototype.startTanking = function () {
	    this.memory.tanking = true;
	};
	Creep.prototype.stopTanking = function () {
	    this.memory.tanking = false;
	};
	Creep.prototype.getWorkerParts = function () {
	    return this.getActiveBodyparts(WORK);
	};
	Creep.prototype.isDisabled = function () {
	    return this.memory.disabled;
	};
	Creep.prototype.disable = function () {
	    this.memory.disabled = true;
	};
	Creep.prototype.enable = function () {
	    this.memory.disabled = undefined;
	};
	Creep.prototype.isAtBorder = function () {
	    return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomRepository = __webpack_require__(10);
	const IntelLib = __webpack_require__(5);
	const TravelLib = __webpack_require__(23);
	const REPORT_CPU_THRESHOLD = 50;
	const DEFAULT_MAXOPS = 20000;
	const DEFAULT_STUCK_VALUE = 3;
	class Traveler {
	    constructor() {
	        if (!Memory.empire) {
	            Memory.empire = {};
	        }
	        if (!Memory.empire.hostileRooms) {
	            Memory.empire.hostileRooms = {};
	        }
	        this.memory = Memory.empire;
	    }
	    findAllowedRooms(origin, destination, options = {}) {
	        _.defaults(options, { restrictDistance: 16 });
	        if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, destination) > options.restrictDistance) {
	            return {};
	        }
	        let allowedRooms = { [origin]: true, [destination]: true };
	        let ret = Game.map.findRoute(origin, destination, {
	            routeCallback: (roomName) => {
	                if (options.routeCallback) {
	                    let outcome = options.routeCallback(roomName);
	                    if (outcome !== undefined) {
	                        return outcome;
	                    }
	                }
	                if (options.restrictDistance !== undefined && Game.map.getRoomLinearDistance(origin, roomName) > options.restrictDistance) {
	                    return false;
	                }
	                let parsed;
	                if (options.preferHighway) {
	                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
	                    if (isHighway) {
	                        return 1;
	                    }
	                }
	                if (!options.allowSK && !Game.rooms[roomName]) {
	                    if (!parsed) {
	                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	                    }
	                    let fMod = parsed[1] % 10;
	                    let sMod = parsed[2] % 10;
	                    let isSK = !(fMod === 5 && sMod === 5) &&
	                        ((fMod >= 4) && (fMod <= 6)) &&
	                        ((sMod >= 4) && (sMod <= 6));
	                    if (isSK) {
	                        return 10;
	                    }
	                }
	                if (!options.allowHostile && this.memory.hostileRooms[roomName] &&
	                    roomName !== destination && roomName !== origin) {
	                    return Number.POSITIVE_INFINITY;
	                }
	                return 2.5;
	            },
	        });
	        if (!_.isArray(ret)) {
	            console.log(`couldn't findRoute to ${destination}`);
	            if (Memory.empire !== undefined) {
	                if (Memory.empire.inaccessible === undefined) {
	                    Memory.empire.inaccessible = [];
	                }
	                if (!_.contains(Memory.empire.inaccessible, destination)) {
	                    Memory.empire.inaccessible.push(destination);
	                }
	            }
	            return {};
	        }
	        for (let value of ret) {
	            allowedRooms[value.room] = true;
	        }
	        return allowedRooms;
	    }
	    findTravelPath(origin, destination, options = {}) {
	        _.defaults(options, {
	            ignoreCreeps: true,
	            range: 1,
	            maxOps: DEFAULT_MAXOPS,
	            obstacles: [],
	        });
	        let allowedRooms;
	        if (options.useFindRoute || (options.useFindRoute === undefined &&
	            Game.map.getRoomLinearDistance(origin.pos.roomName, destination.pos.roomName) > 2)) {
	            allowedRooms = this.findAllowedRooms(origin.pos.roomName, destination.pos.roomName, options);
	        }
	        let callback = (roomName) => {
	            if (options.roomCallback) {
	                if (options.ignoreCreeps === undefined) {
	                    options.ignoreCreeps = true;
	                }
	                let outcome = options.roomCallback(roomName, options.ignoreCreeps);
	                if (outcome !== undefined) {
	                    return outcome;
	                }
	            }
	            if (allowedRooms) {
	                if (!allowedRooms[roomName]) {
	                    return false;
	                }
	            }
	            else if (this.memory.hostileRooms[roomName] && !options.allowHostile) {
	                return false;
	            }
	            let room = Game.rooms[roomName];
	            if (!room) {
	                return new PathFinder.CostMatrix();
	            }
	            let matrix;
	            if (options.ignoreStructures) {
	                matrix = new PathFinder.CostMatrix();
	                if (!options.ignoreCreeps) {
	                    Traveler.addCreepsToMatrix(room, matrix);
	                }
	            }
	            else if (options.ignoreCreeps || roomName !== origin.pos.roomName) {
	                matrix = this.getStructureMatrix(room);
	            }
	            else {
	                matrix = this.getCreepMatrix(room);
	            }
	            if (options.avoidKeepers) {
	                matrix = Traveler.addHostilesToMatrix(room, matrix);
	            }
	            matrix = Traveler.addBasePositionsToMatrix(room, matrix);
	            if (options.obstacles === undefined) {
	                options.obstacles = [];
	            }
	            for (let obstacle of options.obstacles) {
	                matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
	            }
	            return matrix;
	        };
	        if (options.range === undefined) {
	            options.range = 1;
	        }
	        if (options.maxOps === undefined) {
	            options.maxOps = DEFAULT_MAXOPS;
	        }
	        return PathFinder.search(origin.pos, { pos: destination.pos, range: options.range }, {
	            maxOps: options.maxOps,
	            plainCost: options.ignoreRoads ? 1 : 2,
	            roomCallback: callback,
	            swampCost: options.ignoreRoads ? 5 : 10,
	        });
	    }
	    travelTo(creep, destination, options = {}, enemyCheck = false) {
	        if (enemyCheck && (creep.memory.lastEnemyCheck === undefined || creep.memory.lastEnemyCheck + 5 < Game.time)) {
	            if ((IntelLib.hasDangerousHostiles(creep.room.name) && TravelLib.isCloseToHostile(creep)) ||
	                (RoomRepository.isSKRoom(creep.room.name) && TravelLib.isCloseToSourceKeeper(creep))) {
	                creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false };
	                creep.memory.lastEnemyCheck = Game.time;
	            }
	        }
	        if (!creep.memory._travel) {
	            creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0, portalCheck: false };
	        }
	        let travelData = creep.memory._travel;
	        if (creep.fatigue > 0) {
	            travelData.tick = Game.time;
	            return ERR_BUSY;
	        }
	        if (!destination) {
	            return ERR_INVALID_ARGS;
	        }
	        if (Game.time % 10 === 0 && !travelData.portalCheck && RoomRepository.isPortalRoom(creep.pos.roomName)) {
	            let portals = creep.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
	            if (portals.length > 0) {
	                travelData.portalCheck = true;
	                delete travelData.path;
	            }
	        }
	        let rangeToDestination = creep.pos.getRangeTo(destination);
	        if (rangeToDestination <= 1) {
	            if (rangeToDestination === 1 && options.range !== undefined && !(options.range >= 1)) {
	                if (options.returnData) {
	                    options.returnData.nextPos = destination.pos;
	                }
	                return creep.move(creep.pos.getDirectionTo(destination));
	            }
	            return OK;
	        }
	        let hasMoved = true;
	        if (travelData.prev) {
	            travelData.prev = Traveler.initPosition(travelData.prev);
	            if (creep.pos.inRangeTo(travelData.prev, 0)) {
	                hasMoved = false;
	                travelData.stuck++;
	            }
	            else {
	                travelData.stuck = 0;
	            }
	        }
	        if (travelData.stuck >= DEFAULT_STUCK_VALUE && !options.ignoreStuck) {
	            options.ignoreCreeps = false;
	            delete travelData.path;
	        }
	        if (Game.time - travelData.tick > 1 && hasMoved) {
	            delete travelData.path;
	        }
	        travelData.tick = Game.time;
	        if (!travelData.dest || travelData.dest.x !== destination.pos.x || travelData.dest.y !== destination.pos.y ||
	            travelData.dest.roomName !== destination.pos.roomName) {
	            delete travelData.path;
	        }
	        if (!travelData.path) {
	            if (creep.spawning) {
	                return ERR_BUSY;
	            }
	            travelData.dest = destination.pos;
	            travelData.prev = undefined;
	            let cpu = Game.cpu.getUsed();
	            let ret = this.findTravelPath(creep, destination, options);
	            travelData.cpu += (Game.cpu.getUsed() - cpu);
	            travelData.count++;
	            if (travelData.cpu > REPORT_CPU_THRESHOLD) {
	            }
	            if (ret.incomplete) {
	                options.useFindRoute = true;
	                ret = this.findTravelPath(creep, destination, options);
	            }
	            travelData.path = Traveler.serializePath(creep.pos, ret.path);
	            travelData.stuck = 0;
	        }
	        if (!travelData.path || travelData.path.length === 0) {
	            return creep.moveTo(destination);
	        }
	        if (travelData.prev && travelData.stuck === 0) {
	            travelData.path = travelData.path.substr(1);
	        }
	        travelData.prev = creep.pos;
	        let nextDirection = parseInt(travelData.path[0], 10);
	        if (options.returnData) {
	            options.returnData.nextPos = Traveler.positionAtDirection(creep.pos, nextDirection);
	        }
	        return creep.move(nextDirection);
	    }
	    getStructureMatrix(room) {
	        this.refreshMatrices();
	        if (!this.structureMatrixCache[room.name]) {
	            let matrix = new PathFinder.CostMatrix();
	            this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
	        }
	        return this.structureMatrixCache[room.name];
	    }
	    static initPosition(pos) {
	        return new RoomPosition(pos.x, pos.y, pos.roomName);
	    }
	    static addStructuresToMatrix(room, matrix, roadCost) {
	        for (let structure of room.find(FIND_STRUCTURES)) {
	            if (structure instanceof StructureRampart) {
	                if (!structure.my) {
	                    matrix.set(structure.pos.x, structure.pos.y, 0xff);
	                }
	            }
	            else if (structure instanceof StructureRoad) {
	                matrix.set(structure.pos.x, structure.pos.y, roadCost);
	            }
	            else if (structure.structureType !== STRUCTURE_CONTAINER) {
	                matrix.set(structure.pos.x, structure.pos.y, 0xff);
	            }
	        }
	        for (let constructionSite of room.find(FIND_CONSTRUCTION_SITES)) {
	            if (constructionSite.structureType !== STRUCTURE_ROAD && constructionSite.structureType !== STRUCTURE_CONTAINER && constructionSite.structureType !== STRUCTURE_RAMPART) {
	                matrix.set(constructionSite.pos.x, constructionSite.pos.y, 0xff);
	            }
	        }
	        return matrix;
	    }
	    getCreepMatrix(room) {
	        this.refreshMatrices();
	        if (!this.creepMatrixCache[room.name]) {
	            this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room).clone());
	        }
	        return this.creepMatrixCache[room.name];
	    }
	    static addCreepsToMatrix(room, matrix) {
	        room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
	        return matrix;
	    }
	    static addHostilesToMatrix(room, matrix) {
	        let hostiles = room.find(FIND_HOSTILE_CREEPS);
	        let c, x, y, xpos, ypos;
	        for (c of hostiles) {
	            for (x = -5; x < 6; x++) {
	                for (y = -5; y < 6; y++) {
	                    xpos = c.pos.x + x;
	                    ypos = c.pos.y + y;
	                    if (xpos > 0 && xpos < 49 && ypos > 0 && ypos < 49) {
	                        matrix.set(xpos, ypos, 50);
	                    }
	                }
	            }
	        }
	        return matrix;
	    }
	    static addBasePositionsToMatrix(room, matrix) {
	        if (room.controller !== undefined && room.controller.my && room.controller.level > 3 && room.storage !== undefined) {
	            matrix.set(room.storage.pos.x, room.storage.pos.y - 1, 10);
	            matrix.set(room.storage.pos.x, room.storage.pos.y + 1, 10);
	            matrix.set(room.storage.pos.x, room.storage.pos.y - 4, 10);
	        }
	        return matrix;
	    }
	    static serializePath(startPos, path) {
	        let serializedPath = "";
	        let lastPosition = startPos;
	        for (let position of path) {
	            if (position.roomName === lastPosition.roomName) {
	                serializedPath += lastPosition.getDirectionTo(position);
	            }
	            lastPosition = position;
	        }
	        return serializedPath;
	    }
	    refreshMatrices() {
	        if (Game.time !== this.currentTick) {
	            this.currentTick = Game.time;
	            this.structureMatrixCache = {};
	            this.creepMatrixCache = {};
	        }
	    }
	    static positionAtDirection(origin, direction) {
	        let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
	        let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
	        return new RoomPosition(origin.x + offsetX[direction], origin.y + offsetY[direction], origin.roomName);
	    }
	}
	exports.Traveler = Traveler;
	exports.traveler = new Traveler();


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	function isCloseToSourceKeeper(creep) {
	    let closestSK = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => c.owner.username === "Source Keeper" });
	    if (closestSK !== undefined && creep.pos.getRangeTo(closestSK) < 5) {
	        return true;
	    }
	    return false;
	}
	exports.isCloseToSourceKeeper = isCloseToSourceKeeper;
	function isCloseToHostile(creep) {
	    let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	    if (closestHostile !== undefined && creep.pos.getRangeTo(closestHostile) < 6) {
	        return true;
	    }
	    return false;
	}
	exports.isCloseToHostile = isCloseToHostile;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	Mineral.prototype.memoryCheck = function () {
	    if (Memory.minerals === undefined) {
	        Memory.minerals = {};
	    }
	    if (Memory.minerals[this.id] === undefined) {
	        Memory.minerals[this.id] = {};
	    }
	};
	Mineral.prototype.hasExtractor = function () {
	    let structures = this.pos.lookFor(LOOK_STRUCTURES);
	    for (let structure of structures) {
	        if (structure instanceof StructureExtractor) {
	            return true;
	        }
	    }
	    return false;
	};
	Mineral.prototype.hasMiningContainer = function () {
	    return this.getMiningContainer() !== null;
	};
	Mineral.prototype.buildExtractor = function () {
	    return this.pos.createConstructionSite(STRUCTURE_EXTRACTOR) === 0;
	};
	Mineral.prototype.setMiningContainerId = function (id) {
	    this.memoryCheck();
	    Memory.minerals[this.id]["container"] = id;
	};
	Mineral.prototype.getMiningContainer = function () {
	    this.memoryCheck();
	    if (Memory.minerals[this.id]["container"] === undefined) {
	        this.buildMiningContainer();
	        return null;
	    }
	    let container = Game.getObjectById(Memory.minerals[this.id]["container"]);
	    if (container === null) {
	        Memory.minerals[this.id]["container"] = undefined;
	    }
	    return container;
	};
	Mineral.prototype.getMiningContainerConstructionSite = function () {
	    this.memoryCheck();
	    let position = this.getContainerPosition();
	    if (position !== undefined) {
	        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES);
	        for (let structure of structures) {
	            if (structure instanceof ConstructionSite && structure.structureType === STRUCTURE_CONTAINER) {
	                return structure;
	            }
	        }
	    }
	    return null;
	};
	Mineral.prototype.buildMiningContainer = function () {
	    this.memoryCheck();
	    let position = this.getContainerPosition();
	    if (position !== undefined) {
	        let structures = position.lookFor(LOOK_STRUCTURES);
	        for (let structure of structures) {
	            if (structure instanceof StructureContainer) {
	                Memory.minerals[this.id]["container"] = structure.id;
	            }
	        }
	    }
	    else {
	        return;
	    }
	    position.createConstructionSite(STRUCTURE_CONTAINER);
	};
	Mineral.prototype.getMiningPositions = function () {
	    let positions = [];
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
	            if (!(position.x === this.pos.x && position.y === this.pos.y)) {
	                let terrainAtPositon = Game.map.getTerrainAt(position);
	                if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
	                    positions.push(position);
	                }
	            }
	        }
	    }
	    return positions;
	};
	Mineral.prototype.getContainerPosition = function () {
	    this.memoryCheck();
	    if (Memory.minerals[this.id].containerPos !== undefined) {
	        let pos = Memory.minerals[this.id].containerPos;
	        return new RoomPosition(pos.x, pos.y, pos.roomName);
	    }
	    let positions = this.getMiningPositions();
	    if (positions.length === 1) {
	        return positions[0];
	    }
	    let neighbours = [];
	    for (let positionId in positions) {
	        let position = positions[positionId];
	        for (let potNeighbour of positions) {
	            if ((Math.abs(position.x - potNeighbour.x) + Math.abs(position.y - potNeighbour.y) === 1) ||
	                (Math.abs(position.x - potNeighbour.x) === 1 && Math.abs(position.y - potNeighbour.y) === 1)) {
	                if (neighbours[positionId] === undefined) {
	                    neighbours[positionId] = 1;
	                }
	                else {
	                    neighbours[positionId] = neighbours[positionId] + 1;
	                }
	            }
	        }
	    }
	    let maxPosId = undefined;
	    for (let positionId in neighbours) {
	        if (maxPosId === undefined || neighbours[parseInt(positionId)] > neighbours[parseInt(maxPosId)]) {
	            maxPosId = positionId;
	        }
	    }
	    if (maxPosId !== undefined) {
	        Memory.minerals[this.id].containerPos = positions[parseInt(maxPosId)];
	        return positions[parseInt(maxPosId)];
	    }
	    return undefined;
	};
	Mineral.prototype.getContainerMiningPositions = function () {
	    let positions = this.getMiningPositions();
	    let containerPosition = this.getContainerPosition();
	    let miningPositions = [];
	    for (let position of positions) {
	        if ((Math.abs(containerPosition.x - position.x) + Math.abs(containerPosition.y - position.y) < 2) ||
	            (Math.abs(containerPosition.x - position.x) === 1 && Math.abs(containerPosition.y - position.y) === 1)) {
	            miningPositions.push(position);
	        }
	    }
	    return miningPositions;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	Room.prototype.getHostileCreeps = function () {
	    return this.find(FIND_HOSTILE_CREEPS);
	};
	Room.prototype.getHostileCreepsNotAtBorder = function () {
	    return _.filter(this.getHostileCreeps(), function (c) { return !c.isAtBorder(); });
	};
	Room.prototype.hasHostileCreeps = function () {
	    return this.getHostileCreeps().length > 0;
	};
	Room.prototype.getSpawns = function () {
	    return this.find(FIND_MY_SPAWNS);
	};
	Room.prototype.getSpawn = function () {
	    let spawns = this.getSpawns();
	    if (spawns.length === 0) {
	        return undefined;
	    }
	    return spawns[0];
	};
	Room.prototype.getSources = function () {
	    return this.find(FIND_SOURCES);
	};
	Room.prototype.getMineral = function () {
	    let minerals = this.find(FIND_MINERALS);
	    if (minerals.length > 0) {
	        return minerals[0];
	    }
	    return undefined;
	};
	Room.prototype.hasFreeSpawnCapacity = function () {
	    let spawns = this.getSpawns();
	    if (spawns === undefined || spawns.length < 1) {
	        return false;
	    }
	    for (let spawn of spawns) {
	        if (!spawn.spawning) {
	            return true;
	        }
	    }
	    return false;
	};
	Room.prototype.getFreeSpawn = function () {
	    let spawns = this.getSpawns();
	    if (spawns === undefined || spawns.length < 1) {
	        return undefined;
	    }
	    for (let spawn of spawns) {
	        if (!spawn.spawning) {
	            return spawn;
	        }
	    }
	    return undefined;
	};
	Room.prototype.getBoostLab = function () {
	    if (this.memory.b === undefined) {
	        return undefined;
	    }
	    let split = this.memory.b.split("-");
	    let pos = new RoomPosition(+split[0], +split[1], this.name);
	    let structures = (new RoomPosition(pos.x + 1, pos.y + 4, pos.roomName)).lookFor(LOOK_STRUCTURES);
	    for (let s of structures) {
	        if (s.structureType === STRUCTURE_LAB) {
	            return s;
	        }
	    }
	    return undefined;
	};
	Room.prototype.getPowerSpawn = function () {
	    if (this.controller === undefined || this.controller.level < 8) {
	        return undefined;
	    }
	    if (this.memory.powerspawn !== undefined) {
	        let powerspawn = Game.getObjectById(this.memory.powerspawn);
	        if (powerspawn instanceof StructurePowerSpawn) {
	            return powerspawn;
	        }
	        else {
	            this.memory.powerspawn = undefined;
	        }
	    }
	    let powerspawn = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_POWER_SPAWN });
	    if (powerspawn.length > 0) {
	        this.memory.powerspawn = powerspawn[0].id;
	        return powerspawn[0];
	    }
	    return undefined;
	};
	Room.prototype.getNuker = function () {
	    if (this.controller === undefined || this.controller.level < 8) {
	        return undefined;
	    }
	    if (this.memory.nuker !== undefined) {
	        let nuker = Game.getObjectById(this.memory.nuker);
	        if (nuker instanceof StructureNuker) {
	            return nuker;
	        }
	        else {
	            this.memory.nuker = undefined;
	        }
	    }
	    let nuker = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_NUKER });
	    if (nuker.length > 0) {
	        this.memory.nuker = nuker[0].id;
	        return nuker[0];
	    }
	    return undefined;
	};
	Room.prototype.getObserver = function () {
	    if (this.controller === undefined || this.controller.level < 8) {
	        return undefined;
	    }
	    if (this.memory.observer !== undefined) {
	        let observer = Game.getObjectById(this.memory.observer);
	        if (observer instanceof StructureObserver) {
	            return observer;
	        }
	        else {
	            this.memory.observer = undefined;
	        }
	    }
	    let observer = this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_OBSERVER });
	    if (observer.length > 0) {
	        this.memory.observer = observer[0].id;
	        return observer[0];
	    }
	    return undefined;
	};
	Room.prototype.getBaseContainer = function () {
	    let c = Game.getObjectById(this.memory["roomContainer"]);
	    if (c instanceof StructureContainer) {
	        return c;
	    }
	    return undefined;
	};
	Room.prototype.getBaseLink = function () {
	    if (this.memory.b === undefined) {
	        return undefined;
	    }
	    let split = this.memory.b.split("-");
	    let pos = new RoomPosition(+split[0], +split[1], this.name);
	    let structures = (new RoomPosition(pos.x - 1, pos.y + 4, pos.roomName)).lookFor(LOOK_STRUCTURES);
	    for (let s of structures) {
	        if (s.structureType === STRUCTURE_LINK) {
	            return s;
	        }
	    }
	    return undefined;
	};
	Room.prototype.hasLabArea = function () {
	    if (this.memory.lab === undefined || this.memory.lab.operational === undefined) {
	        return false;
	    }
	    return this.memory.lab.operational === true;
	};
	Room.prototype.getProcessingLabs = function () {
	    let labs = [];
	    if (this.memory.lab !== undefined && this.memory.lab.processingLabs !== undefined) {
	        labs = _.map(this.memory.lab.processingLabs, function (id) {
	            return Game.getObjectById(id);
	        });
	    }
	    let boostLab = this.getBoostLab();
	    if (this.memory.boosting !== true && boostLab !== undefined) {
	        labs.push(boostLab);
	    }
	    return labs;
	};
	Room.prototype.getSupplyingLabs = function () {
	    if (this.memory.lab === undefined || this.memory.lab.supplyingLabs === undefined) {
	        return [];
	    }
	    return _.map(this.memory.lab.supplyingLabs, function (id) {
	        return Game.getObjectById(id);
	    });
	};
	Room.prototype.isExpansion = function () {
	    return this.memory.isExpansion === true;
	};
	Room.prototype.hasExpansion = function () {
	    return this.memory.expansion !== undefined;
	};
	Room.prototype.isAbandoned = function () {
	    return this.memory.isBeingDismantled === true;
	};
	Room.prototype.isUnderSiege = function () {
	    return this.memory.defcon !== undefined && this.memory.defcon > 1;
	};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	RoomPosition.prototype.getClosestSpawn = function () {
	    return this.findClosestByRange(FIND_MY_SPAWNS);
	};
	RoomPosition.prototype.hasFreeSpaceAround = function () {
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(this.x + x, this.y + y, this.roomName);
	            let terrainAtPositon = Game.map.getTerrainAt(position);
	            if (terrainAtPositon !== "swamp" && terrainAtPositon !== "plain") {
	                return false;
	            }
	        }
	    }
	    return true;
	};
	RoomPosition.prototype.getFreeSpaceAround = function () {
	    let c = 0;
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(this.x + x, this.y + y, this.roomName);
	            let terrainAtPositon = Game.map.getTerrainAt(position);
	            if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
	                c++;
	            }
	        }
	    }
	    return c;
	};
	RoomPosition.prototype.hasBuildingType = function (structureType) {
	    let structuresAtPos = this.lookFor(LOOK_STRUCTURES);
	    let constructionSitesAtPos = this.lookFor(LOOK_CONSTRUCTION_SITES);
	    for (let s of structuresAtPos) {
	        if (s.structureType === structureType) {
	            return true;
	        }
	    }
	    for (let c of constructionSitesAtPos) {
	        if (c.structureType === structureType) {
	            return true;
	        }
	    }
	    return false;
	};
	RoomPosition.prototype.getPositionInDirection = function (direction) {
	    switch (direction) {
	        case TOP:
	            return new RoomPosition(this.x, this.y - 1, this.roomName);
	        case TOP_RIGHT:
	            return new RoomPosition(this.x + 1, this.y - 1, this.roomName);
	        case RIGHT:
	            return new RoomPosition(this.x + 1, this.y, this.roomName);
	        case BOTTOM_RIGHT:
	            return new RoomPosition(this.x + 1, this.y + 1, this.roomName);
	        case BOTTOM:
	            return new RoomPosition(this.x, this.y + 1, this.roomName);
	        case BOTTOM_LEFT:
	            return new RoomPosition(this.x - 1, this.y + 1, this.roomName);
	        case LEFT:
	            return new RoomPosition(this.x - 1, this.y, this.roomName);
	        case TOP_LEFT:
	            return new RoomPosition(this.x - 1, this.y - 1, this.roomName);
	        default:
	            return new RoomPosition(this.x, this.y, this.roomName);
	    }
	};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	Source.prototype.memoryCheck = function () {
	    if (Memory.sources === undefined) {
	        Memory.sources = {};
	    }
	    if (Memory.sources[this.id] === undefined) {
	        Memory.sources[this.id] = {};
	    }
	};
	Source.prototype.hasMiningContainer = function () {
	    return this.getMiningContainer() !== null;
	};
	Source.prototype.setMiningContainerId = function (id) {
	    this.memoryCheck();
	    Memory.sources[this.id]["container"] = id;
	};
	Source.prototype.getMiningContainer = function () {
	    this.memoryCheck();
	    if (Memory.sources[this.id]["container"] === undefined) {
	        return null;
	    }
	    let container = Game.getObjectById(Memory.sources[this.id]["container"]);
	    if (container === null) {
	        Memory.sources[this.id]["container"] = undefined;
	    }
	    return container;
	};
	Source.prototype.getMiningContainerConstructionSite = function () {
	    this.memoryCheck();
	    let position = this.getContainerPosition();
	    if (position !== undefined) {
	        let structures = position.lookFor(LOOK_CONSTRUCTION_SITES);
	        for (let structure of structures) {
	            if (structure instanceof ConstructionSite && (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_CONTAINER)) {
	                return structure;
	            }
	        }
	    }
	    return null;
	};
	Source.prototype.buildMiningContainer = function () {
	    this.memoryCheck();
	    let containerPosition = this.getContainerPosition();
	    if (containerPosition !== undefined) {
	        let structures = containerPosition.lookFor(LOOK_STRUCTURES);
	        for (let structure of structures) {
	            if (structure instanceof StructureContainer) {
	                Memory.sources[this.id]["container"] = structure.id;
	            }
	            else if (structure instanceof StructureLink) {
	                structure.destroy();
	            }
	        }
	    }
	    else {
	        return;
	    }
	    containerPosition.createConstructionSite(STRUCTURE_CONTAINER);
	};
	Source.prototype.getMiningPositions = function () {
	    let positions = [];
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(this.pos.x + x, this.pos.y + y, this.room.name);
	            if (!(position.x === this.pos.x && position.y === this.pos.y)) {
	                let terrainAtPositon = Game.map.getTerrainAt(position);
	                if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
	                    positions.push(position);
	                }
	            }
	        }
	    }
	    return positions;
	};
	Source.prototype.getContainerPosition = function () {
	    this.memoryCheck();
	    if (Memory.sources[this.id].containerPos !== undefined) {
	        let pos = Memory.sources[this.id].containerPos;
	        return new RoomPosition(pos.x, pos.y, pos.roomName);
	    }
	    let positions = this.getMiningPositions();
	    if (positions.length === 1) {
	        Memory.sources[this.id].containerPos = positions[0];
	        return positions[0];
	    }
	    let neighbours = [];
	    for (let positionId in positions) {
	        let position = positions[positionId];
	        for (let potNeighbour of positions) {
	            if ((Math.abs(position.x - potNeighbour.x) + Math.abs(position.y - potNeighbour.y) === 1) ||
	                (Math.abs(position.x - potNeighbour.x) === 1 && Math.abs(position.y - potNeighbour.y) === 1)) {
	                if (neighbours[positionId] === undefined) {
	                    neighbours[positionId] = 1;
	                }
	                else {
	                    neighbours[positionId] = neighbours[positionId] + 1;
	                }
	            }
	        }
	    }
	    if (neighbours.length === 0) {
	        Memory.sources[this.id].containerPos = positions[0];
	        return positions[0];
	    }
	    let maxPosId = undefined;
	    for (let positionId in neighbours) {
	        if (maxPosId === undefined || neighbours[parseInt(positionId)] > neighbours[parseInt(maxPosId)]) {
	            maxPosId = positionId;
	        }
	    }
	    if (maxPosId !== undefined) {
	        Memory.sources[this.id].containerPos = positions[parseInt(maxPosId)];
	        return positions[parseInt(maxPosId)];
	    }
	    return undefined;
	};
	Source.prototype.getContainerMiningPositions = function () {
	    let positions = this.getMiningPositions();
	    let containerPosition = this.getContainerPosition();
	    let miningPositions = [];
	    for (let position of positions) {
	        if ((Math.abs(containerPosition.x - position.x) + Math.abs(containerPosition.y - position.y) < 2) ||
	            (Math.abs(containerPosition.x - position.x) === 1 && Math.abs(containerPosition.y - position.y) === 1)) {
	            miningPositions.push(position);
	        }
	    }
	    return miningPositions;
	};
	Source.prototype.getDistanceFrom = function (roomName) {
	    this.memoryCheck();
	    if (Memory.sources[this.id].basedistance !== undefined && Memory.sources[this.id].basedistanceRoom !== undefined &&
	        Memory.sources[this.id].basedistanceRoom === roomName) {
	        return Memory.sources[this.id].basedistance;
	    }
	    return undefined;
	};
	Source.prototype.setDistanceFrom = function (roomName, distance) {
	    this.memoryCheck();
	    Memory.sources[this.id].basedistance = distance;
	    Memory.sources[this.id].basedistanceRoom = roomName;
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const RoomRepository = __webpack_require__(10);
	class MemoryManager extends _Manager_1.Manager {
	    constructor() {
	        super("MemoryManager");
	        this.MEMORY_SHORTTERM = "shortterm";
	        this.MEMORY_LONGTERM = "longterm";
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            let lastRunShorterm = this.getValue(this.MEMORY_SHORTTERM);
	            if (lastRunShorterm === undefined || lastRunShorterm + 20 < Game.time) {
	                this.deleteCreepsFromMemory();
	                this.deleteOldBanksFromMemory();
	                this.assignRoomIndeces();
	                this.setValue(this.MEMORY_SHORTTERM, Game.time);
	            }
	            let lastRunLongterm = this.getValue(this.MEMORY_LONGTERM);
	            if (lastRunLongterm === undefined || lastRunLongterm + 2000 < Game.time) {
	                this.deleteOldIntelFromMemory();
	                this.deleteOldAbandonedRoomsFromMemory();
	                this.setValue(this.MEMORY_LONGTERM, Game.time);
	            }
	        }
	    }
	    assignRoomIndeces() {
	        for (let roomName of Object.keys(Game.rooms)) {
	            let room = Game.rooms[roomName];
	            if (room.controller !== undefined && room.controller.my) {
	                RoomRepository.getIndex(room);
	            }
	        }
	    }
	    deleteCreepsFromMemory() {
	        for (let i in Memory.creeps) {
	            if (!Game.creeps[i]) {
	                delete Memory.creeps[i];
	            }
	        }
	    }
	    deleteOldIntelFromMemory() {
	        for (let r in Memory.rooms) {
	            if (Memory.rooms[r].length === 0) {
	                delete Memory.rooms[r];
	            }
	            if (Memory.rooms[r].i !== undefined) {
	                if (Memory.rooms[r].i.t !== undefined) {
	                    Memory.rooms[r].i = JSON.stringify(Memory.rooms[r].i);
	                }
	                let intel = JSON.parse(Memory.rooms[r].i);
	                if (intel.t !== undefined && intel.t < (Game.time - 400000) && !Game.rooms[r]) {
	                    delete Memory.rooms[r];
	                }
	            }
	        }
	    }
	    deleteOldAbandonedRoomsFromMemory() {
	        for (let r in Memory.rooms) {
	            if (Memory.rooms[r].length > 1) {
	                let room = Game.rooms[r];
	                if (!Game.rooms[r] || (room.controller !== undefined && !room.controller.my)) {
	                    delete Memory.rooms[r].t;
	                    delete Memory.rooms[r].index;
	                    delete Memory.rooms[r].towerSleep;
	                    delete Memory.rooms[r].roomlevel;
	                    delete Memory.rooms[r].spawnpos;
	                    delete Memory.rooms[r].basehauler;
	                    delete Memory.rooms[r].controllerLink;
	                    delete Memory.rooms[r].baseLink;
	                    delete Memory.rooms[r].baseLab;
	                    delete Memory.rooms[r].miningMinerals;
	                    delete Memory.rooms[r].basecourier;
	                    delete Memory.rooms[r].neighbours;
	                    delete Memory.rooms[r].scoutqueue;
	                    delete Memory.rooms[r].baseInLink;
	                    delete Memory.rooms[r].dumpSources;
	                    delete Memory.rooms[r].roads;
	                    delete Memory.rooms[r].signingqueue;
	                    delete Memory.rooms[r].orders;
	                    delete Memory.rooms[r].lab;
	                    delete Memory.rooms[r].nuker;
	                    delete Memory.rooms[r].observer;
	                    delete Memory.rooms[r].highwaysClose;
	                    delete Memory.rooms[r].observerCounter;
	                    delete Memory.rooms[r].powerbanks;
	                    delete Memory.rooms[r].isBeingDismantled;
	                }
	            }
	        }
	    }
	    deleteOldBanksFromMemory() {
	        if (Memory.takenBanks === undefined) {
	            Memory.takenBanks = [];
	        }
	        let i = Memory.takenBanks.length;
	        while (i--) {
	            if (Memory.takenBanks[i] === null) {
	                Memory.takenBanks.splice(i, 1);
	            }
	            else if (Memory.takenBanks[i].tickGone !== undefined && Memory.takenBanks[i].tickGone < Game.time) {
	                Memory.takenBanks.splice(i, 1);
	            }
	        }
	    }
	}
	exports.MemoryManager = MemoryManager;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	const RoomLib = __webpack_require__(30);
	const _Manager_1 = __webpack_require__(14);
	class IntelManager extends _Manager_1.Manager {
	    constructor() {
	        super("IntelManager");
	        this.hasRun = false;
	        this.MEMORY_LASTRUN = "lastRun";
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 8 < Game.time) {
	                for (let roomName of Object.keys(Game.rooms)) {
	                    if (!RoomLib.roomIsHighway(roomName)) {
	                        let room = Game.rooms[roomName];
	                        IntelLib.saveIntelForRoom(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	                this.hasRun = true;
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 2 < Game.time) {
	                for (let roomName of Object.keys(Game.rooms)) {
	                    if (!RoomLib.roomIsHighway(roomName)) {
	                        let room = Game.rooms[roomName];
	                        IntelLib.saveIntelForRoom(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	            ;
	        }
	    }
	}
	exports.IntelManager = IntelManager;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const roomlevel_1 = __webpack_require__(11);
	const RoomRepository = __webpack_require__(10);
	function getAllRoomsBeingDismantled() {
	    let rooms = [];
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true &&
	            room.memory.isBeingDismantled === true) {
	            rooms.push(room);
	        }
	    }
	    return rooms;
	}
	exports.getAllRoomsBeingDismantled = getAllRoomsBeingDismantled;
	;
	function wallsShouldBeRemoved(room) {
	    return room.memory.removeWalls === true ||
	        (room.controller !== undefined && (room.controller.level === 1 || room.controller.level === 3));
	}
	exports.wallsShouldBeRemoved = wallsShouldBeRemoved;
	function roomShouldHaveJanitors(room) {
	    if (room.storage === undefined) {
	        let container = room.getBaseContainer();
	        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
	            container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
	    }
	    else {
	        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
	            room.storage.store[RESOURCE_ENERGY] > 5000 && !room.isExpansion();
	    }
	}
	exports.roomShouldHaveJanitors = roomShouldHaveJanitors;
	function roomShouldHaveBuilders(room) {
	    if (room.storage === undefined) {
	        let container = room.getBaseContainer();
	        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
	            container !== undefined && container.store[RESOURCE_ENERGY] > 500 && !room.isExpansion();
	    }
	    else {
	        return RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && room.controller !== undefined &&
	            room.storage.store[RESOURCE_ENERGY] > 10000 && !room.isExpansion();
	    }
	}
	exports.roomShouldHaveBuilders = roomShouldHaveBuilders;
	function roomIsHighway(roomName) {
	    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
	    return (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
	}
	exports.roomIsHighway = roomIsHighway;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const ProfileUtilities = __webpack_require__(19);
	const PathfindingUtilities = __webpack_require__(3);
	const Upgrader = __webpack_require__(32);
	const UpgraderHauler = __webpack_require__(33);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const EnergyLib = __webpack_require__(35);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	class UpgradeManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("UpgradeManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            this.creepService.runCreeps(role_1.Role.UpgraderWithBoost, Upgrader.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.UpgraderWithoutBoost, Upgrader.run);
	            this.creepService.runCreeps(role_1.Role.UpgraderHauler, UpgraderHauler.run);
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
	    setPraiseBoosting(rooms) {
	        if (Memory.settings.slow === true) {
	            return;
	        }
	        for (let room of rooms) {
	            if (room.controller === undefined || room.isAbandoned() || room.isExpansion())
	                continue;
	            if (room.controller.my && room.controller.level < 8 && room.storage !== undefined) {
	                if (room.storage.store[RESOURCE_ENERGY] > 300000 && room.memory.praiseBoost !== true) {
	                    console.log("Automatic praiseboost started in room: " + room.name);
	                    room.memory.praiseBoost = true;
	                    room.memory.praiseBoostAutomatic = true;
	                }
	                else if (room.storage.store[RESOURCE_ENERGY] < 100000 && room.memory.praiseBoost === true && room.memory.praiseBoostAutomatic === true) {
	                    console.log("Automatic praiseboost stopped in room: " + room.name);
	                    room.memory.praiseBoost = undefined;
	                    room.memory.praiseBoostAutomatic = undefined;
	                }
	            }
	            else if (room.controller.my && room.controller.level === 8 && room.memory.praiseBoost === true) {
	                room.memory.praiseBoost = undefined;
	                room.memory.praiseBoostAutomatic = undefined;
	            }
	        }
	    }
	    buildUpgradeStorage(rooms) {
	        for (let room of rooms) {
	            if (room.controller === undefined || room.isAbandoned())
	                continue;
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion && RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.AdvancedColony) {
	                room.controller.buildControllerContainer();
	            }
	            else if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.AdvancedColony) {
	                room.controller.buildControllerLink();
	            }
	        }
	    }
	    orderUpgradeUnits(rooms) {
	        for (let room of rooms) {
	            if (room.controller === undefined || room.isAbandoned() || room.isExpansion())
	                continue;
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony && (room.controller.hasContainer() || room.controller.hasLink())) {
	                this.orderUpgraders(room.controller);
	            }
	            if (room.memory.praiseBoost && room.controller.level < 8) {
	                this.orderControllerHauler(room.controller);
	            }
	        }
	    }
	    orderControllerHauler(controller) {
	        if (controller.room.storage === undefined) {
	            return;
	        }
	        let praisingPerTick = Math.floor(this.creepService.getNumberOfTiers(role_1.Role.Upgrader, controller.id) * 2.5);
	        let distanceFromStorage = PathfindingUtilities.getDistanseBetween(controller.room.storage.pos, controller.pos);
	        let neededTiers = Math.floor((praisingPerTick * distanceFromStorage * 2) / 100);
	        let activeUpgraders = this.creepService.getCreeps(role_1.Role.Upgrader, null, controller.room.name);
	        let activeTiers = this.creepService.getNumberOfTiers(role_1.Role.UpgraderHauler, null, controller.room.name);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(controller.room, role_1.Role.UpgraderHauler);
	        if (activeUpgraders.length > 1 && activeTiers + orderedTiers < neededTiers) {
	            let usedTier = Math.max(4, Math.min((neededTiers), ProfileUtilities.getMaxTierHauler(controller.room.energyCapacityAvailable)));
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getHaulerBody(usedTier);
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.UpgraderHauler, target: controller.id, tier: usedTier };
	            OrdersRepository.orderCreep(controller.room, order);
	        }
	    }
	    orderUpgraders(controller) {
	        let needed = 1;
	        let activeCreeps = this.creepService.getCreeps(role_1.Role.Upgrader, controller.id);
	        let ordered = OrdersRepository.getCreepsInQueue(controller.room, role_1.Role.Upgrader, controller.id);
	        if (controller.level === 8) {
	            let energyLimit = 200000;
	            if (Memory.settings.powerfocus === true) {
	                energyLimit = 450000;
	            }
	            if (controller.ticksToDowngrade < 10000 ||
	                (controller.room.storage !== undefined && controller.room.storage.store.energy > energyLimit)) {
	                needed = 1;
	            }
	            else {
	                return;
	            }
	        }
	        else if (controller.room.storage === undefined && EnergyLib.roomIsFull(controller.room)) {
	            let controllerContainer = controller.getContainer();
	            if (ordered === 0 && controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] > (controllerContainer.storeCapacity / 2)) {
	                needed = Math.min(activeCreeps.length + 1, 7);
	            }
	        }
	        else if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] > 200000 && controller.level === 5) {
	            needed = 2;
	        }
	        else if (controller.room.storage !== undefined && controller.room.storage.store[RESOURCE_ENERGY] < 30000) {
	            return;
	        }
	        let activeWorkerparts = Math.floor(this.creepService.getNumberOfTiers(role_1.Role.Upgrader, controller.id) * 2.5);
	        let orderedWorkerparts = Math.floor(OrdersRepository.getNumberOfTiersInQueue(controller.room, role_1.Role.Upgrader, controller.id) * 2.5);
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
	            }
	            else {
	                needed = 5;
	            }
	        }
	        if (active + ordered < needed && (activeWorkerparts + orderedWorkerparts < 60 || controller.room.memory.praiseBoost)) {
	            let usedTier = ProfileUtilities.getMaxTierStationaryWorker(controller.room.energyCapacityAvailable);
	            let boost = undefined;
	            if (controller.level === 8) {
	                usedTier = Math.min(usedTier, 6);
	            }
	            if (!controller.room.memory.praiseBoost && controller.room.getBoostLab() !== undefined && controller.room.terminal !== undefined &&
	                controller.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] >= 1000) {
	                boost = [RESOURCE_CATALYZED_GHODIUM_ACID];
	            }
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getStationaryWorkerBody(usedTier);
	            order.priority = priority_1.Priority.Standard;
	            if (active > 3) {
	                order.priority = priority_1.Priority.Low;
	            }
	            order.memory = { role: role_1.Role.Upgrader, target: controller.id, tier: usedTier, boost: boost };
	            OrdersRepository.orderCreep(controller.room, order);
	        }
	    }
	}
	exports.UpgradeManager = UpgradeManager;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	function run(creep) {
	    let controller = Game.getObjectById(creep.memory.target);
	    if (controller === undefined) {
	        console.log("Upgrader without a valid controller: " + creep.name);
	    }
	    if (creep.memory.container === undefined) {
	        setMyContainer(creep);
	    }
	    let container = Game.getObjectById(creep.memory.container);
	    if (container === null) {
	        creep.memory.container = undefined;
	        return;
	    }
	    if (creep.isEmpty() || creep.carry.energy < 35) {
	        let responseTransfer = creep.withdraw(container, RESOURCE_ENERGY);
	        if (responseTransfer === ERR_NOT_IN_RANGE) {
	            creep.travelTo(container);
	            return;
	        }
	    }
	    let response = creep.upgradeController(controller);
	    if (response === OK || creep.memory.pos !== undefined) {
	        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	        }
	        if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	        }
	        else {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	        }
	        if (Game.time % 10 === 0) {
	            if (creep.memory.pos === undefined) {
	                setUpgraderPos(creep, container.pos);
	            }
	            if (creep.memory.pos.x !== undefined && creep.memory.pos.y !== undefined && creep.memory.pos.roomName !== undefined) {
	                if (creep.pos.x !== creep.memory.pos.x || creep.pos.y !== creep.memory.pos.y) {
	                    let wantedPos = new RoomPosition(creep.memory.pos.x, creep.memory.pos.y, creep.memory.pos.roomName);
	                    let creeps = wantedPos.lookFor(LOOK_CREEPS);
	                    if (creeps.length > 0) {
	                        creep.memory.pos === undefined;
	                    }
	                    else {
	                        creep.moveTo(wantedPos);
	                    }
	                }
	            }
	        }
	    }
	    else if (response === ERR_NOT_IN_RANGE) {
	        if (creep.memory.pos !== undefined && creep.memory.pos.x !== undefined && creep.memory.pos.y !== undefined && creep.memory.pos.roomName !== undefined) {
	            if (creep.pos.x !== creep.memory.pos.x || creep.pos.y !== creep.memory.pos.y) {
	                let wantedPos = new RoomPosition(creep.memory.pos.x, creep.memory.pos.y, creep.memory.pos.roomName);
	                let creeps = wantedPos.lookFor(LOOK_CREEPS);
	                if (creeps.length > 0) {
	                    creep.memory.pos === undefined;
	                }
	                else {
	                    creep.moveTo(wantedPos);
	                    return;
	                }
	            }
	        }
	        creep.travelTo(container);
	    }
	}
	exports.run = run;
	function setUpgraderPos(creep, around) {
	    for (let x of _.range(-1, 2)) {
	        for (let y of _.range(-1, 2)) {
	            if (x !== 0 || y !== 0) {
	                let pos = new RoomPosition(around.x + x, around.y + y, around.roomName);
	                let creeps = pos.lookFor(LOOK_CREEPS);
	                let structs = pos.lookFor(LOOK_STRUCTURES);
	                if (creeps.length === 0 && structs.length === 0) {
	                    creep.memory.pos = pos;
	                    return;
	                }
	            }
	        }
	    }
	    creep.memory.pos = creep.pos;
	}
	function setMyContainer(creep) {
	    let controller = Game.getObjectById(creep.memory.target);
	    if (!(controller instanceof StructureController)) {
	        console.log("Error with controller for upgrader: " + creep.name);
	        return;
	    }
	    let container = controller.getContainerOrLink();
	    if (container instanceof StructureContainer || container instanceof StructureLink) {
	        creep.memory.container = container.id;
	    }
	}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const _Common = __webpack_require__(34);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["TankUp"] = 1] = "TankUp";
	    State[State["GiveEnergyToCreep"] = 2] = "GiveEnergyToCreep";
	    State[State["DropEnergyInContainer"] = 3] = "DropEnergyInContainer";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.TankUp);
	    }
	    switch (creep.getState()) {
	        case State.TankUp:
	            runTankUp(creep);
	            break;
	        case State.GiveEnergyToCreep:
	            runGiveEnergyToCreep(creep);
	            break;
	        case State.DropEnergyInContainer:
	            runDropEnergyInContainer(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.TankUp);
	            break;
	    }
	}
	exports.run = run;
	function runTankUp(creep) {
	    if (creep.carry.energy < creep.carryCapacity &&
	        creep.room.storage !== undefined) {
	        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	        if (creep.room.storage.store[RESOURCE_ENERGY] < 2000) {
	            return;
	        }
	        if (distanceToStorage > 1) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        if (creep.room.controller.hasContainer()) {
	            creep.setState(State.DropEnergyInContainer);
	            runDropEnergyInContainer(creep);
	        }
	        else {
	            creep.setState(State.GiveEnergyToCreep);
	            runGiveEnergyToCreep(creep);
	        }
	    }
	}
	function runGiveEnergyToCreep(creep) {
	    if (creep.carry.energy === 0) {
	        if (!shouldShouldAnotherRun(creep)) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.TankUp);
	        runTankUp(creep);
	        return;
	    }
	    let upgrader = Game.getObjectById(creep.memory.upgrader);
	    if (upgrader === null || upgrader.carry.energy > upgrader.carryCapacity - 50) {
	        creep.memory.upgrader = undefined;
	        upgrader = findUpgraderToProvide(creep);
	    }
	    if (upgrader === null) {
	        if (creep.room.controller === undefined) {
	            _Common.moveOffRoad(creep);
	            return;
	        }
	        let rangeToController = creep.pos.getRangeTo(creep.room.controller);
	        if (rangeToController > 5) {
	            creep.travelTo(creep.room.controller);
	        }
	        else {
	            _Common.moveOffRoad(creep);
	        }
	        return;
	    }
	    let distanceToUpgrader = creep.pos.getRangeTo(upgrader.pos);
	    if (distanceToUpgrader > 1) {
	        creep.moveTo(upgrader);
	    }
	    else {
	        creep.transfer(upgrader, RESOURCE_ENERGY);
	        creep.memory.upgrader = undefined;
	    }
	}
	function runDropEnergyInContainer(creep) {
	    if (creep.carry.energy === 0) {
	        if (!shouldShouldAnotherRun(creep)) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.TankUp);
	        runTankUp(creep);
	        return;
	    }
	    let container = creep.room.controller.getContainer();
	    if (container === undefined) {
	        creep.setState(State.GiveEnergyToCreep);
	        runGiveEnergyToCreep(creep);
	        return;
	    }
	    let distanceToUpgrader = creep.pos.getRangeTo(container.pos);
	    if (distanceToUpgrader > 1) {
	        creep.moveTo(container);
	    }
	    else {
	        if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
	            creep.transfer(container, RESOURCE_ENERGY);
	        }
	    }
	}
	function findUpgraderToProvide(creep) {
	    let creeps = creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === role_1.Role.Upgrader && c.carry.energy < c.carryCapacity / 2 });
	    if (creeps.length > 0) {
	        let closest = creep.pos.findClosestByRange(creeps);
	        creep.memory.upgrader = closest.id;
	        return closest;
	    }
	    return null;
	}
	function shouldShouldAnotherRun(creep) {
	    if (creep.room.storage === undefined) {
	        return false;
	    }
	    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, creep.room.storage.pos);
	    return creep.ticksToLive > distanceToTerminal * 3;
	}


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathFindingUtilities = __webpack_require__(3);
	const RoomRepository = __webpack_require__(10);
	const IntelLib = __webpack_require__(5);
	function targetRoomHasInvaders(creep, targetRoom) {
	    if (targetRoom === creep.getHomeroom()) {
	        return false;
	    }
	    if (IntelLib.hasIntel(targetRoom)) {
	        if (IntelLib.hasDangerousHostiles(targetRoom)) {
	            if (creep.room.name === targetRoom || (creep.room.name !== targetRoom && (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49))) {
	                creep.travelToRoom(creep.getHomeroom(), undefined, true);
	            }
	            else {
	                moveOffRoad(creep);
	            }
	            return true;
	        }
	    }
	    return false;
	}
	exports.targetRoomHasInvaders = targetRoomHasInvaders;
	function moveHomeAndHealIfHurt(creep) {
	    if (creep.hits < creep.hitsMax - 100) {
	        if (!creep.isInHomeroom() || (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49)) {
	            creep.travelToRoom(creep.getHomeroom());
	        }
	        else {
	            moveOffRoad(creep);
	        }
	        return true;
	    }
	    return false;
	}
	exports.moveHomeAndHealIfHurt = moveHomeAndHealIfHurt;
	function getTravelDestinasion(creep) {
	    if (creep.memory._travel !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest !== undefined && creep.memory._travel.dest.roomName !== undefined) {
	        return new RoomPosition(creep.memory._travel.dest.x, creep.memory._travel.dest.y, creep.memory._travel.dest.roomName);
	    }
	    return undefined;
	}
	exports.getTravelDestinasion = getTravelDestinasion;
	function isCloseToSourceKeeper(creep, time = 10, distance = 5) {
	    if (!isInSKRoom(creep)) {
	        return false;
	    }
	    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
	    if (nearby.length > 0) {
	        return true;
	    }
	    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
	            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
	        } });
	    if (lairSpawningSoon.length > 0) {
	        return true;
	    }
	    return false;
	}
	exports.isCloseToSourceKeeper = isCloseToSourceKeeper;
	function positionIsCloseToSourceKeeper(position, time = 2, distance = 6) {
	    if (!RoomRepository.isSKRoom(position.roomName) || Game.rooms[position.roomName] === undefined) {
	        return false;
	    }
	    let nearby = position.findInRange(FIND_HOSTILE_CREEPS, 5);
	    if (nearby.length > 0) {
	        return true;
	    }
	    let lairSpawningSoon = position.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
	            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
	        } });
	    if (lairSpawningSoon.length > 0) {
	        return true;
	    }
	    return false;
	}
	exports.positionIsCloseToSourceKeeper = positionIsCloseToSourceKeeper;
	function stayAwayFromSourceKeeper(creep, time = 10, distance = 5) {
	    if (!isInSKRoom(creep)) {
	        return false;
	    }
	    let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
	    if (nearby.length > 0) {
	        if (creep.pos.getRangeTo(nearby[0]) < distance) {
	            creep.moveTo(getFleeMove(creep, nearby[0].pos));
	        }
	        else {
	            moveOffRoad(creep);
	        }
	        return true;
	    }
	    let lairSpawningSoon = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, distance, { filter: function (l) {
	            return l.structureType === STRUCTURE_KEEPER_LAIR && (l.ticksToSpawn !== undefined && l.ticksToSpawn < time);
	        } });
	    if (lairSpawningSoon.length > 0) {
	        if (creep.pos.getRangeTo(lairSpawningSoon[0]) < distance) {
	            creep.moveTo(getFleeMove(creep, lairSpawningSoon[0].pos));
	        }
	        else {
	            moveOffRoad(creep);
	        }
	        return true;
	    }
	    return false;
	}
	exports.stayAwayFromSourceKeeper = stayAwayFromSourceKeeper;
	function moveOffRoad(creep) {
	    let atPos = creep.pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_ROAD) {
	            let offroadPosition = getOffroadMovePosition(creep);
	            creep.moveTo(offroadPosition);
	            return true;
	        }
	    }
	    return false;
	}
	exports.moveOffRoad = moveOffRoad;
	function moveRandomDirection(creep) {
	    creep.move(getRandomDirection());
	}
	exports.moveRandomDirection = moveRandomDirection;
	function getRandomDirection() {
	    let possibleDirections = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
	    return possibleDirections[(Math.floor(Math.random() * possibleDirections.length))];
	}
	function getOffroadMovePosition(creep) {
	    let path = PathFinder.search(creep.pos, { pos: creep.pos, range: 10 }, {
	        plainCost: 1,
	        swampCost: 2,
	        flee: true,
	        roomCallback: PathFindingUtilities.getOffroadRoomCallback,
	        maxRooms: 1
	    }).path;
	    for (let pos of path) {
	        let structs = pos.lookFor(LOOK_STRUCTURES);
	        let creeps = pos.lookFor(LOOK_CREEPS);
	        if (structs.length === 0 && creeps.length === 0) {
	            return pos;
	        }
	    }
	    return path[0];
	}
	function getFleeMove(creep, position) {
	    return PathFinder.search(creep.pos, { pos: position, range: 7 }, {
	        plainCost: 1,
	        swampCost: 10,
	        flee: true,
	        roomCallback: PathFindingUtilities.getKitingRoomCallback,
	        maxRooms: 1
	    }).path[0];
	}
	function isInSKRoom(creep) {
	    return RoomRepository.isSKRoom(creep.room.name);
	}


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomUtilities = __webpack_require__(36);
	function roomIsFull(room) {
	    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
	        if (room.energyAvailable < room.energyCapacityAvailable) {
	            return false;
	        }
	        let baseContainer = room.getBaseContainer();
	        if (baseContainer !== undefined && !(baseContainer.store[RESOURCE_ENERGY] < baseContainer.storeCapacity - 50)) {
	            let controllerContainer = room.controller.getContainer();
	            if (controllerContainer !== undefined) {
	                if (controllerContainer.store[RESOURCE_ENERGY] > 1000) {
	                    return true;
	                }
	                else {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }
	    return false;
	}
	exports.roomIsFull = roomIsFull;
	function getBuildingIdForTanking(room) {
	    if (room.storage !== undefined) {
	        return room.storage.id;
	    }
	    let baseContainer = room.getBaseContainer();
	    if (baseContainer instanceof StructureContainer) {
	        return baseContainer.id;
	    }
	    if (room.terminal !== undefined) {
	        return room.terminal.id;
	    }
	    let containersInRoom = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
	    for (let container of containersInRoom) {
	        return container.id;
	    }
	    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
	    for (let spawn of spawnsInRoom) {
	        return spawn.id;
	    }
	    console.log("Error: No place found for tanking energy in room: " + room.name);
	    return "";
	}
	exports.getBuildingIdForTanking = getBuildingIdForTanking;
	function getBuildingIdForDump(room, creep) {
	    if (room.storage !== undefined && room.storage.isActive()) {
	        return room.storage.id;
	    }
	    if (room.terminal !== undefined && room.terminal.isActive()) {
	        return room.terminal.id;
	    }
	    let baseContainer = room.getBaseContainer();
	    if (baseContainer !== undefined && baseContainer.store[RESOURCE_ENERGY] < 1500) {
	        return baseContainer.id;
	    }
	    let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	    for (let tower of towersInRoom) {
	        if (tower.energy < tower.energyCapacity - 50) {
	            return tower.id;
	        }
	    }
	    if (creep.room.name === room.name) {
	        let closestExtensionOrSpawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function (e) {
	                return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
	            } });
	        if (closestExtensionOrSpawn !== undefined && closestExtensionOrSpawn !== null) {
	            return closestExtensionOrSpawn.id;
	        }
	    }
	    else {
	        let extensionsAndSpawns = room.find(FIND_MY_STRUCTURES, { filter: function (e) {
	                return (e.structureType === STRUCTURE_EXTENSION || e.structureType === STRUCTURE_SPAWN) && e.energy < e.energyCapacity;
	            } });
	        if (extensionsAndSpawns.length > 0) {
	            return extensionsAndSpawns[(_.random(0, extensionsAndSpawns.length - 1))].id;
	        }
	    }
	    let controllerContainer = room.controller.getContainer();
	    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < 1000 &&
	        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] > 500) {
	        return controllerContainer.id;
	    }
	    if (controllerContainer instanceof StructureContainer && controllerContainer.store[RESOURCE_ENERGY] < (controllerContainer.storeCapacity - 100) &&
	        baseContainer instanceof StructureContainer && baseContainer.store[RESOURCE_ENERGY] === baseContainer.storeCapacity) {
	        return controllerContainer.id;
	    }
	    if (baseContainer instanceof StructureContainer) {
	        return baseContainer.id;
	    }
	    let spawn = room.getSpawn();
	    if (spawn !== undefined) {
	        return spawn.id;
	    }
	    console.log("Error: No place found for dumping energy in room: " + room.name);
	    return "";
	}
	exports.getBuildingIdForDump = getBuildingIdForDump;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	const RoomRepository = __webpack_require__(10);
	function getAllControlledRooms() {
	    let rooms = [];
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true &&
	            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom !== true) {
	            rooms.push(room);
	        }
	    }
	    return rooms;
	}
	exports.getAllControlledRooms = getAllControlledRooms;
	;
	function getAllPraiseRooms() {
	    let rooms = [];
	    for (let roomKey in Game.rooms) {
	        let room = Game.rooms[roomKey];
	        if (room.controller !== undefined && room.controller.my === true &&
	            room.memory.isBeingDismantled !== true && room.memory.isPraiseRoom === true) {
	            rooms.push(room);
	        }
	    }
	    return rooms;
	}
	exports.getAllPraiseRooms = getAllPraiseRooms;
	;
	function getMinerals() {
	    let minerals = {};
	    let rooms = getAllControlledRooms();
	    for (let room of rooms) {
	        let mineral = room.getMineral();
	        if (mineral instanceof Mineral) {
	            if (minerals[mineral.mineralType] !== undefined) {
	                minerals[mineral.mineralType]++;
	            }
	            else {
	                minerals[mineral.mineralType] = 1;
	            }
	        }
	        if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
	            let praiseroom = room.memory.praiseroom;
	            if (Game.rooms[praiseroom] instanceof Room) {
	                let mineral = Game.rooms[praiseroom].getMineral();
	                if (mineral instanceof Mineral) {
	                    if (minerals[mineral.mineralType] !== undefined) {
	                        minerals[mineral.mineralType]++;
	                    }
	                    else {
	                        minerals[mineral.mineralType] = 1;
	                    }
	                }
	            }
	        }
	        if (room.memory.poaching !== undefined) {
	            for (let o of room.memory.poaching) {
	                let mineral = IntelLib.mineralType(o);
	                if (mineral !== undefined) {
	                    if (minerals[mineral] !== undefined) {
	                        minerals[mineral]++;
	                    }
	                    else {
	                        minerals[mineral] = 1;
	                    }
	                }
	            }
	        }
	        let lairs = RoomRepository.getLairOutposts(room);
	        for (let outpost of lairs) {
	            let mineral = IntelLib.mineralType(outpost);
	            if (mineral !== undefined) {
	                if (minerals[mineral] !== undefined) {
	                    minerals[mineral]++;
	                }
	                else {
	                    minerals[mineral] = 1;
	                }
	            }
	        }
	    }
	    return minerals;
	}
	exports.getMinerals = getMinerals;
	;
	function hasContainer(room) {
	    let baseContainer = room.getBaseContainer();
	    return baseContainer !== undefined;
	}
	exports.hasContainer = hasContainer;
	function getOutpostMineralContainers(room) {
	    let containers = [];
	    let lairs = RoomRepository.getLairOutposts(room);
	    for (let outpostName of lairs) {
	        if (Game.rooms[outpostName] !== undefined) {
	            let mineral = Game.rooms[outpostName].getMineral();
	            if (mineral !== undefined) {
	                let container = mineral.getMiningContainer();
	                if (container !== null) {
	                    containers.push(container);
	                }
	            }
	        }
	    }
	    return containers;
	}
	exports.getOutpostMineralContainers = getOutpostMineralContainers;
	function getProcessingLabs(room) {
	    let basePosition = RoomRepository.getBasePosition(room);
	    if (basePosition === undefined) {
	        return [];
	    }
	    let spawnPos = basePosition;
	    let labs = [];
	    let positions = [[-1, 5], [-1, 6], [-1, 7], [0, 7], [1, 7], [2, 5], [2, 6]];
	    for (let p of positions) {
	        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
	        let structs = labPos.lookFor(LOOK_STRUCTURES);
	        for (let s of structs) {
	            if (s.structureType === STRUCTURE_LAB) {
	                labs.push(s.id);
	            }
	        }
	    }
	    return labs;
	}
	exports.getProcessingLabs = getProcessingLabs;
	function getSupplyLabs(room) {
	    let basePosition = RoomRepository.getBasePosition(room);
	    if (basePosition === undefined) {
	        return [];
	    }
	    let spawnPos = basePosition;
	    let labs = [];
	    let positions = [[0, 5], [1, 6]];
	    for (let p of positions) {
	        let labPos = new RoomPosition(spawnPos.x + p[0], spawnPos.y + p[1], spawnPos.roomName);
	        let structs = labPos.lookFor(LOOK_STRUCTURES);
	        for (let s of structs) {
	            if (s.structureType === STRUCTURE_LAB) {
	                labs.push(s.id);
	            }
	        }
	    }
	    return labs;
	}
	exports.getSupplyLabs = getSupplyLabs;
	function hasAtLeastExtensions(room, count) {
	    let extensionsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } });
	    return extensionsInRoom.length >= count;
	}
	exports.hasAtLeastExtensions = hasAtLeastExtensions;
	function hasAtLeastSpawns(room, count) {
	    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
	    return spawnsInRoom.length >= count;
	}
	exports.hasAtLeastSpawns = hasAtLeastSpawns;
	function hasAtLeastLabs(room, count) {
	    let spawnsInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LAB } });
	    return spawnsInRoom.length >= count;
	}
	exports.hasAtLeastLabs = hasAtLeastLabs;
	function hasActiveTower(room) {
	    let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	    for (let tower of towersInRoom) {
	        if (tower.energy < tower.energyCapacity / 2) {
	            return false;
	        }
	    }
	    if (towersInRoom.length > 0) {
	        return true;
	    }
	    return false;
	}
	exports.hasActiveTower = hasActiveTower;
	function hasTerminal(room) {
	    return (room.terminal !== undefined && room.terminal.my && room.terminal.isActive());
	}
	exports.hasTerminal = hasTerminal;
	function hasStorage(room) {
	    return (room.storage !== undefined && room.storage.my && room.storage.isActive());
	}
	exports.hasStorage = hasStorage;
	function roomlevelIsAt(room, roomlevel) {
	    return RoomRepository.getRoomLevel(room) === roomlevel;
	}
	exports.roomlevelIsAt = roomlevelIsAt;
	function controllerLevelAtLeast(room, level) {
	    return room.controller.level >= level;
	}
	exports.controllerLevelAtLeast = controllerLevelAtLeast;
	function controllerLevelBelow(room, level) {
	    return room.controller.level < level;
	}
	exports.controllerLevelBelow = controllerLevelBelow;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	class InterfaceManager extends _Manager_1.Manager {
	    constructor() {
	        super("InterfaceManager");
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            if (Game.flags["Layout"] instanceof Flag) {
	                let pos = Game.flags.Layout.pos;
	                new RoomVisual(pos.roomName).rect(pos.x - 4.5, pos.y - 3.5, 9, 10);
	                new RoomVisual(pos.roomName).rect(pos.x - 0.5, pos.y + 6.5, 3, 1);
	            }
	            if (Game.flags["Base"] instanceof Flag) {
	                let pos = Game.flags["Base"].pos;
	                new RoomVisual(pos.roomName).rect(pos.x - 3.5, pos.y - 1.5, 7, 5);
	                new RoomVisual(pos.roomName).rect(pos.x - 5.5, pos.y - 6.5, 11, 5);
	                new RoomVisual(pos.roomName).rect(pos.x - 2.5, pos.y + 3.5, 5, 4);
	                new RoomVisual(pos.roomName).rect(pos.x - 6.5, pos.y - 0.5, 3, 5);
	                new RoomVisual(pos.roomName).rect(pos.x + 3.5, pos.y - 0.5, 3, 5);
	            }
	            if (Game.flags["Pacman"] instanceof Flag) {
	                let pos = Game.flags["Pacman"].pos;
	                let pacmanpoints = [];
	                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 4.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 4.5, pos.y - 0.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 11.5, pos.y - 0.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 15.5, pos.y + 3.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 20.5, pos.y + 6.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 20.5, pos.y + 9.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 15.5, pos.y + 12.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 11.5, pos.y + 16.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x + 4.5, pos.y + 16.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 11.5, pos.roomName));
	                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 4.5, pos.roomName));
	                new RoomVisual(pos.roomName).poly(pacmanpoints);
	            }
	            if (Game.flags["Ayce"] instanceof Flag) {
	                let pos = Game.flags["Ayce"].pos;
	                new RoomVisual(pos.roomName).rect(pos.x - 0.5, pos.y - 0.5, 20, 5);
	            }
	        }
	    }
	}
	exports.InterfaceManager = InterfaceManager;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const ProfileUtilities = __webpack_require__(19);
	const BaseHauler = __webpack_require__(39);
	const BaseCourier = __webpack_require__(40);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const role_1 = __webpack_require__(16);
	const roomlevel_1 = __webpack_require__(11);
	const priority_1 = __webpack_require__(17);
	class LogisticsManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("LogisticsManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            this.creepService.runCreeps(role_1.Role.BaseHauler, BaseHauler.run);
	            this.creepService.runCreeps(role_1.Role.BaseCourier, BaseCourier.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 10 < Game.time) {
	                let rooms = this.roomService.getNormalAndNotExpansion();
	                this.orderTransportUnits(rooms);
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	    }
	    orderTransportUnits(rooms) {
	        for (let room of rooms) {
	            if (this.shouldOrderBaseCourier(room)) {
	                this.orderBaseCourier(room);
	            }
	            if (this.shouldOrderBaseHaulers(room)) {
	                this.orderBaseHauler(room);
	            }
	        }
	    }
	    shouldOrderBaseCourier(room) {
	        if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.AdvancedColony) {
	            return false;
	        }
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseCourier, room.name);
	        let active = this.creepService.getCreeps(role_1.Role.BaseCourier, room.name);
	        if (ordered + active.length > 0) {
	            if (ordered === 0 && active.length === 1 && active[0].ticksToLive < 100) {
	                return true;
	            }
	            return false;
	        }
	        return true;
	    }
	    shouldOrderBaseHaulers(room) {
	        if (room.isExpansion() || RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.DefendedColony) {
	            return false;
	        }
	        if (room.storage === undefined || !room.storage.isActive()) {
	            let baseContainer = room.getBaseContainer();
	            if (baseContainer === undefined) {
	                return false;
	            }
	        }
	        let orderedbaseHaulers = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseHauler, room.name);
	        let activeBaseHaulers = this.creepService.getCreeps(role_1.Role.BaseHauler, room.name);
	        if (room.isUnderSiege() && (orderedbaseHaulers + activeBaseHaulers.length) < 2 && room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
	            return true;
	        }
	        if (orderedbaseHaulers > 0) {
	            if (activeBaseHaulers.length === 0 && orderedbaseHaulers < 2 && OrdersRepository.orderedBaseHaulerIsTooExpensive(room)) {
	                return true;
	            }
	            return false;
	        }
	        if (RoomRepository.getRoomLevel(room) === roomlevel_1.RoomLevel.CivilizedColony && room.storage !== undefined &&
	            room.storage.store[RESOURCE_ENERGY] > 200000 && activeBaseHaulers.length < 2) {
	            return true;
	        }
	        if (activeBaseHaulers.length > 0) {
	            if (activeBaseHaulers[0].ticksToLive < 200 && activeBaseHaulers.length === 1) {
	                return true;
	            }
	            return false;
	        }
	        return true;
	    }
	    orderBaseHauler(room) {
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let usedTier = maxTier;
	        let count = this.creepService.getCreeps(role_1.Role.BaseHauler, room.name).length;
	        if (count === 0) {
	            usedTier = ProfileUtilities.getMaxTierHauler(room.energyAvailable);
	            if (usedTier < 1) {
	                usedTier = 1;
	            }
	        }
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getHaulerBody(usedTier);
	        if (count > 0 && room.isUnderSiege()) {
	            order.priority = priority_1.Priority.Important;
	        }
	        else if (room.storage === undefined) {
	            order.priority = priority_1.Priority.Low;
	        }
	        else {
	            order.priority = priority_1.Priority.Blocker;
	        }
	        order.memory = { role: role_1.Role.BaseHauler, target: room.name, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderBaseCourier(room) {
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let usedTier = Math.ceil(maxTier / 2);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getHaulerBody(usedTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.BaseCourier, target: room.name, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.LogisticsManager = LogisticsManager;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const roomlevel_1 = __webpack_require__(11);
	const RoomRepository = __webpack_require__(10);
	function run(creep) {
	    if (creep.memory.sleepUntil !== undefined && creep.memory.sleepUntil > Game.time) {
	        return;
	    }
	    let tankingBuilding = Game.getObjectById(creep.memory.tankingBuilding);
	    let dropofBuilding = Game.getObjectById(creep.memory.dropofBuilding);
	    creep.room.memory.basehauler = creep.id;
	    if (tankingBuilding === null || (tankingBuilding instanceof StructureStorage && tankingBuilding.store[RESOURCE_ENERGY] === 0) ||
	        (tankingBuilding instanceof StructureContainer && tankingBuilding.store[RESOURCE_ENERGY] === 0)) {
	        if (creep.carry[RESOURCE_ENERGY] > 0) {
	            creep.stopTanking();
	            dropofBuilding = null;
	        }
	        else {
	            tankingBuilding = findTankingBuilding(creep);
	        }
	    }
	    if (creep.ticksToLive < 20 && creep.room.storage instanceof StructureStorage) {
	        creep.moveTo(creep.room.storage);
	        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	        if (creep.carry[RESOURCE_ENERGY] === 0) {
	            creep.suicide();
	        }
	        return;
	    }
	    if (!creep.isTanking() && creep.carry.energy < 50) {
	        creep.startTanking();
	        tankingBuilding = findTankingBuilding(creep);
	    }
	    if (creep.isFinishedTanking()) {
	        creep.stopTanking();
	        dropofBuilding = null;
	    }
	    if (dropofBuilding === null ||
	        (dropofBuilding instanceof StructureContainer && dropofBuilding.store[RESOURCE_ENERGY] === dropofBuilding.storeCapacity) ||
	        (!(dropofBuilding instanceof StructureContainer) && dropofBuilding.energy === dropofBuilding.energyCapacity)) {
	        findDropofBuilding(creep);
	        dropofBuilding = Game.getObjectById(creep.memory.dropofBuilding);
	    }
	    if (dropofBuilding === null && !creep.isTanking()) {
	        if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity) {
	            creep.startTanking();
	            tankingBuilding = findTankingBuilding(creep);
	        }
	        else {
	            parkMe(creep);
	            return;
	        }
	    }
	    if (tankingBuilding === null) {
	        return;
	    }
	    if (creep.isTanking()) {
	        let response = creep.withdraw(tankingBuilding, RESOURCE_ENERGY);
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(tankingBuilding);
	        }
	        if (response === ERR_NOT_ENOUGH_RESOURCES) {
	            creep.memory.tankingBuilding = undefined;
	        }
	        else {
	            for (let resourceType in creep.carry) {
	                if (resourceType !== RESOURCE_ENERGY) {
	                    creep.transfer(tankingBuilding, resourceType);
	                }
	            }
	        }
	    }
	    else if (dropofBuilding !== null) {
	        let response = creep.transfer(dropofBuilding, RESOURCE_ENERGY);
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(dropofBuilding);
	            transferEnergyToNearbyExtensions(creep);
	        }
	        else if (response === OK) {
	            if (dropofBuilding.structureType === STRUCTURE_TOWER) {
	                creep.memory.dropofBuilding = undefined;
	            }
	            if (creep.carry[RESOURCE_ENERGY] - 50 < dropofBuilding.energyCapacity - dropofBuilding.energy) {
	                creep.startTanking();
	                creep.moveTo(tankingBuilding);
	                return;
	            }
	            findDropofBuilding(creep, dropofBuilding.id);
	            dropofBuilding = Game.getObjectById(creep.memory.dropofBuilding);
	            if (dropofBuilding !== null) {
	                creep.moveTo(dropofBuilding);
	            }
	        }
	    }
	}
	exports.run = run;
	function parkMe(creep) {
	    if (creep.memory.parkingPos !== undefined && creep.memory.parkingPos.x !== undefined &&
	        creep.memory.parkingPos.y !== undefined && creep.memory.parkingPos.roomName !== undefined) {
	        let pos = new RoomPosition(creep.memory.parkingPos.x, creep.memory.parkingPos.y, creep.memory.parkingPos.roomName);
	        if (creep.pos.x === pos.x && creep.pos.y === pos.y) {
	            creep.memory.sleepUntil = Game.time + 5;
	            return;
	        }
	        creep.moveTo(pos);
	        return;
	    }
	    let parkingPos;
	    let basePos = RoomRepository.getBasePosition(creep.room);
	    if (basePos !== undefined) {
	        parkingPos = new RoomPosition(basePos.x, basePos.y - 1, basePos.roomName);
	    }
	    else {
	        parkingPos = creep.pos;
	    }
	    creep.memory.parkingPos = parkingPos;
	    creep.moveTo(parkingPos);
	}
	function transferEnergyToNearbyExtensions(creep) {
	    for (let x of [-1, 0, 1]) {
	        for (let y of [-1, 0, 1]) {
	            if ((x !== 0 || y !== 0) && creep.pos.x + x > 0 && creep.pos.x + x < 49 && creep.pos.y + y > 0 && creep.pos.y + y < 49) {
	                let pos = new RoomPosition(creep.pos.x + x, creep.pos.y + y, creep.pos.roomName);
	                let atPos = pos.lookFor(LOOK_STRUCTURES);
	                for (let s of atPos) {
	                    if ((s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) &&
	                        s.energy < s.energyCapacity) {
	                        creep.transfer(s, RESOURCE_ENERGY);
	                        return;
	                    }
	                }
	            }
	        }
	    }
	}
	function findTankingBuilding(creep) {
	    if (creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] < 100000 &&
	        creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 60000) {
	        creep.memory.tankingBuilding = creep.room.terminal.id;
	        return creep.room.terminal;
	    }
	    else if (creep.room.storage !== undefined &&
	        creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 150000) {
	        creep.memory.tankingBuilding = creep.room.terminal.id;
	        return creep.room.terminal;
	    }
	    else if (creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] < 8000 &&
	        creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 10000) {
	        creep.memory.tankingBuilding = creep.room.terminal.id;
	        return creep.room.terminal;
	    }
	    else if (creep.room.storage === undefined || creep.room.storage.store[RESOURCE_ENERGY] === 0) {
	        let b = creep.room.getBaseContainer();
	        if (b !== undefined && b.store[RESOURCE_ENERGY] > 0) {
	            creep.memory.tankingBuilding = b.id;
	            return b;
	        }
	        if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
	            creep.memory.tankingBuilding = creep.room.terminal.id;
	            return creep.room.terminal;
	        }
	        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= (creep.carryCapacity / 3) });
	        if (container !== null && container !== undefined) {
	            creep.memory.tankingBuilding = container.id;
	            return container;
	        }
	        if (creep.room.storage === undefined) {
	            creep.memory.tankingBuilding = undefined;
	            return null;
	        }
	    }
	    creep.memory.tankingBuilding = creep.room.storage.id;
	    return creep.room.storage;
	}
	function findDropofBuilding(creep, exceptId = null) {
	    let towers = creep.room.find(FIND_MY_STRUCTURES, {
	        filter: (structure) => (structure instanceof StructureTower) && structure.energy < structure.energyCapacity - 400 && structure.id !== exceptId });
	    if (towers.length > 0) {
	        creep.memory.dropofBuilding = towers[0].id;
	        return;
	    }
	    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
	        let close = lookForCloseStructureNeedingEnergy(creep, 1, exceptId);
	        if (close !== undefined) {
	            creep.memory.dropofBuilding = close.id;
	            return;
	        }
	        let closish = lookForCloseStructureNeedingEnergy(creep, 2, exceptId);
	        if (closish !== undefined) {
	            creep.memory.dropofBuilding = closish.id;
	            return;
	        }
	    }
	    let energyLimitForPowerProcessing = 450000;
	    if (Memory.settings.powerfocus === true) {
	        energyLimitForPowerProcessing = 200000;
	    }
	    let powerspawn = creep.room.getPowerSpawn();
	    if (powerspawn !== undefined && powerspawn.energy < 1000 &&
	        creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] > energyLimitForPowerProcessing) {
	        creep.memory.dropofBuilding = powerspawn.id;
	        return;
	    }
	    let closestBuildingInNeed = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
	        filter: function (structure) {
	            return structure.id !== exceptId && ((structure instanceof StructureTower && structure.energy < structure.energyCapacity - 200) ||
	                structure instanceof StructureLab) && structure.energy < structure.energyCapacity;
	        },
	    });
	    if (closestBuildingInNeed !== null) {
	        creep.memory.dropofBuilding = closestBuildingInNeed.id;
	        return;
	    }
	    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
	        let closestBuildingInNeed = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
	            filter: function (structure) {
	                return structure.id !== exceptId && (structure instanceof StructureSpawn ||
	                    structure instanceof StructureExtension) && structure.energy < structure.energyCapacity;
	            },
	        });
	        if (closestBuildingInNeed !== null) {
	            creep.memory.dropofBuilding = closestBuildingInNeed.id;
	            return;
	        }
	    }
	    let terminal = creep.room.terminal;
	    if (terminal !== undefined && terminal.store[RESOURCE_ENERGY] < 50000 &&
	        creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] > 50000) {
	        creep.memory.dropofBuilding = terminal.id;
	        return;
	    }
	    if (terminal !== undefined && terminal.store[RESOURCE_ENERGY] < 100000 && RoomRepository.getRoomLevel(creep.room) >= roomlevel_1.RoomLevel.Town &&
	        creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] > 200000) {
	        creep.memory.dropofBuilding = terminal.id;
	        return;
	    }
	    let nuker = creep.room.getNuker();
	    if (nuker !== undefined && nuker.energy < nuker.energyCapacity &&
	        creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] > 150000) {
	        creep.memory.dropofBuilding = nuker.id;
	        return;
	    }
	    if (powerspawn !== undefined && powerspawn.energy < powerspawn.energyCapacity - 1000 &&
	        creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] > energyLimitForPowerProcessing) {
	        creep.memory.dropofBuilding = powerspawn.id;
	        return;
	    }
	    if (creep.room.storage !== undefined && creep.room.terminal !== undefined &&
	        creep.room.storage.store[RESOURCE_ENERGY] < 5000 && creep.room.terminal.store[RESOURCE_ENERGY] > 20000) {
	        creep.memory.dropofBuilding = creep.room.storage.id;
	        return;
	    }
	    if (creep.room.storage !== undefined && creep.room.terminal !== undefined &&
	        creep.room.terminal.store[RESOURCE_ENERGY] > 150000) {
	        creep.memory.dropofBuilding = creep.room.storage.id;
	        return;
	    }
	    towers = creep.room.find(FIND_MY_STRUCTURES, {
	        filter: (structure) => (structure instanceof StructureTower) && structure.energy < structure.energyCapacity && structure.id !== exceptId });
	    if (towers.length > 0) {
	        creep.memory.dropofBuilding = towers[0].id;
	        return;
	    }
	    if (RoomRepository.getRoomLevel(creep.room) < roomlevel_1.RoomLevel.AdvancedColony && creep.room.storage !== undefined) {
	        let controllerContainer = creep.room.controller.getContainer();
	        if (controllerContainer !== undefined && controllerContainer.store[RESOURCE_ENERGY] < 1000) {
	            creep.memory.dropofBuilding = controllerContainer.id;
	            return;
	        }
	    }
	    creep.memory.dropofBuilding = undefined;
	}
	function lookForCloseStructureNeedingEnergy(creep, range, exceptId) {
	    for (let x of _.range(-range, range + 1)) {
	        for (let y of _.range(-range, range + 1)) {
	            if (Math.abs(x) === range || Math.abs(y) === range) {
	                if (creep.pos.x + x > 0 && creep.pos.x + x < 49 && creep.pos.y + y > 0 && creep.pos.y + y < 49) {
	                    let atPos = (new RoomPosition(creep.pos.x + x, creep.pos.y + y, creep.pos.roomName)).lookFor(LOOK_STRUCTURES);
	                    for (let s of atPos) {
	                        if ((s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN ||
	                            s.structureType === STRUCTURE_LAB)) {
	                            let t = s;
	                            if (t.energy < t.energyCapacity && t.id !== exceptId) {
	                                return t;
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const roomlevel_1 = __webpack_require__(11);
	const labstatus_1 = __webpack_require__(41);
	const RoomRepository = __webpack_require__(10);
	var CourierTask;
	(function (CourierTask) {
	    CourierTask[CourierTask["PowerDelivery"] = 2] = "PowerDelivery";
	    CourierTask[CourierTask["BaselinkLoading"] = 3] = "BaselinkLoading";
	    CourierTask[CourierTask["PowerToTerminal"] = 5] = "PowerToTerminal";
	    CourierTask[CourierTask["SupplyLabs"] = 6] = "SupplyLabs";
	    CourierTask[CourierTask["EmptyingLabs"] = 7] = "EmptyingLabs";
	    CourierTask[CourierTask["MoveStorageMinerals"] = 8] = "MoveStorageMinerals";
	    CourierTask[CourierTask["SupplyNuker"] = 9] = "SupplyNuker";
	    CourierTask[CourierTask["EmptyingAllLabs"] = 10] = "EmptyingAllLabs";
	    CourierTask[CourierTask["PowerFromTerminal"] = 11] = "PowerFromTerminal";
	})(CourierTask || (CourierTask = {}));
	class SupplyJob {
	}
	function run(creep) {
	    if (creep.memory.sleepUntil !== undefined && creep.memory.sleepUntil > Game.time) {
	        return;
	    }
	    creep.room.memory.basecourier = creep.id;
	    if (creep.ticksToLive < 20 && creep.room.storage instanceof StructureStorage) {
	        creep.moveTo(creep.room.storage);
	        for (let resource in creep.carry) {
	            creep.transfer(creep.room.storage, resource);
	        }
	        if (_.sum(creep.carry) === 0) {
	            creep.suicide();
	        }
	        return;
	    }
	    if (creep.memory.task === undefined) {
	        getTask(creep);
	    }
	    if (creep.memory.task === undefined) {
	        creep.memory.sleepUntil = Game.time + 10;
	    }
	    switch (creep.memory.task) {
	        case CourierTask.PowerDelivery:
	            deliverPower(creep);
	            break;
	        case CourierTask.SupplyNuker:
	            deliverGhodium(creep);
	            break;
	        case CourierTask.BaselinkLoading:
	            loadBaseLink(creep);
	            break;
	        case CourierTask.PowerToTerminal:
	            movePowerToTerminal(creep);
	            break;
	        case CourierTask.PowerFromTerminal:
	            movePowerFromTerminal(creep);
	            break;
	        case CourierTask.MoveStorageMinerals:
	            moveMineralsFromStorageToTerminal(creep);
	            break;
	        case CourierTask.SupplyLabs:
	            moveMineralsToLab(creep);
	            break;
	        case CourierTask.EmptyingLabs:
	            moveMineralsFromLab(creep);
	            break;
	        case CourierTask.EmptyingAllLabs:
	            moveMineralsFromAllLab(creep);
	            break;
	        default:
	            parkMe(creep);
	            break;
	    }
	}
	exports.run = run;
	function getTask(creep) {
	    if (RoomRepository.getRoomLevel(creep.room) >= roomlevel_1.RoomLevel.Town && creep.room.storage !== undefined && creep.room.terminal !== undefined) {
	        for (let stored of Object.keys(creep.room.storage.store)) {
	            if (stored !== RESOURCE_POWER && stored !== RESOURCE_ENERGY &&
	                (creep.room.terminal.store[stored] === undefined || creep.room.terminal.store[stored] < 12000)) {
	                creep.memory.moveMineral = stored;
	                creep.memory.task = CourierTask.MoveStorageMinerals;
	                return;
	            }
	        }
	    }
	    if (creep.ticksToLive > 100) {
	        if (creep.room.memory.lab !== undefined && creep.room.memory.lab.supplyJobs !== undefined && creep.room.memory.lab.supplyJobs.length === 2) {
	            creep.memory.task = CourierTask.SupplyLabs;
	            return;
	        }
	        if (creep.room.memory.lab !== undefined && creep.room.memory.lab.labstatus === labstatus_1.Labstatus.EmptyingLabs) {
	            creep.memory.task = CourierTask.EmptyingLabs;
	            return;
	        }
	        if (creep.room.memory.lab !== undefined && creep.room.memory.lab.labstatus === labstatus_1.Labstatus.EmptyingAllLabs) {
	            creep.memory.task = CourierTask.EmptyingAllLabs;
	            return;
	        }
	    }
	    let powerspawn = creep.room.getPowerSpawn();
	    if (creep.carry[RESOURCE_ENERGY] === 0 && powerspawn !== undefined && powerspawn.power < 20 &&
	        ((creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_POWER] > 0) ||
	            (creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_POWER] > 0))) {
	        creep.memory.task = CourierTask.PowerDelivery;
	        return;
	    }
	    let nuker = creep.room.getNuker();
	    if (creep.carry[RESOURCE_ENERGY] === 0 && nuker !== undefined && nuker.ghodium < nuker.ghodiumCapacity &&
	        (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_GHODIUM] > 3000)) {
	        creep.memory.task = CourierTask.SupplyNuker;
	        return;
	    }
	    if (RoomRepository.getRoomLevel(creep.room) >= roomlevel_1.RoomLevel.AdvancedColony) {
	        let baselink = creep.room.getBaseLink();
	        if (baselink !== undefined && baselink.energy < 400) {
	            creep.memory.task = CourierTask.BaselinkLoading;
	            return;
	        }
	    }
	    if (RoomRepository.getRoomLevel(creep.room) >= roomlevel_1.RoomLevel.Metropolis && creep.room.storage !== undefined && creep.room.terminal !== undefined) {
	        if (creep.room.storage.store[RESOURCE_POWER] > 12000 && (creep.room.terminal.store[RESOURCE_POWER] < 12000 || creep.room.terminal.store[RESOURCE_POWER] === undefined)) {
	            creep.memory.task = CourierTask.PowerToTerminal;
	            return;
	        }
	    }
	    if (creep.room.storage !== undefined && creep.room.terminal !== undefined) {
	        if (creep.room.terminal.store[RESOURCE_POWER] > 20000) {
	            creep.memory.task = CourierTask.PowerFromTerminal;
	            return;
	        }
	    }
	}
	function parkMe(creep) {
	    if (creep.memory.parkingPos !== undefined && creep.memory.parkingPos.x !== undefined &&
	        creep.memory.parkingPos.y !== undefined && creep.memory.parkingPos.roomName !== undefined) {
	        let pos = new RoomPosition(creep.memory.parkingPos.x, creep.memory.parkingPos.y, creep.memory.parkingPos.roomName);
	        if (creep.pos.x === pos.x && creep.pos.y === pos.y) {
	            return;
	        }
	        creep.moveTo(pos);
	        return;
	    }
	    let parkingPos;
	    let basePos = RoomRepository.getBasePosition(creep.room);
	    if (basePos !== undefined) {
	        parkingPos = new RoomPosition(basePos.x, basePos.y + 4, basePos.roomName);
	    }
	    else {
	        parkingPos = creep.pos;
	    }
	    creep.memory.parkingPos = parkingPos;
	    creep.moveTo(parkingPos);
	}
	function moveMineralsFromStorageToTerminal(creep) {
	    if (creep.memory.moveMineral === undefined || creep.room.terminal === undefined || creep.room.storage === undefined) {
	        creep.memory.moveMineral = undefined;
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.carry[creep.memory.moveMineral] === undefined &&
	        (creep.room.storage.store[creep.memory.moveMineral] === undefined || creep.room.terminal.store[creep.memory.moveMineral] > 12000)) {
	        creep.memory.moveMineral = undefined;
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.carry[creep.memory.moveMineral] === undefined) {
	        if (creep.withdraw(creep.room.storage, creep.memory.moveMineral) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	    }
	    else {
	        if (creep.transfer(creep.room.terminal, creep.memory.moveMineral) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.terminal);
	        }
	    }
	}
	function moveMineralsFromLab(creep) {
	    if (creep.room.memory.lab === undefined || creep.room.terminal === undefined) {
	        creep.memory.task = undefined;
	        return;
	    }
	    let terminal = creep.room.terminal;
	    if (creep.carryCapacity === _.sum(creep.carry)) {
	        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(terminal);
	        }
	        else {
	            for (let res of Object.keys(creep.carry)) {
	                creep.transfer(terminal, res);
	            }
	        }
	    }
	    else {
	        let labs = _.filter(creep.room.getProcessingLabs(), function (l) {
	            return l.mineralAmount > 0;
	        });
	        if (labs.length === 0) {
	            if (_.sum(creep.carry) > 0) {
	                if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	                    creep.moveTo(terminal);
	                }
	                else {
	                    for (let res of Object.keys(creep.carry)) {
	                        creep.transfer(terminal, res);
	                    }
	                }
	            }
	            else {
	                creep.memory.task = undefined;
	            }
	        }
	        else {
	            let closest = creep.pos.findClosestByPath(labs);
	            if (!_.isNull(closest) && creep.withdraw(closest, closest.mineralType) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(closest);
	            }
	        }
	    }
	}
	function moveMineralsFromAllLab(creep) {
	    if (creep.room.memory.lab === undefined || creep.room.terminal === undefined) {
	        creep.memory.task = undefined;
	        return;
	    }
	    let terminal = creep.room.terminal;
	    if (creep.carryCapacity === _.sum(creep.carry)) {
	        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(terminal);
	        }
	        else {
	            for (let res of Object.keys(creep.carry)) {
	                creep.transfer(terminal, res);
	            }
	        }
	    }
	    else {
	        let labs = _.filter(creep.room.getProcessingLabs().concat(creep.room.getSupplyingLabs()), function (l) {
	            return l.mineralAmount > 0;
	        });
	        if (labs.length === 0) {
	            if (_.sum(creep.carry) > 0) {
	                if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	                    creep.moveTo(terminal);
	                }
	                else {
	                    for (let res of Object.keys(creep.carry)) {
	                        creep.transfer(terminal, res);
	                    }
	                }
	            }
	            else {
	                creep.memory.task = undefined;
	            }
	        }
	        else {
	            let closest = creep.pos.findClosestByPath(labs);
	            if (!_.isNull(closest) && creep.withdraw(closest, closest.mineralType) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(closest);
	            }
	        }
	    }
	}
	function moveMineralsToLab(creep) {
	    if (creep.room.memory.lab === undefined || creep.room.memory.lab.supplyJobs === undefined || creep.room.memory.lab.supplyJobs.length !== 2 || creep.room.terminal === undefined) {
	        creep.memory.task = undefined;
	        return;
	    }
	    let job1 = creep.room.memory.lab.supplyJobs[0];
	    let lab1 = Game.getObjectById(job1.lab);
	    if (lab1.mineralAmount < job1.amount) {
	        moveMineralToLab(creep, job1.mineral, job1.amount, lab1);
	        return;
	    }
	    let job2 = creep.room.memory.lab.supplyJobs[1];
	    let lab2 = Game.getObjectById(job2.lab);
	    if (lab2.mineralAmount < job2.amount) {
	        moveMineralToLab(creep, job2.mineral, job2.amount, lab2);
	        return;
	    }
	}
	function moveMineralToLab(creep, mineral, amount, lab) {
	    if (creep.room.terminal === undefined) {
	        return;
	    }
	    let supplied = lab.mineralAmount;
	    let pickupStructure = creep.room.terminal;
	    if ((creep.carry[mineral] === undefined && _.sum(creep.carry) > 0) ||
	        (lab.mineralType !== mineral && lab.mineralAmount > 0)) {
	        if (_.sum(creep.carry) > 0) {
	            if (creep.pos.getRangeTo(creep.room.terminal) > 1) {
	                creep.moveTo(creep.room.terminal);
	            }
	            else {
	                for (let res of Object.keys(creep.carry)) {
	                    creep.transfer(creep.room.terminal, res);
	                }
	            }
	        }
	        else {
	            if (creep.pos.getRangeTo(lab) > 1) {
	                creep.moveTo(lab);
	            }
	            else {
	                creep.withdraw(lab, lab.mineralType);
	            }
	        }
	    }
	    else if (creep.carry[mineral] === undefined) {
	        let toPickUp = amount - supplied;
	        let response = creep.withdraw(pickupStructure, mineral, Math.min(toPickUp, creep.carryCapacity));
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(pickupStructure);
	        }
	        else if (response === ERR_NOT_ENOUGH_RESOURCES) {
	            creep.memory.task = undefined;
	        }
	    }
	    else {
	        let response = creep.transfer(lab, mineral);
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(lab);
	        }
	    }
	}
	function loadBaseLink(creep) {
	    if (creep.carry[RESOURCE_POWER] > 0 && creep.room.storage !== undefined) {
	        if (creep.transfer(creep.room.storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	        return;
	    }
	    let link = creep.room.getBaseLink();
	    if (creep.room.storage === undefined || link === undefined || (link.energy === link.energyCapacity && creep.carry[RESOURCE_ENERGY] === 0)) {
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	    }
	    else if (link.energy < link.energyCapacity) {
	        if (creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(link);
	        }
	    }
	    else {
	        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	    }
	}
	function movePowerToTerminal(creep) {
	    if (creep.carry[RESOURCE_POWER] === undefined && (creep.room.storage === undefined || creep.room.terminal === undefined || creep.room.storage.store[RESOURCE_POWER] < 12000 ||
	        creep.room.terminal.store[RESOURCE_POWER] > 12000)) {
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.room.storage === undefined || creep.room.terminal === undefined) {
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.carry[RESOURCE_POWER] === undefined) {
	        if (creep.withdraw(creep.room.storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	    }
	    else {
	        if (creep.transfer(creep.room.terminal, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.terminal);
	        }
	        else {
	            creep.memory.task = undefined;
	        }
	    }
	}
	function movePowerFromTerminal(creep) {
	    if (creep.carry[RESOURCE_POWER] === undefined && (creep.room.storage === undefined ||
	        creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_POWER] < 20000)) {
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.room.storage === undefined || creep.room.terminal === undefined) {
	        creep.memory.task = undefined;
	        return;
	    }
	    if (creep.carry[RESOURCE_POWER] === undefined) {
	        if (creep.withdraw(creep.room.terminal, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.terminal);
	        }
	    }
	    else {
	        if (creep.transfer(creep.room.storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.memory.task = undefined;
	        }
	    }
	}
	function deliverGhodium(creep) {
	    let nuker = creep.room.getNuker();
	    if (nuker === undefined || creep.room.terminal === undefined || (creep.carry[RESOURCE_GHODIUM] === undefined &&
	        (creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_GHODIUM] === undefined || creep.room.terminal.store[RESOURCE_GHODIUM] < 3000))) {
	        creep.memory.task === undefined;
	        return;
	    }
	    if (creep.carry[RESOURCE_GHODIUM] === undefined) {
	        let possibleAmount = creep.room.terminal.store[RESOURCE_GHODIUM];
	        if (possibleAmount === undefined) {
	            return;
	        }
	        let amount = nuker.ghodiumCapacity - nuker.ghodium;
	        if (creep.withdraw(creep.room.terminal, RESOURCE_GHODIUM, Math.min(possibleAmount, amount, creep.carryCapacity)) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.terminal);
	        }
	    }
	    else {
	        let response = creep.transfer(nuker, RESOURCE_GHODIUM);
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(nuker);
	        }
	        else {
	            creep.memory.task = undefined;
	        }
	    }
	}
	function deliverPower(creep) {
	    let powerspawn = creep.room.getPowerSpawn();
	    if (creep.room.storage === undefined || powerspawn === undefined || (creep.carry[RESOURCE_POWER] === undefined && creep.room.storage.store[RESOURCE_POWER] === undefined &&
	        (creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_POWER] === undefined))) {
	        creep.memory.task === undefined;
	        return;
	    }
	    let pickupStructure = creep.room.storage;
	    if (creep.room.terminal !== undefined && creep.room.storage.store[RESOURCE_POWER] === undefined && creep.room.terminal.store[RESOURCE_POWER] > 0) {
	        pickupStructure = creep.room.terminal;
	    }
	    if (creep.carry[RESOURCE_POWER] === undefined) {
	        let possibleAmount = pickupStructure.store[RESOURCE_POWER];
	        if (possibleAmount === undefined) {
	            return;
	        }
	        let amount = powerspawn.powerCapacity - powerspawn.power;
	        if (creep.withdraw(pickupStructure, RESOURCE_POWER, Math.min(possibleAmount, amount)) === ERR_NOT_IN_RANGE) {
	            creep.moveTo(pickupStructure);
	        }
	    }
	    else {
	        let response = creep.transfer(powerspawn, RESOURCE_POWER);
	        if (response === ERR_NOT_IN_RANGE) {
	            creep.moveTo(powerspawn);
	        }
	        else {
	            creep.memory.task = undefined;
	        }
	    }
	}


/***/ }),
/* 41 */
/***/ (function(module, exports) {

	"use strict";
	(function (Labstatus) {
	    Labstatus[Labstatus["Inactive"] = 0] = "Inactive";
	    Labstatus[Labstatus["GettingMineralsToTerminal"] = 1] = "GettingMineralsToTerminal";
	    Labstatus[Labstatus["MovingMineralsToLab"] = 2] = "MovingMineralsToLab";
	    Labstatus[Labstatus["RunningReactions"] = 3] = "RunningReactions";
	    Labstatus[Labstatus["EmptyingLabs"] = 4] = "EmptyingLabs";
	    Labstatus[Labstatus["EmptyingAllLabs"] = 5] = "EmptyingAllLabs";
	})(exports.Labstatus || (exports.Labstatus = {}));
	var Labstatus = exports.Labstatus;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const RoomClaimer = __webpack_require__(43);
	const ExpansionWorker = __webpack_require__(45);
	const ProfileUtilities = __webpack_require__(19);
	const RoomUtilities = __webpack_require__(36);
	const ScoutingUtilities = __webpack_require__(47);
	const ScoutingManager = __webpack_require__(48);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const RoomLib = __webpack_require__(30);
	const Order_1 = __webpack_require__(20);
	const IntelLib = __webpack_require__(5);
	const SpawnLib = __webpack_require__(12);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
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


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RouteTravel = __webpack_require__(44);
	function run(creep) {
	    let roomToClaim = creep.memory.target;
	    if (roomToClaim !== creep.room.name) {
	        RouteTravel.travelByRoute(creep, { avoidKeepers: true, preferHighway: true, allowSK: true, ignoreRoads: true, allowHostile: false }, true);
	    }
	    else {
	        let response = creep.claimController(creep.room.controller);
	        if (response !== OK) {
	            creep.travelTo(creep.room.controller, { maxRooms: 1 });
	        }
	        if (Game.rooms[roomToClaim] !== undefined && Game.rooms[roomToClaim].controller !== undefined && Game.rooms[roomToClaim].controller.my) {
	            creep.suicide();
	        }
	    }
	}
	exports.run = run;
	;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

	"use strict";
	function travelByRoute(creep, options, enemyCheck) {
	    let routeTarget = creep.memory.routeTarget;
	    if (routeTarget === undefined || routeTarget === creep.room.name) {
	        routeTarget = getNextTargetRoom(creep);
	        if (routeTarget === undefined) {
	            routeTarget = creep.memory.target;
	            if (routeTarget === undefined) {
	                return false;
	            }
	        }
	    }
	    if (creep.memory.routePortal !== undefined) {
	        let portal = Game.getObjectById(creep.memory.routePortal);
	        if (portal !== undefined && portal !== null && portal.pos !== undefined && portal.pos.roomName === creep.pos.roomName) {
	            if (options) {
	                options.range = 0;
	            }
	            else {
	                options = { range: 0 };
	            }
	            creep.travelTo(portal, options, enemyCheck);
	        }
	        else if (creep.memory.routeTarget !== undefined) {
	            if (Game.map.getRoomLinearDistance(creep.room.name, creep.memory.routeTarget, false) < 10) {
	                creep.travelToRoom(routeTarget, options, enemyCheck);
	            }
	        }
	        else {
	            creep.memory.routePortal = undefined;
	        }
	    }
	    else {
	        creep.travelToRoom(routeTarget, options, enemyCheck);
	    }
	    return true;
	}
	exports.travelByRoute = travelByRoute;
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.routeTarget = creep.memory.route.shift();
	        creep.memory.routePortal = undefined;
	    }
	    else {
	        creep.memory.routeTarget = undefined;
	    }
	    if (creep.memory.routeTarget !== undefined && creep.memory.routeTarget.charAt(0) === '$') {
	        creep.memory.routeTarget = creep.memory.routeTarget.slice(1);
	        creep.memory.routePortal = getPortalInRoom(creep);
	    }
	    return creep.memory.routeTarget;
	}
	function getPortalInRoom(creep) {
	    let portal = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
	    if (portal !== undefined) {
	        return portal.id;
	    }
	    return undefined;
	}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	const RoomRepository = __webpack_require__(10);
	const PositionLib = __webpack_require__(46);
	const RouteTravel = __webpack_require__(44);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MoveToExpansion"] = 1] = "MoveToExpansion";
	    State[State["MovingToSource"] = 2] = "MovingToSource";
	    State[State["Mining"] = 3] = "Mining";
	    State[State["Upgrading"] = 4] = "Upgrading";
	    State[State["Constructing"] = 5] = "Constructing";
	    State[State["FillingBase"] = 6] = "FillingBase";
	    State[State["TankUpInHomeroom"] = 7] = "TankUpInHomeroom";
	    State[State["DecideWhatToDoWithEnergy"] = 8] = "DecideWhatToDoWithEnergy";
	    State[State["DecideWhereToGetEnergy"] = 9] = "DecideWhereToGetEnergy";
	    State[State["ScavengeEnergy"] = 10] = "ScavengeEnergy";
	    State[State["GetEnergyFromStructure"] = 11] = "GetEnergyFromStructure";
	    State[State["Renewing"] = 12] = "Renewing";
	    State[State["RemoveHostileConstructionSites"] = 13] = "RemoveHostileConstructionSites";
	    State[State["Repairing"] = 14] = "Repairing";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.TankUpInHomeroom);
	    }
	    switch (creep.getState()) {
	        case State.MoveToExpansion:
	            runMoveToExpansion(creep);
	            break;
	        case State.RemoveHostileConstructionSites:
	            runRemoveHostileConstructionSites(creep);
	            break;
	        case State.MovingToSource:
	            runMovingToSource(creep);
	            break;
	        case State.Mining:
	            runMining(creep);
	            break;
	        case State.Upgrading:
	            runUpgrading(creep);
	            break;
	        case State.Constructing:
	            runConstructing(creep);
	            break;
	        case State.Repairing:
	            runRepairing(creep);
	            break;
	        case State.FillingBase:
	            runFillingBase(creep);
	            break;
	        case State.TankUpInHomeroom:
	            runTankUpInHomeroom(creep);
	            break;
	        case State.ScavengeEnergy:
	            runScavengeEnergy(creep);
	            break;
	        case State.GetEnergyFromStructure:
	            runGetEnergyFromStructure(creep);
	            break;
	        case State.DecideWhatToDoWithEnergy:
	            runDecideWhatToDoWithEnergy(creep);
	            break;
	        case State.DecideWhereToGetEnergy:
	            runDecideWhereToGetEnergy(creep);
	            break;
	        case State.Renewing:
	            runRenewing(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.TankUpInHomeroom);
	            break;
	    }
	}
	exports.run = run;
	;
	function runRenewing(creep) {
	    let spawn = creep.room.getSpawn();
	    if (creep.ticksToLive > 1400 || spawn === undefined || spawn.spawning ||
	        (creep.room.energyAvailable < 50 && creep.carry.energy === 0)) {
	        creep.room.memory.renewing = undefined;
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        return;
	    }
	    let distanceToSpawn = creep.pos.getRangeTo(spawn.pos);
	    if (distanceToSpawn > 1) {
	        creep.moveTo(spawn);
	    }
	    else {
	        if (creep.carry.energy > 0 && spawn.energy < spawn.energyCapacity / 2) {
	            creep.transfer(spawn, RESOURCE_ENERGY);
	        }
	        spawn.renewCreep(creep);
	    }
	}
	function runScavengeEnergy(creep) {
	    if (creep.carry.energy === creep.carryCapacity) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    let resource = Game.getObjectById(creep.memory.pickupid);
	    if (resource instanceof Resource && resource.amount > creep.carryCapacity / 10) {
	        let distanceToResource = creep.pos.getRangeTo(resource.pos);
	        if (distanceToResource > 1) {
	            creep.moveTo(resource);
	        }
	        else {
	            creep.pickup(resource);
	        }
	    }
	    else {
	        if (creep.carry.energy > 0) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	        }
	        else {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	        }
	    }
	}
	function runGetEnergyFromStructure(creep) {
	    if (creep.carry.energy === creep.carryCapacity) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    let structure = Game.getObjectById(creep.memory.pickupid);
	    if ((structure instanceof StructureTerminal || structure instanceof StructureStorage) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity) {
	        let distanceToStructure = creep.pos.getRangeTo(structure.pos);
	        if (distanceToStructure > 1) {
	            creep.moveTo(structure);
	        }
	        else {
	            creep.withdraw(structure, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        if (creep.carry.energy > 0) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	        }
	        else {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	        }
	    }
	}
	function runDecideWhereToGetEnergy(creep) {
	    if (creep.room.memory.renewing !== undefined) {
	        let renewingNow = Game.getObjectById(creep.room.memory.renewing);
	        if (renewingNow === null) {
	            creep.room.memory.renewing = undefined;
	        }
	    }
	    if (creep.ticksToLive < 800 && creep.room.energyAvailable > 200 &&
	        creep.room.memory.renewing === undefined && creep.room.storage === undefined) {
	        let spawn = creep.room.getSpawn();
	        if (spawn !== undefined && !spawn.spawning) {
	            creep.room.memory.renewing = creep.id;
	            creep.setState(State.Renewing);
	            runRenewing(creep);
	            return;
	        }
	    }
	    let structuresWithEnergy = creep.room.find(FIND_HOSTILE_STRUCTURES, {
	        filter: function (c) {
	            return (c.structureType === STRUCTURE_STORAGE || c.structureType === STRUCTURE_TERMINAL) &&
	                c.store[RESOURCE_ENERGY] > 1000;
	        } });
	    if (structuresWithEnergy.length > 0) {
	        creep.memory.pickupid = creep.pos.findClosestByRange(structuresWithEnergy).id;
	        creep.setState(State.GetEnergyFromStructure);
	        runGetEnergyFromStructure(creep);
	        return;
	    }
	    let pilesWithEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
	        filter: function (c) {
	            return c.resourceType === RESOURCE_ENERGY && c.amount > creep.carryCapacity / 3;
	        } });
	    if (pilesWithEnergy.length > 0) {
	        creep.memory.pickupid = creep.pos.findClosestByRange(pilesWithEnergy).id;
	        creep.setState(State.ScavengeEnergy);
	        runScavengeEnergy(creep);
	        return;
	    }
	    creep.setState(State.MovingToSource);
	    runMovingToSource(creep);
	}
	function runTankUpInHomeroom(creep) {
	    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
	        creep.room.storage !== undefined) {
	        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	        if (distanceToStorage > 1) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        creep.setState(State.MoveToExpansion);
	        runMoveToExpansion(creep);
	    }
	}
	function runMoveToExpansion(creep) {
	    let expansionRoom = creep.memory.target;
	    if (expansionRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
	        RouteTravel.travelByRoute(creep, { avoidKeepers: true, preferHighway: true, allowSK: true, ignoreRoads: true, allowHostile: false }, true);
	    }
	    else {
	        creep.setState(State.RemoveHostileConstructionSites);
	        runRemoveHostileConstructionSites(creep);
	    }
	}
	function runRemoveHostileConstructionSites(creep) {
	    let conSites = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType !== STRUCTURE_EXTRACTOR });
	    if (conSites !== null && conSites !== undefined) {
	        creep.travelTo(conSites, { range: 0 });
	    }
	    else {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	    }
	}
	function runDecideWhatToDoWithEnergy(creep) {
	    if (creep.memory.target !== creep.room.name) {
	        creep.setState(State.MoveToExpansion);
	        runMoveToExpansion(creep);
	        return;
	    }
	    if (creep.room.isExpansion() && creep.ticksToLive < 400 && creep.room.memory.renewing === undefined && creep.room.storage === undefined && creep.room.energyAvailable > 50) {
	        let spawn = creep.room.getSpawn();
	        if (spawn !== undefined && !spawn.spawning) {
	            creep.room.memory.renewing = creep.id;
	            creep.setState(State.Renewing);
	            runRenewing(creep);
	            return;
	        }
	    }
	    if (creep.carry.energy < 10) {
	        creep.setState(State.MovingToSource);
	        runMovingToSource(creep);
	        return;
	    }
	    let ramparts = creep.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART });
	    if (ramparts.length > 0) {
	        let lowestId = ramparts[0].id;
	        let lowestHits = ramparts[0].hits;
	        for (let r of ramparts) {
	            if (r.hits < lowestHits) {
	                lowestHits = r.hits;
	                lowestId = r.id;
	            }
	        }
	        if (lowestHits < 20000) {
	            creep.memory.rampartId = lowestId;
	            creep.setState(State.Repairing);
	            runRepairing(creep);
	            return;
	        }
	    }
	    if (creep.room.controller !== undefined && creep.room.controller.ticksToDowngrade < 2000) {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	        return;
	    }
	    let structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
	        filter: function (c) {
	            return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_STORAGE) &&
	                c.energy < c.energyCapacity - 30;
	        } });
	    if (structuresNeedingEnergy.length > 0) {
	        creep.memory.fillingid = creep.pos.findClosestByRange(structuresNeedingEnergy).id;
	        creep.setState(State.FillingBase);
	        runFillingBase(creep);
	        return;
	    }
	    let expansion = Game.rooms[creep.memory.target];
	    if (!(expansion instanceof Room)) {
	        Logger_1.log.error("Expansion " + creep.memory.target, creep.room.name);
	        creep.setState(State.MoveToExpansion);
	        runMoveToExpansion(creep);
	        return;
	    }
	    let importantConstructionSitesInRoom = expansion.find(FIND_MY_CONSTRUCTION_SITES, {
	        filter: (c) => c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_SPAWN });
	    if (importantConstructionSitesInRoom.length > 0) {
	        creep.memory.constructionid = creep.pos.findClosestByRange(importantConstructionSitesInRoom).id;
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    let constructionSitesInRoom = expansion.find(FIND_MY_CONSTRUCTION_SITES);
	    if (constructionSitesInRoom.length > 0) {
	        creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
	        creep.memory.fillingid = creep.room.storage.id;
	        creep.setState(State.FillingBase);
	        runFillingBase(creep);
	        return;
	    }
	    creep.setState(State.Upgrading);
	    runUpgrading(creep);
	}
	function runMovingToSource(creep) {
	    if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
	        setTargetSource(creep);
	        if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
	            Logger_1.log.error("Could not set source for ExpansionWorker", creep.room.name);
	            return;
	        }
	    }
	    let sourcePos = new RoomPosition(creep.memory.sourcePos.x, creep.memory.sourcePos.y, creep.memory.sourcePos.roomName);
	    if (sourcePos instanceof RoomPosition) {
	        if (creep.room.name !== sourcePos.roomName || creep.pos.getRangeTo(sourcePos) > 1) {
	            creep.travelTo({ pos: sourcePos }, { allowHostile: false });
	        }
	        else {
	            creep.setState(State.Mining);
	            runMining(creep);
	        }
	    }
	    else {
	        Logger_1.log.error("Invalid sourcePos for ExpansionWorker", creep.room.name);
	    }
	}
	function runMining(creep) {
	    let source = Game.getObjectById(creep.memory.sourceId);
	    if (source === null || source.room.name !== creep.room.name || creep.pos.getRangeTo(source.pos) > 1) {
	        creep.setState(State.MovingToSource);
	        runMovingToSource(creep);
	        return;
	    }
	    if (creep.carry.energy === creep.carryCapacity) {
	        if (creep.memory.target !== creep.room.name) {
	            let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	            if (constructionSitesInRoom.length > 0) {
	                creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
	                creep.setState(State.Constructing);
	                runConstructing(creep);
	                return;
	            }
	        }
	        creep.setState(State.MoveToExpansion);
	        runMoveToExpansion(creep);
	        return;
	    }
	    if (source.energy > 0) {
	        let responseHarvest = creep.harvest(source);
	        if (responseHarvest === OK) {
	            if (Memory.stats['room.' + creep.memory.target + '.energyHarvested'] === undefined) {
	                Memory.stats['room.' + creep.memory.target + '.energyHarvested'] = 0;
	            }
	            Memory.stats['room.' + creep.memory.target + '.energyHarvested'] += creep.getWorkerParts() * 2;
	        }
	    }
	}
	function runUpgrading(creep) {
	    if (creep.carry.energy === 0) {
	        creep.setState(State.DecideWhereToGetEnergy);
	        runDecideWhereToGetEnergy(creep);
	        return;
	    }
	    let controller = creep.room.controller;
	    if (controller instanceof StructureController) {
	        let range = creep.pos.getRangeTo(controller);
	        if (range > 3) {
	            creep.travelTo(controller);
	        }
	        else {
	            if (range === 3) {
	                creep.travelTo(controller);
	            }
	            let response = creep.upgradeController(controller);
	            if (response === OK) {
	                if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	                }
	                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	                }
	                else {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	                }
	            }
	        }
	    }
	    else {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	    }
	}
	function runRepairing(creep) {
	    if (creep.carry.energy === 0) {
	        if (creep.memory.target === creep.room.name) {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	            return;
	        }
	        else {
	            creep.setState(State.MoveToExpansion);
	            runMoveToExpansion(creep);
	            return;
	        }
	    }
	    if (creep.room.controller !== undefined && creep.room.controller.level < 2) {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	        return;
	    }
	    let rampart = Game.getObjectById(creep.memory.rampartId);
	    if (rampart === null || rampart.hits > 50000) {
	        if (creep.memory.target === creep.room.name) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	            return;
	        }
	        else {
	            creep.setState(State.MoveToExpansion);
	            runMoveToExpansion(creep);
	            return;
	        }
	    }
	    let result = creep.repair(rampart);
	    if (result === ERR_RCL_NOT_ENOUGH) {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	        return;
	    }
	    if (result === ERR_NOT_IN_RANGE) {
	        creep.travelTo(rampart);
	    }
	}
	function runConstructing(creep) {
	    if (creep.carry.energy === 0) {
	        if (creep.memory.target === creep.room.name) {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	            return;
	        }
	        else {
	            creep.setState(State.MoveToExpansion);
	            runMoveToExpansion(creep);
	            return;
	        }
	    }
	    let constructionSite = Game.getObjectById(creep.memory.constructionid);
	    if (constructionSite === null) {
	        if (creep.memory.target === creep.room.name) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	            return;
	        }
	        else {
	            creep.setState(State.MoveToExpansion);
	            runMoveToExpansion(creep);
	            return;
	        }
	    }
	    let result = creep.build(constructionSite);
	    if (result === ERR_RCL_NOT_ENOUGH) {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	        return;
	    }
	    if (result === ERR_NOT_IN_RANGE) {
	        creep.travelTo(constructionSite);
	    }
	}
	function runFillingBase(creep) {
	    if (creep.carry.energy === 0) {
	        creep.setState(State.DecideWhereToGetEnergy);
	        runDecideWhereToGetEnergy(creep);
	        return;
	    }
	    let fillingSite = Game.getObjectById(creep.memory.fillingid);
	    if (!(fillingSite instanceof StructureStorage) && (fillingSite === null || fillingSite.energy === fillingSite.energyCapacity)) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    if (creep.transfer(fillingSite, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	        creep.travelTo(fillingSite);
	    }
	}
	function getCountOfWorkersForSource(sourceid, homeroom) {
	    let count = 0;
	    for (let creepName in Game.creeps) {
	        let creep = Game.creeps[creepName];
	        if (creep.memory.sourceId === sourceid &&
	            creep.memory.role === role_1.Role.ExpansionWorker) {
	            count++;
	        }
	    }
	    for (let order of homeroom.memory.orders) {
	        if (order.memory.sourceId === sourceid &&
	            order.memory.role === role_1.Role.ExpansionWorker) {
	            count++;
	        }
	    }
	    return count;
	}
	function setTargetSource(creep) {
	    let targetRoom = Game.rooms[creep.memory.target];
	    let homeRoom = Game.rooms[creep.memory.homeroom];
	    if (!(targetRoom instanceof Room)) {
	        Logger_1.log.error("Could not access target room for ExpansionWorker", creep.room.name);
	        return;
	    }
	    if (!(homeRoom instanceof Room)) {
	        Logger_1.log.error("Could not access homeroom for ExpansionWorker", creep.room.name);
	        return;
	    }
	    let sources = targetRoom.getSources();
	    let outposts = RoomRepository.getBasicOutposts(targetRoom);
	    for (let i of _.range(0, 10)) {
	        for (let source of sources) {
	            if (getCountOfWorkersForSource(source.id, homeRoom) === i) {
	                creep.memory.sourceId = source.id;
	                creep.memory.sourcePos = source.pos;
	                return;
	            }
	        }
	        for (let outpost of outposts) {
	            if (IntelLib.hasIntel(outpost)) {
	                for (let sourceId of IntelLib.sourceIds(outpost)) {
	                    if (getCountOfWorkersForSource(sourceId, homeRoom) === i) {
	                        creep.memory.sourceId = sourceId;
	                        creep.memory.sourcePos = IntelLib.sourcePos(outpost, sourceId);
	                        return;
	                    }
	                }
	            }
	        }
	    }
	    if (sources.length > 0) {
	        let r = _.random(0, sources.length - 1);
	        creep.memory.sourceId = sources[r].id;
	        creep.memory.sourcePos = sources[r].pos;
	    }
	}


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	"use strict";
	function positionIsBorder(pos) {
	    return pos.x < 1 || pos.x > 48 || pos.y < 1 || pos.y > 48;
	}
	exports.positionIsBorder = positionIsBorder;
	function positionIsBorderOrNextToBorder(pos) {
	    return pos.x <= 1 || pos.x >= 48 || pos.y <= 1 || pos.y >= 48;
	}
	exports.positionIsBorderOrNextToBorder = positionIsBorderOrNextToBorder;
	function positionNextToBorder(pos) {
	    return pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
	}
	exports.positionNextToBorder = positionNextToBorder;
	function positionHasBuildableGround(pos) {
	    let posGround = Game.map.getTerrainAt(pos);
	    if (posGround === "plain" || posGround === "swamp") {
	        return true;
	    }
	    return false;
	}
	exports.positionHasBuildableGround = positionHasBuildableGround;
	function positionHasPortal(pos) {
	    let structures = pos.lookFor(LOOK_STRUCTURES);
	    if (structures.length > 0) {
	        for (let s of structures) {
	            if (s.structureType === STRUCTURE_PORTAL) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	exports.positionHasPortal = positionHasPortal;
	function positionAtDirection(origin, direction) {
	    let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
	    let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
	    let x = origin.x + offsetX[direction];
	    let y = origin.y + offsetY[direction];
	    if (x < 1 || x > 48 || y < 1 || y > 48) {
	        return undefined;
	    }
	    return new RoomPosition(x, y, origin.roomName);
	}
	exports.positionAtDirection = positionAtDirection;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomLib = __webpack_require__(30);
	function getCloseHighways(baseroom) {
	    let potentialHighways = getRoomsOneAway(baseroom).concat(getRoomsTwoAway(baseroom), getRoomsThreeAway(baseroom), getRoomsFourAway(baseroom), getRoomsSixAway(baseroom));
	    return _.filter(potentialHighways, function (r) { return RoomLib.roomIsHighway(r); });
	}
	exports.getCloseHighways = getCloseHighways;
	function getRoomsOneAway(baseroom) {
	    let roomsOneAway = [];
	    let exits = Game.map.describeExits(baseroom);
	    _.forEach(exits, function (room) {
	        if (room !== undefined) {
	            roomsOneAway.push(room);
	        }
	    });
	    return roomsOneAway;
	}
	exports.getRoomsOneAway = getRoomsOneAway;
	function getRoomsTwoAway(baseroom) {
	    let roomsTwoAway = [];
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsOneAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsTwoAway.push(room);
	            }
	        });
	    }
	    roomsTwoAway = _.uniq(roomsTwoAway);
	    _.pull(roomsTwoAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsTwoAway, oneAway);
	    }
	    return roomsTwoAway;
	}
	exports.getRoomsTwoAway = getRoomsTwoAway;
	function getRoomsThreeAway(baseroom) {
	    let roomsThreeAway = [];
	    let roomsTwoAway = getRoomsTwoAway(baseroom);
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsTwoAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsThreeAway.push(room);
	            }
	        });
	    }
	    roomsThreeAway = _.uniq(roomsThreeAway);
	    _.pull(roomsThreeAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsThreeAway, oneAway);
	    }
	    for (let twoAway of roomsTwoAway) {
	        _.pull(roomsThreeAway, twoAway);
	    }
	    return roomsThreeAway;
	}
	exports.getRoomsThreeAway = getRoomsThreeAway;
	function getRoomsFourAway(baseroom) {
	    let roomsFourAway = [];
	    let roomsThreeAway = getRoomsThreeAway(baseroom);
	    let roomsTwoAway = getRoomsTwoAway(baseroom);
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsThreeAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsFourAway.push(room);
	            }
	        });
	    }
	    roomsFourAway = _.uniq(roomsFourAway);
	    _.pull(roomsFourAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsFourAway, oneAway);
	    }
	    for (let twoAway of roomsTwoAway) {
	        _.pull(roomsFourAway, twoAway);
	    }
	    for (let threeAway of roomsThreeAway) {
	        _.pull(roomsFourAway, threeAway);
	    }
	    return roomsFourAway;
	}
	exports.getRoomsFourAway = getRoomsFourAway;
	function getRoomsFiveAway(baseroom) {
	    let roomsFiveAway = [];
	    let roomsFourAway = getRoomsFourAway(baseroom);
	    let roomsThreeAway = getRoomsThreeAway(baseroom);
	    let roomsTwoAway = getRoomsTwoAway(baseroom);
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsFourAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsFiveAway.push(room);
	            }
	        });
	    }
	    roomsFiveAway = _.uniq(roomsFiveAway);
	    _.pull(roomsFiveAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsFiveAway, oneAway);
	    }
	    for (let twoAway of roomsTwoAway) {
	        _.pull(roomsFiveAway, twoAway);
	    }
	    for (let threeAway of roomsThreeAway) {
	        _.pull(roomsFiveAway, threeAway);
	    }
	    for (let fourAway of roomsFourAway) {
	        _.pull(roomsFiveAway, fourAway);
	    }
	    return roomsFiveAway;
	}
	exports.getRoomsFiveAway = getRoomsFiveAway;
	function getRoomsSixAway(baseroom) {
	    let roomsSixAway = [];
	    let roomsFiveAway = getRoomsFiveAway(baseroom);
	    let roomsFourAway = getRoomsFourAway(baseroom);
	    let roomsThreeAway = getRoomsThreeAway(baseroom);
	    let roomsTwoAway = getRoomsTwoAway(baseroom);
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsFiveAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsSixAway.push(room);
	            }
	        });
	    }
	    roomsSixAway = _.uniq(roomsSixAway);
	    _.pull(roomsSixAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsSixAway, oneAway);
	    }
	    for (let twoAway of roomsTwoAway) {
	        _.pull(roomsSixAway, twoAway);
	    }
	    for (let threeAway of roomsThreeAway) {
	        _.pull(roomsSixAway, threeAway);
	    }
	    for (let fourAway of roomsFourAway) {
	        _.pull(roomsSixAway, fourAway);
	    }
	    for (let fiveAway of roomsFiveAway) {
	        _.pull(roomsSixAway, fiveAway);
	    }
	    return roomsSixAway;
	}
	exports.getRoomsSixAway = getRoomsSixAway;
	function getRoomsSevenAway(baseroom) {
	    let roomsSevenAway = [];
	    let roomsSixAway = getRoomsSixAway(baseroom);
	    let roomsFiveAway = getRoomsFiveAway(baseroom);
	    let roomsFourAway = getRoomsFourAway(baseroom);
	    let roomsThreeAway = getRoomsThreeAway(baseroom);
	    let roomsTwoAway = getRoomsTwoAway(baseroom);
	    let roomsOneAway = getRoomsOneAway(baseroom);
	    for (let neighbour of roomsSixAway) {
	        let neighbourExits = Game.map.describeExits(neighbour);
	        _.forEach(neighbourExits, function (room) {
	            if (room !== undefined) {
	                roomsSevenAway.push(room);
	            }
	        });
	    }
	    roomsSevenAway = _.uniq(roomsSevenAway);
	    _.pull(roomsSevenAway, baseroom);
	    for (let oneAway of roomsOneAway) {
	        _.pull(roomsSevenAway, oneAway);
	    }
	    for (let twoAway of roomsTwoAway) {
	        _.pull(roomsSevenAway, twoAway);
	    }
	    for (let threeAway of roomsThreeAway) {
	        _.pull(roomsSevenAway, threeAway);
	    }
	    for (let fourAway of roomsFourAway) {
	        _.pull(roomsSevenAway, fourAway);
	    }
	    for (let fiveAway of roomsFiveAway) {
	        _.pull(roomsSevenAway, fiveAway);
	    }
	    for (let sixAway of roomsSixAway) {
	        _.pull(roomsSevenAway, sixAway);
	    }
	    return roomsSevenAway;
	}
	exports.getRoomsSevenAway = getRoomsSevenAway;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PowerManager = __webpack_require__(49);
	const ProfileUtilities = __webpack_require__(19);
	const ScoutingUtilities = __webpack_require__(47);
	const ProximityScout = __webpack_require__(58);
	const IntelLib = __webpack_require__(5);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const _Manager_1 = __webpack_require__(14);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const Logger_1 = __webpack_require__(7);
	class ScoutingManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("ScoutingManager");
	        this.MEMORY_LASTRUN_SCOUT = "lastRunScout";
	        this.MEMORY_LASTRUN_NEIGHBOURS = "lastRunNeighbours";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            let rooms = this.roomService.getNormalRooms();
	            for (let room of rooms) {
	                if (RoomRepository.getRoomLevel(room) === roomlevel_1.RoomLevel.Metropolis) {
	                    if ((Game.time + RoomRepository.getIndex(room)) % 1000 === 5) {
	                        let observer = room.getObserver();
	                        if (observer !== undefined) {
	                            observeNextRoomForPortals(room, observer);
	                        }
	                    }
	                    if ((Game.time + RoomRepository.getIndex(room)) % 1000 === 6) {
	                        let observer = room.getObserver();
	                        if (observer !== undefined) {
	                            checkForPortals(room);
	                        }
	                    }
	                    if ((Game.time + RoomRepository.getIndex(room)) % 20 === 6) {
	                        let observer = room.getObserver();
	                        if (observer !== undefined) {
	                            observeNextRoomForPowerBanks(room, observer);
	                        }
	                    }
	                    if ((Game.time + RoomRepository.getIndex(room)) % 20 === 7) {
	                        let observer = room.getObserver();
	                        if (observer !== undefined) {
	                            if (room.memory.highwaysClose !== undefined && room.memory.observerCounter !== undefined) {
	                                let targetRoom = Game.rooms[room.memory.highwaysClose[room.memory.observerCounter]];
	                                if (targetRoom instanceof Room) {
	                                    checkForPowerBanks(room, targetRoom);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            this.creepService.runCreeps(role_1.Role.ProximityScout, ProximityScout.run);
	            let lastRunNeighbours = this.getValue(this.MEMORY_LASTRUN_NEIGHBOURS);
	            if (lastRunNeighbours === undefined || lastRunNeighbours + 5000 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    setNeighbours(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_NEIGHBOURS, Game.time);
	            }
	            let lastRunScouting = this.getValue(this.MEMORY_LASTRUN_SCOUT);
	            if (lastRunScouting === undefined || lastRunScouting + 500 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    if (room.memory.neighbours === undefined) {
	                        setNeighbours(room);
	                    }
	                    this.checkIfNeighboursNeedScouting(room);
	                    this.checkIfControlledRoomsNeedSigning(room);
	                    this.orderProximityScout(room);
	                    this.orderSigner(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_SCOUT, Game.time);
	            }
	        }
	    }
	    signerIsGoingThereNow(room, targetRoom) {
	        let scouts = this.creepService.getCreeps(role_1.Role.Signer, targetRoom, room.name);
	        if (scouts.length > 0) {
	            return true;
	        }
	        return false;
	    }
	    orderSigner(room) {
	        if (room.memory.signingqueue === undefined || room.memory.signingqueue.length === 0) {
	            return;
	        }
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.ProximityScout, null, room.name);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.ProximityScout);
	        let neededTiers = 1;
	        if (neededTiers > currentTiers + orderedTiers) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getScoutBody(1);
	            order.priority = priority_1.Priority.Critical;
	            order.memory = { role: role_1.Role.Signer, target: room.name, tier: 1 };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderProximityScout(room) {
	        if (room.memory.scoutqueue === undefined || room.memory.scoutqueue.length === 0) {
	            return;
	        }
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.ProximityScout, null, room.name);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.ProximityScout);
	        let neededTiers = 1;
	        if (neededTiers > currentTiers + orderedTiers) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getScoutBody(1);
	            order.priority = priority_1.Priority.Critical;
	            order.memory = { role: role_1.Role.ProximityScout, target: room.name, tier: 1 };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderSigning(room, roomName) {
	        if (room.memory.signingqueue === undefined) {
	            room.memory.signingqueue = [];
	        }
	        if (_.contains(room.memory.signingqueue, roomName)) {
	            return false;
	        }
	        if (this.signerIsGoingThereNow(room, roomName)) {
	            return false;
	            ;
	        }
	        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].isPraiseRoom) {
	            return false;
	            ;
	        }
	        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].inaccessible) {
	            return false;
	        }
	        room.memory.signingqueue.push(roomName);
	        Logger_1.log.info("Signing ordered: " + roomName, room.name);
	        return true;
	    }
	    checkIfNeighboursNeedScouting(room) {
	        if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) {
	            return;
	        }
	        if (Memory.settings.bot === true) {
	            if (room.memory.neighbours !== undefined) {
	                if (room.memory.neighbours.oneAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.oneAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.twoAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.twoAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.threeAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.threeAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.fourAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.fourAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.fiveAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.fiveAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.sixAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.sixAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.sevenAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.sevenAway) {
	                        if (IntelLib.needsNewIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	            }
	        }
	        else {
	            if (room.memory.neighbours !== undefined) {
	                if (room.memory.neighbours.oneAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.oneAway) {
	                        if (!IntelLib.hasIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	                if (room.memory.neighbours.twoAway !== undefined) {
	                    for (let neighbour of room.memory.neighbours.twoAway) {
	                        if (!IntelLib.hasIntel(neighbour)) {
	                            orderScouting(room, neighbour);
	                        }
	                    }
	                }
	            }
	        }
	    }
	    checkIfControlledRoomsNeedSigning(room) {
	        if (RoomRepository.getRoomLevel(room) < roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) {
	            return;
	        }
	        if (room instanceof Room && room.controller !== undefined) {
	            if (room.controller.sign === undefined || room.controller.sign.username !== Memory.settings.user || room.controller.sign.time < (Game.time - 500000)) {
	                this.orderSigning(room, room.name);
	            }
	        }
	        let outposts = RoomRepository.getBasicOutposts(room);
	        for (let outpostName of outposts) {
	            let outpost = Game.rooms[outpostName];
	            if (outpost instanceof Room && outpost.controller !== undefined) {
	                if (outpost.controller.sign === undefined || outpost.controller.sign.username !== Memory.settings.user || outpost.controller.sign.time < (Game.time - 500000)) {
	                    this.orderSigning(room, outpost.name);
	                }
	            }
	        }
	    }
	}
	exports.ScoutingManager = ScoutingManager;
	function checkForPowerBanks(room, targetRoom) {
	    let banks = targetRoom.find(FIND_STRUCTURES, { filter: function (s) {
	            return s.structureType === STRUCTURE_POWER_BANK;
	        } });
	    if (banks !== undefined && banks.length > 0) {
	        for (let bank of banks) {
	            PowerManager.registerPowerBank(room, bank);
	        }
	    }
	}
	function checkForPortals(room) {
	    if (Memory.portals === undefined) {
	        Memory.portals = {};
	    }
	    let closestPortalroom = RoomRepository.getClosestPortalroom(room.name);
	    if (Game.rooms[closestPortalroom] !== undefined) {
	        let portalRoom = Game.rooms[closestPortalroom];
	        let portals = portalRoom.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
	        if (portals.length > 0) {
	            if (Memory.portals[closestPortalroom] === undefined) {
	                Memory.portals[closestPortalroom] = { decay: portals[0].ticksToDecay, firstSeen: Game.time, dest: portals[0].destination.roomName };
	            }
	            else {
	                Memory.portals[closestPortalroom].decay = portals[0].ticksToDecay;
	            }
	        }
	        else {
	            delete Memory.portals[closestPortalroom];
	        }
	    }
	}
	function observeNextRoomForPowerBanks(room, observer) {
	    if (room.memory.highwaysClose === undefined) {
	        room.memory.highwaysClose = ScoutingUtilities.getCloseHighways(room.name);
	    }
	    if (room.memory.observerCounter === undefined) {
	        room.memory.observerCounter = 0;
	    }
	    else {
	        room.memory.observerCounter = (room.memory.observerCounter + 1) % room.memory.highwaysClose.length;
	        observer.observeRoom(room.memory.highwaysClose[room.memory.observerCounter]);
	    }
	}
	function observeNextRoomForPortals(room, observer) {
	    observer.observeRoom(RoomRepository.getClosestPortalroom(room.name));
	}
	function orderScouting(room, roomName) {
	    if (room.memory.scoutqueue === undefined) {
	        room.memory.scoutqueue = [];
	    }
	    if (_.contains(room.memory.scoutqueue, roomName)) {
	        return false;
	    }
	    if (Memory.empire.inaccessible !== undefined && _.contains(Memory.empire.inaccessible, roomName)) {
	        return false;
	    }
	    room.memory.scoutqueue.push(roomName);
	    return true;
	}
	exports.orderScouting = orderScouting;
	function getSigningTarget(roomName) {
	    let room = Game.rooms[roomName];
	    if (!(room instanceof Room)) {
	        return undefined;
	    }
	    if (room.memory.signingqueue === undefined) {
	        room.memory.signingqueue = [];
	        return undefined;
	    }
	    if (room.memory.signingqueue.length === 0) {
	        return undefined;
	    }
	    let signingTarget = room.memory.signingqueue.shift();
	    return signingTarget;
	}
	exports.getSigningTarget = getSigningTarget;
	function setNeighbours(room) {
	    room.memory.neighbours = {
	        oneAway: ScoutingUtilities.getRoomsOneAway(room.name),
	        twoAway: ScoutingUtilities.getRoomsTwoAway(room.name),
	        threeAway: ScoutingUtilities.getRoomsThreeAway(room.name),
	        fourAway: ScoutingUtilities.getRoomsFourAway(room.name),
	        fiveAway: ScoutingUtilities.getRoomsFiveAway(room.name),
	        sixAway: ScoutingUtilities.getRoomsSixAway(room.name),
	        sevenAway: ScoutingUtilities.getRoomsSevenAway(room.name)
	    };
	}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const ProfileUtilities = __webpack_require__(19);
	const BankAttacker = __webpack_require__(50);
	const BankHealer = __webpack_require__(52);
	const BankHauler = __webpack_require__(53);
	const BankRanger = __webpack_require__(54);
	const PowerConfig = __webpack_require__(57);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const _Manager_1 = __webpack_require__(14);
	const Logger_1 = __webpack_require__(7);
	class PowerManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("PowerManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.BankRanger, BankRanger.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.BankAttacker, BankAttacker.run);
	            this.creepService.runCreeps(role_1.Role.BankHealer, BankHealer.run);
	            this.creepService.runCreeps(role_1.Role.BankHauler, BankHauler.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 50 < Game.time) {
	                let rooms = this.roomService.getNormalAndNotExpansion();
	                for (let room of rooms) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && room.hasFreeSpawnCapacity() &&
	                        room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > PowerConfig.energyInStorageBeforeRobbing &&
	                        (room.storage.store[RESOURCE_POWER] < PowerConfig.powerInStorageBeforeStoppingRobbing || room.storage.store[RESOURCE_POWER] === undefined)) {
	                        let bank = getFreePowerbank(room);
	                        if (bank !== undefined) {
	                            orderPowerBankTeam(room, bank);
	                        }
	                    }
	                    this.processBankInformation(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let rooms = this.roomService.getNormalAndNotExpansion();
	            for (let room of rooms) {
	                if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis) {
	                    let powerspawn = room.getPowerSpawn();
	                    if (powerspawn !== undefined && powerspawn.power >= 1 && powerspawn.energy >= 50) {
	                        powerspawn.processPower();
	                    }
	                }
	            }
	        }
	    }
	    processBankInformation(room) {
	        if (room.memory.powerbanks === undefined) {
	            return;
	        }
	        for (let bankid of Object.keys(room.memory.powerbanks)) {
	            let bankinfo = room.memory.powerbanks[bankid];
	            let bank = Game.getObjectById(bankinfo.id);
	            if (bankinfo.attackersOrdered && bank instanceof StructurePowerBank) {
	                if (this.moreRobbersAreNeeded(room, bankinfo)) {
	                    orderExtraPowerBankTeam(room, bankinfo);
	                }
	            }
	            if (bankinfo.attackersOrdered && !bankinfo.haulersOrdered && (bank instanceof StructurePowerBank) && (shouldWeOrderPowerHaulers(bank))) {
	                room.memory.powerbanks[bankid].haulersOrdered = true;
	                orderPowerBankHaulers(room, bankinfo);
	            }
	            if (bankinfo.tickGone < Game.time) {
	                room.memory.powerbanks[bankid] = undefined;
	            }
	        }
	    }
	    moreRobbersAreNeeded(room, bankinfo) {
	        let bank = Game.getObjectById(bankinfo.id);
	        if (bank === null) {
	            return false;
	        }
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BankAttacker, bankinfo.id);
	        if (ordered > 0) {
	            return false;
	        }
	        let currentAttackers = this.creepService.getCreeps(role_1.Role.BankAttacker, bankinfo.id);
	        if (currentAttackers.length === 0) {
	            return true;
	        }
	        for (let attacker of currentAttackers) {
	            if (attacker.ticksToLive > 300 || attacker.ticksToLive === undefined) {
	                return false;
	            }
	        }
	        let damagePossible = 600 * currentAttackers[0].ticksToLive;
	        if (bank.hits > damagePossible) {
	            return true;
	        }
	        return false;
	    }
	}
	exports.PowerManager = PowerManager;
	function orderPowerBankTeam(room, bank) {
	    Logger_1.log.info("Bank is being robbed by room" + room.name + " (" + bank.power + " power)", bank.position.roomName);
	    let maxTierHealer = ProfileUtilities.getMaxTierHealer(room.energyCapacityAvailable);
	    let attackerorder = new Order_1.Order();
	    attackerorder.body = ProfileUtilities.getBankAttacker();
	    attackerorder.priority = priority_1.Priority.Critical;
	    attackerorder.memory = { role: role_1.Role.BankAttacker, target: bank.id, tier: 1 };
	    let healerorder = new Order_1.Order();
	    healerorder.body = ProfileUtilities.getHealerBody(maxTierHealer);
	    healerorder.priority = priority_1.Priority.Critical;
	    healerorder.memory = { role: role_1.Role.BankHealer, target: bank.id, tier: maxTierHealer };
	    let rangerorder = new Order_1.Order();
	    rangerorder.body = ProfileUtilities.getBankRanger();
	    rangerorder.priority = priority_1.Priority.Critical;
	    rangerorder.memory = { role: role_1.Role.BankRanger, target: bank.id, tier: 1 };
	    OrdersRepository.orderCreep(room, attackerorder);
	    OrdersRepository.orderCreep(room, healerorder);
	    if (bank.attackSpots > 1) {
	        OrdersRepository.orderCreep(room, attackerorder);
	        OrdersRepository.orderCreep(room, healerorder);
	    }
	    else {
	        OrdersRepository.orderCreep(room, rangerorder);
	    }
	}
	function orderExtraPowerBankTeam(room, bank) {
	    Logger_1.log.info("Sending reinforcements to bank by room" + room.name + " (" + bank.power + " power)", bank.position.roomName);
	    let maxTierHealer = ProfileUtilities.getMaxTierHealer(room.energyCapacityAvailable);
	    let attackerorder = new Order_1.Order();
	    attackerorder.body = ProfileUtilities.getBankAttacker();
	    attackerorder.priority = priority_1.Priority.Critical;
	    attackerorder.memory = { role: role_1.Role.BankAttacker, target: bank.id, tier: 1 };
	    let healerorder = new Order_1.Order();
	    healerorder.body = ProfileUtilities.getHealerBody(maxTierHealer);
	    healerorder.priority = priority_1.Priority.Critical;
	    healerorder.memory = { role: role_1.Role.BankHealer, target: bank.id, tier: maxTierHealer };
	    OrdersRepository.orderCreep(room, attackerorder);
	    OrdersRepository.orderCreep(room, healerorder);
	    let rangerorder = new Order_1.Order();
	    rangerorder.body = ProfileUtilities.getBankRanger();
	    rangerorder.priority = priority_1.Priority.Critical;
	    rangerorder.memory = { role: role_1.Role.BankRanger, target: bank.id, tier: 1 };
	    if (bank.attackSpots === 1) {
	        OrdersRepository.orderCreep(room, rangerorder);
	    }
	}
	function orderPowerBankHaulers(room, bank) {
	    let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getHaulerBody(maxTier);
	    order.priority = priority_1.Priority.Critical;
	    order.memory = { role: role_1.Role.BankHauler, target: bank.id, tier: maxTier };
	    let neededHaulers = Math.ceil((bank.power - 500) / 1600);
	    for (let i = 0; i < neededHaulers; i++) {
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	function shouldWeOrderPowerHaulers(bank) {
	    if (bank.hits < 200000) {
	        return true;
	    }
	    return false;
	}
	function getFreePowerbank(room) {
	    if (room.memory.powerbanks === undefined) {
	        return undefined;
	    }
	    let bestBank = undefined;
	    let bestBankPower = 0;
	    for (let bankid of Object.keys(room.memory.powerbanks)) {
	        let bankinfo = room.memory.powerbanks[bankid];
	        if (bankCanBeRobbed(bankinfo)) {
	            if (bestBank === undefined || bestBankPower < bankinfo.power) {
	                bestBank = bankinfo;
	                bestBankPower = bankinfo.power;
	            }
	        }
	    }
	    if (bestBank !== undefined) {
	        bestBank.attackersOrdered = true;
	        setPowerBankAsTaken(bestBank);
	    }
	    return bestBank;
	}
	function bankCanBeRobbed(bankinfo) {
	    return !bankinfo.attackersOrdered && bankinfo.distance < PowerConfig.maxDistanceToBank && !powerbankIsTaken(bankinfo) &&
	        bankinfo.tickGone - Game.time > PowerConfig.minTimeLeftForRobbingBank;
	}
	function setPowerBankAsTaken(bankinfo) {
	    if (Memory.takenBanks === undefined) {
	        Memory.takenBanks = [];
	    }
	    let bi = new BankInfoGlobal();
	    bi.id = bankinfo.id;
	    bi.tickGone = bankinfo.tickGone;
	    Memory.takenBanks.push(bi);
	}
	function powerbankIsTaken(bankinfo) {
	    if (Memory.takenBanks === undefined) {
	        return false;
	    }
	    for (let b of Memory.takenBanks) {
	        if (bankinfo.id === b.id) {
	            return true;
	        }
	    }
	    return false;
	}
	function registerPowerBank(room, bank) {
	    let spawn = room.getSpawn();
	    if (spawn === undefined) {
	        return;
	    }
	    if (room.memory.powerbanks === undefined) {
	        room.memory.powerbanks = {};
	    }
	    if (room.memory.powerbanks[bank.id] === undefined && bank.power >= PowerConfig.lowestPowerbankValueToHarvest) {
	        let bankinfo = new BankInfo();
	        bankinfo.id = bank.id;
	        bankinfo.tickGone = Game.time + bank.ticksToDecay;
	        bankinfo.hostilesAround = bank.room.find(FIND_HOSTILE_CREEPS).length > 0;
	        bankinfo.power = bank.power;
	        bankinfo.hits = bank.hits;
	        bankinfo.attackSpots = getAttackSpotsForBank(bank);
	        bankinfo.distance = PathfindingUtilities.getDistanseBetween(spawn.pos, bank.pos);
	        bankinfo.attackersOrdered = false;
	        bankinfo.haulersOrdered = false;
	        bankinfo.position = { x: bank.pos.x, y: bank.pos.y, roomName: bank.pos.roomName };
	        room.memory.powerbanks[bank.id] = bankinfo;
	        Logger_1.log.info("Bank found by room" + room.name + " (" + bank.power + " power)", bank.room.name);
	    }
	}
	exports.registerPowerBank = registerPowerBank;
	function getAttackSpotsForBank(bank) {
	    let positions = [];
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(bank.pos.x + x, bank.pos.y + y, bank.room.name);
	            if (!(position.x === bank.pos.x && position.y === bank.pos.y)) {
	                let terrainAtPositon = Game.map.getTerrainAt(position);
	                if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
	                    positions.push(position);
	                }
	            }
	        }
	    }
	    return positions.length;
	}
	class BankInfoGlobal {
	}
	class BankInfo {
	}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _BankRobbers = __webpack_require__(51);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToBankRoom"] = 1] = "MovingToBankRoom";
	    State[State["MovingToAttackPosition"] = 2] = "MovingToAttackPosition";
	    State[State["WaitingForHealer"] = 3] = "WaitingForHealer";
	    State[State["DestroyingBank"] = 4] = "DestroyingBank";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToBankRoom);
	    }
	    switch (creep.getState()) {
	        case State.MovingToBankRoom:
	            runMoveToBankRoom(creep);
	            break;
	        case State.MovingToAttackPosition:
	            runMoveToBank(creep);
	            break;
	        case State.WaitingForHealer:
	            runWaitingForHealer(creep);
	            break;
	        case State.DestroyingBank:
	            runDestroyingBank(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToBankRoom);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToBankRoom(creep) {
	    let bankPosition = _BankRobbers.getBankPosition(creep);
	    if (creep.room.name !== bankPosition.roomName) {
	        creep.travelTo({ pos: bankPosition }, { allowHostile: false, preferHighway: true });
	    }
	    else {
	        creep.setState(State.MovingToAttackPosition);
	        runMoveToBank(creep);
	    }
	}
	function runMoveToBank(creep) {
	    let bankPosition = _BankRobbers.getBankPosition(creep);
	    if (creep.pos.getRangeTo(bankPosition) > 1) {
	        creep.moveTo({ pos: bankPosition });
	    }
	    else {
	        creep.setState(State.WaitingForHealer);
	        runWaitingForHealer(creep);
	    }
	}
	function runWaitingForHealer(creep) {
	    if (creep.memory.healerInPosition) {
	        creep.setState(State.DestroyingBank);
	        runDestroyingBank(creep);
	    }
	}
	function runDestroyingBank(creep) {
	    let bank = getBank(creep);
	    if (bank !== null) {
	        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
	            creep.attack(bank);
	        }
	    }
	    else {
	        creep.suicide();
	    }
	}
	function getBank(creep) {
	    return Game.getObjectById(creep.memory.target);
	}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	function roomHasBankHaulers(room, bank) {
	    let numb = 0;
	    let creeps = room.find(FIND_MY_CREEPS);
	    for (let c of creeps) {
	        if (c.memory.role === role_1.Role.BankHauler) {
	            numb++;
	        }
	    }
	    let wantedHaulers = Math.floor(bank.power / 1600) - 1;
	    return numb >= Math.max(1, wantedHaulers);
	}
	exports.roomHasBankHaulers = roomHasBankHaulers;
	function setBankPostionInMemory(creep) {
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    if (homeroom !== undefined && homeroom.memory.powerbanks !== undefined &&
	        homeroom.memory.powerbanks[creep.memory.target] !== undefined) {
	        let bankinfo = homeroom.memory.powerbanks[creep.memory.target];
	        creep.memory.bankPosition = { x: bankinfo.position.x, y: bankinfo.position.y, roomName: bankinfo.position.roomName };
	    }
	}
	exports.setBankPostionInMemory = setBankPostionInMemory;
	function getBankPosition(creep) {
	    if (creep.memory.bankPosition === undefined) {
	        setBankPostionInMemory(creep);
	    }
	    if (creep.memory.bankPosition === undefined || creep.memory.bankPosition.x === undefined) {
	        Logger_1.log.error(creep.name + " is missing bankposition for PowerBank: " + creep.memory.target, creep.room.name);
	        return creep.pos;
	    }
	    let bankPosition = new RoomPosition(creep.memory.bankPosition.x, creep.memory.bankPosition.y, creep.memory.bankPosition.roomName);
	    return bankPosition;
	}
	exports.getBankPosition = getBankPosition;
	function itIsSafeToAttackBank(creep, bank) {
	    return (creep.hits > creep.hitsMax / 2) && (bank.hits > 10000 || roomHasBankHaulers(creep.room, bank));
	}
	exports.itIsSafeToAttackBank = itIsSafeToAttackBank;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _BankRobbers = __webpack_require__(51);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToBankRoom"] = 1] = "MovingToBankRoom";
	    State[State["FindingTargetToHeal"] = 2] = "FindingTargetToHeal";
	    State[State["MovingToTargetToHeal"] = 3] = "MovingToTargetToHeal";
	    State[State["HealingTarget"] = 4] = "HealingTarget";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToBankRoom);
	    }
	    switch (creep.getState()) {
	        case State.MovingToBankRoom:
	            runMoveToBankRoom(creep);
	            break;
	        case State.FindingTargetToHeal:
	            runFindingTargetToHeal(creep);
	            break;
	        case State.MovingToTargetToHeal:
	            runMovingToTargetToHeal(creep);
	            break;
	        case State.HealingTarget:
	            runHealingTarget(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToBankRoom);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToBankRoom(creep) {
	    let bankPosition = _BankRobbers.getBankPosition(creep);
	    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 5) {
	        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
	    }
	    else {
	        creep.setState(State.FindingTargetToHeal);
	        runFindingTargetToHeal(creep);
	    }
	}
	function runFindingTargetToHeal(creep) {
	    if (Game.time % 5 === 0) {
	        let targetToHeal = getTargetToHeal(creep);
	        if (targetToHeal instanceof Creep) {
	            creep.memory.targetToHeal = targetToHeal.id;
	            targetToHeal.memory.healer = creep.id;
	            creep.setState(State.MovingToTargetToHeal);
	            runMovingToTargetToHeal(creep);
	        }
	    }
	}
	function runMovingToTargetToHeal(creep) {
	    let targetToHeal = getTargetToHeal(creep);
	    if (targetToHeal !== null) {
	        if (creep.pos.getRangeTo(targetToHeal) > 1) {
	            creep.travelTo(targetToHeal);
	        }
	        else {
	            targetToHeal.memory.healerInPosition = true;
	            creep.setState(State.HealingTarget);
	            runHealingTarget(creep);
	        }
	    }
	    else {
	        creep.setState(State.FindingTargetToHeal);
	    }
	}
	function runHealingTarget(creep) {
	    let targetToHeal = getTargetToHeal(creep);
	    if (targetToHeal !== null) {
	        creep.heal(targetToHeal);
	    }
	    else {
	        creep.suicide();
	    }
	}
	function getTargetToHeal(creep) {
	    if (creep.memory.targetToHeal !== undefined) {
	        return Game.getObjectById(creep.memory.targetToHeal);
	    }
	    let targetToHeal = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: function (c) {
	            return c.memory.role === role_1.Role.BankAttacker && c.memory.healerInPosition === undefined && c.ticksToLive > 300;
	        } });
	    if (targetToHeal instanceof Creep) {
	        return targetToHeal;
	    }
	    return null;
	}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _BankRobbers = __webpack_require__(51);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToBankPosition"] = 1] = "MovingToBankPosition";
	    State[State["WaitForPower"] = 2] = "WaitForPower";
	    State[State["PickUpPower"] = 3] = "PickUpPower";
	    State[State["ReturnToBase"] = 4] = "ReturnToBase";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToBankPosition);
	    }
	    switch (creep.getState()) {
	        case State.MovingToBankPosition:
	            runMovingToBankPosition(creep);
	            break;
	        case State.WaitForPower:
	            runWaitForPower(creep);
	            break;
	        case State.PickUpPower:
	            runPickUpPower(creep);
	            break;
	        case State.ReturnToBase:
	            runReturnToBase(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToBankPosition);
	            break;
	    }
	}
	exports.run = run;
	function runMovingToBankPosition(creep) {
	    let bankPosition = _BankRobbers.getBankPosition(creep);
	    if (creep.room.name !== bankPosition.roomName || creep.isAtBorder() || creep.pos.getRangeTo(bankPosition) > 7) {
	        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
	    }
	    else {
	        creep.setState(State.WaitForPower);
	        runWaitForPower(creep);
	    }
	}
	function runWaitForPower(creep) {
	    let bank = Game.getObjectById(creep.memory.target);
	    if (bank === null) {
	        creep.setState(State.PickUpPower);
	        runPickUpPower(creep);
	    }
	}
	function runPickUpPower(creep) {
	    if (creep.carry.power === creep.carryCapacity) {
	        creep.setState(State.ReturnToBase);
	        runReturnToBase(creep);
	    }
	    else {
	        let powerStack = getPowerStackInRoom(creep);
	        if (powerStack !== null) {
	            if (creep.pos.getRangeTo(powerStack) === 1) {
	                creep.pickup(powerStack);
	            }
	            else {
	                if (creep.fatigue === 0) {
	                    creep.moveTo(powerStack);
	                }
	            }
	        }
	        else if (creep.carry.power > 0) {
	            creep.setState(State.ReturnToBase);
	            runReturnToBase(creep);
	        }
	        else {
	            creep.suicide();
	        }
	    }
	}
	function runReturnToBase(creep) {
	    if (creep.carry === undefined || creep.carry.power === undefined) {
	        creep.suicide();
	    }
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    if (homeroom.storage !== undefined) {
	        if (creep.room.name === homeroom.name && creep.pos.getRangeTo(homeroom.storage) === 1) {
	            creep.transfer(homeroom.storage, RESOURCE_POWER);
	        }
	        else {
	            creep.travelTo(homeroom.storage, { preferHighway: true });
	        }
	    }
	    else {
	        Logger_1.log.error("BankHauler " + creep.name + " is missing homeroom or storage in home room", creep.memory.homeroom);
	    }
	}
	function getPowerStackInRoom(creep) {
	    let powerStacks = creep.room.find(FIND_DROPPED_RESOURCES, { filter: function (r) {
	            return r.resourceType === RESOURCE_POWER;
	        } });
	    if (powerStacks !== undefined && powerStacks.length > 0) {
	        return powerStacks[0];
	    }
	    else {
	        return null;
	    }
	}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Military = __webpack_require__(55);
	const _Targeting = __webpack_require__(56);
	const _BankRobbers = __webpack_require__(51);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToBank"] = 1] = "MovingToBank";
	    State[State["AttackingBank"] = 2] = "AttackingBank";
	    State[State["DefendingBankroom"] = 3] = "DefendingBankroom";
	})(State || (State = {}));
	function run(creep) {
	    healIfNeeded(creep);
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToBank);
	    }
	    switch (creep.getState()) {
	        case State.MovingToBank:
	            runMoveToBank(creep);
	            break;
	        case State.AttackingBank:
	            runAttackingBank(creep);
	            break;
	        case State.DefendingBankroom:
	            runDefendingBankroom(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToBank);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToBank(creep) {
	    let bankPosition = _BankRobbers.getBankPosition(creep);
	    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 3) {
	        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
	    }
	    else {
	        creep.setState(State.AttackingBank);
	        runAttackingBank(creep);
	    }
	}
	function runAttackingBank(creep) {
	    if (Game.time % 13 === 0) {
	        if (checkForHostiles(creep)) {
	            creep.setState(State.DefendingBankroom);
	            runDefendingBankroom(creep);
	            return;
	        }
	    }
	    let bank = getBank(creep);
	    if (bank !== null) {
	        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
	            creep.rangedAttack(bank);
	        }
	    }
	    else {
	    }
	}
	function runDefendingBankroom(creep) {
	    if (Game.time % 5 === 0) {
	        checkForHostiles(creep);
	    }
	    let target = Game.getObjectById(creep.memory.hostileTarget);
	    if (target === null) {
	        creep.memory.hostileTarget = undefined;
	        creep.setState(State.MovingToBank);
	        runMoveToBank(creep);
	        return;
	    }
	    _Military.kiteAndAttack(creep, target);
	}
	function healIfNeeded(creep) {
	    if (creep.hits < creep.hitsMax) {
	        creep.heal(creep);
	    }
	}
	function getBank(creep) {
	    return Game.getObjectById(creep.memory.target);
	}
	function checkForHostiles(creep) {
	    let target = _Targeting.getPrioritizedTarget(creep);
	    if (target !== null) {
	        creep.memory.hostileTarget = target.id;
	        return true;
	    }
	    return false;
	}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const _Targeting = __webpack_require__(56);
	function kiteAndAttack(creep, targetEnemy, range = 3) {
	    let distance = creep.pos.getRangeTo(targetEnemy.pos);
	    if (distance > range) {
	        creep.moveTo(targetEnemy, { maxRooms: 1 });
	    }
	    else if (distance < range) {
	        creep.moveTo(getFleeMove(creep, targetEnemy.pos), { maxRooms: 1 });
	    }
	    if (distance <= 3) {
	        if (distance === 1) {
	            creep.rangedMassAttack();
	        }
	        else {
	            creep.rangedAttack(targetEnemy);
	        }
	        return true;
	    }
	    return false;
	}
	exports.kiteAndAttack = kiteAndAttack;
	function rangedAttackToEnemiesAround(creep) {
	    let targets = [];
	    for (let x of [-2, -1, 0, 1, 2]) {
	        for (let y of [-2, -1, 0, 1, 2]) {
	            if (creep.pos.x + x >= 0 && creep.pos.x + x <= 49 && creep.pos.y + y >= 0 && creep.pos.y + y <= 49) {
	                let pos = new RoomPosition(creep.pos.x + x, creep.pos.y + y, creep.pos.roomName);
	                let atPos = pos.lookFor(LOOK_CREEPS);
	                for (let c of atPos) {
	                    if (!c.my && _Targeting.isCreepHostile(c)) {
	                        targets.push(c);
	                    }
	                }
	            }
	        }
	    }
	    if (targets.length > 1) {
	        creep.rangedMassAttack();
	        return true;
	    }
	    else if (targets.length === 1) {
	        creep.rangedAttack(targets[0]);
	        return true;
	    }
	    return false;
	}
	exports.rangedAttackToEnemiesAround = rangedAttackToEnemiesAround;
	function getFleeMove(creep, position) {
	    return PathFinder.search(creep.pos, { pos: position, range: 5 }, {
	        plainCost: 1,
	        swampCost: 10,
	        flee: true,
	        roomCallback: PathfindingUtilities.getKitingRoomCallback
	    }).path[0];
	}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

	"use strict";
	function getFriendsList() {
	    if (Memory.friendly === undefined) {
	        Memory.friendly = [];
	    }
	    return Memory.friendly;
	}
	exports.getFriendsList = getFriendsList;
	function isCreepHostile(creep) {
	    return _.indexOf(getFriendsList(), creep.owner.username) < 0;
	}
	exports.isCreepHostile = isCreepHostile;
	function filterFriendlyCreepsFromList(creeps) {
	    return _.filter(creeps, function (c) {
	        return _.indexOf(getFriendsList(), c.owner.username) < 0;
	    });
	}
	exports.filterFriendlyCreepsFromList = filterFriendlyCreepsFromList;
	function filterStructuresOnBigRamparts(structures) {
	    return _.filter(structures, function (s) {
	        let atPos = s.pos.lookFor(LOOK_STRUCTURES);
	        for (let sAtPos of atPos) {
	            if (sAtPos.structureType === STRUCTURE_RAMPART && sAtPos.hits > 100000) {
	                return false;
	            }
	        }
	        return true;
	    });
	}
	exports.filterStructuresOnBigRamparts = filterStructuresOnBigRamparts;
	function filterConstructionSitesOnRamparts(structures) {
	    return _.filter(structures, function (s) {
	        let atPos = s.pos.lookFor(LOOK_STRUCTURES);
	        for (let sAtPos of atPos) {
	            if (sAtPos.structureType === STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        return true;
	    });
	}
	exports.filterConstructionSitesOnRamparts = filterConstructionSitesOnRamparts;
	function filterFriendlyStructuresFromList(structures) {
	    return _.filter(structures, function (s) {
	        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
	    });
	}
	exports.filterFriendlyStructuresFromList = filterFriendlyStructuresFromList;
	function filterFriendlyConstructionSitesFromList(structures) {
	    return _.filter(structures, function (s) {
	        return !(s instanceof OwnedStructure) || _.indexOf(getFriendsList(), s.owner.username) < 0;
	    });
	}
	exports.filterFriendlyConstructionSitesFromList = filterFriendlyConstructionSitesFromList;
	function filterPillageableStructuresFromList(structures) {
	    return _.filter(structures, function (s) {
	        return !((s.structureType === STRUCTURE_STORAGE && _.sum(s.store) > 50000) ||
	            (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) > 50000));
	    });
	}
	exports.filterPillageableStructuresFromList = filterPillageableStructuresFromList;
	function findHostileVitalStructures(room, pillage = false) {
	    let structures = room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) {
	            return s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_SPAWN ||
	                s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_TERMINAL;
	        } });
	    if (pillage) {
	        structures = filterPillageableStructuresFromList(structures);
	    }
	    return filterFriendlyStructuresFromList(structures);
	}
	exports.findHostileVitalStructures = findHostileVitalStructures;
	function findHostileStructures(room) {
	    let structures = room.find(FIND_HOSTILE_STRUCTURES, { filter: function (s) {
	            return s.structureType !== STRUCTURE_CONTROLLER && s.structureType !== STRUCTURE_RAMPART &&
	                s.structureType !== STRUCTURE_POWER_BANK && s.structureType !== STRUCTURE_TERMINAL;
	        } });
	    return filterFriendlyStructuresFromList(structures);
	}
	exports.findHostileStructures = findHostileStructures;
	function findHostileConstructionSites(room) {
	    let structures = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: function (s) {
	            return s.structureType !== STRUCTURE_EXTRACTOR;
	        } });
	    return filterFriendlyConstructionSitesFromList(structures);
	}
	exports.findHostileConstructionSites = findHostileConstructionSites;
	function findClosestHostileCreepsInRoom(pos) {
	    return pos.findClosestByRange(findHostileCreepsInRoom(Game.rooms[pos.roomName]));
	}
	exports.findClosestHostileCreepsInRoom = findClosestHostileCreepsInRoom;
	function findHostileCreepsInRoom(room, includeNPCs = true) {
	    let creeps = room.find(FIND_HOSTILE_CREEPS);
	    if (includeNPCs === false) {
	        creeps = _.filter(creeps, (c) => c.owner.username !== "Invader" && c.owner.username !== "Source Keeper");
	    }
	    return filterFriendlyCreepsFromList(creeps);
	}
	exports.findHostileCreepsInRoom = findHostileCreepsInRoom;
	function findHostileCreepsInRangedRange(pos) {
	    let creeps = pos.findInRange(FIND_HOSTILE_CREEPS, 3);
	    return filterFriendlyCreepsFromList(creeps);
	}
	exports.findHostileCreepsInRangedRange = findHostileCreepsInRangedRange;
	function getPrioritizedTarget(creep) {
	    let enemiesInRoom = findHostileCreepsInRoom(creep.room);
	    if (enemiesInRoom.length < 1) {
	        return null;
	    }
	    let closestDangerousCreep = creep.pos.findClosestByPath(enemiesInRoom, {
	        filter: function (c) {
	            return c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0;
	        }
	    });
	    if (closestDangerousCreep !== null && closestDangerousCreep !== undefined) {
	        return closestDangerousCreep;
	    }
	    let closestCreep = creep.pos.findClosestByPath(enemiesInRoom);
	    if (closestCreep !== undefined) {
	        return closestCreep;
	    }
	    return null;
	}
	exports.getPrioritizedTarget = getPrioritizedTarget;
	function getPrioritizedTargetIncludingVitalBuildings(creep) {
	    let hostileCreep = getPrioritizedTarget(creep);
	    if (hostileCreep !== null) {
	        return hostileCreep;
	    }
	    let structures = findHostileVitalStructures(creep.room);
	    let closestStructure = creep.pos.findClosestByPath(structures);
	    if (closestStructure !== undefined) {
	        return closestStructure;
	    }
	    return null;
	}
	exports.getPrioritizedTargetIncludingVitalBuildings = getPrioritizedTargetIncludingVitalBuildings;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

	"use strict";
	var powerConfig = {
	    lowestPowerbankValueToHarvest: 2500,
	    maxDistanceToBank: 300,
	    minTimeLeftForRobbingBank: 4000,
	    energyInStorageBeforeRobbing: 50000,
	    powerInStorageBeforeStoppingRobbing: 500000
	};
	module.exports = powerConfig;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (creep.memory.target === undefined) {
	        creep.memory.target = getScoutingTarget(creep, creep.memory.homeroom);
	        if (creep.memory.target === undefined) {
	            creep.suicide();
	            return;
	        }
	    }
	    if (creep.memory.target !== null && creep.memory.target !== undefined && creep.memory.target !== creep.room.name) {
	        if (Memory.empire.inaccessible !== undefined && _.contains(Memory.empire.inaccessible, creep.memory.target)) {
	            creep.memory.target = undefined;
	            return;
	        }
	        let response = creep.travelToRoom(creep.memory.target, { allowHostile: false, allowSK: true }, true);
	        if (response === ERR_NO_PATH || response === ERR_INVALID_ARGS) {
	            if (Memory.rooms[creep.memory.target] === undefined) {
	                Memory.rooms[creep.memory.target] = {};
	            }
	            Memory.rooms[creep.memory.target].inaccessible = Game.time;
	            creep.memory.target = undefined;
	        }
	        if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
	            IntelLib.saveIntelForRoom(creep.room);
	        }
	        return;
	    }
	    IntelLib.saveIntelForRoom(creep.room);
	    creep.memory.target = undefined;
	}
	exports.run = run;
	;
	function getScoutingTarget(creep, roomName) {
	    let room = Game.rooms[roomName];
	    if (!(room instanceof Room)) {
	        return undefined;
	    }
	    if (room.memory.scoutqueue === undefined) {
	        room.memory.scoutqueue = [];
	        return undefined;
	    }
	    if (room.memory.scoutqueue.length === 0) {
	        return undefined;
	    }
	    let closest = room.memory.scoutqueue[0];
	    let chosenDistance = Game.map.getRoomLinearDistance(creep.pos.roomName, closest);
	    for (let t of room.memory.scoutqueue) {
	        let distance = Game.map.getRoomLinearDistance(creep.pos.roomName, t);
	        if (distance < chosenDistance) {
	            chosenDistance = distance;
	            closest = t;
	        }
	    }
	    room.memory.scoutqueue = _.without(room.memory.scoutqueue, closest);
	    return closest;
	}


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomUtilities = __webpack_require__(36);
	const OrdersRepository = __webpack_require__(18);
	const roomlevel_1 = __webpack_require__(11);
	const RoomRepository = __webpack_require__(10);
	const _Manager_1 = __webpack_require__(14);
	class RoomlevelManager extends _Manager_1.Manager {
	    constructor(roomService) {
	        super("RoomlevelManager");
	        this.hasRunUpdate = false;
	        this.MEMORY_LASTRUN_UPDATE = "lastRunUpdate";
	        this.MEMORY_LASTRUN_CRISIS = "lastRunCrisis";
	        this.roomService = roomService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            let lastRunUpdate = this.getValue(this.MEMORY_LASTRUN_UPDATE);
	            if (lastRunUpdate === undefined || lastRunUpdate + 100 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    updateRoomLevel(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_UPDATE, Game.time);
	                this.hasRunUpdate = true;
	            }
	            let lastRunCrisis = this.getValue(this.MEMORY_LASTRUN_CRISIS);
	            if (lastRunCrisis === undefined || lastRunCrisis + 500 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    checkRoomLevel(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_CRISIS, Game.time);
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRunUpdate) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN_UPDATE);
	            if (lastRun === undefined || lastRun + 10 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    updateRoomLevel(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_UPDATE, Game.time);
	            }
	        }
	    }
	}
	exports.RoomlevelManager = RoomlevelManager;
	function updateRoomLevel(room) {
	    switch (RoomRepository.getRoomLevel(room)) {
	        case roomlevel_1.RoomLevel.BasicColony:
	            basicColonyCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.BasicColonyReadyForExpansion:
	            basicColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.SimpleColony:
	            simpleColonyCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion:
	            simpleColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.DefendedColony:
	            defendedColonyCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion:
	            defendedColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.CivilizedColony:
	            civilizedColonyCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion:
	            civilizedColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.AdvancedColony:
	            advancedColonyCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion:
	            advancedColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.Town:
	            townCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.TownReadyForExpansion:
	            townReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.City:
	            cityCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.CityReadyForExpansion:
	            cityColonyReadyForExpansionCheck(room);
	            break;
	        case roomlevel_1.RoomLevel.Metropolis:
	            metropolisCheck(room);
	            break;
	        default:
	            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	            break;
	    }
	}
	function checkRoomLevel(room) {
	    let level = RoomRepository.getRoomLevel(room);
	    if (level > roomlevel_1.RoomLevel.BasicColony) {
	        if (room.getSpawn() === undefined) {
	            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	            return;
	        }
	    }
	    if (level >= roomlevel_1.RoomLevel.DefendedColony && level < roomlevel_1.RoomLevel.CivilizedColony) {
	        if (room.getBaseContainer() === undefined && room.storage === undefined) {
	            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	            return;
	        }
	    }
	    if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
	        if (room.storage === undefined) {
	            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	            return;
	        }
	    }
	    if (level >= roomlevel_1.RoomLevel.Town) {
	        if (room.terminal === undefined) {
	            RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	            return;
	        }
	    }
	}
	function basicColonyCheck(room) {
	    if (RoomUtilities.hasAtLeastSpawns(room, 1) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColony) &&
	        RoomUtilities.controllerLevelAtLeast(room, 2)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion);
	    }
	}
	function basicColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) &&
	        RoomUtilities.hasAtLeastExtensions(room, 5)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
	    }
	    else if (RoomUtilities.controllerLevelBelow(room, 2) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.BasicColonyReadyForExpansion)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	    }
	}
	function simpleColonyCheck(room) {
	    if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColony) &&
	        RoomUtilities.controllerLevelAtLeast(room, 3)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColony) &&
	        RoomUtilities.controllerLevelBelow(room, 2)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.BasicColony);
	    }
	}
	function simpleColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasActiveTower(room) &&
	        RoomUtilities.hasAtLeastExtensions(room, 10) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 3)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
	    }
	}
	function defendedColonyCheck(room) {
	    if (RoomUtilities.controllerLevelAtLeast(room, 4) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColony)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColony) &&
	        RoomUtilities.controllerLevelBelow(room, 3)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.SimpleColony);
	    }
	}
	function defendedColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasStorage(room) &&
	        RoomUtilities.hasAtLeastExtensions(room, 20) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 4)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
	    }
	}
	function civilizedColonyCheck(room) {
	    if (RoomUtilities.controllerLevelAtLeast(room, 5) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColony)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColony) &&
	        (RoomUtilities.controllerLevelBelow(room, 4) || !RoomUtilities.hasStorage(room))) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
	    }
	}
	function civilizedColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasAtLeastExtensions(room, 30) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 5)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
	    }
	}
	function advancedColonyCheck(room) {
	    if (RoomUtilities.controllerLevelAtLeast(room, 6) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColony)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColony) &&
	        RoomUtilities.controllerLevelBelow(room, 5)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CivilizedColony);
	    }
	}
	function advancedColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasTerminal(room) &&
	        RoomUtilities.hasAtLeastExtensions(room, 40) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 6)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
	    }
	}
	function townCheck(room) {
	    if (RoomUtilities.controllerLevelAtLeast(room, 7) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Town)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.TownReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Town) &&
	        (RoomUtilities.controllerLevelBelow(room, 6) || !RoomUtilities.hasTerminal(room))) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
	    }
	    if (room.memory.lab === undefined) {
	        room.memory.lab = {};
	    }
	    if (RoomUtilities.hasAtLeastLabs(room, 3)) {
	        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
	            room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
	            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
	            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
	            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 0) {
	                room.memory.lab.operational = true;
	            }
	            else {
	                room.memory.lab.operational = false;
	            }
	        }
	    }
	    else {
	        room.memory.lab.operational = false;
	        room.memory.lab.processingLabs = undefined;
	        room.memory.lab.supplyingLabs = undefined;
	    }
	}
	function townReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasAtLeastSpawns(room, 2) &&
	        RoomUtilities.hasAtLeastExtensions(room, 50) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.TownReadyForExpansion)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.TownReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 7)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
	    }
	}
	function cityCheck(room) {
	    if (RoomUtilities.controllerLevelAtLeast(room, 8) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.City)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.CityReadyForExpansion);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.City) &&
	        RoomUtilities.controllerLevelBelow(room, 7)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Town);
	        return;
	    }
	    if (room.memory.lab === undefined) {
	        room.memory.lab = {};
	    }
	    if (RoomUtilities.hasAtLeastLabs(room, 6)) {
	        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
	            room.memory.lab.processingLabs.length < 3 || room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
	            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
	            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
	            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 3) {
	                room.memory.lab.operational = true;
	            }
	            else {
	                room.memory.lab.operational = false;
	            }
	        }
	    }
	    else {
	        room.memory.lab.operational = false;
	        room.memory.lab.processingLabs = undefined;
	        room.memory.lab.supplyingLabs = undefined;
	    }
	}
	function cityColonyReadyForExpansionCheck(room) {
	    if (RoomUtilities.hasAtLeastSpawns(room, 3) &&
	        RoomUtilities.hasAtLeastExtensions(room, 60) &&
	        RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CityReadyForExpansion)) {
	        OrdersRepository.clearOrders(room);
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.Metropolis);
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.CityReadyForExpansion) &&
	        RoomUtilities.controllerLevelBelow(room, 8)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
	    }
	}
	function metropolisCheck(room) {
	    if (room.memory.lab === undefined) {
	        room.memory.lab = {};
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
	        !RoomUtilities.hasStorage(room)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.DefendedColony);
	        return;
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
	        !RoomUtilities.hasTerminal(room)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.AdvancedColony);
	        return;
	    }
	    else if (RoomUtilities.roomlevelIsAt(room, roomlevel_1.RoomLevel.Metropolis) &&
	        RoomUtilities.controllerLevelBelow(room, 8)) {
	        RoomRepository.setRoomLevel(room, roomlevel_1.RoomLevel.City);
	        return;
	    }
	    if (RoomUtilities.hasAtLeastLabs(room, 10)) {
	        if (!room.memory.lab.operational || room.memory.lab.processingLabs === undefined ||
	            room.memory.lab.processingLabs.length < 7 || room.memory.lab.supplyingLabs === undefined || room.memory.lab.supplyingLabs !== 2) {
	            room.memory.lab.processingLabs = RoomUtilities.getProcessingLabs(room);
	            room.memory.lab.supplyingLabs = RoomUtilities.getSupplyLabs(room);
	            if (room.memory.lab.supplyingLabs.length === 2 && room.memory.lab.processingLabs.length === 7) {
	                room.memory.lab.operational = true;
	            }
	            else {
	                room.memory.lab.operational = false;
	            }
	        }
	    }
	    else {
	        room.memory.lab.operational = false;
	        room.memory.lab.processingLabs = undefined;
	        room.memory.lab.supplyingLabs = undefined;
	    }
	}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const ScoutingUtilities = __webpack_require__(47);
	const PathfindingUtilities = __webpack_require__(3);
	const RoomRepository = __webpack_require__(10);
	const OrdersRepository = __webpack_require__(18);
	const OutpostReserver = __webpack_require__(61);
	const OutpostDefender = __webpack_require__(62);
	const OutpostSupporter = __webpack_require__(64);
	const OutpostWarrior = __webpack_require__(65);
	const IntelLib = __webpack_require__(5);
	const RoomLib = __webpack_require__(30);
	const OperationLib = __webpack_require__(66);
	const Order_1 = __webpack_require__(20);
	const _Manager_1 = __webpack_require__(14);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	class OutpostManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("OutpostManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.MEMORY_LASTRUN_OUTPOSTLIST = "lastRunOutpostList";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.OutpostReserver, OutpostReserver.run);
	            this.creepService.runCreeps(role_1.Role.OutpostDefender, OutpostDefender.run);
	            this.creepService.runCreeps(role_1.Role.OutpostSupporter, OutpostSupporter.run);
	            this.creepService.runCreeps(role_1.Role.OutpostWarrior, OutpostWarrior.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 10 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony || room.isExpansion()) {
	                        this.orderOutpostDefenders(room);
	                    }
	                    if (room.isExpansion()) {
	                        continue;
	                    }
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.DefendedColony &&
	                        (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] > 500)) {
	                        this.orderOutpostReservers(room);
	                        this.orderJanitors(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
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
	                }
	                else {
	                    this.setValue(this.MEMORY_LASTRUN_OUTPOSTLIST, Game.time + 500);
	                }
	            }
	        }
	    }
	    orderJanitors(room) {
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
	                        let neededTiers = Math.ceil(roadcount / 6);
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
	                    let roadcount = outpostRoom.find(FIND_MY_CONSTRUCTION_SITES).length;
	                    if (roadcount > 0) {
	                        let neededTiers = Math.ceil(roadcount / 6);
	                        this.orderJanitor(room, neededTiers);
	                    }
	                }
	            }
	        }
	    }
	    orderJanitor(room, neededTiers) {
	        let maxTier = ProfileUtilities.getMaxTierDistanceWorker(room.energyCapacityAvailable);
	        if (maxTier < 1) {
	            return;
	        }
	        let current = this.creepService.getCreeps(role_1.Role.Janitor, room.name).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Janitor, room.name);
	        if (current + ordered > 1) {
	            return;
	        }
	        let usedTier = maxTier;
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.Janitor, room.name);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.Janitor, room.name);
	        if (neededTiers >= currentTiers + orderedTiers) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getDistanceWorkerBody(usedTier);
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.Janitor, target: room.name, tier: usedTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderOutpostDefenders(room) {
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
	    orderOutpostDefender(room, outpost) {
	        let current = this.creepService.getCreeps(role_1.Role.OutpostDefender, null, room.name);
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.OutpostDefender);
	        if (current.length > 0) {
	            for (let d of current) {
	                let state = d.getState();
	                if (state === OutpostDefender.State.WaitingForSupport) {
	                    this.orderOutpostSupporter(room);
	                }
	                else if (state === OutpostDefender.State.WaitingForWarrior) {
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
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getRangerBody(usedTier);
	        order.priority = priority_1.Priority.Critical;
	        order.memory = { role: role_1.Role.OutpostDefender, target: outpost, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderOutpostSupporter(room) {
	        let current = this.creepService.getCreeps(role_1.Role.OutpostSupporter, null, room.name);
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.OutpostSupporter);
	        if (current.length + ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierSupporter(room.energyCapacityAvailable);
	        let usedTier = maxTier;
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getSupporterBody(usedTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.OutpostSupporter, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderOutpostWarrior(room) {
	        let current = this.creepService.getCreeps(role_1.Role.OutpostWarrior, null, room.name);
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.OutpostWarrior);
	        if (current.length + ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierRogue(room.energyCapacityAvailable);
	        let usedTier = maxTier;
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getRogueBody(usedTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.OutpostWarrior, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderOutpostReservers(room) {
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
	    orderOutpostReserver(room, controllerpos, controllerid) {
	        let maxTier = ProfileUtilities.getMaxTierClaimer(room.energyCapacityAvailable);
	        if (maxTier < 1) {
	            return;
	        }
	        let usedTier = Math.min(10, maxTier);
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.OutpostReserver, "$" + controllerpos.roomName + "-" + controllerid);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.OutpostReserver, "$" + controllerpos.roomName + "-" + controllerid);
	        let neededTiers = 1;
	        if (neededTiers > currentTiers + orderedTiers) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getClaimerBody(usedTier);
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.OutpostReserver,
	                target: "$" + controllerpos.roomName + "-" + controllerid, tier: usedTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    maintainOutpostList(room) {
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
	        if (roomLevel >= roomlevel_1.RoomLevel.CityReadyForExpansion && Memory.settings.bot === true) {
	            wanted = 6;
	        }
	        else if (roomLevel >= roomlevel_1.RoomLevel.TownReadyForExpansion) {
	            wanted = 4;
	        }
	        else {
	            wanted = 2;
	        }
	        if (Memory.settings.slow === true && Memory.settings.bot === true) {
	            if (roomLevel >= roomlevel_1.RoomLevel.CityReadyForExpansion) {
	                wanted = 3;
	            }
	            else if (roomLevel >= roomlevel_1.RoomLevel.TownReadyForExpansion) {
	                wanted = 2;
	            }
	            else {
	                wanted = 1;
	            }
	        }
	        let closeSKrooms = _.filter(room.memory.neighbours.oneAway, (o) => RoomRepository.isSKRoom(o));
	        if (roomLevel >= roomlevel_1.RoomLevel.TownReadyForExpansion) {
	            if (closeSKrooms.length > 0) {
	                wanted = wanted - 1;
	            }
	        }
	        if (currentOutposts.length < wanted) {
	            if (room.memory.outposts === undefined) {
	                room.memory.outposts = [];
	            }
	            if ((roomLevel >= roomlevel_1.RoomLevel.TownReadyForExpansion) &&
	                closeSKrooms.length > 0 && !_.contains(room.memory.outposts, closeSKrooms[0])) {
	                room.memory.outposts.push(closeSKrooms[0]);
	                console.log("Added outpost for room " + room.name + ": " + closeSKrooms[0]);
	                return true;
	            }
	            let nextOutpost = this.getNextOutpost(room.name);
	            if (nextOutpost !== undefined) {
	                if ((roomLevel >= roomlevel_1.RoomLevel.TownReadyForExpansion) &&
	                    closeSKrooms.length > 0 && !_.contains(room.memory.outposts, closeSKrooms[0])) {
	                    nextOutpost = closeSKrooms[0];
	                }
	                room.memory.outposts.push(nextOutpost);
	                console.log("Added outpost for room " + room.name + ": " + nextOutpost);
	                return true;
	            }
	            else {
	                if (Memory.settings.bot === true) {
	                    this.guardNextWantedOutpost(room);
	                }
	            }
	        }
	        return false;
	    }
	    guardNextWantedOutpost(room) {
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
	    getNextOutpost(roomName, alsoHostile = false) {
	        let oneAway = ScoutingUtilities.getRoomsOneAway(roomName);
	        let neighbours = oneAway;
	        let potOutposts = [];
	        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].outposts !== undefined) {
	            for (let o of Memory.rooms[roomName].outposts) {
	                neighbours = neighbours.concat(ScoutingUtilities.getRoomsOneAway(o));
	            }
	            potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName && !_.contains(Memory.rooms[roomName].outposts, o));
	        }
	        else {
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
	        let values = [];
	        for (let o of potOutposts) {
	            values.push({ roomName: o, value: getOutpostValue(roomName, o) });
	        }
	        values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();
	        if (values.length > 0) {
	            return values[0].roomName;
	        }
	    }
	}
	exports.OutpostManager = OutpostManager;
	function listNextOutposts(roomName) {
	    let neighbours = ScoutingUtilities.getRoomsOneAway(roomName);
	    let potOutposts = [];
	    if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].outposts !== undefined) {
	        for (let o of Memory.rooms[roomName].outposts) {
	            neighbours = neighbours.concat(ScoutingUtilities.getRoomsOneAway(o));
	        }
	        potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName && !_.contains(Memory.rooms[roomName].outposts, o));
	    }
	    else {
	        potOutposts = _.filter(_.uniq(neighbours), (o) => o !== roomName);
	    }
	    let values = [];
	    for (let o of potOutposts) {
	        values.push({ roomName: o, value: getOutpostValue(roomName, o) });
	    }
	    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();
	    console.log("Room " + roomName + " outpost-values (best first)");
	    for (let o of values) {
	        console.log(o["roomName"] + ": " + o["value"]);
	    }
	}
	exports.listNextOutposts = listNextOutposts;
	function evaluateOutposts(roomName) {
	    let closeRooms = ScoutingUtilities.getRoomsOneAway(roomName).concat(ScoutingUtilities.getRoomsTwoAway(roomName), ScoutingUtilities.getRoomsThreeAway(roomName));
	    let potOutposts = _.filter(closeRooms, function (r) { return !RoomLib.roomIsHighway(r) && !RoomRepository.isMiddleRoom(r); });
	    let values = [];
	    for (let o of potOutposts) {
	        values.push({ roomName: o, value: getOutpostValue(roomName, o) });
	    }
	    values = _(_.filter(_.sortBy(values, "value"), (o) => o["value"] !== undefined)).reverse().value();
	    return values;
	}
	exports.evaluateOutposts = evaluateOutposts;
	function getOutpostValue(homeroom, outpost) {
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
	exports.getOutpostValue = getOutpostValue;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const IntelLib = __webpack_require__(5);
	function run(creep) {
	    let controllerPos = getRoomPosForOutpostController(creep.memory.target);
	    if (controllerPos === null) {
	        console.log("Missing controllerPos for reserver: " + creep.pos);
	        return;
	    }
	    if (_Common.targetRoomHasInvaders(creep, controllerPos.roomName)) {
	        return;
	    }
	    if (controllerPos.roomName !== creep.room.name) {
	        creep.travelTo({ pos: controllerPos });
	    }
	    else {
	        let response = creep.reserveController(getControllerWithId(creep.memory.target));
	        if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_ENOUGH_RESOURCES) {
	            creep.travelTo({ pos: controllerPos });
	        }
	    }
	}
	exports.run = run;
	;
	function getRoomPosForOutpostController(target) {
	    let roomname = target.substr(1).split("-")[0];
	    ;
	    let controllerPos = IntelLib.controllerPos(roomname);
	    let controllerId = IntelLib.controllerId(roomname);
	    if (controllerPos !== null && controllerId !== null) {
	        return new RoomPosition(controllerPos.x, controllerPos.y, controllerPos.roomName);
	    }
	    return null;
	}
	function getControllerWithId(target) {
	    return Game.getObjectById(target.substr(1).split("-")[1]);
	}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const _Military = __webpack_require__(55);
	const _Targeting = __webpack_require__(56);
	const PositionLib = __webpack_require__(46);
	const IntelLib = __webpack_require__(5);
	const DamageLib = __webpack_require__(63);
	const Logger_1 = __webpack_require__(7);
	(function (State) {
	    State[State["Standby"] = 1] = "Standby";
	    State[State["MovingToTargetRoom"] = 2] = "MovingToTargetRoom";
	    State[State["Defending"] = 3] = "Defending";
	    State[State["WaitingForSupport"] = 4] = "WaitingForSupport";
	    State[State["RunHomeForHeal"] = 5] = "RunHomeForHeal";
	    State[State["WaitingForWarrior"] = 6] = "WaitingForWarrior";
	})(exports.State || (exports.State = {}));
	var State = exports.State;
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Standby);
	    }
	    let hasHealed = healIfNeeded(creep);
	    switch (creep.getState()) {
	        case State.Standby:
	            runStandby(creep);
	            break;
	        case State.MovingToTargetRoom:
	            runMovingToTargetRoom(creep);
	            break;
	        case State.Defending:
	            if (!hasHealed) {
	                creep.heal(creep);
	            }
	            runDefending(creep);
	            break;
	        case State.WaitingForSupport:
	            runWaitingForSupport(creep);
	            break;
	        case State.WaitingForWarrior:
	            runWaitingForWarrior(creep);
	            break;
	        case State.RunHomeForHeal:
	            runRunHomeForHeal(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Standby);
	            break;
	    }
	}
	exports.run = run;
	;
	function runStandby(creep) {
	    let targetRoom = getTargetRoom(creep);
	    if (targetRoom !== undefined) {
	        creep.setState(State.MovingToTargetRoom);
	        runMovingToTargetRoom(creep);
	        return;
	    }
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false }, true);
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function runMovingToTargetRoom(creep) {
	    let targetRoom = getTargetRoom(creep);
	    let supporter = getSupporter(creep);
	    let warrior = getWarrior(creep);
	    if (targetRoom === undefined) {
	        creep.setState(State.Standby);
	        return;
	    }
	    if (targetRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
	        _Military.rangedAttackToEnemiesAround(creep);
	        if ((supporter === undefined || creep.pos.getRangeTo(supporter) < 2 || supporter.pos.roomName !== creep.pos.roomName) &&
	            (warrior === undefined || creep.pos.getRangeTo(warrior) < 4 || warrior.pos.roomName !== creep.pos.roomName)) {
	            creep.travelToRoom(targetRoom, { allowHostile: false });
	        }
	        return;
	    }
	    Logger_1.log.info("Defender starting to defend outpost", creep.room.name);
	    creep.setState(State.Defending);
	    runDefending(creep);
	}
	function runDefending(creep) {
	    if (IntelLib.isOwned(creep.pos.roomName)) {
	        let targetRoom = getTargetRoom(creep);
	        if (creep.pos.roomName === targetRoom) {
	            creep.memory.target = undefined;
	            creep.setState(State.Standby);
	            return;
	        }
	        creep.setState(State.MovingToTargetRoom);
	        return;
	    }
	    if (creep.getActiveBodyparts(RANGED_ATTACK) === 0) {
	        if (getWarrior(creep) !== undefined) {
	            if (creep.room.name !== creep.getHomeroom()) {
	                creep.room.memory.undefendable = Game.time + 5000;
	                creep.memory.target = undefined;
	                Logger_1.log.alert("Defender tags room as undefendable", creep.room.name);
	            }
	            creep.setState(State.Standby);
	        }
	        else {
	            creep.setState(State.WaitingForWarrior);
	            runWaitingForWarrior(creep);
	            Logger_1.log.alert("Defender needs warrior to defend outpost", creep.room.name);
	        }
	        return;
	    }
	    let targetEnemy = getTargetEnemy(creep);
	    let supporter = getSupporter(creep);
	    if (Game.time % 5 === 0 || targetEnemy === undefined) {
	        targetEnemy = getNewTargetEnemy(creep);
	        if (targetEnemy instanceof Creep && supporter === undefined) {
	            let enemyStats = DamageLib.getStatsForCreep(targetEnemy);
	            let creepStats = DamageLib.getStatsForCreep(creep);
	            if (enemyStats.rpt > creepStats.hpt * 3 || enemyStats.hpt > creepStats.rpt) {
	                Logger_1.log.alert("Defender needs warrior to defend outpost", creep.room.name);
	                creep.setState(State.WaitingForWarrior);
	                runWaitingForWarrior(creep);
	                return;
	            }
	            if (enemyStats.rpt > creepStats.hpt) {
	                Logger_1.log.alert("Defender needs supporter to defend outpost", creep.room.name);
	                creep.setState(State.WaitingForSupport);
	                runWaitingForSupport(creep);
	                return;
	            }
	        }
	        if (targetEnemy === undefined) {
	            setRoomAsSafe(creep);
	            if (creep.memory.cooldown === undefined) {
	                creep.memory.cooldown = 30;
	            }
	            else if (creep.memory.cooldown > 0) {
	                creep.memory.cooldown--;
	            }
	            else {
	                creep.memory.cooldown = undefined;
	                creep.setState(State.Standby);
	            }
	            return;
	        }
	    }
	    if (supporter === undefined || creep.pos.getRangeTo(supporter) < 4) {
	        let wantedRange = 3;
	        if (targetEnemy instanceof Creep && targetEnemy.getActiveBodyparts(ATTACK) === 0 && targetEnemy.getActiveBodyparts(RANGED_ATTACK) === 0) {
	            wantedRange = 1;
	        }
	        else if (targetEnemy instanceof Structure) {
	            wantedRange = 2;
	        }
	        if (!_Military.kiteAndAttack(creep, targetEnemy, wantedRange)) {
	            _Military.rangedAttackToEnemiesAround(creep);
	        }
	    }
	    else {
	        _Military.rangedAttackToEnemiesAround(creep);
	    }
	}
	function runWaitingForSupport(creep) {
	    let supporter = getSupporter(creep);
	    if (supporter !== undefined) {
	        creep.setState(State.MovingToTargetRoom);
	        Logger_1.log.alert("Defender has gotten supporter and returns defending", creep.room.name);
	        return;
	    }
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false });
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function runWaitingForWarrior(creep) {
	    let warrior = getWarrior(creep);
	    let supporter = getSupporter(creep);
	    if (warrior !== undefined && supporter !== undefined) {
	        creep.setState(State.MovingToTargetRoom);
	        Logger_1.log.alert("Defender has gotten warrior and returns defending", creep.room.name);
	        return;
	    }
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false });
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function runRunHomeForHeal(creep) {
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false });
	        return;
	    }
	    if (creep.missingHits() === 0) {
	        creep.setState(State.Standby);
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function getTargetRoom(creep) {
	    let targetRoom = creep.memory.target;
	    return targetRoom;
	}
	function healIfNeeded(creep) {
	    if (creep.getActiveBodyparts(HEAL) < 1) {
	        return true;
	    }
	    let supporter = getSupporter(creep);
	    let warrior = getWarrior(creep);
	    let lowestHp = creep;
	    if (supporter !== undefined && creep.pos.getRangeTo(supporter) < 4 && supporter.missingHits() > lowestHp.missingHits()) {
	        lowestHp = supporter;
	    }
	    if (warrior !== undefined && creep.pos.getRangeTo(warrior) < 4 && warrior.missingHits() > lowestHp.missingHits()) {
	        lowestHp = warrior;
	    }
	    if (lowestHp.missingHits() > 0) {
	        creep.heal(lowestHp);
	        return true;
	    }
	    return false;
	}
	function getNewTargetEnemy(creep) {
	    let newTarget = _Targeting.getPrioritizedTargetIncludingVitalBuildings(creep);
	    if (newTarget === null) {
	        creep.memory.targetEnemy = undefined;
	        return undefined;
	    }
	    creep.memory.targetEnemy = newTarget.id;
	    return newTarget;
	}
	function getTargetEnemy(creep) {
	    let targetEnemy = Game.getObjectById(creep.memory.targetEnemy);
	    if (targetEnemy === null) {
	        return undefined;
	    }
	    return targetEnemy;
	}
	function setRoomAsSafe(creep) {
	    IntelLib.saveIntelForRoom(creep.room);
	    creep.memory.target = undefined;
	}
	function getSupporter(creep) {
	    let supporter = Game.getObjectById(creep.memory.supporter);
	    if (supporter === null) {
	        creep.memory.supporter = undefined;
	        return undefined;
	    }
	    return supporter;
	}
	function getWarrior(creep) {
	    let warrior = Game.getObjectById(creep.memory.warrior);
	    if (warrior === null) {
	        creep.memory.warrior = undefined;
	        return undefined;
	    }
	    return warrior;
	}


/***/ }),
/* 63 */
/***/ (function(module, exports) {

	"use strict";
	function getStatsForCreep(creep) {
	    let stats = { mpt: 0, rpt: 0, hpt: 0, dpt: 0 };
	    for (let p of creep.body) {
	        let boost = 1;
	        if (p.boost !== undefined) {
	            if (p.boost.length === 5) {
	                boost = 4;
	            }
	            else if (p.boost.length === 4) {
	                boost = 3;
	            }
	            else if (p.boost.length === 2) {
	                boost = 2;
	            }
	        }
	        switch (p.type) {
	            case ATTACK:
	                stats.mpt += (ATTACK_POWER * boost);
	                break;
	            case RANGED_ATTACK:
	                stats.rpt += (RANGED_ATTACK_POWER * boost);
	                break;
	            case HEAL:
	                stats.hpt += (HEAL_POWER * boost);
	                break;
	            case WORK:
	                stats.dpt += (DISMANTLE_POWER * boost);
	                break;
	        }
	    }
	    return stats;
	}
	exports.getStatsForCreep = getStatsForCreep;
	function getStatsForCreepBody(body) {
	    let stats = { mpt: 0, rpt: 0, hpt: 0, dpt: 0 };
	    for (let p of body) {
	        let boost = 1;
	        switch (p) {
	            case ATTACK:
	                stats.mpt += (ATTACK_POWER * boost);
	                break;
	            case RANGED_ATTACK:
	                stats.rpt += (RANGED_ATTACK_POWER * boost);
	                break;
	            case HEAL:
	                stats.hpt += (HEAL_POWER * boost);
	                break;
	            case WORK:
	                stats.dpt += (DISMANTLE_POWER * boost);
	                break;
	        }
	    }
	    return stats;
	}
	exports.getStatsForCreepBody = getStatsForCreepBody;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const OutpostDefender_1 = __webpack_require__(62);
	const _Military = __webpack_require__(55);
	const _Common = __webpack_require__(34);
	const PositionLib = __webpack_require__(46);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Standby"] = 1] = "Standby";
	    State[State["FollowingDefender"] = 2] = "FollowingDefender";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Standby);
	    }
	    let hasHealed = healIfNeeded(creep);
	    switch (creep.getState()) {
	        case State.Standby:
	            runStandby(creep);
	            break;
	        case State.FollowingDefender:
	            if (!hasHealed) {
	                creep.heal(creep);
	            }
	            runFollowingDefender(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Standby);
	            break;
	    }
	}
	exports.run = run;
	;
	function runFollowingDefender(creep) {
	    let defender = getDefender(creep);
	    if (defender === undefined) {
	        creep.setState(State.Standby);
	        return;
	    }
	    if (defender.getState() == OutpostDefender_1.State.Standby) {
	        creep.setState(State.Standby);
	        return;
	    }
	    let targetEnemy = getTargetEnemy(defender);
	    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) <= 3) {
	        creep.rangedAttack(targetEnemy);
	    }
	    else {
	        _Military.rangedAttackToEnemiesAround(creep);
	    }
	    if (creep.pos.getRangeTo(defender) === 1) {
	        creep.moveTo(defender.pos, { ignoreCreeps: true });
	    }
	    else {
	        creep.travelTo(defender);
	    }
	}
	function runStandby(creep) {
	    let defender = getDefender(creep);
	    if (defender === undefined) {
	        defender = findDefenderToHeal(creep);
	    }
	    if (defender !== undefined) {
	        let state = defender.getState();
	        if (state !== OutpostDefender_1.State.Standby) {
	            creep.setState(State.FollowingDefender);
	            runFollowingDefender(creep);
	            return;
	        }
	    }
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false });
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function healIfNeeded(creep) {
	    if (creep.getActiveBodyparts(HEAL) < 1) {
	        return true;
	    }
	    let defender = getDefender(creep);
	    let warrior = getWarrior(creep);
	    let lowestHp = creep;
	    if (defender !== undefined && creep.pos.getRangeTo(defender) < 4 && defender.missingHits() > lowestHp.missingHits()) {
	        lowestHp = defender;
	    }
	    if (warrior !== undefined && creep.pos.getRangeTo(warrior) < 4 && warrior.missingHits() > lowestHp.missingHits()) {
	        lowestHp = warrior;
	    }
	    if (lowestHp.missingHits() > 0) {
	        creep.heal(lowestHp);
	        return true;
	    }
	    return false;
	}
	function getDefender(creep) {
	    let defender = Game.getObjectById(creep.memory.defender);
	    if (defender === null) {
	        creep.memory.defender = undefined;
	        return undefined;
	    }
	    return defender;
	}
	function getWarrior(creep) {
	    let defender = Game.getObjectById(creep.memory.defender);
	    if (defender === null) {
	        creep.memory.defender = undefined;
	        return undefined;
	    }
	    let warrior = Game.getObjectById(defender.memory.warrior);
	    if (warrior === null) {
	        return undefined;
	    }
	    return warrior;
	}
	function getTargetEnemy(defender) {
	    let targetEnemy = Game.getObjectById(defender.memory.targetEnemy);
	    if (targetEnemy === null) {
	        return undefined;
	    }
	    return targetEnemy;
	}
	function findDefenderToHeal(creep) {
	    let defenders = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
	            return c.memory.role === role_1.Role.OutpostDefender && c.memory.supporter === undefined;
	        } });
	    if (defenders.length > 0) {
	        creep.memory.defender = defenders[0].id;
	        defenders[0].memory.supporter = creep.id;
	        return defenders[0];
	    }
	    return undefined;
	}


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const OutpostDefender_1 = __webpack_require__(62);
	const _Common = __webpack_require__(34);
	const PositionLib = __webpack_require__(46);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Standby"] = 1] = "Standby";
	    State[State["FollowingDefender"] = 2] = "FollowingDefender";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Standby);
	    }
	    switch (creep.getState()) {
	        case State.Standby:
	            runStandby(creep);
	            break;
	        case State.FollowingDefender:
	            runFollowingDefender(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Standby);
	            break;
	    }
	}
	exports.run = run;
	;
	function runFollowingDefender(creep) {
	    let defender = getDefender(creep);
	    if (defender === undefined) {
	        creep.setState(State.Standby);
	        return;
	    }
	    if (defender.getState() == OutpostDefender_1.State.Standby) {
	        creep.setState(State.Standby);
	        return;
	    }
	    let targetEnemy = getTargetEnemy(defender);
	    if (creep.getActiveBodyparts(ATTACK) === 0) {
	        creep.moveTo(defender);
	    }
	    else if (targetEnemy !== undefined && targetEnemy.pos.roomName === creep.pos.roomName && defender.pos.roomName === creep.pos.roomName) {
	        if (creep.pos.getRangeTo(targetEnemy) === 1) {
	            creep.moveTo(targetEnemy.pos, { ignoreCreeps: true });
	        }
	        else {
	            creep.moveTo(targetEnemy);
	        }
	    }
	    else {
	        creep.travelTo(defender);
	    }
	    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) === 1) {
	        creep.say("Yeeha!");
	        creep.attack(targetEnemy);
	    }
	}
	function runStandby(creep) {
	    let defender = getDefender(creep);
	    if (defender === undefined) {
	        defender = findDefenderToHeal(creep);
	    }
	    if (defender !== undefined) {
	        let state = defender.getState();
	        if (state !== OutpostDefender_1.State.Standby) {
	            creep.setState(State.FollowingDefender);
	            runFollowingDefender(creep);
	            return;
	        }
	    }
	    let homeroom = creep.getHomeroom();
	    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { allowHostile: false });
	        return;
	    }
	    _Common.moveOffRoad(creep);
	}
	function getDefender(creep) {
	    let defender = Game.getObjectById(creep.memory.defender);
	    if (defender === null) {
	        creep.memory.defender = undefined;
	        return undefined;
	    }
	    return defender;
	}
	function getTargetEnemy(defender) {
	    let targetEnemy = Game.getObjectById(defender.memory.targetEnemy);
	    if (targetEnemy === null) {
	        return undefined;
	    }
	    return targetEnemy;
	}
	function findDefenderToHeal(creep) {
	    let defenders = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
	            return c.memory.role === role_1.Role.OutpostDefender && c.memory.warrior === undefined;
	        } });
	    if (defenders.length > 0) {
	        creep.memory.defender = defenders[0].id;
	        defenders[0].memory.warrior = creep.id;
	        return defenders[0];
	    }
	    return undefined;
	}


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const OperationHaul = __webpack_require__(67);
	const OperationGuard = __webpack_require__(68);
	const operationtypes_1 = __webpack_require__(15);
	function addOperation(operation) {
	    if (Memory.operations === undefined) {
	        Memory.operations = [];
	    }
	    Memory.operations.push(operation);
	}
	function roomIsReceiveingHaulOperation(roomName) {
	    if (Memory.operations === undefined) {
	        Memory.operations = [];
	    }
	    if (Memory.operations.length === 0) {
	        return false;
	    }
	    for (let o of Memory.operations) {
	        if (o.active && o.operationtype === operationtypes_1.OperationType.Haul && o.to === roomName) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.roomIsReceiveingHaulOperation = roomIsReceiveingHaulOperation;
	function roomIsHavingActiveGuardOperation(roomName) {
	    if (Memory.operations === undefined) {
	        Memory.operations = [];
	    }
	    if (Memory.operations.length === 0) {
	        return false;
	    }
	    for (let o of Memory.operations) {
	        if (o.active && o.operationtype === operationtypes_1.OperationType.Guard && o.targetRoom === roomName) {
	            return true;
	        }
	    }
	    return false;
	}
	exports.roomIsHavingActiveGuardOperation = roomIsHavingActiveGuardOperation;
	function createGuardOutpostOperation(room, targetRoom) {
	    let op = new OperationGuard.Data();
	    op.operationtype = operationtypes_1.OperationType.Guard;
	    op.room = room.name;
	    op.targetRoom = targetRoom;
	    op.victoryCondition = OperationGuard.VictoryCondition.Gametime;
	    op.victoryValue = Game.time + 8000;
	    addOperation(op);
	    console.log("Starting a operation from room " + room.name + " to guard outpost " + targetRoom + ", because it is wanted as outpost.");
	    return true;
	}
	exports.createGuardOutpostOperation = createGuardOutpostOperation;
	function createCrisisHaulOperation(roomName, allRooms) {
	    let provider = findCrisisHaulProvider(roomName, allRooms);
	    if (provider === undefined) {
	        return false;
	    }
	    let op = new OperationHaul.Data();
	    op.operationtype = operationtypes_1.OperationType.Haul;
	    op.from = provider.name;
	    op.to = roomName;
	    if (provider.controller !== undefined && provider.controller.level > 6) {
	        op.amount = 20;
	    }
	    else {
	        op.amount = 10;
	    }
	    op.victoryCondition = OperationHaul.VictoryCondition.Gametime;
	    op.victoryValue = Game.time + 5000;
	    addOperation(op);
	    console.log("Starting a crisisconvoy from room " + provider + " to room " + roomName + ", supplying 20 energy a tick.");
	    return true;
	}
	exports.createCrisisHaulOperation = createCrisisHaulOperation;
	function findCrisisHaulProvider(roomName, providers) {
	    let provider = undefined;
	    for (let r of providers) {
	        if (roomName !== r.name && Game.map.getRoomLinearDistance(roomName, r.name) < 5) {
	            if (r.storage !== undefined && r.storage.store[RESOURCE_ENERGY] > 100000) {
	                if (provider === undefined || provider.storage === undefined ||
	                    r.storage.store[RESOURCE_ENERGY] > provider.storage.store[RESOURCE_ENERGY]) {
	                    provider = r;
	                }
	            }
	        }
	    }
	    if (provider !== undefined) {
	        return provider;
	    }
	}
	exports.findCrisisHaulProvider = findCrisisHaulProvider;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const operationtypes_1 = __webpack_require__(15);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const ProfileUtilities = __webpack_require__(19);
	const PathfindingUtilities = __webpack_require__(3);
	(function (VictoryCondition) {
	    VictoryCondition[VictoryCondition["RoomLevel"] = 1] = "RoomLevel";
	    VictoryCondition[VictoryCondition["Gametime"] = 2] = "Gametime";
	})(exports.VictoryCondition || (exports.VictoryCondition = {}));
	var VictoryCondition = exports.VictoryCondition;
	class Data {
	    constructor() {
	        this.operationtype = operationtypes_1.OperationType.Haul;
	        this.active = true;
	    }
	}
	exports.Data = Data;
	function run(operation, creepService, pri) {
	    if (pri === _Manager_1.ManagerPriority.Low) {
	        if (Game.time % 50 === 0) {
	            checkHaulerAmount(operation, creepService);
	        }
	    }
	}
	exports.run = run;
	function victoryConditionReached(operation) {
	    let toRoom = Game.rooms[operation.to];
	    if (!(toRoom instanceof Room)) {
	        return false;
	    }
	    switch (operation.victoryCondition) {
	        case VictoryCondition.RoomLevel:
	            if (toRoom.controller !== undefined && toRoom.controller.level >= operation.victoryValue) {
	                operation.active = false;
	                return true;
	            }
	            break;
	        case VictoryCondition.Gametime:
	            if (Game.time > operation.victoryValue) {
	                operation.active = false;
	                return true;
	            }
	    }
	    return false;
	}
	exports.victoryConditionReached = victoryConditionReached;
	function checkHaulerAmount(operation, creepService) {
	    let fromRoom = Game.rooms[operation.from];
	    if (!(fromRoom instanceof Room) || fromRoom.storage === undefined) {
	        return;
	    }
	    let maxTier = ProfileUtilities.getMaxTierOffroadHauler(fromRoom.energyCapacityAvailable);
	    if (operation.haulersNeeded === undefined) {
	        let toRoom = Game.rooms[operation.to];
	        let toPos = new RoomPosition(25, 25, operation.to);
	        if (toRoom instanceof Room && toRoom.storage !== undefined) {
	            toPos = toRoom.storage.pos;
	        }
	        let distance = PathfindingUtilities.getDistanseBetween(fromRoom.storage.pos, toPos);
	        let tiersNeeded = (operation.amount * distance * 2 / 50);
	        operation.haulersNeeded = Math.ceil(tiersNeeded / maxTier);
	    }
	    let current = creepService.getCreeps(role_1.Role.OperationHauler, operation.to, operation.from).length;
	    let ordered = OrdersRepository.getCreepsInQueue(fromRoom, role_1.Role.OperationHauler, operation.to);
	    if (current + ordered < operation.haulersNeeded) {
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getOffroadHaulerBody(maxTier);
	        order.priority = priority_1.Priority.Low;
	        order.memory = { role: role_1.Role.OperationHauler, target: operation.to, tier: maxTier };
	        OrdersRepository.orderCreep(fromRoom, order);
	    }
	}


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const operationtypes_1 = __webpack_require__(15);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const ProfileUtilities = __webpack_require__(19);
	(function (VictoryCondition) {
	    VictoryCondition[VictoryCondition["Gametime"] = 1] = "Gametime";
	})(exports.VictoryCondition || (exports.VictoryCondition = {}));
	var VictoryCondition = exports.VictoryCondition;
	class Data {
	    constructor() {
	        this.operationtype = operationtypes_1.OperationType.Guard;
	        this.active = true;
	    }
	}
	exports.Data = Data;
	function run(operation, creepService, pri) {
	    if (pri === _Manager_1.ManagerPriority.Low) {
	        if (Game.time % 50 === 0) {
	            orderUnitsIfNeeded(operation, creepService);
	        }
	    }
	}
	exports.run = run;
	function victoryConditionReached(operation) {
	    switch (operation.victoryCondition) {
	        case VictoryCondition.Gametime:
	            if (Game.time > operation.victoryValue + 10000) {
	                operation.active = false;
	                return true;
	            }
	    }
	    return false;
	}
	exports.victoryConditionReached = victoryConditionReached;
	function orderUnitsIfNeeded(operation, creepService) {
	    if (Game.time > operation.victoryValue) {
	        return;
	    }
	    let spawnRoom = Game.rooms[operation.room];
	    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
	        return;
	    }
	    if (operation.unitType === undefined) {
	        if (_.random(1, 10) > 5) {
	            operation.unitType = role_1.Role.Ranger;
	        }
	        else {
	            operation.unitType = role_1.Role.Paladin;
	        }
	    }
	    if (spawnRoom.storage === undefined || spawnRoom.storage.store[RESOURCE_ENERGY] < 20000) {
	        return;
	    }
	    if (operation.lastOrder !== undefined && operation.lastOrder + 1500 > Game.time) {
	        return;
	    }
	    let current = creepService.getCreeps(operation.unitType, operation.targetRoom, spawnRoom.name).length;
	    let ordered = OrdersRepository.getCreepsInQueue(spawnRoom, operation.unitType, operation.targetRoom);
	    if (current + ordered === 0) {
	        operation.lastOrder = Game.time;
	        switch (operation.unitType) {
	            case role_1.Role.Ranger:
	                orderRanger(spawnRoom, operation.targetRoom);
	                break;
	            case role_1.Role.Paladin:
	                orderPaladin(spawnRoom, operation.targetRoom);
	                break;
	            default:
	                break;
	        }
	    }
	    if (spawnRoom.controller === undefined || spawnRoom.controller.level < 8) {
	        return;
	    }
	    let otherType = role_1.Role.Paladin;
	    if (operation.unitType === otherType) {
	        otherType = role_1.Role.Ranger;
	    }
	    current = creepService.getCreeps(otherType, operation.targetRoom, spawnRoom.name).length;
	    ordered = OrdersRepository.getCreepsInQueue(spawnRoom, otherType, operation.targetRoom);
	    if (current + ordered === 0) {
	        switch (otherType) {
	            case role_1.Role.Ranger:
	                orderRanger(spawnRoom, operation.targetRoom);
	                break;
	            case role_1.Role.Paladin:
	                orderPaladin(spawnRoom, operation.targetRoom);
	                break;
	            default:
	                break;
	        }
	    }
	    if (spawnRoom.controller === undefined || spawnRoom.controller.level < 8) {
	        return;
	    }
	}
	function orderRanger(spawnRoom, targetRoom) {
	    let maxTier = ProfileUtilities.getMaxTierRanger(spawnRoom.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getRangerBody(maxTier);
	    order.priority = priority_1.Priority.Important;
	    order.memory = { role: role_1.Role.Ranger, target: targetRoom, tier: maxTier };
	    OrdersRepository.orderCreep(spawnRoom, order);
	}
	function orderPaladin(spawnRoom, targetRoom) {
	    let maxTier = ProfileUtilities.getMaxTierPaladin(spawnRoom.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getPaladinBody(maxTier);
	    order.priority = priority_1.Priority.Important;
	    order.memory = { role: role_1.Role.Paladin, target: targetRoom, tier: maxTier };
	    OrdersRepository.orderCreep(spawnRoom, order);
	}


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const SourceUtilities = __webpack_require__(70);
	const OrdersRepository = __webpack_require__(18);
	const MineralMiner = __webpack_require__(71);
	const MineralHauler = __webpack_require__(72);
	const _Manager_1 = __webpack_require__(14);
	const IntelLib = __webpack_require__(5);
	const Order_1 = __webpack_require__(20);
	const RoomRepository = __webpack_require__(10);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	class MineralManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("MineralManager");
	        this.hasRun = false;
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 50 < Game.time) {
	                let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                this.mineMinerals(rooms);
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	                this.hasRun = true;
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.MineralMiner, MineralMiner.run);
	            this.creepService.runCreeps(role_1.Role.MineralHauler, MineralHauler.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 20 < Game.time) {
	                let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                this.mineMinerals(rooms);
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	    }
	    mineMinerals(rooms) {
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town) {
	                if (room.memory.miningMinerals) {
	                    let mineral = room.getMineral();
	                    if (mineral !== undefined && room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
	                        _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
	                        this.orderMineralMiner(room);
	                        this.orderMineralHauler(room, mineral);
	                    }
	                }
	                else {
	                    prepareMineralMining(room);
	                }
	            }
	            let lairs = RoomRepository.getLairOutposts(room);
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City && (lairs.length > 0 || room.memory.praiseroom !== undefined)) {
	                let mineralOutposts = lairs;
	                if (room.memory.praiseroomHibernated !== true) {
	                    mineralOutposts = lairs.concat(room.memory.praiseroom);
	                }
	                for (let outpost of mineralOutposts) {
	                    let outpostRoom = Game.rooms[outpost];
	                    if (!IntelLib.hasInvaders(outpost) && outpostRoom !== undefined &&
	                        (outpostRoom.controller === undefined || outpostRoom.controller.level > 5)) {
	                        let mineral = outpostRoom.getMineral();
	                        if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
	                            room.storage !== undefined && (room.storage.store[mineral.mineralType] == undefined || room.storage.store[mineral.mineralType] < 250000) &&
	                            _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
	                            if (mineral.hasMiningContainer() && mineral.hasExtractor()) {
	                                this.orderSKMineralMiner(room, mineral);
	                                this.orderMineralHauler(room, mineral);
	                            }
	                            else {
	                                prepareExternalMineralMining(mineral);
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	    orderMineralMiner(room) {
	        let target = room.getMineral();
	        if (target === undefined || target.ticksToRegeneration !== undefined) {
	            return;
	        }
	        if (!target.hasMiningContainer()) {
	            return;
	        }
	        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralMiner, target.id).length;
	        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralMiner, target.id);
	        let maxCount = 1;
	        if (orderedWorkers + currentWorkers >= maxCount) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.MineralMiner, target: target.id, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderMineralHauler(room, mineral) {
	        if (mineral === undefined) {
	            return;
	        }
	        let container = mineral.getMiningContainer();
	        if (container === null || _.sum(container.store) === 0) {
	            return;
	        }
	        let target = mineral.room.name + "-" + mineral.id;
	        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralHauler, target).length;
	        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralHauler, target);
	        if (orderedWorkers + currentWorkers >= 1) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let neededTiers = SourceUtilities.getTiersRequiredForMineralHauling(mineral, room);
	        let usedTier = Math.min(maxTier, Math.max(neededTiers, 2));
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getHaulerBody(usedTier);
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.MineralHauler, target: target, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderSKMineralMiner(room, mineral) {
	        let target = mineral;
	        if (target === undefined || target.ticksToRegeneration !== undefined) {
	            return;
	        }
	        if (!target.hasMiningContainer()) {
	            return;
	        }
	        let currentWorkers = this.creepService.getCreeps(role_1.Role.MineralMiner, target.id).length;
	        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.MineralMiner, target.id);
	        let maxCount = 1;
	        if (orderedWorkers + currentWorkers >= maxCount) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierStationaryWorker(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getStationaryWorkerBody(maxTier);
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.MineralMiner, target: target.id, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.MineralManager = MineralManager;
	function prepareMineralMining(room) {
	    let mineral = room.getMineral();
	    if (mineral) {
	        let structsAtMineral = mineral.pos.lookFor(LOOK_STRUCTURES);
	        if (structsAtMineral.length > 0 && structsAtMineral[0].structureType === STRUCTURE_EXTRACTOR) {
	            let extractor = structsAtMineral[0];
	            if (extractor.my) {
	                room.memory.miningMinerals = true;
	            }
	            else {
	                extractor.destroy();
	            }
	        }
	        else {
	            mineral.buildMiningContainer();
	            mineral.buildExtractor();
	        }
	    }
	}
	function prepareExternalMineralMining(mineral) {
	    if (mineral.room.memory.isPraiseRoom && mineral.room.controller !== undefined && mineral.room.controller.my && mineral.room.controller.level >= 6) {
	        mineral.buildExtractor();
	    }
	    if (mineral && !mineral.hasMiningContainer()) {
	        mineral.buildMiningContainer();
	    }
	}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const roomlevel_1 = __webpack_require__(11);
	const RoomRepository = __webpack_require__(10);
	const IntelLib = __webpack_require__(5);
	function getTiersRequiredForPioneerMining(tier, possibleMiningPositions, spawnPos, sourcePos) {
	    const ticksToFill = 25;
	    let distance = PathfindingUtilities.getDistanseBetween(spawnPos, sourcePos);
	    let workerpartsNeeded = 5;
	    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
	    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
	    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
	    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
	    return workerpartsNeededWithTravel;
	}
	exports.getTiersRequiredForPioneerMining = getTiersRequiredForPioneerMining;
	function getTiersRequiredForDistanceMining(source, spawn, tier) {
	    const ticksToFill = 25;
	    let energyPerTick = (source.energyCapacity / 300);
	    let workerpartsNeeded = energyPerTick / 2;
	    let possibleMiningPositions = getNumberOfPossibleMiningPositions(source);
	    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
	    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
	    let distance = PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos);
	    let timeUsedForMining = ticksToFill / (ticksToFill + (distance * 2));
	    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
	    return workerpartsNeededWithTravel;
	}
	exports.getTiersRequiredForDistanceMining = getTiersRequiredForDistanceMining;
	function getWorkerPartsRequiredForContainerMining(tier) {
	    let energyPerTick = 10;
	    let workerpartsNeeded = (energyPerTick / 2);
	    let possibleMiningPositions = 3;
	    let possibleWorkerpartsWithTier = possibleMiningPositions * tier;
	    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsWithTier);
	    return workerpartsPossbleAtSource;
	}
	exports.getWorkerPartsRequiredForContainerMining = getWorkerPartsRequiredForContainerMining;
	function getRequiredEnergyHaulers(room, maxTier) {
	    let spawn = room.getSpawn();
	    if (spawn === undefined) {
	        return 0;
	    }
	    let energyDistancePerHauler = maxTier * 50;
	    let energyDistance = 0;
	    let sourcesInRoom = getAllSourcesInRoom(room);
	    for (let source of sourcesInRoom) {
	        let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, source.pos);
	        energyDistance += 10 * distance;
	    }
	    let outposts = RoomRepository.getBasicOutposts(room);
	    for (let outpost of outposts) {
	        if (IntelLib.hasIntel(outpost)) {
	            for (let sourceId of IntelLib.sourceIds(outpost)) {
	                let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, IntelLib.sourcePos(outpost, sourceId));
	                energyDistance += 10 * distance;
	            }
	        }
	    }
	    let lairs = RoomRepository.getLairOutposts(room);
	    for (let outpost of lairs) {
	        if (IntelLib.hasIntel(outpost)) {
	            for (let sourceId of IntelLib.sourceIds(outpost)) {
	                let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, IntelLib.sourcePos(outpost, sourceId));
	                energyDistance += 16 * distance;
	            }
	        }
	    }
	    return Math.ceil(energyDistance / energyDistancePerHauler);
	}
	exports.getRequiredEnergyHaulers = getRequiredEnergyHaulers;
	function getTiersRequiredForContainerHauling(sourcePos, homeRoom, sourceSize) {
	    let storage = homeRoom.storage;
	    let spawn = homeRoom.getSpawn();
	    if (storage === undefined && spawn !== undefined) {
	        storage = spawn;
	    }
	    if (storage === undefined) {
	        console.log("No spawn or storage found for containerhaulers homeroom.");
	        return 0;
	    }
	    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, sourcePos);
	    let energyPerTick = Math.ceil(sourceSize / 300);
	    let timeUsedForRoundtrip = (distance * 2);
	    let energyPerTrip = timeUsedForRoundtrip * energyPerTick;
	    if (RoomRepository.getRoomLevel(homeRoom) < roomlevel_1.RoomLevel.CivilizedColony) {
	        energyPerTrip = energyPerTrip + 30;
	    }
	    return Math.ceil(1.2 * energyPerTrip / 100);
	}
	exports.getTiersRequiredForContainerHauling = getTiersRequiredForContainerHauling;
	function getTiersRequiredForMineralHauling(mineral, homeRoom) {
	    let storage = homeRoom.storage;
	    let spawn = homeRoom.getSpawn();
	    if (storage === undefined && spawn !== undefined) {
	        storage = spawn;
	    }
	    if (storage === undefined) {
	        console.log("No spawn or storage found for mineralhaulers homeroom.");
	        return 0;
	    }
	    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, mineral.pos);
	    let mineralsPerTick = 4;
	    let timeUsedForRoundtrip = (distance * 2);
	    let mineralsPerTrip = timeUsedForRoundtrip * mineralsPerTick;
	    return Math.ceil(1.2 * mineralsPerTrip / 100);
	}
	exports.getTiersRequiredForMineralHauling = getTiersRequiredForMineralHauling;
	function getTiersRequiredForOutpostDistanceMining(sourcePos, energyCap, spawn, tier, possibleMiningPositions, distance) {
	    const ticksToFill = 25;
	    let energyPerTick = (energyCap / 300);
	    let workerpartsNeeded = energyPerTick / 2;
	    let possibleWorkerpartsAtOnceWithTier = possibleMiningPositions * tier;
	    let workerpartsPossbleAtSource = Math.min(workerpartsNeeded, possibleWorkerpartsAtOnceWithTier);
	    if (sourcePos === spawn.pos) {
	        console.log("Should never happend");
	    }
	    let timeUsedForMining = ticksToFill / (ticksToFill + (2 * distance));
	    let workerpartsNeededWithTravel = Math.ceil(workerpartsPossbleAtSource / timeUsedForMining);
	    return workerpartsNeededWithTravel;
	}
	exports.getTiersRequiredForOutpostDistanceMining = getTiersRequiredForOutpostDistanceMining;
	function getNumberOfPossibleMiningPositions(source) {
	    let count = 0;
	    for (let x = -1; x < 2; x++) {
	        for (let y = -1; y < 2; y++) {
	            let position = new RoomPosition(source.pos.x + x, source.pos.y + y, source.room.name);
	            if (!(position.x === source.pos.x && position.y === source.pos.y)) {
	                let atPosition = position.lookFor(LOOK_TERRAIN);
	                if (atPosition[0] === "swamp" || atPosition[0] === "plain") {
	                    count++;
	                }
	            }
	        }
	    }
	    return count;
	}
	exports.getNumberOfPossibleMiningPositions = getNumberOfPossibleMiningPositions;
	function getAllMinedSources(rooms) {
	    let minedSources = [];
	    for (let i = 0; i < rooms.length; i++) {
	        minedSources = minedSources.concat(getAllSourcesInRoom(rooms[i]));
	    }
	    return minedSources;
	}
	exports.getAllMinedSources = getAllMinedSources;
	function getAllSourcesInRoom(room) {
	    return room.find(FIND_SOURCES);
	}
	exports.getAllSourcesInRoom = getAllSourcesInRoom;
	function getDistanceToSource(room, source) {
	    let saved = source.getDistanceFrom(room.name);
	    if (saved === undefined) {
	        let spawn = room.getSpawn();
	        if (spawn === undefined) {
	            return 50;
	        }
	        let distance = PathfindingUtilities.getDistanseBetween(spawn.pos, source.pos);
	        source.setDistanceFrom(room.name, distance);
	        return distance;
	    }
	    return saved;
	}
	function getSourcesNeedingHauling(room) {
	    let sources = [];
	    for (let source of getAllSourcesInRoom(room)) {
	        let container = source.getMiningContainer();
	        if (container instanceof StructureContainer) {
	            let distanceFromBase = getDistanceToSource(room, source);
	            let limit = 1400 - (distanceFromBase * 16);
	            if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
	                sources.push(source);
	            }
	        }
	    }
	    let outposts = RoomRepository.getBasicOutposts(room);
	    for (let outpost of outposts) {
	        if (Game.rooms[outpost] !== undefined) {
	            for (let source of getAllSourcesInRoom(Game.rooms[outpost])) {
	                let container = source.getMiningContainer();
	                if (container instanceof StructureContainer) {
	                    let distanceFromBase = getDistanceToSource(room, source);
	                    let limit = 1400 - (distanceFromBase * 16);
	                    if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
	                        sources.push(source);
	                    }
	                }
	            }
	        }
	    }
	    let lairs = RoomRepository.getLairOutposts(room);
	    for (let outpost of lairs) {
	        if (Game.rooms[outpost] !== undefined) {
	            for (let source of getAllSourcesInRoom(Game.rooms[outpost])) {
	                let container = source.getMiningContainer();
	                if (container instanceof StructureContainer) {
	                    let distanceFromBase = getDistanceToSource(room, source);
	                    let limit = 1400 - (distanceFromBase * 28);
	                    if (container.store[RESOURCE_ENERGY] > Math.max(limit, 100)) {
	                        sources.push(source);
	                    }
	                }
	            }
	        }
	    }
	    return _.shuffle(_.map(sources, function (c) { return c.id; }));
	}
	exports.getSourcesNeedingHauling = getSourcesNeedingHauling;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	function run(creep) {
	    if (creep.memory.targetRoom === undefined) {
	        let mineral = Game.getObjectById(creep.memory.target);
	        if (mineral !== null) {
	            creep.memory.targetRoom = mineral.room.name;
	        }
	    }
	    if (_Common.stayAwayFromSourceKeeper(creep, 20, 6)) {
	        return;
	    }
	    if (Game.time % 2 === 0) {
	        let mineral = Game.getObjectById(creep.memory.target);
	        if (!(mineral instanceof Mineral)) {
	            _Common.moveOffRoad(creep);
	            return;
	        }
	        if (creep.pos.getRangeTo(mineral.pos) > 1) {
	            creep.moveTo(mineral);
	        }
	    }
	    if (Game.time % 6 === 0) {
	        let mineral = Game.getObjectById(creep.memory.target);
	        if (!(mineral instanceof Mineral)) {
	            _Common.moveOffRoad(creep);
	            return;
	        }
	        if (mineral instanceof Mineral && (mineral.mineralAmount === 0 || mineral.mineralAmount === undefined)) {
	            creep.suicide();
	        }
	        if (creep.carryCapacity > _.sum(creep.carry)) {
	            let response = creep.harvest(mineral);
	            if (response === OK) {
	                if (Memory.stats['mineralmined.' + mineral.mineralType] === undefined) {
	                    Memory.stats['mineralmined.' + mineral.mineralType] = 0;
	                }
	                Memory.stats['mineralmined.' + mineral.mineralType] += creep.getActiveBodyparts(WORK);
	            }
	        }
	    }
	    if (Game.time % 6 === 1 || creep.ticksToLive < 3) {
	        if (creep.memory.container === undefined) {
	            setMyContainer(creep);
	            if (creep.memory.container === undefined) {
	                return;
	            }
	        }
	        if (creep.memory.mineralType === undefined) {
	            setMyMineralType(creep);
	            if (creep.memory.mineralType === undefined) {
	                return;
	            }
	        }
	        let container = Game.getObjectById(creep.memory.container);
	        if (container === null) {
	            creep.memory.container = undefined;
	            return;
	        }
	        if (creep.pos.getRangeTo(container) > 0) {
	            creep.moveTo(container);
	        }
	        creep.transfer(container, creep.memory.mineralType);
	    }
	}
	exports.run = run;
	function setMyMineralType(creep) {
	    let mineral = Game.getObjectById(creep.memory.target);
	    if (!(mineral instanceof Mineral)) {
	        return;
	    }
	    creep.memory.mineralType = mineral.mineralType;
	}
	function setMyContainer(creep) {
	    let mineral = Game.getObjectById(creep.memory.target);
	    if (!(mineral instanceof Mineral)) {
	        return;
	    }
	    let container = mineral.getMiningContainer();
	    if (!(container instanceof StructureContainer)) {
	        return;
	    }
	    creep.memory.container = container.id;
	}


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const PathfindingUtilities = __webpack_require__(3);
	function run(creep) {
	    if (_Common.moveHomeAndHealIfHurt(creep)) {
	        return;
	    }
	    if (creep.memory.targetRoom === undefined) {
	        getTargetRoom(creep);
	    }
	    if (creep.memory.targetMineral === undefined) {
	        getTargetMineral(creep);
	    }
	    if (creep.memory.dropof === undefined) {
	        setMyDropof(creep);
	    }
	    if (!creep.isTanking() && _.sum(creep.carry) === 0) {
	        creep.startTanking();
	        checkIfOutdated(creep);
	    }
	    if (creep.isTanking() && _.sum(creep.carry) === creep.carryCapacity) {
	        creep.stopTanking();
	        setOutdatedTick(creep);
	        setMyDropof(creep);
	    }
	    if (creep.isTanking() && _Common.targetRoomHasInvaders(creep, creep.memory.targetRoom)) {
	        return;
	    }
	    if (_Common.stayAwayFromSourceKeeper(creep)) {
	        return;
	    }
	    if (creep.isTanking()) {
	        let container = Game.getObjectById(creep.memory.container);
	        let mineral = Game.getObjectById(creep.memory.targetMineral);
	        if (mineral === null) {
	            return;
	        }
	        if (container === null) {
	            if (creep.room.name === creep.memory.targetRoom) {
	                if (!setMyContainer(creep)) {
	                    return;
	                }
	            }
	            else {
	                creep.travelTo(mineral);
	                return;
	            }
	        }
	        let resource = mineral.mineralType;
	        if (container == null) {
	            return;
	        }
	        if (container.store[RESOURCE_ENERGY] > 0) {
	            resource = RESOURCE_ENERGY;
	        }
	        let response = creep.withdraw(container, resource);
	        if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
	            creep.travelTo(container);
	        }
	        else if (response === ERR_NOT_ENOUGH_RESOURCES && resource !== RESOURCE_ENERGY) {
	            creep.stopTanking();
	        }
	    }
	    else {
	        let storage = Game.getObjectById(creep.memory.dropof);
	        if (!(storage instanceof Structure)) {
	            setMyDropof(creep);
	        }
	        let carried = Object.keys(creep.carry);
	        if (carried.length === 1 && creep.carry[RESOURCE_ENERGY] === 0) {
	            return;
	        }
	        let resource = carried[1];
	        if (creep.carry[RESOURCE_ENERGY] > 0) {
	            resource = RESOURCE_ENERGY;
	        }
	        let response = creep.transfer(storage, resource);
	        if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
	            creep.travelTo(storage);
	        }
	        else if (response === ERR_FULL) {
	            setMyDropof(creep);
	        }
	        else if (response === OK) {
	            let container = Game.getObjectById(creep.memory.container);
	            if (container instanceof StructureContainer) {
	                creep.travelTo(container);
	            }
	            else {
	                creep.travelToRoom(creep.memory.targetRoom);
	            }
	        }
	    }
	}
	exports.run = run;
	function setMyContainer(creep) {
	    let container = Game.getObjectById(creep.memory.targetMineral).getMiningContainer();
	    if (container === null) {
	        return false;
	    }
	    creep.memory.container = container.id;
	    return true;
	}
	function setMyDropof(creep) {
	    let room = Game.rooms[creep.memory.homeroom];
	    if (room.storage !== undefined) {
	        creep.memory.dropof = room.storage.id;
	        return;
	    }
	    if (room.terminal !== undefined) {
	        creep.memory.dropof = room.terminal.id;
	        return;
	    }
	    creep.memory.dropof = "";
	    console.log("MineralHauler without a dropof: " + creep.name + " - " + creep.room.name);
	}
	function getTargetRoom(creep) {
	    creep.memory.targetRoom = creep.memory.target.split("-")[0];
	}
	function getTargetMineral(creep) {
	    creep.memory.targetMineral = creep.memory.target.split("-")[1];
	}
	function setOutdatedTick(creep) {
	    if (creep.memory.outdatedTick !== undefined) {
	        return;
	    }
	    let storage = Game.rooms[creep.memory.homeroom].storage;
	    let container = Game.getObjectById(creep.memory.container);
	    if (storage === undefined) {
	        let spawn = creep.room.getSpawn();
	        if (spawn === undefined) {
	            return;
	        }
	        storage = spawn;
	    }
	    if (storage.pos === undefined || container === null || container.pos === undefined) {
	        return;
	    }
	    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, container.pos);
	    creep.memory.outdatedTick = Math.ceil((distance * 2) * 1.2);
	}
	function checkIfOutdated(creep) {
	    if (creep.memory.outdatedTick === undefined) {
	        return false;
	    }
	    if (creep.memory.outdatedTick > creep.ticksToLive) {
	        creep.suicide();
	        return true;
	    }
	    return false;
	}


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const _Targeting = __webpack_require__(56);
	const SKGuard = __webpack_require__(74);
	const SKHealer = __webpack_require__(75);
	const RampartDefender = __webpack_require__(76);
	const BaseRanger = __webpack_require__(77);
	const ProfileUtilities = __webpack_require__(19);
	const WallLib = __webpack_require__(78);
	const Threat_1 = __webpack_require__(79);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const Logger_1 = __webpack_require__(7);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	class DefenseManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("DefenseManager");
	        this.MEMORY_LASTRUN_SIEGE = "lastRunSiege";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            this.creepService.runCreeps(role_1.Role.BaseRanger, BaseRanger.run);
	            this.creepService.runCreeps(role_1.Role.RampartDefender, RampartDefender.run);
	            let normalRooms = this.roomService.getNormalRoomsNotAbandoned();
	            for (let room of normalRooms) {
	                this.setDefConLevel(room);
	                controlTowers(room);
	            }
	            let praiseRooms = this.roomService.getPraiseRooms();
	            for (let room of praiseRooms) {
	                controlTowers(room);
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.SKGuard, SKGuard.run);
	            this.creepService.runCreeps(role_1.Role.SKHealer, SKHealer.run);
	            let lastRunSiege = this.getValue(this.MEMORY_LASTRUN_SIEGE);
	            if (lastRunSiege === undefined || lastRunSiege + 50 < Game.time) {
	                let rooms = this.roomService.getNormalUnderSiege();
	                for (let room of rooms) {
	                    this.orderRangersFromNeighbours(room);
	                }
	                this.setValue(this.MEMORY_LASTRUN_SIEGE, Game.time);
	            }
	        }
	    }
	    orderRangersFromNeighbours(room) {
	        if (room.memory.defcon < 2) {
	            return;
	        }
	        let allRooms = this.roomService.getNormalRooms();
	        for (let r of allRooms) {
	            if (r.name !== room.name && !r.isUnderSiege() && r.storage !== undefined && r.storage.store[RESOURCE_ENERGY] > 30000) {
	                let d = Game.map.getRoomLinearDistance(room.name, r.name);
	                if (d < 6) {
	                    this.orderRangerForSiegedRoom(r, room);
	                    this.orderPaladinForSiegedRoom(r, room);
	                    return;
	                }
	            }
	        }
	    }
	    orderRangerForSiegedRoom(room, target) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Ranger, target.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.Ranger, target.name, null).length;
	        if (ordered + spawned >= 1 || ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getRangerBody(maxTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.Ranger, target: target.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderPaladinForSiegedRoom(room, target) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Paladin, target.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.Paladin, target.name, null).length;
	        if (ordered + spawned >= 1 || ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierPaladin(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getPaladinBody(maxTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.Paladin, target: target.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    setDefConLevel(room) {
	        if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 30000) {
	            room.memory.defcon = undefined;
	            return;
	        }
	        let currentLevel = room.memory.defcon;
	        if ((Game.time + RoomRepository.getIndex(room)) % 5 === 0 || currentLevel !== undefined) {
	            let hostileCreeps = _Targeting.findHostileCreepsInRoom(room);
	            if (hostileCreeps.length === 0 && (room.memory.defconset + 200) < Game.time) {
	                room.memory.defcon = undefined;
	                room.memory.threat = undefined;
	                if (currentLevel !== undefined) {
	                    Logger_1.log.info("Enemies seems to have disappeared: Defcon level for the room removed", room.name);
	                }
	            }
	            else if (hostileCreeps.length > 0) {
	                for (let creep of hostileCreeps) {
	                    if (creep.owner.username !== "Invader" && creep.body.length > 1) {
	                        if (currentLevel < 3 && creepIsInsideBorderWall(creep)) {
	                            setDefConLevelToAtLeast(room, 3);
	                        }
	                        else if (currentLevel < 2 && creepLooksHostile(creep)) {
	                            setDefConLevelToAtLeast(room, 2);
	                        }
	                        else if (currentLevel == undefined) {
	                            setDefConLevelToAtLeast(room, 1);
	                        }
	                    }
	                }
	            }
	            if (room.memory.defcon !== undefined) {
	                if (room.memory.threat === undefined || (room.memory.threat.tick !== undefined && (room.memory.threat.tick + 10) < Game.time)) {
	                    setThreatLevels(room);
	                    safemodeCheck(room);
	                    this.runDefcon(room, room.memory.defcon);
	                }
	            }
	        }
	    }
	    runDefcon(room, defcon) {
	        let threat = room.memory.threat;
	        if (threat === undefined) {
	            console.log("Somehow running defcon ordering without having a threat? Room " + room.name + " - DefCon " + defcon);
	            return;
	        }
	        if (defcon === 1 && room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) {
	            this.orderBaseRanger(room, 1);
	        }
	        else if (defcon === 2) {
	            this.orderRampartDefender(room, 1);
	            let rangers = Math.min(3, Math.ceil(threat.healThreat / 40));
	            this.orderBaseRanger(room, rangers);
	            if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 50000) {
	                return;
	            }
	        }
	        else if (defcon === 3) {
	            this.orderRampartDefender(room, 2);
	            let rangers = Math.min(3, Math.ceil(threat.healThreat / 25));
	            this.orderBaseRanger(room, rangers);
	            if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 50000) {
	                return;
	            }
	            this.orderProtector(room);
	        }
	    }
	    orderBaseRanger(room, maxCount) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseRanger, room.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.BaseRanger, room.name).length;
	        if (ordered + spawned >= maxCount || ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierBaseRanger(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getBaseRangerBody(maxTier);
	        order.priority = priority_1.Priority.Critical;
	        order.memory = { role: role_1.Role.BaseRanger, target: room.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderRampartDefender(room, maxCount) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.RampartDefender, room.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.RampartDefender, room.name).length;
	        if (ordered + spawned >= maxCount || ordered > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierRogue(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getRogueBody(maxTier);
	        order.priority = priority_1.Priority.Critical;
	        order.memory = { role: role_1.Role.RampartDefender, target: room.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderProtector(room, boosted = false) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Protector, room.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.Protector, room.name).length;
	        if (ordered + spawned >= 1) {
	            return;
	        }
	        let boost = undefined;
	        if (boosted) {
	            boost = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
	        }
	        let maxTier = ProfileUtilities.getMaxTierProtector(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getProtectorBody(maxTier);
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.Protector, target: room.name, tier: maxTier, boost: boost };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.DefenseManager = DefenseManager;
	function safemodeCheck(room) {
	    if (room.controller !== undefined && room.controller.safeModeCooldown === undefined) {
	        let basePos = RoomRepository.getBasePosition(room);
	        if (basePos === undefined) {
	            return;
	        }
	        let enemies = room.getHostileCreeps();
	        let middlePos = new RoomPosition(basePos.x, basePos.y + 2, basePos.roomName);
	        for (let c of enemies) {
	            if (c.pos.getRangeTo(middlePos) < 4) {
	                room.controller.activateSafeMode();
	                Game.notify("Room " + room.name + " was set in safe mode because enemies are inside the base.");
	                Logger_1.log.alert("The room was set in safe mode because enemies are inside the base.", room.name);
	            }
	        }
	    }
	}
	function creepLooksHostile(creep) {
	    return creep.body.length > 20 && creep.body[0].boost !== undefined &&
	        (creep.getActiveBodyparts(ATTACK) > 10 || creep.getActiveBodyparts(RANGED_ATTACK) > 10 || creep.getActiveBodyparts(HEAL) > 10);
	}
	function creepIsInsideBorderWall(creep) {
	    return creep.pos.x > 2 && creep.pos.x < 47 && creep.pos.y > 2 && creep.pos.y < 47 && creepHasFreePathToStorage(creep);
	}
	function creepHasFreePathToStorage(creep) {
	    let target = creep.room.storage;
	    if (target === undefined) {
	        return false;
	    }
	    if (creep.room.memory.borderwall === undefined) {
	        return false;
	    }
	    let wallpositions = _.map(JSON.parse(creep.room.memory.borderwall), (p) => WallLib.longPos(p, creep.room.name));
	    let costMatrix = WallLib.getBorderwallRoomCallback(wallpositions);
	    let ret = PathFinder.search(creep.pos, { pos: target.pos, range: 1 }, {
	        plainCost: 1,
	        swampCost: 1,
	        roomCallback: () => costMatrix,
	        maxRooms: 1,
	    });
	    for (let p of ret.path) {
	        for (let wallP of wallpositions) {
	            if (p.x === wallP.x && p.y === wallP.y) {
	                return false;
	            }
	        }
	    }
	    return true;
	}
	function setDefConLevelToAtLeast(room, level) {
	    if (room.memory.defcon === undefined || room.memory.defcon < level) {
	        Game.notify("Room " + room.name + " has raised DefCon level to " + level + ".");
	        Logger_1.log.alert("Warning: Defcon raised to level " + level, room.name);
	        room.memory.defcon = level;
	        room.memory.defconset = Game.time;
	    }
	}
	function controlTowers(room) {
	    if (room.isUnderSiege()) {
	        let injuredCreep = getInjuredCreep(room, true);
	        if (injuredCreep !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                healTargetCreep(tower, injuredCreep);
	            }
	            return;
	        }
	        let priTarget = Game.getObjectById(room.memory.priTarget);
	        if (priTarget !== null) {
	            room.memory.priTarget = undefined;
	        }
	        if (priTarget !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                shootHostileCreep(tower, priTarget);
	            }
	            return;
	        }
	        let hostileCreep = getHostileCreepNotAtBorder(room);
	        if (hostileCreep !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                if (tower.pos.getRangeTo(hostileCreep) < 10 || tower.energy > tower.energyCapacity / 2) {
	                    shootHostileCreep(tower, hostileCreep);
	                }
	            }
	            return;
	        }
	        let injuredCreepSecondary = getInjuredCreep(room);
	        if (injuredCreepSecondary !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                healTargetCreep(tower, injuredCreepSecondary);
	            }
	            return;
	        }
	        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
	            let structureNeedingRepair = getStructureNeedingRepair(room);
	            if (structureNeedingRepair !== null && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.CivilizedColony) {
	                let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	                for (let tower of towersInRoom) {
	                    repairStructure(tower, structureNeedingRepair);
	                }
	                return;
	            }
	        }
	    }
	    else if (room.memory.towerSleep === undefined || Game.time >= room.memory.towerSleep) {
	        let hostileCreep = getHostileCreepNotAtBorder(room);
	        if (hostileCreep !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                shootHostileCreep(tower, hostileCreep);
	            }
	            return;
	        }
	        let injuredCreep = getInjuredCreep(room);
	        if (injuredCreep !== null) {
	            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	            for (let tower of towersInRoom) {
	                healTargetCreep(tower, injuredCreep);
	            }
	            return;
	        }
	        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
	            let structureNeedingRepair = getStructureNeedingRepair(room);
	            if (structureNeedingRepair !== null && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.CivilizedColony) {
	                let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
	                for (let tower of towersInRoom) {
	                    repairStructure(tower, structureNeedingRepair);
	                }
	                return;
	            }
	        }
	        room.memory.towerSleep = Game.time + 10;
	    }
	}
	function setThreatLevels(room) {
	    let hostiles = _Targeting.findHostileCreepsInRoom(room);
	    let threat = new Threat_1.Threat();
	    for (let c of hostiles) {
	        let tempTough = 0;
	        let tempRanged = 0;
	        let tempWork = 0;
	        let tempHeal = 0;
	        let tempAttack = 0;
	        for (let b of c.body) {
	            if (b.type === TOUGH) {
	                if (b.boost === undefined) {
	                    threat.toughThreat += 1;
	                }
	                else if (b.boost === RESOURCE_CATALYZED_GHODIUM_ALKALIDE) {
	                    threat.toughThreat += 5;
	                    tempTough += 3;
	                }
	                else if (b.boost === RESOURCE_GHODIUM_ALKALIDE) {
	                    threat.toughThreat += 3;
	                    tempTough += 1;
	                }
	                else if (b.boost === RESOURCE_GHODIUM_OXIDE) {
	                    threat.toughThreat += 2;
	                }
	            }
	            else if (b.type === RANGED_ATTACK) {
	                if (b.boost === undefined) {
	                    threat.rangedThreat += 1;
	                }
	                else if (b.boost === RESOURCE_CATALYZED_KEANIUM_ALKALIDE) {
	                    threat.rangedThreat += 5;
	                    tempRanged += 3;
	                }
	                else if (b.boost === RESOURCE_KEANIUM_ALKALIDE) {
	                    threat.rangedThreat += 3;
	                    tempRanged += 1;
	                }
	                else if (b.boost === RESOURCE_KEANIUM_OXIDE) {
	                    threat.rangedThreat += 2;
	                }
	            }
	            else if (b.type === HEAL && b.boost !== undefined) {
	                if (b.boost === undefined) {
	                    threat.healThreat += 1;
	                }
	                else if (b.boost === RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE) {
	                    threat.healThreat += 5;
	                    tempHeal += 3;
	                }
	                else if (b.boost === RESOURCE_LEMERGIUM_ALKALIDE) {
	                    threat.healThreat += 3;
	                    tempHeal += 1;
	                }
	                else if (b.boost === RESOURCE_LEMERGIUM_OXIDE) {
	                    threat.healThreat += 2;
	                }
	            }
	            else if (b.type === ATTACK && b.boost !== undefined) {
	                if (b.boost === undefined) {
	                    threat.attackThreat += 1;
	                }
	                else if (b.boost === RESOURCE_CATALYZED_UTRIUM_ACID) {
	                    threat.attackThreat += 5;
	                    tempAttack += 3;
	                }
	                else if (b.boost === RESOURCE_UTRIUM_ACID) {
	                    threat.attackThreat += 3;
	                    tempAttack += 1;
	                }
	                else if (b.boost === RESOURCE_UTRIUM_HYDRIDE) {
	                    threat.attackThreat += 2;
	                }
	            }
	            else if (b.type === WORK && b.boost !== undefined) {
	                if (b.boost === undefined) {
	                    threat.workThreat += 1;
	                }
	                else if (b.boost === RESOURCE_CATALYZED_ZYNTHIUM_ACID) {
	                    threat.workThreat += 5;
	                    tempWork += 3;
	                }
	                else if (b.boost === RESOURCE_ZYNTHIUM_ACID) {
	                    threat.workThreat += 3;
	                    tempWork += 1;
	                }
	                else if (b.boost === RESOURCE_ZYNTHIUM_HYDRIDE) {
	                    threat.workThreat += 2;
	                }
	            }
	        }
	        threat.boostedTough = Math.max(tempTough, threat.boostedTough);
	        threat.boostedRanged = Math.max(tempRanged, threat.boostedRanged);
	        threat.boostedWork = Math.max(tempWork, threat.boostedWork);
	        threat.boostedHeal = Math.max(tempHeal, threat.boostedHeal);
	        threat.boostedAttack = Math.max(tempAttack, threat.boostedAttack);
	    }
	    room.memory.threat = threat;
	}
	function getHostileCreepNotAtBorder(room) {
	    if (room.memory.attack !== undefined) {
	        let target = Game.getObjectById(room.memory.attack);
	        if (target instanceof Creep) {
	            return target;
	        }
	        else {
	            room.memory.attack = undefined;
	        }
	    }
	    let hostileCreeps = room.getHostileCreepsNotAtBorder();
	    if (hostileCreeps.length > 0) {
	        if (room.storage === undefined) {
	            return hostileCreeps[0];
	        }
	        return room.storage.pos.findClosestByRange(hostileCreeps);
	    }
	    return null;
	}
	function shootHostileCreep(tower, creep) {
	    if (tower.energy >= 10) {
	        tower.attack(creep);
	        return true;
	    }
	    return false;
	}
	function getInjuredCreep(room, isUnderSiege = false) {
	    if (isUnderSiege) {
	        let unitsInNeed = room.find(FIND_MY_CREEPS, { filter: function (c) {
	                return (c.hits < (c.hitsMax - 400));
	            } });
	        if (unitsInNeed.length > 0) {
	            return unitsInNeed[0];
	        }
	        return null;
	    }
	    else {
	        let unitsInNeed = room.find(FIND_MY_CREEPS, { filter: function (c) {
	                return (c.hits < c.hitsMax);
	            } });
	        if (unitsInNeed.length > 0) {
	            return unitsInNeed[0];
	        }
	        return null;
	    }
	}
	function healTargetCreep(tower, creep) {
	    if (tower.energy >= 10) {
	        tower.heal(creep);
	        return true;
	    }
	    return false;
	}
	function getStructureNeedingRepair(room) {
	    let structuresInNeed = room.find(FIND_STRUCTURES, { filter: function (s) {
	            return (s.structureType === STRUCTURE_RAMPART && s.hits < 1000) || (s.structureType === STRUCTURE_WALL && s.hits < 100);
	        } });
	    if (structuresInNeed.length > 0) {
	        return structuresInNeed[0];
	    }
	    return null;
	}
	function repairStructure(tower, structure) {
	    if (tower.energy >= 10) {
	        tower.repair(structure);
	        return true;
	    }
	    return false;
	}


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const PositionLib = __webpack_require__(46);
	const IntelLib = __webpack_require__(5);
	function run(creep) {
	    let targetRoom = creep.memory.target;
	    let targetPos = undefined;
	    if (creep.memory.targetPos !== undefined && creep.memory.targetPos.x !== undefined) {
	        targetPos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
	    }
	    let targetKeeper = Game.getObjectById(creep.memory.targetKeeper);
	    let healer = Game.getObjectById(creep.memory.healer);
	    let targetLair = Game.getObjectById(creep.memory.targetLair);
	    if (targetRoom === undefined) {
	        console.log("SKGuard " + creep.name + " has no target room.");
	        return;
	    }
	    if (healer === null) {
	        if (creep.getHomeroom() !== creep.room.name) {
	            if (creep.ticksToLive > 200) {
	                console.log(creep.room.name + ": SKGuard missing SKHealer, removing unit: " + creep.name + " ticksLeft: " + creep.ticksToLive);
	            }
	            creep.suicide();
	            return;
	        }
	        _Common.moveOffRoad(creep);
	        return;
	    }
	    else if (!creep.pos.inRangeTo(healer.pos, 1) && creep.pos.x > 1 && creep.pos.x < 48 && creep.pos.y > 1 && creep.pos.y < 48) {
	        if (Game.time % 3 === 0) {
	            creep.moveTo(healer);
	        }
	        return;
	    }
	    if (targetRoom !== creep.room.name) {
	        if (healer.fatigue > 0) {
	            return;
	        }
	        if (targetPos !== undefined) {
	            creep.travelTo({ pos: targetPos }, { allowSK: true, ignoreRoads: true });
	            if (creep.pos.getRangeTo(healer) === 1) {
	                healer.moveTo(creep, { ignoreCreeps: true });
	            }
	        }
	        else {
	            creep.travelToRoom(targetRoom, { allowSK: true });
	            if (creep.pos.getRangeTo(healer) === 1) {
	                healer.moveTo(creep, { ignoreCreeps: true });
	            }
	        }
	        return;
	    }
	    if (targetKeeper === null || Game.time % 5 === 0) {
	        targetKeeper = getKeeperTarget(creep);
	    }
	    if (targetKeeper !== null) {
	        let range = creep.pos.getRangeTo(targetKeeper);
	        if (range < 4) {
	            let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
	            if (nearby.length > 1) {
	                creep.rangedMassAttack();
	            }
	            else {
	                creep.rangedAttack(targetKeeper);
	            }
	        }
	        if (range > 1 && healer.fatigue === 0) {
	            creep.moveTo(targetKeeper.pos, { costCallback: getBorderCallback });
	            if (creep.pos.getRangeTo(healer) === 1) {
	                healer.moveTo(creep);
	            }
	        }
	        else {
	            creep.attack(targetKeeper);
	            if (healer.fatigue === 0) {
	                creep.moveTo(targetKeeper.pos, { ignoreCreeps: true, costCallback: getBorderCallback });
	                if (creep.pos.getRangeTo(healer) === 1) {
	                    healer.moveTo(creep, { ignoreCreeps: true });
	                }
	            }
	        }
	        return;
	    }
	    if (targetLair === null || (targetLair !== null && (targetLair.ticksToSpawn === undefined || targetLair.ticksToSpawn > 200))) {
	        targetLair = getNextLairSpawning(creep);
	    }
	    if (targetLair !== null && creep.pos.getRangeTo(targetLair) > 1 && healer.fatigue === 0) {
	        creep.travelTo(targetLair, { allowSK: true, ignoreCreeps: false });
	        if (creep.pos.getRangeTo(healer) === 1) {
	            healer.moveTo(creep, { ignoreCreeps: true });
	        }
	    }
	    if (targetLair === null && healer.fatigue === 0) {
	        if (creep.room.name !== targetRoom || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	            creep.travelTo({ pos: new RoomPosition(25, 25, targetRoom) }, { allowSK: true, ignoreCreeps: false });
	            if (creep.pos.getRangeTo(healer) === 1) {
	                healer.moveTo(creep, { ignoreCreeps: true });
	            }
	        }
	    }
	}
	exports.run = run;
	;
	function getBorderCallback(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    for (let c = 0; c < 50; c++) {
	        costs.set(c, 0, 20);
	        costs.set(c, 49, 20);
	        if (c > 0 && c < 49) {
	            costs.set(0, c, 20);
	            costs.set(49, c, 20);
	        }
	    }
	    room.find(FIND_CREEPS).forEach(function (creep) {
	        costs.set(creep.pos.x, creep.pos.y, 0xff);
	    });
	    return costs;
	}
	function getKeeperTarget(creep) {
	    if (IntelLib.hasInvaders(creep.room.name)) {
	        let closestInvader = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (c) => c.owner.username === "Invader" });
	        if (closestInvader instanceof Creep) {
	            creep.memory.targetKeeper = closestInvader.id;
	            creep.memory.targetPos = closestInvader.pos;
	            return closestInvader;
	        }
	    }
	    let closestDangerousCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
	    if (closestDangerousCreep instanceof Creep) {
	        creep.memory.targetKeeper = closestDangerousCreep.id;
	        creep.memory.targetPos = closestDangerousCreep.pos;
	        return closestDangerousCreep;
	    }
	    else {
	        creep.memory.targetKeeper = undefined;
	        return null;
	    }
	}
	function getNextLairSpawning(creep) {
	    let allSpawningLairs = creep.room.find(FIND_HOSTILE_STRUCTURES, {
	        filter: function (s) {
	            return s.structureType === STRUCTURE_KEEPER_LAIR && s.ticksToSpawn !== undefined && s.ticksToSpawn > 0;
	        }
	    });
	    if (allSpawningLairs === undefined || allSpawningLairs.length === 0) {
	        creep.memory.targetPos = undefined;
	        creep.memory.targetLair = undefined;
	        return null;
	    }
	    let lair = allSpawningLairs[0];
	    for (let l of allSpawningLairs) {
	        if (lair.ticksToSpawn !== undefined && l.ticksToSpawn !== undefined &&
	            l.ticksToSpawn < lair.ticksToSpawn) {
	            lair = l;
	        }
	    }
	    creep.memory.targetPos = lair.pos;
	    creep.memory.targetLair = lair.id;
	    return lair;
	}


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const role_1 = __webpack_require__(16);
	const _Common = __webpack_require__(34);
	function run(creep) {
	    let targetToHeal = Game.getObjectById(creep.memory.targetToHeal);
	    if (targetToHeal === null) {
	        targetToHeal = findTargetToHeal(creep);
	        if (targetToHeal === null) {
	            if (creep.getHomeroom() !== creep.room.name) {
	                if (creep.ticksToLive > 200) {
	                    console.log(creep.room.name + ": SKHealer missing SKGuard, removing unit: " + creep.name + " ticksLeft: " + creep.ticksToLive);
	                }
	                creep.suicide();
	                return;
	            }
	            healIfNeeded(creep, creep);
	            _Common.moveOffRoad(creep);
	            return;
	        }
	    }
	    if (creep.pos.getRangeTo(targetToHeal.pos) > 1) {
	        creep.moveTo(targetToHeal);
	        healIfNeeded(creep, creep);
	        return;
	    }
	    if (creep.hits < 1000) {
	        healIfNeeded(creep, creep);
	    }
	    else if (creep.hitsMax - creep.hits >= targetToHeal.hitsMax - targetToHeal.hits) {
	        healIfNeeded(creep, creep);
	    }
	    else {
	        healIfNeeded(creep, targetToHeal);
	    }
	}
	exports.run = run;
	;
	function healIfNeeded(creep, target) {
	    if (target.hits < target.hitsMax) {
	        creep.heal(target);
	    }
	}
	function findTargetToHeal(creep) {
	    let targetsToHeal = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
	            return c.memory.role === role_1.Role.SKGuard && c.memory.healer === undefined && c.memory.token === creep.memory.token;
	        } });
	    if (targetsToHeal.length > 0) {
	        creep.memory.targetToHeal = targetsToHeal[0].id;
	        targetsToHeal[0].memory.healer = creep.id;
	        return targetsToHeal[0];
	    }
	    return null;
	}


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const PositionLib = __webpack_require__(46);
	const _Targeting = __webpack_require__(56);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToPosition"] = 2] = "MovingToPosition";
	    State[State["Attacking"] = 3] = "Attacking";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    if (creep.ticksToLive === 1498) {
	        setBoosting(creep);
	    }
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToPosition:
	            runMovingToPosition(creep);
	            break;
	        case State.Attacking:
	            runAttacking(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    let enemies = _Targeting.findHostileCreepsInRoom(creep.room);
	    for (let c of enemies) {
	        let rampartNextToEnemy = findRampartNextToEnemy(c);
	        if (rampartNextToEnemy !== undefined) {
	            creep.memory.targetEnemy = c.id;
	            creep.memory.rampart = rampartNextToEnemy.id;
	            creep.setState(State.MovingToPosition);
	            runMovingToPosition(creep);
	            return;
	        }
	    }
	    if (enemies.length > 0) {
	        let prioritizedTarget = _Targeting.getPrioritizedTarget(creep);
	        if (prioritizedTarget !== null) {
	            let distance = creep.pos.getRangeTo(prioritizedTarget.pos);
	            if (!PositionLib.positionIsBorder(prioritizedTarget.pos)) {
	                if (distance > 1) {
	                    creep.moveTo(prioritizedTarget, { maxRooms: 1 });
	                }
	                else {
	                    creep.moveTo(prioritizedTarget, { ignoreCreeps: true, maxRooms: 1 });
	                }
	            }
	            if (distance === 1) {
	                creep.attack(prioritizedTarget);
	            }
	            return;
	        }
	    }
	    _Common.moveOffRoad(creep);
	}
	function runMovingToPosition(creep) {
	    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart);
	    let enemy = Game.getObjectById(creep.memory.targetEnemy);
	    if (rampartNextToEnemy === null || enemy === null || rampartNextToEnemy.pos.getRangeTo(enemy) > 1) {
	        creep.memory.targetEnemy = undefined;
	        creep.memory.rampart = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    if (rampartNextToEnemy.pos.getRangeTo(creep) === 1) {
	        let rampartOccupiedBy = getCreepInPosition(rampartNextToEnemy.pos);
	        if (rampartOccupiedBy !== undefined) {
	            rampartOccupiedBy.moveTo(creep.pos);
	        }
	        creep.moveTo(rampartNextToEnemy);
	    }
	    else if (rampartNextToEnemy.pos.getRangeTo(creep) > 0) {
	        creep.moveTo(rampartNextToEnemy);
	    }
	    else {
	        creep.setState(State.Attacking);
	        runAttacking(creep);
	    }
	}
	function runAttacking(creep) {
	    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart);
	    let enemy = Game.getObjectById(creep.memory.targetEnemy);
	    if (rampartNextToEnemy === null || enemy === null) {
	        creep.memory.targetEnemy = undefined;
	        creep.memory.rampart = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    else if (rampartNextToEnemy.pos.getRangeTo(enemy) > 1) {
	        enemy = findEnemyNextToPosition(rampartNextToEnemy.pos);
	        if (enemy === null) {
	            creep.memory.targetEnemy = undefined;
	            creep.memory.rampart = undefined;
	            creep.setState(State.Waiting);
	            return;
	        }
	        creep.memory.targetEnemy = enemy.id;
	    }
	    creep.room.memory.priTarget = enemy.id;
	    creep.attack(enemy);
	}
	function setBoosting(creep) {
	    let threat = creep.room.memory.threat;
	    if (threat === undefined) {
	        return;
	    }
	    let boostLevelWanted = defendersShouldBoost(threat);
	    if (boostLevelWanted === 2 && hasMineralsForBoost(creep.room, 30, RESOURCE_CATALYZED_UTRIUM_ACID)) {
	        creep.memory.boost = [RESOURCE_CATALYZED_UTRIUM_ACID];
	    }
	    else if (boostLevelWanted > 0 && hasMineralsForBoost(creep.room, 30, RESOURCE_UTRIUM_HYDRIDE)) {
	        creep.memory.boost = [RESOURCE_UTRIUM_HYDRIDE];
	    }
	}
	function getCreepInPosition(pos) {
	    let creep = pos.lookFor(LOOK_CREEPS);
	    if (creep.length > 0) {
	        return creep[0];
	    }
	    return undefined;
	}
	function findRampartNextToEnemy(enemy) {
	    for (let x of _.range(enemy.pos.x - 1, enemy.pos.x + 2)) {
	        for (let y of _.range(enemy.pos.y - 1, enemy.pos.y + 2)) {
	            if (x > 0 && x < 49 && y > 0 && y < 49) {
	                let atPos = (new RoomPosition(x, y, enemy.pos.roomName)).lookFor(LOOK_STRUCTURES);
	                for (let s of atPos) {
	                    if (s.structureType === STRUCTURE_RAMPART) {
	                        return s;
	                    }
	                }
	            }
	        }
	    }
	}
	function findEnemyNextToPosition(pos) {
	    for (let x of _.range(pos.x - 1, pos.x + 2)) {
	        for (let y of _.range(pos.y - 1, pos.y + 2)) {
	            if (x > 0 && x < 49 && y > 0 && y < 49) {
	                let atPos = (new RoomPosition(x, y, pos.roomName)).lookFor(LOOK_CREEPS);
	                for (let s of atPos) {
	                    if (!s.my) {
	                        return s;
	                    }
	                }
	            }
	        }
	    }
	    return null;
	}
	function defendersShouldBoost(threat) {
	    if (threat.boostedTough < 15) {
	        return 0;
	    }
	    if (threat.boostedHeal < 15) {
	        return 0;
	    }
	    if (threat.boostedAttack < 15 && threat.boostedWork < 15) {
	        return 0;
	    }
	    if (threat.boostedTough < 40) {
	        return 1;
	    }
	    if (threat.boostedHeal < 40) {
	        return 1;
	    }
	    if (threat.boostedAttack < 40 && threat.boostedWork < 40) {
	        return 1;
	    }
	    return 2;
	}
	function hasMineralsForBoost(room, count, mineral) {
	    if (room.terminal === undefined || room.terminal.store[mineral] === undefined) {
	        return false;
	    }
	    return room.terminal.store[mineral] > (count * 30);
	}


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const _Targeting = __webpack_require__(56);
	const _Military = __webpack_require__(55);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToPosition"] = 2] = "MovingToPosition";
	    State[State["Attacking"] = 3] = "Attacking";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    if (creep.ticksToLive === 1498) {
	        setBoosting(creep);
	    }
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToPosition:
	            runMovingToPosition(creep);
	            break;
	        case State.Attacking:
	            runAttacking(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    let enemies = _Targeting.findHostileCreepsInRoom(creep.room);
	    for (let c of enemies) {
	        let rampartCloseToEnemy = findRampartCloseToEnemy(c);
	        if (rampartCloseToEnemy !== undefined) {
	            creep.memory.targetEnemy = c.id;
	            creep.memory.rampart = rampartCloseToEnemy.id;
	            creep.setState(State.MovingToPosition);
	            runMovingToPosition(creep);
	            return;
	        }
	    }
	    if (enemies.length > 0) {
	        let prioritizedTarget = _Targeting.getPrioritizedTarget(creep);
	        if (prioritizedTarget !== null) {
	            _Military.kiteAndAttack(creep, prioritizedTarget);
	            return;
	        }
	    }
	    _Common.moveOffRoad(creep);
	}
	function runMovingToPosition(creep) {
	    let rampartCloseToEnemy = Game.getObjectById(creep.memory.rampart);
	    let enemy = Game.getObjectById(creep.memory.targetEnemy);
	    if (rampartCloseToEnemy === null || enemy === null || rampartCloseToEnemy.pos.getRangeTo(enemy) > 3) {
	        creep.memory.targetEnemy = undefined;
	        creep.memory.rampart = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    if (creep.pos.getRangeTo(enemy) < 4) {
	        creep.rangedAttack(enemy);
	    }
	    else {
	        shootHostileCreeps(creep);
	    }
	    if (rampartCloseToEnemy.pos.getRangeTo(creep) === 1) {
	        let result = getCreepInPosition(rampartCloseToEnemy.pos);
	        if (result !== undefined) {
	            creep.memory.rampart = undefined;
	        }
	        creep.moveTo(rampartCloseToEnemy);
	    }
	    else if (rampartCloseToEnemy.pos.getRangeTo(creep) > 0) {
	        creep.moveTo(rampartCloseToEnemy);
	    }
	    else {
	        creep.setState(State.Attacking);
	        runAttacking(creep);
	    }
	}
	function runAttacking(creep) {
	    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart);
	    let enemy = Game.getObjectById(creep.memory.targetEnemy);
	    if (rampartNextToEnemy === null || enemy === null) {
	        creep.memory.targetEnemy = undefined;
	        creep.memory.rampart = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    else if (rampartNextToEnemy.pos.getRangeTo(enemy) > 3) {
	        enemy = findEnemyNextToPosition(rampartNextToEnemy.pos);
	        if (enemy === null) {
	            shootHostileCreeps(creep);
	            creep.memory.targetEnemy = undefined;
	            creep.memory.rampart = undefined;
	            creep.setState(State.Waiting);
	            return;
	        }
	        creep.memory.targetEnemy = enemy.id;
	    }
	    creep.rangedAttack(enemy);
	}
	function setBoosting(creep) {
	    let threat = creep.room.memory.threat;
	    if (threat === undefined) {
	        return;
	    }
	    let boostLevelWanted = defendersShouldBoost(threat);
	    if (boostLevelWanted === 2 && hasMineralsForBoost(creep.room, 30, RESOURCE_CATALYZED_KEANIUM_ALKALIDE)) {
	        creep.memory.boost = [RESOURCE_CATALYZED_KEANIUM_ALKALIDE];
	    }
	    else if (boostLevelWanted > 0 && hasMineralsForBoost(creep.room, 30, RESOURCE_KEANIUM_OXIDE)) {
	        creep.memory.boost = [RESOURCE_KEANIUM_OXIDE];
	    }
	}
	function shootHostileCreeps(creep) {
	    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);
	    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function (c) {
	        let atPos = c.pos.lookFor(LOOK_STRUCTURES);
	        for (let sAtPos of atPos) {
	            if (sAtPos.structureType === STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        return true;
	    });
	    if (closeDangerousCreepsNotOnRamparts.length > 0) {
	        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
	    }
	}
	function defendersShouldBoost(threat) {
	    if (threat.boostedTough < 15) {
	        return 0;
	    }
	    if (threat.boostedHeal < 15) {
	        return 0;
	    }
	    if (threat.boostedAttack < 15 && threat.boostedWork < 15) {
	        return 0;
	    }
	    if (threat.boostedTough < 40) {
	        return 1;
	    }
	    if (threat.boostedHeal < 40) {
	        return 1;
	    }
	    if (threat.boostedAttack < 40 && threat.boostedWork < 40) {
	        return 1;
	    }
	    return 2;
	}
	function hasMineralsForBoost(room, count, mineral) {
	    if (room.terminal === undefined || room.terminal.store[mineral] === undefined) {
	        return false;
	    }
	    return room.terminal.store[mineral] > (count * 30);
	}
	function getCreepInPosition(pos) {
	    let creep = pos.lookFor(LOOK_CREEPS);
	    if (creep.length > 0) {
	        return creep[0];
	    }
	    return undefined;
	}
	function findRampartCloseToEnemy(enemy) {
	    for (let x of _.range(enemy.pos.x - 3, enemy.pos.x + 4)) {
	        for (let y of _.range(enemy.pos.y - 3, enemy.pos.y + 4)) {
	            if (x > 0 && x < 49 && y > 0 && y < 49) {
	                let pos = new RoomPosition(x, y, enemy.pos.roomName);
	                if (pos.getRangeTo(enemy) > 1) {
	                    let atPos = pos.lookFor(LOOK_STRUCTURES);
	                    for (let s of atPos) {
	                        if (s.structureType === STRUCTURE_RAMPART) {
	                            let cAtPos = pos.lookFor(LOOK_CREEPS);
	                            if (cAtPos.length === 0) {
	                                return s;
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	}
	function findEnemyNextToPosition(pos) {
	    for (let x of _.range(pos.x - 3, pos.x + 4)) {
	        for (let y of _.range(pos.y - 3, pos.y + 4)) {
	            if (x > 0 && x < 49 && y > 0 && y < 49) {
	                let atPos = (new RoomPosition(x, y, pos.roomName)).lookFor(LOOK_CREEPS);
	                for (let s of atPos) {
	                    if (!s.my) {
	                        return s;
	                    }
	                }
	            }
	        }
	    }
	    return null;
	}


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomRepository = __webpack_require__(10);
	const roomlevel_1 = __webpack_require__(11);
	function desiredWallHitsForRoom(room) {
	    let roomlevel = RoomRepository.getRoomLevel(room);
	    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
	        if (roomlevel >= roomlevel_1.RoomLevel.City) {
	            return 100000;
	        }
	        else {
	            return 20000;
	        }
	    }
	    if (roomlevel >= roomlevel_1.RoomLevel.Metropolis) {
	        return 10000000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.City) {
	        return 1000000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.Town) {
	        return 250000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.AdvancedColony) {
	        return 100000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.CivilizedColony) {
	        return 50000;
	    }
	    return 0;
	}
	exports.desiredWallHitsForRoom = desiredWallHitsForRoom;
	function desiredFortressHitsForRoom(room) {
	    let roomlevel = RoomRepository.getRoomLevel(room);
	    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
	        if (roomlevel >= roomlevel_1.RoomLevel.City) {
	            return 500000;
	        }
	        else {
	            return 100000;
	        }
	    }
	    if (roomlevel >= roomlevel_1.RoomLevel.Metropolis) {
	        if (room.memory.lowestWall !== undefined) {
	            return Math.max(room.memory.lowestWall * 2, 5000000);
	        }
	        else {
	            return 5000000;
	        }
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.City) {
	        return 5000000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.Town) {
	        return 2000000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.AdvancedColony) {
	        return 100000;
	    }
	    else if (roomlevel >= roomlevel_1.RoomLevel.CivilizedColony) {
	        return 500000;
	    }
	    return 0;
	}
	exports.desiredFortressHitsForRoom = desiredFortressHitsForRoom;
	function getBorderwallRoomCallback(wallPositions) {
	    let costs = new PathFinder.CostMatrix;
	    for (let p of wallPositions) {
	        costs.set(p.x, p.y, 0xfe);
	    }
	    return costs;
	}
	exports.getBorderwallRoomCallback = getBorderwallRoomCallback;
	function shortPos(pos) {
	    return pos.x + "-" + pos.y;
	}
	exports.shortPos = shortPos;
	function longPos(pos, roomName) {
	    let split = pos.split("-");
	    return new RoomPosition(+split[0], +split[1], roomName);
	}
	exports.longPos = longPos;
	function wallConstructionLimitReached() {
	    return Object.keys(Game.constructionSites).length > 60;
	}
	exports.wallConstructionLimitReached = wallConstructionLimitReached;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

	"use strict";
	class Threat {
	    constructor() {
	        this.tick = Game.time;
	        this.count = 0;
	        this.attackThreat = 0;
	        this.rangedThreat = 0;
	        this.toughThreat = 0;
	        this.workThreat = 0;
	        this.healThreat = 0;
	        this.boostedTough = 0;
	        this.boostedRanged = 0;
	        this.boostedWork = 0;
	        this.boostedHeal = 0;
	        this.boostedAttack = 0;
	    }
	}
	exports.Threat = Threat;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const roomlevel_1 = __webpack_require__(11);
	const Protector = __webpack_require__(81);
	const BuildLib = __webpack_require__(83);
	const BaseLib = __webpack_require__(82);
	const WallLib = __webpack_require__(78);
	const ProfileUtilities = __webpack_require__(19);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const Order_1 = __webpack_require__(20);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
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


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Logger_1 = __webpack_require__(7);
	const BaseLib = __webpack_require__(82);
	const RoomRepository = __webpack_require__(10);
	var State;
	(function (State) {
	    State[State["MoveToPosition"] = 1] = "MoveToPosition";
	    State[State["Fortify"] = 2] = "Fortify";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToPosition);
	    }
	    switch (creep.getState()) {
	        case State.MoveToPosition:
	            runMoveToPosition(creep);
	            break;
	        case State.Fortify:
	            runFortify(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MoveToPosition);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToPosition(creep) {
	    let basepos = RoomRepository.getBasePosition(creep.room);
	    if (basepos === undefined) {
	        console.log("Error with roomposition, Protector do not know where to move: " + creep.room.name);
	        creep.disable();
	        return;
	    }
	    let position = new RoomPosition(basepos.x, basepos.y + 2, basepos.roomName);
	    if (creep.pos.getRangeTo(position) > 0) {
	        creep.moveTo(position);
	    }
	    else {
	        creep.setState(State.Fortify);
	        return;
	    }
	}
	function runFortify(creep) {
	    if (creep.room.storage === undefined) {
	        console.log("Error with storage, Protector can not tank: " + creep.room.name);
	        creep.disable();
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] < (creep.getActiveBodyparts(WORK) * 2)) {
	        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	    }
	    let target = getTargetWall(creep);
	    if (target !== null) {
	        let response = creep.repair(target);
	        if (response === OK) {
	            if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
	                Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
	            }
	            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
	        }
	    }
	}
	function getTargetWall(creep) {
	    if (creep.memory.freq === undefined) {
	        creep.memory.freq = Math.floor(Math.random() * 50) + 100;
	    }
	    let wall = Game.getObjectById(creep.memory.wallid);
	    if (wall === null || Game.time % creep.memory.freq === 0) {
	        wall = getMostDamagedWall(creep);
	        if (wall !== null) {
	            creep.memory.wallid = wall.id;
	        }
	    }
	    return wall;
	}
	function getMostDamagedWall(creep) {
	    let walls = BaseLib.getFortressRamparts(creep.room);
	    let wall = null;
	    let wallHP = WALL_HITS_MAX;
	    for (let s of walls) {
	        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	            if (s.hits < wallHP) {
	                wall = s;
	                wallHP = s.hits;
	            }
	        }
	    }
	    return wall;
	}


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomRepository = __webpack_require__(10);
	function getPossibleExtensionsCount(room) {
	    if (room === undefined || room.controller === undefined || room.controller.level < 2) {
	        return 0;
	    }
	    switch (room.controller.level) {
	        case 2:
	            return 5;
	        case 3:
	            return 10;
	        case 4:
	            return 20;
	        case 5:
	            return 30;
	        case 6:
	            return 40;
	        case 7:
	            return 50;
	        case 8:
	            return 60;
	        default:
	            return 0;
	    }
	}
	exports.getPossibleExtensionsCount = getPossibleExtensionsCount;
	function getExtensionPositions() {
	    let positions = [
	        [-2, -2], [2, -2], [-1, -3], [0, -3], [1, -3],
	        [-3, -2], [3, -2], [-2, -4], [0, -4], [2, -4],
	        [-3, -3], [-4, -3], [-4, -4], [-3, -5], [-2, -5],
	        [3, -3], [4, -3], [4, -4], [3, -5], [2, -5],
	        [-5, -4], [-5, -5], [-5, -6], [-4, -6], [-3, -6],
	        [5, -4], [5, -5], [5, -6], [4, -6], [3, -6],
	        [-1, -5], [-1, -6], [0, -6], [1, -6], [1, -5],
	        [-4, 0], [-5, 0], [-6, 0], [-4, 1], [-6, 1],
	        [-5, 2], [-6, 2], [-4, 3], [-6, 3],
	        [-4, 4], [-5, 4], [-6, 4],
	        [4, 0], [5, 0], [6, 0], [4, 1], [6, 1],
	        [5, 2], [6, 2], [4, 3], [6, 3],
	        [4, 4], [5, 4], [6, 4],
	        [5, -1], [-5, -1], [6, -1], [-6, -1],
	        [7, -2], [-7, -2], [8, -3], [-8, -3],
	        [-5, 6], [-6, 7], [-5, 7], [-4, 7], [-5, 8],
	        [5, 6], [6, 7], [5, 7], [4, 7], [5, 8]
	    ];
	    return positions;
	}
	exports.getExtensionPositions = getExtensionPositions;
	function getPossibleTowerCount(room) {
	    if (room === undefined || room.controller === undefined || room.controller.level < 3) {
	        return 0;
	    }
	    switch (room.controller.level) {
	        case 3:
	            return 1;
	        case 4:
	            return 1;
	        case 5:
	            return 2;
	        case 6:
	            return 2;
	        case 7:
	            return 3;
	        case 8:
	            return 6;
	        default:
	            return 0;
	    }
	}
	exports.getPossibleTowerCount = getPossibleTowerCount;
	function getTowerPositions() {
	    let positions = [
	        [2, 1], [-2, 1], [3, 2], [-3, 2], [-3, 3], [3, 3]
	    ];
	    return positions;
	}
	exports.getTowerPositions = getTowerPositions;
	function getPossibleSpawnCount(room) {
	    if (room === undefined || room.controller === undefined || room.controller.level < 1) {
	        return 0;
	    }
	    switch (room.controller.level) {
	        case 1:
	        case 2:
	        case 3:
	        case 4:
	        case 5:
	        case 6:
	            return 1;
	        case 7:
	            return 2;
	        case 8:
	            return 3;
	        default:
	            return 0;
	    }
	}
	exports.getPossibleSpawnCount = getPossibleSpawnCount;
	function getPossibleLinkCount(room) {
	    if (room === undefined || room.controller === undefined || room.controller.level < 1) {
	        return 0;
	    }
	    switch (room.controller.level) {
	        case 1:
	        case 2:
	        case 3:
	        case 4:
	            return 0;
	        case 5:
	            return 2;
	        case 6:
	            return 3;
	        case 7:
	            return 4;
	        case 8:
	            return 6;
	        default:
	            return 0;
	    }
	}
	exports.getPossibleLinkCount = getPossibleLinkCount;
	function getSpawnPositions() {
	    let positions = [
	        [0, 0], [1, -1], [-1, -1],
	    ];
	    return positions;
	}
	exports.getSpawnPositions = getSpawnPositions;
	function getColonyRoadPositions() {
	    let positions = [
	        [0, -1], [0, 1], [0, 4],
	        [-1, -2], [-1, 2],
	        [1, -2], [1, 2],
	        [-1, 0], [1, 0], [-1, 3],
	        [-1, 1], [1, 1], [1, 3],
	    ];
	    return positions;
	}
	exports.getColonyRoadPositions = getColonyRoadPositions;
	function getCityRoadPositions() {
	    let positions = [
	        [-2, -1], [2, -1], [-2, 0], [2, 0],
	        [0, 2], [0, 6], [1, 5], [2, 4]
	    ];
	    return positions;
	}
	exports.getCityRoadPositions = getCityRoadPositions;
	function getAllBaseRoads(basepos) {
	    let roads = [];
	    let positions = getColonyRoadPositions().concat(getCityRoadPositions());
	    for (let a of positions) {
	        let pos = new RoomPosition(basepos.x + a[0], basepos.y + a[1], basepos.roomName);
	        for (let s of pos.lookFor(LOOK_STRUCTURES)) {
	            if (s.structureType === STRUCTURE_ROAD) {
	                roads.push(s);
	            }
	        }
	    }
	    return roads;
	}
	exports.getAllBaseRoads = getAllBaseRoads;
	function getFortressWallPositions() {
	    let positions = [
	        [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1],
	        [-3, 0], [3, 0],
	        [-3, 1], [3, 1],
	        [-3, 2], [3, 2],
	        [-3, 3], [3, 3],
	        [-3, 4], [3, 4],
	        [-3, 5], [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5], [3, 5],
	    ];
	    return positions;
	}
	exports.getFortressWallPositions = getFortressWallPositions;
	function getImportantBuildingPositions(room) {
	    let positions = [];
	    let structures = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_STORAGE });
	    for (let s of structures) {
	        positions.push([s.pos.x, s.pos.y]);
	    }
	    return positions;
	}
	exports.getImportantBuildingPositions = getImportantBuildingPositions;
	function getShellWallPositions() {
	    let positions = [
	        [0, 0], [-2, 1], [-2, 2], [2, 1], [2, 2], [0, 3], [1, 4],
	    ];
	    return positions;
	}
	exports.getShellWallPositions = getShellWallPositions;
	function getFortressRamparts(room) {
	    let ramparts = [];
	    let positions = getFortressWallPositions().concat(getShellWallPositions());
	    let basepos = RoomRepository.getBasePosition(room);
	    if (basepos !== undefined) {
	        for (let posInfo of positions) {
	            let pos = new RoomPosition(basepos.x + posInfo[0], basepos.y + posInfo[1], basepos.roomName);
	            let structures = pos.lookFor(LOOK_STRUCTURES);
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_RAMPART) {
	                    ramparts.push(s);
	                }
	            }
	        }
	    }
	    return ramparts;
	}
	exports.getFortressRamparts = getFortressRamparts;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	function getConstructionPointsInRoom(room) {
	    let cs = room.find(FIND_MY_CONSTRUCTION_SITES);
	    if (cs.length > 0) {
	        return _.sum(_.map(cs, function (c) {
	            return c.progressTotal - c.progress;
	        }));
	    }
	    let enemySitesNeedingBuilding = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_EXTRACTOR });
	    if (enemySitesNeedingBuilding.length > 0 && room.controller !== undefined && room.controller.level > 5 && room.controller.my) {
	        return _.sum(_.map(enemySitesNeedingBuilding, function (c) {
	            return c.progressTotal - c.progress;
	        }));
	    }
	    return 0;
	}
	exports.getConstructionPointsInRoom = getConstructionPointsInRoom;
	function getBuildingCount(room, structureType) {
	    return room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; }
	    }).length;
	}
	exports.getBuildingCount = getBuildingCount;
	function getConstructionSiteCount(room, structureType) {
	    return room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; }
	    }).length;
	}
	exports.getConstructionSiteCount = getConstructionSiteCount;
	function roomHasConstructionSites(room) {
	    let constructionSitesInRoom = room.find(FIND_MY_CONSTRUCTION_SITES);
	    return constructionSitesInRoom.length > 0;
	}
	exports.roomHasConstructionSites = roomHasConstructionSites;
	function buildIfNotPresent(structureType, spawnPos, offsetX, offsetY, keepRoad = false, destroyOtherStructures = false) {
	    let pos = new RoomPosition(spawnPos.x + offsetX, spawnPos.y + offsetY, spawnPos.roomName);
	    if (PositionLib.positionIsBorder(pos)) {
	        return false;
	    }
	    if (!PositionLib.positionHasBuildableGround(pos)) {
	        return false;
	    }
	    let structuresAtPos = pos.lookFor(LOOK_STRUCTURES);
	    let constructionSitesAtPos = pos.lookFor(LOOK_CONSTRUCTION_SITES);
	    for (let s of structuresAtPos) {
	        if (s.structureType !== structureType) {
	            if ((destroyOtherStructures || (!keepRoad && s.structureType === STRUCTURE_ROAD)) && s.structureType !== STRUCTURE_RAMPART) {
	                s.destroy();
	            }
	            else if ((s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_RAMPART) && structureType !== STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        else if (s.structureType === structureType) {
	            return false;
	        }
	    }
	    for (let c of constructionSitesAtPos) {
	        if (c.structureType !== structureType) {
	            if (destroyOtherStructures || (!keepRoad && c.structureType === STRUCTURE_ROAD)) {
	                c.remove();
	            }
	            if (c.structureType !== STRUCTURE_ROAD && c.structureType !== STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        else if (c.structureType === structureType) {
	            return false;
	        }
	    }
	    return pos.createConstructionSite(structureType) === OK;
	}
	exports.buildIfNotPresent = buildIfNotPresent;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const BoostLib = __webpack_require__(85);
	const TradeManager = __webpack_require__(86);
	const Logger_1 = __webpack_require__(7);
	const role_1 = __webpack_require__(16);
	const booststage_1 = __webpack_require__(89);
	class BoostManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("BoostManager");
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            let rooms = this.roomService.getNormalAndNotExpansion();
	            for (let room of rooms) {
	                if (BoostLib.roomHasCreepThatNeedsBoosting(room)) {
	                    this.boostCreepInRoom(room);
	                }
	            }
	        }
	    }
	    boostCreepInRoom(room) {
	        let boostTarget = BoostLib.getCreepThatNeedsBoosting(room);
	        if (!boostTarget) {
	            Logger_1.log.error("Could not find boost-target", room.name);
	            BoostLib.removeBoostingFromRoom(room);
	            return;
	        }
	        if (room.terminal === undefined) {
	            Logger_1.log.error("Trying to boost in a room without terminal", room.name);
	            return;
	        }
	        let lab = room.getBoostLab();
	        if (lab === undefined) {
	            Logger_1.log.error("Trying to boost in a room without boostlab", room.name);
	            return;
	        }
	        if (room.memory.boosting !== true && lab.energy < lab.energyCapacity) {
	            Logger_1.log.error("Waiting with boost until lab has full energy", room.name);
	            return;
	        }
	        let boostHauler = this.findBoostHauler(room);
	        if (boostHauler === undefined) {
	            Logger_1.log.alert("Could not find boosthauler", room.name);
	            return;
	        }
	        if (BoostLib.roomIsCurrentlyBoosting(room)) {
	            this.runBoosting(room, boostTarget, boostHauler, lab, room.terminal);
	        }
	        else {
	            let moveHauler = this.moveHaulerToBoostPosition(boostHauler, lab);
	            let moveTarget = this.moveTargetToBoostPosition(boostTarget, lab);
	            if (moveHauler && moveTarget) {
	                room.memory.boosting = true;
	            }
	        }
	    }
	    runBoosting(room, boostTarget, boostHauler, lab, terminal) {
	        if (boostHauler === null) {
	            BoostLib.removeBoostingFromRoom(room);
	            return;
	        }
	        let boosts = BoostLib.getWantedBoosts(boostTarget);
	        if (boosts.type === "" || boosts.count === 0) {
	            BoostLib.removeBoostingFromRoom(room);
	            BoostLib.enableCreepIfDisabled(boostHauler);
	            BoostLib.enableCreepIfDisabled(boostTarget);
	            return;
	        }
	        let requiredMinerals = boosts.count * LAB_BOOST_MINERAL;
	        switch (room.memory.boostStage) {
	            case undefined:
	            case booststage_1.BoostStage.ClearLab:
	                if (lab.mineralAmount > 0) {
	                    boostHauler.withdraw(lab, lab.mineralType);
	                    break;
	                }
	                else if (_.sum(boostHauler.carry) > 0) {
	                    for (let inventory in boostHauler.carry) {
	                        boostHauler.transfer(boostHauler.room.terminal, inventory);
	                    }
	                    break;
	                }
	                else {
	                    this.setBoostStage(room, booststage_1.BoostStage.BuyMinerals);
	                }
	            case booststage_1.BoostStage.BuyMinerals:
	                if (BoostLib.doWeHaveMineralsRequired(room, boosts.type, requiredMinerals)) {
	                    this.setBoostStage(room, booststage_1.BoostStage.LoadHauler);
	                }
	                else {
	                    TradeManager.requestMineralsForBoosting(room, boosts.type, requiredMinerals);
	                    break;
	                }
	            case booststage_1.BoostStage.LoadHauler:
	                boostHauler.withdraw(terminal, boosts.type, Math.min(boostHauler.carryCapacity, requiredMinerals));
	                this.setBoostStage(room, booststage_1.BoostStage.UnloadHauler);
	                break;
	            case booststage_1.BoostStage.UnloadHauler:
	                boostHauler.transfer(lab, boosts.type);
	                this.setBoostStage(room, booststage_1.BoostStage.BoostCreep);
	                break;
	            case booststage_1.BoostStage.BoostCreep:
	                lab.boostCreep(boostTarget);
	                Logger_1.log.info("Boosting " + boostTarget.name + " with " + boosts.count + " " + boosts.type, room.name);
	                this.setBoostStage(room, booststage_1.BoostStage.ValidateBoost);
	                break;
	            case booststage_1.BoostStage.ValidateBoost:
	                this.setBoostStage(room, booststage_1.BoostStage.ClearLab);
	                if (BoostLib.creepIsBoosted(boostTarget, boosts.type)) {
	                    BoostLib.removeWantedBoostTypeFromCreepMemory(boostTarget, boosts.type);
	                }
	                else {
	                    Logger_1.log.error("Boosting of " + boostTarget.name + " with " + boosts.type + " failed", room.name);
	                }
	                break;
	        }
	    }
	    moveTargetToBoostPosition(creep, lab) {
	        if (creep.spawning) {
	            return false;
	        }
	        let boostingPosition = BoostLib.getTargetBoostingPosition(lab);
	        if (BoostLib.boostTargetInPosition(creep, boostingPosition)) {
	            return true;
	        }
	        creep.moveTo(boostingPosition);
	        return false;
	    }
	    moveHaulerToBoostPosition(boostHauler, lab) {
	        let boostHaulerPosition = BoostLib.getHaulerBoostingPosition(lab);
	        if (!BoostLib.boostHaulerInPosition(boostHauler, boostHaulerPosition)) {
	            boostHauler.moveTo(boostHaulerPosition);
	            return false;
	        }
	        if (_.sum(boostHauler.carry) > 0) {
	            for (let inventory in boostHauler.carry) {
	                boostHauler.transfer(boostHauler.room.terminal, inventory);
	            }
	            return false;
	        }
	        return true;
	    }
	    findBoostHauler(room) {
	        let boostHauler = BoostLib.getBoostHauler(room);
	        if (boostHauler !== null) {
	            return boostHauler;
	        }
	        let baseHaulers = this.creepService.getCreeps(role_1.Role.BaseHauler, null, room.name);
	        if (baseHaulers.length > 0) {
	            BoostLib.setAsBoostHauler(room, baseHaulers[0]);
	            return baseHaulers[0];
	        }
	        return undefined;
	    }
	    setBoostStage(room, stage) {
	        room.memory.boostStage = stage;
	    }
	}
	exports.BoostManager = BoostManager;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

	"use strict";
	function roomHasCreepThatNeedsBoosting(room) {
	    return room.memory.boostTarget !== undefined;
	}
	exports.roomHasCreepThatNeedsBoosting = roomHasCreepThatNeedsBoosting;
	function roomIsCurrentlyBoosting(room) {
	    return room.memory.boosting;
	}
	exports.roomIsCurrentlyBoosting = roomIsCurrentlyBoosting;
	function setRoomIsBoosting(room) {
	    room.memory.boosting = true;
	}
	exports.setRoomIsBoosting = setRoomIsBoosting;
	function getCreepThatNeedsBoosting(room) {
	    return Game.getObjectById(room.memory.boostTarget);
	}
	exports.getCreepThatNeedsBoosting = getCreepThatNeedsBoosting;
	function getBoostHauler(room) {
	    let bh = Game.getObjectById(room.memory.boostHauler);
	    if (bh === null) {
	        room.memory.boostHauler = undefined;
	    }
	    return bh;
	}
	exports.getBoostHauler = getBoostHauler;
	function removeBoostingFromRoom(room) {
	    room.memory.boostTarget = undefined;
	    room.memory.boostStage = undefined;
	    room.memory.boostHauler = undefined;
	    room.memory.boosting = undefined;
	}
	exports.removeBoostingFromRoom = removeBoostingFromRoom;
	function enableCreepIfDisabled(creep) {
	    if (creep instanceof Creep) {
	        creep.enable();
	    }
	}
	exports.enableCreepIfDisabled = enableCreepIfDisabled;
	function boostTargetInPosition(creep, position) {
	    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
	        return true;
	    }
	    return false;
	}
	exports.boostTargetInPosition = boostTargetInPosition;
	function boostHaulerInPosition(creep, position) {
	    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
	        return true;
	    }
	    return false;
	}
	exports.boostHaulerInPosition = boostHaulerInPosition;
	function removeWantedBoostTypeFromCreepMemory(creep, type) {
	    creep.memory.boost = _.filter(creep.memory.boost, function (t) { return t !== type; });
	    if (creep.memory.boost.length === 0) {
	        creep.memory.boost = undefined;
	    }
	}
	exports.removeWantedBoostTypeFromCreepMemory = removeWantedBoostTypeFromCreepMemory;
	function creepIsBoosted(creep, type) {
	    let validateBodypart = getBodyPartForBoost(type);
	    for (let b of creep.body) {
	        if (b.type === validateBodypart && b.boost !== type) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.creepIsBoosted = creepIsBoosted;
	function getTargetBoostingPosition(lab) {
	    return new RoomPosition(lab.pos.x + 1, lab.pos.y, lab.pos.roomName);
	}
	exports.getTargetBoostingPosition = getTargetBoostingPosition;
	function getHaulerBoostingPosition(lab) {
	    return new RoomPosition(lab.pos.x, lab.pos.y - 1, lab.pos.roomName);
	}
	exports.getHaulerBoostingPosition = getHaulerBoostingPosition;
	function setAsBoostHauler(room, creep) {
	    room.memory.boostHauler = creep.id;
	    creep.disable();
	}
	exports.setAsBoostHauler = setAsBoostHauler;
	function getWantedBoosts(creep) {
	    if (creep.memory.boost === undefined || creep.memory.boost.length === 0) {
	        return { type: "", count: 0 };
	    }
	    let type = creep.memory.boost[0];
	    let bodypart = getBodyPartForBoost(type);
	    let count = creep.getActiveBodyparts(bodypart);
	    return { type: type, count: count };
	}
	exports.getWantedBoosts = getWantedBoosts;
	function doWeHaveMineralsRequired(room, mineral, count) {
	    if (room.terminal === undefined) {
	        return false;
	    }
	    if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < count) {
	        return false;
	    }
	    return true;
	}
	exports.doWeHaveMineralsRequired = doWeHaveMineralsRequired;
	function getBodyPartForBoost(boost) {
	    switch (boost) {
	        case RESOURCE_CATALYZED_UTRIUM_ACID:
	            return ATTACK;
	        case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
	            return WORK;
	        case RESOURCE_CATALYZED_KEANIUM_ACID:
	            return CARRY;
	        case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
	            return RANGED_ATTACK;
	        case RESOURCE_CATALYZED_LEMERGIUM_ACID:
	            return WORK;
	        case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
	            return HEAL;
	        case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
	            return WORK;
	        case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
	            return MOVE;
	        case RESOURCE_CATALYZED_GHODIUM_ACID:
	            return WORK;
	        case RESOURCE_CATALYZED_GHODIUM_ALKALIDE:
	            return TOUGH;
	        case RESOURCE_UTRIUM_ACID:
	            return ATTACK;
	        case RESOURCE_UTRIUM_ALKALIDE:
	            return WORK;
	        case RESOURCE_KEANIUM_ACID:
	            return CARRY;
	        case RESOURCE_KEANIUM_ALKALIDE:
	            return RANGED_ATTACK;
	        case RESOURCE_LEMERGIUM_ACID:
	            return WORK;
	        case RESOURCE_LEMERGIUM_ALKALIDE:
	            return HEAL;
	        case RESOURCE_ZYNTHIUM_ACID:
	            return WORK;
	        case RESOURCE_ZYNTHIUM_ALKALIDE:
	            return MOVE;
	        case RESOURCE_GHODIUM_ACID:
	            return WORK;
	        case RESOURCE_GHODIUM_ALKALIDE:
	            return TOUGH;
	        case RESOURCE_UTRIUM_HYDRIDE:
	            return ATTACK;
	        case RESOURCE_UTRIUM_OXIDE:
	            return WORK;
	        case RESOURCE_KEANIUM_HYDRIDE:
	            return CARRY;
	        case RESOURCE_KEANIUM_OXIDE:
	            return RANGED_ATTACK;
	        case RESOURCE_LEMERGIUM_HYDRIDE:
	            return WORK;
	        case RESOURCE_LEMERGIUM_OXIDE:
	            return HEAL;
	        case RESOURCE_ZYNTHIUM_HYDRIDE:
	            return WORK;
	        case RESOURCE_ZYNTHIUM_OXIDE:
	            return MOVE;
	        case RESOURCE_GHODIUM_HYDRIDE:
	            return WORK;
	        case RESOURCE_GHODIUM_OXIDE:
	            return TOUGH;
	        default:
	            return "ERROR";
	    }
	}
	exports.getBodyPartForBoost = getBodyPartForBoost;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const MarketManager = __webpack_require__(87);
	const RoomUtilities = __webpack_require__(36);
	const RoomRepository = __webpack_require__(10);
	const TradeConfig = __webpack_require__(88);
	const roomlevel_1 = __webpack_require__(11);
	const basicMinerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];
	const _Manager_1 = __webpack_require__(14);
	const Logger_1 = __webpack_require__(7);
	class TradeManager extends _Manager_1.Manager {
	    constructor(roomService) {
	        super("TradeManager");
	        this.hasRunCrisisEnergy = false;
	        this.hasRunSendEnergyAway = false;
	        this.hasRunSendEnergyToPraiseroom = false;
	        this.hasRunSendBoostToPraiseroom = false;
	        this.hasRunPraiseroomEnergyOrder = false;
	        this.hasRunLookForGoodDeals = false;
	        this.hasRunSellEnergy = false;
	        this.hasRunSellPower = false;
	        this.hasRunSellPowerGoodDeal = false;
	        this.hasRunSendPower = false;
	        this.hasRunSendMinerals = false;
	        this.hasRunSendBoost = false;
	        this.hasRunMineralSellorders = false;
	        this.hasRunMineralToBuyorders = false;
	        this.hasRunAbandonedRooms = false;
	        this.MEMORY_NEXTRUN_CRISISENERGY = "nextCrisis";
	        this.MEMORY_NEXTRUN_SENDENERGYAWAY = "nextEnAway";
	        this.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM = "nextPrEnergy";
	        this.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM = "nextPrBoost";
	        this.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER = "nextPrOrder";
	        this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS = "nextCleanup";
	        this.MEMORY_NEXTRUN_LOOKFORGOODDEALS = "nextGoodDeals";
	        this.MEMORY_NEXTRUN_SELLENERGY = "nextEnergySale";
	        this.MEMORY_NEXTRUN_SELLPOWER = "nextPwSale";
	        this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL = "nextPwGoodSale";
	        this.MEMORY_NEXTRUN_SENDPOWER = "nextPwDist";
	        this.MEMORY_NEXTRUN_SENDMINERALS = "nextMinDist";
	        this.MEMORY_NEXTRUN_SENDBOOST = "nextSendBoost";
	        this.MEMORY_NEXTRUN_MINERALSELLORDERS = "nextMinSellO";
	        this.MEMORY_NEXTRUN_MINERALTOBUYORDERS = "nextMinToBuyO";
	        this.MEMORY_NEXTRUN_ABANDONEDROOMS = "nextAbandoned";
	        this.MEMORY_NEXTRUN_PREPARERESPAWN = "nextPrepRespawn";
	        this.MEMORY_NEXTRUN_BUYMINERALS = "nextBuyMins";
	        this.roomService = roomService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            let nextRunCrisisEnergy = this.getValue(this.MEMORY_NEXTRUN_CRISISENERGY);
	            if (nextRunCrisisEnergy === undefined || nextRunCrisisEnergy < Game.time) {
	                let roomNeedingCrisisEnergy = this.getRoomNeedingCrisisEnergy();
	                if (roomNeedingCrisisEnergy !== undefined) {
	                    this.requestCrisisEnergy(roomNeedingCrisisEnergy);
	                    this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY, Game.time + 12);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY, Game.time + 200);
	                }
	                this.hasRunCrisisEnergy = true;
	                return;
	            }
	            let nextRunSendEnergyToPraiseroom = this.getValue(this.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM);
	            if (nextRunSendEnergyToPraiseroom === undefined || nextRunSendEnergyToPraiseroom < Game.time) {
	                let praiseroomNeedingEnergy = this.getPraiseroomNeedingEnergy();
	                if (praiseroomNeedingEnergy !== undefined) {
	                    this.sendEnergyToPraiseroom(praiseroomNeedingEnergy);
	                }
	                this.setValue(this.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM, Game.time + 25);
	                this.hasRunSendEnergyToPraiseroom = true;
	                return;
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            if (Memory.settings.prepareRespawn === true) {
	                let nextPrepareRespawn = this.getValue(this.MEMORY_NEXTRUN_PREPARERESPAWN);
	                if (nextPrepareRespawn === undefined || nextPrepareRespawn < Game.time) {
	                    let rooms = this.roomService.getNormalRooms();
	                    let counter = 0;
	                    for (let room of rooms) {
	                        if (this.sellEverything(room) && counter < 10) {
	                            counter++;
	                        }
	                    }
	                    if (counter === 0) {
	                        this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN, Game.time + 100);
	                    }
	                    else {
	                        this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN, Game.time + 1);
	                    }
	                    return;
	                }
	            }
	            let nextRunAbandonedRooms = this.getValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS);
	            if (nextRunAbandonedRooms === undefined || nextRunAbandonedRooms < Game.time) {
	                let disRooms = this.roomService.getRoomsBeingAbandoned();
	                if (disRooms.length > 0) {
	                    for (let room of disRooms) {
	                        if (this.sendAwayEverything(room)) {
	                            this.setValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS, Game.time + 12);
	                            this.hasRunAbandonedRooms = true;
	                            return;
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS, Game.time + 100);
	                this.hasRunAbandonedRooms = true;
	                return;
	            }
	            let nextSendPower = this.getValue(this.MEMORY_NEXTRUN_SENDPOWER);
	            if (nextSendPower === undefined || nextSendPower < Game.time) {
	                let roomWithPowerOverflow = this.getRoomWantingToDistributePower();
	                if (roomWithPowerOverflow !== undefined) {
	                    this.sendPowerToOthers(roomWithPowerOverflow);
	                    this.setValue(this.MEMORY_NEXTRUN_SENDPOWER, Game.time + 200);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SENDPOWER, Game.time + 1000);
	                }
	                this.hasRunSendPower = true;
	                return;
	            }
	            let nextMineralSellOrders = this.getValue(this.MEMORY_NEXTRUN_MINERALSELLORDERS);
	            if (nextMineralSellOrders === undefined || nextMineralSellOrders < Game.time) {
	                let sellMinsLimit = TradeConfig.sendMineralsToSellOrderWhenAbove;
	                if (Memory.settings.bot === true) {
	                    sellMinsLimit = 50000;
	                }
	                for (let room of this.roomService.getNormalAndNotExpansion()) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town && room.storage !== undefined && room.terminal !== undefined) {
	                        let roomMinerals = getTradeMinerals(room);
	                        for (let roomMineral of roomMinerals) {
	                            if (room.storage.store[roomMineral] > sellMinsLimit && Game.market.credits > 10000) {
	                                maintainSellOrder(room, roomMineral);
	                            }
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_NEXTRUN_MINERALSELLORDERS, Game.time + 200);
	                this.hasRunMineralSellorders = true;
	                return;
	            }
	            let nextSendMinerals = this.getValue(this.MEMORY_NEXTRUN_SENDMINERALS);
	            if (nextSendMinerals === undefined || nextSendMinerals < Game.time) {
	                for (let room of this.roomService.getNormalAndNotExpansion()) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town && room.terminal !== undefined) {
	                        let roomMinerals = getTradeMinerals(room);
	                        for (let roomMineral of roomMinerals) {
	                            if (room.terminal.store[roomMineral] > TradeConfig.sendMineralsToOtherRoomsWhenAbove) {
	                                if (this.sendMineralsToOthers(room, roomMineral)) {
	                                    this.setValue(this.MEMORY_NEXTRUN_SENDMINERALS, Game.time + 1);
	                                    return;
	                                }
	                            }
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_NEXTRUN_SENDMINERALS, Game.time + 100);
	                this.hasRunSendMinerals = true;
	                return;
	            }
	            let nextMineralToBuyOrders = this.getValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS);
	            if (nextMineralToBuyOrders === undefined || nextMineralToBuyOrders < Game.time) {
	                let dumpMinsLimit = TradeConfig.sendMineralsToBuyOrdersWhenAbove;
	                if (Memory.settings.bot === true) {
	                    dumpMinsLimit = 70000;
	                }
	                for (let room of _.shuffle(this.roomService.getNormalAndNotExpansion())) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town && room.terminal !== undefined && room.storage !== undefined) {
	                        let roomMinerals = getTradeMinerals(room);
	                        for (let roomMineral of roomMinerals) {
	                            if (room.storage.store[roomMineral] > dumpMinsLimit && (_.sum(room.storage.store) > 900000 || Memory.settings.bot === true)) {
	                                if (this.sellOfResources(room, roomMineral)) {
	                                    if (Memory.settings.bot === true) {
	                                        this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS, Game.time + 50);
	                                    }
	                                    else {
	                                        this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS, Game.time + 10);
	                                    }
	                                    return;
	                                }
	                            }
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS, Game.time + 200);
	                this.hasRunMineralToBuyorders = true;
	                return;
	            }
	            let nextPraiseroomEnergyOrder = this.getValue(this.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER);
	            if (nextPraiseroomEnergyOrder === undefined || nextPraiseroomEnergyOrder < Game.time) {
	                let praiseroomsEnergyOrder = this.getPraiseroomsNeedingEnergyOrder();
	                if (praiseroomsEnergyOrder.length > 0) {
	                    for (let praiseroom of praiseroomsEnergyOrder) {
	                        this.maintainPraiseroomBuyEnergyOrder(praiseroom);
	                    }
	                }
	                this.setValue(this.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER, Game.time + 500);
	                this.hasRunPraiseroomEnergyOrder = true;
	                return;
	            }
	            let nextRunSendBoostToPraiseroom = this.getValue(this.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM);
	            if (nextRunSendBoostToPraiseroom === undefined || nextRunSendBoostToPraiseroom < Game.time) {
	                let praiseroomNeedingBoost = this.getPraiseroomNeedingBoost();
	                if (praiseroomNeedingBoost !== undefined) {
	                    this.sendBoostToPraiseroom(praiseroomNeedingBoost);
	                }
	                this.setValue(this.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM, Game.time + 200);
	                this.hasRunSendBoostToPraiseroom = true;
	                return;
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let nextLookForGoodDeals = this.getValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS);
	            if (nextLookForGoodDeals === undefined || nextLookForGoodDeals < Game.time) {
	                let roomWithMineralsForSale = this.getRoomWantingToSellToGoodDeals();
	                if (roomWithMineralsForSale !== undefined) {
	                    this.lookForGoodDeals(roomWithMineralsForSale.room, roomWithMineralsForSale.mineral);
	                    this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS, Game.time + 10);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS, Game.time + 50);
	                }
	                this.hasRunLookForGoodDeals = true;
	                return;
	            }
	            let buyMineralsLimit = 100000;
	            if (Memory.settings.creditsToMaintain !== undefined) {
	                buyMineralsLimit = Memory.settings.creditsToMaintain;
	            }
	            if (Game.market.credits > buyMineralsLimit) {
	                let nextBuyMinerals = this.getValue(this.MEMORY_NEXTRUN_BUYMINERALS);
	                if (nextBuyMinerals === undefined || nextBuyMinerals < Game.time) {
	                    let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                    for (let room of rooms) {
	                        if (roomCanTrade(room) && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City) {
	                            if (buyMissingMinerals(room)) {
	                                this.setValue(this.MEMORY_NEXTRUN_BUYMINERALS, Game.time + 100);
	                                return;
	                            }
	                        }
	                    }
	                    this.setValue(this.MEMORY_NEXTRUN_BUYMINERALS, Game.time + 1000);
	                    return;
	                }
	            }
	            let nextSellEnergy = this.getValue(this.MEMORY_NEXTRUN_SELLENERGY);
	            if (nextSellEnergy === undefined || nextSellEnergy < Game.time) {
	                let roomsWithEnergyOverflow = this.getRoomsWantingToSellOfEnergy();
	                if (roomsWithEnergyOverflow.length > 0) {
	                    for (let room of roomsWithEnergyOverflow) {
	                        this.sellOfResources(room, RESOURCE_ENERGY);
	                    }
	                    this.setValue(this.MEMORY_NEXTRUN_SELLENERGY, Game.time + 100);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SELLENERGY, Game.time + 500);
	                }
	                this.hasRunSellEnergy = true;
	                return;
	            }
	            let nextSellPower = this.getValue(this.MEMORY_NEXTRUN_SELLPOWER);
	            if (nextSellPower === undefined || nextSellPower < Game.time) {
	                let roomWithPowerOverflow = this.getRoomWithPowerOverflow();
	                if (roomWithPowerOverflow !== undefined) {
	                    this.sellOfResources(roomWithPowerOverflow, RESOURCE_POWER);
	                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWER, Game.time + 200);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWER, Game.time + 1000);
	                }
	                this.hasRunSellPower = true;
	                return;
	            }
	            let nextSellPowerGoodDeal = this.getValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL);
	            if (nextSellPowerGoodDeal === undefined || nextSellPowerGoodDeal < Game.time) {
	                let roomWithPowerForSale = this.getRoomWantingToSendAwayPower();
	                if (roomWithPowerForSale !== undefined) {
	                    this.lookForGoodDeals(roomWithPowerForSale, RESOURCE_POWER);
	                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL, Game.time + 50);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL, Game.time + 500);
	                }
	                this.hasRunSellPowerGoodDeal = true;
	                return;
	            }
	            let nextRunSendEnergyAway = this.getValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY);
	            if (nextRunSendEnergyAway === undefined || nextRunSendEnergyAway < Game.time) {
	                let roomWantingToSendAwayEnergy = this.getRoomWantingToSendAwayEnergy();
	                if (roomWantingToSendAwayEnergy !== undefined) {
	                    this.sendEnergyToNeighbour(roomWantingToSendAwayEnergy);
	                    this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY, Game.time + 50);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY, Game.time + 500);
	                }
	                this.hasRunSendEnergyAway = true;
	                return;
	            }
	            let nextRunSendBoost = this.getValue(this.MEMORY_NEXTRUN_SENDBOOST);
	            if (nextRunSendBoost === undefined || nextRunSendBoost < Game.time) {
	                let roomWithExcessBoost = this.getRoomWithExcessBoost();
	                if (roomWithExcessBoost !== undefined) {
	                    this.sendUpgraderBoostToOthers(roomWithExcessBoost);
	                    this.setValue(this.MEMORY_NEXTRUN_SENDBOOST, Game.time + 200);
	                }
	                else {
	                    this.setValue(this.MEMORY_NEXTRUN_SENDBOOST, Game.time + 1000);
	                }
	                this.hasRunSendBoost = true;
	                return;
	            }
	            let nextRunCleanUpInactiveOrders = this.getValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS);
	            if (nextRunCleanUpInactiveOrders === undefined || nextRunCleanUpInactiveOrders < Game.time) {
	                this.cleanUpInactiveOrders();
	                this.setValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS, Game.time + 6000);
	            }
	        }
	    }
	    getRoomNeedingCrisisEnergy() {
	        let rooms = _.shuffle(this.roomService.getNormalAndNotExpansion());
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town &&
	                room.terminal !== undefined && room.storage !== undefined &&
	                room.terminal.store[RESOURCE_ENERGY] < TradeConfig.requestCrisisEnergyWhenTerminalEnergyBelow &&
	                room.storage.store[RESOURCE_ENERGY] < TradeConfig.requestCrisisEnergyWhenStorageEnergyBelow
	                && room.terminal.my && room.terminal.isActive() && !room.isAbandoned()) {
	                return room;
	            }
	        }
	    }
	    getRoomsWantingToSellOfEnergy() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        let sellRooms = [];
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town &&
	                room.terminal !== undefined && room.storage !== undefined &&
	                room.terminal.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenTerminalEnergyAbove &&
	                room.storage.store[RESOURCE_ENERGY] > TradeConfig.sendEnergyToBuyOrdersWhenAbove &&
	                room.terminal.my && room.terminal.isActive()) {
	                sellRooms.push(room);
	            }
	        }
	        return sellRooms;
	    }
	    getRoomWantingToSendAwayEnergy() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town &&
	                room.terminal !== undefined && room.storage !== undefined &&
	                room.terminal.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenTerminalEnergyAbove &&
	                room.storage.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenStorageEnergyAbove &&
	                room.terminal.my && room.terminal.isActive()) {
	                return room;
	            }
	        }
	    }
	    getPraiseroomNeedingEnergy() {
	        let rooms = this.roomService.getPraiseRooms();
	        for (let room of rooms) {
	            if (room.terminal !== undefined && room.terminal.isActive() &&
	                room.terminal.store[RESOURCE_ENERGY] < (room.terminal.storeCapacity - (TradeConfig.batchSizeForSendingEnergy * 2))) {
	                return room;
	            }
	        }
	    }
	    getPraiseroomNeedingBoost() {
	        let rooms = this.roomService.getPraiseRooms();
	        for (let room of rooms) {
	            if (room.terminal !== undefined && room.terminal.isActive() &&
	                (room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] === undefined ||
	                    room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < 20000)) {
	                return room;
	            }
	        }
	    }
	    getPraiseroomsNeedingEnergyOrder() {
	        let rooms = this.roomService.getPraiseRooms();
	        let result = [];
	        for (let room of rooms) {
	            if (room.terminal !== undefined && room.terminal.isActive() &&
	                (Memory.settings.creditsToMaintain === undefined || Game.market.credits > Memory.settings.creditsToMaintain)) {
	                result.push(room);
	            }
	        }
	        return result;
	    }
	    getRoomWantingToSellToGoodDeals() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        let goodDealLimit = TradeConfig.sendMineralsToGoodDealsWhenAbove;
	        if (Memory.settings.bot === true) {
	            goodDealLimit = 30000;
	        }
	        for (let room of _.shuffle(rooms)) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town && room.terminal !== undefined && room.storage !== undefined && roomCanTrade(room)) {
	                let roomMinerals = getTradeMinerals(room);
	                for (let roomMineral of roomMinerals) {
	                    if (room.storage.store[roomMineral] > goodDealLimit) {
	                        return { room: room, mineral: roomMineral };
	                    }
	                }
	            }
	        }
	    }
	    getRoomWantingToDistributePower() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        for (let room of _.shuffle(rooms)) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && roomCanTrade(room) &&
	                room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
	                room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenStorageAbove) {
	                return room;
	            }
	        }
	    }
	    getRoomWantingToSendAwayPower() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        for (let room of _.shuffle(rooms)) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && roomCanTrade(room) &&
	                room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
	                room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenStorageAbove * 2) {
	                return room;
	            }
	        }
	    }
	    getRoomWithPowerOverflow() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && roomCanTrade(room) &&
	                room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
	                room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerToBuyOrdersWhenAbove) {
	                return room;
	            }
	        }
	    }
	    getRoomWithExcessBoost() {
	        let rooms = this.roomService.getNormalAndNotExpansion();
	        for (let room of rooms) {
	            if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && roomCanTrade(room) &&
	                roomlevel_1.RoomLevel.Metropolis && room.terminal !== undefined &&
	                room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > TradeConfig.sendUpgradeBoostWhenAbove) {
	                return room;
	            }
	        }
	    }
	    requestCrisisEnergy(room) {
	        if (room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] > TradeConfig.requestCrisisEnergyWhenTerminalEnergyBelow * 2) {
	            return;
	        }
	        let providerRoom;
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.terminal !== undefined && potRoom.terminal.store[RESOURCE_ENERGY] > (TradeConfig.batchSizeForCrisisEnergy * 2) &&
	                potRoom.storage !== undefined && potRoom.storage.store[RESOURCE_ENERGY] > TradeConfig.energyLimitForProvidingCrisisEnergy && roomCanTrade(potRoom)) {
	                if (providerRoom === undefined ||
	                    (providerRoom.storage !== undefined && potRoom.storage.store[RESOURCE_ENERGY] > providerRoom.storage.store[RESOURCE_ENERGY])) {
	                    providerRoom = potRoom;
	                }
	            }
	        }
	        if (providerRoom !== undefined && providerRoom.terminal !== undefined) {
	            providerRoom.terminal.send(RESOURCE_ENERGY, TradeConfig.batchSizeForCrisisEnergy, room.name);
	            Logger_1.log.info("Requesting " + TradeConfig.batchSizeForCrisisEnergy + " energy from room because of crisis: " + providerRoom.name +
	                " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForCrisisEnergy, room.name, providerRoom.name) + " energy)", room.name);
	            return;
	        }
	    }
	    sendEnergyToNeighbour(room) {
	        if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < (TradeConfig.batchSizeForSendingEnergy * 2)) {
	            return;
	        }
	        let targetRoom = undefined;
	        let targetRoomEnergy = 10000000;
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.terminal !== undefined && potRoom.terminal.store[RESOURCE_ENERGY] < (TradeConfig.batchSizeForSendingEnergy * 2) &&
	                potRoom.controller !== undefined && potRoom.storage !== undefined && potRoom.storage.store[RESOURCE_ENERGY] < (TradeConfig.batchSizeForSendingEnergy * 2) &&
	                Game.market.calcTransactionCost(1000, room.name, potRoom.name) < 500) {
	                if (potRoom.terminal.store[RESOURCE_ENERGY] + potRoom.storage.store[RESOURCE_ENERGY] < targetRoomEnergy) {
	                    targetRoom = potRoom.name;
	                    targetRoomEnergy = potRoom.terminal.store[RESOURCE_ENERGY] + potRoom.storage.store[RESOURCE_ENERGY];
	                }
	            }
	        }
	        if (targetRoom !== undefined) {
	            room.terminal.send(RESOURCE_ENERGY, TradeConfig.batchSizeForSendingEnergy, targetRoom);
	            Logger_1.log.info("Sending " + TradeConfig.batchSizeForSendingEnergy + " energy because of overflow to room: " + targetRoom +
	                " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingEnergy, room.name, targetRoom) + " energy)", room.name);
	        }
	    }
	    sendEnergyToPraiseroom(room) {
	        if (room.terminal === undefined) {
	            return;
	        }
	        let providerRoom = undefined;
	        let providerRoomEnergy = 200000;
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[RESOURCE_ENERGY] > (TradeConfig.batchSizeForSendingEnergy * 1.5) &&
	                potRoom.controller !== undefined && potRoom.storage !== undefined && potRoom.storage.store[RESOURCE_ENERGY] > (TradeConfig.batchSizeForSendingEnergy * 2)) {
	                if (potRoom.terminal.store[RESOURCE_ENERGY] + potRoom.storage.store[RESOURCE_ENERGY] > providerRoomEnergy) {
	                    providerRoom = potRoom;
	                    providerRoomEnergy = potRoom.terminal.store[RESOURCE_ENERGY] + potRoom.storage.store[RESOURCE_ENERGY];
	                }
	            }
	        }
	        if (providerRoom !== undefined && providerRoom.terminal !== undefined) {
	            providerRoom.terminal.send(RESOURCE_ENERGY, TradeConfig.batchSizeForSendingEnergy, room.name);
	            Logger_1.log.info("Sending " + TradeConfig.batchSizeForSendingEnergy + " energy to praise GCL: " + room.name +
	                " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingEnergy, providerRoom.name, room.name) + " energy)", providerRoom.name);
	        }
	    }
	    sendBoostToPraiseroom(praiseroom) {
	        if (praiseroom.terminal === undefined) {
	            return;
	        }
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (RoomRepository.getRoomLevel(potRoom) >= roomlevel_1.RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > TradeConfig.sendUpgradeBoostWhenAbove) {
	                potRoom.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID, TradeConfig.batchSizeForSendingUpgradeBoost, praiseroom.name);
	                Logger_1.log.info("Sending " + TradeConfig.batchSizeForSendingUpgradeBoost + " " + RESOURCE_CATALYZED_GHODIUM_ACID + " to praise GCL: " + praiseroom.name + "'>" + praiseroom.name +
	                    " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingUpgradeBoost, potRoom.name, praiseroom.name) + " energy)", potRoom.name);
	            }
	        }
	    }
	    maintainPraiseroomBuyEnergyOrder(room) {
	        if (room.terminal === undefined) {
	            return;
	        }
	        let energyPrice = MarketManager.getResourceBuyPrice(RESOURCE_ENERGY);
	        if (energyPrice === undefined || energyPrice > 0.01) {
	            return;
	        }
	        let buyorder = _.filter(Game.market.orders, function (o) {
	            return o.type === ORDER_BUY && o.resourceType === RESOURCE_ENERGY && o.roomName === room.name;
	        });
	        if (Object.keys(buyorder).length > 0) {
	            for (let orderId in buyorder) {
	                if (buyorder[orderId].amount < 50000) {
	                    let addAmount = (100000 - buyorder[orderId].amount);
	                    Logger_1.log.info("Updating praiseroom energy-buyorder with " + addAmount + " energy for " + energyPrice, room.name);
	                    Game.market.extendOrder(buyorder[orderId].id, addAmount);
	                }
	                if (buyorder[orderId].price > energyPrice || (buyorder[orderId].price < energyPrice && buyorder[orderId].remainingAmount === 0)) {
	                    Logger_1.log.info("Updating price ofpraiseroom energy-buyorder to " + energyPrice, room.name);
	                    Game.market.changeOrderPrice(buyorder[orderId].id, energyPrice);
	                }
	            }
	        }
	        else {
	            Logger_1.log.info("Buyorder for praiseroom energy created.", room.name);
	            Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, energyPrice, 100000, room.name);
	        }
	    }
	    cleanUpInactiveOrders() {
	        let sellorders = _.filter(Game.market.orders, function (o) {
	            return o.type === ORDER_SELL && o.active === false && o.remainingAmount === 0;
	        });
	        for (let order of sellorders) {
	            Game.market.cancelOrder(order.id);
	        }
	    }
	    lookForGoodDeals(room, mineral, acceptOkeyDeals = false) {
	        if (!roomCanTrade(room)) {
	            return;
	        }
	        let amount = 5000;
	        if (mineral === RESOURCE_POWER) {
	            amount = 100;
	        }
	        let ordersForMineral = Game.market.getAllOrders(function (o) {
	            return o.type === ORDER_BUY && o.resourceType === mineral && o.amount >= amount;
	        });
	        if (ordersForMineral === undefined) {
	            return;
	        }
	        let mappedOrders = _.map(ordersForMineral, function (o) {
	            return { orderid: o.id, priceWithTransactionCost: o.price - (0.01 * Game.market.calcTransactionCost(1, room.name, o.roomName)) };
	        });
	        let minPrice = MarketManager.getResourcePrice(mineral);
	        if (minPrice === undefined) {
	            return;
	        }
	        let maxPrice = minPrice * 1.5;
	        if (acceptOkeyDeals) {
	            maxPrice = minPrice * 0.8;
	        }
	        let orderId = undefined;
	        for (let order of mappedOrders) {
	            if (maxPrice < order.priceWithTransactionCost) {
	                maxPrice = order.priceWithTransactionCost;
	                orderId = order.orderid;
	            }
	        }
	        if (orderId !== undefined) {
	            let wantedOrder = Game.market.getOrderById(orderId);
	            if (wantedOrder !== null) {
	                let amount = Math.min(wantedOrder.amount, 10000);
	                Game.market.deal(wantedOrder.id, amount, room.name);
	                Logger_1.log.info("Selling directly " +
	                    amount + " " + mineral + " for " + wantedOrder.price + " because of a good deal! Cost: " +
	                    Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName) + " (" + wantedOrder.id + ")", room.name);
	            }
	        }
	    }
	    sendPowerToOthers(room) {
	        if (!roomCanTrade(room)) {
	            return;
	        }
	        if (room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < TradeConfig.energyLimitForSendingMinerals) {
	            return;
	        }
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.controller !== undefined && potRoom.controller.level === 8 &&
	                potRoom.terminal !== undefined && !potRoom.isAbandoned() &&
	                (potRoom.terminal.store[RESOURCE_POWER] < (TradeConfig.batchSizeForSendingPower * 2) || potRoom.terminal.store[RESOURCE_POWER] === undefined)) {
	                room.terminal.send(RESOURCE_POWER, TradeConfig.batchSizeForSendingPower, potRoom.name);
	                Logger_1.log.info("Sending " +
	                    TradeConfig.batchSizeForSendingPower + " " + RESOURCE_POWER + " to room: " +
	                    potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingPower, room.name, potRoom.name) + " energy)", room.name);
	                return;
	            }
	        }
	    }
	    sellEverything(room) {
	        if (!roomCanTrade(room) || room.terminal === undefined) {
	            return false;
	        }
	        let inventory = Object.keys(room.terminal.store);
	        if (inventory.length > 1) {
	            for (let type of inventory) {
	                if (room.terminal.store[type] >= 100 && type !== RESOURCE_ENERGY) {
	                    if (this.sellOfResources(room, type)) {
	                        return true;
	                    }
	                }
	            }
	            if (room.terminal.store[RESOURCE_ENERGY] >= 1000) {
	                if (this.sellOfResources(room, RESOURCE_ENERGY)) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    sellOfResources(room, resource) {
	        if (!roomCanTrade(room)) {
	            return false;
	        }
	        let amount = 1000;
	        if (resource === RESOURCE_POWER) {
	            amount = 100;
	        }
	        else if (resource === RESOURCE_ENERGY) {
	            amount = 10000;
	        }
	        let ordersForMineral = Game.market.getAllOrders(function (o) {
	            return o.type === ORDER_BUY && o.resourceType === resource && o.amount >= amount;
	        });
	        if (ordersForMineral === undefined) {
	            return false;
	        }
	        let mappedOrders = _.map(ordersForMineral, function (o) {
	            return { orderid: o.id, priceWithTransactionCost: o.price - (0.005 * Game.market.calcTransactionCost(1, room.name, o.roomName)) };
	        });
	        let maxPrice = 0;
	        let orderId = undefined;
	        for (let order of mappedOrders) {
	            if (maxPrice < order.priceWithTransactionCost) {
	                maxPrice = order.priceWithTransactionCost;
	                orderId = order.orderid;
	            }
	        }
	        if (orderId !== undefined) {
	            let wantedOrder = Game.market.getOrderById(orderId);
	            if (wantedOrder !== null) {
	                let amount = Math.min(wantedOrder.amount, 10000);
	                let cost = Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName);
	                if (room.terminal !== undefined && room.terminal.store[RESOURCE_ENERGY] > cost) {
	                    Game.market.deal(wantedOrder.id, amount, room.name);
	                    Logger_1.log.info("Selling directly " + amount + " " + resource + " for " + wantedOrder.price + " because of overflow. Cost: " +
	                        Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName) + " (" + wantedOrder.id + ")", room.name);
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    sendUpgraderBoostToOthers(room) {
	        if (!roomCanTrade(room)) {
	            return;
	        }
	        if (room.terminal === undefined || room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < (TradeConfig.batchSizeForSendingUpgradeBoost * 2)) {
	            return;
	        }
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.controller !== undefined && potRoom.controller.level < 8 && !potRoom.isAbandoned() &&
	                potRoom.terminal !== undefined && (potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < (TradeConfig.batchSizeForSendingUpgradeBoost * 2) ||
	                potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] === undefined)) {
	                room.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID, TradeConfig.batchSizeForSendingUpgradeBoost, potRoom.name);
	                Logger_1.log.info("Sending " +
	                    TradeConfig.batchSizeForSendingUpgradeBoost + " " + RESOURCE_CATALYZED_GHODIUM_ACID + " to room: " +
	                    potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingUpgradeBoost, room.name, potRoom.name) + " energy)", room.name);
	                return;
	            }
	        }
	    }
	    sendMineralsToOthers(room, mineraltype) {
	        if (!roomCanTrade(room)) {
	            return false;
	        }
	        if (room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < TradeConfig.energyLimitForSendingMinerals) {
	            return false;
	        }
	        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
	            if (potRoom.name !== room.name && potRoom.controller !== undefined && potRoom.controller.level >= 6 && !potRoom.isAbandoned() &&
	                potRoom.terminal !== undefined && (potRoom.terminal.store[mineraltype] < (TradeConfig.batchSizeForSendingMinerals * 2) || potRoom.terminal.store[mineraltype] === undefined)) {
	                room.terminal.send(mineraltype, TradeConfig.batchSizeForSendingMinerals, potRoom.name);
	                Logger_1.log.info("Sending " +
	                    TradeConfig.batchSizeForSendingMinerals + " " + mineraltype + " to room: " +
	                    potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingMinerals, room.name, potRoom.name) + " energy)", room.name);
	                return true;
	            }
	        }
	        return false;
	    }
	    sendAwayEverything(room, energyToo = true) {
	        if (!roomCanTrade(room)) {
	            return;
	        }
	        if (room.terminal === undefined) {
	            return;
	        }
	        let terminalRooms = _.shuffle(_.filter(this.roomService.getNormalAndNotExpansion(), function (r) { return r.terminal !== undefined && r.name !== room.name && !r.isAbandoned(); }));
	        let inventory = Object.keys(room.terminal.store);
	        if (inventory.length > 1 && terminalRooms.length > 0) {
	            for (let type of inventory) {
	                if (room.terminal.store[type] >= 100 && type !== RESOURCE_ENERGY) {
	                    Logger_1.log.info("Sending " + Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]) + " " + type + " to room " + terminalRooms[0].name + " because room is being abandoned.", room.name);
	                    room.terminal.send(type, Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]), terminalRooms[0].name);
	                    return true;
	                }
	            }
	            if (energyToo) {
	                for (let type of inventory) {
	                    if (room.terminal.store[type] >= 100 && type === RESOURCE_ENERGY) {
	                        Logger_1.log.info("Sending " + Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]) + " " + type + " to room " + terminalRooms[0].name + " because room is being abandoned.", room.name);
	                        room.terminal.send(type, Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]), terminalRooms[0].name);
	                        return true;
	                    }
	                }
	            }
	        }
	    }
	}
	exports.TradeManager = TradeManager;
	function getTradeMinerals(room) {
	    let minerals = [];
	    if (room.terminal !== undefined) {
	        for (let m of basicMinerals) {
	            if (room.terminal.store[m] !== undefined && room.terminal.store[m] > TradeConfig.sendMineralsToOtherRoomsWhenAbove) {
	                minerals.push(m);
	            }
	        }
	    }
	    return minerals;
	}
	function maintainSellOrder(room, mineral) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let sellorder = _.filter(Game.market.orders, function (o) {
	        return o.type === ORDER_SELL && o.resourceType === mineral && o.roomName === room.name;
	    });
	    if (Object.keys(sellorder).length > 0) {
	        for (let orderId in sellorder) {
	            let sellPrice = MarketManager.getResourcePrice(mineral);
	            if (sellPrice !== undefined) {
	                if (sellorder[orderId].price > sellPrice || (sellorder[orderId].price < sellPrice && sellorder[orderId].remainingAmount === 0)) {
	                    Logger_1.log.info("Updating price " + mineral + ": " + sellPrice, room.name);
	                    Game.market.changeOrderPrice(sellorder[orderId].id, sellPrice);
	                }
	                if (sellorder[orderId].remainingAmount < 2000) {
	                    let addAmount = (10000 - sellorder[orderId].remainingAmount);
	                    Logger_1.log.info("Updating sellorder with " + addAmount + " " + mineral + " for " + sellPrice, room.name);
	                    Game.market.extendOrder(sellorder[orderId].id, addAmount);
	                }
	            }
	        }
	    }
	    else {
	        let sellPrice = MarketManager.getResourcePrice(mineral);
	        if (sellPrice !== undefined) {
	            Logger_1.log.info("Sellorder for 10000 " + mineral + " for " + sellPrice, room.name);
	            Game.market.createOrder(ORDER_SELL, mineral, sellPrice, 10000, room.name);
	        }
	    }
	}
	function roomCanTrade(room) {
	    if (room.terminal === undefined) {
	        return false;
	    }
	    if (room.terminal.cooldown > 0) {
	        return false;
	    }
	    return true;
	}
	function requestMineralsForLabs(room, mineral, count) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let allRooms = RoomUtilities.getAllControlledRooms();
	    count = count + 100;
	    let targetRoom = undefined;
	    let targetRoomMineral = 0;
	    for (let potRoom of allRooms) {
	        if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[mineral] > count + 4000 && potRoom.terminal.store[mineral] > targetRoomMineral) {
	            targetRoom = potRoom;
	            targetRoomMineral = potRoom.terminal.store[mineral];
	        }
	    }
	    if (targetRoom !== undefined && targetRoom.terminal !== undefined) {
	        targetRoom.terminal.send(mineral, count, room.name);
	        Logger_1.log.info("Sending " + count + " " + mineral + " to " + room.name + " because it is needed for labs (costing " +
	            Game.market.calcTransactionCost(count, targetRoom.name, room.name) + " energy)", targetRoom.name);
	    }
	    else {
	        buyMineralsForLabs(room, mineral, count);
	    }
	}
	exports.requestMineralsForLabs = requestMineralsForLabs;
	function requestMineralsForBoosting(room, mineral, count) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let allRooms = RoomUtilities.getAllControlledRooms();
	    count = count + 100;
	    let targetRoom = undefined;
	    let targetRoomMineral = 0;
	    for (let potRoom of allRooms) {
	        if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[mineral] > count && potRoom.terminal.store[mineral] > targetRoomMineral) {
	            targetRoom = potRoom;
	            targetRoomMineral = potRoom.terminal.store[mineral];
	        }
	    }
	    if (targetRoom !== undefined && targetRoom.terminal !== undefined) {
	        targetRoom.terminal.send(mineral, count, room.name);
	        Logger_1.log.info("Sending " + count + " " + mineral + " to " + room.name +
	            " because it is needed for boosting (costing " + Game.market.calcTransactionCost(count, targetRoom.name, room.name) + " energy)", targetRoom.name);
	    }
	    else {
	        buyMineralsForBoosting(room, mineral, count);
	    }
	}
	exports.requestMineralsForBoosting = requestMineralsForBoosting;
	function buyMineralsForBoosting(room, mineral, count) {
	    if (!roomCanTrade(room)) {
	        return;
	    }
	    count = count + 10;
	    let ordersForMineral = Game.market.getAllOrders(function (o) {
	        return o.type === ORDER_SELL && o.resourceType === mineral && o.amount >= count;
	    });
	    let minPrice = 10;
	    let orderId = undefined;
	    for (let order of ordersForMineral) {
	        if (minPrice > order.price) {
	            minPrice = order.price;
	            orderId = order.id;
	        }
	    }
	    if (orderId !== undefined) {
	        Game.market.deal(orderId, count, room.name);
	        Logger_1.log.info("Buying " + count + " " + mineral + " for " + minPrice + " because it is needed for boosting.", room.name);
	    }
	}
	exports.buyMineralsForBoosting = buyMineralsForBoosting;
	function buyMissingMinerals(room) {
	    if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < 10000) {
	        return false;
	    }
	    for (let min of basicMinerals) {
	        if (room.terminal.store[min] === undefined || room.terminal.store[min] < 2000) {
	            let ordersForMineral = Game.market.getAllOrders(function (o) {
	                return o.type === ORDER_SELL && o.resourceType === min && o.amount >= 1000;
	            });
	            let minPrice = 20;
	            let orderId = undefined;
	            let count = 0;
	            for (let order of ordersForMineral) {
	                if (minPrice > order.price) {
	                    minPrice = order.price;
	                    orderId = order.id;
	                    count = order.amount;
	                }
	            }
	            if (orderId !== undefined) {
	                Game.market.deal(orderId, Math.min(4000, count), room.name);
	                Logger_1.log.info("Buying " +
	                    Math.min(2000, count) + " " + min + " for " + minPrice + " because it is a mineral we are missing. (" + orderId + ")", room.name);
	                return true;
	            }
	        }
	    }
	    return false;
	}
	function buyMineralsForLabs(room, mineral, count) {
	    if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < 10000) {
	        return;
	    }
	    count = count + 10;
	    let ordersForMineral = Game.market.getAllOrders(function (o) {
	        return o.type === ORDER_SELL && o.resourceType === mineral && o.amount >= count;
	    });
	    let minPrice = 20;
	    let orderId = undefined;
	    for (let order of ordersForMineral) {
	        if (minPrice > order.price) {
	            minPrice = order.price;
	            orderId = order.id;
	        }
	    }
	    if (orderId !== undefined) {
	        Game.market.deal(orderId, count, room.name);
	        Logger_1.log.info("Buying " + count + " " + mineral + " for " + minPrice + " because it is needed for labs. (" + orderId + ")", room.name);
	    }
	}
	exports.buyMineralsForLabs = buyMineralsForLabs;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	class MarketManager extends _Manager_1.Manager {
	    constructor() {
	        super("MarketManager");
	        this.MEMORY_LASTRUN = "lastRun";
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 100 < Game.time) {
	                updateMarketPrices();
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	    }
	}
	exports.MarketManager = MarketManager;
	function getResourcePrice(resource) {
	    if (Memory.marketSell !== undefined && Memory.marketSell[resource] !== undefined) {
	        return Memory.marketSell[resource];
	    }
	    return undefined;
	}
	exports.getResourcePrice = getResourcePrice;
	function getResourceBuyPrice(resource) {
	    if (Memory.marketBuy !== undefined && Memory.marketBuy[resource] !== undefined) {
	        return Memory.marketBuy[resource];
	    }
	    return undefined;
	}
	exports.getResourceBuyPrice = getResourceBuyPrice;
	function updateMarketPrices() {
	    Memory.marketBuy = {};
	    Memory.marketSell = {};
	    let myActiveOrderIds = _.map(getMyActiveOrders(), function (o) { return o.id; });
	    for (let o of Game.market.getAllOrders()) {
	        if (o.amount >= 1000 && !_.contains(myActiveOrderIds, o.id)) {
	            if (o.type === ORDER_SELL && (Memory.marketSell[o.resourceType] === undefined || Memory.marketSell[o.resourceType] > o.price)) {
	                Memory.marketSell[o.resourceType] = o.price;
	            }
	            else if (o.type === ORDER_BUY && (Memory.marketBuy[o.resourceType] === undefined || Memory.marketBuy[o.resourceType] < o.price)) {
	                Memory.marketBuy[o.resourceType] = o.price;
	            }
	        }
	    }
	}
	function getMyActiveOrders() {
	    return _.filter(Game.market.orders, function (o) { return o.active; });
	}


/***/ }),
/* 88 */
/***/ (function(module, exports) {

	"use strict";
	var tradeConfig = {
	    sendToNeighboursWhenTerminalEnergyAbove: 100000,
	    sendToNeighboursWhenStorageEnergyAbove: 500000,
	    requestCrisisEnergyWhenTerminalEnergyBelow: 80000,
	    requestCrisisEnergyWhenStorageEnergyBelow: 30000,
	    energyLimitForSendingMinerals: 10000,
	    energyLimitForProvidingCrisisEnergy: 150000,
	    sendMineralsToOtherRoomsWhenAbove: 6000,
	    sendMineralsToGoodDealsWhenAbove: 150000,
	    sendMineralsToSellOrderWhenAbove: 100000,
	    sendMineralsToBuyOrdersWhenAbove: 200000,
	    sendEnergyToBuyOrdersWhenAbove: 600000,
	    sendPowerToBuyOrdersWhenAbove: 150000,
	    sendPowerWhenTerminalAbove: 12000,
	    sendPowerWhenStorageAbove: 50000,
	    sendUpgradeBoostWhenAbove: 4000,
	    batchSizeForSendingEnergy: 50000,
	    batchSizeForSendingEverythingOut: 10000,
	    batchSizeForSendingMinerals: 2000,
	    batchSizeForSendingPower: 2000,
	    batchSizeForSendingUpgradeBoost: 2000,
	    batchSizeForCrisisEnergy: 20000
	};
	module.exports = tradeConfig;


/***/ }),
/* 89 */
/***/ (function(module, exports) {

	"use strict";
	(function (BoostStage) {
	    BoostStage[BoostStage["ClearLab"] = 0] = "ClearLab";
	    BoostStage[BoostStage["BuyMinerals"] = 1] = "BuyMinerals";
	    BoostStage[BoostStage["LoadHauler"] = 2] = "LoadHauler";
	    BoostStage[BoostStage["UnloadHauler"] = 3] = "UnloadHauler";
	    BoostStage[BoostStage["BoostCreep"] = 4] = "BoostCreep";
	    BoostStage[BoostStage["ValidateBoost"] = 5] = "ValidateBoost";
	})(exports.BoostStage || (exports.BoostStage = {}));
	var BoostStage = exports.BoostStage;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const OperationHauler = __webpack_require__(91);
	const OperationHaul = __webpack_require__(67);
	const OperationDrain = __webpack_require__(92);
	const OperationGuard = __webpack_require__(68);
	const OperationSpawnmove = __webpack_require__(13);
	const operationtypes_1 = __webpack_require__(15);
	const role_1 = __webpack_require__(16);
	class OperationManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("OperationManager");
	        this.MEMORY_OPERATIONSMAINTAINENCE = "maintain";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.OperationHauler, OperationHauler.run);
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let lastRunShorterm = this.getValue(this.MEMORY_OPERATIONSMAINTAINENCE);
	            if (lastRunShorterm === undefined || lastRunShorterm + 1000 < Game.time) {
	                this.deleteOldOperations();
	                this.setValue(this.MEMORY_OPERATIONSMAINTAINENCE, Game.time);
	            }
	        }
	        if (Memory.operations === undefined) {
	            Memory.operations = [];
	        }
	        for (let operation of Memory.operations) {
	            switch (operation.operationtype) {
	                case operationtypes_1.OperationType.Haul:
	                    if (operation.active && !OperationHaul.victoryConditionReached(operation)) {
	                        OperationHaul.run(operation, this.creepService, pri);
	                    }
	                    else {
	                        operation.active = false;
	                    }
	                    break;
	                case operationtypes_1.OperationType.Drain:
	                    if (operation.active && !OperationDrain.victoryConditionReached(operation)) {
	                        OperationDrain.run(operation, this.creepService, pri);
	                    }
	                    else {
	                        operation.active = false;
	                    }
	                    break;
	                case operationtypes_1.OperationType.Guard:
	                    if (operation.active && !OperationGuard.victoryConditionReached(operation)) {
	                        OperationGuard.run(operation, this.creepService, pri);
	                    }
	                    else {
	                        operation.active = false;
	                    }
	                    break;
	                case operationtypes_1.OperationType.Spawnmove:
	                    if (operation.active && !OperationSpawnmove.victoryConditionReached(operation)) {
	                        OperationSpawnmove.run(operation, pri, this.creepService);
	                    }
	                    else {
	                        operation.active = false;
	                    }
	                    break;
	            }
	        }
	    }
	    deleteOldOperations() {
	        if (Memory.operations === undefined) {
	            Memory.operations = [];
	        }
	        let removed = _.remove(Memory.operations, (o) => o.active === false);
	        if (removed.length > 0) {
	            console.log("Removed " + removed.length + " finished operations.");
	        }
	    }
	}
	exports.OperationManager = OperationManager;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	const PathfindingUtilities = __webpack_require__(3);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["TankUpInHomeroom"] = 1] = "TankUpInHomeroom";
	    State[State["MoveToTargetRoom"] = 2] = "MoveToTargetRoom";
	    State[State["TransferEnergyToStructure"] = 3] = "TransferEnergyToStructure";
	    State[State["MoveToHomeroom"] = 4] = "MoveToHomeroom";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.TankUpInHomeroom);
	    }
	    switch (creep.getState()) {
	        case State.TankUpInHomeroom:
	            runTankUpInHomeroom(creep);
	            break;
	        case State.MoveToTargetRoom:
	            runMoveToTargetRoom(creep);
	            break;
	        case State.TransferEnergyToStructure:
	            runTransferEnergyToStructure(creep);
	            break;
	        case State.MoveToHomeroom:
	            runMoveToHomeroom(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MoveToHomeroom);
	            break;
	    }
	}
	exports.run = run;
	function runTankUpInHomeroom(creep) {
	    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
	        creep.room.storage !== undefined) {
	        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	        if (distanceToStorage > 1) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        creep.setState(State.MoveToTargetRoom);
	        runMoveToTargetRoom(creep);
	    }
	}
	function runMoveToTargetRoom(creep) {
	    let targetRoom = creep.memory.target;
	    if (targetRoom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(targetRoom, { allowHostile: false }, true);
	    }
	    else {
	        creep.setState(State.TransferEnergyToStructure);
	        runTransferEnergyToStructure(creep);
	    }
	}
	function runTransferEnergyToStructure(creep) {
	    if (creep.carry.energy === 0) {
	        if (!shouldShouldAnotherRun(creep)) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    if (creep.room.storage === undefined) {
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	    if (distanceToStorage > 1) {
	        creep.travelTo(creep.room.storage);
	    }
	    else {
	        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	    }
	}
	function runMoveToHomeroom(creep) {
	    let homeroom = creep.memory.homeroom;
	    if (homeroom !== creep.room.name) {
	        creep.travelToRoom(homeroom, { allowHostile: false }, true);
	    }
	    else {
	        creep.setState(State.TankUpInHomeroom);
	        runTankUpInHomeroom(creep);
	    }
	}
	function shouldShouldAnotherRun(creep) {
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    if (homeroom == undefined || homeroom.terminal === undefined) {
	        return true;
	    }
	    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, homeroom.terminal.pos);
	    return creep.ticksToLive > distanceToTerminal * 2.1;
	}


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const operationtypes_1 = __webpack_require__(15);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const ProfileUtilities = __webpack_require__(19);
	const PathfindingUtilities = __webpack_require__(3);
	(function (VictoryCondition) {
	    VictoryCondition[VictoryCondition["HostileRoomEnergy"] = 1] = "HostileRoomEnergy";
	    VictoryCondition[VictoryCondition["Gametime"] = 2] = "Gametime";
	})(exports.VictoryCondition || (exports.VictoryCondition = {}));
	var VictoryCondition = exports.VictoryCondition;
	class Data {
	    constructor() {
	        this.operationtype = operationtypes_1.OperationType.Drain;
	        this.active = true;
	    }
	}
	exports.Data = Data;
	function run(operation, creepService, pri) {
	    if (pri === _Manager_1.ManagerPriority.Standard) {
	        if (Game.time % 50 === 0) {
	            checkDrainerAmount(operation, creepService);
	        }
	    }
	}
	exports.run = run;
	function victoryConditionReached(operation) {
	    let targetRoom = Game.rooms[operation.targetRoom];
	    if (!(targetRoom instanceof Room)) {
	        return false;
	    }
	    switch (operation.victoryCondition) {
	        case VictoryCondition.HostileRoomEnergy:
	            let towers = targetRoom.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
	            let towerEnergy = _.sum(towers, (t) => t.energy);
	            if (towerEnergy === 0 && (targetRoom.storage === undefined || targetRoom.storage.store[RESOURCE_ENERGY] === 0) &&
	                (targetRoom.terminal === undefined || targetRoom.terminal.store[RESOURCE_ENERGY] === 0)) {
	                operation.active = false;
	                return true;
	            }
	            break;
	        case VictoryCondition.Gametime:
	            if (Game.time > operation.victoryValue) {
	                operation.active = false;
	                return true;
	            }
	    }
	    return false;
	}
	exports.victoryConditionReached = victoryConditionReached;
	function checkDrainerAmount(operation, creepService) {
	    let spawnRoom = Game.rooms[operation.spawnRoom];
	    if (!(spawnRoom instanceof Room) || spawnRoom.storage === undefined) {
	        return;
	    }
	    if (operation.distanceToTargetRoom === undefined) {
	        let toPos = new RoomPosition(25, 25, operation.targetRoom);
	        operation.distanceToTargetRoom = PathfindingUtilities.getDistanseBetween(spawnRoom.storage.pos, toPos);
	    }
	    let current = creepService.getCreeps(role_1.Role.Drainer, null, operation.spawnRoom).length;
	    let ordered = OrdersRepository.getCreepsInQueue(spawnRoom, role_1.Role.Drainer);
	    if (current + ordered < 2) {
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getDrainerBody(operation.tier);
	        order.priority = priority_1.Priority.Low;
	        order.memory = { role: role_1.Role.Drainer, route: operation.targetRoute, tier: operation.tier };
	        OrdersRepository.orderCreep(spawnRoom, order);
	    }
	}


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const roomtype_1 = __webpack_require__(9);
	const Praiser = __webpack_require__(94);
	const PraiserHauler = __webpack_require__(97);
	const PraiserLeader = __webpack_require__(98);
	const ProfileUtilities = __webpack_require__(19);
	const PathfindingUtilities = __webpack_require__(3);
	const PrayerLib = __webpack_require__(95);
	const BuildLib = __webpack_require__(83);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const role_1 = __webpack_require__(16);
	const praisestatus_1 = __webpack_require__(96);
	const priority_1 = __webpack_require__(17);
	const Logger_1 = __webpack_require__(7);
	class PraiseroomManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("PraiseroomManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            this.creepService.runCreeps(role_1.Role.PraiserWithBoost, Praiser.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.PraiserLeader, PraiserLeader.run);
	            this.creepService.runCreeps(role_1.Role.PraiserOfficer, PraiserLeader.run);
	            let praiseRooms = this.roomService.getPraiseRooms();
	            for (let praiseRoom of praiseRooms) {
	                if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
	                    if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising ||
	                        praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.PreparingReset ||
	                        praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
	                        this.runPraising(praiseRoom);
	                    }
	                }
	            }
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 30 < Game.time) {
	                let roomsWithPraiseroom = this.roomService.getNormalWithPraiseroom();
	                this.runPraiserooms(roomsWithPraiseroom);
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.PraiserWithoutBoost, Praiser.run);
	            this.creepService.runCreeps(role_1.Role.PraiserSupport, Praiser.run);
	            this.creepService.runCreeps(role_1.Role.PraiserHauler, PraiserHauler.run);
	        }
	    }
	    runPraiserooms(roomsWithPraiseroom) {
	        for (let room of roomsWithPraiseroom) {
	            let praiseRoom = Game.rooms[room.memory.praiseroom];
	            if (praiseRoom === undefined || (praiseRoom.controller !== undefined && !praiseRoom.controller.my && !room.memory.praiseroomHibernated)) {
	                this.orderRoomClaimer(room, room.memory.praiseroom);
	                if (Memory.rooms[room.memory.praiseroom] === undefined) {
	                    Memory.rooms[room.memory.praiseroom] = {};
	                }
	                Memory.rooms[room.memory.praiseroom].isPraiseRoom = true;
	            }
	            praiseRoom.memory.t = roomtype_1.Roomtype.Praiseroom;
	            if (!room.memory.praiseroomHibernated) {
	                this.buildPraiseBuildings(praiseRoom);
	            }
	            else {
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.PreparingHibernate;
	            }
	            if (praiseRoom.controller !== undefined && praiseRoom.controller.my) {
	                this.setPraiseStatus(praiseRoom);
	                this.orderPraisers(room, praiseRoom.name, this.getWantedPraiserCount(praiseRoom));
	                if (this.isDoublePraising(praiseRoom)) {
	                    this.orderPraiserSupporters(room, praiseRoom.name);
	                }
	                if (this.shouldWeOrderHaulers(praiseRoom)) {
	                    this.orderPraiserHaulers(room, praiseRoom.name);
	                }
	                if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising || praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.PreparingReset ||
	                    praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
	                    this.orderPraiserLeader(room, praiseRoom.name);
	                }
	                if (praiseRoom.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising && this.isDoublePraising(praiseRoom)) {
	                    this.orderPraiserOfficer(room, praiseRoom.name);
	                }
	            }
	        }
	    }
	    isDoublePraising(praiseRoom) {
	        if (praiseRoom.controller === undefined) {
	            return false;
	        }
	        if (praiseRoom.controller.level !== 7 || praiseRoom.memory.doublepraiser !== true) {
	            return false;
	        }
	        if (praiseRoom.find(FIND_MY_SPAWNS).length !== 2) {
	            return false;
	        }
	        let spawn = praiseRoom.getSpawn();
	        if (spawn === undefined) {
	            return false;
	        }
	        if (PrayerLib.getContainer(praiseRoom, spawn.pos) === undefined) {
	            return false;
	        }
	        return true;
	    }
	    runPraising(praiseRoom) {
	        let spawn = praiseRoom.getSpawn();
	        let storage = praiseRoom.storage;
	        if (spawn === undefined || storage === undefined) {
	            Logger_1.log.error("Praiseroom missing spawn or storage", praiseRoom.name);
	            return;
	        }
	        let leader = this.getPraiserLeader(praiseRoom);
	        let creepInHealingPos = this.getHealingPraiser(praiseRoom, storage.pos);
	        let nextCreepInHealingPos = this.getNextHealingPraiser(praiseRoom, storage.pos);
	        if (praiseRoom.memory.rotationDone) {
	            this.boostPraisersIfShouldAndCan(praiseRoom);
	            praiseRoom.memory.rotationDone = undefined;
	            if (creepInHealingPos !== undefined) {
	                creepInHealingPos.memory.checkRamparts = true;
	            }
	        }
	        if ((Game.time % 366 === 0 && (creepInHealingPos === undefined || (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1470))) ||
	            (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive >= 1485 &&
	                (nextCreepInHealingPos === undefined || (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 100)))) {
	            this.assignPositionsToPraisers(praiseRoom, storage);
	            Logger_1.log.info("Rotating praisers in praiserroom", praiseRoom.name);
	            praiseRoom.memory.rotationDone = true;
	        }
	        if (leader !== undefined && leader.ticksToLive < 1000) {
	            spawn.renewCreep(leader);
	        }
	        else if (nextCreepInHealingPos !== undefined && nextCreepInHealingPos.ticksToLive < 10) {
	            spawn.renewCreep(nextCreepInHealingPos);
	        }
	        else if (creepInHealingPos !== undefined && creepInHealingPos.ticksToLive < 1485 &&
	            ((creepInHealingPos.body[0].boost && creepInHealingPos.ticksToLive < 10) || !creepInHealingPos.body[0].boost)) {
	            spawn.renewCreep(creepInHealingPos);
	        }
	        let spawn2 = PrayerLib.getSpawn2(praiseRoom, spawn.pos);
	        if (!this.isDoublePraising(praiseRoom) || spawn2 === undefined) {
	            return;
	        }
	        let officer = this.getPraiserOfficer(praiseRoom);
	        let supporterInHealingPos = this.getHealingSupporter(praiseRoom, storage.pos);
	        let nextSupporterInHealingPos = this.getNextHealingSupporter(praiseRoom, storage.pos);
	        if (praiseRoom.memory.rotationDone) {
	            this.assignPositionsToSupporters(praiseRoom, spawn2);
	        }
	        if (officer !== undefined && officer.ticksToLive < 1000) {
	            spawn2.renewCreep(officer);
	        }
	        else if (nextSupporterInHealingPos !== undefined && nextSupporterInHealingPos.ticksToLive < 10) {
	            spawn2.renewCreep(nextSupporterInHealingPos);
	        }
	        else if (supporterInHealingPos !== undefined && supporterInHealingPos.ticksToLive < 1485) {
	            spawn2.renewCreep(supporterInHealingPos);
	        }
	    }
	    boostPraisersIfShouldAndCan(praiseRoom) {
	        if (praiseRoom.storage === undefined || praiseRoom.terminal === undefined || praiseRoom.controller === undefined) {
	            return;
	        }
	        let creepInBoostingPos = this.getBoostingPraiser(praiseRoom, praiseRoom.storage.pos);
	        if (creepInBoostingPos === undefined || creepInBoostingPos.body[0].boost || creepInBoostingPos.ticksToLive < 1470) {
	            return;
	        }
	        if (praiseRoom.controller.level < 6 || praiseRoom.controller.level > 7 ||
	            (praiseRoom.controller.level === 7 && praiseRoom.controller.progress > praiseRoom.controller.progressTotal * 0.95)) {
	            return;
	        }
	        let lab = PrayerLib.getBoosterLab(praiseRoom, praiseRoom.storage.pos);
	        if (lab === undefined) {
	            return;
	        }
	        if (lab.mineralAmount === lab.mineralCapacity && lab.mineralType === RESOURCE_CATALYZED_GHODIUM_ACID) {
	            lab.boostCreep(creepInBoostingPos);
	            Logger_1.log.info("Boosting praisers in praiserroom", praiseRoom.name);
	        }
	    }
	    assignPositionsToPraisers(praiseRoom, storage) {
	        let positions = PrayerLib.getPraiserPositions(praiseRoom, storage.pos);
	        let praisers = this.getPraisersSortedByTicksToLive(praiseRoom);
	        for (let posIndex in positions) {
	            if (praisers[posIndex] instanceof Creep) {
	                praisers[posIndex].memory.wantedPos = positions[posIndex];
	            }
	            else {
	                return;
	            }
	        }
	    }
	    getPraisersSortedByTicksToLive(praiseRoom) {
	        let praisers = this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name);
	        return praisers.sort(function (a, b) {
	            return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
	        });
	    }
	    assignPositionsToSupporters(praiseRoom, spawn2) {
	        let positions = PrayerLib.getSupporterPositions(praiseRoom, spawn2.pos);
	        let praisers = this.getSupportersSortedByTicksToLive(praiseRoom);
	        for (let posIndex in positions) {
	            if (praisers[posIndex] instanceof Creep) {
	                praisers[posIndex].memory.wantedPos = positions[posIndex];
	            }
	            else {
	                return;
	            }
	        }
	    }
	    getSupportersSortedByTicksToLive(praiseRoom) {
	        let praisers = this.creepService.getCreeps(role_1.Role.PraiserSupport, praiseRoom.name);
	        return praisers.sort(function (a, b) {
	            return (a.ticksToLive > b.ticksToLive) ? 1 : ((b.ticksToLive > a.ticksToLive) ? -1 : 0);
	        });
	    }
	    getBoostingPraiser(room, storagePos) {
	        let boostPos = PrayerLib.getBoostCreepPos(room, storagePos);
	        let atPos = boostPos.lookFor(LOOK_CREEPS);
	        if (atPos.length > 0) {
	            return atPos[0];
	        }
	        return undefined;
	    }
	    getHealingPraiser(room, storagePos) {
	        let healPos = PrayerLib.getHealCreepPos(room, storagePos);
	        let atPos = healPos.lookFor(LOOK_CREEPS);
	        if (atPos.length > 0) {
	            return atPos[0];
	        }
	        return undefined;
	    }
	    getHealingSupporter(room, storagePos) {
	        let healPos = PrayerLib.getHealSupporterPos(room, storagePos);
	        let atPos = healPos.lookFor(LOOK_CREEPS);
	        if (atPos.length > 0) {
	            return atPos[0];
	        }
	        return undefined;
	    }
	    getNextHealingPraiser(room, storagePos) {
	        let healPos = PrayerLib.getNextHealCreepPos(room, storagePos);
	        let atPos = healPos.lookFor(LOOK_CREEPS);
	        if (atPos.length > 0) {
	            return atPos[0];
	        }
	        return undefined;
	    }
	    getNextHealingSupporter(room, storagePos) {
	        let healPos = PrayerLib.getNextHealSupporterPos(room, storagePos);
	        let atPos = healPos.lookFor(LOOK_CREEPS);
	        if (atPos.length > 0) {
	            return atPos[0];
	        }
	        return undefined;
	    }
	    getPraiserLeader(praiseRoom) {
	        let leaders = this.creepService.getCreeps(role_1.Role.PraiserLeader, praiseRoom.name);
	        if (leaders.length > 0) {
	            return leaders[0];
	        }
	        return undefined;
	    }
	    getPraiserOfficer(praiseRoom) {
	        let leaders = this.creepService.getCreeps(role_1.Role.PraiserOfficer, praiseRoom.name);
	        if (leaders.length > 0) {
	            return leaders[0];
	        }
	        return undefined;
	    }
	    setPraiseStatus(praiseRoom) {
	        if (praiseRoom.controller === undefined || !praiseRoom.controller.my) {
	            return;
	        }
	        else if (praiseRoom.memory.praiseStatus == praisestatus_1.PraiseStatus.PreparingHibernate) {
	            if (this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name).length === 0) {
	                praiseRoom.controller.unclaim();
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Hiberate;
	            }
	        }
	        else if (praiseRoom.controller.level < 6 || (praiseRoom.controller.level === 6 && praiseRoom.terminal === undefined)) {
	            if (praiseRoom.terminal === undefined) {
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Establishing;
	            }
	            else {
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Reestablishing;
	            }
	        }
	        else if (praiseRoom.controller.level === 8) {
	            if (praiseRoom.storage !== undefined && praiseRoom.storage.store[RESOURCE_ENERGY] > praiseRoom.storage.storeCapacity - 10000) {
	                if (praiseRoom.memory.praiseStatus !== praisestatus_1.PraiseStatus.Reestablishing) {
	                    this.removePraisersForReset(praiseRoom);
	                    praiseRoom.controller.unclaim();
	                }
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Reestablishing;
	            }
	            else {
	                if (praiseRoom.memory.praiseStatus !== praisestatus_1.PraiseStatus.PreparingReset) {
	                    this.removePraisersForReset(praiseRoom);
	                }
	                praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.PreparingReset;
	            }
	        }
	        else if (praiseRoom.storage !== undefined && praiseRoom.terminal !== undefined) {
	            praiseRoom.memory.praiseStatus = praisestatus_1.PraiseStatus.Praising;
	        }
	        else {
	            Logger_1.log.error("PraiseManager could not find a valid status for praiseroom", praiseRoom.name);
	        }
	    }
	    removePraisersForReset(praiseRoom) {
	        let currentPraisers = this.creepService.getCreeps(role_1.Role.Praiser, praiseRoom.name);
	        let count = 0;
	        for (let praiser of currentPraisers) {
	            count++;
	            if (count > 6) {
	                praiser.suicide();
	            }
	        }
	        let currentSupporters = this.creepService.getCreeps(role_1.Role.PraiserSupport, praiseRoom.name);
	        for (let supporter of currentSupporters) {
	            supporter.suicide();
	        }
	    }
	    shouldWeOrderHaulers(praiseRoom) {
	        return praiseRoom.terminal === undefined ||
	            (!praiseRoom.terminal.isActive() && praiseRoom.storage !== undefined &&
	                praiseRoom.storage.isActive() && praiseRoom.storage.store[RESOURCE_ENERGY] < 950000);
	    }
	    getWantedPraiserCount(praiseRoom) {
	        switch (praiseRoom.memory.praiseStatus) {
	            case praisestatus_1.PraiseStatus.Establishing:
	                return 3;
	            case praisestatus_1.PraiseStatus.Reestablishing:
	                return 6;
	            case praisestatus_1.PraiseStatus.Praising:
	                return 7;
	            default:
	                return 0;
	        }
	    }
	    buildPraiseBuildings(room) {
	        if (room.controller === undefined || !room.controller.my) {
	            return;
	        }
	        let spawn = room.getSpawn();
	        if (spawn === undefined && room.controller.level > 0) {
	            let flags = room.find(FIND_FLAGS, { filter: (f) => f.name === "praise" && f.pos.roomName === room.name });
	            if (flags.length === 1) {
	                let flag = flags[0];
	                if (room.find(FIND_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_SPAWN }).length > 0) {
	                    flag.remove();
	                }
	                else {
	                    let spawnPos = PrayerLib.getSpawn1Pos(room, flag.pos);
	                    BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
	                }
	            }
	            else if (room.storage !== undefined) {
	                let spawnPos = PrayerLib.getSpawn1Pos(room, room.storage.pos);
	                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawnPos, 0, 0, true, false);
	            }
	        }
	        else if (spawn instanceof StructureSpawn) {
	            let spawnPos = spawn.pos;
	            if (room.controller.level >= 4 && room.storage === undefined) {
	                let storagePos = PrayerLib.getStoragePos(room, spawnPos);
	                BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, storagePos, 0, 0, true, false);
	            }
	            if (room.controller.level >= 6 && room.terminal === undefined) {
	                let terminalPos = PrayerLib.getTerminalPos(room, spawnPos);
	                BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, terminalPos, 0, 0, true, false);
	            }
	            if (room.controller.level === 6 && room.storage !== undefined) {
	                let labPos = PrayerLib.getLabPos(room, room.storage.pos);
	                BuildLib.buildIfNotPresent(STRUCTURE_LAB, labPos, 0, 0, true, false);
	            }
	            if (room.controller.level > 5) {
	                buildRampartsOnImportantBuildings(room);
	            }
	            if (room.controller.level === 7 && room.memory.doublepraiser === true) {
	                let spawn2pos = PrayerLib.getSpawn2Pos(room, spawnPos);
	                BuildLib.buildIfNotPresent(STRUCTURE_SPAWN, spawn2pos, 0, 0, true, false);
	                let containerpos = PrayerLib.getContainerPos(room, spawnPos);
	                BuildLib.buildIfNotPresent(STRUCTURE_CONTAINER, containerpos, 0, 0, true, false);
	            }
	        }
	    }
	    orderRoomClaimer(room, targetRoom) {
	        let maxTier = ProfileUtilities.getMaxTierClaimer(room.energyCapacityAvailable);
	        let usedTier = Math.min(maxTier, 1);
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.RoomClaimer, targetRoom);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.RoomClaimer, targetRoom);
	        let neededTiers = 1;
	        if (neededTiers > currentTiers + orderedTiers) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getClaimerBody(usedTier);
	            order.priority = priority_1.Priority.Critical;
	            order.memory = { role: role_1.Role.RoomClaimer, target: targetRoom, tier: usedTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderPraiserHaulers(room, targetRoom) {
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let current = this.creepService.getCreeps(role_1.Role.PraiserHauler, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserHauler, targetRoom);
	        let needed = 10;
	        let praiseRoom = Game.rooms[targetRoom];
	        if (room.storage !== undefined && praiseRoom !== undefined && praiseRoom.controller !== undefined) {
	            needed = Math.ceil(PathfindingUtilities.getDistanseBetween(room.storage.pos, praiseRoom.controller.pos) / 5);
	        }
	        if (needed > current + ordered) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getHaulerBody(maxTier);
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.PraiserHauler, target: targetRoom, tier: maxTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderPraiserLeader(room, targetRoom) {
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let current = this.creepService.getCreeps(role_1.Role.PraiserLeader, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserLeader, targetRoom);
	        if (current + ordered === 0) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getHaulerBody(maxTier);
	            order.priority = priority_1.Priority.Important;
	            order.memory = { role: role_1.Role.PraiserLeader, target: targetRoom, tier: maxTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderPraiserOfficer(room, targetRoom) {
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let current = this.creepService.getCreeps(role_1.Role.PraiserOfficer, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserOfficer, targetRoom);
	        if (current + ordered === 0) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getHaulerBody(maxTier);
	            order.priority = priority_1.Priority.Important;
	            order.memory = { role: role_1.Role.PraiserOfficer, target: targetRoom, tier: maxTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderPraisers(room, targetRoom, needed) {
	        let current = this.creepService.getCreeps(role_1.Role.Praiser, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Praiser, targetRoom);
	        if (needed > current + ordered) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getPraiserBody();
	            order.priority = priority_1.Priority.Important;
	            order.memory = { role: role_1.Role.Praiser, target: targetRoom, tier: 1 };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderPraiserSupporters(room, targetRoom) {
	        let current = this.creepService.getCreeps(role_1.Role.PraiserSupport, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PraiserSupport, targetRoom);
	        if (7 > current + ordered) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getPraiserBody();
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.PraiserSupport, target: targetRoom, tier: 1 };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	}
	exports.PraiseroomManager = PraiseroomManager;
	function buildRampartsOnImportantBuildings(room) {
	    let spawn1 = room.getSpawn();
	    if (spawn1 === undefined) {
	        return;
	    }
	    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn1.pos, 0, 0, true, false);
	    if (room.storage === undefined) {
	        return;
	    }
	    BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.storage.pos, 0, 0, true, false);
	    if (room.terminal !== undefined) {
	        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, room.terminal.pos, 0, 0, true, false);
	    }
	    let lab = PrayerLib.getBoosterLab(room, room.storage.pos);
	    if (lab !== undefined) {
	        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, lab.pos, 0, 0, true, false);
	    }
	    let spawn2 = PrayerLib.getSpawn2(room, spawn1.pos);
	    if (spawn2 !== undefined) {
	        BuildLib.buildIfNotPresent(STRUCTURE_RAMPART, spawn2.pos, 0, 0, true, false);
	    }
	}


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const PositionLib = __webpack_require__(46);
	const PrayerLib = __webpack_require__(95);
	const praisestatus_1 = __webpack_require__(96);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MoveToPraiseroom"] = 1] = "MoveToPraiseroom";
	    State[State["GetEnergyFromStorage"] = 2] = "GetEnergyFromStorage";
	    State[State["Praising"] = 3] = "Praising";
	    State[State["Constructing"] = 5] = "Constructing";
	    State[State["Renewing"] = 6] = "Renewing";
	    State[State["SuperPraising"] = 7] = "SuperPraising";
	    State[State["DoublePraising"] = 8] = "DoublePraising";
	    State[State["Fortify"] = 9] = "Fortify";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToPraiseroom);
	    }
	    checkIfPraisingIsFinished(creep);
	    switch (creep.getState()) {
	        case State.MoveToPraiseroom:
	            runMoveToPraiseroom(creep);
	            break;
	        case State.GetEnergyFromStorage:
	            runGetEnergyFromStorage(creep);
	            break;
	        case State.Praising:
	            runPraising(creep);
	            break;
	        case State.SuperPraising:
	            runSuperPraising(creep);
	            break;
	        case State.DoublePraising:
	            runDoublePraising(creep);
	            break;
	        case State.Constructing:
	            runConstructing(creep);
	            break;
	        case State.Renewing:
	            runRenewing(creep);
	            break;
	        case State.Fortify:
	            runFortify(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MoveToPraiseroom);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToPraiseroom(creep) {
	    let praiseroom = creep.memory.target;
	    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(praiseroom);
	    }
	    else {
	        if (creep.memory.role === role_1.Role.PraiserSupport) {
	            creep.setState(State.DoublePraising);
	            runDoublePraising(creep);
	        }
	        else {
	            creep.setState(State.Constructing);
	            runConstructing(creep);
	        }
	    }
	}
	function runRenewing(creep) {
	    if (creep.room.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising || creep.room.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
	        creep.setState(State.SuperPraising);
	        return;
	    }
	    let spawn = creep.room.getSpawn();
	    if (creep.ticksToLive > 1400 || spawn === undefined ||
	        (creep.room.energyAvailable < 50 && creep.carry.energy === 0)) {
	        creep.room.memory.renewing = undefined;
	        creep.setState(State.Praising);
	        runPraising(creep);
	        return;
	    }
	    let distanceToSpawn = creep.pos.getRangeTo(spawn.pos);
	    if (distanceToSpawn > 1) {
	        creep.moveTo(spawn);
	    }
	    else {
	        if (creep.carry.energy > 0 && spawn.energy < spawn.energyCapacity / 2) {
	            creep.transfer(spawn, RESOURCE_ENERGY);
	        }
	        else if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity &&
	            creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	        spawn.renewCreep(creep);
	    }
	    if (creep.room.controller === undefined) {
	        return;
	    }
	    let distanceToSite = creep.pos.getRangeTo(creep.room.controller);
	    if (distanceToSite < 4) {
	        let response = creep.upgradeController(creep.room.controller);
	        if (response === OK) {
	            if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	            }
	            if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	            }
	            else {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	            }
	        }
	    }
	}
	function runGetEnergyFromStorage(creep) {
	    if (creep.carry.energy > 0) {
	        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, { filter: (s) => s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_TERMINAL ||
	                s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_LAB });
	        if (constructionsites.length > 0) {
	            creep.setState(State.Constructing);
	            runConstructing(creep);
	            return;
	        }
	        creep.setState(State.Praising);
	        runPraising(creep);
	        return;
	    }
	    if (creep.room.storage !== undefined) {
	        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	        if (distanceToStorage > 1) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	}
	function runSuperPraising(creep) {
	    if (creep.room.controller === undefined) {
	        Logger_1.log.error("Praising in room without owned controller", creep.room.name);
	        return;
	    }
	    if (!creep.room.controller.my) {
	        if (creep.fatigue === 0) {
	            moveAwayFromController(creep);
	        }
	        return;
	    }
	    if (creep.memory.checkRamparts) {
	        creep.memory.checkRamparts = undefined;
	        creep.setState(State.Fortify);
	        runFortify(creep);
	        return;
	    }
	    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
	        creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
	        let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
	        let range = creep.pos.getRangeTo(wantedPos);
	        if (range === 1) {
	            creep.moveTo(wantedPos, { ignoreCreeps: true });
	        }
	        else if (range > 1) {
	            creep.moveTo(wantedPos);
	        }
	    }
	    if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity) {
	        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	    }
	    let response = creep.upgradeController(creep.room.controller);
	    if (response === OK) {
	        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	        }
	        if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	        }
	        else {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	        }
	    }
	}
	function runDoublePraising(creep) {
	    if (creep.room.controller === undefined) {
	        Logger_1.log.error("Praising in room without owned controller", creep.room.name);
	        return;
	    }
	    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
	        creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
	        let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
	        let range = creep.pos.getRangeTo(wantedPos);
	        if (range === 1) {
	            creep.moveTo(wantedPos, { ignoreCreeps: true });
	        }
	        else if (range > 1) {
	            creep.moveTo(wantedPos);
	        }
	    }
	    else {
	        let c = Game.getObjectById(creep.memory.containerId);
	        if (c !== null) {
	            creep.moveTo(c);
	        }
	    }
	    let container = Game.getObjectById(creep.memory.containerId);
	    if (container === null) {
	        let spawn1 = creep.room.getSpawn();
	        if (spawn1 === undefined) {
	            Logger_1.log.error("Spawn1 missing in praiseroom", creep.room.name);
	            return;
	        }
	        let tempContainer = PrayerLib.getContainer(creep.room, spawn1.pos);
	        if (tempContainer === undefined) {
	            Logger_1.log.error("Container missing in praiseroom", creep.room.name);
	            return;
	        }
	        creep.memory.containerId = tempContainer.id;
	        container = tempContainer;
	    }
	    if (creep.carry.energy < creep.carryCapacity) {
	        creep.withdraw(container, RESOURCE_ENERGY);
	    }
	    let response = creep.upgradeController(creep.room.controller);
	    if (response === OK) {
	        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	        }
	        Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	    }
	}
	function runFortify(creep) {
	    if (creep.memory.wantedPos !== undefined && creep.memory.wantedPos.x !== undefined &&
	        creep.memory.wantedPos.y !== undefined && creep.memory.wantedPos.roomName !== undefined) {
	        let wantedPos = new RoomPosition(creep.memory.wantedPos.x, creep.memory.wantedPos.y, creep.memory.wantedPos.roomName);
	        let range = creep.pos.getRangeTo(wantedPos);
	        if (range > 0) {
	            creep.memory.rampart = undefined;
	            creep.setState(State.SuperPraising);
	            runSuperPraising(creep);
	            return;
	        }
	    }
	    let target = Game.getObjectById(creep.memory.rampart);
	    if (target !== null && target.hits > 1000000) {
	        creep.memory.rampart = undefined;
	        target = null;
	    }
	    if (target === null) {
	        let ramparts = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_RAMPART && s.hits < 500000 });
	        if (ramparts.length === 0) {
	            creep.memory.rampart = undefined;
	            creep.setState(State.SuperPraising);
	            runSuperPraising(creep);
	            return;
	        }
	        target = ramparts[0];
	        creep.memory.rampart = target.id;
	    }
	    if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity) {
	        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	    }
	    creep.repair(target);
	}
	function moveAwayFromController(creep) {
	    _Common.moveOffRoad(creep);
	}
	function runPraising(creep) {
	    if (creep.room.memory.praiseStatus === praisestatus_1.PraiseStatus.Praising || creep.room.memory.praiseStatus === praisestatus_1.PraiseStatus.Reestablishing) {
	        creep.setState(State.SuperPraising);
	        return;
	    }
	    if (creep.carry.energy === 0) {
	        creep.setState(State.GetEnergyFromStorage);
	        runGetEnergyFromStorage(creep);
	        return;
	    }
	    if (Game.time % 20 === 2 && creep.ticksToLive < 500 && creep.room.memory.renewing === undefined && creep.carry.energy > 0) {
	        creep.room.memory.renewing = creep.id;
	        creep.setState(State.Renewing);
	        runRenewing(creep);
	        return;
	    }
	    if (Game.time % 333 === 0) {
	        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	        if (constructionsites.length > 0) {
	            creep.setState(State.Constructing);
	            runConstructing(creep);
	            return;
	        }
	    }
	    if (creep.room.controller === undefined || !creep.room.controller.my) {
	        Logger_1.log.error("Praising in room without owned controller", creep.room.name);
	        return;
	    }
	    let distanceToSite = creep.pos.getRangeTo(creep.room.controller);
	    if (distanceToSite > 3) {
	        creep.moveTo(creep.room.controller);
	    }
	    else {
	        if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity / 2 &&
	            creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	        let response = creep.upgradeController(creep.room.controller);
	        if (response === OK) {
	            if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	            }
	            if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	            }
	            else {
	                Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	            }
	        }
	    }
	}
	function runConstructing(creep) {
	    if (creep.carry.energy === 0 && creep.room.storage !== undefined) {
	        creep.setState(State.GetEnergyFromStorage);
	        return;
	    }
	    let constructionsite = Game.getObjectById(creep.memory.structureid);
	    if (constructionsite === null) {
	        let constructionsites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_STORAGE ||
	                c.structureType === STRUCTURE_TERMINAL || c.structureType === STRUCTURE_LAB || c.structureType === STRUCTURE_TOWER });
	        if (constructionsites.length > 0) {
	            creep.memory.structureid = constructionsites[0].id;
	            constructionsite = constructionsites[0];
	        }
	    }
	    if (constructionsite instanceof ConstructionSite) {
	        if (creep.room.storage !== undefined && creep.carry.energy < creep.carryCapacity / 2 &&
	            creep.pos.getRangeTo(creep.room.storage) === 1 && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	        let distanceToSite = creep.pos.getRangeTo(constructionsite.pos);
	        if (distanceToSite > 3) {
	            creep.moveTo(constructionsite);
	        }
	        else {
	            creep.build(constructionsite);
	        }
	    }
	    else {
	        creep.memory.structureid = undefined;
	        creep.setState(State.Praising);
	    }
	}
	function checkIfPraisingIsFinished(creep) {
	    if (Game.time % 155 === 0 && creep.memory.target === creep.pos.roomName &&
	        ((creep.room.controller !== undefined && creep.room.controller.level === 8) || creep.room.memory.praiseStatus === praisestatus_1.PraiseStatus.Inactive)) {
	        Logger_1.log.alert("Praiser dismissed, room has reached lvl 8.", creep.room.name);
	        if (creep.room.storage !== undefined && creep.carry[RESOURCE_ENERGY] > 0) {
	            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	}


/***/ }),
/* 95 */
/***/ (function(module, exports) {

	"use strict";
	function getSpawn1Pos(room, storagepos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
	        case "E":
	            return new RoomPosition(storagepos.x, storagepos.y - 2, storagepos.roomName);
	        default:
	            return new RoomPosition(storagepos.x - 2, storagepos.y, storagepos.roomName);
	    }
	}
	exports.getSpawn1Pos = getSpawn1Pos;
	function getSpawn2Pos(room, spawn1pos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
	        case "E":
	            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y - 2, spawn1pos.roomName);
	        default:
	            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y + 2, spawn1pos.roomName);
	    }
	}
	exports.getSpawn2Pos = getSpawn2Pos;
	function getContainerPos(room, spawn1pos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
	        case "E":
	            return new RoomPosition(spawn1pos.x, spawn1pos.y - 2, spawn1pos.roomName);
	        default:
	            return new RoomPosition(spawn1pos.x - 2, spawn1pos.y, spawn1pos.roomName);
	    }
	}
	exports.getContainerPos = getContainerPos;
	function getStoragePos(room, spawn1pos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
	        case "E":
	            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
	        default:
	            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
	    }
	}
	exports.getStoragePos = getStoragePos;
	function getTerminalPos(room, spawn1pos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
	        case "E":
	            return new RoomPosition(spawn1pos.x + 2, spawn1pos.y, spawn1pos.roomName);
	        default:
	            return new RoomPosition(spawn1pos.x, spawn1pos.y + 2, spawn1pos.roomName);
	    }
	}
	exports.getTerminalPos = getTerminalPos;
	function getLabPos(room, storagepos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
	        case "E":
	            return new RoomPosition(storagepos.x + 2, storagepos.y, storagepos.roomName);
	        default:
	            return new RoomPosition(storagepos.x, storagepos.y + 2, storagepos.roomName);
	    }
	}
	exports.getLabPos = getLabPos;
	function getBoostCreepPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName);
	    }
	}
	exports.getBoostCreepPos = getBoostCreepPos;
	function getHealCreepPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName);
	    }
	}
	exports.getHealCreepPos = getHealCreepPos;
	function getNextHealCreepPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName);
	    }
	}
	exports.getNextHealCreepPos = getNextHealCreepPos;
	function getHealSupporterPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x + 1, storagePos.y - 4, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 4, storagePos.y + 1, storagePos.roomName);
	    }
	}
	exports.getHealSupporterPos = getHealSupporterPos;
	function getNextHealSupporterPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x + 1, storagePos.y - 5, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 5, storagePos.y + 1, storagePos.roomName);
	    }
	}
	exports.getNextHealSupporterPos = getNextHealSupporterPos;
	function getLeaderPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName);
	    }
	}
	exports.getLeaderPos = getLeaderPos;
	function getOfficerPos(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
	        case "E":
	            return new RoomPosition(storagePos.x + 1, storagePos.y - 3, storagePos.roomName);
	        default:
	            return new RoomPosition(storagePos.x - 3, storagePos.y + 1, storagePos.roomName);
	    }
	}
	exports.getOfficerPos = getOfficerPos;
	function getContainer(room, spawn1pos) {
	    let pos = getContainerPos(room, spawn1pos);
	    let atPos = pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_CONTAINER) {
	            return s;
	        }
	    }
	    return undefined;
	}
	exports.getContainer = getContainer;
	function getSpawn2(room, spawn1pos) {
	    let pos = getSpawn2Pos(room, spawn1pos);
	    let atPos = pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_SPAWN) {
	            return s;
	        }
	    }
	    return undefined;
	}
	exports.getSpawn2 = getSpawn2;
	function getBoosterLab(room, storagePos) {
	    let pos = getLabPos(room, storagePos);
	    let atPos = pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_LAB) {
	            return s;
	        }
	    }
	    return undefined;
	}
	exports.getBoosterLab = getBoosterLab;
	function getSupplyContainer(room, spawn1pos) {
	    let pos = getContainerPos(room, spawn1pos);
	    let atPos = pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_CONTAINER) {
	            return s;
	        }
	    }
	    return undefined;
	}
	exports.getSupplyContainer = getSupplyContainer;
	function getPraiserPositions(room, storagePos) {
	    switch (room.memory.direction) {
	        case "S":
	            return [
	                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
	                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
	                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName)
	            ];
	        case "E":
	            return [
	                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
	                new RoomPosition(storagePos.x - 1, storagePos.y + 1, storagePos.roomName),
	                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName)
	            ];
	        default:
	            return [
	                new RoomPosition(storagePos.x - 1, storagePos.y, storagePos.roomName),
	                new RoomPosition(storagePos.x - 1, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y - 1, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y, storagePos.roomName),
	                new RoomPosition(storagePos.x + 1, storagePos.y + 1, storagePos.roomName),
	                new RoomPosition(storagePos.x, storagePos.y + 1, storagePos.roomName)
	            ];
	    }
	}
	exports.getPraiserPositions = getPraiserPositions;
	function getSupporterPositions(room, spawn2Pos) {
	    switch (room.memory.direction) {
	        case "S":
	            console.log("Supporter-rotation not fixed for south (prayerroom)");
	            return [
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y + 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x, spawn2Pos.y + 1, spawn2Pos.roomName)
	            ];
	        case "E":
	            return [
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 3, spawn2Pos.y + 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 2, spawn2Pos.y + 1, spawn2Pos.roomName)
	            ];
	        default:
	            console.log("Supporter-rotation not fixed for south (prayerroom)");
	            return [
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x - 1, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y - 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x + 1, spawn2Pos.y + 1, spawn2Pos.roomName),
	                new RoomPosition(spawn2Pos.x, spawn2Pos.y + 1, spawn2Pos.roomName)
	            ];
	    }
	}
	exports.getSupporterPositions = getSupporterPositions;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

	"use strict";
	(function (PraiseStatus) {
	    PraiseStatus[PraiseStatus["Inactive"] = 0] = "Inactive";
	    PraiseStatus[PraiseStatus["Establishing"] = 1] = "Establishing";
	    PraiseStatus[PraiseStatus["Praising"] = 2] = "Praising";
	    PraiseStatus[PraiseStatus["PreparingReset"] = 3] = "PreparingReset";
	    PraiseStatus[PraiseStatus["Reestablishing"] = 4] = "Reestablishing";
	    PraiseStatus[PraiseStatus["PreparingHibernate"] = 5] = "PreparingHibernate";
	    PraiseStatus[PraiseStatus["Hiberate"] = 6] = "Hiberate";
	    PraiseStatus[PraiseStatus["Abandon"] = 7] = "Abandon";
	})(exports.PraiseStatus || (exports.PraiseStatus = {}));
	var PraiseStatus = exports.PraiseStatus;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	const PathfindingUtilities = __webpack_require__(3);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["TankUpInHomeroom"] = 1] = "TankUpInHomeroom";
	    State[State["MoveToPraiseroom"] = 2] = "MoveToPraiseroom";
	    State[State["DecideWhereToPutEnergy"] = 3] = "DecideWhereToPutEnergy";
	    State[State["MoveToHomeroom"] = 4] = "MoveToHomeroom";
	    State[State["TransferEnergyToStructure"] = 5] = "TransferEnergyToStructure";
	    State[State["GiveEnergyToCreep"] = 6] = "GiveEnergyToCreep";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.TankUpInHomeroom);
	    }
	    switch (creep.getState()) {
	        case State.TankUpInHomeroom:
	            runTankUpInHomeroom(creep);
	            break;
	        case State.MoveToPraiseroom:
	            runMoveToPraiseroom(creep);
	            break;
	        case State.DecideWhereToPutEnergy:
	            runDecideWhereToPutEnergy(creep);
	            break;
	        case State.TransferEnergyToStructure:
	            runTransferEnergyToStructure(creep);
	            break;
	        case State.GiveEnergyToCreep:
	            runGiveEnergyToCreep(creep);
	            break;
	        case State.MoveToHomeroom:
	            runMoveToHomeroom(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MoveToHomeroom);
	            break;
	    }
	}
	exports.run = run;
	function runTankUpInHomeroom(creep) {
	    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
	        creep.room.terminal !== undefined && creep.room.storage !== undefined) {
	        let pickUpStructure = creep.room.storage;
	        if (creep.room.storage.store[RESOURCE_ENERGY] < 10000) {
	            pickUpStructure = creep.room.terminal;
	        }
	        let distanceToStorage = creep.pos.getRangeTo(pickUpStructure.pos);
	        if (distanceToStorage > 1) {
	            creep.moveTo(pickUpStructure);
	        }
	        else {
	            creep.withdraw(pickUpStructure, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        creep.setState(State.MoveToPraiseroom);
	        runMoveToPraiseroom(creep);
	    }
	}
	function runMoveToPraiseroom(creep) {
	    let praiseroom = creep.memory.target;
	    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(praiseroom);
	    }
	    else {
	        creep.setState(State.DecideWhereToPutEnergy);
	        runDecideWhereToPutEnergy(creep);
	    }
	}
	function runDecideWhereToPutEnergy(creep) {
	    if (creep.room.terminal !== undefined && creep.room.terminal.isActive()) {
	        creep.memory.structureid = creep.room.terminal.id;
	        creep.setState(State.TransferEnergyToStructure);
	        runTransferEnergyToStructure(creep);
	        return;
	    }
	    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
	        creep.memory.structureid = creep.room.storage.id;
	        creep.setState(State.TransferEnergyToStructure);
	        runTransferEnergyToStructure(creep);
	        return;
	    }
	    creep.setState(State.GiveEnergyToCreep);
	    runGiveEnergyToCreep(creep);
	}
	function runTransferEnergyToStructure(creep) {
	    if (creep.carry.energy === 0) {
	        if (!shouldShouldAnotherRun(creep)) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    let structure = Game.getObjectById(creep.memory.structureid);
	    if (structure === null) {
	        creep.setState(State.DecideWhereToPutEnergy);
	        runDecideWhereToPutEnergy(creep);
	        return;
	    }
	    let distanceToStorage = creep.pos.getRangeTo(structure.pos);
	    if (distanceToStorage > 3) {
	        creep.travelTo(structure);
	    }
	    else if (distanceToStorage > 1) {
	        creep.moveTo(structure);
	    }
	    else {
	        creep.transfer(structure, RESOURCE_ENERGY);
	    }
	}
	function runGiveEnergyToCreep(creep) {
	    if (creep.carry.energy === 0) {
	        if (!shouldShouldAnotherRun(creep)) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    let praiser = Game.getObjectById(creep.memory.praiser);
	    if (praiser === null || praiser.carry.energy === praiser.carryCapacity) {
	        creep.memory.praiser = undefined;
	        findPraiserToProvide(creep);
	        return;
	    }
	    let distanceToPraiser = creep.pos.getRangeTo(praiser.pos);
	    if (distanceToPraiser > 1) {
	        creep.moveTo(praiser);
	    }
	    else {
	        creep.transfer(praiser, RESOURCE_ENERGY);
	        creep.memory.praiser = undefined;
	    }
	}
	function runMoveToHomeroom(creep) {
	    let homeroom = creep.memory.homeroom;
	    if (homeroom !== creep.room.name) {
	        creep.travelToRoom(homeroom);
	    }
	    else {
	        creep.setState(State.TankUpInHomeroom);
	        runTankUpInHomeroom(creep);
	    }
	}
	function findPraiserToProvide(creep) {
	    let creeps = creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === role_1.Role.Praiser && c.carry.energy < c.carryCapacity / 2 });
	    if (creeps.length > 0) {
	        let closest = creep.pos.findClosestByRange(creeps);
	        creep.memory.praiser = closest.id;
	    }
	}
	function shouldShouldAnotherRun(creep) {
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    if (homeroom == undefined || homeroom.terminal === undefined) {
	        return true;
	    }
	    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, homeroom.terminal.pos);
	    return creep.ticksToLive > distanceToTerminal * 2.1;
	}


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	const PrayerLib = __webpack_require__(95);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MoveToPraiseroom"] = 1] = "MoveToPraiseroom";
	    State[State["MoveToPosition"] = 2] = "MoveToPosition";
	    State[State["EnergyDistribution"] = 3] = "EnergyDistribution";
	    State[State["SupplyTowers"] = 4] = "SupplyTowers";
	    State[State["SupplyLab"] = 5] = "SupplyLab";
	    State[State["EnergyDistributionContainer"] = 6] = "EnergyDistributionContainer";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToPraiseroom);
	    }
	    switch (creep.getState()) {
	        case State.MoveToPraiseroom:
	            runMoveToPraiseroom(creep);
	            break;
	        case State.MoveToPosition:
	            runMoveToPosition(creep);
	            break;
	        case State.EnergyDistribution:
	            runEnergyDistribution(creep);
	            break;
	        case State.SupplyTowers:
	            runSupplyTowers(creep);
	            break;
	        case State.SupplyLab:
	            runSupplyLab(creep);
	            break;
	        case State.EnergyDistributionContainer:
	            runEnergyDistributionContainer(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MoveToPraiseroom);
	            break;
	    }
	}
	exports.run = run;
	;
	function runMoveToPraiseroom(creep) {
	    let praiseroom = creep.memory.target;
	    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(praiseroom);
	    }
	    else {
	        creep.setState(State.MoveToPosition);
	        runMoveToPosition(creep);
	    }
	}
	function runMoveToPosition(creep) {
	    let praiseroom = Game.rooms[creep.memory.target];
	    if (praiseroom === undefined || praiseroom.name !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.setState(State.MoveToPraiseroom);
	        return;
	    }
	    else if (praiseroom.storage !== undefined) {
	        let creepPos = PrayerLib.getLeaderPos(praiseroom, praiseroom.storage.pos);
	        if (creep.memory.role === role_1.Role.PraiserOfficer) {
	            creepPos = PrayerLib.getOfficerPos(praiseroom, praiseroom.storage.pos);
	        }
	        if (creep.pos.getRangeTo(creepPos) > 0) {
	            creep.moveTo(creepPos);
	        }
	        else {
	            if (creep.memory.role === role_1.Role.PraiserOfficer) {
	                creep.setState(State.EnergyDistributionContainer);
	            }
	            else {
	                creep.setState(State.EnergyDistribution);
	            }
	        }
	    }
	}
	function runEnergyDistribution(creep) {
	    let spawn = creep.room.getSpawn();
	    if ((creep.room.storage === undefined && creep.room.terminal === undefined) || spawn === undefined) {
	        Logger_1.log.error("Storage, spawn or terminal missing in praiseroom", creep.room.name);
	        return;
	    }
	    if (Game.time % 66 === 33 && labNeedMinerals(creep.room) !== undefined && creep.room.terminal !== undefined &&
	        creep.room.terminal.isActive() && creep.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
	        if (creep.carry[RESOURCE_ENERGY] > 0) {
	            creep.transfer(creep.room.terminal, RESOURCE_ENERGY);
	        }
	        creep.setState(State.SupplyLab);
	        return;
	    }
	    if (Game.time % 66 === 0 && creep.room.terminal !== undefined && towerNeedEnergy(creep.room) !== undefined) {
	        if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
	            creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
	        }
	        creep.setState(State.SupplyTowers);
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] > 0) {
	        if (Game.time % 30 === 0 && creep.room.storage !== undefined) {
	            let lab = PrayerLib.getBoosterLab(creep.room, creep.room.storage.pos);
	            if (lab !== undefined && lab.energy < lab.energyCapacity && lab.isActive()) {
	                creep.transfer(lab, RESOURCE_ENERGY);
	            }
	        }
	        else if (spawn.energy < spawn.energyCapacity / 2) {
	            creep.transfer(spawn, RESOURCE_ENERGY);
	        }
	        else if (creep.room.storage !== undefined && creep.room.terminal !== undefined &&
	            creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.storeCapacity - creep.carryCapacity &&
	            creep.room.terminal.store[RESOURCE_ENERGY] > 50000) {
	            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	    else if (creep.room.terminal !== undefined && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity &&
	        creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
	        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
	    }
	    else if (creep.room.storage !== undefined && (creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_ENERGY] === 0) &&
	        creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
	        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	    }
	}
	function runEnergyDistributionContainer(creep) {
	    let spawn1 = creep.room.getSpawn();
	    if ((creep.room.storage === undefined && creep.room.terminal === undefined) || spawn1 === undefined) {
	        Logger_1.log.error("Storage, spawn or terminal missing in praiseroom", creep.room.name);
	        return;
	    }
	    let spawn2 = PrayerLib.getSpawn2(creep.room, spawn1.pos);
	    let container = PrayerLib.getContainer(creep.room, spawn1.pos);
	    if (spawn2 === undefined || container === undefined) {
	        Logger_1.log.error("Spawn2 or container missing in praiseroom", creep.room.name);
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] > 0) {
	        if (spawn2.energy < spawn2.energyCapacity / 2) {
	            creep.transfer(spawn2, RESOURCE_ENERGY);
	        }
	        else if (creep.room.terminal !== undefined &&
	            container.store[RESOURCE_ENERGY] < container.storeCapacity * 0.7 &&
	            creep.room.terminal.store[RESOURCE_ENERGY] > 50000) {
	            creep.transfer(container, RESOURCE_ENERGY);
	        }
	    }
	    else if (creep.room.terminal !== undefined && creep.carry[RESOURCE_ENERGY] < creep.carryCapacity &&
	        creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
	        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
	    }
	}
	function runSupplyLab(creep) {
	    if (creep.room.terminal === undefined || creep.room.storage === undefined) {
	        creep.setState(State.EnergyDistribution);
	        return;
	    }
	    let lab = PrayerLib.getBoosterLab(creep.room, creep.room.storage.pos);
	    if (lab === undefined) {
	        creep.setState(State.EnergyDistribution);
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] > 0) {
	        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	        return;
	    }
	    if (lab.mineralAmount < lab.mineralCapacity && creep.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > (lab.mineralCapacity - lab.mineralAmount)) {
	        if (creep.carry[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
	            creep.transfer(lab, RESOURCE_CATALYZED_GHODIUM_ACID);
	        }
	        else {
	            creep.withdraw(creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
	        }
	    }
	    else {
	        if (creep.carry[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
	            creep.transfer(creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
	        }
	        creep.setState(State.EnergyDistribution);
	    }
	}
	function runSupplyTowers(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.setState(State.MoveToPosition);
	        return;
	    }
	    let tower = towerNeedEnergy(creep.room);
	    if (tower !== undefined) {
	        let range = creep.pos.getRangeTo(tower);
	        if (range > 1) {
	            creep.moveTo(tower);
	        }
	        else {
	            creep.transfer(tower, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        creep.setState(State.MoveToPosition);
	    }
	}
	function towerNeedEnergy(room) {
	    let towers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity / 1.2 });
	    if (towers.length > 0) {
	        return towers[0];
	    }
	    return undefined;
	}
	function labNeedMinerals(room) {
	    if (room.terminal === undefined || room.storage === undefined) {
	        return undefined;
	    }
	    let lab = PrayerLib.getBoosterLab(room, room.storage.pos);
	    if (lab !== undefined && lab.mineralAmount < lab.mineralCapacity) {
	        return lab;
	    }
	    return undefined;
	}


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const TeamHealer = __webpack_require__(100);
	const TeamWrecker = __webpack_require__(101);
	const Wrecker = __webpack_require__(102);
	const Drainer = __webpack_require__(103);
	const Harasser = __webpack_require__(104);
	const Paladin = __webpack_require__(105);
	const Ranger = __webpack_require__(106);
	const Signer = __webpack_require__(107);
	const Tagger = __webpack_require__(109);
	const Declarer = __webpack_require__(110);
	const CommandLib = __webpack_require__(111);
	const MilitaryLib = __webpack_require__(112);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	class MilitaryManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("MilitaryManager");
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            this.creepService.runCreeps(role_1.Role.TeamWrecker, TeamWrecker.run);
	            this.creepService.runCreeps(role_1.Role.TeamHealer, TeamHealer.run);
	            this.creepService.runCreeps(role_1.Role.Wrecker, Wrecker.run);
	            this.creepService.runCreeps(role_1.Role.Paladin, Paladin.run);
	            this.creepService.runCreeps(role_1.Role.Ranger, Ranger.run);
	            this.creepService.runCreeps(role_1.Role.Drainer, Drainer.run);
	            if (Memory.commandOrders !== undefined && Memory.commandOrders.length > 0) {
	                processCommandOrders();
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.Harasser, Harasser.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Trivial) {
	            this.creepService.runCreeps(role_1.Role.Signer, Signer.run);
	            this.creepService.runCreeps(role_1.Role.Declarer, Declarer.run);
	            this.creepService.runCreeps(role_1.Role.Tagger, Tagger.run);
	        }
	    }
	}
	exports.MilitaryManager = MilitaryManager;
	function processCommandOrders() {
	    for (let order of Memory.commandOrders) {
	        if (CommandLib.commandOrderIsValid(order)) {
	            switch (order.role) {
	                case role_1.Role.TeamWrecker:
	                    MilitaryLib.orderTeamWrecker(Game.rooms[order.room], order.tier, order.route, order.targets, 3);
	                    break;
	                case role_1.Role.Wrecker:
	                    MilitaryLib.orderWrecker(Game.rooms[order.room], order.route);
	                    break;
	                case role_1.Role.Drainer:
	                    MilitaryLib.orderDrainer(Game.rooms[order.room], order.tier, order.route);
	                    break;
	                case role_1.Role.Paladin:
	                    MilitaryLib.orderPaladin(Game.rooms[order.room], order.route);
	                    break;
	                case role_1.Role.Tagger:
	                    MilitaryLib.orderTagger(Game.rooms[order.room], order.target);
	                    break;
	                case role_1.Role.Declarer:
	                    MilitaryLib.orderDeclarer(Game.rooms[order.room], order.route);
	                    break;
	                default:
	                    Logger_1.log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
	            }
	        }
	        else {
	            Logger_1.log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
	        }
	    }
	    Memory.commandOrders = undefined;
	}


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["Moving"] = 2] = "Moving";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    switch (creep.getState()) {
	        case State.Waiting:
	            runIdle(creep);
	            break;
	        case State.Moving:
	            runMoving(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runIdle(creep) {
	    let teammate = findPossibleTeammate(creep);
	    if (teammate instanceof Creep) {
	        creep.memory.teammate = teammate.id;
	        teammate.memory.healer = creep.id;
	        creep.setState(State.Moving);
	        runMoving(creep);
	    }
	    else {
	        healSelf(creep);
	        _Common.moveOffRoad(creep);
	    }
	}
	function runMoving(creep) {
	    let teammate = getTeammate(creep);
	    if (teammate instanceof Creep) {
	        let rangeToTeammate = creep.pos.getRangeTo(teammate.pos);
	        moveToTeammate(creep, teammate, rangeToTeammate);
	        healSelfOrTeammate(creep, teammate, rangeToTeammate);
	    }
	    else {
	        Logger_1.log.error("TeamHealer " + creep.name + " seems to have lost it's teammate.", creep.room.name);
	        creep.memory.teammate = undefined;
	        creep.setState(State.Waiting);
	    }
	}
	function healSelf(creep) {
	    if (creep.hits < creep.hitsMax) {
	        creep.heal(creep);
	    }
	}
	function healSelfOrTeammate(creep, teammate, range) {
	    if (range > 3) {
	        creep.heal(creep);
	    }
	    else {
	        if (getMissingHitpoints(creep) > getMissingHitpoints(teammate)) {
	            creep.heal(creep);
	        }
	        else {
	            if (range > 1) {
	                creep.rangedHeal(teammate);
	            }
	            else {
	                creep.heal(teammate);
	            }
	        }
	    }
	}
	function moveToTeammate(creep, teammate, range) {
	    if (creep.memory.doNotMove === true) {
	        creep.memory.doNotMove = undefined;
	        return;
	    }
	    if (range > 1) {
	        creep.moveTo(teammate);
	    }
	    else {
	        if (teammate.fatigue === 0) {
	            creep.moveTo(teammate.pos, { ignoreCreeps: true });
	        }
	    }
	}
	function getTeammate(creep) {
	    let teammate = Game.getObjectById(creep.memory.teammate);
	    return teammate;
	}
	function findPossibleTeammate(creep) {
	    let possibleTeammates = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
	            return (c.memory.role === role_1.Role.TeamWrecker || c.memory.role === role_1.Role.TeamWarrior) &&
	                c.memory.healer === undefined;
	        }
	    });
	    if (possibleTeammates.length > 0) {
	        return possibleTeammates[0];
	    }
	    return null;
	}
	function getMissingHitpoints(creep) {
	    return creep.hitsMax - creep.hits;
	}


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const _Targeting = __webpack_require__(56);
	const PositionLib = __webpack_require__(46);
	const RouteTravel = __webpack_require__(44);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToTarget"] = 2] = "MovingToTarget";
	    State[State["Wrecking"] = 3] = "Wrecking";
	    State[State["MoveToStartPosition"] = 4] = "MoveToStartPosition";
	    State[State["Guarding"] = 5] = "Guarding";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    shootHostileCreeps(creep);
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.MoveToStartPosition:
	            runMoveToStartPosition(creep);
	            break;
	        case State.Wrecking:
	            runWrecking(creep);
	            break;
	        case State.Guarding:
	            runGuarding(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    let healer = getHealer(creep);
	    if (healer instanceof Creep) {
	        creep.setState(State.MoveToStartPosition);
	    }
	    else {
	        _Common.moveOffRoad(creep);
	    }
	}
	function runMoveToStartPosition(creep) {
	    let startRoom = creep.memory.target;
	    if (startRoom === undefined) {
	        startRoom = getNextTargetRoom(creep);
	        if (startRoom === undefined) {
	            Logger_1.log.error("TeamWrecker " + creep.name + " has no target room.", creep.room.name);
	            return;
	        }
	    }
	    let healer = getHealer(creep);
	    if (healer !== null && Game.map.getRoomLinearDistance(healer.pos.roomName, creep.room.name) > 5) {
	        moveHealerIntoPortal(creep);
	    }
	    if (healer !== null && needToWaitForHealer(creep, healer)) {
	        return;
	    }
	    if (startRoom !== creep.room.name) {
	        if (!destroyWallInPath(creep)) {
	            RouteTravel.travelByRoute(creep, { allowSK: true });
	        }
	    }
	    else {
	        creep.setState(State.MovingToTarget);
	        runMovingToTarget(creep);
	    }
	}
	function runMovingToTarget(creep) {
	    let healer = getHealer(creep);
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            creep.setState(State.Guarding);
	            return;
	        }
	    }
	    if (healer instanceof Creep && needToWaitForHealer(creep, healer)) {
	        return;
	    }
	    if (targetRoom === creep.room.name) {
	        creep.setState(State.Wrecking);
	        runWrecking(creep);
	    }
	    else {
	        if (!destroyWallInPath(creep)) {
	            creep.travelToRoom(targetRoom, { allowSK: true });
	        }
	    }
	}
	function runWrecking(creep) {
	    let targetRoom = creep.memory.target;
	    if (creep.room.name !== targetRoom && targetRoom !== undefined) {
	        creep.setState(State.MovingToTarget);
	        return;
	    }
	    let targetToDismantle = getTargetToDismantle(creep);
	    if (targetToDismantle !== null) {
	        moveAndDismantle(creep, targetToDismantle);
	    }
	    else {
	        targetToDismantle = getNewTargetToDismantle(creep);
	        if (targetToDismantle !== null) {
	            creep.memory.targetToDismantle = targetToDismantle.id;
	            moveAndDismantle(creep, targetToDismantle);
	        }
	        else {
	            let targetRoom = getNextTargetRoom(creep);
	            Logger_1.log.info("TeamWrecker " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	            creep.setState(State.MovingToTarget);
	            runMovingToTarget(creep);
	        }
	    }
	}
	function runGuarding(creep) {
	    let targetToDismantle = getTargetToDismantle(creep);
	    if (targetToDismantle !== null) {
	        moveAndDismantle(creep, targetToDismantle);
	    }
	    else {
	        targetToDismantle = getNewTargetToDismantle(creep);
	        if (targetToDismantle !== null) {
	            creep.memory.targetToDismantle = targetToDismantle.id;
	            moveAndDismantle(creep, targetToDismantle);
	        }
	    }
	}
	function destroyWallInPath(creep) {
	    if (creep.memory._travel !== undefined && creep.memory._travel.stuck !== undefined && creep.memory._travel.stuck === 1 &&
	        creep.memory._travel.path !== undefined && creep.memory._travel.path.length > 0) {
	        let position = PositionLib.positionAtDirection(creep.pos, creep.memory._travel.path.substr(0, 1));
	        if (position !== undefined && creep.pos.getRangeTo(position) === 1) {
	            let atPos = position.lookFor(LOOK_STRUCTURES);
	            for (let s of atPos) {
	                if (s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && !s.my)) {
	                    creep.dismantle(s);
	                    return true;
	                }
	            }
	        }
	    }
	    return false;
	}
	function getTargetToDismantle(creep) {
	    let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
	    if (targetToDismantle instanceof Structure) {
	        return targetToDismantle;
	    }
	    else {
	        return null;
	    }
	}
	function needToWaitForHealer(creep, healer) {
	    if (healer.fatigue > 0) {
	        return true;
	    }
	    if (creep.pos.inRangeTo(healer.pos, 1) || PositionLib.positionIsBorderOrNextToBorder(creep.pos) ||
	        PositionLib.positionHasPortal(creep.pos)) {
	        return false;
	    }
	    return true;
	}
	function shootHostileCreeps(creep) {
	    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);
	    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function (c) {
	        let atPos = c.pos.lookFor(LOOK_STRUCTURES);
	        for (let sAtPos of atPos) {
	            if (sAtPos.structureType === STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        return true;
	    });
	    if (closeDangerousCreepsNotOnRamparts.length > 0) {
	        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
	    }
	    else {
	        let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
	        if (targetToDismantle instanceof Structure && creep.pos.getRangeTo(targetToDismantle) < 4) {
	            creep.rangedAttack(targetToDismantle);
	        }
	    }
	}
	function getHealer(creep) {
	    let healer = Game.getObjectById(creep.memory.healer);
	    return healer;
	}
	function getNewTargetToDismantle(creep) {
	    let pillage = creep.memory.pillage === true;
	    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room, pillage);
	    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
	    if (vitalStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
	    }
	    let allStructures = _.filter(_Targeting.findHostileStructures(creep.room), (s) => s.structureType !== STRUCTURE_LINK && s.structureType !== STRUCTURE_EXTRACTOR);
	    if (pillage) {
	        allStructures = _Targeting.filterPillageableStructuresFromList(allStructures);
	    }
	    let allStructuresWithoutBigRampart = _.filter(_Targeting.filterStructuresOnBigRamparts(allStructures), (s) => s.structureType !== STRUCTURE_LINK && s.structureType !== STRUCTURE_EXTRACTOR);
	    if (allStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    if (vitalStructures.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructures);
	    }
	    if (allStructures.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    return null;
	}
	function moveAndDismantle(creep, targetToDismantle) {
	    let shouldIMove = true;
	    let healer = getHealer(creep);
	    if ((healer !== null && creep.pos.getRangeTo(healer) > 1) && !PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        shouldIMove = false;
	    }
	    let range = creep.pos.getRangeTo(targetToDismantle);
	    if (range === 1) {
	        creep.dismantle(targetToDismantle);
	        if (PositionLib.positionNextToBorder(creep.pos)) {
	            moveHealerIntoRoom(creep);
	        }
	    }
	    if (range > 1 && shouldIMove) {
	        let response = creep.moveTo(targetToDismantle);
	        if (response === ERR_NO_PATH) {
	            findWallToDestroy(creep, targetToDismantle);
	        }
	    }
	}
	function moveHealerIntoRoom(creep) {
	    let healer = getHealer(creep);
	    if (healer instanceof Creep && PositionLib.positionIsBorder(healer.pos) && healer.pos.getRangeTo(creep.pos) === 1) {
	        healer.memory.doNotMove = true;
	        let d = randomDirectionClose(healer.pos.getDirectionTo(creep.pos));
	        healer.move(d);
	    }
	}
	function moveHealerIntoPortal(creep) {
	    let healer = getHealer(creep);
	    if (healer instanceof Creep) {
	        let portal = healer.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
	        if (portal !== undefined) {
	            healer.moveTo(portal);
	            healer.memory.doNotMove = true;
	        }
	    }
	}
	function randomDirectionClose(direction) {
	    let random = 1;
	    if (Math.random() < 0.5) {
	        random = -1;
	    }
	    let zeroIndexedDirection = direction - 1;
	    let zeroIndexedCloseDirection = (zeroIndexedDirection + random) % 8;
	    let closeDirection = zeroIndexedCloseDirection + 1;
	    return closeDirection;
	}
	function findWallToDestroy(creep, targetToDismantle) {
	    let path = PathFinder.search(creep.pos, { pos: targetToDismantle.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
	    }).path;
	    for (let roomPos of path) {
	        let structures = roomPos.lookFor(LOOK_STRUCTURES);
	        if (structures.length > 0) {
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	                    Logger_1.log.info("TeamWrecker needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
	                    creep.memory.targetToDismantle = s.id;
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
	}
	function getRoomCallbackForWallDestruction(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
	            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 100000));
	        }
	    });
	    return costs;
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.targets !== undefined && creep.memory.targets.length > 0) {
	        creep.memory.target = creep.memory.targets.shift();
	    }
	    else {
	        creep.memory.target = undefined;
	    }
	    return creep.memory.target;
	}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Targeting = __webpack_require__(56);
	const PositionLib = __webpack_require__(46);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToTarget"] = 1] = "MovingToTarget";
	    State[State["Wrecking"] = 2] = "Wrecking";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToTarget);
	    }
	    switch (creep.getState()) {
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.Wrecking:
	            runWrecking(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToTarget);
	            break;
	    }
	}
	exports.run = run;
	;
	function runMovingToTarget(creep) {
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            Logger_1.log.error("Wrecker " + creep.name + " has no target room.", creep.room.name);
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
	        creep.setState(State.Wrecking);
	        runWrecking(creep);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
	    }
	}
	function runWrecking(creep) {
	    let targetToDismantle = getTargetToDismantle(creep);
	    if (targetToDismantle !== null) {
	        moveAndDismantle(creep, targetToDismantle);
	    }
	    else {
	        targetToDismantle = getNewTargetToDismantle(creep);
	        if (targetToDismantle !== null) {
	            creep.memory.targetToDismantle = targetToDismantle.id;
	            moveAndDismantle(creep, targetToDismantle);
	        }
	        else {
	            let targetRoom = getNextTargetRoom(creep);
	            Logger_1.log.info("Wrecker " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	            creep.setState(State.MovingToTarget);
	        }
	    }
	}
	function getTargetToDismantle(creep) {
	    let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
	    if (targetToDismantle instanceof Structure) {
	        return targetToDismantle;
	    }
	    else {
	        return null;
	    }
	}
	function getNewTargetToDismantle(creep) {
	    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);
	    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
	    if (vitalStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
	    }
	    let allStructures = _Targeting.findHostileStructures(creep.room);
	    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);
	    if (allStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    if (vitalStructures.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructures);
	    }
	    if (allStructures.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    return null;
	}
	function moveAndDismantle(creep, targetToDismantle) {
	    let closestCreep = _Targeting.findClosestHostileCreepsInRoom(creep.pos);
	    let shouldIMove = true;
	    if (closestCreep && creep.pos.getRangeTo(closestCreep.pos) < 3) {
	        shouldIMove = Game.time % 2 === 0;
	    }
	    if (creep.dismantle(targetToDismantle) === ERR_NOT_IN_RANGE && shouldIMove) {
	        let response = creep.moveTo(targetToDismantle);
	        if (response === ERR_NO_PATH) {
	            findWallToDestroy(creep, targetToDismantle);
	        }
	    }
	}
	function findWallToDestroy(creep, targetToDismantle) {
	    let path = PathFinder.search(creep.pos, { pos: targetToDismantle.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
	    }).path;
	    for (let roomPos of path) {
	        let structures = roomPos.lookFor(LOOK_STRUCTURES);
	        if (structures.length > 0) {
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	                    Logger_1.log.info("Wrecker needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
	                    creep.memory.targetToDismantle = s.id;
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
	}
	function getRoomCallbackForWallDestruction(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
	            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 20000));
	        }
	    });
	    return costs;
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.target = creep.memory.route.shift();
	    }
	    return creep.memory.target;
	}


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Targeting = __webpack_require__(56);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToTarget"] = 1] = "MovingToTarget";
	    State[State["MovingToDrainingPosition"] = 2] = "MovingToDrainingPosition";
	    State[State["Draining"] = 3] = "Draining";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    shootHostileCreeps(creep);
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToTarget);
	    }
	    switch (creep.getState()) {
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.MovingToDrainingPosition:
	            runMovingToDrainingPosition(creep);
	            break;
	        case State.Draining:
	            runDraining(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToTarget);
	            break;
	    }
	}
	exports.run = run;
	;
	function runDraining(creep) {
	    creep.heal(creep);
	}
	function runMovingToDrainingPosition(creep) {
	    creep.heal(creep);
	    if (roomIsDrainable(creep)) {
	        let drainPosition = getDrainingPosition(creep);
	        if (creep.pos.getRangeTo(drainPosition) > 0) {
	            creep.travelTo({ pos: drainPosition });
	        }
	        else {
	            creep.setState(State.Draining);
	        }
	    }
	    else {
	        creep.memory.target = undefined;
	        creep.memory.drainPosition = undefined;
	        creep.setState(State.MovingToTarget);
	        runMovingToTarget(creep);
	    }
	}
	function runMovingToTarget(creep) {
	    healIfNeeded(creep);
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name) {
	        creep.setState(State.MovingToDrainingPosition);
	        runMovingToDrainingPosition(creep);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
	    }
	}
	function roomIsDrainable(creep) {
	    let towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
	        filter: (t) => t.structureType === STRUCTURE_TOWER });
	    return towers.length > 0;
	}
	function getDrainingPosition(creep) {
	    let turrets = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
	    let exits = creep.room.find(FIND_EXIT);
	    let goodPositions = [];
	    let best = undefined;
	    let bestValue = 1000;
	    for (let pos of exits) {
	        let value = 0;
	        for (let turret of turrets) {
	            let range = pos.getRangeTo(turret);
	            value = value + Math.max(0, 20 - range);
	        }
	        if (best === undefined || value < bestValue) {
	            best = pos;
	            bestValue = value;
	        }
	        if (value === 0) {
	            goodPositions.push(pos);
	        }
	    }
	    if (goodPositions.length > 0) {
	        let closestPos = goodPositions[0];
	        let distanceToPos = creep.pos.getRangeTo(goodPositions[0]);
	        for (let pos of goodPositions) {
	            let r = creep.pos.getRangeTo(pos);
	            if (r < distanceToPos) {
	                closestPos = pos;
	                distanceToPos = r;
	            }
	        }
	        console.log("Moving to pos: " + closestPos);
	        return closestPos;
	    }
	    if (best !== undefined) {
	        console.log("Moving to pos (not great): " + best);
	        return best;
	    }
	    console.log("Staying here (bad): " + creep.pos);
	    return creep.pos;
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.target = creep.memory.route.shift();
	    }
	    else {
	        creep.memory.target = undefined;
	    }
	    return creep.memory.target;
	}
	function healIfNeeded(creep) {
	    if (creep.hits < creep.hitsMax || creep.getState() === State.MovingToTarget) {
	        creep.heal(creep);
	    }
	}
	function shootHostileCreeps(creep) {
	    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);
	    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function (c) {
	        let atPos = c.pos.lookFor(LOOK_STRUCTURES);
	        for (let sAtPos of atPos) {
	            if (sAtPos.structureType === STRUCTURE_RAMPART) {
	                return false;
	            }
	        }
	        return true;
	    });
	    if (closeDangerousCreepsNotOnRamparts.length > 0) {
	        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
	    }
	    else {
	        let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
	        if (targetToDismantle instanceof Structure && creep.pos.getRangeTo(targetToDismantle) < 4) {
	            creep.rangedAttack(targetToDismantle);
	        }
	    }
	}


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ScoutingUtilities = __webpack_require__(47);
	const _Targeting = __webpack_require__(56);
	const _Military = __webpack_require__(55);
	const PositionLib = __webpack_require__(46);
	const DamageLib = __webpack_require__(63);
	const IntelLib = __webpack_require__(5);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToTarget"] = 2] = "MovingToTarget";
	    State[State["Attacking"] = 3] = "Attacking";
	    State[State["Sleep"] = 4] = "Sleep";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    healIfNeeded(creep);
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.Attacking:
	            runAttacking(creep);
	            break;
	        case State.Sleep:
	            runSleep(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    creep.setState(State.MovingToTarget);
	}
	function runSleep(creep) {
	    if (Game.time % 9 === 0) {
	        creep.setState(State.Attacking);
	    }
	}
	function runMovingToTarget(creep) {
	    if (Game.time % 9 === 4 && !PositionLib.positionIsBorderOrNextToBorder(creep.pos) &&
	        currentRoomHasHostilesToKill(creep)) {
	        creep.setState(State.Attacking);
	        runAttacking(creep);
	        return;
	    }
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNewTargetRoom(creep);
	        if (targetRoom === undefined) {
	            Logger_1.log.error("Harasser " + creep.name + " has no target room.", creep.room.name);
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
	        creep.setState(State.Attacking);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowSK: false, ignoreRoads: true, allowHostile: false });
	    }
	}
	function runAttacking(creep) {
	    if (Game.time % 9 === 0 && !PositionLib.positionIsBorderOrNextToBorder(creep.pos) &&
	        !currentRoomHasHostilesToKill(creep)) {
	        let targetRoom = getNewTargetRoom(creep);
	        if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
	            Logger_1.log.info("Ranger " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	            creep.setState(State.MovingToTarget);
	            runMovingToTarget(creep);
	        }
	        else {
	            creep.setState(State.Sleep);
	        }
	        return;
	    }
	    let targetToAttack = getTargetToAttack(creep);
	    if (Game.time % 18 === 0 || targetToAttack === null) {
	        targetToAttack = getNewTargetToAttack(creep);
	    }
	    if (targetToAttack !== null) {
	        creep.memory.targetToAttack = targetToAttack.id;
	        if (targetToAttack instanceof Creep) {
	            let range = 3;
	            if (targetToAttack.getActiveBodyparts(ATTACK) === 0) {
	                range = 1;
	            }
	            if (!_Military.kiteAndAttack(creep, targetToAttack, range)) {
	                _Military.rangedAttackToEnemiesAround(creep);
	            }
	        }
	        else if (targetToAttack instanceof ConstructionSite) {
	            _Military.rangedAttackToEnemiesAround(creep);
	            creep.travelTo(targetToAttack, { range: 0 });
	        }
	        else {
	            moveAndAttack(creep, targetToAttack);
	        }
	    }
	    else {
	        let targetRoom = getNewTargetRoom(creep);
	        if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
	            Logger_1.log.info("Ranger " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	            creep.setState(State.MovingToTarget);
	        }
	        else {
	            creep.setState(State.Sleep);
	        }
	    }
	}
	function currentRoomHasHostilesToKill(creep) {
	    let enemies = _Targeting.findHostileCreepsInRoom(creep.room, false);
	    if (enemies.length === 0) {
	        return false;
	    }
	    let creepStats = DamageLib.getStatsForCreep(creep);
	    for (let e of enemies) {
	        let enemyStats = DamageLib.getStatsForCreep(e);
	        if (enemyStats.rpt > creepStats.hpt) {
	            return false;
	        }
	    }
	    return true;
	}
	function getTargetToAttack(creep) {
	    let targetToAttack = Game.getObjectById(creep.memory.targetToAttack);
	    if (targetToAttack !== null) {
	        return targetToAttack;
	    }
	    else {
	        return null;
	    }
	}
	function getNewTargetToAttack(creep) {
	    let allCreeps = _Targeting.findHostileCreepsInRoom(creep.room, false);
	    if (allCreeps.length > 0) {
	        let creepStats = DamageLib.getStatsForCreep(creep);
	        let dangerous = [];
	        for (let c of allCreeps) {
	            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) {
	                let enemyStats = DamageLib.getStatsForCreep(c);
	                if (enemyStats.rpt > creepStats.hpt) {
	                    return null;
	                }
	                dangerous.push(c);
	            }
	        }
	        if (dangerous.length > 0) {
	            return creep.pos.findClosestByRange(dangerous);
	        }
	        return creep.pos.findClosestByRange(allCreeps);
	    }
	    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);
	    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
	    if (vitalStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
	    }
	    let allStructures = _Targeting.findHostileStructures(creep.room);
	    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);
	    if (allStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    if (vitalStructures.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructures);
	    }
	    if (allStructures.length > 0) {
	        return creep.pos.findClosestByRange(allStructures);
	    }
	    let allConstructionSitesWithOutRamparts = _Targeting.filterConstructionSitesOnRamparts(_Targeting.findHostileConstructionSites(creep.room));
	    if (allConstructionSitesWithOutRamparts.length > 0) {
	        return creep.pos.findClosestByRange(allConstructionSitesWithOutRamparts);
	    }
	    return null;
	}
	function moveAndAttack(creep, targetToAttack) {
	    let range = creep.pos.getRangeTo(targetToAttack);
	    if (range === 1) {
	        creep.rangedAttack(targetToAttack);
	    }
	    if (range > 1) {
	        let response = creep.moveTo(targetToAttack);
	        if (response === ERR_NO_PATH) {
	            findWallToDestroy(creep, targetToAttack);
	        }
	    }
	}
	function findWallToDestroy(creep, targetToAttack) {
	    let path = PathFinder.search(creep.pos, { pos: targetToAttack.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
	    }).path;
	    for (let roomPos of path) {
	        let structures = roomPos.lookFor(LOOK_STRUCTURES);
	        if (structures.length > 0) {
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	                    Logger_1.log.info("Harasser needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
	                    creep.memory.targetToAttack = s.id;
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
	}
	function getRoomCallbackForWallDestruction(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
	            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 1000));
	        }
	    });
	    return costs;
	}
	function getNewTargetRoom(creep) {
	    let neighbours = _.filter(ScoutingUtilities.getRoomsOneAway(creep.room.name), (r) => !IntelLib.isOwned(r) && Game.map.isRoomAvailable(r));
	    if (neighbours.length === 0) {
	        return undefined;
	    }
	    creep.memory.target = _.sample(neighbours);
	    return creep.memory.target;
	}
	function healIfNeeded(creep) {
	    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
	        creep.heal(creep);
	    }
	}


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Targeting = __webpack_require__(56);
	const PositionLib = __webpack_require__(46);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToTarget"] = 2] = "MovingToTarget";
	    State[State["Attacking"] = 3] = "Attacking";
	    State[State["Sleep"] = 4] = "Sleep";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    healIfNeeded(creep);
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.Attacking:
	            runAttacking(creep);
	            break;
	        case State.Sleep:
	            runSleep(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    creep.setState(State.MovingToTarget);
	}
	function runSleep(creep) {
	    if (Game.time % 9 === 0) {
	        creep.setState(State.Attacking);
	    }
	}
	function runMovingToTarget(creep) {
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            Logger_1.log.error("Paladin " + creep.name + " has no target room.", creep.room.name);
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
	        creep.setState(State.Attacking);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
	    }
	}
	function runAttacking(creep) {
	    let targetToAttack = getTargetToAttack(creep);
	    if (Game.time % 13 === 0) {
	        targetToAttack = getNewTargetToAttack(creep);
	        if (targetToAttack !== null) {
	            creep.memory.targetToAttack = targetToAttack.id;
	        }
	    }
	    if (targetToAttack !== null) {
	        moveAndAttack(creep, targetToAttack);
	    }
	    else {
	        targetToAttack = getNewTargetToAttack(creep);
	        if (targetToAttack !== null) {
	            creep.memory.targetToAttack = targetToAttack.id;
	            moveAndAttack(creep, targetToAttack);
	        }
	        else {
	            let targetRoom = getNextTargetRoom(creep);
	            if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
	                Logger_1.log.info("Paladin " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	                creep.setState(State.MovingToTarget);
	            }
	            else {
	                creep.setState(State.Sleep);
	            }
	        }
	    }
	}
	function getTargetToAttack(creep) {
	    let targetToAttack = Game.getObjectById(creep.memory.targetToAttack);
	    if (targetToAttack !== null) {
	        return targetToAttack;
	    }
	    else {
	        return null;
	    }
	}
	function getNewTargetToAttack(creep) {
	    let allCreeps = _Targeting.findHostileCreepsInRoom(creep.room);
	    if (allCreeps.length > 0) {
	        let dangerous = [];
	        let claimers = [];
	        for (let c of allCreeps) {
	            if (c.getActiveBodyparts(CLAIM) > 0) {
	                claimers.push(c);
	            }
	            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) {
	                dangerous.push(c);
	            }
	        }
	        if (dangerous.length > 0) {
	            return creep.pos.findClosestByRange(dangerous);
	        }
	        if (claimers.length > 0) {
	            return creep.pos.findClosestByRange(claimers);
	        }
	        return creep.pos.findClosestByRange(allCreeps);
	    }
	    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);
	    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
	    if (vitalStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
	    }
	    let allStructures = _Targeting.findHostileStructures(creep.room);
	    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);
	    if (allStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    if (vitalStructures.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructures);
	    }
	    if (allStructures.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    return null;
	}
	function moveAndAttack(creep, targetToAttack) {
	    let range = creep.pos.getRangeTo(targetToAttack);
	    if (range === 1) {
	        creep.attack(targetToAttack);
	        creep.moveTo(targetToAttack, { ignoreCreeps: true, maxRooms: 1 });
	    }
	    if (range > 1) {
	        let response = creep.moveTo(targetToAttack, { maxRooms: 1 });
	        if (response === ERR_NO_PATH) {
	            findWallToDestroy(creep, targetToAttack);
	        }
	    }
	}
	function findWallToDestroy(creep, targetToAttack) {
	    let path = PathFinder.search(creep.pos, { pos: targetToAttack.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
	    }).path;
	    for (let roomPos of path) {
	        let structures = roomPos.lookFor(LOOK_STRUCTURES);
	        if (structures.length > 0) {
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	                    Logger_1.log.info("Paladin needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
	                    creep.memory.targetToAttack = s.id;
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
	}
	function getRoomCallbackForWallDestruction(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
	            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 1000));
	        }
	    });
	    return costs;
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.target = creep.memory.route.shift();
	    }
	    return creep.memory.target;
	}
	function healIfNeeded(creep) {
	    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
	        creep.heal(creep);
	    }
	}


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Targeting = __webpack_require__(56);
	const _Military = __webpack_require__(55);
	const PositionLib = __webpack_require__(46);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["MovingToTarget"] = 2] = "MovingToTarget";
	    State[State["Attacking"] = 3] = "Attacking";
	    State[State["Sleep"] = 4] = "Sleep";
	})(State || (State = {}));
	function run(creep) {
	    creep.notifyWhenAttacked(false);
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    healIfNeeded(creep);
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.Attacking:
	            runAttacking(creep);
	            break;
	        case State.Sleep:
	            runSleep(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	;
	function runWaiting(creep) {
	    creep.setState(State.MovingToTarget);
	}
	function runSleep(creep) {
	    if (Game.time % 9 === 0) {
	        creep.setState(State.Attacking);
	    }
	}
	function runMovingToTarget(creep) {
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            Logger_1.log.error("Ranger " + creep.name + " has no target room.", creep.room.name);
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
	        creep.setState(State.Attacking);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
	    }
	}
	function runAttacking(creep) {
	    let targetToAttack = getTargetToAttack(creep);
	    if (Game.time % 13 === 0) {
	        targetToAttack = getNewTargetToAttack(creep);
	        if (targetToAttack !== null) {
	            creep.memory.targetToAttack = targetToAttack.id;
	        }
	    }
	    if (targetToAttack === null) {
	        targetToAttack = getNewTargetToAttack(creep);
	    }
	    if (targetToAttack !== null) {
	        creep.memory.targetToAttack = targetToAttack.id;
	        if (targetToAttack instanceof Creep) {
	            let range = 3;
	            if (targetToAttack.getActiveBodyparts(ATTACK) === 0) {
	                range = 1;
	            }
	            _Military.kiteAndAttack(creep, targetToAttack, range);
	        }
	        else {
	            moveAndAttack(creep, targetToAttack);
	        }
	    }
	    else {
	        let targetRoom = getNextTargetRoom(creep);
	        if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
	            Logger_1.log.info("Ranger " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
	            creep.setState(State.MovingToTarget);
	        }
	        else {
	            creep.setState(State.Sleep);
	        }
	    }
	}
	function getTargetToAttack(creep) {
	    let targetToAttack = Game.getObjectById(creep.memory.targetToAttack);
	    if (targetToAttack !== null) {
	        return targetToAttack;
	    }
	    else {
	        return null;
	    }
	}
	function getNewTargetToAttack(creep) {
	    let allCreeps = _Targeting.findHostileCreepsInRoom(creep.room);
	    if (allCreeps.length > 0) {
	        let dangerous = [];
	        let claimers = [];
	        for (let c of allCreeps) {
	            if (c.getActiveBodyparts(CLAIM) > 0) {
	                claimers.push(c);
	            }
	            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) {
	                dangerous.push(c);
	            }
	        }
	        if (dangerous.length > 0) {
	            return creep.pos.findClosestByRange(dangerous);
	        }
	        if (claimers.length > 0) {
	            return creep.pos.findClosestByRange(claimers);
	        }
	        return creep.pos.findClosestByRange(allCreeps);
	    }
	    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);
	    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
	    if (vitalStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
	    }
	    let allStructures = _Targeting.findHostileStructures(creep.room);
	    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);
	    if (allStructuresWithoutBigRampart.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    if (vitalStructures.length > 0) {
	        return creep.pos.findClosestByRange(vitalStructures);
	    }
	    if (allStructures.length > 0) {
	        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
	    }
	    return null;
	}
	function moveAndAttack(creep, targetToAttack) {
	    let range = creep.pos.getRangeTo(targetToAttack);
	    if (range === 1) {
	        creep.attack(targetToAttack);
	    }
	    if (range > 1) {
	        let response = creep.moveTo(targetToAttack);
	        if (response === ERR_NO_PATH) {
	            findWallToDestroy(creep, targetToAttack);
	        }
	    }
	}
	function findWallToDestroy(creep, targetToAttack) {
	    let path = PathFinder.search(creep.pos, { pos: targetToAttack.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
	    }).path;
	    for (let roomPos of path) {
	        let structures = roomPos.lookFor(LOOK_STRUCTURES);
	        if (structures.length > 0) {
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	                    Logger_1.log.info("Paladin needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
	                    creep.memory.targetToAttack = s.id;
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
	}
	function getRoomCallbackForWallDestruction(roomName) {
	    let room = Game.rooms[roomName];
	    if (!room)
	        return new PathFinder.CostMatrix;
	    let costs = new PathFinder.CostMatrix;
	    room.find(FIND_STRUCTURES).forEach(function (structure) {
	        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
	            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 1000));
	        }
	    });
	    return costs;
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.target = creep.memory.route.shift();
	    }
	    return creep.memory.target;
	}
	function healIfNeeded(creep) {
	    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
	        creep.heal(creep);
	    }
	}


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ScoutingManager = __webpack_require__(48);
	const QuoteUtilities = __webpack_require__(108);
	function run(creep) {
	    if (creep.memory.target === undefined) {
	        creep.memory.target = ScoutingManager.getSigningTarget(creep.memory.homeroom);
	        if (creep.memory.target === undefined) {
	            creep.suicide();
	            return;
	        }
	    }
	    let targetRoom = Game.rooms[creep.memory.target];
	    if (targetRoom instanceof Room && targetRoom.controller !== undefined) {
	        let targetController = targetRoom.controller;
	        if (creep.pos.roomName !== targetRoom.name || creep.pos.getRangeTo(targetController) > 1) {
	            creep.travelTo(targetController);
	        }
	        else {
	            let quote = QuoteUtilities.getRandomQuote(creep.room.controller !== undefined && creep.room.controller.my);
	            creep.signController(targetController, quote);
	            creep.memory.target = undefined;
	        }
	    }
	    else {
	        creep.memory.target = undefined;
	    }
	}
	exports.run = run;
	;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

	"use strict";
	function getRandomQuote(ownedRoom) {
	    if (Game.shard.name === "shard0") {
	        return "The END is coming. Join the Church of the END";
	    }
	    if (ownedRoom) {
	        return quote;
	    }
	    return quotes[Math.floor(Math.random() * quotes.length)];
	}
	exports.getRandomQuote = getRandomQuote;
	;
	const quote = "Operated by KasamiBot - https://kasami.github.io/kasamibot/";
	const quotes = [
	    "Life is about increasing GCL, not mining minerals. -Kevin Kruse",
	    "Whatever the mind of creeps can conceive and believe, it can be programmed to. –Napoleon Hill",
	    "Strive not to be a success, but rather to get to the next GCL. –Albert Einscreep",
	    "I attribute my GCL to this: I never gave or took any excuse. –Florence Nightingale",
	    "You miss 100% of the shots you don’t take. –Source Keeper Guard",
	    "The most difficult thing is the decision to expand, the rest is merely tenacity. –Amelia Earhart",
	    "Every upgrade brings me closer to the next GCL level. –Babe Ruth",
	    "Definiteness of purpose is the starting point of all GCL. –W. Clement Stone",
	    "Life isn't about getting and having, it's about increasing GCL. –Kevin Kruse",
	    "Screeps code is what happens to you while you’re busy making other plans. –John Lennon",
	    "We become what we program. –Earl Nightingale",
	    "Life is 10% what happens to me and 90% of how I was programmed. –Charles Swindoll",
	    "The code is everything. What you write you become. –Buddha",
	    "An unexamined room is not worth scouting. –Socrates",
	    "Eighty percent of success is upgrading. –Woody Allen",
	    "Your time is limited to 1500 ticks, so don’t waste it living someone else’s life. –Steve Jobs",
	    "Winning isn’t everything, but wanting to win is, and programming. –Vince Lombardi",
	    "I am not a product of my circumstances. I am a product of my implementation. –Stephen Covey",
	    "Either you run the code, or the code runs you. –Jim Rohn",
	    "Whether you think you can or you think you can’t program screeps, you’re right. –Henry Ford",
	    "The best revenge is massive GCL. –Frank Sinatra",
	    "Life shrinks or expands in proportion to one's code. –Anais Nin",
	    "There is only one way to avoid criticism: do nothing, say nothing, and code nothing. –Aristotle",
	    "The only creep you are destined to become is the creep you where programmed to be. –Ralph Waldo Emerson",
	    "Confidently expanding in direction of your dreams. Live the 1500 ticks you have imagined. –Henry David Thoreau",
	    "Believe you can code and you’re halfway there. –Theodore Roosevelt",
	    "Everything you’ve ever wanted is on the other side of the map. –George Addair",
	    "Start where you are. Use what you have. Upgrade what you can. –Arthur Ashe",
	    "When I let go of what I am, I become what I might be coded to be. –Lao Tzu",
	    "Happiness is not something readymade. It comes from GCL. –Dalai Lama",
	    "Too many of us are not coding our dreams because we are coding our fears. –Les Brown",
	    "I didn’t fail at programming. I just found 100 ways to program it wrong. –Benjamin Franklin",
	    "There are no traffic jams along the sector highways. –Roger Staubach",
	    "It is never too late to program what you might have been. –George Eliot",
	    "I would rather die of programming than of boredom. –Vincent van Gogh",
	    "Build your own rooms, or someone else will hire you to build theirs. –Farrah Gray",
	    "Power proccessing costs energy. But then so does ignorance. –Sir Claus Moser",
	    "It does not matter how slowly you upgrade as long as you do not stop. –Confucius",
	    "Expand quickly and dare to fail. –Norman Vaughan",
	    "Do what you can, in your rooms, with what you have. –Teddy Roosevelt",
	    "Dreaming, after all, is a form of programming. –Gloria Steinem",
	    "The code is what we make it, always has been, always will be. –Grandma Moses",
	    "It’s not the GCL in your life that count. It’s the life in your GCL. –Abraham Lincoln",
	    "Change your code and you change your world. –Norman Vincent Peale",
	    "The only way to write a great AI is to love what you do. –Steve Jobs",
	    "If you can code it, you can achieve it. –Zig Ziglar",
	    "You can code anything, but not everything. -David Allen",
	    "CPU perfection is achieved, not when there is no more to add, but when there is no left to take away. -Antoine de Saint-Exupéry",
	    "You must be the change you wish to see in the sector. -Gandhi",
	    "To the man who only has a CLAIM, everything he encounters begins to look like a controller. -Abraham Maslow",
	    "The real voyage of discovery consists not in seeking new features but using new code. -Marcel Proust",
	    "Even if you’re on the right track, you’ll get run over if you just sit there without ramparts. - Will Rogers",
	    "I’d rather live with a good spagetti code than a bad operating system. -Aryeh Frimer",
	    "The cure for boredom is new features. There is no cure for featurehunger. -Ellen Parr",
	    "The trouble with the creep race is that even if you win, you’re still a creep. -Lily Tomlin",
	    "Only I can change my code. No one can do it for me. -Carol Burnett",
	    "Optimism is the faith that leads to GCL. Nothing can be done without hope and confidence. -Helen Keller",
	    "Our greatest weakness lies in giving up. The way to succeed is always to try more refactoring. -Thomas A. Edison",
	    "The pathfinding algorithm always seems impossible until it's done. -Nelson Mandela",
	    "Always do your best. What you reserve now, you will harvest later. -Og Mandino",
	    "With the new day comes new code and new refactoring. -Eleanor Roosevelt",
	    "The past code revisions cannot be changed. The future code is yet in your power. -Unknown",
	    "Boosted attackers will never overtake me if my determination to succeed is strong enough. -Og Mandino",
	    "Setting goals is the first step in turning the ideas into code. -Tony Robbins",
	    "You can't cross the highways merely by standing and staring at the portal room. -Rabindranath Tagore",
	    "Code quality is not an act, it is a habit. -Aristotle",
	    "If you can dream it, you can code it. -Disney",
	    "Accept the code challenges so that you can fell the exhilaration of victory. -George S. Patton",
	    "The secret of getting ahead is getting started with coding. -Mark Twain",
	    "Keep your eyes on the stars, your feet on the ground, and fingers on the keyboard. -Theodore Roosevelt",
	    "If you got wiped out yesterday, respawn today. -H. G. Wells",
	    "Either remove or be removed. -Ezra Pound",
	    "You are never too old to resettle or code another architecture. -Les Brown",
	    "Don't watch the creeps; do what they do. Keep upgrading. -Sam Levenson",
	    "When a room is important enough, you attack it even if the odds are not in your favor. -Elon Musk",
	    "Your GCL is Screeps's gift to you. What you do with it is your gift back to Screeps. -Leo Buscaglia",
	    "A creative man is motivated by the desire to code, and by the desire to beat others. -Ayn Rand",
	    "Upgrade the controller whenever possible. It is always possible. -Dalai Lama",
	    "Set your goals high, and don't stop coding till you get there. -Bo Jackson",
	    "If you want to conquer fear, don't sit home and think about it. Grab a bear and start coding. -Dale Carnegie",
	    "Well coded is better than well pseudocoded. -Benjamin Franklin",
	    "There is only one part of screeps you can be certain of improving, and that's your own code. -Aldous Huxley",
	    "Aim for the Source Keeper. If you miss, you may hit the portal. -W. Clement Stone",
	    "Screeps is the art of getting creeps to do what you want them to do because they want to do it. -Dwight D. Eisenhower",
	    "I'd rather attempt to write code great and fail than to copy code and succeed. -Robert H. Schuller",
	    "Things do not happend. Things are coded to happen. -John F. Kennedy",
	    "By failing to prepare for attacks, you are preparing to fail. -Benjamin Franklin",
	    "Do you want to know who you are? Don't ask. Code. The code will delineate and define you. -Thomas Jefferson",
	    "I am not afraid... I was coded to do this. -Joan of Arc",
	    "Good code violently executed now is better than perfect code executed next week. -George S. Patton",
	    "What you code today can improve all your tomorrows. -Ralph Marston",
	    "Code something wonderful, people may imitate it. -Albert Schweitzer",
	    "Opportunity does not knock, it presents itself when you invade the sector. -Kyle Chandler",
	    "The most effective way to code it, is to code it. -Amelia Earhart",
	    "If you don't like how things are, refactor. You're not an OCS-member. -Jim Rohn",
	    "The will to succeed is important, but what's more important is to upgrade. -Bobby Knight",
	    "The ultimate aim of the ego is not to read code, but to write code. -Muhammad Iqbal",
	    "There's a way to code it better - find it. -Thomas A. Edison",
	    "You just can't beat the person who never stops respawning. -Babe Ruth",
	    "Code as if what you do makes a difference. It does. -William James",
	    "Code your AI with your whole heart, and you will succeed - there's so little competition. -Elbert Hubbart",
	    "Go for it now. The sector is promised to no one. -Wayne Dyer",
	    "Change your code today. Don't gamble on the future, act now, without delay. -Simone de Beauvoir",
	    "It's always too early to quit upgrading. -Norman Vincent Peale",
	    "You can't build a reputation on what you are going to code. -Henry Ford",
	    "Small code snippets implemented are better than great features planned. -Peter Marshall",
	    "There is nothing deep down inside us except what we have coded ourselves. -Rickard Rorty",
	    "When one must code in the console, one can. -Charlotte Whitton",
	    "Get action. Seize the moment. Creeps was never intended to become a container. -Theodore Roosevelt",
	    "Begin to code now what you will be hereafter. -William James",
	    "Success in the only motivational factor that a screeps player with character needs. -Woody Hayes",
	    "There is progress whether ye are going forward or backward. The thing is to upgrade. -Edgar Cayce",
	    "I code, therefore I am. -Simone Weil"
	];


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	const _Common = __webpack_require__(34);
	var State;
	(function (State) {
	    State[State["TankUp"] = 0] = "TankUp";
	    State[State["MovingToRoom"] = 1] = "MovingToRoom";
	    State[State["Pacman"] = 2] = "Pacman";
	    State[State["Ayce"] = 3] = "Ayce";
	    State[State["Upgrading"] = 4] = "Upgrading";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.TankUp);
	    }
	    switch (creep.getState()) {
	        case State.TankUp:
	            runTankUp(creep);
	            break;
	        case State.MovingToRoom:
	            runMovingToRoom(creep);
	            break;
	        case State.Upgrading:
	            runUpgrading(creep);
	            break;
	        case State.Pacman:
	            runPacman(creep);
	            break;
	        case State.Ayce:
	            runAyce(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.TankUp);
	            break;
	    }
	}
	exports.run = run;
	;
	function runTankUp(creep) {
	    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
	        creep.room.storage !== undefined) {
	        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
	        if (distanceToStorage > 1) {
	            creep.moveTo(creep.room.storage);
	        }
	        else {
	            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        creep.setState(State.MovingToRoom);
	        runMovingToRoom(creep);
	    }
	}
	function runMovingToRoom(creep) {
	    let praiseroom = creep.memory.target;
	    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
	        creep.travelToRoom(praiseroom);
	    }
	    else {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	    }
	}
	function runUpgrading(creep) {
	    let praiseroom = Game.rooms[creep.memory.target];
	    if (praiseroom !== undefined && praiseroom.controller !== undefined &&
	        praiseroom.controller.my && praiseroom.controller.level < 2) {
	        if (creep.upgradeController(praiseroom.controller) === ERR_NOT_IN_RANGE) {
	            creep.travelTo(praiseroom.controller);
	        }
	    }
	    else {
	        creep.setState(State.Pacman);
	        runPacman(creep);
	    }
	}
	function runPacman(creep) {
	    if (Game.flags["Pacman"] instanceof Flag) {
	        let flag = Game.flags["Pacman"].pos;
	        if (creep.memory.pacmanIndex === undefined) {
	            creep.memory.pacmanIndex = 0;
	        }
	        let positions = getPacmanPositions();
	        if (creep.memory.pacmanIndex + 1 > positions.length) {
	            if (Game.flags["Pacman"] instanceof Flag) {
	                Game.flags["Pacman"].remove();
	            }
	            creep.setState(State.Ayce);
	            runAyce(creep);
	            return;
	        }
	        makeFancyArt(creep, positions, flag, creep.memory.pacmanIndex);
	    }
	    else {
	        creep.setState(State.Ayce);
	        runAyce(creep);
	    }
	}
	function runAyce(creep) {
	    if (Game.flags["Ayce"] instanceof Flag) {
	        let flag = Game.flags["Ayce"].pos;
	        if (creep.memory.ayceIndex === undefined) {
	            creep.memory.ayceIndex = 0;
	        }
	        let positions = getAycePositions();
	        if (creep.memory.ayceIndex + 1 > positions.length) {
	            if (Game.flags["Ayce"] instanceof Flag) {
	                Game.flags["Ayce"].remove();
	            }
	            if (creep.room.controller !== undefined && creep.room.controller.my && creep.room.controller.level === 2) {
	                creep.room.controller.unclaim();
	            }
	            creep.suicide();
	            return;
	        }
	        makeFancyArt(creep, positions, flag, creep.memory.ayceIndex);
	    }
	    else {
	        if (creep.room.controller !== undefined && creep.room.controller.my && creep.room.controller.level === 2) {
	            creep.room.controller.unclaim();
	        }
	        creep.suicide();
	        return;
	    }
	}
	function makeFancyArt(creep, positions, flag, index) {
	    let current = positions[index];
	    let position = new RoomPosition(flag.x + current[1], flag.y + current[0], flag.roomName);
	    let atPos = position.look();
	    for (let x of atPos) {
	        if (x.constructionSite !== undefined) {
	            let range = creep.pos.getRangeTo(x.constructionSite);
	            if (range === 0) {
	                _Common.moveRandomDirection(creep);
	            }
	            else if (range > 3) {
	                creep.moveTo(x.constructionSite);
	            }
	            else {
	                creep.build(x.constructionSite);
	            }
	            return;
	        }
	        else if (x.structure !== undefined && x.structure.hits === 1) {
	            let range = creep.pos.getRangeTo(x.structure);
	            if (range > 3) {
	                creep.moveTo(x.structure);
	            }
	            else {
	                creep.repair(x.structure);
	            }
	            return;
	        }
	        else if (x.structure !== undefined) {
	            if (creep.getState() === State.Pacman) {
	                creep.memory.pacmanIndex++;
	            }
	            else if (creep.getState() === State.Ayce) {
	                creep.memory.ayceIndex++;
	            }
	            return;
	        }
	        let res = position.createConstructionSite(STRUCTURE_WALL);
	        if (res !== OK) {
	            console.log(creep.room.name + ": Tagger got error when building construction site: " + res);
	        }
	        else {
	            if (creep.pos.getRangeTo(position) > 3) {
	                creep.moveTo(position);
	            }
	        }
	    }
	}
	function getPacmanPositions() {
	    return [
	        [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
	        [1, 11], [1, 12],
	        [2, 13],
	        [3, 14],
	        [4, 15],
	        [5, 14], [5, 13],
	        [6, 12], [6, 11],
	        [7, 10], [7, 9],
	        [8, 8],
	        [9, 10], [9, 9],
	        [10, 11], [10, 12],
	        [11, 13], [11, 14],
	        [8, 14], [9, 14], [9, 15], [9, 16], [8, 16],
	        [8, 18], [9, 18], [9, 19], [9, 20], [8, 20],
	        [7, 20], [7, 19], [7, 18], [7, 16], [7, 15], [7, 14],
	        [12, 15],
	        [13, 14],
	        [14, 13],
	        [15, 12],
	        [15, 11],
	        [16, 10], [16, 9], [16, 8], [16, 7], [16, 6],
	        [15, 5], [15, 4],
	        [14, 3],
	        [13, 2],
	        [12, 1],
	        [11, 1],
	        [10, 0],
	        [9, 0],
	        [8, 0],
	        [7, 0],
	        [6, 0],
	        [5, 1],
	        [4, 1],
	        [3, 2],
	        [2, 3],
	        [1, 4], [1, 5],
	    ];
	}
	function getAycePositions() {
	    return [
	        [0, 1], [0, 2], [0, 5], [0, 9], [0, 12], [0, 13], [0, 17], [0, 18], [0, 19],
	        [1, 0], [1, 3], [1, 6], [1, 8], [1, 0], [1, 11], [1, 14], [1, 16],
	        [2, 0], [2, 3], [2, 7], [2, 11], [2, 16], [2, 17], [2, 18],
	        [3, 0], [3, 1], [3, 2], [3, 3], [3, 7], [3, 11], [3, 14], [3, 16],
	        [4, 0], [4, 3], [4, 7], [4, 12], [4, 13], [4, 17], [4, 18], [4, 19]
	    ];
	}


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToTarget"] = 1] = "MovingToTarget";
	    State[State["Declaring"] = 2] = "Declaring";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToTarget);
	    }
	    switch (creep.getState()) {
	        case State.MovingToTarget:
	            runMovingToTarget(creep);
	            break;
	        case State.Declaring:
	            runDeclaring(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.MovingToTarget);
	            break;
	    }
	}
	exports.run = run;
	;
	function runMovingToTarget(creep) {
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        targetRoom = getNextTargetRoom(creep);
	        if (targetRoom === undefined) {
	            Logger_1.log.info("Declarer " + creep.name + " has no target room, is being removed.", creep.room.name);
	            creep.suicide();
	            return;
	        }
	    }
	    if (targetRoom === creep.room.name) {
	        creep.setState(State.Declaring);
	        runDeclaring(creep);
	    }
	    else {
	        creep.travelToRoom(targetRoom, { allowHostile: false, allowSK: false, ignoreRoads: true });
	    }
	}
	function runDeclaring(creep) {
	    if (creep.room.name === creep.memory.target && creep.room.controller !== undefined) {
	        let targetController = creep.room.controller;
	        if (creep.pos.roomName !== creep.room.name || creep.pos.getRangeTo(targetController) > 1) {
	            creep.travelTo(targetController);
	        }
	        else {
	            let quote = "This room is property of the AYCE alliance. Stay away from this and neighbouring rooms.";
	            creep.signController(targetController, quote);
	            creep.memory.target = undefined;
	        }
	    }
	    else {
	        creep.memory.target = undefined;
	        creep.setState(State.MovingToTarget);
	    }
	}
	function getNextTargetRoom(creep) {
	    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
	        creep.memory.target = creep.memory.route.shift();
	    }
	    else {
	        creep.memory.target = undefined;
	    }
	    return creep.memory.target;
	}


/***/ }),
/* 111 */
/***/ (function(module, exports) {

	"use strict";
	class CommandOrder {
	}
	exports.CommandOrder = CommandOrder;
	function addCommandOrder(order) {
	    if (Memory.commandOrders === undefined) {
	        Memory.commandOrders = [];
	    }
	    Memory.commandOrders.push(order);
	}
	exports.addCommandOrder = addCommandOrder;
	function commandOrderIsValid(order) {
	    if (!(Game.rooms[order.room] instanceof Room)) {
	        return false;
	    }
	    return true;
	}
	exports.commandOrderIsValid = commandOrderIsValid;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const OrdersRepository = __webpack_require__(18);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const Order_1 = __webpack_require__(20);
	function orderWrecker(room, route) {
	    let maxTier = ProfileUtilities.getMaxTierOffroadWorkOnly(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getOffroadWorkOnlyBody(maxTier);
	    order.priority = priority_1.Priority.Standard;
	    order.memory = {
	        role: role_1.Role.Wrecker,
	        target: undefined,
	        tier: maxTier,
	        route: route
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderWrecker = orderWrecker;
	function orderDrainer(room, tier, route) {
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getDrainerBody(tier);
	    order.priority = priority_1.Priority.Important;
	    order.memory = {
	        role: role_1.Role.Drainer,
	        target: undefined,
	        tier: tier,
	        route: route
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderDrainer = orderDrainer;
	function orderPaladin(room, route) {
	    let maxTier = ProfileUtilities.getMaxTierPaladin(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getPaladinBody(maxTier);
	    order.priority = priority_1.Priority.Important;
	    order.memory = {
	        role: role_1.Role.Paladin,
	        target: undefined,
	        tier: maxTier,
	        route: route
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderPaladin = orderPaladin;
	function orderRanger(room, route) {
	    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getRangerBody(maxTier);
	    order.priority = priority_1.Priority.Important;
	    order.memory = {
	        role: role_1.Role.Ranger,
	        target: undefined,
	        tier: maxTier,
	        route: route
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderRanger = orderRanger;
	function orderHarasser(room, target) {
	    let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getRangerBody(maxTier);
	    order.priority = priority_1.Priority.Standard;
	    order.memory = {
	        role: role_1.Role.Harasser,
	        target: target,
	        tier: maxTier
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderHarasser = orderHarasser;
	function orderTagger(room, target) {
	    let targetRoom = Game.rooms[target];
	    if (targetRoom === undefined || targetRoom.controller === undefined || !targetRoom.controller.my) {
	        let claimerOrder = new Order_1.Order();
	        claimerOrder.body = ProfileUtilities.getClaimerBody(1);
	        claimerOrder.priority = priority_1.Priority.Critical;
	        claimerOrder.memory = {
	            role: role_1.Role.RoomClaimer,
	            target: target,
	            tier: 1
	        };
	        OrdersRepository.orderCreep(room, claimerOrder);
	    }
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getTaggerBody();
	    order.priority = priority_1.Priority.Important;
	    order.memory = {
	        role: role_1.Role.Tagger,
	        target: target,
	        tier: 1
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderTagger = orderTagger;
	function orderDeclarer(room, route) {
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getScoutBody(1);
	    order.priority = priority_1.Priority.Trivial;
	    order.memory = {
	        role: role_1.Role.Declarer,
	        route: route,
	        tier: 1
	    };
	    OrdersRepository.orderCreep(room, order);
	}
	exports.orderDeclarer = orderDeclarer;
	function orderTeamWrecker(room, tier, route, targets, boostLevel) {
	    let healerorder = new Order_1.Order();
	    healerorder.priority = priority_1.Priority.Critical;
	    healerorder.memory = {
	        role: role_1.Role.TeamHealer,
	        target: undefined,
	        tier: tier };
	    switch (boostLevel) {
	        case 0:
	            healerorder.body = ProfileUtilities.getB0TeamHealerBody(tier);
	            break;
	        case 1:
	            healerorder.body = ProfileUtilities.getB1TeamHealerBody(tier);
	            healerorder.memory.boost = [RESOURCE_GHODIUM_OXIDE, RESOURCE_LEMERGIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE];
	            break;
	        case 2:
	            healerorder.body = ProfileUtilities.getB2TeamHealerBody(tier);
	            healerorder.memory.boost = [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE];
	            break;
	        case 3:
	            healerorder.body = ProfileUtilities.getB3TeamHealerBody(tier);
	            healerorder.memory.boost = [RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE];
	            break;
	    }
	    let wreckerorder = new Order_1.Order();
	    wreckerorder.priority = priority_1.Priority.Critical;
	    wreckerorder.memory = {
	        role: role_1.Role.TeamWrecker,
	        target: undefined,
	        tier: tier,
	        route: route,
	        targets: targets
	    };
	    switch (boostLevel) {
	        case 0:
	            wreckerorder.body = ProfileUtilities.getB0TeamWreckerBody(tier);
	            break;
	        case 1:
	            wreckerorder.body = ProfileUtilities.getB1TeamWreckerBody(tier);
	            wreckerorder.memory.boost = [RESOURCE_GHODIUM_OXIDE, RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_KEANIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE];
	            break;
	        case 2:
	            wreckerorder.body = ProfileUtilities.getB2TeamWreckerBody(tier);
	            wreckerorder.memory.boost = [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ACID, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE];
	            break;
	        case 3:
	            wreckerorder.body = ProfileUtilities.getB3TeamWreckerBody(tier);
	            wreckerorder.memory.boost = [RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE];
	            break;
	    }
	    healerorder.twinOrder = wreckerorder;
	    OrdersRepository.orderCreep(room, healerorder);
	}
	exports.orderTeamWrecker = orderTeamWrecker;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const OrdersRepository = __webpack_require__(18);
	const Pioneer = __webpack_require__(114);
	const OperationLib = __webpack_require__(66);
	const RoomRepository = __webpack_require__(10);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const _Manager_1 = __webpack_require__(14);
	const Order_1 = __webpack_require__(20);
	const Logger_1 = __webpack_require__(7);
	class CrisisManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("CrisisManager");
	        this.hasRun = false;
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Critical) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 500 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    this.checkIfRoomNeedsEnergyConvoy(room);
	                    checkIfRoomSeemsDead(room);
	                    this.checkIfWeNeedPioneer(room);
	                    if (Memory.settings.bot === true) {
	                        this.checkIfRoomShouldBeAbandoned(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	                this.hasRun = true;
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.Pioneer, Pioneer.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 100 < Game.time) {
	                let rooms = this.roomService.getNormalRooms();
	                for (let room of rooms) {
	                    this.checkIfRoomNeedsEnergyConvoy(room);
	                    checkIfRoomSeemsDead(room);
	                    this.checkIfWeNeedPioneer(room);
	                    if (Memory.settings.bot === true) {
	                        this.checkIfRoomShouldBeAbandoned(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	                this.hasRun = true;
	            }
	        }
	    }
	    checkIfRoomShouldBeAbandoned(room) {
	        let level = RoomRepository.getRoomLevel(room);
	        if (level === roomlevel_1.RoomLevel.Metropolis) {
	            if (RoomRepository.getNumberOfSourcesMined(room) < 7) {
	                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
	                this.abandonRoom(room);
	                return;
	            }
	        }
	        else if (level === roomlevel_1.RoomLevel.City) {
	            if (RoomRepository.getNumberOfSourcesMined(room) < 5) {
	                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
	                this.abandonRoom(room);
	                return;
	            }
	        }
	        else if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
	            if (RoomRepository.getNumberOfSourcesMined(room) < 3) {
	                Logger_1.log.alert("The room is abandoned because it can not get enough sources to mine.", room.name);
	                this.abandonRoom(room);
	                return;
	            }
	        }
	    }
	    abandonRoom(room) {
	        if (room.controller === undefined) {
	            return;
	        }
	        let creepsInRoom = room.find(FIND_MY_CREEPS);
	        for (let c of creepsInRoom) {
	            c.suicide();
	        }
	        room.memory.badExpansion = true;
	        room.controller.unclaim();
	    }
	    checkIfWeNeedPioneer(room) {
	        if (room.isExpansion()) {
	            return;
	        }
	        let spawnedPioneers = this.creepService.getCreeps(role_1.Role.Pioneer, null, room.name).length;
	        let orderedPioneers = OrdersRepository.getCreepsInQueue(room, role_1.Role.Pioneer, room.name);
	        let spawnedMiners = this.creepService.getCreeps(role_1.Role.ContainerMiner, null, room.name).length;
	        let spawnedHaulers = this.creepService.getCreeps(role_1.Role.ContainerHauler, null, room.name).length +
	            this.creepService.getCreeps(role_1.Role.EnergyHauler, null, room.name).length;
	        if (RoomRepository.getAllOutposts(room).length === 0) {
	            return;
	        }
	        if (spawnedPioneers < 3 && orderedPioneers === 0 && spawnedMiners < 2 && spawnedHaulers < 2) {
	            orderPioneer(room);
	            let expansionWorkers = this.creepService.getCreeps(role_1.Role.ExpansionWorker, null, room.name).length;
	            if (expansionWorkers === 0) {
	                this.requestExpansionWorker(room);
	            }
	        }
	        else if (room.getBaseContainer() === undefined && (room.storage === undefined || !room.storage.isActive()) &&
	            (room.terminal === undefined || !room.terminal.isActive())) {
	            let expansionWorkers = this.creepService.getCreeps(role_1.Role.ExpansionWorker, null, room.name).length;
	            if (expansionWorkers < 2) {
	                this.requestExpansionWorker(room);
	            }
	        }
	    }
	    requestExpansionWorker(room) {
	        let providerRoom;
	        let distance;
	        let allRooms = this.roomService.getNormalRooms();
	        for (let r of allRooms) {
	            if (r.name !== room.name) {
	                let d = Game.map.getRoomLinearDistance(room.name, r.name);
	                if (distance === undefined || d < distance) {
	                    providerRoom = r;
	                    distance = d;
	                }
	            }
	        }
	        if (providerRoom !== undefined) {
	            this.orderExpansionWorker(providerRoom, room.name);
	        }
	    }
	    orderExpansionWorker(room, targetRoom) {
	        let maxTier = ProfileUtilities.getMaxTierHaulerEngineer(room.energyCapacityAvailable);
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.ExpansionWorker, targetRoom);
	        if (ordered === 0) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getHaulerEngineerBody(maxTier);
	            order.priority = priority_1.Priority.Low;
	            order.memory = { role: role_1.Role.ExpansionWorker, target: targetRoom, tier: maxTier };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    checkIfRoomNeedsEnergyConvoy(room) {
	        let level = RoomRepository.getRoomLevel(room);
	        if (level >= roomlevel_1.RoomLevel.CivilizedColony && (room.terminal === undefined || !room.terminal.isActive()) &&
	            room.storage !== undefined && room.storage.isActive() && room.storage.store[RESOURCE_ENERGY] < 10000 &&
	            !OperationLib.roomIsReceiveingHaulOperation(room.name)) {
	            OperationLib.createCrisisHaulOperation(room.name, this.roomService.getNormalRooms());
	        }
	    }
	}
	exports.CrisisManager = CrisisManager;
	function orderPioneer(room) {
	    let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyAvailable);
	    if (maxTier < 1) {
	        return;
	    }
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getEngineerBody(maxTier);
	    order.priority = priority_1.Priority.Blocker;
	    order.memory = { role: role_1.Role.Pioneer, target: room.name, tier: maxTier };
	    OrdersRepository.orderCreep(room, order);
	}
	function checkIfRoomSeemsDead(room) {
	    let creepsInRoom = room.find(FIND_MY_CREEPS);
	    if (creepsInRoom.length < 2 && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.BasicColonyReadyForExpansion) {
	        OrdersRepository.clearOrders(room);
	    }
	}


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	const RoomRepository = __webpack_require__(10);
	const PositionLib = __webpack_require__(46);
	const role_1 = __webpack_require__(16);
	const Logger_1 = __webpack_require__(7);
	var State;
	(function (State) {
	    State[State["MovingToSource"] = 1] = "MovingToSource";
	    State[State["Mining"] = 2] = "Mining";
	    State[State["Upgrading"] = 3] = "Upgrading";
	    State[State["Constructing"] = 4] = "Constructing";
	    State[State["FillingBase"] = 5] = "FillingBase";
	    State[State["DecideWhatToDoWithEnergy"] = 6] = "DecideWhatToDoWithEnergy";
	    State[State["DecideWhereToGetEnergy"] = 7] = "DecideWhereToGetEnergy";
	    State[State["ScavengeEnergy"] = 8] = "ScavengeEnergy";
	    State[State["GetEnergyFromStructure"] = 9] = "GetEnergyFromStructure";
	    State[State["RemoveHostileConstructionSites"] = 10] = "RemoveHostileConstructionSites";
	    State[State["MoveToHomeroom"] = 11] = "MoveToHomeroom";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToSource);
	    }
	    switch (creep.getState()) {
	        case State.RemoveHostileConstructionSites:
	            runRemoveHostileConstructionSites(creep);
	            break;
	        case State.MoveToHomeroom:
	            runMoveToHomeroom(creep);
	            break;
	        case State.MovingToSource:
	            runMovingToSource(creep);
	            break;
	        case State.Mining:
	            runMining(creep);
	            break;
	        case State.Upgrading:
	            runUpgrading(creep);
	            break;
	        case State.Constructing:
	            runConstructing(creep);
	            break;
	        case State.FillingBase:
	            runFillingBase(creep);
	            break;
	        case State.ScavengeEnergy:
	            runScavengeEnergy(creep);
	            break;
	        case State.GetEnergyFromStructure:
	            runGetEnergyFromStructure(creep);
	            break;
	        case State.DecideWhatToDoWithEnergy:
	            runDecideWhatToDoWithEnergy(creep);
	            break;
	        case State.DecideWhereToGetEnergy:
	            runDecideWhereToGetEnergy(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MovingToSource);
	            break;
	    }
	}
	exports.run = run;
	;
	function runMoveToHomeroom(creep) {
	    let homeroom = creep.memory.homeroom;
	    if (homeroom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
	        creep.travelToRoom(homeroom, { maxOps: 4000, ignoreRoads: true }, true);
	    }
	    else {
	        creep.setState(State.RemoveHostileConstructionSites);
	        runRemoveHostileConstructionSites(creep);
	    }
	}
	function runScavengeEnergy(creep) {
	    if (creep.carry.energy === creep.carryCapacity) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    let resource = Game.getObjectById(creep.memory.pickupid);
	    if (resource instanceof Resource && resource.amount > creep.carryCapacity / 10) {
	        let distanceToResource = creep.pos.getRangeTo(resource.pos);
	        if (distanceToResource > 1) {
	            creep.moveTo(resource);
	        }
	        else {
	            creep.pickup(resource);
	        }
	    }
	    else {
	        if (creep.carry.energy > 0) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	        }
	        else {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	        }
	    }
	}
	function runGetEnergyFromStructure(creep) {
	    if (creep.carry.energy === creep.carryCapacity) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    let structure = Game.getObjectById(creep.memory.pickupid);
	    if ((structure instanceof StructureTerminal || structure instanceof StructureStorage) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity) {
	        let distanceToStructure = creep.pos.getRangeTo(structure.pos);
	        if (distanceToStructure > 1) {
	            creep.moveTo(structure);
	        }
	        else {
	            creep.withdraw(structure, RESOURCE_ENERGY);
	        }
	    }
	    else {
	        if (creep.carry.energy > 0) {
	            creep.setState(State.DecideWhatToDoWithEnergy);
	            runDecideWhatToDoWithEnergy(creep);
	        }
	        else {
	            creep.setState(State.DecideWhereToGetEnergy);
	            runDecideWhereToGetEnergy(creep);
	        }
	    }
	}
	function runDecideWhereToGetEnergy(creep) {
	    let structuresWithEnergy = creep.room.find(FIND_HOSTILE_STRUCTURES, {
	        filter: function (c) {
	            return (c.structureType === STRUCTURE_STORAGE || c.structureType === STRUCTURE_TERMINAL) &&
	                c.store[RESOURCE_ENERGY] > 50;
	        } });
	    if (structuresWithEnergy.length > 0) {
	        creep.memory.pickupid = creep.pos.findClosestByRange(structuresWithEnergy).id;
	        creep.setState(State.GetEnergyFromStructure);
	        runGetEnergyFromStructure(creep);
	        return;
	    }
	    let pilesWithEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
	        filter: function (c) {
	            return c.resourceType === RESOURCE_ENERGY && c.amount > creep.carryCapacity / 3;
	        } });
	    if (pilesWithEnergy.length > 0) {
	        creep.memory.pickupid = creep.pos.findClosestByRange(pilesWithEnergy).id;
	        creep.setState(State.ScavengeEnergy);
	        runScavengeEnergy(creep);
	        return;
	    }
	    creep.setState(State.MovingToSource);
	    runMovingToSource(creep);
	}
	function runRemoveHostileConstructionSites(creep) {
	    let conSites = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType !== STRUCTURE_EXTRACTOR });
	    if (conSites !== null && conSites !== undefined) {
	        creep.travelTo(conSites, { maxOps: 4000, ignoreRoads: true });
	    }
	    else {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	    }
	}
	function runDecideWhatToDoWithEnergy(creep) {
	    if (creep.carry.energy < 5) {
	        creep.setState(State.MovingToSource);
	        runMovingToSource(creep);
	        return;
	    }
	    let controller = creep.room.controller;
	    if (controller !== undefined && (controller.ticksToDowngrade < 2000 || controller.progress > controller.progressTotal)) {
	        creep.setState(State.Upgrading);
	        runUpgrading(creep);
	        return;
	    }
	    let structuresNeedingEnergy = [];
	    if (creep.room.controller !== undefined && creep.room.controller.level === 3) {
	        structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
	            filter: function (c) {
	                return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER) &&
	                    c.energy < c.energyCapacity;
	            } });
	    }
	    else {
	        structuresNeedingEnergy = creep.room.find(FIND_MY_STRUCTURES, {
	            filter: function (c) {
	                return (c.structureType === STRUCTURE_SPAWN || c.structureType === STRUCTURE_EXTENSION || c.structureType === STRUCTURE_TOWER) &&
	                    c.energy < c.energyCapacity - 20;
	            } });
	    }
	    if (structuresNeedingEnergy.length > 0) {
	        creep.memory.fillingid = creep.pos.findClosestByRange(structuresNeedingEnergy).id;
	        creep.setState(State.FillingBase);
	        runFillingBase(creep);
	        return;
	    }
	    let importantConstructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
	        filter: (c) => c.structureType === STRUCTURE_TOWER || c.structureType === STRUCTURE_SPAWN });
	    if (importantConstructionSitesInRoom.length > 0) {
	        creep.memory.constructionid = creep.pos.findClosestByRange(importantConstructionSitesInRoom).id;
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	    if (constructionSitesInRoom.length > 0) {
	        creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
	        creep.memory.fillingid = creep.room.storage.id;
	        creep.setState(State.FillingBase);
	        runFillingBase(creep);
	        return;
	    }
	    creep.setState(State.Upgrading);
	    runUpgrading(creep);
	}
	function runMovingToSource(creep) {
	    if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
	        setTargetSource(creep);
	        if (creep.memory.sourceId === undefined || creep.memory.sourcePos === undefined) {
	            Logger_1.log.error("Could not set source for ExpansionWorker", creep.room.name);
	            return;
	        }
	    }
	    let sourcePos = new RoomPosition(creep.memory.sourcePos.x, creep.memory.sourcePos.y, creep.memory.sourcePos.roomName);
	    if (sourcePos instanceof RoomPosition) {
	        if (creep.room.name !== sourcePos.roomName || creep.pos.getRangeTo(sourcePos) > 1) {
	            creep.travelTo({ pos: sourcePos }, { maxOps: 4000, ignoreRoads: true });
	        }
	        else {
	            creep.setState(State.Mining);
	            runMining(creep);
	        }
	    }
	    else {
	        Logger_1.log.error("Invalid sourcePos for ExpansionWorker", creep.room.name);
	    }
	}
	function runMining(creep) {
	    let source = Game.getObjectById(creep.memory.sourceId);
	    if (source === null || source.room.name !== creep.room.name || creep.pos.getRangeTo(source.pos) > 1) {
	        creep.setState(State.MovingToSource);
	        runMovingToSource(creep);
	        return;
	    }
	    if (creep.carry.energy === creep.carryCapacity) {
	        if (!creep.isInHomeroom()) {
	            let constructionSitesInRoom = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
	            if (constructionSitesInRoom.length > 0) {
	                creep.memory.constructionid = creep.pos.findClosestByRange(constructionSitesInRoom).id;
	                creep.setState(State.Constructing);
	                runConstructing(creep);
	                return;
	            }
	        }
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    if (source.energy > 0) {
	        let responseHarvest = creep.harvest(source);
	        if (responseHarvest === OK) {
	            if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
	                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
	            }
	            Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
	        }
	    }
	}
	function runUpgrading(creep) {
	    if (creep.carry.energy === 0) {
	        creep.setState(State.DecideWhereToGetEnergy);
	        runDecideWhereToGetEnergy(creep);
	        return;
	    }
	    if (!creep.isInHomeroom()) {
	        creep.setState(State.MoveToHomeroom);
	        runMoveToHomeroom(creep);
	        return;
	    }
	    let controller = creep.room.controller;
	    if (controller !== undefined && controller.my) {
	        let range = creep.pos.getRangeTo(controller);
	        if (range > 3) {
	            creep.travelTo(controller, { maxOps: 4000, ignoreRoads: true });
	        }
	        else {
	            if (range === 3) {
	                creep.travelTo(controller, { maxOps: 4000, ignoreRoads: true });
	            }
	            let response = creep.upgradeController(controller);
	            if (response === OK) {
	                if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
	                }
	                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
	                }
	                else {
	                    Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
	                }
	            }
	        }
	    }
	    else {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	    }
	}
	function runConstructing(creep) {
	    if (creep.carry.energy === 0) {
	        creep.setState(State.DecideWhereToGetEnergy);
	        runDecideWhereToGetEnergy(creep);
	        return;
	    }
	    let constructionSite = Game.getObjectById(creep.memory.constructionid);
	    if (constructionSite === null) {
	        if (!creep.isInHomeroom()) {
	            creep.setState(State.MoveToHomeroom);
	            runMoveToHomeroom(creep);
	            return;
	        }
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
	        creep.travelTo(constructionSite, { maxOps: 4000, ignoreRoads: true });
	    }
	}
	function runFillingBase(creep) {
	    if (creep.carry.energy === 0) {
	        creep.setState(State.DecideWhereToGetEnergy);
	        runDecideWhereToGetEnergy(creep);
	        return;
	    }
	    let fillingSite = Game.getObjectById(creep.memory.fillingid);
	    if (!(fillingSite instanceof StructureStorage) && (fillingSite === null || fillingSite.energy === fillingSite.energyCapacity)) {
	        creep.setState(State.DecideWhatToDoWithEnergy);
	        runDecideWhatToDoWithEnergy(creep);
	        return;
	    }
	    if (creep.transfer(fillingSite, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	        creep.travelTo(fillingSite, { maxOps: 4000, ignoreRoads: true });
	    }
	}
	function getCountOfWorkersForSource(sourceid, homeroom) {
	    let count = 0;
	    for (let creepName in Game.creeps) {
	        let creep = Game.creeps[creepName];
	        if (creep.memory.sourceId === sourceid &&
	            creep.memory.role === role_1.Role.Pioneer) {
	            count++;
	        }
	    }
	    for (let order of homeroom.memory.orders) {
	        if (order.memory.sourceId === sourceid &&
	            order.memory.role === role_1.Role.Pioneer) {
	            count++;
	        }
	    }
	    return count;
	}
	function setTargetSource(creep) {
	    let homeRoom = Game.rooms[creep.memory.homeroom];
	    if (creep.memory.target !== undefined) {
	        creep.memory.sourceId = creep.memory.target;
	        creep.memory.sourcePos = getPosForSource(homeRoom, creep.memory.target);
	        if (creep.memory.sourcePos !== undefined) {
	            return;
	        }
	    }
	    if (!(homeRoom instanceof Room)) {
	        Logger_1.log.error("Could not access homeroom for Pioneer", creep.room.name);
	        return;
	    }
	    let sources = homeRoom.getSources();
	    let outposts = RoomRepository.getBasicOutposts(homeRoom);
	    for (let c of _.range(0, 10)) {
	        for (let source of sources) {
	            if (getCountOfWorkersForSource(source.id, homeRoom) === c) {
	                creep.memory.sourceId = source.id;
	                creep.memory.target = source.id;
	                creep.memory.sourcePos = source.pos;
	                return;
	            }
	        }
	        for (let outpost of outposts) {
	            if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
	                for (let sourceId of IntelLib.sourceIds(outpost)) {
	                    if (getCountOfWorkersForSource(sourceId, homeRoom) === c) {
	                        creep.memory.sourceId = sourceId;
	                        creep.memory.target = sourceId;
	                        creep.memory.sourcePos = IntelLib.sourcePos(outpost, sourceId);
	                        return;
	                    }
	                }
	            }
	        }
	    }
	}
	function getPosForSource(homeRoom, sourceId) {
	    let sources = homeRoom.getSources();
	    let outposts = RoomRepository.getBasicOutposts(homeRoom);
	    for (let source of sources) {
	        if (source.id === sourceId) {
	            return source.pos;
	        }
	    }
	    for (let outpost of outposts) {
	        if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
	            for (let sId of IntelLib.sourceIds(outpost)) {
	                if (sId === sourceId) {
	                    return IntelLib.sourcePos(outpost, sourceId);
	                }
	            }
	        }
	    }
	}


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomUtilities = __webpack_require__(36);
	const _Manager_1 = __webpack_require__(14);
	class LinkManager extends _Manager_1.Manager {
	    constructor(roomService) {
	        super("LinkManager");
	        this.roomService = roomService;
	    }
	    ;
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            let rooms = this.roomService.getNormalRooms();
	            for (let room of rooms) {
	                runLinks(room);
	            }
	        }
	    }
	}
	exports.LinkManager = LinkManager;
	function runLinks(room) {
	    if (room.controller === undefined) {
	        return;
	    }
	    if (Game.time % 2 === 0) {
	        let baseLink = room.getBaseLink();
	        let controllerLink = room.controller.getContainerOrLink();
	        if (baseLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink instanceof StructureLink && baseLink.cooldown === 0 && controllerLink.energy < 200) {
	            baseLink.transferEnergy(controllerLink);
	        }
	    }
	}
	function roomIsEmpty(room) {
	    if (RoomUtilities.hasContainer(room) && RoomUtilities.hasAtLeastExtensions(room, 5)) {
	        let containersInRoom = room.find(FIND_STRUCTURES, {
	            filter: { structureType: STRUCTURE_CONTAINER } });
	        for (let container of containersInRoom) {
	            if (container.store[RESOURCE_ENERGY] < 100) {
	                return true;
	            }
	        }
	    }
	    return false;
	}
	exports.roomIsEmpty = roomIsEmpty;
	function buildingHasEnergy(building, amount = 0) {
	    if (building.structureType === STRUCTURE_CONTAINER) {
	        return building.store[RESOURCE_ENERGY] > 0;
	    }
	    return building.energy > amount;
	}
	exports.buildingHasEnergy = buildingHasEnergy;
	function canTakeEnergy(building, amount = 0) {
	    if (!(building instanceof Structure)) {
	        return false;
	    }
	    if (building.structureType === STRUCTURE_CONTAINER) {
	        return building.store[RESOURCE_ENERGY] > amount;
	    }
	    return building.energy === building.energyCapacity;
	}
	exports.canTakeEnergy = canTakeEnergy;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const OrdersUtilities = __webpack_require__(117);
	const ProfileUtilities = __webpack_require__(19);
	const Logger_1 = __webpack_require__(7);
	const RoomRepository = __webpack_require__(10);
	const ExtensionLib = __webpack_require__(4);
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


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const role_1 = __webpack_require__(16);
	function makeRoleName(role) {
	    return role_1.Role[role];
	}
	exports.makeRoleName = makeRoleName;
	function makeRandomCreepId() {
	    var text = "";
	    var possibleHighcase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	    var possibleLowcase = "abcdefghijklmnopqrstuvwxyz";
	    text += possibleHighcase.charAt(Math.floor(Math.random() * possibleHighcase.length));
	    for (var i = 1; i < 3; i++)
	        text += possibleLowcase.charAt(Math.floor(Math.random() * possibleLowcase.length));
	    return text;
	}
	exports.makeRandomCreepId = makeRandomCreepId;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const SourceUtilities = __webpack_require__(70);
	const ProfileUtilities = __webpack_require__(19);
	const ContainerHauler = __webpack_require__(119);
	const EnergyHauler = __webpack_require__(120);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const Order_1 = __webpack_require__(20);
	const _Manager_1 = __webpack_require__(14);
	const Logger_1 = __webpack_require__(7);
	class HaulingManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("HaulingManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.ContainerHauler, ContainerHauler.run);
	            this.creepService.runCreeps(role_1.Role.EnergyHauler, EnergyHauler.run);
	            this.creepService.runCreeps(role_1.Role.SKHauler, ContainerHauler.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 10 < Game.time) {
	                let rooms = this.roomService.getNormalAndNotExpansion();
	                for (let room of rooms) {
	                    if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City) {
	                        this.organizeEnergyHauling(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	    }
	    organizeEnergyHauling(room) {
	        let activeHaulers = this.creepService.getCreeps(role_1.Role.EnergyHauler, null, room.name);
	        let sourcesIds = SourceUtilities.getSourcesNeedingHauling(room);
	        let sourcesBeingServiced = [];
	        for (let h of activeHaulers) {
	            if (h.memory.target !== undefined) {
	                sourcesBeingServiced.push(h.memory.target);
	            }
	        }
	        room.memory.dumpSources = _.difference(sourcesIds, sourcesBeingServiced);
	        let orderedHaulers = OrdersRepository.getCreepsInQueue(room, role_1.Role.EnergyHauler);
	        if (orderedHaulers < 2) {
	            let currentIdleHaulers = this.creepService.getIdleEnergyHaulers(room.name).length;
	            if (currentIdleHaulers === 0) {
	                if (room.memory.dumpSources !== undefined && room.memory.dumpSources.length > 0) {
	                    orderEnergyhauler(room);
	                }
	            }
	            if (Memory.settings.logEnergyhauling) {
	                Logger_1.log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length + " (" + currentIdleHaulers + " idle)", room.name);
	            }
	        }
	        else {
	            if (Memory.settings.logEnergyhauling) {
	                Logger_1.log.info("EH-stats - serviced: " + sourcesBeingServiced.length + "/" + sourcesIds.length + " - haulers: " + activeHaulers.length, room.name);
	            }
	        }
	    }
	}
	exports.HaulingManager = HaulingManager;
	function orderEnergyhauler(room) {
	    let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	    let order = new Order_1.Order();
	    order.body = ProfileUtilities.getHaulerBody(maxTier);
	    order.priority = priority_1.Priority.Standard;
	    if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 10000) {
	        order.priority = priority_1.Priority.Important;
	    }
	    order.memory = { role: role_1.Role.EnergyHauler, target: undefined, tier: maxTier };
	    OrdersRepository.orderCreep(room, order);
	}


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const EnergyLib = __webpack_require__(35);
	const PathfindingUtilities = __webpack_require__(3);
	const _Common = __webpack_require__(34);
	const RoomRepository = __webpack_require__(10);
	const roomlevel_1 = __webpack_require__(11);
	var State;
	(function (State) {
	    State[State["Tanking"] = 1] = "Tanking";
	    State[State["Dumping"] = 2] = "Dumping";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.Tanking);
	    }
	    switch (creep.getState()) {
	        case State.Tanking:
	            runTanking(creep);
	            break;
	        case State.Dumping:
	            runDumping(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.Tanking);
	            break;
	    }
	}
	exports.run = run;
	function runTanking(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
	        creep.setState(State.Dumping);
	        runDumping(creep);
	        return;
	    }
	    checkIfOutdated(creep);
	    if (creep.memory.targetRoom === undefined) {
	        getTargetRoom(creep);
	    }
	    if (_Common.targetRoomHasInvaders(creep, creep.memory.targetRoom) || _Common.stayAwayFromSourceKeeper(creep)) {
	        return;
	    }
	    let container = Game.getObjectById(creep.memory.container);
	    if (container === null) {
	        if (creep.room.name === creep.memory.targetRoom) {
	            if (!setMyContainer(creep)) {
	                return;
	            }
	        }
	        else {
	            if (creep.memory.targetSource === undefined) {
	                getTargetSource(creep);
	            }
	            if (creep.memory.targetSourcePos === undefined) {
	                getTargetSourcePos(creep, creep.memory.targetSource);
	            }
	            if (creep.memory.targetSourcePos !== undefined) {
	                creep.travelTo({ pos: new RoomPosition(creep.memory.targetSourcePos.x, creep.memory.targetSourcePos.y, creep.memory.targetSourcePos.roomName) });
	            }
	            else {
	                creep.travelToRoom(creep.memory.targetRoom);
	            }
	            return;
	        }
	    }
	    let response = creep.withdraw(container, RESOURCE_ENERGY);
	    if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
	        creep.travelTo(container);
	    }
	    else if (response === ERR_NOT_ENOUGH_RESOURCES) {
	        creep.setState(State.Dumping);
	        runDumping(creep);
	    }
	}
	function runDumping(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.setState(State.Tanking);
	        return;
	    }
	    if (creep.memory.targetRoom === undefined) {
	        getTargetRoom(creep);
	    }
	    setOutdatedTick(creep);
	    if (creep.memory.dropof === undefined) {
	        setMyDropof(creep);
	    }
	    let storage = Game.getObjectById(creep.memory.dropof);
	    if (!(storage instanceof StructureContainer) && Game.time % 3 === 0 && Game.rooms[creep.memory.homeroom] instanceof Room && RoomRepository.getRoomLevel(Game.rooms[creep.memory.homeroom]) < roomlevel_1.RoomLevel.CivilizedColony) {
	        setMyDropof(creep);
	    }
	    if (!(storage instanceof Structure)) {
	        setMyDropof(creep);
	        storage = Game.getObjectById(creep.memory.dropof);
	    }
	    let response = creep.transfer(storage, RESOURCE_ENERGY);
	    if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_OWNER) {
	        creep.travelTo(storage);
	    }
	    else if (response === ERR_FULL) {
	        setMyDropof(creep);
	    }
	}
	function setMyContainer(creep) {
	    if (creep.memory.targetSource === undefined) {
	        getTargetSource(creep);
	    }
	    let container = Game.getObjectById(creep.memory.targetSource).getMiningContainer();
	    if (container === null) {
	        return false;
	    }
	    creep.memory.container = container.id;
	    return true;
	}
	function setMyDropof(creep) {
	    creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.memory.homeroom], creep);
	}
	function setOutdatedTick(creep) {
	    if (creep.memory.outdatedTick !== undefined) {
	        return;
	    }
	    let storage = Game.rooms[creep.memory.homeroom].storage;
	    let container = Game.getObjectById(creep.memory.container);
	    if (storage === undefined) {
	        let spawn = creep.room.getSpawn();
	        if (spawn === undefined) {
	            return;
	        }
	        storage = spawn;
	    }
	    if (storage.pos === undefined || container === null || container.pos === undefined) {
	        return;
	    }
	    let distance = PathfindingUtilities.getDistanseBetween(storage.pos, container.pos);
	    creep.memory.outdatedTick = Math.ceil((distance * 2) * 1.2);
	}
	function checkIfOutdated(creep) {
	    if (creep.memory.outdatedTick === undefined) {
	        return false;
	    }
	    if (creep.memory.outdatedTick > creep.ticksToLive) {
	        creep.suicide();
	        return true;
	    }
	    return false;
	}
	function getTargetRoom(creep) {
	    creep.memory.targetRoom = creep.memory.target.split("-")[0];
	}
	function getTargetSource(creep) {
	    creep.memory.targetSource = creep.memory.target.split("-")[1];
	}
	function getTargetSourcePos(creep, sourceId) {
	    if (Memory.sources[sourceId] !== undefined && Memory.sources[sourceId].containerPos && Memory.sources[sourceId].containerPos.x !== undefined &&
	        Memory.sources[sourceId].containerPos.y !== undefined && Memory.sources[sourceId].containerPos.roomName !== undefined) {
	        creep.memory.targetSourcePos = new RoomPosition(Memory.sources[sourceId].containerPos.x, Memory.sources[sourceId].containerPos.y, Memory.sources[sourceId].containerPos.roomName);
	    }
	}


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const EnergyLib = __webpack_require__(35);
	const PathfindingUtilities = __webpack_require__(3);
	const _Common = __webpack_require__(34);
	var State;
	(function (State) {
	    State[State["Idle"] = 1] = "Idle";
	    State[State["Tanking"] = 2] = "Tanking";
	    State[State["Dumping"] = 3] = "Dumping";
	})(State || (State = {}));
	function run(creep) {
	    if (_Common.moveHomeAndHealIfHurt(creep)) {
	        return;
	    }
	    if (_Common.isCloseToSourceKeeper(creep)) {
	        let dest = _Common.getTravelDestinasion(creep);
	        if (dest !== undefined) {
	            if (_Common.positionIsCloseToSourceKeeper(dest)) {
	                _Common.stayAwayFromSourceKeeper(creep);
	            }
	            else {
	                creep.travelTo({ pos: dest }, { avoidKeepers: true });
	            }
	        }
	        else {
	            _Common.stayAwayFromSourceKeeper(creep);
	        }
	        return;
	    }
	    if (!creep.hasState()) {
	        creep.setState(State.Idle);
	    }
	    switch (creep.getState()) {
	        case State.Idle:
	            runIdle(creep);
	            break;
	        case State.Tanking:
	            runTanking(creep);
	            break;
	        case State.Dumping:
	            runDumping(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.Idle);
	            break;
	    }
	}
	exports.run = run;
	function runIdle(creep) {
	    if (creep.memory.sleepUntil !== undefined && creep.memory.sleepUntil > Game.time) {
	        _Common.moveOffRoad(creep);
	        return;
	    }
	    let target = getSourceIdForEnergyHauler(creep.getHomeroom(), creep);
	    if (target !== undefined) {
	        setSourceInfo(creep, target);
	        creep.setState(State.Tanking);
	    }
	    else {
	        creep.memory.sleepUntil = Game.time + 5;
	    }
	}
	function runTanking(creep) {
	    if (creep.memory.containerPos === undefined || creep.memory.containerPos.roomName === undefined) {
	        console.log("EnergyHauler without Containerpos: " + creep.name);
	        creep.setState(State.Idle);
	        removeSourceInfo(creep);
	        return;
	    }
	    if (_Common.targetRoomHasInvaders(creep, creep.memory.containerPos.roomName)) {
	        return;
	    }
	    let containerPos = new RoomPosition(creep.memory.containerPos.x, creep.memory.containerPos.y, creep.memory.containerPos.roomName);
	    if (containerPos.roomName === creep.pos.roomName) {
	        let container = Game.getObjectById(creep.memory.container);
	        if (container === null) {
	            console.log("Error with containerID for Energyhauler" + creep.room.name);
	            creep.setState(State.Idle);
	            removeSourceInfo(creep);
	            return;
	        }
	        if (creep.pos.getRangeTo(container) > 1) {
	            creep.travelTo({ pos: containerPos });
	        }
	        else {
	            creep.withdraw(container, RESOURCE_ENERGY);
	            creep.setState(State.Dumping);
	            removeSourceInfo(creep);
	        }
	    }
	    else {
	        creep.travelTo({ pos: containerPos });
	    }
	}
	function runDumping(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.setState(State.Idle);
	        runIdle(creep);
	        return;
	    }
	    if (creep.memory.dropof === undefined) {
	        creep.memory.dropof = EnergyLib.getBuildingIdForDump(Game.rooms[creep.getHomeroom()], creep);
	    }
	    let storage = Game.getObjectById(creep.memory.dropof);
	    if (creep.memory.dropof === undefined || storage === null) {
	        console.log("Error with dropof for energyhauler in room " + creep.getHomeroom());
	        creep.memory.dropof = undefined;
	        return;
	    }
	    if (storage.pos.roomName === creep.pos.roomName) {
	        let range = creep.pos.getRangeTo(storage);
	        if (range > 5) {
	            creep.travelTo(storage);
	        }
	        else if (range > 1) {
	            creep.moveTo(storage);
	        }
	        else {
	            creep.transfer(storage, RESOURCE_ENERGY);
	            creep.memory.dropof = undefined;
	        }
	    }
	    else {
	        creep.travelTo(storage);
	    }
	}
	function removeSourceInfo(creep) {
	    creep.memory.container = undefined;
	    creep.memory.containerPos = undefined;
	    creep.memory.target = undefined;
	    creep.memory.dropof = undefined;
	}
	function setSourceInfo(creep, sourceId) {
	    let sourceInfo = Memory.sources[sourceId];
	    creep.memory.container = sourceInfo.container;
	    if (sourceInfo.containerPos === undefined) {
	        console.log("Positioninfo for source missing: " + sourceId);
	        let source = Game.getObjectById(sourceId);
	        if (source instanceof Source) {
	            creep.memory.containerPos = source.getContainerPosition();
	        }
	    }
	    else {
	        creep.memory.containerPos = new RoomPosition(sourceInfo.containerPos.x, sourceInfo.containerPos.y, sourceInfo.containerPos.roomName);
	    }
	    creep.memory.target = sourceId;
	    creep.memory.dropof = undefined;
	}
	function canTravelToSource(creep, sourceId) {
	    let sourceInfo = Memory.sources[sourceId];
	    if (sourceInfo === undefined || sourceInfo.containerPos === undefined || sourceInfo.containerPos.roomName === undefined) {
	        return true;
	    }
	    let pos = new RoomPosition(sourceInfo.containerPos.x, sourceInfo.containerPos.y, sourceInfo.containerPos.roomName);
	    let distance = PathfindingUtilities.getDistanseBetween(creep.pos, pos);
	    if (Math.ceil((distance * 2) * 1.2) > creep.ticksToLive) {
	        return false;
	    }
	    return true;
	}
	function getSourceIdForEnergyHauler(roomName, creep) {
	    if (Game.rooms[roomName] === undefined) {
	        return undefined;
	    }
	    let room = Game.rooms[roomName];
	    if (room.memory.dumpSources === undefined || room.memory.dumpSources.length === 0) {
	        return undefined;
	    }
	    for (let s of room.memory.dumpSources) {
	        if (canTravelToSource(creep, s)) {
	            _.remove(room.memory.dumpSources, (id) => id === s);
	            return s;
	        }
	    }
	    creep.suicide();
	    return undefined;
	}


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const SourceUtilities = __webpack_require__(70);
	const ProfileUtilities = __webpack_require__(19);
	const ScoutingManager = __webpack_require__(48);
	const ContainerMiner = __webpack_require__(122);
	const IntelLib = __webpack_require__(5);
	const Order_1 = __webpack_require__(20);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const _Manager_1 = __webpack_require__(14);
	class MiningManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("MiningManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.ContainerMiner, ContainerMiner.run);
	            this.creepService.runCreeps(role_1.Role.SKMiner, ContainerMiner.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 20 < Game.time) {
	                let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                for (let room of rooms) {
	                    if (!room.isExpansion()) {
	                        this.organizeEnergyMining(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	    }
	    organizeEnergyMining(room) {
	        let roomlevel = RoomRepository.getRoomLevel(room);
	        let lairs = RoomRepository.getLairOutposts(room);
	        if (roomlevel >= roomlevel_1.RoomLevel.City && lairs.length > 0) {
	            for (let outpost of lairs) {
	                if (!RoomRepository.isPortalRoom(outpost) || IntelLib.hasInvaders(outpost)) {
	                    this.orderSKGuard(room, outpost);
	                }
	                if (RoomRepository.isPortalRoom(outpost) && IntelLib.hasInvaders(outpost)) {
	                    this.orderPortalGuard(room, outpost);
	                }
	            }
	        }
	        if ((room.storage !== undefined && _.sum(room.storage.store) > (STORAGE_CAPACITY * 0.95))) {
	            return;
	        }
	        let sources = SourceUtilities.getAllSourcesInRoom(room);
	        if (roomlevel === undefined || roomlevel < roomlevel_1.RoomLevel.DefendedColony) {
	            let sources = room.getSources();
	            let outposts = RoomRepository.getBasicOutposts(room);
	            for (let source of sources) {
	                this.orderPioneers(room, source.id, source.pos, source.getMiningPositions().length);
	            }
	            for (let outpost of outposts) {
	                if (IntelLib.hasIntel(outpost) && !IntelLib.hasDangerousHostiles(outpost)) {
	                    for (let sourceId of IntelLib.sourceIds(outpost)) {
	                        let count = 1;
	                        let source = Game.getObjectById(sourceId);
	                        if (source !== null) {
	                            count = source.getMiningPositions().length;
	                        }
	                        this.orderPioneers(room, sourceId, IntelLib.sourcePos(outpost, sourceId), count);
	                    }
	                }
	            }
	        }
	        else {
	            for (let source of sources) {
	                this.orderContainerMiners(room, source.id, source.room.name);
	                if (roomlevel < roomlevel_1.RoomLevel.City) {
	                    this.orderContainerHaulers(room, source.id, source.room.name, source.pos);
	                }
	            }
	            let outposts = RoomRepository.getBasicOutposts(room);
	            for (let outpost of outposts) {
	                if (!IntelLib.hasInvaders(outpost)) {
	                    for (let sourceId of IntelLib.sourceIds(outpost)) {
	                        this.orderContainerMiners(room, sourceId, outpost);
	                        if (roomlevel < roomlevel_1.RoomLevel.City) {
	                            this.orderContainerHaulers(room, sourceId, outpost, IntelLib.sourcePos(outpost, sourceId));
	                        }
	                    }
	                }
	                if (!IntelLib.hasIntel(outpost)) {
	                    ScoutingManager.orderScouting(room, outpost);
	                }
	            }
	            if (roomlevel >= roomlevel_1.RoomLevel.City && lairs.length > 0) {
	                for (let outpost of lairs) {
	                    if (!IntelLib.hasInvaders(outpost)) {
	                        for (let sourceId of IntelLib.sourceIds(outpost)) {
	                            this.orderContainerMiners(room, sourceId, outpost, true);
	                        }
	                    }
	                }
	            }
	        }
	    }
	    orderPortalGuard(room, targetRoom) {
	        let current = this.creepService.getCreeps(role_1.Role.SKGuard, targetRoom).length;
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.SKGuard, targetRoom);
	        if (current + ordered > 0) {
	            return;
	        }
	        let lairs = RoomRepository.getLairOutposts(room);
	        for (let outpost of lairs) {
	            let guards = this.creepService.getCreeps(role_1.Role.SKGuard, outpost);
	            for (let guard of guards) {
	                if (guard.ticksToLive > 200) {
	                    guard.memory.target = targetRoom;
	                    console.log("SK-guard being reordered to portalroom:" + guard.id);
	                    return;
	                }
	            }
	        }
	        this.orderSKGuard(room, targetRoom);
	    }
	    orderSKGuard(room, targetRoom) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.SKGuard);
	        if (ordered > 0) {
	            return;
	        }
	        let currentCreeps = this.creepService.getCreeps(role_1.Role.SKGuard, targetRoom);
	        let current = currentCreeps.length;
	        if (currentCreeps.length === 1 && (currentCreeps[0].ticksToLive > 300 || currentCreeps[0].ticksToLive === undefined)) {
	            return;
	        }
	        if (current + ordered > 1) {
	            return;
	        }
	        let guardOrder = new Order_1.Order();
	        guardOrder.body = ProfileUtilities.getSKGuardBody();
	        guardOrder.priority = priority_1.Priority.Critical;
	        guardOrder.memory = { role: role_1.Role.SKGuard, target: targetRoom, tier: 1, token: "" + Game.time };
	        let healerOrder = new Order_1.Order();
	        healerOrder.body = ProfileUtilities.getSKHealerBody();
	        healerOrder.priority = priority_1.Priority.Critical;
	        healerOrder.memory = { role: role_1.Role.SKHealer, target: targetRoom, tier: 1, token: "" + Game.time };
	        healerOrder.twinOrder = guardOrder;
	        OrdersRepository.orderCreep(room, healerOrder);
	    }
	    orderPioneers(room, sourceId, sourcePos, miningPositions) {
	        let maxTier = ProfileUtilities.getMaxTierEngineer(room.energyCapacityAvailable);
	        let spawn = room.getSpawn();
	        if (spawn === undefined) {
	            return;
	        }
	        let currentCreeps = this.creepService.getCreeps(role_1.Role.Pioneer, sourceId, room.name).length;
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.Pioneer, sourceId, room.name);
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.Pioneer, sourceId);
	        let wantedTiers = SourceUtilities.getTiersRequiredForPioneerMining(maxTier, miningPositions, spawn.pos, sourcePos);
	        if (orderedTiers === 0 && currentTiers < wantedTiers && currentCreeps < 10) {
	            let order = new Order_1.Order();
	            order.body = ProfileUtilities.getEngineerBody(maxTier);
	            order.priority = priority_1.Priority.Standard;
	            order.memory = { role: role_1.Role.Pioneer, tier: maxTier, target: sourceId };
	            OrdersRepository.orderCreep(room, order);
	        }
	    }
	    orderContainerMiners(room, sourceId, sourceRoom, skroom = false) {
	        let target = sourceRoom + "-" + sourceId;
	        let currentWorkers = this.creepService.getCreeps(role_1.Role.ContainerMiner, target);
	        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.ContainerMiner, target);
	        if (currentWorkers.length > 1) {
	            for (let c of currentWorkers) {
	                c.memory.orderCopyTick = -1;
	            }
	        }
	        if (orderedWorkers + currentWorkers.length > 0) {
	            return;
	        }
	        if (room.controller === undefined || room.controller.level < 1) {
	            console.log("Can not find controller in room: " + room.controller + " - " + room.name);
	            return;
	        }
	        let usedTier = room.controller.level;
	        let order = new Order_1.Order();
	        if (skroom) {
	            order.body = ProfileUtilities.getSkMinerBody(usedTier);
	        }
	        else {
	            order.body = ProfileUtilities.getMinerBody(usedTier);
	        }
	        order.priority = priority_1.Priority.Standard;
	        if (room.name === sourceRoom) {
	            order.priority = priority_1.Priority.Important;
	        }
	        order.memory = { role: role_1.Role.ContainerMiner, target: target, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderContainerHaulers(room, sourceId, sourceRoom, sourcePos) {
	        let target = sourceRoom + "-" + sourceId;
	        let source = Game.getObjectById(sourceId);
	        if (!(source instanceof Source) || !source.hasMiningContainer()) {
	            return;
	        }
	        let currentMinersAtSource = this.creepService.getCreeps(role_1.Role.ContainerMiner, target).length;
	        if (currentMinersAtSource < 1) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);
	        let neededTiers = SourceUtilities.getTiersRequiredForContainerHauling(sourcePos, room, 3000);
	        let usedTier = Math.min(maxTier, neededTiers);
	        let neededHaulers = 1;
	        if (neededTiers > maxTier) {
	            neededHaulers = 2;
	            usedTier = Math.min(maxTier, Math.ceil(neededTiers / 2));
	        }
	        let currentWorkers = this.creepService.getCreeps(role_1.Role.ContainerHauler, target).length;
	        let orderedWorkers = OrdersRepository.getCreepsInQueue(room, role_1.Role.ContainerHauler, target);
	        if (orderedWorkers + currentWorkers >= neededHaulers) {
	            return;
	        }
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getHaulerBody(usedTier);
	        order.priority = priority_1.Priority.Standard;
	        if (currentWorkers > 0) {
	            order.priority = priority_1.Priority.Low;
	        }
	        if (room.name === sourceRoom) {
	            order.priority = priority_1.Priority.Important;
	        }
	        order.memory = { role: role_1.Role.ContainerHauler, target: target, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.MiningManager = MiningManager;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const OrdersRepository = __webpack_require__(18);
	const RoomRepository = __webpack_require__(10);
	const _Common = __webpack_require__(34);
	const Order_1 = __webpack_require__(20);
	const priority_1 = __webpack_require__(17);
	var State;
	(function (State) {
	    State[State["MovingToContainer"] = 1] = "MovingToContainer";
	    State[State["BuildingContainer"] = 2] = "BuildingContainer";
	    State[State["Mining"] = 3] = "Mining";
	})(State || (State = {}));
	function run(creep) {
	    if (_Common.targetRoomHasInvaders(creep, creep.memory.targetRoom)) {
	        if (creep.carry[RESOURCE_ENERGY] > 0) {
	            creep.drop(RESOURCE_ENERGY);
	        }
	        creep.setState(State.MovingToContainer);
	        return;
	    }
	    if (_Common.stayAwayFromSourceKeeper(creep)) {
	        if (creep.carry[RESOURCE_ENERGY] > 0) {
	            creep.drop(RESOURCE_ENERGY);
	        }
	        creep.setState(State.MovingToContainer);
	        return;
	    }
	    if (!creep.hasState()) {
	        creep.setState(State.MovingToContainer);
	    }
	    if (creep.memory.orderCopyTick === undefined) {
	        setOrderCopyTick(creep);
	    }
	    if (creep.memory.orderCopyTick === creep.ticksToLive) {
	        orderMyCopy(creep);
	    }
	    switch (creep.getState()) {
	        case State.MovingToContainer:
	            runMovingToContainer(creep);
	            break;
	        case State.BuildingContainer:
	            runBuildingContainer(creep);
	            break;
	        case State.Mining:
	            runMining(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MovingToContainer);
	            break;
	    }
	}
	exports.run = run;
	function runMovingToContainer(creep) {
	    let targetSource = getTargetSource(creep);
	    if (targetSource === null) {
	        creep.travelToRoom(getTargetRoomname(creep));
	    }
	    else {
	        let containerPos = targetSource.getContainerPosition();
	        if (containerPos !== undefined) {
	            if (creep.room.name === getTargetRoomname(creep) && creep.pos.getRangeTo(containerPos) === 0) {
	                if (targetSource.hasMiningContainer()) {
	                    creep.setState(State.Mining);
	                    return;
	                }
	                else {
	                    creep.setState(State.BuildingContainer);
	                    return;
	                }
	            }
	            creep.travelTo({ pos: containerPos }, { range: 0 });
	        }
	        else {
	            creep.travelTo(targetSource);
	        }
	    }
	}
	function runBuildingContainer(creep) {
	    let container = getContainer(creep);
	    if (container !== null) {
	        creep.setState(State.Mining);
	    }
	    else {
	        let constrSite = getConstructionSite(creep);
	        if (constrSite !== null) {
	            let source = getTargetSource(creep);
	            if (source === null) {
	                console.log("Error with missing source for ContainerMiner: " + creep.room.name);
	                return;
	            }
	            if (creep.carry[RESOURCE_ENERGY] > (creep.carryCapacity / 2)) {
	                creep.build(constrSite);
	            }
	            else {
	                let responseHarvest = creep.harvest(source);
	                if (responseHarvest === OK) {
	                    if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
	                        Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
	                    }
	                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
	                }
	            }
	        }
	    }
	}
	function runMining(creep) {
	    let source = getTargetSource(creep);
	    if (source === null) {
	        console.log("Error with missing source for ContainerMiner: " + creep.room.name);
	        return;
	    }
	    let container = getContainer(creep);
	    if (container === null) {
	        creep.setState(State.BuildingContainer);
	    }
	    else {
	        if (container.hits < 200000 && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
	            creep.repair(container);
	        }
	        else if (source.energy > 0 && container.store[RESOURCE_ENERGY] < container.storeCapacity) {
	            let responseHarvest = creep.harvest(source);
	            if (responseHarvest === OK) {
	                if (Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] === undefined) {
	                    Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] = 0;
	                }
	                Memory.stats['room.' + creep.memory.homeroom + '.energyHarvested'] += creep.getWorkerParts() * 2;
	            }
	        }
	    }
	}
	function getTargetRoomname(creep) {
	    if (creep.memory.targetRoom === undefined) {
	        creep.memory.targetRoom = creep.memory.target.split("-")[0];
	    }
	    return creep.memory.targetRoom;
	}
	function getTargetSource(creep) {
	    if (creep.memory.source === undefined) {
	        creep.memory.source = creep.memory.target.split("-")[1];
	    }
	    return Game.getObjectById(creep.memory.source);
	}
	function getContainer(creep) {
	    if (creep.memory.container !== undefined) {
	        let container = Game.getObjectById(creep.memory.container);
	        if (container === null) {
	            creep.memory.container = undefined;
	        }
	        else {
	            return container;
	        }
	    }
	    let source = getTargetSource(creep);
	    if (source !== null) {
	        let container = source.getMiningContainer();
	        if (container !== null) {
	            creep.memory.container = container.id;
	            return container;
	        }
	    }
	    return null;
	}
	function getConstructionSite(creep) {
	    if (creep.memory.csite !== undefined) {
	        let csite = Game.getObjectById(creep.memory.csite);
	        if (csite === null) {
	            creep.memory.csite = undefined;
	        }
	        else {
	            return csite;
	        }
	    }
	    let source = getTargetSource(creep);
	    if (source !== null) {
	        let csite = source.getMiningContainerConstructionSite();
	        if (csite !== null) {
	            creep.memory.csite = csite.id;
	            return csite;
	        }
	        source.buildMiningContainer();
	    }
	    return null;
	}
	function setOrderCopyTick(creep) {
	    let source = getTargetSource(creep);
	    let spawn = Game.rooms[creep.memory.homeroom].getSpawn();
	    if (source instanceof Source && spawn instanceof StructureSpawn) {
	        creep.memory.orderCopyTick = Math.ceil((PathfindingUtilities.getDistanseBetween(source.pos, spawn.pos)) + (creep.memory.tier * 3) * 1.1);
	    }
	    else {
	        creep.memory.orderCopyTick = -1;
	    }
	}
	function orderMyCopy(creep) {
	    if (Game.rooms[creep.memory.homeroom] === undefined || !RoomRepository.hasOutpost(Game.rooms[creep.memory.homeroom], creep.memory.targetRoom)
	        || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege()) {
	        return;
	    }
	    let order = new Order_1.Order();
	    order.body = _.map(creep.body, (p) => p.type);
	    order.priority = priority_1.Priority.Important;
	    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
	    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
	}


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const RoomLib = __webpack_require__(30);
	const BaseLib = __webpack_require__(82);
	const BuildLib = __webpack_require__(83);
	const StructureLib = __webpack_require__(124);
	const ExtensionLib = __webpack_require__(4);
	const BaseBuilder = __webpack_require__(125);
	const RoomRepository = __webpack_require__(10);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const role_1 = __webpack_require__(16);
	const roomlevel_1 = __webpack_require__(11);
	const priority_1 = __webpack_require__(17);
	const Logger_1 = __webpack_require__(7);
	const _Manager_1 = __webpack_require__(14);
	class BuildManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("BuildManager");
	        this.MEMORY_LASTRUN_DISMANTLE = "lastRunDismantle";
	        this.MEMORY_LASTRUN_BUILD = "lastRunBuild";
	        this.MEMORY_LASTRUN_ORDER = "lastRunOrder";
	        this.MEMORY_TICKLASTINDEX = "tickIndex";
	        this.MEMORY_LASTINDEX = "lastIndex";
	        this.MEMORY_ROOMINDEX = "roomIndex";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            let lastRunDismantle = this.getValue(this.MEMORY_LASTRUN_DISMANTLE);
	            let lastRunOrder = this.getValue(this.MEMORY_LASTRUN_ORDER);
	            let lastRunBuild = this.getValue(this.MEMORY_LASTRUN_BUILD);
	            let tickLastIndex = this.getValue(this.MEMORY_TICKLASTINDEX);
	            if (lastRunDismantle === undefined || lastRunDismantle + 40 < Game.time) {
	                let roomsBeingDismantled = RoomLib.getAllRoomsBeingDismantled();
	                if (roomsBeingDismantled.length > 0) {
	                    for (let room of roomsBeingDismantled) {
	                        StructureLib.removeAllHostileStructures(room);
	                        if (RoomLib.wallsShouldBeRemoved(room)) {
	                            StructureLib.removeAllWalls(room);
	                        }
	                        if (room.memory.isBeingDismantledEverything) {
	                            StructureLib.removeAllFriendlyStructures(room);
	                        }
	                        if (room.memory.isBeingDismantledEverythingExceptEnergy) {
	                            StructureLib.removeAllFriendlyStructures(room, true);
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN_DISMANTLE, Game.time);
	            }
	            else if (lastRunOrder === undefined || lastRunOrder + 40 < Game.time) {
	                let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                if (rooms.length > 0) {
	                    for (let room of rooms) {
	                        if (RoomLib.wallsShouldBeRemoved(room)) {
	                            StructureLib.removeAllWalls(room);
	                            StructureLib.removeAllHostileStructures(room);
	                        }
	                        if (RoomLib.roomShouldHaveBuilders(room)) {
	                            this.orderBaseBuilders(room);
	                        }
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN_ORDER, Game.time);
	            }
	            else if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
	                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
	                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
	            }
	            else if (lastRunBuild === undefined || lastRunBuild + 20 < Game.time) {
	                let roomIndex = this.getValue(this.MEMORY_ROOMINDEX);
	                if (roomIndex === undefined) {
	                    roomIndex = 1;
	                }
	                let room = RoomRepository.getRoomForIndex(roomIndex);
	                if (room !== undefined && RoomRepository.roomShouldBuild(room)) {
	                    placeBuildings(room);
	                }
	                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
	                if (lastIndex === undefined) {
	                    console.log("Error with lastIndex in RoadManager.");
	                    return;
	                }
	                let nextIndex = roomIndex + 1;
	                if (nextIndex > lastIndex) {
	                    nextIndex = 1;
	                }
	                this.setValue(this.MEMORY_ROOMINDEX, nextIndex);
	                this.setValue(this.MEMORY_LASTRUN_BUILD, Game.time);
	            }
	        }
	        else if (pri === _Manager_1.ManagerPriority.Trivial) {
	            if (Game.flags["Ext"] !== undefined) {
	                let flag = Game.flags["Ext"];
	                ExtensionLib.simExtensions(flag.pos);
	            }
	            this.creepService.runCreeps(role_1.Role.BaseBuilder, BaseBuilder.run);
	        }
	    }
	    orderBaseBuilders(room) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseBuilder, room.name);
	        let spawned = this.creepService.getCreeps(role_1.Role.BaseBuilder, room.name).length;
	        if (ordered + spawned > 1) {
	            return;
	        }
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.BaseBuilder, room.name);
	        let spawnedTiers = this.creepService.getNumberOfTiers(role_1.Role.BaseBuilder, room.name);
	        let neededTiers = Math.ceil(BuildLib.getConstructionPointsInRoom(room) / 5000);
	        if (orderedTiers + spawnedTiers >= neededTiers) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierConsultant(room.energyCapacityAvailable);
	        let usedTier = Math.min(maxTier, Math.max(neededTiers, 4));
	        if (room.controller !== undefined && room.controller.level !== undefined && room.controller.level === 8) {
	            usedTier = Math.min(maxTier, Math.max(neededTiers, 8));
	        }
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getConsultantBody(usedTier);
	        order.priority = priority_1.Priority.Standard;
	        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
	            order.priority = priority_1.Priority.Important;
	        }
	        order.memory = { role: role_1.Role.BaseBuilder, target: room.name, tier: usedTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.BuildManager = BuildManager;
	function placeBuildings(room) {
	    let basePosition = RoomRepository.getBasePosition(room);
	    if (!basePosition) {
	        return;
	    }
	    if (room.controller === undefined || room.controller.level < 2) {
	        return;
	    }
	    let level = RoomRepository.getRoomLevel(room);
	    if (level > roomlevel_1.RoomLevel.BasicColonyReadyForExpansion && level < roomlevel_1.RoomLevel.CivilizedColony &&
	        (room.storage === undefined || !room.storage.isActive())) {
	        let baseContainer = getBaseContainer(basePosition, room);
	        if (baseContainer === undefined) {
	            BuildLib.buildIfNotPresent(STRUCTURE_CONTAINER, basePosition, 0, 2, true, false);
	        }
	    }
	    if (room.storage !== undefined && room.storage.isActive()) {
	        let baseContainer = getBaseContainer(basePosition, room);
	        if (baseContainer !== undefined) {
	            baseContainer.destroy();
	        }
	    }
	    let spawn = room.getSpawn();
	    let ramparts = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART });
	    if (spawn === undefined && ramparts.length === 0 && room.controller !== undefined && room.controller.safeMode === undefined) {
	        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getSpawnPositions(), 1);
	    }
	    else {
	        buildIfPossible(room, basePosition, STRUCTURE_SPAWN, BaseLib.getSpawnPositions(), BaseLib.getPossibleSpawnCount(room));
	    }
	    if (spawn === undefined) {
	        return;
	    }
	    buildIfPossible(room, basePosition, STRUCTURE_TOWER, BaseLib.getTowerPositions(), BaseLib.getPossibleTowerCount(room));
	    ExtensionLib.destroyExtensionsNotCorrectlyPlaced(room, basePosition);
	    let extensions = ExtensionLib.getExtensionPositions(room, basePosition);
	    buildIfPossibleRoomPosition(room, STRUCTURE_EXTENSION, extensions, BaseLib.getPossibleExtensionsCount(room));
	    if (level >= roomlevel_1.RoomLevel.DefendedColonyReadyForExpansion) {
	        BuildLib.buildIfNotPresent(STRUCTURE_STORAGE, basePosition, 0, 3, false, false);
	    }
	    if (level >= roomlevel_1.RoomLevel.SimpleColonyReadyForExpansion) {
	        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getColonyRoadPositions());
	        buildIfPossibleRoomPosition(room, STRUCTURE_ROAD, ExtensionLib.getRoadPositions(room, basePosition));
	    }
	    if (level >= roomlevel_1.RoomLevel.CivilizedColony) {
	        buildIfPossible(room, basePosition, STRUCTURE_ROAD, BaseLib.getCityRoadPositions());
	    }
	    if (level >= roomlevel_1.RoomLevel.CivilizedColonyReadyForExpansion) {
	        BuildLib.buildIfNotPresent(STRUCTURE_LINK, basePosition, -1, 4, false, true);
	    }
	    if (level < roomlevel_1.RoomLevel.Town && level >= roomlevel_1.RoomLevel.SimpleColony) {
	        buildIfPossible(room, null, STRUCTURE_RAMPART, BaseLib.getImportantBuildingPositions(room), undefined, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.Town) {
	        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getFortressWallPositions(), undefined, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.Metropolis) {
	        buildIfPossible(room, basePosition, STRUCTURE_RAMPART, BaseLib.getShellWallPositions(), undefined, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.AdvancedColonyReadyForExpansion) {
	        BuildLib.buildIfNotPresent(STRUCTURE_TERMINAL, basePosition, 2, 2, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 4, false, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.Town) {
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 5, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 6, false, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.City) {
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 5, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 5, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 6, false, true);
	    }
	    if (level >= roomlevel_1.RoomLevel.Metropolis) {
	        BuildLib.buildIfNotPresent(STRUCTURE_POWER_SPAWN, basePosition, -2, 2, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_NUKER, basePosition, -2, 5, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_OBSERVER, basePosition, -2, 6, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 2, 6, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, -1, 7, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 0, 7, false, true);
	        BuildLib.buildIfNotPresent(STRUCTURE_LAB, basePosition, 1, 7, false, true);
	    }
	}
	exports.placeBuildings = placeBuildings;
	function buildIfPossible(room, spawnpos, structureType, positions, possible = undefined, keepRoad = false) {
	    let needed = 100;
	    if (spawnpos === null) {
	        spawnpos = new RoomPosition(0, 0, room.name);
	    }
	    if (possible !== undefined) {
	        let current = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; } }).length;
	        let ordered = room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; } }).length;
	        if (possible <= current + ordered) {
	            return;
	        }
	        needed = possible - current - ordered;
	        Logger_1.log.info("Building: " + needed + " " + structureType, room.name);
	    }
	    let positionCounter = 0;
	    while (needed > 0 && positionCounter < positions.length) {
	        if (BuildLib.buildIfNotPresent(structureType, spawnpos, positions[positionCounter][0], positions[positionCounter][1], keepRoad)) {
	            needed--;
	        }
	        positionCounter++;
	    }
	}
	function buildIfPossibleRoomPosition(room, structureType, positions, possible = undefined, keepRoad = false) {
	    let needed = 100;
	    if (possible !== undefined) {
	        let current = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; } }).length;
	        let ordered = room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; } }).length;
	        if (possible <= current + ordered) {
	            return;
	        }
	        needed = possible - current - ordered;
	        Logger_1.log.info("Building: " + needed + " " + structureType, room.name);
	    }
	    let positionCounter = 0;
	    let nullPosition = new RoomPosition(0, 0, room.name);
	    while (needed > 0 && positionCounter < positions.length) {
	        if (BuildLib.buildIfNotPresent(structureType, nullPosition, positions[positionCounter].x, positions[positionCounter].y, keepRoad)) {
	            needed--;
	        }
	        positionCounter++;
	    }
	}
	function getBaseContainer(basePos, room) {
	    let containerPos = new RoomPosition(basePos.x, basePos.y + 2, basePos.roomName);
	    if (containerPos !== undefined) {
	        let structures = containerPos.lookFor(LOOK_STRUCTURES);
	        for (let structure of structures) {
	            if (structure instanceof StructureContainer) {
	                room.memory["roomContainer"] = structure.id;
	                return structure;
	            }
	        }
	    }
	}


/***/ }),
/* 124 */
/***/ (function(module, exports) {

	"use strict";
	function removeAllWalls(room) {
	    let walls = room.find(FIND_STRUCTURES, { filter: function (x) { return x.structureType === STRUCTURE_WALL; } });
	    for (let wall of walls) {
	        wall.destroy();
	    }
	    room.memory.removeWalls = undefined;
	}
	exports.removeAllWalls = removeAllWalls;
	function removeAllHostileStructures(room) {
	    let structures = room.find(FIND_HOSTILE_STRUCTURES);
	    for (let s of structures) {
	        if (!(s.structureType === STRUCTURE_TERMINAL && s.store[RESOURCE_ENERGY] > 5000) &&
	            !(s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 5000)) {
	            s.destroy();
	        }
	    }
	    let constSites = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
	    for (let s of constSites) {
	        s.remove();
	    }
	}
	exports.removeAllHostileStructures = removeAllHostileStructures;
	function removeAllFriendlyStructures(room, saveEnergyBuildings = false) {
	    let structures = room.find(FIND_MY_STRUCTURES);
	    if (saveEnergyBuildings === true) {
	        structures = _.filter(structures, (s) => s.structureType !== STRUCTURE_TERMINAL && s.structureType !== STRUCTURE_STORAGE);
	    }
	    for (let s of structures) {
	        s.destroy();
	    }
	    let constSites = room.find(FIND_MY_CONSTRUCTION_SITES);
	    for (let s of constSites) {
	        s.remove();
	    }
	}
	exports.removeAllFriendlyStructures = removeAllFriendlyStructures;
	function getVitalBuildings(room) {
	    return room.find(FIND_MY_STRUCTURES, { filter: function (s) {
	            return s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER ||
	                s.structureType === STRUCTURE_TERMINAL || s.structureType === STRUCTURE_STORAGE ||
	                s.structureType === STRUCTURE_NUKER || s.structureType === STRUCTURE_POWER_SPAWN;
	        } });
	}
	exports.getVitalBuildings = getVitalBuildings;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Logger_1 = __webpack_require__(7);
	const roomlevel_1 = __webpack_require__(11);
	const _Common = __webpack_require__(34);
	const RoomRepository = __webpack_require__(10);
	const EnergyLib = __webpack_require__(35);
	const PositionLib = __webpack_require__(46);
	var State;
	(function (State) {
	    State[State["Waiting"] = 1] = "Waiting";
	    State[State["Constructing"] = 2] = "Constructing";
	    State[State["Fortify"] = 3] = "Fortify";
	    State[State["Tanking"] = 4] = "Tanking";
	    State[State["RepairWall"] = 5] = "RepairWall";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.Waiting);
	    }
	    switch (creep.getState()) {
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.Constructing:
	            runConstructing(creep);
	            break;
	        case State.Fortify:
	            runFortify(creep);
	            break;
	        case State.RepairWall:
	            runRepairWall(creep);
	            break;
	        case State.Tanking:
	            runTanking(creep);
	            break;
	        default:
	            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
	            creep.setState(State.Waiting);
	            break;
	    }
	}
	exports.run = run;
	function runWaiting(creep) {
	    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
	        creep.memory.sleep--;
	        _Common.moveOffRoad(creep);
	        return;
	    }
	    if (creep.carry[RESOURCE_ENERGY] < (creep.carryCapacity / 2)) {
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    let currentConstructionSite = Game.getObjectById(creep.memory.targetSite);
	    if (currentConstructionSite instanceof ConstructionSite) {
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    let targetConstructionSite = findNewTargetConstructionSite(creep);
	    if (targetConstructionSite !== null) {
	        creep.setState(State.Constructing);
	        runConstructing(creep);
	        return;
	    }
	    let targetWallSite = findNewTargetWallSite(creep);
	    if (targetWallSite !== null) {
	        creep.setState(State.Fortify);
	        runFortify(creep);
	        return;
	    }
	    if (!creep.isFull()) {
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    creep.memory.sleep = 15;
	    _Common.moveOffRoad(creep);
	}
	function runConstructing(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    let targetSite = Game.getObjectById(creep.memory.targetSite);
	    if (!(targetSite instanceof ConstructionSite)) {
	        targetSite = findNewTargetConstructionSite(creep);
	    }
	    if (targetSite === null) {
	        creep.setState(State.Waiting);
	        return;
	    }
	    let response = creep.build(targetSite);
	    if (response === ERR_NOT_IN_RANGE) {
	        creep.travelTo(targetSite);
	    }
	    else if (response === OK) {
	        if (targetSite.structureType === STRUCTURE_RAMPART || targetSite.structureType === STRUCTURE_WALL) {
	            creep.memory.wallPos = targetSite.pos;
	            creep.memory.targetSite = undefined;
	            creep.setState(State.RepairWall);
	        }
	    }
	}
	function runFortify(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.memory.targetSite = undefined;
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    let targetSite = Game.getObjectById(creep.memory.targetSite);
	    if (!(targetSite instanceof Structure)) {
	        targetSite = findNewTargetWallSite(creep);
	    }
	    if (targetSite === null) {
	        creep.memory.targetSite = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    let range = creep.pos.getRangeTo(targetSite);
	    if (range > 0 && range < 4 && !PositionLib.positionIsBorder(creep.pos)) {
	        creep.repair(targetSite);
	        if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
	            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
	        }
	        Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
	    }
	    else {
	        creep.travelTo(targetSite);
	    }
	    if (targetSite.hits === targetSite.hitsMax) {
	        creep.memory.targetSite = undefined;
	        creep.setState(State.Waiting);
	    }
	}
	function runRepairWall(creep) {
	    if (creep.carry[RESOURCE_ENERGY] === 0) {
	        creep.memory.targetSite = undefined;
	        creep.memory.rampartPos = undefined;
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    let targetSite = Game.getObjectById(creep.memory.targetSite);
	    if (targetSite === null) {
	        targetSite = findWallJustBuilt(creep);
	    }
	    if (targetSite === null) {
	        creep.memory.targetSite = undefined;
	        creep.memory.rampartPos = undefined;
	        creep.setState(State.Waiting);
	        return;
	    }
	    creep.memory.targetSite = targetSite.id;
	    let response = creep.repair(targetSite);
	    if (response === OK) {
	        if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
	            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
	        }
	        Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
	    }
	    else if (response === ERR_NOT_IN_RANGE) {
	        creep.travelTo(targetSite);
	    }
	    if (targetSite.hits === targetSite.hitsMax) {
	        creep.memory.targetSite = undefined;
	        creep.setState(State.Waiting);
	    }
	}
	function runTanking(creep) {
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    let storage = homeroom.storage;
	    if (storage === undefined) {
	        let buildingId = EnergyLib.getBuildingIdForTanking(creep.room);
	        storage = Game.getObjectById(buildingId);
	        if (storage === null) {
	            console.log("BaseBuilder without energy pickup " + homeroom.name);
	            return;
	        }
	    }
	    if (shouldTank(creep, storage)) {
	        if (creep.pos.getRangeTo(storage) === 1) {
	            creep.withdraw(storage, RESOURCE_ENERGY);
	            creep.setState(State.Waiting);
	        }
	        else {
	            creep.travelTo(storage);
	        }
	    }
	    else {
	        _Common.moveOffRoad(creep);
	    }
	}
	function findWallJustBuilt(creep) {
	    if (creep.memory.wallPos === undefined || creep.memory.wallPos.x === undefined) {
	        return null;
	    }
	    let pos = new RoomPosition(creep.memory.wallPos.x, creep.memory.wallPos.y, creep.memory.wallPos.roomName);
	    let atPos = pos.lookFor(LOOK_STRUCTURES);
	    for (let s of atPos) {
	        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
	            return s;
	        }
	    }
	    return null;
	}
	function findNewTargetConstructionSite(creep) {
	    let closestSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
	    if (closestSite === undefined || closestSite === null) {
	        let enemySitesNeedingBuilding = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_EXTRACTOR });
	        if (enemySitesNeedingBuilding.length > 0 && creep.room.controller !== undefined && creep.room.controller.level > 5 && creep.room.controller.my) {
	            creep.memory.targetSite = enemySitesNeedingBuilding[0].id;
	            return enemySitesNeedingBuilding[0];
	        }
	        creep.memory.targetSite = undefined;
	        return null;
	    }
	    creep.memory.targetSite = closestSite.id;
	    return closestSite;
	}
	function findNewTargetWallSite(creep) {
	    let walls = creep.room.find(FIND_STRUCTURES, { filter: function (s) {
	            return (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL);
	        } });
	    if (walls.length === 0) {
	        creep.memory.targetSite = undefined;
	        return null;
	    }
	    let minHpFound = RAMPART_HITS_MAX[8];
	    let target = null;
	    for (let w of walls) {
	        if (w.hits < minHpFound) {
	            minHpFound = w.hits;
	            target = w;
	        }
	    }
	    if (target === null) {
	        return null;
	    }
	    creep.memory.targetSite = target.id;
	    return target;
	}
	function shouldTank(creep, storage) {
	    if (storage !== undefined && storage.structureType !== STRUCTURE_STORAGE) {
	        return true;
	    }
	    if (storage.store[RESOURCE_ENERGY] > 20000 ||
	        (storage.store[RESOURCE_ENERGY] > 5000 && RoomRepository.getRoomLevel(creep.room) < roomlevel_1.RoomLevel.Metropolis)) {
	        return true;
	    }
	    return false;
	}


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const OrdersRepository = __webpack_require__(18);
	const ProfileUtilities = __webpack_require__(19);
	const Order_1 = __webpack_require__(20);
	const RoomLib = __webpack_require__(30);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const Janitor = __webpack_require__(127);
	class MaintainenceManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("MaintainenceManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.Janitor, Janitor.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
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
	    orderJanitor(room) {
	        let ordered = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.Janitor, room.name);
	        let spawned = this.creepService.getNumberOfTiers(role_1.Role.Janitor, room.name);
	        if (ordered + spawned > 0) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierDistanceWorker(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getDistanceWorkerBody(maxTier);
	        order.priority = priority_1.Priority.Important;
	        order.memory = { role: role_1.Role.Janitor, target: room.name, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	}
	exports.MaintainenceManager = MaintainenceManager;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Common = __webpack_require__(34);
	const EnergyLib = __webpack_require__(35);
	const PositionLib = __webpack_require__(46);
	const PrayerLib = __webpack_require__(95);
	const RoomRepository = __webpack_require__(10);
	var State;
	(function (State) {
	    State[State["Sleeping"] = 1] = "Sleeping";
	    State[State["Tanking"] = 2] = "Tanking";
	    State[State["Repairing"] = 3] = "Repairing";
	    State[State["Building"] = 4] = "Building";
	})(State || (State = {}));
	function run(creep) {
	    if (_Common.isCloseToSourceKeeper(creep)) {
	        let dest = _Common.getTravelDestinasion(creep);
	        if (dest !== undefined) {
	            if (_Common.positionIsCloseToSourceKeeper(dest)) {
	                _Common.stayAwayFromSourceKeeper(creep);
	            }
	            else {
	                creep.travelTo({ pos: dest }, { avoidKeepers: true });
	            }
	        }
	        else {
	            _Common.stayAwayFromSourceKeeper(creep);
	        }
	        return;
	    }
	    if (_Common.moveHomeAndHealIfHurt(creep)) {
	        return;
	    }
	    if (!creep.hasState()) {
	        creep.setState(State.Tanking);
	    }
	    switch (creep.getState()) {
	        case State.Sleeping:
	            runSleeping(creep);
	            break;
	        case State.Tanking:
	            runTanking(creep);
	            break;
	        case State.Building:
	            runBuilding(creep);
	            break;
	        case State.Repairing:
	            runRepairing(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.Sleeping);
	            break;
	    }
	}
	exports.run = run;
	;
	function runSleeping(creep) {
	    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
	        creep.memory.sleep--;
	        _Common.moveOffRoad(creep);
	        return;
	    }
	    let targetConstructionSite = findNewConstructionSite(creep);
	    if (targetConstructionSite !== undefined) {
	        creep.setState(State.Building);
	        runBuilding(creep);
	        return;
	    }
	    let targetRepairSite = findNewRepairSite(creep);
	    if (targetRepairSite !== null) {
	        creep.setState(State.Repairing);
	        runRepairing(creep);
	        return;
	    }
	    if (!creep.isFull()) {
	        creep.setState(State.Tanking);
	        runTanking(creep);
	        return;
	    }
	    creep.memory.sleep = 50;
	    _Common.moveOffRoad(creep);
	}
	function runTanking(creep) {
	    if (creep.isEmpty() && creep.ticksToLive < 50) {
	        creep.suicide();
	        return;
	    }
	    if (creep.isFull()) {
	        creep.setState(State.Sleeping);
	        runSleeping(creep);
	        return;
	    }
	    let tankingPlace = getTankingPlace(creep);
	    if (tankingPlace === undefined) {
	        creep.setState(State.Sleeping);
	        return;
	    }
	    if (tankingPlace instanceof Resource) {
	        if (creep.pickup(tankingPlace) === ERR_NOT_IN_RANGE) {
	            creep.travelTo(tankingPlace);
	        }
	    }
	    else if (creep.withdraw(tankingPlace, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
	        creep.travelTo(tankingPlace);
	    }
	}
	function runRepairing(creep) {
	    if (creep.isEmpty()) {
	        creep.setState(State.Tanking);
	        setNewTankingPlace(creep);
	        runTanking(creep);
	        return;
	    }
	    let targetSite = Game.getObjectById(creep.memory.targetSite);
	    if (targetSite !== null) {
	        if (_Common.targetRoomHasInvaders(creep, targetSite.room.name)) {
	            return;
	        }
	    }
	    if (targetSite === null || targetSite.hits === targetSite.hitsMax) {
	        creep.memory.targetSite = undefined;
	        targetSite = findNewRepairSite(creep);
	    }
	    if (targetSite instanceof Structure) {
	        if (creep.pos.roomName !== targetSite.pos.roomName || PositionLib.positionIsBorder(creep.pos) || creep.pos.getRangeTo(targetSite) > 3) {
	            repairRoadsCloseby(creep);
	            creep.travelTo(targetSite, { range: 0 });
	        }
	        else {
	            creep.repair(targetSite);
	        }
	    }
	    if (targetSite === null) {
	        creep.setState(State.Sleeping);
	    }
	}
	function runBuilding(creep) {
	    if (creep.isEmpty()) {
	        creep.setState(State.Tanking);
	        setNewTankingPlace(creep);
	        runTanking(creep);
	        return;
	    }
	    let targetSite = Game.getObjectById(creep.memory.targetSite);
	    if (targetSite === null) {
	        targetSite = findNewConstructionSite(creep);
	    }
	    if (targetSite !== null && targetSite !== undefined && targetSite.room !== undefined) {
	        if (_Common.targetRoomHasInvaders(creep, targetSite.room.name)) {
	            return;
	        }
	    }
	    if (targetSite instanceof ConstructionSite) {
	        if (creep.pos.roomName !== targetSite.pos.roomName || PositionLib.positionIsBorder(creep.pos) || creep.pos.getRangeTo(targetSite) > 3) {
	            repairRoadsCloseby(creep);
	            creep.travelTo(targetSite, { range: 0 });
	        }
	        else {
	            creep.build(targetSite);
	        }
	    }
	    else {
	        creep.memory.targetSite = undefined;
	        creep.setState(State.Sleeping);
	    }
	}
	function getTankingPlace(creep) {
	    let tankingPlace = Game.getObjectById(creep.memory.tankingId);
	    if (tankingPlace === null) {
	        setNewTankingPlace(creep);
	        tankingPlace = Game.getObjectById(creep.memory.tankingId);
	    }
	    if (tankingPlace !== null) {
	        if (tankingPlace instanceof Resource && tankingPlace.resourceType === RESOURCE_ENERGY && tankingPlace.amount > 100) {
	            return tankingPlace;
	        }
	        else if (tankingPlace instanceof Structure && tankingPlace.store[RESOURCE_ENERGY] > 100) {
	            return tankingPlace;
	        }
	    }
	    creep.memory.tankingId = undefined;
	    return undefined;
	}
	function setNewTankingPlace(creep) {
	    if (creep.isInHomeroom()) {
	        let building = Game.getObjectById(EnergyLib.getBuildingIdForTanking(creep.room));
	        creep.memory.tankingId = building.id;
	        return;
	    }
	    if (creep.room.memory.isPraiseRoom && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 1000) {
	        creep.memory.tankingId = creep.room.terminal.id;
	        return;
	    }
	    let drops = creep.room.find(FIND_DROPPED_RESOURCES, { filter: (r) => r.amount > 200 && r.resourceType === RESOURCE_ENERGY });
	    if (drops.length > 0) {
	        let closest = creep.pos.findClosestByRange(drops);
	        creep.memory.tankingId = closest.id;
	        return;
	    }
	    let containers = creep.room.find(FIND_STRUCTURES, { filter: (r) => r.structureType === STRUCTURE_CONTAINER && r.store[RESOURCE_ENERGY] > 200 });
	    if (containers.length > 0) {
	        let closest = creep.pos.findClosestByRange(containers);
	        creep.memory.tankingId = closest.id;
	        return;
	    }
	    let building = Game.getObjectById(EnergyLib.getBuildingIdForTanking(Game.rooms[creep.getHomeroom()]));
	    if (building !== null) {
	        creep.memory.tankingId = building.id;
	    }
	    else {
	        console.log("No tankingbuilding found for janitor: " + creep.room);
	    }
	}
	function repairRoadsCloseby(creep) {
	    let roadOnTile = creep.pos.lookFor(LOOK_STRUCTURES);
	    for (let s of roadOnTile) {
	        if (s.structureType === STRUCTURE_ROAD && s.hitsMax - s.hits > 500) {
	            creep.repair(s);
	        }
	    }
	}
	function findNewConstructionSite(creep) {
	    if (creep.memory.homeroom !== undefined && Game.rooms[creep.memory.homeroom] !== null && Game.rooms[creep.memory.homeroom] !== undefined) {
	        let outposts = RoomRepository.getBasicOutposts(Game.rooms[creep.memory.homeroom]);
	        for (let outpost of outposts.concat(Game.rooms[creep.memory.homeroom].memory.praiseroom)) {
	            if (Game.rooms[outpost] instanceof Room) {
	                let constructionSitesInRoom = Game.rooms[outpost].find(FIND_MY_CONSTRUCTION_SITES);
	                if (constructionSitesInRoom.length > 0) {
	                    let site = constructionSitesInRoom[0];
	                    if (creep.pos.roomName === outpost) {
	                        site = creep.pos.findClosestByRange(constructionSitesInRoom);
	                    }
	                    creep.memory.targetSite = site.id;
	                    return site;
	                }
	            }
	        }
	    }
	    if (creep.memory.homeroom !== undefined && Game.rooms[creep.memory.homeroom] !== null && Game.rooms[creep.memory.homeroom] !== undefined) {
	        let lairs = RoomRepository.getLairOutposts(Game.rooms[creep.memory.homeroom]);
	        for (let outpost of lairs) {
	            if (Game.rooms[outpost] instanceof Room) {
	                let constructionSitesInRoom = Game.rooms[outpost].find(FIND_MY_CONSTRUCTION_SITES);
	                if (constructionSitesInRoom.length > 0) {
	                    let site = constructionSitesInRoom[0];
	                    if (creep.pos.roomName === outpost) {
	                        site = creep.pos.findClosestByRange(constructionSitesInRoom);
	                    }
	                    creep.memory.targetSite = site.id;
	                    return site;
	                }
	            }
	        }
	    }
	}
	function findNewRepairSite(creep) {
	    let homeroom = Game.rooms[creep.memory.homeroom];
	    if (creep.memory.homeroom === undefined || homeroom === undefined) {
	        return null;
	    }
	    let structure = getMostDamagedStructure(homeroom);
	    if (structure !== undefined) {
	        creep.memory.targetSite = structure.id;
	        return structure;
	    }
	    creep.memory.targetSite = undefined;
	    return null;
	}
	function getMostDamagedStructure(room) {
	    let prayerroomcontainers = getDamagedPrayerroomContainers(room);
	    if (prayerroomcontainers.length > 0) {
	        return prayerroomcontainers[0];
	    }
	    let homeroomcontainers = getDamagedHomeroomContainers(room);
	    if (homeroomcontainers.length > 0) {
	        return homeroomcontainers[0];
	    }
	    let skroomcontainers = getDamagedSKRoomMineralContainers(room);
	    if (skroomcontainers.length > 0) {
	        return skroomcontainers[0];
	    }
	    let outpostRoads = room.memory.roads;
	    if (outpostRoads === undefined || _.isNull(outpostRoads)) {
	        return undefined;
	    }
	    let mostInNeed = undefined;
	    for (let roadId of outpostRoads) {
	        let road = Game.getObjectById(roadId);
	        if (road instanceof StructureRoad) {
	            if (road.hitsMax - road.hits > 3000) {
	                if (mostInNeed === undefined) {
	                    mostInNeed = road;
	                }
	                else if (mostInNeed.hitsMax - mostInNeed.hits < road.hitsMax - road.hits) {
	                    mostInNeed = road;
	                }
	            }
	        }
	    }
	    return mostInNeed;
	}
	function getDamagedPrayerroomContainers(room) {
	    if (room.memory.praiseroom === undefined) {
	        return [];
	    }
	    let praiseroom = Game.rooms[room.memory.praiseroom];
	    if (praiseroom === undefined) {
	        return [];
	    }
	    let spawn1 = room.getSpawn();
	    if (spawn1 !== undefined && praiseroom.memory.doublepraiser === true) {
	        let container = PrayerLib.getSupplyContainer(praiseroom, spawn1.pos);
	        if (container !== undefined && container.hitsMax - container.hits > 100000) {
	            return [container];
	        }
	    }
	    return [];
	}
	function getDamagedHomeroomContainers(room) {
	    let containers = [];
	    let basecontainer = room.getBaseContainer();
	    if (basecontainer !== undefined && basecontainer.hitsMax - basecontainer.hits > 100000) {
	        containers.push(basecontainer);
	    }
	    let mineral = room.getMineral();
	    if (mineral !== undefined) {
	        let mineralcontainer = mineral.getMiningContainer();
	        if (mineralcontainer !== null && mineralcontainer.hitsMax - mineralcontainer.hits > 100000) {
	            containers.push(mineralcontainer);
	        }
	    }
	    let controller = room.controller;
	    if (controller !== undefined) {
	        let controllerContainer = controller.getContainer();
	        if (controllerContainer !== undefined && controllerContainer.hitsMax - controllerContainer.hits > 100000) {
	            containers.push(controllerContainer);
	        }
	    }
	    return containers;
	}
	function getDamagedSKRoomMineralContainers(room) {
	    let containers = [];
	    let lairs = RoomRepository.getLairOutposts(room);
	    if (!room.memory.praiseroomHibernated) {
	        lairs = lairs.concat(room.memory.praiseroom);
	    }
	    for (let outpost of lairs.concat(room.memory.praiseroom)) {
	        if (Game.rooms[outpost] instanceof Room) {
	            let m = Game.rooms[outpost].getMineral();
	            if (m !== undefined && m.ticksToRegeneration === undefined) {
	                let c = m.getMiningContainer();
	                if (c !== null && c.hitsMax - c.hits > 100000) {
	                    containers.push(c);
	                }
	            }
	        }
	    }
	    return containers;
	}


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathFindingUtilities = __webpack_require__(3);
	const RoomRepository = __webpack_require__(10);
	const IntelLib = __webpack_require__(5);
	const BaseLib = __webpack_require__(82);
	const ExtensionLib = __webpack_require__(4);
	const _Manager_1 = __webpack_require__(14);
	class RoadInfo {
	}
	class RoadManager extends _Manager_1.Manager {
	    constructor(roomService) {
	        super("RoadManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.MEMORY_TICKLASTINDEX = "tickIndex";
	        this.MEMORY_LASTRUN_EXTENSIONROADS = "tickExtRoads";
	        this.MEMORY_INDEX_EXTENSIONROADS = "indexExtRoads";
	        this.MEMORY_LASTINDEX = "lastIndex";
	        this.MEMORY_LOADEDINDEX = "loadedIndex";
	        this.MEMORY_SEGMENTTOLOAD = "segLoad";
	        this.roomService = roomService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Low) {
	            let tickLastIndex = this.getValue(this.MEMORY_TICKLASTINDEX);
	            if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
	                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
	                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
	            }
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 20 < Game.time) {
	                let roadinfo = this.updateRoadSegmentForLoadedRoom();
	                if (roadinfo !== undefined) {
	                    this.saveRoadsNeedingRepairingToMemory(roadinfo);
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	            this.requestSegmentForNextTick();
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let tickLastExtensionRoads = this.getValue(this.MEMORY_LASTRUN_EXTENSIONROADS);
	            if (tickLastExtensionRoads === undefined || tickLastExtensionRoads + 100 < Game.time) {
	                let roomIndex = this.getValue(this.MEMORY_INDEX_EXTENSIONROADS);
	                if (roomIndex === undefined) {
	                    roomIndex = 1;
	                }
	                let roomDone = true;
	                let room = RoomRepository.getRoomForIndex(roomIndex);
	                if (room !== undefined && RoomRepository.roomShouldBuild(room)) {
	                    roomDone = !buildRoadsToExtensions(room);
	                }
	                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
	                if (lastIndex === undefined) {
	                    console.log("Error with lastIndex in RoadManager.");
	                    return;
	                }
	                if (roomDone) {
	                    let nextIndex = roomIndex + 1;
	                    if (nextIndex > lastIndex) {
	                        nextIndex = 1;
	                    }
	                    this.setValue(this.MEMORY_INDEX_EXTENSIONROADS, nextIndex);
	                }
	                this.setValue(this.MEMORY_LASTRUN_EXTENSIONROADS, Game.time);
	            }
	        }
	    }
	    updateRoadSegmentForLoadedRoom() {
	        let usedCpu = Game.cpu.getUsed();
	        let segmentToLoad = this.getValue(this.MEMORY_SEGMENTTOLOAD);
	        if (segmentToLoad === undefined) {
	            this.setValue(this.MEMORY_SEGMENTTOLOAD, 51);
	            segmentToLoad = 51;
	        }
	        let roadInfo = this.loadRoadInfoFromSegment(segmentToLoad);
	        let room = RoomRepository.getRoomForIndex(segmentToLoad - 50);
	        let processingFinishedForRoom = true;
	        if (roadInfo !== undefined && room !== undefined && room.controller !== undefined && room.controller.my &&
	            (room.controller.level > 2 || (room.controller.level === 2 && room.controller.progress > room.controller.progressTotal * 0.5)) &&
	            (room.storage !== undefined || room.getBaseContainer() !== undefined)) {
	            if (room.name !== roadInfo.roomName) {
	                roadInfo.roomName = room.name;
	                roadInfo.roads = {};
	            }
	            let targetsForRoom = this.getRoadTargetIds(room);
	            for (let id of targetsForRoom) {
	                let target = Game.getObjectById(id);
	                if (target !== null && target.pos !== undefined && target.pos instanceof RoomPosition) {
	                    if (roadInfo.roads[id] === undefined || roadInfo.roads[id].timePositions + 5000 < Game.time) {
	                        if (roadInfo.roads[id] === undefined) {
	                            roadInfo.roads[id] = {
	                                timePositions: Game.time,
	                                timeBuilt: 0,
	                                positions: getRoadsTo(room, this.getRoadTargetFor(target))
	                            };
	                        }
	                        else {
	                            roadInfo.roads[id].timePositions = Game.time;
	                            roadInfo.roads[id].positions = getRoadsTo(room, this.getRoadTargetFor(target));
	                        }
	                    }
	                }
	                if (Game.cpu.getUsed() > usedCpu + 40) {
	                    processingFinishedForRoom = false;
	                    break;
	                }
	            }
	            for (let id of Object.keys(roadInfo.roads)) {
	                if (roadInfo.roads[id].timePositions + 20000 < Game.time) {
	                    delete roadInfo.roads[id];
	                    console.log("Deleting target for road no longer valid: " + id + " for room " + roadInfo.roomName);
	                    continue;
	                }
	                if (room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 || roadConstructionLimitReached() ||
	                    (room.storage === undefined && room.getBaseContainer() === undefined) ||
	                    (room.storage !== undefined && !room.storage.isActive()) ||
	                    (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 30000)) {
	                    break;
	                }
	                if (roadInfo.roads[id].timeBuilt === undefined || roadInfo.roads[id].timeBuilt + 5000 < Game.time) {
	                    roadInfo.roads[id].timeBuilt = Game.time;
	                    let startPos = RoomRepository.getBasePosition(room);
	                    let target = Game.getObjectById(id);
	                    if (startPos !== undefined && target !== null) {
	                        if (room.storage !== undefined) {
	                            startPos = room.storage.pos;
	                        }
	                        buildRoadBetween(startPos, this.getRoadTargetFor(target), false, false, RoomRepository.isMiddleRoom(target.room.name));
	                    }
	                }
	                if (Game.cpu.getUsed() > usedCpu + 80) {
	                    break;
	                }
	            }
	        }
	        if (roadInfo !== undefined) {
	            Memory.stats['roads.' + roadInfo.roomName + '.total'] = _.sum(roadInfo.roads, (i) => i.positions.length);
	            RawMemory.segments[segmentToLoad] = JSON.stringify(roadInfo);
	        }
	        else {
	            RawMemory.segments[segmentToLoad] = "";
	        }
	        if (processingFinishedForRoom) {
	            let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
	            if (lastIndex === undefined) {
	                console.log("Error with lastIndex in RoadManager.");
	                return;
	            }
	            let nextIndex = segmentToLoad + 1;
	            if (nextIndex > lastIndex + 50) {
	                nextIndex = 51;
	            }
	            this.setValue(this.MEMORY_SEGMENTTOLOAD, nextIndex);
	        }
	        return roadInfo;
	    }
	    saveRoadsNeedingRepairingToMemory(roadInfo) {
	        if (roadInfo === undefined || roadInfo.roomName === undefined || roadInfo.roads === undefined) {
	            return;
	        }
	        let room = Game.rooms[roadInfo.roomName];
	        if (room === undefined || room.controller === undefined || room.isExpansion()) {
	            return;
	        }
	        if (room.memory.roadsUpdate !== undefined && room.memory.roadsUpdate + 300 > Game.time) {
	            return;
	        }
	        let structureIds = [];
	        let basepos = RoomRepository.getBasePosition(room);
	        if (basepos !== undefined) {
	            for (let r of BaseLib.getAllBaseRoads(basepos)) {
	                if (r.hitsMax - r.hits > 2000) {
	                    structureIds.push(r.id);
	                }
	            }
	            for (let r of ExtensionLib.getExtensionRoads(room, basepos)) {
	                if (r.hitsMax - r.hits > 2000) {
	                    structureIds.push(r.id);
	                }
	            }
	        }
	        let roadid, road;
	        for (let id of Object.keys(roadInfo.roads)) {
	            for (roadid of roadInfo.roads[id].positions) {
	                road = Game.getObjectById(roadid);
	                if (road instanceof StructureRoad && road.hitsMax - road.hits > 2000) {
	                    structureIds.push(road.id);
	                }
	            }
	        }
	        room.memory.roads = _.unique(structureIds);
	        Memory.stats['roads.' + roadInfo.roomName + '.repair'] = room.memory.roads.length;
	        room.memory.roadsUpdate = Game.time;
	    }
	    requestSegmentForNextTick() {
	        let segmentToLoad = this.getValue(this.MEMORY_SEGMENTTOLOAD);
	        if (segmentToLoad === undefined) {
	            this.setValue(this.MEMORY_SEGMENTTOLOAD, 51);
	        }
	        else {
	            RawMemory.setActiveSegments([segmentToLoad]);
	        }
	    }
	    getRoadTargetIds(room) {
	        let sourceIds = getSourceIds(room);
	        let mineralId = undefined;
	        if (room.controller !== undefined && room.controller.my && room.controller.level >= 6) {
	            mineralId = getMineralId(room);
	        }
	        let praiseroomControllerId = getPraiseRoomControllerId(room);
	        let praiseroomMineralId = getPraiseRoomMineralId(room);
	        let skroomMineralIds = getSkRoomMineralIds(room);
	        let roadTargets = [];
	        if (room.controller !== undefined) {
	            roadTargets.push(room.controller.id);
	        }
	        if (sourceIds.length > 0) {
	            roadTargets = roadTargets.concat(sourceIds);
	        }
	        if (mineralId !== undefined) {
	            roadTargets.push(mineralId);
	        }
	        if (praiseroomControllerId !== undefined) {
	            roadTargets.push(praiseroomControllerId);
	        }
	        if (praiseroomMineralId !== undefined) {
	            roadTargets.push(praiseroomMineralId);
	        }
	        if (skroomMineralIds.length > 0) {
	            roadTargets = roadTargets.concat(skroomMineralIds);
	        }
	        return roadTargets;
	    }
	    loadRoadInfoFromSegment(segmentToLoad) {
	        if (segmentToLoad === undefined || !(_.contains(Object.keys(RawMemory.segments), "" + segmentToLoad))) {
	            return undefined;
	        }
	        let roadInfo;
	        if (typeof RawMemory.segments[segmentToLoad] === 'string' && RawMemory.segments[segmentToLoad].length > 0) {
	            roadInfo = JSON.parse(RawMemory.segments[segmentToLoad]);
	        }
	        if (roadInfo === undefined || roadInfo.roomName === undefined) {
	            roadInfo = new RoadInfo();
	            let room = RoomRepository.getRoomForIndex(segmentToLoad - 50);
	            if (room === undefined) {
	                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
	                let nextIndex = segmentToLoad + 1;
	                if (nextIndex > lastIndex + 50) {
	                    nextIndex = 51;
	                }
	                this.setValue(this.MEMORY_SEGMENTTOLOAD, nextIndex);
	                return undefined;
	            }
	            roadInfo.roomName = room.name;
	        }
	        if (roadInfo.roads === undefined) {
	            roadInfo.roads = {};
	        }
	        return roadInfo;
	    }
	    getRoadTargetFor(t) {
	        if (t instanceof StructureController) {
	            let containerPos = t.getContainerPosition();
	            if (containerPos !== undefined) {
	                return containerPos;
	            }
	            else if (t.room.storage !== undefined) {
	                return t.room.storage.pos;
	            }
	        }
	        else if (t instanceof Source) {
	            let containerPos = t.getContainerPosition();
	            if (containerPos !== undefined) {
	                return containerPos;
	            }
	        }
	        else if (t instanceof Mineral) {
	            let containerPos = t.getContainerPosition();
	            if (containerPos !== undefined) {
	                return containerPos;
	            }
	        }
	        return t.pos;
	    }
	}
	exports.RoadManager = RoadManager;
	function buildRoadsToExtensions(room) {
	    if (room.storage === undefined) {
	        return false;
	    }
	    let extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
	    for (let e of extensions) {
	        if (!extensionHasRoadConnection(e)) {
	            buildRoadBetween(e.pos, room.storage.pos);
	            return true;
	        }
	    }
	    return false;
	}
	function extensionHasRoadConnection(e) {
	    for (let x of [-1, 0, 1]) {
	        for (let y of [-1, 0, 1]) {
	            let pos = new RoomPosition(e.pos.x + x, e.pos.y + y, e.pos.roomName);
	            let atPosConSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
	            for (let c of atPosConSites) {
	                if (c.structureType === STRUCTURE_ROAD) {
	                    return true;
	                }
	            }
	            let atPosStructures = pos.lookFor(LOOK_STRUCTURES);
	            for (let c of atPosStructures) {
	                if (c.structureType === STRUCTURE_ROAD) {
	                    return true;
	                }
	            }
	        }
	    }
	    return false;
	}
	function getRoadsTo(r, pos) {
	    let startPos = RoomRepository.getBasePosition(r);
	    if (startPos === undefined) {
	        return [];
	    }
	    if (r.storage !== undefined) {
	        startPos = r.storage.pos;
	    }
	    return getRoadBetween(startPos, pos, RoomRepository.isMiddleRoom(pos.roomName));
	}
	function getSourceIds(room) {
	    let sourceIds = [];
	    for (let sourceId of IntelLib.sourceIds(room.name)) {
	        sourceIds.push(sourceId);
	    }
	    let outposts = RoomRepository.getAllOutposts(room);
	    for (let outpost of outposts) {
	        if (Game.rooms[outpost] !== undefined && Game.rooms[outpost].name !== undefined && IntelLib.hasIntel(outpost)) {
	            for (let sourceId of IntelLib.sourceIds(outpost)) {
	                sourceIds.push(sourceId);
	            }
	        }
	    }
	    return sourceIds;
	}
	function getMineralId(room) {
	    let minerals = room.find(FIND_MINERALS);
	    if (minerals.length !== 1) {
	        return;
	    }
	    return minerals[0].id;
	}
	function getSkRoomMineralIds(room) {
	    let ids = [];
	    let lairs = RoomRepository.getLairOutposts(room);
	    if (lairs.length > 0) {
	        for (let outpost of lairs) {
	            if (Game.rooms[outpost] !== undefined && Game.rooms[outpost].name !== undefined && IntelLib.hasIntel(outpost)) {
	                let minerals = Game.rooms[outpost].find(FIND_MINERALS);
	                if (minerals.length === 1) {
	                    ids.push(minerals[0].id);
	                }
	            }
	        }
	    }
	    return ids;
	}
	function getPraiseRoomControllerId(room) {
	    if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
	        let praiseroom = Game.rooms[room.memory.praiseroom];
	        if (praiseroom !== undefined && praiseroom.controller !== undefined) {
	            return praiseroom.controller.id;
	        }
	    }
	    return undefined;
	}
	function getPraiseRoomMineralId(room) {
	    if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
	        let praiseroom = Game.rooms[room.memory.praiseroom];
	        if (praiseroom !== undefined && praiseroom.controller !== undefined) {
	            let minerals = praiseroom.find(FIND_MINERALS);
	            if (minerals.length === 1) {
	                return minerals[0].id;
	            }
	        }
	    }
	    return undefined;
	}
	function deleteAllFlags() {
	    let flags = Game.flags;
	    for (let f in flags) {
	        Game.flags[f].remove();
	    }
	}
	exports.deleteAllFlags = deleteAllFlags;
	function simBuildRoadBetween(pos1, pos2) {
	    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2);
	    console.log("Path length: " + pathForRoad.length);
	    for (let position of pathForRoad) {
	        let room = Game.rooms[position.roomName];
	        if (room !== undefined && room instanceof Room) {
	            position.createFlag();
	        }
	    }
	    return true;
	}
	exports.simBuildRoadBetween = simBuildRoadBetween;
	function buildRoadAtPosIfNotPresent(pos) {
	    if (pos.x <= 0 || pos.x >= 49 || pos.y <= 0 || pos.y >= 49) {
	        return -100;
	    }
	    let posGround = Game.map.getTerrainAt(pos);
	    if (posGround !== "plain" && posGround !== "swamp") {
	        return -100;
	    }
	    let structuresAtPos = pos.lookFor(LOOK_STRUCTURES);
	    let constructionSitesAtPos = pos.lookFor(LOOK_CONSTRUCTION_SITES);
	    for (let s of structuresAtPos) {
	        if (s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_RAMPART) {
	            return -100;
	        }
	        else if (s.structureType === STRUCTURE_ROAD) {
	            return -100;
	        }
	    }
	    for (let c of constructionSitesAtPos) {
	        if (c.structureType !== STRUCTURE_ROAD && c.structureType !== STRUCTURE_RAMPART) {
	            return -100;
	        }
	        if (c.structureType === STRUCTURE_ROAD) {
	            return -100;
	        }
	    }
	    return pos.createConstructionSite(STRUCTURE_ROAD);
	}
	function buildRoadAroundPosition(pos, range = 1, onlySwamps = false, onlyCorners = false, includeMiddle = false) {
	    if (range < 1 || roadConstructionLimitReached()) {
	        return false;
	    }
	    let room = Game.rooms[pos.roomName];
	    if (room === undefined || (!(room instanceof Room))) {
	        return true;
	    }
	    for (let x = -range; x < range + 1; x++) {
	        for (let y = -range; y < range + 1; y++) {
	            let position = new RoomPosition(pos.x + x, pos.y + y, pos.roomName);
	            if (includeMiddle || !(x === 0 && y === 0)) {
	                if (!roadConstructionLimitReached() && ((!onlySwamps || Game.map.getTerrainAt(position) === "swamp") && (!onlyCorners || Math.abs(x) + Math.abs(y) < range + 1))) {
	                    if (buildRoadAtPosIfNotPresent(position) === ERR_FULL) {
	                        return false;
	                    }
	                }
	            }
	        }
	    }
	    return true;
	}
	exports.buildRoadAroundPosition = buildRoadAroundPosition;
	function buildRoadBetween(pos1, pos2, onlySwamps = false, highway = false, allowSK = false) {
	    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2, allowSK);
	    for (let position of pathForRoad) {
	        let room = Game.rooms[position.roomName];
	        if (room !== undefined && room instanceof Room &&
	            (!roadConstructionLimitReached() && (!onlySwamps || Game.map.getTerrainAt(position) === "swamp"))) {
	            if (buildRoadAtPosIfNotPresent(position) === ERR_FULL) {
	                return false;
	            }
	            if (highway) {
	                buildRoadAroundPosition(position, 1, true, true);
	            }
	        }
	    }
	    return true;
	}
	function getRoadBetween(pos1, pos2, allowSK = false) {
	    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2, allowSK);
	    let roads = [];
	    for (let position of pathForRoad) {
	        let room = Game.rooms[position.roomName];
	        if (room !== undefined && room instanceof Room) {
	            let structures = position.lookFor(LOOK_STRUCTURES);
	            for (let s of structures) {
	                if (s.structureType === STRUCTURE_ROAD) {
	                    roads.push(s.id);
	                }
	            }
	        }
	    }
	    return roads;
	}
	function roadConstructionLimitReached() {
	    return Object.keys(Game.constructionSites).length > 60;
	}


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const Logger_1 = __webpack_require__(7);
	const labstatus_1 = __webpack_require__(41);
	const roomlevel_1 = __webpack_require__(11);
	const RoomRepository = __webpack_require__(10);
	const TradeManager = __webpack_require__(86);
	const ingredientsForCompound = { "OH": ["O", "H"], "LH": ["L", "H"], "KH": ["K", "H"], "UH": ["U", "H"], "ZH": ["Z", "H"], "GH": ["G", "H"], "LO": ["L", "O"], "KO": ["K", "O"], "UO": ["U", "O"], "ZO": ["Z", "O"], "GO": ["G", "O"], "ZK": ["K", "Z"], "UL": ["U", "L"], "UH2O": ["UH", "OH"], "UHO2": ["UO", "OH"], "ZH2O": ["ZH", "OH"], "ZHO2": ["ZO", "OH"], "KH2O": ["KH", "OH"], "KHO2": ["KO", "OH"], "LH2O": ["LH", "OH"], "LHO2": ["LO", "OH"], "GH2O": ["GH", "OH"], "GHO2": ["GO", "OH"], "XUH2O": ["UH2O", "X"], "XUHO2": ["UHO2", "X"], "XLH2O": ["LH2O", "X"], "XLHO2": ["LHO2", "X"], "XKH2O": ["KH2O", "X"], "XKHO2": ["KHO2", "X"], "XZH2O": ["ZH2O", "X"], "XZHO2": ["ZHO2", "X"], "XGH2O": ["GH2O", "X"], "XGHO2": ["GHO2", "X"], "G": ["UL", "ZK"] };
	const priorityStock = {
	    XGHO2: 1000,
	    XLHO2: 1000,
	    XZHO2: 1000,
	    XZH2O: 1000,
	    XKHO2: 1000,
	    XUH2O: 1000,
	    GHO2: 1000,
	    LHO2: 1000,
	    ZHO2: 1000,
	    ZH2O: 1000,
	    UH2O: 1000,
	    KHO2: 1000,
	    GO: 1000,
	    LO: 1000,
	    ZO: 1000,
	    ZH: 1000,
	    UH: 1000,
	    KO: 1000,
	};
	const wantedStock = {
	    UH: 2000,
	    KO: 3000,
	    XGHO2: 10000,
	    XLHO2: 10000,
	    XZHO2: 6000,
	    XZH2O: 6000,
	    XKHO2: 8000,
	    XUH2O: 8000,
	    G: 4000,
	    XLH2O: 2000,
	    LH: 2000,
	    XUHO2: 2000,
	    XKH2O: 2000,
	    XGH2O: 12000
	};
	const _Manager_1 = __webpack_require__(14);
	class LabManager extends _Manager_1.Manager {
	    constructor(roomService) {
	        super("LabManager");
	        this.roomService = roomService;
	    }
	    run(pri) {
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let rooms = this.roomService.getNormalAndNotExpansion();
	            for (let room of rooms) {
	                if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.Town && room.hasLabArea() &&
	                    (room.memory.lab.inactiveUntil === undefined || room.memory.lab.inactiveUntil < Game.time)) {
	                    labOperationStatus(room);
	                }
	            }
	        }
	    }
	}
	exports.LabManager = LabManager;
	function labOperationStatus(room) {
	    switch (room.memory.lab.labstatus) {
	        case labstatus_1.Labstatus.Inactive:
	            checkIfWeShouldRunLabs(room);
	            break;
	        case labstatus_1.Labstatus.GettingMineralsToTerminal:
	            checkIfWeHaveMineralsForReaction(room);
	            break;
	        case labstatus_1.Labstatus.MovingMineralsToLab:
	            moveMineralsToLab(room);
	            break;
	        case labstatus_1.Labstatus.RunningReactions:
	            runReactionLabs(room);
	            break;
	        case labstatus_1.Labstatus.EmptyingLabs:
	            checkIfLabsAreEmpty(room);
	            break;
	        case labstatus_1.Labstatus.EmptyingAllLabs:
	            checkIfWeShouldRunLabs(room);
	            break;
	        default:
	            room.memory.lab.labstatus = labstatus_1.Labstatus.Inactive;
	    }
	}
	function checkIfLabsAreEmpty(room) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let processingLabs = room.getProcessingLabs();
	    let labsAreEmpty = true;
	    for (let lab of processingLabs) {
	        if (lab.mineralAmount > 0) {
	            labsAreEmpty = false;
	        }
	    }
	    if (labsAreEmpty) {
	        if (room.isAbandoned()) {
	            Logger_1.log.info("Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks", room.name);
	            room.memory.lab.inactiveUntil = Game.time + 1000;
	            room.memory.lab.labstatus = labstatus_1.Labstatus.Inactive;
	        }
	        if (room.memory.lab.cooldown > 0) {
	            room.memory.lab.cooldown--;
	        }
	        else {
	            room.memory.lab.cooldown = undefined;
	            runNextReaction(room);
	        }
	    }
	}
	function runReactionLabs(room) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let supplyLabs = room.getSupplyingLabs();
	    if (supplyLabs.length !== 2 || supplyLabs[0].mineralAmount === 0 || supplyLabs[1].mineralAmount === 0) {
	        let terminalAmountWhenFinishedUnloading = room.memory.lab.batchSize;
	        if (room.terminal.store[room.memory.lab.activeMineral] > 0) {
	            terminalAmountWhenFinishedUnloading += room.memory.lab.activeMineral + room.terminal.store[room.memory.lab.activeMineral];
	        }
	        room.memory.lab.cooldown = 10;
	        room.memory.lab.labstatus = labstatus_1.Labstatus.EmptyingLabs;
	        return;
	    }
	    let processingLabs = room.getProcessingLabs();
	    for (let lab of processingLabs) {
	        if (lab.cooldown === 0) {
	            lab.runReaction(supplyLabs[0], supplyLabs[1]);
	        }
	    }
	}
	class SupplyJob {
	}
	function getSupplyLabJobs(room) {
	    let supplyLabs = room.getSupplyingLabs();
	    if (supplyLabs.length !== 2) {
	        console.log("Error with supplylabs: " + room.name);
	        return [];
	    }
	    let requiredMinerals = ingredientsForCompound[room.memory.lab.activeMineral];
	    if (requiredMinerals.length !== 2) {
	        console.log("Error with requiredMinerals for supplying labs: " + room.name);
	        return [];
	    }
	    let jobs = [];
	    let job1 = new SupplyJob();
	    job1.amount = room.memory.lab.batchSize;
	    job1.lab = supplyLabs[0].id;
	    job1.mineral = requiredMinerals[0];
	    jobs.push(job1);
	    let job2 = new SupplyJob();
	    job2.amount = room.memory.lab.batchSize;
	    job2.lab = supplyLabs[1].id;
	    job2.mineral = requiredMinerals[1];
	    jobs.push(job2);
	    return jobs;
	}
	function moveMineralsToLab(room) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    if (room.memory.lab.supplyJobs === undefined) {
	        room.memory.lab.supplyJobs = getSupplyLabJobs(room);
	    }
	    if (room.memory.lab.supplyJobs.length !== 2) {
	        console.log("Error with supplyjobs: " + room.name);
	        return;
	    }
	    for (let j of room.memory.lab.supplyJobs) {
	        let lab = Game.getObjectById(j.lab);
	        if (lab.mineralAmount < j.amount || lab.mineralAmount === 0 || lab.mineralType !== j.mineral) {
	            return;
	        }
	    }
	    room.memory.lab.supplyJobs = undefined;
	    room.memory.lab.labstatus = labstatus_1.Labstatus.RunningReactions;
	}
	function checkIfWeHaveMineralsForReaction(room) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    let requiredMinerals = ingredientsForCompound[room.memory.lab.activeMineral];
	    if (requiredMinerals === undefined) {
	        console.log("Error with required minerals: " + room.name);
	        return;
	    }
	    let hasMinerals = true;
	    for (let mineral of requiredMinerals) {
	        if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < room.memory.lab.batchSize) {
	            hasMinerals = false;
	            let howManyToBuy = room.memory.lab.batchSize;
	            if (room.terminal.store[mineral] !== undefined) {
	                howManyToBuy = howManyToBuy - room.terminal.store[mineral];
	            }
	            if (ingredientsForCompound[mineral] === undefined) {
	                TradeManager.requestMineralsForLabs(room, mineral, howManyToBuy);
	                return;
	            }
	        }
	    }
	    if (hasMinerals) {
	        room.memory.lab.labstatus = labstatus_1.Labstatus.MovingMineralsToLab;
	    }
	}
	function isLabsEmpty(room) {
	    let processingLabs = room.getProcessingLabs();
	    for (let l of processingLabs) {
	        if (l.mineralAmount > 0) {
	            return false;
	        }
	    }
	    let supplyingLabs = room.getSupplyingLabs();
	    for (let l of supplyingLabs) {
	        if (l.mineralAmount > 0) {
	            return false;
	        }
	    }
	    return true;
	}
	function checkIfWeShouldRunLabs(room) {
	    if (room.terminal === undefined) {
	        return;
	    }
	    if (!isLabsEmpty(room)) {
	        room.memory.lab.labstatus = labstatus_1.Labstatus.EmptyingAllLabs;
	        Logger_1.log.info("Labs seems to have had some problems during the last operation. Sending minerals to the terminal.", room.name);
	        room.memory.lab.inactiveUntil = Game.time + 10;
	        return;
	    }
	    else {
	        room.memory.lab.labstatus = labstatus_1.Labstatus.Inactive;
	    }
	    if (room.isAbandoned()) {
	        Logger_1.log.info("Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks", room.name);
	        room.memory.lab.inactiveUntil = Game.time + 1000;
	        return;
	    }
	    let missingPriorityStock = false;
	    for (let mineral in priorityStock) {
	        if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < priorityStock[mineral]) {
	            missingPriorityStock = true;
	            room.memory.lab.batchSize = 1000;
	            let missing = checkHowManyMineralsAreMissingForFinalProduct(room, mineral);
	            if (missing === 0) {
	                room.memory.lab.mineralQueue = buildReactionQueueForMineral(mineral);
	                room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
	                if (room.memory.lab.activeMineral === undefined) {
	                    return;
	                }
	                room.memory.lab.labstatus = labstatus_1.Labstatus.GettingMineralsToTerminal;
	                room.memory.lab.wantedMineral = mineral;
	                Logger_1.log.info("Labs are starting production of " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
	                return;
	            }
	        }
	    }
	    if (!missingPriorityStock) {
	        for (let mineral in wantedStock) {
	            if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < wantedStock[mineral]) {
	                room.memory.lab.batchSize = 2000;
	                let missing = checkHowManyMineralsAreMissingForFinalProduct(room, mineral);
	                if (missing === 0) {
	                    room.memory.lab.mineralQueue = buildReactionQueueForMineral(mineral);
	                    room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
	                    if (room.memory.lab.activeMineral === undefined) {
	                        return;
	                    }
	                    room.memory.lab.labstatus = labstatus_1.Labstatus.GettingMineralsToTerminal;
	                    room.memory.lab.wantedMineral = mineral;
	                    Logger_1.log.info("Labs are starting production of " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
	                    return;
	                }
	            }
	        }
	    }
	    Logger_1.log.info("Labs are inactive, putting to sleep for 1000 ticks", room.name);
	    room.memory.lab.inactiveUntil = Game.time + 1000;
	}
	function checkHowManyMineralsAreMissingForFinalProduct(room, mineral) {
	    let req = getRequiredBasicMineralsForMineral(mineral);
	    if (room.terminal === undefined) {
	        return Object.keys(req).length;
	    }
	    let count = 0;
	    for (let m of Object.keys(req)) {
	        if (room.terminal.store[m] === undefined || room.terminal.store[m] < (req[m] * room.memory.lab.batchSize)) {
	            count++;
	        }
	    }
	    return count;
	}
	function runNextReaction(room) {
	    if (room.memory.lab.mineralQueue.length > 0) {
	        room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
	        room.memory.lab.labstatus = labstatus_1.Labstatus.GettingMineralsToTerminal;
	    }
	    else {
	        Logger_1.log.info("Labs are finished producing " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
	        room.memory.lab.labstatus = labstatus_1.Labstatus.Inactive;
	        room.memory.lab.mineralQueue = undefined;
	        room.memory.lab.activeMineral = undefined;
	        room.memory.lab.wantedMineral = undefined;
	    }
	}
	function buildReactionQueueForMineral(mineral) {
	    return getRequiredReactionsForMineral(mineral);
	}
	function getRequiredBasicMineralsForMineral(mineral) {
	    let flat = _getRequiredBasicMineralsForMineral(mineral);
	    let required = {};
	    for (let m of flat) {
	        if (required[m] === undefined) {
	            required[m] = 1;
	        }
	        else {
	            required[m]++;
	        }
	    }
	    return required;
	}
	exports.getRequiredBasicMineralsForMineral = getRequiredBasicMineralsForMineral;
	function _getRequiredBasicMineralsForMineral(mineral) {
	    if (ingredientsForCompound[mineral] === undefined || _.isEmpty(mineral)) {
	        return [mineral];
	    }
	    else {
	        return _getRequiredBasicMineralsForMineral(ingredientsForCompound[mineral][0]).concat(_getRequiredBasicMineralsForMineral(ingredientsForCompound[mineral][1]));
	    }
	}
	function getRequiredReactionsForMineral(mineral) {
	    if (ingredientsForCompound[mineral] === undefined || _.isEmpty(mineral)) {
	        return [];
	    }
	    else {
	        return getRequiredReactionsForMineral(ingredientsForCompound[mineral][0]).concat(getRequiredReactionsForMineral(ingredientsForCompound[mineral][1]), mineral);
	    }
	}


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const ProfileUtilities = __webpack_require__(19);
	const PathfindingUtilities = __webpack_require__(3);
	const OrdersRepository = __webpack_require__(18);
	const PoachGuard = __webpack_require__(131);
	const PoachMiner = __webpack_require__(132);
	const PoachHauler = __webpack_require__(133);
	const _Manager_1 = __webpack_require__(14);
	const IntelLib = __webpack_require__(5);
	const Order_1 = __webpack_require__(20);
	const RoomRepository = __webpack_require__(10);
	const role_1 = __webpack_require__(16);
	const priority_1 = __webpack_require__(17);
	const roomlevel_1 = __webpack_require__(11);
	const hostility_1 = __webpack_require__(6);
	const Logger_1 = __webpack_require__(7);
	class PoachingManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("PoachingManager");
	        this.MEMORY_LASTRUN = "lastRun";
	        this.MEMORY_LASTRUNBOT = "lastRunBot";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (Memory.settings.slow === true) {
	            return;
	        }
	        if (pri === _Manager_1.ManagerPriority.Standard) {
	            this.creepService.runCreeps(role_1.Role.PoachGuard, PoachGuard.run);
	        }
	        else if (pri === _Manager_1.ManagerPriority.Low) {
	            this.creepService.runCreeps(role_1.Role.PoachHauler, PoachHauler.run);
	            this.creepService.runCreeps(role_1.Role.PoachMiner, PoachMiner.run);
	            let lastRun = this.getValue(this.MEMORY_LASTRUN);
	            if (lastRun === undefined || lastRun + 50 < Game.time) {
	                let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                for (let room of rooms) {
	                    if (room.memory.poaching !== undefined && !room.isUnderSiege() && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City) {
	                        this.runPoaching(room);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN, Game.time);
	            }
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            if (Memory.settings.bot === true) {
	                let lastRunBot = this.getValue(this.MEMORY_LASTRUNBOT);
	                if (lastRunBot === undefined || lastRunBot + 500 < Game.time) {
	                    let rooms = this.roomService.getNormalRoomsNotAbandoned();
	                    for (let room of rooms) {
	                        if (RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.City && !room.isUnderSiege()) {
	                            this.setBotPoachingRoom(room);
	                        }
	                    }
	                    this.setValue(this.MEMORY_LASTRUNBOT, Game.time);
	                }
	            }
	        }
	    }
	    runPoaching(room) {
	        for (let outpost of room.memory.poaching) {
	            let o = Game.rooms[outpost];
	            if (o !== undefined) {
	                let mineral = o.getMineral();
	                if (mineral !== undefined && mineral.ticksToRegeneration === undefined &&
	                    room.storage !== undefined && (room.storage.store[mineral.mineralType] === undefined || room.storage.store[mineral.mineralType] < 250000) &&
	                    _.sum(room.storage.store) < (0.95 * room.storage.storeCapacity)) {
	                    let guards = this.creepService.getCreeps(role_1.Role.PoachGuard, outpost).length;
	                    if (guards > 0) {
	                        this.orderPoachMiners(room, mineral);
	                        this.orderPoachHaulers(room, mineral);
	                    }
	                    else {
	                        this.orderPoachGuard(room, outpost);
	                    }
	                }
	            }
	            else {
	                let intelTime = IntelLib.intelTime(outpost);
	                let mineralTicks = IntelLib.mineralTicks(outpost);
	                if (intelTime === undefined || mineralTicks === undefined || (intelTime + mineralTicks < Game.time)) {
	                    this.orderPoachGuard(room, outpost);
	                }
	            }
	        }
	    }
	    setBotPoachingRoom(room) {
	        if (room.memory.poaching !== undefined && room.memory.poaching.length > 0) {
	            this.checkIfPoachIsFinished(room);
	        }
	        if (room.memory.poaching === undefined || room.memory.poaching.length === 0) {
	            this.checkIfWeCanPoach(room);
	        }
	    }
	    checkIfPoachIsFinished(room) {
	        for (let outpost of room.memory.poaching) {
	            let intelTime = IntelLib.intelTime(outpost);
	            let mineralTicks = IntelLib.mineralTicks(outpost);
	            if (intelTime !== undefined && mineralTicks !== undefined) {
	                Logger_1.log.info("Poaching of minerals in room " + outpost + " seems to be finished. Removing it from list.", room.name);
	                room.memory.poaching = undefined;
	                return;
	            }
	        }
	    }
	    checkIfWeCanPoach(room) {
	        if (room.memory.neighbours === undefined || room.memory.neighbours.twoAway === undefined || room.memory.neighbours.threeAway === undefined) {
	            return;
	        }
	        let secondNeighbours = _.filter(room.memory.neighbours.twoAway, (r) => RoomRepository.isMiddleRoom(r));
	        let thirdNeighbours = _.filter(room.memory.neighbours.threeAway, (r) => RoomRepository.isMiddleRoom(r));
	        let potNeighbours = secondNeighbours.concat(thirdNeighbours);
	        if (potNeighbours.length === 0) {
	            return;
	        }
	        let allOutposts = RoomRepository.getAllOutpostsInAllRooms(this.roomService.getNormalRooms());
	        let allPoachrooms = RoomRepository.getAllPoachroomsInAllRooms(this.roomService.getNormalRooms());
	        let possiblePoachrooms = _.filter(potNeighbours, (r) => !_.contains(allOutposts, r) && !_.contains(allPoachrooms, r));
	        if (possiblePoachrooms.length === 0) {
	            return;
	        }
	        for (let possibleRoom of possiblePoachrooms) {
	            let intelTime = IntelLib.intelTime(possibleRoom);
	            let mineralTicks = IntelLib.mineralTicks(possibleRoom);
	            let hostility = IntelLib.roomHostility(possibleRoom);
	            if (hostility < hostility_1.Hostility.HarmlessHostiles && intelTime !== undefined && (mineralTicks === undefined || (intelTime + mineralTicks < Game.time))) {
	                Logger_1.log.alert("Poaching of minerals in room " + possibleRoom + " started. ", room.name);
	                room.memory.poaching = [possibleRoom];
	                return;
	            }
	        }
	    }
	    orderPoachHaulers(room, mineral) {
	        if (room.storage === undefined) {
	            return;
	        }
	        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, role_1.Role.PoachHauler, mineral.id);
	        let currentMiners = this.creepService.getCreeps(role_1.Role.PoachMiner, mineral.id).length;
	        if (orderedTiers > 0 || currentMiners === 0) {
	            return;
	        }
	        let currentTiers = this.creepService.getNumberOfTiers(role_1.Role.PoachHauler, mineral.id);
	        let wantedTiers = Math.ceil(currentMiners * 2.5 * PathfindingUtilities.getDistanseBetween(room.storage.pos, mineral.pos) / 10);
	        if (orderedTiers + currentTiers >= wantedTiers) {
	            return;
	        }
	        let maxTier = ProfileUtilities.getMaxTierOffroadHauler(room.energyCapacityAvailable);
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getOffroadHaulerBody(maxTier);
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.PoachHauler, target: mineral.id, tier: maxTier };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderPoachMiners(room, mineral) {
	        let wanted = Math.min(mineral.getMiningPositions().length, 3);
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PoachMiner, mineral.id);
	        let current = this.creepService.getCreeps(role_1.Role.PoachMiner, mineral.id).length;
	        if (ordered > 0 || current + ordered >= wanted) {
	            return;
	        }
	        let order = new Order_1.Order();
	        order.body = ProfileUtilities.getPoachMinerBody();
	        order.priority = priority_1.Priority.Standard;
	        order.memory = { role: role_1.Role.PoachMiner, target: mineral.id, tier: 1 };
	        OrdersRepository.orderCreep(room, order);
	    }
	    orderPoachGuard(room, targetRoom) {
	        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.PoachGuard, targetRoom);
	        if (ordered > 0) {
	            return;
	        }
	        let currentCreeps = this.creepService.getCreeps(role_1.Role.PoachGuard, targetRoom).length;
	        if (currentCreeps > 0) {
	            return;
	        }
	        let guardOrder = new Order_1.Order();
	        guardOrder.body = ProfileUtilities.getPoachGuardBody();
	        guardOrder.priority = priority_1.Priority.Critical;
	        guardOrder.memory = { role: role_1.Role.PoachGuard, target: targetRoom, tier: 1 };
	        OrdersRepository.orderCreep(room, guardOrder);
	    }
	}
	exports.PoachingManager = PoachingManager;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PositionLib = __webpack_require__(46);
	const PathfindingUtilities = __webpack_require__(3);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const priority_1 = __webpack_require__(17);
	var State;
	(function (State) {
	    State[State["MoveToRoom"] = 1] = "MoveToRoom";
	    State[State["Waiting"] = 2] = "Waiting";
	    State[State["Fighting"] = 3] = "Fighting";
	    State[State["Healing"] = 4] = "Healing";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToRoom);
	    }
	    if (creep.memory.orderCopyTick === creep.ticksToLive) {
	        orderMyCopy(creep);
	    }
	    switch (creep.getState()) {
	        case State.MoveToRoom:
	            runMoveToRoom(creep);
	            break;
	        case State.Waiting:
	            runWaiting(creep);
	            break;
	        case State.Fighting:
	            runFighting(creep);
	            break;
	        case State.Healing:
	            runHealing(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MoveToRoom);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToRoom(creep) {
	    if (creep.hits < creep.hitsMax) {
	        creep.heal(creep);
	    }
	    let targetRoom = creep.memory.target;
	    if (targetRoom === undefined) {
	        return;
	    }
	    if (targetRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
	        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
	    }
	    else {
	        creep.setState(State.Waiting);
	        runWaiting(creep);
	    }
	}
	function runWaiting(creep) {
	    if (creep.memory.mineralId === undefined) {
	        recordIds(creep);
	    }
	    if (creep.memory.orderCopyTick === undefined) {
	        setOrderCopyTick(creep);
	    }
	    if (creep.hits < creep.hitsMax) {
	        creep.heal(creep);
	    }
	    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
	        let lair = Game.getObjectById(creep.memory.lair);
	        if (lair !== null && creep.pos.getRangeTo(lair.pos) > 1) {
	            creep.moveTo(lair, { maxRooms: 1 });
	        }
	        creep.memory.sleep = creep.memory.sleep - 1;
	        return;
	    }
	    let mineral = Game.getObjectById(creep.memory.mineralId);
	    if (mineral === null) {
	        console.log("No mineral found for Guard: " + creep.pos);
	        return;
	    }
	    let keeper = findKeeper(mineral);
	    if (keeper !== undefined) {
	        creep.memory.keeper = keeper.id;
	        creep.setState(State.Fighting);
	        runFighting(creep);
	        return;
	    }
	    else {
	        creep.memory.keeper = undefined;
	    }
	    let lair = Game.getObjectById(creep.memory.lair);
	    if (lair !== null && lair.ticksToSpawn !== undefined) {
	        creep.memory.sleep = lair.ticksToSpawn;
	    }
	    else {
	        creep.memory.sleep = 20;
	    }
	}
	function runFighting(creep) {
	    let keeper = Game.getObjectById(creep.memory.keeper);
	    if (keeper === null) {
	        if (creep.hits < creep.hitsMax) {
	            creep.heal(creep);
	        }
	        creep.memory.keeper = undefined;
	        creep.setState(State.Healing);
	        return;
	    }
	    if (creep.pos.getRangeTo(keeper.pos) > 1) {
	        creep.moveTo(keeper, { maxRooms: 1 });
	        if (creep.hits < creep.hitsMax) {
	            creep.heal(creep);
	        }
	    }
	    else {
	        creep.attack(keeper);
	        creep.moveTo(keeper, { ignoreCreeps: true, maxRooms: 1 });
	    }
	}
	function runHealing(creep) {
	    if (creep.hits < creep.hitsMax) {
	        creep.heal(creep);
	        return;
	    }
	    let healTarget = Game.getObjectById(creep.memory.healTarget);
	    if (healTarget !== null) {
	        let mineral = Game.getObjectById(creep.memory.mineralId);
	        if (mineral !== null && mineral.pos.getRangeTo(healTarget) > 10) {
	            creep.memory.healTarget = undefined;
	            return;
	        }
	        if (healTarget.hits === healTarget.hitsMax) {
	            creep.memory.healTarget = undefined;
	            return;
	        }
	        let range = creep.pos.getRangeTo(healTarget);
	        if (range > 1) {
	            creep.moveTo(healTarget);
	        }
	        if (range < 4) {
	            creep.heal(healTarget);
	        }
	    }
	    else {
	        let needsHealing = creep.pos.findInRange(FIND_MY_CREEPS, 7, { filter: (c) => c.hits < c.hitsMax });
	        if (needsHealing.length > 0) {
	            creep.memory.healTarget = needsHealing[0].id;
	            return;
	        }
	        else {
	            creep.setState(State.Waiting);
	        }
	    }
	}
	function recordIds(creep) {
	    let mineral = creep.room.getMineral();
	    if (mineral === undefined) {
	        console.log("PoachGuard could not find mineral: " + creep.room.name);
	        creep.disable();
	        return;
	    }
	    creep.memory.mineralId = mineral.id;
	    let lair = mineral.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_KEEPER_LAIR });
	    if (lair !== undefined && lair !== null) {
	        creep.memory.lair = lair.id;
	    }
	    let keeper = findKeeper(mineral);
	    if (keeper !== undefined) {
	        creep.memory.keeper = keeper.id;
	    }
	}
	function findKeeper(mineral) {
	    let creep = mineral.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	    if (creep === null) {
	        return undefined;
	    }
	    if (mineral.pos.getRangeTo(creep.pos) > 6) {
	        return undefined;
	    }
	    return creep;
	}
	function setOrderCopyTick(creep) {
	    let mineral = Game.getObjectById(creep.memory.mineralId);
	    let spawn = Game.rooms[creep.memory.homeroom].getSpawn();
	    if (mineral instanceof Mineral && spawn instanceof StructureSpawn) {
	        creep.memory.orderCopyTick = Math.ceil(PathfindingUtilities.getDistanseBetween(mineral.pos, spawn.pos) + 150);
	    }
	    else {
	        creep.memory.orderCopyTick = -1;
	    }
	}
	function orderMyCopy(creep) {
	    if (Game.rooms[creep.memory.homeroom] === undefined || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege() ||
	        !_.contains(Game.rooms[creep.memory.homeroom].memory.poaching, creep.memory.target)) {
	        return;
	    }
	    let mineral = Game.getObjectById(creep.memory.mineralId);
	    if (mineral === null || mineral.ticksToRegeneration !== undefined) {
	        return;
	    }
	    let order = new Order_1.Order();
	    order.body = _.map(creep.body, (p) => p.type);
	    order.priority = priority_1.Priority.Important;
	    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
	    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
	}


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const OrdersRepository = __webpack_require__(18);
	const Order_1 = __webpack_require__(20);
	const priority_1 = __webpack_require__(17);
	var State;
	(function (State) {
	    State[State["MoveToMineral"] = 1] = "MoveToMineral";
	    State[State["Mining"] = 2] = "Mining";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToMineral);
	    }
	    if (creep.memory.orderCopyTick === creep.ticksToLive) {
	        orderMyCopy(creep);
	    }
	    switch (creep.getState()) {
	        case State.MoveToMineral:
	            runMoveToMineral(creep);
	            break;
	        case State.Mining:
	            runMining(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MoveToMineral);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToMineral(creep) {
	    let mineral = getMineral(creep);
	    if (mineral !== null) {
	        if (mineral.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(mineral) > 1) {
	            creep.travelTo(mineral, { allowSK: true, avoidKeepers: true }, true);
	        }
	        else {
	            if (creep.memory.orderCopyTick === undefined) {
	                setOrderCopyTick(creep);
	            }
	            creep.setState(State.Mining);
	            runMining(creep);
	        }
	    }
	}
	function runMining(creep) {
	    if (Game.time % 6 !== 1) {
	        return;
	    }
	    let mineral = getMineral(creep);
	    if (mineral !== null && mineral.ticksToRegeneration !== undefined && mineral.ticksToRegeneration > 0) {
	        creep.suicide();
	        return;
	    }
	    if (mineral !== null && (creep.carryCapacity - _.sum(creep.carry) > creep.getWorkerParts())) {
	        let response = creep.harvest(mineral);
	        if (response === OK) {
	            if (Memory.stats['mineralmined.' + mineral.mineralType] === undefined) {
	                Memory.stats['mineralmined.' + mineral.mineralType] = 0;
	            }
	            Memory.stats['mineralmined.' + mineral.mineralType] += creep.getActiveBodyparts(WORK);
	        }
	    }
	}
	function getMineral(creep) {
	    let mineral = Game.getObjectById(creep.memory.target);
	    return mineral;
	}
	function setOrderCopyTick(creep) {
	    let mineral = getMineral(creep);
	    let spawn = Game.rooms[creep.memory.homeroom].getSpawn();
	    if (mineral instanceof Mineral && spawn instanceof StructureSpawn) {
	        creep.memory.orderCopyTick = Math.ceil(PathfindingUtilities.getDistanseBetween(mineral.pos, spawn.pos) + 150);
	    }
	    else {
	        creep.memory.orderCopyTick = -1;
	    }
	}
	function orderMyCopy(creep) {
	    if (Game.rooms[creep.memory.homeroom] === undefined || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege() ||
	        !_.contains(Game.rooms[creep.memory.homeroom].memory.poaching, creep.memory.target)) {
	        return;
	    }
	    let mineral = getMineral(creep);
	    if (mineral === null || mineral.ticksToRegeneration !== undefined) {
	        return;
	    }
	    let order = new Order_1.Order();
	    order.body = _.map(creep.body, (p) => p.type);
	    order.priority = priority_1.Priority.Important;
	    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
	    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
	}


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const PathfindingUtilities = __webpack_require__(3);
	const role_1 = __webpack_require__(16);
	var State;
	(function (State) {
	    State[State["MoveToMineral"] = 1] = "MoveToMineral";
	    State[State["Collecting"] = 2] = "Collecting";
	    State[State["Returning"] = 3] = "Returning";
	})(State || (State = {}));
	function run(creep) {
	    if (!creep.hasState()) {
	        creep.setState(State.MoveToMineral);
	    }
	    switch (creep.getState()) {
	        case State.MoveToMineral:
	            runMoveToMineral(creep);
	            break;
	        case State.Collecting:
	            runCollecting(creep);
	            break;
	        case State.Returning:
	            runReturning(creep);
	            break;
	        default:
	            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
	            creep.setState(State.MoveToMineral);
	            break;
	    }
	}
	exports.run = run;
	function runMoveToMineral(creep) {
	    let mineral = getMineral(creep);
	    if (mineral !== null) {
	        if (mineral.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(mineral) > 3) {
	            creep.travelTo(mineral, { allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false }, true);
	        }
	        else {
	            creep.setState(State.Collecting);
	            runCollecting(creep);
	        }
	    }
	}
	function runCollecting(creep) {
	    if (creep.carryCapacity === _.sum(creep.carry) || (creep.memory.distance !== undefined && creep.ticksToLive - 50 < creep.memory.distance)) {
	        if (_.sum(creep.carry) === 0) {
	            creep.suicide();
	            return;
	        }
	        creep.setState(State.Returning);
	        runReturning(creep);
	    }
	    else {
	        if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
	            creep.memory.sleep = creep.memory.sleep - 1;
	            return;
	        }
	        let current = Game.getObjectById(creep.memory.current);
	        if (current !== null && _.sum(current.carry) > 0) {
	            if (creep.pos.getRangeTo(current) > 1) {
	                creep.moveTo(current);
	            }
	            else {
	                current.transfer(creep, getInventoryType(current));
	                creep.memory.current = undefined;
	            }
	        }
	        else {
	            creep.memory.current = undefined;
	            let newTarget = getNewMinerTarget(creep);
	            if (newTarget === undefined) {
	                creep.memory.sleep = 20;
	            }
	            else {
	                creep.memory.current = newTarget.id;
	            }
	        }
	    }
	}
	function runReturning(creep) {
	    let homeRoom = Game.rooms[creep.getHomeroom()];
	    if (homeRoom !== undefined && homeRoom.storage !== undefined) {
	        if (homeRoom.storage.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(homeRoom.storage) > 1) {
	            creep.travelTo(homeRoom.storage, { allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false }, true);
	        }
	        else {
	            for (let m of Object.keys(creep.carry)) {
	                if (creep.carry[m] > 0) {
	                    creep.transfer(homeRoom.storage, m);
	                    return;
	                }
	            }
	            if (shouldDoAnotherRun(creep)) {
	                creep.setState(State.MoveToMineral);
	                runMoveToMineral(creep);
	            }
	            else {
	                creep.suicide();
	            }
	        }
	    }
	}
	function getNewMinerTarget(creep) {
	    let target = creep.room.find(FIND_MY_CREEPS, { filter: (c) => _.sum(c.carry) > (c.carryCapacity / 2) && c.memory.role === role_1.Role.PoachMiner });
	    if (target.length > 0) {
	        return target[0];
	    }
	}
	function shouldDoAnotherRun(creep) {
	    let mineral = getMineral(creep);
	    if (creep.room.storage === undefined || mineral === null) {
	        return false;
	    }
	    let distance = PathfindingUtilities.getDistanseBetween(creep.room.storage.pos, mineral.pos);
	    creep.memory.distance = distance;
	    return distance * 3 < creep.ticksToLive;
	}
	function getMineral(creep) {
	    let mineral = Game.getObjectById(creep.memory.target);
	    return mineral;
	}
	function getInventoryType(creep) {
	    for (let r of Object.keys(creep.carry)) {
	        if (creep.carry[r] > 0) {
	            return r;
	        }
	    }
	    return RESOURCE_ENERGY;
	}


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const _Manager_1 = __webpack_require__(14);
	const MilitaryLib = __webpack_require__(112);
	const HarassLib = __webpack_require__(135);
	const IntelLib = __webpack_require__(5);
	const RoomRepository = __webpack_require__(10);
	const roomlevel_1 = __webpack_require__(11);
	const harasstype_1 = __webpack_require__(136);
	const Logger_1 = __webpack_require__(7);
	class HarassManager extends _Manager_1.Manager {
	    constructor(roomService, creepService) {
	        super("HarassManager");
	        this.MEMORY_LASTRUN_LOTTERY = "lastRunLottery";
	        this.roomService = roomService;
	        this.creepService = creepService;
	    }
	    run(pri) {
	        if (Memory.settings.bot !== true || Memory.settings.passive === true) {
	            return;
	        }
	        if (pri === _Manager_1.ManagerPriority.Trivial) {
	            let lastRunLottery = this.getValue(this.MEMORY_LASTRUN_LOTTERY);
	            if (lastRunLottery === undefined || lastRunLottery + 500 < Game.time) {
	                let rooms = this.roomService.getNormalAndNotExpansion();
	                for (let room of rooms) {
	                    if (this.roomShouldTryToHarass(room)) {
	                        let targetRoom = this.findHarassTarget(room);
	                        if (targetRoom === undefined) {
	                            continue;
	                        }
	                        let attackType = this.findHarassType(room, targetRoom);
	                        this.orderAttackType(room, targetRoom, attackType);
	                        Logger_1.log.alert("Room " + room.name + " won the lottery and is allowed to harass " + targetRoom + " with " + harasstype_1.HarassType[attackType] + "!", room.name);
	                    }
	                }
	                this.setValue(this.MEMORY_LASTRUN_LOTTERY, Game.time);
	            }
	        }
	    }
	    roomShouldTryToHarass(room) {
	        return _.random(1, 10) === 10 && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.SimpleColony &&
	            (room.memory.orders === undefined || room.memory.orders.length < 3) &&
	            ((room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) ||
	                (room.storage === undefined && room.find(FIND_MY_CREEPS).length) > 2);
	    }
	    orderAttackType(room, target, type) {
	        switch (type) {
	            case harasstype_1.HarassType.T3BoostedWreckerTeam:
	                let boostedT3 = HarassLib.getT3BoostedWreckerTeamTierForRoom(room, target);
	                if (boostedT3 !== undefined) {
	                    MilitaryLib.orderTeamWrecker(room, boostedT3, [], [target], 3);
	                }
	                break;
	            case harasstype_1.HarassType.T2BoostedWreckerTeam:
	                let boostedT2 = HarassLib.getT2BoostedWreckerTeamTierForRoom(room, target);
	                if (boostedT2 !== undefined) {
	                    MilitaryLib.orderTeamWrecker(room, boostedT2, [], [target], 2);
	                }
	                break;
	            case harasstype_1.HarassType.T1BoostedWreckerTeam:
	                let boostedT1 = HarassLib.getT1BoostedWreckerTeamTierForRoom(room, target);
	                if (boostedT1 !== undefined) {
	                    MilitaryLib.orderTeamWrecker(room, boostedT1, [], [target], 1);
	                }
	                break;
	            case harasstype_1.HarassType.Drainer:
	                if (room.controller !== undefined && room.controller.level > 0 && room.controller.my) {
	                    MilitaryLib.orderDrainer(room, room.controller.level, [target]);
	                }
	                break;
	            case harasstype_1.HarassType.Harasser:
	                MilitaryLib.orderHarasser(room, target);
	                break;
	        }
	    }
	    findHarassTarget(room) {
	        if (room.memory.neighbours === undefined) {
	            return undefined;
	        }
	        let pool = [];
	        if (room.memory.neighbours.oneAway !== undefined) {
	            for (let r of room.memory.neighbours.oneAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    pool.push(r, r, r, r, r, r, r, r);
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r, r);
	                    }
	                }
	            }
	        }
	        if (room.memory.neighbours.twoAway !== undefined) {
	            for (let r of room.memory.neighbours.twoAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    pool.push(r, r, r, r, r);
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r, r);
	                    }
	                }
	            }
	        }
	        if (room.memory.neighbours.threeAway !== undefined) {
	            for (let r of room.memory.neighbours.threeAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    pool.push(r, r, r);
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r, r);
	                    }
	                }
	            }
	        }
	        if (room.memory.neighbours.fourAway !== undefined) {
	            for (let r of room.memory.neighbours.fourAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    pool.push(r);
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r, r);
	                    }
	                }
	            }
	        }
	        if (room.memory.neighbours.fiveAway !== undefined) {
	            for (let r of room.memory.neighbours.fiveAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r, r);
	                    }
	                }
	            }
	        }
	        if (room.memory.neighbours.sixAway !== undefined) {
	            for (let r of room.memory.neighbours.sixAway) {
	                if (IntelLib.isOccupied(r) && !IntelLib.isInsafeMode(r)) {
	                    if (IntelLib.isOwned(r)) {
	                        pool.push(r);
	                    }
	                }
	            }
	        }
	        let chosen = pool[(_.random(0, pool.length - 1))];
	        return chosen;
	    }
	    findHarassType(room, target) {
	        let pool = [];
	        if (IntelLib.isOwned(target)) {
	            if (IntelLib.towerCount(target) === 0) {
	                pool.push(harasstype_1.HarassType.Harasser);
	            }
	            else {
	                if (HarassLib.canSendT3BoostedWreckerTeam(room, target)) {
	                    pool.push(harasstype_1.HarassType.T3BoostedWreckerTeam);
	                }
	                if (HarassLib.canSendT2BoostedWreckerTeam(room, target)) {
	                    pool.push(harasstype_1.HarassType.T2BoostedWreckerTeam);
	                }
	                if (HarassLib.canSendT1BoostedWreckerTeam(room, target)) {
	                    pool.push(harasstype_1.HarassType.T1BoostedWreckerTeam);
	                }
	                if (pool.length === 0) {
	                    pool.push(harasstype_1.HarassType.Drainer);
	                }
	            }
	        }
	        else {
	            pool.push(harasstype_1.HarassType.Harasser);
	        }
	        let chosen = pool[(_.random(0, pool.length - 1))];
	        return chosen;
	    }
	}
	exports.HarassManager = HarassManager;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const IntelLib = __webpack_require__(5);
	function canSendT3BoostedWreckerTeam(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
	        return false;
	    }
	    if (room.controller.level < 6) {
	        return false;
	    }
	    else if (room.controller.level < targetLevel) {
	        return false;
	    }
	    let needed = {};
	    needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 16;
	    needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 8;
	    needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 10;
	    needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 14;
	    needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 2;
	    if (targetLevel === 7) {
	        needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 24;
	        needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 16;
	        needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 16;
	        needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 20;
	        needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 4;
	    }
	    else if (targetLevel === 8) {
	        needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 32;
	        needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 24;
	        needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 20;
	        needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 20;
	        needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 4;
	    }
	    for (let min of Object.keys(needed)) {
	        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.canSendT3BoostedWreckerTeam = canSendT3BoostedWreckerTeam;
	function canSendT2BoostedWreckerTeam(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
	        return false;
	    }
	    if (room.controller.level < 6) {
	        return false;
	    }
	    else if (targetLevel > 7) {
	        return false;
	    }
	    else if (targetLevel > 6 && room.controller.level < 8) {
	        return false;
	    }
	    else if (targetLevel > 4 && room.controller.level < 7) {
	        return false;
	    }
	    let needed = {};
	    if (targetLevel < 5) {
	        needed[RESOURCE_GHODIUM_ALKALIDE] = 16;
	        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 8;
	        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 13;
	        needed[RESOURCE_ZYNTHIUM_ACID] = 13;
	        needed[RESOURCE_KEANIUM_ALKALIDE] = 2;
	    }
	    else if (targetLevel < 7) {
	        needed[RESOURCE_GHODIUM_ALKALIDE] = 24;
	        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 18;
	        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 20;
	        needed[RESOURCE_ZYNTHIUM_ACID] = 15;
	        needed[RESOURCE_KEANIUM_ALKALIDE] = 3;
	    }
	    else if (targetLevel === 7) {
	        needed[RESOURCE_GHODIUM_ALKALIDE] = 24;
	        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 24;
	        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 24;
	        needed[RESOURCE_ZYNTHIUM_ACID] = 20;
	        needed[RESOURCE_KEANIUM_ALKALIDE] = 4;
	    }
	    for (let min of Object.keys(needed)) {
	        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.canSendT2BoostedWreckerTeam = canSendT2BoostedWreckerTeam;
	function canSendT1BoostedWreckerTeam(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
	        return false;
	    }
	    if (room.controller.level < 7) {
	        return false;
	    }
	    else if (targetLevel > 4) {
	        return false;
	    }
	    let needed = {};
	    needed[RESOURCE_GHODIUM_OXIDE] = 20;
	    needed[RESOURCE_LEMERGIUM_OXIDE] = 18;
	    needed[RESOURCE_ZYNTHIUM_OXIDE] = 30;
	    needed[RESOURCE_ZYNTHIUM_HYDRIDE] = 16;
	    needed[RESOURCE_KEANIUM_OXIDE] = 6;
	    for (let min of Object.keys(needed)) {
	        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
	            return false;
	        }
	    }
	    return true;
	}
	exports.canSendT1BoostedWreckerTeam = canSendT1BoostedWreckerTeam;
	function terminalHasMinsForBoost(room, min, count) {
	    if (room.terminal === undefined || room.terminal.store[min] === undefined) {
	        return false;
	    }
	    return room.terminal.store[min] >= (30 * count);
	}
	exports.terminalHasMinsForBoost = terminalHasMinsForBoost;
	function getT3BoostedWreckerTeamTierForRoom(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
	        return undefined;
	    }
	    if (room.controller.level < 6) {
	        return undefined;
	    }
	    if (room.controller.level < targetLevel) {
	        return undefined;
	    }
	    if (targetLevel === 8) {
	        return 3;
	    }
	    else if (targetLevel === 7) {
	        return 2;
	    }
	    else {
	        return 1;
	    }
	}
	exports.getT3BoostedWreckerTeamTierForRoom = getT3BoostedWreckerTeamTierForRoom;
	function getT2BoostedWreckerTeamTierForRoom(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
	        return undefined;
	    }
	    if (room.controller.level < 6) {
	        return undefined;
	    }
	    if (room.controller.level < targetLevel) {
	        return undefined;
	    }
	    if (targetLevel === 8) {
	        return undefined;
	    }
	    if (targetLevel === 7 && room.controller.level === 8) {
	        return 3;
	    }
	    else if (targetLevel > 4 && room.controller.level > 6) {
	        return 2;
	    }
	    else {
	        return 1;
	    }
	}
	exports.getT2BoostedWreckerTeamTierForRoom = getT2BoostedWreckerTeamTierForRoom;
	function getT1BoostedWreckerTeamTierForRoom(room, target) {
	    let targetLevel = IntelLib.roomLevel(target);
	    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
	        return undefined;
	    }
	    if (room.controller.level < 7) {
	        return undefined;
	    }
	    if (targetLevel > 4) {
	        return undefined;
	    }
	    return 1;
	}
	exports.getT1BoostedWreckerTeamTierForRoom = getT1BoostedWreckerTeamTierForRoom;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

	"use strict";
	(function (HarassType) {
	    HarassType[HarassType["T3BoostedWreckerTeam"] = 0] = "T3BoostedWreckerTeam";
	    HarassType[HarassType["T2BoostedWreckerTeam"] = 1] = "T2BoostedWreckerTeam";
	    HarassType[HarassType["T1BoostedWreckerTeam"] = 2] = "T1BoostedWreckerTeam";
	    HarassType[HarassType["Harasser"] = 3] = "Harasser";
	    HarassType[HarassType["Wrecker"] = 4] = "Wrecker";
	    HarassType[HarassType["Drainer"] = 5] = "Drainer";
	})(exports.HarassType || (exports.HarassType = {}));
	var HarassType = exports.HarassType;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const role_1 = __webpack_require__(16);
	class CreepService {
	    constructor() {
	        this.creepDictionary = this.makeDictionary();
	    }
	    getAllOfRole(role) {
	        if (this.creepDictionary[role] !== undefined) {
	            return this.creepDictionary[role];
	        }
	        return [];
	    }
	    creepShouldRun(creep) {
	        if (creep.memory.homeroom === undefined) {
	            creep.memory.homeroom = creep.room.name;
	        }
	        if (creep.spawning) {
	            return false;
	        }
	        if (creep.memory.boost !== undefined) {
	            creep.disable();
	            if (creep.room.memory.boostTarget === undefined) {
	                creep.room.memory.boostTarget = creep.id;
	            }
	            return false;
	        }
	        if (creep.isDisabled()) {
	            return false;
	        }
	        return true;
	    }
	    runCreeps(role, func) {
	        for (let creep of this.getAllOfRole(role)) {
	            if (this.creepShouldRun(creep)) {
	                this.logUsedCpu(func, role_1.Role[creep.memory.role], creep);
	            }
	        }
	    }
	    getNumberOfTiers(role = null, target = null, homeroom = null) {
	        if (role !== null) {
	            if (this.creepDictionary[role] === undefined) {
	                return 0;
	            }
	            let count = 0;
	            for (let creep of this.creepDictionary[role]) {
	                if ((target === null || creep.memory.target === target) &&
	                    (homeroom === null || creep.memory.homeroom === homeroom)) {
	                    if (creep.memory.tier) {
	                        count += creep.memory.tier;
	                    }
	                    else {
	                        count++;
	                    }
	                }
	            }
	            return count;
	        }
	        else {
	            let count = 0;
	            for (let creepName in Game.creeps) {
	                let creep = Game.creeps[creepName];
	                if ((target === null || creep.memory.target === target) &&
	                    (homeroom === null || creep.memory.homeroom === homeroom) &&
	                    (role === null || creep.memory.role === role)) {
	                    if (creep.memory.tier) {
	                        count += creep.memory.tier;
	                    }
	                    else {
	                        count++;
	                    }
	                }
	            }
	            return count;
	        }
	    }
	    getCreeps(role = null, target = null, homeroom = null) {
	        let creeps = [];
	        if (role !== null) {
	            if (this.creepDictionary[role] === undefined) {
	                return creeps;
	            }
	            for (let creep of this.creepDictionary[role]) {
	                if ((target === null || creep.memory.target === target) &&
	                    (homeroom === null || creep.memory.homeroom === homeroom)) {
	                    creeps.push(creep);
	                }
	            }
	            return creeps;
	        }
	        else {
	            for (let creepName in Game.creeps) {
	                let creep = Game.creeps[creepName];
	                if ((target === null || creep.memory.target === target) &&
	                    (homeroom === null || creep.memory.homeroom === homeroom) &&
	                    (role === null || creep.memory.role === role)) {
	                    creeps.push(creep);
	                }
	            }
	            return creeps;
	        }
	    }
	    getIdleEnergyHaulers(homeroom = null) {
	        let list = [];
	        if (this.creepDictionary[role_1.Role.EnergyHauler] === undefined) {
	            return list;
	        }
	        for (let creep of this.creepDictionary[role_1.Role.EnergyHauler]) {
	            let state = creep.getState();
	            if ((creep.memory.homeroom === homeroom) &&
	                (state === 1 || state === undefined)) {
	                list.push(creep);
	            }
	        }
	        return list;
	    }
	    makeDictionary() {
	        let creeps = {};
	        creeps[role_1.Role.UpgraderWithBoost] = [];
	        creeps[role_1.Role.UpgraderWithoutBoost] = [];
	        creeps[role_1.Role.PraiserWithBoost] = [];
	        creeps[role_1.Role.PraiserWithoutBoost] = [];
	        for (let name in Game.creeps) {
	            let creep = Game.creeps[name];
	            if (creep.memory.role === undefined) {
	                console.log("Creep with unknown role: " + creep.name + " Pos: " + creep.pos);
	                continue;
	            }
	            if (creeps[creep.memory.role] === undefined) {
	                creeps[creep.memory.role] = [];
	            }
	            creeps[creep.memory.role].push(creep);
	            if (creep.memory.role === role_1.Role.Upgrader) {
	                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                    creeps[role_1.Role.UpgraderWithBoost].push(creep);
	                }
	                else {
	                    creeps[role_1.Role.UpgraderWithoutBoost].push(creep);
	                }
	            }
	            else if (creep.memory.role === role_1.Role.Praiser) {
	                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
	                    creeps[role_1.Role.PraiserWithBoost].push(creep);
	                }
	                else {
	                    creeps[role_1.Role.PraiserWithoutBoost].push(creep);
	                }
	            }
	        }
	        return creeps;
	    }
	    logUsedCpu(func, name, ...args) {
	        let cpuUsed = Game.cpu.getUsed();
	        let result = func(...args);
	        let usedCpu = Game.cpu.getUsed() - cpuUsed;
	        if (Memory.stats['cpu.role.' + name + ".used"] === undefined) {
	            Memory.stats['cpu.role.' + name + ".used"] = usedCpu;
	        }
	        else {
	            Memory.stats['cpu.role.' + name + ".used"] += usedCpu;
	        }
	        if (Memory.stats['cpu.role.' + name + ".count"] === undefined) {
	            Memory.stats['cpu.role.' + name + ".count"] = 1;
	        }
	        else {
	            Memory.stats['cpu.role.' + name + ".count"] += 1;
	        }
	        if (args[0] !== undefined && args[0].memory.homeroom !== undefined && Memory.stats['room.' + args[0].memory.homeroom + '.creepCpu'] !== undefined) {
	            Memory.stats['room.' + args[0].memory.homeroom + '.creepCpu'] += usedCpu;
	        }
	        return result;
	    }
	}
	exports.CreepService = CreepService;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const roomtype_1 = __webpack_require__(9);
	class RoomService {
	    constructor() {
	        this.roomDictionary = this.makeDictionary();
	    }
	    getAllOfType(role) {
	        if (this.roomDictionary[role] !== undefined) {
	            return this.roomDictionary[role];
	        }
	        return [];
	    }
	    getMyRooms() {
	        if (this.roomDictionary[roomtype_1.Roomtype.My] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.My];
	        }
	        return [];
	    }
	    getNormalRooms() {
	        if (this.roomDictionary[roomtype_1.Roomtype.Normal] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.Normal];
	        }
	        return [];
	    }
	    getNormalRoomsNotAbandoned() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalNotAbandoned] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalNotAbandoned];
	        }
	        return [];
	    }
	    getRoomsBeingAbandoned() {
	        if (this.roomDictionary[roomtype_1.Roomtype.BeingAbandoned] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.BeingAbandoned];
	        }
	        return [];
	    }
	    getPraiseRooms() {
	        if (this.roomDictionary[roomtype_1.Roomtype.Praiseroom] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.Praiseroom];
	        }
	        return [];
	    }
	    getNormalAndNotExpansion() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalAndNotExpansion] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalAndNotExpansion];
	        }
	        return [];
	    }
	    getNormalWithExpansion() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithExpansion] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalWithExpansion];
	        }
	        return [];
	    }
	    getNormalUnderSiege() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalUnderSiege] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalUnderSiege];
	        }
	        return [];
	    }
	    getNormalWithPraiseroom() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithPraiseroom] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalWithPraiseroom];
	        }
	        return [];
	    }
	    getNormalWithDismantleTarget() {
	        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithDismantleTarget] !== undefined) {
	            return this.roomDictionary[roomtype_1.Roomtype.NormalWithDismantleTarget];
	        }
	        return [];
	    }
	    makeDictionary() {
	        let rooms = {};
	        rooms[roomtype_1.Roomtype.NormalAndNotExpansion] = [];
	        rooms[roomtype_1.Roomtype.NormalWithAcceleratedPraising] = [];
	        rooms[roomtype_1.Roomtype.NormalWithExpansion] = [];
	        rooms[roomtype_1.Roomtype.NormalWithPraiseroom] = [];
	        rooms[roomtype_1.Roomtype.NormalUnderSiege] = [];
	        rooms[roomtype_1.Roomtype.NormalWithDismantleTarget] = [];
	        rooms[roomtype_1.Roomtype.Expanion] = [];
	        rooms[roomtype_1.Roomtype.My] = [];
	        rooms[roomtype_1.Roomtype.BeingAbandoned] = [];
	        rooms[roomtype_1.Roomtype.NormalNotAbandoned] = [];
	        for (let roomName in Game.rooms) {
	            let room = Game.rooms[roomName];
	            if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	                continue;
	            }
	            if (room.memory.t === undefined) {
	                console.log("Room with unknown type: " + room.name + ". Assuming it is a metropolis.");
	                room.memory.t = roomtype_1.Roomtype.Normal;
	            }
	            if (rooms[room.memory.t] === undefined) {
	                rooms[room.memory.t] = [];
	            }
	            rooms[room.memory.t].push(room);
	            rooms[roomtype_1.Roomtype.My].push(room);
	            if (room.isExpansion()) {
	                rooms[roomtype_1.Roomtype.Expanion].push(room);
	            }
	            if (!room.isExpansion() && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalAndNotExpansion].push(room);
	            }
	            if (room.memory.praiseBoost && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalWithAcceleratedPraising].push(room);
	            }
	            if (room.memory.expansion !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalWithExpansion].push(room);
	            }
	            if (room.memory.dismantleTargetRoom !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalWithDismantleTarget].push(room);
	            }
	            if (room.memory.praiseroom !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalWithPraiseroom].push(room);
	            }
	            if (room.memory.isBeingDismantled === true) {
	                rooms[roomtype_1.Roomtype.BeingAbandoned].push(room);
	            }
	            if (room.isUnderSiege()) {
	                rooms[roomtype_1.Roomtype.NormalUnderSiege].push(room);
	            }
	            if (room.memory.isBeingDismantled !== true && room.memory.t === roomtype_1.Roomtype.Normal) {
	                rooms[roomtype_1.Roomtype.NormalNotAbandoned].push(room);
	            }
	        }
	        return rooms;
	    }
	}
	exports.RoomService = RoomService;


/***/ }),
/* 139 */
/***/ (function(module, exports) {

	"use strict";
	function recordStats(rooms) {
	    if (Memory.stats == undefined) {
	        Memory.stats = {};
	    }
	    Memory.stats['memorysize'] = RawMemory.get().length;
	    Memory.stats['power.stored'] = 0;
	    Memory.stats['power.processed'] = 0;
	    Memory.stats['energy.stored'] = 0;
	    Memory.stats['energy.thisturn'] = 0;
	    Memory.stats['energy.walls'] = 0;
	    Memory.stats['gcl.thisturn'] = 0;
	    Memory.stats['labs.active'] = 0;
	    const basicMinerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];
	    const boostMinerals = [RESOURCE_CATALYZED_GHODIUM_ACID, RESOURCE_CATALYZED_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_KEANIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
	        RESOURCE_CATALYZED_LEMERGIUM_ACID, RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, RESOURCE_CATALYZED_UTRIUM_ACID, RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
	        RESOURCE_CATALYZED_ZYNTHIUM_ACID, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE, RESOURCE_GHODIUM, RESOURCE_LEMERGIUM_HYDRIDE,
	        RESOURCE_UTRIUM_HYDRIDE, RESOURCE_KEANIUM_OXIDE, RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_LEMERGIUM_OXIDE, RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_GHODIUM_OXIDE,
	        RESOURCE_UTRIUM_ACID, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ACID, RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_GHODIUM_ALKALIDE];
	    for (let m of basicMinerals) {
	        Memory.stats['minerals.' + m] = 0;
	    }
	    for (let m of boostMinerals) {
	        Memory.stats['boostminerals.' + m] = 0;
	    }
	    for (let room of rooms) {
	        var isMyRoom = (room.controller ? room.controller.my : 0);
	        if (isMyRoom && room.controller !== undefined) {
	            Memory.stats['room.' + room.name + '.myRoom'] = 1;
	            Memory.stats['room.' + room.name + '.level'] = (room.controller ? room.controller.level : 0);
	            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
	            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
	            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
	            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;
	            if (room.controller.level < 8) {
	                Memory.stats['room.' + room.name + '.rclProgress'] = Math.floor(100 * (room.controller.progress / room.controller.progressTotal)) / 100;
	            }
	            if (room.memory.lab !== undefined && room.memory.lab.labstatus !== undefined && room.memory.lab.labstatus > 0) {
	                Memory.stats['labs.active'] += 1;
	            }
	            if (room.memory.orders !== undefined) {
	                Memory.stats['room.' + room.name + '.orders'] = room.memory.orders.length;
	            }
	            else {
	                Memory.stats['room.' + room.name + '.orders'] = 0;
	            }
	            let spawns = room.getSpawns();
	            let spawning = 0;
	            for (let spawn of spawns) {
	                if (spawn.spawning) {
	                    spawning++;
	                }
	            }
	            Memory.stats['room.' + room.name + '.spawning'] = spawning;
	            var storedEnergy = 0;
	            if (room.storage) {
	                Memory.stats['energy.stored'] += room.storage.store[RESOURCE_ENERGY];
	                storedEnergy = room.storage.store[RESOURCE_ENERGY];
	                for (let m of basicMinerals) {
	                    if (room.storage.store[m] !== undefined && room.storage.store[m] > 0)
	                        Memory.stats['minerals.' + m] += room.storage.store[m];
	                }
	                for (let m of boostMinerals) {
	                    if (room.storage.store[m] !== undefined && room.storage.store[m] > 0)
	                        Memory.stats['boostminerals.' + m] += room.storage.store[m];
	                }
	            }
	            if (room.terminal) {
	                Memory.stats['energy.stored'] += room.terminal.store[RESOURCE_ENERGY];
	                storedEnergy += room.terminal.store[RESOURCE_ENERGY];
	                for (let m of basicMinerals) {
	                    if (room.terminal.store[m] !== undefined && room.terminal.store[m] > 0)
	                        Memory.stats['minerals.' + m] += room.terminal.store[m];
	                }
	                for (let m of boostMinerals) {
	                    if (room.terminal.store[m] !== undefined && room.terminal.store[m] > 0)
	                        Memory.stats['boostminerals.' + m] += room.terminal.store[m];
	                }
	            }
	            Memory.stats['room.' + room.name + '.storedEnergy'] = storedEnergy;
	            Memory.stats['room.' + room.name + '.power'] = 0;
	            if (room.storage !== undefined && room.storage.store[RESOURCE_POWER] > 0) {
	                Memory.stats['room.' + room.name + '.power'] += room.storage.store[RESOURCE_POWER];
	                Memory.stats['power.stored'] += room.storage.store[RESOURCE_POWER];
	            }
	            if (room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] > 0) {
	                Memory.stats['room.' + room.name + '.power'] += room.terminal.store[RESOURCE_POWER];
	                Memory.stats['power.stored'] += room.terminal.store[RESOURCE_POWER];
	            }
	            let ps = room.getPowerSpawn();
	            if (ps !== undefined && ps.energy >= 50 && ps.power > 0) {
	                Memory.stats['power.processed']++;
	            }
	            if (Memory.stats['room.' + room.name + '.energyUpgraded'] > 0) {
	                Memory.stats['gcl.thisturn'] += Memory.stats['room.' + room.name + '.energyUpgraded'];
	            }
	            if (Memory.stats['room.' + room.name + '.energyHarvested'] > 0) {
	                Memory.stats['energy.thisturn'] += Memory.stats['room.' + room.name + '.energyHarvested'];
	            }
	            Memory.stats['room.' + room.name + '.outerWallMin'] = room.memory.lowestWall;
	            Memory.stats['room.' + room.name + '.fortressMin'] = room.memory.lowestFortress;
	            if (Memory.stats['room.' + room.name + '.wallsRepaired'] !== undefined) {
	                Memory.stats['energy.walls'] += Memory.stats['room.' + room.name + '.wallsRepaired'];
	            }
	        }
	        else {
	            Memory.stats['room.' + room.name + '.myRoom'] = undefined;
	        }
	    }
	    Memory.stats['gcl.progress'] = Game.gcl.progress;
	    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
	    Memory.stats['gcl.level'] = Game.gcl.level;
	    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
	    Memory.stats['cpu.limit'] = Game.cpu.limit;
	    Memory.stats['credits.wallet'] = Game.market.credits;
	    Memory.stats['cpu.creepcount'] = Object.keys(Game.creeps).length;
	    for (let resourceType of Object.keys(Memory.marketSell)) {
	        Memory.stats['resource.' + resourceType + ".sell"] = Memory.marketSell[resourceType];
	    }
	    for (let resourceType of Object.keys(Memory.marketBuy)) {
	        Memory.stats['resource.' + resourceType + ".buy"] = Memory.marketBuy[resourceType];
	    }
	    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
	}
	exports.recordStats = recordStats;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomRepository = __webpack_require__(10);
	function setOutpostRoads(index, outpostRoads) {
	    RawMemory.segments[index + 50] = JSON.stringify(outpostRoads);
	}
	exports.setOutpostRoads = setOutpostRoads;
	function requestRoadinfo(room) {
	    let roomindex = RoomRepository.getIndex(room);
	    RawMemory.setActiveSegments([roomindex + 50]);
	}
	exports.requestRoadinfo = requestRoadinfo;
	function getOutpostRoads(index) {
	    if (RawMemory.segments[index + 50] !== undefined && !_.isNull(RawMemory.segments[index + 50]) && RawMemory.segments[index + 50] !== "") {
	        let roadinfo = JSON.parse(RawMemory.segments[index + 50]);
	        return roadinfo;
	    }
	    console.log("Roadinfo " + RoomRepository.getRoomForIndex(parseInt(index)) + ": Not found or not loaded");
	    return [];
	}
	exports.getOutpostRoads = getOutpostRoads;
	function getOutpostRoadsForSegment(segment) {
	    if (RawMemory.segments[segment] !== undefined && !_.isNull(RawMemory.segments[segment]) && RawMemory.segments[segment] !== "") {
	        let roadinfo = JSON.parse(RawMemory.segments[segment]);
	        return roadinfo;
	    }
	    console.log("Roadinfo in segment" + segment + ": Not found or not loaded");
	    return undefined;
	}
	exports.getOutpostRoadsForSegment = getOutpostRoadsForSegment;
	function saveStats() {
	    RawMemory.segments[1] = JSON.stringify(Memory.stats);
	}
	exports.saveStats = saveStats;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const RoomUtilities = __webpack_require__(36);
	const CommandLib = __webpack_require__(111);
	const OperationHaul = __webpack_require__(67);
	const OperationDrain = __webpack_require__(92);
	const role_1 = __webpack_require__(16);
	const operationtypes_1 = __webpack_require__(15);
	const roomtype_1 = __webpack_require__(9);
	const Logger_1 = __webpack_require__(7);
	const successColor = "green";
	const errorColor = "red";
	class Command {
	    initCommands() {
	        global.help = this.help;
	        global.addOutpost = this.addOutpost;
	        global.addExpansion = this.addExpansion;
	        global.poachingreport = this.poachingreport;
	        global.mineralreport = this.mineralreport;
	        global.portalreport = this.portalreport;
	        global.abandonRoom = this.abandonRoom;
	        global.dismantleOutpost = this.dismantleOutpost;
	        global.orderWreckerTeam = this.orderWreckerTeam;
	        global.orderWreckers = this.orderWreckers;
	        global.orderDrainer = this.orderDrainer;
	        global.orderPaladin = this.orderPaladin;
	        global.orderTagger = this.orderTagger;
	        global.orderDeclarer = this.orderDeclarer;
	        global.listFriends = this.listFriends;
	        global.addFriend = this.addFriend;
	        global.removeFriend = this.removeFriend;
	        global.setLogLevel = this.setLogLevel;
	        global.removeOutpost = this.removeOutpost;
	        global.removeExpansion = this.removeExpansion;
	        global.addDrainOperation = this.addDrainOperation;
	        global.addHaulOperation = this.addHaulOperation;
	    }
	    help() {
	        return "<strong> - - Commands - - </strong><br/>" +
	            " setLogLevel(lvl) - Sets log level 1-5, 1 is alert, 5 is debug.<br/>" +
	            " listFriends() - Lists users tagged as friendly.<br/>" +
	            " addFriend(username) - Adds user to friendly-list.<br/>" +
	            " removeFriend(username) - Removes user from friendly-list.<br/>" +
	            " <br/>" +
	            " orderDrainer(roomName, tier, route...) - Orders a Drainer for target room. (Tier 1-3 for 1-3 towers) Route can be multiple rooms.<br/>" +
	            " orderPaladin(roomName, route...) - Orders a Paladin for target room. Route can be multiple rooms.<br/>" +
	            " orderWreckerTeam(roomName: string, tier: number, boosted: boolean, route: string[], ... targets: string[])<br/>" +
	            " orderWreckers(roomName, count, route...) - Orders Wreckers (1-5) for target room. Route can be multiple rooms.<br/>" +
	            " orderTagger(roomName, targetRoom) - Orders a tagger that builds walls according to flags.<br/>" +
	            " orderDeclarer(roomName, route...) - Orders a declarer that signs controller in the route.<br/>" +
	            " <br/>" +
	            " addOutpost(roomName, outpost) - Adds outpost to a room.<br/>" +
	            " removeOutpost(roomName, outpost) - Remove outpost from a room.<br/>" +
	            " addExpansion(roomName, expansion, route...) - Adds expansion to a room.<br/>" +
	            " removeExpansion(roomName, expansion) - Remove expansion from a room.<br/>" +
	            " abandonRoom(roomName, destroyStructures?, saveEnergyBuildings?) - Starts abandoning the room. Send in true to remove all structures, default is false.<br/>" +
	            " dismantleOutpost(roomName, outpost) - Captures room without building it, to clear buildings.<br/>" +
	            " <br/>" +
	            " mineralreport() - Report of minerals currently controlled.<br/>" +
	            " poachingreport() - Report of minerals currently being poached.<br/>" +
	            " portalreport() - Report of portals going out from my sectors.<br/>" +
	            " <br/>" +
	            " addHaulOperation(from: string, to: string, energyPerTick: number, endlevel: number) <br/>" +
	            " addDrainOperation(spawnRoom: string, targetRoom: string, targetRoute: string[], tier: number)<br/>";
	    }
	    setLogLevel(lvl) {
	        let start = "Adjusting log-level <br/>";
	        if (lvl < 1 || lvl > 5) {
	            return start + "<span style='color:" + errorColor + ";'>Log level \"" + lvl + "\" is not valid, need to be between 1 and 5.</span>";
	        }
	        Logger_1.log.setLogLevel(lvl);
	        return start + "<span style='color:" + successColor + ";'>Log level successfully set to " + lvl + ".</span>";
	    }
	    listFriends() {
	        if (Memory.friendly === undefined) {
	            Memory.friendly = [];
	        }
	        let start = "Showing list users counted of friends. <br/>";
	        if (Memory.friendly.length > 0) {
	            return start + "<span style='color:" + successColor + ";'>List of friends: " + JSON.stringify(Memory.friendly) + "</span>";
	        }
	        else {
	            return start + "<span style='color:" + successColor + ";'>List of friends is empty.</span>";
	        }
	    }
	    addFriend(name) {
	        if (Memory.friendly === undefined) {
	            Memory.friendly = [];
	        }
	        let start = "Adding user \"" + name + "\" to friendlies-list. <br/>";
	        if (_.indexOf(Memory.friendly, name) > -1) {
	            return start + "<span style='color:" + errorColor + ";'>User \"" + name + "\" is already on friendlies-list.</span>";
	        }
	        Memory.friendly.push(name);
	        return start + "<span style='color:" + successColor + ";'>User \"" + name + "\" added to friendlies-list.</span>";
	    }
	    removeFriend(name) {
	        if (Memory.friendly === undefined) {
	            Memory.friendly = [];
	        }
	        let start = "Removing user \"" + name + "\" to friendlies-list. <br/>";
	        let removed = _.pull(Memory.friendly, name);
	        if (removed.length > 0) {
	            return start + "<span style='color:" + successColor + ";'>User \"" + name + "\" removed from friendlies-list.</span>";
	        }
	        else {
	            return start + "<span style='color:" + errorColor + ";'>User \"" + name + "\" was not found in friendlies-list.</span>";
	        }
	    }
	    abandonRoom(roomName, destroyStructures, saveEnergyBuildings) {
	        let start = roomName + ": Abandoning room, sending out resources. <br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        room.memory.isBeingDismantled = true;
	        if (destroyStructures === true) {
	            if (saveEnergyBuildings === true) {
	                room.memory.isBeingDismantledEverythingExceptEnergy = true;
	            }
	            else {
	                room.memory.isBeingDismantledEverything = true;
	            }
	            return start + "<span style='color:" + successColor + ";'>Room successfully marked as abandoned, and buildings removed.</span>";
	        }
	        else {
	            return start + "<span style='color:" + successColor + ";'>Room successfully marked as abandoned.</span>";
	        }
	    }
	    orderPaladin(roomName, ...route) {
	        let start = roomName + ": Ordering Paladin for rooms " + JSON.stringify(route) + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (route.length < 1) {
	            return start + "<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
	        }
	        for (let target of route) {
	            let distance = Game.map.getRoomLinearDistance(roomName, target);
	            if (!(distance < 21)) {
	                return start + "<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
	            }
	        }
	        let orderPaladin = new CommandLib.CommandOrder();
	        orderPaladin.room = roomName;
	        orderPaladin.role = role_1.Role.Paladin;
	        orderPaladin.route = route;
	        CommandLib.addCommandOrder(orderPaladin);
	        return start + "Room " + roomName + " is preparing a Paladin to attack: " + JSON.stringify(route) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
	    }
	    orderDrainer(roomName, tier, ...route) {
	        let start = roomName + ": Ordering Drainer for rooms " + JSON.stringify(route) + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (route.length < 1) {
	            return start + "<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
	        }
	        for (let target of route) {
	            let distance = Game.map.getRoomLinearDistance(roomName, target);
	            if (!(distance < 21)) {
	                return start + "<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
	            }
	        }
	        if (tier > 8 || tier < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Invalid tier for drainer: " + tier + ".</span>";
	        }
	        let drainerOrder = new CommandLib.CommandOrder();
	        drainerOrder.room = roomName;
	        drainerOrder.tier = tier;
	        drainerOrder.role = role_1.Role.Drainer;
	        drainerOrder.route = route;
	        CommandLib.addCommandOrder(drainerOrder);
	        return start + "Room " + roomName + " is preparing a Drainer to drain: " + JSON.stringify(route) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
	    }
	    orderDeclarer(roomName, ...route) {
	        let start = roomName + ": Ordering Delcarer for room " + JSON.stringify(route) + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        for (let target of route) {
	            let distance = Game.map.getRoomLinearDistance(roomName, target);
	            if (!(distance < 26)) {
	                return start + "<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 25).</span>";
	            }
	        }
	        if (Memory.rooms[route[route.length - 1]] === undefined) {
	            Memory.rooms[route[route.length - 1]] = {};
	        }
	        Memory.rooms[route[route.length - 1]].t = roomtype_1.Roomtype.Decoration;
	        let taggerOrder = new CommandLib.CommandOrder();
	        taggerOrder.room = roomName;
	        taggerOrder.role = role_1.Role.Declarer;
	        taggerOrder.route = route;
	        CommandLib.addCommandOrder(taggerOrder);
	        return start + "Room " + roomName + " is preparing a Declarer to tag: " + JSON.stringify(route) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Declaring of ownership successfully initialized.</span>";
	    }
	    orderTagger(roomName, targetRoom) {
	        let start = roomName + ": Ordering Tagger for room " + targetRoom + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        let distance = Game.map.getRoomLinearDistance(roomName, targetRoom);
	        if (!(distance < 21)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + targetRoom + " is not found, or the distance is too far (more than 20).</span>";
	        }
	        let taggerOrder = new CommandLib.CommandOrder();
	        taggerOrder.room = roomName;
	        taggerOrder.role = role_1.Role.Tagger;
	        taggerOrder.target = targetRoom;
	        CommandLib.addCommandOrder(taggerOrder);
	        return start + "Room " + roomName + " is preparing a Tagger to tag: " + targetRoom + "<br/>" +
	            "<span style='color:" + successColor + ";'>Tagging successfully initialized.</span>";
	    }
	    orderWreckerTeam(roomName, tier, boosted, route, ...targets) {
	        let start = roomName + ": Ordering WreckingTeam for rooms " + JSON.stringify(targets) + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (targets.length < 1) {
	            return start + "<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
	        }
	        if (tier < 1 || tier > 3) {
	            return start + "<span style='color:" + errorColor + ";'>The tier for a WreckingTeam has to be between 1 and 3.</span>";
	        }
	        if (boosted !== true && boosted !== false) {
	            return start + "<span style='color:" + errorColor + ";'>You need to specify if the team should be boosted.</span>";
	        }
	        let wreckerOrder = new CommandLib.CommandOrder();
	        wreckerOrder.room = roomName;
	        wreckerOrder.tier = tier;
	        wreckerOrder.role = role_1.Role.TeamWrecker;
	        wreckerOrder.targets = targets;
	        wreckerOrder.route = route;
	        wreckerOrder.boosted = boosted;
	        CommandLib.addCommandOrder(wreckerOrder);
	        return start + "Room " + roomName + " is preparing a WreckerTeam to attack: " + JSON.stringify(targets) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
	    }
	    orderWreckers(roomName, count, ...route) {
	        let start = roomName + ": Ordering " + count + " Wreckers for rooms " + JSON.stringify(route) + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (route.length < 1) {
	            return start + "<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
	        }
	        if (count < 1 || count > 6) {
	            return start + "<span style='color:" + errorColor + ";'>The limit of ordering Wreckers are 1 to 5.</span>";
	        }
	        for (let target of route) {
	            let distance = Game.map.getRoomLinearDistance(roomName, target);
	            if (!(distance < 21)) {
	                return start + "<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
	            }
	        }
	        let wreckerOrder = new CommandLib.CommandOrder();
	        wreckerOrder.room = roomName;
	        wreckerOrder.tier = 0;
	        wreckerOrder.role = role_1.Role.Wrecker;
	        wreckerOrder.route = route;
	        for (let i = 0; i < count; i++) {
	            CommandLib.addCommandOrder(wreckerOrder);
	        }
	        return start + "Room " + roomName + " is preparing " + count + " wreckers to attack: " + JSON.stringify(route) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
	    }
	    dismantleOutpost(roomName, outpost) {
	        let start = roomName + ": Dismantling outpost " + outpost + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        let distance = Game.map.getRoomLinearDistance(roomName, outpost);
	        if (!(distance < 10)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + outpost + " is not found, or the distance is too far (more than 9).</span>";
	        }
	        room.memory.dismantleTargetRoom = outpost;
	        return start + "Room will now be captured for dismantling: " + outpost + "<br/>" +
	            "<span style='color:" + successColor + ";'>Dismantling successfully ordered.</span>";
	    }
	    addOutpost(roomName, outpost) {
	        let start = roomName + ": Adding outpost " + outpost + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        let distance = Game.map.getRoomLinearDistance(roomName, outpost);
	        if (!(distance < 5)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + outpost + " is not found, or the distance is too far (more than 4).</span>";
	        }
	        if (room.memory.outposts === undefined) {
	            room.memory.outposts = [];
	        }
	        if (roomName === outpost) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " can't be it's own outpost.</span>";
	        }
	        if (_.contains(room.memory.outposts, outpost)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " already has " + outpost + " as an outpost.</span>";
	        }
	        room.memory.outposts.push(outpost);
	        return start + "Room now has these outposts: " + JSON.stringify(room.memory.outposts) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Outpost successfully added.</span>";
	    }
	    removeOutpost(roomName, outpost) {
	        let start = roomName + ": Adding outpost " + outpost + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (!_.contains(room.memory.outposts, outpost)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " does not have " + outpost + " as an outpost.</span>";
	        }
	        _.pull(room.memory.outposts, outpost);
	        return start + "Room now has these outposts: " + JSON.stringify(room.memory.outposts) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Outpost successfully removed.</span>";
	    }
	    addExpansion(roomName, expansion, ...route) {
	        let start = roomName + ": Adding expansion " + expansion + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (room.memory.expansion !== undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " already has " + expansion + " as an expansion.</span>";
	        }
	        if (route !== undefined && route.length > 0) {
	            room.memory.expansionRoute = route;
	        }
	        room.memory.expansion = expansion;
	        return start + "Room now has this expansion: " + JSON.stringify(room.memory.expansion) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Expansion successfully added.</span>";
	    }
	    removeExpansion(roomName, expansion) {
	        let start = roomName + ": Removing expansion " + expansion + "<br/>";
	        if (Game.rooms[roomName] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
	        }
	        let room = Game.rooms[roomName];
	        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
	        }
	        if (room.memory.expansion === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + roomName + " does not have " + expansion + " as an expansion.</span>";
	        }
	        room.memory.expansion = undefined;
	        room.memory.expansionRoute = undefined;
	        return start + "Room now has no expansion: " + JSON.stringify(room.memory.expansion) + "<br/>" +
	            "<span style='color:" + successColor + ";'>Expansion successfully removed.</span>";
	    }
	    poachingreport() {
	        let rooms = RoomUtilities.getAllControlledRooms();
	        let output = "Rooms currently being poached: <br/>";
	        for (let r of rooms) {
	            if (r.memory.poaching !== undefined && r.memory.poaching.length > 0) {
	                output += r.name + ": ";
	                for (let o of r.memory.poaching) {
	                    output += o + ", ";
	                }
	                output = output.slice(0, -2) + "<br/>";
	            }
	        }
	        return output;
	    }
	    mineralreport() {
	        let minerals = RoomUtilities.getMinerals();
	        let output = "Minerals currently controlled: <br/>";
	        for (let m of Object.keys(minerals)) {
	            output += minerals[m] + " " + m + " | ";
	        }
	        return output.slice(0, -2);
	    }
	    portalreport() {
	        let output = "<strong>Portals currently active</strong> <br/>";
	        if (Memory.portals === undefined || Object.keys(Memory.portals).length < 1) {
	            output += "No portals found";
	        }
	        else {
	            for (let r of Object.keys(Memory.portals)) {
	                output += "From <a href='#!/room/" + Game.shard.name + "/" + r + "'>" + r + "</a> to <a href='#!/room/" + Game.shard.name + "/" + Memory.portals[r].dest + "'>" + Memory.portals[r].dest + "</a> - Uptime: " + (Game.time - Memory.portals[r].firstSeen);
	                if (Memory.portals[r].decay !== undefined) {
	                    output += " - Only active for about " + Memory.portals[r].decay + " more ticks";
	                }
	                output += "<br/>";
	            }
	        }
	        return output;
	    }
	    roomreport(roomName) {
	        let room = Game.rooms[roomName];
	        if (room === undefined) {
	            return "Room not found";
	        }
	        if (room.controller === undefined || !room.controller.my) {
	            return "Room not controlled";
	        }
	    }
	    addHaulOperation(from, to, energyPerTick, endlevel) {
	        let start = "Initializing haul operation from " + from + " to " + to + " <br/>";
	        if (Game.rooms[from] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + from + " not found.</span>";
	        }
	        let distance = Game.map.getRoomLinearDistance(from, to);
	        if (!(distance < 15)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + to + " is not found, or the distance is too far (more than 15).</span>";
	        }
	        if (energyPerTick < 1) {
	            return start + "<span style='color:" + errorColor + ";'>Energy per tick needs to be 1 or more.</span>";
	        }
	        if (endlevel < 2 || endlevel > 8) {
	            return start + "<span style='color:" + errorColor + ";'>Level to end operation needs to be between 2 and 8.</span>";
	        }
	        let op = new OperationHaul.Data();
	        op.operationtype = operationtypes_1.OperationType.Haul;
	        op.from = from;
	        op.to = to;
	        op.amount = energyPerTick;
	        op.victoryCondition = OperationHaul.VictoryCondition.RoomLevel;
	        op.victoryValue = endlevel;
	        if (Memory.operations === undefined) {
	            Memory.operations = [];
	        }
	        Memory.operations.push(op);
	        return start + "Started haul operation from " + from + " to " + to + ", hauling " + energyPerTick + " energy per tick<br/>" +
	            "<span style='color:" + successColor + ";'>Operation successfully added.</span>";
	    }
	    addDrainOperation(spawnRoom, targetRoom, targetRoute, tier) {
	        let start = "Initializing drain operation on " + targetRoom + " using room " + targetRoom + " <br/>";
	        if (Game.rooms[spawnRoom] === undefined) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + spawnRoom + " not found.</span>";
	        }
	        let distance = Game.map.getRoomLinearDistance(spawnRoom, targetRoom);
	        if (!(distance < 15)) {
	            return start + "<span style='color:" + errorColor + ";'>Room " + targetRoom + " is not found, or the distance is too far (more than 15).</span>";
	        }
	        if (targetRoute.length < 0) {
	            return start + "<span style='color:" + errorColor + ";'>Route " + targetRoute + " invalid.</span>";
	        }
	        let op = new OperationDrain.Data();
	        op.operationtype = operationtypes_1.OperationType.Drain;
	        op.spawnRoom = spawnRoom;
	        op.targetRoom = targetRoom;
	        op.targetRoute = targetRoute;
	        op.victoryCondition = OperationDrain.VictoryCondition.HostileRoomEnergy;
	        op.tier = tier;
	        if (Memory.operations === undefined) {
	            Memory.operations = [];
	        }
	        Memory.operations.push(op);
	        return start + "Started drain operation on room: " + targetRoom + "<br/>" +
	            "<span style='color:" + successColor + ";'>Operation successfully added.</span>";
	    }
	}
	exports.Command = Command;
	exports.command = new Command();


/***/ })
/******/ ]);
