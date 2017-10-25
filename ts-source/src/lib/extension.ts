import * as IntelLib from "../lib/intel";

export function simExtensions(basePos: RoomPosition) {
    let cpu = Game.cpu.getUsed();
    let extensionInfo = getRoomExtensionPositions(basePos);

    console.log("Extensionmath: " + (Game.cpu.getUsed() - cpu));

    console.log("Number of extensions: " + extensionInfo.ext.length);

    for (let e of extensionInfo.ext) {
        let p = longPosRoom(e);
        new RoomVisual(p.roomName).rect(p.x - 0.5, p.y - 0.5, 1, 1);
    }

    for (let e of extensionInfo.roads) {
        let p = longPosRoom(e);
        new RoomVisual(p.roomName).rect(p.x - 0.5, p.y - 0.5, 1, 1, {fill: "#0000FF"});
    }

    new RoomVisual(basePos.roomName).rect(basePos.x - 3.5, basePos.y - 1.5, 7, 7, {fill: "#FFFF00"});
    new RoomVisual(basePos.roomName).rect(basePos.x - 2.5, basePos.y + 5.5, 5, 1, {fill: "#FFFF00"});
    new RoomVisual(basePos.roomName).rect(basePos.x - 1.5, basePos.y + 6.5, 3, 1, {fill: "#FFFF00"});

}

export function getExtensionPositions(room: Room, basePos: RoomPosition): RoomPosition[] {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositions(basePos);
        room.memory.extPos = JSON.stringify(posInfo.ext);
        room.memory.extRoads = JSON.stringify(posInfo.roads);
    }
    let positionInfo = JSON.parse(room.memory.extPos) as string[];
    let positions: RoomPosition[] = [];
    for (let p of positionInfo) {
        positions.push(longPosRoom(p));
    }
    return positions;
}

export function getExtensions(room: Room, basePos: RoomPosition): StructureExtension[] {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositions(basePos);
        room.memory.extPos = JSON.stringify(posInfo.ext);
        room.memory.extRoads = JSON.stringify(posInfo.roads);
    }
    let positionInfo = JSON.parse(room.memory.extPos) as string[];
    let exts: StructureExtension[] = [];
    for (let p of positionInfo) {
        let position = longPosRoom(p);
        let atpos = position.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of atpos) {
            if (s.structureType === STRUCTURE_EXTENSION) {
                exts.push(s as StructureExtension);
            }
        }
    }
    return exts;
}

export function getExtensionRoads(room: Room, basePos: RoomPosition): StructureRoad[] {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositions(basePos);
        room.memory.extPos = JSON.stringify(posInfo.ext);
        room.memory.extRoads = JSON.stringify(posInfo.roads);
    }
    let positionInfo = JSON.parse(room.memory.extRoads) as string[];
    let extroads: StructureRoad[] = [];
    for (let p of positionInfo) {
        let position = longPosRoom(p);
        let atpos = position.lookFor(LOOK_STRUCTURES) as Structure[];
        for (let s of atpos) {
            if (s.structureType === STRUCTURE_ROAD) {
                extroads.push(s as StructureRoad);
            }
        }
    }
    return extroads;
}

export function destroyExtensionsNotCorrectlyPlaced(room: Room, basePos: RoomPosition) {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositions(basePos);
        room.memory.extPos = JSON.stringify(posInfo.ext);
        room.memory.extRoads = JSON.stringify(posInfo.roads);
    }
    let count = 0;
    let positionInfo = JSON.parse(room.memory.extPos) as string[];
    let extensions = room.find(FIND_MY_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_EXTENSION}) as Structure[];
    for (let e of extensions) {
        if (!_.contains(positionInfo, shortPosRoom(e.pos))) {
            count++;
            e.destroy();
        }
    }
    if (count > 0) {
        console.log("Running destroy extensions in room " + room.name);
        console.log("Room " + room.name + " destroyed " + count + " extensions.");
    }

    let linkpos = new RoomPosition(basePos.x, basePos.y - 2, basePos.roomName);
    let atPos = linkpos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_LINK) {
            s.destroy();
            console.log("Destroyed outdated link");
        }
    }
}

