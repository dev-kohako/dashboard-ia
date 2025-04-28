import nodemailer, { type SentMessageInfo } from "nodemailer";

class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<SentMessageInfo> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new EmailError("Credenciais de e-mail não configuradas no ambiente");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
    secure: true,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmação de E-mail",
    html: `
<div
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px; padding: 0; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #e4e4e7; overflow: hidden;"
    class="container">
    <div style="text-align: center; padding: 20px 0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle;">
                  <img src="https://i.ibb.co/kgPSFNG6/logo.png" alt="KWK Logo" width="40"
                    style="display: block; width: 40px; height: auto; border: 0;">
                </td>
                <td style="vertical-align: middle; padding-left: 8px;">
                  <h1 style="color: #09090b; margin: 0; font-size: 24px; line-height: 1.4; font-weight: 600;">KWK -
                    Dashboard</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    <div style="margin: 0; height: 1px; width: 100%; background-color: #09090b10;"></div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; color: #09090b90; text-align: center; line-height: 1.5; margin: 0 0 20px 0;">
        Olá! Estamos felizes em tê-lo conosco. Para ativar sua conta no <strong>KWK Dashboard</strong>,<br>
        utilize o código de verificação abaixo:
      </p>
      <div style="text-align: center; padding: 10px 0 10px 0;">
        <h3 style="color: #09090b; margin: 0 0 10px 0; font-size: 22px; line-height: 1.4; font-weight: 600;">Seu Código de Ativação</h3>
        <div
          style="background-color: #09090b; display: inline-block; padding: 10px 20px; border-radius: 8px; margin: 10px 0;">
          <h1
            style="color: #e4e4e7; margin: 0; padding: 0; font-size: 32px; line-height: 1.4; font-weight: 700; letter-spacing: 2px;">
            ${code}</h1>
        </div>
        <p style="color: #09090b50; margin: 0; font-size: 12px; line-height: 1.4;">
          (Esse link irá expirar em 3 minutos após o envio.)
        </p>
      </div>
      <p style="font-size: 14px; color: #09090b90; text-align: center; line-height: 1.5; margin: 20px 0 0 0;">
        Caso não tenha solicitado esta verificação, por favor ignore este e-mail.<br>
        Sua segurança é importante para nós.
      </p>
    </div>
    <div style="margin: 0; height: 1px; width: 100%; background-color: #09090b10;"></div>
    <div style="text-align: center; padding: 16px 0;">
      <p style="font-size: 12px; color: #09090b50; text-align: center; margin: 0; line-height: 1.4;">
        © ${new Date().getFullYear()} KWK. Todos os direitos reservados.
      </p>
    </div>
  </div>
`,
  };

  return await transporter.sendMail(mailOptions);
};
