"use strict";
const _Manager_1 = require("./managers._Manager");
const OperationHauler = require("./roles.OperationHauler");
const OperationHaul = require("./operations.Haul");
const OperationDrain = require("./operations.Drain");
const OperationGuard = require("./operations.Guard");
const OperationSpawnmove = require("./operations.Spawnmove");
const operationtypes_1 = require("./enums.operationtypes");
const role_1 = require("./enums.role");
class OperationManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("OperationManager");
        this.MEMORY_OPERATIONSMAINTAINENCE = "maintain";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            this.creepService.runCreeps(role_1.Role.OperationHauler, OperationHauler.run);
        }
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            let lastRunShorterm = this.getValue(this.MEMORY_OPERATIONSMAINTAINENCE);
            if (lastRunShorterm === undefined || lastRunShorterm + 1000 < Game.time) {
                this.deleteOldOperations();
                this.setValue(this.MEMORY_OPERATIONSMAINTAINENCE, Game.time);
            }
        }
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        for (let operation of Memory.operations) {
            switch (operation.operationtype) {
                case operationtypes_1.OperationType.Haul:
                    if (operation.active && !OperationHaul.victoryConditionReached(operation)) {
                        OperationHaul.run(operation, this.creepService, pri);
                    }
                    else {
                        operation.active = false;
                    }
                    break;
                case operationtypes_1.OperationType.Drain:
                    if (operation.active && !OperationDrain.victoryConditionReached(operation)) {
                        OperationDrain.run(operation, this.creepService, pri);
                    }
                    else {
                        operation.active = false;
                    }
                    break;
                case operationtypes_1.OperationType.Guard:
                    if (operation.active && !OperationGuard.victoryConditionReached(operation)) {
                        OperationGuard.run(operation, this.creepService, pri);
                    }
                    else {
                        operation.active = false;
                    }
                    break;
                case operationtypes_1.OperationType.Spawnmove:
                    if (operation.active && !OperationSpawnmove.victoryConditionReached(operation)) {
                        OperationSpawnmove.run(operation, pri, this.creepService);
                    }
                    else {
                        operation.active = false;
                    }
                    break;
            }
        }
    }
    deleteOldOperations() {
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        let removed = _.remove(Memory.operations, (o) => o.active === false);
        if (removed.length > 0) {
            console.log("Removed " + removed.length + " finished operations.");
        }
    }
}
exports.OperationManager = OperationManager;
