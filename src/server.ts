import 'dotenv/config';
import { httpServer } from "./app.js";
import * as env from "./config/env.js";

httpServer.listen(env.HTTP_PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${env.HTTP_PORT}`);
  console.log(`✅ WebSocket ready on ws://0.0.0.0:${env.WS_PORT}/${env.WS_ENDPOINT}`);
});