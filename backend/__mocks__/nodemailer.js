// Mock do nodemailer para evitar envio de emails reais nos testes
const sendMail = jest.fn(async (opts) =>
  Promise.resolve({ messageId: "mocked" })
);
const createTransport = jest.fn(() => ({ sendMail }));
module.exports = { createTransport };
