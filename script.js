(() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  //  CONFIG
  // ═══════════════════════════════════════════════════════════
  const Config = {
    START_CASH: 1000,
    START_PRICE: 100,
    MIN_PRICE: 0.01,
    SCROLL_SPEED: 2.5,
    POINT_SPACING: 4,
    BASE_VOLATILITY: 0.35,
    TRADE_SIZES: [0.25, 0.5, 0.75, 1.0],
    QTE_DURATION: 2000,
    STORAGE_KEY: 'isc_meta_v1',

    DIFFICULTIES: {
      normal: {
        label: 'NORMAL',
        newsMin: 5000, newsMax: 10000,
        magnitudeMult: 1, fakeChance: 0.2,
        badgeClass: 'badge-normal',
      },
      chaos: {
        label: 'CHAOS',
        newsMin: 3000, newsMax: 5000,
        magnitudeMult: 1.3, fakeChance: 0.25,
        badgeClass: 'badge-chaos-mode',
      },
      nightmare: {
        label: 'NIGHTMARE',
        newsMin: 2000, newsMax: 4000,
        magnitudeMult: 1.5, fakeChance: 0.4,
        badgeClass: 'badge-nightmare',
      },
    },

    NEWS_EVENTS: [
      { headline: 'CEO posts highly illegal meme on X', type: 'crash', magnitude: [0.30, 0.50] },
      { headline: 'Company announces AI integration in their toasters', type: 'moon', magnitude: [0.50, 0.80] },
      { headline: 'Federal Reserve accidentally deletes the economy', type: 'massive_crash', magnitude: [0.55, 0.75] },
      { headline: "Influencer says stock is 'bussin'", type: 'surge', magnitude: [0.20, 0.40] },
      { headline: 'Dev accidentally pushed passwords to public repo', type: 'crash', magnitude: [0.25, 0.45] },
      { headline: 'Analyst upgrades stock to "probably fine"', type: 'surge', magnitude: [0.15, 0.30] },
      { headline: 'CEO challenges rival to cage match on livestream', type: 'moon', magnitude: [0.35, 0.60] },
      { headline: 'Whale dumps entire position during lunch break', type: 'crash', magnitude: [0.20, 0.35] },
      { headline: 'Company pivots to blockchain-powered socks', type: 'surge', magnitude: [0.25, 0.45] },
      { headline: 'SEC tweets "lol" and deletes account', type: 'massive_crash', magnitude: [0.40, 0.65] },
    ],

    UPGRADES: [
      { id: 'thick_skin', name: 'Thick Skin', desc: 'Start each run with +$500 cash', cost: 50 },
      { id: 'spidey_sense', name: 'Spidey Sense', desc: 'QTE window lasts 3 seconds instead of 2', cost: 75 },
      { id: 'crash_padding', name: 'Crash Padding', desc: 'Crash news deals 15% less damage', cost: 100 },
      { id: 'insider_friend', name: 'Insider Friend', desc: 'Reveal if news is FAKE after 0.5s', cost: 80 },
      { id: 'chaos_magnet', name: 'Chaos Magnet', desc: 'Earn 25% more Chaos Points per run', cost: 120 },
      { id: 'second_chance', name: 'Second Chance', desc: 'Survive bankruptcy once per run at $100', cost: 150 },
    ],

    ACHIEVEMENTS: [
      { id: 'first_trade', name: 'First Blood', desc: 'Execute your first trade' },
      { id: 'paper_hands', name: 'Paper Hands', desc: 'Sell during a surge or moon event' },
      { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Hold shares through 3 crash events' },
      { id: 'speed_bankrupt', name: 'Reverse Warren Buffett', desc: 'Go bankrupt in under 60 seconds' },
      { id: 'to_the_moon', name: 'To the Moon', desc: 'Reach 2x your starting portfolio' },
      { id: 'short_king', name: 'Short King', desc: 'Close a profitable short position' },
      { id: 'fake_out', name: 'Fake Out', desc: 'Profit from a fake news reversal' },
      { id: 'quick_fingers', name: 'Quick Fingers', desc: 'Win 5 QTEs in a single run' },
      { id: 'whale', name: 'Whale', desc: 'Execute a trade worth over $5,000' },
      { id: 'chaos_surfer', name: 'Chaos Surfer', desc: 'Survive 20 news events in one run' },
      { id: 'barely_alive', name: 'Barely Alive', desc: 'Recover from under 10% portfolio to profit' },
      { id: 'all_in', name: 'All In', desc: 'Make 5 trades at 100% size' },
      { id: 'hedge_lord', name: 'Hedge Lord', desc: 'Hold long and short positions at once' },
      { id: 'nightmare_clear', name: 'Nightmare Clear', desc: 'Reach 2x portfolio on Nightmare difficulty' },
      { id: 'upgrade_collector', name: 'Upgrade Collector', desc: 'Purchase all 6 permanent upgrades' },
    ],
  };

  // ═══════════════════════════════════════════════════════════
  //  UTILS
  // ═══════════════════════════════════════════════════════════
  const Utils = {
    rand: (min, max) => min + Math.random() * (max - min),
    randInt: (min, max) => Math.floor(Utils.rand(min, max + 1)),
    formatMoney: (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    formatShares: (n) => n.toLocaleString('en-US', { maximumFractionDigits: 4 }),
    formatTime: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    isBullish: (type) => type === 'moon' || type === 'surge',
    isBearish: (type) => type === 'crash' || type === 'massive_crash',
    invertType: (type) => {
      if (type === 'moon') return 'crash';
      if (type === 'crash') return 'moon';
      if (type === 'massive_crash') return 'surge';
      if (type === 'surge') return 'crash';
      return type;
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  STORAGE
  // ═══════════════════════════════════════════════════════════
  const Storage = {
    load() {
      try {
        const raw = localStorage.getItem(Config.STORAGE_KEY);
        if (!raw) return Storage.defaultData();
        return { ...Storage.defaultData(), ...JSON.parse(raw) };
      } catch {
        return Storage.defaultData();
      }
    },

    defaultData() {
      return {
        chaosPoints: 0,
        upgrades: {},
        achievements: [],
        settings: { sound: true, reducedMotion: false, particles: true },
        selectedDifficulty: 'normal',
      };
    },

    save(data) {
      localStorage.setItem(Config.STORAGE_KEY, JSON.stringify(data));
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  AUDIO (Web Audio API)
  // ═══════════════════════════════════════════════════════════
  const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch { /* noop */ }
    },

    resume() {
      if (this.ctx?.state === 'suspended') this.ctx.resume();
    },

    play(type) {
      if (!this.enabled || !this.ctx) return;
      this.resume();

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const presets = {
        buy: { freq: 880, type: 'sine', dur: 0.12, vol: 0.08 },
        sell: { freq: 440, type: 'triangle', dur: 0.15, vol: 0.08 },
        short: { freq: 220, type: 'sawtooth', dur: 0.18, vol: 0.06 },
        cover: { freq: 660, type: 'square', dur: 0.12, vol: 0.06 },
        news: { freq: 1200, type: 'square', dur: 0.08, vol: 0.05 },
        crash: { freq: 80, type: 'sawtooth', dur: 0.4, vol: 0.1 },
        moon: { freq: 1400, type: 'sine', dur: 0.3, vol: 0.07 },
        qte_win: { freq: 1046, type: 'sine', dur: 0.2, vol: 0.08 },
        qte_lose: { freq: 150, type: 'sawtooth', dur: 0.25, vol: 0.08 },
        bankrupt: { freq: 100, type: 'triangle', dur: 0.6, vol: 0.1 },
        achievement: { freq: 1568, type: 'sine', dur: 0.35, vol: 0.09 },
      };

      const p = presets[type];
      if (!p) return;

      osc.type = p.type;
      osc.frequency.setValueAtTime(p.freq, t);
      if (type === 'moon') osc.frequency.exponentialRampToValueAtTime(2000, t + p.dur);
      if (type === 'crash') osc.frequency.exponentialRampToValueAtTime(40, t + p.dur);
      if (type === 'bankrupt') osc.frequency.exponentialRampToValueAtTime(50, t + p.dur);

      gain.gain.setValueAtTime(p.vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + p.dur);

      osc.start(t);
      osc.stop(t + p.dur);
    },

    setEnabled(v) { this.enabled = v; },
  };

  // ═══════════════════════════════════════════════════════════
  //  PARTICLES
  // ═══════════════════════════════════════════════════════════
  const Particles = {
    list: [],
    canvas: null,
    ctx: null,
    enabled: true,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    },

    resize(w, h) {
      if (!this.canvas) return;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    burst(type, w, h) {
      if (!this.enabled) return;
      const count = 25;
      const isMoon = type === 'moon' || type === 'surge';

      for (let i = 0; i < count; i++) {
        this.list.push({
          x: Utils.rand(w * 0.3, w * 0.9),
          y: isMoon ? h + 10 : Utils.rand(0, h * 0.5),
          vx: Utils.rand(-2, 2),
          vy: isMoon ? Utils.rand(-6, -2) : Utils.rand(2, 6),
          life: 1,
          color: isMoon ? '#34d399' : '#f87171',
          size: Utils.rand(3, 7),
          emoji: isMoon ? (Math.random() > 0.5 ? '🚀' : '✨') : (Math.random() > 0.5 ? '💀' : '📉'),
        });
      }
    },

    update(dt) {
      this.list.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= dt / 2000;
      });
      this.list = this.list.filter((p) => p.life > 0);
    },

    draw() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.ctx.clearRect(0, 0, w, h);

      this.list.forEach((p) => {
        this.ctx.globalAlpha = p.life;
        this.ctx.font = `${p.size * 3}px serif`;
        this.ctx.fillText(p.emoji, p.x, p.y);
      });
      this.ctx.globalAlpha = 1;
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  CHART (main stock line)
  // ═══════════════════════════════════════════════════════════
  const Chart = {
    canvas: null,
    ctx: null,
    container: null,
    points: [],
    recentTrend: 0,
    reducedMotion: false,

    init(canvas, container) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.container = container;
    },

    resize() {
      const rect = this.container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      Particles.resize(rect.width, rect.height);
    },

    seedPoints(price) {
      const w = this.container.clientWidth;
      this.points = [];
      for (let x = 0; x <= w; x += Config.POINT_SPACING) {
        this.points.push({ x, price: price + (Math.random() - 0.5) * 2 });
      }
    },

    updatePoint(price) {
      const w = this.container.clientWidth;
      this.points.forEach((pt) => { pt.x -= Config.SCROLL_SPEED; });
      this.points = this.points.filter((pt) => pt.x > -10);

      const lastX = this.points.length ? this.points[this.points.length - 1].x : w;
      const prev = this.points.length ? this.points[this.points.length - 1].price : price;
      this.recentTrend = price - prev;

      if (!this.points.length || lastX <= w - Config.POINT_SPACING) {
        this.points.push({ x: w, price });
      } else {
        this.points[this.points.length - 1].price = price;
      }
    },

    priceToY(p, minP, maxP, height) {
      const padding = height * 0.08;
      const range = maxP - minP || 1;
      return height - padding - ((p - minP) / range) * (height - padding * 2);
    },

    draw(price) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.ctx.clearRect(0, 0, w, h);

      this.ctx.strokeStyle = 'rgba(55, 65, 81, 0.3)';
      this.ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = (h / 5) * i;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
        this.ctx.stroke();
      }

      if (this.points.length < 2) return;

      const prices = this.points.map((p) => p.price);
      let minP = Math.min(...prices);
      let maxP = Math.max(...prices);
      const margin = (maxP - minP) * 0.15 || price * 0.05;
      minP -= margin;
      maxP += margin;

      const isUp = this.recentTrend >= 0;
      const lineColor = isUp ? '#34d399' : '#f87171';
      const glowColor = isUp ? 'rgba(52, 211, 153, 0.8)' : 'rgba(248, 113, 113, 0.8)';
      const blur = this.reducedMotion ? 0 : 14;

      const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, isUp ? 'rgba(52, 211, 153, 0.12)' : 'rgba(248, 113, 113, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.beginPath();
      this.points.forEach((pt, i) => {
        const y = this.priceToY(pt.price, minP, maxP, h);
        if (i === 0) this.ctx.moveTo(pt.x, y);
        else this.ctx.lineTo(pt.x, y);
      });
      const lastPt = this.points[this.points.length - 1];
      const firstPt = this.points[0];
      this.ctx.lineTo(lastPt.x, h);
      this.ctx.lineTo(firstPt.x, h);
      this.ctx.closePath();
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      this.ctx.beginPath();
      this.points.forEach((pt, i) => {
        const y = this.priceToY(pt.price, minP, maxP, h);
        if (i === 0) this.ctx.moveTo(pt.x, y);
        else this.ctx.lineTo(pt.x, y);
      });
      this.ctx.strokeStyle = lineColor;
      this.ctx.lineWidth = 2.5;
      this.ctx.lineJoin = 'round';
      this.ctx.shadowColor = glowColor;
      this.ctx.shadowBlur = blur;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      const lastY = this.priceToY(lastPt.price, minP, maxP, h);
      this.ctx.beginPath();
      this.ctx.arc(lastPt.x, lastY, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = lineColor;
      if (!this.reducedMotion) {
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = 20;
      }
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    },

    shake() {
      if (this.reducedMotion || this.container.classList.contains('shake')) return;
      this.container.classList.add('shake');
      setTimeout(() => this.container.classList.remove('shake'), 400);
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  SPARKLINE (portfolio history)
  // ═══════════════════════════════════════════════════════════
  const Sparkline = {
    canvas: null,
    ctx: null,
    history: [],
    maxPoints: 200,
    startValue: Config.START_CASH,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    },

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    push(value) {
      this.history.push(value);
      if (this.history.length > this.maxPoints) this.history.shift();
    },

    reset(startValue) {
      this.history = [startValue];
      this.startValue = startValue;
    },

    draw() {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.ctx.clearRect(0, 0, w, h);
      if (this.history.length < 2) return;

      const min = Math.min(...this.history) * 0.98;
      const max = Math.max(...this.history) * 1.02;
      const range = max - min || 1;
      const current = this.history[this.history.length - 1];
      const isProfit = current >= this.startValue;
      const color = isProfit ? '#34d399' : '#f87171';

      this.ctx.beginPath();
      this.history.forEach((v, i) => {
        const x = (i / (this.maxPoints - 1)) * w;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      });
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      const baseline = h - ((this.startValue - min) / range) * (h - 4) - 2;
      this.ctx.strokeStyle = 'rgba(107, 114, 128, 0.4)';
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(0, baseline);
      this.ctx.lineTo(w, baseline);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  MARKET (price simulation)
  // ═══════════════════════════════════════════════════════════
  const Market = {
    price: Config.START_PRICE,
    activeNews: null,
    difficulty: 'normal',

    reset() {
      this.price = Config.START_PRICE;
      this.activeNews = null;
    },

    getDiffConfig() {
      return Config.DIFFICULTIES[this.difficulty] || Config.DIFFICULTIES.normal;
    },

    applyRandomWalk(dt) {
      const seconds = dt / 1000;
      const jitter = (Math.random() - 0.5) * 2;
      this.price *= 1 + (jitter * Config.BASE_VOLATILITY * seconds) / 100;
    },

    applyNewsEffect(dt, upgrades) {
      if (!this.activeNews) return false;

      const elapsed = performance.now() - this.activeNews.startTime;
      if (elapsed >= this.activeNews.duration) {
        this.activeNews = null;
        return false;
      }

      const seconds = dt / 1000;
      const progress = elapsed / this.activeNews.duration;
      const fade = 1 - progress * 0.3;
      const type = this.activeNews.effectiveType || this.activeNews.type;

      let direction = 0;
      if (Utils.isBullish(type)) direction = 1;
      if (Utils.isBearish(type)) direction = -1;

      const intensity = type === 'massive_crash' ? 2.2 : type === 'moon' ? 1.8 : 1;
      let magnitude = this.activeNews.magnitude;
      if (Utils.isBearish(type) && upgrades.crash_padding) magnitude *= 0.85;

      const ratePerSecond = (magnitude * intensity) / (this.activeNews.duration / 1000);
      this.price *= 1 + direction * ratePerSecond * seconds * fade;

      return Utils.isBearish(type);
    },

    clamp() {
      if (this.price < Config.MIN_PRICE) this.price = Config.MIN_PRICE;
    },

    update(dt, upgrades) {
      this.applyRandomWalk(dt);
      const crashing = this.applyNewsEffect(dt, upgrades);
      this.clamp();
      return crashing;
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  PORTFOLIO
  // ═══════════════════════════════════════════════════════════
  const Portfolio = {
    cash: Config.START_CASH,
    shares: 0,
    shortShares: 0,
    shortAvgPrice: 0,
    startCash: Config.START_CASH,

    reset(startCash) {
      this.cash = startCash;
      this.shares = 0;
      this.shortShares = 0;
      this.shortAvgPrice = 0;
      this.startCash = startCash;
    },

    value() {
      return this.cash + this.shares * Market.price - this.shortShares * Market.price;
    },

    shortPnL() {
      if (this.shortShares <= 0) return 0;
      return (this.shortAvgPrice - Market.price) * this.shortShares;
    },

    maxShortShares() {
      const maxByCash = this.cash / Market.price;
      const maxByPortfolio = this.value() / Market.price;
      return Math.max(0, Math.min(maxByCash, maxByPortfolio));
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════
  const Achievements = {
    unlocked: new Set(),
    toastTimer: null,

    load(ids) {
      this.unlocked = new Set(ids);
    },

    unlock(id, meta, onUnlock) {
      if (this.unlocked.has(id)) return;
      this.unlocked.add(id);
      meta.achievements = [...this.unlocked];
      Storage.save(meta);

      const ach = Config.ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        AudioEngine.play('achievement');
        UI.showAchievementToast(ach.name, ach.desc);
        if (onUnlock) onUnlock(ach);
      }
    },

    checkUpgradeCollector(meta) {
      const allOwned = Config.UPGRADES.every((u) => meta.upgrades[u.id]);
      if (allOwned) this.unlock('upgrade_collector', meta);
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  META (chaos points & upgrades)
  // ═══════════════════════════════════════════════════════════
  const Meta = {
    data: Storage.load(),

    hasUpgrade(id) {
      return !!this.data.upgrades[id];
    },

    getStartCash() {
      return Config.START_CASH + (this.hasUpgrade('thick_skin') ? 500 : 0);
    },

    getQteDuration() {
      return this.hasUpgrade('spidey_sense') ? 3000 : Config.QTE_DURATION;
    },

    buyUpgrade(id) {
      const upgrade = Config.UPGRADES.find((u) => u.id === id);
      if (!upgrade || this.data.upgrades[id]) return false;
      if (this.data.chaosPoints < upgrade.cost) return false;

      this.data.chaosPoints -= upgrade.cost;
      this.data.upgrades[id] = true;
      Storage.save(this.data);
      Achievements.checkUpgradeCollector(this.data);
      return true;
    },

    awardPoints(amount) {
      let pts = amount;
      if (this.hasUpgrade('chaos_magnet')) pts = Math.floor(pts * 1.25);
      this.data.chaosPoints += pts;
      Storage.save(this.data);
      return pts;
    },

    calcRunPoints(runStats) {
      let pts = 0;
      pts += Math.floor(runStats.peakPortfolio / 100);
      pts += runStats.tradesMade * 2;
      pts += runStats.newsSurvived * 3;
      pts += runStats.qteWins * 5;
      if (runStats.peakPortfolio >= runStats.startCash * 2) pts += 25;
      if (runStats.bankrupt) pts = Math.floor(pts * 0.5);
      return Math.max(5, pts);
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  RUN STATS (per-run tracking)
  // ═══════════════════════════════════════════════════════════
  const RunStats = {
    startTime: 0,
    peakPortfolio: 0,
    tradesMade: 0,
    newsSurvived: 0,
    qteWins: 0,
    qteLosses: 0,
    crashesHeldThrough: 0,
    fullSizeTrades: 0,
    wasUnder10Pct: false,
    fakeNewsProfited: false,
    shortProfited: false,
    startCash: Config.START_CASH,
    bankrupt: false,

    reset(startCash) {
      this.startTime = performance.now();
      this.peakPortfolio = startCash;
      this.tradesMade = 0;
      this.newsSurvived = 0;
      this.qteWins = 0;
      this.qteLosses = 0;
      this.crashesHeldThrough = 0;
      this.fullSizeTrades = 0;
      this.wasUnder10Pct = false;
      this.fakeNewsProfited = false;
      this.shortProfited = false;
      this.startCash = startCash;
      this.bankrupt = false;
    },

    updatePeak() {
      const pv = Portfolio.value();
      if (pv > this.peakPortfolio) this.peakPortfolio = pv;
      if (pv < this.startCash * 0.1) this.wasUnder10Pct = true;
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  NEWS
  // ═══════════════════════════════════════════════════════════
  const News = {
    timer: null,
    pendingFakeReveal: null,

    schedule(game) {
      clearTimeout(this.timer);
      if (game.paused || game.gameOver) return;
      const diff = Market.getDiffConfig();
      const delay = Utils.rand(diff.newsMin, diff.newsMax);
      this.timer = setTimeout(() => this.trigger(game), delay);
    },

    trigger(game) {
      if (game.paused || game.gameOver) return;

      const event = Config.NEWS_EVENTS[Utils.randInt(0, Config.NEWS_EVENTS.length - 1)];
      const diff = Market.getDiffConfig();
      let magnitude = Utils.rand(event.magnitude[0], event.magnitude[1]) * diff.magnitudeMult;
      const duration = Utils.rand(2000, 4000);

      const roll = Math.random();
      let credibility = 'high';
      let isFake = false;

      if (roll < diff.fakeChance) {
        isFake = true;
        credibility = 'fake';
      } else if (roll < diff.fakeChance + 0.25) {
        credibility = 'medium';
      }

      const newsItem = {
        ...event,
        magnitude,
        duration,
        startTime: performance.now(),
        credibility,
        isFake,
        effectiveType: isFake ? Utils.invertType(event.type) : event.type,
        revealed: false,
      };

      Market.activeNews = newsItem;
      RunStats.newsSurvived++;

      UI.setNews(event.headline, credibility);
      AudioEngine.play('news');

      if (Utils.isBearish(event.type)) {
        Chart.shake();
        AudioEngine.play('crash');
        Particles.burst('crash', Chart.container.clientWidth, Chart.container.clientHeight);
      } else {
        AudioEngine.play('moon');
        Particles.burst('moon', Chart.container.clientWidth, Chart.container.clientHeight);
      }

      if (Utils.isBearish(event.type) && Portfolio.shares > 0) {
        RunStats.crashesHeldThrough++;
        if (RunStats.crashesHeldThrough >= 3) Achievements.unlock('diamond_hands', Meta.data);
      }

      if (isFake) {
        newsItem.startPortfolio = Portfolio.value();
        const revealDelay = Meta.hasUpgrade('insider_friend') ? 500 : 1000;
        clearTimeout(this.pendingFakeReveal);
        this.pendingFakeReveal = setTimeout(() => {
          if (!game.gameOver) {
            UI.revealFakeNews();
            if (Portfolio.value() > newsItem.startPortfolio) {
              Achievements.unlock('fake_out', Meta.data);
            }
          }
        }, revealDelay);
      }

      QTE.start(game, event.type, isFake);
      this.schedule(game);
    },

    clear() {
      clearTimeout(this.timer);
      clearTimeout(this.pendingFakeReveal);
      Market.activeNews = null;
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  QTE (quick-time events)
  // ═══════════════════════════════════════════════════════════
  const QTE = {
    active: false,
    startTime: 0,
    duration: Config.QTE_DURATION,
    newsType: null,
    isFake: false,
    resolved: false,
    animFrame: null,
    game: null,

    start(game, newsType, isFake) {
      this.game = game;
      this.active = true;
      this.resolved = false;
      this.newsType = newsType;
      this.isFake = isFake;
      this.duration = Meta.getQteDuration();
      this.startTime = performance.now();

      const bearish = Utils.isBearish(newsType);
      UI.showQTE(bearish ? 'PANIC SELL?' : 'DIAMOND HANDS?', this.duration);
      this.tick();
    },

    tick() {
      if (!this.active || this.resolved) return;

      const elapsed = performance.now() - this.startTime;
      const remaining = Math.max(0, 1 - elapsed / this.duration);
      UI.updateQTETimer(remaining);

      if (elapsed >= this.duration) {
        this.resolve(null);
        return;
      }

      this.animFrame = requestAnimationFrame(() => this.tick());
    },

    respond(panic) {
      if (!this.active || this.resolved) return;
      this.resolve(panic);
    },

    resolve(panic) {
      this.resolved = true;
      this.active = false;
      cancelAnimationFrame(this.animFrame);
      UI.hideQTE();

      if (panic === null) return;

      const bearish = Utils.isBearish(this.newsType);
      const correct = bearish ? panic : !panic;

      if (correct) {
        RunStats.qteWins++;
        const bonus = Portfolio.value() * 0.05;
        Portfolio.cash += bonus;
        AudioEngine.play('qte_win');
        UI.spawnFloatText(document.getElementById('qte-overlay'), `+${Utils.formatMoney(bonus)} QTE!`, true);
        if (RunStats.qteWins >= 5) Achievements.unlock('quick_fingers', Meta.data);
      } else {
        RunStats.qteLosses++;
        const penalty = Portfolio.value() * 0.03;
        Portfolio.cash = Math.max(0, Portfolio.cash - penalty);
        AudioEngine.play('qte_lose');
        UI.spawnFloatText(document.getElementById('qte-overlay'), `-${Utils.formatMoney(penalty)}`, false);
      }
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  TRADING
  // ═══════════════════════════════════════════════════════════
  const Trading = {
    tradeSizeIndex: 3,
    tradeLog: [],

    getTradeFraction() {
      return Config.TRADE_SIZES[this.tradeSizeIndex];
    },

    log(type, detail, pnl) {
      const entry = { type, detail, pnl, time: Utils.formatTime() };
      this.tradeLog.unshift(entry);
      if (this.tradeLog.length > 50) this.tradeLog.pop();
      UI.renderTradeLog(this.tradeLog);
    },

    buy() {
      const frac = this.getTradeFraction();
      const spend = Portfolio.cash * frac;
      if (spend <= 0) return;

      const bought = spend / Market.price;
      Portfolio.cash -= spend;
      Portfolio.shares += bought;
      RunStats.tradesMade++;
      if (frac >= 1) RunStats.fullSizeTrades++;

      AudioEngine.play('buy');
      UI.animateButton('buy-btn');
      UI.spawnFloatText(document.getElementById('buy-btn').parentElement, `+${Utils.formatShares(bought)}`, true);
      this.log('buy', `BUY ${Utils.formatShares(bought)} @ ${Utils.formatMoney(Market.price)}`, 0);

      Achievements.unlock('first_trade', Meta.data);
      if (RunStats.fullSizeTrades >= 5) Achievements.unlock('all_in', Meta.data);
      if (spend >= 5000) Achievements.unlock('whale', Meta.data);
      if (Portfolio.shares > 0 && Portfolio.shortShares > 0) Achievements.unlock('hedge_lord', Meta.data);
    },

    sell() {
      const frac = this.getTradeFraction();
      const sellQty = Portfolio.shares * frac;
      if (sellQty <= 0) return;

      const proceeds = sellQty * Market.price;
      Portfolio.shares -= sellQty;
      Portfolio.cash += proceeds;
      RunStats.tradesMade++;
      if (frac >= 1) RunStats.fullSizeTrades++;

      AudioEngine.play('sell');
      UI.animateButton('sell-btn');
      UI.spawnFloatText(document.getElementById('sell-btn').parentElement, Utils.formatMoney(proceeds), true);
      this.log('sell', `SELL ${Utils.formatShares(sellQty)} @ ${Utils.formatMoney(Market.price)}`, proceeds);

      if (Market.activeNews && Utils.isBullish(Market.activeNews.type)) {
        Achievements.unlock('paper_hands', Meta.data);
      }
      if (RunStats.fullSizeTrades >= 5) Achievements.unlock('all_in', Meta.data);
      if (proceeds >= 5000) Achievements.unlock('whale', Meta.data);
    },

    short() {
      const frac = this.getTradeFraction();
      const maxShort = Portfolio.maxShortShares();
      const qty = maxShort * frac;
      if (qty <= 0) return;

      const proceeds = qty * Market.price;
      const totalShort = Portfolio.shortShares + qty;
      Portfolio.shortAvgPrice = Portfolio.shortShares > 0
        ? (Portfolio.shortAvgPrice * Portfolio.shortShares + Market.price * qty) / totalShort
        : Market.price;
      Portfolio.shortShares = totalShort;
      Portfolio.cash += proceeds;
      RunStats.tradesMade++;

      AudioEngine.play('short');
      UI.animateButton('short-btn');
      UI.spawnFloatText(document.getElementById('short-btn').parentElement, `-${Utils.formatShares(qty)}`, false);
      this.log('short', `SHORT ${Utils.formatShares(qty)} @ ${Utils.formatMoney(Market.price)}`, 0);

      Achievements.unlock('first_trade', Meta.data);
      if (Portfolio.shares > 0 && Portfolio.shortShares > 0) Achievements.unlock('hedge_lord', Meta.data);
    },

    cover() {
      const frac = this.getTradeFraction();
      const qty = Portfolio.shortShares * frac;
      if (qty <= 0) return;

      const cost = qty * Market.price;
      const pnl = (Portfolio.shortAvgPrice - Market.price) * qty;
      Portfolio.cash -= cost;
      Portfolio.shortShares -= qty;
      if (Portfolio.shortShares <= 0) {
        Portfolio.shortShares = 0;
        Portfolio.shortAvgPrice = 0;
      }
      RunStats.tradesMade++;

      if (pnl > 0) {
        RunStats.shortProfited = true;
        Achievements.unlock('short_king', Meta.data);
      }

      AudioEngine.play('cover');
      UI.animateButton('cover-btn');
      UI.spawnFloatText(document.getElementById('cover-btn').parentElement, Utils.formatMoney(Math.abs(pnl)), pnl >= 0);
      this.log('cover', `COVER ${Utils.formatShares(qty)} @ ${Utils.formatMoney(Market.price)}`, pnl);
    },

    reset() {
      this.tradeLog = [];
      this.tradeSizeIndex = 3;
      UI.renderTradeLog([]);
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  UI
  // ═══════════════════════════════════════════════════════════
  const UI = {
    els: {},

    cache() {
      const ids = [
        'game-ui', 'main-menu', 'pause-overlay', 'score-overlay', 'qte-overlay',
        'upgrades-overlay', 'achievements-overlay', 'achievement-toast',
        'portfolio-value', 'liquid-cash', 'total-shares', 'short-shares', 'short-pnl',
        'stock-price', 'news-text', 'news-banner', 'credibility-badge', 'fake-news-stamp',
        'trend-badge', 'trade-size-slider', 'trade-size-label', 'trade-log', 'trade-log-count',
        'difficulty-badge', 'chaos-points-badge', 'menu-chaos-points', 'upgrade-chaos-points',
        'mute-btn', 'qte-prompt', 'qte-timer-bar', 'score-title', 'score-subtitle',
        'score-peak', 'score-trades', 'score-news', 'score-qte', 'score-chaos-earned',
        'upgrades-list', 'achievements-list',
        'achievement-toast-title', 'achievement-toast-desc',
        'setting-sound', 'setting-reduced-motion', 'setting-particles',
      ];
      ids.forEach((id) => { this.els[id] = document.getElementById(id); });
    },

    show(el) { if (this.els[el]) this.els[el].classList.remove('hidden'); },
    hide(el) { if (this.els[el]) this.els[el].classList.add('hidden'); },

    updatePortfolio() {
      const pv = Portfolio.value();
      this.els['portfolio-value'].textContent = Utils.formatMoney(pv);
      this.els['liquid-cash'].textContent = Utils.formatMoney(Portfolio.cash);
      this.els['total-shares'].textContent = Utils.formatShares(Portfolio.shares);
      this.els['short-shares'].textContent = Utils.formatShares(Portfolio.shortShares);
      this.els['stock-price'].textContent = Utils.formatMoney(Market.price);

      const shortPnl = Portfolio.shortPnL();
      this.els['short-pnl'].textContent = Portfolio.shortShares > 0
        ? `P&L: ${Utils.formatMoney(shortPnl)}`
        : '';
      this.els['short-pnl'].className = `font-mono text-[10px] ${shortPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`;

      const profit = pv >= Portfolio.startCash;
      this.els['portfolio-value'].classList.toggle('neon-green', profit);
      this.els['portfolio-value'].classList.toggle('neon-red', !profit);

      if (Chart.recentTrend >= 0) {
        this.els['trend-badge'].textContent = '▲ BULLISH';
        this.els['trend-badge'].className = 'absolute top-2 right-2 sm:top-3 sm:right-3 font-mono text-[10px] sm:text-xs px-2 py-1 rounded border border-emerald-700/50 bg-gray-900/80 text-emerald-400';
      } else {
        this.els['trend-badge'].textContent = '▼ BEARISH';
        this.els['trend-badge'].className = 'absolute top-2 right-2 sm:top-3 sm:right-3 font-mono text-[10px] sm:text-xs px-2 py-1 rounded border border-red-700/50 bg-gray-900/80 text-red-400';
      }

      const sizes = ['25%', '50%', '75%', '100%'];
      this.els['trade-size-label'].textContent = sizes[Trading.tradeSizeIndex];

      document.getElementById('buy-btn').disabled = Portfolio.cash <= 0;
      document.getElementById('sell-btn').disabled = Portfolio.shares <= 0;
      document.getElementById('short-btn').disabled = Portfolio.maxShortShares() <= 0;
      document.getElementById('cover-btn').disabled = Portfolio.shortShares <= 0;

      this.els['chaos-points-badge'].textContent = `${Meta.data.chaosPoints} CP`;
      this.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;
    },

    setNews(headline, credibility) {
      this.els['news-text'].textContent = headline;
      const badge = this.els['credibility-badge'];
      badge.textContent = credibility.toUpperCase();
      badge.className = `flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded uppercase credibility-${credibility}`;
      this.els['fake-news-stamp'].classList.add('hidden');

      const banner = this.els['news-banner'];
      banner.classList.remove('flash');
      void banner.offsetWidth;
      banner.classList.add('flash');
    },

    revealFakeNews() {
      this.els['fake-news-stamp'].classList.remove('hidden');
      const banner = this.els['news-banner'];
      banner.classList.remove('flash');
      void banner.offsetWidth;
      banner.classList.add('flash');
    },

    showQTE(prompt, duration) {
      this.els['qte-prompt'].textContent = prompt;
      this.els['qte-timer-bar'].style.transition = 'none';
      this.els['qte-timer-bar'].style.width = '100%';
      this.show('qte-overlay');
    },

    updateQTETimer(remaining) {
      this.els['qte-timer-bar'].style.width = `${remaining * 100}%`;
    },

    hideQTE() {
      this.hide('qte-overlay');
    },

    animateButton(id) {
      const btn = document.getElementById(id);
      btn.classList.remove('clicked');
      void btn.offsetWidth;
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 250);
    },

    spawnFloatText(parent, text, positive) {
      const el = document.createElement('span');
      el.className = 'float-text ' + (positive ? 'positive' : 'negative');
      el.textContent = text;
      parent.style.position = 'relative';
      parent.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    },

    renderTradeLog(log) {
      const container = this.els['trade-log'];
      this.els['trade-log-count'].textContent = `(${log.length})`;
      container.innerHTML = log.map((e) => {
        const cls = `log-${e.type}`;
        const pnlStr = e.pnl !== 0 ? ` <span class="${e.pnl >= 0 ? 'log-profit' : 'log-loss'}">(${e.pnl >= 0 ? '+' : ''}${Utils.formatMoney(e.pnl)})</span>` : '';
        return `<div class="${cls}">[${e.time}] ${e.detail}${pnlStr}</div>`;
      }).join('') || '<div class="text-gray-600">No trades yet</div>';
    },

    showAchievementToast(title, desc) {
      this.els['achievement-toast-title'].textContent = title;
      this.els['achievement-toast-desc'].textContent = desc;
      this.els['achievement-toast'].classList.remove('hidden');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.els['achievement-toast'].classList.add('hidden'), 3500);
    },

    setDifficultyBadge(difficulty) {
      const diff = Config.DIFFICULTIES[difficulty];
      const badge = this.els['difficulty-badge'];
      badge.textContent = diff.label;
      badge.className = `badge ${diff.badgeClass}`;
    },

    renderUpgrades() {
      const container = this.els['upgrades-list'];
      this.els['upgrade-chaos-points'].textContent = Meta.data.chaosPoints;
      container.innerHTML = Config.UPGRADES.map((u) => {
        const owned = Meta.hasUpgrade(u.id);
        return `<div class="upgrade-card ${owned ? 'owned' : ''}">
          <div>
            <p class="font-bold text-sm">${u.name}</p>
            <p class="text-xs text-gray-400">${u.desc}</p>
          </div>
          <button data-upgrade="${u.id}" class="px-4 py-2 rounded-lg font-bold text-sm ${owned ? 'bg-emerald-800 text-emerald-300' : 'bg-purple-700 hover:bg-purple-600 text-white'}" ${owned || Meta.data.chaosPoints < u.cost ? 'disabled' : ''}>
            ${owned ? 'OWNED' : `${u.cost} CP`}
          </button>
        </div>`;
      }).join('');
    },

    renderAchievements() {
      const container = this.els['achievements-list'];
      container.innerHTML = Config.ACHIEVEMENTS.map((a) => {
        const unlocked = Achievements.unlocked.has(a.id);
        return `<div class="achievement-row ${unlocked ? 'unlocked' : 'locked'}">
          <span class="text-xl">${unlocked ? '🏆' : '🔒'}</span>
          <div>
            <p class="font-bold text-sm">${a.name}</p>
            <p class="text-xs text-gray-400">${a.desc}</p>
          </div>
        </div>`;
      }).join('');
    },

    showScoreScreen(bankrupt, pointsEarned) {
      this.els['score-title'].textContent = bankrupt ? 'BANKRUPT' : 'RUN COMPLETE';
      this.els['score-title'].className = bankrupt
        ? 'text-4xl sm:text-6xl font-black tracking-widest mb-2 neon-red'
        : 'text-4xl sm:text-6xl font-black tracking-widest mb-2 neon-green';
      this.els['score-subtitle'].textContent = bankrupt
        ? 'Your portfolio has been liquidated to zero.'
        : 'You cashed out of the chaos.';
      this.els['score-peak'].textContent = Utils.formatMoney(RunStats.peakPortfolio);
      this.els['score-trades'].textContent = RunStats.tradesMade;
      this.els['score-news'].textContent = RunStats.newsSurvived;
      this.els['score-qte'].textContent = RunStats.qteWins;
      this.els['score-chaos-earned'].textContent = pointsEarned;
      this.show('score-overlay');
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  GAME (orchestrator)
  // ═══════════════════════════════════════════════════════════
  const Game = {
    running: false,
    paused: false,
    gameOver: false,
    lastTimestamp: 0,
    difficulty: 'normal',
    secondChanceUsed: false,
    pauseTime: 0,
    newsPausedAt: 0,

    init() {
      UI.cache();
      Meta.data = Storage.load();
      Achievements.load(Meta.data.achievements);

      Chart.init(document.getElementById('stock-chart'), document.getElementById('chart-container'));
      Sparkline.init(document.getElementById('sparkline-chart'));
      Particles.init(document.getElementById('particle-canvas'));

      Chart.reducedMotion = Meta.data.settings.reducedMotion;
      Particles.enabled = Meta.data.settings.particles;
      AudioEngine.enabled = Meta.data.settings.sound;
      document.body.classList.toggle('reduced-motion', Meta.data.settings.reducedMotion);

      UI.els['setting-sound'].checked = Meta.data.settings.sound;
      UI.els['setting-reduced-motion'].checked = Meta.data.settings.reducedMotion;
      UI.els['setting-particles'].checked = Meta.data.settings.particles;
      UI.els['mute-btn'].textContent = Meta.data.settings.sound ? '🔊' : '🔇';

      this.difficulty = Meta.data.selectedDifficulty || 'normal';
      this.highlightDifficulty(this.difficulty);
      UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;

      this.bindEvents();
      this.resize();
      window.addEventListener('resize', () => this.resize());
      requestAnimationFrame((t) => this.loop(t));
    },

    bindEvents() {
      document.getElementById('start-game-btn').addEventListener('click', () => {
        AudioEngine.init();
        AudioEngine.resume();
        this.startRun();
      });

      document.getElementById('open-upgrades-btn').addEventListener('click', () => {
        UI.renderUpgrades();
        UI.show('upgrades-overlay');
      });

      document.getElementById('open-achievements-btn').addEventListener('click', () => {
        UI.renderAchievements();
        UI.show('achievements-overlay');
      });

      document.getElementById('close-upgrades-btn').addEventListener('click', () => UI.hide('upgrades-overlay'));
      document.getElementById('close-achievements-btn').addEventListener('click', () => UI.hide('achievements-overlay'));

      document.querySelectorAll('#difficulty-select .diff-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.difficulty = btn.dataset.difficulty;
          Meta.data.selectedDifficulty = this.difficulty;
          Storage.save(Meta.data);
          this.highlightDifficulty(this.difficulty);
        });
      });

      document.getElementById('upgrades-list').addEventListener('click', (e) => {
        const id = e.target.dataset?.upgrade;
        if (!id) return;
        if (Meta.buyUpgrade(id)) {
          UI.renderUpgrades();
          UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;
        }
      });

      document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
      document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
      document.getElementById('end-run-btn').addEventListener('click', () => { this.togglePause(); this.endRun(false); });

      document.getElementById('mute-btn').addEventListener('click', () => {
        Meta.data.settings.sound = !Meta.data.settings.sound;
        AudioEngine.setEnabled(Meta.data.settings.sound);
        UI.els['setting-sound'].checked = Meta.data.settings.sound;
        UI.els['mute-btn'].textContent = Meta.data.settings.sound ? '🔊' : '🔇';
        Storage.save(Meta.data);
      });

      UI.els['setting-sound'].addEventListener('change', (e) => {
        Meta.data.settings.sound = e.target.checked;
        AudioEngine.setEnabled(e.target.checked);
        UI.els['mute-btn'].textContent = e.target.checked ? '🔊' : '🔇';
        Storage.save(Meta.data);
      });

      UI.els['setting-reduced-motion'].addEventListener('change', (e) => {
        Meta.data.settings.reducedMotion = e.target.checked;
        Chart.reducedMotion = e.target.checked;
        document.body.classList.toggle('reduced-motion', e.target.checked);
        Storage.save(Meta.data);
      });

      UI.els['setting-particles'].addEventListener('change', (e) => {
        Meta.data.settings.particles = e.target.checked;
        Particles.enabled = e.target.checked;
        Storage.save(Meta.data);
      });

      document.getElementById('buy-btn').addEventListener('click', () => { if (!this.paused && !this.gameOver) { Trading.buy(); this.checkAchievements(); } });
      document.getElementById('sell-btn').addEventListener('click', () => { if (!this.paused && !this.gameOver) { Trading.sell(); this.checkAchievements(); } });
      document.getElementById('short-btn').addEventListener('click', () => { if (!this.paused && !this.gameOver) { Trading.short(); this.checkAchievements(); } });
      document.getElementById('cover-btn').addEventListener('click', () => { if (!this.paused && !this.gameOver) { Trading.cover(); this.checkAchievements(); } });

      UI.els['trade-size-slider'].addEventListener('input', (e) => {
        Trading.tradeSizeIndex = parseInt(e.target.value, 10);
      });

      document.getElementById('qte-yes').addEventListener('click', () => QTE.respond(true));
      document.getElementById('qte-no').addEventListener('click', () => QTE.respond(false));

      document.getElementById('score-restart-btn').addEventListener('click', () => {
        UI.hide('score-overlay');
        this.startRun();
      });

      document.getElementById('score-menu-btn').addEventListener('click', () => {
        UI.hide('score-overlay');
        UI.hide('game-ui');
        UI.show('main-menu');
        UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;
      });

      document.getElementById('score-upgrades-btn').addEventListener('click', () => {
        UI.renderUpgrades();
        UI.show('upgrades-overlay');
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.running && !this.gameOver) this.togglePause();
          return;
        }
        if (QTE.active && !QTE.resolved) {
          if (e.key === 'y' || e.key === 'Y') QTE.respond(true);
          if (e.key === 'n' || e.key === 'N') QTE.respond(false);
        }
      });
    },

    highlightDifficulty(diff) {
      document.querySelectorAll('#difficulty-select .diff-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.difficulty === diff);
      });
    },

    resize() {
      Chart.resize();
      Sparkline.resize();
    },

    startRun() {
      this.running = true;
      this.paused = false;
      this.gameOver = false;
      this.lastTimestamp = 0;
      this.secondChanceUsed = false;
      this.difficulty = Meta.data.selectedDifficulty || 'normal';
      Market.difficulty = this.difficulty;

      const startCash = Meta.getStartCash();
      Portfolio.reset(startCash);
      Market.reset();
      RunStats.reset(startCash);
      Trading.reset();
      Sparkline.reset(startCash);
      Chart.seedPoints(Market.price);

      News.clear();
      QTE.active = false;
      QTE.resolved = true;
      UI.hideQTE();
      UI.hide('main-menu');
      UI.hide('score-overlay');
      UI.hide('pause-overlay');
      UI.show('game-ui');

      UI.setDifficultyBadge(this.difficulty);
      UI.setNews('Markets open. Brace for chaos...', 'high');
      UI.updatePortfolio();

      News.schedule(this);
    },

    togglePause() {
      if (!this.running || this.gameOver) return;
      this.paused = !this.paused;

      if (this.paused) {
        this.pauseTime = performance.now();
        UI.show('pause-overlay');
      } else {
        UI.hide('pause-overlay');
      }
    },

    checkAchievements() {
      const pv = Portfolio.value();
      if (pv >= Portfolio.startCash * 2) {
        Achievements.unlock('to_the_moon', Meta.data);
        if (this.difficulty === 'nightmare') Achievements.unlock('nightmare_clear', Meta.data);
      }
      if (RunStats.wasUnder10Pct && pv >= Portfolio.startCash) {
        Achievements.unlock('barely_alive', Meta.data);
      }
      if (RunStats.newsSurvived >= 20) Achievements.unlock('chaos_surfer', Meta.data);
    },

    checkBankruptcy() {
      if (this.gameOver) return;

      const pv = Portfolio.value();
      if (pv <= 0) {
        if (Meta.hasUpgrade('second_chance') && !this.secondChanceUsed) {
          this.secondChanceUsed = true;
          Portfolio.cash = 100;
          Portfolio.shares = 0;
          Portfolio.shortShares = 0;
          UI.spawnFloatText(document.getElementById('portfolio-value').parentElement, 'SECOND CHANCE!', true);
          return;
        }

        this.endRun(true);
      }
    },

    endRun(bankrupt) {
      this.gameOver = true;
      this.running = false;
      RunStats.bankrupt = bankrupt;
      News.clear();

      if (bankrupt) {
        AudioEngine.play('bankrupt');
        const elapsed = (performance.now() - RunStats.startTime) / 1000;
        if (elapsed < 60) Achievements.unlock('speed_bankrupt', Meta.data);
      }

      const points = Meta.awardPoints(Meta.calcRunPoints({
        peakPortfolio: RunStats.peakPortfolio,
        tradesMade: RunStats.tradesMade,
        newsSurvived: RunStats.newsSurvived,
        qteWins: RunStats.qteWins,
        startCash: RunStats.startCash,
        bankrupt,
      }));

      UI.showScoreScreen(bankrupt, points);
    },

    loop(timestamp) {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      let dt = Math.min(timestamp - this.lastTimestamp, 50);
      this.lastTimestamp = timestamp;

      if (this.running && !this.paused && !this.gameOver) {
        const crashing = Market.update(dt, {
          crash_padding: Meta.hasUpgrade('crash_padding'),
        });

        if (crashing) Chart.shake();

        Chart.updatePoint(Market.price);
        RunStats.updatePeak();
        Sparkline.push(Portfolio.value());
        this.checkAchievements();
        this.checkBankruptcy();
      }

      Chart.draw(Market.price);
      Sparkline.draw();
      Particles.update(dt);
      Particles.draw();
      UI.updatePortfolio();

      requestAnimationFrame((t) => this.loop(t));
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  BOOT
  // ═══════════════════════════════════════════════════════════
  Game.init();
})();
