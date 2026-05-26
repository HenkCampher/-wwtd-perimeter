import React from "react";
import { useEffect } from "react";

export default function Landing() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LHQV3B1XZM';
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-LHQV3B1XZM');
  }, []);
  

  return (
    <div style={{ background: "#080810", color: "#e8e8e8", fontFamily: "'Lora', Georgia, serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 20px rgba(168,224,99,0.2)} 50%{box-shadow:0 0 40px rgba(168,224,99,0.5)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        ::selection { background: #a8e06344; }
        @media (max-width: 768px) {
          .book-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .book-cover { max-width: 280px !important; margin: 0 auto !important; }
          .nav-links { display: none !important; }
          .hero-section { padding: 100px 20px 60px !important; }
          .book-section { padding: 60px 20px !important; }
          .tool-section { padding: 60px 20px !important; }
          .signup-section { padding: 60px 20px !important; }
          .about-section { padding: 60px 20px !important; }
          .tool-iframe { height: 600px !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
          .hero-buttons a { width: 100% !important; text-align: center !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, #080810ee, transparent)" }}>
        <a href="#top" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: "#a8e063", textDecoration: "none" }}>WWTD</a>
        <div className="nav-links" style={{ display: "flex", gap: 32, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#777" }}>
          <a href="#book" style={{ cursor: "pointer" }}>The Book</a>
          <a href="#about" style={{ cursor: "pointer" }}>About</a>
          <a href="#signup" style={{ cursor: "pointer" }}>Stay in the Loop</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(168,224,99,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ animation: "fadeIn 0.8s ease both" }}>
          
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(64px, 12vw, 140px)", letterSpacing: 4, lineHeight: 0.9, marginBottom: 32, background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            What Would<br />Tequila Do
          </h1>
          <div style={{ width: 60, height: 2, background: "#a8e063", margin: "0 auto 32px", opacity: 0.5 }} />
          <p style={{ fontSize: "clamp(18px, 3vw, 26px)", color: "#ccc", maxWidth: 640, margin: "0 auto 16px", lineHeight: 1.5, fontWeight: 400, fontStyle: "italic" }}>
            You started out weird. What happened?
          </p>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#aaa", maxWidth: 560, margin: "0 auto 12px", lineHeight: 1.4, fontStyle: "italic" }}>The Playbook For Thriving Despite Corporate Bullshit. 52 Shots. No Filler.</p>
          <p style={{ fontSize: 14, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 48 }}>By Henk Campher</p>
          <div className="hero-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.amazon.com/dp/B0H27KBQ52" target="_blank" rel="noopener noreferrer" style={{ padding: "16px 40px", background: "#a8e063", color: "#080810", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, borderRadius: 6, cursor: "pointer", animation: "pulse 3s ease-in-out infinite" }}>Pre-Order the Ebook</a>
            <a href="#book" style={{ padding: "16px 40px", background: "transparent", border: "1px solid #2a2a40", color: "#777", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, borderRadius: 6, cursor: "pointer" }}>Paperback — June 16</a>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", color: "#666", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>↓</div>
      </section>

      {/* Book Section */}
      <section id="book" className="book-section" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="book-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          
          {/* Book cover */}
          <div style={{ position: "relative" }}>
            <img src="/book-cover.png" alt="What Would Tequila Do book cover" style={{ width: "100%", borderRadius: 8, boxShadow: "0 0 80px rgba(168,224,99,0.1), -8px 8px 0 #a8e06322", display: "block" }} />
          </div>

          {/* Premise */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>The Book</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 2, color: "#fff", marginBottom: 32, lineHeight: 1 }}>You started out weird.<br />What happened?</h2>
            <div style={{ color: "#aaa", fontSize: 17, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 20 }}>
              <p>You had opinions. You pushed back. You tried things that hadn't been approved yet. Then the job happened. The reviews, the guardrails, the polite corrections. The endless meetings about alignment. The brand guidelines someone called creativity.</p>
              <p>And somewhere along the way you started writing "I hope this email finds you well."</p>
              <p style={{ color: "#ddd", fontStyle: "italic" }}>This book is for the people who are done with that.</p>
              <p>52 chapters. Any order. No framework. No fluff. Just the things most people know but have been trained not to say out loud. Pick one. Read it. Then go do something that would have made you nervous two years ago.</p>
            </div>
            <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="https://www.amazon.com/dp/B0H27KBQ52" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "14px 32px", background: "#a8e063", color: "#080810", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 6 }}>Pre-Order the Ebook</a>
              <a href="#signup" style={{ display: "inline-block", padding: "14px 32px", background: "transparent", border: "1px solid #2a2a40", color: "#777", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 6 }}>Paperback — June 16</a>
            </div>
          </div>
        </div>
      </section>



      {/* Email Signup */}
      <section id="signup" className="signup-section" style={{ padding: "80px 24px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>Stay in the Loop</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: 3, color: "#fff", marginBottom: 24, lineHeight: 1 }}>Stay in<br />the Loop</h2>
        <p style={{ color: "#aaa", fontSize: 17, lineHeight: 1.8, marginBottom: 48 }}>The ebook is ready. The paperback lands June 16. Drop your email and we'll let you know the moment you can hold it.</p>
        <div style={{ background: "#0f0f1e", border: "1px solid #1e1e35", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 60px rgba(168,224,99,0.06)", height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", marginTop: -120, overflow: "hidden" }}>
            <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
            <iframe src="https://subscribe-forms.beehiiv.com/a725fe51-a599-4b2b-8c42-9fa12878abd9" className="beehiiv-embed" data-test-id="beehiiv-embed" frameBorder="0" scrolling="no" style={{ width: "100%", height: 291, border: "none", background: "transparent", maxWidth: "100%", display: "block" }} title="Newsletter signup" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about-section" style={{ padding: "80px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>About the Author</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: 3, color: "#fff", marginBottom: 24, lineHeight: 1 }}>Henk Campher</h2>
          <div style={{ color: "#aaa", fontSize: 17, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>Henk Campher has spent twenty years being the person in the room who says the thing nobody else will. Salesforce. Hootsuite. Starbucks. Levi's. Arist. Thinkific. Deep Origin. Billion-dollar machines and scrappy startups. B2B and B2C. Tech, consumer, and industries that hadn't figured out what they were yet. The common thread: marketing that actually moves things instead of just measuring them.</p>
            <p>Three rules govern all of it: have fun, don't be an a**hole, and what would tequila do. This book is the third one applied to everything else.</p>
            <p>He wrote it because he got tired of watching smart people hide behind process, consensus, and the kind of busyness that feels productive and changes nothing. Someone had to say it. Might as well be him.</p>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
            <a href="https://www.linkedin.com/in/henkcampher/" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", border: "1px solid #a8e063", borderRadius: 6, color: "#a8e063", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>LinkedIn</a>
            <a href="https://substack.com/@henkcampher" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", border: "1px solid #a8e063", borderRadius: 6, color: "#a8e063", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Substack</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px 24px", borderTop: "1px solid #1e1e35", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 4, marginBottom: 16, background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>What Would Tequila Do</div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24 }}>
          <a href="https://www.linkedin.com/in/henkcampher/" target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>LinkedIn</a>
          <a href="https://substack.com/@henkcampher" target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Substack</a>
          <a href="https://wwtd-tool.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>The Tool</a>
        </div>
        <div style={{ color: "#666", fontSize: 12 }}>© 2026 Henk Campher. Have fun. Don't be an a**hole.</div>
      </footer>

    </div>
  );
}
