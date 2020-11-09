export type IMatchResult = "Win" | "Draw" | "Defeat";
export type IUserGameChoice = "Stone" | "Scissors" | "Paper";
export interface MatchResult {
  result: IMatchResult;
}
export interface UserStats {
  percentOfWin: number;
  nickname: string;
}

export type Result = {
  wins: number;
  defeat: number;
  draw: number;
  percentOfWin: number;
};

export interface IUser {
  token: string;
  id: string;
  nickname: string;
}

export interface Room {
  id: string;
  users: [{ user: string; nickname: string }];
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetRoom {
  getRoom: Room & { error: [string] };
}
