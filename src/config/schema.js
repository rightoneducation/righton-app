/* eslint-disable */


const GameRoom = {
  GameRoomID: 'number',
  date: 'number',
};


const gameState = {
  GameID: 'string',
  GameRoomID: 'string',
  answering: 'number', // index of quiz in questions array
  banner: 'string',
  title: 'string',
  description: 'string',
  quizTime: 'string',
  trickTime: 'string',
  'team#': [{ /* question schema */
    answer: 'string',
    choices: ['object'], // Object references to tricks[index]
    image: 'string',
    instructions: ['string'],
    question: 'string',
    uid: 'string',
    tricks: ['string'],
    points: 'number',
  }],
  state: 'object',
};


const TeacherAccount = {
  TeacherID: 'string',
  gamesCreated: 'number',
  gamesPlayed: 'number',
  schoolID: 'string',
  // Depending on data stored we can generate reports of students engagement over time
  // - number of correct answers per game (as bars)
  // - number of trick answers per game (as bars)
  // - tricked to correct ratio performance per game
  games: { local: 0, db: 0 },
  favorites: { local: 0, db: 0 },
  history: { local: 0, db: 0 },
  // Notes: `db` is designed to almost always be less than local by a factor of 1.
  // - This is due to not updating the teacher account in DynamoDB once the
  //   write transaction has completed for updating games, favorites, or history.
}


const deviceSettings = {
  username: 'string',
  quizTime: 'string', // Teacher only
  trickTime: 'string', // Teacher only
  signUpDate: 'number',
}


const StudentAccount = {
  age: 'number',
  email: 'string',
  gamesPlayed: 'number',
  playersTricked: 'number',
  tricksSuggested: 'number',
  points: 'number',
}


const QuizMaker = {
  answer: 'string',
  category: 'string',
  question: 'string',
  played: 'number', // To calculate popularity rating
  tricks: [
    {
      votes: 'number',
      value: 'string',
    }
  ],
}


const history = [
  {
    GameID: 'string',
    date: 'number',
    correct: 'number',
    incorrect: 'number',
    favorite: 'boolean',
    players: 'number',
    tricks: 'number',
  }
]