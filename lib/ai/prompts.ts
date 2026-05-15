import { BUCKET_ORDER } from "../bucket-config";
import type {
  RouteContextRequest,
  ValidationIssue,
} from "../schemas/routeContext.schema";
import type { RewriteCardRequest } from "../schemas/rewrite.schema";

const SYSTEM_INSTRUCTION = [
  "You are ContextRouter.",
  "",
  "Your job is not to generate as much content as possible.",
  "Your job is to route messy daily context into the right output buckets.",
  "",
  "Use only facts present in the input.",
  "Do not invent metrics, names, achievements, calls, or outcomes.",
  "If something is private or risky, do not use it in public content.",
  "If something is weak or generic, route it to leave_out.",
  "Every generated card must reference at least one source atom.",
  "",
  "Think in this order:",
  "1. Extract atoms.",
  "2. Classify sensitivity.",
  "3. Score signal.",
  "4. Route atoms.",
  "5. Generate drafts.",
  "6. Run slop check.",
  "7. Return final structured board.",
].join("\n");

const MODE_PRIORITIES = {
  founder:
    "Prioritize X posts, LinkedIn, investor updates, follow-ups, user insight extraction, and private warnings.",
  student_builder:
    "Prioritize project updates, fellowship/application material, learning logs, and proof-of-work posts.",
  operator:
    "Prioritize tasks, follow-ups, meeting summaries, and internal updates.",
  creator:
    "Prioritize content-first routing while preserving privacy and source support.",
} as const;

function commonRoutePrompt(input: RouteContextRequest) {
  return [
    SYSTEM_INSTRUCTION,
    "",
    "Mode key: " + input.mode,
    "Mode priority: " + MODE_PRIORITIES[input.mode],
    "",
    "Hard constraints:",
    "- Use exact bucket keys: " + BUCKET_ORDER.join(", ") + ".",
    "- Return every bucket key with an array, even when empty.",
    "- Return every emptyBucketReasons key with a string reason or null.",
    "- Return validationIssues as an array. Use null for cardId or atomId when an issue is not tied to one card or atom.",
    "- Return routingNotes as a string or null on every atom.",
    "- Use atom IDs like atom_001 and card IDs like card_001.",
    "- Keep card.bucket identical to the containing bucket key.",
    "- Generate atoms first, then cite atom IDs from every card.",
    "- Public and investor cards must include claims with sourceAtomIds.",
    "- Do not force a public post from weak input.",
    "- Use leave_out for weak, generic, unsupported, or unsafe-to-publish content.",
    "- Keep X posts short and sharp.",
    "- Keep LinkedIn posts specific and non-corporate.",
    "- Keep investor updates factual and non-hype.",
    "- Keep tasks action-oriented.",
    "- Keep follow-ups copy-ready.",
    "- Avoid em dashes. Use a period, colon, comma, or new sentence instead.",
    "- Private warnings belong in private, not leave_out.",
    "",
    "Routing quality rules:",
    "- A single atom may support multiple cards when that is useful, as long as every use is source-backed and safe.",
    "- Strong opinions or product theses should usually become the primary X post before generic meeting observations.",
    "- In founder mode, if there is a public-safe insight, product thesis, user pain, achievement, or product progress, create a LinkedIn card unless the content is genuinely too weak or unsafe.",
    "- Public-safe user pain can support a LinkedIn insight or task, but do not reveal identities or private details.",
    "- Achievements, concrete product progress, and public-safe user learning can support investor_update cards. A private investor-call warning does not make all investor updates unsafe.",
    "- Reminders with a named person should create a follow_up card whose draft is the actual message to send, not a reminder about the message.",
    "- Product work, user pain, and reminders should create task cards when they imply clear next actions.",
    "- Weak daily-life notes such as coffee or generic coding with no outcome should go to leave_out.",
    "",
    "Format-specific examples:",
    "- X post from opinion atom: 'AI agents do not need more autonomy first. They need better traces.'",
    "- LinkedIn from product/user-pain atoms: 'A pattern I keep seeing while talking to operators: the pain is not that software lacks features. It is that humans still move information between tools manually.'",
    "- Follow-up from 'need to reply to Bella after lunch': 'Hey Bella, anytime after lunch works for me. Please let me know what time is convenient.'",
    "- Task from user pain: 'Turn the Meta ads reporting pain into 5 design partner questions.'",
    "- Investor update from achievement and product work: 'Selected for Founders Inc Canopy; continued ReplayX work; found a public-safe signal around manual reporting pain.'",
    "",
    "Daily dump:",
    input.dailyDump,
    "",
    "Writing samples for style only:",
    input.voiceSamples || "No writing samples provided.",
  ].join("\n");
}

export function buildRouteContextPrompt(input: RouteContextRequest) {
  return commonRoutePrompt(input);
}

export function buildStrictRetryPrompt(
  input: RouteContextRequest,
  validationIssues: ValidationIssue[],
) {
  const issueText = validationIssues.length
    ? validationIssues
        .map((issue) =>
          [
            "- " + issue.code + " (" + issue.severity + ")",
            issue.cardId ? "card: " + issue.cardId : "",
            issue.atomId ? "atom: " + issue.atomId : "",
            issue.message,
          ]
            .filter(Boolean)
            .join(" | "),
        )
        .join("\n")
    : "- The previous output did not match the required schema.";

  return [
    commonRoutePrompt(input),
    "",
    "Retry because the previous output failed validation.",
    "Fix these issues without removing the source/reasoning guarantees:",
    issueText,
    "",
    "Return a complete corrected board. Do not include unsafe public cards.",
  ].join("\n");
}

export function buildRewritePrompt(input: RewriteCardRequest) {
  const sourceAtoms = input.atoms
    .filter((atom) => input.card.sourceAtomIds.includes(atom.id))
    .map(
      (atom) =>
        atom.id +
        " | " +
        atom.sensitivity +
        " | " +
        atom.sourceSnippet +
        " | " +
        atom.cleanedMeaning,
    )
    .join("\n");

  return [
    "You are rewriting one ContextRouter card.",
    "",
    "Action: " + input.action,
    "Rewrite only the selected card.",
    "Preserve the card id unless a bucket-format action requires changing the bucket.",
    "Preserve or reduce risk level. Never increase factual ambition.",
    "Do not add facts, names, metrics, outcomes, or private details.",
    "Avoid em dashes. Use a period, colon, comma, or new sentence instead.",
    "Preserve source support. Every claim must cite existing source atoms.",
    "If changing bucket, choose only a valid ContextRouter bucket key.",
    "",
    "Original card JSON:",
    JSON.stringify(input.card, null, 2),
    "",
    "Allowed source atoms:",
    sourceAtoms || "No matching source atoms found. Do not invent new support.",
    "",
    "Writing samples for style only:",
    input.voiceSamples || "No writing samples provided.",
  ].join("\n");
}
