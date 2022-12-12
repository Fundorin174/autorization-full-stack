import nodemailer from 'nodemailer';

//This is bad! I know -) I should use .env. IT IS FAKE ACCOUNT
class MailService {
  transporter;
  constructor(){
    this.transporter = nodemailer.createTransport( {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASSWORD,
      },
      logger: true
    })
  }

  async sendActivationMail(to: string, link: string){
    await this.transporter.sendMail({
      from: "proskuryakovrom@yandex.ru",
      to,
      subject: `Активация аккаунта на ${process.env.API_URL}` ,
      text: '',
      html: `
      <div>
        <h1> Для активации перейдите по ссылке</h1>
        <a href='${link}'>${link}</a>
      </div>
      `, 
      })
  }
}

export default new MailService()