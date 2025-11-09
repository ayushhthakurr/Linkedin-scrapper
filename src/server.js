require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scrapeProfile = require('./scraper');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Increase timeout for long-running requests (scraping can take 60+ seconds)
// This must be before the route handlers
app.use((req, res, next) => {
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
});

app.get('/scrape', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    console.log('Received scrape request for URL:', url);
    console.log('Environment check - LINKEDIN_EMAIL:', process.env.LINKEDIN_EMAIL ? 'Set' : 'Not set');
    console.log('Environment check - LINKEDIN_PASSWORD:', process.env.LINKEDIN_PASSWORD ? 'Set' : 'Not set');
    
    const data = await scrapeProfile(url);
    res.json(data);
  } catch (error) {
    console.error('Error in /scrape endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'An error occurred while scraping the profile',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Make sure you have set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in .env file');
  console.log('Server timeout set to 5 minutes for scraping operations');
});
