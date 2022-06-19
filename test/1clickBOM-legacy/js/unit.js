(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./browser'),
    browser = _require.browser;

var badge = {
    decaying_set: false,
    priority: 0,
    default_text: '',
    default_color: '#0000FF',
    setDecaying: function setDecaying(text) {
        var _this = this;

        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#0000FF';
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        if (priority >= this.priority) {
            if (this.decaying_set && this.id > 0) {
                browser.clearTimeout(this.id);
            }
            this._set(text, color, priority);
            return this.id = browser.setTimeout(function () {
                _this.decaying_set = false;
                return _this._set(_this.default_text, _this.default_color, 0);
            }, 5000);
        }
    },
    setDefault: function setDefault(text) {
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#0000FF';
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        if (priority >= this.priority) {
            this._set(text, color, priority);
        }
        this.default_color = color;
        return this.default_text = text;
    },
    _set: function _set(text, color, priority) {
        browser.setBadge({ color: color, text: text });
        return this.priority = priority;
    }
};

exports.badge = badge;

},{"./browser":3}],2:[function(require,module,exports){
(function (process,global,setImmediate){(function (){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var setTimeout = require('./browser').browser.setTimeout;
var clearTimeout = require('./browser').browser.clearTimeout;
/* @preserve
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2015 Petka Antonov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
/**
 * bluebird build version 3.3.4
 * Features enabled: core
 * Features disabled: race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
 */
!function (e) {
    if ('object' == (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) && 'undefined' != typeof module) module.exports = e();else if ('function' == typeof define && define.amd) define([], e);else {
        var f = void 0;
        'undefined' != typeof window ? f = window : 'undefined' != typeof global ? f = global : 'undefined' != typeof self && (f = self), f.Promise = e();
    }
}(function () {
    var define = void 0,
        module = void 0,
        exports = void 0;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof _dereq_ == 'function' && _dereq_;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = 'MODULE_NOT_FOUND', f;
                }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof _dereq_ == 'function' && _dereq_;
        for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({
        1: [function (_dereq_, module, exports) {
            'use strict';

            var firstLineError = void 0;
            try {
                throw new Error();
            } catch (e) {
                firstLineError = e;
            }
            var schedule = _dereq_('./schedule');
            var Queue = _dereq_('./queue');
            var util = _dereq_('./util');

            function Async() {
                this._isTickUsed = false;
                this._lateQueue = new Queue(16);
                this._normalQueue = new Queue(16);
                this._haveDrainedQueues = false;
                this._trampolineEnabled = true;
                var self = this;
                this.drainQueues = function () {
                    self._drainQueues();
                };
                this._schedule = schedule;
            }

            Async.prototype.enableTrampoline = function () {
                this._trampolineEnabled = true;
            };

            Async.prototype.disableTrampolineIfNecessary = function () {
                if (util.hasDevTools) {
                    this._trampolineEnabled = false;
                }
            };

            Async.prototype.haveItemsQueued = function () {
                return this._isTickUsed || this._haveDrainedQueues;
            };

            Async.prototype.fatalError = function (e, isNode) {
                if (isNode) {
                    process.stderr.write('Fatal ' + (e instanceof Error ? e.stack : e) + '\n');
                    process.exit(2);
                } else {
                    this.throwLater(e);
                }
            };

            Async.prototype.throwLater = function (fn, arg) {
                if (arguments.length === 1) {
                    arg = fn;
                    fn = function fn() {
                        throw arg;
                    };
                }
                if (typeof setTimeout !== 'undefined') {
                    setTimeout(function () {
                        fn(arg);
                    }, 0);
                } else try {
                    this._schedule(function () {
                        fn(arg);
                    });
                } catch (e) {
                    throw new Error('No async scheduler available\n\n    See http://goo.gl/MqrFmX\n');
                }
            };

            function AsyncInvokeLater(fn, receiver, arg) {
                this._lateQueue.push(fn, receiver, arg);
                this._queueTick();
            }

            function AsyncInvoke(fn, receiver, arg) {
                this._normalQueue.push(fn, receiver, arg);
                this._queueTick();
            }

            function AsyncSettlePromises(promise) {
                this._normalQueue._pushOne(promise);
                this._queueTick();
            }

            if (!util.hasDevTools) {
                Async.prototype.invokeLater = AsyncInvokeLater;
                Async.prototype.invoke = AsyncInvoke;
                Async.prototype.settlePromises = AsyncSettlePromises;
            } else {
                Async.prototype.invokeLater = function (fn, receiver, arg) {
                    if (this._trampolineEnabled) {
                        AsyncInvokeLater.call(this, fn, receiver, arg);
                    } else {
                        this._schedule(function () {
                            setTimeout(function () {
                                fn.call(receiver, arg);
                            }, 100);
                        });
                    }
                };

                Async.prototype.invoke = function (fn, receiver, arg) {
                    if (this._trampolineEnabled) {
                        AsyncInvoke.call(this, fn, receiver, arg);
                    } else {
                        this._schedule(function () {
                            fn.call(receiver, arg);
                        });
                    }
                };

                Async.prototype.settlePromises = function (promise) {
                    if (this._trampolineEnabled) {
                        AsyncSettlePromises.call(this, promise);
                    } else {
                        this._schedule(function () {
                            promise._settlePromises();
                        });
                    }
                };
            }

            Async.prototype.invokeFirst = function (fn, receiver, arg) {
                this._normalQueue.unshift(fn, receiver, arg);
                this._queueTick();
            };

            Async.prototype._drainQueue = function (queue) {
                while (queue.length() > 0) {
                    var fn = queue.shift();
                    if (typeof fn !== 'function') {
                        fn._settlePromises();
                        continue;
                    }
                    var receiver = queue.shift();
                    var arg = queue.shift();
                    fn.call(receiver, arg);
                }
            };

            Async.prototype._drainQueues = function () {
                this._drainQueue(this._normalQueue);
                this._reset();
                this._haveDrainedQueues = true;
                this._drainQueue(this._lateQueue);
            };

            Async.prototype._queueTick = function () {
                if (!this._isTickUsed) {
                    this._isTickUsed = true;
                    this._schedule(this.drainQueues);
                }
            };

            Async.prototype._reset = function () {
                this._isTickUsed = false;
            };

            module.exports = Async;
            module.exports.firstLineError = firstLineError;
        }, { './queue': 17, './schedule': 18, './util': 21 }],
        2: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, debug) {
                var calledBind = false;
                var rejectThis = function rejectThis(_, e) {
                    this._reject(e);
                };

                var targetRejected = function targetRejected(e, context) {
                    context.promiseRejectionQueued = true;
                    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
                };

                var bindingResolved = function bindingResolved(thisArg, context) {
                    if ((this._bitField & 50397184) === 0) {
                        this._resolveCallback(context.target);
                    }
                };

                var bindingRejected = function bindingRejected(e, context) {
                    if (!context.promiseRejectionQueued) this._reject(e);
                };

                Promise.prototype.bind = function (thisArg) {
                    if (!calledBind) {
                        calledBind = true;
                        Promise.prototype._propagateFrom = debug.propagateFromFunction();
                        Promise.prototype._boundValue = debug.boundValueFunction();
                    }
                    var maybePromise = tryConvertToPromise(thisArg);
                    var ret = new Promise(INTERNAL);
                    ret._propagateFrom(this, 1);
                    var target = this._target();
                    ret._setBoundTo(maybePromise);
                    if (maybePromise instanceof Promise) {
                        var context = {
                            promiseRejectionQueued: false,
                            promise: ret,
                            target: target,
                            bindingPromise: maybePromise
                        };
                        target._then(INTERNAL, targetRejected, undefined, ret, context);
                        maybePromise._then(bindingResolved, bindingRejected, undefined, ret, context);
                        ret._setOnCancel(maybePromise);
                    } else {
                        ret._resolveCallback(target);
                    }
                    return ret;
                };

                Promise.prototype._setBoundTo = function (obj) {
                    if (obj !== undefined) {
                        this._bitField = this._bitField | 2097152;
                        this._boundTo = obj;
                    } else {
                        this._bitField = this._bitField & ~2097152;
                    }
                };

                Promise.prototype._isBound = function () {
                    return (this._bitField & 2097152) === 2097152;
                };

                Promise.bind = function (thisArg, value) {
                    return Promise.resolve(value).bind(thisArg);
                };
            };
        }, {}],
        3: [function (_dereq_, module, exports) {
            'use strict';

            var old = void 0;
            if (typeof Promise !== 'undefined') old = Promise;
            function noConflict() {
                try {
                    if (Promise === bluebird) Promise = old;
                } catch (e) {}
                return bluebird;
            }
            var bluebird = _dereq_('./promise')();
            bluebird.noConflict = noConflict;
            module.exports = bluebird;
        }, { './promise': 15 }],
        4: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, PromiseArray, apiRejection, debug) {
                var util = _dereq_('./util');
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;
                var async = Promise._async;

                Promise.prototype['break'] = Promise.prototype.cancel = function () {
                    if (!debug.cancellation()) return this._warn('cancellation is disabled');

                    var promise = this;
                    var child = promise;
                    while (promise.isCancellable()) {
                        if (!promise._cancelBy(child)) {
                            if (child._isFollowing()) {
                                child._followee().cancel();
                            } else {
                                child._cancelBranched();
                            }
                            break;
                        }

                        var parent = promise._cancellationParent;
                        if (parent == null || !parent.isCancellable()) {
                            if (promise._isFollowing()) {
                                promise._followee().cancel();
                            } else {
                                promise._cancelBranched();
                            }
                            break;
                        } else {
                            if (promise._isFollowing()) promise._followee().cancel();
                            child = promise;
                            promise = parent;
                        }
                    }
                };

                Promise.prototype._branchHasCancelled = function () {
                    this._branchesRemainingToCancel--;
                };

                Promise.prototype._enoughBranchesHaveCancelled = function () {
                    return this._branchesRemainingToCancel === undefined || this._branchesRemainingToCancel <= 0;
                };

                Promise.prototype._cancelBy = function (canceller) {
                    if (canceller === this) {
                        this._branchesRemainingToCancel = 0;
                        this._invokeOnCancel();
                        return true;
                    } else {
                        this._branchHasCancelled();
                        if (this._enoughBranchesHaveCancelled()) {
                            this._invokeOnCancel();
                            return true;
                        }
                    }
                    return false;
                };

                Promise.prototype._cancelBranched = function () {
                    if (this._enoughBranchesHaveCancelled()) {
                        this._cancel();
                    }
                };

                Promise.prototype._cancel = function () {
                    if (!this.isCancellable()) return;

                    this._setCancelled();
                    async.invoke(this._cancelPromises, this, undefined);
                };

                Promise.prototype._cancelPromises = function () {
                    if (this._length() > 0) this._settlePromises();
                };

                Promise.prototype._unsetOnCancel = function () {
                    this._onCancelField = undefined;
                };

                Promise.prototype.isCancellable = function () {
                    return this.isPending() && !this.isCancelled();
                };

                Promise.prototype._doInvokeOnCancel = function (onCancelCallback, internalOnly) {
                    if (util.isArray(onCancelCallback)) {
                        for (var i = 0; i < onCancelCallback.length; ++i) {
                            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                        }
                    } else if (onCancelCallback !== undefined) {
                        if (typeof onCancelCallback === 'function') {
                            if (!internalOnly) {
                                var e = tryCatch(onCancelCallback).call(this._boundValue());
                                if (e === errorObj) {
                                    this._attachExtraTrace(e.e);
                                    async.throwLater(e.e);
                                }
                            }
                        } else {
                            onCancelCallback._resultCancelled(this);
                        }
                    }
                };

                Promise.prototype._invokeOnCancel = function () {
                    var onCancelCallback = this._onCancel();
                    this._unsetOnCancel();
                    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                };

                Promise.prototype._invokeInternalOnCancel = function () {
                    if (this.isCancellable()) {
                        this._doInvokeOnCancel(this._onCancel(), true);
                        this._unsetOnCancel();
                    }
                };

                Promise.prototype._resultCancelled = function () {
                    this.cancel();
                };
            };
        }, { './util': 21 }],
        5: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (NEXT_FILTER) {
                var util = _dereq_('./util');
                var getKeys = _dereq_('./es5').keys;
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;

                function catchFilter(instances, cb, promise) {
                    return function (e) {
                        var boundTo = promise._boundValue();
                        predicateLoop: for (var i = 0; i < instances.length; ++i) {
                            var item = instances[i];

                            if (item === Error || item != null && item.prototype instanceof Error) {
                                if (e instanceof item) {
                                    return tryCatch(cb).call(boundTo, e);
                                }
                            } else if (typeof item === 'function') {
                                var matchesPredicate = tryCatch(item).call(boundTo, e);
                                if (matchesPredicate === errorObj) {
                                    return matchesPredicate;
                                } else if (matchesPredicate) {
                                    return tryCatch(cb).call(boundTo, e);
                                }
                            } else if (util.isObject(e)) {
                                var keys = getKeys(item);
                                for (var j = 0; j < keys.length; ++j) {
                                    var key = keys[j];
                                    if (item[key] != e[key]) {
                                        continue predicateLoop;
                                    }
                                }
                                return tryCatch(cb).call(boundTo, e);
                            }
                        }
                        return NEXT_FILTER;
                    };
                }

                return catchFilter;
            };
        }, { './es5': 10, './util': 21 }],
        6: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise) {
                var longStackTraces = false;
                var contextStack = [];

                Promise.prototype._promiseCreated = function () {};
                Promise.prototype._pushContext = function () {};
                Promise.prototype._popContext = function () {
                    return null;
                };
                Promise._peekContext = Promise.prototype._peekContext = function () {};

                function Context() {
                    this._trace = new Context.CapturedTrace(peekContext());
                }
                Context.prototype._pushContext = function () {
                    if (this._trace !== undefined) {
                        this._trace._promiseCreated = null;
                        contextStack.push(this._trace);
                    }
                };

                Context.prototype._popContext = function () {
                    if (this._trace !== undefined) {
                        var trace = contextStack.pop();
                        var ret = trace._promiseCreated;
                        trace._promiseCreated = null;
                        return ret;
                    }
                    return null;
                };

                function createContext() {
                    if (longStackTraces) return new Context();
                }

                function peekContext() {
                    var lastIndex = contextStack.length - 1;
                    if (lastIndex >= 0) {
                        return contextStack[lastIndex];
                    }
                    return undefined;
                }
                Context.CapturedTrace = null;
                Context.create = createContext;
                Context.deactivateLongStackTraces = function () {};
                Context.activateLongStackTraces = function () {
                    var Promise_pushContext = Promise.prototype._pushContext;
                    var Promise_popContext = Promise.prototype._popContext;
                    var Promise_PeekContext = Promise._peekContext;
                    var Promise_peekContext = Promise.prototype._peekContext;
                    var Promise_promiseCreated = Promise.prototype._promiseCreated;
                    Context.deactivateLongStackTraces = function () {
                        Promise.prototype._pushContext = Promise_pushContext;
                        Promise.prototype._popContext = Promise_popContext;
                        Promise._peekContext = Promise_PeekContext;
                        Promise.prototype._peekContext = Promise_peekContext;
                        Promise.prototype._promiseCreated = Promise_promiseCreated;
                        longStackTraces = false;
                    };
                    longStackTraces = true;
                    Promise.prototype._pushContext = Context.prototype._pushContext;
                    Promise.prototype._popContext = Context.prototype._popContext;
                    Promise._peekContext = Promise.prototype._peekContext = peekContext;
                    Promise.prototype._promiseCreated = function () {
                        var ctx = this._peekContext();
                        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
                    };
                };
                return Context;
            };
        }, {}],
        7: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, Context) {
                var getDomain = Promise._getDomain;
                var async = Promise._async;
                var Warning = _dereq_('./errors').Warning;
                var util = _dereq_('./util');
                var canAttachTrace = util.canAttachTrace;
                var unhandledRejectionHandled = void 0;
                var possiblyUnhandledRejection = void 0;
                var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                var stackFramePattern = null;
                var formatStack = null;
                var indentStackFrames = false;
                var printWarning = void 0;
                var debugging = !!(util.env('BLUEBIRD_DEBUG') != 0 && (true || util.env('BLUEBIRD_DEBUG') || util.env('NODE_ENV') === 'development'));

                var warnings = !!(util.env('BLUEBIRD_WARNINGS') != 0 && (debugging || util.env('BLUEBIRD_WARNINGS')));

                var longStackTraces = !!(util.env('BLUEBIRD_LONG_STACK_TRACES') != 0 && (debugging || util.env('BLUEBIRD_LONG_STACK_TRACES')));

                var wForgottenReturn = util.env('BLUEBIRD_W_FORGOTTEN_RETURN') != 0 && (warnings || !!util.env('BLUEBIRD_W_FORGOTTEN_RETURN'));

                Promise.prototype.suppressUnhandledRejections = function () {
                    var target = this._target();
                    target._bitField = target._bitField & ~1048576 | 524288;
                };

                Promise.prototype._ensurePossibleRejectionHandled = function () {
                    if ((this._bitField & 524288) !== 0) return;
                    this._setRejectionIsUnhandled();
                    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
                };

                Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
                    fireRejectionEvent('rejectionHandled', unhandledRejectionHandled, undefined, this);
                };

                Promise.prototype._setReturnedNonUndefined = function () {
                    this._bitField = this._bitField | 268435456;
                };

                Promise.prototype._returnedNonUndefined = function () {
                    return (this._bitField & 268435456) !== 0;
                };

                Promise.prototype._notifyUnhandledRejection = function () {
                    if (this._isRejectionUnhandled()) {
                        var reason = this._settledValue();
                        this._setUnhandledRejectionIsNotified();
                        fireRejectionEvent('unhandledRejection', possiblyUnhandledRejection, reason, this);
                    }
                };

                Promise.prototype._setUnhandledRejectionIsNotified = function () {
                    this._bitField = this._bitField | 262144;
                };

                Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
                    this._bitField = this._bitField & ~262144;
                };

                Promise.prototype._isUnhandledRejectionNotified = function () {
                    return (this._bitField & 262144) > 0;
                };

                Promise.prototype._setRejectionIsUnhandled = function () {
                    this._bitField = this._bitField | 1048576;
                };

                Promise.prototype._unsetRejectionIsUnhandled = function () {
                    this._bitField = this._bitField & ~1048576;
                    if (this._isUnhandledRejectionNotified()) {
                        this._unsetUnhandledRejectionIsNotified();
                        this._notifyUnhandledRejectionIsHandled();
                    }
                };

                Promise.prototype._isRejectionUnhandled = function () {
                    return (this._bitField & 1048576) > 0;
                };

                Promise.prototype._warn = function (message, shouldUseOwnTrace, promise) {
                    return warn(message, shouldUseOwnTrace, promise || this);
                };

                Promise.onPossiblyUnhandledRejection = function (fn) {
                    var domain = getDomain();
                    possiblyUnhandledRejection = typeof fn === 'function' ? domain === null ? fn : domain.bind(fn) : undefined;
                };

                Promise.onUnhandledRejectionHandled = function (fn) {
                    var domain = getDomain();
                    unhandledRejectionHandled = typeof fn === 'function' ? domain === null ? fn : domain.bind(fn) : undefined;
                };

                var disableLongStackTraces = function disableLongStackTraces() {};
                Promise.longStackTraces = function () {
                    if (async.haveItemsQueued() && !config.longStackTraces) {
                        throw new Error('cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n');
                    }
                    if (!config.longStackTraces && longStackTracesIsSupported()) {
                        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                        config.longStackTraces = true;
                        disableLongStackTraces = function disableLongStackTraces() {
                            if (async.haveItemsQueued() && !config.longStackTraces) {
                                throw new Error('cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n');
                            }
                            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                            Context.deactivateLongStackTraces();
                            async.enableTrampoline();
                            config.longStackTraces = false;
                        };
                        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                        Context.activateLongStackTraces();
                        async.disableTrampolineIfNecessary();
                    }
                };

                Promise.hasLongStackTraces = function () {
                    return config.longStackTraces && longStackTracesIsSupported();
                };

                var fireDomEvent = function () {
                    try {
                        var event = document.createEvent('CustomEvent');
                        event.initCustomEvent('testingtheevent', false, true, {});
                        util.global.dispatchEvent(event);
                        return function (name, event) {
                            var domEvent = document.createEvent('CustomEvent');
                            domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
                            return !util.global.dispatchEvent(domEvent);
                        };
                    } catch (e) {}
                    return function () {
                        return false;
                    };
                }();

                var fireGlobalEvent = function () {
                    if (util.isNode) {
                        return function () {
                            return process.emit.apply(process, arguments);
                        };
                    } else {
                        if (!util.global) {
                            return function () {
                                return false;
                            };
                        }
                        return function (name) {
                            var methodName = 'on' + name.toLowerCase();
                            var method = util.global[methodName];
                            if (!method) return false;
                            method.apply(util.global, [].slice.call(arguments, 1));
                            return true;
                        };
                    }
                }();

                function generatePromiseLifecycleEventObject(name, promise) {
                    return { promise: promise };
                }

                var eventToObjectGenerator = {
                    promiseCreated: generatePromiseLifecycleEventObject,
                    promiseFulfilled: generatePromiseLifecycleEventObject,
                    promiseRejected: generatePromiseLifecycleEventObject,
                    promiseResolved: generatePromiseLifecycleEventObject,
                    promiseCancelled: generatePromiseLifecycleEventObject,
                    promiseChained: function promiseChained(name, promise, child) {
                        return { promise: promise, child: child };
                    },
                    warning: function warning(name, _warning) {
                        return { warning: _warning };
                    },
                    unhandledRejection: function unhandledRejection(name, reason, promise) {
                        return { reason: reason, promise: promise };
                    },
                    rejectionHandled: generatePromiseLifecycleEventObject
                };

                var activeFireEvent = function activeFireEvent(name) {
                    var globalEventFired = false;
                    try {
                        globalEventFired = fireGlobalEvent.apply(null, arguments);
                    } catch (e) {
                        async.throwLater(e);
                        globalEventFired = true;
                    }

                    var domEventFired = false;
                    try {
                        domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                    } catch (e) {
                        async.throwLater(e);
                        domEventFired = true;
                    }

                    return domEventFired || globalEventFired;
                };

                Promise.config = function (opts) {
                    opts = Object(opts);
                    if ('longStackTraces' in opts) {
                        if (opts.longStackTraces) {
                            Promise.longStackTraces();
                        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
                            disableLongStackTraces();
                        }
                    }
                    if ('warnings' in opts) {
                        var warningsOption = opts.warnings;
                        config.warnings = !!warningsOption;
                        wForgottenReturn = config.warnings;

                        if (util.isObject(warningsOption)) {
                            if ('wForgottenReturn' in warningsOption) {
                                wForgottenReturn = !!warningsOption.wForgottenReturn;
                            }
                        }
                    }
                    if ('cancellation' in opts && opts.cancellation && !config.cancellation) {
                        if (async.haveItemsQueued()) {
                            throw new Error('cannot enable cancellation after promises are in use');
                        }
                        Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                        Promise.prototype._propagateFrom = cancellationPropagateFrom;
                        Promise.prototype._onCancel = cancellationOnCancel;
                        Promise.prototype._setOnCancel = cancellationSetOnCancel;
                        Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                        Promise.prototype._execute = cancellationExecute;
                        _propagateFromFunction = cancellationPropagateFrom;
                        config.cancellation = true;
                    }
                    if ('monitoring' in opts) {
                        if (opts.monitoring && !config.monitoring) {
                            config.monitoring = true;
                            Promise.prototype._fireEvent = activeFireEvent;
                        } else if (!opts.monitoring && config.monitoring) {
                            config.monitoring = false;
                            Promise.prototype._fireEvent = defaultFireEvent;
                        }
                    }
                };

                function defaultFireEvent() {
                    return false;
                }

                Promise.prototype._fireEvent = defaultFireEvent;
                Promise.prototype._execute = function (executor, resolve, reject) {
                    try {
                        executor(resolve, reject);
                    } catch (e) {
                        return e;
                    }
                };
                Promise.prototype._onCancel = function () {};
                Promise.prototype._setOnCancel = function (handler) {};
                Promise.prototype._attachCancellationCallback = function (onCancel) {};
                Promise.prototype._captureStackTrace = function () {};
                Promise.prototype._attachExtraTrace = function () {};
                Promise.prototype._clearCancellationData = function () {};
                Promise.prototype._propagateFrom = function (parent, flags) {};

                function cancellationExecute(executor, resolve, reject) {
                    var promise = this;
                    try {
                        executor(resolve, reject, function (onCancel) {
                            if (typeof onCancel !== 'function') {
                                throw new TypeError('onCancel must be a function, got: ' + util.toString(onCancel));
                            }
                            promise._attachCancellationCallback(onCancel);
                        });
                    } catch (e) {
                        return e;
                    }
                }

                function cancellationAttachCancellationCallback(onCancel) {
                    if (!this.isCancellable()) return this;

                    var previousOnCancel = this._onCancel();
                    if (previousOnCancel !== undefined) {
                        if (util.isArray(previousOnCancel)) {
                            previousOnCancel.push(onCancel);
                        } else {
                            this._setOnCancel([previousOnCancel, onCancel]);
                        }
                    } else {
                        this._setOnCancel(onCancel);
                    }
                }

                function cancellationOnCancel() {
                    return this._onCancelField;
                }

                function cancellationSetOnCancel(onCancel) {
                    this._onCancelField = onCancel;
                }

                function cancellationClearCancellationData() {
                    this._cancellationParent = undefined;
                    this._onCancelField = undefined;
                }

                function cancellationPropagateFrom(parent, flags) {
                    if ((flags & 1) !== 0) {
                        this._cancellationParent = parent;
                        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                        if (branchesRemainingToCancel === undefined) {
                            branchesRemainingToCancel = 0;
                        }
                        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                    }
                    if ((flags & 2) !== 0 && parent._isBound()) {
                        this._setBoundTo(parent._boundTo);
                    }
                }

                function bindingPropagateFrom(parent, flags) {
                    if ((flags & 2) !== 0 && parent._isBound()) {
                        this._setBoundTo(parent._boundTo);
                    }
                }
                var _propagateFromFunction = bindingPropagateFrom;

                function _boundValueFunction() {
                    var ret = this._boundTo;
                    if (ret !== undefined) {
                        if (ret instanceof Promise) {
                            if (ret.isFulfilled()) {
                                return ret.value();
                            } else {
                                return undefined;
                            }
                        }
                    }
                    return ret;
                }

                function longStackTracesCaptureStackTrace() {
                    this._trace = new CapturedTrace(this._peekContext());
                }

                function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                    if (canAttachTrace(error)) {
                        var trace = this._trace;
                        if (trace !== undefined) {
                            if (ignoreSelf) trace = trace._parent;
                        }
                        if (trace !== undefined) {
                            trace.attachExtraTrace(error);
                        } else if (!error.__stackCleaned__) {
                            var parsed = parseStackAndMessage(error);
                            util.notEnumerableProp(error, 'stack', parsed.message + '\n' + parsed.stack.join('\n'));
                            util.notEnumerableProp(error, '__stackCleaned__', true);
                        }
                    }
                }

                function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                    if (returnValue === undefined && promiseCreated !== null && wForgottenReturn) {
                        if (parent !== undefined && parent._returnedNonUndefined()) return;
                        var bitField = promise._bitField;
                        if ((bitField & 65535) === 0) return;

                        if (name) name = name + ' ';
                        var msg = 'a promise was created in a ' + name + 'handler but was not returned from it';
                        promise._warn(msg, true, promiseCreated);
                    }
                }

                function deprecated(name, replacement) {
                    var message = name + ' is deprecated and will be removed in a future version.';
                    if (replacement) message += ' Use ' + replacement + ' instead.';
                    return warn(message);
                }

                function warn(message, shouldUseOwnTrace, promise) {
                    if (!config.warnings) return;
                    var warning = new Warning(message);
                    var ctx = void 0;
                    if (shouldUseOwnTrace) {
                        promise._attachExtraTrace(warning);
                    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
                        ctx.attachExtraTrace(warning);
                    } else {
                        var parsed = parseStackAndMessage(warning);
                        warning.stack = parsed.message + '\n' + parsed.stack.join('\n');
                    }

                    if (!activeFireEvent('warning', warning)) {
                        formatAndLogError(warning, '', true);
                    }
                }

                function reconstructStack(message, stacks) {
                    for (var i = 0; i < stacks.length - 1; ++i) {
                        stacks[i].push('From previous event:');
                        stacks[i] = stacks[i].join('\n');
                    }
                    if (i < stacks.length) {
                        stacks[i] = stacks[i].join('\n');
                    }
                    return message + '\n' + stacks.join('\n');
                }

                function removeDuplicateOrEmptyJumps(stacks) {
                    for (var i = 0; i < stacks.length; ++i) {
                        if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                            stacks.splice(i, 1);
                            i--;
                        }
                    }
                }

                function removeCommonRoots(stacks) {
                    var current = stacks[0];
                    for (var i = 1; i < stacks.length; ++i) {
                        var prev = stacks[i];
                        var currentLastIndex = current.length - 1;
                        var currentLastLine = current[currentLastIndex];
                        var commonRootMeetPoint = -1;

                        for (var j = prev.length - 1; j >= 0; --j) {
                            if (prev[j] === currentLastLine) {
                                commonRootMeetPoint = j;
                                break;
                            }
                        }

                        for (var j = commonRootMeetPoint; j >= 0; --j) {
                            var line = prev[j];
                            if (current[currentLastIndex] === line) {
                                current.pop();
                                currentLastIndex--;
                            } else {
                                break;
                            }
                        }
                        current = prev;
                    }
                }

                function cleanStack(stack) {
                    var ret = [];
                    for (var i = 0; i < stack.length; ++i) {
                        var line = stack[i];
                        var isTraceLine = '    (No stack trace)' === line || stackFramePattern.test(line);
                        var isInternalFrame = isTraceLine && shouldIgnore(line);
                        if (isTraceLine && !isInternalFrame) {
                            if (indentStackFrames && line.charAt(0) !== ' ') {
                                line = '    ' + line;
                            }
                            ret.push(line);
                        }
                    }
                    return ret;
                }

                function stackFramesAsArray(error) {
                    var stack = error.stack.replace(/\s+$/g, '').split('\n');
                    for (var i = 0; i < stack.length; ++i) {
                        var line = stack[i];
                        if ('    (No stack trace)' === line || stackFramePattern.test(line)) {
                            break;
                        }
                    }
                    if (i > 0) {
                        stack = stack.slice(i);
                    }
                    return stack;
                }

                function parseStackAndMessage(error) {
                    var stack = error.stack;
                    var message = error.toString();
                    stack = typeof stack === 'string' && stack.length > 0 ? stackFramesAsArray(error) : ['    (No stack trace)'];
                    return {
                        message: message,
                        stack: cleanStack(stack)
                    };
                }

                function formatAndLogError(error, title, isSoft) {
                    if (typeof console !== 'undefined') {
                        var message = void 0;
                        if (util.isObject(error)) {
                            var stack = error.stack;
                            message = title + formatStack(stack, error);
                        } else {
                            message = title + String(error);
                        }
                        if (typeof printWarning === 'function') {
                            printWarning(message, isSoft);
                        } else if (typeof console.log === 'function' || _typeof(console.log) === 'object') {
                            console.log(message);
                        }
                    }
                }

                function fireRejectionEvent(name, localHandler, reason, promise) {
                    var localEventFired = false;
                    try {
                        if (typeof localHandler === 'function') {
                            localEventFired = true;
                            if (name === 'rejectionHandled') {
                                localHandler(promise);
                            } else {
                                localHandler(reason, promise);
                            }
                        }
                    } catch (e) {
                        async.throwLater(e);
                    }

                    if (name === 'unhandledRejection') {
                        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
                            formatAndLogError(reason, 'Unhandled rejection ');
                        }
                    } else {
                        activeFireEvent(name, promise);
                    }
                }

                function formatNonError(obj) {
                    var str = void 0;
                    if (typeof obj === 'function') {
                        str = '[function ' + (obj.name || 'anonymous') + ']';
                    } else {
                        str = obj && typeof obj.toString === 'function' ? obj.toString() : util.toString(obj);
                        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
                        if (ruselessToString.test(str)) {
                            try {
                                var newStr = JSON.stringify(obj);
                                str = newStr;
                            } catch (e) {}
                        }
                        if (str.length === 0) {
                            str = '(empty array)';
                        }
                    }
                    return '(<' + snip(str) + '>, no stack trace)';
                }

                function snip(str) {
                    var maxChars = 41;
                    if (str.length < maxChars) {
                        return str;
                    }
                    return str.substr(0, maxChars - 3) + '...';
                }

                function longStackTracesIsSupported() {
                    return typeof captureStackTrace === 'function';
                }

                var shouldIgnore = function shouldIgnore() {
                    return false;
                };
                var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                function parseLineInfo(line) {
                    var matches = line.match(parseLineInfoRegex);
                    if (matches) {
                        return {
                            fileName: matches[1],
                            line: parseInt(matches[2], 10)
                        };
                    }
                }

                function setBounds(firstLineError, lastLineError) {
                    if (!longStackTracesIsSupported()) return;
                    var firstStackLines = firstLineError.stack.split('\n');
                    var lastStackLines = lastLineError.stack.split('\n');
                    var firstIndex = -1;
                    var lastIndex = -1;
                    var firstFileName = void 0;
                    var lastFileName = void 0;
                    for (var i = 0; i < firstStackLines.length; ++i) {
                        var result = parseLineInfo(firstStackLines[i]);
                        if (result) {
                            firstFileName = result.fileName;
                            firstIndex = result.line;
                            break;
                        }
                    }
                    for (var i = 0; i < lastStackLines.length; ++i) {
                        var result = parseLineInfo(lastStackLines[i]);
                        if (result) {
                            lastFileName = result.fileName;
                            lastIndex = result.line;
                            break;
                        }
                    }
                    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
                        return;
                    }

                    shouldIgnore = function shouldIgnore(line) {
                        if (bluebirdFramePattern.test(line)) return true;
                        var info = parseLineInfo(line);
                        if (info) {
                            if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) {
                                return true;
                            }
                        }
                        return false;
                    };
                }

                function CapturedTrace(parent) {
                    this._parent = parent;
                    this._promisesCreated = 0;
                    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
                    captureStackTrace(this, CapturedTrace);
                    if (length > 32) this.uncycle();
                }
                util.inherits(CapturedTrace, Error);
                Context.CapturedTrace = CapturedTrace;

                CapturedTrace.prototype.uncycle = function () {
                    var length = this._length;
                    if (length < 2) return;
                    var nodes = [];
                    var stackToIndex = {};

                    for (var i = 0, node = this; node !== undefined; ++i) {
                        nodes.push(node);
                        node = node._parent;
                    }
                    length = this._length = i;
                    for (var i = length - 1; i >= 0; --i) {
                        var stack = nodes[i].stack;
                        if (stackToIndex[stack] === undefined) {
                            stackToIndex[stack] = i;
                        }
                    }
                    for (var i = 0; i < length; ++i) {
                        var currentStack = nodes[i].stack;
                        var index = stackToIndex[currentStack];
                        if (index !== undefined && index !== i) {
                            if (index > 0) {
                                nodes[index - 1]._parent = undefined;
                                nodes[index - 1]._length = 1;
                            }
                            nodes[i]._parent = undefined;
                            nodes[i]._length = 1;
                            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                            if (index < length - 1) {
                                cycleEdgeNode._parent = nodes[index + 1];
                                cycleEdgeNode._parent.uncycle();
                                cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                            } else {
                                cycleEdgeNode._parent = undefined;
                                cycleEdgeNode._length = 1;
                            }
                            var currentChildLength = cycleEdgeNode._length + 1;
                            for (var j = i - 2; j >= 0; --j) {
                                nodes[j]._length = currentChildLength;
                                currentChildLength++;
                            }
                            return;
                        }
                    }
                };

                CapturedTrace.prototype.attachExtraTrace = function (error) {
                    if (error.__stackCleaned__) return;
                    this.uncycle();
                    var parsed = parseStackAndMessage(error);
                    var message = parsed.message;
                    var stacks = [parsed.stack];

                    var trace = this;
                    while (trace !== undefined) {
                        stacks.push(cleanStack(trace.stack.split('\n')));
                        trace = trace._parent;
                    }
                    removeCommonRoots(stacks);
                    removeDuplicateOrEmptyJumps(stacks);
                    util.notEnumerableProp(error, 'stack', reconstructStack(message, stacks));
                    util.notEnumerableProp(error, '__stackCleaned__', true);
                };

                var captureStackTrace = function stackDetection() {
                    var v8stackFramePattern = /^\s*at\s*/;
                    var v8stackFormatter = function v8stackFormatter(stack, error) {
                        if (typeof stack === 'string') return stack;

                        if (error.name !== undefined && error.message !== undefined) {
                            return error.toString();
                        }
                        return formatNonError(error);
                    };

                    if (typeof Error.stackTraceLimit === 'number' && typeof Error.captureStackTrace === 'function') {
                        Error.stackTraceLimit += 6;
                        stackFramePattern = v8stackFramePattern;
                        formatStack = v8stackFormatter;
                        var _captureStackTrace = Error.captureStackTrace;

                        shouldIgnore = function shouldIgnore(line) {
                            return bluebirdFramePattern.test(line);
                        };
                        return function (receiver, ignoreUntil) {
                            Error.stackTraceLimit += 6;
                            _captureStackTrace(receiver, ignoreUntil);
                            Error.stackTraceLimit -= 6;
                        };
                    }
                    var err = new Error();

                    if (typeof err.stack === 'string' && err.stack.split('\n')[0].indexOf('stackDetection@') >= 0) {
                        stackFramePattern = /@/;
                        formatStack = v8stackFormatter;
                        indentStackFrames = true;
                        return function captureStackTrace(o) {
                            o.stack = new Error().stack;
                        };
                    }

                    var hasStackAfterThrow = void 0;
                    try {
                        throw new Error();
                    } catch (e) {
                        hasStackAfterThrow = 'stack' in e;
                    }
                    if (!('stack' in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === 'number') {
                        stackFramePattern = v8stackFramePattern;
                        formatStack = v8stackFormatter;
                        return function captureStackTrace(o) {
                            Error.stackTraceLimit += 6;
                            try {
                                throw new Error();
                            } catch (e) {
                                o.stack = e.stack;
                            }
                            Error.stackTraceLimit -= 6;
                        };
                    }

                    formatStack = function formatStack(stack, error) {
                        if (typeof stack === 'string') return stack;

                        if (((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object' || typeof error === 'function') && error.name !== undefined && error.message !== undefined) {
                            return error.toString();
                        }
                        return formatNonError(error);
                    };

                    return null;
                }([]);

                if (typeof console !== 'undefined' && typeof console.warn !== 'undefined') {
                    printWarning = function printWarning(message) {
                        console.warn(message);
                    };
                    if (util.isNode && process.stderr.isTTY) {
                        printWarning = function printWarning(message, isSoft) {
                            var color = isSoft ? '\x1B[33m' : '\x1B[31m';
                            console.warn(color + message + '\x1B[0m\n');
                        };
                    } else if (!util.isNode && typeof new Error().stack === 'string') {
                        printWarning = function printWarning(message, isSoft) {
                            console.warn('%c' + message, isSoft ? 'color: darkorange' : 'color: red');
                        };
                    }
                }

                var config = {
                    warnings: warnings,
                    longStackTraces: false,
                    cancellation: false,
                    monitoring: false
                };

                if (longStackTraces) Promise.longStackTraces();

                return {
                    longStackTraces: function longStackTraces() {
                        return config.longStackTraces;
                    },
                    warnings: function warnings() {
                        return config.warnings;
                    },
                    cancellation: function cancellation() {
                        return config.cancellation;
                    },
                    monitoring: function monitoring() {
                        return config.monitoring;
                    },
                    propagateFromFunction: function propagateFromFunction() {
                        return _propagateFromFunction;
                    },
                    boundValueFunction: function boundValueFunction() {
                        return _boundValueFunction;
                    },
                    checkForgottenReturns: checkForgottenReturns,
                    setBounds: setBounds,
                    warn: warn,
                    deprecated: deprecated,
                    CapturedTrace: CapturedTrace,
                    fireDomEvent: fireDomEvent,
                    fireGlobalEvent: fireGlobalEvent
                };
            };
        }, { './errors': 9, './util': 21 }],
        8: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise) {
                function returner() {
                    return this.value;
                }
                function thrower() {
                    throw this.reason;
                }

                Promise.prototype['return'] = Promise.prototype.thenReturn = function (value) {
                    if (value instanceof Promise) value.suppressUnhandledRejections();
                    return this._then(returner, undefined, undefined, { value: value }, undefined);
                };

                Promise.prototype['throw'] = Promise.prototype.thenThrow = function (reason) {
                    return this._then(thrower, undefined, undefined, { reason: reason }, undefined);
                };

                Promise.prototype.catchThrow = function (reason) {
                    if (arguments.length <= 1) {
                        return this._then(undefined, thrower, undefined, { reason: reason }, undefined);
                    } else {
                        var _reason = arguments[1];
                        var handler = function handler() {
                            throw _reason;
                        };
                        return this.caught(reason, handler);
                    }
                };

                Promise.prototype.catchReturn = function (value) {
                    if (arguments.length <= 1) {
                        if (value instanceof Promise) value.suppressUnhandledRejections();
                        return this._then(undefined, returner, undefined, { value: value }, undefined);
                    } else {
                        var _value = arguments[1];
                        if (_value instanceof Promise) _value.suppressUnhandledRejections();
                        var handler = function handler() {
                            return _value;
                        };
                        return this.caught(value, handler);
                    }
                };
            };
        }, {}],
        9: [function (_dereq_, module, exports) {
            'use strict';

            var es5 = _dereq_('./es5');
            var Objectfreeze = es5.freeze;
            var util = _dereq_('./util');
            var inherits = util.inherits;
            var notEnumerableProp = util.notEnumerableProp;

            function subError(nameProperty, defaultMessage) {
                function SubError(message) {
                    if (!(this instanceof SubError)) return new SubError(message);
                    notEnumerableProp(this, 'message', typeof message === 'string' ? message : defaultMessage);
                    notEnumerableProp(this, 'name', nameProperty);
                    if (Error.captureStackTrace) {
                        Error.captureStackTrace(this, this.constructor);
                    } else {
                        Error.call(this);
                    }
                }
                inherits(SubError, Error);
                return SubError;
            }

            var _TypeError = void 0,
                _RangeError = void 0;
            var Warning = subError('Warning', 'warning');
            var CancellationError = subError('CancellationError', 'cancellation error');
            var TimeoutError = subError('TimeoutError', 'timeout error');
            var AggregateError = subError('AggregateError', 'aggregate error');
            try {
                _TypeError = TypeError;
                _RangeError = RangeError;
            } catch (e) {
                _TypeError = subError('TypeError', 'type error');
                _RangeError = subError('RangeError', 'range error');
            }

            var methods = ('join pop push shift unshift slice filter forEach some ' + 'every map indexOf lastIndexOf reduce reduceRight sort reverse').split(' ');

            for (var i = 0; i < methods.length; ++i) {
                if (typeof Array.prototype[methods[i]] === 'function') {
                    AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                }
            }

            es5.defineProperty(AggregateError.prototype, 'length', {
                value: 0,
                configurable: false,
                writable: true,
                enumerable: true
            });
            AggregateError.prototype['isOperational'] = true;
            var level = 0;
            AggregateError.prototype.toString = function () {
                var indent = Array(level * 4 + 1).join(' ');
                var ret = '\n' + indent + 'AggregateError of:' + '\n';
                level++;
                indent = Array(level * 4 + 1).join(' ');
                for (var _i = 0; _i < this.length; ++_i) {
                    var str = this[_i] === this ? '[Circular AggregateError]' : this[_i] + '';
                    var lines = str.split('\n');
                    for (var j = 0; j < lines.length; ++j) {
                        lines[j] = indent + lines[j];
                    }
                    str = lines.join('\n');
                    ret += str + '\n';
                }
                level--;
                return ret;
            };

            function OperationalError(message) {
                if (!(this instanceof OperationalError)) return new OperationalError(message);
                notEnumerableProp(this, 'name', 'OperationalError');
                notEnumerableProp(this, 'message', message);
                this.cause = message;
                this['isOperational'] = true;

                if (message instanceof Error) {
                    notEnumerableProp(this, 'message', message.message);
                    notEnumerableProp(this, 'stack', message.stack);
                } else if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, this.constructor);
                }
            }
            inherits(OperationalError, Error);

            var errorTypes = Error['__BluebirdErrorTypes__'];
            if (!errorTypes) {
                errorTypes = Objectfreeze({
                    CancellationError: CancellationError,
                    TimeoutError: TimeoutError,
                    OperationalError: OperationalError,
                    RejectionError: OperationalError,
                    AggregateError: AggregateError
                });
                es5.defineProperty(Error, '__BluebirdErrorTypes__', {
                    value: errorTypes,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            }

            module.exports = {
                Error: Error,
                TypeError: _TypeError,
                RangeError: _RangeError,
                CancellationError: errorTypes.CancellationError,
                OperationalError: errorTypes.OperationalError,
                TimeoutError: errorTypes.TimeoutError,
                AggregateError: errorTypes.AggregateError,
                Warning: Warning
            };
        }, { './es5': 10, './util': 21 }],
        10: [function (_dereq_, module, exports) {
            var isES5 = function () {
                'use strict';

                return this === undefined;
            }();

            if (isES5) {
                module.exports = {
                    freeze: Object.freeze,
                    defineProperty: Object.defineProperty,
                    getDescriptor: Object.getOwnPropertyDescriptor,
                    keys: Object.keys,
                    names: Object.getOwnPropertyNames,
                    getPrototypeOf: Object.getPrototypeOf,
                    isArray: Array.isArray,
                    isES5: isES5,
                    propertyIsWritable: function propertyIsWritable(obj, prop) {
                        var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                        return !!(!descriptor || descriptor.writable || descriptor.set);
                    }
                };
            } else {
                var has = {}.hasOwnProperty;
                var str = {}.toString;
                var proto = {}.constructor.prototype;

                var ObjectKeys = function ObjectKeys(o) {
                    var ret = [];
                    for (var key in o) {
                        if (has.call(o, key)) {
                            ret.push(key);
                        }
                    }
                    return ret;
                };

                var ObjectGetDescriptor = function ObjectGetDescriptor(o, key) {
                    return { value: o[key] };
                };

                var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
                    o[key] = desc.value;
                    return o;
                };

                var ObjectFreeze = function ObjectFreeze(obj) {
                    return obj;
                };

                var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
                    try {
                        return Object(obj).constructor.prototype;
                    } catch (e) {
                        return proto;
                    }
                };

                var ArrayIsArray = function ArrayIsArray(obj) {
                    try {
                        return str.call(obj) === '[object Array]';
                    } catch (e) {
                        return false;
                    }
                };

                module.exports = {
                    isArray: ArrayIsArray,
                    keys: ObjectKeys,
                    names: ObjectKeys,
                    defineProperty: ObjectDefineProperty,
                    getDescriptor: ObjectGetDescriptor,
                    freeze: ObjectFreeze,
                    getPrototypeOf: ObjectGetPrototypeOf,
                    isES5: isES5,
                    propertyIsWritable: function propertyIsWritable() {
                        return true;
                    }
                };
            }
        }, {}],
        11: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, tryConvertToPromise) {
                var util = _dereq_('./util');
                var CancellationError = Promise.CancellationError;
                var errorObj = util.errorObj;

                function PassThroughHandlerContext(promise, type, handler) {
                    this.promise = promise;
                    this.type = type;
                    this.handler = handler;
                    this.called = false;
                    this.cancelPromise = null;
                }

                PassThroughHandlerContext.prototype.isFinallyHandler = function () {
                    return this.type === 0;
                };

                function FinallyHandlerCancelReaction(finallyHandler) {
                    this.finallyHandler = finallyHandler;
                }

                FinallyHandlerCancelReaction.prototype._resultCancelled = function () {
                    checkCancel(this.finallyHandler);
                };

                function checkCancel(ctx, reason) {
                    if (ctx.cancelPromise != null) {
                        if (arguments.length > 1) {
                            ctx.cancelPromise._reject(reason);
                        } else {
                            ctx.cancelPromise._cancel();
                        }
                        ctx.cancelPromise = null;
                        return true;
                    }
                    return false;
                }

                function succeed() {
                    return finallyHandler.call(this, this.promise._target()._settledValue());
                }
                function fail(reason) {
                    if (checkCancel(this, reason)) return;
                    errorObj.e = reason;
                    return errorObj;
                }
                function finallyHandler(reasonOrValue) {
                    var promise = this.promise;
                    var handler = this.handler;

                    if (!this.called) {
                        this.called = true;
                        var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                        if (ret !== undefined) {
                            promise._setReturnedNonUndefined();
                            var maybePromise = tryConvertToPromise(ret, promise);
                            if (maybePromise instanceof Promise) {
                                if (this.cancelPromise != null) {
                                    if (maybePromise.isCancelled()) {
                                        var reason = new CancellationError('late cancellation observer');
                                        promise._attachExtraTrace(reason);
                                        errorObj.e = reason;
                                        return errorObj;
                                    } else if (maybePromise.isPending()) {
                                        maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                    }
                                }
                                return maybePromise._then(succeed, fail, undefined, this, undefined);
                            }
                        }
                    }

                    if (promise.isRejected()) {
                        checkCancel(this);
                        errorObj.e = reasonOrValue;
                        return errorObj;
                    } else {
                        checkCancel(this);
                        return reasonOrValue;
                    }
                }

                Promise.prototype._passThrough = function (handler, type, success, fail) {
                    if (typeof handler !== 'function') return this.then();
                    return this._then(success, fail, undefined, new PassThroughHandlerContext(this, type, handler), undefined);
                };

                Promise.prototype.lastly = Promise.prototype['finally'] = function (handler) {
                    return this._passThrough(handler, 0, finallyHandler, finallyHandler);
                };

                Promise.prototype.tap = function (handler) {
                    return this._passThrough(handler, 1, finallyHandler);
                };

                return PassThroughHandlerContext;
            };
        }, { './util': 21 }],
        12: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
                var util = _dereq_('./util');
                var canEvaluate = util.canEvaluate;
                var tryCatch = util.tryCatch;
                var errorObj = util.errorObj;
                var reject = void 0;

                if (!true) {
                    if (canEvaluate) {
                        var thenCallback = function thenCallback(i) {
                            return new Function('value', 'holder', "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
                        };

                        var promiseSetter = function promiseSetter(i) {
                            return new Function('promise', 'holder', "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
                        };

                        var generateHolderClass = function generateHolderClass(total) {
                            var props = new Array(total);
                            for (var i = 0; i < props.length; ++i) {
                                props[i] = 'this.p' + (i + 1);
                            }
                            var assignment = props.join(' = ') + ' = null;';
                            var cancellationCode = 'var promise;\n' + props.map(function (prop) {
                                return '                                                         \n\
                promise = ' + prop + ';                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ';
                            }).join('\n');
                            var passedArguments = props.join(', ');
                            var name = 'Holder$' + total;

                            var code = "return function(tryCatch, errorObj, Promise) {           \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.now = 0;                                                \n\
            }                                                                \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    promise._pushContext();                                  \n\
                    var callback = this.fn;                                  \n\
                    var ret = tryCatch(callback)([ThePassedArguments]);      \n\
                    promise._popContext();                                   \n\
                    if (ret === errorObj) {                                  \n\
                        promise._rejectCallback(ret.e, false);               \n\
                    } else {                                                 \n\
                        promise._resolveCallback(ret);                       \n\
                    }                                                        \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise);                                      \n\
        ";

                            code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);

                            return new Function('tryCatch', 'errorObj', 'Promise', code)(tryCatch, errorObj, Promise);
                        };

                        var holderClasses = [];
                        var thenCallbacks = [];
                        var promiseSetters = [];

                        for (var i = 0; i < 8; ++i) {
                            holderClasses.push(generateHolderClass(i + 1));
                            thenCallbacks.push(thenCallback(i + 1));
                            promiseSetters.push(promiseSetter(i + 1));
                        }

                        reject = function reject(reason) {
                            this._reject(reason);
                        };
                    }
                }

                Promise.join = function () {
                    var last = arguments.length - 1;
                    var fn = void 0;
                    if (last > 0 && typeof arguments[last] === 'function') {
                        fn = arguments[last];
                        if (!true) {
                            if (last <= 8 && canEvaluate) {
                                var ret = new Promise(INTERNAL);
                                ret._captureStackTrace();
                                var HolderClass = holderClasses[last - 1];
                                var holder = new HolderClass(fn);
                                var callbacks = thenCallbacks;

                                for (var _i2 = 0; _i2 < last; ++_i2) {
                                    var maybePromise = tryConvertToPromise(arguments[_i2], ret);
                                    if (maybePromise instanceof Promise) {
                                        maybePromise = maybePromise._target();
                                        var bitField = maybePromise._bitField;
                                        if ((bitField & 50397184) === 0) {
                                            maybePromise._then(callbacks[_i2], reject, undefined, ret, holder);
                                            promiseSetters[_i2](maybePromise, holder);
                                        } else if ((bitField & 33554432) !== 0) {
                                            callbacks[_i2].call(ret, maybePromise._value(), holder);
                                        } else if ((bitField & 16777216) !== 0) {
                                            ret._reject(maybePromise._reason());
                                        } else {
                                            ret._cancel();
                                        }
                                    } else {
                                        callbacks[_i2].call(ret, maybePromise, holder);
                                    }
                                }
                                if (!ret._isFateSealed()) {
                                    ret._setAsyncGuaranteed();
                                    ret._setOnCancel(holder);
                                }
                                return ret;
                            }
                        }
                    }
                    var args = [].slice.call(arguments);
                    if (fn) args.pop();
                    var ret = new PromiseArray(args).promise();
                    return fn !== undefined ? ret.spread(fn) : ret;
                };
            };
        }, { './util': 21 }],
        13: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
                var util = _dereq_('./util');
                var tryCatch = util.tryCatch;

                Promise.method = function (fn) {
                    if (typeof fn !== 'function') {
                        throw new Promise.TypeError('expecting a function but got ' + util.classString(fn));
                    }
                    return function () {
                        var ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._pushContext();
                        var value = tryCatch(fn).apply(this, arguments);
                        var promiseCreated = ret._popContext();
                        debug.checkForgottenReturns(value, promiseCreated, 'Promise.method', ret);
                        ret._resolveFromSyncValue(value);
                        return ret;
                    };
                };

                Promise.attempt = Promise['try'] = function (fn) {
                    if (typeof fn !== 'function') {
                        return apiRejection('expecting a function but got ' + util.classString(fn));
                    }
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    ret._pushContext();
                    var value = void 0;
                    if (arguments.length > 1) {
                        debug.deprecated('calling Promise.try with more than 1 argument');
                        var arg = arguments[1];
                        var ctx = arguments[2];
                        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
                    } else {
                        value = tryCatch(fn)();
                    }
                    var promiseCreated = ret._popContext();
                    debug.checkForgottenReturns(value, promiseCreated, 'Promise.try', ret);
                    ret._resolveFromSyncValue(value);
                    return ret;
                };

                Promise.prototype._resolveFromSyncValue = function (value) {
                    if (value === util.errorObj) {
                        this._rejectCallback(value.e, false);
                    } else {
                        this._resolveCallback(value, true);
                    }
                };
            };
        }, { './util': 21 }],
        14: [function (_dereq_, module, exports) {
            'use strict';

            var util = _dereq_('./util');
            var maybeWrapAsError = util.maybeWrapAsError;
            var errors = _dereq_('./errors');
            var OperationalError = errors.OperationalError;
            var es5 = _dereq_('./es5');

            function isUntypedError(obj) {
                return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
            }

            var rErrorKey = /^(?:name|message|stack|cause)$/;
            function wrapAsOperationalError(obj) {
                var ret = void 0;
                if (isUntypedError(obj)) {
                    ret = new OperationalError(obj);
                    ret.name = obj.name;
                    ret.message = obj.message;
                    ret.stack = obj.stack;
                    var keys = es5.keys(obj);
                    for (var i = 0; i < keys.length; ++i) {
                        var key = keys[i];
                        if (!rErrorKey.test(key)) {
                            ret[key] = obj[key];
                        }
                    }
                    return ret;
                }
                util.markAsOriginatingFromRejection(obj);
                return obj;
            }

            function nodebackForPromise(promise, multiArgs) {
                return function (err, value) {
                    if (promise === null) return;
                    if (err) {
                        var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                        promise._attachExtraTrace(wrapped);
                        promise._reject(wrapped);
                    } else if (!multiArgs) {
                        promise._fulfill(value);
                    } else {
                        var args = [].slice.call(arguments, 1);
                        promise._fulfill(args);
                    }
                    promise = null;
                };
            }

            module.exports = nodebackForPromise;
        }, { './errors': 9, './es5': 10, './util': 21 }],
        15: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function () {
                var makeSelfResolutionError = function makeSelfResolutionError() {
                    return new TypeError('circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n');
                };
                var reflectHandler = function reflectHandler() {
                    return new Promise.PromiseInspection(this._target());
                };
                var apiRejection = function apiRejection(msg) {
                    return Promise.reject(new TypeError(msg));
                };
                function Proxyable() {}
                var UNDEFINED_BINDING = {};
                var util = _dereq_('./util');

                var getDomain = void 0;
                if (util.isNode) {
                    getDomain = function getDomain() {
                        var ret = process.domain;
                        if (ret === undefined) ret = null;
                        return ret;
                    };
                } else {
                    getDomain = function getDomain() {
                        return null;
                    };
                }
                util.notEnumerableProp(Promise, '_getDomain', getDomain);

                var es5 = _dereq_('./es5');
                var Async = _dereq_('./async');
                var async = new Async();
                es5.defineProperty(Promise, '_async', { value: async });
                var errors = _dereq_('./errors');
                var TypeError = Promise.TypeError = errors.TypeError;
                Promise.RangeError = errors.RangeError;
                var CancellationError = Promise.CancellationError = errors.CancellationError;
                Promise.TimeoutError = errors.TimeoutError;
                Promise.OperationalError = errors.OperationalError;
                Promise.RejectionError = errors.OperationalError;
                Promise.AggregateError = errors.AggregateError;
                var INTERNAL = function INTERNAL() {};
                var APPLY = {};
                var NEXT_FILTER = {};
                var tryConvertToPromise = _dereq_('./thenables')(Promise, INTERNAL);
                var PromiseArray = _dereq_('./promise_array')(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                var Context = _dereq_('./context')(Promise);
                /*jshint unused:false*/
                var createContext = Context.create;
                var debug = _dereq_('./debuggability')(Promise, Context);
                var CapturedTrace = debug.CapturedTrace;
                var PassThroughHandlerContext = _dereq_('./finally')(Promise, tryConvertToPromise);
                var catchFilter = _dereq_('./catch_filter')(NEXT_FILTER);
                var nodebackForPromise = _dereq_('./nodeback');
                var errorObj = util.errorObj;
                var tryCatch = util.tryCatch;
                function check(self, executor) {
                    if (typeof executor !== 'function') {
                        throw new TypeError('expecting a function but got ' + util.classString(executor));
                    }
                    if (self.constructor !== Promise) {
                        throw new TypeError('the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n');
                    }
                }

                function Promise(executor) {
                    this._bitField = 0;
                    this._fulfillmentHandler0 = undefined;
                    this._rejectionHandler0 = undefined;
                    this._promise0 = undefined;
                    this._receiver0 = undefined;
                    if (executor !== INTERNAL) {
                        check(this, executor);
                        this._resolveFromExecutor(executor);
                    }
                    this._promiseCreated();
                    this._fireEvent('promiseCreated', this);
                }

                Promise.prototype.toString = function () {
                    return '[object Promise]';
                };

                Promise.prototype.caught = Promise.prototype['catch'] = function (fn) {
                    var len = arguments.length;
                    if (len > 1) {
                        var catchInstances = new Array(len - 1),
                            j = 0,
                            i = void 0;
                        for (i = 0; i < len - 1; ++i) {
                            var item = arguments[i];
                            if (util.isObject(item)) {
                                catchInstances[j++] = item;
                            } else {
                                return apiRejection('expecting an object but got ' + util.classString(item));
                            }
                        }
                        catchInstances.length = j;
                        fn = arguments[i];
                        return this.then(undefined, catchFilter(catchInstances, fn, this));
                    }
                    return this.then(undefined, fn);
                };

                Promise.prototype.reflect = function () {
                    return this._then(reflectHandler, reflectHandler, undefined, this, undefined);
                };

                Promise.prototype.then = function (didFulfill, didReject) {
                    if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== 'function' && typeof didReject !== 'function') {
                        var msg = '.then() only accepts functions but was passed: ' + util.classString(didFulfill);
                        if (arguments.length > 1) {
                            msg += ', ' + util.classString(didReject);
                        }
                        this._warn(msg);
                    }
                    return this._then(didFulfill, didReject, undefined, undefined, undefined);
                };

                Promise.prototype.done = function (didFulfill, didReject) {
                    var promise = this._then(didFulfill, didReject, undefined, undefined, undefined);
                    promise._setIsFinal();
                };

                Promise.prototype.spread = function (fn) {
                    if (typeof fn !== 'function') {
                        return apiRejection('expecting a function but got ' + util.classString(fn));
                    }
                    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
                };

                Promise.prototype.toJSON = function () {
                    var ret = {
                        isFulfilled: false,
                        isRejected: false,
                        fulfillmentValue: undefined,
                        rejectionReason: undefined
                    };
                    if (this.isFulfilled()) {
                        ret.fulfillmentValue = this.value();
                        ret.isFulfilled = true;
                    } else if (this.isRejected()) {
                        ret.rejectionReason = this.reason();
                        ret.isRejected = true;
                    }
                    return ret;
                };

                Promise.prototype.all = function () {
                    if (arguments.length > 0) {
                        this._warn('.all() was passed arguments but it does not take any');
                    }
                    return new PromiseArray(this).promise();
                };

                Promise.prototype.error = function (fn) {
                    return this.caught(util.originatesFromRejection, fn);
                };

                Promise.is = function (val) {
                    return val instanceof Promise;
                };

                Promise.fromNode = Promise.fromCallback = function (fn) {
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
                    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                    if (result === errorObj) {
                        ret._rejectCallback(result.e, true);
                    }
                    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
                    return ret;
                };

                Promise.all = function (promises) {
                    return new PromiseArray(promises).promise();
                };

                Promise.cast = function (obj) {
                    var ret = tryConvertToPromise(obj);
                    if (!(ret instanceof Promise)) {
                        ret = new Promise(INTERNAL);
                        ret._captureStackTrace();
                        ret._setFulfilled();
                        ret._rejectionHandler0 = obj;
                    }
                    return ret;
                };

                Promise.resolve = Promise.fulfilled = Promise.cast;

                Promise.reject = Promise.rejected = function (reason) {
                    var ret = new Promise(INTERNAL);
                    ret._captureStackTrace();
                    ret._rejectCallback(reason, true);
                    return ret;
                };

                Promise.setScheduler = function (fn) {
                    if (typeof fn !== 'function') {
                        throw new TypeError('expecting a function but got ' + util.classString(fn));
                    }
                    var prev = async._schedule;
                    async._schedule = fn;
                    return prev;
                };

                Promise.prototype._then = function (didFulfill, didReject, _, receiver, internalData) {
                    var haveInternalData = internalData !== undefined;
                    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                    var target = this._target();
                    var bitField = target._bitField;

                    if (!haveInternalData) {
                        promise._propagateFrom(this, 3);
                        promise._captureStackTrace();
                        if (receiver === undefined && (this._bitField & 2097152) !== 0) {
                            if (!((bitField & 50397184) === 0)) {
                                receiver = this._boundValue();
                            } else {
                                receiver = target === this ? undefined : this._boundTo;
                            }
                        }
                        this._fireEvent('promiseChained', this, promise);
                    }

                    var domain = getDomain();
                    if (!((bitField & 50397184) === 0)) {
                        var handler = void 0,
                            value = void 0,
                            settler = target._settlePromiseCtx;
                        if ((bitField & 33554432) !== 0) {
                            value = target._rejectionHandler0;
                            handler = didFulfill;
                        } else if ((bitField & 16777216) !== 0) {
                            value = target._fulfillmentHandler0;
                            handler = didReject;
                            target._unsetRejectionIsUnhandled();
                        } else {
                            settler = target._settlePromiseLateCancellationObserver;
                            value = new CancellationError('late cancellation observer');
                            target._attachExtraTrace(value);
                            handler = didReject;
                        }

                        async.invoke(settler, target, {
                            handler: domain === null ? handler : typeof handler === 'function' && domain.bind(handler),
                            promise: promise,
                            receiver: receiver,
                            value: value
                        });
                    } else {
                        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                    }

                    return promise;
                };

                Promise.prototype._length = function () {
                    return this._bitField & 65535;
                };

                Promise.prototype._isFateSealed = function () {
                    return (this._bitField & 117506048) !== 0;
                };

                Promise.prototype._isFollowing = function () {
                    return (this._bitField & 67108864) === 67108864;
                };

                Promise.prototype._setLength = function (len) {
                    this._bitField = this._bitField & -65536 | len & 65535;
                };

                Promise.prototype._setFulfilled = function () {
                    this._bitField = this._bitField | 33554432;
                    this._fireEvent('promiseFulfilled', this);
                };

                Promise.prototype._setRejected = function () {
                    this._bitField = this._bitField | 16777216;
                    this._fireEvent('promiseRejected', this);
                };

                Promise.prototype._setFollowing = function () {
                    this._bitField = this._bitField | 67108864;
                    this._fireEvent('promiseResolved', this);
                };

                Promise.prototype._setIsFinal = function () {
                    this._bitField = this._bitField | 4194304;
                };

                Promise.prototype._isFinal = function () {
                    return (this._bitField & 4194304) > 0;
                };

                Promise.prototype._unsetCancelled = function () {
                    this._bitField = this._bitField & ~65536;
                };

                Promise.prototype._setCancelled = function () {
                    this._bitField = this._bitField | 65536;
                    this._fireEvent('promiseCancelled', this);
                };

                Promise.prototype._setAsyncGuaranteed = function () {
                    this._bitField = this._bitField | 134217728;
                };

                Promise.prototype._receiverAt = function (index) {
                    var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
                    if (ret === UNDEFINED_BINDING) {
                        return undefined;
                    } else if (ret === undefined && this._isBound()) {
                        return this._boundValue();
                    }
                    return ret;
                };

                Promise.prototype._promiseAt = function (index) {
                    return this[index * 4 - 4 + 2];
                };

                Promise.prototype._fulfillmentHandlerAt = function (index) {
                    return this[index * 4 - 4 + 0];
                };

                Promise.prototype._rejectionHandlerAt = function (index) {
                    return this[index * 4 - 4 + 1];
                };

                Promise.prototype._boundValue = function () {};

                Promise.prototype._migrateCallback0 = function (follower) {
                    var bitField = follower._bitField;
                    var fulfill = follower._fulfillmentHandler0;
                    var reject = follower._rejectionHandler0;
                    var promise = follower._promise0;
                    var receiver = follower._receiverAt(0);
                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                };

                Promise.prototype._migrateCallbackAt = function (follower, index) {
                    var fulfill = follower._fulfillmentHandlerAt(index);
                    var reject = follower._rejectionHandlerAt(index);
                    var promise = follower._promiseAt(index);
                    var receiver = follower._receiverAt(index);
                    if (receiver === undefined) receiver = UNDEFINED_BINDING;
                    this._addCallbacks(fulfill, reject, promise, receiver, null);
                };

                Promise.prototype._addCallbacks = function (fulfill, reject, promise, receiver, domain) {
                    var index = this._length();

                    if (index >= 65535 - 4) {
                        index = 0;
                        this._setLength(0);
                    }

                    if (index === 0) {
                        this._promise0 = promise;
                        this._receiver0 = receiver;
                        if (typeof fulfill === 'function') {
                            this._fulfillmentHandler0 = domain === null ? fulfill : domain.bind(fulfill);
                        }
                        if (typeof reject === 'function') {
                            this._rejectionHandler0 = domain === null ? reject : domain.bind(reject);
                        }
                    } else {
                        var base = index * 4 - 4;
                        this[base + 2] = promise;
                        this[base + 3] = receiver;
                        if (typeof fulfill === 'function') {
                            this[base + 0] = domain === null ? fulfill : domain.bind(fulfill);
                        }
                        if (typeof reject === 'function') {
                            this[base + 1] = domain === null ? reject : domain.bind(reject);
                        }
                    }
                    this._setLength(index + 1);
                    return index;
                };

                Promise.prototype._proxy = function (proxyable, arg) {
                    this._addCallbacks(undefined, undefined, arg, proxyable, null);
                };

                Promise.prototype._resolveCallback = function (value, shouldBind) {
                    if ((this._bitField & 117506048) !== 0) return;
                    if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
                    var maybePromise = tryConvertToPromise(value, this);
                    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

                    if (shouldBind) this._propagateFrom(maybePromise, 2);

                    var promise = maybePromise._target();

                    if (promise === this) {
                        this._reject(makeSelfResolutionError());
                        return;
                    }

                    var bitField = promise._bitField;
                    if ((bitField & 50397184) === 0) {
                        var len = this._length();
                        if (len > 0) promise._migrateCallback0(this);
                        for (var i = 1; i < len; ++i) {
                            promise._migrateCallbackAt(this, i);
                        }
                        this._setFollowing();
                        this._setLength(0);
                        this._setFollowee(promise);
                    } else if ((bitField & 33554432) !== 0) {
                        this._fulfill(promise._value());
                    } else if ((bitField & 16777216) !== 0) {
                        this._reject(promise._reason());
                    } else {
                        var reason = new CancellationError('late cancellation observer');
                        promise._attachExtraTrace(reason);
                        this._reject(reason);
                    }
                };

                Promise.prototype._rejectCallback = function (reason, synchronous, ignoreNonErrorWarnings) {
                    var trace = util.ensureErrorObject(reason);
                    var hasStack = trace === reason;
                    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                        var message = 'a promise was rejected with a non-error: ' + util.classString(reason);
                        this._warn(message, true);
                    }
                    this._attachExtraTrace(trace, synchronous ? hasStack : false);
                    this._reject(reason);
                };

                Promise.prototype._resolveFromExecutor = function (executor) {
                    var promise = this;
                    this._captureStackTrace();
                    this._pushContext();
                    var synchronous = true;
                    var r = this._execute(executor, function (value) {
                        promise._resolveCallback(value);
                    }, function (reason) {
                        promise._rejectCallback(reason, synchronous);
                    });
                    synchronous = false;
                    this._popContext();

                    if (r !== undefined) {
                        promise._rejectCallback(r, true);
                    }
                };

                Promise.prototype._settlePromiseFromHandler = function (handler, receiver, value, promise) {
                    var bitField = promise._bitField;
                    if ((bitField & 65536) !== 0) return;
                    promise._pushContext();
                    var x = void 0;
                    if (receiver === APPLY) {
                        if (!value || typeof value.length !== 'number') {
                            x = errorObj;
                            x.e = new TypeError('cannot .spread() a non-array: ' + util.classString(value));
                        } else {
                            x = tryCatch(handler).apply(this._boundValue(), value);
                        }
                    } else {
                        x = tryCatch(handler).call(receiver, value);
                    }
                    var promiseCreated = promise._popContext();
                    bitField = promise._bitField;
                    if ((bitField & 65536) !== 0) return;

                    if (x === NEXT_FILTER) {
                        promise._reject(value);
                    } else if (x === errorObj) {
                        promise._rejectCallback(x.e, false);
                    } else {
                        debug.checkForgottenReturns(x, promiseCreated, '', promise, this);
                        promise._resolveCallback(x);
                    }
                };

                Promise.prototype._target = function () {
                    var ret = this;
                    while (ret._isFollowing()) {
                        ret = ret._followee();
                    }return ret;
                };

                Promise.prototype._followee = function () {
                    return this._rejectionHandler0;
                };

                Promise.prototype._setFollowee = function (promise) {
                    this._rejectionHandler0 = promise;
                };

                Promise.prototype._settlePromise = function (promise, handler, receiver, value) {
                    var isPromise = promise instanceof Promise;
                    var bitField = this._bitField;
                    var asyncGuaranteed = (bitField & 134217728) !== 0;
                    if ((bitField & 65536) !== 0) {
                        if (isPromise) promise._invokeInternalOnCancel();

                        if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
                            receiver.cancelPromise = promise;
                            if (tryCatch(handler).call(receiver, value) === errorObj) {
                                promise._reject(errorObj.e);
                            }
                        } else if (handler === reflectHandler) {
                            promise._fulfill(reflectHandler.call(receiver));
                        } else if (receiver instanceof Proxyable) {
                            receiver._promiseCancelled(promise);
                        } else if (isPromise || promise instanceof PromiseArray) {
                            promise._cancel();
                        } else {
                            receiver.cancel();
                        }
                    } else if (typeof handler === 'function') {
                        if (!isPromise) {
                            handler.call(receiver, value, promise);
                        } else {
                            if (asyncGuaranteed) promise._setAsyncGuaranteed();
                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                        }
                    } else if (receiver instanceof Proxyable) {
                        if (!receiver._isResolved()) {
                            if ((bitField & 33554432) !== 0) {
                                receiver._promiseFulfilled(value, promise);
                            } else {
                                receiver._promiseRejected(value, promise);
                            }
                        }
                    } else if (isPromise) {
                        if (asyncGuaranteed) promise._setAsyncGuaranteed();
                        if ((bitField & 33554432) !== 0) {
                            promise._fulfill(value);
                        } else {
                            promise._reject(value);
                        }
                    }
                };

                Promise.prototype._settlePromiseLateCancellationObserver = function (ctx) {
                    var handler = ctx.handler;
                    var promise = ctx.promise;
                    var receiver = ctx.receiver;
                    var value = ctx.value;
                    if (typeof handler === 'function') {
                        if (!(promise instanceof Promise)) {
                            handler.call(receiver, value, promise);
                        } else {
                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                        }
                    } else if (promise instanceof Promise) {
                        promise._reject(value);
                    }
                };

                Promise.prototype._settlePromiseCtx = function (ctx) {
                    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                };

                Promise.prototype._settlePromise0 = function (handler, value, bitField) {
                    var promise = this._promise0;
                    var receiver = this._receiverAt(0);
                    this._promise0 = undefined;
                    this._receiver0 = undefined;
                    this._settlePromise(promise, handler, receiver, value);
                };

                Promise.prototype._clearCallbackDataAtIndex = function (index) {
                    var base = index * 4 - 4;
                    this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = undefined;
                };

                Promise.prototype._fulfill = function (value) {
                    var bitField = this._bitField;
                    if ((bitField & 117506048) >>> 16) return;
                    if (value === this) {
                        var err = makeSelfResolutionError();
                        this._attachExtraTrace(err);
                        return this._reject(err);
                    }
                    this._setFulfilled();
                    this._rejectionHandler0 = value;

                    if ((bitField & 65535) > 0) {
                        if ((bitField & 134217728) !== 0) {
                            this._settlePromises();
                        } else {
                            async.settlePromises(this);
                        }
                    }
                };

                Promise.prototype._reject = function (reason) {
                    var bitField = this._bitField;
                    if ((bitField & 117506048) >>> 16) return;
                    this._setRejected();
                    this._fulfillmentHandler0 = reason;

                    if (this._isFinal()) {
                        return async.fatalError(reason, util.isNode);
                    }

                    if ((bitField & 65535) > 0) {
                        async.settlePromises(this);
                    } else {
                        this._ensurePossibleRejectionHandled();
                    }
                };

                Promise.prototype._fulfillPromises = function (len, value) {
                    for (var i = 1; i < len; i++) {
                        var handler = this._fulfillmentHandlerAt(i);
                        var promise = this._promiseAt(i);
                        var receiver = this._receiverAt(i);
                        this._clearCallbackDataAtIndex(i);
                        this._settlePromise(promise, handler, receiver, value);
                    }
                };

                Promise.prototype._rejectPromises = function (len, reason) {
                    for (var i = 1; i < len; i++) {
                        var handler = this._rejectionHandlerAt(i);
                        var promise = this._promiseAt(i);
                        var receiver = this._receiverAt(i);
                        this._clearCallbackDataAtIndex(i);
                        this._settlePromise(promise, handler, receiver, reason);
                    }
                };

                Promise.prototype._settlePromises = function () {
                    var bitField = this._bitField;
                    var len = bitField & 65535;

                    if (len > 0) {
                        if ((bitField & 16842752) !== 0) {
                            var reason = this._fulfillmentHandler0;
                            this._settlePromise0(this._rejectionHandler0, reason, bitField);
                            this._rejectPromises(len, reason);
                        } else {
                            var value = this._rejectionHandler0;
                            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                            this._fulfillPromises(len, value);
                        }
                        this._setLength(0);
                    }
                    this._clearCancellationData();
                };

                Promise.prototype._settledValue = function () {
                    var bitField = this._bitField;
                    if ((bitField & 33554432) !== 0) {
                        return this._rejectionHandler0;
                    } else if ((bitField & 16777216) !== 0) {
                        return this._fulfillmentHandler0;
                    }
                };

                function deferResolve(v) {
                    this.promise._resolveCallback(v);
                }
                function deferReject(v) {
                    this.promise._rejectCallback(v, false);
                }

                Promise.defer = Promise.pending = function () {
                    debug.deprecated('Promise.defer', 'new Promise');
                    var promise = new Promise(INTERNAL);
                    return {
                        promise: promise,
                        resolve: deferResolve,
                        reject: deferReject
                    };
                };

                util.notEnumerableProp(Promise, '_makeSelfResolutionError', makeSelfResolutionError);

                _dereq_('./method')(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
                _dereq_('./bind')(Promise, INTERNAL, tryConvertToPromise, debug);
                _dereq_('./cancel')(Promise, PromiseArray, apiRejection, debug);
                _dereq_('./direct_resolve')(Promise);
                _dereq_('./synchronous_inspection')(Promise);
                _dereq_('./join')(Promise, PromiseArray, tryConvertToPromise, INTERNAL, debug);
                Promise.Promise = Promise;

                util.toFastProperties(Promise);
                util.toFastProperties(Promise.prototype);
                function fillTypes(value) {
                    var p = new Promise(INTERNAL);
                    p._fulfillmentHandler0 = value;
                    p._rejectionHandler0 = value;
                    p._promise0 = value;
                    p._receiver0 = value;
                }
                // Complete slack tracking, opt out of field-type tracking and
                // stabilize map
                fillTypes({ a: 1 });
                fillTypes({ b: 2 });
                fillTypes({ c: 3 });
                fillTypes(1);
                fillTypes(function () {});
                fillTypes(undefined);
                fillTypes(false);
                fillTypes(new Promise(INTERNAL));
                debug.setBounds(Async.firstLineError, util.lastLineError);
                return Promise;
            };
        }, {
            './async': 1,
            './bind': 2,
            './cancel': 4,
            './catch_filter': 5,
            './context': 6,
            './debuggability': 7,
            './direct_resolve': 8,
            './errors': 9,
            './es5': 10,
            './finally': 11,
            './join': 12,
            './method': 13,
            './nodeback': 14,
            './promise_array': 16,
            './synchronous_inspection': 19,
            './thenables': 20,
            './util': 21
        }],
        16: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                var util = _dereq_('./util');
                var isArray = util.isArray;

                function toResolutionValue(val) {
                    switch (val) {
                        case -2:
                            return [];
                        case -3:
                            return {};
                    }
                }

                function PromiseArray(values) {
                    var promise = this._promise = new Promise(INTERNAL);
                    if (values instanceof Promise) {
                        promise._propagateFrom(values, 3);
                    }
                    promise._setOnCancel(this);
                    this._values = values;
                    this._length = 0;
                    this._totalResolved = 0;
                    this._init(undefined, -2);
                }
                util.inherits(PromiseArray, Proxyable);

                PromiseArray.prototype.length = function () {
                    return this._length;
                };

                PromiseArray.prototype.promise = function () {
                    return this._promise;
                };

                PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                    var values = tryConvertToPromise(this._values, this._promise);
                    if (values instanceof Promise) {
                        values = values._target();
                        var bitField = values._bitField;
                        this._values = values;

                        if ((bitField & 50397184) === 0) {
                            this._promise._setAsyncGuaranteed();
                            return values._then(init, this._reject, undefined, this, resolveValueIfEmpty);
                        } else if ((bitField & 33554432) !== 0) {
                            values = values._value();
                        } else if ((bitField & 16777216) !== 0) {
                            return this._reject(values._reason());
                        } else {
                            return this._cancel();
                        }
                    }
                    values = util.asArray(values);
                    if (values === null) {
                        var err = apiRejection('expecting an array or an iterable object but got ' + util.classString(values)).reason();
                        this._promise._rejectCallback(err, false);
                        return;
                    }

                    if (values.length === 0) {
                        if (resolveValueIfEmpty === -5) {
                            this._resolveEmptyArray();
                        } else {
                            this._resolve(toResolutionValue(resolveValueIfEmpty));
                        }
                        return;
                    }
                    this._iterate(values);
                };

                PromiseArray.prototype._iterate = function (values) {
                    var len = this.getActualLength(values.length);
                    this._length = len;
                    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                    var result = this._promise;
                    var isResolved = false;
                    var bitField = null;
                    for (var i = 0; i < len; ++i) {
                        var maybePromise = tryConvertToPromise(values[i], result);

                        if (maybePromise instanceof Promise) {
                            maybePromise = maybePromise._target();
                            bitField = maybePromise._bitField;
                        } else {
                            bitField = null;
                        }

                        if (isResolved) {
                            if (bitField !== null) {
                                maybePromise.suppressUnhandledRejections();
                            }
                        } else if (bitField !== null) {
                            if ((bitField & 50397184) === 0) {
                                maybePromise._proxy(this, i);
                                this._values[i] = maybePromise;
                            } else if ((bitField & 33554432) !== 0) {
                                isResolved = this._promiseFulfilled(maybePromise._value(), i);
                            } else if ((bitField & 16777216) !== 0) {
                                isResolved = this._promiseRejected(maybePromise._reason(), i);
                            } else {
                                isResolved = this._promiseCancelled(i);
                            }
                        } else {
                            isResolved = this._promiseFulfilled(maybePromise, i);
                        }
                    }
                    if (!isResolved) result._setAsyncGuaranteed();
                };

                PromiseArray.prototype._isResolved = function () {
                    return this._values === null;
                };

                PromiseArray.prototype._resolve = function (value) {
                    this._values = null;
                    this._promise._fulfill(value);
                };

                PromiseArray.prototype._cancel = function () {
                    if (this._isResolved() || !this._promise.isCancellable()) return;
                    this._values = null;
                    this._promise._cancel();
                };

                PromiseArray.prototype._reject = function (reason) {
                    this._values = null;
                    this._promise._rejectCallback(reason, false);
                };

                PromiseArray.prototype._promiseFulfilled = function (value, index) {
                    this._values[index] = value;
                    var totalResolved = ++this._totalResolved;
                    if (totalResolved >= this._length) {
                        this._resolve(this._values);
                        return true;
                    }
                    return false;
                };

                PromiseArray.prototype._promiseCancelled = function () {
                    this._cancel();
                    return true;
                };

                PromiseArray.prototype._promiseRejected = function (reason) {
                    this._totalResolved++;
                    this._reject(reason);
                    return true;
                };

                PromiseArray.prototype._resultCancelled = function () {
                    if (this._isResolved()) return;
                    var values = this._values;
                    this._cancel();
                    if (values instanceof Promise) {
                        values.cancel();
                    } else {
                        for (var i = 0; i < values.length; ++i) {
                            if (values[i] instanceof Promise) {
                                values[i].cancel();
                            }
                        }
                    }
                };

                PromiseArray.prototype.shouldCopyValues = function () {
                    return true;
                };

                PromiseArray.prototype.getActualLength = function (len) {
                    return len;
                };

                return PromiseArray;
            };
        }, { './util': 21 }],
        17: [function (_dereq_, module, exports) {
            'use strict';

            function arrayMove(src, srcIndex, dst, dstIndex, len) {
                for (var j = 0; j < len; ++j) {
                    dst[j + dstIndex] = src[j + srcIndex];
                    src[j + srcIndex] = void 0;
                }
            }

            function Queue(capacity) {
                this._capacity = capacity;
                this._length = 0;
                this._front = 0;
            }

            Queue.prototype._willBeOverCapacity = function (size) {
                return this._capacity < size;
            };

            Queue.prototype._pushOne = function (arg) {
                var length = this.length();
                this._checkCapacity(length + 1);
                var i = this._front + length & this._capacity - 1;
                this[i] = arg;
                this._length = length + 1;
            };

            Queue.prototype._unshiftOne = function (value) {
                var capacity = this._capacity;
                this._checkCapacity(this.length() + 1);
                var front = this._front;
                var i = (front - 1 & capacity - 1 ^ capacity) - capacity;
                this[i] = value;
                this._front = i;
                this._length = this.length() + 1;
            };

            Queue.prototype.unshift = function (fn, receiver, arg) {
                this._unshiftOne(arg);
                this._unshiftOne(receiver);
                this._unshiftOne(fn);
            };

            Queue.prototype.push = function (fn, receiver, arg) {
                var length = this.length() + 3;
                if (this._willBeOverCapacity(length)) {
                    this._pushOne(fn);
                    this._pushOne(receiver);
                    this._pushOne(arg);
                    return;
                }
                var j = this._front + length - 3;
                this._checkCapacity(length);
                var wrapMask = this._capacity - 1;
                this[j + 0 & wrapMask] = fn;
                this[j + 1 & wrapMask] = receiver;
                this[j + 2 & wrapMask] = arg;
                this._length = length;
            };

            Queue.prototype.shift = function () {
                var front = this._front,
                    ret = this[front];

                this[front] = undefined;
                this._front = front + 1 & this._capacity - 1;
                this._length--;
                return ret;
            };

            Queue.prototype.length = function () {
                return this._length;
            };

            Queue.prototype._checkCapacity = function (size) {
                if (this._capacity < size) {
                    this._resizeTo(this._capacity << 1);
                }
            };

            Queue.prototype._resizeTo = function (capacity) {
                var oldCapacity = this._capacity;
                this._capacity = capacity;
                var front = this._front;
                var length = this._length;
                var moveItemsCount = front + length & oldCapacity - 1;
                arrayMove(this, 0, this, oldCapacity, moveItemsCount);
            };

            module.exports = Queue;
        }, {}],
        18: [function (_dereq_, module, exports) {
            'use strict';

            var util = _dereq_('./util');
            var schedule = void 0;
            var noAsyncScheduler = function noAsyncScheduler() {
                throw new Error('No async scheduler available\n\n    See http://goo.gl/MqrFmX\n');
            };
            if (util.isNode && typeof MutationObserver === 'undefined') {
                var GlobalSetImmediate = global.setImmediate;
                var ProcessNextTick = process.nextTick;
                schedule = util.isRecentNode ? function (fn) {
                    GlobalSetImmediate.call(global, fn);
                } : function (fn) {
                    ProcessNextTick.call(process, fn);
                };
            } else if (typeof MutationObserver !== 'undefined' && !(typeof window !== 'undefined' && window.navigator && window.navigator.standalone)) {
                schedule = function () {
                    var div = document.createElement('div');
                    var opts = { attributes: true };
                    var toggleScheduled = false;
                    var div2 = document.createElement('div');
                    var o2 = new MutationObserver(function () {
                        div.classList.toggle('foo');
                        toggleScheduled = false;
                    });
                    o2.observe(div2, opts);

                    var scheduleToggle = function scheduleToggle() {
                        if (toggleScheduled) return;
                        toggleScheduled = true;
                        div2.classList.toggle('foo');
                    };

                    return function schedule(fn) {
                        var o = new MutationObserver(function () {
                            o.disconnect();
                            fn();
                        });
                        o.observe(div, opts);
                        scheduleToggle();
                    };
                }();
            } else if (typeof setImmediate !== 'undefined') {
                schedule = function schedule(fn) {
                    setImmediate(fn);
                };
            } else if (typeof setTimeout !== 'undefined') {
                schedule = function schedule(fn) {
                    setTimeout(fn, 0);
                };
            } else {
                schedule = noAsyncScheduler;
            }
            module.exports = schedule;
        }, { './util': 21 }],
        19: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise) {
                function PromiseInspection(promise) {
                    if (promise !== undefined) {
                        promise = promise._target();
                        this._bitField = promise._bitField;
                        this._settledValueField = promise._isFateSealed() ? promise._settledValue() : undefined;
                    } else {
                        this._bitField = 0;
                        this._settledValueField = undefined;
                    }
                }

                PromiseInspection.prototype._settledValue = function () {
                    return this._settledValueField;
                };

                var value = PromiseInspection.prototype.value = function () {
                    if (!this.isFulfilled()) {
                        throw new TypeError('cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n');
                    }
                    return this._settledValue();
                };

                var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function () {
                    if (!this.isRejected()) {
                        throw new TypeError('cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n');
                    }
                    return this._settledValue();
                };

                var isFulfilled = PromiseInspection.prototype.isFulfilled = function () {
                    return (this._bitField & 33554432) !== 0;
                };

                var isRejected = PromiseInspection.prototype.isRejected = function () {
                    return (this._bitField & 16777216) !== 0;
                };

                var isPending = PromiseInspection.prototype.isPending = function () {
                    return (this._bitField & 50397184) === 0;
                };

                var isResolved = PromiseInspection.prototype.isResolved = function () {
                    return (this._bitField & 50331648) !== 0;
                };

                PromiseInspection.prototype.isCancelled = Promise.prototype._isCancelled = function () {
                    return (this._bitField & 65536) === 65536;
                };

                Promise.prototype.isCancelled = function () {
                    return this._target()._isCancelled();
                };

                Promise.prototype.isPending = function () {
                    return isPending.call(this._target());
                };

                Promise.prototype.isRejected = function () {
                    return isRejected.call(this._target());
                };

                Promise.prototype.isFulfilled = function () {
                    return isFulfilled.call(this._target());
                };

                Promise.prototype.isResolved = function () {
                    return isResolved.call(this._target());
                };

                Promise.prototype.value = function () {
                    return value.call(this._target());
                };

                Promise.prototype.reason = function () {
                    var target = this._target();
                    target._unsetRejectionIsUnhandled();
                    return reason.call(target);
                };

                Promise.prototype._value = function () {
                    return this._settledValue();
                };

                Promise.prototype._reason = function () {
                    this._unsetRejectionIsUnhandled();
                    return this._settledValue();
                };

                Promise.PromiseInspection = PromiseInspection;
            };
        }, {}],
        20: [function (_dereq_, module, exports) {
            'use strict';

            module.exports = function (Promise, INTERNAL) {
                var util = _dereq_('./util');
                var errorObj = util.errorObj;
                var isObject = util.isObject;

                function tryConvertToPromise(obj, context) {
                    if (isObject(obj)) {
                        if (obj instanceof Promise) return obj;
                        var then = getThen(obj);
                        if (then === errorObj) {
                            if (context) context._pushContext();
                            var ret = Promise.reject(then.e);
                            if (context) context._popContext();
                            return ret;
                        } else if (typeof then === 'function') {
                            if (isAnyBluebirdPromise(obj)) {
                                var ret = new Promise(INTERNAL);
                                obj._then(ret._fulfill, ret._reject, undefined, ret, null);
                                return ret;
                            }
                            return doThenable(obj, then, context);
                        }
                    }
                    return obj;
                }

                function doGetThen(obj) {
                    return obj.then;
                }

                function getThen(obj) {
                    try {
                        return doGetThen(obj);
                    } catch (e) {
                        errorObj.e = e;
                        return errorObj;
                    }
                }

                var hasProp = {}.hasOwnProperty;
                function isAnyBluebirdPromise(obj) {
                    return hasProp.call(obj, '_promise0');
                }

                function doThenable(x, then, context) {
                    var promise = new Promise(INTERNAL);
                    var ret = promise;
                    if (context) context._pushContext();
                    promise._captureStackTrace();
                    if (context) context._popContext();
                    var synchronous = true;
                    var result = util.tryCatch(then).call(x, resolve, reject);
                    synchronous = false;

                    if (promise && result === errorObj) {
                        promise._rejectCallback(result.e, true, true);
                        promise = null;
                    }

                    function resolve(value) {
                        if (!promise) return;
                        promise._resolveCallback(value);
                        promise = null;
                    }

                    function reject(reason) {
                        if (!promise) return;
                        promise._rejectCallback(reason, synchronous, true);
                        promise = null;
                    }
                    return ret;
                }

                return tryConvertToPromise;
            };
        }, { './util': 21 }],
        21: [function (_dereq_, module, exports) {
            'use strict';

            var es5 = _dereq_('./es5');
            var canEvaluate = typeof navigator == 'undefined';

            var errorObj = { e: {} };
            var tryCatchTarget = void 0;
            var globalObject = typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this !== undefined ? this : null;

            function tryCatcher() {
                try {
                    var target = tryCatchTarget;
                    tryCatchTarget = null;
                    return target.apply(this, arguments);
                } catch (e) {
                    errorObj.e = e;
                    return errorObj;
                }
            }
            function tryCatch(fn) {
                tryCatchTarget = fn;
                return tryCatcher;
            }

            var inherits = function inherits(Child, Parent) {
                var hasProp = {}.hasOwnProperty;

                function T() {
                    this.constructor = Child;
                    this.constructor$ = Parent;
                    for (var propertyName in Parent.prototype) {
                        if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== '$') {
                            this[propertyName + '$'] = Parent.prototype[propertyName];
                        }
                    }
                }
                T.prototype = Parent.prototype;
                Child.prototype = new T();
                return Child.prototype;
            };

            function isPrimitive(val) {
                return val == null || val === true || val === false || typeof val === 'string' || typeof val === 'number';
            }

            function isObject(value) {
                return typeof value === 'function' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
            }

            function maybeWrapAsError(maybeError) {
                if (!isPrimitive(maybeError)) return maybeError;

                return new Error(safeToString(maybeError));
            }

            function withAppended(target, appendee) {
                var len = target.length;
                var ret = new Array(len + 1);
                var i = void 0;
                for (i = 0; i < len; ++i) {
                    ret[i] = target[i];
                }
                ret[i] = appendee;
                return ret;
            }

            function getDataPropertyOrDefault(obj, key, defaultValue) {
                if (es5.isES5) {
                    var desc = Object.getOwnPropertyDescriptor(obj, key);

                    if (desc != null) {
                        return desc.get == null && desc.set == null ? desc.value : defaultValue;
                    }
                } else {
                    return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                }
            }

            function notEnumerableProp(obj, name, value) {
                if (isPrimitive(obj)) return obj;
                var descriptor = {
                    value: value,
                    configurable: true,
                    enumerable: false,
                    writable: true
                };
                es5.defineProperty(obj, name, descriptor);
                return obj;
            }

            function thrower(r) {
                throw r;
            }

            var inheritedDataKeys = function () {
                var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

                var isExcludedProto = function isExcludedProto(val) {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (excludedPrototypes[i] === val) {
                            return true;
                        }
                    }
                    return false;
                };

                if (es5.isES5) {
                    var getKeys = Object.getOwnPropertyNames;
                    return function (obj) {
                        var ret = [];
                        var visitedKeys = Object.create(null);
                        while (obj != null && !isExcludedProto(obj)) {
                            var keys;
                            try {
                                keys = getKeys(obj);
                            } catch (e) {
                                return ret;
                            }
                            for (var i = 0; i < keys.length; ++i) {
                                var key = keys[i];
                                if (visitedKeys[key]) continue;
                                visitedKeys[key] = true;
                                var desc = Object.getOwnPropertyDescriptor(obj, key);
                                if (desc != null && desc.get == null && desc.set == null) {
                                    ret.push(key);
                                }
                            }
                            obj = es5.getPrototypeOf(obj);
                        }
                        return ret;
                    };
                } else {
                    var hasProp = {}.hasOwnProperty;
                    return function (obj) {
                        if (isExcludedProto(obj)) return [];
                        var ret = [];

                        /*jshint forin:false */
                        enumeration: for (var key in obj) {
                            if (hasProp.call(obj, key)) {
                                ret.push(key);
                            } else {
                                for (var i = 0; i < excludedPrototypes.length; ++i) {
                                    if (hasProp.call(excludedPrototypes[i], key)) {
                                        continue enumeration;
                                    }
                                }
                                ret.push(key);
                            }
                        }
                        return ret;
                    };
                }
            }();

            var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
            function isClass(fn) {
                try {
                    if (typeof fn === 'function') {
                        var keys = es5.names(fn.prototype);

                        var hasMethods = es5.isES5 && keys.length > 1;
                        var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === 'constructor');
                        var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + '') && es5.names(fn).length > 0;

                        if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
                            return true;
                        }
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            }

            function toFastProperties(obj) {
                /*jshint -W027,-W055,-W031*/
                function FakeConstructor() {}
                FakeConstructor.prototype = obj;
                var l = 8;
                while (l--) {
                    new FakeConstructor();
                }return obj;
            }

            var rident = /^[a-z$_][a-z$_0-9]*$/i;
            function isIdentifier(str) {
                return rident.test(str);
            }

            function filledRange(count, prefix, suffix) {
                var ret = new Array(count);
                for (var i = 0; i < count; ++i) {
                    ret[i] = prefix + i + suffix;
                }
                return ret;
            }

            function safeToString(obj) {
                try {
                    return obj + '';
                } catch (e) {
                    return '[no string representation]';
                }
            }

            function isError(obj) {
                return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.message === 'string' && typeof obj.name === 'string';
            }

            function markAsOriginatingFromRejection(e) {
                try {
                    notEnumerableProp(e, 'isOperational', true);
                } catch (ignore) {}
            }

            function originatesFromRejection(e) {
                if (e == null) return false;
                return e instanceof Error['__BluebirdErrorTypes__'].OperationalError || e['isOperational'] === true;
            }

            function canAttachTrace(obj) {
                return isError(obj) && es5.propertyIsWritable(obj, 'stack');
            }

            var ensureErrorObject = function () {
                if (!('stack' in new Error())) {
                    return function (value) {
                        if (canAttachTrace(value)) return value;
                        try {
                            throw new Error(safeToString(value));
                        } catch (err) {
                            return err;
                        }
                    };
                } else {
                    return function (value) {
                        if (canAttachTrace(value)) return value;
                        return new Error(safeToString(value));
                    };
                }
            }();

            function classString(obj) {
                return {}.toString.call(obj);
            }

            function copyDescriptors(from, to, filter) {
                var keys = es5.names(from);
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (filter(key)) {
                        try {
                            es5.defineProperty(to, key, es5.getDescriptor(from, key));
                        } catch (ignore) {}
                    }
                }
            }

            var asArray = function asArray(v) {
                if (es5.isArray(v)) {
                    return v;
                }
                return null;
            };

            if (typeof Symbol !== 'undefined' && Symbol.iterator) {
                var ArrayFrom = typeof Array.from === 'function' ? function (v) {
                    return Array.from(v);
                } : function (v) {
                    var ret = [];
                    var it = v[Symbol.iterator]();
                    var itResult = void 0;
                    while (!(itResult = it.next()).done) {
                        ret.push(itResult.value);
                    }
                    return ret;
                };

                asArray = function asArray(v) {
                    if (es5.isArray(v)) {
                        return v;
                    } else if (v != null && typeof v[Symbol.iterator] === 'function') {
                        return ArrayFrom(v);
                    }
                    return null;
                };
            }

            var isNode = typeof process !== 'undefined' && classString(process).toLowerCase() === '[object process]';

            function env(key, def) {
                return isNode ? process.env[key] : def;
            }

            var ret = {
                isClass: isClass,
                isIdentifier: isIdentifier,
                inheritedDataKeys: inheritedDataKeys,
                getDataPropertyOrDefault: getDataPropertyOrDefault,
                thrower: thrower,
                isArray: es5.isArray,
                asArray: asArray,
                notEnumerableProp: notEnumerableProp,
                isPrimitive: isPrimitive,
                isObject: isObject,
                isError: isError,
                canEvaluate: canEvaluate,
                errorObj: errorObj,
                tryCatch: tryCatch,
                inherits: inherits,
                withAppended: withAppended,
                maybeWrapAsError: maybeWrapAsError,
                toFastProperties: toFastProperties,
                filledRange: filledRange,
                toString: safeToString,
                canAttachTrace: canAttachTrace,
                ensureErrorObject: ensureErrorObject,
                originatesFromRejection: originatesFromRejection,
                markAsOriginatingFromRejection: markAsOriginatingFromRejection,
                classString: classString,
                copyDescriptors: copyDescriptors,
                hasDevTools: typeof chrome !== 'undefined' && chrome && typeof chrome.loadTimes === 'function',
                isNode: isNode,
                env: env,
                global: globalObject
            };
            ret.isRecentNode = ret.isNode && function () {
                var version = process.versions.node.split('.').map(Number);
                return version[0] === 0 && version[1] > 10 || version[0] > 0;
            }();

            if (ret.isNode) ret.toFastProperties(process);

            try {
                throw new Error();
            } catch (e) {
                ret.lastLineError = e;
            }
            module.exports = ret;
        }, { './es5': 10 }]
    }, {}, [3])(3);
});
if (typeof window !== 'undefined' && window !== null) {
    window.P = window.Promise;
} else if (typeof self !== 'undefined' && self !== null) {
    self.P = self.Promise;
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"./browser":3,"_process":23,"timers":24}],3:[function(require,module,exports){
// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var dom = new DOMParser();

var browser = {
    storageGet: function storageGet(keys, callback) {
        return chrome.storage.local.get(keys, callback);
    },
    storageSet: function storageSet(obj, callback) {
        return chrome.storage.local.set(obj, callback);
    },
    prefsGet: function prefsGet(keys, callback) {
        return chrome.storage.local.get(keys, callback);
    },
    prefsSet: function prefsSet(obj, callback) {
        return chrome.storage.local.set(obj, callback);
    },
    storageRemove: function storageRemove(key, callback) {
        return chrome.storage.local.remove(key, function () {
            if (callback != null) {
                return callback();
            }
        });
    },
    prefsOnChanged: function prefsOnChanged(keys, callback) {
        return chrome.storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'local' && keys.filter(function (x) {
                return x in changes;
            }).length > 0) {
                return callback();
            }
        });
    },
    tabsGetActive: function tabsGetActive(callback) {
        return chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length >= 1) {
                return callback(tabs[0]);
            } else {
                return callback(null);
            }
        });
    },
    tabsQuery: function tabsQuery(obj, callback) {
        return chrome.tabs.query(obj, callback);
    },
    tabsUpdate: function tabsUpdate(tab, url) {
        return chrome.tabs.update(tab.id, { url: url });
    },
    tabsReload: function tabsReload(tab) {
        return chrome.tabs.reload(tab.id);
    },
    tabsActivate: function tabsActivate(tab) {
        return chrome.tabs.update(tab.id, { active: true });
    },
    tabsCreate: function tabsCreate(url) {
        return chrome.tabs.create({ url: url, active: true });
    },
    tabsOnUpdated: function tabsOnUpdated(callback) {
        chrome.tabs.onUpdated.addListener(callback);
        chrome.tabs.onActivated.addListener(callback);
        return chrome.windows.onFocusChanged.addListener(callback);
    },
    getBackgroundPage: function getBackgroundPage(callback) {
        return chrome.runtime.getBackgroundPage(callback);
    },
    getURL: function getURL(url) {
        return chrome.extension.getURL(url);
    },
    setBadge: function setBadge(obj) {
        if (obj.color != null) {
            chrome.browserAction.setBadgeBackgroundColor({ color: obj.color });
        }
        if (obj.text != null) {
            return chrome.browserAction.setBadgeText({ text: obj.text });
        }
    },
    notificationsCreate: function notificationsCreate(obj, callback) {
        return chrome.notifications.create('', obj, callback);
    },
    paste: function paste() {
        var textarea = document.getElementById('pastebox');
        console.log('textarea', textarea);
        textarea.focus();
        document.execCommand('Paste');
        console.log(textarea.value);
        return textarea.value;
    },
    copy: function copy(text) {
        var textarea = document.getElementById('pastebox');
        textarea.value = text;
        textarea.select();
        document.execCommand('SelectAll');
        return document.execCommand('Cut');
    },
    setTimeout: function (_setTimeout) {
        function setTimeout(_x, _x2) {
            return _setTimeout.apply(this, arguments);
        }

        setTimeout.toString = function () {
            return _setTimeout.toString();
        };

        return setTimeout;
    }(function (callback, time) {
        return setTimeout(callback, time);
    }),
    clearTimeout: function (_clearTimeout) {
        function clearTimeout(_x3) {
            return _clearTimeout.apply(this, arguments);
        }

        clearTimeout.toString = function () {
            return _clearTimeout.toString();
        };

        return clearTimeout;
    }(function (id) {
        return clearTimeout(id);
    }),
    parseDOM: function parseDOM(str) {
        return dom.parseFromString(str, 'text/html');
    },
    getCookies: function getCookies(obj) {
        return new Promise(function (resolve, reject) {
            chrome.cookies.getAll(obj, function (cookies) {
                if (cookies == null) {
                    reject();
                } else {
                    resolve(cookies);
                }
            });
        });
    },
    setCookie: function setCookie(cookie) {
        return new Promise(function (resolve, reject) {
            chrome.cookies.set(cookie, function (details) {
                if (details == null) {
                    reject();
                } else {
                    resolve(details);
                }
            });
        });
    },
    removeCookie: function removeCookie(obj) {
        return new Promise(function (resolve, reject) {
            chrome.cookies.remove(obj, function (details) {
                if (details == null) {
                    reject();
                } else {
                    resolve(details);
                }
            });
        });
    }
};

