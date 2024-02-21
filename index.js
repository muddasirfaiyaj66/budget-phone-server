const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const apiKey = process.env.API_KEY;

app.use(bodyParser.json());

app.post('/getPhoneSuggestions', async (req, res) => {
    const userMessage = req.body.userMessage;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo-0125', 
                messages: [
                    { role: 'system', content: 'User wants a budget phone.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 2000,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        console.log('OpenAI API Response:', response.data);

        
        if (response.data.choices && response.data.choices.length > 0) {
            const phoneNames = response.data.choices[0].message.content;
            res.json({ suggestions: phoneNames });
        } else {
            throw new Error('No suggestions found');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
