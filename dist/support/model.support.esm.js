var commonjsGlobal =
    typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
        ? self
        : {};

function createCommonjsModule(fn) {
    var module = { exports: {} };
    return fn(module, module.exports), module.exports;
}

var check = function (it) {
    return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis == "object" && globalThis) ||
    check(typeof window == "object" && window) ||
    check(typeof self == "object" && self) ||
    check(typeof commonjsGlobal == "object" && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    (function () {
        return this;
    })() ||
    Function("return this")();

var fails = function (exec) {
    try {
        return !!exec();
    } catch (error) {
        return true;
    }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
    return (
        Object.defineProperty({}, 1, {
            get: function () {
                return 7;
            },
        })[1] != 7
    );
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG
    ? function propertyIsEnumerable(V) {
          var descriptor = getOwnPropertyDescriptor(this, V);
          return !!descriptor && descriptor.enumerable;
      }
    : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
    f: f,
};

var createPropertyDescriptor = function (bitmap, value) {
    return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value,
    };
};

var toString = {}.toString;

var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
};

var split = "".split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object("z").propertyIsEnumerable(0);
})
    ? function (it) {
          return classofRaw(it) == "String" ? split.call(it, "") : Object(it);
      }
    : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
};

// toObject with fallback for non-array-like ES3 strings

var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
    return typeof it === "object" ? it !== null : typeof it === "function";
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject((val = fn.call(input)))) return val;
    if (typeof (fn = input.valueOf) == "function" && !isObject((val = fn.call(input)))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject((val = fn.call(input))))
        return val;
    throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
    return hasOwnProperty.call(it, key);
};

var document$1 = global$1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine =
    !descriptors &&
    !fails(function () {
        return (
            Object.defineProperty(documentCreateElement("div"), "a", {
                get: function () {
                    return 7;
                },
            }).a != 7
        );
    });

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors
    ? nativeGetOwnPropertyDescriptor
    : function getOwnPropertyDescriptor(O, P) {
          O = toIndexedObject(O);
          P = toPrimitive(P, true);
          if (ie8DomDefine)
              try {
                  return nativeGetOwnPropertyDescriptor(O, P);
              } catch (error) {
                  /* empty */
              }
          if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
      };

var objectGetOwnPropertyDescriptor = {
    f: f$1,
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL
        ? true
        : value == NATIVE
        ? false
        : typeof detection == "function"
        ? fails(detection)
        : !!detection;
};

var normalize = (isForced.normalize = function (string) {
    return String(string).replace(replacement, ".").toLowerCase();
});

var data = (isForced.data = {});
var NATIVE = (isForced.NATIVE = "N");
var POLYFILL = (isForced.POLYFILL = "P");

var isForced_1 = isForced;

var path = {};

var aFunction = function (it) {
    if (typeof it != "function") {
        throw TypeError(String(it) + " is not a function");
    }
    return it;
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
        case 0:
            return function () {
                return fn.call(that);
            };
        case 1:
            return function (a) {
                return fn.call(that, a);
            };
        case 2:
            return function (a, b) {
                return fn.call(that, a, b);
            };
        case 3:
            return function (a, b, c) {
                return fn.call(that, a, b, c);
            };
    }
    return function (/* ...args */) {
        return fn.apply(that, arguments);
    };
};

var anObject = function (it) {
    if (!isObject(it)) {
        throw TypeError(String(it) + " is not an object");
    }
    return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors
    ? nativeDefineProperty
    : function defineProperty(O, P, Attributes) {
          anObject(O);
          P = toPrimitive(P, true);
          anObject(Attributes);
          if (ie8DomDefine)
              try {
                  return nativeDefineProperty(O, P, Attributes);
              } catch (error) {
                  /* empty */
              }
          if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
          if ("value" in Attributes) O[P] = Attributes.value;
          return O;
      };

var objectDefineProperty = {
    f: f$2,
};

var createNonEnumerableProperty = descriptors
    ? function (object, key, value) {
          return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
      }
    : function (object, key, value) {
          object[key] = value;
          return object;
      };

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

var wrapConstructor = function (NativeConstructor) {
    var Wrapper = function (a, b, c) {
        if (this instanceof NativeConstructor) {
            switch (arguments.length) {
                case 0:
                    return new NativeConstructor();
                case 1:
                    return new NativeConstructor(a);
                case 2:
                    return new NativeConstructor(a, b);
            }
            return new NativeConstructor(a, b, c);
        }
        return NativeConstructor.apply(this, arguments);
    };
    Wrapper.prototype = NativeConstructor.prototype;
    return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var PROTO = options.proto;

    var nativeSource = GLOBAL ? global$1 : STATIC ? global$1[TARGET] : (global$1[TARGET] || {}).prototype;

    var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
    var targetPrototype = target.prototype;

    var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
    var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

    for (key in source) {
        FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
        // contains in native
        USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

        targetProperty = target[key];

        if (USE_NATIVE)
            if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
                nativeProperty = descriptor && descriptor.value;
            } else nativeProperty = nativeSource[key];

        // export native or implementation
        sourceProperty = USE_NATIVE && nativeProperty ? nativeProperty : source[key];

        if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

        // bind timers to global for call from export context
        if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global$1);
        // wrap global constructors for prevent changs in this version
        else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
        // make static versions for prototype methods
        else if (PROTO && typeof sourceProperty == "function")
            resultProperty = functionBindContext(Function.call, sourceProperty);
        // default case
        else resultProperty = sourceProperty;

        // add a flag to not completely full polyfills
        if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
            createNonEnumerableProperty(resultProperty, "sham", true);
        }

        target[key] = resultProperty;

        if (PROTO) {
            VIRTUAL_PROTOTYPE = TARGET + "Prototype";
            if (!has(path, VIRTUAL_PROTOTYPE)) {
                createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
            }
            // export virtual prototype methods
            path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
            // export real prototype methods
            if (options.real && targetPrototype && !targetPrototype[key]) {
                createNonEnumerableProperty(targetPrototype, key, sourceProperty);
            }
        }
    }
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
    return isNaN((argument = +argument)) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

var min$1 = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
    return argument > 0 ? min$1(toInteger(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
};

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray =
    Array.isArray ||
    function isArray(arg) {
        return classofRaw(arg) == "Array";
    };

var setGlobal = function (key, value) {
    try {
        createNonEnumerableProperty(global$1, key, value);
    } catch (error) {
        global$1[key] = value;
    }
    return value;
};

var SHARED = "__core-js_shared__";
var store = global$1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
        return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })("versions", []).push({
        version: "3.8.1",
        mode: "pure",
        copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
    });
});

var id = 0;
var postfix = Math.random();

var uid = function (key) {
    return "Symbol(" + String(key === undefined ? "" : key) + ")_" + (++id + postfix).toString(36);
};

var nativeSymbol =
    !!Object.getOwnPropertySymbols &&
    !fails(function () {
        // Chrome 38 Symbol has incorrect toString conversion
        // eslint-disable-next-line no-undef
        return !String(Symbol());
    });

var useSymbolAsUid =
    nativeSymbol &&
    // eslint-disable-next-line no-undef
    !Symbol.sham &&
    // eslint-disable-next-line no-undef
    typeof Symbol.iterator == "symbol";

var WellKnownSymbolsStore = shared("wks");
var Symbol$1 = global$1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : (Symbol$1 && Symbol$1.withoutSetter) || uid;

var wellKnownSymbol = function (name) {
    if (!has(WellKnownSymbolsStore, name)) {
        if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
        else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
    }
    return WellKnownSymbolsStore[name];
};

var SPECIES = wellKnownSymbol("species");

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
        C = originalArray.constructor;
        // cross-realm fallback
        if (typeof C == "function" && (C === Array || isArray(C.prototype))) C = undefined;
        else if (isObject(C)) {
            C = C[SPECIES];
            if (C === null) C = undefined;
        }
    }
    return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
};

var aFunction$1 = function (variable) {
    return typeof variable == "function" ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
    return arguments.length < 2
        ? aFunction$1(path[namespace]) || aFunction$1(global$1[namespace])
        : (path[namespace] && path[namespace][method]) || (global$1[namespace] && global$1[namespace][method]);
};

var engineUserAgent = getBuiltIn("navigator", "userAgent") || "";

var process = global$1.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
    match = v8.split(".");
    version = match[0] + match[1];
} else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
        match = engineUserAgent.match(/Chrome\/(\d+)/);
        if (match) version = match[1];
    }
}

var engineV8Version = version && +version;

var SPECIES$1 = wellKnownSymbol("species");

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return (
        engineV8Version >= 51 ||
        !fails(function () {
            var array = [];
            var constructor = (array.constructor = {});
            constructor[SPECIES$1] = function () {
                return { foo: 1 };
            };
            return array[METHOD_NAME](Boolean).foo !== 1;
        })
    );
};

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) {
    throw it;
};

var arrayMethodUsesToLength = function (METHOD_NAME, options) {
    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
    if (!options) options = {};
    var method = [][METHOD_NAME];
    var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
    var argument0 = has(options, 0) ? options[0] : thrower;
    var argument1 = has(options, 1) ? options[1] : undefined;

    return (cache[METHOD_NAME] =
        !!method &&
        !fails(function () {
            if (ACCESSORS && !descriptors) return true;
            var O = { length: -1 };

            if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
            else O[1] = 1;

            method.call(O, argument0, argument1);
        }));
};

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("splice");
var USES_TO_LENGTH = arrayMethodUsesToLength("splice", { ACCESSORS: true, 0: 0, 1: 2 });

var max$1 = Math.max;
var min$2 = Math.min;
var MAX_SAFE_INTEGER = 0x1fffffffffffff;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = "Maximum allowed length exceeded";

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH },
    {
        splice: function splice(start, deleteCount /* , ...items */) {
            var O = toObject(this);
            var len = toLength(O.length);
            var actualStart = toAbsoluteIndex(start, len);
            var argumentsLength = arguments.length;
            var insertCount, actualDeleteCount, A, k, from, to;
            if (argumentsLength === 0) {
                insertCount = actualDeleteCount = 0;
            } else if (argumentsLength === 1) {
                insertCount = 0;
                actualDeleteCount = len - actualStart;
            } else {
                insertCount = argumentsLength - 2;
                actualDeleteCount = min$2(max$1(toInteger(deleteCount), 0), len - actualStart);
            }
            if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
                throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
            }
            A = arraySpeciesCreate(O, actualDeleteCount);
            for (k = 0; k < actualDeleteCount; k++) {
                from = actualStart + k;
                if (from in O) createProperty(A, k, O[from]);
            }
            A.length = actualDeleteCount;
            if (insertCount < actualDeleteCount) {
                for (k = actualStart; k < len - actualDeleteCount; k++) {
                    from = k + actualDeleteCount;
                    to = k + insertCount;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                }
                for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
            } else if (insertCount > actualDeleteCount) {
                for (k = len - actualDeleteCount; k > actualStart; k--) {
                    from = k + actualDeleteCount - 1;
                    to = k + insertCount - 1;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                }
            }
            for (k = 0; k < insertCount; k++) {
                O[k + actualStart] = arguments[k + 2];
            }
            O.length = len - actualDeleteCount + insertCount;
            return A;
        },
    }
);

var entryVirtual = function (CONSTRUCTOR) {
    return path[CONSTRUCTOR + "Prototype"];
};

var splice = entryVirtual("Array").splice;

var ArrayPrototype = Array.prototype;

var splice_1 = function (it) {
    var own = it.splice;
    return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.splice) ? splice : own;
};

var splice$1 = splice_1;

var splice$2 = splice$1;

var check$1 = function (it) {
    return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$2 =
    // eslint-disable-next-line no-undef
    check$1(typeof globalThis == "object" && globalThis) ||
    check$1(typeof window == "object" && window) ||
    check$1(typeof self == "object" && self) ||
    check$1(typeof commonjsGlobal == "object" && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    (function () {
        return this;
    })() ||
    Function("return this")();

var fails$1 = function (exec) {
    try {
        return !!exec();
    } catch (error) {
        return true;
    }
};

// Thank's IE8 for his funny defineProperty
var descriptors$1 = !fails$1(function () {
    return (
        Object.defineProperty({}, 1, {
            get: function () {
                return 7;
            },
        })[1] != 7
    );
});

var nativePropertyIsEnumerable$1 = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG$1 = getOwnPropertyDescriptor$2 && !nativePropertyIsEnumerable$1.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f$3 = NASHORN_BUG$1
    ? function propertyIsEnumerable(V) {
          var descriptor = getOwnPropertyDescriptor$2(this, V);
          return !!descriptor && descriptor.enumerable;
      }
    : nativePropertyIsEnumerable$1;

var objectPropertyIsEnumerable$1 = {
    f: f$3,
};

var createPropertyDescriptor$1 = function (bitmap, value) {
    return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value,
    };
};

var toString$1 = {}.toString;

var classofRaw$1 = function (it) {
    return toString$1.call(it).slice(8, -1);
};

var split$1 = "".split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject$1 = fails$1(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object("z").propertyIsEnumerable(0);
})
    ? function (it) {
          return classofRaw$1(it) == "String" ? split$1.call(it, "") : Object(it);
      }
    : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$1 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
};

// toObject with fallback for non-array-like ES3 strings

var toIndexedObject$1 = function (it) {
    return indexedObject$1(requireObjectCoercible$1(it));
};

