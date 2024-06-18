import {
  WebViewExecutorStream
} from "../chunk-7AJWXSDQ.mjs";
import {
  executeLockdownEvents
} from "../chunk-S7257EN3.mjs";
import {
  executeLockdownMore
} from "../chunk-MXNMMTJW.mjs";
import {
  ProxySnapExecutor
} from "../chunk-MIWGLICQ.mjs";
import "../chunk-YRZVIDCF.mjs";

// src/webview/index.ts
executeLockdownMore();
executeLockdownEvents();
var parentStream = new WebViewExecutorStream({
  name: "child",
  // webview
  target: "parent",
  // rnside
  targetWindow: window.ReactNativeWebView
});
ProxySnapExecutor.initialize(parentStream);
//# sourceMappingURL=index.mjs.map