import * as _Common from "../rolelib/common";

import * as EnergyLib from "../lib/energy";
import * as PositionLib from "../lib/position";
import * as PrayerLib from "../lib/prayer";

import * as RoomRepository from "../repository/Room";

enum State {
    Sleeping = 1,
    Tanking = 2,
    Repairing = 3,
    Building = 4
}

export function run(creep: Creep) {

    if (_Common.isCloseToSourceKeeper(creep)) {
        let dest: RoomPosition | undefined = _Common.getTravelDestinasion(creep);
        if (dest !== undefined) {
            if (_Common.positionIsCloseToSourceKeeper(dest)) {
                _Common.stayAwayFromSourceKeeper(creep);
            } else {
                creep.travelTo({pos: dest}, {avoidKeepers: true});
            }
        } else {
            _Common.stayAwayFromSourceKeeper(creep);
        }
        return;
    }

    if (_Common.moveHomeAndHealIfHurt(creep)) { return; }

    if (!creep.hasState()) {
        creep.setState(State.Tanking);
    }

    switch(creep.getState()) {
        case State.Sleeping:
            runSleeping(creep);
            break;
        case State.Tanking:
            runTanking(creep);
            break;
        case State.Building:
            runBuilding(creep);
            break;
        case State.Repairing:
            runRepairing(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.Sleeping);
            break;
    }
};

function runSleeping(creep: Creep) {
    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
        creep.memory.sleep--;
        _Common.moveOffRoad(creep);
        return;
    }

    let targetConstructionSite = findNewConstructionSite(creep);
    if (targetConstructionSite !== undefined) {
        creep.setState(State.Building);
        runBuilding(creep);
        return;
    }

    let targetRepairSite = findNewRepairSite(creep);
    if (targetRepairSite !== null) {
        creep.setState(State.Repairing);
        runRepairing(creep);
        return;
    }

    if (!creep.isFull()) {
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }

    creep.memory.sleep = 50;
    _Common.moveOffRoad(creep);
}

