"use strict";
const ScoutingUtilities = require("./utilities.Scouting");
const _Targeting = require("./rolelib.targeting");
const _Military = require("./rolelib.military");
const PositionLib = require("./lib.position");
const DamageLib = require("./lib.damage");
const IntelLib = require("./lib.intel");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["Waiting"] = 1] = "Waiting";
    State[State["MovingToTarget"] = 2] = "MovingToTarget";
    State[State["Attacking"] = 3] = "Attacking";
    State[State["Sleep"] = 4] = "Sleep";
})(State || (State = {}));
function run(creep) {
    creep.notifyWhenAttacked(false);
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }
    healIfNeeded(creep);
    switch (creep.getState()) {
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.Attacking:
            runAttacking(creep);
            break;
        case State.Sleep:
            runSleep(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
}
exports.run = run;
;
function runWaiting(creep) {
    creep.setState(State.MovingToTarget);
}
function runSleep(creep) {
    if (Game.time % 9 === 0) {
        creep.setState(State.Attacking);
    }
}
function runMovingToTarget(creep) {
    if (Game.time % 9 === 4 && !PositionLib.positionIsBorderOrNextToBorder(creep.pos) &&
        currentRoomHasHostilesToKill(creep)) {
        creep.setState(State.Attacking);
        runAttacking(creep);
        return;
    }
    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNewTargetRoom(creep);
        if (targetRoom === undefined) {
            Logger_1.log.error("Harasser " + creep.name + " has no target room.", creep.room.name);
            return;
        }
    }
    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
        creep.setState(State.Attacking);
    }
    else {
        creep.travelToRoom(targetRoom, { allowSK: false, ignoreRoads: true, allowHostile: false });
    }
}
function runAttacking(creep) {
    if (Game.time % 9 === 0 && !PositionLib.positionIsBorderOrNextToBorder(creep.pos) &&
        !currentRoomHasHostilesToKill(creep)) {
        let targetRoom = getNewTargetRoom(creep);
        if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
            Logger_1.log.info("Ranger " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
            creep.setState(State.MovingToTarget);
            runMovingToTarget(creep);
        }
        else {
            creep.setState(State.Sleep);
        }
        return;
    }
    let targetToAttack = getTargetToAttack(creep);
    if (Game.time % 18 === 0 || targetToAttack === null) {
        targetToAttack = getNewTargetToAttack(creep);
    }
    if (targetToAttack !== null) {
        creep.memory.targetToAttack = targetToAttack.id;
        if (targetToAttack instanceof Creep) {
            let range = 3;
            if (targetToAttack.getActiveBodyparts(ATTACK) === 0) {
                range = 1;
            }
            if (!_Military.kiteAndAttack(creep, targetToAttack, range)) {
                _Military.rangedAttackToEnemiesAround(creep);
            }
        }
        else if (targetToAttack instanceof ConstructionSite) {
            _Military.rangedAttackToEnemiesAround(creep);
            creep.travelTo(targetToAttack, { range: 0 });
        }
        else {
            moveAndAttack(creep, targetToAttack);
        }
    }
    else {
        let targetRoom = getNewTargetRoom(creep);
        if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
            Logger_1.log.info("Ranger " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
            creep.setState(State.MovingToTarget);
        }
        else {
            creep.setState(State.Sleep);
        }
    }
}
function currentRoomHasHostilesToKill(creep) {
    let enemies = _Targeting.findHostileCreepsInRoom(creep.room, false);
    if (enemies.length === 0) {
        return false;
    }
    let creepStats = DamageLib.getStatsForCreep(creep);
    for (let e of enemies) {
        let enemyStats = DamageLib.getStatsForCreep(e);
        if (enemyStats.rpt > creepStats.hpt) {
            return false;
        }
    }
    return true;
}
function getTargetToAttack(creep) {
    let targetToAttack = Game.getObjectById(creep.memory.targetToAttack);
    if (targetToAttack !== null) {
        return targetToAttack;
    }
    else {
        return null;
    }
}
function getNewTargetToAttack(creep) {
    let allCreeps = _Targeting.findHostileCreepsInRoom(creep.room, false);
    if (allCreeps.length > 0) {
        let creepStats = DamageLib.getStatsForCreep(creep);
        let dangerous = [];
        for (let c of allCreeps) {
            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) {
                let enemyStats = DamageLib.getStatsForCreep(c);
                if (enemyStats.rpt > creepStats.hpt) {
                    return null;
                }
                dangerous.push(c);
            }
        }
        if (dangerous.length > 0) {
            return creep.pos.findClosestByRange(dangerous);
        }
        return creep.pos.findClosestByRange(allCreeps);
    }
    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);
    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
    if (vitalStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
    }
    let allStructures = _Targeting.findHostileStructures(creep.room);
    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);
    if (allStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
    }
    if (vitalStructures.length > 0) {
        return creep.pos.findClosestByRange(vitalStructures);
    }
    if (allStructures.length > 0) {
        return creep.pos.findClosestByRange(allStructures);
    }
    let allConstructionSitesWithOutRamparts = _Targeting.filterConstructionSitesOnRamparts(_Targeting.findHostileConstructionSites(creep.room));
    if (allConstructionSitesWithOutRamparts.length > 0) {
        return creep.pos.findClosestByRange(allConstructionSitesWithOutRamparts);
    }
    return null;
}
function moveAndAttack(creep, targetToAttack) {
    let range = creep.pos.getRangeTo(targetToAttack);
    if (range === 1) {
        creep.rangedAttack(targetToAttack);
    }
    if (range > 1) {
        let response = creep.moveTo(targetToAttack);
        if (response === ERR_NO_PATH) {
            findWallToDestroy(creep, targetToAttack);
        }
    }
}
function findWallToDestroy(creep, targetToAttack) {
    let path = PathFinder.search(creep.pos, { pos: targetToAttack.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
    }).path;
    for (let roomPos of path) {
        let structures = roomPos.lookFor(LOOK_STRUCTURES);
        if (structures.length > 0) {
            for (let s of structures) {
                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                    Logger_1.log.info("Harasser needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
                    creep.memory.targetToAttack = s.id;
                    return;
                }
            }
        }
    }
    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
}
function getRoomCallbackForWallDestruction(roomName) {
    let room = Game.rooms[roomName];
    if (!room)
        return new PathFinder.CostMatrix;
    let costs = new PathFinder.CostMatrix;
    room.find(FIND_STRUCTURES).forEach(function (structure) {
        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 1000));
        }
    });
    return costs;
}
function getNewTargetRoom(creep) {
    let neighbours = _.filter(ScoutingUtilities.getRoomsOneAway(creep.room.name), (r) => !IntelLib.isOwned(r) && Game.map.isRoomAvailable(r));
    if (neighbours.length === 0) {
        return undefined;
    }
    creep.memory.target = _.sample(neighbours);
    return creep.memory.target;
}
function healIfNeeded(creep) {
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }
}
