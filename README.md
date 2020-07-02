# RightOn Education

### Our Mission & Vision
<strong>Mission:</strong> Maybe you too know kids (or even adults) who'll say things like, "I'm not a math person." or "I just can't do math." Our mission is to unlock every student’s potential in math: building self-confidence, developing conceptual understanding, and helping them overcome challenges in both school & life.

While many apps focus on speed and accuracy, we're turning things around: our app not only makes it OK to make mistakes: players get rewarded for the most popular wrong answers. Through learning from mistakes and misconceptions, everyone takes their learning to the next level.

<strong>Vision:</strong> In the future, we envision <a href="https://www.rightoneducation.com"><strong><i>RightOn!</i></strong></a> to become a multimedia learning platform and game show (spanning mobile apps and livestream video), one that eventually helps connect students of all ages and backgrounds to learn new subjects -- from math today to others in the future. 

### Our Values
We’re a team that sometimes falls down, always gets back up, and never stops having fun.<br>
<strong>Trust and open communication:</strong> first seeking to understand, then to be understood<br>
<strong>Integrity:</strong> doing the right thing<br>
<strong>Compassion:</strong> lending a hand to others, giving back, expressing gratitude<br>
<strong>Humility:</strong> working together on something bigger than ourselves<br>
<strong>Beginner’s mindset:</strong> going into things with an open mind, always learning and making new mistakes<br>
<strong>Fun:</strong> having fun along the way!<br>

### Project Description
We're currently developing two apps:
1. A React Native mobile app for middle/high school teachers to use in classroom environments. Think Balderdash/Fibbage + math + learning from and having fun with mistakes and misconceptions. 
2. A React web app that enables teachers to create games/questions that appear in the mobile app and view classroom results.

We're running on AWS, including AppSync/GraphQL, DynamoDB, and Lambda. A future phase might include a livestream game show with elements similar to the following <a href="https://www.tubefilter.com/2020/04/27/mrbeast-youtube-creator-games-nadeshot-ninja/"><strong>online rock-papers-scissors tournament</strong></a>. 

### Getting Started

Click into the <a href="https://github.com/rightoneducation/righton-app/tree/dev/web">**web**</a> or <a href="https://github.com/rightoneducation/righton-app/tree/dev/mobile">**mobile**</a> directory to learn how to get started. 

### Files Needed

The `react-native` npm package.
<br>
A `local.properties` file if testing on Android.
<br>
The Xcode editor if testing on iOS.
<br>

#### Notes:
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
If you receive a `hasteImpl returning the same name for different files` error in your packager: This is due to identical path names created by AWS Amplify. To fix this issue, simply drag the `#current-cloud-backend` folder from `${root}/amplify` out, restart the packager and run again.

### Contributing

We welcome contributions from all, and each contribution makes a difference! Please report issues directly to us or make pull requests for any features or bug fixes. Please refer to our [Contribution Guide](https://github.com/righton-dev/righton-app/tree/master/CONTRIBUTING.md) for further details.

### Additional Documentation

Please refer to our [docs](https://github.com/righton-dev/righton-app/tree/master/docs)

### Communication Channels

We are always happy to hear from people who are also interested in building learning apps and making math more fun and achievable for all. We're building this plane as we fly it, and suggestions are always welcome and appreciated. Give us a shout anytime at info@rightoneducation.com. You're also welcome to join our Slack community -- just let us know!

### Testing

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
<strong>Jordan Fong</strong> - UX<br>
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
<strong>Lybroan James</strong> - Chief Education Officer, STEMulate<br>
<strong>Paul Chin</strong> - Assistant Professor of Practice, Relay Graduate School of Education<br>
<strong>Payton Richardson</strong> - Data Officer, Eastside Pathways<br>
<strong>Ronald Towns</strong> - STEM Administrator<br>
<strong>Yong Lin</strong> - UX
<br>
<br>
<em>Learn more about RightOn! & our team at https://rightoneducation.com.</em>
