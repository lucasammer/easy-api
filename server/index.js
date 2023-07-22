const express = require("express");
const app = express();

const { port, homeMSG, hashome } = require("../config/server.json");

app.get("/", (req, res) => {
  res.send(
    homeMSG == "dflt"
      ? "<h1>easy api</h1><hr><h3>easy api default home page</h3>"
      : homeMSG
  );
});

app.listen(port, () => {
  console.log("started listing on port %d (http://localhost:%d)", port, port);
});
