/**
 * OutpostDefender
 *
 * Used to defend outposts around a room
 *
 */

import * as _Common from "../rolelib/common";
import * as _Military from "../rolelib/military";
import * as _Targeting from "../rolelib/targeting";

import * as PositionLib from "../lib/position";
import * as IntelLib from "../lib/intel";
import * as DamageLib from "../lib/damage";

import {log} from "../tools/Logger";

export enum State {
    Standby = 1,
    MovingToTargetRoom = 2,
    Defending = 3,
    WaitingForSupport = 4,
    RunHomeForHeal = 5,
    WaitingForWarrior = 6
}

export function run(creep: Creep) {
    creep.notifyWhenAttacked(false);

    if (!creep.hasState()) {
        creep.setState(State.Standby);
    }

    let hasHealed = healIfNeeded(creep);

    switch(creep.getState()) {
        case State.Standby:
            runStandby(creep);
            break;
        case State.MovingToTargetRoom:
            runMovingToTargetRoom(creep);
            break;
        case State.Defending:
            if (!hasHealed) {
                creep.heal(creep);
            }
            runDefending(creep);
            break;
        case State.WaitingForSupport:
            runWaitingForSupport(creep);
            break;
        case State.WaitingForWarrior:
            runWaitingForWarrior(creep);
            break;
        case State.RunHomeForHeal:
            runRunHomeForHeal(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Standby);
            break;
    }
};

function runStandby(creep: Creep): void {
    let targetRoom = getTargetRoom(creep);
    if (targetRoom !== undefined) {
        creep.setState(State.MovingToTargetRoom);
        runMovingToTargetRoom(creep);
        return;
    }

    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorder(creep.pos)) {
        creep.travelToRoom(homeroom, {allowHostile: false}, true);
        return;
    }

    _Common.moveOffRoad(creep);
}

function runMovingToTargetRoom(creep: Creep): void {
    let targetRoom = getTargetRoom(creep);
    let supporter = getSupporter(creep);
    let warrior = getWarrior(creep);
    if (targetRoom === undefined) {
        creep.setState(State.Standby);
        return;
    }
    if (targetRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
        _Military.rangedAttackToEnemiesAround(creep);
        if ((supporter === undefined || creep.pos.getRangeTo(supporter) < 2 || supporter.pos.roomName !== creep.pos.roomName) &&
            (warrior === undefined || creep.pos.getRangeTo(warrior) < 4 || warrior.pos.roomName !== creep.pos.roomName)) {
            creep.travelToRoom(targetRoom, {allowHostile: false});
        }
        return;
    }
    log.info("Defender starting to defend outpost", creep.room.name);
    creep.setState(State.Defending);
    runDefending(creep);
}

function runDefending(creep: Creep): void {

    if (IntelLib.isOwned(creep.pos.roomName)) {
        let targetRoom = getTargetRoom(creep);
        if (creep.pos.roomName === targetRoom) {
            creep.memory.target = undefined;
            creep.setState(State.Standby);
            return;
        }
        creep.setState(State.MovingToTargetRoom);
        return;
    }

    if (creep.getActiveBodyparts(RANGED_ATTACK) === 0) {
        if (getWarrior(creep) !== undefined) {
            if (creep.room.name !== creep.getHomeroom()){
                creep.room.memory.undefendable = Game.time + 5000;
                creep.memory.target = undefined;
                log.alert("Defender tags room as undefendable", creep.room.name);
            }
            creep.setState(State.Standby);
        } else {
            creep.setState(State.WaitingForWarrior);
            runWaitingForWarrior(creep);
            log.alert("Defender needs warrior to defend outpost", creep.room.name);
        }
        return;
    }

    let targetEnemy = getTargetEnemy(creep);
    let supporter = getSupporter(creep);

    if (Game.time % 5 === 0 || targetEnemy === undefined) {
        // Reevaluate targets every 5. tick
        targetEnemy = getNewTargetEnemy(creep);

        if (targetEnemy instanceof Creep && supporter === undefined) {
            let enemyStats = DamageLib.getStatsForCreep(targetEnemy);
            let creepStats = DamageLib.getStatsForCreep(creep);

            if (enemyStats.rpt > creepStats.hpt * 3 || enemyStats.hpt > creepStats.rpt) {
                log.alert("Defender needs warrior to defend outpost", creep.room.name);
                creep.setState(State.WaitingForWarrior);
                runWaitingForWarrior(creep);
                return;
            }
            if (enemyStats.rpt > creepStats.hpt) {
                log.alert("Defender needs supporter to defend outpost", creep.room.name);
                creep.setState(State.WaitingForSupport);
                runWaitingForSupport(creep);
                return;
            }
        }

        if (targetEnemy === undefined) {
            setRoomAsSafe(creep);
            if (creep.memory.cooldown === undefined) {
                creep.memory.cooldown = 30;
            } else
            if (creep.memory.cooldown > 0) {
                creep.memory.cooldown--;
            } else {
                creep.memory.cooldown = undefined;
                creep.setState(State.Standby);
            }
            return;
        }
    }
    if (supporter === undefined || creep.pos.getRangeTo(supporter) < 4) {
        let wantedRange = 3;
        if (targetEnemy instanceof Creep && targetEnemy.getActiveBodyparts(ATTACK) === 0 && targetEnemy.getActiveBodyparts(RANGED_ATTACK) === 0) {
            wantedRange = 1;
        } else
        if (targetEnemy instanceof Structure) {
            wantedRange = 2;
        }
        if (!_Military.kiteAndAttack(creep, targetEnemy, wantedRange)) {
            _Military.rangedAttackToEnemiesAround(creep);
        }
    } else {
        _Military.rangedAttackToEnemiesAround(creep);
    }
}

