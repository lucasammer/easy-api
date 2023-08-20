/**
 *  Default API module for the easy api framework.
 *  This file does not get updated.
 *  @module resetKeys
 *  @description resets the keys for the api to the default keys specified in server.json, can only be done by the master.
 */

const { error } = require("../server/");
const { ResetKeysTo, keyfile } = require("../config/server.json");
const fs = require("node:fs");
const authprovider = require("../server/authprovider");

module.exports = {
  execute(res, req, headers) {
    let keys = fs.readFileSync(keyfile);
    keys = JSON.parse(keys);
    if (
      !req.query.hasOwnProperty("key") || // if the key is not in the request URL
      !authprovider.defaults.isMaster(req.query.key) // if the key is not valid and the master key
    ) {
      error(403, res); // if its not the master key, return 403 forbidden
      return;
    }
    try {
      fs.writeFileSync(keyfile, ResetKeysTo); // try to write the default to the keyfile
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
