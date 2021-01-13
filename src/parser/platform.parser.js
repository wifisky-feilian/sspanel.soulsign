/**
 * [platform.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace platform.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { select, assert } from "../utils/share.utils.js"; // share.utils

const variable = {
    assert: ["object", "string"], // 断言类型
    type: {
        chrome: {
            soulsign: function () {
                return "this is chrome.soulsign";
            },
        },
        github: {
            action: function () {
                return "this is github.action";
            },
        },
    },
};

function assert_platform(platform) {
    return assert(platform, variable.assert, "platform");
} // 断言

function parser_platform(object) {
    object.platform = select.object(variable.type, [object.platform])[0];
} // 解析

export { variable, assert_platform, parser_platform };

export default { variable, assert: assert_platform, parser: parser_platform };
