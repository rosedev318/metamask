import type { Component, NodeWithChildren } from '@metamask/snaps-sdk';
/**
 * Searches for markdown links in a string and checks them against the phishing list.
 *
 * @param text - The text to verify.
 * @param isOnPhishingList - The function that checks the link against the
 * phishing list.
 * @throws If the text contains a link that is not allowed.
 */
export declare function validateTextLinks(text: string, isOnPhishingList: (url: string) => boolean): void;
/**
 * Search for links in UI components and check that the URL they are trying to
 * pass in is not in the phishing list.
 *
 * @param component - The custom UI component.
 * @param isOnPhishingList - The function that checks the link against the
 * phishing list.
 * @throws If the component contains a link that is not allowed.
 */
export declare function validateComponentLinks(component: Component, isOnPhishingList: (url: string) => boolean): void;
/**
 * Calculate the total length of all text in the component.
 *
 * @param component - A custom UI component.
 * @returns The total length of all text components in the component.
 */
export declare function getTotalTextLength(component: Component): number;
/**
 * Check if a component has children.
 *
 * @param component - A custom UI component.
 * @returns `true` if the component has children, `false` otherwise.
 */
export declare function hasChildren(component: Component): component is NodeWithChildren;
