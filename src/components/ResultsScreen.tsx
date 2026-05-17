import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import type { Player } from '../lib/types';
import { Confetti } from './Confetti';
import { playFinish } from '../lib/sound';

interface ResultsScreenProps {
  players: Player[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  soundEnabled: boolean;
}

function fmt(ms: number): string {
  return (ms / 1000).toFixed(1) + 's';
}

export function ResultsScreen({ players, onPlayAgain, onChangeSettings, soundEnabled }: ResultsScreenProps) {
  const sorted = [...players].sort((a, b) => b.stats.points - a.stats.points);
  const podium = sorted.slice(0, 3);

  useEffect(() => {
    if (soundEnabled) playFinish();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];
  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div class="screen results-screen">
      <Confetti />
      <h1>¡Fin del juego!</h1>

      <div class="podium">
        {podium.map((p, i) => (
          <div
            key={p.id}
            class={`podium-entry podium-entry--${i + 1}`}
            style={{ borderColor: podiumColors[i] }}
          >
            <span class="podium-medal">{medals[i]}</span>
            <span class="podium-emoji" style={{ background: p.color }}>{p.emoji}</span>
            <span class="podium-name">{p.name}</span>
            <span class="podium-points">{p.stats.points} pts</span>
          </div>
        ))}
      </div>

      <div class="stats-table-wrap">
        <h2>Estadísticas</h2>
        <div class="stats-table">
          <div class="stats-row stats-header">
            <span>Jugador</span>
            <span>Puntos</span>
            <span>Aciertos</span>
            <span>% Éxito</span>
            <span>Racha</span>
            <span>T. Medio</span>
          </div>
          {sorted.map(p => {
            const acc = p.stats.total > 0
              ? Math.round((p.stats.correct / p.stats.total) * 100)
              : 0;
            const avgMs = p.stats.total > 0
              ? p.stats.sumResponseMs / p.stats.total
              : 0;
            return (
              <div key={p.id} class="stats-row" style={{ borderLeftColor: p.color }}>
                <span>
                  <span class="stats-emoji" style={{ background: p.color }}>{p.emoji}</span>
                  {p.name}
                </span>
                <span class="stats-points">{p.stats.points}</span>
                <span>{p.stats.correct}/{p.stats.total}</span>
                <span>{acc}%</span>
                <span>{p.stats.bestStreak}</span>
                <span>{fmt(avgMs)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div class="results-actions">
        <button class="btn-primary" onClick={onPlayAgain}>
          🔄 Jugar otra vez
        </button>
        <button class="btn-secondary" onClick={onChangeSettings}>
          ⚙️ Cambiar ajustes
        </button>
      </div>
    </div>
  );
}
