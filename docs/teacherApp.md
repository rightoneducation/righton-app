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
