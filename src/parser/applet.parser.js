/**
 * [applet.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace applet.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strict";

import share from "../utils/share.utils.js"; // share.utils
import log from "../utils/log.utils.js"; // log.utils
import chain from "../utils/chain.utils.js"; // chain.utils

import $auth from "../parser/auth.parser.js"; // auth.parser

const variable = {
    assert: ["array"],
    chain: null,
    layer: {
        site(start, end, site) {
            share.operate.table(site, (site) => {
                log.debug.record(`${site.domain} operate...`, () => {
                    site.debug = {};
                }); // debug

                // variable.chain.command(site.custom.applet); // 输入命令
                variable.chain.apply(); // 应用命令和小程序

                let site4applet = { ...site, url: "", path: "" };
                delete site4applet.save;
                delete site4applet.debug;

                variable.chain.operate(
                    {
                        try: (packet) => {
                            packet.self.info.packet = {
                                site: site4applet,
                                source: packet.source,
                                argument: packet.self.argument,
                                situation: packet.situation,
                            }; // applet.info.packet，作为 applet.info.callback 的传入参数

                            packet.result = this.auth(site, packet.self);
                        },
                        catch: (packet) => {
                            log.exception.record(
                                2, // 错误
                                {
                                    location: "applet.operate.chain.operate.catch()",
                                    detail: { site: packet.self.info.site, exception: packet.exception },
                                }
                            ); // 异常日志
                        },
                        succeed: (packet) => {
                            packet.tools.control.source.push(packet.result); // 存储执行结果
                        },
                    },
                    [],
                    [start, end]
                ); // 执行小程序

                site.save = variable.chain.save(); // 保存到 site.save 下

                log.debug.record(`${site.domain} complete...`, () => {
                    delete site.debug;
                }); // debug
            }); // 迭代 site
        }, // site，网站层
        auth(site, applet) {
            let result = this.path(site, applet);

            if (applet.argument.auth) {
                delete applet.info.packet.site.credential;
            } // 只认证一次

            return result;
        }, // auth，认证层
        path(site, applet) {
            let save = share.operate.table(applet.argument.path, (path, tools) => {
                let result = {};

                applet.info.packet.site.path = path; // 存储 path 到 argument[1] 对象
                applet.info.packet.site.url = `${applet.info.packet.site.domain}/${applet.info.packet.site.path}`; // url = domain / path

                result = this.app(site, applet);
                tools.control.source.push(result); // 存储执行结果

                if (!result.code) {
                    log.debug.record(`the path of ${site.domain} is ${path}`, () => {
                        site.debug.path = path;
                    }); // debug

                    tools.control.abort();
                } // 成功
            }); // 迭代 path

            log.debug.record({ type: "path", save: save.source }); // debug

            return save.source.slice(-1)[0]; // 返回最后一次结果
        }, // path，路径层
        app(site, applet) {
            let result = {};

            try {
                result = applet.info.call(applet.info.packet); // 执行小程序
            } catch (exception) {
                log.exception.record(2, { location: "applet.operate.layer.app()", detail: { result, exception } });
            }

            log.debug.record(`the app of ${site.domain} is ${result.code ? "failed" : "successful"} `); // debug

            return result;
        }, // app，应用层
    },
};

function assert_applet(applet) {
    function fail(index) {
        return [""][index];
    }

    return share.assert(applet, variable.assert, "applet", (verify) => {
        share.operate.table(applet, (applet, tools) => {
            if (!applet.hasOwnProperty("info")) {
                tools.control.exception.push();
            }
        });
    });
} // 断言

function parser_applet(object) {
    share.operate.table(object.applet, (applet) => {
        if (!applet.dependence) applet.dependence = undefined; // dependence，缺省为 (undefined / 前一个)
    }); // 参数配置

    variable.chain = new chain(object.applet, undefined, {
        key(source) {
            return source.info.name;
        }, // 键名
        depend(source) {
            return source.save ? source.save.data : source.save;
        }, // 依赖
    }); // 创建 applet 控制链
} // 解析

function operate_applet(start, end, site) {
    variable.layer.site(start, end, site);
} // 运行

export { variable, assert_applet, parser_applet, operate_applet };

export default { variable, assert: assert_applet, parser: parser_applet, operate: operate_applet };
