export = ClsStore;
declare class ClsStore {
    constructor(ns: any);
    ns: any;
    context: any;
    /**
     * Checks if the curernt context for the session has been setup
     * @param {*} throwError
     * @return {uuid}
     */
    _checkInitialized(throwError: any): any;
    /**
     * Returns current context's trace id
     * @return {string}
     */
    getTraceId(): string;
    /**
     * To be used by express to initialize the scope
     * @return {function}
     */
    getMiddlewareFn(): Function;
    /**
     * Sets data for the context store
     * @param {*} key
     * @param {*} data
     */
    store(key: any, data: any): void;
    /**
     * Gets data stored in the context by key
     * @param {*} key
     * @return {*}
     */
    get(key: any): any;
}
