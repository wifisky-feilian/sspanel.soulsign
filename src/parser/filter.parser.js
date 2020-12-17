/**
 * [filter.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace filter.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { operate, select } from "../utils/share.utils.js"; // share.utils

const variable = {
    input: null,
    count: {
        global: 0,
        custom: 0,
    }, // 计数器
    chain: [], // 过滤链
    save: {}, // 保存
};

const config = {
    channel: function () {
        if (variable.input.hasOwnProperty("custom")) {
            return !!variable.input.custom;
        }
    },
    global: function () {
        variable.count.global = 0;
        variable.chain.length = 0;

        if (variable.input.hasOwnProperty("global")) {
            variable.chain.push(variable.input.global); //  添加全局过滤器
            variable.count.global = 1;
        }
    },
    custom: function (access) {
        variable.count.custom = 0;
        variable.chain.length = variable.count.global; // 仅保留全局过滤器

        if (variable.input.hasOwnProperty("custom") && variable.input.custom.length) {
            let custom = variable.input.custom.access(variable.input.custom.source, access);

            variable.count.custom = custom.length;
            variable.chain.push(...custom); // 添加自定义过滤器
        }
    },
};

function filter_chain(source, error, argument) {
    variable.save = operate.table(
        variable.chain,
        (filter, tools) => {
            let result = {},
                source = !tools.index ? tools.argument[0] : tools.control.source.slice(-1)[0].source; // 如果是第一个，使用 source，否则使用最后一次过滤的结果
            try {
                result = filter(source, ...argument); // 过滤

                if (undefined === result) {
                    tools.control.exception.push({
                        message: `filter ${tools.index} doesn't return anything.`,
                        exception: filter,
                    }); // 储存异常
                } else {
                    if (!result.hasOwnProperty("source")) result.source = source; // 无 source 属性，添加为当前 source
                    tools.control.source.push(result); // 储存资源
                } // [{无返回值}, {有返回值}]
            } catch (exception) {
                tools.control.exception.push({
                    message: `filter ${tools.index} catch exception.`,
                    exception,
                }); // 储存异常

                result = { code: true };

                throw exception;
            } finally {
                if (result.hasOwnProperty("code") && result.code) {
                    tools.control.source.push({ source: error }); // 储存资源，指定错误时的值

                    tools.control.abort(); // 退出
                } // 遇到一个 code 为真的，退出过滤器链，且返回预算错误信息
            }
        },
        [source]
    ); // 链式过滤，并得到过滤过程及其结果

    return variable.save.source.slice(-1)[0].source; // 返回过滤结果
}

function parser_filter(filter, error) {
    variable.input = !!filter ? filter : {}; // 转存 filter

    config.global(); // 配置全局过滤器

    return select.array(
        [
            function (source, access, argument) {
                return filter_chain(source, error, argument);
            }, // undefined
            function (source, access, argument) {
                config.custom(access[0]); // 配置自定义过滤器

                return filter_chain(source, error, argument);
            }, // object.Array
        ],
        config.channel()
    );
}

export { variable, parser_filter };

export default { variable, parser: parser_filter };
