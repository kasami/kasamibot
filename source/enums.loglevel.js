"use strict";
(function (LogLevel) {
    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["INFO"] = 4] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 5] = "DEBUG";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
