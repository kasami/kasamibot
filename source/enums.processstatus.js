"use strict";
(function (ProcessStatus) {
    ProcessStatus[ProcessStatus["DEAD"] = 0] = "DEAD";
    ProcessStatus[ProcessStatus["ALIVE"] = 1] = "ALIVE";
    ProcessStatus[ProcessStatus["SLEEP"] = 2] = "SLEEP";
})(exports.ProcessStatus || (exports.ProcessStatus = {}));
var ProcessStatus = exports.ProcessStatus;
