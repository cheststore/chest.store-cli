const appName = process.env.APP_NAME || 'chest.store-cli'

export default {
  apiKeyHeader: 'x-cheststore-key',
  configPath: process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'],

  app: {
    name: appName,
  },

  logger: {
    options: {
      name: appName,
      streams: [
        {
          level: process.env.LOGGING_LEVEL || 'info',
          stream: process.stdout,
        },
      ],
    },
  },
}
