export enum PraiseStatus {
    Inactive = 0,
    Establishing = 1,
    Praising = 2,
    PreparingReset = 3,
    Reestablishing = 4,
    PreparingHibernate = 5,
    Hiberate = 6, // Do not praise any more, but max energy in the storage and terminal
    Abandon = 7 // Send out all energy and boosts
}
