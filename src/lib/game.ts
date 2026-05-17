import type { Country, Difficulty, Question, Player, PlayerStats, GameSettings } from './types';

// ─── Difficulty pools ────────────────────────────────────────────────────────

export function buildPool(countries: Country[], level: Difficulty): Country[] {
  let pool: Country[];
  if (level === 'facil') {
    pool = countries.filter(c => c.population >= 20_000_000);
    // relax threshold if pool is too small
    if (pool.length < 30) pool = countries.filter(c => c.population >= 5_000_000);
    if (pool.length < 30) pool = countries.slice(0, 30);
  } else if (level === 'medio') {
    pool = countries.filter(c => c.population >= 3_000_000);
    if (pool.length < 30) pool = countries.filter(c => c.population >= 1_000_000);
    if (pool.length < 30) pool = countries.slice(0, 60);
  } else {
    pool = [...countries];
  }
  return pool;
}

// ─── Question builder ────────────────────────────────────────────────────────

function rng(max: number) {
  return Math.floor(Math.random() * max);
}

function pickRandom<T>(arr: T[]): T {
  return arr[rng(arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestion(pool: Country[], level: Difficulty): Question {
  if (pool.length < 3) throw new Error('Pool demasiado pequeño para generar pregunta');

  // Pick correct country
  const correct = pickRandom(pool);
  const remaining = pool.filter(c => c.code !== correct.code);

  // Prefer same-region distractors for medio/dificil
  let distractors: Country[] = [];
  if (level !== 'facil') {
    const sameRegion = remaining.filter(c => c.region === correct.region);
    if (sameRegion.length >= 2) {
      // pick 2 from same region
      const shuffled = shuffle(sameRegion);
      distractors = shuffled.slice(0, 2);
    } else if (sameRegion.length === 1) {
      distractors.push(sameRegion[0]);
      const other = remaining.filter(c => c.code !== sameRegion[0].code);
      distractors.push(pickRandom(other));
    }
  }

  // Fall back to any if not enough
  if (distractors.length < 2) {
    const shuffled = shuffle(remaining);
    distractors = shuffled.slice(0, 2);
  }

  const options = shuffle([correct, distractors[0], distractors[1]]);
  const correctIndex = options.findIndex(c => c.code === correct.code);

  return { country: correct, options, correctIndex };
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export function calcScore(
  isCorrect: boolean,
  responseMs: number,
  settings: GameSettings,
  currentStreak: number
): number {
  if (!isCorrect) return 0;

  const base = 100;

  // Speed bonus (only if timer enabled)
  let speedBonus = 0;
  if (settings.timerEnabled && settings.timerSeconds > 0) {
    const remainingSec = Math.max(0, settings.timerSeconds - responseMs / 1000);
    speedBonus = Math.round((remainingSec / settings.timerSeconds) * 100);
  }

  // Streak multiplier: +10% per consecutive correct, cap at +100%
  const streakBonus = Math.min(currentStreak * 0.1, 1.0);
  const total = Math.round((base + speedBonus) * (1 + streakBonus));
  return total;
}

export function updatePlayerStats(
  stats: PlayerStats,
  isCorrect: boolean,
  responseMs: number,
  settings: GameSettings
): PlayerStats {
  const newStreak = isCorrect ? stats.currentStreak + 1 : 0;
  const points = calcScore(isCorrect, responseMs, settings, stats.currentStreak);
  return {
    correct: stats.correct + (isCorrect ? 1 : 0),
    total: stats.total + 1,
    bestStreak: Math.max(stats.bestStreak, newStreak),
    currentStreak: newStreak,
    sumResponseMs: stats.sumResponseMs + responseMs,
    points: stats.points + points,
  };
}

export function emptyStats(): PlayerStats {
  return { correct: 0, total: 0, bestStreak: 0, currentStreak: 0, sumResponseMs: 0, points: 0 };
}

// ─── Players helpers ──────────────────────────────────────────────────────────

export const PLAYER_EMOJIS = ['🦊', '🐼', '🦄', '🐯', '🐸', '🐵'];
export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#DDA0DD'];

export function createPlayer(name: string, index: number): Player {
  return {
    id: crypto.randomUUID(),
    name,
    emoji: PLAYER_EMOJIS[index % PLAYER_EMOJIS.length],
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    stats: emptyStats(),
  };
}

export function resetPlayerStats(players: Player[]): Player[] {
  return players.map(p => ({ ...p, stats: emptyStats() }));
}
