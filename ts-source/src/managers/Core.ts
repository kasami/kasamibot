import "../prototypes/controller";
import "../prototypes/creep";
import "../prototypes/mineral";
import "../prototypes/room";
import "../prototypes/roomposition";
import "../prototypes/source";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {MemoryManager} from "../managers/Memory";
import {IntelManager} from "../managers/Intel";
import {UpgradeManager} from "../managers/Upgrade";
import {InterfaceManager} from "../managers/Interface";
import {LogisticsManager} from "../managers/Logistics";
import {ExpansionManager} from "../managers/Expansion";
import {RoomlevelManager} from "../managers/Roomlevel";
import {ScoutingManager} from "../managers/Scouting";
import {OutpostManager} from "../managers/Outpost";
import {MineralManager} from "../managers/Mineral";
import {DefenseManager} from "../managers/Defense";
import {WallManager} from "../managers/Wall";
import {BoostManager} from "../managers/Boost";
import {OperationManager} from "../managers/Operation";
import {PraiseroomManager} from "../managers/Praiseroom";
import {MilitaryManager} from "../managers/Military";
import {MarketManager} from "../managers/Market";
import {CrisisManager} from "../managers/Crisis";
import {LinkManager} from "../managers/Link";
import {SpawnManager} from "../managers/Spawn";
import {HaulingManager} from "../managers/Hauling";
import {MiningManager} from "../managers/Mining";
import {PowerManager} from "../managers/Power";
import {TradeManager} from "../managers/Trade";
import {BuildManager} from "../managers/Build";
import {MaintainenceManager} from "../managers/Maintainence";
import {RoadManager} from "../managers/Road";
import {LabManager} from "../managers/Lab";
import {PoachingManager} from "../managers/Poaching";
import {HarassManager} from "../managers/Harass";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as Stats from "../utilities/Stats";

import * as SegmentRepository from "../repository/Segment";


