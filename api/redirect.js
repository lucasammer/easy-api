const { error } = require("../server/");
const fs = require("node:fs");

module.exports = {
  execute(res, req, headers) {
    let logmessage = Date.now() + " | " + req.ip + " | ";
    if (headers.hasOwnProperty("referer")) {
      logmessage += "ref: " + headers.referer + " | ";
    }
    if (req.query.hasOwnProperty("from")) {
      logmessage += req.query.from + " -> ";
    } else if (headers.hasOwnProperty("origin")) {
      logmessage += "o: " + headers.origin + " -> ";
    }

    if (!req.query.hasOwnProperty("to")) {
      error(404, res);
      return;
    }

    logmessage += req.query.to;
    fs.appendFileSync("../redirects.log", logmessage);
  },
};
