import {Hostility} from "../enums/hostility";

import {log} from "../tools/Logger";


export function hasIntel(roomName: string): boolean {
    if (global.intel === undefined) {
        global.intel = {};
    }
    if (global.intel[roomName] === undefined) {
        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].i !== undefined) {
            if (Memory.rooms[roomName].i.t !== undefined) {
                Memory.rooms[roomName].i = JSON.stringify(Memory.rooms[roomName].i);
            }
            global.intel[roomName] = JSON.parse(Memory.rooms[roomName].i);
            return true;
        }
    } else {
        return true;
    }
    return false;
}

export function needsNewIntel(roomName: string): boolean {
    if ((!hasIntel(roomName) || global.intel[roomName].t + 20000 < Game.time) && Game.map.isRoomAvailable(roomName)) {
        return true;
    }
    return false;
}

export function hasInvaders(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].h === Hostility.Invaders) {
        return true;
    }

    return false;
}

export function hasHostiles(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].h > Hostility.None) {
        return true;
    }
    return false;
}

export function hasDangerousHostiles(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].h > Hostility.HarmlessHostiles) {
        return true;
    }
    return false;
}

export function isOccupied(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].h >= Hostility.Reserved) {
        return true;
    }
    return false;
}

export function towerCount(roomName: string): number {
    if (hasIntel(roomName) && global.intel[roomName].towers !== undefined) {
        return global.intel[roomName].towers;
    }
    return 0;
}

export function isInsafeMode(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].safeMode !== undefined) {
        return (global.intel[roomName].t + global.intel[roomName].safeMode > Game.time);
    }
    return false;
}

export function isOwned(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].h >= Hostility.Controlled) {
        return true;
    }
    return false;
}

export function roomHostility(roomName: string): Hostility {
    if (hasIntel(roomName) && global.intel[roomName].h !== undefined) {
        return global.intel[roomName].h;
    }
    return Hostility.None;
}

export function roomLevel(roomName: string): number | undefined {
    if (hasIntel(roomName) && global.intel[roomName].l !== undefined) {
        return global.intel[roomName].l;
    }
    return undefined;
}

export function isReservedByMe(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
        return true;
    }
    return false;
}

export function isReservedByMeFor(roomName: string): number {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res > 0) {
        return global.intel[roomName].res;
    }
    return 0;
}

export function isOwnedByMe(roomName: string): boolean {
    if (hasIntel(roomName) && global.intel[roomName].my && global.intel[roomName].res === undefined) {
        return true;
    }
    return false;
}

export function sourceCount(roomName: string): number {
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
        return Object.keys(global.intel[roomName].s as {}).length;
    }
    return 0;
}

export function sourceIds(roomName: string): string[] {
    let sourceIds: string[] = [];
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined) {
        for (let id of Object.keys(global.intel[roomName].s)) {
            sourceIds.push(id);
        }
    }
    return sourceIds;
}

export function mineralType(roomName: string): string | undefined {
    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
        let split = global.intel[roomName].m.split("-");
        if (split.length === 4) {
            return split[1];
        }
    }
}

export function mineralPos(roomName: string): RoomPosition | undefined {
    if (hasIntel(roomName) && global.intel[roomName].m !== undefined) {
        let split = global.intel[roomName].m.split("-");
        if (split.length === 4) {
            return new RoomPosition(split[2], split[3], roomName);
        }
    }
}

export function sourcePos(roomName: string, sourceId: string): RoomPosition {
    if (hasIntel(roomName) && global.intel[roomName].s !== undefined && global.intel[roomName].s[sourceId] !== undefined) {
        return makeRoomPosForSourceInfo(roomName, global.intel[roomName].s[sourceId])
    }
    log.error("IntelLib had to make a fake sourcepos for source " + sourceId, roomName);
    return new RoomPosition(25, 25, roomName);
}

export function controllerPos(roomName: string): RoomPosition | null {
    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
        return makeRoomPosForControllerInfo(roomName, global.intel[roomName].c);
    }
    return null;
}

export function controllerId(roomName: string): string | null {
    if (hasIntel(roomName) && global.intel[roomName].c !== undefined) {
        return makeIdForControllerInfo(global.intel[roomName].c);
    }
    return null;
}

export function mineralTicks(roomName: string): number | undefined {
    if (hasIntel(roomName) && global.intel[roomName].mtime !== undefined) {
        return global.intel[roomName].mtime;
    }
    return undefined;
}

export function intelTime(roomName: string): number | undefined {
    if (hasIntel(roomName) && global.intel[roomName].t !== undefined) {
        return global.intel[roomName].t;
    }
    return undefined;
}

// Internal utilities

function makeRoomPosForSourceInfo(roomName: string, ipos: string): RoomPosition {
    let split = ipos.split("-");
    if (split.length === 2) {
        return new RoomPosition(+split[0], +split[1], roomName);
    }
    log.error("IntelLib had to make a fake sourcepos for sourceinfo: " + ipos, roomName);
    return new RoomPosition(25, 25, roomName);
}

function makeRoomPosForControllerInfo(roomName: string, ipos: string): RoomPosition {
    let split = ipos.split("-");
    if (split.length === 3) {
        return new RoomPosition(+split[1], +split[2], roomName);
    }
    log.error("IntelLib had to make a fake controllerpos: " + ipos, roomName);
    return new RoomPosition(25, 25, roomName);
}
function makeIdForControllerInfo(ipos: string): string {
    let split = ipos.split("-");
    if (split.length === 3) {
        return split[0];
    }
    log.error("IntelLib had to make a fake controllerid: " + ipos, "");
    return "";
}

