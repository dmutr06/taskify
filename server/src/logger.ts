import { Logger, ILogObj } from "tslog";

const log: Logger<ILogObj> = new Logger({
    prettyLogTemplate:"{{hh}}:{{MM}}:{{ss}} {{logLevelName}} > ",
});

export default log;
