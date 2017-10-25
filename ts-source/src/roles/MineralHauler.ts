import * as _Common from "../rolelib/common";
import * as PathfindingUtilities from "../utilities/Pathfinding";

export function run(creep: Creep) {
    if (_Common.moveHomeAndHealIfHurt(creep)) { return; }

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
        let container = Game.getObjectById(creep.memory.container) as Container;

        let mineral = Game.getObjectById(creep.memory.targetMineral) as Mineral;
        if (mineral === null) {
            return;
        }

        if (container === null) {
            if (creep.room.name === creep.memory.targetRoom) {
                if (!setMyContainer(creep)) {
                    return;
                }
            } else {
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
        } else
        if (response === ERR_NOT_ENOUGH_RESOURCES && resource !== RESOURCE_ENERGY) {
            creep.stopTanking();
        }
    } else {
        let storage = Game.getObjectById(creep.memory.dropof) as Structure;
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
        } else
        if (response === ERR_FULL) {
            setMyDropof(creep);
        } else
        if (response === OK) {
            let container = Game.getObjectById(creep.memory.container) as Container;
            if (container instanceof StructureContainer) {
                creep.travelTo(container)
            } else {
                creep.travelToRoom(creep.memory.targetRoom);
            }
        }
    }
}

function setMyContainer(creep: Creep): boolean {
    let container = (Game.getObjectById(creep.memory.targetMineral) as Mineral).getMiningContainer();
    if (container === null) {
        return false;
    }
    creep.memory.container = container.id;
    return true;
}

function setMyDropof(creep: Creep): void {
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

function getTargetRoom(creep: Creep): void {
    creep.memory.targetRoom = creep.memory.target.split("-")[0];
}

function getTargetMineral(creep: Creep): void {
    creep.memory.targetMineral = creep.memory.target.split("-")[1];
}

function setOutdatedTick(creep: Creep): void {
    if (creep.memory.outdatedTick !== undefined) {
        return;
    }
    let storage = Game.rooms[creep.memory.homeroom].storage as Structure;
    let container = Game.getObjectById(creep.memory.container) as Container;

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

function checkIfOutdated(creep: Creep): boolean {
    if (creep.memory.outdatedTick === undefined) {
        return false;
    }
    if (creep.memory.outdatedTick > creep.ticksToLive) {
        creep.suicide();
        return true;
    }
    return false;
}
