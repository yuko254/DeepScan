import 'dotenv/config';
import { app, httpServer } from "./app.js";
import * as env from "./config/env.js";

const PORT = env.APP_PORT;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ WebSocket ready on ws://0.0.0.0:${PORT}/graphql`);
});