exports.browser = browser;
exports.XMLHttpRequest = XMLHttpRequest;

},{}],4:[function(require,module,exports){
module.exports={
"Argentina"           : "AR",
"Armenia"             : "AM",
"Australia"           : "AU",
"Austria"             : "AT",
"Azerbaijan"          : "AZ",
"Bahrain"             : "BH",
"Belarus"             : "BY",
"Belgium"             : "BE",
"Bolivia"             : "BO",
"Bosnia"              : "BA",
"Botswana"            : "BW",
"Brazil"              : "BR",
"Bulgaria"            : "BG",
"Burundi"             : "BI",
"Canada"              : "CA",
"Centrafrique"        : "CF",
"Chile"               : "CL",
"China"               : "CN",
"Colombia"            : "CO",
"Costa Rica"          : "CR",
"Croatia"             : "HR",
"Cyprus"              : "CY",
"Czech Republic"      : "CZ",
"Denmark"             : "DK",
"Dominican Republic"  : "DO",
"Ecuador"             : "EC",
"Egypt"               : "EG",
"Estonia"             : "EE",
"Finland"             : "FI",
"France"              : "FR",
"Germany"             : "DE",
"Ghana"               : "GH",
"Greece"              : "GR",
"Guatemala"           : "GT",
"Hong Kong"           : "HK",
"Hungary"             : "HU",
"Iceland"             : "IS",
"India"               : "IN",
"Indonesia"           : "ID",
"Ireland"             : "IE",
"Israel"              : "IL",
"Italy"               : "IT",
"Jamaica"             : "JM",
"Japan"               : "JP",
"Jordan"              : "JO",
"Kenya"               : "KE",
"Korea"               : "KR",
"Kuwait"              : "KW",
"Latvia"              : "LV",
"Lebanon"             : "LB",
"Lesotho"             : "LS",
"Liberia"             : "LR",
"Libya"               : "LY",
"Lichtenstein"        : "LI",
"Lithuania"           : "LT",
"Luxembourg"          : "LU",
"Macedonia"           : "MK",
"Madagascar"          : "MG",
"Malawi"              : "MW",
"Malaysia"            : "MY",
"Malta"               : "MT",
"Mauritius"           : "MU",
"Mexico"              : "MX",
"Moldova"             : "MD",
"Montenegro"          : "ME",
"Morocco"             : "MA",
"Mozambique"          : "MZ",
"Namibia"             : "NA",
"Netherlands"         : "NL",
"New Zealand"         : "NZ",
"Nigeria"             : "NG",
"Norway"              : "NO",
"Oman"                : "OM",
"Pakistan"            : "PK",
"Panama"              : "PA",
"Peru"                : "PE",
"Philippines"         : "PH",
"Poland"              : "PL",
"Portugal"            : "PT",
"Puerto Rico"         : "PR",
"Qatar"               : "QA",
"Romania"             : "RO",
"Russian Federation"  : "RU",
"Saudi Arabia"        : "SA",
"Senegal"             : "SN",
"Serbia"              : "RS",
"Singapore"           : "SG",
"Slovakia"            : "SK",
"Slovenia"            : "SI",
"South Africa"        : "ZA",
"Spain"               : "ES",
"Sri Lanka"           : "LK",
"Sweden"              : "SE",
"Switzerland"         : "CH",
"Taiwan"              : "TW",
"Tanzania"            : "TZ",
"Thailand"            : "TH",
"Tunisia"             : "TN",
"Turkey"              : "TR",
"Ukraine"             : "UA",
"United Arab Emirates": "AE",
"United Kingdom"      : "UK",
"United States"       : "US",
"Uruguay"             : "UY",
"Venezuela"           : "VE",
"Viet Nam"            : "VN",
"Zambia"              : "ZM",
"Zimbabwe"            : "ZW",
"Other"               : "Other"
}

},{}],5:[function(require,module,exports){
module.exports={
"sites" :{
    "AT": "://www.digikey.at",
    "AU": "://www.digikey.com.au",
    "BE": "://www.digikey.be",
    "CA": "://www.digikey.ca",
    "CH": "://www.digikey.ch",
    "CN": "://www.digikey.cn",
    "DE": "://www.digikey.de",
    "DK": "://www.digikey.dk",
    "ES": "://www.digikey.es",
    "FI": "://www.digikey.fi",
    "FR": "://www.digikey.fr",
    "GR": "://www.digikey.gr",
    "HK": "://www.digikey.hk",
    "IE": "://www.digikey.ie",
    "IL": "://www.digikey.co.il",
    "IT": "://www.digikey.it",
    "US/International": "://www.digikey.com",
    "JP": "://www.digikey.jp",
    "KR": "://www.digikey.kr",
    "LU": "://www.digikey.lu",
    "MX": "://www.digikey.com.mx",
    "NL": "://www.digikey.nl",
    "NO": "://www.digikey.no",
    "NZ": "://www.digikey.co.nz",
    "PT": "://www.digikey.pt",
    "SE": "://www.digikey.se",
    "SG": "://www.digikey.sg",
    "TW": "://www.digikey.tw",
    "UK": "://www.digikey.co.uk"},

"carts" : "/ordering/shoppingcart",
"addlines" : "/classic/Ordering/fastadd.aspx",
"addline_params" : "",

"lookup" : {
    "AE": "US/International",
    "AM": "US/International",
    "AR": "US/International",
    "AT": "AT",
    "AU": "AU",
    "AZ": "US/International",
    "BA": "US/International",
    "BE": "BE",
    "BG": "US/International",
    "BH": "US/International",
    "BI": "US/International",
    "BO": "US/International",
    "BR": "US/International",
    "BW": "US/International",
    "BY": "US/International",
    "CA": "CA",
    "CF": "US/International",
    "CH": "CH",
    "CL": "US/International",
    "CN": "CN",
    "CO": "US/International",
    "CR": "US/International",
    "CY": "US/International",
    "CZ": "US/International",
    "DE": "DE",
    "DK": "DK",
    "DO": "US/International",
    "EC": "US/International",
    "EE": "US/International",
    "EG": "US/International",
    "ES": "ES",
    "FI": "FI",
    "FR": "FR",
    "GH": "US/International",
    "GR": "GR",
    "GT": "US/International",
    "HK": "HK",
    "HR": "US/International",
    "HU": "US/International",
    "ID": "US/International",
    "IE": "IE",
    "IL": "IL",
    "IN": "US/International",
    "IS": "US/International",
    "IT": "IT",
    "JM": "US/International",
    "JO": "US/International",
    "JP": "JP",
    "KE": "US/International",
    "KR": "KR",
    "KW": "US/International",
    "LB": "US/International",
    "LI": "US/International",
    "LK": "US/International",
    "LR": "US/International",
    "LS": "US/International",
    "LT": "US/International",
    "LU": "LU",
    "LV": "US/International",
    "LY": "US/International",
    "MA": "US/International",
    "MD": "US/International",
    "ME": "US/International",
    "MG": "US/International",
    "MK": "US/International",
    "MT": "US/International",
    "MU": "US/International",
    "MW": "US/International",
    "MX": "MX",
    "MY": "US/International",
    "MZ": "US/International",
    "NA": "US/International",
    "NG": "US/International",
    "NL": "NL",
    "NO": "NO",
    "NZ": "NZ",
    "OM": "US/International",
    "PA": "US/International",
    "PE": "US/International",
    "PH": "US/International",
    "PK": "US/International",
    "PL": "US/International",
    "PR": "US/International",
    "PT": "PT",
    "QA": "US/International",
    "RO": "US/International",
    "RS": "US/International",
    "RU": "US/International",
    "SA": "US/International",
    "SE": "SE",
    "SG": "SG",
    "SI": "US/International",
    "SK": "US/International",
    "SN": "US/International",
    "TH": "US/International",
    "TN": "US/International",
    "TR": "US/International",
    "TW": "TW",
    "TZ": "US/International",
    "UA": "US/International",
    "UK": "UK",
    "US": "US/International",
    "UY": "US/International",
    "VE": "US/International",
    "VN": "US/International",
    "ZA": "US/International",
    "ZM": "US/International",
    "ZW": "US/International",
    "Other": "US/International"
}}

},{}],6:[function(require,module,exports){
module.exports={
"sites" :{
  "AT": "://at.farnell.com",
  "BE": "://be.farnell.com",
  "BG": "://bg.farnell.com",
  "CZ": "://cz.farnell.com",
  "DK": "://dk.farnell.com",
  "EE": "://ee.farnell.com",
  "FI": "://fi.farnell.com",
  "FR": "://fr.farnell.com",
  "DE": "://de.farnell.com",
  "HU": "://hu.farnell.com",
  "IE": "://ie.farnell.com",
  "IL": "://il.farnell.com",
  "IT": "://it.farnell.com",
  "LV": "://lv.farnell.com",
  "LT": "://lt.farnell.com",
  "NL": "://nl.farnell.com",
  "NO": "://no.farnell.com",
  "PL": "://pl.farnell.com",
  "PT": "://pt.farnell.com",
  "RO": "://ro.farnell.com",
  "RU": "://ru.farnell.com",
  "SK": "://sk.farnell.com",
  "SI": "://si.farnell.com",
  "ES": "://es.farnell.com",
  "SE": "://se.farnell.com",
  "CH": "://ch.farnell.com",
  "TR": "://tr.farnell.com",
  "UK": "://uk.farnell.com",
  "NO": "://no.farnell.com",
  "SE": "://se.farnell.com",
  "AU": "://au.element14.com",
  "CN": "://cn.element14.com",
  "HK": "://hk.element14.com",
  "IN": "://in.element14.com",
  "KR": "://kr.element14.com",
  "MY": "://my.element14.com",
  "NZ": "://nz.element14.com",
  "PH": "://ph.element14.com",
  "SG": "://sg.element14.com",
  "TW": "://tw.element14.com",
  "TH": "://th.element14.com",
  "International": "://export.farnell.com"
},

"carts": "/jsp/shoppingCart/shoppingCart.jsp",
"addlines": "/jsp/shoppingCart/quickPaste.jsp?_DARGS=/jsp/shoppingCart/fragments/quickPaste/quickPaste.jsp.quickpaste",
"addline_params" : "",

"lookup" : {
    "AE": "International",
    "AU": "AU",
    "AM": "International",
    "AR": "International",
    "AT": "AT",
    "AZ": "International",
    "BA": "International",
    "BE": "BE",
    "BG": "BG",
    "BO": "International",
    "BR": "International",
    "BY": "International",
    "CA": "International",
    "CH": "CH",
    "CL": "International",
    "CN": "CN",
    "CO": "International",
    "CR": "International",
    "CY": "International",
    "CZ": "CZ",
    "DE": "DE",
    "DK": "DK",
    "DO": "International",
    "EC": "International",
    "EE": "EE",
    "EG": "International",
    "ES": "ES",
    "FI": "FI",
    "FR": "FR",
    "GR": "International",
    "GT": "International",
    "HK": "HK",
    "HR": "International",
    "HU": "HU",
    "ID": "International",
    "IE": "IE",
    "IL": "IL",
    "IN": "IN",
    "IS": "International",
    "IT": "IT",
    "International": "International",
    "JM": "International",
    "JP": "International",
    "KR": "KR",
    "LB": "International",
    "LK": "International",
    "LT": "LT",
    "LU": "International",
    "LI": "International",
    "LV": "LV",
    "MA": "International",
    "MD": "International",
    "MK": "International",
    "MX": "International",
    "MY": "MY",
    "NL": "NL",
    "NO": "NO",
    "NZ": "NZ",
    "PA": "International",
    "PE": "International",
    "PH": "PH",
    "PK": "International",
    "PL": "PL",
    "PR": "International",
    "PT": "PT",
    "RO": "RO",
    "RS": "International",
    "RU": "RU",
    "SA": "International",
    "SE": "SE",
    "SG": "SG",
    "SI": "SI",
    "SK": "SK",
    "TH": "TH",
    "TN": "International",
    "TR": "TR",
    "TW": "TW",
    "UA": "RU",
    "UK": "UK",
    "US": "International",
    "US/International": "International",
    "UY": "International",
    "VE": "International",
    "VN": "International",
    "ZA": "International",
    "BH": "International",
    "BW": "International",
    "BI": "International",
    "CF": "International",
    "GH": "International",
    "JO": "International",
    "KE": "International",
    "KW": "International",
    "LS": "International",
    "LR": "International",
    "LY": "International",
    "MG": "International",
    "MW": "International",
    "MU": "International",
    "ME": "International",
    "MT": "International",
    "MZ": "International",
    "NA": "International",
    "NG": "International",
    "OM": "International",
    "QA": "International",
    "SN": "International",
    "TZ": "International",
    "ZM": "International",
    "ZW": "International",
    "Other": "International"
}}

},{}],7:[function(require,module,exports){
module.exports={
    "sites": {
        "US": "://lcsc.com"
    },
    "carts": "/cart",
    "addlines": "",
    "addline_params": "",
    "lookup": {
        "AE": "US",
        "AM": "US",
        "AR": "US",
        "AT": "US",
        "AU": "US",
        "AZ": "US",
        "BA": "US",
        "BE": "US",
        "BG": "US",
        "BH": "US",
        "BI": "US",
        "BO": "US",
        "BR": "US",
        "BW": "US",
        "BY": "US",
        "CA": "US",
        "CF": "US",
        "CH": "US",
        "CL": "US",
        "CN": "US",
        "CO": "US",
        "CR": "US",
        "CY": "US",
        "CZ": "US",
        "DE": "US",
        "DK": "US",
        "DO": "US",
        "EC": "US",
        "EE": "US",
        "EG": "US",
        "ES": "US",
        "FI": "US",
        "FR": "US",
        "GH": "US",
        "GR": "US",
        "GT": "US",
        "HK": "US",
        "HR": "US",
        "HU": "US",
        "ID": "US",
        "IE": "US",
        "IL": "US",
        "IN": "US",
        "IS": "US",
        "IT": "US",
        "JM": "US",
        "JO": "US",
        "JP": "US",
        "KE": "US",
        "KR": "US",
        "KW": "US",
        "LB": "US",
        "LI": "US",
        "LK": "US",
        "LR": "US",
        "LS": "US",
        "LT": "US",
        "LU": "US",
        "LV": "US",
        "LY": "US",
        "MA": "US",
        "MD": "US",
        "ME": "US",
        "MG": "US",
        "MK": "US",
        "MT": "US",
        "MU": "US",
        "MW": "US",
        "MX": "US",
        "MY": "US",
        "MZ": "US",
        "NA": "US",
        "NG": "US",
        "NL": "US",
        "NO": "US",
        "NZ": "US",
        "OM": "US",
        "PA": "US",
        "PE": "US",
        "PH": "US",
        "PK": "US",
        "PL": "US",
        "PR": "US",
        "PT": "US",
        "QA": "US",
        "RO": "US",
        "RS": "US",
        "RU": "US",
        "SA": "US",
        "SE": "US",
        "SG": "US",
        "SI": "US",
        "SK": "US",
        "SN": "US",
        "TH": "US",
        "TN": "US",
        "TR": "US",
        "TW": "US",
        "TZ": "US",
        "UA": "US",
        "UK": "US",
        "US": "US",
        "UY": "US",
        "VE": "US",
        "VN": "US",
        "ZA": "US",
        "ZM": "US",
        "ZW": "US",
        "Other": "US"
    }
}

},{}],8:[function(require,module,exports){
module.exports={
"sites" : {
    "AR":"://ar.mouser.com",
    "AT":"://www.mouser.at",
    "AU":"://au.mouser.com",
    "BE":"://www.mouser.be",
    "BG":"://www.mouser.bg",
    "BR":"://br.mouser.com",
    "CA":"://ca.mouser.com",
    "CH":"://www.mouser.ch",
    "CL":"://www.mouser.cl",
    "CN":"://cn.mouser.com",
    "CO":"://co.mouser.com",
    "CR":"://cr.mouser.com",
    "CZ":"://cz.mouser.com",
    "DE":"://www.mouser.de",
    "DK":"://dk.mouser.com",
    "DO":"://www.mouser.do",
    "EC":"://www.mouser.ec",
    "EE":"://www.mouser.ee",
    "ES":"://www.mouser.es",
    "EU":"://eu.mouser.com",
    "FI":"://fi.mouser.com",
    "FR":"://www.mouser.fr",
    "GR":"://gr.mouser.com",
    "GT":"://gt.mouser.com",
    "HK":"://www.mouser.hk",
    "HN":"://www.mouser.hn",
    "HR":"://hr.mouser.com",
    "HU":"://hu.mouser.com",
    "ID":"://id.mouser.com",
    "IE":"://www.mouser.ie",
    "IL":"://il.mouser.com",
    "IN":"://www.mouser.in",
    "IT":"://www.mouser.it",
    "JP":"://www.mouser.jp",
    "KR":"://kr.mouser.com",
    "LI":"://www.mouser.li",
    "LU":"://www.mouser.lu",
    "MX":"://www.mouser.mx",
    "MY":"://my.mouser.com",
    "NL":"://nl.mouser.com",
    "NO":"://no.mouser.com",
    "NZ":"://nz.mouser.com",
    "PE":"://www.mouser.pe",
    "PH":"://www.mouser.ph",
    "PL":"://pl.mouser.com",
    "PR":"://www.mouser.pr",
    "PT":"://pt.mouser.com",
    "RO":"://ro.mouser.com",
    "RU":"://ru.mouser.com",
    "SE":"://se.mouser.com",
    "SG":"://www.mouser.sg",
    "SK":"://sk.mouser.com",
    "TH":"://th.mouser.com",
    "TR":"://tr.mouser.com",
    "TW":"://www.mouser.tw",
    "UK":"://www.mouser.co.uk",
    "US/International":"://www2.mouser.com",
    "UY":"://uy.mouser.com",
    "VE":"://ve.mouser.com",
    "VN":"://vn.mouser.com",
    "ZA":"://za.mouser.com"},

"carts": "/cart/",
"addlines": "/cart/ezbuy",
"addline_params" : "__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=",

"lookup" : {
    "AE": "US/International",
    "AM": "EU",
    "AR": "EU",
    "AT": "AT",
    "AU": "AU",
    "AZ": "US/International",
    "BA": "EU",
    "BE": "BE",
    "BG": "BG",
    "BH": "US/International",
    "BI": "US/International",
    "BO": "US/International",
    "BR": "BR",
    "BW": "US/International",
    "BY": "EU",
    "CA": "CA",
    "CF": "US/International",
    "CH": "CH",
    "CL": "CL",
    "CN": "CN",
    "CO": "CO",
    "CR": "CR",
    "CY": "EU",
    "CZ": "CZ",
    "DE": "DE",
    "DK": "DK",
    "DO": "DO",
    "EC": "EC",
    "EE": "EE",
    "EG": "US/International",
    "ES": "ES",
    "EU": "EU",
    "FI": "FI",
    "FR": "FR",
    "GH": "US/International",
    "GR": "GR",
    "GT": "GT",
    "HK": "HK",
    "HN": "HN",
    "HR": "HR",
    "HU": "HU",
    "ID": "ID",
    "IE": "IE",
    "IL": "IL",
    "IN": "IN",
    "IS": "EU",
    "IT": "IT",
    "JM": "US/International",
    "JO": "US/International",
    "JP": "JP",
    "KE": "US/International",
    "KR": "KR",
    "KW": "US/International",
    "LB": "US/International",
    "LI": "LI",
    "LK": "US/International",
    "LR": "US/International",
    "LS": "US/International",
    "LT": "EU",
    "LU": "LU",
    "LV": "EU",
    "LY": "US/International",
    "MA": "US/International",
    "MD": "EU",
    "ME": "US/International",
    "MG": "US/International",
    "MK": "EU",
    "MT": "US/International",
    "MU": "US/International",
    "MW": "US/International",
    "MX": "MX",
    "MY": "MY",
    "MZ": "US/International",
    "NA": "US/International",
    "NG": "US/International",
    "NL": "NL",
    "NO": "NO",
    "NZ": "NZ",
    "OM": "US/International",
    "PA": "US/International",
    "PE": "PE",
    "PH": "PH",
    "PK": "US/International",
    "PL": "PL",
    "PR": "PR",
    "PT": "PT",
    "QA": "US/International",
    "RO": "RO",
    "RS": "EU",
    "RU": "RU",
    "SA": "US/International",
    "SE": "SE",
    "SG": "SG",
    "SI": "EU",
    "SK": "SK",
    "SN": "US/International",
    "TH": "TH",
    "TN": "US/International",
    "TR": "TR",
    "TW": "TW",
    "TZ": "US/International",
    "UA": "US/International",
    "UK": "UK",
    "US": "US/International",
    "UY": "UY",
    "VE": "VE",
    "VN": "VN",
    "ZA": "ZA",
    "ZM": "US/International",
    "ZW": "US/International",
    "Other": "US/International"}
}

},{}],9:[function(require,module,exports){
module.exports={
    "sites": {
        "US": "://www.newark.com"
    },
    "carts": "/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView",
    "addlines": "",
    "addline_params": "",
    "lookup": {
        "AE": "US",
        "AM": "US",
        "AR": "US",
        "AT": "US",
        "AU": "US",
        "AZ": "US",
        "BA": "US",
        "BE": "US",
        "BG": "US",
        "BH": "US",
        "BI": "US",
        "BO": "US",
        "BR": "US",
        "BW": "US",
        "BY": "US",
        "CA": "US",
        "CF": "US",
        "CH": "US",
        "CL": "US",
        "CN": "US",
        "CO": "US",
        "CR": "US",
        "CY": "US",
        "CZ": "US",
        "DE": "US",
        "DK": "US",
        "DO": "US",
        "EC": "US",
        "EE": "US",
        "EG": "US",
        "ES": "US",
        "FI": "US",
        "FR": "US",
        "GH": "US",
        "GR": "US",
        "GT": "US",
        "HK": "US",
        "HR": "US",
        "HU": "US",
        "ID": "US",
        "IE": "US",
        "IL": "US",
        "IN": "US",
        "IS": "US",
        "IT": "US",
        "JM": "US",
        "JO": "US",
        "JP": "US",
        "KE": "US",
        "KR": "US",
        "KW": "US",
        "LB": "US",
        "LI": "US",
        "LK": "US",
        "LR": "US",
        "LS": "US",
        "LT": "US",
        "LU": "US",
        "LV": "US",
        "LY": "US",
        "MA": "US",
        "MD": "US",
        "ME": "US",
        "MG": "US",
        "MK": "US",
        "MT": "US",
        "MU": "US",
        "MW": "US",
        "MX": "US",
        "MY": "US",
        "MZ": "US",
        "NA": "US",
        "NG": "US",
        "NL": "US",
        "NO": "US",
        "NZ": "US",
        "OM": "US",
        "PA": "US",
        "PE": "US",
        "PH": "US",
        "PK": "US",
        "PL": "US",
        "PR": "US",
        "PT": "US",
        "QA": "US",
        "RO": "US",
        "RS": "US",
        "RU": "US",
        "SA": "US",
        "SE": "US",
        "SG": "US",
        "SI": "US",
        "SK": "US",
        "SN": "US",
        "TH": "US",
        "TN": "US",
        "TR": "US",
        "TW": "US",
        "TZ": "US",
        "UA": "US",
        "UK": "US",
        "US": "US",
        "UY": "US",
        "VE": "US",
        "VN": "US",
        "ZA": "US",
        "ZM": "US",
        "ZW": "US",
        "Other": "US"
    }
}

},{}],10:[function(require,module,exports){
module.exports={
    "sites": {
        "UK": "://www.rapidonline.com"
    },
    "carts": "/Checkout/Basket",
    "addlines": "",
    "addline_params": "",
    "lookup": {
        "AE": "UK",
        "AM": "UK",
        "AR": "UK",
        "AT": "UK",
        "AU": "UK",
        "AZ": "UK",
        "BA": "UK",
        "BE": "UK",
        "BG": "UK",
        "BH": "UK",
        "BI": "UK",
        "BO": "UK",
        "BR": "UK",
        "BW": "UK",
        "BY": "UK",
        "CA": "UK",
        "CF": "UK",
        "CH": "UK",
        "CL": "UK",
        "CN": "UK",
        "CO": "UK",
        "CR": "UK",
        "CY": "UK",
        "CZ": "UK",
        "DE": "UK",
        "DK": "UK",
        "DO": "UK",
        "EC": "UK",
        "EE": "UK",
        "EG": "UK",
        "ES": "UK",
        "FI": "UK",
        "FR": "UK",
        "GH": "UK",
        "GR": "UK",
        "GT": "UK",
        "HK": "UK",
        "HR": "UK",
        "HU": "UK",
        "ID": "UK",
        "IE": "UK",
        "IL": "UK",
        "IN": "UK",
        "IS": "UK",
        "IT": "UK",
        "JM": "UK",
        "JO": "UK",
        "JP": "UK",
        "KE": "UK",
        "KR": "UK",
        "KW": "UK",
        "LB": "UK",
        "LI": "UK",
        "LK": "UK",
        "LR": "UK",
        "LS": "UK",
        "LT": "UK",
        "LU": "UK",
        "LV": "UK",
        "LY": "UK",
        "MA": "UK",
        "MD": "UK",
        "ME": "UK",
        "MG": "UK",
        "MK": "UK",
        "MT": "UK",
        "MU": "UK",
        "MW": "UK",
        "MX": "UK",
        "MY": "UK",
        "MZ": "UK",
        "NA": "UK",
        "NG": "UK",
        "NL": "UK",
        "NO": "UK",
        "NZ": "UK",
        "OM": "UK",
        "PA": "UK",
        "PE": "UK",
        "PH": "UK",
        "PK": "UK",
        "PL": "UK",
        "PR": "UK",
        "PT": "UK",
        "QA": "UK",
        "RO": "UK",
        "RS": "UK",
        "RU": "UK",
        "SA": "UK",
        "SE": "UK",
        "SG": "UK",
        "SI": "UK",
        "SK": "UK",
        "SN": "UK",
        "TH": "UK",
        "TN": "UK",
        "TR": "UK",
        "TW": "UK",
        "TZ": "UK",
        "UA": "UK",
        "UK": "UK",
        "US": "UK",
        "UY": "UK",
        "VE": "UK",
        "VN": "UK",
        "ZA": "UK",
        "ZM": "UK",
        "ZW": "UK",
        "Other": "UK"
    }
}

},{}],11:[function(require,module,exports){
module.exports={
"sites": {
    "AE": "://ae.rsdelivers.com",
    "AT": "://at.rs-online.com",
    "AU": "://au.rs-online.com",
    "AZ": "://az.rsdelivers.com",
    "BE": "://befr.rs-online.com",
    "CH": "://ch.rs-online.com",
    "CL": "://cl.rsdelivers.com",
    "CN": "://china.rs-online.com",
    "CY": "://cy.rsdelivers.com",
    "CZ": "://cz.rs-online.com",
    "DE": "://de.rs-online.com",
    "DK": "://dk.rs-online.com",
    "EE": "://ee.rsdelivers.com",
    "ES": "://es.rs-online.com",
    "FI": "://fi.rsdelivers.com",
    "FR": "://fr.rs-online.com",
    "GR": "://gr.rsdelivers.com",
    "HK": "://hken.rs-online.com",
    "HR": "://hr.rsdelivers.com",
    "HU": "://hu.rs-online.com",
    "IE": "://ie.rs-online.com",
    "IL": "://il.rsdelivers.com",
    "IN": "://in.rsdelivers.com",
    "IT": "://it.rs-online.com",
    "JP": "://jp.rs-online.com",
    "KR": "://kr.rs-online.com",
    "LT": "://lt.rsdelivers.com",
    "LV": "://lv.rsdelivers.com",
    "LY": "://ly.rsdelivers.com",
    "MT": "://mt.rsdelivers.com",
    "MY": "://my.rs-online.com",
    "NL": "://nl.rs-online.com",
    "NO": "://no.rs-online.com",
    "NZ": "://nz.rs-online.com",
    "PH": "://ph.rs-online.com",
    "PL": "://pl.rs-online.com",
    "PT": "://pt.rs-online.com",
    "RO": "://ro.rsdelivers.com",
    "RU": "://ru.rsdelivers.com",
    "SA": "://sa.rsdelivers.com",
    "SE": "://se.rs-online.com",
    "SG": "://sg.rs-online.com",
    "TH": "://th.rs-online.com",
    "TR": "://tr.rsdelivers.com",
    "TW": "://twen.rs-online.com",
    "UA": "://ua.rsdelivers.com",
    "UK": "://uk.rs-online.com",
    "ZA": "://za.rs-online.com",
    "International": "://int.rsdelivers.com",
    "Export": "://export.rsdelivers.com"
},

"carts":{
    "AE": "/shoppingCart/shoppingCart",
    "AT": "/web/ca/Warenkorb/",
    "AU": "/web/ca/basketsummary/",
    "AZ": "/shoppingCart/shoppingCart",
    "BE": "/web/ca/panier/",
    "CH": "/web/ca/Warenkorb/",
    "CL": "/shoppingCart/shoppingCart.aspx",
    "CN": "/web/ca/basketsummary/",
    "CY": "/shoppingCart/shoppingCart",
    "CZ": "/web/ca/PrehledVasehokosiku/",
    "DE": "/web/ca/Warenkorb/",
    "DK": "/web/ca/oversigtindkobskurv/",
    "EE": "/shoppingCart/shoppingCart",
    "ES": "/web/ca/resumencesta/",
    "FI": "/shoppingCart/shoppingCart",
    "FR": "/web/ca/recapitulatifpanier/",
    "GR": "/ShoppingCart/ShoppingCart",
    "HK": "/web/ca/basketsummary/",
    "HR": "/shoppingCart/shoppingCart",
    "HU": "/web/ca/kosarosszegzese/",
    "IE": "/web/ca/basketsummary/",
    "IL": "/ShoppingCart/ShoppingCart",
    "IN": "/ShoppingCart/ShoppingCart",
    "IT": "/web/ca/riepilogocarrello/",
    "JP": "/web/ca/basketsummary/",
    "KR": "/web/ca/basketsummary/",
    "LT": "/ShoppingCart/ShoppingCart",
    "LV": "/shoppingCart/shoppingCart",
    "LY": "/shoppingCart/shoppingCart",
    "MT": "/shoppingCart/shoppingCart",
    "MY": "/web/ca/basketsummary/",
    "NL": "/web/ca/overzichtwinkelwagen/",
    "NO": "/web/ca/handlekurvsammendrag/",
    "NZ": "/web/ca/basketsummary/",
    "PH": "/web/ca/basketsummary/",
    "PL": "/web/ca/podsumowaniekoszyka/",
    "PT": "/web/ca/resumocarrinho/",
    "RO": "/shoppingCart/shoppingCart",
    "RU": "/shoppingCart/shoppingCart",
    "SA": "/shoppingCart/shoppingCart",
    "SE": "/web/ca/korgsammanfattning/",
    "SG": "/web/ca/basketsummary/",
    "TH": "/web/ca/basketsummary/",
    "TR": "/shoppingCart/shoppingCart",
    "TW": "/web/ca/basketsummary/",
    "UA": "/shoppingCart/shoppingCart",
    "UK": "/web/ca/basketsummary/",
    "ZA": "/web/ca/basketsummary/",
    "International": "/shoppingCart/shoppingCart",
    "Export": "/shoppingCart/shoppingCart"
},

"addlines" : "",
"addline_params" : "",

"lookup" : {
    "AE": "AE",
    "AM": "Export",
    "AO": "ZA",
    "AO": "ZA",
    "AR": "International",
    "AT": "AT",
    "AU": "AU",
    "AZ": "AZ",
    "BA": "International",
    "BE": "BE",
    "BG": "Export",
    "BH": "International",
    "BI": "ZA",
    "BO": "Export",
    "BR": "International",
    "BW": "ZA",
    "BY": "Export",
    "CA": "Export",
    "CF": "ZA",
    "CH": "CH",
    "CL": "CL",
    "CN": "CN",
    "CO": "Export",
    "CR": "Export",
    "CY": "CY",
    "CZ": "CZ",
    "DE": "DE",
    "DK": "DK",
    "DO": "Export",
    "EC": "Export",
    "EE": "EE",
    "EG": "SA",
    "ES": "ES",
    "FI": "FI",
    "FR": "FR",
    "GH": "International",
    "GR": "GR",
    "GT": "Export",
    "HK": "HK",
    "HR": "HR",
    "HU": "HU",
    "ID": "Export",
    "IE": "IE",
    "IL": "IL",
    "IN": "IN",
    "IS": "Export",
    "IT": "IT",
    "JM": "Export",
    "JO": "International",
    "JP": "JP",
    "KE": "ZA",
    "KR": "KR",
    "KW": "International",
    "LB": "International",
    "LI": "Export",
    "LK": "Export",
    "LR": "ZA",
    "LS": "ZA",
    "LT": "LT",
    "LU": "BE",
    "LV": "LV",
    "LY": "LY",
    "MA": "Export",
    "MD": "Export",
    "ME": "International",
    "MG": "ZA",
    "MK": "Export",
    "MT": "MT",
    "MU": "ZA",
    "MW": "ZA",
    "MX": "Export",
    "MY": "MY",
    "MZ": "ZA",
    "NA": "ZA",
    "NG": "International",
    "NL": "NL",
    "NO": "NO",
    "NZ": "NZ",
    "OM": "International",
    "PA": "Export",
    "PE": "International",
    "PH": "PH",
    "PK": "International",
    "PL": "PL",
    "PR": "Export",
    "PT": "PT",
    "QA": "International",
    "RO": "RO",
    "RS": "International",
    "RU": "RU",
    "SA": "SA",
    "SE": "SE",
    "SG": "SG",
    "SI": "AT",
    "SK": "Export",
    "SN": "ZA",
    "TH": "TH",
    "TN": "International",
    "TR": "TR",
    "TW": "TW",
    "TZ": "ZA",
    "UA": "UA",
    "UK": "UK",
    "US": "Export",
    "UY": "Export",
    "VE": "Export",
    "VN": "Export",
    "ZA": "ZA",
    "ZM": "ZA",
    "ZW": "ZA",
    "Other": "Export"
}}

},{}],12:[function(require,module,exports){
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface;

var http = require('./http');

var _require2 = require('./browser'),
    browser = _require2.browser;

var Digikey = function (_RetailerInterface) {
    _inherits(Digikey, _RetailerInterface);

    function Digikey(country_code, settings, callback) {
        _classCallCheck(this, Digikey);

        //make sure we have a cart cookie
        var _this = _possibleConstructorReturn(this, (Digikey.__proto__ || Object.getPrototypeOf(Digikey)).call(this, 'Digikey', country_code, 'data/digikey.json', settings, callback));

        http.get('https' + _this.site + _this.cart, { notify: false }, function () {});
        return _this;
    }

    _createClass(Digikey, [{
        key: 'clearCart',
        value: function clearCart(callback) {
            var _this2 = this;

            var url = 'https' + this.site + this.addline + '?webid=-1';
            return http.get(url, {}, function () {
                if (callback != null) {
                    callback({ success: true });
                }
                return _this2.refreshCartTabs();
            }, function () {
                if (callback != null) {
                    return callback({ success: false });
                }
            });
        }
    }, {
        key: 'openCartTab',
        value: function openCartTab() {
            var _this3 = this;

            browser.tabsQuery({ url: '*' + this.site + this.addline + '*', currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    browser.tabsActivate(tabs[tabs.length - 1]);
                } else {
                    _this3._open_tab(_this3.site + _this3.cart);
                }
            });
        }
    }, {
        key: 'addLines',
        value: function addLines(lines, callback) {
            var _this4 = this;

            if (lines.length === 0) {
                callback({ success: true, fails: [] });
                return;
            }
            return this._add_lines(lines, function (result) {
                if (callback != null) {
                    callback(result, _this4, lines);
                }
            });
        }
    }, {
        key: '_add_lines',
        value: function _add_lines(lines, callback) {
            for (var i = 0; i < lines.length / 30; i++) {
                var _30_lines = lines.slice(i * 30, i * 30 + 30);
                this._add_30_lines(_30_lines);
            }
            // we are faking success because we can't get a response from the digikey tab
            // it seems to be very reliable though
            setTimeout(function () {
                return callback({ success: true, fails: [] });
            }, 1000);
        }
    }, {
        key: '_add_30_lines',
        value: function _add_30_lines(lines) {
            var url = 'https' + this.site + this.addline;
            var params = '';
            lines.forEach(function (line, i) {
                params += (i === 0 ? '?' : '&') + ('part' + i + '=' + encodeURIComponent(line.part)) + ('&qty' + i + '=' + encodeURIComponent(line.quantity)) + ('&cref' + i + '=' + encodeURIComponent(line.reference.slice(0, 48)));
            });
            var tab = browser.tabsCreate(url + params);
        }
    }]);

    return Digikey;
}(RetailerInterface);

exports.Digikey = Digikey;

},{"./browser":3,"./http":14,"./retailer_interface":17}],13:[function(require,module,exports){
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface;

var _require2 = require('./newark'),
    Newark = _require2.Newark;

var Farnell = function (_RetailerInterface) {
    _inherits(Farnell, _RetailerInterface);

    function Farnell(country_code, settings, callback) {
        _classCallCheck(this, Farnell);

        //all Farnell sites are Newark style sites now so we use Newark's
        //methods
        var _this = _possibleConstructorReturn(this, (Farnell.__proto__ || Object.getPrototypeOf(Farnell)).call(this, 'Farnell', country_code, 'data/farnell.json', settings));

        var names = Object.getOwnPropertyNames(Newark.prototype);
        for (var index in names) {
            var method = Newark.prototype[names[index]];
            _this[names[index]] = method;
        }
        _this.cart = '/webapp/wcs/stores/servlet/AjaxOrderItemDisplayView';
        _this._set_store_id(function () {
            return callback(_this);
        });
        return _this;
    }

    return Farnell;
}(RetailerInterface);

exports.Farnell = Farnell;

},{"./newark":16,"./retailer_interface":17}],14:[function(require,module,exports){
// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.
var Promise = require('./bluebird');
Promise.config({ cancellation: true });

var _require = require('./browser'),
    browser = _require.browser,
    XMLHttpRequest = _require.XMLHttpRequest;

var _require2 = require('./badge'),
    badge = _require2.badge;

function network_callback(event, callback, error_callback) {
    var notify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (event.target.readyState === 4) {
        if (event.target.status === 200) {
            if (callback != null) {
                return callback(event.target.responseText);
            }
        } else {
            var message = event.target.status + '\n';
            message += event.target.url;
            if (notify) {
                browser.notificationsCreate({
                    type: 'basic',
                    title: 'Network Error Occured',
                    message: message,
                    iconUrl: '/images/net_error.png'
                }, function () {});
                badge.setDecaying('' + event.target.status, '#CC00FF', 3);
            }
            if (error_callback != null) {
                return error_callback(event);
            }
        }
    }
}

function post(url, params, options, callback, error_callback) {
    if (options == null) {
        options = {};
    }
    var _options = options,
        notify = _options.notify,
        timeout = _options.timeout,
        json = _options.json;

    if (notify == null) {
        notify = true;
    }
    if (timeout == null) {
        timeout = 60000;
    }
    if (json == null) {
        json = false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    if (json) {
        xhr.setRequestHeader('Content-type', 'application/JSON');
    } else {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.url = url;
    xhr.onreadystatechange = function (event) {
        network_callback(event, callback, error_callback, notify);
    };
    xhr.timeout = timeout;
    xhr.ontimedout = function (event) {
        network_callback(event, callback, error_callback, notify);
    };
    return xhr.send(params);
}

function get(url, _ref, callback, error_callback) {
    var notify = _ref.notify,
        timeout = _ref.timeout;

    if (notify == null) {
        notify = false;
    }
    if (timeout == null) {
        timeout = 60000;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.url = url;
    xhr.onreadystatechange = function (event) {
        return network_callback(event, callback, error_callback, notify);
    };
    xhr.timeout = timeout;
    xhr.ontimedout = function (event) {
        return network_callback(event, callback, error_callback, notify);
    };
    return xhr.send();
}

function getLocation(callback) {
    var used_country_codes = [];
    var countries_data = require('./data/countries.json');
    for (var _ in countries_data) {
        var code = countries_data[_];
        used_country_codes.push(code);
    }
    var url = 'https://freegeoip.kitspace.org';
    return get(url, { timeout: 30000 }, function (responseText) {
        var response = JSON.parse(responseText);
        var code = response.country_code;
        if (code === 'GB') {
            code = 'UK';
        }
        if (!__in__(code, used_country_codes)) {
            code = 'Other';
        }
        return browser.prefsSet({ country: code }, callback);
    }, function () {
        return callback();
    });
}

function promisePost(url, params, options) {
    return new Promise(function (resolve, reject) {
        post(url, params, options, resolve, reject);
    });
}

function promiseGet(url) {
    return new Promise(function (resolve, reject) {
        get(url, {}, function (responseText) {
            return resolve(browser.parseDOM(responseText));
        }, reject);
    });
}

exports.post = post;
exports.get = get;
exports.promisePost = promisePost;
exports.promiseGet = promiseGet;
exports.getLocation = getLocation;

function __in__(needle, haystack) {
    return haystack.indexOf(needle) >= 0;
}

},{"./badge":1,"./bluebird":2,"./browser":3,"./data/countries.json":4}],15:[function(require,module,exports){
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface;

var http = require('./http');

var _require2 = require('./browser'),
    browser = _require2.browser;

var Promise = require('./bluebird');
Promise.config({ cancellation: true });

var Mouser = function (_RetailerInterface) {
    _inherits(Mouser, _RetailerInterface);

    function Mouser(country_code, settings) {
        _classCallCheck(this, Mouser);

        var _this = _possibleConstructorReturn(this, (Mouser.__proto__ || Object.getPrototypeOf(Mouser)).call(this, 'Mouser', country_code, 'data/mouser.json', settings));

        _this.protocol = 'https';
        //setting our sub-domain as the sites are all linked and switching
        //countries would not register properly otherwise
        var s = country_code.toLowerCase();
        if (s === 'uk') {
            s = 'gb';
        }
        http.get('https://www.mouser.com/cs/localsitesredirect?subdomain=' + s, { notify: false });
        return _this;
    }

    _createClass(Mouser, [{
        key: 'addLines',
        value: function addLines(lines, callback) {
            var _this2 = this;

            if (lines.length === 0) {
                callback({ success: true, fails: [], warnings: warnings });
                return;
            }

            var _mergeSameSkus = this.mergeSameSkus(lines),
                _mergeSameSkus2 = _slicedToArray(_mergeSameSkus, 2),
                merged = _mergeSameSkus2[0],
                warnings = _mergeSameSkus2[1];

            var count = 0;
            var big_result = { success: true, fails: [], warnings: warnings };
            return this._get_token(function (token) {
                return _this2._clear_errors(token, async function () {
                    var token = await _this2._get_adding_token();
                    if (token == null) {
                        return callback({ success: false, fails: lines });
                    }
                    var result = [];
                    for (var i = 0; i < merged.length; i += 99) {
                        var _99_lines = merged.slice(i, i + 99);
                        count += 1;
                        result.push(_this2._add_lines(_99_lines, token, function (result) {
                            if (big_result.success) {
                                big_result.success = result.success;
                            }
                            big_result.fails = big_result.fails.concat(result.fails);
                            count -= 1;
                            if (count <= 0) {
                                callback(big_result, _this2, lines);
                                return _this2.refreshCartTabs();
                            }
                        }));
                    }
                    return result;
                });
            });
        }
    }, {
        key: '_get_cart_guid',
        value: async function _get_cart_guid() {
            await fetch('' + this.protocol + this.site + '/cart', {
                credentials: 'include'
            });
            var domain = this.site.replace(/^:\/\/.*?\.mouser/, '.mouser');
            var cookies = await browser.getCookies({
                domain: domain,
                name: 'CARTCOOKIEUUID'
            });
            if (cookies[0]) {
                return cookies[0].value;
            }
        }
    }, {
        key: '_add_lines',
        value: async function _add_lines(lines, token, callback) {
            var _this3 = this;

            var cartGuid = await this._get_cart_guid();
            if (cartGuid == null) {
                return callback({ success: false, fails: lines });
            }
            var url = '' + this.protocol + this.site + '/api/Cart/AddCartItems?cartGuid=' + cartGuid + '&source=SearchProductDetail';
            // this is not great, we used to remove dashes in our mouser part numbers
            // but mouser API doesn't accept those any more now, if the part doesn't
            // have dashes. below we do a search and get the mouser part number with dashes
            // from the page
            var correctedLines = await Promise.all(lines.map(async function (line) {
                if (/-/.test(line.part)) {
                    return line;
                }
                var text = await fetch('' + _this3.protocol + _this3.site + '/c/?q=' + line.part).then(function (r) {
                    return r.text();
                });
                try {
                    var doc = new DOMParser().parseFromString(text, 'text/html');
                    var mouserPart = doc.getElementById('spnMouserPartNumFormattedForProdInfo');
                    if (mouserPart == null) {
                        // it's a search result page, we take the first result
                        mouserPart = doc.getElementsByClassName('mpart-number-lbl')[0];
                    }
                    mouserPart = mouserPart.innerHTML.trim();
                    if (mouserPart.replace(/-/g, '') !== line.part) {
                        return { fail: line };
                    }
                    return Object.assign({}, line, { part: mouserPart });
                } catch (e) {
                    console.warn(e);
                    return { fail: line };
                }
            }));
            var fails = correctedLines.map(function (line) {
                return line.fail;
            }).filter(function (x) {
                return x;
            });
            lines = correctedLines.filter(function (x) {
                return x.fail == null;
            });
            var body = lines.map(function (line) {
                return {
                    MouserPartNumber: line.part,
                    Quantity: line.quantity,
                    MouseReelRequest: 'None',
                    CustomerPartNumber: line.reference
                };
            });
            var response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }).then(function (r) {
                return r.json();
            });
            if (response.CartHasErrorItem || fails.length > 0) {
                return callback({ success: false, fails: fails });
            }
            callback({ success: true });
        }
    }, {
        key: '_get_errors',
        value: function _get_errors(responseText) {
            var doc = browser.parseDOM(responseText);
            return doc.querySelectorAll('.grid-row.row-error');
        }
    }, {
        key: '_clear_errors',
        value: function _clear_errors(token, callback) {
            var _this4 = this;

            http.get('' + this.protocol + this.site + this.cart, {}, function (responseText) {
                var errors = _this4._get_errors(responseText);
                var item_ids = [];
                for (var i = 0; i < errors.length; ++i) {
                    item_ids.push(errors[i].getAttribute('data-itemid'));
                }
                var promiseArray = item_ids.map(function (id) {
                    return http.promisePost('' + _this4.protocol + _this4.site + _this4.cart + '/cart/DeleteCartItem?cartItemId=' + id + '&page=null&grid-column=SortColumn&grid-dir=0', '__RequestVerificationToken=' + token).catch(function (e) {
                        return console.error(e);
                    });
                });
                return Promise.all(promiseArray).then(function () {
                    if (callback != null) {
                        return callback();
                    }
                });
            });
        }
    }, {
        key: 'clearCart',
        value: function clearCart(callback) {
            var _this5 = this;

            return this._get_token(function (token) {
                return _this5._clear_cart(token, callback);
            });
        }
    }, {
        key: '_clear_cart',
        value: function _clear_cart(token, callback) {
            var _this6 = this;

            var url = this.protocol + this.site + this.cart + '/cart/DeleteCart';
            var params = '__RequestVerificationToken=' + token;
            return http.post(url, params, {}, function (event) {
                if (callback != null) {
                    callback({ success: true }, _this6);
                }
                return _this6.refreshCartTabs();
            }, function () {
                if (callback != null) {
                    return callback({ success: false }, _this6);
                }
            });
        }
    }, {
        key: '_get_adding_token',
        value: function _get_adding_token(callback) {
            var url = '' + this.protocol + this.site + '/price-availability/';
            return new Promise(function (resolve, reject) {
                http.get(url, {}, function (responseText) {
                    var match = responseText.match(/name="__RequestVerificationToken" type="hidden" value="(.*?)"/);
                    if (match != null && match.length >= 2) {
                        return resolve(match[1]);
                    } else {
                        resolve(null);
                    }
                });
            });
        }
    }, {
        key: '_get_token',
        value: function _get_token(callback) {
            url = '' + this.protocol + this.site + this.cart;
            http.get(url, {}, function (responseText) {
                var doc = browser.parseDOM(responseText);
                var token = doc.querySelector('form#cart-form > input').value;
                callback(token);
            });
        }
    }]);

    return Mouser;
}(RetailerInterface);

exports.Mouser = Mouser;

function __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

},{"./bluebird":2,"./browser":3,"./http":14,"./retailer_interface":17}],16:[function(require,module,exports){
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface;

var _require2 = require('./browser'),
    browser = _require2.browser;

var http = require('./http');

var Newark = function (_RetailerInterface) {
    _inherits(Newark, _RetailerInterface);

    function Newark(country_code, settings, callback) {
        _classCallCheck(this, Newark);

        var _this = _possibleConstructorReturn(this, (Newark.__proto__ || Object.getPrototypeOf(Newark)).call(this, 'Newark', country_code, 'data/newark.json', settings));

        _this._set_store_id(function () {
            return callback(_this);
        });
        return _this;
    }

    _createClass(Newark, [{
        key: 'clearCart',
        value: function clearCart(callback) {
            var _this2 = this;

            return this._get_item_ids(function (ids) {
                return _this2._clear_cart(ids, function (obj) {
                    _this2.refreshCartTabs();
                    _this2.refreshSiteTabs();
                    if (callback != null) {
                        return callback(obj);
                    }
                });
            });
        }
    }, {
        key: '_set_store_id',
        value: function _set_store_id(callback) {
            var _this3 = this;

            var url = 'https' + this.site + this.cart;
            return http.get(url, {}, function (response) {
                var doc = browser.parseDOM(response);
                var id_elem = doc.getElementById('storeId');
                if (id_elem != null) {
                    _this3.store_id = id_elem.value;
                    return callback();
                }
            }, function () {
                return callback();
            });
        }
    }, {
        key: '_clear_cart',
        value: function _clear_cart(ids, callback) {
            var _this4 = this;

            var url = 'https' + this.site + '/webapp/wcs/stores/servlet/ProcessBasket';
            var params = 'langId=&orderId=&catalogId=&BASE_URL=BasketPage&errorViewName=BasketErrorAjaxResponse&storeId=' + this.store_id + '&URL=BasketDataAjaxResponse&calcRequired=true&orderItemDeleteAll=&isBasketUpdated=true';
            ids.forEach(function (id) {
                params += '&orderItemDelete=' + id;
            });
            return http.post(url, params, {}, function (event) {
                return callback({ success: true }, _this4);
            }, function () {
                //we actually successfully clear the cart on 404s
                return callback({ success: true }, _this4);
            });
        }
    }, {
        key: '_get_item_ids',
        value: function _get_item_ids(callback) {
            var url = 'https' + this.site + this.cart;
            return http.get(url, {}, function (responseText) {
                var doc = browser.parseDOM(responseText);
                var order_details = doc.querySelector('#order_details');
                if (order_details != null) {
                    var tbody = order_details.querySelector('tbody');
                    var inputs = tbody.querySelectorAll('input');
                } else {
                    var inputs = [];
                }
                var ids = [];
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    if (input.type === 'hidden' && /orderItem_/.test(input.id)) {
                        ids.push(input.value);
                    }
                }
                return callback(ids);
            });
        }
    }, {
        key: 'addLines',
        value: function addLines(lines, callback) {
            var _this5 = this;

            if (lines.length === 0) {
                callback({ success: true, fails: [] });
                return;
            }

            var _mergeSameSkus = this.mergeSameSkus(lines),
                _mergeSameSkus2 = _slicedToArray(_mergeSameSkus, 2),
                merged = _mergeSameSkus2[0],
                warnings = _mergeSameSkus2[1];

            lines = merged;
            return this._add_lines(lines, function (result) {
                _this5.refreshCartTabs();
                _this5.refreshSiteTabs();
                result.warnings = (result.warnings || []).concat(warnings);
                return callback(result, _this5, lines);
            });
        }
    }, {
        key: '_add_lines',
        value: function _add_lines(lines, callback) {
            var _this6 = this;

            var url = 'https' + this.site + '/AjaxPasteOrderChangeServiceItemAdd';
            return http.get(url, { notify: false }, function () {
                return _this6._add_lines_ajax(lines, callback);
            }, function () {
                return _this6._add_lines_non_ajax(lines, callback);
            });
        }
    }, {
        key: '_add_lines_non_ajax',
        value: function _add_lines_non_ajax(lines, callback) {
            var _this7 = this;

            if (lines.length === 0) {
                if (callback != null) {
                    callback({ success: true, fails: [] });
                }
                return;
            }
            var url = 'https' + this.site + '/webapp/wcs/stores/servlet/PasteOrderChangeServiceItemAdd';
            var params = 'storeId=' + this.store_id + '&catalogId=&langId=-1&omItemAdd=quickPaste&URL=AjaxOrderItemDisplayView%3FstoreId%3D10194%26catalogId%3D15003%26langId%3D-1%26quickPaste%3D*&errorViewName=QuickOrderView&calculationUsage=-1%2C-2%2C-3%2C-4%2C-5%2C-6%2C-7&isQuickPaste=true&quickPaste=';
            //&addToBasket=Add+to+Cart'
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                params += encodeURIComponent(line.part) + ',';
                params += encodeURIComponent(line.quantity) + ',';
                params += encodeURIComponent(line.reference.replace(/,/g, ' ')) + '\n';
            }
            return http.post(url, params, {}, function (responseText) {
                var doc = browser.parseDOM(responseText);
                var form_errors = doc.querySelector('#formErrors');
                var success = true;
                if (form_errors != null) {
                    success = form_errors.className !== '';
                }
                if (!success) {
                    //we find out which parts are the problem, call addLines again
                    //on the rest and concatenate the fails to the new result
                    //returning everything together to our callback
                    var fail_names = [];
                    var fails = [];
                    var retry_lines = [];
                    for (var j = 0; j < lines.length; j++) {
                        var line = lines[j];
                        var regex = new RegExp(line.part, 'g');
                        var result = regex.exec(form_errors.innerHTML);
                        if (result !== null) {
                            fail_names.push(result[0]);
                        }
                    }
                    for (var k = 0; k < lines.length; k++) {
                        var line = lines[k];
                        if (__in__(line.part, fail_names)) {
                            fails.push(line);
                        } else {
                            retry_lines.push(line);
                        }
                    }
                    return _this7._add_lines_non_ajax(retry_lines, function (result) {
                        if (callback != null) {
                            result.fails = result.fails.concat(fails);
                            result.success = false;
                            return callback(result);
                        }
                    });
                } else {
                    //success
                    if (callback != null) {
                        return callback({ success: true, fails: [] });
                    }
                }
            }, function () {
                if (callback != null) {
                    return callback({ success: false, fails: lines });
                }
            });
        }
    }, {
        key: '_add_lines_ajax',
        value: function _add_lines_ajax(lines, callback) {
            var _this8 = this;

            var result = { success: true, fails: [], warnings: [] };
            if (lines.length === 0) {
                if (callback != null) {
                    callback({ success: true, fails: [] });
                }
                return;
            }
            var url = 'https' + this.site + '/AjaxPasteOrderChangeServiceItemAdd';

            var params = 'storeId=' + this.store_id + '&catalogId=&langId=-1&omItemAdd=quickPaste&URL=AjaxOrderItemDisplayView%3FstoreId%3D10194%26catalogId%3D15003%26langId%3D-1%26quickPaste%3D*&errorViewName=QuickOrderView&calculationUsage=-1%2C-2%2C-3%2C-4%2C-5%2C-6%2C-7&isQuickPaste=true&quickPaste=';
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                params += encodeURIComponent(line.part) + ',';
                params += encodeURIComponent(line.quantity) + ',';
                var reference = line.reference.replace(/,/g, ' ');
                if (reference.length > 30) {
                    result.warnings.push('Truncated line-note when adding\n                    ' + this.name + ' line to cart: ' + line.reference);
                }
                params += encodeURIComponent(reference.substr(0, 30)) + '\n';
            }
            return http.post(url, params, {}, function (responseText) {
                var stxt = responseText.split('\n');
                var stxt2 = stxt.slice(3, stxt.length - 4 + 1);
                var stxt3 = '';
                for (var j = 0; j < stxt2.length; j++) {
                    var s = stxt2[j];
                    stxt3 += s;
                }
                var json = JSON.parse(stxt3);
                if (json.hasPartNumberErrors != null || json.hasCommentErrors != null) {
                    //we find out which parts are the problem, call addLines again
                    //on the rest and concatenate the fails to the new result
                    //returning everything together to our callback
                    var fail_names = [];
                    var fails = [];
                    var retry_lines = [];
                    for (var k in json) {
                        //the rest of the json lines are the part numbers
                        var v = json[k];
                        if (k !== 'hasPartNumberErrors' && k !== 'hasCommentErrors') {
                            fail_names.push(v[0]);
                        }
                    }
                    for (var i1 = 0; i1 < lines.length; i1++) {
                        var _line = lines[i1];
                        if (__in__(_line.part, fail_names)) {
                            fails.push(_line);
                        } else {
                            retry_lines.push(_line);
                        }
                    }
                    return _this8._add_lines_ajax(retry_lines, function (result) {
                        if (callback != null) {
                            result.fails = result.fails.concat(fails);
                            result.success = false;
                            callback(result);
                        }
                    });
                } else {
                    if (json.pfOrderErrorEnc) {
                        var _url = 'https' + _this8.site + _this8.cart + '?storeId=' + _this8.store_id + '&catalogId=15001&langId=44&pfOrderErrorEnc=' + json.pfOrderErrorEnc;
                        return http.promiseGet(_url).then(function (doc) {
                            var form_errors = doc.querySelector('#formErrors');
                            if (form_errors == null) {
                                // sometimes we don't get the right
                                // response the first time
                                return http.promiseGet(_url);
                            }
                            return doc;
                        }).then(function (doc) {
                            var form_errors = doc.querySelector('#formErrors');
                            var success = form_errors == null;
                            var fails = [];
                            if (!success) {
                                for (var _j = 0; _j < lines.length; _j++) {
                                    var _line2 = lines[_j];
                                    var regex = new RegExp(_line2.part, 'g');
                                    var _result = regex.test(form_errors.innerHTML);
                                    if (_result) {
                                        var p = _line2.part;
                                        // ignore 'needs to be order in multiples ...' and similar errors
                                        var regex_multiples = new RegExp(
                                        //english
                                        '(' + p + ' can only be ordered to a minimum)' + ('|(' + p + ' needs to be ordered in multiples of)') + ('|(' + p + ' has a pack)') + (
                                        //spanish
                                        '|(' + p + ' solo se puede pedir en cantidades m\xEDnimas de)') + ('|(' + p + ' tiene que pedirse en m\xFAltiplos de)') + ('|(' + p + ' tiene \\d+ art\xEDculos)') + (
                                        //german
                                        '|(' + p + ' muss die Mindestmenge von)') + ('|(' + p + ' muss in Staffelungen von)') + ('|(' + p + ' hat eine Verpackungsgr\xF6\xDFe von)') + (
                                        //dutch
                                        '|(' + p + ' moet worden besteld in veelvouden van)') + ('|(' + p + ' alleen worden besteld met een minimaal aantal van)') + ('|(' + p + ' heeft een pakketgrootte van)') + (
                                        //french
                                        '|(' + p + ' doit \xEAtre command\xE9 par multiple de)') + ('|(' + p + ' peut \xEAtre command\xE9 uniquement avec une quantit\xE9 minimale)') + ('|(' + p + ' est disponible par groupe de)') + (
                                        //bulgarian
                                        '|(' + p + ' \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u0435 \u043F\u043E\u0440\u044A\u0447\u0432\u0430 \u0432 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u043E\u0442)') + ('|(' + p + ' \u043C\u043E\u0436\u0435 \u0434\u0430 \u0441\u0435 \u043F\u043E\u0440\u044A\u0447\u0432\u0430 \u0441\u0430\u043C\u043E \u043F\u0440\u0438 \u043C\u0438\u043D\u0438\u043C\u0430\u043B\u043D\u043E \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043E\u0442)') + ('|(' + p + ' \u0438\u043C\u0430 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043D\u0430 \u043E\u043F\u0430\u043A\u043E\u0432\u043A\u0430\u0442\u0430 \u043E\u0442)') + (
                                        //czech
                                        '|(' + p + ' je nutn\xE9 objednat)') + ('|(' + p + ' lze objednat pouze)') + ('|(' + p + ' obsahuje v balen\xED)') + (
                                        //danish
                                        '|(Minimumsantallet ved bestilling af produkt ' + p + ')') + ('|(' + p + ' skal bestilles i antal deleligt med)') + ('|(' + p + ' har en pakkest\xF8rrelse p\xE5)') + (
                                        //estonian
                                        '|(' + p + ' tuleb tellida)') + ('|(' + p + ' minimaalne tellitav kogus on)') + ('|(' + p + ' pakend sisaldab)') + (
                                        //finish
                                        '|(' + p + ' v\xE4himm\xE4istilausm\xE4\xE4r\xE4 on)') + ('|(' + p + ' on tilattava)') + ('|(' + p + ' pakkauskoko on)') + (
                                        //hungarian
                                        '|(' + p + ' eset\xE9n a megrendelt mennyis\xE9g csak)') + ('|(' + p + ' term\xE9k csak)') + ('|(' + p + ' term\xE9k csomagm\xE9rete)') + (
                                        //italian
                                        '|(' + p + ' deve essere ordinato in multipli di)') + ('|(' + p + ' ?pu\xF2 essere ordinato solo nella quantit\xE0 minima pari a)') + ('|(della confezione del prodotto ' + p + ' \xE8 di)') + (
                                        //latvian
                                        '|(' + p + ' pas\u016Bt\u012Bjuma daudzumam ir j\u0101dal\u0101s ar)') + ('|(' + p + ' ?var pas\u016Bt\u012Bt tikai minim\u0101lo daudzumu)') + ('|(Produkta ' + p + ' iepakojum\u0101 ir)') + (
                                        //lithuanian
                                        '|(' + p + ' galima u\u017Esakyti ne ma\u017Eiau kaip)') + ('|(' + p + ' turi b\u016Bti u\u017Esakomas kartotiniais po)') + ('|(' + p + ' yra supakuotas po)') + (
                                        //norwegian
                                        '|(' + p + ' kan bare bestilles i antall delelig med)') + ('|(' + p + ' ?kan bare bestilles i minimumsantall p\xE5)') + ('|(' + p + ' leveres i pakker p\xE5)') + (
                                        //polish
                                        '|(' + p + ' nale\u017Cy zamawia\u0107 w ilo\u015Bci stanowi\u0105cej wielokrotno\u015B\u0107 liczby)') + ('|(' + p + ' minimalna ilo\u015B\u0107 zam\xF3wienia wynosi)') + ('|(' + p + ' jest sprzedawany w ilo\u015Bci)') + (
                                        //portugese (only 2 kinds it seems)
                                        '|(' + p + ' s\xF3 pode ser encomendado numa quantidade m\xEDnima de)') + ('|(' + p + ' tem um tamanho de embalagem de)') + (
                                        //romanian
                                        '|(' + p + ' ?poate fi comandat numai \xEEntr-o cantitate minim\u0103 de)') + ('|(' + p + ' trebuie comandat \xEEn cantit\u0103\u0163i multiple de)') + ('|(' + p + ' este livrat \xEEn pachete de)') + (
                                        //russian
                                        '|(' + p + ' \u0437\u0430\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0435, \u043A\u0440\u0430\u0442\u043D\u043E\u043C)') + ('|(\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u0430 ' + p + ')') + ('|(' + p + ' \u043F\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0435, \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0449\u0435\u0439)') + (
                                        //slovak
                                        '|(Produkt ' + p + ' je mo\u017En\xE9 objedna\u0165 len)') + ('|(' + p + ' ?-? \u010Eakujeme, \u017Ee ste si objednali produkt z na\u0161ej roz\u0161\xEDrenej ponuky)') + ('|(Produkt ' + p + ' je balen\xFD po)') + (
                                        //slovenian
                                        '|(' + p + ' mora biti ve\u010Dkratnik \u0161tevila)') + ('|(Najmanj\u0161a koli\u010Dina za naro\u010Dilo izdelka ' + p + ')') + ('|(' + p + ' je pakiran po)') + (
                                        //swedish
                                        '|(' + p + ' m\xE5ste best\xE4llas i multiplar om)') + ('|(' + p + ' ?kan endast best\xE4llas till ett minimiantal av)') + ('|(' + p + ' levereras i paket om)') + (
                                        //turkish
                                        '|(' + p + ' \xFCr\xFCn\xFCn\xFCn \\d+ ve katlar\u0131 olarak)') + ('|(' + p + ' \xFCr\xFCn\xFCn\xFCn ambalaj boyutu)') + (
                                        //chinese
                                        '|(\u4EA7\u54C1 ' + p + ' \u7684\u6700\u5C0F\u5305\u88C5\u4E3A)') + ('|(' + p + ' \u7684\u6700\u5C0F\u5305\u88C5\u4E3A)') + (
                                        //korean
                                        '|(' + p + ' \uC740(\uB294) 5\uC758 \uBC30\uC218\uB85C \uC8FC\uBB38\uD574\uC57C \uD569\uB2C8\uB2E4. 9\uC5D0\uC11C)') + ('|(\uC81C\uD488 ' + p + '\uC740\\(\uB294)') + (
                                        //taiwanese
                                        '|(' + p + ' \u7684\u6700\u4F4E\u8A02\u8CFC\u6578\u91CF\u662F)') + ('|(\u7522\u54C1 ' + p + ' \u4EE5 \\d+ \u500B\u9805\u76EE\u70BA)') + (
                                        //thai
                                        '|(\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D\u0E1C\u0E25\u0E34\u0E15\u0E20\u0E31\u0E13\u0E11\u0E4C ' + p + ' \u0E08\u0E33\u0E19\u0E27\u0E19)') + ('|(\u0E1C\u0E25\u0E34\u0E15\u0E20\u0E31\u0E13\u0E11\u0E4C ' + p + ' \u0E21\u0E35\u0E02\u0E19\u0E32\u0E14\u0E1A\u0E23\u0E23\u0E08\u0E38)'));
                                        var is_multiple_warning = regex_multiples.test(form_errors.innerHTML);
                                        if (!is_multiple_warning) {
                                            fails.push(_line2);
                                        }
                                    }
                                }
                            }
                            result.success = success || fails.length == 0;
                            result.fails = fails;
                            return callback(result);
                        });
                    }
                    //success
                    return callback(result);
                }
            }, function () {
                if (callback != null) {
                    return callback({
                        success: false,
                        fails: lines,
                        warnings: result.warnings
                    });
                }
            });
        }
    }]);

    return Newark;
}(RetailerInterface);

