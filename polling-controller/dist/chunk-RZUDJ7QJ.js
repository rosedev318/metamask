"use strict";Object.defineProperty(exports, "__esModule", {value: true});





var _chunkLBXAXAXHjs = require('./chunk-LBXAXAXH.js');

// src/StaticIntervalPollingController.ts
var _basecontroller = require('@metamask/base-controller');
function StaticIntervalPollingControllerMixin(Base) {
  var _intervalIds, _intervalLength;
  class StaticIntervalPollingController2 extends _chunkLBXAXAXHjs.AbstractPollingControllerBaseMixin.call(void 0, Base) {
    constructor() {
      super(...arguments);
      _chunkLBXAXAXHjs.__privateAdd.call(void 0, this, _intervalIds, {});
      _chunkLBXAXAXHjs.__privateAdd.call(void 0, this, _intervalLength, 1e3);
    }
    setIntervalLength(intervalLength) {
      _chunkLBXAXAXHjs.__privateSet.call(void 0, this, _intervalLength, intervalLength);
    }
    getIntervalLength() {
      return _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalLength);
    }
    _startPollingByNetworkClientId(networkClientId, options) {
      if (!_chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalLength)) {
        throw new Error("intervalLength must be defined and greater than 0");
      }
      const key = _chunkLBXAXAXHjs.getKey.call(void 0, networkClientId, options);
      const existingInterval = _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalIds)[key];
      this._stopPollingByPollingTokenSetId(key);
      _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalIds)[key] = setTimeout(
        async () => {
          try {
            await this._executePoll(networkClientId, options);
          } catch (error) {
            console.error(error);
          }
          this._startPollingByNetworkClientId(networkClientId, options);
        },
        existingInterval ? _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalLength) : 0
      );
    }
    _stopPollingByPollingTokenSetId(key) {
      const intervalId = _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalIds)[key];
      if (intervalId) {
        clearTimeout(intervalId);
        delete _chunkLBXAXAXHjs.__privateGet.call(void 0, this, _intervalIds)[key];
      }
    }
  }
  _intervalIds = new WeakMap();
  _intervalLength = new WeakMap();
  return StaticIntervalPollingController2;
}
var Empty = class {
};
var StaticIntervalPollingControllerOnly = StaticIntervalPollingControllerMixin(Empty);
var StaticIntervalPollingController = StaticIntervalPollingControllerMixin(_basecontroller.BaseController);
var StaticIntervalPollingControllerV1 = StaticIntervalPollingControllerMixin(_basecontroller.BaseControllerV1);





exports.StaticIntervalPollingControllerOnly = StaticIntervalPollingControllerOnly; exports.StaticIntervalPollingController = StaticIntervalPollingController; exports.StaticIntervalPollingControllerV1 = StaticIntervalPollingControllerV1;
//# sourceMappingURL=chunk-RZUDJ7QJ.js.map