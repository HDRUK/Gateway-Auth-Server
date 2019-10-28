const express = require("express");
const app = express();

require("dotenv").config();

const logger = require("./utils/logger");

/* eslint-disable */
//  error  'process' is not defined  no-undef
const port = process.env.PORT;
const mainApp = process.env.APPLICATION_PATH;
/* eslint-enable */

app.use(express.static(mainApp));

app.listen(port, () =>
    logger.log({
        level: "info",
        message: `Server running on Port ${port}`
    })
);
