"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var abi = require('ethjs-abi'); // eslint-disable-line
var EthFilter = require('@metamask/ethjs-filter'); // eslint-disable-line
var getKeys = require('@metamask/ethjs-util').getKeys; // eslint-disable-line
var keccak256 = require('js-sha3').keccak_256; // eslint-disable-line
var promiseToCallback = require('promise-to-callback');
var hasTransactionObject = require('./has-tx-object');
module.exports = Contract;
function Contract() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = this;
  self.abi = opts.contractABI || [];
  self.query = opts.query;
  self.address = opts.address || '0x';
  self.bytecode = opts.contractBytecode || '0x';
  self.defaultTxObject = opts.contractDefaultTxObject || {};
  self.filters = new EthFilter(self.query);
  getCallableMethodsFromABI(self.abi).forEach(function (methodObject) {
    if (methodObject.type === 'function') {
      self[methodObject.name] = createContractFunction(methodObject);
    } else if (methodObject.type === 'event') {
      self[methodObject.name] = createContractEvent(methodObject);
    }
  });
  function createContractEvent(methodObject) {
    return function contractEvent() {
      var methodArgs = [].slice.call(arguments); // eslint-disable-line

      var filterInputTypes = getKeys(methodObject.inputs, 'type', false);
      var filterTopic = "0x" + keccak256(methodObject.name + "(" + filterInputTypes.join(',') + ")");
      var filterTopcis = [filterTopic];
      var argsObject = Object.assign({}, methodArgs[0]) || {};
      var defaultFilterObject = Object.assign({}, methodArgs[0] || {}, {
        to: self.address,
        topics: filterTopcis
      });
      var filterOpts = Object.assign({}, argsObject, {
        decoder: function decoder(logData) {
          return abi.decodeEvent(methodObject, logData, filterTopcis);
        },
        defaultFilterObject: defaultFilterObject
      });
      return new self.filters.Filter(filterOpts);
    };
  }
  function createContractFunction(methodObject) {
    return function contractFunction() {
      var methodCallback; // eslint-disable-line
      var methodArgs = [].slice.call(arguments); // eslint-disable-line
      if (typeof methodArgs[methodArgs.length - 1] === 'function') {
        methodCallback = methodArgs.pop();
      }
      var promise = performCall({
        methodObject: methodObject,
        methodArgs: methodArgs
      });
      if (methodCallback) {
        return promiseToCallback(promise)(methodCallback);
      }
      return promise;
    };
  }
  function performCall(_x) {
    return _performCall.apply(this, arguments);
  }
  function _performCall() {
    _performCall = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
      var methodObject, methodArgs, queryMethod, providedTxObject, methodTxObject, queryResult, decodedMethodResult, decodingError;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            methodObject = _ref.methodObject, methodArgs = _ref.methodArgs;
            queryMethod = 'call'; // eslint-disable-line
            providedTxObject = {}; // eslint-disable-line
            if (hasTransactionObject(methodArgs)) providedTxObject = methodArgs.pop();
            methodTxObject = Object.assign({}, self.defaultTxObject, providedTxObject, {
              to: self.address
            });
            methodTxObject.data = abi.encodeMethod(methodObject, methodArgs);
            if (methodObject.constant === false) {
              queryMethod = 'sendTransaction';
            }
            _context.next = 9;
            return self.query[queryMethod](methodTxObject);
          case 9:
            queryResult = _context.sent;
            if (!(queryMethod === 'call')) {
              _context.next = 20;
              break;
            }
            _context.prev = 11;
            decodedMethodResult = abi.decodeMethod(methodObject, queryResult);
            return _context.abrupt("return", decodedMethodResult);
          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            decodingError = new Error("[ethjs-contract] while formatting incoming raw call data " + JSON.stringify(queryResult) + " " + _context.t0);
            throw decodingError;
          case 20:
            return _context.abrupt("return", queryResult);
          case 21:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[11, 16]]);
    }));
    return _performCall.apply(this, arguments);
  }
}
function getCallableMethodsFromABI(contractABI) {
  return contractABI.filter(function (json) {
    return (json.type === 'function' || json.type === 'event') && json.name.length > 0;
  });
}