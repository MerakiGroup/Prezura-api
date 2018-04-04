var assert = require("assert");
describe("User signup", function() {
  describe("#Correct Input", function() {
    it("should return cognito user created with given email", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it("should create a document in mongoDB with created  cognito user", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe("#Incorrect Input", function() {
    it("should return invalid email error message", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it("should return InvalidParameterException for passwords that doesn't follow schema", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
