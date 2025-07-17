export const environment = {
  production: false,
  apiUrl: 'https://twvn323zg6.execute-api.ap-southeast-1.amazonaws.com/dev', // Replace with your dev API Gateway URL
  apiTimeout: 15000, // 15 seconds timeout
  maxRetries: 5,     // Increased from 3 to 5 for AI model high load scenarios
  retryDelay: 1000,  // 1 second initial delay between retries
  aiModelSettings: {
    maxRetries: 8,    // More retries for AI model endpoints
    initialDelay: 2000, // 2 seconds initial delay
    maxDelay: 30000  // Maximum delay of 30 seconds
  }
};