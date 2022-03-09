function setSpreadsheetTriggers() {
  if (Util.isTriggerInstalled('sendUpdateEmail'))
    console.log('sendUpdateEmail already installed.');
  else
    ScriptApp.newTrigger('sendUpdateEmail')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onEdit()
      .create();

  if (Util.isTriggerInstalled('createCheckBoxes'))
    console.log('createCheckBoxes already installed.');
  else
    ScriptApp.newTrigger('createCheckBoxes')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onFormSubmit()
      .create();

  if (Util.isTriggerInstalled('sendConfirmationEmail'))
    console.log('sendConfirmationEmail already installed.');
  else
    ScriptApp.newTrigger('sendConfirmationEmail')
      .forSpreadsheet('1Gs3kYCxfA_RFVqKFCAftZa2XfwqY7efhHh6xr1-I94U')
      .onFormSubmit()
      .create();
}
