import { Logger, ILogObj } from "tslog";

const log: Logger<ILogObj> = new Logger({
    prettyLogTemplate:"{{fileNameWithLine}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}} > ",
});

export default log;
