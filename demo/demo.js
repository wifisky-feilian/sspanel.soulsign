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
                    callback: (source, site, argument) => {
                        let message = `this is a custom applet. custom for ${site.url}`;
                        console.log(message);
                        return { code: 0, data: source, message };
                    },
                },
                argument: { path: ["hello"], keyword: [] },
            },
            {
                info: "sspanel.login",
                argument: { path: ["login"], keyword: [] },
            },
            {
                info: "sspanel.signin",
                argument: { path: ["signin"], keyword: [] },
                dependence: "hello applet",
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
