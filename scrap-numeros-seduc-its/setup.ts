function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
  SpreadsheetApp.getUi()
    .createMenu('Script')
    .addItem('View source', 'viewSource')
    .addToUi();
}

function viewSource() {
  var htmlOutput = HtmlService.createHtmlOutput(
    'Author: Alexandre Cortez<br />Version: 0.1.0<br /><a target="_blank" href="https://github.com/CortezSMz/my-gas-projects/tree/main/scrap-numeros-seduc-its" >View source on GitHub</a>',
  )
    .setHeight(100)
    .setWidth(200);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'Numeros SEDUC');
}

function setNumerosSeducTriggers() {
  if (Util.isTriggerInstalled('populate'))
    console.log('populate already installed.');
  else ScriptApp.newTrigger('populate').timeBased().atHour(8).everyDays(1);
}
