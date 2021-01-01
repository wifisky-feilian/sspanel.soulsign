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

import { share, line } from "../src/iott.js";

// import share from "../src/utils/share.utils.js"; // share.utils

// import line from "../src/parser/line.parser.js"; // line.parser

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
    filter: {
        global: [
            function () {
                console.log("global filter");
                return { code: false };
            },
        ],
        custom: [
            [
                function (source, error, argument) {
                    console.log("platform filter");
                    if (!share.verify.type(source, "string")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("auth filter");
                    if (!share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("applet filter");
                    if (!share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("site filter");
                    if (!share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
        ],
    },
};

function multiple(value) {
    line.parser(variable.pattern, value, variable.filter, variable.callback);

    line.operate.multiple();

    console.log(line.variable);

    console.log("multiple.model end!");
}

export { variable, multiple };

export default { variable };
