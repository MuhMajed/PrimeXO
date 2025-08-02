import { BoardState, Difficulty, BoardOutcome, Player } from '../types';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const checkBoardWinner = (board: (Player | null)[]): Player | 'draw' | null => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) {
    return 'draw';
  }
  return null;
};

const getAvailableMoves = (minorBoardStates: BoardState[], majorBoardState: BoardOutcome[]): { boardIndex: number, cellIndex: number }[] => {
    const moves: { boardIndex: number, cellIndex: number }[] = [];
    minorBoardStates.forEach((board, boardIndex) => {
        if (majorBoardState[boardIndex] === null) {
            board.forEach((cell, cellIndex) => {
                if (cell === null) {
                    moves.push({ boardIndex, cellIndex });
                }
            });
        }
    });
    return moves;
};

const getWinningMove = (board: BoardState, player: Player): number | null => {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        const lineValues = [board[a], board[b], board[c]];
        if (lineValues.filter(p => p === player).length === 2 && lineValues.includes(null)) {
            if (board[a] === null) return a;
            if (board[b] === null) return b;
            return c;
        }
    }
    return null;
};

// --- AI Difficulty Logic ---

const getEasyMove = (availableMoves: { boardIndex: number, cellIndex: number }[]): { boardIndex: number, cellIndex: number } => {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getMediumMove = (
  minorBoardStates: BoardState[], 
  majorBoardState: BoardOutcome[],
  availableMoves: { boardIndex: number, cellIndex: number }[]
): { boardIndex: number, cellIndex: number } => {
  const boardsInPlay = minorBoardStates
    .map((_, index) => index)
    .filter(index => majorBoardState[index] === null);

  // 1. Check if AI ('O') can win a minor board
  for (const boardIndex of boardsInPlay) {
    const winningMoveCell = getWinningMove(minorBoardStates[boardIndex], 'O');
    if (winningMoveCell !== null) {
      return { boardIndex, cellIndex: winningMoveCell };
    }
  }

  // 2. Check if player ('X') is about to win a minor board and block them
  for (const boardIndex of boardsInPlay) {
    const blockingMoveCell = getWinningMove(minorBoardStates[boardIndex], 'X');
    if (blockingMoveCell !== null) {
      return { boardIndex, cellIndex: blockingMoveCell };
    }
  }
  
  // 3. Otherwise, make a random move
  return getEasyMove(availableMoves);
};

const getHardMove = (
  minorBoardStates: BoardState[], 
  majorBoardState: BoardOutcome[],
  availableMoves: { boardIndex: number, cellIndex: number }[]
): { boardIndex: number, cellIndex: number } => {
  // Priority 1 & 2: Check for immediate wins or blocks on any minor board.
  const mediumMove = getMediumMove(minorBoardStates, majorBoardState, availableMoves);
  const {boardIndex, cellIndex} = mediumMove;
  const isWinning = getWinningMove(minorBoardStates[boardIndex], 'O') === cellIndex;
  const isBlocking = getWinningMove(minorBoardStates[boardIndex], 'X') === cellIndex;
  if (isWinning || isBlocking) {
      return mediumMove;
  }
  
  // Priority 3: Use strategic evaluation for other moves.
  let bestScore = -Infinity;
  let move = availableMoves[0]; // Default move

  for (const currentMove of availableMoves) {
    const tempMinorStates = minorBoardStates.map(b => [...b]);
    tempMinorStates[currentMove.boardIndex][currentMove.cellIndex] = 'O';
    
    const tempMajorState = [...majorBoardState];
    const minorWinner = checkBoardWinner(tempMinorStates[currentMove.boardIndex]);
    if(minorWinner) tempMajorState[currentMove.boardIndex] = minorWinner;

    const score = evaluatePosition(tempMajorState, 'O');
    
    if (score > bestScore) {
      bestScore = score;
      move = currentMove;
    }
  }
  
  return move || getEasyMove(availableMoves);
};

const evaluatePosition = (majorBoard: BoardOutcome[], player: Player): number => {
    let score = 0;
    const opponent = player === 'X' ? 'O' : 'X';
    const majorWinner = checkBoardWinner(majorBoard as (Player|null)[]);
    if (majorWinner === player) return 1000;
    if (majorWinner === opponent) return -1000;
    for(const line of WINNING_LINES) {
        const [a,b,c] = line;
        const values = [majorBoard[a], majorBoard[b], majorBoard[c]];
        const pCount = values.filter(v => v === player).length;
        const oCount = values.filter(v => v === opponent).length;
        if (pCount === 2 && oCount === 0) score += 10;
        if (oCount === 2 && pCount === 0) score -= 20;
    }
    return score;
}

// --- IMPOSSIBLE AI ---
const getImpossibleMove = (majorBoard: BoardOutcome[], minorBoards: BoardState[], availableMoves: { boardIndex: number, cellIndex: number }[]) => {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];
    
    const immediateWin = getMediumMove(minorBoards, majorBoard, availableMoves);
    if(getWinningMove(minorBoards[immediateWin.boardIndex], 'O') === immediateWin.cellIndex){
        return immediateWin;
    }
    
    for (const move of availableMoves) {
        const tempMajor = [...majorBoard];
        const tempMinors = minorBoards.map(b => [...b]);
        
        tempMinors[move.boardIndex][move.cellIndex] = 'O';
        const minorWinner = checkBoardWinner(tempMinors[move.boardIndex]);
        if (minorWinner) {
            tempMajor[move.boardIndex] = minorWinner;
        }

        const score = minimax(tempMajor, tempMinors, 2, false, -Infinity, Infinity);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
};

const minimax = (majorBoard: BoardOutcome[], minorBoards: BoardState[], depth: number, isMaximizing: boolean, alpha: number, beta: number): number => {
    const majorWinner = checkBoardWinner(majorBoard as Player[]);
    if (majorWinner === 'O') return 10000 + depth;
    if (majorWinner === 'X') return -10000 - depth;
    if (majorWinner === 'draw' || depth === 0) return evaluateOverallState(majorBoard, minorBoards);

    const availableMoves = getAvailableMoves(minorBoards, majorBoard);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of availableMoves) {
            const { newMajor, newMinors } = simulateMove(majorBoard, minorBoards, move, 'O');
            const evalScore = minimax(newMajor, newMinors, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of availableMoves) {
            const { newMajor, newMinors } = simulateMove(majorBoard, minorBoards, move, 'X');
            const evalScore = minimax(newMajor, newMinors, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

const simulateMove = (major: BoardOutcome[], minors: BoardState[], move: {boardIndex: number, cellIndex: number}, player: Player) => {
    const newMinors = minors.map(b => [...b]);
    const newMajor = [...major];
    newMinors[move.boardIndex][move.cellIndex] = player;
    const minorWinner = checkBoardWinner(newMinors[move.boardIndex]);
    if(minorWinner) newMajor[move.boardIndex] = minorWinner;
    return {newMajor, newMinors};
}

const evaluateOverallState = (majorBoard: BoardOutcome[], minorBoards: BoardState[]): number => {
    let score = evaluatePosition(majorBoard, 'O') * 100; // Major board is more important
    for (const board of minorBoards) {
        for (const line of WINNING_LINES) {
            const values = line.map(i => board[i]);
            const o_count = values.filter(v => v === 'O').length;
            const x_count = values.filter(v => v === 'X').length;
            if (o_count === 2 && x_count === 0) score += 5;
            if (x_count === 2 && o_count === 0) score -= 10;
        }
    }
    // Add bonus for winning minor boards
    score += majorBoard.filter(w => w === 'O').length * 20;
    score -= majorBoard.filter(w => w === 'X').length * 20;
    return score;
}

export const getAIMove = (
  majorBoardState: BoardOutcome[],
  minorBoardStates: BoardState[],
  difficulty: Difficulty
): { boardIndex: number, cellIndex: number } => {
  const availableMoves = getAvailableMoves(minorBoardStates, majorBoardState);

  if (availableMoves.length === 0) {
    throw new Error("No available moves for AI.");
  }

  switch (difficulty) {
    case Difficulty.Easy:
      return getEasyMove(availableMoves);
    case Difficulty.Medium:
      return getMediumMove(minorBoardStates, majorBoardState, availableMoves);
    case Difficulty.Hard:
      return getHardMove(minorBoardStates, majorBoardState, availableMoves);
    case Difficulty.Impossible:
      return getImpossibleMove(majorBoardState, minorBoardStates, availableMoves);
    default:
      return getEasyMove(availableMoves);
  }
};