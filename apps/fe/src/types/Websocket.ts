// src/types/websocket.ts
export interface Position {
  x: number;
  y: number;
}

export interface User {
  userId: string;
  x: number;
  y: number;
}

export interface SpaceJoinedPayload {
  spawn: Position;
  users: User[];
  userId: string;
}

export interface UserJoinedPayload {
  userId: string;
  x: number;
  y: number;
}

export interface UserLeftPayload {
  userId: string;
}

export interface MovementPayload {
  userId: string;
  x: number;
  y: number;
}

export interface MovementRejectedPayload {
  x: number;
  y: number;
}

export type WebSocketMessage = {
  type: string;
  payload: any;
};
