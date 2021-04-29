/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote {
    onCreateNote {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote {
    onUpdateNote {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote {
    onDeleteNote {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const onCreateResult = /* GraphQL */ `
  subscription OnCreateResult {
    onCreateResult {
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
export const onUpdateResult = /* GraphQL */ `
  subscription OnUpdateResult {
    onUpdateResult {
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
export const onDeleteResult = /* GraphQL */ `
  subscription OnDeleteResult {
    onDeleteResult {
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
