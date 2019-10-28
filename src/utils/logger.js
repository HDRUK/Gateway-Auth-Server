const winston = require("winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} - ${info.level}  - ${info.message}`)
);

winston.loggers.add("customLogger", {
    format: logFormat,
    transports: [
        new winstonDailyRotateFile({
            filename: "./log/custom-%DATE%.log",
            datPattern: "YYYY-MM-DD",
            level: "info"
        }),
        new winston.transports.Console({
            level: "info"
        })
    ]
});

const logger = winston.loggers.get("customLogger");

// const logger = winston.createLogger({
//     level: "info",
//     format: winston.format.json(),
//     defaultMeta: { service: "user-service" },
//     transports: [
//         new winston.transports.File({ filename: "log/error.log", level: "error" }),
//         new winston.transports.File({ filename: "log/info.log", level: "info" })
//     ]
// });

// const logger1 = winston.createLogger({
//     level: "info",
//     format: winston.format.json(),
//     defaultMeta: { service: "user-service" },
//     transports: [new winston.transports.File({ filename: "log/info.log", level: "info" })]
// });

/* eslint-disable */
// eslint is reporting - 'process' is not defined  no-undef
// if (process.env.NODE_ENV === "local") {
//     /* eslint-enable */
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple()
//         })
//     );
// }
module.exports = logger;
