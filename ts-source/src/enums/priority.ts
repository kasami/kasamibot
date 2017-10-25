export enum Priority {
    Blocker = 0, // CPU
    Critical = 1, // >6000
    Important = 2, // >8000
    Standard = 3, // >9000
    Low = 4, // >9500
    Trivial = 5, // >9800
    Overflow = 6 // >10100
}
