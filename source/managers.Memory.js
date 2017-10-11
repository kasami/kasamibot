"use strict";
const _Manager_1 = require("./managers._Manager");
const RoomRepository = require("./repository.Room");
class MemoryManager extends _Manager_1.Manager {
    constructor() {
        super("MemoryManager");
        this.MEMORY_SHORTTERM = "shortterm";
        this.MEMORY_LONGTERM = "longterm";
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            let lastRunShorterm = this.getValue(this.MEMORY_SHORTTERM);
            if (lastRunShorterm === undefined || lastRunShorterm + 20 < Game.time) {
                this.deleteCreepsFromMemory();
                this.deleteOldBanksFromMemory();
                this.assignRoomIndeces();
                this.setValue(this.MEMORY_SHORTTERM, Game.time);
            }
            let lastRunLongterm = this.getValue(this.MEMORY_LONGTERM);
            if (lastRunLongterm === undefined || lastRunLongterm + 2000 < Game.time) {
                this.deleteOldIntelFromMemory();
                this.deleteOldAbandonedRoomsFromMemory();
                this.setValue(this.MEMORY_LONGTERM, Game.time);
            }
        }
    }
    assignRoomIndeces() {
        for (let roomName of Object.keys(Game.rooms)) {
            let room = Game.rooms[roomName];
            if (room.controller !== undefined && room.controller.my) {
                RoomRepository.getIndex(room);
            }
        }
    }
    deleteCreepsFromMemory() {
        for (let i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    }
    deleteOldIntelFromMemory() {
        for (let r in Memory.rooms) {
            if (Memory.rooms[r].length === 0) {
                delete Memory.rooms[r];
            }
            if (Memory.rooms[r].i !== undefined) {
                if (Memory.rooms[r].i.t !== undefined) {
                    Memory.rooms[r].i = JSON.stringify(Memory.rooms[r].i);
                }
                let intel = JSON.parse(Memory.rooms[r].i);
                if (intel.t !== undefined && intel.t < (Game.time - 400000) && !Game.rooms[r]) {
                    delete Memory.rooms[r];
                }
            }
        }
    }
    deleteOldAbandonedRoomsFromMemory() {
        for (let r in Memory.rooms) {
            if (Memory.rooms[r].length > 1) {
                let room = Game.rooms[r];
                if (!Game.rooms[r] || (room.controller !== undefined && !room.controller.my)) {
                    delete Memory.rooms[r].t;
                    delete Memory.rooms[r].index;
                    delete Memory.rooms[r].towerSleep;
                    delete Memory.rooms[r].roomlevel;
                    delete Memory.rooms[r].spawnpos;
                    delete Memory.rooms[r].basehauler;
                    delete Memory.rooms[r].controllerLink;
                    delete Memory.rooms[r].baseLink;
                    delete Memory.rooms[r].baseLab;
                    delete Memory.rooms[r].miningMinerals;
                    delete Memory.rooms[r].basecourier;
                    delete Memory.rooms[r].neighbours;
                    delete Memory.rooms[r].scoutqueue;
                    delete Memory.rooms[r].baseInLink;
                    delete Memory.rooms[r].dumpSources;
                    delete Memory.rooms[r].roads;
                    delete Memory.rooms[r].signingqueue;
                    delete Memory.rooms[r].orders;
                    delete Memory.rooms[r].lab;
                    delete Memory.rooms[r].nuker;
                    delete Memory.rooms[r].observer;
                    delete Memory.rooms[r].highwaysClose;
                    delete Memory.rooms[r].observerCounter;
                    delete Memory.rooms[r].powerbanks;
                    delete Memory.rooms[r].isBeingDismantled;
                }
            }
        }
    }
    deleteOldBanksFromMemory() {
        if (Memory.takenBanks === undefined) {
            Memory.takenBanks = [];
        }
        let i = Memory.takenBanks.length;
        while (i--) {
            if (Memory.takenBanks[i] === null) {
                Memory.takenBanks.splice(i, 1);
            }
            else if (Memory.takenBanks[i].tickGone !== undefined && Memory.takenBanks[i].tickGone < Game.time) {
                Memory.takenBanks.splice(i, 1);
            }
        }
    }
}
exports.MemoryManager = MemoryManager;
