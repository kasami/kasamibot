"use strict";
const OutpostDefender_1 = require("./roles.OutpostDefender");
const _Common = require("./rolelib.common");
const PositionLib = require("./lib.position");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["Standby"] = 1] = "Standby";
    State[State["FollowingDefender"] = 2] = "FollowingDefender";
})(State || (State = {}));
function run(creep) {
    creep.notifyWhenAttacked(false);
    if (!creep.hasState()) {
        creep.setState(State.Standby);
    }
    switch (creep.getState()) {
        case State.Standby:
            runStandby(creep);
            break;
        case State.FollowingDefender:
            runFollowingDefender(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Standby);
            break;
    }
}
exports.run = run;
;
function runFollowingDefender(creep) {
    let defender = getDefender(creep);
    if (defender === undefined) {
        creep.setState(State.Standby);
        return;
    }
    if (defender.getState() == OutpostDefender_1.State.Standby) {
        creep.setState(State.Standby);
        return;
    }
    let targetEnemy = getTargetEnemy(defender);
    if (creep.getActiveBodyparts(ATTACK) === 0) {
        creep.moveTo(defender);
    }
    else if (targetEnemy !== undefined && targetEnemy.pos.roomName === creep.pos.roomName && defender.pos.roomName === creep.pos.roomName) {
        if (creep.pos.getRangeTo(targetEnemy) === 1) {
            creep.moveTo(targetEnemy.pos, { ignoreCreeps: true });
        }
        else {
            creep.moveTo(targetEnemy);
        }
    }
    else {
        creep.travelTo(defender);
    }
    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) === 1) {
        creep.say("Yeeha!");
        creep.attack(targetEnemy);
    }
}
function runStandby(creep) {
    let defender = getDefender(creep);
    if (defender === undefined) {
        defender = findDefenderToHeal(creep);
    }
    if (defender !== undefined) {
        let state = defender.getState();
        if (state !== OutpostDefender_1.State.Standby) {
            creep.setState(State.FollowingDefender);
            runFollowingDefender(creep);
            return;
        }
    }
    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
        creep.travelToRoom(homeroom, { allowHostile: false });
        return;
    }
    _Common.moveOffRoad(creep);
}
function getDefender(creep) {
    let defender = Game.getObjectById(creep.memory.defender);
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    return defender;
}
function getTargetEnemy(defender) {
    let targetEnemy = Game.getObjectById(defender.memory.targetEnemy);
    if (targetEnemy === null) {
        return undefined;
    }
    return targetEnemy;
}
function findDefenderToHeal(creep) {
    let defenders = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
            return c.memory.role === role_1.Role.OutpostDefender && c.memory.warrior === undefined;
        } });
    if (defenders.length > 0) {
        creep.memory.defender = defenders[0].id;
        defenders[0].memory.warrior = creep.id;
        return defenders[0];
    }
    return undefined;
}
