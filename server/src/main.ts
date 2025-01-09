import { config } from "dotenv";
import { App } from "./app";
import logger from "./logger";

async function bootstrap(): Promise<void> {
    config();
    
    if (process.env.LOGGER == "disabled")
      logger.settings.type = "hidden";
      

    const app = new App();

    app.run("/api");
}

bootstrap();
