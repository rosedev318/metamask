import {
  __privateAdd,
  __privateGet,
  __privateSet
} from "./chunk-YRZVIDCF.mjs";

// src/webview/WebViewExecutorStream.ts
import { BasePostMessageStream } from "@metamask/post-message-stream";
import { isValidStreamMessage } from "@metamask/post-message-stream/dist/utils";
import { base64ToBytes, bytesToString } from "@metamask/utils";
var _name, _target, _targetWindow;
var WebViewExecutorStream = class extends BasePostMessageStream {
  /**
   * A special post-message-stream to be used by the WebView executor.
   *
   * This stream is different in a few ways:
   * - It expects data to be base64 encoded
   * - It stringifies the data it posts
   * - It does less validation of origins
   *
   * @param args - Options bag.
   * @param args.name - The name of the stream. Used to differentiate between
   * multiple streams sharing the same window object. child:WebView
   * @param args.target - The name of the stream to exchange messages with. parent:rnside
   * @param args.targetWindow - The window object of the target stream.
   */
  constructor({ name, target, targetWindow }) {
    super();
    __privateAdd(this, _name, void 0);
    __privateAdd(this, _target, void 0);
    __privateAdd(this, _targetWindow, void 0);
    __privateSet(this, _name, name);
    __privateSet(this, _target, target);
    __privateSet(this, _targetWindow, targetWindow);
    this._onMessage = this._onMessage.bind(this);
    window.addEventListener("message", this._onMessage, false);
    this._handshake();
  }
  /**
   * Webview needs to receive strings only on postMessage. That's the main difference between this and the original window post message stream.
   * Reference: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md?plain=1#L471
   */
  _postMessage(data) {
    __privateGet(this, _targetWindow).postMessage(
      JSON.stringify({
        target: __privateGet(this, _target),
        data
      })
    );
  }
  _onMessage(event) {
    if (typeof event.data !== "string") {
      return;
    }
    const bytes = base64ToBytes(event.data);
    const message = JSON.parse(bytesToString(bytes));
    if (!isValidStreamMessage(message) || message.target !== __privateGet(this, _name)) {
      return;
    }
    this._onData(message.data);
  }
  _destroy() {
    window.removeEventListener("message", this._onMessage, false);
  }
};
_name = new WeakMap();
_target = new WeakMap();
_targetWindow = new WeakMap();

export {
  WebViewExecutorStream
};
//# sourceMappingURL=chunk-7AJWXSDQ.mjs.map