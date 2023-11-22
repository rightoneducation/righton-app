// export const onGameSessionUpdatedById = /* GraphQL */ `subscription OnGameSessionUpdatedById($id: ID!) {
//   onGameSessionUpdatedById(id: $id) {
//     id
//     gameId
//     startTime
//     phaseOneTime
//     phaseTwoTime
//     teams {
//       items {
//         id
//         name
//         question {
//           id
//           text
//           choices
//           responses
//           imageUrl
//           instructions
//           standard
//           cluster
//           domain
//           grade
//           order
//           isConfidenceEnabled
//           isShortAnswerEnabled
//           isHintEnabled
//           gameSessionId
//           __typename
//         }
//         teamMembers {
//           items {
//             id
//             isFacilitator
//             answers {
//               nextToken
//               __typename
//             }
//             deviceId
//             createdAt
//             updatedAt
//             teamTeamMembersId
//             __typename
//           }
//           nextToken
//           __typename
//         }
//         score
//         selectedAvatarIndex
//         createdAt
//         updatedAt
//         gameSessionTeamsId
//         teamQuestionId
//         teamQuestionOrder
//         teamQuestionGameSessionId
//         __typename
//       }
//       nextToken
//       __typename
//     }
//     currentQuestionIndex
//     currentState
//     gameCode
//     isAdvancedMode
//     imageUrl
//     description
//     title
//     currentTimer
//     questions {
//       items {
//         id
//         text
//         choices
//         responses
//         imageUrl
//         instructions
//         standard
//         cluster
//         domain
//         grade
//         order
//         isConfidenceEnabled
//         isShortAnswerEnabled
//         isHintEnabled
//         gameSessionId
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
// export const onTeamMemberUpdateByTeamId = /* GraphQL */ `subscription OnTeamMemberUpdateByTeamId($teamTeamMembersId: ID!) {
//   onTeamMemberUpdateByTeamId(teamTeamMembersId: $teamTeamMembersId) {
//     id
//     isFacilitator
//     answers {
//       items {
//         id
//         questionId
//         isChosen
//         text
//         awsAnswerContents
//         isTrickAnswer
//         confidenceLevel
//         createdAt
//         updatedAt
//         teamMemberAnswersId
//         __typename
//       }
//       nextToken
//       __typename
//     }
//     deviceId
//     createdAt
//     updatedAt
//     teamTeamMembersId
//     __typename
//   }
// }
// `
// export const onTeamCreateByGameSessionId = /* GraphQL */ `subscription OnTeamCreateByGameSessionId($gameSessionTeamsId: ID!) {
//   onTeamCreateByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
//     id
//     name
//     question {
//       id
//       text
//       choices
//       responses
//       imageUrl
//       instructions
//       standard
//       cluster
//       domain
//       grade
//       order
//       isConfidenceEnabled
//       isShortAnswerEnabled
//       isHintEnabled
//       gameSessionId
//       __typename
//     }
//     teamMembers {
//       items {
//         id
//         isFacilitator
//         answers {
//           items {
//             id
//             questionId
//             isChosen
//             text
//             awsAnswerContents
//             isTrickAnswer
//             confidenceLevel
//             createdAt
//             updatedAt
//             teamMemberAnswersId
//             __typename
//           }
//           nextToken
//           __typename
//         }
//         deviceId
//         createdAt
//         updatedAt
//         teamTeamMembersId
//         __typename
//       }
//       nextToken
//       __typename
//     }
//     score
//     selectedAvatarIndex
//     createdAt
//     updatedAt
//     gameSessionTeamsId
//     teamQuestionId
//     teamQuestionOrder
//     teamQuestionGameSessionId
//     __typename
//   }
// }
// `
// export const onTeamDeleteByGameSessionId = /* GraphQL */ `subscription OnTeamDeleteByGameSessionId($gameSessionTeamsId: ID!) {
//   onTeamDeleteByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
//     id
//     name
//     question {
//       id
//       text
//       choices
//       responses
//       imageUrl
//       instructions
//       standard
//       cluster
//       domain
//       grade
//       order
//       isConfidenceEnabled
//       isShortAnswerEnabled
//       isHintEnabled
//       gameSessionId
//       __typename
//     }
//     teamMembers {
//       items {
//         id
//         isFacilitator
//         answers {
//           items {
//             id
//             questionId
//             isChosen
//             text
//             awsAnswerContents
//             isTrickAnswer
//             confidenceLevel
//             createdAt
//             updatedAt
//             teamMemberAnswersId
//             __typename
//           }
//           nextToken
//           __typename
//         }
//         deviceId
//         createdAt
//         updatedAt
//         teamTeamMembersId
//         __typename
//       }
//       nextToken
//       __typename
//     }
//     score
//     selectedAvatarIndex
//     createdAt
//     updatedAt
//     gameSessionTeamsId
//     teamQuestionId
//     teamQuestionOrder
//     teamQuestionGameSessionId
//     __typename
//   }
// }
// `
// export const onCreateGameTemplate = /* GraphQL */ `subscription OnCreateGameTemplate(
//   $filter: ModelSubscriptionGameTemplateFilterInput
// ) {
//   onCreateGameTemplate(filter: $filter) {
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
// export const onUpdateGameTemplate = /* GraphQL */ `subscription OnUpdateGameTemplate(
//   $filter: ModelSubscriptionGameTemplateFilterInput
// ) {
//   onUpdateGameTemplate(filter: $filter) {
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
// export const onDeleteGameTemplate = /* GraphQL */ `subscription OnDeleteGameTemplate(
//   $filter: ModelSubscriptionGameTemplateFilterInput
// ) {
//   onDeleteGameTemplate(filter: $filter) {
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