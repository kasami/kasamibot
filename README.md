# KasamiBot - Autonomous Screeps bot

**Current Release: Beta than before - version 0.9.1**

---

## Install the bot:

* [Steam Workshop](http://steamcommunity.com/sharedfiles/filedetails/?id=1139264355)
* [npm i screeps-bot-kasamibot](https://www.npmjs.com/package/screeps-bot-kasamibot)
* [Download zip and use the files in dist-folder](https://github.com/kasami/kasamibot/archive/master.zip)

---

## What is Screeps?
Screeps is an open source MMO RTS game for programmers, where your mission is to code an AI. There is an official server hosted by the developers, and there are multiple open private servers. You can also run a server locally. To learn more, [visit screeps.com](https://screeps.com/) or [the steam page](http://store.steampowered.com/app/464350/Screeps/).

## What is KasamiBot?
KasamiBot is a code base used by me (Kasami) on the public server, but customized for automation to be used as an opponent on private servers. It has a lot of features, and will be quite hard to compete with for new players, so you can customize the difficulty in the config.js-file. It allows you to set the bot as passive, meaning it will not attack your rooms; and slow, meaning it will use less of the advanced features included in the bot.

The bot is distributed as an uglified version of the Typescript codebase I'm working on. This is not a community-driven codebase, but my personal screeps codebase, and I intend it to stay this way. However I wanted to be able to distribute it as a bot, and with javascript uglifying it was the closest thing I could get to compiling it.

## Can I use it on the public server?
Screeps is a game about programming your own AI. While I can't stop you from using this code on the public server, I highly recommend developing your own AI instead. I do not endorce using KasamiBot on the public server. If you are stuck, go to the screeps slack-channel #help, and you will get support from a lot of talented people. I will also help if I'm available and have time (with your own AI, not KasamiBot).

If there are parts of the bot you are interested in learning more about, post an issue on github, and I might make a deepdive-article about how it works in KasamiBot, with code-examples to get you on the right track. But please remember, there is no right way to program your screeps AI, so I recommend trying to come up with a solution yourself. Over time you will find a lot of joy in figuring our clever things to implement.

---

# KasamiBot Features

## Building up a base

The bot uses a flexible layout, but with a core of 7x7 where it places the most of the structures except extensions. This allows it to expand to most rooms, and plan the layout of the room according to the free space. For the first room after spawning it will decide on the best position for the spawn and move it after it has built a storage and is confident it has enough builders and energy to successfully rebuild the spawn.

It will build structures according to roomlevel, but prioritizes spawns and extensions when building new structures after upgrading the RCL. This means it will finish building 3 spawns and 60 extensions, before building additional labs or nuker. It will also periodically check if any buildings are missing, and rebuild these. The position of the base is calculated so that it has optimal space, but also optimal distance to the mineral, controller and sources in the room.

The extensions in a room is primarily built above the base core, next to the spawns, but if the room does not allow for that it will build corridors with extensions along the sides. If it still can't place all extensions, it will place them individually around the base and at the same time make sure it doesn't block access.

The roadnetwork is built up from the middle of the base core, and will build out to all sources in the owned room and outposts (reserved rooms and source keeper-rooms). It will plan the roads according to the finished base structure, so for the first few RCL-levels the road might seem longer than it needs to be. It periodically checks for new targets for the road network, and maintains a list of roads that needs repairing.

## Running a base

Each own room maintains it's own queue for spawning creeps. The spawns themselves do not check for what creeps are needed, other modules of the code places orders that the spawns then process. Each order contains the needed information for spawning the creep, and a priority telling the spawn-manager how urgent the order is.

To keep the base running, refilling extensions is a vital part. Each room has a special creep called basehauler that is responsible for this, placed between the three spawns (at RCL 8) when it is idle. The basehauler will also provide energy to other structures like towers, nuker and power spawn when that is needed.

The other vital role for the base is the basecourier, which handles everything else. It transports resources other than energy around the base, like ghodium to the nuker, power to the power spawn and minerals to the labs. It is also responsible for supplying energy to the link inside the base and balancing resources in the storage and the terminal.

When we move out of the core, we will meet the janitor. It is responsible for repairing all roads connected to the room, and any containers that is low on hits. It is also responsible for construction of new structures outside of the owned room.

Inside the owned room, we have basebuilders that are responsible for building. They are also responsible for keeping the walls and ramparts around the room repaired, and will move over to that task when they run out of construction sites.

## Harvesting energy

For the first two RCL-levels, the bot is using a simple and versatile unit called pioneer for both harvesting energy, supplying extensions and spawn, construction and upgrading. When we hit RCL 3, it will start constructing dedicated miners that drop energy into containers. The miners themselves will build and repair the containers they are working on. At RCL 7 it will start to overfit the dedicated miners, allowing the to mine out the sources quicker to save CPU.

The pioneers will ship the energy themselves, but when dedicated miners, containerminers, are used, the bot will spawn dedicated haulers to ship the energy back to the base. First it will have haulers assigned to specific containers, but from RCL 7 it will start using the same pool of haulers for all the sources, allowing it to spawn fewer units.

Already at RCL 2 the bot will start mining for other rooms, typically two other rooms. At RCL 7 it will add two more, and another two at RCL 8, totally six reserved rooms. If it is next to a source keeper-room, it might decide to mine from that instead of two normal rooms. It will choose outposts based on distance to the sources and amount of sources.

## Upgrading rooms

Upgrading the rooms is first done by pioneers, but at RCL 3 it will start spawning dedicated upgraders based on how much energy it has access to. At RCL 5 it will start using links to provide the upgraders with energy, and at RCL 8 it will only upgrade with 15 WORK parts. The upgraders will be boosted if the rooms has enough T3 boost-mineral.

If the room has a lot of stored energy, and still has not reached RCL 8, it will try to burn that energy by spawning additional upgraders and dedicated haulers for the upgraders. This will stop when it feels it has used enough of the stored energy.

## Harvesting minerals

It will harvest minerals both from all owned rooms from RCL 6, and any mined source keeper-rooms from RCL 7. The minerals will be dropped into a container and shipped back to base by a dedicated hauler.

In addition to this, it will check if there is any source keeper-rooms or portal rooms nearby that is not mined by other players, and launch a special operation to mine any available minerals. It will consist of a guard for taking out any source keepers, as many mineralminers as the mineral can fit and dedicated haulers to ship the minerals back to base. This operation is done without roads, containers or other infrastructure.

## Processing minerals and boosting

The lab area is positioned at the bottom of the base core, and is built for maximum efficiency. The labmanager will try to maintain a healty collection of processed minerals (boosts) in the terminal. Focusing on T3 boosts but also building T2 and T1. If all combat boosts the AI wants is produced it will continue to produce T3 boosts for upgrading. The lab will only start processing minerals if it has access to the needed basic minerals in the terminal.

All spawned creeps can request to be boosted, which is typically decided by the manager responsible for the creep. When a creep needs boosting, it will move down the lab closest to the middle of the core, and it is taken out of the normal flow of mineral processing. The basehauler will come and move the necessary minerals from the terminal to the lab, and the creep will be boosted.

## Harvesting and processing power

All RCL8-rooms check highways close to them for power banks, and if the rooms finds any and feels it has enough energy and free spawn capacity to take it, it will start an operation for harvesting the power. This typically means teams of bankrobbers, equipped with ATTACK, and bankhealers. If the bank has few free positions around it, it will also spawn a bankranger with RANGED_ATTACK to help take down the bank. When the bank is close to being broken, it will spawn dedicated haulers that will ship the power back to the base.

KasamiBot focuses on GCL over power processing, but this can be adjusted in the config.js-file. If the room has more energy than it can use for upgrading, and has power ready for processing, it will process that power.

## Trade and distribution

The bot will try to distribute minerals between the rooms. It will also send energy and power to rooms that needs that, provided it finds a room that has an abundance of the resource. If any boosts are missing when a creep needs to be boosted, it will also look on other rooms and distribute the necessary boosts.

The bot will also use the market to buy and sell resources. The config.js-file contains a value of how much credit it will try to maintain. Until it reaches this amount, it will sell excess minerals, power and energy. When it reaches it amount, it will also start buying minerals that it is missing.

## Expanding to new rooms

All rooms will try to learn about the area they are in. To do this, they use the proximityscout to get visibilty in rooms, and then saves the interesting data to memory. It will try to refresh the intelligence every 20000 ticks, by sending out new scouts no other creeps has visited the room in the mean time.

The rooms will then calculate the value of the room as a base, based on what mineral it has, access to sources in and around the room, and a lot of other factors. When the AI has excess GCL and want to expand, it asks all the rooms to provide their best target room for expansion, and decides between these where to expand to.

When expanding, the rooms will send a dedicated unit type called expansion worker, that builds up the base until RCL 3. They will use the spawn to renew themselves, to prevent additional used spawn time and travel time from the parent room. At RCL 3 the room will no longer be considered an expansion, and will have to survive on it's own.

## Defending your room

Defending the room and outposts from invaders is the responsibility of the outpostdefender. They will also defend against players trying to send offensive units to the room's outposts. The outpostdefender will look at the attacking unit, and request support from up to two other units if it feels it can't take out the attacker itself.

When the owned room is under attack, it will start spawning active defender-units. Typically two units are used, the rampartdefender which sits on ramparts and attacks nearby creeps, and the baseranger which is equiped with ranged attack. It can also request support from other rooms that can send additional defenders to the room.

The rooms are defended by two different walls, the borderwall along the border, and the fortresswall protecting the inner vital buildings. If the AI feels the inner buildings is threatened, it can trigger a safemode.

## Attacking other players

The bot has a range of military units at it's disposal, but typically it will use either a ranger with ranged attack and heal, or a wreckerteam with on unit with work and ranged attack and another with heal.

When the bot is not set to passive, it will sometimes decide that a room can launch an attack on rooms around it. It will only try to attack hostile owned or reserved rooms, and only owned rooms it thinks it has enough boosts to take down. This will typicall be a boosted wreckerteam that focuses on taking down important structures in the room.

A special roaming unit called the harasser is used to attack hostile reserved rooms. It will try to kill any units that is weaker than itself, but will try to escape and harass other rooms if it runs into too powerful units.
