"use strict";
const roomtype_1 = require("./enums.roomtype");
class RoomService {
    constructor() {
        this.roomDictionary = this.makeDictionary();
    }
    getAllOfType(role) {
        if (this.roomDictionary[role] !== undefined) {
            return this.roomDictionary[role];
        }
        return [];
    }
    getMyRooms() {
        if (this.roomDictionary[roomtype_1.Roomtype.My] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.My];
        }
        return [];
    }
    getNormalRooms() {
        if (this.roomDictionary[roomtype_1.Roomtype.Normal] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.Normal];
        }
        return [];
    }
    getNormalRoomsNotAbandoned() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalNotAbandoned] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalNotAbandoned];
        }
        return [];
    }
    getRoomsBeingAbandoned() {
        if (this.roomDictionary[roomtype_1.Roomtype.BeingAbandoned] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.BeingAbandoned];
        }
        return [];
    }
    getPraiseRooms() {
        if (this.roomDictionary[roomtype_1.Roomtype.Praiseroom] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.Praiseroom];
        }
        return [];
    }
    getNormalAndNotExpansion() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalAndNotExpansion] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalAndNotExpansion];
        }
        return [];
    }
    getNormalWithExpansion() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithExpansion] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalWithExpansion];
        }
        return [];
    }
    getNormalUnderSiege() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalUnderSiege] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalUnderSiege];
        }
        return [];
    }
    getNormalWithPraiseroom() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithPraiseroom] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalWithPraiseroom];
        }
        return [];
    }
    getNormalWithDismantleTarget() {
        if (this.roomDictionary[roomtype_1.Roomtype.NormalWithDismantleTarget] !== undefined) {
            return this.roomDictionary[roomtype_1.Roomtype.NormalWithDismantleTarget];
        }
        return [];
    }
    makeDictionary() {
        let rooms = {};
        rooms[roomtype_1.Roomtype.NormalAndNotExpansion] = [];
        rooms[roomtype_1.Roomtype.NormalWithAcceleratedPraising] = [];
        rooms[roomtype_1.Roomtype.NormalWithExpansion] = [];
        rooms[roomtype_1.Roomtype.NormalWithPraiseroom] = [];
        rooms[roomtype_1.Roomtype.NormalUnderSiege] = [];
        rooms[roomtype_1.Roomtype.NormalWithDismantleTarget] = [];
        rooms[roomtype_1.Roomtype.Expanion] = [];
        rooms[roomtype_1.Roomtype.My] = [];
        rooms[roomtype_1.Roomtype.BeingAbandoned] = [];
        rooms[roomtype_1.Roomtype.NormalNotAbandoned] = [];
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
                continue;
            }
            if (room.memory.t === undefined) {
                console.log("Room with unknown type: " + room.name + ". Assuming it is a metropolis.");
                room.memory.t = roomtype_1.Roomtype.Normal;
            }
            if (rooms[room.memory.t] === undefined) {
                rooms[room.memory.t] = [];
            }
            rooms[room.memory.t].push(room);
            rooms[roomtype_1.Roomtype.My].push(room);
            if (room.isExpansion()) {
                rooms[roomtype_1.Roomtype.Expanion].push(room);
            }
            if (!room.isExpansion() && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalAndNotExpansion].push(room);
            }
            if (room.memory.praiseBoost && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalWithAcceleratedPraising].push(room);
            }
            if (room.memory.expansion !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalWithExpansion].push(room);
            }
            if (room.memory.dismantleTargetRoom !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalWithDismantleTarget].push(room);
            }
            if (room.memory.praiseroom !== undefined && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalWithPraiseroom].push(room);
            }
            if (room.memory.isBeingDismantled === true) {
                rooms[roomtype_1.Roomtype.BeingAbandoned].push(room);
            }
            if (room.isUnderSiege()) {
                rooms[roomtype_1.Roomtype.NormalUnderSiege].push(room);
            }
            if (room.memory.isBeingDismantled !== true && room.memory.t === roomtype_1.Roomtype.Normal) {
                rooms[roomtype_1.Roomtype.NormalNotAbandoned].push(room);
            }
        }
        return rooms;
    }
}
exports.RoomService = RoomService;
