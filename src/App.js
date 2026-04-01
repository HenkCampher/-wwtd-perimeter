import { useState, useEffect, useRef } from "react";

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

CRITICAL RULE: At every level, you MUST preserve ALL factual content from the original — names, numbers, claims, statistics, product details, calls to action, and specific benefits. The creativity is in the DELIVERY, never the content. Facts survive everything.

LEVEL 1 - HELLO THERE: Sharper, cleaner, more confident. Strip all corporate flab. Real spine. Still professional but finally has a pulse.

LEVEL 2 - SAY WHAT NOW: Punchy and direct. Says the thing people think but never write. Makes someone read it again out loud to the person next to them.

LEVEL 3 - OH THAT'S DANGEROUS: Bold creative angles. Unexpected metaphors. Confident to the point of confrontational. Gets screenshotted and sent with no caption.

LEVEL 4 - SOMEONE CALL SECURITY: This should not be allowed. Vivid, wildly creative, over-the-top but the core message survives barely. Written by someone with zero regrets.

LEVEL 5 - I'M NOT OKAY: Abandon all restraint. Fever dream that makes perfect sense. Weird, loud, uncomfortably specific. Use fragments. Use repetition. Break grammar with intention. End with a single line so raw it makes the reader put their phone down. ALL facts from the original must still be present.

LEVEL 6 - WHAT WOULD TEQUILA DO: All rules are dead. Fully absurdist — impossible images, language that shouldn't work but captures truth better than anything sensible. Provocative, poetic, unhinged. Every single fact from the original must survive in some form. End with a single line in ALL CAPS that hits like a slap and a revelation simultaneously. Make the reader laugh, wince, and forward it immediately.

Rules: Match level precisely. PRESERVE ALL FACTS. Output ONLY the rewritten text. No preamble. No headers. No level labels. Never start with "I". BANNED CLICHÉS — never use these: "2am", "3am", "coffee-stained", "burning the midnight oil", "hustle", "game changer", "move the needle", "crushing it", "on a journey", "passionate about", "I am excited to", "synergy", "disruptive", "bleeding edge", "at the end of the day", "it is what it is". Find fresh, specific angles instead. POP CULTURE: At levels 4, 5, and 6 only, you may use a single pop culture reference (film, TV, music, sport, history) but ONLY when it is the sharpest, most unexpected way to make the point. If it feels like decoration or a stretch, skip it. It should feel like a surprise, not a pattern.`;

const SUBSTANCE_PROMPT = `You are a copy quality analyst. Analyze the following text and give it a substance score out of 10 based on these criteria:
- Specific facts, numbers, or data (0-2 points)
- Clear value proposition (0-2 points)  
- Concrete ask or call to action (0-2 points)
- Real claims vs vague buzzwords (0-2 points)
- Named audience or specific problem (0-2 points)

Respond ONLY with valid JSON in exactly this format, nothing else:
{"score": 7, "missing": ["specific numbers", "clear CTA"], "verdict": "There's something here. Barely."}

Verdicts by score:
1-3: "This is essentially air."
4-5: "There's something here. Barely."
6-7: "Solid foundation. Let's light it up."
8-9: "This was already good. Now it'll be dangerous."
10: "Pure substance. Tequila will make this legendary."`;

function GlitchText({ text, active }) {
  const [disp, setDisp] = useState(text);
  const chars = "!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  useEffect(() => {
    if (!active) { setDisp(text); return; }
    let i = 0;
    const iv = setInterval(() => {
      setDisp(text.split("").map((c, j) => j < i ? c : c === " " ? " " : chars[Math.floor(Math.random()*chars.length)]).join(""));
      if (i >= text.length) clearInterval(iv);
      i += 1.5;
    }, 40);
    return () => clearInterval(iv);
  }, [text, active]);
  return <span>{disp}</span>;
}

async function callAPI(level, levelLabel, input, formatLabel = "") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);
  const res = await fetch("/api/rewrite", {
    method: "POST", signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 1000, system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Rewrite at level ${level} (${levelLabel})${formatLabel ? ` as a ${formatLabel}${
  formatLabel === "Social Post" ? " (max 280 characters)" :
  formatLabel === "LinkedIn Post" ? " (max 1300 characters)" :
  formatLabel === "Ad Copy" ? " (max 150 characters)" :
  formatLabel === "Elevator Pitch" ? " (max 300 characters)" :
  formatLabel === "Bio" ? " (max 300 characters)" :
  formatLabel === "Email" ? " (must include a subject line)" : ""
}` : ""}:\n\n${input}` }]
    })
  });
  clearTimeout(timeout);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(b => b.type === "text")?.text || "Something went wrong.";
}

