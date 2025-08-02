import React, { useState } from 'react';
import { Player } from '../types';

interface OnlineLobbyProps {
  onStart: (gameId: string, playerRole: Player) => void;
}

const OnlineLobby: React.FC<OnlineLobbyProps> = ({ onStart }) => {
  const [joinGameId, setJoinGameId] = useState('');
  const [error, setError] = useState('');

  const createGame = () => {
    setError('');
    // Generate a simple 4-char random ID
    const newGameId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const initialGameState = {
      players: ['X'],
      minorBoardStates: Array(9).fill(null).map(() => Array(9).fill(null)),
      minorWinners: Array(9).fill(null),
      majorWinner: null,
      currentPlayer: 'X',
      scores: { X: 0, O: 0 },
      isTiePending: false,
    };
    localStorage.setItem(`prime-xo-online-${newGameId}`, JSON.stringify(initialGameState));
    onStart(newGameId, 'X');
  };

  const joinGame = () => {
    setError('');
    const gameKey = `prime-xo-online-${joinGameId.toUpperCase()}`;
    const gameDataString = localStorage.getItem(gameKey);

    if (!gameDataString) {
      setError('Game not found. Check the code and try again.');
      return;
    }

    let gameData;
    try {
      gameData = JSON.parse(gameDataString);
    } catch (e) {
      setError('Invalid game data found. Cannot join.');
      return;
    }

    if (gameData.players.length >= 2) {
      setError('This game is already full.');
      return;
    }

    gameData.players.push('O');
    localStorage.setItem(gameKey, JSON.stringify(gameData));
    onStart(joinGameId.toUpperCase(), 'O');
  };

  return (
    <div className="text-left fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Create a New Game</h3>
        <p className="text-sm text-[rgb(var(--on-surface-variant))] mb-3">Create a game and share the code with a friend on the same computer.</p>
        <button
          onClick={createGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          Create Game
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Join a Game</h3>
        <p className="text-sm text-[rgb(var(--on-surface-variant))] mb-3">Enter the code from your friend to join their game.</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="GAME CODE"
            value={joinGameId}
            onChange={(e) => setJoinGameId(e.target.value)}
            className="flex-grow w-full px-3 py-2 bg-[rgb(var(--background))] border border-[rgb(var(--outline))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] color-transition uppercase font-mono tracking-widest"
            maxLength={4}
          />
          <button
            onClick={joinGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Join
          </button>
        </div>
         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default OnlineLobby;