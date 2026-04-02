import { useState } from "react";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, #080810ee, transparent)" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: "#a8e063" }}>WWTD</div>
        <div style={{ display: "flex", gap: 32, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#777" }}>
          <a href="#book" style={{ cursor: "pointer" }}>The Book</a>
          <a href="#tool" style={{ cursor: "pointer" }}>The Tool</a>
          <a href="#about" style={{ cursor: "pointer" }}>About</a>
          <a href="#signup" style={{ cursor: "pointer" }}>Stay in the Loop</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(168,224,99,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ animation: "fadeIn 0.8s ease both" }}>
          <div style={{ fontSize: 12, letterSpacing: 6, color: "#888", textTransform: "uppercase", marginBottom: 24, fontStyle: "italic" }}>Coming Soon</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(64px, 12vw, 140px)", letterSpacing: 4, lineHeight: 0.9, marginBottom: 32, background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            What Would<br />Tequila Do
          </h1>
          <div style={{ width: 60, height: 2, background: "#a8e063", margin: "0 auto 32px", opacity: 0.5 }} />
          <p style={{ fontSize: "clamp(18px, 3vw, 26px)", color: "#ccc", maxWidth: 640, margin: "0 auto 16px", lineHeight: 1.5, fontWeight: 400 }}>
            Work is broken. We all know it.<br />Nobody says it out loud.<br /><strong style={{ color: "#fff" }}>This book does.</strong>
          </p>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#aaa", maxWidth: 560, margin: "0 auto 12px", lineHeight: 1.4, fontStyle: "italic" }}>52 Hard Truths For Better Decisions And Less Bullshit</p>
          <p style={{ fontSize: 14, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 48 }}>By Henk Campher</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#signup" style={{ padding: "16px 40px", background: "#a8e063", color: "#080810", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, borderRadius: 6, cursor: "pointer", animation: "pulse 3s ease-in-out infinite" }}>Get Notified at Launch</a>
            <a href="#tool" style={{ padding: "16px 40px", background: "transparent", border: "1px solid #2a2a40", color: "#777", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, borderRadius: 6, cursor: "pointer" }}>Try the Tool</a>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", color: "#666", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>↓</div>
      </section>

      {/* Book Section */}
      <section id="book" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          
          {/* Book cover placeholder */}
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "2/3", background: "#0f0f1e", border: "1px solid #1e1e35", borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 32px", boxShadow: "0 0 80px rgba(168,224,99,0.1), -8px 8px 0 #a8e06322" }}>
              <div>
                <div style={{ width: 40, height: 2, background: "#a8e063", marginBottom: 24 }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 2, lineHeight: 1, color: "#fff", marginBottom: 16 }}>What Would<br />Tequila Do</div>
                <div style={{ width: 40, height: 2, background: "#a8e063", marginBottom: 24 }} />
                <div style={{ fontSize: 13, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Work is broken.<br />This book says it out loud.</div>
              <div style={{ marginTop: 16, fontSize: 11, color: "#777", fontStyle: "italic", lineHeight: 1.5 }}>52 Hard Truths For Better Decisions And Less Bullshit</div>
              </div>
              <div>
                <div style={{ fontSize: 24, marginBottom: 12 }}>🍹</div>
                <div style={{ fontSize: 13, color: "#777", letterSpacing: 1 }}>Henk Campher</div>
                <div style={{ fontSize: 11, color: "#777", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Premise */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>The Book</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 2, color: "#fff", marginBottom: 32, lineHeight: 1 }}>Work is not complicated.<br />We just make it that way.</h2>
            <div style={{ color: "#aaa", fontSize: 17, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 20 }}>
              <p>Most of what slows things down, whether you're running a company or just trying to survive inside one, isn't a lack of talent or effort. It's noise. Too many priorities. Too many opinions. Too much time spent talking about work instead of doing it. Companies hide behind process. Individuals hide behind busyness. Everyone convinces themselves they're being strategic when they're actually avoiding the real problem. The result is the same on both sides. Busy teams. Frustrated people. Work that looks fine and changes nothing.</p>
              <p>This book exists to cut through that. Not with frameworks or corporate playbooks. With clarity. Fifty-two short chapters, each built around a simple idea you probably already know but aren't consistently acting on. Things that apply whether you're setting direction or just trying to survive the week.</p>
              <p style={{ color: "#ddd", fontStyle: "italic" }}>If that sounds uncomfortable, good.</p>
              <p>The gap between knowing and doing is where most companies stall and most careers drift. This book is meant to close that gap. Read it in order or don't. Jump to the problem that's costing you time, energy, or momentum. Fix that. Move to the next one. No fluff. No theory. Just sharper thinking and better decisions.</p>
            </div>
            <div style={{ marginTop: 40 }}>
              <a href="#signup" style={{ display: "inline-block", padding: "14px 32px", background: "#a8e063", color: "#080810", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 6 }}>Get Notified at Launch</a>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" style={{ padding: "120px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>Try It Now</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: 3, color: "#fff", marginBottom: 16, lineHeight: 1 }}>The Peri-Ometer</h2>
          <p style={{ color: "#777", fontSize: 16, marginBottom: 48, letterSpacing: 1 }}>An Edge Engine Tool From What Would Tequila Do</p>
          <p style={{ color: "#aaa", fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: "0 auto 48px" }}>Paste your copy. Pick your spice level. Watch bland become bold. The tool behind the book, live and free to use.</p>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #1e1e35", boxShadow: "0 0 80px rgba(168,224,99,0.08)" }}>
            <iframe src="https://wwtd-tool.vercel.app" style={{ width: "100%", height: 800, border: "none", display: "block" }} title="What Would Tequila Do Peri-Ometer" />
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section id="signup" style={{ padding: "80px 24px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>Stay in the Loop</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: 3, color: "#fff", marginBottom: 24, lineHeight: 1 }}>Get Notified<br />at Launch</h2>
        <p style={{ color: "#aaa", fontSize: 17, lineHeight: 1.8, marginBottom: 48 }}>No noise. No newsletters that read like press releases. Just a heads up when the book drops and occasional sharp thinking on work, marketing, and what tequila would do.</p>
        <div style={{ background: "#0f0f1e", border: "1px solid #1e1e35", borderRadius: 12, padding: "24px", boxShadow: "0 0 60px rgba(168,224,99,0.06)", overflow: "hidden" }}>
          <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
          <iframe src="https://subscribe-forms.beehiiv.com/a725fe51-a599-4b2b-8c42-9fa12878abd9" className="beehiiv-embed" data-test-id="beehiiv-embed" frameBorder="0" scrolling="no" style={{ width: "100%", height: 291, border: "none", background: "transparent", maxWidth: "100%" }} title="Newsletter signup" />
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "80px 24px", background: "#0a0a18" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#a8e063", textTransform: "uppercase", marginBottom: 20 }}>About the Author</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: 3, color: "#fff", marginBottom: 48, lineHeight: 1 }}>Henk Campher</h2>
          <div style={{ color: "#aaa", fontSize: 17, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>Henk Campher has spent twenty years being the person in the room who says the thing nobody else will. Salesforce. Hootsuite. Starbucks. Levi's. Arist. Thinkific. Deep Origin. Billion-dollar machines and scrappy startups. B2B and B2C. Tech, consumer, and industries that hadn't figured out what they were yet. The common thread: marketing that actually moves things instead of just measuring them.</p>
            <p>Three rules govern all of it: have fun, don't be an a**hole, and what would tequila do. This book is the third one applied to everything else.</p>
            <p>He wrote it because he got tired of watching smart people hide behind process, consensus, and the kind of busyness that feels productive and changes nothing. Someone had to say it. Might as well be him.</p>
          </div>
          <div style={{ marginTop: 48, display: "flex", gap: 16 }}>
            <a href="https://www.linkedin.com/in/henkcampher/" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", border: "1px solid #2a2a40", borderRadius: 6, color: "#777", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>LinkedIn</a>
            <a href="https://substack.com/@henkcampher" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", border: "1px solid #2a2a40", borderRadius: 6, color: "#777", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Substack</a>
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
