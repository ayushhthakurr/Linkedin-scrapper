import './App.css';
import { useState } from 'react';
import Submit from './Submit';

function App() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (url.trim() === '') {
      alert('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setOutput({}); // Clear previous output
    try {
      // Encode the URL properly
      const encodedUrl = encodeURIComponent(url.trim());
      const requestUrl = `http://localhost:3001/scrape?url=${encodedUrl}`;
      console.log('Sending request to:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Parse JSON only if response is ok
      const data = await response.json();
      
      // Check if data has an error property
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOutput(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      let errorMessage = error.message || 'An error occurred while fetching data.';
      
      // Handle specific error types
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Make sure the backend server is running on port 3001. Run "npm run server" in a separate terminal.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. The backend server is not running. Please start it with "npm run server".';
      }
      
      setOutput({ error: errorMessage });
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#006699';
  };

  const handleButtonLeave = (event) => {
    event.target.style.backgroundColor = '#0077b5';
  };

  return (
    <div className="container">
      <h1>LinkedIn Profile Scraper</h1>
      <p>Enter the URL of the LinkedIn profile you want to extract data from:</p>
      <form onSubmit={handleSubmit}>
        <input type="text" id="url-input" placeholder="e.g. https://www.linkedin.com/in/johndoe" value={url} onChange={handleInputChange} />
        <button type="submit" id="submit-button" onMouseOver={handleButtonHover} onMouseLeave={handleButtonLeave}>
          Extract Data
        </button>
      </form>
      {isLoading ? (
        <div style={{ marginTop: '20px', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#0077b5' }}>Loading...</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            This may take 30-60 seconds. A Chrome browser window will open automatically.
          </p>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px', textAlign: 'left' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>
              ⚠️ If LinkedIn asks for verification:
            </p>
            <ol style={{ fontSize: '13px', color: '#856404', marginLeft: '20px' }}>
              <li>Look at the Chrome browser window that opened</li>
              <li>Complete the CAPTCHA or 2FA verification</li>
              <li>Wait until you're logged into LinkedIn</li>
              <li>The scraper will continue automatically</li>
            </ol>
          </div>
        </div>
      ) : output.error ? (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#ffe6e6', border: '1px solid #ff9999', borderRadius: '5px' }}>
          <p style={{ color: '#cc0000', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Error:</p>
          <p style={{ color: '#cc0000', fontSize: '14px' }}>{output.error}</p>
          {output.error.includes('verification') || output.error.includes('CAPTCHA') || output.error.includes('2FA') ? (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>
                How to complete verification:
              </p>
              <ol style={{ fontSize: '13px', color: '#856404', marginLeft: '20px' }}>
                <li>Look at the Chrome browser window that opened</li>
                <li>Complete the CAPTCHA or enter your 2FA code</li>
                <li>Wait until you see your LinkedIn feed or profile</li>
                <li>Try scraping again - it should work now</li>
              </ol>
              <p style={{ fontSize: '12px', color: '#856404', marginTop: '10px', fontStyle: 'italic' }}>
                The scraper will wait up to 3 minutes for you to complete verification.
              </p>
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
              Check the server console (where you ran "npm run server") for more details.
            </p>
          )}
        </div>
      ) : (
        <div id="output">
          {(output.Name || output.Title || output.Experiences?.length > 0 || output.Education?.length > 0) && <Submit data={output} />}
        </div>
      )}
    </div>
  );
}

export default App;
