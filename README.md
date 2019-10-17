[![](/assets/images/right_on_banner.png)](https://www.rightoneducation.com/)

# RightOn Education

## Project Description

[**_RightOn!_**](https://www.rightoneducation.com) is an app-based classroom activity that increases engagement and helps more students feel better about math: think Kahoot/Fibbage + math + learning from and having fun with wrong answers. Rather than focusing on just increasing math proficiency -- which can leave behind many disengaged and underserved youth -- **_RightOn!_** is also working to increase self-confidence and self-efficacy through an engaging activity that applies research into learning from mistakes and common misconceptions.

## Getting Started

### 1) Clone project

`git clone https://github.com/righton-dev/righton-app.git`

### 2) Install node modules

`npm install`

### 3) Install on device

`npm run ios`

`npm run android`

### 4) Start your app

`npm start`

## Files needed / Additional notes

The `react-native` npm package.

A `local.properties` file if testing on Android.

The Xcode editor if testing on iOS.

### AWS

There has to be a file `aws-exports.js` file placed under `src/` directory. This file is not checked into the Github. It must be obtained separately from the admin of this project so that the project can properly communicate with the AWS cloud services during runtime.

### Note

Some NPM packages may be out of date and need to be updated for the Android build.

If you encounter the following error:

> A problem occurred evaluating project ':amazon-cognito-identity-js'.
> Could not find method implementation() for arguments [com.facebook.react:react-native:+]

Locate the `build.gradle` file in `node_modules/amazon-cognito-identity.js/android`, find the line mentioned in the `dependencies` object, and change `implementation` to `compile`.

If you receive a `hasteImpl returning the same name for different files` error in your packager. This is due to identical path names created by AWS Amplify. To fix this issue, simply drag the `#current-cloud-backend` folder from `${root}/amplify` out, restart the packager and run again.

## Help Wanted!

We’re looking to work with people who are interested in making a difference in youth education. We are building mobile apps on AWS using technologies including React Native, Node.js, DynamoDB, and Amplify/Lambda. Experience with AI/ML is a plus.

## Contributing

We welcome contributions from everyone. Please report issues directly to us or make Pull Requests for any features or bug fixes. As much as we like to reward mistakes, we want to fix as many of them as possible too. Your contribution counts!

Please refer to our [Contribution Guide](https://github.com/righton-dev/righton-app/tree/master/CONTRIBUTING.md).

## Additional Documentation

Please refer to our [docs](https://github.com/righton-dev/righton-app/tree/master/docs)

## Communication channels

We are always happy to hear from people who are also interested in building learning apps and making math more fun for more people. We're trying to build this plane as we fly it, and suggestions are always welcome and appreciated. Give us a shout anytime at info@rightoneducation.com.

## Tests

You are welcome to download our latest beta version to test and give feedback. Please use Test Flight to install our app from this link: [https://testflight.apple.com/join/2l8414MU](https://testflight.apple.com/join/2l8414MU)

## Deployment

Coming soon!

## Acknowledgments


### Meet our team

__Andy Li__ - Mobile Developer

__Daz Yang__ - Full-Stack Web Developer

__Edward Tan__ - Architect Lead

__Kai King__ - Math Educator

__Katerina Schenke__ - Research & Learning Scientist

__Sinclair Wu__ - Product Lead

### Advisors

__Ay-Nur Najm__ - Independent math consultant and computer science teacher

__Ben Woodford__ - Doctoral scholar at Stanford specializing in math education

__Esmeralda Ortiz__ - Senior Director, Boys & Girls Clubs of the Peninsula

__Eric Boucher__ - Cofounder & CEO of Ovio

__Paul Chin__ - Assistant Professor of Practice, Relay Graduate School of Education

__Payton Richardson__ - Data Officer, Eastside Pathways

*Learn more about RightOn! & our team at [https://rightoneducation.com](https://rightoneducation.com)*
