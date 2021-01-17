/**
 * [applet.support]{@link https://github.com/miiwu/applet.domalet}
 *
 * @namespace applet.support
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

/**
 * @module share.utils - offer some basic utils
 *
 * @module auth.parser - offer some parser for auth credential
 * @module meta.parser - offer some parser for html source
 */

import share from "../utils/share.utils.js"; // share.utils

import auth from "../parser/auth.parser.js"; // auth.parser
import meta from "../parser/meta.parser.js"; // meta.parser

/**
 * Return the applet object
 * @param {object} applet - the applet object of your xxx.applet.js
 * @param {array} callback - the callback with applet argument
 * @return {object} - the applet object with argument
 */

function extract(
    applet,
    name,
    callback = (applet) => {
        return applet;
    }
) {
    if (!Object.prototype.hasOwnProperty.call(applet, name))
        throw `applet.support -> "${name}" is not included now, you must choose from: ${Object.keys(applet).join("|")}`;

    return callback(applet[name]);
} // 提取

export { share, auth, meta, extract };

export default { share, auth, meta, extract };
