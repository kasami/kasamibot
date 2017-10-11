"use strict";
(function (Labstatus) {
    Labstatus[Labstatus["Inactive"] = 0] = "Inactive";
    Labstatus[Labstatus["GettingMineralsToTerminal"] = 1] = "GettingMineralsToTerminal";
    Labstatus[Labstatus["MovingMineralsToLab"] = 2] = "MovingMineralsToLab";
    Labstatus[Labstatus["RunningReactions"] = 3] = "RunningReactions";
    Labstatus[Labstatus["EmptyingLabs"] = 4] = "EmptyingLabs";
    Labstatus[Labstatus["EmptyingAllLabs"] = 5] = "EmptyingAllLabs";
})(exports.Labstatus || (exports.Labstatus = {}));
var Labstatus = exports.Labstatus;
