/*

LabManager skal ta seg av å passe på at vi har nok av ønskede advanced mineraler, og produsere disse hvis det ikke finnes, og vi har grunnstoffene tilgjengelig.
TradeManageren tar seg av å sende mineraler vi selv produserer, evt kjøpe hvis det er behov for mineraler vi ikke har.

F.eks for RESOURCE_CATALYZED_ZYNTHIUM_ACID:
RESOURCE_CATALYZED_GHODIUM_ALKALIDE: RESOURCE_GHODIUM_ALKALIDE + RESOURCE_HYDROXIDE
RESOURCE_GHODIUM_ALKALIDE: RESOURCE_GHODIUM + RESOURCE_OXYGEN
RESOURCE_HYDROXIDE: RESOURCE_HYDROGEN + RESOURCE_OXYGEN
RESOURCE_GHODIUM: RESOURCE_ZYNTHIUM_KEANITE + RESOURCE_UTRIUM_LEMERGITE
RESOURCE_ZYNTHIUM_KEANITE: RESOURCE_ZYNTHIUM + RESOURCE_KEANIUM
RESOURCE_UTRIUM_LEMERGITE: RESOURCE_UTRIUM + RESOURCE_LEMERGIUM

*/

import {log} from "../tools/Logger";

import {Labstatus} from "../enums/labstatus";
import {RoomLevel} from "../enums/roomlevel";

import * as RoomRepository from "../repository/Room";

import * as TradeManager from "../managers/Trade";

/*const ingredientsForCompound = {};
for (let ingredient1 in REACTIONS) {
    const map2 = REACTIONS[ingredient1];
    for (let ingredient2 in map2) {
        const compound = map2[ingredient2];
        const ingredients = [ingredient1, ingredient2];
        ingredientsForCompound[compound] = ingredients;
    }
}*/
const ingredientsForCompound: {[key: string]: [string, string]} = {"OH":["O","H"],"LH":["L","H"],"KH":["K","H"],"UH":["U","H"],"ZH":["Z","H"],"GH":["G","H"],"LO":["L","O"],"KO":["K","O"],"UO":["U","O"],"ZO":["Z","O"],"GO":["G","O"],"ZK":["K","Z"],"UL":["U","L"],"UH2O":["UH","OH"],"UHO2":["UO","OH"],"ZH2O":["ZH","OH"],"ZHO2":["ZO","OH"],"KH2O":["KH","OH"],"KHO2":["KO","OH"],"LH2O":["LH","OH"],"LHO2":["LO","OH"],"GH2O":["GH","OH"],"GHO2":["GO","OH"],"XUH2O":["UH2O","X"],"XUHO2":["UHO2","X"],"XLH2O":["LH2O","X"],"XLHO2":["LHO2","X"],"XKH2O":["KH2O","X"],"XKHO2":["KHO2","X"],"XZH2O":["ZH2O","X"],"XZHO2":["ZHO2","X"],"XGH2O":["GH2O","X"],"XGHO2":["GHO2","X"],"G":["UL","ZK"]}

/*
The priorityStock is used to make sure we have basic boosts for wreckerteams and active defense
Estimated needs:
6000 X, 10000 O, 8000 H, 2000 L, 2000 U, 3000 Z, 2000 K

 */
const priorityStock: {[key: string]: number} = {
    XGHO2: 1000, // For toughness
    XLHO2: 1000, // For healing
    XZHO2: 1000, // For speed
    XZH2O: 1000, // For dismantling
    XKHO2: 1000, // For ranged attackers
    XUH2O: 1000, // For attacking
    GHO2: 1000, // (-50 % dmg taken)
    LHO2: 1000, // (+200 % heal)
    ZHO2: 1000, // (+200 % fat decr - speed)
    ZH2O: 1000, // (+200 % dismantle)
    UH2O: 1000, // (+200 % attack)
    KHO2: 1000, // (+200 % ranged attack)
    GO: 1000, // (-30 % dmg taken)
    LO: 1000, // (+100 % heal)
    ZO: 1000, // (+100 % fat decr - speed)
    ZH: 1000, // (+100 % dismantle)
    UH: 1000, // (+100 % attack)
    KO: 1000, // (+100 % ranged attack)
};

