import * as RoomRepository from "../repository/Room";

export function getPossibleExtensionsCount(room: Room): number {
    if (room === undefined || room.controller === undefined || room.controller.level < 2) {
        return 0;
    }
    switch (room.controller.level) {
        case 2:
            return 5;
        case 3:
            return 10;
        case 4:
            return 20;
        case 5:
            return 30;
        case 6:
            return 40;
        case 7:
            return 50;
        case 8:
            return 60;
        default:
            return 0;
    }
}

export function getExtensionPositions(): number[][] {
    let positions = [
        [-2,-2], [ 2,-2], [-1,-3], [ 0,-3], [ 1,-3],
        [-3,-2], [ 3,-2], [-2,-4], [ 0,-4], [ 2,-4],
        [-3,-3], [-4,-3], [-4,-4], [-3,-5], [-2,-5],
        [ 3,-3], [ 4,-3], [ 4,-4], [ 3,-5], [ 2,-5],
        [-5,-4], [-5,-5], [-5,-6], [-4,-6], [-3,-6],
        [ 5,-4], [ 5,-5], [ 5,-6], [ 4,-6], [ 3,-6],
        [-1,-5], [-1,-6], [ 0,-6], [ 1,-6], [ 1,-5],
        [-4, 0], [-5, 0], [-6, 0], [-4, 1], [-6, 1],
        [-5, 2], [-6, 2], [-4, 3], [-6, 3],
        [-4, 4], [-5, 4], [-6, 4],
        [ 4, 0], [ 5, 0], [ 6, 0], [ 4, 1], [ 6, 1],
        [ 5, 2], [ 6, 2], [ 4, 3], [ 6, 3],
        [ 4, 4], [ 5, 4], [ 6, 4], // After this is reserves
        [ 5,-1], [-5,-1], [ 6,-1], [-6,-1],
        [ 7,-2], [-7,-2], [ 8,-3], [-8,-3],
        [-5, 6], [-6, 7], [-5, 7], [-4, 7], [-5, 8],
        [ 5, 6], [ 6, 7], [ 5, 7], [ 4, 7], [ 5, 8]
        ];
    return positions;
}

export function getPossibleTowerCount(room: Room): number {
    if (room === undefined || room.controller === undefined || room.controller.level < 3) {
        return 0;
    }
    switch (room.controller.level) {
        case 3:
            return 1;
        case 4:
            return 1;
        case 5:
            return 2;
        case 6:
            return 2;
        case 7:
            return 3;
        case 8:
            return 6;
        default:
            return 0;
    }
}
export function getTowerPositions(): number[][] {
    let positions = [
        [ 2, 1], [-2, 1], [ 3, 2], [-3, 2], [-3, 3], [ 3, 3]
        ];
    return positions;
}

export function getPossibleSpawnCount(room: Room): number {
    if (room === undefined || room.controller === undefined || room.controller.level < 1) {
        return 0;
    }
    switch (room.controller.level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return 1;
        case 7:
            return 2;
        case 8:
            return 3;
        default:
            return 0;
    }
}

export function getPossibleLinkCount(room: Room): number {
    if (room === undefined || room.controller === undefined || room.controller.level < 1) {
        return 0;
    }
    switch (room.controller.level) {
        case 1:
        case 2:
        case 3:
        case 4:
            return 0;
        case 5:
            return 2;
        case 6:
            return 3;
        case 7:
            return 4;
        case 8:
            return 6;
        default:
            return 0;
    }
}

export function getSpawnPositions(): number[][] {
    let positions = [
        [ 0, 0], [ 1,-1], [-1,-1],
        ];
    return positions;
}

export function getColonyRoadPositions(): number[][] {
    let positions = [
        [ 0,-1], [ 0, 1], [ 0, 4],
        [-1,-2], [-1, 2],
        [ 1,-2], [ 1, 2],
        [-1, 0], [ 1, 0], [-1, 3],
        [-1, 1], [ 1, 1], [ 1, 3],
        ];
    return positions;
}

export function getCityRoadPositions(): number[][] {
    let positions = [
        [-2,-1], [ 2,-1], [-2, 0], [ 2, 0],
        [ 0, 2], [ 0, 6], [ 1, 5], [ 2, 4]
        ];
    return positions;
}

export function getAllBaseRoads(basepos: RoomPosition): StructureRoad[] {
    let roads: StructureRoad[] = [];
    let positions = getColonyRoadPositions().concat(getCityRoadPositions());
    for (let a of positions) {
        let pos = new RoomPosition(basepos.x + a[0], basepos.y + a[1], basepos.roomName);
        for (let s of pos.lookFor(LOOK_STRUCTURES) as Structure[]) {
            if (s.structureType === STRUCTURE_ROAD) {
                roads.push(s as StructureRoad);
            }
        }
    }
    return roads;
}

export function getFortressWallPositions(): number[][] {
    let positions = [
        [-3,-1], [-2,-1], [-1,-1], [ 0,-1], [ 1,-1], [ 2,-1], [ 3,-1],
        [-3, 0], [ 3, 0],
        [-3, 1], [ 3, 1],
        [-3, 2], [ 3, 2],
        [-3, 3], [ 3, 3],
        [-3, 4], [ 3, 4],
        [-3, 5], [-2, 5], [-1, 5], [ 0, 5], [ 1, 5], [ 2, 5], [ 3, 5],
        ];
    return positions;
}

export function getImportantBuildingPositions(room: Room): number[][] {
    let positions: number[][] = [];
    let structures = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) =>
        s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER || s.structureType === STRUCTURE_STORAGE}) as Structure[];
    for (let s of structures) {
        positions.push([s.pos.x, s.pos.y]);
    }
    return positions;
}

export function getShellWallPositions(): number[][] {
    let positions = [
        [ 0, 0], [-2, 1], [-2, 2], [ 2, 1], [ 2, 2], [ 0, 3], [ 1, 4],
        ];
    return positions;
}

export function getFortressRamparts(room: Room): Rampart[] {
    let ramparts: Rampart[] = [];
    let positions = getFortressWallPositions().concat(getShellWallPositions());
    let basepos = RoomRepository.getBasePosition(room);
    if (basepos !== undefined) {
        for (let posInfo of positions) {
            let pos = new RoomPosition(basepos.x + posInfo[0], basepos.y + posInfo[1], basepos.roomName);
            let structures = pos.lookFor(LOOK_STRUCTURES) as Structure[];
            for (let s of structures) {
                if (s.structureType === STRUCTURE_RAMPART) {
                    ramparts.push(s as Rampart);
                }
            }
        }
    }
    return ramparts;
}
