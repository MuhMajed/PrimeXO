import React from 'react';
import { BoardOutcome } from '../types';

interface WinningLineProps {
  line: number[];
  winner: BoardOutcome;
  isMajor: boolean;
}

const WinningLine: React.FC<WinningLineProps> = ({ line, winner, isMajor }) => {
  if (!line || !winner || winner === 'draw') return null;

  const getCellCenter = (index: number): { x: number; y: number } => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    // Each cell is 1/3 of the width/height. Center is at 1/6, 3/6, 5/6.
    const x = (col * 2 + 1) * (100 / 6);
    const y = (row * 2 + 1) * (100 / 6);
    return { x, y };
  };

  const startCell = getCellCenter(line[0]);
  const endCell = getCellCenter(line[2]);

  const color = winner === 'X' ? 'rgb(var(--x-color))' : 'rgb(var(--o-color))';
  const strokeWidth = isMajor ? '8' : '6';

  return (
    <div className="absolute inset-0 p-0 m-0 overflow-visible">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="overflow-visible"
        style={{
           filter: isMajor ? 'drop-shadow(0px 0px 8px rgba(0,0,0,0.5))' : 'drop-shadow(0px 0px 4px rgba(0,0,0,0.4))'
        }}
      >
        <line
          x1={startCell.x}
          y1={startCell.y}
          x2={endCell.x}
          y2={endCell.y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="draw-line"
        />
      </svg>
    </div>
  );
};

export default WinningLine;
