/**
 * [command.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace command.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { operate } from "../utils/share.utils.js"; // share.utils

function parser_command(command = []) {
    console.debug("command parser not ready yet.");

    /*

    operate.table(custom, (item, tools) => {
        switch (typeof item) {
            case "string": // 命令，`$applet="-@signin|+@sspanel.login"`
                break;
            case "object": // 对象，{ range: "applet", source: [{ command: "+", name: "prize_draw", object: () => {} }] }
                break;
            default:
                break;
        }
    });

    */
}

export { parser_command };

export default { parser: parser_command };
