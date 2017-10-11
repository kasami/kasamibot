"use strict";
(function (ManagerPriority) {
    ManagerPriority[ManagerPriority["Critical"] = 1] = "Critical";
    ManagerPriority[ManagerPriority["Standard"] = 2] = "Standard";
    ManagerPriority[ManagerPriority["Low"] = 3] = "Low";
    ManagerPriority[ManagerPriority["Trivial"] = 4] = "Trivial";
    ManagerPriority[ManagerPriority["Overflow"] = 5] = "Overflow";
    ManagerPriority[ManagerPriority["None"] = 6] = "None";
})(exports.ManagerPriority || (exports.ManagerPriority = {}));
var ManagerPriority = exports.ManagerPriority;
class Manager {
    constructor(name) {
        this.name = name;
        this.memoryCheck();
    }
    memoryCheck() {
        if (Memory.manager === undefined) {
            Memory.manager = {};
        }
        if (Memory.manager[this.name] === undefined) {
            Memory.manager[this.name] = {};
        }
    }
    getValue(name) {
        return Memory.manager[this.name][name];
    }
    setValue(name, value) {
        Memory.manager[this.name][name] = value;
    }
}
exports.Manager = Manager;