var isObject$1 = function (it) {
    return typeof it === "object" ? it !== null : typeof it === "function";
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive$1 = function (input, PREFERRED_STRING) {
    if (!isObject$1(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject$1((val = fn.call(input))))
        return val;
    if (typeof (fn = input.valueOf) == "function" && !isObject$1((val = fn.call(input)))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject$1((val = fn.call(input))))
        return val;
    throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty$1 = {}.hasOwnProperty;

var has$1 = function (it, key) {
    return hasOwnProperty$1.call(it, key);
};

var document$2 = global$2.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$1(document$2) && isObject$1(document$2.createElement);

var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$2.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine$1 =
    !descriptors$1 &&
    !fails$1(function () {
        return (
            Object.defineProperty(documentCreateElement$1("div"), "a", {
                get: function () {
                    return 7;
                },
            }).a != 7
        );
    });

var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$4 = descriptors$1
    ? nativeGetOwnPropertyDescriptor$1
    : function getOwnPropertyDescriptor(O, P) {
          O = toIndexedObject$1(O);
          P = toPrimitive$1(P, true);
          if (ie8DomDefine$1)
              try {
                  return nativeGetOwnPropertyDescriptor$1(O, P);
              } catch (error) {
                  /* empty */
              }
          if (has$1(O, P)) return createPropertyDescriptor$1(!objectPropertyIsEnumerable$1.f.call(O, P), O[P]);
      };

var objectGetOwnPropertyDescriptor$1 = {
    f: f$4,
};

var anObject$1 = function (it) {
    if (!isObject$1(it)) {
        throw TypeError(String(it) + " is not an object");
    }
    return it;
};

var nativeDefineProperty$1 = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$5 = descriptors$1
    ? nativeDefineProperty$1
    : function defineProperty(O, P, Attributes) {
          anObject$1(O);
          P = toPrimitive$1(P, true);
          anObject$1(Attributes);
          if (ie8DomDefine$1)
              try {
                  return nativeDefineProperty$1(O, P, Attributes);
              } catch (error) {
                  /* empty */
              }
          if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
          if ("value" in Attributes) O[P] = Attributes.value;
          return O;
      };

var objectDefineProperty$1 = {
    f: f$5,
};

var createNonEnumerableProperty$1 = descriptors$1
    ? function (object, key, value) {
          return objectDefineProperty$1.f(object, key, createPropertyDescriptor$1(1, value));
      }
    : function (object, key, value) {
          object[key] = value;
          return object;
      };

var setGlobal$1 = function (key, value) {
    try {
        createNonEnumerableProperty$1(global$2, key, value);
    } catch (error) {
        global$2[key] = value;
    }
    return value;
};

var SHARED$1 = "__core-js_shared__";
var store$1 = global$2[SHARED$1] || setGlobal$1(SHARED$1, {});

var sharedStore$1 = store$1;

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore$1.inspectSource != "function") {
    sharedStore$1.inspectSource = function (it) {
        return functionToString.call(it);
    };
}

var inspectSource = sharedStore$1.inspectSource;

var WeakMap = global$2.WeakMap;

var nativeWeakMap = typeof WeakMap === "function" && /native code/.test(inspectSource(WeakMap));

var shared$1 = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
        return sharedStore$1[key] || (sharedStore$1[key] = value !== undefined ? value : {});
    })("versions", []).push({
        version: "3.8.1",
        mode: "global",
        copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
    });
});

var id$1 = 0;
var postfix$1 = Math.random();

var uid$1 = function (key) {
    return "Symbol(" + String(key === undefined ? "" : key) + ")_" + (++id$1 + postfix$1).toString(36);
};

var keys = shared$1("keys");

var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid$1(key));
};

var hiddenKeys = {};

var WeakMap$1 = global$2.WeakMap;
var set, get, has$2;

var enforce = function (it) {
    return has$2(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
    return function (it) {
        var state;
        if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
            throw TypeError("Incompatible receiver, " + TYPE + " required");
        }
        return state;
    };
};

if (nativeWeakMap) {
    var store$2 = sharedStore$1.state || (sharedStore$1.state = new WeakMap$1());
    var wmget = store$2.get;
    var wmhas = store$2.has;
    var wmset = store$2.set;
    set = function (it, metadata) {
        metadata.facade = it;
        wmset.call(store$2, it, metadata);
        return metadata;
    };
    get = function (it) {
        return wmget.call(store$2, it) || {};
    };
    has$2 = function (it) {
        return wmhas.call(store$2, it);
    };
} else {
    var STATE = sharedKey("state");
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
        metadata.facade = it;
        createNonEnumerableProperty$1(it, STATE, metadata);
        return metadata;
    };
    get = function (it) {
        return has$1(it, STATE) ? it[STATE] : {};
    };
    has$2 = function (it) {
        return has$1(it, STATE);
    };
}

var internalState = {
    set: set,
    get: get,
    has: has$2,
    enforce: enforce,
    getterFor: getterFor,
};

var redefine = createCommonjsModule(function (module) {
    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split("String");

    (module.exports = function (O, key, value, options) {
        var unsafe = options ? !!options.unsafe : false;
        var simple = options ? !!options.enumerable : false;
        var noTargetGet = options ? !!options.noTargetGet : false;
        var state;
        if (typeof value == "function") {
            if (typeof key == "string" && !has$1(value, "name")) {
                createNonEnumerableProperty$1(value, "name", key);
            }
            state = enforceInternalState(value);
            if (!state.source) {
                state.source = TEMPLATE.join(typeof key == "string" ? key : "");
            }
        }
        if (O === global$2) {
            if (simple) O[key] = value;
            else setGlobal$1(key, value);
            return;
        } else if (!unsafe) {
            delete O[key];
        } else if (!noTargetGet && O[key]) {
            simple = true;
        }
        if (simple) O[key] = value;
        else createNonEnumerableProperty$1(O, key, value);
        // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, "toString", function toString() {
        return (typeof this == "function" && getInternalState(this).source) || inspectSource(this);
    });
});

var path$1 = global$2;

var aFunction$2 = function (variable) {
    return typeof variable == "function" ? variable : undefined;
};

var getBuiltIn$1 = function (namespace, method) {
    return arguments.length < 2
        ? aFunction$2(path$1[namespace]) || aFunction$2(global$2[namespace])
        : (path$1[namespace] && path$1[namespace][method]) || (global$2[namespace] && global$2[namespace][method]);
};

var ceil$1 = Math.ceil;
var floor$1 = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger$1 = function (argument) {
    return isNaN((argument = +argument)) ? 0 : (argument > 0 ? floor$1 : ceil$1)(argument);
};

var min$3 = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength$1 = function (argument) {
    return argument > 0 ? min$3(toInteger$1(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max$2 = Math.max;
var min$4 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$1 = function (index, length) {
    var integer = toInteger$1(index);
    return integer < 0 ? max$2(integer + length, 0) : min$4(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
        var O = toIndexedObject$1($this);
        var length = toLength$1(O.length);
        var index = toAbsoluteIndex$1(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare
        if (IS_INCLUDES && el != el)
            while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
            }
        else
            for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
            }
        return !IS_INCLUDES && -1;
    };
};

var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false),
};

var indexOf = arrayIncludes.indexOf;

var objectKeysInternal = function (object, names) {
    var O = toIndexedObject$1(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$1(hiddenKeys, key) && has$1(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i)
        if (has$1(O, (key = names[i++]))) {
            ~indexOf(result, key) || result.push(key);
        }
    return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
];

var hiddenKeys$1 = enumBugKeys.concat("length", "prototype");

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$6 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
        return objectKeysInternal(O, hiddenKeys$1);
    };

var objectGetOwnPropertyNames = {
    f: f$6,
};

var f$7 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
    f: f$7,
};

// all object keys, includes non-enumerable and symbols
var ownKeys =
    getBuiltIn$1("Reflect", "ownKeys") ||
    function ownKeys(it) {
        var keys = objectGetOwnPropertyNames.f(anObject$1(it));
        var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
        return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
    };

var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty$1.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor$1.f;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
};

var replacement$1 = /#|\.prototype\./;

var isForced$1 = function (feature, detection) {
    var value = data$1[normalize$1(feature)];
    return value == POLYFILL$1
        ? true
        : value == NATIVE$1
        ? false
        : typeof detection == "function"
        ? fails$1(detection)
        : !!detection;
};

var normalize$1 = (isForced$1.normalize = function (string) {
    return String(string).replace(replacement$1, ".").toLowerCase();
});

var data$1 = (isForced$1.data = {});
var NATIVE$1 = (isForced$1.NATIVE = "N");
var POLYFILL$1 = (isForced$1.POLYFILL = "P");

var isForced_1$1 = isForced$1;

var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor$1.f;

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export$1 = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
        target = global$2;
    } else if (STATIC) {
        target = global$2[TARGET] || setGlobal$1(TARGET, {});
    } else {
        target = (global$2[TARGET] || {}).prototype;
    }
    if (target)
        for (key in source) {
            sourceProperty = source[key];
            if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor$3(target, key);
                targetProperty = descriptor && descriptor.value;
            } else targetProperty = target[key];
            FORCED = isForced_1$1(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
            // contained in target
            if (!FORCED && targetProperty !== undefined) {
                if (typeof sourceProperty === typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
            }
            // add a flag to not completely full polyfills
            if (options.sham || (targetProperty && targetProperty.sham)) {
                createNonEnumerableProperty$1(sourceProperty, "sham", true);
            }
            // extend global
            redefine(target, key, sourceProperty, options);
        }
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return (
        !!method &&
        fails$1(function () {
            // eslint-disable-next-line no-useless-call,no-throw-literal
            method.call(
                null,
                argument ||
                    function () {
                        throw 1;
                    },
                1
            );
        })
    );
};

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject$1 != Object;
var STRICT_METHOD = arrayMethodIsStrict("join", ",");

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
_export$1(
    { target: "Array", proto: true, forced: ES3_STRINGS || !STRICT_METHOD },
    {
        join: function join(separator) {
            return nativeJoin.call(toIndexedObject$1(this), separator === undefined ? "," : separator);
        },
    }
);

var aPossiblePrototype = function (it) {
    if (!isObject$1(it) && it !== null) {
        throw TypeError("Can't set " + String(it) + " as a prototype");
    }
    return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf =
    Object.setPrototypeOf ||
    ("__proto__" in {}
        ? (function () {
              var CORRECT_SETTER = false;
              var test = {};
              var setter;
              try {
                  setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
                  setter.call(test, []);
                  CORRECT_SETTER = test instanceof Array;
              } catch (error) {
                  /* empty */
              }
              return function setPrototypeOf(O, proto) {
                  anObject$1(O);
                  aPossiblePrototype(proto);
                  if (CORRECT_SETTER) setter.call(O, proto);
                  else O.__proto__ = proto;
                  return O;
              };
          })()
        : undefined);

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
        // it can work only with native `setPrototypeOf`
        objectSetPrototypeOf &&
        // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
        typeof (NewTarget = dummy.constructor) == "function" &&
        NewTarget !== Wrapper &&
        isObject$1((NewTargetPrototype = NewTarget.prototype)) &&
        NewTargetPrototype !== Wrapper.prototype
    )
        objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
};

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys =
    Object.keys ||
    function keys(O) {
        return objectKeysInternal(O, enumBugKeys);
    };

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors$1
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
          anObject$1(O);
          var keys = objectKeys(Properties);
          var length = keys.length;
          var index = 0;
          var key;
          while (length > index) objectDefineProperty$1.f(O, (key = keys[index++]), Properties[key]);
          return O;
      };

var html = getBuiltIn$1("document", "documentElement");

var GT = ">";
var LT = "<";
var PROTOTYPE = "prototype";
var SCRIPT = "script";
var IE_PROTO = sharedKey("IE_PROTO");

var EmptyConstructor = function () {
    /* empty */
};

