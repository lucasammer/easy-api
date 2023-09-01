/**
 *  Default API module for the easy api framework.
 *  This file does not get updated.
 *  @module redirect
 *  @description Redirects the user and logs it to a file
 */

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
      error(404, res, true);
      return;
    }

    logmessage += req.query.to;
    fs.appendFileSync("../logs/redirects.log", logmessage + "\n");
    if(!req.query.to || typeof req.query.to != 'string' || !req.query.to.match("^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$")){
      error(400, res);
      return;
    }
    res.send(
      `<p>if you are not redirected click <a href="${req.query.to}">here</a></p><script>window.location = "${req.query.to}"</script>`
    );
  },
};
