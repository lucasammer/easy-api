const { error, authprovider } = require("../server");

module.exports = {
  execute(res, req, headers) {
    if (!req.query.hasOwnProperty("key")) {
      error(400, res);
    }
    let auth = new authprovider.auth0(req.query.key);

    let returnObj = {
      valid: false,
      isMaster: false,
      type: "none",
      key: req.query.key,
    };

    auth.isValid((valid) => {
      if (valid) {
        returnObj.valid = true;
        returnObj.type = "auth0";
      } else {
        returnObj.valid = authprovider.defaults.validKey(req.query.key);
        returnObj.isMaster = authprovider.defaults.isMaster(req.query.key);
      }
      res.json(returnObj);
    });
  },
};
