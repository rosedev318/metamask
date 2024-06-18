"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common/lockdown/lockdown-events.ts
var _utils = require('@metamask/utils');
var targetEvents = /* @__PURE__ */ new Map();
if (_utils.hasProperty.call(void 0, globalThis, "UIEvent")) {
  targetEvents.set(UIEvent.prototype, ["view"]);
}
if (_utils.hasProperty.call(void 0, globalThis, "MutationEvent")) {
  targetEvents.set(MutationEvent.prototype, ["relatedNode"]);
}
if (_utils.hasProperty.call(void 0, globalThis, "MessageEvent")) {
  targetEvents.set(MessageEvent.prototype, ["source"]);
}
if (_utils.hasProperty.call(void 0, globalThis, "FocusEvent")) {
  targetEvents.set(FocusEvent.prototype, ["relatedTarget"]);
}
if (_utils.hasProperty.call(void 0, globalThis, "MouseEvent")) {
  targetEvents.set(MouseEvent.prototype, [
    "relatedTarget",
    "fromElement",
    "toElement"
  ]);
}
if (_utils.hasProperty.call(void 0, globalThis, "TouchEvent")) {
  targetEvents.set(TouchEvent.prototype, ["targetTouches", "touches"]);
}
if (_utils.hasProperty.call(void 0, globalThis, "Event")) {
  targetEvents.set(Event.prototype, [
    "target",
    "currentTarget",
    "srcElement",
    "composedPath"
  ]);
}
function executeLockdownEvents() {
  targetEvents.forEach((properties, prototype) => {
    for (const property of properties) {
      Object.defineProperty(prototype, property, {
        value: void 0,
        configurable: false,
        writable: false
      });
    }
  });
}



exports.executeLockdownEvents = executeLockdownEvents;
//# sourceMappingURL=chunk-4XRZLEKU.js.map