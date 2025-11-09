import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Submit({ data }) {
  const {
    Name,
    Title,
    Location,
    About,
    Experiences,
    Education,
    Recommendations,
    csvFile,
    csvFilePath,
    profileUrl,
  } = data;

  const bgcolor = {
    background: "linear-gradient(to left, #87CEEB, #00BFFF)",
    transition: "background-color 0.5s ease",
  };

  const liBg = {
    background: "none",
    color: "white",
    border: "none",
    fontWeight: "bold",
  };

  return (
    <div class="container ">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mb-3 text-white shadow-lg" style={bgcolor}>
            <div class="card-body">
              <h3 class="card-title text-center">Scraped Data:</h3>
              <div class="col mb-3">
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Name:</span>
                    <span class="fs-5 fw-bold">{Name}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Title:</span>
                    <span class="fs-5 fw-bold">{Title}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">Location:</span>
                    <span class="fs-5 fw-bold">{Location}</span>
                  </div>
                </div>
                <div class="row px-3">
                  <div class="d-flex justify-content-between">
                    <span class="fs-5 fw-bold">About:</span>
                    <span class="fs-5 fw-bold">{About}</span>
                  </div>
                </div>
              </div>

              {Experiences && Experiences.map((exp, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Experiences:</h5>
                    <li class="list-group-item " style={liBg}>
                      Position: {exp.Position}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Company: {exp.Company}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date Range: {exp["Date Range"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Location: {exp.Location}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {exp.Description}
                    </li>
                  </ul>
                </li>
              ))}
              {Education && Education.map((edu, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Education:</h5>
                    <li class="list-group-item " style={liBg}>
                      School: {edu.School}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Degree: {edu.Degree}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date Range: {edu["Date Range"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {edu.Description}
                    </li>
                  </ul>
                </li>
              ))}
              {Recommendations && Recommendations.map((rec, index) => (
                <li class="list-group-item li-bg mb-3" style={liBg} key={index}>
                  <ul class="list-group ">
                    <h5 class="card-title text-center">Recommendations:</h5>
                    <li class="list-group-item " style={liBg}>
                      Recommender: {rec.Recommender}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Company: {rec.Company}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Date and Relation: {rec["Date and Relation"]}
                    </li>
                    <li class="list-group-item " style={liBg}>
                      Description: {rec.Description}
                    </li>
                  </ul>
                </li>
              ))}
              
              {/* CSV File Info */}
              {csvFile && (
                <div class="row px-3 mt-4">
                  <div class="alert alert-success" role="alert" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
                    <h5 class="alert-heading" style={{ color: '#155724', fontWeight: 'bold' }}>✅ Data Saved to CSV File!</h5>
                    <hr style={{ borderColor: '#c3e6cb' }} />
                    <p class="mb-2" style={{ color: '#155724' }}>
                      <strong>📁 File Name:</strong> {csvFile}
                    </p>
                    <p class="mb-2" style={{ color: '#155724' }}>
                      <strong>📂 Location:</strong> Project root directory
                    </p>
                    <p class="mb-2" style={{ color: '#155724' }}>
                      <strong>🔗 Profile URL:</strong> <a href={profileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>{profileUrl}</a>
                    </p>
                    <p class="mb-0" style={{ color: '#155724', fontSize: '14px' }}>
                      <small>💡 The CSV file contains all scraped data including experiences, education, and recommendations. Open it with Excel, Google Sheets, or any spreadsheet application.</small>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submit;