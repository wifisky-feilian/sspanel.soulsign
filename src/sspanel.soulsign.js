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
        let fil_e = _A_.filter.func(_A_.property());
        _A_.index.src++;
        return false === fil_e || 0 === fil_e || !!fil_e ? fil_e : {};
    }

    /* 非嵌套，添加辅助属性 */
    if (!nest) {
        source._assist_ = {
            index: { src: 0, ep: -1 },
            key: [],
            map: table,
            nest: [],
            property: [
                function () {
                    let map_p = _A_.map,
                        nest_p = _A_.nest,
                        path_p = nest_p.slice(-1),
                        prnt_p = "";

                    for (let idx = 0, len = nest_p.length - 1; idx < len; idx++) {
                        prnt_p += `.${map_p[nest_p[idx].key]}`;
                        map_p = map_p[nest_p[idx].val];
                    } // 计算出父对象路径

                    path_p = prnt_p + `.${map_p[path_p[0].key]}`; // 计算出路径

                    return { val: eval(`source${path_p}`), prnt: eval(`source${prnt_p}`) };
                },
                function () {
                    let index_p = _A_.index;
                    return {
                        val: source.length && !!source[index_p.ep] ? source[index_p.ep][index_p.src] : {},
                    };
                },
            ][Number(source instanceof Array)],
            filter: {
                cfg: {
                    tab: [],
                    idx: 0,
                    push(index, key) {
                        if (!this.idx) this.idx = key << 1;
                        this.tab.push(
                            this.tab.length ? this.tab.slice(-1)[0][index - key] : _A_.map[index - key + this.idx]
                        );
                    },
                    pop() {
                        this.tab.pop();
                    },
                },
                func(prop) {
                    let fil_f = {};
                    try {
                        fil_f = this.cfg.tab.slice(-1)[0][_A_.index.src];
                        fil_f = fil_f ? fil_f(prop.val, prop.prnt) : { code: 0 };
                    } catch (exception) {
                        fil_f = {};
                    } finally {
                        return fil_f.hasOwnProperty("source") ? fil_f.source : fil_f.code ? {} : prop.val;
                    }
                },
            },
        };
    }

    let _A_ = source._assist_,
        key_ct = 0;

    operate_table(table, function (item, idx) {
        if ("object" == typeof item) {
            _A_.key.push(key_ct);
            if (!_A_.key.length || [..._A_.key].pop() << 1 > idx) {
                _A_.nest.push({ key: idx - key_ct, val: idx, flt: idx << 1, nest: 0 });
                _A_.filter.cfg.push(idx, key_ct);
                target[table[idx - key_ct]] = construct_table(target[table[idx - key_ct]], item, source, _A_);
                _A_.filter.cfg.pop();
                _A_.nest.pop();
            }
        } else {
            key_ct++;
            target[table[idx]] = {}; // 如果是 字符串 ，创建对象
        }
    });

    if (key_ct == table.length) {
        _A_.index.src = 0;
        _A_.index.ep++;

        if (key_ct) {
            let nest_step = _A_.nest.push({ key: 0, val: 0 }) - 1;
            for (let idx = 0; idx < key_ct; idx++) {
                _A_.nest[nest_step].key = idx;
                target[table[idx]] = endpoint();
            }
            _A_.nest.pop();
        } else target = endpoint();
    } // 端点

    /* 非嵌套，删除辅助属性 */
    if (!nest) {
        delete source._assist_;
        return source;
    } else return target;
}

export { operate_table, operate_item, construct_table };
