const { error, authprovider } = require("../server");

module.exports = {
  execute(res, req, headers) {
    if (!req.query.hasOwnProperty("key")) {
      error(400, res);
    }
    let auth = new authprovider.auth0(req.query.key);
    auth.isValid((valid) => {
      res.json(JSON.parse(`{"valid":${valid}}`));
    });
  },
};
