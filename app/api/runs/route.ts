import { apiFailure, apiSuccess } from "@/lib/api/envelope";
import { DatabaseConfigError } from "@/lib/db/client";
import { listRouteRuns } from "@/lib/db/runs";

export const runtime = "nodejs";

export async function GET() {
  try {
    const runs = await listRouteRuns();
    return apiSuccess(runs);
  } catch (error) {
    if (error instanceof DatabaseConfigError) {
      return apiFailure(
        "DATABASE_UNAVAILABLE",
        "Run history is not configured yet. Add DATABASE_URL and run the database migration.",
        500,
      );
    }

    return apiFailure(
      "DATABASE_UNAVAILABLE",
      "Run history could not be loaded.",
      500,
    );
  }
}
