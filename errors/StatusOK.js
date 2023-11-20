module.exports = class StatusOK extends Error {
  constructor(message) {
    super(message);
    this.name = "StatusOK";
    this.statusCode = 200;
  }
}