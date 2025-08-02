import React, { useState, useEffect } from 'react';
import { GameMode, Difficulty, Theme, Player } from './types';
import useGameLogic from './hooks/useGameLogic';
import useSounds from './hooks/useSounds';
import SetupScreen from './components/SetupScreen';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import OptionsModal from './components/OptionsModal';
import TieBreakerModal from './components/TieBreakerModal';
import { SettingsIcon, HomeIcon, ResetIcon } from './components/Icons';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [playerNames, setPlayerNames] = useState<{ [key in Player]: string }>({ X: 'Player 1', O: 'Player 2' });
  
  const { playTick, primeAudio } = useSounds(soundEnabled);
  
  const onMove = () => {
    playTick();
  };

  const {
    minorBoardStates,
    minorWinners,
    majorWinner,
    currentPlayer,
    isAITurn,
    scores,
    isTiePending,
    handleCellClick,
    resetGame,
    newGame,
    acceptDraw,
    resolveByCount,
  } = useGameLogic({
    gameMode,
    difficulty,
    onMove,
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleGameStart = (mode: GameMode, p1Name: string, p2Name: string) => {
    primeAudio(); // "Unlock" audio on the first user gesture
    setGameMode(mode);

    const newPlayerNames: { [key in Player]: string } = { X: p1Name, O: mode === GameMode.PlayerVsAI ? 'Computer' : p2Name };
    setPlayerNames(newPlayerNames);
    
    setIsGameStarted(true);
    newGame();
  };
  
  const handleGoHome = () => {
    setIsGameStarted(false);
    setGameMode(null);
    newGame(); // Resets scores and everything for a fresh start
  }

  const handleResetGame = () => {
    resetGame();
  }
  
  const winner = majorWinner?.winner;
  const isInteractionDisabled = !!winner || isAITurn || isTiePending;

  const HeaderButton = ({ onClick, 'aria-label': ariaLabel, children }: { onClick: () => void; 'aria-label': string, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 color-transition"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen color-transition">
      <div className="container mx-auto p-4 max-w-lg h-dvh flex flex-col">
        {!isGameStarted ? (
          <SetupScreen 
            onStart={handleGameStart}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            theme={theme}
            setTheme={setTheme}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            primeAudio={primeAudio}
          />
        ) : (
          <>
            <header className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold" style={{color: 'rgb(var(--primary))'}}>Prime XO</h1>
                {gameMode === GameMode.PlayerVsAI && (
                  <span className="bg-[rgb(var(--surface-variant))] text-[rgb(var(--on-surface-variant))] text-xs font-bold px-2 py-1 rounded-full capitalize color-transition">
                    {difficulty}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <HeaderButton onClick={handleGoHome} aria-label="Go to home screen">
                  <HomeIcon className="w-6 h-6" />
                </HeaderButton>
                 <HeaderButton onClick={handleResetGame} aria-label="Reset the board">
                  <ResetIcon className="w-6 h-6" />
                </HeaderButton>
                <HeaderButton onClick={() => setIsOptionsOpen(true)} aria-label="Open settings">
                  <SettingsIcon className="w-6 h-6" />
                </HeaderButton>
              </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center">
              <Scoreboard 
                scores={scores} 
                playerNames={playerNames} 
                currentPlayer={winner ? null : currentPlayer}
                isAITurn={isAITurn}
              />
              <Board
                minorBoardStates={minorBoardStates}
                minorWinners={minorWinners}
                majorWinner={majorWinner}
                onCellClick={handleCellClick}
                isInteractionDisabled={isInteractionDisabled}
              />
              {winner && (
                <div className="mt-4 text-2xl font-bold text-center pop-in" style={{color: winner === 'X' ? 'rgb(var(--x-color))' : winner === 'O' ? 'rgb(var(--o-color))' : 'rgb(var(--on-surface-variant))'}}>
                  {winner === 'draw' ? "It's a Draw!" : `${playerNames[winner as Player]} Wins!`}
                </div>
              )}
            </main>
          </>
        )}
      </div>
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      <TieBreakerModal
        isOpen={isTiePending}
        onAcceptDraw={acceptDraw}
        onResolveByCount={resolveByCount}
      />
    </div>
  );
}