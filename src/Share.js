import { useState, useEffect } from "react";

const ALL_LEVELS = [
  { value: 1, label: "Hello There", color: "#a8e063", emoji: "👀" },
  { value: 2, label: "Say What Now", color: "#f9c74f", emoji: "🤨" },
  { value: 3, label: "Oh That's Dangerous", color: "#f8961e", emoji: "😏" },
  { value: 4, label: "Someone Call Security", color: "#f3722c", emoji: "🚨" },
  { value: 5, label: "I'm Not Okay", color: "#e63946", emoji: "😵" },
  { value: 6, label: "What Would Tequila Do", color: "#f5a623", emoji: "🥃" },
];

export default function Share() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split("/share/")[1];
    if (!id) { setError(true); return; }
    fetch(`/api/getshare?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(true); else setData(d); })
      .catch(() => setError(true));
  }, []);

  const level = data ? ALL_LEVELS.find(l => l.value === data.level) || ALL_LEVELS[0] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e8e8", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#777", textTransform: "uppercase", marginBottom: 10, fontStyle: "italic" }}>A rewrite from</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 3, margin: "0 0 10px", background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            What Would Tequila Do
          </h1>
        </div>

        {!data && !error && (
          <div style={{ textAlign: "center", color: "#777", fontStyle: "italic" }}>Loading...</div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#e63946", fontStyle: "italic" }}>This share link has expired or doesn't exist.</div>
        )}

        {data && level && (
          <>
            <div style={{ background: "#0f0f1e", border: `1px solid ${level.color}55`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 40px ${level.color}33`, marginBottom: 24 }}>
              <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${level.color}22`, background: `linear-gradient(135deg,${level.color}10,transparent)` }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: `${level.color}99`, textTransform: "uppercase", marginBottom: 6 }}>Rewritten at</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{level.emoji}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: level.color, fontSize: 32, letterSpacing: 2 }}>{level.label}</span>
                </div>
                {data.format && <div style={{ marginTop: 8, fontSize: 12, letterSpacing: 2, color: "#777", textTransform: "uppercase" }}>Format: {data.format}</div>}
              </div>
              <div style={{ padding: "28px" }}>
                <p style={{ color: "#f0f0f0", fontSize: 17, lineHeight: 1.9, margin: "0 0 24px", whiteSpace: "pre-wrap" }}>{data.output}</p>
                {data.input && (
                  <div style={{ borderTop: `1px solid ${level.color}22`, paddingTop: 20 }}>
                    <div style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Original</div>
                    <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{data.input}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <a href="/" style={{ display: "inline-block", padding: "16px 32px", background: "linear-gradient(135deg, #f5a623, #e63946)", borderRadius: 8, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, textDecoration: "none" }}>
                Try It Yourself 🥃
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
