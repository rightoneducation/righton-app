# AWS Amplify

Amplify is what we're using to build and deploy our AWS stack (we were previously useing AWS-Mobile, but are no longer). Due to Amplify's infancy but preferred aspects over the deprecating, AWS-Mobile, it's not possible to make changes on the AWS console and `pull` those changes. This is why we're relying on creating and making changes to Lambda functions, etc. from within the `amplify` directory.

## Getting Started

Install the node modules from the package. `npm install`

This will install `aws-amplify` into your root environment. Now run `amplify` in your terminal for command documentation.

Refer to the `<root>/amplify` directory for the current AWS setup.

- Making changes to `<root>/amplify/backend` changes how the setup in your local environment. To push these changes to the cloud, run `amplify push` from your terminal.

Please refer to docs for more info: https://aws-amplify.github.io/docs/js/start

### API

The API for accessing the Amplify backend is located in the `<root>/lib` directory. Functions which interact in any way with AWS are stored there i.e., `DynamoDB`, `IoT`, and `Auth`. `LocalStorage` API is also located there, though it does not interact with AWS in any way. 
