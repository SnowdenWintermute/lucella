/* eslint-disable consistent-return */
import sgMail from "@sendgrid/mail";

export async function sendEmail(emailAddress: string, subject: string, textOutput: string, htmlOutput: string) {
  if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  else return console.error("No sendgrid api key was found");
  const msg = {
    to: emailAddress, // Change to your recipient
    from: "no-reply@battleschool.io", // Change to your verified sender
    subject,
    text: textOutput,
    html: htmlOutput,
  };
  await sgMail.send(msg);
  console.log(`Email sent to ${emailAddress}`);
}
