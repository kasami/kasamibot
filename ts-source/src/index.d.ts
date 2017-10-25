interface Memory {
    sources: any;
    minerals: any;
    stats: any;
    empire: any;
    settings: any;
    takenBanks: any;
    marketBuy: any;
    marketSell: any;
    commandOrders: any;
    temp: any;
    friendly: string[];
    operations: any;
    manager: any;
    portals: {[roomName: string]: {firstSeen: number, decay: number | undefined, dest: string}};
    playerthreat: {[name: string]: number};
}

interface global {
    intel: {[roomName: string]: any}
}

declare var global: any;

declare var require: any;
