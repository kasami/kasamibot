interface Creep {
  hasState(): boolean;
  getState(): number | undefined;
  setState(state: number): void;

  getHomeroom(): string;
  isInHomeroom(): boolean;

  isPrioritized(): boolean;
  setPrioritized(): void;
  setNotPrioritized(): void;

  travelTo(destination: {pos: RoomPosition}, options?: any, enemyCheck?: boolean): any;
  travelToRoom(roomName: string, options?: any, enemyCheck?: boolean): any;

  missingHits(): number;

  isHurt(): boolean;
  isRenewing(): boolean;
  startRenewing(): void;
  stopRenewing(): void;
  isEmpty(): boolean;
  isFull(): boolean;
  isDumping(): boolean;
  isFinishedDumping(): boolean;
  isFinishedMining(): boolean;
  startDumping(): void;
  stopDumping(): void;
  isTanking(): boolean;
  isFinishedTanking(): boolean;
  isInNeedOfTanking(): boolean;
  startTanking(): void;
  stopTanking(): void;
  getWorkerParts(): number;
  isDisabled(): boolean;
  disable(): void;
  enable(): void;
  isAtBorder(): boolean;
}
