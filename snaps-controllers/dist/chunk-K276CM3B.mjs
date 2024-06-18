import {
  constructState
} from "./chunk-RIU3ZIXZ.mjs";
import {
  __privateAdd,
  __privateMethod
} from "./chunk-YRZVIDCF.mjs";

// src/interface/SnapInterfaceController.ts
import { BaseController } from "@metamask/base-controller";
import {
  getTotalTextLength,
  validateComponentLinks
} from "@metamask/snaps-utils";
import { assert, getJsonSize } from "@metamask/utils";
import { nanoid } from "nanoid";
var MAX_UI_CONTENT_SIZE = 25e4;
var MAX_TEXT_LENGTH = 5e4;
var controllerName = "SnapInterfaceController";
var _registerMessageHandlers, registerMessageHandlers_fn, _validateArgs, validateArgs_fn, _triggerPhishingListUpdate, triggerPhishingListUpdate_fn, _checkPhishingList, checkPhishingList_fn, _validateContent, validateContent_fn;
var SnapInterfaceController = class extends BaseController {
  constructor({ messenger, state }) {
    super({
      messenger,
      metadata: {
        interfaces: { persist: false, anonymous: false }
      },
      name: controllerName,
      state: { interfaces: {}, ...state }
    });
    /**
     * Constructor helper for registering this controller's messaging system
     * actions.
     */
    __privateAdd(this, _registerMessageHandlers);
    /**
     * Utility function to validate the args passed to the other methods.
     *
     * @param snapId - The snap id.
     * @param id - The interface id.
     */
    __privateAdd(this, _validateArgs);
    /**
     * Trigger a Phishing list update if needed.
     */
    __privateAdd(this, _triggerPhishingListUpdate);
    /**
     * Check an origin against the phishing list.
     *
     * @param origin - The origin to check.
     * @returns True if the origin is on the phishing list, otherwise false.
     */
    __privateAdd(this, _checkPhishingList);
    /**
     * Utility function to validate the components of an interface.
     * Throws if something is invalid.
     *
     * Right now this only checks links against the phighing list.
     *
     * @param content - The components to verify.
     */
    __privateAdd(this, _validateContent);
    __privateMethod(this, _registerMessageHandlers, registerMessageHandlers_fn).call(this);
  }
  /**
   * Create an interface in the controller state with the associated data.
   *
   * @param snapId - The snap id that created the interface.
   * @param content - The interface content.
   * @returns The newly interface id.
   */
  async createInterface(snapId, content) {
    await __privateMethod(this, _validateContent, validateContent_fn).call(this, content);
    const id = nanoid();
    const componentState = constructState({}, content);
    this.update((draftState) => {
      draftState.interfaces[id] = {
        snapId,
        content,
        state: componentState
      };
    });
    return id;
  }
  /**
   * Get the data of a given interface id.
   *
   * @param snapId - The snap id requesting the interface data.
   * @param id - The interface id.
   * @returns The interface state.
   */
  getInterface(snapId, id) {
    __privateMethod(this, _validateArgs, validateArgs_fn).call(this, snapId, id);
    return this.state.interfaces[id];
  }
  /**
   * Update the interface with the given content.
   *
   * @param snapId - The snap id requesting the update.
   * @param id - The interface id.
   * @param content - The new content.
   */
  async updateInterface(snapId, id, content) {
    __privateMethod(this, _validateArgs, validateArgs_fn).call(this, snapId, id);
    await __privateMethod(this, _validateContent, validateContent_fn).call(this, content);
    const oldState = this.state.interfaces[id].state;
    const newState = constructState(oldState, content);
    this.update((draftState) => {
      draftState.interfaces[id].state = newState;
      draftState.interfaces[id].content = content;
    });
  }
  /**
   * Delete an interface from state.
   *
   * @param id - The interface id.
   */
  deleteInterface(id) {
    this.update((draftState) => {
      delete draftState.interfaces[id];
    });
  }
  /**
   * Update the interface state.
   *
   * @param id - The interface id.
   * @param state - The new state.
   */
  updateInterfaceState(id, state) {
    this.update((draftState) => {
      draftState.interfaces[id].state = state;
    });
  }
};
_registerMessageHandlers = new WeakSet();
registerMessageHandlers_fn = function() {
  this.messagingSystem.registerActionHandler(
    `${controllerName}:createInterface`,
    this.createInterface.bind(this)
  );
  this.messagingSystem.registerActionHandler(
    `${controllerName}:getInterface`,
    this.getInterface.bind(this)
  );
  this.messagingSystem.registerActionHandler(
    `${controllerName}:updateInterface`,
    this.updateInterface.bind(this)
  );
  this.messagingSystem.registerActionHandler(
    `${controllerName}:deleteInterface`,
    this.deleteInterface.bind(this)
  );
  this.messagingSystem.registerActionHandler(
    `${controllerName}:updateInterfaceState`,
    this.updateInterfaceState.bind(this)
  );
};
_validateArgs = new WeakSet();
validateArgs_fn = function(snapId, id) {
  const existingInterface = this.state.interfaces[id];
  assert(
    existingInterface !== void 0,
    `Interface with id '${id}' not found.`
  );
  assert(
    existingInterface.snapId === snapId,
    `Interface not created by ${snapId}.`
  );
};
_triggerPhishingListUpdate = new WeakSet();
triggerPhishingListUpdate_fn = async function() {
  await this.messagingSystem.call("PhishingController:maybeUpdateState");
};
_checkPhishingList = new WeakSet();
checkPhishingList_fn = function(origin) {
  return this.messagingSystem.call("PhishingController:testOrigin", origin).result;
};
_validateContent = new WeakSet();
validateContent_fn = async function(content) {
  const size = getJsonSize(content);
  assert(
    size <= MAX_UI_CONTENT_SIZE,
    `A Snap UI may not be larger than ${MAX_UI_CONTENT_SIZE / 1e3} kB.`
  );
  const textSize = getTotalTextLength(content);
  assert(
    textSize <= MAX_TEXT_LENGTH,
    `The text in a Snap UI may not be larger than ${MAX_TEXT_LENGTH / 1e3} kB.`
  );
  await __privateMethod(this, _triggerPhishingListUpdate, triggerPhishingListUpdate_fn).call(this);
  validateComponentLinks(content, __privateMethod(this, _checkPhishingList, checkPhishingList_fn).bind(this));
};

export {
  SnapInterfaceController
};
//# sourceMappingURL=chunk-K276CM3B.mjs.map