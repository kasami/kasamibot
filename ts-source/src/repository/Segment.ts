import * as RoomRepository from "../repository/Room";

export function setOutpostRoads(index: string, outpostRoads: any) {
    RawMemory.segments[index + 50] = JSON.stringify(outpostRoads);
}

export function requestRoadinfo(room: Room) {
    let roomindex = RoomRepository.getIndex(room);
    RawMemory.setActiveSegments([roomindex + 50]);
}

export function getOutpostRoads(index: string): any {
    if (RawMemory.segments[index + 50] !== undefined && !_.isNull(RawMemory.segments[index + 50]) && RawMemory.segments[index + 50] !== "") {
        let roadinfo = JSON.parse(RawMemory.segments[index + 50]);
        return roadinfo;
    }
    console.log("Roadinfo " + RoomRepository.getRoomForIndex(parseInt(index)) + ": Not found or not loaded");
    return [];
}

export function getOutpostRoadsForSegment(segment: string): any {
    if (RawMemory.segments[segment] !== undefined && !_.isNull(RawMemory.segments[segment]) && RawMemory.segments[segment] !== "") {
        let roadinfo = JSON.parse(RawMemory.segments[segment]);
        return roadinfo;
    }
    console.log("Roadinfo in segment" + segment + ": Not found or not loaded");
    return undefined;
}
export function saveStats() {
    RawMemory.segments[1] = JSON.stringify(Memory.stats);
}
