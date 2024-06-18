"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkC7XBEPVOjs = require('./chunk-C7XBEPVO.js');




var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/common/endowments/network.ts
var _utils = require('@metamask/utils');
var _teardownRef, _ogResponse, _onStart, _onFinish;
var _ResponseWrapper = class _ResponseWrapper {
  constructor(ogResponse, teardownRef, onStart, onFinish) {
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _teardownRef, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _ogResponse, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _onStart, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _onFinish, void 0);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _ogResponse, ogResponse);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _teardownRef, teardownRef);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _onStart, onStart);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _onFinish, onFinish);
  }
  get body() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).body;
  }
  get bodyUsed() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).bodyUsed;
  }
  get headers() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).headers;
  }
  get ok() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).ok;
  }
  get redirected() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).redirected;
  }
  get status() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).status;
  }
  get statusText() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).statusText;
  }
  get type() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).type;
  }
  get url() {
    return _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).url;
  }
  async text() {
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
      (async () => {
        await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart).call(this);
        try {
          return await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).text();
        } finally {
          await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish).call(this);
        }
      })(),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef)
    );
  }
  async arrayBuffer() {
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
      (async () => {
        await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart).call(this);
        try {
          return await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).arrayBuffer();
        } finally {
          await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish).call(this);
        }
      })(),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef)
    );
  }
  async blob() {
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
      (async () => {
        await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart).call(this);
        try {
          return await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).blob();
        } finally {
          await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish).call(this);
        }
      })(),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef)
    );
  }
  clone() {
    const newResponse = _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).clone();
    return new _ResponseWrapper(
      newResponse,
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish)
    );
  }
  async formData() {
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
      (async () => {
        await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart).call(this);
        try {
          return await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).formData();
        } finally {
          await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish).call(this);
        }
      })(),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef)
    );
  }
  async json() {
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
      (async () => {
        await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onStart).call(this);
        try {
          return await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _ogResponse).json();
        } finally {
          await _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _onFinish).call(this);
        }
      })(),
      _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _teardownRef)
    );
  }
};
_teardownRef = new WeakMap();
_ogResponse = new WeakMap();
_onStart = new WeakMap();
_onFinish = new WeakMap();
var ResponseWrapper = _ResponseWrapper;
var createNetwork = ({ notify } = {}) => {
  _utils.assert.call(void 0, notify, "Notify must be passed to network endowment factory");
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
    return await _chunkC7XBEPVOjs.withTeardown.call(void 0, 
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



exports.network_default = network_default;
//# sourceMappingURL=chunk-PYVUMOEV.js.map