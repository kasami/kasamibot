"use strict";
const RoomRepository = require("./repository.Room");
function setOutpostRoads(index, outpostRoads) {
    RawMemory.segments[index + 50] = JSON.stringify(outpostRoads);
}
exports.setOutpostRoads = setOutpostRoads;
function requestRoadinfo(room) {
    let roomindex = RoomRepository.getIndex(room);
    RawMemory.setActiveSegments([roomindex + 50]);
}
exports.requestRoadinfo = requestRoadinfo;
function getOutpostRoads(index) {
    if (RawMemory.segments[index + 50] !== undefined && !_.isNull(RawMemory.segments[index + 50]) && RawMemory.segments[index + 50] !== "") {
        let roadinfo = JSON.parse(RawMemory.segments[index + 50]);
        return roadinfo;
    }
    console.log("Roadinfo " + RoomRepository.getRoomForIndex(parseInt(index)) + ": Not found or not loaded");
    return [];
}
exports.getOutpostRoads = getOutpostRoads;
function getOutpostRoadsForSegment(segment) {
    if (RawMemory.segments[segment] !== undefined && !_.isNull(RawMemory.segments[segment]) && RawMemory.segments[segment] !== "") {
        let roadinfo = JSON.parse(RawMemory.segments[segment]);
        return roadinfo;
    }
    console.log("Roadinfo in segment" + segment + ": Not found or not loaded");
    return undefined;
}
exports.getOutpostRoadsForSegment = getOutpostRoadsForSegment;
function saveStats() {
    RawMemory.segments[1] = JSON.stringify(Memory.stats);
}
exports.saveStats = saveStats;
