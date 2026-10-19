import "dotenv/config";

import connectDB from "./db/index.js";
import { app } from "./app.js";
import { createServer } from "node:http";
import { initSocket } from "./utils/socket.js";

const server = createServer(app);
initSocket(server);

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server is running on port : ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });