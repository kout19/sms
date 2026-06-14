/**
 * BACKEND INTEGRATION GUIDE
 * ==========================
 * 
 * This guide explains how to transition the RBAC system from mock data
 * to a real backend API. The frontend architecture is already designed
 * to support this seamless transition.
 * 
 * ## Current Mock Architecture
 * 
 * Currently:
 * - authSlice.js: Uses mock users directly
 * - No API calls or HTTP requests
 * - All auth logic is client-side
 * - Perfect for development and testing
 * 
 * ## Transition Path
 * 
 * The transition involves these steps:
 * 1. Create API service layer
 * 2. Create Redux async thunks
 * 3. Update authSlice with thunks
 * 4. Update components to use new actions
 * 5. Keep all RBAC logic unchanged
 * 
 * ## Step 1: Create API Service Layer
 * 
 * Create: src/services/api/authService.js
 */

// ============================================
// AuthService.js - API Integration
// ============================================

/*
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.token}`;
          return apiClient(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export default apiClient;
*/

/**
 * ## Step 2: Create Async Thunks in authSlice
 * 
 * Replace the mock login with async thunk:
 */

/*
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(
        credentials.email,
        credentials.password
      );
      
      // Store tokens
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);
*/

/**
 * ## Step 3: Update authSlice with Thunks
 * 
 * Add these to the extraReducers section:
 */

/*
const authSlice = createSlice({
  // ... existing code ...
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.lastLoginTime = new Date().toISOString();
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});
*/

/**
 * ## Step 4: Update Components to Use New Actions
 * 
 * The components using useAuth don't need to change much:
 * The same API remains the same, just the backend changes!
 */

/*
// In a login component:
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (email, password) => {
    await dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      // ... form fields ...
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}
*/

/**
 * ## Step 5: Expected Backend API Responses
 * 
 * Your backend should return responses in this format:
 */

/*
// POST /api/auth/login
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "admin",
      "phone": "+1-234-567-8900",
      "avatar": "https://...",
      "status": "active",
      "permissions": ["manage:users", "manage:roles", ...]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Login successful"
}

// GET /api/auth/me (protected route)
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// POST /api/auth/logout
{
  "success": true,
  "message": "Logged out successfully"
}

// POST /api/auth/refresh
{
  "success": true,
  "data": {
    "token": "new_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600
  }
}
*/

/**
 * ## Environmental Configuration
 * 
 * Create .env.local:
 */

/*
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
*/

/**
 * Create .env.production:
 */

/*
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
*/

/**
 * ## Key Points for Backend Integration
 * 
 * 1. **Token Storage**
 *    - Store tokens in localStorage or sessionStorage
 *    - Use HttpOnly cookies for better security in production
 *    - Include token in Authorization header
 * 
 * 2. **Token Refresh**
 *    - Implement token refresh mechanism
 *    - Auto-refresh before expiry
 *    - Handle 401 responses gracefully
 * 
 * 3. **Error Handling**
 *    - Return consistent error format
 *    - Include error codes for frontend handling
 *    - Log errors for debugging
 * 
 * 4. **User Roles and Permissions**
 *    - Return role in user object
 *    - Include permissions array if using permission-based RBAC
 *    - Validate permissions on backend for all operations
 * 
 * 5. **Security Best Practices**
 *    - Always use HTTPS in production
 *    - Implement CSRF protection
 *    - Validate input on backend
 *    - Never expose sensitive data in tokens
 *    - Use strong password hashing
 *    - Implement rate limiting
 * 
 * ## Frontend Environment Check
 * 
 * Use this to determine which auth method to use:
 */

/*
// In authSlice.js
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

if (IS_DEVELOPMENT && USE_MOCK_AUTH) {
  // Use mock auth
  // Import mockUsers and use mockLoginAs action
} else {
  // Use real API
  // Import authService and dispatch async thunks
}
*/

/**
 * ## Migration Checklist
 * 
 * - [ ] Create authService.js with API calls
 * - [ ] Add axios and interceptors
 * - [ ] Create async thunks in authSlice
 * - [ ] Add extraReducers for thunks
 * - [ ] Create login component/page
 * - [ ] Update store configuration
 * - [ ] Test login flow
 * - [ ] Test token refresh
 * - [ ] Test logout
 * - [ ] Add error handling
 * - [ ] Add loading states
 * - [ ] Test with role switching
 * - [ ] Verify permissions are enforced
 * - [ ] Test with different roles
 * - [ ] Performance test
 * - [ ] Security audit
 * 
 * ## Keeping Mock Auth Available
 * 
 * You can keep mock auth available for development:
 */

/*
// authSlice.js
import { mockUsers } from './mockUsers';
import { login as apiLogin } from '../services/authService';

const loginAction = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const useMock = process.env.REACT_APP_USE_MOCK_AUTH === 'true';
    
    try {
      if (useMock) {
        // Mock login
        const user = mockUsers[credentials.role];
        if (!user) throw new Error('Invalid mock role');
        return formatAuthResponse(user);
      } else {
        // Real API login
        return await apiLogin(credentials.email, credentials.password);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
*/

/**
 * ## Testing Helpers
 * 
 * Create a test utility to mock API responses:
 */

/*
// __mocks__/authService.js
export const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    user: mockUsers.admin,
    token: 'mock_token',
    refreshToken: 'mock_refresh',
    expiresIn: 3600,
  }),
  
  logout: jest.fn().mockResolvedValue(null),
  
  getCurrentUser: jest.fn().mockResolvedValue({
    user: mockUsers.admin,
  }),
};
*/

export default {};
