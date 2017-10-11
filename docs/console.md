[Home](index.md) - [Features](features.md) - [Patchnotes](patchnotes.md) - [Manual control](console.md)

---

# Taking control

It is possible to use the code as a manual codebase, that is basically what I do on my account. Here I will reveal the different console-commands you have available. It is also possible to use a most of these even when running as a bot. I will also provide som details on how to adjust the behaviour by changing the memory.

## Disabling the bot

You disable to the bot by changing the setting in `Memory.settings.bot` to `false`:

```javascript
Memory.settings.bot = false;
```

This turns of features used by the bot like automatic expansion, automatic outpost assignment and automatic harassment and attacks. This allows you to decide which expansions to take and which outposts it should mine from. It will still assign two outposts early on and another batch at RCL 7, but if you decide to manually set these, they will not change.

I try to make all console-commands available with with the command `help()`, but I will give an overview below and go a bit more into detail on some topics.

## Empire and system

Commands to control the empire, basically use addOutpost and addExpansion when you want to expand.
```setLogLevel(lvl: number)```
Sets log level 1-5, 1 is alert, 5 is debug. Default is 3. Not that much used, but lvl 5 will show all spawning

```listFriends()```
Lists users tagged as friendly.

```addFriend(name: string)``` Adds user to friendly-list.

```removeFriend(name: string)``` Removes user from friendly-list.

```addOutpost(roomName: string, outpost: string)```
Adds outpost to a room. Can be a normal room, source keeper-room or portal room. Can also be a highway if you want to mine a room on the other side.

```removeOutpost(roomName: string, outpost: string)```
Remove outpost from a room.

```addExpansion(roomName: string, expansion: string, ... route: string[])```
Adds expansion to a room. See description for `route` below.

```removeExpansion(roomName: string, expansion: string)```
Remove expansion from a room.

```abandonRoom(roomName: string, destroyStructures?: boolean, saveEnergyBuildings?: boolean)```
Starts abandoning the room. Set `destroyStructures` to true to remove all structures, default is false. Set `saveEnergyBuildings` to true to not destroy storage and terminal, default is false.

```dismantleOutpost(roomName: string, outpost: string)```
Captures room without building it, to clear buildings. You have to manually unclaim the room later.

```mineralreport()```
Report of minerals currently controlled/mined.

```poachingreport()```
Report of rooms currently being poached. Poaching is taking minerals SK-rooms and portalrooms without harvesting energy.

```portalreport()```
Report of portals in the sectors you have rooms in (RCL8 rooms).

The `route` parameter in these commands is an array of roomnames that is used to guide the travel. It will follow the route before trying to move to the expansion. It also supports portaltravel (within shard) by using `$` in front of the room name that requires traveling through a portal.
```javascript
addExpansion("E1N1", "E61N61", "E5N5", "$E62N64")
```
The example above will spawn expansion-units in room E1N1. They will travel to room E5N5 and look for a portal. After traveling through a portal, they will move to E62N64 and then try to make an expansion in room E61N61.

## Unit ordering and operations

The available units will be heavily modified in version 1.1, but is fully usable. Basically I only use boosted WreckerTeams and hauloperation to rooms I want to progress quickly.

```orderDrainer(roomName: string, tier: number, ... route: string[])```
Orders a Drainer for target room. Route can be multiple rooms, waiting to drain each one.

```orderPaladin(roomName: string, ... route: string[])```
Orders a Paladin for target room. A paladin is a basic melee unit with healing, used to clean up simple rooms. Will order highest tier paladin the room can make.

```orderWreckerTeam(roomName: string, tier: number, boosted: boolean, route: string[], ... targets: string[])```
Orders a WreckerTeam (Dismantler and Healer). Tier can be 1-3, and should not be higher than RCL. Boosted should be set to true, unboosted teams is not supported by manual code yet. Does not check if it has enough boosts.

```orderWreckers(roomName: string, count: number, ... route: string[])```
Orders Wreckers (dismantlers) (1-5) for target room. Route can be multiple rooms.

```orderTagger(roomName: string, targetRoom: string)```
Orders a tagger that builds walls according to flags (Ayce and Pacman).

```orderDeclarer(roomName: string, ... route: string[])```
Orders a declarer that signs controller in the route.

```addHaulOperation(from: string, to: string, energyPerTick: number, endlevel: number)```
Starts an operation to move energy from one room to another. Both rooms needs to have a storage.

```addDrainOperation(spawnRoom: string, targetRoom: string, targetRoute: string[], tier: number)```
Starts an operation to drain a room for energy, stops when the target room is empty .
