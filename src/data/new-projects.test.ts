import { describe, expect, test } from "vitest";
import { interviewRules, tokenSaverRules, visualProjects } from "./new-projects";

describe("TokenSaver README-defined safeguards", () => {
  test("worker waits 120 seconds", () => expect(tokenSaverRules.waitSeconds).toBe(120));
  test("maximum two retry attempts", () => expect(tokenSaverRules.maxRetryAttempts).toBe(2));
  test("fallback retrieval retains top three chunks", () => expect(tokenSaverRules.topChunks).toBe(3));
  test("local embeddings are 384 dimensional", () => expect(tokenSaverRules.embeddingDimensions).toBe(384));
  test("cache-hit branches bypass generation", () => {
    const query = visualProjects.find((p) => p.id === "tokensaver")?.flows.find((f) => f.id === "query");
    const hits = query?.branches.filter((b) => b.after === "exact" || b.after === "semantic");
    expect(hits?.length).toBe(2);
    expect(hits?.flatMap((b) => b.nodes).every((n) => n.zone === "local")).toBe(true);
    expect(query?.nodes.find((n) => n.id === "grok")?.zone).toBe("external");
  });
});
describe("AI Interview Pro README-defined safeguards", () => {
  test("speech end threshold is 2.5 seconds", () => expect(interviewRules.speechEndSeconds).toBe(2.5));
  test("inactivity safeguard is 50 seconds", () => expect(interviewRules.inactivitySeconds).toBe(50));
  test("off-screen gaze threshold is greater than three seconds", () => expect(interviewRules.gazeSeconds).toBe(3));
  test("phone confidence threshold is greater than 65 percent", () => expect(interviewRules.phoneConfidencePercent).toBe(65));
  test("violation cooldown is five seconds", () => expect(interviewRules.cooldownSeconds).toBe(5));
  test("three strikes terminates the session", () => expect(interviewRules.terminationStrikes).toBe(3));
  test("vision is browser-side", () => {
    const flow = visualProjects.find((p) => p.id === "interview-pro")?.flows.find((f) => f.id === "proctoring");
    expect(flow?.nodes.find((n) => n.id === "vision")?.zone).toBe("browser");
  });
  test("final decision is human-owned", () => {
    const flow = visualProjects.find((p) => p.id === "interview-pro")?.flows.find((f) => f.id === "evaluation");
    expect(flow?.nodes.find((n) => n.id === "decision")?.zone).toBe("human");
  });
});