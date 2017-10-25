interface Mineral {
    memoryCheck(): void;
    hasExtractor(): boolean;
    buildExtractor(): boolean;
    hasMiningContainer(): boolean;
    setMiningContainerId(id: string): void;
    getMiningContainer(): Container | null;
    getMiningContainerConstructionSite(): ConstructionSite | null;
    buildMiningContainer(): void;
    getMiningPositions(): RoomPosition[];
    getContainerPosition(): RoomPosition | undefined;
    getContainerMiningPositions(): RoomPosition[];

}
