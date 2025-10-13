const sendMail = jest.fn(async (opts) =>
  Promise.resolve({ messageId: "mocked" })
);
const createTransport = jest.fn(() => ({ sendMail }));
module.exports = { createTransport };
