export enum ManagerPriority {
    Critical = 1,
    Standard = 2,
    Low = 3,
    Trivial = 4,
    Overflow = 5,
    None = 6
}

export abstract class Manager {

    private name:string;

    constructor(name: string) {
        this.name = name;
        this.memoryCheck();
    }
    public abstract run(pri: ManagerPriority): void;
    protected memoryCheck() {
        if (Memory.manager === undefined) {
            Memory.manager = {};
        }
        if (Memory.manager[this.name] === undefined) {
            Memory.manager[this.name] = {};
        }
    }
    protected getValue(name: string): any {
        return Memory.manager[this.name][name];
    }
    protected setValue(name: string, value: any): void {
        //console.log("Saving value " + value + " for " + this.constructor.name + " in " + name);
        Memory.manager[this.name][name] = value;
    }
}
