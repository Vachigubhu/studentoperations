import { describe, expect, it, vi, afterEach } from "vitest";
import { logger } from "../utils/logger.js";
import { registerProcessErrorHandlers } from "../utils/process-error-handlers.js";

describe("process error handlers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers uncaught exception and unhandled rejection handlers", () => {
    const processOnSpy = vi.spyOn(process, "on");
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);

    vi.spyOn(logger, "error").mockImplementation(() => undefined);

    registerProcessErrorHandlers();

    expect(processOnSpy).toHaveBeenCalledWith(
      "uncaughtException",
      expect.any(Function),
    );

    expect(processOnSpy).toHaveBeenCalledWith(
      "unhandledRejection",
      expect.any(Function),
    );

    exitSpy.mockRestore();
  });

  it("logs an uncaught exception and exits with code 1", () => {
    const processOnSpy = vi.spyOn(process, "on");

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);

    const loggerSpy = vi
      .spyOn(logger, "error")
      .mockImplementation(() => undefined);

    registerProcessErrorHandlers();

    const registration = processOnSpy.mock.calls.find(
      ([event]) => event === "uncaughtException",
    );

    expect(registration).toBeDefined();

    const handler = registration?.[1] as (error: Error) => void;

    const error = new Error("simulated fatal error");

    handler(error);

    expect(loggerSpy).toHaveBeenCalledWith(
      "Uncaught exception",
      expect.objectContaining({
        error: expect.objectContaining({
          message: "simulated fatal error",
        }),
      }),
    );

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
