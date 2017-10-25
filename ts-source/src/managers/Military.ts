import {Manager, ManagerPriority} from "../managers/_Manager";

import {CreepService} from "../services/Creep";
import {RoomService} from "../services/Room";

import * as TeamHealer from "../roles/TeamHealer";
import * as TeamWrecker from "../roles/TeamWrecker";
import * as Wrecker from "../roles/Wrecker";
import * as Drainer from "../roles/Drainer";
import * as Harasser from "../roles/Harasser";
import * as Paladin from "../roles/Paladin";
import * as Ranger from "../roles/Ranger";

import * as Signer from "../roles/Signer";
import * as Tagger from "../roles/Tagger";
import * as Declarer from "../roles/Declarer";

import * as CommandLib from "../lib/command";
import * as MilitaryLib from "../lib/military";

import {Role} from "../enums/role";

import {log} from "../tools/Logger";

export class MilitaryManager extends Manager {

    private roomService: RoomService;
    private creepService: CreepService;

    constructor(roomService: RoomService, creepService: CreepService) {
        super("MilitaryManager");
        this.roomService = roomService;
        this.creepService = creepService;
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Critical) {
            this.creepService.runCreeps(Role.TeamWrecker, TeamWrecker.run);
            this.creepService.runCreeps(Role.TeamHealer, TeamHealer.run);
            this.creepService.runCreeps(Role.Wrecker, Wrecker.run);
            this.creepService.runCreeps(Role.Paladin, Paladin.run);
            this.creepService.runCreeps(Role.Ranger, Ranger.run);
            this.creepService.runCreeps(Role.Drainer, Drainer.run);
            if (Memory.commandOrders !== undefined && Memory.commandOrders.length > 0) {
                processCommandOrders();
            }
        } else
        if (pri === ManagerPriority.Standard) {
            this.creepService.runCreeps(Role.Harasser, Harasser.run);
        } else
        if (pri === ManagerPriority.Trivial) {
            this.creepService.runCreeps(Role.Signer, Signer.run);
            this.creepService.runCreeps(Role.Declarer, Declarer.run);
            this.creepService.runCreeps(Role.Tagger, Tagger.run);
        }
    }
}

function processCommandOrders() {
    for (let order of Memory.commandOrders as CommandLib.CommandOrder[]) {
        if (CommandLib.commandOrderIsValid(order)) {
            switch (order.role) {
                case Role.TeamWrecker:
                    MilitaryLib.orderTeamWrecker(Game.rooms[order.room], order.tier, order.route as string[], order.targets as string[], 3)
                    break;
                case Role.Wrecker:
                    MilitaryLib.orderWrecker(Game.rooms[order.room], order.route as string[]);
                    break;
                case Role.Drainer:
                    MilitaryLib.orderDrainer(Game.rooms[order.room], order.tier, order.route as string[]);
                    break;
                case Role.Paladin:
                    MilitaryLib.orderPaladin(Game.rooms[order.room], order.route as string[]);
                    break;
                case Role.Tagger:
                    MilitaryLib.orderTagger(Game.rooms[order.room], order.target);
                    break;
                case Role.Declarer:
                    MilitaryLib.orderDeclarer(Game.rooms[order.room], order.route as string[]);
                    break;
                default:
                    log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
            }
        } else {
            log.error("Invalid CommandOrder: " + JSON.stringify(order), order.room);
        }
    }
    Memory.commandOrders = undefined;
}

/*

Energy Capacity at lvls:
5 - 1800
6 - 2300
7 - 5600
8 - 12900

NEW PLANS FOR MILITARY-MANAGER

T3
600 dmg from tower, 180 on boosted tough
1 tower:   180 (minst 4 T3 heal)
2 towers:  360 (minst 8 T3 heal)
3 towers:  540 (minst 12 T3 heal)
6 towers: 1080 (minst 24 T3 heal)

T2
600 dmg from tower, 300 on boosted tough
1 tower:   300 (minst 9 T2 heal) - RCL 6 kan klare dette? (B2T1)
2 towers:  600 (minst 18 T2 heal) - RCL 7 kan klare dette (B2T2)
3 towers:  900 (minst 27 T2 heal) - RCL 8 kan kanskje klare dette? (B2T3)

T1
600 dmg from tower, 420 on boosted tough
1 tower:   420 (minst 18 T1 heal) - RCL 7/8 kan klare dette (B1T1)

- TeamWrecker + TeamHealer
- TeamRanger + TeamRanger
- TeamWarrior + TeamHealer
- Ranger
- Warrior

Boosted WreckerTeams (B er for boostlevel, T er for profile tier)

B3T1 Wrecker - 2280 E, 8 TOUGH, 14 WORK, 2 RANGED_ATTACK, 6 MOVE
B3T1 Healer - 2280 E, 8 TOUGH, 8 HEAL, 4 MOVE

B3T2 Wrecker - 3570 E, 12 TOUGH, 20 WORK, 4 RANGED_ATTACK, 9 MOVE
B3T2 Healer - 4470 E, 12 TOUGH, 16 HEAL, 7 MOVE

B3T3 Wrecker - 4660 E, 16 TOUGH, 20 WORK, 4 RANGED_ATTACK, 10 MOVE
B3T3 Healer - 6660 E, 16 TOUGH, 24 HEAL, 10 MOVE

B2T1 Wrecker - 2280 E, 12 TOUGH, 13 WORK, 2 RANGED_ATTACK, 9 MOVE
B2T1 Healer - 2240 E, 4 TOUGH, 8 HEAL, 4 MOVE

B2T2 Wrecker - 2570 E, 12 TOUGH, 15 WORK, 3 RANGED_ATTACK, 10 MOVE
B2T2 Healer - 5120 E, 12 TOUGH, 18 HEAL, 10 MOVE

B2T3 Wrecker - 3320 E, 12 TOUGH, 20 WORK, 4 RANGED_ATTACK, 12 MOVE
B2T3 Healer - 6720 E, 12 TOUGH, 24 HEAL, 12 MOVE

B1T1 Wrecker - 3400 E, 10 TOUGH, 16 WORK, 6 RANGED_ATTACK, 16 MOVE
B1T1 Healer - 5300 E, 10 TOUGH, 18 HEAL, 14 MOVE



SNIPER - should be able to use unknown amount of longbows, and similar
amount of healers, only TOUGH and MOVE on longbows are boosted

Sniper T3 (300 dmg)
For lvl 8 - 5100 / 12900 energy capacity
- 10 TOUGH - 100
- 30 RANGED_ATTACK - 4500
- 10 MOVE - 500

SniperHealer T3 (300 heal)
For lvl 8 - 7500 / 12900 energy capacity
- 25 HEAL - 6250
- 25 MOVE - 1250

ELITELSNIPER - uses 2 longbows and 1 healer on the other side
Everything is boosted

EliteSniper T3 (960 dmg)
For lvl 8 - 5100 / 12900 energy capacity
- 16 TOUGH - 160
- 24 RANGED_ATTACK - 4500
- 10 MOVE - 500

EliteSniperLeader T3 (1152 heal)
For lvl 8 - 6330 / 12900 energy capacity
- 3 TOUGH - 30
- 24 HEAL - 6000
- 7 MOVE - 300

*/
