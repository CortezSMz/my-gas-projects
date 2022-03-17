function splitSheetsByColumn(
  sheets: GoogleAppsScript.Spreadsheet.Sheet[],
  baseColToSplit: number = 1,
  folderID?: string,
): GoogleAppsScript.Spreadsheet.Spreadsheet[] {
  /* Get Configs sheet */
  const configSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configs');

  /* Parse config */
  const config = Util.parseConfig(configSheet);

  /* Get the folder by ID using the previous config generated */
  const folder =
    folderID ?? config['folder']
      ? DriveApp.getFolderById(config['folder'])
      : DriveApp.createFolder(SpreadsheetApp.getActiveSpreadsheet().getName());

  let spreadsheets: GoogleAppsScript.Spreadsheet.Spreadsheet[];

  for (const sheet of sheets) {
    /* Get range of data to copy */
    const range = sheet
      .getRange(2, baseColToSplit, sheet.getLastRow())
      .getValues();

    /* Get headers */
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

    /* Iteration data */
    let rowStart = 2;
    let rowEnd = 1;
    let currV = '';
    let newV = '';

    /* Iterate trought all the data */
    for (let i = 0; i < range.length; i++) {
      /* Set first line as starting value */
      if (i === 0) currV = range[i][0];
      newV = range[i][0];

      /* If next line is equal to previous, add to line count */
      if (currV === newV) {
        rowEnd++;
        /* If next line is different, creates a new SpreadSheet with the line count*/
      } else {
        /* Find the amount of rows to copy */
        const amountOfRows = rowEnd - rowStart + 1;

        /* Logs the amount of rows, the current value and which lines are being copied  */
        console.log(
          `Found ${amountOfRows}x ${currV} - from line ${rowStart} to ${rowEnd}`,
        );

        try {
          /* Check if file already exists */
          let file:
            | GoogleAppsScript.Drive.File
            | GoogleAppsScript.Drive.FileIterator =
            folder.getFilesByName(currV);

          /* If exists open, else create */
          const spreadsheet = file.hasNext()
            ? SpreadsheetApp.open(file.next())
            : SpreadsheetApp.create(currV);

          spreadsheets.push(spreadsheet);

          /* Check for default sheet */
          const defaultSheet = spreadsheet.getSheetByName('Sheet1');

          /* Get default sheet and rename or create one */
          const newSheet = defaultSheet
            ? defaultSheet.setName(sheet.getName())
            : spreadsheet.insertSheet(sheet.getName());

          /* Copy headers to new sheet */
          newSheet.getRange(1, 1, 1, sheet.getLastColumn()).setValues(headers);

          /* Get target values  */
          const rangeToCopy = sheet.getRange(
            rowStart,
            1,
            amountOfRows,
            sheet.getLastColumn(),
          );

          /* Copy target values to new sheet */
          newSheet
            .getRange(2, 1, amountOfRows, sheet.getLastColumn())
            .setValues(rangeToCopy.getValues());

          /* Apply color banding to new sheet */
          newSheet
            .getRange(1, 1, newSheet.getLastRow(), newSheet.getLastColumn())
            .applyRowBanding(SpreadsheetApp.BandingTheme.BLUE);

          /* Move the files to selected folder */
          file = DriveApp.getFileById(spreadsheet.getId());
          file.moveTo(folder);

          console.log(`Created ${currV} with ${amountOfRows} rows.`);
        } catch (e) {
          console.log(e);
        }

        /* Restart iteration values */
        currV = range[i][0];
        rowStart = i + 2;
        rowEnd = i + 2;
      }
    }
  }

  return spreadsheets;
}
