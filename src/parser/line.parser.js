/**
 * [line.parser]{@link https://github.com/miiwu/domalet}
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

import log from "../utils/log.utils.js"; // log.utils
import probe from "../utils/probe.utils.js"; // probe.utils

import model from "./model.parser.js"; // model.parser
import platform from "./platform.parser.js"; // platform.parser
import applet from "./applet.parser.js"; // applet.parser
import site from "./site.parser.js"; // domain.parser

const variable = {
    object: {}, // model 转化后的所有变量
    probe: null,
    method: {
        parser(probe, object) {
            probe.access(["platform"], () => {
                platform.parser(object);
            });
            probe.access(["site"], () => {
                site.parser(object);
            });
            probe.access(["applet"], () => {
                applet.parser(object);
            });

            log.debug.record("line.parser.control.access() complete.");
        },
        operate(argument, probe) {
            probe.access(["site"], (property) => {
                applet.operate(argument.section[0], argument.section[1], property.get); // 运行 applet
            }); // 获取 site
        },
    },
};

/**
 * Parser the pattern format to object that probe attached, filter the value, then assign to the object
 * @param {array} pattern
 * @param {array} value
 * @param {array} filter
 * @param {function(probe, object)} callback
 */

function parser(pattern, value, filter, callback = variable.method.parser) {
    model.parser(pattern, variable.object, value, filter); // 解析 pattern
    log.debug.record("line.parser parser complete.");

    variable.probe = new probe(variable.object); // 创建 variable.object 探针
    log.debug.record("line.parser probe complete.");

    try {
        callback(variable.probe, variable.object);
    } catch (exception) {
        log.exception.record(2, { location: "line.parser.arguments.callback()", exception });
    }
} // 解析

/**
 * Operate callback with the argument
 * @param {array} argument
 * @param {function(argument, probe, object)} callback
 */

function operate(argument = { section: [0] }, callback = variable.method.operate) {
    try {
        callback(argument, variable.probe, variable.object);
    } catch (exception) {
        log.exception.record(2, { location: "line.operate.arguments.callback()", exception });
    }
} // 运行

export { variable, parser, operate };

export default { variable, parser, operate };
