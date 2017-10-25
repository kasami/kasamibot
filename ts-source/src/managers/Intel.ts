import * as IntelLib from "../lib/intel";
import * as RoomLib from "../lib/room";

import {Manager, ManagerPriority} from "../managers/_Manager";

/*

IntelManager

Keys in room-memory under i:
t - gametime for intel
h - hostility-level for room
l - level of room if owned (and not my)
c - controller id and position "id-x-y" if valid
o - owner of room if valid (reservation or owned)
safeMode - ticks until safemode is down, if valid
s - dictionary with sources id -> "x-y"
m - id, type and position of mineral "id-type-x-y"
my - true if the room is mine, by owning or reserving
res - ticks left of reservation, if it is mine and reserved

 */

export class IntelManager extends Manager {
    private hasRun = false;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor() {
        super("IntelManager");
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 8 < Game.time) {
                for (let roomName of Object.keys(Game.rooms)) {
                    if (!RoomLib.roomIsHighway(roomName)) {
                        let room = Game.rooms[roomName];
                        IntelLib.saveIntelForRoom(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
                this.hasRun = true;
            }
        } else
        if (pri === ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 2 < Game.time) {
                for (let roomName of Object.keys(Game.rooms)) {
                    if (!RoomLib.roomIsHighway(roomName)) {
                        let room = Game.rooms[roomName];
                        IntelLib.saveIntelForRoom(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            };
        }
    }
}


