"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClassrooms = exports.getClassroom = void 0;
exports.getClassroom = `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      userName
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.listClassrooms = `
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
