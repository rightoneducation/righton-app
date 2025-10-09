export const referenceSchema = `input CreateGameSessionFromTemplateInput {
  gameTemplateId: ID!
  publicPrivate: String!
}

type GameSession @model 
@auth(
  rules: [
    { allow: public, provider: iam  },
    { allow: private, operations: [read, create, update, delete], provider: userPools }
  ]
)
{
  id: ID!
  classroomId: String! @index(name: "byClassroomId", queryField: "gameSessionByClassroomId")
  gameId: ID!
  startTime: String
  phaseOneTime: Int!
  phaseTwoTime: Int!
  teams: [Team] @hasMany
  currentQuestionIndex: Int
  currentState: GameSessionState!
    @index(name: "byState", queryField: "gameSessionByState")
  gameCode: Int! @index(name: "byCode", queryField: "gameSessionByCode")
  isAdvancedMode: Boolean!
  imageUrl: String
  description: String
  title: String
  currentTimer: Int
  sessionData: AWSJSON
  questions: [Question] @hasMany(indexName: "byGameSession", fields: ["id"])
}

enum GameSessionState {
  NOT_STARTED
  TEAMS_JOINING
  CHOOSE_CORRECT_ANSWER
  PHASE_1_DISCUSS
  PHASE_2_START
  CHOOSE_TRICKIEST_ANSWER
  PHASE_2_DISCUSS
  FINAL_RESULTS
  FINISHED
}

type Question @model(subscriptions: null, timestamps: null)
@auth(
  rules: [
    { allow: public, provider: iam  },
    { allow: private, operations: [read, create, update, delete], provider: userPools }
  ]
)
{
  id: ID! @primaryKey(sortKeyFields: ["order", "gameSessionId"])
  text: String!
  choices: AWSJSON
  answerSettings: AWSJSON
  answerData: AWSJSON
  hints: AWSJSON
  imageUrl: String
  instructions: AWSJSON
  standard: String
  cluster: String
  domain: String
  grade: String
  order: Int!
  isConfidenceEnabled: Boolean! @default(value: "false")
  isShortAnswerEnabled: Boolean! @default(value: "false")
  isHintEnabled: Boolean! @default(value: "true")
  gameSessionId: ID! @index(name: "byGameSession", sortKeyFields: ["order"])
}

type Team @model 
@auth(
  rules: [
    { allow: public, provider: iam  },
    { allow: private, operations: [read, create, update, delete], provider: userPools }
  ]
)
{
  id: ID!
  globalStudentId: String! @index(name: "byGlobalStudentId", queryField: "teamByGlobalStudentId")
  name: String!
  question: Question @hasOne
  teamMembers: [TeamMember] @hasMany
  score: Int! @default(value: "0")
  selectedAvatarIndex: Int! @default(value: "0")
}

type TeamMember @model 
@auth(
  rules: [
    { allow: public, provider: iam  },
    { allow: private, operations: [read, create, update, delete], provider: userPools }
  ]
)
{
  id: ID!
  isFacilitator: Boolean
  answers: [TeamAnswer] @hasMany
  deviceId: ID!
}

enum ConfidenceLevel {
  NOT_RATED 
  NOT_AT_ALL
  KINDA
  QUITE
  VERY
  TOTALLY
}

type TeamAnswer @model 
@auth(
  rules: [
    { allow: public, provider: iam },
    { allow: private, operations: [read, create, update, delete], provider: userPools }
  ]
)
{
  id: ID!
  isCorrect: Boolean
  isSubmitted: Boolean! @default(value: "false")
  isShortAnswerEnabled: Boolean! @default(value: "false")
  currentState: GameSessionState!
  currentQuestionIndex: Int!
  questionId: ID!
  teamMemberAnswersId: ID!
  teamAnswersId: ID!
  teamName: String
  text: String!
  answer: AWSJSON!
  confidenceLevel: ConfidenceLevel
  hint: AWSJSON
}`;