"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/interface/utils.ts
var _snapssdk = require('@metamask/snaps-sdk');
var constructInputState = (state, component) => {
  return component.value ?? state[component.name] ?? null;
};
var constructFormInputState = (state, component, form) => {
  const oldFormState = state[form];
  const oldInputState = oldFormState?.[component.name];
  return component.value ?? oldInputState ?? null;
};
var assertNameIsUnique = (state, name) => {
  _snapssdk.assert.call(void 0, 
    state[name] === void 0,
    `Duplicate component names are not allowed, found multiple instances of: "${name}".`
  );
};
var constructState = (oldState, component, newState = {}) => {
  const { type } = component;
  if (type === _snapssdk.NodeType.Panel) {
    return component.children.reduce(
      (acc, node) => constructState(oldState, node, acc),
      newState
    );
  }
  if (type === _snapssdk.NodeType.Form) {
    assertNameIsUnique(newState, component.name);
    newState[component.name] = component.children.reduce(
      (acc, node) => {
        if (node.type === _snapssdk.NodeType.Input) {
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
  if (type === _snapssdk.NodeType.Input) {
    assertNameIsUnique(newState, component.name);
    newState[component.name] = constructInputState(oldState, component);
  }
  return newState;
};






exports.constructInputState = constructInputState; exports.constructFormInputState = constructFormInputState; exports.assertNameIsUnique = assertNameIsUnique; exports.constructState = constructState;
//# sourceMappingURL=chunk-KLK7ZRMH.js.map