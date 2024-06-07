import jwt, { Secret } from 'jsonwebtoken';

export const signJWT = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
