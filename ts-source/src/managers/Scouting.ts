
import * as PowerManager from "../managers/Power";

import * as ProfileUtilities from "../utilities/Profiles";
import * as ScoutingUtilities from "../utilities/Scouting";

import * as ProximityScout from "../roles/ProximityScout";

import * as IntelLib from "../lib/intel";

import * as OrdersRepository from "../repository/Orders";
import * as RoomRepository from "../repository/Room";

import {Order} from "../classes/Order";

import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import {Role} from "../enums/role";
import {Priority} from "../enums/priority";
import {RoomLevel} from "../enums/roomlevel";

import {log} from "../tools/Logger";

export class ScoutingManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    readonly MEMORY_LASTRUN_SCOUT = "lastRunScout";
    readonly MEMORY_LASTRUN_NEIGHBOURS = "lastRunNeighbours";

    constructor(roomService: RoomService, creepService: CreepService) {
        super("ScoutingManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Standard) {
            let rooms = this.roomService.getNormalRooms();
            for (let room of rooms) {
                if (RoomRepository.getRoomLevel(room) === RoomLevel.Metropolis) {
                    if ((Game.time + RoomRepository.getIndex(room)) % 1000 === 5) {
                        let observer = room.getObserver();
                        if (observer !== undefined) {
                            observeNextRoomForPortals(room, observer);
                        }
                    }

                    if ((Game.time + RoomRepository.getIndex(room)) % 1000 === 6) {
                        let observer = room.getObserver();
                        if (observer !== undefined) {
                            checkForPortals(room);
                        }
                    }
                    if ((Game.time + RoomRepository.getIndex(room)) % 20 === 6) {
                        let observer = room.getObserver();
                        if (observer !== undefined) {
                            observeNextRoomForPowerBanks(room, observer);
                        }
                    }

                    if ((Game.time + RoomRepository.getIndex(room)) % 20 === 7) {
                        let observer = room.getObserver();
                        if (observer !== undefined) {
                            if (room.memory.highwaysClose !== undefined && room.memory.observerCounter !== undefined) {
                                let targetRoom = Game.rooms[room.memory.highwaysClose[room.memory.observerCounter]];
                                if (targetRoom instanceof Room) {
                                    checkForPowerBanks(room, targetRoom);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (pri === ManagerPriority.Trivial) {
            this.creepService.runCreeps(Role.ProximityScout, ProximityScout.run);

            let lastRunNeighbours = this.getValue(this.MEMORY_LASTRUN_NEIGHBOURS);
            if (lastRunNeighbours === undefined || lastRunNeighbours + 5000 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    setNeighbours(room);
                }
                this.setValue(this.MEMORY_LASTRUN_NEIGHBOURS, Game.time);
            }

            let lastRunScouting = this.getValue(this.MEMORY_LASTRUN_SCOUT);
            if (lastRunScouting === undefined || lastRunScouting + 500 < Game.time) {
                let rooms = this.roomService.getNormalRooms();
                for (let room of rooms) {
                    if (room.memory.neighbours === undefined) {
                        setNeighbours(room);
                    }

                    // Check if neighbouring rooms need scouting
                    this.checkIfNeighboursNeedScouting(room);

                    // Check if controlled rooms need signing
                    this.checkIfControlledRoomsNeedSigning(room);

                    // Ordering scout for the room if we don't have one and have a target
                    this.orderProximityScout(room);

                    // Ordering signer for the room if we don't have one and have a target
                    this.orderSigner(room);
                }
                this.setValue(this.MEMORY_LASTRUN_SCOUT, Game.time);
            }
        }
    }

    private signerIsGoingThereNow(room: Room, targetRoom: string): boolean {
        let scouts = this.creepService.getCreeps(Role.Signer, targetRoom, room.name);
        if (scouts.length > 0) {
            return true;
        }
        return false;
    }

    private orderSigner(room: Room): void {
        if (room.memory.signingqueue === undefined || room.memory.signingqueue.length === 0) {
            return;
        }
        let currentTiers = this.creepService.getNumberOfTiers(Role.ProximityScout, null, room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.ProximityScout);
        let neededTiers = 1;
        if (neededTiers > currentTiers + orderedTiers)  {
            let order = new Order();
            order.body = ProfileUtilities.getScoutBody(1);
            order.priority = Priority.Critical;
            order.memory = {role: Role.Signer, target: room.name, tier: 1};

            OrdersRepository.orderCreep(room, order);
        }
    }

    private orderProximityScout(room: Room): void {
        if (room.memory.scoutqueue === undefined || room.memory.scoutqueue.length === 0) {
            return;
        }
        let currentTiers = this.creepService.getNumberOfTiers(Role.ProximityScout, null, room.name);
        let orderedTiers = OrdersRepository.getNumberOfTiersInQueue(room, Role.ProximityScout);
        let neededTiers = 1;
        if (neededTiers > currentTiers + orderedTiers)  {
            let order = new Order();
            order.body = ProfileUtilities.getScoutBody(1);
            order.priority = Priority.Critical;
            order.memory = {role: Role.ProximityScout, target: room.name, tier: 1};

            OrdersRepository.orderCreep(room, order);
        }
    }

    public orderSigning(room: Room, roomName: string): boolean {
        if (room.memory.signingqueue === undefined) {
            room.memory.signingqueue = [];
        }
        if (_.contains(room.memory.signingqueue, roomName)) {
            return false;
        }
        if (this.signerIsGoingThereNow(room, roomName)) {
            return false;;
        }

        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].isPraiseRoom) {
            return false;;
        }

        if (Memory.rooms[roomName] !== undefined && Memory.rooms[roomName].inaccessible) {
            return false;
        }

        room.memory.signingqueue.push(roomName);

        log.info("Signing ordered: " + roomName, room.name);
        return true;
    }

    private checkIfNeighboursNeedScouting(room: Room) {
        if (RoomRepository.getRoomLevel(room) < RoomLevel.BasicColonyReadyForExpansion) {
            return;
        }
        if (Memory.settings.bot === true) {
            if (room.memory.neighbours !== undefined) {
                if (room.memory.neighbours.oneAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.oneAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.twoAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.twoAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.threeAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.threeAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.fourAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.fourAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.fiveAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.fiveAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.sixAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.sixAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.sevenAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.sevenAway) {
                        if (IntelLib.needsNewIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
            }
        } else {
            if (room.memory.neighbours !== undefined) {
                if (room.memory.neighbours.oneAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.oneAway) {
                        if (!IntelLib.hasIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
                if (room.memory.neighbours.twoAway !== undefined) {
                    for (let neighbour of room.memory.neighbours.twoAway) {
                        if (!IntelLib.hasIntel(neighbour)) {
                            orderScouting(room, neighbour);
                        }
                    }
                }
            }
        }
    }

    private checkIfControlledRoomsNeedSigning(room: Room) {
        if (RoomRepository.getRoomLevel(room) < RoomLevel.BasicColonyReadyForExpansion) {
            return;
        }
        if (room instanceof Room && room.controller !== undefined) {
            if (room.controller.sign === undefined || room.controller.sign.username !== Memory.settings.user || room.controller.sign.time < (Game.time - 500000)) {
                this.orderSigning(room, room.name);
            }
        }
        let outposts = RoomRepository.getBasicOutposts(room);
        for (let outpostName of outposts) {
            let outpost = Game.rooms[outpostName];
            if (outpost instanceof Room && outpost.controller !== undefined) {
                if (outpost.controller.sign === undefined || outpost.controller.sign.username !== Memory.settings.user || outpost.controller.sign.time < (Game.time - 500000)) {
                    this.orderSigning(room, outpost.name);
                }
            }
        }
    }
}

function checkForPowerBanks(room: Room, targetRoom: Room) {
    let banks = targetRoom.find(FIND_STRUCTURES, {filter: function (s: Structure) {
        return s.structureType === STRUCTURE_POWER_BANK;
    }}) as StructurePowerBank[];
    if (banks !== undefined && banks.length > 0) {
        for (let bank of banks) {
            PowerManager.registerPowerBank(room, bank);
        }
    }
}

function checkForPortals(room: Room) {
    if (Memory.portals === undefined) {
        Memory.portals = {};
    }
    let closestPortalroom = RoomRepository.getClosestPortalroom(room.name);
    if (Game.rooms[closestPortalroom] !== undefined) {
        let portalRoom = Game.rooms[closestPortalroom];
        let portals = portalRoom.find(FIND_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_PORTAL}) as StructurePortal[];
        if (portals.length > 0) {
            if (Memory.portals[closestPortalroom] === undefined) {
                Memory.portals[closestPortalroom] = {decay: portals[0].ticksToDecay, firstSeen: Game.time, dest: portals[0].destination.roomName};
            } else {
                Memory.portals[closestPortalroom].decay = portals[0].ticksToDecay;
            }
        } else {
            delete Memory.portals[closestPortalroom];
        }
    }
}

function observeNextRoomForPowerBanks(room: Room, observer: StructureObserver) {
    if (room.memory.highwaysClose === undefined) {
        room.memory.highwaysClose = ScoutingUtilities.getCloseHighways(room.name);
    }
    if (room.memory.observerCounter === undefined) {
        room.memory.observerCounter = 0;
    } else {
        room.memory.observerCounter = (room.memory.observerCounter + 1) % room.memory.highwaysClose.length;
        observer.observeRoom(room.memory.highwaysClose[room.memory.observerCounter]);
    }
}

function observeNextRoomForPortals(room: Room, observer: StructureObserver) {

    observer.observeRoom(RoomRepository.getClosestPortalroom(room.name));
}


export function orderScouting(room: Room, roomName: string): boolean {
    // TODO: Validate roomName

    if (room.memory.scoutqueue === undefined) {
        room.memory.scoutqueue = [];
    }
    if (_.contains(room.memory.scoutqueue, roomName)) {
        return false;
    }

    if (Memory.empire.inaccessible !== undefined && _.contains(Memory.empire.inaccessible, roomName)) {
        return false;
    }

    room.memory.scoutqueue.push(roomName);

    return true;
}

export function getSigningTarget(roomName: string): string | undefined {
    let room = Game.rooms[roomName];
    if (!(room instanceof Room)) {
        return undefined;
    }

    if (room.memory.signingqueue === undefined) {
        room.memory.signingqueue = [];
        return undefined;
    }

    if (room.memory.signingqueue.length === 0) {
        return undefined;
    }

    let signingTarget = room.memory.signingqueue.shift() as string;

    return signingTarget;
}

function setNeighbours(room: Room) {
    room.memory.neighbours = {
        oneAway: ScoutingUtilities.getRoomsOneAway(room.name),
        twoAway: ScoutingUtilities.getRoomsTwoAway(room.name),
        threeAway: ScoutingUtilities.getRoomsThreeAway(room.name),
        fourAway: ScoutingUtilities.getRoomsFourAway(room.name),
        fiveAway: ScoutingUtilities.getRoomsFiveAway(room.name),
        sixAway: ScoutingUtilities.getRoomsSixAway(room.name),
        sevenAway: ScoutingUtilities.getRoomsSevenAway(room.name)
    }
}

