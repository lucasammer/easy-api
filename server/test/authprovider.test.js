const authprovider = require("../authprovider");

describe("Testing the authprovider", () => {
  it("should throw an error for invalid URL", (done) => {
    const auth = new authprovider.auth0("e");
    auth.isValid((valid) => {
      expect(valid.toBe(false)); // Should be false in case of an error
      done();
    });
  });

  it("Should verify the default keys", (done) => {
    expect(authprovider.defaults.validKey("e")).toBe(false); // Not a key in the default keyset
    expect(authprovider.defaults.isMaster("--MasterKey--")).toBe(true); // Defualt master key
    done();
  });
});
