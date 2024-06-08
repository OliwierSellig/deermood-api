import { Response } from 'express';
import { signJWT } from './signJWT.js';

export const createSendJWT = (
  data: object | null,
  userId: string,
  statusCode: number,
  res: Response,
) => {
  const token = signJWT(userId);

  res
    .status(statusCode)
    .json(
      data ? { status: 'succes', token, data } : { status: 'succes', token },
    );
};