var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(""));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement$1("iframe");
    var JS = "java" + SCRIPT + ":";
    var iframeDocument;
    iframe.style.display = "none";
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag("document.F=Object"));
    iframeDocument.close();
    return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
    try {
        /* global ActiveXObject */
        activeXDocument = document.domain && new ActiveXObject("htmlfile");
    } catch (error) {
        /* ignore */
    }
    NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate =
    Object.create ||
    function create(O, Properties) {
        var result;
        if (O !== null) {
            EmptyConstructor[PROTOTYPE] = anObject$1(O);
            result = new EmptyConstructor();
            EmptyConstructor[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
        } else result = NullProtoObject();
        return Properties === undefined ? result : objectDefineProperties(result, Properties);
    };

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces =
    "\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

var whitespace = "[" + whitespaces + "]";
var ltrim = RegExp("^" + whitespace + whitespace + "*");
var rtrim = RegExp(whitespace + whitespace + "*$");

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$1 = function (TYPE) {
    return function ($this) {
        var string = String(requireObjectCoercible$1($this));
        if (TYPE & 1) string = string.replace(ltrim, "");
        if (TYPE & 2) string = string.replace(rtrim, "");
        return string;
    };
};

var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$1(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$1(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$1(3),
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor$1.f;
var defineProperty$1 = objectDefineProperty$1.f;
var trim = stringTrim.trim;

var NUMBER = "Number";
var NativeNumber = global$2[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw$1(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
    var it = toPrimitive$1(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;
    if (typeof it == "string" && it.length > 2) {
        it = trim(it);
        first = it.charCodeAt(0);
        if (first === 43 || first === 45) {
            third = it.charCodeAt(2);
            if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
        } else if (first === 48) {
            switch (it.charCodeAt(1)) {
                case 66:
                case 98:
                    radix = 2;
                    maxCode = 49;
                    break; // fast equal of /^0b[01]+$/i
                case 79:
                case 111:
                    radix = 8;
                    maxCode = 55;
                    break; // fast equal of /^0o[0-7]+$/i
                default:
                    return +it;
            }
            digits = it.slice(2);
            length = digits.length;
            for (index = 0; index < length; index++) {
                code = digits.charCodeAt(index);
                // parseInt parses a string to a first unavailable symbol
                // but ToNumber should return NaN if a string contains unavailable symbols
                if (code < 48 || code > maxCode) return NaN;
            }
            return parseInt(digits, radix);
        }
    }
    return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced_1$1(NUMBER, !NativeNumber(" 0o1") || !NativeNumber("0b1") || NativeNumber("+0x1"))) {
    var NumberWrapper = function Number(value) {
        var it = arguments.length < 1 ? 0 : value;
        var dummy = this;
        return dummy instanceof NumberWrapper &&
            // check on 1..constructor(foo) case
            (BROKEN_CLASSOF
                ? fails$1(function () {
                      NumberPrototype.valueOf.call(dummy);
                  })
                : classofRaw$1(dummy) != NUMBER)
            ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper)
            : toNumber(it);
    };
    for (
        var keys$1 = descriptors$1
                ? getOwnPropertyNames(NativeNumber)
                : // ES3:
                  (
                      "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY," +
                      // ES2015 (in case, if modules with ES2015 Number statics required before):
                      "EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER," +
                      "MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger," +
                      // ESNext
                      "fromString,range"
                  ).split(","),
            j = 0,
            key;
        keys$1.length > j;
        j++
    ) {
        if (has$1(NativeNumber, (key = keys$1[j])) && !has$1(NumberWrapper, key)) {
            defineProperty$1(NumberWrapper, key, getOwnPropertyDescriptor$4(NativeNumber, key));
        }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global$2, NUMBER, NumberWrapper);
}

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
    var that = anObject$1(this);
    var result = "";
    if (that.global) result += "g";
    if (that.ignoreCase) result += "i";
    if (that.multiline) result += "m";
    if (that.dotAll) result += "s";
    if (that.unicode) result += "u";
    if (that.sticky) result += "y";
    return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
    return RegExp(s, f);
}

var UNSUPPORTED_Y = fails$1(function () {
    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var re = RE("a", "y");
    re.lastIndex = 2;
    return re.exec("abcd") != null;
});

var BROKEN_CARET = fails$1(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = RE("^r", "gy");
    re.lastIndex = 2;
    return re.exec("str") != null;
});

var regexpStickyHelpers = {
    UNSUPPORTED_Y: UNSUPPORTED_Y,
    BROKEN_CARET: BROKEN_CARET,
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, "a");
    nativeExec.call(re2, "a");
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec("")[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

if (PATCH) {
    patchedExec = function exec(str) {
        var re = this;
        var lastIndex, reCopy, match, i;
        var sticky = UNSUPPORTED_Y$1 && re.sticky;
        var flags = regexpFlags.call(re);
        var source = re.source;
        var charsAdded = 0;
        var strCopy = str;

        if (sticky) {
            flags = flags.replace("y", "");
            if (flags.indexOf("g") === -1) {
                flags += "g";
            }

            strCopy = String(str).slice(re.lastIndex);
            // Support anchored sticky behavior.
            if (re.lastIndex > 0 && (!re.multiline || (re.multiline && str[re.lastIndex - 1] !== "\n"))) {
                source = "(?: " + source + ")";
                strCopy = " " + strCopy;
                charsAdded++;
            }
            // ^(? + rx + ) is needed, in combination with some str slicing, to
            // simulate the 'y' flag.
            reCopy = new RegExp("^(?:" + source + ")", flags);
        }

        if (NPCG_INCLUDED) {
            reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

        match = nativeExec.call(sticky ? reCopy : re, strCopy);

        if (sticky) {
            if (match) {
                match.input = match.input.slice(charsAdded);
                match[0] = match[0].slice(charsAdded);
                match.index = re.lastIndex;
                re.lastIndex += match[0].length;
            } else re.lastIndex = 0;
        } else if (UPDATES_LAST_INDEX_WRONG && match) {
            re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
            // Fix browsers whose `exec` methods don't consistently return `undefined`
            // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
            nativeReplace.call(match[0], reCopy, function () {
                for (i = 1; i < arguments.length - 2; i++) {
                    if (arguments[i] === undefined) match[i] = undefined;
                }
            });
        }

        return match;
    };
}

var regexpExec = patchedExec;

_export$1(
    { target: "RegExp", proto: true, forced: /./.exec !== regexpExec },
    {
        exec: regexpExec,
    }
);

var nativeSymbol$1 =
    !!Object.getOwnPropertySymbols &&
    !fails$1(function () {
        // Chrome 38 Symbol has incorrect toString conversion
        // eslint-disable-next-line no-undef
        return !String(Symbol());
    });

var useSymbolAsUid$1 =
    nativeSymbol$1 &&
    // eslint-disable-next-line no-undef
    !Symbol.sham &&
    // eslint-disable-next-line no-undef
    typeof Symbol.iterator == "symbol";

var WellKnownSymbolsStore$1 = shared$1("wks");
var Symbol$2 = global$2.Symbol;
var createWellKnownSymbol$1 = useSymbolAsUid$1 ? Symbol$2 : (Symbol$2 && Symbol$2.withoutSetter) || uid$1;

var wellKnownSymbol$1 = function (name) {
    if (!has$1(WellKnownSymbolsStore$1, name)) {
        if (nativeSymbol$1 && has$1(Symbol$2, name)) WellKnownSymbolsStore$1[name] = Symbol$2[name];
        else WellKnownSymbolsStore$1[name] = createWellKnownSymbol$1("Symbol." + name);
    }
    return WellKnownSymbolsStore$1[name];
};

// TODO: Remove from `core-js@4` since it's moved to entry points

var SPECIES$2 = wellKnownSymbol$1("species");

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$1(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
        var result = [];
        result.groups = { a: "7" };
        return result;
    };
    return "".replace(re, "$<a>") !== "7";
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
    return "a".replace(/./, "$0") === "$0";
})();

var REPLACE = wellKnownSymbol$1("replace");
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
        return /./[REPLACE]("a", "$0") === "";
    }
    return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$1(function () {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () {
        return originalExec.apply(this, arguments);
    };
    var result = "ab".split(re);
    return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol$1(KEY);

    var DELEGATES_TO_SYMBOL = !fails$1(function () {
        // String methods call symbol-named RegEp methods
        var O = {};
        O[SYMBOL] = function () {
            return 7;
        };
        return ""[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC =
        DELEGATES_TO_SYMBOL &&
        !fails$1(function () {
            // Symbol-named RegExp methods call .exec
            var execCalled = false;
            var re = /a/;

            if (KEY === "split") {
                // We can't use real regex here since it causes deoptimization
                // and serious performance degradation in V8
                // https://github.com/zloirock/core-js/issues/306
                re = {};
                // RegExp[@@split] doesn't call the regex's exec method, but first creates
                // a new one. We need to return the patched regex when creating the new one.
                re.constructor = {};
                re.constructor[SPECIES$2] = function () {
                    return re;
                };
                re.flags = "";
                re[SYMBOL] = /./[SYMBOL];
            }

            re.exec = function () {
                execCalled = true;
                return null;
            };

            re[SYMBOL]("");
            return !execCalled;
        });

    if (
        !DELEGATES_TO_SYMBOL ||
        !DELEGATES_TO_EXEC ||
        (KEY === "replace" &&
            !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE)) ||
        (KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
        var nativeRegExpMethod = /./[SYMBOL];
        var methods = exec(
            SYMBOL,
            ""[KEY],
            function (nativeMethod, regexp, str, arg2, forceStringMethod) {
                if (regexp.exec === regexpExec) {
                    if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                        // The native String method already delegates to @@method (this
                        // polyfilled function), leasing to infinite recursion.
                        // We avoid it by directly calling the native @@method method.
                        return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                    }
                    return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                }
                return { done: false };
            },
            {
                REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
                REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
            }
        );
        var stringMethod = methods[0];
        var regexMethod = methods[1];

        redefine(String.prototype, KEY, stringMethod);
        redefine(
            RegExp.prototype,
            SYMBOL,
            length == 2
                ? // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
                  // 21.2.5.11 RegExp.prototype[@@split](string, limit)
                  function (string, arg) {
                      return regexMethod.call(string, this, arg);
                  }
                : // 21.2.5.6 RegExp.prototype[@@match](string)
                  // 21.2.5.9 RegExp.prototype[@@search](string)
                  function (string) {
                      return regexMethod.call(string, this);
                  }
        );
    }

    if (sham) createNonEnumerableProperty$1(RegExp.prototype[SYMBOL], "sham", true);
};

var MATCH = wellKnownSymbol$1("match");

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
var isRegexp = function (it) {
    var isRegExp;
    return isObject$1(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw$1(it) == "RegExp");
};

var aFunction$3 = function (it) {
    if (typeof it != "function") {
        throw TypeError(String(it) + " is not a function");
    }
    return it;
};

var SPECIES$3 = wellKnownSymbol$1("species");

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject$1(O).constructor;
    var S;
    return C === undefined || (S = anObject$1(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$3(S);
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$2 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
        var S = String(requireObjectCoercible$1($this));
        var position = toInteger$1(pos);
        var size = S.length;
        var first, second;
        if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : undefined;
        first = S.charCodeAt(position);
        return first < 0xd800 ||
            first > 0xdbff ||
            position + 1 === size ||
            (second = S.charCodeAt(position + 1)) < 0xdc00 ||
            second > 0xdfff
            ? CONVERT_TO_STRING
                ? S.charAt(position)
                : first
            : CONVERT_TO_STRING
            ? S.slice(position, position + 2)
            : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
    };
};

var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$2(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$2(true),
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === "function") {
        var result = exec.call(R, S);
        if (typeof result !== "object") {
            throw TypeError("RegExp exec method returned something other than an Object or null");
        }
        return result;
    }

    if (classofRaw$1(R) !== "RegExp") {
        throw TypeError("RegExp#exec called on incompatible receiver");
    }

    return regexpExec.call(R, S);
};

var arrayPush = [].push;
var min$5 = Math.min;
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails$1(function () {
    return !RegExp(MAX_UINT32, "y");
});

// @@split logic
fixRegexpWellKnownSymbolLogic(
    "split",
    2,
    function (SPLIT, nativeSplit, maybeCallNative) {
        var internalSplit;
        if (
            "abbc".split(/(b)*/)[1] == "c" ||
            "test".split(/(?:)/, -1).length != 4 ||
            "ab".split(/(?:ab)*/).length != 2 ||
            ".".split(/(.?)(.?)/).length != 4 ||
            ".".split(/()()/).length > 1 ||
            "".split(/.?/).length
        ) {
            // based on es5-shim implementation, need to rework it
            internalSplit = function (separator, limit) {
                var string = String(requireObjectCoercible$1(this));
                var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                if (lim === 0) return [];
                if (separator === undefined) return [string];
                // If `separator` is not a regex, use native split
                if (!isRegexp(separator)) {
                    return nativeSplit.call(string, separator, lim);
                }
                var output = [];
                var flags =
                    (separator.ignoreCase ? "i" : "") +
                    (separator.multiline ? "m" : "") +
                    (separator.unicode ? "u" : "") +
                    (separator.sticky ? "y" : "");
                var lastLastIndex = 0;
                // Make `global` and avoid `lastIndex` issues by working with a copy
                var separatorCopy = new RegExp(separator.source, flags + "g");
                var match, lastIndex, lastLength;
                while ((match = regexpExec.call(separatorCopy, string))) {
                    lastIndex = separatorCopy.lastIndex;
                    if (lastIndex > lastLastIndex) {
                        output.push(string.slice(lastLastIndex, match.index));
                        if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= lim) break;
                    }
                    if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test("")) output.push("");
                } else output.push(string.slice(lastLastIndex));
                return output.length > lim ? output.slice(0, lim) : output;
            };
            // Chakra, V8
        } else if ("0".split(undefined, 0).length) {
            internalSplit = function (separator, limit) {
                return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
            };
        } else internalSplit = nativeSplit;

        return [
            // `String.prototype.split` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.split
            function split(separator, limit) {
                var O = requireObjectCoercible$1(this);
                var splitter = separator == undefined ? undefined : separator[SPLIT];
                return splitter !== undefined
                    ? splitter.call(separator, O, limit)
                    : internalSplit.call(String(O), separator, limit);
            },
            // `RegExp.prototype[@@split]` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
            //
            // NOTE: This cannot be properly polyfilled in engines that don't support
            // the 'y' flag.
            function (regexp, limit) {
                var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
                if (res.done) return res.value;

                var rx = anObject$1(regexp);
                var S = String(this);
                var C = speciesConstructor(rx, RegExp);

                var unicodeMatching = rx.unicode;
                var flags =
                    (rx.ignoreCase ? "i" : "") +
                    (rx.multiline ? "m" : "") +
                    (rx.unicode ? "u" : "") +
                    (SUPPORTS_Y ? "y" : "g");

                // ^(? + rx + ) is needed, in combination with some S slicing, to
                // simulate the 'y' flag.
                var splitter = new C(SUPPORTS_Y ? rx : "^(?:" + rx.source + ")", flags);
                var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                if (lim === 0) return [];
                if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
                var p = 0;
                var q = 0;
                var A = [];
                while (q < S.length) {
                    splitter.lastIndex = SUPPORTS_Y ? q : 0;
                    var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
                    var e;
                    if (
                        z === null ||
                        (e = min$5(toLength$1(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
                    ) {
                        q = advanceStringIndex(S, q, unicodeMatching);
                    } else {
                        A.push(S.slice(p, q));
                        if (A.length === lim) return A;
                        for (var i = 1; i <= z.length - 1; i++) {
                            A.push(z[i]);
                            if (A.length === lim) return A;
                        }
                        q = p = e;
                    }
                }
                A.push(S.slice(p));
                return A;
            },
        ];
    },
    !SUPPORTS_Y
);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$3 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
        var O = toIndexedObject($this);
        var length = toLength(O.length);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare
        if (IS_INCLUDES && el != el)
            while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
            }
        else
            for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
            }
        return !IS_INCLUDES && -1;
    };
};

var arrayIncludes$1 = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod$3(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$3(false),
};

var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return (
        !!method &&
        fails(function () {
            // eslint-disable-next-line no-useless-call,no-throw-literal
            method.call(
                null,
                argument ||
                    function () {
                        throw 1;
                    },
                1
            );
        })
    );
};

var $indexOf = arrayIncludes$1.indexOf;

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$1 = arrayMethodIsStrict$1("indexOf");
var USES_TO_LENGTH$1 = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export(
    { target: "Array", proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$1 },
    {
        indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
            return NEGATIVE_ZERO
                ? // convert -0 to +0
                  nativeIndexOf.apply(this, arguments) || 0
                : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
        },
    }
);

