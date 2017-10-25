/**
 * The trademanager is responsible for buying and selling minerals through the terminal
 *
 * Basic implementation:
 * - When above 60000, set up sell-order for 20000. Cheapest price available above a limit.
 * - When above 100000, try to sell to buy-orders (down to 60000), event at worse prices.
 * - When above 150000, stop mining operations.
 *
 * Should provide interface for requesting buying of boost-materials (catalyzed stuff)
 */

import * as MarketManager from "../managers/Market"

import * as RoomUtilities from "../utilities/Room";
import * as RoomRepository from "../repository/Room";

import * as TradeConfig from "../config/trade";
import {RoomLevel} from "../enums/roomlevel";

const basicMinerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST];

import {Manager, ManagerPriority} from "../managers/_Manager";

import {RoomService} from "../services/Room";

import {log} from "../tools/Logger";

export class TradeManager extends Manager {

    private roomService: RoomService;

    private hasRunCrisisEnergy = false;
    private hasRunSendEnergyAway = false;
    private hasRunSendEnergyToPraiseroom = false;
    private hasRunSendBoostToPraiseroom = false;
    private hasRunPraiseroomEnergyOrder = false;
    private hasRunLookForGoodDeals = false;
    private hasRunSellEnergy = false;
    private hasRunSellPower = false;
    private hasRunSellPowerGoodDeal = false;
    private hasRunSendPower = false;
    private hasRunSendMinerals = false;
    private hasRunSendBoost = false;
    private hasRunMineralSellorders = false;
    private hasRunMineralToBuyorders = false;
    private hasRunAbandonedRooms = false;

    readonly MEMORY_NEXTRUN_CRISISENERGY = "nextCrisis";
    readonly MEMORY_NEXTRUN_SENDENERGYAWAY = "nextEnAway";
    readonly MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM = "nextPrEnergy";
    readonly MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM = "nextPrBoost";
    readonly MEMORY_NEXTRUN_PRAISEROOMENERGYORDER = "nextPrOrder";
    readonly MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS = "nextCleanup";
    readonly MEMORY_NEXTRUN_LOOKFORGOODDEALS = "nextGoodDeals";
    readonly MEMORY_NEXTRUN_SELLENERGY = "nextEnergySale";
    readonly MEMORY_NEXTRUN_SELLPOWER = "nextPwSale";
    readonly MEMORY_NEXTRUN_SELLPOWERGOODDEAL = "nextPwGoodSale";
    readonly MEMORY_NEXTRUN_SENDPOWER = "nextPwDist";
    readonly MEMORY_NEXTRUN_SENDMINERALS = "nextMinDist";
    readonly MEMORY_NEXTRUN_SENDBOOST = "nextSendBoost";
    readonly MEMORY_NEXTRUN_MINERALSELLORDERS = "nextMinSellO";
    readonly MEMORY_NEXTRUN_MINERALTOBUYORDERS = "nextMinToBuyO";
    readonly MEMORY_NEXTRUN_ABANDONEDROOMS = "nextAbandoned";
    readonly MEMORY_NEXTRUN_PREPARERESPAWN = "nextPrepRespawn";
    readonly MEMORY_NEXTRUN_BUYMINERALS = "nextBuyMins";

