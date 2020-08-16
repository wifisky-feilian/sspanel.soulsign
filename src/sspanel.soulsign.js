/**
 * [sspanel.soulsign]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace sspanel.soulsign
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strick";

function operate_table(table, operator = function (item, index) {}, argument = []) {
    let table_ot = [];

    for (let idx = 0; idx < table.length; idx++) {
        table_ot.push(operator(table[idx], idx, argument));
    }

    return table_ot;
}

function operate_item(index, table, operator = function (item, index) {}) {
    return operator(table[index], index);
}

function construct_table(target, table, source = [], nest = false) {
    function endpoint() {
        let source_e = source[source.index++];
        return !!source_e ? source_e : {};
    }

    let key_ct = 0;

    if (!nest) source.index = 0; // 非嵌套，添加索引属性

    operate_table(table, function (item, idx) {
        if ("object" == typeof item) {
            target[table[idx - key_ct]] = construct_table(target[table[idx - key_ct]], item, source, true);
        } else {
            key_ct++;
            target[table[idx]] = {}; // 如果是 字符串 ，创建对象
        }
    });

    if (key_ct == table.length) {
        if (!key_ct) target = endpoint();
        else for (let idx = 0; idx < key_ct; idx++) target[table[idx]] = endpoint();
    } // 端点

    return target;
}

export { operate_table, operate_item, construct_table };
