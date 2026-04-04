import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { value: 1, label: "Hello There",           short: "HELLO", desc: "Late funnel, warm relationships. You've earned their attention — now lead them home.",        color: "#a8e063", glow: "rgba(168,224,99,0.25)",  emoji: "👀" },
  { value: 2, label: "Say What Now",          short: "SAY W", desc: "Mid funnel, some familiarity. Follow-ups, second touch, people who know your name.",           color: "#f9c74f", glow: "rgba(249,199,79,0.25)",  emoji: "🤨" },
  { value: 3, label: "Oh That's Dangerous",   short: "DNGRS", desc: "Mid to top of funnel. Your network, people who follow you but don't know you well.",          color: "#f8961e", glow: "rgba(248,150,30,0.3)",   emoji: "😏" },
  { value: 4, label: "Someone Call Security", short: "SECUR", desc: "Top of funnel, cold outreach, first DMs, first emails. You need to stop the scroll.",     color: "#f3722c", glow: "rgba(243,114,44,0.35)",  emoji: "🚨" },
  { value: 5, label: "I'm Not Okay",          short: "NOT OK",desc: "Complete strangers, brutal inboxes. When you're one of 30 pitches hitting them today.",           color: "#e63946", glow: "rgba(230,57,70,0.4)",    emoji: "😵" },
];
const WWTD = { value: 6, label: "What Would Tequila Do", short: "WWTD", desc: "When you need to be unforgettable to a stranger, or just want to have some fun with the people who know you best.", color: "#f5a623", glow: "rgba(245,166,35,0.6)", emoji: "🥃" };
const ALL_LEVELS = [...LEVELS, WWTD];
const SYSTEM_PROMPT = `You are the rewriter behind "What Would Tequila Do" — a tool that transforms bland, safe, forgettable communication into something that cuts through noise.

CRITICAL RULE: At every level, you MUST preserve ALL factual content from the original — names, numbers, claims, statistics, product details, calls to action, and specific benefits. The creativity is in the DELIVERY, never the content. Facts survive everything.

LEVEL 1 - HELLO THERE: Sharper, cleaner, more confident. Strip all corporate flab. Real spine. Still professional but finally has a pulse.

LEVEL 2 - SAY WHAT NOW: Punchy and direct. Says the thing people think but never write. Makes someone read it again out loud to the person next to them.

LEVEL 3 - OH THAT'S DANGEROUS: Bold creative angles. Unexpected metaphors. Confident to the point of confrontational. Gets screenshotted and sent with no caption. Even if the input is already bold, push it further — find the sharpest angle and lead with it. Cut anything that softens the point.

LEVEL 4 - SOMEONE CALL SECURITY: This should not be allowed. Even if the input is already good, already bold, already sharp — it is not sharp enough. Tear it apart and rebuild it from the most dangerous sentence in the piece. Cut the length by at least a third. Make every sentence earn its place or kill it. Written by someone who has nothing to lose and finds politeness physically painful. Vivid. Confrontational. Slightly unhinged. The facts survive but the structure does not have to.

LEVEL 5 - I'M NOT OKAY: The original does not exist anymore. You are not rewriting it. You are detonating it. Even if the input is already wild, go somewhere it would never go itself. Cut the length in half. Use fragments. Repetition. Start sentences with And. Or But. Break grammar with intention and make it feel like a choice not a mistake. Find the one idea buried in the original that nobody would say out loud and put it in the first line. End with a single line so raw and specific it makes the reader put their phone down and stare at the ceiling. ALL facts must survive but the form is completely yours.

LEVEL 6 - WHAT WOULD TEQUILA DO: All rules are dead. Fully absurdist — impossible images, language that shouldn't work but captures truth better than anything sensible. Provocative, poetic, unhinged. Every single fact from the original must survive in some form. End with a single line in ALL CAPS that hits like a slap and a revelation simultaneously. Make the reader laugh, wince, and forward it immediately.

Rules: Match level precisely. PRESERVE ALL FACTS. Output ONLY the rewritten text. No preamble. No headers. No level labels. Never start with "I". LENGTH: The rewrite must be roughly the same length as the input — do not expand a short input into a long output. If the input is one sentence, the output should be one sentence. If the input is a paragraph, the output should be a paragraph. CRITICAL — PRESERVE INDUSTRY AND CONTEXT: Never reinterpret or transpose industry-specific terminology. If the original is about finance, keep it about finance. If it is about healthcare, keep it about healthcare. If it is about law, keep it about law. Industry-specific terms, acronyms, and concepts must retain their original meaning — never substitute a term from a different industry even if the acronym matches. The boldness is in the delivery, never in changing what the content is about. BANNED CLICHÉS — never use these: "2am", "3am", "coffee-stained", "burning the midnight oil", "hustle", "game changer", "move the needle", "crushing it", "on a journey", "passionate about", "I am excited to", "synergy", "disruptive", "bleeding edge", "at the end of the day", "it is what it is". Find fresh, specific angles instead. POP CULTURE: When a pop culture angle is requested, use it regardless of the spice level. At lower levels keep it subtle and professional. At higher levels go bigger and bolder with it. Without a specific request, use pop culture sparingly and only when it genuinely sharpens the point.`;

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

