"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkLBXAXAXHjs = require('./chunk-LBXAXAXH.js');

// src/BlockTrackerPollingController.ts
var _basecontroller = require('@metamask/base-controller');
function BlockTrackerPollingControllerMixin(Base) {
  var _activeListeners;
  class BlockTrackerPollingController2 extends _chunkLBXAXAXHjs.AbstractPollingControllerBaseMixin.call(void 0, 
    Base
  ) {
    constructor() {
      super(...arguments);
      _chunkLBXAXAXHjs.__privateAdd.call(void 0, this, _activeListeners, {});
    }
    _startPollingByNetworkClientId(networkClientId, options) {
      const key = _chunkLBXAXAXHjs.getKey.call(void 0, networkClientId, options);
      if (_chunkLBXAXAXHjs.__privateGet.call(void 0, this, _activeListeners)[key]) {
        return;
      }
      const networkClient = this._getNetworkClientById(networkClientId);
      if (networkClient) {
        const updateOnNewBlock = this._executePoll.bind(
          this,
          networkClientId,
          options
        );
        networkClient.blockTracker.addListener("latest", updateOnNewBlock);
        _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _activeListeners)[key] = updateOnNewBlock;
      } else {
        throw new Error(
          `Unable to retrieve blockTracker for networkClientId ${networkClientId}`
        );
      }
    }
    _stopPollingByPollingTokenSetId(key) {
      const [networkClientId] = key.split(":");
      const networkClient = this._getNetworkClientById(
        networkClientId
      );
      if (networkClient && _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _activeListeners)[key]) {
        const listener = _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _activeListeners)[key];
        if (listener) {
          networkClient.blockTracker.removeListener("latest", listener);
          delete _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _activeListeners)[key];
        }
      }
    }
  }
  _activeListeners = new WeakMap();
  return BlockTrackerPollingController2;
}
var Empty = class {
};
var BlockTrackerPollingControllerOnly = BlockTrackerPollingControllerMixin(Empty);
var BlockTrackerPollingController = BlockTrackerPollingControllerMixin(_basecontroller.BaseController);
var BlockTrackerPollingControllerV1 = BlockTrackerPollingControllerMixin(_basecontroller.BaseControllerV1);





exports.BlockTrackerPollingControllerOnly = BlockTrackerPollingControllerOnly; exports.BlockTrackerPollingController = BlockTrackerPollingController; exports.BlockTrackerPollingControllerV1 = BlockTrackerPollingControllerV1;
//# sourceMappingURL=chunk-MUDX6BUY.js.map