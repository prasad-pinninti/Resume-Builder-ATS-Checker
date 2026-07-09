import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    let transporter;

    // Check if user has SMTP settings configured
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: create Ethereal test account on the fly
      console.log("No SMTP credentials configured. Creating temporary Ethereal Mail test account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL || '"AI Resume Builder" <no-reply@ai-resume-builder.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to} (MessageID: ${info.messageId})`);

    // If using Ethereal test account, log the URL to view the email
    if (!process.env.SMTP_HOST) {
      console.log("------------------------------------------------------------------");
      console.log("📨 ETHEREAL EMAIL DETECTED (Local Development Preview)");
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log("------------------------------------------------------------------");
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
