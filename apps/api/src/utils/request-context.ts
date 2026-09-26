import { AsyncLocalStorage } from "node:async_hooks";

type RequestContext = {
  requestId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
  run<T>(context: RequestContext, callback: () => T): T {
    return asyncLocalStorage.run(context, callback);
  },

  get(): RequestContext | undefined {
    return asyncLocalStorage.getStore();
  },

  getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  },
};
