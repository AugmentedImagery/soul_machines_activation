# Soul Machines UI

This template succeeds the previous [react-template](https://github.com/soulmachines/react-template). This is re-write is based on [create-react-app](https://github.com/facebook/create-react-app) and is designed to provide a simple and familiar developer experience.

This template contains a functional example of how the user flow and interaction with the Digital Person should work in an expo setting where multiple people can walk up and interact with the avatar, and likley require styling chanages to suit branding requirements. This specific UI is meant to be paired with an IPAD/Screen that explains the user flow. The user flow goes as follows - press any key to begin, talk or type to AI for 3 minutes(cutoff) or press esc to exit, provide feedback, loop back to landing page.  

## Setup

In order to run this application, you'll either need an API key or a token server. Most projects will use an API key--token servers are only necessary when interfacing with a non-native NLP through a orchestration server.

### WALK OR CHRIS IF YOU HAVE TO READ THIS THEN I GOT HIT BY BUS AND WE PROBABLY SHOULD'VE TAKEN OUT THAT IMPORTANT PERSON INSURANCE LOL
### ASK LARA FOR HELP IF NEEDED
1. CREATE A GITHUB ACCOUNT AND COME BACK TO THIS PAGE AFTER
2. CLICK THE GREEN "CODE" BUTTON ON THIS PAGE AND USE THE "OPEN WITH GITHUB DESKTOP" FEATURE
3. FOLLOW ALONG WITH WHAT IT TELLS YOU AND ONCE ITS DONE THE PROGRAM SHOULD BE ON YOUR LAPTOP
4. GO DOWNLOAD "VISUAL STUDIO CODE" AND THEN USE GITHUB DESKTOP APP TO OPEN IT IN VISUAL STUDIO CODE
5. TOP BAR SHOULD HAVE A TERMINAL TAB, CLICK IT AND OPEN NEW TERMINAL
6. LEFT BAR HAS ALL THE DIRECTORIES/FILES, THESE MATCH THE LAYOUT AND STRUCTURE OF THE FILES ON YOUR COMPUTER, ITS THE SAME IN YOUR FINDER AS IT IS IN THAT LEFT BAR
7. RIGHT CLICK ON WHATEVER DIRECTORY THAT THE .env.example file is in and create new file called .env
8. NOW FOLLOW THE INSTRUCTIONS BELOW
9. ONCE YOU FINISH THE INSTRUCTIONS BELOW YOU CAN CHANGE THE LANDING PAGE VIDEO BY GOING TO LANDING.JS AND SEARCHING ".MP4"(CMD +F OR CNTRL + F TO SEARCH) AND CHANGE THAT FILE NAME REFERENCE TO THE FILE NAME OF THE NEW VIDEO AND PUT THE NEW VIDEO IN THE DIRECTORY THAT YOU SEE IN THAT FILE NAME REFERENCE

### Copy `.env.example` file contents into `.env`
Create an empty text file called `.env` and copy the contents of `.env.example` into it. These environment variables are required for the UI to run.

If using an API key, set `REACT_APP_PERSONA_AUTH_MODE` to `0` and populate `REACT_APP_API_KEY` with your key.

If using an orchestration server(#WE ARE NOT#), set `REACT_APP_PERSONA_AUTH_MODE` to `1` and populate `REACT_APP_TOKEN_URL` with your token server endpoint and set `REACT_APP_TOKEN_URL` to `true`.

### `npm install`
Run to install the project's dependencies.

### `npm start`
Starts the development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will automatically reload when you make changes.

### `npm run build` (#DON'T NEED TO DO THIS FOR OUR PURPOSES AT THE EXPO#)
Builds the app for production to the `build` folder. The files will be bundled and minified for production.

## License

Soul Machines React Reference UI is available under the Apache License, Version 2.0. See the [LICENSE.txt](./LICENSE.txt) file for more info.

## Linting & Code Style

This project strictly follows [AirBnB's JavaScript style guide](https://github.com/airbnb/javascript). We recommend you install [ESLint](https://eslint.org/) in your editor and adhere to its recommendations.

We have also provided an `.editorconfig` file that you can use in your editor to match the indentation, whitespace, and other styling rules we used in creating this template.

## Support 
Our team would love to hear from you. For any additional support, feedback, bugs, feature requests, please [submit a ticket](https://support.soulmachines.com) or reach out to us at [support@soulmachines.com](support@soulmachines.com).
