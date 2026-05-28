# BroadMind AI

**The Personalised AI Learning OS for India**

> *We don't teach everyone the same way. We learn how you learn — then we adapt every lesson, every quiz, every plan to match.*

---

## 1. Executive Summary

**BroadMind AI** is India's first **ML-personalised, multi-modal AI learning platform** that unifies tutoring, capture, recall, planning, news, and exam prep into a single beautifully-designed studio — accessible via web, mobile, and WhatsApp — in **22+ Indian languages**.

| | |
|---|---|
| **Stage** | MVP shipped, 17 modules live, ML personalisation engine running |
| **Founder** | Kalairajan (Solo / Founding team forming) |
| **Tech stack** | Next.js 16, TypeScript, ML profile (client-side), 5 AI providers, WhatsApp bot |
| **Cost / student / month** | ₹8.35 (bootstrap tier) — **89% cheaper than SaaS competitors** |
| **Target market** | 350 M Indian students, Class 8 → PhD |
| **Ask** | **₹50 L seed** for 18-month runway, 50K paid users, regional expansion |

---

## 2. The Problem

India's education market is broken in three ways:

| Problem | Reality |
|---|---|
| **One-size-fits-all teaching** | A student in a Tier-3 town gets the same recorded lecture as someone at IIT — pitched at the average, helping nobody. |
| **Language gap** | 95% of premium ed-tech content is in English; rural learners drop off. |
| **Fragmented tools** | Students juggle 4–6 apps: doubt solver, flashcards, notes, planner, news, mock tests. Each charges separately. |

**Result:** ₹4,500 Cr Indian ed-tech market grew 17% YoY but **80% of students churn within 60 days** because no app *truly* understands them.

---

## 3. The Solution

A **single studio, one private ML profile per student**:

```
        ┌───────────────────────────────────────────────┐
        │   BROADMIND ML PERSONALISATION ENGINE         │
        │   (observes → models → adapts, on-device)     │
        └───────────────────────────────────────────────┘
                              │
   ┌──────────┬───────────────┼───────────────┬──────────┐
   ▼          ▼               ▼               ▼          ▼
 Tutor    Capture          Recall          Today      Pulse
(AI Q&A) (notes+voice+YT) (quiz+cards) (planner)   (news)
   │          │               │               │          │
   └──────────┴───────────────┴───────────────┴──────────┘
                              │
                  Calendar · DNA · CoachBot · WhatsApp
```

**The four pillars:**

1. **🧠 ML Personalisation** — tracks pace, dominant learning style (5 dimensions), per-topic mastery, best study hours, weak/strong areas — all on-device, fully private.
2. **🌍 22+ Indian Languages** — Tamil, Hindi, Telugu, Bengali, Marathi, Gujarati, Punjabi… with native-pronunciation TTS via Sarvam AI.
3. **💬 Multi-modal Input** — type, speak, snap a photo, paste a YouTube URL, upload a PDF. The AI handles all.
4. **📱 Three Access Channels** — Web (rich studio), WhatsApp bot (rural reach), Mobile-responsive PWA.

---

## 4. What We've Built (Shipped MVP)

| Module | What it does | Status |
|---|---|---|
| **Tutor (Doubt Solver)** | Multi-AI (Gemini/Groq/Claude/ChatGPT/Kimi), voice + image input, LaTeX math, code highlighting, conversation history, PDF export | ✅ Live |
| **Capture Studio** | Unified notes + voice memos + YouTube → AI-summarised knowledge | ✅ Live |
| **Recall Arena** | AI-generated MCQ quizzes (3 difficulties) + flashcards with spaced repetition | ✅ Live |
| **Daily News (Pulse)** | AI-curated current affairs filtered by exam interests | ✅ Live |
| **Upcoming Exams** | 24 Indian exams, region + interest filter, countdowns, watchlist | ✅ Live |
| **AI Planner (Today)** | Generates daily study plan from DNA + starred exam + available time | ✅ Live |
| **Learning DNA (Insights)** | Radar chart of style, mastery map, achievements, recommendations | ✅ Live |
| **Coach Bot** | Always-on AI chat orb on every page, with voice I/O | ✅ Live |
| **AI Mascot** | Animated robot welcomes users, narrates each module, speaks 10 languages | ✅ Live |
| **Floating Pomodoro** | Persistent focus timer with daily streak tracking | ✅ Live |
| **Onboarding Quiz** | 5-step calibration to seed the ML profile | ✅ Live |
| **WhatsApp Bot** | Separate Node.js bot for rural reach | ✅ Live |
| Plus: Avatar Tutor, Code Builder, Visualisation, Medical, Engineering, Research Suite, Higher-Ed | Module shells with planned depth | 🚧 Roadmap |

