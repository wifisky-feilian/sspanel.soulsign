/**
 * [multiple.model]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace multiple.model
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strick";

import line from "../src/parser/line.parser.js"; // line.parser

import platform from "../src/parser/platform.parser.js"; // platform.parser
import auth from "../src/parser/auth.parser.js"; // auth.parser
import applet from "../src/parser/applet.parser.js"; // applet.parser
import site from "../src/parser/site.parser.js"; // domain.parser

const variable = {
    pattern: [
        "platform", // 平台
        "auth", // 认证方式
        "applet", // 小程序
        "site", // 网站
        [],
        [],
        [],
        [],
    ],
    callback: (object) => {
        platform.parser(object);
        auth.parser(object);
        applet.parser(object);
        site.parser(object);
    },
    filter: {
        global: function () {
            return { code: false };
        },
        custom: [],
    },
};

function multiple() {
    line.parser(
        variable.pattern,
        [
            "chrome.soulsign", // 平台 ""
            ["browser", "password", "taken", "cookie"], // 认证方式 [""]
            [
                {
                    info: "sspanel.login",
                    argument: { path: ["login"], keyword: [], callback: {}, hook: {} },
                },
                {
                    info: "sspanel.signin",
                    argument: { path: ["signin"], keyword: [], callback: {}, hook: {} },
                    dependence: "sspanel.login",
                },
                {
                    info: {
                        name: "custom_applet",
                        callback: (source, argument, domain) => {
                            return `this is custom applet(). custom for ${domain}/${argument.path[0]}`;
                        },
                    },
                    argument: { path: ["applet"], keyword: [], callback: {}, hook: {} },
                    dependence: 0,
                },
            ], // 小程序 [{}]
            ["http://localhost.com", { domain: "http://localhost.net" }], // 域名 [""]
        ],
        variable.filter,
        variable.callback
    );

    line.operate.multiple();

    console.log(line.variable);

    console.log("multiple.model end!");
}

export { variable, multiple };

export default { variable };
