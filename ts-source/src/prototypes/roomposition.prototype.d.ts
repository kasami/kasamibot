interface RoomPosition {
    getClosestSpawn(): Spawn;
    hasFreeSpaceAround(): boolean;
    getFreeSpaceAround(): number;
    hasBuildingType(structureType: string): boolean;
    getPositionInDirection(direction: number): RoomPosition;
}
