import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  codeUpdate: (newCode: string) => void;
}
interface ClientToServerEvents {
  codeChange: (newCode: string) => void;
}
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000",
  {
    transports: ["websocket"],
  }
);
