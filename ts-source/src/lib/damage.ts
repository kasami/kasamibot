/**
 * Calculates melee dmg, ranged dmg, healing and dismantle per tick.
 *
 * @param creep Creep to calculate stats for
 */
export function getStatsForCreep(creep: Creep): {mpt: number, rpt: number, hpt: number, dpt: number} {
    let stats = {mpt: 0, rpt: 0, hpt: 0, dpt: 0};
    for (let p of creep.body) {
        let boost = 1;
        if (p.boost !== undefined) {
            if (p.boost.length === 5) {
                boost = 4;
            } else
            if (p.boost.length === 4) {
                boost = 3;
            } else
            if (p.boost.length === 2) {
                boost = 2;
            }
        }
        switch(p.type) {
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
    /*console.log("Stats for creep: " + creep.name + " in room "+ creep.pos.roomName);
    console.log("Melee per tick: " + stats.mpt);
    console.log("Ranged per tick: " + stats.rpt);
    console.log("Healing per tick: " + stats.hpt);
    console.log("Dismantle per tick: " + stats.dpt);
    */
    return stats;
}

export function getStatsForCreepBody(body: string[]): {mpt: number, rpt: number, hpt: number, dpt: number} {
    let stats = {mpt: 0, rpt: 0, hpt: 0, dpt: 0};
    for (let p of body) {
        let boost = 1;
        switch(p) {
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
    /*console.log("Stats for creep with body: " + body);
    console.log("Melee per tick: " + stats.mpt);
    console.log("Ranged per tick: " + stats.rpt);
    console.log("Healing per tick: " + stats.hpt);
    console.log("Dismantle per tick: " + stats.dpt);
    */
    return stats;
}
