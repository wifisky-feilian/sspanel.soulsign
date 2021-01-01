/**
 * [model.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace model.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { parser_pattern } from "./pattern.parser.js"; // pattern.parser
import { parser_value } from "./value.parser.js"; // value.parser
import { parser_filter } from "./filter.parser.js"; // filter.parser

const variable = {
    nest: {
        path: [], // 路径数组，对应 object 的层层属性键名
        index: [], // 索引数组，对应 pattern 的层层索引
        branch: [], // 分支数组，对应 object 的上一层属性
    }, // 递归嵌套类
    count: {
        branch: 0,
        leaf: 0,
    }, // 计数
    leaf: {
        value: "", // 当前叶子节点的值
        filter: {}, // 当前叶子节点的过滤器
    }, // 叶子类
};

function parser_model(
    pattern, // 模式
    object, // 模式转化的目标对象
    value, // 模式中对应的叶子节点的值
    filter // 模式中对应的叶子节点的值过滤器
) {
    let branch = object; // 回调时的当前所在分支节点

    let accessor = {
        value: parser_value(value),
        filter: parser_filter(filter, null),
    };

    parser_pattern(
        pattern,
        {
            push: function (name, index) {
                // console.debug("push: %o", { name, index });

                variable.nest.path.push(name);
                variable.nest.index.push(index); // 记录路径

                variable.nest.branch.push(branch);
                branch = variable.nest.branch.slice(-1)[0]; // 记录当前分支的对应对象
            },
            pop: function (name, index) {
                // console.debug("pop: %o", { name, index });

                variable.nest.path.pop();
                variable.nest.index.pop(); // 记录路径

                branch = variable.nest.branch.slice(-1)[0];
                variable.nest.branch.pop(); // 记录前一分支的对应对象
            },
        },
        {
            branch: function (property) {
                // console.debug("branch: %o", { property });

                if (!branch.hasOwnProperty(property)) branch[property] = {}; // 如果没当前属性，创建空对象

                branch = branch[property]; // 转换为当前属性
                variable.count.branch++; // branch 计数自增
            },
            leaf: function (name) {
                // console.debug("leaf: %o", { name });

                try {
                    variable.leaf.value = accessor.value([variable.count.leaf, variable.nest.path]); // 取值

                    if (null !== variable.leaf.value && undefined !== variable.leaf.value) {
                        variable.leaf.value = accessor.filter(
                            variable.leaf.value,
                            { path: variable.nest.path, index: variable.count.leaf },
                            [branch[name], variable.nest.path]
                        ); // 取过滤器，并过滤
                    } // 可取到 "value"
                } catch (exception) {
                    variable.leaf.value = null;

                    throw exception;
                } finally {
                    branch[name] = variable.leaf.value; // 为键赋值
                    variable.count.leaf++; // leaf 计数自增
                }
            },
        }
    );
} // 分析器

export { parser_model };

export default {
    variable,
    parser: parser_model,
    extend_parser: {
        pattern: parser_pattern,
        value: parser_value,
        filter: parser_filter,
    },
};
