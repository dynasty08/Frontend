export const environment = {
  production: false,
  apiUrl: 'https://5h3lq6djc4.execute-api.ap-southeast-1.amazonaws.com/dev',
  apiTimeout: 15000,
  maxRetries: 5,
  retryDelay: 1000,
  aiModelSettings: {
    maxRetries: 8,
    initialDelay: 2000,
    maxDelay: 30000
  }
};