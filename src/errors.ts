/** Base error for CITED Health client. */
export class CitedHealthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CitedHealthError";
  }
}

/** Resource not found (404). */
export class NotFoundError extends CitedHealthError {
  readonly resource: string;
  readonly identifier: string;

  constructor(resource: string, identifier: string) {
    super(`${resource} not found: ${identifier}`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.identifier = identifier;
  }
}

/** Rate limit exceeded (429). */
export class RateLimitError extends CitedHealthError {
  readonly retryAfter: number;

  constructor(retryAfter: number = 0) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}
