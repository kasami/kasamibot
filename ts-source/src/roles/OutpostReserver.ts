import * as _Common from "../rolelib/common";

import * as IntelLib from "../lib/intel";

export function run(creep: Creep) {
    let controllerPos = getRoomPosForOutpostController(creep.memory.target);

    if (controllerPos === null) {
        console.log("Missing controllerPos for reserver: " + creep.pos);
        return;
    }

    if (_Common.targetRoomHasInvaders(creep, controllerPos.roomName)) {
        return;
    }

    if (controllerPos.roomName !== creep.room.name) {
        creep.travelTo({pos: controllerPos});
    } else {
        let response = creep.reserveController(getControllerWithId(creep.memory.target));
        if (response === ERR_NOT_IN_RANGE || response === ERR_NOT_ENOUGH_RESOURCES) {
            creep.travelTo({pos: controllerPos});
        }
    }
};

function getRoomPosForOutpostController(target: string): RoomPosition | null {
    let roomname = target.substr(1).split("-")[0];;
    let controllerPos = IntelLib.controllerPos(roomname);
    let controllerId = IntelLib.controllerId(roomname);
    if (controllerPos !== null && controllerId !== null) {
        return new RoomPosition(controllerPos.x, controllerPos.y, controllerPos.roomName);
    }
    return null;
}

function getControllerWithId(target: string): Controller {
    return Game.getObjectById(target.substr(1).split("-")[1]) as Controller;
}
