import React from 'react';
import { CloseIcon } from './Icons';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-6 w-full max-w-lg m-4 relative pop-in color-transition text-left"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6"/>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">How to Play Prime XO</h2>
        
        <div className="space-y-4 text-[rgb(var(--on-surface-variant))]">
            <div>
              <h3 className="font-bold text-lg text-[rgb(var(--on-surface))] mb-1">The Goal</h3>
              <p>The main goal is to win three small tic-tac-toe boards in a row on the large 3x3 grid - just like a normal game of tic-tac-toe, but on a bigger scale.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-[rgb(var(--on-surface))] mb-1">Game Structure</h3>
              <p>The game is played on a large 3x3 grid. Each square of this large grid contains its own smaller 3x3 tic-tac-toe board.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-[rgb(var(--on-surface))] mb-1">How to Win a Small Board</h3>
              <p>You win a small board by getting three of your marks ('X' or 'O') in a row (horizontally, vertically, or diagonally) on that board.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[rgb(var(--on-surface))] mb-1">Gameplay Rules</h3>
              <p>Players take turns placing their mark in any available cell on any of the nine small boards. You can play anywhere that isn't already taken!</p>
              <p className="mt-2">Once a small board is won, it cannot be played on anymore. The winner of that small board claims that square on the large grid.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;