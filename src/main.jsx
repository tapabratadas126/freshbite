import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, Star, X } from 'lucide-react';
import './styles.css';

const products = [
  {
    id: 1,
    title: 'Fresh Tomatoes',
    subtitle: 'Juicy, ripe tomatoes selected fresh from the farm.',
    price: 129,
    category: 'Fresh Picks',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 2,
    title: 'Fresh Carrots',
    subtitle: 'Sweet, crunchy carrots perfect for everyday meals.',
    price: 89,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 3,
    title: 'Garden Greens',
    subtitle: 'Fresh leafy greens packed with natural goodness.',
    price: 99,
    category: 'Greens',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 4,
    title: 'Fresh Vegetables',
    subtitle: 'A colorful selection of everyday vegetables.',
    price: 159,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1200&q=90'
  },
  {
    id: 5,
    title: 'Farm Harvest',
    subtitle: 'A vibrant mix of fresh seasonal produce.',
    price: 199,
    category: 'Fresh Picks',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=90'
  }
];

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Clients', to: '/clients' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contacts', to: '/contact' }
];

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('freshbite-cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('freshbite-cart', JSON.stringify(cart));
  }, [cart]);

  const add = (product) => setCart((items) => {
    const found = items.find((item) => item.id === product.id);
    if (found) return items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    return [...items, { ...product, qty: 1 }];
  });

  const updateQty = (id, delta) => setCart((items) => items.flatMap((item) => {
    if (item.id !== id) return [item];
    const qty = item.qty + delta;
    return qty > 0 ? [{ ...item, qty }] : [];
  }));

  const remove = (id) => setCart((items) => items.filter((item) => item.id !== id));
  const clear = () => setCart([]);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return <CartContext.Provider value={{ cart, add, updateQty, remove, clear, count, total }}>{children}</CartContext.Provider>;
}