**Two design directions in production:**
- **BroadMind 1** — sidebar layout, dark/light theme, polished and stable
- **BroadMind 2** — Aurora-glass theme, Command Palette (⌘K), Bento dashboard, "the future app"

---

## 5. Tech Architecture (Cost-Optimised)

### 5.1 The router that saves us 80%

```
                User query
                    │
                    ▼
            ┌────────────────────┐
            │ ML PROFILE LOOKUP  │  (client-side, 0ms, free)
            └────────────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │  INTENT CLASSIFIER │
            └────────────────────┘
                    │
       ┌────────────┼────────────┬───────────────┐
       ▼            ▼            ▼               ▼
   Simple Q&A   Complex teach  Vision         Voice
       │            │            │               │
       ▼            ▼            ▼               ▼
   Groq (FREE)  Gemini Flash  Gemini Vision   Web Speech (FREE)
   <1s, $0      ~$0.001/q     ~$0.002/img     Browser-native
```

**Key insight:** 95% of queries are simple recall / clarification → routed to **Groq Llama 3.3 70B (free tier)** at sub-second latency. Only the hard 5% hit paid models.

### 5.2 Full stack

| Layer | Tech | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind 4 | Edge-rendered, mobile-first, free Vercel tier covers 100K users |
| **Animation** | Framer Motion, custom SVG mascot | Zero 3D libraries, runs on ₹5K Android phones |
| **State** | localStorage + IndexedDB | Zero server-side state = zero DB read costs |
| **AI Routing** | Edge runtime route handlers | Routes to 5 LLMs by cost/intent |
| **Personalisation** | Custom ML profile (12 event types, 5 style dims, mastery decay) | All in browser — privacy-first, free at scale |
| **Voice (TTS)** | OpenAI TTS-HD → Sarvam AI → Browser SpeechSynthesis | Tiered fallback keeps free users free |
| **Voice (STT)** | Web Speech API (browser-native) | Free, works offline |
| **WhatsApp** | whatsapp-web.js + Gupshup | Lite-mode, rural users included |
| **Hosting** | Vercel + Supabase | Generous free tiers, scales horizontally |

---

## 6. API Cost Analysis (Per Student / Month)

### 📦 Bootstrap Tier — for free + ₹19/month users

| API | Use case | Usage / user | Cost (₹) |
|---|---|---|---|
| **Groq Llama 3.3 70B** | Text Q&A, quizzes, flashcards, news, planner, coach | ~150 calls × 1K tokens | **₹0.40** (within free tier) |
| **Gemini Flash** | Overflow / structured JSON when Groq rate-limits | ~10 calls/student | **₹0.40** |
| **Gemini Vision** | Photo doubts (math/diagrams) | 5 images | **₹0.75** |
| **Web Speech API** | Voice input + browser TTS | Unlimited | **₹0** |
| **WhatsApp / Gupshup** | Bot conversations | 30 msgs | **₹4.50** |
| **Vercel hosting** | Edge functions + static | 5 MB BW | **₹0.50** |
| **Supabase free tier** | Auth, profile sync, history | shared 500MB DB | **₹0.30** |
| **Storage (R2/S3)** | Uploaded images, voice clips | 5 MB | **₹0.20** |
| **Buffer (15%)** | API spikes, monitoring | — | **₹1.00** |
| **Subtotal — Bootstrap** | | | **₹8.05** |

### 💎 Premium Tier — for ₹49+/month users

Add on top of bootstrap:

| Premium add-on | Use case | Usage | Cost (₹) |
|---|---|---|---|
| **OpenAI TTS-HD** | Studio-quality English voice (Nova, Shimmer) | 6K chars | **₹15.00** |
| **Sarvam AI Bulbul** | Native Indian-language TTS | 3K chars | **₹4.50** |
| **Whisper STT** | Premium voice transcription | 3 min | **₹1.50** |
| **GPT-4o (selective)** | Complex tutoring (top 10% queries) | 2 calls × 2K tokens | **₹0.85** |
| **Claude Sonnet** | Long-context essays, deep reasoning | 1 call/month | **₹0.40** |
| **ElevenLabs (English voice cloning, future)** | Optional avatar voice | 1K chars | **₹2.00** |
| **Subtotal — Premium add-ons** | | | **₹24.25** |
| **Total Premium cost** | | | **₹32.30/student** |

