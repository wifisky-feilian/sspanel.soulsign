/**
 * [probe.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace probe.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import { select } from "./share.utils.js"; // share.utils

class probe {
    #input = null; // 操作对象
    #chain = {
        path: [], // 路径
        source: [], // 变量
    }; // 上次的链路
    #stack = []; // property 栈
    #property = null; // 'paths' 指定的属性

    #exist(path) {
        let index = select.farthest(path, this.#chain); // 获取最远属性

        this.#property = this.#stack[this.#stack.length - 1]; // 切换

        this.#chain.path.length = index + 1;
        this.#chain.source.length = index + 1; // 保留重叠部分

        for (const property of path.slice(index)) {
            let object = this.#chain.source.slice(-1)[0]; // 获取最后一个元素
            if (!(object = object[property])) return false; // 如果属性不存在，退出
            this.#chain.path.push(property); // 压入当前属性名
            this.#chain.source.push(object); // 压入当前父属性
        } // 根据不重叠部分路径路径，查找属性

        this.#property.name = this.#chain.path.slice(-1)[0]; // 获取属性名
        this.#property.parent = this.#chain.source.slice(-2)[0]; // 获取父元素

        return true;
    } // 判断是否存在

    constructor(source) {
        this.#input = source;
        this.#chain.path.push("source");
        this.#chain.source.push(source);
    } //引用

    exist(path, existing = (property) => {}) {
        this.#stack.push({
            set set(value) {
                this.parent[this.name] = value;
            },
            get get() {
                return this.parent[this.name];
            },
        });

        let bool = this.#exist(path);

        if (bool) existing(this.#property); // 回调

        this.#stack.pop();

        return bool;
    } // 判断是否存在，可嵌套

    access(paths, callback = (property) => {}) {
        if (!this.exist(paths, callback)) return undefined;
        else return this.#property.get;
    } // 获取属性
} // 变量

export { probe };

export default probe;
