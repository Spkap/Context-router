import { RouteContextResponseSchema } from "@/lib/schemas/routeContext.schema";
import type { Mode, RouteContextResponse } from "@/lib/types";
import { getSql } from "./client";

const MAX_RUNS = 20;

export type PersistedRun = {
  runId: string;
  createdAt: string;
  inputSummary: string;
  mode: Mode;
  response: RouteContextResponse;
};

type SaveRouteRunInput = {
  response: RouteContextResponse;
  dailyDump: string;
  voiceSamples: string;
};

type RunRow = {
  id: string;
  created_at: string | Date;
  input_summary: string;
  mode: Mode;
  response_json: unknown;
};

function toPersistedRun(row: RunRow): PersistedRun {
  const response = RouteContextResponseSchema.parse(row.response_json);

  return {
    runId: row.id,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
    inputSummary: row.input_summary,
    mode: row.mode,
    response,
  };
}

export async function saveRouteRun({
  response,
  dailyDump,
  voiceSamples,
}: SaveRouteRunInput) {
  const sql = getSql();

  await sql.query(
    "INSERT INTO runs (" +
      "id, created_at, mode, input_summary, daily_dump, voice_samples, response_json" +
      ") VALUES ($1, $2::timestamptz, $3, $4, $5, $6, $7::jsonb) " +
      "ON CONFLICT (id) DO UPDATE SET " +
      "created_at = EXCLUDED.created_at, " +
      "mode = EXCLUDED.mode, " +
      "input_summary = EXCLUDED.input_summary, " +
      "daily_dump = EXCLUDED.daily_dump, " +
      "voice_samples = EXCLUDED.voice_samples, " +
      "response_json = EXCLUDED.response_json",
    [
      response.run.runId,
      response.run.createdAt,
      response.run.mode,
      response.run.inputSummary,
      dailyDump,
      voiceSamples,
      JSON.stringify(response),
    ],
  );
}

export async function listRouteRuns(limit = MAX_RUNS): Promise<PersistedRun[]> {
  const sql = getSql();
  const safeLimit = Math.max(1, Math.min(limit, MAX_RUNS));

  const rows = (await sql.query(
    "SELECT id, created_at, input_summary, mode, response_json " +
      "FROM runs ORDER BY created_at DESC LIMIT $1",
    [safeLimit],
  )) as RunRow[];

  return rows.map(toPersistedRun);
}
