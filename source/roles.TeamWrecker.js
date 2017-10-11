"use strict";
const _Common = require("./rolelib.common");
const _Targeting = require("./rolelib.targeting");
const PositionLib = require("./lib.position");
const RouteTravel = require("./rolelib.routetravel");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["Waiting"] = 1] = "Waiting";
    State[State["MovingToTarget"] = 2] = "MovingToTarget";
    State[State["Wrecking"] = 3] = "Wrecking";
    State[State["MoveToStartPosition"] = 4] = "MoveToStartPosition";
    State[State["Guarding"] = 5] = "Guarding";
})(State || (State = {}));
function run(creep) {
    creep.notifyWhenAttacked(false);
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }
    shootHostileCreeps(creep);
    switch (creep.getState()) {
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.MoveToStartPosition:
            runMoveToStartPosition(creep);
            break;
        case State.Wrecking:
            runWrecking(creep);
            break;
        case State.Guarding:
            runGuarding(creep);
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
    let healer = getHealer(creep);
    if (healer instanceof Creep) {
        creep.setState(State.MoveToStartPosition);
    }
    else {
        _Common.moveOffRoad(creep);
    }
}
function runMoveToStartPosition(creep) {
    let startRoom = creep.memory.target;
    if (startRoom === undefined) {
        startRoom = getNextTargetRoom(creep);
        if (startRoom === undefined) {
            Logger_1.log.error("TeamWrecker " + creep.name + " has no target room.", creep.room.name);
            return;
        }
    }
    let healer = getHealer(creep);
    if (healer !== null && Game.map.getRoomLinearDistance(healer.pos.roomName, creep.room.name) > 5) {
        moveHealerIntoPortal(creep);
    }
    if (healer !== null && needToWaitForHealer(creep, healer)) {
        return;
    }
    if (startRoom !== creep.room.name) {
        if (!destroyWallInPath(creep)) {
            RouteTravel.travelByRoute(creep, { allowSK: true });
        }
    }
    else {
        creep.setState(State.MovingToTarget);
        runMovingToTarget(creep);
    }
}
function runMovingToTarget(creep) {
    let healer = getHealer(creep);
    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            creep.setState(State.Guarding);
            return;
        }
    }
    if (healer instanceof Creep && needToWaitForHealer(creep, healer)) {
        return;
    }
    if (targetRoom === creep.room.name) {
        creep.setState(State.Wrecking);
        runWrecking(creep);
    }
    else {
        if (!destroyWallInPath(creep)) {
            creep.travelToRoom(targetRoom, { allowSK: true });
        }
    }
}
function runWrecking(creep) {
    let targetRoom = creep.memory.target;
    if (creep.room.name !== targetRoom && targetRoom !== undefined) {
        creep.setState(State.MovingToTarget);
        return;
    }
    let targetToDismantle = getTargetToDismantle(creep);
    if (targetToDismantle !== null) {
        moveAndDismantle(creep, targetToDismantle);
    }
    else {
        targetToDismantle = getNewTargetToDismantle(creep);
        if (targetToDismantle !== null) {
            creep.memory.targetToDismantle = targetToDismantle.id;
            moveAndDismantle(creep, targetToDismantle);
        }
        else {
            let targetRoom = getNextTargetRoom(creep);
            Logger_1.log.info("TeamWrecker " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
            creep.setState(State.MovingToTarget);
            runMovingToTarget(creep);
        }
    }
}
function runGuarding(creep) {
    let targetToDismantle = getTargetToDismantle(creep);
    if (targetToDismantle !== null) {
        moveAndDismantle(creep, targetToDismantle);
    }
    else {
        targetToDismantle = getNewTargetToDismantle(creep);
        if (targetToDismantle !== null) {
            creep.memory.targetToDismantle = targetToDismantle.id;
            moveAndDismantle(creep, targetToDismantle);
        }
    }
}
function destroyWallInPath(creep) {
    if (creep.memory._travel !== undefined && creep.memory._travel.stuck !== undefined && creep.memory._travel.stuck === 1 &&
        creep.memory._travel.path !== undefined && creep.memory._travel.path.length > 0) {
        let position = PositionLib.positionAtDirection(creep.pos, creep.memory._travel.path.substr(0, 1));
        if (position !== undefined && creep.pos.getRangeTo(position) === 1) {
            let atPos = position.lookFor(LOOK_STRUCTURES);
            for (let s of atPos) {
                if (s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && !s.my)) {
                    creep.dismantle(s);
                    return true;
                }
            }
        }
    }
    return false;
}
function getTargetToDismantle(creep) {
    let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
    if (targetToDismantle instanceof Structure) {
        return targetToDismantle;
    }
    else {
        return null;
    }
}
function needToWaitForHealer(creep, healer) {
    if (healer.fatigue > 0) {
        return true;
    }
    if (creep.pos.inRangeTo(healer.pos, 1) || PositionLib.positionIsBorderOrNextToBorder(creep.pos) ||
        PositionLib.positionHasPortal(creep.pos)) {
        return false;
    }
    return true;
}
function shootHostileCreeps(creep) {
    let closeDangerousCreeps = _Targeting.findHostileCreepsInRangedRange(creep.pos);
    let closeDangerousCreepsNotOnRamparts = _.filter(closeDangerousCreeps, function (c) {
        let atPos = c.pos.lookFor(LOOK_STRUCTURES);
        for (let sAtPos of atPos) {
            if (sAtPos.structureType === STRUCTURE_RAMPART) {
                return false;
            }
        }
        return true;
    });
    if (closeDangerousCreepsNotOnRamparts.length > 0) {
        creep.rangedAttack(closeDangerousCreepsNotOnRamparts[0]);
    }
    else {
        let targetToDismantle = Game.getObjectById(creep.memory.targetToDismantle);
        if (targetToDismantle instanceof Structure && creep.pos.getRangeTo(targetToDismantle) < 4) {
            creep.rangedAttack(targetToDismantle);
        }
    }
}
function getHealer(creep) {
    let healer = Game.getObjectById(creep.memory.healer);
    return healer;
}
function getNewTargetToDismantle(creep) {
    let pillage = creep.memory.pillage === true;
    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room, pillage);
    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);
    if (vitalStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
    }
    let allStructures = _.filter(_Targeting.findHostileStructures(creep.room), (s) => s.structureType !== STRUCTURE_LINK && s.structureType !== STRUCTURE_EXTRACTOR);
    if (pillage) {
        allStructures = _Targeting.filterPillageableStructuresFromList(allStructures);
    }
    let allStructuresWithoutBigRampart = _.filter(_Targeting.filterStructuresOnBigRamparts(allStructures), (s) => s.structureType !== STRUCTURE_LINK && s.structureType !== STRUCTURE_EXTRACTOR);
    if (allStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
    }
    if (vitalStructures.length > 0) {
        return creep.pos.findClosestByRange(vitalStructures);
    }
    if (allStructures.length > 0) {
        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
    }
    return null;
}
function moveAndDismantle(creep, targetToDismantle) {
    let shouldIMove = true;
    let healer = getHealer(creep);
    if ((healer !== null && creep.pos.getRangeTo(healer) > 1) && !PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        shouldIMove = false;
    }
    let range = creep.pos.getRangeTo(targetToDismantle);
    if (range === 1) {
        creep.dismantle(targetToDismantle);
        if (PositionLib.positionNextToBorder(creep.pos)) {
            moveHealerIntoRoom(creep);
        }
    }
    if (range > 1 && shouldIMove) {
        let response = creep.moveTo(targetToDismantle);
        if (response === ERR_NO_PATH) {
            findWallToDestroy(creep, targetToDismantle);
        }
    }
}
function moveHealerIntoRoom(creep) {
    let healer = getHealer(creep);
    if (healer instanceof Creep && PositionLib.positionIsBorder(healer.pos) && healer.pos.getRangeTo(creep.pos) === 1) {
        healer.memory.doNotMove = true;
        let d = randomDirectionClose(healer.pos.getDirectionTo(creep.pos));
        healer.move(d);
    }
}
function moveHealerIntoPortal(creep) {
    let healer = getHealer(creep);
    if (healer instanceof Creep) {
        let portal = healer.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
        if (portal !== undefined) {
            healer.moveTo(portal);
            healer.memory.doNotMove = true;
        }
    }
}
function randomDirectionClose(direction) {
    let random = 1;
    if (Math.random() < 0.5) {
        random = -1;
    }
    let zeroIndexedDirection = direction - 1;
    let zeroIndexedCloseDirection = (zeroIndexedDirection + random) % 8;
    let closeDirection = zeroIndexedCloseDirection + 1;
    return closeDirection;
}
function findWallToDestroy(creep, targetToDismantle) {
    let path = PathFinder.search(creep.pos, { pos: targetToDismantle.pos, range: 1 }, { maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
    }).path;
    for (let roomPos of path) {
        let structures = roomPos.lookFor(LOOK_STRUCTURES);
        if (structures.length > 0) {
            for (let s of structures) {
                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                    Logger_1.log.info("TeamWrecker needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
                    creep.memory.targetToDismantle = s.id;
                    return;
                }
            }
        }
    }
    Logger_1.log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
}
function getRoomCallbackForWallDestruction(roomName) {
    let room = Game.rooms[roomName];
    if (!room)
        return new PathFinder.CostMatrix;
    let costs = new PathFinder.CostMatrix;
    room.find(FIND_STRUCTURES).forEach(function (structure) {
        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 100000));
        }
    });
    return costs;
}
function getNextTargetRoom(creep) {
    if (creep.memory.targets !== undefined && creep.memory.targets.length > 0) {
        creep.memory.target = creep.memory.targets.shift();
    }
    else {
        creep.memory.target = undefined;
    }
    return creep.memory.target;
}
