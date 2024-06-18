"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkEXN2TFDJjs = require('./chunk-EXN2TFDJ.js');

// src/webview/WebViewExecutorStream.ts
var _postmessagestream = require('@metamask/post-message-stream');
var _utils = require('@metamask/post-message-stream/dist/utils');
var _utils3 = require('@metamask/utils');
var _name, _target, _targetWindow;
var WebViewExecutorStream = class extends _postmessagestream.BasePostMessageStream {
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
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _name, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _target, void 0);
    _chunkEXN2TFDJjs.__privateAdd.call(void 0, this, _targetWindow, void 0);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _name, name);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _target, target);
    _chunkEXN2TFDJjs.__privateSet.call(void 0, this, _targetWindow, targetWindow);
    this._onMessage = this._onMessage.bind(this);
    window.addEventListener("message", this._onMessage, false);
    this._handshake();
  }
  /**
   * Webview needs to receive strings only on postMessage. That's the main difference between this and the original window post message stream.
   * Reference: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md?plain=1#L471
   */
  _postMessage(data) {
    _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _targetWindow).postMessage(
      JSON.stringify({
        target: _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _target),
        data
      })
    );
  }
  _onMessage(event) {
    if (typeof event.data !== "string") {
      return;
    }
    const bytes = _utils3.base64ToBytes.call(void 0, event.data);
    const message = JSON.parse(_utils3.bytesToString.call(void 0, bytes));
    if (!_utils.isValidStreamMessage.call(void 0, message) || message.target !== _chunkEXN2TFDJjs.__privateGet.call(void 0, this, _name)) {
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



exports.WebViewExecutorStream = WebViewExecutorStream;
//# sourceMappingURL=chunk-I5G4YFHM.js.map