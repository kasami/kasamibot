"use strict";
const loglevel_1 = require("./enums.loglevel");
class Logger {
    setLogLevel(newLevel) {
        Memory.settings.loggingLevel = newLevel;
    }
    _log(message, room, logLevel, color = '#ffffff') {
        if (logLevel <= Memory.settings.loggingLevel) {
            console.log("<span style='color:" + color + "'><a href='#!/room/" + Game.shard.name + "/" + room + "'>" + room +
                "</a> " + message + "</span>");
        }
    }
    debug(message, room) {
        this._log(message, room, loglevel_1.LogLevel.DEBUG, '#6e6770');
    }
    info(message, room) {
        this._log(message, room, loglevel_1.LogLevel.INFO);
    }
    warning(message, room) {
        this._log(message, room, loglevel_1.LogLevel.WARN, '#f4c542');
    }
    error(message, room) {
        this._log(message, room, loglevel_1.LogLevel.ERROR, '#e50000');
    }
    alert(message, room) {
        this._log(message, room, loglevel_1.LogLevel.ALERT, '#ff00d0');
    }
}
exports.Logger = Logger;
exports.log = new Logger();
