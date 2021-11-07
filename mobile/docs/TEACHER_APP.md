# Teacher App

Exported from `src/Teacher/index.js` is the Tab Navigation that serves as the entry file for the Teacher App. 


## Tab Navigation

### Explore

The Explore tab utilizes the `ExploreGamesAPI` found in `lib/Categories/DynamoDB` to populate the list with games to select. The functions that make these GET requests are limited to 5 results per request. These RESTful APIs can be found in `amplify/backend/function/GamesLambda`. 

### Games

The Games tab draws data from both local storage and DynamoDB. This tab houses My Games/Favorites/Shared games with `Shared` still requiring some issues to be fixed. A main component of Games is the GamesBuilder which is a modal that features all the capabilities necessary to create a game from scratch/edit an existing game or render a game's details **without** editing capabilities (as in Explore games' case).

### Reports

The Reports tab is still under construction with namely an issue being that the function which saves the finished game details to history is malfunctioning somewhere in its POST/UPDATE request. This happens somewhere in `GameRoomFinal` and the perpetrating function is in `TeacherAccountsAPI` in conjunction with `TeacherAccountsLambda`. 

### QuizMaker

The QuizMaker tab has not been started yet, but some trace of beginnings can be found in `lib/Categories/DynamoDB/QuizMakerAPI.js`.


## Switch Navigation

### GameRoom

The GameRoom screen is managed by the root "Switch Navigator" which only renders when a game is launched/started. The screen consists of one `index.js` file which uses a `switch` operator to switch between screens based on the current `renderType` value. This allows for a straightforward coupling of interconnected data points. The truer reason being that there wasn't a strict need to create an additional switch navigator to manage the screen transitions when just changing the `renderType` state value was enough.

#### GameRoomStart

The initial screen for viewing the game room ID and the number of players/teams that have joined. This is the only screen to access `GameRoomSettings` and to start the game.

#### GameRoomSettings

A screen that allows setting new times for both `quizTime` and `trickTime`. The current implementation only allows settings changes before any students have joined the game.

#### GameRoomOverview

The screen for viewing the overall progress of the game for each team - showing their question, actual answer, and trick answers. This screen has the ability to start the voting rounds and selectively bring to view how each team's `GameRoomPreview` would appear by selecting their box. (This feature would need to be assigned to a button in the future - currently tapping anywhere on the box would open this screen up (subsequently affecting the `quizTimer` in the process)).

#### GameRoomPreview

A screen for individual team voting round previews which displays their question and multiple choice selections with their trick answers.

#### GameRoomResults

This is a replica of `GameRoomPreview` with the exception that it contains animated modules for rendering how the preview voting round performed for the current team.

#### GameRoomFinal

The final screen for tallying up the scores for each team.

#### GameRoomNewGame

This screen is currently invalid. It requires drawing up a rendition of the `My Games` tab/screen in a way which allows selecting a new game without resetting the game room. Refer to `'NEW_GAME'` action for details.