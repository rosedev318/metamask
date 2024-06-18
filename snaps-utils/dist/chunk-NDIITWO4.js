"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/ui.ts
var _snapssdk = require('@metamask/snaps-sdk');
var _utils = require('@metamask/utils');
var _marked = require('marked');
var ALLOWED_PROTOCOLS = ["https:", "mailto:"];
function getMarkdownLinks(text) {
  const tokens = _marked.lexer.call(void 0, text, { gfm: false });
  const links = [];
  _marked.walkTokens.call(void 0, tokens, (token) => {
    if (token.type === "link") {
      links.push(token);
    }
  });
  return links.map((link) => link?.href).filter(Boolean);
}
function validateTextLinks(text, isOnPhishingList) {
  const links = getMarkdownLinks(text);
  for (const link of links) {
    try {
      const url = new URL(link);
      _utils.assert.call(void 0, 
        ALLOWED_PROTOCOLS.includes(url.protocol),
        `Protocol must be one of: ${ALLOWED_PROTOCOLS.join(", ")}.`
      );
      const hostname = url.protocol === "mailto:" ? url.pathname.split("@")[1] : url.hostname;
      _utils.assert.call(void 0, !isOnPhishingList(hostname), "The specified URL is not allowed.");
    } catch (error) {
      throw new Error(
        `Invalid URL: ${error instanceof _utils.AssertionError ? error.message : "Unable to parse URL."}`
      );
    }
  }
}
function validateComponentLinks(component, isOnPhishingList) {
  const { type } = component;
  switch (type) {
    case _snapssdk.NodeType.Panel:
      component.children.forEach(
        (node) => validateComponentLinks(node, isOnPhishingList)
      );
      break;
    case _snapssdk.NodeType.Row:
      validateComponentLinks(component.value, isOnPhishingList);
      break;
    case _snapssdk.NodeType.Text:
      validateTextLinks(component.value, isOnPhishingList);
      break;
    default:
      break;
  }
}
function getTotalTextLength(component) {
  const { type } = component;
  switch (type) {
    case _snapssdk.NodeType.Panel:
      return component.children.reduce(
        // This is a bug in TypeScript: https://github.com/microsoft/TypeScript/issues/48313
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (sum, node) => sum + getTotalTextLength(node),
        0
      );
    case _snapssdk.NodeType.Row:
      return getTotalTextLength(component.value);
    case _snapssdk.NodeType.Text:
      return component.value.length;
    default:
      return 0;
  }
}
function hasChildren(component) {
  return _utils.hasProperty.call(void 0, component, "children");
}






exports.validateTextLinks = validateTextLinks; exports.validateComponentLinks = validateComponentLinks; exports.getTotalTextLength = getTotalTextLength; exports.hasChildren = hasChildren;
//# sourceMappingURL=chunk-NDIITWO4.js.map