"use strict";
function getB3TeamWreckerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, 4, [TOUGH]);
    body = addToBody(body, tier * 4, [TOUGH]);
    body = addToBody(body, 14, [WORK]);
    if (tier > 1) {
        body = addToBody(body, 6, [WORK]);
    }
    body = addToBody(body, 2, [RANGED_ATTACK]);
    if (tier > 1) {
        body = addToBody(body, 2, [RANGED_ATTACK]);
    }
    body = addToBody(body, 6, [MOVE]);
    if (tier === 2) {
        body = addToBody(body, 3, [MOVE]);
    }
    if (tier === 3) {
        body = addToBody(body, 4, [MOVE]);
    }
    return body;
}
exports.getB3TeamWreckerBody = getB3TeamWreckerBody;
function getB3TeamHealerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, 4, [TOUGH]);
    body = addToBody(body, tier * 4, [TOUGH]);
    body = addToBody(body, tier * 8, [HEAL]);
    body = addToBody(body, 4, [MOVE]);
    if (tier === 2) {
        body = addToBody(body, 3, [MOVE]);
    }
    if (tier === 3) {
        body = addToBody(body, 6, [MOVE]);
    }
    return body;
}
exports.getB3TeamHealerBody = getB3TeamHealerBody;
function getB2TeamWreckerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, 12, [TOUGH]);
    body = addToBody(body, 13, [WORK]);
    if (tier === 2) {
        body = addToBody(body, 2, [WORK]);
    }
    if (tier === 3) {
        body = addToBody(body, 7, [WORK]);
    }
    body = addToBody(body, 1 + tier, [RANGED_ATTACK]);
    body = addToBody(body, 9, [MOVE]);
    if (tier === 2) {
        body = addToBody(body, 1, [MOVE]);
    }
    if (tier === 3) {
        body = addToBody(body, 3, [MOVE]);
    }
    return body;
}
exports.getB2TeamWreckerBody = getB2TeamWreckerBody;
function getB2TeamHealerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, 4, [TOUGH]);
    if (tier > 1) {
        body = addToBody(body, 8, [TOUGH]);
    }
    body = addToBody(body, 8, [HEAL]);
    if (tier === 2) {
        body = addToBody(body, 10, [TOUGH]);
    }
    if (tier === 3) {
        body = addToBody(body, 14, [TOUGH]);
    }
    body = addToBody(body, 4, [MOVE]);
    if (tier === 2) {
        body = addToBody(body, 6, [MOVE]);
    }
    if (tier === 3) {
        body = addToBody(body, 8, [MOVE]);
    }
    return body;
}
exports.getB2TeamHealerBody = getB2TeamHealerBody;
function getB1TeamWreckerBody(tier) {
    if (tier > 1) {
        tier = 1;
    }
    let body = [];
    body = addToBody(body, 10, [TOUGH]);
    body = addToBody(body, 16, [WORK]);
    body = addToBody(body, 6, [RANGED_ATTACK]);
    body = addToBody(body, 16, [MOVE]);
    return body;
}
exports.getB1TeamWreckerBody = getB1TeamWreckerBody;
function getB1TeamHealerBody(tier) {
    if (tier > 1) {
        tier = 1;
    }
    let body = [];
    body = addToBody(body, 10, [TOUGH]);
    body = addToBody(body, 18, [HEAL]);
    body = addToBody(body, 14, [MOVE]);
    return body;
}
exports.getB1TeamHealerBody = getB1TeamHealerBody;
function getB0TeamWreckerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, 10, [WORK]);
    body = addToBody(body, 12, [MOVE]);
    if (tier === 2) {
        body = addToBody(body, 8, [MOVE]);
    }
    if (tier === 3) {
        body = addToBody(body, 13, [MOVE]);
    }
    if (tier === 2) {
        body = addToBody(body, 6, [WORK]);
    }
    if (tier === 3) {
        body = addToBody(body, 11, [WORK]);
    }
    body = addToBody(body, 2, [RANGED_ATTACK]);
    if (tier > 1) {
        body = addToBody(body, 2, [RANGED_ATTACK]);
    }
    return body;
}
exports.getB0TeamWreckerBody = getB0TeamWreckerBody;
function getB0TeamHealerBody(tier) {
    if (tier > 3) {
        tier = 3;
    }
    let body = [];
    body = addToBody(body, tier * 3, [HEAL]);
    body = addToBody(body, tier * 7, [MOVE]);
    body = addToBody(body, tier * 4, [HEAL]);
    return body;
}
exports.getB0TeamHealerBody = getB0TeamHealerBody;
function getPoachGuardBody() {
    let body = [];
    body = addToBody(body, 25, [MOVE]);
    body = addToBody(body, 20, [ATTACK]);
    body = addToBody(body, 5, [HEAL]);
    return body;
}
exports.getPoachGuardBody = getPoachGuardBody;
function getPoachMinerBody() {
    let body = [];
    body = addToBody(body, 15, [MOVE]);
    body = addToBody(body, 30, [WORK]);
    body = addToBody(body, 5, [CARRY]);
    return body;
}
exports.getPoachMinerBody = getPoachMinerBody;
function getPraiserBody() {
    let body = [];
    body = addToBody(body, 42, [WORK]);
    body = addToBody(body, 2, [CARRY]);
    body = addToBody(body, 6, [MOVE]);
    return body;
}
exports.getPraiserBody = getPraiserBody;
function getSKGuardBody() {
    let body = [];
    body = addToBody(body, 2, [RANGED_ATTACK]);
    body = addToBody(body, 21, [MOVE]);
    body = addToBody(body, 15, [ATTACK]);
    body = addToBody(body, 4, [RANGED_ATTACK]);
    return body;
}
exports.getSKGuardBody = getSKGuardBody;
function getSKHealerBody() {
    let body = [];
    body = addToBody(body, 2, [HEAL]);
    body = addToBody(body, 15, [MOVE]);
    body = addToBody(body, 13, [HEAL]);
    return body;
}
exports.getSKHealerBody = getSKHealerBody;
function getBankAttacker() {
    let body = [];
    body = addToBody(body, 20, [MOVE]);
    body = addToBody(body, 20, [ATTACK]);
    return body;
}
exports.getBankAttacker = getBankAttacker;
function getBankRanger() {
    let body = [];
    body = addToBody(body, 23, [MOVE]);
    body = addToBody(body, 16, [RANGED_ATTACK]);
    body = addToBody(body, 7, [HEAL]);
    return body;
}
exports.getBankRanger = getBankRanger;
function getEngineerBody(tier) {
    if (tier > 12) {
        tier = 12;
    }
    return addToBody([], tier, [WORK, CARRY, MOVE, MOVE]);
}
exports.getEngineerBody = getEngineerBody;
function getMaxTierEngineer(energy) {
    return getMaxTier(energy, getEngineerBody, 12);
}
exports.getMaxTierEngineer = getMaxTierEngineer;
function getTaggerBody() {
    let body = addToBody([], 1, [WORK, MOVE]);
    body = addToBody(body, 10, [CARRY, MOVE]);
    return body;
}
exports.getTaggerBody = getTaggerBody;
function getHaulerEngineerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    return addToBody([], tier, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
}
exports.getHaulerEngineerBody = getHaulerEngineerBody;
function getMaxTierHaulerEngineer(energy) {
    return getMaxTier(energy, getHaulerEngineerBody, 8);
}
exports.getMaxTierHaulerEngineer = getMaxTierHaulerEngineer;
function getConsultantBody(tier) {
    if (tier > 16) {
        tier = 16;
    }
    return addToBody([], tier, [WORK, CARRY, MOVE]);
}
exports.getConsultantBody = getConsultantBody;
function getMaxTierConsultant(energy) {
    return getMaxTier(energy, getConsultantBody, 16);
}
exports.getMaxTierConsultant = getMaxTierConsultant;
function getWorkerBody(tier) {
    if (tier > 16) {
        tier = 16;
    }
    let body = [];
    body = addToBody(body, Math.floor(tier / 2), [WORK, WORK, MOVE]);
    body = addToBody(body, Math.ceil(tier / 2), [WORK, CARRY, MOVE]);
    return body;
}
exports.getWorkerBody = getWorkerBody;
function getMaxTierWorker(energy) {
    return getMaxTier(energy, getWorkerBody, 16);
}
exports.getMaxTierWorker = getMaxTierWorker;
function getMinerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    body = addToBody(body, 3, [WORK, WORK, MOVE]);
    if (tier === 8) {
        body = addToBody(body, 2, [WORK, WORK, MOVE]);
    }
    body = addToBody(body, 1, [CARRY]);
    return body;
}
exports.getMinerBody = getMinerBody;
function getMaxTierMiner(energy) {
    return getMaxTier(energy, getMinerBody, 8);
}
exports.getMaxTierMiner = getMaxTierMiner;
function getSkMinerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    body = addToBody(body, 4, [WORK, WORK, MOVE]);
    if (tier === 8) {
        body = addToBody(body, 3, [WORK, WORK, MOVE]);
    }
    body = addToBody(body, 1, [CARRY]);
    return body;
}
exports.getSkMinerBody = getSkMinerBody;
function getMaxTierSkMiner(energy) {
    return getMaxTier(energy, getSkMinerBody, 8);
}
exports.getMaxTierSkMiner = getMaxTierSkMiner;
function getStationaryWorkerBody(tier) {
    if (tier > 13) {
        tier = 13;
    }
    let body = [];
    body = addToBody(body, Math.floor(Math.min(tier, 12) / 2), [WORK, WORK, WORK, MOVE]);
    body = addToBody(body, Math.ceil(Math.min(tier, 12) / 2), [WORK, WORK, CARRY, MOVE]);
    if (tier === 13) {
        body = addToBody(body, 1, [WORK, MOVE]);
    }
    return body;
}
exports.getStationaryWorkerBody = getStationaryWorkerBody;
function getMaxTierStationaryWorker(energy) {
    return getMaxTier(energy, getStationaryWorkerBody, 13);
}
exports.getMaxTierStationaryWorker = getMaxTierStationaryWorker;
function getProtectorBody(tier) {
    if (tier > 4) {
        tier = 4;
    }
    let body = [];
    body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
    body = addToBody(body, tier, [CARRY, MOVE]);
    body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
    return body;
}
exports.getProtectorBody = getProtectorBody;
function getMaxTierProtector(energy) {
    return getMaxTier(energy, getProtectorBody, 4);
}
exports.getMaxTierProtector = getMaxTierProtector;
function getOffroadWorkerBody(tier) {
    if (tier > 12) {
        tier = 12;
    }
    let body = [];
    body = addToBody(body, tier - 1, [WORK, WORK, MOVE, MOVE]);
    body = addToBody(body, 1, [WORK, CARRY, MOVE, MOVE]);
    return body;
}
exports.getOffroadWorkerBody = getOffroadWorkerBody;
function getMaxTierOffroadWorker(energy) {
    return getMaxTier(energy, getOffroadWorkerBody, 12);
}
exports.getMaxTierOffroadWorker = getMaxTierOffroadWorker;
function getDistanceWorkerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    return addToBody([], tier, [CARRY, CARRY, MOVE, WORK, CARRY, MOVE]);
}
exports.getDistanceWorkerBody = getDistanceWorkerBody;
function getMaxTierDistanceWorker(energy) {
    return getMaxTier(energy, getDistanceWorkerBody, 8);
}
exports.getMaxTierDistanceWorker = getMaxTierDistanceWorker;
function getWorkOnlyBody(tier) {
    if (tier > 16) {
        tier = 16;
    }
    return addToBody([], tier, [WORK, WORK, MOVE]);
}
exports.getWorkOnlyBody = getWorkOnlyBody;
function getMaxTierWorkOnly(energy) {
    return getMaxTier(energy, getWorkOnlyBody, 16);
}
exports.getMaxTierWorkOnly = getMaxTierWorkOnly;
function getOffroadWorkOnlyBody(tier) {
    if (tier > 25) {
        tier = 25;
    }
    return addToBody([], tier, [WORK, MOVE]);
}
exports.getOffroadWorkOnlyBody = getOffroadWorkOnlyBody;
function getMaxTierOffroadWorkOnly(energy) {
    return getMaxTier(energy, getWorkOnlyBody, 25);
}
exports.getMaxTierOffroadWorkOnly = getMaxTierOffroadWorkOnly;
function getHaulerBody(tier) {
    if (tier > 16) {
        tier = 16;
    }
    return addToBody([], tier, [CARRY, CARRY, MOVE]);
}
exports.getHaulerBody = getHaulerBody;
function getMaxTierHauler(energy) {
    return getMaxTier(energy, getHaulerBody, 16);
}
exports.getMaxTierHauler = getMaxTierHauler;
function getOffroadHaulerBody(tier) {
    if (tier > 25) {
        tier = 25;
    }
    return addToBody([], tier, [CARRY, MOVE]);
}
exports.getOffroadHaulerBody = getOffroadHaulerBody;
function getMaxTierOffroadHauler(energy) {
    return getMaxTier(energy, getOffroadHaulerBody, 25);
}
exports.getMaxTierOffroadHauler = getMaxTierOffroadHauler;
function getClaimerBody(tier) {
    if (tier > 25) {
        tier = 25;
    }
    return addToBody([], tier, [CLAIM, MOVE]);
}
exports.getClaimerBody = getClaimerBody;
function getMaxTierClaimer(energy) {
    return getMaxTier(energy, getClaimerBody, 25);
}
exports.getMaxTierClaimer = getMaxTierClaimer;
function getSwampClaimerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    return addToBody([], tier, [MOVE, MOVE, MOVE, MOVE, CLAIM, MOVE]);
}
exports.getSwampClaimerBody = getSwampClaimerBody;
function getMaxTierSwampClaimer(energy) {
    return getMaxTier(energy, getClaimerBody, 8);
}
exports.getMaxTierSwampClaimer = getMaxTierSwampClaimer;
function getScoutBody(tier) {
    if (tier > 50) {
        tier = 50;
    }
    return addToBody([], tier, [MOVE]);
}
exports.getScoutBody = getScoutBody;
function getMaxTierScout(energy) {
    return getMaxTier(energy, getScoutBody, 50);
}
exports.getMaxTierScout = getMaxTierScout;
function getHealerBody(tier) {
    if (tier > 25) {
        tier = 25;
    }
    let body = [];
    body = addToBody(body, tier, [HEAL]);
    body = addToBody(body, tier, [MOVE]);
    return body;
}
exports.getHealerBody = getHealerBody;
function getMaxTierHealer(energy) {
    return getMaxTier(energy, getHealerBody, 25);
}
exports.getMaxTierHealer = getMaxTierHealer;
function getWarriorBody(tier) {
    if (tier > 12) {
        tier = 12;
    }
    let body = [];
    body = addToBody(body, tier, [TOUGH]);
    body = addToBody(body, tier, [ATTACK, MOVE]);
    body = addToBody(body, tier, [MOVE]);
    return body;
}
exports.getWarriorBody = getWarriorBody;
function getMaxTierWarrior(energy) {
    return getMaxTier(energy, getWarriorBody, 12);
}
exports.getMaxTierWarrior = getMaxTierWarrior;
function getRogueBody(tier) {
    if (tier > 24) {
        tier = 24;
    }
    let body = [];
    body = addToBody(body, tier, [ATTACK]);
    body = addToBody(body, tier, [MOVE]);
    return body;
}
exports.getRogueBody = getRogueBody;
function getMaxTierRogue(energy) {
    return getMaxTier(energy, getRogueBody, 24);
}
exports.getMaxTierRogue = getMaxTierRogue;
function getBaseRangerBody(tier) {
    if (tier > 12) {
        tier = 12;
    }
    let body = [];
    body = addToBody(body, tier, [RANGED_ATTACK, RANGED_ATTACK]);
    body = addToBody(body, tier, [MOVE, MOVE]);
    return body;
}
exports.getBaseRangerBody = getBaseRangerBody;
function getMaxTierBaseRanger(energy) {
    return getMaxTier(energy, getBaseRangerBody, 12);
}
exports.getMaxTierBaseRanger = getMaxTierBaseRanger;
function getRangerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    switch (tier) {
        case 1:
        case 2:
            body = addToBody(body, tier, [RANGED_ATTACK, MOVE]);
            break;
        case 3:
            body = addToBody(body, 2, [RANGED_ATTACK]);
            body = addToBody(body, 1, [HEAL, MOVE]);
            body = addToBody(body, 2, [MOVE]);
            break;
        case 4:
            body = addToBody(body, 4, [RANGED_ATTACK]);
            body = addToBody(body, 1, [HEAL, MOVE]);
            ;
            body = addToBody(body, 4, [MOVE]);
            break;
        case 5:
            body = addToBody(body, 5, [RANGED_ATTACK]);
            body = addToBody(body, 2, [HEAL, MOVE]);
            body = addToBody(body, 5, [MOVE]);
            break;
        case 6:
            body = addToBody(body, 6, [RANGED_ATTACK]);
            body = addToBody(body, 3, [HEAL, MOVE]);
            body = addToBody(body, 6, [MOVE]);
            break;
        case 7:
            body = addToBody(body, 15, [RANGED_ATTACK]);
            body = addToBody(body, 5, [HEAL, MOVE]);
            body = addToBody(body, 15, [MOVE]);
            break;
        case 8:
            body = addToBody(body, 17, [RANGED_ATTACK]);
            body = addToBody(body, 8, [HEAL, MOVE]);
            body = addToBody(body, 17, [MOVE]);
            break;
    }
    return body;
}
exports.getRangerBody = getRangerBody;
function getMaxTierRanger(energy) {
    return getMaxTier(energy, getRangerBody, 8);
}
exports.getMaxTierRanger = getMaxTierRanger;
function getSupporterBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    switch (tier) {
        case 1:
            body = addToBody(body, 1, [HEAL, MOVE]);
            break;
        case 2:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 1, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 3:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 2, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 4:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 3, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 5:
            body = addToBody(body, 2, [RANGED_ATTACK]);
            body = addToBody(body, 4, [HEAL, MOVE]);
            body = addToBody(body, 2, [MOVE]);
            break;
        case 6:
            body = addToBody(body, 3, [RANGED_ATTACK]);
            body = addToBody(body, 5, [HEAL, MOVE]);
            body = addToBody(body, 3, [MOVE]);
            break;
        case 7:
            body = addToBody(body, 5, [RANGED_ATTACK]);
            body = addToBody(body, 10, [HEAL, MOVE]);
            body = addToBody(body, 5, [MOVE]);
            break;
        case 8:
            body = addToBody(body, 10, [RANGED_ATTACK]);
            body = addToBody(body, 15, [HEAL, MOVE]);
            body = addToBody(body, 10, [MOVE]);
            break;
    }
    return body;
}
exports.getSupporterBody = getSupporterBody;
function getMaxTierSupporter(energy) {
    return getMaxTier(energy, getSupporterBody, 8);
}
exports.getMaxTierSupporter = getMaxTierSupporter;
function getPaladinBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    switch (tier) {
        case 1:
        case 2:
            body = addToBody(body, tier, [MOVE, ATTACK]);
            break;
        case 3:
            body = addToBody(body, 3, [ATTACK]);
            body = addToBody(body, 3, [MOVE]);
            body = addToBody(body, 1, [MOVE, HEAL]);
            break;
        case 4:
            body = addToBody(body, 6, [ATTACK]);
            body = addToBody(body, 6, [MOVE]);
            body = addToBody(body, 1, [MOVE, HEAL]);
            break;
        case 5:
            body = addToBody(body, 8, [ATTACK]);
            body = addToBody(body, 8, [MOVE]);
            body = addToBody(body, 2, [MOVE, HEAL]);
            break;
        case 6:
            body = addToBody(body, 10, [ATTACK]);
            body = addToBody(body, 10, [MOVE]);
            body = addToBody(body, 3, [MOVE, HEAL]);
            break;
        case 7:
        case 8:
            body = addToBody(body, 20, [ATTACK]);
            body = addToBody(body, 20, [MOVE]);
            body = addToBody(body, 5, [MOVE, HEAL]);
            break;
    }
    return body;
}
exports.getPaladinBody = getPaladinBody;
function getMaxTierPaladin(energy) {
    return getMaxTier(energy, getPaladinBody, 8);
}
exports.getMaxTierPaladin = getMaxTierPaladin;
function getDrainerBody(tier) {
    if (tier > 8) {
        tier = 8;
    }
    let body = [];
    switch (tier) {
        case 1:
            body = addToBody(body, 1, [HEAL, MOVE]);
            break;
        case 2:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 1, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 3:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 2, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 4:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 3, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 5:
            body = addToBody(body, 1, [RANGED_ATTACK]);
            body = addToBody(body, 5, [HEAL, MOVE]);
            body = addToBody(body, 1, [MOVE]);
            break;
        case 6:
            body = addToBody(body, 2, [RANGED_ATTACK]);
            body = addToBody(body, 6, [HEAL, MOVE]);
            body = addToBody(body, 2, [MOVE]);
            break;
        case 7:
            body = addToBody(body, 5, [RANGED_ATTACK]);
            body = addToBody(body, 15, [HEAL, MOVE]);
            body = addToBody(body, 5, [MOVE]);
            break;
        case 8:
            body = addToBody(body, 5, [RANGED_ATTACK]);
            body = addToBody(body, 20, [HEAL, MOVE]);
            body = addToBody(body, 5, [MOVE]);
            break;
    }
    return body;
}
exports.getDrainerBody = getDrainerBody;
function getMaxTierDrainer(energy) {
    return getMaxTier(energy, getDrainerBody, 8);
}
exports.getMaxTierDrainer = getMaxTierDrainer;
function getKiterBody(tier) {
    if (tier > 10) {
        tier = 10;
    }
    return addToBody([], tier, [RANGED_ATTACK, MOVE, HEAL, MOVE]);
}
exports.getKiterBody = getKiterBody;
function getMaxTierKiter(energy) {
    return getMaxTier(energy, getKiterBody, 10);
}
exports.getMaxTierKiter = getMaxTierKiter;
function getCostForBody(body) {
    let cost = 0;
    for (let bodypart of body) {
        cost += getCostForBodypart(bodypart);
    }
    return cost;
}
exports.getCostForBody = getCostForBody;
function getMaxTier(energy, bodyfunction, maxTier) {
    let tier = 0;
    let maxReached = false;
    for (let i = 1; !maxReached; i++) {
        let cost = getCostForBody(bodyfunction(i));
        if (cost > energy || i > maxTier) {
            maxReached = true;
        }
        else {
            tier = i;
        }
    }
    return tier;
}
function getCostForBodypart(bodypart) {
    switch (bodypart) {
        case TOUGH: return 10;
        case MOVE: return 50;
        case CARRY: return 50;
        case ATTACK: return 80;
        case WORK: return 100;
        case RANGED_ATTACK: return 150;
        case HEAL: return 250;
        case CLAIM: return 600;
        default: return 0;
    }
}
function addToBody(body, count, parts) {
    for (let i = 0; i < count; i++) {
        for (let part of parts) {
            body.push(part);
        }
    }
    return body;
}
