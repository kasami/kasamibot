"use strict";
const IntelLib = require("./lib.intel");
const RoomLib = require("./lib.room");
const _Manager_1 = require("./managers._Manager");
class IntelManager extends _Manager_1.Manager {
    constructor() {
        super("IntelManager");
        this.hasRun = false;
        this.MEMORY_LASTRUN = "lastRun";
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
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
        }
        else if (pri === _Manager_1.ManagerPriority.Overflow && !this.hasRun) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 2 < Game.time) {
                for (let roomName of Object.keys(Game.rooms)) {
                    if (!RoomLib.roomIsHighway(roomName)) {
                        let room = Game.rooms[roomName];
                        IntelLib.saveIntelForRoom(room);
                    }
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
            ;
        }
    }
}
exports.IntelManager = IntelManager;
