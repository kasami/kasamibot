
/**
 * TeamWrecker is a special role for attacking bases, working together with TeamHealer.
 * Has WORK for deconstruct and RANGED_ATTACK for defense. All parts T3 boosted.
 * T1 - 2280 E, 8 TOUGH, 14 WORK, 2 RANGED_ATTACK, 6 MOVE
 * T2 - 3570 E, 12 TOUGH, 20 WORK, 4 RANGED_ATTACK, 9 MOVE
 * T3 - 4660 E, 16 TOUGH, 20 WORK, 4 RANGED_ATTACK, 10 MOVE
 */
export function getB3TeamWreckerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];

    body = addToBody(body, 4, [TOUGH])
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

/**
 * TeamHealer is a special role for support in teams, working together with other teammembers.
 * Has HEAL for healing. All parts boosted with T3 Boosts.
 * T1 - 2280 E, 8 TOUGH, 8 HEAL, 4 MOVE
 * T2 - 4470 E, 12 TOUGH, 16 HEAL, 7 MOVE
 * T3 - 6660 E, 16 TOUGH, 24 HEAL, 10 MOVE
 */
export function getB3TeamHealerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];

    body = addToBody(body, 4, [TOUGH])
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


/**
 * TeamWrecker is a special role for attacking bases, working together with TeamHealer.
 * Has WORK for deconstruct and RANGED_ATTACK for defense. All parts T2 boosted.
B2T1 Wrecker - 2280 E, 12 TOUGH, 13 WORK, 2 RANGED_ATTACK, 9 MOVE
B2T2 Wrecker - 2570 E, 12 TOUGH, 15 WORK, 3 RANGED_ATTACK, 10 MOVE
B2T3 Wrecker - 3320 E, 12 TOUGH, 20 WORK, 4 RANGED_ATTACK, 12 MOVE
 */
export function getB2TeamWreckerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];

    body = addToBody(body, 12, [TOUGH])

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

/**
* TeamHealer is a special role for support in teams, working together with other teammembers.
* Has HEAL for healing. All parts boosted with T2 Boosts.
B2T1 Healer - 2240 E, 4 TOUGH, 8 HEAL, 4 MOVE
B2T2 Healer - 5120 E, 12 TOUGH, 18 HEAL, 10 MOVE
B2T3 Healer - 6720 E, 12 TOUGH, 24 HEAL, 12 MOVE
*/
export function getB2TeamHealerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];

    body = addToBody(body, 4, [TOUGH])
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




/**
 * TeamWrecker is a special role for attacking bases, working together with TeamHealer.
 * Has WORK for deconstruct and RANGED_ATTACK for defense. All parts T2 boosted.
B1T1 Wrecker - 3400 E, 10 TOUGH, 16 WORK, 6 RANGED_ATTACK, 16 MOVE
 */
export function getB1TeamWreckerBody(tier: number): string[] {
    if (tier > 1) { tier = 1; }
    let body: string[] = [];

    body = addToBody(body, 10, [TOUGH])
    body = addToBody(body, 16, [WORK]);
    body = addToBody(body, 6, [RANGED_ATTACK]);
    body = addToBody(body, 16, [MOVE]);

    return body;
}

/**
* TeamHealer is a special role for support in teams, working together with other teammembers.
* Has HEAL for healing. All parts boosted with T2 Boosts.
B1T1 Healer - 5300 E, 10 TOUGH, 18 HEAL, 14 MOVE
*/
export function getB1TeamHealerBody(tier: number): string[] {
    if (tier > 1) { tier = 1; }
    let body: string[] = [];

    body = addToBody(body, 10, [TOUGH])
    body = addToBody(body, 18, [HEAL]);
    body = addToBody(body, 14, [MOVE]);

    return body;
}

/**
 * Unboosted version of TeamWrecker
 *
 * Has WORK for deconstruct and RANGED_ATTACK for defense.
 * T1 - 1900 E, 10 WORK, 2 RANGED_ATTACK, 12 MOVE
 * T2 - 3200 E, 16 WORK, 4 RANGED_ATTACK, 20 MOVE
 * T3 - 3950 E, 21 WORK, 4 RANGED_ATTACK, 25 MOVE
 */


export function getB0TeamWreckerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];

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

/**
 * Unboosted version of TeamHealer
 * Has HEAL for healing.
 * T1 - 2100 E, 7 HEAL, 7 MOVE
 * T2 - 4200 E, 14 HEAL, 14 MOVE
 * T3 - 6300 E, 21 HEAL, 21 MOVE
 */
