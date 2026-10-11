import { AppError } from "./AppError";

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors: FieldError[],
  ) {
    super(400, message);
    this.name = "ValidationError";
  }
}
