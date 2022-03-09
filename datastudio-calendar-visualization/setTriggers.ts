function setSpreadsheetTriggers() {
  if (isInstalled('sendUpdateEmail'))
    console.log('sendUpdateEmail already installed.');
  else
    ScriptApp.newTrigger('sendUpdateEmail')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onEdit()
      .create();

  if (isInstalled('createCheckBoxes'))
    console.log('createCheckBoxes already installed.');
  else
    ScriptApp.newTrigger('createCheckBoxes')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onFormSubmit()
      .create();

  if (isInstalled('sendConfirmationEmail'))
    console.log('sendConfirmationEmail already installed.');
  else
    ScriptApp.newTrigger('sendConfirmationEmail')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onFormSubmit()
      .create();
}

function isInstalled(callbackName: string): boolean {
  const spreadsheetTriggers = ScriptApp.getProjectTriggers().map((trigger) =>
    trigger.getHandlerFunction(),
  );

  return spreadsheetTriggers.includes(callbackName);
}
