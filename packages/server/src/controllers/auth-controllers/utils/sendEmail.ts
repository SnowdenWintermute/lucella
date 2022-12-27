import nodemailer from "nodemailer";

export async function sendEmail(emailAddress: string, textOutput: string, htmlOutput: string) {
  const emailPass = process.env.EMAIL_PASSWORD;
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    name: "lucella.org", // website name
    host: "host2010.HostMonster.com", // note - might can change this after hosted not on local host
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "no-reply@lucella.org", // generated ethereal user
      pass: emailPass, // generated ethereal password
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Lucella" <no-reply@lucella.org>', // sender address
    to: emailAddress, // list of receivers
    subject: "Lucella - Password Reset", // Subject line
    text: textOutput, // plain text body
    html: htmlOutput, // html body
  });
  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
