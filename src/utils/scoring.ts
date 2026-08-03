export const POINTS_SYSTEM: Record<number, number> = {
  1: 11,
  2: 10,
  3: 8,
  4: 7,
  5: 6,
  6: 6,
  7: 5,
  8: 5,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
  17: 2,
  18: 2,
  19: 2,
  20: 2,
  21: 2,
  22: 2,
  23: 2,
  24: 2,
  25: 2,
  26: 2,
  27: 2,
  28: 2,
  29: 2,
  30: 2,
  31: 2,
  32: 2,
};

export function getPointsForRank(rank: number): number {
  if (!rank || rank <= 0) {
    return 0;
  }

  if (POINTS_SYSTEM[rank]) {
    return POINTS_SYSTEM[rank];
  }

  if (rank >= 33) {
    return 1;
  }

  return 0;
}
