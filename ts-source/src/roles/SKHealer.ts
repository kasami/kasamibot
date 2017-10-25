import {Role} from "../enums/role";
import * as _Common from "../rolelib/common";

export function run(creep: Creep) {
    let targetToHeal: Creep | null = Game.getObjectById(creep.memory.targetToHeal) as  Creep;

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

    // If you are not in the room, move towards the room.
    if (creep.pos.getRangeTo(targetToHeal.pos) > 1) {
        creep.moveTo(targetToHeal);
        healIfNeeded(creep, creep);
        return;
    }

    if (creep.hits < 1000) {
        healIfNeeded(creep, creep);
    } else
    if (creep.hitsMax - creep.hits >= targetToHeal.hitsMax - targetToHeal.hits) {
        healIfNeeded(creep, creep);
    } else {
        healIfNeeded(creep, targetToHeal);
    }
};

function healIfNeeded(creep: Creep, target: Creep) {
    if (target.hits < target.hitsMax) {
        creep.heal(target);
    }
}

function findTargetToHeal(creep: Creep): Creep | null {
    let targetsToHeal = creep.room.find(FIND_MY_CREEPS, {filter: function(c: Creep) {
        return c.memory.role === Role.SKGuard && c.memory.healer === undefined && c.memory.token === creep.memory.token;
    }}) as Creep[];
    if (targetsToHeal.length > 0) {
        creep.memory.targetToHeal = targetsToHeal[0].id;
        targetsToHeal[0].memory.healer = creep.id;
        return targetsToHeal[0];
    }
    return null;
}
