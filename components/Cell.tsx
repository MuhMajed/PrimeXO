import React from 'react';
import { CellState } from '../types';

interface CellProps {
  value: CellState;
  onClick: () => void;
  isClickable: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isClickable }) => {
  const cellContent = () => {
    if (value === 'X') {
      return <div className="font-bold text-3xl md:text-4xl pop-in" style={{color: 'rgb(var(--x-color))'}}>X</div>;
    }
    if (value === 'O') {
      return <div className="font-bold text-3xl md:text-4xl pop-in" style={{color: 'rgb(var(--o-color))'}}>O</div>;
    }
    return null;
  };

  const clickableClasses = 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5';
  const nonClickableClasses = 'cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={!isClickable || !!value}
      className={`flex items-center justify-center w-full h-full aspect-square bg-[rgb(var(--background))] rounded-sm color-transition ${isClickable && !value ? clickableClasses : nonClickableClasses}`}
    >
      {cellContent()}
    </button>
  );
};

export default Cell;