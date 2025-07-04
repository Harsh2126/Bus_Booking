import Link from 'next/link';

const features = [
  { icon: '🚌', title: 'Easy Booking', desc: 'Book your bus tickets in just a few clicks.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Your transactions are safe and encrypted.' },
  { icon: '⏱️', title: 'Real-time Tracking', desc: 'Track your bus in real time from your phone.' },
  { icon: '📞', title: '24/7 Support', desc: 'We are here to help you anytime, anywhere.' },
];

const testimonials = [
  { name: 'Amit S.', text: 'Best bus booking experience ever! Super easy and fast.' },
  { name: 'Priya K.', text: 'I love the real-time tracking and secure payments.' },
  { name: 'Rahul M.', text: 'Customer support is fantastic. Highly recommend!' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1021 0%, #1a174d 100%)', fontFamily: 'Inter, sans-serif', color: '#fff', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px 0 48px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/">
            {/* Removed logo image */}
          </Link>
          <span style={{ fontWeight: 700, fontSize: '1.3rem', letterSpacing: '1px', marginLeft: 8 }}>Smartify</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#hero" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', opacity: 0.92 }}>Home</a>
          <a href="#features" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', opacity: 0.92 }}>Features</a>
          <a href="#about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', opacity: 0.92 }}>About</a>
          <a href="#contact" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', opacity: 0.92 }}>Contact</a>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/signup" style={{ padding: '10px 28px', borderRadius: '24px', border: '2px solid #fff', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', transition: 'background 0.2s, color 0.2s, box-shadow 0.2s' }}>Sign Up</Link>
          <Link href="/login" style={{ padding: '10px 28px', borderRadius: '24px', border: '2px solid #fff', background: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(0,0,0,0.13)', transition: 'background 0.2s, color 0.2s, box-shadow 0.2s' }}>Login</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section id="hero" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '64px 0 32px 0', gap: 64, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 440, textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.7rem', fontWeight: 800, marginBottom: 18, color: '#fff', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
            Welcome to Smartify Bus Booking
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#ffeaea', marginBottom: 32, textShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            Book your bus tickets easily, quickly, and securely. Enjoy a smarter way to travel!
          </p>
          <a href="#features" style={{ padding: '14px 40px', borderRadius: '28px', background: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', color: '#fff', fontWeight: 700, fontSize: '1.15rem', textDecoration: 'none', boxShadow: '0 4px 18px rgba(255,94,98,0.13)', transition: 'background 0.2s, color 0.2s' }}>Get Started</a>
        </div>
        <div style={{ minWidth: 220, textAlign: 'center' }}>
          {/* Removed logo image */}
        </div>
      </section>
      {/* Features Section */}
      <section id="features" style={{ padding: '48px 0', background: 'rgba(255,255,255,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 36, color: '#fff' }}>Features</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 20, padding: '32px 28px', minWidth: 200, maxWidth: 240, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', margin: 8 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#ffeaea', fontSize: '1rem' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '48px 0', background: 'rgba(255,255,255,0.01)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 36, color: '#fff' }}>What Our Users Say</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 20, padding: '32px 28px', minWidth: 220, maxWidth: 320, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', margin: 8 }}>
              <div style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: 12, color: '#ffeaea' }}>&quot;{t.text}&quot;</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>- {t.name}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Call-to-Action Section */}
      <section style={{ padding: '48px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, color: '#fff' }}>Ready to Book Your Next Journey?</h2>
        <Link href="/signup" style={{ padding: '16px 48px', borderRadius: '32px', background: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', color: '#fff', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none', boxShadow: '0 4px 18px rgba(255,94,98,0.13)', transition: 'background 0.2s, color 0.2s' }}>Sign Up Now</Link>
      </section>
      {/* Footer */}
      <footer id="contact" style={{ background: 'rgba(0,0,0,0.18)', padding: '32px 0', textAlign: 'center', color: '#ffeaea', fontSize: '1rem', letterSpacing: '0.5px' }}>
        <div style={{ marginBottom: 12 }}>
          <a href="#about" style={{ color: '#ffeaea', margin: '0 16px', textDecoration: 'none' }}>About</a>
          <a href="#features" style={{ color: '#ffeaea', margin: '0 16px', textDecoration: 'none' }}>Features</a>
          <a href="#contact" style={{ color: '#ffeaea', margin: '0 16px', textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ marginBottom: 8 }}>
          &copy; {new Date().getFullYear()} Smartify Bus Booking. All rights reserved.
        </div>
        <div>
          <a href="#" style={{ color: '#ffeaea', margin: '0 8px', textDecoration: 'none', fontSize: '1.2rem' }}>🌐</a>
          <a href="#" style={{ color: '#ffeaea', margin: '0 8px', textDecoration: 'none', fontSize: '1.2rem' }}>🐦</a>
          <a href="#" style={{ color: '#ffeaea', margin: '0 8px', textDecoration: 'none', fontSize: '1.2rem' }}>📘</a>
        </div>
      </footer>
    </div>
  );
}
