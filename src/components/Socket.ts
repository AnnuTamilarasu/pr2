// socket.ts
import { io } from "socket.io-client";
import type { ListItem } from "./types.ts";

export const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

export type { ListItem };
