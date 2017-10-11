"use strict";
const _Manager_1 = require("./managers._Manager");
class InterfaceManager extends _Manager_1.Manager {
    constructor() {
        super("InterfaceManager");
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            if (Game.flags["Layout"] instanceof Flag) {
                let pos = Game.flags.Layout.pos;
                new RoomVisual(pos.roomName).rect(pos.x - 4.5, pos.y - 3.5, 9, 10);
                new RoomVisual(pos.roomName).rect(pos.x - 0.5, pos.y + 6.5, 3, 1);
            }
            if (Game.flags["Base"] instanceof Flag) {
                let pos = Game.flags["Base"].pos;
                new RoomVisual(pos.roomName).rect(pos.x - 3.5, pos.y - 1.5, 7, 5);
                new RoomVisual(pos.roomName).rect(pos.x - 5.5, pos.y - 6.5, 11, 5);
                new RoomVisual(pos.roomName).rect(pos.x - 2.5, pos.y + 3.5, 5, 4);
                new RoomVisual(pos.roomName).rect(pos.x - 6.5, pos.y - 0.5, 3, 5);
                new RoomVisual(pos.roomName).rect(pos.x + 3.5, pos.y - 0.5, 3, 5);
            }
            if (Game.flags["Pacman"] instanceof Flag) {
                let pos = Game.flags["Pacman"].pos;
                let pacmanpoints = [];
                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 4.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 4.5, pos.y - 0.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 11.5, pos.y - 0.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 15.5, pos.y + 3.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 20.5, pos.y + 6.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 20.5, pos.y + 9.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 15.5, pos.y + 12.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 11.5, pos.y + 16.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x + 4.5, pos.y + 16.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 11.5, pos.roomName));
                pacmanpoints.push(new RoomPosition(pos.x - 0.5, pos.y + 4.5, pos.roomName));
                new RoomVisual(pos.roomName).poly(pacmanpoints);
            }
            if (Game.flags["Ayce"] instanceof Flag) {
                let pos = Game.flags["Ayce"].pos;
                new RoomVisual(pos.roomName).rect(pos.x - 0.5, pos.y - 0.5, 20, 5);
            }
        }
    }
}
exports.InterfaceManager = InterfaceManager;
