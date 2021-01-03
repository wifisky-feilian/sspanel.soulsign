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
import probe from "../utils/probe.utils.js"; // probe.utils

import model from "./model.parser.js"; // model.parser
import platform from "./platform.parser.js"; // platform.parser
import auth from "./auth.parser.js"; // auth.parser
import applet from "./applet.parser.js"; // applet.parser
import site from "./site.parser.js"; // domain.parser

const variable = {
    object: {}, // model 转化后的所有变量
    probe: null,
};

function parser(pattern, value, filter, callback = (object) => {}) {
    model.parser(pattern, variable.object, value, filter); // 解析 pattern

    log.debug.record("line.parser.model.parser() complete.");

    variable.probe = new probe(variable.object); // 创建 variable.object 探针

    variable.probe.access(["platform"], (property) => {
        platform.parser(variable.object);
    });
    variable.probe.access(["auth"], (property) => {
        auth.parser(variable.object);
    });
    variable.probe.access(["site"], (property) => {
        site.parser(variable.object);
    });
    variable.probe.access(["applet"], (property) => {
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
    variable.probe.access(["site"], (site) => {
        share.operate.table(site.get, (site) => {
            variable.probe.access(["auth"], (auth) => {
                applet.operate(start, end, site, auth.get); // 运行 applet
            }); // 获取 auth
        }); // 迭代 site
    }); // 获取 site
}

export { variable, parser, operate };

export default { variable, parser, operate };
