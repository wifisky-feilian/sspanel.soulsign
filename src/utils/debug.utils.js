/**
 * [debug.utils]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace debug.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

function debug_call(call, argument) {
    let name_call = call.name || call.toString().match(/function\s*([^(]*)\(/)[1];

    console.debug(`${name_call}() call.`);

    call(...argument); // 调用

    console.debug(`${name_call}() exit.`);
}

export { debug_call };

export default {};
