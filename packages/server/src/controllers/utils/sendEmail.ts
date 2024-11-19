/* eslint-disable consistent-return */
import sgMail from "@sendgrid/mail";
import { env } from "../../validate-env";

export async function sendEmail(emailAddress: string, subject: string, textOutput: string, htmlOutput: string) {
  // eslint-disable-next-line no-undef
  if (env.SENDGRID_API_KEY) sgMail.setApiKey(env.SENDGRID_API_KEY);
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
