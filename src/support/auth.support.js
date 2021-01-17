/**
 * [auth.support]{@link https://github.com/miiwu/auth.domalet}
 *
 * @namespace auth.support
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

/**
 * @module share.utils - offer some basic utils
 */

import share from "../utils/share.utils.js"; // share.utils

/**
 * Return the auth array
 * @param {object} name - the auth object of your xxx.auth.js
 * @param {array} name - the name of auth
 * @return {object} - the auth array
 */

function extract(auth, name) {
    let save = [];

    name.forEach((name) => {
        if (!Object.prototype.hasOwnProperty.call(auth, name))
            throw `auth.support -> "${name}" is not included now, you must choose from: ${Object.keys(auth).join("|")}`;

        save.push({ name, ...auth[name] });
    });

    return save;
} // 提取

export { share, extract };

export default { share, extract };
