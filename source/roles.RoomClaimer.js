"use strict";
const RouteTravel = require("./rolelib.routetravel");
function run(creep) {
    let roomToClaim = creep.memory.target;
    if (roomToClaim !== creep.room.name) {
        RouteTravel.travelByRoute(creep, { avoidKeepers: true, preferHighway: true, allowSK: true, ignoreRoads: true, allowHostile: false }, true);
    }
    else {
        let response = creep.claimController(creep.room.controller);
        if (response !== OK) {
            creep.travelTo(creep.room.controller, { maxRooms: 1 });
        }
        if (Game.rooms[roomToClaim] !== undefined && Game.rooms[roomToClaim].controller !== undefined && Game.rooms[roomToClaim].controller.my) {
            creep.suicide();
        }
    }
}
exports.run = run;
;
