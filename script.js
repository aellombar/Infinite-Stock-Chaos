(() => {
  'use strict';

  // ── DOM refs ──
  const canvas = document.getElementById('stock-chart');
  const ctx = canvas.getContext('2d');
  const chartContainer = document.getElementById('chart-container');
  const portfolioEl = document.getElementById('portfolio-value');
  const cashEl = document.getElementById('liquid-cash');
  const sharesEl = document.getElementById('total-shares');
  const priceEl = document.getElementById('stock-price');
  const newsText = document.getElementById('news-text');
  const newsBanner = document.getElementById('news-banner');
  const trendBadge = document.getElementById('trend-badge');
  const buyBtn = document.getElementById('buy-btn');
  const sellBtn = document.getElementById('sell-btn');
  const bankruptOverlay = document.getElementById('bankrupt-overlay');
  const restartBtn = document.getElementById('restart-btn');

  // ── Constants ──
  const START_CASH = 1000;
  const START_PRICE = 100;
  const SCROLL_SPEED = 2.5;          // pixels per frame
  const POINT_SPACING = 4;           // pixels between data points
  const BASE_VOLATILITY = 0.35;      // random walk strength (% per second)
  const MIN_PRICE = 0.01;
  const NEWS_INTERVAL_MIN = 5000;
  const NEWS_INTERVAL_MAX = 10000;

  const NEWS_EVENTS = [
    {
      headline: 'CEO posts highly illegal meme on X',
      type: 'crash',
      magnitude: [0.30, 0.50],
    },
    {
      headline: 'Company announces AI integration in their toasters',
      type: 'moon',
      magnitude: [0.50, 0.80],
    },
    {
      headline: 'Federal Reserve accidentally deletes the economy',
      type: 'massive_crash',
      magnitude: [0.55, 0.75],
    },
    {
      headline: "Influencer says stock is 'bussin'",
      type: 'surge',
      magnitude: [0.20, 0.40],
    },
    {
      headline: 'Dev accidentally pushed passwords to public repo',
      type: 'crash',
      magnitude: [0.25, 0.45],
    },
    {
      headline: 'Analyst upgrades stock to "probably fine"',
      type: 'surge',
      magnitude: [0.15, 0.30],
    },
    {
      headline: 'CEO challenges rival to cage match on livestream',
      type: 'moon',
      magnitude: [0.35, 0.60],
    },
    {
      headline: 'Whale dumps entire position during lunch break',
      type: 'crash',
      magnitude: [0.20, 0.35],
    },
    {
      headline: 'Company pivots to blockchain-powered socks',
      type: 'surge',
      magnitude: [0.25, 0.45],
    },
    {
      headline: 'SEC tweets "lol" and deletes account',
      type: 'massive_crash',
      magnitude: [0.40, 0.65],
    },
  ];

  // ── Game state ──
  let cash = START_CASH;
  let shares = 0;
  let price = START_PRICE;
  let startCash = START_CASH;
  let points = [];
  let lastTimestamp = 0;
  let gameOver = false;
  let activeNews = null;
  let newsTimer = null;
  let isShaking = false;
  let recentTrend = 0; // positive = up, negative = down

  // ── Helpers ──
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatShares(n) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }

  function portfolioValue() {
    return cash + shares * price;
  }

  // ── Canvas sizing ──
  function resizeCanvas() {
    const rect = chartContainer.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Price simulation ──
  function applyRandomWalk(dt) {
    const seconds = dt / 1000;
    const jitter = (Math.random() - 0.5) * 2;
    const pctChange = jitter * BASE_VOLATILITY * seconds;
    price *= 1 + pctChange / 100;
  }

  function applyNewsEffect(dt) {
    if (!activeNews) return;

    const elapsed = performance.now() - activeNews.startTime;
    if (elapsed >= activeNews.duration) {
      activeNews = null;
      return;
    }

    const seconds = dt / 1000;
    const progress = elapsed / activeNews.duration;
    const fade = 1 - progress * 0.3;

    let direction;
    switch (activeNews.type) {
      case 'moon':
      case 'surge':
        direction = 1;
        break;
      case 'crash':
      case 'massive_crash':
        direction = -1;
        break;
      default:
        direction = 0;
    }

    const intensity = activeNews.type === 'massive_crash' ? 2.2 : activeNews.type === 'moon' ? 1.8 : 1;
    const targetTotalChange = activeNews.magnitude;
    const ratePerSecond = (targetTotalChange * intensity) / (activeNews.duration / 1000);
    const pctChange = direction * ratePerSecond * seconds * fade;

    price *= 1 + pctChange;

    if (direction < 0 && Math.abs(pctChange) > 0.001) {
      triggerShake();
    }
  }

  function clampPrice() {
    if (price < MIN_PRICE) price = MIN_PRICE;
  }

  function updatePrice(dt) {
    applyRandomWalk(dt);
    applyNewsEffect(dt);
    clampPrice();

    const prevPrice = points.length > 0 ? points[points.length - 1].price : price;
    recentTrend = price - prevPrice;
  }

  // ── Chart drawing ──
  function priceToY(p, minP, maxP, height) {
    const padding = height * 0.08;
    const range = maxP - minP || 1;
    const normalized = (p - minP) / range;
    return height - padding - normalized * (height - padding * 2);
  }

  function drawChart() {
    const w = chartContainer.clientWidth;
    const h = chartContainer.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(55, 65, 81, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (points.length < 2) return;

    const prices = points.map((p) => p.price);
    let minP = Math.min(...prices);
    let maxP = Math.max(...prices);
    const margin = (maxP - minP) * 0.15 || price * 0.05;
    minP -= margin;
    maxP += margin;

    const isUp = recentTrend >= 0;
    const lineColor = isUp ? '#34d399' : '#f87171';
    const glowColor = isUp ? 'rgba(52, 211, 153, 0.8)' : 'rgba(248, 113, 113, 0.8)';

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isUp ? 'rgba(52, 211, 153, 0.12)' : 'rgba(248, 113, 113, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    points.forEach((pt, i) => {
      const y = priceToY(pt.price, minP, maxP, h);
      if (i === 0) ctx.moveTo(pt.x, y);
      else ctx.lineTo(pt.x, y);
    });

    // Close fill path
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    ctx.lineTo(lastPt.x, h);
    ctx.lineTo(firstPt.x, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Glowing line
    ctx.beginPath();
    points.forEach((pt, i) => {
      const y = priceToY(pt.price, minP, maxP, h);
      if (i === 0) ctx.moveTo(pt.x, y);
      else ctx.lineTo(pt.x, y);
    });

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current price dot
    const lastY = priceToY(points[points.length - 1].price, minP, maxP, h);
    ctx.beginPath();
    ctx.arc(lastPt.x, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function updateChartPoints() {
    const w = chartContainer.clientWidth;

    // Scroll existing points left
    points.forEach((pt) => {
      pt.x -= SCROLL_SPEED;
    });

    // Remove off-screen points
    points = points.filter((pt) => pt.x > -10);

    // Add new point when enough space
    const lastX = points.length > 0 ? points[points.length - 1].x : w;
    if (points.length === 0 || lastX <= w - POINT_SPACING) {
      points.push({ x: w, price });
    } else {
      points[points.length - 1].price = price;
    }
  }

  // ── UI updates ──
  function updateUI() {
    const pv = portfolioValue();

    portfolioEl.textContent = formatMoney(pv);
    cashEl.textContent = formatMoney(cash);
    sharesEl.textContent = formatShares(shares);
    priceEl.textContent = formatMoney(price);

    const profit = pv >= startCash;
    portfolioEl.classList.toggle('neon-green', profit);
    portfolioEl.classList.toggle('neon-red', !profit);

    if (recentTrend >= 0) {
      trendBadge.textContent = '▲ BULLISH';
      trendBadge.className = 'absolute top-2 right-2 sm:top-3 sm:right-3 font-mono text-[10px] sm:text-xs px-2 py-1 rounded border border-emerald-700/50 bg-gray-900/80 text-emerald-400';
    } else {
      trendBadge.textContent = '▼ BEARISH';
      trendBadge.className = 'absolute top-2 right-2 sm:top-3 sm:right-3 font-mono text-[10px] sm:text-xs px-2 py-1 rounded border border-red-700/50 bg-gray-900/80 text-red-400';
    }

    buyBtn.disabled = gameOver || cash <= 0;
    sellBtn.disabled = gameOver || shares <= 0;
  }

  function checkBankruptcy() {
    if (gameOver) return;
    if (portfolioValue() <= 0) {
      gameOver = true;
      cash = 0;
      shares = 0;
      bankruptOverlay.classList.remove('hidden');
      clearTimeout(newsTimer);
    }
  }

  // ── News system ──
  function triggerNews() {
    if (gameOver) return;

    const event = NEWS_EVENTS[randInt(0, NEWS_EVENTS.length - 1)];
    const magnitude = rand(event.magnitude[0], event.magnitude[1]);
    const duration = rand(2000, 4000);

    activeNews = {
      ...event,
      magnitude,
      duration,
      startTime: performance.now(),
    };

    newsText.textContent = event.headline;
    newsBanner.classList.remove('flash');
    void newsBanner.offsetWidth;
    newsBanner.classList.add('flash');

    if (event.type === 'crash' || event.type === 'massive_crash') {
      triggerShake();
    }

    scheduleNextNews();
  }

  function scheduleNextNews() {
    clearTimeout(newsTimer);
    if (gameOver) return;
    const delay = rand(NEWS_INTERVAL_MIN, NEWS_INTERVAL_MAX);
    newsTimer = setTimeout(triggerNews, delay);
  }

  // ── Visual juice ──
  function triggerShake() {
    if (isShaking) return;
    isShaking = true;
    chartContainer.classList.add('shake');
    setTimeout(() => {
      chartContainer.classList.remove('shake');
      isShaking = false;
    }, 400);
  }

  function animateButton(btn) {
    btn.classList.remove('clicked');
    void btn.offsetWidth;
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 250);
  }

  function spawnFloatText(parentEl, text, positive) {
    const el = document.createElement('span');
    el.className = 'float-text ' + (positive ? 'positive' : 'negative');
    el.textContent = text;
    parentEl.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  // ── Trading ──
  function buy() {
    if (gameOver || cash <= 0) return;

    const spent = cash;
    const bought = cash / price;
    shares += bought;
    cash = 0;

    animateButton(buyBtn);
    spawnFloatText(buyBtn.parentElement, `+${formatShares(bought)} shares`, true);

    updateUI();
    checkBankruptcy();
  }

  function sell() {
    if (gameOver || shares <= 0) return;

    const prevValue = shares * price;
    const soldShares = shares;
    cash += prevValue;
    shares = 0;

    animateButton(sellBtn);
    spawnFloatText(sellBtn.parentElement, formatMoney(prevValue), true);

    updateUI();
    checkBankruptcy();
  }

  // ── Game loop ──
  function gameLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(timestamp - lastTimestamp, 50);
    lastTimestamp = timestamp;

    if (!gameOver) {
      updatePrice(dt);
      updateChartPoints();
    }

    drawChart();
    updateUI();

    if (!gameOver) checkBankruptcy();

    requestAnimationFrame(gameLoop);
  }

  // ── Reset ──
  function resetGame() {
    cash = START_CASH;
    shares = 0;
    price = START_PRICE;
    startCash = START_CASH;
    points = [];
    gameOver = false;
    activeNews = null;
    lastTimestamp = 0;
    recentTrend = 0;

    bankruptOverlay.classList.add('hidden');
    newsText.textContent = 'Markets open. Brace for chaos...';

    const w = chartContainer.clientWidth;
    const h = chartContainer.clientHeight;
    for (let x = 0; x <= w; x += POINT_SPACING) {
      points.push({ x, price: START_PRICE + (Math.random() - 0.5) * 2 });
    }

    clearTimeout(newsTimer);
    scheduleNextNews();
    updateUI();
  }

  // ── Init ──
  function init() {
    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    resetGame();
    requestAnimationFrame(gameLoop);

    buyBtn.addEventListener('click', buy);
    sellBtn.addEventListener('click', sell);
    restartBtn.addEventListener('click', resetGame);
  }

  init();
})();
