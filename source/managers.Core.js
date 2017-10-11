"use strict";
require("./prototypes.controller");
require("./prototypes.creep");
require("./prototypes.mineral");
require("./prototypes.room");
require("./prototypes.roomposition");
require("./prototypes.source");
const _Manager_1 = require("./managers._Manager");
const Memory_1 = require("./managers.Memory");
const Intel_1 = require("./managers.Intel");
const Upgrade_1 = require("./managers.Upgrade");
const Interface_1 = require("./managers.Interface");
const Logistics_1 = require("./managers.Logistics");
const Expansion_1 = require("./managers.Expansion");
const Roomlevel_1 = require("./managers.Roomlevel");
const Scouting_1 = require("./managers.Scouting");
const Outpost_1 = require("./managers.Outpost");
const Mineral_1 = require("./managers.Mineral");
const Defense_1 = require("./managers.Defense");
const Wall_1 = require("./managers.Wall");
const Boost_1 = require("./managers.Boost");
const Operation_1 = require("./managers.Operation");
const Praiseroom_1 = require("./managers.Praiseroom");
const Military_1 = require("./managers.Military");
const Market_1 = require("./managers.Market");
const Crisis_1 = require("./managers.Crisis");
const Link_1 = require("./managers.Link");
const Spawn_1 = require("./managers.Spawn");
const Hauling_1 = require("./managers.Hauling");
const Mining_1 = require("./managers.Mining");
const Power_1 = require("./managers.Power");
const Trade_1 = require("./managers.Trade");
const Build_1 = require("./managers.Build");
const Maintainence_1 = require("./managers.Maintainence");
const Road_1 = require("./managers.Road");
const Lab_1 = require("./managers.Lab");
const Poaching_1 = require("./managers.Poaching");
const Harass_1 = require("./managers.Harass");
const Creep_1 = require("./services.Creep");
const Room_1 = require("./services.Room");
const Stats = require("./utilities.Stats");
const SegmentRepository = require("./repository.Segment");
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