function useCart() { return useContext(CartContext); }

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <CartProvider>
      <ScrollToTop />
      <Header onCart={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <QuickToast />
    </CartProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Header({ onCart }) {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { count } = useCart();

  const submitSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return navigate('/shop');
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="FreshBite home">
          <span className="brand-mark"><span></span><span></span><span></span></span>
          <span>FreshBite</span>
        </Link>

        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch}>
            <Search size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label="Search products" />
          </form>
          <button className="icon-btn cart-btn" onClick={onCart} aria-label="Open cart">
            <ShoppingBag size={17} />
            {count > 0 && <span className="badge-count">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Home() {
  const [slide, setSlide] = useState(0);
  const slides = [
    { kicker: 'Farm-fresh, made simple', title: 'Fresh choices for every meal', text: 'From crisp vegetables to everyday pantry favorites, build brighter meals in a few clicks.', cta: 'View More' },
    { kicker: 'Fast delivery, less hassle', title: 'Good food starts with good produce', text: 'Shop hand-picked produce and get your order packed for freshness from farm to doorstep.', cta: 'Shop Fresh' },
    { kicker: 'A greener everyday', title: 'Color on every plate', text: 'Discover a cheerful mix of fresh picks curated for family lunches, dinners and everything between.', cta: 'Explore Picks' }
  ];
  const current = slides[slide];

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <>
      <section className="hero">
        <div className="hero-left-art"><img src="/assets/hero-left.png" alt="" /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">{current.kicker}</div>
            <h1>{current.title}</h1>
            <p>{current.text}</p>
            <Link className="pill-btn light" to="/shop">{current.cta}</Link>
            <div className="hero-follow"><span>Follow us</span><i></i><div className="follow-circles"><a href="#social" aria-label="Instagram">IG</a><a href="#social" aria-label="Facebook">f</a></div></div>
          </div>
          <div className="hero-art">
            <div className="hero-arc"></div>
            <div className="promo-badge"><strong>UPTO</strong><span>30%</span><small>Off</small></div>
            <div className="delivery-card"><span className="mini-dot"></span><div><strong>Fast delivery</strong><small>Lorem ipsum is simply</small></div></div>
            <div className="review-badge"><div className="mini-avatars"><span></span><span></span></div><strong>230+</strong><small>happy customers</small></div>
            <div className="floating-avatar avatar-a"></div><div className="floating-avatar avatar-b"></div><div className="floating-avatar avatar-c"></div>
            <img
              className="hero-produce"
              src="https://images.pexels.com/photos/7879847/pexels-photo-7879847.jpeg?auto=compress&cs=tinysrgb&w=1800"
              alt="Woman holding a basket filled with fresh vegetables"
            />
          </div>
        </div>
        <div className="hero-controls container">
          <button className="hero-arrow" onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)} aria-label="Previous slide"><ArrowLeft size={16} /></button>
          <div className="hero-dots">
            {slides.map((_, i) => <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`}></button>)}
          </div>
          <button className="hero-arrow" onClick={() => setSlide((s) => (s + 1) % slides.length)} aria-label="Next slide"><ArrowRight size={16} /></button>
        </div>
      </section>

      <CategorySection />
      <TestimonialPreview />
      <FeatureStrip />
      <Newsletter />
    </>
  );
}

function CategorySection({ preview = true }) {
  const items = preview ? products : products;
  const { add } = useCart();
  const [toast, setToast] = useState(null);
  const show = (product) => { add(product); setToast(product.title); setTimeout(() => setToast(null), 1600); };
  return (
    <section className="section categories-section" id="categories">
      <div className="watermark">CATEGORIES</div>
      <div className="container section-inner">
        <div className="section-heading centered">
          <span>Simple shopping</span>
          <h2>Shop By Category</h2>
          <p>Fresh picks arranged around the foods you reach for most.</p>
        </div>
        <div className="product-grid">
          {items.map((product) => (
            <article className="product-card" key={product.id}>
              <Link to={`/shop?product=${product.id}`} className="product-img-wrap"><img src={product.image} alt={product.title} /></Link>
              <div className="product-info">
                <div className="product-meta"><span>{product.category}</span><strong>₹{product.price}</strong></div>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                <div className="stars" aria-label="5 star rating">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                <div className="card-actions">
                  <Link className="mini-btn green-outline" to={`/shop?product=${product.id}`}>Shop Now</Link>
                  <button className="mini-btn green" onClick={() => show(product)}>Add to Cart</button>
                </div>
                {toast === product.title && <div className="inline-toast"><Check size={13} /> Added</div>}
              </div>
            </article>
          ))}
        </div>
        <div className="center-actions"><Link className="pill-btn green" to="/shop">View all products</Link></div>
      </div>
    </section>
  );
}

function TestimonialPreview() {
  const [index, setIndex] = useState(0);
  const testimonials = [
    { name: 'Lisa Ray', role: 'Product Manager', text: 'The produce arrives bright, fresh and beautifully packed. Shopping feels simple again.', rating: 5 },
    { name: 'Aarav Mehta', role: 'Home Chef', text: 'I can build a full week of meals without hopping between five different stores.', rating: 5 },
    { name: 'Mia Singh', role: 'Parent & Creator', text: 'Fast delivery and a clear checkout flow make this one of my easiest weekly errands.', rating: 5 }
  ];
  const item = testimonials[index];
  return (
    <section className="section testimonial-section">
      <img className="decor decor-left" src="/assets/test-left.png" alt="" />
      <img className="decor decor-right" src="/assets/test-right.png" alt="" />
      <span className="accent-dot dot-yellow"></span><span className="accent-dot dot-orange"></span><span className="accent-dot dot-blue"></span><span className="accent-dot dot-green"></span>
      <div className="container">
        <div className="testimonial-card">
          <button className="testimonial-arrow left" onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial"><ArrowLeft size={16} /></button>
          <div className="testimonial-profile">
            <img src="/assets/client.jpg" alt={item.name} />
            <h4>{item.name}</h4><p>{item.role}</p><span className="profile-line"></span>
          </div>
          <div className="testimonial-content">
            <span className="quote-mark">“</span>
            <h2>WHat Our Clinet Saying</h2>
            <p>{item.text}</p>
            <div className="stars large">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div>
          </div>
          <button className="testimonial-arrow right" onClick={() => setIndex((index + 1) % testimonials.length)} aria-label="Next testimonial"><ArrowRight size={16} /></button>
          <span className="corner-shape shape-one"></span><span className="corner-shape shape-two"></span>
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const features = [
    ['Fresh daily', 'Produce selected for freshness and quality.'],
    ['Fast delivery', 'Easy scheduling for your weekly basket.'],
    ['Simple checkout', 'Save cart state and reorder with ease.']
  ];
  return <section className="feature-strip"><div className="container feature-grid">{features.map(([title, text]) => <div key={title} className="feature"><span className="feature-icon"><Check size={17} /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>;
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); if (!email || !email.includes('@')) return; setSent(true); setEmail(''); };
  return <section className="newsletter"><div className="container newsletter-inner"><div><span className="eyebrow">Fresh in your inbox</span><h2>Get weekly produce picks.</h2><p>Seasonal ideas, simple recipes and new arrivals—straight to your inbox.</p></div><form onSubmit={submit} className="newsletter-form"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" /><button className="pill-btn green" type="submit">{sent ? 'Subscribed' : 'Subscribe'}</button></form></div></section>;
}

function PageShell({ eyebrow, title, text, children }) {
  return <>
    <section className="inner-hero"><div className="container inner-hero-grid"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div><div className="inner-hero-art"><div className="inner-orb one"></div><div className="inner-orb two"></div><span className="inner-leaf">✦</span></div></div></section>
    {children}
  </>;
}

function About() {
  return <PageShell eyebrow="Our story" title="Fresh food, thoughtfully presented." text="FreshBite is a front-end grocery experience built around clarity, freshness and a cheerful visual rhythm.">
    <section className="section"><div className="container split-grid"><div className="story-panel"><span className="eyebrow">Why FreshBite</span><h2>A calmer way to shop for produce.</h2><p>From the original lime-green concept, we kept the most distinctive visual cues—rounded cards, floating badges, bold produce photography and lots of breathing room—then turned them into a working storefront.</p><p>The result is a responsive site with persistent cart state, search, routing, product browsing and polished micro-interactions.</p></div><div className="stats-card"><div><strong>30%</strong><span>promo-ready UI</span></div><div><strong>5</strong><span>featured picks</span></div><div><strong>24h</strong><span>demo delivery window</span></div></div></div></section>
    <FeatureStrip />
  </PageShell>;
}

function Testimonials() {
  const list = [
    { name: 'Lisa Ray', role: 'Product Manager', text: 'The produce arrives bright, fresh and beautifully packed. Shopping feels simple again.' },
    { name: 'Aarav Mehta', role: 'Home Chef', text: 'I can build a full week of meals without hopping between five different stores.' },
    { name: 'Mia Singh', role: 'Parent & Creator', text: 'Fast delivery and a clear checkout flow make this one of my easiest weekly errands.' },
    { name: 'Noah Das', role: 'Designer', text: 'The interface feels light, modern and incredibly easy to scan on a busy day.' }
  ];
  return <PageShell eyebrow="Customer voice" title="What people say about the experience." text="The testimonials page expands the single-card motif from the homepage into a complete, scrollable collection.">
    <section className="section"><div className="container testimonial-list">{list.map((item) => <article className="full-testimonial" key={item.name}><div className="quote-icon">“</div><p>{item.text}</p><div className="test-person"><img src="/assets/client.jpg" alt="" /><div><strong>{item.name}</strong><span>{item.role}</span></div></div><div className="stars large">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div></article>)}</div></section>
  </PageShell>;
}

function Clients() {
  const clients = ['GreenLeaf Kitchens', 'Daily Harvest Co.', 'Urban Pantry', 'Northside Cafe', 'Sprout Market', 'The Fresh Table'];
  return <PageShell eyebrow="Clients" title="Built to flex around real food brands." text="A partner-friendly page for showing the kinds of businesses, kitchens and communities that can use the storefront.">
    <section className="section"><div className="container"><div className="client-grid">{clients.map((client, i) => <div className="client-logo" key={client}><span className={`logo-dot l${i + 1}`}></span>{client}</div>)}</div><div className="client-banner"><div><span className="eyebrow">Partner with us</span><h2>Bring a brighter grocery experience to your audience.</h2></div><Link to="/contact" className="pill-btn green">Start a conversation</Link></div></div></section>
  </PageShell>;
}

function Pricing() {
  const plans = [
    { name: 'Starter', price: '₹0', desc: 'For trying the storefront experience.', items: ['5 featured products', 'Basic search', 'Cart persistence'] },
    { name: 'Fresh', price: '₹499', desc: 'For a richer branded shopping flow.', items: ['Unlimited product cards', 'Advanced filtering', 'Priority support'] },
    { name: 'Market', price: '₹999', desc: 'For growing grocery catalogs.', items: ['Custom landing sections', 'Client/partner pages', 'Enhanced merchandising'] }
  ];
  return <PageShell eyebrow="Pricing" title="Simple plans for a simple store." text="The pricing page is designed to match the rounded, airy visual language of the mockup while giving the navigation a useful destination.">
    <section className="section"><div className="container pricing-grid">{plans.map((plan) => <article className={`plan ${plan.name === 'Fresh' ? 'featured' : ''}`} key={plan.name}>{plan.name === 'Fresh' && <span className="plan-pill">Popular</span>}<h2>{plan.name}</h2><p>{plan.desc}</p><strong>{plan.price}<small>/month</small></strong><ul>{plan.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><Link to="/contact" className={plan.name === 'Fresh' ? 'pill-btn green' : 'pill-btn outline'}>Choose {plan.name}</Link></article>)}</div></section>
  </PageShell>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return <PageShell eyebrow="Contacts" title="Let’s make something fresh." text="Use this working demo form to test the contact flow and form feedback without needing a backend.">
    <section className="section"><div className="container contact-grid"><div className="contact-card"><span className="eyebrow">Talk to the team</span><h2>Have a question?</h2><p>Ask about partnerships, product catalogs or the storefront concept.</p><div className="contact-points"><span>hello@freshbite.demo</span><span>+91 90000 00000</span><span>Mon–Sat · 9:00–18:00</span></div></div><form className="contact-form" onSubmit={submit}><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><label>Subject<input required placeholder="How can we help?" /></label><label>Message<textarea required rows="5" placeholder="Tell us a little more..."></textarea></label><button className="pill-btn green" type="submit">{sent ? 'Message sent ✓' : 'Send message'}</button>{sent && <p className="form-success">Thanks — your demo message has been captured.</p>}</form></div></section>
  </PageShell>;
}

function Shop() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const { add } = useCart();
  const [active, setActive] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setQuery(q);
  }, [location.search]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => `${p.title} ${p.category} ${p.subtitle}`.toLowerCase().includes(query.toLowerCase()));
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [query, category, sort]);

  return <PageShell eyebrow="Explore the basket" title="Shop fresh picks." text="Search, filter and add items to the same cart used throughout the site.">
    <section className="section shop-section"><div className="container">
      <div className="shop-toolbar"><div className="shop-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search produce..." /></div><div className="filter-row"><select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option><option>Fresh Picks</option><option>Vegetables</option><option>Greens</option></select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="default">Sort</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></div>
      {filtered.length ? <div className="product-grid full">{filtered.map((product) => <article className="product-card" key={product.id}><button className="wishlist"><Heart size={16} /></button><button className="product-img-wrap clickable" onClick={() => setActive(product)}><img src={product.image} alt={product.title} /></button><div className="product-info"><div className="product-meta"><span>{product.category}</span><strong>₹{product.price}</strong></div><h3>{product.title}</h3><p>{product.subtitle}</p><div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div><div className="card-actions"><button className="mini-btn green-outline" onClick={() => setActive(product)}>Quick View</button><button className="mini-btn green" onClick={() => add(product)}>Add to Cart</button></div></div></article>)}</div> : <div className="empty-state"><h2>No fresh picks found.</h2><p>Try a different search term or category.</p></div>}
    </div></section>
    {active && <ProductModal product={active} onClose={() => setActive(null)} />}
  </PageShell>;
}

function ProductModal({ product, onClose }) {
  const { add } = useCart();
  return <div className="modal-backdrop" onClick={onClose}><div className="product-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><img src={product.image} alt={product.title} /><div><span className="eyebrow">{product.category}</span><h2>{product.title}</h2><p>{product.subtitle} Packed with care and ready for your weekly basket.</p><div className="price-large">₹{product.price}</div><button className="pill-btn green" onClick={() => { add(product); onClose(); }}>Add to cart</button></div></div></div>;
}

function CartDrawer({ open, onClose }) {
  const { cart, updateQty, remove, total, clear } = useCart();
  return <div className={`drawer-backdrop ${open ? 'show' : ''}`} onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Your basket</span><h2>Cart</h2></div><button className="modal-close" onClick={onClose}><X size={18} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-row" key={item.id}><img src={item.image} alt="" /><div className="cart-row-main"><strong>{item.title}</strong><span>₹{item.price}</span><div className="qty"><button onClick={() => updateQty(item.id, -1)}><Minus size={13} /></button><b>{item.qty}</b><button onClick={() => updateQty(item.id, 1)}><Plus size={13} /></button></div></div><button className="remove-link" onClick={() => remove(item.id)}>Remove</button></div>)}</div><div className="drawer-total"><div><span>Total</span><strong>₹{total}</strong></div><button className="pill-btn green" onClick={() => window.alert('Checkout demo — connect your payment API here.')}>Checkout</button><button className="clear-link" onClick={clear}>Clear cart</button></div></> : <div className="empty-cart"><ShoppingBag size={30} /><h3>Your basket is empty</h3><p>Add a few fresh picks and they will stay here while you browse.</p></div>}</aside></div>;
}

function Footer() {
  return <footer className="footer" id="social"><div className="container footer-grid"><div><Link to="/" className="brand footer-brand"><span className="brand-mark"><span></span><span></span><span></span></span><span>FreshBite</span></Link><p>A cheerful grocery storefront inspired by the provided UI mockup.</p><div className="socials"><a href="#social" aria-label="Instagram">IG</a><a href="#social" aria-label="Facebook">f</a><a href="#social" aria-label="Twitter">X</a><a href="#social" aria-label="YouTube">YT</a></div></div><div><h4>Explore</h4><Link to="/shop">Shop</Link><Link to="/about">About us</Link><Link to="/testimonials">Testimonials</Link></div><div><h4>Business</h4><Link to="/clients">Clients</Link><Link to="/pricing">Pricing</Link><Link to="/contact">Contacts</Link></div><div><h4>Need help?</h4><a href="mailto:hello@freshbite.demo">hello@freshbite.demo</a><a href="tel:+919000000000">+91 90000 00000</a></div></div><div className="container footer-bottom"><span>© 2026 FreshBite demo</span><span>Designed from the provided green grocery UI reference.</span></div></footer>;
}

function QuickToast() { return null; }
function NotFound() { return <PageShell eyebrow="404" title="That page is not on the shelf." text="Use the navigation above or jump back to the storefront."><section className="section"><div className="container centered-block"><Link to="/" className="pill-btn green">Back home</Link></div></section></PageShell>; }

ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
