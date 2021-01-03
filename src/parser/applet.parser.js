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

const variable = {
    type: {
        sspanel: {
            login: function (source, site, argument) {
                let message = `this is sspanel.login(). login for ${site.url}`;
                console.log(message);
                return { code: 0, data: { IM: { recv: source } }, message };
            },
            signin: function (source, site, argument) {
                let message = `this is sspanel.signin(). signin for ${site.url}`;
                console.log(message);
                return { code: 0, data: { IM: { recv: source } }, message };
            },
        },
    },
    chain: null,
    method: {
        site(start, end, site) {
            share.control.object.access(["applet"], (property) => {
                // variable.chain.command(site.custom.applet); // 输入命令
                variable.chain.apply(); // 应用命令和小程序

                variable.chain.operate(
                    {
                        try: (packet) => {
                            packet.result = this.path(packet.self.info.callback, packet.self.argument.path, [
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
            }); // 获取 applet 变量
        },
        path(applet, path, argument) {
            let save = share.operate
                .table(path, (path, tools) => {
                    argument[1].path = path; // 存储 path 到 site 对象
                    argument[1].url = `${argument[1].domain}/${argument[1].path}`; // url = domain / path

                    let result = applet(...argument); // 执行小程序
                    tools.control.source.push(result); // 存储执行结果

                    if (!result.code) {
                        tools.control.abort();
                    } // 成功
                })
                .source.slice(-1)[0]; // 返回最后一次结果

            return save; // 返回最后一次结果
        },
    },
};

function parser_applet(object) {
    share.operate.table(object.applet, (applet, tools) => {
        switch (typeof applet.info) {
            case "string": // 字符串类型，即已提供类型
                if (share.verify.property(variable.type, applet.info)) {
                    applet.info = { name: applet.info, callback: share.select.object(variable.type, [applet.info])[0] }; // 转换
                } else {
                    tools.control.exception.push(`applet ${applet.info} is not existed.`); // 记录异常
                } // [{存在指定的属性}, {不存在指定的属性}]
                break;
            case "object": // 对象类型，即用户自定义类型
                break;
            default:
                break;
        }
    });

    object.applet = { global: object.applet, custom: [] };

    variable.chain = new chain(
        object.applet.global,
        { source: object.applet.custom },
        {
            key(source) {
                return source.info.name;
            },
            depend(source) {
                return !!source.save ? source.save.data.IM.send : source.save;
            },
        }
    ); // 创建 applet 控制链
} // 解析

function operate_applet(start, end, site) {
    variable.method.site(start, end, site);
} // 运行

export { variable, parser_applet, operate_applet };

export default { variable, parser: parser_applet, operate: operate_applet };
