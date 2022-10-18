const mongoose = require("mongoose");
const Joi = require("joi");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    studyMode: {
      type: String,
      trim: true,
    },
    startDates: {
      type: String,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    levelOfStudy: {
      type: String,
      trim: true,
    },
    award: {
      type: String,
      trim: true,
    },
    apprenticeshipStandard: {
      type: Object,
      trim: true,
    },
    apprenticeshipCertificate: {
      type: String,
      trim: true,
    },
    fees: {
      type: String,
      trim: true,
    },
    entryRequirements: {
      type: String,
      trim: true,
    },
    engLangRequirements: {
      type: String,
      trim: true,
    },
    modeOfStudy: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    assessmentMethods: {
      type: String,
      trim: true,
    },
    locations: {
      type: String,
      trim: true,
    },
    video: {
      type: Object,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    EUFunding: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { collation: { locale: "en", strength: 2 } }
);

const Course = mongoose.model("Course", courseSchema);

// function validateUser(course) {

//     const schema = Joi.object({
//       title: Joi.string().required().label(""),
//       location: Joi.string().required().label("Location"),
//       studyMode: Joi.string().required().label("Study mode"),
//       startDates: Joi.string().required().label("Start dates"),
//       institution: Joi.string().required().label("Institution"),
//       levelOfStudy: Joi.string().required().label("Level of study"),
//       award: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//       studyMode: Joi.string().required().label("Study mode"),
//     });

//     return schema.validate(course);
//   }

module.exports.Course = Course;
