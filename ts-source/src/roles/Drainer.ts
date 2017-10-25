/**
 * Drainer
 *
 * Used to drain energy from a room, by being targeted by turrets and healing the damage
 *
 * MEMORY
 *   target - target room for either waypoint or for draining
 *   route - list of target rooms to be visited
 *   drainPosition - best position in room to be used for draining
 *
 * STATE
 *   MovingToTarget - Moving to target room
 *   MovingToDrainingPosition - Moving to the best draining position
 *   Draining - Draining the room
 */

import * as _Targeting from "../rolelib/targeting";

import {log} from "../tools/Logger";

enum State {
    MovingToTarget = 1,
    MovingToDrainingPosition = 2,
    Draining = 3
}

export function run(creep: Creep) {
    creep.notifyWhenAttacked(false);


    shootHostileCreeps(creep);

    if (!creep.hasState()) {
        creep.setState(State.MovingToTarget);
    }

    switch(creep.getState()) {
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
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToTarget);
            break;
    }
};

function runDraining(creep: Creep) {
    creep.heal(creep);
}

function runMovingToDrainingPosition(creep: Creep) {
    creep.heal(creep);

    if (roomIsDrainable(creep)) {
        let drainPosition = getDrainingPosition(creep);
        if (creep.pos.getRangeTo(drainPosition) > 0) {
            creep.travelTo({pos: drainPosition});
        } else {
        creep.setState(State.Draining);
        }
    } else {
        creep.memory.target = undefined;
        creep.memory.drainPosition = undefined;
        creep.setState(State.MovingToTarget);
        runMovingToTarget(creep);
    }
}

function runMovingToTarget(creep: Creep) {

    healIfNeeded(creep);

    let targetRoom: string | undefined = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            //log.error("Drainer " + creep.name + " has no target room.", creep.room.name);
            return;
        }
    }

    if (targetRoom === creep.room.name) {
        creep.setState(State.MovingToDrainingPosition);
        runMovingToDrainingPosition(creep);
    } else {
        creep.travelToRoom(targetRoom, {allowSK: true, ignoreRoads: true});
    }
}


function roomIsDrainable(creep: Creep): boolean {
    // Should check if the room has hostile turrets
    let towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: (t: Structure) => t.structureType === STRUCTURE_TOWER}) as StructureTower[];
    return towers.length > 0;
}

function getDrainingPosition(creep: Creep): RoomPosition {
    // Should set and return drainPosition, the best position for draining a room.
    // Closest exit tile and if possible range >19 to all turrets
    let turrets = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER}) as StructureTower[];
    let exits = creep.room.find(FIND_EXIT) as RoomPosition[];

    let goodPositions: RoomPosition[] = [];
    let best: RoomPosition | undefined = undefined;
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

function getNextTargetRoom(creep: Creep): string | undefined {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.target = creep.memory.route.shift();
    } else {
        creep.memory.target = undefined;
    }
    return creep.memory.target;
}

function healIfNeeded(creep: Creep) {
    if (creep.hits < creep.hitsMax || creep.getState() === State.MovingToTarget) {
        creep.heal(creep);
    }
}

function shootHostileCreeps(creep: Creep) {
    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);

    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function(c: Creep) {
        let atPos = c.pos.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART) {
                return false;
            }
        }
        return true;
    })

    if (closeDangerousCreepsNotOnRamparts.length > 0) {
        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
    } else
    {
        let targetToDismantle: Structure | null = Game.getObjectById(creep.memory.targetToDismantle) as Structure;
        if (targetToDismantle instanceof Structure && creep.pos.getRangeTo(targetToDismantle) < 4) {
            creep.rangedAttack(targetToDismantle);
        }
    }
}



/**

Needs to be able to tank 2/4/8 towers at max range. (Tier 1-2-3)

Towers do 150 dmg at range 20+, 45 with boosted TOUGH, 48 heal per boosted HEAL, ATTACK should not be boosted
- T1: Tank 90, heal 90 - 2 TOUGH (b), 8 HEAL, 1 ATTACK (for attention), 11 MOVE
- T2: Tank 180, heal 180 - 3 TOUGH (b), 16 HEAL, 1 ATTACK (for attention), 20 MOVE
- T3: Tank 360, heal 360 - 6 TOUGH (b), 8 HEAL (b), 1 ATTACK (for attention), 17 MOVE

 */
