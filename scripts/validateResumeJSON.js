const resume = require("../src/resume.json");
const chalk = require("chalk");
const has = require("lodash.has");

const greenText = chalk.rgb(30, 200, 30);
const redText = chalk.rgb(200, 30, 30);

const REQUIRED_TOP_LEVEL_FIELDS = [
  "downloadPDFLink",
  "personalInfo",
  "degrees",
  "jobs",
  "awards",
];

const REQUIRED_PERSONAL_INFO_FIELDS = [
  "personalInfo.name",
  "personalInfo.email",
  "personalInfo.phone",
  "personalInfo.social",
];

const REQUIRED_DEGREE_FIELDS = [
  "id",
  "schoolName",
  "title",
  "enrollmentDateRange.startDateStr",
  "description",
];

const REQUIRED_JOB_FIELDS = [
  "id",
  "role",
  "companyName",
  "employmentDateRange.startDateStr",
  "description",
  "technologies",
];

const REQUIRED_REWARD_FIELDS = [
  "columnHeader1",
  "columnHeader2",
  "columnHeader3",
  "description",
];

let hadErrors = false;
const logError = (errMsg) => {
  const printRedText = (text) => console.log(redText(text));
  if (!hadErrors) {
    printRedText(chalk.bold("JSON validation errors detected in resume.json!"));
  }
  printRedText(errMsg);
  hadErrors = true;
};

const validateRequiredFields = (requiredFields) => {
  const missingFields = [];
  for (let i = 0; i < requiredFields.length; i++) {
    const requiredField = requiredFields[i];
    if (!has(resume, requiredField)) {
      missingFields.push(requiredField);
    }
  }

  if (missingFields.length) {
    const errMsg = `Missing required field(s): ${chalk.bold(
      missingFields.join(", ")
    )}`;
    logError(errMsg);
  }
};

const validateSocialFieldsIfNecessary = () => {
  if (resume.personalInfo.social) {
    const socialKeys = Object.keys(resume.personalInfo.social);
    const requiredSocialFields = [];
    for (let i = 0; i < socialKeys.length; i++) {
      const socialKey = socialKeys[i];
      const socialKeyPrefix = `personalInfo.social.${socialKey}`;
      requiredSocialFields.push(
        `${socialKeyPrefix}.url`,
        `${socialKeyPrefix}.username`
      );
    }
    validateRequiredFields(requiredSocialFields);
  }
};

const validateDegreeFieldsIfNecessary = () => {
  if (resume.degrees) {
    const degreeKeys = Object.keys(resume.degrees);
    let requiredDegreeFields = [];
    for (let i = 0; i < degreeKeys.length; i++) {
      const degreeKey = degreeKeys[i];
      const degreeKeyPrefix = `degrees.${degreeKey}`;
      requiredDegreeFields = [
        ...requiredDegreeFields,
        ...REQUIRED_DEGREE_FIELDS.map((field) => `${degreeKeyPrefix}.${field}`),
      ];
    }
    validateRequiredFields(requiredDegreeFields);
  }
};

const validateJobFieldsIfNecessary = () => {
  if (resume.jobs) {
    const jobKeys = Object.keys(resume.jobs);
    let requiredJobFields = [];
    for (let i = 0; i < jobKeys.length; i++) {
      const jobKey = jobKeys[i];
      const jobKeyPrefix = `jobs.${jobKey}`;
      requiredJobFields = [
        ...requiredJobFields,
        ...REQUIRED_JOB_FIELDS.map((field) => `${jobKeyPrefix}.${field}`),
      ];
    }
    validateRequiredFields(requiredJobFields);
  }
};

const validateAwardFieldsIfNecessary = () => {
  if (resume.awards) {
    const awardKeys = Object.keys(resume.awards);
    let requiredAwardFields = [];
    for (let i = 0; i < awardKeys.length; i++) {
      const awardKey = awardKeys[i];
      const awardKeyPrefix = `awards.${awardKey}`;
      requiredAwardFields = [
        ...requiredAwardFields,
        ...REQUIRED_REWARD_FIELDS.map((field) => `${awardKeyPrefix}.${field}`),
      ];
    }
    validateRequiredFields(requiredAwardFields);
  }
};

const main = () => {
  validateRequiredFields(REQUIRED_TOP_LEVEL_FIELDS);
  validateRequiredFields(REQUIRED_PERSONAL_INFO_FIELDS);
  validateSocialFieldsIfNecessary();
  validateDegreeFieldsIfNecessary();
  validateJobFieldsIfNecessary();
  validateAwardFieldsIfNecessary();
};

main();

// Allow all validations to run but abort script if we encountered any erros along the way.
if (hadErrors) {
  process.exit(1);
} else {
  console.log(greenText("resume.json successfully validated!"));
}
