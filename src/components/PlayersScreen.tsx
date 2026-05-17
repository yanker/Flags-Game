import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { Player } from '../lib/types';
import { createPlayer, PLAYER_EMOJIS, PLAYER_COLORS } from '../lib/game';

interface PlayersScreenProps {
  initial: Player[];
  onDone: (players: Player[]) => void;
  onBack: () => void;
}

export function PlayersScreen({ initial, onDone, onBack }: PlayersScreenProps) {
  const [players, setPlayers] = useState<Player[]>(
    initial.length > 0 ? initial : [createPlayer('Jugador 1', 0)]
  );
  const [error, setError] = useState('');

  function addPlayer() {
    if (players.length >= 6) return;
    setPlayers(prev => [...prev, createPlayer(`Jugador ${prev.length + 1}`, prev.length)]);
  }

  function removePlayer(id: string) {
    if (players.length <= 1) return;
    setPlayers(prev => prev.filter(p => p.id !== id));
  }

  function updateName(id: string, name: string) {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }

  function handleStart() {
    const invalid = players.some(p => !p.name.trim());
    if (invalid) {
      setError('Todos los jugadores necesitan un nombre.');
      return;
    }
    setError('');
    onDone(players.map(p => ({ ...p, name: p.name.trim() })));
  }

  return (
    <div class="screen players-screen">
      <button class="btn-back" onClick={onBack}>← Volver</button>
      <h1>¿Quién juega?</h1>
      <p class="subtitle">Mínimo 1, máximo 6 jugadores</p>

      <div class="players-list">
        {players.map((p, i) => (
          <div key={p.id} class="player-row" style={{ borderColor: p.color }}>
            <span class="player-emoji" style={{ background: p.color }}>
              {p.emoji}
            </span>
            <input
              class="player-name-input"
              type="text"
              placeholder={`Jugador ${i + 1}`}
              value={p.name}
              maxLength={20}
              onInput={e => updateName(p.id, (e.target as HTMLInputElement).value)}
              aria-label={`Nombre del jugador ${i + 1}`}
            />
            {players.length > 1 && (
              <button
                class="btn-remove"
                onClick={() => removePlayer(p.id)}
                aria-label="Eliminar jugador"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {players.length < 6 && (
        <button class="btn-add-player" onClick={addPlayer}>
          + Añadir jugador
        </button>
      )}

      {error && <p class="error-msg">{error}</p>}

      <button class="btn-primary" onClick={handleStart}>
        ¡Jugar! 🎮
      </button>
    </div>
  );
}
