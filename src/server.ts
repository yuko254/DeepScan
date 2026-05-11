import 'dotenv/config';
import app from "./app.js"
import * as env from "./config/env.js"

const PORT = env.APP_PORT;
app.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`)
);
