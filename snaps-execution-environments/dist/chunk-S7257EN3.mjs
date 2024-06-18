// src/common/lockdown/lockdown-events.ts
import { hasProperty } from "@metamask/utils";
var targetEvents = /* @__PURE__ */ new Map();
if (hasProperty(globalThis, "UIEvent")) {
  targetEvents.set(UIEvent.prototype, ["view"]);
}
if (hasProperty(globalThis, "MutationEvent")) {
  targetEvents.set(MutationEvent.prototype, ["relatedNode"]);
}
if (hasProperty(globalThis, "MessageEvent")) {
  targetEvents.set(MessageEvent.prototype, ["source"]);
}
if (hasProperty(globalThis, "FocusEvent")) {
  targetEvents.set(FocusEvent.prototype, ["relatedTarget"]);
}
if (hasProperty(globalThis, "MouseEvent")) {
  targetEvents.set(MouseEvent.prototype, [
    "relatedTarget",
    "fromElement",
    "toElement"
  ]);
}
if (hasProperty(globalThis, "TouchEvent")) {
  targetEvents.set(TouchEvent.prototype, ["targetTouches", "touches"]);
}
if (hasProperty(globalThis, "Event")) {
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

export {
  executeLockdownEvents
};
//# sourceMappingURL=chunk-S7257EN3.mjs.map