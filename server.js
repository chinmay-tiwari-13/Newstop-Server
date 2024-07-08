const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const app = express();
const port = 3301;


app.use(helmet());

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from React dev server
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Set CORP header
  // req.setTimeout(60000); // Set request timeout
  next();
});

app.use(cors({
  origin: 'http://localhost:5173', // your React app's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // allow credentials
}));

app.get('/', async (req, res) => {

  const { country, page, pageSize } = req.query;
  const response = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
      country: country,
      page: page || 1,
      pageSize: pageSize || 20,
      apiKey: '5f084bc3eab349999f67ff89e9b07927'
    }
  });
  res.json(response.data);
});

app.get('/keyword', async (req, res) => {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  const tenDaysAgo = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  tenDaysAgo.setDate(currentDate.getDate() - 15);


  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(yesterday.getDate()).padStart(2, '0');
  const year2 = tenDaysAgo.getFullYear();
  const month2 = String(tenDaysAgo.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day2 = String(tenDaysAgo.getDate()).padStart(2, '0');
  const { keyword, language, page, pageSize } = req.query;
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        qInTitle: keyword,
        sortBy: 'relevancy',
        language: language || 'en',
        from: `${year}-${month}-${day}`,
        from: `${year2}-${month2}-${day2}`,
        // page: page || 1,
        // pageSize: pageSize || 20,
        apiKey: '5f084bc3eab349999f67ff89e9b07927'
      }
    });
    res.json(response.data);
  } catch (e) {
    // console.log(e);
  }
})


// const server = http.createServer(app);
// server.keepAliveTimeout = 60000 * 2;

app.listen(port, express.response, () => {
  console.log(`server is running at http://localhost:${port} and ${express.response} jo lena hai le lo`);
})