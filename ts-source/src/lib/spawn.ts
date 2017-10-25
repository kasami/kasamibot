import * as OperationSpawnmove from "../operations/Spawnmove";

import * as IntelLib from "../lib/intel";

import {OperationType} from "../enums/operationtypes";

export function createSpawnmoveOperation(room: Room, basePos: RoomPosition) {
    let op: OperationSpawnmove.Data = new OperationSpawnmove.Data();
    op.operationtype = OperationType.Spawnmove;
    op.roomName = room.name;
    op.victoryCondition = OperationSpawnmove.VictoryCondition.Spawnmoved;
    op.victoryValue = basePos;
    if (Memory.operations === undefined) {
        Memory.operations = [];
    }
    Memory.operations.push(op);
    console.log("Starting a operation to move the spawn in room " + room.name + ". It will start when we have a storage at RCL 4.");
    return true;
}

export function findSpawnLocation(roomName: string, firstRoom: boolean = false): {pos: RoomPosition, value: number} | undefined {
    let matrix = new PathFinder.CostMatrix;

    // Setting exits to 0
    for (let x of [0, 1, 2, 47, 48, 49]) {
        for (let y of _.range(0, 50)) {
            matrix.set(x, y, 1);
        }
    }
    for (let y of [0, 1, 2, 47, 48, 49]) {
        for (let x of _.range(3, 57)) {
            matrix.set(x, y, 1);
        }
    }

    // Setting walls to 0
    for (let x of _.range(3, 47)) {
        for (let y of _.range(3, 47)) {
            if (Game.map.getTerrainAt(x, y, roomName) === "wall") {
                matrix.set(x, y, 1);
            }
        }
    }

    let distance = 0;
    let found = true;
    let max = 1;
    while (distance < 25) {
        distance++;
        found = false;
        for (let x of _.range(1, 49)) {
            for (let y of _.range(1, 49)) {
                if (matrix.get(x, y) === distance) {
                    for (let x2 of [-1, 0, 1]) {
                        for (let y2 of [-1, 0, 1]) {
                            if (matrix.get(x + x2, y + y2) === 0) {
                                matrix.set(x + x2, y + y2, distance + 1)
                                max = distance + 1;
                                found = true;
                            }
                        }
                    }
                }
            }
        }
    }
    if (max < 5 && !firstRoom) {
        console.log("Did not find a spawnposition for room " + roomName);
        return undefined;
    }

    let perfect: RoomPosition[] = [];
    let okey: RoomPosition[] = [];
    let possible: RoomPosition[] = [];

    for (let x of _.range(7, 43)) {
        for (let y of _.range(7, 40)) {
            if (matrix.get(x, y) >= 5 &&
                matrix.get(x, y+3) >= 4)
            {
                let pos = new RoomPosition(x, y, roomName);
                if (matrix.get(x+4, y-7) >= 3 && matrix.get(x-4, y-7) >= 5)
                {
                    perfect.push(pos);
                } else
                if (matrix.get(x-2, y) >= 7)
                {
                    okey.push(pos);
                } else {
                    let distanceToWall = matrix.get(pos.x, pos.y);
                    if (distanceToWall > Math.max(4, max - 4)) {
                        possible.push(pos);
                    }
                }
            }
        }
    }

    if (firstRoom) {
        perfect = removeTrickyPositions(roomName, perfect);
        okey = removeTrickyPositions(roomName, okey);
        possible = removeTrickyPositions(roomName, possible);
    }

    perfect = filterDistanceToVitalPositions(roomName, perfect);

    if (perfect.length > 0) {
        if (perfect.length > 10) {
            perfect = _.sample(perfect, 10);
        }
        let chosen = findBestSpawnPosition(roomName, perfect);
        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
        console.log("Found perfect spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: 20};
    }

    okey = filterDistanceToVitalPositions(roomName, okey);

    if (okey.length > 0) {
        if (okey.length > 10) {
            okey = _.sample(okey, 10);
        }
        let chosen = findBestSpawnPosition(roomName, okey);
        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
        console.log("Found okey spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: 0};
    }

    possible = filterDistanceToVitalPositions(roomName, possible);

    if (possible.length > 0) {
        if (possible.length > 10) {
            possible = _.sample(possible, 10);
        }
        let chosen = findBestSpawnPosition(roomName, possible);
        let spawnpos = new RoomPosition(chosen.x, chosen.y - 2, chosen.roomName);
        console.log("Found possible spawnlocation for " + roomName + ": " + spawnpos);
        return {pos: spawnpos, value: -20};
    }

    if (firstRoom === true) {
        for (let x of _.range(1, 49)) {
            for (let y of _.range(1, 49)) {
                if (matrix.get(x, y) === max - 1) {
                    let spawnpos = new RoomPosition(x, y - 2, roomName);
                    return {pos: spawnpos, value: -100};
                }
            }
        }
    }

    console.log("Did not find a spawnposition for room " + roomName);
    return undefined;
}

function removeTrickyPositions(roomName: string, positions: RoomPosition[]): RoomPosition[] {
    let room = Game.rooms[roomName];
    if (room === undefined) {
        return positions;
    }
    let spawn = room.getSpawn();
    if (spawn === undefined) {
        return positions;
    }
    let allowed: RoomPosition[] = [];
    for (let p of positions) {
        if ((p.x !== spawn.pos.x || (p.y !== spawn.pos.y && p.y !== spawn.pos.y - 1)) &&
            (p.x !== spawn.pos.x - 2 || p.y !== spawn.pos.y + 1)) {
            allowed.push(p);
        } else {
            console.log("Filtered out tricky position from possible basepositions");
        }
    }
    return allowed;
}

function findBestSpawnPosition(roomName: string, positions: RoomPosition[]): RoomPosition {
    if (positions.length < 1) {
        console.log("ERROR: Trying to choose among zero spawnpositions in room " + roomName);
        return new RoomPosition(25, 25, roomName);
    }
    let chosen = positions[0];
    let distance = getTargetsDistance(roomName, chosen);
    for (let p of positions) {
        let d = getTargetsDistance(roomName, p)
        if (d < distance) {
            chosen = p;
            distance = d;
        }
    }
    return chosen;
}

function getTargetsDistance(roomName: string, basePos: RoomPosition): number {
    if (!IntelLib.hasIntel(roomName)) {
        return 100;
    }
    let distance = 0;

    for (let sId of IntelLib.sourceIds(roomName)) {
        distance += basePos.getRangeTo(IntelLib.sourcePos(roomName, sId));
    }

    let cPos = IntelLib.controllerPos(roomName);
    if (cPos !== null) {
        distance += basePos.getRangeTo(cPos);
    }
    return distance;
}

function filterDistanceToVitalPositions(roomName: string, positions: RoomPosition[]): RoomPosition[] {
    let filtered: RoomPosition[] = [];
    if (!IntelLib.hasIntel(roomName)) {
        return positions;
    }
    let vitalTargets: RoomPosition[] = [];

    for (let sId of IntelLib.sourceIds(roomName)) {
        vitalTargets.push(IntelLib.sourcePos(roomName, sId));
    }

    let mPos = IntelLib.mineralPos(roomName);
    if (mPos !== undefined) {
        vitalTargets.push(mPos);
    }

    for(let p of positions) {
        let validPosition = true;
        for (let v of vitalTargets) {
            if (p.getRangeTo(v) < 6) {
                validPosition = false;
            }
        }
        let cPos = IntelLib.controllerPos(roomName);
        if (cPos !== null) {
            if (p.getRangeTo(cPos) < 8) {
                validPosition = false;
            }
        }
        if (validPosition) {
            filtered.push(p);
        }
    }
    return filtered;
}
