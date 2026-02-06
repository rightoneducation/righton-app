"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClassroom = exports.updateClassroom = exports.createClassroom = exports.getLearningScience = void 0;
exports.getLearningScience = `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
exports.createClassroom = `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.updateClassroom = `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.deleteClassroom = `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
