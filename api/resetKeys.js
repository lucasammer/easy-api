const { error } = require("../server/index");
const { ResetKeysTo, keyfile } = require("../config/server.json");
const fs = require("node:fs");

module.exports = {
  execute(res, req, headers) {
    let keys = fs.readFileSync(keyfile);
    keys = JSON.parse(keys);
    if (
      !req.query.hasOwnProperty("key") ||
      !keys.hasOwnProperty(req.query.key) ||
      !keys[req.query.key]
    ) {
      error(403, res);
      return;
    }
    try {
      fs.writeFileSync(keyfile, ResetKeysTo);
    } catch (e) {
      error(501, res);
      console.warn(e);
      return;
    } finally {
      res.send(
        `<h1>succes!</h1><hr><h3>Keys have been reset to: ${ResetKeysTo}</h3><script>alert("Keys have been reset succesfully!")</script>`
      );
      return;
    }
  },
};
