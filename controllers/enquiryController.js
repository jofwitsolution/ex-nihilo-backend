const nodemailer = require("nodemailer");

const user = process.env.SMTP_MAIL;
const pass = process.env.SMTP_PASSWORD;
const port = process.env.SMTP_PORT;
const host = process.env.SMTP_HOST;

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
    from: `Ex-Nihilo Care Services and Consultancy <exnihilocareservices@gmail.com>`,
    to: "info@ex-nihilocareservicesandconsultancy.com",

    subject: "General Enquiry",
    text: text,
  };

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
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
    from: `Ex-Nihilo Care Services and Consultancy <exnihilocareservices@gmail.com>`,
    to: "info@ex-nihilocareservicesandconsultancy.com",

    subject: "Course Enquiry",
    text: text,
  };

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
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