export function getRoadPositions(room: Room, basePos: RoomPosition): RoomPosition[] {
    if (room.memory.extPos === undefined || room.memory.extRoads === undefined) {
        let posInfo = getRoomExtensionPositions(basePos);
        room.memory.extPos = JSON.stringify(posInfo.ext);
        room.memory.extRoads = JSON.stringify(posInfo.roads);
    }
    let positionInfo = JSON.parse(room.memory.extRoads) as string[];
    let positions: RoomPosition[] = [];
    for (let p of positionInfo) {
        positions.push(longPosRoom(p));
    }
    return positions;
}

export function getRoomExtensionPositions(basePos: RoomPosition): {ext: string[], roads: string[]} {
    let roadPositions: string[] = [];
    let extPositions: string[] = [];

    addMainWings(basePos, extPositions, roadPositions)

    extPositions = _.uniq(extPositions);
    for (let r of roadPositions) {
        _.pull(extPositions, r);
    }

    if (extPositions.length < 60) {
        addLowerWings(basePos, extPositions, roadPositions);
    }

    extPositions = _.uniq(extPositions);
    for (let r of roadPositions) {
        _.pull(extPositions, r);
    }

    removeExtensionToVitalTargets(basePos, extPositions);

    if (extPositions.length > 60) {
        extPositions = extPositions.slice(0, 60);
    } else
    if (extPositions.length < 60) {
        addSingleExtensions(basePos, extPositions);
    }
    return {ext: extPositions, roads: roadPositions};
}

function addSingleExtensions(basePos: RoomPosition, extPositions: string[]) {
    let cm = new PathFinder.CostMatrix;

    for (let x of _.range(0, 50)) {
        for (let y of _.range(0, 50)) {
            let terrain = Game.map.getTerrainAt(x, y, basePos.roomName);
            if (terrain === "wall") {
                cm.set(x, y, 1);
            } else
            if (x < 3 || x > 46 || y < 3 || y > 46) {
                cm.set(x, y, 1)
            }
        }
    }
    for (let x of _.range(-3, 4)) {
        for (let y of _.range(-1, 6)) {
            cm.set(basePos.x + x, basePos.y + y, 1);
        }
    }
    for (let x of _.range(-2, 3)) {
        cm.set(basePos.x + x, basePos.y + 6, 1);
    }
    for (let x of _.range(-1, 2)) {
        cm.set(basePos.x + x, basePos.y + 7, 1);
    }

    for(let p of extPositions) {
        let t = p.split("-");
        cm.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 1);
    }

    let room = Game.rooms[basePos.roomName];
    if (room !== undefined) {
        if (room.controller !== undefined) {
            let controllerPos = room.controller.getContainerPosition();
            if (controllerPos !== undefined) {
                cm.set(controllerPos.x, controllerPos.y, 1);
            }
        }
        let sources = room.getSources();
        if (sources.length > 0) {
            for (let s of sources) {
                let scontpos = s.getContainerPosition();
                if (scontpos !== undefined) {
                    cm.set(scontpos.x, scontpos.y, 1);
                }
            }
        }
    }

    let possiblePositions: RoomPosition[] = [];

    for (let x of _.range(3, 47)) {
        for (let y of _.range(3, 47)) {
            if (cm.get(x,y) === 0 && x % 2 === y % 2 && posOnlyHasOneNeighbour(x, y, cm)) {
                if (!_.contains(extPositions, shortPosRoomMaker(x,y, basePos.roomName))) {
                    let p = new RoomPosition(x, y, basePos.roomName);
                    if (getRangeToClosestVital(p) > 2) {
                        possiblePositions.push(p);
                    }
                }
            }
        }
    }
    if (IntelLib.hasIntel(basePos.roomName)) {
        let extcm = new PathFinder.CostMatrix();

        for(let p of extPositions) {
            let t = p.split("-");
            extcm.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 0xFF);
        }

        let counter = 50;
        while (extPositions.length < 60 && counter > 0 && possiblePositions.length > 0) {
            let bestPos = basePos.findClosestByRange(possiblePositions);
            let pathDistance = PathFinder.search(basePos, {pos: bestPos, range: 1}, {plainCost: 1, swampCost: 1, maxRooms: 1, roomCallback: function (r: string) {
                if (Game.rooms[r] === undefined) {
                    return extcm;
                }
                return extcm;
            }}).path.length - 1;
            let range = basePos.getRangeTo(bestPos);
            if (pathDistance <= range * 1.5) {
                extPositions.push(shortPosRoom(bestPos));
            }
            _.pull(possiblePositions, bestPos);
            counter--;
        }
    }
}

