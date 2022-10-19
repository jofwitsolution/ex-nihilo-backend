const config = require("config");
const { Email, validate } = require("../models/emailModel");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const user = config.get("user");
const pass = config.get("pass");
const clientId = config.get("clientId");
const clientSecret = config.get("clientSecret");
const refreshToken = config.get("refreshToken");
const redirecturi = config.get("redirecturi");

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirecturi
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

// @desc Email
// @route POST /api/email
// @access Private/Admin
const sendEmail = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { to: emailList, subject, text } = req.body;

  let mailOptions = {
    from: "Didomi Company Limited <didomiconsortium@gmail.com>",
    to: emailList,
    subject: subject,
    text: text,
  };

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: user,
      pass: pass,
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  transporter.sendMail(mailOptions, async function (err, data) {
    if (err) {
      res.status(400);
      throw new Error("Problem sending mail");
    } else {
      let email = await Email.create({
        to: emailList,
        subject,
        text,
        messageId: data.messageId,
      });

      if (email) {
        res.json({
          message: "Email sent successfully",
        });
      } else {
        res.status(400);
        throw new Error("Bad email data");
      }
    }
  });
};

// @desc Receive Email
// @route POST /api/email/receive-email
// @access Private/Admin
const receiveEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const text = `
    Sender name: ${name} \n
    Sender email: ${email} \n
    \n
    ${message}`;

  // console.log(text);

  let mailOptions = {
    from: `${name} <didomiconsortium@gmail.com>`,
    to: "didomiconsortium@gmail.com",
    subject: subject,
    text: text,
  };

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: user,
      pass: pass,
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.status(400);
      // console.log(err);
      throw new Error("Problem sending mail");
    } else {
      res.json({
        message: "Email sent successfully",
      });
    }
  });

  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error);
  //     res.send(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //     res.send(success);
  //   }
  // });
};

module.exports.sendEmail = sendEmail;
module.exports.receiveEmail = receiveEmail;
