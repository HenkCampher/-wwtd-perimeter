import { useState, useEffect } from "react";

const LEVEL_COLORS = {
  "Hello There": "#a8e063",
  "Say What Now": "#f9c74f",
  "Oh Thats Dangerous": "#f8961e",
  "Someone Call Security": "#f3722c",
  "Im Not Okay": "#e63946",
  "What Would Tequila Do": "#f5a623",
};

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "#aaa", fontSize: 13 }}>{label}</span>
        <span style={{ color: color || "#f5a623", fontSize: 13, fontWeight: "bold" }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "#1e1e35", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color || "#f5a623", borderRadius: 3, transition: "width 0.6s" }} />
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "#0f0f1e", border: "1px solid #1e1e35", borderRadius: 12, padding: "24px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 20 }}>{title}</div>
      {children}
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/getstats")
      .then(r => r.json())
      .then(d => { if (d.error) setError(true); else setStats(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const levelMax = stats ? Math.max(...Object.values(stats.levels || {}), 1) : 1;
  const formatMax = stats ? Math.max(...Object.values(stats.formats || {}), 1) : 1;

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e8e8", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#555", textTransform: "uppercase", marginBottom: 12, fontStyle: "italic" }}>Behind the bar</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 3, margin: "0 0 12px", background: "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            What Would Tequila Do
          </h1>
          <div style={{ color: "#555", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Usage Stats</div>
        </div>
        {loading && <div style={{ textAlign: "center", color: "#555", fontStyle: "italic", padding: "48px 0" }}>Loading stats...</div>}
        {error && <div style={{ textAlign: "center", color: "#555", fontStyle: "italic", padding: "48px 0" }}>No stats yet. Go make some rewrites first.</div>}
        {stats && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Total Rewrites", value: stats.total_rewrites || 0, color: "#f5a623" },
                { label: "Sharpen Flows", value: stats.sharpen_completed || 0, color: "#aaaacc" },
                { label: "Links Created", value: stats.get_link || 0, color: "#a8e063" },
              ].map(s => (
                <div key={s.label} style={{ background: "#0f0f1e", border: "1px solid #1e1e35", borderRadius: 12, padding: "20px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <Card title="Rewrites by Spice Level">
              {Object.entries(stats.levels || {}).sort((a,b) => b[1]-a[1]).map(([label, value]) => (
                <Bar key={label} label={label} value={value} max={levelMax} color={LEVEL_COLORS[label]} />
              ))}
              {Object.keys(stats.levels || {}).length === 0 && <div style={{ color: "#555", fontStyle: "italic" }}>No data yet.</div>}
            </Card>
            <Card title="Rewrites by Format">
              {Object.entries(stats.formats || {}).filter(([k]) => k).sort((a,b) => b[1]-a[1]).map(([label, value]) => (
                <Bar key={label} label={label} value={value} max={formatMax} color="#f9c74f" />
              ))}
              {Object.keys(stats.formats || {}).filter(k => k).length === 0 && <div style={{ color: "#555", fontStyle: "italic" }}>No format data yet.</div>}
            </Card>
            <Card title="Sharpen Flow">
              <Bar label="Started" value={stats.sharpen_started || 0} max={Math.max(stats.sharpen_started || 0, 1)} color="#aaaacc" />
              <Bar label="Completed" value={stats.sharpen_completed || 0} max={Math.max(stats.sharpen_started || 0, 1)} color="#8888aa" />
              <div style={{ color: "#555", fontSize: 13, fontStyle: "italic", marginTop: 8 }}>
                Completion rate: {stats.sharpen_started > 0 ? Math.round((stats.sharpen_completed / stats.sharpen_started) * 100) : 0}%
              </div>
            </Card>
            {stats.last_updated && (
              <div style={{ textAlign: "center", color: "#333", fontSize: 12, fontStyle: "italic", marginTop: 8 }}>
                Last updated: {new Date(stats.last_updated).toLocaleString()}
              </div>
            )}
          </>
        )}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="/" style={{ color: "#555", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>Back to the tool</a>
        </div>
      </div>
    </div>
  );
}
