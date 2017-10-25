interface Room {
    getHostileCreeps(): Creep[];
    getHostileCreepsNotAtBorder(): Creep[];
    hasHostileCreeps(): boolean;
    getSpawns(): StructureSpawn[];
    getSpawn(): StructureSpawn | undefined;
    getSources(): Source[];
    getFreeSpawn(): StructureSpawn | undefined;
    getMineral(): Mineral | undefined;
    getBaseContainer(): StructureContainer | undefined;
    getBaseLink(): StructureLink | undefined;
    getBoostLab(): StructureLab | undefined;
    getPowerSpawn(): StructurePowerSpawn | undefined;
    getNuker(): StructureNuker | undefined;
    hasFreeSpawnCapacity(): boolean;
    hasLabArea(): boolean;
    getProcessingLabs(): StructureLab[];
    getSupplyingLabs(): StructureLab[];
    getObserver(): StructureObserver | undefined;

    isExpansion(): boolean;
    hasExpansion(): boolean;

    isAbandoned(): boolean;

    isUnderSiege(): boolean;
}
