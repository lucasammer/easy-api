const express = require("express");
const fs = require("node:fs");
const app = express();

const {
  port,
  homeMSG,
  hashome,
  showerrors,
  APIfile,
  apiFolder,
  allKeys,
  keyfile,
  allowsignup,
  signupLink,
  KeyCreationOriginMustMatch,
  keyencoding,
} = require("../config/server.json");

const { api } = require(APIfile);

const error = (code, res, doshow = showerrors, data = "nothing to show") => {
  if (doshow) {
    if (code == 404) {
      res.send("<h1>404</h1><hr><h3>url not found!</h3>");
    } else if (code == 403) {
      res.send(
        "<h1>403</h1><hr><h2>Forbidden</h2><h3>You do not have acces to this url!</h3>"
      );
    } else if (code == 501) {
      res.send(
        `<h1>501</h1><hr><h2>Internal server error</h2><h3>Something went wrong server side, there is nothing you can do to fix this</h3><script>console.error(${data})</script>`
      );
    } else {
      res.send(
        `<h1>${code}</h1><hr><h3>Something went wrong!</h3><script>console.error(${data})</script>`
      );
    }
  } else {
    res.sendstatus(code);
  }
  return;
};

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

app.get("/checkKey", (req, res) => {
  let keys = fs.readFileSync(keyfile);
  keys = JSON.parse(keys);
  res.json(JSON.parse(`{"valid": ${keys.hasOwnProperty(req.query.key)}}`));
});

if (allowsignup) {
  app.get(signupLink, (req, res) => {
    if (!req.query.hasOwnProperty("origin")) {
      res.json(
        JSON.parse(`{"created": false, "error": "no origin specified"}`)
      );
      return;
    }
    if (!req.query.origin.match(KeyCreationOriginMustMatch)) {
      res.json(
        JSON.parse(
          `{"created": false, "error": "origin doesn't meet criteria"}`
        )
      );
      return;
    }
    try {
      let buffer = new Buffer.from(req.query.origin);
      let keys = fs.readFileSync(keyfile);
      keys = JSON.parse(keyfile);
      if (keys.hasOwnProperty(req.query.keys)) {
        error(403, res);
        return;
      }
      res.json(
        JSON.parse(`{"created": true,"key":"${buffer.toString(keyencoding)}"}`)
      );
    } catch (e) {
      error((code = 501), (res = res), (data = e));
    }
  });
}

for (const apiElement in api) {
  if (Object.hasOwnProperty.call(api, apiElement)) {
    const element = api[apiElement];
    console.log("found api item: " + element.name);
    app.get(element.publicLoc, (req, res) => {
      loc = element.name;
      if (element.hasOwnProperty("privateloc")) {
        loc = element.privateloc;
      }

      const runner = require(apiFolder + loc);
      if (!runner.hasOwnProperty("execute")) {
        console.log("Invalid API item: " + element.name);
        console.log("   Missing execute function");
        error(501, res);
        return;
      }

      runner.execute(res, req, req.headers);
    });
  }
}

app.listen(port, () => {
  console.log("started listing on port %d (http://localhost:%d)", port, port);
});

module.exports = {
  error,
};
