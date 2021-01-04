import iott from "../src/iott.js"; // iott

import source from "../src/parser/source.parser.js"; // source.parser

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
        ["browser", "taken"], // 认证方式 [""]
        [
            {
                info: {
                    name: "sspanel.login",
                    callback: function (source, site, argument) {
                        console.log(site.auth);

                        return { code: 0, data: "axios.get(site.url)", message: source };

                        /*
                         
                        return { code: 0, data: axios.get(site.url.get) };

                        */
                    },
                }, // applet 信息
                auth: true, // applet 认证
                argument: { path: ["auth/login"], keyword: [] }, // applet 参数
            },
            {
                info: {
                    name: "sspanel.signin",
                    callback: function (source, site, argument) {
                        return { code: 0, data: "axios.post(site.url)", message: source };

                        /*
                         
                        let data = axios.post(site.url.post);

                        return { code: 0, data: data.data.msg };

                        */
                    },
                },
                argument: { path: ["user/checkin"], keyword: [] },
                dependence: "sspanel.login", // applet 依赖
            },
        ], // 小程序 [{}]
        [
            "http://localhost.com",
            { domain: "http://localhost.net", credential: [{ type: "taken", source: "!@#$%^&*()_+" }] },
        ], // 域名 [""]
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