var indexOf$1 = entryVirtual("Array").indexOf;

var ArrayPrototype$1 = Array.prototype;

var indexOf_1 = function (it) {
    var own = it.indexOf;
    return it === ArrayPrototype$1 || (it instanceof Array && own === ArrayPrototype$1.indexOf) ? indexOf$1 : own;
};

var indexOf$2 = indexOf_1;

var indexOf$3 = indexOf$2;

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport("slice");
var USES_TO_LENGTH$2 = arrayMethodUsesToLength("slice", { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES$4 = wellKnownSymbol("species");
var nativeSlice = [].slice;
var max$3 = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2 },
    {
        slice: function slice(start, end) {
            var O = toIndexedObject(this);
            var length = toLength(O.length);
            var k = toAbsoluteIndex(start, length);
            var fin = toAbsoluteIndex(end === undefined ? length : end, length);
            // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
            var Constructor, result, n;
            if (isArray(O)) {
                Constructor = O.constructor;
                // cross-realm fallback
                if (typeof Constructor == "function" && (Constructor === Array || isArray(Constructor.prototype))) {
                    Constructor = undefined;
                } else if (isObject(Constructor)) {
                    Constructor = Constructor[SPECIES$4];
                    if (Constructor === null) Constructor = undefined;
                }
                if (Constructor === Array || Constructor === undefined) {
                    return nativeSlice.call(O, k, fin);
                }
            }
            result = new (Constructor === undefined ? Array : Constructor)(max$3(fin - k, 0));
            for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
            result.length = n;
            return result;
        },
    }
);

var slice = entryVirtual("Array").slice;

var ArrayPrototype$2 = Array.prototype;

var slice_1 = function (it) {
    var own = it.slice;
    return it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.slice) ? slice : own;
};

var slice$1 = slice_1;

var slice$2 = slice$1;

var iterators = {};

var functionToString$1 = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != "function") {
    sharedStore.inspectSource = function (it) {
        return functionToString$1.call(it);
    };
}

var inspectSource$1 = sharedStore.inspectSource;

var WeakMap$2 = global$1.WeakMap;

var nativeWeakMap$1 = typeof WeakMap$2 === "function" && /native code/.test(inspectSource$1(WeakMap$2));

var keys$2 = shared("keys");

var sharedKey$1 = function (key) {
    return keys$2[key] || (keys$2[key] = uid(key));
};

var hiddenKeys$2 = {};

var WeakMap$3 = global$1.WeakMap;
var set$1, get$1, has$3;

var enforce$1 = function (it) {
    return has$3(it) ? get$1(it) : set$1(it, {});
};

var getterFor$1 = function (TYPE) {
    return function (it) {
        var state;
        if (!isObject(it) || (state = get$1(it)).type !== TYPE) {
            throw TypeError("Incompatible receiver, " + TYPE + " required");
        }
        return state;
    };
};

if (nativeWeakMap$1) {
    var store$3 = sharedStore.state || (sharedStore.state = new WeakMap$3());
    var wmget$1 = store$3.get;
    var wmhas$1 = store$3.has;
    var wmset$1 = store$3.set;
    set$1 = function (it, metadata) {
        metadata.facade = it;
        wmset$1.call(store$3, it, metadata);
        return metadata;
    };
    get$1 = function (it) {
        return wmget$1.call(store$3, it) || {};
    };
    has$3 = function (it) {
        return wmhas$1.call(store$3, it);
    };
} else {
    var STATE$1 = sharedKey$1("state");
    hiddenKeys$2[STATE$1] = true;
    set$1 = function (it, metadata) {
        metadata.facade = it;
        createNonEnumerableProperty(it, STATE$1, metadata);
        return metadata;
    };
    get$1 = function (it) {
        return has(it, STATE$1) ? it[STATE$1] : {};
    };
    has$3 = function (it) {
        return has(it, STATE$1);
    };
}

var internalState$1 = {
    set: set$1,
    get: get$1,
    has: has$3,
    enforce: enforce$1,
    getterFor: getterFor$1,
};

var correctPrototypeGetter = !fails(function () {
    function F() {
        /* empty */
    }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey$1("IE_PROTO");
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter
    ? Object.getPrototypeOf
    : function (O) {
          O = toObject(O);
          if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
          if (typeof O.constructor == "function" && O instanceof O.constructor) {
              return O.constructor.prototype;
          }
          return O instanceof Object ? ObjectPrototype : null;
      };

var ITERATOR = wellKnownSymbol("iterator");
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
        PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
            IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS,
};

var indexOf$4 = arrayIncludes$1.indexOf;

var objectKeysInternal$1 = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys$2, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i)
        if (has(O, (key = names[i++]))) {
            ~indexOf$4(result, key) || result.push(key);
        }
    return result;
};

// IE8- don't enum bug keys
var enumBugKeys$1 = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
];

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys$1 =
    Object.keys ||
    function keys(O) {
        return objectKeysInternal$1(O, enumBugKeys$1);
    };

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties$1 = descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
          anObject(O);
          var keys = objectKeys$1(Properties);
          var length = keys.length;
          var index = 0;
          var key;
          while (length > index) objectDefineProperty.f(O, (key = keys[index++]), Properties[key]);
          return O;
      };

var html$1 = getBuiltIn("document", "documentElement");

var GT$1 = ">";
var LT$1 = "<";
var PROTOTYPE$1 = "prototype";
var SCRIPT$1 = "script";
var IE_PROTO$2 = sharedKey$1("IE_PROTO");

var EmptyConstructor$1 = function () {
    /* empty */
};

var scriptTag$1 = function (content) {
    return LT$1 + SCRIPT$1 + GT$1 + content + LT$1 + "/" + SCRIPT$1 + GT$1;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX$1 = function (activeXDocument) {
    activeXDocument.write(scriptTag$1(""));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame$1 = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement("iframe");
    var JS = "java" + SCRIPT$1 + ":";
    var iframeDocument;
    iframe.style.display = "none";
    html$1.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag$1("document.F=Object"));
    iframeDocument.close();
    return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument$1;
var NullProtoObject$1 = function () {
    try {
        /* global ActiveXObject */
        activeXDocument$1 = document.domain && new ActiveXObject("htmlfile");
    } catch (error) {
        /* ignore */
    }
    NullProtoObject$1 = activeXDocument$1
        ? NullProtoObjectViaActiveX$1(activeXDocument$1)
        : NullProtoObjectViaIFrame$1();
    var length = enumBugKeys$1.length;
    while (length--) delete NullProtoObject$1[PROTOTYPE$1][enumBugKeys$1[length]];
    return NullProtoObject$1();
};

hiddenKeys$2[IE_PROTO$2] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate$1 =
    Object.create ||
    function create(O, Properties) {
        var result;
        if (O !== null) {
            EmptyConstructor$1[PROTOTYPE$1] = anObject(O);
            result = new EmptyConstructor$1();
            EmptyConstructor$1[PROTOTYPE$1] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO$2] = O;
        } else result = NullProtoObject$1();
        return Properties === undefined ? result : objectDefineProperties$1(result, Properties);
    };

var TO_STRING_TAG = wellKnownSymbol("toStringTag");
var test = {};

test[TO_STRING_TAG] = "z";

var toStringTagSupport = String(test) === "[object z]";

var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag");
// ES3 wrong here
var CORRECT_ARGUMENTS =
    classofRaw(
        (function () {
            return arguments;
        })()
    ) == "Arguments";

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
    try {
        return it[key];
    } catch (error) {
        /* empty */
    }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport
    ? classofRaw
    : function (it) {
          var O, tag, result;
          return it === undefined
              ? "Undefined"
              : it === null
              ? "Null"
              : // @@toStringTag case
              typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG$1)) == "string"
              ? tag
              : // builtinTag case
              CORRECT_ARGUMENTS
              ? classofRaw(O)
              : // ES3 arguments fallback
              (result = classofRaw(O)) == "Object" && typeof O.callee == "function"
              ? "Arguments"
              : result;
      };

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport
    ? {}.toString
    : function toString() {
          return "[object " + classof(this) + "]";
      };

var defineProperty$2 = objectDefineProperty.f;

var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag");

var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
    if (it) {
        var target = STATIC ? it : it.prototype;
        if (!has(target, TO_STRING_TAG$2)) {
            defineProperty$2(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
        }
        if (SET_METHOD && !toStringTagSupport) {
            createNonEnumerableProperty(target, "toString", objectToString);
        }
    }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

var returnThis = function () {
    return this;
};

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + " Iterator";
    IteratorConstructor.prototype = objectCreate$1(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    iterators[TO_STRING_TAG] = returnThis;
    return IteratorConstructor;
};

var aPossiblePrototype$1 = function (it) {
    if (!isObject(it) && it !== null) {
        throw TypeError("Can't set " + String(it) + " as a prototype");
    }
    return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf$1 =
    Object.setPrototypeOf ||
    ("__proto__" in {}
        ? (function () {
              var CORRECT_SETTER = false;
              var test = {};
              var setter;
              try {
                  setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
                  setter.call(test, []);
                  CORRECT_SETTER = test instanceof Array;
              } catch (error) {
                  /* empty */
              }
              return function setPrototypeOf(O, proto) {
                  anObject(O);
                  aPossiblePrototype$1(proto);
                  if (CORRECT_SETTER) setter.call(O, proto);
                  else O.__proto__ = proto;
                  return O;
              };
          })()
        : undefined);

var redefine$1 = function (target, key, value, options) {
    if (options && options.enumerable) target[key] = value;
    else createNonEnumerableProperty(target, key, value);
};

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol("iterator");
var KEYS = "keys";
var VALUES = "values";
var ENTRIES = "entries";

var returnThis$1 = function () {
    return this;
};

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
        if (KIND === DEFAULT && defaultIterator) return defaultIterator;
        if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
        switch (KIND) {
            case KEYS:
                return function keys() {
                    return new IteratorConstructor(this, KIND);
                };
            case VALUES:
                return function values() {
                    return new IteratorConstructor(this, KIND);
                };
            case ENTRIES:
                return function entries() {
                    return new IteratorConstructor(this, KIND);
                };
        }
        return function () {
            return new IteratorConstructor(this);
        };
    };

    var TO_STRING_TAG = NAME + " Iterator";
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator =
        IterablePrototype[ITERATOR$1] || IterablePrototype["@@iterator"] || (DEFAULT && IterablePrototype[DEFAULT]);
    var defaultIterator = (!BUGGY_SAFARI_ITERATORS$1 && nativeIterator) || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
        CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
        if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
            // Set @@toStringTag to native iterators
            setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
            iterators[TO_STRING_TAG] = returnThis$1;
        }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() {
            return nativeIterator.call(this);
        };
    }

    // define iterator
    if (FORCED && IterablePrototype[ITERATOR$1] !== defaultIterator) {
        createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
        methods = {
            values: getIterationMethod(VALUES),
            keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
            entries: getIterationMethod(ENTRIES),
        };
        if (FORCED)
            for (KEY in methods) {
                if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                    redefine$1(IterablePrototype, KEY, methods[KEY]);
                }
            }
        else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
};

var ARRAY_ITERATOR = "Array Iterator";
var setInternalState = internalState$1.set;
var getInternalState = internalState$1.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(
    Array,
    "Array",
    function (iterated, kind) {
        setInternalState(this, {
            type: ARRAY_ITERATOR,
            target: toIndexedObject(iterated), // target
            index: 0, // next index
            kind: kind, // kind
        });
        // `%ArrayIteratorPrototype%.next` method
        // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
    },
    function () {
        var state = getInternalState(this);
        var target = state.target;
        var kind = state.kind;
        var index = state.index++;
        if (!target || index >= target.length) {
            state.target = undefined;
            return { value: undefined, done: true };
        }
        if (kind == "keys") return { value: index, done: false };
        if (kind == "values") return { value: target[index], done: false };
        return { value: [index, target[index]], done: false };
    },
    "values"
);

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
};

var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag");

for (var COLLECTION_NAME in domIterables) {
    var Collection = global$1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
        createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    iterators[COLLECTION_NAME] = iterators.Array;
}

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$4 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
        var S = String(requireObjectCoercible($this));
        var position = toInteger(pos);
        var size = S.length;
        var first, second;
        if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : undefined;
        first = S.charCodeAt(position);
        return first < 0xd800 ||
            first > 0xdbff ||
            position + 1 === size ||
            (second = S.charCodeAt(position + 1)) < 0xdc00 ||
            second > 0xdfff
            ? CONVERT_TO_STRING
                ? S.charAt(position)
                : first
            : CONVERT_TO_STRING
            ? S.slice(position, position + 2)
            : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
    };
};

var stringMultibyte$1 = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true),
};

var charAt$1 = stringMultibyte$1.charAt;

var STRING_ITERATOR = "String Iterator";
var setInternalState$1 = internalState$1.set;
var getInternalState$1 = internalState$1.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(
    String,
    "String",
    function (iterated) {
        setInternalState$1(this, {
            type: STRING_ITERATOR,
            string: String(iterated),
            index: 0,
        });
        // `%StringIteratorPrototype%.next` method
        // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
    },
    function next() {
        var state = getInternalState$1(this);
        var string = state.string;
        var index = state.index;
        var point;
        if (index >= string.length) return { value: undefined, done: true };
        point = charAt$1(string, index);
        state.index += point.length;
        return { value: point, done: false };
    }
);

var ITERATOR$2 = wellKnownSymbol("iterator");

var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$2] || it["@@iterator"] || iterators[classof(it)];
};

var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != "function") {
        throw TypeError(String(it) + " is not iterable");
    }
    return anObject(iteratorMethod.call(it));
};

var getIterator_1 = getIterator;

var getIterator$1 = getIterator_1;

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
_export(
    { target: "Array", stat: true },
    {
        isArray: isArray,
    }
);

