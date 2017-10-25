import {Role} from "../enums/Role";

export class CommandOrder {
    public room: string;
    public role: Role;
    public tier: number;
    public target: string;
    public targets?: string[];
    public route?: string[];
    public tickForOrder?: number;
    public boosted?: boolean;
}

export function addCommandOrder(order: CommandOrder): void {
    if (Memory.commandOrders === undefined) {
        Memory.commandOrders = [];
    }
    Memory.commandOrders.push(order);
}

export function commandOrderIsValid(order: CommandOrder): boolean {
    if (!(Game.rooms[order.room] instanceof Room)) {
        return false;
    }
    return true;
}
