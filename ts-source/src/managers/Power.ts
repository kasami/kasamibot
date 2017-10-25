import * as PathfindingUtilities from "../utilities/Pathfinding";
import * as ProfileUtilities from "../utilities/Profiles";

import * as BankAttacker from "../roles/BankAttacker";
import * as BankHealer from "../roles/BankHealer";
import * as BankHauler from "../roles/BankHauler";
import * as BankRanger from "../roles/BankRanger";

import * as PowerConfig from "../config/power";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Order} from "../classes/Order";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import {log} from "../tools/Logger";

export class PowerManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("PowerManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.BankRanger, BankRanger.run);
        } else
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.BankAttacker, BankAttacker.run);
            this.creepService.runCreeps(Role.BankHealer, BankHealer.run);
            this.creepService.runCreeps(Role.BankHauler, BankHauler.run);
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 50 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                for (let room of rooms) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && room.hasFreeSpawnCapacity() &&
                    room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > PowerConfig.energyInStorageBeforeRobbing &&
                    (room.storage.store[RESOURCE_POWER] < PowerConfig.powerInStorageBeforeStoppingRobbing || room.storage.store[RESOURCE_POWER] === undefined))
                    {
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
        if (pri === ManagerPriority.Trivial) {
            let rooms = this.roomService.getNormalAndNotExpansion();
            for (let room of rooms) {
                if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis) {
                    let powerspawn = room.getPowerSpawn();
                    if (powerspawn !== undefined && powerspawn.power >= 1 && powerspawn.energy >= 50) {
                        powerspawn.processPower();
                    }
                }
            }
        }
    }

    private processBankInformation(room: Room) {
        if (room.memory.powerbanks === undefined) {
            return;
        }
        for (let bankid of Object.keys(room.memory.powerbanks)) {
            let bankinfo = room.memory.powerbanks[bankid] as BankInfo;
            let bank = Game.getObjectById(bankinfo.id);

            if (bankinfo.attackersOrdered && bank instanceof StructurePowerBank) {
                if (this.moreRobbersAreNeeded(room, bankinfo)) {
                    orderExtraPowerBankTeam(room, bankinfo);
                }
            }

            if (bankinfo.attackersOrdered && !bankinfo.haulersOrdered && (bank instanceof StructurePowerBank) && (shouldWeOrderPowerHaulers(bank))) {
                (room.memory.powerbanks[bankid] as BankInfo).haulersOrdered = true;
                orderPowerBankHaulers(room, bankinfo);
            }
            if (bankinfo.tickGone < Game.time) {
                room.memory.powerbanks[bankid] = undefined;
            }
        }
    }

    private moreRobbersAreNeeded(room: Room, bankinfo: BankInfo): boolean {
        let bank = Game.getObjectById(bankinfo.id) as PowerBank;
        if (bank === null) {
            return false;
        }
        let ordered = OrdersRepository.getCreepsInQueue(room, Role.BankAttacker, bankinfo.id);
        if (ordered > 0) {
            return false;
        }
        let currentAttackers = this.creepService.getCreeps(Role.BankAttacker, bankinfo.id);
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

function orderPowerBankTeam(room: Room, bank: BankInfo) {
    log.info("Bank is being robbed by room" + room.name + " (" + bank.power + " power)", bank.position.roomName);
    let maxTierHealer = ProfileUtilities.getMaxTierHealer(room.energyCapacityAvailable);

    let attackerorder = new Order();
    attackerorder.body = ProfileUtilities.getBankAttacker();
    attackerorder.priority = Priority.Critical;
    attackerorder.memory = {role: Role.BankAttacker, target: bank.id, tier: 1};

    let healerorder = new Order();
    healerorder.body = ProfileUtilities.getHealerBody(maxTierHealer);
    healerorder.priority = Priority.Critical;
    healerorder.memory = {role: Role.BankHealer, target: bank.id, tier: maxTierHealer};

    let rangerorder = new Order();
    rangerorder.body = ProfileUtilities.getBankRanger();
    rangerorder.priority = Priority.Critical;
    rangerorder.memory = {role: Role.BankRanger, target: bank.id, tier: 1};


    OrdersRepository.orderCreep(room, attackerorder);
    OrdersRepository.orderCreep(room, healerorder);

    if (bank.attackSpots > 1) {
        OrdersRepository.orderCreep(room, attackerorder);
        OrdersRepository.orderCreep(room, healerorder);
    } else {
        OrdersRepository.orderCreep(room, rangerorder);
    }
}


function orderExtraPowerBankTeam(room: Room, bank: BankInfo) {
    log.info("Sending reinforcements to bank by room" + room.name + " (" + bank.power + " power)", bank.position.roomName);
    let maxTierHealer = ProfileUtilities.getMaxTierHealer(room.energyCapacityAvailable);


    let attackerorder = new Order();
    attackerorder.body = ProfileUtilities.getBankAttacker();
    attackerorder.priority = Priority.Critical;
    attackerorder.memory = {role: Role.BankAttacker, target: bank.id, tier: 1};

    let healerorder = new Order();
    healerorder.body = ProfileUtilities.getHealerBody(maxTierHealer);
    healerorder.priority = Priority.Critical;
    healerorder.memory = {role: Role.BankHealer, target: bank.id, tier: maxTierHealer};

    OrdersRepository.orderCreep(room, attackerorder);
    OrdersRepository.orderCreep(room, healerorder);

    let rangerorder = new Order();
    rangerorder.body = ProfileUtilities.getBankRanger();
    rangerorder.priority = Priority.Critical;
    rangerorder.memory = {role: Role.BankRanger, target: bank.id, tier: 1};

    if (bank.attackSpots === 1) {
        OrdersRepository.orderCreep(room, rangerorder);
    }
}

function orderPowerBankHaulers(room: Room, bank: BankInfo) {
    let maxTier = ProfileUtilities.getMaxTierHauler(room.energyCapacityAvailable);

    let order = new Order();
    order.body = ProfileUtilities.getHaulerBody(maxTier);
    order.priority = Priority.Critical;
    order.memory = {role: Role.BankHauler, target: bank.id, tier: maxTier};

    let neededHaulers = Math.ceil((bank.power - 500) / 1600);
    for (let i = 0; i < neededHaulers; i++) {
        OrdersRepository.orderCreep(room, order);
    }
}

function shouldWeOrderPowerHaulers(bank: StructurePowerBank): boolean {
    if (bank.hits < 200000) {
        return true;
    }
    return false;
}

function getFreePowerbank(room: Room): BankInfo | undefined {
    if (room.memory.powerbanks === undefined) {
        return undefined;
    }
    let bestBank: BankInfo | undefined = undefined;
    let bestBankPower = 0;

    for (let bankid of Object.keys(room.memory.powerbanks)) {
        let bankinfo = room.memory.powerbanks[bankid] as BankInfo;
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

function bankCanBeRobbed(bankinfo: BankInfo): boolean {
    return !bankinfo.attackersOrdered && bankinfo.distance < PowerConfig.maxDistanceToBank && !powerbankIsTaken(bankinfo) &&
        bankinfo.tickGone - Game.time > PowerConfig.minTimeLeftForRobbingBank;
}

function setPowerBankAsTaken(bankinfo: BankInfo) {
    if (Memory.takenBanks === undefined) {
        Memory.takenBanks = [];
    }
    let bi = new BankInfoGlobal();
    bi.id = bankinfo.id;
    bi.tickGone = bankinfo.tickGone;
    Memory.takenBanks.push(bi);
}

function powerbankIsTaken(bankinfo: BankInfo): boolean {
    if (Memory.takenBanks === undefined) {
        return false;
    }
    for (let b of Memory.takenBanks as BankInfoGlobal[]) {
        if (bankinfo.id === b.id) {
            return true;
        }
    }
    return false;
}

export function registerPowerBank(room: Room, bank: StructurePowerBank) {
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
        bankinfo.position = {x: bank.pos.x, y: bank.pos.y, roomName: bank.pos.roomName};
        room.memory.powerbanks[bank.id] = bankinfo;
        log.info("Bank found by room" + room.name + " (" + bank.power + " power)", bank.room.name);
    }
}

// TODO: Flytt til prototype
function getAttackSpotsForBank(bank: StructurePowerBank): number {
    let positions: RoomPosition[] = [];
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
    public id: string;
    public tickGone: number;
}

class BankInfo {
    public id: string;
    public tickGone: number;
    public hostilesAround: boolean;
    public power: number;
    public hits: number;
    public distance: number;
    public attackersOrdered: boolean;
    public haulersOrdered: boolean;
    public attackSpots: number;
    public position: {
        x: number,
        y: number,
        roomName: string
    };
}

/*

Calculations for powerbankfarming:
2 000 000 hp som må tas ned på ~ 1000 ticks pr fjomp
2000 dmg per tick - 20 dmg modules gir 600 dmg
300 heal per tick - 25 heal

Getting Power home: Math.floor(power / 1250) haulers

Attackers: 5*TOUGH, 25*MOVE, 20*ATTACK
Healers: 25*MOVE, 25*HEAL
Haulers: 25*MOVE, 25*CARRY (1250)
 */

/*

Power-math

Assuming power is worth 0.5 credits (low estimate, will be higher later)

A BankAttacker traveling 300 will do ~ 600 dmg a tick, 720 000 dmg
in their lifetime. So we need 3 pairs to take down a bank.

A BankAttacker costs 2600 energy and a BankHealer costs 7500 energy.
So taking it down costs 30 000 energy.

Also we need one hauler per 1500 power, costing 2400, so an extra 2 energy per power.

A bank with 1000 power costs 32000 to harvest, 500 credits for 320 credits.
With power prices at 0.8 credits, it is worth it to harvest down to 400 power,
converted to energy worth 0.01 credits.

If power in the future is worth ~3 credits, it will be worth it down to 200 power.

*/
