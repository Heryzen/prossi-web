import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM ?? `Prossi Clinic <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
