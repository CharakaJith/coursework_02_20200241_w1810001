module.exports = {
  // database initialization messages
  DATABASE: {
    SYNC: {
      SUCCESS: 'Database synced successfully.',
      FAILED: (error) => `Failed to sync database: ${error.message}`,
    },
  },

  // response payload messages
  RESPONSE: {
    USER: {
      INVALID_ID: 'Invalid format for user ID.',
      EXISTS: 'User is already registered.',
      INVALID_CRED: 'Invalid user credentials.',
      INVALID_PASSWORD: 'Current password is incorrect.',
      INACTIVE: 'User account is inactive.',
      NOT_FOUND: 'User not found.',
      DEACTIVATED: 'User profile has been permanently deleted.',
      PWD_UPDATED: 'Password updated successfully.',
      FOLLOWS: 'Already following this user.',
      UNFOLLOWED: 'Unfollowed this user successfully.',
    },
    COUNTRY: {
      INVALID: 'The country does not exist.',
    },
    POST: {
      INVALID_ID: 'Invalid format for post ID.',
      INVALID_TYPE: 'Invalid post type.',
      NOT_FOUND: 'Post not found.',
      DELETED: 'Post has been permanently deleted.',
    },
    REACT: {
      LIKED: 'You already liked this post.',
      DILIKED: 'You already disliked this post.',
    },
    ACTION: {
      DENIED: 'Action not permitted.',
    },
    FOLLOW: {
      NOT_FOUND: 'Invalid follow id.',
    },
  },

  // validation error messages
  VALIDATE: {
    PARAM: {
      EMPTY: (field) => `The '${field}' field is required.`,
      INVALID: (field) => `Invalid format for '${field}'.`,
    },
  },

  // dao layer error messages
  DAO: {
    FAILED: {
      INSERT: (entity, error) => `Failed to create ${entity}: ${error.message}`,
      UPDATE: (entity, error) => `Failed to update ${entity}: ${error.message}`,
      DELETE: (entity, error) => `Failed to delete ${entity}: ${error.message}`,
      GET: {
        ALL: (entity, error) => `Failed to retrieve all ${entity}: ${error.message}`,
        BY_ID: (entity, error) => `Failed to retrieve ${entity} by ID: ${error.message}`,
        BY_EMAIL: (entity, error) => `Failed to retrieve ${entity} by email: ${error.message}`,
        BY_CODE: (entity, error) => `Failed to retrieve ${entity} by code: ${error.message}`,
        RECENT: (entity, error) => `Failed to retrieve recent ${entity}: ${error}`,
        BY_USER: (entity, error) => `Failed to retrieve ${entity} by user: ${error.message}`,
        BY_KEY: (entity, error) => `Failed to retrieve ${entity} by key: ${error.message}`,
      },
    },
  },

  // jwt service messages
  JWT: {
    GENERATE: {
      FAILED: (token, error) => `Failed to generate ${token} token: ${error.message}`,
    },
    REFRESH: {
      SUCCESS: 'JWT refreshed successfully.',
      FAILED: (error) => `Failed to refresh access token: ${error.message}`,
    },
    AUTH: {
      FAILED: 'Authentication failed.',
      FORBIDDEN: 'Access denied.',
    },
  },
};
