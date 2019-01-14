/* eslint-disable */

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
}