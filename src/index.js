const express = require("express");
const app = express();

require("dotenv").config();

const logger = require("./utils/logger");

const port = process.env.PORT;
const mainApp = process.env.APPLICATION_PATH;

app.use(express.static(mainApp));

app.get("/login", function(req, res) {
    console.log("Login Result Path");
    return res;
});

app.listen(port, () =>
    logger.log({
        level: "info",
        message: `Server running on Port ${port}`
    })
);
