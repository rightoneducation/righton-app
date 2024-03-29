# RightOn! - Host App

[Host](https://host.rightoneducation.com) is the teacher facing RightOn! app built with ReactJS and Typescript. It makes use of [mui v5](https://mui.com/material-ui/migration/migration-v4/) for styling, [react-i18next](https://react.i18next.com/) for internationalization, [Storybook](https://storybook.js.org/) for UI development and [jest](https://jestjs.io/docs/getting-started) for testing.

### Installation Instructions:

<strong> install packages per package.json: </strong>

1. cd host_v2
2. yarn install

<strong> link networking for models, helper functions etc: </strong>

3. change directory to networking
4. yarn install
5. yarn run build
6. yarn link
7. change directory back to host_v2
8. yarn link '@righton/networking'
9. yarn start

### Scripts:

1. 'yarn start' - runs react-scripts app
2. 'yarn storybook' - starts up preview of storybooks
3. 'yarn chromatic' - builds storybook to chromatic for coordination
4. 'yarn lint' - ESLints everything in /host_v2
5. 'yarn format' - applies prettier formatting to everything in /play
6. 'yarn test' - runs tests via jest for \*.test.tsx in the /tests folder

### Styling:

@mui v5 is used for most components, with styled-components as the underlying styling engine (instead of @emotion). We have migrated from the deprecated `makeStyles` per https://mui.com/material-ui/migration/migration-v4/. Overrides are provided through styled(). Passing props to styles is achieved either through `styled()` or `sx`. https://mui.com/system/styled/#api describes the passing of props in both cases. For more complicated dynamic updates, `styled()` components are broken out (see `AnswerSelector.tsx` for an example) while simpler dynamic updates are done through `sx` (see `AnswerCard.tsx` for an example)

### Linting/Formatting:

ESLint and prettier are used to create a consistent codebase. We are extending airbnb for the linting rules and apply mostly default prettier rules.
There are some exceptions though:

<strong> .eslintrc.json: </strong>

1.  "react/jsx-props-no-spreading": ["off"],  
    We spread props to the components to minimize the need to pass the entire game session object to each component.
2.  "react/require-default-props": ["off"],  
    Currently set to off, may be enabled when game session nulls are resolved.
3.  "no-console": [1, { "allow": ["debug"] }] // allowing use of console.debug  
    Console.debug enabled for testing
4.  "import/core-modules": ["@righton/networking"]  
     Issue: symlink is getting flagged as "should be listed in project's dependencies". I think this fits under the definition of "core-modules"
    (particularly because we will only use symlinks in development):
    "An array of additional modules to consider as "core" modules--modules that should be considered resolved
    but have no path on the filesystem: https://github.com/import-js/eslint-plugin-import#importcore-modules

<strong> .prettierrc: </strong>

1.  "singleQuote": true  
    I just think single quotes are nicer :sunglasses:

### Theming:

lib/Theme.tsx has been added to centralize colors, fonts and breakpoints. This is deployed through the app via `<ThemeProvider>` in `App.tsx` and `import { styled, useTheme } from '@mui/material/styles';`

### Internationalization:

Dictionaries are stored in `public/locales/{lang}/translations.json` and configured via `src/i18n.tsx` and deployed via `import './i18n';` in `index.tsx` and `import { useTranslation } from 'react-i18next';`

We autodetect based on language settings in the browser and fall back to `EN` as a default.
