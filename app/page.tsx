"use client";

import { useEffect, useMemo, useState } from "react";
import { RoutingBoard } from "@/components/board/RoutingBoard";
import { DetailPanel } from "@/components/detail/DetailPanel";
import { InputPanel } from "@/components/input/InputPanel";
import { Header } from "@/components/shared/Header";
import { LoadingPipeline, PIPELINE_STEPS } from "@/components/shared/LoadingPipeline";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { BUCKET_ORDER } from "@/lib/bucket-config";
import {
  loadHistory,
  mergeHistoryEntries,
  saveRun,
  type HistoryEntry,
} from "@/lib/history/localHistory";
import { DEFAULT_SAMPLE_CONTEXT, SAMPLE_CONTEXTS } from "@/lib/sample-data";
import type { RewriteCardResponse } from "@/lib/schemas/rewrite.schema";
import type {
  ApiResponse,
  Card,
  Mode,
  RewriteAction,
  RouteContextResponse,
} from "@/lib/types";

function firstCard(result: RouteContextResponse | null) {
  if (!result) {
    return null;
  }

  for (const bucket of BUCKET_ORDER) {
    const card = result.buckets[bucket][0];

    if (card) {
      return card;
    }
  }

  return null;
}

function findCard(result: RouteContextResponse | null, cardId: string | null) {
  if (!result || !cardId) {
    return null;
  }

  for (const bucket of BUCKET_ORDER) {
    const card = result.buckets[bucket].find((item) => item.id === cardId);

    if (card) {
      return card;
    }
  }

  return null;
}

function replaceCard(result: RouteContextResponse, nextCard: Card) {
  const buckets = Object.fromEntries(
    BUCKET_ORDER.map((bucket) => [
      bucket,
      result.buckets[bucket].filter((card) => card.id !== nextCard.id),
    ]),
  ) as RouteContextResponse["buckets"];

  buckets[nextCard.bucket] = [...buckets[nextCard.bucket], nextCard];

  return {
    ...result,
    buckets,
  };
}

function errorMessageFromResponse<T>(payload: ApiResponse<T>) {
  if (payload.ok) {
    return null;
  }

  return payload.error.message;
}

