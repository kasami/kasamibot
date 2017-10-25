interface Source {
    memoryCheck(): void;
    hasMiningContainer(): boolean;
    setMiningContainerId(id: string): void;
    getMiningContainer(): StructureContainer | null;
    getMiningContainerConstructionSite(): ConstructionSite | null;
    buildMiningContainer(): void;
    getMiningPositions(): RoomPosition[];
    getContainerPosition(): RoomPosition | undefined;
    getContainerMiningPositions(): RoomPosition[];
    getDistanceFrom(roomName: string): number | undefined;
    setDistanceFrom(roomName: string, distance: number): void;
}
