# ContextRouter

> **Turn messy founder notes into posts, follow-ups, tasks, updates, and private warnings.**

<p>
  <a href="https://context-router.vercel.app/">
    <img src="https://img.shields.io/badge/Try_Live_Demo-context--router.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000000" alt="Try Live Demo" height="30"/>
  </a>
</p>

## Why I Built It

A founder's day is not one clean prompt. It's a pile of calls, notes, product work, user feedback, investor conversations, and half-formed thoughts. Most of it dies because it's not obvious what each piece should become.

Most AI writing tools ask:

> What do you want to write?

ContextRouter asks:

> What actually happened today?

The part I care about most is judgment: deciding what each piece of context should become, and what should not become content at all.

## A Day in the Life

You end the day with notes that look like this:

> talked to founder running meta ads for a DTC brand
> they spend 4-5 hrs/week moving data between tools
> "we have dashboards but still need ops people to make reports"
> follow up with Rohan, ask if we can watch his weekly flow
> task: turn this into 6 design partner questions
> investor-safe: clear pain in DTC reporting workflow
> private: do not mention company name publicly
> leave out: had coffee, tweaked landing page copy

ContextRouter routes it into:

| Bucket | Card |
| :--- | :--- |
| **X Post** | *Software has become the system of record, but humans are still the system of action.* |
| **LinkedIn** | Customer discovery keeps pointing to the same gap: teams have dashboards, but still need people to stitch work across tools. |
| **Follow-up** | Reply to Rohan. Ask if we can watch his weekly reporting flow next week. |
| **Task** | Turn customer conversation into 6 design partner questions about reporting ops. |
| **Investor Update** | Found clear DTC reporting pain where manual work happens between ads, reports, and client comms. |
| **Private** | Company name, ad spend, client names. Do not mention publicly. |
| **Leave Out** | Coffee + landing page copy tweaks. Low signal, not post-worthy. |

One messy dump in. Seven decisions out. Judgment visible, sources traced, noise filtered.

---

## See It in Action

### End-to-End Flow

```mermaid
flowchart TD
  A["<b>Daily Dump</b><br/>+ voice samples · mode"]:::input
  A --> B["Extract Source Snippets<br/><i>type · sensitivity · signal</i>"]:::process
  B --> C{"Validate<br/>source · privacy · claims"}:::gate
  C -.->|"blocking fail<br/>retry once"| B
  C ==> D["Route by sensitivity + mode"]:::process

  D --> X1["X Post"]:::xpost
  D --> X2["LinkedIn"]:::linkedin
  D --> X3["Follow-up"]:::followup
  D --> X4["Task"]:::task
  D --> X5["Investor Update"]:::investor
  D --> X6["Private"]:::private
  D --> X7["Leave Out"]:::leaveout

  X1 & X2 & X3 & X4 & X5 & X6 & X7 --> Z["<b>Inspect</b> sources · <b>Copy</b> · <b>Edit</b> · <b>Rewrite</b>"]:::output

  classDef input fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000
  classDef process fill:#f4f4f5,stroke:#52525b,color:#000
  classDef gate fill:#fee2e2,stroke:#b91c1c,stroke-width:2px,color:#000
  classDef output fill:#dcfce7,stroke:#15803d,stroke-width:2px,color:#000
  classDef xpost fill:#e0f2fe,stroke:#0284c7,color:#000
  classDef linkedin fill:#e0e7ff,stroke:#4f46e5,color:#000
  classDef followup fill:#fef3c7,stroke:#d97706,color:#000
  classDef task fill:#d1fae5,stroke:#059669,color:#000
  classDef investor fill:#ede9fe,stroke:#7c3aed,color:#000
  classDef private fill:#ffe4e6,stroke:#e11d48,color:#000
  classDef leaveout fill:#f4f4f5,stroke:#71717a,color:#000
```

### Routing Board

![ContextRouter routing board](public/screenshots/routing-board.png)

### Source Inspection & Rewrite Actions

<table align="center" width="100%">
  <tr>
    <td align="center" width="50%">
      <img src="public/screenshots/source-inspection.png" alt="ContextRouter source inspection detail panel" width="100%">
      <br>
      <sub><b>Source Inspection</b></sub>
    </td>
    <td width="32"></td>
    <td align="center" width="50%">
      <img src="public/screenshots/rewrite-actions.png" alt="ContextRouter rewrite actions" width="100%">
      <br>
      <sub><b>Rewrite Actions</b></sub>
    </td>
  </tr>
</table>

### Responsive Views

