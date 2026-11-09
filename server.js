const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is up and connected perfectly on Meera Host!',
    environment: config.app.env,
  });
});

// اضافه شدن 0.0.0.0 مشکل PodInitializing را در هاست ابری حل می‌کند
app.listen(config.app.port, '0.0.0.0', () => {
  console.log(`Server is running on port ${config.app.port}`);
});
