import { construct_table } from "../src/sspanel.soulsign.js";

const assert_table = [
        "domain",
        "keyword",
        "path",
        "hook",
        [],
        ["online", "signed"],
        ["log", "sign"],
        ["get_log_in", "post_sign_in", "notify_sign_in"],
    ],
    variable_tables = [...assert_table],
    config_table = ["site", "param", [...assert_table], [...assert_table]];

let configs = {},
    asserts = {},
    variables = {};

let sites;

console.log(assert_table, assert_table, config_table);

console.log(construct_table(variables, assert_table));
console.log(construct_table(asserts, assert_table));
console.log(construct_table(configs, config_table, [".com", "a", "b", "c", "d", function () {}, , , ".net", "e"]));
