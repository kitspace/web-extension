(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var _require = require('./messenger'),
    messenger = _require.messenger;

setInterval(function () {
    return window.postMessage({ from: 'extension', message: 'register' }, '*');
}, 3000);

messenger.send('getBackgroundState');

messenger.on('bomBuilderResult', function (value) {
    window.postMessage({ from: 'extension', message: 'bomBuilderResult', value: value }, '*');
});

messenger.on('updateKitspace', function (interfaces) {
    var adding = {};
    for (var name in interfaces) {
        var retailer = interfaces[name];
        adding[name] = retailer.adding_lines;
    }
    var clearing = {};
    for (var _name in interfaces) {
        var _retailer = interfaces[_name];
        clearing[_name] = _retailer.clearing_cart;
    }
    window.postMessage({ from: 'extension', message: 'updateAddingState', value: adding }, '*');
    window.postMessage({ from: 'extension', message: 'updateClearingState', value: clearing }, '*');
});

window.addEventListener('message', function (event) {
    if (event.data.from === 'page') {
        messenger.send(event.data.message, event.data.value);
    }
}, false);

},{"./messenger":2}],2:[function(require,module,exports){
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

var messenger = {
    msgNames: [],
    listening: false,
    on: function on(msgName, callback) {
        var _this = this;

        this.msgNames.push({ msgName: msgName, callback: callback });
        if (!this.listening) {
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                for (var i = 0; i < _this.msgNames.length; i++) {
                    var _msgNames$i = _this.msgNames[i],
                        _msgName = _msgNames$i.msgName,
                        _callback = _msgNames$i.callback;

                    if (request.name === _msgName) {
                        return _callback(request.value, sendResponse);
                    }
                }
            });
            return this.listening = true;
        }
    },
    send: function send(msgName) {
        var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        chrome.runtime.sendMessage({
            name: msgName,
            value: JSON.parse(JSON.stringify(input))
        });
        if (chrome.tabs != null) {
            return chrome.tabs.query({
                url: ['*://kitspace.org/*', '*://*.kitspace.org/*', '*://kitspace.dev/*', '*://*.kitspace.dev/*', '*://kitspace.test/*', '*://*.kitspace.test/*']
            }, function (tabs) {
                return tabs.map(function (tab) {
                    return chrome.tabs.sendMessage(tab.id, {
                        name: msgName,
                        value: JSON.parse(JSON.stringify(input))
                    });
                });
            });
        }
    }
};

exports.messenger = messenger;

},{}]},{},[1]);
