/**
 * [lib.share]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace lib.share
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 *
 * @todo callback - 计划使用 js 的 proxy，没某个属性时，返回 () => {}
 */

"use strict";

/**
 * @constant {object} operate Table driven operation
 *
 * @member {function} table operate through table
 * @member {function} item operate an item
 */

const operate = {
    table: function (table, operator = (item, tools) => {}, argument = []) {
        const control = {
            index: 0, // 当前所在索引
            abort: false, // 是否为“退出”状态
            continue: false, // 是否为“继续”状态
            method: function (method, message, record) {
                this[method] = true;
                if (record)
                    this.save.exception.push({ expectation: `call control.${method}`, index: this.index, message });
            }, // 方法模板
            export: {
                source: [], // 资源
                exception: [], // 异常
                abort: function (message = "", record = false) {
                    control.method("abort", message, record);
                }, // 退出
                continue: function (message = "", record = false) {
                    control.method("continue", message, record);
                }, // 继续
                wait: function () {
                    console.debug("This function is not ready.");
                }, // 等待
            },
        };

        for (; control.index < table.length && !control.abort; control.index++) {
            operator(
                table[control.index],
                { table, index: control.index, control: control.export, argument },
                ...argument
            );
        } // 循环

        return { source: control.export.source, exception: control.export.exception };
    },
    item: function (index, table, operator = function (item, index) {}) {
        return operator(table[index], index);
    },
};

const convert = {
    path: function (source) {
        if ("string" === typeof source) source = source.split(".");
        return source;
    },
};

const verify = {
    type: function (source, type) {
        type = convert.path(type); // 根据 "." 区分第一或第二类型

        if (type[0] === typeof source) {
            if (1 < type.length) {
                if (type[1].match("^[A-Za-z]+$")) return eval(`source instanceof ${type[1]}`);
                else return false; // [{第二个类型只包含字母，检查是否符合}, {第二个类型不只包含字母，不检查，为假}]
            } // 如果存在第二个类型

            return true;
        } // "." 之前的类型，即第一个类型是否满足

        return false;
    }, // 类型
    types: function (source, types = ["object.Object"]) {
        for (const type of types) {
            if (this.type(source, type)) return true;
        } // 遇到一个符合的即为 "真"

        return false;
    }, // 类型集
    property: function (object, path, farthest = (object, bool) => {}) {
        let property = null;

        path = convert.path(path); // 根据 "." 区分层级

        while (!!object) {
            if (object.hasOwnProperty((property = path[0]))) {
                object = object[property];
                path.shift();
            } else break;
        }

        farthest(object, !path.length);

        return !path.length;
    }, // 属性
    num: function (source, num = 0) {
        if (source.hasOwnProperty(length)) {
            return num > source.length;
        } // 如果有 "length" 属性

        return false;
    }, // 个数
}; // 验证

const select = {
    array: function (array = [], channel = 0) {
        return array[Number(channel)];
    }, // 数组
    object: function (object = {}, path = []) {
        let array = [];

        for (const item of path) {
            verify.property(object, item, (object, bool) => {
                if (bool) array.push(object);
            });
        }

        return array;
    }, // 对象
    farthest: function (paths, chain) {
        let index = 0; // 当前索引

        for (const path of paths) {
            if (1 != chain.path.slice(index).indexOf(path)) break; // 如果当前路径点不是剪切后的路径链中第一个，退出
            index++;
        } // 找到不同位置

        chain.path.length = index + 1; // 截到上一个相同的路径点，并保持第一个元素
        chain.source.length = index + 1;

        chain.path.push(...paths.slice(index)); // 压入本次不同的路径点

        return index;
    }, // 选出相同的最远的索引
}; // 选择

const control = {
    object: {
        source: null, // 操作对象
        chain: {
            path: [], // 路径
            source: [], // 变量
        }, // 上次的链路
        property: {
            name: "", // 属性名字
            parent: {}, // 属性的父节点
            set set(value) {
                this.parent[this.name] = value;
            },
            get get() {
                return this.parent[this.name];
            },
        }, // 'paths' 指定的属性
        refer: function (source) {
            this.source = source;
            this.chain.path.push("source");
            this.chain.source.push(source);
        }, //引用
        exist: function (path, existing = (property) => {}) {
            let index = select.farthest(path, this.chain); // 获取最远属性

            if (index < path.length) {
                let object = this.chain.source.slice(-1)[0]; // 获取最后一个元素

                for (const property of path.slice(index)) {
                    if (!(object = object[property])) return false; // 如果属性不存在，退出
                    this.chain.source.push(object); // 压入当前属性
                } // 根据路径，查找属性

                this.property.name = this.chain.path.slice(-1)[0]; // 获取属性名
                this.property.parent = this.chain.source.slice(-2)[0]; // 获取父元素
            } // 与上次路径不重叠

            existing(this.property); // 回调

            return true;
        }, // 判断是否存在
        access: function (paths, callback = (property) => {}) {
            if (!this.exist(paths, callback)) return undefined;
            else return this.property.get;
        }, // 获取属性
    }, // 变量
}; // 控制

class chain {
    #input = { persistent: [], dependent: {}, get_key: () => {} };
    #count = { persistent: 0, dependent: 0 };
    #array = [];
    #index = 0;
    #save = {};

    #push(array) {
        try {
            array.forEach((item) => {
                this.#array.push([this.#input.get_key(item), item]);
            }); // 存储，易于转换为 map 的形式
        } catch (exception) {
            throw exception;
        }
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
                source = this.#array[symbol];
                break;
            default:
                break;
        }

        return source;
    } // 依赖，默认依赖前一个

    constructor(
        persistent = [],
        dependent = { source: [], callback: () => {} },
        get_key = (item) => {
            item.info.name;
        }
    ) {
        this.#input = { persistent, dependent, get_key };

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

    apply(situation = []) {
        this.#array.size = this.#count.persistent; // 仅保留持久化的

        if (this.#input.dependent.hasOwnProperty("callback")) {
            let array = this.#input.dependent.callback(this.#input.dependent.source, ...situation); // 回调

            this.#push(array); // 存储
            this.#count.dependent = array.length;
        } // 提供了获取的回调函数

        if (this.#input.hasOwnProperty("command")) {
            console.debug("Not ready yet.");
        } // 有指令
    } // 根据 this.#input.config 配置 this.#list 和  this.#count

    operate(callback = { try: () => {}, catch: () => {}, succeed: () => {} }, situation = []) {
        this.#save = operate.table(
            this.#array,
            (source, tools, callback, situation) => {
                let packet = {
                    self: source[1],
                    source: this.#depend(source[1].dependence),
                    tools: { ...tools },
                    situation,
                    result: {},
                    exception: {},
                }; // 回调包

                this.#index = tools.index; // 更新索引

                try {
                    callback.try(packet); // 回调
                } catch (exception) {
                    packet.exception = exception;
                    callback.catch(packet); // 回调，处理异常

                    throw exception;
                }

                callback.succeed(packet); // 回调

                packet.self.save = packet.save; // 保存结果
            },
            [callback, situation]
        );
    } // 链式运行

    save() {
        return this.#save;
    } // 区出结果
}

export { operate, convert, verify, select, control, chain };

export default {
    operate,
    convert,
    verify,
    select,
    control,
    chain,
};
