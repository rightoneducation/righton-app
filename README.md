# RightOn Education

### Project Description
Fun and motivation first – RightOn! is a math game show app for students to learn from and even win with wrong answers!

Our mission is to make math more fun for middle and high school students, increasing both motivation and self-confidence. Not a big fan of math? Great, RightOn! is the game for you. Already like math? That’s cool too, you’ll like it even more!

### Getting Started

#### 1) Clone project

`git clone https://gitlab.com/friendly-robot/righton.git`

#### 2) Install node modules

`npm install`

#### 3) Install on device

`npm run ios`
<br>
`npm run android`
  
#### 4) Start your app

`npm start`

### Files needed / Additional notes

The `react-native` npm package.
<br>
A `local.properties` file if testing on Android.
<br>
The Xcode editor if testing on iOS.
<br>

#### Note:
Some NPM packages may be outdated and need to be altered for the Android build.
<br>
If you encounter the following error:
<br>
> A problem occurred evaluating project ':amazon-cognito-identity-js'.
> Could not find method implementation() for arguments [com.facebook.react:react-native:+]
<br>
Locate the `build.gradle` file in `node_modules/amazon-cognito-identity.js/android`, find the line mentioned in the `dependencies` object, and change `implementation` to `compile`.
<br>
<br>
If you receive a `hasteImpl returning the same name for different files` error in your packager. This is due to identical path names created by AWS Amplify. To fix this issue, simply drag the `#current-cloud-backend` folder from `${root}/amplify` out, restart the packager and run again.

### Contributing

We welcome contributions from everyone. Please report issues directly to us or make Pull Requests for any features or bug fixes. As much as we like to reward mistakes, we want to fix as many of them as possible too. Your contribution counts!

Please refer to our [Contribution Guide](https://gitlab.com/friendly-robot/righton/blob/master/CONTRIBUTING.md).

### Communication channels

Please join us on Slack at #RightOnEducation. We want to hear from you about your experience!

### Tests

You are welcome to download our latest beta version to test and give feedback. Please use Test Flight to install our app from this link: https://testflight.apple.com/join/2l8414MU

### Deployment

Coming soon!

### Acknowledgments

#### Meet our team
<strong>Sinclair</strong> - Product Lead<br>
<strong>Edward Tan</strong> - Tech Lead<br>
<strong>Kai King</strong> - Math Educator<br>
<strong>Daz C Yang</strong> - Full-Stack Web Developer<br>
<strong>Andy Li</strong> - Mobile Developer
<br>
<br>
#### Advisors
<strong>Ay-Nur Najm</strong> - Independent math consultant and computer science teacher<br>
<strong>Ben Woodford</strong> - Doctoral scholar at Stanford specializing in math education<br>
<strong>Eric Boucher</strong> - Cofounder & CEO of Ovio [technology non-profit]<br>
<strong>Payton Richardson</strong> - Mixed-methods research analyst at the Center for Research on Education Outcomes (CREDO) at Stanford University
<br>
<br>
<em>Learn more about RightOn & our team @https://rightoneducation.com</em>


