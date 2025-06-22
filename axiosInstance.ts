import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Define custom error response types
interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

// Extend the InternalAxiosRequestConfig to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Important for cookies
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth headers and handle request timing
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add timestamp for request tracking
    (config as CustomAxiosRequestConfig).metadata = { startTime: new Date() };
    
    // Add request ID for debugging
    if (config.headers) {
      config.headers['X-Request-ID'] = Math.random().toString(36).substring(7);
    }

    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const config = response.config as CustomAxiosRequestConfig;
    const duration = config.metadata?.startTime 
      ? new Date().getTime() - config.metadata.startTime.getTime()
      : 0;

    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`
      );
    }

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Calculate request duration for failed requests
    const config = error.config as CustomAxiosRequestConfig;
    const duration = config?.metadata?.startTime 
      ? new Date().getTime() - config.metadata.startTime.getTime()
      : 0;

    // Enhanced error logging
    if (error.response) {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status} (${duration}ms)`,
        error.response.data
      );
    } else if (error.request) {
      console.error('[API Network Error]', error.message);
    } else {
      console.error('[API Setup Error]', error.message);
    }

    // Handle specific error cases
    if (error.response?.status === 429) {
      // Rate limiting
      console.warn('Rate limit exceeded. Please try again later.');
    } else if (error.response && error.response.status >= 500) {
      // Server errors
      console.error('Server error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

// Utility functions for common API operations
export const apiUtils = {
  // Check if error is due to authentication
  isAuthError: (error: AxiosError): boolean => {
    return error.response?.status === 401;
  },

  // Check if error is due to authorization
  isAuthorizationError: (error: AxiosError): boolean => {
    return error.response?.status === 403;
  },

  // Check if error is a network error
  isNetworkError: (error: AxiosError): boolean => {
    return !error.response && !!error.request;
  },

  // Get error message from response
  getErrorMessage: (error: AxiosError<ApiErrorResponse>): string => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Create a retry function for failed requests
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    
    throw lastError!;
  }
};

export default axiosInstance;