var isArray$1 = path.Array.isArray;

var isArray$2 = isArray$1;

var isArray$3 = isArray$2;

var getIteratorMethod_1 = getIteratorMethod;

var getIteratorMethod$1 = getIteratorMethod_1;

var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
var MAX_SAFE_INTEGER$1 = 0x1fffffffffffff;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded";

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT =
    engineV8Version >= 51 ||
    !fails(function () {
        var array = [];
        array[IS_CONCAT_SPREADABLE] = false;
        return array.concat()[0] !== array;
    });

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");

var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export(
    { target: "Array", proto: true, forced: FORCED },
    {
        concat: function concat(arg) {
            // eslint-disable-line no-unused-vars
            var O = toObject(this);
            var A = arraySpeciesCreate(O, 0);
            var n = 0;
            var i, k, length, len, E;
            for (i = -1, length = arguments.length; i < length; i++) {
                E = i === -1 ? O : arguments[i];
                if (isConcatSpreadable(E)) {
                    len = toLength(E.length);
                    if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                } else {
                    if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    createProperty(A, n++, E);
                }
            }
            A.length = n;
            return A;
        },
    }
);

var hiddenKeys$3 = enumBugKeys$1.concat("length", "prototype");

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$8 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
        return objectKeysInternal$1(O, hiddenKeys$3);
    };

var objectGetOwnPropertyNames$1 = {
    f: f$8,
};

var nativeGetOwnPropertyNames = objectGetOwnPropertyNames$1.f;

var toString$2 = {}.toString;

var windowNames =
    typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
    try {
        return nativeGetOwnPropertyNames(it);
    } catch (error) {
        return windowNames.slice();
    }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$9 = function getOwnPropertyNames(it) {
    return windowNames && toString$2.call(it) == "[object Window]"
        ? getWindowNames(it)
        : nativeGetOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
    f: f$9,
};

var f$a = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols$1 = {
    f: f$a,
};

var f$b = wellKnownSymbol;

var wellKnownSymbolWrapped = {
    f: f$b,
};

var defineProperty$3 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME))
        defineProperty$3(Symbol, NAME, {
            value: wellKnownSymbolWrapped.f(NAME),
        });
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod$5 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_OUT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
        var O = toObject($this);
        var self = indexedObject(O);
        var boundFunction = functionBindContext(callbackfn, that, 3);
        var length = toLength(self.length);
        var index = 0;
        var create = specificCreate || arraySpeciesCreate;
        var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
        var value, result;
        for (; length > index; index++)
            if (NO_HOLES || index in self) {
                value = self[index];
                result = boundFunction(value, index, O);
                if (TYPE) {
                    if (IS_MAP) target[index] = result;
                    // map
                    else if (result)
                        switch (TYPE) {
                            case 3:
                                return true; // some
                            case 5:
                                return value; // find
                            case 6:
                                return index; // findIndex
                            case 2:
                                push.call(target, value); // filter
                        }
                    else
                        switch (TYPE) {
                            case 4:
                                return false; // every
                            case 7:
                                push.call(target, value); // filterOut
                        }
                }
            }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
};

var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$5(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$5(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$5(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$5(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$5(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$5(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$5(6),
    // `Array.prototype.filterOut` method
    // https://github.com/tc39/proposal-array-filtering
    filterOut: createMethod$5(7),
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey$1("hidden");
var SYMBOL = "Symbol";
var PROTOTYPE$2 = "prototype";
var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
var setInternalState$2 = internalState$1.set;
var getInternalState$2 = internalState$1.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE$2];
var $Symbol = global$1.Symbol;
var $stringify = getBuiltIn("JSON", "stringify");
var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$2 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$2 = objectPropertyIsEnumerable.f;
var AllSymbols = shared("symbols");
var ObjectPrototypeSymbols = shared("op-symbols");
var StringToSymbolRegistry = shared("string-to-symbol-registry");
var SymbolToStringRegistry = shared("symbol-to-string-registry");
var WellKnownSymbolsStore$2 = shared("wks");
var QObject = global$1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor =
    descriptors &&
    fails(function () {
        return (
            objectCreate$1(
                nativeDefineProperty$2({}, "a", {
                    get: function () {
                        return nativeDefineProperty$2(this, "a", { value: 7 }).a;
                    },
                })
            ).a != 7
        );
    })
        ? function (O, P, Attributes) {
              var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(ObjectPrototype$1, P);
              if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
              nativeDefineProperty$2(O, P, Attributes);
              if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
                  nativeDefineProperty$2(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
              }
          }
        : nativeDefineProperty$2;

var wrap = function (tag, description) {
    var symbol = (AllSymbols[tag] = objectCreate$1($Symbol[PROTOTYPE$2]));
    setInternalState$2(symbol, {
        type: SYMBOL,
        tag: tag,
        description: description,
    });
    if (!descriptors) symbol.description = description;
    return symbol;
};

var isSymbol = useSymbolAsUid
    ? function (it) {
          return typeof it == "symbol";
      }
    : function (it) {
          return Object(it) instanceof $Symbol;
      };

var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    var key = toPrimitive(P, true);
    anObject(Attributes);
    if (has(AllSymbols, key)) {
        if (!Attributes.enumerable) {
            if (!has(O, HIDDEN)) nativeDefineProperty$2(O, HIDDEN, createPropertyDescriptor(1, {}));
            O[HIDDEN][key] = true;
        } else {
            if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
            Attributes = objectCreate$1(Attributes, { enumerable: createPropertyDescriptor(0, false) });
        }
        return setSymbolDescriptor(O, key, Attributes);
    }
    return nativeDefineProperty$2(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    var properties = toIndexedObject(Properties);
    var keys = objectKeys$1(properties).concat($getOwnPropertySymbols(properties));
    $forEach(keys, function (key) {
        if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
};

var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate$1(O) : $defineProperties(objectCreate$1(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true);
    var enumerable = nativePropertyIsEnumerable$2.call(this, P);
    if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has(this, P) || !has(AllSymbols, P) || (has(this, HIDDEN) && this[HIDDEN][P])
        ? enumerable
        : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O);
    var key = toPrimitive(P, true);
    if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
    if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
        descriptor.enumerable = true;
    }
    return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
        if (!has(AllSymbols, key) && !has(hiddenKeys$2, key)) result.push(key);
    });
    return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
    var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
        if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
            result.push(AllSymbols[key]);
        }
    });
    return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
    $Symbol = function Symbol() {
        if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor");
        var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
        var tag = uid(description);
        var setter = function (value) {
            if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
            if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
            setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
        };
        if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
        return wrap(tag, description);
    };

    redefine$1($Symbol[PROTOTYPE$2], "toString", function toString() {
        return getInternalState$2(this).tag;
    });

    redefine$1($Symbol, "withoutSetter", function (description) {
        return wrap(uid(description), description);
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames$1.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols$1.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
        return wrap(wellKnownSymbol(name), name);
    };

    if (descriptors) {
        // https://github.com/tc39/proposal-Symbol-description
        nativeDefineProperty$2($Symbol[PROTOTYPE$2], "description", {
            configurable: true,
            get: function description() {
                return getInternalState$2(this).description;
            },
        });
    }
}

_export(
    { global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol },
    {
        Symbol: $Symbol,
    }
);

$forEach(objectKeys$1(WellKnownSymbolsStore$2), function (name) {
    defineWellKnownSymbol(name);
});

_export(
    { target: SYMBOL, stat: true, forced: !nativeSymbol },
    {
        // `Symbol.for` method
        // https://tc39.github.io/ecma262/#sec-symbol.for
        for: function (key) {
            var string = String(key);
            if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
            var symbol = $Symbol(string);
            StringToSymbolRegistry[string] = symbol;
            SymbolToStringRegistry[symbol] = string;
            return symbol;
        },
        // `Symbol.keyFor` method
        // https://tc39.github.io/ecma262/#sec-symbol.keyfor
        keyFor: function keyFor(sym) {
            if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol");
            if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
        },
        useSetter: function () {
            USE_SETTER = true;
        },
        useSimple: function () {
            USE_SETTER = false;
        },
    }
);

_export(
    { target: "Object", stat: true, forced: !nativeSymbol, sham: !descriptors },
    {
        // `Object.create` method
        // https://tc39.github.io/ecma262/#sec-object.create
        create: $create,
        // `Object.defineProperty` method
        // https://tc39.github.io/ecma262/#sec-object.defineproperty
        defineProperty: $defineProperty,
        // `Object.defineProperties` method
        // https://tc39.github.io/ecma262/#sec-object.defineproperties
        defineProperties: $defineProperties,
        // `Object.getOwnPropertyDescriptor` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    }
);

_export(
    { target: "Object", stat: true, forced: !nativeSymbol },
    {
        // `Object.getOwnPropertyNames` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
        getOwnPropertyNames: $getOwnPropertyNames,
        // `Object.getOwnPropertySymbols` method
        // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
        getOwnPropertySymbols: $getOwnPropertySymbols,
    }
);

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export(
    {
        target: "Object",
        stat: true,
        forced: fails(function () {
            objectGetOwnPropertySymbols$1.f(1);
        }),
    },
    {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
            return objectGetOwnPropertySymbols$1.f(toObject(it));
        },
    }
);

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
    var FORCED_JSON_STRINGIFY =
        !nativeSymbol ||
        fails(function () {
            var symbol = $Symbol();
            // MS Edge converts symbol values to JSON as {}
            return (
                $stringify([symbol]) != "[null]" ||
                // WebKit converts symbol values to JSON as null
                $stringify({ a: symbol }) != "{}" ||
                // V8 throws on boxed symbols
                $stringify(Object(symbol)) != "{}"
            );
        });

    _export(
        { target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY },
        {
            // eslint-disable-next-line no-unused-vars
            stringify: function stringify(it, replacer, space) {
                var args = [it];
                var index = 1;
                var $replacer;
                while (arguments.length > index) args.push(arguments[index++]);
                $replacer = replacer;
                if ((!isObject(replacer) && it === undefined) || isSymbol(it)) return; // IE8 returns string on undefined
                if (!isArray(replacer))
                    replacer = function (key, value) {
                        if (typeof $replacer == "function") value = $replacer.call(this, key, value);
                        if (!isSymbol(value)) return value;
                    };
                args[1] = replacer;
                return $stringify.apply(null, args);
            },
        }
    );
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$2][TO_PRIMITIVE]) {
    createNonEnumerableProperty($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys$2[HIDDEN] = true;

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol("asyncIterator");

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol("hasInstance");

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol("isConcatSpreadable");

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol("iterator");

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol("match");

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol("matchAll");

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol("replace");

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol("search");

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol("species");

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol("split");

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol("toPrimitive");

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol("toStringTag");

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol("unscopables");

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global$1.JSON, "JSON", true);

var symbol = path.Symbol;

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol("asyncDispose");

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol("dispose");

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol("observable");

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol("patternMatch");

// TODO: remove from `core-js@4`

defineWellKnownSymbol("replaceAll");

// TODO: Remove from `core-js@4`

var symbol$1 = symbol;

var symbol$2 = symbol$1;

var iteratorClose = function (iterator) {
    var returnMethod = iterator["return"];
    if (returnMethod !== undefined) {
        return anObject(returnMethod.call(iterator)).value;
    }
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
        return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
        // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
        iteratorClose(iterator);
        throw error;
    }
};

var ITERATOR$3 = wellKnownSymbol("iterator");
var ArrayPrototype$3 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype$3[ITERATOR$3] === it);
};

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == "function" ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
        iterator = iteratorMethod.call(O);
        next = iterator.next;
        result = new C();
        for (; !(step = next.call(iterator)).done; index++) {
            value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
            createProperty(result, index, value);
        }
    } else {
        length = toLength(O.length);
        result = new C(length);
        for (; length > index; index++) {
            value = mapping ? mapfn(O[index], index) : O[index];
            createProperty(result, index, value);
        }
    }
    result.length = index;
    return result;
};

var ITERATOR$4 = wellKnownSymbol("iterator");
var SAFE_CLOSING = false;

try {
    var called = 0;
    var iteratorWithReturn = {
        next: function () {
            return { done: !!called++ };
        },
        return: function () {
            SAFE_CLOSING = true;
        },
    };
    iteratorWithReturn[ITERATOR$4] = function () {
        return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () {
        throw 2;
    });
} catch (error) {
    /* empty */
}

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
        var object = {};
        object[ITERATOR$4] = function () {
            return {
                next: function () {
                    return { done: (ITERATION_SUPPORT = true) };
                },
            };
        };
        exec(object);
    } catch (error) {
        /* empty */
    }
    return ITERATION_SUPPORT;
};

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
_export(
    { target: "Array", stat: true, forced: INCORRECT_ITERATION },
    {
        from: arrayFrom,
    }
);

var from = path.Array.from;

var from$1 = from;

var from$2 = from$1;

var slice$3 = slice_1;

var slice$4 = slice$3;

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }

    return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
    var _context;

    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);

    var n = slice$4((_context = Object.prototype.toString.call(o))).call(_context, 8, -1);

    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return from$2(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof symbol$2 === "undefined" || getIteratorMethod$1(o) == null) {
        if (
            isArray$3(o) ||
            (it = _unsupportedIterableToArray(o)) ||
            (allowArrayLike && o && typeof o.length === "number")
        ) {
            if (it) o = it;
            var i = 0;

            var F = function F() {};

            return {
                s: F,
                n: function n() {
                    if (i >= o.length)
                        return {
                            done: true,
                        };
                    return {
                        done: false,
                        value: o[i++],
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F,
            };
        }

        throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
        s: function s() {
            it = getIterator$1(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it["return"] != null) it["return"]();
            } finally {
                if (didErr) throw err;
            }
        },
    };
}

var concat = entryVirtual("Array").concat;

var ArrayPrototype$4 = Array.prototype;

var concat_1 = function (it) {
    var own = it.concat;
    return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.concat) ? concat : own;
};

var concat$1 = concat_1;

