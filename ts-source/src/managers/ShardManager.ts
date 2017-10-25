import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

export class UpgradeManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN = "lastRun";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("UpgradeManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            //this.creepService.runCreeps(Role.UpgraderWithBoost, Upgrader.run);
        } else
        if (pri === ManagerPriority.Low) {

            /*let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let rooms = this.roomService.getNormalAndNotExpansion();
                this.setPraiseBoosting(rooms);
                this.buildUpgradeStorage(rooms);
                this.orderUpgradeUnits(rooms);
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }*/
        }
    }
}