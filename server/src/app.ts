import { readdir, lstat } from "fs/promises";
import path from "path";

import logger from "./logger";
import express, { Router } from "express";
import mongoose from "mongoose";

export class App {
    private router: Router;
    private readonly routesDir: string = process.env.ROUTES_DIR || "routes";

    constructor() {
        this.router = Router();
    }

    private async useHandler(curPath: string, route: string): Promise<void> {
        const routeWithoutExt = path.basename(route, path.extname(route));
        const mod = routeWithoutExt == "index" ? "" : routeWithoutExt;
        const handler = await import(path.join(__dirname, this.routesDir, curPath, routeWithoutExt));

        if (handler.MIDDLEWARE) 
            this.router.use(path.join("/", curPath, mod).split("\\").join("/"), handler.MIDDLEWARE);

        for (const rawMethod in handler) {
            const method = rawMethod.toLowerCase();
            if ((method == "get" || method == "post" || method == "put" || method == "delete") && rawMethod == rawMethod.toUpperCase())
                this.router[method](path.join("/", curPath, mod).split("\\").join("/"), handler[rawMethod]);
        }

        logger.info(`Handler [${curPath ? path.join(curPath, mod).split("\\").join("/") : "/"}] has been added`);
    }

    private async loadHandlers(curPath: string = ""): Promise<void> {
        try {
            const fullPath = path.join(__dirname, this.routesDir, curPath);

            const res = await readdir(fullPath);

            const index = res.findIndex(route => /index.(ts|js)/.test(route));

            if (index != -1) {
                await this.useHandler(curPath, res[index]);
                res.splice(index, 1);
            }
            
            const dynRoutes: string[] = [];

            for (const idx in res) {
                const route = res[idx];
                if (route.startsWith(":")) {
                    dynRoutes.push(route);
                    continue;
                }

                if ((await lstat(path.join(fullPath, route))).isDirectory()) {
                    await this.loadHandlers(path.join(curPath, route));
                } else {
                    await this.useHandler(curPath, route);
                }
            }
            
            for (const route in dynRoutes)
                if ((await lstat(path.join(fullPath, dynRoutes[route]))).isDirectory())
                  await this.loadHandlers(path.join(curPath, dynRoutes[route]));
                else
                  await this.useHandler(curPath, dynRoutes[route]);
        } catch (err) {
            logger.error("Something went wrong...\n", err);
        }
    }

    private async connectToDb() {
        try {
            await mongoose.connect(process.env.MONGODB_URI!);
            logger.info("Successfully connected to the database");
        } catch (e) {
            logger.error("Could not connect to the database :(");
            process.exit(-1);
        }
    }

    public async run(base: string = ""): Promise<void> {
        await this.loadHandlers();
        await this.connectToDb();

        const port = Number(process.env.PORT) || 6969;

        const app = express();
      
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));
        app.use(base, this.router);

        app.listen(port, () => {
            logger.info(`Server has been started at port ${port}`);
        });
    }
}
