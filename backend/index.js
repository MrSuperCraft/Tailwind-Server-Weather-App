// Load environment variables from .env file
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cors());

app.get('/api-key', (req, res) => {
  try {
    const apiKey = process.env.PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
      console.error('API key not found in environment variables');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ apiKey });
  } catch (error) {
    console.error('Error retrieving API key:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
