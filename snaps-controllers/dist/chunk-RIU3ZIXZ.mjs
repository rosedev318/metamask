// src/interface/utils.ts
import { NodeType, assert } from "@metamask/snaps-sdk";
var constructInputState = (state, component) => {
  return component.value ?? state[component.name] ?? null;
};
var constructFormInputState = (state, component, form) => {
  const oldFormState = state[form];
  const oldInputState = oldFormState?.[component.name];
  return component.value ?? oldInputState ?? null;
};
var assertNameIsUnique = (state, name) => {
  assert(
    state[name] === void 0,
    `Duplicate component names are not allowed, found multiple instances of: "${name}".`
  );
};
var constructState = (oldState, component, newState = {}) => {
  const { type } = component;
  if (type === NodeType.Panel) {
    return component.children.reduce(
      (acc, node) => constructState(oldState, node, acc),
      newState
    );
  }
  if (type === NodeType.Form) {
    assertNameIsUnique(newState, component.name);
    newState[component.name] = component.children.reduce(
      (acc, node) => {
        if (node.type === NodeType.Input) {
          assertNameIsUnique(acc, node.name);
          acc[node.name] = constructFormInputState(
            oldState,
            node,
            component.name
          );
        }
        return acc;
      },
      {}
    );
  }
  if (type === NodeType.Input) {
    assertNameIsUnique(newState, component.name);
    newState[component.name] = constructInputState(oldState, component);
  }
  return newState;
};

export {
  constructInputState,
  constructFormInputState,
  assertNameIsUnique,
  constructState
};
//# sourceMappingURL=chunk-RIU3ZIXZ.mjs.map