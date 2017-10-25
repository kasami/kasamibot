import {Manager, ManagerPriority} from "../managers/_Manager";

export class MarketManager extends Manager {

    readonly MEMORY_LASTRUN = "lastRun";

    constructor() {
        super("MarketManager");
    }

    public run (pri: ManagerPriority): void {
        if (pri === ManagerPriority.Trivial) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
                updateMarketPrices();
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
}

export function getResourcePrice(resource: string): number | undefined {
    if (Memory.marketSell !== undefined && Memory.marketSell[resource] !== undefined) {
        return Memory.marketSell[resource];
    }

    return undefined;
}

export function getResourceBuyPrice(resource: string): number | undefined {
    if (Memory.marketBuy !== undefined && Memory.marketBuy[resource] !== undefined) {
        return Memory.marketBuy[resource];
    }

    return undefined;
}

function updateMarketPrices() {
    Memory.marketBuy = {};
    Memory.marketSell = {};
    let myActiveOrderIds = _.map(getMyActiveOrders(), function (o) {return o.id;});
    for (let o of Game.market.getAllOrders()) {
        if (o.amount >= 1000 && !_.contains(myActiveOrderIds, o.id)) {
            if (o.type === ORDER_SELL && (Memory.marketSell[o.resourceType] === undefined || Memory.marketSell[o.resourceType] > o.price)) {
                Memory.marketSell[o.resourceType] = o.price;
            } else
            if (o.type === ORDER_BUY && (Memory.marketBuy[o.resourceType] === undefined || Memory.marketBuy[o.resourceType] < o.price)) {
                Memory.marketBuy[o.resourceType] = o.price;
            }
        }

    }
}

function getMyActiveOrders(): Order[] {
    return _.filter(Game.market.orders, function (o) {return o.active;});
}

/*
function getMaximumBuyPrice(mineral: string, exceptOrderIds: string[]): number {
    let ordersForMineral = Game.market.getAllOrders( function(o: Order) {
        return o.type === ORDER_BUY && o.resourceType === mineral && o.remainingAmount >= 2000 && !_.contains(exceptOrderIds, o.id);
    });
    let maxPrice = 0;
    for (let order of ordersForMineral) {
        if (maxPrice < order.price) {
            maxPrice = order.price;
        }
    }
    return maxPrice;
}
*/
