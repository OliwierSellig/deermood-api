import nodemailer, { TransportOptions } from 'nodemailer';
import path from 'path';
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from 'nodemailer-express-handlebars';
import handlebars from 'handlebars';
import fs from 'fs';

export class Email {
  public to: string;
  public name: string;
  public from: string;
  public url: string;

  constructor(user: { name: string; email: string }, url: string) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Deermood Support <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use Sendgrid
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as TransportOptions);
  }

  async compileTemplate(
    templateName: string,
    context: object,
  ): Promise<string> {
    const filePath = `./src/views/${templateName}.handlebars`;

    const templateSource = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  async send(template: string, subject: string, additionalContext?: object) {
    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./src/views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./src/views'),
      extName: '.handlebars',
    };

    const transporter = this.newTransport();

    transporter.use(
      'compile',
      hbs(handlebarOptions as NodemailerExpressHandlebarsOptions),
    );

    const context = {
      name: this.name,
      email: this.to,
      url: this.url,
      subject,
      ...additionalContext,
    };
    const text = await this.compileTemplate(template, context);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      template,
      text,
      context,
    };

    console.log(transporter);

    await transporter.sendMail(mailOptions);
  }

  async sendWelcomeAdmin(password: string) {
    await this.send('welcome', 'Welcome to the Deermood Admin Panel!', {
      password,
    });
  }

  async sendAdminPasswordReset() {
    await this.send(
      'adminPasswordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}
