import domalet from "../../../dist/domalet.esm.js"; // domalet

import auth from "../../auth/demo.auth.js"; // demo.auth
import model from "../../model/demo.model.js"; // demo.model
import applet from "../../applet/demo.applet.js"; // demo.applet

console.log("\n------------------------+{ demo.node start! }+------------------------\n");

domalet.line.parser(
    ...model.extract([
        "chrome.soulsign", // 平台 (string|object)
        [applet.extract("login")(auth.extract(["taken", "password"])), applet.extract("signin")], // 小程序 [object]
        [
            "http://localhost.com", // 只有无需凭据时能使用
            {
                domain: "http://localhost.cn",
                credential: [
                    { type: "password", source: { account: "1234567890", password: "1234567890" } },
                    { type: "taken", source: "!@#$%^&*()_+" },
                ], // 单账户凭据，隐式转换为多账户
            },
            {
                domain: "http://localhost.net",
                credential: [
                    [{ type: "taken", source: "!@#$%^&*()_+" }],
                    [{ type: "password", source: { account: "1234567890", password: "1234567890" } }],
                ], // 多账户凭据，标准形式
            },
        ], // 网站 [(object|string)]
    ])
); // 解析

domalet.line.operate(); // 运行

console.log("\n");
console.log(JSON.stringify(domalet.line.variable.object));

console.log("\n------------------------+{ demo.node end! }+------------------------\n");
