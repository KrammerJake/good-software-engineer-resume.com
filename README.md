# Purpose

I wanted a simple solution to keep [a personal website](https://good-software-engineer-resume.com) and [PDF](https://good-software-engineer-resume.com/resume.pdf) updated using a single `resume.json` file.

# Acknowledgements

Both the website and generated PDF are based on Gayle Laakmann McDowell's [awesome resume format](https://www.careercup.com/resume). You can also download a [Microsoft Word version](https://careercup.com/static_html/Gayle_McDowell_CareerCup_Sample_Resume.doc) if that is all you're looking for.

**Website**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses [Chakra-UI](https://chakra-ui.com/)'s component library. I highly recommend both tools for React projects. My site is deployed using [Netlify](https://www.netlify.com/).

**LaTeX to PDF Resume Generation**

Huge shout-out to the [dnl-blkv/mcdowell-cv](https://github.com/dnl-blkv/mcdowell-cv) repo for laying the groundwork for
LaTeX to PDF resume generation. This project would have taken a lot longer if I had to learn LaTeX from scratch. THANK YOU!

# Overview

### Website

1. Ensure [yarn](https://yarnpkg.com/getting-started/install) and [netlify-cli](https://docs.netlify.com/cli/get-started/#installation) are installed globally. If you're planning on deploying your site with [Netlify](https://www.netlify.com/) that is... If you go with something else, be sure to update the `yarn deploy-dev` and `yarn deploy-prod` scripts and remove any mention of "netlify" from the project.).

```zsh
npm install -g yarn
npm install -g netlify-cli
```

2. Clone and cd into this repository

```zsh
git clone https://github.com/KrammerJake/good-software-engineer-resume my_awesome_resume
cd my_awesome_resume
```

3. Run the website in dev mode

```zsh
yarn && yarn start
```

#### KeyBindings

| Key Binding  | Description            |
| ------------ | ---------------------- |
| <kbd>T</kbd> | Toggle light/dark mode |

### PDF Generation

1. Make sure [lualatex](http://www.luatex.org/download.html) is installed on your machine and is available at `~/bin/lualatex`. I installed it on my Mac by downloading [MiKTeX](https://miktex.org/download). You may be prompted to install various LaTeX libraries before the PDF will successfully generate.
2. Update `/src/resume.json` to include your info.
3. Once you're finished updating `resume.json`, run `yarn validate:json` to ensure there are no validation errors.
4. If the JSON is valid, you can now generate the `resume.tex` file by running `generate:tex`.
5. Once the `resume.tex` file has been created, you can now run `generate:pdf` to create a `resume.pdf` file that will be saved to the `/public` directory. This will make it accessible via `your-site.com/resume.pdf` once you deploy it. NOTE: The `generate:pdf` command relies on `lualatex` existing at `~/bin/lualatex`. Be sure to update the `generate:pdf` command if your `lualatex` exists at a different location.

# Scripts

You can view the full list of the available scripts from your terminal by running `yarn scripts` in the project directory.

NOTE: The `yarn scripts` command requires [jq](https://stedolan.github.io/jq/) to be installed.

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "generate:tex": "node ./scripts/validateResumeJSON.js && node ./scripts/generateTexFromJSON.js",
    "generate:pdf": "~/bin/lualatex --output-directory=./public/ --aux-directory=./pdf_generator/ ./pdf_generator/resume.tex",
    "update-resume": "yarn generate:tex && yarn generate:pdf",
    "deploy-dev": "yarn build && netlify deploy --dir=build",
    "deploy-prod": "yarn build && netlify deploy --dir=build --prod",
    "yellowlight": "yarn update-resume && yarn deploy-dev",
    "greenlight": "yarn update-resume && yarn deploy-prod",
    "validate:json": "node ./scripts/validateResumeJSON.js",
    "scripts": "cat package.json | jq .scripts"
  }
```

# Contributing

Any and all contributions are welcome!

// TODO: Add a CONTRIBUTING.md specifying steps to contribute to the project

Since I have only tested this project on Mac, it would be great if others are able to test out the project on additional platforms and report any setup/documentation issues you encounter.

Additionally, the `resume.json` format could probably be more flexible to allow for additional/optional sections rather than the arbitrary keys I chose and am validating against in `validateResumeJSON.js`.
