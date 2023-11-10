const { HTTP_STATUS_INTERNAL_SERVER } = require("http2").constants;

module.exports = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER;//500;
  }
}