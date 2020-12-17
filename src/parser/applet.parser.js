/**
 * [applet.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace applet.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { select } from "../utils/share.utils.js"; // share.utils

const variable = {
    type: {
        sspanel: {
            login: function (argument, domain) {
                return `this is sspanel.login(). login for ${domain}/${argument.path[0]}`;
            },
            signin: function (argument, domain) {
                return `this is sspanel.signin(). signin for ${domain}/${argument.path[0]}`;
            },
        },
        discuz: {
            dsu: {
                login: function () {
                    return "this is discuz.dsu.login.";
                },
                signin: function () {
                    return "this is discuz.dsu.signin.";
                },
            },
            dc: {
                login: function () {
                    return "this is discuz.dc.login.";
                },
                signin: function () {
                    return "this is discuz.dc.signin.";
                },
            },
            k: {
                login: function () {
                    return "this is discuz.k.login.";
                },
                signin: function () {
                    return "this is discuz.k.signin.";
                },
            },
        },
    },
};

function parser_applet(object) {
    for (const item of object.applet) {
        switch (typeof item.info) {
            case "string": // 字符串类型，即已提供类型
                item.info = { name: item.info, callback: select.object(variable.type, [item.info])[0] };
                break;
            case "object": // 对象类型，即用户自定义类型
                break;
            default:
                break;
        }
    }

    object.applet = { global: object.applet, custom: [] };
}

export { variable, parser_applet };

export default { variable, parser: parser_applet };
