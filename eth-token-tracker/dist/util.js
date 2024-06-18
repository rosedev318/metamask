"use strict";

var BN = require('bn.js');
var zero = new BN(0);
module.exports = {
  stringifyBalance: function stringifyBalance(balance, bnDecimals) {
    var balanceDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    if (balance.eq(zero)) {
      return '0';
    }
    var decimals = parseInt(bnDecimals.toString());
    if (decimals === 0) {
      return balance.toString();
    }
    var bal = balance.toString();
    var len = bal.length;
    var decimalIndex = len - decimals;
    var prefix = '';
    if (decimalIndex <= 0) {
      while (prefix.length <= decimalIndex * -1) {
        prefix += '0';
        len++;
      }
      bal = prefix + bal;
      decimalIndex = 1;
    }
    var whole = bal.substr(0, len - decimals);
    if (balanceDecimals === 0) {
      return whole;
    }
    var fractional = bal.substr(decimalIndex, balanceDecimals);
    if (/0+$/.test(fractional)) {
      var withOnlySigZeroes = bal.substr(decimalIndex).replace(/0+$/, '');
      if (withOnlySigZeroes.length > 0) withOnlySigZeroes = ".".concat(withOnlySigZeroes);
      return "".concat(whole).concat(withOnlySigZeroes);
    }
    return "".concat(whole, ".").concat(fractional);
  }
};