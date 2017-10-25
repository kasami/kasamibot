
import * as PositionLib from "../lib/position";

import * as _Common from "../rolelib/common";

enum State {
    TankUp = 0,
    MovingToRoom = 1,
    Pacman = 2,
    Ayce = 3,
    Upgrading = 4
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUp);
    }

    switch(creep.getState()) {
        case State.TankUp:
            runTankUp(creep);
            break;
        case State.MovingToRoom:
            runMovingToRoom(creep);
            break;
        case State.Upgrading:
            runUpgrading(creep);
            break;
        case State.Pacman:
            runPacman(creep);
            break;
        case State.Ayce:
            runAyce(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.TankUp);
            break;
    }
};

function runTankUp(creep: Creep) {
    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
    creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);

        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        } else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    } else {
        creep.setState(State.MovingToRoom);
        runMovingToRoom(creep);
    }
}

function runMovingToRoom(creep: Creep) {
    let praiseroom: string = creep.memory.target;

    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(praiseroom);
    } else {
        creep.setState(State.Upgrading)
        runUpgrading(creep);
    }
}


function runUpgrading(creep: Creep) {
    let praiseroom = Game.rooms[creep.memory.target];

    if (praiseroom !== undefined && praiseroom.controller !== undefined &&
    praiseroom.controller.my && praiseroom.controller.level < 2) {
        if (creep.upgradeController(praiseroom.controller) === ERR_NOT_IN_RANGE) {
            creep.travelTo(praiseroom.controller);
        }
    } else {
        creep.setState(State.Pacman)
        runPacman(creep);
    }
}

function runPacman(creep: Creep) {
    if (Game.flags["Pacman"] instanceof Flag) {
        let flag = Game.flags["Pacman"].pos as RoomPosition;
        if (creep.memory.pacmanIndex === undefined) {
            creep.memory.pacmanIndex = 0;
        }

        let positions = getPacmanPositions();

        if (creep.memory.pacmanIndex + 1 > positions.length) {
            if (Game.flags["Pacman"] instanceof Flag) {
                (Game.flags["Pacman"] as Flag).remove();
            }
            creep.setState(State.Ayce)
            runAyce(creep);
            return;
        }

        makeFancyArt(creep, positions, flag, creep.memory.pacmanIndex)
    } else {
        creep.setState(State.Ayce)
        runAyce(creep);
    }
}

function runAyce(creep: Creep) {
    if (Game.flags["Ayce"] instanceof Flag) {
        let flag = Game.flags["Ayce"].pos as RoomPosition;
        if (creep.memory.ayceIndex === undefined) {
            creep.memory.ayceIndex = 0;
        }

        let positions = getAycePositions();

        if (creep.memory.ayceIndex + 1 > positions.length) {
            if (Game.flags["Ayce"] instanceof Flag) {
                (Game.flags["Ayce"] as Flag).remove();
            }

            if (creep.room.controller !== undefined && creep.room.controller.my && creep.room.controller.level === 2) {
                creep.room.controller.unclaim();
            }
            creep.suicide();
            return;
        }

        makeFancyArt(creep, positions, flag, creep.memory.ayceIndex)
    } else {
        if (creep.room.controller !== undefined && creep.room.controller.my && creep.room.controller.level === 2) {
            creep.room.controller.unclaim();
        }
        creep.suicide();
        return;
    }
}

function makeFancyArt(creep: Creep, positions: [[number, number]], flag: RoomPosition, index: number) {

        let current = positions[index];
        let position = new RoomPosition(flag.x + current[1], flag.y + current[0], flag.roomName);
        let atPos = position.look();
        for (let x of atPos) {
            if (x.constructionSite !== undefined) {
                let range = creep.pos.getRangeTo(x.constructionSite);
                if (range === 0) {
                    _Common.moveRandomDirection(creep);
                } else
                if (range > 3) {
                    creep.moveTo(x.constructionSite);
                } else {
                    creep.build(x.constructionSite);
                }
                return;
            } else
            if (x.structure !== undefined && x.structure.hits === 1) {
                let range = creep.pos.getRangeTo(x.structure);
                if (range > 3) {
                    creep.moveTo(x.structure);
                } else {
                    creep.repair(x.structure);
                }
                return;
            } else
            if (x.structure !== undefined) {
                if (creep.getState() === State.Pacman) {
                    creep.memory.pacmanIndex++;
                } else
                if (creep.getState() === State.Ayce) {
                    creep.memory.ayceIndex++;
                }
                return;
            }
            let res = position.createConstructionSite(STRUCTURE_WALL);
            if (res !== OK) {
                console.log(creep.room.name +": Tagger got error when building construction site: " + res);
            } else {
                if (creep.pos.getRangeTo(position) > 3) {
                    creep.moveTo(position);
                }
            }
        }
}


function getPacmanPositions(): [[number, number]] {
    return [
        [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
        [1, 11], [1, 12],
        [2, 13],
        [3, 14],
        [4, 15],
        [5, 14], [5, 13],
        [6, 12], [6, 11],
        [7, 10], [7, 9],
        [8, 8],
        [9, 10], [9, 9],
        [10, 11], [10, 12],
        [11, 13], [11, 14],
        [8, 14], [9, 14], [9, 15], [9, 16], [8, 16],
        [8, 18], [9, 18], [9, 19], [9, 20], [8, 20],
        [7, 20], [7, 19], [7, 18], [7, 16], [7, 15], [7, 14],
        [12, 15],
        [13, 14],
        [14, 13],
        [15, 12],
        [15, 11],
        [16, 10], [16, 9], [16, 8], [16, 7], [16, 6],
        [15, 5],[15, 4],
        [14, 3],
        [13, 2],
        [12, 1],
        [11, 1],
        [10, 0],
        [9, 0],
        [8, 0],
        [7, 0],
        [6, 0],
        [5, 1],
        [4, 1],
        [3, 2],
        [2, 3],
        [1, 4], [1, 5],
    ];
}

function getAycePositions(): [[number, number]] {
    return [
        [0, 1], [0, 2], [0, 5], [0, 9], [0, 12], [0, 13], [0, 17], [0, 18], [0, 19],
        [1, 0], [1, 3], [1, 6], [1, 8], [1, 0], [1, 11], [1, 14], [1, 16],
        [2, 0], [2, 3], [2, 7], [2, 11], [2, 16], [2, 17], [2, 18],
        [3, 0], [3, 1], [3, 2], [3, 3], [3, 7], [3, 11], [3, 14], [3, 16],
        [4, 0], [4, 3], [4, 7], [4, 12], [4, 13], [4, 17], [4, 18], [4, 19]
    ]
}
