"use strict";
(function (OperationType) {
    OperationType[OperationType["Haul"] = 0] = "Haul";
    OperationType[OperationType["Drain"] = 1] = "Drain";
    OperationType[OperationType["Guard"] = 2] = "Guard";
    OperationType[OperationType["Spawnmove"] = 3] = "Spawnmove";
})(exports.OperationType || (exports.OperationType = {}));
var OperationType = exports.OperationType;
