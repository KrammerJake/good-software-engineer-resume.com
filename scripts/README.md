# Scripts

### Note: Scripts appear in the order they should be run. Also, the `package.json` defines scripts that combine multiple steps such as `yarn update-resume`.

<br />

### `validateResumeJSON.js`

**Summary**
<br />
Validates the `resume.json` file by verifying checking required keys on the JSON object.

**Description**
<br />
If any validation errors are found, we exit the process and print errors to the console. If the validation succeeds, a success message will be printed to the console.

**Usage**
<br />

```zsh
yarn validate:json
```

<br />

### `generateTexFromJSON.js`

**Summary**
<br />
Generates the `resume.tex` (LaTeX) file from `resume.json` (JSON).

**Description**
<br />
Reads in the `resume-template.txt` (text) file and replaces specific replacement strings (e.g. `%%EMPLOYMENT_SECTION`) with custom LaTeX syntax that conforms to the `mcdowellcv.cls` (LaTeX Document Class File) file.

**Usage**
<br />

```zsh
yarn generate:tex
```
