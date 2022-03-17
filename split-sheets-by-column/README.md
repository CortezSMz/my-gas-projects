# Split Sheets by Column

Split sheets based on column content. You can pass one or more sheets to the method, it will keep correspondingly content names on the same file.

## Reference

### splitSheetsByColumn(sheets, baseColToSplit, folderID)

| Parameter      | Type                                                                                                                                                                            | Optional | Default | Description                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| sheets         | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet)> |    ❌    |         | Sheets to split.                                                                                                                                       |
| baseColToSplit | [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)                                                                               |    ✔️    |    1    | The column to split, based on content; column indexing starts with 1.                                                                                  |
| folderID       | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)                                                                               |    ✔️    | _none_  | The ID of the folder it should save the files. Will use `config.folder` if set, or else it will create one with the same name as the main spreadsheet. |

Returns: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet)>

<details>
<summary>Examples</summary>

[View input sheets](https://docs.google.com/spreadsheets/d/1LPW_UYMz23iRrsM5T9n1LBhDQcHdKK0OypKAY6FFs28/edit?usp=sharing)

```js
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const nato = spreadsheet.getSheetByName('NATO');
const numbers = spreadsheet.getSheetByName('Numbers');

/* Split both sheets based on first column */
SplitSheetbyColumn.splitSheetByColumn([nato, numbers], 1);
```

[View output files](https://drive.google.com/drive/u/3/folders/1qHminUCqN6aGbiJoDf0dx5PevH95rezs)
