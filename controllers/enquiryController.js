const config = require("config");
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

// @desc Receive General Enquiry
// @route POST /api/enquiries/general
// @access Public
const receiveGeneralEnquiry = async (req, res) => {
  const {
    fullName,
    email,
    telephone,
    currentLocation,
    studentType,
    additionalNotes,
  } = req.body;

  //   console.log(req.body);

  const text = `
      Sender Info
      Name: ${fullName} \n
      Email: ${email} \n
      Telephone: ${telephone} \n
      Location: ${currentLocation} \n
      Student type: ${studentType} \n
      \n
      ${additionalNotes} \n
      \n
      Ex-Nihilo Care Services and Consultancy`;

  // console.log(text);

  let mailOptions = {
    from: `Ex-Nihilo <exnihilocareservices@gmail.com>`,
    to: "exnihilocareservices@gmail.com",
    subject: "General Enquiry",
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
      throw new Error("Problem sending enquiry");
    } else {
      res.json({
        message: "Enquiry sent successfully. We will contact you soon.",
      });
    }
  });
};

// @desc Receive Course Enquiry
// @route POST /api/enquiries/course
// @access Public
const receiveCourseEnquiry = async (req, res) => {
  const {
    fullName,
    email,
    telephone,
    city,
    country,
    course,
    startTime,
    additionalNotes,
  } = req.body;

  //   console.log(req.body);

  const text = `
      Sender Info
      Name: ${fullName} \n
      Email: ${email} \n
      Telephone: ${telephone} \n
      City: ${city} \n
      Country/Region: ${country} \n
      Course title: ${course} \n
      Start time: ${startTime} \n
      \n
      ${additionalNotes}\n
      \n
      Ex-Nihilo Care Services and Consultancy`;

  // console.log(text);

  let mailOptions = {
    from: `Ex-Nihilo <exnihilocareservices@gmail.com>`,
    to: "exnihilocareservices@gmail.com",
    subject: "Course Enquiry",
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
      throw new Error("Problem sending enquiry");
    } else {
      res.json({
        message: "Enquiry sent successfully. We will contact you soon.",
      });
    }
  });
};

module.exports.receiveGeneralEnquiry = receiveGeneralEnquiry;
module.exports.receiveCourseEnquiry = receiveCourseEnquiry;
