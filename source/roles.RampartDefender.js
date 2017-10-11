"use strict";
const _Common = require("./rolelib.common");
const PositionLib = require("./lib.position");
const _Targeting = require("./rolelib.targeting");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["Waiting"] = 1] = "Waiting";
    State[State["MovingToPosition"] = 2] = "MovingToPosition";
    State[State["Attacking"] = 3] = "Attacking";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }
    if (creep.ticksToLive === 1498) {
        setBoosting(creep);
    }
    switch (creep.getState()) {
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
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
}
exports.run = run;
;
function runWaiting(creep) {
    let enemies = _Targeting.findHostileCreepsInRoom(creep.room);
    for (let c of enemies) {
        let rampartNextToEnemy = findRampartNextToEnemy(c);
        if (rampartNextToEnemy !== undefined) {
            creep.memory.targetEnemy = c.id;
            creep.memory.rampart = rampartNextToEnemy.id;
            creep.setState(State.MovingToPosition);
            runMovingToPosition(creep);
            return;
        }
    }
    if (enemies.length > 0) {
        let prioritizedTarget = _Targeting.getPrioritizedTarget(creep);
        if (prioritizedTarget !== null) {
            let distance = creep.pos.getRangeTo(prioritizedTarget.pos);
            if (!PositionLib.positionIsBorder(prioritizedTarget.pos)) {
                if (distance > 1) {
                    creep.moveTo(prioritizedTarget, { maxRooms: 1 });
                }
                else {
                    creep.moveTo(prioritizedTarget, { ignoreCreeps: true, maxRooms: 1 });
                }
            }
            if (distance === 1) {
                creep.attack(prioritizedTarget);
            }
            return;
        }
    }
    _Common.moveOffRoad(creep);
}
function runMovingToPosition(creep) {
    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart);
    let enemy = Game.getObjectById(creep.memory.targetEnemy);
    if (rampartNextToEnemy === null || enemy === null || rampartNextToEnemy.pos.getRangeTo(enemy) > 1) {
        creep.memory.targetEnemy = undefined;
        creep.memory.rampart = undefined;
        creep.setState(State.Waiting);
        return;
    }
    if (rampartNextToEnemy.pos.getRangeTo(creep) === 1) {
        let rampartOccupiedBy = getCreepInPosition(rampartNextToEnemy.pos);
        if (rampartOccupiedBy !== undefined) {
            rampartOccupiedBy.moveTo(creep.pos);
        }
        creep.moveTo(rampartNextToEnemy);
    }
    else if (rampartNextToEnemy.pos.getRangeTo(creep) > 0) {
        creep.moveTo(rampartNextToEnemy);
    }
    else {
        creep.setState(State.Attacking);
        runAttacking(creep);
    }
}
function runAttacking(creep) {
    let rampartNextToEnemy = Game.getObjectById(creep.memory.rampart);
    let enemy = Game.getObjectById(creep.memory.targetEnemy);
    if (rampartNextToEnemy === null || enemy === null) {
        creep.memory.targetEnemy = undefined;
        creep.memory.rampart = undefined;
        creep.setState(State.Waiting);
        return;
    }
    else if (rampartNextToEnemy.pos.getRangeTo(enemy) > 1) {
        enemy = findEnemyNextToPosition(rampartNextToEnemy.pos);
        if (enemy === null) {
            creep.memory.targetEnemy = undefined;
            creep.memory.rampart = undefined;
            creep.setState(State.Waiting);
            return;
        }
        creep.memory.targetEnemy = enemy.id;
    }
    creep.room.memory.priTarget = enemy.id;
    creep.attack(enemy);
}
function setBoosting(creep) {
    let threat = creep.room.memory.threat;
    if (threat === undefined) {
        return;
    }
    let boostLevelWanted = defendersShouldBoost(threat);
    if (boostLevelWanted === 2 && hasMineralsForBoost(creep.room, 30, RESOURCE_CATALYZED_UTRIUM_ACID)) {
        creep.memory.boost = [RESOURCE_CATALYZED_UTRIUM_ACID];
    }
    else if (boostLevelWanted > 0 && hasMineralsForBoost(creep.room, 30, RESOURCE_UTRIUM_HYDRIDE)) {
        creep.memory.boost = [RESOURCE_UTRIUM_HYDRIDE];
    }
}
function getCreepInPosition(pos) {
    let creep = pos.lookFor(LOOK_CREEPS);
    if (creep.length > 0) {
        return creep[0];
    }
    return undefined;
}
function findRampartNextToEnemy(enemy) {
    for (let x of _.range(enemy.pos.x - 1, enemy.pos.x + 2)) {
        for (let y of _.range(enemy.pos.y - 1, enemy.pos.y + 2)) {
            if (x > 0 && x < 49 && y > 0 && y < 49) {
                let atPos = (new RoomPosition(x, y, enemy.pos.roomName)).lookFor(LOOK_STRUCTURES);
                for (let s of atPos) {
                    if (s.structureType === STRUCTURE_RAMPART) {
                        return s;
                    }
                }
            }
        }
    }
}
function findEnemyNextToPosition(pos) {
    for (let x of _.range(pos.x - 1, pos.x + 2)) {
        for (let y of _.range(pos.y - 1, pos.y + 2)) {
            if (x > 0 && x < 49 && y > 0 && y < 49) {
                let atPos = (new RoomPosition(x, y, pos.roomName)).lookFor(LOOK_CREEPS);
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
function defendersShouldBoost(threat) {
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
function hasMineralsForBoost(room, count, mineral) {
    if (room.terminal === undefined || room.terminal.store[mineral] === undefined) {
        return false;
    }
    return room.terminal.store[mineral] > (count * 30);
}
