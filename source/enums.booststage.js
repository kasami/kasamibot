"use strict";
(function (BoostStage) {
    BoostStage[BoostStage["ClearLab"] = 0] = "ClearLab";
    BoostStage[BoostStage["BuyMinerals"] = 1] = "BuyMinerals";
    BoostStage[BoostStage["LoadHauler"] = 2] = "LoadHauler";
    BoostStage[BoostStage["UnloadHauler"] = 3] = "UnloadHauler";
    BoostStage[BoostStage["BoostCreep"] = 4] = "BoostCreep";
    BoostStage[BoostStage["ValidateBoost"] = 5] = "ValidateBoost";
})(exports.BoostStage || (exports.BoostStage = {}));
var BoostStage = exports.BoostStage;
