(() => {
  'use strict';

  // Balance tuned v4 — regimes, news pool, combos
  const Config = {
    START_CASH: 1000,
    START_PRICE: 100,
    MIN_PRICE: 0.01,
    SCROLL_SPEED: 2.5,
    POINT_SPACING: 4,
    BASE_VOLATILITY: 0.32,
    TRADE_SIZES: [0.25, 0.5, 0.75, 1.0],
    TRADE_SIZE_YOLO: 1.2,
    QTE_DURATION: 2000,
    STORAGE_KEY: 'isc_meta_v2',
    TOTAL_WAVES: 5,
    WAVE_DURATION_BASE: 75000,
    WAVE_DURATION_STEP: 3750,
    MARGIN_CALL_THRESHOLD: 0.6,
    MARGIN_CALL_TIME: 8000,
    MAX_CRASH_MAGNITUDE: 0.35,
    HEADLINE_REPEAT_COOLDOWN: 25,
    PROCEDURAL_NEWS_CHANCE: 0.4,
    REGIME_DURATION_MIN: 15000,
    REGIME_DURATION_MAX: 30000,
    MEAN_REVERSION_STRENGTH: 0.00012,
    COMBO_MAX: 3,
    RETIRE_MILESTONES: [
      { amount: 5000, bonus: 40 },
      { amount: 10000, bonus: 100 },
      { amount: 25000, bonus: 250 },
    ],

    DIFFICULTIES: {
      normal: { label: 'NORMAL', newsMin: 6000, newsMax: 10000, magnitudeMult: 1.0, fakeChance: 0.15, badgeClass: 'badge-normal' },
      chaos: { label: 'CHAOS', newsMin: 4000, newsMax: 6000, magnitudeMult: 1.2, fakeChance: 0.25, badgeClass: 'badge-chaos-mode' },
      nightmare: { label: 'NIGHTMARE', newsMin: 3000, newsMax: 5000, magnitudeMult: 1.35, fakeChance: 0.35, badgeClass: 'badge-nightmare' },
    },

    WAVE_GOAL_IDS: ['survive_floor', 'shares_min', 'short_profit', 'qte_wins', 'no_sell_moon', 'profit_wave'],

    WAVE_SHOP: [
      { id: 'news_shield', name: 'News Shield', desc: 'Block next headline effect', cost: 25 },
      { id: 'instant_cash', name: 'Pump & Dump', desc: '+$200 cash instantly', cost: 20 },
      { id: 'qte_boost', name: 'Reflex Booster', desc: '2x QTE bonus next wave', cost: 30 },
      { id: 'repair', name: 'Portfolio Massage', desc: '+5% portfolio value', cost: 35 },
    ],

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
      { headline: 'SEC raids headquarters live on CNBC', type: 'sec_raid', magnitude: [0.10, 0.20] },
      { headline: 'Stock splits 10:1, UI team panics', type: 'surge', magnitude: [0.15, 0.25] },
      { headline: 'CEO kidnapped by rival startup', type: 'crash', magnitude: [0.35, 0.55] },
      { headline: 'Company buys island, names it "Tax Haven"', type: 'moon', magnitude: [0.30, 0.50] },
      { headline: 'Product demo catches fire on stage', type: 'crash', magnitude: [0.20, 0.40] },
      { headline: 'ChatGPT appointed interim CFO', type: 'surge', magnitude: [0.25, 0.45] },
      { headline: 'Insider trading but everyone is an insider', type: 'surge', magnitude: [0.10, 0.20] },
      { headline: 'Earnings beat by negative $400M', type: 'moon', magnitude: [0.20, 0.35] },
      { headline: 'NFT of company logo sells for $2', type: 'crash', magnitude: [0.15, 0.30] },
      { headline: 'Board discovers CEO is three kids in a trenchcoat', type: 'massive_crash', magnitude: [0.45, 0.60] },
      { headline: 'Government bailout because meme was funny', type: 'moon', magnitude: [0.40, 0.70] },
      { headline: 'Ransomware encrypts entire supply chain', type: 'crash', magnitude: [0.25, 0.40] },
      { headline: 'Celebrity chef appointed head of R&D', type: 'surge', magnitude: [0.15, 0.28] },
      { headline: 'Company tweets through a crisis, somehow wins', type: 'surge', magnitude: [0.18, 0.32] },
      { headline: 'Short squeeze fueled by Discord frog memes', type: 'moon', magnitude: [0.45, 0.65] },
      { headline: 'Accounting error adds extra zero to debt', type: 'massive_crash', magnitude: [0.35, 0.55] },
      { headline: 'Partnership with firm that does not exist', type: 'crash', magnitude: [0.20, 0.38] },
      { headline: 'Viral TikTok dance moves markets', type: 'surge', magnitude: [0.22, 0.42] },
      { headline: 'Printer goes brrr, stock goes wee', type: 'moon', magnitude: [0.30, 0.55] },
      { headline: 'Class action lawsuit over vibes', type: 'crash', magnitude: [0.18, 0.33] },
    ],

    BOSS_EVENTS: [
      { headline: '👹 BOSS: Market Meltdown Monday', type: 'massive_crash', magnitude: [0.50, 0.70], boss: true },
      { headline: '👹 BOSS: Short Squeeze Armageddon', type: 'moon', magnitude: [0.60, 0.90], boss: true },
      { headline: '👹 BOSS: The Fed Goes Live on Twitch', type: 'massive_crash', magnitude: [0.55, 0.80], boss: true },
    ],

    UPGRADES: [
      { id: 'thick_skin', name: 'Thick Skin', desc: 'Start each run with +$500 cash', cost: 50 },
      { id: 'spidey_sense', name: 'Spidey Sense', desc: 'QTE window lasts 3 seconds', cost: 75 },
      { id: 'crash_padding', name: 'Crash Padding', desc: 'Crash news deals 15% less damage', cost: 100 },
      { id: 'insider_friend', name: 'Insider Friend', desc: 'Sometimes flags fake news (50% accuracy)', cost: 80 },
      { id: 'chaos_magnet', name: 'Chaos Magnet', desc: 'Earn 25% more Chaos Points', cost: 120 },
      { id: 'second_chance', name: 'Second Chance', desc: 'Survive bankruptcy once at 25% cash', cost: 150 },
      { id: 'vpn_wallst', name: 'VPN to Wall St', desc: 'Vague sentiment hint before news', cost: 60 },
      { id: 'coffee_iv', name: 'Coffee IV Drip', desc: 'News events arrive 10% slower', cost: 70 },
      { id: 'lawyer', name: 'Lawyer on Retainer', desc: 'SEC Raid fines reduced 50%', cost: 90 },
      { id: 'yolo_gene', name: 'YOLO Gene', desc: 'Unlock 120% margin trade size', cost: 110 },
      { id: 'tinfoil_hat', name: 'Tinfoil Hat', desc: 'SUSPICIOUS badge on sketchy news', cost: 85 },
      { id: 'compound_interest', name: 'Compound Interest', desc: '+2% portfolio between waves', cost: 95 },
      { id: 'ghost_portfolio', name: 'Ghost Portfolio', desc: 'Undo last trade once per run', cost: 130 },
      { id: 'influencer_collab', name: 'Influencer Collab', desc: '+1 bonus CP per wave goal', cost: 75 },
      { id: 'dark_pool', name: 'Dark Pool Access', desc: 'Short up to 25% extra on margin', cost: 105 },
      { id: 'rug_pull_insurance', name: 'Rug Pull Insurance', desc: 'First crash each run capped at -20%', cost: 115 },
      { id: 'vibe_analyst', name: 'Vibe Analyst', desc: 'Noisy sentiment meter (often wrong)', cost: 55 },
      { id: 'exit_liquidity', name: 'Exit Liquidity', desc: 'Cash Out gives +15% CP bonus', cost: 100 },
    ],

    ACHIEVEMENTS: [
      { id: 'first_trade', name: 'First Blood', desc: 'Execute your first trade', hint: 'Make any trade' },
      { id: 'paper_hands', name: 'Paper Hands', desc: 'Sell during a moon or surge', hint: 'Sell while price is pumping' },
      { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Hold through 3 crash events', hint: 'Keep shares during crashes' },
      { id: 'speed_bankrupt', name: 'Reverse Warren Buffett', desc: 'Bankrupt in under 60 seconds', hint: 'Lose fast' },
      { id: 'to_the_moon', name: 'To the Moon', desc: 'Reach 2x starting portfolio', hint: 'Double your money' },
      { id: 'short_king', name: 'Short King', desc: 'Close a profitable short', hint: 'Cover a winning short' },
      { id: 'fake_out', name: 'Fake Out', desc: 'Profit from fake news reversal', hint: 'Ride the fake-out' },
      { id: 'quick_fingers', name: 'Quick Fingers', desc: 'Win 5 QTEs in one run', hint: 'Master the prompts' },
      { id: 'whale', name: 'Whale', desc: 'Trade over $5,000 at once', hint: 'Go big' },
      { id: 'chaos_surfer', name: 'Chaos Surfer', desc: 'Survive 20 news events in a run', hint: 'Endure the feed' },
      { id: 'barely_alive', name: 'Barely Alive', desc: 'Recover from under 10% to profit', hint: 'Clutch comeback' },
      { id: 'all_in', name: 'All In', desc: 'Make 5 trades at 100%+ size', hint: 'Max sizing spree' },
      { id: 'hedge_lord', name: 'Hedge Lord', desc: 'Hold long and short at once', hint: 'Hedge like a pro' },
      { id: 'nightmare_clear', name: 'Nightmare Clear', desc: '2x portfolio on Nightmare', hint: 'Beat nightmare odds' },
      { id: 'upgrade_collector', name: 'Upgrade Collector', desc: 'Own all permanent upgrades', hint: 'Buy everything' },
      { id: 'wave_warrior', name: 'Wave Warrior', desc: 'Clear all 5 waves', hint: 'Finish a full run' },
      { id: 'smart_exit', name: 'Smart Exit', desc: 'Cash out with $3k+ profit', hint: 'Leave on top' },
      { id: 'greedy_bastard', name: 'Greedy Bastard', desc: 'Lose after clearing wave 4+', hint: 'Greed kills' },
      { id: 'margin_monster', name: 'Margin Monster', desc: 'Execute a 120% margin trade', hint: 'YOLO sizing' },
      { id: 'sec_survivor', name: 'SEC Survivor', desc: 'Survive an SEC Raid', hint: 'Beat the regulators' },
      { id: 'five_wave_flawless', name: 'Five Wave Flawless', desc: 'Complete every wave goal in a run', hint: 'Perfect waves' },
      { id: 'millionaire_mindset', name: 'Millionaire Mindset', desc: 'Reach $10,000 portfolio', hint: 'Five figures' },
      { id: 'daily_degenerate', name: 'Daily Degenerate', desc: 'Complete a Daily Chaos run', hint: 'Play daily seed mode' },
      { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Survive a boss event', hint: 'Beat a boss headline' },
      { id: 'shopaholic', name: 'Shopaholic', desc: 'Buy 3 mid-run shop items in one run', hint: 'Spend CP mid-run' },
      { id: 'streak_master', name: 'Streak Master', desc: 'Reach a 5 win streak', hint: 'Cash out 5 times in a row' },
      { id: 'victory_lap', name: 'Victory Lap', desc: 'Retire early at $25k milestone', hint: 'Retire as legend' },
    ],
  };

  const RNG = {
    seed: Date.now(),
    useSeed: false,
    setSeed(s) { this.seed = s; this.useSeed = true; },
    reset() { this.useSeed = false; },
    next() {
      if (!this.useSeed) return Math.random();
      this.seed = (this.seed * 16807) % 2147483647;
      return (this.seed - 1) / 2147483646;
    },
    rand(min, max) { return min + this.next() * (max - min); },
    randInt(min, max) { return Math.floor(this.rand(min, max + 1)); },
  };

  const Utils = {
    rand: (min, max) => RNG.rand(min, max),
    randInt: (min, max) => RNG.randInt(min, max),
    formatMoney: (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    formatShares: (n) => n.toLocaleString('en-US', { maximumFractionDigits: 4 }),
    formatTime: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    isBullish: (t) => t === 'moon' || t === 'surge',
    isBearish: (t) => t === 'crash' || t === 'massive_crash',
    invertType: (t) => ({ moon: 'crash', crash: 'moon', massive_crash: 'surge', surge: 'crash' }[t] || t),
    dailySeed() {
      const d = new Date();
      return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    },
    categoryLabel(type) {
      if (type === 'moon' || type === 'surge') return 'BULLISH RUMOR';
      if (type === 'crash' || type === 'massive_crash') return 'BEARISH ALERT';
      if (type === 'sec_raid') return 'REGULATORY RISK';
      return 'MARKET CHATTER';
    },
    codename() {
      const codes = ['WHALE ALERT', 'DARK POOL', 'GAMMA SQUEEZE', 'VIBE SHIFT', 'INSIDER CHATTER', 'ALGO SPIKE', 'MEME SURGE'];
      return codes[Utils.randInt(0, codes.length - 1)];
    },
  };

  const NewsGenerator = {
    pool: [],
    recent: [],
    entities: {
      who: ['CEO', 'CFO', 'CTO', 'COO', 'intern', 'board chair', 'whale', 'analyst', 'Fed watcher', 'podcast host', 'Discord mod', 'NFT bro', 'short seller', 'day trader', 'compliance officer', 'PR team', 'ChatGPT instance', 'reply guy', 'accountant', 'lawyer', 'influencer', 'hedge fund', 'retail army', 'market maker', 'auditor'],
      how: ['accidentally', 'proudly', 'legally', 'allegedly', 'ironically', 'desperately', 'quietly', 'loudly', 'publicly', 'privately', 'mistakenly', 'boldly', 'recklessly', 'casually', 'passionately'],
      action: ['shorts', 'pumps', 'dumps', 'yolo-buys', 'liquidates', 'meme-posts', 'rug-pulls', 'hodls', 'stakeholders', 'diamond-hands', 'naked-calls', 'theta-gangs', 'the float', 'after-hours', 'pre-market'],
      what: ['the stock', 'our ticker', '$CHAOS', 'competitor shares', 'employee 401ks', 'customer refunds', 'the cap table', 'board seats', 'the entire float', 'OTC volume', 'dark pool flow', 'options chain'],
      where: ['during earnings call', 'on live TV', 'in a Twitter Space', 'at Burning Man', 'from a burner phone', 'while sleep-deprived', 'during a product demo', 'in a court filing', 'on a podcast', 'in a group chat', 'after one Reddit comment', 'because AI said so', 'during yoga retreat', 'on a yacht', "from airport Chili's", 'in Congress', 'in a leaked Slack', 'at a hackathon', 'during a blackout', 'on TikTok Live', 'in the metaverse', 'during all-hands', 'on LinkedIn'],
      twist: ['stock rips anyway', 'markets unphased', 'analysts baffled', 'shorts in shambles', 'retail celebrates', 'SEC opens probe', 'non-apology issued', 'emergency board meeting', 'CEO doubles down', 'memes take credit', 'logic inverted', 'volume hits record', 'price does opposite', 'cope posted then deleted', 'lawyers involved', 'thread goes viral'],
    },
    typeCycle: ['crash', 'surge', 'moon', 'massive_crash'],
    mags: { crash: [0.18, 0.38], surge: [0.12, 0.28], moon: [0.22, 0.48], massive_crash: [0.35, 0.55] },

    init() {
      this.pool = [...Config.NEWS_EVENTS];
      this.recent = [];
      const seen = new Set(this.pool.map((e) => e.headline));
      let tries = 0;
      while (this.pool.length < 160 && tries < 600) {
        tries++;
        const ev = this.generate();
        if (!seen.has(ev.headline)) { seen.add(ev.headline); this.pool.push(ev); }
      }
    },

    pick(arr) { return arr[Utils.randInt(0, arr.length - 1)]; },

    generate() {
      const e = this.entities;
      const type = this.typeCycle[Utils.randInt(0, this.typeCycle.length - 1)];
      const templates = [
        () => `${this.pick(e.who)} ${this.pick(e.how)} ${this.pick(e.action)} ${this.pick(e.what)} ${this.pick(e.where)} — ${this.pick(e.twist)}`,
        () => `BREAKING: ${this.pick(e.what)} ${this.pick(e.action)} ${this.pick(e.where)} after ${this.pick(e.who)} ${this.pick(e.how)} speaks — ${this.pick(e.twist)}`,
        () => `Sources say ${this.pick(e.who)} ${this.pick(e.how)} ${this.pick(e.action)} ${this.pick(e.what)}; ${this.pick(e.twist)}`,
        () => `${this.pick(e.who)} tells analysts "${this.pick(e.twist)}" ${this.pick(e.where)} — ${this.pick(e.what)} ${this.pick(e.action)}`,
        () => `Leaked memo: ${this.pick(e.who)} plans to ${this.pick(e.action)} ${this.pick(e.what)} ${this.pick(e.where)} (${this.pick(e.twist)})`,
      ];
      const headline = templates[Utils.randInt(0, templates.length - 1)]();
      return { headline, type, magnitude: [...this.mags[type]] };
    },

    remember(headline) {
      this.recent.unshift(headline);
      if (this.recent.length > Config.HEADLINE_REPEAT_COOLDOWN) this.recent.pop();
    },

    pickEvent(wave) {
      if (wave === 3 || wave === 5) {
        if (Utils.rand(0, 1) < 0.35) {
          const bosses = Config.BOSS_EVENTS.filter((b) => !(wave === 5 && b.headline.includes('Meltdown')));
          return bosses[Utils.randInt(0, bosses.length - 1)] || Config.BOSS_EVENTS[0];
        }
      }
      if (Utils.rand(0, 1) < Config.PROCEDURAL_NEWS_CHANCE) {
        let ev = this.generate();
        let tries = 0;
        while (this.recent.includes(ev.headline) && tries < 20) { ev = this.generate(); tries++; }
        return ev;
      }
      const available = this.pool.filter((e) => !this.recent.includes(e.headline));
      const src = available.length ? available : this.pool;
      return src[Utils.randInt(0, src.length - 1)];
    },
  };

  const Combo = {
    count: 0,
    reset() { this.count = 0; },
    mult() { return 1 + Math.max(0, this.count - 1) * 0.1; },
    onWin() { this.count = Math.min(this.count + 1, Config.COMBO_MAX); },
    onBreak() { this.count = 0; },
  };

  const Storage = {
    load() {
      try {
        const raw = localStorage.getItem(Config.STORAGE_KEY) || localStorage.getItem('isc_meta_v1');
        if (!raw) return Storage.defaultData();
        return { ...Storage.defaultData(), ...JSON.parse(raw) };
      } catch { return Storage.defaultData(); }
    },
    defaultData() {
      return {
        chaosPoints: 0, upgrades: {}, achievements: [],
        settings: { sound: true, reducedMotion: false, particles: true },
        selectedDifficulty: 'normal', dailySeed: false,
        winStreak: 0, bestStreak: 0, retiredMilestones: [],
      };
    },
    save(data) { localStorage.setItem(Config.STORAGE_KEY, JSON.stringify(data)); },
  };

  const AudioEngine = {
    ctx: null, enabled: true,
    init() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} },
    resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); },
    play(type) {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain); gain.connect(this.ctx.destination);
      const p = {
        buy: [880, 'sine', 0.12, 0.08], sell: [440, 'triangle', 0.15, 0.08],
        short: [220, 'sawtooth', 0.18, 0.06], cover: [660, 'square', 0.12, 0.06],
        news: [1200, 'square', 0.08, 0.05], crash: [80, 'sawtooth', 0.4, 0.1],
        moon: [1400, 'sine', 0.3, 0.07], qte_win: [1046, 'sine', 0.2, 0.08],
        qte_lose: [150, 'sawtooth', 0.25, 0.08], bankrupt: [100, 'triangle', 0.6, 0.1],
        achievement: [1568, 'sine', 0.35, 0.09], wave: [523, 'sine', 0.25, 0.07],
        victory: [1760, 'sine', 0.5, 0.09],
      }[type];
      if (!p) return;
      osc.type = p[1]; osc.frequency.setValueAtTime(p[0], t);
      gain.gain.setValueAtTime(p[3], t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + p[2]);
      osc.start(t); osc.stop(t + p[2]);
    },
    setEnabled(v) { this.enabled = v; },
  };

  const Particles = {
    list: [], canvas: null, ctx: null, enabled: true,
    init(canvas) { this.canvas = canvas; this.ctx = canvas?.getContext('2d'); },
    resize(w, h) {
      if (!this.canvas || !this.ctx) return;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    burst(type, w, h) {
      if (!this.enabled) return;
      const up = type === 'moon' || type === 'surge' || type === 'boss_moon';
      for (let i = 0; i < 22; i++) {
        this.list.push({
          x: Utils.rand(w * 0.2, w * 0.95), y: up ? h + 8 : Utils.rand(0, h * 0.4),
          vx: Utils.rand(-2, 2), vy: up ? Utils.rand(-7, -2) : Utils.rand(2, 7),
          life: 1, size: Utils.rand(3, 7),
          emoji: up ? (Math.random() > 0.5 ? '🚀' : '✨') : (Math.random() > 0.5 ? '💀' : '📉'),
        });
      }
    },
    update(dt) {
      this.list.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= dt / 1800; });
      this.list = this.list.filter((p) => p.life > 0);
    },
    draw() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.ctx.clearRect(0, 0, w, h);
      this.list.forEach((p) => {
        this.ctx.globalAlpha = Math.max(0, p.life);
        this.ctx.font = `${p.size * 3}px serif`;
        this.ctx.fillText(p.emoji, p.x, p.y);
      });
      this.ctx.globalAlpha = 1;
    },
  };

  const Chart = {
    canvas: null, ctx: null, container: null, points: [], recentTrend: 0,
    reducedMotion: false, ok: false, resizeObserver: null, pulseTimer: null,

    init(canvas, container) {
      this.canvas = canvas;
      this.container = container;
      try {
        this.ctx = canvas.getContext('2d');
        this.ok = !!this.ctx;
      } catch { this.ok = false; }
      if (!this.ok) {
        document.getElementById('chart-error')?.classList.remove('hidden');
        return;
      }
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.container.clientWidth > 0) this.resize();
        });
        this.resizeObserver.observe(container);
      }
    },

    resize() {
      if (!this.ok || !this.container) return false;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w < 2 || h < 2) return false;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      Particles.resize(w, h);
      return true;
    },

    seedPoints(price) {
      if (!this.resize()) return;
      const w = this.container.clientWidth;
      this.points = [];
      for (let x = 0; x <= w; x += Config.POINT_SPACING) {
        this.points.push({ x, price: price + (Math.random() - 0.5) * 2 });
      }
    },

    updatePoint(price) {
      if (!this.ok) return;
      const w = this.container.clientWidth;
      if (w < 2) return;
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
      const pad = height * 0.1;
      const range = maxP - minP || 1;
      return height - pad - ((p - minP) / range) * (height - pad * 2);
    },

    draw(price) {
      if (!this.ok || !this.ctx) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w < 2 || h < 2) return;
      this.ctx.clearRect(0, 0, w, h);

      if (this.points.length < 2) {
        this.ctx.fillStyle = 'rgba(107,114,128,0.5)';
        this.ctx.font = '12px Roboto Mono, monospace';
        this.ctx.fillText('Loading chart...', w / 2 - 50, h / 2);
        return;
      }

      const prices = this.points.map((p) => p.price);
      let minP = Math.min(...prices), maxP = Math.max(...prices);
      const margin = (maxP - minP) * 0.12 || price * 0.05;
      minP -= margin; maxP += margin;

      const isUp = this.recentTrend >= 0;
      const lineColor = isUp ? '#34d399' : '#f87171';
      const glow = isUp ? 'rgba(52,211,153,0.8)' : 'rgba(248,113,113,0.8)';
      const blur = this.reducedMotion ? 0 : 12;

      this.ctx.fillStyle = 'rgba(107,114,128,0.35)';
      this.ctx.font = '9px Roboto Mono, monospace';
      for (let i = 0; i <= 4; i++) {
        const y = (h / 4) * i;
        const label = Utils.formatMoney(maxP - ((maxP - minP) / 4) * i);
        this.ctx.fillText(label, 4, y + 10);
        this.ctx.strokeStyle = 'rgba(55,65,81,0.25)';
        this.ctx.beginPath(); this.ctx.moveTo(42, y); this.ctx.lineTo(w, y); this.ctx.stroke();
      }

      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, isUp ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.beginPath();
      this.points.forEach((pt, i) => {
        const y = this.priceToY(pt.price, minP, maxP, h);
        if (i === 0) this.ctx.moveTo(pt.x, y); else this.ctx.lineTo(pt.x, y);
      });
      const lastPt = this.points[this.points.length - 1];
      this.ctx.lineTo(lastPt.x, h); this.ctx.lineTo(this.points[0].x, h);
      this.ctx.closePath(); this.ctx.fillStyle = grad; this.ctx.fill();

      this.ctx.beginPath();
      this.points.forEach((pt, i) => {
        const y = this.priceToY(pt.price, minP, maxP, h);
        if (i === 0) this.ctx.moveTo(pt.x, y); else this.ctx.lineTo(pt.x, y);
      });
      this.ctx.strokeStyle = lineColor; this.ctx.lineWidth = 2.5;
      this.ctx.lineJoin = 'round'; this.ctx.shadowColor = glow; this.ctx.shadowBlur = blur;
      this.ctx.stroke(); this.ctx.shadowBlur = 0;

      const lastY = this.priceToY(lastPt.price, minP, maxP, h);
      this.ctx.setLineDash([4, 4]);
      this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      this.ctx.beginPath(); this.ctx.moveTo(42, lastY); this.ctx.lineTo(w, lastY); this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.beginPath(); this.ctx.arc(lastPt.x, lastY, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = lineColor;
      if (!this.reducedMotion) { this.ctx.shadowColor = glow; this.ctx.shadowBlur = 16; }
      this.ctx.fill(); this.ctx.shadowBlur = 0;
    },

    pulse() {
      if (this.reducedMotion || !this.container) return;
      this.container.classList.add('chart-pulse');
      clearTimeout(this.pulseTimer);
      this.pulseTimer = setTimeout(() => this.container.classList.remove('chart-pulse'), 500);
    },

    shake() {
      if (this.reducedMotion || this.container?.classList.contains('shake')) return;
      this.container.classList.add('shake');
      setTimeout(() => this.container?.classList.remove('shake'), 400);
    },
  };

  const Sparkline = {
    canvas: null, ctx: null, history: [], maxPoints: 200, startValue: 1000,
    init(canvas) { this.canvas = canvas; this.ctx = canvas?.getContext('2d'); },
    resize() {
      if (!this.canvas || !this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr; this.canvas.height = rect.height * dpr;
      this.canvas.style.width = rect.width + 'px'; this.canvas.style.height = rect.height + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    push(v) { this.history.push(v); if (this.history.length > this.maxPoints) this.history.shift(); },
    reset(v) { this.history = [v]; this.startValue = v; },
    getTrend() {
      if (this.history.length < 4) return 0;
      return this.history[this.history.length - 1] - this.history[this.history.length - 4];
    },
    draw() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.ctx.clearRect(0, 0, w, h);
      if (this.history.length < 2) return;
      const min = Math.min(...this.history) * 0.98;
      const max = Math.max(...this.history) * 1.02;
      const range = max - min || 1;
      const cur = this.history[this.history.length - 1];
      const color = cur >= this.startValue ? '#34d399' : '#f87171';
      this.ctx.beginPath();
      this.history.forEach((v, i) => {
        const x = (i / (this.maxPoints - 1)) * w;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        if (i === 0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y);
      });
      this.ctx.strokeStyle = color; this.ctx.lineWidth = 1.5; this.ctx.stroke();
    },
  };

  const Market = {
    price: Config.START_PRICE, activeNews: null, difficulty: 'normal',
    firstCrashHappened: false, newsShield: false,
    waveAnchorPrice: Config.START_PRICE, regime: 'chop', regimeEnd: 0,
    regimes: {
      bull: { label: 'RISK-ON', drift: 0.06, volMult: 0.85 },
      bear: { label: 'RISK-OFF', drift: -0.07, volMult: 1.0 },
      chop: { label: 'CHOPPY', drift: 0, volMult: 1.15 },
      mania: { label: 'UNHINGED', drift: 0, volMult: 1.8 },
    },
    reset() {
      this.price = Config.START_PRICE;
      this.activeNews = null;
      this.firstCrashHappened = false;
      this.newsShield = false;
      this.waveAnchorPrice = Config.START_PRICE;
      this.pickRegime();
    },
    setWaveAnchor() { this.waveAnchorPrice = this.price; },
    pickRegime() {
      const keys = Object.keys(this.regimes);
      this.regime = keys[Utils.randInt(0, keys.length - 1)];
      this.regimeEnd = performance.now() + Utils.rand(Config.REGIME_DURATION_MIN, Config.REGIME_DURATION_MAX);
    },
    updateRegime() {
      if (performance.now() >= this.regimeEnd) this.pickRegime();
    },
    getRegime() { return this.regimes[this.regime] || this.regimes.chop; },
    getDiffConfig() { return Config.DIFFICULTIES[this.difficulty] || Config.DIFFICULTIES.normal; },
    applyRandomWalk(dt) {
      this.updateRegime();
      const r = this.getRegime();
      const jitter = Utils.rand(-1, 1);
      const drift = (r.drift || 0) * (dt / 1000) / 100;
      const vol = Config.BASE_VOLATILITY * (r.volMult || 1) * (dt / 1000) / 100;
      this.price *= 1 + drift + jitter * vol;
      const anchor = this.waveAnchorPrice || Config.START_PRICE;
      const deviation = (this.price - anchor) / anchor;
      if (Math.abs(deviation) > 0.22) {
        this.price *= 1 - deviation * Config.MEAN_REVERSION_STRENGTH * dt;
      }
    },
    applyNewsEffect(dt, upgrades) {
      if (!this.activeNews) return false;
      const elapsed = performance.now() - this.activeNews.startTime;
      if (elapsed >= this.activeNews.duration) { this.activeNews = null; return false; }
      if (this.newsShield) return false;
      const type = this.activeNews.effectiveType || this.activeNews.type;
      let direction = Utils.isBullish(type) ? 1 : Utils.isBearish(type) ? -1 : 0;
      const intensity = type === 'massive_crash' ? 2.0 : type === 'moon' ? 1.6 : 1;
      let mag = this.activeNews.magnitude;
      if (Utils.isBearish(type)) {
        mag = Math.min(mag, Config.MAX_CRASH_MAGNITUDE);
        if (upgrades.crash_padding) mag *= 0.85;
        if (upgrades.rug_pull_insurance && !Market.firstCrashHappened) {
          mag = Math.min(mag, 0.2);
          Market.firstCrashHappened = true;
        } else if (Utils.isBearish(type)) {
          Market.firstCrashHappened = true;
        }
      }
      const fade = 1 - (elapsed / this.activeNews.duration) * 0.3;
      const rate = (mag * intensity) / (this.activeNews.duration / 1000);
      this.price *= 1 + direction * rate * (dt / 1000) * fade;
      return Utils.isBearish(type);
    },
    clamp() { if (this.price < Config.MIN_PRICE) this.price = Config.MIN_PRICE; },
    update(dt, upgrades) {
      this.applyRandomWalk(dt);
      const crashing = this.applyNewsEffect(dt, upgrades);
      this.clamp();
      return crashing;
    },
  };

  const Portfolio = {
    cash: 1000, shares: 0, shortShares: 0, shortAvgPrice: 0, startCash: 1000,
    reset(sc) { this.cash = sc; this.shares = 0; this.shortShares = 0; this.shortAvgPrice = 0; this.startCash = sc; },
    value() { return this.cash + this.shares * Market.price - this.shortShares * Market.price; },
    shortPnL() { return this.shortShares > 0 ? (this.shortAvgPrice - Market.price) * this.shortShares : 0; },
    shortLoss() { const pnl = this.shortPnL(); return pnl < 0 ? -pnl : 0; },
    maxShortShares(hasDarkPool) {
      const pv = Math.max(this.value(), 0);
      const pct = hasDarkPool ? 0.75 : 0.5;
      return Math.max(0, (pv * pct) / Market.price);
    },
  };

  const Achievements = {
    unlocked: new Set(), toastTimer: null,
    load(ids) { this.unlocked = new Set(ids); },
    unlock(id, meta) {
      if (this.unlocked.has(id)) return;
      this.unlocked.add(id);
      meta.achievements = [...this.unlocked];
      Storage.save(meta);
      const a = Config.ACHIEVEMENTS.find((x) => x.id === id);
      if (a) { AudioEngine.play('achievement'); UI.showAchievementToast(a.name, a.desc); }
    },
    checkCollector(meta) {
      if (Config.UPGRADES.every((u) => meta.upgrades[u.id])) this.unlock('upgrade_collector', meta);
    },
  };

  const Meta = {
    data: Storage.load(),
    has(id) { return !!this.data.upgrades[id]; },
    getStartCash() { return Config.START_CASH + (this.has('thick_skin') ? 500 : 0); },
    getQteDuration() { return this.has('spidey_sense') ? 3000 : Config.QTE_DURATION; },
    buyUpgrade(id) {
      const u = Config.UPGRADES.find((x) => x.id === id);
      if (!u || this.data.upgrades[id] || this.data.chaosPoints < u.cost) return false;
      this.data.chaosPoints -= u.cost;
      this.data.upgrades[id] = true;
      Storage.save(this.data);
      Achievements.checkCollector(this.data);
      return true;
    },
    awardPoints(n) {
      let pts = n;
      if (this.has('chaos_magnet')) pts = Math.floor(pts * 1.25);
      this.data.chaosPoints += pts;
      Storage.save(this.data);
      return pts;
    },
    calcRunPoints(rs, cashOut) {
      let pts = Math.floor(rs.peakPortfolio / 100) + rs.tradesMade * 2 + rs.newsSurvived * 3;
      pts += rs.qteWins * 5 + rs.goalsCompleted * 20 + rs.wavesCleared * 15;
      if (rs.peakPortfolio >= rs.startCash * 2) pts += 25;
      if (cashOut) pts += 25;
      if (rs.bankrupt) pts = Math.floor(pts * 0.4);
      const streakMult = 1 + Math.min(Meta.data.winStreak, 5) * 0.1;
      pts = Math.floor(pts * streakMult);
      if (cashOut && Meta.has('exit_liquidity')) pts = Math.floor(pts * 1.15);
      return Math.max(10, Math.min(pts, 250));
    },
  };

  const RunStats = {
    startTime: 0, peakPortfolio: 0, tradesMade: 0, newsSurvived: 0, qteWins: 0,
    crashesHeldThrough: 0, fullSizeTrades: 0, wasUnder10Pct: false, startCash: 1000,
    bankrupt: false, wavesCleared: 0, goalsCompleted: 0, goalsTotal: 0,
    shopPurchases: 0, bossSurvived: false, secSurvived: false, dailyRun: false,
    waveReachedBeforeDeath: 0, flawless: true, cashOutProfit: 0,
    reset(sc) {
      Object.assign(this, {
        startTime: performance.now(), peakPortfolio: sc, tradesMade: 0, newsSurvived: 0,
        qteWins: 0, crashesHeldThrough: 0, fullSizeTrades: 0, wasUnder10Pct: false,
        startCash: sc, bankrupt: false, wavesCleared: 0, goalsCompleted: 0, goalsTotal: 0,
        shopPurchases: 0, bossSurvived: false, secSurvived: false, dailyRun: false,
        waveReachedBeforeDeath: 0, flawless: true, cashOutProfit: 0,
      });
    },
    updatePeak() {
      const pv = Portfolio.value();
      if (pv > this.peakPortfolio) this.peakPortfolio = pv;
      if (pv < this.startCash * 0.1) this.wasUnder10Pct = true;
    },
  };

  const WaveState = {
    current: 1, duration: 75000, startTime: 0, goal: null, goalMet: false,
    waveStartPortfolio: 0, wavePeak: 0, waveTrades: 0, waveQTEWins: 0, waveShortProfit: false,
    soldDuringMoon: false, qteBoost: false, intermission: false,
    retiredMilestones: new Set(),
    resetWaveStats() {
      this.waveStartPortfolio = Portfolio.value();
      this.wavePeak = Portfolio.value();
      this.waveTrades = 0; this.waveQTEWins = 0;
      this.waveShortProfit = false; this.soldDuringMoon = false; this.goalMet = false;
    },
    trackPeak() {
      const pv = Portfolio.value();
      if (pv > this.wavePeak) this.wavePeak = pv;
    },
    calcWaveRank(goalMet) {
      const pv = Portfolio.value();
      const peak = this.wavePeak || pv;
      const drawdown = peak > 0 ? 1 - pv / peak : 0;
      if (goalMet && drawdown < 0.08) return 'S';
      if (goalMet) return 'A';
      if (!goalMet && pv >= this.waveStartPortfolio * 0.85) return 'B';
      if (!goalMet && pv >= this.waveStartPortfolio * 0.6) return 'C';
      return 'D';
    },
    pickGoal() {
      this.goal = this.buildGoalPreview(this.waveStartPortfolio);
      return this.goal;
    },
    buildGoalPreview(startPv) {
      const id = Config.WAVE_GOAL_IDS[Utils.randInt(0, Config.WAVE_GOAL_IDS.length - 1)];
      const floor = startPv * 0.7;
      const labels = {
        survive_floor: `Stay above ${Utils.formatMoney(floor)} (70% of start)`,
        shares_min: 'Hold 5+ shares at wave end',
        short_profit: 'Profit from a short this wave',
        qte_wins: 'Win 2 QTEs this wave',
        no_sell_moon: "Don't sell during a moon event",
        profit_wave: 'End wave richer than you started',
      };
      return { id, label: labels[id], floor };
    },
    checkGoal() {
      if (!this.goal) return false;
      const id = this.goal.id;
      if (id === 'survive_floor') return Portfolio.value() >= (this.goal.floor || Portfolio.startCash * 0.7);
      if (id === 'shares_min') return Portfolio.shares >= 5;
      if (id === 'short_profit') return this.waveShortProfit;
      if (id === 'qte_wins') return this.waveQTEWins >= 2;
      if (id === 'no_sell_moon') return !this.soldDuringMoon;
      if (id === 'profit_wave') return Portfolio.value() > this.waveStartPortfolio;
      return false;
    },
    getDuration() {
      return Config.WAVE_DURATION_BASE - (this.current - 1) * Config.WAVE_DURATION_STEP;
    },
  };

  const News = {
    timer: null, pendingFake: null, nextEvent: null, previewTimer: null,
    schedule(game) {
      clearTimeout(this.timer);
      if (game.paused || game.gameOver || WaveState.intermission) return;
      const diff = Market.getDiffConfig();
      let delay = Utils.rand(diff.newsMin, diff.newsMax);
      if (Meta.has('coffee_iv')) delay *= 1.1;
      this.timer = setTimeout(() => this.trigger(game), delay);
    },
    pickEvent(wave) { return NewsGenerator.pickEvent(wave); },
    setNextPreview() {
      const ev = this.pickEvent(WaveState.current);
      this.nextEvent = ev;
      if (ev.boss) {
        UI.showNextNewsHint('⚠️ BOSS SIGNAL — brace for impact');
      } else if (Meta.has('vpn_wallst')) {
        UI.showNextNewsHint(`$CHAO: ${Utils.codename()} · ${Utils.categoryLabel(ev.type)}`);
      }
    },
    trigger(game) {
      if (game.paused || game.gameOver || WaveState.intermission) return;
      const event = this.nextEvent || this.pickEvent(WaveState.current);
      this.nextEvent = null;
      UI.hideNextNewsHint();
      NewsGenerator.remember(event.headline);
      const diff = Market.getDiffConfig();
      let magnitude = Utils.rand(event.magnitude[0], event.magnitude[1]) * diff.magnitudeMult;
      magnitude *= 1 + (WaveState.current - 1) * 0.05;
      const duration = event.boss ? Utils.rand(3000, 5000) : Utils.rand(2000, 4000);
      let credibility = 'high', isFake = false;
      const roll = Utils.rand(0, 1);
      if (roll < diff.fakeChance) { isFake = true; credibility = 'fake'; }
      else if (roll < diff.fakeChance + 0.2) credibility = 'medium';

      if (event.type === 'sec_raid') {
        SECRaid.start(game);
        this.schedule(game);
        return;
      }

      if (Market.newsShield) {
        Market.newsShield = false;
        UI.setNews(`🛡️ ${event.headline} (BLOCKED)`, credibility, event.type, isFake);
        AudioEngine.play('news');
        if (!event.boss) QTE.start(game, event.type, isFake, false);
        this.setNextPreview();
        this.schedule(game);
        return;
      }

      const newsItem = {
        ...event, magnitude, duration, startTime: performance.now(),
        credibility, isFake,
        effectiveType: isFake ? Utils.invertType(event.type) : event.type,
        startPortfolio: Portfolio.value(),
      };
      Market.activeNews = newsItem;
      RunStats.newsSurvived++;
      if (event.boss) QTE.start(game, event.type, isFake, true);

      UI.setNews(event.headline, credibility, event.type, isFake);
      AudioEngine.play('news');
      Chart.pulse();

      if (Utils.isBearish(event.type)) {
        Chart.shake(); AudioEngine.play('crash');
        Particles.burst('crash', Chart.container.clientWidth, Chart.container.clientHeight);
      } else if (Utils.isBullish(event.type)) {
        AudioEngine.play('moon');
        Particles.burst(event.boss ? 'boss_moon' : 'moon', Chart.container.clientWidth, Chart.container.clientHeight);
      }

      if (Utils.isBearish(event.type) && Portfolio.shares > 0) {
        RunStats.crashesHeldThrough++;
        if (RunStats.crashesHeldThrough >= 3) Achievements.unlock('diamond_hands', Meta.data);
      }
      if (event.boss) RunStats.bossSurvived = true;

      if (isFake) {
        if (Meta.has('tinfoil_hat')) UI.showSuspiciousStamp();
        const delay = Meta.has('insider_friend') ? Utils.rand(800, 1500) : 1000;
        clearTimeout(this.pendingFake);
        this.pendingFake = setTimeout(() => {
          const wrongCall = Meta.has('insider_friend') && Utils.rand(0, 1) < 0.5;
          if (!wrongCall) {
            UI.revealFakeNews();
            if (Portfolio.value() > newsItem.startPortfolio) Achievements.unlock('fake_out', Meta.data);
          } else {
            UI.showFakeWrongCall();
          }
        }, delay);
      }

      if (!event.boss) QTE.start(game, event.type, isFake, false);
      this.setNextPreview();
      this.schedule(game);
    },
    clear() {
      clearTimeout(this.timer); clearTimeout(this.pendingFake); clearTimeout(this.previewTimer);
      Market.activeNews = null;
    },
  };

  const SECRaid = {
    active: false, timer: null, countdown: 5, game: null,
    start(game) {
      this.game = game; this.active = true; this.countdown = 5;
      game.tradingFrozen = true;
      UI.show('sec-overlay');
      UI.showTradingFrozen(true);
      UI.updateTradeButtons();
      UI.setNews('SEC RAID — Trading frozen for 5 seconds!', 'high', 'sec_raid', false);
      AudioEngine.play('crash');
      this.tick();
    },
    tick() {
      if (!this.active) return;
      UI.setSecCountdown(this.countdown);
      if (this.countdown <= 0) {
        // Auto-resolve: 50% chance of fine
        const fine = Utils.rand(0, 1) < 0.5;
        this.resolve(!fine);
        return;
      }
      this.countdown--;
      this.timer = setTimeout(() => this.tick(), 1000);
    },
    resolve(survived) {
      if (!this.active) return;
      if (survived) {
        RunStats.secSurvived = true;
        Achievements.unlock('sec_survivor', Meta.data);
        this.end(true);
      } else {
        let fine = Portfolio.value() * 0.05;
        if (Meta.has('lawyer')) fine *= 0.5;
        Portfolio.cash = Math.max(0, Portfolio.cash - fine);
        UI.spawnFloatText(document.getElementById('news-banner'), `-${Utils.formatMoney(fine)} SEC FINE`, false);
        this.end(false);
      }
    },
    end() {
      this.active = false;
      clearTimeout(this.timer);
      if (this.game) {
        this.game.tradingFrozen = false;
        UI.updateTradeButtons();
      }
      UI.hide('sec-overlay');
      UI.showTradingFrozen(false);
    },
  };

  // QTE is now a reaction window — no overlay popup.
  // When news fires, a slim bar appears above trade buttons with a draining timer.
  // The player earns bonuses by making a SMART trade during the window:
  //   bullish (moon/surge)  → buy or cover = smart
  //   bearish (crash)       → sell or short = smart
  //   any trade             → counts, wrong trade = penalty
  //   no trade before timer → timeout penalty + combo break
  const QTE = {
    active: false, resolved: false,
    animFrame: null, game: null,
    isBoss: false, isFake: false,
    newsType: null, effectiveType: null,
    startTime: 0, duration: 2000,

    getEffectiveType(newsType, isFake) {
      return isFake ? Utils.invertType(newsType) : newsType;
    },

    isSmartTrade(tradeType) {
      // smart = correct directional call based on real price movement
      const bullish = Utils.isBullish(this.effectiveType);
      if (bullish) return tradeType === 'buy' || tradeType === 'cover';
      return tradeType === 'sell' || tradeType === 'short';
    },

    getLabel() {
      const bullish = Utils.isBullish(this.effectiveType);
      const fakeHint = this.isFake ? ' · ?FAKE' : '';
      if (this.isBoss) return `👹 BOSS${fakeHint} — ${bullish ? '🚀 MOON' : '💀 CRASH'} — TRADE NOW`;
      return bullish ? `🚀 MOON${fakeHint} — position now!` : `⚡ CRASH${fakeHint} — react fast!`;
    },

    getBarClass() {
      if (this.isBoss) return 'react-boss';
      return Utils.isBullish(this.effectiveType) ? 'react-bullish' : 'react-bearish';
    },

    getGridClass() {
      if (this.isBoss) return 'reacting-boss';
      return Utils.isBullish(this.effectiveType) ? 'reacting-bullish' : 'reacting-bearish';
    },

    start(game, newsType, isFake, isBoss) {
      if (this.active) this.cancel();
      this.game = game;
      this.active = true;
      this.resolved = false;
      this.newsType = newsType;
      this.isFake = !!isFake;
      this.isBoss = !!isBoss;
      this.effectiveType = this.getEffectiveType(newsType, isFake);
      this.duration = isBoss ? 1500 : Meta.getQteDuration();
      this.startTime = performance.now();
      UI.showReactionBar(this.getLabel(), this.getBarClass(), this.getGridClass());
      this.tick();
    },

    tick() {
      if (!this.active || this.resolved) return;
      const elapsed = performance.now() - this.startTime;
      const ratio = Math.max(0, 1 - elapsed / this.duration);
      UI.updateReactionTimer(ratio);
      if (elapsed >= this.duration) {
        this.resolveTimeout();
        return;
      }
      this.animFrame = requestAnimationFrame(() => this.tick());
    },

    // Called by Trading methods after every trade
    onTrade(tradeType) {
      if (!this.active || this.resolved) return;
      const smart = this.isSmartTrade(tradeType);
      this.resolve(smart);
    },

    resolve(smart) {
      if (this.resolved) return;
      this.resolved = true;
      this.active = false;
      cancelAnimationFrame(this.animFrame);

      const mult = (WaveState.qteBoost ? 2 : 1) * (this.isBoss ? 1.5 : 1) * Combo.mult();

      if (smart) {
        Combo.onWin();
        RunStats.qteWins++;
        WaveState.waveQTEWins++;
        const bonus = Math.min(Portfolio.value() * 0.02, Math.max(30, Portfolio.cash * 0.03)) * mult;
        Portfolio.cash += bonus;
        AudioEngine.play('qte_win');
        UI.showReactionFeedback(`✓ +${Utils.formatMoney(bonus)}`, 'win');
        if (RunStats.qteWins >= 5) Achievements.unlock('quick_fingers', Meta.data);
      } else {
        Combo.onBreak();
        const penalty = Math.min(Portfolio.cash, Portfolio.value() * 0.015);
        Portfolio.cash = Math.max(0, Portfolio.cash - penalty);
        AudioEngine.play('qte_lose');
        UI.showReactionFeedback(`✗ -${Utils.formatMoney(penalty)}`, 'lose');
      }
      UI.updateCombo();
      UI.updatePortfolio();
      setTimeout(() => UI.hideReactionBar(), 800);
    },

    resolveTimeout() {
      if (this.resolved) return;
      this.resolved = true;
      this.active = false;
      cancelAnimationFrame(this.animFrame);
      Combo.onBreak();
      const penalty = Math.min(Portfolio.cash, Portfolio.value() * 0.015);
      Portfolio.cash = Math.max(0, Portfolio.cash - penalty);
      AudioEngine.play('qte_lose');
      UI.showReactionFeedback(`TOO SLOW -${Utils.formatMoney(penalty)}`, 'late');
      UI.updateCombo();
      UI.updatePortfolio();
      setTimeout(() => UI.hideReactionBar(), 600);
    },

    cancel() {
      this.active = false;
      this.resolved = true;
      cancelAnimationFrame(this.animFrame);
      UI.hideReactionBar();
    },
  };

  const Trading = {
    tradeSizeIndex: 3, tradeLog: [], lastTrade: null, undoUsed: false,
    getSizes() {
      const s = [...Config.TRADE_SIZES];
      if (Meta.has('yolo_gene')) s.push(Config.TRADE_SIZE_YOLO);
      return s;
    },
    getTradeFraction() {
      let frac = this.getSizes()[this.tradeSizeIndex] || 1;
      if (frac > Config.TRADE_SIZE_YOLO) frac = Config.TRADE_SIZE_YOLO;
      if (frac > 1 && !Meta.has('yolo_gene')) frac = 1;
      return frac;
    },
    getBuySpend() {
      const frac = this.getTradeFraction();
      if (frac <= 1) return Portfolio.cash * frac;
      return Portfolio.cash * Math.min(frac, Config.TRADE_SIZE_YOLO);
    },
    afterTrade(type) {
      QTE.onTrade(type);
      UI.updatePortfolio();
      UI.updateTradeButtons();
    },
    log(type, detail, pnl) {
      this.tradeLog.unshift({ type, detail, pnl, time: Utils.formatTime() });
      if (this.tradeLog.length > 50) this.tradeLog.pop();
      UI.renderTradeLog(this.tradeLog);
    },
    snapshot() {
      return {
        cash: Portfolio.cash, shares: Portfolio.shares,
        shortShares: Portfolio.shortShares, shortAvgPrice: Portfolio.shortAvgPrice,
      };
    },
    restore(snap) {
      Portfolio.cash = snap.cash; Portfolio.shares = snap.shares;
      Portfolio.shortShares = snap.shortShares; Portfolio.shortAvgPrice = snap.shortAvgPrice;
    },
    buy() {
      const spend = this.getBuySpend();
      if (spend <= 0) return;
      const frac = this.getTradeFraction();
      const snap = this.snapshot();
      const bought = spend / Market.price;
      Portfolio.cash -= spend;
      Portfolio.shares += bought;
      this.lastTrade = { type: 'buy', snap };
      RunStats.tradesMade++; WaveState.waveTrades++;
      if (frac >= 1) RunStats.fullSizeTrades++;
      if (frac >= 1.2) Achievements.unlock('margin_monster', Meta.data);
      AudioEngine.play('buy'); UI.animateButton('buy-btn');
      UI.spawnFloatText(document.getElementById('buy-btn').parentElement, `+${Utils.formatShares(bought)}`, true);
      this.log('buy', `BUY ${Utils.formatShares(bought)} @ ${Utils.formatMoney(Market.price)}`);
      Achievements.unlock('first_trade', Meta.data);
      if (RunStats.fullSizeTrades >= 5) Achievements.unlock('all_in', Meta.data);
      if (spend >= 5000) Achievements.unlock('whale', Meta.data);
      if (Portfolio.shares > 0 && Portfolio.shortShares > 0) Achievements.unlock('hedge_lord', Meta.data);
      this.afterTrade('buy');
    },
    sell() {
      const frac = this.getTradeFraction();
      const qty = Portfolio.shares * Math.min(frac, 1);
      if (qty <= 0) return;
      const snap = this.snapshot();
      const proceeds = qty * Market.price;
      Portfolio.shares -= qty; Portfolio.cash += proceeds;
      this.lastTrade = { type: 'sell', snap };
      RunStats.tradesMade++; WaveState.waveTrades++;
      if (frac >= 1) RunStats.fullSizeTrades++;
      if (Market.activeNews && Utils.isBullish(Market.activeNews.type)) {
        WaveState.soldDuringMoon = true;
        Achievements.unlock('paper_hands', Meta.data);
      }
      AudioEngine.play('sell'); UI.animateButton('sell-btn');
      UI.spawnFloatText(document.getElementById('sell-btn').parentElement, Utils.formatMoney(proceeds), true);
      this.log('sell', `SELL ${Utils.formatShares(qty)} @ ${Utils.formatMoney(Market.price)}`, proceeds);
      this.afterTrade('sell');
    },
    short() {
      const frac = this.getTradeFraction();
      const max = Portfolio.maxShortShares(Meta.has('dark_pool'));
      const qty = max * Math.min(frac, 1);
      if (qty <= 0) return;
      const snap = this.snapshot();
      const proceeds = qty * Market.price;
      const total = Portfolio.shortShares + qty;
      Portfolio.shortAvgPrice = Portfolio.shortShares > 0
        ? (Portfolio.shortAvgPrice * Portfolio.shortShares + Market.price * qty) / total : Market.price;
      Portfolio.shortShares = total; Portfolio.cash += proceeds;
      this.lastTrade = { type: 'short', snap };
      RunStats.tradesMade++; WaveState.waveTrades++;
      AudioEngine.play('short'); UI.animateButton('short-btn');
      this.log('short', `SHORT ${Utils.formatShares(qty)} @ ${Utils.formatMoney(Market.price)}`);
      Achievements.unlock('first_trade', Meta.data);
      this.afterTrade('short');
    },
    cover() {
      const frac = this.getTradeFraction();
      const qty = Portfolio.shortShares * Math.min(frac, 1);
      if (qty <= 0) return;
      const snap = this.snapshot();
      const pnl = (Portfolio.shortAvgPrice - Market.price) * qty;
      Portfolio.cash -= qty * Market.price;
      Portfolio.shortShares -= qty;
      if (Portfolio.shortShares <= 0) { Portfolio.shortShares = 0; Portfolio.shortAvgPrice = 0; }
      this.lastTrade = { type: 'cover', snap };
      RunStats.tradesMade++; WaveState.waveTrades++;
      if (pnl > 0) { WaveState.waveShortProfit = true; Achievements.unlock('short_king', Meta.data); }
      AudioEngine.play('cover'); UI.animateButton('cover-btn');
      this.log('cover', `COVER ${Utils.formatShares(qty)} @ ${Utils.formatMoney(Market.price)}`, pnl);
      this.afterTrade('cover');
    },
    undo() {
      if (!Meta.has('ghost_portfolio') || this.undoUsed || !this.lastTrade) return;
      this.restore(this.lastTrade.snap);
      this.undoUsed = true;
      UI.hideUndo();
      UI.spawnFloatText(document.getElementById('portfolio-value').parentElement, 'TRADE UNDONE', true);
      this.afterTrade();
    },
    reset() {
      this.tradeLog = []; this.lastTrade = null; this.undoUsed = false;
      this.tradeSizeIndex = Math.min(this.tradeSizeIndex, this.getSizes().length - 1);
      UI.renderTradeLog([]); UI.updateTradeChips();
    },
  };

  const UI = {
    els: {},
    cache() {
      [
        'game-ui','main-menu','pause-overlay','score-overlay','qte-overlay','intermission-overlay',
        'retire-overlay','margin-overlay','sec-overlay','upgrades-overlay','achievements-overlay',
        'achievement-toast','portfolio-value','liquid-cash','total-shares','short-shares','short-pnl',
        'stock-price','news-text','news-banner','credibility-badge','fake-news-stamp','trend-badge',
        'trade-size-slider','trade-size-label','trade-size-chips','trade-log','trade-log-count',
        'trade-log-overlay','log-btn','close-log-btn','difficulty-badge',
        'chaos-points-badge','menu-chaos-points','menu-streak','menu-best-streak','upgrade-chaos-points',
        'mute-btn','score-title','score-subtitle','score-peak',
        'score-trades','score-news','score-qte','score-chaos-earned','score-waves','score-goals',
        'score-streak-bonus','upgrades-list','achievements-list','achievement-toast-title',
        'achievement-toast-desc','setting-sound','setting-reduced-motion','setting-particles',
        'wave-badge','wave-timer-bar','wave-timer-text','wave-goal-text',
        'inter-wave-num','inter-goal-result','inter-portfolio','inter-peak','inter-trades',
        'inter-goals','inter-next-goal','wave-shop-items','next-news-hint','spark-trend',
        'vibe-arrow','trading-frozen','undo-btn','owned-upgrades-preview','daily-seed-toggle',
        'upgrades-owned-count','upgrades-total-count','achievements-unlocked-count',
        'achievements-total-count','sec-countdown','margin-timer-bar','retire-milestone-text',
        'retire-bonus','trade-status-hint','debug-overlay',
        'regime-badge','combo-badge','session-pnl','inter-wave-rank',
        'reaction-bar','reaction-label','reaction-timer-fill','reaction-feedback',
      ].forEach((id) => { this.els[id] = document.getElementById(id); });
    },
    show(id) { this.els[id]?.classList.remove('hidden'); },
    hide(id) { this.els[id]?.classList.add('hidden'); },
    updatePortfolio() {
      const pv = Portfolio.value();
      this.els['portfolio-value'].textContent = Utils.formatMoney(pv);
      this.els['liquid-cash'].textContent = Utils.formatMoney(Portfolio.cash);
      this.els['total-shares'].textContent = Utils.formatShares(Portfolio.shares);
      this.els['short-shares'].textContent = Utils.formatShares(Portfolio.shortShares);
      this.els['stock-price'].textContent = Utils.formatMoney(Market.price);
      const sp = Portfolio.shortPnL();
      this.els['short-pnl'].textContent = Portfolio.shortShares > 0 ? Utils.formatMoney(sp) : '';
      this.els['short-pnl'].className = `stat-sub ${sp >= 0 ? 'text-emerald-400' : 'text-red-400'}`;
      const profit = pv >= Portfolio.startCash;
      const hero = this.els['portfolio-value'].closest('.portfolio-hero-compact');
      hero?.classList.toggle('glass-profit', profit);
      hero?.classList.toggle('glass-loss', !profit);
      this.els['portfolio-value'].classList.toggle('neon-green', profit);
      this.els['portfolio-value'].classList.toggle('neon-red', !profit);
      const up = Chart.recentTrend >= 0;
      const badge = this.els['trend-badge'];
      badge.textContent = up ? '▲ BULL' : '▼ BEAR';
      badge.className = `chart-trend-badge ${up ? 'text-emerald-400 border-emerald-700/50' : 'text-red-400 border-red-700/50'}`;
      const sizes = Trading.getSizes().map((s) => `${Math.round(s * 100)}%`);
      this.els['trade-size-label'].textContent = sizes[Trading.tradeSizeIndex] || '100%';
      this.els['chaos-points-badge'].textContent = `${Meta.data.chaosPoints} CP`;
      if (Meta.has('vibe_analyst')) {
        const trend = Sparkline.getTrend();
        const noisy = trend + Utils.rand(-8, 8);
        this.els['vibe-arrow'].classList.remove('hidden');
        this.els['vibe-arrow'].textContent = noisy > 5 ? '📈' : noisy < -5 ? '📉' : '➡️';
        const lie = Utils.rand(0, 1) < 0.35;
        const arrow = lie ? (noisy > 0 ? '↓' : '↑') : (trend > 0 ? '↑' : trend < 0 ? '↓' : '—');
        this.els['spark-trend'].textContent = arrow;
      }
      this.updateSessionPnl();
      this.updateRegime();
      this.updateCombo();
      this.updateTradeButtons();
    },
    updateTradeButtons() {
      const reason = Game.getTradeBlockReason();
      const canTrade = !reason;
      const hint = this.els['trade-status-hint'];
      if (hint) {
        hint.textContent = reason || '';
        hint.classList.toggle('hidden', !reason);
      }
      const buySpend = Trading.getBuySpend();
      ['buy-btn', 'sell-btn', 'short-btn', 'cover-btn'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === 'buy-btn') el.disabled = !canTrade || buySpend <= 0;
        if (id === 'sell-btn') el.disabled = !canTrade || Portfolio.shares <= 0;
        if (id === 'short-btn') el.disabled = !canTrade || Portfolio.maxShortShares(Meta.has('dark_pool')) <= 0;
        if (id === 'cover-btn') el.disabled = !canTrade || Portfolio.shortShares <= 0;
      });
    },
    updateDebugOverlay() {
      const el = this.els['debug-overlay'];
      if (!el || !Game.debug) return;
      el.classList.remove('hidden');
      el.textContent = [
        `paused:${Game.paused}`,
        `frozen:${Game.tradingFrozen}`,
        `inter:${WaveState.intermission}`,
        `over:${Game.gameOver}`,
        `price:${Market.price.toFixed(2)}`,
        `cash:${Portfolio.cash.toFixed(0)}`,
        `sh:${Portfolio.shares.toFixed(2)}`,
      ].join(' | ');
    },
    setNews(headline, credibility, type, isFake) {
      const text = this.els['news-text'];
      text.textContent = headline;
      text.classList.toggle('scroll', headline.length > 50);
      if (text.classList.contains('scroll')) text.textContent = headline + '   ' + headline;
      const badge = this.els['credibility-badge'];
      badge.textContent = credibility.toUpperCase();
      badge.className = `flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded uppercase credibility-${credibility}`;
      const banner = this.els['news-banner'];
      banner.className = 'news-banner relative overflow-hidden rounded-lg px-3 py-2 sm:py-3 ' +
        (isFake ? 'news-fake' : type === 'crash' || type === 'massive_crash' || type === 'sec_raid' ? 'news-crash' :
          type === 'moon' ? 'news-moon' : type === 'surge' ? 'news-surge' :
          headline.includes('BOSS') ? 'news-boss' : 'news-neutral');
      this.els['fake-news-stamp'].classList.add('hidden');
      banner.classList.remove('flash'); void banner.offsetWidth; banner.classList.add('flash');
    },
    revealFakeNews() {
      this.els['fake-news-stamp'].textContent = 'FAKE NEWS';
      this.els['fake-news-stamp'].classList.remove('hidden');
    },
    showSuspiciousStamp() {
      this.els['fake-news-stamp'].textContent = 'SUSPICIOUS';
      this.els['fake-news-stamp'].classList.remove('hidden');
    },
    showFakeWrongCall() {
      this.els['fake-news-stamp'].textContent = 'WRONG CALL';
      this.els['fake-news-stamp'].classList.remove('hidden');
    },
    showNextNewsHint(h) {
      const el = this.els['next-news-hint'];
      if (!el) return;
      el.textContent = `Incoming: ${h}`;
      el.classList.remove('hidden');
    },
    hideNextNewsHint() { this.els['next-news-hint']?.classList.add('hidden'); },
    showReactionBar(label, barClass, gridClass) {
      const bar = this.els['reaction-bar'];
      if (!bar) return;
      bar.className = `reaction-bar ${barClass}`;
      if (this.els['reaction-label']) this.els['reaction-label'].textContent = label;
      if (this.els['reaction-timer-fill']) this.els['reaction-timer-fill'].style.width = '100%';
      if (this.els['reaction-feedback']) this.els['reaction-feedback'].textContent = '';
      const grid = document.querySelector('.trade-buttons-grid');
      if (grid) grid.className = `trade-buttons-grid ${gridClass}`;
    },
    updateReactionTimer(r) {
      if (this.els['reaction-timer-fill']) this.els['reaction-timer-fill'].style.width = `${r * 100}%`;
    },
    showReactionFeedback(text, cls) {
      const el = this.els['reaction-feedback'];
      if (!el) return;
      el.textContent = text;
      el.className = `reaction-feedback ${cls}`;
    },
    hideReactionBar() {
      const bar = this.els['reaction-bar'];
      if (bar) bar.className = 'reaction-bar hidden';
      const grid = document.querySelector('.trade-buttons-grid');
      if (grid) grid.className = 'trade-buttons-grid';
    },
    hideQTE() { this.hideReactionBar(); },
    updateRegime() {
      const el = this.els['regime-badge'];
      if (!el) return;
      const r = Market.getRegime();
      el.textContent = r.label;
      el.className = `badge badge-regime regime-${Market.regime}`;
    },
    updateCombo() {
      const el = this.els['combo-badge'];
      if (!el) return;
      if (Combo.count <= 1) { el.classList.add('hidden'); return; }
      el.textContent = `×${Combo.count} COMBO`;
      el.classList.remove('hidden');
    },
    updateSessionPnl() {
      const el = this.els['session-pnl'];
      if (!el) return;
      const pct = ((Portfolio.value() - Portfolio.startCash) / Portfolio.startCash) * 100;
      el.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
      el.className = `session-pnl ${pct >= 0 ? 'up' : 'down'}`;
    },
    showTradingFrozen(v) {
      this.els['trading-frozen']?.classList.toggle('hidden', !v);
    },
    setSecCountdown(n) { if (this.els['sec-countdown']) this.els['sec-countdown'].textContent = n; },
    animateButton(id) {
      const btn = document.getElementById(id);
      btn?.classList.remove('clicked'); void btn?.offsetWidth;
      btn?.classList.add('clicked');
      setTimeout(() => btn?.classList.remove('clicked'), 250);
    },
    spawnFloatText(parent, text, pos) {
      if (!parent) return;
      const el = document.createElement('span');
      el.className = 'float-text ' + (pos ? 'positive' : 'negative');
      el.textContent = text;
      parent.style.position = 'relative';
      parent.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    },
    renderTradeLog(log) {
      this.els['trade-log-count'].textContent = `(${log.length})`;
      this.els['trade-log'].innerHTML = log.length ? log.map((e) => {
        const p = e.pnl ? ` <span class="${e.pnl >= 0 ? 'log-profit' : 'log-loss'}">(${Utils.formatMoney(e.pnl)})</span>` : '';
        return `<div class="log-${e.type}">[${e.time}] ${e.detail}${p}</div>`;
      }).join('') : '<div class="text-gray-600">No trades yet</div>';
    },
    showAchievementToast(t, d) {
      this.els['achievement-toast-title'].textContent = t;
      this.els['achievement-toast-desc'].textContent = d;
      this.els['achievement-toast'].classList.remove('hidden');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.els['achievement-toast'].classList.add('hidden'), 3500);
    },
    setDifficultyBadge(d) {
      const diff = Config.DIFFICULTIES[d];
      const b = this.els['difficulty-badge'];
      b.textContent = diff.label;
      b.className = `badge ${diff.badgeClass}`;
    },
    updateWaveUI() {
      this.els['wave-badge'].textContent = `DAY ${WaveState.current}/${Config.TOTAL_WAVES}`;
      this.els['wave-goal-text'].textContent = `🎯 ${WaveState.goal?.label || 'Survive'}`;
    },
    updateWaveTimer(remaining, total) {
      const pct = Math.max(0, remaining / total);
      this.els['wave-timer-bar'].style.width = `${pct * 100}%`;
      this.els['wave-timer-text'].textContent = `${Math.ceil(remaining / 1000)}s`;
    },
    updateTradeChips() {
      const sizes = Trading.getSizes();
      const slider = this.els['trade-size-slider'];
      if (slider) {
        slider.max = sizes.length - 1;
        if (Trading.tradeSizeIndex > slider.max) Trading.tradeSizeIndex = slider.max;
        slider.value = Trading.tradeSizeIndex;
      }
      const chips = this.els['trade-size-chips'];
      if (!chips) return;
      chips.innerHTML = sizes.map((s, i) =>
        `<button type="button" class="trade-size-chip ${i === Trading.tradeSizeIndex ? 'active' : ''}" data-size="${i}">${Math.round(s * 100)}%</button>`
      ).join('');
      this.els['trade-size-label'].textContent = `${Math.round(sizes[Trading.tradeSizeIndex] * 100)}%`;
    },
    toggleTradeLog(show) {
      const open = show ?? this.els['trade-log-overlay']?.classList.contains('hidden');
      if (open) this.els['trade-log-overlay']?.classList.remove('hidden');
      else this.els['trade-log-overlay']?.classList.add('hidden');
    },
    showUndo() {
      if (Meta.has('ghost_portfolio') && !Trading.undoUsed) {
        this.els['undo-btn']?.classList.remove('hidden');
      }
    },
    hideUndo() { this.els['undo-btn']?.classList.add('hidden'); },
    renderUpgrades() {
      const c = this.els['upgrades-list'];
      this.els['upgrade-chaos-points'].textContent = Meta.data.chaosPoints;
      const owned = Config.UPGRADES.filter((u) => Meta.has(u.id)).length;
      this.els['upgrades-owned-count'].textContent = owned;
      this.els['upgrades-total-count'].textContent = Config.UPGRADES.length;
      c.innerHTML = Config.UPGRADES.map((u) => {
        const has = Meta.has(u.id);
        return `<div class="upgrade-card ${has ? 'owned' : ''}"><div><p class="font-bold text-sm">${u.name}</p><p class="text-xs text-gray-400">${u.desc}</p></div>
        <button data-upgrade="${u.id}" class="px-3 py-2 rounded-lg font-bold text-xs ${has ? 'bg-emerald-900 text-emerald-300' : 'bg-purple-700 text-white'}" ${has || Meta.data.chaosPoints < u.cost ? 'disabled' : ''}>${has ? 'OWNED' : u.cost + ' CP'}</button></div>`;
      }).join('');
    },
    renderAchievements() {
      const unlocked = Achievements.unlocked.size;
      this.els['achievements-unlocked-count'].textContent = unlocked;
      this.els['achievements-total-count'].textContent = Config.ACHIEVEMENTS.length;
      this.els['achievements-list'].innerHTML = Config.ACHIEVEMENTS.map((a) => {
        const ok = Achievements.unlocked.has(a.id);
        return `<div class="achievement-row ${ok ? 'unlocked' : 'locked'}"><span>${ok ? '🏆' : '🔒'}</span><div>
        <p class="font-bold text-sm">${a.name}</p><p class="text-xs text-gray-400">${a.desc}</p>
        ${!ok && a.hint ? `<p class="achievement-hint">${a.hint}</p>` : ''}</div></div>`;
      }).join('');
    },
    renderOwnedPreview() {
      const el = this.els['owned-upgrades-preview'];
      if (!el) return;
      const owned = Config.UPGRADES.filter((u) => Meta.has(u.id));
      el.innerHTML = owned.length ? owned.map((u) => `<span class="upgrade-chip">${u.name}</span>`).join('') : '<span class="text-xs text-gray-600">No upgrades yet</span>';
    },
    renderWaveShop() {
      const c = this.els['wave-shop-items'];
      c.innerHTML = Config.WAVE_SHOP.map((item) =>
        `<div class="shop-item"><div><b>${item.name}</b> — ${item.desc}</div>
        <button data-shop="${item.id}" ${Meta.data.chaosPoints < item.cost ? 'disabled' : ''}>${item.cost} CP</button></div>`
      ).join('');
    },
    showIntermission(goalMet) {
      const rank = WaveState.calcWaveRank(goalMet);
      this.els['inter-wave-rank'].textContent = `RANK: ${rank}`;
      this.els['inter-wave-rank'].className = `text-center font-display text-2xl font-black mb-2 rank-${rank.toLowerCase()}`;
      this.els['inter-wave-num'].textContent = WaveState.current;
      this.els['inter-goal-result'].textContent = goalMet
        ? '✅ Wave goal completed! +20 CP bonus incoming'
        : '❌ Wave goal missed — small penalty applied';
      this.els['inter-goal-result'].className = `text-center font-mono text-sm mb-6 ${goalMet ? 'text-emerald-400' : 'text-red-400'}`;
      this.els['inter-portfolio'].textContent = Utils.formatMoney(Portfolio.value());
      this.els['inter-peak'].textContent = Utils.formatMoney(RunStats.peakPortfolio);
      this.els['inter-trades'].textContent = WaveState.waveTrades;
      this.els['inter-goals'].textContent = `${RunStats.goalsCompleted}/${RunStats.goalsTotal}`;
      const nextGoal = WaveState.buildGoalPreview(Portfolio.value());
      this.els['inter-next-goal'].textContent = nextGoal.label;
      this.renderWaveShop();
      this.show('intermission-overlay');
      UI.updateTradeButtons();
    },
    showScoreScreen(kind, pts) {
      const titles = { bankrupt: ['BANKRUPT', 'neon-red'], victory: ['VICTORY', 'neon-green'], cashout: ['CASHED OUT', 'neon-green'], end: ['RUN COMPLETE', 'neon-green'] };
      const [title, cls] = titles[kind] || titles.end;
      this.els['score-title'].textContent = title;
      this.els['score-title'].className = `text-4xl sm:text-5xl font-black tracking-widest mb-2 ${cls}`;
      this.els['score-subtitle'].textContent = kind === 'bankrupt' ? 'Liquidated to zero.' : kind === 'victory' ? 'You conquered all 5 trading days!' : 'Run archived.';
      this.els['score-waves'].textContent = RunStats.wavesCleared;
      this.els['score-goals'].textContent = `${RunStats.goalsCompleted}/${RunStats.goalsTotal}`;
      this.els['score-peak'].textContent = Utils.formatMoney(RunStats.peakPortfolio);
      this.els['score-trades'].textContent = RunStats.tradesMade;
      this.els['score-news'].textContent = RunStats.newsSurvived;
      this.els['score-qte'].textContent = RunStats.qteWins;
      this.els['score-chaos-earned'].textContent = pts;
      this.els['score-streak-bonus'].textContent = Meta.data.winStreak > 0 ? `Streak bonus: ${Meta.data.winStreak}x` : '';
      this.show('score-overlay');
    },
    showRetireToast(amount, bonus) {
      this.showAchievementToast(
        `Milestone: ${Utils.formatMoney(amount)}`,
        `+${bonus} CP retire bonus — cash out at wave break`
      );
    },
  };

  const Game = {
    running: false, paused: false, gameOver: false, tradingFrozen: false, debug: false,
    lastTimestamp: 0, difficulty: 'normal', secondChanceUsed: false,
    marginCallActive: false, marginTimer: null, retirePrompted: new Set(),

    handleKeydown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!this.running || this.gameOver || this.paused || WaveState.intermission) return;
      const tradeMap = { '1': 'buy', 'q': 'buy', 'Q': 'buy', '2': 'sell', 'w': 'sell', 'W': 'sell', '3': 'short', 'e': 'short', 'E': 'short', '4': 'cover', 'r': 'cover', 'R': 'cover' };
      if (tradeMap[e.key]) { e.preventDefault(); this.trade(tradeMap[e.key]); return; }
      if (e.key === '[') { Trading.tradeSizeIndex = Math.max(0, Trading.tradeSizeIndex - 1); UI.updateTradeChips(); }
      if (e.key === ']') { Trading.tradeSizeIndex = Math.min(Trading.getSizes().length - 1, Trading.tradeSizeIndex + 1); UI.updateTradeChips(); }
    },
    getTradeBlockReason() {
      if (!this.running || this.gameOver) return 'GAME OVER';
      if (WaveState.intermission) return 'WAVE BREAK';
      if (this.paused) return 'PAUSED';
      if (SECRaid.active) return 'SEC RAID';
      if (this.marginCallActive) return 'MARGIN CALL';
      if (this.tradingFrozen) return 'FROZEN';
      // QTE.active is NOT a trade block — trades are how you respond
      return '';
    },
    canTrade() {
      return !this.getTradeBlockReason();
    },

    init() {
      UI.cache();
      NewsGenerator.init();
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
      UI.els['daily-seed-toggle'].checked = Meta.data.dailySeed;
      this.difficulty = Meta.data.selectedDifficulty || 'normal';
      this.highlightDifficulty(this.difficulty);
      UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;
      UI.els['menu-streak'].textContent = Meta.data.winStreak;
      UI.els['menu-best-streak'].textContent = Meta.data.bestStreak;
      UI.renderOwnedPreview();
      UI.updateTradeChips();
      this.bindEvents();
      window.addEventListener('resize', () => this.onResize());
      requestAnimationFrame((t) => this.loop(t));
    },

    bindEvents() {
      try {
      document.getElementById('start-game-btn').addEventListener('click', () => {
        AudioEngine.init(); AudioEngine.resume(); this.startRun();
      });
      document.getElementById('open-upgrades-btn').addEventListener('click', () => { UI.renderUpgrades(); UI.show('upgrades-overlay'); });
      document.getElementById('open-achievements-btn').addEventListener('click', () => { UI.renderAchievements(); UI.show('achievements-overlay'); });
      document.getElementById('close-upgrades-btn').addEventListener('click', () => UI.hide('upgrades-overlay'));
      document.getElementById('close-achievements-btn').addEventListener('click', () => UI.hide('achievements-overlay'));
      document.querySelectorAll('#difficulty-select .diff-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.difficulty = btn.dataset.difficulty;
          Meta.data.selectedDifficulty = this.difficulty;
          Storage.save(Meta.data);
          this.highlightDifficulty(this.difficulty);
        });
      });
      UI.els['daily-seed-toggle'].addEventListener('change', (e) => {
        Meta.data.dailySeed = e.target.checked; Storage.save(Meta.data);
      });
      document.getElementById('upgrades-list').addEventListener('click', (e) => {
        const id = e.target.dataset?.upgrade;
        if (id && Meta.buyUpgrade(id)) { UI.renderUpgrades(); UI.renderOwnedPreview(); UI.updateTradeChips(); UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints; }
      });
      document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
      document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
      document.getElementById('end-run-btn').addEventListener('click', () => { this.togglePause(); this.endRun('end'); });
      document.getElementById('mute-btn').addEventListener('click', () => {
        Meta.data.settings.sound = !Meta.data.settings.sound;
        AudioEngine.setEnabled(Meta.data.settings.sound);
        UI.els['setting-sound'].checked = Meta.data.settings.sound;
        UI.els['mute-btn'].textContent = Meta.data.settings.sound ? '🔊' : '🔇';
        Storage.save(Meta.data);
      });
      ['setting-sound','setting-reduced-motion','setting-particles'].forEach((id) => {
        UI.els[id].addEventListener('change', (e) => {
          const key = id.replace('setting-', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          Meta.data.settings[key] = e.target.checked;
          if (key === 'sound') { AudioEngine.setEnabled(e.target.checked); UI.els['mute-btn'].textContent = e.target.checked ? '🔊' : '🔇'; }
          if (key === 'reducedMotion') { Chart.reducedMotion = e.target.checked; document.body.classList.toggle('reduced-motion', e.target.checked); }
          if (key === 'particles') Particles.enabled = e.target.checked;
          Storage.save(Meta.data);
        });
      });
      document.getElementById('buy-btn').addEventListener('click', () => this.trade('buy'));
      document.getElementById('sell-btn').addEventListener('click', () => this.trade('sell'));
      document.getElementById('short-btn').addEventListener('click', () => this.trade('short'));
      document.getElementById('cover-btn').addEventListener('click', () => this.trade('cover'));
      document.getElementById('undo-btn').addEventListener('click', () => Trading.undo());
      document.getElementById('log-btn').addEventListener('click', () => UI.toggleTradeLog(true));
      document.getElementById('close-log-btn').addEventListener('click', () => UI.toggleTradeLog(false));
      UI.els['trade-log-overlay']?.addEventListener('click', (e) => {
        if (e.target === UI.els['trade-log-overlay']) UI.toggleTradeLog(false);
      });
      UI.els['trade-size-chips']?.addEventListener('click', (e) => {
        const idx = e.target.dataset?.size;
        if (idx !== undefined) {
          Trading.tradeSizeIndex = parseInt(idx, 10);
          UI.updateTradeChips();
        }
      });
      UI.els['trade-size-slider']?.addEventListener('input', (e) => {
        Trading.tradeSizeIndex = parseInt(e.target.value, 10);
        UI.updateTradeChips();
      });
      // QTE buttons removed — reaction now via buy/sell/short/cover
      document.getElementById('keep-trading-btn').addEventListener('click', () => this.continueRun());
      document.getElementById('cash-out-btn').addEventListener('click', () => this.cashOut());
      document.getElementById('wave-shop-items').addEventListener('click', (e) => {
        const id = e.target.dataset?.shop;
        if (id) this.buyShopItem(id);
      });
      document.getElementById('margin-cover-btn').addEventListener('click', () => this.resolveMarginCall(true));
      document.getElementById('retire-yes-btn').addEventListener('click', () => this.retireEarly(true));
      document.getElementById('retire-no-btn').addEventListener('click', () => this.retireEarly(false));
      document.getElementById('score-restart-btn').addEventListener('click', () => { UI.hide('score-overlay'); this.startRun(); });
      document.getElementById('score-menu-btn').addEventListener('click', () => {
        UI.hide('score-overlay'); UI.hide('game-ui'); UI.show('main-menu');
        document.body.classList.remove('game-active');
        this.refreshMenu();
      });
      document.getElementById('score-upgrades-btn').addEventListener('click', () => { UI.renderUpgrades(); UI.show('upgrades-overlay'); });
      document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
          this.debug = !this.debug;
          UI.els['debug-overlay']?.classList.toggle('hidden', !this.debug);
        }
        if (e.key === 'Escape' && this.running && !this.gameOver && !WaveState.intermission) this.togglePause();
        this.handleKeydown(e);
      });
      } catch (err) {
        console.error('bindEvents failed:', err);
      }
    },

    highlightDifficulty(d) {
      document.querySelectorAll('#difficulty-select .diff-card').forEach((b) => b.classList.toggle('active', b.dataset.difficulty === d));
    },

    refreshMenu() {
      UI.els['menu-chaos-points'].textContent = Meta.data.chaosPoints;
      UI.els['menu-streak'].textContent = Meta.data.winStreak;
      UI.els['menu-best-streak'].textContent = Meta.data.bestStreak;
      UI.renderOwnedPreview();
    },

    onResize() {
      if (Chart.resize() && this.running) Chart.seedPoints(Market.price);
      Sparkline.resize();
    },

    initCharts() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!Chart.resize()) {
            setTimeout(() => { Chart.resize(); Chart.seedPoints(Market.price); Sparkline.resize(); }, 50);
          } else {
            Chart.seedPoints(Market.price);
            Sparkline.resize();
          }
        });
      });
    },

    startRun() {
      this.running = true; this.paused = false; this.gameOver = false;
      this.tradingFrozen = false; this.secondChanceUsed = false;
      this.marginCallActive = false; this.retirePrompted = new Set();
      this.lastTimestamp = 0;
      this.difficulty = Meta.data.selectedDifficulty || 'normal';
      Market.difficulty = this.difficulty;

      if (Meta.data.dailySeed) {
        RNG.setSeed(Utils.dailySeed());
        RunStats.dailyRun = true;
      } else { RNG.reset(); RunStats.dailyRun = false; }

      const startCash = Meta.getStartCash();
      Portfolio.reset(startCash);
      Market.reset();
      RunStats.reset(startCash);
      Trading.reset();
      Sparkline.reset(startCash);
      Combo.reset();
      NewsGenerator.recent = [];
      WaveState.current = 1;
      WaveState.intermission = false;
      WaveState.qteBoost = false;
      WaveState.retiredMilestones = new Set();

      News.clear(); QTE.cancel();
      UI.hide('main-menu'); UI.hide('score-overlay');
      UI.hide('pause-overlay'); UI.hide('intermission-overlay'); UI.hide('retire-overlay');
      UI.hide('margin-overlay'); UI.show('game-ui');
      document.body.classList.add('game-active');
      UI.toggleTradeLog(false);

      UI.setDifficultyBadge(this.difficulty);
      UI.setNews('Markets open. Brace for chaos...', 'high', 'neutral', false);
      this.startWave();
      this.initCharts();
      News.setNextPreview();
      News.schedule(this);
      UI.updatePortfolio();
      UI.updateWaveUI();
      UI.updateTradeButtons();
      if (Meta.has('ghost_portfolio')) UI.showUndo();
    },

    startWave() {
      WaveState.intermission = false;
      WaveState.duration = WaveState.getDuration();
      WaveState.startTime = performance.now();
      WaveState.resetWaveStats();
      Market.setWaveAnchor();
      WaveState.pickGoal();
      RunStats.goalsTotal++;
      UI.updateWaveUI();
      UI.updateTradeButtons();
      UI.hide('intermission-overlay');
      AudioEngine.play('wave');
    },

    trade(fn) {
      if (!this.canTrade()) return;
      Trading[fn]();
      UI.showUndo();
      this.checkAchievements();
      this.checkMarginCall();
    },

    buyShopItem(id) {
      const item = Config.WAVE_SHOP.find((x) => x.id === id);
      if (!item || Meta.data.chaosPoints < item.cost) return;
      Meta.data.chaosPoints -= item.cost;
      Storage.save(Meta.data);
      RunStats.shopPurchases++;
      if (RunStats.shopPurchases >= 3) Achievements.unlock('shopaholic', Meta.data);
      if (id === 'news_shield') { Market.newsShield = true; UI.spawnFloatText(document.getElementById('wave-shop'), 'Shield active!', true); }
      if (id === 'instant_cash') Portfolio.cash += 200;
      if (id === 'qte_boost') WaveState.qteBoost = true;
      if (id === 'repair') {
        const bonus = Portfolio.value() * 0.05;
        Portfolio.cash += bonus;
      }
      UI.renderWaveShop();
      UI.els['chaos-points-badge'].textContent = `${Meta.data.chaosPoints} CP`;
    },

    checkWaveEnd() {
      if (WaveState.intermission || this.gameOver) return;
      const elapsed = performance.now() - WaveState.startTime;
      if (elapsed < WaveState.duration) return;
      this.completeWave();
    },

    completeWave() {
      WaveState.intermission = true;
      News.clear();
      UI.updateTradeButtons();
      WaveState.goalMet = WaveState.checkGoal();
      if (WaveState.goalMet) {
        RunStats.goalsCompleted++;
        const bonus = 20 + (Meta.has('influencer_collab') ? 1 : 0);
        Meta.data.chaosPoints += bonus;
        Storage.save(Meta.data);
      } else {
        RunStats.flawless = false;
        Portfolio.cash = Math.max(0, Portfolio.cash - Portfolio.value() * 0.01);
      }
      RunStats.wavesCleared = WaveState.current;
      if (Meta.has('compound_interest')) {
        const bonus = Portfolio.value() * 0.02;
        Portfolio.cash += bonus;
      }
      if (WaveState.current >= Config.TOTAL_WAVES) {
        this.endRun('victory');
        return;
      }
      UI.showIntermission(WaveState.goalMet);
    },

    continueRun() {
      WaveState.current++;
      this.startWave();
      UI.updateTradeButtons();
      News.setNextPreview();
      News.schedule(this);
    },

    cashOut() {
      RunStats.cashOutProfit = Portfolio.value() - RunStats.startCash;
      if (RunStats.cashOutProfit >= 3000) Achievements.unlock('smart_exit', Meta.data);
      Meta.data.winStreak++;
      if (Meta.data.winStreak > Meta.data.bestStreak) Meta.data.bestStreak = Meta.data.winStreak;
      if (Meta.data.winStreak >= 5) Achievements.unlock('streak_master', Meta.data);
      Storage.save(Meta.data);
      this.endRun('cashout');
    },

    retireEarly(accept) {
      UI.hide('retire-overlay');
      if (!accept) return;
      const milestone = Config.RETIRE_MILESTONES.find((m) => !this.retirePrompted.has(m.amount) && RunStats.peakPortfolio >= m.amount);
      if (!milestone) return;
      if (milestone.amount >= 25000) Achievements.unlock('victory_lap', Meta.data);
      Meta.data.chaosPoints += milestone.bonus;
      Meta.data.winStreak++;
      Storage.save(Meta.data);
      this.endRun('cashout', milestone.bonus);
    },

    checkRetirePrompt() {
      for (const m of Config.RETIRE_MILESTONES) {
        if (RunStats.peakPortfolio >= m.amount && !this.retirePrompted.has(m.amount) && !WaveState.intermission) {
          this.retirePrompted.add(m.amount);
          UI.showRetireToast(m.amount, m.bonus);
          break;
        }
      }
    },

    checkMarginCall() {
      if (Portfolio.shortShares <= 0 || this.marginCallActive) return;
      const pv = Portfolio.value();
      if (pv <= 0) return;
      const loss = Portfolio.shortLoss();
      if (loss / pv >= Config.MARGIN_CALL_THRESHOLD) this.triggerMarginCall();
    },

    triggerMarginCall() {
      this.marginCallActive = true;
      this.tradingFrozen = true;
      UI.updateTradeButtons();
      UI.show('margin-overlay');
      const start = performance.now();
      const tick = () => {
        if (!this.marginCallActive) return;
        const elapsed = performance.now() - start;
        const rem = Math.max(0, 1 - elapsed / Config.MARGIN_CALL_TIME);
        UI.els['margin-timer-bar'].style.width = `${rem * 100}%`;
        if (elapsed >= Config.MARGIN_CALL_TIME) this.resolveMarginCall(false);
        else this.marginTimer = requestAnimationFrame(tick);
      };
      tick();
    },

    resolveMarginCall(covered) {
      this.marginCallActive = false;
      this.tradingFrozen = false;
      cancelAnimationFrame(this.marginTimer);
      UI.hide('margin-overlay');
      UI.updateTradeButtons();
      if (covered && Portfolio.shortShares > 0) {
        const qty = Portfolio.shortShares;
        const cost = qty * Market.price;
        Portfolio.cash -= cost;
        Portfolio.shortShares = 0;
        Portfolio.shortAvgPrice = 0;
        UI.spawnFloatText(document.getElementById('margin-overlay'), 'COVERED', true);
      } else if (!covered) {
        this.endRun('bankrupt');
      }
    },

    checkAchievements() {
      const pv = Portfolio.value();
      if (pv >= Portfolio.startCash * 2) {
        Achievements.unlock('to_the_moon', Meta.data);
        if (this.difficulty === 'nightmare') Achievements.unlock('nightmare_clear', Meta.data);
      }
      if (pv >= 10000) Achievements.unlock('millionaire_mindset', Meta.data);
      if (RunStats.wasUnder10Pct && pv >= Portfolio.startCash) Achievements.unlock('barely_alive', Meta.data);
      if (RunStats.newsSurvived >= 20) Achievements.unlock('chaos_surfer', Meta.data);
      if (RunStats.bossSurvived) Achievements.unlock('boss_slayer', Meta.data);
      if (RunStats.dailyRun && RunStats.wavesCleared >= 3) Achievements.unlock('daily_degenerate', Meta.data);
    },

    checkBankruptcy() {
      if (this.gameOver) return;
      if (Portfolio.value() <= 0) {
        if (Meta.has('second_chance') && !this.secondChanceUsed) {
          this.secondChanceUsed = true;
          Portfolio.cash = Portfolio.startCash * 0.25;
          Portfolio.shares = 0; Portfolio.shortShares = 0;
          UI.spawnFloatText(document.getElementById('portfolio-value').parentElement, 'SECOND CHANCE!', true);
          return;
        }
        RunStats.waveReachedBeforeDeath = WaveState.current;
        if (WaveState.current >= 4) Achievements.unlock('greedy_bastard', Meta.data);
        this.endRun('bankrupt');
      }
    },

    endRun(kind, extraBonus = 0) {
      this.gameOver = true; this.running = false;
      RunStats.bankrupt = kind === 'bankrupt';
      News.clear();
      if (kind === 'bankrupt') {
        AudioEngine.play('bankrupt');
        Meta.data.winStreak = 0;
        const elapsed = (performance.now() - RunStats.startTime) / 1000;
        if (elapsed < 60) Achievements.unlock('speed_bankrupt', Meta.data);
      }
      if (kind === 'victory') {
        AudioEngine.play('victory');
        Achievements.unlock('wave_warrior', Meta.data);
        Meta.data.winStreak++;
      }
      if (RunStats.flawless && RunStats.goalsCompleted === RunStats.goalsTotal && RunStats.goalsTotal >= 5) {
        Achievements.unlock('five_wave_flawless', Meta.data);
      }
      if (Meta.data.winStreak > Meta.data.bestStreak) Meta.data.bestStreak = Meta.data.winStreak;
      const pts = Meta.awardPoints(Meta.calcRunPoints(RunStats, kind === 'cashout' || kind === 'victory') + extraBonus);
      Storage.save(Meta.data);
      UI.hide('intermission-overlay'); UI.hide('game-ui');
      document.body.classList.remove('game-active');
      UI.toggleTradeLog(false);
      UI.showScoreScreen(kind, pts);
    },

    togglePause() {
      if (!this.running || this.gameOver || WaveState.intermission) return;
      this.paused = !this.paused;
      if (this.paused) UI.show('pause-overlay'); else UI.hide('pause-overlay');
      UI.updateTradeButtons();
    },

    loop(timestamp) {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      const dt = Math.min(timestamp - this.lastTimestamp, 50);
      this.lastTimestamp = timestamp;

      if (this.running && !this.paused && !this.gameOver && !WaveState.intermission) {
        const upgrades = {
          crash_padding: Meta.has('crash_padding'),
          rug_pull_insurance: Meta.has('rug_pull_insurance'),
        };
        const crashing = Market.update(dt, upgrades);
        if (crashing) Chart.shake();
        Chart.updatePoint(Market.price);
        RunStats.updatePeak();
        WaveState.trackPeak();
        Sparkline.push(Portfolio.value());
        this.checkAchievements();
        this.checkRetirePrompt();
        this.checkMarginCall();
        this.checkBankruptcy();
        this.checkWaveEnd();
        const remaining = WaveState.duration - (performance.now() - WaveState.startTime);
        UI.updateWaveTimer(remaining, WaveState.duration);
      }

      Chart.draw(Market.price);
      Sparkline.draw();
      Particles.update(dt);
      Particles.draw();
      UI.updatePortfolio();
      UI.updateDebugOverlay();

      requestAnimationFrame((t) => this.loop(t));
    },
  };

  Game.init();
})();
