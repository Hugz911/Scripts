// content.js
let button = document.createElement('button');
button.textContent = 'Analizar con VirusTotal';
button.style.position = 'fixed';
button.style.bottom = '10px';
button.style.right = '10px';

const nonce = Math.random().toString(36).substring(2, 15);
button.setAttribute('nonce', nonce);

document.body.appendChild(button);

button.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (chrome.runtime.lastError) { // Check for errors getting the active tab
      console.error('Error obtaining active tab:', chrome.runtime.lastError);
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: 'analyze', url: window.location.href, nonce }, (response) => {
      if (chrome.runtime.lastError) { // Check for errors sending the message
        console.error('Error sending message:', chrome.runtime.lastError);
      } else {
        console.log('Mensaje enviado:', response); // Log the response (optional)
      }
    });
  });
});