| Mobile | Tablet | Desktop |
| --- | --- | --- |
| ![ContextRouter mobile view](public/screenshots/context-router-mobile.png) | ![ContextRouter tablet view](public/screenshots/context-router-tablet.png) | ![ContextRouter desktop view](public/screenshots/context-router-desktop.png) |

---

## How It Works

### Request Lifecycle

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant FE as Frontend
  participant API as /api/route-context
  participant AI as OpenAI<br/>(Vercel AI SDK)
  participant V as Validators
  participant DB as Neon Postgres

  U->>FE: Paste daily dump + mode
  FE->>API: POST { dailyDump, voiceSamples, mode }
  API->>AI: generateObject(Zod schema)
  AI-->>API: Source snippets + routed cards + drafts

  API->>V: Source / privacy / claim checks

  alt Blocking issues
    V-->>API: Errors
    API->>AI: Strict repair prompt
    AI-->>API: Repaired output
    API->>V: Re-validate
  end

  V-->>API: Pass (+ warnings)
  API->>DB: Save run
  API-->>FE: Board + runId
  FE-->>U: Render routing board
```

### Validation Gates

```mermaid
flowchart TD
  A["Model Output"] --> B{"Source Check"}
  B -->|"missing or unknown snippet"| X["Block"]
  B -->|"pass"| C{"Privacy Check"}

  C -->|"private snippet → public bucket"| X
  C -->|"internal snippet → X / LinkedIn"| X
  C -->|"pass"| D{"Claim Check"}

  D -->|"public claim w/o source"| X
  D -->|"numbers / entities unsupported"| X
  D -->|"pass"| E["Board returned"]:::ok

  X --> Y{"First failure?"}
  Y -->|"yes"| R["Strict repair prompt"] --> A
  Y -->|"no"| F["Fail with issues"]:::fail

  classDef ok fill:#d1fae5,stroke:#059669,color:#000
  classDef fail fill:#ffe4e6,stroke:#e11d48,color:#000
```

**Model:** `gpt-5.4-mini` via the Vercel AI SDK with structured output enforced by Zod. GPT-5 model IDs use reasoning effort; others fall back to low temperature.

## Key Features

- **Capture.** Paste your raw notes, add writing samples if you want voice matching, and pick a mode for your day: *Founder*, *Student Builder*, *Operator*, or *Creator*.
- **Route.** Every note lands in one of seven buckets: X Post, LinkedIn, Follow-up, Task, Investor Update, Private, or Leave Out. *Leave Out* is a real destination, not a fallback. Weak, generic, or unsafe notes get filtered, not polished.
- **Trace.** Every card shows its receipts: the notes it came from, a signal score, a confidence rating, and why it landed where it did.
- **Guard.** Privacy checks keep private and internal notes out of public posts. Source checks catch unsupported claims. If the model slips, it gets one strict retry before anything reaches you.
- **Refine.** Edit drafts inline, or hit a single rewrite action: *sharper*, *shorter*, *make public-safe*, *more like my voice*.
- **Persist.** Recent runs save to Postgres with a local cache for instant reloads. Every failure mode (missing key, model error, quota, DB outage) surfaces with a clear message, not a silent break.

## Tradeoffs & Roadmap

This is an MVP focused on the routing loop. It proves whether a raw daily dump can become useful, source-backed outputs with visible judgment.

| Out of scope | What's next |
| --- | --- |
| Auth, accounts, teams, billing | Gmail / Calendar / Notion import |
| Publishing integrations (X, LinkedIn, etc.) | Voice memo input |
| Auto-posting, scheduling, analytics | Stronger voice matching from past posts |
| Multi-agent backend | Markdown / JSON export |
| Long-term knowledge storage | Shareable run detail page |
| File uploads, voice transcription | Privacy preview before sending to model |
| Full admin interface | Eval set for routing behavior |

---

<p align="center">
  <a href="https://context-router.vercel.app/">
    <img src="https://img.shields.io/badge/Try_Live_Demo-context--router.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000000" alt="Try Live Demo" height="30"/>
  </a>
</p>

<p align="center"><i>Pick a sample dump from the dropdown to see routing in action.</i></p>

---

<p align="center"><sub>Built with</sub></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vercel%20AI%20SDK-black?logo=vercel" alt="Vercel AI SDK"/>
  <img src="https://img.shields.io/badge/Zod-4-3068b7" alt="Zod"/>
  <img src="https://img.shields.io/badge/Neon-Postgres-00e599" alt="Neon Postgres"/>
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License"/>
</p>

## License

[MIT](LICENSE)
