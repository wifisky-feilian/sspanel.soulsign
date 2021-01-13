/**
 * [filter.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace filter.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import chain from "../utils/chain.utils.js"; // chain.utils

import log from "../utils/log.utils.js"; // log.utils

const variable = {
    input: null,
    chain: [], // 过滤链
    save: {}, // 保存
};

function parser_filter(filter, error) {
    variable.input = filter ? filter : { global: [], custom: [] }; // 转存 filter

    variable.chain = new chain(variable.input.global, {
        source: variable.input.custom,
        callback: (source, index) => {
            return source[index];
        },
    }); // 创建 filter 链

    return (source, location, situation) => {
        function message(packet, message) {
            return `filter object.${packet.situation[1].path.join(".")} (filter.custom[${packet.situation[1].index}][${
                packet.tools.index
            }]) ${message}`;
        }

        variable.chain.apply([location.index]); // 根据索引应用过滤器
        variable.chain.operate(
            {
                try: (packet) => {
                    if (!packet.tools.index) {
                        packet.source = packet.situation[0];
                    } // 如果第一个，使用传入的 source

                    packet.result = packet.self(packet.source, packet.situation[1]); // 过滤

                    if (undefined === packet.result) {
                        packet.tools.control.exception.push({
                            errno: 1, // 警告
                            message: message(packet, "doesn't return anything."), // 信息
                        }); // 储存异常
                    } else {
                        if (!packet.result.hasOwnProperty("source")) packet.result.source = packet.source; // 无 source 属性，添加为当前 source
                        packet.tools.control.source.push(packet.result); // 储存资源
                    } // [{无返回值}, {有返回值}]
                },
                catch: (packet) => {
                    packet.tools.control.exception.push({
                        errno: 2, // 错误
                        message: message(packet, "catch exception."), // 信息
                        exception: packet.exception,
                    }); // 储存异常

                    packet.result = { code: true };
                },
                succeed: (packet) => {
                    if (packet.result.hasOwnProperty("code") && packet.result.code) {
                        packet.tools.control.source.push({ source: error }); // 储存资源，指定错误时的值
                        packet.tools.control.exception.push({
                            errno: 2, // 错误
                            message: message(packet, `failed: ${packet.result.message}`), // 信息
                            exception: packet.result,
                        }); // 储存异常

                        packet.tools.control.abort(); // 退出
                    } // 遇到一个 code 为真的，退出过滤器链，且返回预算错误信息

                    packet.result = packet.result.source;
                },
            },
            [source, location, situation]
        );

        variable.save = variable.chain.save(); // 保存结果

        return variable.save.source.slice(-1)[0].source; // 返回过滤结果
    };
}

export { variable, parser_filter };

export default { variable, parser: parser_filter };
