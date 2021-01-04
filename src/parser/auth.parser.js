/**
 * [auth.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace auth.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import log from "../utils/log.utils.js"; // log.utils
import { operate, select } from "../utils/share.utils.js"; // share.utils

const variable = {
    type: {
        taken: function (source, url) {
            return { code: false, data: `this is taken auth, your taken is "${source}"` };
        },
        password: function (source, url) {
            return { code: false, data: "this is password auth" };
        },
        cookie: function (source, url) {
            return { code: false, data: "this is password auth" };
        },
        browser: function (source, url) {
            return { code: false, data: "this is browser auth" };
        },
    },
};

function parser_auth(object) {
    object.auth.forEach((auth, index) => {
        switch (typeof auth) {
            case "string": // 字符串，""
                object.auth[index] = [auth, select.object(variable.type, [auth])[0]];
                break;
            case "object": // 对象，{ name: "", callback: function(){} }
                if (Object instanceof auth) {
                    auth = [auth.name, auth.callback];
                } // 对象类型
                break;
            default:
                break;
        }
    });

    object.auth = new Map(object.auth); // 创建 map
}

function operate_auth(auth, site) {
    let save = operate.table(site.credential, (credential, tools) => {
        let result = {};

        try {
            result = Object.assign(
                { code: false, message: `${credential.type} auth, for "${site.domain}", passed` },
                auth.get(credential.type)(credential.source, site.url)
            ); // 配置默认选项
            tools.control.source.push(result); // 存储
        } catch (exception) {
            log.exception.record(2, { location: "auth.operate", exception });
        }

        if (!result.code) {
            log.debug.record(`the auth of ${site.domain} is ${credential.type}`, () => {
                site.debug.auth = credential.type;
            }); // 调试信息

            tools.control.abort();
        }
    }); // 返回结果

    return save.source.slice(-1)[0]; // 返回最后一次结果
}

export { variable, parser_auth, operate_auth };

export default { variable, parser: parser_auth, operate: operate_auth };
