module.exports = class StatusCreatedOK extends Error {
  constructor(message) {
    super(message);
    this.name = "StatusCreatedOK";
    this.statusCode = 201;
  }
}