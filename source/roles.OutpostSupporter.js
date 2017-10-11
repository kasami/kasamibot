"use strict";
const OutpostDefender_1 = require("./roles.OutpostDefender");
const _Military = require("./rolelib.military");
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
    let hasHealed = healIfNeeded(creep);
    switch (creep.getState()) {
        case State.Standby:
            runStandby(creep);
            break;
        case State.FollowingDefender:
            if (!hasHealed) {
                creep.heal(creep);
            }
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
    if (targetEnemy !== undefined && creep.pos.getRangeTo(targetEnemy) <= 3) {
        creep.rangedAttack(targetEnemy);
    }
    else {
        _Military.rangedAttackToEnemiesAround(creep);
    }
    if (creep.pos.getRangeTo(defender) === 1) {
        creep.moveTo(defender.pos, { ignoreCreeps: true });
    }
    else {
        creep.travelTo(defender);
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
function healIfNeeded(creep) {
    if (creep.getActiveBodyparts(HEAL) < 1) {
        return true;
    }
    let defender = getDefender(creep);
    let warrior = getWarrior(creep);
    let lowestHp = creep;
    if (defender !== undefined && creep.pos.getRangeTo(defender) < 4 && defender.missingHits() > lowestHp.missingHits()) {
        lowestHp = defender;
    }
    if (warrior !== undefined && creep.pos.getRangeTo(warrior) < 4 && warrior.missingHits() > lowestHp.missingHits()) {
        lowestHp = warrior;
    }
    if (lowestHp.missingHits() > 0) {
        creep.heal(lowestHp);
        return true;
    }
    return false;
}
function getDefender(creep) {
    let defender = Game.getObjectById(creep.memory.defender);
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    return defender;
}
function getWarrior(creep) {
    let defender = Game.getObjectById(creep.memory.defender);
    if (defender === null) {
        creep.memory.defender = undefined;
        return undefined;
    }
    let warrior = Game.getObjectById(defender.memory.warrior);
    if (warrior === null) {
        return undefined;
    }
    return warrior;
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
            return c.memory.role === role_1.Role.OutpostDefender && c.memory.supporter === undefined;
        } });
    if (defenders.length > 0) {
        creep.memory.defender = defenders[0].id;
        defenders[0].memory.supporter = creep.id;
        return defenders[0];
    }
    return undefined;
}
