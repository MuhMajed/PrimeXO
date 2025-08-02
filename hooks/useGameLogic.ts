import { useState, useEffect, useCallback } from 'react';
import { Player, BoardState, GameMode, Difficulty, WinnerInfo, BoardOutcome } from '../types';
import { getAIMove } from '../services/aiService';

const initialMinorBoards = (): BoardState[] => Array(9).fill(null).map(() => Array(9).fill(null));
const initialMinorWinners = (): (WinnerInfo | null)[] => Array(9).fill(null);
const initialScores = { X: 0, O: 0 };

const checkWinner = (board: (Player | 'draw' | null)[]): WinnerInfo => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] !== 'draw' && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: lines[i] };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  return { winner: null, line: null };
};

interface UseGameLogicProps {
  gameMode: GameMode | null;
  difficulty: Difficulty;
  onMove: () => void;
}

const useGameLogic = ({ gameMode, difficulty, onMove }: UseGameLogicProps) => {
  const [minorBoardStates, setMinorBoardStates] = useState<BoardState[]>(initialMinorBoards);
  const [minorWinners, setMinorWinners] = useState<(WinnerInfo | null)[]>(initialMinorWinners);
  const [majorWinner, setMajorWinner] = useState<WinnerInfo | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [scores, setScores] = useState<{ [key in Player]: number }>(initialScores);
  const [isAITurn, setIsAITurn] = useState<boolean>(false);
  const [isTiePending, setIsTiePending] = useState<boolean>(false);

  const resetState = useCallback((preserveScores = false) => {
    setMinorBoardStates(initialMinorBoards());
    setMinorWinners(initialMinorWinners());
    setMajorWinner(null);
    setCurrentPlayer('X');
    setIsAITurn(false);
    setIsTiePending(false);
    if (!preserveScores) {
        setScores(initialScores);
    }
  }, []);

  const newGame = useCallback(() => {
    resetState(false);
  }, [resetState]);

  const resetGame = useCallback(() => {
    resetState(true);
  }, [resetState]);

  const acceptDraw = useCallback(() => {
    setMajorWinner({ winner: 'draw', line: null });
    setIsTiePending(false);
  }, []);

  const resolveByCount = useCallback(() => {
    const xWins = minorWinners.filter(w => w?.winner === 'X').length;
    const oWins = minorWinners.filter(w => w?.winner === 'O').length;

    let finalWinner: BoardOutcome = 'draw';
    if (xWins > oWins) finalWinner = 'X';
    if (oWins > xWins) finalWinner = 'O';
    
    setMajorWinner({ winner: finalWinner, line: null });
    setIsTiePending(false);
    
    if (finalWinner !== 'draw') {
      setScores(prevScores => ({...prevScores, [finalWinner]: prevScores[finalWinner] + 1 }));
    }
  }, [minorWinners]);
  
  const handleCellClick = useCallback((boardIndex: number, cellIndex: number) => {
    if (majorWinner?.winner || minorBoardStates[boardIndex][cellIndex] || minorWinners[boardIndex]?.winner || isTiePending) {
      return;
    }

    onMove();

    const newMinorBoardStates = minorBoardStates.map((b, i) => i === boardIndex ? [...b] : b);
    newMinorBoardStates[boardIndex][cellIndex] = currentPlayer;
    setMinorBoardStates(newMinorBoardStates);

    const minorWinnerInfo = checkWinner(newMinorBoardStates[boardIndex]);
    if (minorWinnerInfo.winner) {
      const newMinorWinners = [...minorWinners];
      newMinorWinners[boardIndex] = minorWinnerInfo;
      setMinorWinners(newMinorWinners);

      const majorBoardForCheck = newMinorWinners.map(w => w?.winner ?? null);
      const newMajorWinner = checkWinner(majorBoardForCheck);
      
      if (newMajorWinner.winner) {
        if (newMajorWinner.winner === 'draw') {
          setIsTiePending(true);
        } else {
          setMajorWinner(newMajorWinner);
          setScores(prevScores => ({...prevScores, [newMajorWinner.winner as Player]: prevScores[newMajorWinner.winner as Player] + 1 }));
        }
      }
    }
    
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

  }, [currentPlayer, majorWinner, minorBoardStates, minorWinners, onMove, isTiePending]);

  useEffect(() => {
    const isGameOver = !!majorWinner?.winner || isTiePending;
    if (gameMode === GameMode.PlayerVsAI && currentPlayer === 'O' && !isGameOver && !isAITurn) {
      setIsAITurn(true);
      
      try {
        const majorBoardForAI: BoardOutcome[] = minorWinners.map(w => w?.winner ?? null);
        const { boardIndex, cellIndex } = getAIMove(majorBoardForAI, minorBoardStates, difficulty);
        
        if (minorBoardStates[boardIndex]?.[cellIndex] === null && !minorWinners[boardIndex]?.winner) {
          handleCellClick(boardIndex, cellIndex);
        } else {
           console.warn("AI provided an invalid move. Recalculating with a random move.");
           const validMoves: {boardIndex: number, cellIndex: number}[] = [];
           minorBoardStates.forEach((board, bIndex) => {
              if(!minorWinners[bIndex]?.winner){
                  board.forEach((cell, cIndex) => {
                      if(cell === null) validMoves.push({boardIndex: bIndex, cellIndex: cIndex});
                  })
              }
           });
           if(validMoves.length > 0){
              const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
              handleCellClick(randomMove.boardIndex, randomMove.cellIndex);
           }
        }
      } catch (error) {
        console.error("Local AI failed to make a move:", error);
      } finally {
        queueMicrotask(() => setIsAITurn(false));
      }
    }
  }, [currentPlayer, majorWinner, gameMode, difficulty, isAITurn, minorBoardStates, minorWinners, handleCellClick, isTiePending]);

  return {
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
  };
};

export default useGameLogic;