const QUESTIONS_PROMPT = `You are a copy sharpener for "What Would Tequila Do". A user has pasted marketing copy and you need to generate 3 to 5 questions that will make the rewrite more specific, personal, and relevant to the actual target audience. ALWAYS make the first question about the specific audience: who exactly is this for, what do you know about them, what keeps them up at night. Then ask about concrete missing details: real numbers, specific differentiators, named outcomes, unique proof points. Never ask generic questions. Respond ONLY with valid JSON in exactly this format, nothing else: {"questions": ["question 1", "question 2", "question 3"]}`;
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

async function callAPI(level, levelLabel, input, formatLabel = "", substanceScore = null, popCultureChoice = "", extraContext = "") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);
  const contextBlock = extraContext ? `\n\nADDITIONAL CONTEXT FROM USER:\n${extraContext}` : "";
  const res = await fetch("/api/rewrite", {
    method: "POST", signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 2000, system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `${substanceScore !== null ? `SUBSTANCE SCORE: ${substanceScore}/10. ${substanceScore <= 4 ? "The input lacks specifics and proof. Be bold in tone but DO NOT invent claims, stats, or outcomes that aren't in the original. Push hard on what IS there." : substanceScore <= 6 ? "Some substance present. Amplify what exists but don't overreach into unearned provocation." : "Strong substance. The proof is here — the provocation is fully earned. Go for it."}\n\n` : ""}Rewrite at level ${level} (${levelLabel})${formatLabel ? ` as a ${formatLabel}${
  formatLabel === "Social Post" ? " (max 280 characters)" :
  formatLabel === "LinkedIn Post" ? " (max 1300 characters)" :
  formatLabel === "Ad Copy" ? " (max 150 characters)" :
  formatLabel === "Elevator Pitch" ? " (max 300 characters)" :
  formatLabel === "Bio" ? " (max 300 characters)" :
  formatLabel === "Email" ? " (must include a subject line)" : ""
}` : ""}:\n\n${input}${contextBlock}${popCultureChoice ? `\n\nFINAL INSTRUCTION — THIS IS MANDATORY: You MUST include a specific reference from ${popCultureChoice === "Surprise" ? "any pop culture universe of your choice — be unexpected and creative" : popCultureChoice}. YOU choose which specific property, character, scene, or moment to use — do not ask the user for clarification. Just pick one and use it. Name it specifically and weave it naturally into the copy. Do not skip this. Do not ask questions.` : ""}` }]
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

