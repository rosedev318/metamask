import {
  rootRealmGlobal
} from "./chunk-IX5S3V47.mjs";

// src/common/endowments/date.ts
function createDate() {
  const keys = Object.getOwnPropertyNames(
    rootRealmGlobal.Date
  );
  let currentTime = 0;
  const now = () => {
    const actual = rootRealmGlobal.Date.now();
    const newTime = Math.round(actual + Math.random());
    if (newTime > currentTime) {
      currentTime = newTime;
    }
    return currentTime;
  };
  const NewDate = function(...args) {
    return Reflect.construct(
      rootRealmGlobal.Date,
      args.length === 0 ? [now()] : args,
      new.target
    );
  };
  keys.forEach((key) => {
    Reflect.defineProperty(NewDate, key, {
      configurable: false,
      writable: false,
      value: key === "now" ? now : rootRealmGlobal.Date[key]
    });
  });
  return { Date: harden(NewDate) };
}
var endowmentModule = {
  names: ["Date"],
  factory: createDate
};
var date_default = endowmentModule;

export {
  date_default
};
//# sourceMappingURL=chunk-UOPIRTJX.mjs.map