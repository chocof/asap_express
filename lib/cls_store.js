const cls = require('cls-hooked');
const { v4: uuidv4 } = require('uuid');

class ClsStoreEntry {
  constructor(data) {
    // not used yet
    // maybe in the future will be used to find
    // outdated data
    this._created = new Date().getTime();
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

class ClsStore {
  constructor(ns) {
    this.ns = ns;
    this.context = cls.createNamespace(ns);
  }

  /**
   * Checks if the curernt context for the session has been setup
   * @param {*} throwError
   * @return {uuid}
   */
  _checkInitialized(throwError) {
    const traceId = this.context.get('traceId');
    if (!traceId && throwError) {
      // TODO
      throw new Error('ClsNotInit');
    }
    return traceId;
  }

  /**
   * Returns current context's trace id
   * @return {string}
   */
  getTraceId() {
    return this._checkInitialized(true);
  }

  /**
   * To be used by express to initialize the scope
   * @return {function}
   */
  getMiddlewareFn() {
    const context = this.context;
    // link to contextStore
    /**
     * Middleware registering api request's trace
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Namespace}
     */
    return (req, res, next) => {
      // register req, res to access their contents
      context.bind(req);
      context.bind(res);
      // generate a unique uuid for the trace
      return context.run(() => {
        const traceId = uuidv4();
        context.set('traceId', traceId);
        context.set('store', {});
        next();
      });
    };
  }

  /**
   * Sets data for the context store
   * @param {*} key
   * @param {*} data
   */
  store(key, data) {
    this._checkInitialized(true);
    const store = this.context.get('store');
    store[key] = new ClsStoreEntry(data);
    this.context.set('store', store);
  }

  /**
   * Gets data stored in the context by key
   * @param {*} key
   * @return {*}
   */
  get(key) {
    this._checkInitialized(true);
    const store = this.context.get('store');
    if (key in store && store[key] instanceof ClsStoreEntry) {
      return store[key].getData();
    }
    return null;
  }
}

module.exports = ClsStore;
