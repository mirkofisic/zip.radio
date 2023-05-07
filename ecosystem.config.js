module.exports = {
  apps: [
    {
      name: 'zipradio',
      instances: 1,
      exec_mode: 'cluster',
      script: 'dist/ssr/index.js',
      watch: '.',
    },
  ],
}
