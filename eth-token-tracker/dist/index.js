"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Eth = require('@metamask/ethjs-query');
var EthContract = require('@metamask/ethjs-contract');
var Token = require('./token');
var _require = require('eth-block-tracker'),
  PollingBlockTracker = _require.PollingBlockTracker;
var abi = require('human-standard-token-abi');
var SafeEventEmitter = require('@metamask/safe-event-emitter')["default"];
var deepEqual = require('deep-equal');
var TokenTracker = /*#__PURE__*/function (_SafeEventEmitter) {
  (0, _inherits2["default"])(TokenTracker, _SafeEventEmitter);
  var _super = _createSuper(TokenTracker);
  function TokenTracker() {
    var _this;
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, TokenTracker);
    _this = _super.call(this);
    _this.includeFailedTokens = opts.includeFailedTokens || false;
    _this.userAddress = opts.userAddress || '0x0';
    _this.provider = opts.provider;
    var pollingInterval = opts.pollingInterval || 4000;
    _this.blockTracker = new PollingBlockTracker({
      provider: _this.provider,
      pollingInterval: pollingInterval
    });
    _this.eth = new Eth(_this.provider);
    _this.contract = new EthContract(_this.eth);
    _this.TokenContract = _this.contract(abi);
    var tokens = opts.tokens || [];
    _this.balanceDecimals = opts.balanceDecimals;
    _this.tokens = tokens.map(function (tokenOpts) {
      return _this.createTokenFrom(tokenOpts, _this.balanceDecimals);
    });

    // initialize to empty array to ensure a tracker initialized
    // with zero tokens doesn't emit an update until a token is added.
    _this._oldBalances = [];
    Promise.all(_this.tokens.map(function (token) {
      return token.update();
    })).then(function (newBalances) {
      _this._update(newBalances);
    })["catch"](function (error) {
      _this.emit('error', error);
    });
    _this.updateBalances = _this.updateBalances.bind((0, _assertThisInitialized2["default"])(_this));
    _this.running = true;
    _this.blockTracker.on('latest', _this.updateBalances);
    return _this;
  }
  (0, _createClass2["default"])(TokenTracker, [{
    key: "serialize",
    value: function serialize() {
      return this.tokens.map(function (token) {
        return token.serialize();
      });
    }
  }, {
    key: "updateBalances",
    value: function () {
      var _updateBalances = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var newBalances;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return Promise.all(this.tokens.map(function (token) {
                return token.updateBalance();
              }));
            case 3:
              newBalances = this.serialize();
              this._update(newBalances);
              _context.next = 10;
              break;
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              this.emit('error', _context.t0);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 7]]);
      }));
      function updateBalances() {
        return _updateBalances.apply(this, arguments);
      }
      return updateBalances;
    }()
  }, {
    key: "createTokenFrom",
    value: function createTokenFrom(opts, balanceDecimals) {
      var owner = this.userAddress;
      var address = opts.address,
        symbol = opts.symbol,
        balance = opts.balance,
        decimals = opts.decimals;
      var contract = this.TokenContract.at(address);
      return new Token({
        address: address,
        symbol: symbol,
        balance: balance,
        decimals: decimals,
        contract: contract,
        owner: owner,
        throwOnBalanceError: this.includeFailedTokens === false,
        balanceDecimals: balanceDecimals
      });
    }
  }, {
    key: "add",
    value: function add(opts) {
      var _this2 = this;
      var token = this.createTokenFrom(opts);
      this.tokens.push(token);
      token.update().then(function () {
        _this2._update(_this2.serialize());
      })["catch"](function (error) {
        _this2.emit('error', error);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
      this.blockTracker.removeListener('latest', this.updateBalances);
    }
  }, {
    key: "_update",
    value: function _update(newBalances) {
      if (!this.running || deepEqual(newBalances, this._oldBalances)) {
        return;
      }
      this._oldBalances = newBalances;
      this.emit('update', newBalances);
    }
  }]);
  return TokenTracker;
}(SafeEventEmitter);
module.exports = TokenTracker;