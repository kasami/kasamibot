interface StructureController {
    getContainerPosition(): RoomPosition | undefined;
    getPossibleContainerPositions(): RoomPosition[];
    getOkeyContainerPosition(): RoomPosition | undefined;
    buildControllerContainer(): void;
    buildControllerLink(): void;
    hasContainer(): boolean;
    hasLink(): boolean;
    getContainerOrLink(): Link | Container | undefined;
    getContainer(): Container | undefined;
}
