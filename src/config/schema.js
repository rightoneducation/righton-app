/* eslint-disable */


const GameRoom = {
  GameRoomID: 'number',
  date: 'number',
};


const gameState = {
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
  GameRoomID: 'string',
  state: 'object',
};


const TeacherAccount = {
  email: '',
  games: ['object'],
  favorites: ['object'],
  history: ['object'],  // Depending on data stored we can generate reports of students engagement over time
                        // - number of correct answers per game (as bars)
                        // - number of trick answers per game (as bars)
                        // - tricked to correct ratio performance per game
  // settings: {}
}


const StudentAccount = {
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