function getRangeToClosestVital(p: RoomPosition): number {
    let vitalTargets: RoomPosition[] = [];

    if (!IntelLib.hasIntel(p.roomName)) {
        return 25;
    }
    for (let sId of IntelLib.sourceIds(p.roomName)) {
        vitalTargets.push(IntelLib.sourcePos(p.roomName, sId));
    }

    let mPos = IntelLib.mineralPos(p.roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    let cPos = IntelLib.controllerPos(p.roomName);
    if (cPos !== null) {
        vitalTargets.push(cPos);
    }

    let range = 10;
    for (let t of vitalTargets) {
        let r = p.getRangeTo(t)
        if (r < range) {
            range = r;
        }
    }
    return range;
}

function posOnlyHasOneNeighbour(x: number, y: number, cm: CostMatrix): boolean {
    if (cm.get(x - 1, y) === 1 && cm.get(x + 1, y) === 1) {
        return false;
    }
    if (cm.get(x, y - 1) === 1 && cm.get(x, y + 1) === 1) {
        return false;
    }
    return true;
}

function removeExtensionToVitalTargets(basePos: RoomPosition, extPositions: string[]) {
    let roomName = basePos.roomName;
    if (!IntelLib.hasIntel(roomName)) {
        return;
    }
    let vitalTargets: RoomPosition[] = [];

    for (let sId of IntelLib.sourceIds(roomName)) {
        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
    }

    let cPos = IntelLib.controllerPos(roomName);
    if (cPos !== null) {
        vitalTargets.push(cPos);
    }

    let mPos = IntelLib.mineralPos(roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    // TODO: Add exits

    let cm = getExtensionRoomCallback(extPositions);
    for (let vital of vitalTargets) {
        let ret = PathFinder.search(basePos, {pos: vital, range: 1}, {
            plainCost: 1,
            swampCost: 1,
            roomCallback: () => cm,
            maxRooms: 1,
        } );
        if (ret.cost > 200) {
            for (let p of ret.path) {
                _.pull(extPositions, shortPosRoom(p));
            }
        }
    }
}

function getExtensionRoomCallback(extPositions: string[]): CostMatrix {
    let costs = new PathFinder.CostMatrix;

    for(let p of extPositions) {
        let t = p.split("-");
        costs.set(Number.parseInt(t[0]), Number.parseInt(t[1]), 0xfe);
    }
    return costs;
}

function addLowerWings(basePos: RoomPosition, extPositions: string[], roadPositions: string[]) {
    for (let s of [-1, 1]) {
        roadPositions.push(shortPosRoomMaker(basePos.x + (s*3), basePos.y + 1, basePos.roomName));
        roadPositions.push(shortPosRoomMaker(basePos.x + (s*4), basePos.y + 2, basePos.roomName));
        for (let i of [5, 6]) {
            let testPos = new RoomPosition(basePos.x + (s*i), basePos.y - 2 + i, basePos.roomName);
            if (buildableAroundPos(testPos) && getRangeToClosestVital(testPos) > 3) {
                roadPositions.push(shortPosRoom(testPos));
                addPositionsAround(testPos, extPositions);
            } else {
                break;
            }
        }

        let t1 = Game.map.getTerrainAt(basePos.x + (s*4), basePos.y + 1, basePos.roomName);
        if (t1 === "swamp" || t1 === "plain") {
            if (!(basePos.x + (s*4) < 3 || basePos.x + (s*4) > 46 || basePos.y + 1 < 3 || basePos.y + 1 > 46)) {
                extPositions.push(shortPosRoomMaker(basePos.x + (s*4), basePos.y + 1, basePos.roomName));
            }
        }

        let t2 = Game.map.getTerrainAt(basePos.x + (s*5), basePos.y + 1, basePos.roomName);
        if (t2 === "swamp" || t2 === "plain") {
            if (!(basePos.x + (s*5) < 3 || basePos.x + (s*5) > 46 || basePos.y + 1 < 3 || basePos.y + 1 > 46)) {
                extPositions.push(shortPosRoomMaker(basePos.x + (s*5), basePos.y + 1, basePos.roomName));
            }
        }
    }
}

function addMainWings(basePos: RoomPosition, extPositions: string[], roadPositions: string[]) {
    roadPositions.push(shortPosRoomMaker(basePos.x, basePos.y - 1, basePos.roomName));
    for (let s of [-1, 1]) {
        roadPositions.push(shortPosRoomMaker(basePos.x + (s*1), basePos.y - 2, basePos.roomName));
        for (let i of [2, 3, 4]) {
            let testPos = new RoomPosition(basePos.x + (s*i), basePos.y - 1 - i, basePos.roomName);
            if (buildableAroundPos(testPos) && getRangeToClosestVital(testPos) > 3) {
                roadPositions.push(shortPosRoom(testPos));
                addPositionsAround(testPos, extPositions);
            } else {
                break;
            }
            if (i === 4) {
                for (let s2 of [-1, 1]) {
                    for (let j of [1, 2]) {
                        let newTestPos = new RoomPosition(testPos.x + (s*s2*j), testPos.y + (s2*j), testPos.roomName);
                        if (buildableAroundPos(newTestPos) && getRangeToClosestVital(testPos) > 3) {
                            roadPositions.push(shortPosRoom(newTestPos));
                            addPositionsAround(newTestPos, extPositions);
                        } else {
                            break;
                        }
                    }
                }
            }
        }

        let t = Game.map.getTerrainAt(basePos.x + (s*3), basePos.y - 1, basePos.roomName);
        if (t === "swamp" || t === "plain") {
            extPositions.push(shortPosRoomMaker(basePos.x + (s*3), basePos.y - 1, basePos.roomName));
        }
    }
}

function buildableAroundPos(pos: RoomPosition): boolean {
    let count = 0;
    for (let x of [-1, 0, 1]) {
        for (let y of [-1, 0, 1]) {
            if (pos.x + x < 3 || pos.x + x > 46 || pos.y + y < 3 || pos.y + y > 46) {
                return false;
            }
            let terrain = Game.map.getTerrainAt(pos.x + x, pos.y + y, pos.roomName);
            if (terrain !== "swamp" && terrain !== "plain") {
                if (x === 0 && y === 0) {
                    return false;
                } else
                if (count > 2) {
                    return false;
                }
                count++;
            }
        }
    }
    return true;
}

function addPositionsAround(pos: RoomPosition, list: string[]): void {
    for (let x of [-1, 0, 1]) {
        for (let y of [-1, 0, 1]) {
            if (x !== 0 || y !== 0) {
                let terrain = Game.map.getTerrainAt(pos.x + x, pos.y + y, pos.roomName);
                if (terrain === "swamp" || terrain === "plain") {
                    list.push(shortPosRoomMaker(pos.x + x, pos.y + y, pos.roomName));
                }
            }
        }
    }
}

function shortPosRoomMaker(x: number, y: number, roomName: string) {
    return x + "-" + y + "-" + roomName;
}

function shortPosRoom(pos: RoomPosition) {
    return pos.x + "-" + pos.y + "-" + pos.roomName;
}

function longPosRoom(pos: string): RoomPosition {
    let split = pos.split("-");
    return new RoomPosition(+split[0], +split[1], split[2]);
}
