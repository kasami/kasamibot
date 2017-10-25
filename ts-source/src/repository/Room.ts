/**
 * Repository for structures for a room
 *
 * Memory for room:
 * index - Roomindex (int) - used to save roadinfo in segment
 * b - Shortform baseposition (first spawn)
 * l - Roomlevel (int)
 * i - Intel, handled by IntelManager
 * t - Roomtype, used for structureplacement
 * praiseBoost - true/undefined, used to indicate that extra boosting is wanted
 *
 */

import {log} from "../tools/Logger";

import {RoomLevel} from "../enums/roomlevel";

import {Roomtype} from "../enums/roomtype";

import * as SpawnLib from "../lib/spawn";
import * as IntelLib from "../lib/intel";

export function getBasePosition(room: Room): RoomPosition | undefined {
    if (room.memory.b !== undefined) {
        return longPos(room.memory.b, room.name);
    }
    else {
        // TODO: Change Spawnmove-operation to move spawn when storage is built
        if (Memory.settings.bot) {
            let basepos = SpawnLib.findSpawnLocation(room.name, true);
            if (basepos !== undefined) {
                SpawnLib.createSpawnmoveOperation(room, basepos.pos);
                room.memory.b = shortPos(basepos.pos);
                return basepos.pos;
            }
        }
        let spawnsInRoom = room.find(FIND_MY_SPAWNS) as Spawn[];
        if (spawnsInRoom.length > 0) {
            room.memory.b = shortPos(spawnsInRoom[0].pos);
            return spawnsInRoom[0].pos;
        }
    }
    return undefined;
}

export function setBasePosition(roomName: string, pos: RoomPosition) {
    if (Memory.rooms[roomName] === undefined) {
        Memory.rooms[roomName] = {};
    }
    Memory.rooms[roomName].b = shortPos(pos);
}

export function roomShouldBuild(room: Room): boolean {
    return room.memory.t === Roomtype.Normal && room.memory.isBeingDismantled !== true &&
    (room.storage === undefined || !room.storage.isActive() || room.storage.store[RESOURCE_ENERGY] > 20000);
}

export function getRoomLevel(room: Room): RoomLevel {
    if (room.memory.l === undefined) {
        return RoomLevel.BasicColony;
    }
    return room.memory.l;
};

export function setRoomLevel(room: Room, level: RoomLevel): void {
    log.alert("Roomlevel changed to: " + RoomLevel[level], room.name);
    room.memory.l = level;
};

export function hasOutpost(room: Room, outpost: string) {
    return _.contains(room.memory.outposts, outpost);
}

export function getAllOutposts(room: Room): string[] {
    if (room.memory.outposts === undefined) {
        return []
    }
    return room.memory.outposts;
}

export function getAllOutpostsInAllRooms(rooms: Room[]): string[] {
    let outposts: string[] = [];
    for (let r of rooms) {
        outposts = outposts.concat(r.memory.outposts);
    }
    return outposts;
}

export function getAllPoachroomsInAllRooms(rooms: Room[]): string[] {
    let outposts: string[] = [];
    for (let r of rooms) {
        outposts = outposts.concat(r.memory.poaching);
    }
    return outposts;
}

export function getNumberOfSourcesMined(room: Room): number {
    let sourceCount = (room.find(FIND_SOURCES) as Source[]).length;
    for (let outpost of room.memory.outposts) {
        if (IntelLib.hasIntel(outpost)) {
            sourceCount += IntelLib.sourceIds(outpost).length;
        }
    }

    return sourceCount;
}

export function getOwnerOfOutpost(outpost: string, rooms: Room[]): Room | undefined {
    for (let r of rooms) {
        if (r.memory.outposts !== undefined && _.contains(r.memory.outposts, outpost)) {
            return r;
        }
    }
    return undefined;
}

export function getBasicOutposts(room: Room): string[] {
    let outposts: string[] = [];
    if (room.memory.outposts === undefined) {
        return outposts;
    }
    for(let s of room.memory.outposts) {
        if (!isMiddleRoom(s)) {
            outposts.push(s);
        }
    }
    return outposts;
}

export function getLairOutposts(room: Room): string[] {
    let outposts: string[] = [];
    if (room.memory.outposts === undefined) {
        return outposts;
    }
    for(let s of room.memory.outposts) {
        if (isMiddleRoom(s)) {
            outposts.push(s);
        }
    }
    return outposts;
}

export function getLastIndex(): number {
    let last = 1;
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true && room.memory.index !== undefined) {
            if (last < room.memory.index) {
                last = room.memory.index;
            }
        }
    }
    return last;
}


export function getRoomForIndex(index: number): Room | undefined {
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true && room.memory.index === index) {
            return room;
        }
    }
    return undefined;
}

export function getIndex(room: Room): number {
    if (room.memory.index !== undefined) {
        return room.memory.index;
    }

    let rooms: Room[] = [];
    for (let roomKey in Game.rooms) {
        let room = Game.rooms[roomKey]
        if (room.controller !== undefined && room.controller.my === true) {
            rooms.push(room);
        }
    }
    let used = _.map(rooms, (r: Room) => r.memory.index);
    let counter = 1;
    while(counter < 100) {
        if (!_.contains(used, counter)) {
            room.memory.index = counter;
            return counter;
        }
        counter++;
    }

    log.error("Error assigning roomindex to room.", room.name);
    return 0;
}


/** Utils */

export function isMiddleRoom(roomName: string): boolean {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }

    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isSK =
        ((fMod >= 4) && (fMod <= 6)) &&
        ((sMod >= 4) && (sMod <= 6));
    return isSK;
}

export function isSKRoom(roomName: string): boolean {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }

    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isSK =  !(fMod === 5 && sMod === 5) &&
        ((fMod >= 4) && (fMod <= 6)) &&
        ((sMod >= 4) && (sMod <= 6));
    return isSK;
}

export function isPortalRoom(roomName: string): boolean {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName) as any;
    if (_.isNull(parsed) || _.isNull(parsed[1]) || _.isNull(parsed[1])) {
        return false;
    }
    let fMod = parsed[1] % 10;
    let sMod = parsed[2] % 10;
    let isPortal = (fMod === 5 && sMod === 5);
    return isPortal;
}

function shortPos(pos: RoomPosition) {
    return pos.x + "-" + pos.y;
}

function longPos(pos: string, roomName: string): RoomPosition {
    let split = pos.split("-");
    return new RoomPosition(+split[0], +split[1], roomName);
}

export function getClosestPortalroom(roomName: string): string {
    let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName) as any;
    let fMod = Math.floor(parsed[2] / 10) * 10 + 5;
    let sMod = Math.floor(parsed[4] / 10) * 10 + 5;
    let closestPortal = parsed[1] + fMod + parsed[3] + sMod;
    return closestPortal;
}
