function populate() {
  const setores = scrap();

  try {
    for (const [_, [setor, funcionarios]] of Object.entries(setores)) {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

      const sheet =
        spreadsheet.getSheetByName(setor.sigla) ??
        spreadsheet.insertSheet(setor.sigla);

      sheet.clear();

      sheet
        .getRange(1, 1, 1, 2)
        .setValues([[setor.nome, '']])
        .mergeAcross()
        .setFontSize(14)
        .setFontWeight('bold')
        .setHorizontalAlignment('center')
        .setBackground(setor.tabColor);

      sheet
        .getRange(2, 1, 1, 2)
        .setValues([['Nome', 'SEDUC']])
        .setFontWeight('bold');

      sheet.getRange(3, 1, funcionarios.length, 2).setValues(
        funcionarios.map(([nome, seduc]) => {
          return [
            nome,
            `=HYPERLINK("https://www.documentos.spsempapel.sp.gov.br/siga/app/pessoa/exibir?sigla=${seduc}","${seduc}")`,
          ];
        }),
      );

      sheet
        .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
        .setFontSize(13)
        .applyRowBanding(setor.bandingColor);

      sheet.autoResizeColumns(1, 2);

      sheet.autoResizeRows(1, sheet.getLastRow());

      sheet.setTabColor(setor.tabColor);
    }
  } catch (error) {
    console.log(error);
  }
}
