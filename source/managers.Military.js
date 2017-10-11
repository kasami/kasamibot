"use strict";
const _Manager_1 = require("./managers._Manager");
const TeamHealer = require("./roles.TeamHealer");
const TeamWrecker = require("./roles.TeamWrecker");
const Wrecker = require("./roles.Wrecker");
const Drainer = require("./roles.Drainer");
const Harasser = require("./roles.Harasser");
const Paladin = require("./roles.Paladin");
const Ranger = require("./roles.Ranger");
const Signer = require("./roles.Signer");
const Tagger = require("./roles.Tagger");
const Declarer = require("./roles.Declarer");
const CommandLib = require("./lib.command");
const MilitaryLib = require("./lib.military");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
class MilitaryManager extends _Manager_1.Manager {
    constructor(roomService, creepService) {
        super("MilitaryManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Critical) {
            this.creepService.runCreeps(role_1.Role.TeamWrecker, TeamWrecker.run);
            this.creepService.runCreeps(role_1.Role.TeamHealer, TeamHealer.run);
            this.creepService.runCreeps(role_1.Role.Wrecker, Wrecker.run);
            this.creepService.runCreeps(role_1.Role.Paladin, Paladin.run);
            this.creepService.runCreeps(role_1.Role.Ranger, Ranger.run);
            this.creepService.runCreeps(role_1.Role.Drainer, Drainer.run);
            if (Memory.commandOrders !== undefined && Memory.commandOrders.length > 0) {
                processCommandOrders();
            }
        }
        else if (pri === _Manager_1.ManagerPriority.Standard) {
            this.creepService.runCreeps(role_1.Role.Harasser, Harasser.run);
        }
        else if (pri === _Manager_1.ManagerPriority.Trivial) {
            this.creepService.runCreeps(role_1.Role.Signer, Signer.run);
            this.creepService.runCreeps(role_1.Role.Declarer, Declarer.run);
            this.creepService.runCreeps(role_1.Role.Tagger, Tagger.run);
        }
    }
}
exports.MilitaryManager = MilitaryManager;
function processCommandOrders() {
    for (let order of Memory.commandOrders) {
        if (CommandLib.commandOrderIsValid(order)) {
            switch (order.role) {
                case role_1.Role.TeamWrecker:
                    MilitaryLib.orderTeamWrecker(Game.rooms[order.room], order.tier, order.route, order.targets, 3);
                    break;
                case role_1.Role.Wrecker:
                    MilitaryLib.orderWrecker(Game.rooms[order.room], order.route);
                    break;
                case role_1.Role.Drainer:
                    MilitaryLib.orderDrainer(Game.rooms[order.room], order.tier, order.route);
                    break;
                case role_1.Role.Paladin:
                    MilitaryLib.orderPaladin(Game.rooms[order.room], order.route);
                    break;
                case role_1.Role.Tagger:
                    MilitaryLib.orderTagger(Game.rooms[order.room], order.target);
                    break;
                case role_1.Role.Declarer:
                    MilitaryLib.orderDeclarer(Game.rooms[order.room], order.route);
                    break;
                default:
                    Logger_1.log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
            }
        }
        else {
            Logger_1.log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
        }
    }
    Memory.commandOrders = undefined;
}
