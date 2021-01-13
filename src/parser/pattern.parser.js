/**
 * [pattern.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace pattern.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strick";

import { verify, operate } from "../utils/share.utils.js"; // share.utils

function parser_pattern(
    map,
    nest = {
        push: () => {},
        pop: () => {},
    },
    callback = {
        leaf: () => {},
        branch: () => {},
    }
) {
    operate.table(
        map,
        function (item, tools, pattern) {
            if (verify.type(item, "string")) {
                let branch = pattern[pattern.length / 2 + tools.index]; // 对应的 "分支/属性" 内容

                nest.push(item, tools.index); // 嵌套

                if (branch.length) {
                    callback.branch(item);
                    parser_pattern(branch, nest, callback); // 递归
                } else {
                    callback.leaf(item);
                } // [{非空数组，分支节点}, {空数组，叶子节点}]

                nest.pop(item, tools.index); // 解嵌套
            } else {
                tools.control.abort(); // 退出
            } // [{"string" 类型，属性键值}, {"object.Array" 类型，属性内容}]
        },
        [map]
    );
} // 解析模式

export { parser_pattern };

export default { parser: parser_pattern };
