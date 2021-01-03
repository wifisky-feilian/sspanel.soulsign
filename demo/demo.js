import iott from "../src/iott.js"; // iott

const model = [
    [
        "platform", // 平台
        "auth", // 认证方式
        "applet", // 小程序
        "site", // 网站
        [],
        [],
        [],
        [],
    ], // pattern
    [
        "chrome.soulsign", // 平台 ""
        ["browser", "password", "taken", "cookie"], // 认证方式 [""]
        [
            {
                info: {
                    name: "hello applet",
                    callback: (source, argument, domain) => {
                        let string = `this is a custom applet. custom for ${domain}/${argument.path[0]}`;
                        console.log(string);
                        return string;
                    },
                },
                argument: { path: ["applet"], keyword: [], callback: {}, hook: {} },
            },
            {
                info: "sspanel.login",
                argument: { path: ["login"], keyword: [], callback: {}, hook: {} },
            },
            {
                info: "sspanel.signin",
                argument: { path: ["signin"], keyword: [], callback: {}, hook: {} },
                dependence: "sspanel.login",
            },
        ], // 小程序 [{}]
        ["http://localhost.com", { domain: "http://localhost.net" }], // 域名 [""]
    ], // value
    {
        custom: [
            [
                function (source, situation) {
                    console.log("platform filter");
                    if (!iott.share.verify.type(source, "string")) {
                        return {
                            code: true,
                            message: `type of source (value.${situation.path.join(".")}) is not string`,
                        };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("auth filter");
                    if (!iott.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("applet filter");
                    if (!iott.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, error, argument) {
                    console.log("site filter");
                    if (!iott.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
        ],
    }, // filter
];

iott.line.parser(...model);

iott.line.operate();

console.log(iott.line.variable.object);

console.log("demo end!");
