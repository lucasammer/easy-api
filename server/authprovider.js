const fs = require("node:fs");
const keyfile = require("../config/server.json").keyfile;

/**
 * Providing authentication functions for the easy api
 * @module authprovider
 */

class auth0 {
  constructor(key) {
    if (!require("../config/server.json").AcceptsAuth0) {
      throw new Error("API doesn't accept auth0!");
    }
    // Key is a base64 Hash of the user id
    this.userid = Buffer.from(key, "base64").toString("utf-8");
    // "W1Rlc3RpbmcgU3RyaW5nXQ==" is "[Testing String]"
    this.valid = undefined;
  }
  /**
   * Check if a key a user provided is a valid key for the auth0 account set in the AuthFile
   * @function isValid
   */
  async isValid(force = false) {
    if (!force && typeof this.valid == Boolean) {
      return this.valid;
    }
    const axios = require("axios");
    const { AuthFile } = require("../config/server.json");
    const { access_token, auth_domain } = require(AuthFile);
    const url = `https://${auth_domain}/api/v2/users/${this.userid}`;
    const headers = { Authorization: `Bearer ${access_token}` };
    axios
      .get(url, { headers })
      .then((response) => {
        const userData = response.data;
        this.valid = true;
      })
      .catch((e) => {
        this.valid = false;
      });
    return this.valid;
  }
}

/**
 * To get auth0 access token
 * ```
 * curl -X POST ^
     "https://YOUR_AUTH0_DOMAIN/oauth/token" ^
     -H "Content-Type: application/json" ^
     -d "{\"grant_type\":\"client_credentials\",\"client_id\":\"YOUR_CLIENT_ID\",\"client_secret\":\"YOUR_CLIENT_SECRET\",\"audience\":\"https://YOUR_API_IDENTIFIER\"}"
     ```
*/

const validKey = (key) => {
  let keys = fs.readFileSync(keyfile);
  keys = JSON.parse(keys);
  return keys.hasOwnProperty(key);
};

const isMaster = (key) => {
  if (validKey(key)) {
    let keys = fs.readFileSync(keyfile);
    keys = JSON.parse(keys);
    return keys[key];
  }
  return false;
};

module.exports = {
  auth0,
  defaults: { validKey, isMaster },
};
