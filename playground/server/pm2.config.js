module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Nest Server
    {
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      ignore_watch: ['public'],
      name: 'nest',
      script: 'dist/main.js',
      watch: ['dist'],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