var concat$2 = concat$1;

function _arrayWithoutHoles(arr) {
    if (isArray$3(arr)) return _arrayLikeToArray(arr);
}

var ITERATOR$5 = wellKnownSymbol("iterator");

var isIterable = function (it) {
    var O = Object(it);
    return (
        O[ITERATOR$5] !== undefined ||
        "@@iterator" in O ||
        // eslint-disable-next-line no-prototype-builtins
        iterators.hasOwnProperty(classof(O))
    );
};

var isIterable_1 = isIterable;

var isIterable$1 = isIterable_1;

function _iterableToArray(iter) {
    if (typeof symbol$2 !== "undefined" && isIterable$1(Object(iter))) return from$2(iter);
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var iterator = wellKnownSymbolWrapped.f("iterator");

var iterator$1 = iterator;

var iterator$2 = iterator$1;

function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof symbol$2 === "function" && typeof iterator$2 === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof symbol$2 === "function" && obj.constructor === symbol$2 && obj !== symbol$2.prototype
                ? "symbol"
                : typeof obj;
        };
    }

    return _typeof(obj);
}

var freezing = !fails(function () {
    return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
    var defineProperty = objectDefineProperty.f;

    var METADATA = uid("meta");
    var id = 0;

    var isExtensible =
        Object.isExtensible ||
        function () {
            return true;
        };

    var setMetadata = function (it) {
        defineProperty(it, METADATA, {
            value: {
                objectID: "O" + ++id, // object ID
                weakData: {}, // weak collections IDs
            },
        });
    };

    var fastKey = function (it, create) {
        // return a primitive with prefix
        if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
        if (!has(it, METADATA)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return "F";
            // not necessary to add metadata
            if (!create) return "E";
            // add missing metadata
            setMetadata(it);
            // return object ID
        }
        return it[METADATA].objectID;
    };

    var getWeakData = function (it, create) {
        if (!has(it, METADATA)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return true;
            // not necessary to add metadata
            if (!create) return false;
            // add missing metadata
            setMetadata(it);
            // return the store of weak collections IDs
        }
        return it[METADATA].weakData;
    };

    // add metadata on freeze-family methods calling
    var onFreeze = function (it) {
        if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
        return it;
    };

    var meta = (module.exports = {
        REQUIRED: false,
        fastKey: fastKey,
        getWeakData: getWeakData,
        onFreeze: onFreeze,
    });

    hiddenKeys$2[METADATA] = true;
});

var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
        if (iterator) iteratorClose(iterator);
        return new Result(true, condition);
    };

    var callFn = function (value) {
        if (AS_ENTRIES) {
            anObject(value);
            return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
        }
        return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
        iterator = iterable;
    } else {
        iterFn = getIteratorMethod(iterable);
        if (typeof iterFn != "function") throw TypeError("Target is not iterable");
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
            for (index = 0, length = toLength(iterable.length); length > index; index++) {
                result = callFn(iterable[index]);
                if (result && result instanceof Result) return result;
            }
            return new Result(false);
        }
        iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
        try {
            result = callFn(step.value);
        } catch (error) {
            iteratorClose(iterator);
            throw error;
        }
        if (typeof result == "object" && result && result instanceof Result) return result;
    }
    return new Result(false);
};

var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
        throw TypeError("Incorrect " + (name ? name + " " : "") + "invocation");
    }
    return it;
};

var defineProperty$4 = objectDefineProperty.f;
var forEach = arrayIteration.forEach;

var setInternalState$3 = internalState$1.set;
var internalStateGetterFor = internalState$1.getterFor;

var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
    var ADDER = IS_MAP ? "set" : "add";
    var NativeConstructor = global$1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var exported = {};
    var Constructor;

    if (
        !descriptors ||
        typeof NativeConstructor != "function" ||
        !(
            IS_WEAK ||
            (NativePrototype.forEach &&
                !fails(function () {
                    new NativeConstructor().entries().next();
                }))
        )
    ) {
        // create collection constructor
        Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
        internalMetadata.REQUIRED = true;
    } else {
        Constructor = wrapper(function (target, iterable) {
            setInternalState$3(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
                type: CONSTRUCTOR_NAME,
                collection: new NativeConstructor(),
            });
            if (iterable != undefined) iterate(iterable, target[ADDER], { that: target, AS_ENTRIES: IS_MAP });
        });

        var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

        forEach(
            ["add", "clear", "delete", "forEach", "get", "has", "set", "keys", "values", "entries"],
            function (KEY) {
                var IS_ADDER = KEY == "add" || KEY == "set";
                if (KEY in NativePrototype && !(IS_WEAK && KEY == "clear")) {
                    createNonEnumerableProperty(Constructor.prototype, KEY, function (a, b) {
                        var collection = getInternalState(this).collection;
                        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == "get" ? undefined : false;
                        var result = collection[KEY](a === 0 ? 0 : a, b);
                        return IS_ADDER ? this : result;
                    });
                }
            }
        );

        IS_WEAK ||
            defineProperty$4(Constructor.prototype, "size", {
                configurable: true,
                get: function () {
                    return getInternalState(this).collection.size;
                },
            });
    }

    setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({ global: true, forced: true }, exported);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
};

var redefineAll = function (target, src, options) {
    for (var key in src) {
        if (options && options.unsafe && target[key]) target[key] = src[key];
        else redefine$1(target, key, src[key], options);
    }
    return target;
};

var SPECIES$5 = wellKnownSymbol("species");

var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$5]) {
        defineProperty(Constructor, SPECIES$5, {
            configurable: true,
            get: function () {
                return this;
            },
        });
    }
};

var defineProperty$5 = objectDefineProperty.f;

var fastKey = internalMetadata.fastKey;

var setInternalState$4 = internalState$1.set;
var internalStateGetterFor$1 = internalState$1.getterFor;

var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
            anInstance(that, C, CONSTRUCTOR_NAME);
            setInternalState$4(that, {
                type: CONSTRUCTOR_NAME,
                index: objectCreate$1(null),
                first: undefined,
                last: undefined,
                size: 0,
            });
            if (!descriptors) that.size = 0;
            if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        });

        var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

        var define = function (that, key, value) {
            var state = getInternalState(that);
            var entry = getEntry(that, key);
            var previous, index;
            // change existing entry
            if (entry) {
                entry.value = value;
                // create new entry
            } else {
                state.last = entry = {
                    index: (index = fastKey(key, true)),
                    key: key,
                    value: value,
                    previous: (previous = state.last),
                    next: undefined,
                    removed: false,
                };
                if (!state.first) state.first = entry;
                if (previous) previous.next = entry;
                if (descriptors) state.size++;
                else that.size++;
                // add to index
                if (index !== "F") state.index[index] = entry;
            }
            return that;
        };

        var getEntry = function (that, key) {
            var state = getInternalState(that);
            // fast case
            var index = fastKey(key);
            var entry;
            if (index !== "F") return state.index[index];
            // frozen object case
            for (entry = state.first; entry; entry = entry.next) {
                if (entry.key == key) return entry;
            }
        };

        redefineAll(C.prototype, {
            // 23.1.3.1 Map.prototype.clear()
            // 23.2.3.2 Set.prototype.clear()
            clear: function clear() {
                var that = this;
                var state = getInternalState(that);
                var data = state.index;
                var entry = state.first;
                while (entry) {
                    entry.removed = true;
                    if (entry.previous) entry.previous = entry.previous.next = undefined;
                    delete data[entry.index];
                    entry = entry.next;
                }
                state.first = state.last = undefined;
                if (descriptors) state.size = 0;
                else that.size = 0;
            },
            // 23.1.3.3 Map.prototype.delete(key)
            // 23.2.3.4 Set.prototype.delete(value)
            delete: function (key) {
                var that = this;
                var state = getInternalState(that);
                var entry = getEntry(that, key);
                if (entry) {
                    var next = entry.next;
                    var prev = entry.previous;
                    delete state.index[entry.index];
                    entry.removed = true;
                    if (prev) prev.next = next;
                    if (next) next.previous = prev;
                    if (state.first == entry) state.first = next;
                    if (state.last == entry) state.last = prev;
                    if (descriptors) state.size--;
                    else that.size--;
                }
                return !!entry;
            },
            // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
            // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
            forEach: function forEach(callbackfn /* , that = undefined */) {
                var state = getInternalState(this);
                var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
                var entry;
                while ((entry = entry ? entry.next : state.first)) {
                    boundFunction(entry.value, entry.key, this);
                    // revert to the last existing entry
                    while (entry && entry.removed) entry = entry.previous;
                }
            },
            // 23.1.3.7 Map.prototype.has(key)
            // 23.2.3.7 Set.prototype.has(value)
            has: function has(key) {
                return !!getEntry(this, key);
            },
        });

        redefineAll(
            C.prototype,
            IS_MAP
                ? {
                      // 23.1.3.6 Map.prototype.get(key)
                      get: function get(key) {
                          var entry = getEntry(this, key);
                          return entry && entry.value;
                      },
                      // 23.1.3.9 Map.prototype.set(key, value)
                      set: function set(key, value) {
                          return define(this, key === 0 ? 0 : key, value);
                      },
                  }
                : {
                      // 23.2.3.1 Set.prototype.add(value)
                      add: function add(value) {
                          return define(this, (value = value === 0 ? 0 : value), value);
                      },
                  }
        );
        if (descriptors)
            defineProperty$5(C.prototype, "size", {
                get: function () {
                    return getInternalState(this).size;
                },
            });
        return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
        var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
        var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
        var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
        // add .keys, .values, .entries, [@@iterator]
        // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
        defineIterator(
            C,
            CONSTRUCTOR_NAME,
            function (iterated, kind) {
                setInternalState$4(this, {
                    type: ITERATOR_NAME,
                    target: iterated,
                    state: getInternalCollectionState(iterated),
                    kind: kind,
                    last: undefined,
                });
            },
            function () {
                var state = getInternalIteratorState(this);
                var kind = state.kind;
                var entry = state.last;
                // revert to the last existing entry
                while (entry && entry.removed) entry = entry.previous;
                // get next entry
                if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
                    // or finish the iteration
                    state.target = undefined;
                    return { value: undefined, done: true };
                }
                // return step by kind
                if (kind == "keys") return { value: entry.key, done: false };
                if (kind == "values") return { value: entry.value, done: false };
                return { value: [entry.key, entry.value], done: false };
            },
            IS_MAP ? "entries" : "values",
            !IS_MAP,
            true
        );

        // add [@@species], 23.1.2.2, 23.2.2.2
        setSpecies(CONSTRUCTOR_NAME);
    },
};

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
var es_map = collection(
    "Map",
    function (init) {
        return function Map() {
            return init(this, arguments.length ? arguments[0] : undefined);
        };
    },
    collectionStrong
);

var map = path.Map;

var map$1 = map;

var map$2 = map$1;

/**
 * [share.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace share.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */
var map$3 = {
    type: new map$2([
        ["number", "number"],
        ["string", "string"],
        ["object", "object.Object"],
        ["array", "object.Array"],
    ]),
    constructor: new map$2([
        ["String", String],
        ["Object", Object],
        ["Array", Array],
    ]),
};
/**
 * @constant {object} operate Table driven operation
 *
 * @member {function} table operate through table
 * @member {function} item operate an item
 */

var operate = {
    table: function table(_table) {
        var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (item, tools) {};
        var argument = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var control = {
            status: {
                index: 0,
                // 当前所在索引
                goto: {
                    index: "here",
                    save: undefined,
                },
                // 跳转到的索引
                abort: false,
                // 是否为“退出”状态
                continue: false, // 是否为“继续”状态
            },
            // 状态
            method: function method(_method, status, message, record) {
                this.status[_method] = status; // 操作状态对象

                if (record) {
                    this.save.exception.push({
                        expectation: "call control.".concat(_method),
                        index: this.index,
                        message: message,
                    });
                } // 是否记录到异常
            },
            // 方法模板
            export: {
                source: [],
                // 资源
                exception: [],
                // 异常
                abort: function abort() {
                    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
                    var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                    control.method("abort", false, message, record);
                },
                // 退出
                continue: function _continue() {
                    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
                    var record = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                    control.method("continue", false, message, record);
                },
                // 继续
                goto: function goto() {
                    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "save";
                    var data = arguments.length > 1 ? arguments[1] : undefined;
                    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
                    var record = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                    var save = control.status["goto"].save; // 上次跳转时传入的参数

                    control.method(
                        "goto",
                        {
                            index: index,
                            save: data,
                        },
                        message,
                        record
                    );
                    return save;
                },
                // 跳转
                wait: function wait() {
                    console.debug("This function is not ready.");
                }, // 等待
            },
        };

        for (
            ;
            control.status.index < _table.length && !control.status.abort;
            control.status.index = (function (index, _goto) {
                switch (_typeof(_goto)) {
                    case "number":
                        if (0 > _goto) {
                            if (index > Math.abs(_goto)) {
                                _goto += index;
                            } else {
                                _goto = 0;
                            } // [{负数，正常}, {负数，溢出}]
                        } // 负数，表示反向增加

                        return _goto;

                    case "string":
                    default:
                        return index + 1;
                }
            })(control.status.index, control.status["goto"].index)
        ) {
            var _context;

            operator.apply(
                void 0,
                concat$2(
                    (_context = [
                        _table[control.status.index],
                        {
                            table: _table,
                            index: control.status.index,
                            control: control["export"],
                            argument: argument,
                        },
                    ])
                ).call(_context, _toConsumableArray(argument))
            );
        } // 循环

        return {
            source: control["export"].source,
            exception: control["export"].exception,
        };
    },
    item: function item(index, table) {
        var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (item, index) {};
        return operator(table[index], index);
    },
};
var convert = {
    path: function path(source) {
        if ("string" === typeof source) source = source.split(".");
        return source;
    },
};
var verify = {
    /**
     * Verify the typeof source, ONLY support object|array|string|number
     * @param {any} source the source need to be verified
     * @param {array|string} type the format string or it's array, eg. "object.Array"
     * @param {function} callback call when verified, no matter true or false
     */
    type: function type(source, _type) {
        var callback =
            arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : function (save) {
                      return save.code;
                  };

        function type4string(source, type) {
            type = convert.path(type); // 根据 "." 区分第一或第二类型

            if (type[0] === _typeof(source)) {
                if (1 < type.length) {
                    var _constructor = map$3.constructor.get(type[1]); // 转换第二个类型为 constructor

                    if (_constructor) return source instanceof _constructor;
                    else return false; // [{构造函数为真，检查是否符合}, {构造函数为真，不检查，为假}]
                } // 如果存在第二个类型

                return true;
            } // "." 之前的类型，即第一个类型是否满足

            return false;
        } // 单个类型

        var save = {
            code: false,
        };
        if ("string" === typeof _type) _type = [_type];

        var _iterator = _createForOfIteratorHelper(_type),
            _step;

        try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var item = _step.value;

                if (type4string(source, item)) {
                    save.code = true;
                    save.type = item;
                    break;
                }
            } // 遇到一个符合的即为 "真"
        } catch (err) {
            _iterator.e(err);
        } finally {
            _iterator.f();
        }

        return callback(save);
    },
    // 类型
    property: function property(object, path) {
        var farthest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (object, bool) {};
        var property = null;
        path = convert.path(path); // 根据 "." 区分层级

        while (object) {
            if (Object.prototype.hasOwnProperty.call(object, (property = path[0]))) {
                object = object[property];
                path.shift();
            } else break;
        }

        farthest(object, !path.length);
        return !path.length;
    },
    // 属性
    num: function num(source) {
        var _num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (Object.prototype.hasOwnProperty.call(source, length)) {
            return _num > source.length;
        } // 如果有 "length" 属性

        return false;
    }, // 个数
}; // 验证

