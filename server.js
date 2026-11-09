const express = require('express');
const app = express();

// سرورهای ابری پورت را خودشان به برنامه می‌دهند.
// اگر پورتی داده نشد، از 3000 استفاده کن.
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hello from Mardinblo! Your Node.js app is deployed via GitHub.',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${port}`);
});