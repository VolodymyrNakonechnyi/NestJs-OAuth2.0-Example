export const USERS_PATTERNS = {
    FIND_ALL: 'users.findAll',
    FIND_ONE_ID: 'users.findOne',
    CREATE: 'users.create',
    UPDATE: 'users.update',
    REMOVE: 'users.remove',
    FIND_ONE_BY_USERNAME_OR_EMAIL: 'users.findOne.usernameOrEmail',
    FIND_ONE_BY_CREDENTIALS: 'users.findOne.credentials'

  } as const;
  