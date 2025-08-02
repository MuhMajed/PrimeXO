export type Player = 'X' | 'O';
export type CellState = Player | null;
export type BoardState = CellState[]; // Array of 9 cells
export type BoardOutcome = Player | 'draw' | null;

export type WinnerInfo = {
  winner: BoardOutcome;
  line: number[] | null; // e.g., [0, 1, 2] for a winning line
};

export enum GameMode {
  PlayerVsPlayer = 'pvp',
  PlayerVsAI = 'pva',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Impossible = 'impossible',
}

export type Theme = 'light' | 'dark';