export default function Home() {
  const [dailyDump, setDailyDump] = useState("");
  const [voiceSamples, setVoiceSamples] = useState("");
  const [mode, setMode] = useState<Mode>("founder");
  const [routingResult, setRoutingResult] =
    useState<RouteContextResponse | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [rewritingAction, setRewritingAction] =
    useState<RewriteAction | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(loadHistory());
    }, 0);

    fetch("/api/runs")
      .then((response) => response.json())
      .then((payload: ApiResponse<HistoryEntry[]>) => {
        if (payload.ok) {
          setHistory(mergeHistoryEntries(payload.data));
        }
      })
      .catch(() => {
        // Local history remains usable if server history is temporarily unavailable.
      });

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isRouting) {
      return;
    }

    const timer = window.setInterval(() => {
      setLoadingStep((step) => (step + 1) % PIPELINE_STEPS.length);
    }, 900);

    return () => window.clearInterval(timer);
  }, [isRouting]);

  const atomsById = useMemo(() => {
    return new Map(routingResult?.atoms.map((atom) => [atom.id, atom]) || []);
  }, [routingResult]);

  const selectedCard = findCard(routingResult, selectedCardId);

  function useSample(sampleId: string) {
    const sample =
      SAMPLE_CONTEXTS.find((context) => context.id === sampleId) ||
      DEFAULT_SAMPLE_CONTEXT;

    setDailyDump(sample.dailyDump);
    setVoiceSamples(sample.voiceSamples);
    setMode(sample.mode);
    setError(null);
  }

  function loadRun(entry: HistoryEntry) {
    setRoutingResult(entry.response);
    setMode(entry.mode);
    setError(null);
    setRewriteError(null);
    setSelectedCardId(firstCard(entry.response)?.id || null);
  }

  async function routeCurrentContext() {
    if (dailyDump.trim().length < 10) {
      setError("Paste at least a few notes from your day.");
      return;
    }

    if (dailyDump.length > 5000) {
      setError(
        "This is too much context for the MVP. Please paste one day or one meeting at a time.",
      );
      return;
    }

    setIsRouting(true);
    setLoadingStep(0);
    setError(null);
    setRewriteError(null);

    try {
      const response = await fetch("/api/route-context", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          dailyDump,
          voiceSamples,
          mode,
        }),
      });
      const payload = (await response.json()) as ApiResponse<RouteContextResponse>;

      if (!payload.ok) {
        setError(errorMessageFromResponse(payload));
        return;
      }

      setRoutingResult(payload.data);
      setSelectedCardId(firstCard(payload.data)?.id || null);
      setHistory(saveRun(payload.data));
    } catch {
      setError("Routing failed. Try again with shorter notes.");
    } finally {
      setIsRouting(false);
    }
  }

  async function rewriteSelectedCard(action: RewriteAction) {
    if (!selectedCard || !routingResult) {
      return;
    }

    setRewritingAction(action);
    setRewriteError(null);

    try {
      const response = await fetch("/api/rewrite-card", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          card: selectedCard,
          atoms: routingResult.atoms,
          action,
          voiceSamples,
        }),
      });
      const payload = (await response.json()) as ApiResponse<RewriteCardResponse>;

      if (!payload.ok) {
        setRewriteError(errorMessageFromResponse(payload));
        return;
      }

      const nextResult = replaceCard(routingResult, payload.data.card);
      setRoutingResult(nextResult);
      setSelectedCardId(payload.data.card.id);
    } catch {
      setRewriteError("Routing failed. Try again with shorter notes.");
    } finally {
      setRewritingAction(null);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-canvas">
      <Header />
      <div className="mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-1 overflow-hidden border-x border-border-subtle lg:grid-cols-[320px_minmax(0,1fr)_380px]">
        
        {/* Left Column: Input */}
        <div className="flex h-full flex-col overflow-y-auto border-r border-border-subtle bg-bg-surface">
          <InputPanel
            dailyDump={dailyDump}
            voiceSamples={voiceSamples}
            mode={mode}
            isRouting={isRouting}
            history={history}
            samples={SAMPLE_CONTEXTS}
            onDailyDumpChange={setDailyDump}
            onVoiceSamplesChange={setVoiceSamples}
            onModeChange={setMode}
            onUseSample={useSample}
            onRoute={routeCurrentContext}
            onLoadHistory={loadRun}
          />
        </div>

        {/* Center Column: Board */}
        <div className="flex h-full flex-col overflow-y-auto bg-bg-canvas">
          {(error || (routingResult && !error) || isRouting) ? (
            <div className="shrink-0 space-y-3 border-b border-border-subtle p-4">
              {error ? <StatusMessage tone="error" message={error} /> : null}
              {routingResult && !error ? (
                <StatusMessage
                  tone="success"
                  message="Board routed. Review source support before copying anything public."
                />
              ) : null}
              {isRouting ? <LoadingPipeline activeStep={loadingStep} /> : null}
            </div>
          ) : null}
          <div className="flex-1 p-4">
            <RoutingBoard
              result={routingResult}
              selectedCardId={selectedCardId}
              atomsById={atomsById}
              onSelectCard={setSelectedCardId}
            />
          </div>
        </div>

        {/* Right Column: Detail */}
        <div className="flex h-full flex-col overflow-y-auto border-l border-border-subtle bg-bg-surface">
          <DetailPanel
            card={selectedCard}
            atomsById={atomsById}
            validationIssues={routingResult?.validationIssues || []}
            loadingAction={rewritingAction}
            rewriteError={rewriteError}
            onRewrite={rewriteSelectedCard}
          />
        </div>

      </div>
    </div>
  );
}
