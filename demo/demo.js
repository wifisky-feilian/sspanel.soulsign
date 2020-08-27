import { construct_table } from "../src/sspanel.soulsign.js";

const table = [
    /* 属性 */
    "layer_0",
    "layer_1",
    "layer_2",
    /* 子属性 */
    ["layer_0_0", "layer_0_1", ["layer_0_0_0", "layer_0_0_1", [], []], []],
    ["layer_1_0", "layer_1_1"],
    [],
    /* 过滤器 */
    [
        [
            [
                function () {
                    return { source: "0_0_0" };
                },
            ],
        ],
        [
            function () {
                return { source: "0_1" };
            },
        ],
    ],
    [
        function () {
            return { source: "1_0" };
        },
        function () {
            return { source: "1_1" };
        },
    ],
    [],
];
let target = {};

construct_table(target, table);
console.log("target:", target);
console.log("\r");

const variable_table = [
        "domain",
        "keyword",
        "path",
        "hook",
        [],
        ["online", "signed"],
        ["log", "sign"],
        ["get_log_in", "post_sign_in", "notify_sign_in"],
    ],
    config_table = [
        ...variable_table,
        [
            function (value, parent) {
                console.log("value:", value, "parent:", parent);
                return { code: 0 };
            },
        ],
    ],
    assert_table = [
        ...variable_table,
        [
            function (value) {
                if (value instanceof Array && value.length) return { source: true };
                else return { source: false };
            },
        ],
    ];

let configs = {},
    asserts = {},
    variables = {};

console.log(assert_table);
console.log("\r");

console.log(construct_table(configs, config_table, [[[".com", ".net"]], [1, 2], [3, 4], [5, 6, 7]]));
console.log("configs:", configs);
console.log("\r");

variables = construct_table(asserts, assert_table, JSON.parse(JSON.stringify(configs))); // `深拷贝` configs，仅演示，使用时请自行选择 `深拷贝` 方法
console.log("asserts:", asserts);
console.log("\r");

console.log("variables:", variables);
