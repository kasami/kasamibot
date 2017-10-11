"use strict";
(function (Hostility) {
    Hostility[Hostility["None"] = 0] = "None";
    Hostility[Hostility["HarmlessHostiles"] = 1] = "HarmlessHostiles";
    Hostility[Hostility["Invaders"] = 2] = "Invaders";
    Hostility[Hostility["Hostiles"] = 3] = "Hostiles";
    Hostility[Hostility["Reserved"] = 4] = "Reserved";
    Hostility[Hostility["Controlled"] = 5] = "Controlled";
})(exports.Hostility || (exports.Hostility = {}));
var Hostility = exports.Hostility;
