"use strict";
(function (Priority) {
    Priority[Priority["Blocker"] = 0] = "Blocker";
    Priority[Priority["Critical"] = 1] = "Critical";
    Priority[Priority["Important"] = 2] = "Important";
    Priority[Priority["Standard"] = 3] = "Standard";
    Priority[Priority["Low"] = 4] = "Low";
    Priority[Priority["Trivial"] = 5] = "Trivial";
    Priority[Priority["Overflow"] = 6] = "Overflow";
})(exports.Priority || (exports.Priority = {}));
var Priority = exports.Priority;