function runTanking(creep: Creep) {
    if (creep.isEmpty() && creep.ticksToLive < 50) {
        creep.suicide();
        return;
    }
    if (creep.isFull()) {
        creep.setState(State.Sleeping);
        runSleeping(creep);
        return;
    }
    let tankingPlace = getTankingPlace(creep);
    if (tankingPlace === undefined) {
        creep.setState(State.Sleeping);
        return;
    }
    if (tankingPlace instanceof Resource) {
        if (creep.pickup(tankingPlace) === ERR_NOT_IN_RANGE) {
            creep.travelTo(tankingPlace);
        }
    } else
    if (creep.withdraw(tankingPlace, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.travelTo(tankingPlace);
    }
}

function runRepairing(creep: Creep) {
    if (creep.isEmpty()) {
        creep.setState(State.Tanking);
        setNewTankingPlace(creep);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite) as Structure | null;

    if (targetSite !== null) {
        if(_Common.targetRoomHasInvaders(creep, targetSite.room.name)) {
            return;
        }
    }

    if (targetSite === null || targetSite.hits === targetSite.hitsMax) {
        creep.memory.targetSite = undefined;
        targetSite = findNewRepairSite(creep);
    }

    if (targetSite instanceof Structure) {
        if (creep.pos.roomName !== targetSite.pos.roomName || PositionLib.positionIsBorder(creep.pos) || creep.pos.getRangeTo(targetSite) > 3) {
            repairRoadsCloseby(creep);
            creep.travelTo(targetSite, {range: 0});
        } else {
            creep.repair(targetSite)
        }
    }
    if (targetSite === null) {
        creep.setState(State.Sleeping);
    }
}


function runBuilding(creep: Creep) {
    if (creep.isEmpty()) {
        creep.setState(State.Tanking);
        setNewTankingPlace(creep);
        runTanking(creep);
        return;
    }

    let targetSite = Game.getObjectById(creep.memory.targetSite) as ConstructionSite | undefined;
    if (targetSite === null) {
        targetSite = findNewConstructionSite(creep);
    }

    if (targetSite !== null && targetSite !== undefined && targetSite.room !== undefined) {
        if(_Common.targetRoomHasInvaders(creep, targetSite.room.name)) {
            return;
        }
    }

    if (targetSite instanceof ConstructionSite) {
        if (creep.pos.roomName !== targetSite.pos.roomName || PositionLib.positionIsBorder(creep.pos) || creep.pos.getRangeTo(targetSite) > 3) {
            repairRoadsCloseby(creep);
            creep.travelTo(targetSite, {range: 0});
        } else {
            creep.build(targetSite)
        }
    } else {
        creep.memory.targetSite = undefined;
        creep.setState(State.Sleeping);
    }
}

/**
 * Internal helpers
 */

function getTankingPlace(creep: Creep): Resource | Container | Storage | undefined {
    let tankingPlace = Game.getObjectById(creep.memory.tankingId) as Resource | Container | Storage;
    if (tankingPlace === null) {
        setNewTankingPlace(creep);
        tankingPlace = Game.getObjectById(creep.memory.tankingId) as Resource | Container | Storage;
    }
    if (tankingPlace !== null) {
        if (tankingPlace instanceof Resource && tankingPlace.resourceType === RESOURCE_ENERGY && tankingPlace.amount > 100) {
            return tankingPlace;
        } else
        if (tankingPlace instanceof Structure && tankingPlace.store[RESOURCE_ENERGY] > 100) {
            return tankingPlace;
        }
    }
    creep.memory.tankingId = undefined;
    return undefined;
}

function setNewTankingPlace(creep: Creep) {
    if (creep.isInHomeroom()) {
        let building = Game.getObjectById(EnergyLib.getBuildingIdForTanking(creep.room)) as Structure;
        creep.memory.tankingId = building.id;
        return;
    }

    if (creep.room.memory.isPraiseRoom && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 1000) {
        creep.memory.tankingId = creep.room.terminal.id;
        return;
    }

    let drops = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (r: Resource) => r.amount > 200 && r.resourceType === RESOURCE_ENERGY}) as Resource[];
    if (drops.length > 0) {
        let closest = creep.pos.findClosestByRange(drops);
        creep.memory.tankingId = closest.id;
        return;
    }

    let containers = creep.room.find(FIND_STRUCTURES, {filter: (r: Container) => r.structureType === STRUCTURE_CONTAINER && r.store[RESOURCE_ENERGY] > 200}) as Container[];
    if (containers.length > 0) {
        let closest = creep.pos.findClosestByRange(containers);
        creep.memory.tankingId = closest.id;
        return;
    }

    let building = Game.getObjectById(EnergyLib.getBuildingIdForTanking(Game.rooms[creep.getHomeroom()])) as Structure;
    if (building !== null) {
        creep.memory.tankingId = building.id;
    } else {
        console.log("No tankingbuilding found for janitor: " + creep.room);
    }
}

function repairRoadsCloseby(creep: Creep) {
    let roadOnTile = creep.pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of roadOnTile) {
        if(s.structureType === STRUCTURE_ROAD && s.hitsMax - s.hits > 500) {
            creep.repair(s);
        }
    }
}


