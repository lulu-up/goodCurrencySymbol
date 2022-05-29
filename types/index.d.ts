declare type FormatTypeOptions = {
    locale: string;
    currency: string;
    useGrouping?: boolean;
    targetCurrency?: string;
    maximumFractionDigits?: number;
    calculationType?: "ceil" | "floor" | "round";
    abbreviationCalculationType?: "ceil" | "floor" | "round";
    abbreviationMaxFractionDigits: number;
    validAbbreviations: any;
};
declare type CurrencyPosition = {
    isFront: boolean;
    formatValue: string;
    currencyString: string;
    currencySymbol: string;
};
declare type FormatDetail = {
    value: number;
    isFront: boolean;
    formatValue: string;
    currencyString: string;
    currencySymbol: string;
    negativeNumber: boolean;
    targetCurrency?: string;
};
declare type FormatObjItem = {
    formatFn: (n: number) => string;
    targetCurrency?: string;
    maxFractionDigits?: number;
    validAbbreviations: any;
    abbreviationMaxFractionDigits: number;
    calculationType?: "ceil" | "floor" | "round";
    abbreviationCalculationType?: "ceil" | "floor" | "round";
};
export default class CurrencyFormat {
    formatObj: Map<string, FormatObjItem>;
    validAbbreviationsTypeEN: {
        3: string;
        6: string;
        9: string;
        12: string;
    };
    addFormatType(typeName: string, options: FormatTypeOptions): void;
    getFrontCurrencySymbol: (val: string) => string;
    getAfterCurrencySymbol: (val: string) => string;
    format(typeName: string, val: number): string;
    getCurrencyPosition(currencyString: any): CurrencyPosition;
    formatAbbreviation(typeName: any, val: any): string;
    formatDetail(typeName: string, val: number): FormatDetail;
}
export {};
