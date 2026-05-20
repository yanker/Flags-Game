export interface Country {
  code: string;      // cca2 lowercase, e.g. "es"
  name: string;      // Spanish name
  region: string;    // Africa, Americas, Asia, Europe, Oceania
  population: number;
}

export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface GameSettings {
  level: Difficulty;
  rounds: number;
  timerEnabled: boolean;
  timerSeconds: number;
  soundEnabled: boolean;
}

export interface PlayerStats {
  correct: number;
  total: number;
  bestStreak: number;
  currentStreak: number;
  sumResponseMs: number;
  points: number;
}

export interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  stats: PlayerStats;
}

export interface Question {
  country: Country;
  options: Country[];  // length 3, shuffled
  correctIndex: number;
}

export type Screen = 'setup' | 'players' | 'play' | 'results';

export interface GameState {
  screen: Screen;
  settings: GameSettings;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;   // 1-based
  questionsAnswered: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  questionDeck: Country[]; // remaining countries in shuffled order; refilled when empty
}
