const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT;
const mainApp = process.env.APPLICATION_PATH;
// app.get("/", (req, res) => res.send("Hello World!"));

app.use(express.static(mainApp));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
