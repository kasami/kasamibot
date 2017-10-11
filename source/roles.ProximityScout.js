"use strict";
const IntelLib = require("./lib.intel");
function run(creep) {
    creep.notifyWhenAttacked(false);
    if (creep.memory.target === undefined) {
        creep.memory.target = getScoutingTarget(creep, creep.memory.homeroom);
        if (creep.memory.target === undefined) {
            creep.suicide();
            return;
        }
    }
    if (creep.memory.target !== null && creep.memory.target !== undefined && creep.memory.target !== creep.room.name) {
        if (Memory.empire.inaccessible !== undefined && _.contains(Memory.empire.inaccessible, creep.memory.target)) {
            creep.memory.target = undefined;
            return;
        }
        let response = creep.travelToRoom(creep.memory.target, { allowHostile: false, allowSK: true }, true);
        if (response === ERR_NO_PATH || response === ERR_INVALID_ARGS) {
            if (Memory.rooms[creep.memory.target] === undefined) {
                Memory.rooms[creep.memory.target] = {};
            }
            Memory.rooms[creep.memory.target].inaccessible = Game.time;
            creep.memory.target = undefined;
        }
        if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
            IntelLib.saveIntelForRoom(creep.room);
        }
        return;
    }
    IntelLib.saveIntelForRoom(creep.room);
    creep.memory.target = undefined;
}
exports.run = run;
;
function getScoutingTarget(creep, roomName) {
    let room = Game.rooms[roomName];
    if (!(room instanceof Room)) {
        return undefined;
    }
    if (room.memory.scoutqueue === undefined) {
        room.memory.scoutqueue = [];
        return undefined;
    }
    if (room.memory.scoutqueue.length === 0) {
        return undefined;
    }
    let closest = room.memory.scoutqueue[0];
    let chosenDistance = Game.map.getRoomLinearDistance(creep.pos.roomName, closest);
    for (let t of room.memory.scoutqueue) {
        let distance = Game.map.getRoomLinearDistance(creep.pos.roomName, t);
        if (distance < chosenDistance) {
            chosenDistance = distance;
            closest = t;
        }
    }
    room.memory.scoutqueue = _.without(room.memory.scoutqueue, closest);
    return closest;
}
