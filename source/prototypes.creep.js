"use strict";
const Traveler_1 = require("./utilities.Traveler");
Creep.prototype.hasState = function () {
    return this.memory.state !== undefined;
};
Creep.prototype.getState = function () {
    return this.memory.state;
};
Creep.prototype.setState = function (state) {
    this.memory.state = state;
};
Creep.prototype.getHomeroom = function () {
    return this.memory.homeroom;
};
Creep.prototype.isInHomeroom = function () {
    return this.memory.homeroom === this.room.name;
};
Creep.prototype.isPrioritized = function () {
    return this.memory.prioritized === true;
};
Creep.prototype.setPrioritized = function () {
    this.memory.prioritized = true;
};
Creep.prototype.setNotPrioritized = function () {
    this.memory.prioritized = false;
};
Creep.prototype.travelTo = function (destination, options, enemyCheck) {
    if (options) {
        if (options.allowHostile !== false) {
            options.allowHostile = true;
        }
        if (options.maxOps === undefined) {
            options.maxOps = 10000;
        }
    }
    else {
        options = { allowHostile: true, maxOps: 10000 };
    }
    return Traveler_1.traveler.travelTo(this, destination, options, enemyCheck);
};
Creep.prototype.travelToRoom = function (roomName, options, enemyCheck) {
    if (options) {
        options.range = 20;
    }
    else {
        options = { range: 20 };
    }
    return this.travelTo({ pos: new RoomPosition(25, 25, roomName) }, options, enemyCheck);
};
Creep.prototype.missingHits = function () {
    return this.hitsMax - this.hits;
};
Creep.prototype.isHurt = function () {
    return this.hits < this.hitsMax;
};
Creep.prototype.isRenewing = function () {
    return this.memory.renewing === true;
};
Creep.prototype.startRenewing = function () {
    this.memory.renewing = true;
};
Creep.prototype.stopRenewing = function () {
    this.memory.renewing = false;
};
Creep.prototype.isEmpty = function () {
    return this.carry.energy === 0;
};
Creep.prototype.isFull = function () {
    return _.sum(this.carry) === this.carryCapacity;
};
Creep.prototype.isDumping = function () {
    return this.memory.dumping === true;
};
Creep.prototype.isFinishedDumping = function () {
    return this.isDumping() && this.isEmpty();
};
Creep.prototype.isFinishedMining = function () {
    return !this.isDumping() && this.isFull();
};
Creep.prototype.startDumping = function () {
    this.memory.dumping = true;
};
Creep.prototype.stopDumping = function () {
    this.memory.dumping = false;
};
Creep.prototype.isTanking = function () {
    return this.memory.tanking === true;
};
Creep.prototype.isFinishedTanking = function () {
    return this.isTanking() && this.isFull();
};
Creep.prototype.isInNeedOfTanking = function () {
    return !this.isTanking() && this.isEmpty();
};
Creep.prototype.startTanking = function () {
    this.memory.tanking = true;
};
Creep.prototype.stopTanking = function () {
    this.memory.tanking = false;
};
Creep.prototype.getWorkerParts = function () {
    return this.getActiveBodyparts(WORK);
};
Creep.prototype.isDisabled = function () {
    return this.memory.disabled;
};
Creep.prototype.disable = function () {
    this.memory.disabled = true;
};
Creep.prototype.enable = function () {
    this.memory.disabled = undefined;
};
Creep.prototype.isAtBorder = function () {
    return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
};
