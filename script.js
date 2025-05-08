const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd';
const chartUrls = {
    bitcoin: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7',
    ethereum: 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7',
    dogecoin: 'https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=usd&days=7',
};

// Get live prices for BTC, ETH, DOGE
async function fetchPrices() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        document.getElementById('bitcoin').textContent = `Bitcoin (BTC): $${data.bitcoin.usd}`;
        document.getElementById('ethereum').textContent = `Ethereum (ETH): $${data.ethereum.usd}`;
        document.getElementById('dogecoin').textContent = `Dogecoin (DOGE): $${data.dogecoin.usd}`;
    } catch (error) {
        console.error('Error fetching current prices:', error);
    }
}

// Get 7-day price trend for BTC
async function fetchChartData() {
    try {
      const responses = await Promise.all([
        fetch(chartUrls.bitcoin),
        fetch(chartUrls.ethereum),
        fetch(chartUrls.dogecoin)
      ]);
  
      const [btcData, ethData, dogeData] = await Promise.all(responses.map(res => res.json()));
  
      const labels = btcData.prices.map(p => {
        const date = new Date(p[0]);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      const normalize = (prices) => {
        const base = prices[0][1]; // price at first day
        return prices.map(p => (((p[1] - base) / base) * 100).toFixed(2)); // percent change
      };
  
      const btcPrices = normalize(btcData.prices);
      const ethPrices = normalize(ethData.prices);
      const dogePrices = normalize(dogeData.prices);
  
      createChart(labels, btcPrices, ethPrices, dogePrices);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }

// Create the Chart.js chart
function createChart(labels, btcPrices, ethPrices, dogePrices) {
    const ctx = document.getElementById('btcChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'BTC Price (USD)',
            data: btcPrices,
            borderColor: '#f7931a',
            backgroundColor: 'rgba(247, 147, 26, 0.2)',
            tension: 0.3
          },
          {
            label: 'ETH Price (USD)',
            data: ethPrices,
            borderColor: '#3c3c3d',
            backgroundColor: 'rgba(60, 60, 61, 0.2)',
            tension: 0.3
          },
          {
            label: 'DOGE Price (USD)',
            data: dogePrices,
            borderColor: '#ba9f33',
            backgroundColor: 'rgba(186, 159, 51, 0.2)',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

fetchPrices();
fetchChartData();
setInterval(fetchPrices, 30000); // update prices every 30 seconds
