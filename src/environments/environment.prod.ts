export const environment = {
  production: true,
  apiUrl: 'https://mrshckarmg.execute-api.ap-southeast-1.amazonaws.com/dev',
  apiTimeout: 10000, // 10 seconds timeout
  maxRetries: 5,     // Retry settings for production
  retryDelay: 1000,  // 1 second initial delay between retries
  aiModelSettings: {
    maxRetries: 8,    // More retries for AI model endpoints
    initialDelay: 2000, // 2 seconds initial delay
    maxDelay: 30000  // Maximum delay of 30 seconds
  }
};