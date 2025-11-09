# LinkedIn Profile Scraper
A web application that scrapes LinkedIn profile data using Selenium WebDriver and outputs the data in a CSV file. Built with React and Node.js.

## Features
- Scrape LinkedIn profile data including name, title, location, about, experiences, education, and recommendations
- Output data to a CSV file
- Web interface built with React and Node.js
- Real-time data extraction using Selenium WebDriver

## Requirements
- Node.js (v14 or higher)
- Google Chrome browser
- LinkedIn account credentials

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
Create a `.env` file in the root directory with your LinkedIn credentials:

```env
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password
PORT=3001
```

**Important**: Never commit your `.env` file to version control.

## Usage

### Option 1: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev
```

This will start both the React frontend (port 3000) and the backend server (port 3001) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Using the Application

1. Open your web browser and navigate to `http://localhost:3000`
2. Enter the URL of the LinkedIn profile you want to scrape (e.g., `https://www.linkedin.com/in/username`)
3. Click the "Extract Data" button
4. Wait for the data to be scraped and displayed on the page

## Troubleshooting

### Common Issues

1. **"LinkedIn credentials not found"**
   - Make sure you have created a `.env` file with `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD`

2. **"LinkedIn requires additional verification (CAPTCHA or 2FA)"**
   - LinkedIn may require CAPTCHA or 2FA verification
   - Try logging into LinkedIn manually in a regular browser first

3. **"Cannot fetch data"**
   - Make sure the backend server is running on port 3001
   - Check the browser console and server logs for error messages

4. **"ChromeDriver not found"**
   - Make sure Chrome browser is installed
   - The chromedriver package should be installed automatically with `npm install`

For more detailed troubleshooting, see [SETUP.md](SETUP.md)

## Security Warning

⚠️ **Never share your `.env` file or commit it to version control.**
⚠️ **Using automated scraping may violate LinkedIn's Terms of Service. Use at your own risk.**

## License
This project is licensed under the MIT License.
