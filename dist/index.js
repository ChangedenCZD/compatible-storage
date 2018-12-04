'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookies = require('js-cookie');
var Wechat = wx || {};
var LocalStorage = window.localStorage || {};
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

  var offset = amount;
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

var Storage = function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.EXPIRE_UNIT = EXPIRE_UNIT;
    this.Expire = Expire;
    this.supportWechatMiniProgram = typeof Wechat.getStorageSync === 'function' && typeof Wechat.setStorageSync === 'function' && typeof Wechat.removeStorageSync === 'function';
    this.supportLocalStorage = typeof LocalStorage.getItem === 'function' && typeof LocalStorage.setItem === 'function' && typeof LocalStorage.removeItem === 'function';
  }

  _createClass(Storage, [{
    key: 'set',
    value: function set(key, data, expire) {
      expire = expire || new this.Expire(30, this.EXPIRE_UNIT.DAY);
      var value = JSON.stringify({
        data: data, expire: expire.expireDate
      });
      if (this.supportWechatMiniProgram) {
        Wechat['setStorageSync'](key, value);
      } else if (this.supportLocalStorage) {
        LocalStorage.setItem(key, value);
      } else {
        Cookies['set'](key, value, { expires: 365 });
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      var value = '{}';
      if (this.supportWechatMiniProgram) {
        value = Wechat['getStorageSync'](key);
      } else if (this.supportLocalStorage) {
        value = LocalStorage.getItem(key);
      } else {
        value = Cookies['get'](key);
      }
      var _package = JSON.parse(value || '{}');
      if (Date.now() < _package.expire) {
        return _package.data;
      }
      this.remove(key);
      return null;
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      if (this.supportWechatMiniProgram) {
        Wechat['removeStorageSync'](key);
      } else if (this.supportLocalStorage) {
        LocalStorage.removeItem(key);
      } else {
        Cookies['remove'](key);
      }
    }
  }]);

  return Storage;
}();

module.exports = new Storage();
