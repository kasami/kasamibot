import * as RoomUtilities from "../utilities/Room";
import * as CommandLib from "../lib/command";

import * as OperationHaul from "../operations/Haul";
import * as OperationDrain from "../operations/Drain";

import {Role} from "../enums/role";
import {OperationType} from "../enums/operationtypes";
import {Roomtype} from "../enums/roomtype";

import {log} from "../tools/Logger";

const successColor = "green";
const errorColor = "red";

export class Command {

    public initCommands() {
        global.help = this.help;
        global.addOutpost = this.addOutpost;
        global.addExpansion = this.addExpansion;
        global.poachingreport = this.poachingreport;
        global.mineralreport = this.mineralreport;
        global.portalreport = this.portalreport;
        global.abandonRoom = this.abandonRoom;
        global.dismantleOutpost = this.dismantleOutpost;
        global.orderWreckerTeam = this.orderWreckerTeam;
        global.orderWreckers = this.orderWreckers;
        global.orderDrainer = this.orderDrainer;
        global.orderPaladin = this.orderPaladin;
        global.orderTagger = this.orderTagger;
        global.orderDeclarer = this.orderDeclarer;
        global.listFriends = this.listFriends;
        global.addFriend = this.addFriend;
        global.removeFriend = this.removeFriend;
        global.setLogLevel = this.setLogLevel;
        global.removeOutpost = this.removeOutpost;
        global.removeExpansion = this.removeExpansion;
        global.addDrainOperation = this.addDrainOperation;
        global.addHaulOperation = this.addHaulOperation;

        /*if (Game.time === 19409889 || Game.time === 19411389) {
            this.orderWreckerTeam("E83N9", 2, "E87N9", "E87N7", "E90N7", "E90N0", "E92N2", "E92N3", "E93N3");
        }*/
    }

    public help() {
        return  "<strong> - - Commands - - </strong><br/>" +
                " setLogLevel(lvl) - Sets log level 1-5, 1 is alert, 5 is debug.<br/>" +
                " listFriends() - Lists users tagged as friendly.<br/>" +
                " addFriend(username) - Adds user to friendly-list.<br/>" +
                " removeFriend(username) - Removes user from friendly-list.<br/>" +
                " <br/>" +
                " orderDrainer(roomName, tier, route...) - Orders a Drainer for target room. (Tier 1-3 for 1-3 towers) Route can be multiple rooms.<br/>" +
                " orderPaladin(roomName, route...) - Orders a Paladin for target room. Route can be multiple rooms.<br/>" +
                " orderWreckerTeam(roomName: string, tier: number, boosted: boolean, route: string[], ... targets: string[])<br/>" +
                " orderWreckers(roomName, count, route...) - Orders Wreckers (1-5) for target room. Route can be multiple rooms.<br/>" +
                " orderTagger(roomName, targetRoom) - Orders a tagger that builds walls according to flags.<br/>" +
                " orderDeclarer(roomName, route...) - Orders a declarer that signs controller in the route.<br/>" +
                " <br/>" +
                " addOutpost(roomName, outpost) - Adds outpost to a room.<br/>" +
                " removeOutpost(roomName, outpost) - Remove outpost from a room.<br/>" +
                " addExpansion(roomName, expansion, route...) - Adds expansion to a room.<br/>" +
                " removeExpansion(roomName, expansion) - Remove expansion from a room.<br/>" +
                " abandonRoom(roomName, destroyStructures?, saveEnergyBuildings?) - Starts abandoning the room. Send in true to remove all structures, default is false.<br/>" +
                " dismantleOutpost(roomName, outpost) - Captures room without building it, to clear buildings.<br/>" +
                " <br/>" +
                " mineralreport() - Report of minerals currently controlled.<br/>" +
                " poachingreport() - Report of minerals currently being poached.<br/>" +
                " portalreport() - Report of portals going out from my sectors.<br/>" +
                " <br/>" +
                " addHaulOperation(from: string, to: string, energyPerTick: number, endlevel: number) <br/>"+
                " addDrainOperation(spawnRoom: string, targetRoom: string, targetRoute: string[], tier: number)<br/>";
    }

