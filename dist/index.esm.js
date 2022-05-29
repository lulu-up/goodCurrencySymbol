/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var CurrencyFormat = /** @class */ (function () {
    function CurrencyFormat() {
        this.formatObj = new Map();
        this.validAbbreviationsTypeEN = {
            3: "K",
            6: "M",
            9: "B",
            12: "T",
        };
        this.getFrontCurrencySymbol = function (val) { var _a, _b; return (_b = (_a = /^[^\d〇一二三四五六七八九]+/g.exec(val)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ""; };
        this.getAfterCurrencySymbol = function (val) { var _a, _b; return (_b = (_a = /[^\d〇一二三四五六七八九]+$/g.exec(val)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ""; };
    }
    CurrencyFormat.prototype.addFormatType = function (typeName, options) {
        var _a;
        if (typeName) {
            var locale = options.locale, currency = options.currency, useGrouping = options.useGrouping, targetCurrency = options.targetCurrency, _b = options.calculationType, calculationType = _b === void 0 ? "round" : _b, _c = options.abbreviationCalculationType, abbreviationCalculationType = _c === void 0 ? "round" : _c, _d = options.abbreviationMaxFractionDigits, abbreviationMaxFractionDigits = _d === void 0 ? 0 : _d, validAbbreviations = options.validAbbreviations, maximumFractionDigits = options.maximumFractionDigits;
            var formatFn = new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currency,
                useGrouping: useGrouping,
                maximumFractionDigits: maximumFractionDigits,
            }).format;
            var maxFractionDigits = 0;
            var currencyTempString = formatFn(0).replace(/\s/g, "");
            var regVal = /[0〇]+[\.\,]([0〇]+)/g;
            var resArr = regVal.exec(currencyTempString);
            if (resArr) {
                maxFractionDigits = (_a = resArr === null || resArr === void 0 ? void 0 : resArr[1]) === null || _a === void 0 ? void 0 : _a.length;
            }
            this.formatObj.set(typeName, {
                formatFn: formatFn,
                calculationType: calculationType,
                maxFractionDigits: maxFractionDigits,
                targetCurrency: targetCurrency,
                abbreviationCalculationType: abbreviationCalculationType,
                abbreviationMaxFractionDigits: abbreviationMaxFractionDigits,
                validAbbreviations: validAbbreviations || this.validAbbreviationsTypeEN,
            });
        }
        else {
            throw new Error("typeName undefined");
        }
    };
    CurrencyFormat.prototype.format = function (typeName, val) {
        var _a, _b;
        var formatItem = this.formatObj.get(typeName);
        if (formatItem) {
            var formatFn = formatItem.formatFn, maxFractionDigits = formatItem.maxFractionDigits, calculationType = formatItem.calculationType, targetCurrency = formatItem.targetCurrency;
            if (typeof val === "number") {
                var multiple = Math.pow(10, maxFractionDigits);
                if (calculationType === "ceil" || calculationType === "floor") {
                    val = Math[calculationType](val * multiple) / multiple;
                }
                var currencyString = (_b = (_a = formatFn(val)) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, "")) !== null && _b !== void 0 ? _b : "";
                if (targetCurrency) {
                    var currencyObj = this.getCurrencyPosition(currencyString);
                    currencyString = "".concat(currencyObj.isFront ? targetCurrency : "").concat(currencyObj.formatValue).concat(currencyObj.isFront ? "" : targetCurrency);
                }
                return currencyString;
            }
        }
        return "";
    };
    CurrencyFormat.prototype.getCurrencyPosition = function (currencyString) {
        var frontCurrencySymbol = this.getFrontCurrencySymbol(currencyString);
        if (frontCurrencySymbol) {
            return {
                isFront: true,
                currencyString: currencyString,
                currencySymbol: frontCurrencySymbol,
                formatValue: currencyString.slice(frontCurrencySymbol.length) || "0",
            };
        }
        else {
            var afterCurrencySymbol = this.getAfterCurrencySymbol(currencyString);
            return {
                isFront: false,
                currencyString: currencyString,
                currencySymbol: afterCurrencySymbol,
                formatValue: currencyString.slice(0, -afterCurrencySymbol.length) || "0",
            };
        }
    };
    CurrencyFormat.prototype.formatAbbreviation = function (typeName, val) {
        var _a = this.formatObj.get(typeName), validAbbreviations = _a.validAbbreviations, abbreviationCalculationType = _a.abbreviationCalculationType, abbreviationMaxFractionDigits = _a.abbreviationMaxFractionDigits;
        var formatDetailObj = this.formatDetail(typeName, val);
        var AbbreviationStr = "";
        var validAbbreviationsIndex = 0;
        var valLen = "".concat(Math.floor(formatDetailObj.value)).length;
        for (var i in validAbbreviations) {
            if (valLen > Number(i)) {
                validAbbreviationsIndex = Number(i);
                AbbreviationStr = validAbbreviations[i];
            }
        }
        if (AbbreviationStr) {
            var value = Math[abbreviationCalculationType](val /
                Math.pow(10, validAbbreviationsIndex - abbreviationMaxFractionDigits));
            value = value / Math.pow(10, abbreviationMaxFractionDigits);
            return "".concat(formatDetailObj.isFront ? formatDetailObj.currencySymbol : "").concat(value).concat(AbbreviationStr).concat(formatDetailObj.isFront ? "" : formatDetailObj.currencySymbol);
        }
        return formatDetailObj.currencyString;
    };
    CurrencyFormat.prototype.formatDetail = function (typeName, val) {
        var value = Math.abs(val);
        var currencyString = this.format(typeName, value);
        var currencyObj = this.getCurrencyPosition(currencyString);
        return __assign({ value: value, negativeNumber: val < 0 }, currencyObj);
    };
    return CurrencyFormat;
}());

export { CurrencyFormat as default };
