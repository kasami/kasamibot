"use strict";
(function (PraiseStatus) {
    PraiseStatus[PraiseStatus["Inactive"] = 0] = "Inactive";
    PraiseStatus[PraiseStatus["Establishing"] = 1] = "Establishing";
    PraiseStatus[PraiseStatus["Praising"] = 2] = "Praising";
    PraiseStatus[PraiseStatus["PreparingReset"] = 3] = "PreparingReset";
    PraiseStatus[PraiseStatus["Reestablishing"] = 4] = "Reestablishing";
    PraiseStatus[PraiseStatus["PreparingHibernate"] = 5] = "PreparingHibernate";
    PraiseStatus[PraiseStatus["Hiberate"] = 6] = "Hiberate";
    PraiseStatus[PraiseStatus["Abandon"] = 7] = "Abandon";
})(exports.PraiseStatus || (exports.PraiseStatus = {}));
var PraiseStatus = exports.PraiseStatus;
