"use strict";
function travelByRoute(creep, options, enemyCheck) {
    let routeTarget = creep.memory.routeTarget;
    if (routeTarget === undefined || routeTarget === creep.room.name) {
        routeTarget = getNextTargetRoom(creep);
        if (routeTarget === undefined) {
            routeTarget = creep.memory.target;
            if (routeTarget === undefined) {
                return false;
            }
        }
    }
    if (creep.memory.routePortal !== undefined) {
        let portal = Game.getObjectById(creep.memory.routePortal);
        if (portal !== undefined && portal !== null && portal.pos !== undefined && portal.pos.roomName === creep.pos.roomName) {
            if (options) {
                options.range = 0;
            }
            else {
                options = { range: 0 };
            }
            creep.travelTo(portal, options, enemyCheck);
        }
        else if (creep.memory.routeTarget !== undefined) {
            if (Game.map.getRoomLinearDistance(creep.room.name, creep.memory.routeTarget, false) < 10) {
                creep.travelToRoom(routeTarget, options, enemyCheck);
            }
        }
        else {
            creep.memory.routePortal = undefined;
        }
    }
    else {
        creep.travelToRoom(routeTarget, options, enemyCheck);
    }
    return true;
}
exports.travelByRoute = travelByRoute;
function getNextTargetRoom(creep) {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.routeTarget = creep.memory.route.shift();
        creep.memory.routePortal = undefined;
    }
    else {
        creep.memory.routeTarget = undefined;
    }
    if (creep.memory.routeTarget !== undefined && creep.memory.routeTarget.charAt(0) === '$') {
        creep.memory.routeTarget = creep.memory.routeTarget.slice(1);
        creep.memory.routePortal = getPortalInRoom(creep);
    }
    return creep.memory.routeTarget;
}
function getPortalInRoom(creep) {
    let portal = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_PORTAL });
    if (portal !== undefined) {
        return portal.id;
    }
    return undefined;
}
