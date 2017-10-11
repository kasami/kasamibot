"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const _Targeting = require("./rolelib.targeting");
function kiteAndAttack(creep, targetEnemy, range = 3) {
    let distance = creep.pos.getRangeTo(targetEnemy.pos);
    if (distance > range) {
        creep.moveTo(targetEnemy, { maxRooms: 1 });
    }
    else if (distance < range) {
        creep.moveTo(getFleeMove(creep, targetEnemy.pos), { maxRooms: 1 });
    }
    if (distance <= 3) {
        if (distance === 1) {
            creep.rangedMassAttack();
        }
        else {
            creep.rangedAttack(targetEnemy);
        }
        return true;
    }
    return false;
}
exports.kiteAndAttack = kiteAndAttack;
function rangedAttackToEnemiesAround(creep) {
    let targets = [];
    for (let x of [-2, -1, 0, 1, 2]) {
        for (let y of [-2, -1, 0, 1, 2]) {
            if (creep.pos.x + x >= 0 && creep.pos.x + x <= 49 && creep.pos.y + y >= 0 && creep.pos.y + y <= 49) {
                let pos = new RoomPosition(creep.pos.x + x, creep.pos.y + y, creep.pos.roomName);
                let atPos = pos.lookFor(LOOK_CREEPS);
                for (let c of atPos) {
                    if (!c.my && _Targeting.isCreepHostile(c)) {
                        targets.push(c);
                    }
                }
            }
        }
    }
    if (targets.length > 1) {
        creep.rangedMassAttack();
        return true;
    }
    else if (targets.length === 1) {
        creep.rangedAttack(targets[0]);
        return true;
    }
    return false;
}
exports.rangedAttackToEnemiesAround = rangedAttackToEnemiesAround;
function getFleeMove(creep, position) {
    return PathFinder.search(creep.pos, { pos: position, range: 5 }, {
        plainCost: 1,
        swampCost: 10,
        flee: true,
        roomCallback: PathfindingUtilities.getKitingRoomCallback
    }).path[0];
}