    constructor(roomService: RoomService) {
        super("TradeManager");
        this.roomService = roomService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            // Requesting crisis-energy
            let nextRunCrisisEnergy = this.getValue(this.MEMORY_NEXTRUN_CRISISENERGY);
            if (nextRunCrisisEnergy === undefined || nextRunCrisisEnergy < Game.time) {
                let roomNeedingCrisisEnergy = this.getRoomNeedingCrisisEnergy();
                if (roomNeedingCrisisEnergy !== undefined) {
                    this.requestCrisisEnergy(roomNeedingCrisisEnergy);
                    this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY, Game.time + 12);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY, Game.time + 200);
                }
                this.hasRunCrisisEnergy = true;
                return;
            }

            // Requesting praiseroom-energy
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
        } else
        if (pri === ManagerPriority.Low) {

            if (Memory.settings.prepareRespawn === true) {
                let nextPrepareRespawn = this.getValue(this.MEMORY_NEXTRUN_PREPARERESPAWN);
                if (nextPrepareRespawn === undefined || nextPrepareRespawn < Game.time) {
                    let rooms = this.roomService.getNormalRooms()
                    let counter = 0;
                    for (let room of rooms) {
                        if (this.sellEverything(room) && counter < 10) {
                            counter++;
                        }
                    }
                    if (counter === 0) {
                        this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN, Game.time + 100);
                    } else {
                        this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN, Game.time + 1);
                    }
                    return;
                }
            }

            // Send away everything for abandoned rooms
            let nextRunAbandonedRooms = this.getValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS);
            if (nextRunAbandonedRooms === undefined || nextRunAbandonedRooms < Game.time) {
                let disRooms = this.roomService.getRoomsBeingAbandoned()
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

            // Sending power to other rooms
            let nextSendPower = this.getValue(this.MEMORY_NEXTRUN_SENDPOWER);
            if (nextSendPower === undefined || nextSendPower < Game.time) {
                let roomWithPowerOverflow = this.getRoomWantingToDistributePower();
                if (roomWithPowerOverflow !== undefined) {
                    this.sendPowerToOthers(roomWithPowerOverflow)
                    this.setValue(this.MEMORY_NEXTRUN_SENDPOWER, Game.time + 200);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SENDPOWER, Game.time + 1000);
                }
                this.hasRunSendPower = true;
                return;
            }

            // Maintain sellorders for minerals - TODO: refactor to smaller chunks (use index?)
            let nextMineralSellOrders = this.getValue(this.MEMORY_NEXTRUN_MINERALSELLORDERS);
            if (nextMineralSellOrders === undefined || nextMineralSellOrders < Game.time) {
                let sellMinsLimit = TradeConfig.sendMineralsToSellOrderWhenAbove;
                if (Memory.settings.bot === true) {
                    sellMinsLimit = 50000;
                }
                for (let room of this.roomService.getNormalAndNotExpansion()) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town && room.storage !== undefined && room.terminal !== undefined) {
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

            // Send minerals to other rooms - TODO: Refactor distribution
            let nextSendMinerals = this.getValue(this.MEMORY_NEXTRUN_SENDMINERALS);
            if (nextSendMinerals === undefined || nextSendMinerals < Game.time) {
                for (let room of this.roomService.getNormalAndNotExpansion()) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town && room.terminal !== undefined) {
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

            // Sell of excess minerals
            let nextMineralToBuyOrders = this.getValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS);
            if (nextMineralToBuyOrders === undefined || nextMineralToBuyOrders < Game.time) {
                let dumpMinsLimit = TradeConfig.sendMineralsToBuyOrdersWhenAbove;
                if (Memory.settings.bot === true) {
                    dumpMinsLimit = 70000;
                }
                for (let room of _.shuffle(this.roomService.getNormalAndNotExpansion())) {
                    if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town && room.terminal !== undefined && room.storage !== undefined) {
                        let roomMinerals = getTradeMinerals(room);
                        for (let roomMineral of roomMinerals) {
                            if (room.storage.store[roomMineral] > dumpMinsLimit && (_.sum(room.storage.store) > 900000 || Memory.settings.bot === true)) {
                                if (this.sellOfResources(room, roomMineral)) {
                                    if (Memory.settings.bot === true) {
                                        this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS, Game.time + 50);
                                    } else {
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

            // Maintaining praiseroom energy-order
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

            // Requesting praiseroom-boost
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
        } else
        if (pri === ManagerPriority.Trivial) {

            // Selling of minerals to good deals - TODO: rewrite this to scan for good deals, then check if we can fill them
            let nextLookForGoodDeals = this.getValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS);
            if (nextLookForGoodDeals === undefined || nextLookForGoodDeals < Game.time) {
                let roomWithMineralsForSale = this.getRoomWantingToSellToGoodDeals();
                if (roomWithMineralsForSale !== undefined) {
                    this.lookForGoodDeals(roomWithMineralsForSale.room, roomWithMineralsForSale.mineral);
                    this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS, Game.time + 10);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS, Game.time + 50);
                }
                this.hasRunLookForGoodDeals = true;
                return;
            }

            // Buying missing minerals from the market
            let buyMineralsLimit = 100000;
            if (Memory.settings.creditsToMaintain !== undefined) {
                buyMineralsLimit = Memory.settings.creditsToMaintain;
            }
            if (Game.market.credits > buyMineralsLimit) {
                let nextBuyMinerals = this.getValue(this.MEMORY_NEXTRUN_BUYMINERALS);
                if (nextBuyMinerals === undefined || nextBuyMinerals < Game.time) {
                    let rooms = this.roomService.getNormalRoomsNotAbandoned();
                    for (let room of rooms) {
                        if (roomCanTrade(room) && RoomRepository.getRoomLevel(room) >= RoomLevel.City) {
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

            // Selling of energy to best buy order
            let nextSellEnergy = this.getValue(this.MEMORY_NEXTRUN_SELLENERGY);
            if (nextSellEnergy === undefined || nextSellEnergy < Game.time) {
                let roomsWithEnergyOverflow = this.getRoomsWantingToSellOfEnergy();
                if (roomsWithEnergyOverflow.length > 0) {
                    for (let room of roomsWithEnergyOverflow) {
                        this.sellOfResources(room, RESOURCE_ENERGY);
                    }
                    this.setValue(this.MEMORY_NEXTRUN_SELLENERGY, Game.time + 100);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SELLENERGY, Game.time + 500);
                }
                this.hasRunSellEnergy = true;
                return;
            }

            // Selling of power to best buy order
            let nextSellPower = this.getValue(this.MEMORY_NEXTRUN_SELLPOWER);
            if (nextSellPower === undefined || nextSellPower < Game.time) {
                let roomWithPowerOverflow = this.getRoomWithPowerOverflow();
                if (roomWithPowerOverflow !== undefined) {
                    this.sellOfResources(roomWithPowerOverflow, RESOURCE_POWER);
                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWER, Game.time + 200);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWER, Game.time + 1000);
                }
                this.hasRunSellPower = true;
                return;
            }

            // Selling of power to good deals
            let nextSellPowerGoodDeal = this.getValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL);
            if (nextSellPowerGoodDeal === undefined || nextSellPowerGoodDeal < Game.time) {
                let roomWithPowerForSale = this.getRoomWantingToSendAwayPower();
                if (roomWithPowerForSale !== undefined) {
                    this.lookForGoodDeals(roomWithPowerForSale, RESOURCE_POWER);
                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL, Game.time + 50);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL, Game.time + 500);
                }
                this.hasRunSellPowerGoodDeal = true;
                return;
            }

            // Sending energy away because of overflow
            let nextRunSendEnergyAway = this.getValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY);
            if (nextRunSendEnergyAway === undefined || nextRunSendEnergyAway < Game.time) {
                let roomWantingToSendAwayEnergy = this.getRoomWantingToSendAwayEnergy();
                if (roomWantingToSendAwayEnergy !== undefined) {
                    this.sendEnergyToNeighbour(roomWantingToSendAwayEnergy);
                    this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY, Game.time + 50);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY, Game.time + 500);
                }
                    this.hasRunSendEnergyAway = true;
                return;
            }

            // Sending boost to needing rooms
            let nextRunSendBoost= this.getValue(this.MEMORY_NEXTRUN_SENDBOOST);
            if (nextRunSendBoost === undefined || nextRunSendBoost < Game.time) {
                let roomWithExcessBoost = this.getRoomWithExcessBoost();
                if (roomWithExcessBoost !== undefined) {
                    this.sendUpgraderBoostToOthers(roomWithExcessBoost);
                    this.setValue(this.MEMORY_NEXTRUN_SENDBOOST, Game.time + 200);
                } else {
                    this.setValue(this.MEMORY_NEXTRUN_SENDBOOST, Game.time + 1000);
                }
                this.hasRunSendBoost = true;
                return;
            }

            // Clean up inactive orders
            let nextRunCleanUpInactiveOrders = this.getValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS);
            if (nextRunCleanUpInactiveOrders === undefined || nextRunCleanUpInactiveOrders < Game.time) {
                this.cleanUpInactiveOrders();
                this.setValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS, Game.time + 6000);
            }
        }
    }


    private getRoomNeedingCrisisEnergy(): Room | undefined {
        let rooms = _.shuffle(this.roomService.getNormalAndNotExpansion());
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town &&
                room.terminal !== undefined && room.storage !== undefined &&
                room.terminal.store[RESOURCE_ENERGY] < TradeConfig.requestCrisisEnergyWhenTerminalEnergyBelow &&
                room.storage.store[RESOURCE_ENERGY] < TradeConfig.requestCrisisEnergyWhenStorageEnergyBelow
                && room.terminal.my && room.terminal.isActive() && !room.isAbandoned())
            {
                return room;
            }
        }
    }

    private getRoomsWantingToSellOfEnergy(): Room[] {
        let rooms = this.roomService.getNormalAndNotExpansion();
        let sellRooms: Room[] = [];
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town &&
                room.terminal !== undefined && room.storage !== undefined &&
                room.terminal.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenTerminalEnergyAbove &&
                room.storage.store[RESOURCE_ENERGY] > TradeConfig.sendEnergyToBuyOrdersWhenAbove &&
                room.terminal.my && room.terminal.isActive())
            {
                sellRooms.push(room);
            }
        }
        return sellRooms;
    }

    private getRoomWantingToSendAwayEnergy(): Room | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town &&
                room.terminal !== undefined && room.storage !== undefined &&
                room.terminal.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenTerminalEnergyAbove &&
                room.storage.store[RESOURCE_ENERGY] > TradeConfig.sendToNeighboursWhenStorageEnergyAbove &&
                room.terminal.my && room.terminal.isActive())
            {
                return room;
            }
        }
    }

    private getPraiseroomNeedingEnergy(): Room | undefined {
        let rooms = this.roomService.getPraiseRooms();
        for (let room of rooms) {
            if (room.terminal !== undefined && room.terminal.isActive() &&
                room.terminal.store[RESOURCE_ENERGY] < (room.terminal.storeCapacity - (TradeConfig.batchSizeForSendingEnergy * 2)))
            {
                return room;
            }
        }
    }

    private getPraiseroomNeedingBoost(): Room | undefined {
        let rooms = this.roomService.getPraiseRooms();
        for (let room of rooms) {
            if (room.terminal !== undefined && room.terminal.isActive() &&
                (room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] === undefined ||
                room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < 20000))
            {
                return room;
            }
        }
    }

    private getPraiseroomsNeedingEnergyOrder(): Room[] {
        let rooms = this.roomService.getPraiseRooms();
        let result: Room[] = [];
        for (let room of rooms) {
            if (room.terminal !== undefined && room.terminal.isActive() &&
            (Memory.settings.creditsToMaintain === undefined || Game.market.credits > Memory.settings.creditsToMaintain))
            {
                result.push(room);
            }
        }
        return result;
    }


    private getRoomWantingToSellToGoodDeals(): {room: Room, mineral: string} | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        let goodDealLimit = TradeConfig.sendMineralsToGoodDealsWhenAbove;
        if (Memory.settings.bot === true) {
            goodDealLimit = 30000;
        }
        for (let room of _.shuffle(rooms)) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town && room.terminal !== undefined && room.storage !== undefined && roomCanTrade(room)) {
                let roomMinerals = getTradeMinerals(room);
                for (let roomMineral of roomMinerals) {
                    if (room.storage.store[roomMineral] > goodDealLimit) {
                        return {room: room, mineral: roomMineral};
                    }
                }
            }
        }
    }


    private getRoomWantingToDistributePower(): Room | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        for (let room of _.shuffle(rooms)) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && roomCanTrade(room) &&
            room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
            room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenStorageAbove)
            {
                return room;
            }
        }
    }

    private getRoomWantingToSendAwayPower(): Room | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        for (let room of _.shuffle(rooms)) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && roomCanTrade(room) &&
            room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
            room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenStorageAbove * 2)
            {
                return room;
            }
        }
    }

    private getRoomWithPowerOverflow(): Room | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && roomCanTrade(room) &&
            room.terminal !== undefined && room.terminal.store[RESOURCE_POWER] >= TradeConfig.sendPowerWhenTerminalAbove &&
            room.storage !== undefined && room.storage.store[RESOURCE_POWER] >= TradeConfig.sendPowerToBuyOrdersWhenAbove)
            {
                return room;
            }
        }
    }

    private getRoomWithExcessBoost(): Room | undefined {
        let rooms = this.roomService.getNormalAndNotExpansion();
        for (let room of rooms) {
            if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && roomCanTrade(room) &&
                RoomLevel.Metropolis && room.terminal !== undefined &&
                room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > TradeConfig.sendUpgradeBoostWhenAbove)
            {
                return room;
            }
        }
    }


    private requestCrisisEnergy(room: Room) {
        if (room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] > TradeConfig.requestCrisisEnergyWhenTerminalEnergyBelow * 2) {
            return;
        }
        let providerRoom: Room | undefined;
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
            log.info("Requesting "+ TradeConfig.batchSizeForCrisisEnergy+" energy from room because of crisis: " + providerRoom.name +
            " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForCrisisEnergy, room.name, providerRoom.name) + " energy)", room.name)
            return;
        }
    }

    private sendEnergyToNeighbour(room: Room) {
        if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < (TradeConfig.batchSizeForSendingEnergy * 2)) {
            return;
        }
        let targetRoom: string | undefined = undefined;
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
            log.info("Sending "+TradeConfig.batchSizeForSendingEnergy +" energy because of overflow to room: " + targetRoom +
            " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingEnergy, room.name, targetRoom) + " energy)", room.name);
        }
    }

    private sendEnergyToPraiseroom(room: Room) {
        if (room.terminal === undefined) {
            return;
        }
        let providerRoom: Room | undefined = undefined;
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
            log.info("Sending "+TradeConfig.batchSizeForSendingEnergy +" energy to praise GCL: " + room.name +
            " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingEnergy, providerRoom.name, room.name) + " energy)", providerRoom.name);
        }
    }

    private sendBoostToPraiseroom(praiseroom: Room) {
        if (praiseroom.terminal === undefined) {
            return;
        }
        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
            if (RoomRepository.getRoomLevel(potRoom) >= RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > TradeConfig.sendUpgradeBoostWhenAbove) {
                potRoom.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID, TradeConfig.batchSizeForSendingUpgradeBoost, praiseroom.name);
                log.info("Sending "+TradeConfig.batchSizeForSendingUpgradeBoost +" "+ RESOURCE_CATALYZED_GHODIUM_ACID + " to praise GCL: " + praiseroom.name + "'>" + praiseroom.name +
                " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingUpgradeBoost, potRoom.name, praiseroom.name) + " energy)", potRoom.name);
            }
        }
    }

    private maintainPraiseroomBuyEnergyOrder(room: Room) {
        if (room.terminal === undefined) {
            return;
        }
        let energyPrice = MarketManager.getResourceBuyPrice(RESOURCE_ENERGY);
        if (energyPrice === undefined || energyPrice > 0.01) {
            return;
        }
        let buyorder = _.filter(Game.market.orders, function (o: any) {
            return o.type === ORDER_BUY && o.resourceType === RESOURCE_ENERGY && o.roomName === room.name;
        }) as Order[];
        if (Object.keys(buyorder).length > 0 ) {
            for (let orderId in buyorder) {
                if (buyorder[orderId].amount < 50000) {
                    let addAmount = (100000 - buyorder[orderId].amount);
                    log.info("Updating praiseroom energy-buyorder with " + addAmount + " energy for " + energyPrice, room.name);
                    Game.market.extendOrder(buyorder[orderId].id, addAmount);
                }
                if (buyorder[orderId].price > energyPrice || (buyorder[orderId].price < energyPrice && buyorder[orderId].remainingAmount === 0)) {
                    log.info("Updating price ofpraiseroom energy-buyorder to " + energyPrice, room.name);
                    Game.market.changeOrderPrice(buyorder[orderId].id, energyPrice);
                }
            }
        } else {
            log.info("Buyorder for praiseroom energy created.", room.name);
            Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, energyPrice, 100000, room.name);
        }
    }

    private cleanUpInactiveOrders() {
        let sellorders = _.filter(Game.market.orders, function (o: Order) {
            return o.type === ORDER_SELL && o.active === false && o.remainingAmount === 0;
        }) as Order[];

        for (let order of sellorders) {
            Game.market.cancelOrder(order.id);
        }
    }


    private lookForGoodDeals(room: Room, mineral: string, acceptOkeyDeals: boolean = false) {
        if (!roomCanTrade(room)) {
            return;
        }
        let amount = 5000;
        if (mineral === RESOURCE_POWER) {
            amount = 100;
        }
        // check if we can sell of extra minerals
        let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
            return o.type === ORDER_BUY && o.resourceType === mineral && o.amount >= amount;
        }) as Order[];
        if (ordersForMineral === undefined) {
            return;
        }
        let mappedOrders = _.map(ordersForMineral, function (o: Order) {
            return {orderid: o.id, priceWithTransactionCost: o.price - (0.01 * Game.market.calcTransactionCost(1, room.name, o.roomName as string))};
        });
        let minPrice = MarketManager.getResourcePrice(mineral);
        if (minPrice === undefined) {
            return;
        }
        let maxPrice = minPrice * 1.5;
        if (acceptOkeyDeals) {
            maxPrice = minPrice * 0.8;
        }
        let orderId: string | undefined = undefined;
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
                log.info("Selling directly " +
                amount +" " + mineral + " for " + wantedOrder.price + " because of a good deal! Cost: " +
                Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName as string) +" (" + wantedOrder.id + ")", room.name);
            }
        }
    }

    private sendPowerToOthers(room: Room) {
        if (!roomCanTrade(room)) {
            return;
        }
        if (room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < TradeConfig.energyLimitForSendingMinerals) {
            return;
        }
        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
            if (potRoom.name !== room.name && potRoom.controller !== undefined && potRoom.controller.level === 8 &&
                potRoom.terminal !== undefined && !potRoom.isAbandoned() &&
                (potRoom.terminal.store[RESOURCE_POWER] < (TradeConfig.batchSizeForSendingPower * 2) || potRoom.terminal.store[RESOURCE_POWER] === undefined))
            {
                room.terminal.send(RESOURCE_POWER, TradeConfig.batchSizeForSendingPower, potRoom.name);
                log.info("Sending "+
                TradeConfig.batchSizeForSendingPower+" "+ RESOURCE_POWER +" to room: " +
                potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingPower, room.name, potRoom.name) + " energy)", room.name);
                return;
            }
        }
    }

    private sellEverything(room: Room): boolean {
        if (!roomCanTrade(room) || room.terminal === undefined) {
            return false;
        }

        let inventory = Object.keys(room.terminal.store);
        if (inventory.length > 1) {
            for(let type of inventory) {
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


    private sellOfResources(room: Room, resource: string): boolean {
        if (!roomCanTrade(room)) {
            return false;
        }

        let amount = 1000;
        if (resource === RESOURCE_POWER) {
            amount = 100;
        } else
        if (resource === RESOURCE_ENERGY) {
            amount = 10000;
        }

        // check if we can sell of extra resources
        let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
            return o.type === ORDER_BUY && o.resourceType === resource && o.amount >= amount;
        }) as Order[];
        if (ordersForMineral === undefined) {
            return false;
        }
        let mappedOrders = _.map(ordersForMineral, function (o: Order) {
            return {orderid: o.id, priceWithTransactionCost: o.price - (0.005 * Game.market.calcTransactionCost(1, room.name, o.roomName as string))};
        });
        let maxPrice = 0;
        let orderId: string | undefined = undefined;
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
                let cost = Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName as string);
                if (room.terminal !== undefined && room.terminal.store[RESOURCE_ENERGY] > cost) {
                    Game.market.deal(wantedOrder.id, amount, room.name);
                    log.info("Selling directly " + amount +" " + resource + " for " + wantedOrder.price + " because of overflow. Cost: " +
                    Game.market.calcTransactionCost(amount, room.name, wantedOrder.roomName as string) +" (" + wantedOrder.id + ")", room.name);
                    return true;
                }
            }
        }
        return false;
    }

    private sendUpgraderBoostToOthers(room: Room) {
        if (!roomCanTrade(room)) {
            return;
        }
        if (room.terminal === undefined || room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < (TradeConfig.batchSizeForSendingUpgradeBoost * 2)) {
            return;
        }
        for (let potRoom of this.roomService.getNormalAndNotExpansion()) {
            if (potRoom.name !== room.name && potRoom.controller !== undefined && potRoom.controller.level < 8 && !potRoom.isAbandoned() &&
                potRoom.terminal !== undefined && (potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < (TradeConfig.batchSizeForSendingUpgradeBoost * 2) ||
                potRoom.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] === undefined))
            {
                room.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID, TradeConfig.batchSizeForSendingUpgradeBoost , potRoom.name);
                log.info("Sending "+
                TradeConfig.batchSizeForSendingUpgradeBoost +" "+ RESOURCE_CATALYZED_GHODIUM_ACID +" to room: " +
                potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingUpgradeBoost , room.name, potRoom.name) + " energy)", room.name);
                return;
            }
        }
    }


    private sendMineralsToOthers(room: Room, mineraltype: string): boolean {
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
                log.info("Sending "+
                TradeConfig.batchSizeForSendingMinerals+" "+ mineraltype +" to room: " +
                potRoom.name + " (costing " + Game.market.calcTransactionCost(TradeConfig.batchSizeForSendingMinerals, room.name, potRoom.name) + " energy)", room.name);
                return true;
            }
        }
        return false;
    }


    private sendAwayEverything(room: Room, energyToo: boolean = true) {
        if (!roomCanTrade(room)) {
            return;
        }
        if (room.terminal === undefined) {
            return;
        }
        let terminalRooms = _.shuffle(_.filter(this.roomService.getNormalAndNotExpansion(), function (r: Room) {return r.terminal !== undefined && r.name !== room.name && !r.isAbandoned(); }));
        let inventory = Object.keys(room.terminal.store);
        if (inventory.length > 1 && terminalRooms.length > 0) {
            for(let type of inventory) {
                if (room.terminal.store[type] >= 100 && type !== RESOURCE_ENERGY) {
                    log.info("Sending " + Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]) + " "+ type + " to room " + terminalRooms[0].name + " because room is being abandoned.", room.name);
                    room.terminal.send(type, Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]), terminalRooms[0].name);
                    return true;
                }
            }
            if (energyToo) {
                for(let type of inventory) {
                    if (room.terminal.store[type] >= 100 && type === RESOURCE_ENERGY) {
                        log.info("Sending " + Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]) + " "+ type + " to room " + terminalRooms[0].name + " because room is being abandoned.", room.name);
                        room.terminal.send(type, Math.min(TradeConfig.batchSizeForSendingEverythingOut, room.terminal.store[type]), terminalRooms[0].name);
                        return true;
                    }
                }
            }
        }
    }
}

