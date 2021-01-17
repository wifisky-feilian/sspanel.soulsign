/**
 * [time.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace time.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

const variable = new Date();

function timestamp() {
    return `${variable.toLocaleString(undefined, {
        hour12: false, // 24h
    })}.${variable.getMilliseconds()}`;
}

function ready() {
    return true;
}

export { variable, timestamp, ready };

export default {
    variable,
    timestamp,
    ready,
};