const wantedStock: {[key: string]: number} = {
    UH: 2000, // (+100 % attack)
    KO: 3000, // (+100 % ranged attack)
    XGHO2: 10000, // For toughness
    XLHO2: 10000, // For healing
    XZHO2: 6000, // For speed
    XZH2O: 6000, // For dismantling
    XKHO2: 8000, // For ranged attackers
    XUH2O: 8000, // For attacking
    G: 4000, // For nukes
    XLH2O: 2000, // For repair (or build)
    LH: 2000, // (+50 % build and repair)
    XUHO2: 2000, // For harvest
    XKH2O: 2000, // For carry
    XGH2O: 12000 // For upgraders at rcl 8 - for 1 upgrader with 15 workparts, we need 450 (7 labs will produce it in ~750 ticks)
};

import {Manager, ManagerPriority} from "../managers/_Manager";

import {RoomService} from "../services/Room";

export class LabManager extends Manager {

    private roomService: RoomService;

    constructor(roomService: RoomService) {
        super("LabManager");
        this.roomService = roomService;
    }
    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Trivial) {
            let rooms = this.roomService.getNormalAndNotExpansion();
            for (let room of rooms) {
                if (RoomRepository.getRoomLevel(room) >= RoomLevel.Town && room.hasLabArea() &&
                (room.memory.lab.inactiveUntil === undefined || room.memory.lab.inactiveUntil < Game.time)) {
                    labOperationStatus(room);
                }
            }
        }
    }
}

function labOperationStatus(room: Room) {
    switch(room.memory.lab.labstatus) {
        case Labstatus.Inactive:
            checkIfWeShouldRunLabs(room);
            break;
        case Labstatus.GettingMineralsToTerminal:
            checkIfWeHaveMineralsForReaction(room);
            break;
        case Labstatus.MovingMineralsToLab:
            moveMineralsToLab(room);
            break;
        case Labstatus.RunningReactions:
            runReactionLabs(room);
            break;
        case Labstatus.EmptyingLabs:
            checkIfLabsAreEmpty(room);
            break;
        case Labstatus.EmptyingAllLabs:
            checkIfWeShouldRunLabs(room);
            break;
        default:
            room.memory.lab.labstatus = Labstatus.Inactive;
    }
}

function checkIfLabsAreEmpty(room: Room) {
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
            log.info("Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks", room.name);
            room.memory.lab.inactiveUntil = Game.time + 1000;
            room.memory.lab.labstatus = Labstatus.Inactive;
        }
        if (room.memory.lab.cooldown > 0) {
            room.memory.lab.cooldown--;
        } else {
            room.memory.lab.cooldown = undefined;
            runNextReaction(room);
        }
    }
}

function runReactionLabs(room: Room) {
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
        room.memory.lab.labstatus = Labstatus.EmptyingLabs;
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
    lab: string;
    mineral: string;
    amount: number;
}

function getSupplyLabJobs(room: Room): SupplyJob[] {
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
    let jobs: SupplyJob[] = [];

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

function moveMineralsToLab(room: Room) {
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

    for (let j of room.memory.lab.supplyJobs as SupplyJob[]) {
        let lab = Game.getObjectById(j.lab) as Lab;
        if (lab.mineralAmount < j.amount || lab.mineralAmount === 0 || lab.mineralType !== j.mineral) {
            return;
        }
    }

    room.memory.lab.supplyJobs = undefined;
    room.memory.lab.labstatus = Labstatus.RunningReactions;
}

function checkIfWeHaveMineralsForReaction(room: Room) {
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
        room.memory.lab.labstatus = Labstatus.MovingMineralsToLab;
    }
}

