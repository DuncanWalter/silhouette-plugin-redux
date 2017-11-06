(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require("redux"), require("silhouette-core")); else if (typeof define === "function" && define.amd) define([ "redux", "silhouette-core" ], factory); else if (typeof exports === "object") exports["silhouette"] = factory(require("redux"), require("silhouette-core")); else root["silhouette"] = factory(root["redux"], root["silhouette-core"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"];
            } : function getModuleExports() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = function({compose: compose, enhancers: enhancers, middleware: middleware}) {
            return {
                createStore: next => reducer => {
                    let c = compose || _redux.compose;
                    let m = (0, _redux.applyMiddleware)(...middleware || []);
                    let e = c(...enhancers || [], m);
                    let i = r => Object.assign(next(r), (0, _redux.createStore)(r, e));
                    return i(reducer);
                }
            };
        };
        exports.useStore = useStore;
        var _redux = __webpack_require__(1);
        var _silhouetteCore = __webpack_require__(2);
        function syncQueue() {
            let active = false;
            let next = {};
            let last = next;
            return {
                enqueue(action) {
                    last.value = action;
                    last.next = {};
                    last = last.next;
                },
                forEach(fun) {
                    if (active) {
                        return;
                    }
                    active = true;
                    while (next.next) {
                        fun(next.value);
                        next = next.next;
                    }
                    active = false;
                }
            };
        }
        function useStore(store, reducer) {
            return {
                createStore: next => reducer => {
                    let dispatch = store.dispatch;
                    let actionQueue = syncQueue();
                    store.dispatch = (action => {
                        actionQueue.enqueue(action);
                        actionQueue.forEach(dispatch);
                    });
                    store.replaceReducer(reducer);
                    return store;
                },
                createSil: next => store => {
                    let sil = next(store);
                    sil.define(store.getState());
                    return sil;
                },
                prototype: {
                    dispatch: next => (function(action) {
                        this[_silhouetteCore.symbols.__root__][_silhouetteCore.symbols.__reducers__][action.type] = reducer;
                        next.call(this, action);
                    })
                }
            };
        }
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_2__;
    } ]);
});