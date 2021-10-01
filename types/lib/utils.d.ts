/**
 * Stringify JSON, like JSON.stringify, but v8 optimized, with the
 * ability to escape characters that can trigger HTML sniffing.
 * Borrowed this code from expressjs
 * @param {*} value
 * @param {boolean} escape
 * @return {string}
 */
export function stringify(value: any, escape: boolean): string;
