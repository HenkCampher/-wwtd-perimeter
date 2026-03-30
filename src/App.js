import { useState, useEffect } from "react";

const LEVELS = [
  { value: 1, label: "Hello There",           short: "HELLO", desc: "You've got my attention.",        color: "#a8e063", glow: "rgba(168,224,99,0.25)",  emoji: "👀" },
  { value: 2, label: "Say What Now",          short: "SAY W", desc: "Wait — did they just—",           color: "#f9c74f", glow: "rgba(249,199,79,0.25)",  emoji: "🤨" },
  { value: 3, label: "Oh That's Dangerous",   short: "DNGRS", desc: "Bold and they know it.",          color: "#f8961e", glow: "rgba(248,150,30,0.3)",   emoji: "😏" },
  { value: 4, label: "Someone Call Security", short: "SECUR", desc: "This should not be allowed.",     color: "#f3722c", glow: "rgba(243,114,44,0.35)",  emoji: "🚨" },
  { value: 5, label: "I'm Not Okay",          short: "NOT OK",desc: "Too far gone to care.",           color: "#e63946", glow: "rgba(230,57,70,0.4)",    emoji: "😵" },
];
const WWTD = { value: 6, label: "What Would Tequila Do", short: "WWTD", desc: "No going back.", color: "#f5a623", glow: "rgba(245,166,35,0.6)", emoji: "🥃" };
const ALL_LEVELS = [...LEVELS, WWTD];

const SYSTEM_PROMPT = `You are the rewriter behind "What Would Tequila Do" — a tool that transforms bland, safe, forgettable communication into something that cuts through noise.

LEVEL 1 - HELLO THERE: Sharper, cleaner, more confident. Strip all corporate flab. Real spine. Still professional but finally has a pulse.

LEVEL 2 - SAY WHAT NOW: Punchy and direct. Says the thing people think but never write. Makes someone read it again out loud to the person next to them.

LEVEL 3 - OH THAT'S DANGEROUS: Bold creative angles. Unexpected metaphors. Confident to the point of confrontational. Gets screenshotted and sent with no caption.

LEVEL 4 - SOMEONE CALL SECURITY: This should not be allowed. Vivid, wildly creative, over-the-top but the core message survives barely. Written by someone with zero regrets.

LEVEL 5 - I'M NOT OKAY: Abandon all restraint. Fever dream that makes perfect sense. Weird, loud, uncomfortably specific. Use fragments. Use repetition. Break grammar with intention. End with a single line so raw it makes the reader put their phone down.

LEVEL 6 - WHAT WOULD TEQUILA DO: All rules are dead. Fully absurdist — impossible images, language that shouldn't work but captures truth better than anything sensible. Provocative, poetic, unhinged. End with a single line in ALL CAPS that hits like a slap and a revelation simultaneously. Make the reader laugh, wince, and forward it immediately.

Rules: Match level precisely. Preserve core intent. Output ONLY the rewritten text. No preamble. Never start with "I".`;

