"use strict";
function isCloseToSourceKeeper(creep) {
    let closestSK = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => c.owner.username === "Source Keeper" });
    if (closestSK !== undefined && creep.pos.getRangeTo(closestSK) < 5) {
        return true;
    }
    return false;
}
exports.isCloseToSourceKeeper = isCloseToSourceKeeper;
function isCloseToHostile(creep) {
    let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile !== undefined && creep.pos.getRangeTo(closestHostile) < 6) {
        return true;
    }
    return false;
}
exports.isCloseToHostile = isCloseToHostile;
