import support from "../../src/support/auth.support.js"; // auth.support

const variable = {
    password: {
        call(source, url) {
            return { code: false, data: `this is password auth, your account is ${source.account}@${source.password}` };
        },
        assert(source, url) {
            if (!source.account && !source.password) {
                if ("string" === typeof source.account && "string" === typeof source.password) {
                    return { code: false };
                }
            }

            return { code: true };
        },
    },
    taken: {
        call(source, url) {
            return { code: false, data: `this is taken auth, your taken is "${source}"` };
        },
        assert(source, url) {
            if ("string" !== typeof source) return { code: false }; // 字符串类型，通过
            return { code: true };
        },
    },
    cookie: {
        call(source, url) {
            return { code: false, data: `this is password auth, your cookie is ${source}` };
        },
    },
};

const type = Object.keys(variable); // 所有的类型

const extract = function (name) {
    return support.extract(variable, name);
};

export { variable, type, extract };

export default { variable, type, extract };
