"use strict";
const Logger_1 = require("./tools.Logger");
const labstatus_1 = require("./enums.labstatus");
const roomlevel_1 = require("./enums.roomlevel");
const RoomRepository = require("./repository.Room");
const TradeManager = require("./managers.Trade");
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
const _Manager_1 = require("./managers._Manager");
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
