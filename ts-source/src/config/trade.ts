var tradeConfig = {
    sendToNeighboursWhenTerminalEnergyAbove: 100000,
    sendToNeighboursWhenStorageEnergyAbove: 500000,
    requestCrisisEnergyWhenTerminalEnergyBelow: 80000,
    requestCrisisEnergyWhenStorageEnergyBelow: 30000,
    energyLimitForSendingMinerals: 10000,
    energyLimitForProvidingCrisisEnergy: 150000,
    sendMineralsToOtherRoomsWhenAbove: 6000,
    sendMineralsToGoodDealsWhenAbove: 150000,
    sendMineralsToSellOrderWhenAbove: 100000,
    sendMineralsToBuyOrdersWhenAbove: 200000,
    sendEnergyToBuyOrdersWhenAbove: 600000,
    sendPowerToBuyOrdersWhenAbove: 150000, // TODO, make sell order and distribute first
    sendPowerWhenTerminalAbove: 12000,
    sendPowerWhenStorageAbove: 50000,
    sendUpgradeBoostWhenAbove: 4000,
    batchSizeForSendingEnergy: 50000,
    batchSizeForSendingEverythingOut: 10000,
    batchSizeForSendingMinerals: 2000,
    batchSizeForSendingPower: 2000,
    batchSizeForSendingUpgradeBoost: 2000,
    batchSizeForCrisisEnergy: 20000
}

export = tradeConfig
