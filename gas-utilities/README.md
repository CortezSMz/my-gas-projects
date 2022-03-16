# GAS Utilities

A few useful utility methods for Google Apps Script.

## Reference

### isTriggerInstalled: (callbackName: string) => boolean

Checks if Trigger is already installed. Returns true if a trigger with that same callback name is found on the project it was called.

<details>
<summary> Examples</summary>

```js
Util.isTriggerInstalled('doStuff');
// true
```

</details>

### parseConfig: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => Record<string, string>

Parse sheet as `object` of type `Record<string, string>`.

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
