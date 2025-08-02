import React from 'react';

interface TieBreakerModalProps {
  isOpen: boolean;
  onAcceptDraw: () => void;
  onResolveByCount: () => void;
}

const TieBreakerModal: React.FC<TieBreakerModalProps> = ({ isOpen, onAcceptDraw, onResolveByCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in">
      <div 
        className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 text-center pop-in color-transition"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">It's a Tie!</h2>
        <p className="text-[rgb(var(--on-surface-variant))] mb-6">How do you want to settle the score?</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={onResolveByCount}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Settle by Score
          </button>
          <button
            onClick={onAcceptDraw}
            className="w-full bg-[rgb(var(--surface-variant))] hover:bg-[rgb(var(--outline))] text-[rgb(var(--on-surface))] font-bold py-3 px-4 rounded-full shadow-md transition-transform transform hover:scale-105 color-transition"
          >
            Accept Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default TieBreakerModal;