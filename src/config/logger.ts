import { createLogger, format, transports, Logger } from "winston";
import * as sourceMapSupport from "source-map-support";

const { combine, timestamp, printf, colorize, json } = format;

interface LogFormat {
    level: string;
    message: string;
    label?: string;
    timestamp?: string;
}

// linking trace support
sourceMapSupport.install();

const consoleFormat = printf((info: LogFormat) => {
    const { level, message, timestamp } = info;
    return `[${timestamp}] [${level}] ${message}`;
});

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
    },
};

const developmentLogger = () => {
    return createLogger({
        levels: customLevels.levels,
        format: combine(timestamp({ format: "YY-MM-DD HH:mm:ss" })),
        transports: [
            new transports.File({
                filename: "logs/error.log",
                level: "error",
                format: json(),
            }),
            new transports.File({
                filename: "logs/warn.log",
                level: "warn",
                format: json(),
            }),
            new transports.File({
                filename: "logs/info.log",
                level: "info",
                format: json(),
            }),
            new transports.Console({
                format: combine(
                    colorize({ all: true, colors: customLevels.colors }),
                    consoleFormat
                ),
            }),
        ],
    });
};

const productionLogger = () => {
    return createLogger({
        levels: customLevels.levels,
        format: combine(timestamp()),
        transports: [
            new transports.File({
                filename: "logs/error.log",
                level: "error",
                format: json(),
            }),
            new transports.File({
                filename: "logs/warn.log",
                level: "warn",
                format: json(),
            }),
            new transports.File({
                filename: "logs/info.log",
                level: "info",
                format: json(),
            }),
            new transports.Console({
                format: combine(
                    colorize({ all: true, colors: customLevels.colors }),
                    consoleFormat
                ),
            }),
        ],
    });
};

let logger: Logger = developmentLogger();

if (process.env.NODE_ENV === "production") {
    logger = productionLogger();
}

export default logger;
