const sendOtpEmail = require("../services/emailService");

jest.mock("nodemailer");

describe("Serviço de Email", () => {
  test("sendOtpEmail chama transporter.sendMail", async () => {
    const nodemailer = require("nodemailer");
    const mockCreate = nodemailer.createTransport;
    const sendMailMock = jest.fn().mockResolvedValue({ messageId: "ok" });
    mockCreate.mockReturnValue({ sendMail: sendMailMock });

    await sendOtpEmail("a@a.com", "1234");
    expect(sendMailMock).toHaveBeenCalled();
  });
});
