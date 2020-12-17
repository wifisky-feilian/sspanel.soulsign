/**
 * [time.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace time.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

const variable = new Date();

function time() {
    return `${variable.toLocaleString()}:${variable.getSeconds()}.${variable.getMilliseconds()}`;
}

function ready(time) {
    return true;
}

export { variable, time, ready };

export default {
    variable,
    time,
    ready,
};
