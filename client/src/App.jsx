
import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const collections = [
  { name: 'Neon Apex', floor: '1.7 ETH', change: '+12.4%', tone: 'purple' },
  { name: 'Pixel Punks', floor: '0.9 ETH', change: '+8.9%', tone: 'blue' },
  { name: 'Astra Cubes', floor: '2.2 ETH', change: '+16.3%', tone: 'teal' },
  { name: 'Lunar Tides', floor: '2.8 ETH', change: '+19.1%', tone: 'gold' },
];

const features = [
  { title: 'Curated discovery', text: 'Explore premium drops selected by real demand and creator momentum.' },
  { title: 'Wallet-grade security', text: 'Every checkout and transfer is protected with secure wallet flows.' },
  { title: 'Live auctions', text: 'Track bids in real time and spot the next rare collection early.' },
];

const pricingPlans = [
  { name: 'Starter', price: '$0', description: 'For first-time collectors and active browsers.', perks: ['One profile', 'Editorial access', 'Portfolio tracking'], featured: false },
  { name: 'Pro', price: '$29', description: 'For serious buyers who want live market advantages.', perks: ['Unlimited watchlists', 'Early auction access', 'Live analytics'], featured: true },
  { name: 'Studio', price: '$99', description: 'For artists and brands running launches and communities.', perks: ['Minting tools', 'Whitelist dashboards', 'Priority support'], featured: false },
];

const trendingItems = [
  { title: 'Luna Bloom #204', artist: 'Mira Sol', price: '2.49 ETH', tag: '3D Art' },
  { title: 'Echo Circuit', artist: 'Kite Grid', price: '1.82 ETH', tag: 'Generative' },
  { title: 'Void Harbor', artist: 'Vera Moss', price: '3.12 ETH', tag: 'Photography' },
  { title: 'Signal Bloom', artist: 'Alto Nox', price: '2.11 ETH', tag: 'Abstract' },
];

const marketplaceItems = [
  { id: 'sovereign-echo', title: 'Sovereign Echo', artist: 'Nia Sol', price: '1.92 ETH', tag: 'Generative', category: 'Generative', tone: 'purple', description: 'A generative study in motion, light, and luxury.', metrics: { volume: '3.8 ETH', owners: '184', rarity: 'Rare' } },
  { id: 'glass-horizon', title: 'Glass Horizon', artist: 'Evan Roe', price: '2.41 ETH', tag: 'Abstract', category: 'Art', tone: 'blue', description: 'An abstract field of reflective edges and atmospheric gradients.', metrics: { volume: '5.1 ETH', owners: '221', rarity: 'Epic' } },
  { id: 'night-current', title: 'Night Current', artist: 'Mira Toll', price: '1.64 ETH', tag: 'Photography', category: 'Photography', tone: 'teal', description: 'An urban light study framed through the rhythm of motion.', metrics: { volume: '2.7 ETH', owners: '146', rarity: 'Rare' } },
  { id: 'afterglow-unit', title: 'Afterglow Unit', artist: 'Zane Rook', price: '3.08 ETH', tag: '3D', category: 'Utility', tone: 'gold', description: 'A volumetric collectible built for digital curation and display.', metrics: { volume: '7.3 ETH', owners: '96', rarity: 'Legendary' } },
  { id: 'zero-latitude', title: 'Zero Latitude', artist: 'Lina Vale', price: '2.35 ETH', tag: 'Motion', category: 'Art', tone: 'teal', description: 'Dynamic motion captured in a minimal atmospheric environment.', metrics: { volume: '4.9 ETH', owners: '139', rarity: 'Epic' } },
  { id: 'chroma-thread', title: 'Chroma Thread', artist: 'Sora Hilt', price: '1.78 ETH', tag: 'Illustration', category: 'Generative', tone: 'purple', description: 'Layered illustration work built from color rhythm and tension.', metrics: { volume: '3.4 ETH', owners: '194', rarity: 'Rare' } },
];

const faqItems = [
  { question: 'How does the market work?', answer: 'Create an account, connect a wallet, browse curated drops, and buy or bid on the items you want.' },
  { question: 'Are transactions secure?', answer: 'We focus on wallet verification, transparent ownership, and secure payment flows for each listing.' },
  { question: 'Can creators launch collections?', answer: 'Yes. Studio plans include the tools to mint, manage, and promote a collection with confidence.' },
];

