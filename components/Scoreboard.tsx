import React from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  scores: { [key in Player]: number };
  playerNames: { [key in Player]: string };
  currentPlayer: Player | null;
  isAITurn: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scores, playerNames, currentPlayer, isAITurn }) => {
  const playerCardClasses = (player: Player) => {
    const baseClasses = 'p-4 rounded-xl color-transition w-1/2 text-center shadow-sm flex flex-col justify-between';
    const activeClasses = 'shadow-lg scale-105';
    const inactiveClasses = 'scale-100 opacity-70';

    let colorClasses = '';
    if (player === 'X') {
      colorClasses = 'bg-[rgb(var(--x-color))] text-white';
    } else {
      colorClasses = 'bg-[rgb(var(--o-color))] text-white';
    }
    
    const pulseClass = (player === 'O' && isAITurn) ? 'pulse-thinking' : '';

    return `${baseClasses} ${colorClasses} ${currentPlayer === player ? activeClasses : inactiveClasses} ${pulseClass}`;
  };

  const getTurnText = () => {
      if(!currentPlayer) return null;

      if(isAITurn) {
          return "Thinking...";
      }
      return `${playerNames[currentPlayer]}'s Turn`;
  }

  return (
    <div className="w-full max-w-md mb-4">
        <div className="flex justify-between items-stretch gap-3">
            <div className={playerCardClasses('X')}>
                <p className="font-bold text-lg truncate" title={playerNames.X}>{playerNames.X}</p>
                <p className="text-3xl font-black">{scores.X}</p>
            </div>
            <div className={playerCardClasses('O')}>
                <p className="font-bold text-lg truncate" title={playerNames.O}>{playerNames.O}</p>
                 <p className="text-3xl font-black">{scores.O}</p>
            </div>
        </div>
        <div className="h-8 mt-2 flex items-center justify-center">
            {currentPlayer && (
                <p className="text-lg font-semibold fade-in">
                    {getTurnText()}
                </p>
            )}
        </div>
    </div>
  );
};

export default Scoreboard;