## goodCurrencySymbol (数字 -> 货币字符串)

* 支持货币缩写、 支持可控货币精度、支持自定义货币符号、自动配置货币符号位置、自动配置货币千分号、兼容负数、 支持ts

<hr>

### github : https://github.com/lulu-up/goodCurrencySymbol

### 详细配置请看文章: https://segmentfault.com/a/1190000042037852

<hr>
### 一、安装

```shell
npm install good-currency-symbol
```

### 二、使用

```js
  const currencyFormat = new CurrencyFormat();
  currencyFormat.addFormatType("人民币", {
    locale:'zh', // 国家码
    currency: "CNY", // 货币码
    calculationType: 'ceil', // "ceil" | "floor" | "round"
    // maximumFractionDigits: 3 ,// 保留位数
    // useGrouping: false, // 隐藏千分号
    // ... 其余配置请看文章
  });

  // 使用
  currencyFormat.format('人民币', 12.34) // ¥12.34

```

可返回详细信息: formatDetail

```js
currencyFormat.formatDetail('人民币', 12.34);

// 返回值

var res = {
  currencyString: "¥12.34"
  currencySymbol: "¥"
  formatValue: "12.34"
  isFront: true // 货币符号是否在数字前方
  negativeNumber: false // 是否为负数
  value: 12.34
}
```


### 三、配置
默认的缩写: key是到第几位开始缩写, value是缩写
```js
const validAbbreviationsTypeEN = {
    3: "K",
    6: "M",
    9: "B",
    12: "T",
};
```

例如配置成中文缩写: formatAbbreviation
```js
const currencyFormat = new CurrencyFormat();
  currencyFormat.addFormatType("越南_中文", {
    locale: 'vi-VN',
    currency: "VND",
    validAbbreviations: {
            "3": '千',
            "4": '万',
            "8": "亿",
            "13": "兆"
      },
  });

  currencyFormat.formatAbbreviation('越南_中文', 12345.67) // 1万₫
```


### 四、查询
- 查询国家代码: [BCP 47 language tag](https://www.techonthenet.com/js/language_tags.php)

- 查询货币代码: [ISO 4217 currency codes](https://www.xe.com/zh-CN/iso4217.php)