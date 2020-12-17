/*

console.log(
    operate_table(["a", "b", "c"], function (item, tools) {
        console.log(item);
        tools.control.save(`save "${item}"`);
        if (item == "b") return tools.control.abort([item]);
    })
);

const model = [
        "layer_0",
        "layer_1",
        "layer_2",
        [],
        [
            "layer_1_0",
            "layer_1_1",
            "layer_1_2",
            ["layer_1_0_0", "layer_1_0_1", "layer_1_0_2", [], ["layer_1_0_1_0", "layer_1_0_1_1", [], []], []],
            [],
            ["layer_1_2_0", []],
        ],
        ["layer_2_0", "layer_2_1", [], []],
    ],
    filter = [
        function (value) {
            return { source: value };
        },
        function (value) {
            return { source: value };
        },
        function (value, self) {
            return { source: [self, "1_0_1_0"] };
        },
        function (value) {
            return { source: "1_0_1_1" };
        },
        function (value) {
            return { source: value };
        },
        function (value) {
            return { source: "1_1" };
        },
        function (value) {
            return { source: "1_2_0" };
        },
        function (value) {
            return { code: 1 };
        },
        function (value) {
            return { source: "2_1" };
        },
    ];

let object = {};

parser_model(model, object);
console.log("object:", object);

parser_model(model, object, [0, "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
console.log("object:", object);

parser_model(model, object, object, {
    global: (val) => {
        return { code: val === 0 };
    },
    custom: filter,
});
console.log("object:", object);

*/

import { multiple } from "../model/multiple.model.js"; // multiple.model

multiple();

console.log("demo end!");

// const table = [
//     /* 属性 */
//     "layer_0",
//     "layer_1",
//     "layer_2",
//     /* 子属性 */
//     ["layer_0_0", "layer_0_1", ["layer_0_0_0", "layer_0_0_1", [], []], []],
//     ["layer_1_0", "layer_1_1"],
//     [],
//     /* 过滤器 */
//     [
//         [
//             [
//                 function () {
//                     return { source: "0_0_0" };
//                 },
//             ],
//         ],
//         [
//             function () {
//                 return { source: "0_1" };
//             },
//         ],
//     ],
//     [
//         function () {
//             return { source: "1_0" };
//         },
//         function () {
//             return { source: "1_1" };
//         },
//     ],
//     [],
// ];
// let target = {};

// construct_table(target, table);
// console.log("target:", target);
// console.log("\r");

// const variable_table = [
//         "domain",
//         "keyword",
//         "path",
//         "hook",
//         [],
//         ["online", "signed"],
//         ["log", "sign"],
//         ["get_log_in", "post_sign_in", "notify_sign_in"],
//     ],
//     config_table = [
//         [
//             function (value, parent) {
//                 console.log("value:", value, "parent:", parent);
//                 return { code: 0 };
//             },
//         ],
//     ],
//     assert_table = [
//         [
//             function (value) {
//                 if (value instanceof Array && value.length) return { source: true };
//                 else return { source: false };
//             },
//         ],
//     ];

// let configs = {},
//     asserts = {},
//     variables = {};

// config_table.unshift(...variable_table);
// assert_table.unshift(...variable_table);

// console.log(control_table.verify.type(/a/, ["object.String"]));

// console.log(assert_table);
// console.log("\r");

// console.log(construct_table(configs, config_table, [[[".com", ".net"]], [1, 2], [3, 4], [5, 6, 7]]));
// console.log("configs:", configs);
// console.log("\r");

// control_source.refer(configs);

// console.log(control_source.exist(["path", "online"]));
// console.log(control_source.access(["path", "log"], "a"));
// console.log(control_source.access(["path", "sign"]));
// console.log(control_source.access(["path", "sign"]));

// variables = construct_table(asserts, assert_table, JSON.parse(JSON.stringify(configs))); // `深拷贝` configs，仅演示，使用时请自行选择 `深拷贝` 方法
// console.log("asserts:", asserts);
// console.log("\r");

// console.log("variables:", variables);
