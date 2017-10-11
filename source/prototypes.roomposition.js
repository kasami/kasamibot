RoomPosition.prototype.getClosestSpawn = function () {
    return this.findClosestByRange(FIND_MY_SPAWNS);
};
RoomPosition.prototype.hasFreeSpaceAround = function () {
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            let position = new RoomPosition(this.x + x, this.y + y, this.roomName);
            let terrainAtPositon = Game.map.getTerrainAt(position);
            if (terrainAtPositon !== "swamp" && terrainAtPositon !== "plain") {
                return false;
            }
        }
    }
    return true;
};
RoomPosition.prototype.getFreeSpaceAround = function () {
    let c = 0;
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            let position = new RoomPosition(this.x + x, this.y + y, this.roomName);
            let terrainAtPositon = Game.map.getTerrainAt(position);
            if (terrainAtPositon === "swamp" || terrainAtPositon === "plain") {
                c++;
            }
        }
    }
    return c;
};
RoomPosition.prototype.hasBuildingType = function (structureType) {
    let structuresAtPos = this.lookFor(LOOK_STRUCTURES);
    let constructionSitesAtPos = this.lookFor(LOOK_CONSTRUCTION_SITES);
    for (let s of structuresAtPos) {
        if (s.structureType === structureType) {
            return true;
        }
    }
    for (let c of constructionSitesAtPos) {
        if (c.structureType === structureType) {
            return true;
        }
    }
    return false;
};
RoomPosition.prototype.getPositionInDirection = function (direction) {
    switch (direction) {
        case TOP:
            return new RoomPosition(this.x, this.y - 1, this.roomName);
        case TOP_RIGHT:
            return new RoomPosition(this.x + 1, this.y - 1, this.roomName);
        case RIGHT:
            return new RoomPosition(this.x + 1, this.y, this.roomName);
        case BOTTOM_RIGHT:
            return new RoomPosition(this.x + 1, this.y + 1, this.roomName);
        case BOTTOM:
            return new RoomPosition(this.x, this.y + 1, this.roomName);
        case BOTTOM_LEFT:
            return new RoomPosition(this.x - 1, this.y + 1, this.roomName);
        case LEFT:
            return new RoomPosition(this.x - 1, this.y, this.roomName);
        case TOP_LEFT:
            return new RoomPosition(this.x - 1, this.y - 1, this.roomName);
        default:
            return new RoomPosition(this.x, this.y, this.roomName);
    }
};
