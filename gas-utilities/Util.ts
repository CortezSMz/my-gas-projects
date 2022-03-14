namespace Util {
  export let isTriggerInstalled: (callbackName: string) => boolean;
  export let parseConfig: (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
  ) => Record<string, string>;
}

function isTriggerInstalled(callbackName: string): boolean {
  const spreadsheetTriggers = ScriptApp.getProjectTriggers().map((trigger) =>
    trigger.getHandlerFunction(),
  );

  return spreadsheetTriggers.includes(callbackName);
}

function parseConfig(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
): Record<string, string> {
  if (!sheet || sheet.getLastRow() === 0) return {};
  return sheet
    .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues()
    .reduce(
      (a, v) => ({
        ...a,
        [v[0]]: v[1],
      }),
      {},
    );
}
