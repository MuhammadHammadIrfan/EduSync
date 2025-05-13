import crypto from 'crypto';

// Simple password hashing function
export async function hashPassword(password) {
  // In a production app, use a proper library like bcrypt
  // This is a simplified version for mock data purposes
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(password, hashedPassword) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
}

export function isAuthenticated(req) {
  // In a real app, check for a valid auth token, JWT, or session cookie
  // For the MVP, we'll always return true
  return true;
}

export function getUserRole(req) {
  // In a real app, get the user role from the auth token or session
  // For the MVP, we'll always return 'admin'
  return 'admin';
}

export function getLoggedInUserId(req) {
  // In a real app, get the user ID from the auth token or session
  // For the MVP, we'll always return 1 (admin)
  return 1;
}

export function requireAuth(handler) {
  return async (req, res) => {
    // Check if user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Call the original handler
    return handler(req, res);
  };
}

export function requireRole(roles, handler) {
  return async (req, res) => {
    // Check if user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Check if user has the required role
    const userRole = getUserRole(req);
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Call the original handler
    return handler(req, res);
  };
}