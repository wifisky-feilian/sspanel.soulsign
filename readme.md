# iott

if online then that.

## 情景

## 介绍

## 愿景

- [ ] 使用 `webpack` 打包成单文件
  
  - `umd`：如何使用？哎呀，哈哈哈，还没搞懂
  
- [ ] 检查或过滤 `line.parser` 时输入的 `value`，抽象为 `filter/过滤器`

- [ ] 支持多网站，抽象为 `site/网站`

- [ ] 不仅可 `签到`，可扩展添加 `抽奖` 等的，抽象为 `applet/小程序`
  - `applet.hook()`：不更改 applet 的情况下，支持修改返回的消息？
  
  - 不同网站之间可异步处理？
  
- [ ] 可以使用 `dom` 匹配和纯 `regexp/正则表达式` 匹配信息，抽象为 `source/资源`
  - `dom`：`jsdom` 或其他取代 `DOMParser`？
  - 名称好像太别扭？emmm，有点辨识度不高？meta?
  
- [ ] 可以使用 `taken`、`password` 等的认证，抽象为 `auth/认证`

  - 放在 `applet` 中

- [ ] 可以在 `chrome.soulsign` 和 `github.action` 上使用，抽象为 `platform/平台`

- [ ] 可以控制执行间隔，抽象为 `time/时间`

- [ ] 可以自定义网站的配置，如增减小程序、修改 `path` 等的，`command/命令`

## 更新

## 鸣谢

所有给予灵感的人儿们，包括但不限于以下：

### mmc.js

> 回首前世，畅想今生。

- [soul sign scripts](https://soulsign.inu1255.cn) & [my scripts](https://soulsign.inu1255.cn/?uid=1178)

### Soul Sign

- [github](https://github.com/inu1255/soulsign-chrome)
- [chrome extension](https://chrome.google.com/webstore/detail/%E9%AD%82%E7%AD%BE/llbielhggjekmfjikgkcaloghnibafdl?hl=zh-CN)
- [firefox addon](https://addons.mozilla.org/zh-CN/firefox/addon/%E9%AD%82%E7%AD%BE)