export function getB0TeamHealerBody(tier: number): string[] {
    if (tier > 3) { tier = 3; }
    let body: string[] = [];
    body = addToBody(body, tier * 3, [HEAL]);

    body = addToBody(body, tier * 7, [MOVE]);

    body = addToBody(body, tier * 4, [HEAL]);


    return body;
}

/* Poaching-creeps (for lair-mineralmining)
  Can be used from RCL 7
*/
export function getPoachGuardBody(): string[] {
  let body: string[] = [];
  body = addToBody(body, 25, [MOVE]);
  body = addToBody(body, 20, [ATTACK]);
  body = addToBody(body, 5, [HEAL]);
  return body;
}

export function getPoachMinerBody(): string[] {
  let body: string[] = [];
  body = addToBody(body, 15, [MOVE]);
  body = addToBody(body, 30, [WORK]);
  body = addToBody(body, 5, [CARRY]);
  return body;
}


export function getPraiserBody(): string[] {
  let body: string[] = [];
  body = addToBody(body, 42, [WORK]);
  body = addToBody(body, 2, [CARRY]);
  body = addToBody(body, 6, [MOVE]);
  return body;
}

export function getSKGuardBody(): string[] {
  let body: string[] = [];
  body = addToBody(body, 2, [RANGED_ATTACK]);
  body = addToBody(body, 21, [MOVE]);
  body = addToBody(body, 15, [ATTACK]);
  body = addToBody(body, 4, [RANGED_ATTACK]);
  return body;
}

export function getSKHealerBody(): string[] {
  let body: string[] = [];
  body = addToBody(body, 2, [HEAL]);
  body = addToBody(body, 15, [MOVE]);
  body = addToBody(body, 13, [HEAL]);
  return body;
}

export function getBankAttacker(): string[] {
  let body: string[] = [];
  body = addToBody(body, 20, [MOVE]);
  body = addToBody(body, 20, [ATTACK]);
  return body;
}

export function getBankRanger(): string[] {
  let body: string[] = [];
  body = addToBody(body, 23, [MOVE]);
  body = addToBody(body, 16, [RANGED_ATTACK]);
  body = addToBody(body, 7, [HEAL]);
  return body;
}


/**
 * Engineers are able to move each tick without roads, not on swamp. Balanced
 * [WORK, CARRY, MOVE, MOVE] * Tier
 * Each Tier cost 250 energy
 */
export function getEngineerBody(tier: number): string[] {
  if (tier > 12) { tier = 12; }
  return addToBody([], tier, [WORK, CARRY, MOVE, MOVE]);
}
export function getMaxTierEngineer(energy: number): number {
  return getMaxTier(energy, getEngineerBody, 12);
}

export function getTaggerBody(): string[] {
  let body: string[] = addToBody([], 1, [WORK, MOVE]);
  body = addToBody(body, 10, [CARRY, MOVE]);
  return body;
}

/**
 * HaulerEngineers are able to move each tick without roads, not on swamp. Focus on carry
 * [WORK, CARRY, CARRY, MOVE, MOVE, MOVE] * Tier
 * Each Tier cost 250 energy
 */
export function getHaulerEngineerBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  return addToBody([], tier, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
}
export function getMaxTierHaulerEngineer(energy: number): number {
  return getMaxTier(energy, getHaulerEngineerBody, 8);
}

/**
 * Work Consultants are able to move each tick on roads, balanced.
 * [WORK, CARRY, MOVE] * Tier
 * Each Tier cost 200 energy
 */
export function getConsultantBody(tier: number): string[] {
  if (tier > 16) { tier = 16; }
  return addToBody([], tier, [WORK, CARRY, MOVE]);
}
export function getMaxTierConsultant(energy: number): number {
  return getMaxTier(energy, getConsultantBody, 16);
}

/**
 * Workers are able to move each tick on roads when empty, carry is low.
 * [WORK, CARRY, MOVE] * ceil(Tier / 2) + [WORK, WORK, MOVE] * floor(Tier / 2)
 * First and (2n-1) Tiers costs 200 energy, second and (2n) tiers cost 250 energy
 */
export function getWorkerBody(tier: number): string[] {
  if (tier > 16) { tier = 16; }
  let body: string[] = [];
  body = addToBody(body, Math.floor(tier / 2), [WORK, WORK, MOVE]);
  body = addToBody(body, Math.ceil(tier / 2), [WORK, CARRY, MOVE]);
  return body;
}
export function getMaxTierWorker(energy: number): number {
  return getMaxTier(energy, getWorkerBody, 16);
}

/**
 * Profiles for energy-miners. At lvl 8 we make them bigger to save cpu
 */

