import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { GameSettings, Difficulty } from '../lib/types';

interface SetupScreenProps {
  initial: GameSettings;
  onDone: (s: GameSettings) => void;
}

const ROUND_OPTIONS = [5, 10, 15];

export function SetupScreen({ initial, onDone }: SetupScreenProps) {
  const [level, setLevel] = useState<Difficulty>(initial.level);
  const [rounds, setRounds] = useState(initial.rounds);
  const [customRounds, setCustomRounds] = useState('');
  const [timerEnabled, setTimerEnabled] = useState(initial.timerEnabled);
  const [timerSeconds, setTimerSeconds] = useState(initial.timerSeconds);
  const [soundEnabled, setSoundEnabled] = useState(initial.soundEnabled);

  const LEVELS: { value: Difficulty; label: string; desc: string; emoji: string }[] = [
    { value: 'facil', label: 'Fácil', desc: 'Países conocidos', emoji: '🌟' },
    { value: 'medio', label: 'Medio', desc: 'Más países', emoji: '🌍' },
    { value: 'dificil', label: 'Difícil', desc: 'Todos los países', emoji: '🏆' },
  ];

  const effectiveRounds = customRounds !== '' ? parseInt(customRounds, 10) || rounds : rounds;

  function handleStart() {
    onDone({
      level,
      rounds: effectiveRounds,
      timerEnabled,
      timerSeconds,
      soundEnabled,
    });
  }

  return (
    <div class="screen setup-screen">
      <h1 class="game-title">🌍 Banderas</h1>
      <p class="game-subtitle">¿Cuánto sabes del mundo?</p>

      <section class="setup-section">
        <h2>Dificultad</h2>
        <div class="level-grid">
          {LEVELS.map(l => (
            <button
              key={l.value}
              class={`level-btn${level === l.value ? ' level-btn--active' : ''}`}
              onClick={() => setLevel(l.value)}
            >
              <span class="level-emoji">{l.emoji}</span>
              <span class="level-label">{l.label}</span>
              <span class="level-desc">{l.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section class="setup-section">
        <h2>Rondas</h2>
        <div class="rounds-grid">
          {ROUND_OPTIONS.map(r => (
            <button
              key={r}
              class={`rounds-btn${rounds === r && customRounds === '' ? ' rounds-btn--active' : ''}`}
              onClick={() => { setRounds(r); setCustomRounds(''); }}
            >
              {r}
            </button>
          ))}
        </div>
        <div class="custom-rounds">
          <label for="custom-rounds">Personalizar:</label>
          <input
            id="custom-rounds"
            type="number"
            min="1"
            max="50"
            placeholder="ej. 20"
            value={customRounds}
            onInput={e => setCustomRounds((e.target as HTMLInputElement).value)}
          />
        </div>
      </section>

      <section class="setup-section">
        <h2>Opciones</h2>
        <div class="options-list">
          <label class="toggle-row">
            <span class="toggle-label">
              <span class="toggle-icon">⏱️</span> Cronómetro
            </span>
            <button
              class={`toggle-btn${timerEnabled ? ' toggle-btn--on' : ''}`}
              onClick={() => setTimerEnabled(v => !v)}
              aria-pressed={timerEnabled}
            >
              {timerEnabled ? 'ON' : 'OFF'}
            </button>
          </label>

          {timerEnabled && (
            <div class="timer-seconds-row">
              <span>Segundos por pregunta:</span>
              <div class="timer-seconds-options">
                {[10, 15, 20, 30].map(s => (
                  <button
                    key={s}
                    class={`rounds-btn${timerSeconds === s ? ' rounds-btn--active' : ''}`}
                    onClick={() => setTimerSeconds(s)}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          )}

          <label class="toggle-row">
            <span class="toggle-label">
              <span class="toggle-icon">🔊</span> Sonidos
            </span>
            <button
              class={`toggle-btn${soundEnabled ? ' toggle-btn--on' : ''}`}
              onClick={() => setSoundEnabled(v => !v)}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </label>
        </div>
      </section>

      <button class="btn-primary" onClick={handleStart}>
        ¡Siguiente! →
      </button>

      <div style="text-align: center; margin-top: 20px;">
        Hecho con ❤️ para mis hijas Mariela y Celia
      </div>
      <div style="text-align: center; margin-top: 6px; font-size: 0.72rem; opacity: 0.45;">
        v1.1.0 · Actualizado 20/05/2026
      </div>
    </div>
  );
}