var select = {
    type: function type() {
        var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return operate.table(symbol, function (symbol, tools) {
            tools.control.source.push(map$3.type.get(symbol));
        }).source;
    },
    // 选出 symbol 对应的 verify.type 的类型数组
    array: function array() {
        var _array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        return _array[Number(channel)];
    },
    // 数组
    object: function object() {
        var _object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var array = [];

        var _iterator2 = _createForOfIteratorHelper(path),
            _step2;

        try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                var item = _step2.value;
                verify.property(_object, item, function (object, bool) {
                    if (bool) array.push(object);
                });
            }
        } catch (err) {
            _iterator2.e(err);
        } finally {
            _iterator2.f();
        }

        return array;
    },
    // 对象
    farthest: function farthest(paths, chain) {
        var _chain$path;

        var index = 0; // 当前索引

        var _iterator3 = _createForOfIteratorHelper(paths),
            _step3;

        try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
                var _context2, _context3;

                var path = _step3.value;
                if (
                    1 !=
                    indexOf$3((_context2 = slice$2((_context3 = chain.path)).call(_context3, index))).call(
                        _context2,
                        path
                    )
                )
                    break; // 如果当前路径点不是剪切后的路径链中第一个，退出

                index++;
            } // 找到不同位置
        } catch (err) {
            _iterator3.e(err);
        } finally {
            _iterator3.f();
        }

        chain.path.length = index + 1; // 截到上一个相同的路径点，并保持第一个元素

        chain.source.length = index + 1;

        (_chain$path = chain.path).push.apply(_chain$path, _toConsumableArray(slice$2(paths).call(paths, index))); // 压入本次不同的路径点

        return index;
    }, // 选出相同的最远的索引
}; // 选择

var assert = function assert(source, type, name, callback) {
    var result = verify.type(source, select.type(type), function (save) {
        var _context4;

        save = {
            code: !save.code,
        };
        if (save.code)
            save.message = concat$2((_context4 = "type of ".concat(name, " is wrong, should be "))).call(
                _context4,
                type.join("|")
            );
        return save;
    });
    if (result.code && "function" === typeof callback) return callback(result);
    else return result; // [{没错误且 callback 为函数类型}]
};

var call = function call(source, argument) {
    var hook = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var callback =
        arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : function (arg) {
                  return arg;
              };
    var save = {
        result: {},
    };
    return operate.table(source, function (source, tools) {
        save.argument = argument[tools.index];
        hook(save, tools);

        if (verify.type(source, ["function"])) {
            save.result = callback(source.apply(void 0, _toConsumableArray(save.argument)), tools);
        }
    });
};
var share = {
    operate: operate,
    convert: convert,
    verify: verify,
    select: select,
    assert: assert,
    call: call,
};

/**
 * [site.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace site.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

var variable = {
    assert: ["object", "string"],
};

function assert_site(site) {
    return assert(site, variable.assert, "site");
}

var defineProperty$6 = objectDefineProperty$1.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = "name";

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (descriptors$1 && !(NAME in FunctionPrototype)) {
    defineProperty$6(FunctionPrototype, NAME, {
        configurable: true,
        get: function () {
            try {
                return FunctionPrototypeToString.call(this).match(nameRE)[1];
            } catch (error) {
                return "";
            }
        },
    });
}

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
_export(
    { target: "Object", stat: true, forced: !descriptors, sham: !descriptors },
    {
        defineProperty: objectDefineProperty.f,
    }
);

var defineProperty_1 = createCommonjsModule(function (module) {
    var Object = path.Object;

    var defineProperty = (module.exports = function defineProperty(it, key, desc) {
        return Object.defineProperty(it, key, desc);
    });

    if (Object.defineProperty.sham) defineProperty.sham = true;
});

var defineProperty$7 = defineProperty_1;

var defineProperty$8 = defineProperty$7;

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
_export(
    { target: "Object", stat: true, forced: !descriptors, sham: !descriptors },
    {
        defineProperties: objectDefineProperties$1,
    }
);

var defineProperties_1 = createCommonjsModule(function (module) {
    var Object = path.Object;

    var defineProperties = (module.exports = function defineProperties(T, D) {
        return Object.defineProperties(T, D);
    });

    if (Object.defineProperties.sham) defineProperties.sham = true;
});

var defineProperties = defineProperties_1;

var defineProperties$1 = defineProperties;

// all object keys, includes non-enumerable and symbols
var ownKeys$1 =
    getBuiltIn("Reflect", "ownKeys") ||
    function ownKeys(it) {
        var keys = objectGetOwnPropertyNames$1.f(anObject(it));
        var getOwnPropertySymbols = objectGetOwnPropertySymbols$1.f;
        return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
    };

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
_export(
    { target: "Object", stat: true, sham: !descriptors },
    {
        getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
            var O = toIndexedObject(object);
            var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
            var keys = ownKeys$1(O);
            var result = {};
            var index = 0;
            var key, descriptor;
            while (keys.length > index) {
                descriptor = getOwnPropertyDescriptor(O, (key = keys[index++]));
                if (descriptor !== undefined) createProperty(result, key, descriptor);
            }
            return result;
        },
    }
);

var getOwnPropertyDescriptors = path.Object.getOwnPropertyDescriptors;

var getOwnPropertyDescriptors$1 = getOwnPropertyDescriptors;

var getOwnPropertyDescriptors$2 = getOwnPropertyDescriptors$1;

var $forEach$1 = arrayIteration.forEach;

var STRICT_METHOD$2 = arrayMethodIsStrict$1("forEach");
var USES_TO_LENGTH$3 = arrayMethodUsesToLength("forEach");

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
var arrayForEach =
    !STRICT_METHOD$2 || !USES_TO_LENGTH$3
        ? function forEach(callbackfn /* , thisArg */) {
              return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
          }
        : [].forEach;

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
_export(
    { target: "Array", proto: true, forced: [].forEach != arrayForEach },
    {
        forEach: arrayForEach,
    }
);

var forEach$1 = entryVirtual("Array").forEach;

var forEach$2 = forEach$1;

var ArrayPrototype$5 = Array.prototype;

var DOMIterables = {
    DOMTokenList: true,
    NodeList: true,
};

var forEach_1 = function (it) {
    var own = it.forEach;
    return it === ArrayPrototype$5 ||
        (it instanceof Array && own === ArrayPrototype$5.forEach) ||
        // eslint-disable-next-line no-prototype-builtins
        DOMIterables.hasOwnProperty(classof(it))
        ? forEach$2
        : own;
};

var forEach$3 = forEach_1;

var forEach$4 = forEach$3;

var nativeGetOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

var FAILS_ON_PRIMITIVES = fails(function () {
    nativeGetOwnPropertyDescriptor$3(1);
});
var FORCED$1 = !descriptors || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
_export(
    { target: "Object", stat: true, forced: FORCED$1, sham: !descriptors },
    {
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
            return nativeGetOwnPropertyDescriptor$3(toIndexedObject(it), key);
        },
    }
);

var getOwnPropertyDescriptor_1 = createCommonjsModule(function (module) {
    var Object = path.Object;

    var getOwnPropertyDescriptor = (module.exports = function getOwnPropertyDescriptor(it, key) {
        return Object.getOwnPropertyDescriptor(it, key);
    });

    if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;
});

var getOwnPropertyDescriptor$5 = getOwnPropertyDescriptor_1;

var getOwnPropertyDescriptor$6 = getOwnPropertyDescriptor$5;

var $filter = arrayIteration.filter;

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport("filter");
// Edge 14- issue
var USES_TO_LENGTH$4 = arrayMethodUsesToLength("filter");

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 },
    {
        filter: function filter(callbackfn /* , thisArg */) {
            return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        },
    }
);

var filter = entryVirtual("Array").filter;

var ArrayPrototype$6 = Array.prototype;

var filter_1 = function (it) {
    var own = it.filter;
    return it === ArrayPrototype$6 || (it instanceof Array && own === ArrayPrototype$6.filter) ? filter : own;
};

var filter$1 = filter_1;

var filter$2 = filter$1;

var getOwnPropertySymbols = path.Object.getOwnPropertySymbols;

var getOwnPropertySymbols$1 = getOwnPropertySymbols;

var getOwnPropertySymbols$2 = getOwnPropertySymbols$1;

var FAILS_ON_PRIMITIVES$1 = fails(function () {
    objectKeys$1(1);
});

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
_export(
    { target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES$1 },
    {
        keys: function keys(it) {
            return objectKeys$1(toObject(it));
        },
    }
);

var keys$3 = path.Object.keys;

var keys$4 = keys$3;

var keys$5 = keys$4;

function _defineProperty(obj, key, value) {
    if (key in obj) {
        defineProperty$8(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }

    return obj;
}

function ownKeys$2(object, enumerableOnly) {
    var keys = keys$5(object);

    if (getOwnPropertySymbols$2) {
        var symbols = getOwnPropertySymbols$2(object);

        if (enumerableOnly)
            symbols = filter$2(symbols).call(symbols, function (sym) {
                return getOwnPropertyDescriptor$6(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }

    return keys;
}

function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
            var _context;

            forEach$4((_context = ownKeys$2(Object(source), true))).call(_context, function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (getOwnPropertyDescriptors$2) {
            defineProperties$1(target, getOwnPropertyDescriptors$2(source));
        } else {
            var _context2;

            forEach$4((_context2 = ownKeys$2(Object(source)))).call(_context2, function (key) {
                defineProperty$8(target, key, getOwnPropertyDescriptor$6(source, key));
            });
        }
    }

    return target;
}

var forEach$5 = forEach_1;

var DatePrototype = Date.prototype;
var INVALID_DATE = "Invalid Date";
var TO_STRING = "toString";
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + "" != INVALID_DATE) {
    redefine(DatePrototype, TO_STRING, function toString() {
        var value = getTime.call(this);
        // eslint-disable-next-line no-self-compare
        return value === value ? nativeDateToString.call(this) : INVALID_DATE;
    });
}

/**
 * [time.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace time.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */
var variable$1 = new Date();

function timestamp() {
    var _context;

    return concat$2(
        (_context = "".concat(
            variable$1.toLocaleString(undefined, {
                hour12: false, // 24h
            }),
            "."
        ))
    ).call(_context, variable$1.getMilliseconds());
}

function ready() {
    return true;
}
var time = {
    variable: variable$1,
    timestamp: timestamp,
    ready: ready,
};

var TO_STRING_TAG$4 = wellKnownSymbol$1("toStringTag");
var test$1 = {};

test$1[TO_STRING_TAG$4] = "z";

var toStringTagSupport$1 = String(test$1) === "[object z]";

var TO_STRING_TAG$5 = wellKnownSymbol$1("toStringTag");
// ES3 wrong here
var CORRECT_ARGUMENTS$1 =
    classofRaw$1(
        (function () {
            return arguments;
        })()
    ) == "Arguments";

// fallback for IE11 Script Access Denied error
var tryGet$1 = function (it, key) {
    try {
        return it[key];
    } catch (error) {
        /* empty */
    }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof$1 = toStringTagSupport$1
    ? classofRaw$1
    : function (it) {
          var O, tag, result;
          return it === undefined
              ? "Undefined"
              : it === null
              ? "Null"
              : // @@toStringTag case
              typeof (tag = tryGet$1((O = Object(it)), TO_STRING_TAG$5)) == "string"
              ? tag
              : // builtinTag case
              CORRECT_ARGUMENTS$1
              ? classofRaw$1(O)
              : // ES3 arguments fallback
              (result = classofRaw$1(O)) == "Object" && typeof O.callee == "function"
              ? "Arguments"
              : result;
      };

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString$1 = toStringTagSupport$1
    ? {}.toString
    : function toString() {
          return "[object " + classof$1(this) + "]";
      };

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport$1) {
    redefine(Object.prototype, "toString", objectToString$1, { unsafe: true });
}

var TO_STRING$1 = "toString";
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING$1];

var NOT_GENERIC = fails$1(function () {
    return nativeToString.call({ source: "a", flags: "b" }) != "/a/b";
});
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(
        RegExp.prototype,
        TO_STRING$1,
        function toString() {
            var R = anObject$1(this);
            var p = String(R.source);
            var rf = R.flags;
            var f = String(
                rf === undefined && R instanceof RegExp && !("flags" in RegExpPrototype) ? regexpFlags.call(R) : rf
            );
            return "/" + p + "/" + f;
        },
        { unsafe: true }
    );
}

