// popup.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showResults') {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = `Resultado de VirusTotal: ${request.data.totalDetections} detecciones. ${request.data.result}`;
  } else if (request.action === 'showError') {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = `Error: ${request.error}`;
  }
});