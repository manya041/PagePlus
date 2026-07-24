import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[PagePulse Error]', err);

  const statusCode = err.status || 500;
  const response: ApiErrorResponse = {
    error: err.error || 'Server Error',
    code: err.code || 'SERVER_ERROR',
    message: err.message || 'An unexpected error occurred while processing your request.'
  };

  res.status(statusCode).json(response);
}
