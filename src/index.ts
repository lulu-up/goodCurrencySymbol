type FormatTypeOptions = {
    locale: string;
    currency: string;
    useGrouping?: boolean;
    targetCurrency?: string;
    maximumFractionDigits?: number;
    calculationType?: "ceil" | "floor" | "round";
    abbreviationCalculationType?: "ceil" | "floor" | "round";
    abbreviationMaxFractionDigits: number,
    validAbbreviations: any,
};

type CurrencyPosition = {
    isFront: boolean;
    formatValue: string;
    currencyString: string;
    currencySymbol: string;
};

type FormatDetail = {
    value: number;
    isFront: boolean;
    formatValue: string;
    currencyString: string;
    currencySymbol: string;
    negativeNumber: boolean;
    targetCurrency?: string;
};

type FormatObjItem = {
    formatFn: (n: number) => string;
    targetCurrency?: string;
    maxFractionDigits?: number;
    validAbbreviations: any,
    abbreviationMaxFractionDigits: number,
    calculationType?: "ceil" | "floor" | "round";
    abbreviationCalculationType?: "ceil" | "floor" | "round";
};

const validAbbreviationsTypeEN = {
    3: "K",
    6: "M",
    9: "B",
    12: "T",
};

export default class CurrencyFormat {
    formatObj = new Map<string, FormatObjItem>();
    addFormatType(typeName: string, options: FormatTypeOptions): void {
        if (typeName) {
            const {
                locale,
                currency,
                useGrouping,
                targetCurrency,
                calculationType = "round",
                abbreviationCalculationType = "round",
                abbreviationMaxFractionDigits = 0,
                validAbbreviations,
                maximumFractionDigits,
            } = options;
            const formatFn = new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                useGrouping,
                maximumFractionDigits,
            }).format;

            let maxFractionDigits = 0;
            const currencyTempString = formatFn(0).replace(/\s/g, "");
            const regVal = /[0〇]+[\.\,]([0〇]+)/g;
            const resArr = regVal.exec(currencyTempString);
            if (resArr) {
                maxFractionDigits = resArr?.[1]?.length;
            }
            this.formatObj.set(typeName, {
                formatFn,
                calculationType,
                maxFractionDigits,
                targetCurrency,
                abbreviationCalculationType,
                abbreviationMaxFractionDigits,
                validAbbreviations: validAbbreviations || validAbbreviationsTypeEN,
            });
        } else {
            throw new Error("typeName undefined");
        }
    }
    getFrontCurrencySymbol = (val: string) =>
        /^[^\d〇一二三四五六七八九]+/g.exec(val)?.[0] ?? "";
    getAfterCurrencySymbol = (val: string) =>
        /[^\d〇一二三四五六七八九]+$/g.exec(val)?.[0] ?? "";
    format(typeName: string, val: number): string {
        const formatItem: FormatObjItem = this.formatObj.get(typeName);
        if (formatItem) {
            const { formatFn, maxFractionDigits, calculationType, targetCurrency } =
                formatItem;
            if (typeof val === "number") {
                const multiple = Math.pow(10, maxFractionDigits);
                if (calculationType === "ceil" || calculationType === "floor") {
                    val = Math[calculationType](val * multiple) / multiple;
                }
                let currencyString = formatFn(val)?.replace(/\s/g, "") ?? "";

                if (targetCurrency) {
                    const currencyObj = this.getCurrencyPosition(currencyString);
                    currencyString = `${currencyObj.isFront ? targetCurrency : ""}${currencyObj.formatValue
                        }${currencyObj.isFront ? "" : targetCurrency}`;
                }
                return currencyString;
            }
        }
        return "";
    }
    getCurrencyPosition(currencyString): CurrencyPosition {
        const frontCurrencySymbol: string =
            this.getFrontCurrencySymbol(currencyString);
        if (frontCurrencySymbol) {
            return {
                isFront: true,
                currencyString,
                currencySymbol: frontCurrencySymbol,
                formatValue: currencyString.slice(frontCurrencySymbol.length) || "0",
            };
        } else {
            const afterCurrencySymbol: string =
                this.getAfterCurrencySymbol(currencyString);
            return {
                isFront: false,
                currencyString,
                currencySymbol: afterCurrencySymbol,
                formatValue:
                    currencyString.slice(0, -afterCurrencySymbol.length) || "0",
            };
        }
    }
    formatAbbreviation(typeName, val) {
        const {
            validAbbreviations,
            abbreviationCalculationType,
            abbreviationMaxFractionDigits,
        } = this.formatObj.get(typeName);
        const formatDetailObj = this.formatDetail(typeName, val);

        let AbbreviationStr = "";
        let validAbbreviationsIndex = 0;
        const valLen = `${Math.floor(formatDetailObj.value)}`.length;
        for (let i in validAbbreviations) {
            if (valLen > Number(i)) {
                validAbbreviationsIndex = Number(i);
                AbbreviationStr = validAbbreviations[i];
            }
        }
        if (AbbreviationStr) {
            let value = Math[abbreviationCalculationType](
                val /
                Math.pow(10, validAbbreviationsIndex - abbreviationMaxFractionDigits)
            );
            value = value / Math.pow(10, abbreviationMaxFractionDigits);
            return `${formatDetailObj.isFront ? formatDetailObj.currencySymbol : ""
                }${value}${AbbreviationStr}${formatDetailObj.isFront ? "" : formatDetailObj.currencySymbol
                }`;
        }
        return formatDetailObj.currencyString;
    }
    formatDetail(typeName: string, val: number): FormatDetail {
        const value: number = Math.abs(val);
        const currencyString: string = this.format(typeName, value);
        const currencyObj = this.getCurrencyPosition(currencyString);

        return {
            value,
            negativeNumber: val < 0,
            ...currencyObj,
        };
    }
}