const creatorDrops = [
  { title: 'Monolith Study', status: 'Minting', price: '1.6 ETH' },
  { title: 'Solar Archive', status: 'Live', price: '2.8 ETH' },
  { title: 'Glass Memory', status: 'Draft', price: '0.9 ETH' },
];

const stats = [
  { label: 'Total volume', value: '$2.8B' },
  { label: 'Active buyers', value: '142K' },
  { label: 'New drops', value: '3.4K' },
  { label: 'Avg sale', value: '1.8 ETH' },
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem('marketplace_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function WalletModal({ isOpen, onClose, onConnect }) {
  if (!isOpen) {
    return null;
  }

  const wallets = ['MetaMask', 'WalletConnect', 'Coinbase Wallet'];

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="wallet-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Connect a wallet">
        <div className="modal-header">
          <div>
            <p className="eyebrow slim">Wallet</p>
            <h3>Connect your wallet</h3>
          </div>
          <button type="button" className="icon-close" aria-label="Close wallet modal" onClick={onClose}>×</button>
        </div>

        <div className="wallet-options">
          {wallets.map((wallet) => (
            <button
              key={wallet}
              type="button"
              className="wallet-option"
              onClick={() => {
                onConnect(wallet);
                onClose();
              }}
            >
              <span className="wallet-badge">{wallet.slice(0, 1)}</span>
              <span>{wallet}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function useWalletConnection() {
  const [walletConnected, setWalletConnected] = useState(() => localStorage.getItem('marketplace_wallet') === 'connected');

  useEffect(() => {
    localStorage.setItem('marketplace_wallet', walletConnected ? 'connected' : 'disconnected');
  }, [walletConnected]);

  return [walletConnected, setWalletConnected];
}

function LandingPage() {
  const [walletConnected, setWalletConnected] = useWalletConnection();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <div className="page-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <div>
            <span className="brand-name">Lattice</span>
            <small>Market</small>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/marketplace">Discover</Link>
          <Link to="/marketplace">Collections</Link>
          <Link to="/marketplace">Drops</Link>
          <Link to="/studio">Studio</Link>
          <Link to="/">Pricing</Link>
          <Link to="/">FAQ</Link>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className={`wallet-button ${walletConnected ? 'connected' : ''}`}
            onClick={() => setIsWalletModalOpen(true)}
          >
            {walletConnected ? 'Wallet connected' : 'Connect wallet'}
          </button>
          <Link to="/login" className="btn btn-ghost">Sign in</Link>
          <Link to="/register" className="btn btn-primary">Create</Link>
        </div>
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={() => setWalletConnected(true)}
      />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Curated digital culture</span>
            <h1>Own the next wave of digital luxury.</h1>
            <p>
              Discover premium NFT art, dynamic collectibles, and creator-owned experiences
              designed for modern collectors and digital culture brands.
            </p>

            <div className="cta-row">
              <Link to="/marketplace" className="btn btn-primary large">Explore marketplace</Link>
              <Link to="/studio" className="btn btn-secondary large">Launch studio</Link>
            </div>

            <div className="hero-meta">
              <span className="meta-pill">Live auctions</span>
              <span className="meta-pill soft">Across 18 collections</span>
              <span className="meta-pill soft">Vault ready</span>
            </div>

            <div className="brand-strip">
              <span>Mint House</span>
              <span>Nova Labs</span>
              <span>Arc Syndicate</span>
              <span>Pixel Forge</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass-panel">
              <div className="panel-row top-row">
                <span className="dot" />
                <span>{walletConnected ? '0xA7F...9d2' : 'Wallet idle'}</span>
                <span className="chip">{walletConnected ? 'Live' : 'Standby'}</span>
              </div>

              <div className="balance-box">
                <span className="muted-label">Portfolio value</span>
                <strong>12.48 ETH</strong>
                <small>+$846.20 today</small>
              </div>

              <div className="mini-graph" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="floating-card card-top">
              <span className="card-label">Featured drop</span>
              <h3>Nova Bloom</h3>
              <div className="price-row">
                <strong>2.4 ETH</strong>
                <span>+18.5%</span>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <div className="avatar-row">
                <span className="avatar">S</span>
                <div>
                  <strong>Sora Vale</strong>
                  <small>Collector</small>
                </div>
              </div>
              <p>The cleanest platform for discovering rare digital culture.</p>
            </div>
          </div>
        </section>

        <section className="stats-panel" aria-label="Marketplace performance stats">
          {stats.map((item) => (
            <div key={item.label} className="stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Featured collections</span>
              <h2>Fresh drops from leading creators</h2>
            </div>
            <Link to="/register" className="text-link">View all collections</Link>
          </div>

          <div className="collection-grid">
            {collections.map((item) => (
              <article key={item.name} className="collection-card">
                <div className={`collection-art ${item.tone}`} />
                <div className="collection-body">
                  <div className="meta-row">
                    <h3>{item.name}</h3>
                    <span className="trend">{item.change}</span>
                  </div>
                  <div className="meta-row muted">
                    <span>Floor</span>
                    <strong>{item.floor}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">Why collectors stay</span>
              <h2>The premium marketplace experience</h2>
            </div>
          </div>

          <div className="feature-grid">
            {features.map((item) => (
              <article key={item.title} className="feature-card">
                <div className="feature-icon">✦</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">Trending now</span>
              <h2>Most active listings</h2>
            </div>
          </div>

          <div className="nft-grid">
            {trendingItems.map((item) => (
              <article key={item.title} className="nft-card">
                <div className="nft-art" />
                <div className="nft-copy">
                  <div className="meta-row">
                    <span className="tag">{item.tag}</span>
                    <span className="price">{item.price}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>by {item.artist}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">Plans</span>
              <h2>Choose your level of access</h2>
            </div>
          </div>

          <div className="plans-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <span className="plan-badge">Most popular</span>}
                <h3>{plan.name}</h3>
                <div className="price-line">
                  <span>{plan.price}</span>
                  <small>/ month</small>
                </div>
                <p>{plan.description}</p>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <button type="button" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  Get started
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2>Everything you need to know</h2>
            </div>
          </div>

          <div className="faq-list">
            {faqItems.map((item) => (
              <div key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section cta-panel">
          <div className="cta-card">
            <div className="pricing-copy">
              <span className="eyebrow">Launch your collection</span>
              <h2>Turn your creativity into a trusted digital storefront.</h2>
              <p>
                Launch drops, create your own storefront, and grow an engaged community with
                premium marketplace tools and clear analytics.
              </p>
            </div>

            <div className="signup-panel">
              <div className="panel-header">
                <span className="pill">Join now</span>
                <h2>Create account</h2>
              </div>

              <RegisterForm compact />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span className="brand-name">Lattice</span>
          <small>Market</small>
        </div>
        <p>Luxury collectibles for the world of digital culture.</p>
      </footer>
    </div>
  );
}

function MarketplacePage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const visibleItems = marketplaceItems.filter((item) => {
    const categoryMatches = filter === 'All' || item.category === filter;
    const searchMatches = item.title.toLowerCase().includes(search.toLowerCase()) || item.artist.toLowerCase().includes(search.toLowerCase());
    return categoryMatches && searchMatches;
  });

  return (
    <div className="page-shell marketplace-page">
      <header className="topbar marketplace-topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <div>
            <span className="brand-name">Lattice</span>
            <small>Market</small>
          </div>
        </div>

        <nav className="nav-links" aria-label="Marketplace navigation">
          <Link to="/">Home</Link>
          <Link to="/marketplace" className="active-link">Marketplace</Link>
          <Link to="/register">Create</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </header>

      <main className="marketplace-main">
        <section className="marketplace-hero">
          <div>
            <span className="eyebrow">Live market</span>
            <h1>Discover premium digital culture.</h1>
          </div>
          <div className="market-sorter">
            <button type="button" className="sort-chip active">Trending</button>
            <button type="button" className="sort-chip">New</button>
            <button type="button" className="sort-chip">Most bid</button>
          </div>
        </section>

        <section className="marketplace-toolbar">
          <div className="filter-row" aria-label="Marketplace categories">
            {['All', 'Art', 'Photography', 'Generative', 'Utility'].map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-chip ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="search-box">
            <span>Search</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by artist or title" />
          </label>
        </section>

        <section className="marketplace-grid">
          {visibleItems.map((item) => (
            <article key={item.title} className="market-card">
              <div className={`market-art ${item.tone}`} />
              <div className="market-copy">
                <div className="meta-row">
                  <span className="tag">{item.tag}</span>
                  <span className="price">{item.price}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.artist}</p>
                <div className="market-actions">
                  <Link to={`/collection/${item.id}`} className="btn btn-secondary">View details</Link>
                  <button type="button" className="btn btn-primary">Place bid</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function CollectionDetailPage() {
  const { id } = useParams();
  const item = marketplaceItems.find((entry) => entry.id === id) || marketplaceItems[0];

  return (
    <div className="page-shell collect-page">
      <header className="topbar marketplace-topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <div>
            <span className="brand-name">Lattice</span>
            <small>Market</small>
          </div>
        </div>

        <nav className="nav-links" aria-label="Collection navigation">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="collection-layout">
        <div className="collection-visual">
          <div className={`collection-hero ${item.tone}`} />
        </div>

        <div className="collection-info">
          <span className="eyebrow">{item.category}</span>
          <h1>{item.title}</h1>
          <p className="collection-author">by {item.artist}</p>
          <p className="collection-description">{item.description}</p>

          <div className="collection-metrics">
            {Object.entries(item.metrics).map(([label, value]) => (
              <div key={label} className="metric-item">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="offer-box">
            <div className="offer-header">
              <span>Current bid</span>
              <strong>{item.price}</strong>
            </div>
            <div className="offer-actions">
              <input type="text" defaultValue="1.8 ETH" aria-label="Bid amount" />
              <button type="button" className="btn btn-primary">Bid now</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CreatorStudioPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Art',
    supply: '1000',
    price: '1.2 ETH',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="page-shell studio-page">
      <header className="topbar marketplace-topbar">
        <div className="brand-wrap">
          <div className="brand-mark">L</div>
          <div>
            <span className="brand-name">Lattice</span>
            <small>Market</small>
          </div>
        </div>

        <nav className="nav-links" aria-label="Studio navigation">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/studio" className="active-link">Studio</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="studio-shell">
        <section className="studio-hero">
          <div>
            <span className="eyebrow">Creator studio</span>
            <h1>Launch your next collection.</h1>
          </div>
          <Link to="/register" className="btn btn-primary">Open creator account</Link>
        </section>

        <section className="studio-grid">
          <div className="studio-panel">
            <div className="panel-header small-header">
              <h3>Performance</h3>
              <span className="chip">Live</span>
            </div>

            <div className="studio-stats">
              <div className="stat-card dashboard-stat-card">
                <strong>18.4K</strong>
                <span>Followers</span>
              </div>
              <div className="stat-card dashboard-stat-card">
                <strong>7.2 ETH</strong>
                <span>Primary sales</span>
              </div>
              <div className="stat-card dashboard-stat-card">
                <strong>91%</strong>
                <span>Retention</span>
              </div>
            </div>

            <div className="drop-list">
              {creatorDrops.map((drop) => (
                <div key={drop.title} className="drop-item">
                  <div>
                    <strong>{drop.title}</strong>
                    <p>{drop.status}</p>
                  </div>
                  <span>{drop.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="studio-panel form-panel">
            <div className="panel-header small-header">
              <h3>New drop</h3>
            </div>

            <form className="studio-form">
              <label>
                <span>Collection title</span>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Neon Bloom" />
              </label>

              <label>
                <span>Category</span>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option>Art</option>
                  <option>Photography</option>
                  <option>Generative</option>
                  <option>Utility</option>
                </select>
              </label>

              <div className="field-row two-up">
                <label>
                  <span>Supply</span>
                  <input name="supply" value={formData.supply} onChange={handleChange} />
                </label>
                <label>
                  <span>Starting price</span>
                  <input name="price" value={formData.price} onChange={handleChange} />
                </label>
              </div>

              <button type="button" className="btn btn-primary full-width">Mint collection</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function RegisterForm({ compact = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed.');
      }

      const user = data.user || {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
      };

      localStorage.setItem('marketplace_token', data.token || 'demo-token');
      localStorage.setItem('marketplace_user', JSON.stringify(user));
      setStatus({
        type: 'success',
        message: data.message || 'Account created successfully.',
      });
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
      navigate('/dashboard');
    } catch {
      const fallbackUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
      };

      localStorage.setItem('marketplace_user', JSON.stringify(fallbackUser));
      localStorage.setItem('marketplace_token', 'demo-token');
      setStatus({
        type: 'success',
        message: 'Demo account created locally. The backend is still offline, but the dashboard is ready.',
      });
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {!compact && <h2 className="form-title">Create account</h2>}

      <div className="field-row two-up">
        <label>
          <span>First name</span>
          <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
        </label>

        <label>
          <span>Last name</span>
          <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
        </label>
      </div>

      <label>
        <span>Username</span>
        <input name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Username" required />
      </label>

      <label>
        <span>Email</span>
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
      </label>

      <label>
        <span>Password</span>
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" required />
      </label>

      <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>

      {status.message && (
        <p className={`status-message ${status.type || 'success'}`} aria-live="polite">
          {status.message}
        </p>
      )}

      <p className="mini-copy">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const storedUser = getStoredUser();

    if (storedUser && storedUser.email === formData.email.trim().toLowerCase()) {
      localStorage.setItem('marketplace_token', 'demo-token');
      setStatus({ type: 'success', message: 'Signed in successfully.' });
      navigate('/dashboard');
      return;
    }

    const fallbackUser = {
      firstName: 'Collector',
      lastName: 'Member',
      username: 'collector',
      email: formData.email.trim().toLowerCase(),
    };

    localStorage.setItem('marketplace_user', JSON.stringify(fallbackUser));
    localStorage.setItem('marketplace_token', 'demo-token');
    setStatus({ type: 'success', message: 'Demo login successful.' });
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign into your account</h2>

        <form onSubmit={handleSubmit} className="signup-form auth-form">
          <label>
            <span>Email</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </label>

          <label>
            <span>Password</span>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
          </label>

          <button type="submit" className="btn btn-primary full-width">Sign in</button>

          {status.message && (
            <p className={`status-message ${status.type || 'success'}`}>{status.message}</p>
          )}
        </form>

        <p className="mini-copy">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [user] = useState(() => getStoredUser() || { firstName: 'Collector', lastName: 'Member', username: 'collector', email: 'demo@latticemarket.io' });

  const statsCards = useMemo(() => [
    { label: 'Portfolio value', value: '12.48 ETH' },
    { label: 'Active bids', value: '08' },
    { label: 'Collected', value: '27' },
    { label: 'Monthly gain', value: '+18.4%' },
  ], []);

  const recentActivity = [
    { title: 'Nova Bloom sold', detail: '2.4 ETH', time: '2h ago' },
    { title: 'Bid placed on Void Harbor', detail: '1.1 ETH', time: '4h ago' },
    { title: 'New collection watchlist', detail: '7 items', time: 'Today' },
  ];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-wrap dashboard-brand">
          <div className="brand-mark">L</div>
          <div>
            <span className="brand-name">Lattice</span>
            <small>Market</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="active">Overview</Link>
          <Link to="/dashboard">Collections</Link>
          <Link to="/dashboard">Portfolio</Link>
          <Link to="/dashboard">Activity</Link>
          <Link to="/dashboard">Settings</Link>
        </nav>

        <button
          type="button"
          className="btn btn-secondary signout"
          onClick={() => {
            localStorage.removeItem('marketplace_user');
            localStorage.removeItem('marketplace_token');
            window.location.href = '/';
          }}
        >
          Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow slim">Overview</p>
            <h1>Welcome back, {user.firstName}</h1>
          </div>
          <Link to="/" className="btn btn-ghost">Back to home</Link>
        </header>

        <section className="dash-stats">
          {statsCards.map((item) => (
            <div key={item.label} className="stat-card dashboard-stat-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="panel large-panel">
            <div className="panel-header small-header">
              <h3>Portfolio allocation</h3>
              <span className="chip">Live</span>
            </div>

            <div className="allocations">
              <div className="allocation-row">
                <span className="legend purple" />
                <span>Digital art</span>
                <strong>42%</strong>
              </div>
              <div className="allocation-row">
                <span className="legend teal" />
                <span>Collectibles</span>
                <strong>31%</strong>
              </div>
              <div className="allocation-row">
                <span className="legend gold" />
                <span>Utility NFTs</span>
                <strong>27%</strong>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header small-header">
              <h3>Account</h3>
            </div>
            <div className="account-card">
              <div className="avatar-large">{user.firstName?.[0] || 'C'}</div>
              <div>
                <strong>{user.firstName} {user.lastName}</strong>
                <p>@{user.username || 'collector'}</p>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel bottom-panel">
          <div className="panel-header small-header">
            <h3>Recent activity</h3>
          </div>

          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.title} className="activity-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/collection/:id" element={<CollectionDetailPage />} />
        <Route path="/studio" element={<CreatorStudioPage />} />
        <Route path="/register" element={<div className="auth-page"><RegisterForm /></div>} />
        <Route path="/login" element={<div className="auth-page"><LoginForm /></div>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
