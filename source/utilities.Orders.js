"use strict";
const role_1 = require("./enums.role");
function makeRoleName(role) {
    return role_1.Role[role];
}
exports.makeRoleName = makeRoleName;
function makeRandomCreepId() {
    var text = "";
    var possibleHighcase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var possibleLowcase = "abcdefghijklmnopqrstuvwxyz";
    text += possibleHighcase.charAt(Math.floor(Math.random() * possibleHighcase.length));
    for (var i = 1; i < 3; i++)
        text += possibleLowcase.charAt(Math.floor(Math.random() * possibleLowcase.length));
    return text;
}
exports.makeRandomCreepId = makeRandomCreepId;
