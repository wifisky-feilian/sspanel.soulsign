/**
 * [platform.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace platform.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { select } from "../utils/share.utils.js"; // share.utils

const variable = {
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

function parser_platform(object) {
    object.platform = select.object(variable.type, [object.platform])[0];
}

function filter_platform(platform) {}

export { variable, parser_platform, filter_platform };

export default { variable, parser: parser_platform, filter: filter_platform };
