import { useState, useEffect } from "react";

const ALL_LEVELS = [
  { value: 1, label: "Hello There", color: "#a8e063", emoji: "👀" },
  { value: 2, label: "Say What Now", color: "#f9c74f", emoji: "🤨" },
  { value: 3, label: "Oh That's Dangerous", color: "#f8961e", emoji: "😏" },
  { value: 4, label: "Someone Call Security", color: "#f3722c", emoji: "🚨" },
  { value: 5, label: "I'm Not Okay", color: "#e63946", emoji: "😵" },
  { value: 6, label: "What Would Tequila Do", color: "#f5a623", emoji: "🥃" },
];

function renderOutput(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (line.match(/^---+$/)) return <hr key={i} style={{ border: "none", borderTop: "1px solid #333", margin: "12px 0" }} />;
    const parts = [];
    let remaining = line;
    let j = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*(.*)/s);
      const italicMatch = remaining.match(/^(.*?)\*([^*]+)\*(.*)/s);
      if (boldMatch && (!italicMatch || boldMatch[1].length <= italicMatch[1].length)) {
        if (boldMatch[1]) parts.push(boldMatch[1]);
        parts.push(<strong key={j++} style={{ color: "#fff", fontWeight: "bold" }}>{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
      } else if (italicMatch) {
        if (italicMatch[1]) parts.push(italicMatch[1]);
        parts.push(<em key={j++}>{italicMatch[2]}</em>);
        remaining = italicMatch[3];
      } else {
        parts.push(remaining);
        break;
      }
    }
    return <span key={i}>{parts}<br /></span>;
  });
}

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
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} } @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#555", textTransform: "uppercase", marginBottom: 12, fontStyle: "italic" }}>This copy got the treatment.</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 3, margin: "0 0 12px", lineHeight: 1, background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            What Would Tequila Do
          </h1>
          <div style={{ color: "#555", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Cut through the bland</div>
        </div>

        {!data && !error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ color: "#555", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", fontStyle: "italic", marginBottom: 16 }}>Loading...</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>😵</div>
            <div style={{ color: "#e63946", fontSize: 16, marginBottom: 8 }}>This link has expired or doesn't exist.</div>
            <div style={{ color: "#555", fontSize: 14, fontStyle: "italic" }}>Go make your own.</div>
          </div>
        )}

        {data && level && (
          <>
            <div style={{ background: "#0f0f1e", border: `1px solid ${level.color}55`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 60px ${level.color}22`, marginBottom: 32, animation: "fadeIn 0.4s" }}>
              <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${level.color}22`, background: `linear-gradient(135deg,${level.color}10,transparent)` }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: `${level.color}99`, textTransform: "uppercase", marginBottom: 8 }}>Rewritten at</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 32 }}>{level.emoji}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: level.color, fontSize: 32, letterSpacing: 2, textShadow: `0 0 20px ${level.color}55` }}>{level.label}</span>
                  </div>
                  {data.format && (
                    <div style={{ fontSize: 11, letterSpacing: 2, color: "#555", textTransform: "uppercase", border: "1px solid #1e1e35", borderRadius: 4, padding: "4px 10px" }}>{data.format}</div>
                  )}
                </div>
              </div>
              <div style={{ padding: "28px" }}>
                <p style={{ color: level.value === 6 ? "#f0d090" : "#f0f0f0", fontSize: level.value === 6 ? 19 : 17, lineHeight: level.value === 6 ? 2.1 : 1.9, margin: "0 0 24px", fontStyle: level.value === 6 ? "italic" : "normal" }}>{renderOutput(data.output)}</p>
                {data.input && (
                  <div style={{ borderTop: `1px solid ${level.color}22`, paddingTop: 20 }}>
                    <div style={{ fontSize: 11, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 8 }}>The bland original</div>
                    <p style={{ color: "#444", fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{data.input}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "8px 0 48px" }}>
              <div style={{ color: "#555", fontSize: 14, fontStyle: "italic", marginBottom: 20 }}>Your copy could look like this.</div>
              <a href="/" style={{ display: "inline-block", padding: "18px 40px", background: "linear-gradient(135deg, #f5a623, #e63946)", borderRadius: 8, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 3, textDecoration: "none", boxShadow: "0 0 40px rgba(245,166,35,0.3)" }}>
                Now do yours.
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
