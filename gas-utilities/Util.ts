namespace Util {
  export let isTriggerInstalled: (callbackName: string) => boolean;
}

function isTriggerInstalled(callbackName: string): boolean {
  const spreadsheetTriggers = ScriptApp.getProjectTriggers().map((trigger) =>
    trigger.getHandlerFunction(),
  );

  return spreadsheetTriggers.includes(callbackName);
}
