const { config } = require("dotenv");
const nodemailer = require("nodemailer");
const BaseError = require("../errors/base.error");

class MailService {
  constructor() {
    config();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendMail(email, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Postuz: Activation account link ${link}`,
        html: `<div >
         <h1 style="text-align: center; color: blue;">Click the button bellow if you want to activate your account.</h1>
        <div style="text-align:center">
         <a href="${link}">
           <button style="padding: 16px 32px 16px 32px; color: white; background-color: blue; font-size:24px; cursor:pointer; border:none;">Activate account</button>
         </a>
         </div>
         <h4 style="color: red; text-align: center;">This is available within 15mins.</h4>
        </div>`,
      });
    } catch (error) {
      throw BaseError.BadRequest(`Error with SMTP: ${error}`);
    }
  }
  async sendForgotPass(email, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Postuz: Forgot password`,
        html:  `<div>
        <h1 style="text-align: center; color: blue;">Click the button bellow if you want to recover your account.</h1>
       <div style="text-align:center">
        <a href="${link}">
          <button style="padding: 16px 32px 16px 32px; color: white; background-color: blue; font-size:24px; cursor:pointer; border:none;">Recover account</button>
        </a>
        </div>
         <h4 style="color: red; text-align: center;">This is available within 15mins.</h4>
       </div>`,
      });
    } catch (error) {
      throw BaseError.BadRequest(`Error with SMTP: ${error}`);
    }
  }
}

module.exports = new MailService();
