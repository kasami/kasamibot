"use strict";
const _Manager_1 = require("./managers._Manager");
const BoostLib = require("./lib.boost");
const TradeManager = require("./managers.Trade");
const Logger_1 = require("./tools.Logger");
const role_1 = require("./enums.role");
const booststage_1 = require("./enums.booststage");
class BoostManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("BoostManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            let rooms = this.roomService.getNormalAndNotExpansion();
            for (let room of rooms) {
                if (BoostLib.roomHasCreepThatNeedsBoosting(room)) {
                    this.boostCreepInRoom(room);
                }
            }
        }
    }
    boostCreepInRoom(room) {
        let boostTarget = BoostLib.getCreepThatNeedsBoosting(room);
        if (!boostTarget) {
            Logger_1.log.error("Could not find boost-target", room.name);
            BoostLib.removeBoostingFromRoom(room);
            return;
        }
        if (room.terminal === undefined) {
            Logger_1.log.error("Trying to boost in a room without terminal", room.name);
            return;
        }
        let lab = room.getBoostLab();
        if (lab === undefined) {
            Logger_1.log.error("Trying to boost in a room without boostlab", room.name);
            return;
        }
        if (room.memory.boosting !== true && lab.energy < lab.energyCapacity) {
            Logger_1.log.error("Waiting with boost until lab has full energy", room.name);
            return;
        }
        let boostHauler = this.findBoostHauler(room);
        if (boostHauler === undefined) {
            Logger_1.log.alert("Could not find boosthauler", room.name);
            return;
        }
        if (BoostLib.roomIsCurrentlyBoosting(room)) {
            this.runBoosting(room, boostTarget, boostHauler, lab, room.terminal);
        }
        else {
            let moveHauler = this.moveHaulerToBoostPosition(boostHauler, lab);
            let moveTarget = this.moveTargetToBoostPosition(boostTarget, lab);
            if (moveHauler && moveTarget) {
                room.memory.boosting = true;
            }
        }
    }
    runBoosting(room, boostTarget, boostHauler, lab, terminal) {
        if (boostHauler === null) {
            BoostLib.removeBoostingFromRoom(room);
            return;
        }
        let boosts = BoostLib.getWantedBoosts(boostTarget);
        if (boosts.type === "" || boosts.count === 0) {
            BoostLib.removeBoostingFromRoom(room);
            BoostLib.enableCreepIfDisabled(boostHauler);
            BoostLib.enableCreepIfDisabled(boostTarget);
            return;
        }
        let requiredMinerals = boosts.count * LAB_BOOST_MINERAL;
        switch (room.memory.boostStage) {
            case undefined:
            case booststage_1.BoostStage.ClearLab:
                if (lab.mineralAmount > 0) {
                    boostHauler.withdraw(lab, lab.mineralType);
                    break;
                }
                else if (_.sum(boostHauler.carry) > 0) {
                    for (let inventory in boostHauler.carry) {
                        boostHauler.transfer(boostHauler.room.terminal, inventory);
                    }
                    break;
                }
                else {
                    this.setBoostStage(room, booststage_1.BoostStage.BuyMinerals);
                }
            case booststage_1.BoostStage.BuyMinerals:
                if (BoostLib.doWeHaveMineralsRequired(room, boosts.type, requiredMinerals)) {
                    this.setBoostStage(room, booststage_1.BoostStage.LoadHauler);
                }
                else {
                    TradeManager.requestMineralsForBoosting(room, boosts.type, requiredMinerals);
                    break;
                }
            case booststage_1.BoostStage.LoadHauler:
                boostHauler.withdraw(terminal, boosts.type, Math.min(boostHauler.carryCapacity, requiredMinerals));
                this.setBoostStage(room, booststage_1.BoostStage.UnloadHauler);
                break;
            case booststage_1.BoostStage.UnloadHauler:
                boostHauler.transfer(lab, boosts.type);
                this.setBoostStage(room, booststage_1.BoostStage.BoostCreep);
                break;
            case booststage_1.BoostStage.BoostCreep:
                lab.boostCreep(boostTarget);
                Logger_1.log.info("Boosting " + boostTarget.name + " with " + boosts.count + " " + boosts.type, room.name);
                this.setBoostStage(room, booststage_1.BoostStage.ValidateBoost);
                break;
            case booststage_1.BoostStage.ValidateBoost:
                this.setBoostStage(room, booststage_1.BoostStage.ClearLab);
                if (BoostLib.creepIsBoosted(boostTarget, boosts.type)) {
                    BoostLib.removeWantedBoostTypeFromCreepMemory(boostTarget, boosts.type);
                }
                else {
                    Logger_1.log.error("Boosting of " + boostTarget.name + " with " + boosts.type + " failed", room.name);
                }
                break;
        }
    }
    moveTargetToBoostPosition(creep, lab) {
        if (creep.spawning) {
            return false;
        }
        let boostingPosition = BoostLib.getTargetBoostingPosition(lab);
        if (BoostLib.boostTargetInPosition(creep, boostingPosition)) {
            return true;
        }
        creep.moveTo(boostingPosition);
        return false;
    }
    moveHaulerToBoostPosition(boostHauler, lab) {
        let boostHaulerPosition = BoostLib.getHaulerBoostingPosition(lab);
        if (!BoostLib.boostHaulerInPosition(boostHauler, boostHaulerPosition)) {
            boostHauler.moveTo(boostHaulerPosition);
            return false;
        }
        if (_.sum(boostHauler.carry) > 0) {
            for (let inventory in boostHauler.carry) {
                boostHauler.transfer(boostHauler.room.terminal, inventory);
            }
            return false;
        }
        return true;
    }
    findBoostHauler(room) {
        let boostHauler = BoostLib.getBoostHauler(room);
        if (boostHauler !== null) {
            return boostHauler;
        }
        let baseHaulers = this.creepService.getCreeps(role_1.Role.BaseHauler, null, room.name);
        if (baseHaulers.length > 0) {
            BoostLib.setAsBoostHauler(room, baseHaulers[0]);
            return baseHaulers[0];
        }
        return undefined;
    }
    setBoostStage(room, stage) {
        room.memory.boostStage = stage;
    }
}
exports.BoostManager = BoostManager;
