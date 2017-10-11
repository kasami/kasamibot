[Home](index.md) - [Features](features.md) - [Patchnotes](patchnotes.md) - [Manual control](console.md)

---

# Patchnotes

Patch notes for release 0.9 - Beta than before is not included, as it is 9 months of development and about ~1000 commits.

## Release 1.0 - Cake and grief counseling

**Features**
* The fortresswall is not built for expansions, instead it builds ramparts on important buildings
* Knows the difference between harmless hostiles and dangerous hostiles in our outposts, and acts accordingly
* Units traveling in potential hostile rooms now check for hostiles and paths around them
* OutpostDefenders how attacks enemies while moving to the room they are defending
* Adds poaching-report to see which rooms we are poaching minerals from
* Roadmanager now tracks individual roads in owned rooms, and lets unneeded roads decay
* Improved triggering of defcon 2 and 3
* Rooms use boosts for upgrading earlier, instead of stockpiling
* BaseHauler now tanks up before parking
* Intel is now serialized in memory and only parsed when needed
* Bad rooms is now abandoned, based on source count
* Spawnmanager uses the new spawnCreep, improving refilling of extensions
* Fortress height is now scaled based on border wall height
* Prayerroom upgraded to be able to use a second spawn and 7 extra praisers at RCL 7
* Prayerroom now use ramparts on important structures

**Fixes**
* Pioneers should now upgrade controller if we have lost a RCL and only need some upgrading to recover
* ExpansionWorkers will not try to repair ramparts at RCL 1
* Prevent BaseCouriers from spawning at RCL 1
* BaseBuilders should now start repairing ramparts when they build them
* Will not try to scout unavailable rooms
* Harassers will not try to move to unavailable rooms
* RoomClaimer should now move up to the controller even if we can't yet take the room
* Abandoned rooms should no longer build walls
* Prevents pioneers for being spawned in rooms with few or no outposts when they are not needed
* ExtensionPlanner now takes links and containers into consideration when planning layout
* ExtensionPlanner is now better at placing single extensions, and checks path distance to verify positions
* Prevents poachguards for chasing after haulers to heal them
