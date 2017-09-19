"use strict"
function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r)
e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function _defineProperty(e,r,o){return r in e?Object.defineProperty(e,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[r]=o,e}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,r){for(var o=0;o<r.length;o++){var t=r[o]
t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,o,t){return o&&e(r.prototype,o),t&&e(r,t),r}}()
module.exports=function(e){function r(t){if(o[t])return o[t].exports
var n=o[t]={exports:{},id:t,loaded:!1}
return e[t].call(n.exports,n,n.exports,r),n.loaded=!0,n.exports}var o={}
return r.m=e,r.c=o,r.p="",r(0)}([function(e,r,o){var t=o(1),n=o(139)
try{var a=require("config")
void 0!==a&&(void 0===Memory.settings&&(Memory.settings={},console.log("* * * * * * * * * * * * *"),console.log(" Loading KasamiBot 0.9.0 "),console.log("* * * * * * * * * * * * *")),void 0!==a.bot&&void 0===Memory.settings.bot&&(console.log("Running as bot: "+a.bot),Memory.settings.bot=a.bot),void 0!==a.passive&&void 0===Memory.settings.passive&&(console.log("Running as passive bot: "+a.passive),Memory.settings.passive=a.passive),void 0!==a.slow&&void 0===Memory.settings.slow&&(console.log("Running as slow bot: "+a.slow),Memory.settings.slow=a.slow),void 0!==a.creditsToMaintain&&void 0===Memory.settings.creditsToMaintain&&(console.log("Credits to maintain: "+a.creditsToMaintain),Memory.settings.creditsToMaintain=a.creditsToMaintain),void 0!==a.powerfocus&&void 0===Memory.settings.powerfocus&&(console.log("Focusing on power processing: "+a.powerfocus),Memory.settings.powerfocus=a.powerfocus))}catch(e){}r.loop=function(){t.run(),n.command.initCommands()}},function(e,r,o){function t(){return Game.cpu.bucket>9900?1.6*Game.cpu.limit:Game.cpu.bucket>9600?1.3*Game.cpu.limit:Game.cpu.bucket>9200?1.1*Game.cpu.limit:Game.cpu.bucket>8600?.9*Game.cpu.limit:Game.cpu.bucket>8e3?.8*Game.cpu.limit:Game.cpu.bucket>7e3?.7*Game.cpu.limit:.5*Game.cpu.limit}function n(e,r,o){var t=Game.cpu.getUsed(),n=void 0
if(e instanceof i.Manager)n=e.run(o)
else{for(var a=arguments.length,s=Array(a>3?a-3:0),l=3;l<a;l++)s[l-3]=arguments[l]
n=e.apply(void 0,s)}var m=Game.cpu.getUsed()-t
return Memory.stats["cpu.manager."+r+"."+o]=m,void 0===Memory.stats["cpu.manager."+r+".total"]?Memory.stats["cpu.manager."+r+".total"]=m:Memory.stats["cpu.manager."+r+".total"]+=m,n}function a(){var e=Object.keys(Game.spawns)
if(0!==e.length)return Game.spawns[e[0]].owner.username}o(2),o(21),o(23),o(24),o(25),o(26)
var i=o(14),s=o(27),l=o(28),m=o(30),u=o(36),y=o(37),v=o(41),c=o(58),d=o(47),f=o(59),g=o(68),R=o(72),p=o(78),h=o(83),E=o(89),S=o(92),T=o(97),C=o(86),O=o(111),M=o(113),_=o(114),b=o(116),w=o(119),N=o(48),A=o(85),U=o(121),k=o(124),I=o(126),L=o(127),P=o(128),x=o(132),G=o(135),B=o(136),D=o(137),H=o(138)
r.run=function(){n(function(){return Memory.stats={}},"ReadMemory",i.ManagerPriority.Critical),void 0===Memory.settings&&(Memory.settings={},Memory.settings.bot=!0),void 0===Memory.settings.creditsToMaintain&&(Memory.settings.creditsToMaintain=22e5),void 0===Memory.settings.loggingLevel&&(Memory.settings.loggingLevel=3),void 0===Memory.settings.user&&(Memory.settings.user=a())
var e=new G.CreepService,r=new B.RoomService,o=!0,W=!1,Y=void 0
try{for(var F,K=r.getMyRooms()[Symbol.iterator]();!(o=(F=K.next()).done);o=!0){var V=F.value
Memory.stats["room."+V.name+".energyHarvested"]=0,Memory.stats["room."+V.name+".energyUpgraded"]=0,Memory.stats["room."+V.name+".wallsRepaired"]=0,Memory.stats["room."+V.name+".creepCpu"]=0,Memory.stats["room."+V.name+".creepCost"]=0}}catch(e){W=!0,Y=e}finally{try{!o&&K.return&&K.return()}finally{if(W)throw Y}}var j=t(),X=[new s.MemoryManager,new l.IntelManager,new m.UpgradeManager(r,e),new u.InterfaceManager,new y.LogisticsManager(r,e),new v.ExpansionManager(r,e),new c.RoomlevelManager(r),new d.ScoutingManager(r,e),new f.OutpostManager(r,e),new g.MineralManager(r,e),new R.DefenseManager(r,e),new h.BoostManager(r,e),new E.OperationManager(r,e),new S.PraiseroomManager(r,e),new T.MilitaryManager(r,e),new C.MarketManager,new O.CrisisManager(r,e),new M.LinkManager(r),new w.MiningManager(r,e),new b.HaulingManager(r,e),new N.PowerManager(r,e),new A.TradeManager(r),new U.BuildManager(r,e),new k.MaintainenceManager(r,e),new I.RoadManager(r),new L.LabManager(r),new p.WallManager(r,e),new P.PoachingManager(r,e),new x.HarassManager(r,e)],Z=new _.SpawnManager(r),z=i.ManagerPriority.Critical,q=!0,J=!1,Q=void 0
try{for(var $,ee=X[Symbol.iterator]();!(q=($=ee.next()).done);q=!0){var re=$.value
n(re,re.constructor.name,i.ManagerPriority.Critical,i.ManagerPriority.Critical),re.constructor.name}}catch(e){J=!0,Q=e}finally{try{!q&&ee.return&&ee.return()}finally{if(J)throw Q}}var oe=!0,te=!1,ne=void 0
try{for(var ae,ie=X[Symbol.iterator]();!(oe=(ae=ie.next()).done);oe=!0){var se=ae.value
Game.cpu.getUsed()<j&&(n(se,se.constructor.name,i.ManagerPriority.Standard,i.ManagerPriority.Standard),se.constructor.name,z=i.ManagerPriority.Standard)}}catch(e){te=!0,ne=e}finally{try{!oe&&ie.return&&ie.return()}finally{if(te)throw ne}}var le=!0,me=!1,ue=void 0
try{for(var ye,ve=X[Symbol.iterator]();!(le=(ye=ve.next()).done);le=!0){var ce=ye.value
Game.cpu.getUsed()<j&&(n(ce,ce.constructor.name,i.ManagerPriority.Low,i.ManagerPriority.Low),ce.constructor.name,z=i.ManagerPriority.Low)}}catch(e){me=!0,ue=e}finally{try{!le&&ve.return&&ve.return()}finally{if(me)throw ue}}var de=!0,fe=!1,ge=void 0
try{for(var Re,pe=X[Symbol.iterator]();!(de=(Re=pe.next()).done);de=!0){var he=Re.value
Game.cpu.getUsed()<j&&(n(he,he.constructor.name,i.ManagerPriority.Trivial,i.ManagerPriority.Trivial),he.constructor.name,z=i.ManagerPriority.Trivial)}}catch(e){fe=!0,ge=e}finally{try{!de&&pe.return&&pe.return()}finally{if(fe)throw ge}}if(Game.cpu.bucket>9500){var Ee=!0,Se=!1,Te=void 0
try{for(var Ce,Oe=X[Symbol.iterator]();!(Ee=(Ce=Oe.next()).done);Ee=!0){var Me=Ce.value
Game.cpu.getUsed()<j&&(n(Me,Me.constructor.name,i.ManagerPriority.Overflow,i.ManagerPriority.Overflow),Me.constructor.name,z=i.ManagerPriority.Overflow)}}catch(e){Se=!0,Te=e}finally{try{!Ee&&Oe.return&&Oe.return()}finally{if(Se)throw Te}}}Game.cpu.getUsed()<j&&(z=6),n(Z,"SpawnManager",i.ManagerPriority.Critical),Memory.stats["cpu.level"]=z,!0!==Memory.settings.bot&&(n(D.recordStats,"Stats",i.ManagerPriority.Critical,r.getMyRooms()),H.saveStats()),delete Memory.stats}},function(e,r,o){var t=o(3)
StructureController.prototype.getContainerPosition=function(){if(void 0!==this.room.memory.controllerContainerPos){var e=this.room.memory.controllerContainerPos
return new RoomPosition(e.x,e.y,e.roomName)}var r=this.getPossibleContainerPositions()
if(0===r.length)return this.getOkeyContainerPosition()
if(1===r.length)return r[0]
var o=this.room.getSpawn()
if(o instanceof Spawn){var n=new RoomPosition(o.pos.x,o.pos.y+3,o.pos.roomName),a=[]
for(var i in r){var s=r[i]
a[i]=t.getDistanseBetween(s,n)}var l=void 0
for(var m in a)(void 0===l||a[parseInt(m)]<a[parseInt(l)])&&(l=m)
return void 0!==l?(this.room.memory.controllerContainerPos=r[parseInt(l)],r[parseInt(l)]):void 0}},StructureController.prototype.getPossibleContainerPositions=function(){for(var e=[],r=-2;r<3;r++)for(var o=-2;o<3;o++){var t=new RoomPosition(this.pos.x+r,this.pos.y+o,this.room.name)
2!==Math.abs(r)&&2!==Math.abs(o)||!t.hasFreeSpaceAround()||e.push(t)}return e},StructureController.prototype.getOkeyContainerPosition=function(){for(var e=void 0,r=0,o=-2;o<3;o++)for(var t=-2;t<3;t++){var n=new RoomPosition(this.pos.x+o,this.pos.y+t,this.room.name)
if(2===Math.abs(o)||2===Math.abs(t)){var a=n.getFreeSpaceAround();(void 0===n||r<a)&&(e=n,r=a)}}return e},StructureController.prototype.buildControllerContainer=function(){var e=this.getContainerPosition()
void 0!==e&&e.createConstructionSite(STRUCTURE_CONTAINER)},StructureController.prototype.buildControllerLink=function(){var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s.structureType===STRUCTURE_CONTAINER&&s.destroy()}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}e.createConstructionSite(STRUCTURE_LINK)}},StructureController.prototype.hasContainer=function(){var e=this.getContainerPosition()
if(void 0===e)return!1
var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_CONTAINER)return!0}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!1},StructureController.prototype.hasLink=function(){var e=this.getContainerPosition()
if(void 0===e)return!1
var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_LINK)return!0}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!1},StructureController.prototype.getContainer=function(){var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_CONTAINER)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}},StructureController.prototype.getContainerOrLink=function(){var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_CONTAINER||s.structureType===STRUCTURE_LINK)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}}},function(e,r,o){function t(e,r,o){var t={ignoreCreeps:!0,range:1,maxOps:4e4,obstacles:[]},n=[e.pos.roomName].concat(l.getAllOutposts(Game.rooms[e.pos.roomName]))
return PathFinder.search(e.pos,{pos:r.pos,range:t.range},{maxOps:t.maxOps,plainCost:2,roomCallback:function(e){return!(n&&!_.contains(n,e))&&o(e)},swampCost:3}).path}function n(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=Game.rooms[e],t=new PathFinder.CostMatrix
if(!0!==r){var n=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(e),a=n[1]%10,m=n[2]%10
if(!(5===a&&5===m)&&a>=4&&a<=6&&m>=4&&m<=6){var u=void 0,y=void 0,v=void 0
for(u=0;u<50;u++)for(y=0;y<50;y++)"plain"!==(v=Game.map.getTerrainAt(u,y,e))&&"swamp"!==v||t.set(u,y,254)
return t}}var c=void 0,d=void 0,f=void 0
for(c=0;c<50;c++)for(d=0;d<50;d++)"plain"===(f=Game.map.getTerrainAt(c,d,e))?t.set(c,d,2):"swamp"===f&&t.set(c,d,3)
if(!o)return t
if(!0===r&&o.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR}}).forEach(function(r){var o=void 0,n=void 0,a=void 0
for(o=-2;o<3;o++)for(n=-2;n<3;n++)"plain"!==(a=Game.map.getTerrainAt(r.pos.x+o,r.pos.y+n,e))&&"swamp"!==a||t.set(r.pos.x+o,r.pos.y+n,12)}),o.find(FIND_SOURCES).forEach(function(r){var o=r.pos,n=r.getContainerPosition()
void 0!==n&&(o=n)
var a=void 0,i=void 0,s=void 0
for(a=-1;a<2;a++)for(i=-1;i<2;i++)"plain"!==(s=Game.map.getTerrainAt(o.x+a,o.y+i,e))&&"swamp"!==s||t.set(o.x+a,o.y+i,8)}),o.find(FIND_MINERALS).forEach(function(r){var o=r.pos,n=r.getContainerPosition()
void 0!==n&&(o=n)
var a=void 0,i=void 0,s=void 0
for(a=-1;a<2;a++)for(i=-1;i<2;i++)"plain"!==(s=Game.map.getTerrainAt(o.x+a,o.y+i,e))&&"swamp"!==s||t.set(o.x+a,o.y+i,8)}),o.find(FIND_STRUCTURES).forEach(function(r){if(r.structureType===STRUCTURE_ROAD)t.set(r.pos.x,r.pos.y,1)
else if(r.structureType===STRUCTURE_CONTROLLER){var o=r.pos,n=r.getContainerPosition()
void 0!==n&&(o=n)
var a=void 0,i=void 0,s=void 0
for(a=-1;a<2;a++)for(i=-1;i<2;i++)"plain"!==(s=Game.map.getTerrainAt(o.x+a,o.y+i,e))&&"swamp"!==s||t.set(o.x+a,o.y+i,8)}else r.structureType===STRUCTURE_CONTAINER||r.structureType===STRUCTURE_RAMPART&&r instanceof OwnedStructure&&r.my||t.set(r.pos.x,r.pos.y,255)}),void 0!==o.controller&&o.controller.my&&o.memory.t===s.Roomtype.Normal){var g=l.getBasePosition(o)
if(void 0!==g){if(!0===Memory.settings.bot){var R=i.getExtensionPositions(o,g),p=!0,h=!1,E=void 0
try{for(var S,T=R[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value
t.set(C.x,C.y,254)}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}}t.set(g.x-2,g.y+1,254),t.set(g.x-3,g.y+2,254),t.set(g.x-3,g.y+3,254),t.set(g.x-2,g.y+2,254),t.set(g.x+2,g.y+1,254),t.set(g.x+3,g.y+2,254),t.set(g.x+3,g.y+3,254),t.set(g.x+2,g.y+2,254),t.set(g.x-1,g.y-1,254),t.set(g.x+1,g.y-1,254),t.set(g.x,g.y+2,254),t.set(g.x,g.y+3,254),t.set(g.x-1,g.y+4,254),t.set(g.x+1,g.y+4,254),t.set(g.x-2,g.y+5,254),t.set(g.x-1,g.y+5,254),t.set(g.x,g.y+5,254),t.set(g.x+1,g.y+5,254),t.set(g.x+2,g.y+5,254),t.set(g.x-2,g.y+6,254),t.set(g.x-1,g.y+6,254),t.set(g.x,g.y+6,254),t.set(g.x+1,g.y+6,254),t.set(g.x+2,g.y+6,254),t.set(g.x-1,g.y+7,254),t.set(g.x,g.y+7,254),t.set(g.x+1,g.y+7,254)}}return t}function a(e){return n(e,!0)}var i=o(4),s=o(9),l=o(10)
r.getDistanseBetween=function(e,r){return PathFinder.search(e,{pos:r,range:1}).path.length-1},r.getKitingRoomCallback=function(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType===STRUCTURE_ROAD?o.set(e.pos.x,e.pos.y,2):e.structureType===STRUCTURE_CONTAINER||e.structureType===STRUCTURE_RAMPART&&e instanceof OwnedStructure&&e.my||o.set(e.pos.x,e.pos.y,255)}),r.find(FIND_HOSTILE_CREEPS,{filter:function(e){return e.getActiveBodyparts(ATTACK)>0||e.getActiveBodyparts(RANGED_ATTACK)>0||e.getActiveBodyparts(HEAL)>0}}).forEach(function(e){for(var r=-3;r<4;r++)for(var t=-3;t<4;t++)o.set(e.pos.x,e.pos.y,10),Math.abs(r)<3&&Math.abs(t)<3&&o.set(e.pos.x,e.pos.y,20)}),r.find(FIND_CREEPS).forEach(function(e){o.set(e.pos.x,e.pos.y,255)}),o},r.getOffroadRoomCallback=function(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType===STRUCTURE_ROAD?o.set(e.pos.x,e.pos.y,20):e.structureType===STRUCTURE_CONTAINER||e.structureType===STRUCTURE_RAMPART&&e instanceof OwnedStructure&&e.my||o.set(e.pos.x,e.pos.y,255)}),r.find(FIND_CREEPS).forEach(function(e){o.set(e.pos.x,e.pos.y,255)}),o},r.getRoadPathBetween=function(e,r){var o=n
arguments.length>2&&void 0!==arguments[2]&&arguments[2]&&(o=a)
var i=t({pos:e},{pos:r},o)
return void 0===i?(console.log("Problem with roadBuilding between "+e+" and "+r),[]):i},r.getRoomCallbackForRoadbuilding=n,r.getRoomCallbackForRoadbuildingSKallowed=a},function(e,r,o){function t(e){var r=[],o=[]
u(e,o,r),o=_.uniq(o)
var t=!0,a=!1,i=void 0
try{for(var l,y=r[Symbol.iterator]();!(t=(l=y.next()).done);t=!0){var v=l.value
_.pull(o,v)}}catch(e){a=!0,i=e}finally{try{!t&&y.return&&y.return()}finally{if(a)throw i}}o.length<60&&m(e,o,r),o=_.uniq(o)
var c=!0,d=!1,f=void 0
try{for(var g,R=r[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
_.pull(o,p)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}return s(e,o),o.length>60?o=o.slice(0,60):o.length<60&&n(e,o),{ext:o,roads:r}}function n(e,r){var o=new PathFinder.CostMatrix,t=!0,n=!1,s=void 0
try{for(var l,m=_.range(0,50)[Symbol.iterator]();!(t=(l=m.next()).done);t=!0){var u=l.value,y=!0,v=!1,f=void 0
try{for(var g,R=_.range(0,50)[Symbol.iterator]();!(y=(g=R.next()).done);y=!0){var p=g.value
"wall"===Game.map.getTerrainAt(u,p,e.roomName)?o.set(u,p,1):(u<3||u>46||p<3||p>46)&&o.set(u,p,1)}}catch(e){v=!0,f=e}finally{try{!y&&R.return&&R.return()}finally{if(v)throw f}}}}catch(e){n=!0,s=e}finally{try{!t&&m.return&&m.return()}finally{if(n)throw s}}var h=!0,E=!1,S=void 0
try{for(var T,C=_.range(-3,4)[Symbol.iterator]();!(h=(T=C.next()).done);h=!0){var O=T.value,M=!0,b=!1,w=void 0
try{for(var N,A=_.range(-1,6)[Symbol.iterator]();!(M=(N=A.next()).done);M=!0){var U=N.value
o.set(e.x+O,e.y+U,1)}}catch(e){b=!0,w=e}finally{try{!M&&A.return&&A.return()}finally{if(b)throw w}}}}catch(e){E=!0,S=e}finally{try{!h&&C.return&&C.return()}finally{if(E)throw S}}var k=!0,I=!1,L=void 0
try{for(var P,x=_.range(-2,3)[Symbol.iterator]();!(k=(P=x.next()).done);k=!0){var G=P.value
o.set(e.x+G,e.y+6,1)}}catch(e){I=!0,L=e}finally{try{!k&&x.return&&x.return()}finally{if(I)throw L}}var B=!0,D=!1,H=void 0
try{for(var W,Y=_.range(-1,2)[Symbol.iterator]();!(B=(W=Y.next()).done);B=!0){var F=W.value
o.set(e.x+F,e.y+7,1)}}catch(e){D=!0,H=e}finally{try{!B&&Y.return&&Y.return()}finally{if(D)throw H}}var K=!0,V=!1,j=void 0
try{for(var X,Z=r[Symbol.iterator]();!(K=(X=Z.next()).done);K=!0){var z=X.value.split("-")
o.set(Number.parseInt(z[0]),Number.parseInt(z[1]),1)}}catch(e){V=!0,j=e}finally{try{!K&&Z.return&&Z.return()}finally{if(V)throw j}}var q=[],J=!0,Q=!1,$=void 0
try{for(var ee,re=_.range(3,47)[Symbol.iterator]();!(J=(ee=re.next()).done);J=!0){var oe=ee.value,te=!0,ne=!1,ae=void 0
try{for(var ie,se=_.range(3,47)[Symbol.iterator]();!(te=(ie=se.next()).done);te=!0){var le=ie.value
if(0===o.get(oe,le)&&oe%2==le%2&&i(oe,le,o)&&!_.contains(r,c(oe,le,e.roomName))){var me=new RoomPosition(oe,le,e.roomName)
a(me)>2&&q.push(me)}}}catch(e){ne=!0,ae=e}finally{try{!te&&se.return&&se.return()}finally{if(ne)throw ae}}}}catch(e){Q=!0,$=e}finally{try{!J&&re.return&&re.return()}finally{if(Q)throw $}}for(var ue=50;r.length<60&&ue>0&&q.length>0;){var ye=e.findClosestByRange(q)
r.push(d(ye)),_.pull(q,ye),ue--}}function a(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=g.sourceIds(e.roomName)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r.push(g.sourcePos(e.roomName,s))}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var l=g.mineralPos(e.roomName)
void 0!==l&&r.push(l)
var m=g.controllerPos(e.roomName)
null!==m&&r.push(m)
var u=10,y=!0,v=!1,c=void 0
try{for(var d,f=r[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var R=d.value,p=e.getRangeTo(R)
p<u&&(u=p)}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}return u}function i(e,r,o){return(1!==o.get(e-1,r)||1!==o.get(e+1,r))&&(1!==o.get(e,r-1)||1!==o.get(e,r+1))}function s(e,r){var o=e.roomName
if(g.hasIntel(o)){var t=[],n=!0,a=!1,i=void 0
try{for(var s,m=g.sourceIds(o)[Symbol.iterator]();!(n=(s=m.next()).done);n=!0){var u=s.value
t.push(g.sourcePos(o,u))}}catch(e){a=!0,i=e}finally{try{!n&&m.return&&m.return()}finally{if(a)throw i}}var y=g.controllerPos(o)
null!==y&&t.push(y)
var v=g.mineralPos(o)
void 0!==v&&t.push(v)
var c=l(r),f=!0,R=!1,p=void 0
try{for(var h,E=t[Symbol.iterator]();!(f=(h=E.next()).done);f=!0){var S=h.value,T=PathFinder.search(e,{pos:S,range:1},{plainCost:1,swampCost:1,roomCallback:function(){return c},maxRooms:1})
if(T.cost>200){var C=!0,O=!1,M=void 0
try{for(var b,w=T.path[Symbol.iterator]();!(C=(b=w.next()).done);C=!0){var N=b.value
_.pull(r,d(N))}}catch(e){O=!0,M=e}finally{try{!C&&w.return&&w.return()}finally{if(O)throw M}}}}}catch(e){R=!0,p=e}finally{try{!f&&E.return&&E.return()}finally{if(R)throw p}}}}function l(e){var r=new PathFinder.CostMatrix,o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value.split("-")
r.set(Number.parseInt(s[0]),Number.parseInt(s[1]),254)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}function m(e,r,o){for(var t=[-1,1],n=0;n<t.length;n++){var i=t[n]
o.push(c(e.x+3*i,e.y+1,e.roomName)),o.push(c(e.x+4*i,e.y+2,e.roomName))
for(var s=[5,6],l=0;l<s.length;l++){var m=s[l],u=new RoomPosition(e.x+i*m,e.y-2+m,e.roomName)
if(!(y(u)&&a(u)>3))break
o.push(d(u)),v(u,r)}var f=Game.map.getTerrainAt(e.x+4*i,e.y+1,e.roomName)
"swamp"!==f&&"plain"!==f||e.x+4*i<3||e.x+4*i>46||e.y+1<3||e.y+1>46||r.push(c(e.x+4*i,e.y+1,e.roomName))
var g=Game.map.getTerrainAt(e.x+5*i,e.y+1,e.roomName)
"swamp"!==g&&"plain"!==g||e.x+5*i<3||e.x+5*i>46||e.y+1<3||e.y+1>46||r.push(c(e.x+5*i,e.y+1,e.roomName))}}function u(e,r,o){o.push(c(e.x,e.y-1,e.roomName))
for(var t=[-1,1],n=0;n<t.length;n++){var i=t[n]
o.push(c(e.x+1*i,e.y-2,e.roomName))
for(var s=[2,3,4],l=0;l<s.length;l++){var m=s[l],u=new RoomPosition(e.x+i*m,e.y-1-m,e.roomName)
if(!(y(u)&&a(u)>3))break
if(o.push(d(u)),v(u,r),4===m)for(var f=[-1,1],g=0;g<f.length;g++)for(var R=f[g],p=[1,2],h=0;h<p.length;h++){var E=p[h],S=new RoomPosition(u.x+i*R*E,u.y+R*E,u.roomName)
if(!(y(S)&&a(u)>3))break
o.push(d(S)),v(S,r)}}var T=Game.map.getTerrainAt(e.x+3*i,e.y-1,e.roomName)
"swamp"!==T&&"plain"!==T||r.push(c(e.x+3*i,e.y-1,e.roomName))}}function y(e){for(var r=0,o=[-1,0,1],t=0;t<o.length;t++)for(var n=o[t],a=[-1,0,1],i=0;i<a.length;i++){var s=a[i]
if(e.x+n<3||e.x+n>46||e.y+s<3||e.y+s>46)return!1
var l=Game.map.getTerrainAt(e.x+n,e.y+s,e.roomName)
if("swamp"!==l&&"plain"!==l){if(0===n&&0===s)return!1
if(r>2)return!1
r++}}return!0}function v(e,r){for(var o=[-1,0,1],t=0;t<o.length;t++)for(var n=o[t],a=[-1,0,1],i=0;i<a.length;i++){var s=a[i]
if(0!==n||0!==s){var l=Game.map.getTerrainAt(e.x+n,e.y+s,e.roomName)
"swamp"!==l&&"plain"!==l||r.push(c(e.x+n,e.y+s,e.roomName))}}}function c(e,r,o){return e+"-"+r+"-"+o}function d(e){return e.x+"-"+e.y+"-"+e.roomName}function f(e){var r=e.split("-")
return new RoomPosition(+r[0],+r[1],r[2])}var g=o(5)
r.simExtensions=function(e){var r=Game.cpu.getUsed(),o=t(e)
console.log("Extensionmath: "+(Game.cpu.getUsed()-r)),console.log("Number of extensions: "+o.ext.length)
var n=!0,a=!1,i=void 0
try{for(var s,l=o.ext[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=f(s.value)
new RoomVisual(m.roomName).rect(m.x-.5,m.y-.5,1,1)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}var u=!0,y=!1,v=void 0
try{for(var c,d=o.roads[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var g=f(c.value)
new RoomVisual(g.roomName).rect(g.x-.5,g.y-.5,1,1,{fill:"#0000FF"})}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}new RoomVisual(e.roomName).rect(e.x-3.5,e.y-1.5,7,7,{fill:"#FFFF00"}),new RoomVisual(e.roomName).rect(e.x-2.5,e.y+5.5,5,1,{fill:"#FFFF00"}),new RoomVisual(e.roomName).rect(e.x-1.5,e.y+6.5,3,1,{fill:"#FFFF00"})},r.getExtensionPositions=function(e,r){if(void 0===e.memory.extPos||void 0===e.memory.extRoads){var o=t(r)
e.memory.extPos=JSON.stringify(o.ext),e.memory.extRoads=JSON.stringify(o.roads)}var n=JSON.parse(e.memory.extPos),a=[],i=!0,s=!1,l=void 0
try{for(var m,u=n[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
a.push(f(y))}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return a},r.getRoadPositions=function(e,r){if(void 0===e.memory.extRoads||void 0===e.memory.extRoads){var o=t(r)
e.memory.extPos=JSON.stringify(o.ext),e.memory.extRoads=JSON.stringify(o.roads)}var n=JSON.parse(e.memory.extRoads),a=[],i=!0,s=!1,l=void 0
try{for(var m,u=n[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
a.push(f(y))}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return a},r.getRoomExtensionPositions=t},function(e,r,o){function t(e,r){var o=r.split("-")
return 2===o.length?new RoomPosition(+o[0],+o[1],e):(c.log.error("IntelLib had to make a fake sourcepos for sourceinfo: "+r,e),new RoomPosition(25,25,e))}function n(e,r){var o=r.split("-")
return 3===o.length?new RoomPosition(+o[1],+o[2],e):(c.log.error("IntelLib had to make a fake controllerpos: "+r,e),new RoomPosition(25,25,e))}function a(e){var r=e.split("-")
return 3===r.length?r[0]:(c.log.error("IntelLib had to make a fake controllerid: "+e,""),"")}function i(e){var r={},o=e.find(FIND_SOURCES)
if(o.length>0){var t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
r[l.id]=l.pos.x+"-"+l.pos.y}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}return r}function s(e){var r=e.find(FIND_MINERALS)
if(r.length>0)return r[0].id+"-"+r[0].mineralType+"-"+r[0].pos.x+"-"+r[0].pos.y}function l(e,r){if(void 0!==e.controller){if(Memory.empire.hostileRooms[e.name]=void 0,e.controller.level>=1&&!e.controller.my)return void 0===Memory.empire||void 0===Memory.empire.hostileRooms||_.contains(Object.keys(Memory.empire.hostileRooms),e.name)||(Memory.empire.hostileRooms[e.name]=e.controller.level),v.Hostility.Controlled
if(void 0!==e.controller.reservation&&void 0!==e.controller.reservation.username&&e.controller.reservation.username!==Memory.settings.user&&e.controller.reservation.ticksToEnd>0)return v.Hostility.Reserved}if(r.length>0){var o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if("Invader"!==s.owner.username&&"Source Keeper"!==s.owner.username&&m(s))return v.Hostility.Hostiles
if("Invader"===s.owner.username)return v.Hostility.Invaders}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return v.Hostility.None}function m(e){return e.getActiveBodyparts(ATTACK)>0||e.getActiveBodyparts(RANGED_ATTACK)>0}function u(e,r){if(void 0!==e.controller&&0!==r.length&&(e.controller.my||void 0!==e.controller.reservation&&void 0!==e.controller.reservation.username&&e.controller.reservation.username===Memory.settings.user)){var o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s.body.length>1&&"Invader"!==s.owner.username&&"Source Keeper"!==s.owner.username&&(e.controller.my?s.body.length>10?void 0!==s.body[0].boost?y(s.owner.username,30):y(s.owner.username,10):y(s.owner.username,5):s.body.length>10?y(s.owner.username,2):y(s.owner.username,1))}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}}function y(e,r){void 0===Memory.playerthreat&&(Memory.playerthreat={}),void 0===Memory.playerthreat[e]?Memory.playerthreat[e]=r:Memory.playerthreat[e]+=r}var v=o(6),c=o(7)
r.needsNewIntel=function(e){return void 0===Memory.rooms[e]||void 0===Memory.rooms[e].i||void 0===Memory.rooms[e].i.t||Memory.rooms[e].i.t+2e4<Game.time},r.hasIntel=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i},r.hasInvaders=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.h===v.Hostility.Invaders},r.hasHostiles=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.h>v.Hostility.None},r.isOccupied=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.h>=v.Hostility.Reserved},r.towerCount=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.towers?Memory.rooms[e].i.towers:0},r.isInsafeMode=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.t&&void 0!==Memory.rooms[e].i.safeMode&&Memory.rooms[e].i.t+Memory.rooms[e].i.safeMode>Game.time},r.isOwned=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.h>=v.Hostility.Controlled},r.roomHostility=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.h?Memory.rooms[e].i.h:v.Hostility.None},r.roomLevel=function(e){if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.l)return Memory.rooms[e].i.l},r.isReservedByMe=function(e){return!!(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.my&&Memory.rooms[e].i.res>0)},r.isReservedByMeFor=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&Memory.rooms[e].i.my&&Memory.rooms[e].i.res>0?Memory.rooms[e].i.res:0},r.isOwnedByMe=function(e){return!(void 0===Memory.rooms[e]||void 0===Memory.rooms[e].i||!Memory.rooms[e].i.my||void 0!==Memory.rooms[e].i.res)},r.sourceCount=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.s?Object.keys(Memory.rooms[e].i.s).length:0},r.sourceIds=function(e){var r=[]
if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.s){var o=!0,t=!1,n=void 0
try{for(var a,i=Object.keys(Memory.rooms[e].i.s)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r.push(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return r},r.mineralType=function(e){if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.m){var r=Memory.rooms[e].i.m.split("-")
if(4===r.length)return r[1]}},r.mineralPos=function(e){if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.m){var r=Memory.rooms[e].i.m.split("-")
if(4===r.length)return new RoomPosition(r[2],r[3],e)}},r.sourcePos=function(e,r){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.s&&void 0!==Memory.rooms[e].i.s[r]?t(e,Memory.rooms[e].i.s[r]):(c.log.error("IntelLib had to make a fake sourcepos for source "+r,e),new RoomPosition(25,25,e))},r.controllerPos=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.c?n(e,Memory.rooms[e].i.c):null},r.controllerId=function(e){return void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.c?a(Memory.rooms[e].i.c):null},r.mineralTicks=function(e){if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.mtime)return Memory.rooms[e].i.mtime},r.intelTime=function(e){if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.t)return Memory.rooms[e].i.t},r.saveIntelForRoom=function(e){var r=e.find(FIND_HOSTILE_CREEPS)
void 0===e.memory.i&&(e.memory.i={}),e.memory.i.t=Game.time,e.memory.i.h=l(e,r),!0===Memory.settings.bot&&u(e,r),void 0!==e.controller&&(e.memory.i.c=e.controller.id+"-"+e.controller.pos.x+"-"+e.controller.pos.y,void 0===e.controller.reservation||void 0===e.controller.reservation.username||e.controller.reservation.username===Memory.settings.user||e.controller.my?e.memory.i.o=void 0:e.memory.i.o=e.controller.reservation.username,e.controller.level>=1&&!e.controller.my?e.memory.i.l=e.controller.level:e.memory.i.l=void 0,e.controller.level>=3&&!e.controller.my?e.memory.i.towers=e.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER}}).length:e.memory.i.towers=void 0,void 0!==e.controller.reservation&&e.controller.reservation.username===Memory.settings.user||e.controller.my?e.memory.i.my=!0:e.memory.i.my=void 0,void 0===e.controller.reservation||e.controller.reservation.username!==Memory.settings.user||e.controller.my?e.memory.i.res=void 0:e.memory.i.res=e.controller.reservation.ticksToEnd,e.controller.safeMode?e.memory.i.safeMode=e.controller.safeMode:e.memory.i.safeMode=void 0)
var o=e.getMineral()
void 0!==o&&(e.memory.i.mtime=o.ticksToRegeneration),void 0===e.memory.i.s&&(e.memory.i.s=i(e)),void 0===e.memory.i.m&&(e.memory.i.m=s(e))}},function(e,r){!function(e){e[e.None=0]="None",e[e.Invaders=1]="Invaders",e[e.Hostiles=2]="Hostiles",e[e.Reserved=3]="Reserved",e[e.Controlled=4]="Controlled"}(r.Hostility||(r.Hostility={}))
r.Hostility},function(e,r,o){var t=o(8),n=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"setLogLevel",value:function(e){Memory.settings.loggingLevel=e}},{key:"_log",value:function(e,r,o){var t=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"#ffffff"
o<=Memory.settings.loggingLevel&&console.log("<span style='color:"+t+"'><a href='#!/room/"+r+"'>"+r+"</a> "+e+"</span>")}},{key:"debug",value:function(e,r){this._log(e,r,t.LogLevel.DEBUG,"#6e6770")}},{key:"info",value:function(e,r){this._log(e,r,t.LogLevel.INFO)}},{key:"warning",value:function(e,r){this._log(e,r,t.LogLevel.WARN,"#f4c542")}},{key:"error",value:function(e,r){this._log(e,r,t.LogLevel.ERROR,"#e50000")}},{key:"alert",value:function(e,r){this._log(e,r,t.LogLevel.ALERT,"#ff00d0")}}]),e}()
r.Logger=n,r.log=new n},function(e,r){!function(e){e[e.ALERT=1]="ALERT",e[e.ERROR=2]="ERROR",e[e.WARN=3]="WARN",e[e.INFO=4]="INFO",e[e.DEBUG=5]="DEBUG"}(r.LogLevel||(r.LogLevel={}))
r.LogLevel},function(e,r){!function(e){e[e.Normal=1]="Normal",e[e.Beachhead=2]="Beachhead",e[e.Praiseroom=3]="Praiseroom",e[e.Decoration=4]="Decoration",e[e.NormalAndNotExpansion=101]="NormalAndNotExpansion",e[e.NormalWithExpansion=102]="NormalWithExpansion",e[e.NormalWithDismantleTarget=103]="NormalWithDismantleTarget",e[e.NormalWithAcceleratedPraising=104]="NormalWithAcceleratedPraising",e[e.Expanion=105]="Expanion",e[e.My=106]="My",e[e.NormalWithPraiseroom=107]="NormalWithPraiseroom",e[e.BeingAbandoned=108]="BeingAbandoned",e[e.NormalNotAbandoned=109]="NormalNotAbandoned",e[e.NormalUnderSiege=110]="NormalUnderSiege"}(r.Roomtype||(r.Roomtype={}))
r.Roomtype},function(e,r,o){function t(e){var r=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(e)
if(_.isNull(r)||_.isNull(r[1])||_.isNull(r[1]))return!1
var o=r[1]%10,t=r[2]%10
return o>=4&&o<=6&&t>=4&&t<=6}function n(e){return e.x+"-"+e.y}function a(e,r){var o=e.split("-")
return new RoomPosition(+o[0],+o[1],r)}var i=o(7),s=o(11),l=o(9),m=o(12)
r.getBasePosition=function(e){if(void 0!==e.memory.b)return a(e.memory.b,e.name)
if(Memory.settings.bot){var r=m.findSpawnLocation(e.name,!0)
if(void 0!==r)return m.createSpawnmoveOperation(e,r.pos),e.memory.b=n(r.pos),r.pos}var o=e.find(FIND_MY_SPAWNS)
return o.length>0?(e.memory.b=n(o[0].pos),o[0].pos):void 0},r.setBasePosition=function(e,r){void 0===Memory.rooms[e]&&(Memory.rooms[e]={}),Memory.rooms[e].b=n(r)},r.roomShouldBuild=function(e){return e.memory.t===l.Roomtype.Normal&&!0!==e.memory.isBeingDismantled&&(void 0===e.storage||!e.storage.isActive()||e.storage.store[RESOURCE_ENERGY]>2e4)},r.getRoomLevel=function(e){return e.memory.l},r.setRoomLevel=function(e,r){i.log.alert("Roomlevel changed to: "+s.RoomLevel[r],e.name),e.memory.l=r},r.hasOutpost=function(e,r){return _.contains(e.memory.outposts,r)},r.getAllOutposts=function(e){return void 0===e.memory.outposts?[]:e.memory.outposts},r.getAllOutpostsInAllRooms=function(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r=r.concat(s.memory.outposts)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r},r.getAllPoachroomsInAllRooms=function(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r=r.concat(s.memory.poaching)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r},r.getOwnerOfOutpost=function(e,r){var o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(void 0!==s.memory.outposts&&_.contains(s.memory.outposts,e))return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}},r.getBasicOutposts=function(e){var r=[]
if(void 0===e.memory.outposts)return r
var o=!0,n=!1,a=void 0
try{for(var i,s=e.memory.outposts[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
t(l)||r.push(l)}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}return r},r.getLairOutposts=function(e){var r=[]
if(void 0===e.memory.outposts)return r
var o=!0,n=!1,a=void 0
try{for(var i,s=e.memory.outposts[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
t(l)&&r.push(l)}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}return r},r.getLastIndex=function(){var e=1
for(var r in Game.rooms){var o=Game.rooms[r]
void 0!==o.controller&&!0===o.controller.my&&void 0!==o.memory.index&&e<o.memory.index&&(e=o.memory.index)}return e},r.getRoomForIndex=function(e){for(var r in Game.rooms){var o=Game.rooms[r]
if(void 0!==o.controller&&!0===o.controller.my&&o.memory.index===e)return o}},r.getIndex=function(e){if(void 0!==e.memory.index)return e.memory.index
var r=[]
for(var o in Game.rooms){var t=Game.rooms[o]
void 0!==t.controller&&!0===t.controller.my&&r.push(t)}for(var n=_.map(r,function(e){return e.memory.index}),a=1;a<100;){if(!_.contains(n,a))return e.memory.index=a,a
a++}return i.log.error("Error assigning roomindex to room.",e.name),0},r.isMiddleRoom=t,r.isSKRoom=function(e){var r=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(e)
if(_.isNull(r)||_.isNull(r[1])||_.isNull(r[1]))return!1
var o=r[1]%10,t=r[2]%10
return!(5===o&&5===t)&&o>=4&&o<=6&&t>=4&&t<=6},r.isPortalRoom=function(e){var r=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(e)
if(_.isNull(r)||_.isNull(r[1])||_.isNull(r[1]))return!1
var o=r[1]%10,t=r[2]%10
return 5===o&&5===t},r.getClosestPortalroom=function(e){var r=/^([WE])([0-9]+)([NS])([0-9]+)$/.exec(e),o=10*Math.floor(r[2]/10)+5,t=10*Math.floor(r[4]/10)+5
return r[1]+o+r[3]+t}},function(e,r){!function(e){e[e.BasicColony=0]="BasicColony",e[e.BasicColonyReadyForExpansion=1]="BasicColonyReadyForExpansion",e[e.SimpleColony=2]="SimpleColony",e[e.SimpleColonyReadyForExpansion=3]="SimpleColonyReadyForExpansion",e[e.DefendedColony=4]="DefendedColony",e[e.DefendedColonyReadyForExpansion=5]="DefendedColonyReadyForExpansion",e[e.CivilizedColony=6]="CivilizedColony",e[e.CivilizedColonyReadyForExpansion=7]="CivilizedColonyReadyForExpansion",e[e.AdvancedColony=8]="AdvancedColony",e[e.AdvancedColonyReadyForExpansion=9]="AdvancedColonyReadyForExpansion",e[e.Town=10]="Town",e[e.TownReadyForExpansion=11]="TownReadyForExpansion",e[e.City=12]="City",e[e.CityReadyForExpansion=13]="CityReadyForExpansion",e[e.Metropolis=14]="Metropolis"}(r.RoomLevel||(r.RoomLevel={}))
r.RoomLevel},function(e,r,o){function t(e,r){var o=Game.rooms[e]
if(void 0===o)return r
var t=o.getSpawn()
if(void 0===t)return r
var n=[],a=!0,i=!1,s=void 0
try{for(var l,m=r[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value
u.x===t.pos.x&&(u.y===t.pos.y||u.y===t.pos.y-1)||u.x===t.pos.x-2&&u.y===t.pos.y+1?console.log("Filtered out tricky position from possible basepositions"):n.push(u)}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return n}function n(e,r){if(r.length<1)return console.log("ERROR: Trying to choose among zero spawnpositions in room "+e),new RoomPosition(25,25,e)
var o=r[0],t=a(e,o),n=!0,i=!1,s=void 0
try{for(var l,m=r[Symbol.iterator]();!(n=(l=m.next()).done);n=!0){var u=l.value,y=a(e,u)
y<t&&(o=u,t=y)}}catch(e){i=!0,s=e}finally{try{!n&&m.return&&m.return()}finally{if(i)throw s}}return o}function a(e,r){if(!l.hasIntel(e))return 100
var o=0,t=!0,n=!1,a=void 0
try{for(var i,s=l.sourceIds(e)[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var m=i.value
o+=r.getRangeTo(l.sourcePos(e,m))}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var u=l.controllerPos(e)
return null!==u&&(o+=r.getRangeTo(u)),o}function i(e,r){var o=[]
if(!l.hasIntel(e))return r
var t=[],n=!0,a=!1,i=void 0
try{for(var s,m=l.sourceIds(e)[Symbol.iterator]();!(n=(s=m.next()).done);n=!0){var u=s.value
t.push(l.sourcePos(e,u))}}catch(e){a=!0,i=e}finally{try{!n&&m.return&&m.return()}finally{if(a)throw i}}var y=l.mineralPos(e)
void 0!==y&&t.push(y)
var v=!0,c=!1,d=void 0
try{for(var f,g=r[Symbol.iterator]();!(v=(f=g.next()).done);v=!0){var R=f.value,p=!0,h=!0,E=!1,S=void 0
try{for(var T,C=t[Symbol.iterator]();!(h=(T=C.next()).done);h=!0){var O=T.value
R.getRangeTo(O)<6&&(p=!1)}}catch(e){E=!0,S=e}finally{try{!h&&C.return&&C.return()}finally{if(E)throw S}}var M=l.controllerPos(e)
null!==M&&R.getRangeTo(M)<8&&(p=!1),p&&o.push(R)}}catch(e){c=!0,d=e}finally{try{!v&&g.return&&g.return()}finally{if(c)throw d}}return o}var s=o(13),l=o(5),m=o(15)
r.createSpawnmoveOperation=function(e,r){var o=new s.Data
return o.operationtype=m.OperationType.Spawnmove,o.roomName=e.name,o.victoryCondition=s.VictoryCondition.Spawnmoved,o.victoryValue=r,void 0===Memory.operations&&(Memory.operations=[]),Memory.operations.push(o),console.log("Starting a operation to move the spawn in room "+e.name+". It will start when we have a storage at RCL 4."),!0},r.findSpawnLocation=function(e){for(var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=new PathFinder.CostMatrix,a=[0,1,2,47,48,49],s=0;s<a.length;s++){var l=a[s],m=!0,u=!1,y=void 0
try{for(var v,c=_.range(0,50)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
o.set(l,d,1)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}for(var f=[0,1,2,47,48,49],g=0;g<f.length;g++){var R=f[g],p=!0,h=!1,E=void 0
try{for(var S,T=_.range(3,57)[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value
o.set(C,R,1)}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}}var O=!0,M=!1,b=void 0
try{for(var w,N=_.range(3,47)[Symbol.iterator]();!(O=(w=N.next()).done);O=!0){var A=w.value,U=!0,k=!1,I=void 0
try{for(var L,P=_.range(3,47)[Symbol.iterator]();!(U=(L=P.next()).done);U=!0){var x=L.value
"wall"===Game.map.getTerrainAt(A,x,e)&&o.set(A,x,1)}}catch(e){k=!0,I=e}finally{try{!U&&P.return&&P.return()}finally{if(k)throw I}}}}catch(e){M=!0,b=e}finally{try{!O&&N.return&&N.return()}finally{if(M)throw b}}for(var G=0,B=1;G<25;){G++
var D=!0,H=!1,W=void 0
try{for(var Y,F=_.range(1,49)[Symbol.iterator]();!(D=(Y=F.next()).done);D=!0){var K=Y.value,V=!0,j=!1,X=void 0
try{for(var Z,z=_.range(1,49)[Symbol.iterator]();!(V=(Z=z.next()).done);V=!0){var q=Z.value
if(o.get(K,q)===G)for(var J=[-1,0,1],Q=0;Q<J.length;Q++)for(var $=J[Q],ee=[-1,0,1],re=0;re<ee.length;re++){var oe=ee[re]
0===o.get(K+$,q+oe)&&(o.set(K+$,q+oe,G+1),B=G+1)}}}catch(e){j=!0,X=e}finally{try{!V&&z.return&&z.return()}finally{if(j)throw X}}}}catch(e){H=!0,W=e}finally{try{!D&&F.return&&F.return()}finally{if(H)throw W}}}if(B<5&&!r)console.log("Did not find a spawnposition for room "+e)
else{var te=[],ne=[],ae=[],ie=!0,se=!1,le=void 0
try{for(var me,ue=_.range(7,43)[Symbol.iterator]();!(ie=(me=ue.next()).done);ie=!0){var ye=me.value,ve=!0,ce=!1,de=void 0
try{for(var fe,ge=_.range(7,40)[Symbol.iterator]();!(ve=(fe=ge.next()).done);ve=!0){var Re=fe.value
if(o.get(ye,Re)>=5&&o.get(ye,Re+3)>=4){var pe=new RoomPosition(ye,Re,e)
o.get(ye+4,Re-7)>=3&&o.get(ye-4,Re-7)>=5?te.push(pe):o.get(ye-2,Re)>=7?ne.push(pe):o.get(pe.x,pe.y)>Math.max(4,B-4)&&ae.push(pe)}}}catch(e){ce=!0,de=e}finally{try{!ve&&ge.return&&ge.return()}finally{if(ce)throw de}}}}catch(e){se=!0,le=e}finally{try{!ie&&ue.return&&ue.return()}finally{if(se)throw le}}if(r&&(te=t(e,te),ne=t(e,ne),ae=t(e,ae)),(te=i(e,te)).length>0){te.length>10&&(te=_.sample(te,10))
var he=n(e,te),Ee=new RoomPosition(he.x,he.y-2,he.roomName)
return console.log("Found perfect spawnlocation for "+e+": "+Ee),{pos:Ee,value:20}}if((ne=i(e,ne)).length>0){ne.length>10&&(ne=_.sample(ne,10))
var Se=n(e,ne),Te=new RoomPosition(Se.x,Se.y-2,Se.roomName)
return console.log("Found okey spawnlocation for "+e+": "+Te),{pos:Te,value:0}}if((ae=i(e,ae)).length>0){ae.length>10&&(ae=_.sample(ae,10))
var Ce=n(e,ae),Oe=new RoomPosition(Ce.x,Ce.y-2,Ce.roomName)
return console.log("Found possible spawnlocation for "+e+": "+Oe),{pos:Oe,value:-20}}if(!0===r){var Me=!0,_e=!1,be=void 0
try{for(var we,Ne=_.range(1,49)[Symbol.iterator]();!(Me=(we=Ne.next()).done);Me=!0){var Ae=we.value,Ue=!0,ke=!1,Ie=void 0
try{for(var Le,Pe=_.range(1,49)[Symbol.iterator]();!(Ue=(Le=Pe.next()).done);Ue=!0){var xe=Le.value
if(o.get(Ae,xe)===B-1)return{pos:new RoomPosition(Ae,xe-2,e),value:-100}}}catch(e){ke=!0,Ie=e}finally{try{!Ue&&Pe.return&&Pe.return()}finally{if(ke)throw Ie}}}}catch(e){_e=!0,be=e}finally{try{!Me&&Ne.return&&Ne.return()}finally{if(_e)throw be}}}console.log("Did not find a spawnposition for room "+e)}}},function(e,r,o){function t(e){var r=Game.rooms[e.roomName]
void 0===r||void 0===r.controller||r.controller.level<4||!r.controller.my||r.energyCapacityAvailable===SPAWN_ENERGY_CAPACITY||void 0===r.getSpawn()||Object.keys(Game.constructionSites).length>0||void 0===r.storage||r.storage.store[RESOURCE_ENERGY]<25e3||(e.state=l.Preparing)}function n(e,r){var o=Game.rooms[e.roomName]
if(void 0!==o){var t=o.getSpawn()
void 0!==t&&(_.filter(r.getCreeps(y.Role.BaseBuilder,e.roomName,e.roomName),function(e){return e.ticksToLive<1500&&e.ticksToLive>200}).length<3?i(o,r):o.find(FIND_HOSTILE_CREEPS).length>0||void 0===o.storage||o.storage.store[RESOURCE_ENERGY]<2e4||(t.destroy(),e.state=l.Moving))}}function a(e){var r=Game.rooms[e.roomName]
if(void 0!==r){var o=s(e)
if(void 0!==o){var t=r.getSpawn()
void 0!==t?t.pos.x===o.x&&t.pos.y===o.y?e.state=l.Finished:t.destroy():o.createConstructionSite(STRUCTURE_SPAWN)}}}function i(e,r){var o=r.getCreeps(y.Role.BaseBuilder,e.name,e.name).length,t=c.getCreepsInQueue(e,y.Role.BaseBuilder,e.name)
if(o<4&&0===t){var n=f.getMaxTierConsultant(e.energyCapacityAvailable),a=new d.Order
a.body=f.getConsultantBody(n),a.priority=v.Priority.Important,a.memory={role:y.Role.BaseBuilder,target:e.name,tier:n},c.orderCreep(e,a)}}function s(e){if(void 0!==e.victoryValue.x&&void 0!==e.victoryValue.y)return new RoomPosition(e.victoryValue.x,e.victoryValue.y,e.roomName)}var l,m=o(14),u=o(15),y=o(16),v=o(17),c=o(18),d=o(20),f=o(19)
!function(e){e[e.Waiting=1]="Waiting",e[e.Preparing=2]="Preparing",e[e.Moving=3]="Moving",e[e.Finished=4]="Finished"}(l||(l={})),function(e){e[e.Spawnmoved=1]="Spawnmoved"}(r.VictoryCondition||(r.VictoryCondition={}))
r.VictoryCondition
r.Data=function e(){_classCallCheck(this,e),this.operationtype=u.OperationType.Spawnmove,this.active=!0,this.state=1},r.run=function(e,r,o){r===m.ManagerPriority.Standard&&Game.time%5==0&&(e.state===l.Waiting?t(e):e.state===l.Preparing?n(e,o):e.state===l.Moving&&a(e))},r.victoryConditionReached=function(e){return e.state===l.Finished}},function(e,r){!function(e){e[e.Critical=1]="Critical",e[e.Standard=2]="Standard",e[e.Low=3]="Low",e[e.Trivial=4]="Trivial",e[e.Overflow=5]="Overflow",e[e.None=6]="None"}(r.ManagerPriority||(r.ManagerPriority={}))
r.ManagerPriority
var o=function(){function e(r){_classCallCheck(this,e),this.name=r,this.memoryCheck()}return _createClass(e,[{key:"memoryCheck",value:function(){void 0===Memory.manager&&(Memory.manager={}),void 0===Memory.manager[this.name]&&(Memory.manager[this.name]={})}},{key:"getValue",value:function(e){return Memory.manager[this.name][e]}},{key:"setValue",value:function(e,r){Memory.manager[this.name][e]=r}}]),e}()
r.Manager=o},function(e,r){!function(e){e[e.Haul=0]="Haul",e[e.Drain=1]="Drain",e[e.Guard=2]="Guard",e[e.Spawnmove=3]="Spawnmove"}(r.OperationType||(r.OperationType={}))
r.OperationType},function(e,r){!function(e){e[e.Protector=0]="Protector",e[e.RampartDefender=1]="RampartDefender",e[e.BaseRanger=2]="BaseRanger",e[e.Ranger=3]="Ranger",e[e.OutpostSupporter=4]="OutpostSupporter",e[e.OutpostWarrior=5]="OutpostWarrior",e[e.BaseHauler=6]="BaseHauler",e[e.ProximityScout=7]="ProximityScout",e[e.OutpostReserver=8]="OutpostReserver",e[e.Pioneer=9]="Pioneer",e[e.RoomClaimer=10]="RoomClaimer",e[e.MineralMiner=11]="MineralMiner",e[e.ExpansionWorker=12]="ExpansionWorker",e[e.ContainerMiner=13]="ContainerMiner",e[e.ContainerHauler=14]="ContainerHauler",e[e.OutpostDefender=15]="OutpostDefender",e[e.Janitor=16]="Janitor",e[e.Upgrader=17]="Upgrader",e[e.PoachGuard=18]="PoachGuard",e[e.TeamHealer=19]="TeamHealer",e[e.TeamWarrior=20]="TeamWarrior",e[e.TeamWrecker=21]="TeamWrecker",e[e.PoachMiner=22]="PoachMiner",e[e.PoachHauler=23]="PoachHauler",e[e.BaseBuilder=24]="BaseBuilder",e[e.Harasser=25]="Harasser",e[e.SKGuard=27]="SKGuard",e[e.BankAttacker=28]="BankAttacker",e[e.BankHealer=29]="BankHealer",e[e.BankHauler=30]="BankHauler",e[e.BaseCourier=31]="BaseCourier",e[e.SKMiner=32]="SKMiner",e[e.SKHauler=33]="SKHauler",e[e.SKHealer=34]="SKHealer",e[e.BankRanger=35]="BankRanger",e[e.MineralHauler=36]="MineralHauler",e[e.EnergyHauler=37]="EnergyHauler",e[e.Signer=38]="Signer",e[e.EliteDrainer=40]="EliteDrainer",e[e.Wrecker=41]="Wrecker",e[e.Drainer=42]="Drainer",e[e.Paladin=43]="Paladin",e[e.Praiser=44]="Praiser",e[e.PraiserHauler=45]="PraiserHauler",e[e.Tagger=46]="Tagger",e[e.PraiserLeader=47]="PraiserLeader",e[e.Declarer=48]="Declarer",e[e.UpgraderHauler=49]="UpgraderHauler",e[e.OperationHauler=50]="OperationHauler",e[e.UpgraderWithBoost=1001]="UpgraderWithBoost",e[e.UpgraderWithoutBoost=1002]="UpgraderWithoutBoost",e[e.PraiserWithBoost=1003]="PraiserWithBoost",e[e.PraiserWithoutBoost=1004]="PraiserWithoutBoost"}(r.Role||(r.Role={}))
r.Role},function(e,r){!function(e){e[e.Blocker=0]="Blocker",e[e.Critical=1]="Critical",e[e.Important=2]="Important",e[e.Standard=3]="Standard",e[e.Low=4]="Low",e[e.Trivial=5]="Trivial",e[e.Overflow=6]="Overflow"}(r.Priority||(r.Priority={}))
r.Priority},function(e,r,o){var t=o(19),n=o(16),a=o(17),i=o(7)
r.orderCreep=function(e,r){if(t.getCostForBody(r.body)>e.energyCapacityAvailable)return i.log.error("Creep ordered that is more expensive than the room is able to handle: "+JSON.stringify(r.memory),e.name),!1
if(0===r.body.length)return i.log.error("Invalid creep ordered, empty body: "+JSON.stringify(r.memory),e.name),!1
if(r.body.length>50)return i.log.error("Invalid creep ordered, body larger than 50: "+JSON.stringify(r.memory),e.name),!1
if(void 0===e.memory.orders&&(e.memory.orders=[]),void 0!==r.twinOrder){if(t.getCostForBody(r.twinOrder.body)>e.energyCapacityAvailable)return i.log.error("Creep ordered that is more expensive than the room is able to handle: "+JSON.stringify(r.twinOrder.memory),e.name),!1
if(0===r.twinOrder.body.length)return i.log.error("Invalid creep ordered, empty body: "+JSON.stringify(r.twinOrder.memory),e.name),!1
if(r.twinOrder.body.length>50)return i.log.error("Invalid creep ordered, body larger than 50: "+JSON.stringify(r.twinOrder.memory),e.name),!1}return e.memory.orders.push(r),i.log.info("Ordered: "+n.Role[r.memory.role]+" T"+r.memory.tier+" ("+r.memory.target+") - Queue: "+(e.memory.orders.length-1),e.name),void 0!==r.twinOrder&&i.log.info("Ordered: "+n.Role[r.twinOrder.memory.role]+" T"+r.twinOrder.memory.tier+" ("+r.twinOrder.memory.target+") - Queue: "+(e.memory.orders.length-1),e.name),!0},r.getNumberOfTiersInQueue=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null
void 0===e.memory.orders&&(e.memory.orders=[])
var t=0,n=!0,a=!1,i=void 0
try{for(var s,l=e.memory.orders[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
null!==o&&m.memory.target!==o||null!==r&&m.memory.role!==r||(m.memory.tier?t+=m.memory.tier:t++),void 0!==m.twinOrder&&(null!==o&&m.twinOrder.memory.target!==o||null!==r&&m.twinOrder.memory.role!==r||(m.twinOrder.memory.tier?t+=m.twinOrder.memory.tier:t++))}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t},r.getCreepsInQueue=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null
void 0===e.memory.orders&&(e.memory.orders=[])
var t=0,n=!0,a=!1,i=void 0
try{for(var s,l=e.memory.orders[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
null!==o&&m.memory.target!==o||null!==r&&m.memory.role!==r||t++,void 0!==m.twinOrder&&(null!==o&&m.twinOrder.memory.target!==o||null!==r&&m.twinOrder.memory.role!==r||t++)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t},r.getCreepsInQueueWithHomeRoom=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null
void 0===e.memory.orders&&(e.memory.orders=[])
var t=0,n=!0,a=!1,i=void 0
try{for(var s,l=e.memory.orders[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
null!==o&&m.memory.homeroom!==o||null!==r&&m.memory.role!==r||t++}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t},r.orderedBaseHaulerIsTooExpensive=function(e){if(void 0===e.memory.orders)return!1
var r=e.getSpawns(),o=!0,t=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(o=(s=l.next()).done);o=!0)if(s.value.spawning)return!1}catch(e){t=!0,i=e}finally{try{!o&&l.return&&l.return()}finally{if(t)throw i}}var m=!0,u=!1,y=void 0
try{for(var v,c=e.memory.orders[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(d.memory.role===n.Role.BaseHauler)return d.priority=a.Priority.Critical,150*d.memory.tier>e.energyAvailable}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return!1},r.clearOrders=function(e){e.memory.orders=[],i.log.info("Clearing order queue for room",e.name)}},function(e,r){function o(e){return e>12&&(e=12),N([],e,[WORK,CARRY,MOVE,MOVE])}function t(e){return e>8&&(e=8),N([],e,[WORK,CARRY,CARRY,MOVE,MOVE,MOVE])}function n(e){return e>16&&(e=16),N([],e,[WORK,CARRY,MOVE])}function a(e){e>16&&(e=16)
var r=[]
return r=N(r,Math.floor(e/2),[WORK,WORK,MOVE]),r=N(r,Math.ceil(e/2),[WORK,CARRY,MOVE])}function i(e){e>8&&(e=8)
var r=[]
return r=N(r,3,[WORK,WORK,MOVE]),8===e&&(r=N(r,2,[WORK,WORK,MOVE])),r=N(r,1,[CARRY])}function s(e){e>8&&(e=8)
var r=[]
return r=N(r,4,[WORK,WORK,MOVE]),8===e&&(r=N(r,3,[WORK,WORK,MOVE])),r=N(r,1,[CARRY])}function l(e){e>13&&(e=13)
var r=[]
return r=N(r,Math.floor(Math.min(e,12)/2),[WORK,WORK,WORK,MOVE]),r=N(r,Math.ceil(Math.min(e,12)/2),[WORK,WORK,CARRY,MOVE]),13===e&&(r=N(r,1,[WORK,MOVE])),r}function m(e){e>4&&(e=4)
var r=[]
return r=N(r,e,[WORK,WORK,WORK,WORK,WORK]),r=N(r,e,[CARRY,MOVE]),r=N(r,e,[WORK,WORK,WORK,WORK,WORK])}function u(e){e>12&&(e=12)
var r=[]
return r=N(r,e-1,[WORK,WORK,MOVE,MOVE]),r=N(r,1,[WORK,CARRY,MOVE,MOVE])}function y(e){return e>8&&(e=8),N([],e,[CARRY,CARRY,MOVE,WORK,CARRY,MOVE])}function v(e){return e>16&&(e=16),N([],e,[WORK,WORK,MOVE])}function c(e){e>3&&(e=3)
var r=[]
return r=N(r,7*e,[MOVE]),r=N(r,7*e,[HEAL])}function d(e){return e>16&&(e=16),N([],e,[CARRY,CARRY,MOVE])}function f(e){return e>25&&(e=25),N([],e,[CARRY,MOVE])}function g(e){return e>25&&(e=25),N([],e,[CLAIM,MOVE])}function R(e){return e>50&&(e=50),N([],e,[MOVE])}function p(e){e>25&&(e=25)
var r=[]
return r=N(r,e,[HEAL]),r=N(r,e,[MOVE])}function h(e){e>12&&(e=12)
var r=[]
return r=N(r,e,[TOUGH]),r=N(r,e,[ATTACK,MOVE]),r=N(r,e,[MOVE])}function E(e){e>24&&(e=24)
var r=[]
return r=N(r,e,[ATTACK]),r=N(r,e,[MOVE])}function S(e){e>12&&(e=12)
var r=[]
return r=N(r,e,[RANGED_ATTACK,RANGED_ATTACK]),r=N(r,e,[MOVE,MOVE])}function T(e){e>8&&(e=8)
var r=[]
switch(e){case 1:case 2:r=N(r,e,[RANGED_ATTACK,MOVE])
break
case 3:r=N(r=N(r=N(r,2,[RANGED_ATTACK]),1,[HEAL,MOVE]),2,[MOVE])
break
case 4:r=N(r=N(r=N(r,4,[RANGED_ATTACK]),1,[HEAL,MOVE]),4,[MOVE])
break
case 5:r=N(r=N(r=N(r,5,[RANGED_ATTACK]),2,[HEAL,MOVE]),5,[MOVE])
break
case 6:r=N(r=N(r=N(r,6,[RANGED_ATTACK]),3,[HEAL,MOVE]),6,[MOVE])
break
case 7:r=N(r=N(r=N(r,15,[RANGED_ATTACK]),5,[HEAL,MOVE]),15,[MOVE])
break
case 8:r=N(r=N(r=N(r,17,[RANGED_ATTACK]),8,[HEAL,MOVE]),17,[MOVE])}return r}function C(e){e>8&&(e=8)
var r=[]
switch(e){case 1:r=N(r,1,[HEAL,MOVE])
break
case 2:r=N(r=N(r=N(r,1,[RANGED_ATTACK]),1,[HEAL,MOVE]),1,[MOVE])
break
case 3:r=N(r=N(r=N(r,1,[RANGED_ATTACK]),2,[HEAL,MOVE]),1,[MOVE])
break
case 4:r=N(r=N(r=N(r,1,[RANGED_ATTACK]),3,[HEAL,MOVE]),1,[MOVE])
break
case 5:r=N(r=N(r=N(r,2,[RANGED_ATTACK]),4,[HEAL,MOVE]),2,[MOVE])
break
case 6:r=N(r=N(r=N(r,3,[RANGED_ATTACK]),5,[HEAL,MOVE]),3,[MOVE])
break
case 7:r=N(r=N(r=N(r,5,[RANGED_ATTACK]),10,[HEAL,MOVE]),5,[MOVE])
break
case 8:r=N(r=N(r=N(r,10,[RANGED_ATTACK]),15,[HEAL,MOVE]),10,[MOVE])}return r}function O(e){e>8&&(e=8)
var r=[]
switch(e){case 1:case 2:r=N(r,e,[MOVE,ATTACK])
break
case 3:r=N(r=N(r=N(r,3,[ATTACK]),3,[MOVE]),1,[MOVE,HEAL])
break
case 4:r=N(r=N(r=N(r,6,[ATTACK]),6,[MOVE]),1,[MOVE,HEAL])
break
case 5:r=N(r=N(r=N(r,8,[ATTACK]),8,[MOVE]),2,[MOVE,HEAL])
break
case 6:r=N(r=N(r=N(r,10,[ATTACK]),10,[MOVE]),3,[MOVE,HEAL])
break
case 7:case 8:r=N(r=N(r=N(r,20,[ATTACK]),20,[MOVE]),5,[MOVE,HEAL])}return r}function M(e){return e>10&&(e=10),N([],e,[RANGED_ATTACK,MOVE,HEAL,MOVE])}function _(e){var r=0,o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)r+=w(a.value)}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}function b(e,r,o){for(var t=0,n=!1,a=1;!n;a++)_(r(a))>e||a>o?n=!0:t=a
return t}function w(e){switch(e){case TOUGH:return 10
case MOVE:case CARRY:return 50
case ATTACK:return 80
case WORK:return 100
case RANGED_ATTACK:return 150
case HEAL:return 250
case CLAIM:return 600
default:return 0}}function N(e,r,o){for(var t=0;t<r;t++){var n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
e.push(m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}}return e}r.getB3TeamWreckerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,4,[TOUGH]),r=N(r,4*e,[TOUGH]),r=N(r,14,[WORK]),e>1&&(r=N(r,6,[WORK])),r=N(r,2,[RANGED_ATTACK]),e>1&&(r=N(r,2,[RANGED_ATTACK])),r=N(r,6,[MOVE]),2===e&&(r=N(r,3,[MOVE])),3===e&&(r=N(r,4,[MOVE])),r},r.getB3TeamHealerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,4,[TOUGH]),r=N(r,4*e,[TOUGH]),r=N(r,8*e,[HEAL]),r=N(r,4,[MOVE]),2===e&&(r=N(r,3,[MOVE])),3===e&&(r=N(r,6,[MOVE])),r},r.getB2TeamWreckerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,12,[TOUGH]),r=N(r,13,[WORK]),2===e&&(r=N(r,2,[WORK])),3===e&&(r=N(r,7,[WORK])),r=N(r,1+e,[RANGED_ATTACK]),r=N(r,9,[MOVE]),2===e&&(r=N(r,1,[MOVE])),3===e&&(r=N(r,3,[MOVE])),r},r.getB2TeamHealerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,4,[TOUGH]),e>1&&(r=N(r,8,[TOUGH])),r=N(r,8,[HEAL]),2===e&&(r=N(r,10,[TOUGH])),3===e&&(r=N(r,14,[TOUGH])),r=N(r,4,[MOVE]),2===e&&(r=N(r,6,[MOVE])),3===e&&(r=N(r,8,[MOVE])),r},r.getB1TeamWreckerBody=function(e){e>1&&(e=1)
var r=[]
return r=N(r,10,[TOUGH]),r=N(r,16,[WORK]),r=N(r,6,[RANGED_ATTACK]),r=N(r,16,[MOVE])},r.getB1TeamHealerBody=function(e){e>1&&(e=1)
var r=[]
return r=N(r,10,[TOUGH]),r=N(r,18,[HEAL]),r=N(r,14,[MOVE])},r.getB0TeamWreckerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,10,[WORK]),r=N(r,12,[MOVE]),2===e&&(r=N(r,8,[MOVE])),3===e&&(r=N(r,13,[MOVE])),2===e&&(r=N(r,6,[WORK])),3===e&&(r=N(r,11,[WORK])),r=N(r,2,[RANGED_ATTACK]),e>1&&(r=N(r,2,[RANGED_ATTACK])),r},r.getB0TeamHealerBody=function(e){e>3&&(e=3)
var r=[]
return r=N(r,3*e,[HEAL]),r=N(r,7*e,[MOVE]),r=N(r,4*e,[HEAL])},r.getPoachGuardBody=function(){var e=[]
return e=N(e,25,[MOVE]),e=N(e,20,[ATTACK]),e=N(e,5,[HEAL])},r.getPoachMinerBody=function(){var e=[]
return e=N(e,15,[MOVE]),e=N(e,30,[WORK]),e=N(e,5,[CARRY])},r.getPraiserBody=function(){var e=[]
return e=N(e,42,[WORK]),e=N(e,2,[CARRY]),e=N(e,6,[MOVE])},r.getSKGuardBody=function(){var e=[]
return e=N(e,2,[RANGED_ATTACK]),e=N(e,21,[MOVE]),e=N(e,15,[ATTACK]),e=N(e,4,[RANGED_ATTACK])},r.getSKHealerBody=function(){var e=[]
return e=N(e,2,[HEAL]),e=N(e,15,[MOVE]),e=N(e,13,[HEAL])},r.getBankAttacker=function(){var e=[]
return e=N(e,20,[MOVE]),e=N(e,20,[ATTACK])},r.getBankRanger=function(){var e=[]
return e=N(e,23,[MOVE]),e=N(e,16,[RANGED_ATTACK]),e=N(e,7,[HEAL])},r.getEngineerBody=o,r.getMaxTierEngineer=function(e){return b(e,o,12)},r.getTaggerBody=function(){var e=N([],1,[WORK,MOVE])
return e=N(e,10,[CARRY,MOVE])},r.getHaulerEngineerBody=t,r.getMaxTierHaulerEngineer=function(e){return b(e,t,8)},r.getConsultantBody=n,r.getMaxTierConsultant=function(e){return b(e,n,16)},r.getWorkerBody=a,r.getMaxTierWorker=function(e){return b(e,a,16)},r.getMinerBody=i,r.getMaxTierMiner=function(e){return b(e,i,8)},r.getSkMinerBody=s,r.getMaxTierSkMiner=function(e){return b(e,s,8)},r.getStationaryWorkerBody=l,r.getMaxTierStationaryWorker=function(e){return b(e,l,13)},r.getProtectorBody=m,r.getMaxTierProtector=function(e){return b(e,m,4)},r.getOffroadWorkerBody=u,r.getMaxTierOffroadWorker=function(e){return b(e,u,12)},r.getDistanceWorkerBody=y,r.getMaxTierDistanceWorker=function(e){return b(e,y,8)},r.getWorkOnlyBody=v,r.getMaxTierWorkOnly=function(e){return b(e,v,16)},r.getOffroadWorkOnlyBody=function(e){return e>25&&(e=25),N([],e,[WORK,MOVE])},r.getMaxTierOffroadWorkOnly=function(e){return b(e,v,25)},r.getDrainerBody=c,r.getMaxTierDrainer=function(e){return b(e,c,3)},r.getEliteDrainerBody=function(e){e>1&&(e=1)
var r=[]
return r=N(r,6,[TOUGH]),r=N(r,1,[RANGED_ATTACK]),r=N(r,19,[MOVE]),r=N(r,12,[HEAL])},r.getHaulerBody=d,r.getMaxTierHauler=function(e){return b(e,d,16)},r.getOffroadHaulerBody=f,r.getMaxTierOffroadHauler=function(e){return b(e,f,25)},r.getClaimerBody=g,r.getMaxTierClaimer=function(e){return b(e,g,25)},r.getSwampClaimerBody=function(e){return e>8&&(e=8),N([],e,[MOVE,MOVE,MOVE,MOVE,CLAIM,MOVE])},r.getMaxTierSwampClaimer=function(e){return b(e,g,8)},r.getScoutBody=R,r.getMaxTierScout=function(e){return b(e,R,50)},r.getHealerBody=p,r.getMaxTierHealer=function(e){return b(e,p,25)},r.getWarriorBody=h,r.getMaxTierWarrior=function(e){return b(e,h,12)},r.getRogueBody=E,r.getMaxTierRogue=function(e){return b(e,E,24)},r.getBaseRangerBody=S,r.getMaxTierBaseRanger=function(e){return b(e,S,12)},r.getRangerBody=T,r.getMaxTierRanger=function(e){return b(e,T,8)},r.getSupporterBody=C,r.getMaxTierSupporter=function(e){return b(e,C,8)},r.getPaladinBody=O,r.getMaxTierPaladin=function(e){return b(e,O,8)},r.getKiterBody=M,r.getMaxTierKiter=function(e){return b(e,M,10)},r.getCostForBody=_},function(e,r){r.Order=function e(){_classCallCheck(this,e)}},function(e,r,o){var t=o(22)
Creep.prototype.hasState=function(){return void 0!==this.memory.state},Creep.prototype.getState=function(){return this.memory.state},Creep.prototype.setState=function(e){this.memory.state=e},Creep.prototype.getHomeroom=function(){return this.memory.homeroom},Creep.prototype.isInHomeroom=function(){return this.memory.homeroom===this.room.name},Creep.prototype.isPrioritized=function(){return!0===this.memory.prioritized},Creep.prototype.setPrioritized=function(){this.memory.prioritized=!0},Creep.prototype.setNotPrioritized=function(){this.memory.prioritized=!1},Creep.prototype.travelTo=function(e,r){return r?(!1!==r.allowHostile&&(r.allowHostile=!0),void 0===r.maxOps&&(r.maxOps=1e4)):r={allowHostile:!0,maxOps:1e4},t.traveler.travelTo(this,e,r)},Creep.prototype.travelToRoom=function(e,r){return r?r.range=20:r={range:20},this.travelTo({pos:new RoomPosition(25,25,e)},r)},Creep.prototype.missingHits=function(){return this.hitsMax-this.hits},Creep.prototype.isHurt=function(){return this.hits<this.hitsMax},Creep.prototype.isRenewing=function(){return!0===this.memory.renewing},Creep.prototype.startRenewing=function(){this.memory.renewing=!0},Creep.prototype.stopRenewing=function(){this.memory.renewing=!1},Creep.prototype.isEmpty=function(){return 0===this.carry.energy},Creep.prototype.isFull=function(){return _.sum(this.carry)===this.carryCapacity},Creep.prototype.isDumping=function(){return!0===this.memory.dumping},Creep.prototype.isFinishedDumping=function(){return this.isDumping()&&this.isEmpty()},Creep.prototype.isFinishedMining=function(){return!this.isDumping()&&this.isFull()},Creep.prototype.startDumping=function(){this.memory.dumping=!0},Creep.prototype.stopDumping=function(){this.memory.dumping=!1},Creep.prototype.isTanking=function(){return!0===this.memory.tanking},Creep.prototype.isFinishedTanking=function(){return this.isTanking()&&this.isFull()},Creep.prototype.isInNeedOfTanking=function(){return!this.isTanking()&&this.isEmpty()},Creep.prototype.startTanking=function(){this.memory.tanking=!0},Creep.prototype.stopTanking=function(){this.memory.tanking=!1},Creep.prototype.getWorkerParts=function(){return this.getActiveBodyparts(WORK)},Creep.prototype.isDisabled=function(){return this.memory.disabled},Creep.prototype.disable=function(){this.memory.disabled=!0},Creep.prototype.enable=function(){this.memory.disabled=void 0},Creep.prototype.isAtBorder=function(){return 0===this.pos.x||49===this.pos.x||0===this.pos.y||49===this.pos.y}},function(e,r,o){var t=o(10),n=function(){function e(){_classCallCheck(this,e),Memory.empire||(Memory.empire={}),Memory.empire.hostileRooms||(Memory.empire.hostileRooms={}),this.memory=Memory.empire}return _createClass(e,[{key:"findAllowedRooms",value:function(e,r){var o,t=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
if(_.defaults(n,{restrictDistance:16}),void 0!==n.restrictDistance&&Game.map.getRoomLinearDistance(e,r)>n.restrictDistance)return{}
var a=(o={},_defineProperty(o,e,!0),_defineProperty(o,r,!0),o),i=Game.map.findRoute(e,r,{routeCallback:function(o){if(n.routeCallback){var a=n.routeCallback(o)
if(void 0!==a)return a}if(void 0!==n.restrictDistance&&Game.map.getRoomLinearDistance(e,o)>n.restrictDistance)return!1
var i=void 0
if(n.preferHighway&&((i=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(o))[1]%10==0||i[2]%10==0))return 1
if(!n.allowSK&&!Game.rooms[o]){i||(i=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(o))
var s=i[1]%10,l=i[2]%10
if(!(5===s&&5===l)&&s>=4&&s<=6&&l>=4&&l<=6)return 10}return!n.allowHostile&&t.memory.hostileRooms[o]&&o!==r&&o!==e?Number.POSITIVE_INFINITY:2.5}})
if(!_.isArray(i))return console.log("couldn't findRoute to "+r),void 0!==Memory.empire&&(void 0===Memory.empire.inaccessible&&(Memory.empire.inaccessible=[]),_.contains(Memory.empire.inaccessible,r)||Memory.empire.inaccessible.push(r)),{}
var s=!0,l=!1,m=void 0
try{for(var u,y=i[Symbol.iterator]();!(s=(u=y.next()).done);s=!0)a[u.value.room]=!0}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}return a}},{key:"findTravelPath",value:function(r,o){var t=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
_.defaults(n,{ignoreCreeps:!0,range:1,maxOps:2e4,obstacles:[]})
var a=void 0;(n.useFindRoute||void 0===n.useFindRoute&&Game.map.getRoomLinearDistance(r.pos.roomName,o.pos.roomName)>2)&&(a=this.findAllowedRooms(r.pos.roomName,o.pos.roomName,n))
return void 0===n.range&&(n.range=1),void 0===n.maxOps&&(n.maxOps=2e4),PathFinder.search(r.pos,{pos:o.pos,range:n.range},{maxOps:n.maxOps,plainCost:n.ignoreRoads?1:2,roomCallback:function(o){if(n.roomCallback){void 0===n.ignoreCreeps&&(n.ignoreCreeps=!0)
var i=n.roomCallback(o,n.ignoreCreeps)
if(void 0!==i)return i}if(a){if(!a[o])return!1}else if(t.memory.hostileRooms[o]&&!n.allowHostile)return!1
var s=Game.rooms[o]
if(!s)return new PathFinder.CostMatrix
var l=void 0
n.ignoreStructures?(l=new PathFinder.CostMatrix,n.ignoreCreeps||e.addCreepsToMatrix(s,l)):l=n.ignoreCreeps||o!==r.pos.roomName?t.getStructureMatrix(s):t.getCreepMatrix(s),n.avoidKeepers&&(l=e.addSourceKeepersToMatrix(s,l)),l=e.addBasePositionsToMatrix(s,l),void 0===n.obstacles&&(n.obstacles=[])
var m=!0,u=!1,y=void 0
try{for(var v,c=n.obstacles[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
l.set(d.pos.x,d.pos.y,255)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return l},swampCost:n.ignoreRoads?5:10})}},{key:"travelTo",value:function(r,o){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
r.memory._travel||(r.memory._travel={stuck:0,tick:Game.time,cpu:0,count:0,portalCheck:!1})
var a=r.memory._travel
if(r.fatigue>0)return a.tick=Game.time,ERR_BUSY
if(!o)return ERR_INVALID_ARGS
Game.time%10==0&&!a.portalCheck&&t.isPortalRoom(r.pos.roomName)&&r.room.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_PORTAL}}).length>0&&(a.portalCheck=!0,delete a.path)
var i=r.pos.getRangeTo(o)
if(i<=1)return 1!==i||void 0===n.range||n.range>=1?OK:(n.returnData&&(n.returnData.nextPos=o.pos),r.move(r.pos.getDirectionTo(o)))
var s=!0
if(a.prev&&(a.prev=e.initPosition(a.prev),r.pos.inRangeTo(a.prev,0)?(s=!1,a.stuck++):a.stuck=0),a.stuck>=3&&!n.ignoreStuck&&(n.ignoreCreeps=!1,delete a.path),Game.time-a.tick>1&&s&&delete a.path,a.tick=Game.time,a.dest&&a.dest.x===o.pos.x&&a.dest.y===o.pos.y&&a.dest.roomName===o.pos.roomName||delete a.path,!a.path){if(r.spawning)return ERR_BUSY
a.dest=o.pos,a.prev=void 0
var l=Game.cpu.getUsed(),m=this.findTravelPath(r,o,n)
a.cpu+=Game.cpu.getUsed()-l,a.count++,a.cpu,m.incomplete&&(n.useFindRoute=!0,m=this.findTravelPath(r,o,n)),a.path=e.serializePath(r.pos,m.path),a.stuck=0}if(!a.path||0===a.path.length)return r.moveTo(o)
a.prev&&0===a.stuck&&(a.path=a.path.substr(1)),a.prev=r.pos
var u=parseInt(a.path[0],10)
return n.returnData&&(n.returnData.nextPos=e.positionAtDirection(r.pos,u)),r.move(u)}},{key:"getStructureMatrix",value:function(r){if(this.refreshMatrices(),!this.structureMatrixCache[r.name]){var o=new PathFinder.CostMatrix
this.structureMatrixCache[r.name]=e.addStructuresToMatrix(r,o,1)}return this.structureMatrixCache[r.name]}},{key:"getCreepMatrix",value:function(r){return this.refreshMatrices(),this.creepMatrixCache[r.name]||(this.creepMatrixCache[r.name]=e.addCreepsToMatrix(r,this.getStructureMatrix(r).clone())),this.creepMatrixCache[r.name]}},{key:"refreshMatrices",value:function(){Game.time!==this.currentTick&&(this.currentTick=Game.time,this.structureMatrixCache={},this.creepMatrixCache={})}}],[{key:"initPosition",value:function(e){return new RoomPosition(e.x,e.y,e.roomName)}},{key:"addStructuresToMatrix",value:function(e,r,o){var t=!0,n=!1,a=void 0
try{for(var i,s=e.find(FIND_STRUCTURES)[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
l instanceof StructureRampart?l.my||r.set(l.pos.x,l.pos.y,255):l instanceof StructureRoad?r.set(l.pos.x,l.pos.y,o):l.structureType!==STRUCTURE_CONTAINER&&r.set(l.pos.x,l.pos.y,255)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var m=!0,u=!1,y=void 0
try{for(var v,c=e.find(FIND_CONSTRUCTION_SITES)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
d.structureType!==STRUCTURE_ROAD&&d.structureType!==STRUCTURE_CONTAINER&&d.structureType!==STRUCTURE_RAMPART&&r.set(d.pos.x,d.pos.y,255)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return r}},{key:"addCreepsToMatrix",value:function(e,r){return e.find(FIND_CREEPS).forEach(function(e){return r.set(e.pos.x,e.pos.y,255)}),r}},{key:"addSourceKeepersToMatrix",value:function(e,r){var o=e.find(FIND_HOSTILE_CREEPS),t=void 0,n=void 0,a=void 0,i=void 0,s=void 0,l=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(l=(y=v.next()).done);l=!0)for(t=y.value,n=-5;n<6;n++)for(a=-5;a<6;a++)i=t.pos.x+n,s=t.pos.y+a,i>0&&i<49&&s>0&&s<49&&r.set(i,s,254)}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}return r}},{key:"addBasePositionsToMatrix",value:function(e,r){return void 0!==e.controller&&e.controller.my&&e.controller.level>3&&void 0!==e.storage&&(r.set(e.storage.pos.x,e.storage.pos.y-1,10),r.set(e.storage.pos.x,e.storage.pos.y+1,10),r.set(e.storage.pos.x,e.storage.pos.y-4,10)),r}},{key:"serializePath",value:function(e,r){var o="",t=e,n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
m.roomName===t.roomName&&(o+=t.getDirectionTo(m)),t=m}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o}},{key:"positionAtDirection",value:function(e,r){var o=[0,0,1,1,1,0,-1,-1,-1],t=[0,-1,-1,0,1,1,1,0,-1]
return new RoomPosition(e.x+o[r],e.y+t[r],e.roomName)}}]),e}()
r.Traveler=n,r.traveler=new n},function(e,r){Mineral.prototype.memoryCheck=function(){void 0===Memory.minerals&&(Memory.minerals={}),void 0===Memory.minerals[this.id]&&(Memory.minerals[this.id]={})},Mineral.prototype.hasExtractor=function(){var e=this.pos.lookFor(LOOK_STRUCTURES),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0)if(n.value instanceof StructureExtractor)return!0}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return!1},Mineral.prototype.hasMiningContainer=function(){return null!==this.getMiningContainer()},Mineral.prototype.buildExtractor=function(){return 0===this.pos.createConstructionSite(STRUCTURE_EXTRACTOR)},Mineral.prototype.setMiningContainerId=function(e){this.memoryCheck(),Memory.minerals[this.id].container=e},Mineral.prototype.getMiningContainer=function(){if(this.memoryCheck(),void 0===Memory.minerals[this.id].container)return this.buildMiningContainer(),null
var e=Game.getObjectById(Memory.minerals[this.id].container)
return null===e&&(Memory.minerals[this.id].container=void 0),e},Mineral.prototype.getMiningContainerConstructionSite=function(){this.memoryCheck()
var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_CONSTRUCTION_SITES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s instanceof ConstructionSite&&s.structureType===STRUCTURE_CONTAINER)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return null},Mineral.prototype.buildMiningContainer=function(){this.memoryCheck()
var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s instanceof StructureContainer&&(Memory.minerals[this.id].container=s.id)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}e.createConstructionSite(STRUCTURE_CONTAINER)}},Mineral.prototype.getMiningPositions=function(){for(var e=[],r=-1;r<2;r++)for(var o=-1;o<2;o++){var t=new RoomPosition(this.pos.x+r,this.pos.y+o,this.room.name)
if(t.x!==this.pos.x||t.y!==this.pos.y){var n=Game.map.getTerrainAt(t)
"swamp"!==n&&"plain"!==n||e.push(t)}}return e},Mineral.prototype.getContainerPosition=function(){if(this.memoryCheck(),void 0!==Memory.minerals[this.id].containerPos){var e=Memory.minerals[this.id].containerPos
return new RoomPosition(e.x,e.y,e.roomName)}var r=this.getMiningPositions()
if(1===r.length)return r[0]
var o=[]
for(var t in r){var n=r[t],a=!0,i=!1,s=void 0
try{for(var l,m=r[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value;(Math.abs(n.x-u.x)+Math.abs(n.y-u.y)===1||1===Math.abs(n.x-u.x)&&1===Math.abs(n.y-u.y))&&(void 0===o[t]?o[t]=1:o[t]=o[t]+1)}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}}var y=void 0
for(var v in o)(void 0===y||o[parseInt(v)]>o[parseInt(y)])&&(y=v)
return void 0!==y?(Memory.minerals[this.id].containerPos=r[parseInt(y)],r[parseInt(y)]):void 0},Mineral.prototype.getContainerMiningPositions=function(){var e=this.getMiningPositions(),r=this.getContainerPosition(),o=[],t=!0,n=!1,a=void 0
try{for(var i,s=e[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;(Math.abs(r.x-l.x)+Math.abs(r.y-l.y)<2||1===Math.abs(r.x-l.x)&&1===Math.abs(r.y-l.y))&&o.push(l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return o}},function(e,r){Room.prototype.getHostileCreeps=function(){return this.find(FIND_HOSTILE_CREEPS)},Room.prototype.getHostileCreepsNotAtBorder=function(){return _.filter(this.getHostileCreeps(),function(e){return!e.isAtBorder()})},Room.prototype.hasHostileCreeps=function(){return this.getHostileCreeps().length>0},Room.prototype.getSpawns=function(){return this.find(FIND_MY_SPAWNS)},Room.prototype.getSpawn=function(){var e=this.getSpawns()
if(0!==e.length)return e[0]},Room.prototype.getSources=function(){return this.find(FIND_SOURCES)},Room.prototype.getMineral=function(){var e=this.find(FIND_MINERALS)
if(e.length>0)return e[0]},Room.prototype.hasFreeSpawnCapacity=function(){var e=this.getSpawns()
if(void 0===e||e.length<1)return!1
var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0)if(!n.value.spawning)return!0}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return!1},Room.prototype.getFreeSpawn=function(){var e=this.getSpawns()
if(!(void 0===e||e.length<1)){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(!i.spawning)return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},Room.prototype.getBoostLab=function(){if(void 0!==this.memory.b){var e=this.memory.b.split("-"),r=new RoomPosition(+e[0],+e[1],this.name),o=new RoomPosition(r.x+1,r.y+4,r.roomName).lookFor(LOOK_STRUCTURES),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(l.structureType===STRUCTURE_LAB)return l}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}},Room.prototype.getPowerSpawn=function(){if(!(void 0===this.controller||this.controller.level<8)){if(void 0!==this.memory.powerspawn){var e=Game.getObjectById(this.memory.powerspawn)
if(e instanceof StructurePowerSpawn)return e
this.memory.powerspawn=void 0}var r=this.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_POWER_SPAWN}})
return r.length>0?(this.memory.powerspawn=r[0].id,r[0]):void 0}},Room.prototype.getNuker=function(){if(!(void 0===this.controller||this.controller.level<8)){if(void 0!==this.memory.nuker){var e=Game.getObjectById(this.memory.nuker)
if(e instanceof StructureNuker)return e
this.memory.nuker=void 0}var r=this.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_NUKER}})
return r.length>0?(this.memory.nuker=r[0].id,r[0]):void 0}},Room.prototype.getObserver=function(){if(!(void 0===this.controller||this.controller.level<8)){if(void 0!==this.memory.observer){var e=Game.getObjectById(this.memory.observer)
if(e instanceof StructureObserver)return e
this.memory.observer=void 0}var r=this.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_OBSERVER}})
return r.length>0?(this.memory.observer=r[0].id,r[0]):void 0}},Room.prototype.getBaseContainer=function(){var e=Game.getObjectById(this.memory.roomContainer)
if(e instanceof StructureContainer)return e},Room.prototype.getBaseLink=function(){if(void 0!==this.memory.b){var e=this.memory.b.split("-"),r=new RoomPosition(+e[0],+e[1],this.name),o=new RoomPosition(r.x-1,r.y+4,r.roomName).lookFor(LOOK_STRUCTURES),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(l.structureType===STRUCTURE_LINK)return l}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}},Room.prototype.hasLabArea=function(){return void 0!==this.memory.lab&&void 0!==this.memory.lab.operational&&!0===this.memory.lab.operational},Room.prototype.getProcessingLabs=function(){var e=[]
void 0!==this.memory.lab&&void 0!==this.memory.lab.processingLabs&&(e=_.map(this.memory.lab.processingLabs,function(e){return Game.getObjectById(e)}))
var r=this.getBoostLab()
return!0!==this.memory.boosting&&void 0!==r&&e.push(r),e},Room.prototype.getSupplyingLabs=function(){return void 0===this.memory.lab||void 0===this.memory.lab.supplyingLabs?[]:_.map(this.memory.lab.supplyingLabs,function(e){return Game.getObjectById(e)})},Room.prototype.isExpansion=function(){return!0===this.memory.isExpansion},Room.prototype.hasExpansion=function(){return void 0!==this.memory.expansion},Room.prototype.isAbandoned=function(){return!0===this.memory.isBeingDismantled},Room.prototype.isUnderSiege=function(){return void 0!==this.memory.defcon&&this.memory.defcon>1}},function(e,r){RoomPosition.prototype.getClosestSpawn=function(){return this.findClosestByRange(FIND_MY_SPAWNS)},RoomPosition.prototype.hasFreeSpaceAround=function(){for(var e=-1;e<2;e++)for(var r=-1;r<2;r++){var o=new RoomPosition(this.x+e,this.y+r,this.roomName),t=Game.map.getTerrainAt(o)
if("swamp"!==t&&"plain"!==t)return!1}return!0},RoomPosition.prototype.getFreeSpaceAround=function(){for(var e=0,r=-1;r<2;r++)for(var o=-1;o<2;o++){var t=new RoomPosition(this.x+r,this.y+o,this.roomName),n=Game.map.getTerrainAt(t)
"swamp"!==n&&"plain"!==n||e++}return e},RoomPosition.prototype.hasBuildingType=function(e){var r=this.lookFor(LOOK_STRUCTURES),o=this.lookFor(LOOK_CONSTRUCTION_SITES),t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0)if(i.value.structureType===e)return!0}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var l=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(l=(y=v.next()).done);l=!0)if(y.value.structureType===e)return!0}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}return!1},RoomPosition.prototype.getPositionInDirection=function(e){switch(e){case TOP:return new RoomPosition(this.x,this.y-1,this.roomName)
case TOP_RIGHT:return new RoomPosition(this.x+1,this.y-1,this.roomName)
case RIGHT:return new RoomPosition(this.x+1,this.y,this.roomName)
case BOTTOM_RIGHT:return new RoomPosition(this.x+1,this.y+1,this.roomName)
case BOTTOM:return new RoomPosition(this.x,this.y+1,this.roomName)
case BOTTOM_LEFT:return new RoomPosition(this.x-1,this.y+1,this.roomName)
case LEFT:return new RoomPosition(this.x-1,this.y,this.roomName)
case TOP_LEFT:return new RoomPosition(this.x-1,this.y-1,this.roomName)
default:return new RoomPosition(this.x,this.y,this.roomName)}}},function(e,r){Source.prototype.memoryCheck=function(){void 0===Memory.sources&&(Memory.sources={}),void 0===Memory.sources[this.id]&&(Memory.sources[this.id]={})},Source.prototype.hasMiningContainer=function(){return null!==this.getMiningContainer()},Source.prototype.setMiningContainerId=function(e){this.memoryCheck(),Memory.sources[this.id].container=e},Source.prototype.getMiningContainer=function(){if(this.memoryCheck(),void 0===Memory.sources[this.id].container)return null
var e=Game.getObjectById(Memory.sources[this.id].container)
return null===e&&(Memory.sources[this.id].container=void 0),e},Source.prototype.getMiningContainerConstructionSite=function(){this.memoryCheck()
var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_CONSTRUCTION_SITES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s instanceof ConstructionSite&&(s.structureType===STRUCTURE_LINK||s.structureType===STRUCTURE_CONTAINER))return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return null},Source.prototype.buildMiningContainer=function(){this.memoryCheck()
var e=this.getContainerPosition()
if(void 0!==e){var r=e.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s instanceof StructureContainer?Memory.sources[this.id].container=s.id:s instanceof StructureLink&&s.destroy()}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}e.createConstructionSite(STRUCTURE_CONTAINER)}},Source.prototype.getMiningPositions=function(){for(var e=[],r=-1;r<2;r++)for(var o=-1;o<2;o++){var t=new RoomPosition(this.pos.x+r,this.pos.y+o,this.room.name)
if(t.x!==this.pos.x||t.y!==this.pos.y){var n=Game.map.getTerrainAt(t)
"swamp"!==n&&"plain"!==n||e.push(t)}}return e},Source.prototype.getContainerPosition=function(){if(this.memoryCheck(),void 0!==Memory.sources[this.id].containerPos){var e=Memory.sources[this.id].containerPos
return new RoomPosition(e.x,e.y,e.roomName)}var r=this.getMiningPositions()
if(1===r.length)return Memory.sources[this.id].containerPos=r[0],r[0]
var o=[]
for(var t in r){var n=r[t],a=!0,i=!1,s=void 0
try{for(var l,m=r[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value;(Math.abs(n.x-u.x)+Math.abs(n.y-u.y)===1||1===Math.abs(n.x-u.x)&&1===Math.abs(n.y-u.y))&&(void 0===o[t]?o[t]=1:o[t]=o[t]+1)}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}}if(0===o.length)return Memory.sources[this.id].containerPos=r[0],r[0]
var y=void 0
for(var v in o)(void 0===y||o[parseInt(v)]>o[parseInt(y)])&&(y=v)
return void 0!==y?(Memory.sources[this.id].containerPos=r[parseInt(y)],r[parseInt(y)]):void 0},Source.prototype.getContainerMiningPositions=function(){var e=this.getMiningPositions(),r=this.getContainerPosition(),o=[],t=!0,n=!1,a=void 0
try{for(var i,s=e[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;(Math.abs(r.x-l.x)+Math.abs(r.y-l.y)<2||1===Math.abs(r.x-l.x)&&1===Math.abs(r.y-l.y))&&o.push(l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return o},Source.prototype.getDistanceFrom=function(e){if(this.memoryCheck(),void 0!==Memory.sources[this.id].basedistance&&void 0!==Memory.sources[this.id].basedistanceRoom&&Memory.sources[this.id].basedistanceRoom===e)return Memory.sources[this.id].basedistance},Source.prototype.setDistanceFrom=function(e,r){this.memoryCheck(),Memory.sources[this.id].basedistance=r,Memory.sources[this.id].basedistanceRoom=e}},function(e,r,o){var t=o(14),n=o(10),a=function(e){function r(){_classCallCheck(this,r)
var e=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MemoryManager"))
return e.MEMORY_SHORTTERM="shortterm",e.MEMORY_LONGTERM="longterm",e}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Low){var r=this.getValue(this.MEMORY_SHORTTERM);(void 0===r||r+20<Game.time)&&(this.deleteCreepsFromMemory(),this.deleteOldBanksFromMemory(),this.assignRoomIndeces(),this.setValue(this.MEMORY_SHORTTERM,Game.time)),(void 0===this.getValue(this.MEMORY_LONGTERM)||r+2e3<Game.time)&&(this.deleteOldIntelFromMemory(),this.deleteOldAbandonedRoomsFromMemory(),this.setValue(this.MEMORY_LONGTERM,Game.time))}}},{key:"assignRoomIndeces",value:function(){var e=!0,r=!1,o=void 0
try{for(var t,a=Object.keys(Game.rooms)[Symbol.iterator]();!(e=(t=a.next()).done);e=!0){var i=t.value,s=Game.rooms[i]
void 0!==s.controller&&s.controller.my&&n.getIndex(s)}}catch(e){r=!0,o=e}finally{try{!e&&a.return&&a.return()}finally{if(r)throw o}}}},{key:"deleteCreepsFromMemory",value:function(){for(var e in Memory.creeps)Game.creeps[e]||delete Memory.creeps[e]}},{key:"deleteOldIntelFromMemory",value:function(){for(var e in Memory.rooms)void 0!==Memory.rooms[e].i&&void 0!==Memory.rooms[e].i.t&&Memory.rooms[e].i.t<Game.time-4e5&&!Game.rooms[e]&&delete Memory.rooms[e]}},{key:"deleteOldAbandonedRoomsFromMemory",value:function(){for(var e in Memory.rooms)if(Memory.rooms[e].length>1){var r=Game.rooms[e]
Game.rooms[e]&&(void 0===r.controller||r.controller.my)||(delete Memory.rooms[e].t,delete Memory.rooms[e].index,delete Memory.rooms[e].towerSleep,delete Memory.rooms[e].roomlevel,delete Memory.rooms[e].spawnpos,delete Memory.rooms[e].basehauler,delete Memory.rooms[e].controllerLink,delete Memory.rooms[e].baseLink,delete Memory.rooms[e].baseLab,delete Memory.rooms[e].miningMinerals,delete Memory.rooms[e].basecourier,delete Memory.rooms[e].neighbours,delete Memory.rooms[e].scoutqueue,delete Memory.rooms[e].baseInLink,delete Memory.rooms[e].dumpSources,delete Memory.rooms[e].roads,delete Memory.rooms[e].signingqueue,delete Memory.rooms[e].orders,delete Memory.rooms[e].lab,delete Memory.rooms[e].nuker,delete Memory.rooms[e].observer,delete Memory.rooms[e].highwaysClose,delete Memory.rooms[e].observerCounter,delete Memory.rooms[e].powerbanks,delete Memory.rooms[e].isBeingDismantled)}}},{key:"deleteOldBanksFromMemory",value:function(){void 0===Memory.takenBanks&&(Memory.takenBanks=[])
for(var e=Memory.takenBanks.length;e--;)null===Memory.takenBanks[e]?Memory.takenBanks.splice(e,1):void 0!==Memory.takenBanks[e].tickGone&&Memory.takenBanks[e].tickGone<Game.time&&Memory.takenBanks.splice(e,1)}}]),r}()
r.MemoryManager=a},function(e,r,o){var t=o(5),n=o(29),a=o(14),i=function(e){function r(){_classCallCheck(this,r)
var e=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"IntelManager"))
return e.hasRun=!1,e.MEMORY_LASTRUN="lastRun",e}return _inherits(r,a.Manager),_createClass(r,[{key:"run",value:function(e){if(e===a.ManagerPriority.Standard){var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+8<Game.time){var o=!0,i=!1,s=void 0
try{for(var l,m=Object.keys(Game.rooms)[Symbol.iterator]();!(o=(l=m.next()).done);o=!0){var u=l.value
if(!n.roomIsHighway(u)){var y=Game.rooms[u]
t.saveIntelForRoom(y)}}}catch(e){i=!0,s=e}finally{try{!o&&m.return&&m.return()}finally{if(i)throw s}}this.setValue(this.MEMORY_LASTRUN,Game.time),this.hasRun=!0}}else if(e===a.ManagerPriority.Overflow&&!this.hasRun){var v=this.getValue(this.MEMORY_LASTRUN)
if(void 0===v||v+2<Game.time){var c=!0,d=!1,f=void 0
try{for(var g,R=Object.keys(Game.rooms)[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
if(!n.roomIsHighway(p)){var h=Game.rooms[p]
t.saveIntelForRoom(h)}}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}}}]),r}()
r.IntelManager=i},function(e,r,o){var t=o(11),n=o(10)
r.getAllRoomsBeingDismantled=function(){var e=[]
for(var r in Game.rooms){var o=Game.rooms[r]
void 0!==o.controller&&!0===o.controller.my&&!0===o.memory.isBeingDismantled&&e.push(o)}return e},r.wallsShouldBeRemoved=function(e){return!0===e.memory.removeWalls||void 0!==e.controller&&(1===e.controller.level||3===e.controller.level)},r.roomShouldHaveJanitors=function(e){if(void 0===e.storage){var r=e.getBaseContainer()
return n.getRoomLevel(e)>=t.RoomLevel.DefendedColony&&void 0!==e.controller&&void 0!==r&&r.store[RESOURCE_ENERGY]>500&&!e.isExpansion()}return n.getRoomLevel(e)>=t.RoomLevel.DefendedColony&&void 0!==e.controller&&e.storage.store[RESOURCE_ENERGY]>5e3&&!e.isExpansion()},r.roomShouldHaveBuilders=function(e){if(void 0===e.storage){var r=e.getBaseContainer()
return n.getRoomLevel(e)>=t.RoomLevel.DefendedColony&&void 0!==e.controller&&void 0!==r&&r.store[RESOURCE_ENERGY]>500&&!e.isExpansion()}return n.getRoomLevel(e)>=t.RoomLevel.DefendedColony&&void 0!==e.controller&&e.storage.store[RESOURCE_ENERGY]>1e4&&!e.isExpansion()},r.roomIsHighway=function(e){var r=/^[WE]([0-9]+)[NS]([0-9]+)$/.exec(e)
return r[1]%10==0||r[2]%10==0}},function(e,r,o){var t=o(14),n=o(19),a=o(3),i=o(31),s=o(32),l=o(18),m=o(10),u=o(20),y=o(34),v=o(16),c=o(17),d=o(11),f=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"UpgradeManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Critical)this.creepService.runCreeps(v.Role.UpgraderWithBoost,i.run)
else if(e===t.ManagerPriority.Low){this.creepService.runCreeps(v.Role.UpgraderWithoutBoost,i.run),this.creepService.runCreeps(v.Role.UpgraderHauler,s.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+20<Game.time){var o=this.roomService.getNormalAndNotExpansion()
this.setPraiseBoosting(o),this.buildUpgradeStorage(o),this.orderUpgradeUnits(o),this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"setPraiseBoosting",value:function(e){if(!0!==Memory.settings.slow){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
void 0===i.controller||i.isAbandoned()||i.isExpansion()||(i.controller.my&&i.controller.level<8&&void 0!==i.storage?i.storage.store[RESOURCE_ENERGY]>3e5&&!0!==i.memory.praiseBoost?(console.log("Automatic praiseboost started in room: "+i.name),i.memory.praiseBoost=!0,i.memory.praiseBoostAutomatic=!0):i.storage.store[RESOURCE_ENERGY]<1e5&&!0===i.memory.praiseBoost&&!0===i.memory.praiseBoostAutomatic&&(console.log("Automatic praiseboost stopped in room: "+i.name),i.memory.praiseBoost=void 0,i.memory.praiseBoostAutomatic=void 0):i.controller.my&&8===i.controller.level&&!0===i.memory.praiseBoost&&(i.memory.praiseBoost=void 0,i.memory.praiseBoostAutomatic=void 0))}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}}},{key:"buildUpgradeStorage",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
void 0===i.controller||i.isAbandoned()||(m.getRoomLevel(i)>=d.RoomLevel.SimpleColonyReadyForExpansion&&m.getRoomLevel(i)<d.RoomLevel.AdvancedColony?i.controller.buildControllerContainer():m.getRoomLevel(i)>=d.RoomLevel.AdvancedColony&&i.controller.buildControllerLink())}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"orderUpgradeUnits",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
void 0===i.controller||i.isAbandoned()||i.isExpansion()||(m.getRoomLevel(i)>=d.RoomLevel.DefendedColony&&(i.controller.hasContainer()||i.controller.hasLink())&&this.orderUpgraders(i.controller),i.memory.praiseBoost&&i.controller.level<8&&this.orderControllerHauler(i.controller))}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"orderControllerHauler",value:function(e){if(void 0!==e.room.storage){var r=Math.floor(2.5*this.creepService.getNumberOfTiers(v.Role.Upgrader,e.id)),o=a.getDistanseBetween(e.room.storage.pos,e.pos),t=Math.floor(r*o*2/100),i=this.creepService.getCreeps(v.Role.Upgrader,null,e.room.name),s=this.creepService.getNumberOfTiers(v.Role.UpgraderHauler,null,e.room.name),m=l.getNumberOfTiersInQueue(e.room,v.Role.UpgraderHauler)
if(i.length>1&&s+m<t){var y=Math.max(4,Math.min(t,n.getMaxTierHauler(e.room.energyCapacityAvailable))),d=new u.Order
d.body=n.getHaulerBody(y),d.priority=c.Priority.Standard,d.memory={role:v.Role.UpgraderHauler,target:e.id,tier:y},l.orderCreep(e.room,d)}}}},{key:"orderUpgraders",value:function(e){var r=1,o=this.creepService.getCreeps(v.Role.Upgrader,e.id),t=l.getCreepsInQueue(e.room,v.Role.Upgrader,e.id)
if(8===e.level){var a=2e5
if(!0===Memory.settings.powerfocus&&(a=45e4),!(e.ticksToDowngrade<1e4||void 0!==e.room.storage&&e.room.storage.store.energy>a))return
r=1}else if(void 0===e.room.storage&&y.roomIsFull(e.room)){var i=e.getContainer()
0===t&&i instanceof StructureContainer&&i.store[RESOURCE_ENERGY]>i.storeCapacity/2&&(r=Math.min(o.length+1,7))}else if(void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>2e5&&5===e.level)r=2
else if(void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]<3e4)return
var s=Math.floor(2.5*this.creepService.getNumberOfTiers(v.Role.Upgrader,e.id)),m=Math.floor(2.5*l.getNumberOfTiersInQueue(e.room,v.Role.Upgrader,e.id)),d=o.length
if(void 0!==e.room.storage){var f=!0,g=!1,R=void 0
try{for(var p,h=o[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
void 0!==E.ticksToLive&&E.ticksToLive<100&&d--}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}}var S=0
if(void 0!==e.room.storage&&(S+=e.room.storage.store[RESOURCE_ENERGY]),void 0!==e.room.terminal&&(S+=e.room.terminal.store[RESOURCE_ENERGY]),e.room.memory.praiseBoost&&e.level<8&&S>5e4&&(r=e.level<7?3:5),d+t<r&&(s+m<60||e.room.memory.praiseBoost)){var T=n.getMaxTierStationaryWorker(e.room.energyCapacityAvailable),C=void 0
8===e.level&&(T=Math.min(T,6)),!e.room.memory.praiseBoost&&void 0!==e.room.getBoostLab()&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]>=2e3&&(C=[RESOURCE_CATALYZED_GHODIUM_ACID])
var O=new u.Order
O.body=n.getStationaryWorkerBody(T),O.priority=c.Priority.Standard,d>3&&(O.priority=c.Priority.Low),O.memory={role:v.Role.Upgrader,target:e.id,tier:T,boost:C},l.orderCreep(e.room,O)}}}]),r}()
r.UpgradeManager=f},function(e,r){function o(e,r){var o=!0,t=!1,n=void 0
try{for(var a,i=_.range(-1,2)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value,l=!0,m=!1,u=void 0
try{for(var y,v=_.range(-1,2)[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value
if(0!==s||0!==c){var d=new RoomPosition(r.x+s,r.y+c,r.roomName),f=d.lookFor(LOOK_CREEPS),g=d.lookFor(LOOK_STRUCTURES)
if(0===f.length&&0===g.length)return void(e.memory.pos=d)}}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}e.memory.pos=e.pos}function t(e){var r=Game.getObjectById(e.memory.target)
if(r instanceof StructureController){var o=r.getContainerOrLink();(o instanceof StructureContainer||o instanceof StructureLink)&&(e.memory.container=o.id)}else console.log("Error with controller for upgrader: "+e.name)}r.run=function(e){var r=Game.getObjectById(e.memory.target)
void 0===r&&console.log("Upgrader without a valid controller: "+e.name),void 0===e.memory.container&&t(e)
var n=Game.getObjectById(e.memory.container)
if(null!==n)if((e.isEmpty()||e.carry.energy<35)&&e.withdraw(n,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE)e.travelTo(n)
else{var a=e.upgradeController(r)
if(a===OK||void 0!==e.memory.pos){if(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK),Game.time%10==0&&(void 0===e.memory.pos&&o(e,n.pos),void 0!==e.memory.pos.x&&void 0!==e.memory.pos.y&&void 0!==e.memory.pos.roomName&&(e.pos.x!==e.memory.pos.x||e.pos.y!==e.memory.pos.y))){var i=new RoomPosition(e.memory.pos.x,e.memory.pos.y,e.memory.pos.roomName)
i.lookFor(LOOK_CREEPS).length>0?e.memory.pos:e.moveTo(i)}}else if(a===ERR_NOT_IN_RANGE){if(void 0!==e.memory.pos&&void 0!==e.memory.pos.x&&void 0!==e.memory.pos.y&&void 0!==e.memory.pos.roomName&&(e.pos.x!==e.memory.pos.x||e.pos.y!==e.memory.pos.y)){var s=new RoomPosition(e.memory.pos.x,e.memory.pos.y,e.memory.pos.roomName)
if(!(s.lookFor(LOOK_CREEPS).length>0))return void e.moveTo(s)
e.memory.pos}e.travelTo(n)}}else e.memory.container=void 0}},function(e,r,o){function t(e){if(e.carry.energy<e.carryCapacity&&void 0!==e.room.storage){var r=e.pos.getRangeTo(e.room.storage.pos)
if(e.room.storage.store[RESOURCE_ENERGY]<2e3)return
r>1?e.moveTo(e.room.storage):e.withdraw(e.room.storage,RESOURCE_ENERGY)}else e.room.controller.hasContainer()?(e.setState(l.DropEnergyInContainer),a(e)):(e.setState(l.GiveEnergyToCreep),n(e))}function n(e){if(0===e.carry.energy)return s(e)?(e.setState(l.TankUp),void t(e)):void e.suicide()
var r=Game.getObjectById(e.memory.upgrader)
if((null===r||r.carry.energy>r.carryCapacity-50)&&(e.memory.upgrader=void 0,r=i(e)),null===r)return void 0===e.room.controller?void u.moveOffRoad(e):void(e.pos.getRangeTo(e.room.controller)>5?e.travelTo(e.room.controller):u.moveOffRoad(e))
e.pos.getRangeTo(r.pos)>1?e.moveTo(r):(e.transfer(r,RESOURCE_ENERGY),e.memory.upgrader=void 0)}function a(e){if(0===e.carry.energy)return s(e)?(e.setState(l.TankUp),void t(e)):void e.suicide()
var r=e.room.controller.getContainer()
if(void 0===r)return e.setState(l.GiveEnergyToCreep),void n(e)
e.pos.getRangeTo(r.pos)>1?e.moveTo(r):r.store[RESOURCE_ENERGY]<r.storeCapacity&&e.transfer(r,RESOURCE_ENERGY)}function i(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return e.memory.role===y.Role.Upgrader&&e.carry.energy<e.carryCapacity/2}})
if(r.length>0){var o=e.pos.findClosestByRange(r)
return e.memory.upgrader=o.id,o}return null}function s(e){if(void 0===e.room.storage)return!1
var r=m.getDistanseBetween(e.pos,e.room.storage.pos)
return e.ticksToLive>3*r}var l,m=o(3),u=o(33),y=o(16),v=o(7)
!function(e){e[e.TankUp=1]="TankUp",e[e.GiveEnergyToCreep=2]="GiveEnergyToCreep",e[e.DropEnergyInContainer=3]="DropEnergyInContainer"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.TankUp),e.getState()){case l.TankUp:t(e)
break
case l.GiveEnergyToCreep:n(e)
break
case l.DropEnergyInContainer:a(e)
break
default:v.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.TankUp)}}},function(e,r,o){function t(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0)if(i.value.structureType===STRUCTURE_ROAD){var l=a(e)
return e.moveTo(l),!0}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}return!1}function n(){var e=[TOP,TOP_RIGHT,RIGHT,BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT,LEFT,TOP_LEFT]
return e[Math.floor(Math.random()*e.length)]}function a(e){var r=PathFinder.search(e.pos,{pos:e.pos,range:10},{plainCost:1,swampCost:2,flee:!0,roomCallback:l.getOffroadRoomCallback,maxRooms:1}).path,o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value,m=s.lookFor(LOOK_STRUCTURES),u=s.lookFor(LOOK_CREEPS)
if(0===m.length&&0===u.length)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r[0]}function i(e,r){return PathFinder.search(e.pos,{pos:r,range:7},{plainCost:1,swampCost:10,flee:!0,roomCallback:l.getKitingRoomCallback,maxRooms:1}).path[0]}function s(e){return m.isSKRoom(e.room.name)}var l=o(3),m=o(10),u=o(5)
r.targetRoomHasInvaders=function(e,r){return!(r===e.getHomeroom()||!u.hasIntel(r)||!u.hasHostiles(r)||(e.room.name===r||e.room.name!==r&&(0===e.pos.x||49===e.pos.x||0===e.pos.y||49===e.pos.y)?e.travelToRoom(e.getHomeroom()):t(e),0))},r.moveHomeAndHealIfHurt=function(e){return e.hits<e.hitsMax-100&&(e.isInHomeroom()&&0!==e.pos.x&&49!==e.pos.x&&0!==e.pos.y&&49!==e.pos.y?t(e):e.travelToRoom(e.getHomeroom()),!0)},r.getTravelDestinasion=function(e){if(void 0!==e.memory._travel&&void 0!==e.memory._travel.dest&&void 0!==e.memory._travel.dest&&void 0!==e.memory._travel.dest.roomName)return new RoomPosition(e.memory._travel.dest.x,e.memory._travel.dest.y,e.memory._travel.dest.roomName)},r.isCloseToSourceKeeper=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5
return!!s(e)&&(e.pos.findInRange(FIND_HOSTILE_CREEPS,5).length>0||e.pos.findInRange(FIND_HOSTILE_STRUCTURES,o,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR&&void 0!==e.ticksToSpawn&&e.ticksToSpawn<r}}).length>0)},r.positionIsCloseToSourceKeeper=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:6
return!(!m.isSKRoom(e.roomName)||void 0===Game.rooms[e.roomName])&&(e.findInRange(FIND_HOSTILE_CREEPS,5).length>0||e.findInRange(FIND_HOSTILE_STRUCTURES,o,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR&&void 0!==e.ticksToSpawn&&e.ticksToSpawn<r}}).length>0)},r.stayAwayFromSourceKeeper=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5
if(!s(e))return!1
var n=e.pos.findInRange(FIND_HOSTILE_CREEPS,5)
if(n.length>0)return e.pos.getRangeTo(n[0])<o?e.moveTo(i(e,n[0].pos)):t(e),!0
var a=e.pos.findInRange(FIND_HOSTILE_STRUCTURES,o,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR&&void 0!==e.ticksToSpawn&&e.ticksToSpawn<r}})
return a.length>0&&(e.pos.getRangeTo(a[0])<o?e.moveTo(i(e,a[0].pos)):t(e),!0)},r.moveOffRoad=t,r.moveRandomDirection=function(e){e.move(n())}},function(e,r,o){var t=o(35)
r.roomIsFull=function(e){if(t.hasContainer(e)&&t.hasAtLeastExtensions(e,5)){if(e.energyAvailable<e.energyCapacityAvailable)return!1
var r=e.getBaseContainer()
if(void 0!==r&&!(r.store[RESOURCE_ENERGY]<r.storeCapacity-50)){var o=e.controller.getContainer()
return void 0===o||o.store[RESOURCE_ENERGY]>1e3}}return!1},r.getBuildingIdForTanking=function(e){if(void 0!==e.storage)return e.storage.id
var r=e.getBaseContainer()
if(r instanceof StructureContainer)return r.id
if(void 0!==e.terminal)return e.terminal.id
var o=e.find(FIND_STRUCTURES,{filter:{structureType:STRUCTURE_CONTAINER}}),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0)return i.value.id}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var l=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_SPAWN}}),m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0)return v.value.id}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return console.log("Error: No place found for tanking energy in room: "+e.name),""},r.getBuildingIdForDump=function(e,r){if(void 0!==e.storage&&e.storage.isActive())return e.storage.id
if(void 0!==e.terminal&&e.terminal.isActive())return e.terminal.id
var o=e.getBaseContainer()
if(void 0!==o&&o.store[RESOURCE_ENERGY]<1500)return o.id
var t=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),n=!0,a=!1,i=void 0
try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.energy<m.energyCapacity-50)return m.id}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}if(r.room.name===e.name){var u=r.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_EXTENSION||e.structureType===STRUCTURE_SPAWN)&&e.energy<e.energyCapacity}})
if(void 0!==u&&null!==u)return u.id}else{var y=e.find(FIND_MY_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_EXTENSION||e.structureType===STRUCTURE_SPAWN)&&e.energy<e.energyCapacity}})
if(y.length>0)return y[_.random(0,y.length-1)].id}var v=e.controller.getContainer()
if(v instanceof StructureContainer&&v.store[RESOURCE_ENERGY]<1e3&&o instanceof StructureContainer&&o.store[RESOURCE_ENERGY]>500)return v.id
if(v instanceof StructureContainer&&v.store[RESOURCE_ENERGY]<v.storeCapacity-100&&o instanceof StructureContainer&&o.store[RESOURCE_ENERGY]===o.storeCapacity)return v.id
if(o instanceof StructureContainer)return o.id
var c=e.getSpawn()
return void 0!==c?c.id:(console.log("Error: No place found for dumping energy in room: "+e.name),"")}},function(e,r,o){function t(){var e=[]
for(var r in Game.rooms){var o=Game.rooms[r]
void 0!==o.controller&&!0===o.controller.my&&!0!==o.memory.isBeingDismantled&&!0!==o.memory.isPraiseRoom&&e.push(o)}return e}var n=o(5),a=o(10)
r.getAllControlledRooms=t,r.getAllPraiseRooms=function(){var e=[]
for(var r in Game.rooms){var o=Game.rooms[r]
void 0!==o.controller&&!0===o.controller.my&&!0!==o.memory.isBeingDismantled&&!0===o.memory.isPraiseRoom&&e.push(o)}return e},r.getMinerals=function(){var e={},r=t(),o=!0,i=!1,s=void 0
try{for(var l,m=r[Symbol.iterator]();!(o=(l=m.next()).done);o=!0){var u=l.value,y=u.getMineral()
if(y instanceof Mineral&&(void 0!==e[y.mineralType]?e[y.mineralType]++:e[y.mineralType]=1),void 0!==u.memory.praiseroom&&!u.memory.praiseroomHibernated){var v=u.memory.praiseroom
if(Game.rooms[v]instanceof Room){var c=Game.rooms[v].getMineral()
c instanceof Mineral&&(void 0!==e[c.mineralType]?e[c.mineralType]++:e[c.mineralType]=1)}}if(void 0!==u.memory.poaching){var d=!0,f=!1,g=void 0
try{for(var R,p=u.memory.poaching[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value,E=n.mineralType(h)
void 0!==E&&(void 0!==e[E]?e[E]++:e[E]=1)}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}var S=a.getLairOutposts(u),T=!0,C=!1,O=void 0
try{for(var M,_=S[Symbol.iterator]();!(T=(M=_.next()).done);T=!0){var b=M.value,w=n.mineralType(b)
void 0!==w&&(void 0!==e[w]?e[w]++:e[w]=1)}}catch(e){C=!0,O=e}finally{try{!T&&_.return&&_.return()}finally{if(C)throw O}}}}catch(e){i=!0,s=e}finally{try{!o&&m.return&&m.return()}finally{if(i)throw s}}return e},r.hasContainer=function(e){return void 0!==e.getBaseContainer()},r.getOutpostMineralContainers=function(e){var r=[],o=a.getLairOutposts(e),t=!0,n=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(t=(s=l.next()).done);t=!0){var m=s.value
if(void 0!==Game.rooms[m]){var u=Game.rooms[m].getMineral()
if(void 0!==u){var y=u.getMiningContainer()
null!==y&&r.push(y)}}}}catch(e){n=!0,i=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw i}}return r},r.getProcessingLabs=function(e){var r=a.getBasePosition(e)
if(void 0===r)return[]
var o=r,t=[],n=[[-1,5],[-1,6],[-1,7],[0,7],[1,7],[2,5],[2,6]],i=!0,s=!1,l=void 0
try{for(var m,u=n[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value,v=new RoomPosition(o.x+y[0],o.y+y[1],o.roomName).lookFor(LOOK_STRUCTURES),c=!0,d=!1,f=void 0
try{for(var g,R=v[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
p.structureType===STRUCTURE_LAB&&t.push(p.id)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return t},r.getSupplyLabs=function(e){var r=a.getBasePosition(e)
if(void 0===r)return[]
var o=r,t=[],n=[[0,5],[1,6]],i=!0,s=!1,l=void 0
try{for(var m,u=n[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value,v=new RoomPosition(o.x+y[0],o.y+y[1],o.roomName).lookFor(LOOK_STRUCTURES),c=!0,d=!1,f=void 0
try{for(var g,R=v[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
p.structureType===STRUCTURE_LAB&&t.push(p.id)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return t},r.hasAtLeastExtensions=function(e,r){return e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_EXTENSION}}).length>=r},r.hasAtLeastSpawns=function(e,r){return e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_SPAWN}}).length>=r},r.hasAtLeastLabs=function(e,r){return e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_LAB}}).length>=r},r.hasActiveTower=function(e){var r=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.energy<s.energyCapacity/2)return!1}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r.length>0},r.hasTerminal=function(e){return void 0!==e.terminal&&e.terminal.my&&e.terminal.isActive()},r.hasStorage=function(e){return void 0!==e.storage&&e.storage.my&&e.storage.isActive()},r.roomlevelIsAt=function(e,r){return a.getRoomLevel(e)===r},r.controllerLevelAtLeast=function(e,r){return e.controller.level>=r},r.controllerLevelBelow=function(e,r){return e.controller.level<r}},function(e,r,o){var t=o(14),n=function(e){function r(){return _classCallCheck(this,r),_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"InterfaceManager"))}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Trivial){if(Game.flags.Layout instanceof Flag){var r=Game.flags.Layout.pos
new RoomVisual(r.roomName).rect(r.x-4.5,r.y-3.5,9,10),new RoomVisual(r.roomName).rect(r.x-.5,r.y+6.5,3,1)}if(Game.flags.Base instanceof Flag){var o=Game.flags.Base.pos
new RoomVisual(o.roomName).rect(o.x-3.5,o.y-1.5,7,5),new RoomVisual(o.roomName).rect(o.x-5.5,o.y-6.5,11,5),new RoomVisual(o.roomName).rect(o.x-2.5,o.y+3.5,5,4),new RoomVisual(o.roomName).rect(o.x-6.5,o.y-.5,3,5),new RoomVisual(o.roomName).rect(o.x+3.5,o.y-.5,3,5)}if(Game.flags.Pacman instanceof Flag){var n=Game.flags.Pacman.pos,a=[]
a.push(new RoomPosition(n.x-.5,n.y+4.5,n.roomName)),a.push(new RoomPosition(n.x+4.5,n.y-.5,n.roomName)),a.push(new RoomPosition(n.x+11.5,n.y-.5,n.roomName)),a.push(new RoomPosition(n.x+15.5,n.y+3.5,n.roomName)),a.push(new RoomPosition(n.x+20.5,n.y+6.5,n.roomName)),a.push(new RoomPosition(n.x+20.5,n.y+9.5,n.roomName)),a.push(new RoomPosition(n.x+15.5,n.y+12.5,n.roomName)),a.push(new RoomPosition(n.x+11.5,n.y+16.5,n.roomName)),a.push(new RoomPosition(n.x+4.5,n.y+16.5,n.roomName)),a.push(new RoomPosition(n.x-.5,n.y+11.5,n.roomName)),a.push(new RoomPosition(n.x-.5,n.y+4.5,n.roomName)),new RoomVisual(n.roomName).poly(a)}if(Game.flags.Ayce instanceof Flag){var i=Game.flags.Ayce.pos
new RoomVisual(i.roomName).rect(i.x-.5,i.y-.5,20,5)}}}}]),r}()
r.InterfaceManager=n},function(e,r,o){var t=o(14),n=o(19),a=o(38),i=o(39),s=o(18),l=o(10),m=o(20),u=o(16),y=o(11),v=o(17),c=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"LogisticsManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Critical){this.creepService.runCreeps(u.Role.BaseHauler,a.run),this.creepService.runCreeps(u.Role.BaseCourier,i.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+10<Game.time){var o=this.roomService.getNormalAndNotExpansion()
this.orderTransportUnits(o),this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"orderTransportUnits",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
this.shouldOrderBaseCourier(i)&&this.orderBaseCourier(i),this.shouldOrderBaseHaulers(i)&&this.orderBaseHauler(i)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"shouldOrderBaseCourier",value:function(e){if(l.getRoomLevel(e)<y.RoomLevel.AdvancedColony)return!1
var r=s.getCreepsInQueue(e,u.Role.BaseCourier,e.name),o=this.creepService.getCreeps(u.Role.BaseCourier,e.name)
return!(r+o.length>0)||0===r&&1===o.length&&o[0].ticksToLive<100}},{key:"shouldOrderBaseHaulers",value:function(e){if(e.isExpansion()||l.getRoomLevel(e)<y.RoomLevel.DefendedColony)return!1
if((void 0===e.storage||!e.storage.isActive())&&void 0===e.getBaseContainer())return!1
var r=s.getCreepsInQueue(e,u.Role.BaseHauler,e.name),o=this.creepService.getCreeps(u.Role.BaseHauler,e.name)
return!!(e.isUnderSiege()&&r+o.length<2&&void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>2e4)||(r>0?!!(0===o.length&&r<2&&s.orderedBaseHaulerIsTooExpensive(e)):l.getRoomLevel(e)===y.RoomLevel.CivilizedColony&&void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>2e5&&o.length<2||(!(o.length>0)||o[0].ticksToLive<200&&1===o.length))}},{key:"orderBaseHauler",value:function(e){var r=n.getMaxTierHauler(e.energyCapacityAvailable),o=this.creepService.getCreeps(u.Role.BaseHauler,e.name).length
0===o&&(r=n.getMaxTierHauler(e.energyAvailable))<1&&(r=1)
var t=new m.Order
t.body=n.getHaulerBody(r),o>0&&e.isUnderSiege()?t.priority=v.Priority.Important:void 0===e.storage?t.priority=v.Priority.Low:t.priority=v.Priority.Blocker,t.memory={role:u.Role.BaseHauler,target:e.name,tier:r},s.orderCreep(e,t)}},{key:"orderBaseCourier",value:function(e){var r=n.getMaxTierHauler(e.energyCapacityAvailable),o=Math.ceil(r/2),t=new m.Order
t.body=n.getHaulerBody(o),t.priority=v.Priority.Important,t.memory={role:u.Role.BaseCourier,target:e.name,tier:o},s.orderCreep(e,t)}}]),r}()
r.LogisticsManager=c},function(e,r,o){function t(e){if(void 0!==e.memory.parkingPos&&void 0!==e.memory.parkingPos.x&&void 0!==e.memory.parkingPos.y&&void 0!==e.memory.parkingPos.roomName){var r=new RoomPosition(e.memory.parkingPos.x,e.memory.parkingPos.y,e.memory.parkingPos.roomName)
return e.pos.x===r.x&&e.pos.y===r.y?void(e.memory.sleepUntil=Game.time+5):void e.moveTo(r)}var o=void 0,t=m.getBasePosition(e.room)
o=void 0!==t?new RoomPosition(t.x,t.y-1,t.roomName):e.pos,e.memory.parkingPos=o,e.moveTo(o)}function n(e){for(var r=[-1,0,1],o=0;o<r.length;o++)for(var t=r[o],n=[-1,0,1],a=0;a<n.length;a++){var i=n[a]
if((0!==t||0!==i)&&e.pos.x+t>0&&e.pos.x+t<49&&e.pos.y+i>0&&e.pos.y+i<49){var s=new RoomPosition(e.pos.x+t,e.pos.y+i,e.pos.roomName).lookFor(LOOK_STRUCTURES),l=!0,m=!1,u=void 0
try{for(var y,v=s[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value
if((c.structureType===STRUCTURE_EXTENSION||c.structureType===STRUCTURE_SPAWN)&&c.energy<c.energyCapacity)return void e.transfer(c,RESOURCE_ENERGY)}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}}}}function a(e){if(void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]<1e5&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>6e4)return e.memory.tankingBuilding=e.room.terminal.id,e.room.terminal
if(void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>15e4)return e.memory.tankingBuilding=e.room.terminal.id,e.room.terminal
if(void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]<8e3&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>1e4)return e.memory.tankingBuilding=e.room.terminal.id,e.room.terminal
if(void 0===e.room.storage||0===e.room.storage.store[RESOURCE_ENERGY]){var r=e.room.getBaseContainer()
if(void 0!==r&&r.store[RESOURCE_ENERGY]>0)return e.memory.tankingBuilding=r.id,r
if(void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>0)return e.memory.tankingBuilding=e.room.terminal.id,e.room.terminal
var o=e.pos.findClosestByRange(FIND_STRUCTURES,{filter:function(r){return r.structureType===STRUCTURE_CONTAINER&&r.store[RESOURCE_ENERGY]>=e.carryCapacity/3}})
if(null!==o&&void 0!==o)return e.memory.tankingBuilding=o.id,o
if(void 0===e.room.storage)return e.memory.tankingBuilding=void 0,null}return e.memory.tankingBuilding=e.room.storage.id,e.room.storage}function i(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return e instanceof StructureTower&&e.energy<e.energyCapacity-400&&e.id!==r}})
if(o.length>0)e.memory.dropofBuilding=o[0].id
else{if(e.room.energyAvailable<e.room.energyCapacityAvailable){var t=s(e,1,r)
if(void 0!==t)return void(e.memory.dropofBuilding=t.id)
var n=s(e,2,r)
if(void 0!==n)return void(e.memory.dropofBuilding=n.id)}var a=45e4
!0===Memory.settings.powerfocus&&(a=2e5)
var i=e.room.getPowerSpawn()
if(void 0!==i&&i.energy<1e3&&void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>a)e.memory.dropofBuilding=i.id
else{var u=e.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter:function(e){return e.id!==r&&(e instanceof StructureTower&&e.energy<e.energyCapacity-200||e instanceof StructureLab)&&e.energy<e.energyCapacity}})
if(null===u){if(e.room.energyAvailable<e.room.energyCapacityAvailable){var y=e.pos.findClosestByRange(FIND_MY_STRUCTURES,{filter:function(e){return e.id!==r&&(e instanceof StructureSpawn||e instanceof StructureExtension)&&e.energy<e.energyCapacity}})
if(null!==y)return void(e.memory.dropofBuilding=y.id)}var v=e.room.terminal
if(void 0!==v&&v.store[RESOURCE_ENERGY]<5e4&&void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>5e4)e.memory.dropofBuilding=v.id
else if(void 0!==v&&v.store[RESOURCE_ENERGY]<1e5&&m.getRoomLevel(e.room)>=l.RoomLevel.Town&&void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>2e5)e.memory.dropofBuilding=v.id
else{var c=e.room.getNuker()
if(void 0!==c&&c.energy<c.energyCapacity&&void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>15e4)e.memory.dropofBuilding=c.id
else if(void 0!==i&&i.energy<i.energyCapacity-1e3&&void 0!==e.room.storage&&e.room.storage.store[RESOURCE_ENERGY]>a)e.memory.dropofBuilding=i.id
else if(void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.storage.store[RESOURCE_ENERGY]<5e3&&e.room.terminal.store[RESOURCE_ENERGY]>2e4)e.memory.dropofBuilding=e.room.storage.id
else if(void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>15e4)e.memory.dropofBuilding=e.room.storage.id
else if((o=e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return e instanceof StructureTower&&e.energy<e.energyCapacity&&e.id!==r}})).length>0)e.memory.dropofBuilding=o[0].id
else{if(m.getRoomLevel(e.room)<l.RoomLevel.AdvancedColony&&void 0!==e.room.storage){var d=e.room.controller.getContainer()
if(void 0!==d&&d.store[RESOURCE_ENERGY]<1e3)return void(e.memory.dropofBuilding=d.id)}e.memory.dropofBuilding=void 0}}}else e.memory.dropofBuilding=u.id}}}function s(e,r,o){var t=!0,n=!1,a=void 0
try{for(var i,s=_.range(-r,r+1)[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value,m=!0,u=!1,y=void 0
try{for(var v,c=_.range(-r,r+1)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if((Math.abs(l)===r||Math.abs(d)===r)&&e.pos.x+l>0&&e.pos.x+l<49&&e.pos.y+d>0&&e.pos.y+d<49){var f=new RoomPosition(e.pos.x+l,e.pos.y+d,e.pos.roomName).lookFor(LOOK_STRUCTURES),g=!0,R=!1,p=void 0
try{for(var h,E=f[Symbol.iterator]();!(g=(h=E.next()).done);g=!0){var S=h.value
if(S.structureType===STRUCTURE_EXTENSION||S.structureType===STRUCTURE_SPAWN||S.structureType===STRUCTURE_LAB){var T=S
if(T.energy<T.energyCapacity&&T.id!==o)return T}}}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}}}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}var l=o(11),m=o(10)
r.run=function(e){if(!(void 0!==e.memory.sleepUntil&&e.memory.sleepUntil>Game.time)){var r=Game.getObjectById(e.memory.tankingBuilding),o=Game.getObjectById(e.memory.dropofBuilding)
if(e.room.memory.basehauler=e.id,(null===r||r instanceof StructureStorage&&0===r.store[RESOURCE_ENERGY]||r instanceof StructureContainer&&0===r.store[RESOURCE_ENERGY])&&(e.carry[RESOURCE_ENERGY]>0?(e.stopTanking(),o=null):r=a(e)),e.ticksToLive<20&&e.room.storage instanceof StructureStorage)return e.moveTo(e.room.storage),e.transfer(e.room.storage,RESOURCE_ENERGY),void(0===e.carry[RESOURCE_ENERGY]&&e.suicide())
if(!e.isTanking()&&e.carry.energy<50&&(e.startTanking(),r=a(e)),e.isFinishedTanking()&&(e.stopTanking(),o=null),(null===o||o instanceof StructureContainer&&o.store[RESOURCE_ENERGY]===o.storeCapacity||!(o instanceof StructureContainer)&&o.energy===o.energyCapacity)&&(i(e),o=Game.getObjectById(e.memory.dropofBuilding)),null!==o){if(null!==r)if(e.isTanking()){var s=e.withdraw(r,RESOURCE_ENERGY)
if(s===ERR_NOT_IN_RANGE&&e.moveTo(r),s===ERR_NOT_ENOUGH_RESOURCES)e.memory.tankingBuilding=void 0
else for(var l in e.carry)l!==RESOURCE_ENERGY&&e.transfer(r,l)}else{var m=e.transfer(o,RESOURCE_ENERGY)
if(m===ERR_NOT_IN_RANGE)e.moveTo(o),n(e)
else if(m===OK){if(o.structureType===STRUCTURE_TOWER&&(e.memory.dropofBuilding=void 0),e.carry[RESOURCE_ENERGY]-50<o.energyCapacity-o.energy)return e.startTanking(),void e.moveTo(r)
i(e,o.id),null!==(o=Game.getObjectById(e.memory.dropofBuilding))&&e.moveTo(o)}}}else t(e)}}},function(e,r,o){function t(e){if(h.getRoomLevel(e.room)>=R.RoomLevel.Town&&void 0!==e.room.storage&&void 0!==e.room.terminal){var r=!0,o=!1,t=void 0
try{for(var n,a=Object.keys(e.room.storage.store)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(i!==RESOURCE_POWER&&i!==RESOURCE_ENERGY&&(void 0===e.room.terminal.store[i]||e.room.terminal.store[i]<12e3))return e.memory.moveMineral=i,void(e.memory.task=g.MoveStorageMinerals)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}if(e.ticksToLive>100){if(void 0!==e.room.memory.lab&&void 0!==e.room.memory.lab.supplyJobs&&2===e.room.memory.lab.supplyJobs.length)return void(e.memory.task=g.SupplyLabs)
if(void 0!==e.room.memory.lab&&e.room.memory.lab.labstatus===p.Labstatus.EmptyingLabs)return void(e.memory.task=g.EmptyingLabs)
if(void 0!==e.room.memory.lab&&e.room.memory.lab.labstatus===p.Labstatus.EmptyingAllLabs)return void(e.memory.task=g.EmptyingAllLabs)}var s=e.room.getPowerSpawn()
if(0===e.carry[RESOURCE_ENERGY]&&void 0!==s&&s.power<20&&(void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_POWER]>0||void 0!==e.room.storage&&e.room.storage.store[RESOURCE_POWER]>0))e.memory.task=g.PowerDelivery
else{var l=e.room.getNuker()
if(0===e.carry[RESOURCE_ENERGY]&&void 0!==l&&l.ghodium<l.ghodiumCapacity&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_GHODIUM]>3e3)e.memory.task=g.SupplyNuker
else{if(h.getRoomLevel(e.room)>=R.RoomLevel.AdvancedColony){var m=e.room.getBaseLink()
if(void 0!==m&&m.energy<400)return void(e.memory.task=g.BaselinkLoading)}if(h.getRoomLevel(e.room)>=R.RoomLevel.Metropolis&&void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.storage.store[RESOURCE_POWER]>12e3&&(e.room.terminal.store[RESOURCE_POWER]<12e3||void 0===e.room.terminal.store[RESOURCE_POWER]))e.memory.task=g.PowerToTerminal
else{if(!(void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_POWER]>2e4)){var u=e.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter:function(r){return r.amount>e.carryCapacity/2}})
return null!==u?(e.memory.scavengeDropId=u.id,void(e.memory.task=g.Scavenging)):void 0}e.memory.task=g.PowerFromTerminal}}}}function n(e){if(void 0===e.memory.parkingPos||void 0===e.memory.parkingPos.x||void 0===e.memory.parkingPos.y||void 0===e.memory.parkingPos.roomName){var r=void 0,o=h.getBasePosition(e.room)
r=void 0!==o?new RoomPosition(o.x,o.y+4,o.roomName):e.pos,e.memory.parkingPos=r,e.moveTo(r)}else{var t=new RoomPosition(e.memory.parkingPos.x,e.memory.parkingPos.y,e.memory.parkingPos.roomName)
if(e.pos.x===t.x&&e.pos.y===t.y)return
e.moveTo(t)}}function a(e){return void 0===e.memory.moveMineral||void 0===e.room.terminal||void 0===e.room.storage?(e.memory.moveMineral=void 0,void(e.memory.task=void 0)):void 0===e.carry[e.memory.moveMineral]&&(void 0===e.room.storage.store[e.memory.moveMineral]||e.room.terminal.store[e.memory.moveMineral]>12e3)?(e.memory.moveMineral=void 0,void(e.memory.task=void 0)):void(void 0===e.carry[e.memory.moveMineral]?e.withdraw(e.room.storage,e.memory.moveMineral)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.storage):e.transfer(e.room.terminal,e.memory.moveMineral)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.terminal))}function i(e){if(void 0!==e.room.memory.lab&&void 0!==e.room.terminal){var r=e.room.terminal
if(e.carryCapacity===_.sum(e.carry))if(e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE)e.moveTo(r)
else{var o=!0,t=!1,n=void 0
try{for(var a,i=Object.keys(e.carry)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
e.transfer(r,s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}else{var l=_.filter(e.room.getProcessingLabs(),function(e){return e.mineralAmount>0})
if(0===l.length)if(_.sum(e.carry)>0)if(e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE)e.moveTo(r)
else{var m=!0,u=!1,y=void 0
try{for(var v,c=Object.keys(e.carry)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
e.transfer(r,d)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}else e.memory.task=void 0
else{var f=e.pos.findClosestByPath(l)
_.isNull(f)||e.withdraw(f,f.mineralType)!==ERR_NOT_IN_RANGE||e.moveTo(f)}}}else e.memory.task=void 0}function s(e){if(void 0!==e.room.memory.lab&&void 0!==e.room.terminal){var r=e.room.terminal
if(e.carryCapacity===_.sum(e.carry))if(e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE)e.moveTo(r)
else{var o=!0,t=!1,n=void 0
try{for(var a,i=Object.keys(e.carry)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
e.transfer(r,s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}else{var l=_.filter(e.room.getProcessingLabs().concat(e.room.getSupplyingLabs()),function(e){return e.mineralAmount>0})
if(0===l.length)if(_.sum(e.carry)>0)if(e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE)e.moveTo(r)
else{var m=!0,u=!1,y=void 0
try{for(var v,c=Object.keys(e.carry)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
e.transfer(r,d)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}else e.memory.task=void 0
else{var f=e.pos.findClosestByPath(l)
_.isNull(f)||e.withdraw(f,f.mineralType)!==ERR_NOT_IN_RANGE||e.moveTo(f)}}}else e.memory.task=void 0}function l(e){if(void 0!==e.room.memory.lab&&void 0!==e.room.memory.lab.supplyJobs&&2===e.room.memory.lab.supplyJobs.length&&void 0!==e.room.terminal){var r=e.room.memory.lab.supplyJobs[0],o=Game.getObjectById(r.lab)
if(o.mineralAmount<r.amount)m(e,r.mineral,r.amount,o)
else{var t=e.room.memory.lab.supplyJobs[1],n=Game.getObjectById(t.lab)
n.mineralAmount<t.amount&&m(e,t.mineral,t.amount,n)}}else e.memory.task=void 0}function m(e,r,o,t){if(void 0!==e.room.terminal){var n=t.mineralAmount,a=e.room.terminal
if(void 0===e.carry[r]&&_.sum(e.carry)>0||t.mineralType!==r&&t.mineralAmount>0)if(_.sum(e.carry)>0)if(e.pos.getRangeTo(e.room.terminal)>1)e.moveTo(e.room.terminal)
else{var i=!0,s=!1,l=void 0
try{for(var m,u=Object.keys(e.carry)[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
e.transfer(e.room.terminal,y)}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}}else e.pos.getRangeTo(t)>1?e.moveTo(t):e.withdraw(t,t.mineralType)
else if(void 0===e.carry[r]){var v=o-n,c=e.withdraw(a,r,Math.min(v,e.carryCapacity))
c===ERR_NOT_IN_RANGE?e.moveTo(a):c===ERR_NOT_ENOUGH_RESOURCES&&(e.memory.task=void 0)}else e.transfer(t,r)===ERR_NOT_IN_RANGE&&e.moveTo(t)}}function u(e){var r=Game.getObjectById(e.memory.scavengeDropId)
if(void 0===e.room.storage)return e.memory.scavengeDropId=void 0,void(e.memory.task=void 0)
if(0===_.sum(e.carry))null===r?(e.memory.scavengeDropId=void 0,e.memory.task=void 0):e.pickup(r)===ERR_NOT_IN_RANGE&&e.moveTo(r)
else if(e.pos.getRangeTo(e.room.storage)>1)e.moveTo(e.room.storage)
else for(var o in e.carry)e.transfer(e.room.storage,o)}function y(e){if(e.carry[RESOURCE_POWER]>0&&void 0!==e.room.storage)e.transfer(e.room.storage,RESOURCE_POWER)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.storage)
else{var r=e.room.getBaseLink()
void 0===e.room.storage||void 0===r||r.energy===r.energyCapacity&&0===e.carry[RESOURCE_ENERGY]?e.memory.task=void 0:0===e.carry[RESOURCE_ENERGY]?e.withdraw(e.room.storage,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.storage):r.energy<r.energyCapacity?e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.moveTo(r):e.transfer(e.room.storage,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.storage)}}function v(e){void 0===e.carry[RESOURCE_POWER]&&(void 0===e.room.storage||void 0===e.room.terminal||e.room.storage.store[RESOURCE_POWER]<12e3||e.room.terminal.store[RESOURCE_POWER]>12e3)?e.memory.task=void 0:void 0!==e.room.storage&&void 0!==e.room.terminal?void 0===e.carry[RESOURCE_POWER]?e.withdraw(e.room.storage,RESOURCE_POWER)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.storage):e.transfer(e.room.terminal,RESOURCE_POWER)===ERR_NOT_IN_RANGE?e.moveTo(e.room.terminal):e.memory.task=void 0:e.memory.task=void 0}function c(e){void 0===e.carry[RESOURCE_POWER]&&(void 0===e.room.storage||void 0===e.room.terminal||e.room.terminal.store[RESOURCE_POWER]<2e4)?e.memory.task=void 0:void 0!==e.room.storage&&void 0!==e.room.terminal?void 0===e.carry[RESOURCE_POWER]?e.withdraw(e.room.terminal,RESOURCE_POWER)===ERR_NOT_IN_RANGE&&e.moveTo(e.room.terminal):e.transfer(e.room.storage,RESOURCE_POWER)===ERR_NOT_IN_RANGE?e.moveTo(e.room.storage):e.memory.task=void 0:e.memory.task=void 0}function d(e){var r=e.room.getNuker()
if(void 0===r||void 0===e.room.terminal||void 0===e.carry[RESOURCE_GHODIUM]&&(void 0===e.room.terminal||void 0===e.room.terminal.store[RESOURCE_GHODIUM]||e.room.terminal.store[RESOURCE_GHODIUM]<3e3))e.memory.task
else if(void 0===e.carry[RESOURCE_GHODIUM]){var o=e.room.terminal.store[RESOURCE_GHODIUM]
if(void 0===o)return
var t=r.ghodiumCapacity-r.ghodium
e.withdraw(e.room.terminal,RESOURCE_GHODIUM,Math.min(o,t,e.carryCapacity))===ERR_NOT_IN_RANGE&&e.moveTo(e.room.terminal)}else e.transfer(r,RESOURCE_GHODIUM)===ERR_NOT_IN_RANGE?e.moveTo(r):e.memory.task=void 0}function f(e){var r=e.room.getPowerSpawn()
if(void 0!==e.room.storage&&void 0!==r&&(void 0!==e.carry[RESOURCE_POWER]||void 0!==e.room.storage.store[RESOURCE_POWER]||void 0!==e.room.terminal&&void 0!==e.room.terminal.store[RESOURCE_POWER])){var o=e.room.storage
if(void 0!==e.room.terminal&&void 0===e.room.storage.store[RESOURCE_POWER]&&e.room.terminal.store[RESOURCE_POWER]>0&&(o=e.room.terminal),void 0===e.carry[RESOURCE_POWER]){var t=o.store[RESOURCE_POWER]
if(void 0===t)return
var n=r.powerCapacity-r.power
e.withdraw(o,RESOURCE_POWER,Math.min(t,n))===ERR_NOT_IN_RANGE&&e.moveTo(o)}else e.transfer(r,RESOURCE_POWER)===ERR_NOT_IN_RANGE?e.moveTo(r):e.memory.task=void 0}else e.memory.task}var g,R=o(11),p=o(40),h=o(10)
!function(e){e[e.PowerDelivery=2]="PowerDelivery",e[e.BaselinkLoading=3]="BaselinkLoading",e[e.Scavenging=4]="Scavenging",e[e.PowerToTerminal=5]="PowerToTerminal",e[e.SupplyLabs=6]="SupplyLabs",e[e.EmptyingLabs=7]="EmptyingLabs",e[e.MoveStorageMinerals=8]="MoveStorageMinerals",e[e.SupplyNuker=9]="SupplyNuker",e[e.EmptyingAllLabs=10]="EmptyingAllLabs",e[e.PowerFromTerminal=11]="PowerFromTerminal"}(g||(g={}))
r.run=function(e){if(!(void 0!==e.memory.sleepUntil&&e.memory.sleepUntil>Game.time))if(e.room.memory.basecourier=e.id,e.ticksToLive<20&&e.room.storage instanceof StructureStorage){e.moveTo(e.room.storage)
for(var r in e.carry)e.transfer(e.room.storage,r)
0===_.sum(e.carry)&&e.suicide()}else switch(void 0===e.memory.task&&t(e),void 0===e.memory.task&&(e.memory.sleepUntil=Game.time+10),e.memory.task){case g.PowerDelivery:f(e)
break
case g.SupplyNuker:d(e)
break
case g.BaselinkLoading:y(e)
break
case g.Scavenging:u(e)
break
case g.PowerToTerminal:v(e)
break
case g.PowerFromTerminal:c(e)
break
case g.MoveStorageMinerals:a(e)
break
case g.SupplyLabs:l(e)
break
case g.EmptyingLabs:i(e)
break
case g.EmptyingAllLabs:s(e)
break
default:n(e)}}},function(e,r){!function(e){e[e.Inactive=0]="Inactive",e[e.GettingMineralsToTerminal=1]="GettingMineralsToTerminal",e[e.MovingMineralsToLab=2]="MovingMineralsToLab",e[e.RunningReactions=3]="RunningReactions",e[e.EmptyingLabs=4]="EmptyingLabs",e[e.EmptyingAllLabs=5]="EmptyingAllLabs"}(r.Labstatus||(r.Labstatus={}))
r.Labstatus},function(e,r,o){function t(e){var r=e.find(FIND_FLAGS,{filter:function(e){return"Spawn"===e.name}})
void 0!==r&&1===r.length&&Object.keys(Game.constructionSites).length<95&&(r[0].pos.createConstructionSite(STRUCTURE_SPAWN),r[0].remove())}function n(e){var r=Game.rooms[e.memory.expansion]
if(!(r instanceof Room))return 0
var o=r.getSources().length,t=p.getBasicOutposts(r),n=!0,a=!1,i=void 0
try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
S.hasIntel(m)?o+=S.sourceCount(m):g.orderScouting(e,m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o}function a(e){if(void 0===e.memory.expansionTargets){if(void 0===e.memory.neighbours||void 0===e.memory.neighbours.threeAway||void 0===e.memory.neighbours.fourAway||void 0===e.memory.neighbours.fiveAway)return!1
var r=e.memory.neighbours.threeAway.concat(e.memory.neighbours.fourAway,e.memory.neighbours.fiveAway)
e.memory.expansionTargets={}
var o=!0,t=!1,n=void 0
try{for(var a,s=r[Symbol.iterator]();!(o=(a=s.next()).done);o=!0){var l=a.value
h.roomIsHighway(l)||p.isMiddleRoom(l)||(e.memory.expansionTargets[l]=!0)}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}}var m=!0,u=!1,y=void 0
try{for(var v,c=Object.keys(e.memory.expansionTargets)[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(!0===e.memory.expansionTargets[d]){var f=i(d)
if(void 0!==f){var g=T.findSpawnLocation(d)
return e.memory.expansionTargets[d]=void 0!==g&&f+g.value,!0}}}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return!1}function i(e){var r=S.sourceIds(e),o=S.controllerId(e)
if(0!==r.length&&null!==o){var t=s(e)
r.length>1&&(t=100)
var n=l(e)
if(void 0!==n)return t+=n,console.log("Expansion-value for "+e+" is "+t),t}}function s(e){var r=0,o=0,t=void 0,n=!0,a=!1,i=void 0
try{for(var s,l=_.range(1,49)[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value,u=!0,y=!1,v=void 0
try{for(var c,d=_.range(1,49)[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
"swamp"===(t=Game.map.getTerrainAt(m,f,e))?o++:"plain"===t&&r++}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return 0===o?60:0===r?0:r>o?30:Math.max(Math.min(Math.ceil(r/o*30-30),60),-30)}function l(e){var r=f.getRoomsOneAway(e),o=f.getRoomsTwoAway(e),t=r.concat(o),n=0,a=6
_.filter(r,function(e){return p.isSKRoom(e)}).length>0&&(n+=100,a=4)
var i=_.filter(t,function(e){return!h.roomIsHighway(e)&&!p.isMiddleRoom(e)}),s=[],l=!0,u=!1,y=void 0
try{for(var v,c=i[Symbol.iterator]();!(l=(v=c.next()).done);l=!0){var d=v.value,g=2
_.contains(r,d)&&(g=1)
var R=m(d,g)
if(void 0===R)return
s.push({roomName:d,value:R})}}catch(e){u=!0,y=e}finally{try{!l&&c.return&&c.return()}finally{if(u)throw y}}s=_(_.filter(_.sortBy(s,"value"),function(e){return void 0!==e.value})).reverse().value()
var E=0,S=[],T=!0,C=!1,O=void 0
try{for(var M,b=s[Symbol.iterator]();!(T=(M=b.next()).done);T=!0){var w=M.value
E<a&&void 0!==w.value&&(n+=w.value,S.push(w.roomName),E++)}}catch(e){C=!0,O=e}finally{try{!T&&b.return&&b.return()}finally{if(C)throw O}}return n}function m(e,r){if(S.hasIntel(e)){var o=S.sourceCount(e)
return Math.ceil(30*o/r)}}var u=o(14),y=o(42),v=o(44),c=o(19),d=o(35),f=o(46),g=o(47),R=o(18),p=o(10),h=o(29),E=o(20),S=o(5),T=o(12),C=o(16),O=o(17),M=o(11),b=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"ExpansionManager"))
return t.hasRun=!1,t.MEMORY_EXPANSIONGOING="expansionGoing",t.MEMORY_EXPANSIONSTARTED="expansionStarted",t.MEMORY_LASTRUN="lastRun",t.MEMORY_LASTRUN_BOT_EVAL="lastRunBotEval",t.MEMORY_LASTRUN_BOT_EXPAND="lastRunBotExpand",t.roomService=e,t.creepService=o,t}return _inherits(r,u.Manager),_createClass(r,[{key:"run",value:function(e){if(e===u.ManagerPriority.Standard){this.creepService.runCreeps(C.Role.RoomClaimer,y.run),this.creepService.runCreeps(C.Role.ExpansionWorker,v.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+20<Game.time){var o=this.roomService.getNormalWithExpansion(),t=this.roomService.getNormalWithDismantleTarget()
this.orderExpansionCreeps(o),this.orderDismantleClaimer(t),this.setValue(this.MEMORY_LASTRUN,Game.time),this.hasRun=!0}}else if(e===u.ManagerPriority.Trivial&&!0===Memory.settings.bot){var n=this.getValue(this.MEMORY_LASTRUN_BOT_EVAL)
if(void 0===n||n+50<Game.time){var i=this.roomService.getNormalRooms()
this.setValue(this.MEMORY_LASTRUN_BOT_EVAL,Game.time)
var s=!0,l=!1,m=void 0
try{for(var c,d=i[Symbol.iterator]();!(s=(c=d.next()).done);s=!0)if(a(c.value))return}catch(e){l=!0,m=e}finally{try{!s&&d.return&&d.return()}finally{if(l)throw m}}}var f=this.getValue(this.MEMORY_LASTRUN_BOT_EXPAND)
if(void 0===f||f+1e3<Game.time){var g=this.getValue(this.MEMORY_EXPANSIONGOING)
if(void 0!==g){var R=this.getValue(this.MEMORY_EXPANSIONSTARTED),p=Game.rooms[g]
void 0!==p&&void 0!==p.controller&&p.controller.my?(g=void 0,this.setValue(this.MEMORY_EXPANSIONGOING,void 0),this.setValue(this.MEMORY_EXPANSIONSTARTED,void 0)):R+5e3<Game.time&&(g=void 0,this.setValue(this.MEMORY_EXPANSIONGOING,void 0),this.setValue(this.MEMORY_EXPANSIONSTARTED,void 0))}void 0===g&&!1!==(g=this.expandIfPossible())&&(this.setValue(this.MEMORY_EXPANSIONGOING,g),this.setValue(this.MEMORY_EXPANSIONSTARTED,Game.time)),this.setValue(this.MEMORY_LASTRUN_BOT_EXPAND,Game.time)}}if(e===u.ManagerPriority.Overflow&&!this.hasRun){var h=this.roomService.getNormalWithExpansion(),E=this.roomService.getNormalWithDismantleTarget()
this.orderExpansionCreeps(h),this.orderDismantleClaimer(E),this.setValue(this.MEMORY_LASTRUN,Game.time)}}},{key:"expandIfPossible",value:function(){var e=this.roomService.getMyRooms()
if(e.length===Game.gcl.level)return!1
if(Game.cpu.limit<11*e.length)return!1
var r=[],o=M.RoomLevel.CivilizedColony
e.length>5?o=M.RoomLevel.Town:e.length>1&&(o=M.RoomLevel.AdvancedColony)
var t=!0,n=!1,a=void 0
try{for(var i,s=this.roomService.getNormalRooms()[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
p.getRoomLevel(l)>=o&&!l.hasExpansion()&&!l.isUnderSiege()&&r.push(l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}if(0===r.length)return!1
var m=void 0,u=void 0,y=void 0,v=!0,c=!1,d=void 0
try{for(var f,g=r[Symbol.iterator]();!(v=(f=g.next()).done);v=!0){var R=f.value,h=this.getBestExpansionTarget(R)
void 0!==h&&(void 0===y||y<h.value)&&(m=R,u=h.roomName,y=h.value)}}catch(e){c=!0,d=e}finally{try{!v&&g.return&&g.return()}finally{if(c)throw d}}if(void 0===u||void 0===m||void 0===y)return!1
var E=T.findSpawnLocation(u)
return void 0===E?(console.log("Room "+m.name+" wanted to make an expansion at room "+u+", but could not find spawnlocation."),!1):(m.memory.expansion=u,p.setBasePosition(u,E.pos),console.log("Room "+m.name+" is making an expansion at room "+u+" with a value of "+y),u)}},{key:"getBestExpansionTarget",value:function(e){if(void 0!==e.memory.expansionTargets&&0!==Object.keys(e.memory.expansionTargets).length){var r=void 0,o=void 0,t=Object.keys(d.getMinerals()),n=!0,a=!1,i=void 0
try{for(var s,l=Object.keys(e.memory.expansionTargets)[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(!1!==e.memory.expansionTargets[m]&&!0!==e.memory.expansionTargets[m]&&e.memory.expansionTargets[m]>0){var u=this.roomService.getNormalRooms(),y=Game.rooms[m]
if(void 0!==y&&void 0!==y.controller&&y.controller.level>0&&y.controller.my)continue
if(S.roomHostility(m)>0)continue
var v=!1,c=!0,g=!1,R=void 0
try{for(var h,E=u[Symbol.iterator]();!(c=(h=E.next()).done);c=!0){var T=h.value
void 0===T.memory.neighbours||void 0===T.memory.neighbours.oneAway||void 0===T.memory.neighbours.twoAway||!_.contains(T.memory.neighbours.oneAway,m)&&!_.contains(T.memory.neighbours.twoAway,m)||(v=!0)}}catch(e){g=!0,R=e}finally{try{!c&&E.return&&E.return()}finally{if(g)throw R}}var C=e.memory.expansionTargets[m]
_.contains(e.memory.neighbours.threeAway,y)&&(C-=20),_.contains(e.memory.neighbours.fourAway,y)&&(C+=20)
var O=S.mineralType(m)
void 0===O||_.contains(t,O)||(C+=120,O===RESOURCE_CATALYST&&(C+=80))
var M=f.getRoomsOneAway(m),b=_.filter(M,function(e){return p.isSKRoom(e)})
if(b.length>0){var w=S.mineralType(b[0])
void 0===w||_.contains(t,w)||w===O||(C+=50)}var N=!0,A=!1,U=void 0
try{for(var k,I=f.getRoomsOneAway(m)[Symbol.iterator]();!(N=(k=I.next()).done);N=!0){var L=k.value
S.isOccupied(L)&&(C-=50)}}catch(e){A=!0,U=e}finally{try{!N&&I.return&&I.return()}finally{if(A)throw U}}var P=!0,x=!1,G=void 0
try{for(var B,D=f.getRoomsTwoAway(m)[Symbol.iterator]();!(P=(B=D.next()).done);P=!0){var H=B.value
S.isOccupied(H)&&(C-=20)}}catch(e){x=!0,G=e}finally{try{!P&&D.return&&D.return()}finally{if(x)throw G}}!v&&(void 0===o||o<C)&&(r=m,o=C)}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return void 0!==r&&void 0!==o?{roomName:r,value:o}:void 0}}},{key:"orderExpansionCreeps",value:function(e){var r=!0,o=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(r=(a=i.next()).done);r=!0){var s=a.value
if(void 0!==s.memory.expansion){if(void 0!==s.storage&&s.storage.store[RESOURCE_ENERGY]<5e3)continue
if(S.isOccupied(s.memory.expansion)&&!0===Memory.settings.bot)return console.log("Room "+s.name+" is dropping expansion to "+s.memory.expansion+" because it is tagged as occupied."),Memory.rooms[s.memory.expansion].isExpansion=void 0,s.memory.expansion=void 0,void(s.memory.expansionRoute=void 0)
void 0!==Game.rooms[s.memory.expansion]&&Game.rooms[s.memory.expansion].controller.my||this.orderRoomClaimer(s),void 0!==Game.rooms[s.memory.expansion]&&Game.rooms[s.memory.expansion].controller.my&&(void 0===p.getRoomLevel(Game.rooms[s.memory.expansion])||p.getRoomLevel(Game.rooms[s.memory.expansion])<M.RoomLevel.DefendedColony?(this.orderExpansionWorker(s),Game.rooms[s.memory.expansion].memory.isExpansion=!0,t(Game.rooms[s.memory.expansion])):(Game.rooms[s.memory.expansion].memory.isExpansion=void 0,s.memory.expansion=void 0,s.memory.expansionRoute=void 0)),this.orderExpansionGuard(s,s.memory.expansion)}}}catch(e){o=!0,n=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw n}}}},{key:"orderDismantleClaimer",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
void 0!==i.memory.dismantleTargetRoom&&(this.orderRoomClaimer(i,i.memory.dismantleTargetRoom),void 0===Memory.rooms[i.memory.dismantleTargetRoom]&&(Memory.rooms[i.memory.dismantleTargetRoom]={}),Memory.rooms[i.memory.dismantleTargetRoom].isBeingDismantled=!0,i.memory.dismantleTargetRoom=void 0)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"orderExpansionGuard",value:function(e,r){var o=c.getMaxTierRanger(e.energyCapacityAvailable),t=Math.min(o,5)
if(this.creepService.getCreeps(C.Role.OutpostDefender,null,r).length+R.getCreepsInQueueWithHomeRoom(e,C.Role.OutpostDefender,r)===0){var n=new E.Order
n.body=c.getRangerBody(t),n.priority=O.Priority.Important,n.memory={role:C.Role.OutpostDefender,target:r,tier:t,homeroom:r},R.orderCreep(e,n)}}},{key:"orderRoomClaimer",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0
if(void 0===r&&(r=e.memory.expansion),void 0!==r){var o=c.getMaxTierSwampClaimer(e.energyCapacityAvailable),t=Math.min(o,1)
if(1>this.creepService.getNumberOfTiers(C.Role.RoomClaimer,r)+R.getNumberOfTiersInQueue(e,C.Role.RoomClaimer,r)){var n=new E.Order
n.body=c.getSwampClaimerBody(t),void 0!==e.controller&&e.controller.level<4&&(n.body=c.getClaimerBody(t)),n.priority=O.Priority.Critical,n.memory={role:C.Role.RoomClaimer,target:r,tier:t},void 0!==e.memory.expansionRoute&&(n.memory.route=e.memory.expansionRoute),R.orderCreep(e,n)}}}},{key:"orderExpansionWorker",value:function(e){var r=e.memory.expansion,o=c.getMaxTierHaulerEngineer(e.energyCapacityAvailable),t=this.creepService.getCreeps(C.Role.ExpansionWorker,r).length,a=R.getCreepsInQueue(e,C.Role.ExpansionWorker,r)
if(n(e)>t+a){var i=new E.Order
i.body=c.getHaulerEngineerBody(o),i.priority=O.Priority.Standard,i.memory={role:C.Role.ExpansionWorker,target:r,tier:o},void 0!==e.memory.expansionRoute&&(i.memory.route=e.memory.expansionRoute),R.orderCreep(e,i)}}}]),r}()
r.ExpansionManager=b,r.evaluateExpansion=i,r.getOutpostsValue=l},function(e,r,o){var t=o(43)
r.run=function(e){var r=e.memory.target
if(r!==e.room.name)t.travelByRoute(e,{avoidKeepers:!0,preferHighway:!0,allowSK:!0,ignoreRoads:!0,allowHostile:!1})
else{var o=e.claimController(e.room.controller)
o!==ERR_NOT_IN_RANGE&&o!==ERR_FULL||e.travelTo(e.room.controller),void 0!==Game.rooms[r]&&void 0!==Game.rooms[r].controller&&Game.rooms[r].controller.my&&e.suicide()}}},function(e,r){function o(e){return void 0!==e.memory.route&&e.memory.route.length>0?(e.memory.routeTarget=e.memory.route.shift(),e.memory.routePortal=void 0):e.memory.routeTarget=void 0,void 0!==e.memory.routeTarget&&"$"===e.memory.routeTarget.charAt(0)&&(e.memory.routeTarget=e.memory.routeTarget.slice(1),e.memory.routePortal=t(e)),e.memory.routeTarget}function t(e){var r=e.pos.findClosestByRange(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_PORTAL}})
if(void 0!==r)return r.id}r.travelByRoute=function(e,r){var t=e.memory.routeTarget
if((void 0===t||t===e.room.name)&&void 0===(t=o(e))&&void 0===(t=e.memory.target))return!1
if(void 0!==e.memory.routePortal){var n=Game.getObjectById(e.memory.routePortal)
void 0!==n&&null!==n&&void 0!==n.pos&&n.pos.roomName===e.pos.roomName?(r?r.range=0:r={range:0},e.travelTo(n,r)):void 0!==e.memory.routeTarget?Game.map.getRoomLinearDistance(e.room.name,e.memory.routeTarget,!1)<10&&e.travelToRoom(t,r):e.memory.routePortal=void 0}else e.travelToRoom(t,r)
return!0}},function(e,r,o){function t(e){var r=e.room.getSpawn()
if(e.ticksToLive>1400||void 0===r||r.spawning||e.room.energyAvailable<50&&0===e.carry.energy)return e.room.memory.renewing=void 0,void e.setState(h.DecideWhatToDoWithEnergy)
e.pos.getRangeTo(r.pos)>1?e.moveTo(r):(e.carry.energy>0&&r.energy<r.energyCapacity/2&&e.transfer(r,RESOURCE_ENERGY),r.renewCreep(e))}function n(e){if(e.carry.energy===e.carryCapacity)return e.setState(h.DecideWhatToDoWithEnergy),void u(e)
var r=Game.getObjectById(e.memory.pickupid)
r instanceof Resource&&r.amount>e.carryCapacity/10?e.pos.getRangeTo(r.pos)>1?e.moveTo(r):e.pickup(r):e.carry.energy>0?(e.setState(h.DecideWhatToDoWithEnergy),u(e)):(e.setState(h.DecideWhereToGetEnergy),i(e))}function a(e){if(e.carry.energy===e.carryCapacity)return e.setState(h.DecideWhatToDoWithEnergy),void u(e)
var r=Game.getObjectById(e.memory.pickupid);(r instanceof StructureTerminal||r instanceof StructureStorage)&&r.store[RESOURCE_ENERGY]>e.carryCapacity?e.pos.getRangeTo(r.pos)>1?e.moveTo(r):e.withdraw(r,RESOURCE_ENERGY):e.carry.energy>0?(e.setState(h.DecideWhatToDoWithEnergy),u(e)):(e.setState(h.DecideWhereToGetEnergy),i(e))}function i(e){if(void 0!==e.room.memory.renewing&&null===Game.getObjectById(e.room.memory.renewing)&&(e.room.memory.renewing=void 0),e.ticksToLive<800&&e.room.energyAvailable>200&&void 0===e.room.memory.renewing&&void 0===e.room.storage){var r=e.room.getSpawn()
if(void 0!==r&&!r.spawning)return e.room.memory.renewing=e.id,e.setState(h.Renewing),void t(e)}var o=e.room.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_TERMINAL)&&e.store[RESOURCE_ENERGY]>1e3}})
if(o.length>0)return e.memory.pickupid=e.pos.findClosestByRange(o).id,e.setState(h.GetEnergyFromStructure),void a(e)
var i=e.room.find(FIND_DROPPED_RESOURCES,{filter:function(r){return r.resourceType===RESOURCE_ENERGY&&r.amount>e.carryCapacity/3}})
if(i.length>0)return e.memory.pickupid=e.pos.findClosestByRange(i).id,e.setState(h.ScavengeEnergy),void n(e)
e.setState(h.MovingToSource),y(e)}function s(e){e.carry.energy<e.carryCapacity&&e.room.name===e.memory.homeroom&&void 0!==e.room.storage?e.pos.getRangeTo(e.room.storage.pos)>1?e.moveTo(e.room.storage):e.withdraw(e.room.storage,RESOURCE_ENERGY):(e.setState(h.MoveToExpansion),l(e))}function l(e){e.memory.target!==e.room.name||T.positionIsBorder(e.pos)?C.travelByRoute(e,{avoidKeepers:!0,preferHighway:!0,allowSK:!0,ignoreRoads:!0,allowHostile:!1}):(e.setState(h.RemoveHostileConstructionSites),m(e))}function m(e){var r=e.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES,{filter:function(e){return e.structureType!==STRUCTURE_EXTRACTOR}})
null!==r&&void 0!==r?e.travelTo(r,{range:0}):e.setState(h.DecideWhatToDoWithEnergy)}function u(e){if(e.memory.target!==e.room.name)return e.setState(h.MoveToExpansion),void l(e)
if(e.room.isExpansion()&&e.ticksToLive<400&&void 0===e.room.memory.renewing&&void 0===e.room.storage&&e.room.energyAvailable>50){var r=e.room.getSpawn()
if(void 0!==r&&!r.spawning)return e.room.memory.renewing=e.id,e.setState(h.Renewing),void t(e)}if(e.carry.energy<10)return e.setState(h.MovingToSource),void y(e)
var o=e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_RAMPART}})
if(o.length>0){var n=o[0].id,a=o[0].hits,i=!0,s=!1,m=void 0
try{for(var u,v=o[Symbol.iterator]();!(i=(u=v.next()).done);i=!0){var R=u.value
R.hits<a&&(a=R.hits,n=R.id)}}catch(e){s=!0,m=e}finally{try{!i&&v.return&&v.return()}finally{if(s)throw m}}if(a<2e4)return e.memory.rampartId=n,e.setState(h.Repairing),void d(e)}if(void 0!==e.room.controller&&e.room.controller.ticksToDowngrade<2e3)return e.setState(h.Upgrading),void c(e)
var p=e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_EXTENSION||e.structureType===STRUCTURE_TOWER||e.structureType===STRUCTURE_STORAGE)&&e.energy<e.energyCapacity-30}})
if(p.length>0)return e.memory.fillingid=e.pos.findClosestByRange(p).id,e.setState(h.FillingBase),void g(e)
var E=Game.rooms[e.memory.target]
if(!(E instanceof Room))return M.log.error("Expansion "+e.memory.target,e.room.name),e.setState(h.MoveToExpansion),void l(e)
var S=E.find(FIND_MY_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_TOWER||e.structureType===STRUCTURE_SPAWN}})
if(S.length>0)return e.memory.constructionid=e.pos.findClosestByRange(S).id,e.setState(h.Constructing),void f(e)
var T=E.find(FIND_MY_CONSTRUCTION_SITES)
return T.length>0?(e.memory.constructionid=e.pos.findClosestByRange(T).id,e.setState(h.Constructing),void f(e)):void 0!==e.room.storage&&e.room.storage.isActive()?(e.memory.fillingid=e.room.storage.id,e.setState(h.FillingBase),void g(e)):(e.setState(h.Upgrading),void c(e))}function y(e){if(void 0!==e.memory.sourceId&&void 0!==e.memory.sourcePos||(p(e),void 0!==e.memory.sourceId&&void 0!==e.memory.sourcePos)){var r=new RoomPosition(e.memory.sourcePos.x,e.memory.sourcePos.y,e.memory.sourcePos.roomName)
r instanceof RoomPosition?e.room.name!==r.roomName||e.pos.getRangeTo(r)>1?e.travelTo({pos:r},{allowHostile:!1}):(e.setState(h.Mining),v(e)):M.log.error("Invalid sourcePos for ExpansionWorker",e.room.name)}else M.log.error("Could not set source for ExpansionWorker",e.room.name)}function v(e){var r=Game.getObjectById(e.memory.sourceId)
if(null===r||r.room.name!==e.room.name||e.pos.getRangeTo(r.pos)>1)return e.setState(h.MovingToSource),void y(e)
if(e.carry.energy===e.carryCapacity){if(e.memory.target!==e.room.name){var o=e.room.find(FIND_MY_CONSTRUCTION_SITES)
if(o.length>0)return e.memory.constructionid=e.pos.findClosestByRange(o).id,e.setState(h.Constructing),void f(e)}return e.setState(h.MoveToExpansion),void l(e)}r.energy>0&&e.harvest(r)===OK&&(void 0===Memory.stats["room."+e.memory.target+".energyHarvested"]&&(Memory.stats["room."+e.memory.target+".energyHarvested"]=0),Memory.stats["room."+e.memory.target+".energyHarvested"]+=2*e.getWorkerParts())}function c(e){if(0===e.carry.energy)return e.setState(h.DecideWhereToGetEnergy),void i(e)
var r=e.room.controller
if(r instanceof StructureController){var o=e.pos.getRangeTo(r)
o>3?e.travelTo(r):(3===o&&e.travelTo(r),e.upgradeController(r)===OK&&(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK)))}else e.setState(h.DecideWhatToDoWithEnergy),u(e)}function d(e){if(0===e.carry.energy)return e.memory.target===e.room.name?(e.setState(h.DecideWhereToGetEnergy),void i(e)):(e.setState(h.MoveToExpansion),void l(e))
var r=Game.getObjectById(e.memory.rampartId)
if(null===r||r.hits>5e4)return e.memory.target===e.room.name?(e.setState(h.DecideWhatToDoWithEnergy),void u(e)):(e.setState(h.MoveToExpansion),void l(e))
var o=e.repair(r)
if(o===ERR_RCL_NOT_ENOUGH)return e.setState(h.Upgrading),void c(e)
o===ERR_NOT_IN_RANGE&&e.travelTo(r)}function f(e){if(0===e.carry.energy)return e.memory.target===e.room.name?(e.setState(h.DecideWhereToGetEnergy),void i(e)):(e.setState(h.MoveToExpansion),void l(e))
var r=Game.getObjectById(e.memory.constructionid)
if(null===r)return e.memory.target===e.room.name?(e.setState(h.DecideWhatToDoWithEnergy),void u(e)):(e.setState(h.MoveToExpansion),void l(e))
var o=e.build(r)
if(o===ERR_RCL_NOT_ENOUGH)return e.setState(h.Upgrading),void c(e)
o===ERR_NOT_IN_RANGE&&e.travelTo(r)}function g(e){if(0===e.carry.energy)return e.setState(h.DecideWhereToGetEnergy),void i(e)
var r=Game.getObjectById(e.memory.fillingid)
if(!(r instanceof StructureStorage||null!==r&&r.energy!==r.energyCapacity))return e.setState(h.DecideWhatToDoWithEnergy),void u(e)
e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.travelTo(r)}function R(e,r){var o=0
for(var t in Game.creeps){var n=Game.creeps[t]
n.memory.sourceId===e&&n.memory.role===O.Role.ExpansionWorker&&o++}var a=!0,i=!1,s=void 0
try{for(var l,m=r.memory.orders[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value
u.memory.sourceId===e&&u.memory.role===O.Role.ExpansionWorker&&o++}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return o}function p(e){var r=Game.rooms[e.memory.target],o=Game.rooms[e.memory.homeroom]
if(r instanceof Room)if(o instanceof Room){var t=r.getSources(),n=S.getBasicOutposts(r),a=!0,i=!1,s=void 0
try{for(var l,m=_.range(0,10)[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=!0,v=!1,c=void 0
try{for(var d,f=t[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var g=d.value
if(R(g.id,o)===u)return e.memory.sourceId=g.id,void(e.memory.sourcePos=g.pos)}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}var p=!0,h=!1,T=void 0
try{for(var C,O=n[Symbol.iterator]();!(p=(C=O.next()).done);p=!0){var b=C.value
if(E.hasIntel(b)){var w=!0,N=!1,A=void 0
try{for(var U,k=E.sourceIds(b)[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
if(R(I,o)===u)return e.memory.sourceId=I,void(e.memory.sourcePos=E.sourcePos(b,I))}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}}}}catch(e){h=!0,T=e}finally{try{!p&&O.return&&O.return()}finally{if(h)throw T}}}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}if(t.length>0){var L=_.random(0,t.length-1)
e.memory.sourceId=t[L].id,e.memory.sourcePos=t[L].pos}}else M.log.error("Could not access homeroom for ExpansionWorker",e.room.name)
else M.log.error("Could not access target room for ExpansionWorker",e.room.name)}var h,E=o(5),S=o(10),T=o(45),C=o(43),O=o(16),M=o(7)
!function(e){e[e.MoveToExpansion=1]="MoveToExpansion",e[e.MovingToSource=2]="MovingToSource",e[e.Mining=3]="Mining",e[e.Upgrading=4]="Upgrading",e[e.Constructing=5]="Constructing",e[e.FillingBase=6]="FillingBase",e[e.TankUpInHomeroom=7]="TankUpInHomeroom",e[e.DecideWhatToDoWithEnergy=8]="DecideWhatToDoWithEnergy",e[e.DecideWhereToGetEnergy=9]="DecideWhereToGetEnergy",e[e.ScavengeEnergy=10]="ScavengeEnergy",e[e.GetEnergyFromStructure=11]="GetEnergyFromStructure",e[e.Renewing=12]="Renewing",e[e.RemoveHostileConstructionSites=13]="RemoveHostileConstructionSites",e[e.Repairing=14]="Repairing"}(h||(h={})),r.run=function(e){switch(e.hasState()||e.setState(h.TankUpInHomeroom),e.getState()){case h.MoveToExpansion:l(e)
break
case h.RemoveHostileConstructionSites:m(e)
break
case h.MovingToSource:y(e)
break
case h.Mining:v(e)
break
case h.Upgrading:c(e)
break
case h.Constructing:f(e)
break
case h.Repairing:d(e)
break
case h.FillingBase:g(e)
break
case h.TankUpInHomeroom:s(e)
break
case h.ScavengeEnergy:n(e)
break
case h.GetEnergyFromStructure:a(e)
break
case h.DecideWhatToDoWithEnergy:u(e)
break
case h.DecideWhereToGetEnergy:i(e)
break
case h.Renewing:t(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(h.TankUpInHomeroom)}}},function(e,r){r.positionIsBorder=function(e){return e.x<1||e.x>48||e.y<1||e.y>48},r.positionIsBorderOrNextToBorder=function(e){return e.x<=1||e.x>=48||e.y<=1||e.y>=48},r.positionNextToBorder=function(e){return 1===e.x||48===e.x||1===e.y||48===e.y},r.positionHasBuildableGround=function(e){var r=Game.map.getTerrainAt(e)
return"plain"===r||"swamp"===r},r.positionHasPortal=function(e){var r=e.lookFor(LOOK_STRUCTURES)
if(r.length>0){var o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_PORTAL)return!0}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return!1},r.positionAtDirection=function(e,r){var o=[0,0,1,1,1,0,-1,-1,-1],t=[0,-1,-1,0,1,1,1,0,-1],n=e.x+o[r],a=e.y+t[r]
if(!(n<1||n>48||a<1||a>48))return new RoomPosition(n,a,e.roomName)}},function(e,r,o){function t(e){var r=[],o=Game.map.describeExits(e)
return _.forEach(o,function(e){void 0!==e&&r.push(e)}),r}function n(e){var r=[],o=t(e),n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value,u=Game.map.describeExits(m)
_.forEach(u,function(e){void 0!==e&&r.push(e)})}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}r=_.uniq(r),_.pull(r,e)
var y=!0,v=!1,c=void 0
try{for(var d,f=o[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var g=d.value
_.pull(r,g)}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}return r}function a(e){var r=[],o=n(e),a=t(e),i=!0,s=!1,l=void 0
try{for(var m,u=o[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value,v=Game.map.describeExits(y)
_.forEach(v,function(e){void 0!==e&&r.push(e)})}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}r=_.uniq(r),_.pull(r,e)
var c=!0,d=!1,f=void 0
try{for(var g,R=a[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
_.pull(r,p)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}var h=!0,E=!1,S=void 0
try{for(var T,C=o[Symbol.iterator]();!(h=(T=C.next()).done);h=!0){var O=T.value
_.pull(r,O)}}catch(e){E=!0,S=e}finally{try{!h&&C.return&&C.return()}finally{if(E)throw S}}return r}function i(e){var r=[],o=a(e),i=n(e),s=t(e),l=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value,d=Game.map.describeExits(c)
_.forEach(d,function(e){void 0!==e&&r.push(e)})}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}r=_.uniq(r),_.pull(r,e)
var f=!0,g=!1,R=void 0
try{for(var p,h=s[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
_.pull(r,E)}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}var S=!0,T=!1,C=void 0
try{for(var O,M=i[Symbol.iterator]();!(S=(O=M.next()).done);S=!0){var b=O.value
_.pull(r,b)}}catch(e){T=!0,C=e}finally{try{!S&&M.return&&M.return()}finally{if(T)throw C}}var w=!0,N=!1,A=void 0
try{for(var U,k=o[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
_.pull(r,I)}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}return r}function s(e){var r=[],o=i(e),s=a(e),l=n(e),m=t(e),u=!0,y=!1,v=void 0
try{for(var c,d=o[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value,g=Game.map.describeExits(f)
_.forEach(g,function(e){void 0!==e&&r.push(e)})}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}r=_.uniq(r),_.pull(r,e)
var R=!0,p=!1,h=void 0
try{for(var E,S=m[Symbol.iterator]();!(R=(E=S.next()).done);R=!0){var T=E.value
_.pull(r,T)}}catch(e){p=!0,h=e}finally{try{!R&&S.return&&S.return()}finally{if(p)throw h}}var C=!0,O=!1,M=void 0
try{for(var b,w=l[Symbol.iterator]();!(C=(b=w.next()).done);C=!0){var N=b.value
_.pull(r,N)}}catch(e){O=!0,M=e}finally{try{!C&&w.return&&w.return()}finally{if(O)throw M}}var A=!0,U=!1,k=void 0
try{for(var I,L=s[Symbol.iterator]();!(A=(I=L.next()).done);A=!0){var P=I.value
_.pull(r,P)}}catch(e){U=!0,k=e}finally{try{!A&&L.return&&L.return()}finally{if(U)throw k}}var x=!0,G=!1,B=void 0
try{for(var D,H=o[Symbol.iterator]();!(x=(D=H.next()).done);x=!0){var W=D.value
_.pull(r,W)}}catch(e){G=!0,B=e}finally{try{!x&&H.return&&H.return()}finally{if(G)throw B}}return r}function l(e){var r=[],o=s(e),l=i(e),m=a(e),u=n(e),y=t(e),v=!0,c=!1,d=void 0
try{for(var f,g=o[Symbol.iterator]();!(v=(f=g.next()).done);v=!0){var R=f.value,p=Game.map.describeExits(R)
_.forEach(p,function(e){void 0!==e&&r.push(e)})}}catch(e){c=!0,d=e}finally{try{!v&&g.return&&g.return()}finally{if(c)throw d}}r=_.uniq(r),_.pull(r,e)
var h=!0,E=!1,S=void 0
try{for(var T,C=y[Symbol.iterator]();!(h=(T=C.next()).done);h=!0){var O=T.value
_.pull(r,O)}}catch(e){E=!0,S=e}finally{try{!h&&C.return&&C.return()}finally{if(E)throw S}}var M=!0,b=!1,w=void 0
try{for(var N,A=u[Symbol.iterator]();!(M=(N=A.next()).done);M=!0){var U=N.value
_.pull(r,U)}}catch(e){b=!0,w=e}finally{try{!M&&A.return&&A.return()}finally{if(b)throw w}}var k=!0,I=!1,L=void 0
try{for(var P,x=m[Symbol.iterator]();!(k=(P=x.next()).done);k=!0){var G=P.value
_.pull(r,G)}}catch(e){I=!0,L=e}finally{try{!k&&x.return&&x.return()}finally{if(I)throw L}}var B=!0,D=!1,H=void 0
try{for(var W,Y=l[Symbol.iterator]();!(B=(W=Y.next()).done);B=!0){var F=W.value
_.pull(r,F)}}catch(e){D=!0,H=e}finally{try{!B&&Y.return&&Y.return()}finally{if(D)throw H}}var K=!0,V=!1,j=void 0
try{for(var X,Z=o[Symbol.iterator]();!(K=(X=Z.next()).done);K=!0){var z=X.value
_.pull(r,z)}}catch(e){V=!0,j=e}finally{try{!K&&Z.return&&Z.return()}finally{if(V)throw j}}return r}var m=o(29)
r.getCloseHighways=function(e){var r=t(e).concat(n(e),a(e),i(e),l(e))
return _.filter(r,function(e){return m.roomIsHighway(e)})},r.getRoomsOneAway=t,r.getRoomsTwoAway=n,r.getRoomsThreeAway=a,r.getRoomsFourAway=i,r.getRoomsFiveAway=s,r.getRoomsSixAway=l,r.getRoomsSevenAway=function(e){var r=[],o=l(e),m=s(e),u=i(e),y=a(e),v=n(e),c=t(e),d=!0,f=!1,g=void 0
try{for(var R,p=o[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value,E=Game.map.describeExits(h)
_.forEach(E,function(e){void 0!==e&&r.push(e)})}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}r=_.uniq(r),_.pull(r,e)
var S=!0,T=!1,C=void 0
try{for(var O,M=c[Symbol.iterator]();!(S=(O=M.next()).done);S=!0){var b=O.value
_.pull(r,b)}}catch(e){T=!0,C=e}finally{try{!S&&M.return&&M.return()}finally{if(T)throw C}}var w=!0,N=!1,A=void 0
try{for(var U,k=v[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
_.pull(r,I)}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}var L=!0,P=!1,x=void 0
try{for(var G,B=y[Symbol.iterator]();!(L=(G=B.next()).done);L=!0){var D=G.value
_.pull(r,D)}}catch(e){P=!0,x=e}finally{try{!L&&B.return&&B.return()}finally{if(P)throw x}}var H=!0,W=!1,Y=void 0
try{for(var F,K=u[Symbol.iterator]();!(H=(F=K.next()).done);H=!0){var V=F.value
_.pull(r,V)}}catch(e){W=!0,Y=e}finally{try{!H&&K.return&&K.return()}finally{if(W)throw Y}}var j=!0,X=!1,Z=void 0
try{for(var z,q=m[Symbol.iterator]();!(j=(z=q.next()).done);j=!0){var J=z.value
_.pull(r,J)}}catch(e){X=!0,Z=e}finally{try{!j&&q.return&&q.return()}finally{if(X)throw Z}}var Q=!0,$=!1,ee=void 0
try{for(var re,oe=o[Symbol.iterator]();!(Q=(re=oe.next()).done);Q=!0){var te=re.value
_.pull(r,te)}}catch(e){$=!0,ee=e}finally{try{!Q&&oe.return&&oe.return()}finally{if($)throw ee}}return r}},function(e,r,o){function t(e,r){var o=r.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_POWER_BANK}})
if(void 0!==o&&o.length>0){var t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
m.registerPowerBank(e,l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}}function n(e){void 0===Memory.portals&&(Memory.portals={})
var r=f.getClosestPortalroom(e.name)
if(void 0!==Game.rooms[r]){var o=Game.rooms[r].find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_PORTAL}})
o.length>0?void 0===Memory.portals[r]?Memory.portals[r]={decay:o[0].ticksToDecay,firstSeen:Game.time,dest:o[0].destination.roomName}:Memory.portals[r].decay=o[0].ticksToDecay:delete Memory.portals[r]}}function a(e,r){void 0===e.memory.highwaysClose&&(e.memory.highwaysClose=y.getCloseHighways(e.name)),void 0===e.memory.observerCounter?e.memory.observerCounter=0:(e.memory.observerCounter=(e.memory.observerCounter+1)%e.memory.highwaysClose.length,r.observeRoom(e.memory.highwaysClose[e.memory.observerCounter]))}function i(e,r){r.observeRoom(f.getClosestPortalroom(e.name))}function s(e,r){return void 0===e.memory.scoutqueue&&(e.memory.scoutqueue=[]),!_.contains(e.memory.scoutqueue,r)&&((void 0===Memory.empire.inaccessible||!_.contains(Memory.empire.inaccessible,r))&&(e.memory.scoutqueue.push(r),!0))}function l(e){e.memory.neighbours={oneAway:y.getRoomsOneAway(e.name),twoAway:y.getRoomsTwoAway(e.name),threeAway:y.getRoomsThreeAway(e.name),fourAway:y.getRoomsFourAway(e.name),fiveAway:y.getRoomsFiveAway(e.name),sixAway:y.getRoomsSixAway(e.name),sevenAway:y.getRoomsSevenAway(e.name)}}var m=o(48),u=o(19),y=o(46),v=o(57),c=o(5),d=o(18),f=o(10),g=o(20),R=o(14),p=o(16),h=o(17),E=o(11),S=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"ScoutingManager"))
return t.MEMORY_LASTRUN_SCOUT="lastRunScout",t.MEMORY_LASTRUN_NEIGHBOURS="lastRunNeighbours",t.roomService=e,t.creepService=o,t}return _inherits(r,R.Manager),_createClass(r,[{key:"run",value:function(e){if(e===R.ManagerPriority.Standard){var r=this.roomService.getNormalRooms(),o=!0,s=!1,m=void 0
try{for(var u,y=r[Symbol.iterator]();!(o=(u=y.next()).done);o=!0){var c=u.value
if(f.getRoomLevel(c)===E.RoomLevel.Metropolis){if((Game.time+f.getIndex(c))%1e3==5){var d=c.getObserver()
void 0!==d&&i(c,d)}if((Game.time+f.getIndex(c))%1e3==6&&void 0!==c.getObserver()&&n(c),(Game.time+f.getIndex(c))%20==6){var g=c.getObserver()
void 0!==g&&a(c,g)}if((Game.time+f.getIndex(c))%20==7&&void 0!==c.getObserver()&&void 0!==c.memory.highwaysClose&&void 0!==c.memory.observerCounter){var h=Game.rooms[c.memory.highwaysClose[c.memory.observerCounter]]
h instanceof Room&&t(c,h)}}}}catch(e){s=!0,m=e}finally{try{!o&&y.return&&y.return()}finally{if(s)throw m}}}if(e===R.ManagerPriority.Trivial){this.creepService.runCreeps(p.Role.ProximityScout,v.run)
var S=this.getValue(this.MEMORY_LASTRUN_NEIGHBOURS)
if(void 0===S||S+5e3<Game.time){var T=this.roomService.getNormalRooms(),C=!0,O=!1,M=void 0
try{for(var _,b=T[Symbol.iterator]();!(C=(_=b.next()).done);C=!0)l(_.value)}catch(e){O=!0,M=e}finally{try{!C&&b.return&&b.return()}finally{if(O)throw M}}this.setValue(this.MEMORY_LASTRUN_NEIGHBOURS,Game.time)}var w=this.getValue(this.MEMORY_LASTRUN_SCOUT)
if(void 0===w||w+500<Game.time){var N=this.roomService.getNormalRooms(),A=!0,U=!1,k=void 0
try{for(var I,L=N[Symbol.iterator]();!(A=(I=L.next()).done);A=!0){var P=I.value
void 0===P.memory.neighbours&&l(P),this.checkIfNeighboursNeedScouting(P),this.checkIfControlledRoomsNeedSigning(P),this.orderProximityScout(P),this.orderSigner(P)}}catch(e){U=!0,k=e}finally{try{!A&&L.return&&L.return()}finally{if(U)throw k}}this.setValue(this.MEMORY_LASTRUN_SCOUT,Game.time)}}}},{key:"signerIsGoingThereNow",value:function(e,r){return this.creepService.getCreeps(p.Role.Signer,r,e.name).length>0}},{key:"orderSigner",value:function(e){if(void 0!==e.memory.signingqueue&&0!==e.memory.signingqueue.length){if(1>this.creepService.getNumberOfTiers(p.Role.ProximityScout,null,e.name)+d.getNumberOfTiersInQueue(e,p.Role.ProximityScout)){var r=new g.Order
r.body=u.getScoutBody(1),r.priority=h.Priority.Critical,r.memory={role:p.Role.Signer,target:e.name,tier:1},d.orderCreep(e,r)}}}},{key:"orderProximityScout",value:function(e){if(void 0!==e.memory.scoutqueue&&0!==e.memory.scoutqueue.length){if(1>this.creepService.getNumberOfTiers(p.Role.ProximityScout,null,e.name)+d.getNumberOfTiersInQueue(e,p.Role.ProximityScout)){var r=new g.Order
r.body=u.getScoutBody(1),r.priority=h.Priority.Critical,r.memory={role:p.Role.ProximityScout,target:e.name,tier:1},d.orderCreep(e,r)}}}},{key:"orderSigning",value:function(e,r){return void 0===e.memory.signingqueue&&(e.memory.signingqueue=[]),!_.contains(e.memory.signingqueue,r)&&(!this.signerIsGoingThereNow(e,r)&&((void 0===Memory.rooms[r]||!Memory.rooms[r].isPraiseRoom)&&((void 0===Memory.rooms[r]||!Memory.rooms[r].inaccessible)&&(e.memory.signingqueue.push(r),console.log("<a href='#!/room/"+e.name+"'>"+e.name+"</a> Signing ordered: <a href='#!/room/"+r+"'>"+r+"</a> - Queue: "+(e.memory.signingqueue.length-1)),!0))))}},{key:"checkIfNeighboursNeedScouting",value:function(e){if(!(f.getRoomLevel(e)<E.RoomLevel.BasicColonyReadyForExpansion))if(!0===Memory.settings.bot){if(void 0!==e.memory.neighbours){if(void 0!==e.memory.neighbours.oneAway){var r=!0,o=!1,t=void 0
try{for(var n,a=e.memory.neighbours.oneAway[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
c.needsNewIntel(i)&&s(e,i)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}if(void 0!==e.memory.neighbours.twoAway){var l=!0,m=!1,u=void 0
try{for(var y,v=e.memory.neighbours.twoAway[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var d=y.value
c.needsNewIntel(d)&&s(e,d)}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}}if(void 0!==e.memory.neighbours.threeAway){var g=!0,R=!1,p=void 0
try{for(var h,S=e.memory.neighbours.threeAway[Symbol.iterator]();!(g=(h=S.next()).done);g=!0){var T=h.value
c.needsNewIntel(T)&&s(e,T)}}catch(e){R=!0,p=e}finally{try{!g&&S.return&&S.return()}finally{if(R)throw p}}}if(void 0!==e.memory.neighbours.fourAway){var C=!0,O=!1,M=void 0
try{for(var _,b=e.memory.neighbours.fourAway[Symbol.iterator]();!(C=(_=b.next()).done);C=!0){var w=_.value
c.needsNewIntel(w)&&s(e,w)}}catch(e){O=!0,M=e}finally{try{!C&&b.return&&b.return()}finally{if(O)throw M}}}if(void 0!==e.memory.neighbours.fiveAway){var N=!0,A=!1,U=void 0
try{for(var k,I=e.memory.neighbours.fiveAway[Symbol.iterator]();!(N=(k=I.next()).done);N=!0){var L=k.value
c.needsNewIntel(L)&&s(e,L)}}catch(e){A=!0,U=e}finally{try{!N&&I.return&&I.return()}finally{if(A)throw U}}}if(void 0!==e.memory.neighbours.sixAway){var P=!0,x=!1,G=void 0
try{for(var B,D=e.memory.neighbours.sixAway[Symbol.iterator]();!(P=(B=D.next()).done);P=!0){var H=B.value
c.needsNewIntel(H)&&s(e,H)}}catch(e){x=!0,G=e}finally{try{!P&&D.return&&D.return()}finally{if(x)throw G}}}if(void 0!==e.memory.neighbours.sevenAway){var W=!0,Y=!1,F=void 0
try{for(var K,V=e.memory.neighbours.sevenAway[Symbol.iterator]();!(W=(K=V.next()).done);W=!0){var j=K.value
c.needsNewIntel(j)&&s(e,j)}}catch(e){Y=!0,F=e}finally{try{!W&&V.return&&V.return()}finally{if(Y)throw F}}}}}else if(void 0!==e.memory.neighbours){if(void 0!==e.memory.neighbours.oneAway){var X=!0,Z=!1,z=void 0
try{for(var q,J=e.memory.neighbours.oneAway[Symbol.iterator]();!(X=(q=J.next()).done);X=!0){var Q=q.value
c.hasIntel(Q)||s(e,Q)}}catch(e){Z=!0,z=e}finally{try{!X&&J.return&&J.return()}finally{if(Z)throw z}}}if(void 0!==e.memory.neighbours.twoAway){var $=!0,ee=!1,re=void 0
try{for(var oe,te=e.memory.neighbours.twoAway[Symbol.iterator]();!($=(oe=te.next()).done);$=!0){var ne=oe.value
c.hasIntel(ne)||s(e,ne)}}catch(e){ee=!0,re=e}finally{try{!$&&te.return&&te.return()}finally{if(ee)throw re}}}}}},{key:"checkIfControlledRoomsNeedSigning",value:function(e){if(!(f.getRoomLevel(e)<E.RoomLevel.BasicColonyReadyForExpansion)){e instanceof Room&&void 0!==e.controller&&(void 0===e.controller.sign||e.controller.sign.username!==Memory.settings.user||e.controller.sign.time<Game.time-5e5)&&this.orderSigning(e,e.name)
var r=f.getBasicOutposts(e),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value,l=Game.rooms[s]
l instanceof Room&&void 0!==l.controller&&(void 0===l.controller.sign||l.controller.sign.username!==Memory.settings.user||l.controller.sign.time<Game.time-5e5)&&this.orderSigning(e,l.name)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}}}]),r}()
r.ScoutingManager=S,r.orderScouting=s,r.getSigningTarget=function(e){var r=Game.rooms[e]
if(r instanceof Room)if(void 0!==r.memory.signingqueue){if(0!==r.memory.signingqueue.length)return r.memory.signingqueue.shift()}else r.memory.signingqueue=[]}},function(e,r,o){function t(e,r){console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Bank is being robbed: <a href='#!/room/"+r.position.roomName+"'>"+r.position.roomName+"</a> ("+r.power+" power)</span>")
var o=c.getMaxTierHealer(e.energyCapacityAvailable),t=new S.Order
t.body=c.getBankAttacker(),t.priority=C.Priority.Critical,t.memory={role:T.Role.BankAttacker,target:r.id,tier:1}
var n=new S.Order
n.body=c.getHealerBody(o),n.priority=C.Priority.Critical,n.memory={role:T.Role.BankHealer,target:r.id,tier:o}
var a=new S.Order
a.body=c.getBankRanger(),a.priority=C.Priority.Critical,a.memory={role:T.Role.BankRanger,target:r.id,tier:1},h.orderCreep(e,t),h.orderCreep(e,n),r.attackSpots>1?(h.orderCreep(e,t),h.orderCreep(e,n)):h.orderCreep(e,a)}function n(e,r){console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending reinforcements to bank: <a href='#!/room/"+r.position.roomName+"'>"+r.position.roomName+"</a> ("+r.power+" power)</span>")
var o=c.getMaxTierHealer(e.energyCapacityAvailable),t=new S.Order
t.body=c.getBankAttacker(),t.priority=C.Priority.Critical,t.memory={role:T.Role.BankAttacker,target:r.id,tier:1}
var n=new S.Order
n.body=c.getHealerBody(o),n.priority=C.Priority.Critical,n.memory={role:T.Role.BankHealer,target:r.id,tier:o},h.orderCreep(e,t),h.orderCreep(e,n)
var a=new S.Order
a.body=c.getBankRanger(),a.priority=C.Priority.Critical,a.memory={role:T.Role.BankRanger,target:r.id,tier:1},1===r.attackSpots&&h.orderCreep(e,a)}function a(e,r){var o=c.getMaxTierHauler(e.energyCapacityAvailable),t=new S.Order
t.body=c.getHaulerBody(o),t.priority=C.Priority.Critical,t.memory={role:T.Role.BankHauler,target:r.id,tier:o}
for(var n=Math.ceil((r.power-500)/1600),a=0;a<n;a++)h.orderCreep(e,t)}function i(e){return e.hits<2e5}function s(e){if(void 0!==e.memory.powerbanks){var r=void 0,o=0,t=!0,n=!1,a=void 0
try{for(var i,s=Object.keys(e.memory.powerbanks)[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var u=i.value,y=e.memory.powerbanks[u]
l(y)&&(void 0===r||o<y.power)&&(r=y,o=y.power)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return void 0!==r&&(r.attackersOrdered=!0,m(r)),r}}function l(e){return!e.attackersOrdered&&e.distance<p.maxDistanceToBank&&!u(e)&&e.tickGone-Game.time>p.minTimeLeftForRobbingBank}function m(e){void 0===Memory.takenBanks&&(Memory.takenBanks=[])
var r=new b
r.id=e.id,r.tickGone=e.tickGone,Memory.takenBanks.push(r)}function u(e){if(void 0===Memory.takenBanks)return!1
var r=!0,o=!1,t=void 0
try{for(var n,a=Memory.takenBanks[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(e.id===i.id)return!0}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return!1}function y(e){for(var r=[],o=-1;o<2;o++)for(var t=-1;t<2;t++){var n=new RoomPosition(e.pos.x+o,e.pos.y+t,e.room.name)
if(n.x!==e.pos.x||n.y!==e.pos.y){var a=Game.map.getTerrainAt(n)
"swamp"!==a&&"plain"!==a||r.push(n)}}return r.length}var v=o(3),c=o(19),d=o(49),f=o(51),g=o(52),R=o(53),p=o(56),h=o(18),E=o(10),S=o(20),T=o(16),C=o(17),O=o(11),M=o(14),_=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"PowerManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,M.Manager),_createClass(r,[{key:"run",value:function(e){if(e===M.ManagerPriority.Standard)this.creepService.runCreeps(T.Role.BankRanger,R.run)
else if(e===M.ManagerPriority.Low){this.creepService.runCreeps(T.Role.BankAttacker,d.run),this.creepService.runCreeps(T.Role.BankHealer,f.run),this.creepService.runCreeps(T.Role.BankHauler,g.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+50<Game.time){var o=this.roomService.getNormalAndNotExpansion(),n=!0,a=!1,i=void 0
try{for(var l,m=o[Symbol.iterator]();!(n=(l=m.next()).done);n=!0){var u=l.value
if(E.getRoomLevel(u)>=O.RoomLevel.Metropolis&&u.hasFreeSpawnCapacity()&&void 0!==u.storage&&u.storage.store[RESOURCE_ENERGY]>p.energyInStorageBeforeRobbing&&(u.storage.store[RESOURCE_POWER]<p.powerInStorageBeforeStoppingRobbing||void 0===u.storage.store[RESOURCE_POWER])){var y=s(u)
void 0!==y&&t(u,y)}this.processBankInformation(u)}}catch(e){a=!0,i=e}finally{try{!n&&m.return&&m.return()}finally{if(a)throw i}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}if(e===M.ManagerPriority.Trivial){var v=this.roomService.getNormalAndNotExpansion(),c=!0,h=!1,S=void 0
try{for(var C,_=v[Symbol.iterator]();!(c=(C=_.next()).done);c=!0){var b=C.value
if(E.getRoomLevel(b)>=O.RoomLevel.Metropolis){var w=b.getPowerSpawn()
void 0!==w&&w.power>=1&&w.energy>=50&&w.processPower()}}}catch(e){h=!0,S=e}finally{try{!c&&_.return&&_.return()}finally{if(h)throw S}}}}},{key:"processBankInformation",value:function(e){if(void 0!==e.memory.powerbanks){var r=!0,o=!1,t=void 0
try{for(var s,l=Object.keys(e.memory.powerbanks)[Symbol.iterator]();!(r=(s=l.next()).done);r=!0){var m=s.value,u=e.memory.powerbanks[m],y=Game.getObjectById(u.id)
u.attackersOrdered&&y instanceof StructurePowerBank&&this.moreRobbersAreNeeded(e,u)&&n(e,u),u.attackersOrdered&&!u.haulersOrdered&&y instanceof StructurePowerBank&&i(y)&&(e.memory.powerbanks[m].haulersOrdered=!0,a(e,u)),u.tickGone<Game.time&&(e.memory.powerbanks[m]=void 0)}}catch(e){o=!0,t=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw t}}}}},{key:"moreRobbersAreNeeded",value:function(e,r){var o=Game.getObjectById(r.id)
if(null===o)return!1
if(h.getCreepsInQueue(e,T.Role.BankAttacker,r.id)>0)return!1
var t=this.creepService.getCreeps(T.Role.BankAttacker,r.id)
if(0===t.length)return!0
var n=!0,a=!1,i=void 0
try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.ticksToLive>300||void 0===m.ticksToLive)return!1}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}var u=600*t[0].ticksToLive
return o.hits>u}}]),r}()
r.PowerManager=_,r.registerPowerBank=function(e,r){var o=e.getSpawn()
if(void 0!==o&&(void 0===e.memory.powerbanks&&(e.memory.powerbanks={}),void 0===e.memory.powerbanks[r.id]&&r.power>=p.lowestPowerbankValueToHarvest)){var t=new w
t.id=r.id,t.tickGone=Game.time+r.ticksToDecay,t.hostilesAround=r.room.find(FIND_HOSTILE_CREEPS).length>0,t.power=r.power,t.hits=r.hits,t.attackSpots=y(r),t.distance=v.getDistanseBetween(o.pos,r.pos),t.attackersOrdered=!1,t.haulersOrdered=!1,t.position={x:r.pos.x,y:r.pos.y,roomName:r.pos.roomName},e.memory.powerbanks[r.id]=t,console.log("<span style='color:#FFFFCC'><a href='#!/room/"+r.room.name+"'>"+r.room.name+"</a> Bank found by "+e.name+": ("+r.power+" power)</span>")}}
var b=function e(){_classCallCheck(this,e)},w=function e(){_classCallCheck(this,e)}},function(e,r,o){function t(e){var r=m.getBankPosition(e)
e.room.name!==r.roomName?e.travelTo({pos:r},{allowHostile:!1,preferHighway:!0}):(e.setState(l.MovingToAttackPosition),n(e))}function n(e){var r=m.getBankPosition(e)
e.pos.getRangeTo(r)>1?e.moveTo({pos:r}):(e.setState(l.WaitingForHealer),a(e))}function a(e){e.memory.healerInPosition&&(e.setState(l.DestroyingBank),i(e))}function i(e){var r=s(e)
null!==r?m.itIsSafeToAttackBank(e,r)&&e.attack(r):e.suicide()}function s(e){return Game.getObjectById(e.memory.target)}var l,m=o(50),u=o(7)
!function(e){e[e.MovingToBankRoom=1]="MovingToBankRoom",e[e.MovingToAttackPosition=2]="MovingToAttackPosition",e[e.WaitingForHealer=3]="WaitingForHealer",e[e.DestroyingBank=4]="DestroyingBank"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.MovingToBankRoom),e.getState()){case l.MovingToBankRoom:t(e)
break
case l.MovingToAttackPosition:n(e)
break
case l.WaitingForHealer:a(e)
break
case l.DestroyingBank:i(e)
break
default:u.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.MovingToBankRoom)}}},function(e,r,o){function t(e,r){var o=0,t=e.find(FIND_MY_CREEPS),n=!0,i=!1,s=void 0
try{for(var l,m=t[Symbol.iterator]();!(n=(l=m.next()).done);n=!0)l.value.memory.role===a.Role.BankHauler&&o++}catch(e){i=!0,s=e}finally{try{!n&&m.return&&m.return()}finally{if(i)throw s}}var u=Math.floor(r.power/1600)-1
return o>=Math.max(1,u)}function n(e){var r=Game.rooms[e.memory.homeroom]
if(void 0!==r&&void 0!==r.memory.powerbanks&&void 0!==r.memory.powerbanks[e.memory.target]){var o=r.memory.powerbanks[e.memory.target]
e.memory.bankPosition={x:o.position.x,y:o.position.y,roomName:o.position.roomName}}}var a=o(16),i=o(7)
r.roomHasBankHaulers=t,r.setBankPostionInMemory=n,r.getBankPosition=function(e){return void 0===e.memory.bankPosition&&n(e),void 0===e.memory.bankPosition||void 0===e.memory.bankPosition.x?(i.log.error(e.name+" is missing bankposition for PowerBank: "+e.memory.target,e.room.name),e.pos):new RoomPosition(e.memory.bankPosition.x,e.memory.bankPosition.y,e.memory.bankPosition.roomName)},r.itIsSafeToAttackBank=function(e,r){return e.hits>e.hitsMax/2&&(r.hits>1e4||t(e.room,r))}},function(e,r,o){function t(e){var r=m.getBankPosition(e)
e.room.name!==r.roomName||e.pos.getRangeTo(r)>5?e.travelTo({pos:r},{preferHighway:!0,allowHostile:!1}):(e.setState(l.FindingTargetToHeal),n(e))}function n(e){if(Game.time%5==0){var r=s(e)
r instanceof Creep&&(e.memory.targetToHeal=r.id,r.memory.healer=e.id,e.setState(l.MovingToTargetToHeal),a(e))}}function a(e){var r=s(e)
null!==r?e.pos.getRangeTo(r)>1?e.travelTo(r):(r.memory.healerInPosition=!0,e.setState(l.HealingTarget),i(e)):e.setState(l.FindingTargetToHeal)}function i(e){var r=s(e)
null!==r?e.heal(r):e.suicide()}function s(e){if(void 0!==e.memory.targetToHeal)return Game.getObjectById(e.memory.targetToHeal)
var r=e.pos.findClosestByPath(FIND_MY_CREEPS,{filter:function(e){return e.memory.role===u.Role.BankAttacker&&void 0===e.memory.healerInPosition&&e.ticksToLive>300}})
return r instanceof Creep?r:null}var l,m=o(50),u=o(16),y=o(7)
!function(e){e[e.MovingToBankRoom=1]="MovingToBankRoom",e[e.FindingTargetToHeal=2]="FindingTargetToHeal",e[e.MovingToTargetToHeal=3]="MovingToTargetToHeal",e[e.HealingTarget=4]="HealingTarget"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.MovingToBankRoom),e.getState()){case l.MovingToBankRoom:t(e)
break
case l.FindingTargetToHeal:n(e)
break
case l.MovingToTargetToHeal:a(e)
break
case l.HealingTarget:i(e)
break
default:y.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.MovingToBankRoom)}}},function(e,r,o){function t(e){var r=m.getBankPosition(e)
e.room.name!==r.roomName||e.isAtBorder()||e.pos.getRangeTo(r)>7?e.travelTo({pos:r},{preferHighway:!0,allowHostile:!1}):(e.setState(l.WaitForPower),n(e))}function n(e){null===Game.getObjectById(e.memory.target)&&(e.setState(l.PickUpPower),a(e))}function a(e){if(e.carry.power===e.carryCapacity)e.setState(l.ReturnToBase),i(e)
else{var r=s(e)
null!==r?1===e.pos.getRangeTo(r)?e.pickup(r):0===e.fatigue&&e.moveTo(r):e.carry.power>0?(e.setState(l.ReturnToBase),i(e)):e.suicide()}}function i(e){void 0!==e.carry&&void 0!==e.carry.power||e.suicide()
var r=Game.rooms[e.memory.homeroom]
void 0!==r.storage?e.room.name===r.name&&1===e.pos.getRangeTo(r.storage)?e.transfer(r.storage,RESOURCE_POWER):e.travelTo(r.storage,{preferHighway:!0}):u.log.error("BankHauler "+e.name+" is missing homeroom or storage in home room",e.memory.homeroom)}function s(e){var r=e.room.find(FIND_DROPPED_RESOURCES,{filter:function(e){return e.resourceType===RESOURCE_POWER}})
return void 0!==r&&r.length>0?r[0]:null}var l,m=o(50),u=o(7)
!function(e){e[e.MovingToBankPosition=1]="MovingToBankPosition",e[e.WaitForPower=2]="WaitForPower",e[e.PickUpPower=3]="PickUpPower",e[e.ReturnToBase=4]="ReturnToBase"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.MovingToBankPosition),e.getState()){case l.MovingToBankPosition:t(e)
break
case l.WaitForPower:n(e)
break
case l.PickUpPower:a(e)
break
case l.ReturnToBase:i(e)
break
default:u.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.MovingToBankPosition)}}},function(e,r,o){function t(e){var r=v.getBankPosition(e)
e.room.name!==r.roomName||e.pos.getRangeTo(r)>3?e.travelTo({pos:r},{preferHighway:!0,allowHostile:!1}):(e.setState(m.AttackingBank),n(e))}function n(e){if(Game.time%13==0&&l(e))return e.setState(m.DefendingBankroom),void a(e)
var r=s(e)
null!==r&&v.itIsSafeToAttackBank(e,r)&&e.rangedAttack(r)}function a(e){Game.time%5==0&&l(e)
var r=Game.getObjectById(e.memory.hostileTarget)
if(null===r)return e.memory.hostileTarget=void 0,e.setState(m.MovingToBank),void t(e)
u.kiteAndAttack(e,r)}function i(e){e.hits<e.hitsMax&&e.heal(e)}function s(e){return Game.getObjectById(e.memory.target)}function l(e){var r=y.getPrioritizedTarget(e)
return null!==r&&(e.memory.hostileTarget=r.id,!0)}var m,u=o(54),y=o(55),v=o(50),c=o(7)
!function(e){e[e.MovingToBank=1]="MovingToBank",e[e.AttackingBank=2]="AttackingBank",e[e.DefendingBankroom=3]="DefendingBankroom"}(m||(m={})),r.run=function(e){switch(i(e),e.hasState()||e.setState(m.MovingToBank),e.getState()){case m.MovingToBank:t(e)
break
case m.AttackingBank:n(e)
break
case m.DefendingBankroom:a(e)
break
default:c.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(m.MovingToBank)}}},function(e,r,o){function t(e,r){return PathFinder.search(e.pos,{pos:r,range:5},{plainCost:1,swampCost:10,flee:!0,roomCallback:n.getKitingRoomCallback}).path[0]}var n=o(3),a=o(55)
r.kiteAndAttack=function(e,r){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,n=e.pos.getRangeTo(r.pos)
return n>o?e.moveTo(r,{maxRooms:1}):n<o&&e.moveTo(t(e,r.pos),{maxRooms:1}),n<=3&&(e.rangedAttack(r),!0)},r.rangedAttackToEnemiesAround=function(e){for(var r=[],o=[-2,-1,0,1,2],t=0;t<o.length;t++)for(var n=o[t],i=[-2,-1,0,1,2],s=0;s<i.length;s++){var l=i[s]
if(e.pos.x+n>=0&&e.pos.x+n<=49&&e.pos.y+l>=0&&e.pos.y+l<=49){var m=new RoomPosition(e.pos.x+n,e.pos.y+l,e.pos.roomName).lookFor(LOOK_CREEPS),u=!0,y=!1,v=void 0
try{for(var c,d=m[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
!f.my&&a.isCreepHostile(f)&&r.push(f)}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}}return r.length>1?(e.rangedMassAttack(),!0):1===r.length&&(e.rangedAttack(r[0]),!0)}},function(e,r){function o(){return void 0===Memory.friendly&&(Memory.friendly=[]),Memory.friendly}function t(e){return _.filter(e,function(e){return _.indexOf(o(),e.owner.username)<0})}function n(e){return _.filter(e,function(e){return!(e instanceof OwnedStructure)||_.indexOf(o(),e.owner.username)<0})}function a(e){return _.filter(e,function(e){return!(e.structureType===STRUCTURE_STORAGE&&_.sum(e.store)>5e4||e.structureType===STRUCTURE_TERMINAL&&_.sum(e.store)>5e4)})}function i(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=e.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER||e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_TERMINAL}})
return r&&(o=a(o)),n(o)}function s(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],o=e.find(FIND_HOSTILE_CREEPS)
return!1===r&&(o=_.filter(o,function(e){return"Invader"!==e.owner.username&&"Source Keeper"!==e.owner.username})),t(o)}function l(e){var r=s(e.room)
if(r.length<1)return null
var o=e.pos.findClosestByPath(r,{filter:function(e){return e.getActiveBodyparts(ATTACK)>0||e.getActiveBodyparts(RANGED_ATTACK)>0||e.getActiveBodyparts(HEAL)>0}})
if(null!==o&&void 0!==o)return o
var t=e.pos.findClosestByPath(r)
return void 0!==t?t:null}r.getFriendsList=o,r.isCreepHostile=function(e){return _.indexOf(o(),e.owner.username)<0},r.filterFriendlyCreepsFromList=t,r.filterStructuresOnBigRamparts=function(e){return _.filter(e,function(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_RAMPART&&s.hits>1e5)return!1}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!0})},r.filterFriendlyStructuresFromList=n,r.filterPillageableStructuresFromList=a,r.findHostileVitalStructures=i,r.findHostileStructures=function(e){return n(e.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType!==STRUCTURE_CONTROLLER&&e.structureType!==STRUCTURE_RAMPART&&e.structureType!==STRUCTURE_POWER_BANK&&e.structureType!==STRUCTURE_TERMINAL}}))},r.findClosestHostileCreepsInRoom=function(e){return e.findClosestByRange(s(Game.rooms[e.roomName]))},r.findHostileCreepsInRoom=s,r.findHostileCreepsInRangedRange=function(e){return t(e.findInRange(FIND_HOSTILE_CREEPS,3))},r.getPrioritizedTarget=l,r.getPrioritizedTargetIncludingVitalBuildings=function(e){var r=l(e)
if(null!==r)return r
var o=i(e.room),t=e.pos.findClosestByPath(o)
return void 0!==t?t:null}},function(e,r){var o={lowestPowerbankValueToHarvest:2500,maxDistanceToBank:300,minTimeLeftForRobbingBank:4e3,energyInStorageBeforeRobbing:5e4,powerInStorageBeforeStoppingRobbing:5e5}
e.exports=o},function(e,r,o){function t(e,r){var o=Game.rooms[r]
if(o instanceof Room)if(void 0!==o.memory.scoutqueue){if(0!==o.memory.scoutqueue.length){var t=o.memory.scoutqueue[0],n=Game.map.getRoomLinearDistance(e.pos.roomName,t),a=!0,i=!1,s=void 0
try{for(var l,m=o.memory.scoutqueue[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=Game.map.getRoomLinearDistance(e.pos.roomName,u)
y<n&&(n=y,t=u)}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return o.memory.scoutqueue=_.without(o.memory.scoutqueue,t),t}}else o.memory.scoutqueue=[]}var n=o(5)
r.run=function(e){return e.notifyWhenAttacked(!1),void 0===e.memory.target&&(e.memory.target=t(e,e.memory.homeroom),void 0===e.memory.target)?(console.log("<span style='color:#FF4136'><a href='#!/room/"+e.room.name+"'>"+e.room.name+"</a> Scout has finished scouting and is dismantled.</span>"),void e.suicide()):null!==e.memory.target&&void 0!==e.memory.target&&e.memory.target!==e.room.name?void 0!==Memory.empire.inaccessible&&_.contains(Memory.empire.inaccessible,e.memory.target)?void(e.memory.target=void 0):(e.travelToRoom(e.memory.target,{allowHostile:!1,allowSK:!0})===ERR_NO_PATH&&(console.log("<span style='color:#FF4136'><a href='#!/room/"+e.memory.target+"'>"+e.memory.target+"</a> Scout is marking this as an inaccessible room.</span>"),void 0===Memory.rooms[e.memory.target]&&(Memory.rooms[e.memory.target]={}),Memory.rooms[e.memory.target].inaccessible=Game.time,e.memory.target=void 0),void(0!==e.pos.x&&49!==e.pos.x&&0!==e.pos.y&&49!==e.pos.y||n.saveIntelForRoom(e.room))):(n.saveIntelForRoom(e.room),void(e.memory.target=void 0))}},function(e,r,o){function t(e){switch(C.getRoomLevel(e)){case T.RoomLevel.BasicColony:a(e)
break
case T.RoomLevel.BasicColonyReadyForExpansion:i(e)
break
case T.RoomLevel.SimpleColony:s(e)
break
case T.RoomLevel.SimpleColonyReadyForExpansion:l(e)
break
case T.RoomLevel.DefendedColony:m(e)
break
case T.RoomLevel.DefendedColonyReadyForExpansion:u(e)
break
case T.RoomLevel.CivilizedColony:y(e)
break
case T.RoomLevel.CivilizedColonyReadyForExpansion:v(e)
break
case T.RoomLevel.AdvancedColony:c(e)
break
case T.RoomLevel.AdvancedColonyReadyForExpansion:d(e)
break
case T.RoomLevel.Town:f(e)
break
case T.RoomLevel.TownReadyForExpansion:g(e)
break
case T.RoomLevel.City:R(e)
break
case T.RoomLevel.CityReadyForExpansion:p(e)
break
case T.RoomLevel.Metropolis:h(e)
break
default:C.setRoomLevel(e,T.RoomLevel.BasicColony)}}function n(e){var r=C.getRoomLevel(e)
r>T.RoomLevel.BasicColony&&void 0===e.getSpawn()?C.setRoomLevel(e,T.RoomLevel.BasicColony):r>=T.RoomLevel.DefendedColony&&r<T.RoomLevel.CivilizedColony&&void 0===e.getBaseContainer()&&void 0===e.storage?C.setRoomLevel(e,T.RoomLevel.BasicColony):r>=T.RoomLevel.CivilizedColony&&void 0===e.storage?C.setRoomLevel(e,T.RoomLevel.BasicColony):r>=T.RoomLevel.Town&&void 0===e.terminal&&C.setRoomLevel(e,T.RoomLevel.BasicColony)}function a(e){E.hasAtLeastSpawns(e,1)&&E.roomlevelIsAt(e,T.RoomLevel.BasicColony)&&E.controllerLevelAtLeast(e,2)&&C.setRoomLevel(e,T.RoomLevel.BasicColonyReadyForExpansion)}function i(e){E.roomlevelIsAt(e,T.RoomLevel.BasicColonyReadyForExpansion)&&E.hasAtLeastExtensions(e,5)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.SimpleColony)):E.controllerLevelBelow(e,2)&&E.roomlevelIsAt(e,T.RoomLevel.BasicColonyReadyForExpansion)&&C.setRoomLevel(e,T.RoomLevel.BasicColony)}function s(e){E.roomlevelIsAt(e,T.RoomLevel.SimpleColony)&&E.controllerLevelAtLeast(e,3)?C.setRoomLevel(e,T.RoomLevel.SimpleColonyReadyForExpansion):E.roomlevelIsAt(e,T.RoomLevel.SimpleColony)&&E.controllerLevelBelow(e,2)&&C.setRoomLevel(e,T.RoomLevel.BasicColony)}function l(e){E.hasActiveTower(e)&&E.hasAtLeastExtensions(e,10)&&E.roomlevelIsAt(e,T.RoomLevel.SimpleColonyReadyForExpansion)?C.setRoomLevel(e,T.RoomLevel.DefendedColony):E.roomlevelIsAt(e,T.RoomLevel.SimpleColonyReadyForExpansion)&&E.controllerLevelBelow(e,3)&&C.setRoomLevel(e,T.RoomLevel.SimpleColony)}function m(e){E.controllerLevelAtLeast(e,4)&&E.roomlevelIsAt(e,T.RoomLevel.DefendedColony)?C.setRoomLevel(e,T.RoomLevel.DefendedColonyReadyForExpansion):E.roomlevelIsAt(e,T.RoomLevel.DefendedColony)&&E.controllerLevelBelow(e,3)&&C.setRoomLevel(e,T.RoomLevel.SimpleColony)}function u(e){E.hasStorage(e)&&E.hasAtLeastExtensions(e,20)&&E.roomlevelIsAt(e,T.RoomLevel.DefendedColonyReadyForExpansion)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.CivilizedColony)):E.roomlevelIsAt(e,T.RoomLevel.DefendedColonyReadyForExpansion)&&E.controllerLevelBelow(e,4)&&C.setRoomLevel(e,T.RoomLevel.DefendedColony)}function y(e){E.controllerLevelAtLeast(e,5)&&E.roomlevelIsAt(e,T.RoomLevel.CivilizedColony)?C.setRoomLevel(e,T.RoomLevel.CivilizedColonyReadyForExpansion):!E.roomlevelIsAt(e,T.RoomLevel.CivilizedColony)||!E.controllerLevelBelow(e,4)&&E.hasStorage(e)||C.setRoomLevel(e,T.RoomLevel.DefendedColony)}function v(e){E.hasAtLeastExtensions(e,30)&&E.roomlevelIsAt(e,T.RoomLevel.CivilizedColonyReadyForExpansion)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.AdvancedColony)):E.roomlevelIsAt(e,T.RoomLevel.CivilizedColonyReadyForExpansion)&&E.controllerLevelBelow(e,5)&&C.setRoomLevel(e,T.RoomLevel.CivilizedColony)}function c(e){E.controllerLevelAtLeast(e,6)&&E.roomlevelIsAt(e,T.RoomLevel.AdvancedColony)?C.setRoomLevel(e,T.RoomLevel.AdvancedColonyReadyForExpansion):E.roomlevelIsAt(e,T.RoomLevel.AdvancedColony)&&E.controllerLevelBelow(e,5)&&C.setRoomLevel(e,T.RoomLevel.CivilizedColony)}function d(e){E.hasTerminal(e)&&E.hasAtLeastExtensions(e,40)&&E.roomlevelIsAt(e,T.RoomLevel.AdvancedColonyReadyForExpansion)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.Town)):E.roomlevelIsAt(e,T.RoomLevel.AdvancedColonyReadyForExpansion)&&E.controllerLevelBelow(e,6)&&C.setRoomLevel(e,T.RoomLevel.AdvancedColony)}function f(e){E.controllerLevelAtLeast(e,7)&&E.roomlevelIsAt(e,T.RoomLevel.Town)?C.setRoomLevel(e,T.RoomLevel.TownReadyForExpansion):!E.roomlevelIsAt(e,T.RoomLevel.Town)||!E.controllerLevelBelow(e,6)&&E.hasTerminal(e)||C.setRoomLevel(e,T.RoomLevel.AdvancedColony),void 0===e.memory.lab&&(e.memory.lab={}),E.hasAtLeastLabs(e,3)?e.memory.lab.operational&&void 0!==e.memory.lab.processingLabs&&void 0!==e.memory.lab.supplyingLabs&&2===e.memory.lab.supplyingLabs||(e.memory.lab.processingLabs=E.getProcessingLabs(e),e.memory.lab.supplyingLabs=E.getSupplyLabs(e),2===e.memory.lab.supplyingLabs.length&&0===e.memory.lab.processingLabs.length?e.memory.lab.operational=!0:e.memory.lab.operational=!1):(e.memory.lab.operational=!1,e.memory.lab.processingLabs=void 0,e.memory.lab.supplyingLabs=void 0)}function g(e){E.hasAtLeastSpawns(e,2)&&E.hasAtLeastExtensions(e,50)&&E.roomlevelIsAt(e,T.RoomLevel.TownReadyForExpansion)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.City)):E.roomlevelIsAt(e,T.RoomLevel.TownReadyForExpansion)&&E.controllerLevelBelow(e,7)&&C.setRoomLevel(e,T.RoomLevel.Town)}function R(e){if(E.controllerLevelAtLeast(e,8)&&E.roomlevelIsAt(e,T.RoomLevel.City))C.setRoomLevel(e,T.RoomLevel.CityReadyForExpansion)
else if(E.roomlevelIsAt(e,T.RoomLevel.City)&&E.controllerLevelBelow(e,7))return void C.setRoomLevel(e,T.RoomLevel.Town)
void 0===e.memory.lab&&(e.memory.lab={}),E.hasAtLeastLabs(e,6)?(!e.memory.lab.operational||void 0===e.memory.lab.processingLabs||e.memory.lab.processingLabs.length<3||void 0===e.memory.lab.supplyingLabs||2!==e.memory.lab.supplyingLabs)&&(e.memory.lab.processingLabs=E.getProcessingLabs(e),e.memory.lab.supplyingLabs=E.getSupplyLabs(e),2===e.memory.lab.supplyingLabs.length&&3===e.memory.lab.processingLabs.length?e.memory.lab.operational=!0:e.memory.lab.operational=!1):(e.memory.lab.operational=!1,e.memory.lab.processingLabs=void 0,e.memory.lab.supplyingLabs=void 0)}function p(e){E.hasAtLeastSpawns(e,3)&&E.hasAtLeastExtensions(e,60)&&E.roomlevelIsAt(e,T.RoomLevel.CityReadyForExpansion)?(S.clearOrders(e),C.setRoomLevel(e,T.RoomLevel.Metropolis)):E.roomlevelIsAt(e,T.RoomLevel.CityReadyForExpansion)&&E.controllerLevelBelow(e,8)&&C.setRoomLevel(e,T.RoomLevel.City)}function h(e){if(void 0===e.memory.lab)e.memory.lab={}
else{if(E.roomlevelIsAt(e,T.RoomLevel.Metropolis)&&!E.hasStorage(e))return void C.setRoomLevel(e,T.RoomLevel.DefendedColony)
if(E.roomlevelIsAt(e,T.RoomLevel.Metropolis)&&!E.hasTerminal(e))return void C.setRoomLevel(e,T.RoomLevel.AdvancedColony)
if(E.roomlevelIsAt(e,T.RoomLevel.Metropolis)&&E.controllerLevelBelow(e,8))return void C.setRoomLevel(e,T.RoomLevel.City)}E.hasAtLeastLabs(e,10)?(!e.memory.lab.operational||void 0===e.memory.lab.processingLabs||e.memory.lab.processingLabs.length<7||void 0===e.memory.lab.supplyingLabs||2!==e.memory.lab.supplyingLabs)&&(e.memory.lab.processingLabs=E.getProcessingLabs(e),e.memory.lab.supplyingLabs=E.getSupplyLabs(e),2===e.memory.lab.supplyingLabs.length&&7===e.memory.lab.processingLabs.length?e.memory.lab.operational=!0:e.memory.lab.operational=!1):(e.memory.lab.operational=!1,e.memory.lab.processingLabs=void 0,e.memory.lab.supplyingLabs=void 0)}var E=o(35),S=o(18),T=o(11),C=o(10),O=o(14),M=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"RoomlevelManager"))
return o.hasRunUpdate=!1,o.MEMORY_LASTRUN_UPDATE="lastRunUpdate",o.MEMORY_LASTRUN_CRISIS="lastRunCrisis",o.roomService=e,o}return _inherits(r,O.Manager),_createClass(r,[{key:"run",value:function(e){if(e===O.ManagerPriority.Low){var r=this.getValue(this.MEMORY_LASTRUN_UPDATE)
if(void 0===r||r+100<Game.time){var o=this.roomService.getNormalRooms(),a=!0,i=!1,s=void 0
try{for(var l,m=o[Symbol.iterator]();!(a=(l=m.next()).done);a=!0)t(l.value)}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}this.setValue(this.MEMORY_LASTRUN_UPDATE,Game.time),this.hasRunUpdate=!0}var u=this.getValue(this.MEMORY_LASTRUN_CRISIS)
if(void 0===u||u+500<Game.time){var y=this.roomService.getNormalRooms(),v=!0,c=!1,d=void 0
try{for(var f,g=y[Symbol.iterator]();!(v=(f=g.next()).done);v=!0)n(f.value)}catch(e){c=!0,d=e}finally{try{!v&&g.return&&g.return()}finally{if(c)throw d}}this.setValue(this.MEMORY_LASTRUN_CRISIS,Game.time)}}else if(e===O.ManagerPriority.Overflow&&!this.hasRunUpdate){var R=this.getValue(this.MEMORY_LASTRUN_UPDATE)
if(void 0===R||R+10<Game.time){var p=this.roomService.getNormalRooms(),h=!0,E=!1,S=void 0
try{for(var T,C=p[Symbol.iterator]();!(h=(T=C.next()).done);h=!0)t(T.value)}catch(e){E=!0,S=e}finally{try{!h&&C.return&&C.return()}finally{if(E)throw S}}this.setValue(this.MEMORY_LASTRUN_UPDATE,Game.time)}}}}]),r}()
r.RoomlevelManager=M},function(e,r,o){function t(e,r){var o=Game.rooms[e],t=c.controllerPos(e)
if(void 0!==o&&void 0!==o.storage&&(t=o.storage.pos),null!==t){var n=c.sourceIds(r),a=1e3
n.length>1&&(a=1500)
var s=!0,l=!1,m=void 0
try{for(var u,y=n[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
a-=4*i.getDistanseBetween(t,c.sourcePos(r,v))}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}var d=c.controllerPos(r)
if(null!==d)return a-=2*i.getDistanseBetween(t,d)}}var n=o(19),a=o(46),i=o(3),s=o(10),l=o(18),m=o(60),u=o(61),y=o(63),v=o(64),c=o(5),d=o(29),f=o(65),g=o(20),R=o(14),p=o(16),h=o(17),E=o(11),S=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"OutpostManager"))
return t.MEMORY_LASTRUN="lastRun",t.MEMORY_LASTRUN_OUTPOSTLIST="lastRunOutpostList",t.roomService=e,t.creepService=o,t}return _inherits(r,R.Manager),_createClass(r,[{key:"run",value:function(e){if(e===R.ManagerPriority.Standard){this.creepService.runCreeps(p.Role.OutpostReserver,m.run),this.creepService.runCreeps(p.Role.OutpostDefender,u.run),this.creepService.runCreeps(p.Role.OutpostSupporter,y.run),this.creepService.runCreeps(p.Role.OutpostWarrior,v.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+10<Game.time){var o=this.roomService.getNormalRooms(),t=!0,n=!1,a=void 0
try{for(var i,l=o[Symbol.iterator]();!(t=(i=l.next()).done);t=!0){var c=i.value;(s.getRoomLevel(c)>=E.RoomLevel.DefendedColony||c.isExpansion())&&this.orderOutpostDefenders(c),c.isExpansion()||s.getRoomLevel(c)>=E.RoomLevel.DefendedColony&&(void 0===c.storage||c.storage.store[RESOURCE_ENERGY]>500)&&(this.orderOutpostReservers(c),this.orderJanitors(c))}}catch(e){n=!0,a=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw a}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}else if(e===R.ManagerPriority.Low){var d=this.getValue(this.MEMORY_LASTRUN_OUTPOSTLIST)
if(void 0===d||d<Game.time){var f=!1,g=this.roomService.getNormalRooms(),h=!0,S=!1,T=void 0
try{for(var C,O=g[Symbol.iterator]();!(h=(C=O.next()).done);h=!0){var M=C.value
this.maintainOutpostList(M)&&!f&&(f=!0)}}catch(e){S=!0,T=e}finally{try{!h&&O.return&&O.return()}finally{if(S)throw T}}f?this.setValue(this.MEMORY_LASTRUN_OUTPOSTLIST,Game.time+20):this.setValue(this.MEMORY_LASTRUN_OUTPOSTLIST,Game.time+500)}}}},{key:"orderJanitors",value:function(e){var r=s.getBasicOutposts(e)
e.memory.praiseroomHibernated||(r=r.concat(e.memory.praiseroom))
var o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var l=a.value
if(c.hasIntel(l)&&!c.hasInvaders(l)){var m=Game.rooms[l]
if(void 0!==m){var u=m.find(FIND_MY_CONSTRUCTION_SITES).length
if(u>0){var y=Math.ceil(u/6)
this.orderJanitor(e,y)}}}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var v=s.getLairOutposts(e),d=!0,f=!1,g=void 0
try{for(var R,p=v[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(c.hasIntel(h)&&!c.hasInvaders(h)){var E=Game.rooms[h]
if(void 0!==E){var S=E.find(FIND_MY_CONSTRUCTION_SITES).length
if(S>0){var T=Math.ceil(S/6)
this.orderJanitor(e,T)}}}}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}},{key:"orderJanitor",value:function(e,r){var o=n.getMaxTierDistanceWorker(e.energyCapacityAvailable)
if(!(o<1||this.creepService.getCreeps(p.Role.Janitor,e.name).length+l.getCreepsInQueue(e,p.Role.Janitor,e.name)>1)){var t=o
if(r>=this.creepService.getNumberOfTiers(p.Role.Janitor,e.name)+l.getNumberOfTiersInQueue(e,p.Role.Janitor,e.name)){var a=new g.Order
a.body=n.getDistanceWorkerBody(t),a.priority=h.Priority.Standard,a.memory={role:p.Role.Janitor,target:e.name,tier:t},l.orderCreep(e,a)}}}},{key:"orderOutpostDefenders",value:function(e){c.hasHostiles(e.name)&&this.orderOutpostDefender(e,e.name)
var r=s.getBasicOutposts(e),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var l=a.value
c.hasHostiles(l)&&void 0!==Memory.rooms[l]&&(void 0===Memory.rooms[l].undefendable||Memory.rooms[l].undefendable<Game.time)&&this.orderOutpostDefender(e,l)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}},{key:"orderOutpostDefender",value:function(e,r){var o=this.creepService.getCreeps(p.Role.OutpostDefender,null,e.name),t=l.getCreepsInQueue(e,p.Role.OutpostDefender)
if(o.length>0){var a=!0,i=!1,s=void 0
try{for(var m,y=o[Symbol.iterator]();!(a=(m=y.next()).done);a=!0){var v=m.value.getState()
v===u.State.WaitingForSupport?this.orderOutpostSupporter(e):v===u.State.WaitingForWarrior&&(this.orderOutpostSupporter(e),this.orderOutpostWarrior(e))}}catch(e){i=!0,s=e}finally{try{!a&&y.return&&y.return()}finally{if(i)throw s}}}if(o.length+t>0)o.length>0&&void 0===o[0].memory.target&&(o[0].memory.target=r)
else{var c=n.getMaxTierRanger(e.energyCapacityAvailable),d=new g.Order
d.body=n.getRangerBody(c),d.priority=h.Priority.Critical,d.memory={role:p.Role.OutpostDefender,target:r,tier:c},l.orderCreep(e,d)}}},{key:"orderOutpostSupporter",value:function(e){var r=this.creepService.getCreeps(p.Role.OutpostSupporter,null,e.name),o=l.getCreepsInQueue(e,p.Role.OutpostSupporter)
if(!(r.length+o>0)){var t=n.getMaxTierSupporter(e.energyCapacityAvailable),a=new g.Order
a.body=n.getSupporterBody(t),a.priority=h.Priority.Important,a.memory={role:p.Role.OutpostSupporter,tier:t},l.orderCreep(e,a)}}},{key:"orderOutpostWarrior",value:function(e){var r=this.creepService.getCreeps(p.Role.OutpostWarrior,null,e.name),o=l.getCreepsInQueue(e,p.Role.OutpostWarrior)
if(!(r.length+o>0)){var t=n.getMaxTierRogue(e.energyCapacityAvailable),a=new g.Order
a.body=n.getRogueBody(t),a.priority=h.Priority.Important,a.memory={role:p.Role.OutpostWarrior,tier:t},l.orderCreep(e,a)}}},{key:"orderOutpostReservers",value:function(e){var r=s.getBasicOutposts(e),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var l=a.value
if(c.hasIntel(l)&&(!0!==Memory.rooms[l].isPraiseRoom||!0===e.memory.praiseroomHibernated)&&!c.hasInvaders(l)&&c.isReservedByMeFor(l)<1e3){var m=c.controllerPos(l),u=c.controllerId(l)
null!==m&&null!==u&&this.orderOutpostReserver(e,m,u)}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}},{key:"orderOutpostReserver",value:function(e,r,o){var t=n.getMaxTierClaimer(e.energyCapacityAvailable)
if(!(t<1)){var a=Math.min(10,t)
if(1>this.creepService.getNumberOfTiers(p.Role.OutpostReserver,"$"+r.roomName+"-"+o)+l.getNumberOfTiersInQueue(e,p.Role.OutpostReserver,"$"+r.roomName+"-"+o)){var i=new g.Order
i.body=n.getClaimerBody(a),i.priority=h.Priority.Standard,i.memory={role:p.Role.OutpostReserver,target:"$"+r.roomName+"-"+o,tier:a},l.orderCreep(e,i)}}}},{key:"maintainOutpostList",value:function(e){if(void 0===e.memory.neighbours||void 0===e.memory.neighbours.oneAway)return!1
var r=s.getRoomLevel(e),o=s.getAllOutposts(e),t=0
if(!0===Memory.settings.bot){var n=!0,a=!1,i=void 0
try{for(var l,m=o[Symbol.iterator]();!(n=(l=m.next()).done);n=!0){var u=l.value
if(c.isOccupied(u))return console.log("Outpost "+u+" seems to be occupied by an unknown force, reseting outposts for room "+e.name),e.memory.outposts=void 0,!0
if(c.isOwnedByMe(u))return console.log("Outpost "+u+" seems to be owned by me, reseting outposts for room "+e.name),e.memory.outposts=void 0,!0
if(void 0!==Memory.rooms[u]&&Memory.rooms[u].undefendable>Game.time)return console.log("Outpost "+u+" seems to be undefendable, reseting outposts for room "+e.name),e.memory.outposts=void 0,!0}}catch(e){a=!0,i=e}finally{try{!n&&m.return&&m.return()}finally{if(a)throw i}}}t=r>=E.RoomLevel.CityReadyForExpansion&&!0===Memory.settings.bot?6:r>=E.RoomLevel.TownReadyForExpansion?4:2,!0===Memory.settings.slow&&!0===Memory.settings.bot&&(t=r>=E.RoomLevel.CityReadyForExpansion?3:r>=E.RoomLevel.TownReadyForExpansion?2:1)
var y=_.filter(e.memory.neighbours.oneAway,function(e){return s.isSKRoom(e)})
if(r>=E.RoomLevel.TownReadyForExpansion&&y.length>0&&(t-=1),o.length<t){if(void 0===e.memory.outposts&&(e.memory.outposts=[]),r>=E.RoomLevel.TownReadyForExpansion&&y.length>0&&!_.contains(e.memory.outposts,y[0]))return e.memory.outposts.push(y[0]),console.log("Added outpost for room "+e.name+": "+y[0]),!0
var v=this.getNextOutpost(e.name)
if(void 0!==v)return r>=E.RoomLevel.TownReadyForExpansion&&y.length>0&&!_.contains(e.memory.outposts,y[0])&&(v=y[0]),e.memory.outposts.push(v),console.log("Added outpost for room "+e.name+": "+v),!0
!0===Memory.settings.bot&&this.guardNextWantedOutpost(e)}return!1}},{key:"guardNextWantedOutpost",value:function(e){if(!(void 0===e.controller||e.controller.level<5)){var r=this.getNextOutpost(e.name,!0)
void 0===r||c.isOwned(r)||void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<5e4||f.roomIsHavingActiveGuardOperation(r)||f.createGuardOutpostOperation(e,r)}}},{key:"getNextOutpost",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=a.getRoomsOneAway(e),n=o,i=[]
if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].outposts){var l=!0,m=!1,u=void 0
try{for(var y,v=Memory.rooms[e].outposts[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var d=y.value
n=n.concat(a.getRoomsOneAway(d))}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}i=_.filter(_.uniq(n),function(r){return r!==e&&!_.contains(Memory.rooms[e].outposts,r)})}else i=_.filter(_.uniq(n),function(r){return r!==e})
i=_.filter(i,function(e){return void 0===Memory.rooms[e]||void 0===Memory.rooms[e].undefendable||Memory.rooms[e].undefendable<Game.time})
var f=s.getAllOutpostsInAllRooms(this.roomService.getNormalRooms())
if(!0===Memory.settings.bot){var g=!0,R=!1,p=void 0
try{for(var h,E=o[Symbol.iterator]();!(g=(h=E.next()).done);g=!0){var S=h.value
if((void 0===Memory.rooms[e].outposts||!_.contains(Memory.rooms[e].outposts,S))&&_.contains(f,S)){var T=s.getOwnerOfOutpost(S,this.roomService.getNormalRooms())
if(void 0!==T){var C=a.getRoomsOneAway(T.name)
_.contains(C,S)||(console.log("Outpost "+S+" seems to be reserved by "+T.name+", but should be owned by "+e+". Reseting outposts for "+T.name),T.memory.outposts=[])}}}}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}}i=_.filter(i,function(e){return!_.contains(f,e)}),r||(i=_.filter(i,function(e){return!c.isOccupied(e)})),i=_.filter(i,function(e){return!c.isOwnedByMe(e)})
var O=[],M=!0,b=!1,w=void 0
try{for(var N,A=i[Symbol.iterator]();!(M=(N=A.next()).done);M=!0){var U=N.value
O.push({roomName:U,value:t(e,U)})}}catch(e){b=!0,w=e}finally{try{!M&&A.return&&A.return()}finally{if(b)throw w}}if((O=_(_.filter(_.sortBy(O,"value"),function(e){return void 0!==e.value})).reverse().value()).length>0)return O[0].roomName}}]),r}()
r.OutpostManager=S,r.listNextOutposts=function(e){var r=a.getRoomsOneAway(e),o=[]
if(void 0!==Memory.rooms[e]&&void 0!==Memory.rooms[e].outposts){var n=!0,i=!1,s=void 0
try{for(var l,m=Memory.rooms[e].outposts[Symbol.iterator]();!(n=(l=m.next()).done);n=!0){var u=l.value
r=r.concat(a.getRoomsOneAway(u))}}catch(e){i=!0,s=e}finally{try{!n&&m.return&&m.return()}finally{if(i)throw s}}o=_.filter(_.uniq(r),function(r){return r!==e&&!_.contains(Memory.rooms[e].outposts,r)})}else o=_.filter(_.uniq(r),function(r){return r!==e})
var y=[],v=!0,c=!1,d=void 0
try{for(var f,g=o[Symbol.iterator]();!(v=(f=g.next()).done);v=!0){var R=f.value
y.push({roomName:R,value:t(e,R)})}}catch(e){c=!0,d=e}finally{try{!v&&g.return&&g.return()}finally{if(c)throw d}}y=_(_.filter(_.sortBy(y,"value"),function(e){return void 0!==e.value})).reverse().value(),console.log("Room "+e+" outpost-values (best first)")
var p=!0,h=!1,E=void 0
try{for(var S,T=y[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value
console.log(C.roomName+": "+C.value)}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}},r.evaluateOutposts=function(e){var r=a.getRoomsOneAway(e).concat(a.getRoomsTwoAway(e),a.getRoomsThreeAway(e)),o=_.filter(r,function(e){return!d.roomIsHighway(e)&&!s.isMiddleRoom(e)}),n=[],i=!0,l=!1,m=void 0
try{for(var u,y=o[Symbol.iterator]();!(i=(u=y.next()).done);i=!0){var v=u.value
n.push({roomName:v,value:t(e,v)})}}catch(e){l=!0,m=e}finally{try{!i&&y.return&&y.return()}finally{if(l)throw m}}return n=_(_.filter(_.sortBy(n,"value"),function(e){return void 0!==e.value})).reverse().value()},r.getOutpostValue=t},function(e,r,o){function t(e){var r=e.substr(1).split("-")[0],o=i.controllerPos(r),t=i.controllerId(r)
return null!==o&&null!==t?new RoomPosition(o.x,o.y,o.roomName):null}function n(e){return Game.getObjectById(e.substr(1).split("-")[1])}var a=o(33),i=o(5)
r.run=function(e){var r=t(e.memory.target)
if(null!==r){if(!a.targetRoomHasInvaders(e,r.roomName))if(r.roomName!==e.room.name)e.travelTo({pos:r})
else{var o=e.reserveController(n(e.memory.target))
o!==ERR_NOT_IN_RANGE&&o!==ERR_NOT_ENOUGH_RESOURCES||e.travelTo({pos:r})}}else console.log("Missing controllerPos for reserver: "+e.pos)}},function(e,r,o){function t(e){if(void 0!==m(e))return e.setState(C.MovingToTargetRoom),void n(e)
var r=e.getHomeroom()
e.room.name!==e.getHomeroom()||h.positionIsBorder(e.pos)?e.travelToRoom(r,{allowHostile:!1}):g.moveOffRoad(e)}function n(e){var r=m(e),o=d(e),t=f(e)
void 0!==r?r!==e.room.name||h.positionIsBorder(e.pos)?(void 0===o||e.pos.getRangeTo(o)<2||o.pos.roomName!==e.pos.roomName)&&(void 0===t||e.pos.getRangeTo(t)<4||t.pos.roomName!==e.pos.roomName)&&e.travelToRoom(r,{allowHostile:!1}):(T.log.info("Defender starting to defend outpost",e.room.name),e.setState(C.Defending),a(e)):e.setState(C.Standby)}function a(e){if(E.isOwned(e.pos.roomName)){var r=m(e)
return e.pos.roomName===r?(e.memory.target=void 0,void e.setState(C.Standby)):void e.setState(C.MovingToTargetRoom)}if(0!==e.getActiveBodyparts(RANGED_ATTACK)){var o=v(e),t=d(e)
if(Game.time%5==0||void 0===o){if((o=y(e))instanceof Creep&&void 0===t){var n=S.getStatsForCreep(o),a=S.getStatsForCreep(e)
if(n.rpt>3*a.hpt||n.hpt>a.rpt)return T.log.alert("Defender needs warrior to defend outpost",e.room.name),e.setState(C.WaitingForWarrior),void s(e)
if(n.rpt>a.hpt)return T.log.alert("Defender needs supporter to defend outpost",e.room.name),e.setState(C.WaitingForSupport),void i(e)}if(void 0===o)return c(e),void(void 0===e.memory.cooldown?e.memory.cooldown=30:e.memory.cooldown>0?e.memory.cooldown--:(e.memory.cooldown=void 0,e.setState(C.Standby)))}if(void 0===t||e.pos.getRangeTo(t)<4){var l=3
o instanceof Creep&&0===o.getActiveBodyparts(ATTACK)&&0===o.getActiveBodyparts(RANGED_ATTACK)?l=1:o instanceof Structure&&(l=2),R.kiteAndAttack(e,o,l)||R.rangedAttackToEnemiesAround(e)}else R.rangedAttackToEnemiesAround(e)}else void 0!==f(e)?(e.room.name!==e.getHomeroom()&&(e.room.memory.undefendable=Game.time+5e3,e.memory.target=void 0,T.log.alert("Defender tags room as undefendable",e.room.name)),e.setState(C.Standby)):(e.setState(C.WaitingForWarrior),s(e),T.log.alert("Defender needs warrior to defend outpost",e.room.name))}function i(e){if(void 0!==d(e))return e.setState(C.MovingToTargetRoom),void T.log.alert("Defender has gotten supporter and returns defending",e.room.name)
var r=e.getHomeroom()
e.room.name!==e.getHomeroom()||h.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r,{allowHostile:!1}):g.moveOffRoad(e)}function s(e){var r=f(e),o=d(e)
if(void 0!==r&&void 0!==o)return e.setState(C.MovingToTargetRoom),void T.log.alert("Defender has gotten warrior and returns defending",e.room.name)
var t=e.getHomeroom()
e.room.name!==e.getHomeroom()||h.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(t,{allowHostile:!1}):g.moveOffRoad(e)}function l(e){var r=e.getHomeroom()
e.room.name!==e.getHomeroom()||h.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r,{allowHostile:!1}):0!==e.missingHits()?g.moveOffRoad(e):e.setState(C.Standby)}function m(e){return e.memory.target}function u(e){if(e.getActiveBodyparts(HEAL)<1)return!0
var r=d(e),o=f(e),t=e
return void 0!==r&&e.pos.getRangeTo(r)<4&&r.missingHits()>t.missingHits()&&(t=r),void 0!==o&&e.pos.getRangeTo(o)<4&&o.missingHits()>t.missingHits()&&(t=o),t.missingHits()>0&&(e.say("heals"),e.heal(t),!0)}function y(e){var r=p.getPrioritizedTargetIncludingVitalBuildings(e)
{if(null!==r)return e.memory.targetEnemy=r.id,r
e.memory.targetEnemy=void 0}}function v(e){var r=Game.getObjectById(e.memory.targetEnemy)
if(null!==r)return r}function c(e){E.saveIntelForRoom(e.room),e.memory.target=void 0}function d(e){var r=Game.getObjectById(e.memory.supporter)
{if(null!==r)return r
e.memory.supporter=void 0}}function f(e){var r=Game.getObjectById(e.memory.warrior)
{if(null!==r)return r
e.memory.warrior=void 0}}var g=o(33),R=o(54),p=o(55),h=o(45),E=o(5),S=o(62),T=o(7)
!function(e){e[e.Standby=1]="Standby",e[e.MovingToTargetRoom=2]="MovingToTargetRoom",e[e.Defending=3]="Defending",e[e.WaitingForSupport=4]="WaitingForSupport",e[e.RunHomeForHeal=5]="RunHomeForHeal",e[e.WaitingForWarrior=6]="WaitingForWarrior"}(r.State||(r.State={}))
var C=r.State
r.run=function(e){e.notifyWhenAttacked(!1),e.hasState()||e.setState(C.Standby)
var r=u(e)
switch(e.getState()){case C.Standby:t(e)
break
case C.MovingToTargetRoom:n(e)
break
case C.Defending:r||e.heal(e),a(e)
break
case C.WaitingForSupport:i(e)
break
case C.WaitingForWarrior:s(e)
break
case C.RunHomeForHeal:l(e)
break
default:T.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(C.Standby)}}},function(e,r){r.getStatsForCreep=function(e){var r={mpt:0,rpt:0,hpt:0,dpt:0},o=!0,t=!1,n=void 0
try{for(var a,i=e.body[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value,l=1
switch(void 0!==s.boost&&(5===s.boost.length?l=4:4===s.boost.length?l=3:2===s.boost.length&&(l=2)),s.type){case ATTACK:r.mpt+=ATTACK_POWER*l
break
case RANGED_ATTACK:r.rpt+=RANGED_ATTACK_POWER*l
break
case HEAL:r.hpt+=HEAL_POWER*l
break
case WORK:r.dpt+=DISMANTLE_POWER*l}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r},r.getStatsForCreepBody=function(e){var r={mpt:0,rpt:0,hpt:0,dpt:0},o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)switch(a.value){case ATTACK:r.mpt+=1*ATTACK_POWER
break
case RANGED_ATTACK:r.rpt+=1*RANGED_ATTACK_POWER
break
case HEAL:r.hpt+=1*HEAL_POWER
break
case WORK:r.dpt+=1*DISMANTLE_POWER}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}},function(e,r,o){function t(e){var r=i(e)
if(void 0!==r)if(r.getState()!=y.State.Standby){var o=l(r)
void 0!==o&&e.pos.getRangeTo(o)<=3?e.rangedAttack(o):v.rangedAttackToEnemiesAround(e),1===e.pos.getRangeTo(r)?e.moveTo(r.pos,{ignoreCreeps:!0}):e.travelTo(r)}else e.setState(u.Standby)
else e.setState(u.Standby)}function n(e){var r=i(e)
if(void 0===r&&(r=m(e)),void 0!==r&&r.getState()!==y.State.Standby)return e.setState(u.FollowingDefender),void t(e)
var o=e.getHomeroom()
e.room.name!==e.getHomeroom()||d.positionIsBorder(e.pos)?e.travelToRoom(o,{allowHostile:!1}):c.moveOffRoad(e)}function a(e){if(e.getActiveBodyparts(HEAL)<1)return!0
var r=i(e),o=s(e),t=e
return void 0!==r&&e.pos.getRangeTo(r)<4&&r.missingHits()>t.missingHits()&&(t=r),void 0!==o&&e.pos.getRangeTo(o)<4&&o.missingHits()>t.missingHits()&&(t=o),t.missingHits()>0&&(e.say("healz"),e.heal(t),!0)}function i(e){var r=Game.getObjectById(e.memory.defender)
{if(null!==r)return r
e.memory.defender=void 0}}function s(e){var r=Game.getObjectById(e.memory.defender)
if(null!==r){var o=Game.getObjectById(r.memory.warrior)
if(null!==o)return o}else e.memory.defender=void 0}function l(e){var r=Game.getObjectById(e.memory.targetEnemy)
if(null!==r)return r}function m(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return e.memory.role===f.Role.OutpostDefender&&void 0===e.memory.supporter}})
if(r.length>0)return e.memory.defender=r[0].id,r[0].memory.supporter=e.id,r[0]}var u,y=o(61),v=o(54),c=o(33),d=o(45),f=o(16),g=o(7)
!function(e){e[e.Standby=1]="Standby",e[e.FollowingDefender=2]="FollowingDefender"}(u||(u={})),r.run=function(e){e.notifyWhenAttacked(!1),e.hasState()||e.setState(u.Standby)
var r=a(e)
switch(e.getState()){case u.Standby:n(e)
break
case u.FollowingDefender:r||e.heal(e),t(e)
break
default:g.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(u.Standby)}}},function(e,r,o){function t(e){var r=a(e)
if(void 0!==r)if(r.getState()!=m.State.Standby){var o=i(r)
0===e.getActiveBodyparts(ATTACK)?e.moveTo(r):void 0!==o&&o.pos.roomName===e.pos.roomName&&r.pos.roomName===e.pos.roomName?1===e.pos.getRangeTo(o)?e.moveTo(o.pos,{ignoreCreeps:!0}):e.moveTo(o):e.travelTo(r),void 0!==o&&1===e.pos.getRangeTo(o)&&(e.say("Yeeha!"),e.attack(o))}else e.setState(l.Standby)
else e.setState(l.Standby)}function n(e){var r=a(e)
if(void 0===r&&(r=s(e)),void 0!==r&&r.getState()!==m.State.Standby)return e.setState(l.FollowingDefender),void t(e)
var o=e.getHomeroom()
e.room.name!==e.getHomeroom()||y.positionIsBorder(e.pos)?e.travelToRoom(o,{allowHostile:!1}):u.moveOffRoad(e)}function a(e){var r=Game.getObjectById(e.memory.defender)
{if(null!==r)return r
e.memory.defender=void 0}}function i(e){var r=Game.getObjectById(e.memory.targetEnemy)
if(null!==r)return r}function s(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return e.memory.role===v.Role.OutpostDefender&&void 0===e.memory.warrior}})
if(r.length>0)return e.memory.defender=r[0].id,r[0].memory.warrior=e.id,r[0]}var l,m=o(61),u=o(33),y=o(45),v=o(16),c=o(7)
!function(e){e[e.Standby=1]="Standby",e[e.FollowingDefender=2]="FollowingDefender"}(l||(l={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(l.Standby),e.getState()){case l.Standby:n(e)
break
case l.FollowingDefender:t(e)
break
default:c.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.Standby)}}},function(e,r,o){function t(e){void 0===Memory.operations&&(Memory.operations=[]),Memory.operations.push(e)}function n(e,r){var o=void 0,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
e!==l.name&&Game.map.getRoomLinearDistance(e,l.name)<5&&void 0!==l.storage&&l.storage.store[RESOURCE_ENERGY]>1e5&&(void 0===o||void 0===o.storage||l.storage.store[RESOURCE_ENERGY]>o.storage.store[RESOURCE_ENERGY])&&(o=l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}if(void 0!==o)return o}var a=o(66),i=o(67),s=o(15)
r.roomIsReceiveingHaulOperation=function(e){if(void 0===Memory.operations&&(Memory.operations=[]),0===Memory.operations.length)return!1
var r=!0,o=!1,t=void 0
try{for(var n,a=Memory.operations[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(i.active&&i.operationtype===s.OperationType.Haul&&i.to===e)return!0}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return!1},r.roomIsHavingActiveGuardOperation=function(e){if(void 0===Memory.operations&&(Memory.operations=[]),0===Memory.operations.length)return!1
var r=!0,o=!1,t=void 0
try{for(var n,a=Memory.operations[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(i.active&&i.operationtype===s.OperationType.Guard&&i.targetRoom===e)return!0}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return!1},r.createGuardOutpostOperation=function(e,r){var o=new i.Data
return o.operationtype=s.OperationType.Guard,o.room=e.name,o.targetRoom=r,o.victoryCondition=i.VictoryCondition.Gametime,o.victoryValue=Game.time+8e3,t(o),console.log("Starting a operation from room "+e.name+" to guard outpost "+r+", because it is wanted as outpost."),!0},r.createCrisisHaulOperation=function(e,r){var o=n(e,r)
if(void 0===o)return!1
var i=new a.Data
return i.operationtype=s.OperationType.Haul,i.from=o.name,i.to=e,void 0!==o.controller&&o.controller.level>6?i.amount=20:i.amount=10,i.victoryCondition=a.VictoryCondition.Gametime,i.victoryValue=Game.time+5e3,t(i),console.log("Starting a crisisconvoy from room "+o+" to room "+e+", supplying 20 energy a tick."),!0},r.findCrisisHaulProvider=n},function(e,r,o){function t(e,r){var o=Game.rooms[e.from]
if(o instanceof Room&&void 0!==o.storage){var t=u.getMaxTierOffroadHauler(o.energyCapacityAvailable)
if(void 0===e.haulersNeeded){var n=Game.rooms[e.to],a=new RoomPosition(25,25,e.to)
n instanceof Room&&void 0!==n.storage&&(a=n.storage.pos)
var v=y.getDistanseBetween(o.storage.pos,a),c=e.amount*v*2/50
e.haulersNeeded=Math.ceil(c/t)}if(r.getCreeps(i.Role.OperationHauler,e.to,e.from).length+l.getCreepsInQueue(o,i.Role.OperationHauler,e.to)<e.haulersNeeded){var d=new m.Order
d.body=u.getOffroadHaulerBody(t),d.priority=s.Priority.Low,d.memory={role:i.Role.OperationHauler,target:e.to,tier:t},l.orderCreep(o,d)}}}var n=o(14),a=o(15),i=o(16),s=o(17),l=o(18),m=o(20),u=o(19),y=o(3)
!function(e){e[e.RoomLevel=1]="RoomLevel",e[e.Gametime=2]="Gametime"}(r.VictoryCondition||(r.VictoryCondition={}))
var v=r.VictoryCondition
r.Data=function e(){_classCallCheck(this,e),this.operationtype=a.OperationType.Haul,this.active=!0},r.run=function(e,r,o){o===n.ManagerPriority.Low&&Game.time%50==0&&t(e,r)},r.victoryConditionReached=function(e){var r=Game.rooms[e.to]
if(!(r instanceof Room))return!1
switch(e.victoryCondition){case v.RoomLevel:if(void 0!==r.controller&&r.controller.level>=e.victoryValue)return e.active=!1,!0
break
case v.Gametime:if(Game.time>e.victoryValue)return e.active=!1,!0}return!1}},function(e,r,o){function t(e,r){if(!(Game.time>e.victoryValue)){var o=Game.rooms[e.room]
if(o instanceof Room&&void 0!==o.storage&&(void 0===e.unitType&&(_.random(1,10)>5?e.unitType=l.Role.Ranger:e.unitType=l.Role.Paladin),!(void 0===o.storage||o.storage.store[RESOURCE_ENERGY]<2e4||void 0!==e.lastOrder&&e.lastOrder+1500>Game.time))){var t=r.getCreeps(e.unitType,e.targetRoom,o.name).length,i=u.getCreepsInQueue(o,e.unitType,e.targetRoom)
if(t+i===0)switch(e.lastOrder=Game.time,e.unitType){case l.Role.Ranger:n(o,e.targetRoom)
break
case l.Role.Paladin:a(o,e.targetRoom)}if(!(void 0===o.controller||o.controller.level<8)){var s=l.Role.Paladin
if(e.unitType===s&&(s=l.Role.Ranger),t=r.getCreeps(s,e.targetRoom,o.name).length,i=u.getCreepsInQueue(o,s,e.targetRoom),t+i===0)switch(s){case l.Role.Ranger:n(o,e.targetRoom)
break
case l.Role.Paladin:a(o,e.targetRoom)}void 0===o.controller||o.controller.level}}}}function n(e,r){var o=v.getMaxTierRanger(e.energyCapacityAvailable),t=new y.Order
t.body=v.getRangerBody(o),t.priority=m.Priority.Important,t.memory={role:l.Role.Ranger,target:r,tier:o},u.orderCreep(e,t)}function a(e,r){var o=v.getMaxTierPaladin(e.energyCapacityAvailable),t=new y.Order
t.body=v.getPaladinBody(o),t.priority=m.Priority.Important,t.memory={role:l.Role.Paladin,target:r,tier:o},u.orderCreep(e,t)}var i=o(14),s=o(15),l=o(16),m=o(17),u=o(18),y=o(20),v=o(19)
!function(e){e[e.Gametime=1]="Gametime"}(r.VictoryCondition||(r.VictoryCondition={}))
var c=r.VictoryCondition
r.Data=function e(){_classCallCheck(this,e),this.operationtype=s.OperationType.Guard,this.active=!0},r.run=function(e,r,o){o===i.ManagerPriority.Low&&Game.time%50==0&&t(e,r)},r.victoryConditionReached=function(e){switch(e.victoryCondition){case c.Gametime:if(Game.time>e.victoryValue+1e4)return e.active=!1,!0}return!1}},function(e,r,o){function t(e){var r=e.getMineral()
if(r){var o=r.pos.lookFor(LOOK_STRUCTURES)
if(o.length>0&&o[0].structureType===STRUCTURE_EXTRACTOR){var t=o[0]
t.my?e.memory.miningMinerals=!0:t.destroy()}else r.buildMiningContainer(),r.buildExtractor()}}function n(e){e.room.memory.isPraiseRoom&&void 0!==e.room.controller&&e.room.controller.my&&e.room.controller.level>=6&&e.buildExtractor(),e&&!e.hasMiningContainer()&&e.buildMiningContainer()}var a=o(19),i=o(69),s=o(18),l=o(70),m=o(71),u=o(14),y=o(5),v=o(20),c=o(10),d=o(16),f=o(17),g=o(11),R=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MineralManager"))
return t.hasRun=!1,t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,u.Manager),_createClass(r,[{key:"run",value:function(e){if(e===u.ManagerPriority.Standard){var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+50<Game.time){var o=this.roomService.getNormalRoomsNotAbandoned()
this.mineMinerals(o),this.setValue(this.MEMORY_LASTRUN,Game.time),this.hasRun=!0}}else if(e===u.ManagerPriority.Low)this.creepService.runCreeps(d.Role.MineralMiner,l.run),this.creepService.runCreeps(d.Role.MineralHauler,m.run)
else if(e===u.ManagerPriority.Overflow&&!this.hasRun){var t=this.getValue(this.MEMORY_LASTRUN)
if(void 0===t||t+20<Game.time){var n=this.roomService.getNormalRoomsNotAbandoned()
this.mineMinerals(n),this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"mineMinerals",value:function(e){var r=!0,o=!1,a=void 0
try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done);r=!0){var l=i.value
if(c.getRoomLevel(l)>=g.RoomLevel.Town)if(l.memory.miningMinerals){var m=l.getMineral()
void 0!==m&&void 0!==l.storage&&(void 0==l.storage.store[m.mineralType]||l.storage.store[m.mineralType]<25e4)&&_.sum(l.storage.store)<.95*l.storage.storeCapacity&&(this.orderMineralMiner(l),this.orderMineralHauler(l,m))}else t(l)
var u=c.getLairOutposts(l)
if(c.getRoomLevel(l)>=g.RoomLevel.City&&(u.length>0||void 0!==l.memory.praiseroom)){var v=u
!0!==l.memory.praiseroomHibernated&&(v=u.concat(l.memory.praiseroom))
var d=!0,f=!1,R=void 0
try{for(var p,h=v[Symbol.iterator]();!(d=(p=h.next()).done);d=!0){var E=p.value,S=Game.rooms[E]
if(!y.hasInvaders(E)&&void 0!==S&&(void 0===S.controller||S.controller.level>5)){var T=S.getMineral()
void 0!==T&&void 0===T.ticksToRegeneration&&void 0!==l.storage&&(void 0==l.storage.store[T.mineralType]||l.storage.store[T.mineralType]<25e4)&&_.sum(l.storage.store)<.95*l.storage.storeCapacity&&(T.hasMiningContainer()&&T.hasExtractor()?(this.orderSKMineralMiner(l,T),this.orderMineralHauler(l,T)):n(T))}}}catch(e){f=!0,R=e}finally{try{!d&&h.return&&h.return()}finally{if(f)throw R}}}}}catch(e){o=!0,a=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw a}}}},{key:"orderMineralMiner",value:function(e){var r=e.getMineral()
if(void 0!==r&&void 0===r.ticksToRegeneration&&r.hasMiningContainer()){var o=this.creepService.getCreeps(d.Role.MineralMiner,r.id).length
if(!(s.getCreepsInQueue(e,d.Role.MineralMiner,r.id)+o>=1)){var t=a.getMaxTierStationaryWorker(e.energyCapacityAvailable),n=new v.Order
n.body=a.getStationaryWorkerBody(t),n.priority=f.Priority.Standard,n.memory={role:d.Role.MineralMiner,target:r.id,tier:t},s.orderCreep(e,n)}}}},{key:"orderMineralHauler",value:function(e,r){if(void 0!==r){var o=r.getMiningContainer()
if(null!==o&&0!==_.sum(o.store)){var t=r.room.name+"-"+r.id,n=this.creepService.getCreeps(d.Role.MineralHauler,t).length
if(!(s.getCreepsInQueue(e,d.Role.MineralHauler,t)+n>=1)){var l=a.getMaxTierHauler(e.energyCapacityAvailable),m=i.getTiersRequiredForMineralHauling(r,e),u=Math.min(l,Math.max(m,2)),y=new v.Order
y.body=a.getHaulerBody(u),y.priority=f.Priority.Standard,y.memory={role:d.Role.MineralHauler,target:t,tier:u},s.orderCreep(e,y)}}}}},{key:"orderSKMineralMiner",value:function(e,r){var o=r
if(void 0!==o&&void 0===o.ticksToRegeneration&&o.hasMiningContainer()){var t=this.creepService.getCreeps(d.Role.MineralMiner,o.id).length
if(!(s.getCreepsInQueue(e,d.Role.MineralMiner,o.id)+t>=1)){var n=a.getMaxTierStationaryWorker(e.energyCapacityAvailable),i=new v.Order
i.body=a.getStationaryWorkerBody(n),i.priority=f.Priority.Standard,i.memory={role:d.Role.MineralMiner,target:o.id,tier:n},s.orderCreep(e,i)}}}}]),r}()
r.MineralManager=R},function(e,r,o){function t(e){for(var r=0,o=-1;o<2;o++)for(var t=-1;t<2;t++){var n=new RoomPosition(e.pos.x+o,e.pos.y+t,e.room.name)
if(n.x!==e.pos.x||n.y!==e.pos.y){var a=n.lookFor(LOOK_TERRAIN)
"swamp"!==a[0]&&"plain"!==a[0]||r++}}return r}function n(e){return e.find(FIND_SOURCES)}function a(e,r){var o=r.getDistanceFrom(e.name)
if(void 0===o){var t=e.getSpawn()
if(void 0===t)return 50
var n=i.getDistanseBetween(t.pos,r.pos)
return r.setDistanceFrom(e.name,n),n}return o}var i=o(3),s=o(11),l=o(10),m=o(5)
r.getTiersRequiredForPioneerMining=function(e,r,o,t){var n=i.getDistanseBetween(o,t),a=r*e,s=Math.min(5,a),l=25/(25+2*n)
return Math.ceil(s/l)},r.getTiersRequiredForDistanceMining=function(e,r,o){var n=e.energyCapacity/300/2,a=t(e)*o,s=Math.min(n,a),l=25/(25+2*i.getDistanseBetween(e.pos,r.pos))
return Math.ceil(s/l)},r.getWorkerPartsRequiredForContainerMining=function(e){var r=3*e
return Math.min(5,r)},r.getRequiredEnergyHaulers=function(e,r){var o=e.getSpawn()
if(void 0===o)return 0
var t=50*r,a=0,s=n(e),u=!0,y=!1,v=void 0
try{for(var c,d=s[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
a+=10*i.getDistanseBetween(o.pos,f.pos)}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}var g=l.getBasicOutposts(e),R=!0,p=!1,h=void 0
try{for(var E,S=g[Symbol.iterator]();!(R=(E=S.next()).done);R=!0){var T=E.value
if(m.hasIntel(T)){var C=!0,O=!1,M=void 0
try{for(var _,b=m.sourceIds(T)[Symbol.iterator]();!(C=(_=b.next()).done);C=!0){var w=_.value
a+=10*i.getDistanseBetween(o.pos,m.sourcePos(T,w))}}catch(e){O=!0,M=e}finally{try{!C&&b.return&&b.return()}finally{if(O)throw M}}}}}catch(e){p=!0,h=e}finally{try{!R&&S.return&&S.return()}finally{if(p)throw h}}var N=l.getLairOutposts(e),A=!0,U=!1,k=void 0
try{for(var I,L=N[Symbol.iterator]();!(A=(I=L.next()).done);A=!0){var P=I.value
if(m.hasIntel(P)){var x=!0,G=!1,B=void 0
try{for(var D,H=m.sourceIds(P)[Symbol.iterator]();!(x=(D=H.next()).done);x=!0){var W=D.value
a+=16*i.getDistanseBetween(o.pos,m.sourcePos(P,W))}}catch(e){G=!0,B=e}finally{try{!x&&H.return&&H.return()}finally{if(G)throw B}}}}}catch(e){U=!0,k=e}finally{try{!A&&L.return&&L.return()}finally{if(U)throw k}}return Math.ceil(a/t)},r.getTiersRequiredForContainerHauling=function(e,r,o){var t=r.storage,n=r.getSpawn()
if(void 0===t&&void 0!==n&&(t=n),void 0===t)return console.log("No spawn or storage found for containerhaulers homeroom."),0
var a=2*i.getDistanseBetween(t.pos,e)*Math.ceil(o/300)
return l.getRoomLevel(r)<s.RoomLevel.CivilizedColony&&(a+=30),Math.ceil(1.2*a/100)},r.getTiersRequiredForMineralHauling=function(e,r){var o=r.storage,t=r.getSpawn()
if(void 0===o&&void 0!==t&&(o=t),void 0===o)return console.log("No spawn or storage found for mineralhaulers homeroom."),0
var n=2*i.getDistanseBetween(o.pos,e.pos)*4
return Math.ceil(1.2*n/100)},r.getTiersRequiredForOutpostDistanceMining=function(e,r,o,t,n,a){var i=r/300/2,s=n*t,l=Math.min(i,s)
e===o.pos&&console.log("Should never happend")
var m=25/(25+2*a)
return Math.ceil(l/m)},r.getNumberOfPossibleMiningPositions=t,r.getAllMinedSources=function(e){for(var r=[],o=0;o<e.length;o++)r=r.concat(n(e[o]))
return r},r.getAllSourcesInRoom=n,r.getSourcesNeedingHauling=function(e){var r=[],o=!0,t=!1,i=void 0
try{for(var s,m=n(e)[Symbol.iterator]();!(o=(s=m.next()).done);o=!0){var u=s.value,y=u.getMiningContainer()
if(y instanceof StructureContainer){var v=1400-16*a(e,u)
y.store[RESOURCE_ENERGY]>Math.max(v,100)&&r.push(u)}}}catch(e){t=!0,i=e}finally{try{!o&&m.return&&m.return()}finally{if(t)throw i}}var c=l.getBasicOutposts(e),d=!0,f=!1,g=void 0
try{for(var R,p=c[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(void 0!==Game.rooms[h]){var E=!0,S=!1,T=void 0
try{for(var C,O=n(Game.rooms[h])[Symbol.iterator]();!(E=(C=O.next()).done);E=!0){var M=C.value,b=M.getMiningContainer()
if(b instanceof StructureContainer){var w=1400-16*a(e,M)
b.store[RESOURCE_ENERGY]>Math.max(w,100)&&r.push(M)}}}catch(e){S=!0,T=e}finally{try{!E&&O.return&&O.return()}finally{if(S)throw T}}}}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}var N=l.getLairOutposts(e),A=!0,U=!1,k=void 0
try{for(var I,L=N[Symbol.iterator]();!(A=(I=L.next()).done);A=!0){var P=I.value
if(void 0!==Game.rooms[P]){var x=!0,G=!1,B=void 0
try{for(var D,H=n(Game.rooms[P])[Symbol.iterator]();!(x=(D=H.next()).done);x=!0){var W=D.value,Y=W.getMiningContainer()
if(Y instanceof StructureContainer){var F=1400-28*a(e,W)
Y.store[RESOURCE_ENERGY]>Math.max(F,100)&&r.push(W)}}}catch(e){G=!0,B=e}finally{try{!x&&H.return&&H.return()}finally{if(G)throw B}}}}}catch(e){U=!0,k=e}finally{try{!A&&L.return&&L.return()}finally{if(U)throw k}}return _.shuffle(_.map(r,function(e){return e.id}))}},function(e,r,o){function t(e){var r=Game.getObjectById(e.memory.target)
r instanceof Mineral&&(e.memory.mineralType=r.mineralType)}function n(e){var r=Game.getObjectById(e.memory.target)
if(r instanceof Mineral){var o=r.getMiningContainer()
o instanceof StructureContainer&&(e.memory.container=o.id)}}var a=o(33)
r.run=function(e){if(void 0===e.memory.targetRoom){var r=Game.getObjectById(e.memory.target)
null!==r&&(e.memory.targetRoom=r.room.name)}if(!a.stayAwayFromSourceKeeper(e,20,6)){if(Game.time%2==0){var o=Game.getObjectById(e.memory.target)
if(!(o instanceof Mineral))return void a.moveOffRoad(e)
e.pos.getRangeTo(o.pos)>1&&e.moveTo(o)}if(Game.time%6==0){var i=Game.getObjectById(e.memory.target)
if(!(i instanceof Mineral))return void a.moveOffRoad(e)
i instanceof Mineral&&(0===i.mineralAmount||void 0===i.mineralAmount)&&(console.log("<a href='#!/room/"+e.room.name+"'>"+e.room.name+"</a> MineralMiner seems to be finished mining in room "+e.room.name),e.suicide()),e.carryCapacity>_.sum(e.carry)&&e.harvest(i)===OK&&(void 0===Memory.stats["mineralmined."+i.mineralType]&&(Memory.stats["mineralmined."+i.mineralType]=0),Memory.stats["mineralmined."+i.mineralType]+=e.getActiveBodyparts(WORK))}if(Game.time%6==1||e.ticksToLive<3){if(void 0===e.memory.container&&(n(e),void 0===e.memory.container))return
if(void 0===e.memory.mineralType&&(t(e),void 0===e.memory.mineralType))return
var s=Game.getObjectById(e.memory.container)
if(null===s)return void(e.memory.container=void 0)
e.pos.getRangeTo(s)>0&&e.moveTo(s),e.transfer(s,e.memory.mineralType)}}}},function(e,r,o){function t(e){var r=Game.getObjectById(e.memory.targetMineral).getMiningContainer()
return null!==r&&(e.memory.container=r.id,!0)}function n(e){var r=Game.rooms[e.memory.homeroom]
void 0===r.storage?void 0===r.terminal?(e.memory.dropof="",console.log("MineralHauler without a dropof: "+e.name+" - "+e.room.name)):e.memory.dropof=r.terminal.id:e.memory.dropof=r.storage.id}function a(e){e.memory.targetRoom=e.memory.target.split("-")[0]}function i(e){e.memory.targetMineral=e.memory.target.split("-")[1]}function s(e){if(void 0===e.memory.outdatedTick){var r=Game.rooms[e.memory.homeroom].storage,o=Game.getObjectById(e.memory.container)
if(void 0===r){var t=e.room.getSpawn()
if(void 0===t)return
r=t}if(void 0!==r.pos&&null!==o&&void 0!==o.pos){var n=u.getDistanseBetween(r.pos,o.pos)
e.memory.outdatedTick=Math.ceil(2*n*1.2)}}}function l(e){return void 0!==e.memory.outdatedTick&&(e.memory.outdatedTick>e.ticksToLive&&(e.suicide(),!0))}var m=o(33),u=o(3)
r.run=function(e){if(!(m.moveHomeAndHealIfHurt(e)||(void 0===e.memory.targetRoom&&a(e),void 0===e.memory.targetMineral&&i(e),void 0===e.memory.dropof&&n(e),e.isTanking()||0!==_.sum(e.carry)||(e.startTanking(),l(e)),e.isTanking()&&_.sum(e.carry)===e.carryCapacity&&(e.stopTanking(),s(e),n(e)),e.isTanking()&&m.targetRoomHasInvaders(e,e.memory.targetRoom)||m.stayAwayFromSourceKeeper(e))))if(e.isTanking()){var r=Game.getObjectById(e.memory.container),o=Game.getObjectById(e.memory.targetMineral)
if(null===o)return
if(null===r){if(e.room.name!==e.memory.targetRoom)return void e.travelTo(o)
if(!t(e))return}var u=o.mineralType
if(null==r)return
r.store[RESOURCE_ENERGY]>0&&(u=RESOURCE_ENERGY)
var y=e.withdraw(r,u)
y===ERR_NOT_IN_RANGE||y===ERR_NOT_OWNER?e.travelTo(r):y===ERR_NOT_ENOUGH_RESOURCES&&u!==RESOURCE_ENERGY&&e.stopTanking()}else{var v=Game.getObjectById(e.memory.dropof)
v instanceof Structure||n(e)
var c=Object.keys(e.carry)
if(1===c.length&&0===e.carry[RESOURCE_ENERGY])return
var d=c[1]
e.carry[RESOURCE_ENERGY]>0&&(d=RESOURCE_ENERGY)
var f=e.transfer(v,d)
if(f===ERR_NOT_IN_RANGE||f===ERR_NOT_OWNER)e.travelTo(v)
else if(f===ERR_FULL)n(e)
else if(f===OK){var g=Game.getObjectById(e.memory.container)
g instanceof StructureContainer?e.travelTo(g):e.travelToRoom(e.memory.targetRoom)}}}},function(e,r,o){function t(e){if(void 0!==e.controller&&void 0===e.controller.safeModeCooldown){var r=O.getBasePosition(e)
if(void 0===r)return
var o=e.getHostileCreeps(),t=new RoomPosition(r.x,r.y+2,r.roomName),n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0)s.value.pos.getRangeTo(t)<4&&(e.controller.activateSafeMode(),Game.notify("Room "+e.name+" was set in safe mode because enemies are inside the base. "),console.log("<span style='color:#FF7A7A'><a href='#!/room/"+e.name+"'>"+e.name+"</a> The room was set in safe mode because enemies are inside the base. "))}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}}}function n(e){return e.body.length>20&&(e.getActiveBodyparts(ATTACK)>10||e.getActiveBodyparts(RANGED_ATTACK)>10||e.getActiveBodyparts(HEAL)>10)}function a(e){return e.pos.x>2&&e.pos.x<47&&e.pos.y>2&&e.pos.y<47}function i(e,r){(void 0===e.memory.defcon||e.memory.defcon<r)&&(Game.notify("Room "+e.name+" has raised DefCon level to "+r+"."),console.log("<span style='color:#FF7A7A'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Warning: Defcon raised to level "+r+"</span>"),e.memory.defcon=r,e.memory.defconset=Game.time)}function s(e){if(e.isUnderSiege()){var r=y(e,!0)
if(null!==r){var o=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0)v(i.value,r)}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return}var l=Game.getObjectById(e.memory.priTarget)
if(null!==l&&(e.memory.priTarget=void 0),null!==l){var f=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),g=!0,R=!1,p=void 0
try{for(var h,E=f[Symbol.iterator]();!(g=(h=E.next()).done);g=!0)u(h.value,l)}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}return}var S=m(e)
if(null!==S){var T=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),C=!0,M=!1,_=void 0
try{for(var b,N=T[Symbol.iterator]();!(C=(b=N.next()).done);C=!0){var A=b.value;(A.pos.getRangeTo(S)<10||A.energy>A.energyCapacity/2)&&u(A,S)}}catch(e){M=!0,_=e}finally{try{!C&&N.return&&N.return()}finally{if(M)throw _}}return}var U=y(e)
if(null!==U){var k=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),I=!0,L=!1,P=void 0
try{for(var x,G=k[Symbol.iterator]();!(I=(x=G.next()).done);I=!0)v(x.value,U)}catch(e){L=!0,P=e}finally{try{!I&&G.return&&G.return()}finally{if(L)throw P}}return}if(void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>2e4){var B=c(e)
if(null!==B&&O.getRoomLevel(e)>=w.RoomLevel.CivilizedColony){var D=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),H=!0,W=!1,Y=void 0
try{for(var F,K=D[Symbol.iterator]();!(H=(F=K.next()).done);H=!0)d(F.value,B)}catch(e){W=!0,Y=e}finally{try{!H&&K.return&&K.return()}finally{if(W)throw Y}}return}}}else if(void 0===e.memory.towerSleep||Game.time>=e.memory.towerSleep){var V=m(e)
if(null!==V){var j=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),X=!0,Z=!1,z=void 0
try{for(var q,J=j[Symbol.iterator]();!(X=(q=J.next()).done);X=!0)u(q.value,V)}catch(e){Z=!0,z=e}finally{try{!X&&J.return&&J.return()}finally{if(Z)throw z}}return}var Q=y(e)
if(null!==Q){var $=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),ee=!0,re=!1,oe=void 0
try{for(var te,ne=$[Symbol.iterator]();!(ee=(te=ne.next()).done);ee=!0)v(te.value,Q)}catch(e){re=!0,oe=e}finally{try{!ee&&ne.return&&ne.return()}finally{if(re)throw oe}}return}if(void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>2e4){var ae=c(e)
if(null!==ae&&O.getRoomLevel(e)>=w.RoomLevel.CivilizedColony){var ie=e.find(FIND_MY_STRUCTURES,{filter:{structureType:STRUCTURE_TOWER}}),se=!0,le=!1,me=void 0
try{for(var ue,ye=ie[Symbol.iterator]();!(se=(ue=ye.next()).done);se=!0)d(ue.value,ae)}catch(e){le=!0,me=e}finally{try{!se&&ye.return&&ye.return()}finally{if(le)throw me}}return}}e.memory.towerSleep=Game.time+10}}function l(e){var r=g.findHostileCreepsInRoom(e),o=new T.Threat,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value,m=0,u=0,y=0,v=0,c=0,d=!0,f=!1,R=void 0
try{for(var p,h=l.body[Symbol.iterator]();!(d=(p=h.next()).done);d=!0){var E=p.value
E.type===TOUGH?void 0===E.boost?o.toughThreat+=1:E.boost===RESOURCE_CATALYZED_GHODIUM_ALKALIDE?(o.toughThreat+=5,m+=3):E.boost===RESOURCE_GHODIUM_ALKALIDE?(o.toughThreat+=3,m+=1):E.boost===RESOURCE_GHODIUM_OXIDE&&(o.toughThreat+=2):E.type===RANGED_ATTACK?void 0===E.boost?o.rangedThreat+=1:E.boost===RESOURCE_CATALYZED_KEANIUM_ALKALIDE?(o.rangedThreat+=5,u+=3):E.boost===RESOURCE_KEANIUM_ALKALIDE?(o.rangedThreat+=3,u+=1):E.boost===RESOURCE_KEANIUM_OXIDE&&(o.rangedThreat+=2):E.type===HEAL&&void 0!==E.boost?void 0===E.boost?o.healThreat+=1:E.boost===RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE?(o.healThreat+=5,v+=3):E.boost===RESOURCE_LEMERGIUM_ALKALIDE?(o.healThreat+=3,v+=1):E.boost===RESOURCE_LEMERGIUM_OXIDE&&(o.healThreat+=2):E.type===ATTACK&&void 0!==E.boost?void 0===E.boost?o.attackThreat+=1:E.boost===RESOURCE_CATALYZED_UTRIUM_ACID?(o.attackThreat+=5,c+=3):E.boost===RESOURCE_UTRIUM_ACID?(o.attackThreat+=3,c+=1):E.boost===RESOURCE_UTRIUM_HYDRIDE&&(o.attackThreat+=2):E.type===WORK&&void 0!==E.boost&&(void 0===E.boost?o.workThreat+=1:E.boost===RESOURCE_CATALYZED_ZYNTHIUM_ACID?(o.workThreat+=5,y+=3):E.boost===RESOURCE_ZYNTHIUM_ACID?(o.workThreat+=3,y+=1):E.boost===RESOURCE_ZYNTHIUM_HYDRIDE&&(o.workThreat+=2))}}catch(e){f=!0,R=e}finally{try{!d&&h.return&&h.return()}finally{if(f)throw R}}o.boostedTough=Math.max(m,o.boostedTough),o.boostedRanged=Math.max(u,o.boostedRanged),o.boostedWork=Math.max(y,o.boostedWork),o.boostedHeal=Math.max(v,o.boostedHeal),o.boostedAttack=Math.max(c,o.boostedAttack)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}e.memory.threat=o}function m(e){if(void 0!==e.memory.attack){var r=Game.getObjectById(e.memory.attack)
if(r instanceof Creep)return r
e.memory.attack=void 0}var o=e.getHostileCreepsNotAtBorder()
return o.length>0?void 0===e.storage?o[0]:e.storage.pos.findClosestByRange(o):null}function u(e,r){return e.energy>=10&&(e.attack(r),!0)}function y(e){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1]){var r=e.find(FIND_MY_CREEPS,{filter:function(e){return e.hits<e.hitsMax-400}})
return r.length>0?r[0]:null}var o=e.find(FIND_MY_CREEPS,{filter:function(e){return e.hits<e.hitsMax}})
return o.length>0?o[0]:null}function v(e,r){return e.energy>=10&&(e.heal(r),!0)}function c(e){var r=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_RAMPART&&e.hits<1e3||e.structureType===STRUCTURE_WALL&&e.hits<100}})
return r.length>0?r[0]:null}function d(e,r){return e.energy>=10&&(e.repair(r),!0)}var f=o(14),g=o(55),R=o(73),p=o(74),h=o(75),E=o(76),S=o(19),T=o(77),C=o(18),O=o(10),M=o(20),_=o(16),b=o(17),w=o(11),N=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"DefenseManager"))
return t.MEMORY_LASTRUN_SIEGE="lastRunSiege",t.roomService=e,t.creepService=o,t}return _inherits(r,f.Manager),_createClass(r,[{key:"run",value:function(e){if(e===f.ManagerPriority.Critical){this.creepService.runCreeps(_.Role.BaseRanger,E.run),this.creepService.runCreeps(_.Role.RampartDefender,h.run)
var r=this.roomService.getNormalRoomsNotAbandoned(),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var l=a.value
this.setDefConLevel(l),s(l)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var m=this.roomService.getPraiseRooms(),u=!0,y=!1,v=void 0
try{for(var c,d=m[Symbol.iterator]();!(u=(c=d.next()).done);u=!0)s(c.value)}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}else if(e===f.ManagerPriority.Standard){this.creepService.runCreeps(_.Role.SKGuard,R.run),this.creepService.runCreeps(_.Role.SKHealer,p.run)
var g=this.getValue(this.MEMORY_LASTRUN_SIEGE)
if(void 0===g||g+50<Game.time){var S=this.roomService.getNormalUnderSiege(),T=!0,C=!1,O=void 0
try{for(var M,b=S[Symbol.iterator]();!(T=(M=b.next()).done);T=!0){var w=M.value
this.orderRangersFromNeighbours(w)}}catch(e){C=!0,O=e}finally{try{!T&&b.return&&b.return()}finally{if(C)throw O}}this.setValue(this.MEMORY_LASTRUN_SIEGE,Game.time)}}}},{key:"orderRangersFromNeighbours",value:function(e){if(!(e.memory.defcon<2)){var r=this.roomService.getNormalRooms(),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.name!==e.name&&!s.isUnderSiege()&&void 0!==s.storage&&s.storage.store[RESOURCE_ENERGY]>3e4&&Game.map.getRoomLinearDistance(e.name,s.name)<6)return this.orderRangerForSiegedRoom(s,e),void this.orderPaladinForSiegedRoom(s,e)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}}},{key:"orderRangerForSiegedRoom",value:function(e,r){var o=C.getCreepsInQueue(e,_.Role.Ranger,r.name)
if(!(o+this.creepService.getCreeps(_.Role.Ranger,r.name,null).length>=1||o>0)){var t=S.getMaxTierRanger(e.energyCapacityAvailable),n=new M.Order
n.body=S.getRangerBody(t),n.priority=b.Priority.Important,n.memory={role:_.Role.Ranger,target:r.name,tier:t},C.orderCreep(e,n)}}},{key:"orderPaladinForSiegedRoom",value:function(e,r){var o=C.getCreepsInQueue(e,_.Role.Paladin,r.name)
if(!(o+this.creepService.getCreeps(_.Role.Paladin,r.name,null).length>=1||o>0)){var t=S.getMaxTierPaladin(e.energyCapacityAvailable),n=new M.Order
n.body=S.getPaladinBody(t),n.priority=b.Priority.Important,n.memory={role:_.Role.Paladin,target:r.name,tier:t},C.orderCreep(e,n)}}},{key:"setDefConLevel",value:function(e){if(void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<3e4)e.memory.defcon=void 0
else{var r=e.memory.defcon
if((Game.time+O.getIndex(e))%5==0||void 0!==r){var o=g.findHostileCreepsInRoom(e)
if(0===o.length&&e.memory.defconset+200<Game.time)e.memory.defcon=void 0,e.memory.threat=void 0,void 0!==r&&console.log("<span style='color:green'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Enemies seems to have disappeared: Defcon level for the room removed</span>")
else if(o.length>0){var s=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(s=(y=v.next()).done);s=!0){var c=y.value
"Invader"!==c.owner.username&&c.body.length>1&&(r<3&&a(c)?i(e,3):r<2&&n(c)?i(e,2):void 0==r&&i(e,1))}}catch(e){m=!0,u=e}finally{try{!s&&v.return&&v.return()}finally{if(m)throw u}}}void 0!==e.memory.defcon&&(void 0===e.memory.threat||void 0!==e.memory.threat.tick&&e.memory.threat.tick+10<Game.time)&&(l(e),t(e),this.runDefcon(e,e.memory.defcon))}}}},{key:"runDefcon",value:function(e,r){var o=e.memory.threat
if(void 0!==o){if(1===r&&void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>5e4)this.orderBaseRanger(e,1)
else if(2===r){this.orderRampartDefender(e,1)
var t=Math.min(3,Math.ceil(o.healThreat/40))
if(this.orderBaseRanger(e,t),void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<5e4)return}else if(3===r){this.orderRampartDefender(e,2)
var n=Math.min(3,Math.ceil(o.healThreat/25))
if(this.orderBaseRanger(e,n),void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<5e4)return
this.orderProtector(e)}}else console.log("Somehow running defcon ordering without having a threat? Room "+e.name+" - DefCon "+r)}},{key:"orderBaseRanger",value:function(e,r){var o=C.getCreepsInQueue(e,_.Role.BaseRanger,e.name)
if(!(o+this.creepService.getCreeps(_.Role.BaseRanger,e.name).length>=r||o>0)){var t=S.getMaxTierBaseRanger(e.energyCapacityAvailable),n=new M.Order
n.body=S.getBaseRangerBody(t),n.priority=b.Priority.Critical,n.memory={role:_.Role.BaseRanger,target:e.name,tier:t},C.orderCreep(e,n)}}},{key:"orderRampartDefender",value:function(e,r){var o=C.getCreepsInQueue(e,_.Role.RampartDefender,e.name)
if(!(o+this.creepService.getCreeps(_.Role.RampartDefender,e.name).length>=r||o>0)){var t=S.getMaxTierRogue(e.energyCapacityAvailable),n=new M.Order
n.body=S.getRogueBody(t),n.priority=b.Priority.Critical,n.memory={role:_.Role.RampartDefender,target:e.name,tier:t},C.orderCreep(e,n)}}},{key:"orderProtector",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
if(!(C.getCreepsInQueue(e,_.Role.Protector,e.name)+this.creepService.getCreeps(_.Role.Protector,e.name).length>=1)){var o=void 0
r&&(o=[RESOURCE_CATALYZED_LEMERGIUM_ACID])
var t=S.getMaxTierProtector(e.energyCapacityAvailable),n=new M.Order
n.body=S.getProtectorBody(t),n.priority=b.Priority.Standard,n.memory={role:_.Role.Protector,target:e.name,tier:t,boost:o},C.orderCreep(e,n)}}}]),r}()
r.DefenseManager=N},function(e,r,o){function t(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
for(var o=new PathFinder.CostMatrix,t=0;t<50;t++)o.set(t,0,20),o.set(t,49,20),t>0&&t<49&&(o.set(0,t,20),o.set(49,t,20))
return r.find(FIND_CREEPS).forEach(function(e){o.set(e.pos.x,e.pos.y,255)}),o}function n(e){if(l.hasInvaders(e.room.name)){var r=e.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{filter:function(e){return"Invader"===e.owner.username}})
if(r instanceof Creep)return e.memory.targetKeeper=r.id,e.memory.targetPos=r.pos,r}var o=e.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
return o instanceof Creep?(e.memory.targetKeeper=o.id,e.memory.targetPos=o.pos,o):(e.memory.targetKeeper=void 0,null)}function a(e){var r=e.room.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR&&void 0!==e.ticksToSpawn&&e.ticksToSpawn>0}})
if(void 0===r||0===r.length)return e.memory.targetPos=void 0,e.memory.targetLair=void 0,null
var o=r[0],t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
void 0!==o.ticksToSpawn&&void 0!==l.ticksToSpawn&&l.ticksToSpawn<o.ticksToSpawn&&(o=l)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return e.memory.targetPos=o.pos,e.memory.targetLair=o.id,o}var i=o(33),s=o(45),l=o(5)
r.run=function(e){var r=e.memory.target,o=void 0
void 0!==e.memory.targetPos&&void 0!==e.memory.targetPos.x&&(o=new RoomPosition(e.memory.targetPos.x,e.memory.targetPos.y,e.memory.targetPos.roomName))
var l=Game.getObjectById(e.memory.targetKeeper),m=Game.getObjectById(e.memory.healer),u=Game.getObjectById(e.memory.targetLair)
if(void 0!==r){if(null===m)return e.getHomeroom()!==e.room.name?(e.ticksToLive>200&&console.log(e.room.name+": SKGuard missing SKHealer, removing unit: "+e.name+" ticksLeft: "+e.ticksToLive),void e.suicide()):void i.moveOffRoad(e)
if(!e.pos.inRangeTo(m.pos,1)&&e.pos.x>1&&e.pos.x<48&&e.pos.y>1&&e.pos.y<48)Game.time%3==0&&e.moveTo(m)
else if(r===e.room.name){if(null!==l&&Game.time%5!=0||(l=n(e)),null!==l){var y=e.pos.getRangeTo(l)
return y<4&&(e.pos.findInRange(FIND_HOSTILE_CREEPS,3).length>1?e.rangedMassAttack():e.rangedAttack(l)),void(y>1&&0===m.fatigue?(e.moveTo(l.pos,{costCallback:t}),1===e.pos.getRangeTo(m)&&m.moveTo(e)):(e.attack(l),0===m.fatigue&&(e.moveTo(l.pos,{ignoreCreeps:!0,costCallback:t}),1===e.pos.getRangeTo(m)&&m.moveTo(e,{ignoreCreeps:!0}))))}(null===u||null!==u&&(void 0===u.ticksToSpawn||u.ticksToSpawn>200))&&(u=a(e)),null!==u&&e.pos.getRangeTo(u)>1&&0===m.fatigue&&(e.travelTo(u,{allowSK:!0,ignoreCreeps:!1}),1===e.pos.getRangeTo(m)&&m.moveTo(e,{ignoreCreeps:!0})),null===u&&0===m.fatigue&&(e.room.name!==r||s.positionIsBorderOrNextToBorder(e.pos))&&(e.travelTo({pos:new RoomPosition(25,25,r)},{allowSK:!0,ignoreCreeps:!1}),1===e.pos.getRangeTo(m)&&m.moveTo(e,{ignoreCreeps:!0}))}else{if(m.fatigue>0)return
void 0!==o?(e.travelTo({pos:o},{allowSK:!0,ignoreRoads:!0}),1===e.pos.getRangeTo(m)&&m.moveTo(e,{ignoreCreeps:!0})):(e.travelToRoom(r,{allowSK:!0}),1===e.pos.getRangeTo(m)&&m.moveTo(e,{ignoreCreeps:!0}))}}else console.log("SKGuard "+e.name+" has no target room.")}},function(e,r,o){function t(e,r){r.hits<r.hitsMax&&e.heal(r)}function n(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(r){return r.memory.role===a.Role.SKGuard&&void 0===r.memory.healer&&r.memory.token===e.memory.token}})
return r.length>0?(e.memory.targetToHeal=r[0].id,r[0].memory.healer=e.id,r[0]):null}var a=o(16),i=o(33)
r.run=function(e){var r=Game.getObjectById(e.memory.targetToHeal)
return null===r&&null===(r=n(e))?e.getHomeroom()!==e.room.name?(e.ticksToLive>200&&console.log(e.room.name+": SKHealer missing SKGuard, removing unit: "+e.name+" ticksLeft: "+e.ticksToLive),void e.suicide()):(t(e,e),void i.moveOffRoad(e)):e.pos.getRangeTo(r.pos)>1?(e.moveTo(r),void t(e,e)):void(e.hits<1e3?t(e,e):e.hitsMax-e.hits>=r.hitsMax-r.hits?t(e,e):t(e,r))}},function(e,r,o){function t(e){var r=f.findHostileCreepsInRoom(e.room),o=!0,t=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var m=i.value,u=l(m)
if(void 0!==u)return e.memory.targetEnemy=m.id,e.memory.rampart=u.id,e.setState(v.MovingToPosition),void n(e)}}catch(e){t=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw a}}if(r.length>0){var y=f.getPrioritizedTarget(e)
if(null!==y){var g=e.pos.getRangeTo(y.pos)
return d.positionIsBorder(y.pos)||(g>1?e.moveTo(y,{maxRooms:1}):e.moveTo(y,{ignoreCreeps:!0,maxRooms:1})),void(1===g&&e.attack(y))}}c.moveOffRoad(e)}function n(e){var r=Game.getObjectById(e.memory.rampart),o=Game.getObjectById(e.memory.targetEnemy)
if(null===r||null===o||r.pos.getRangeTo(o)>1)return e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(v.Waiting)
if(1===r.pos.getRangeTo(e)){var t=s(r.pos)
void 0!==t&&t.moveTo(e.pos),e.moveTo(r)}else r.pos.getRangeTo(e)>0?e.moveTo(r):(e.setState(v.Attacking),a(e))}function a(e){var r=Game.getObjectById(e.memory.rampart),o=Game.getObjectById(e.memory.targetEnemy)
if(null===r||null===o)return e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(v.Waiting)
if(r.pos.getRangeTo(o)>1){if(null===(o=m(r.pos)))return e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(v.Waiting)
e.memory.targetEnemy=o.id}e.room.memory.priTarget=o.id,e.attack(o)}function i(e){var r=e.room.memory.threat
if(void 0!==r){var o=u(r)
2===o&&y(e.room,30,RESOURCE_CATALYZED_UTRIUM_ACID)?e.memory.boost=[RESOURCE_CATALYZED_UTRIUM_ACID]:o>0&&y(e.room,30,RESOURCE_UTRIUM_HYDRIDE)&&(e.memory.boost=[RESOURCE_UTRIUM_HYDRIDE])}}function s(e){var r=e.lookFor(LOOK_CREEPS)
if(r.length>0)return r[0]}function l(e){var r=!0,o=!1,t=void 0
try{for(var n,a=_.range(e.pos.x-1,e.pos.x+2)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=!0,l=!1,m=void 0
try{for(var u,y=_.range(e.pos.y-1,e.pos.y+2)[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
if(i>0&&i<49&&v>0&&v<49){var c=new RoomPosition(i,v,e.pos.roomName).lookFor(LOOK_STRUCTURES),d=!0,f=!1,g=void 0
try{for(var R,p=c[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(h.structureType===STRUCTURE_RAMPART)return h}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}function m(e){var r=!0,o=!1,t=void 0
try{for(var n,a=_.range(e.x-1,e.x+2)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=!0,l=!1,m=void 0
try{for(var u,y=_.range(e.y-1,e.y+2)[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
if(i>0&&i<49&&v>0&&v<49){var c=new RoomPosition(i,v,e.roomName).lookFor(LOOK_CREEPS),d=!0,f=!1,g=void 0
try{for(var R,p=c[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(!h.my)return h}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return null}function u(e){return e.boostedTough<15?0:e.boostedHeal<15?0:e.boostedAttack<15&&e.boostedWork<15?0:e.boostedTough<40?1:e.boostedHeal<40?1:e.boostedAttack<40&&e.boostedWork<40?1:2}function y(e,r,o){return void 0!==e.terminal&&void 0!==e.terminal.store[o]&&e.terminal.store[o]>30*r}var v,c=o(33),d=o(45),f=o(55),g=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToPosition=2]="MovingToPosition",e[e.Attacking=3]="Attacking"}(v||(v={})),r.run=function(e){switch(e.hasState()||e.setState(v.Waiting),1498===e.ticksToLive&&i(e),e.getState()){case v.Waiting:t(e)
break
case v.MovingToPosition:n(e)
break
case v.Attacking:a(e)
break
default:g.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(v.Waiting)}}},function(e,r,o){function t(e){var r=f.findHostileCreepsInRoom(e.room),o=!0,t=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value,m=y(l)
if(void 0!==m)return e.memory.targetEnemy=l.id,e.memory.rampart=m.id,e.setState(c.MovingToPosition),void n(e)}}catch(e){t=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw a}}if(r.length>0){var u=f.getPrioritizedTarget(e)
if(null!==u)return void g.kiteAndAttack(e,u)}d.moveOffRoad(e)}function n(e){var r=Game.getObjectById(e.memory.rampart),o=Game.getObjectById(e.memory.targetEnemy)
if(null===r||null===o||r.pos.getRangeTo(o)>3)return e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(c.Waiting)
e.pos.getRangeTo(o)<4?e.rangedAttack(o):s(e),1===r.pos.getRangeTo(e)?(void 0!==u(r.pos)&&(e.memory.rampart=void 0),e.moveTo(r)):r.pos.getRangeTo(e)>0?e.moveTo(r):(e.setState(c.Attacking),a(e))}function a(e){var r=Game.getObjectById(e.memory.rampart),o=Game.getObjectById(e.memory.targetEnemy)
if(null===r||null===o)return e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(c.Waiting)
if(r.pos.getRangeTo(o)>3){if(null===(o=v(r.pos)))return s(e),e.memory.targetEnemy=void 0,e.memory.rampart=void 0,void e.setState(c.Waiting)
e.memory.targetEnemy=o.id}e.rangedAttack(o)}function i(e){var r=e.room.memory.threat
if(void 0!==r){var o=l(r)
2===o&&m(e.room,30,RESOURCE_CATALYZED_KEANIUM_ALKALIDE)?e.memory.boost=[RESOURCE_CATALYZED_KEANIUM_ALKALIDE]:o>0&&m(e.room,30,RESOURCE_KEANIUM_OXIDE)&&(e.memory.boost=[RESOURCE_KEANIUM_OXIDE])}}function s(e){var r=f.findHostileCreepsInRangedRange(e.pos),o=_.filter(r,function(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_RAMPART)return!1}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!0})
o.length>0&&e.rangedAttack(o[0])}function l(e){return e.boostedTough<15?0:e.boostedHeal<15?0:e.boostedAttack<15&&e.boostedWork<15?0:e.boostedTough<40?1:e.boostedHeal<40?1:e.boostedAttack<40&&e.boostedWork<40?1:2}function m(e,r,o){return void 0!==e.terminal&&void 0!==e.terminal.store[o]&&e.terminal.store[o]>30*r}function u(e){var r=e.lookFor(LOOK_CREEPS)
if(r.length>0)return r[0]}function y(e){var r=!0,o=!1,t=void 0
try{for(var n,a=_.range(e.pos.x-3,e.pos.x+4)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=!0,l=!1,m=void 0
try{for(var u,y=_.range(e.pos.y-3,e.pos.y+4)[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
if(i>0&&i<49&&v>0&&v<49){var c=new RoomPosition(i,v,e.pos.roomName)
if(c.getRangeTo(e)>1){var d=c.lookFor(LOOK_STRUCTURES),f=!0,g=!1,R=void 0
try{for(var p,h=d[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
if(E.structureType===STRUCTURE_RAMPART&&0===c.lookFor(LOOK_CREEPS).length)return E}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}}}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}function v(e){var r=!0,o=!1,t=void 0
try{for(var n,a=_.range(e.x-3,e.x+4)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=!0,l=!1,m=void 0
try{for(var u,y=_.range(e.y-3,e.y+4)[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
if(i>0&&i<49&&v>0&&v<49){var c=new RoomPosition(i,v,e.roomName).lookFor(LOOK_CREEPS),d=!0,f=!1,g=void 0
try{for(var R,p=c[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(!h.my)return h}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return null}var c,d=o(33),f=o(55),g=o(54),R=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToPosition=2]="MovingToPosition",e[e.Attacking=3]="Attacking"}(c||(c={})),r.run=function(e){switch(e.hasState()||e.setState(c.Waiting),1498===e.ticksToLive&&i(e),e.getState()){case c.Waiting:t(e)
break
case c.MovingToPosition:n(e)
break
case c.Attacking:a(e)
break
default:R.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(c.Waiting)}}},function(e,r){r.Threat=function e(){_classCallCheck(this,e),this.tick=Game.time,this.count=0,this.attackThreat=0,this.rangedThreat=0,this.toughThreat=0,this.workThreat=0,this.healThreat=0,this.boostedTough=0,this.boostedRanged=0,this.boostedWork=0,this.boostedHeal=0,this.boostedAttack=0}},function(e,r,o){function t(e){if(void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<25e3)return 0
if(b.getRoomLevel(e)<h.RoomLevel.CivilizedColony)return 0
var r=void 0,o=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_RAMPART||e.structureType===STRUCTURE_WALL}}),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;(void 0===r||l.hits<r)&&(r=l.hits)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}if(void 0!==r&&(e.memory.lowestWall=r),void 0!==r&&r<C.desiredWallHitsForRoom(e)){var m=r<C.desiredWallHitsForRoom(e)/3
return m&&e.storage.store[RESOURCE_ENERGY]>25e4?4:m||e.storage.store[RESOURCE_ENERGY]>25e4?2:1}return 0}function n(e){if(void 0===e.storage||e.storage.store[RESOURCE_ENERGY]<25e4)return!1
if(b.getRoomLevel(e)<h.RoomLevel.CivilizedColony)return!1
var r=T.getFortressRamparts(e),o=void 0,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;(void 0===o||l.hits<o)&&(o=l.hits)}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return void 0!==o&&(e.memory.lowestFortress=o),void 0!==o&&o<C.desiredFortressHitsForRoom(e)}function a(e){if(void 0!==e.memory.borderwall)return _.map(JSON.parse(e.memory.borderwall),function(r){return g(r,e.name)})
var r=i(e)
return e.memory.borderwall=JSON.stringify(_.map(r,function(e){return f(e)})),r}function i(e){if(void 0===e.storage)return[]
for(var r=[],o=[1,2,47,48],t=0;t<o.length;t++){var n=o[t],a=!0,i=!1,l=void 0
try{for(var m,u=_.range(1,49)[Symbol.iterator]();!(a=(m=u.next()).done);a=!0){var c=m.value,d=new RoomPosition(n,c,e.name)
s(d)&&r.push(d)}}catch(e){i=!0,l=e}finally{try{!a&&u.return&&u.return()}finally{if(i)throw l}}}for(var f=[1,2,47,48],g=0;g<f.length;g++){var R=f[g],p=!0,h=!1,E=void 0
try{for(var S,T=_.range(3,47)[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value,O=new RoomPosition(C,R,e.name)
s(O)&&r.push(O)}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}}var M=[],b=v(r),w=!0,N=!1,A=void 0
try{for(var U,k=r[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
y(e.storage,I,r,b)&&M.push(I)}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}return M}function s(e){var r=Game.map.getTerrainAt(e)
if("swamp"===r||"plain"===r){var o=e.findClosestByRange(FIND_EXIT)
if(2===e.getRangeTo(o))return!0}return!1}function l(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=Object.keys(e)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value,l=parseInt(s),m=e[l].lookFor(LOOK_STRUCTURES)
if(m.length>0){var u=!0,y=!1,v=void 0
try{for(var c,d=m[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
f.structureType===STRUCTURE_WALL?r[l]=!1:(f.structureType,STRUCTURE_RAMPART,r[l]=!0)}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var g=!0,R=!1,p=void 0
try{for(var h,E=Object.keys(e)[Symbol.iterator]();!(g=(h=E.next()).done);g=!0){var S=h.value,T=parseInt(S)
void 0===r[T]&&(1===e[T].x||48===e[T].x||1===e[T].y||48===e[T].y?r[T]=!1:0===T?r[T]=!0:1===T?r[T]=!1:T===r.length-1?r[T]=!0:e[T].getRangeTo(e[T-1])>1?r[T]=!0:T+1<e.length&&e[T].getRangeTo(e[T+1])>1?r[T]=!0:!1===r[T-2]&&!1===r[T-1]?r[T]=!0:r[T]=!1)}}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}return r}function m(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=_.range(0,e.length)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r.push(e[s]),e[s].x!==e[(s+1)%e.length].x&&e[s].y!==e[(s+1)%e.length].y&&"wall"!==Game.map.getTerrainAt(e[(s+1)%e.length].x,e[s].y,e[s].roomName)&&r.push(new RoomPosition(e[s].x,e[(s+1)%e.length].y,e[s].roomName))}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}function u(e){return"wall"!==Game.map.getTerrainAt(e)}function y(e,r,o,t){var n=PathFinder.search(r,{pos:e.pos,range:1},{plainCost:1,swampCost:1,roomCallback:function(){return t},maxRooms:1}),a=!0,i=!1,s=void 0
try{for(var l,m=n.path[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=!0,v=!1,c=void 0
try{for(var d,f=o[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var g=d.value
if(u.x===g.x&&u.y===g.y)return!1}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return!0}function v(e){var r=new PathFinder.CostMatrix,o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r.set(s.x,s.y,254)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}function c(e,r,o){var t=new PathFinder.CostMatrix,n=!0,a=!1,i=void 0
try{for(var s,l=_.range(0,50)[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value,u=!0,y=!1,v=void 0
try{for(var c,d=_.range(0,50)[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
"wall"===Game.map.getTerrainAt(m,f,e.name)?t.set(m,f,1):m<2||m>47||f<2||f>47?t.set(m,f,255):t.set(m,f,5)}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}var g=r.x-8,R=r.y-9,p=!0,h=!1,E=void 0
try{for(var S,T=_.range(1,16)[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value,O=!0,M=!1,b=void 0
try{for(var w,N=_.range(1,18)[Symbol.iterator]();!(O=(w=N.next()).done);O=!0){var A=w.value
t.set(g+C,R+A,254)}}catch(e){M=!0,b=e}finally{try{!O&&N.return&&N.return()}finally{if(M)throw b}}}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}var U=_.filter(e.find(FIND_MY_STRUCTURES),function(e){return e.structureType!==STRUCTURE_ROAD&&e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART}),k=_.filter(e.find(FIND_MY_STRUCTURES),function(e){return e.structureType===STRUCTURE_ROAD}),I=!0,L=!1,P=void 0
try{for(var x,G=k[Symbol.iterator]();!(I=(x=G.next()).done);I=!0){var B=x.value
t.set(B.pos.x,B.pos.y,10)}}catch(e){L=!0,P=e}finally{try{!I&&G.return&&G.return()}finally{if(L)throw P}}var D=!0,H=!1,W=void 0
try{for(var Y,F=U[Symbol.iterator]();!(D=(Y=F.next()).done);D=!0){var K=Y.value
t.set(K.pos.x,K.pos.y,254)}}catch(e){H=!0,W=e}finally{try{!D&&F.return&&F.return()}finally{if(H)throw W}}if(o){var V=!0,j=!1,X=void 0
try{for(var Z,z=_.range(r.y,50)[Symbol.iterator]();!(V=(Z=z.next()).done);V=!0){var q=Z.value
t.set(r.x,q,255)}}catch(e){j=!0,X=e}finally{try{!V&&z.return&&z.return()}finally{if(j)throw X}}}return t}function d(){var e=Game.flags
for(var r in e)Game.flags[r].remove()}function f(e){return e.x+"-"+e.y}function g(e,r){var o=e.split("-")
return new RoomPosition(+o[0],+o[1],r)}function R(){return Object.keys(Game.constructionSites).length>60}var p=o(14),h=o(11),E=o(79),S=o(81),T=o(80),C=o(82),O=o(19),M=o(18),b=o(10),w=o(20),N=o(16),A=o(17),U=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"WallManager"))
return t.MEMORY_LASTRUN_BORDERWALL="lastRunBorderWall",t.MEMORY_LASTINDEX="lastIndex",t.MEMORY_ROOMINDEX="roomIndex",t.MEMORY_TICKLASTINDEX="tickIndex",t.MEMORY_LASTRUN_BASEBUILDER="lastRunBaseBuilder",t.MEMORY_LASTRUN_PROTECTOR="lastRunProtector",t.roomService=e,t.creepService=o,t}return _inherits(r,p.Manager),_createClass(r,[{key:"run",value:function(e){if(e===p.ManagerPriority.Low){this.creepService.runCreeps(N.Role.Protector,E.run)
var r=this.getValue(this.MEMORY_LASTRUN_BASEBUILDER)
if(void 0===r||r+300<Game.time){var o=this.roomService.getNormalRooms(),a=!0,i=!1,s=void 0
try{for(var l,m=o[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=t(u)
y>0&&this.orderBaseBuilder(u,y)}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}this.setValue(this.MEMORY_LASTRUN_BASEBUILDER,Game.time)}var v=this.getValue(this.MEMORY_LASTRUN_PROTECTOR)
if(void 0===v||v+1e3<Game.time){var c=this.roomService.getNormalRooms(),f=!0,g=!1,R=void 0
try{for(var S,T=c[Symbol.iterator]();!(f=(S=T.next()).done);f=!0){var C=S.value
n(C)&&this.orderProtector(C)}}catch(e){g=!0,R=e}finally{try{!f&&T.return&&T.return()}finally{if(g)throw R}}this.setValue(this.MEMORY_LASTRUN_PROTECTOR,Game.time)}}else if(e===p.ManagerPriority.Trivial){var O=this.getValue(this.MEMORY_LASTRUN_BORDERWALL),M=this.getValue(this.MEMORY_TICKLASTINDEX)
if(void 0===M||M+1e3<Game.time)this.setValue(this.MEMORY_LASTINDEX,b.getLastIndex()),this.setValue(this.MEMORY_TICKLASTINDEX,Game.time)
else if(void 0===O||O+100<Game.time){var _=this.getValue(this.MEMORY_ROOMINDEX)
void 0===_&&(_=1)
var w=b.getRoomForIndex(_)
void 0!==w&&b.getRoomLevel(w)>=h.RoomLevel.CivilizedColony&&void 0!==w.storage&&w.storage.store[RESOURCE_ENERGY]>5e4&&(this.buildBorderWall(w),this.buildControllerWall(w))
var A=this.getValue(this.MEMORY_LASTINDEX)
if(void 0===A)return void console.log("Error with lastIndex in WallManager.")
var U=_+1
U>A&&(U=1),this.setValue(this.MEMORY_ROOMINDEX,U),this.setValue(this.MEMORY_LASTRUN_BORDERWALL,Game.time)}}if(e===p.ManagerPriority.Trivial&&1===Game.time){var k=Game.rooms.E83Ndd9
void 0!==k&&("E83Ndd9"===k.name&&Game.time%20==0&&this.simBorderWall(k),"E82Nff4"===k.name&&Game.time%20==0&&this.simOuterWall(k),Game.time%20==17&&d())}}},{key:"orderBaseBuilder",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1
if(!(M.getCreepsInQueue(e,N.Role.BaseBuilder,e.name)+this.creepService.getCreeps(N.Role.BaseBuilder,e.name).length>=r)){var o=O.getMaxTierConsultant(e.energyCapacityAvailable),t=new w.Order
t.body=O.getConsultantBody(o),t.priority=A.Priority.Trivial,t.memory={role:N.Role.BaseBuilder,target:e.name,tier:o},M.orderCreep(e,t)}}},{key:"orderProtector",value:function(e){if(!(M.getCreepsInQueue(e,N.Role.Protector,e.name)+this.creepService.getCreeps(N.Role.Protector,e.name).length>=1)){var r=O.getMaxTierProtector(e.energyCapacityAvailable),o=new w.Order
o.body=O.getProtectorBody(r),o.priority=A.Priority.Trivial,o.memory={role:N.Role.Protector,target:e.name,tier:r},M.orderCreep(e,o)}}},{key:"buildBorderWall",value:function(e){if(!(R()||e.find(FIND_MY_CONSTRUCTION_SITES).length>0)){var r=a(e),o=l(r),t=!0,n=!1,i=void 0
try{for(var s,m=Object.keys(r)[Symbol.iterator]();!(t=(s=m.next()).done);t=!0){var u=s.value,y=parseInt(u)
o[y]?S.buildIfNotPresent(STRUCTURE_RAMPART,r[y],0,0,!0,!1):S.buildIfNotPresent(STRUCTURE_WALL,r[y],0,0,!0,!1)}}catch(e){n=!0,i=e}finally{try{!t&&m.return&&m.return()}finally{if(n)throw i}}}}},{key:"buildControllerWall",value:function(e){if(!(R()||e.find(FIND_MY_CONSTRUCTION_SITES).length>0||void 0===e.controller))for(var r=e.controller.pos,o=[-1,0,1],t=0;t<o.length;t++)for(var n=o[t],a=[-1,0,1],i=0;i<a.length;i++){var s=a[i]
if(r.x+n>0&&r.x+n<49&&r.y+s>0&&r.y+s<49&&(0!==n||0!==s)){var l=new RoomPosition(r.x+n,r.y+s,r.roomName),m=Game.map.getTerrainAt(l)
"plain"!==m&&"swamp"!==m||S.buildIfNotPresent(STRUCTURE_RAMPART,l,0,0,!0,!1)}}}},{key:"simBorderWall",value:function(e){var r=i(e),o=l(r),t=!0,n=!1,a=void 0
try{for(var s,m=Object.keys(r)[Symbol.iterator]();!(t=(s=m.next()).done);t=!0){var u=s.value,y=parseInt(u)
o[y]?r[y].createFlag(void 0,COLOR_GREEN,COLOR_GREEN):r[y].createFlag(void 0,COLOR_RED,COLOR_RED)}}catch(e){n=!0,a=e}finally{try{!t&&m.return&&m.return()}finally{if(n)throw a}}}},{key:"simOuterWall",value:function(e){console.log("Simulating outer wall for room: "+e.name)
var r=b.getBasePosition(e)
if(void 0!==r){r.y>40&&console.log("Room could not build outer wall because room is too low: "+e.name)
var o=Game.cpu.getUsed(),t=new RoomPosition(r.x+1,r.y+9,r.roomName),n=new RoomPosition(r.x-1,r.y+9,r.roomName)
39===r.y?(t=new RoomPosition(r.x+1,r.y+8,r.roomName),n=new RoomPosition(r.x-1,r.y+8,r.roomName)):40===r.y&&(t=new RoomPosition(r.x+1,r.y+7,r.roomName),n=new RoomPosition(r.x-1,r.y+7,r.roomName))
var a=c(e,r,!0),i=c(e,r,!1),s=PathFinder.search(t,{pos:n,range:1},{roomCallback:function(){return a},maxRooms:1})
if(s.incomplete)console.log("Failed to make outer wall for room: "+e.name)
else{var l=PathFinder.search(s.path[s.path.length-2],s.path[1],{roomCallback:function(){return i},maxRooms:1})
if(l.incomplete)console.log("Failed to make last path for outer wall for room: "+e.name)
else{var y=m(s.path.concat(l.path)),v=[],d=!0,f=!1,g=void 0
try{for(var R,p=y[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
u(h)&&v.push(h)}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}console.log("Cost for borderwallpositions: "+(Game.cpu.getUsed()-o))
var E=!0,S=!1,T=void 0
try{for(var C,O=v[Symbol.iterator]();!(E=(C=O.next()).done);E=!0)C.value.createFlag()}catch(e){S=!0,T=e}finally{try{!E&&O.return&&O.return()}finally{if(S)throw T}}console.log("Cost for borderwallpositions including flagplacement: "+(Game.cpu.getUsed()-o))}}}}}]),r}()
r.WallManager=U,r.outerwallPositionNeeded=u,r.deleteAllFlags=d},function(e,r,o){function t(e){var r=u.getBasePosition(e.room)
if(void 0===r)return console.log("Error with roomposition, Protector do not know where to move: "+e.room.name),void e.disable()
var o=new RoomPosition(r.x,r.y+2,r.roomName)
e.pos.getRangeTo(o)>0?e.moveTo(o):e.setState(s.Fortify)}function n(e){if(void 0===e.room.storage)return console.log("Error with storage, Protector can not tank: "+e.room.name),void e.disable()
e.carry[RESOURCE_ENERGY]<2*e.getActiveBodyparts(WORK)&&e.withdraw(e.room.storage,RESOURCE_ENERGY)
var r=a(e)
null!==r&&e.repair(r)===OK&&(void 0===Memory.stats["room."+e.room.name+".wallsRepaired"]&&(Memory.stats["room."+e.room.name+".wallsRepaired"]=0),Memory.stats["room."+e.room.name+".wallsRepaired"]+=e.getActiveBodyparts(WORK))}function a(e){void 0===e.memory.freq&&(e.memory.freq=Math.floor(50*Math.random())+100)
var r=Game.getObjectById(e.memory.wallid)
return null!==r&&Game.time%e.memory.freq!=0||null!==(r=i(e))&&(e.memory.wallid=r.id),r}function i(e){var r=m.getFortressRamparts(e.room),o=null,t=WALL_HITS_MAX,n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var u=s.value
u.structureType!==STRUCTURE_WALL&&u.structureType!==STRUCTURE_RAMPART||u.hits<t&&(o=u,t=u.hits)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o}var s,l=o(7),m=o(80),u=o(10)
!function(e){e[e.MoveToPosition=1]="MoveToPosition",e[e.Fortify=2]="Fortify"}(s||(s={})),r.run=function(e){switch(e.hasState()||e.setState(s.MoveToPosition),e.getState()){case s.MoveToPosition:t(e)
break
case s.Fortify:n(e)
break
default:l.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(s.MoveToPosition)}}},function(e,r,o){function t(){return[[-3,-1],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],[3,-1],[-3,0],[3,0],[-3,1],[3,1],[-3,2],[3,2],[-3,3],[3,3],[-3,4],[3,4],[-3,5],[-2,5],[-1,5],[0,5],[1,5],[2,5],[3,5]]}function n(){return[[0,0],[-2,1],[-2,2],[2,1],[2,2],[0,3],[1,4]]}var a=o(10)
r.getPossibleExtensionsCount=function(e){if(void 0===e||void 0===e.controller||e.controller.level<2)return 0
switch(e.controller.level){case 2:return 5
case 3:return 10
case 4:return 20
case 5:return 30
case 6:return 40
case 7:return 50
case 8:return 60
default:return 0}},r.getExtensionPositions=function(){return[[-2,-2],[2,-2],[-1,-3],[0,-3],[1,-3],[-3,-2],[3,-2],[-2,-4],[0,-4],[2,-4],[-3,-3],[-4,-3],[-4,-4],[-3,-5],[-2,-5],[3,-3],[4,-3],[4,-4],[3,-5],[2,-5],[-5,-4],[-5,-5],[-5,-6],[-4,-6],[-3,-6],[5,-4],[5,-5],[5,-6],[4,-6],[3,-6],[-1,-5],[-1,-6],[0,-6],[1,-6],[1,-5],[-4,0],[-5,0],[-6,0],[-4,1],[-6,1],[-5,2],[-6,2],[-4,3],[-6,3],[-4,4],[-5,4],[-6,4],[4,0],[5,0],[6,0],[4,1],[6,1],[5,2],[6,2],[4,3],[6,3],[4,4],[5,4],[6,4],[5,-1],[-5,-1],[6,-1],[-6,-1],[7,-2],[-7,-2],[8,-3],[-8,-3],[-5,6],[-6,7],[-5,7],[-4,7],[-5,8],[5,6],[6,7],[5,7],[4,7],[5,8]]},r.getPossibleTowerCount=function(e){if(void 0===e||void 0===e.controller||e.controller.level<3)return 0
switch(e.controller.level){case 3:case 4:return 1
case 5:case 6:return 2
case 7:return 3
case 8:return 6
default:return 0}},r.getTowerPositions=function(){return[[2,1],[-2,1],[3,2],[-3,2],[-3,3],[3,3]]},r.getPossibleSpawnCount=function(e){if(void 0===e||void 0===e.controller||e.controller.level<1)return 0
switch(e.controller.level){case 1:case 2:case 3:case 4:case 5:case 6:return 1
case 7:return 2
case 8:return 3
default:return 0}},r.getPossibleLinkCount=function(e){if(void 0===e||void 0===e.controller||e.controller.level<1)return 0
switch(e.controller.level){case 1:case 2:case 3:case 4:return 0
case 5:return 2
case 6:return 3
case 7:return 4
case 8:return 6
default:return 0}},r.getSpawnPositions=function(){return[[0,0],[1,-1],[-1,-1]]},r.getColonyRoadPositions=function(){return[[0,-1],[0,1],[0,4],[0,-5],[-1,-2],[-1,2],[-2,-3],[-1,-4],[1,-2],[1,2],[2,-3],[1,-4],[-1,0],[1,0],[-1,3],[-1,1],[1,1],[1,3]]},r.getNewColonyRoadPositions=function(){return[[0,-1],[0,1],[0,4],[-1,-2],[-1,2],[1,-2],[1,2],[-1,0],[1,0],[-1,3],[-1,1],[1,1],[1,3]]},r.getNewCityRoadPositions=function(){return[[-2,-1],[2,-1],[0,2],[0,6],[1,5],[2,4]]},r.getCityRoadPositions=function(){return[[0,-1],[0,1],[0,2],[0,4],[0,6],[0,-5],[-1,-2],[-2,-3],[-3,-4],[-4,-5],[-1,-4],[1,-2],[2,-3],[3,-4],[4,-5],[1,-4],[-1,0],[-2,0],[-3,0],[-2,-1],[-2,-1],[-3,-1],[-4,-1],[-4,-2],[-5,-2],[-3,1],[1,0],[2,0],[3,0],[2,-1],[2,-1],[3,-1],[4,-1],[4,-2],[5,-2],[3,1],[-1,1],[-1,2],[-1,3],[-2,3],[-2,4],[-3,4],[-3,5],[1,1],[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[1,5],[4,2],[5,1],[5,3],[-4,2],[-5,1],[-5,3]]},r.getFortressWallPositions=t,r.getShellWallPositions=n,r.getFortressRamparts=function(e){var r=[],o=t().concat(n()),i=a.getBasePosition(e)
if(void 0!==i){var s=!0,l=!1,m=void 0
try{for(var u,y=o[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value,c=new RoomPosition(i.x+v[0],i.y+v[1],i.roomName).lookFor(LOOK_STRUCTURES),d=!0,f=!1,g=void 0
try{for(var R,p=c[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
h.structureType===STRUCTURE_RAMPART&&r.push(h)}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}}return r}},function(e,r,o){var t=o(45)
r.getConstructionPointsInRoom=function(e){var r=e.find(FIND_MY_CONSTRUCTION_SITES)
if(r.length>0)return _.sum(_.map(r,function(e){return e.progressTotal-e.progress}))
var o=e.find(FIND_HOSTILE_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_EXTRACTOR}})
return o.length>0&&void 0!==e.controller&&e.controller.level>5&&e.controller.my?_.sum(_.map(o,function(e){return e.progressTotal-e.progress})):0},r.getBuildingCount=function(e,r){return e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===r}}).length},r.getConstructionSiteCount=function(e,r){return e.find(FIND_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===r}}).length},r.roomHasConstructionSites=function(e){return e.find(FIND_MY_CONSTRUCTION_SITES).length>0},r.buildIfNotPresent=function(e,r,o,n){var a=arguments.length>4&&void 0!==arguments[4]&&arguments[4],i=arguments.length>5&&void 0!==arguments[5]&&arguments[5],s=new RoomPosition(r.x+o,r.y+n,r.roomName)
if(t.positionIsBorder(s))return!1
if(!t.positionHasBuildableGround(s))return!1
var l=s.lookFor(LOOK_STRUCTURES),m=s.lookFor(LOOK_CONSTRUCTION_SITES),u=!0,y=!1,v=void 0
try{for(var c,d=l[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
if(f.structureType!==e){if((i||!a&&f.structureType===STRUCTURE_ROAD)&&f.structureType!==STRUCTURE_RAMPART)f.destroy()
else if(f.structureType!==STRUCTURE_ROAD&&f.structureType!==STRUCTURE_RAMPART&&e!==STRUCTURE_RAMPART)return!1}else if(f.structureType===e)return!1}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}var g=!0,R=!1,p=void 0
try{for(var h,E=m[Symbol.iterator]();!(g=(h=E.next()).done);g=!0){var S=h.value
if(S.structureType!==e){if((i||!a&&S.structureType===STRUCTURE_ROAD)&&S.remove(),S.structureType!==STRUCTURE_ROAD&&S.structureType!==STRUCTURE_RAMPART)return!1}else if(S.structureType===e)return!1}}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}return s.createConstructionSite(e)===OK}},function(e,r,o){var t=o(10),n=o(11)
r.desiredWallHitsForRoom=function(e){var r=t.getRoomLevel(e)
return!0===Memory.settings.lowWalls||!0===e.memory.lowWalls?r>=n.RoomLevel.City?1e5:2e4:r>=n.RoomLevel.Metropolis?1e7:r>=n.RoomLevel.City?1e6:r>=n.RoomLevel.Town?25e4:r>=n.RoomLevel.AdvancedColony?1e5:r>=n.RoomLevel.CivilizedColony?5e4:0},r.desiredFortressHitsForRoom=function(e){var r=t.getRoomLevel(e)
return!0===Memory.settings.lowWalls||!0===e.memory.lowWalls?r>=n.RoomLevel.City?5e5:1e5:r>=n.RoomLevel.Metropolis?void 0!==e.memory.lowestWall&&e.memory.lowestWall>8e6?2e7:1e7:r>=n.RoomLevel.City?5e6:r>=n.RoomLevel.Town?2e6:r>=n.RoomLevel.AdvancedColony?1e5:r>=n.RoomLevel.CivilizedColony?5e5:0}},function(e,r,o){var t=o(14),n=o(84),a=o(85),i=o(7),s=o(16),l=o(88),m=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"BoostManager"))
return t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Critical){var r=this.roomService.getNormalAndNotExpansion(),o=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(o=(s=l.next()).done);o=!0){var m=s.value
n.roomHasCreepThatNeedsBoosting(m)&&this.boostCreepInRoom(m)}}catch(e){a=!0,i=e}finally{try{!o&&l.return&&l.return()}finally{if(a)throw i}}}}},{key:"boostCreepInRoom",value:function(e){var r=n.getCreepThatNeedsBoosting(e)
if(!r)return i.log.error("Could not find boost-target",e.name),void n.removeBoostingFromRoom(e)
if(void 0!==e.terminal){var o=e.getBoostLab()
if(void 0!==o)if(!0!==e.memory.boosting&&o.energy<o.energyCapacity)i.log.error("Waiting with boost until lab has full energy",e.name)
else{var t=this.findBoostHauler(e)
if(void 0!==t)if(n.roomIsCurrentlyBoosting(e))this.runBoosting(e,r,t,o,e.terminal)
else{var a=this.moveHaulerToBoostPosition(t,o),s=this.moveTargetToBoostPosition(r,o)
a&&s&&(e.memory.boosting=!0)}else i.log.alert("Could not find boosthauler",e.name)}else i.log.error("Trying to boost in a room without boostlab",e.name)}else i.log.error("Trying to boost in a room without terminal",e.name)}},{key:"runBoosting",value:function(e,r,o,t,s){if(null!==o){var m=n.getWantedBoosts(r)
if(""===m.type||0===m.count)return n.removeBoostingFromRoom(e),n.enableCreepIfDisabled(o),void n.enableCreepIfDisabled(r)
var u=m.count*LAB_BOOST_MINERAL
switch(e.memory.boostStage){case void 0:case l.BoostStage.ClearLab:if(t.mineralAmount>0){o.withdraw(t,t.mineralType)
break}if(_.sum(o.carry)>0){for(var y in o.carry)o.transfer(o.room.terminal,y)
break}this.setBoostStage(e,l.BoostStage.BuyMinerals)
case l.BoostStage.BuyMinerals:if(!n.doWeHaveMineralsRequired(e,m.type,u)){a.requestMineralsForBoosting(e,m.type,u)
break}this.setBoostStage(e,l.BoostStage.LoadHauler)
case l.BoostStage.LoadHauler:o.withdraw(s,m.type,Math.min(o.carryCapacity,u)),this.setBoostStage(e,l.BoostStage.UnloadHauler)
break
case l.BoostStage.UnloadHauler:o.transfer(t,m.type),this.setBoostStage(e,l.BoostStage.BoostCreep)
break
case l.BoostStage.BoostCreep:t.boostCreep(r),i.log.info("Boosting "+r.name+" with "+m.count+" "+m.type,e.name),this.setBoostStage(e,l.BoostStage.ValidateBoost)
break
case l.BoostStage.ValidateBoost:this.setBoostStage(e,l.BoostStage.ClearLab),n.creepIsBoosted(r,m.type)?n.removeWantedBoostTypeFromCreepMemory(r,m.type):i.log.error("Boosting of "+r.name+" with "+m.type+" failed",e.name)}}else n.removeBoostingFromRoom(e)}},{key:"moveTargetToBoostPosition",value:function(e,r){if(e.spawning)return!1
var o=n.getTargetBoostingPosition(r)
return!!n.boostTargetInPosition(e,o)||(e.moveTo(o),!1)}},{key:"moveHaulerToBoostPosition",value:function(e,r){var o=n.getHaulerBoostingPosition(r)
if(!n.boostHaulerInPosition(e,o))return e.moveTo(o),!1
if(_.sum(e.carry)>0){for(var t in e.carry)e.transfer(e.room.terminal,t)
return!1}return!0}},{key:"findBoostHauler",value:function(e){var r=n.getBoostHauler(e)
if(null!==r)return r
var o=this.creepService.getCreeps(s.Role.BaseHauler,null,e.name)
return o.length>0?(n.setAsBoostHauler(e,o[0]),o[0]):void 0}},{key:"setBoostStage",value:function(e,r){e.memory.boostStage=r}}]),r}()
r.BoostManager=m},function(e,r){function o(e){switch(e){case RESOURCE_CATALYZED_UTRIUM_ACID:return ATTACK
case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:return WORK
case RESOURCE_CATALYZED_KEANIUM_ACID:return CARRY
case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:return RANGED_ATTACK
case RESOURCE_CATALYZED_LEMERGIUM_ACID:return WORK
case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:return HEAL
case RESOURCE_CATALYZED_ZYNTHIUM_ACID:return WORK
case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:return MOVE
case RESOURCE_CATALYZED_GHODIUM_ACID:return WORK
case RESOURCE_CATALYZED_GHODIUM_ALKALIDE:return TOUGH
case RESOURCE_UTRIUM_ACID:return ATTACK
case RESOURCE_UTRIUM_ALKALIDE:return WORK
case RESOURCE_KEANIUM_ACID:return CARRY
case RESOURCE_KEANIUM_ALKALIDE:return RANGED_ATTACK
case RESOURCE_LEMERGIUM_ACID:return WORK
case RESOURCE_LEMERGIUM_ALKALIDE:return HEAL
case RESOURCE_ZYNTHIUM_ACID:return WORK
case RESOURCE_ZYNTHIUM_ALKALIDE:return MOVE
case RESOURCE_GHODIUM_ACID:return WORK
case RESOURCE_GHODIUM_ALKALIDE:return TOUGH
case RESOURCE_UTRIUM_HYDRIDE:return ATTACK
case RESOURCE_UTRIUM_OXIDE:return WORK
case RESOURCE_KEANIUM_HYDRIDE:return CARRY
case RESOURCE_KEANIUM_OXIDE:return RANGED_ATTACK
case RESOURCE_LEMERGIUM_HYDRIDE:return WORK
case RESOURCE_LEMERGIUM_OXIDE:return HEAL
case RESOURCE_ZYNTHIUM_HYDRIDE:return WORK
case RESOURCE_ZYNTHIUM_OXIDE:return MOVE
case RESOURCE_GHODIUM_HYDRIDE:return WORK
case RESOURCE_GHODIUM_OXIDE:return TOUGH
default:return"ERROR"}}r.roomHasCreepThatNeedsBoosting=function(e){return void 0!==e.memory.boostTarget},r.roomIsCurrentlyBoosting=function(e){return e.memory.boosting},r.setRoomIsBoosting=function(e){e.memory.boosting=!0},r.getCreepThatNeedsBoosting=function(e){return Game.getObjectById(e.memory.boostTarget)},r.getBoostHauler=function(e){var r=Game.getObjectById(e.memory.boostHauler)
return null===r&&(e.memory.boostHauler=void 0),r},r.removeBoostingFromRoom=function(e){e.memory.boostTarget=void 0,e.memory.boostStage=void 0,e.memory.boostHauler=void 0,e.memory.boosting=void 0},r.enableCreepIfDisabled=function(e){e instanceof Creep&&e.enable()},r.boostTargetInPosition=function(e,r){return r.x===e.pos.x&&r.y===e.pos.y&&r.roomName===e.pos.roomName},r.boostHaulerInPosition=function(e,r){return r.x===e.pos.x&&r.y===e.pos.y&&r.roomName===e.pos.roomName},r.removeWantedBoostTypeFromCreepMemory=function(e,r){e.memory.boost=_.filter(e.memory.boost,function(e){return e!==r}),0===e.memory.boost.length&&(e.memory.boost=void 0)},r.creepIsBoosted=function(e,r){var t=o(r),n=!0,a=!1,i=void 0
try{for(var s,l=e.body[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.type===t&&m.boost!==r)return!1}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return!0},r.getTargetBoostingPosition=function(e){return new RoomPosition(e.pos.x+1,e.pos.y,e.pos.roomName)},r.getHaulerBoostingPosition=function(e){return new RoomPosition(e.pos.x,e.pos.y-1,e.pos.roomName)},r.setAsBoostHauler=function(e,r){e.memory.boostHauler=r.id,r.disable()},r.getWantedBoosts=function(e){if(void 0===e.memory.boost||0===e.memory.boost.length)return{type:"",count:0}
var r=e.memory.boost[0],t=o(r)
return{type:r,count:e.getActiveBodyparts(t)}},r.doWeHaveMineralsRequired=function(e,r,o){return void 0!==e.terminal&&!(void 0===e.terminal.store[r]||e.terminal.store[r]<o)},r.getBodyPartForBoost=o},function(e,r,o){function t(e){var r=[]
if(void 0!==e.terminal){var o=!0,t=!1,n=void 0
try{for(var a,i=d[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
void 0!==e.terminal.store[s]&&e.terminal.store[s]>v.sendMineralsToOtherRoomsWhenAbove&&r.push(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}return r}function n(e,r){if(void 0!==e.terminal){var o=_.filter(Game.market.orders,function(o){return o.type===ORDER_SELL&&o.resourceType===r&&o.roomName===e.name})
if(Object.keys(o).length>0)for(var t in o){var n=m.getResourcePrice(r)
if(void 0!==n&&((o[t].price>n||o[t].price<n&&0===o[t].remainingAmount)&&(console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Updating price "+r+": "+n+"</span>"),Game.market.changeOrderPrice(o[t].id,n)),o[t].remainingAmount<2e3)){var a=1e4-o[t].remainingAmount
console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Updating sellorder with "+a+" "+r+" for "+n+"</span>"),Game.market.extendOrder(o[t].id,a)}}else{var i=m.getResourcePrice(r)
void 0!==i&&(console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sellorder for 10000 "+r+" for "+i+"</span>"),Game.market.createOrder(ORDER_SELL,r,i,1e4,e.name))}}}function a(e){return void 0!==e.terminal&&!(e.terminal.cooldown>0)}function i(e,r,o){if(a(e)){o+=10
var t=Game.market.getAllOrders(function(e){return e.type===ORDER_SELL&&e.resourceType===r&&e.amount>=o}),n=10,i=void 0,s=!0,l=!1,m=void 0
try{for(var u,y=t[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
n>v.price&&(n=v.price,i=v.id)}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}void 0!==i&&(Game.market.deal(i,o,e.name),console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Buying "+o+" "+r+" for "+n+" because it is needed for boosting.</span>"))}}function s(e){if(!a(e)||void 0===e.terminal||e.terminal.store[RESOURCE_ENERGY]<1e4)return!1
var r=!0,o=!1,t=void 0
try{for(var n,i=d[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=function(){var r=n.value
if(void 0===e.terminal.store[r]||e.terminal.store[r]<2e3){var o=Game.market.getAllOrders(function(e){return e.type===ORDER_SELL&&e.resourceType===r&&e.amount>=1e3}),t=20,a=void 0,i=0,s=!0,l=!1,m=void 0
try{for(var u,y=o[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
t>v.price&&(t=v.price,a=v.id,i=v.amount)}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}if(void 0!==a)return Game.market.deal(a,Math.min(4e3,i),e.name),console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Buying "+Math.min(2e3,i)+" "+r+" for "+t+" because it is a mineral we are missing. ("+a+")</span>"),{v:!0}}}()
if("object"===(void 0===s?"undefined":_typeof(s)))return s.v}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}return!1}function l(e,r,o){if(a(e)&&void 0!==e.terminal&&!(e.terminal.store[RESOURCE_ENERGY]<1e4)){o+=10
var t=Game.market.getAllOrders(function(e){return e.type===ORDER_SELL&&e.resourceType===r&&e.amount>=o}),n=20,i=void 0,s=!0,l=!1,m=void 0
try{for(var u,y=t[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value
n>v.price&&(n=v.price,i=v.id)}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}void 0!==i&&(Game.market.deal(i,o,e.name),console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Buying "+o+" "+r+" for "+n+" because it is needed for labs. ("+i+")</span>"))}}var m=o(86),u=o(35),y=o(10),v=o(87),c=o(11),d=[RESOURCE_HYDROGEN,RESOURCE_OXYGEN,RESOURCE_UTRIUM,RESOURCE_KEANIUM,RESOURCE_LEMERGIUM,RESOURCE_ZYNTHIUM,RESOURCE_CATALYST],f=o(14),g=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"TradeManager"))
return o.hasRunCrisisEnergy=!1,o.hasRunSendEnergyAway=!1,o.hasRunSendEnergyToPraiseroom=!1,o.hasRunSendBoostToPraiseroom=!1,o.hasRunPraiseroomEnergyOrder=!1,o.hasRunLookForGoodDeals=!1,o.hasRunSellEnergy=!1,o.hasRunSellPower=!1,o.hasRunSellPowerGoodDeal=!1,o.hasRunSendPower=!1,o.hasRunSendMinerals=!1,o.hasRunSendBoost=!1,o.hasRunMineralSellorders=!1,o.hasRunMineralToBuyorders=!1,o.hasRunAbandonedRooms=!1,o.MEMORY_NEXTRUN_CRISISENERGY="nextCrisis",o.MEMORY_NEXTRUN_SENDENERGYAWAY="nextEnAway",o.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM="nextPrEnergy",o.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM="nextPrBoost",o.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER="nextPrOrder",o.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS="nextCleanup",o.MEMORY_NEXTRUN_LOOKFORGOODDEALS="nextGoodDeals",o.MEMORY_NEXTRUN_SELLENERGY="nextEnergySale",o.MEMORY_NEXTRUN_SELLPOWER="nextPwSale",o.MEMORY_NEXTRUN_SELLPOWERGOODDEAL="nextPwGoodSale",o.MEMORY_NEXTRUN_SENDPOWER="nextPwDist",o.MEMORY_NEXTRUN_SENDMINERALS="nextMinDist",o.MEMORY_NEXTRUN_SENDBOOST="nextSendBoost",o.MEMORY_NEXTRUN_MINERALSELLORDERS="nextMinSellO",o.MEMORY_NEXTRUN_MINERALTOBUYORDERS="nextMinToBuyO",o.MEMORY_NEXTRUN_ABANDONEDROOMS="nextAbandoned",o.MEMORY_NEXTRUN_PREPARERESPAWN="nextPrepRespawn",o.MEMORY_NEXTRUN_BUYMINERALS="nextBuyMins",o.roomService=e,o}return _inherits(r,f.Manager),_createClass(r,[{key:"run",value:function(e){if(e===f.ManagerPriority.Standard){var r=this.getValue(this.MEMORY_NEXTRUN_CRISISENERGY)
if(void 0===r||r<Game.time){var o=this.getRoomNeedingCrisisEnergy()
return void 0!==o?(this.requestCrisisEnergy(o),this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY,Game.time+12)):this.setValue(this.MEMORY_NEXTRUN_CRISISENERGY,Game.time+200),void(this.hasRunCrisisEnergy=!0)}var i=this.getValue(this.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM)
if(void 0===i||i<Game.time){var l=this.getPraiseroomNeedingEnergy()
return void 0!==l&&this.sendEnergyToPraiseroom(l),this.setValue(this.MEMORY_NEXTRUN_SENDENERGYTOPRAISEROOM,Game.time+50),void(this.hasRunSendEnergyToPraiseroom=!0)}}else if(e===f.ManagerPriority.Low){if(!0===Memory.settings.prepareRespawn){var m=this.getValue(this.MEMORY_NEXTRUN_PREPARERESPAWN)
if(void 0===m||m<Game.time){var u=this.roomService.getNormalRooms(),d=0,g=!0,R=!1,p=void 0
try{for(var h,E=u[Symbol.iterator]();!(g=(h=E.next()).done);g=!0){var S=h.value
this.sellEverything(S)&&d<10&&d++}}catch(e){R=!0,p=e}finally{try{!g&&E.return&&E.return()}finally{if(R)throw p}}return void(0===d?this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN,Game.time+100):this.setValue(this.MEMORY_NEXTRUN_PREPARERESPAWN,Game.time+1))}}var T=this.getValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS)
if(void 0===T||T<Game.time){var C=this.roomService.getRoomsBeingAbandoned()
if(C.length>0){var O=!0,M=!1,b=void 0
try{for(var w,N=C[Symbol.iterator]();!(O=(w=N.next()).done);O=!0){var A=w.value
if(this.sendAwayEverything(A))return this.setValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS,Game.time+12),void(this.hasRunAbandonedRooms=!0)}}catch(e){M=!0,b=e}finally{try{!O&&N.return&&N.return()}finally{if(M)throw b}}}return this.setValue(this.MEMORY_NEXTRUN_ABANDONEDROOMS,Game.time+100),void(this.hasRunAbandonedRooms=!0)}var U=this.getValue(this.MEMORY_NEXTRUN_SENDPOWER)
if(void 0===U||U<Game.time){var k=this.getRoomWantingToDistributePower()
return void 0!==k?(this.sendPowerToOthers(k),this.setValue(this.MEMORY_NEXTRUN_SENDPOWER,Game.time+200)):this.setValue(this.MEMORY_NEXTRUN_SENDPOWER,Game.time+1e3),void(this.hasRunSendPower=!0)}var I=this.getValue(this.MEMORY_NEXTRUN_MINERALSELLORDERS)
if(void 0===I||I<Game.time){var L=v.sendMineralsToSellOrderWhenAbove
!0===Memory.settings.bot&&(L=5e4)
var P=!0,x=!1,G=void 0
try{for(var B,D=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(P=(B=D.next()).done);P=!0){var H=B.value
if(y.getRoomLevel(H)>=c.RoomLevel.Town&&void 0!==H.storage&&void 0!==H.terminal){var W=t(H),Y=!0,F=!1,K=void 0
try{for(var V,j=W[Symbol.iterator]();!(Y=(V=j.next()).done);Y=!0){var X=V.value
H.storage.store[X]>L&&Game.market.credits>1e4&&n(H,X)}}catch(e){F=!0,K=e}finally{try{!Y&&j.return&&j.return()}finally{if(F)throw K}}}}}catch(e){x=!0,G=e}finally{try{!P&&D.return&&D.return()}finally{if(x)throw G}}return this.setValue(this.MEMORY_NEXTRUN_MINERALSELLORDERS,Game.time+200),void(this.hasRunMineralSellorders=!0)}var Z=this.getValue(this.MEMORY_NEXTRUN_SENDMINERALS)
if(void 0===Z||Z<Game.time){var z=!0,q=!1,J=void 0
try{for(var Q,$=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(z=(Q=$.next()).done);z=!0){var ee=Q.value
if(y.getRoomLevel(ee)>=c.RoomLevel.Town&&void 0!==ee.terminal){var re=t(ee),oe=!0,te=!1,ne=void 0
try{for(var ae,ie=re[Symbol.iterator]();!(oe=(ae=ie.next()).done);oe=!0){var se=ae.value
if(ee.terminal.store[se]>v.sendMineralsToOtherRoomsWhenAbove&&this.sendMineralsToOthers(ee,se))return void this.setValue(this.MEMORY_NEXTRUN_SENDMINERALS,Game.time+1)}}catch(e){te=!0,ne=e}finally{try{!oe&&ie.return&&ie.return()}finally{if(te)throw ne}}}}}catch(e){q=!0,J=e}finally{try{!z&&$.return&&$.return()}finally{if(q)throw J}}return this.setValue(this.MEMORY_NEXTRUN_SENDMINERALS,Game.time+100),void(this.hasRunSendMinerals=!0)}var le=this.getValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS)
if(void 0===le||le<Game.time){var me=v.sendMineralsToBuyOrdersWhenAbove
!0===Memory.settings.bot&&(me=7e4)
var ue=!0,ye=!1,ve=void 0
try{for(var ce,de=_.shuffle(this.roomService.getNormalAndNotExpansion())[Symbol.iterator]();!(ue=(ce=de.next()).done);ue=!0){var fe=ce.value
if(y.getRoomLevel(fe)>=c.RoomLevel.Town&&void 0!==fe.terminal&&void 0!==fe.storage){var ge=t(fe),Re=!0,pe=!1,he=void 0
try{for(var Ee,Se=ge[Symbol.iterator]();!(Re=(Ee=Se.next()).done);Re=!0){var Te=Ee.value
if(fe.storage.store[Te]>me&&(_.sum(fe.storage.store)>9e5||!0===Memory.settings.bot)&&this.sellOfResources(fe,Te))return void(!0===Memory.settings.bot?this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS,Game.time+50):this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS,Game.time+10))}}catch(e){pe=!0,he=e}finally{try{!Re&&Se.return&&Se.return()}finally{if(pe)throw he}}}}}catch(e){ye=!0,ve=e}finally{try{!ue&&de.return&&de.return()}finally{if(ye)throw ve}}return this.setValue(this.MEMORY_NEXTRUN_MINERALTOBUYORDERS,Game.time+200),void(this.hasRunMineralToBuyorders=!0)}var Ce=this.getValue(this.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER)
if(void 0===Ce||Ce<Game.time){var Oe=this.getPraiseroomsNeedingEnergyOrder()
if(Oe.length>0){var Me=!0,_e=!1,be=void 0
try{for(var we,Ne=Oe[Symbol.iterator]();!(Me=(we=Ne.next()).done);Me=!0){var Ae=we.value
this.maintainPraiseroomBuyEnergyOrder(Ae)}}catch(e){_e=!0,be=e}finally{try{!Me&&Ne.return&&Ne.return()}finally{if(_e)throw be}}}return this.setValue(this.MEMORY_NEXTRUN_PRAISEROOMENERGYORDER,Game.time+500),void(this.hasRunPraiseroomEnergyOrder=!0)}var Ue=this.getValue(this.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM)
if(void 0===Ue||Ue<Game.time){var ke=this.getPraiseroomNeedingBoost()
return void 0!==ke&&this.sendBoostToPraiseroom(ke),this.setValue(this.MEMORY_NEXTRUN_SENDBOOSTTOPRAISEROOM,Game.time+200),void(this.hasRunSendBoostToPraiseroom=!0)}}else if(e===f.ManagerPriority.Trivial){var Ie=this.getValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS)
if(void 0===Ie||Ie<Game.time){var Le=this.getRoomWantingToSellToGoodDeals()
return void 0!==Le?(this.lookForGoodDeals(Le.room,Le.mineral),this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS,Game.time+10)):this.setValue(this.MEMORY_NEXTRUN_LOOKFORGOODDEALS,Game.time+50),void(this.hasRunLookForGoodDeals=!0)}var Pe=1e5
if(void 0!==Memory.settings.creditsToMaintain&&(Pe=Memory.settings.creditsToMaintain),Game.market.credits>Pe){var xe=this.getValue(this.MEMORY_NEXTRUN_BUYMINERALS)
if(void 0===xe||xe<Game.time){var Ge=this.roomService.getNormalRoomsNotAbandoned(),Be=!0,De=!1,He=void 0
try{for(var We,Ye=Ge[Symbol.iterator]();!(Be=(We=Ye.next()).done);Be=!0){var Fe=We.value
if(a(Fe)&&y.getRoomLevel(Fe)>=c.RoomLevel.City&&s(Fe))return void this.setValue(this.MEMORY_NEXTRUN_BUYMINERALS,Game.time+100)}}catch(e){De=!0,He=e}finally{try{!Be&&Ye.return&&Ye.return()}finally{if(De)throw He}}return void this.setValue(this.MEMORY_NEXTRUN_BUYMINERALS,Game.time+1e3)}}var Ke=this.getValue(this.MEMORY_NEXTRUN_SELLENERGY)
if(void 0===Ke||Ke<Game.time){var Ve=this.getRoomsWantingToSellOfEnergy()
if(Ve.length>0){var je=!0,Xe=!1,Ze=void 0
try{for(var ze,qe=Ve[Symbol.iterator]();!(je=(ze=qe.next()).done);je=!0){var Je=ze.value
this.sellOfResources(Je,RESOURCE_ENERGY)}}catch(e){Xe=!0,Ze=e}finally{try{!je&&qe.return&&qe.return()}finally{if(Xe)throw Ze}}this.setValue(this.MEMORY_NEXTRUN_SELLENERGY,Game.time+100)}else this.setValue(this.MEMORY_NEXTRUN_SELLENERGY,Game.time+500)
return void(this.hasRunSellEnergy=!0)}var Qe=this.getValue(this.MEMORY_NEXTRUN_SELLPOWER)
if(void 0===Qe||Qe<Game.time){var $e=this.getRoomWithPowerOverflow()
return void 0!==$e?(this.sellOfResources($e,RESOURCE_POWER),this.setValue(this.MEMORY_NEXTRUN_SELLPOWER,Game.time+200)):this.setValue(this.MEMORY_NEXTRUN_SELLPOWER,Game.time+1e3),void(this.hasRunSellPower=!0)}var er=this.getValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL)
if(void 0===er||er<Game.time){var rr=this.getRoomWantingToSendAwayPower()
return void 0!==rr?(this.lookForGoodDeals(rr,RESOURCE_POWER),this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL,Game.time+50)):this.setValue(this.MEMORY_NEXTRUN_SELLPOWERGOODDEAL,Game.time+500),void(this.hasRunSellPowerGoodDeal=!0)}var or=this.getValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY)
if(void 0===or||or<Game.time){var tr=this.getRoomWantingToSendAwayEnergy()
return void 0!==tr?(this.sendEnergyToNeighbour(tr),this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY,Game.time+50)):this.setValue(this.MEMORY_NEXTRUN_SENDENERGYAWAY,Game.time+500),void(this.hasRunSendEnergyAway=!0)}var nr=this.getValue(this.MEMORY_NEXTRUN_SENDBOOST)
if(void 0===nr||nr<Game.time){var ar=this.getRoomWithExcessBoost()
return void 0!==ar?(this.sendUpgraderBoostToOthers(ar),this.setValue(this.MEMORY_NEXTRUN_SENDBOOST,Game.time+200)):this.setValue(this.MEMORY_NEXTRUN_SENDBOOST,Game.time+1e3),void(this.hasRunSendBoost=!0)}var ir=this.getValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS);(void 0===ir||ir<Game.time)&&(this.cleanUpInactiveOrders(),this.setValue(this.MEMORY_NEXTRUN_CLEANUPINACTIVEORDERS,Game.time+6e3))}}},{key:"getRoomNeedingCrisisEnergy",value:function(){var e=_.shuffle(this.roomService.getNormalAndNotExpansion()),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(y.getRoomLevel(i)>=c.RoomLevel.Town&&void 0!==i.terminal&&void 0!==i.storage&&i.terminal.store[RESOURCE_ENERGY]<v.requestCrisisEnergyWhenTerminalEnergyBelow&&i.storage.store[RESOURCE_ENERGY]<v.requestCrisisEnergyWhenStorageEnergyBelow&&i.terminal.my&&i.terminal.isActive()&&!i.isAbandoned())return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"getRoomsWantingToSellOfEnergy",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=[],o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
y.getRoomLevel(s)>=c.RoomLevel.Town&&void 0!==s.terminal&&void 0!==s.storage&&s.terminal.store[RESOURCE_ENERGY]>v.sendToNeighboursWhenTerminalEnergyAbove&&s.storage.store[RESOURCE_ENERGY]>v.sendEnergyToBuyOrdersWhenAbove&&s.terminal.my&&s.terminal.isActive()&&r.push(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}},{key:"getRoomWantingToSendAwayEnergy",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(y.getRoomLevel(i)>=c.RoomLevel.Town&&void 0!==i.terminal&&void 0!==i.storage&&i.terminal.store[RESOURCE_ENERGY]>v.sendToNeighboursWhenTerminalEnergyAbove&&i.storage.store[RESOURCE_ENERGY]>v.sendToNeighboursWhenStorageEnergyAbove&&i.terminal.my&&i.terminal.isActive())return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"getPraiseroomNeedingEnergy",value:function(){var e=this.roomService.getPraiseRooms(),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(void 0!==i.terminal&&i.terminal.isActive()&&i.terminal.store[RESOURCE_ENERGY]<i.terminal.storeCapacity-2*v.batchSizeForSendingEnergy)return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"getPraiseroomNeedingBoost",value:function(){var e=this.roomService.getPraiseRooms(),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(void 0!==i.terminal&&i.terminal.isActive()&&(void 0===i.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]||i.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]<2e4))return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"getPraiseroomsNeedingEnergyOrder",value:function(){var e=this.roomService.getPraiseRooms(),r=[],o=!0,t=!1,n=void 0
try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
void 0!==s.terminal&&s.terminal.isActive()&&(void 0===Memory.settings.creditsToMaintain||Game.market.credits>Memory.settings.creditsToMaintain)&&r.push(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return r}},{key:"getRoomWantingToSellToGoodDeals",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=v.sendMineralsToGoodDealsWhenAbove
!0===Memory.settings.bot&&(r=3e4)
var o=!0,n=!1,i=void 0
try{for(var s,l=_.shuffle(e)[Symbol.iterator]();!(o=(s=l.next()).done);o=!0){var m=s.value
if(y.getRoomLevel(m)>=c.RoomLevel.Town&&void 0!==m.terminal&&void 0!==m.storage&&a(m)){var u=t(m),d=!0,f=!1,g=void 0
try{for(var R,p=u[Symbol.iterator]();!(d=(R=p.next()).done);d=!0){var h=R.value
if(m.storage.store[h]>r)return{room:m,mineral:h}}}catch(e){f=!0,g=e}finally{try{!d&&p.return&&p.return()}finally{if(f)throw g}}}}}catch(e){n=!0,i=e}finally{try{!o&&l.return&&l.return()}finally{if(n)throw i}}}},{key:"getRoomWantingToDistributePower",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=!0,o=!1,t=void 0
try{for(var n,i=_.shuffle(e)[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(y.getRoomLevel(s)>=c.RoomLevel.Metropolis&&a(s)&&void 0!==s.terminal&&s.terminal.store[RESOURCE_POWER]>=v.sendPowerWhenTerminalAbove&&void 0!==s.storage&&s.storage.store[RESOURCE_POWER]>=v.sendPowerWhenStorageAbove)return s}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}},{key:"getRoomWantingToSendAwayPower",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=!0,o=!1,t=void 0
try{for(var n,i=_.shuffle(e)[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(y.getRoomLevel(s)>=c.RoomLevel.Metropolis&&a(s)&&void 0!==s.terminal&&s.terminal.store[RESOURCE_POWER]>=v.sendPowerWhenTerminalAbove&&void 0!==s.storage&&s.storage.store[RESOURCE_POWER]>=2*v.sendPowerWhenStorageAbove)return s}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}},{key:"getRoomWithPowerOverflow",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=!0,o=!1,t=void 0
try{for(var n,i=e[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(y.getRoomLevel(s)>=c.RoomLevel.Metropolis&&a(s)&&void 0!==s.terminal&&s.terminal.store[RESOURCE_POWER]>=v.sendPowerWhenTerminalAbove&&void 0!==s.storage&&s.storage.store[RESOURCE_POWER]>=v.sendPowerToBuyOrdersWhenAbove)return s}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}},{key:"getRoomWithExcessBoost",value:function(){var e=this.roomService.getNormalAndNotExpansion(),r=!0,o=!1,t=void 0
try{for(var n,i=e[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(y.getRoomLevel(s)>=c.RoomLevel.Metropolis&&a(s)&&c.RoomLevel.Metropolis&&void 0!==s.terminal&&s.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]>v.sendUpgradeBoostWhenAbove)return s}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}},{key:"requestCrisisEnergy",value:function(e){if(!(void 0===e.terminal||e.terminal.store[RESOURCE_ENERGY]>2*v.requestCrisisEnergyWhenTerminalEnergyBelow)){var r=void 0,o=!0,t=!1,n=void 0
try{for(var i,s=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
l.name!==e.name&&void 0!==l.terminal&&l.terminal.store[RESOURCE_ENERGY]>2*v.batchSizeForCrisisEnergy&&void 0!==l.storage&&l.storage.store[RESOURCE_ENERGY]>v.energyLimitForProvidingCrisisEnergy&&a(l)&&(void 0===r||void 0!==r.storage&&l.storage.store[RESOURCE_ENERGY]>r.storage.store[RESOURCE_ENERGY])&&(r=l)}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}return void 0!==r&&void 0!==r.terminal?(r.terminal.send(RESOURCE_ENERGY,v.batchSizeForCrisisEnergy,e.name),void console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Requesting "+v.batchSizeForCrisisEnergy+" energy from room because of crisis: <a href='#!/room/"+r.name+"'>"+r.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForCrisisEnergy,e.name,r.name)+" energy)</span>")):void 0}}},{key:"sendEnergyToNeighbour",value:function(e){if(a(e)&&void 0!==e.terminal&&!(e.terminal.store[RESOURCE_ENERGY]<2*v.batchSizeForSendingEnergy)){var r=void 0,o=1e7,t=!0,n=!1,i=void 0
try{for(var s,l=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(t=(s=l.next()).done);t=!0){var m=s.value
m.name!==e.name&&void 0!==m.terminal&&m.terminal.store[RESOURCE_ENERGY]<2*v.batchSizeForSendingEnergy&&void 0!==m.controller&&void 0!==m.storage&&m.storage.store[RESOURCE_ENERGY]<2*v.batchSizeForSendingEnergy&&Game.market.calcTransactionCost(1e3,e.name,m.name)<500&&m.terminal.store[RESOURCE_ENERGY]+m.storage.store[RESOURCE_ENERGY]<o&&(r=m.name,o=m.terminal.store[RESOURCE_ENERGY]+m.storage.store[RESOURCE_ENERGY])}}catch(e){n=!0,i=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw i}}void 0!==r&&(e.terminal.send(RESOURCE_ENERGY,v.batchSizeForSendingEnergy,r),console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+v.batchSizeForSendingEnergy+" energy because of overflow to room: <a href='#!/room/"+r+"'>"+r+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingEnergy,e.name,r)+" energy)</span>"))}}},{key:"sendEnergyToPraiseroom",value:function(e){if(void 0!==e.terminal){var r=void 0,o=2e5,t=!0,n=!1,i=void 0
try{for(var s,l=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(t=(s=l.next()).done);t=!0){var m=s.value
m.name!==e.name&&void 0!==m.terminal&&a(m)&&m.terminal.store[RESOURCE_ENERGY]>1.5*v.batchSizeForSendingEnergy&&void 0!==m.controller&&void 0!==m.storage&&m.storage.store[RESOURCE_ENERGY]>2*v.batchSizeForSendingEnergy&&m.terminal.store[RESOURCE_ENERGY]+m.storage.store[RESOURCE_ENERGY]>o&&(r=m,o=m.terminal.store[RESOURCE_ENERGY]+m.storage.store[RESOURCE_ENERGY])}}catch(e){n=!0,i=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw i}}void 0!==r&&void 0!==r.terminal&&(r.terminal.send(RESOURCE_ENERGY,v.batchSizeForSendingEnergy,e.name),console.log("<span style='color:#B3CC99'><a href='#!/room/"+r.name+"'>"+r.name+"</a> Sending "+v.batchSizeForSendingEnergy+" energy to praise GCL: <a href='#!/room/"+e.name+"'>"+e.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingEnergy,r.name,e.name)+" energy)</span>"))}}},{key:"sendBoostToPraiseroom",value:function(e){if(void 0!==e.terminal){var r=!0,o=!1,t=void 0
try{for(var n,i=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
y.getRoomLevel(s)>=c.RoomLevel.Metropolis&&void 0!==s.terminal&&a(s)&&s.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]>v.sendUpgradeBoostWhenAbove&&(s.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID,v.batchSizeForSendingUpgradeBoost,e.name),console.log("<span style='color:#B3CC99'><a href='#!/room/"+s.name+"'>"+s.name+"</a> Sending "+v.batchSizeForSendingUpgradeBoost+" "+RESOURCE_CATALYZED_GHODIUM_ACID+" to praise GCL: <a href='#!/room/"+e.name+"'>"+e.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingUpgradeBoost,s.name,e.name)+" energy)</span>"))}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}}},{key:"maintainPraiseroomBuyEnergyOrder",value:function(e){if(void 0!==e.terminal){var r=_.filter(Game.market.orders,function(r){return r.type===ORDER_BUY&&r.resourceType===RESOURCE_ENERGY&&r.roomName===e.name})
if(Object.keys(r).length>0){for(var o in r)if(r[o].amount<5e4){var t=1e5-r[o].amount
console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Updating praiseroom energy-buyorder with "+t+" energy for 0.02</span>"),Game.market.extendOrder(r[o].id,t)}}else console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Buyorder for praiseroom energy created.</span>"),Game.market.createOrder(ORDER_BUY,RESOURCE_ENERGY,.01,1e5,e.name)}}},{key:"cleanUpInactiveOrders",value:function(){var e=_.filter(Game.market.orders,function(e){return e.type===ORDER_SELL&&!1===e.active&&0===e.remainingAmount}),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
Game.market.cancelOrder(i.id)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"lookForGoodDeals",value:function(e,r){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
if(a(e)){var t=5e3
r===RESOURCE_POWER&&(t=100)
var n=Game.market.getAllOrders(function(e){return e.type===ORDER_BUY&&e.resourceType===r&&e.amount>=t})
if(void 0!==n){var i=_.map(n,function(r){return{orderid:r.id,priceWithTransactionCost:r.price-.01*Game.market.calcTransactionCost(1,e.name,r.roomName)}}),s=m.getResourcePrice(r)
if(void 0!==s){var l=1.5*s
o&&(l=.8*s)
var u=void 0,y=!0,v=!1,c=void 0
try{for(var d,f=i[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var g=d.value
l<g.priceWithTransactionCost&&(l=g.priceWithTransactionCost,u=g.orderid)}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}if(void 0!==u){var R=Game.market.getOrderById(u)
if(null!==R){var p=Math.min(R.amount,1e4)
Game.market.deal(R.id,p,e.name),console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Selling directly "+p+" "+r+" for "+R.price+" because of a good deal! Cost: "+Game.market.calcTransactionCost(p,e.name,R.roomName)+" ("+R.id+")</span>")}}}}}}},{key:"sendPowerToOthers",value:function(e){if(a(e)&&!(void 0===e.terminal||e.terminal.store[RESOURCE_ENERGY]<v.energyLimitForSendingMinerals)){var r=!0,o=!1,t=void 0
try{for(var n,i=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(s.name!==e.name&&void 0!==s.controller&&8===s.controller.level&&void 0!==s.terminal&&!s.isAbandoned()&&(s.terminal.store[RESOURCE_POWER]<2*v.batchSizeForSendingPower||void 0===s.terminal.store[RESOURCE_POWER]))return e.terminal.send(RESOURCE_POWER,v.batchSizeForSendingPower,s.name),void console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+v.batchSizeForSendingPower+" "+RESOURCE_POWER+" to room: <a href='#!/room/"+s.name+"'>"+s.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingPower,e.name,s.name)+" energy)</span>")}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}}},{key:"sellEverything",value:function(e){if(!a(e)||void 0===e.terminal)return!1
var r=Object.keys(e.terminal.store)
if(r.length>1){var o=!0,t=!1,n=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
if(e.terminal.store[l]>=100&&l!==RESOURCE_ENERGY&&this.sellOfResources(e,l))return!0}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}if(e.terminal.store[RESOURCE_ENERGY]>=1e3&&this.sellOfResources(e,RESOURCE_ENERGY))return!0}return!1}},{key:"sellOfResources",value:function(e,r){if(!a(e))return!1
var o=1e3
r===RESOURCE_POWER?o=100:r===RESOURCE_ENERGY&&(o=1e4)
var t=Game.market.getAllOrders(function(e){return e.type===ORDER_BUY&&e.resourceType===r&&e.amount>=o})
if(void 0===t)return!1
var n=_.map(t,function(r){return{orderid:r.id,priceWithTransactionCost:r.price-.005*Game.market.calcTransactionCost(1,e.name,r.roomName)}}),i=0,s=void 0,l=!0,m=!1,u=void 0
try{for(var y,v=n[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value
i<c.priceWithTransactionCost&&(i=c.priceWithTransactionCost,s=c.orderid)}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}if(void 0!==s){var d=Game.market.getOrderById(s)
if(null!==d){var f=Math.min(d.amount,1e4),g=Game.market.calcTransactionCost(f,e.name,d.roomName)
if(void 0!==e.terminal&&e.terminal.store[RESOURCE_ENERGY]>g)return Game.market.deal(d.id,f,e.name),console.log("<span style='color:#7FDBFF'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Selling directly "+f+" "+r+" for "+d.price+" because of overflow. Cost: "+Game.market.calcTransactionCost(f,e.name,d.roomName)+" ("+d.id+")</span>"),!0}}return!1}},{key:"sendUpgraderBoostToOthers",value:function(e){if(a(e)&&!(void 0===e.terminal||e.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]<2*v.batchSizeForSendingUpgradeBoost)){var r=!0,o=!1,t=void 0
try{for(var n,i=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var s=n.value
if(s.name!==e.name&&void 0!==s.controller&&s.controller.level<8&&!s.isAbandoned()&&void 0!==s.terminal&&(s.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]<2*v.batchSizeForSendingUpgradeBoost||void 0===s.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]))return e.terminal.send(RESOURCE_CATALYZED_GHODIUM_ACID,v.batchSizeForSendingUpgradeBoost,s.name),void console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+v.batchSizeForSendingUpgradeBoost+" "+RESOURCE_CATALYZED_GHODIUM_ACID+" to room: <a href='#!/room/"+s.name+"'>"+s.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingUpgradeBoost,e.name,s.name)+" energy)</span>")}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}}},{key:"sendMineralsToOthers",value:function(e,r){if(!a(e))return!1
if(void 0===e.terminal||e.terminal.store[RESOURCE_ENERGY]<v.energyLimitForSendingMinerals)return!1
var o=!0,t=!1,n=void 0
try{for(var i,s=this.roomService.getNormalAndNotExpansion()[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
if(l.name!==e.name&&void 0!==l.controller&&l.controller.level>=6&&!l.isAbandoned()&&void 0!==l.terminal&&(l.terminal.store[r]<2*v.batchSizeForSendingMinerals||void 0===l.terminal.store[r]))return e.terminal.send(r,v.batchSizeForSendingMinerals,l.name),console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+v.batchSizeForSendingMinerals+" "+r+" to room: <a href='#!/room/"+l.name+"'>"+l.name+"</a> (costing "+Game.market.calcTransactionCost(v.batchSizeForSendingMinerals,e.name,l.name)+" energy)</span>"),!0}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}return!1}},{key:"sendAwayEverything",value:function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
if(a(e)&&void 0!==e.terminal){var o=_.shuffle(_.filter(this.roomService.getNormalAndNotExpansion(),function(r){return void 0!==r.terminal&&r.name!==e.name&&!r.isAbandoned()})),t=Object.keys(e.terminal.store)
if(t.length>1&&o.length>0){var n=!0,i=!1,s=void 0
try{for(var l,m=t[Symbol.iterator]();!(n=(l=m.next()).done);n=!0){var u=l.value
if(e.terminal.store[u]>=100&&u!==RESOURCE_ENERGY)return console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+Math.min(v.batchSizeForSendingEverythingOut,e.terminal.store[u])+" "+u+" to room "+o[0].name+" because room is being abandoned. </span>"),e.terminal.send(u,Math.min(v.batchSizeForSendingEverythingOut,e.terminal.store[u]),o[0].name),!0}}catch(e){i=!0,s=e}finally{try{!n&&m.return&&m.return()}finally{if(i)throw s}}if(r){var y=!0,c=!1,d=void 0
try{for(var f,g=t[Symbol.iterator]();!(y=(f=g.next()).done);y=!0){var R=f.value
if(e.terminal.store[R]>=100&&R===RESOURCE_ENERGY)return console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Sending "+Math.min(v.batchSizeForSendingEverythingOut,e.terminal.store[R])+" "+R+" to room "+o[0].name+" because room is being abandoned. </span>"),e.terminal.send(R,Math.min(v.batchSizeForSendingEverythingOut,e.terminal.store[R]),o[0].name),!0}}catch(e){c=!0,d=e}finally{try{!y&&g.return&&g.return()}finally{if(c)throw d}}}}}}}]),r}()
r.TradeManager=g,r.requestMineralsForLabs=function(e,r,o){if(void 0!==e.terminal){var t=u.getAllControlledRooms()
o+=100
var n=void 0,i=0,s=!0,m=!1,v=void 0
try{for(var d,f=t[Symbol.iterator]();!(s=(d=f.next()).done);s=!0){var g=d.value
y.getRoomLevel(e)>=c.RoomLevel.Metropolis&&void 0!==g.terminal&&a(g)&&g.terminal.store[r]>o+4e3&&g.terminal.store[r]>i&&(n=g,i=g.terminal.store[r])}}catch(e){m=!0,v=e}finally{try{!s&&f.return&&f.return()}finally{if(m)throw v}}void 0!==n&&void 0!==n.terminal?(n.terminal.send(r,o,e.name),console.log("<span style='color:#B3CC99'><a href='#!/room/"+n.name+"'>"+n.name+"</a> Sending "+o+" "+r+" to <a href='#!/room/"+e.name+"'>"+e.name+"</a> because it is needed for labs (costing "+Game.market.calcTransactionCost(o,n.name,e.name)+" energy)</span>")):l(e,r,o)}},r.requestMineralsForBoosting=function(e,r,o){if(void 0!==e.terminal){var t=u.getAllControlledRooms()
o+=100
var n=void 0,s=0,l=!0,m=!1,v=void 0
try{for(var d,f=t[Symbol.iterator]();!(l=(d=f.next()).done);l=!0){var g=d.value
y.getRoomLevel(e)>=c.RoomLevel.Metropolis&&void 0!==g.terminal&&a(g)&&g.terminal.store[r]>o&&g.terminal.store[r]>s&&(n=g,s=g.terminal.store[r])}}catch(e){m=!0,v=e}finally{try{!l&&f.return&&f.return()}finally{if(m)throw v}}void 0!==n&&void 0!==n.terminal?(n.terminal.send(r,o,e.name),console.log("<span style='color:#B3CC99'><a href='#!/room/"+n.name+"'>"+n.name+"</a> Sending "+o+" "+r+" to <a href='#!/room/"+e.name+"'>"+e.name+"</a> because it is needed for boosting (costing "+Game.market.calcTransactionCost(o,n.name,e.name)+" energy)</span>")):i(e,r,o)}},r.buyMineralsForBoosting=i,r.buyMineralsForLabs=l},function(e,r,o){function t(){Memory.marketBuy={},Memory.marketSell={}
var e=_.map(n(),function(e){return e.id}),r=!0,o=!1,t=void 0
try{for(var a,i=Game.market.getAllOrders()[Symbol.iterator]();!(r=(a=i.next()).done);r=!0){var s=a.value
s.amount>=1e3&&!_.contains(e,s.id)&&(s.type===ORDER_SELL&&(void 0===Memory.marketSell[s.resourceType]||Memory.marketSell[s.resourceType]>s.price)?Memory.marketSell[s.resourceType]=s.price:s.type===ORDER_BUY&&(void 0===Memory.marketBuy[s.resourceType]||Memory.marketBuy[s.resourceType]<s.price)&&(Memory.marketBuy[s.resourceType]=s.price))}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}function n(){return _.filter(Game.market.orders,function(e){return e.active})}var a=o(14),i=function(e){function r(){_classCallCheck(this,r)
var e=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MarketManager"))
return e.MEMORY_LASTRUN="lastRun",e}return _inherits(r,a.Manager),_createClass(r,[{key:"run",value:function(e){if(e===a.ManagerPriority.Trivial){var r=this.getValue(this.MEMORY_LASTRUN);(void 0===r||r+100<Game.time)&&(t(),this.setValue(this.MEMORY_LASTRUN,Game.time))}}}]),r}()
r.MarketManager=i,r.getResourcePrice=function(e){if(void 0!==Memory.marketSell&&void 0!==Memory.marketSell[e])return Memory.marketSell[e]}},function(e,r){var o={sendToNeighboursWhenTerminalEnergyAbove:1e5,sendToNeighboursWhenStorageEnergyAbove:5e5,requestCrisisEnergyWhenTerminalEnergyBelow:8e4,requestCrisisEnergyWhenStorageEnergyBelow:3e4,energyLimitForSendingMinerals:1e4,energyLimitForProvidingCrisisEnergy:15e4,sendMineralsToOtherRoomsWhenAbove:6e3,sendMineralsToGoodDealsWhenAbove:15e4,sendMineralsToSellOrderWhenAbove:1e5,sendMineralsToBuyOrdersWhenAbove:2e5,sendEnergyToBuyOrdersWhenAbove:6e5,sendPowerToBuyOrdersWhenAbove:15e4,sendPowerWhenTerminalAbove:12e3,sendPowerWhenStorageAbove:5e4,sendUpgradeBoostWhenAbove:4e3,batchSizeForSendingEnergy:5e4,batchSizeForSendingEverythingOut:1e4,batchSizeForSendingMinerals:2e3,batchSizeForSendingPower:2e3,batchSizeForSendingUpgradeBoost:2e3,batchSizeForCrisisEnergy:2e4}
e.exports=o},function(e,r){!function(e){e[e.ClearLab=0]="ClearLab",e[e.BuyMinerals=1]="BuyMinerals",e[e.LoadHauler=2]="LoadHauler",e[e.UnloadHauler=3]="UnloadHauler",e[e.BoostCreep=4]="BoostCreep",e[e.ValidateBoost=5]="ValidateBoost"}(r.BoostStage||(r.BoostStage={}))
r.BoostStage},function(e,r,o){var t=o(14),n=o(90),a=o(66),i=o(91),s=o(67),l=o(13),m=o(15),u=o(16),y=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"OperationManager"))
return t.MEMORY_OPERATIONSMAINTAINENCE="maintain",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Low&&this.creepService.runCreeps(u.Role.OperationHauler,n.run),e===t.ManagerPriority.Trivial){var r=this.getValue(this.MEMORY_OPERATIONSMAINTAINENCE);(void 0===r||r+1e3<Game.time)&&(this.deleteOldOperations(),this.setValue(this.MEMORY_OPERATIONSMAINTAINENCE,Game.time))}void 0===Memory.operations&&(Memory.operations=[])
var o=!0,y=!1,v=void 0
try{for(var c,d=Memory.operations[Symbol.iterator]();!(o=(c=d.next()).done);o=!0){var f=c.value
switch(f.operationtype){case m.OperationType.Haul:f.active&&!a.victoryConditionReached(f)?a.run(f,this.creepService,e):f.active=!1
break
case m.OperationType.Drain:f.active&&!i.victoryConditionReached(f)?i.run(f,this.creepService,e):f.active=!1
break
case m.OperationType.Guard:f.active&&!s.victoryConditionReached(f)?s.run(f,this.creepService,e):f.active=!1
break
case m.OperationType.Spawnmove:f.active&&!l.victoryConditionReached(f)?l.run(f,e,this.creepService):f.active=!1}}}catch(e){y=!0,v=e}finally{try{!o&&d.return&&d.return()}finally{if(y)throw v}}}},{key:"deleteOldOperations",value:function(){void 0===Memory.operations&&(Memory.operations=[])
var e=_.remove(Memory.operations,function(e){return!1===e.active})
e.length>0&&console.log("Removed "+e.length+" finished operations.")}}]),r}()
r.OperationManager=y},function(e,r,o){function t(e){e.carry.energy<e.carryCapacity&&e.room.name===e.memory.homeroom&&void 0!==e.room.storage?e.pos.getRangeTo(e.room.storage.pos)>1?e.moveTo(e.room.storage):e.withdraw(e.room.storage,RESOURCE_ENERGY):(e.setState(l.MoveToTargetRoom),n(e))}function n(e){var r=e.memory.target
r!==e.room.name||m.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r,{allowHostile:!1}):(e.setState(l.TransferEnergyToStructure),a(e))}function a(e){return 0===e.carry.energy?s(e)?(e.setState(l.MoveToHomeroom),void i(e)):void e.suicide():void 0===e.room.storage?(e.setState(l.MoveToHomeroom),void i(e)):void(e.pos.getRangeTo(e.room.storage.pos)>1?e.travelTo(e.room.storage):e.transfer(e.room.storage,RESOURCE_ENERGY))}function i(e){var r=e.memory.homeroom
r!==e.room.name?e.travelToRoom(r,{allowHostile:!1}):(e.setState(l.TankUpInHomeroom),t(e))}function s(e){var r=Game.rooms[e.memory.homeroom]
if(void 0==r||void 0===r.terminal)return!0
var o=u.getDistanseBetween(e.pos,r.terminal.pos)
return e.ticksToLive>2.1*o}var l,m=o(45),u=o(3),y=o(7)
!function(e){e[e.TankUpInHomeroom=1]="TankUpInHomeroom",e[e.MoveToTargetRoom=2]="MoveToTargetRoom",e[e.TransferEnergyToStructure=3]="TransferEnergyToStructure",e[e.MoveToHomeroom=4]="MoveToHomeroom"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.TankUpInHomeroom),e.getState()){case l.TankUpInHomeroom:t(e)
break
case l.MoveToTargetRoom:n(e)
break
case l.TransferEnergyToStructure:a(e)
break
case l.MoveToHomeroom:i(e)
break
default:y.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(l.MoveToHomeroom)}}},function(e,r,o){function t(e,r){var o=Game.rooms[e.spawnRoom]
if(o instanceof Room&&void 0!==o.storage){if(void 0===e.distanceToTargetRoom){var t=new RoomPosition(25,25,e.targetRoom)
e.distanceToTargetRoom=y.getDistanseBetween(o.storage.pos,t)}if(r.getCreeps(i.Role.Drainer,null,e.spawnRoom).length+l.getCreepsInQueue(o,i.Role.Drainer)<2){var n=new m.Order
n.body=u.getDrainerBody(e.tier),n.priority=s.Priority.Low,n.memory={role:i.Role.Drainer,route:e.targetRoute,tier:e.tier},l.orderCreep(o,n)}}}var n=o(14),a=o(15),i=o(16),s=o(17),l=o(18),m=o(20),u=o(19),y=o(3)
!function(e){e[e.HostileRoomEnergy=1]="HostileRoomEnergy",e[e.Gametime=2]="Gametime"}(r.VictoryCondition||(r.VictoryCondition={}))
var v=r.VictoryCondition
r.Data=function e(){_classCallCheck(this,e),this.operationtype=a.OperationType.Haul,this.active=!0},r.run=function(e,r,o){o===n.ManagerPriority.Standard&&Game.time%50==0&&t(e,r)},r.victoryConditionReached=function(e){var r=Game.rooms[e.targetRoom]
if(!(r instanceof Room))return!1
switch(e.victoryCondition){case v.HostileRoomEnergy:var o=r.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER}})
if(!(0!==_.sum(o,function(e){return e.energy})||void 0!==r.storage&&0!==r.storage.store[RESOURCE_ENERGY]||void 0!==r.terminal&&0!==r.terminal.store[RESOURCE_ENERGY]))return e.active=!1,!0
break
case v.Gametime:if(Game.time>e.victoryValue)return e.active=!1,!0}return!1}},function(e,r,o){var t=o(14),n=o(9),a=o(93),i=o(95),s=o(96),l=o(19),m=o(3),u=o(18),y=o(20),v=o(16),c=o(94),d=o(17),f=o(7),g=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"PraiseroomManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Critical)this.creepService.runCreeps(v.Role.PraiserWithBoost,a.run)
else if(e===t.ManagerPriority.Standard){this.creepService.runCreeps(v.Role.PraiserLeader,s.run)
var r=this.roomService.getPraiseRooms(),o=!0,n=!1,l=void 0
try{for(var m,u=r[Symbol.iterator]();!(o=(m=u.next()).done);o=!0){var y=m.value
void 0!==y.controller&&y.controller.my&&(y.memory.praiseStatus!==c.PraiseStatus.Praising&&y.memory.praiseStatus!==c.PraiseStatus.PreparingReset&&y.memory.praiseStatus!==c.PraiseStatus.Reestablishing||this.runPraising(y))}}catch(e){n=!0,l=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw l}}var d=this.getValue(this.MEMORY_LASTRUN)
if(void 0===d||d+30<Game.time){var f=this.roomService.getNormalWithPraiseroom()
this.runPraiserooms(f),this.setValue(this.MEMORY_LASTRUN,Game.time)}}else e===t.ManagerPriority.Low&&(this.creepService.runCreeps(v.Role.PraiserWithoutBoost,a.run),this.creepService.runCreeps(v.Role.PraiserHauler,i.run))}},{key:"runPraiserooms",value:function(e){var r=!0,o=!1,t=void 0
try{for(var a,i=e[Symbol.iterator]();!(r=(a=i.next()).done);r=!0){var s=a.value,l=Game.rooms[s.memory.praiseroom]
void 0!==l&&(void 0===l.controller||l.controller.my||s.memory.praiseroomHibernated)||(this.orderRoomClaimer(s,s.memory.praiseroom),void 0===Memory.rooms[s.memory.praiseroom]&&(Memory.rooms[s.memory.praiseroom]={}),Memory.rooms[s.memory.praiseroom].isPraiseRoom=!0),l.memory.t=n.Roomtype.Praiseroom,s.memory.praiseroomHibernated?l.memory.praiseStatus=c.PraiseStatus.PreparingHibernate:this.buildPraiseBuildings(l),void 0!==l.controller&&l.controller.my&&(this.setPraiseStatus(l),this.orderPraisers(s,l.name,this.getWantedPraiserCount(l)),this.shouldWeOrderHaulers(l)&&this.orderPraiserHaulers(s,l.name),l.memory.praiseStatus!==c.PraiseStatus.Praising&&l.memory.praiseStatus!==c.PraiseStatus.PreparingReset&&l.memory.praiseStatus!==c.PraiseStatus.Reestablishing||this.orderPraiserLeader(s,l.name))}}catch(e){o=!0,t=e}finally{try{!r&&i.return&&i.return()}finally{if(o)throw t}}}},{key:"runPraising",value:function(e){var r=e.getSpawn(),o=e.storage
if(void 0!==r&&void 0!==o){var t=this.getPraiserLeader(e),n=this.getHealingPraiser(o.pos),a=this.getNextHealingPraiser(o.pos)
e.memory.rotationDone&&(this.boostPraisersIfShouldAndCan(e),e.memory.rotationDone=void 0),(Game.time%366==0&&(void 0===n||void 0!==n&&n.ticksToLive>=1470)||void 0!==n&&n.ticksToLive>=1485&&(void 0===a||void 0!==a&&a.ticksToLive<100))&&(this.assignPositionsToPraisers(e,o),f.log.info("Rotating praisers in praiserroom",e.name),e.memory.rotationDone=!0),void 0!==t&&t.ticksToLive<1e3?r.renewCreep(t):void 0!==a&&a.ticksToLive<10?r.renewCreep(a):void 0!==n&&n.ticksToLive<1485&&(n.body[0].boost&&n.ticksToLive<10||!n.body[0].boost)&&r.renewCreep(n)}else f.log.error("Praiseroom missing spawn or storage",e.name)}},{key:"boostPraisersIfShouldAndCan",value:function(e){if(void 0!==e.storage&&void 0!==e.terminal&&void 0!==e.controller){var r=this.getBoostingPraiser(e.storage.pos)
if(!(void 0===r||r.body[0].boost||r.ticksToLive<1470||e.controller.level<6||e.controller.level>7||7===e.controller.level&&e.controller.progress>.95*e.controller.progressTotal)){var o=this.getBoosterLab(e.storage.pos)
void 0!==o&&o.mineralAmount===o.mineralCapacity&&o.mineralType===RESOURCE_CATALYZED_GHODIUM_ACID&&(o.boostCreep(r),f.log.info("Boosting praisers in praiserroom",e.name))}}}},{key:"getBoosterLab",value:function(e){var r=new RoomPosition(e.x,e.y+2,e.roomName).lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_LAB)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}},{key:"assignPositionsToPraisers",value:function(e,r){var o=this.getPraiserPositions(r.pos),t=this.getPraisersSortedByTicksToLive(e)
for(var n in o){if(!(t[n]instanceof Creep))return
t[n].memory.wantedPos=o[n]}}},{key:"getPraisersSortedByTicksToLive",value:function(e){return this.creepService.getCreeps(v.Role.Praiser,e.name).sort(function(e,r){return e.ticksToLive>r.ticksToLive?1:r.ticksToLive>e.ticksToLive?-1:0})}},{key:"getBoostingPraiser",value:function(e){var r=new RoomPosition(e.x,e.y+1,e.roomName).lookFor(LOOK_CREEPS)
if(r.length>0)return r[0]}},{key:"getHealingPraiser",value:function(e){var r=new RoomPosition(e.x-1,e.y,e.roomName).lookFor(LOOK_CREEPS)
if(r.length>0)return r[0]}},{key:"getNextHealingPraiser",value:function(e){var r=new RoomPosition(e.x-1,e.y-1,e.roomName).lookFor(LOOK_CREEPS)
if(r.length>0)return r[0]}},{key:"getPraiserLeader",value:function(e){var r=this.creepService.getCreeps(v.Role.PraiserLeader,e.name)
if(r.length>0)return r[0]}},{key:"getPraiserPositions",value:function(e){return[new RoomPosition(e.x-1,e.y,e.roomName),new RoomPosition(e.x-1,e.y-1,e.roomName),new RoomPosition(e.x,e.y-1,e.roomName),new RoomPosition(e.x+1,e.y-1,e.roomName),new RoomPosition(e.x+1,e.y,e.roomName),new RoomPosition(e.x+1,e.y+1,e.roomName),new RoomPosition(e.x,e.y+1,e.roomName)]}},{key:"setPraiseStatus",value:function(e){void 0!==e.controller&&e.controller.my&&(e.memory.praiseStatus==c.PraiseStatus.PreparingHibernate?0===this.creepService.getCreeps(v.Role.Praiser,e.name).length&&(e.controller.unclaim(),e.memory.praiseStatus=c.PraiseStatus.Hiberate):e.controller.level<6||6===e.controller.level&&void 0===e.terminal?void 0===e.terminal?e.memory.praiseStatus=c.PraiseStatus.Establishing:e.memory.praiseStatus=c.PraiseStatus.Reestablishing:8===e.controller.level?void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>e.storage.storeCapacity-1e4?(e.memory.praiseStatus!==c.PraiseStatus.Reestablishing&&(this.removePraisersForReset(e),e.controller.unclaim()),e.memory.praiseStatus=c.PraiseStatus.Reestablishing):(e.memory.praiseStatus!==c.PraiseStatus.PreparingReset&&this.removePraisersForReset(e),e.memory.praiseStatus=c.PraiseStatus.PreparingReset):void 0!==e.storage&&void 0!==e.terminal?e.memory.praiseStatus=c.PraiseStatus.Praising:f.log.error("PraiseManager could not find a valid status for praiseroom",e.name))}},{key:"removePraisersForReset",value:function(e){var r=this.creepService.getCreeps(v.Role.Praiser,e.name),o=0,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;++o>6&&l.suicide()}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}},{key:"shouldWeOrderHaulers",value:function(e){return void 0===e.terminal||!e.terminal.isActive()&&void 0!==e.storage&&e.storage.isActive()&&e.storage.store[RESOURCE_ENERGY]<95e4}},{key:"getWantedPraiserCount",value:function(e){switch(e.memory.praiseStatus){case c.PraiseStatus.Establishing:return 3
case c.PraiseStatus.Reestablishing:return 6
case c.PraiseStatus.Praising:return 7
default:return 0}}},{key:"buildPraiseBuildings",value:function(e){if(void 0!==e.controller&&e.controller.my){var r=e.getSpawn()
if(void 0===r&&e.controller.level>0){var o=e.find(FIND_FLAGS,{filter:function(r){return"praise"===r.name&&r.pos.roomName===e.name}})
if(1===o.length){var t=o[0]
new RoomPosition(t.pos.x-2,t.pos.y,t.pos.roomName).createConstructionSite(STRUCTURE_SPAWN),t.remove()}else void 0!==e.storage&&new RoomPosition(e.storage.pos.x-2,e.storage.pos.y,e.storage.pos.roomName).createConstructionSite(STRUCTURE_SPAWN)}else if(r instanceof StructureSpawn){var n=r.pos
if(e.controller.level>=4&&void 0===e.storage&&new RoomPosition(n.x+2,n.y,n.roomName).createConstructionSite(STRUCTURE_STORAGE),e.controller.level>=6&&void 0===e.terminal&&new RoomPosition(n.x,n.y+2,n.roomName).createConstructionSite(STRUCTURE_TERMINAL),6===e.controller.level&&void 0!==e.storage){var a=e.storage.pos
new RoomPosition(a.x,a.y+2,a.roomName).createConstructionSite(STRUCTURE_LAB),new RoomPosition(a.x+4,a.y,a.roomName).createConstructionSite(STRUCTURE_TOWER),new RoomPosition(a.x-4,a.y,a.roomName).createConstructionSite(STRUCTURE_TOWER)}if(7===e.controller.level&&void 0!==e.storage){var i=e.storage.pos
new RoomPosition(i.x,i.y+4,i.roomName).createConstructionSite(STRUCTURE_TOWER)}}}}},{key:"orderRoomClaimer",value:function(e,r){var o=l.getMaxTierClaimer(e.energyCapacityAvailable),t=Math.min(o,1)
if(1>this.creepService.getNumberOfTiers(v.Role.RoomClaimer,r)+u.getNumberOfTiersInQueue(e,v.Role.RoomClaimer,r)){var n=new y.Order
n.body=l.getClaimerBody(t),n.priority=d.Priority.Critical,n.memory={role:v.Role.RoomClaimer,target:r,tier:t},u.orderCreep(e,n)}}},{key:"orderPraiserHaulers",value:function(e,r){var o=l.getMaxTierHauler(e.energyCapacityAvailable),t=this.creepService.getCreeps(v.Role.PraiserHauler,r).length,n=u.getCreepsInQueue(e,v.Role.PraiserHauler,r),a=10,i=Game.rooms[r]
if(void 0!==e.storage&&void 0!==i&&void 0!==i.controller&&(a=Math.ceil(m.getDistanseBetween(e.storage.pos,i.controller.pos)/5)),a>t+n){var s=new y.Order
s.body=l.getHaulerBody(o),s.priority=d.Priority.Standard,s.memory={role:v.Role.PraiserHauler,target:r,tier:o},u.orderCreep(e,s)}}},{key:"orderPraiserLeader",value:function(e,r){var o=l.getMaxTierHauler(e.energyCapacityAvailable)
if(this.creepService.getCreeps(v.Role.PraiserLeader,r).length+u.getCreepsInQueue(e,v.Role.PraiserLeader,r)===0){var t=new y.Order
t.body=l.getHaulerBody(o),t.priority=d.Priority.Important,t.memory={role:v.Role.PraiserLeader,target:r,tier:o},u.orderCreep(e,t)}}},{key:"orderPraisers",value:function(e,r,o){if(o>this.creepService.getCreeps(v.Role.Praiser,r).length+u.getCreepsInQueue(e,v.Role.Praiser,r)){var t=new y.Order
t.body=l.getPraiserBody(),t.priority=d.Priority.Important,t.memory={role:v.Role.Praiser,target:r,tier:1},u.orderCreep(e,t)}}}]),r}()
r.PraiseroomManager=g},function(e,r,o){function t(e){var r=e.memory.target
r!==e.room.name||d.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r):(e.setState(y.Constructing),m(e))}function n(e){if(e.room.memory.praiseStatus!==c.PraiseStatus.Praising&&e.room.memory.praiseStatus!==c.PraiseStatus.Reestablishing){var r=e.room.getSpawn()
if(e.ticksToLive>1400||void 0===r||e.room.energyAvailable<50&&0===e.carry.energy)return e.room.memory.renewing=void 0,e.setState(y.Praising),void l(e)
e.pos.getRangeTo(r.pos)>1?e.moveTo(r):(e.carry.energy>0&&r.energy<r.energyCapacity/2?e.transfer(r,RESOURCE_ENERGY):void 0!==e.room.storage&&e.carry.energy<e.carryCapacity&&1===e.pos.getRangeTo(e.room.storage)&&e.room.storage.store[RESOURCE_ENERGY]>0&&e.withdraw(e.room.storage,RESOURCE_ENERGY),r.renewCreep(e)),void 0!==e.room.controller&&e.pos.getRangeTo(e.room.controller)<4&&e.upgradeController(e.room.controller)===OK&&(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK))}else e.setState(y.SuperPraising)}function a(e){if(e.carry.energy>0)return e.room.find(FIND_MY_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_TERMINAL||e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_LAB}}).length>0?(e.setState(y.Constructing),void m(e)):(e.setState(y.Praising),void l(e))
void 0!==e.room.storage&&(e.pos.getRangeTo(e.room.storage.pos)>1?e.moveTo(e.room.storage):e.withdraw(e.room.storage,RESOURCE_ENERGY))}function i(e){if(void 0!==e.room.controller)if(e.room.controller.my){if(void 0!==e.memory.wantedPos&&void 0!==e.memory.wantedPos.x&&void 0!==e.memory.wantedPos.y&&void 0!==e.memory.wantedPos.roomName){var r=new RoomPosition(e.memory.wantedPos.x,e.memory.wantedPos.y,e.memory.wantedPos.roomName),o=e.pos.getRangeTo(r)
1===o?e.moveTo(r,{ignoreCreeps:!0}):o>1&&e.moveTo(r)}void 0!==e.room.storage&&e.carry.energy<e.carryCapacity&&e.withdraw(e.room.storage,RESOURCE_ENERGY),e.upgradeController(e.room.controller)===OK&&(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK))}else 0===e.fatigue&&s(e)
else f.log.error("Praising in room without owned controller",e.room.name)}function s(e){v.moveOffRoad(e)}function l(e){if(e.room.memory.praiseStatus!==c.PraiseStatus.Praising&&e.room.memory.praiseStatus!==c.PraiseStatus.Reestablishing)return 0===e.carry.energy?(e.setState(y.GetEnergyFromStorage),void a(e)):Game.time%20==2&&e.ticksToLive<500&&void 0===e.room.memory.renewing&&e.carry.energy>0?(e.room.memory.renewing=e.id,e.setState(y.Renewing),void n(e)):Game.time%333==0&&e.room.find(FIND_MY_CONSTRUCTION_SITES).length>0?(e.setState(y.Constructing),void m(e)):void(void 0!==e.room.controller&&e.room.controller.my?e.pos.getRangeTo(e.room.controller)>3?e.moveTo(e.room.controller):(void 0!==e.room.storage&&e.carry.energy<e.carryCapacity/2&&1===e.pos.getRangeTo(e.room.storage)&&e.room.storage.store[RESOURCE_ENERGY]>0&&e.withdraw(e.room.storage,RESOURCE_ENERGY),e.upgradeController(e.room.controller)===OK&&(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK))):f.log.error("Praising in room without owned controller",e.room.name))
e.setState(y.SuperPraising)}function m(e){if(0!==e.carry.energy||void 0===e.room.storage){var r=Game.getObjectById(e.memory.structureid)
if(null===r){var o=e.room.find(FIND_MY_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_TERMINAL||e.structureType===STRUCTURE_LAB||e.structureType===STRUCTURE_TOWER}})
o.length>0&&(e.memory.structureid=o[0].id,r=o[0])}r instanceof ConstructionSite?(void 0!==e.room.storage&&e.carry.energy<e.carryCapacity/2&&1===e.pos.getRangeTo(e.room.storage)&&e.room.storage.store[RESOURCE_ENERGY]>0&&e.withdraw(e.room.storage,RESOURCE_ENERGY),e.pos.getRangeTo(r.pos)>3?e.moveTo(r):e.build(r)):(e.memory.structureid=void 0,e.setState(y.Praising))}else e.setState(y.GetEnergyFromStorage)}function u(e){Game.time%155==0&&e.memory.target===e.pos.roomName&&(void 0!==e.room.controller&&8===e.room.controller.level||e.room.memory.praiseStatus===c.PraiseStatus.Inactive)&&(f.log.alert("Praiser dismissed, room has reached lvl 8.",e.room.name),void 0!==e.room.storage&&e.carry[RESOURCE_ENERGY]>0&&e.transfer(e.room.storage,RESOURCE_ENERGY))}var y,v=o(33),c=o(94),d=o(45),f=o(7)
!function(e){e[e.MoveToPraiseroom=1]="MoveToPraiseroom",e[e.GetEnergyFromStorage=2]="GetEnergyFromStorage",e[e.Praising=3]="Praising",e[e.Constructing=5]="Constructing",e[e.Renewing=6]="Renewing",e[e.SuperPraising=7]="SuperPraising"}(y||(y={})),r.run=function(e){switch(e.hasState()||e.setState(y.MoveToPraiseroom),u(e),e.getState()){case y.MoveToPraiseroom:t(e)
break
case y.GetEnergyFromStorage:a(e)
break
case y.Praising:l(e)
break
case y.SuperPraising:i(e)
break
case y.Constructing:m(e)
break
case y.Renewing:n(e)
break
default:f.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(y.MoveToPraiseroom)}}},function(e,r){!function(e){e[e.Inactive=0]="Inactive",e[e.Establishing=1]="Establishing",e[e.Praising=2]="Praising",e[e.PreparingReset=3]="PreparingReset",e[e.Reestablishing=4]="Reestablishing",e[e.PreparingHibernate=5]="PreparingHibernate",e[e.Hiberate=6]="Hiberate",e[e.Abandon=7]="Abandon"}(r.PraiseStatus||(r.PraiseStatus={}))
r.PraiseStatus},function(e,r,o){function t(e){if(e.carry.energy<e.carryCapacity&&e.room.name===e.memory.homeroom&&void 0!==e.room.terminal&&void 0!==e.room.storage){var r=e.room.storage
e.room.storage.store[RESOURCE_ENERGY]<1e4&&(r=e.room.terminal),e.pos.getRangeTo(r.pos)>1?e.moveTo(r):e.withdraw(r,RESOURCE_ENERGY)}else e.setState(y.MoveToPraiseroom),n(e)}function n(e){var r=e.memory.target
r!==e.room.name||v.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r):(e.setState(y.DecideWhereToPutEnergy),a(e))}function a(e){return void 0!==e.room.terminal&&e.room.terminal.isActive()?(e.memory.structureid=e.room.terminal.id,e.setState(y.TransferEnergyToStructure),void i(e)):void 0!==e.room.storage&&e.room.storage.isActive()?(e.memory.structureid=e.room.storage.id,e.setState(y.TransferEnergyToStructure),void i(e)):(e.setState(y.GiveEnergyToCreep),void s(e))}function i(e){if(0===e.carry.energy)return u(e)?(e.setState(y.MoveToHomeroom),void l(e)):void e.suicide()
var r=Game.getObjectById(e.memory.structureid)
if(null===r)return e.setState(y.DecideWhereToPutEnergy),void a(e)
var o=e.pos.getRangeTo(r.pos)
o>3?e.travelTo(r):o>1?e.moveTo(r):e.transfer(r,RESOURCE_ENERGY)}function s(e){if(0===e.carry.energy)return u(e)?(e.setState(y.MoveToHomeroom),void l(e)):void e.suicide()
var r=Game.getObjectById(e.memory.praiser)
if(null===r||r.carry.energy===r.carryCapacity)return e.memory.praiser=void 0,void m(e)
e.pos.getRangeTo(r.pos)>1?e.moveTo(r):(e.transfer(r,RESOURCE_ENERGY),e.memory.praiser=void 0)}function l(e){var r=e.memory.homeroom
r!==e.room.name?e.travelToRoom(r):(e.setState(y.TankUpInHomeroom),t(e))}function m(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return e.memory.role===d.Role.Praiser&&e.carry.energy<e.carryCapacity/2}})
if(r.length>0){var o=e.pos.findClosestByRange(r)
e.memory.praiser=o.id}}function u(e){var r=Game.rooms[e.memory.homeroom]
if(void 0==r||void 0===r.terminal)return!0
var o=c.getDistanseBetween(e.pos,r.terminal.pos)
return e.ticksToLive>2.1*o}var y,v=o(45),c=o(3),d=o(16),f=o(7)
!function(e){e[e.TankUpInHomeroom=1]="TankUpInHomeroom",e[e.MoveToPraiseroom=2]="MoveToPraiseroom",e[e.DecideWhereToPutEnergy=3]="DecideWhereToPutEnergy",e[e.MoveToHomeroom=4]="MoveToHomeroom",e[e.TransferEnergyToStructure=5]="TransferEnergyToStructure",e[e.GiveEnergyToCreep=6]="GiveEnergyToCreep"}(y||(y={})),r.run=function(e){switch(e.hasState()||e.setState(y.TankUpInHomeroom),e.getState()){case y.TankUpInHomeroom:t(e)
break
case y.MoveToPraiseroom:n(e)
break
case y.DecideWhereToPutEnergy:a(e)
break
case y.TransferEnergyToStructure:i(e)
break
case y.GiveEnergyToCreep:s(e)
break
case y.MoveToHomeroom:l(e)
break
default:f.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(y.MoveToHomeroom)}}},function(e,r,o){function t(e){var r=e.memory.target
r!==e.room.name||v.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r):(e.setState(y.MoveToPosition),n(e))}function n(e){var r=Game.rooms[e.memory.target]
if(void 0===r||r.name!==e.room.name||v.positionIsBorderOrNextToBorder(e.pos))e.setState(y.MoveToPraiseroom)
else if(void 0!==r.storage){var o=new RoomPosition(r.storage.pos.x-1,r.storage.pos.y+1,r.name)
e.pos.getRangeTo(o)>0?e.moveTo(o):e.setState(y.EnergyDistribution)}}function a(e){var r=e.room.getSpawn()
if(void 0===e.room.storage&&void 0===e.room.terminal||void 0===r)c.log.error("Storage, spawn or terminal missing in praiseroom",e.room.name)
else{if(Game.time%66==33&&void 0!==u(e.room)&&void 0!==e.room.terminal&&e.room.terminal.isActive()&&e.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]>0)return e.carry[RESOURCE_ENERGY]>0&&e.transfer(e.room.terminal,RESOURCE_ENERGY),void e.setState(y.SupplyLab)
if(Game.time%66==0&&void 0!==e.room.terminal&&void 0!==m(e.room))return e.carry[RESOURCE_ENERGY]<e.carryCapacity&&e.room.terminal.store[RESOURCE_ENERGY]>0&&e.withdraw(e.room.terminal,RESOURCE_ENERGY),void e.setState(y.SupplyTowers)
if(e.carry[RESOURCE_ENERGY]>0)if(Game.time%30==0&&void 0!==e.room.storage){var o=l(e.room.storage.pos)
void 0!==o&&o.energy<o.energyCapacity&&o.isActive()&&e.transfer(o,RESOURCE_ENERGY)}else r.energy<r.energyCapacity/2?e.transfer(r,RESOURCE_ENERGY):void 0!==e.room.storage&&void 0!==e.room.terminal&&e.room.storage.store[RESOURCE_ENERGY]<e.room.storage.storeCapacity-e.carryCapacity&&e.room.terminal.store[RESOURCE_ENERGY]>5e4&&e.transfer(e.room.storage,RESOURCE_ENERGY)
else void 0!==e.room.terminal&&e.carry[RESOURCE_ENERGY]<e.carryCapacity&&e.room.terminal.store[RESOURCE_ENERGY]>0?e.withdraw(e.room.terminal,RESOURCE_ENERGY):void 0!==e.room.storage&&(void 0===e.room.terminal||0===e.room.terminal.store[RESOURCE_ENERGY])&&e.carry[RESOURCE_ENERGY]<e.carryCapacity&&e.room.storage.store[RESOURCE_ENERGY]>0&&e.withdraw(e.room.storage,RESOURCE_ENERGY)}}function i(e){if(void 0!==e.room.terminal&&void 0!==e.room.storage){var r=l(e.room.storage.pos)
void 0!==r?e.carry[RESOURCE_ENERGY]>0?e.transfer(e.room.storage,RESOURCE_ENERGY):r.mineralAmount<r.mineralCapacity&&e.room.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID]>r.mineralCapacity-r.mineralAmount?e.carry[RESOURCE_CATALYZED_GHODIUM_ACID]>0?e.transfer(r,RESOURCE_CATALYZED_GHODIUM_ACID):e.withdraw(e.room.terminal,RESOURCE_CATALYZED_GHODIUM_ACID):(e.carry[RESOURCE_CATALYZED_GHODIUM_ACID]>0&&e.transfer(e.room.terminal,RESOURCE_CATALYZED_GHODIUM_ACID),e.setState(y.EnergyDistribution)):e.setState(y.EnergyDistribution)}else e.setState(y.EnergyDistribution)}function s(e){if(0!==e.carry[RESOURCE_ENERGY]){var r=m(e.room)
void 0!==r?e.pos.getRangeTo(r)>1?e.moveTo(r):e.transfer(r,RESOURCE_ENERGY):e.setState(y.MoveToPosition)}else e.setState(y.MoveToPosition)}function l(e){var r=new RoomPosition(e.x,e.y+2,e.roomName).lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_LAB)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}function m(e){var r=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER&&e.energy<e.energyCapacity/1.2}})
if(r.length>0)return r[0]}function u(e){if(void 0!==e.terminal&&void 0!==e.storage){var r=l(e.storage.pos)
return void 0!==r&&r.mineralAmount<r.mineralCapacity?r:void 0}}var y,v=o(45),c=o(7)
!function(e){e[e.MoveToPraiseroom=1]="MoveToPraiseroom",e[e.MoveToPosition=2]="MoveToPosition",e[e.EnergyDistribution=3]="EnergyDistribution",e[e.SupplyTowers=4]="SupplyTowers",e[e.SupplyLab=5]="SupplyLab"}(y||(y={})),r.run=function(e){switch(e.hasState()||e.setState(y.MoveToPraiseroom),e.getState()){case y.MoveToPraiseroom:t(e)
break
case y.MoveToPosition:n(e)
break
case y.EnergyDistribution:a(e)
break
case y.SupplyTowers:s(e)
break
case y.SupplyLab:i(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(y.MoveToPraiseroom)}}},function(e,r,o){function t(){var e=!0,r=!1,o=void 0
try{for(var t,n=Memory.commandOrders[Symbol.iterator]();!(e=(t=n.next()).done);e=!0){var a=t.value
if(f.commandOrderIsValid(a))switch(a.role){case R.Role.TeamWrecker:g.orderTeamWrecker(Game.rooms[a.room],a.tier,a.route,a.targets,3)
break
case R.Role.Wrecker:g.orderWrecker(Game.rooms[a.room],a.route)
break
case R.Role.Drainer:g.orderDrainer(Game.rooms[a.room],a.tier,a.route)
break
case R.Role.EliteDrainer:g.orderEliteDrainer(Game.rooms[a.room],a.route)
break
case R.Role.Paladin:g.orderPaladin(Game.rooms[a.room],a.route)
break
case R.Role.Tagger:g.orderTagger(Game.rooms[a.room],a.target)
break
case R.Role.Declarer:g.orderDeclarer(Game.rooms[a.room],a.route)
break
default:p.log.error("Invalid CommandOrder: "+JSON.stringify(a),a.room)}else p.log.error("Invalid CommandOrder: "+JSON.stringify(a),a.room)}}catch(e){r=!0,o=e}finally{try{!e&&n.return&&n.return()}finally{if(r)throw o}}Memory.commandOrders=void 0}var n=o(14),a=o(98),i=o(99),s=o(100),l=o(101),m=o(102),u=o(103),y=o(104),v=o(105),c=o(107),d=o(108),f=o(109),g=o(110),R=o(16),p=o(7),h=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MilitaryManager"))
return t.roomService=e,t.creepService=o,t}return _inherits(r,n.Manager),_createClass(r,[{key:"run",value:function(e){e===n.ManagerPriority.Critical?(this.creepService.runCreeps(R.Role.TeamWrecker,i.run),this.creepService.runCreeps(R.Role.TeamHealer,a.run),this.creepService.runCreeps(R.Role.Wrecker,s.run),this.creepService.runCreeps(R.Role.Paladin,u.run),this.creepService.runCreeps(R.Role.Ranger,y.run),this.creepService.runCreeps(R.Role.Drainer,l.run),this.creepService.runCreeps(R.Role.EliteDrainer,l.run),void 0!==Memory.commandOrders&&Memory.commandOrders.length>0&&t()):e===n.ManagerPriority.Standard?this.creepService.runCreeps(R.Role.Harasser,m.run):e===n.ManagerPriority.Trivial&&(this.creepService.runCreeps(R.Role.Signer,v.run),this.creepService.runCreeps(R.Role.Declarer,d.run),this.creepService.runCreeps(R.Role.Tagger,c.run))}}]),r}()
r.MilitaryManager=h},function(e,r,o){function t(e){var r=m(e)
r instanceof Creep?(e.memory.teammate=r.id,r.memory.healer=e.id,e.setState(y.Moving),n(e)):(a(e),v.moveOffRoad(e))}function n(e){var r=l(e)
if(r instanceof Creep){var o=e.pos.getRangeTo(r.pos)
s(e,r,o),i(e,r,o)}else d.log.error("TeamHealer "+e.name+" seems to have lost it's teammate.",e.room.name),e.memory.teammate=void 0,e.setState(y.Waiting)}function a(e){e.hits<e.hitsMax&&e.heal(e)}function i(e,r,o){o>3?e.heal(e):u(e)>u(r)?e.heal(e):o>1?e.rangedHeal(r):e.heal(r)}function s(e,r,o){!0!==e.memory.doNotMove?o>1?e.moveTo(r):0===r.fatigue&&e.moveTo(r.pos,{ignoreCreeps:!0}):e.memory.doNotMove=void 0}function l(e){return Game.getObjectById(e.memory.teammate)}function m(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return(e.memory.role===c.Role.TeamWrecker||e.memory.role===c.Role.TeamWarrior)&&void 0===e.memory.healer}})
return r.length>0?r[0]:null}function u(e){return e.hitsMax-e.hits}var y,v=o(33),c=o(16),d=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.Moving=2]="Moving"}(y||(y={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(y.Waiting),e.getState()){case y.Waiting:t(e)
break
case y.Moving:n(e)
break
default:d.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(y.Waiting)}}},function(e,r,o){function t(e){v(e)instanceof Creep?e.setState(S.MoveToStartPosition):T.moveOffRoad(e)}function n(e){var r=e.memory.target
if(void 0!==r||void 0!==(r=E(e))){var o=v(e)
null!==o&&Game.map.getRoomLinearDistance(o.pos.roomName,e.room.name)>5&&g(e),null!==o&&u(e,o)||(r!==e.room.name?l(e)||M.travelByRoute(e,{allowSK:!0}):(e.setState(S.MovingToTarget),a(e)))}else b.log.error("TeamWrecker "+e.name+" has no target room.",e.room.name)}function a(e){var r=v(e),o=e.memory.target
void 0!==o||void 0!==(o=E(e))?r instanceof Creep&&u(e,r)||(o===e.room.name?(e.setState(S.Wrecking),i(e)):l(e)||e.travelToRoom(o,{allowSK:!0})):e.setState(S.Guarding)}function i(e){var r=e.memory.target
if(e.room.name===r||void 0===r){var o=m(e)
if(null!==o)d(e,o)
else if(null!==(o=c(e)))e.memory.targetToDismantle=o.id,d(e,o)
else{var t=E(e)
b.log.info("TeamWrecker "+e.name+" is moving to a new target room: "+t,e.room.name),e.setState(S.MovingToTarget),a(e)}}else e.setState(S.MovingToTarget)}function s(e){var r=m(e)
null!==r?d(e,r):null!==(r=c(e))&&(e.memory.targetToDismantle=r.id,d(e,r))}function l(e){if(void 0!==e.memory._travel&&void 0!==e.memory._travel.stuck&&1===e.memory._travel.stuck&&void 0!==e.memory._travel.path&&e.memory._travel.path.length>0){var r=O.positionAtDirection(e.pos,e.memory._travel.path.substr(0,1))
if(void 0!==r&&1===e.pos.getRangeTo(r)){var o=r.lookFor(LOOK_STRUCTURES),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(l.structureType===STRUCTURE_WALL||l.structureType===STRUCTURE_RAMPART&&!l.my)return e.dismantle(l),!0}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}}return!1}function m(e){var r=Game.getObjectById(e.memory.targetToDismantle)
return r instanceof Structure?r:null}function u(e,r){return r.fatigue>0||!(e.pos.inRangeTo(r.pos,1)||O.positionIsBorderOrNextToBorder(e.pos)||O.positionHasPortal(e.pos))}function y(e){var r=C.findHostileCreepsInRangedRange(e.pos),o=_.filter(r,function(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_RAMPART)return!1}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!0})
if(o.length>0)e.rangedAttack(o[0])
else{var t=Game.getObjectById(e.memory.targetToDismantle)
t instanceof Structure&&e.pos.getRangeTo(t)<4&&e.rangedAttack(t)}}function v(e){return Game.getObjectById(e.memory.healer)}function c(e){var r=!0===e.memory.pillage,o=C.findHostileVitalStructures(e.room,r),t=C.filterStructuresOnBigRamparts(o)
if(t.length>0)return e.pos.findClosestByRange(t)
var n=_.filter(C.findHostileStructures(e.room),function(e){return e.structureType!==STRUCTURE_LINK&&e.structureType!==STRUCTURE_EXTRACTOR})
r&&(n=C.filterPillageableStructuresFromList(n))
var a=_.filter(C.filterStructuresOnBigRamparts(n),function(e){return e.structureType!==STRUCTURE_LINK&&e.structureType!==STRUCTURE_EXTRACTOR})
return a.length>0?e.pos.findClosestByRange(a):o.length>0?e.pos.findClosestByRange(o):n.length>0?e.pos.findClosestByRange(a):null}function d(e,r){var o=!0,t=v(e)
null!==t&&e.pos.getRangeTo(t)>1&&!O.positionIsBorderOrNextToBorder(e.pos)&&(o=!1)
var n=e.pos.getRangeTo(r)
1===n&&(e.dismantle(r),O.positionNextToBorder(e.pos)&&f(e)),n>1&&o&&e.moveTo(r)===ERR_NO_PATH&&p(e,r)}function f(e){var r=v(e)
if(r instanceof Creep&&O.positionIsBorder(r.pos)&&1===r.pos.getRangeTo(e.pos)){r.memory.doNotMove=!0
var o=R(r.pos.getDirectionTo(e.pos))
r.move(o)}}function g(e){var r=v(e)
if(r instanceof Creep){var o=r.pos.findClosestByRange(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_PORTAL}})
void 0!==o&&(r.moveTo(o),r.memory.doNotMove=!0)}}function R(e){var r=1
return Math.random()<.5&&(r=-1),(e-1+r)%8+1}function p(e,r){var o=PathFinder.search(e.pos,{pos:r.pos,range:1},{maxRooms:1,roomCallback:h}).path,t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value.lookFor(LOOK_STRUCTURES)
if(l.length>0){var m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(d.structureType===STRUCTURE_WALL||d.structureType===STRUCTURE_RAMPART)return b.log.info("TeamWrecker needs to destroy "+d.structureType+" at "+d.pos+" to get to a building.",e.room.name),void(e.memory.targetToDismantle=d.id)}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}b.log.error("Found no walls/ramparts to destroy to get to an interesting target.",e.room.name)}function h(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART||o.set(e.pos.x,e.pos.y,Math.min(250,e.hits/1e5))}),o}function E(e){return void 0!==e.memory.targets&&e.memory.targets.length>0?e.memory.target=e.memory.targets.shift():e.memory.target=void 0,e.memory.target}var S,T=o(33),C=o(55),O=o(45),M=o(43),b=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToTarget=2]="MovingToTarget",e[e.Wrecking=3]="Wrecking",e[e.MoveToStartPosition=4]="MoveToStartPosition",e[e.Guarding=5]="Guarding"}(S||(S={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(S.Waiting),y(e),e.getState()){case S.Waiting:t(e)
break
case S.MovingToTarget:a(e)
break
case S.MoveToStartPosition:n(e)
break
case S.Wrecking:i(e)
break
case S.Guarding:s(e)
break
default:b.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(S.Waiting)}}},function(e,r,o){function t(e){var r=e.memory.target
void 0!==r||void 0!==(r=u(e))?r!==e.room.name||c.positionIsBorder(e.pos)?e.travelToRoom(r,{allowSK:!0,ignoreRoads:!0}):(e.setState(y.Wrecking),n(e)):d.log.error("Wrecker "+e.name+" has no target room.",e.room.name)}function n(e){var r=a(e)
if(null!==r)s(e,r)
else if(null!==(r=i(e)))e.memory.targetToDismantle=r.id,s(e,r)
else{var o=u(e)
d.log.info("Wrecker "+e.name+" is moving to a new target room: "+o,e.room.name),e.setState(y.MovingToTarget)}}function a(e){var r=Game.getObjectById(e.memory.targetToDismantle)
return r instanceof Structure?r:null}function i(e){var r=v.findHostileVitalStructures(e.room),o=v.filterStructuresOnBigRamparts(r)
if(o.length>0)return e.pos.findClosestByRange(o)
var t=v.findHostileStructures(e.room),n=v.filterStructuresOnBigRamparts(t)
return n.length>0?e.pos.findClosestByRange(n):r.length>0?e.pos.findClosestByRange(r):t.length>0?e.pos.findClosestByRange(n):null}function s(e,r){var o=v.findClosestHostileCreepsInRoom(e.pos),t=!0
o&&e.pos.getRangeTo(o.pos)<3&&(t=Game.time%2==0),e.dismantle(r)===ERR_NOT_IN_RANGE&&t&&e.moveTo(r)===ERR_NO_PATH&&l(e,r)}function l(e,r){var o=PathFinder.search(e.pos,{pos:r.pos,range:1},{maxRooms:1,roomCallback:m}).path,t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value.lookFor(LOOK_STRUCTURES)
if(l.length>0){var u=!0,y=!1,v=void 0
try{for(var c,f=l[Symbol.iterator]();!(u=(c=f.next()).done);u=!0){var g=c.value
if(g.structureType===STRUCTURE_WALL||g.structureType===STRUCTURE_RAMPART)return d.log.info("Wrecker needs to destroy "+g.structureType+" at "+g.pos+" to get to a building.",e.room.name),void(e.memory.targetToDismantle=g.id)}}catch(e){y=!0,v=e}finally{try{!u&&f.return&&f.return()}finally{if(y)throw v}}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}d.log.error("Found no walls/ramparts to destroy to get to an interesting target.",e.room.name)}function m(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART||o.set(e.pos.x,e.pos.y,Math.min(250,e.hits/2e4))}),o}function u(e){return void 0!==e.memory.route&&e.memory.route.length>0&&(e.memory.target=e.memory.route.shift()),e.memory.target}var y,v=o(55),c=o(45),d=o(7)
!function(e){e[e.MovingToTarget=1]="MovingToTarget",e[e.Wrecking=2]="Wrecking"}(y||(y={})),r.run=function(e){switch(e.hasState()||e.setState(y.MovingToTarget),e.getState()){case y.MovingToTarget:t(e)
break
case y.Wrecking:n(e)
break
default:d.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(y.MovingToTarget)}}},function(e,r,o){function t(e){e.heal(e)}function n(e){if(e.heal(e),i(e)){var r=s(e)
e.pos.getRangeTo(r)>0?e.travelTo({pos:r}):e.setState(y.Draining)}else e.memory.target=void 0,e.memory.drainPosition=void 0,e.setState(y.MovingToTarget),a(e)}function a(e){var r=e.memory.target
void 0===r&&void 0===(r=l(e))||(r===e.room.name?(e.setState(y.MovingToDrainingPosition),n(e)):e.travelToRoom(r,{allowSK:!0,ignoreRoads:!0}))}function i(e){return e.room.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER}}).length>0}function s(e){var r=e.room.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_TOWER}}),o=e.room.find(FIND_EXIT),t=[],n=void 0,a=1e3,i=!0,s=!1,l=void 0
try{for(var m,u=o[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value,v=0,c=!0,d=!1,f=void 0
try{for(var g,R=r[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value,h=y.getRangeTo(p)
v+=Math.max(0,20-h)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}(void 0===n||v<a)&&(n=y,a=v),0===v&&t.push(y)}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}if(t.length>0){var E=t[0],S=e.pos.getRangeTo(t[0]),T=!0,C=!1,O=void 0
try{for(var M,_=t[Symbol.iterator]();!(T=(M=_.next()).done);T=!0){var b=M.value,w=e.pos.getRangeTo(b)
w<S&&(E=b,S=w)}}catch(e){C=!0,O=e}finally{try{!T&&_.return&&_.return()}finally{if(C)throw O}}return console.log("Moving to pos: "+E),E}return void 0!==n?(console.log("Moving to pos (not great): "+n),n):(console.log("Staying here (bad): "+e.pos),e.pos)}function l(e){return void 0!==e.memory.route&&e.memory.route.length>0?e.memory.target=e.memory.route.shift():e.memory.target=void 0,e.memory.target}function m(e){(e.hits<e.hitsMax||e.getState()===y.MovingToTarget)&&e.heal(e)}function u(e){var r=v.findHostileCreepsInRangedRange(e.pos),o=_.filter(r,function(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.structureType===STRUCTURE_RAMPART)return!1}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return!0})
if(o.length>0)e.rangedAttack(o[0])
else{var t=Game.getObjectById(e.memory.targetToDismantle)
t instanceof Structure&&e.pos.getRangeTo(t)<4&&e.rangedAttack(t)}}var y,v=o(55),c=o(7),d=o(16)
!function(e){e[e.MovingToTarget=1]="MovingToTarget",e[e.MovingToDrainingPosition=2]="MovingToDrainingPosition",e[e.Draining=3]="Draining"}(y||(y={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),m(e),e.memory.role===d.Role.EliteDrainer&&u(e),e.hasState()||e.setState(y.MovingToTarget),e.getState()){case y.MovingToTarget:a(e)
break
case y.MovingToDrainingPosition:n(e)
break
case y.Draining:t(e)
break
default:c.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(y.MovingToTarget)}}},function(e,r,o){function t(e){e.setState(f.MovingToTarget)}function n(e){Game.time%9==0&&e.setState(f.Attacking)}function a(e){if(Game.time%9==4&&!h.positionIsBorderOrNextToBorder(e.pos)&&s(e))return e.setState(f.Attacking),void i(e)
var r=e.memory.target
void 0!==r||void 0!==(r=c(e))?r!==e.room.name||h.positionIsBorder(e.pos)?e.travelToRoom(r,{allowSK:!1,ignoreRoads:!0,allowHostile:!1}):e.setState(f.Attacking):T.log.error("Harasser "+e.name+" has no target room.",e.room.name)}function i(e){if(Game.time%9!=0||h.positionIsBorderOrNextToBorder(e.pos)||s(e)){var r=l(e)
if(Game.time%18!=0&&null!==r||(r=m(e)),null!==r)if(e.memory.targetToAttack=r.id,r instanceof Creep){var o=3
0===r.getActiveBodyparts(ATTACK)&&(o=1),p.kiteAndAttack(e,r,o)||p.rangedAttackToEnemiesAround(e)}else u(e,r)
else{var t=c(e)
void 0!==t&&t!==e.pos.roomName?(T.log.info("Ranger "+e.name+" is moving to a new target room: "+t,e.room.name),e.setState(f.MovingToTarget)):e.setState(f.Sleep)}}else{var n=c(e)
void 0!==n&&n!==e.pos.roomName?(T.log.info("Ranger "+e.name+" is moving to a new target room: "+n,e.room.name),e.setState(f.MovingToTarget),a(e)):e.setState(f.Sleep)}}function s(e){var r=R.findHostileCreepsInRoom(e.room,!1)
if(0===r.length)return!1
var o=E.getStatsForCreep(e),t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(E.getStatsForCreep(l).rpt>o.hpt)return!1}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return!0}function l(e){var r=Game.getObjectById(e.memory.targetToAttack)
return null!==r?r:null}function m(e){var r=R.findHostileCreepsInRoom(e.room,!1)
if(r.length>0){var o=E.getStatsForCreep(e),t=[],n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.getActiveBodyparts(ATTACK)>0||m.getActiveBodyparts(RANGED_ATTACK)>0||m.getActiveBodyparts(HEAL)>0){if(E.getStatsForCreep(m).rpt>o.hpt)return null
t.push(m)}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t.length>0?e.pos.findClosestByRange(t):e.pos.findClosestByRange(r)}var u=R.findHostileVitalStructures(e.room),y=R.filterStructuresOnBigRamparts(u)
if(y.length>0)return e.pos.findClosestByRange(y)
var v=R.findHostileStructures(e.room),c=R.filterStructuresOnBigRamparts(v)
return c.length>0?e.pos.findClosestByRange(c):u.length>0?e.pos.findClosestByRange(u):v.length>0?e.pos.findClosestByRange(c):null}function u(e,r){var o=e.pos.getRangeTo(r)
1===o&&e.rangedAttack(r),o>1&&e.moveTo(r)===ERR_NO_PATH&&y(e,r)}function y(e,r){var o=PathFinder.search(e.pos,{pos:r.pos,range:1},{maxRooms:1,roomCallback:v}).path,t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value.lookFor(LOOK_STRUCTURES)
if(l.length>0){var m=!0,u=!1,y=void 0
try{for(var c,d=l[Symbol.iterator]();!(m=(c=d.next()).done);m=!0){var f=c.value
if(f.structureType===STRUCTURE_WALL||f.structureType===STRUCTURE_RAMPART)return T.log.info("Harasser needs to destroy "+f.structureType+" at "+f.pos+" to get to a building.",e.room.name),void(e.memory.targetToAttack=f.id)}}catch(e){u=!0,y=e}finally{try{!m&&d.return&&d.return()}finally{if(u)throw y}}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}T.log.error("Found no walls/ramparts to destroy to get to an interesting target.",e.room.name)}function v(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART||o.set(e.pos.x,e.pos.y,Math.min(250,e.hits/1e3))}),o}function c(e){var r=_.filter(g.getRoomsOneAway(e.room.name),function(e){return!S.isOwned(e)})
if(0!==r.length)return e.memory.target=_.sample(r),e.memory.target}function d(e){e.hits<e.hitsMax&&e.getActiveBodyparts(HEAL)>0&&e.heal(e)}var f,g=o(46),R=o(55),p=o(54),h=o(45),E=o(62),S=o(5),T=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToTarget=2]="MovingToTarget",e[e.Attacking=3]="Attacking",e[e.Sleep=4]="Sleep"}(f||(f={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(f.Waiting),d(e),e.getState()){case f.Waiting:t(e)
break
case f.MovingToTarget:a(e)
break
case f.Attacking:i(e)
break
case f.Sleep:n(e)
break
default:T.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(f.Waiting)}}},function(e,r,o){function t(e){e.setState(d.MovingToTarget)}function n(e){Game.time%9==0&&e.setState(d.Attacking)}function a(e){var r=e.memory.target
void 0!==r||void 0!==(r=v(e))?r!==e.room.name||g.positionIsBorder(e.pos)?e.travelToRoom(r,{allowSK:!0,ignoreRoads:!0}):e.setState(d.Attacking):R.log.error("Paladin "+e.name+" has no target room.",e.room.name)}function i(e){var r=s(e)
if(Game.time%13==0&&null!==(r=l(e))&&(e.memory.targetToAttack=r.id),null!==r)m(e,r)
else if(null!==(r=l(e)))e.memory.targetToAttack=r.id,m(e,r)
else{var o=v(e)
void 0!==o&&o!==e.pos.roomName?(R.log.info("Paladin "+e.name+" is moving to a new target room: "+o,e.room.name),e.setState(d.MovingToTarget)):e.setState(d.Sleep)}}function s(e){var r=Game.getObjectById(e.memory.targetToAttack)
return null!==r?r:null}function l(e){var r=f.findHostileCreepsInRoom(e.room)
if(r.length>0){var o=[],t=[],n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
m.getActiveBodyparts(CLAIM)>0&&t.push(m),(m.getActiveBodyparts(ATTACK)>0||m.getActiveBodyparts(RANGED_ATTACK)>0||m.getActiveBodyparts(HEAL)>0)&&o.push(m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o.length>0?e.pos.findClosestByRange(o):t.length>0?e.pos.findClosestByRange(t):e.pos.findClosestByRange(r)}var u=f.findHostileVitalStructures(e.room),y=f.filterStructuresOnBigRamparts(u)
if(y.length>0)return e.pos.findClosestByRange(y)
var v=f.findHostileStructures(e.room),c=f.filterStructuresOnBigRamparts(v)
return c.length>0?e.pos.findClosestByRange(c):u.length>0?e.pos.findClosestByRange(u):v.length>0?e.pos.findClosestByRange(c):null}function m(e,r){var o=e.pos.getRangeTo(r)
1===o&&(e.attack(r),e.moveTo(r,{ignoreCreeps:!0,maxRooms:1})),o>1&&e.moveTo(r,{maxRooms:1})===ERR_NO_PATH&&u(e,r)}function u(e,r){var o=PathFinder.search(e.pos,{pos:r.pos,range:1},{maxRooms:1,roomCallback:y}).path,t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value.lookFor(LOOK_STRUCTURES)
if(l.length>0){var m=!0,u=!1,v=void 0
try{for(var c,d=l[Symbol.iterator]();!(m=(c=d.next()).done);m=!0){var f=c.value
if(f.structureType===STRUCTURE_WALL||f.structureType===STRUCTURE_RAMPART)return R.log.info("Paladin needs to destroy "+f.structureType+" at "+f.pos+" to get to a building.",e.room.name),void(e.memory.targetToAttack=f.id)}}catch(e){u=!0,v=e}finally{try{!m&&d.return&&d.return()}finally{if(u)throw v}}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}R.log.error("Found no walls/ramparts to destroy to get to an interesting target.",e.room.name)}function y(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART||o.set(e.pos.x,e.pos.y,Math.min(250,e.hits/1e3))}),o}function v(e){return void 0!==e.memory.route&&e.memory.route.length>0&&(e.memory.target=e.memory.route.shift()),e.memory.target}function c(e){e.hits<e.hitsMax&&e.getActiveBodyparts(HEAL)>0&&e.heal(e)}var d,f=o(55),g=o(45),R=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToTarget=2]="MovingToTarget",e[e.Attacking=3]="Attacking",e[e.Sleep=4]="Sleep"}(d||(d={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(d.Waiting),c(e),e.getState()){case d.Waiting:t(e)
break
case d.MovingToTarget:a(e)
break
case d.Attacking:i(e)
break
case d.Sleep:n(e)
break
default:R.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(d.Waiting)}}},function(e,r,o){function t(e){e.setState(d.MovingToTarget)}function n(e){Game.time%9==0&&e.setState(d.Attacking)}function a(e){var r=e.memory.target
void 0!==r||void 0!==(r=v(e))?r!==e.room.name||R.positionIsBorder(e.pos)?e.travelToRoom(r,{allowSK:!0,ignoreRoads:!0}):e.setState(d.Attacking):p.log.error("Ranger "+e.name+" has no target room.",e.room.name)}function i(e){var r=s(e)
if(Game.time%13==0&&null!==(r=l(e))&&(e.memory.targetToAttack=r.id),null===r&&(r=l(e)),null!==r)if(e.memory.targetToAttack=r.id,r instanceof Creep){var o=3
0===r.getActiveBodyparts(ATTACK)&&(o=1),g.kiteAndAttack(e,r,o)}else m(e,r)
else{var t=v(e)
void 0!==t&&t!==e.pos.roomName?(p.log.info("Ranger "+e.name+" is moving to a new target room: "+t,e.room.name),e.setState(d.MovingToTarget)):e.setState(d.Sleep)}}function s(e){var r=Game.getObjectById(e.memory.targetToAttack)
return null!==r?r:null}function l(e){var r=f.findHostileCreepsInRoom(e.room)
if(r.length>0){var o=[],t=[],n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
m.getActiveBodyparts(CLAIM)>0&&t.push(m),(m.getActiveBodyparts(ATTACK)>0||m.getActiveBodyparts(RANGED_ATTACK)>0||m.getActiveBodyparts(HEAL)>0)&&o.push(m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o.length>0?e.pos.findClosestByRange(o):t.length>0?e.pos.findClosestByRange(t):e.pos.findClosestByRange(r)}var u=f.findHostileVitalStructures(e.room),y=f.filterStructuresOnBigRamparts(u)
if(y.length>0)return e.pos.findClosestByRange(y)
var v=f.findHostileStructures(e.room),c=f.filterStructuresOnBigRamparts(v)
return c.length>0?e.pos.findClosestByRange(c):u.length>0?e.pos.findClosestByRange(u):v.length>0?e.pos.findClosestByRange(c):null}function m(e,r){var o=e.pos.getRangeTo(r)
1===o&&e.attack(r),o>1&&e.moveTo(r)===ERR_NO_PATH&&u(e,r)}function u(e,r){var o=PathFinder.search(e.pos,{pos:r.pos,range:1},{maxRooms:1,roomCallback:y}).path,t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value.lookFor(LOOK_STRUCTURES)
if(l.length>0){var m=!0,u=!1,v=void 0
try{for(var c,d=l[Symbol.iterator]();!(m=(c=d.next()).done);m=!0){var f=c.value
if(f.structureType===STRUCTURE_WALL||f.structureType===STRUCTURE_RAMPART)return p.log.info("Paladin needs to destroy "+f.structureType+" at "+f.pos+" to get to a building.",e.room.name),void(e.memory.targetToAttack=f.id)}}catch(e){u=!0,v=e}finally{try{!m&&d.return&&d.return()}finally{if(u)throw v}}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}p.log.error("Found no walls/ramparts to destroy to get to an interesting target.",e.room.name)}function y(e){var r=Game.rooms[e]
if(!r)return new PathFinder.CostMatrix
var o=new PathFinder.CostMatrix
return r.find(FIND_STRUCTURES).forEach(function(e){e.structureType!==STRUCTURE_WALL&&e.structureType!==STRUCTURE_RAMPART||o.set(e.pos.x,e.pos.y,Math.min(250,e.hits/1e3))}),o}function v(e){return void 0!==e.memory.route&&e.memory.route.length>0&&(e.memory.target=e.memory.route.shift()),e.memory.target}function c(e){e.hits<e.hitsMax&&e.getActiveBodyparts(HEAL)>0&&e.heal(e)}var d,f=o(55),g=o(54),R=o(45),p=o(7)
!function(e){e[e.Waiting=1]="Waiting",e[e.MovingToTarget=2]="MovingToTarget",e[e.Attacking=3]="Attacking",e[e.Sleep=4]="Sleep"}(d||(d={})),r.run=function(e){switch(e.notifyWhenAttacked(!1),e.hasState()||e.setState(d.Waiting),c(e),e.getState()){case d.Waiting:t(e)
break
case d.MovingToTarget:a(e)
break
case d.Attacking:i(e)
break
case d.Sleep:n(e)
break
default:p.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(d.Waiting)}}},function(e,r,o){var t=o(47),n=o(106)
r.run=function(e){if(void 0===e.memory.target&&(e.memory.target=t.getSigningTarget(e.memory.homeroom),void 0===e.memory.target))return console.log("<span style='color:#FF4136'><a href='#!/room/"+e.room.name+"'>"+e.room.name+"</a> Signer has finished signing controllers and is dismantled.</span>"),void e.suicide()
var r=Game.rooms[e.memory.target]
if(r instanceof Room&&void 0!==r.controller){var o=r.controller
if(e.pos.roomName!==r.name||e.pos.getRangeTo(o)>1)e.travelTo(o)
else{var a=n.getRandomQuote(void 0!==e.room.controller&&e.room.controller.my)
e.signController(o,a),e.memory.target=void 0}}else e.memory.target=void 0}},function(e,r){r.getRandomQuote=function(e){return e?o:t[Math.floor(Math.random()*t.length)]}
var o="Operated by KasamiBot - https://kasami.github.io/kasamibot/",t=["Life is about increasing GCL, not mining minerals. -Kevin Kruse","Whatever the mind of creeps can conceive and believe, it can be programmed to. –Napoleon Hill","Strive not to be a success, but rather to get to the next GCL. –Albert Einscreep","I attribute my GCL to this: I never gave or took any excuse. –Florence Nightingale","You miss 100% of the shots you don’t take. –Source Keeper Guard","The most difficult thing is the decision to expand, the rest is merely tenacity. –Amelia Earhart","Every upgrade brings me closer to the next GCL level. –Babe Ruth","Definiteness of purpose is the starting point of all GCL. –W. Clement Stone","Life isn't about getting and having, it's about increasing GCL. –Kevin Kruse","Screeps code is what happens to you while you’re busy making other plans. –John Lennon","We become what we program. –Earl Nightingale","Life is 10% what happens to me and 90% of how I was programmed. –Charles Swindoll","The code is everything. What you write you become. –Buddha","An unexamined room is not worth scouting. –Socrates","Eighty percent of success is upgrading. –Woody Allen","Your time is limited to 1500 ticks, so don’t waste it living someone else’s life. –Steve Jobs","Winning isn’t everything, but wanting to win is, and programming. –Vince Lombardi","I am not a product of my circumstances. I am a product of my implementation. –Stephen Covey","Either you run the code, or the code runs you. –Jim Rohn","Whether you think you can or you think you can’t program screeps, you’re right. –Henry Ford","The best revenge is massive GCL. –Frank Sinatra","Life shrinks or expands in proportion to one's code. –Anais Nin","There is only one way to avoid criticism: do nothing, say nothing, and code nothing. –Aristotle","The only creep you are destined to become is the creep you where programmed to be. –Ralph Waldo Emerson","Confidently expanding in direction of your dreams. Live the 1500 ticks you have imagined. –Henry David Thoreau","Believe you can code and you’re halfway there. –Theodore Roosevelt","Everything you’ve ever wanted is on the other side of the map. –George Addair","Start where you are. Use what you have. Upgrade what you can. –Arthur Ashe","When I let go of what I am, I become what I might be coded to be. –Lao Tzu","Happiness is not something readymade. It comes from GCL. –Dalai Lama","Too many of us are not coding our dreams because we are coding our fears. –Les Brown","I didn’t fail at programming. I just found 100 ways to program it wrong. –Benjamin Franklin","There are no traffic jams along the sector highways. –Roger Staubach","It is never too late to program what you might have been. –George Eliot","I would rather die of programming than of boredom. –Vincent van Gogh","Build your own rooms, or someone else will hire you to build theirs. –Farrah Gray","Power proccessing costs energy. But then so does ignorance. –Sir Claus Moser","It does not matter how slowly you upgrade as long as you do not stop. –Confucius","Expand quickly and dare to fail. –Norman Vaughan","Do what you can, in your rooms, with what you have. –Teddy Roosevelt","Dreaming, after all, is a form of programming. –Gloria Steinem","The code is what we make it, always has been, always will be. –Grandma Moses","It’s not the GCL in your life that count. It’s the life in your GCL. –Abraham Lincoln","Change your code and you change your world. –Norman Vincent Peale","The only way to write a great AI is to love what you do. –Steve Jobs","If you can code it, you can achieve it. –Zig Ziglar","You can code anything, but not everything. -David Allen","CPU perfection is achieved, not when there is no more to add, but when there is no left to take away. -Antoine de Saint-Exupéry","You must be the change you wish to see in the sector. -Gandhi","To the man who only has a CLAIM, everything he encounters begins to look like a controller. -Abraham Maslow","The real voyage of discovery consists not in seeking new features but using new code. -Marcel Proust","Even if you’re on the right track, you’ll get run over if you just sit there without ramparts. - Will Rogers","I’d rather live with a good spagetti code than a bad operating system. -Aryeh Frimer","The cure for boredom is new features. There is no cure for featurehunger. -Ellen Parr","The trouble with the creep race is that even if you win, you’re still a creep. -Lily Tomlin","Only I can change my code. No one can do it for me. -Carol Burnett","Optimism is the faith that leads to GCL. Nothing can be done without hope and confidence. -Helen Keller","Our greatest weakness lies in giving up. The way to succeed is always to try more refactoring. -Thomas A. Edison","The pathfinding algorithm always seems impossible until it's done. -Nelson Mandela","Always do your best. What you reserve now, you will harvest later. -Og Mandino","With the new day comes new code and new refactoring. -Eleanor Roosevelt","The past code revisions cannot be changed. The future code is yet in your power. -Unknown","Boosted attackers will never overtake me if my determination to succeed is strong enough. -Og Mandino","Setting goals is the first step in turning the ideas into code. -Tony Robbins","You can't cross the highways merely by standing and staring at the portal room. -Rabindranath Tagore","Code quality is not an act, it is a habit. -Aristotle","If you can dream it, you can code it. -Disney","Accept the code challenges so that you can fell the exhilaration of victory. -George S. Patton","The secret of getting ahead is getting started with coding. -Mark Twain","Keep your eyes on the stars, your feet on the ground, and fingers on the keyboard. -Theodore Roosevelt","If you got wiped out yesterday, respawn today. -H. G. Wells","Either remove or be removed. -Ezra Pound","You are never too old to resettle or code another architecture. -Les Brown","Don't watch the creeps; do what they do. Keep upgrading. -Sam Levenson","When a room is important enough, you attack it even if the odds are not in your favor. -Elon Musk","Your GCL is Screeps's gift to you. What you do with it is your gift back to Screeps. -Leo Buscaglia","A creative man is motivated by the desire to code, and by the desire to beat others. -Ayn Rand","Upgrade the controller whenever possible. It is always possible. -Dalai Lama","Set your goals high, and don't stop coding till you get there. -Bo Jackson","If you want to conquer fear, don't sit home and think about it. Grab a bear and start coding. -Dale Carnegie","Well coded is better than well pseudocoded. -Benjamin Franklin","There is only one part of screeps you can be certain of improving, and that's your own code. -Aldous Huxley","Aim for the Source Keeper. If you miss, you may hit the portal. -W. Clement Stone","Screeps is the art of getting creeps to do what you want them to do because they want to do it. -Dwight D. Eisenhower","I'd rather attempt to write code great and fail than to copy code and succeed. -Robert H. Schuller","Things do not happend. Things are coded to happen. -John F. Kennedy","By failing to prepare for attacks, you are preparing to fail. -Benjamin Franklin","Do you want to know who you are? Don't ask. Code. The code will delineate and define you. -Thomas Jefferson","I am not afraid... I was coded to do this. -Joan of Arc","Good code violently executed now is better than perfect code executed next week. -George S. Patton","What you code today can improve all your tomorrows. -Ralph Marston","Code something wonderful, people may imitate it. -Albert Schweitzer","Opportunity does not knock, it presents itself when you invade the sector. -Kyle Chandler","The most effective way to code it, is to code it. -Amelia Earhart","If you don't like how things are, refactor. You're not an OCS-member. -Jim Rohn","The will to succeed is important, but what's more important is to upgrade. -Bobby Knight","The ultimate aim of the ego is not to read code, but to write code. -Muhammad Iqbal","There's a way to code it better - find it. -Thomas A. Edison","You just can't beat the person who never stops respawning. -Babe Ruth","Code as if what you do makes a difference. It does. -William James","Code your AI with your whole heart, and you will succeed - there's so little competition. -Elbert Hubbart","Go for it now. The sector is promised to no one. -Wayne Dyer","Change your code today. Don't gamble on the future, act now, without delay. -Simone de Beauvoir","It's always too early to quit upgrading. -Norman Vincent Peale","You can't build a reputation on what you are going to code. -Henry Ford","Small code snippets implemented are better than great features planned. -Peter Marshall","There is nothing deep down inside us except what we have coded ourselves. -Rickard Rorty","When one must code in the console, one can. -Charlotte Whitton","Get action. Seize the moment. Creeps was never intended to become a container. -Theodore Roosevelt","Begin to code now what you will be hereafter. -William James","Success in the only motivational factor that a screeps player with character needs. -Woody Hayes","There is progress whether ye are going forward or backward. The thing is to upgrade. -Edgar Cayce","I code, therefore I am. -Simone Weil"]},function(e,r,o){function t(e){e.carry.energy<e.carryCapacity&&e.room.name===e.memory.homeroom&&void 0!==e.room.storage?e.pos.getRangeTo(e.room.storage.pos)>1?e.moveTo(e.room.storage):e.withdraw(e.room.storage,RESOURCE_ENERGY):(e.setState(m.MovingToRoom),n(e))}function n(e){var r=e.memory.target
r!==e.room.name||u.positionIsBorderOrNextToBorder(e.pos)?e.travelToRoom(r):(e.setState(m.Upgrading),a(e))}function a(e){var r=Game.rooms[e.memory.target]
void 0!==r&&void 0!==r.controller&&r.controller.my&&r.controller.level<2?e.upgradeController(r.controller)===ERR_NOT_IN_RANGE&&e.travelTo(r.controller):(e.setState(m.Pacman),i(e))}function i(e){if(Game.flags.Pacman instanceof Flag){var r=Game.flags.Pacman.pos
void 0===e.memory.pacmanIndex&&(e.memory.pacmanIndex=0)
var o=[[0,6],[0,7],[0,8],[0,9],[0,10],[1,11],[1,12],[2,13],[3,14],[4,15],[5,14],[5,13],[6,12],[6,11],[7,10],[7,9],[8,8],[9,10],[9,9],[10,11],[10,12],[11,13],[11,14],[8,14],[9,14],[9,15],[9,16],[8,16],[8,18],[9,18],[9,19],[9,20],[8,20],[7,20],[7,19],[7,18],[7,16],[7,15],[7,14],[12,15],[13,14],[14,13],[15,12],[15,11],[16,10],[16,9],[16,8],[16,7],[16,6],[15,5],[15,4],[14,3],[13,2],[12,1],[11,1],[10,0],[9,0],[8,0],[7,0],[6,0],[5,1],[4,1],[3,2],[2,3],[1,4],[1,5]]
if(e.memory.pacmanIndex+1>o.length)return Game.flags.Pacman instanceof Flag&&Game.flags.Pacman.remove(),e.setState(m.Ayce),void s(e)
l(e,o,r,e.memory.pacmanIndex)}else e.setState(m.Ayce),s(e)}function s(e){if(!(Game.flags.Ayce instanceof Flag))return void 0!==e.room.controller&&e.room.controller.my&&2===e.room.controller.level&&e.room.controller.unclaim(),void e.suicide()
var r=Game.flags.Ayce.pos
void 0===e.memory.ayceIndex&&(e.memory.ayceIndex=0)
var o=[[0,1],[0,2],[0,5],[0,9],[0,12],[0,13],[0,17],[0,18],[0,19],[1,0],[1,3],[1,6],[1,8],[1,0],[1,11],[1,14],[1,16],[2,0],[2,3],[2,7],[2,11],[2,16],[2,17],[2,18],[3,0],[3,1],[3,2],[3,3],[3,7],[3,11],[3,14],[3,16],[4,0],[4,3],[4,7],[4,12],[4,13],[4,17],[4,18],[4,19]]
if(e.memory.ayceIndex+1>o.length)return Game.flags.Ayce instanceof Flag&&Game.flags.Ayce.remove(),void 0!==e.room.controller&&e.room.controller.my&&2===e.room.controller.level&&e.room.controller.unclaim(),void e.suicide()
l(e,o,r,e.memory.ayceIndex)}function l(e,r,o,t){var n=r[t],a=new RoomPosition(o.x+n[1],o.y+n[0],o.roomName),i=a.look(),s=!0,l=!1,u=void 0
try{for(var v,c=i[Symbol.iterator]();!(s=(v=c.next()).done);s=!0){var d=v.value
if(void 0!==d.constructionSite){var f=e.pos.getRangeTo(d.constructionSite)
return void(0===f?y.moveRandomDirection(e):f>3?e.moveTo(d.constructionSite):e.build(d.constructionSite))}if(void 0!==d.structure&&1===d.structure.hits)return void(e.pos.getRangeTo(d.structure)>3?e.moveTo(d.structure):e.repair(d.structure))
if(void 0!==d.structure)return void(e.getState()===m.Pacman?e.memory.pacmanIndex++:e.getState()===m.Ayce&&e.memory.ayceIndex++)
var g=a.createConstructionSite(STRUCTURE_WALL)
g!==OK?console.log(e.room.name+": Tagger got error when building construction site: "+g):e.pos.getRangeTo(a)>3&&e.moveTo(a)}}catch(e){l=!0,u=e}finally{try{!s&&c.return&&c.return()}finally{if(l)throw u}}}var m,u=o(45),y=o(33)
!function(e){e[e.TankUp=0]="TankUp",e[e.MovingToRoom=1]="MovingToRoom",e[e.Pacman=2]="Pacman",e[e.Ayce=3]="Ayce",e[e.Upgrading=4]="Upgrading"}(m||(m={})),r.run=function(e){switch(e.hasState()||e.setState(m.TankUp),e.getState()){case m.TankUp:t(e)
break
case m.MovingToRoom:n(e)
break
case m.Upgrading:a(e)
break
case m.Pacman:i(e)
break
case m.Ayce:s(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(m.TankUp)}}},function(e,r,o){function t(e){var r=e.memory.target
if(void 0===r&&void 0===(r=a(e)))return s.log.info("Declarer "+e.name+" has no target room, is being removed.",e.room.name),void e.suicide()
r===e.room.name?(e.setState(i.Declaring),n(e)):e.travelToRoom(r,{allowHostile:!1,allowSK:!1,ignoreRoads:!0})}function n(e){if(e.room.name===e.memory.target&&void 0!==e.room.controller){var r=e.room.controller
if(e.pos.roomName!==e.room.name||e.pos.getRangeTo(r)>1)e.travelTo(r)
else{e.signController(r,"This room is property of the AYCE alliance. Stay away from this and neighbouring rooms."),e.memory.target=void 0}}else e.memory.target=void 0,e.setState(i.MovingToTarget)}function a(e){return void 0!==e.memory.route&&e.memory.route.length>0?e.memory.target=e.memory.route.shift():e.memory.target=void 0,e.memory.target}var i,s=o(7)
!function(e){e[e.MovingToTarget=1]="MovingToTarget",e[e.Declaring=2]="Declaring"}(i||(i={})),r.run=function(e){switch(e.hasState()||e.setState(i.MovingToTarget),e.getState()){case i.MovingToTarget:t(e)
break
case i.Declaring:n(e)
break
default:s.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(i.MovingToTarget)}}},function(e,r){r.CommandOrder=function e(){_classCallCheck(this,e)},r.addCommandOrder=function(e){void 0===Memory.commandOrders&&(Memory.commandOrders=[]),Memory.commandOrders.push(e)},r.commandOrderIsValid=function(e){return Game.rooms[e.room]instanceof Room}},function(e,r,o){var t=o(19),n=o(18),a=o(16),i=o(17),s=o(20)
r.orderWrecker=function(e,r){var o=t.getMaxTierOffroadWorkOnly(e.energyCapacityAvailable),l=new s.Order
l.body=t.getOffroadWorkOnlyBody(o),l.priority=i.Priority.Standard,l.memory={role:a.Role.Wrecker,target:void 0,tier:o,route:r},n.orderCreep(e,l)},r.orderDrainer=function(e,r,o){var l=new s.Order
l.body=t.getDrainerBody(r),l.priority=i.Priority.Important,l.memory={role:a.Role.Drainer,target:void 0,tier:r,route:o},n.orderCreep(e,l)},r.orderEliteDrainer=function(e,r){var o=new s.Order
o.body=t.getEliteDrainerBody(1),o.priority=i.Priority.Important,o.memory={role:a.Role.Drainer,target:void 0,tier:1,route:r,boost:[RESOURCE_CATALYZED_GHODIUM_ALKALIDE,RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]},n.orderCreep(e,o)},r.orderPaladin=function(e,r){var o=t.getMaxTierPaladin(e.energyCapacityAvailable),l=new s.Order
l.body=t.getPaladinBody(o),l.priority=i.Priority.Important,l.memory={role:a.Role.Paladin,target:void 0,tier:o,route:r},n.orderCreep(e,l)},r.orderRanger=function(e,r){var o=t.getMaxTierRanger(e.energyCapacityAvailable),l=new s.Order
l.body=t.getRangerBody(o),l.priority=i.Priority.Important,l.memory={role:a.Role.Ranger,target:void 0,tier:o,route:r},n.orderCreep(e,l)},r.orderHarasser=function(e,r){var o=t.getMaxTierRanger(e.energyCapacityAvailable),l=new s.Order
l.body=t.getRangerBody(o),l.priority=i.Priority.Standard,l.memory={role:a.Role.Harasser,target:r,tier:o},n.orderCreep(e,l)},r.orderTagger=function(e,r){var o=Game.rooms[r]
if(void 0===o||void 0===o.controller||!o.controller.my){var l=new s.Order
l.body=t.getClaimerBody(1),l.priority=i.Priority.Critical,l.memory={role:a.Role.RoomClaimer,target:r,tier:1},n.orderCreep(e,l)}var m=new s.Order
m.body=t.getTaggerBody(),m.priority=i.Priority.Important,m.memory={role:a.Role.Tagger,target:r,tier:1},n.orderCreep(e,m)},r.orderDeclarer=function(e,r){var o=new s.Order
o.body=t.getScoutBody(1),o.priority=i.Priority.Trivial,o.memory={role:a.Role.Declarer,route:r,tier:1},n.orderCreep(e,o)},r.orderTeamWrecker=function(e,r,o,l,m){var u=new s.Order
switch(u.priority=i.Priority.Critical,u.memory={role:a.Role.TeamHealer,target:void 0,tier:r},m){case 0:u.body=t.getB0TeamHealerBody(r)
break
case 1:u.body=t.getB1TeamHealerBody(r),u.memory.boost=[RESOURCE_GHODIUM_OXIDE,RESOURCE_LEMERGIUM_OXIDE,RESOURCE_ZYNTHIUM_OXIDE]
break
case 2:u.body=t.getB2TeamHealerBody(r),u.memory.boost=[RESOURCE_GHODIUM_ALKALIDE,RESOURCE_LEMERGIUM_ALKALIDE,RESOURCE_ZYNTHIUM_ALKALIDE]
break
case 3:u.body=t.getB3TeamHealerBody(r),u.memory.boost=[RESOURCE_CATALYZED_GHODIUM_ALKALIDE,RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]}var y=new s.Order
switch(y.priority=i.Priority.Critical,y.memory={role:a.Role.TeamWrecker,target:void 0,tier:r,route:o,targets:l},m){case 0:y.body=t.getB0TeamWreckerBody(r)
break
case 1:y.body=t.getB1TeamWreckerBody(r),y.memory.boost=[RESOURCE_GHODIUM_OXIDE,RESOURCE_ZYNTHIUM_HYDRIDE,RESOURCE_KEANIUM_OXIDE,RESOURCE_ZYNTHIUM_OXIDE]
break
case 2:y.body=t.getB2TeamWreckerBody(r),y.memory.boost=[RESOURCE_GHODIUM_ALKALIDE,RESOURCE_ZYNTHIUM_ACID,RESOURCE_KEANIUM_ALKALIDE,RESOURCE_ZYNTHIUM_ALKALIDE]
break
case 3:y.body=t.getB3TeamWreckerBody(r),y.memory.boost=[RESOURCE_CATALYZED_GHODIUM_ALKALIDE,RESOURCE_CATALYZED_ZYNTHIUM_ACID,RESOURCE_CATALYZED_KEANIUM_ALKALIDE,RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]}u.twinOrder=y,n.orderCreep(e,u)}},function(e,r,o){function t(e){var r=a.getMaxTierEngineer(e.energyAvailable)
if(!(r<1)){var o=new d.Order
o.body=a.getEngineerBody(r),o.priority=y.Priority.Blocker,o.memory={role:u.Role.Pioneer,target:e.name,tier:r},i.orderCreep(e,o)}}function n(e){e.find(FIND_MY_CREEPS).length<2&&m.getRoomLevel(e)>=v.RoomLevel.BasicColonyReadyForExpansion&&i.clearOrders(e)}var a=o(19),i=o(18),s=o(112),l=o(65),m=o(10),u=o(16),y=o(17),v=o(11),c=o(14),d=o(20),f=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"CrisisManager"))
return t.hasRun=!1,t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,c.Manager),_createClass(r,[{key:"run",value:function(e){if(e===c.ManagerPriority.Critical){var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+500<Game.time){var o=this.roomService.getNormalRooms(),t=!0,a=!1,i=void 0
try{for(var l,m=o[Symbol.iterator]();!(t=(l=m.next()).done);t=!0){var y=l.value
this.checkIfRoomNeedsEnergyConvoy(y),n(y),this.checkIfWeNeedPioneer(y)}}catch(e){a=!0,i=e}finally{try{!t&&m.return&&m.return()}finally{if(a)throw i}}this.setValue(this.MEMORY_LASTRUN,Game.time),this.hasRun=!0}}else if(e===c.ManagerPriority.Standard)this.creepService.runCreeps(u.Role.Pioneer,s.run)
else if(e===c.ManagerPriority.Overflow&&!this.hasRun){var v=this.getValue(this.MEMORY_LASTRUN)
if(void 0===v||v+100<Game.time){var d=this.roomService.getNormalRooms(),f=!0,g=!1,R=void 0
try{for(var p,h=d[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
this.checkIfRoomNeedsEnergyConvoy(E),n(E),this.checkIfWeNeedPioneer(E)}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}this.setValue(this.MEMORY_LASTRUN,Game.time),this.hasRun=!0}}}},{key:"checkIfWeNeedPioneer",value:function(e){if(!e.isExpansion()){var r=this.creepService.getCreeps(u.Role.Pioneer,null,e.name).length,o=i.getCreepsInQueue(e,u.Role.Pioneer,e.name),n=this.creepService.getCreeps(u.Role.ContainerMiner,null,e.name).length,a=this.creepService.getCreeps(u.Role.ContainerHauler,null,e.name).length+this.creepService.getCreeps(u.Role.EnergyHauler,null,e.name).length
r<3&&0===o&&n<2&&a<2?(t(e),0===this.creepService.getCreeps(u.Role.ExpansionWorker,null,e.name).length&&this.requestExpansionWorker(e)):void 0!==e.getBaseContainer()||void 0!==e.storage&&e.storage.isActive()||void 0!==e.terminal&&e.terminal.isActive()||this.creepService.getCreeps(u.Role.ExpansionWorker,null,e.name).length<2&&this.requestExpansionWorker(e)}}},{key:"requestExpansionWorker",value:function(e){var r=void 0,o=void 0,t=this.roomService.getNormalRooms(),n=!0,a=!1,i=void 0
try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.name!==e.name){var u=Game.map.getRoomLinearDistance(e.name,m.name);(void 0===o||u<o)&&(r=m,o=u)}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}void 0!==r&&this.orderExpansionWorker(r,e.name)}},{key:"orderExpansionWorker",value:function(e,r){var o=a.getMaxTierHaulerEngineer(e.energyCapacityAvailable)
if(0===i.getCreepsInQueue(e,u.Role.ExpansionWorker,r)){var t=new d.Order
t.body=a.getHaulerEngineerBody(o),t.priority=y.Priority.Low,t.memory={role:u.Role.ExpansionWorker,target:r,tier:o},i.orderCreep(e,t)}}},{key:"checkIfRoomNeedsEnergyConvoy",value:function(e){m.getRoomLevel(e)>=v.RoomLevel.CivilizedColony&&(void 0===e.terminal||!e.terminal.isActive())&&void 0!==e.storage&&e.storage.isActive()&&e.storage.store[RESOURCE_ENERGY]<1e4&&!l.roomIsReceiveingHaulOperation(e.name)&&l.createCrisisHaulOperation(e.name,this.roomService.getNormalRooms())}}]),r}()
r.CrisisManager=f},function(e,r,o){function t(e){var r=e.memory.homeroom
r!==e.room.name||E.positionIsBorder(e.pos)?e.travelToRoom(r,{maxOps:4e3,ignoreRoads:!0}):(e.setState(R.RemoveHostileConstructionSites),s(e))}function n(e){if(e.carry.energy===e.carryCapacity)return e.setState(R.DecideWhatToDoWithEnergy),void l(e)
var r=Game.getObjectById(e.memory.pickupid)
r instanceof Resource&&r.amount>e.carryCapacity/10?e.pos.getRangeTo(r.pos)>1?e.moveTo(r):e.pickup(r):e.carry.energy>0?(e.setState(R.DecideWhatToDoWithEnergy),l(e)):(e.setState(R.DecideWhereToGetEnergy),i(e))}function a(e){if(e.carry.energy===e.carryCapacity)return e.setState(R.DecideWhatToDoWithEnergy),void l(e)
var r=Game.getObjectById(e.memory.pickupid);(r instanceof StructureTerminal||r instanceof StructureStorage)&&r.store[RESOURCE_ENERGY]>e.carryCapacity?e.pos.getRangeTo(r.pos)>1?e.moveTo(r):e.withdraw(r,RESOURCE_ENERGY):e.carry.energy>0?(e.setState(R.DecideWhatToDoWithEnergy),l(e)):(e.setState(R.DecideWhereToGetEnergy),i(e))}function i(e){var r=e.room.find(FIND_HOSTILE_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_TERMINAL)&&e.store[RESOURCE_ENERGY]>50}})
if(r.length>0)return e.memory.pickupid=e.pos.findClosestByRange(r).id,e.setState(R.GetEnergyFromStructure),void a(e)
var o=e.room.find(FIND_DROPPED_RESOURCES,{filter:function(r){return r.resourceType===RESOURCE_ENERGY&&r.amount>e.carryCapacity/3}})
if(o.length>0)return e.memory.pickupid=e.pos.findClosestByRange(o).id,e.setState(R.ScavengeEnergy),void n(e)
e.setState(R.MovingToSource),m(e)}function s(e){var r=e.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES,{filter:function(e){return e.structureType!==STRUCTURE_EXTRACTOR}})
null!==r&&void 0!==r?e.travelTo(r,{maxOps:4e3,ignoreRoads:!0}):e.setState(R.DecideWhatToDoWithEnergy)}function l(e){if(e.carry.energy<5)return e.setState(R.MovingToSource),void m(e)
if(void 0!==e.room.controller&&e.room.controller.ticksToDowngrade<2e3)return e.setState(R.Upgrading),void y(e)
var r=[]
if((r=void 0!==e.room.controller&&3===e.room.controller.level?e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_EXTENSION||e.structureType===STRUCTURE_TOWER)&&e.energy<e.energyCapacity}}):e.room.find(FIND_MY_STRUCTURES,{filter:function(e){return(e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_EXTENSION||e.structureType===STRUCTURE_TOWER)&&e.energy<e.energyCapacity-20}})).length>0)return e.memory.fillingid=e.pos.findClosestByRange(r).id,e.setState(R.FillingBase),void c(e)
var o=e.room.find(FIND_MY_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_TOWER||e.structureType===STRUCTURE_SPAWN}})
if(o.length>0)return e.memory.constructionid=e.pos.findClosestByRange(o).id,e.setState(R.Constructing),void v(e)
var t=e.room.find(FIND_MY_CONSTRUCTION_SITES)
return t.length>0?(e.memory.constructionid=e.pos.findClosestByRange(t).id,e.setState(R.Constructing),void v(e)):void 0!==e.room.storage&&e.room.storage.isActive()?(e.memory.fillingid=e.room.storage.id,e.setState(R.FillingBase),void c(e)):(e.setState(R.Upgrading),void y(e))}function m(e){if(void 0!==e.memory.sourceId&&void 0!==e.memory.sourcePos||(f(e),void 0!==e.memory.sourceId&&void 0!==e.memory.sourcePos)){var r=new RoomPosition(e.memory.sourcePos.x,e.memory.sourcePos.y,e.memory.sourcePos.roomName)
r instanceof RoomPosition?e.room.name!==r.roomName||e.pos.getRangeTo(r)>1?e.travelTo({pos:r},{maxOps:4e3,ignoreRoads:!0}):(e.setState(R.Mining),u(e)):T.log.error("Invalid sourcePos for ExpansionWorker",e.room.name)}else T.log.error("Could not set source for ExpansionWorker",e.room.name)}function u(e){var r=Game.getObjectById(e.memory.sourceId)
if(null===r||r.room.name!==e.room.name||e.pos.getRangeTo(r.pos)>1)return e.setState(R.MovingToSource),void m(e)
if(e.carry.energy===e.carryCapacity){if(!e.isInHomeroom()){var o=e.room.find(FIND_MY_CONSTRUCTION_SITES)
if(o.length>0)return e.memory.constructionid=e.pos.findClosestByRange(o).id,e.setState(R.Constructing),void v(e)}return e.setState(R.MoveToHomeroom),void t(e)}r.energy>0&&e.harvest(r)===OK&&(void 0===Memory.stats["room."+e.memory.homeroom+".energyHarvested"]&&(Memory.stats["room."+e.memory.homeroom+".energyHarvested"]=0),Memory.stats["room."+e.memory.homeroom+".energyHarvested"]+=2*e.getWorkerParts())}function y(e){if(0===e.carry.energy)return e.setState(R.DecideWhereToGetEnergy),void i(e)
if(!e.isInHomeroom())return e.setState(R.MoveToHomeroom),void t(e)
var r=e.room.controller
if(void 0!==r&&r.my){var o=e.pos.getRangeTo(r)
o>3?e.travelTo(r,{maxOps:4e3,ignoreRoads:!0}):(3===o&&e.travelTo(r,{maxOps:4e3,ignoreRoads:!0}),e.upgradeController(r)===OK&&(void 0===Memory.stats["room."+e.room.name+".energyUpgraded"]&&(Memory.stats["room."+e.room.name+".energyUpgraded"]=0),e.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?Memory.stats["room."+e.room.name+".energyUpgraded"]+=2*e.getActiveBodyparts(WORK):Memory.stats["room."+e.room.name+".energyUpgraded"]+=e.getActiveBodyparts(WORK)))}else e.setState(R.DecideWhatToDoWithEnergy),l(e)}function v(e){if(0===e.carry.energy)return e.setState(R.DecideWhereToGetEnergy),void i(e)
var r=Game.getObjectById(e.memory.constructionid)
if(null===r)return e.isInHomeroom()?(e.setState(R.DecideWhatToDoWithEnergy),void l(e)):(e.setState(R.MoveToHomeroom),void t(e))
e.build(r)===ERR_NOT_IN_RANGE&&e.travelTo(r,{maxOps:4e3,ignoreRoads:!0})}function c(e){if(0===e.carry.energy)return e.setState(R.DecideWhereToGetEnergy),void i(e)
var r=Game.getObjectById(e.memory.fillingid)
if(!(r instanceof StructureStorage||null!==r&&r.energy!==r.energyCapacity))return e.setState(R.DecideWhatToDoWithEnergy),void l(e)
e.transfer(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.travelTo(r,{maxOps:4e3,ignoreRoads:!0})}function d(e,r){var o=0
for(var t in Game.creeps){var n=Game.creeps[t]
n.memory.sourceId===e&&n.memory.role===S.Role.Pioneer&&o++}var a=!0,i=!1,s=void 0
try{for(var l,m=r.memory.orders[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value
u.memory.sourceId===e&&u.memory.role===S.Role.Pioneer&&o++}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return o}function f(e){var r=Game.rooms[e.memory.homeroom]
if(void 0===e.memory.target||(e.memory.sourceId=e.memory.target,e.memory.sourcePos=g(r,e.memory.target),void 0===e.memory.sourcePos))if(r instanceof Room){var o=r.getSources(),t=h.getBasicOutposts(r),n=!0,a=!1,i=void 0
try{for(var s,l=_.range(0,10)[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value,u=!0,y=!1,v=void 0
try{for(var c,f=o[Symbol.iterator]();!(u=(c=f.next()).done);u=!0){var R=c.value
if(d(R.id,r)===m)return e.memory.sourceId=R.id,e.memory.target=R.id,void(e.memory.sourcePos=R.pos)}}catch(e){y=!0,v=e}finally{try{!u&&f.return&&f.return()}finally{if(y)throw v}}var E=!0,S=!1,C=void 0
try{for(var O,M=t[Symbol.iterator]();!(E=(O=M.next()).done);E=!0){var b=O.value
if(p.hasIntel(b)&&!p.hasHostiles(b)){var w=!0,N=!1,A=void 0
try{for(var U,k=p.sourceIds(b)[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
if(d(I,r)===m)return e.memory.sourceId=I,e.memory.target=I,void(e.memory.sourcePos=p.sourcePos(b,I))}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}}}}catch(e){S=!0,C=e}finally{try{!E&&M.return&&M.return()}finally{if(S)throw C}}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}}else T.log.error("Could not access homeroom for Pioneer",e.room.name)}function g(e,r){var o=e.getSources(),t=h.getBasicOutposts(e),n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.id===r)return m.pos}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}var u=!0,y=!1,v=void 0
try{for(var c,d=t[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
if(p.hasIntel(f)&&!p.hasHostiles(f)){var g=!0,R=!1,E=void 0
try{for(var S,T=p.sourceIds(f)[Symbol.iterator]();!(g=(S=T.next()).done);g=!0)if(S.value===r)return p.sourcePos(f,r)}catch(e){R=!0,E=e}finally{try{!g&&T.return&&T.return()}finally{if(R)throw E}}}}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}}var R,p=o(5),h=o(10),E=o(45),S=o(16),T=o(7)
!function(e){e[e.MovingToSource=1]="MovingToSource",e[e.Mining=2]="Mining",e[e.Upgrading=3]="Upgrading",e[e.Constructing=4]="Constructing",e[e.FillingBase=5]="FillingBase",e[e.DecideWhatToDoWithEnergy=6]="DecideWhatToDoWithEnergy",e[e.DecideWhereToGetEnergy=7]="DecideWhereToGetEnergy",e[e.ScavengeEnergy=8]="ScavengeEnergy",e[e.GetEnergyFromStructure=9]="GetEnergyFromStructure",e[e.RemoveHostileConstructionSites=10]="RemoveHostileConstructionSites",e[e.MoveToHomeroom=11]="MoveToHomeroom"}(R||(R={})),r.run=function(e){switch(e.hasState()||e.setState(R.MovingToSource),e.getState()){case R.RemoveHostileConstructionSites:s(e)
break
case R.MoveToHomeroom:t(e)
break
case R.MovingToSource:m(e)
break
case R.Mining:u(e)
break
case R.Upgrading:y(e)
break
case R.Constructing:v(e)
break
case R.FillingBase:c(e)
break
case R.ScavengeEnergy:n(e)
break
case R.GetEnergyFromStructure:a(e)
break
case R.DecideWhatToDoWithEnergy:l(e)
break
case R.DecideWhereToGetEnergy:i(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(R.MovingToSource)}}},function(e,r,o){function t(e){if(void 0!==e.controller&&Game.time%2==0){var r=e.getBaseLink(),o=e.controller.getContainerOrLink()
r instanceof StructureLink&&0===r.cooldown&&o instanceof StructureLink&&0===r.cooldown&&o.energy<200&&r.transferEnergy(o)}}var n=o(35),a=o(14),i=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"LinkManager"))
return o.roomService=e,o}return _inherits(r,a.Manager),_createClass(r,[{key:"run",value:function(e){if(e===a.ManagerPriority.Standard){var r=this.roomService.getNormalRooms(),o=!0,n=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(o=(s=l.next()).done);o=!0)t(s.value)}catch(e){n=!0,i=e}finally{try{!o&&l.return&&l.return()}finally{if(n)throw i}}}}}]),r}()
r.LinkManager=i,r.roomIsEmpty=function(e){if(n.hasContainer(e)&&n.hasAtLeastExtensions(e,5)){var r=e.find(FIND_STRUCTURES,{filter:{structureType:STRUCTURE_CONTAINER}}),o=!0,t=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0)if(i.value.store[RESOURCE_ENERGY]<100)return!0}catch(e){t=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw a}}}return!1},r.buildingHasEnergy=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0
return e.structureType===STRUCTURE_CONTAINER?e.store[RESOURCE_ENERGY]>0:e.energy>r},r.canTakeEnergy=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0
return e instanceof Structure&&(e.structureType===STRUCTURE_CONTAINER?e.store[RESOURCE_ENERGY]>r:e.energy===e.energyCapacity)}},function(e,r,o){var t=o(16),n=o(17),a=o(115),i=o(7),s=o(19),l=o(14),m=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"SpawnManager"))
return o.roomService=e,o}return _inherits(r,l.Manager),_createClass(r,[{key:"run",value:function(){var e=this.roomService.getNormalRooms(),r=!0,o=!1,t=void 0
try{for(var n,a=e[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=_.filter(i.getSpawns(),function(e){return!e.spawning})
s.length>0&&this.processQueue(i,s)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"processQueue",value:function(e,r){if(void 0!==e.memory.orders){var o=r[0]
if(0!==r.length&&!o.spawning&&0!==e.memory.orders.length){e.memory.orders.sort(function(e,r){return e.priority>r.priority?1:r.priority>e.priority?-1:0})
var l=e.memory.orders.shift()
if(void 0!==l.twinOrder){if((r.length<2||void 0===r[1]||r[1].spawning)&&void 0!==e.controller&&e.controller.level>6)return void e.memory.orders.unshift(l)
var m=r[0],u=a.makeRoleName(l.twinOrder.memory.role)+"-T"+l.twinOrder.memory.tier+"-"+a.makeRandomCreepId(),y=m.createCreep(l.twinOrder.body,u,l.twinOrder.memory)
return y<0?void e.memory.orders.unshift(l):(void 0!==Memory.stats["room."+e.name+".creepCost"]&&(Memory.stats["room."+e.name+".creepCost"]+=s.getCostForBody(l.twinOrder.body)),i.log.info("Spawned: "+t.Role[Game.creeps[y].memory.role]+" T"+l.twinOrder.memory.tier+" ("+Game.creeps[y].memory.target+") - "+y,e.name),l.twinOrder=void 0,l.priority=n.Priority.Blocker,void e.memory.orders.unshift(l))}var v=a.makeRoleName(l.memory.role)+"-T"+l.memory.tier+"-"+a.makeRandomCreepId()
e.name!==o.room.name&&(l.memory.homeroom=e.name)
var c=o.createCreep(l.body,v,l.memory)
c<0?e.memory.orders.unshift(l):e.name===o.room.name?(void 0!==Memory.stats["room."+e.name+".creepCost"]&&(Memory.stats["room."+e.name+".creepCost"]+=s.getCostForBody(l.body)),i.log.info("Spawned: "+t.Role[Game.creeps[c].memory.role]+" T"+l.memory.tier+" ("+Game.creeps[c].memory.target+") - "+c,o.room.name)):i.log.info("Spawned: For <a href='#!/room/"+e.name+"'>"+e.name+"</a> "+t.Role[Game.creeps[c].memory.role]+" T"+l.memory.tier+" ("+Game.creeps[c].memory.target+") - "+c,o.room.name)}}else e.memory.orders=[]}}]),r}()
r.SpawnManager=m},function(e,r,o){var t=o(16)
r.makeRoleName=function(e){return t.Role[e]},r.makeRandomCreepId=function(){var e=""
e+="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random()*"ABCDEFGHIJKLMNOPQRSTUVWXYZ".length))
for(var r=1;r<3;r++)e+="abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random()*"abcdefghijklmnopqrstuvwxyz".length))
return e}},function(e,r,o){function t(e){var r=a.getMaxTierHauler(e.energyCapacityAvailable),o=new c.Order
o.body=a.getHaulerBody(r),o.priority=y.Priority.Standard,void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]<1e4&&(o.priority=y.Priority.Important),o.memory={role:u.Role.EnergyHauler,target:void 0,tier:r},l.orderCreep(e,o)}var n=o(69),a=o(19),i=o(117),s=o(118),l=o(18),m=o(10),u=o(16),y=o(17),v=o(11),c=o(20),d=o(14),f=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"HaulingManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,d.Manager),_createClass(r,[{key:"run",value:function(e){if(e===d.ManagerPriority.Low){this.creepService.runCreeps(u.Role.ContainerHauler,i.run),this.creepService.runCreeps(u.Role.EnergyHauler,s.run),this.creepService.runCreeps(u.Role.SKHauler,i.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+10<Game.time){var o=this.roomService.getNormalAndNotExpansion(),t=!0,n=!1,a=void 0
try{for(var l,y=o[Symbol.iterator]();!(t=(l=y.next()).done);t=!0){var c=l.value
m.getRoomLevel(c)>=v.RoomLevel.City&&this.organizeEnergyHauling(c)}}catch(e){n=!0,a=e}finally{try{!t&&y.return&&y.return()}finally{if(n)throw a}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"organizeEnergyHauling",value:function(e){var r=this.creepService.getCreeps(u.Role.EnergyHauler,null,e.name),o=n.getSourcesNeedingHauling(e),a=[],i=!0,s=!1,m=void 0
try{for(var y,v=r[Symbol.iterator]();!(i=(y=v.next()).done);i=!0){var c=y.value
void 0!==c.memory.target&&a.push(c.memory.target)}}catch(e){s=!0,m=e}finally{try{!i&&v.return&&v.return()}finally{if(s)throw m}}if(e.memory.dumpSources=_.difference(o,a),l.getCreepsInQueue(e,u.Role.EnergyHauler)<2){var d=this.creepService.getIdleEnergyHaulers(e.name).length
0===d&&void 0!==e.memory.dumpSources&&e.memory.dumpSources.length>0&&t(e),Memory.settings.logEnergyhauling&&console.log("<a href='#!/room/"+e.name+"'>"+e.name+"</a> EH-stats - serviced: "+a.length+"/"+o.length+" - haulers: "+r.length+" ("+d+" idle)")}else Memory.settings.logEnergyhauling&&console.log("<a href='#!/room/"+e.name+"'>"+e.name+"</a> EH-stats - serviced: "+a.length+"/"+o.length+" - haulers: "+r.length)}}]),r}()
r.HaulingManager=f},function(e,r,o){function t(e){if(e.carry[RESOURCE_ENERGY]===e.carryCapacity)return e.setState(v.Dumping),void n(e)
if(l(e),void 0===e.memory.targetRoom&&m(e),!f.targetRoomHasInvaders(e,e.memory.targetRoom)&&!f.stayAwayFromSourceKeeper(e)){var r=Game.getObjectById(e.memory.container)
if(null===r){if(e.room.name!==e.memory.targetRoom)return void 0===e.memory.targetSource&&u(e),void 0===e.memory.targetSourcePos&&y(e,e.memory.targetSource),void(void 0!==e.memory.targetSourcePos?e.travelTo({pos:new RoomPosition(e.memory.targetSourcePos.x,e.memory.targetSourcePos.y,e.memory.targetSourcePos.roomName)}):e.travelToRoom(e.memory.targetRoom))
if(!a(e))return}var o=e.withdraw(r,RESOURCE_ENERGY)
o===ERR_NOT_IN_RANGE||o===ERR_NOT_OWNER?e.travelTo(r):o===ERR_NOT_ENOUGH_RESOURCES&&(e.setState(v.Dumping),n(e))}}function n(e){if(0!==e.carry[RESOURCE_ENERGY]){void 0===e.memory.targetRoom&&m(e),s(e),void 0===e.memory.dropof&&i(e)
var r=Game.getObjectById(e.memory.dropof)
!(r instanceof StructureContainer)&&Game.time%3==0&&Game.rooms[e.memory.homeroom]instanceof Room&&g.getRoomLevel(Game.rooms[e.memory.homeroom])<R.RoomLevel.CivilizedColony&&i(e),r instanceof Structure||(i(e),r=Game.getObjectById(e.memory.dropof))
var o=e.transfer(r,RESOURCE_ENERGY)
o===ERR_NOT_IN_RANGE||o===ERR_NOT_OWNER?e.travelTo(r):o===ERR_FULL&&i(e)}else e.setState(v.Tanking)}function a(e){void 0===e.memory.targetSource&&u(e)
var r=Game.getObjectById(e.memory.targetSource).getMiningContainer()
return null!==r&&(e.memory.container=r.id,!0)}function i(e){e.memory.dropof=c.getBuildingIdForDump(Game.rooms[e.memory.homeroom],e)}function s(e){if(void 0===e.memory.outdatedTick){var r=Game.rooms[e.memory.homeroom].storage,o=Game.getObjectById(e.memory.container)
if(void 0===r){var t=e.room.getSpawn()
if(void 0===t)return
r=t}if(void 0!==r.pos&&null!==o&&void 0!==o.pos){var n=d.getDistanseBetween(r.pos,o.pos)
e.memory.outdatedTick=Math.ceil(2*n*1.2)}}}function l(e){return void 0!==e.memory.outdatedTick&&(e.memory.outdatedTick>e.ticksToLive&&(e.suicide(),!0))}function m(e){e.memory.targetRoom=e.memory.target.split("-")[0]}function u(e){e.memory.targetSource=e.memory.target.split("-")[1]}function y(e,r){void 0!==Memory.sources[r]&&Memory.sources[r].containerPos&&void 0!==Memory.sources[r].containerPos.x&&void 0!==Memory.sources[r].containerPos.y&&void 0!==Memory.sources[r].containerPos.roomName&&(e.memory.targetSourcePos=new RoomPosition(Memory.sources[r].containerPos.x,Memory.sources[r].containerPos.y,Memory.sources[r].containerPos.roomName))}var v,c=o(34),d=o(3),f=o(33),g=o(10),R=o(11)
!function(e){e[e.Tanking=1]="Tanking",e[e.Dumping=2]="Dumping"}(v||(v={})),r.run=function(e){switch(e.hasState()||e.setState(v.Tanking),e.getState()){case v.Tanking:t(e)
break
case v.Dumping:n(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(v.Tanking)}}},function(e,r,o){function t(e){if(void 0!==e.memory.sleepUntil&&e.memory.sleepUntil>Game.time)c.moveOffRoad(e)
else{var r=m(e.getHomeroom(),e)
void 0!==r?(s(e,r),e.setState(u.Tanking)):e.memory.sleepUntil=Game.time+5}}function n(e){if(void 0===e.memory.containerPos||void 0===e.memory.containerPos.roomName)return console.log("EnergyHauler without Containerpos: "+e.name),e.setState(u.Idle),void i(e)
if(!c.targetRoomHasInvaders(e,e.memory.containerPos.roomName)){var r=new RoomPosition(e.memory.containerPos.x,e.memory.containerPos.y,e.memory.containerPos.roomName)
if(r.roomName===e.pos.roomName){var o=Game.getObjectById(e.memory.container)
if(null===o)return console.log("Error with containerID for Energyhauler"+e.room.name),e.setState(u.Idle),void i(e)
e.pos.getRangeTo(o)>1?e.travelTo({pos:r}):(e.withdraw(o,RESOURCE_ENERGY),Memory.settings.logEnergyhauling&&console.log("<a href='#!/room/"+e.room.name+"'>"+e.room.name+"</a> EnergyHauler getting energy from container with: "+o.store[RESOURCE_ENERGY]+" energy"),e.setState(u.Dumping),i(e))}else e.travelTo({pos:r})}}function a(e){if(0===e.carry[RESOURCE_ENERGY])return e.setState(u.Idle),void t(e)
void 0===e.memory.dropof&&(e.memory.dropof=y.getBuildingIdForDump(Game.rooms[e.getHomeroom()],e))
var r=Game.getObjectById(e.memory.dropof)
if(void 0===e.memory.dropof||null===r)return console.log("Error with dropof for energyhauler in room "+e.getHomeroom()),void(e.memory.dropof=void 0)
if(r.pos.roomName===e.pos.roomName){var o=e.pos.getRangeTo(r)
o>5?e.travelTo(r):o>1?e.moveTo(r):(e.transfer(r,RESOURCE_ENERGY),e.memory.dropof=void 0)}else e.travelTo(r)}function i(e){e.memory.container=void 0,e.memory.containerPos=void 0,e.memory.target=void 0,e.memory.dropof=void 0}function s(e,r){var o=Memory.sources[r]
if(e.memory.container=o.container,void 0===o.containerPos){console.log("Positioninfo for source missing: "+r)
var t=Game.getObjectById(r)
t instanceof Source&&(e.memory.containerPos=t.getContainerPosition())}else e.memory.containerPos=new RoomPosition(o.containerPos.x,o.containerPos.y,o.containerPos.roomName)
e.memory.target=r,e.memory.dropof=void 0}function l(e,r){var o=Memory.sources[r]
if(void 0===o||void 0===o.containerPos||void 0===o.containerPos.roomName)return!0
var t=new RoomPosition(o.containerPos.x,o.containerPos.y,o.containerPos.roomName),n=v.getDistanseBetween(e.pos,t)
return!(Math.ceil(2*n*1.2)>e.ticksToLive)}function m(e,r){if(void 0!==Game.rooms[e]){var o=Game.rooms[e]
if(void 0!==o.memory.dumpSources&&0!==o.memory.dumpSources.length){var t=!0,n=!1,a=void 0
try{for(var i,s=o.memory.dumpSources[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var m=function(){var e=i.value
if(l(r,e))return _.remove(o.memory.dumpSources,function(r){return r===e}),{v:e}}()
if("object"===(void 0===m?"undefined":_typeof(m)))return m.v}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}r.suicide()}}}var u,y=o(34),v=o(3),c=o(33)
!function(e){e[e.Idle=1]="Idle",e[e.Tanking=2]="Tanking",e[e.Dumping=3]="Dumping"}(u||(u={})),r.run=function(e){if(!c.moveHomeAndHealIfHurt(e))if(c.isCloseToSourceKeeper(e)){var r=c.getTravelDestinasion(e)
void 0!==r?c.positionIsCloseToSourceKeeper(r)?c.stayAwayFromSourceKeeper(e):e.travelTo({pos:r},{avoidKeepers:!0}):c.stayAwayFromSourceKeeper(e)}else switch(e.hasState()||e.setState(u.Idle),e.getState()){case u.Idle:t(e)
break
case u.Tanking:n(e)
break
case u.Dumping:a(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(u.Idle)}}},function(e,r,o){var t=o(69),n=o(19),a=o(47),i=o(120),s=o(5),l=o(20),m=o(18),u=o(10),y=o(16),v=o(17),c=o(11),d=o(14),f=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MiningManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,d.Manager),_createClass(r,[{key:"run",value:function(e){if(e===d.ManagerPriority.Low){this.creepService.runCreeps(y.Role.ContainerMiner,i.run),this.creepService.runCreeps(y.Role.SKMiner,i.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+20<Game.time){var o=this.roomService.getNormalRoomsNotAbandoned(),t=!0,n=!1,a=void 0
try{for(var s,l=o[Symbol.iterator]();!(t=(s=l.next()).done);t=!0){var m=s.value
m.isExpansion()||this.organizeEnergyMining(m)}}catch(e){n=!0,a=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw a}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"organizeEnergyMining",value:function(e){var r=u.getRoomLevel(e),o=u.getLairOutposts(e)
if(r>=c.RoomLevel.City&&o.length>0){var n=!0,i=!1,l=void 0
try{for(var m,y=o[Symbol.iterator]();!(n=(m=y.next()).done);n=!0){var v=m.value
u.isPortalRoom(v)&&!s.hasInvaders(v)||this.orderSKGuard(e,v),u.isPortalRoom(v)&&s.hasInvaders(v)&&this.orderPortalGuard(e,v)}}catch(e){i=!0,l=e}finally{try{!n&&y.return&&y.return()}finally{if(i)throw l}}}if(!(void 0!==e.storage&&_.sum(e.storage.store)>.95*STORAGE_CAPACITY)){var d=t.getAllSourcesInRoom(e)
if(void 0===r||r<c.RoomLevel.DefendedColony){var f=e.getSources(),g=u.getBasicOutposts(e),R=!0,p=!1,h=void 0
try{for(var E,S=f[Symbol.iterator]();!(R=(E=S.next()).done);R=!0){var T=E.value
this.orderPioneers(e,T.id,T.pos,T.getMiningPositions().length)}}catch(e){p=!0,h=e}finally{try{!R&&S.return&&S.return()}finally{if(p)throw h}}var C=!0,O=!1,M=void 0
try{for(var b,w=g[Symbol.iterator]();!(C=(b=w.next()).done);C=!0){var N=b.value
if(s.hasIntel(N)&&!s.hasHostiles(N)){var A=!0,U=!1,k=void 0
try{for(var I,L=s.sourceIds(N)[Symbol.iterator]();!(A=(I=L.next()).done);A=!0){var P=I.value,x=1,G=Game.getObjectById(P)
null!==G&&(x=G.getMiningPositions().length),this.orderPioneers(e,P,s.sourcePos(N,P),x)}}catch(e){U=!0,k=e}finally{try{!A&&L.return&&L.return()}finally{if(U)throw k}}}}}catch(e){O=!0,M=e}finally{try{!C&&w.return&&w.return()}finally{if(O)throw M}}}else{var B=!0,D=!1,H=void 0
try{for(var W,Y=d[Symbol.iterator]();!(B=(W=Y.next()).done);B=!0){var F=W.value
this.orderContainerMiners(e,F.id,F.room.name),r<c.RoomLevel.City&&this.orderContainerHaulers(e,F.id,F.room.name,F.pos)}}catch(e){D=!0,H=e}finally{try{!B&&Y.return&&Y.return()}finally{if(D)throw H}}var K=u.getBasicOutposts(e),V=!0,j=!1,X=void 0
try{for(var Z,z=K[Symbol.iterator]();!(V=(Z=z.next()).done);V=!0){var q=Z.value
if(!s.hasInvaders(q)){var J=!0,Q=!1,$=void 0
try{for(var ee,re=s.sourceIds(q)[Symbol.iterator]();!(J=(ee=re.next()).done);J=!0){var oe=ee.value
this.orderContainerMiners(e,oe,q),r<c.RoomLevel.City&&this.orderContainerHaulers(e,oe,q,s.sourcePos(q,oe))}}catch(e){Q=!0,$=e}finally{try{!J&&re.return&&re.return()}finally{if(Q)throw $}}}s.hasIntel(q)||a.orderScouting(e,q)}}catch(e){j=!0,X=e}finally{try{!V&&z.return&&z.return()}finally{if(j)throw X}}if(r>=c.RoomLevel.City&&o.length>0){var te=!0,ne=!1,ae=void 0
try{for(var ie,se=o[Symbol.iterator]();!(te=(ie=se.next()).done);te=!0){var le=ie.value
if(!s.hasInvaders(le)){var me=!0,ue=!1,ye=void 0
try{for(var ve,ce=s.sourceIds(le)[Symbol.iterator]();!(me=(ve=ce.next()).done);me=!0){var de=ve.value
this.orderContainerMiners(e,de,le,!0)}}catch(e){ue=!0,ye=e}finally{try{!me&&ce.return&&ce.return()}finally{if(ue)throw ye}}}}}catch(e){ne=!0,ae=e}finally{try{!te&&se.return&&se.return()}finally{if(ne)throw ae}}}}}}},{key:"orderPortalGuard",value:function(e,r){if(!(this.creepService.getCreeps(y.Role.SKGuard,r).length+m.getCreepsInQueue(e,y.Role.SKGuard,r)>0)){var o=u.getLairOutposts(e),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value,v=this.creepService.getCreeps(y.Role.SKGuard,l),c=!0,d=!1,f=void 0
try{for(var g,R=v[Symbol.iterator]();!(c=(g=R.next()).done);c=!0){var p=g.value
if(p.ticksToLive>200)return p.memory.target=r,void console.log("SK-guard being reordered to portalroom:"+p.id)}}catch(e){d=!0,f=e}finally{try{!c&&R.return&&R.return()}finally{if(d)throw f}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}this.orderSKGuard(e,r)}}},{key:"orderSKGuard",value:function(e,r){var o=m.getCreepsInQueue(e,y.Role.SKGuard)
if(!(o>0)){var t=this.creepService.getCreeps(y.Role.SKGuard,r),a=t.length
if(!(1===t.length&&(t[0].ticksToLive>300||void 0===t[0].ticksToLive)||a+o>1)){var i=new l.Order
i.body=n.getSKGuardBody(),i.priority=v.Priority.Critical,i.memory={role:y.Role.SKGuard,target:r,tier:1,token:""+Game.time}
var s=new l.Order
s.body=n.getSKHealerBody(),s.priority=v.Priority.Critical,s.memory={role:y.Role.SKHealer,target:r,tier:1,token:""+Game.time},s.twinOrder=i,m.orderCreep(e,s)}}}},{key:"orderPioneers",value:function(e,r,o,a){var i=n.getMaxTierEngineer(e.energyCapacityAvailable),s=e.getSpawn()
if(void 0!==s){var u=this.creepService.getCreeps(y.Role.Pioneer,r,e.name).length,c=this.creepService.getNumberOfTiers(y.Role.Pioneer,r,e.name),d=m.getNumberOfTiersInQueue(e,y.Role.Pioneer,r),f=t.getTiersRequiredForPioneerMining(i,a,s.pos,o)
if(0===d&&c<f&&u<10){var g=new l.Order
g.body=n.getEngineerBody(i),g.priority=v.Priority.Standard,g.memory={role:y.Role.Pioneer,tier:i,target:r},m.orderCreep(e,g)}}}},{key:"orderContainerMiners",value:function(e,r,o){var t=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a=o+"-"+r,i=this.creepService.getCreeps(y.Role.ContainerMiner,a),s=m.getCreepsInQueue(e,y.Role.ContainerMiner,a)
if(i.length>1){var u=!0,c=!1,d=void 0
try{for(var f,g=i[Symbol.iterator]();!(u=(f=g.next()).done);u=!0)f.value.memory.orderCopyTick=-1}catch(e){c=!0,d=e}finally{try{!u&&g.return&&g.return()}finally{if(c)throw d}}}if(!(s+i.length>0))if(void 0===e.controller||e.controller.level<1)console.log("Can not find controller in room: "+e.controller+" - "+e.name)
else{var R=e.controller.level,p=new l.Order
p.body=t?n.getSkMinerBody(R):n.getMinerBody(R),p.priority=v.Priority.Standard,e.name===o&&(p.priority=v.Priority.Important),p.memory={role:y.Role.ContainerMiner,target:a,tier:R},m.orderCreep(e,p)}}},{key:"orderContainerHaulers",value:function(e,r,o,a){var i=o+"-"+r,s=Game.getObjectById(r)
if(s instanceof Source&&s.hasMiningContainer()&&!(this.creepService.getCreeps(y.Role.ContainerMiner,i).length<1)){var u=n.getMaxTierHauler(e.energyCapacityAvailable),c=t.getTiersRequiredForContainerHauling(a,e,3e3),d=Math.min(u,c),f=1
c>u&&(f=2,d=Math.min(u,Math.ceil(c/2)))
var g=this.creepService.getCreeps(y.Role.ContainerHauler,i).length
if(!(m.getCreepsInQueue(e,y.Role.ContainerHauler,i)+g>=f)){var R=new l.Order
R.body=n.getHaulerBody(d),R.priority=v.Priority.Standard,g>0&&(R.priority=v.Priority.Low),e.name===o&&(R.priority=v.Priority.Important),R.memory={role:y.Role.ContainerHauler,target:i,tier:d},m.orderCreep(e,R)}}}}]),r}()
r.MiningManager=f},function(e,r,o){function t(e){var r=s(e)
if(null===r)e.travelToRoom(i(e))
else{var o=r.getContainerPosition()
if(void 0!==o){if(e.room.name===i(e)&&0===e.pos.getRangeTo(o))return r.hasMiningContainer()?void e.setState(v.Mining):void e.setState(v.BuildingContainer)
e.travelTo({pos:o},{range:0})}else e.travelTo(r)}}function n(e){if(null!==l(e))e.setState(v.Mining)
else{var r=m(e)
if(null!==r){var o=s(e)
if(null===o)return void console.log("Error with missing source for ContainerMiner: "+e.room.name)
e.carry[RESOURCE_ENERGY]>e.carryCapacity/2?e.build(r):e.harvest(o)===OK&&(void 0===Memory.stats["room."+e.memory.homeroom+".energyHarvested"]&&(Memory.stats["room."+e.memory.homeroom+".energyHarvested"]=0),Memory.stats["room."+e.memory.homeroom+".energyHarvested"]+=2*e.getWorkerParts())}}}function a(e){var r=s(e)
if(null!==r){var o=l(e)
null===o?e.setState(v.BuildingContainer):o.hits<2e5&&e.carry[RESOURCE_ENERGY]===e.carryCapacity?e.repair(o):r.energy>0&&o.store[RESOURCE_ENERGY]<o.storeCapacity&&e.harvest(r)===OK&&(void 0===Memory.stats["room."+e.memory.homeroom+".energyHarvested"]&&(Memory.stats["room."+e.memory.homeroom+".energyHarvested"]=0),Memory.stats["room."+e.memory.homeroom+".energyHarvested"]+=2*e.getWorkerParts())}else console.log("Error with missing source for ContainerMiner: "+e.room.name)}function i(e){return void 0===e.memory.targetRoom&&(e.memory.targetRoom=e.memory.target.split("-")[0]),e.memory.targetRoom}function s(e){return void 0===e.memory.source&&(e.memory.source=e.memory.target.split("-")[1]),Game.getObjectById(e.memory.source)}function l(e){if(void 0!==e.memory.container){var r=Game.getObjectById(e.memory.container)
if(null!==r)return r
e.memory.container=void 0}var o=s(e)
if(null!==o){var t=o.getMiningContainer()
if(null!==t)return e.memory.container=t.id,t}return null}function m(e){if(void 0!==e.memory.csite){var r=Game.getObjectById(e.memory.csite)
if(null!==r)return r
e.memory.csite=void 0}var o=s(e)
if(null!==o){var t=o.getMiningContainerConstructionSite()
if(null!==t)return e.memory.csite=t.id,t
o.buildMiningContainer()}return null}function u(e){var r=s(e),o=Game.rooms[e.memory.homeroom].getSpawn()
r instanceof Source&&o instanceof StructureSpawn?e.memory.orderCopyTick=Math.ceil(c.getDistanseBetween(r.pos,o.pos)+3*e.memory.tier*1.1):e.memory.orderCopyTick=-1}function y(e){if(void 0!==Game.rooms[e.memory.homeroom]&&f.hasOutpost(Game.rooms[e.memory.homeroom],e.memory.targetRoom)&&!Game.rooms[e.memory.homeroom].isAbandoned()&&!Game.rooms[e.memory.homeroom].isUnderSiege()){var r=new R.Order
r.body=_.map(e.body,function(e){return e.type}),r.priority=p.Priority.Important,r.memory={role:e.memory.role,target:e.memory.target,tier:e.memory.tier},d.orderCreep(Game.rooms[e.memory.homeroom],r)}}var v,c=o(3),d=o(18),f=o(10),g=o(33),R=o(20),p=o(17)
!function(e){e[e.MovingToContainer=1]="MovingToContainer",e[e.BuildingContainer=2]="BuildingContainer",e[e.Mining=3]="Mining"}(v||(v={})),r.run=function(e){if(g.targetRoomHasInvaders(e,e.memory.targetRoom))return e.carry[RESOURCE_ENERGY]>0&&e.drop(RESOURCE_ENERGY),void e.setState(v.MovingToContainer)
if(g.stayAwayFromSourceKeeper(e))return e.carry[RESOURCE_ENERGY]>0&&e.drop(RESOURCE_ENERGY),void e.setState(v.MovingToContainer)
switch(e.hasState()||e.setState(v.MovingToContainer),void 0===e.memory.orderCopyTick&&u(e),e.memory.orderCopyTick===e.ticksToLive&&y(e),e.getState()){case v.MovingToContainer:t(e)
break
case v.BuildingContainer:n(e)
break
case v.Mining:a(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(v.MovingToContainer)}}},function(e,r,o){function t(e){var r=d.getBasePosition(e)
if(r&&!(void 0===e.controller||e.controller.level<2)){var o=d.getRoomLevel(e)
if(o>p.RoomLevel.BasicColonyReadyForExpansion&&o<p.RoomLevel.CivilizedColony&&(void 0===e.storage||!e.storage.isActive())&&void 0===i(r,e)&&u.buildIfNotPresent(STRUCTURE_CONTAINER,r,0,2,!0,!1),void 0!==e.storage&&e.storage.isActive()){var t=i(r,e)
void 0!==t&&t.destroy()}var s=e.getSpawn(),l=e.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_RAMPART}})
if(void 0===s&&0===l.length&&void 0!==e.controller&&void 0===e.controller.safeMode?n(e,r,STRUCTURE_RAMPART,m.getSpawnPositions(),1):n(e,r,STRUCTURE_SPAWN,m.getSpawnPositions(),m.getPossibleSpawnCount(e)),void 0!==s){if(n(e,r,STRUCTURE_TOWER,m.getTowerPositions(),m.getPossibleTowerCount(e)),!0===Memory.settings.bot){var y=v.getExtensionPositions(e,r)
a(e,STRUCTURE_EXTENSION,y,m.getPossibleExtensionsCount(e))}else n(e,r,STRUCTURE_EXTENSION,m.getExtensionPositions(),m.getPossibleExtensionsCount(e))
o>=p.RoomLevel.DefendedColonyReadyForExpansion&&u.buildIfNotPresent(STRUCTURE_STORAGE,r,0,3,!1,!1),!0===Memory.settings.bot?(o>=p.RoomLevel.SimpleColonyReadyForExpansion&&(n(e,r,STRUCTURE_ROAD,m.getNewColonyRoadPositions()),a(e,STRUCTURE_ROAD,v.getRoadPositions(e,r))),o>=p.RoomLevel.CivilizedColony&&n(e,r,STRUCTURE_ROAD,m.getNewCityRoadPositions())):(o>=p.RoomLevel.SimpleColonyReadyForExpansion&&o<p.RoomLevel.CivilizedColony&&n(e,r,STRUCTURE_ROAD,m.getColonyRoadPositions()),o>=p.RoomLevel.CivilizedColony&&n(e,r,STRUCTURE_ROAD,m.getCityRoadPositions())),o>=p.RoomLevel.CivilizedColonyReadyForExpansion&&u.buildIfNotPresent(STRUCTURE_LINK,r,-1,4,!1,!0),(o>=p.RoomLevel.CivilizedColony||e.isExpansion())&&n(e,r,STRUCTURE_RAMPART,m.getFortressWallPositions(),void 0,!0),o>=p.RoomLevel.Metropolis&&n(e,r,STRUCTURE_RAMPART,m.getShellWallPositions(),void 0,!0),o>=p.RoomLevel.AdvancedColonyReadyForExpansion&&(u.buildIfNotPresent(STRUCTURE_TERMINAL,r,2,2,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,1,4,!1,!0)),o>=p.RoomLevel.Town&&(u.buildIfNotPresent(STRUCTURE_LAB,r,0,5,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,1,6,!1,!0)),o>=p.RoomLevel.City&&(u.buildIfNotPresent(STRUCTURE_LAB,r,-1,5,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,2,5,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,-1,6,!1,!0)),o>=p.RoomLevel.Metropolis&&(u.buildIfNotPresent(STRUCTURE_POWER_SPAWN,r,-2,2,!1,!0),u.buildIfNotPresent(STRUCTURE_NUKER,r,-2,5,!1,!0),u.buildIfNotPresent(STRUCTURE_OBSERVER,r,-2,6,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,2,6,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,-1,7,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,0,7,!1,!0),u.buildIfNotPresent(STRUCTURE_LAB,r,1,7,!1,!0))}}}function n(e,r,o,t){var n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,a=arguments.length>5&&void 0!==arguments[5]&&arguments[5],i=100
if(void 0!==n){var s=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===o}}).length,l=e.find(FIND_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===o}}).length
if(n<=s+l)return
i=n-s-l,console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Building: "+i+" "+o+"</span>")}for(var m=0;i>0&&m<t.length;)u.buildIfNotPresent(o,r,t[m][0],t[m][1],a)&&i--,m++}function a(e,r,o){var t=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,n=arguments.length>4&&void 0!==arguments[4]&&arguments[4],a=100
if(void 0!==t){var i=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===r}}).length,s=e.find(FIND_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===r}}).length
if(t<=i+s)return
a=t-i-s,console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Building: "+a+" "+r+"</span>")}for(var l=0,m=new RoomPosition(0,0,e.name);a>0&&l<o.length;)u.buildIfNotPresent(r,m,o[l].x,o[l].y,n)&&a--,l++}function i(e,r){var o=new RoomPosition(e.x,e.y+2,e.roomName)
if(void 0!==o){var t=o.lookFor(LOOK_STRUCTURES),n=!0,a=!1,i=void 0
try{for(var s,l=t[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m instanceof StructureContainer)return r.memory.roomContainer=m.id,m}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}}}var s=o(19),l=o(29),m=o(80),u=o(81),y=o(122),v=o(4),c=o(123),d=o(10),f=o(18),g=o(20),R=o(16),p=o(11),h=o(17),E=o(14),S=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"BuildManager"))
return t.MEMORY_LASTRUN_DISMANTLE="lastRunDismantle",t.MEMORY_LASTRUN_BUILD="lastRunBuild",t.MEMORY_LASTRUN_ORDER="lastRunOrder",t.MEMORY_TICKLASTINDEX="tickIndex",t.MEMORY_LASTINDEX="lastIndex",t.MEMORY_ROOMINDEX="roomIndex",t.roomService=e,t.creepService=o,t}return _inherits(r,E.Manager),_createClass(r,[{key:"run",value:function(e){if(e===E.ManagerPriority.Low){var r=this.getValue(this.MEMORY_LASTRUN_DISMANTLE),o=this.getValue(this.MEMORY_LASTRUN_ORDER),n=this.getValue(this.MEMORY_LASTRUN_BUILD),a=this.getValue(this.MEMORY_TICKLASTINDEX)
if(void 0===r||r+40<Game.time){var i=l.getAllRoomsBeingDismantled()
if(i.length>0){var s=!0,m=!1,u=void 0
try{for(var f,g=i[Symbol.iterator]();!(s=(f=g.next()).done);s=!0){var p=f.value
y.removeAllHostileStructures(p),l.wallsShouldBeRemoved(p)&&y.removeAllWalls(p),p.memory.isBeingDismantledEverything&&y.removeAllFriendlyStructures(p),p.memory.isBeingDismantledEverythingExceptEnergy&&y.removeAllFriendlyStructures(p,!0)}}catch(e){m=!0,u=e}finally{try{!s&&g.return&&g.return()}finally{if(m)throw u}}}this.setValue(this.MEMORY_LASTRUN_DISMANTLE,Game.time)}else if(void 0===o||o+40<Game.time){var h=this.roomService.getNormalRoomsNotAbandoned()
if(h.length>0){var S=!0,T=!1,C=void 0
try{for(var O,M=h[Symbol.iterator]();!(S=(O=M.next()).done);S=!0){var _=O.value
l.wallsShouldBeRemoved(_)&&(y.removeAllWalls(_),y.removeAllHostileStructures(_)),l.roomShouldHaveBuilders(_)&&this.orderBaseBuilders(_)}}catch(e){T=!0,C=e}finally{try{!S&&M.return&&M.return()}finally{if(T)throw C}}}this.setValue(this.MEMORY_LASTRUN_ORDER,Game.time)}else if(void 0===a||a+1e3<Game.time)this.setValue(this.MEMORY_LASTINDEX,d.getLastIndex()),this.setValue(this.MEMORY_TICKLASTINDEX,Game.time)
else if(void 0===n||n+20<Game.time){var b=this.getValue(this.MEMORY_ROOMINDEX)
void 0===b&&(b=1)
var w=d.getRoomForIndex(b)
void 0!==w&&d.roomShouldBuild(w)&&t(w)
var N=this.getValue(this.MEMORY_LASTINDEX)
if(void 0===N)return void console.log("Error with lastIndex in RoadManager.")
var A=b+1
A>N&&(A=1),this.setValue(this.MEMORY_ROOMINDEX,A),this.setValue(this.MEMORY_LASTRUN_BUILD,Game.time)}}else if(e===E.ManagerPriority.Trivial){if(void 0!==Game.flags.Ext){var U=Game.flags.Ext
v.simExtensions(U.pos)}this.creepService.runCreeps(R.Role.BaseBuilder,c.run)}}},{key:"orderBaseBuilders",value:function(e){if(!(f.getCreepsInQueue(e,R.Role.BaseBuilder,e.name)+this.creepService.getCreeps(R.Role.BaseBuilder,e.name).length>1)){var r=f.getNumberOfTiersInQueue(e,R.Role.BaseBuilder,e.name),o=this.creepService.getNumberOfTiers(R.Role.BaseBuilder,e.name),t=Math.ceil(u.getConstructionPointsInRoom(e)/5e3)
if(!(r+o>=t)){var n=s.getMaxTierConsultant(e.energyCapacityAvailable),a=Math.min(n,Math.max(t,4))
void 0!==e.controller&&void 0!==e.controller.level&&8===e.controller.level&&(a=Math.min(n,Math.max(t,8)))
var i=new g.Order
i.body=s.getConsultantBody(a),i.priority=h.Priority.Standard,void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>2e4&&(i.priority=h.Priority.Important),i.memory={role:R.Role.BaseBuilder,target:e.name,tier:a},f.orderCreep(e,i)}}}}]),r}()
r.BuildManager=S,r.placeBuildings=t},function(e,r){r.removeAllWalls=function(e){var r=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_WALL}}),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)a.value.destroy()}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}e.memory.removeWalls=void 0},r.removeAllHostileStructures=function(e){var r=e.find(FIND_HOSTILE_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s.structureType===STRUCTURE_TERMINAL&&s.store[RESOURCE_ENERGY]>5e3||s.structureType===STRUCTURE_STORAGE&&s.store[RESOURCE_ENERGY]>5e3||s.destroy()}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var l=e.find(FIND_HOSTILE_CONSTRUCTION_SITES),m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0)v.value.remove()}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}},r.removeAllFriendlyStructures=function(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=e.find(FIND_MY_STRUCTURES)
!0===r&&(o=_.filter(o,function(e){return e.structureType!==STRUCTURE_TERMINAL&&e.structureType!==STRUCTURE_STORAGE}))
var t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0)i.value.destroy()}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var l=e.find(FIND_MY_CONSTRUCTION_SITES),m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0)v.value.remove()}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}},r.getVitalBuildings=function(e){return e.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_SPAWN||e.structureType===STRUCTURE_TOWER||e.structureType===STRUCTURE_TERMINAL||e.structureType===STRUCTURE_STORAGE||e.structureType===STRUCTURE_NUKER||e.structureType===STRUCTURE_POWER_SPAWN}})}},function(e,r,o){function t(e){return void 0!==e.memory.sleep&&e.memory.sleep>0?(e.memory.sleep--,void f.moveOffRoad(e)):e.carry[RESOURCE_ENERGY]<e.carryCapacity/2?(e.setState(v.Tanking),void s(e)):Game.getObjectById(e.memory.targetSite)instanceof ConstructionSite?(e.setState(v.Constructing),void n(e)):null!==m(e)?(e.setState(v.Constructing),void n(e)):null!==u(e)?(e.setState(v.Fortify),void a(e)):e.isFull()?(e.memory.sleep=15,void f.moveOffRoad(e)):(e.setState(v.Tanking),void s(e))}function n(e){if(0===e.carry[RESOURCE_ENERGY])return e.setState(v.Tanking),void s(e)
var r=Game.getObjectById(e.memory.targetSite)
if(r instanceof ConstructionSite||(r=m(e)),null!==r){var o=e.build(r)
o===ERR_NOT_IN_RANGE?e.travelTo(r):o===OK&&(r.structureType!==STRUCTURE_RAMPART&&r.structureType!==STRUCTURE_WALL||(e.memory.wallPos=r.pos,e.setState(v.RepairWall)))}else e.setState(v.Waiting)}function a(e){if(0===e.carry[RESOURCE_ENERGY])return e.memory.targetSite=void 0,e.setState(v.Tanking),void s(e)
var r=Game.getObjectById(e.memory.targetSite)
if(r instanceof Structure||(r=u(e)),null===r)return e.memory.targetSite=void 0,void e.setState(v.Waiting)
var o=e.repair(r)
o===OK?(void 0===Memory.stats["room."+e.room.name+".wallsRepaired"]&&(Memory.stats["room."+e.room.name+".wallsRepaired"]=0),Memory.stats["room."+e.room.name+".wallsRepaired"]+=e.getActiveBodyparts(WORK)):o===ERR_NOT_IN_RANGE&&e.travelTo(r),r.hits===r.hitsMax&&(e.memory.targetSite=void 0,e.setState(v.Waiting))}function i(e){if(0===e.carry[RESOURCE_ENERGY])return e.memory.targetSite=void 0,e.memory.rampartPos=void 0,e.setState(v.Tanking),void s(e)
var r=Game.getObjectById(e.memory.targetSite)
if(null===r&&(r=l(e)),null===r)return e.memory.targetSite=void 0,e.memory.rampartPos=void 0,void e.setState(v.Waiting)
e.memory.targetSite=r.id
var o=e.repair(r)
o===OK?(void 0===Memory.stats["room."+e.room.name+".wallsRepaired"]&&(Memory.stats["room."+e.room.name+".wallsRepaired"]=0),Memory.stats["room."+e.room.name+".wallsRepaired"]+=e.getActiveBodyparts(WORK)):o===ERR_NOT_IN_RANGE&&e.travelTo(r),r.hits===r.hitsMax&&(e.memory.targetSite=void 0,e.setState(v.Waiting))}function s(e){var r=Game.rooms[e.memory.homeroom],o=r.storage
if(void 0===o){var t=R.getBuildingIdForTanking(e.room)
if(null===(o=Game.getObjectById(t)))return void console.log("BaseBuilder without energy pickup "+r.name)}y(e,o)?1===e.pos.getRangeTo(o)?(e.withdraw(o,RESOURCE_ENERGY),e.setState(v.Waiting)):e.travelTo(o):f.moveOffRoad(e)}function l(e){if(void 0===e.memory.wallPos||void 0===e.memory.wallPos.x)return null
var r=new RoomPosition(e.memory.wallPos.x,e.memory.wallPos.y,e.memory.wallPos.roomName).lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(s.structureType===STRUCTURE_WALL||s.structureType===STRUCTURE_RAMPART)return s}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}return null}function m(e){var r=e.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
if(void 0===r||null===r){var o=e.room.find(FIND_HOSTILE_CONSTRUCTION_SITES,{filter:function(e){return e.structureType===STRUCTURE_EXTRACTOR}})
return o.length>0&&void 0!==e.room.controller&&e.room.controller.level>5&&e.room.controller.my?(e.memory.targetSite=o[0].id,o[0]):(e.memory.targetSite=void 0,null)}return e.memory.targetSite=r.id,r}function u(e){var r=e.room.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_RAMPART||e.structureType===STRUCTURE_WALL}})
if(0===r.length)return e.memory.targetSite=void 0,null
var o=RAMPART_HITS_MAX[8],t=null,n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
m.hits<o&&(o=m.hits,t=m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return null===t?null:(e.memory.targetSite=t.id,t)}function y(e,r){return void 0!==r&&r.structureType!==STRUCTURE_STORAGE||(r.store[RESOURCE_ENERGY]>2e4||r.store[RESOURCE_ENERGY]>5e3&&g.getRoomLevel(e.room)<d.RoomLevel.Metropolis)}var v,c=o(7),d=o(11),f=o(33),g=o(10),R=o(34)
!function(e){e[e.Waiting=1]="Waiting",e[e.Constructing=2]="Constructing",e[e.Fortify=3]="Fortify",e[e.Tanking=4]="Tanking",e[e.RepairWall=5]="RepairWall"}(v||(v={})),r.run=function(e){switch(e.hasState()||e.setState(v.Waiting),e.getState()){case v.Waiting:t(e)
break
case v.Constructing:n(e)
break
case v.Fortify:a(e)
break
case v.RepairWall:i(e)
break
case v.Tanking:s(e)
break
default:c.log.error("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState(),e.room.name),e.setState(v.Waiting)}}},function(e,r,o){var t=o(14),n=o(18),a=o(19),i=o(20),s=o(29),l=o(16),m=o(17),u=o(125),y=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"MaintainenceManager"))
return t.MEMORY_LASTRUN="lastRun",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(e===t.ManagerPriority.Standard)this.creepService.runCreeps(l.Role.Janitor,u.run)
else if(e===t.ManagerPriority.Low){var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+100<Game.time){var o=this.roomService.getNormalRoomsNotAbandoned(),n=!0,a=!1,i=void 0
try{for(var m,y=o[Symbol.iterator]();!(n=(m=y.next()).done);n=!0){var v=m.value
s.roomShouldHaveJanitors(v)&&this.orderJanitor(v)}}catch(e){a=!0,i=e}finally{try{!n&&y.return&&y.return()}finally{if(a)throw i}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}}},{key:"orderJanitor",value:function(e){if(!(n.getNumberOfTiersInQueue(e,l.Role.Janitor,e.name)+this.creepService.getNumberOfTiers(l.Role.Janitor,e.name)>0)){var r=a.getMaxTierDistanceWorker(e.energyCapacityAvailable),o=new i.Order
o.body=a.getDistanceWorkerBody(r),o.priority=m.Priority.Important,o.memory={role:l.Role.Janitor,target:e.name,tier:r},n.orderCreep(e,o)}}}]),r}()
r.MaintainenceManager=y},function(e,r,o){function t(e){return void 0!==e.memory.sleep&&e.memory.sleep>0?(e.memory.sleep--,void g.moveOffRoad(e)):void 0!==u(e)?(e.setState(f.Building),void i(e)):null!==y(e)?(e.setState(f.Repairing),void a(e)):e.isFull()?(e.memory.sleep=50,void g.moveOffRoad(e)):(e.setState(f.Tanking),void n(e))}function n(e){if(e.isEmpty()&&e.ticksToLive<50)e.suicide()
else{if(e.isFull())return e.setState(f.Sleeping),void t(e)
var r=s(e)
void 0!==r?r instanceof Resource?e.pickup(r)===ERR_NOT_IN_RANGE&&e.travelTo(r):e.withdraw(r,RESOURCE_ENERGY)===ERR_NOT_IN_RANGE&&e.travelTo(r):e.setState(f.Sleeping)}}function a(e){if(e.isEmpty())return e.setState(f.Tanking),l(e),void n(e)
var r=Game.getObjectById(e.memory.targetSite)
null!==r&&g.targetRoomHasInvaders(e,r.room.name)||(null!==r&&r.hits!==r.hitsMax||(e.memory.targetSite=void 0,r=y(e)),r instanceof Structure&&(e.pos.roomName!==r.pos.roomName||p.positionIsBorder(e.pos)||e.pos.getRangeTo(r)>3?(m(e),e.travelTo(r,{range:0})):e.repair(r)),null===r&&e.setState(f.Sleeping))}function i(e){if(e.isEmpty())return e.setState(f.Tanking),l(e),void n(e)
var r=Game.getObjectById(e.memory.targetSite)
null===r&&(r=u(e)),null!==r&&void 0!==r&&void 0!==r.room&&g.targetRoomHasInvaders(e,r.room.name)||(r instanceof ConstructionSite?e.pos.roomName!==r.pos.roomName||p.positionIsBorder(e.pos)||e.pos.getRangeTo(r)>3?(m(e),e.travelTo(r,{range:0})):e.build(r):(e.memory.targetSite=void 0,e.setState(f.Sleeping)))}function s(e){var r=Game.getObjectById(e.memory.tankingId)
if(null===r&&(l(e),r=Game.getObjectById(e.memory.tankingId)),null!==r){if(r instanceof Resource&&r.resourceType===RESOURCE_ENERGY&&r.amount>100)return r
if(r instanceof Structure&&r.store[RESOURCE_ENERGY]>100)return r}e.memory.tankingId=void 0}function l(e){if(e.isInHomeroom()){var r=Game.getObjectById(R.getBuildingIdForTanking(e.room))
e.memory.tankingId=r.id}else if(e.room.memory.isPraiseRoom&&void 0!==e.room.terminal&&e.room.terminal.store[RESOURCE_ENERGY]>1e3)e.memory.tankingId=e.room.terminal.id
else{var o=e.room.find(FIND_DROPPED_RESOURCES,{filter:function(e){return e.amount>200&&e.resourceType===RESOURCE_ENERGY}})
if(o.length>0){var t=e.pos.findClosestByRange(o)
e.memory.tankingId=t.id}else{var n=e.room.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_CONTAINER&&e.store[RESOURCE_ENERGY]>200}})
if(n.length>0){var a=e.pos.findClosestByRange(n)
e.memory.tankingId=a.id}else{var i=Game.getObjectById(R.getBuildingIdForTanking(Game.rooms[e.getHomeroom()]))
null!==i?e.memory.tankingId=i.id:console.log("No tankingbuilding found for janitor: "+e.room)}}}}function m(e){var r=e.pos.lookFor(LOOK_STRUCTURES),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
s.structureType===STRUCTURE_ROAD&&s.hitsMax-s.hits>500&&e.repair(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}function u(e){if(void 0!==e.memory.homeroom&&null!==Game.rooms[e.memory.homeroom]&&void 0!==Game.rooms[e.memory.homeroom]){var r=h.getBasicOutposts(Game.rooms[e.memory.homeroom]),o=!0,t=!1,n=void 0
try{for(var a,i=r.concat(Game.rooms[e.memory.homeroom].memory.praiseroom)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
if(Game.rooms[s]instanceof Room){var l=Game.rooms[s].find(FIND_MY_CONSTRUCTION_SITES)
if(l.length>0){var m=l[0]
return e.pos.roomName===s&&(m=e.pos.findClosestByRange(l)),e.memory.targetSite=m.id,m}}}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}}if(void 0!==e.memory.homeroom&&null!==Game.rooms[e.memory.homeroom]&&void 0!==Game.rooms[e.memory.homeroom]){var u=h.getLairOutposts(Game.rooms[e.memory.homeroom]),y=!0,v=!1,c=void 0
try{for(var d,f=u[Symbol.iterator]();!(y=(d=f.next()).done);y=!0){var g=d.value
if(Game.rooms[g]instanceof Room){var R=Game.rooms[g].find(FIND_MY_CONSTRUCTION_SITES)
if(R.length>0){var p=R[0]
return e.pos.roomName===g&&(p=e.pos.findClosestByRange(R)),e.memory.targetSite=p.id,p}}}}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}}}function y(e){var r=Game.rooms[e.memory.homeroom]
if(void 0===e.memory.homeroom||void 0===r)return null
var o=v(r),t=c(r)
return void 0!==o&&void 0!==t?o.hitsMax-o.hits>t.hitsMax-t.hits?(e.memory.targetSite=o.id,o):(e.memory.targetSite=t.id,t):void 0!==t?(e.memory.targetSite=t.id,t):void 0!==o?(e.memory.targetSite=o.id,o):(e.memory.targetSite=void 0,null)}function v(e){var r=e.find(FIND_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_ROAD&&e.hitsMax-e.hits>3e3||e.structureType===STRUCTURE_CONTAINER&&e.hitsMax-e.hits>15e4}}),o=void 0,t=void 0,n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0)t=s.value,void 0===o?o=t:o.hitsMax-o.hits<t.hitsMax-t.hits&&(o=t)}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return o}function c(e){var r=e.memory.roads,o=d(e)
if(o.length>0)return o[0]
if(void 0!==r&&!_.isNull(r)){var t=void 0,n=!0,a=!1,i=void 0
try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value,u=Game.getObjectById(m)
u instanceof StructureRoad&&u.hitsMax-u.hits>3e3&&(void 0===t?t=u:t.hitsMax-t.hits<u.hitsMax-u.hits&&(t=u))}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t}}function d(e){var r=[],o=h.getLairOutposts(e)
e.memory.praiseroomHibernated||(o=o.concat(e.memory.praiseroom))
var t=!0,n=!1,a=void 0
try{for(var i,s=o.concat(e.memory.praiseroom)[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(Game.rooms[l]instanceof Room){var m=Game.rooms[l].getMineral()
if(void 0!==m&&void 0===m.ticksToRegeneration){var u=m.getMiningContainer()
null!==u&&u.hitsMax-u.hits>1e5&&r.push(u)}}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return r}var f,g=o(33),R=o(34),p=o(45),h=o(10)
!function(e){e[e.Sleeping=1]="Sleeping",e[e.Tanking=2]="Tanking",e[e.Repairing=3]="Repairing",e[e.Building=4]="Building"}(f||(f={})),r.run=function(e){if(g.isCloseToSourceKeeper(e)){var r=g.getTravelDestinasion(e)
void 0!==r?g.positionIsCloseToSourceKeeper(r)?g.stayAwayFromSourceKeeper(e):e.travelTo({pos:r},{avoidKeepers:!0}):g.stayAwayFromSourceKeeper(e)}else if(!g.moveHomeAndHealIfHurt(e))switch(e.hasState()||e.setState(f.Tanking),e.getState()){case f.Sleeping:t(e)
break
case f.Tanking:n(e)
break
case f.Building:i(e)
break
case f.Repairing:a(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(f.Sleeping)}}},function(e,r,o){function t(e){if(void 0===e.storage)return!1
var r=e.find(FIND_MY_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_EXTENSION}}),o=!0,t=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
if(!n(l))return c(l.pos,e.storage.pos),!0}}catch(e){t=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw a}}return!1}function n(e){for(var r=[-1,0,1],o=0;o<r.length;o++)for(var t=r[o],n=[-1,0,1],a=0;a<n.length;a++){var i=n[a],s=new RoomPosition(e.pos.x+t,e.pos.y+i,e.pos.roomName),l=s.lookFor(LOOK_CONSTRUCTION_SITES),m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0)if(v.value.structureType===STRUCTURE_ROAD)return!0}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}var d=s.lookFor(LOOK_STRUCTURES),f=!0,g=!1,R=void 0
try{for(var p,h=d[Symbol.iterator]();!(f=(p=h.next()).done);f=!0)if(p.value.structureType===STRUCTURE_ROAD)return!0}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}}return!1}function a(e,r){var o=R.getBasePosition(e)
return void 0===o?[]:(void 0!==e.storage&&(o=e.storage.pos),d(o,r,R.isMiddleRoom(r.roomName)))}function i(e){var r=[],o=!0,t=!1,n=void 0
try{for(var a,i=p.sourceIds(e.name)[Symbol.iterator]();!(o=(a=i.next()).done);o=!0){var s=a.value
r.push(s)}}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var l=R.getAllOutposts(e),m=!0,u=!1,y=void 0
try{for(var v,c=l[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(void 0!==Game.rooms[d]&&void 0!==Game.rooms[d].name&&p.hasIntel(d)){var f=!0,g=!1,h=void 0
try{for(var E,S=p.sourceIds(d)[Symbol.iterator]();!(f=(E=S.next()).done);f=!0){var T=E.value
r.push(T)}}catch(e){g=!0,h=e}finally{try{!f&&S.return&&S.return()}finally{if(g)throw h}}}}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}return r}function s(e){var r=e.find(FIND_MINERALS)
if(1===r.length)return r[0].id}function l(e){var r=[],o=R.getLairOutposts(e)
if(o.length>0){var t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(void 0!==Game.rooms[l]&&void 0!==Game.rooms[l].name&&p.hasIntel(l)){var m=Game.rooms[l].find(FIND_MINERALS)
1===m.length&&r.push(m[0].id)}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}return r}function m(e){if(void 0!==e.memory.praiseroom&&!e.memory.praiseroomHibernated){var r=Game.rooms[e.memory.praiseroom]
if(void 0!==r&&void 0!==r.controller)return r.controller.id}}function u(e){if(void 0!==e.memory.praiseroom&&!e.memory.praiseroomHibernated){var r=Game.rooms[e.memory.praiseroom]
if(void 0!==r&&void 0!==r.controller){var o=r.find(FIND_MINERALS)
if(1===o.length)return o[0].id}}}function y(e){if(e.x<=0||e.x>=49||e.y<=0||e.y>=49)return-100
var r=Game.map.getTerrainAt(e)
if("plain"!==r&&"swamp"!==r)return-100
var o=e.lookFor(LOOK_STRUCTURES),t=e.lookFor(LOOK_CONSTRUCTION_SITES),n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
if(m.structureType!==STRUCTURE_ROAD&&m.structureType!==STRUCTURE_RAMPART)return-100
if(m.structureType===STRUCTURE_ROAD)return-100}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}var u=!0,y=!1,v=void 0
try{for(var c,d=t[Symbol.iterator]();!(u=(c=d.next()).done);u=!0){var f=c.value
if(f.structureType!==STRUCTURE_ROAD&&f.structureType!==STRUCTURE_RAMPART)return-100
if(f.structureType===STRUCTURE_ROAD)return-100}}catch(e){y=!0,v=e}finally{try{!u&&d.return&&d.return()}finally{if(y)throw v}}return e.createConstructionSite(STRUCTURE_ROAD)}function v(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],t=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n=arguments.length>4&&void 0!==arguments[4]&&arguments[4]
if(r<1||f())return!1
var a=Game.rooms[e.roomName]
if(void 0===a||!(a instanceof Room))return!0
for(var i=-r;i<r+1;i++)for(var s=-r;s<r+1;s++){var l=new RoomPosition(e.x+i,e.y+s,e.roomName)
if((n||0!==i||0!==s)&&!(f()||o&&"swamp"!==Game.map.getTerrainAt(l)||t&&!(Math.abs(i)+Math.abs(s)<r+1))&&y(l)===ERR_FULL)return!1}return!0}function c(e,r){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],t=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n=arguments.length>4&&void 0!==arguments[4]&&arguments[4],a=g.getRoadPathBetween(e,r,n),i=!0,s=!1,l=void 0
try{for(var m,u=a[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var c=m.value,d=Game.rooms[c.roomName]
if(void 0!==d&&d instanceof Room&&!f()&&(!o||"swamp"===Game.map.getTerrainAt(c))){if(y(c)===ERR_FULL)return!1
t&&v(c,1,!0,!0)}}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return!0}function d(e,r){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],t=g.getRoadPathBetween(e,r,o),n=[],a=!0,i=!1,s=void 0
try{for(var l,m=t[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=Game.rooms[u.roomName]
if(void 0!==y&&y instanceof Room){var v=u.lookFor(LOOK_STRUCTURES),c=!0,d=!1,f=void 0
try{for(var R,p=v[Symbol.iterator]();!(c=(R=p.next()).done);c=!0){var h=R.value
h.structureType===STRUCTURE_ROAD&&n.push(h.id)}}catch(e){d=!0,f=e}finally{try{!c&&p.return&&p.return()}finally{if(d)throw f}}}}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}return n}function f(){return Object.keys(Game.constructionSites).length>60}var g=o(3),R=o(10),p=o(5),h=o(14),E=function e(){_classCallCheck(this,e)},S=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"RoadManager"))
return o.MEMORY_LASTRUN="lastRun",o.MEMORY_TICKLASTINDEX="tickIndex",o.MEMORY_LASTRUN_EXTENSIONROADS="tickExtRoads",o.MEMORY_INDEX_EXTENSIONROADS="indexExtRoads",o.MEMORY_LASTINDEX="lastIndex",o.MEMORY_LOADEDINDEX="loadedIndex",o.MEMORY_SEGMENTTOLOAD="segLoad",o.roomService=e,o}return _inherits(r,h.Manager),_createClass(r,[{key:"run",value:function(e){if(e===h.ManagerPriority.Low){var r=this.getValue(this.MEMORY_TICKLASTINDEX);(void 0===r||r+1e3<Game.time)&&(this.setValue(this.MEMORY_LASTINDEX,R.getLastIndex()),this.setValue(this.MEMORY_TICKLASTINDEX,Game.time))
var o=this.getValue(this.MEMORY_LASTRUN)
if(void 0===o||o+20<Game.time){var n=this.updateRoadSegmentForLoadedRoom()
void 0!==n&&this.saveRoadsNeedingRepairingToMemory(n),this.setValue(this.MEMORY_LASTRUN,Game.time)}this.requestSegmentForNextTick()}if(e===h.ManagerPriority.Trivial){var a=this.getValue(this.MEMORY_LASTRUN_EXTENSIONROADS)
if(void 0===a||a+100<Game.time){var i=this.getValue(this.MEMORY_INDEX_EXTENSIONROADS)
void 0===i&&(i=1)
var s=!0,l=R.getRoomForIndex(i)
void 0!==l&&R.roomShouldBuild(l)&&(s=!t(l))
var m=this.getValue(this.MEMORY_LASTINDEX)
if(void 0===m)return void console.log("Error with lastIndex in RoadManager.")
if(s){var u=i+1
u>m&&(u=1),this.setValue(this.MEMORY_INDEX_EXTENSIONROADS,u)}this.setValue(this.MEMORY_LASTRUN_EXTENSIONROADS,Game.time)}}}},{key:"updateRoadSegmentForLoadedRoom",value:function(){var e=Game.cpu.getUsed(),r=this.getValue(this.MEMORY_SEGMENTTOLOAD)
void 0===r&&(this.setValue(this.MEMORY_SEGMENTTOLOAD,51),r=51)
var o=this.loadRoadInfoFromSegment(r),t=R.getRoomForIndex(r-50),n=!0
if(void 0!==o&&void 0!==t&&void 0!==t.controller&&t.controller.my&&(t.controller.level>2||2===t.controller.level&&t.controller.progress>.5*t.controller.progressTotal)&&(void 0!==t.storage||void 0!==t.getBaseContainer())){t.name!==o.roomName&&(o.roomName=t.name,o.roads={})
var i=this.getRoadTargetIds(t),s=!0,l=!1,m=void 0
try{for(var u,y=i[Symbol.iterator]();!(s=(u=y.next()).done);s=!0){var v=u.value,d=Game.getObjectById(v)
if(null!==d&&void 0!==d.pos&&d.pos instanceof RoomPosition&&(void 0===o.roads[v]||o.roads[v].timePositions+5e3<Game.time)&&(void 0===o.roads[v]?o.roads[v]={timePositions:Game.time,timeBuilt:0,positions:a(t,this.getRoadTargetFor(d))}:(o.roads[v].timePositions=Game.time,o.roads[v].positions=a(t,this.getRoadTargetFor(d)))),Game.cpu.getUsed()>e+40){n=!1
break}}}catch(e){l=!0,m=e}finally{try{!s&&y.return&&y.return()}finally{if(l)throw m}}var g=!0,p=!1,h=void 0
try{for(var E,S=Object.keys(o.roads)[Symbol.iterator]();!(g=(E=S.next()).done);g=!0){var T=E.value
if(o.roads[T].timePositions+2e4<Game.time)delete o.roads[T],console.log("Deleting target for road no longer valid: "+T+" for room "+o.roomName)
else{if(t.find(FIND_MY_CONSTRUCTION_SITES).length>0||f()||void 0===t.storage&&void 0===t.getBaseContainer()||void 0!==t.storage&&!t.storage.isActive()||void 0!==t.storage&&t.storage.store[RESOURCE_ENERGY]<3e4)break
if(void 0===o.roads[T].timeBuilt||o.roads[T].timeBuilt+5e3<Game.time){o.roads[T].timeBuilt=Game.time
var C=R.getBasePosition(t),O=Game.getObjectById(T)
void 0!==C&&null!==O&&(void 0!==t.storage&&(C=t.storage.pos),c(C,this.getRoadTargetFor(O),!1,!1,R.isMiddleRoom(O.room.name)))}if(Game.cpu.getUsed()>e+80)break}}}catch(e){p=!0,h=e}finally{try{!g&&S.return&&S.return()}finally{if(p)throw h}}}if(void 0!==o?(Memory.stats["roads."+o.roomName+".total"]=_.sum(o.roads,function(e){return e.positions.length}),RawMemory.segments[r]=JSON.stringify(o)):RawMemory.segments[r]="",n){var M=this.getValue(this.MEMORY_LASTINDEX)
if(void 0===M)return void console.log("Error with lastIndex in RoadManager.")
var b=r+1
b>M+50&&(b=51),this.setValue(this.MEMORY_SEGMENTTOLOAD,b)}return o}},{key:"saveRoadsNeedingRepairingToMemory",value:function(e){if(void 0!==e&&void 0!==e.roomName&&void 0!==e.roads){var r=Game.rooms[e.roomName]
if(!(void 0===r||void 0===r.controller||r.isExpansion()||void 0!==r.memory.roadsUpdate&&r.memory.roadsUpdate+300>Game.time)){var o=[],t=void 0,n=void 0,a=!0,i=!1,s=void 0
try{for(var l,m=Object.keys(e.roads)[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var u=l.value,y=!0,v=!1,c=void 0
try{for(var d,f=e.roads[u].positions[Symbol.iterator]();!(y=(d=f.next()).done);y=!0)t=d.value,(n=Game.getObjectById(t))instanceof StructureRoad&&n.hitsMax-n.hits>2e3&&o.push(n.id)}catch(e){v=!0,c=e}finally{try{!y&&f.return&&f.return()}finally{if(v)throw c}}}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}r.memory.roads=_.unique(o),Memory.stats["roads."+e.roomName+".repair"]=r.memory.roads.length,r.memory.roadsUpdate=Game.time}}}},{key:"requestSegmentForNextTick",value:function(){var e=this.getValue(this.MEMORY_SEGMENTTOLOAD)
void 0===e?this.setValue(this.MEMORY_SEGMENTTOLOAD,51):RawMemory.setActiveSegments([e])}},{key:"getRoadTargetIds",value:function(e){var r=i(e),o=void 0
void 0!==e.controller&&e.controller.my&&e.controller.level>=6&&(o=s(e))
var t=m(e),n=u(e),a=l(e),y=[]
return void 0!==e.controller&&y.push(e.controller.id),r.length>0&&(y=y.concat(r)),void 0!==o&&y.push(o),void 0!==t&&y.push(t),void 0!==n&&y.push(n),a.length>0&&(y=y.concat(a)),y}},{key:"loadRoadInfoFromSegment",value:function(e){if(void 0!==e&&_.contains(Object.keys(RawMemory.segments),""+e)){var r=void 0
if("string"==typeof RawMemory.segments[e]&&RawMemory.segments[e].length>0&&(r=JSON.parse(RawMemory.segments[e])),void 0===r||void 0===r.roomName){r=new E
var o=R.getRoomForIndex(e-50)
if(void 0===o){var t=e+1
return t>this.getValue(this.MEMORY_LASTINDEX)+50&&(t=51),void this.setValue(this.MEMORY_SEGMENTTOLOAD,t)}r.roomName=o.name}return void 0===r.roads&&(r.roads={}),r}}},{key:"getRoadTargetFor",value:function(e){if(e instanceof StructureController){var r=e.getContainerPosition()
if(void 0!==r)return r
if(void 0!==e.room.storage)return e.room.storage.pos}else if(e instanceof Source){var o=e.getContainerPosition()
if(void 0!==o)return o}else if(e instanceof Mineral){var t=e.getContainerPosition()
if(void 0!==t)return t}return e.pos}}]),r}()
r.RoadManager=S,r.deleteAllFlags=function(){var e=Game.flags
for(var r in e)Game.flags[r].remove()},r.simBuildRoadBetween=function(e,r){var o=g.getRoadPathBetween(e,r)
console.log("Path length: "+o.length)
var t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value,m=Game.rooms[l.roomName]
void 0!==m&&m instanceof Room&&l.createFlag()}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return!0},r.buildRoadAroundPosition=v},function(e,r,o){function t(e){switch(e.memory.lab.labstatus){case R.Labstatus.Inactive:u(e)
break
case R.Labstatus.GettingMineralsToTerminal:l(e)
break
case R.Labstatus.MovingMineralsToLab:s(e)
break
case R.Labstatus.RunningReactions:a(e)
break
case R.Labstatus.EmptyingLabs:n(e)
break
case R.Labstatus.EmptyingAllLabs:u(e)
break
default:e.memory.lab.labstatus=R.Labstatus.Inactive}}function n(e){if(void 0!==e.terminal){var r=e.getProcessingLabs(),o=!0,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0)i.value.mineralAmount>0&&(o=!1)}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}o&&(e.isAbandoned()&&(console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks</span>"),e.memory.lab.inactiveUntil=Game.time+1e3,e.memory.lab.labstatus=R.Labstatus.Inactive),e.memory.lab.cooldown>0?e.memory.lab.cooldown--:(e.memory.lab.cooldown=void 0,v(e)))}}function a(e){if(void 0!==e.terminal){var r=e.getSupplyingLabs()
if(2!==r.length||0===r[0].mineralAmount||0===r[1].mineralAmount){e.memory.lab.batchSize
return e.terminal.store[e.memory.lab.activeMineral]>0&&e.memory.lab.activeMineral+e.terminal.store[e.memory.lab.activeMineral],e.memory.lab.cooldown=10,void(e.memory.lab.labstatus=R.Labstatus.EmptyingLabs)}var o=e.getProcessingLabs(),t=!0,n=!1,a=void 0
try{for(var i,s=o[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
0===l.cooldown&&l.runReaction(r[0],r[1])}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}}}function i(e){var r=e.getSupplyingLabs()
if(2!==r.length)return console.log("Error with supplylabs: "+e.name),[]
var o=S[e.memory.lab.activeMineral]
if(2!==o.length)return console.log("Error with requiredMinerals for supplying labs: "+e.name),[]
var t=[],n=new b
n.amount=e.memory.lab.batchSize,n.lab=r[0].id,n.mineral=o[0],t.push(n)
var a=new b
return a.amount=e.memory.lab.batchSize,a.lab=r[1].id,a.mineral=o[1],t.push(a),t}function s(e){if(void 0!==e.terminal)if(void 0===e.memory.lab.supplyJobs&&(e.memory.lab.supplyJobs=i(e)),2===e.memory.lab.supplyJobs.length){var r=!0,o=!1,t=void 0
try{for(var n,a=e.memory.lab.supplyJobs[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var s=n.value,l=Game.getObjectById(s.lab)
if(l.mineralAmount<s.amount||0===l.mineralAmount||l.mineralType!==s.mineral)return}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}e.memory.lab.supplyJobs=void 0,e.memory.lab.labstatus=R.Labstatus.RunningReactions}else console.log("Error with supplyjobs: "+e.name)}function l(e){if(void 0!==e.terminal){var r=S[e.memory.lab.activeMineral]
if(void 0!==r){var o=!0,t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
if(void 0===e.terminal.store[l]||e.terminal.store[l]<e.memory.lab.batchSize){o=!1
var m=e.memory.lab.batchSize
if(void 0!==e.terminal.store[l]&&(m-=e.terminal.store[l]),void 0===S[l])return void E.requestMineralsForLabs(e,l,m)}}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}o&&(e.memory.lab.labstatus=R.Labstatus.MovingMineralsToLab)}else console.log("Error with required minerals: "+e.name)}}function m(e){var r=e.getProcessingLabs(),o=!0,t=!1,n=void 0
try{for(var a,i=r[Symbol.iterator]();!(o=(a=i.next()).done);o=!0)if(a.value.mineralAmount>0)return!1}catch(e){t=!0,n=e}finally{try{!o&&i.return&&i.return()}finally{if(t)throw n}}var s=e.getSupplyingLabs(),l=!0,m=!1,u=void 0
try{for(var y,v=s[Symbol.iterator]();!(l=(y=v.next()).done);l=!0)if(y.value.mineralAmount>0)return!1}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}return!0}function u(e){if(void 0!==e.terminal){if(!m(e))return e.memory.lab.labstatus=R.Labstatus.EmptyingAllLabs,console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs seems to have had some problems during the last operation. Sending minerals to the terminal.</span>"),void(e.memory.lab.inactiveUntil=Game.time+10)
if(e.memory.lab.labstatus=R.Labstatus.Inactive,e.isAbandoned())return console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are inactive as the room is abandoned, putting to sleep for 1000 ticks</span>"),void(e.memory.lab.inactiveUntil=Game.time+1e3)
var r=!1
for(var o in T)if((void 0===e.terminal.store[o]||e.terminal.store[o]<T[o])&&(r=!0,e.memory.lab.batchSize=1e3,0===y(e,o))){if(e.memory.lab.mineralQueue=c(o),e.memory.lab.activeMineral=e.memory.lab.mineralQueue.shift(),void 0===e.memory.lab.activeMineral)return
return e.memory.lab.labstatus=R.Labstatus.GettingMineralsToTerminal,e.memory.lab.wantedMineral=o,void console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are starting production of "+e.memory.lab.batchSize+" "+e.memory.lab.wantedMineral+"</span>")}if(!r)for(var t in C)if((void 0===e.terminal.store[t]||e.terminal.store[t]<C[t])&&(e.memory.lab.batchSize=2e3,0===y(e,t))){if(e.memory.lab.mineralQueue=c(t),e.memory.lab.activeMineral=e.memory.lab.mineralQueue.shift(),void 0===e.memory.lab.activeMineral)return
return e.memory.lab.labstatus=R.Labstatus.GettingMineralsToTerminal,e.memory.lab.wantedMineral=t,void console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are starting production of "+e.memory.lab.batchSize+" "+e.memory.lab.wantedMineral+"</span>")}console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are inactive, putting to sleep for 1000 ticks</span>"),e.memory.lab.inactiveUntil=Game.time+1e3}}function y(e,r){var o=d(r)
if(void 0===e.terminal)return Object.keys(o).length
var t=0,n=!0,a=!1,i=void 0
try{for(var s,l=Object.keys(o)[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value;(void 0===e.terminal.store[m]||e.terminal.store[m]<o[m]*e.memory.lab.batchSize)&&t++}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t}function v(e){e.memory.lab.mineralQueue.length>0?(e.memory.lab.activeMineral=e.memory.lab.mineralQueue.shift(),e.memory.lab.labstatus=R.Labstatus.GettingMineralsToTerminal,e.memory.lab.labstatus=R.Labstatus.GettingMineralsToTerminal):(console.log("<span style='color:#B3CC99'><a href='#!/room/"+e.name+"'>"+e.name+"</a> Labs are finished producing "+e.memory.lab.batchSize+" "+e.memory.lab.wantedMineral+"</span>"),e.memory.lab.labstatus=R.Labstatus.Inactive,e.memory.lab.mineralQueue=void 0,e.memory.lab.activeMineral=void 0,e.memory.lab.wantedMineral=void 0)}function c(e){return g(e)}function d(e){var r=f(e),o={},t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
void 0===o[l]?o[l]=1:o[l]++}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}return o}function f(e){return void 0===S[e]||_.isEmpty(e)?[e]:f(S[e][0]).concat(f(S[e][1]))}function g(e){return void 0===S[e]||_.isEmpty(e)?[]:g(S[e][0]).concat(g(S[e][1]),e)}var R=o(40),p=o(11),h=o(10),E=o(85),S={OH:["O","H"],LH:["L","H"],KH:["K","H"],UH:["U","H"],ZH:["Z","H"],GH:["G","H"],LO:["L","O"],KO:["K","O"],UO:["U","O"],ZO:["Z","O"],GO:["G","O"],ZK:["K","Z"],UL:["U","L"],UH2O:["UH","OH"],UHO2:["UO","OH"],ZH2O:["ZH","OH"],ZHO2:["ZO","OH"],KH2O:["KH","OH"],KHO2:["KO","OH"],LH2O:["LH","OH"],LHO2:["LO","OH"],GH2O:["GH","OH"],GHO2:["GO","OH"],XUH2O:["UH2O","X"],XUHO2:["UHO2","X"],XLH2O:["LH2O","X"],XLHO2:["LHO2","X"],XKH2O:["KH2O","X"],XKHO2:["KHO2","X"],XZH2O:["ZH2O","X"],XZHO2:["ZHO2","X"],XGH2O:["GH2O","X"],XGHO2:["GHO2","X"],G:["UL","ZK"]},T={XGHO2:1e3,XLHO2:1e3,XZHO2:1e3,XZH2O:1e3,XKHO2:1e3,XUH2O:1e3,GHO2:1e3,LHO2:1e3,ZHO2:1e3,ZH2O:1e3,UH2O:1e3,KHO2:1e3,GO:1e3,LO:1e3,ZO:1e3,ZH:1e3,UH:1e3,KO:1e3},C={UH:2e3,KO:3e3,XGHO2:1e4,XLHO2:1e4,XZHO2:6e3,XZH2O:6e3,XKHO2:8e3,XUH2O:8e3,G:4e3,XLH2O:2e3,LH:2e3,XUHO2:2e3,XKH2O:2e3,XGH2O:12e3},O=o(14),M=function(e){function r(e){_classCallCheck(this,r)
var o=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"LabManager"))
return o.roomService=e,o}return _inherits(r,O.Manager),_createClass(r,[{key:"run",value:function(e){if(e===O.ManagerPriority.Trivial){var r=this.roomService.getNormalAndNotExpansion(),o=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
h.getRoomLevel(l)>=p.RoomLevel.Town&&l.hasLabArea()&&(void 0===l.memory.lab.inactiveUntil||l.memory.lab.inactiveUntil<Game.time)&&t(l)}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}}}}]),r}()
r.LabManager=M
var b=function e(){_classCallCheck(this,e)}
r.getRequiredBasicMineralsForMineral=d},function(e,r,o){var t=o(19),n=o(3),a=o(18),i=o(129),s=o(130),l=o(131),m=o(14),u=o(5),y=o(20),v=o(10),c=o(16),d=o(17),f=o(11),g=o(6),R=o(7),p=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"PoachingManager"))
return t.MEMORY_LASTRUN="lastRun",t.MEMORY_LASTRUNBOT="lastRunBot",t.roomService=e,t.creepService=o,t}return _inherits(r,m.Manager),_createClass(r,[{key:"run",value:function(e){if(!0!==Memory.settings.slow){if(e===m.ManagerPriority.Standard)this.creepService.runCreeps(c.Role.PoachGuard,i.run)
else if(e===m.ManagerPriority.Low){this.creepService.runCreeps(c.Role.PoachHauler,l.run),this.creepService.runCreeps(c.Role.PoachMiner,s.run)
var r=this.getValue(this.MEMORY_LASTRUN)
if(void 0===r||r+50<Game.time){var o=this.roomService.getNormalRoomsNotAbandoned(),t=!0,n=!1,a=void 0
try{for(var u,y=o[Symbol.iterator]();!(t=(u=y.next()).done);t=!0){var d=u.value
void 0!==d.memory.poaching&&!d.isUnderSiege()&&v.getRoomLevel(d)>=f.RoomLevel.City&&this.runPoaching(d)}}catch(e){n=!0,a=e}finally{try{!t&&y.return&&y.return()}finally{if(n)throw a}}this.setValue(this.MEMORY_LASTRUN,Game.time)}}if(e===m.ManagerPriority.Trivial&&!0===Memory.settings.bot){var g=this.getValue(this.MEMORY_LASTRUNBOT)
if(void 0===g||g+500<Game.time){var R=this.roomService.getNormalRoomsNotAbandoned(),p=!0,h=!1,E=void 0
try{for(var S,T=R[Symbol.iterator]();!(p=(S=T.next()).done);p=!0){var C=S.value
v.getRoomLevel(C)>=f.RoomLevel.City&&!C.isUnderSiege()&&this.setBotPoachingRoom(C)}}catch(e){h=!0,E=e}finally{try{!p&&T.return&&T.return()}finally{if(h)throw E}}this.setValue(this.MEMORY_LASTRUNBOT,Game.time)}}}}},{key:"runPoaching",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e.memory.poaching[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=Game.rooms[i]
if(void 0!==s){var l=s.getMineral()
void 0!==l&&void 0===l.ticksToRegeneration&&void 0!==e.storage&&(void 0===e.storage.store[l.mineralType]||e.storage.store[l.mineralType]<25e4)&&_.sum(e.storage.store)<.95*e.storage.storeCapacity&&(this.creepService.getCreeps(c.Role.PoachGuard,i).length>0?(this.orderPoachMiners(e,l),this.orderPoachHaulers(e,l)):this.orderPoachGuard(e,i))}else{var m=u.intelTime(i),y=u.mineralTicks(i);(void 0===m||void 0===y||m+y<Game.time)&&this.orderPoachGuard(e,i)}}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"setBotPoachingRoom",value:function(e){void 0!==e.memory.poaching&&e.memory.poaching.length>0&&this.checkIfPoachIsFinished(e),void 0!==e.memory.poaching&&0!==e.memory.poaching.length||this.checkIfWeCanPoach(e)}},{key:"checkIfPoachIsFinished",value:function(e){var r=!0,o=!1,t=void 0
try{for(var n,a=e.memory.poaching[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value,s=u.intelTime(i),l=u.mineralTicks(i)
if(void 0!==s&&void 0!==l)return R.log.info("Poaching of minerals in room "+i+" seems to be finished. Removing it from list.",e.name),void(e.memory.poaching=void 0)}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}},{key:"checkIfWeCanPoach",value:function(e){if(void 0!==e.memory.neighbours&&void 0!==e.memory.neighbours.twoAway){var r=_.filter(e.memory.neighbours.twoAway,function(e){return v.isMiddleRoom(e)})
if(0!==r.length){var o=v.getAllOutpostsInAllRooms(this.roomService.getNormalRooms()),t=v.getAllPoachroomsInAllRooms(this.roomService.getNormalRooms()),n=_.filter(r,function(e){return!_.contains(o,e)&&!_.contains(t,e)})
if(0!==n.length){var a=!0,i=!1,s=void 0
try{for(var l,m=n[Symbol.iterator]();!(a=(l=m.next()).done);a=!0){var y=l.value,c=u.intelTime(y),d=u.mineralTicks(y)
if(u.roomHostility(y)===g.Hostility.None&&void 0!==c&&(void 0===d||c+d<Game.time))return R.log.alert("Poaching of minerals in room "+y+" started. ",e.name),void(e.memory.poaching=[y])}}catch(e){i=!0,s=e}finally{try{!a&&m.return&&m.return()}finally{if(i)throw s}}}}}}},{key:"orderPoachHaulers",value:function(e,r){if(void 0!==e.storage){var o=a.getNumberOfTiersInQueue(e,c.Role.PoachHauler,r.id),i=this.creepService.getCreeps(c.Role.PoachMiner,r.id).length
if(!(o>0||0===i||o+this.creepService.getNumberOfTiers(c.Role.PoachHauler,r.id)>=Math.ceil(2.5*i*n.getDistanseBetween(e.storage.pos,r.pos)/10))){var s=t.getMaxTierOffroadHauler(e.energyCapacityAvailable),l=new y.Order
l.body=t.getOffroadHaulerBody(s),l.priority=d.Priority.Standard,l.memory={role:c.Role.PoachHauler,target:r.id,tier:s},a.orderCreep(e,l)}}}},{key:"orderPoachMiners",value:function(e,r){var o=Math.min(r.getMiningPositions().length,3),n=a.getCreepsInQueue(e,c.Role.PoachMiner,r.id),i=this.creepService.getCreeps(c.Role.PoachMiner,r.id).length
if(!(n>0||i+n>=o)){var s=new y.Order
s.body=t.getPoachMinerBody(),s.priority=d.Priority.Standard,s.memory={role:c.Role.PoachMiner,target:r.id,tier:1},a.orderCreep(e,s)}}},{key:"orderPoachGuard",value:function(e,r){if(!(a.getCreepsInQueue(e,c.Role.PoachGuard,r)>0||this.creepService.getCreeps(c.Role.PoachGuard,r).length>0)){var o=new y.Order
o.body=t.getPoachGuardBody(),o.priority=d.Priority.Critical,o.memory={role:c.Role.PoachGuard,target:r,tier:1},a.orderCreep(e,o)}}}]),r}()
r.PoachingManager=p},function(e,r,o){function t(e){e.hits<e.hitsMax&&e.heal(e)
var r=e.memory.target
void 0!==r&&(r!==e.room.name||v.positionIsBorder(e.pos)?e.travelToRoom(r,{allowSK:!0,ignoreRoads:!0}):(e.setState(y.Waiting),n(e)))}function n(e){if(void 0===e.memory.mineralId&&s(e),void 0===e.memory.orderCopyTick&&m(e),e.hits<e.hitsMax&&e.heal(e),void 0!==e.memory.sleep&&e.memory.sleep>0){var r=Game.getObjectById(e.memory.lair)
return null!==r&&e.pos.getRangeTo(r.pos)>1&&e.moveTo(r,{maxRooms:1}),void(e.memory.sleep=e.memory.sleep-1)}var o=Game.getObjectById(e.memory.mineralId)
if(null!==o){var t=l(o)
if(void 0!==t)return e.memory.keeper=t.id,e.setState(y.Fighting),void a(e)
e.memory.keeper=void 0
var n=Game.getObjectById(e.memory.lair)
null!==n&&void 0!==n.ticksToSpawn?e.memory.sleep=n.ticksToSpawn:e.memory.sleep=20}else console.log("No mineral found for Guard: "+e.pos)}function a(e){var r=Game.getObjectById(e.memory.keeper)
if(null===r)return e.hits<e.hitsMax&&e.heal(e),e.memory.keeper=void 0,void e.setState(y.Healing)
e.pos.getRangeTo(r.pos)>1?(e.moveTo(r,{maxRooms:1}),e.hits<e.hitsMax&&e.heal(e)):(e.attack(r),e.moveTo(r,{ignoreCreeps:!0,maxRooms:1}))}function i(e){if(e.hits<e.hitsMax)e.heal(e)
else{var r=Game.getObjectById(e.memory.healTarget)
if(null!==r){if(r.hits===r.hitsMax)return void(e.memory.healTarget=void 0)
var o=e.pos.getRangeTo(r)
o>1&&e.moveTo(r),o<4&&e.heal(r)}else{var t=e.pos.findInRange(FIND_MY_CREEPS,7,{filter:function(e){return e.hits<e.hitsMax}})
if(t.length>0)return void(e.memory.healTarget=t[0].id)
e.setState(y.Waiting)}}}function s(e){var r=e.room.getMineral()
if(void 0===r)return console.log("PoachGuard could not find mineral: "+e.room.name),void e.disable()
e.memory.mineralId=r.id
var o=r.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter:function(e){return e.structureType===STRUCTURE_KEEPER_LAIR}})
void 0!==o&&null!==o&&(e.memory.lair=o.id)
var t=l(r)
void 0!==t&&(e.memory.keeper=t.id)}function l(e){var r=e.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
if(null!==r&&!(e.pos.getRangeTo(r.pos)>6))return r}function m(e){var r=Game.getObjectById(e.memory.mineralId),o=Game.rooms[e.memory.homeroom].getSpawn()
r instanceof Mineral&&o instanceof StructureSpawn?e.memory.orderCopyTick=Math.ceil(c.getDistanseBetween(r.pos,o.pos)+150):e.memory.orderCopyTick=-1}function u(e){if(void 0!==Game.rooms[e.memory.homeroom]&&!Game.rooms[e.memory.homeroom].isAbandoned()&&!Game.rooms[e.memory.homeroom].isUnderSiege()&&_.contains(Game.rooms[e.memory.homeroom].memory.poaching,e.memory.target)){var r=Game.getObjectById(e.memory.mineralId)
if(null!==r&&void 0===r.ticksToRegeneration){var o=new f.Order
o.body=_.map(e.body,function(e){return e.type}),o.priority=g.Priority.Important,o.memory={role:e.memory.role,target:e.memory.target,tier:e.memory.tier},d.orderCreep(Game.rooms[e.memory.homeroom],o)}}}var y,v=o(45),c=o(3),d=o(18),f=o(20),g=o(17)
!function(e){e[e.MoveToRoom=1]="MoveToRoom",e[e.Waiting=2]="Waiting",e[e.Fighting=3]="Fighting",e[e.Healing=4]="Healing"}(y||(y={})),r.run=function(e){switch(e.hasState()||e.setState(y.MoveToRoom),e.memory.orderCopyTick===e.ticksToLive&&u(e),e.getState()){case y.MoveToRoom:t(e)
break
case y.Waiting:n(e)
break
case y.Fighting:a(e)
break
case y.Healing:i(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(y.MoveToRoom)}}},function(e,r,o){function t(e){var r=a(e)
null!==r&&(r.pos.roomName!==e.pos.roomName||e.pos.getRangeTo(r)>1?e.travelTo(r,{allowSK:!0,avoidKeepers:!0}):(void 0===e.memory.orderCopyTick&&i(e),e.setState(l.Mining),n(e)))}function n(e){if(Game.time%6==1){var r=a(e)
null!==r&&void 0!==r.ticksToRegeneration&&r.ticksToRegeneration>0?e.suicide():null!==r&&e.carryCapacity-_.sum(e.carry)>e.getWorkerParts()&&e.harvest(r)===OK&&(void 0===Memory.stats["mineralmined."+r.mineralType]&&(Memory.stats["mineralmined."+r.mineralType]=0),Memory.stats["mineralmined."+r.mineralType]+=e.getActiveBodyparts(WORK))}}function a(e){return Game.getObjectById(e.memory.target)}function i(e){var r=a(e),o=Game.rooms[e.memory.homeroom].getSpawn()
r instanceof Mineral&&o instanceof StructureSpawn?e.memory.orderCopyTick=Math.ceil(m.getDistanseBetween(r.pos,o.pos)+150):e.memory.orderCopyTick=-1}function s(e){if(void 0!==Game.rooms[e.memory.homeroom]&&!Game.rooms[e.memory.homeroom].isAbandoned()&&!Game.rooms[e.memory.homeroom].isUnderSiege()&&_.contains(Game.rooms[e.memory.homeroom].memory.poaching,e.memory.target)){var r=a(e)
if(null!==r&&void 0===r.ticksToRegeneration){var o=new y.Order
o.body=_.map(e.body,function(e){return e.type}),o.priority=v.Priority.Important,o.memory={role:e.memory.role,target:e.memory.target,tier:e.memory.tier},u.orderCreep(Game.rooms[e.memory.homeroom],o)}}}var l,m=o(3),u=o(18),y=o(20),v=o(17)
!function(e){e[e.MoveToMineral=1]="MoveToMineral",e[e.Mining=2]="Mining"}(l||(l={})),r.run=function(e){switch(e.hasState()||e.setState(l.MoveToMineral),e.memory.orderCopyTick===e.ticksToLive&&s(e),e.getState()){case l.MoveToMineral:t(e)
break
case l.Mining:n(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(l.MoveToMineral)}}},function(e,r,o){function t(e){var r=l(e)
null!==r&&(r.pos.roomName!==e.pos.roomName||e.pos.getRangeTo(r)>3?e.travelTo(r,{allowSK:!0,ignoreRoads:!0,avoidKeepers:!0,allowHostile:!1}):(e.setState(u.Collecting),n(e)))}function n(e){if(e.carryCapacity===_.sum(e.carry)||void 0!==e.memory.distance&&e.ticksToLive-50<e.memory.distance){if(0===_.sum(e.carry))return void e.suicide()
e.setState(u.Returning),a(e)}else{if(void 0!==e.memory.sleep&&e.memory.sleep>0)return void(e.memory.sleep=e.memory.sleep-1)
var r=Game.getObjectById(e.memory.current)
if(null!==r&&_.sum(r.carry)>0)e.pos.getRangeTo(r)>1?e.moveTo(r):(r.transfer(e,m(r)),e.memory.current=void 0)
else{e.memory.current=void 0
var o=i(e)
void 0===o?e.memory.sleep=20:e.memory.current=o.id}}}function a(e){var r=Game.rooms[e.getHomeroom()]
if(void 0!==r&&void 0!==r.storage)if(r.storage.pos.roomName!==e.pos.roomName||e.pos.getRangeTo(r.storage)>1)e.travelTo(r.storage,{allowSK:!0,ignoreRoads:!0,avoidKeepers:!0,allowHostile:!1})
else{var o=!0,n=!1,a=void 0
try{for(var i,l=Object.keys(e.carry)[Symbol.iterator]();!(o=(i=l.next()).done);o=!0){var m=i.value
if(e.carry[m]>0)return void e.transfer(r.storage,m)}}catch(e){n=!0,a=e}finally{try{!o&&l.return&&l.return()}finally{if(n)throw a}}s(e)?(e.setState(u.MoveToMineral),t(e)):e.suicide()}}function i(e){var r=e.room.find(FIND_MY_CREEPS,{filter:function(e){return _.sum(e.carry)>e.carryCapacity/2&&e.memory.role===v.Role.PoachMiner}})
if(r.length>0)return r[0]}function s(e){var r=l(e)
if(void 0===e.room.storage||null===r)return!1
var o=y.getDistanseBetween(e.room.storage.pos,r.pos)
return e.memory.distance=o,3*o<e.ticksToLive}function l(e){return Game.getObjectById(e.memory.target)}function m(e){var r=!0,o=!1,t=void 0
try{for(var n,a=Object.keys(e.carry)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
if(e.carry[i]>0)return i}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}return RESOURCE_ENERGY}var u,y=o(3),v=o(16)
!function(e){e[e.MoveToMineral=1]="MoveToMineral",e[e.Collecting=2]="Collecting",e[e.Returning=3]="Returning"}(u||(u={})),r.run=function(e){switch(e.hasState()||e.setState(u.MoveToMineral),e.getState()){case u.MoveToMineral:t(e)
break
case u.Collecting:n(e)
break
case u.Returning:a(e)
break
default:console.log("Creep with unknown state: "+e.name+" - "+e.room.name+" - State: "+e.getState()),e.setState(u.MoveToMineral)}}},function(e,r,o){var t=o(14),n=o(110),a=o(133),i=o(5),s=o(10),l=o(11),m=o(134),u=o(7),y=function(e){function r(e,o){_classCallCheck(this,r)
var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,"HarassManager"))
return t.MEMORY_LASTRUN_LOTTERY="lastRunLottery",t.roomService=e,t.creepService=o,t}return _inherits(r,t.Manager),_createClass(r,[{key:"run",value:function(e){if(!0===Memory.settings.bot&&!0!==Memory.settings.passive&&e===t.ManagerPriority.Trivial){var r=this.getValue(this.MEMORY_LASTRUN_LOTTERY)
if(void 0===r||r+500<Game.time){var o=this.roomService.getNormalAndNotExpansion(),n=!0,a=!1,i=void 0
try{for(var s,l=o[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var y=s.value
if(this.roomShouldTryToHarass(y)){var v=this.findHarassTarget(y)
if(void 0===v)continue
var c=this.findHarassType(y,v)
this.orderAttackType(y,v,c),u.log.alert("Room "+y.name+" won the lottery and is allowed to harass "+v+" with "+m.HarassType[c]+"!",y.name)}}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}this.setValue(this.MEMORY_LASTRUN_LOTTERY,Game.time)}}}},{key:"roomShouldTryToHarass",value:function(e){return 10===_.random(1,10)&&s.getRoomLevel(e)>=l.RoomLevel.SimpleColony&&(void 0===e.memory.orders||e.memory.orders.length<3)&&(void 0!==e.storage&&e.storage.store[RESOURCE_ENERGY]>5e4||(void 0===e.storage&&e.find(FIND_MY_CREEPS).length)>2)}},{key:"orderAttackType",value:function(e,r,o){switch(o){case m.HarassType.T3BoostedWreckerTeam:var t=a.getT3BoostedWreckerTeamTierForRoom(e,r)
void 0!==t&&n.orderTeamWrecker(e,t,[],[r],3)
break
case m.HarassType.T2BoostedWreckerTeam:var i=a.getT2BoostedWreckerTeamTierForRoom(e,r)
void 0!==i&&n.orderTeamWrecker(e,i,[],[r],2)
break
case m.HarassType.T1BoostedWreckerTeam:var s=a.getT1BoostedWreckerTeamTierForRoom(e,r)
void 0!==s&&n.orderTeamWrecker(e,s,[],[r],1)
break
case m.HarassType.Wrecker:n.orderWrecker(e,[r])
break
case m.HarassType.Harasser:n.orderHarasser(e,r)}}},{key:"findHarassTarget",value:function(e){if(void 0!==e.memory.neighbours){var r=[]
if(void 0!==e.memory.neighbours.oneAway){var o=!0,t=!1,n=void 0
try{for(var a,s=e.memory.neighbours.oneAway[Symbol.iterator]();!(o=(a=s.next()).done);o=!0){var l=a.value
i.isOccupied(l)&&!i.isInsafeMode(l)&&(r.push(l,l,l,l,l,l,l,l),i.isOwned(l)&&r.push(l,l))}}catch(e){t=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(t)throw n}}}if(void 0!==e.memory.neighbours.twoAway){var m=!0,u=!1,y=void 0
try{for(var v,c=e.memory.neighbours.twoAway[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
i.isOccupied(d)&&!i.isInsafeMode(d)&&(r.push(d,d,d,d,d),i.isOwned(d)&&r.push(d,d))}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}}if(void 0!==e.memory.neighbours.threeAway){var f=!0,g=!1,R=void 0
try{for(var p,h=e.memory.neighbours.threeAway[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
i.isOccupied(E)&&!i.isInsafeMode(E)&&(r.push(E,E,E),i.isOwned(E)&&r.push(E,E))}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}}if(void 0!==e.memory.neighbours.fourAway){var S=!0,T=!1,C=void 0
try{for(var O,M=e.memory.neighbours.fourAway[Symbol.iterator]();!(S=(O=M.next()).done);S=!0){var b=O.value
i.isOccupied(b)&&!i.isInsafeMode(b)&&(r.push(b),i.isOwned(b)&&r.push(b,b))}}catch(e){T=!0,C=e}finally{try{!S&&M.return&&M.return()}finally{if(T)throw C}}}if(void 0!==e.memory.neighbours.fiveAway){var w=!0,N=!1,A=void 0
try{for(var U,k=e.memory.neighbours.fiveAway[Symbol.iterator]();!(w=(U=k.next()).done);w=!0){var I=U.value
i.isOccupied(I)&&!i.isInsafeMode(I)&&i.isOwned(I)&&r.push(I,I)}}catch(e){N=!0,A=e}finally{try{!w&&k.return&&k.return()}finally{if(N)throw A}}}if(void 0!==e.memory.neighbours.sixAway){var L=!0,P=!1,x=void 0
try{for(var G,B=e.memory.neighbours.sixAway[Symbol.iterator]();!(L=(G=B.next()).done);L=!0){var D=G.value
i.isOccupied(D)&&!i.isInsafeMode(D)&&i.isOwned(D)&&r.push(D)}}catch(e){P=!0,x=e}finally{try{!L&&B.return&&B.return()}finally{if(P)throw x}}}return r[_.random(0,r.length-1)]}}},{key:"findHarassType",value:function(e,r){var o=[]
return i.isOwned(r)?0===i.towerCount(r)?o.push(m.HarassType.Harasser):(a.canSendT3BoostedWreckerTeam(e,r)&&o.push(m.HarassType.T3BoostedWreckerTeam),a.canSendT2BoostedWreckerTeam(e,r)&&o.push(m.HarassType.T2BoostedWreckerTeam),a.canSendT1BoostedWreckerTeam(e,r)&&o.push(m.HarassType.T1BoostedWreckerTeam),0===o.length&&o.push(m.HarassType.Wrecker)):o.push(m.HarassType.Harasser),o[_.random(0,o.length-1)]}}]),r}()
r.HarassManager=y},function(e,r,o){function t(e,r,o){return void 0!==e.terminal&&void 0!==e.terminal.store[r]&&e.terminal.store[r]>=30*o}var n=o(5)
r.canSendT3BoostedWreckerTeam=function(e,r){var o=n.roomLevel(r)
if(void 0===o||void 0===e.controller||o<3)return!1
if(e.controller.level<6)return!1
if(e.controller.level<o)return!1
var a={}
a[RESOURCE_CATALYZED_GHODIUM_ALKALIDE]=16,a[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]=8,a[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]=10,a[RESOURCE_CATALYZED_ZYNTHIUM_ACID]=14,a[RESOURCE_CATALYZED_KEANIUM_ALKALIDE]=2,7===o?(a[RESOURCE_CATALYZED_GHODIUM_ALKALIDE]=24,a[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]=16,a[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]=16,a[RESOURCE_CATALYZED_ZYNTHIUM_ACID]=20,a[RESOURCE_CATALYZED_KEANIUM_ALKALIDE]=4):8===o&&(a[RESOURCE_CATALYZED_GHODIUM_ALKALIDE]=32,a[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]=24,a[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]=20,a[RESOURCE_CATALYZED_ZYNTHIUM_ACID]=20,a[RESOURCE_CATALYZED_KEANIUM_ALKALIDE]=4)
var i=!0,s=!1,l=void 0
try{for(var m,u=Object.keys(a)[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
if(!1===t(e,y,a[y]))return!1}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return!0},r.canSendT2BoostedWreckerTeam=function(e,r){var o=n.roomLevel(r)
if(void 0===o||void 0===e.controller||o<3)return!1
if(e.controller.level<6)return!1
if(o>7)return!1
if(o>6&&e.controller.level<8)return!1
if(o>4&&e.controller.level<7)return!1
var a={}
o<5?(a[RESOURCE_GHODIUM_ALKALIDE]=16,a[RESOURCE_LEMERGIUM_ALKALIDE]=8,a[RESOURCE_ZYNTHIUM_ALKALIDE]=13,a[RESOURCE_ZYNTHIUM_ACID]=13,a[RESOURCE_KEANIUM_ALKALIDE]=2):o<7?(a[RESOURCE_GHODIUM_ALKALIDE]=24,a[RESOURCE_LEMERGIUM_ALKALIDE]=18,a[RESOURCE_ZYNTHIUM_ALKALIDE]=20,a[RESOURCE_ZYNTHIUM_ACID]=15,a[RESOURCE_KEANIUM_ALKALIDE]=3):7===o&&(a[RESOURCE_GHODIUM_ALKALIDE]=24,a[RESOURCE_LEMERGIUM_ALKALIDE]=24,a[RESOURCE_ZYNTHIUM_ALKALIDE]=24,a[RESOURCE_ZYNTHIUM_ACID]=20,a[RESOURCE_KEANIUM_ALKALIDE]=4)
var i=!0,s=!1,l=void 0
try{for(var m,u=Object.keys(a)[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
if(!1===t(e,y,a[y]))return!1}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return!0},r.canSendT1BoostedWreckerTeam=function(e,r){var o=n.roomLevel(r)
if(void 0===o||void 0===e.controller||o<3)return!1
if(e.controller.level<7)return!1
if(o>4)return!1
var a={}
a[RESOURCE_GHODIUM_OXIDE]=20,a[RESOURCE_LEMERGIUM_OXIDE]=18,a[RESOURCE_ZYNTHIUM_OXIDE]=30,a[RESOURCE_ZYNTHIUM_HYDRIDE]=16,a[RESOURCE_KEANIUM_OXIDE]=6
var i=!0,s=!1,l=void 0
try{for(var m,u=Object.keys(a)[Symbol.iterator]();!(i=(m=u.next()).done);i=!0){var y=m.value
if(!1===t(e,y,a[y]))return!1}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}return!0},r.terminalHasMinsForBoost=t,r.getT3BoostedWreckerTeamTierForRoom=function(e,r){var o=n.roomLevel(r)
if(!(void 0===o||void 0===e.controller||o<4||e.controller.level<6||e.controller.level<o))return 8===o?3:7===o?2:1},r.getT2BoostedWreckerTeamTierForRoom=function(e,r){var o=n.roomLevel(r)
if(!(void 0===o||void 0===e.controller||o<4||e.controller.level<6||e.controller.level<o||8===o))return 7===o&&8===e.controller.level?3:o>4&&e.controller.level>6?2:1},r.getT1BoostedWreckerTeamTierForRoom=function(e,r){var o=n.roomLevel(r)
if(!(void 0===o||void 0===e.controller||o<4||e.controller.level<7||o>4))return 1}},function(e,r){!function(e){e[e.T3BoostedWreckerTeam=0]="T3BoostedWreckerTeam",e[e.T2BoostedWreckerTeam=1]="T2BoostedWreckerTeam",e[e.T1BoostedWreckerTeam=2]="T1BoostedWreckerTeam",e[e.Harasser=3]="Harasser",e[e.Wrecker=4]="Wrecker"}(r.HarassType||(r.HarassType={}))
r.HarassType},function(e,r,o){var t=o(16),n=function(){function e(){_classCallCheck(this,e),this.creepDictionary=this.makeDictionary()}return _createClass(e,[{key:"getAllOfRole",value:function(e){return void 0!==this.creepDictionary[e]?this.creepDictionary[e]:[]}},{key:"creepShouldRun",value:function(e){return void 0===e.memory.homeroom&&(e.memory.homeroom=e.room.name),!e.spawning&&(void 0!==e.memory.boost?(e.disable(),void 0===e.room.memory.boostTarget&&(e.room.memory.boostTarget=e.id),!1):!e.isDisabled())}},{key:"runCreeps",value:function(e,r){var o=!0,n=!1,a=void 0
try{for(var i,s=this.getAllOfRole(e)[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
this.creepShouldRun(l)&&this.logUsedCpu(r,t.Role[l.memory.role],l)}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}}},{key:"getNumberOfTiers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null
if(null!==e){if(void 0===this.creepDictionary[e])return 0
var t=0,n=!0,a=!1,i=void 0
try{for(var s,l=this.creepDictionary[e][Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
null!==r&&m.memory.target!==r||null!==o&&m.memory.homeroom!==o||(m.memory.tier?t+=m.memory.tier:t++)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t}var u=0
for(var y in Game.creeps){var v=Game.creeps[y]
null!==r&&v.memory.target!==r||null!==o&&v.memory.homeroom!==o||null!==e&&v.memory.role!==e||(v.memory.tier?u+=v.memory.tier:u++)}return u}},{key:"getCreeps",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,t=[]
if(null!==e){if(void 0===this.creepDictionary[e])return t
var n=!0,a=!1,i=void 0
try{for(var s,l=this.creepDictionary[e][Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var m=s.value
null!==r&&m.memory.target!==r||null!==o&&m.memory.homeroom!==o||t.push(m)}}catch(e){a=!0,i=e}finally{try{!n&&l.return&&l.return()}finally{if(a)throw i}}return t}for(var u in Game.creeps){var y=Game.creeps[u]
null!==r&&y.memory.target!==r||null!==o&&y.memory.homeroom!==o||null!==e&&y.memory.role!==e||t.push(y)}return t}},{key:"getIdleEnergyHaulers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=[]
if(void 0===this.creepDictionary[t.Role.EnergyHauler])return r
var o=!0,n=!1,a=void 0
try{for(var i,s=this.creepDictionary[t.Role.EnergyHauler][Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value,m=l.getState()
l.memory.homeroom!==e||1!==m&&void 0!==m||r.push(l)}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}return r}},{key:"makeDictionary",value:function(){var e={}
e[t.Role.UpgraderWithBoost]=[],e[t.Role.UpgraderWithoutBoost]=[],e[t.Role.PraiserWithBoost]=[],e[t.Role.PraiserWithoutBoost]=[]
for(var r in Game.creeps){var o=Game.creeps[r]
void 0!==o.memory.role?(void 0===e[o.memory.role]&&(e[o.memory.role]=[]),e[o.memory.role].push(o),o.memory.role===t.Role.Upgrader?o.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?e[t.Role.UpgraderWithBoost].push(o):e[t.Role.UpgraderWithoutBoost].push(o):o.memory.role===t.Role.Praiser&&(o.body[0].boost===RESOURCE_CATALYZED_GHODIUM_ACID?e[t.Role.PraiserWithBoost].push(o):e[t.Role.PraiserWithoutBoost].push(o))):console.log("Creep with unknown role: "+o.name+" Pos: "+o.pos)}return e}},{key:"logUsedCpu",value:function(e,r){for(var o=Game.cpu.getUsed(),t=arguments.length,n=Array(t>2?t-2:0),a=2;a<t;a++)n[a-2]=arguments[a]
var i=e.apply(void 0,n),s=Game.cpu.getUsed()-o
return void 0===Memory.stats["cpu.role."+r+".used"]?Memory.stats["cpu.role."+r+".used"]=s:Memory.stats["cpu.role."+r+".used"]+=s,void 0===Memory.stats["cpu.role."+r+".count"]?Memory.stats["cpu.role."+r+".count"]=1:Memory.stats["cpu.role."+r+".count"]+=1,void 0!==n[0]&&void 0!==n[0].memory.homeroom&&void 0!==Memory.stats["room."+n[0].memory.homeroom+".creepCpu"]&&(Memory.stats["room."+n[0].memory.homeroom+".creepCpu"]+=s),i}}]),e}()
r.CreepService=n},function(e,r,o){var t=o(9),n=function(){function e(){_classCallCheck(this,e),this.roomDictionary=this.makeDictionary()}return _createClass(e,[{key:"getAllOfType",value:function(e){return void 0!==this.roomDictionary[e]?this.roomDictionary[e]:[]}},{key:"getMyRooms",value:function(){return void 0!==this.roomDictionary[t.Roomtype.My]?this.roomDictionary[t.Roomtype.My]:[]}},{key:"getNormalRooms",value:function(){return void 0!==this.roomDictionary[t.Roomtype.Normal]?this.roomDictionary[t.Roomtype.Normal]:[]}},{key:"getNormalRoomsNotAbandoned",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalNotAbandoned]?this.roomDictionary[t.Roomtype.NormalNotAbandoned]:[]}},{key:"getRoomsBeingAbandoned",value:function(){return void 0!==this.roomDictionary[t.Roomtype.BeingAbandoned]?this.roomDictionary[t.Roomtype.BeingAbandoned]:[]}},{key:"getPraiseRooms",value:function(){return void 0!==this.roomDictionary[t.Roomtype.Praiseroom]?this.roomDictionary[t.Roomtype.Praiseroom]:[]}},{key:"getNormalAndNotExpansion",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalAndNotExpansion]?this.roomDictionary[t.Roomtype.NormalAndNotExpansion]:[]}},{key:"getNormalWithExpansion",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalWithExpansion]?this.roomDictionary[t.Roomtype.NormalWithExpansion]:[]}},{key:"getNormalUnderSiege",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalUnderSiege]?this.roomDictionary[t.Roomtype.NormalUnderSiege]:[]}},{key:"getNormalWithPraiseroom",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalWithPraiseroom]?this.roomDictionary[t.Roomtype.NormalWithPraiseroom]:[]}},{key:"getNormalWithDismantleTarget",value:function(){return void 0!==this.roomDictionary[t.Roomtype.NormalWithDismantleTarget]?this.roomDictionary[t.Roomtype.NormalWithDismantleTarget]:[]}},{key:"makeDictionary",value:function(){var e={}
e[t.Roomtype.NormalAndNotExpansion]=[],e[t.Roomtype.NormalWithAcceleratedPraising]=[],e[t.Roomtype.NormalWithExpansion]=[],e[t.Roomtype.NormalWithPraiseroom]=[],e[t.Roomtype.NormalUnderSiege]=[],e[t.Roomtype.NormalWithDismantleTarget]=[],e[t.Roomtype.Expanion]=[],e[t.Roomtype.My]=[],e[t.Roomtype.BeingAbandoned]=[],e[t.Roomtype.NormalNotAbandoned]=[]
for(var r in Game.rooms){var o=Game.rooms[r]
void 0===o.controller||!o.controller.my||o.controller.level<1||(void 0===o.memory.t&&(console.log("Room with unknown type: "+o.name+". Assuming it is a metropolis."),o.memory.t=t.Roomtype.Normal),void 0===e[o.memory.t]&&(e[o.memory.t]=[]),e[o.memory.t].push(o),e[t.Roomtype.My].push(o),o.isExpansion()&&e[t.Roomtype.Expanion].push(o),o.isExpansion()||o.memory.t!==t.Roomtype.Normal||e[t.Roomtype.NormalAndNotExpansion].push(o),o.memory.praiseBoost&&o.memory.t===t.Roomtype.Normal&&e[t.Roomtype.NormalWithAcceleratedPraising].push(o),void 0!==o.memory.expansion&&o.memory.t===t.Roomtype.Normal&&e[t.Roomtype.NormalWithExpansion].push(o),void 0!==o.memory.dismantleTargetRoom&&o.memory.t===t.Roomtype.Normal&&e[t.Roomtype.NormalWithDismantleTarget].push(o),void 0!==o.memory.praiseroom&&o.memory.t===t.Roomtype.Normal&&e[t.Roomtype.NormalWithPraiseroom].push(o),!0===o.memory.isBeingDismantled&&e[t.Roomtype.BeingAbandoned].push(o),o.isUnderSiege()&&e[t.Roomtype.NormalUnderSiege].push(o),!0!==o.memory.isBeingDismantled&&o.memory.t===t.Roomtype.Normal&&e[t.Roomtype.NormalNotAbandoned].push(o))}return e}}]),e}()
r.RoomService=n},function(e,r){r.recordStats=function(e){void 0==Memory.stats&&(Memory.stats={}),Memory.stats.memorysize=RawMemory.get().length,Memory.stats["power.stored"]=0,Memory.stats["power.processed"]=0,Memory.stats["energy.stored"]=0,Memory.stats["energy.thisturn"]=0,Memory.stats["energy.walls"]=0,Memory.stats["gcl.thisturn"]=0,Memory.stats["labs.active"]=0
var r=[RESOURCE_HYDROGEN,RESOURCE_OXYGEN,RESOURCE_UTRIUM,RESOURCE_KEANIUM,RESOURCE_LEMERGIUM,RESOURCE_ZYNTHIUM,RESOURCE_CATALYST],o=[RESOURCE_CATALYZED_GHODIUM_ACID,RESOURCE_CATALYZED_GHODIUM_ALKALIDE,RESOURCE_CATALYZED_KEANIUM_ACID,RESOURCE_CATALYZED_KEANIUM_ALKALIDE,RESOURCE_CATALYZED_LEMERGIUM_ACID,RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,RESOURCE_CATALYZED_UTRIUM_ACID,RESOURCE_CATALYZED_UTRIUM_ALKALIDE,RESOURCE_CATALYZED_ZYNTHIUM_ACID,RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,RESOURCE_GHODIUM,RESOURCE_LEMERGIUM_HYDRIDE,RESOURCE_UTRIUM_HYDRIDE,RESOURCE_KEANIUM_OXIDE,RESOURCE_ZYNTHIUM_HYDRIDE,RESOURCE_LEMERGIUM_OXIDE,RESOURCE_ZYNTHIUM_OXIDE,RESOURCE_GHODIUM_OXIDE,RESOURCE_UTRIUM_ACID,RESOURCE_KEANIUM_ALKALIDE,RESOURCE_ZYNTHIUM_ACID,RESOURCE_LEMERGIUM_ALKALIDE,RESOURCE_ZYNTHIUM_ALKALIDE,RESOURCE_GHODIUM_ALKALIDE],t=!0,n=!1,a=void 0
try{for(var i,s=r[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value
Memory.stats["minerals."+l]=0}}catch(e){n=!0,a=e}finally{try{!t&&s.return&&s.return()}finally{if(n)throw a}}var m=!0,u=!1,y=void 0
try{for(var v,c=o[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
Memory.stats["boostminerals."+d]=0}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}var f=!0,g=!1,R=void 0
try{for(var p,h=e[Symbol.iterator]();!(f=(p=h.next()).done);f=!0){var E=p.value
if((E.controller?E.controller.my:0)&&void 0!==E.controller){Memory.stats["room."+E.name+".myRoom"]=1,Memory.stats["room."+E.name+".level"]=E.controller?E.controller.level:0,Memory.stats["room."+E.name+".energyAvailable"]=E.energyAvailable,Memory.stats["room."+E.name+".energyCapacityAvailable"]=E.energyCapacityAvailable,Memory.stats["room."+E.name+".controllerProgress"]=E.controller.progress,Memory.stats["room."+E.name+".controllerProgressTotal"]=E.controller.progressTotal,E.controller.level<8&&(Memory.stats["room."+E.name+".rclProgress"]=Math.floor(E.controller.progress/E.controller.progressTotal*100)/100),void 0!==E.memory.lab&&void 0!==E.memory.lab.labstatus&&E.memory.lab.labstatus>0&&(Memory.stats["labs.active"]+=1),void 0!==E.memory.orders?Memory.stats["room."+E.name+".orders"]=E.memory.orders.length:Memory.stats["room."+E.name+".orders"]=0
var S=E.getSpawns(),T=0,C=!0,O=!1,M=void 0
try{for(var _,b=S[Symbol.iterator]();!(C=(_=b.next()).done);C=!0)_.value.spawning&&T++}catch(e){O=!0,M=e}finally{try{!C&&b.return&&b.return()}finally{if(O)throw M}}Memory.stats["room."+E.name+".spawning"]=T
var w=0
if(E.storage){Memory.stats["energy.stored"]+=E.storage.store[RESOURCE_ENERGY],w=E.storage.store[RESOURCE_ENERGY]
var N=!0,A=!1,U=void 0
try{for(var k,I=r[Symbol.iterator]();!(N=(k=I.next()).done);N=!0){var L=k.value
void 0!==E.storage.store[L]&&E.storage.store[L]>0&&(Memory.stats["minerals."+L]+=E.storage.store[L])}}catch(e){A=!0,U=e}finally{try{!N&&I.return&&I.return()}finally{if(A)throw U}}var P=!0,x=!1,G=void 0
try{for(var B,D=o[Symbol.iterator]();!(P=(B=D.next()).done);P=!0){var H=B.value
void 0!==E.storage.store[H]&&E.storage.store[H]>0&&(Memory.stats["boostminerals."+H]+=E.storage.store[H])}}catch(e){x=!0,G=e}finally{try{!P&&D.return&&D.return()}finally{if(x)throw G}}}if(E.terminal){Memory.stats["energy.stored"]+=E.terminal.store[RESOURCE_ENERGY],w+=E.terminal.store[RESOURCE_ENERGY]
var W=!0,Y=!1,F=void 0
try{for(var K,V=r[Symbol.iterator]();!(W=(K=V.next()).done);W=!0){var j=K.value
void 0!==E.terminal.store[j]&&E.terminal.store[j]>0&&(Memory.stats["minerals."+j]+=E.terminal.store[j])}}catch(e){Y=!0,F=e}finally{try{!W&&V.return&&V.return()}finally{if(Y)throw F}}var X=!0,Z=!1,z=void 0
try{for(var q,J=o[Symbol.iterator]();!(X=(q=J.next()).done);X=!0){var Q=q.value
void 0!==E.terminal.store[Q]&&E.terminal.store[Q]>0&&(Memory.stats["boostminerals."+Q]+=E.terminal.store[Q])}}catch(e){Z=!0,z=e}finally{try{!X&&J.return&&J.return()}finally{if(Z)throw z}}}Memory.stats["room."+E.name+".storedEnergy"]=w,Memory.stats["room."+E.name+".power"]=0,void 0!==E.storage&&E.storage.store[RESOURCE_POWER]>0&&(Memory.stats["room."+E.name+".power"]+=E.storage.store[RESOURCE_POWER],Memory.stats["power.stored"]+=E.storage.store[RESOURCE_POWER]),void 0!==E.terminal&&E.terminal.store[RESOURCE_POWER]>0&&(Memory.stats["room."+E.name+".power"]+=E.terminal.store[RESOURCE_POWER],Memory.stats["power.stored"]+=E.terminal.store[RESOURCE_POWER])
var $=E.getPowerSpawn()
void 0!==$&&$.energy>=50&&$.power>0&&Memory.stats["power.processed"]++,Memory.stats["room."+E.name+".energyUpgraded"]>0&&(Memory.stats["gcl.thisturn"]+=Memory.stats["room."+E.name+".energyUpgraded"]),Memory.stats["room."+E.name+".energyHarvested"]>0&&(Memory.stats["energy.thisturn"]+=Memory.stats["room."+E.name+".energyHarvested"]),Memory.stats["room."+E.name+".outerWallMin"]=E.memory.lowestWall,Memory.stats["room."+E.name+".fortressMin"]=E.memory.lowestFortress,void 0!==Memory.stats["room."+E.name+".wallsRepaired"]&&(Memory.stats["energy.walls"]+=Memory.stats["room."+E.name+".wallsRepaired"])}else Memory.stats["room."+E.name+".myRoom"]=void 0}}catch(e){g=!0,R=e}finally{try{!f&&h.return&&h.return()}finally{if(g)throw R}}Memory.stats["gcl.progress"]=Game.gcl.progress,Memory.stats["gcl.progressTotal"]=Game.gcl.progressTotal,Memory.stats["gcl.level"]=Game.gcl.level,Memory.stats["cpu.bucket"]=Game.cpu.bucket,Memory.stats["cpu.limit"]=Game.cpu.limit,Memory.stats["credits.wallet"]=Game.market.credits,Memory.stats["cpu.creepcount"]=Object.keys(Game.creeps).length
var ee=!0,re=!1,oe=void 0
try{for(var te,ne=Object.keys(Memory.marketSell)[Symbol.iterator]();!(ee=(te=ne.next()).done);ee=!0){var ae=te.value
Memory.stats["resource."+ae+".sell"]=Memory.marketSell[ae]}}catch(e){re=!0,oe=e}finally{try{!ee&&ne.return&&ne.return()}finally{if(re)throw oe}}var ie=!0,se=!1,le=void 0
try{for(var me,ue=Object.keys(Memory.marketBuy)[Symbol.iterator]();!(ie=(me=ue.next()).done);ie=!0){var ye=me.value
Memory.stats["resource."+ye+".buy"]=Memory.marketBuy[ye]}}catch(e){se=!0,le=e}finally{try{!ie&&ue.return&&ue.return()}finally{if(se)throw le}}Memory.stats["cpu.getUsed"]=Game.cpu.getUsed()}},function(e,r,o){var t=o(10)
r.setOutpostRoads=function(e,r){RawMemory.segments[e+50]=JSON.stringify(r)},r.requestRoadinfo=function(e){var r=t.getIndex(e)
RawMemory.setActiveSegments([r+50])},r.getOutpostRoads=function(e){return void 0===RawMemory.segments[e+50]||_.isNull(RawMemory.segments[e+50])||""===RawMemory.segments[e+50]?(console.log("Roadinfo "+t.getRoomForIndex(parseInt(e))+": Not found or not loaded"),[]):JSON.parse(RawMemory.segments[e+50])},r.getOutpostRoadsForSegment=function(e){if(void 0!==RawMemory.segments[e]&&!_.isNull(RawMemory.segments[e])&&""!==RawMemory.segments[e])return JSON.parse(RawMemory.segments[e])
console.log("Roadinfo in segment"+e+": Not found or not loaded")},r.saveStats=function(){RawMemory.segments[1]=JSON.stringify(Memory.stats)}},function(e,r,o){var t=o(35),n=o(109),a=o(66),i=o(91),s=o(16),l=o(15),m=o(9),u=o(7),y=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"initCommands",value:function(){global.help=this.help,global.addOutpost=this.addOutpost,global.addExpansion=this.addExpansion,global.mineralreport=this.mineralreport,global.portalreport=this.portalreport,global.abandonRoom=this.abandonRoom,global.dismantleOutpost=this.dismantleOutpost,global.orderWreckerTeam=this.orderWreckerTeam,global.orderWreckers=this.orderWreckers,global.orderDrainer=this.orderDrainer,global.orderEliteDrainer=this.orderEliteDrainer,global.orderPaladin=this.orderPaladin,global.orderTagger=this.orderTagger,global.orderDeclarer=this.orderDeclarer,global.listFriends=this.listFriends,global.addFriend=this.addFriend,global.removeFriend=this.removeFriend,global.setLogLevel=this.setLogLevel,global.removeOutpost=this.removeOutpost,global.removeExpansion=this.removeExpansion,global.addDrainOperation=this.addDrainOperation,global.addHaulOperation=this.addHaulOperation}},{key:"help",value:function(){return"<strong> - - Commands - - </strong><br/> setLogLevel() - Sets log level 1-5, 1 is alert, 5 is debug.<br/> listFriends() - Lists users tagged as friendly.<br/> addFriend(username) - Adds user to friendly-list.<br/> removeFriend(username) - Removes user from friendly-list.<br/> <br/> orderDrainer(roomName, tier, route...) - Orders a Drainer for target room. (Tier 1-3 for 1-3 towers) Route can be multiple rooms.<br/> orderEliteDrainer(roomName, route...) - Orders a Elite Drainer for target room. Route can be multiple rooms.<br/> orderPaladin(roomName, route...) - Orders a Paladin for target room. Route can be multiple rooms.<br/> orderWreckerTeam(roomName: string, tier: number, boosted: boolean, route: string[], ... targets: string[])<br/> orderWreckers(roomName, count, route...) - Orders Wreckers (1-5) for target room. Route can be multiple rooms.<br/> orderTagger(roomName, targetRoom) - Orders a tagger that builds walls according to flags.<br/> orderDeclarer(roomName, route...) - Orders a declarer that signs controller in the route.<br/> <br/> addOutpost(roomName, outpost) - Adds outpost to a room.<br/> removeOutpost(roomName, outpost) - Remove outpost from a room.<br/> addExpansion(roomName, expansion, route...) - Adds expansion to a room.<br/> removeExpansion(roomName, expansion) - Remove expansion from a room.<br/> abandonRoom(roomName, destroyStructures?, saveEnergyBuildings?) - Starts abandoning the room. Send in true to remove all structures, default is false.<br/> dismantleOutpost(roomName, outpost) - Captures room without building it, to clear buildings.<br/> <br/> mineralreport() - Report of minerals currently controlled.<br/> portalreport() - Report of portals going out from my sectors.<br/> <br/> addHaulOperation(from: string, to: string, energyPerTick: number, endlevel: number) <br/> addDrainOperation(spawnRoom: string, targetRoom: string, targetRoute: string[], tier: number)<br/>"}},{key:"setLogLevel",value:function(e){var r="Adjusting log-level <br/>"
return e<1||e>5?r+"<span style='color:red;'>Log level \""+e+'" is not valid, need to be between 1 and 5.</span>':(u.log.setLogLevel(e),r+"<span style='color:green;'>Log level successfully set to "+e+".</span>")}},{key:"listFriends",value:function(){void 0===Memory.friendly&&(Memory.friendly=[])
var e="Showing list users counted of friends. <br/>"
return Memory.friendly.length>0?e+"<span style='color:green;'>List of friends: "+JSON.stringify(Memory.friendly)+"</span>":e+"<span style='color:green;'>List of friends is empty.</span>"}},{key:"addFriend",value:function(e){void 0===Memory.friendly&&(Memory.friendly=[])
var r='Adding user "'+e+'" to friendlies-list. <br/>'
return _.indexOf(Memory.friendly,e)>-1?r+"<span style='color:red;'>User \""+e+'" is already on friendlies-list.</span>':(Memory.friendly.push(e),r+"<span style='color:green;'>User \""+e+'" added to friendlies-list.</span>')}},{key:"removeFriend",value:function(e){void 0===Memory.friendly&&(Memory.friendly=[])
var r='Removing user "'+e+'" to friendlies-list. <br/>'
return _.pull(Memory.friendly,e).length>0?r+"<span style='color:green;'>User \""+e+'" removed from friendlies-list.</span>':r+"<span style='color:red;'>User \""+e+'" was not found in friendlies-list.</span>'}},{key:"abandonRoom",value:function(e,r,o){var t=e+": Abandoning room, sending out resources. <br/>"
if(void 0===Game.rooms[e])return t+"<span style='color:red;'>Room "+e+" not found.</span>"
var n=Game.rooms[e]
return void 0===n.controller||!n.controller.my||n.controller.level<1?t+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>":(n.memory.isBeingDismantled=!0,!0===r?(!0===o?n.memory.isBeingDismantledEverythingExceptEnergy=!0:n.memory.isBeingDismantledEverything=!0,t+"<span style='color:green;'>Room successfully marked as abandoned, and buildings removed.</span>"):t+"<span style='color:green;'>Room successfully marked as abandoned.</span>")}},{key:"orderPaladin",value:function(e){for(var r=arguments.length,o=Array(r>1?r-1:0),t=1;t<r;t++)o[t-1]=arguments[t]
var a=e+": Ordering Paladin for rooms "+JSON.stringify(o)+"<br/>"
if(void 0===Game.rooms[e])return a+"<span style='color:red;'>Room "+e+" not found.</span>"
var i=Game.rooms[e]
if(void 0===i.controller||!i.controller.my||i.controller.level<1)return a+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(o.length<1)return a+"<span style='color:red;'>You need to specify at least one target room.</span>"
var l=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value
if(!(Game.map.getRoomLinearDistance(e,c)<21))return a+"<span style='color:red;'>Room "+c+" is not found, or the distance is too far (more than 20).</span>"}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}var d=new n.CommandOrder
return d.room=e,d.role=s.Role.Paladin,d.route=o,n.addCommandOrder(d),a+"Room "+e+" is preparing a Paladin to attack: "+JSON.stringify(o)+"<br/><span style='color:green;'>Attack successfully initialized.</span>"}},{key:"orderDrainer",value:function(e,r){for(var o=arguments.length,t=Array(o>2?o-2:0),a=2;a<o;a++)t[a-2]=arguments[a]
var i=e+": Ordering Drainer for rooms "+JSON.stringify(t)+"<br/>"
if(void 0===Game.rooms[e])return i+"<span style='color:red;'>Room "+e+" not found.</span>"
var l=Game.rooms[e]
if(void 0===l.controller||!l.controller.my||l.controller.level<1)return i+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(t.length<1)return i+"<span style='color:red;'>You need to specify at least one target room.</span>"
var m=!0,u=!1,y=void 0
try{for(var v,c=t[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(!(Game.map.getRoomLinearDistance(e,d)<21))return i+"<span style='color:red;'>Room "+d+" is not found, or the distance is too far (more than 20).</span>"}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}if(r>3||r<1)return i+"<span style='color:red;'>Invalid tier for drainer: "+r+".</span>"
var f=new n.CommandOrder
return f.room=e,f.tier=r,f.role=s.Role.Drainer,f.route=t,n.addCommandOrder(f),i+"Room "+e+" is preparing a Drainer to drain: "+JSON.stringify(t)+"<br/><span style='color:green;'>Attack successfully initialized.</span>"}},{key:"orderEliteDrainer",value:function(e){for(var r=arguments.length,o=Array(r>1?r-1:0),t=1;t<r;t++)o[t-1]=arguments[t]
var a=e+": Ordering Elite Drainer for rooms "+JSON.stringify(o)+"<br/>"
if(void 0===Game.rooms[e])return a+"<span style='color:red;'>Room "+e+" not found.</span>"
var i=Game.rooms[e]
if(void 0===i.controller||!i.controller.my||i.controller.level<1)return a+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(o.length<1)return a+"<span style='color:red;'>You need to specify at least one target room.</span>"
var l=!0,m=!1,u=void 0
try{for(var y,v=o[Symbol.iterator]();!(l=(y=v.next()).done);l=!0){var c=y.value
if(!(Game.map.getRoomLinearDistance(e,c)<21))return a+"<span style='color:red;'>Room "+c+" is not found, or the distance is too far (more than 20).</span>"}}catch(e){m=!0,u=e}finally{try{!l&&v.return&&v.return()}finally{if(m)throw u}}var d=new n.CommandOrder
return d.room=e,d.tier=1,d.role=s.Role.EliteDrainer,d.route=o,n.addCommandOrder(d),a+"Room "+e+" is preparing a EliteDrainer to attack: "+JSON.stringify(o)+"<br/><span style='color:green;'>Attack successfully initialized.</span>"}},{key:"orderDeclarer",value:function(e){for(var r=arguments.length,o=Array(r>1?r-1:0),t=1;t<r;t++)o[t-1]=arguments[t]
var a=e+": Ordering Delcarer for room "+JSON.stringify(o)+"<br/>"
if(void 0===Game.rooms[e])return a+"<span style='color:red;'>Room "+e+" not found.</span>"
var i=Game.rooms[e]
if(void 0===i.controller||!i.controller.my||i.controller.level<1)return a+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
var l=!0,u=!1,y=void 0
try{for(var v,c=o[Symbol.iterator]();!(l=(v=c.next()).done);l=!0){var d=v.value
if(!(Game.map.getRoomLinearDistance(e,d)<26))return a+"<span style='color:red;'>Room "+d+" is not found, or the distance is too far (more than 25).</span>"}}catch(e){u=!0,y=e}finally{try{!l&&c.return&&c.return()}finally{if(u)throw y}}void 0===Memory.rooms[o[o.length-1]]&&(Memory.rooms[o[o.length-1]]={}),Memory.rooms[o[o.length-1]].t=m.Roomtype.Decoration
var f=new n.CommandOrder
return f.room=e,f.role=s.Role.Declarer,f.route=o,n.addCommandOrder(f),a+"Room "+e+" is preparing a Declarer to tag: "+JSON.stringify(o)+"<br/><span style='color:green;'>Declaring of ownership successfully initialized.</span>"}},{key:"orderTagger",value:function(e,r){var o=e+": Ordering Tagger for room "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
if(void 0===t.controller||!t.controller.my||t.controller.level<1)return o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(!(Game.map.getRoomLinearDistance(e,r)<21))return o+"<span style='color:red;'>Room "+r+" is not found, or the distance is too far (more than 20).</span>"
var a=new n.CommandOrder
return a.room=e,a.role=s.Role.Tagger,a.target=r,n.addCommandOrder(a),o+"Room "+e+" is preparing a Tagger to tag: "+r+"<br/><span style='color:green;'>Tagging successfully initialized.</span>"}},{key:"orderWreckerTeam",value:function(e,r,o,t){for(var a=arguments.length,i=Array(a>4?a-4:0),l=4;l<a;l++)i[l-4]=arguments[l]
var m=e+": Ordering WreckingTeam for rooms "+JSON.stringify(i)+"<br/>"
if(void 0===Game.rooms[e])return m+"<span style='color:red;'>Room "+e+" not found.</span>"
var u=Game.rooms[e]
if(void 0===u.controller||!u.controller.my||u.controller.level<1)return m+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(i.length<1)return m+"<span style='color:red;'>You need to specify at least one target room.</span>"
if(r<1||r>3)return m+"<span style='color:red;'>The tier for a WreckingTeam has to be between 1 and 3.</span>"
if(!0!==o&&!1!==o)return m+"<span style='color:red;'>You need to specify if the team should be boosted.</span>"
var y=new n.CommandOrder
return y.room=e,y.tier=r,y.role=s.Role.TeamWrecker,y.targets=i,y.route=t,y.boosted=o,n.addCommandOrder(y),m+"Room "+e+" is preparing a WreckerTeam to attack: "+JSON.stringify(i)+"<br/><span style='color:green;'>Attack successfully initialized.</span>"}},{key:"orderWreckers",value:function(e,r){for(var o=arguments.length,t=Array(o>2?o-2:0),a=2;a<o;a++)t[a-2]=arguments[a]
var i=e+": Ordering "+r+" Wreckers for rooms "+JSON.stringify(t)+"<br/>"
if(void 0===Game.rooms[e])return i+"<span style='color:red;'>Room "+e+" not found.</span>"
var l=Game.rooms[e]
if(void 0===l.controller||!l.controller.my||l.controller.level<1)return i+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(t.length<1)return i+"<span style='color:red;'>You need to specify at least one target room.</span>"
if(r<1||r>6)return i+"<span style='color:red;'>The limit of ordering Wreckers are 1 to 5.</span>"
var m=!0,u=!1,y=void 0
try{for(var v,c=t[Symbol.iterator]();!(m=(v=c.next()).done);m=!0){var d=v.value
if(!(Game.map.getRoomLinearDistance(e,d)<21))return i+"<span style='color:red;'>Room "+d+" is not found, or the distance is too far (more than 20).</span>"}}catch(e){u=!0,y=e}finally{try{!m&&c.return&&c.return()}finally{if(u)throw y}}var f=new n.CommandOrder
f.room=e,f.tier=0,f.role=s.Role.Wrecker,f.route=t
for(var g=0;g<r;g++)n.addCommandOrder(f)
return i+"Room "+e+" is preparing "+r+" wreckers to attack: "+JSON.stringify(t)+"<br/><span style='color:green;'>Attack successfully initialized.</span>"}},{key:"dismantleOutpost",value:function(e,r){var o=e+": Dismantling outpost "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
return void 0===t.controller||!t.controller.my||t.controller.level<1?o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>":Game.map.getRoomLinearDistance(e,r)<10?(t.memory.dismantleTargetRoom=r,o+"Room will now be captured for dismantling: "+r+"<br/><span style='color:green;'>Dismantling successfully ordered.</span>"):o+"<span style='color:red;'>Room "+r+" is not found, or the distance is too far (more than 9).</span>"}},{key:"addOutpost",value:function(e,r){var o=e+": Adding outpost "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
return void 0===t.controller||!t.controller.my||t.controller.level<1?o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>":Game.map.getRoomLinearDistance(e,r)<5?(void 0===t.memory.outposts&&(t.memory.outposts=[]),e===r?o+"<span style='color:red;'>Room "+e+" can't be it's own outpost.</span>":_.contains(t.memory.outposts,r)?o+"<span style='color:red;'>Room "+e+" already has "+r+" as an outpost.</span>":(t.memory.outposts.push(r),o+"Room now has these outposts: "+JSON.stringify(t.memory.outposts)+"<br/><span style='color:green;'>Outpost successfully added.</span>")):o+"<span style='color:red;'>Room "+r+" is not found, or the distance is too far (more than 4).</span>"}},{key:"removeOutpost",value:function(e,r){var o=e+": Adding outpost "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
return void 0===t.controller||!t.controller.my||t.controller.level<1?o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>":_.contains(t.memory.outposts,r)?(_.pull(t.memory.outposts,r),o+"Room now has these outposts: "+JSON.stringify(t.memory.outposts)+"<br/><span style='color:green;'>Outpost successfully removed.</span>"):o+"<span style='color:red;'>Room "+e+" does not have "+r+" as an outpost.</span>"}},{key:"addExpansion",value:function(e,r){var o=e+": Adding expansion "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
if(void 0===t.controller||!t.controller.my||t.controller.level<1)return o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>"
if(void 0!==t.memory.expansion)return o+"<span style='color:red;'>Room "+e+" already has "+r+" as an expansion.</span>"
for(var n=arguments.length,a=Array(n>2?n-2:0),i=2;i<n;i++)a[i-2]=arguments[i]
return void 0!==a&&a.length>0&&(t.memory.expansionRoute=a),t.memory.expansion=r,o+"Room now has this expansion: "+JSON.stringify(t.memory.expansion)+"<br/><span style='color:green;'>Expansion successfully added.</span>"}},{key:"removeExpansion",value:function(e,r){var o=e+": Removing expansion "+r+"<br/>"
if(void 0===Game.rooms[e])return o+"<span style='color:red;'>Room "+e+" not found.</span>"
var t=Game.rooms[e]
return void 0===t.controller||!t.controller.my||t.controller.level<1?o+"<span style='color:red;'>Room "+e+" is not controlled by you.</span>":void 0===t.memory.expansion?o+"<span style='color:red;'>Room "+e+" does not have "+r+" as an expansion.</span>":(t.memory.expansion=void 0,t.memory.expansionRoute=void 0,o+"Room now has no expansion: "+JSON.stringify(t.memory.expansion)+"<br/><span style='color:green;'>Expansion successfully removed.</span>")}},{key:"mineralreport",value:function(){var e=t.getMinerals(),r="Minerals currently controlled: <br/>",o=!0,n=!1,a=void 0
try{for(var i,s=Object.keys(e)[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var l=i.value
r+=e[l]+" "+l+" | "}}catch(e){n=!0,a=e}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}return r.slice(0,-2)}},{key:"portalreport",value:function(){var e="<strong>Portals currently active</strong> <br/>"
if(void 0===Memory.portals||Object.keys(Memory.portals).length<1)e+="No portals found"
else{var r=!0,o=!1,t=void 0
try{for(var n,a=Object.keys(Memory.portals)[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var i=n.value
e+="From <a href='#!/room/"+i+"'>"+i+"</a> to <a href='#!/room/"+Memory.portals[i].dest+"'>"+Memory.portals[i].dest+"</a> - Uptime: "+(Game.time-Memory.portals[i].firstSeen),void 0!==Memory.portals[i].decay&&(e+=" - Only active for about "+Memory.portals[i].decay+" more ticks"),e+="<br/>"}}catch(e){o=!0,t=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw t}}}return e}},{key:"roomreport",value:function(e){var r=Game.rooms[e]
return void 0===r?"Room not found":void 0!==r.controller&&r.controller.my?void 0:"Room not controlled"}},{key:"addHaulOperation",value:function(e,r,o,t){var n="Initializing haul operation from "+e+" to "+r+" <br/>"
if(void 0===Game.rooms[e])return n+"<span style='color:red;'>Room "+e+" not found.</span>"
if(!(Game.map.getRoomLinearDistance(e,r)<15))return n+"<span style='color:red;'>Room "+r+" is not found, or the distance is too far (more than 15).</span>"
if(o<1)return n+"<span style='color:red;'>Energy per tick needs to be 1 or more.</span>"
if(t<2||t>8)return n+"<span style='color:red;'>Level to end operation needs to be between 2 and 8.</span>"
var i=new a.Data
return i.operationtype=l.OperationType.Haul,i.from=e,i.to=r,i.amount=o,i.victoryCondition=a.VictoryCondition.RoomLevel,i.victoryValue=t,void 0===Memory.operations&&(Memory.operations=[]),Memory.operations.push(i),n+"Started haul operation from "+e+" to "+r+", hauling "+o+" energy per tick<br/><span style='color:green;'>Operation successfully added.</span>"}},{key:"addDrainOperation",value:function(e,r,o,t){var n="Initializing drain operation on "+r+" using room "+r+" <br/>"
if(void 0===Game.rooms[e])return n+"<span style='color:red;'>Room "+e+" not found.</span>"
if(!(Game.map.getRoomLinearDistance(e,r)<15))return n+"<span style='color:red;'>Room "+r+" is not found, or the distance is too far (more than 15).</span>"
if(o.length<0)return n+"<span style='color:red;'>Route "+o+" invalid.</span>"
var a=new i.Data
return a.operationtype=l.OperationType.Drain,a.spawnRoom=e,a.targetRoom=r,a.targetRoute=o,a.victoryCondition=i.VictoryCondition.HostileRoomEnergy,a.tier=t,void 0===Memory.operations&&(Memory.operations=[]),Memory.operations.push(a),n+"Started drain operation on room: "+r+"<br/><span style='color:green;'>Operation successfully added.</span>"}}]),e}()
r.Command=y,r.command=new y}])
