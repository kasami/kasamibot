export function positionIsBorder(pos: RoomPosition): boolean {
    return pos.x < 1 || pos.x > 48 || pos.y < 1 || pos.y > 48;
}

export function positionIsBorderOrNextToBorder(pos: RoomPosition): boolean {
    return pos.x <= 1 || pos.x >= 48 || pos.y <= 1 || pos.y >= 48;
}

export function positionNextToBorder(pos: RoomPosition): boolean {
    return pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
}

export function positionHasBuildableGround(pos: RoomPosition): boolean {
    let posGround = Game.map.getTerrainAt(pos);
    if (posGround === "plain" || posGround === "swamp") {
        return true;
    }
    return false;
}

export function positionHasPortal(pos: RoomPosition): boolean {
    let structures = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    if (structures.length > 0) {
        for (let s of structures) {
            if (s.structureType === STRUCTURE_PORTAL) {
                return true;
            }
        }
    }
    return false;
}

export function positionAtDirection(origin: RoomPosition, direction: number): RoomPosition | undefined {
    let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
    let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
    let x = origin.x + offsetX[direction];
    let y = origin.y + offsetY[direction];
    if (x < 1 || x > 48 || y < 1 || y > 48) {
        return undefined;
    }
    return new RoomPosition(x, y, origin.roomName);
}
