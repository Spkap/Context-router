import type { ApiErrorCode } from "../schemas/routeContext.schema";
import type { ApiFailure, ApiSuccess } from "../types";

export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ ok: true, data } satisfies ApiSuccess<T>, { status });
}

export function apiFailure(
  code: ApiErrorCode,
  message: string,
  status: number,
  issues?: unknown,
) {
  return Response.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(issues ? { issues } : {}),
      },
    } satisfies ApiFailure,
    { status },
  );
}
