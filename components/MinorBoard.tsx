import React from 'react';
import { BoardState, Player, WinnerInfo } from '../types';
import Cell from './Cell';
import WinningLine from './WinningLine';

interface MinorBoardProps {
  boardState: BoardState;
  winnerInfo: WinnerInfo | null;
  onCellClick: (cellIndex: number) => void;
  isInteractionDisabled: boolean;
}

const MinorBoard: React.FC<MinorBoardProps> = ({ boardState, winnerInfo, onCellClick, isInteractionDisabled }) => {
  const winner = winnerInfo?.winner;
  const winnerSymbol = (player: Player) => {
    const color = player === 'X' ? 'rgb(var(--x-color))' : 'rgb(var(--o-color))';
    if (player === 'X') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{color}}>
          <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        </svg>
      );
    }
    if (player === 'O') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{color}}>
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="12" fill="none" />
        </svg>
      );
    }
    return null;
  };
  
  const boardBgColor = winner
    ? winner === 'X' ? 'bg-blue-500/10' : winner === 'O' ? 'bg-red-500/10' : 'bg-gray-500/20'
    : 'bg-[rgb(var(--surface))]';

  return (
    <div className={`relative grid grid-cols-3 gap-1 md:gap-1.5 p-1 md:p-1.5 rounded-md aspect-square ${boardBgColor} color-transition`}>
      {boardState.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          onClick={() => onCellClick(i)}
          isClickable={!winner && !isInteractionDisabled}
        />
      ))}
      {winner && winner !== 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center p-2 opacity-60 pop-in">
          {winnerSymbol(winner)}
        </div>
      )}
      {winnerInfo?.line && (
         <WinningLine
            line={winnerInfo.line}
            winner={winnerInfo.winner}
            isMajor={false}
        />
      )}
      {winner === 'draw' && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md fade-in">
            <span className="text-white font-bold text-2xl md:text-4xl opacity-90 tracking-widest">TIE</span>
         </div>
      )}
    </div>
  );
};

export default MinorBoard;