"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var BN = require('bn.js');
var util = require('./util');

/**
 * Checks whether the given input and base will produce an invalid bn instance.
 *
 * bn.js requires extra validation to safely use, so this function allows
 * us to typecheck the params we pass to it.
 *
 * @see {@link https://github.com/indutny/bn.js/issues/151}
 * @param {any} input - the bn.js input
 * @param {number} base - the bn.js base argument
 * @returns {boolean}
 */
function _isInvalidBnInput(input, base) {
  return typeof input === 'string' && (input.startsWith('0x') || Number.isNaN(parseInt(input, base)));
}
var Token = /*#__PURE__*/function () {
  function Token() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      address = _ref.address,
      symbol = _ref.symbol,
      balance = _ref.balance,
      decimals = _ref.decimals,
      contract = _ref.contract,
      owner = _ref.owner,
      throwOnBalanceError = _ref.throwOnBalanceError,
      balanceDecimals = _ref.balanceDecimals;
    (0, _classCallCheck2["default"])(this, Token);
    if (!contract) {
      throw new Error('Missing requried \'contract\' parameter');
    } else if (!owner) {
      throw new Error('Missing requried \'owner\' parameter');
    }
    this.isLoading = !address || !symbol || !balance || !decimals;
    this.address = address || '0x0';
    this.symbol = symbol;
    this.throwOnBalanceError = throwOnBalanceError;
    this.balanceDecimals = balanceDecimals;
    if (!balance) {
      balance = '0';
    } else if (_isInvalidBnInput(balance, 16)) {
      throw new Error('Invalid \'balance\' option provided; must be non-prefixed hex string if given as string');
    }
    if (decimals && _isInvalidBnInput(decimals, 10)) {
      throw new Error('Invalid \'decimals\' option provided; must be non-prefixed hex string if given as string');
    }
    this.balance = new BN(balance, 16);
    this.decimals = decimals ? new BN(decimals) : undefined;
    this.owner = owner;
    this.contract = contract;
  }
  (0, _createClass2["default"])(Token, [{
    key: "update",
    value: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Promise.all([this.symbol || this.updateSymbol(), this.updateBalance(), this.decimals || this.updateDecimals()]);
            case 2:
              this.isLoading = false;
              return _context.abrupt("return", this.serialize());
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function update() {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "serialize",
    value: function serialize() {
      return {
        address: this.address,
        symbol: this.symbol,
        balance: this.balance.toString(10),
        decimals: this.decimals ? parseInt(this.decimals.toString()) : 0,
        string: this.stringify(),
        balanceError: this.balanceError ? this.balanceError : null
      };
    }
  }, {
    key: "stringify",
    value: function stringify() {
      return util.stringifyBalance(this.balance, this.decimals || new BN(0), this.balanceDecimals);
    }
  }, {
    key: "updateSymbol",
    value: function () {
      var _updateSymbol = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var symbol;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.updateValue('symbol');
            case 2:
              symbol = _context2.sent;
              this.symbol = symbol || 'TKN';
              return _context2.abrupt("return", this.symbol);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function updateSymbol() {
        return _updateSymbol.apply(this, arguments);
      }
      return updateSymbol;
    }()
  }, {
    key: "updateBalance",
    value: function () {
      var _updateBalance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var balance;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.updateValue('balance');
            case 2:
              balance = _context3.sent;
              this.balance = balance;
              return _context3.abrupt("return", this.balance);
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function updateBalance() {
        return _updateBalance.apply(this, arguments);
      }
      return updateBalance;
    }()
  }, {
    key: "updateDecimals",
    value: function () {
      var _updateDecimals = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var decimals;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(this.decimals !== undefined)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", this.decimals);
            case 2:
              _context4.next = 4;
              return this.updateValue('decimals');
            case 4:
              decimals = _context4.sent;
              if (decimals) {
                this.decimals = decimals;
              }
              return _context4.abrupt("return", this.decimals);
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function updateDecimals() {
        return _updateDecimals.apply(this, arguments);
      }
      return updateDecimals;
    }()
  }, {
    key: "updateValue",
    value: function () {
      var _updateValue = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(key) {
        var methodName, args, result, _this$contract, val;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              args = [];
              _context5.t0 = key;
              _context5.next = _context5.t0 === 'balance' ? 4 : 7;
              break;
            case 4:
              methodName = 'balanceOf';
              args = [this.owner];
              return _context5.abrupt("break", 8);
            case 7:
              methodName = key;
            case 8:
              _context5.prev = 8;
              _context5.next = 11;
              return (_this$contract = this.contract)[methodName].apply(_this$contract, (0, _toConsumableArray2["default"])(args));
            case 11:
              result = _context5.sent;
              if (key === 'balance') {
                this.balanceError = null;
              }
              _context5.next = 22;
              break;
            case 15:
              _context5.prev = 15;
              _context5.t1 = _context5["catch"](8);
              console.warn("failed to load ".concat(key, " for token at ").concat(this.address));
              if (!(key === 'balance')) {
                _context5.next = 22;
                break;
              }
              this.balanceError = _context5.t1;
              if (!this.throwOnBalanceError) {
                _context5.next = 22;
                break;
              }
              throw _context5.t1;
            case 22:
              if (!result) {
                _context5.next = 26;
                break;
              }
              val = result[0];
              this[key] = val;
              return _context5.abrupt("return", val);
            case 26:
              return _context5.abrupt("return", this[key]);
            case 27:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[8, 15]]);
      }));
      function updateValue(_x) {
        return _updateValue.apply(this, arguments);
      }
      return updateValue;
    }()
  }]);
  return Token;
}();
module.exports = Token;