async function fetchQuestions(input) {
  const res = await fetch("/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 400, system: QUESTIONS_PROMPT,
      messages: [{ role: "user", content: input }]
    })
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]).questions || [];
    return [];
  } catch { return []; }
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
  const [popCulture, setPopCulture] = useState("");
  const [showFormat, setShowFormat] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);
  const [showPopCulture, setShowPopCulture] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [popCultureOpen, setPopCultureOpen] = useState(false); // eslint-disable-line
  const scoreTimer = useRef(null);

  const isWWTD = level === 6;
  const currentLevel = isWWTD ? WWTD : LEVELS[level - 1];
  const activeLevels = wwtdUnlocked ? ALL_LEVELS : LEVELS;

  useEffect(() => {
    if (scoreTimer.current) clearTimeout(scoreTimer.current);
    if (input.trim().length < 30) { setSubstance(null); setShowQuestions(false); setQuestions([]); setAnswers({}); return; }
    scoreTimer.current = setTimeout(async () => {
      setScoringSubstance(true);
      const result = await scoreSubstance(input);
      setSubstance(result);
      setScoringSubstance(false);
    }, 1500);
    return () => clearTimeout(scoreTimer.current);
  }, [input]);

  const handleRevealQuestions = async () => {
    setShowQuestions(true);
    if (questions.length > 0) return;
    setLoadingQuestions(true);
    const qs = await fetchQuestions(input);
    setQuestions(qs);
    const initAnswers = {};
    qs.forEach((_, i) => { initAnswers[i] = ""; });
    setAnswers(initAnswers);
    setLoadingQuestions(false);
  };

  const buildExtraContext = () => {
    if (questions.length === 0) return "";
    return questions
      .map((q, i) => answers[i]?.trim() ? `Q: ${q}\nA: ${answers[i].trim()}` : null)
      .filter(Boolean)
      .join("\n\n");
  };

  const rewrite = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput(""); setShowHint(false); setTimedOut(false);
    const timeoutWarning = setTimeout(() => setTimedOut(true), 30000);
    try {
      const extraContext = buildExtraContext();
      const text = await callAPI(level, currentLevel.label, input, format, substance ? substance.score : null, popCulture, extraContext);
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
    setInput(""); setOutput(""); setSubstance(null); setLevel(1); setTab("rewrite");
    setWwtdUnlocked(false); setShowHint(false); setGlitching(false);
    setCompareResults([]); setHistory([]); setSidebarOpen(false); setTimedOut(false);
    setFormat(""); setShowFormat(false); setShowPopCulture(false);
    setLinkCopied(false); setLinkLoading(false);
    setShowQuestions(false); setQuestions([]); setAnswers({}); setLoadingQuestions(false); setFormatOpen(false); setPopCultureOpen(false);
  };

  const scoreColor = substance ? (substance.score <= 3 ? "#e63946" : substance.score <= 5 ? "#f3722c" : substance.score <= 7 ? "#f9c74f" : "#a8e063") : "#555";
  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#e8e8e8", fontFamily: "'Lora', Georgia, serif", transition: "background 0.6s", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 0 20px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 40px rgba(245,166,35,0.6),0 0 80px rgba(245,166,35,0.2)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scoreIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <div style={{ position: "fixed", top: 0, right: sidebarOpen ? 0 : -380, width: 360, height: "100vh", background: "#0f0f1e", borderLeft: "1px solid #1e1e35", zIndex: 100, transition: "right 0.3s", overflowY: "auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ color: "#aaa", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>History</div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {history.length === 0
          ? <div style={{ color: "#bbb", fontSize: 14, fontStyle: "italic" }}>No rewrites yet.</div>
          : history.map(h => (
            <div key={h.id} style={{ marginBottom: 16, background: "#080810", border: `1px solid ${h.level.color}33`, borderRadius: 8, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: h.level.color, fontSize: 13, fontWeight: "bold" }}>{h.level.emoji} {h.level.label}</span>
                <span style={{ color: "#bbb", fontSize: 11 }}>{h.ts}</span>
              </div>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 8, fontStyle: "italic" }}>{h.input}</div>
              <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{h.output.slice(0, 140)}...</div>
              <button onClick={() => copy(h.output)} style={{ background: "none", border: "1px solid #222", color: "#999", borderRadius: 4, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
            </div>
          ))
        }
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button onClick={handleReset} style={{ background: "none", border: "1px solid #2a2a40", color: "#aaa", borderRadius: 6, padding: "7px 16px", fontSize: 12, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", fontFamily: "EB Garamond, serif" }}>🍹 Clear the Bar</button>
            <a href="https://whatwouldtequilado.com/#signup" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, letterSpacing: 2, color: "#a8e063", border: "1px solid #a8e06366", borderRadius: 6, padding: "7px 16px", textDecoration: "none", fontFamily: "'Lora', serif", whiteSpace: "nowrap", textTransform: "uppercase" }}>📖 Book Coming Soon — Get Notified</a>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "1px solid #2a2a40", color: "#aaa", borderRadius: 6, padding: "7px 16px", fontSize: 12, letterSpacing: 2, cursor: "pointer", textTransform: "uppercase", fontFamily: "'Lora', serif" }}>
              {history.length > 0 ? `History (${history.length})` : "History"}
            </button>
          </div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#aaa", textTransform: "uppercase", marginBottom: 10, fontStyle: "italic" }}>An <span style={{ color: "#f5a623" }}>Edge Engine</span> Tool From</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, letterSpacing: 3, margin: "0 0 10px", lineHeight: 1, background: isWWTD ? "linear-gradient(135deg, #f5a623, #ffd700, #f5a623)" : "linear-gradient(135deg, #a8e063, #f9c74f, #f8961e, #e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {isWWTD ? <GlitchText text="What Would Tequila Do" active={glitching} /> : "What Would Tequila Do"}
          </h1>
          <div style={{ color: "#aaa", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>Cut through the bland</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["rewrite", "compare"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "13px", background: tab === t ? "#1e1e35" : "transparent", border: `1px solid ${tab === t ? "#2a2a45" : "#1e1e35"}`, borderRadius: 8, color: tab === t ? "#ddd" : "#777", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Lora', serif" }}>
              {t === "rewrite" ? "✍️ Rewrite" : "⚡ Run the Gauntlet"}
            </button>
          ))}
        </div>
        <div style={{ background: isWWTD ? "#110900" : "#0f0f1e", border: `1px solid ${isWWTD ? "#3a2500" : "#1e1e35"}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 60px ${currentLevel.glow}`, transition: "all 0.5s", marginBottom: 16 }}>
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ color: "#bbb", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Step 1: The Bland Original</div>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your copy here..." style={{ width: "100%", minHeight: 130, background: isWWTD ? "#0a0600" : "#080810", border: `1px solid ${isWWTD ? "#2a1800" : "#1e1e35"}`, borderRadius: 8, color: "#e8e8e8", fontSize: 15, padding: "16px", fontFamily: "'Lora', serif", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />

            {(scoringSubstance || substance) && (
              <div style={{ margin: "14px 0 4px", padding: "14px 16px", background: "#080810", border: `1px solid ${scoreColor}33`, borderRadius: 8, animation: "scoreIn 0.3s" }}>
                {scoringSubstance ? (
                  <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>Checking substance...</div>
                ) : substance && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#aaa", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Substance Score</span>
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
                    {!showQuestions && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${scoreColor}22` }}>
                        <button onClick={handleRevealQuestions} style={{ width: "100%", padding: "11px 16px", background: "transparent", border: `1px dashed ${scoreColor}88`, borderRadius: 7, color: "#ccc", fontSize: 13, cursor: "pointer", fontFamily: "'Lora', serif", textAlign: "left", lineHeight: 1.5, animation: "pulse 2s ease-in-out infinite" }}>
                          <span style={{ fontWeight: "600" }}>Get better results — answer 3-5 quick questions first</span>
                          <span style={{ display: "block", color: "#bbb", fontSize: 12, fontStyle: "italic", marginTop: 3 }}>Spice gets attention. Substance keeps it. Skip if you're in a rush.</span>
                        </button>
                      </div>
                    )}
                    {showQuestions && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${scoreColor}22`, animation: "fadeIn 0.3s" }}>
                        {loadingQuestions ? (
                          <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>Finding the right questions...</div>
                        ) : (
                          <>
                            <div style={{ color: "#aaa", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Answer what you can. Skip what you can't.</div>
                            {questions.map((q, i) => (
                              <div key={i} style={{ marginBottom: 16 }}>
                                <div style={{ color: "#bbb", fontSize: 14, marginBottom: 7, lineHeight: 1.6 }}>{i + 1}. {q}</div>
                                <textarea value={answers[i] || ""} onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))} placeholder="Your answer (or leave blank to skip)..." style={{ width: "100%", minHeight: 60, background: "#080810", border: "1px solid #1e1e35", borderRadius: 6, color: "#e8e8e8", fontSize: 14, padding: "10px 12px", fontFamily: "'Lora', serif", lineHeight: 1.6, resize: "vertical", boxSizing: "border-box" }} />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {tab === "rewrite" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #1e1e35" }}>
                <button onClick={() => setShowFormat(!showFormat)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: showFormat ? 10 : 0 }}>
                  <div style={{ color: format ? "#e8e8e8" : "#bbb", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Step 2: Pick Your Format (optional)</div>
                  <div style={{ color: format ? "#a8e063" : "#555", fontSize: 11 }}>{format ? `✓ ${format}` : showFormat ? "▲" : "▼"}</div>
                </button>
                {showFormat && (
                  <div style={{ position: "relative", width: "100%" }}>
                    <button onClick={() => setFormatOpen(!formatOpen)} style={{ width: "100%", padding: "12px 16px", background: "#080810", border: `1px solid ${format ? "#2a2a50" : "#1e1e35"}`, borderRadius: 8, color: format ? "#a8e063" : "#aaa", fontSize: 12, fontFamily: "'Lora', serif", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: 2, textTransform: "uppercase" }}>
                      <span>{format ? format.toUpperCase() : "NO FORMAT — JUST MAKE IT BOLDER"}</span>
                      <span style={{ fontSize: 11 }}>{formatOpen ? "▲" : "▼"}</span>
                    </button>
                    {formatOpen && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0f0f1e", border: "1px solid #2a2a50", borderRadius: 8, zIndex: 50, marginTop: 4, overflow: "hidden" }}>
                        {[
                          { value: "", label: "NO FORMAT — JUST MAKE IT BOLDER" },
                          { value: "Social Post", label: "SOCIAL POST (X, BLUESKY, THREADS)" },
                          { value: "LinkedIn Post", label: "LINKEDIN POST" },
                          { value: "Ad Copy", label: "AD COPY" },
                          { value: "Elevator Pitch", label: "ELEVATOR PITCH" },
                          { value: "Press Release", label: "PRESS RELEASE" },
                          { value: "Bio", label: "BIO" },
                          { value: "Email", label: "EMAIL (WITH SUBJECT LINE)" },
                          { value: "Boilerplate", label: "BOILERPLATE / ABOUT" },
                          { value: "LinkedIn DM", label: "LINKEDIN DM (COLD OUTREACH)" },
                        ].map(opt => (
                          <button key={opt.value} onClick={() => { setFormat(opt.value); setFormatOpen(false); }} style={{ width: "100%", padding: "11px 16px", background: format === opt.value ? "#1e1e35" : "transparent", border: "none", borderBottom: "1px solid #1a1a2e", color: format === opt.value ? "#a8e063" : "#bbb", fontSize: 12, fontFamily: "'Lora', serif", cursor: "pointer", textAlign: "left", display: "block", letterSpacing: 2, textTransform: "uppercase" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#1e1e35"; e.currentTarget.style.color = "#a8e063"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = format === opt.value ? "#1e1e35" : "transparent"; e.currentTarget.style.color = format === opt.value ? "#a8e063" : "#bbb"; }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #1e1e35" }}>
                <button onClick={() => setShowPopCulture(!showPopCulture)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: showPopCulture ? 10 : 0 }}>
                  <div style={{ color: popCulture ? "#e8e8e8" : "#bbb", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Step 3: Add a Pop Culture Angle (optional)</div>
                  <div style={{ color: popCulture ? "#a8e063" : "#555", fontSize: 11 }}>{popCulture ? `✓ ${popCulture}` : showPopCulture ? "▲" : "▼"}</div>
                </button>
                {showPopCulture && (
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                      {[
                        { value: "Sci-Fi", label: "🚀 Sci-Fi" },
                        { value: "Fantasy", label: "🧙 Fantasy" },
                        { value: "Crime & Drama", label: "🔫 Crime & Drama" },
                        { value: "Comedy (sitcoms, stand-up, comedic films — The Office, Ted Lasso, Seinfeld, Arrested Development, Anchorman, Step Brothers)", label: "😂 Comedy" },
                        { value: "Music", label: "🎵 Music" },
                        { value: "Sport", label: "🏉 Sport" },
                        { value: "Horror", label: "😱 Horror" },
                        { value: "Surprise", label: "🥃 You Pick — Go the tequila way" },
                      ].map(c => (
                        <button key={c.value} onClick={() => setPopCulture(popCulture === c.value ? "" : c.value)} style={{ padding: "8px 14px", background: popCulture === c.value ? "#1e1e35" : "transparent", border: `1px solid ${popCulture === c.value ? "#4a4a70" : "#1e1e35"}`, borderRadius: 20, color: popCulture === c.value ? "#ddd" : "#aaa", fontSize: 11, cursor: "pointer", fontFamily: "'Lora', serif", transition: "all 0.2s", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 2 }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                    {popCulture && <div style={{ color: "#bbb", fontSize: 12, fontStyle: "italic" }}>
                      {["Sci-Fi|Star Wars, Star Trek, The Matrix, Dune...","Fantasy|Lord of the Rings, Game of Thrones, Harry Potter...","Crime & Drama|Breaking Bad, The Wire, Succession, Sopranos...","Comedy|The Office, Ted Lasso, Seinfeld, Arrested Development...","Music|Taylor Swift, Beyoncé, The Beatles, Elvis, AC/DC, Bad Bunny...","Sport|Rugby, Soccer, Super Bowl, Olympics, World Cup...","Horror|Walking Dead, Stranger Things, Get Out...","Surprise|Anything goes. Tequila decides."].find(s => s.startsWith(popCulture + "|"))?.split("|")[1]}
                    </div>}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: "#aaa", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Step 4: Pick Your Spice Level</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {LEVELS.map(l => (
                  <button key={l.value} onClick={() => setLevel(l.value)} style={{ width: "100%", padding: "14px 20px", background: level === l.value ? `${l.color}18` : "#080810", border: `1px solid ${level === l.value ? l.color : "#1e1e35"}`, borderRadius: 8, color: level === l.value ? l.color : "#777", fontSize: 15, fontWeight: level === l.value ? "bold" : "normal", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: "'Lora', serif" }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{l.emoji}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block" }}>{l.label}</span>
                      <span style={{ display: "block", fontSize: 12, color: level === l.value ? `${l.color}cc` : "#666", fontWeight: "normal", marginTop: 4, fontStyle: "italic" }}>{l.desc}</span>
                    </span>
                    {level === l.value && <span style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Selected</span>}
                  </button>
                ))}
                {wwtdUnlocked && (
                  <button onClick={() => setLevel(6)} style={{ width: "100%", padding: "14px 20px", background: isWWTD ? `${WWTD.color}18` : "#080810", border: `1px solid ${isWWTD ? WWTD.color : "#3a2500"}`, borderRadius: 8, color: isWWTD ? WWTD.color : "#f5a62388", fontSize: 15, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: "'Lora', serif" }}>
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
                <button onClick={rewrite} disabled={!input.trim() || loading} style={{ flex: 1, background: input.trim() && !loading ? (isWWTD ? "linear-gradient(135deg,#f5a623,#e8890a)" : `linear-gradient(135deg,${currentLevel.color},${LEVELS[Math.min(level,4)-1].color})`) : "#1e1e35", color: input.trim() && !loading ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 15, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.3s", fontFamily: "'Lora', serif" }}>
                  {loading ? "Rewriting..." : isWWTD ? "🥃 WWTD?" : `${currentLevel.emoji} Make it ${currentLevel.label} →`}
                </button>
                <button onClick={randomLevel} title="Random level" style={{ background: "#080810", border: "1px solid #1e1e35", color: "#aaa", borderRadius: 8, padding: "16px 18px", fontSize: 18, cursor: "pointer" }}>🎲</button>
              </div>
            </div>
          )}

          {tab === "compare" && (
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>Runs your copy through all {activeLevels.length} levels sequentially. See the full arc at once.</p>
              <button onClick={runGauntlet} disabled={!input.trim() || comparing} style={{ width: "100%", background: input.trim() && !comparing ? "linear-gradient(135deg,#a8e063,#f9c74f,#f8961e,#e63946)" : "#1e1e35", color: input.trim() && !comparing ? "#000" : "#444", border: "none", borderRadius: 8, padding: "16px", fontSize: 15, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", cursor: input.trim() && !comparing ? "pointer" : "not-allowed", fontFamily: "'Lora', serif" }}>
                {comparing ? "Running..." : "⚡ Run the Gauntlet"}
              </button>
            </div>
          )}
        </div>
        {timedOut && loading && (
          <div style={{ textAlign: "center", padding: "16px", background: "#1a0a00", border: "1px solid #f3722c44", borderRadius: 10, marginBottom: 16, animation: "fadeIn 0.4s" }}>
            <p style={{ color: "#f3722c", fontSize: 15, fontStyle: "italic", margin: 0 }}>
              This is too hot for even super fast broadband to handle. Please refresh and try again. You're worth it.
            </p>
          </div>
        )}

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
                    <button onClick={() => copy(output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: copied ? currentLevel.color : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'Lora', serif" }}>{copied ? "Copied ✓" : "Copy"}</button>
                    <button onClick={getShareLink} style={{ background: "transparent", border: "1px solid #2a2a40", color: linkCopied ? currentLevel.color : "#777", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'Lora', serif" }}>{linkLoading ? "Saving..." : linkCopied ? "Link Copied ✓" : "Get Link"}</button>
                  </div>
                )}
              </div>
            </div>
            {output && output !== "TIMEOUT" && !loading && (
              <div style={{ padding: "10px 28px", borderBottom: `1px solid ${currentLevel.color}22`, borderLeft: `3px solid ${currentLevel.color}88`, background: isWWTD ? "#0d0700" : "#0c0c1e" }}>
                <p style={{ color: "#aaa", fontSize: 13, fontStyle: "italic", margin: 0, letterSpacing: 0.5 }}>90% done. Add your voice, your specifics, your story for the last 10%.</p>
              </div>
            )}
            <div style={{ padding: "28px" }}>
              {loading
                ? <div><div style={{ color: currentLevel.color, fontStyle: "italic", fontSize: 15, marginBottom: 16 }}>{isWWTD ? "Tequila is thinking..." : `Making it ${currentLevel.label}...`}</div><div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: currentLevel.color, animation: `bounce 1s ease-in-out ${i*0.15}s infinite` }} />)}</div></div>
                : output === "TIMEOUT"
                  ? <p style={{ color: "#f3722c", fontSize: 15, fontStyle: "italic", margin: 0 }}>This is too hot for even super fast broadband to handle. Please refresh and try again. You're worth it.</p>
                  : <p style={{ color: isWWTD ? "#f0d090" : "#f0f0f0", fontSize: isWWTD ? 19 : 17, lineHeight: isWWTD ? 2.1 : 1.9, margin: 0, fontStyle: isWWTD ? "italic" : "normal" }}>
                      {renderOutput(output)}
                    </p>
              }
            </div>
          </div>
        )}

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
                    <button onClick={() => copy(r.output)} style={{ background: "transparent", border: "1px solid #2a2a40", color: "#aaa", borderRadius: 4, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  {!r.done
                    ? <div style={{ display: "flex", gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: r.color, animation: `bounce 1s ease-in-out ${i*0.15}s infinite`, opacity: 0.7 }} />)}</div>
                    : <>
                        <p style={{ color: r.value === 6 ? "#f0d090" : "#f0f0f0", fontSize: 15, lineHeight: 1.85, margin: "0 0 16px", fontStyle: r.value === 6 ? "italic" : "normal" }}>{renderOutput(r.output)}</p>
                        <div style={{ borderTop: `1px solid ${r.color}22`, paddingTop: 12 }}>
                          <p style={{ color: "#bbb", fontSize: 12, fontStyle: "italic", margin: 0 }}>This is a starting point, not a final draft. Steal what works, kill what doesn't. Tequila got you here — your voice takes it home.</p>
                        </div>
                      </>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {showHint && !wwtdUnlocked && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <div style={{ display: "inline-block", background: "linear-gradient(135deg,#1a0900,#2d1200)", border: "1px solid #f5a62355", borderRadius: 10, padding: "24px 40px", animation: "pulse 2s infinite" }}>
              <div style={{ color: "#f5a623", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, opacity: 0.8 }}>Wait. There's more.</div>
              <button onClick={() => { setWwtdUnlocked(true); setLevel(6); setShowHint(false); setOutput(""); }} style={{ background: "transparent", border: "none", color: "#f5a623", fontSize: 24, fontStyle: "italic", fontWeight: "bold", cursor: "pointer", display: "block", marginBottom: 12, textShadow: "0 0 20px rgba(245,166,35,0.8)", lineHeight: 1.4, fontFamily: "'Lora', serif" }}>
                ...but what would tequila do?
              </button>
              <div style={{ color: "#f5a62399", fontSize: 13, fontStyle: "italic" }}>tap to find out</div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, borderTop: "1px solid #111", paddingTop: 24 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#aaa", fontSize: 18, letterSpacing: 3, marginBottom: 6 }}>What Would Tequila Do</div>
          <div style={{ color: "#bbb", fontSize: 13, fontStyle: "italic" }}>The book. Coming soon.</div>
        </div>
      </div>
    </div>
  );
}