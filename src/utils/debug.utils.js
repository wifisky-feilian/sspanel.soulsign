/**
 * [debug.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace debug.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

const variable = {
    enable: false, // 调试模式
};

function debug_enable(enable = true) {
    variable.enable = enable;
} // 开启 debug 模式

function debug_call(call, argument) {
    let name_call = call.name || call.toString().match(/function\s*([^(]*)\(/)[1];

    console.debug(`${name_call}() call.`);

    call(...argument); // 调用

    console.debug(`${name_call}() exit.`);
}

export { variable, debug_enable, debug_call };

export default { variable, enable: debug_enable };
