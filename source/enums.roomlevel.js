"use strict";
(function (RoomLevel) {
    RoomLevel[RoomLevel["BasicColony"] = 0] = "BasicColony";
    RoomLevel[RoomLevel["BasicColonyReadyForExpansion"] = 1] = "BasicColonyReadyForExpansion";
    RoomLevel[RoomLevel["SimpleColony"] = 2] = "SimpleColony";
    RoomLevel[RoomLevel["SimpleColonyReadyForExpansion"] = 3] = "SimpleColonyReadyForExpansion";
    RoomLevel[RoomLevel["DefendedColony"] = 4] = "DefendedColony";
    RoomLevel[RoomLevel["DefendedColonyReadyForExpansion"] = 5] = "DefendedColonyReadyForExpansion";
    RoomLevel[RoomLevel["CivilizedColony"] = 6] = "CivilizedColony";
    RoomLevel[RoomLevel["CivilizedColonyReadyForExpansion"] = 7] = "CivilizedColonyReadyForExpansion";
    RoomLevel[RoomLevel["AdvancedColony"] = 8] = "AdvancedColony";
    RoomLevel[RoomLevel["AdvancedColonyReadyForExpansion"] = 9] = "AdvancedColonyReadyForExpansion";
    RoomLevel[RoomLevel["Town"] = 10] = "Town";
    RoomLevel[RoomLevel["TownReadyForExpansion"] = 11] = "TownReadyForExpansion";
    RoomLevel[RoomLevel["City"] = 12] = "City";
    RoomLevel[RoomLevel["CityReadyForExpansion"] = 13] = "CityReadyForExpansion";
    RoomLevel[RoomLevel["Metropolis"] = 14] = "Metropolis";
})(exports.RoomLevel || (exports.RoomLevel = {}));
var RoomLevel = exports.RoomLevel;
