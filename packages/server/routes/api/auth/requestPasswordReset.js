const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // get the user trying to reset password
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return;
    }
    // create their token to be put in link
    const payload = {
      user: {
        id: user.id
      }
    };
    const passwordResetToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600
      },
      { algorithm: "RS256" }
    );

    const rootUrl = "localhost:3000/";
    const emailPass = process.env.EMAIL_PASSWORD;

    const output = `<p>Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password.</p><p><a href="https://${rootUrl}password-reset/${passwordResetToken}" target="_blank">https://${rootUrl}password-reset/${passwordResetToken}</a></p>`;
    const textOutput = `Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password: https://${rootUrl}password-reset/${passwordResetToken}`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      name: "lucella.org", // website name
      host: "host2010.HostMonster.com", // note - might can change this after hosted not on local host
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "no-reply@lucella.org", // generated ethereal user
        pass: emailPass // generated ethereal password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Lucella" <no-reply@lucella.org>', // sender address
      to: req.body.email, // list of receivers
      subject: "Lucella - Password Reset", // Subject line
      text: textOutput, // plain text body
      html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      msg: "An email has been sent with a link to reset your password."
    });
  } catch (error) {
    console.log("error sending email");
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
