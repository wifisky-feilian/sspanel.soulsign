/**
 * [applet.support]{@link https://github.com/miiwu/model.iott}
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
 * @module source.parser - offer some parser for html source
 */

import share from "../utils/share.utils.js"; // share.utils

import auth from "../parser/auth.parser.js"; // auth.parser
import source from "../parser/source.parser.js"; // source.parser

/**
 * Return the applet
 * @param {object} applet - the applet object of your xxx.applet.js
 * @param {array} argument - the argument property of applet when line.parser()
 * @return {object} - the applet object with argument
 */

function extract(applet, name, argument = applet[name].argument) {
    applet = applet[name];

    applet.argument = argument;

    return applet;
} // 提取

export { share, auth, source, extract };

export default { share, auth, source, extract };
