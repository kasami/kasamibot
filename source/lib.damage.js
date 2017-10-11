"use strict";
function getStatsForCreep(creep) {
    let stats = { mpt: 0, rpt: 0, hpt: 0, dpt: 0 };
    for (let p of creep.body) {
        let boost = 1;
        if (p.boost !== undefined) {
            if (p.boost.length === 5) {
                boost = 4;
            }
            else if (p.boost.length === 4) {
                boost = 3;
            }
            else if (p.boost.length === 2) {
                boost = 2;
            }
        }
        switch (p.type) {
            case ATTACK:
                stats.mpt += (ATTACK_POWER * boost);
                break;
            case RANGED_ATTACK:
                stats.rpt += (RANGED_ATTACK_POWER * boost);
                break;
            case HEAL:
                stats.hpt += (HEAL_POWER * boost);
                break;
            case WORK:
                stats.dpt += (DISMANTLE_POWER * boost);
                break;
        }
    }
    return stats;
}
exports.getStatsForCreep = getStatsForCreep;
function getStatsForCreepBody(body) {
    let stats = { mpt: 0, rpt: 0, hpt: 0, dpt: 0 };
    for (let p of body) {
        let boost = 1;
        switch (p) {
            case ATTACK:
                stats.mpt += (ATTACK_POWER * boost);
                break;
            case RANGED_ATTACK:
                stats.rpt += (RANGED_ATTACK_POWER * boost);
                break;
            case HEAL:
                stats.hpt += (HEAL_POWER * boost);
                break;
            case WORK:
                stats.dpt += (DISMANTLE_POWER * boost);
                break;
        }
    }
    return stats;
}
exports.getStatsForCreepBody = getStatsForCreepBody;
