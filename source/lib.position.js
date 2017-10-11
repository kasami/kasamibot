"use strict";
function positionIsBorder(pos) {
    return pos.x < 1 || pos.x > 48 || pos.y < 1 || pos.y > 48;
}
exports.positionIsBorder = positionIsBorder;
function positionIsBorderOrNextToBorder(pos) {
    return pos.x <= 1 || pos.x >= 48 || pos.y <= 1 || pos.y >= 48;
}
exports.positionIsBorderOrNextToBorder = positionIsBorderOrNextToBorder;
function positionNextToBorder(pos) {
    return pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
}
exports.positionNextToBorder = positionNextToBorder;
function positionHasBuildableGround(pos) {
    let posGround = Game.map.getTerrainAt(pos);
    if (posGround === "plain" || posGround === "swamp") {
        return true;
    }
    return false;
}
exports.positionHasBuildableGround = positionHasBuildableGround;
function positionHasPortal(pos) {
    let structures = pos.lookFor(LOOK_STRUCTURES);
    if (structures.length > 0) {
        for (let s of structures) {
            if (s.structureType === STRUCTURE_PORTAL) {
                return true;
            }
        }
    }
    return false;
}
exports.positionHasPortal = positionHasPortal;
function positionAtDirection(origin, direction) {
    let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
    let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
    let x = origin.x + offsetX[direction];
    let y = origin.y + offsetY[direction];
    if (x < 1 || x > 48 || y < 1 || y > 48) {
        return undefined;
    }
    return new RoomPosition(x, y, origin.roomName);
}
exports.positionAtDirection = positionAtDirection;
