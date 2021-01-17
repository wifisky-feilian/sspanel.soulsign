import model from "../../dist/support/model.support.esm.js"; // model.support

const group = [
    [
        "platform", // 平台
        "applet", // 小程序
        "site", // 网站
        [],
        [],
        [],
    ], // pattern
    {
        custom: [
            [
                function (source, situation) {
                    console.log("platform filter");

                    let result = model.assert.platform(source);

                    return result;
                },
            ],
            [
                function (source, situation) {
                    console.log("applet filter");

                    let result = model.assert.applet(source);

                    return result;
                },
            ],
            [
                function (source, situation) {
                    console.log("site filter");

                    let result = model.assert.site(source);

                    return result;
                },
            ],
        ],
    }, // filter
];

function extract(value) {
    return model.extract(group, value);
}

export default { group, extract };
