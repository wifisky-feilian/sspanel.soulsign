/**
 * [model.support]{@link https://github.com/miiwu/model.iott}
 *
 * @namespace model.support
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
 * Return the model, then need use "..." to spread it
 * @param {array} model - the model array of your xxx..model.js
 * @param {(array|object)} value - the value argument when line.parser()
 * @return {array} - the model array with value
 */

function extract(model, value) {
    model.splice(1, 0, value);

    return model;
} // 提取

export { share, extract };

export default { share, extract };
