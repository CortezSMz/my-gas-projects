# GAS Utilities

A few useful utility methods for Google Apps Script.

## Reference

### isTriggerInstalled(callbackName)

Checks if Trigger is already installed. Returns `true` if a trigger with that same callback name is found on the project it was called.

| Parameter    | Type                                                                                              | Description                    |
| ------------ | ------------------------------------------------------------------------------------------------- | ------------------------------ |
| callbackName | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The callback name to look for. |

Returns: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

<details>
<summary> Examples</summary>

```js
Util.isTriggerInstalled('doStuff');
// true
```

</details>

### parseConfig(sheet)

Parse sheet as [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>.

| Parameter | Type                                                                           | Description         |
| --------- | ------------------------------------------------------------------------------ | ------------------- |
| sheet     | [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet) | The sheet to parse. |

Returns: [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

<details>
<summary> Examples</summary>

Configs sheet:
| |A |B |
|-|--|--|
|1 |foo |bar baz |
|2 |Foo bar|baz |

```js
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const configSheet = spreadsheet.getSheetByName('Configs');

const configParsed = Util.parseConfig(configSheet);

configParsed.foo;
// bar baz
configParsed['Foo bar'];
// baz
```

</details>
