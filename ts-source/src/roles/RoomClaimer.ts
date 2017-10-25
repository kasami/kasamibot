import * as RouteTravel from "../rolelib/routetravel";

export function run(creep: Creep) {
    let roomToClaim: string = creep.memory.target;

    if (roomToClaim !== creep.room.name) {
        RouteTravel.travelByRoute(creep, {avoidKeepers: true, preferHighway: true, allowSK: true, ignoreRoads: true, allowHostile: false}, true);
    } else {
        let response = creep.claimController(creep.room.controller as Controller);
        if (response !== OK) {
            creep.travelTo(creep.room.controller as Controller, {maxRooms: 1});
        }
        if (Game.rooms[roomToClaim] !== undefined && Game.rooms[roomToClaim].controller !== undefined && (Game.rooms[roomToClaim].controller as Controller).my) {
            creep.suicide();
        }
    }
};
