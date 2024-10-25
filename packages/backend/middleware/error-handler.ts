import { NextFunction, Request, Response } from 'express';
import HTTP_STATUSES from '../constants/http-status';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  res
    .status(HTTP_STATUSES.serverError)
    .send({ message: 'There was an issue serving this request' });
};

export default errorHandler;
