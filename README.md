# RightOn Education

### Project Description
<a href="https://www.rightoneducation.com"><strong><i>RightOn!</i></strong></a> is a mobile app and dashboard that enables math educators to engage middle and high school students in thinking about and discussing misconceptions; fosters a positive culture of error that improves self-confidence; and ultimately increases math proficiency, especially among students who may not see themselves as “math people.” Think Kahoot/Fibbage + math + learning from and having fun with wrong answers. We focus on not only building student engagement, but also designing with less time pressure, more collaboration among peers, and a distinct focus on math learning outcomes, thus helping set the stage for a larger and more diverse STEM college and career pipeline.

### Getting Started

#### 1) Clone project

`git clone https://github.com/righton-dev/righton-app.git`

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
Some NPM packages may be out of date and need to be updated for the Android build.
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

Please refer to our [Contribution Guide](https://github.com/righton-dev/righton-app/tree/master/CONTRIBUTING.md).

### Additional Documentation

Please refer to our [docs](https://github.com/righton-dev/righton-app/tree/master/docs)

### Communication channels

We are always happy to hear from people who are also interested in building learning apps and making math more fun for more people. We're trying to build this plane as we fly it, and suggestions are always welcome and appreciated. Give us a shout anytime at info@rightoneducation.com.

### Tests

You are welcome to download our latest beta version to test and give feedback. Please use Test Flight to install our app from this link: https://testflight.apple.com/join/2l8414MU

### Deployment

Coming soon!

### Acknowledgments

#### Meet our team
<strong>Andy Li</strong> - Mobile App Lead<br>
<strong>Angela Dosalmas</strong> - Math Educator / Equity & Community Engagement<br>
<strong>Anna Roberds</strong> - Math Educator / Community Engagement<br>
<strong>Daz Yang</strong> - Full-Stack Web Developer<br>
<strong>Edward Tan</strong> - Architect Lead<br>
<strong>Iman Howard</strong> - STEM Educator<br>
<strong>Katerina Schenke</strong> - Research & Learning Scientist<br>
<strong>Mani Ramezan</strong> - Mobile App Lead<br>
<strong>Marizza Bailey</strong> - Math Educator / Content & Pedagogy<br>
<strong>Ryan Booth</strong> - Web App Lead<br>
<strong>Sinclair Wu </strong> - Product Lead<br>
#### Advisors
<strong>Ay-Nur Najm</strong> - Independent math consultant and computer science teacher<br>
<strong>Ben Woodford</strong> - Doctoral scholar at Stanford specializing in math education<br>
<strong>Bunmi Esho</strong> - STEM Advocacy Executive Director<br>
<strong>Esmeralda Ortiz</strong> - Senior Director, Boys & Girls Clubs of the Peninsula<br>
<strong>Eric Boucher</strong> - Cofounder & CEO of Ovio<br>
<strong>Paul Chin</strong> - Assistant Professor of Practice, Relay Graduate School of Education<br>
<strong>Payton Richardson</strong> - Data Officer, Eastside Pathways<br>
<strong>Ronald Towns</strong> - STEM Administrator
<br>
<br>
<em>Learn more about RightOn! & our team at https://rightoneducation.com.</em>
