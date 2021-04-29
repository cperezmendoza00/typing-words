/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const createResult = /* GraphQL */ `
  mutation CreateResult(
    $input: CreateResultInput!
    $condition: ModelResultConditionInput
  ) {
    createResult(input: $input, condition: $condition) {
      id
      username
      lists {
        name
        data {
          word
          belongto
          checked
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateResult = /* GraphQL */ `
  mutation UpdateResult(
    $input: UpdateResultInput!
    $condition: ModelResultConditionInput
  ) {
    updateResult(input: $input, condition: $condition) {
      id
      username
      lists {
        name
        data {
          word
          belongto
          checked
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteResult = /* GraphQL */ `
  mutation DeleteResult(
    $input: DeleteResultInput!
    $condition: ModelResultConditionInput
  ) {
    deleteResult(input: $input, condition: $condition) {
      id
      username
      lists {
        name
        data {
          word
          belongto
          checked
        }
      }
      createdAt
      updatedAt
    }
  }
`;
