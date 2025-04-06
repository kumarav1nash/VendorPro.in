# Supabase Setup Guide

## Project Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once the project is created, go to Project Settings > API
3. Copy the following values:
   - Project URL (under "Project Configuration")
   - anon/public key (under "Project API keys")

## Environment Configuration

1. Create a `.env` file in the project root
2. Copy the contents of `.env.example` to `.env`
3. Replace the placeholder values with your Supabase project values:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Using Supabase in the Application

The application uses a centralized Supabase configuration in `src/config/supabase.ts`. This file exports:

1. `supabase` - The main Supabase client instance
2. `supabaseHelpers` - A collection of helper functions for common operations

### Authentication

```typescript
// OTP Authentication
const { data, error } = await supabaseHelpers.signInWithOtp(phoneNumber);

// Password Authentication
const { data, error } = await supabaseHelpers.signInWithPassword(email, password);

// Sign Out
const { error } = await supabaseHelpers.signOut();
```

### Database Operations

```typescript
// Fetch data
const { data, error } = await supabaseHelpers.get('table_name', {
  select: '*',
  match: { column: value },
  orderBy: { created_at: 'desc' },
  range: [0, 9]
});

// Create record
const { data, error } = await supabaseHelpers.create('table_name', {
  column1: value1,
  column2: value2
});

// Update record
const { data, error } = await supabaseHelpers.update('table_name', id, {
  column1: newValue1
});

// Delete record
const { error } = await supabaseHelpers.delete('table_name', id);
```

## Error Handling

All Supabase operations return an object with `data` and `error` properties. Always check for errors:

```typescript
const { data, error } = await supabaseHelpers.get('table_name');
if (error) {
  console.error('Error fetching data:', error.message);
  // Handle error appropriately
  return;
}
// Process data
```

## Security Considerations

1. Never expose your service_role key
2. Use Row Level Security (RLS) policies
3. Validate data on both client and server side
4. Use type-safe queries where possible
5. Handle errors gracefully with user-friendly messages 