var ss = require("./index.js");
// stops console from clogging up with warnings during tests
ss.testable.suppressWarnings(true);
describe("init", function () {
    var fun = ss.init;
    it("Do something", function () {
        expect(true).toBe(true);
    });
});
