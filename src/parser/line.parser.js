/**
 * [line.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace line.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

/**
 * @todo operate.wait - support wait for some time. eg.: tools.control.wait(time.ready(time));
 */

"use strict";

import share from "../utils/share.utils.js"; // share.utils
import log from "../utils/log.utils.js"; // log.utils
import time from "../utils/time.utils.js"; // time.utils

import model from "./model.parser.js"; // model.parser
import platform from "./platform.parser.js"; // platform.parser
import auth from "./auth.parser.js"; // auth.parser
import applet from "./applet.parser.js"; // applet.parser
import site from "./site.parser.js"; // domain.parser

const variable = {
    object: {}, // model 转化后的所有变量
};

function parser(pattern, value, filter, callback = (object) => {}) {
    model.parser(pattern, variable.object, value, filter); // 解析 pattern

    log.debug.record("line.parser.model.parser() complete.");

    share.control.object.refer(variable.object); // 引用 variable.object 并控制它

    share.control.object.access(["platform"], (property) => {
        platform.parser(variable.object);
    });
    share.control.object.access(["auth"], (property) => {
        auth.parser(variable.object);
    });
    share.control.object.access(["site"], (property) => {
        site.parser(variable.object);
    });
    share.control.object.access(["applet"], (property) => {
        applet.parser(variable.object);
    });

    log.debug.record("line.parser.control.access() complete.");

    try {
        callback(variable.object);
    } catch (exception) {
        log.exception.record(2, { location: "line.parser.argument.callback()", exception });
    }
} // 解析

function operate(start = 0, end) {
    share.control.object.access(["site"], (property) => {
        share.operate.table(property.get, (site) => {
            applet.operate(start, end, site); // 运行 applet
        }); // 迭代 site
    }); // 获取 site
}

export { variable, parser, operate };

export default { variable, parser, operate };
