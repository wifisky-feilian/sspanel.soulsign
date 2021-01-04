/**
 * @description applet zone
 */

import applet from "../src/support/applet.support.js"; // applet.support

const sspanel = {
    login: {
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
        argument: { path: ["auth/login"], keyword: [] },
    },
    signin: {
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
};

function extract4sspanel(name) {
    return applet.extract(sspanel, name);
}

// export default {sspanel, extract: extract4applet };

/**
 * @description model zone
 */

import model from "../src/support/model.support.js"; // model.support

const group = [
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
    {
        custom: [
            [
                function (source, situation) {
                    console.log("platform filter");
                    if (!model.share.verify.type(source, "string")) {
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
                    if (!model.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, situation) {
                    console.log("applet filter");
                    if (!model.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
            [
                function (source, situation) {
                    console.log("site filter");
                    if (!model.share.verify.type(source, "object.Array")) {
                        return { code: true };
                    }

                    return { code: false };
                },
            ],
        ],
    }, // filter
];

function extract4group(value) {
    return model.extract(group, value);
}

// export default {group, extract: extract4model};

/**
 * @description application zone
 */

import iott from "../src/iott.js"; // iott

iott.line.parser(
    ...extract4group([
        "chrome.soulsign", // 平台 (string|object)
        ["browser", "taken"], // 认证方式 [(string|object)]
        [extract4sspanel("login"), extract4sspanel("signin")], // 小程序 [object]
        [
            "http://localhost.com", // 只能不需要凭据时能使用
            { domain: "http://localhost.net", credential: [{ type: "taken", source: "!@#$%^&*()_+" }] }, // 必须有凭据
        ], // 网站 [(object|string)]
    ])
);

iott.line.operate();

console.log(JSON.stringify(iott.line.variable.object));

console.log("demo end!");