function getTradeMinerals(room: Room): string[] {
    let minerals: string[] = []
    if (room.terminal !== undefined) {
        for (let m of basicMinerals) {
            if (room.terminal.store[m] !== undefined && room.terminal.store[m] > TradeConfig.sendMineralsToOtherRoomsWhenAbove) {
                minerals.push(m);
            }
        }
    }
    return minerals;
}

function maintainSellOrder(room: Room, mineral: string) {
    if (room.terminal === undefined) {
        return;
    }
    let sellorder = _.filter(Game.market.orders, function (o: any) {
        return o.type === ORDER_SELL && o.resourceType === mineral && o.roomName === room.name;
    }) as Order[];
    if (Object.keys(sellorder).length > 0 ) {
        for (let orderId in sellorder) {
            let sellPrice = MarketManager.getResourcePrice(mineral);
            if (sellPrice !== undefined) {
                if (sellorder[orderId].price > sellPrice || (sellorder[orderId].price < sellPrice && sellorder[orderId].remainingAmount === 0)) {
                    log.info("Updating price " + mineral + ": " + sellPrice, room.name);
                    Game.market.changeOrderPrice(sellorder[orderId].id, sellPrice);
                }
                if (sellorder[orderId].remainingAmount < 2000) {
                    let addAmount = (10000 - sellorder[orderId].remainingAmount);
                    log.info("Updating sellorder with " + addAmount + " " + mineral + " for " + sellPrice, room.name);
                    Game.market.extendOrder(sellorder[orderId].id, addAmount);
                }
            }
        }
    } else {
        let sellPrice = MarketManager.getResourcePrice(mineral);
        if (sellPrice !== undefined) {
            log.info("Sellorder for 10000 " + mineral + " for " + sellPrice, room.name);
            Game.market.createOrder(ORDER_SELL, mineral, sellPrice, 10000, room.name);
        }
    }
}

