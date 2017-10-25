export function roomHasCreepThatNeedsBoosting(room: Room): boolean {
    return room.memory.boostTarget !== undefined;
}

export function roomIsCurrentlyBoosting(room: Room): boolean {
    return room.memory.boosting;
}

export function setRoomIsBoosting(room: Room): void {
    room.memory.boosting = true;
}

export function getCreepThatNeedsBoosting(room: Room): Creep | null {
    return Game.getObjectById(room.memory.boostTarget) as Creep;
}

export function getBoostHauler(room: Room): Creep | null {
    let bh = Game.getObjectById(room.memory.boostHauler) as Creep | null;
    if (bh === null) {
        room.memory.boostHauler = undefined;
    }
    return bh;
}

export function removeBoostingFromRoom(room: Room): void {
    room.memory.boostTarget = undefined;
    room.memory.boostStage = undefined;
    room.memory.boostHauler = undefined;
    room.memory.boosting = undefined;
}

export function enableCreepIfDisabled(creep: any) {
    if (creep instanceof Creep) {
        creep.enable();
    }
}

export function boostTargetInPosition(creep: Creep, position: RoomPosition) {
    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
        return true;
    }
    return false;
}

export function boostHaulerInPosition(creep: Creep, position: RoomPosition) {
    if (position.x === creep.pos.x && position.y === creep.pos.y && position.roomName === creep.pos.roomName) {
        return true;
    }
    return false;
}

export function removeWantedBoostTypeFromCreepMemory(creep: Creep, type: string) {
    creep.memory.boost = _.filter(creep.memory.boost, function(t: string) {return t !== type});
    if (creep.memory.boost.length === 0) {
        creep.memory.boost = undefined;
    }
}

export function creepIsBoosted(creep: Creep, type: string) {
    let validateBodypart = getBodyPartForBoost(type);
    for (let b of creep.body) {
        if (b.type === validateBodypart && b.boost !== type) {
            return false;
        }
    }
    return true;
}

export function getTargetBoostingPosition(lab: Lab) {
    return new RoomPosition(lab.pos.x + 1, lab.pos.y, lab.pos.roomName);
}

export function getHaulerBoostingPosition(lab: Lab) {
    return new RoomPosition(lab.pos.x, lab.pos.y - 1, lab.pos.roomName);
}

export function setAsBoostHauler(room: Room, creep: Creep) {
    room.memory.boostHauler = creep.id;
    creep.disable();
}

export function getWantedBoosts(creep: Creep): {type: string; count: number} {
    if (creep.memory.boost === undefined || creep.memory.boost.length === 0) {
        return {type: "", count: 0};
    }
    let type = creep.memory.boost[0] as string;
    let bodypart = getBodyPartForBoost(type);
    let count = creep.getActiveBodyparts(bodypart);
    return {type: type, count: count};
}

export function doWeHaveMineralsRequired(room: Room, mineral: string, count: number): boolean {
    if (room.terminal === undefined)  {
        return false;
    }
    if (room.terminal.store[mineral] === undefined || room.terminal.store[mineral] < count) {
        return false;
    }
    return true;
}

export function getBodyPartForBoost(boost: string): string {
    switch(boost) {
        case RESOURCE_CATALYZED_UTRIUM_ACID:
            return ATTACK;
        case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
            return WORK;
        case RESOURCE_CATALYZED_KEANIUM_ACID:
            return CARRY;
        case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
            return RANGED_ATTACK;
        case RESOURCE_CATALYZED_LEMERGIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
            return HEAL;
        case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
            return MOVE;
        case RESOURCE_CATALYZED_GHODIUM_ACID:
            return WORK;
        case RESOURCE_CATALYZED_GHODIUM_ALKALIDE:
            return TOUGH;
        case RESOURCE_UTRIUM_ACID:
            return ATTACK;
        case RESOURCE_UTRIUM_ALKALIDE:
            return WORK;
        case RESOURCE_KEANIUM_ACID:
            return CARRY;
        case RESOURCE_KEANIUM_ALKALIDE:
            return RANGED_ATTACK;
        case RESOURCE_LEMERGIUM_ACID:
            return WORK;
        case RESOURCE_LEMERGIUM_ALKALIDE:
            return HEAL;
        case RESOURCE_ZYNTHIUM_ACID:
            return WORK;
        case RESOURCE_ZYNTHIUM_ALKALIDE:
            return MOVE;
        case RESOURCE_GHODIUM_ACID:
            return WORK;
        case RESOURCE_GHODIUM_ALKALIDE:
            return TOUGH;
        case RESOURCE_UTRIUM_HYDRIDE:
            return ATTACK;
        case RESOURCE_UTRIUM_OXIDE:
            return WORK;
        case RESOURCE_KEANIUM_HYDRIDE:
            return CARRY;
        case RESOURCE_KEANIUM_OXIDE:
            return RANGED_ATTACK;
        case RESOURCE_LEMERGIUM_HYDRIDE:
            return WORK;
        case RESOURCE_LEMERGIUM_OXIDE:
            return HEAL;
        case RESOURCE_ZYNTHIUM_HYDRIDE:
            return WORK;
        case RESOURCE_ZYNTHIUM_OXIDE:
            return MOVE;
        case RESOURCE_GHODIUM_HYDRIDE:
            return WORK;
        case RESOURCE_GHODIUM_OXIDE:
            return TOUGH;
        default:
            return "ERROR";
    }
}
