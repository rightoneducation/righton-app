module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    '@chromaui/storybook-addon',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
