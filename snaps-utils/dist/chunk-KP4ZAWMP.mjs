// src/ui.ts
import { NodeType } from "@metamask/snaps-sdk";
import { assert, AssertionError, hasProperty } from "@metamask/utils";
import { lexer, walkTokens } from "marked";
var ALLOWED_PROTOCOLS = ["https:", "mailto:"];
function getMarkdownLinks(text) {
  const tokens = lexer(text, { gfm: false });
  const links = [];
  walkTokens(tokens, (token) => {
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
      assert(
        ALLOWED_PROTOCOLS.includes(url.protocol),
        `Protocol must be one of: ${ALLOWED_PROTOCOLS.join(", ")}.`
      );
      const hostname = url.protocol === "mailto:" ? url.pathname.split("@")[1] : url.hostname;
      assert(!isOnPhishingList(hostname), "The specified URL is not allowed.");
    } catch (error) {
      throw new Error(
        `Invalid URL: ${error instanceof AssertionError ? error.message : "Unable to parse URL."}`
      );
    }
  }
}
function validateComponentLinks(component, isOnPhishingList) {
  const { type } = component;
  switch (type) {
    case NodeType.Panel:
      component.children.forEach(
        (node) => validateComponentLinks(node, isOnPhishingList)
      );
      break;
    case NodeType.Row:
      validateComponentLinks(component.value, isOnPhishingList);
      break;
    case NodeType.Text:
      validateTextLinks(component.value, isOnPhishingList);
      break;
    default:
      break;
  }
}
function getTotalTextLength(component) {
  const { type } = component;
  switch (type) {
    case NodeType.Panel:
      return component.children.reduce(
        // This is a bug in TypeScript: https://github.com/microsoft/TypeScript/issues/48313
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (sum, node) => sum + getTotalTextLength(node),
        0
      );
    case NodeType.Row:
      return getTotalTextLength(component.value);
    case NodeType.Text:
      return component.value.length;
    default:
      return 0;
  }
}
function hasChildren(component) {
  return hasProperty(component, "children");
}

export {
  validateTextLinks,
  validateComponentLinks,
  getTotalTextLength,
  hasChildren
};
//# sourceMappingURL=chunk-KP4ZAWMP.mjs.map