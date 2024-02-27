require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai-api');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
});

app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  try {
    const gptResponse = await openai.complete({
      engine: 'davinci-codex',
      prompt,
      maxTokens: 60,
    });

    res.json(gptResponse.data.choices[0].text.trim());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));