function roomCanTrade(room: Room): boolean {
    if (room.terminal === undefined) {
        return false;
    }
    if (room.terminal.cooldown > 0) {
        return false;
    }
    return true;
}

export function requestMineralsForLabs(room: Room, mineral: string, count: number) {
    if (room.terminal === undefined) {
        return;
    }
    let allRooms = RoomUtilities.getAllControlledRooms();
    count = count + 100;
    let targetRoom: Room | undefined = undefined;
    let targetRoomMineral = 0;
    for (let potRoom of allRooms) {
        if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[mineral] > count + 4000 && potRoom.terminal.store[mineral] > targetRoomMineral) {
            targetRoom = potRoom;
            targetRoomMineral = potRoom.terminal.store[mineral];
        }
    }
    if (targetRoom !== undefined && targetRoom.terminal !== undefined) {
        targetRoom.terminal.send(mineral, count, room.name);
        log.info("Sending "+count +" "+ mineral + " to " + room.name + " because it is needed for labs (costing " +
        Game.market.calcTransactionCost(count, targetRoom.name, room.name) + " energy)", targetRoom.name);
    } else {
        buyMineralsForLabs(room, mineral, count);
    }
}

export function requestMineralsForBoosting(room: Room, mineral: string, count: number) {
    if (room.terminal === undefined) {
        return;
    }
    let allRooms = RoomUtilities.getAllControlledRooms();
    count = count + 100;
    let targetRoom: Room | undefined = undefined;
    let targetRoomMineral = 0;
    for (let potRoom of allRooms) {
        if (RoomRepository.getRoomLevel(room) >= RoomLevel.Metropolis && potRoom.terminal !== undefined && roomCanTrade(potRoom) && potRoom.terminal.store[mineral] > count && potRoom.terminal.store[mineral] > targetRoomMineral) {
            targetRoom = potRoom;
            targetRoomMineral = potRoom.terminal.store[mineral];
        }
    }
    if (targetRoom !== undefined && targetRoom.terminal !== undefined) {
        targetRoom.terminal.send(mineral, count, room.name);
        log.info("Sending "+count +" "+ mineral + " to " + room.name +
        " because it is needed for boosting (costing " + Game.market.calcTransactionCost(count, targetRoom.name, room.name) + " energy)", targetRoom.name);
    } else {
        buyMineralsForBoosting(room, mineral, count);
    }
}

