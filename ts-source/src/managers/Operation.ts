import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as OperationHauler from "../roles/OperationHauler";

import * as OperationHaul from "../operations/Haul";
import * as OperationDrain from "../operations/Drain";
import * as OperationGuard from "../operations/Guard";
import * as OperationSpawnmove from "../operations/Spawnmove";
import {IOperationData} from "../operations/_OperationData";

import {OperationType} from "../enums/operationtypes";
import {Role} from "../enums/role";

export class OperationManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_OPERATIONSMAINTAINENCE = "maintain";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("OperationManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Low) {
            this.creepService.runCreeps(Role.OperationHauler, OperationHauler.run);
        }
        if (pri === ManagerPriority.Trivial) {
            let lastRunShorterm = this.getValue(this.MEMORY_OPERATIONSMAINTAINENCE);
            if (lastRunShorterm === undefined || lastRunShorterm + 1000 < Game.time) {
                this.deleteOldOperations();
                this.setValue(this.MEMORY_OPERATIONSMAINTAINENCE, Game.time);
            }
        }
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        for (let operation of Memory.operations as IOperationData[]) {
            switch(operation.operationtype) {
                case OperationType.Haul:
                    if (operation.active && !OperationHaul.victoryConditionReached(operation as OperationHaul.Data)) {
                        OperationHaul.run(operation as OperationHaul.Data, this.creepService, pri)
                    } else {
                        operation.active = false;
                    }
                    break;
                case OperationType.Drain:
                    if (operation.active && !OperationDrain.victoryConditionReached(operation as OperationDrain.Data)) {
                        OperationDrain.run(operation as OperationDrain.Data, this.creepService, pri)
                    } else {
                        operation.active = false;
                    }
                    break;
                case OperationType.Guard:
                    if (operation.active && !OperationGuard.victoryConditionReached(operation as OperationGuard.Data)) {
                        OperationGuard.run(operation as OperationGuard.Data, this.creepService, pri)
                    } else {
                        operation.active = false;
                    }
                    break;
                case OperationType.Spawnmove:
                    if (operation.active && !OperationSpawnmove.victoryConditionReached(operation as OperationSpawnmove.Data)) {
                        OperationSpawnmove.run(operation as OperationSpawnmove.Data, pri, this.creepService)
                    } else {
                        operation.active = false;
                    }
                    break;
            }
        }
    }

    private deleteOldOperations() {
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        let removed = _.remove(Memory.operations, (o: IOperationData) => o.active === false);
        if (removed.length > 0) {
            console.log("Removed " + removed.length + " finished operations.");
        }
    }
}
