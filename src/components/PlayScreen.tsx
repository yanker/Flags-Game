import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import type { Player, Question, GameSettings } from '../lib/types';
import { FlagCard } from './FlagCard';
import { Timer } from './Timer';
import { playCorrect, playWrong, setSoundEnabled } from '../lib/sound';

interface PlayScreenProps {
  question: Question;
  player: Player;
  currentRound: number;
  totalRounds: number;
  totalQuestions: number;
  questionsAnswered: number;
  settings: GameSettings;
  onAnswer: (correctIndex: number, responseMs: number) => void;
}

type ButtonState = 'idle' | 'correct' | 'wrong' | 'reveal';

export function PlayScreen({
  question,
  player,
  currentRound,
  totalRounds,
  totalQuestions,
  questionsAnswered,
  settings,
  onAnswer,
}: PlayScreenProps) {
  const [buttonStates, setButtonStates] = useState<ButtonState[]>(['idle', 'idle', 'idle']);
  const [answered, setAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    setButtonStates(['idle', 'idle', 'idle']);
    setAnswered(false);
    setTimerKey(k => k + 1);
    startTimeRef.current = Date.now();
  }, [question]);

  function handleAnswer(idx: number) {
    if (answered) return;
    setAnswered(true);
    const responseMs = Date.now() - startTimeRef.current;
    const isCorrect = idx === question.correctIndex;

    const newStates: ButtonState[] = question.options.map((_, i) => {
      if (i === idx && isCorrect) return 'correct';
      if (i === idx && !isCorrect) return 'wrong';
      if (i === question.correctIndex && !isCorrect) return 'reveal';
      return 'idle';
    });
    setButtonStates(newStates);

    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      onAnswer(idx, responseMs);
    }, 1200);
  }

  function handleTimeout() {
    if (answered) return;
    setAnswered(true);
    const responseMs = settings.timerSeconds * 1000;
    playWrong();
    const newStates: ButtonState[] = question.options.map((_, i) =>
      i === question.correctIndex ? 'reveal' : 'idle'
    );
    setButtonStates(newStates);
    setTimeout(() => {
      onAnswer(-1, responseMs); // -1 = timeout (wrong)
    }, 1200);
  }

  return (
    <div class="screen play-screen">
      <div class="play-header">
        <div class="player-banner" style={{ background: player.color }}>
          <span class="player-banner-emoji">{player.emoji}</span>
          <span class="player-banner-name">{player.name}</span>
        </div>
        <div class="round-info">
          Ronda {currentRound} / {totalRounds}
        </div>
        {settings.timerEnabled && (
          <Timer
            key={timerKey}
            totalSeconds={settings.timerSeconds}
            onTimeout={handleTimeout}
            running={!answered}
            soundEnabled={settings.soundEnabled}
          />
        )}
      </div>

      <div class="flag-container">
        <FlagCard code={question.country.code} name={question.country.name} />
      </div>

      <p class="question-prompt">¿De qué país es esta bandera?</p>

      <div class="options-grid">
        {question.options.map((country, i) => {
          const state = buttonStates[i];
          return (
            <button
              key={i}
              class={`option-btn option-btn--${state}`}
              onClick={() => handleAnswer(i)}
              disabled={answered}
            >
              {country.name}
            </button>
          );
        })}
      </div>

      <div class="progress-bar-wrap">
        <div
          class="progress-bar-fill"
          style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
}
