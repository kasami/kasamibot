/**
 * BaseRanger
 *
 * Used to defend bases under siege
 *
 * MEMORY
 *   targetEnemy
 *
 */

import * as _Common from "../rolelib/common";

import * as _Targeting from "../rolelib/targeting";
import * as _Military from "../rolelib/military";

import {Threat} from "../classes/Threat";

import {log} from "../tools/Logger";

enum State {
    Waiting = 1,
    MovingToPosition = 2,
    Attacking = 3
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }

    if (creep.ticksToLive === 1498) {
        setBoosting(creep);
    }

    switch(creep.getState()) {
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.MovingToPosition:
            runMovingToPosition(creep);
            break;
        case State.Attacking:
            runAttacking(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
};

function runWaiting(creep: Creep): void {
    let enemies = _Targeting.findHostileCreepsInRoom(creep.room);
    for (let c of enemies) {
        let rampartCloseToEnemy = findRampartCloseToEnemy(c);
        if (rampartCloseToEnemy !== undefined) {
            creep.memory.targetEnemy = c.id;
            creep.memory.rampart = rampartCloseToEnemy.id;
            creep.setState(State.MovingToPosition);
            runMovingToPosition(creep);
            return;
        }
    }
    if (enemies.length > 0) {
        let prioritizedTarget = _Targeting.getPrioritizedTarget(creep);
        if (prioritizedTarget !== null) {
            _Military.kiteAndAttack(creep, prioritizedTarget);
            return;
        }
    }

    _Common.moveOffRoad(creep);
}

function runMovingToPosition(creep: Creep): void {
    let rampartCloseToEnemy = Game.getObjectById(creep.memory.rampart) as StructureRampart | null;
    let enemy = Game.getObjectById(creep.memory.targetEnemy) as Creep | null;

    if (rampartCloseToEnemy === null || enemy === null || rampartCloseToEnemy.pos.getRangeTo(enemy) > 3) {
        creep.memory.targetEnemy = undefined;
        creep.memory.rampart = undefined;
        creep.setState(State.Waiting);
        return;
    }

    if (creep.pos.getRangeTo(enemy) < 4) {
        creep.rangedAttack(enemy);
    } else {
        shootHostileCreeps(creep);
    }

    if (rampartCloseToEnemy.pos.getRangeTo(creep) === 1) {
        let result = getCreepInPosition(rampartCloseToEnemy.pos);
        if (result !== undefined) {
            creep.memory.rampart = undefined;
        }
        creep.moveTo(rampartCloseToEnemy);
    } else
    if (rampartCloseToEnemy.pos.getRangeTo(creep) > 0) {
        creep.moveTo(rampartCloseToEnemy);
    } else {
        creep.setState(State.Attacking);
        runAttacking(creep);
    }
}

function runAttacking(creep: Creep): void {
    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart) as StructureRampart | null;
    let enemy = Game.getObjectById(creep.memory.targetEnemy) as Creep | null;
    if (rampartNextToEnemy === null || enemy === null) {
        creep.memory.targetEnemy = undefined;
        creep.memory.rampart = undefined;
        creep.setState(State.Waiting);
        return;
    } else
    if (rampartNextToEnemy.pos.getRangeTo(enemy) > 3) {
        enemy = findEnemyNextToPosition(rampartNextToEnemy.pos);
        if (enemy === null) {
            shootHostileCreeps(creep);
            creep.memory.targetEnemy = undefined;
            creep.memory.rampart = undefined;
            creep.setState(State.Waiting);
            return;
        }
        creep.memory.targetEnemy = enemy.id;
    }
    creep.rangedAttack(enemy);
}

function setBoosting(creep: Creep) {
    let threat = creep.room.memory.threat as Threat;
    if (threat === undefined) {
        return;
    }

    let boostLevelWanted = defendersShouldBoost(threat);
    if (boostLevelWanted === 2 && hasMineralsForBoost(creep.room, 30, RESOURCE_CATALYZED_KEANIUM_ALKALIDE)) {
        creep.memory.boost = [RESOURCE_CATALYZED_KEANIUM_ALKALIDE];
    } else
    if (boostLevelWanted > 0 && hasMineralsForBoost(creep.room, 30, RESOURCE_KEANIUM_OXIDE)) {
        creep.memory.boost = [RESOURCE_KEANIUM_OXIDE];
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
    }
}


function defendersShouldBoost(threat: Threat): number {
    if (threat.boostedTough < 15) {
        return 0;
    }
    if (threat.boostedHeal < 15) {
        return 0;
    }
    if (threat.boostedAttack < 15 && threat.boostedWork < 15) {
        return 0;
    }
    if (threat.boostedTough < 40) {
        return 1;
    }
    if (threat.boostedHeal < 40) {
        return 1;
    }
    if (threat.boostedAttack < 40 && threat.boostedWork < 40) {
        return 1;
    }
    return 2;
}

function hasMineralsForBoost(room: Room, count: number, mineral: string): boolean {
    if (room.terminal === undefined || room.terminal.store[mineral] === undefined) {
        return false;
    }
    return room.terminal.store[mineral] > (count * 30);
}

function getCreepInPosition(pos: RoomPosition): Creep | undefined {
    let creep = pos.lookFor(LOOK_CREEPS) as Creep[];
    if (creep.length > 0) {
        return creep[0];
    }
    return undefined
}

function findRampartCloseToEnemy(enemy: Creep): StructureRampart | undefined {
    for (let x of _.range(enemy.pos.x - 3, enemy.pos.x + 4)) {
        for (let y of _.range(enemy.pos.y - 3, enemy.pos.y + 4)) {
            if (x > 0 && x < 49 && y > 0 && y < 49) {
                let pos = new RoomPosition(x, y, enemy.pos.roomName);
                if (pos.getRangeTo(enemy) > 1) {
                    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
                    for (let s of atPos) {
                        if (s.structureType === STRUCTURE_RAMPART) {
                            let cAtPos = pos.lookFor(LOOK_CREEPS) as Creep[];
                            if (cAtPos.length === 0) {
                                return s as StructureRampart;
                            }
                        }
                    }
                }
            }
        }
    }
}

function findEnemyNextToPosition(pos: RoomPosition): Creep | null {
    for (let x of _.range(pos.x - 3, pos.x + 4)) {
        for (let y of _.range(pos.y - 3, pos.y + 4)) {
            if (x > 0 && x < 49 && y > 0 && y < 49) {
                let atPos = (new RoomPosition(x, y, pos.roomName)).lookFor(LOOK_CREEPS) as Creep[];
                for (let s of atPos) {
                    if (!s.my) {
                        return s;
                    }
                }
            }
        }
    }
    return null;
}
