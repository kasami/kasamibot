export enum RoomLevel {
    /**
     * Just basic distancemining and pioneers working on improving life
     * - Initial state of a room with a spawner
     */
    BasicColony = 0,

    /**
     * We have hit level 2 and ar ready for the first extensions
     * - Controller is level 2
     */
    BasicColonyReadyForExpansion = 1,

    /**
     * We have build a container and 5 extensions and is ready for higher tier workers
     * - Container and 5 extensions close to spawn
     * - Swamproads to sources and controller can be built
     * - Start using mining adjecent rooms.
     */
    SimpleColony = 2,

    /**
     * We have hit level 3 and are ready to build defences
     * - Controller is level 3
     */
    SimpleColonyReadyForExpansion = 3,

    /**
     * We have built basic defense
     * - Tower is built and supplied with energy
     * - Container and 10 extensions close to spawn (5 more)
     * - Roads to sources and controller can be built
     * - Start using containerminers and haulers
     */
    DefendedColony = 4,

    /**
     * We have hit level 4 and are ready for civilization
     * - Controller is level 4
     */
    DefendedColonyReadyForExpansion = 5,

    /**
     * We have made a storage with extensions around, ready to be transformed to a specialized city
     * - Storage built, old container removed
     * - 20 extensions built
     * - Basehauler for supplying extensions and spawn
     */
    CivilizedColony = 6,

    /**
     * We have hit level 5 and are ready for new buildings
     * - Controller is level 5
     */
    CivilizedColonyReadyForExpansion = 7,

    /**
     * We have built the new buildings and using link to feed the upgrader(s)
     * - 30 extensions built
     * - Link built by controller and in the city (not required)
     * - 2 towers built (not required)
     */
    AdvancedColony = 8,

    /**
     * We have hit level 6 and are ready for new buildings
     * - Controller is level 6
     */
    AdvancedColonyReadyForExpansion = 9,

    /**
     * We have built new buildings for level 6
     * - 40 extensions built
     * - Terminal built
     * - Can start using extractor and labs
     */
    Town = 10,

    /**
     * We have hit level 7 and are ready for new buildings
     * - Controller is level 7
     */
    TownReadyForExpansion = 11,

    /**
     * We have built new buildings for level 7
     * - 50 extensions built
     * - 2 spawns built
     * - 3 towers can be built (not required)
     * - Can start using links for local source-mining (2 sources)
     */
    City = 12,

    /**
     * We have hit level 8 and are ready for new buildings
     * - Controller is level 8
     */
    CityReadyForExpansion = 13,

    /**
     * We have built new buildings for level 8
     * - 60 extensions built
     * - 3 spawns built
     */
    Metropolis = 14
}
