const express = require('express');
const HTTP_METHODS = [
  'get',
  'head',
  'post',
  'put',
  'delete',
  'connect',
  'options',
  'trace',
  'patch',
  // express specific
  'all'
];

class AsapRouter {
  constructor() {
    // eslint-disable-next-line
    this._router = express.Router();
    Object.assign(this, this._router);
    this._overwriteMethods();
  }

  _overwriteMethods() {

  }
}

module.exports = AsapRouter;
