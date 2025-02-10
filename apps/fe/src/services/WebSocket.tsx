// src/services/websocket.ts
import { WebSocketMessage } from "../types/Websocket";

export class WebSocketService {
  private url: string;
  private ws: WebSocket | null;
  private messageHandlers: Map<string, (payload: any) => void>;

  constructor(url: string) {
    this.url = url;
    this.ws = null;
    this.messageHandlers = new Map();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onerror = (error) => {
        reject(error);
      };

      this.ws.onmessage = (event: MessageEvent) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message.payload);
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
      };
    });
  }

  on<T>(messageType: string, handler: (payload: T) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}
