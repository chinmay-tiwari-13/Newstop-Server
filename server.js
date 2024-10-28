const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = 3301;

app.use(helmet());
app.use(cors({
  origin: 'https://newstoplive.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.get('/', async (req, res) => {
  const { country, page, pageSize } = req.query;
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: country || 'us',
        page: page || 1,
        pageSize: pageSize || 20,
        apiKey: '5f084bc3eab349999f67ff89e9b07927'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top headlines:", error.message);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/keyword', async (req, res) => {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  const tenDaysAgo = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  tenDaysAgo.setDate(currentDate.getDate() - 15);

  const { keyword, language, page, pageSize } = req.query;
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        qInTitle: keyword,
        sortBy: 'relevancy',
        language: language || 'en',
        from: `${tenDaysAgo.toISOString().split('T')[0]}`,
        to: `${yesterday.toISOString().split('T')[0]}`,
        page: page || 1,
        pageSize: pageSize || 20,
        apiKey: '5f084bc3eab349999f67ff89e9b07927'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching keyword data:", error.message);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
