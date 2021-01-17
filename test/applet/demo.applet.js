import applet from "../../dist/support/applet.support.esm.js"; // applet.support

const sspanel = {
    login(auth) {
        return {
            info: {
                name: "sspanel.login",
                call: function (packet) {
                    applet.auth.operate(packet.argument.auth, packet.site);
                    return { code: 0, data: "axios.get(site.url)", message: packet.source.get(-1) };
                },
            }, // applet 信息
            argument: { path: ["auth/login"], auth: applet.auth.parser(auth) },
        };
    },
    signin: {
        info: {
            name: "sspanel.signin",
            call: function (packet) {
                return { code: 0, data: "axios.post(site.url)", message: packet.source.get("sspanel.login") };
            },
        },
        argument: { path: ["user/checkin"], keyword: [] },
        dependence: ["sspanel.login"], // applet 依赖
    },
};

function extract(name, callback) {
    return applet.extract(sspanel, name, callback);
}

export default { sspanel, extract };
