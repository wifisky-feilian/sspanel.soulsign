/**
 * [applet.parser]{@link https://github.com/miiwu/sspanel.soulsign}
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
    chain: null,
    layer: {
        site(start, end, site, auth) {
            // variable.chain.command(site.custom.applet); // 输入命令
            variable.chain.apply(); // 应用命令和小程序

            variable.chain.operate(
                {
                    try: (packet) => {
                        packet.result = this.path(site, packet.self, packet.self.argument.path, auth, [
                            packet.source, // source
                            { url: "", domain: site.domain, path: "" }, // site
                            packet.self.argument, // argument
                            ...packet.situation,
                        ]);
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
                start,
                end
            ); // 执行小程序

            site.save = variable.chain.save(); // 保存到 site.save 下
        }, // site，网站层
        path(site, applet, path, auth, argument) {
            let save = share.operate.table(path, (path, tools) => {
                let result = {};

                argument[1].path = path; // 存储 path 到 argument[1] 对象
                argument[1].url = `${argument[1].domain}/${argument[1].path}`; // url = domain / path

                try {
                    if (applet.auth) {
                        argument[1].auth = this.auth({ ...site, url: argument[1].url }, auth); // 认证，并且插入到 argument[1] 对象
                    } // 认证，如果需要认证

                    result = applet.info.callback(...argument); // 执行小程序
                    tools.control.source.push(result); // 存储执行结果
                } catch (exception) {
                    log.exception.record(2, { location: "applet.operate.path" });
                }

                if (!result.code) {
                    log.debug.record(`the path of ${site.domain} is ${path}`, () => {
                        site.debug.path = path;
                    }); // debug

                    tools.control.abort();
                } // 成功
            }); // 返回结果

            return save.source.slice(-1)[0]; // 返回最后一次结果
        }, // path，路径层
        auth(site, auth) {
            return $auth.operate(auth, site);
        }, // auth，认证层
    },
};

function parser_applet(object) {
    share.operate.table(object.applet, (applet) => {
        if (!applet.auth) applet.auth = false; // auth，缺省为 false
        if (!applet.dependence) applet.dependence = undefined; // dependence，缺省为 (undefined / 前一个)
    }); // 参数配置

    object.applet = { global: object.applet, custom: [] };

    variable.chain = new chain(
        object.applet.global,
        { source: object.applet.custom },
        {
            key(source) {
                return source.info.name;
            }, // 键名
            depend(source) {
                return !!source.save ? source.save.data : source.save;
            }, // 依赖
        }
    ); // 创建 applet 控制链
} // 解析

function operate_applet(start, end, site, auth) {
    log.debug.record(`${site.domain} operate...`, () => {
        site.debug = {};
    }); // 调试信息

    variable.layer.site(start, end, site, auth);
} // 运行

export { variable, parser_applet, operate_applet };

export default { variable, parser: parser_applet, operate: operate_applet };
