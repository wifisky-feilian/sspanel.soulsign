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

import { select } from "../utils/share.utils.js"; // share.utils

const variable = {
    type: {
        taken: function () {
            return "this is taken";
        },
        password: function () {
            return "this is password";
        },
        cookie: function () {
            return "this is cookie";
        },
        browser: function () {
            return "this is browser";
        },
    },
};

function parser_auth(object) {
    object.auth = select.object(variable.type, object.auth);
}

export { variable, parser_auth };

export default { variable, parser: parser_auth };
