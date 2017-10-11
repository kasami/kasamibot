"use strict";
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
function roomHasBankHaulers(room, bank) {
    let numb = 0;
    let creeps = room.find(FIND_MY_CREEPS);
    for (let c of creeps) {
        if (c.memory.role === role_1.Role.BankHauler) {
            numb++;
        }
    }
    let wantedHaulers = Math.floor(bank.power / 1600) - 1;
    return numb >= Math.max(1, wantedHaulers);
}
exports.roomHasBankHaulers = roomHasBankHaulers;
function setBankPostionInMemory(creep) {
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom !== undefined && homeroom.memory.powerbanks !== undefined &&
        homeroom.memory.powerbanks[creep.memory.target] !== undefined) {
        let bankinfo = homeroom.memory.powerbanks[creep.memory.target];
        creep.memory.bankPosition = { x: bankinfo.position.x, y: bankinfo.position.y, roomName: bankinfo.position.roomName };
    }
}
exports.setBankPostionInMemory = setBankPostionInMemory;
function getBankPosition(creep) {
    if (creep.memory.bankPosition === undefined) {
        setBankPostionInMemory(creep);
    }
    if (creep.memory.bankPosition === undefined || creep.memory.bankPosition.x === undefined) {
        Logger_1.log.error(creep.name + " is missing bankposition for PowerBank: " + creep.memory.target, creep.room.name);
        return creep.pos;
    }
    let bankPosition = new RoomPosition(creep.memory.bankPosition.x, creep.memory.bankPosition.y, creep.memory.bankPosition.roomName);
    return bankPosition;
}
exports.getBankPosition = getBankPosition;
function itIsSafeToAttackBank(creep, bank) {
    return (creep.hits > creep.hitsMax / 2) && (bank.hits > 10000 || roomHasBankHaulers(creep.room, bank));
}
exports.itIsSafeToAttackBank = itIsSafeToAttackBank;