export function buyMineralsForBoosting(room: Room, mineral: string, count: number) {
    if (!roomCanTrade(room)) {
        return;
    }
    count = count + 10;
    let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
        return o.type === ORDER_SELL && o.resourceType === mineral && o.amount >= count;
    });
    let minPrice = 10;
    let orderId: string | undefined = undefined;
    for (let order of ordersForMineral) {
        if (minPrice > order.price) {
            minPrice = order.price;
            orderId = order.id;
        }
    }
    if (orderId !== undefined) {
        Game.market.deal(orderId, count, room.name);
        log.info("Buying " + count +" " + mineral + " for " + minPrice + " because it is needed for boosting.", room.name);
    }
}

function buyMissingMinerals(room: Room): boolean {
    if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < 10000) {
        return false;
    }
    for (let min of basicMinerals) {
        if (room.terminal.store[min] === undefined || room.terminal.store[min] < 2000) { // This should not be hardcoded
            let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
                return o.type === ORDER_SELL && o.resourceType === min && o.amount >= 1000;
            });
            let minPrice = 20;
            let orderId: string | undefined = undefined;
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
                log.info("Buying " +
                Math.min(2000, count) +" " + min + " for " + minPrice + " because it is a mineral we are missing. (" + orderId + ")", room.name);
                return true;
            }
        }
    }
    return false;
}

export function buyMineralsForLabs(room: Room, mineral: string, count: number) {
    if (!roomCanTrade(room) || room.terminal === undefined || room.terminal.store[RESOURCE_ENERGY] < 10000) {
        return;
    }
    count = count + 10;
    let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
        return o.type === ORDER_SELL && o.resourceType === mineral && o.amount >= count;
    });
    let minPrice = 20;
    let orderId: string | undefined = undefined;
    for (let order of ordersForMineral) {
        if (minPrice > order.price) {
            minPrice = order.price;
            orderId = order.id;
        }
    }
    if (orderId !== undefined) {
        Game.market.deal(orderId, count, room.name);
        log.info("Buying " + count +" " + mineral + " for " + minPrice + " because it is needed for labs. (" + orderId + ")", room.name);
    }
}