    public setLogLevel(lvl: number) {
        let start = "Adjusting log-level <br/>";
        if (lvl < 1 || lvl > 5) {
            return start+"<span style='color:" + errorColor + ";'>Log level \"" + lvl + "\" is not valid, need to be between 1 and 5.</span>";
        }
        log.setLogLevel(lvl);
        return start+"<span style='color:" + successColor + ";'>Log level successfully set to "+ lvl + ".</span>";
    }

    public listFriends() {
        if (Memory.friendly === undefined) {
            Memory.friendly = [];
        }
        let start = "Showing list users counted of friends. <br/>";
        if (Memory.friendly.length > 0) {
            return start+"<span style='color:" + successColor + ";'>List of friends: " + JSON.stringify(Memory.friendly) + "</span>";
        } else {
            return start+"<span style='color:" + successColor + ";'>List of friends is empty.</span>";
        }
    }

    public addFriend(name: string) {
        if (Memory.friendly === undefined) {
            Memory.friendly = [];
        }
        let start = "Adding user \"" + name + "\" to friendlies-list. <br/>";
        if (_.indexOf(Memory.friendly, name) > -1) {
            return start+"<span style='color:" + errorColor + ";'>User \"" + name + "\" is already on friendlies-list.</span>";
        }
        Memory.friendly.push(name);
        return start+"<span style='color:" + successColor + ";'>User \"" + name + "\" added to friendlies-list.</span>";
    }

    public removeFriend(name: string) {
        if (Memory.friendly === undefined) {
            Memory.friendly = [];
        }
        let start = "Removing user \"" + name + "\" to friendlies-list. <br/>";
        let removed = _.pull(Memory.friendly, name);
        if (removed.length > 0) {
            return start+"<span style='color:" + successColor + ";'>User \"" + name + "\" removed from friendlies-list.</span>";
        } else {
            return start+"<span style='color:" + errorColor + ";'>User \"" + name + "\" was not found in friendlies-list.</span>";
        }
    }

    public abandonRoom(roomName: string, destroyStructures?: boolean, saveEnergyBuildings?: boolean) {
        let start = roomName + ": Abandoning room, sending out resources. <br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        room.memory.isBeingDismantled = true;
        if (destroyStructures === true) {
            if (saveEnergyBuildings === true) {
                room.memory.isBeingDismantledEverythingExceptEnergy = true;
            } else {
                room.memory.isBeingDismantledEverything = true;
            }
            return  start+"<span style='color:" + successColor + ";'>Room successfully marked as abandoned, and buildings removed.</span>";
        } else {
            return  start+"<span style='color:" + successColor + ";'>Room successfully marked as abandoned.</span>";
        }
    }


    public orderPaladin(roomName: string, ... route: string[]) {
        let start = roomName + ": Ordering Paladin for rooms " + JSON.stringify(route) + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (route.length < 1) {
            return start+"<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
        }
        for(let target of route) {
            let distance = Game.map.getRoomLinearDistance(roomName, target);
            if (!(distance < 21)) {
                return start+"<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
            }
        }

        let orderPaladin = new CommandLib.CommandOrder();
        orderPaladin.room = roomName;
        orderPaladin.role = Role.Paladin;
        orderPaladin.route = route;
        CommandLib.addCommandOrder(orderPaladin);

        return  start+"Room " + roomName + " is preparing a Paladin to attack: " + JSON.stringify(route) + "<br/>" +
                "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
    }

    public orderDrainer(roomName: string, tier: number, ... route: string[]) {
        let start = roomName + ": Ordering Drainer for rooms " + JSON.stringify(route) + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (route.length < 1) {
            return start+"<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
        }
        for(let target of route) {
            let distance = Game.map.getRoomLinearDistance(roomName, target);
            if (!(distance < 21)) {
                return start+"<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
            }
        }
        if (tier > 8 || tier < 1) {
            return start+"<span style='color:" + errorColor + ";'>Invalid tier for drainer: " + tier + ".</span>";
        }

        let drainerOrder = new CommandLib.CommandOrder();
        drainerOrder.room = roomName;
        drainerOrder.tier = tier;
        drainerOrder.role = Role.Drainer;
        drainerOrder.route = route;
        CommandLib.addCommandOrder(drainerOrder);

        return  start+"Room " + roomName + " is preparing a Drainer to drain: " + JSON.stringify(route) + "<br/>" +
                "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
    }

