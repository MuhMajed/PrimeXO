import React, { useState } from 'react';
import { GameMode, Difficulty, Theme, Player } from '../types';
import HowToPlayModal from './HowToPlayModal';
import { UserIcon, ComputerIcon, SunIcon, MoonIcon, VolumeUpIcon, VolumeOffIcon, HelpIcon } from './Icons';

interface SetupScreenProps {
  onStart: (mode: GameMode, p1Name: string, p2Name: string) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (e: boolean) => void;
  primeAudio: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ 
  onStart, difficulty, setDifficulty, 
  theme, setTheme, soundEnabled, setSoundEnabled, primeAudio
}) => {
  const [mode, setMode] = useState<GameMode>(GameMode.PlayerVsAI);
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(mode, p1Name.trim() || 'Player 1', p2Name.trim() || 'Player 2');
  };
  
  const ModeButton = ({ selected, onClick, children, className }: {selected: boolean, onClick: () => void, children: React.ReactNode, className: string}) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 p-4 rounded-xl border-2 color-transition ${selected ? `text-white shadow-lg ${className}` : 'bg-[rgb(var(--surface-variant))] border-transparent hover:border-[rgb(var(--primary))]'}`}
      >
        {children}
    </button>
  );
  
  const TonalButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
     <button 
        onClick={() => { onClick(); primeAudio(); }} 
        className={`p-2 rounded-full color-transition ${isActive ? 'bg-[rgb(var(--primary))] text-white' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
     >
        {children}
    </button>
  )

  return (
    <div className="flex flex-col items-center justify-center h-full text-center fade-in">
       <div className="absolute top-4 right-4 flex items-center gap-2">
            <TonalButton isActive={false} onClick={() => setIsHowToPlayOpen(true)}>
                <HelpIcon className="w-6 h-6"/>
            </TonalButton>
            <div className="w-px h-6 bg-[rgb(var(--outline))] mx-1"></div>
            <TonalButton isActive={soundEnabled} onClick={() => setSoundEnabled(true)}>
              <VolumeUpIcon className="w-6 h-6"/>
            </TonalButton>
            <TonalButton isActive={!soundEnabled} onClick={() => setSoundEnabled(false)}>
              <VolumeOffIcon className="w-6 h-6"/>
            </TonalButton>
            <div className="w-px h-6 bg-[rgb(var(--outline))] mx-1"></div>
            <TonalButton isActive={theme === 'light'} onClick={() => setTheme('light')}>
              <SunIcon className="w-6 h-6"/>
            </TonalButton>
            <TonalButton isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
              <MoonIcon className="w-6 h-6"/>
            </TonalButton>
       </div>
      
      <h1 className="text-5xl font-bold mb-2" style={{color: 'rgb(var(--primary))'}}>Prime XO</h1>
      <p className="text-lg text-[rgb(var(--on-surface-variant))] mb-8">The ultimate tic-tac-toe challenge.</p>
      
      <div className="w-full max-w-sm bg-[rgb(var(--surface))] p-8 rounded-2xl" style={{boxShadow: 'var(--shadow)'}}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-left">Game Mode</h2>
          <div className="flex justify-center gap-4">
             <ModeButton selected={mode === GameMode.PlayerVsAI} onClick={() => setMode(GameMode.PlayerVsAI)} className="bg-blue-500 border-blue-500">
                <ComputerIcon className="w-8 h-8 mx-auto mb-2" />
                <span className="font-semibold">vs AI</span>
            </ModeButton>
            <ModeButton selected={mode === GameMode.PlayerVsPlayer} onClick={() => setMode(GameMode.PlayerVsPlayer)} className="bg-purple-500 border-purple-500">
                 <UserIcon className="w-8 h-8 mx-auto mb-2" />
                <span className="font-semibold">vs Player</span>
            </ModeButton>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === GameMode.PlayerVsAI && (
            <div className="mb-6 fade-in">
              <h2 className="text-xl font-semibold mb-4 text-left">AI Difficulty</h2>
              <div className="flex justify-between gap-1 p-1 bg-[rgb(var(--surface-variant))] rounded-full">
                {(Object.values(Difficulty)).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1 px-2 text-sm rounded-full font-semibold capitalize color-transition ${difficulty === d ? 'bg-[rgb(var(--primary))] text-white shadow-sm' : 'text-[rgb(var(--on-surface-variant))] hover:bg-black/5'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8 text-left">
            <div>
              <label htmlFor="p1Name" className="block text-sm font-medium text-[rgb(var(--on-surface-variant))] mb-1">Player 1 (X)</label>
              <input
                type="text"
                id="p1Name"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full px-3 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--outline))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] color-transition"
                maxLength={15}
              />
            </div>
            
            {mode === GameMode.PlayerVsPlayer && (
              <div className="fade-in">
                <label htmlFor="p2Name" className="block text-sm font-medium text-[rgb(var(--on-surface-variant))] mb-1">Player 2 (O)</label>
                <input
                  type="text"
                  id="p2Name"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full px-3 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--outline))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--secondary))] focus:border-[rgb(var(--secondary))] color-transition"
                  maxLength={15}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Start Game
          </button>
        </form>
      </div>
       <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
};

export default SetupScreen;