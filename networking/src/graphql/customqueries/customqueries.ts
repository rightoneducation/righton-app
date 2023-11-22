// export const getGameTemplate = /* GraphQL */ `query GetGameTemplate($id: ID!) {
//   getGameTemplate(id: $id) {
//     id
//     title
//     owner
//     version
//     description
//     domain
//     cluster
//     grade
//     standard
//     phaseOneTime
//     phaseTwoTime
//     imageUrl
//     questionTemplates {
//       items {
//         id
//         gameTemplateID
//         questionTemplateID
//         questionTemplate {
//           id
//           title
//           owner
//           version
//           choices
//           instructions
//           domain
//           cluster
//           grade
//           standard
//           imageUrl
//           createdAt
//           updatedAt
//           __typename
//         }
//         createdAt
//         updatedAt
//         __typename
//       }
//       nextToken
//       __typename
//     }
//     createdAt
//     updatedAt
//     __typename
//   }
// }
// `
// export const listGameTemplates = /* GraphQL */ `query ListGameTemplates(
//   $filter: ModelGameTemplateFilterInput
//   $limit: Int
//   $nextToken: String
// ) {
//   listGameTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
//     items {
//       id
//       title
//       owner
//       version
//       description
//       domain
//       cluster
//       grade
//       standard
//       phaseOneTime
//       phaseTwoTime
//       imageUrl
//       questionTemplates {
//         items {
//           id
//           gameTemplateID
//           questionTemplateID
//           questionTemplate {
//             id
//             title
//             owner
//             version
//             choices
//             instructions
//             domain
//             cluster
//             grade
//             standard
//             imageUrl
//             createdAt
//             updatedAt
//             __typename
//           }
//           createdAt
//           updatedAt
//           __typename
//         }
//         nextToken
//         __typename
//       }
//       createdAt
//       updatedAt
//       __typename
//     }
//     nextToken
//     __typename
//   }
// }
// `