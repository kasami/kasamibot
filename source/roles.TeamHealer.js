"use strict";
const _Common = require("./rolelib.common");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["Waiting"] = 1] = "Waiting";
    State[State["Moving"] = 2] = "Moving";
})(State || (State = {}));
function run(creep) {
    creep.notifyWhenAttacked(false);
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }
    switch (creep.getState()) {
        case State.Waiting:
            runIdle(creep);
            break;
        case State.Moving:
            runMoving(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
}
exports.run = run;
;
function runIdle(creep) {
    let teammate = findPossibleTeammate(creep);
    if (teammate instanceof Creep) {
        creep.memory.teammate = teammate.id;
        teammate.memory.healer = creep.id;
        creep.setState(State.Moving);
        runMoving(creep);
    }
    else {
        healSelf(creep);
        _Common.moveOffRoad(creep);
    }
}
function runMoving(creep) {
    let teammate = getTeammate(creep);
    if (teammate instanceof Creep) {
        let rangeToTeammate = creep.pos.getRangeTo(teammate.pos);
        moveToTeammate(creep, teammate, rangeToTeammate);
        healSelfOrTeammate(creep, teammate, rangeToTeammate);
    }
    else {
        Logger_1.log.error("TeamHealer " + creep.name + " seems to have lost it's teammate.", creep.room.name);
        creep.memory.teammate = undefined;
        creep.setState(State.Waiting);
    }
}
function healSelf(creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }
}
function healSelfOrTeammate(creep, teammate, range) {
    if (range > 3) {
        creep.heal(creep);
    }
    else {
        if (getMissingHitpoints(creep) > getMissingHitpoints(teammate)) {
            creep.heal(creep);
        }
        else {
            if (range > 1) {
                creep.rangedHeal(teammate);
            }
            else {
                creep.heal(teammate);
            }
        }
    }
}
function moveToTeammate(creep, teammate, range) {
    if (creep.memory.doNotMove === true) {
        creep.memory.doNotMove = undefined;
        return;
    }
    if (range > 1) {
        creep.moveTo(teammate);
    }
    else {
        if (teammate.fatigue === 0) {
            creep.moveTo(teammate.pos, { ignoreCreeps: true });
        }
    }
}
function getTeammate(creep) {
    let teammate = Game.getObjectById(creep.memory.teammate);
    return teammate;
}
function findPossibleTeammate(creep) {
    let possibleTeammates = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
            return (c.memory.role === role_1.Role.TeamWrecker || c.memory.role === role_1.Role.TeamWarrior) &&
                c.memory.healer === undefined;
        }
    });
    if (possibleTeammates.length > 0) {
        return possibleTeammates[0];
    }
    return null;
}
function getMissingHitpoints(creep) {
    return creep.hitsMax - creep.hits;
}
