const express = require("express");
const fs = require("node:fs");
const app = express();
const cors = require("cors");

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
  ResetKeysTo,
  corsOrigin,
  logRequests,
  logTrafficToConsole,
  logFilePath,
} = require("../config/server.json");

app.use(
  cors({
    origin: corsOrigin,
  })
);

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
  if (logRequests || logTrafficToConsole) {
    const ip = req.ip;
    const path = req.path;
    const method = req.method;
    const time = new Date().toISOString();

    const writeString = `[${time}] ${ip}  ${method}  /`;
    if (logTrafficToConsole) console.log(writeString);
    if (logRequests) fs.appendFileSync(logFilePath, writeString + "\n");
  }
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

const update = () => {
  // TODO Check for updates
  // TODO do the update
};
update();

if (!fs.existsSync("../logs/")) {
  fs.mkdirSync("../logs/");
}
if (logRequests || logTrafficToConsole) {
  fs.appendFileSync(
    logFilePath,
    `\n\n----------\nServer Started\n${new Date().toISOString()}\n----------\n`
  );
  console.log("logging all traffic");
  app.use((req, res, next) => {
    const ip = req.ip;
    const path = req.path;
    const method = req.method;
    const time = new Date().toISOString();

    const writeString = `[${time}] ${ip}  ${method}  ${path}`;
    if (logTrafficToConsole) console.log(writeString);
    if (logRequests) fs.appendFileSync(logFilePath, writeString + "\n");
    next();
  });
}

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
      keys = JSON.parse(keys);
      if (keys.hasOwnProperty(buffer.toString(keyencoding))) {
        error(403, res);
        return;
      }
      keys =
        JSON.stringify(keys).replace("}", "") +
        ',"' +
        buffer.toString(keyencoding) +
        '":false}';

      fs.writeFileSync(keyfile, keys);
      res.json(
        JSON.parse(`{"created": true,"key":"${buffer.toString(keyencoding)}"}`)
      );
    } catch (e) {
      console.warn(e);
      error(501, res, true, e);
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

const authprovider = require("./authprovider");
module.exports = {
  error,
  authprovider,
};
