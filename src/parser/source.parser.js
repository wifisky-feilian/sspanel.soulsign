/**
 * [source.parser]{@link https://github.com/miiwu/sspanel.soulsign}
 *
 * @namespace source.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

"use strick";

function html2dom(text, callback) {
    let parser = new DOMParser(),
        doc = parser.parseFromString(text, "text/html");

    return callback(doc);

    /*

    let raw = doc.getElementsByClassName("sign_div")[0].innerText.split(/\n+/);

    console.log(msg.shift());

    console.log(raw, "\n", msg);
    console.log(doc.getElementsByClassName("mytips")[0].innerText);

    */
}

function html2reg(text, callback) {
    callback(text);
}

export { html2dom, html2reg };

export default { html: { dom: html2dom, reg: html2reg } };
