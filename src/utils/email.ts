import nodemailer, { TransportOptions } from 'nodemailer';

export const sendEmail = async (options: {
  email: string;
  subject: string;
  text: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);

  const mailOptions = {
    from: 'Oliwier Sellig <oliwier@deermood.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
