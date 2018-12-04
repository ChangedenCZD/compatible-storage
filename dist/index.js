'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookies = require('js-cookie');
var Wechat = wx || {};
var LocalStorage = window && window.localStorage || {};
/**
 * 过期单位
 * */
var EXPIRE_UNIT = {
  SECOND: 0,
  MINUTE: 1,
  HOUR: 2,
  DAY: 3,
  MONTH: 4
};

/**
 * 过期实例
 * */

var Expire =
/**
 * @param amount 数量
 * @param unit 单位 @see EXPIRE_UNIT
 * */
function Expire(amount, unit) {
  _classCallCheck(this, Expire);

  var offset = Math.max(1, parseFloat(amount));
  switch (unit || EXPIRE_UNIT.SECOND) {
    case EXPIRE_UNIT.MINUTE:
      offset *= 60;
      break;
    case EXPIRE_UNIT.HOUR:
      offset *= 3600;
      break;
    case EXPIRE_UNIT.DAY:
      offset *= 86400;
      break;
    case EXPIRE_UNIT.MONTH:
      offset *= 2592000;
      break;
  }
  this.expireDate = Date.now() + offset * 1000;
};

var Storage = function Storage() {
  _classCallCheck(this, Storage);

  this.EXPIRE_UNIT = EXPIRE_UNIT;
  this.Expire = Expire;
  var supportWechatMiniProgram = typeof Wechat.getStorageSync === 'function' && typeof Wechat.setStorageSync === 'function' && typeof Wechat.removeStorageSync === 'function';
  var supportLocalStorage = typeof LocalStorage.getItem === 'function' && typeof LocalStorage.setItem === 'function' && typeof LocalStorage.removeItem === 'function';
  this.set = function (key, data, expire) {
    expire = expire || new this.Expire(30, this.EXPIRE_UNIT.DAY);
    var value = JSON.stringify({
      data: data, expire: expire.expireDate
    });
    return supportWechatMiniProgram ? Wechat['setStorageSync'](key, value) : supportLocalStorage ? LocalStorage['setItem'](key, value) : Cookies['set'](key, value, { expires: 365 });
  };

  this.get = function (key) {
    var value = supportWechatMiniProgram ? Wechat['getStorageSync'](key) : supportLocalStorage ? LocalStorage['getItem'](key) : Cookies['get'](key);
    var _package = JSON.parse(value || '{}');
    if (Date.now() < _package.expire) {
      return _package.data;
    }
    this.remove(key);
    return null;
  };

  this.remove = function (key) {
    return supportWechatMiniProgram ? Wechat['removeStorageSync'](key, value) : supportLocalStorage ? LocalStorage['removeItem'](key, value) : Cookies['remove'](key);
  };
};

module.exports = new Storage();
