import { Request, Response } from "express";
import userModel from "../../models/user.model";
import nodemailer from "nodemailer";
import { signJwt } from "../../utils/jwt";

export default async function passwordResetEmailRequestHandler(req: Request, res: Response) {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(500).json({ error: "No user found with that email" });
    // create their token to be put in link
    const payload = {
      user: {
        id: user._id,
      },
    };
    const password_reset_token = signJwt(payload, process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY!, {
      expiresIn: `${parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN!) / 1000 / 60}m`,
    });

    const rootUrl =
      process.env.NODE_ENV === "development" ? process.env.EMAIL_ROOT_URL_DEV : process.env.EMAIL_ROOT_URL;
    const emailPass = process.env.EMAIL_PASSWORD;

    const output = `<p>Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password.</p><p><a href="http${
      process.env.NODE_ENV === "production" ? "s" : ""
    }://${rootUrl}/password-reset/${password_reset_token}" target="_blank">http${
      process.env.NODE_ENV === "production" ? "s" : ""
    }://${rootUrl}/password-reset/${password_reset_token}</a></p>`;
    const textOutput = `Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password: http${
      process.env.NODE_ENV === "production" ? "s" : ""
    }://${rootUrl}/password-reset/${password_reset_token}`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
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
    let info = await transporter.sendMail({
      from: '"Lucella" <no-reply@lucella.org>', // sender address
      to: req.body.email, // list of receivers
      subject: "Lucella - Password Reset", // Subject line
      text: textOutput, // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      msg: "An email has been sent with a link to reset your password.",
    });
  } catch (error: any) {
    console.log(error, "error sending email");
    res.status(500).send("Server error");
  }
}