function findNewConstructionSite(creep: Creep): ConstructionSite | undefined {
    if (creep.memory.homeroom !== undefined && Game.rooms[creep.memory.homeroom] !== null && Game.rooms[creep.memory.homeroom] !== undefined) {
        let outposts = RoomRepository.getBasicOutposts(Game.rooms[creep.memory.homeroom]);
        for (let outpost of outposts.concat(Game.rooms[creep.memory.homeroom].memory.praiseroom)) {
            if (Game.rooms[outpost] instanceof Room) {
                let constructionSitesInRoom = Game.rooms[outpost].find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

                if (constructionSitesInRoom.length > 0) {
                    let site = constructionSitesInRoom[0];
                    if (creep.pos.roomName === outpost) {
                        site = creep.pos.findClosestByRange(constructionSitesInRoom);
                    }
                    creep.memory.targetSite = site.id;
                    return site;
                }
            }
        }
    }
    if (creep.memory.homeroom !== undefined && Game.rooms[creep.memory.homeroom] !== null && Game.rooms[creep.memory.homeroom] !== undefined) {
        let lairs = RoomRepository.getLairOutposts(Game.rooms[creep.memory.homeroom]);
        for (let outpost of lairs) {
            if (Game.rooms[outpost] instanceof Room) {
                let constructionSitesInRoom = Game.rooms[outpost].find(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite[];

                if (constructionSitesInRoom.length > 0)  {
                    let site = constructionSitesInRoom[0];
                    if (creep.pos.roomName === outpost) {
                        site = creep.pos.findClosestByRange(constructionSitesInRoom);
                    }
                    creep.memory.targetSite = site.id;
                    return site;
                }
            }
        }
    }
}

function findNewRepairSite (creep: Creep): Structure | null {
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (creep.memory.homeroom === undefined || homeroom === undefined) {
        return null;
    }
    // Find lowest hp structure in homeroom, and in outpostpaths.
    let structure = getMostDamagedStructure(homeroom);

    if (structure !== undefined) {
        creep.memory.targetSite = structure.id;
        return structure;
    }
    creep.memory.targetSite = undefined;
    return null;
}

function getMostDamagedStructure(room: Room): Structure | undefined {
    let prayerroomcontainers = getDamagedPrayerroomContainers(room);
    if (prayerroomcontainers.length > 0) {
        return prayerroomcontainers[0];
    }

    let homeroomcontainers = getDamagedHomeroomContainers(room);
    if (homeroomcontainers.length > 0) {
        return homeroomcontainers[0];
    }

    let skroomcontainers = getDamagedSKRoomMineralContainers(room);
    if (skroomcontainers.length > 0) {
        return skroomcontainers[0];
    }

    let outpostRoads: string[] = room.memory.roads;
    if (outpostRoads === undefined || _.isNull(outpostRoads)) {
        return undefined;
    }
    let mostInNeed: Structure | undefined = undefined;
    for (let roadId of outpostRoads) {
        let road = Game.getObjectById(roadId);
        if (road instanceof StructureRoad) {
            if (road.hitsMax - road.hits > 3000) {
                if (mostInNeed === undefined) {
                    mostInNeed = road;
                } else
                if (mostInNeed.hitsMax - mostInNeed.hits < road.hitsMax - road.hits) {
                    mostInNeed = road;
                }
            }
        }
    }
    return mostInNeed;
}

function getDamagedPrayerroomContainers(room: Room): Container[] {
    if (room.memory.praiseroom === undefined) {
        return [];
    }
    let praiseroom = Game.rooms[room.memory.praiseroom];
    if (praiseroom === undefined) {
        return [];
    }
    let spawn1 = room.getSpawn();
    if (spawn1 !== undefined && praiseroom.memory.doublepraiser === true) {
        let container = PrayerLib.getSupplyContainer(praiseroom, spawn1.pos);
        if (container !== undefined && container.hitsMax - container.hits > 100000) {
            return [container];
        }
    }
    return [];
}

function getDamagedHomeroomContainers(room: Room): Container[] {
    let containers: Container[] = [];

    let basecontainer = room.getBaseContainer();
    if (basecontainer !== undefined && basecontainer.hitsMax - basecontainer.hits > 100000) {
        containers.push(basecontainer);
    }

    let mineral = room.getMineral();
    if (mineral !== undefined) {
        let mineralcontainer = mineral.getMiningContainer();
        if (mineralcontainer !== null && mineralcontainer.hitsMax - mineralcontainer.hits > 100000) {
            containers.push(mineralcontainer);
        }
    }

    let controller = room.controller;
    if (controller !== undefined) {
        let controllerContainer = controller.getContainer();
        if (controllerContainer !== undefined && controllerContainer.hitsMax - controllerContainer.hits > 100000) {
            containers.push(controllerContainer);
        }
    }
    return containers;
}

function getDamagedSKRoomMineralContainers(room: Room): Container[] {
    let containers: Container[] = [];
    let lairs = RoomRepository.getLairOutposts(room);
    if (!room.memory.praiseroomHibernated) {
        lairs = lairs.concat(room.memory.praiseroom);
    }
    for (let outpost of lairs.concat(room.memory.praiseroom)) {
        if (Game.rooms[outpost] instanceof Room) {
            let m = Game.rooms[outpost].getMineral();
            if (m !== undefined && m.ticksToRegeneration === undefined) {
                let c = m.getMiningContainer();
                if (c !== null && c.hitsMax - c.hits > 100000) {
                    containers.push(c);
                }
            }
        }
    }
    return containers;
}
