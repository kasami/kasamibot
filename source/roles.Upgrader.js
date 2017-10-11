"use strict";
function run(creep) {
    let controller = Game.getObjectById(creep.memory.target);
    if (controller === undefined) {
        console.log("Upgrader without a valid controller: " + creep.name);
    }
    if (creep.memory.container === undefined) {
        setMyContainer(creep);
    }
    let container = Game.getObjectById(creep.memory.container);
    if (container === null) {
        creep.memory.container = undefined;
        return;
    }
    if (creep.isEmpty() || creep.carry.energy < 35) {
        let responseTransfer = creep.withdraw(container, RESOURCE_ENERGY);
        if (responseTransfer === ERR_NOT_IN_RANGE) {
            creep.travelTo(container);
            return;
        }
    }
    let response = creep.upgradeController(controller);
    if (response === OK || creep.memory.pos !== undefined) {
        if (Memory.stats['room.' + creep.room.name + '.energyUpgraded'] === undefined) {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] = 0;
        }
        if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += (creep.getActiveBodyparts(WORK) * 2);
        }
        else {
            Memory.stats['room.' + creep.room.name + '.energyUpgraded'] += creep.getActiveBodyparts(WORK);
        }
        if (Game.time % 10 === 0) {
            if (creep.memory.pos === undefined) {
                setUpgraderPos(creep, container.pos);
            }
            if (creep.memory.pos.x !== undefined && creep.memory.pos.y !== undefined && creep.memory.pos.roomName !== undefined) {
                if (creep.pos.x !== creep.memory.pos.x || creep.pos.y !== creep.memory.pos.y) {
                    let wantedPos = new RoomPosition(creep.memory.pos.x, creep.memory.pos.y, creep.memory.pos.roomName);
                    let creeps = wantedPos.lookFor(LOOK_CREEPS);
                    if (creeps.length > 0) {
                        creep.memory.pos === undefined;
                    }
                    else {
                        creep.moveTo(wantedPos);
                    }
                }
            }
        }
    }
    else if (response === ERR_NOT_IN_RANGE) {
        if (creep.memory.pos !== undefined && creep.memory.pos.x !== undefined && creep.memory.pos.y !== undefined && creep.memory.pos.roomName !== undefined) {
            if (creep.pos.x !== creep.memory.pos.x || creep.pos.y !== creep.memory.pos.y) {
                let wantedPos = new RoomPosition(creep.memory.pos.x, creep.memory.pos.y, creep.memory.pos.roomName);
                let creeps = wantedPos.lookFor(LOOK_CREEPS);
                if (creeps.length > 0) {
                    creep.memory.pos === undefined;
                }
                else {
                    creep.moveTo(wantedPos);
                    return;
                }
            }
        }
        creep.travelTo(container);
    }
}
exports.run = run;
function setUpgraderPos(creep, around) {
    for (let x of _.range(-1, 2)) {
        for (let y of _.range(-1, 2)) {
            if (x !== 0 || y !== 0) {
                let pos = new RoomPosition(around.x + x, around.y + y, around.roomName);
                let creeps = pos.lookFor(LOOK_CREEPS);
                let structs = pos.lookFor(LOOK_STRUCTURES);
                if (creeps.length === 0 && structs.length === 0) {
                    creep.memory.pos = pos;
                    return;
                }
            }
        }
    }
    creep.memory.pos = creep.pos;
}
function setMyContainer(creep) {
    let controller = Game.getObjectById(creep.memory.target);
    if (!(controller instanceof StructureController)) {
        console.log("Error with controller for upgrader: " + creep.name);
        return;
    }
    let container = controller.getContainerOrLink();
    if (container instanceof StructureContainer || container instanceof StructureLink) {
        creep.memory.container = container.id;
    }
}
