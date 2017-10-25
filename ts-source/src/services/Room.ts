import {Roomtype} from "../enums/roomtype";

export class RoomService {

    private roomDictionary: {[type: number]: Room[]};

    constructor() {
        this.roomDictionary = this.makeDictionary();
    }

    public getAllOfType(role: Roomtype): Room[] {
        if (this.roomDictionary[role] !== undefined) {
            return this.roomDictionary[role];
        }
        return [];
    }

    public getMyRooms(): Room[] {
        if (this.roomDictionary[Roomtype.My] !== undefined) {
            return this.roomDictionary[Roomtype.My];
        }
        return [];
    }

    public getNormalRooms(): Room[] {
        if (this.roomDictionary[Roomtype.Normal] !== undefined) {
            return this.roomDictionary[Roomtype.Normal];
        }
        return [];
    }


    public getNormalRoomsNotAbandoned(): Room[] {
        if (this.roomDictionary[Roomtype.NormalNotAbandoned] !== undefined) {
            return this.roomDictionary[Roomtype.NormalNotAbandoned];
        }
        return [];
    }

    public getRoomsBeingAbandoned(): Room[] {
        if (this.roomDictionary[Roomtype.BeingAbandoned] !== undefined) {
            return this.roomDictionary[Roomtype.BeingAbandoned];
        }
        return [];
    }

    public getPraiseRooms(): Room[] {
        if (this.roomDictionary[Roomtype.Praiseroom] !== undefined) {
            return this.roomDictionary[Roomtype.Praiseroom];
        }
        return [];
    }

    public getNormalAndNotExpansion(): Room[] {
        if (this.roomDictionary[Roomtype.NormalAndNotExpansion] !== undefined) {
            return this.roomDictionary[Roomtype.NormalAndNotExpansion];
        }
        return [];
    }

    public getNormalWithExpansion(): Room[] {
        if (this.roomDictionary[Roomtype.NormalWithExpansion] !== undefined) {
            return this.roomDictionary[Roomtype.NormalWithExpansion];
        }
        return [];
    }
    
    public getNormalUnderSiege(): Room[] {
        if (this.roomDictionary[Roomtype.NormalUnderSiege] !== undefined) {
            return this.roomDictionary[Roomtype.NormalUnderSiege];
        }
        return [];
    }

    public getNormalWithPraiseroom(): Room[] {
        if (this.roomDictionary[Roomtype.NormalWithPraiseroom] !== undefined) {
            return this.roomDictionary[Roomtype.NormalWithPraiseroom];
        }
        return [];
    }

    public getNormalWithDismantleTarget(): Room[] {
        if (this.roomDictionary[Roomtype.NormalWithDismantleTarget] !== undefined) {
            return this.roomDictionary[Roomtype.NormalWithDismantleTarget];
        }
        return [];
    }

    private makeDictionary(): {[type: number]: Room[]} {
        let rooms: {[type: number]: Room[]} = {};
        rooms[Roomtype.NormalAndNotExpansion] = [];
        rooms[Roomtype.NormalWithAcceleratedPraising] = [];
        rooms[Roomtype.NormalWithExpansion] = [];
        rooms[Roomtype.NormalWithPraiseroom] = [];
        rooms[Roomtype.NormalUnderSiege] = [];
        rooms[Roomtype.NormalWithDismantleTarget] = [];
        rooms[Roomtype.Expanion] = [];
        rooms[Roomtype.My] = [];
        rooms[Roomtype.BeingAbandoned] = [];
        rooms[Roomtype.NormalNotAbandoned] = [];
        for (let roomName in Game.rooms) {

            let room = Game.rooms[roomName];
            if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
                continue;
            }
            if (room.memory.t === undefined) {
                console.log("Room with unknown type: " + room.name + ". Assuming it is a metropolis.");
                room.memory.t = Roomtype.Normal;
            }
            if (rooms[room.memory.t] === undefined){
                rooms[room.memory.t] = [];
            }
            rooms[room.memory.t].push(room);
            rooms[Roomtype.My].push(room);
            if (room.isExpansion()) {
                rooms[Roomtype.Expanion].push(room);
            }
            if (!room.isExpansion() && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalAndNotExpansion].push(room);
            }
            if (room.memory.praiseBoost && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalWithAcceleratedPraising].push(room);
            }
            if (room.memory.expansion !== undefined && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalWithExpansion].push(room);
            }
            if (room.memory.dismantleTargetRoom !== undefined && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalWithDismantleTarget].push(room);
            }
            if (room.memory.praiseroom !== undefined && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalWithPraiseroom].push(room);
            }
            if (room.memory.isBeingDismantled === true) {
                rooms[Roomtype.BeingAbandoned].push(room);
            }
            if (room.isUnderSiege()) {
                rooms[Roomtype.NormalUnderSiege].push(room);
            }
            if (room.memory.isBeingDismantled !== true && room.memory.t === Roomtype.Normal) {
                rooms[Roomtype.NormalNotAbandoned].push(room);
            }
        }
        return rooms;
    }
}
