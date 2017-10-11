"use strict";
const PositionLib = require("./lib.position");
function getConstructionPointsInRoom(room) {
    let cs = room.find(FIND_MY_CONSTRUCTION_SITES);
    if (cs.length > 0) {
        return _.sum(_.map(cs, function (c) {
            return c.progressTotal - c.progress;
        }));
    }
    let enemySitesNeedingBuilding = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_EXTRACTOR });
    if (enemySitesNeedingBuilding.length > 0 && room.controller !== undefined && room.controller.level > 5 && room.controller.my) {
        return _.sum(_.map(enemySitesNeedingBuilding, function (c) {
            return c.progressTotal - c.progress;
        }));
    }
    return 0;
}
exports.getConstructionPointsInRoom = getConstructionPointsInRoom;
function getBuildingCount(room, structureType) {
    return room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType === structureType; }
    }).length;
}
exports.getBuildingCount = getBuildingCount;
function getConstructionSiteCount(room, structureType) {
    return room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType === structureType; }
    }).length;
}
exports.getConstructionSiteCount = getConstructionSiteCount;
function roomHasConstructionSites(room) {
    let constructionSitesInRoom = room.find(FIND_MY_CONSTRUCTION_SITES);
    return constructionSitesInRoom.length > 0;
}
exports.roomHasConstructionSites = roomHasConstructionSites;
function buildIfNotPresent(structureType, spawnPos, offsetX, offsetY, keepRoad = false, destroyOtherStructures = false) {
    let pos = new RoomPosition(spawnPos.x + offsetX, spawnPos.y + offsetY, spawnPos.roomName);
    if (PositionLib.positionIsBorder(pos)) {
        return false;
    }
    if (!PositionLib.positionHasBuildableGround(pos)) {
        return false;
    }
    let structuresAtPos = pos.lookFor(LOOK_STRUCTURES);
    let constructionSitesAtPos = pos.lookFor(LOOK_CONSTRUCTION_SITES);
    for (let s of structuresAtPos) {
        if (s.structureType !== structureType) {
            if ((destroyOtherStructures || (!keepRoad && s.structureType === STRUCTURE_ROAD)) && s.structureType !== STRUCTURE_RAMPART) {
                s.destroy();
            }
            else if ((s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_RAMPART) && structureType !== STRUCTURE_RAMPART) {
                return false;
            }
        }
        else if (s.structureType === structureType) {
            return false;
        }
    }
    for (let c of constructionSitesAtPos) {
        if (c.structureType !== structureType) {
            if (destroyOtherStructures || (!keepRoad && c.structureType === STRUCTURE_ROAD)) {
                c.remove();
            }
            if (c.structureType !== STRUCTURE_ROAD && c.structureType !== STRUCTURE_RAMPART) {
                return false;
            }
        }
        else if (c.structureType === structureType) {
            return false;
        }
    }
    return pos.createConstructionSite(structureType) === OK;
}
exports.buildIfNotPresent = buildIfNotPresent;