function runWaitingForSupport(creep: Creep): void {

    let supporter = getSupporter(creep);
    if (supporter !== undefined) {
        creep.setState(State.MovingToTargetRoom);
        log.alert("Defender has gotten supporter and returns defending", creep.room.name);
        return;
    }

    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(homeroom, {allowHostile: false});
        return;
    }

    _Common.moveOffRoad(creep);
}

function runWaitingForWarrior(creep: Creep): void {

    let warrior = getWarrior(creep);
    let supporter = getSupporter(creep);
    if (warrior !== undefined && supporter !== undefined) {
        creep.setState(State.MovingToTargetRoom);
        log.alert("Defender has gotten warrior and returns defending", creep.room.name);
        return;
    }

    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(homeroom, {allowHostile: false});
        return;
    }

    _Common.moveOffRoad(creep);
}

function runRunHomeForHeal(creep: Creep): void {

    let homeroom = creep.getHomeroom();
    if (creep.room.name !== creep.getHomeroom() || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(homeroom, {allowHostile: false});
        return;
    }

    if (creep.missingHits() === 0) {
        creep.setState(State.Standby);
        return;
    }

    _Common.moveOffRoad(creep);
}

function getTargetRoom(creep: Creep): string | undefined {
    let targetRoom: string | undefined = creep.memory.target;
    return targetRoom;
}

function healIfNeeded(creep: Creep): boolean {
    if (creep.getActiveBodyparts(HEAL) < 1) {
        return true;
    }
    let supporter = getSupporter(creep);
    let warrior = getWarrior(creep);

    let lowestHp = creep;

    if (supporter !== undefined && creep.pos.getRangeTo(supporter) < 4 && supporter.missingHits() > lowestHp.missingHits()) {
        lowestHp = supporter;
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

function getNewTargetEnemy(creep: Creep): Creep | Structure | undefined {
    let newTarget = _Targeting.getPrioritizedTargetIncludingVitalBuildings(creep);
    if (newTarget === null) {
        creep.memory.targetEnemy = undefined;
        return undefined;
    }
    creep.memory.targetEnemy = newTarget.id;
    return newTarget;
}

function getTargetEnemy(creep: Creep): Creep | Structure | undefined {
    let targetEnemy =  Game.getObjectById(creep.memory.targetEnemy) as Creep | Structure | null;
    if (targetEnemy === null) {
        return undefined;
    }
    return targetEnemy;
}

function setRoomAsSafe(creep: Creep) {
    IntelLib.saveIntelForRoom(creep.room);
    creep.memory.target = undefined;
}

function getSupporter(creep: Creep): Creep | undefined {
    let supporter = Game.getObjectById(creep.memory.supporter) as Creep;
    if (supporter === null) {
        creep.memory.supporter = undefined;
        return undefined;
    }
    return supporter;
}


function getWarrior(creep: Creep): Creep | undefined {
    let warrior = Game.getObjectById(creep.memory.warrior) as Creep;
    if (warrior === null) {
        creep.memory.warrior = undefined;
        return undefined;
    }
    return warrior;
}
