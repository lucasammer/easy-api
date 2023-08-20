const authprovider = require("../authprovider");

describe("Testing the authprovider", () => {
  it("should return false for an invalid user", (done) => {
    const auth = new authprovider.auth0("e");
    auth.isValid((valid) => {
      expect(valid).toBe(false);
      done();
    });
  });
});
