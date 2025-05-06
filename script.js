const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd';

async function fetchPrices() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        document.getElementById('bitcoin').textContent = `Bitcoin (BTC): $${data.bitcoin.usd}`;
        document.getElementById('ethereum').textContent = `Ethereum (ETH): $${data.ethereum.usd}`;
        document.getElementById('dogecoin').textContent = `Dogecoin (DOGE): $${data.dogecoin.usd}`;
      } catch (error) {
        console.error('Fel vid hämtning av data:', error);
      }
}

fetchPrices();
setInterval(fetchPrices, 30000);