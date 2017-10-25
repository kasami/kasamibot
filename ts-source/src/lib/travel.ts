export function isCloseToSourceKeeper(creep: Creep): boolean {
    let closestSK = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c: Creep) => c.owner.username === "Source Keeper"}) as Creep | undefined;
    if (closestSK !== undefined && creep.pos.getRangeTo(closestSK) < 5) {
        return true;
    }
    return false;
}

export function isCloseToHostile(creep: Creep): boolean {
    let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep | undefined;
    if (closestHostile !== undefined && creep.pos.getRangeTo(closestHostile) < 6) {
        return true;
    }
    return false;
}
