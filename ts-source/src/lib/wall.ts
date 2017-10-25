import * as RoomRepository from "../repository/Room";

import {RoomLevel} from "../enums/roomlevel";

export function desiredWallHitsForRoom(room: Room) {
    let roomlevel = RoomRepository.getRoomLevel(room);
    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
        if (roomlevel >= RoomLevel.City) {
            return 100000;
        } else {
            return 20000;
        }
    }
    if (roomlevel >= RoomLevel.Metropolis) {
        return 10000000;
    } else
    if (roomlevel >= RoomLevel.City) {
        return 1000000;
    } else
    if (roomlevel >= RoomLevel.Town) {
        return 250000;
    } else
    if (roomlevel >= RoomLevel.AdvancedColony) {
        return 100000;
    } else
    if (roomlevel >= RoomLevel.CivilizedColony) {
        return 50000;
    }
    return 0;
}


export function desiredFortressHitsForRoom(room: Room) {
    let roomlevel = RoomRepository.getRoomLevel(room);
    if (Memory.settings.lowWalls === true || room.memory.lowWalls === true) {
        if (roomlevel >= RoomLevel.City) {
            return 500000;
        } else {
            return 100000;
        }
    }
    if (roomlevel >= RoomLevel.Metropolis) {
        if (room.memory.lowestWall !== undefined) {
            return Math.max(room.memory.lowestWall * 2, 5000000);
        } else {
            return 5000000;
        }
    } else
    if (roomlevel >= RoomLevel.City) {
        return 5000000;
    } else
    if (roomlevel >= RoomLevel.Town) {
        return 2000000;
    } else
    if (roomlevel >= RoomLevel.AdvancedColony) {
        return 100000;
    } else
    if (roomlevel >= RoomLevel.CivilizedColony) {
        return 500000;
    }
    return 0;
}

export function getBorderwallRoomCallback(wallPositions: RoomPosition[]): CostMatrix {
    let costs = new PathFinder.CostMatrix;

    for(let p of wallPositions) {
        costs.set(p.x, p.y, 0xfe);
    }
    return costs;
}

export function shortPos(pos: RoomPosition) {
    return pos.x + "-" + pos.y;
}

export function longPos(pos: string, roomName: string): RoomPosition {
    let split = pos.split("-");
    return new RoomPosition(+split[0], +split[1], roomName);
}

export function wallConstructionLimitReached(): boolean {
    return Object.keys(Game.constructionSites).length > 60;
}
