/**
 * [log.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace log.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { verify } from "./share.utils.js"; // share.utils

import time from "./time.utils.js"; // time.utils

import $debug from "./debug.utils.js"; // debug.utils

// import encrypt from "./encrypt.utils.js"; // encrypt.utils

const variable = {
    pool: {
        debug: [],
        system: [],
        encrypt: [],
        exception: [],
    },
    method: {
        record(
            zone,
            message,
            hook = (value) => {
                return value;
            },
            callback = () => {}
        ) {
            message = { timestamp: time.timestamp(), source: message };

            variable.pool[zone].push(hook(message));

            callback(message);
        }, // 记录
        view(
            zone,
            hook,
            callback = (value) => {
                return value;
            }
        ) {
            variable.pool[zone].forEach((element) => {
                if (verify.type(hook, "function")) element = hook(element); // 如果 hook 是函数
            });

            return callback(variable.pool[zone]);
        }, // 查看
        clear(zone) {
            variable.pool[zone].length = 0;
        }, // 清除
    },
};

const debug = {
    __zone__: "debug",
    record(message, callback = () => {}) {
        if ($debug.variable.enable) {
            variable.method.record(this.__zone__, message, undefined, (message) => {
                console.debug(message);
                callback();
            });
        }
    },
    view() {
        return variable.method.view(this.__zone__);
    },
}; // 调试，明文字符，开发者分析使用

const system = {
    __zone__: "system",
    record(message) {
        variable.method.record(this.__zone__, message);
    },
    view() {
        return variable.method.view(this.__zone__);
    },
}; // 系统，明文字符，用户获取提示信息

const encrypt = {
    __zone__: "encrypt",
    record(message) {
        variable.method.record(this.__zone__, message);
    },
    view() {
        return variable.method.view(this.__zone__);
    },
}; // 加密，加密字符，用户个人敏感信息

const exception = {
    __zone__: "exception",

    /**
     * @param {number} code
     * @param {*} message
     * @note code - [1, 2, 3, 4, 5] => [warn, ...error]
     */
    record(code = 2, message) {
        variable.method.record(this.__zone__, { code, message }, undefined, (log) => {
            if (2 <= log.source.code) {
                throw this.view();
            } // error，直接终止程序
        });
    },
    view() {
        return variable.method.view(this.__zone__);
    },
}; // 异常，明文字符，错误，警告等相关

export { debug, system, encrypt, exception };

export default { debug, system, encrypt, exception };