export function run() {

    logUsedCpu(() => (Memory.stats = {}), "ReadMemory", ManagerPriority.Critical);

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

    let creepService = new CreepService();
    let roomService = new RoomService();

    for (let room of roomService.getMyRooms()) {
        Memory.stats['room.' + room.name + '.energyHarvested'] = 0;
        Memory.stats['room.' + room.name + '.energyUpgraded'] = 0;
        Memory.stats['room.' + room.name + '.wallsRepaired'] = 0;
        Memory.stats['room.' + room.name + '.creepCpu'] = 0;
        Memory.stats['room.' + room.name + '.creepCost'] = 0;
    }

    let cpuLimit = getCpuLimit();
    let managerList: Manager[] = [
        new MemoryManager(),
        new IntelManager(),
        new UpgradeManager(roomService, creepService),
        new InterfaceManager(),
        new LogisticsManager(roomService, creepService),
        new ExpansionManager(roomService, creepService),
        new RoomlevelManager(roomService),
        new ScoutingManager(roomService, creepService),
        new OutpostManager(roomService, creepService),
        new MineralManager(roomService, creepService),
        new DefenseManager(roomService, creepService),
        new BoostManager(roomService, creepService),
        new OperationManager(roomService, creepService),
        new PraiseroomManager(roomService, creepService),
        new MilitaryManager(roomService, creepService),
        new MarketManager(),
        new CrisisManager(roomService, creepService),
        new LinkManager(roomService),
        new MiningManager(roomService, creepService),
        new HaulingManager(roomService, creepService),
        new PowerManager(roomService, creepService),
        new TradeManager(roomService),
        new BuildManager(roomService, creepService),
        new MaintainenceManager(roomService, creepService),
        new RoadManager(roomService),
        new LabManager(roomService),
        new WallManager(roomService, creepService),
        new PoachingManager(roomService, creepService),
        new HarassManager(roomService, creepService)
    ];
    let spawnManager = new SpawnManager(roomService);

    let lastRun: string | undefined;
    let level = ManagerPriority.Critical;

    for (let manager of managerList) {
        logUsedCpu(manager, manager.constructor.name, ManagerPriority.Critical, ManagerPriority.Critical);
        lastRun = manager.constructor.name;
    }
    for (let manager of managerList) {
        if (Game.cpu.getUsed() < cpuLimit) {
            logUsedCpu(manager, manager.constructor.name, ManagerPriority.Standard, ManagerPriority.Standard);
            lastRun = manager.constructor.name;
            level = ManagerPriority.Standard;
        }
    }

    for (let manager of managerList) {
        if (Game.cpu.getUsed() < cpuLimit) {
            logUsedCpu(manager, manager.constructor.name, ManagerPriority.Low, ManagerPriority.Low);
            lastRun = manager.constructor.name;
            level = ManagerPriority.Low;
        }
    }

    for (let manager of managerList) {
        if (Game.cpu.getUsed() < cpuLimit) {
            logUsedCpu(manager, manager.constructor.name, ManagerPriority.Trivial, ManagerPriority.Trivial);
            lastRun = manager.constructor.name;
            level = ManagerPriority.Trivial;
        }
    }

    if (Game.cpu.bucket > 9500) {
        for (let manager of managerList) {
            if (Game.cpu.getUsed() < cpuLimit) {
                logUsedCpu(manager, manager.constructor.name, ManagerPriority.Overflow, ManagerPriority.Overflow);
                lastRun = manager.constructor.name;
                level = ManagerPriority.Overflow;
            }
        }
    }
    if (Game.cpu.getUsed() < cpuLimit) {
        level = 6;
    }

    logUsedCpu(spawnManager, "SpawnManager", ManagerPriority.Critical);

    Memory.stats['cpu.level'] = level;
    if (Memory.settings.bot !== true) {
        logUsedCpu(Stats.recordStats, "Stats", ManagerPriority.Critical, roomService.getMyRooms());
        SegmentRepository.saveStats();
    }

    delete Memory.stats;

/*
    if (Game.cpu.getUsed() >= cpuLimit) {
        console.log(Math.ceil(Game.cpu.getUsed()) + " - " + Game.cpu.bucket + " - CPU-limit: " + cpuLimit + " - Last: " + lastRun + " (" + ManagerPriority[level] + ")");
    } else {
        console.log(Math.ceil(Game.cpu.getUsed()) + " - " + Game.cpu.bucket + " - CPU-limit: " + cpuLimit);
    }*/
}

function getCpuLimit(): number {
    if (Game.cpu.bucket > 9900) {
        return Game.cpu.limit * 1.6;
    } else
    if (Game.cpu.bucket > 9600) {
        return Game.cpu.limit * 1.3;
    } else
    if (Game.cpu.bucket > 9200) {
        return Game.cpu.limit * 1.1;
    } else
    if (Game.cpu.bucket > 8600) {
        return Game.cpu.limit * 0.9;
    } else
    if (Game.cpu.bucket > 8000) {
        return Game.cpu.limit * 0.8;
    } else
    if (Game.cpu.bucket > 7000) {
        return Game.cpu.limit * 0.7;
    } else {
        return Game.cpu.limit * 0.5;
    }
}

function logUsedCpu(func: Function | Manager, name: string, pri: ManagerPriority,  ... args: any[]) {
    let cpuUsed = Game.cpu.getUsed();
    let result: any = undefined;
    if (func instanceof Manager) {
        result = func.run(pri);
    } else {
        result = func(... args);
    }
    let usedCpu = Game.cpu.getUsed() - cpuUsed;
    Memory.stats['cpu.manager.' + name + "." + pri] = usedCpu;
    if (Memory.stats['cpu.manager.' + name + ".total"] === undefined) {
        Memory.stats['cpu.manager.' + name + ".total"] = usedCpu;
    } else {
        Memory.stats['cpu.manager.' + name + ".total"] += usedCpu;
    }
    return result;
}

function getUserName(): string | undefined {
    let spawnNames = Object.keys(Game.spawns);
    if (spawnNames.length === 0) {
        return;
    }
    return Game.spawns[spawnNames[0]].owner.username;
}
