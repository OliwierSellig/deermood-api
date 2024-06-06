import bcrypt from 'bcrypt';

export const checkPasswordCorrect = async (
  candidatePassword: string,
  dbPassword: string,
) => {
  return await bcrypt.compare(candidatePassword, dbPassword);
};
