# LinkedIn Scraper - Setup Guide

## Issues Fixed

1. **Backend Server**: Added server script to package.json
2. **Credentials**: Now uses environment variables from `.env` file
3. **ChromeDriver**: Added chromedriver package for Selenium
4. **Error Handling**: Improved error handling throughout the code
5. **LinkedIn Selectors**: Updated selectors to work with current LinkedIn structure
6. **Code Bugs**: Fixed syntax errors and null reference issues

## Setup Instructions

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

**Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

### 3. Run the Application

You have two options:

#### Option A: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev
```

This will start both the React frontend (port 3000) and the backend server (port 3001) simultaneously.

#### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### 4. Use the Application

1. Open your browser and go to `http://localhost:3000`
2. Paste a LinkedIn profile URL (e.g., `https://www.linkedin.com/in/username`)
3. Click "Extract Data"
4. Wait for the data to be scraped and displayed

## Troubleshooting

### Issue: "LinkedIn credentials not found"
- Make sure you have created a `.env` file in the root directory
- Check that `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD` are set correctly

### Issue: "LinkedIn requires additional verification (CAPTCHA or 2FA)"
- LinkedIn may require you to complete a CAPTCHA or 2FA verification
- Try logging into LinkedIn manually in a regular browser first
- Consider disabling 2FA temporarily for testing (not recommended for production)

### Issue: "ChromeDriver not found"
- Make sure Chrome browser is installed
- The chromedriver package should be installed automatically with `npm install`
- If issues persist, you may need to manually install ChromeDriver or update Chrome browser

### Issue: "Cannot fetch data"
- Make sure the backend server is running on port 3001
- Check the browser console and server logs for error messages
- Verify the LinkedIn URL is correct and the profile is public

### Issue: Selectors not finding elements
- LinkedIn frequently changes their HTML structure
- The scraper uses multiple fallback selectors, but if LinkedIn changes significantly, you may need to update the selectors in `src/scraper.js`
- Check the browser console for specific error messages

## Notes

- The scraper runs in non-headless mode by default (you'll see the browser window). This helps with debugging.
- To run in headless mode, uncomment the headless option in `src/scraper.js` line 35
- LinkedIn may rate-limit or block automated access. Use responsibly.
- Some profiles may have privacy settings that prevent scraping certain information.

## Security Warning

⚠️ **Never share your `.env` file or commit it to version control.**
⚠️ **Using automated scraping may violate LinkedIn's Terms of Service. Use at your own risk.**

