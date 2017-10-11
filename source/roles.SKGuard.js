"use strict";
const _Common = require("./rolelib.common");
const PositionLib = require("./lib.position");
const IntelLib = require("./lib.intel");
function run(creep) {
    let targetRoom = creep.memory.target;
    let targetPos = undefined;
    if (creep.memory.targetPos !== undefined && creep.memory.targetPos.x !== undefined) {
        targetPos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
    }
    let targetKeeper = Game.getObjectById(creep.memory.targetKeeper);
    let healer = Game.getObjectById(creep.memory.healer);
    let targetLair = Game.getObjectById(creep.memory.targetLair);
    if (targetRoom === undefined) {
        console.log("SKGuard " + creep.name + " has no target room.");
        return;
    }
    if (healer === null) {
        if (creep.getHomeroom() !== creep.room.name) {
            if (creep.ticksToLive > 200) {
                console.log(creep.room.name + ": SKGuard missing SKHealer, removing unit: " + creep.name + " ticksLeft: " + creep.ticksToLive);
            }
            creep.suicide();
            return;
        }
        _Common.moveOffRoad(creep);
        return;
    }
    else if (!creep.pos.inRangeTo(healer.pos, 1) && creep.pos.x > 1 && creep.pos.x < 48 && creep.pos.y > 1 && creep.pos.y < 48) {
        if (Game.time % 3 === 0) {
            creep.moveTo(healer);
        }
        return;
    }
    if (targetRoom !== creep.room.name) {
        if (healer.fatigue > 0) {
            return;
        }
        if (targetPos !== undefined) {
            creep.travelTo({ pos: targetPos }, { allowSK: true, ignoreRoads: true });
            if (creep.pos.getRangeTo(healer) === 1) {
                healer.moveTo(creep, { ignoreCreeps: true });
            }
        }
        else {
            creep.travelToRoom(targetRoom, { allowSK: true });
            if (creep.pos.getRangeTo(healer) === 1) {
                healer.moveTo(creep, { ignoreCreeps: true });
            }
        }
        return;
    }
    if (targetKeeper === null || Game.time % 5 === 0) {
        targetKeeper = getKeeperTarget(creep);
    }
    if (targetKeeper !== null) {
        let range = creep.pos.getRangeTo(targetKeeper);
        if (range < 4) {
            let nearby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (nearby.length > 1) {
                creep.rangedMassAttack();
            }
            else {
                creep.rangedAttack(targetKeeper);
            }
        }
        if (range > 1 && healer.fatigue === 0) {
            creep.moveTo(targetKeeper.pos, { costCallback: getBorderCallback });
            if (creep.pos.getRangeTo(healer) === 1) {
                healer.moveTo(creep);
            }
        }
        else {
            creep.attack(targetKeeper);
            if (healer.fatigue === 0) {
                creep.moveTo(targetKeeper.pos, { ignoreCreeps: true, costCallback: getBorderCallback });
                if (creep.pos.getRangeTo(healer) === 1) {
                    healer.moveTo(creep, { ignoreCreeps: true });
                }
            }
        }
        return;
    }
    if (targetLair === null || (targetLair !== null && (targetLair.ticksToSpawn === undefined || targetLair.ticksToSpawn > 200))) {
        targetLair = getNextLairSpawning(creep);
    }
    if (targetLair !== null && creep.pos.getRangeTo(targetLair) > 1 && healer.fatigue === 0) {
        creep.travelTo(targetLair, { allowSK: true, ignoreCreeps: false });
        if (creep.pos.getRangeTo(healer) === 1) {
            healer.moveTo(creep, { ignoreCreeps: true });
        }
    }
    if (targetLair === null && healer.fatigue === 0) {
        if (creep.room.name !== targetRoom || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
            creep.travelTo({ pos: new RoomPosition(25, 25, targetRoom) }, { allowSK: true, ignoreCreeps: false });
            if (creep.pos.getRangeTo(healer) === 1) {
                healer.moveTo(creep, { ignoreCreeps: true });
            }
        }
    }
}
exports.run = run;
;
function getBorderCallback(roomName) {
    let room = Game.rooms[roomName];
    if (!room)
        return new PathFinder.CostMatrix;
    let costs = new PathFinder.CostMatrix;
    for (let c = 0; c < 50; c++) {
        costs.set(c, 0, 20);
        costs.set(c, 49, 20);
        if (c > 0 && c < 49) {
            costs.set(0, c, 20);
            costs.set(49, c, 20);
        }
    }
    room.find(FIND_CREEPS).forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
    });
    return costs;
}
function getKeeperTarget(creep) {
    if (IntelLib.hasInvaders(creep.room.name)) {
        let closestInvader = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (c) => c.owner.username === "Invader" });
        if (closestInvader instanceof Creep) {
            creep.memory.targetKeeper = closestInvader.id;
            creep.memory.targetPos = closestInvader.pos;
            return closestInvader;
        }
    }
    let closestDangerousCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (closestDangerousCreep instanceof Creep) {
        creep.memory.targetKeeper = closestDangerousCreep.id;
        creep.memory.targetPos = closestDangerousCreep.pos;
        return closestDangerousCreep;
    }
    else {
        creep.memory.targetKeeper = undefined;
        return null;
    }
}
function getNextLairSpawning(creep) {
    let allSpawningLairs = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: function (s) {
            return s.structureType === STRUCTURE_KEEPER_LAIR && s.ticksToSpawn !== undefined && s.ticksToSpawn > 0;
        }
    });
    if (allSpawningLairs === undefined || allSpawningLairs.length === 0) {
        creep.memory.targetPos = undefined;
        creep.memory.targetLair = undefined;
        return null;
    }
    let lair = allSpawningLairs[0];
    for (let l of allSpawningLairs) {
        if (lair.ticksToSpawn !== undefined && l.ticksToSpawn !== undefined &&
            l.ticksToSpawn < lair.ticksToSpawn) {
            lair = l;
        }
    }
    creep.memory.targetPos = lair.pos;
    creep.memory.targetLair = lair.id;
    return lair;
}
