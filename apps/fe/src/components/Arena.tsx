import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WebSocketService } from "../services/WebSocket";
import { Avatar } from "../classes/Avatar";
import {
  Position,
  User,
  SpaceJoinedPayload,
  UserJoinedPayload,
  UserLeftPayload,
  MovementPayload,
  MovementRejectedPayload,
} from "../types/Websocket";

const BLOCK_SIZE = 20;

const Arena: React.FC = () => {
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocketService | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const token = searchParams.get("token");
  const spaceId = searchParams.get("spaceId");

  useEffect(() => {
    if (!token || !spaceId) {
      setError("Missing token or spaceId");
      return;
    }

    const wsUrl = "ws://localhost:8080";
    if (!wsUrl) {
      setError("WebSocket URL not configured");
      return;
    }

    const ws = new WebSocketService(wsUrl);
    wsRef.current = ws;

    const connect = async () => {
      try {
        await ws.connect();

        ws.send("join", {
          spaceId,
          token,
        });

        ws.on<SpaceJoinedPayload>("space-joined", (payload) => {
          setPosition(payload.spawn);
          setUsers(payload.users);
          setCurrentUserId(payload.userId);
        });

        ws.on<UserJoinedPayload>("user-joined", (payload) => {
          setUsers((prev) => [
            ...prev,
            {
              userId: payload.userId,
              x: payload.x,
              y: payload.y,
            },
          ]);
        });

        ws.on<UserLeftPayload>("user-left", (payload) => {
          setUsers((prev) =>
            prev.filter((user) => user.userId !== payload.userId)
          );
        });

        ws.on<MovementPayload>("movement", (payload) => {
          setUsers((prev) =>
            prev.map((user) =>
              user.userId === payload.userId
                ? { ...user, x: payload.x, y: payload.y }
                : user
            )
          );
        });

        ws.on<MovementRejectedPayload>("movement-rejected", (payload) => {
          setPosition({ x: payload.x, y: payload.y });
        });
      } catch (error) {
        setError("WebSocket connection failed");
        console.error("WebSocket connection failed:", error);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token, spaceId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += BLOCK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += BLOCK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw current player
      const playerAvatar = new Avatar(position.x, position.y, "#4CAF50", "You");
      playerAvatar.draw(ctx, BLOCK_SIZE);

      // Draw other users
      users.forEach((user) => {
        if (user.userId !== currentUserId) {
          const userAvatar = new Avatar(
            user.x,
            user.y,
            "#2196F3",
            `User ${user.userId}`
          );
          userAvatar.draw(ctx, BLOCK_SIZE);
        }
      });

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!wsRef.current) return;

      const newPosition = { ...position };

      switch (e.key) {
        case "ArrowUp":
        case "w":
          newPosition.y -= 1;
          break;
        case "ArrowDown":
        case "s":
          newPosition.y += 1;
          break;
        case "ArrowLeft":
        case "a":
          newPosition.x -= 1;
          break;
        case "ArrowRight":
        case "d":
          newPosition.x += 1;
          break;
        default:
          return;
      }

      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        wsRef.current.send("move", {
          x: newPosition.x,
          y: newPosition.y,
          userId: currentUserId,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position, users, currentUserId]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="arena-container">
      <div className="arena-header">
        <h2>Arena</h2>
        <div className="arena-info">
          <div>Space ID: {spaceId}</div>
          <div>Users Online: {users.length + 1}</div>
        </div>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="game-canvas"
        />
        <div className="position-info">
          Position: ({position.x}, {position.y})
        </div>
      </div>
    </div>
  );
};

export default Arena;
