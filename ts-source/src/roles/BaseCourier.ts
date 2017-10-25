import {RoomLevel} from "../enums/roomlevel";
import {Labstatus} from "../enums/labstatus";

import * as RoomRepository from "../repository/Room";

enum CourierTask {
    PowerDelivery = 2,
    BaselinkLoading = 3,
    PowerToTerminal = 5,
    SupplyLabs = 6,
    EmptyingLabs = 7,
    MoveStorageMinerals = 8,
    SupplyNuker = 9,
    EmptyingAllLabs = 10,
    PowerFromTerminal = 11,
}

class SupplyJob {
    lab: string;
    mineral: string;
    amount: number;
}

export function run(creep: Creep) {
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

    switch(creep.memory.task) {
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

function getTask(creep: Creep) {
    if (RoomRepository.getRoomLevel(creep.room) >= RoomLevel.Town && creep.room.storage !== undefined && creep.room.terminal !== undefined) {
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

        if (creep.room.memory.lab !== undefined && creep.room.memory.lab.labstatus === Labstatus.EmptyingLabs) {
            creep.memory.task = CourierTask.EmptyingLabs;
            return;
        }

        if (creep.room.memory.lab !== undefined && creep.room.memory.lab.labstatus === Labstatus.EmptyingAllLabs) {
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

    let nuker = creep.room.getNuker()
    if (creep.carry[RESOURCE_ENERGY] === 0 && nuker !== undefined && nuker.ghodium < nuker.ghodiumCapacity &&
    (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_GHODIUM] > 3000)) {
        creep.memory.task = CourierTask.SupplyNuker;
        return;
    }

    if (RoomRepository.getRoomLevel(creep.room) >= RoomLevel.AdvancedColony) {
        let baselink = creep.room.getBaseLink();
        if (baselink !== undefined && baselink.energy < 400) {
            creep.memory.task = CourierTask.BaselinkLoading;
            return;
        }
    }

    if (RoomRepository.getRoomLevel(creep.room) >= RoomLevel.Metropolis && creep.room.storage !== undefined && creep.room.terminal !== undefined) {
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

function parkMe(creep: Creep) {
    if (creep.memory.parkingPos !== undefined && creep.memory.parkingPos.x !== undefined &&
        creep.memory.parkingPos.y !== undefined && creep.memory.parkingPos.roomName !== undefined) {
        let pos = new RoomPosition(creep.memory.parkingPos.x, creep.memory.parkingPos.y, creep.memory.parkingPos.roomName);
        if (creep.pos.x === pos.x && creep.pos.y === pos.y) {
            return;
        }
        creep.moveTo(pos);
        return;
    }
    let parkingPos: RoomPosition;

    let basePos = RoomRepository.getBasePosition(creep.room);
    if (basePos !== undefined) {
        parkingPos = new RoomPosition(basePos.x, basePos.y + 4, basePos.roomName)
    } else {
        parkingPos = creep.pos;
    }

    creep.memory.parkingPos = parkingPos;
    creep.moveTo(parkingPos);
}

function moveMineralsFromStorageToTerminal(creep: Creep) {
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
    } else {
        if (creep.transfer(creep.room.terminal, creep.memory.moveMineral) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.terminal);
        }
    }
}

function moveMineralsFromLab(creep: Creep) {
    if (creep.room.memory.lab === undefined || creep.room.terminal === undefined) {
        creep.memory.task = undefined;
        return;
    }
    let terminal = creep.room.terminal;
    if (creep.carryCapacity === _.sum(creep.carry)) {
        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal);
        } else {
            for (let res of Object.keys(creep.carry)) {
                creep.transfer(terminal, res)
            }
        }
    } else {
        let labs = _.filter(creep.room.getProcessingLabs(), function(l: Lab) {
            return l.mineralAmount > 0;
        });
        if (labs.length === 0) {
            if (_.sum(creep.carry) > 0) {
                if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                } else {
                    for (let res of Object.keys(creep.carry)) {
                        creep.transfer(terminal, res)
                    }
                }
            } else {
                creep.memory.task = undefined;
            }
        } else {
            let closest = creep.pos.findClosestByPath(labs);
            if (!_.isNull(closest) && creep.withdraw(closest, closest.mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    }

}


function moveMineralsFromAllLab(creep: Creep) {
    if (creep.room.memory.lab === undefined || creep.room.terminal === undefined) {
        creep.memory.task = undefined;
        return;
    }
    let terminal = creep.room.terminal;
    if (creep.carryCapacity === _.sum(creep.carry)) {
        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal);
        } else {
            for (let res of Object.keys(creep.carry)) {
                creep.transfer(terminal, res)
            }
        }
    } else {
        let labs = _.filter(creep.room.getProcessingLabs().concat(creep.room.getSupplyingLabs()), function(l: Lab) {
            return l.mineralAmount > 0;
        });
        if (labs.length === 0) {
            if (_.sum(creep.carry) > 0) {
                if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                } else {
                    for (let res of Object.keys(creep.carry)) {
                        creep.transfer(terminal, res)
                    }
                }
            } else {
                creep.memory.task = undefined;
            }
        } else {
            let closest = creep.pos.findClosestByPath(labs);
            if (!_.isNull(closest) && creep.withdraw(closest, closest.mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    }

}

function moveMineralsToLab(creep: Creep) {
    if (creep.room.memory.lab === undefined || creep.room.memory.lab.supplyJobs === undefined || creep.room.memory.lab.supplyJobs.length !== 2 || creep.room.terminal === undefined) {
        creep.memory.task = undefined;
        return;
    }
    let job1 = creep.room.memory.lab.supplyJobs[0] as SupplyJob;
    let lab1 = Game.getObjectById(job1.lab) as Lab;
    if (lab1.mineralAmount < job1.amount) {
        moveMineralToLab(creep, job1.mineral, job1.amount, lab1);
        return;
    }

    let job2 = creep.room.memory.lab.supplyJobs[1] as SupplyJob;
    let lab2 = Game.getObjectById(job2.lab) as Lab;
    if (lab2.mineralAmount < job2.amount) {
        moveMineralToLab(creep, job2.mineral, job2.amount, lab2);
        return;
    }
}

function moveMineralToLab(creep: Creep, mineral: string, amount: number, lab: Lab) {
    if (creep.room.terminal === undefined) {
        return;
    }
    let supplied = lab.mineralAmount;
    let pickupStructure: StructureTerminal = creep.room.terminal;
    if ((creep.carry[mineral] === undefined && _.sum(creep.carry) > 0) ||
        (lab.mineralType !== mineral && lab.mineralAmount > 0)) {
        if (_.sum(creep.carry) > 0) {
            if (creep.pos.getRangeTo(creep.room.terminal) > 1) {
                creep.moveTo(creep.room.terminal);
            } else {
                for (let res of Object.keys(creep.carry)) {
                    creep.transfer(creep.room.terminal, res)
                }
            }
        } else {
            if (creep.pos.getRangeTo(lab) > 1) {
                creep.moveTo(lab);
            } else {
                creep.withdraw(lab, lab.mineralType);
            }
        }
    } else
    if (creep.carry[mineral] === undefined) {

        let toPickUp = amount - supplied;
        let response = creep.withdraw(pickupStructure, mineral, Math.min(toPickUp, creep.carryCapacity));
        if (response === ERR_NOT_IN_RANGE) {
            creep.moveTo(pickupStructure);
        } else
        if (response === ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.task = undefined;
        }
    } else {
        let response = creep.transfer(lab, mineral);
        if (response === ERR_NOT_IN_RANGE) {
            creep.moveTo(lab);
        }
    }
}

function loadBaseLink(creep: Creep) {
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
    } else
    if (link.energy < link.energyCapacity) {
        if (creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(link);
        }
    } else {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }
}

function movePowerToTerminal(creep: Creep) {
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
    } else {
        if (creep.transfer(creep.room.terminal, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.terminal);
        } else {
            creep.memory.task = undefined;
        }
    }
}


function movePowerFromTerminal(creep: Creep) {
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
    } else {
        if (creep.transfer(creep.room.storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        } else {
            creep.memory.task = undefined;
        }
    }
}

function deliverGhodium(creep: Creep) {
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
    } else {
        let response = creep.transfer(nuker, RESOURCE_GHODIUM);
        if (response === ERR_NOT_IN_RANGE) {
            creep.moveTo(nuker);
        } else {
            creep.memory.task = undefined;
        }
    }
}

function deliverPower(creep: Creep) {
    let powerspawn = creep.room.getPowerSpawn();
    if (creep.room.storage === undefined || powerspawn === undefined || (creep.carry[RESOURCE_POWER] === undefined && creep.room.storage.store[RESOURCE_POWER] === undefined &&
    (creep.room.terminal === undefined || creep.room.terminal.store[RESOURCE_POWER] === undefined))) {
        creep.memory.task === undefined;
        return;
    }
    let pickupStructure: StructureStorage | StructureTerminal = creep.room.storage;
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
    } else {
        let response = creep.transfer(powerspawn, RESOURCE_POWER);
        if (response === ERR_NOT_IN_RANGE) {
            creep.moveTo(powerspawn);
        } else {
            creep.memory.task = undefined;
        }
    }
}
