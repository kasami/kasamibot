# KasamiBot - Autonomous Screeps bot

**Current Release: Beta than before - version 0.9.1**

I've decided to include the full source for the bot when version 1.0 is release. I might also update the license for to allow forks and further development. I will not be accepting pull requests, as the development is done in a separate branch to allow me to stay ahead and add features not yet available to the bot.

---

## Install the bot:

* [Steam Workshop](http://steamcommunity.com/sharedfiles/filedetails/?id=1139264355)
* [npm i screeps-bot-kasamibot](https://www.npmjs.com/package/screeps-bot-kasamibot)
* [Download zip and use the files in dist-folder](https://github.com/kasami/kasamibot/archive/master.zip)

---

## Remaining for release 1.0 - Cake and grief counseling
* New unit for draining RCL 3+ rooms when we do not have boosts for attacking
* Use Observers for scouting when reacing RCL 8

## Plans for release 1.1 - The world might burn
* DestructionManager for intelligent attacks on hostile rooms
* Improved AI for defending units when under siege
* Better AI for Bank-teams, being able to defend themselves
* Better defense when under siege, and response from the room itself and neighbouring rooms
* Operation for guarding rooms owned by an enemy, but without spawns. This to prevent rebuilding.
* Towers should be smarter, and avoid being drained
* New team for harassing enemy rooms, that targets all neighbouring rooms and try to kill civilian units
* Nuke-defense
* Offensive use of nukes
* Long-term siege at enemy rooms, with longbows, drainers and wreckerteams

## Roadmap
* Faster and consistent boosting of units
* Better response for invaders in portal room
* More efficient wallbuilding, by splitting it up to repairers and haulers
* Pillage enemy rooms by stealing valuable resources
* Better operation for guarding wanted outposts
* Tracking CPU usage for better deciding on how capable we are of expanding
* New room-type, fortress, that is used to limit CPU-usage
* Better DistributionManager for lowering transfer-costs of energy
* Better TradeManager for finding good deals on the market

---

## What is Screeps?
Screeps is an open source MMO RTS game for programmers, where your mission is to code an AI. There is an official server hosted by the developers, and there are multiple open private servers. You can also run a server locally. To learn more, [visit screeps.com](https://screeps.com/) or [the steam page](http://store.steampowered.com/app/464350/Screeps/).

## What is KasamiBot?
KasamiBot is a code base used by me (Kasami) on the public server, but customized for automation to be used as an opponent on private servers. It has a lot of features, and will be quite hard to compete with for new players, so you can customize the difficulty in the config.js-file. It allows you to set the bot as passive, meaning it will not attack your rooms; and slow, meaning it will use less of the advanced features included in the bot.

The bot is distributed as an uglified version of the Typescript codebase I'm working on. This is not a community-driven codebase, but my personal screeps codebase, and I intend it to stay this way. However I wanted to be able to distribute it as a bot, and with javascript uglifying it was the closest thing I could get to compiling it.

## Can I use it on the public server?
Screeps is a game about programming your own AI. While I can't stop you from using this code on the public server, I highly recommend developing your own AI instead. I have decided to release the source for the bot, so you can further develop it, tune it and use it as you want. If you have any questions about the bot or about the features, please post an issue on github, and I can either answer there or further develop the documentation.

Remember, there is no right way to program your screeps AI, so I recommend trying to come up with your own solutions. Over time you will find a lot of joy in figuring our clever things to implement.