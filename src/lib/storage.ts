import type { GameState } from './types';

const KEY = 'flags-game-state';

export function saveState(state: GameState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function loadState(): GameState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
