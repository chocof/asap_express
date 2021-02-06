const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ClsStore  = require('./lib/cls_store');
const { stringify } = require('./lib/utils');
const DEFAULT_NAMESPACE = 'ASAP_EXPRESS';
const DEFAULT_PORT = 8080;
// const HTTP_METHODS = [
//   'get',
//   'head',
//   'post',
//   'put',
//   'delete',
//   'connect',
//   'options',
//   'trace',
//   'patch'
// ];

class AsapExpress {
  constructor(ns = DEFAULT_NAMESPACE, port = DEFAULT_PORT) {
    this._port = port;
    this._app = express();
    this._ns = ns;
    this._clsStore = new ClsStore(ns);
    this._app.use(this._overwriteResponseMethods.bind(this));
    this._app.use(this._clsStore.getMiddlewareFn());
    this._asapMethods = {};
    this._sendOverride = null;
    // mix the two objects together
    Object.assign(this, this._app);
    this.listen = this._listen;
  }

  /**
   * Sets the default configuration for
   * the express router
   */
  default() {
    this.use(cors());
    this.use(bodyParser.json());
  }

  /**
   * Overwrittes the response methods
   * with the given callbacks
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @return {Promise}
   */
  _overwriteResponseMethods(req, res, next) {
    // const origSend = res.send;
    const that = this;
    const oldSend = res.send;
    // overrides the res.send function
    // if _sendOverride is not defined it uses the default
    // behaviour
    res.send = new Proxy(res.send, {
      apply: function(target, thisArg, args) {
        if (that._sendOverride) {
          const data = that._sendOverride(...args);
          return oldSend.call(thisArg, stringify(data));
        }
        return target.apply(thisArg, args);
      }
    });
    // now let's add the ASAP methods defined by the user
    for (const method of Object.keys(this._asapMethods)) {
      if (res[method]) {
        // TODO
        throw new Error('MethodAlreadyExists');
      }
      res[method] = (...args) => {
        const data = this._asapMethods[method](...args);
        return oldSend.call(res, data);
      };
    }

    return next();
  }

  asapSend(cb) {
    this._sendOverride = cb;
  }

  asapMethod(method, cb) {
    this._asapMethods[method] = cb;
  }

  contextGet(key) {
    return this._clsStore.get(key);
  }

  contextSet(key, value) {
    return this._clsStore.store(key, value);
  }

  getContextTraceId() {
    return this._clsStore.getTraceId();
  }

  _listen(cb) {
    return this._app.listen(this._port, cb);
  }
}

const asapModules = {};
// very much like a singleton kind of hybrid everytime we are either creating a new
// instance, or we are using an existing one
function get(ns = DEFAULT_NAMESPACE, port = DEFAULT_PORT) {
  if (!(ns in asapModules)) {
    asapModules[ns] = new AsapExpress(ns, port);
  }
  return asapModules[ns];
}

module.exports = get;