export function saveIntelForRoom(room: Room) {
    let hostiles = room.find(FIND_HOSTILE_CREEPS) as Creep[];

    var intel: any = {};
    if (room.memory.i !== undefined) {
        if (room.memory.i.t !== undefined) {
            room.memory.i = JSON.stringify(room.memory.i);
        }
        intel = JSON.parse(room.memory.i);
    }
    intel.t = Game.time;
    intel.h = getRoomHostility(room, hostiles);
    if (Memory.settings.bot === true) {
        registerAllThreats(room, hostiles);
    }
    if (room.controller !== undefined) {
        intel.c = room.controller.id + "-" + room.controller.pos.x + "-" + room.controller.pos.y;
        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
        room.controller.reservation.username !== Memory.settings.user && !(room.controller.my)) {
            intel.o = room.controller.reservation.username;
        } else {
            intel.o = undefined;
        }

        if (room.controller.level >= 1 && !room.controller.my) {
            intel.l = room.controller.level;
        } else {
            intel.l = undefined;
        }

        if (room.controller.level >= 3 && !room.controller.my) {
            intel.towers = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_TOWER}).length;
        } else {
            intel.towers = undefined;
        }

        if ((room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user) || room.controller.my) {
            intel.my = true;
        } else {
            intel.my = undefined;
        }

        if (room.controller.reservation !== undefined && room.controller.reservation.username === Memory.settings.user && !room.controller.my) {
            intel.res = room.controller.reservation.ticksToEnd;
        } else {
            intel.res = undefined;
        }

        if (room.controller.safeMode) {
            intel.safeMode = room.controller.safeMode;
        } else {
            intel.safeMode = undefined;
        }
    }
    let mineral = room.getMineral();
    if (mineral !== undefined) {
        intel.mtime = mineral.ticksToRegeneration;
    }
    if (intel.s === undefined) {
        intel.s = registerSourceInfo(room);
    }
    if (intel.m === undefined) {
        intel.m = registerMineralInfo(room);
    }
    if (global.intel === undefined) {
        global.intel = {};
    }
    global.intel[room.name] = intel;
    room.memory.i = JSON.stringify(intel);
}

function registerSourceInfo(room: Room) {
    let sourceInfo: {[s: string]: string} = {};
    let sources = room.find(FIND_SOURCES) as Source[];
    if (sources.length > 0) {
        for (let source of sources) {
            sourceInfo[source.id] = source.pos.x + "-" + source.pos.y;
        }
    }
    return sourceInfo;
}

function registerMineralInfo(room: Room) {
    let minerals = room.find(FIND_MINERALS) as Mineral[];
    if (minerals.length > 0) {
        return minerals[0].id + "-" + minerals[0].mineralType + "-" + minerals[0].pos.x + "-" + minerals[0].pos.y;
    }
    return undefined;
}

function getRoomHostility(room: Room, hostiles: Creep[]) {
    if (room.controller !== undefined) {
        Memory.empire.hostileRooms[room.name] = undefined;
        if (room.controller.level >= 1 && !room.controller.my) {
            if (Memory.empire !== undefined && Memory.empire.hostileRooms !== undefined && !_.contains(Object.keys(Memory.empire.hostileRooms), room.name)) {
                Memory.empire.hostileRooms[room.name] = room.controller.level;
            }
            return Hostility.Controlled;
        }
        if (room.controller.reservation !== undefined && room.controller.reservation.username !== undefined &&
        room.controller.reservation.username !== Memory.settings.user && room.controller.reservation.ticksToEnd > 0) {
            return Hostility.Reserved;
        }
    }
    // return a hostilitylevel-value
    let highest: Hostility = Hostility.None;
    if (hostiles.length > 0) {
        for (let hostile of hostiles) {
            if (hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
                if (dangerousHostile(hostile)) {
                    return Hostility.Hostiles;
                } else {
                    if (highest !== Hostility.Invaders) {
                        highest = Hostility.HarmlessHostiles;
                    }
                }
            }
            if (hostile["owner"]["username"] === "Invader") {
                highest = Hostility.Invaders;
            }
        }
    }
    return highest;
}

function dangerousHostile(hostile: Creep): boolean {
    return hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0;
}

function registerAllThreats(room: Room, hostiles: Creep[]) {
    if (room.controller === undefined || hostiles.length === 0) {
        return;
    }
    if (room.controller.my || (room.controller.reservation !== undefined &&
    room.controller.reservation.username !== undefined && room.controller.reservation.username === Memory.settings.user)) {
        for (let hostile of hostiles) {
            if (hostile.body.length > 1 && hostile["owner"]["username"] !== "Invader" && hostile["owner"]["username"] !== "Source Keeper") {
                if (room.controller.my) {
                    if (hostile.body.length > 10) {
                        if (hostile.body[0].boost !== undefined) {
                            addThreatToPlayer(hostile["owner"]["username"], 30);
                        } else {
                            addThreatToPlayer(hostile["owner"]["username"], 10);
                        }
                    } else {
                        addThreatToPlayer(hostile["owner"]["username"], 5);
                    }
                } else {
                    if (hostile.body.length > 10) {
                        addThreatToPlayer(hostile["owner"]["username"], 2);
                    } else {
                        addThreatToPlayer(hostile["owner"]["username"], 1);
                    }
                }
            }
        }
    }
}

function addThreatToPlayer(name: string, threat: number) {
    if (Memory.playerthreat === undefined) {
        Memory.playerthreat = {};
    }
    if (Memory.playerthreat[name] === undefined) {
        Memory.playerthreat[name] = threat;
    } else {
        Memory.playerthreat[name] += threat;
    }
}
