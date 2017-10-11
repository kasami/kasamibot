"use strict";
const role_1 = require("./enums.role");
const _Common = require("./rolelib.common");
function run(creep) {
    let targetToHeal = Game.getObjectById(creep.memory.targetToHeal);
    if (targetToHeal === null) {
        targetToHeal = findTargetToHeal(creep);
        if (targetToHeal === null) {
            if (creep.getHomeroom() !== creep.room.name) {
                if (creep.ticksToLive > 200) {
                    console.log(creep.room.name + ": SKHealer missing SKGuard, removing unit: " + creep.name + " ticksLeft: " + creep.ticksToLive);
                }
                creep.suicide();
                return;
            }
            healIfNeeded(creep, creep);
            _Common.moveOffRoad(creep);
            return;
        }
    }
    if (creep.pos.getRangeTo(targetToHeal.pos) > 1) {
        creep.moveTo(targetToHeal);
        healIfNeeded(creep, creep);
        return;
    }
    if (creep.hits < 1000) {
        healIfNeeded(creep, creep);
    }
    else if (creep.hitsMax - creep.hits >= targetToHeal.hitsMax - targetToHeal.hits) {
        healIfNeeded(creep, creep);
    }
    else {
        healIfNeeded(creep, targetToHeal);
    }
}
exports.run = run;
;
function healIfNeeded(creep, target) {
    if (target.hits < target.hitsMax) {
        creep.heal(target);
    }
}
function findTargetToHeal(creep) {
    let targetsToHeal = creep.room.find(FIND_MY_CREEPS, { filter: function (c) {
            return c.memory.role === role_1.Role.SKGuard && c.memory.healer === undefined && c.memory.token === creep.memory.token;
        } });
    if (targetsToHeal.length > 0) {
        creep.memory.targetToHeal = targetsToHeal[0].id;
        targetsToHeal[0].memory.healer = creep.id;
        return targetsToHeal[0];
    }
    return null;
}
