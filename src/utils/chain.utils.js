/**
 * [chain.utils]{@link https://github.com/miiwu/sspanel.soulsign}
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
    #index = 0; // operate() 时，当前运行的索引
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

    #depend(symbol = this.#index) {
        let source = {};

        switch (typeof symbol) {
            case "string": // 字符串，即名字
                this.#virtual((map) => {
                    source = map.get(symbol);
                });
                break;
            case "number": // 数字，即索引
                source = this.#array[symbol][1];
                break;
            default:
                break;
        }

        if (!!source & source.hasOwnProperty("save")) {
            source = source.save;
        } // 如果有 save 属性

        if (verify.type(this.#input.callback.depend, "function")) {
            source = this.#input.callback.depend(source);
        } // 回调，过滤 depend

        return source;
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

    operate(callback = { try: () => {}, catch: () => {}, succeed: () => {} }, situation = [], start = 0, end) {
        this.#save = operate.table(
            this.#array.slice(start, end),
            (source, tools, callback, situation) => {
                let packet = {
                    self: source[1],
                    source: this.#depend(source[1].dependence),
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
