# Debugging Guide - 500 Error

## What to Check

When you get a 500 error, check the **server console** (where you ran `npm run server` or `npm run dev`). The error message will tell you what's wrong.

## Common Issues and Solutions

### 1. Credentials Not Set
**Error Message:** "LinkedIn credentials not found or not configured"

**Solution:**
- Open the `.env` file in the root directory
- Make sure `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD` are set with your actual credentials
- Make sure there are no quotes around the values
- Make sure there are no extra spaces
- Restart the server after changing the `.env` file

**Example:**
```env
LINKEDIN_EMAIL=your.email@example.com
LINKEDIN_PASSWORD=yourpassword123
```

### 2. ChromeDriver Not Working
**Error Message:** "Failed to initialize Chrome driver" or "ChromeDriver could not be found on the current PATH"

**Solution:**
- Make sure Google Chrome is installed
- Make sure ChromeDriver is installed locally: `npm install chromedriver`
- The code should automatically find ChromeDriver from node_modules
- If you still get errors, try:
  1. Delete `node_modules` folder
  2. Delete `package-lock.json`
  3. Run `npm install` again
- Make sure your Chrome browser version matches the ChromeDriver version
- Try updating Chrome to the latest version

### 3. LinkedIn Login Failed
**Error Message:** "Login failed" or "LinkedIn requires additional verification"

**Solution:**
- Check your credentials are correct
- LinkedIn may require CAPTCHA or 2FA
- Try logging into LinkedIn manually in a regular browser first
- If you have 2FA enabled, you may need to disable it temporarily for testing
- LinkedIn may be blocking automated logins - wait a few minutes and try again

### 4. LinkedIn Blocking Automated Access
**Error Message:** "LinkedIn requires additional verification" or login keeps failing

**Solution:**
- LinkedIn has strong anti-bot measures
- Try using a different LinkedIn account
- Make sure you're not making too many requests
- Wait a few minutes between requests
- Consider using LinkedIn's official API instead

### 5. Profile URL Invalid
**Error Message:** "Invalid LinkedIn URL provided"

**Solution:**
- Make sure the URL is a valid LinkedIn profile URL
- Format should be: `https://www.linkedin.com/in/username` or `https://linkedin.com/in/username`
- Make sure the profile is public (you can view it without being logged in)

### 6. Timeout Issues
**Error Message:** Timeout errors or "element not found"

**Solution:**
- The scraper may need more time to load the page
- Try again - LinkedIn pages can be slow to load
- Check your internet connection
- The profile might be private or require login

## How to Debug

### Step 1: Check Server Logs
Look at the terminal where you ran the server. You should see detailed error messages like:
- `Starting scrapeProfile function...`
- `Credentials check - Email: ...`
- `Setting up Chrome driver...`
- `Logging in to LinkedIn...`

### Step 2: Check Browser Window
When the scraper runs, a Chrome window should open. Watch it to see:
- Does it navigate to LinkedIn login page?
- Does it enter credentials?
- Does it successfully log in?
- Does it navigate to the profile page?
- What error appears on the page?

### Step 3: Check .env File
```bash
# In PowerShell (Windows)
Get-Content .env
```

Make sure:
- File exists in the root directory
- Credentials are set (not the placeholder values)
- No extra spaces or quotes

### Step 4: Test Credentials Manually
1. Open Chrome browser
2. Go to https://www.linkedin.com/login
3. Try logging in with the same credentials from your `.env` file
4. If it doesn't work, your credentials are wrong

## Getting More Information

### Enable Detailed Logging
The server now logs detailed information. Check the server console for:
- What step it's on
- What error occurred
- Stack traces (in development mode)

### Check Chrome Window
The scraper runs in non-headless mode (you'll see the browser). Watch it to see what's happening:
- Is Chrome opening?
- Is it navigating to LinkedIn?
- Is it finding the login form?
- Is it entering credentials?
- Is login successful?

## Still Having Issues?

1. **Restart the server** - Sometimes a fresh start helps
2. **Check Chrome is installed** - Make sure Google Chrome is installed and up to date
3. **Check Node.js version** - Make sure you're using Node.js v14 or higher
4. **Reinstall dependencies** - Try `npm install` again
5. **Check internet connection** - Make sure you can access LinkedIn in a regular browser
6. **Try a different profile** - Some profiles may be private or have restrictions

## Contact for Help

If you're still having issues, provide:
1. The exact error message from the server console
2. A screenshot of the Chrome window (if it opens)
3. Your Node.js version: `node --version`
4. Your Chrome version: Check in Chrome settings
5. The LinkedIn profile URL you're trying to scrape

