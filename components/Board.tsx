import React from 'react';
import { BoardState, WinnerInfo } from '../types';
import MinorBoard from './MinorBoard';
import WinningLine from './WinningLine';

interface BoardProps {
  minorBoardStates: BoardState[];
  minorWinners: (WinnerInfo | null)[];
  majorWinner: WinnerInfo | null;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  isInteractionDisabled: boolean;
}

const Board: React.FC<BoardProps> = ({ minorBoardStates, minorWinners, majorWinner, onCellClick, isInteractionDisabled }) => {
  return (
    <div className="relative grid grid-cols-3 gap-1.5 md:gap-2 bg-gray-400 dark:bg-gray-600 p-1.5 md:p-2 rounded-lg shadow-lg w-full max-w-md aspect-square">
      {minorBoardStates.map((board, i) => (
        <MinorBoard
          key={i}
          boardState={board}
          winnerInfo={minorWinners[i]}
          onCellClick={(cellIndex) => onCellClick(i, cellIndex)}
          isInteractionDisabled={isInteractionDisabled || !!minorWinners[i]?.winner}
        />
      ))}
      {majorWinner?.line && (
        <WinningLine
            line={majorWinner.line}
            winner={majorWinner.winner}
            isMajor={true}
        />
      )}
    </div>
  );
};

export default Board;