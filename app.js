const API = "https://api.dexscreener.com/latest/dex/search?q=solana";

async function loadHome() {
  const res = await fetch(API);
  const data = await res.json();

  const container = document.getElementById("tokenList");
  if (!container) return;

  container.innerHTML = "";

  data.pairs.slice(0, 20).forEach((t, i) => {
    container.innerHTML += `
      <div class="card" onclick="openToken('${t.pairAddress}')">
        <div class="header">
          <img src="${t.info?.imageUrl || ''}" class="logo">
          <div>
            <b>${t.baseToken.name}</b><br>
            <small>${t.baseToken.symbol}</small>
          </div>

          <div class="price">
            $${Number(t.priceUsd).toFixed(4)}<br>
            <span class="${t.priceChange.h24 >= 0 ? 'positive' : 'negative'}">
              ${t.priceChange.h24.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    `;
  });
}

function openToken(address) {
  window.location.href = `token.html?address=${address}`;
}

async function loadToken() {
  const params = new URLSearchParams(window.location.search);
  const address = params.get("address");
  if (!address) return;

  const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${address}`);
  const data = await res.json();
  const t = data.pair;

  const container = document.getElementById("tokenDetail");
  if (!container) return;

  container.innerHTML = `
    <div class="detail">
      <div class="header">
        <img src="${t.info?.imageUrl || ''}" class="logo">
        <div>
          <h2>${t.baseToken.name}</h2>
          <p>$${Number(t.priceUsd).toFixed(4)}</p>
        </div>
      </div>

      <div class="chart"></div>

      <div class="links">
        <a href="${t.info?.websites?.[0]?.url || '#'}">🌐</a>
        <a href="${t.info?.socials?.telegram || '#'}">💬</a>
        <a href="${t.info?.socials?.twitter || '#'}">🐦</a>
      </div>

      <p>${t.baseToken.symbol} token on Solana network.</p>
    </div>
  `;
}

loadHome();
loadToken();
