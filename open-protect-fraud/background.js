chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    const { url, nonce } = request;
    console.log('Received message:', request.url, request.nonce);

    const apiKey = 'd54c268eed4aa1254e4b76b3b3703be21ed81b5a1e79283669ce3885a037d17d';
    const baseUrl = 'https://www.virustotal.com/vtapi/v2/url/scan';

    // Get the current URL of the tab that sent the message
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const urlActual = currentTab.url;

      // Construimos la URL completa para la solicitud POST
      const postUrl = `${baseUrl}?url=${encodeURIComponent(urlActual)}&apikey=${apiKey}`;

      fetch(postUrl, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const scanId = data.scan_id;




        // Construimos la URL para la solicitud GET
        const getReportUrl = `https://www.virustotal.com/vtapi/v2/url/report?allinfo=false&scan=0&apikey=${apiKey}&resource=${scanId}`;

        return fetch(getReportUrl, {
          method: 'GET'
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Procesamos el informe detallado
        const result = data.positives > 0 ? 'Se han detectado posibles amenazas.' : 'No se encontraron amenazas.';
        const message = { action: 'showResults', data: { totalDetections: data.positives, result } };
        chrome.tabs.sendMessage(sender.tab.id, message);
      })
      .catch(error => {
        const message = { action: 'showError', error: error.message };
        chrome.tabs.sendMessage(sender.tab.id, message);
      });
    });
  }
});