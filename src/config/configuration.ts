export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
    ttl: parseInt(process.env.REDIS_TTL as string, 10) || 3600,
  },
  storage: {
    path: process.env.FILE_STORAGE_PATH || './storage',
    maxSize: parseInt(process.env.FILE_MAX_SIZE as string, 10) || 10485760,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },
  apiKey: process.env.API_KEY,
});

