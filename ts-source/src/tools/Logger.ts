import {LogLevel} from "../enums/loglevel";

export class Logger {

    public setLogLevel(newLevel: LogLevel) {
        Memory.settings.loggingLevel = newLevel;
    }

    private _log(message: string, room: string, logLevel: LogLevel, color = '#ffffff') {
        if(logLevel <= Memory.settings.loggingLevel) {
            console.log("<span style='color:" + color + "'><a href='#!/room/" + Game.shard.name + "/" + room + "'>" + room +
                "</a> " + message + "</span>");
        }
    }

    public debug(message: string, room: string) {
        this._log(message, room, LogLevel.DEBUG, '#6e6770');
    }

    public info(message: string, room: string) {
        this._log(message, room, LogLevel.INFO);
    }

    public warning(message: string, room: string) {
        this._log(message, room, LogLevel.WARN, '#f4c542');
    }

    public error(message: string, room: string) {
        this._log(message, room, LogLevel.ERROR, '#e50000');
    }

    public alert(message: string, room: string) {
        this._log(message, room, LogLevel.ALERT, '#ff00d0');
    }
}

export const log = new Logger();
