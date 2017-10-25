
import * as IntelLib from "../lib/intel";

export function canSendT3BoostedWreckerTeam(room: Room, target: string): boolean {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
        return false;
    }
    if (room.controller.level < 6 ) {
        return false;
    } else
    if (room.controller.level < targetLevel) {
        return false;
    }

    let needed: {[name: string]: number} = {};

    needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 16;
    needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 8;
    needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 10;
    needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 14;
    needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 2;

    if (targetLevel === 7) {
        needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 24;
        needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 16;
        needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 16;
        needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 20;
        needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 4;
    } else
    if (targetLevel === 8) {
        needed[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] = 32;
        needed[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] = 24;
        needed[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] = 20;
        needed[RESOURCE_CATALYZED_ZYNTHIUM_ACID] = 20;
        needed[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] = 4;
    }

    for (let min of Object.keys(needed)) {
        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
            return false;
        }
    }

    return true;
}

export function canSendT2BoostedWreckerTeam(room: Room, target: string): boolean {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
        return false;
    }
    if (room.controller.level < 6) {
        return false;
    } else
    if (targetLevel > 7) {
        return false;
    } else
    if (targetLevel > 6 && room.controller.level < 8) {
        return false;
    } else
    if (targetLevel > 4 && room.controller.level < 7) {
        return false;
    }

    let needed: {[name: string]: number} = {};

    if (targetLevel < 5) {
        needed[RESOURCE_GHODIUM_ALKALIDE] = 16;
        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 8;
        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 13;
        needed[RESOURCE_ZYNTHIUM_ACID] = 13;
        needed[RESOURCE_KEANIUM_ALKALIDE] = 2;
    } else
    if (targetLevel < 7) {
        needed[RESOURCE_GHODIUM_ALKALIDE] = 24;
        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 18;
        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 20;
        needed[RESOURCE_ZYNTHIUM_ACID] = 15;
        needed[RESOURCE_KEANIUM_ALKALIDE] = 3;
    } else
    if (targetLevel === 7) {
        needed[RESOURCE_GHODIUM_ALKALIDE] = 24;
        needed[RESOURCE_LEMERGIUM_ALKALIDE] = 24;
        needed[RESOURCE_ZYNTHIUM_ALKALIDE] = 24;
        needed[RESOURCE_ZYNTHIUM_ACID] = 20;
        needed[RESOURCE_KEANIUM_ALKALIDE] = 4;
    }

    for (let min of Object.keys(needed)) {
        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
            return false;
        }
    }

    return true;
}

export function canSendT1BoostedWreckerTeam(room: Room, target: string): boolean {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 3) {
        return false;
    }
    if (room.controller.level < 7) {
        return false;
    } else
    if (targetLevel > 4) {
        return false;
    }

    let needed: {[name: string]: number} = {};

    needed[RESOURCE_GHODIUM_OXIDE] = 20;
    needed[RESOURCE_LEMERGIUM_OXIDE] = 18;
    needed[RESOURCE_ZYNTHIUM_OXIDE] = 30;
    needed[RESOURCE_ZYNTHIUM_HYDRIDE] = 16;
    needed[RESOURCE_KEANIUM_OXIDE] = 6;

    for (let min of Object.keys(needed)) {
        if (terminalHasMinsForBoost(room, min, needed[min]) === false) {
            return false;
        }
    }

    return true;
}

export function terminalHasMinsForBoost(room: Room, min: string, count: number): boolean {
    if (room.terminal === undefined || room.terminal.store[min] === undefined) {
        return false;
    }
    return room.terminal.store[min] >= (30 * count);
}

export function getT3BoostedWreckerTeamTierForRoom(room: Room, target: string): number | undefined {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
        return undefined;
    }
    if (room.controller.level < 6) {
        return undefined;
    }
    if (room.controller.level < targetLevel) {
        return undefined;
    }
    if (targetLevel === 8) {
        return 3;
    } else
    if (targetLevel === 7) {
        return 2;
    } else {
        return 1;
    }
}


export function getT2BoostedWreckerTeamTierForRoom(room: Room, target: string): number | undefined {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
        return undefined;
    }
    if (room.controller.level < 6) {
        return undefined;
    }
    if (room.controller.level < targetLevel) {
        return undefined;
    }
    if (targetLevel === 8) {
        return undefined;
    }
    if (targetLevel === 7 && room.controller.level === 8) {
        return 3;
    } else
    if (targetLevel > 4 && room.controller.level > 6) {
        return 2;
    } else {
        return 1;
    }
}

export function getT1BoostedWreckerTeamTierForRoom(room: Room, target: string): number | undefined {
    let targetLevel = IntelLib.roomLevel(target);
    if (targetLevel === undefined || room.controller === undefined || targetLevel < 4) {
        return undefined;
    }
    if (room.controller.level < 7) {
        return undefined;
    }
    if (targetLevel > 4) {
        return undefined;
    }
    return 1;
}