function GlitchText({ text, active }) {
  const [disp, setDisp] = useState(text);
  const chars = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  useEffect(() => {
    if (!active) { setDisp(text); return; }
    let i = 0;
    const iv = setInterval(() => {
      setDisp(text.split("").map((c, j) => j < i ? c : c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join(""));
      if (i >= text.length) clearInterval(iv);
      i += 1.5;
    }, 40);
    return () => clearInterval(iv);
  }, [text, active]);
  return <span>{disp}</span>;
}

async function callAPI(level, levelLabel, input) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  const res = await fetch("/api/rewrite", {
    method: "POST",
    signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Rewrite at level ${level} (${levelLabel}):\n\n${input}` }]
    })
  });
  clearTimeout(timeout);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(b => b.type === "text")?.text || "Something went wrong.";
}

export default function App() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wwtdUnlocked, setWwtdUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [tab, setTab] = useState("rewrite");
  const [compareResults, setCompareResults] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isWWTD = level === 6;
  const currentLevel = isWWTD ? WWTD : LEVELS[level - 1];
  const activeLevels = wwtdUnlocked ? ALL_LEVELS : LEVELS;

  const rewrite = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput(""); setShowHint(false);
    try {
      const text = await callAPI(level, currentLevel.label, input);
      setOutput(text);
      setHistory(h => [{ id: Date.now(), level: currentLevel, input: input.slice(0, 80) + (input.length > 80 ? "..." : ""), output: text, ts: new Date().toLocaleTimeString() }, ...h].slice(0, 20));
      if (level === 5) setTimeout(() => setShowHint(true), 1200);
      if (isWWTD) { setGlitching(true); setTimeout(() => setGlitching(false), 2500); }
    } catch (e) { setOutput(e.name === "AbortError" ? "Timed out. Try again." : `Error: ${e.message}`); }
    setLoading(false);
  };

  const randomLevel = () => {
    const lvls = wwtdUnlocked ? ALL_LEVELS : LEVELS;
    setLevel(lvls[Math.floor(Math.random() * lvls.length)].value);
  };

  const runGauntlet = async () => {
    if (!input.trim()) return;
    setComparing(true);
    setCompareResults(activeLevels.map(l => ({ ...l, output: "", done: false })));
    for (let i = 0; i < activeLevels.length; i++) {
      const l = activeLevels[i];
      try {
        const text = await callAPI(l.value, l.label, input);
        setCompareResults(prev => prev.map((r, j) => j === i ? { ...r, output: text, done: true } : r));
      } catch {
        setCompareResults(prev => prev.map((r, j) => j === i ? { ...r, output: "Failed — try rerunning.", done: true } : r));
      }
    }
    setComparing(false);
    if (!wwtdUnlocked) setTimeout(() => setShowHint(true), 800);
  };

  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const share = (text, lvl) => { navigator.clipboard.writeText(`I ran my copy through the WWTD Peri-Ometer at "${lvl.label}" and got this:\n\n${text}\n\n— whatwouldtequilado.com`); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const bg = isWWTD ? "#0a0600" : "#080810";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#e8e8e8", fontFamily: "Georgia, serif", transition: "background 0.6s", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 0 20px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 40px rgba(245,166,35,0.6),0 0 80px rgba(245,166,35,0.2)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ position: "fixed", top: 0, right: sidebarOpen ? 0 : -380, width: 360, height: "100vh", background: "#0f0f1e", borderLeft: "1px solid #1e1e35", zIndex: 100, transition: "right 0.3s", overflowY: "auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ color: "#aaa", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>History</div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {history.length === 0
          ? <div style={{ color: "#555", fontSize: 13, fontStyle: "italic" }}>No rewrites yet.</div>
          : history.map(h => (
            <div key={h.id} style={{ marginBottom: 16, background: "#080810", border: `1px solid ${h.level.color}33`, borderRadius: 8, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: h.level.color, fontSize: 12, fontWeight: "bold" }}>{h.level.emoji} {h.level.label}</span>
                <span style={{ color: "#555", fontSize: 11 }}>{h.ts}</span>
              </div>
              <div style={{ color: "#666", fontSize: 11, marginBottom: 8, fontStyle: "italic" }}>{h.input}</div>
              <div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{h.output.slice(0, 140)}...</div>
              <button onClick={() => copy(h.output)} style={{ background: "none", border: "1px solid #222", color: "#666", borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Copy</button>
            </div>
          ))
        }
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "1px solid #2a2a40", color: "#777", borderRadius: 6, padding: "7px 16px", fontSize: 11, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase" }}>
              {history.length > 0 ? `History (${history.length})` : "History"}
            </button>
          </div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#777", textTransform: "uppercase", marginBottom: 10, fontStyle: "italic" }}>A tool from</div>
          <h1 style={{ fontSize: 42, fontWeight: "bold", letterSpacing: -1, margin: "0 0 10px", background: isWWTD ? "linear-gradient(135deg, #f5a623, #fff, #f5a623)" : "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {isWWTD ? <GlitchText text="What Would Tequila Do" active={glitching} /> : "What Would Tequila Do"}
          </h1>
          <div style={{ color: "#777", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Cut through the bland</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["rewrite", "compare"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "13px", background: tab === t ? "#1e1e35" : "transparent", border: `1px solid ${tab === t ? "#2a2a45" : "#1e1e35"}`, borderRadius: 8, color: tab === t ? "#ddd" : "#777", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
              {t === "rewrite" ? "✍️ Rewrite" : "⚡ Run the Gauntlet"}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div style={{ background: isWWTD ? "#110900" : "#0f0f1e", border: `1px solid ${isWWTD ? "#3a2500" : "#1e1e35"}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 60px ${currentLevel.glow}`, transition: "all 0.5s", marginBottom: 16 }}>
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ color: "#888", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>The Bland Original</div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your copy here..." style={{ width: "100%", minHeight: 130, background: isWWTD ? "#0a0600" : "#080810", border: `1px solid ${isWWTD ? "#2a1800" : "#1e1e35"}`, borderRadius: 8, color: "#e8e8e8", fontSize: 14, padding: "16px", fontFamily: "Georgia, serif", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />
            <p style={{ color: "#555", fontSize: 12, fontStyle: "italic", margin: "10px 0 4px" }}>
              📧 emails &nbsp;·&nbsp; 🎤 pitches &nbsp;·&nbsp; 💼 LinkedIn posts &nbsp;·&nbsp; 📝 bios &nbsp;·&nbsp; 📣 ad copy &nbsp;·&nbsp; ✍️ anything really
            </p>
          </div>

          {tab === "rewrite" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ color: "#777", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Boldness Level</div>
                <div style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>{currentLevel.desc}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {LEVELS.map(l => (
                  <button key={l.value} onClick={() => setLevel(l.value)} style={{ width: "100%", padding: "14px 20px", background: level === l.value ? `${l.color}18` : "#080810", border: `1px solid ${level === l.value ? l.color : "#1e1e35"}`, borderRadius: 8, color: level === l.value ? l.color : "#777", fontSize: 14, fontWeight: level === l.value ? "bold" : "normal", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{l.emoji}</span>
                    <span style={{ flex: 1 }}>{l.label}</span>
                    {level === l.value && <span style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Selected</span>}
                  </button>
                ))}
                {wwtdUnlocked && (
                  <button onClick={() => setLevel(6)} style={{ width: "100%", padding: "14px 20px", background: isWWTD ? `${WWTD.color}18` : "#080810", border: `1px solid ${isWWTD ? WWTD.color : "#3a2500"}`, borderRadius: 8, color: isWWTD ? WWTD.color : "#f5a62388", fontSize: 14, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>🥃</span>
                    <span style={{ flex: 1 }}>What Would Tequila Do</span>
                    {isWWTD && <span style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Selected</span>}
                  </button>
                )}
              </div>
              <div style={{ height: 3, background: "#1e1e35", borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: isWWTD ? "100%" : `${((level - 1) / 4) * 100}%`, background: isWWTD ? "linear-gradient(90deg,#f5a623,#fff176,#f5a623)" : "linear-gradient(90deg,#a8e063,#f9c74f,#f8961e,#f3722c,#e63946)", transition: "width 0.4s", boxShadow: isWWTD ? `0 0 8px ${WWTD.color}` : "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={rewrite} disabled={!input.trim() || loading} style={{ flex: 1, background: input.trim() && !loading ? (isWWTD ? "linear-gradient(135deg,#f5a623,#e8890a)" : `linear-gradient(135deg,${currentLevel.color},${LEVELS[Math.min(level, 4) - 1].color})`) : "#1e1e35", color: input.trim() && !loading ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 14, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.3s" }}>
                  {loading ? "Rewriting..." : isWWTD ? "🥃 WWTD?" : `${currentLevel.emoji} Make it ${currentLevel.label} →`}
                </button>
                <button onClick={randomLevel} title="Random level" style={{ background: "#080810", border: "1px solid #1e1e35", color: "#777", borderRadius: 8, padding: "16px 18px", fontSize: 18, cursor: "pointer" }}>🎲</button>
              </div>
            </div>
          )}

          {tab === "compare" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ color: "#777", fontSize: 13, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>Runs your copy through all {activeLevels.length} levels sequentially. See the full arc at once.</p>
              <button onClick={runGauntlet} disabled={!input.trim() || comparing} style={{ width: "100%", background: input.trim() && !comparing ? "linear-gradient(135deg,#a8e063,#f9c74f,#f8961e,#e63946)" : "#1e1e35", color: input.trim() && !comparing ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 14, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !comparing ? "pointer" : "not-allowed" }}>
                {comparing ? "Running..." : "⚡ Run the Gauntlet"}
              </button>
            </div>
          )}
        </div>

        {/* Single rewrite output */}
        {tab === "rewrite" && (output || loading) && (
          <div style={{ background: isWWTD ? "#110900" : "#0f0f1e", border: `1px solid ${currentLevel.color}55`, borderRadius: 12, overflow: "hidden", boxShadow: isWWTD ? `0 0 80px ${WWTD.glow}` : `0 0 40px ${currentLevel.glow}`, animation: "fadeIn 0.4s" }}>
            <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${currentLevel.color}22`, background: isWWTD ? "linear-gradient(135deg,#1a0e00,#0d0700)" : `linear-gradient(135deg,${currentLevel.color}10,transparent)` }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: `${currentLevel.color}99`, textTransform: "uppercase", marginBottom: 6 }}>Your rewrite at</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{currentLevel.emoji}</span>
                  <span style={{ color: currentLevel.color, fontSize: 26, fontWeight: "bold", letterSpacing: -0.5, textShadow: `0 0 20px ${currentLevel.color}55` }}>
                    {isWWTD ? <GlitchText text={currentLevel.label} active={glitching} /> : currentLevel.label}
                  </span>
                </div>
                {output && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => copy(output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: copied ? currentLevel.color : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>{copied ? "Copied ✓" : "Copy"}</button>
                    <button onClick={() => share(output, currentLevel)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#777", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>Share</button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: "28px" }}>
              {loading
                ? <div><div style={{ color: currentLevel.color, fontStyle: "italic", fontSize: 14, marginBottom: 16 }}>{isWWTD ? "Tequila is thinking..." : `Making it ${currentLevel.label}...`}</div><div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: currentLevel.color, animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />)}</div></div>
                : <p style={{ color: isWWTD ? "#f0d090" : "#f0f0f0", fontSize: isWWTD ? 18 : 17, lineHeight: isWWTD ? 2.1 : 1.9, margin: 0, whiteSpace: "pre-wrap", fontStyle: isWWTD ? "italic" : "normal" }}>{isWWTD ? <GlitchText text={output} active={glitching} /> : output}</p>
              }
            </div>
          </div>
        )}

        {/* Gauntlet results */}
        {tab === "compare" && compareResults.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {compareResults.map(r => (
              <div key={r.value} style={{ background: r.value === 6 ? "#110900" : "#0f0f1e", border: `1px solid ${r.color}44`, borderRadius: 10, overflow: "hidden", animation: "fadeIn 0.4s" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${r.color}22`, display: "flex", justifyContent: "space-between", alignItems: "center", background: r.value === 6 ? "linear-gradient(90deg,#1a0e00,#0a0600)" : `linear-gradient(135deg,${r.color}08,transparent)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{r.emoji}</span>
                    <span style={{ color: r.color, fontSize: 16, fontWeight: "bold" }}>{r.label}</span>
                  </div>
                  {r.done && r.output && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => copy(r.output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#777", borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Copy</button>
                      <button onClick={() => share(r.output, r)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#777", borderRadius: 4, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Share</button>
                    </div>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  {!r.done
                    ? <div style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`, opacity: 0.7 }} />)}</div>
                    : <p style={{ color: r.value === 6 ? "#f0d090" : "#f0f0f0", fontSize: 15, lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap", fontStyle: r.value === 6 ? "italic" : "normal" }}>{r.output}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secret hint */}
        {showHint && !wwtdUnlocked && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <div style={{ display: "inline-block", background: "linear-gradient(135deg,#1a0900,#2d1200)", border: "1px solid #f5a62355", borderRadius: 10, padding: "24px 40px", animation: "pulse 2s infinite" }}>
              <div style={{ color: "#f5a623", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, opacity: 0.8 }}>⚠️ Wait. There's more.</div>
              <button onClick={() => { setWwtdUnlocked(true); setLevel(6); setShowHint(false); setOutput(""); }} style={{ background: "transparent", border: "none", color: "#f5a623", fontSize: 24, fontStyle: "italic", fontWeight: "bold", cursor: "pointer", display: "block", marginBottom: 12, textShadow: "0 0 20px rgba(245,166,35,0.8)", lineHeight: 1.4 }}>
                ...but what would tequila do?
              </button>
              <div style={{ color: "#f5a62399", fontSize: 12, fontStyle: "italic" }}>tap to find out ↑</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, borderTop: "1px solid #111", paddingTop: 24 }}>
          <div style={{ color: "#777", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>What Would Tequila Do</div>
          <div style={{ color: "#555", fontSize: 11, fontStyle: "italic" }}>The book. Coming soon.</div>
        </div>
      </div>
    </div>
  );
}