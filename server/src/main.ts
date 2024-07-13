import { config } from "dotenv";
import { App } from "./app";

async function bootstrap(): Promise<void> {
    config();

    const app = new App();

    app.run();
}

bootstrap();