    public orderDeclarer(roomName: string, ... route: string[]) {
        let start = roomName + ": Ordering Delcarer for room " + JSON.stringify(route) + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        for(let target of route) {
            let distance = Game.map.getRoomLinearDistance(roomName, target);
            if (!(distance < 26)) {
                return start+"<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 25).</span>";
            }
        }
        if (Memory.rooms[route[route.length - 1]] === undefined) {
            Memory.rooms[route[route.length - 1]] = {};
        }
        Memory.rooms[route[route.length - 1]].t = Roomtype.Decoration;

        let taggerOrder = new CommandLib.CommandOrder();
        taggerOrder.room = roomName;
        taggerOrder.role = Role.Declarer;
        taggerOrder.route = route;
        CommandLib.addCommandOrder(taggerOrder);

        return  start+"Room " + roomName + " is preparing a Declarer to tag: " + JSON.stringify(route) + "<br/>" +
                "<span style='color:" + successColor + ";'>Declaring of ownership successfully initialized.</span>";
    }

    public orderTagger(roomName: string, targetRoom: string) {
        let start = roomName + ": Ordering Tagger for room " + targetRoom + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        let distance = Game.map.getRoomLinearDistance(roomName, targetRoom);
        if (!(distance < 21)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + targetRoom + " is not found, or the distance is too far (more than 20).</span>";
        }

        let taggerOrder = new CommandLib.CommandOrder();
        taggerOrder.room = roomName;
        taggerOrder.role = Role.Tagger;
        taggerOrder.target = targetRoom;
        CommandLib.addCommandOrder(taggerOrder);

        return  start+"Room " + roomName + " is preparing a Tagger to tag: " + targetRoom + "<br/>" +
                "<span style='color:" + successColor + ";'>Tagging successfully initialized.</span>";
    }

    public orderWreckerTeam(roomName: string, tier: number, boosted: boolean, route: string[], ... targets: string[]) {
        let start = roomName + ": Ordering WreckingTeam for rooms " + JSON.stringify(targets) + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (targets.length < 1) {
            return start+"<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
        }
        if (tier < 1 || tier > 3) {
            return start+"<span style='color:" + errorColor + ";'>The tier for a WreckingTeam has to be between 1 and 3.</span>";
        }
        if (boosted !== true && boosted !== false) {
            return start+"<span style='color:" + errorColor + ";'>You need to specify if the team should be boosted.</span>";
        }

        let wreckerOrder = new CommandLib.CommandOrder();
        wreckerOrder.room = roomName;
        wreckerOrder.tier = tier;
        wreckerOrder.role = Role.TeamWrecker;
        wreckerOrder.targets = targets;
        wreckerOrder.route = route;
        wreckerOrder.boosted = boosted;
        CommandLib.addCommandOrder(wreckerOrder);

        return  start+"Room " + roomName + " is preparing a WreckerTeam to attack: " + JSON.stringify(targets) + "<br/>" +
                "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
    }

    public orderWreckers(roomName: string, count: number, ... route: string[]) {
        let start = roomName + ": Ordering " + count + " Wreckers for rooms " + JSON.stringify(route) + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (route.length < 1) {
            return start+"<span style='color:" + errorColor + ";'>You need to specify at least one target room.</span>";
        }
        if (count < 1 || count > 6) {
            return start+"<span style='color:" + errorColor + ";'>The limit of ordering Wreckers are 1 to 5.</span>";
        }
        for(let target of route) {
            let distance = Game.map.getRoomLinearDistance(roomName, target);
            if (!(distance < 21)) {
                return start+"<span style='color:" + errorColor + ";'>Room " + target + " is not found, or the distance is too far (more than 20).</span>";
            }
        }

        let wreckerOrder = new CommandLib.CommandOrder();
        wreckerOrder.room = roomName;
        wreckerOrder.tier = 0;
        wreckerOrder.role = Role.Wrecker;
        wreckerOrder.route = route;

        for (let i = 0; i < count; i++) {
            CommandLib.addCommandOrder(wreckerOrder);
        }

        return  start+"Room " + roomName + " is preparing " + count + " wreckers to attack: " + JSON.stringify(route) + "<br/>" +
                "<span style='color:" + successColor + ";'>Attack successfully initialized.</span>";
    }

