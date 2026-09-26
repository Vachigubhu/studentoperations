import { afterEach, describe, expect, it, vi } from "vitest";
import { EventEmitter } from "node:events";
import type { Server } from "node:http";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { registerShutdownHandlers } from "../utils/shutdown.js";

describe("shutdown handlers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers SIGTERM and SIGINT handlers", () => {
    const processOnSpy = vi.spyOn(process, "on");

    const httpServer = new EventEmitter() as Server;

    registerShutdownHandlers(httpServer);

    expect(processOnSpy).toHaveBeenCalledWith("SIGTERM", expect.any(Function));

    expect(processOnSpy).toHaveBeenCalledWith("SIGINT", expect.any(Function));
  });

  it("logs a shutdown request when SIGTERM is received", async () => {
    const processOnSpy = vi.spyOn(process, "on");

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);

    vi.spyOn(logger, "info").mockImplementation(() => undefined);
    vi.spyOn(logger, "error").mockImplementation(() => undefined);

    vi.spyOn(mongoose.connection, "close").mockResolvedValue();

    const httpServer = new EventEmitter() as Server;

    httpServer.close = ((callback?: () => void) => {
      callback?.();
      return httpServer;
    }) as Server["close"];

    registerShutdownHandlers(httpServer);

    const registration = processOnSpy.mock.calls.find(
      ([event]) => event === "SIGTERM",
    );

    expect(registration).toBeDefined();

    const handler = registration?.[1] as () => void;

    handler();

    await Promise.resolve();

    expect(logger.info).toHaveBeenCalledWith("Shutdown requested", {
      signal: "SIGTERM",
    });

    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
