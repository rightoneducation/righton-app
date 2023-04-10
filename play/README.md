Play is the student facing RightOn! app built with ReactJS and Typescript. 

Installation:
install packages per package.json
1. cd play 
2. yarn install 

link networking for models, helper functions etc
3. change directory to networking
4. yarn link
5. change directory back to play
6. yarn link '@righton/networking'
7. yarn start

Script:
yarn start - runs react-scripts app
yarn storybook - starts up preview of storybooks
yarn lint - ESLints everything in \play
yarn format - applies prettier formatting to everything in \play

Linting/Formatting:
ESLint and prettier are used to create a consistent codebase. We are extending airbnb for the linting rules and apply mostly default prettier rules. 
There are some exceptions though:

.eslintrc.json:
1.  "react/jsx-props-no-spreading": ["off"],
    We spread props to the components to minimize the need to pass the entire game session object to each component. 
2. "react/require-default-props": ["off"],
    Currently set to off, may be enabled when game session nulls are resolved.
3.  "no-console": [1, { "allow": ["debug"] }] // allowing use of console.debug
    Console.debug enabled for testing
4.  "import/core-modules": ["@righton/networking"]
     Issue: symlink is getting flagged as "should be listed in project's dependencies". I think this fits under the definition of "core-modules" 
    (particularly because we will only use symlinks in development): 
    "An array of additional modules to consider as "core" modules--modules that should be considered resolved 
    but have no path on the filesystem: https://github.com/import-js/eslint-plugin-import#importcore-modules

.prettierrc:
1.   "singleQuote": true
    I think single quotes are prettier :sunglasses:

Theme:
lib\Theme.tsx has been added to centralize colors, fonts and breakpoints. 

Models:
lib\PlayModels.tsx contains all models used within play:
1. enum AnswerState
  Used to define states for the answerselector values
