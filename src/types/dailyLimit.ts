export interface DailyLimit {
  date: string; // YYYY-MM-DD format
  adsWatched: number;
  extraSwipesUsed: number;
}

export interface DailyLimitState {
  currentLimit: DailyLimit;
  canWatchAd: boolean;
  canGetExtraSwipes: boolean;
  hoursUntilReset: number;
}
