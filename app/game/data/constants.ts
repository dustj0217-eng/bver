// app/game/data/constants/ts

export const POINT_REWARDS = {
  chat: 5,
  dailyMission: 50,
  weeklyMission: 300,
  achievement: 1000,
  loginStreak: 20,
} as const;

export const STAT_INCREASE = {
  perChoice: 3,
} as const;

export const LEVEL_UP_EXP = {
  base: 100,
  multiplier: 1.5,
} as const;

export const STAT_TITLES = {
  affection: {
    0: '낯선 사람',
    20: '알게 된 사이',
    40: '친구',
    60: '단짝',
    80: '절친',
    100: '영혼의 동반자',
  },
  empathy: {
    0: '무관심',
    20: '이해하는 중',
    40: '공감',
    60: '깊은 이해',
    80: '완벽한 공감',
    100: '같은 처지',
  },
  rebellion: {
    0: '순응',
    20: '의문',
    40: '불만',
    60: '저항',
    80: '반항',
    100: '혁명가',
  },
} as const;

export const getExpForLevel = (level: number): number => {
  return Math.floor(LEVEL_UP_EXP.base * Math.pow(LEVEL_UP_EXP.multiplier, level - 1));
};

export const getStatTitle = (stat: 'affection' | 'empathy' | 'rebellion', value: number): string => {
  const titles = STAT_TITLES[stat];
  const thresholds = Object.keys(titles).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (value >= threshold) {
      return titles[threshold as keyof typeof titles];
    }
  }
  return titles[0];
};