### 🎓 Power-User Tier (₹99–199/month)

Add unlimited usage + early features:

| Power add-on | Use case | Cost (₹) |
|---|---|---|
| **HeyGen / D-ID** | Talking avatar videos (when student requests) | ₹12 |
| **Three.js + Manim renders** | Custom animations | ₹3 |
| **Tldraw SDK** | Live whiteboard | ₹2 |
| **Subtotal** | | **₹17** |
| **Total Power cost** | | **₹49.30/student** |

---

## 7. Unit Economics

| Metric | Free Tier | Basic (₹19) | Pro (₹49) | Premium (₹99) |
|---|---|---|---|---|
| **Revenue / user** | ₹0 | ₹19 | ₹49 | ₹99 |
| **Cost / user** | ₹4* | ₹8 | ₹32 | ₹49 |
| **Gross margin / user** | -₹4 | **₹11** | **₹17** | **₹50** |
| **Gross margin %** | — | 58% | 35% | 51% |
| **LTV (24-month)** | — | ₹264 | ₹408 | ₹1,200 |
| **CAC target** | — | ₹40 | ₹100 | ₹300 |
| **LTV : CAC** | — | **6.6×** | **4.1×** | **4.0×** |

*Free tier has usage caps that keep cost near ₹4

### 📊 Path to ₹1 Cr ARR (within 18 months)

| Month | Free | Basic | Pro | Premium | MRR | Cumulative cost |
|---|---|---|---|---|---|---|
| 3 | 500 | 50 | 10 | 2 | ₹1,648 | ₹19K |
| 6 | 3K | 400 | 70 | 15 | ₹12,490 | ₹95K |
| 9 | 10K | 1.2K | 200 | 50 | ₹37,750 | ₹3.4 L |
| 12 | 25K | 3K | 500 | 150 | ₹96,500 | ₹10 L |
| 18 | 80K | 8K | 1.5K | 500 | **₹2.74 L/mo** | ₹25 L |

**Year-end-18 ARR: ₹32.8 lakh, gross margin ~₹15 L (45%)**

---

## 8. Go-to-Market

### 8.1 Three-channel strategy

| Channel | Audience | Tactic |
|---|---|---|
| **Web/PWA** | Tier 1–2 students (urban, English-fluent) | SEO content, college campus partnerships, Discord communities |
| **WhatsApp** | Tier 2–4 students (rural, vernacular-first) | YouTube ads in regional languages, ASHA worker network, school WhatsApp groups |
| **Schools / Coaching** | B2B2C — bulk licenses | ₹5/student/month for institutions of 500+ |

### 8.2 Distribution unfair advantages

1. **22-language voice** — most ed-tech is English-only. Sarvam AI native TTS is our moat.
2. **WhatsApp-first design** — 530 M WhatsApp users in India, zero install friction.
3. **Free forever tier** — Groq's free quota makes a generous free tier sustainable for us, unsustainable for competitors using OpenAI.
4. **Aurora-grade design** — feels premium; word-of-mouth advantage over functional-but-ugly competitors.

---

## 9. Competitive Landscape

