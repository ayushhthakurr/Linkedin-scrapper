# Troubleshooting Guide

## Common Errors and Solutions

### Error: "Cannot connect to server" or "Failed to fetch"

**Cause:** The backend server is not running.

**Solution:**
1. Make sure you have started the backend server:
   ```bash
   npm run server
   ```
   Or run both frontend and backend together:
   ```bash
   npm run dev
   ```

2. Check if the server is running on port 3001:
   - Open your browser and go to: `http://localhost:3001/scrape?url=test`
   - You should see an error response (not a connection error)

3. Check if port 3001 is already in use:
   ```bash
   netstat -ano | findstr :3001
   ```
   If another process is using it, stop that process or change the PORT in .env file

### Error: "LinkedIn credentials not found"

**Cause:** The .env file is missing or credentials are not set.

**Solution:**
1. Make sure `.env` file exists in the root directory
2. Check that it contains:
   ```env
   LINKEDIN_EMAIL=your_email@example.com
   LINKEDIN_PASSWORD=your_password
   ```
3. Make sure there are no quotes around the values
4. Restart the server after changing .env file

### Error: "ChromeDriver not found"

**Cause:** ChromeDriver is not installed or not in PATH.

**Solution:**
1. Make sure ChromeDriver is installed:
   ```bash
   npm install chromedriver
   ```
2. Verify ChromeDriver is accessible:
   ```bash
   chromedriver --version
   ```
3. If using global installation, make sure it's in your PATH

### Error: "Login failed" or "LinkedIn requires additional verification"

**Cause:** LinkedIn is blocking the login or requires CAPTCHA/2FA.

**Solution:**
1. Check your credentials are correct in .env file
2. Try logging into LinkedIn manually in a regular browser first
3. Complete any CAPTCHA or 2FA verification
4. If you have 2FA enabled, you may need to disable it temporarily for testing
5. LinkedIn may be blocking automated logins - wait a few minutes and try again

### Error: "Failed to initialize Chrome driver"

**Cause:** Chrome browser is not installed or ChromeDriver version mismatch.

**Solution:**
1. Make sure Google Chrome is installed
2. Check Chrome version matches ChromeDriver version
3. Update Chrome to the latest version
4. Reinstall ChromeDriver:
   ```bash
   npm uninstall chromedriver
   npm install chromedriver
   ```

### Error: Timeout or "Request timeout"

**Cause:** The scraping operation is taking too long.

**Solution:**
1. The server timeout is set to 5 minutes - this should be enough
2. Check the Chrome window - it might be waiting for manual intervention
3. LinkedIn pages can be slow to load - be patient
4. Check your internet connection

### Error: "Invalid LinkedIn URL provided"

**Cause:** The URL format is incorrect.

**Solution:**
1. Make sure the URL is a valid LinkedIn profile URL
2. Format should be: `https://www.linkedin.com/in/username`
3. Make sure the URL includes "linkedin.com"
4. The profile should be public (you can view it without being logged in)

### Error: "Element not found" or scraping returns empty data

**Cause:** LinkedIn has changed their HTML structure or the profile is private.

**Solution:**
1. Check if the profile is public - try viewing it in a regular browser
2. LinkedIn frequently changes their HTML - the selectors may need updating
3. Check the server console for specific error messages
4. Some profiles may have privacy settings that prevent scraping

## Debugging Steps

### 1. Check Server Logs

Look at the terminal where you ran `npm run server`. You should see:
- `Server is running on port 3001`
- `Received scrape request for URL: ...`
- `Starting scrapeProfile function...`
- `ChromeDriver path: ...`
- `Chrome driver initialized successfully`
- Any error messages

### 2. Check Browser Console

Open your browser's developer console (F12) and look for:
- Network errors
- CORS errors
- JavaScript errors
- Request/response details

### 3. Check Chrome Window

When scraping, a Chrome window should open. Watch it to see:
- Does it navigate to LinkedIn?
- Does it try to log in?
- What error appears on the page?
- Does it navigate to the profile?

### 4. Verify Environment

Check that:
- Node.js is installed: `node --version`
- npm is installed: `npm --version`
- Chrome is installed
- ChromeDriver is installed: `chromedriver --version`
- .env file exists and has correct credentials

## Getting Help

If you're still having issues:

1. **Check the exact error message** - Copy the full error from the React app and server console
2. **Check server logs** - Look at the terminal where the server is running
3. **Check Chrome window** - Take a screenshot of what's happening in the browser
4. **Verify setup** - Make sure all dependencies are installed and configured correctly

## Quick Checklist

- [ ] Backend server is running (`npm run server`)
- [ ] Frontend is running (`npm start`)
- [ ] .env file exists with correct credentials
- [ ] Chrome browser is installed
- [ ] ChromeDriver is installed and accessible
- [ ] LinkedIn URL is valid and public
- [ ] Internet connection is working
- [ ] No firewall blocking localhost:3001

