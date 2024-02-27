const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const axios = require('axios');

exports.openai = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    console.log('Request body:', request.body);  // Log the request body

    const { prompt } = request.body;

    try {
      const gptResponse = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
        prompt,
        max_tokens: 60,
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      console.log('OpenAI API response:', gptResponse.data);  // Log the OpenAI API response

      response.json(gptResponse.data.choices[0].text.trim());
    } catch (err) {
      console.error('Error:', err);  // Log any errors
      response.status(500).json({error: err.message});
    }
  });
});