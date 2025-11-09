const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
require('dotenv').config();

// Function to get ChromeDriver path
// Priority: Global npm (142) > System PATH (142) > Local node_modules
function getChromeDriverPath() {
  const fs = require('fs');
  const { execSync } = require('child_process');
  
  // FIRST: Try to find ChromeDriver in global npm location (142) - HIGHEST PRIORITY
  // This is where the user's ChromeDriver 142 is actually installed
  // We use this first to avoid any conflicts with local node_modules
  try {
    const os = require('os');
    const homedir = os.homedir();
    const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
    const globalPaths = [
      path.join(appData, 'npm', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe'),
      path.join(homedir, 'AppData', 'Roaming', 'npm', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe'),
    ];
    
    for (const globalPath of globalPaths) {
      if (globalPath && fs.existsSync(globalPath)) {
        console.log('✅ Found ChromeDriver 142 in global npm installation:', globalPath);
        console.log('Using ChromeDriver 142 explicitly (matches Chrome 142)');
        return globalPath; // Return the explicit path to ChromeDriver 142
      }
    }
    console.log('ChromeDriver not found in global npm installation');
  } catch (e) {
    console.log('Error checking global npm installation:', e.message);
  }
  
  // SECOND: Check system PATH for ChromeDriver (user has 142 installed globally)
  // Fallback if global npm installation not found
  try {
    const versionOutput = execSync('chromedriver --version', { 
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true
    });
    const version = versionOutput.trim();
    console.log('ChromeDriver found in system PATH:', version);
    
    // Check if it's version 142 (matches Chrome 142)
    if (version.includes('142.')) {
      console.log('✅ ChromeDriver 142 found in system PATH');
      // Return null to let Selenium use system PATH
      // Selenium should find ChromeDriver 142 from PATH
      return null;
    } else {
      console.log('⚠️ Warning: System PATH ChromeDriver version may not match Chrome 142');
      console.log('System PATH version:', version);
    }
  } catch (e) {
    console.log('ChromeDriver not found in system PATH');
  }
  
  // LAST RESORT: Try local node_modules (but warn if version mismatch)
  try {
    const chromedriver = require('chromedriver');
    if (chromedriver.path && fs.existsSync(chromedriver.path)) {
      console.log('Found ChromeDriver in local node_modules:', chromedriver.path);
      console.log('WARNING: Local ChromeDriver may be version 122, but Chrome is 142.');
      console.log('Consider using system PATH ChromeDriver 142 or updating local installation.');
      // Still return it, but it might cause issues
      return chromedriver.path;
    }
  } catch (e) {
    console.log('Local chromedriver package not found or error:', e.message);
  }
  
  // Fallback: try to find chromedriver in node_modules manually
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe'),
    path.join(__dirname, '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe'),
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      console.log('Found ChromeDriver in project node_modules:', possiblePath);
      console.log('WARNING: This may be version 122. Chrome is version 142.');
      return possiblePath;
    }
  }
  
  // Final fallback: return null to use system PATH
  console.log('Using ChromeDriver from system PATH (final fallback)');
  return null;
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;


async function scrapeProfile(url) {
  let driver;
  try {
    console.log('Starting scrapeProfile function...');
    console.log('URL received:', url);
    
    // Validate URL
    if (!url || !url.includes('linkedin.com')) {
      throw new Error('Invalid LinkedIn URL provided. URL must contain "linkedin.com"');
    }

    // Validate credentials
    const linkedinEmail = process.env.LINKEDIN_EMAIL || '';
    const linkedinPassword = process.env.LINKEDIN_PASSWORD || '';
    
    console.log('Credentials check - Email:', linkedinEmail ? `${linkedinEmail.substring(0, 3)}***` : 'NOT SET');
    console.log('Credentials check - Password:', linkedinPassword ? '***SET***' : 'NOT SET');
    
    if (!linkedinEmail || !linkedinPassword || linkedinEmail === 'your_email@example.com' || linkedinPassword === 'your_password') {
      throw new Error('LinkedIn credentials not found or not configured. Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in .env file with your actual credentials');
    }

    console.log('Setting up Chrome driver...');
    
    // Get ChromeDriver path
    const chromedriverPath = getChromeDriverPath();
    console.log('ChromeDriver path:', chromedriverPath || 'Using system PATH');
    
    const options = new chrome.Options();
    
    // Basic options
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-popup-blocking');
    options.addArguments('--disable-plugins-discovery');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    
    // Options for newer Chrome versions (compatible with ChromeDriver 142+)
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--disable-features=IsolateOrigins,site-per-process');
    options.addArguments('--disable-infobars');
    options.addArguments('--disable-notifications');
    options.addArguments('--disable-logging');
    options.addArguments('--log-level=3');
    
    // Experimental options to avoid detection as automated browser
    options.addArguments('--exclude-switches=enable-automation');
    options.addArguments('--exclude-switches=enable-logging');
    
    // User agent for Chrome 142
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');
    
    // Comment out headless mode for debugging - uncomment when working
    // options.addArguments("--headless=new");
    
    try {
      const builder = new Builder().forBrowser('chrome').setChromeOptions(options);
      
      // Set up ChromeDriver service with the path if found
      // If chromedriverPath is null, Selenium will use system PATH (which has ChromeDriver 142)
      if (chromedriverPath) {
        const service = new chrome.ServiceBuilder(chromedriverPath);
        builder.setChromeService(service);
        console.log('Using ChromeDriver from specified path:', chromedriverPath);
      } else {
        // chromedriverPath is null - Selenium will automatically use ChromeDriver from system PATH
        console.log('Using ChromeDriver from system PATH (Selenium will find it automatically)');
        // Don't set a service - let Selenium find ChromeDriver 142 from PATH
      }
      
      driver = await builder.build();
      console.log('Chrome driver initialized successfully');
    } catch (driverError) {
      console.error('Error initializing Chrome driver:', driverError);
      console.error('Error details:', driverError.message);
      console.error('Full error:', driverError);
      if (chromedriverPath) {
        console.error('ChromeDriver path attempted:', chromedriverPath);
      } else {
        console.error('ChromeDriver was expected to be found in system PATH');
        console.error('Make sure ChromeDriver 142 is installed and accessible via: chromedriver --version');
      }
      throw new Error(`Failed to initialize Chrome driver: ${driverError.message}. Make sure Chrome browser version 142 is installed and ChromeDriver 142 is in your system PATH.`);
    }

    driver.manage().setTimeouts({ implicit: 10000, pageLoad: 30000 });

    console.log('Logging in to LinkedIn...');
    // Login to LinkedIn
    try {
      await driver.get('https://www.linkedin.com/login');
      await driver.sleep(3000);
      
      console.log('Finding login form elements...');
      const emailInput = await driver.wait(until.elementLocated(By.id('username')), 15000);
      const passwordInput = await driver.findElement(By.id('password'));
      
      console.log('Entering credentials...');
      await emailInput.clear();
      await emailInput.sendKeys(linkedinEmail);
      await driver.sleep(1000);
      await passwordInput.clear();
      await passwordInput.sendKeys(linkedinPassword);
      await driver.sleep(1000);
      await passwordInput.sendKeys(Key.RETURN);
      
      // Wait for login to complete
      console.log('Waiting for login to complete...');
      await driver.sleep(5000);
      
      // Check if login was successful or requires verification
      let currentUrl = await driver.getCurrentUrl();
      console.log('Current URL after login attempt:', currentUrl);
      
      // If LinkedIn requires CAPTCHA or 2FA, wait for manual completion
      if (currentUrl.includes('challenge') || currentUrl.includes('checkpoint') || currentUrl.includes('authwall')) {
        console.log('⚠️ LinkedIn requires additional verification (CAPTCHA or 2FA)');
        console.log('📋 INSTRUCTIONS:');
        console.log('   1. Look at the Chrome browser window that opened');
        console.log('   2. Complete the CAPTCHA or 2FA verification manually');
        console.log('   3. Wait until you are logged into LinkedIn (you should see your feed or profile)');
        console.log('   4. The scraper will automatically continue once verification is complete...');
        console.log('   ⏳ Waiting up to 3 minutes for manual verification...');
        
        // Wait for user to complete verification (poll every 5 seconds, up to 3 minutes)
        const maxWaitTime = 180000; // 3 minutes
        const pollInterval = 5000; // 5 seconds
        const startTime = Date.now();
        let verificationComplete = false;
        
        while (Date.now() - startTime < maxWaitTime && !verificationComplete) {
          await driver.sleep(pollInterval);
          currentUrl = await driver.getCurrentUrl();
          
          // Check if we're past the verification page
          if (!currentUrl.includes('challenge') && 
              !currentUrl.includes('checkpoint') && 
              !currentUrl.includes('authwall') &&
              !currentUrl.includes('login') &&
              !currentUrl.includes('signin')) {
            verificationComplete = true;
            console.log('✅ Verification completed! Continuing with scraping...');
            console.log('Current URL:', currentUrl);
            break;
          }
          
          // Show progress
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          console.log(`   Still waiting for verification... (${elapsed}s / 180s)`);
        }
        
        if (!verificationComplete) {
          throw new Error('Verification timeout: LinkedIn verification was not completed within 3 minutes. Please try again and complete the verification faster.');
        }
      } else if (currentUrl.includes('login') || currentUrl.includes('signin')) {
        // Check if login failed
        await driver.sleep(3000); // Wait a bit more in case page is still loading
        currentUrl = await driver.getCurrentUrl();
        
        if (currentUrl.includes('login') || currentUrl.includes('signin')) {
          // Check for error messages on the page
          try {
            const errorElements = await driver.findElements(By.css('.alert-error, .error, [role="alert"]'));
            if (errorElements.length > 0) {
              const errorText = await errorElements[0].getText();
              throw new Error(`Login failed: ${errorText}. Please check your credentials in the .env file.`);
            }
          } catch (e) {
            // Ignore if we can't find error elements
          }
          
          throw new Error('Login failed. Please check your credentials in the .env file. LinkedIn may also be blocking automated logins.');
        }
      }
      
      console.log('✅ Login successful!');
      console.log('Current URL:', currentUrl);
    } catch (loginError) {
      console.error('Login error:', loginError);
      throw new Error(`Login failed: ${loginError.message}`);
    }

    console.log('Navigating to profile:', url);
    await driver.get(url);
    await driver.sleep(5000); // Increased wait time for page to load

    // Wait for page to be interactive
    await driver.executeScript('return document.readyState === "complete"');
    await driver.sleep(2000);

    // Scroll slowly to load all content
    await driver.executeScript('window.scrollTo(0, 300);');
    await driver.sleep(1000);
    await driver.executeScript('window.scrollTo(0, 600);');
    await driver.sleep(1000);
    await driver.executeScript('window.scrollTo(0, 900);');
    await driver.sleep(2000);

    let name = "*missing value*";
    let title = "*missing value*";
    let location = "*missing value*";
    let about = "*missing value*";

    // Try multiple selectors for name (LinkedIn changes their structure frequently)
    const nameSelectors = [
      "h1.text-heading-xlarge",
      "h1[class*='text-heading-xlarge']",
      "h1.top-card-layout__title",
      "h1[class*='top-card-layout__title']",
      "h1.inline.t-24.t-black.t-normal.break-words",
      "h1[data-anonymize='person-name']",
      "h1.pv-text-details__left-panel h1",
      "main h1",
      "section[data-section='topCard'] h1",
      "div.ph5 h1",
      "h1[class*='text-heading']",
    ];

    console.log('Looking for name element...');
    for (const selector of nameSelectors) {
      try {
        const nameElement = await driver.wait(
          until.elementLocated(By.css(selector)), 
          5000
        );
        name = await nameElement.getText();
        if (name && name.trim() !== '' && name !== '*missing value*') {
          console.log(`✅ Name found using selector "${selector}":`, name);
          break;
        }
      } catch (e) {
        // Try next selector
        continue;
      }
    }

    if (name === "*missing value*") {
      // Last resort: try to find any h1 in the top section
      try {
        const allH1s = await driver.findElements(By.css('main h1, section h1, div.ph5 h1, h1'));
        for (const h1 of allH1s) {
          try {
            const text = await h1.getText();
            if (text && text.trim() !== '' && text.length > 2 && text.length < 100 && !text.includes('@')) {
              name = text.trim();
              console.log('✅ Name found (fallback method):', name);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        console.log('Name not found with h1 elements:', e.message);
      }
      
      // Another fallback: use JavaScript to extract name from page metadata or structured data
      if (name === "*missing value*") {
        try {
          const nameFromJS = await driver.executeScript(`
            // Try to find name in various ways
            const h1Elements = document.querySelectorAll('h1');
            for (let h1 of h1Elements) {
              const text = h1.textContent.trim();
              if (text && text.length > 2 && text.length < 100 && !text.includes('@') && !text.includes('Building')) {
                return text;
              }
            }
            // Try meta tags
            const metaName = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="title"]');
            if (metaName && metaName.content) {
              return metaName.content.split('|')[0].trim();
            }
            // Try title attribute
            const titleElement = document.querySelector('[data-anonymize="person-name"]');
            if (titleElement) {
              return titleElement.textContent.trim();
            }
            return null;
          `);
          if (nameFromJS && nameFromJS.trim() !== '') {
            name = nameFromJS.trim();
            console.log('✅ Name found (JavaScript method):', name);
          }
        } catch (e) {
          console.log('Name not found with JavaScript method:', e.message);
        }
      }
    }

    // Try multiple selectors for title
    const titleSelectors = [
      ".text-body-medium.break-words",
      "[class*='text-body-medium']",
      ".pv-text-details__left-panel .text-body-medium",
      ".top-card-layout__headline",
      "[class*='top-card-layout__headline']",
      ".inline.t-24.t-black.t-normal.break-words",
      "div.ph5 .text-body-medium",
      "section[data-section='topCard'] .text-body-medium",
    ];

    console.log('Looking for title element...');
    for (const selector of titleSelectors) {
      try {
        const titleElement = await driver.findElement(By.css(selector));
        title = await titleElement.getText();
        if (title && title.trim() !== '' && title !== '*missing value*') {
          console.log(`✅ Title found using selector "${selector}":`, title);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (title === "*missing value*") {
      console.log('Title not found with standard selectors');
    }

    // Try multiple selectors for location
    const locationSelectors = [
      ".text-body-small.inline.t-black--light.break-words",
      "[class*='text-body-small']:not([class*='text-body-medium'])",
      ".pv-text-details__left-panel span.text-body-small",
      ".top-card-layout__first-subline",
      "[class*='top-card-layout__first-subline']",
      "span.text-body-small.inline",
      "div.ph5 span.text-body-small",
    ];

    console.log('Looking for location element...');
    for (const selector of locationSelectors) {
      try {
        const locationElements = await driver.findElements(By.css(selector));
        for (const locElement of locationElements) {
          const locText = await locElement.getText();
          if (locText && locText.trim() !== '' && locText.length > 2) {
            location = locText.trim();
            console.log(`✅ Location found using selector "${selector}":`, location);
            break;
          }
        }
        if (location !== "*missing value*") break;
      } catch (e) {
        continue;
      }
    }

    if (location === "*missing value*") {
      console.log('Location not found with standard selectors');
    }

    try {
      // Try multiple selectors for About section
      const aboutSelectors = [
        "section[data-section='summary'] span[aria-hidden='true']",
        "#about ~ div span[aria-hidden='true']",
        "section:has(#about) span[aria-hidden='true']",
        ".pv-about-section .pv-about__summary-text span"
      ];
      
      for (const selector of aboutSelectors) {
        try {
          const aboutElement = await driver.findElement(By.css(selector));
          about = await aboutElement.getText();
          if (about && about.trim() !== '') {
            console.log('About found');
            break;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.log('About not found:', e.message);
    }

    const experiences = [];
    try {
      // Scroll to experience section
      await driver.executeScript(`
        const experienceSection = document.querySelector('section[data-section="experience"]') || document.querySelector('#experience');
        if (experienceSection && experienceSection.closest) {
          experienceSection.closest('section').scrollIntoView({ behavior: 'smooth' });
        } else if (experienceSection) {
          experienceSection.scrollIntoView({ behavior: 'smooth' });
        }
      `);
      await driver.sleep(2000);

      const jobSelectors = [
        'section[data-section="experience"] ul li',
        '#experience ~ div ul li',
        'section:has(#experience) ul li'
      ];
      
      let jobs = [];
      for (const selector of jobSelectors) {
        try {
          jobs = await driver.findElements(By.css(selector));
          if (jobs.length > 0) break;
        } catch (e) {
          continue;
        }
      }

      console.log(`Found ${jobs.length} experience entries`);
      
      for (const job of jobs) {
        try {
          const exp = {};
          try {
            const positionElement = await job.findElement(By.css('span[class*="t-bold"], span[aria-hidden="true"]'));
            exp.Position = await positionElement.getText();
          } catch (e) {
            exp.Position = '*missing value*';
          }

          try {
            const companyElement = await job.findElement(By.css('span[class*="t-normal"]:not([class*="t-black--light"])'));
            exp.Company = await companyElement.getText();
          } catch (e) {
            exp.Company = '*missing value*';
          }

          try {
            const dateRangeElement = await job.findElement(By.css('span[class*="t-black--light"], span[class*="t-normal"]'));
            let dateRange = await dateRangeElement.getText();
            exp['Date Range'] = dateRange.replace('Dates Employed', '').replace('Full-time', '').replace('Part-time', '').trim();
          } catch (e) {
            exp['Date Range'] = '*missing value*';
          }

          try {
            const locationElement = await job.findElement(By.css('span[class*="t-black--light"]:nth-of-type(2)'));
            exp.Location = await locationElement.getText();
          } catch (e) {
            exp.Location = '*missing value*';
          }

          try {
            const descElement = await job.findElement(By.css('span[aria-hidden="true"], ul li ul span'));
            exp.Description = await descElement.getText();
          } catch (e) {
            exp.Description = '*missing value*';
          }

          if (exp.Position !== '*missing value*' || exp.Company !== '*missing value*') {
            experiences.push(exp);
          }
        } catch (e) {
          console.log('Error parsing experience entry:', e.message);
          continue;
        }
      }
    } catch (e) {
      console.log('Experience section not found:', e.message);
    }

    
    // Education
    let education = [];
    try {
      await driver.executeScript(`
        const educationSection = document.querySelector('section[data-section="education"]') || document.querySelector('#education');
        if (educationSection && educationSection.closest) {
          educationSection.closest('section').scrollIntoView({ behavior: 'smooth' });
        } else if (educationSection) {
          educationSection.scrollIntoView({ behavior: 'smooth' });
        }
      `);
      await driver.sleep(2000);

      const educationSelectors = [
        'section[data-section="education"] ul li',
        '#education ~ div ul li',
        'section:has(#education) ul li'
      ];
      
      let education_list = [];
      for (const selector of educationSelectors) {
        try {
          education_list = await driver.findElements(By.css(selector));
          if (education_list.length > 0) break;
        } catch (e) {
          continue;
        }
      }

      console.log(`Found ${education_list.length} education entries`);

      for (let edu of education_list) {
        try {
          let edu_dict = {};
          try {
            const schoolElement = await edu.findElement(By.css('span[class*="t-bold"], span[aria-hidden="true"]'));
            edu_dict['School'] = await schoolElement.getText();
          } catch (e) {
            edu_dict['School'] = '*missing value*';
          }

          try {
            const degreeElement = await edu.findElement(By.css('span[class*="t-normal"]:not([class*="t-black--light"])'));
            edu_dict['Degree'] = await degreeElement.getText();
          } catch (e) {
            edu_dict['Degree'] = '*missing value*';
          }

          try {
            const dateRangeElement = await edu.findElement(By.css('span[class*="t-black--light"]'));
            let date_range = await dateRangeElement.getText();
            edu_dict['Date Range'] = date_range.replace('Dates attended or expected graduation', '').trim();
          } catch (e) {
            edu_dict['Date Range'] = '*missing value*';
          }

          try {
            const descElement = await edu.findElement(By.css('span[aria-hidden="true"], ul li ul span'));
            edu_dict['Description'] = await descElement.getText();
          } catch (e) {
            edu_dict['Description'] = '*missing value*';
          }

          if (edu_dict['School'] !== '*missing value*') {
            education.push(edu_dict);
          }
        } catch (e) {
          console.log('Error parsing education entry:', e.message);
          continue;
        }
      }
    } catch (e) {
      console.log('Education section not found:', e.message);
    }
    
    let recommendations = [];
    try {
      const recSelectors = [
        'section[data-section="recommendations"] ul li',
        '#recommendations ~ div ul li',
        'section:has(#recommendations) ul li'
      ];
      
      let recommendations_list = [];
      for (const selector of recSelectors) {
        try {
          recommendations_list = await driver.findElements(By.css(selector));
          if (recommendations_list.length > 0) break;
        } catch (e) {
          continue;
        }
      }

      if (recommendations_list.length > 0) {
        console.log(`Found ${recommendations_list.length} recommendation entries`);
        for (let rec of recommendations_list) {
          try {
            let rec_dict = {};
            try {
              const recommenderElement = await rec.findElement(By.css('span[class*="t-bold"]'));
              rec_dict['Recommender'] = await recommenderElement.getText();
            } catch (e) {
              rec_dict['Recommender'] = '*missing value*';
            }

            try {
              const companyElement = await rec.findElement(By.css('span[class*="t-normal"]:not([class*="t-black--light"])'));
              rec_dict['Company'] = await companyElement.getText();
            } catch (e) {
              rec_dict['Company'] = '*missing value*';
            }

            try {
              const dateRangeElement = await rec.findElement(By.css('span[class*="t-black--light"]'));
              let date_range = await dateRangeElement.getText();
              rec_dict['Date and Relation'] = date_range.replace('Date written and Relation', '').trim();
            } catch (e) {
              rec_dict['Date and Relation'] = '*missing value*';
            }

            try {
              const descElement = await rec.findElement(By.css('span[aria-hidden="true"], ul li ul span'));
              rec_dict['Description'] = await descElement.getText();
            } catch (e) {
              rec_dict['Description'] = '*missing value*';
            }

            recommendations.push(rec_dict);
          } catch (e) {
            console.log('Error parsing recommendation entry:', e.message);
            continue;
          }
        }
      }
    } catch (e) {
      console.log('Recommendations section not found:', e.message);
    }
    // Clean up
    if (driver) {
      await driver.quit();
    }

    // Create a better CSV structure - one row per profile with all data
    // Extract profile URL identifier for filename
    const urlParts = url.split('/');
    const profileId = urlParts[urlParts.length - 1] || 'profile';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const csvFileName = `linkedin_profile_${profileId}_${timestamp}.csv`;
    const csvFilePath = path.join(process.cwd(), csvFileName);
    
    // Prepare CSV data - create rows for each experience, education, and recommendation
    // Each row contains profile info + one experience/education/recommendation
    const csvData = [];
    
    // Calculate maximum number of rows needed
    const maxRows = Math.max(
      experiences.length || 0,
      education.length || 0,
      recommendations.length || 0,
      1  // At least one row for profile info
    );
    
    // Create rows - each row represents one experience/education/recommendation
    for (let i = 0; i < maxRows; i++) {
      const row = {
        'Profile URL': i === 0 ? url : '', // Only show URL in first row
        'Name': i === 0 ? (name !== '*missing value*' ? name : '') : '',
        'Title': i === 0 ? (title !== '*missing value*' ? title : '') : '',
        'Location': i === 0 ? (location !== '*missing value*' ? location : '') : '',
        'About': i === 0 ? (about !== '*missing value*' ? about : '') : '',
        'Experience #': i < experiences.length ? (i + 1).toString() : '',
        'Experience Position': i < experiences.length ? (experiences[i].Position || '').replace(/\n/g, ' ') : '',
        'Experience Company': i < experiences.length ? (experiences[i].Company || '').replace(/\n/g, ' ') : '',
        'Experience Date Range': i < experiences.length ? (experiences[i]['Date Range'] || '').replace(/\n/g, ' ') : '',
        'Experience Location': i < experiences.length ? (experiences[i].Location || '').replace(/\n/g, ' ') : '',
        'Experience Description': i < experiences.length ? (experiences[i].Description || '').replace(/\n/g, ' ').replace(/,/g, ';') : '',
        'Education #': i < education.length ? (i + 1).toString() : '',
        'Education School': i < education.length ? (education[i].School || '').replace(/\n/g, ' ') : '',
        'Education Degree': i < education.length ? (education[i].Degree || '').replace(/\n/g, ' ') : '',
        'Education Date Range': i < education.length ? (education[i]['Date Range'] || '').replace(/\n/g, ' ') : '',
        'Education Description': i < education.length ? (education[i].Description || '').replace(/\n/g, ' ').replace(/,/g, ';') : '',
        'Recommendation #': i < recommendations.length ? (i + 1).toString() : '',
        'Recommendation Recommender': i < recommendations.length ? (recommendations[i].Recommender || '').replace(/\n/g, ' ') : '',
        'Recommendation Company': i < recommendations.length ? (recommendations[i].Company || '').replace(/\n/g, ' ') : '',
        'Recommendation Date and Relation': i < recommendations.length ? (recommendations[i]['Date and Relation'] || '').replace(/\n/g, ' ') : '',
        'Recommendation Description': i < recommendations.length ? (recommendations[i].Description || '').replace(/\n/g, ' ').replace(/,/g, ';') : '',
        'Scraped Date': i === 0 ? new Date().toISOString().split('T')[0] : '',
      };
      csvData.push(row);
    }
    
    // Write the output to a CSV file
    let csvFileSaved = false;
    try {
      const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
          { id: 'Profile URL', title: 'Profile URL' },
          { id: 'Name', title: 'Name' },
          { id: 'Title', title: 'Title' },
          { id: 'Location', title: 'Location' },
          { id: 'About', title: 'About' },
          { id: 'Experience #', title: 'Experience #' },
          { id: 'Experience Position', title: 'Experience Position' },
          { id: 'Experience Company', title: 'Experience Company' },
          { id: 'Experience Date Range', title: 'Experience Date Range' },
          { id: 'Experience Location', title: 'Experience Location' },
          { id: 'Experience Description', title: 'Experience Description' },
          { id: 'Education #', title: 'Education #' },
          { id: 'Education School', title: 'Education School' },
          { id: 'Education Degree', title: 'Education Degree' },
          { id: 'Education Date Range', title: 'Education Date Range' },
          { id: 'Education Description', title: 'Education Description' },
          { id: 'Recommendation #', title: 'Recommendation #' },
          { id: 'Recommendation Recommender', title: 'Recommendation Recommender' },
          { id: 'Recommendation Company', title: 'Recommendation Company' },
          { id: 'Recommendation Date and Relation', title: 'Recommendation Date and Relation' },
          { id: 'Recommendation Description', title: 'Recommendation Description' },
          { id: 'Scraped Date', title: 'Scraped Date' },
        ],
      });
      await csvWriter.writeRecords(csvData);
      csvFileSaved = true;
      console.log(`✅ CSV file saved successfully: ${csvFileName}`);
      console.log(`📁 File location: ${csvFilePath}`);
    } catch (csvError) {
      console.error('❌ Error writing CSV:', csvError.message);
      csvFileSaved = false;
    }
    
      // Return the output with CSV file information
      return {
        Name: name,
        Title: title,
        Location: location,
        About: about,
        Experiences: experiences.length > 0 ? experiences : [],
        Education: education.length > 0 ? education : [],
        Recommendations: recommendations.length > 0 ? recommendations : [],
        csvFile: csvFileSaved ? csvFileName : null,
        csvFilePath: csvFileSaved ? csvFilePath : null,
        profileUrl: url,
      };
      
  } catch (error) {
    console.error('Error in scrapeProfile:', error);
    if (driver) {
      try {
        await driver.quit();
      } catch (quitError) {
        console.error('Error quitting driver:', quitError);
      }
    }
    throw error;
  }
}

module.exports = scrapeProfile;