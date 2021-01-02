import { multiple } from "../model/multiple.model.js"; // multiple.model

multiple([
    "chrome.soulsign", // 平台 ""
    ["browser", "password", "taken", "cookie"], // 认证方式 [""]
    [
        {
            info: "sspanel.login",
            argument: { path: ["login"], keyword: [], callback: {}, hook: {} },
        },
        {
            info: "sspanel.signin",
            argument: { path: ["signin"], keyword: [], callback: {}, hook: {} },
            dependence: "sspanel.login",
        },
        {
            info: {
                name: "custom_applet",
                callback: (source, argument, domain) => {
                    let string = `this is custom applet(). custom for ${domain}/${argument.path[0]}`;
                    console.log(string);
                    return string;
                },
            },
            argument: { path: ["applet"], keyword: [], callback: {}, hook: {} },
            dependence: 0,
        },
    ], // 小程序 [{}]
    ["http://localhost.com", { domain: "http://localhost.net" }], // 域名 [""]
]);

console.log("demo end!");
