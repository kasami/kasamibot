/**
 * Booster Manager
 * Responsible for handling boosting of creeps
 */

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as BoostLib from "../lib/boost";
import * as TradeManager from "../managers/Trade";
import {log} from "../tools/Logger";
import {Role} from "../enums/role";
import {BoostStage} from "../enums/booststage";


export class BoostManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    constructor(roomService: RoomService, creepService: CreepService) {
        super("BoostManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            let rooms = this.roomService.getNormalAndNotExpansion();
            for (let room of rooms) {
                if (BoostLib.roomHasCreepThatNeedsBoosting(room)) {
                    this.boostCreepInRoom(room);
                }
            }
        }
    }

    private boostCreepInRoom(room: Room) {
        let boostTarget = BoostLib.getCreepThatNeedsBoosting(room);

        if (!boostTarget) {
            log.error("Could not find boost-target", room.name);
            BoostLib.removeBoostingFromRoom(room);
            return;
        }

        if (room.terminal === undefined) {
            log.error("Trying to boost in a room without terminal", room.name);
            return;
        }

        let lab = room.getBoostLab();
        if (lab === undefined) {
            log.error("Trying to boost in a room without boostlab", room.name);
            return;
        }

        if (room.memory.boosting !== true && lab.energy < lab.energyCapacity) {
            log.error("Waiting with boost until lab has full energy", room.name);
            return;
        }

        let boostHauler = this.findBoostHauler(room);

        if (boostHauler === undefined) {
            log.alert("Could not find boosthauler", room.name);
            return;
        }

        if (BoostLib.roomIsCurrentlyBoosting(room)) {
            this.runBoosting(room, boostTarget, boostHauler, lab, room.terminal);
        } else {
            let moveHauler = this.moveHaulerToBoostPosition(boostHauler, lab);
            let moveTarget = this.moveTargetToBoostPosition(boostTarget, lab);
            if (moveHauler && moveTarget) {
                room.memory.boosting = true;
            }
        }
    }

    private runBoosting(room: Room, boostTarget: Creep, boostHauler: Creep | null, lab: Lab, terminal: Terminal) {
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
        switch(room.memory.boostStage) {
            case undefined:
            case BoostStage.ClearLab:
                if (lab.mineralAmount > 0) {
                    boostHauler.withdraw(lab, lab.mineralType);
                    break;
                } else
                if (_.sum(boostHauler.carry) > 0) {
                    for(let inventory in boostHauler.carry) {
                        boostHauler.transfer(boostHauler.room.terminal as Terminal, inventory);
                    }
                    break;
                } else {
                    this.setBoostStage(room, BoostStage.BuyMinerals);
                }

            case BoostStage.BuyMinerals:
                if (BoostLib.doWeHaveMineralsRequired(room, boosts.type, requiredMinerals)) {
                    this.setBoostStage(room, BoostStage.LoadHauler);
                } else {
                    TradeManager.requestMineralsForBoosting(room, boosts.type, requiredMinerals);
                    break;
                }

            case BoostStage.LoadHauler:
                boostHauler.withdraw(terminal, boosts.type, Math.min(boostHauler.carryCapacity, requiredMinerals));
                this.setBoostStage(room, BoostStage.UnloadHauler);
                break;

            case BoostStage.UnloadHauler:
                boostHauler.transfer(lab, boosts.type);
                this.setBoostStage(room, BoostStage.BoostCreep);
                break;

            case BoostStage.BoostCreep:
                lab.boostCreep(boostTarget);
                log.info("Boosting " + boostTarget.name +" with " + boosts.count + " " + boosts.type, room.name);
                this.setBoostStage(room, BoostStage.ValidateBoost);
                break;

            case BoostStage.ValidateBoost:
                this.setBoostStage(room, BoostStage.ClearLab);
                if (BoostLib.creepIsBoosted(boostTarget, boosts.type)) {
                    BoostLib.removeWantedBoostTypeFromCreepMemory(boostTarget, boosts.type);
                } else {
                    log.error("Boosting of " + boostTarget.name +" with " + boosts.type + " failed", room.name);
                }
                break;
        }
    }

    private moveTargetToBoostPosition(creep: Creep, lab: Lab): boolean {
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

    private moveHaulerToBoostPosition(boostHauler: Creep, lab: Lab) {

        let boostHaulerPosition = BoostLib.getHaulerBoostingPosition(lab);

        if (!BoostLib.boostHaulerInPosition(boostHauler, boostHaulerPosition)) {
            boostHauler.moveTo(boostHaulerPosition);
            return false;
        }

        if (_.sum(boostHauler.carry) > 0) {
            for(let inventory in boostHauler.carry) {
                boostHauler.transfer(boostHauler.room.terminal as Terminal, inventory);
            }
            return false;
        }
        return true;
    }

    private findBoostHauler(room: Room): Creep | undefined {
        let boostHauler = BoostLib.getBoostHauler(room);
        if (boostHauler !== null) {
            return boostHauler;
        }

        let baseHaulers = this.creepService.getCreeps(Role.BaseHauler, null, room.name);
        if (baseHaulers.length > 0) {
            BoostLib.setAsBoostHauler(room, baseHaulers[0]);
            return baseHaulers[0];
        }
        return undefined;
    }

    private setBoostStage(room: Room, stage: BoostStage) {
        room.memory.boostStage = stage;
    }

}
