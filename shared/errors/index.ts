export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
    this.name = "NotFound";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
    this.name = "Conflict";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
    this.name = "BadRequest";
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.name, message: error.message },
      { status: error.statusCode },
    );
  }

  // For unexpected errors, log them and return a generic message
  console.error("Unexpected error:", error);
  //@ts-ignore
  return Response.json({ error: "Internal Server Error", message : error.message }, { status: 500 });
}
