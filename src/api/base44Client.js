import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "67f4464bcc67d2d58d35435e", 
  requiresAuth: true // Ensure authentication is required for all operations
});
