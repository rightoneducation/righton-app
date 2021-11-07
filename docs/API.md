# API documentation

## Updating the GraphQL API

_In order to access/update the GraphQL API, you'll need access to AppSync in our AWS environment._

To update the schema:
1. Visit the [staging app](https://console.aws.amazon.com/appsync/home?region=us-east-1#/fyjwr57bh5b2fji7ear7bwlxca/v1/schema) in AppSync
2. Modify the schema (don't forget to save, and fix errors if they occur)
3. Test your changes in the [Queries](https://console.aws.amazon.com/appsync/home?region=us-east-1#/fyjwr57bh5b2fji7ear7bwlxca/v1/queries) tab
4. If the changes work, start a new git branch in your copy of the repo to edit the schema.gql file ([can also be done online](https://github.com/rightoneducation/righton-app/edit/dev/schema.graphql))
5. Paste in the new schema contents from the AWS console, and save the file
6. Start a pull request to show your changes to other developers ([example](https://github.com/rightoneducation/righton-app/pull/107))
