"use strict";
const _Manager_1 = require("./managers._Manager");
const _Targeting = require("./rolelib.targeting");
const SKGuard = require("./roles.SKGuard");
const SKHealer = require("./roles.SKHealer");
const RampartDefender = require("./roles.RampartDefender");
const BaseRanger = require("./roles.BaseRanger");
const ProfileUtilities = require("./utilities.Profiles");
const WallLib = require("./lib.wall");
const Threat_1 = require("./classes.Threat");
const OrdersRepository = require("./repository.Orders");
const RoomRepository = require("./repository.Room");
const Order_1 = require("./classes.Order");
const Logger_1 = require("./tools.Logger");
const role_1 = require("./enums.role");
const priority_1 = require("./enums.priority");
const roomlevel_1 = require("./enums.roomlevel");
class DefenseManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("DefenseManager");
        this.MEMORY_LASTRUN_SIEGE = "lastRunSiege";
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            this.creepService.runCreeps(role_1.Role.BaseRanger, BaseRanger.run);
            this.creepService.runCreeps(role_1.Role.RampartDefender, RampartDefender.run);
            let normalRooms = this.roomService.getNormalRoomsNotAbandoned();
            for (let room of normalRooms) {
                this.setDefConLevel(room);
                controlTowers(room);
            }
            let praiseRooms = this.roomService.getPraiseRooms();
            for (let room of praiseRooms) {
                controlTowers(room);
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.SKGuard, SKGuard.run);
            this.creepService.runCreeps(role_1.Role.SKHealer, SKHealer.run);
            let lastRunSiege = this.getValue(this.MEMORY_LASTRUN_SIEGE);
            if (lastRunSiege === undefined || lastRunSiege + 50 < Game.time) {
                let rooms = this.roomService.getNormalUnderSiege();
                for (let room of rooms) {
                    this.orderRangersFromNeighbours(room);
                }
                this.setValue(this.MEMORY_LASTRUN_SIEGE, Game.time);
            }
        }
    }
    orderRangersFromNeighbours(room) {
        if (room.memory.defcon < 2) {
            return;
        }
        let allRooms = this.roomService.getNormalRooms();
        for (let r of allRooms) {
            if (r.name !== room.name && !r.isUnderSiege() && r.storage !== undefined && r.storage.store[RESOURCE_ENERGY] > 30000) {
                let d = Game.map.getRoomLinearDistance(room.name, r.name);
                if (d < 6) {
                    this.orderRangerForSiegedRoom(r, room);
                    this.orderPaladinForSiegedRoom(r, room);
                    return;
                }
            }
        }
    }
    orderRangerForSiegedRoom(room, target) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Ranger, target.name);
        let spawned = this.creepService.getCreeps(role_1.Role.Ranger, target.name, null).length;
        if (ordered + spawned >= 1 || ordered > 0) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierRanger(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getRangerBody(maxTier);
        order.priority = priority_1.Priority.Important;
        order.memory = { role: role_1.Role.Ranger, target: target.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderPaladinForSiegedRoom(room, target) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Paladin, target.name);
        let spawned = this.creepService.getCreeps(role_1.Role.Paladin, target.name, null).length;
        if (ordered + spawned >= 1 || ordered > 0) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierPaladin(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getPaladinBody(maxTier);
        order.priority = priority_1.Priority.Important;
        order.memory = { role: role_1.Role.Paladin, target: target.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    setDefConLevel(room) {
        if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 30000) {
            room.memory.defcon = undefined;
            return;
        }
        let currentLevel = room.memory.defcon;
        if ((Game.time + RoomRepository.getIndex(room)) % 5 === 0 || currentLevel !== undefined) {
            let hostileCreeps = _Targeting.findHostileCreepsInRoom(room);
            if (hostileCreeps.length === 0 && (room.memory.defconset + 200) < Game.time) {
                room.memory.defcon = undefined;
                room.memory.threat = undefined;
                if (currentLevel !== undefined) {
                    Logger_1.log.info("Enemies seems to have disappeared: Defcon level for the room removed", room.name);
                }
            }
            else if (hostileCreeps.length > 0) {
                for (let creep of hostileCreeps) {
                    if (creep.owner.username !== "Invader" && creep.body.length > 1) {
                        if (currentLevel < 3 && creepIsInsideBorderWall(creep)) {
                            setDefConLevelToAtLeast(room, 3);
                        }
                        else if (currentLevel < 2 && creepLooksHostile(creep)) {
                            setDefConLevelToAtLeast(room, 2);
                        }
                        else if (currentLevel == undefined) {
                            setDefConLevelToAtLeast(room, 1);
                        }
                    }
                }
            }
            if (room.memory.defcon !== undefined) {
                if (room.memory.threat === undefined || (room.memory.threat.tick !== undefined && (room.memory.threat.tick + 10) < Game.time)) {
                    setThreatLevels(room);
                    safemodeCheck(room);
                    this.runDefcon(room, room.memory.defcon);
                }
            }
        }
    }
    runDefcon(room, defcon) {
        let threat = room.memory.threat;
        if (threat === undefined) {
            console.log("Somehow running defcon ordering without having a threat? Room " + room.name + " - DefCon " + defcon);
            return;
        }
        if (defcon === 1 && room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 50000) {
            this.orderBaseRanger(room, 1);
        }
        else if (defcon === 2) {
            this.orderRampartDefender(room, 1);
            let rangers = Math.min(3, Math.ceil(threat.healThreat / 40));
            this.orderBaseRanger(room, rangers);
            if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 50000) {
                return;
            }
        }
        else if (defcon === 3) {
            this.orderRampartDefender(room, 2);
            let rangers = Math.min(3, Math.ceil(threat.healThreat / 25));
            this.orderBaseRanger(room, rangers);
            if (room.storage === undefined || room.storage.store[RESOURCE_ENERGY] < 50000) {
                return;
            }
            this.orderProtector(room);
        }
    }
    orderBaseRanger(room, maxCount) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.BaseRanger, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.BaseRanger, room.name).length;
        if (ordered + spawned >= maxCount || ordered > 0) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierBaseRanger(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getBaseRangerBody(maxTier);
        order.priority = priority_1.Priority.Critical;
        order.memory = { role: role_1.Role.BaseRanger, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderRampartDefender(room, maxCount) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.RampartDefender, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.RampartDefender, room.name).length;
        if (ordered + spawned >= maxCount || ordered > 0) {
            return;
        }
        let maxTier = ProfileUtilities.getMaxTierRogue(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getRogueBody(maxTier);
        order.priority = priority_1.Priority.Critical;
        order.memory = { role: role_1.Role.RampartDefender, target: room.name, tier: maxTier };
        OrdersRepository.orderCreep(room, order);
    }
    orderProtector(room, boosted = false) {
        let ordered = OrdersRepository.getCreepsInQueue(room, role_1.Role.Protector, room.name);
        let spawned = this.creepService.getCreeps(role_1.Role.Protector, room.name).length;
        if (ordered + spawned >= 1) {
            return;
        }
        let boost = undefined;
        if (boosted) {
            boost = [RESOURCE_CATALYZED_LEMERGIUM_ACID];
        }
        let maxTier = ProfileUtilities.getMaxTierProtector(room.energyCapacityAvailable);
        let order = new Order_1.Order();
        order.body = ProfileUtilities.getProtectorBody(maxTier);
        order.priority = priority_1.Priority.Standard;
        order.memory = { role: role_1.Role.Protector, target: room.name, tier: maxTier, boost: boost };
        OrdersRepository.orderCreep(room, order);
    }
}
exports.DefenseManager = DefenseManager;
function safemodeCheck(room) {
    if (room.controller !== undefined && room.controller.safeModeCooldown === undefined) {
        let basePos = RoomRepository.getBasePosition(room);
        if (basePos === undefined) {
            return;
        }
        let enemies = room.getHostileCreeps();
        let middlePos = new RoomPosition(basePos.x, basePos.y + 2, basePos.roomName);
        for (let c of enemies) {
            if (c.pos.getRangeTo(middlePos) < 4) {
                room.controller.activateSafeMode();
                Game.notify("Room " + room.name + " was set in safe mode because enemies are inside the base.");
                Logger_1.log.alert("The room was set in safe mode because enemies are inside the base.", room.name);
            }
        }
    }
}
function creepLooksHostile(creep) {
    return creep.body.length > 20 && creep.body[0].boost !== undefined &&
        (creep.getActiveBodyparts(ATTACK) > 10 || creep.getActiveBodyparts(RANGED_ATTACK) > 10 || creep.getActiveBodyparts(HEAL) > 10);
}
function creepIsInsideBorderWall(creep) {
    return creep.pos.x > 2 && creep.pos.x < 47 && creep.pos.y > 2 && creep.pos.y < 47 && creepHasFreePathToStorage(creep);
}
function creepHasFreePathToStorage(creep) {
    let target = creep.room.storage;
    if (target === undefined) {
        return false;
    }
    if (creep.room.memory.borderwall === undefined) {
        return false;
    }
    let wallpositions = _.map(JSON.parse(creep.room.memory.borderwall), (p) => WallLib.longPos(p, creep.room.name));
    let costMatrix = WallLib.getBorderwallRoomCallback(wallpositions);
    let ret = PathFinder.search(creep.pos, { pos: target.pos, range: 1 }, {
        plainCost: 1,
        swampCost: 1,
        roomCallback: () => costMatrix,
        maxRooms: 1,
    });
    for (let p of ret.path) {
        for (let wallP of wallpositions) {
            if (p.x === wallP.x && p.y === wallP.y) {
                return false;
            }
        }
    }
    return true;
}
function setDefConLevelToAtLeast(room, level) {
    if (room.memory.defcon === undefined || room.memory.defcon < level) {
        Game.notify("Room " + room.name + " has raised DefCon level to " + level + ".");
        Logger_1.log.alert("Warning: Defcon raised to level " + level, room.name);
        room.memory.defcon = level;
        room.memory.defconset = Game.time;
    }
}
function controlTowers(room) {
    if (room.isUnderSiege()) {
        let injuredCreep = getInjuredCreep(room, true);
        if (injuredCreep !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                healTargetCreep(tower, injuredCreep);
            }
            return;
        }
        let priTarget = Game.getObjectById(room.memory.priTarget);
        if (priTarget !== null) {
            room.memory.priTarget = undefined;
        }
        if (priTarget !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                shootHostileCreep(tower, priTarget);
            }
            return;
        }
        let hostileCreep = getHostileCreepNotAtBorder(room);
        if (hostileCreep !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                if (tower.pos.getRangeTo(hostileCreep) < 10 || tower.energy > tower.energyCapacity / 2) {
                    shootHostileCreep(tower, hostileCreep);
                }
            }
            return;
        }
        let injuredCreepSecondary = getInjuredCreep(room);
        if (injuredCreepSecondary !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                healTargetCreep(tower, injuredCreepSecondary);
            }
            return;
        }
        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            let structureNeedingRepair = getStructureNeedingRepair(room);
            if (structureNeedingRepair !== null && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.CivilizedColony) {
                let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                for (let tower of towersInRoom) {
                    repairStructure(tower, structureNeedingRepair);
                }
                return;
            }
        }
    }
    else if (room.memory.towerSleep === undefined || Game.time >= room.memory.towerSleep) {
        let hostileCreep = getHostileCreepNotAtBorder(room);
        if (hostileCreep !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                shootHostileCreep(tower, hostileCreep);
            }
            return;
        }
        let injuredCreep = getInjuredCreep(room);
        if (injuredCreep !== null) {
            let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (let tower of towersInRoom) {
                healTargetCreep(tower, injuredCreep);
            }
            return;
        }
        if (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] > 20000) {
            let structureNeedingRepair = getStructureNeedingRepair(room);
            if (structureNeedingRepair !== null && RoomRepository.getRoomLevel(room) >= roomlevel_1.RoomLevel.CivilizedColony) {
                let towersInRoom = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                for (let tower of towersInRoom) {
                    repairStructure(tower, structureNeedingRepair);
                }
                return;
            }
        }
        room.memory.towerSleep = Game.time + 10;
    }
}
function setThreatLevels(room) {
    let hostiles = _Targeting.findHostileCreepsInRoom(room);
    let threat = new Threat_1.Threat();
    for (let c of hostiles) {
        let tempTough = 0;
        let tempRanged = 0;
        let tempWork = 0;
        let tempHeal = 0;
        let tempAttack = 0;
        for (let b of c.body) {
            if (b.type === TOUGH) {
                if (b.boost === undefined) {
                    threat.toughThreat += 1;
                }
                else if (b.boost === RESOURCE_CATALYZED_GHODIUM_ALKALIDE) {
                    threat.toughThreat += 5;
                    tempTough += 3;
                }
                else if (b.boost === RESOURCE_GHODIUM_ALKALIDE) {
                    threat.toughThreat += 3;
                    tempTough += 1;
                }
                else if (b.boost === RESOURCE_GHODIUM_OXIDE) {
                    threat.toughThreat += 2;
                }
            }
            else if (b.type === RANGED_ATTACK) {
                if (b.boost === undefined) {
                    threat.rangedThreat += 1;
                }
                else if (b.boost === RESOURCE_CATALYZED_KEANIUM_ALKALIDE) {
                    threat.rangedThreat += 5;
                    tempRanged += 3;
                }
                else if (b.boost === RESOURCE_KEANIUM_ALKALIDE) {
                    threat.rangedThreat += 3;
                    tempRanged += 1;
                }
                else if (b.boost === RESOURCE_KEANIUM_OXIDE) {
                    threat.rangedThreat += 2;
                }
            }
            else if (b.type === HEAL && b.boost !== undefined) {
                if (b.boost === undefined) {
                    threat.healThreat += 1;
                }
                else if (b.boost === RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE) {
                    threat.healThreat += 5;
                    tempHeal += 3;
                }
                else if (b.boost === RESOURCE_LEMERGIUM_ALKALIDE) {
                    threat.healThreat += 3;
                    tempHeal += 1;
                }
                else if (b.boost === RESOURCE_LEMERGIUM_OXIDE) {
                    threat.healThreat += 2;
                }
            }
            else if (b.type === ATTACK && b.boost !== undefined) {
                if (b.boost === undefined) {
                    threat.attackThreat += 1;
                }
                else if (b.boost === RESOURCE_CATALYZED_UTRIUM_ACID) {
                    threat.attackThreat += 5;
                    tempAttack += 3;
                }
                else if (b.boost === RESOURCE_UTRIUM_ACID) {
                    threat.attackThreat += 3;
                    tempAttack += 1;
                }
                else if (b.boost === RESOURCE_UTRIUM_HYDRIDE) {
                    threat.attackThreat += 2;
                }
            }
            else if (b.type === WORK && b.boost !== undefined) {
                if (b.boost === undefined) {
                    threat.workThreat += 1;
                }
                else if (b.boost === RESOURCE_CATALYZED_ZYNTHIUM_ACID) {
                    threat.workThreat += 5;
                    tempWork += 3;
                }
                else if (b.boost === RESOURCE_ZYNTHIUM_ACID) {
                    threat.workThreat += 3;
                    tempWork += 1;
                }
                else if (b.boost === RESOURCE_ZYNTHIUM_HYDRIDE) {
                    threat.workThreat += 2;
                }
            }
        }
        threat.boostedTough = Math.max(tempTough, threat.boostedTough);
        threat.boostedRanged = Math.max(tempRanged, threat.boostedRanged);
        threat.boostedWork = Math.max(tempWork, threat.boostedWork);
        threat.boostedHeal = Math.max(tempHeal, threat.boostedHeal);
        threat.boostedAttack = Math.max(tempAttack, threat.boostedAttack);
    }
    room.memory.threat = threat;
}
function getHostileCreepNotAtBorder(room) {
    if (room.memory.attack !== undefined) {
        let target = Game.getObjectById(room.memory.attack);
        if (target instanceof Creep) {
            return target;
        }
        else {
            room.memory.attack = undefined;
        }
    }
    let hostileCreeps = room.getHostileCreepsNotAtBorder();
    if (hostileCreeps.length > 0) {
        if (room.storage === undefined) {
            return hostileCreeps[0];
        }
        return room.storage.pos.findClosestByRange(hostileCreeps);
    }
    return null;
}
function shootHostileCreep(tower, creep) {
    if (tower.energy >= 10) {
        tower.attack(creep);
        return true;
    }
    return false;
}
function getInjuredCreep(room, isUnderSiege = false) {
    if (isUnderSiege) {
        let unitsInNeed = room.find(FIND_MY_CREEPS, { filter: function (c) {
                return (c.hits < (c.hitsMax - 400));
            } });
        if (unitsInNeed.length > 0) {
            return unitsInNeed[0];
        }
        return null;
    }
    else {
        let unitsInNeed = room.find(FIND_MY_CREEPS, { filter: function (c) {
                return (c.hits < c.hitsMax);
            } });
        if (unitsInNeed.length > 0) {
            return unitsInNeed[0];
        }
        return null;
    }
}
function healTargetCreep(tower, creep) {
    if (tower.energy >= 10) {
        tower.heal(creep);
        return true;
    }
    return false;
}
function getStructureNeedingRepair(room) {
    let structuresInNeed = room.find(FIND_STRUCTURES, { filter: function (s) {
            return (s.structureType === STRUCTURE_RAMPART && s.hits < 1000) || (s.structureType === STRUCTURE_WALL && s.hits < 100);
        } });
    if (structuresInNeed.length > 0) {
        return structuresInNeed[0];
    }
    return null;
}
function repairStructure(tower, structure) {
    if (tower.energy >= 10) {
        tower.repair(structure);
        return true;
    }
    return false;
}
