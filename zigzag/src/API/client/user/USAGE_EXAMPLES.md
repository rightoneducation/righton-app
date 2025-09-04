# UserApiClient Usage Examples

## Complete CRUD Operations

```typescript
import { UserApiClient } from './UserApiClient';

const userClient = new UserApiClient();

// CREATE - Create a new user
const newUser = await userClient.createUser({
  email: 'john.doe@example.com',
  userName: 'JohnDoe',
  password: 'hashedPassword123',
  points: 0,
  currentStreak: 0,
  maxStreak: 0,
  accuracy: 0.0,
  hasAnsweredToday: false,
  topSubjects: ['Math', 'Science']
});

// READ - Get user by ID
const user = await userClient.getUser('user123');

// READ - Get user by email
const userByEmail = await userClient.getUserByEmail('john.doe@example.com');

// READ - List users with pagination
const { users, nextToken } = await userClient.listUsers(50);
const nextPage = await userClient.listUsers(50, nextToken);

// UPDATE - Update user information
const updatedUser = await userClient.updateUser('user123', {
  points: 150,
  currentStreak: 5,
  hasAnsweredToday: true,
  lastAnsweredDate: new Date(),
  topSubjects: ['Math', 'Science', 'History']
});

// UPDATE - Update only specific fields
const partialUpdate = await userClient.updateUser('user123', {
  points: 200,
  accuracy: 0.85
});

// DELETE - Delete a user
await userClient.deleteUser('user123');
```

## Error Handling

```typescript
try {
  const user = await userClient.getUser('nonexistent-id');
} catch (error) {
  console.error('User not found:', error.message);
}

try {
  const newUser = await userClient.createUser({
    email: 'invalid-email' // Missing required email format
  });
} catch (error) {
  console.error('Failed to create user:', error.message);
}
```

## Data Flow Summary

1. **Create**: `IUser` → `convertIUserToAWSInput()` → AWS Mutation → `IAWSUser` → `UserParser` → `IUser`
2. **Read**: AWS Query → `IAWSUser` → `UserParser` → `IUser`
3. **Update**: `IUser` → `convertIUserToAWSInput()` → AWS Mutation → `IAWSUser` → `UserParser` → `IUser`
4. **Delete**: AWS Mutation → Success/Error

## Helper Method

The `convertIUserToAWSInput()` method automatically handles:
- Converting Date objects to ISO strings
- Stringifying JSON objects (sessions)
- Filtering undefined values
- Maintaining proper AWS input format
