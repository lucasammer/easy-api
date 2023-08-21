let app;
const axios = require("axios");

describe("Testing server", () => {
  it("starts up", (done) => {
    let logs = [];
    const logSpy = jest
      .spyOn(global.console, "log")
      .mockImplementation((msg) => {
        logs.push(msg);
      });

    app = require("../index");

    expect(logs).toContain("logging all traffic"); // Enabled by default
    logSpy.mockRestore();
    app = null;
    done();
  });

  it("returns things", (done) => {
    app = require("../index");
    axios.get("http://localhost:8080").then((response) => {
      expect(response.status).toBe(200);
      app.server.close();
      done();
    });
  });
});
