import {Role} from "../enums/role";

export class CreepService {

    private creepDictionary: {[role: number]: Creep[]};

    constructor() {
        this.creepDictionary = this.makeDictionary();
    }

    public getAllOfRole(role: Role): Creep[] {
        if (this.creepDictionary[role] !== undefined) {
            return this.creepDictionary[role];
        }
        return [];
    }

    public creepShouldRun(creep: Creep): boolean {
        if (creep.memory.homeroom === undefined) {
            creep.memory.homeroom = creep.room.name;
        }

        if (creep.spawning) {
            return false;
        }

        if (creep.memory.boost !== undefined) {
            creep.disable();
            if (creep.room.memory.boostTarget === undefined) {
                creep.room.memory.boostTarget = creep.id;
            }
            return false;
        }

        if (creep.isDisabled()) {
            return false;
        }
        return true;
    }

    public runCreeps(role: Role, func: Function) {
        for (let creep of this.getAllOfRole(role)) {
            if (this.creepShouldRun(creep)) {
                this.logUsedCpu(func, Role[creep.memory.role], creep);
                //func(creep);
            }
        }
    }

    public getNumberOfTiers(role: Role | null = null, target: string | null = null, homeroom: string | null = null): number {
        if (role !== null ) {
            if (this.creepDictionary[role] === undefined) {
                return 0;
            }
            let count = 0;
            for (let creep of this.creepDictionary[role]) {
                if ((target === null || creep.memory.target === target) &&
                    (homeroom === null || creep.memory.homeroom === homeroom)) {
                    if (creep.memory.tier) {
                        count += creep.memory.tier;
                    } else {
                        count++;
                    }
                }
            }
            return count;
        } else {
            let count = 0;
            for (let creepName in Game.creeps) {
                let creep = Game.creeps[creepName];
                if ((target === null || creep.memory.target === target) &&
                    (homeroom === null || creep.memory.homeroom === homeroom) &&
                    (role === null || creep.memory.role === role)) {
                    if (creep.memory.tier) {
                        count += creep.memory.tier;
                    } else {
                        count++;
                    }
                }
            }
            return count;
        }
    }

    public getCreeps(role: Role | null = null, target: string | null = null, homeroom: string | null = null): Creep[] {
        let creeps: Creep[] = [];
        if (role !== null ) {
            if (this.creepDictionary[role] === undefined) {
                return creeps;
            }
            for (let creep of this.creepDictionary[role]) {
                if ((target === null || creep.memory.target === target) &&
                    (homeroom === null || creep.memory.homeroom === homeroom)) {
                    creeps.push(creep);
                }
            }
            return creeps;
        } else {
            for (let creepName in Game.creeps) {
                let creep = Game.creeps[creepName];
                if ((target === null || creep.memory.target === target) &&
                    (homeroom === null || creep.memory.homeroom === homeroom) &&
                    (role === null || creep.memory.role === role)) {
                    creeps.push(creep);
                }
            }
            return creeps;
        }
    }

    public getIdleEnergyHaulers(homeroom: string | null = null): Creep[] {
        let list: Creep[] = [];
        if (this.creepDictionary[Role.EnergyHauler] === undefined) {
            return list;
        }
        for (let creep of this.creepDictionary[Role.EnergyHauler]) {
            let state = creep.getState();
            if ((creep.memory.homeroom === homeroom) &&
                (state === 1 || state === undefined)) {
                    list.push(creep);
            }
        }
        return list;
    }

    private makeDictionary(): {[role: number]: Creep[]} {
        let creeps: {[role: number]: Creep[]} = {};
        creeps[Role.UpgraderWithBoost] = [];
        creeps[Role.UpgraderWithoutBoost] = [];
        creeps[Role.PraiserWithBoost] = [];
        creeps[Role.PraiserWithoutBoost] = [];
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role === undefined) {
                console.log("Creep with unknown role: " + creep.name + " Pos: " + creep.pos);
                continue;
            }
            if (creeps[creep.memory.role] === undefined){
                creeps[creep.memory.role] = [];
            }
            creeps[creep.memory.role].push(creep);
            if (creep.memory.role === Role.Upgrader) {
                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
                    creeps[Role.UpgraderWithBoost].push(creep);
                } else {
                    creeps[Role.UpgraderWithoutBoost].push(creep);
                }
            } else
            if (creep.memory.role === Role.Praiser) {
                if (creep.body[0].boost === RESOURCE_CATALYZED_GHODIUM_ACID) {
                    creeps[Role.PraiserWithBoost].push(creep);
                } else {
                    creeps[Role.PraiserWithoutBoost].push(creep);
                }
            }
        }
        return creeps;
    }


    private logUsedCpu(func: Function, name: string,  ... args: any[]) {
        let cpuUsed = Game.cpu.getUsed();
        let result = func(... args);
        let usedCpu = Game.cpu.getUsed() - cpuUsed;
        if (Memory.stats['cpu.role.' + name + ".used"] === undefined) {
            Memory.stats['cpu.role.' + name + ".used"] = usedCpu;
        } else {
            Memory.stats['cpu.role.' + name + ".used"] += usedCpu;
        }
        if (Memory.stats['cpu.role.' + name + ".count"] === undefined) {
            Memory.stats['cpu.role.' + name + ".count"] = 1;
        } else {
            Memory.stats['cpu.role.' + name + ".count"] += 1;
        }
        if (args[0] !== undefined && args[0].memory.homeroom !== undefined && Memory.stats['room.' + args[0].memory.homeroom + '.creepCpu'] !== undefined) {
            Memory.stats['room.' + args[0].memory.homeroom + '.creepCpu'] += usedCpu;
        }
        return result;
    }
}
