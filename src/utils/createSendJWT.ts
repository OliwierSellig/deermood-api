import { Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const signJWT = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendJWT = (
  data: object | null,
  userId: string,
  statusCode: number,
  res: Response,
) => {
  const token = signJWT(userId);

  const cookieOptions: { expires: Date; secure?: boolean; httpOnly: boolean } =
    {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res
    .status(statusCode)
    .json(
      data ? { status: 'succes', token, data } : { status: 'succes', token },
    );
};
