# RightOn Education

### Project Description
Fun and motivation first – RightOn! is a math game show app for students to learn from and even win with wrong answers!

Our mission is to make math more fun for middle and high school students, increasing both motivation and self-confidence. Not a big fan of math? Great, RightOn! is the game for you. Already like math? That’s cool too, you’ll like it even more!

### Getting Started

#### 1) Clone project

`git clone git:gitlab.com/friendly-robot/righton.git`

#### 2) Install node modules

`npm install`

#### 3) Install on device

`npm run ios`
`npm run android`
  
#### 4) Start your app

`npm start`

### Files needed / Additional notes

The `react-native` npm package.
A `local.properties` file if testing on Android.
The Xcode editor if testing on iOS.

#### Note:
Some NPM packages may be outdated and need to be altered for the Android build.
<br>
If you receive a `compileOnly` error, it is due to the `build.gradle` file of the affected library. To fix this issue, locate the line in the mention file and change `compile` to `implementation`.
<br>
<br>
If you receive a `hasteImpl returning the same name for different files` error in your packager. This is due to identical path names created by AWS Amplify. To fix this issue, simply drag the `#current-cloud-backend` folder from `${root}/amplify` out, restart the packager and run again.

### Contributing

We welcome contributions from everyone. Please report issues directly to us or make Pull Requests for any features or bug fixes. As much as we like to reward mistakes, we want to fix as many of them as possible too. Your contribution counts!

Please refer to our [Contribution Guide](https://gitlab.com/friendly-robot/righton/CONTRIBUTING.md)

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
<em>Learn more about our RightOn & our team @https://rightoneducation.com</em>


