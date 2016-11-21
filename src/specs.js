var ss = require('../dist/index.js');


// stops console from clogging up with warnings during tests
ss.testable.suppressWarnings(true);

describe("clear", function () {
    var fun = ss.clear;
    it("Do something", function () {
        expect(true).toBe(true);
    });
});
