const CurrencyFormat = require("../index").default;

const num = 123456.789;
const currencyFormat = new CurrencyFormat();
currencyFormat.addFormatType("en_gb", {
    locale: "en-GB",
    currency: "GBP",
});
currencyFormat.addFormatType("id_id", {
    locale: "id-ID",
    currency: "IDR",
});

currencyFormat.addFormatType("id_id_4", {
    locale: "id-ID",
    currency: "IDR",
    maximumFractionDigits: 3,
});

currencyFormat.addFormatType("id_id_floor", {
    locale: "id-ID",
    currency: "IDR",
    calculationType: "floor",
});

currencyFormat.addFormatType("en_gb_targetCurrency1", {
    locale: "en-GB",
    currency: "GBP",
    targetCurrency: "xxxx"
});

currencyFormat.addFormatType("en_gb_targetCurrency2", {
    locale: 'vi-VN',
    currency: "VND",
    targetCurrency: "xxxx"
});


// node > v12
describe("_", function () {
    it("default format", function () {
        expect(currencyFormat.format("en_gb", num)).toBe("£123,456.79");
        expect(currencyFormat.format("id_id", num)).toBe("Rp123.456,79");
    });

    currencyFormat.addFormatType("demo_越南", {
        locale: 'vi-VN',
        currency: "VND",
    });

    currencyFormat.addFormatType("demo_越南_中文", {
        locale: 'vi-VN',
        currency: "VND",
        validAbbreviations: {
            "3": '千',
            "4": '万',
            "8": "亿",
            "13": "兆"
        },
    });

    it("formatAbbreviation", function () {
        expect(currencyFormat.formatAbbreviation("en_gb", num)).toBe("£123K");
        expect(currencyFormat.formatAbbreviation("id_id", num)).toBe("Rp123K");
        expect(currencyFormat.formatAbbreviation("demo_越南", num)).toBe("123K₫");
        expect(currencyFormat.formatAbbreviation("demo_越南_中文", num)).toBe("12万₫");
    });

    it("maximumFractionDigits", function () {
        expect(currencyFormat.format("id_id_4", num)).toBe("Rp123.456,789");
    });

    it("calculationType: 'floor'", function () {
        expect(currencyFormat.format("id_id_floor", num)).toBe("Rp123.456,78");
    });

    it("negative number", function () {
        expect(currencyFormat.format("en_gb", num * -1)).toBe("-£123,456.79");
    });

    it("detail", function () {
        expect(currencyFormat.formatDetail("en_gb", num)).toEqual({
            currencyString: "£123,456.79",
            currencySymbol: "£",
            formatValue: "123,456.79",
            isFront: true,
            negativeNumber: false,
            value: 123456.789,
        });
    });

    it("target currency", function () {
        expect(currencyFormat.format("en_gb_targetCurrency1", num)).toBe("xxxx123,456.79");
        expect(currencyFormat.format("en_gb_targetCurrency2", num)).toBe("123.457xxxx");
    });
});