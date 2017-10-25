import {Role} from "../enums/role";

import {log} from "../tools/Logger";

export function roomHasBankHaulers(room: Room, bank: PowerBank) {
    let numb = 0;
    let creeps = room.find(FIND_MY_CREEPS) as Creep[];
    for (let c of creeps) {
        if (c.memory.role === Role.BankHauler) {
            numb++
        }
    }
    let wantedHaulers = Math.floor(bank.power / 1600) - 1;
    return numb >= Math.max(1, wantedHaulers);
}

export function setBankPostionInMemory(creep: Creep) {
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom !== undefined && homeroom.memory.powerbanks !== undefined &&
        homeroom.memory.powerbanks[creep.memory.target] !== undefined)
    {
        let bankinfo = homeroom.memory.powerbanks[creep.memory.target];
        creep.memory.bankPosition = {x: bankinfo.position.x, y: bankinfo.position.y, roomName: bankinfo.position.roomName};
    }
}

export function getBankPosition(creep: Creep): RoomPosition {
    if (creep.memory.bankPosition === undefined) {
        setBankPostionInMemory(creep);
    }
    if (creep.memory.bankPosition === undefined || creep.memory.bankPosition.x === undefined) {
        log.error(creep.name+" is missing bankposition for PowerBank: " + creep.memory.target, creep.room.name);
        return creep.pos;
    }
    let bankPosition = new RoomPosition(creep.memory.bankPosition.x, creep.memory.bankPosition.y, creep.memory.bankPosition.roomName);
    return bankPosition;
}
export function itIsSafeToAttackBank(creep: Creep, bank: StructurePowerBank): boolean {
    return (creep.hits > creep.hitsMax / 2) && (bank.hits > 10000 || roomHasBankHaulers(creep.room, bank));
}