function isLabsEmpty(room: Room) {
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

function checkIfWeShouldRunLabs(room: Room) {
    if (room.terminal === undefined) {
        return;
    }

    if (!isLabsEmpty(room)) {
        room.memory.lab.labstatus = Labstatus.EmptyingAllLabs;
        log.info("Labs seems to have had some problems during the last operation. Sending minerals to the terminal.", room.name);
        room.memory.lab.inactiveUntil = Game.time + 10;
        return;
    } else {
        room.memory.lab.labstatus = Labstatus.Inactive;
    }

    if (room.isAbandoned()) {
        log.info("Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks", room.name);
        room.memory.lab.inactiveUntil = Game.time + 1000;
        return;
    }

    let missingPriorityStock = false;

    for(let mineral in priorityStock) {
        if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < priorityStock[mineral]) {
            missingPriorityStock = true;
            room.memory.lab.batchSize = 1000;
            let missing = checkHowManyMineralsAreMissingForFinalProduct(room, mineral)
            if (missing === 0) {
                room.memory.lab.mineralQueue = buildReactionQueueForMineral(mineral);
                room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
                if (room.memory.lab.activeMineral === undefined) {
                    return;
                }
                room.memory.lab.labstatus = Labstatus.GettingMineralsToTerminal;
                room.memory.lab.wantedMineral = mineral;
                log.info("Labs are starting production of " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
                return;
            }
        }
    }

    if (!missingPriorityStock) {
        for(let mineral in wantedStock) {
            if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < wantedStock[mineral]) {
                room.memory.lab.batchSize = 2000;
                let missing = checkHowManyMineralsAreMissingForFinalProduct(room, mineral)
                if (missing === 0) {
                    room.memory.lab.mineralQueue = buildReactionQueueForMineral(mineral);
                    room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
                    if (room.memory.lab.activeMineral === undefined) {
                        return;
                    }
                    room.memory.lab.labstatus = Labstatus.GettingMineralsToTerminal;
                    room.memory.lab.wantedMineral = mineral;
                    log.info("Labs are starting production of " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
                    return;
                }
            }
        }
    }

    log.info("Labs are inactive, putting to sleep for 1000 ticks", room.name);
    room.memory.lab.inactiveUntil = Game.time + 1000;
}

function checkHowManyMineralsAreMissingForFinalProduct(room: Room, mineral: string): number {
    let req = getRequiredBasicMineralsForMineral(mineral);
    if (room.terminal === undefined) {
        return Object.keys(req).length;
    }

    let count = 0;
    for (let m of Object.keys(req)) {
        if (room.terminal.store[m] === undefined || room.terminal.store[m] < (req[m] * room.memory.lab.batchSize)) {
            count++
        }
    }
    return count;
}

function runNextReaction(room: Room) {
    if (room.memory.lab.mineralQueue.length > 0) {
        room.memory.lab.activeMineral = room.memory.lab.mineralQueue.shift();
        room.memory.lab.labstatus = Labstatus.GettingMineralsToTerminal;
    } else {
        log.info("Labs are finished producing " + room.memory.lab.batchSize + " " + room.memory.lab.wantedMineral, room.name);
        room.memory.lab.labstatus = Labstatus.Inactive;
        room.memory.lab.mineralQueue = undefined;
        room.memory.lab.activeMineral = undefined;
        room.memory.lab.wantedMineral = undefined;
    }
}

function buildReactionQueueForMineral(mineral: string): string[] {
    return getRequiredReactionsForMineral(mineral);
}

export function getRequiredBasicMineralsForMineral(mineral: string): {[mineral: string]: number} {
    let flat = _getRequiredBasicMineralsForMineral(mineral);
    let required: {[mineral: string]: number} = {};
    for (let m of flat) {
        if (required[m] === undefined) {
            required[m] = 1;
        } else {
            required[m]++;
        }
    }
    return required;
}

function _getRequiredBasicMineralsForMineral(mineral: string): string[] {
    if (ingredientsForCompound[mineral] === undefined || _.isEmpty(mineral)) {
        return [mineral];
    } else {
        return _getRequiredBasicMineralsForMineral(ingredientsForCompound[mineral][0]).concat(_getRequiredBasicMineralsForMineral(ingredientsForCompound[mineral][1]));
    }
}

function getRequiredReactionsForMineral(mineral: string): string[] {
    if (ingredientsForCompound[mineral] === undefined || _.isEmpty(mineral)) {
        return [];
    } else {
        return getRequiredReactionsForMineral(ingredientsForCompound[mineral][0]).concat(getRequiredReactionsForMineral(ingredientsForCompound[mineral][1]), mineral);
    }
}
