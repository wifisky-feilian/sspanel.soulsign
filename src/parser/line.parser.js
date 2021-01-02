/**
 * [line.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace line.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 *
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
    chain: null,
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
        variable.chain = new share.chain(property.get.global, { source: property.get.custom }); // 创建 applet 链表
    });

    log.debug.record("line.parser.control.access() complete.");

    try {
        callback(variable.object);
    } catch (exception) {
        log.exception.record(2, { location: "line.parser.argument.callback()", exception });
    }
} // 解析

const operate = {
    single: function (start = 0, end, site = variable.object.site[0]) {
        share.control.object.access(["applet"], (property) => {
            // variable.chain.command(site.custom.applet); // 输入命令
            variable.chain.apply(); // 应用命令和小程序
            variable.chain.operate(
                {
                    try: (packet) => {
                        packet.result = packet.self.info.callback(
                            packet.source,
                            packet.self.argument,
                            ...packet.situation
                        ); // 执行小程序
                    },
                    catch: (packet) => {
                        log.exception.record(
                            2, // 错误
                            {
                                location: "line.operate.single.catch()",
                                detail: { site: packet.self.info.site, exception: packet.exception },
                            }
                        ); // 异常日志
                    },
                    succeed: (packet) => {
                        packet.tools.control.source.push(packet.result); // 存储执行结果
                    },
                },
                [site.domain]
            ); // 执行小程序

            site.save = variable.chain.save(); // 保存到 site.save 下
        }); // 获取 applet 变量
    },
    multiple: function (start = 0, end) {
        share.control.object.access(["site"], (property) => {
            share.operate.table(property.get, (site) => {
                this.single(start, end, site);
            });
        });
    },
};

export { variable, parser, operate };

export default { variable, parser, operate };