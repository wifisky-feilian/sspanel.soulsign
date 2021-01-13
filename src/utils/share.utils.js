/**
 * [share.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace share.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

/**
 * @todo callback - 计划使用 js 的 proxy，没某个属性时，返回 () => {}
 */

"use strict";

const map = {
    type: new Map([
        ["number", "number"],
        ["string", "string"],
        ["object", "object.Object"],
        ["array", "object.Array"],
    ]),
};

/**
 * @constant {object} operate Table driven operation
 *
 * @member {function} table operate through table
 * @member {function} item operate an item
 */

const operate = {
    table: function (table, operator = (item, tools) => {}, argument = []) {
        const control = {
            status: {
                index: 0, // 当前所在索引
                goto: { index: "here", save: undefined }, // 跳转到的索引
                abort: false, // 是否为“退出”状态
                continue: false, // 是否为“继续”状态
            }, // 状态
            method(method, status, message, record) {
                this.status[method] = status; // 操作状态对象
                if (record) {
                    this.save.exception.push({
                        expectation: `call control.${method}`,
                        index: this.index,
                        message,
                    });
                } // 是否记录到异常
            }, // 方法模板
            export: {
                source: [], // 资源
                exception: [], // 异常
                abort(message = "", record = false) {
                    control.method("abort", false, message, record);
                }, // 退出
                continue(message = "", record = false) {
                    control.method("continue", false, message, record);
                }, // 继续
                goto(index = "save", data, message = "", record = false) {
                    let save = control.status.goto.save; // 上次跳转时传入的参数

                    control.method("goto", { index, save: data }, message, record);

                    return save;
                }, // 跳转
                wait() {
                    console.debug("This function is not ready.");
                }, // 等待
            },
        };

        for (
            ;
            control.status.index < table.length && !control.status.abort;
            control.status.index = (function (index, goto) {
                switch (typeof goto) {
                    case "number":
                        if (0 > goto) {
                            if (index > Math.abs(goto)) {
                                goto += index;
                            } else {
                                goto = 0;
                            } // [{负数，正常}, {负数，溢出}]
                        } // 负数，表示反向增加
                        return goto;
                    case "string":
                    default:
                        return index + 1;
                }
            })(control.status.index, control.status.goto.index)
        ) {
            operator(
                table[control.status.index],
                { table, index: control.status.index, control: control.export, argument },
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
    type: function (
        source,
        type,
        callback = (save) => {
            return save.code;
        }
    ) {
        function type4string(source, type) {
            type = convert.path(type); // 根据 "." 区分第一或第二类型

            if (type[0] === typeof source) {
                if (1 < type.length) {
                    if (type[1].match("^[A-Za-z]+$")) return eval(`source instanceof ${type[1]}`);
                    else return false; // [{第二个类型只包含字母，检查是否符合}, {第二个类型不只包含字母，不检查，为假}]
                } // 如果存在第二个类型

                return true;
            } // "." 之前的类型，即第一个类型是否满足

            return false;
        } // 单个类型

        let save = { code: false };

        if ("string" === typeof type) type = [type];

        for (const item of type) {
            if (type4string(source, item)) {
                save.code = true;
                save.type = item;
                break;
            }
        } // 遇到一个符合的即为 "真"

        return callback(save);
    }, // 类型
    property: function (object, path, farthest = (object, bool) => {}) {
        let property = null;

        path = convert.path(path); // 根据 "." 区分层级

        while (object) {
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
    type(symbol = []) {
        return operate.table(symbol, (symbol, tools) => {
            tools.control.source.push(map.type.get(symbol));
        }).source;
    }, // 选出 symbol 对应的 verify.type 的类型数组
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

const assert = function (source, type, name, callback) {
    let result = verify.type(source, select.type(type), (save) => {
        save = { code: !save.code };
        if (save.code) save.message = `type of ${name} is wrong, should be ${type.join("|")}`;
        return save;
    });

    if (result.code && "function" === typeof callback) return callback(result);
    else return result; // [{没错误且 callback 为函数类型}]
};

const call = function (source, argument, hook = () => {}, callback = (arg) => arg) {
    let save = { result: {} };

    return operate.table(source, (source, tools) => {
        save.argument = argument[tools.index];

        hook(save, tools);

        if (verify.type(source, ["function"])) {
            save.result = callback(source(...save.argument), tools);
        }
    });
};

export { operate, convert, verify, select, assert, call };

export default { operate, convert, verify, select, assert, call };
