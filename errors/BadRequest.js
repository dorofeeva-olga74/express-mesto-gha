const { HTTP_STATUS_BAD_REQUEST } = require("http2").constants;

module.exports = class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;//400;
  }
}