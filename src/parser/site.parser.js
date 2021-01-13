/**
 * [site.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace site.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

/**
 * @todo site.domain - support correct automatically
 * @todo site.custom - support command
 */

"use strict";

import { operate, verify, assert } from "../utils/share.utils.js"; // share.utils

import { parser_command } from "./command.parser.js"; // command.parser

const variable = {
    assert: ["object", "string"],
};

function assert_site(site) {
    return assert(site, variable.assert, "site");
}

/**
 * @function parser_site
 * @param {[string|object]} site 域名
 * @note site - "http://localhost.com"|{ site:"http://localhost.com", custom:[] }
 * @todo custom - `$applet="-@signin|+@sspanel.login|=@prize_draw"`|{}
 */

function parser_site(object) {
    operate.table(object.site, (site, tools) => {
        switch (typeof site) {
            case "string": // 字符串类型，即已提供类型
                site = tools.table[tools.index] = { domain: site };
                if (!site.hasOwnProperty("credential")) site.credential = [[{ type: "anonymous" }]];
                break;
            case "object": // 对象类型，即用户自定义类型
                if (!verify.type(site.credential[0], "object.Array")) {
                    site.credential = [site.credential];
                } // 不是标准多用户的，转换为多用户
                if (site.hasOwnProperty("custom")) {
                    site.custom = parser_command(site.custom); // 解析命令
                } // 有自定义行为
                break;
            default:
                break;
        }

        site.save = {}; // 创建 save 属性，存储 applet 结果
    });
}

export { variable, assert_site, parser_site };

export default { variable, assert: assert_site, parser: parser_site };