exports.Newark = Newark;

function __in__(needle, haystack) {
    return haystack.indexOf(needle) >= 0;
}

},{"./browser":3,"./http":14,"./retailer_interface":17}],17:[function(require,module,exports){
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var http = require('./http');

var _require = require('./browser'),
    browser = _require.browser;

var retailer_data = {
    Digikey: require('./data/digikey.json'),
    Mouser: require('./data/mouser.json'),
    RS: require('./data/rs.json'),
    Farnell: require('./data/farnell.json'),
    Newark: require('./data/newark.json'),
    LCSC: require('./data/lcsc.json'),
    Rapid: require('./data/rapid.json')
};

var RetailerInterface = function () {
    function RetailerInterface(name, country_code, data_path, settings, callback) {
        _classCallCheck(this, RetailerInterface);

        this.country = country_code;
        var data = retailer_data[name];
        var country_code_lookedup = data.lookup[country_code];
        if (!country_code_lookedup) {
            var error = new InvalidCountryError();
            error.message += ' \'' + country_code + '\' given to ' + name;
            throw error;
        }

        if (settings != null) {
            if (settings.carts != null) {
                data.carts = settings.carts;
            }
            if (settings.addlines != null) {
                data.addlines = settings.addlines;
            }
            if (settings.addline_params != null) {
                data.addline_params = settings.addline_params;
            }
            if (settings.name != null) {
                data.name = settings.name;
            }
            if (settings.name != null) {
                data.name = settings.name;
            }
            if (settings.language != null) {
                data.language = settings.language;
            }
        }

        this.settings = settings;

        if (typeof data.carts === 'string') {
            this.cart = data.carts;
        } else {
            this.cart = data.carts[country_code_lookedup];
        }

        if (typeof data.addlines === 'string') {
            this.addline = data.addlines;
        } else {
            this.addline = data.addlines[country_code_lookedup];
        }

        if (data.language != null) {
            this.language = data.language[country_code_lookedup];
        }

        if (settings != null && settings.site != null) {
            this.site = settings.site;
        } else {
            this.site = data.sites[country_code_lookedup];
        }

        this.addline_params = data.addline_params;
        this.name = name;
        this.icon_src = browser.getURL('images/' + this.name.toLowerCase() + '.ico');
        if (callback != null) {
            callback();
        }
    }

    _createClass(RetailerInterface, [{
        key: 'mergeSameSkus',
        value: function mergeSameSkus(lines) {
            var merged = [];
            var warnMerged = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var line = _step.value;

                    var existing = merged.findIndex(function (l) {
                        return l.part === line.part;
                    });
                    if (existing != -1) {
                        merged[existing].quantity += line.quantity;
                        merged[existing].reference += ', ' + line.reference;
                        if (!warnMerged.includes(line.part)) {
                            warnMerged.push(line.part);
                        }
                    } else {
                        merged.push(line);
                    }
                };

                for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var warnings = [];
            if (merged.length < lines.length) {
                var s = merged.length > 1 ? 's' : '';
                warnings.push({
                    title: 'Multiple lines have same ' + this.name + ' part',
                    message: 'Quanties and references are merged but expect ' + merged.length + ' line' + s + ' added to cart, not ' + lines.length + '.' + (' Part' + (warnMerged.length > 1 ? 's' : '') + ' with duplicate lines: ' + warnMerged)
                });
            }
            return [merged, warnings];
        }
    }, {
        key: 'refreshCartTabs',
        value: function refreshCartTabs() {
            var _this = this;

            //we reload any tabs with the cart URL but the path is case insensitive
            //so we use a regex. we update the matching tabs to the cart URL instead
            //of using tabs.refresh so we don't re-pass any parameters to the cart
            var re = new RegExp(this.cart, 'i');
            return browser.tabsQuery({ url: '*' + this.site + '/*' }, function (tabs) {
                tabs.forEach(function (tab) {
                    if (tab.url.match(re)) {
                        var protocol = tab.url.split('://')[0];
                        browser.tabsUpdate(tab, protocol + _this.site + _this.cart);
                    }
                });
            });
        }
    }, {
        key: 'refreshSiteTabs',
        value: function refreshSiteTabs() {
            //refresh the tabs that are not the cart url. XXX could some of the
            //passed params cause problems on, say, quick-add urls?
            return browser.tabsQuery({ url: '*' + this.site + '/*' }, function (tabs) {
                tabs.forEach(function (tab) {
                    browser.tabsReload(tab);
                });
            });
        }
    }, {
        key: '_open_tab',
        value: function _open_tab(url) {
            browser.tabsQuery({ url: '*' + url + '*', currentWindow: true }, function (tabs) {
                if (tabs && tabs.length > 0) {
                    return browser.tabsActivate(tabs[tabs.length - 1]);
                } else {
                    return browser.tabsCreate('http' + url);
                }
            });
        }
    }, {
        key: 'openCartTab',
        value: function openCartTab() {
            this._open_tab(this.site + this.cart);
        }
    }]);

    return RetailerInterface;
}();

var InvalidCountryError = function (_Error) {
    _inherits(InvalidCountryError, _Error);

    function InvalidCountryError() {
        _classCallCheck(this, InvalidCountryError);

        var _this2 = _possibleConstructorReturn(this, (InvalidCountryError.__proto__ || Object.getPrototypeOf(InvalidCountryError)).call(this));

        _this2.name = 'InvalidCountryError';
        _this2.message = 'Invalid country-code';
        return _this2;
    }

    return InvalidCountryError;
}(Error);

exports.RetailerInterface = RetailerInterface;
exports.InvalidCountryError = InvalidCountryError;

},{"./browser":3,"./data/digikey.json":5,"./data/farnell.json":6,"./data/lcsc.json":7,"./data/mouser.json":8,"./data/newark.json":9,"./data/rapid.json":10,"./data/rs.json":11,"./http":14}],18:[function(require,module,exports){
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.
var Promise = require('./bluebird');

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface;

var _require2 = require('./rs_online'),
    rsOnline = _require2.rsOnline;

var _require3 = require('./rs_delivers'),
    rsDelivers = _require3.rsDelivers;

var _require4 = require('./rs_delivers_aspx'),
    rsDeliversAspx = _require4.rsDeliversAspx;

Promise.config({ cancellation: true });

var RS = function (_RetailerInterface) {
    _inherits(RS, _RetailerInterface);

    function RS(country_code, settings, callback) {
        _classCallCheck(this, RS);

        var _this = _possibleConstructorReturn(this, (RS.__proto__ || Object.getPrototypeOf(RS)).call(this, 'RS', country_code, 'data/rs.json', settings));

        if (/web\/ca/.test(_this.cart)) {
            for (var name in rsOnline) {
                var method = rsOnline[name];
                _this[name] = method;
            }
        } else if (/\.aspx$/.test(_this.cart)) {
            for (var name in rsDeliversAspx) {
                var method = rsDeliversAspx[name];
                _this[name] = method;
            }
        } else {
            for (var name in rsDelivers) {
                var method = rsDelivers[name];
                _this[name] = method;
            }
        }
        __guardFunc__(callback, function (f) {
            return f();
        });
        return _this;
    }

    return RS;
}(RetailerInterface);

exports.RS = RS;

function __guardFunc__(func, transform) {
    return typeof func === 'function' ? transform(func) : undefined;
}

},{"./bluebird":2,"./retailer_interface":17,"./rs_delivers":19,"./rs_delivers_aspx":20,"./rs_online":21}],19:[function(require,module,exports){
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var http = require('./http');

var _require = require('./browser'),
    browser = _require.browser;

var rsDelivers = {
    clearCart: function clearCart(callback) {
        var _this = this;

        var url = 'http' + this.site + '/CheckoutServices/DeleteAllProductsInCart';
        return http.post(url, '', { json: true }, function (responseText) {
            if (callback != null) {
                callback({ success: true }, _this);
            }
            _this.refreshSiteTabs();
            return _this.refreshCartTabs();
        }, function () {
            return callback({ success: false }, _this);
        });
    },
    _clear_invalid: function _clear_invalid(callback) {
        var _this2 = this;

        return this._get_invalid_lines(function (parts) {
            return _this2._delete_invalid(parts, callback);
        });
    },
    _delete_invalid: function _delete_invalid(parts, callback) {
        var url = 'http' + this.site + '/CheckoutServices/UpdateDeleteProductsInCart';
        var promises = parts.map(function (part) {
            return http.promisePost(url, 'stockCode=' + part + '&quantity=0');
        });
        Promise.all(promises).then(callback);
    },
    _get_invalid_lines: function _get_invalid_lines(callback) {
        var url = 'http' + this.site + '/CheckoutServices/GetCartLinesHtml';
        return http.get(url, {}, function (responseText) {
            var html = responseText;
            try {
                html = JSON.parse(responseText).cartLinesHtml;
            } catch (e) {}
            var doc = browser.parseDOM(html);
            var errors = doc.getElementsByClassName('errorOrderLine');
            var ids = [];
            var parts = [];
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                parts.push(error.parentElement.nextElementSibling.querySelector('.descTd').firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.innerText.trim().replace('-', ''));
            }
            return callback(parts);
        }, function () {
            return callback([], []);
        });
    },
    addLines: function addLines(lines, callback) {
        var _this3 = this;

        if (lines.length === 0) {
            callback({ success: true, fails: [] });
            return;
        }

        var _mergeSameSkus = this.mergeSameSkus(lines),
            _mergeSameSkus2 = _slicedToArray(_mergeSameSkus, 2),
            merged = _mergeSameSkus2[0],
            warnings = _mergeSameSkus2[1];

        lines = merged;
        return this._add_lines(lines, 0, { success: true, fails: [] }, function (result) {
            result.warnings = (result.warnings || []).concat(warnings);
            callback(result, _this3, lines);
            _this3.refreshCartTabs();
            return _this3.refreshSiteTabs();
        });
    },


    //adds lines recursively in batches of 100 -- requests would timeout
    //otherwise
    _add_lines: function _add_lines(lines_incoming, i, result, callback) {
        var _this4 = this;

        if (i < lines_incoming.length) {
            var lines = lines_incoming.slice(i, i + 99 + 1);
            return this._clear_invalid(function () {
                var url = 'http' + _this4.site + '/CheckoutServices/BulkAddProducts';
                var params = 'productString=';
                lines.forEach(function (line) {
                    params += line.part + ',' + line.quantity + ',"' + line.reference + '"\n';
                });
                return http.post(url, params, function (responseText) {
                    return callback({ success: true });
                    var doc = browser.parseDOM(JSON.parse(responseText).html);
                    var success = doc.querySelector('#hidErrorAtLineLevel').value === '0';
                    if (!success) {
                        return _this4._get_invalid_lines(function (parts) {
                            var invalid = [];
                            for (var k = 0; k < lines.length; k++) {
                                var line = lines[k];
                                if (__in__(line.part, parts)) {
                                    invalid.push(line);
                                }
                            }
                            return _this4._add_lines(lines_incoming, i + 100, {
                                success: false,
                                fails: result.fails.concat(invalid)
                            }, callback);
                        });
                    } else {
                        return _this4._add_lines(lines_incoming, i + 100, result, callback);
                    }
                }, function () {
                    return _this4._add_lines(lines_incoming, i + 100, { success: false, fails: result.fails.concat(lines) }, callback);
                });
            });
        } else {
            return callback(result);
        }
    }
};

exports.rsDelivers = rsDelivers;

function __in__(needle, haystack) {
    return haystack.indexOf(needle) >= 0;
}

},{"./browser":3,"./http":14}],20:[function(require,module,exports){
var http = require('./http');

var _require = require('./browser'),
    browser = _require.browser;

var rsDeliversAspx = {
    clearCart: function clearCart(callback) {
        var _this = this;

        var url = 'http' + this.site + '/ShoppingCart/NcjRevampServicePage.aspx/EmptyCart';
        return http.post(url, '', { json: true }, function (responseText) {
            if (callback != null) {
                callback({ success: true }, _this);
            }
            _this.refreshSiteTabs();
            return _this.refreshCartTabs();
        }, function () {
            return callback({ success: false }, _this);
        });
    },
    _clear_invalid: function _clear_invalid(callback) {
        var _this2 = this;

        return this._get_invalid_line_ids(function (ids) {
            return _this2._delete_invalid(ids, callback);
        });
    },
    _delete_invalid: function _delete_invalid(ids, callback) {
        var url = 'http' + this.site + '/ShoppingCart/NcjRevampServicePage.aspx/RemoveMultiple';
        var params = '{"request":{"encodedString":"';
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            params += id + '|';
        }
        params += '"}}';
        return http.post(url, params, { json: true }, function () {
            if (callback != null) {
                return callback();
            }
        }, function () {
            if (callback != null) {
                return callback();
            }
        });
    },
    _get_invalid_line_ids: function _get_invalid_line_ids(callback) {
        var url = 'http' + this.site + '/ShoppingCart/NcjRevampServicePage.aspx/GetCartHtml';
        return http.post(url, undefined, { json: true }, function (responseText) {
            var doc = browser.parseDOM(JSON.parse(responseText).html);
            var ids = [];
            var parts = [];
            var iterable = doc.getElementsByClassName('errorOrderLine');
            for (var i = 0; i < iterable.length; i++) {
                var elem = iterable[i];
                ids.push(elem.parentElement.nextElementSibling.querySelector('.quantityTd').firstElementChild.classList[3].split('_')[1]);
                parts.push(elem.parentElement.nextElementSibling.querySelector('.descriptionTd').firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.innerText.trim());
            }
            return callback(ids, parts);
        }, function () {
            return callback([], []);
        });
    },
    addLines: function addLines(lines, callback) {
        var _this3 = this;

        if (lines.length === 0) {
            callback({ success: true, fails: [] });
            return;
        }
        return this._add_lines(lines, 0, { success: true, fails: [] }, function (result) {
            callback(result, _this3, lines);
            _this3.refreshCartTabs();
            return _this3.refreshSiteTabs();
        });
    },


    //adds lines recursively in batches of 100 -- requests would timeout
    //otherwise
    _add_lines: function _add_lines(lines_incoming, i, result, callback) {
        var _this4 = this;

        if (i < lines_incoming.length) {
            var lines = lines_incoming.slice(i, i + 99 + 1);
            return this._clear_invalid(function () {
                var url = 'http' + _this4.site + '/ShoppingCart/NcjRevampServicePage.aspx/BulkOrder';
                var params = '{"request":{"lines":"';
                for (var j = 0; j < lines.length; j++) {
                    var line = lines[j];
                    params += line.part + ',' + line.quantity + ',,' + (line.reference + '\n');
                }
                params += '"}}';
                return http.post(url, params, { json: true }, function (responseText) {
                    var doc = browser.parseDOM(JSON.parse(responseText).html);
                    var success = doc.querySelector('#hidErrorAtLineLevel').value === '0';
                    if (!success) {
                        return _this4._get_invalid_line_ids(function (ids, parts) {
                            var invalid = [];
                            for (var k = 0; k < lines.length; k++) {
                                var _line = lines[k];
                                if (__in__(_line.part, parts)) {
                                    invalid.push(_line);
                                }
                            }
                            return _this4._add_lines(lines_incoming, i + 100, {
                                success: false,
                                fails: result.fails.concat(invalid)
                            }, callback);
                        });
                    } else {
                        return _this4._add_lines(lines_incoming, i + 100, result, callback);
                    }
                }, function () {
                    return _this4._add_lines(lines_incoming, i + 100, { success: false, fails: result.fails.concat(lines) }, callback);
                });
            });
        } else {
            return callback(result);
        }
    }
};

exports.rsDeliversAspx = rsDeliversAspx;

function __in__(needle, haystack) {
    return haystack.indexOf(needle) >= 0;
}

},{"./browser":3,"./http":14}],21:[function(require,module,exports){
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var http = require('./http');

var _require = require('./browser'),
    browser = _require.browser;

var rsOnline = {
    clearCart: function clearCart(callback) {
        var _this = this;

        return this._clear_cart(function (result) {
            __guardFunc__(callback, function (f) {
                return f(result, _this);
            });
            _this.refreshCartTabs();
            return _this.refreshSiteTabs();
        });
    },
    _clear_cart: function _clear_cart(callback) {
        var url = 'https' + this.site + this.cart;
        return http.post(url, 'isRemoveAll=true', {}, function () {
            return callback({ success: true });
        }, function () {
            return callback({ success: false });
        });
    },
    _clear_invalid: function _clear_invalid() {
        var url = 'https' + this.site + this.cart;
        return this._get_invalid().then(function (ids) {
            return Promise.all(ids.map(function (id) {
                var params = 'isRemoveItem=true&basketLineId=' + id;
                return http.promisePost(url, params);
            }));
        });
    },
    addLines: function addLines(lines, callback) {
        var _this2 = this;

        if (lines.length === 0) {
            callback({ success: true, fails: [] });
            return;
        }

        var _mergeSameSkus = this.mergeSameSkus(lines),
            _mergeSameSkus2 = _slicedToArray(_mergeSameSkus, 2),
            merged = _mergeSameSkus2[0],
            warnings = _mergeSameSkus2[1];

        lines = merged;

        var add = function add(lines, callback) {
            return _this2._get_adding_viewstate(function (viewstate, form_id) {
                return _this2._add_lines(lines, viewstate, form_id, callback);
            });
        };

        var end = function end(result) {
            result.warnings = (result.warnings || []).concat(warnings);
            callback(result, _this2, lines);
            _this2.refreshCartTabs();
            _this2.refreshSiteTabs();
        };
        return this._clear_invalid().then(function () {
            add(lines, function (result) {
                if (!result.success && result.fails.length > 0) {
                    //do a second pass with corrected quantities
                    add(result.fails, end);
                } else {
                    end(result);
                }
            });
        });
    },
    _get_invalid: function _get_invalid() {
        var url = 'https' + this.site + this.cart;
        return http.promiseGet(url).then(function (doc) {
            var errors = doc.querySelectorAll('.dataRow.errorRow');
            var ids = [];
            for (var i = 0; i < errors.length; i++) {
                var id = /showConfirmDelete\('(.*?)'/.exec(errors[i].innerHTML.toString())[1];
                ids.push(id);
            }
            return ids;
        });
    },
    _get_and_correct_invalid_lines: function _get_and_correct_invalid_lines(callback) {
        var url = 'https' + this.site + this.cart;
        return http.get(url, {}, function (responseText) {
            var doc = browser.parseDOM(responseText);
            var lines = [];
            var iterable = doc.querySelectorAll('.dataRow.errorRow');
            for (var i = 0; i < iterable.length; i++) {
                var elem = iterable[i];
                var line = {};
                //detect minimimum and multiple-of quantities from description
                //and add a quantity according to those. we read the quantity
                //from the cart as this could be a line that was already in
                //the cart when we added. description is of the form:
                //blabla 10 (minimum) blablabla 10 (multiple of) blabla
                // or
                //blabla 10 (multiple of) blabla
                var descr = __guard__(__guard__(elem.previousElementSibling, function (x1) {
                    return x1.firstElementChild;
                }), function (x) {
                    return x.innerHTML;
                });
                var quantity = parseInt(__guard__(__guard__(elem.querySelector('.quantityTd'), function (x3) {
                    return x3.firstElementChild;
                }), function (x2) {
                    return x2.value;
                }));
                if (!isNaN(quantity)) {
                    var re_min_mul = /.*?(\d+)\D+?(\d+).*?/;
                    var min = __guard__(re_min_mul.exec(descr), function (x4) {
                        return x4[1];
                    });
                    if (min == null) {
                        var re_mul = /.*?(\d+).*?/;
                        var mul = parseInt(__guard__(re_mul.exec(descr), function (x5) {
                            return x5[1];
                        }));
                        if (!isNaN(mul)) {
                            line.quantity = mul - quantity % mul;
                        }
                    } else {
                        min = parseInt(min);
                        if (!isNaN(min)) {
                            line.quantity = min - quantity;
                        }
                    }
                }
                //detect part number
                var error_child = __guard__(elem.children, function (x6) {
                    return x6[1];
                });
                var error_input = __guard__(error_child, function (x7) {
                    return x7.querySelector('input');
                });
                if (error_input != null) {
                    line.part = __guard__(error_input.value, function (x8) {
                        return x8.replace(/-/g, '');
                    });
                }
                lines.push(line);
            }
            return callback(lines);
        }, function () {
            return callback([]);
        });
    },
    _add_lines: function _add_lines(lines_incoming, viewstate, form_id, callback) {
        var _this3 = this;

        var result = { success: true, fails: [] };
        if (lines_incoming.length > 500) {
            result.warnings = ['RS cart cannot hold more than 500 lines.'];
            result.fails = lines.slice(500);
            var lines = lines_incoming.slice(0, 500);
        } else {
            var lines = lines_incoming;
        }
        var url = 'https' + this.site + this.cart;
        var params = 'shoppingBasketForm=shoppingBasketForm&shoppingBasketForm%3AquickStockNo_0=&shoppingBasketForm%3AquickQty_0=&shoppingBasketForm%3AquickStockNo_1=&shoppingBasketForm%3AquickQty_1=&shoppingBasketForm%3AquickStockNo_2=&shoppingBasketForm%3AquickQty_2=&shoppingBasketForm%3AquickStockNo_3=&shoppingBasketForm%3AquickQty_3=&shoppingBasketForm%3AquickStockNo_4=&shoppingBasketForm%3AquickQty_4=&shoppingBasketForm%3AquickStockNo_5=&shoppingBasketForm%3AquickQty_5=&shoppingBasketForm%3AquickStockNo_6=&shoppingBasketForm%3AquickQty_6=&shoppingBasketForm%3AquickStockNo_7=&shoppingBasketForm%3AquickQty_7=&shoppingBasketForm%3AquickStockNo_8=&shoppingBasketForm%3AquickQty_8=&shoppingBasketForm%3AquickStockNo_9=&shoppingBasketForm%3AquickQty_9=&shoppingBasketForm%3Aj_idt3056=&shoppingBasketForm%3Aj_idt3062=&shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_listItems=';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            params += encodeURIComponent(line.part + ',' + line.quantity + ',,' + (line.reference + '\n'));
        }

        params += '&deliveryOrCollection=DELIVERY&deliveryOptionCode=5&shoppingBasketForm%3APromoCodeWidgetAction_promotionCode=&javax.faces.ViewState=' + viewstate + '&javax.faces.source=shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_quickOrderTextBoxbtn&javax.faces.partial.event=click&javax.faces.partial.execute=shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_quickOrderTextBoxbtn%20%40component&javax.faces.partial.render=%40component&org.richfaces.ajax.component=shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_quickOrderTextBoxbtn&shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_quickOrderTextBoxbtn=shoppingBasketForm%3AQuickOrderWidgetAction_quickOrderTextBox_decorate%3AQuickOrderWidgetAction_quickOrderTextBoxbtn&rfExt=null&AJAX%3AEVENTS_COUNT=1&javax.faces.partial.ajax=true';

        return http.post(url, params, {}, function () {
            return _this3._get_and_correct_invalid_lines(function (invalid_lines) {
                var success = invalid_lines.length === 0;
                var invalid = [];
                if (!success) {
                    for (var j = 0; j < lines.length; j++) {
                        var _line = lines[j];
                        for (var k = 0; k < invalid_lines.length; k++) {
                            var inv_line = invalid_lines[k];
                            if (_line.part === inv_line.part) {
                                if (inv_line.quantity != null) {
                                    _line.quantity = inv_line.quantity;
                                }
                                invalid.push(_line);
                            }
                        }
                    }
                }
                return __guardFunc__(callback, function (f) {
                    return f({
                        success: result.success && success,
                        fails: result.fails.concat(invalid),
                        warnings: result.warnings
                    }, _this3, lines_incoming);
                });
            });
        }, function () {
            return __guardFunc__(callback, function (f) {
                return f({
                    success: false,
                    fails: result.fails.concat(lines)
                }, _this3, lines_incoming);
            });
        });
    },
    _get_adding_viewstate: function _get_adding_viewstate(callback) {
        var url = 'https' + this.site + this.cart;
        return http.get(url, {}, function (responseText) {
            var doc = browser.parseDOM(responseText);
            var viewstate_element = doc.getElementById('javax.faces.ViewState');
            if (viewstate_element != null) {
                var viewstate = viewstate_element.value;
            } else {
                return callback('', '');
            }
            var content_doc = doc.getElementById('mainContent');
            //the form_id element is different values depending on signed in or
            //signed out could just hardcode them but maybe this will be more
            //future-proof?  we use a regex here as DOM select methods crash on
            //this element!
            var form_id = /shoppingBasketForm\:(j_idt\d+)/.exec(content_doc.innerHTML.toString())[1];
            return callback(viewstate, form_id);
        }, function () {
            return callback('', '');
        });
    }
};

exports.rsOnline = rsOnline;

function __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

function __guardFunc__(func, transform) {
    return typeof func === 'function' ? transform(func) : undefined;
}

},{"./browser":3,"./http":14}],22:[function(require,module,exports){
// The contents of this file are subject to the Common Public Attribution
// License Version 1.0 (the “License”); you may not use this file except in
// compliance with the License. You may obtain a copy of the License at
// http://1clickBOM.com/LICENSE. The License is based on the Mozilla Public
// License Version 1.1 but Sections 14 and 15 have been added to cover use of
// software over a computer network and provide for limited attribution for the
// Original Developer. In addition, Exhibit A has been modified to be consistent
// with Exhibit B.
//
// Software distributed under the License is distributed on an
// "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
// the License for the specific language governing rights and limitations under
// the License.
//
// The Original Code is 1clickBOM.
//
// The Original Developer is the Initial Developer. The Original Developer of
// the Original Code is Kaspar Emanuel.

var _require = require('./retailer_interface'),
    RetailerInterface = _require.RetailerInterface,
    InvalidCountryError = _require.InvalidCountryError;

var _require2 = require('./digikey'),
    Digikey = _require2.Digikey;

var _require3 = require('./farnell'),
    Farnell = _require3.Farnell;

var _require4 = require('./mouser'),
    Mouser = _require4.Mouser;

var _require5 = require('./rs'),
    RS = _require5.RS;

var _require6 = require('./newark'),
    Newark = _require6.Newark;

var qunit = require('./qunit-1.11.0');

var _require7 = require('./browser'),
    browser = _require7.browser;

var module = qunit.module;
var test = qunit.test;
var ok = qunit.ok;
var throws = qunit.throws;
var deepEqual = qunit.deepEqual;


var countries = require('./data/countries.json');

module('unit');

test('Digikey: Constructs for all countries', function () {
    return function () {
        var result = [];
        for (var country in countries) {
            var code = countries[country];
            result.push(ok(new Digikey(code, {}, function () {}) instanceof RetailerInterface, country + ' ' + code));
        }
        return result;
    }();
});

test('Farnell: Constructs for all countries', function () {
    return function () {
        var result = [];
        for (var country in countries) {
            var code = countries[country];
            result.push(ok(new Farnell(code, {}, function () {}) instanceof RetailerInterface, country + ' ' + code));
        }
        return result;
    }();
});

test('Mouser: Constructs for all countries', function () {
    return (
        //this test might time-out because it sends a lot of requests
        function () {
            var result = [];
            for (var country in countries) {
                var code = countries[country];
                result.push(ok(new Mouser(code) instanceof RetailerInterface, country + ' ' + code));
            }
            return result;
        }()
    );
});

test('RS: Constructs for all countries', function () {
    return function () {
        var result = [];
        for (var country in countries) {
            var code = countries[country];
            result.push(ok(new RS(code) instanceof RetailerInterface, country + ' ' + code));
        }
        return result;
    }();
});

test('Newark: Constructs for all countries', function () {
    return function () {
        var result = [];
        for (var country in countries) {
            var code = countries[country];
            result.push(ok(new Newark(code, {}, function () {}) instanceof RetailerInterface, country + ' ' + code));
        }
        return result;
    }();
});

test('InvalidCountryError Exists', function () {
    return ok(new InvalidCountryError() instanceof Error);
});

test('Digikey: InvalidCountryError Thrown', function () {
    throws(function () {
        return new Digikey('XX', {}, function () {});
    });
});

test('Farnell: InvalidCountryError Thrown', function () {
    throws(function () {
        return new Farnell('XX', {}, function () {});
    });
});

test('Mouser: InvalidCountryError Thrown', function () {
    throws(function () {
        return new Mouser('XX', {}, function () {});
    });
});

test('RS: InvalidCountryError Thrown', function () {
    throws(function () {
        return new RS('XX', {}, function () {});
    });
});

test('Newark: InvalidCountryError Thrown', function () {
    throws(function () {
        return new Newark('XX', {}, function () {});
    });
});

},{"./browser":3,"./data/countries.json":4,"./digikey":12,"./farnell":13,"./mouser":15,"./newark":16,"./qunit-1.11.0":"/build/.temp-chrome/qunit-1.11.0.js","./retailer_interface":17,"./rs":18}],23:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],24:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":23,"timers":24}]},{},[22]);