// @@match logic
fixRegexpWellKnownSymbolLogic("match", 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
        // `String.prototype.match` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.match
        function match(regexp) {
            var O = requireObjectCoercible$1(this);
            var matcher = regexp == undefined ? undefined : regexp[MATCH];
            return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
        function (regexp) {
            var res = maybeCallNative(nativeMatch, regexp, this);
            if (res.done) return res.value;

            var rx = anObject$1(regexp);
            var S = String(this);

            if (!rx.global) return regexpExecAbstract(rx, S);

            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
            var A = [];
            var n = 0;
            var result;
            while ((result = regexpExecAbstract(rx, S)) !== null) {
                var matchStr = String(result[0]);
                A[n] = matchStr;
                if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength$1(rx.lastIndex), fullUnicode);
                n++;
            }
            return n === 0 ? null : A;
        },
    ];
});

/**
 * [log.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace log.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */
// import encrypt from "./encrypt.utils.js"; // encrypt.utils

var variable$2 = {
    pool: {
        debug: [],
        system: [],
        encrypt: [],
        exception: [],
    },
    method: {
        record: function record(zone, message) {
            var hook =
                arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : function (value) {
                          return value;
                      };
            var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
            message = {
                timestamp: time.timestamp(),
                source: message,
            };
            variable$2.pool[zone].push(hook(message));
            callback(message);
        },
        // 记录
        view: function view(zone, hook) {
            var _context;

            var callback =
                arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : function (value) {
                          return value;
                      };

            forEach$5((_context = variable$2.pool[zone])).call(_context, function (element) {
                if (verify.type(hook, "function")) element = hook(element); // 如果 hook 是函数
            });

            return callback(variable$2.pool[zone]);
        },
        // 查看
        clear: function clear(zone) {
            variable$2.pool[zone].length = 0;
        }, // 清除
    },
};
var debug = {
    __zone__: "debug",
    record: function record(message) {},
    view: function view() {
        return variable$2.method.view(this.__zone__);
    },
}; // 调试，明文字符，开发者分析使用

var system = {
    __zone__: "system",
    record: function record(message) {
        variable$2.method.record(this.__zone__, message);
    },
    view: function view() {
        return variable$2.method.view(this.__zone__);
    },
}; // 系统，明文字符，用户获取提示信息

var encrypt = {
    __zone__: "encrypt",
    record: function record(message) {
        variable$2.method.record(this.__zone__, message);
    },
    view: function view() {
        return variable$2.method.view(this.__zone__);
    },
}; // 加密，加密字符，用户个人敏感信息

var exception = {
    __zone__: "exception",

    /**
     * @param {number} code
     * @param {*} message
     * @note code - [1, 2, 3, 4, 5] => [warn, ...error]
     */
    record: function record() {
        var _this = this;

        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var message = arguments.length > 1 ? arguments[1] : undefined;
        variable$2.method.record(
            this.__zone__,
            {
                code: code,
                message: message,
            },
            undefined,
            function (log) {
                if (2 <= log.source.code) {
                    throw _this.view();
                } // error，直接终止程序
            }
        );
    },
    view: function view() {
        return variable$2.method.view(this.__zone__);
    },
}; // 异常，明文字符，错误，警告等相关
var log = {
    debug: debug,
    system: system,
    encrypt: encrypt,
    exception: exception,
};

var getWeakData = internalMetadata.getWeakData;

var setInternalState$5 = internalState$1.set;
var internalStateGetterFor$2 = internalState$1.getterFor;
var find = arrayIteration.find;
var findIndex = arrayIteration.findIndex;
var id$2 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
    this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
    return find(store.entries, function (it) {
        return it[0] === key;
    });
};

UncaughtFrozenStore.prototype = {
    get: function (key) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) return entry[1];
    },
    has: function (key) {
        return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) entry[1] = value;
        else this.entries.push([key, value]);
    },
    delete: function (key) {
        var index = findIndex(this.entries, function (it) {
            return it[0] === key;
        });
        if (~index) this.entries.splice(index, 1);
        return !!~index;
    },
};

var collectionWeak = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
            anInstance(that, C, CONSTRUCTOR_NAME);
            setInternalState$5(that, {
                type: CONSTRUCTOR_NAME,
                id: id$2++,
                frozen: undefined,
            });
            if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        });

        var getInternalState = internalStateGetterFor$2(CONSTRUCTOR_NAME);

        var define = function (that, key, value) {
            var state = getInternalState(that);
            var data = getWeakData(anObject(key), true);
            if (data === true) uncaughtFrozenStore(state).set(key, value);
            else data[state.id] = value;
            return that;
        };

        redefineAll(C.prototype, {
            // 23.3.3.2 WeakMap.prototype.delete(key)
            // 23.4.3.3 WeakSet.prototype.delete(value)
            delete: function (key) {
                var state = getInternalState(this);
                if (!isObject(key)) return false;
                var data = getWeakData(key);
                if (data === true) return uncaughtFrozenStore(state)["delete"](key);
                return data && has(data, state.id) && delete data[state.id];
            },
            // 23.3.3.4 WeakMap.prototype.has(key)
            // 23.4.3.4 WeakSet.prototype.has(value)
            has: function has$1(key) {
                var state = getInternalState(this);
                if (!isObject(key)) return false;
                var data = getWeakData(key);
                if (data === true) return uncaughtFrozenStore(state).has(key);
                return data && has(data, state.id);
            },
        });

        redefineAll(
            C.prototype,
            IS_MAP
                ? {
                      // 23.3.3.3 WeakMap.prototype.get(key)
                      get: function get(key) {
                          var state = getInternalState(this);
                          if (isObject(key)) {
                              var data = getWeakData(key);
                              if (data === true) return uncaughtFrozenStore(state).get(key);
                              return data ? data[state.id] : undefined;
                          }
                      },
                      // 23.3.3.5 WeakMap.prototype.set(key, value)
                      set: function set(key, value) {
                          return define(this, key, value);
                      },
                  }
                : {
                      // 23.4.3.1 WeakSet.prototype.add(value)
                      add: function add(value) {
                          return define(this, value, true);
                      },
                  }
        );

        return C;
    },
};

// `WeakSet` constructor
// https://tc39.github.io/ecma262/#sec-weakset-constructor
collection(
    "WeakSet",
    function (init) {
        return function WeakSet() {
            return init(this, arguments.length ? arguments[0] : undefined);
        };
    },
    collectionWeak
);

var weakSet = path.WeakSet;

var weakSet$1 = weakSet;

var weakSet$2 = weakSet$1;

var es_weakMap = createCommonjsModule(function (module) {
    var enforceIternalState = internalState$1.enforce;

    var IS_IE11 = !global$1.ActiveXObject && "ActiveXObject" in global$1;
    var isExtensible = Object.isExtensible;
    var InternalWeakMap;

    var wrapper = function (init) {
        return function WeakMap() {
            return init(this, arguments.length ? arguments[0] : undefined);
        };
    };

    // `WeakMap` constructor
    // https://tc39.github.io/ecma262/#sec-weakmap-constructor
    var $WeakMap = (module.exports = collection("WeakMap", wrapper, collectionWeak));

    // IE11 WeakMap frozen keys fix
    // We can't use feature detection because it crash some old IE builds
    // https://github.com/zloirock/core-js/issues/485
    if (nativeWeakMap$1 && IS_IE11) {
        InternalWeakMap = collectionWeak.getConstructor(wrapper, "WeakMap", true);
        internalMetadata.REQUIRED = true;
        var WeakMapPrototype = $WeakMap.prototype;
        var nativeDelete = WeakMapPrototype["delete"];
        var nativeHas = WeakMapPrototype.has;
        var nativeGet = WeakMapPrototype.get;
        var nativeSet = WeakMapPrototype.set;
        redefineAll(WeakMapPrototype, {
            delete: function (key) {
                if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeDelete.call(this, key) || state.frozen["delete"](key);
                }
                return nativeDelete.call(this, key);
            },
            has: function has(key) {
                if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeHas.call(this, key) || state.frozen.has(key);
                }
                return nativeHas.call(this, key);
            },
            get: function get(key) {
                if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
                }
                return nativeGet.call(this, key);
            },
            set: function set(key, value) {
                if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
                } else nativeSet.call(this, key, value);
                return this;
            },
        });
    }
});

var weakMap = path.WeakMap;

var weakMap$1 = weakMap;

var weakMap$2 = weakMap$1;

/**
 * [chain.utils]{@link https://github.com/miiwu/domalet}
 *
 * @namespace chain.utils
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

var _input = new weakMap$2();

var _count = new weakMap$2();

var _array = new weakMap$2();

var _index = new weakMap$2();

var _save = new weakMap$2();

var _push = new weakSet$2();

var _virtual = new weakSet$2();

var _depend = new weakSet$2();

/**
 * [applet.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace applet.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

var variable$3 = {
    assert: ["array"],
    chain: null,
    layer: {
        site: function site(start, end, _site) {
            var _this = this;

            share.operate.table(_site, function (site) {
                log.debug.record("".concat(site.domain, " operate..."), function () {
                    site.debug = {};
                }); // debug
                // variable.chain.command(site.custom.applet); // 输入命令

                variable$3.chain.apply(); // 应用命令和小程序

                var site4applet = _objectSpread2(
                    _objectSpread2({}, site),
                    {},
                    {
                        url: "",
                        path: "",
                    }
                );

                delete site4applet.save;
                delete site4applet.debug;
                variable$3.chain.operate(
                    {
                        try: function _try(packet) {
                            packet.self.info.packet = {
                                site: site4applet,
                                source: packet.source,
                                argument: packet.self.argument,
                                situation: packet.situation,
                            }; // applet.info.packet，作为 applet.info.callback 的传入参数

                            packet.result = _this.auth(site, packet.self);
                        },
                        catch: function _catch(packet) {
                            log.exception.record(
                                2, // 错误
                                {
                                    location: "applet.operate.chain.operate.catch()",
                                    detail: {
                                        site: packet.self.info.site,
                                        exception: packet.exception,
                                    },
                                }
                            ); // 异常日志
                        },
                        succeed: function succeed(packet) {
                            packet.tools.control.source.push(packet.result); // 存储执行结果
                        },
                    },
                    [],
                    [start, end]
                ); // 执行小程序

                site.save = variable$3.chain.save(); // 保存到 site.save 下

                log.debug.record("".concat(site.domain, " complete..."), function () {
                    delete site.debug;
                }); // debug
            }); // 迭代 site
        },
        // site，网站层
        auth: function auth(site, applet) {
            var result = this.path(site, applet);

            if (applet.argument.auth) {
                delete applet.info.packet.site.credential;
            } // 只认证一次

            return result;
        },
        // auth，认证层
        path: function path(site, applet) {
            var _this2 = this,
                _context3;

            var save = share.operate.table(applet.argument.path, function (path, tools) {
                var _context;

                var result = {};
                applet.info.packet.site.path = path; // 存储 path 到 argument[1] 对象

                applet.info.packet.site.url = concat$2(
                    (_context = "".concat(applet.info.packet.site.domain, "/"))
                ).call(_context, applet.info.packet.site.path); // url = domain / path

                result = _this2.app(site, applet);
                tools.control.source.push(result); // 存储执行结果

                if (!result.code) {
                    var _context2;

                    log.debug.record(
                        concat$2((_context2 = "the path of ".concat(site.domain, " is "))).call(_context2, path),
                        function () {
                            site.debug.path = path;
                        }
                    ); // debug

                    tools.control.abort();
                } // 成功
            }); // 迭代 path

            log.debug.record({
                type: "path",
                save: save.source,
            }); // debug

            return slice$2((_context3 = save.source)).call(_context3, -1)[0]; // 返回最后一次结果
        },
        // path，路径层
        app: function app(site, applet) {
            var _context4;

            var result = {};

            try {
                result = applet.info.call(applet.info.packet); // 执行小程序
            } catch (exception) {
                log.exception.record(2, {
                    location: "applet.operate.layer.app()",
                    detail: {
                        result: result,
                        exception: exception,
                    },
                });
            }

            log.debug.record(
                concat$2((_context4 = "the app of ".concat(site.domain, " is "))).call(
                    _context4,
                    result.code ? "failed" : "successful",
                    " "
                )
            ); // debug

            return result;
        }, // app，应用层
    },
};

function assert_applet(applet) {
    return share.assert(applet, variable$3.assert, "applet", function () {
        share.operate.table(applet, function (applet, tools) {
            if (!Object.prototype.hasOwnProperty.call(applet, "info")) {
                tools.control.exception.push();
            }
        });
    });
} // 断言

/**
 * [platform.parser]{@link https://github.com/miiwu/domalet}
 *
 * @namespace platform.parser
 * @version 2.0.0
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

var variable$4 = {
    assert: ["object", "string"],
    // 断言类型
    type: {
        chrome: {
            soulsign: function soulsign() {
                return "this is chrome.soulsign";
            },
        },
        github: {
            action: function action() {
                return "this is github.action";
            },
        },
    },
};

function assert_platform(platform) {
    return assert(platform, variable$4.assert, "platform");
} // 断言

/**
 * [model.support]{@link https://github.com/miiwu/model.domalet}
 *
 * @namespace model.support
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

/**
 * Return the model array, then need use "..." to spread it
 * @param {array} model - the model array of your xxx..model.js
 * @param {(array|object)} value - the value argument when line.parser()
 * @return {array} - the model array with value
 */

function extract(model, value) {
    splice$2(model).call(model, 1, 0, value);

    return model;
} // 提取
var model_support = {
    share: share,
    extract: extract,
    assert: {
        platform: assert_platform,
        applet: assert_applet,
        site: assert_site,
    },
};

export default model_support;
export { assert_applet, assert_platform, assert_site, extract, share };
