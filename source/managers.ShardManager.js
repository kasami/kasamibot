"use strict";
const _Manager_1 = require("./managers._Manager");
class UpgradeManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("UpgradeManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Standard) {
        }
        else if (pri === _Manager_1.ManagerPriority.Low) {
        }
    }
}
exports.UpgradeManager = UpgradeManager;