export function getMinerBody(tier: number): string[] {
    if (tier > 8) { tier = 8; }
    let body: string[] = [];
    body = addToBody(body, 3, [WORK, WORK, MOVE]);
    if (tier === 8) {
        body = addToBody(body, 2, [WORK, WORK, MOVE]);
    }
    body = addToBody(body, 1, [CARRY]);
    return body;
}
export function getMaxTierMiner(energy: number): number {
    return getMaxTier(energy, getMinerBody, 8);
}

export function getSkMinerBody(tier: number): string[] {
    if (tier > 8) { tier = 8; }
    let body: string[] = [];
    body = addToBody(body, 4, [WORK, WORK, MOVE]);
    if (tier === 8) {
        body = addToBody(body, 3, [WORK, WORK, MOVE]);
    }
    body = addToBody(body, 1, [CARRY]);
    return body;
}
export function getMaxTierSkMiner(energy: number): number {
    return getMaxTier(energy, getSkMinerBody, 8);
}

/**
 * Stationary workers are able to move every other tick on roads, carry is low.
 * [WORK, WORK, CARRY, MOVE] * ceil(Tier / 2) + [WORK, WORK, WORK, MOVE] * floor(Tier / 2)
 * First and (2n-1) Tiers costs 300 energy , second and (2n) tiers costs 350 energy.
 */
export function getStationaryWorkerBody(tier: number): string[] {
  if (tier > 13) { tier = 13; }
  let body: string[] = [];
  body = addToBody(body, Math.floor(Math.min(tier, 12) / 2), [WORK, WORK, WORK, MOVE]);
  body = addToBody(body, Math.ceil(Math.min(tier, 12) / 2), [WORK, WORK, CARRY, MOVE]);
  if (tier === 13) {
    body = addToBody(body, 1, [WORK, MOVE])
  }
  return body;
}
export function getMaxTierStationaryWorker(energy: number): number {
  return getMaxTier(energy, getStationaryWorkerBody, 13);
}

/**
 * Protectors are used to fortify the inner base.
 * [10 * WORK, CARRY, MOVE] * Tier
 *  Tiers costs 1100 energy
 */
export function getProtectorBody(tier: number): string[] {
  if (tier > 4) { tier = 4; }
  let body: string[] = [];
  body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
  body = addToBody(body, tier, [CARRY, MOVE]);
  body = addToBody(body, tier, [WORK, WORK, WORK, WORK, WORK]);
  return body;
}
export function getMaxTierProtector(energy: number): number {
  return getMaxTier(energy, getProtectorBody, 4);
}



/**
 * Offroad-Workers are able to move each tick off roads except on swamp, carry is minimum.
 * [WORK, CARRY, MOVE, MOVE] + [WORK, WORK, MOVE, MOVE] * (Tier - 1)
 * First Tier costs 250 energy, additional tiers cost 300 energy
 */
export function getOffroadWorkerBody(tier: number): string[] {
  if (tier > 12) { tier = 12; }
  let body: string[] = [];
  body = addToBody(body, tier - 1, [WORK, WORK, MOVE, MOVE]);
  body = addToBody(body, 1, [WORK, CARRY, MOVE, MOVE]);
  return body;
}
export function getMaxTierOffroadWorker(energy: number): number {
  return getMaxTier(energy, getOffroadWorkerBody, 12);
}

/**
 * Distance-Workers are able to move each tick on roads, carry is large.
 * [CARRY, CARRY, MOVE, WORK, CARRY, MOVE] * Tier
 * Each tier cost 350 energy
 */
export function getDistanceWorkerBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  return addToBody([], tier, [CARRY, CARRY, MOVE, WORK, CARRY, MOVE]);
}
export function getMaxTierDistanceWorker(energy: number): number {
  return getMaxTier(energy, getDistanceWorkerBody, 8);
}

export function getWorkOnlyBody(tier: number): string[] {
  if (tier > 16) { tier = 16; }
  return addToBody([], tier, [WORK, WORK, MOVE]);
}
export function getMaxTierWorkOnly(energy: number): number {
  return getMaxTier(energy, getWorkOnlyBody, 16);
}


export function getOffroadWorkOnlyBody(tier: number): string[] {
  if (tier > 25) { tier = 25; }
  return addToBody([], tier, [WORK, MOVE]);
}
export function getMaxTierOffroadWorkOnly(energy: number): number {
  return getMaxTier(energy, getWorkOnlyBody, 25);
}

/**
 * Haulers are able to move each tick on roads when full, can't do work. 100 carry for each tier
 * [CARRY, CARRY, MOVE] * Tier
 * Each tier costs 150 energy
 */
