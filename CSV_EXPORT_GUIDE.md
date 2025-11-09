# CSV Export Guide

## How CSV Export Works

After scraping a LinkedIn profile, all data is automatically saved to a CSV file in the project root directory.

## CSV File Format

### File Naming
- Format: `linkedin_profile_{profileId}_{date}.csv`
- Example: `linkedin_profile_ayush-thakur-1b1127221_2024-11-09.csv`
- Location: Project root directory (same folder as `package.json`)

### CSV Structure

The CSV file contains the following columns:

#### Profile Information (repeated in first row)
- **Profile URL**: The LinkedIn profile URL
- **Name**: Person's name
- **Title**: Job title/headline
- **Location**: Location
- **About**: About section
- **Scraped Date**: Date when data was scraped

#### Experience Data
- **Experience #**: Experience number (1, 2, 3, etc.)
- **Experience Position**: Job position/title
- **Experience Company**: Company name
- **Experience Date Range**: Employment dates
- **Experience Location**: Job location
- **Experience Description**: Job description

#### Education Data
- **Education #**: Education entry number
- **Education School**: School/university name
- **Education Degree**: Degree obtained
- **Education Date Range**: Education dates
- **Education Description**: Education description

#### Recommendation Data
- **Recommendation #**: Recommendation number
- **Recommendation Recommender**: Name of person who gave recommendation
- **Recommendation Company**: Company of recommender
- **Recommendation Date and Relation**: Date and relationship
- **Recommendation Description**: Recommendation text

### CSV Format Details

- **Multiple Rows**: Each experience, education, or recommendation gets its own row
- **Profile Info**: Profile information (Name, Title, etc.) is included in the first row
- **Empty Cells**: If a profile has no experiences, education, or recommendations, those columns will be empty
- **Excel Compatible**: The CSV is formatted to open correctly in Excel, Google Sheets, and other spreadsheet applications

## Example CSV Structure

```
Profile URL,Name,Title,Location,About,Experience #,Experience Position,Experience Company,...
https://...,John Doe,Software Engineer,New York,About text...,1,Senior Developer,Company A,...
https://...,, ,, ,2,Junior Developer,Company B,...
https://...,, ,, ,,1,University A,Bachelor's,...
```

## Opening CSV Files

### In Excel
1. Double-click the CSV file
2. Excel will open it automatically
3. You can filter, sort, and analyze the data

### In Google Sheets
1. Go to Google Sheets
2. File → Import → Upload
3. Select the CSV file
4. Choose "Import data" → "Replace spreadsheet"

### In Other Applications
- Any text editor (for viewing)
- LibreOffice Calc
- Numbers (Mac)
- Any CSV-compatible application

## Data Cleaning

The CSV automatically:
- Removes newlines from text (replaces with spaces)
- Replaces commas in descriptions with semicolons (to avoid CSV formatting issues)
- Handles missing values gracefully
- Includes timestamps for tracking when data was scraped

## Multiple Profiles

Each profile you scrape creates a **separate CSV file** with a unique filename based on:
- Profile ID (from URL)
- Date scraped

This means:
- ✅ No data is overwritten
- ✅ Each profile has its own file
- ✅ Easy to track and organize
- ✅ Can scrape multiple profiles without losing data

## File Location

CSV files are saved in:
```
C:\Users\hp\Desktop\Linkedin Scrapper\linkedin_profile_{profileId}_{date}.csv
```

## Tips for Using CSV Data

1. **Filtering**: Use Excel's filter feature to find specific experiences or education
2. **Sorting**: Sort by company, school, or date to organize data
3. **Analysis**: Use pivot tables to analyze multiple profiles
4. **Export**: Convert CSV to Excel format (.xlsx) for better formatting
5. **Backup**: Keep CSV files as backups of scraped data

## Troubleshooting

### CSV file not created
- Check the server console for error messages
- Make sure the project directory is writable
- Check if disk space is available

### CSV file is empty
- The profile might not have any data
- Check the server console for scraping errors
- Verify the profile URL is correct and accessible

### CSV file has missing data
- Some profiles may have private or incomplete information
- LinkedIn may have changed their structure
- Check the web interface to see what data was actually scraped

### Can't open CSV in Excel
- Make sure the file has .csv extension
- Try opening with "Open with" → Excel
- Check if the file is corrupted (check file size)

## Best Practices

1. **Organize Files**: Create a folder for CSV files if scraping many profiles
2. **Backup Data**: Regularly backup CSV files
3. **Review Data**: Always review scraped data for accuracy
4. **Respect Privacy**: Handle personal data responsibly
5. **Comply with Terms**: Make sure you comply with LinkedIn's Terms of Service

