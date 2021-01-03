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
        ["browser"], // 认证方式 [""]
        [
            {
                info: {
                    name: "alpha applet",
                    callback: (source, site, argument) => {
                        let message = `this is alpha applet. custom for ${site.url}`;
                        console.log(message);
                        return {
                            code: 0,
                            data: { IM: { recv: source, send: "Hi, would you go out playing tomorrow?" } },
                            message,
                        };
                    },
                },
                argument: { path: ["alpha"], keyword: [] },
            },
            {
                info: {
                    name: "beta applet",
                    callback: (source, site, argument) => {
                        let message = `this is beta applet. custom for ${site.url}`;
                        console.log(message);
                        return {
                            code: 0,
                            data: { IM: { recv: source, send: "WOW! Let's go playing tomorrow with alpha." } },
                            message,
                        };
                    },
                },
                argument: { path: ["beta"], keyword: [] },
            },
            {
                info: "sspanel.login",
                argument: { path: ["login"], keyword: [] },
                dependence: 0,
            },
            {
                info: "sspanel.signin",
                argument: { path: ["signin"], keyword: [] },
                dependence: "beta applet",
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
                function (source, situation) {
                    console.log("auth filter");
                    if (!iott.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, situation) {
                    console.log("applet filter");
                    if (!iott.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, situation) {
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

console.log(JSON.stringify(iott.line.variable.object));

console.log("demo end!");
