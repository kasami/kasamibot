"use strict";
const RoomLib = require("./lib.room");
function getCloseHighways(baseroom) {
    let potentialHighways = getRoomsOneAway(baseroom).concat(getRoomsTwoAway(baseroom), getRoomsThreeAway(baseroom), getRoomsFourAway(baseroom), getRoomsSixAway(baseroom));
    return _.filter(potentialHighways, function (r) { return RoomLib.roomIsHighway(r); });
}
exports.getCloseHighways = getCloseHighways;
function getRoomsOneAway(baseroom) {
    let roomsOneAway = [];
    let exits = Game.map.describeExits(baseroom);
    _.forEach(exits, function (room) {
        if (room !== undefined) {
            roomsOneAway.push(room);
        }
    });
    return roomsOneAway;
}
exports.getRoomsOneAway = getRoomsOneAway;
function getRoomsTwoAway(baseroom) {
    let roomsTwoAway = [];
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsOneAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsTwoAway.push(room);
            }
        });
    }
    roomsTwoAway = _.uniq(roomsTwoAway);
    _.pull(roomsTwoAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsTwoAway, oneAway);
    }
    return roomsTwoAway;
}
exports.getRoomsTwoAway = getRoomsTwoAway;
function getRoomsThreeAway(baseroom) {
    let roomsThreeAway = [];
    let roomsTwoAway = getRoomsTwoAway(baseroom);
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsTwoAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsThreeAway.push(room);
            }
        });
    }
    roomsThreeAway = _.uniq(roomsThreeAway);
    _.pull(roomsThreeAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsThreeAway, oneAway);
    }
    for (let twoAway of roomsTwoAway) {
        _.pull(roomsThreeAway, twoAway);
    }
    return roomsThreeAway;
}
exports.getRoomsThreeAway = getRoomsThreeAway;
function getRoomsFourAway(baseroom) {
    let roomsFourAway = [];
    let roomsThreeAway = getRoomsThreeAway(baseroom);
    let roomsTwoAway = getRoomsTwoAway(baseroom);
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsThreeAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsFourAway.push(room);
            }
        });
    }
    roomsFourAway = _.uniq(roomsFourAway);
    _.pull(roomsFourAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsFourAway, oneAway);
    }
    for (let twoAway of roomsTwoAway) {
        _.pull(roomsFourAway, twoAway);
    }
    for (let threeAway of roomsThreeAway) {
        _.pull(roomsFourAway, threeAway);
    }
    return roomsFourAway;
}
exports.getRoomsFourAway = getRoomsFourAway;
function getRoomsFiveAway(baseroom) {
    let roomsFiveAway = [];
    let roomsFourAway = getRoomsFourAway(baseroom);
    let roomsThreeAway = getRoomsThreeAway(baseroom);
    let roomsTwoAway = getRoomsTwoAway(baseroom);
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsFourAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsFiveAway.push(room);
            }
        });
    }
    roomsFiveAway = _.uniq(roomsFiveAway);
    _.pull(roomsFiveAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsFiveAway, oneAway);
    }
    for (let twoAway of roomsTwoAway) {
        _.pull(roomsFiveAway, twoAway);
    }
    for (let threeAway of roomsThreeAway) {
        _.pull(roomsFiveAway, threeAway);
    }
    for (let fourAway of roomsFourAway) {
        _.pull(roomsFiveAway, fourAway);
    }
    return roomsFiveAway;
}
exports.getRoomsFiveAway = getRoomsFiveAway;
function getRoomsSixAway(baseroom) {
    let roomsSixAway = [];
    let roomsFiveAway = getRoomsFiveAway(baseroom);
    let roomsFourAway = getRoomsFourAway(baseroom);
    let roomsThreeAway = getRoomsThreeAway(baseroom);
    let roomsTwoAway = getRoomsTwoAway(baseroom);
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsFiveAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsSixAway.push(room);
            }
        });
    }
    roomsSixAway = _.uniq(roomsSixAway);
    _.pull(roomsSixAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsSixAway, oneAway);
    }
    for (let twoAway of roomsTwoAway) {
        _.pull(roomsSixAway, twoAway);
    }
    for (let threeAway of roomsThreeAway) {
        _.pull(roomsSixAway, threeAway);
    }
    for (let fourAway of roomsFourAway) {
        _.pull(roomsSixAway, fourAway);
    }
    for (let fiveAway of roomsFiveAway) {
        _.pull(roomsSixAway, fiveAway);
    }
    return roomsSixAway;
}
exports.getRoomsSixAway = getRoomsSixAway;
function getRoomsSevenAway(baseroom) {
    let roomsSevenAway = [];
    let roomsSixAway = getRoomsSixAway(baseroom);
    let roomsFiveAway = getRoomsFiveAway(baseroom);
    let roomsFourAway = getRoomsFourAway(baseroom);
    let roomsThreeAway = getRoomsThreeAway(baseroom);
    let roomsTwoAway = getRoomsTwoAway(baseroom);
    let roomsOneAway = getRoomsOneAway(baseroom);
    for (let neighbour of roomsSixAway) {
        let neighbourExits = Game.map.describeExits(neighbour);
        _.forEach(neighbourExits, function (room) {
            if (room !== undefined) {
                roomsSevenAway.push(room);
            }
        });
    }
    roomsSevenAway = _.uniq(roomsSevenAway);
    _.pull(roomsSevenAway, baseroom);
    for (let oneAway of roomsOneAway) {
        _.pull(roomsSevenAway, oneAway);
    }
    for (let twoAway of roomsTwoAway) {
        _.pull(roomsSevenAway, twoAway);
    }
    for (let threeAway of roomsThreeAway) {
        _.pull(roomsSevenAway, threeAway);
    }
    for (let fourAway of roomsFourAway) {
        _.pull(roomsSevenAway, fourAway);
    }
    for (let fiveAway of roomsFiveAway) {
        _.pull(roomsSevenAway, fiveAway);
    }
    for (let sixAway of roomsSixAway) {
        _.pull(roomsSevenAway, sixAway);
    }
    return roomsSevenAway;
}
exports.getRoomsSevenAway = getRoomsSevenAway;
