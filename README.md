# RightOn Education

<strong><i>RightOn!</i></strong> is a web-based platform that transforms how students think and feel about math, helping them see mistakes as learning opportunities. We do so by using AI to destigmatize errors, spark discussions about shared misconceptions, and bolster social-emotional and cognitive growth. 

### Our Mission & Vision
<strong>Mission:</strong> Maybe you too know kids (or even adults) who'll say things like, "I'm not a math person." or "I just can't do math." Our mission is to unlock STEM potential in all students: fostering a positive classroom culture of error, building self-efficacy, and deepening conceptual understanding -- helping students overcome hurdles in both school & life, whether they'd like to build apps, go to Mars, or become the next Beyonce! Math is something that everyone can do and can help everyone.

While many apps prioritize speed, <strong><i>RightOn!</i></strong> shifts focus from quick recall to metacognition: understanding not only why right answers are right, but also why wrong answers are wrong, in turn helping students take their learning to the next level.

<strong>Vision:</strong> In the future, we envision <strong><i>RightOn!</i></strong> to become a multimedia learning platform that  helps connect students of all ages and backgrounds to learn new subjects -- from math today to others in the future. 

### Our Values
We’re a team that sometimes falls down, always gets back up, and never stops having fun.<br>
<strong>Trust and open communication:</strong> seeking to understand, then to be understood<br>
<strong>Positive culture of error:</strong> learning from mistakes, iterating, and improving<br>
<strong>Gratitude:</strong> keeping a grateful mindset through ups and downs<br>
<strong>Humble perseverance:</strong> falling down seven times, getting up eight<br>
<strong>Rising together:</strong> lifting ourselves up by lifting others<br>
<strong>Beginner's mindset:</strong> embarking on all journeys with an open mind<br>

### Project Description
RightOn! consists of three progressive web apps: a database of games and questions (Central), a teacher dashboard (Host), and a student-facing web app (Play). Our platform runs on AWS, including AppSync/GraphQL, DynamoDB, and Lambda.
![RightOn Platform Overview](https://github.com/user-attachments/assets/8bac9e7c-6f0c-4bfe-adda-74c7fb3c16c6)

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

### Acknowledgments

#### Meet our team
<strong>Allison Liu</strong> - Education Research<br>
<strong>Anna Roberds</strong> - Math Educator / Community Engagement<br>
<strong>Daz Yang</strong> - Full-Stack Web Developer<br>
<strong>Drew Hart</strong> - Dev Lead<br>
<strong>Edward Tan</strong> - Architect Lead<br>
<strong>Katerina Schenke</strong> - Education Research<br>
<strong>Mani Ramezan</strong> - Dev Mentor<br>
<strong>Marizza Bailey</strong> - Math Educator / Content & Pedagogy<br>
<strong>Mozzie Dosalmas</strong> - Math Educator / Equity & Community Engagement<br>
<strong>Rod Hinn </strong> - UX Lead<br>
<strong>Ryan Booth</strong> - Dev Mentor<br>
<strong>Sinclair Wu </strong> - Product Lead<br>

#### Advisors
<strong>Ay-Nur Najm</strong> - Independent math consultant and software engineer<br>
<strong>Ben Woodford</strong> - Doctorate from Stanford University in math education<br>
<strong>Bunmi Esho</strong> - STEM Advocacy Executive Director<br>
<strong>Esmeralda Ortiz</strong> - Vice President, Boys & Girls Clubs of the Peninsula<br>
<strong>Iman Howard</strong> - STEM Educator<br>
<strong>Lybroan James</strong> - Chief Education Officer, STEMulate Solutions<br>
<strong>Paul Chin</strong> - Professor of Clinical Practice, Relay Graduate School of Education<br>
<strong>Payton Richardson</strong> - Data Officer, Eastside Pathways<br>
<strong>Ronald Towns</strong> - STEM Administrator<br>
<strong>Yong Lin</strong> - UX Leader<br>
<br>
<br>
<em>Learn more about RightOn! & our team at https://rightoneducation.com.</em>
