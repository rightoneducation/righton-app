/* eslint-disable */

const gameState = {
  banner: 'string',
  title: 'string',
  description: 'string',
  'team#': [{ /* question schema */
    answer: 'string',
    choices: ['object'], // Object references to tricks[index]
    correctChoice: 'number', // index in choices which references to the correct answer
    image: 'string',
    instructions: ['string'],
    question: 'string',
    uid: 'string',
    tricks: ['string'],
  }],
  GameRoomID: 'string',
  start: 'bool',
  answering: 'number', // index of quiz in questions array
}