module.exports = {
  apps: [
    {
      name: "ecommerce",
      script: "src/app.js", // no leading ./ needed
      watch: true,
      watch_options: {
        usePolling: true, // required on Windows
        interval: 1000,
        ignoreInitial: true
      },
      ignore_watch: [
        "node_modules",
        "uploads",
        "logs",
        "*.log"
      ]
    }
  ]
};
