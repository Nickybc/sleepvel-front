module.exports = {
  apps: [
    {
      name: 'qilu-sle.me',
      script: 'npm',
      args: 'start',
      cwd: './', // Set the working directory to the root of your project
      instances: 1, // You can set this to "max" to use all CPU cores
      watch: false, // Set to true for development, false for production
      max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
      interpreter: 'none',
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 8555,
      },

      // Logging configuration
      log_file: './.logs/qilu-sle.me.log',
      out_file: './.logs/qilu-sle.me-out.log',
      error_file: './.logs/qilu-sle.me-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Advanced PM2 options
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,

      // Process management
      kill_timeout: 5000,
      listen_timeout: 8000,

      // Additional options
      merge_logs: true,
      time: true,
    },
  ],
};
