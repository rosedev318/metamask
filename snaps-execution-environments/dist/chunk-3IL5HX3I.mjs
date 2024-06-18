import {
  withTeardown
} from "./chunk-HBVPZMDK.mjs";
import {
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-YRZVIDCF.mjs";

// src/common/endowments/network.ts
import { assert } from "@metamask/utils";
var _teardownRef, _ogResponse, _onStart, _onFinish;
var _ResponseWrapper = class _ResponseWrapper {
  constructor(ogResponse, teardownRef, onStart, onFinish) {
    __privateAdd(this, _teardownRef, void 0);
    __privateAdd(this, _ogResponse, void 0);
    __privateAdd(this, _onStart, void 0);
    __privateAdd(this, _onFinish, void 0);
    __privateSet(this, _ogResponse, ogResponse);
    __privateSet(this, _teardownRef, teardownRef);
    __privateSet(this, _onStart, onStart);
    __privateSet(this, _onFinish, onFinish);
  }
  get body() {
    return __privateGet(this, _ogResponse).body;
  }
  get bodyUsed() {
    return __privateGet(this, _ogResponse).bodyUsed;
  }
  get headers() {
    return __privateGet(this, _ogResponse).headers;
  }
  get ok() {
    return __privateGet(this, _ogResponse).ok;
  }
  get redirected() {
    return __privateGet(this, _ogResponse).redirected;
  }
  get status() {
    return __privateGet(this, _ogResponse).status;
  }
  get statusText() {
    return __privateGet(this, _ogResponse).statusText;
  }
  get type() {
    return __privateGet(this, _ogResponse).type;
  }
  get url() {
    return __privateGet(this, _ogResponse).url;
  }
  async text() {
    return await withTeardown(
      (async () => {
        await __privateGet(this, _onStart).call(this);
        try {
          return await __privateGet(this, _ogResponse).text();
        } finally {
          await __privateGet(this, _onFinish).call(this);
        }
      })(),
      __privateGet(this, _teardownRef)
    );
  }
  async arrayBuffer() {
    return await withTeardown(
      (async () => {
        await __privateGet(this, _onStart).call(this);
        try {
          return await __privateGet(this, _ogResponse).arrayBuffer();
        } finally {
          await __privateGet(this, _onFinish).call(this);
        }
      })(),
      __privateGet(this, _teardownRef)
    );
  }
  async blob() {
    return await withTeardown(
      (async () => {
        await __privateGet(this, _onStart).call(this);
        try {
          return await __privateGet(this, _ogResponse).blob();
        } finally {
          await __privateGet(this, _onFinish).call(this);
        }
      })(),
      __privateGet(this, _teardownRef)
    );
  }
  clone() {
    const newResponse = __privateGet(this, _ogResponse).clone();
    return new _ResponseWrapper(
      newResponse,
      __privateGet(this, _teardownRef),
      __privateGet(this, _onStart),
      __privateGet(this, _onFinish)
    );
  }
  async formData() {
    return await withTeardown(
      (async () => {
        await __privateGet(this, _onStart).call(this);
        try {
          return await __privateGet(this, _ogResponse).formData();
        } finally {
          await __privateGet(this, _onFinish).call(this);
        }
      })(),
      __privateGet(this, _teardownRef)
    );
  }
  async json() {
    return await withTeardown(
      (async () => {
        await __privateGet(this, _onStart).call(this);
        try {
          return await __privateGet(this, _ogResponse).json();
        } finally {
          await __privateGet(this, _onFinish).call(this);
        }
      })(),
      __privateGet(this, _teardownRef)
    );
  }
};
_teardownRef = new WeakMap();
_ogResponse = new WeakMap();
_onStart = new WeakMap();
_onFinish = new WeakMap();
var ResponseWrapper = _ResponseWrapper;
var createNetwork = ({ notify } = {}) => {
  assert(notify, "Notify must be passed to network endowment factory");
  const openConnections = /* @__PURE__ */ new Set();
  const teardownRef = { lastTeardown: 0 };
  const cleanup = new FinalizationRegistry(
    /* istanbul ignore next: can't test garbage collection without modifying node parameters */
    (callback) => callback()
  );
  const _fetch = async (input, init) => {
    const abortController = new AbortController();
    if (init?.signal !== null && init?.signal !== void 0) {
      const originalSignal = init.signal;
      originalSignal.addEventListener(
        "abort",
        () => {
          abortController.abort(originalSignal.reason);
        },
        { once: true }
      );
    }
    let started = false;
    const onStart = async () => {
      if (!started) {
        started = true;
        await notify({
          method: "OutboundRequest",
          params: { source: "fetch" }
        });
      }
    };
    let finished = false;
    const onFinish = async () => {
      if (!finished) {
        finished = true;
        await notify({
          method: "OutboundResponse",
          params: { source: "fetch" }
        });
      }
    };
    let res;
    let openFetchConnection;
    return await withTeardown(
      (async () => {
        try {
          await notify({
            method: "OutboundRequest",
            params: { source: "fetch" }
          });
          const fetchPromise = fetch(input, {
            ...init,
            signal: abortController.signal
          });
          openFetchConnection = {
            cancel: async () => {
              abortController.abort();
              try {
                await fetchPromise;
              } catch {
              }
            }
          };
          openConnections.add(openFetchConnection);
          res = new ResponseWrapper(
            await fetchPromise,
            teardownRef,
            onStart,
            onFinish
          );
        } finally {
          if (openFetchConnection !== void 0) {
            openConnections.delete(openFetchConnection);
          }
          await notify({
            method: "OutboundResponse",
            params: { source: "fetch" }
          });
        }
        if (res.body !== null) {
          const body = new WeakRef(res.body);
          const openBodyConnection = {
            cancel: (
              /* istanbul ignore next: see it.todo('can be torn down during body read') test */
              async () => {
                try {
                  await body.deref()?.cancel();
                } catch {
                }
              }
            )
          };
          openConnections.add(openBodyConnection);
          cleanup.register(
            res.body,
            /* istanbul ignore next: can't test garbage collection without modifying node parameters */
            () => openConnections.delete(openBodyConnection)
          );
        }
        return harden(res);
      })(),
      teardownRef
    );
  };
  const teardownFunction = async () => {
    teardownRef.lastTeardown += 1;
    const promises = [];
    openConnections.forEach(({ cancel }) => promises.push(cancel()));
    openConnections.clear();
    await Promise.all(promises);
  };
  return {
    fetch: harden(_fetch),
    // Request, Headers and Response are the endowments injected alongside fetch
    // only when 'endowment:network-access' permission is requested,
    // therefore these are hardened as part of fetch dependency injection within its factory.
    // These endowments are not (and should never be) available by default.
    Request: harden(Request),
    Headers: harden(Headers),
    Response: harden(Response),
    teardownFunction
  };
};
var endowmentModule = {
  names: ["fetch", "Request", "Headers", "Response"],
  factory: createNetwork
};
var network_default = endowmentModule;

export {
  network_default
};
//# sourceMappingURL=chunk-3IL5HX3I.mjs.map