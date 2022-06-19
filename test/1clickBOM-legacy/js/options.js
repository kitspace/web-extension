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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports={
    "UK": {
        "Farnell": {
            "site": {
                "value": "://uk.farnell.com",
                "options": [ {"value":"://uk.farnell.com"
                                , "label":"uk.farnell.com"}
                           , {"value":"://onecall.farnell.com"
                                , "label":"onecall.farnell.com"}
                ]
            }
        }
    },
    "FR": {
        "Farnell": {
            "site": {
                "value": "://fr.farnell.com",
                "options": [ {"value":"://fr.farnell.com"
                                , "label":"fr.farnell.com"}
                           , {"value":"://eproc-fr.farnell.com"
                                , "label":"eproc-fr.farnell.com"}
                ]
            }
        }
    }
}

},{}],4:[function(require,module,exports){
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

var countries_data = require('./data/countries.json');
var settings_data = require('./data/settings.json');

function save_options() {
    var select = document.getElementById('country');
    var country = select.children[select.selectedIndex].value;
    var _document = document,
        settings = _document.settings;

    if (settings_data[country]) {
        if (!settings[country]) {
            settings[country] = {};
        }
        for (var retailer in settings_data[country]) {
            var checked = document.querySelector('input[name=' + retailer + ']:checked');
            if (checked) {
                settings[country][retailer] = {};
                settings[country][retailer]['site'] = checked.value;
            }
        }
    }
    return browser.prefsSet({ country: country, settings: settings }, function () {
        return load_options();
    });
}

var load_options = function load_options() {
    return browser.prefsGet(['settings', 'country'], function (stored) {
        if (!stored.country) {
            stored.country = 'Other';
        }

        if (stored.settings != null) {
            document.settings = stored.settings;
        } else {
            document.settings = {};
        }

        var select = document.getElementById('country');
        for (var i = 0; i < select.children.length; i++) {
            var child = select.children[i];
            if (child.value === stored.country) {
                child.selected = 'true';
                break;
            }
        }

        var form = document.getElementById('settings');
        while (form.hasChildNodes()) {
            form.removeChild(form.lastChild);
        }
        return function () {
            var result = [];
            for (var retailer in settings_data[stored.country]) {
                var choices = settings_data[stored.country][retailer].site.options;
                var _default = settings_data[stored.country][retailer].site.value;
                var div = document.createElement('div');
                var div2 = document.createElement('div');
                div2.className = 'heading_2';
                var h3 = document.createElement('h3');
                h3.innerHTML = retailer;
                div2.appendChild(h3);
                div.appendChild(div2);
                form.appendChild(div);
                for (var index = 0; index < choices.length; index++) {
                    var choice = choices[index];
                    var radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = retailer;
                    radio.value = choice.value;
                    radio.id = 'id_' + choice.value;
                    radio.label = choice.label;
                    var _div = document.createElement('div');
                    _div.appendChild(radio);
                    _div.innerHTML += choice.label;
                    _div.style = 'cursor: pointer;';
                    _div.onclick = function (mouse_event) {
                        var child = mouse_event.target.firstChild;
                        if (child != null) {
                            if (child.type === 'radio') {
                                child.checked = 'checked';
                                return save_options();
                            }
                        }
                    };

                    form.appendChild(_div);
                }
                if (stored.settings != null && stored.settings[stored.country] != null && Boolean(Object.keys(stored.settings[stored.country]).length)) {
                    var id = 'id_' + stored.settings[stored.country][retailer].site;
                    var selected = document.getElementById(id);
                } else {
                    var selected = document.getElementById('id_' + _default);
                }
                if (selected != null) {
                    selected.checked = 'checked';
                }
                result.push([].slice.call(document.getElementsByTagName('input')).map(function (input) {
                    return input.onclick = save_options;
                }));
            }
            return result;
        }();
    });
};

var select = document.getElementById('country');
for (var name in countries_data) {
    var code = countries_data[name];
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = code;
    select.appendChild(opt);
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('country').onchange = save_options;

},{"./browser":1,"./data/countries.json":2,"./data/settings.json":3}]},{},[4]);
