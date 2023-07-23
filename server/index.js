const express = require("express");
const app = express();

const {
  port,
  homeMSG,
  hashome,
  showerrors,
  APIfile,
} = require("../config/server.json");

const { api } = require(APIfile);

app.get("/", (req, res) => {
  if (!hashome) {
    error(404, res);
    return;
  }
  res.send(
    homeMSG == "dflt"
      ? "<h1>easy api</h1><hr><h3>easy api default home page</h3>"
      : homeMSG
  );
});

const error = (code, res) => {
  if (showerrors) {
    if (code == 404) {
      res.send("<h1>404</h1><hr><h3>url not found!</h3>");
    } else if (code == 403) {
      res.send(
        "<h1>403</h1><hr><h2>Forbidden</h2><h3>You do not have acces to this url!</h3>"
      );
    } else {
      res.send(`<h1>${code}</h1><hr><h3>Something went wrong!</h3>`);
    }
  } else {
    res.status(code);
  }
  return;
};

app.listen(port, () => {
  console.log("started listing on port %d (http://localhost:%d)", port, port);
});
