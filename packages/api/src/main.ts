import app from "./app";
import { config } from "./core/config";
import { connectDB } from "./core/config/database";

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

startServer();
