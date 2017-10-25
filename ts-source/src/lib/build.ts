import * as PositionLib from "../lib/position";

export function getConstructionPointsInRoom(room: Room): number {
    let cs = room.find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];
    if (cs.length > 0) {
        return _.sum(
            _.map(cs,
                function(c: ConstructionSite) {
                    return c.progressTotal - c.progress;
                }));
    }
    let enemySitesNeedingBuilding = room.find(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: (c: ConstructionSite) => c.structureType === STRUCTURE_EXTRACTOR});
    if (enemySitesNeedingBuilding.length > 0 && room.controller !== undefined && room.controller.level > 5 && room.controller.my) {
        return _.sum(
            _.map(enemySitesNeedingBuilding,
                function(c: ConstructionSite) {
                    return c.progressTotal - c.progress;
                }));
    }
    return 0;
}

export function getBuildingCount(room: Room, structureType: string): number {
    return room.find(FIND_STRUCTURES, {filter:
        function(s: Structure) { return s.structureType === structureType; }
    }).length;
}

export function getConstructionSiteCount(room: Room, structureType: string): number {
    return room.find(FIND_CONSTRUCTION_SITES, {filter:
        function(s: Structure) { return s.structureType === structureType; }
    }).length;
}

export function roomHasConstructionSites(room: Room): boolean {
    let constructionSitesInRoom = room.find(FIND_MY_CONSTRUCTION_SITES);

    return constructionSitesInRoom.length > 0;
}

export function buildIfNotPresent(structureType: string, spawnPos: RoomPosition, offsetX: number, offsetY: number,
        keepRoad: boolean = false, destroyOtherStructures: boolean = false): boolean {
    let pos = new RoomPosition(spawnPos.x + offsetX, spawnPos.y + offsetY, spawnPos.roomName);

    if (PositionLib.positionIsBorder(pos)) {
        return false;
    }

    if (!PositionLib.positionHasBuildableGround(pos)) {
        return false;
    }

    let structuresAtPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    let constructionSitesAtPos = pos.lookFor(LOOK_CONSTRUCTION_SITES) as ConstructionSite[];

    for (let s of structuresAtPos) {
        if (s.structureType !== structureType) {
            if ((destroyOtherStructures || (!keepRoad && s.structureType === STRUCTURE_ROAD)) && s.structureType !== STRUCTURE_RAMPART) {
                s.destroy();
            } else
            if ((s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_RAMPART) && structureType !== STRUCTURE_RAMPART) {
                return false;
            }
        } else
        if (s.structureType === structureType) {
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
        } else
        if (c.structureType === structureType) {
            return false;
        }
    }
    return pos.createConstructionSite(structureType) === OK;
}
