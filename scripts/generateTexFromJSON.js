const resume = require("../src/resume.json");
const fs = require("fs");

// Configuration options
const USE_TABS = true;

const RESUME_TEMPLATE_PATH = `${__dirname}/../pdf_generator/resume-template.txt`;
const RESUME_OUTPUT_PATH = `${__dirname}/../pdf_generator/resume.tex`;

const REPLACEMENT_STRINGS = [
  "%%PERSONAL_INFO_SECTION",
  "%%EMPLOYMENT_SECTION",
  "%%EDUCATION_SECTION",
  "%%AWARDS_SECTION",
];

const personalInfoSection = `
\\name{${resume.personalInfo.name}}
\\address{${resume.personalInfo.email} \\linebreak ${resume.personalInfo.phone}}
\\contacts{\\faGithub \\hspace{0.05cm} ${resume.personalInfo.social.github.username} \\linebreak \\faLinkedin \\hspace{0.05cm} ${resume.personalInfo.social.linkedin.username}}
`;

const getEmploymentSection = () => {
  const jobValues = Object.values(resume.jobs);
  return `\\begin{cvsection}{Employment}
    ${jobValues
      .map((job) => {
        return `
    \\begin{cvsubsection}{${job.role}}{${job.companyName}}{${
          job.employmentDateRange.startDateStr
        } - ${job.employmentDateRange.endDateStr}}
      \\begin{itemize}
        ${job.description
          .map((bulletPoint) => `\\item ${bulletPoint}\n        `)
          .join("")
          .trimEnd()}
        \\item \\textbf{Technologies: \\emph{${job.technologies.join(", ")}}}
      \\end{itemize}
    \\end{cvsubsection}
`;
      })
      .join("")
      .trim()}
  \\end{cvsection}
`;
};

const getEducationSection = () => {
  const degreeValues = Object.values(resume.degrees);
  return `\\begin{cvsection}{Education}
    ${degreeValues
      .map((degree) => {
        return `
    \\begin{cvsubsection}{${degree.title}}{${degree.schoolName}}{${
          degree.enrollmentDateRange.startDateStr
        } - ${degree.enrollmentDateRange.endDateStr}}
      \\begin{itemize}
        ${degree.description
          .map((bulletPoint) => `\\item ${bulletPoint}\n        `)
          .join("")
          .trimEnd()}
      \\end{itemize}
    \\end{cvsubsection}
      `;
      })
      .join("")
      .trim()}
  \\end{cvsection}
`;
};

const getAwardsSection = () => {
  const awardValues = Object.values(resume.awards);
  return `\\begin{cvsection}{Awards}
    ${awardValues
      .map((award) => {
        return `
    \\begin{cvsubsection}{${award.columnHeader1}}{${award.columnHeader2}}{${
          award.columnHeader3
        }}
      \\begin{itemize}
        ${award.description
          .map((bulletPoint) => `\\item ${bulletPoint}\n        `)
          .join("")
          .trimEnd()}
      \\end{itemize}
    \\end{cvsubsection}
      `;
      })
      .join("")
      .trim()}
  \\end{cvsection}
`;
};

const contentReplacementMap = {
  "%%PERSONAL_INFO_SECTION": personalInfoSection.trimStart(),
  "%%EMPLOYMENT_SECTION": getEmploymentSection(),
  "%%EDUCATION_SECTION": getEducationSection(),
  "%%AWARDS_SECTION": getAwardsSection(),
};

let texFileTemplateContents = fs.readFileSync(RESUME_TEMPLATE_PATH, "utf-8");
for (let i = 0; i < REPLACEMENT_STRINGS.length; i++) {
  const replacementStr = REPLACEMENT_STRINGS[i];
  const replacementValue = contentReplacementMap[replacementStr].trimEnd();
  texFileTemplateContents = texFileTemplateContents.replace(
    replacementStr,
    replacementValue
  );
}

// eslint-disable-next-line no-useless-escape
texFileTemplateContents = texFileTemplateContents.replace(/C\#/g, "C\\#");
const finalTexFileContents = USE_TABS
  ? texFileTemplateContents.replace(/ {2}/g, "\t")
  : texFileTemplateContents;

const autoGeneratedWarning = `
% IMPORTANT: DO NOT EDIT THIS FILE MANUALLY
% This file is generated using the \`generate:tex\` script found in the package.json.
`.trimStart();

fs.writeFileSync(
  RESUME_OUTPUT_PATH,
  autoGeneratedWarning + finalTexFileContents,
  {
    encoding: "utf-8",
  }
);