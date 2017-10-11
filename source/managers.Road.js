"use strict";
const PathFindingUtilities = require("./utilities.Pathfinding");
const RoomRepository = require("./repository.Room");
const IntelLib = require("./lib.intel");
const BaseLib = require("./lib.base");
const ExtensionLib = require("./lib.extension");
const _Manager_1 = require("./managers._Manager");
class RoadInfo {
}
class RoadManager extends _Manager_1.Manager {
    constructor(roomService) {
        super("RoadManager");
        this.MEMORY_LASTRUN = "lastRun";
        this.MEMORY_TICKLASTINDEX = "tickIndex";
        this.MEMORY_LASTRUN_EXTENSIONROADS = "tickExtRoads";
        this.MEMORY_INDEX_EXTENSIONROADS = "indexExtRoads";
        this.MEMORY_LASTINDEX = "lastIndex";
        this.MEMORY_LOADEDINDEX = "loadedIndex";
        this.MEMORY_SEGMENTTOLOAD = "segLoad";
        this.roomService = roomService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Low) {
            let tickLastIndex = this.getValue(this.MEMORY_TICKLASTINDEX);
            if (tickLastIndex === undefined || tickLastIndex + 1000 < Game.time) {
                this.setValue(this.MEMORY_LASTINDEX, RoomRepository.getLastIndex());
                this.setValue(this.MEMORY_TICKLASTINDEX, Game.time);
            }
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 20 < Game.time) {
                let roadinfo = this.updateRoadSegmentForLoadedRoom();
                if (roadinfo !== undefined) {
                    this.saveRoadsNeedingRepairingToMemory(roadinfo);
                }
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
            this.requestSegmentForNextTick();
        }
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            let tickLastExtensionRoads = this.getValue(this.MEMORY_LASTRUN_EXTENSIONROADS);
            if (tickLastExtensionRoads === undefined || tickLastExtensionRoads + 100 < Game.time) {
                let roomIndex = this.getValue(this.MEMORY_INDEX_EXTENSIONROADS);
                if (roomIndex === undefined) {
                    roomIndex = 1;
                }
                let roomDone = true;
                let room = RoomRepository.getRoomForIndex(roomIndex);
                if (room !== undefined && RoomRepository.roomShouldBuild(room)) {
                    roomDone = !buildRoadsToExtensions(room);
                }
                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
                if (lastIndex === undefined) {
                    console.log("Error with lastIndex in RoadManager.");
                    return;
                }
                if (roomDone) {
                    let nextIndex = roomIndex + 1;
                    if (nextIndex > lastIndex) {
                        nextIndex = 1;
                    }
                    this.setValue(this.MEMORY_INDEX_EXTENSIONROADS, nextIndex);
                }
                this.setValue(this.MEMORY_LASTRUN_EXTENSIONROADS, Game.time);
            }
        }
    }
    updateRoadSegmentForLoadedRoom() {
        let usedCpu = Game.cpu.getUsed();
        let segmentToLoad = this.getValue(this.MEMORY_SEGMENTTOLOAD);
        if (segmentToLoad === undefined) {
            this.setValue(this.MEMORY_SEGMENTTOLOAD, 51);
            segmentToLoad = 51;
        }
        let roadInfo = this.loadRoadInfoFromSegment(segmentToLoad);
        let room = RoomRepository.getRoomForIndex(segmentToLoad - 50);
        let processingFinishedForRoom = true;
        if (roadInfo !== undefined && room !== undefined && room.controller !== undefined && room.controller.my &&
            (room.controller.level > 2 || (room.controller.level === 2 && room.controller.progress > room.controller.progressTotal * 0.5)) &&
            (room.storage !== undefined || room.getBaseContainer() !== undefined)) {
            if (room.name !== roadInfo.roomName) {
                roadInfo.roomName = room.name;
                roadInfo.roads = {};
            }
            let targetsForRoom = this.getRoadTargetIds(room);
            for (let id of targetsForRoom) {
                let target = Game.getObjectById(id);
                if (target !== null && target.pos !== undefined && target.pos instanceof RoomPosition) {
                    if (roadInfo.roads[id] === undefined || roadInfo.roads[id].timePositions + 5000 < Game.time) {
                        if (roadInfo.roads[id] === undefined) {
                            roadInfo.roads[id] = {
                                timePositions: Game.time,
                                timeBuilt: 0,
                                positions: getRoadsTo(room, this.getRoadTargetFor(target))
                            };
                        }
                        else {
                            roadInfo.roads[id].timePositions = Game.time;
                            roadInfo.roads[id].positions = getRoadsTo(room, this.getRoadTargetFor(target));
                        }
                    }
                }
                if (Game.cpu.getUsed() > usedCpu + 40) {
                    processingFinishedForRoom = false;
                    break;
                }
            }
            for (let id of Object.keys(roadInfo.roads)) {
                if (roadInfo.roads[id].timePositions + 20000 < Game.time) {
                    delete roadInfo.roads[id];
                    console.log("Deleting target for road no longer valid: " + id + " for room " + roadInfo.roomName);
                    continue;
                }
                if (room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 || roadConstructionLimitReached() ||
                    (room.storage === undefined && room.getBaseContainer() === undefined) ||
                    (room.storage !== undefined && !room.storage.isActive()) ||
                    (room.storage !== undefined && room.storage.store[RESOURCE_ENERGY] < 30000)) {
                    break;
                }
                if (roadInfo.roads[id].timeBuilt === undefined || roadInfo.roads[id].timeBuilt + 5000 < Game.time) {
                    roadInfo.roads[id].timeBuilt = Game.time;
                    let startPos = RoomRepository.getBasePosition(room);
                    let target = Game.getObjectById(id);
                    if (startPos !== undefined && target !== null) {
                        if (room.storage !== undefined) {
                            startPos = room.storage.pos;
                        }
                        buildRoadBetween(startPos, this.getRoadTargetFor(target), false, false, RoomRepository.isMiddleRoom(target.room.name));
                    }
                }
                if (Game.cpu.getUsed() > usedCpu + 80) {
                    break;
                }
            }
        }
        if (roadInfo !== undefined) {
            Memory.stats['roads.' + roadInfo.roomName + '.total'] = _.sum(roadInfo.roads, (i) => i.positions.length);
            RawMemory.segments[segmentToLoad] = JSON.stringify(roadInfo);
        }
        else {
            RawMemory.segments[segmentToLoad] = "";
        }
        if (processingFinishedForRoom) {
            let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
            if (lastIndex === undefined) {
                console.log("Error with lastIndex in RoadManager.");
                return;
            }
            let nextIndex = segmentToLoad + 1;
            if (nextIndex > lastIndex + 50) {
                nextIndex = 51;
            }
            this.setValue(this.MEMORY_SEGMENTTOLOAD, nextIndex);
        }
        return roadInfo;
    }
    saveRoadsNeedingRepairingToMemory(roadInfo) {
        if (roadInfo === undefined || roadInfo.roomName === undefined || roadInfo.roads === undefined) {
            return;
        }
        let room = Game.rooms[roadInfo.roomName];
        if (room === undefined || room.controller === undefined || room.isExpansion()) {
            return;
        }
        if (room.memory.roadsUpdate !== undefined && room.memory.roadsUpdate + 300 > Game.time) {
            return;
        }
        let structureIds = [];
        let basepos = RoomRepository.getBasePosition(room);
        if (basepos !== undefined) {
            for (let r of BaseLib.getAllBaseRoads(basepos)) {
                if (r.hitsMax - r.hits > 2000) {
                    structureIds.push(r.id);
                }
            }
            for (let r of ExtensionLib.getExtensionRoads(room, basepos)) {
                if (r.hitsMax - r.hits > 2000) {
                    structureIds.push(r.id);
                }
            }
        }
        let roadid, road;
        for (let id of Object.keys(roadInfo.roads)) {
            for (roadid of roadInfo.roads[id].positions) {
                road = Game.getObjectById(roadid);
                if (road instanceof StructureRoad && road.hitsMax - road.hits > 2000) {
                    structureIds.push(road.id);
                }
            }
        }
        room.memory.roads = _.unique(structureIds);
        Memory.stats['roads.' + roadInfo.roomName + '.repair'] = room.memory.roads.length;
        room.memory.roadsUpdate = Game.time;
    }
    requestSegmentForNextTick() {
        let segmentToLoad = this.getValue(this.MEMORY_SEGMENTTOLOAD);
        if (segmentToLoad === undefined) {
            this.setValue(this.MEMORY_SEGMENTTOLOAD, 51);
        }
        else {
            RawMemory.setActiveSegments([segmentToLoad]);
        }
    }
    getRoadTargetIds(room) {
        let sourceIds = getSourceIds(room);
        let mineralId = undefined;
        if (room.controller !== undefined && room.controller.my && room.controller.level >= 6) {
            mineralId = getMineralId(room);
        }
        let praiseroomControllerId = getPraiseRoomControllerId(room);
        let praiseroomMineralId = getPraiseRoomMineralId(room);
        let skroomMineralIds = getSkRoomMineralIds(room);
        let roadTargets = [];
        if (room.controller !== undefined) {
            roadTargets.push(room.controller.id);
        }
        if (sourceIds.length > 0) {
            roadTargets = roadTargets.concat(sourceIds);
        }
        if (mineralId !== undefined) {
            roadTargets.push(mineralId);
        }
        if (praiseroomControllerId !== undefined) {
            roadTargets.push(praiseroomControllerId);
        }
        if (praiseroomMineralId !== undefined) {
            roadTargets.push(praiseroomMineralId);
        }
        if (skroomMineralIds.length > 0) {
            roadTargets = roadTargets.concat(skroomMineralIds);
        }
        return roadTargets;
    }
    loadRoadInfoFromSegment(segmentToLoad) {
        if (segmentToLoad === undefined || !(_.contains(Object.keys(RawMemory.segments), "" + segmentToLoad))) {
            return undefined;
        }
        let roadInfo;
        if (typeof RawMemory.segments[segmentToLoad] === 'string' && RawMemory.segments[segmentToLoad].length > 0) {
            roadInfo = JSON.parse(RawMemory.segments[segmentToLoad]);
        }
        if (roadInfo === undefined || roadInfo.roomName === undefined) {
            roadInfo = new RoadInfo();
            let room = RoomRepository.getRoomForIndex(segmentToLoad - 50);
            if (room === undefined) {
                let lastIndex = this.getValue(this.MEMORY_LASTINDEX);
                let nextIndex = segmentToLoad + 1;
                if (nextIndex > lastIndex + 50) {
                    nextIndex = 51;
                }
                this.setValue(this.MEMORY_SEGMENTTOLOAD, nextIndex);
                return undefined;
            }
            roadInfo.roomName = room.name;
        }
        if (roadInfo.roads === undefined) {
            roadInfo.roads = {};
        }
        return roadInfo;
    }
    getRoadTargetFor(t) {
        if (t instanceof StructureController) {
            let containerPos = t.getContainerPosition();
            if (containerPos !== undefined) {
                return containerPos;
            }
            else if (t.room.storage !== undefined) {
                return t.room.storage.pos;
            }
        }
        else if (t instanceof Source) {
            let containerPos = t.getContainerPosition();
            if (containerPos !== undefined) {
                return containerPos;
            }
        }
        else if (t instanceof Mineral) {
            let containerPos = t.getContainerPosition();
            if (containerPos !== undefined) {
                return containerPos;
            }
        }
        return t.pos;
    }
}
exports.RoadManager = RoadManager;
function buildRoadsToExtensions(room) {
    if (room.storage === undefined) {
        return false;
    }
    let extensions = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTENSION });
    for (let e of extensions) {
        if (!extensionHasRoadConnection(e)) {
            buildRoadBetween(e.pos, room.storage.pos);
            return true;
        }
    }
    return false;
}
function extensionHasRoadConnection(e) {
    for (let x of [-1, 0, 1]) {
        for (let y of [-1, 0, 1]) {
            let pos = new RoomPosition(e.pos.x + x, e.pos.y + y, e.pos.roomName);
            let atPosConSites = pos.lookFor(LOOK_CONSTRUCTION_SITES);
            for (let c of atPosConSites) {
                if (c.structureType === STRUCTURE_ROAD) {
                    return true;
                }
            }
            let atPosStructures = pos.lookFor(LOOK_STRUCTURES);
            for (let c of atPosStructures) {
                if (c.structureType === STRUCTURE_ROAD) {
                    return true;
                }
            }
        }
    }
    return false;
}
function getRoadsTo(r, pos) {
    let startPos = RoomRepository.getBasePosition(r);
    if (startPos === undefined) {
        return [];
    }
    if (r.storage !== undefined) {
        startPos = r.storage.pos;
    }
    return getRoadBetween(startPos, pos, RoomRepository.isMiddleRoom(pos.roomName));
}
function getSourceIds(room) {
    let sourceIds = [];
    for (let sourceId of IntelLib.sourceIds(room.name)) {
        sourceIds.push(sourceId);
    }
    let outposts = RoomRepository.getAllOutposts(room);
    for (let outpost of outposts) {
        if (Game.rooms[outpost] !== undefined && Game.rooms[outpost].name !== undefined && IntelLib.hasIntel(outpost)) {
            for (let sourceId of IntelLib.sourceIds(outpost)) {
                sourceIds.push(sourceId);
            }
        }
    }
    return sourceIds;
}
function getMineralId(room) {
    let minerals = room.find(FIND_MINERALS);
    if (minerals.length !== 1) {
        return;
    }
    return minerals[0].id;
}
function getSkRoomMineralIds(room) {
    let ids = [];
    let lairs = RoomRepository.getLairOutposts(room);
    if (lairs.length > 0) {
        for (let outpost of lairs) {
            if (Game.rooms[outpost] !== undefined && Game.rooms[outpost].name !== undefined && IntelLib.hasIntel(outpost)) {
                let minerals = Game.rooms[outpost].find(FIND_MINERALS);
                if (minerals.length === 1) {
                    ids.push(minerals[0].id);
                }
            }
        }
    }
    return ids;
}
function getPraiseRoomControllerId(room) {
    if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
        let praiseroom = Game.rooms[room.memory.praiseroom];
        if (praiseroom !== undefined && praiseroom.controller !== undefined) {
            return praiseroom.controller.id;
        }
    }
    return undefined;
}
function getPraiseRoomMineralId(room) {
    if (room.memory.praiseroom !== undefined && !room.memory.praiseroomHibernated) {
        let praiseroom = Game.rooms[room.memory.praiseroom];
        if (praiseroom !== undefined && praiseroom.controller !== undefined) {
            let minerals = praiseroom.find(FIND_MINERALS);
            if (minerals.length === 1) {
                return minerals[0].id;
            }
        }
    }
    return undefined;
}
function deleteAllFlags() {
    let flags = Game.flags;
    for (let f in flags) {
        Game.flags[f].remove();
    }
}
exports.deleteAllFlags = deleteAllFlags;
function simBuildRoadBetween(pos1, pos2) {
    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2);
    console.log("Path length: " + pathForRoad.length);
    for (let position of pathForRoad) {
        let room = Game.rooms[position.roomName];
        if (room !== undefined && room instanceof Room) {
            position.createFlag();
        }
    }
    return true;
}
exports.simBuildRoadBetween = simBuildRoadBetween;
function buildRoadAtPosIfNotPresent(pos) {
    if (pos.x <= 0 || pos.x >= 49 || pos.y <= 0 || pos.y >= 49) {
        return -100;
    }
    let posGround = Game.map.getTerrainAt(pos);
    if (posGround !== "plain" && posGround !== "swamp") {
        return -100;
    }
    let structuresAtPos = pos.lookFor(LOOK_STRUCTURES);
    let constructionSitesAtPos = pos.lookFor(LOOK_CONSTRUCTION_SITES);
    for (let s of structuresAtPos) {
        if (s.structureType !== STRUCTURE_ROAD && s.structureType !== STRUCTURE_RAMPART) {
            return -100;
        }
        else if (s.structureType === STRUCTURE_ROAD) {
            return -100;
        }
    }
    for (let c of constructionSitesAtPos) {
        if (c.structureType !== STRUCTURE_ROAD && c.structureType !== STRUCTURE_RAMPART) {
            return -100;
        }
        if (c.structureType === STRUCTURE_ROAD) {
            return -100;
        }
    }
    return pos.createConstructionSite(STRUCTURE_ROAD);
}
function buildRoadAroundPosition(pos, range = 1, onlySwamps = false, onlyCorners = false, includeMiddle = false) {
    if (range < 1 || roadConstructionLimitReached()) {
        return false;
    }
    let room = Game.rooms[pos.roomName];
    if (room === undefined || (!(room instanceof Room))) {
        return true;
    }
    for (let x = -range; x < range + 1; x++) {
        for (let y = -range; y < range + 1; y++) {
            let position = new RoomPosition(pos.x + x, pos.y + y, pos.roomName);
            if (includeMiddle || !(x === 0 && y === 0)) {
                if (!roadConstructionLimitReached() && ((!onlySwamps || Game.map.getTerrainAt(position) === "swamp") && (!onlyCorners || Math.abs(x) + Math.abs(y) < range + 1))) {
                    if (buildRoadAtPosIfNotPresent(position) === ERR_FULL) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
exports.buildRoadAroundPosition = buildRoadAroundPosition;
function buildRoadBetween(pos1, pos2, onlySwamps = false, highway = false, allowSK = false) {
    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2, allowSK);
    for (let position of pathForRoad) {
        let room = Game.rooms[position.roomName];
        if (room !== undefined && room instanceof Room &&
            (!roadConstructionLimitReached() && (!onlySwamps || Game.map.getTerrainAt(position) === "swamp"))) {
            if (buildRoadAtPosIfNotPresent(position) === ERR_FULL) {
                return false;
            }
            if (highway) {
                buildRoadAroundPosition(position, 1, true, true);
            }
        }
    }
    return true;
}
function getRoadBetween(pos1, pos2, allowSK = false) {
    let pathForRoad = PathFindingUtilities.getRoadPathBetween(pos1, pos2, allowSK);
    let roads = [];
    for (let position of pathForRoad) {
        let room = Game.rooms[position.roomName];
        if (room !== undefined && room instanceof Room) {
            let structures = position.lookFor(LOOK_STRUCTURES);
            for (let s of structures) {
                if (s.structureType === STRUCTURE_ROAD) {
                    roads.push(s.id);
                }
            }
        }
    }
    return roads;
}
function roadConstructionLimitReached() {
    return Object.keys(Game.constructionSites).length > 60;
}
