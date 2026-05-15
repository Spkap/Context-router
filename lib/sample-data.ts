import type { Mode } from "./types";

export type SampleContext = {
  id: string;
  label: string;
  mode: Mode;
  dailyDump: string;
  voiceSamples: string;
};

export const SAMPLE_CONTEXTS: SampleContext[] = [
  {
    id: "day-1",
    label: "Day 1",
    mode: "founder",
    dailyDump: [
      "talked to founder running meta ads for dtc brand",
      "they spend 4-5 hrs/week exporting campaign data and pasting into client reports",
      "pain is not analytics. it is moving data between tools",
      'interesting line: "we have dashboards but still need ops people to make reports"',
      "this is navsi thesis again: b2b software stores work but humans still execute workflow",
      "possible x: software has become the system of record, but humans are still the system of action",
      "possible linkedin: customer discovery keeps pointing to the same gap. teams have dashboards, but still need people to stitch work across tools",
      "need to follow up with rohan and ask for exact weekly reporting flow",
      "ask if we can watch his screen next week",
      "task: turn this into 6 design partner questions about reporting ops",
      "investor-safe update: found clear dtc reporting pain where manual work happens between ads, reports, and client comms",
      "private: do not mention company name publicly",
      "private: don't mention ad spend, client names, or the agency he compared himself to",
      "leave out: had coffee and rewrote landing page copy, not very interesting",
    ].join("\n"),
    voiceSamples: [
      "Software keeps asking humans to behave like routers.",
      "The best wedge is usually not a new dashboard. It is the ugly handoff everyone quietly accepts.",
      "Founder notes are only useful when they become the next correct action.",
      "Less magic. More evidence.",
    ].join("\n"),
  },
  {
    id: "day-2",
    label: "Day 2",
    mode: "founder",
    dailyDump: [
      "worked on navsi cross-page navigation today",
      "agent can create records but still fails when ui state changes after modal closes",
      "need better action trace logs before next demo",
      "approval step for irreversible actions feels important",
      "thinking agents should not just complete workflows. they should show what they did",
      "possible post: agent reliability is less about intelligence and more about observability",
      "possible linkedin: the enterprise agent question is not can it act. it is can a team inspect, approve, and recover from what it did",
      "follow up with kushagra about logging schema",
      "ask him whether trace events should be per action or per user intent",
      "task: add action_trace table sketch and approval checkpoint before delete/update actions",
      "investor-safe update: navigation work exposed reliability requirement around traces, approvals, and ui-state changes",
      "private: current latency is still bad, do not mention publicly",
      "private: do not share demo failure video outside build notes",
      "leave out: spent 40 mins fixing css issue, probably not post-worthy",
    ].join("\n"),
    voiceSamples: [
      "AI agents do not need to sound confident. They need to leave evidence.",
      "I care less about autonomy as a slogan and more about reversibility as product behavior.",
      "A useful AI product should make the next move clearer and the private boundary stronger.",
      "Good software protects the boundary around the output.",
    ].join("\n"),
  },
  {
    id: "day-3",
    label: "Day 3",
    mode: "founder",
    dailyDump: [
      "got selected for founders inc canopy",
      "had call with potential mentor about navsi positioning",
      "campus fund investment call follow-up also pending, keep it honest and short",
      "feedback: don't pitch as onboarding. pitch as execution layer for b2b workflows",
      "need to send updated one-liner by tonight",
      "possible update: narrowing from general agent to workflow execution layer",
      "thinking trust matters more than autonomy in b2b agents",
      "possible x: b2b agents will win on trust before they win on autonomy",
      "possible linkedin: the category is not agent does task. it is workflow execution with approvals, traces, and recovery",
      "campus fund investor asked about pilots. be careful not to overstate users",
      "task: rewrite deck slide 2 and add approvals/traces section",
      "follow up with mentor: send old one-liner + revised one-liner and ask which feels less generic",
      "investor-safe update: selected for canopy and tightened navsi positioning around execution layer",
      "private: do not mention exact fundraising plans",
      "private: do not imply pilots are signed when they are only conversations",
      "leave out: watched 2 hours of youtube and drank too much coffee",
    ].join("\n"),
    voiceSamples: [
      "Trust matters more than autonomy when software touches real workflows.",
      "I do not want to sell a smarter assistant. I want to build the layer that closes the loop.",
      "Early traction is specific people, specific pain, and a sharper next step.",
      "Do not inflate the story. Make the work sharper.",
    ].join("\n"),
  },
  {
    id: "day-4",
    label: "Day 4",
    mode: "student_builder",
    dailyDump: [
      "reworked activate ai fellows video script",
      "want to mention ethindia, suzupay, amazon ml challenge, and navsi without sounding like resume dump",
      "important angle: i build things under pressure and ship",
      "ethindia = team win under 36 hours",
      "suzupay = solo build, no safety net",
      "amazon ml = ai/ml proof",
      "navsi = current founder thesis, b2b workflow execution with traces and approvals",
      "need to record 90-sec video tomorrow morning",
      "possible post: proof of work compounds faster than credentials",
      "possible linkedin: the pattern across my projects is not titles. it is shipping under pressure, learning the domain fast, and making the next version more real",
      "follow up with meera and ask if video sounds too much like a resume",
      "task: cut script to 140 words and keep only one sentence per proof point",
      "investor-safe update: can show history of shipping through ethindia, suzupay, amazon ml, and now navsi",
      "private: don't mention unfinished application drafts publicly",
      "private: don't overclaim suzupay traction or imply amazon ml was a company partnership",
      'leave out: "busy day, lots of work" too generic',
    ].join("\n"),
    voiceSamples: [
      "Proof of work beats vague ambition. Especially when you are still early.",
      "I build better when I stop trying to sound inevitable.",
      "The work is simple: take the messy thing, route it, make the next move obvious.",
      "I do not want a tool that writes around me. I want one that helps me think cleaner.",
    ].join("\n"),
  },
  {
    id: "day-5",
    label: "Day 5",
    mode: "founder",
    dailyDump: [
      "morning: fixed broken route in contextrouter detail panel",
      "daily dump feature feels useful because my notes are never one kind of thing",
      "some notes are posts, some are tasks, some are private, some are trash",
      "need to add leave out bucket to readme because that is the main taste point",
      "bella said after lunch works, reply politely",
      "thinking: most ai writing tools generate more content, but founders need better filtering",
      'possible linkedin post about "what happened today?" instead of "what do you want to write?"',
      "possible x: founders do not need more content from messy notes. they need better judgment about what each note should become",
      "task: deploy stable demo and test with 5 sample dumps",
      "task: make sure every sample tests x, linkedin, follow-up, task, investor update, private, leave out",
      "follow up with bella: ask if 2:30 or 3 works for intro call",
      "investor-safe update: contextrouter now demonstrates full routing board, not just post generation",
      "private: don't share mentor feedback directly",
      "private: don't mention the exact bug if it makes demo look unstable",
      "noise: had dosa, scrolled twitter, changed button radius 3 times",
    ].join("\n"),
    voiceSamples: [
      "A founder's day is not neatly categorized. It is calls, anxiety, product work, follow-ups, and half-good thoughts in one pile.",
      "The private boundary is product value, not compliance theater.",
      "Most AI writing tools generate more. Useful software should help filter.",
      "The best product work usually starts with one annoying manual workflow.",
    ].join("\n"),
  },
];

export const DEFAULT_SAMPLE_CONTEXT = SAMPLE_CONTEXTS[0];

export const SAMPLE_DAILY_DUMP = DEFAULT_SAMPLE_CONTEXT.dailyDump;
export const SAMPLE_VOICE = DEFAULT_SAMPLE_CONTEXT.voiceSamples;