| Player | Strength | Why we win |
|---|---|---|
| **Byju's** | Brand, content library | Burning ₹3K Cr/year; pivoting away from ed-tech. Their ARPU is unsustainable. |
| **Vedantu / Unacademy** | Live tutoring | Live can't scale; our AI tutor is always-on at 1/100th the cost. |
| **Toppr (acquired by Byju's)** | Adaptive practice | Their personalisation is rule-based; ours is ML + multi-dim. |
| **Doubtnut / Brainly** | Doubt solving | Single-feature; we're a full studio. |
| **Khan Academy** | Free, global | English-only, no Indian language depth. |
| **ChatGPT / Gemini direct** | Frontier intelligence | No persistence, no curriculum, no Indian context, no exam calendar. |

**Our category:** **Personalised AI Learning OS** — a category we're defining.

---

## 10. Roadmap

### Phase 1 (next 3 months) — ✅ Done + polish
- ML personalisation engine, 17 modules, WhatsApp bot, multi-lingual voice
- Goal: 5,000 MAU, 200 paid

### Phase 2 (months 4–9) — Depth + Distribution
- **Mock test engine** with 50K previous-year questions (JEE, NEET, UPSC, GATE, SSC)
- **Avatar Tutor** with talking head videos (HeyGen integration)
- **Live whiteboard** (Tldraw)
- **Parent dashboard** for K-12
- **School/coaching admin panel** for bulk licenses
- Tier-2 city marketing push
- Goal: 25,000 MAU, 2,500 paid

### Phase 3 (months 10–18) — Scale + Moat
- **Voice tutor 24/7** — phone-call style AI teacher in Indian languages
- **AR lessons** — point phone at object, learn about it
- **Document Q&A (RAG)** over uploaded textbooks
- **Community features** — peer tutoring, study rooms
- **Regional language expansion** to all 22 official languages
- Goal: 100,000 MAU, 10,000 paid, **₹1 Cr ARR**

---

## 11. Team & Talent Plan

### Current
- **Kalairajan** — Founder, full-stack, product, AI integration. Built the entire MVP solo in 4 weeks.

### Hires with funding
| Role | Salary (₹/mo) | When |
|---|---|---|
| Senior ML Engineer | 1.2 L | Month 1 |
| Senior Frontend | 1 L | Month 2 |
| Backend / DevOps | 1 L | Month 3 |
| Growth / Marketing | 80 K | Month 4 |
| Regional content lead | 60 K | Month 6 |
| Customer Success | 50 K | Month 9 |

---

## 12. Use of Funds — ₹50 lakh ask

| Bucket | ₹ (lakh) | What |
|---|---|---|
| **Engineering team** (12-month runway) | 22 | 4 hires above |
| **AI/API costs** (room to grow to 50K users) | 6 | Groq Pro, Gemini overage, OpenAI for premium, Sarvam |
| **WhatsApp + SMS** (rural distribution) | 4 | Gupshup volume + ASHA worker network |
| **Marketing** | 8 | Regional YouTube, college campus, SEO content |
| **Infrastructure** | 3 | Vercel Pro, Supabase, S3, monitoring |
| **Content production** | 4 | 22-language voice clips, exam Q-banks |
| **Legal / Admin / Buffer** | 3 | Company setup, GST, accounting, contingency |
| **Total** | **50 L** | 18 months runway → ₹1 Cr ARR |

**Equity offered:** 15% on ₹3 Cr valuation (post-money: ₹3.5 Cr)

---

## 13. Why Now

| Tailwind | Why it matters |
|---|---|
| **Groq + open-weight models** | Frontier-grade AI at 1/50th the cost — was impossible in 2023 |
| **Sarvam AI** | First time Indian languages have professional TTS quality |
| **530 M WhatsApp users** | Distribution channel that ed-tech hasn't fully tapped |
| **Post-Byju collapse** | Trust in ed-tech is rebuilding; honest, transparent pricing wins |
| **NEP 2020** | Govt push for vernacular learning aligns with our differentiator |
| **GPT-class models on free APIs** | Our unit economics work *because* we're not paying OpenAI directly for every query |

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Groq pulls free tier** | Multi-provider routing already built (5 LLMs); switch in one config line. |
| **OpenAI / Sarvam pricing changes** | Tiered fallback engineered from day 1; browser TTS as floor. |
| **User acquisition cost rises** | WhatsApp + organic + school B2B keep CAC controllable. |
| **Quality concerns** | Every output is provenance-tagged with which AI generated it. |
| **Regulatory (DPDP Act)** | All personalisation is on-device. We literally store nothing about minors on our servers. |

---

## 15. Contact

**Kalairajan**
📧 24n220@psgtech.ac.in
🌐 broadmind.ai (coming soon)
🐙 github.com/kalai220722/broadmind-ai

**Try the demo:** http://broadmind-demo.vercel.app *(after funding lands)*
**Investment terms:** SAFE @ ₹3 Cr valuation cap, or equity per above

---

*BroadMind is the OS layer that India's 350M students have been waiting for.
We're not selling content. We're selling understanding — at ₹19 a month.*