    public dismantleOutpost(roomName: string, outpost: string) {
        let start = roomName + ": Dismantling outpost " + outpost + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        let distance = Game.map.getRoomLinearDistance(roomName, outpost);
        if (!(distance < 10)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + outpost + " is not found, or the distance is too far (more than 9).</span>";
        }
        room.memory.dismantleTargetRoom = outpost;
        return  start+"Room will now be captured for dismantling: " + outpost + "<br/>" +
                "<span style='color:" + successColor + ";'>Dismantling successfully ordered.</span>";
    }

    public addOutpost(roomName: string, outpost: string) {
        let start = roomName + ": Adding outpost " + outpost + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        let distance = Game.map.getRoomLinearDistance(roomName, outpost);
        if (!(distance < 5)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + outpost + " is not found, or the distance is too far (more than 4).</span>";
        }
        if (room.memory.outposts === undefined) {
            room.memory.outposts = [];
        }
        if (roomName === outpost) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " can't be it's own outpost.</span>";
        }
        if (_.contains(room.memory.outposts, outpost)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " already has " + outpost +" as an outpost.</span>";
        }
        room.memory.outposts.push(outpost);
        return  start+"Room now has these outposts: " + JSON.stringify(room.memory.outposts) + "<br/>" +
                "<span style='color:" + successColor + ";'>Outpost successfully added.</span>";
    }

    public removeOutpost(roomName: string, outpost: string) {
        let start = roomName + ": Adding outpost " + outpost + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (!_.contains(room.memory.outposts, outpost)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " does not have " + outpost +" as an outpost.</span>";
        }
        _.pull(room.memory.outposts, outpost);
        return  start+"Room now has these outposts: " + JSON.stringify(room.memory.outposts) + "<br/>" +
                "<span style='color:" + successColor + ";'>Outpost successfully removed.</span>";
    }


    public addExpansion(roomName: string, expansion: string, ... route: string[]) {
        let start = roomName + ": Adding expansion " + expansion + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (room.memory.expansion !== undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " already has " + expansion +" as an expansion.</span>";
        }
        if (route !== undefined && route.length > 0) {
            room.memory.expansionRoute = route;
        }
        room.memory.expansion = expansion;
        return  start+"Room now has this expansion: " + JSON.stringify(room.memory.expansion) + "<br/>" +
                "<span style='color:" + successColor + ";'>Expansion successfully added.</span>";
    }



    public removeExpansion(roomName: string, expansion: string) {
        let start = roomName + ": Removing expansion " + expansion + "<br/>";
        if (Game.rooms[roomName] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " not found.</span>";
        }
        let room = Game.rooms[roomName];
        if (room.controller === undefined || !room.controller.my || room.controller.level < 1) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " is not controlled by you.</span>";
        }
        if (room.memory.expansion === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + roomName + " does not have " + expansion +" as an expansion.</span>";
        }
        room.memory.expansion = undefined;
        room.memory.expansionRoute = undefined;
        return  start+"Room now has no expansion: " + JSON.stringify(room.memory.expansion) + "<br/>" +
                "<span style='color:" + successColor + ";'>Expansion successfully removed.</span>";
    }

    public poachingreport() {
        let rooms = RoomUtilities.getAllControlledRooms();
        let output = "Rooms currently being poached: <br/>";
        for (let r of rooms) {
            if (r.memory.poaching !== undefined && r.memory.poaching.length > 0) {
                output += r.name +": ";
                for (let o of r.memory.poaching as string[]) {
                    output += o + ", ";
                }
                output = output.slice(0, -2) + "<br/>";
            }
        }
        return output;
    }

    public mineralreport() {
        let minerals: any = RoomUtilities.getMinerals();
        let output = "Minerals currently controlled: <br/>";
        for (let m of Object.keys(minerals)) {
            output += minerals[m] + " " + m + " | ";
        }
        return output.slice(0, -2);
    }

    public portalreport() {
        let output = "<strong>Portals currently active</strong> <br/>"
        if (Memory.portals === undefined || Object.keys(Memory.portals).length < 1) {
            output += "No portals found";
        } else {
            for (let r of Object.keys(Memory.portals)) {
                output += "From <a href='#!/room/" + Game.shard.name + "/" + r + "'>" + r + "</a> to <a href='#!/room/" + Game.shard.name + "/" + Memory.portals[r].dest + "'>" + Memory.portals[r].dest + "</a> - Uptime: " + (Game.time - Memory.portals[r].firstSeen);
                if (Memory.portals[r].decay !== undefined) {
                    output += " - Only active for about " + Memory.portals[r].decay + " more ticks";
                }
                output += "<br/>";
            }
        }
        return output;
    }

    public roomreport(roomName: string) {
        let room = Game.rooms[roomName];
        if (room === undefined) {
            return "Room not found";
        }
        if (room.controller === undefined || !room.controller.my) {
            return "Room not controlled";
        }
    }

    public addHaulOperation(from: string, to: string, energyPerTick: number, endlevel: number) {
        let start = "Initializing haul operation from " + from + " to " + to + " <br/>";
        if (Game.rooms[from] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + from + " not found.</span>";
        }
        let distance = Game.map.getRoomLinearDistance(from, to);
        if (!(distance < 15)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + to + " is not found, or the distance is too far (more than 15).</span>";
        }
        if (energyPerTick < 1) {
            return start+"<span style='color:" + errorColor + ";'>Energy per tick needs to be 1 or more.</span>";
        }
        if (endlevel < 2 || endlevel > 8) {
            return start+"<span style='color:" + errorColor + ";'>Level to end operation needs to be between 2 and 8.</span>";
        }
        let op: OperationHaul.Data = new OperationHaul.Data();
        op.operationtype = OperationType.Haul;
        op.from = from;
        op.to = to;
        op.amount = energyPerTick;
        op.victoryCondition = OperationHaul.VictoryCondition.RoomLevel;
        op.victoryValue = endlevel;
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        Memory.operations.push(op);
        return  start+"Started haul operation from " + from + " to " + to + ", hauling " + energyPerTick + " energy per tick<br/>" +
                "<span style='color:" + successColor + ";'>Operation successfully added.</span>";
    }

    public addDrainOperation(spawnRoom: string, targetRoom: string, targetRoute: string[], tier: number) {
        let start = "Initializing drain operation on " + targetRoom + " using room " + targetRoom + " <br/>";
        if (Game.rooms[spawnRoom] === undefined) {
            return start+"<span style='color:" + errorColor + ";'>Room " + spawnRoom + " not found.</span>";
        }
        let distance = Game.map.getRoomLinearDistance(spawnRoom, targetRoom);
        if (!(distance < 15)) {
            return start+"<span style='color:" + errorColor + ";'>Room " + targetRoom + " is not found, or the distance is too far (more than 15).</span>";
        }
        if (targetRoute.length < 0) {
            return start+"<span style='color:" + errorColor + ";'>Route " + targetRoute + " invalid.</span>";
        }
        let op: OperationDrain.Data = new OperationDrain.Data();
        op.operationtype = OperationType.Drain;
        op.spawnRoom = spawnRoom;
        op.targetRoom = targetRoom;
        op.targetRoute = targetRoute;
        op.victoryCondition = OperationDrain.VictoryCondition.HostileRoomEnergy;
        op.tier = tier;
        if (Memory.operations === undefined) {
            Memory.operations = [];
        }
        Memory.operations.push(op);
        return  start+"Started drain operation on room: " + targetRoom + "<br/>" +
                "<span style='color:" + successColor + ";'>Operation successfully added.</span>";
    }
}

export const command = new Command();
