"use strict";
const _Manager_1 = require("./managers._Manager");
class MarketManager extends _Manager_1.Manager {
    constructor() {
        super("MarketManager");
        this.MEMORY_LASTRUN = "lastRun";
    }
    run(pri) {
        if (pri === _Manager_1.ManagerPriority.Trivial) {
            let lastRun = this.getValue(this.MEMORY_LASTRUN);
            if (lastRun === undefined || lastRun + 100 < Game.time) {
                updateMarketPrices();
                this.setValue(this.MEMORY_LASTRUN, Game.time);
            }
        }
    }
}
exports.MarketManager = MarketManager;
function getResourcePrice(resource) {
    if (Memory.marketSell !== undefined && Memory.marketSell[resource] !== undefined) {
        return Memory.marketSell[resource];
    }
    return undefined;
}
exports.getResourcePrice = getResourcePrice;
function getResourceBuyPrice(resource) {
    if (Memory.marketBuy !== undefined && Memory.marketBuy[resource] !== undefined) {
        return Memory.marketBuy[resource];
    }
    return undefined;
}
exports.getResourceBuyPrice = getResourceBuyPrice;
function updateMarketPrices() {
    Memory.marketBuy = {};
    Memory.marketSell = {};
    let myActiveOrderIds = _.map(getMyActiveOrders(), function (o) { return o.id; });
    for (let o of Game.market.getAllOrders()) {
        if (o.amount >= 1000 && !_.contains(myActiveOrderIds, o.id)) {
            if (o.type === ORDER_SELL && (Memory.marketSell[o.resourceType] === undefined || Memory.marketSell[o.resourceType] > o.price)) {
                Memory.marketSell[o.resourceType] = o.price;
            }
            else if (o.type === ORDER_BUY && (Memory.marketBuy[o.resourceType] === undefined || Memory.marketBuy[o.resourceType] < o.price)) {
                Memory.marketBuy[o.resourceType] = o.price;
            }
        }
    }
}
function getMyActiveOrders() {
    return _.filter(Game.market.orders, function (o) { return o.active; });
}
