"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const ProfileUtilities = require("./utilities.Profiles");
const BankAttacker = require("./roles.BankAttacker");
const BankHealer = require("./roles.BankHealer");
const BankHauler = require("./roles.BankHauler");
const BankRanger = require("./roles.BankRanger");
const PowerConfig = require("./config.power");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const Order_1 = require("./classes.Order");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
const _Manager_1 = require("./managers._Manager");
const Logger_1 = require("./tools.Logger");
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
