import nodemailer, { type SentMessageInfo } from "nodemailer";

class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

const getEmailTemplate = (code: string, type: string) => {
  const templates = {
    register: {
      subject: "Bem-vindo ao KWK Dashboard - Ative sua conta",
      header: "Ativação da sua conta KWK",
      greeting: "Estamos felizes em tê-lo conosco!",
      mainText: "Para completar seu cadastro e começar a usar o KWK Dashboard, utilize o código de verificação abaixo:",
      footerNote: "Caso não tenha solicitado este cadastro, por favor ignore este e-mail."
    },
    login: {
      subject: "Segurança da sua conta KWK - Código de acesso",
      header: "Verificação de login",
      greeting: "Olá de novo!",
      mainText: "Para acessar sua conta com segurança, utilize o código de verificação abaixo:",
      footerNote: "Caso não tenha tentado fazer login, recomendamos que altere sua senha imediatamente."
    }
  };

  const { subject, header, greeting, mainText, footerNote } = templates[type as keyof typeof templates] || templates.register;

  return {
    subject,
    html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f8f9fa; overflow: hidden;">
    <div style="background-color: #09090b; padding: 20px 0; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 0;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align: middle;">
                                <img src="https://i.ibb.co/YT2H5Mmk/dark-logo.png" alt="KWK Logo" width="40"
                                    style="display: block; width: 40px; height: auto; border: 0;">
                            </td>
                            <td style="vertical-align: middle; padding-left: 8px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; line-height: 1.4; font-weight: 600;">KWK Dashboard</h1>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="padding: 30px;">
        <h2 style="color: #09090b; text-align: center; margin-top: 0; font-weight: 600;">${header}</h2>
        
        <p style="font-size: 16px; color: #495057; text-align: center; line-height: 1.6; margin-bottom: 25px;">
            ${greeting} ${mainText}
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #09090b; display: inline-block; padding: 15px 30px; border-radius: 8px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 3px; font-weight: 700;">${code}</h1>
            </div>
            <p style="color: #6c757d; font-size: 13px; margin-top: 10px;">
                Este código expira em 3 minutos
            </p>
        </div>
        
        <div style="background-color: #f1f3f5; padding: 15px; border-radius: 6px; margin-top: 30px;">
            <p style="font-size: 14px; color: #495057; text-align: center; margin: 0; line-height: 1.5;">
                <strong>Dica de segurança:</strong> Nunca compartilhe este código com outras pessoas.
            </p>
        </div>
    </div>
    
    <div style="background-color: #f1f3f5; padding: 20px; text-align: center;">
        <p style="font-size: 13px; color: #6c757d; margin: 0 0 10px 0; line-height: 1.5;">
            ${footerNote}
        </p>
        <p style="font-size: 12px; color: #adb5bd; margin: 10px 0 0 0;">
            © ${new Date().getFullYear()} KWK Dashboard. Todos os direitos reservados.
        </p>
    </div>
</div>
`
  };
};

export const sendVerificationEmail = async (
  email: string,
  code: string,
  type: string = "register"
): Promise<SentMessageInfo> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new EmailError("Credenciais de e-mail não configuradas no ambiente");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
  });

  const { subject, html } = getEmailTemplate(code, type);

  const mailOptions = {
    from: `KWK Dashboard <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
};