# RightOn! - Website

[Website](https://rightoneducation.com) is the public-facing RightOn! platform built with ReactJS and TypeScript. It makes use of [mui v7](https://mui.com/material-ui/migration/migration-v5/) for styling, [react-i18next](https://react.i18next.com/) for internationalization, [react-router-dom](https://reactrouter.com/) for routing, and [jest](https://jestjs.io/docs/getting-started) for testing.

### App Architecture:

The website serves as the main public platform for RightOn, featuring multiple pages including Home, About Us, How It Works, Positive content, and a Library section. The app uses a screen-based routing system with React Router and integrates with a CMS for dynamic content management.

### Installation Instructions:

<strong> install packages per package.json: </strong>

1. cd website
2. yarn install

### Scripts:

1. 'yarn start' - runs react-scripts app
2. 'yarn build' - builds the app for production
3. 'yarn test' - runs tests via jest
4. 'yarn eject' - ejects from Create React App (one-way operation)
5. 'yarn format' - applies prettier formatting to everything in /website

### Styling:

@mui v7 is used for most components, with styled-components as the underlying styling engine. We use the latest Material-UI components and follow the current best practices. Overrides are provided through styled(). Passing props to styles is achieved either through `styled()` or `sx`. For more complicated dynamic updates, `styled()` components are broken out while simpler dynamic updates are done through `sx`.

### Linting/Formatting:

ESLint and prettier are used to create a consistent codebase. We are extending airbnb for the linting rules and apply mostly default prettier rules.
There are some exceptions though:

<strong> .eslintrc.json: </strong>

1.  "react/jsx-props-no-spreading": ["off"],  
    We spread props to the components to minimize the need to pass entire objects to each component.
2.  "react/require-default-props": ["off"],  
    Currently set to off, may be enabled when null handling is resolved.
3.  "no-console": [1, { "allow": ["debug", "error"] }] // allowing use of console.debug and console.error  
    Console.debug and console.error enabled for testing and error handling
4.  "import/core-modules": ["@righton/networking"]  
     Issue: symlink is getting flagged as "should be listed in project's dependencies". This fits under the definition of "core-modules"
    (particularly because we will only use symlinks in development):
    "An array of additional modules to consider as "core" modules--modules that should be considered resolved
    but have no path on the filesystem: https://github.com/import-js/eslint-plugin-import#importcore-modules

<strong> .prettierrc: </strong>

1.  "singleQuote": true  
    I just think single quotes are nicer :sunglasses:

### Theming:

lib/Theme.tsx has been added to centralize colors, fonts and breakpoints. This is deployed through the app via `<ThemeProvider>` in `App.tsx` and `import { styled, useTheme } from '@mui/material/styles';`

