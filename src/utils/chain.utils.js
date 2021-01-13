/**
 * [chain.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace chain.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { operate, verify } from "./share.utils.js"; // share.utils

class chain {
    #input = { persistent: [], dependent: {}, callback: {} }; // 输入
    #count = { persistent: 0, dependent: 0 }; // 关于 #array 的计数
    #array = []; // operate() 运行的表
    #index = -1; // operate() 时，当前运行的索引
    #save = {}; // operate() 的结果

    #push(array) {
        try {
            array.forEach((item, key) => {
                try {
                    if (verify.type(this.#input.callback.key, "function")) {
                        key = this.#input.callback.key(item, key);
                    } // 回调，取得 key，便于 this.#depend
                } catch (exception) {
                    throw exception;
                }

                this.#array.push([key, item]);
            }); // 存储，易于转换为 map 的形式
        } catch (exception) {
            throw exception;
        }

        return array.length;
    } // 添加 array 到 this.#array

    #virtual(callback) {
        this.#array = new Map(this.#array); // 转成 Map 类型

        callback(this.#array); // 回调

        this.#array = [...this.#array]; // 转回 array 类型
    } // 虚拟 this.#array 为 map，可以使用 map 方式操作 this.#array

    #depend(symbol = [this.#index], depend) {
        return new Map(
            operate.table(symbol, (symbol, tools) => {
                let source = {},
                    filter = true;

                switch (typeof symbol) {
                    case "string": // 字符串，即名字
                        this.#virtual((map) => {
                            source = map.get(symbol);
                        });
                        break;
                    case "number": // 数字，即索引，为了可能的增删改查后的稳定，不建议外部使用
                        if (0 <= symbol) {
                            source = this.#array[symbol][1];
                            break;
                        } // 不小于零，正常索引
                    default:
                        if (-1 === symbol) symbol = "depend";
                        source = depend; // 错误情况，包括首次的 -1
                        filter = false;
                        break;
                }

                if (filter && verify.type(this.#input.callback.depend, "function")) {
                    source = this.#input.callback.depend(source);
                } // 回调，过滤 depend

                tools.control.source.push([symbol, source]);
            }).source
        );
    } // 依赖，默认依赖前一个

    constructor(
        persistent = [],
        dependent = {
            source: [],
        },
        callback = {}
    ) {
        this.#input = { persistent, dependent, callback };

        if (persistent.length) {
            this.#count.persistent += persistent.length; // 计数

            this.#push(persistent); // 存储
        }
    }

    command(source = []) {
        this.#input.command = source;

        this.#virtual((map) => {
            operate.table(source, (item) => {
                switch (item.command) {
                    case "+": // 添加
                        map[item.name] = item.object;
                        break;
                    case "-": // 删除
                        map.delete(item.name);
                        break;
                    case "=": // 修改
                        item.object(map[item.name]);
                        break;
                    default:
                        break;
                }
            });
        });
    } // 输入命令

    apply(argument = []) {
        this.#array.length = this.#count.persistent; // 仅保留持久化的

        if (this.#input.dependent.hasOwnProperty("callback")) {
            this.#count.dependent = this.#push(
                this.#input.dependent.callback(this.#input.dependent.source, ...argument) // 回调，获取
            ); // 存入链式数组
        } // 提供了获取的回调函数

        if (this.#input.hasOwnProperty("command")) {
            console.debug("Not ready yet.");
        } // 有指令
    } // 根据 this.#input.config 配置 this.#list 和  this.#count

    operate(callback = { try: () => {}, catch: () => {}, succeed: () => {} }, situation = [], section = [0], depend) {
        this.#save = operate.table(
            this.#array.slice(...section),
            (source, tools, callback, situation) => {
                let packet = {
                    self: source[1],
                    source: this.#depend(source[1].dependence, depend),
                    tools: { ...tools },
                    situation,
                    result: {},
                    exception: {},
                }; // 回调包

                this.#index = tools.index; // 更新索引，用于 this.#depend

                try {
                    callback.try(packet); // 回调
                } catch (exception) {
                    packet.exception = exception;
                    callback.catch(packet); // 回调，处理异常

                    throw exception;
                }

                callback.succeed(packet); // 回调

                packet.self.save = packet.result; // 保存结果，用于 this.#depend
            },
            [callback, situation]
        );

        this.#array.forEach((item) => {
            delete item[1].save;
        }); // 删除保存的结果
    } // 链式运行

    save() {
        if (verify.type(this.#input.callback.save, "function")) {
            this.#save.save.forEach((item, index, array) => {
                this.#input.callback.save(...arguments);
            });
        } // 回调，过滤 this.#save

        return this.#save;
    } // 取出结果
}

export { chain };

export default chain;
