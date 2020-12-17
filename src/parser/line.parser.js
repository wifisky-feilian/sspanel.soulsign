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

import time from "./time.parser.js"; // time.parser

import model from "./model.parser.js"; // model.parser

const variable = {
    object: {}, // model 转化后的所有变量
    chain: null,
};

function parser(pattern, value, filter, callback = (object) => {}) {
    model.parser(pattern, variable.object, value, filter); // 解析 pattern

    share.control.object.refer(variable.object); // 引用 variable.object 并控制它

    callback(variable.object);
} // 解析

function depend(symbol) {} // 依赖

const operate = {
    single: function (site) {
        share.control.object.access(["applet"], (property) => {
            variable.chain = new share.chain(property.get.global, { source: property.get.custom }); // 创建 applet 链表

            // variable.chain.command(site.custom.applet); // 输入命令
            variable.chain.apply(); // 应用命令和小程序
            variable.chain.operate(
                {
                    try: (packet) => {
                        packet.result = packet.source.info.callback(packet.source.argument, ...packet.situation); // 执行小程序
                    },
                    catch: (packet) => {
                        throw { info: packet.source.info, exception: packet.exception };
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
            share.operate.table(property.get, (site, tools) => {
                this.single(site);
            });
        });
    },
};

export { variable, parser, depend, operate };

export default { variable, parser, depend, operate };
