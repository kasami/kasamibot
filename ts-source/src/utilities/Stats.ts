export function recordStats(rooms: Room[]): void {
    if (Memory.stats == undefined) {
        Memory.stats = {}
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
        var isMyRoom = (room.controller ? room.controller.my : 0)
        if (isMyRoom && room.controller !== undefined) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1
            Memory.stats['room.' + room.name + '.level'] = (room.controller ? room.controller.level : 0);
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;
            if (room.controller.level < 8) {
                Memory.stats['room.' + room.name + '.rclProgress'] = Math.floor(100*(room.controller.progress / room.controller.progressTotal))/100;
            }

            if (room.memory.lab !== undefined && room.memory.lab.labstatus !== undefined && room.memory.lab.labstatus > 0) {
                Memory.stats['labs.active'] += 1;
            }

            if (room.memory.orders !== undefined) {
                Memory.stats['room.' + room.name + '.orders'] = room.memory.orders.length;
            } else {
                Memory.stats['room.' + room.name + '.orders'] = 0;
            }
            let spawns = room.getSpawns();
            let spawning = 0;
            for(let spawn of spawns) {
                if (spawn.spawning) {
                    spawning++;
                }
            }
            Memory.stats['room.' + room.name + '.spawning'] = spawning;

            var storedEnergy = 0

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

            Memory.stats['room.' + room.name + '.storedEnergy'] = storedEnergy

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

            // Walls
            Memory.stats['room.' + room.name + '.outerWallMin'] = room.memory.lowestWall;
            Memory.stats['room.' + room.name + '.fortressMin'] = room.memory.lowestFortress;
            if (Memory.stats['room.' + room.name + '.wallsRepaired'] !== undefined) {
                Memory.stats['energy.walls'] += Memory.stats['room.' + room.name + '.wallsRepaired'];
            }

        } else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
    Memory.stats['gcl.level'] = Game.gcl.level

    Memory.stats['cpu.bucket'] = Game.cpu.bucket
    Memory.stats['cpu.limit'] = Game.cpu.limit

    Memory.stats['credits.wallet'] = Game.market.credits;
    Memory.stats['cpu.creepcount'] = Object.keys(Game.creeps).length;

    // Logging resourceprices
    for (let resourceType of Object.keys(Memory.marketSell)) {
        Memory.stats['resource.' + resourceType + ".sell"] = Memory.marketSell[resourceType];
    }
    for (let resourceType of Object.keys(Memory.marketBuy)) {
        Memory.stats['resource.' + resourceType + ".buy"] = Memory.marketBuy[resourceType];
    }

    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
}
