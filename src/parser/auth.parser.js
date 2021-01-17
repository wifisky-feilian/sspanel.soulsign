/**
 * [auth.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace auth.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import log from "../utils/log.utils.js"; // log.utils
import { operate, select, call } from "../utils/share.utils.js"; // share.utils

const variable = {
    type: {
        anonymous: {
            name: "anonymous",
            call() {
                return { code: false, data: "this is anonymous auth" };
            },
        },
    },
    layer: {
        account(auth, site) {
            return operate.table(site.credential, (account, tools) => {
                tools.control.source.push(this.keychain(auth, account, site.url));
            }).source; // 返回各用户的结果
        }, // 账户层
        keychain(auth, keychain, site) {
            let result = {};

            let save = operate.table(keychain, (credential, tools) => {
                result = this.authentication(auth.get(credential.type), { key: credential.source, door: site.url });
                tools.control.source.push(result); // 记录每一次的结果

                if (!result.code) {
                    log.debug.record(`the auth of ${site.domain} is ${credential.type}`, () => {
                        site.debug.auth = credential.type;
                    }); // 调试信息

                    tools.control.abort();
                } // 如果认证成功，则退出不再继续认证
            }); // 返回结果

            return save.source.slice(-1)[0]; // 返回最后一次结果
        }, // 凭据串层
        authentication(authentication, credential) {
            try {
                return call(
                    [authentication.assert, authentication.call],
                    [
                        [credential.key, credential.door],
                        [credential.key, credential.door],
                    ],
                    (save, tools) => {
                        if (save.result.code) tools.control.abort();
                    },
                    (result) => {
                        result = Object.assign({ code: true }, result); // 默认为 true，失败
                        return result;
                    }
                );
            } catch (exception) {
                log.exception.record(2, { location: "auth.operate.layer.authentication", exception });
            }
        }, // 凭据认证层
    },
};

function parser_auth(auth) {
    auth.push("anonymous");

    auth.forEach((auth, index, array) => {
        switch (typeof auth) {
            case "string": // 字符串，""
                array[index] = [auth, select.object(variable.type, [auth])[0]];
                break;
            case "object": // 对象，{ name: "", call: function() {}, assert: function() {} }
                array[index] = [auth.name, auth];
                break;
            default:
                break;
        }
    });

    return new Map(auth); // 创建 map
}

function operate_auth(auth, site) {
    return variable.layer.account(auth, site);
}

export { variable, parser_auth, operate_auth };

export default { variable, parser: parser_auth, operate: operate_auth };
