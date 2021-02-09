# DynamoDB Design

## Entities

### Config

This entity contains the global settings and configurable parts of the application. The list of items included here is as follows:

- ConfigVersion (PK): A unique id associated to a config. Anytime a config changes, this number changes
- PointsForMostPopularTrickAnswer: Points granted to each team for guessing the most popular trick answer
- PointsPerCorrectAnswer: Points granted to teams for guessing the right answer
- VotingTime: Amount of time that voting teams have to vote (this equals the amount of time that the team coming up with the trick answers (aka QuestionTeam?) has to come up with and select their trick answers.
- HintsRevealTime: Amount of time that passes before hints are revealed. This must be less than VotingTime.

### GameSession

The higher level entity contains all information related to a game from start to finish.

- GameSessionId (PK): A unique identifier assigned to each game session
- GameId: A game object that comes from Aurora. It's a snapshot of the data when the game starts
- TeamIds: An array of team Ids that participating in the game
- StartedDateTimeUTC (SK): Date time of when the game started in UTC
- GameCode ((Local | Global) Index): A 4-digit code to enter to join the game session
- MultiDeviceMode: Boolean indicating multi-device scenario. if `True`, then one device among a team's multiple devices will be randomly assigned the `Facilitator`; if `False`, then there is only one device per team and that device will also have `Facilitator` privileges
- VotingTime: If set, this overrides the config value
- HintsRevealTime: If set, this overrides the config value
- State ((Local | Global) Index): NotStarted | InProgress (Intro | TrickAnswer | Voting | Result) | Finished

### Game

The game information that comes as part of Game entity from Aurora.

- GameId (PK): Unique identifier for a game comes from Aurora
- QuestionIds: List of question Ids associated to this game
- Title: the title of the game
- Description: The description set for this game

### Question

These information are coming as part of Game entity.

- QuestionId (PK): Unique number for each question
- Question: The text for the question
- Hints: an array of hints for the question
- ImageURL: URL of the image associated to this question
- Answer: The right answer for this question

### Team

- TeamId (PK): Numeric unique number assigned to the team
- GameSessionId (SK): Id of the game session that this team belongs to
- Name: Name chosen to show for the team. This helps for future substituting `team 1` string with chosen team names
- Question: The chosen question for the team
- ChosenTrickiestAnswerId: Indicates the answer the team has chosen to be the most tricky one

### TeamMember

- TeamMemberId (PK): Unique identifier defines this team member
- TeamId: The teamId this member is a member of
- DeviceId (Index): Unique number associated to the device
- IsFacilitator: A boolean indicating if this device is the facilitator in multi-device mode

### SubmittedAnswer

- SubmittedAnswerId (PK): A unique id for each answer
- SubmittedDateTimeUTC (SK): Submitted time in UTC timezone
- QuestionId: The identifier for the question this answer is for
- TeamMemberId: Team member Id who submitted this answer
- Text: The text of the answer that's submitted a team member
- IsChosenTrickAnswer: Indicates if this answer is chosen to be a trick answer
- IsChosenBySystem: Indicated if this answer was automatically chosen by the system due to time finishes

### ResultsRound

- TeamMemberId (PK): The unique number identifies the team member who choses the answer
- SubmittedAnswerId: Identifies which answer is selected

## ERD

![ERD](https://raw.githubusercontent.com/rightoneducation/righton-app/3e78f0f09a6df31ee41267289b6ac6d073cd6348/docs/mobile/game-session/img/ERD.png)
