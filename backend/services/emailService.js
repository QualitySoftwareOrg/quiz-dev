const nodemailer = require('nodemailer');
const path = require('path');

function getLogoPath() {
  return path.resolve(__dirname, '..', 'assets', 'logo.png');
}

function buildOtpEmailHtml(otp) {
  const year = new Date().getFullYear();
  const logoHtml = `
    <img src="cid:quizdev-logo" width="72" height="72" alt="QuizDev" style="display:block;margin:0 auto 8px;" />
  `;
  return `
    <div style="margin:0;padding:0;background:#f5f2f8;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f2f8;padding:32px 12px;">
        <tr>
          <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background:#ffffff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.12);overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(90deg,#510870,#a228b0);padding:20px 24px;text-align:center;">
                  ${logoHtml}
                  <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.4px;">QuizDev</div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 28px 8px;">
                  <h2 style="margin:0 0 12px;color:#2a2a2a;font-size:22px;text-align:center;">Seu código de verificação</h2>
                  <p style="margin:0 0 20px;color:#4a4a4a;font-size:15px;line-height:1.5;text-align:center;">
                    Use o código abaixo para confirmar seu acesso no QuizDev.
                  </p>
                  <div style="text-align:center;margin:18px 0 22px;">
                    <span style="display:inline-block;background:#f3e8f7;border:1px solid #e2c9ec;color:#5a1770;font-size:32px;font-weight:700;letter-spacing:8px;padding:12px 18px;border-radius:12px;">
                      ${otp}
                    </span>
                  </div>
                  <p style="margin:0;color:#6a6a6a;font-size:14px;line-height:1.5;text-align:center;">
                    Se você não solicitou este código, ignore este e-mail.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 28px 26px;text-align:center;">
                  <div style="height:1px;background:#eee;margin:12px 0 14px;"></div>
                  <p style="margin:0;color:#9a9a9a;font-size:12px;">Equipe QuizDev • ${year}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Seu codigo de verificacao - QuizDev',
    html: buildOtpEmailHtml(otp),
    attachments: [
      {
        filename: 'quizdev-logo.png',
        path: getLogoPath(),
        cid: 'quizdev-logo',
      },
    ],
  });
}

module.exports = sendOtpEmail;
