
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const API = require("./api");
const port = process.env.PORT || 3000;
const webhook = require("./webhook");

// TODO: DB Connection --------

app.use(bodyParser.json());

app.use("/api/", API);


app.use("/webhook/", webhook);

app.get("*", (req, res) => res.status(404).json({ message: "Route Not Found." }));

app.listen(port, () => console.info(`Server listening on *:${port}`));