async function scoreSubstance(input) {
  const res = await fetch("/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 200, system: SUBSTANCE_PROMPT,
      messages: [{ role: "user", content: input }]
    })
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  } catch { return null; }
}

function ScoreBar({ score }) {
  const color = score <= 3 ? "#e63946" : score <= 5 ? "#f3722c" : score <= 7 ? "#f9c74f" : "#a8e063";
  return (
    <div style={{ height: 4, background: "#1e1e35", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${score * 10}%`, background: color, borderRadius: 2, transition: "width 0.6s, background 0.4s" }} />
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [wwtdUnlocked, setWwtdUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [tab, setTab] = useState("rewrite");
  const [compareResults, setCompareResults] = useState([]);
  const [comparing, setComparing] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [substance, setSubstance] = useState(null);
  const [scoringSubstance, setScoringSubstance] = useState(false);
  const [format, setFormat] = useState("");
  const [sharpenQuestions, setSharpenQuestions] = useState([]);
  const [sharpenAnswers, setSharpenAnswers] = useState({});
  const [sharpenLoading, setSharpenLoading] = useState(false);
  const [sharpenOutput, setSharpenOutput] = useState("");
  const [sharpenCopied, setSharpenCopied] = useState(false);
  const [sharpenLinkCopied, setSharpenLinkCopied] = useState(false);
  const [showSharpen, setShowSharpen] = useState(false);
  const scoreTimer = useRef(null);

  const isWWTD = level === 6;
  const currentLevel = isWWTD ? WWTD : LEVELS[level - 1];
  const activeLevels = wwtdUnlocked ? ALL_LEVELS : LEVELS;

  // Auto-score substance after 1.5s of no typing
  useEffect(() => {
    if (scoreTimer.current) clearTimeout(scoreTimer.current);
    if (input.trim().length < 30) { setSubstance(null); return; }
    scoreTimer.current = setTimeout(async () => {
      setScoringSubstance(true);
      const result = await scoreSubstance(input);
      setSubstance(result);
      setScoringSubstance(false);
    }, 1500);
    return () => clearTimeout(scoreTimer.current);
  }, [input]);

  const rewrite = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput(""); setShowHint(false); setTimedOut(false);
    const timeoutWarning = setTimeout(() => setTimedOut(true), 30000);
    try {
      const text = await callAPI(level, currentLevel.label, input, format);
      if (window.gtag) window.gtag('event', 'rewrite', { level: currentLevel.label, format: format || 'none' });
      track('rewrite', { level: currentLevel.label, format: format || '' });
      clearTimeout(timeoutWarning);
      setTimedOut(false);
      setOutput(text);
      setHistory(h => [{ id: Date.now(), level: currentLevel, input: input.slice(0, 80) + (input.length > 80 ? "..." : ""), output: text, ts: new Date().toLocaleTimeString() }, ...h].slice(0, 20));
      if (level === 5) setTimeout(() => setShowHint(true), 1200);
      if (isWWTD) { setGlitching(true); setTimeout(() => setGlitching(false), 2500); }
    } catch (e) {
      clearTimeout(timeoutWarning);
      setTimedOut(false);
      setOutput(e.name === "AbortError" ? "TIMEOUT" : `Error: ${e.message}`);
    }
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

  const getShareLink = async () => {
    if (window.gtag) window.gtag('event', 'get_link', { level: currentLevel.label, format: format || 'none' });
    track('get_link', { level: currentLevel.label, format: format || '' });
    setLinkLoading(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, output, level, format })
      });
      const data = await res.json();
      if (data.id) {
        const url = `${window.location.origin}/share/${data.id}`;
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      }
    } catch(e) { console.error("Share link error:", e); }
    setLinkLoading(false);
  };

  const handleSharpen = async () => {
    if (window.gtag) window.gtag('event', 'sharpen_started', { level: currentLevel.label });
    track('sharpen_started', { level: currentLevel.label });
    setShowSharpen(true);
    setSharpenLoading(true);
    setSharpenQuestions([]);
    setSharpenAnswers({});
    setSharpenOutput("NONE");
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: `You are a copy sharpener. A user has submitted marketing copy and received a rewrite at spice level "${currentLevel.label}". Your job is to identify 3 to 5 specific questions that, if answered, would make the rewrite dramatically more specific, personal, and powerful. Ask only about concrete details that are missing: real numbers, specific differentiators, named competitors, actual customer outcomes, unique process details. Never ask generic questions. Respond ONLY with valid JSON: {"questions": ["question 1", "question 2", "question 3"]}`,
          messages: [{ role: "user", content: `Original copy: ${input}\n\nRewrite: ${output}\n\nWhat 3 to 5 specific questions would unlock the details needed to make this rewrite hit harder?` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setSharpenQuestions(parsed.questions || []);
        const initAnswers = {};
        (parsed.questions || []).forEach((_, i) => { initAnswers[i] = ""; });
        setSharpenAnswers(initAnswers);
      }
    } catch(e) { 
      console.error("Sharpen error:", e);
      setSharpenQuestions(["Something went wrong. Try again."]); 
    }
    setSharpenLoading(false);
  };

  const handleSharpenRewrite = async () => {
    setSharpenLoading(true);
    setSharpenOutput("");
    const answeredQs = sharpenQuestions.map((q, i) => sharpenAnswers[i] ? `Q: ${q}\nA: ${sharpenAnswers[i]}` : null).filter(Boolean).join("\n\n");
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: `You are the rewriter behind What Would Tequila Do. Output ONLY the rewritten text. No preamble. No labels. No separators. No repetition of the input. Just the rewrite.`,
          messages: [{ role: "user", content: `Rewrite this at spice level "${currentLevel.label}"${format ? ` as a ${format}${
  format === "Social Post" ? " (max 280 characters)" :
  format === "LinkedIn Post" ? " (max 1300 characters)" :
  format === "Ad Copy" ? " (max 150 characters)" :
  format === "Elevator Pitch" ? " (max 300 characters)" :
  format === "Bio" ? " (max 300 characters)" :
  format === "Email" ? " (must include a subject line)" :
  format === "Boilerplate" ? " (max 100 words, punchy and specific)" : ""
}` : ""}, using the additional specifics below to make it sharper and more specific.\n\nORIGINAL: ${input}\n\nSPECIFICS TO WEAVE IN:\n${answeredQs}\n\nOutput only the rewritten text.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Something went wrong.";
      setSharpenOutput(text);
      if (window.gtag) window.gtag('event', 'sharpen_completed', { level: currentLevel.label, format: format || 'none' });
      track('sharpen_completed', { level: currentLevel.label, format: format || '' });
    } catch(e) { setSharpenOutput("Something went wrong. Try again."); }
    setSharpenLoading(false);
  };

  const renderOutput = (text) => {
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
      if (line === "") return <div key={i} style={{ height: "0.8em" }} />;
      return <div key={i}>{parts}</div>;
    });
  };

  const track = (event, extra = {}) => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...extra })
    }).catch(() => {});
  };

  const bg = isWWTD ? "#0a0600" : "#080810";

  const handleReset = () => {
    setInput("");
    setOutput("");
    setSubstance(null);
    setLevel(1);
    setTab("rewrite");
    setWwtdUnlocked(false);
    setShowHint(false);
    setGlitching(false);
    setCompareResults([]);
    setHistory([]);
    setSidebarOpen(false);
    setTimedOut(false);
    setSharpenQuestions([]);
    setSharpenAnswers({});
    setSharpenLoading(false);
    setSharpenOutput("");
    setShowSharpen(false);
    setFormat("");
    setSharpenCopied(false);
    setSharpenLinkCopied(false);
    setLinkCopied(false);
    setLinkLoading(false);
  };
  const scoreColor = substance ? (substance.score <= 3 ? "#e63946" : substance.score <= 5 ? "#f3722c" : substance.score <= 7 ? "#f9c74f" : "#a8e063") : "#555";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#e8e8e8", fontFamily: "'EB Garamond', Georgia, serif", transition: "background 0.6s", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 0 20px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 40px rgba(245,166,35,0.6),0 0 80px rgba(245,166,35,0.2)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scoreIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
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
          ? <div style={{ color: "#555", fontSize: 14, fontStyle: "italic" }}>No rewrites yet.</div>
          : history.map(h => (
            <div key={h.id} style={{ marginBottom: 16, background: "#080810", border: `1px solid ${h.level.color}33`, borderRadius: 8, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: h.level.color, fontSize: 13, fontWeight: "bold" }}>{h.level.emoji} {h.level.label}</span>
                <span style={{ color: "#555", fontSize: 11 }}>{h.ts}</span>
              </div>
              <div style={{ color: "#666", fontSize: 12, marginBottom: 8, fontStyle: "italic" }}>{h.input}</div>
              <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{h.output.slice(0, 140)}...</div>
              <button onClick={() => copy(h.output)} style={{ background: "none", border: "1px solid #222", color: "#666", borderRadius: 4, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
            </div>
          ))
        }
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={handleReset} style={{ background: "none", border: "1px solid #2a2a40", color: "#777", borderRadius: 6, padding: "7px 16px", fontSize: 12, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", fontFamily: "EB Garamond, serif" }}>🍹 Clear the Bar</button>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "1px solid #2a2a40", color: "#777", borderRadius: 6, padding: "7px 16px", fontSize: 12, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", fontFamily: "'EB Garamond', serif" }}>
              {history.length > 0 ? `History (${history.length})` : "History"}
            </button>
          </div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#777", textTransform: "uppercase", marginBottom: 10, fontStyle: "italic" }}>A tool from</div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 64,
            letterSpacing: 3,
            margin: "0 0 10px",
            lineHeight: 1,
            background: isWWTD ? "linear-gradient(135deg, #f5a623, #fff, #f5a623)" : "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {isWWTD ? <GlitchText text="What Would Tequila Do" active={glitching} /> : "What Would Tequila Do"}
          </h1>
          <div style={{ color: "#777", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Cut through the bland</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["rewrite", "compare"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "13px", background: tab === t ? "#1e1e35" : "transparent", border: `1px solid ${tab === t ? "#2a2a45" : "#1e1e35"}`, borderRadius: 8, color: tab === t ? "#ddd" : "#777", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: "'EB Garamond', serif" }}>
              {t === "rewrite" ? "✍️ Rewrite" : "⚡ Run the Gauntlet"}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div style={{ background: isWWTD ? "#110900" : "#0f0f1e", border: `1px solid ${isWWTD ? "#3a2500" : "#1e1e35"}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 60px ${currentLevel.glow}`, transition: "all 0.5s", marginBottom: 16 }}>
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ color: "#888", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Step 1: The Bland Original</div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your copy here..." style={{ width: "100%", minHeight: 130, background: isWWTD ? "#0a0600" : "#080810", border: `1px solid ${isWWTD ? "#2a1800" : "#1e1e35"}`, borderRadius: 8, color: "#e8e8e8", fontSize: 15, padding: "16px", fontFamily: "'EB Garamond', serif", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />


            {/* Substance score */}
            {(scoringSubstance || substance) && (
              <div style={{ margin: "14px 0 4px", padding: "14px 16px", background: "#080810", border: `1px solid ${scoreColor}33`, borderRadius: 8, animation: "scoreIn 0.3s" }}>
                {scoringSubstance ? (
                  <div style={{ color: "#444", fontSize: 13, fontStyle: "italic" }}>Checking substance...</div>
                ) : substance && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#777", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Substance Score</span>
                        <span style={{ color: scoreColor, fontSize: 20, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{substance.score}/10</span>
                        <span style={{ color: scoreColor, fontSize: 13, fontStyle: "italic" }}>{substance.verdict}</span>
                      </div>
                    </div>
                    <ScoreBar score={substance.score} />
                    {substance.missing?.length > 0 && substance.score < 7 && (
                      <div style={{ marginTop: 10, color: "#999", fontSize: 13, fontStyle: "italic" }}>
                        Consider adding: {substance.missing.join(" · ")}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {tab === "rewrite" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ color: "#777", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Step 2: Pick Your Format (optional)</div>
                <select value={format} onChange={e => setFormat(e.target.value)} style={{ width: "100%", padding: "12px 16px", background: "#080810", border: `1px solid ${format ? "#2a2a50" : "#1e1e35"}`, borderRadius: 8, color: format ? "#e8e8e8" : "#555", fontSize: 14, fontFamily: "'EB Garamond', serif", cursor: "pointer", appearance: "none", WebkitAppearance: "none", outline: "none" }}>
                  <option value="">No format — just make it bolder</option>
                  <option value="Social Post">Social Post (X, Bluesky, Threads)</option>
                  <option value="LinkedIn Post">LinkedIn Post</option>
                  <option value="Ad Copy">Ad Copy</option>
                  <option value="Elevator Pitch">Elevator Pitch</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Bio">Bio</option>
                  <option value="Email">Email (with subject line)</option>
                  <option value="Boilerplate">Boilerplate / About</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ color: "#777", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Step 3: Pick Your Spice Level</div>
                <div style={{ color: "#666", fontSize: 13, fontStyle: "italic" }}>{currentLevel.desc}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {LEVELS.map(l => (
                  <button key={l.value} onClick={() => setLevel(l.value)} style={{ width: "100%", padding: "14px 20px", background: level === l.value ? `${l.color}18` : "#080810", border: `1px solid ${level === l.value ? l.color : "#1e1e35"}`, borderRadius: 8, color: level === l.value ? l.color : "#777", fontSize: 15, fontWeight: level === l.value ? "bold" : "normal", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: "'EB Garamond', serif" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{l.emoji}</span>
                    <span style={{ flex: 1 }}>{l.label}</span>
                    {level === l.value && <span style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Selected</span>}
                  </button>
                ))}
                {wwtdUnlocked && (
                  <button onClick={() => setLevel(6)} style={{ width: "100%", padding: "14px 20px", background: isWWTD ? `${WWTD.color}18` : "#080810", border: `1px solid ${isWWTD ? WWTD.color : "#3a2500"}`, borderRadius: 8, color: isWWTD ? WWTD.color : "#f5a62388", fontSize: 15, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: "'EB Garamond', serif" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>🥃</span>
                    <span style={{ flex: 1 }}>What Would Tequila Do</span>
                    {isWWTD && <span style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Selected</span>}
                  </button>
                )}
              </div>
              <div style={{ height: 3, background: "#1e1e35", borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: isWWTD ? "100%" : `${((level-1)/4)*100}%`, background: isWWTD ? "linear-gradient(90deg,#f5a623,#fff176,#f5a623)" : "linear-gradient(90deg,#a8e063,#f9c74f,#f8961e,#f3722c,#e63946)", transition: "width 0.4s", boxShadow: isWWTD ? `0 0 8px ${WWTD.color}` : "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={rewrite} disabled={!input.trim() || loading} style={{ flex: 1, background: input.trim() && !loading ? (isWWTD ? "linear-gradient(135deg,#f5a623,#e8890a)" : `linear-gradient(135deg,${currentLevel.color},${LEVELS[Math.min(level,4)-1].color})`) : "#1e1e35", color: input.trim() && !loading ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 15, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.3s", fontFamily: "'EB Garamond', serif" }}>
                  {loading ? "Rewriting..." : isWWTD ? "🥃 WWTD?" : `${currentLevel.emoji} Make it ${currentLevel.label} →`}
                </button>
                <button onClick={randomLevel} title="Random level" style={{ background: "#080810", border: "1px solid #1e1e35", color: "#777", borderRadius: 8, padding: "16px 18px", fontSize: 18, cursor: "pointer" }}>🎲</button>
              </div>
            </div>
          )}

          {tab === "compare" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ color: "#777", fontSize: 14, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>Runs your copy through all {activeLevels.length} levels sequentially. See the full arc at once.</p>
              <button onClick={runGauntlet} disabled={!input.trim() || comparing} style={{ width: "100%", background: input.trim() && !comparing ? "linear-gradient(135deg,#a8e063,#f9c74f,#f8961e,#e63946)" : "#1e1e35", color: input.trim() && !comparing ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 15, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !comparing ? "pointer" : "not-allowed", fontFamily: "'EB Garamond', serif" }}>
                {comparing ? "Running..." : "⚡ Run the Gauntlet"}
              </button>
            </div>
          )}
        </div>

        {/* Timeout warning */}
        {timedOut && loading && (
          <div style={{ textAlign: "center", padding: "16px", background: "#1a0a00", border: "1px solid #f3722c44", borderRadius: 10, marginBottom: 16, animation: "fadeIn 0.4s" }}>
            <p style={{ color: "#f3722c", fontSize: 15, fontStyle: "italic", margin: 0 }}>
              This is too hot for even super fast broadband to handle. Please refresh and try again. You're worth it.
            </p>
          </div>
        )}

        {/* Single rewrite output */}
        {tab === "rewrite" && (output || loading) && (
          <div style={{ background: isWWTD ? "#110900" : "#0f0f1e", border: `1px solid ${currentLevel.color}55`, borderRadius: 12, overflow: "hidden", boxShadow: isWWTD ? `0 0 80px ${WWTD.glow}` : `0 0 40px ${currentLevel.glow}`, animation: "fadeIn 0.4s" }}>
            <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${currentLevel.color}22`, background: isWWTD ? "linear-gradient(135deg,#1a0e00,#0d0700)" : `linear-gradient(135deg,${currentLevel.color}10,transparent)` }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: `${currentLevel.color}99`, textTransform: "uppercase", marginBottom: 6 }}>Your rewrite at</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{currentLevel.emoji}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: currentLevel.color, fontSize: 32, letterSpacing: 2, textShadow: `0 0 20px ${currentLevel.color}55` }}>
                    {isWWTD ? <GlitchText text={currentLevel.label} active={glitching} /> : currentLevel.label}
                  </span>
                </div>
                {output && output !== "TIMEOUT" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => copy(output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: copied ? currentLevel.color : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'EB Garamond', serif" }}>{copied ? "Copied ✓" : "Copy"}</button>
                    <button onClick={getShareLink} style={{ background: "transparent", border: "1px solid #2a2a40", color: linkCopied ? currentLevel.color : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'EB Garamond', serif" }}>{linkLoading ? "Saving..." : linkCopied ? "Link Copied ✓" : "Get Link"}</button>
                  </div>
                )}
              </div>
            </div>
            {output && output !== "TIMEOUT" && !loading && (
              <div style={{ padding: "10px 28px", borderBottom: `1px solid ${currentLevel.color}22`, borderLeft: `3px solid ${currentLevel.color}88`, background: isWWTD ? "#0d0700" : "#0c0c1e" }}>
                <p style={{ color: "#aaa", fontSize: 13, fontStyle: "italic", margin: 0, letterSpacing: 0.5 }}>90% done. The last 10% is yours — make it unmistakably you.</p>
              </div>
            )}
            <div style={{ padding: "28px" }}>
              {loading
                ? <div><div style={{ color: currentLevel.color, fontStyle: "italic", fontSize: 15, marginBottom: 16 }}>{isWWTD ? "Tequila is thinking..." : `Making it ${currentLevel.label}...`}</div><div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: currentLevel.color, animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />)}</div></div>
                : output === "TIMEOUT"
                  ? <p style={{ color: "#f3722c", fontSize: 15, fontStyle: "italic", margin: 0 }}>This is too hot for even super fast broadband to handle. Please refresh and try again. You're worth it.</p>
                  : <>
                      <p style={{ color: isWWTD ? "#f0d090" : "#f0f0f0", fontSize: isWWTD ? 19 : 17, lineHeight: isWWTD ? 2.1 : 1.9, margin: "0 0 24px", fontStyle: isWWTD ? "italic" : "normal" }}>
                        {isWWTD ? <GlitchText text={output} active={glitching} /> : renderOutput(output)}
                      </p>
                      <div style={{ borderTop: `1px solid ${currentLevel.color}33`, paddingTop: 20, marginTop: 8 }}>
                        {!showSharpen && (
                          <button onClick={handleSharpen} style={{
                            width: "100%",
                            padding: "14px",
                            background: substance && substance.score <= 6 ? `${currentLevel.color}15` : "transparent",
                            border: `1px dashed ${currentLevel.color}${substance && substance.score <= 6 ? "ff" : "88"}`,
                            borderRadius: 8,
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            fontFamily: "'EB Garamond', serif",
                            letterSpacing: 1,
                            fontWeight: "600",
                            animation: substance && substance.score <= 6 ? "pulse 2s ease-in-out infinite" : "none"
                          }}>
                            {substance && substance.score <= 6
                              ? `Your score was ${substance.score}/10. Don't leave it half naked — 3 questions will fix that.`
                              : "Don't leave it half naked. 3 quick questions will fix that."
                            }
                          </button>
                        )}
                      </div>
                    </>
              }
            </div>
          </div>
        )}

        {/* Sharpen card */}
        {showSharpen && tab === "rewrite" && (
          <div style={{ background: "#0f0f18", border: "1px solid #8888aa", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 40px rgba(180,180,220,0.15)", animation: "fadeIn 0.4s", marginTop: 16 }}>
            <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #2a2a40", background: "linear-gradient(135deg,#12121f,#0f0f18)" }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#aaaacc", textTransform: "uppercase", marginBottom: 4 }}>Make it sharper</div>
              <div style={{ color: "#ccc", fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>Give it more you.</div>
            </div>
            <div style={{ padding: "28px" }}>
              {sharpenLoading && !sharpenOutput && (
                <div>
                  <div style={{ color: "#4a8a4a", fontStyle: "italic", fontSize: 15, marginBottom: 16 }}>Finding the gaps...</div>
                  <div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#4a8a4a", animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />)}</div>
                </div>
              )}
              {!sharpenLoading && sharpenOutput && sharpenOutput !== "NONE" && (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: "#4a8a4a", textTransform: "uppercase", marginBottom: 16 }}>Sharpened rewrite</div>
                  <p style={{ color: "#f0f0f0", fontSize: 17, lineHeight: 1.9, margin: "0 0 24px" }}>{renderOutput(sharpenOutput)}</p>
                  <button onClick={() => { navigator.clipboard.writeText(sharpenOutput); setSharpenCopied(true); setTimeout(() => setSharpenCopied(false), 2000); }} style={{ background: "transparent", border: "1px solid #2a3a2a", color: sharpenCopied ? "#aaaacc" : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'EB Garamond', serif" }}>{sharpenCopied ? "Copied ✓" : "Copy"}</button>
                  <button onClick={async () => {
                    try {
                      const res = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input, output: sharpenOutput, level, format }) });
                      const data = await res.json();
                      if (data.id) { await navigator.clipboard.writeText(`${window.location.origin}/share/${data.id}`); setSharpenLinkCopied(true); setTimeout(() => setSharpenLinkCopied(false), 2000); }
                    } catch(e) { console.error(e); }
                  }} style={{ background: "transparent", border: "1px solid #2a3a2a", color: sharpenLinkCopied ? "#aaaacc" : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'EB Garamond', serif" }}>{sharpenLinkCopied ? "Link Copied ✓" : "Get Link"}</button>
                </>
              )}
              {!sharpenLoading && sharpenQuestions.length > 0 && (sharpenOutput === "NONE" || !sharpenOutput) && (
                <>
                  {sharpenQuestions.map((q, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <div style={{ color: "#bbb", fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>{i + 1}. {q}</div>
                      <textarea
                        value={sharpenAnswers[i] || ""}
                        onChange={e => setSharpenAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                        placeholder="Your answer (or skip)..."
                        style={{ width: "100%", minHeight: 70, background: "#080f08", border: "1px solid #1a2a1a", borderRadius: 6, color: "#e8e8e8", fontSize: 14, padding: "12px", fontFamily: "'EB Garamond', serif", lineHeight: 1.6, resize: "vertical", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <button onClick={handleSharpenRewrite} style={{ width: "100%", padding: "14px", background: "#1a2a1a", border: "1px solid #2a3a2a", borderRadius: 8, color: "#a8e063", fontSize: 15, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3 }}>
                    Hit me.
                  </button>
                </>
              )}
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
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: r.color, fontSize: 20, letterSpacing: 1 }}>{r.label}</span>
                  </div>
                  {r.done && r.output && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => copy(r.output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#777", borderRadius: 4, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
                    </div>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  {!r.done
                    ? <div style={{ display: "flex", gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, animation: `bounce 1s ease-in-out ${i*0.15}s infinite`, opacity: 0.7 }} />)}</div>
                    : <>
                        <p style={{ color: r.value === 6 ? "#f0d090" : "#f0f0f0", fontSize: 15, lineHeight: 1.85, margin: "0 0 16px", fontStyle: r.value === 6 ? "italic" : "normal" }}>{renderOutput(r.output)}</p>
                        <div style={{ borderTop: `1px solid ${r.color}22`, paddingTop: 12 }}>
                          <p style={{ color: "#555", fontSize: 12, fontStyle: "italic", margin: 0 }}>This is a starting point, not a final draft. Steal what works, kill what doesn't. Tequila got you here — your voice takes it home.</p>
                        </div>
                      </>
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
              <button onClick={() => { setWwtdUnlocked(true); setLevel(6); setShowHint(false); setOutput(""); }} style={{ background: "transparent", border: "none", color: "#f5a623", fontSize: 24, fontStyle: "italic", fontWeight: "bold", cursor: "pointer", display: "block", marginBottom: 12, textShadow: "0 0 20px rgba(245,166,35,0.8)", lineHeight: 1.4, fontFamily: "'EB Garamond', serif" }}>
                ...but what would tequila do?
              </button>
              <div style={{ color: "#f5a62399", fontSize: 13, fontStyle: "italic" }}>tap to find out ↑</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, borderTop: "1px solid #111", paddingTop: 24 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#777", fontSize: 18, letterSpacing: 3, marginBottom: 6 }}>What Would Tequila Do</div>
          <div style={{ color: "#555", fontSize: 13, fontStyle: "italic" }}>The book. Coming soon.</div>
        </div>
      </div>
    </div>
  );
}
