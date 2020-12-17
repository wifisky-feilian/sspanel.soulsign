/**
 * [value.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace value.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { verify, select } from "../utils/share.utils.js"; // share.utils

const variable = {
    input: null,
};

function parser_value(value) {
    let channel = 0;

    variable.input = value; // 转存 value

    if (verify.type(value, "object.Array")) channel = 1;
    else if (verify.type(value, "object.Object")) channel = 2;

    return select.array(
        [
            function () {
                return undefined;
            }, // undefined
            function (argument) {
                return variable.input[argument[0]];
            }, // object.Array
            function (argument) {
                let item = variable.input;

                for (const step of argument[1]) item = item[step];

                return item;
            }, // object.Object
        ],
        channel
    );
}

export { variable, parser_value };

export default { variable, parser: parser_value };
