export class ApiError extends Error {
  constructor(message, status = 500, code = "INTERNAL_ERROR") {
    super(message);

    this.status = status;
    this.code = code;
  }
}