/**
 * Extends the creep prototype
 */

import {traveler} from "../utilities/Traveler";

Creep.prototype.hasState = function() {
    return this.memory.state !== undefined;
}

Creep.prototype.getState = function() {
    return this.memory.state;
}

Creep.prototype.setState = function(state: number) {
    this.memory.state = state;
}

Creep.prototype.getHomeroom = function (): string {
    return this.memory.homeroom;
}

Creep.prototype.isInHomeroom = function (): boolean {
    return this.memory.homeroom === this.room.name;
}

Creep.prototype.isPrioritized = function (): boolean {
    return this.memory.prioritized === true;
}

Creep.prototype.setPrioritized = function (): void {
    this.memory.prioritized = true;
}

Creep.prototype.setNotPrioritized = function (): void {
    this.memory.prioritized = false;
}

Creep.prototype.travelTo = function(destination: {pos: RoomPosition}, options?: any, enemyCheck?: boolean) {
    if (options) {
        if (options.allowHostile !== false) {
            options.allowHostile = true;
        }
        if (options.maxOps === undefined) {
            options.maxOps = 10000;
        }
    } else {
        options = {allowHostile: true, maxOps: 10000}
    }
    return traveler.travelTo(this, destination, options, enemyCheck);
};

Creep.prototype.travelToRoom = function(roomName: string, options?: any, enemyCheck?: boolean) {
    if (options) {
        options.range = 20;
    } else {
        options = {range: 20}
    }
    return this.travelTo({pos: new RoomPosition(25, 25, roomName)}, options, enemyCheck);
};

Creep.prototype.missingHits = function(): number {
  return this.hitsMax - this.hits;
};


Creep.prototype.isHurt = function(): boolean {
  return this.hits < this.hitsMax;
};

Creep.prototype.isRenewing = function(): boolean {
  return this.memory.renewing === true;
};

Creep.prototype.startRenewing = function(): void {
  this.memory.renewing = true;
};

Creep.prototype.stopRenewing = function(): void {
  this.memory.renewing = false;
};

Creep.prototype.isEmpty = function(): boolean {
  return this.carry.energy === 0;
};

Creep.prototype.isFull = function(): boolean {
  return _.sum(this.carry) === this.carryCapacity;
};

Creep.prototype.isDumping = function(): boolean {
  return this.memory.dumping === true;
};

Creep.prototype.isFinishedDumping = function(): boolean {
  return this.isDumping() && this.isEmpty();
};

Creep.prototype.isFinishedMining = function(): boolean {
  return !this.isDumping() && this.isFull();
};

Creep.prototype.startDumping = function(): void {
  this.memory.dumping = true;
};

Creep.prototype.stopDumping = function(): void {
  this.memory.dumping = false;
};

Creep.prototype.isTanking = function(): boolean {
  return this.memory.tanking === true;
};

Creep.prototype.isFinishedTanking = function(): boolean {
  return this.isTanking() && this.isFull();
};

Creep.prototype.isInNeedOfTanking = function(): boolean {
  return !this.isTanking() && this.isEmpty();
};

Creep.prototype.startTanking = function(): void {
  this.memory.tanking = true;
};

Creep.prototype.stopTanking = function(): void {
  this.memory.tanking = false;
};

Creep.prototype.getWorkerParts = function(): number {
  return this.getActiveBodyparts(WORK);
}

Creep.prototype.isDisabled = function(): boolean {
  return this.memory.disabled;
};

Creep.prototype.disable = function(): void {
  this.memory.disabled = true;
};

Creep.prototype.enable = function(): void {
  this.memory.disabled = undefined;
};

Creep.prototype.isAtBorder = function(): boolean {
  return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
}
