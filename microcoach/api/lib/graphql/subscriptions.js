"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeleteClassroom = exports.onUpdateClassroom = exports.onCreateClassroom = void 0;
exports.onCreateClassroom = `
  subscription OnCreateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onCreateClassroom(filter: $filter) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.onUpdateClassroom = `
  subscription OnUpdateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onUpdateClassroom(filter: $filter) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.onDeleteClassroom = `
  subscription OnDeleteClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onDeleteClassroom(filter: $filter) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
