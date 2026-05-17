import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { Country, GameState, GameSettings, Player, Screen } from '../lib/types';
import { buildPool, buildQuestion, updatePlayerStats, resetPlayerStats } from '../lib/game';
import { saveState, loadState, clearState } from '../lib/storage';
import { SetupScreen } from './SetupScreen';
import { PlayersScreen } from './PlayersScreen';
import { PlayScreen } from './PlayScreen';
import { ResultsScreen } from './ResultsScreen';

interface GameProps {
  countries: Country[];
}

const DEFAULT_SETTINGS: GameSettings = {
  level: 'facil',
  rounds: 5,
  timerEnabled: false,
  timerSeconds: 15,
  soundEnabled: true,
};

function initState(countries: Country[]): GameState {
  return {
    screen: 'setup',
    settings: DEFAULT_SETTINGS,
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    questionsAnswered: 0,
    totalQuestions: 0,
    currentQuestion: null,
  };
}

export function Game({ countries }: GameProps) {
  const [state, setState] = useState<GameState>(() => {
    // Try to restore session
    const saved = loadState();
    if (saved && saved.screen === 'play' && saved.currentQuestion) {
      return saved;
    }
    return initState(countries);
  });

  useEffect(() => {
    if (state.screen === 'play') {
      saveState(state);
    }
  }, [state]);

  function gotoSetup() {
    clearState();
    setState(initState(countries));
  }

  function handleSetupDone(settings: GameSettings) {
    setState(s => ({ ...s, screen: 'players', settings }));
  }

  function handlePlayersDone(players: Player[]) {
    const { settings } = state;
    const pool = buildPool(countries, settings.level);
    const totalQuestions = settings.rounds * players.length;
    const question = buildQuestion(pool, settings.level);
    setState({
      screen: 'play',
      settings,
      players,
      currentPlayerIndex: 0,
      currentRound: 1,
      questionsAnswered: 0,
      totalQuestions,
      currentQuestion: question,
    });
  }

  function handleAnswer(answerIndex: number, responseMs: number) {
    setState(prev => {
      if (!prev.currentQuestion) return prev;
      const isCorrect = answerIndex === prev.currentQuestion.correctIndex;
      const curPlayer = prev.players[prev.currentPlayerIndex];
      const updatedStats = updatePlayerStats(curPlayer.stats, isCorrect, responseMs, prev.settings);
      const updatedPlayers = prev.players.map(p =>
        p.id === curPlayer.id ? { ...p, stats: updatedStats } : p
      );

      const nextQA = prev.questionsAnswered + 1;

      if (nextQA >= prev.totalQuestions) {
        // Game over
        return {
          ...prev,
          screen: 'results' as Screen,
          players: updatedPlayers,
          questionsAnswered: nextQA,
          currentQuestion: null,
        };
      }

      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      // Round advances when we wrap around from last player back to first
      const nextRound = nextPlayerIndex === 0 ? prev.currentRound + 1 : prev.currentRound;
      const pool = buildPool(countries, prev.settings.level);
      const nextQuestion = buildQuestion(pool, prev.settings.level);

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
        questionsAnswered: nextQA,
        currentQuestion: nextQuestion,
      };
    });
  }

  function handlePlayAgain() {
    clearState();
    setState(prev => {
      const { settings } = prev;
      const players = resetPlayerStats(prev.players);
      const pool = buildPool(countries, settings.level);
      const totalQuestions = settings.rounds * players.length;
      const question = buildQuestion(pool, settings.level);
      return {
        screen: 'play',
        settings,
        players,
        currentPlayerIndex: 0,
        currentRound: 1,
        questionsAnswered: 0,
        totalQuestions,
        currentQuestion: question,
      };
    });
  }

  function handleChangeSettings() {
    clearState();
    setState(prev => ({
      ...initState(countries),
      settings: prev.settings,
    }));
  }

  const { screen, settings, players, currentPlayerIndex, currentRound, questionsAnswered, totalQuestions, currentQuestion } = state;

  if (screen === 'setup') {
    return <SetupScreen initial={settings} onDone={handleSetupDone} />;
  }

  if (screen === 'players') {
    return (
      <PlayersScreen
        initial={players}
        onDone={handlePlayersDone}
        onBack={() => setState(s => ({ ...s, screen: 'setup' }))}
      />
    );
  }

  if (screen === 'play' && currentQuestion) {
    const currentPlayer = players[currentPlayerIndex];
    const totalRounds = settings.rounds;
    return (
      <PlayScreen
        question={currentQuestion}
        player={currentPlayer}
        currentRound={currentRound}
        totalRounds={totalRounds}
        totalQuestions={totalQuestions}
        questionsAnswered={questionsAnswered}
        settings={settings}
        onAnswer={handleAnswer}
      />
    );
  }

  if (screen === 'results') {
    return (
      <ResultsScreen
        players={players}
        onPlayAgain={handlePlayAgain}
        onChangeSettings={handleChangeSettings}
        soundEnabled={settings.soundEnabled}
      />
    );
  }

  return <div>Cargando...</div>;
}
