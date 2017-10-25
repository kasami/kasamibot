export class Threat {

    public tick: number;
    public count: number;
    public attackThreat: number;
    public rangedThreat: number;
    public toughThreat: number;
    public workThreat: number;
    public healThreat: number;
    public boostedTough: number;
    public boostedRanged: number;
    public boostedWork: number;
    public boostedHeal: number;
    public boostedAttack: number;

    constructor() {
        this.tick = Game.time;
        this.count = 0;
        this.attackThreat = 0;
        this.rangedThreat = 0;
        this.toughThreat = 0;
        this.workThreat = 0;
        this.healThreat = 0;
        this.boostedTough = 0;
        this.boostedRanged = 0;
        this.boostedWork = 0;
        this.boostedHeal = 0;
        this.boostedAttack = 0;
    }
}
