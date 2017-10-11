"use strict";
const _Targeting = require("./rolelib.targeting");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToTarget"] = 1] = "MovingToTarget";
    State[State["MovingToDrainingPosition"] = 2] = "MovingToDrainingPosition";
    State[State["Draining"] = 3] = "Draining";
})(State || (State = {}));
function run(creep) {
    creep.notifyWhenAttacked(false);
    shootHostileCreeps(creep);
    if (!creep.hasState()) {
        creep.setState(State.MovingToTarget);
    }
    switch (creep.getState()) {
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.MovingToDrainingPosition:
            runMovingToDrainingPosition(creep);
            break;
        case State.Draining:
            runDraining(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToTarget);
            break;
    }
}
exports.run = run;
;
function runDraining(creep) {
    creep.heal(creep);
}
function runMovingToDrainingPosition(creep) {
    creep.heal(creep);
    if (roomIsDrainable(creep)) {
        let drainPosition = getDrainingPosition(creep);
        if (creep.pos.getRangeTo(drainPosition) > 0) {
            creep.travelTo({ pos: drainPosition });
        }
        else {
            creep.setState(State.Draining);
        }
    }
    else {
        creep.memory.target = undefined;
        creep.memory.drainPosition = undefined;
        creep.setState(State.MovingToTarget);
        runMovingToTarget(creep);
    }
}
function runMovingToTarget(creep) {
    healIfNeeded(creep);
    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            return;
        }
    }
    if (targetRoom === creep.room.name) {
        creep.setState(State.MovingToDrainingPosition);
        runMovingToDrainingPosition(creep);
    }
    else {
        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
    }
}
function roomIsDrainable(creep) {
    let towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: (t) => t.structureType === STRUCTURE_TOWER });
    return towers.length > 0;
}
function getDrainingPosition(creep) {
    let turrets = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
    let exits = creep.room.find(FIND_EXIT);
    let goodPositions = [];
    let best = undefined;
    let bestValue = 1000;
    for (let pos of exits) {
        let value = 0;
        for (let turret of turrets) {
            let range = pos.getRangeTo(turret);
            value = value + Math.max(0, 20 - range);
        }
        if (best === undefined || value < bestValue) {
            best = pos;
            bestValue = value;
        }
        if (value === 0) {
            goodPositions.push(pos);
        }
    }
    if (goodPositions.length > 0) {
        let closestPos = goodPositions[0];
        let distanceToPos = creep.pos.getRangeTo(goodPositions[0]);
        for (let pos of goodPositions) {
            let r = creep.pos.getRangeTo(pos);
            if (r < distanceToPos) {
                closestPos = pos;
                distanceToPos = r;
            }
        }
        console.log("Moving to pos: " + closestPos);
        return closestPos;
    }
    if (best !== undefined) {
        console.log("Moving to pos (not great): " + best);
        return best;
    }
    console.log("Staying here (bad): " + creep.pos);
    return creep.pos;
}
function getNextTargetRoom(creep) {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.target = creep.memory.route.shift();
    }
    else {
        creep.memory.target = undefined;
    }
    return creep.memory.target;
}
function healIfNeeded(creep) {
    if (creep.hits < creep.hitsMax || creep.getState() === State.MovingToTarget) {
        creep.heal(creep);
    }
}
function shootHostileCreeps(creep) {
    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);
    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function (c) {
        let atPos = c.pos.lookFor(LOOK_STRUCTURES);
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART) {
                return false;
            }
        }
        return true;
    });
    if (closeDangerousCreepsNotOnRamparts.length > 0) {
        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
    }
    else {
        let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
        if (targetToDismantle instanceof Structure && creep.pos.getRangeTo(targetToDismantle) < 4) {
            creep.rangedAttack(targetToDismantle);
        }
    }
}
