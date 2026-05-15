import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  LoadingPipeline,
  PIPELINE_STEPS,
} from "@/components/shared/LoadingPipeline";

describe("LoadingPipeline", () => {
  it("holds on a final waiting state instead of restarting the pipeline", () => {
    render(<LoadingPipeline activeStep={PIPELINE_STEPS.length} />);

    expect(
      screen.getByText("Still routing. Waiting for the model response..."),
    ).toBeTruthy();

    for (const step of PIPELINE_STEPS) {
      expect(screen.getByText(step)).toBeTruthy();
    }
  });
});