export function getHaulerBody(tier: number): string[] {
  if (tier > 16) { tier = 16; }
  return addToBody([], tier, [CARRY, CARRY, MOVE]);
}
export function getMaxTierHauler(energy: number): number {
  return getMaxTier(energy, getHaulerBody, 16);
}

/**
 * Offroad-Haulers are able to move each tick off roads except on swamp when full,
 * can't do work. 100 carry for each tier.
 * [CARRY, MOVE] * Tier
 * Each tier costs 200 energy
 */
export function getOffroadHaulerBody(tier: number): string[] {
  if (tier > 25) { tier = 25; }
  return addToBody([], tier, [CARRY, MOVE]);
}
export function getMaxTierOffroadHauler(energy: number): number {
  return getMaxTier(energy, getOffroadHaulerBody, 25);
}

/**
 * Scouts are able to move over any terrain every tick, no value in higher tiers except health
 * [CLAIM, MOVE] * Tier
 * Each tier costs 50 energy
 */
export function getClaimerBody(tier: number): string[] {
  if (tier > 25) { tier = 25; }
  return addToBody([], tier, [CLAIM, MOVE]);
}
export function getMaxTierClaimer(energy: number): number {
  return getMaxTier(energy, getClaimerBody, 25);
}

export function getSwampClaimerBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  return addToBody([], tier, [MOVE, MOVE, MOVE, MOVE, CLAIM, MOVE]);
}
export function getMaxTierSwampClaimer(energy: number): number {
  return getMaxTier(energy, getClaimerBody, 8);
}

/**
 * Scouts are able to move over any terrain every tick, no value in higher tiers except health
 * [MOVE] * Tier
 * Each tier costs 50 energy
 */
export function getScoutBody(tier: number): string[] {
  if (tier > 50) { tier = 50; }
  return addToBody([], tier, [MOVE]);
}
export function getMaxTierScout(energy: number): number {
  return getMaxTier(energy, getScoutBody, 50);
}

/**
 * Healers are able to move each tick without roads, can only heal
 * [HEAL, MOVE] * Tier
 * Each tier costs 300 energy
 */
export function getHealerBody(tier: number): string[] {
  if (tier > 25) { tier = 25; }
  let body: string[] = [];
  body = addToBody(body, tier, [HEAL]);
  body = addToBody(body, tier, [MOVE]);
  return body;
}
export function getMaxTierHealer(energy: number): number {
  return getMaxTier(energy, getHealerBody, 25);
}

/**
 * Warriors are able to move each tick without roads, and balances health and attack
 * [TOUGH, ATTACK, MOVE, MOVE] * Tier
 * Each tier costs 190 energy
 */
export function getWarriorBody(tier: number): string[] {
  if (tier > 12) { tier = 12; }
  let body: string[] = [];
  body = addToBody(body, tier, [TOUGH]);
  body = addToBody(body, tier, [ATTACK, MOVE]);
  body = addToBody(body, tier, [MOVE]);
  return body;
}
export function getMaxTierWarrior(energy: number): number {
  return getMaxTier(energy, getWarriorBody, 12);
}

/**
 * Rogues are able to move each tick without roads, and is full on attack
 * [ATTACK, MOVE] * Tier
 * Each tier costs 130 energy
 */
export function getRogueBody(tier: number): string[] {
  if (tier > 24) { tier = 24; }
  let body: string[] = [];
  body = addToBody(body, tier, [ATTACK]);
  body = addToBody(body, tier, [MOVE]);
  return body;
}
export function getMaxTierRogue(energy: number): number {
  return getMaxTier(energy, getRogueBody, 24);
}

/**
 * BaseRangers are able to move each tick without roads, and is full on ranged attack
 * [RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE] * Tier
 * Each tier costs 400 energy
 */
export function getBaseRangerBody(tier: number): string[] {
  if (tier > 12) { tier = 12; }
  let body: string[] = [];
  body = addToBody(body, tier, [RANGED_ATTACK, RANGED_ATTACK]);
  body = addToBody(body, tier, [MOVE, MOVE]);
  return body;
}
export function getMaxTierBaseRanger(energy: number): number {
  return getMaxTier(energy, getBaseRangerBody, 12);
}

/**
 * Rangers are able to move each tick without roads, and is a ranged attacker with healing.
  * T1 - 200 E, 1 MOVE, 1 RANGED_ATTACK
  * T2 - 400 E, 2 MOVE, 2 RANGED_ATTACK
  * T3 - 700 E, 3 MOVE, 2 RANGED_ATTACK, 1 HEAL
  * T4 - 1100 E, 5 MOVE, 4 RANGED_ATTACK, 1 HEAL
  * T5 - 1600 E, 7 MOVE, 5 RANGED_ATTACK, 2 HEAL
  * T6 - 2200 E, 9 MOVE, 6 RANGED_ATTACK, 3 HEAL
  * T7 - 4500 E, 20 MOVE, 15 RANGED_ATTACK, 5 HEAL
  * T8 - 5800 E, 25 MOVE, 17 RANGED_ATTACK, 8 HEAL
 */
