// Common functions used across multiple roles

// Function to get the current user ID from session
export async function getCurrentUserId() {
  try {
    // Using next-auth session to get user ID
    const response = await fetch('/api/auth/session', {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch session');

    const session = await response.json();

    console.log('Session in getCurrentUserId:', session);

    if (!session || !session.user || !session.user.id) {
      console.warn('No user ID found in session');
      return null;
    }

    return parseInt(session.user.id, 10);
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

// Utility function for making authenticated fetch requests
export async function fetchWithAuth(url, options = {}) {
  try {
    const fetchOptions = {
      ...options,
      credentials: 'include', // Important to include credentials for session cookies
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      // Get error details without trying to read the body twice
      const status = response.status;
      const statusText = response.statusText;

      let errorData = '';
      try {
        // Clone the response to avoid "body stream already read" errors
        const errorResponse = response.clone();
        errorData = await errorResponse.json();
        errorData = JSON.stringify(errorData);
      } catch (err) {
        // If parsing as JSON fails, try text
        try {
          const errorResponse = response.clone();
          errorData = await errorResponse.text();
        } catch (textErr) {
          errorData = 'Could not parse error response';
        }
      }

      throw new Error(
        `API request failed: ${status} ${statusText} - ${errorData}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making authenticated request to ${url}:`, error);
    throw error;
  }
}
