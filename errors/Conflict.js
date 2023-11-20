module.exports = class Conflict extends Error {
  constructor(message) {
    super(message);
    this.name = "Conflict";
    this.statusCode = 409;
  }
}