export function getRangerBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  let body: string[] = [];
  switch(tier) {
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
      body = addToBody(body, 1, [HEAL, MOVE]);;
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
export function getMaxTierRanger(energy: number): number {
  return getMaxTier(energy, getRangerBody, 8);
}


/**
 * Supporters are able to move each tick without roads, and is a ranged attacker with focus on healing.
 */
export function getSupporterBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  let body: string[] = [];
  switch(tier) {
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
export function getMaxTierSupporter(energy: number): number {
  return getMaxTier(energy, getSupporterBody, 8);
}

/**
 * Paladins are able to move each tick without roads, and is a close combat warrior with healing.
  * T1 - 130 E, 1 MOVE, 1 ATTACK
  * T2 - 390 E, 3 MOVE, 3 ATTACK
  * T3 - 690 E, 4 MOVE, 3 ATTACK, 1 HEAL
  * T4 - 1080 E, 7 MOVE, 6 ATTACK, 1 HEAL
  * T5 - 1640 E, 10 MOVE, 8 ATTACK, 2 HEAL
  * T6 - 2200 E, 13 MOVE, 10 ATTACK, 3 HEAL
  * T7 - 4100 E, 25 MOVE, 20 ATTACK, 5 HEAL
  * T8 - 4100 E, 25 MOVE, 20 ATTACK, 5 HEAL
 */
export function getPaladinBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  let body: string[] = [];
  switch(tier) {
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
export function getMaxTierPaladin(energy: number): number {
  return getMaxTier(energy, getPaladinBody, 8);
}

/**
 * Drainers are able to move each tick without roads, and is a healer with some ranged attack
 */
export function getDrainerBody(tier: number): string[] {
  if (tier > 8) { tier = 8; }
  let body: string[] = [];
  switch(tier) {
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
export function getMaxTierDrainer(energy: number): number {
  return getMaxTier(energy, getDrainerBody, 8);
}

/**
 * Kiters are able to move each tick without roads, and is a mix of heal and ranged attack.
 *  * Tier
 * Each tier costs 500 energy
 */
export function getKiterBody(tier: number): string[] {
  if (tier > 10) { tier = 10; }
  return addToBody([], tier, [RANGED_ATTACK, MOVE, HEAL, MOVE]);
}
export function getMaxTierKiter(energy: number): number {
  return getMaxTier(energy, getKiterBody, 10);
}

/**
 * Calculates the total cost for a body
 */
export function getCostForBody(body: string[]): number {
  let cost = 0;
  for (let bodypart of body) {
    cost += getCostForBodypart(bodypart);
  }
  return cost;
}

/**
 * Finds the max-tier possible to make based on energy and function. Use it to make functions for profiles.
 */
function getMaxTier(energy: number, bodyfunction: Function, maxTier: number): number {
  let tier = 0;
  let maxReached = false;
  for (let i = 1; !maxReached; i++) {
    let cost = getCostForBody(bodyfunction(i));
    if (cost > energy || i > maxTier) {
      maxReached = true;
    } else {
      tier = i;
    }
  }
  return tier;
}

/**
 * Provides cost for each bodypart
 */
function getCostForBodypart(bodypart: string): number {
  switch (bodypart) {
    case TOUGH:         return 10;
    case MOVE:          return 50;
    case CARRY:         return 50;
    case ATTACK:        return 80;
    case WORK:          return 100;
    case RANGED_ATTACK: return 150;
    case HEAL:          return 250;
    case CLAIM:         return 600;
    default:            return 0;
  }
}

/**
 * Adds parts to a body.
 */
function addToBody(body: string[], count: number, parts: string[]): string[] {
  for (let i = 0; i < count; i++) {
    for (let part of parts) {
      body.push(part);
    }
  }
  return body;
}

/*

The fatigue for a creep is calculated this way:

F = 2 * (W * K - 2 * M)
Where:
    F = fatigue value after turn
    W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
    K = terrain factor (0.5x for road, 1x for plain, 5x for swamp)
    M = number of MOVE parts
Deretter reduseres fatigue med 2 * M hver runde

 Retningslinjer:
    Creeps må ha minst 50 % move-parts når de beveger seg utenfor roads.
    Creeps må ha minst 34 % move-parts når de beveger seg på roads.
*/
