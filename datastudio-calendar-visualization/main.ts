function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  /* Get edited sheet */
  const s = SpreadsheetApp.getActiveSheet();
  /* Edited cell range */
  const col = e.range.getColumn();
  const row = e.range.getRow();

  /* If headers, return */
  if (row === 1) return;

  /* If not the responses sheet, return */
  if (s.getName() !== 'Respostas ao formulário') return;

  /* If columns from 1 to 6, create new checkboxes */
  if ([1, 2, 3, 4, 5, 6].includes(col)) return createCheckBoxes(s, row);

  /* Ensure it runs only on checked, not on unchecked check boxes */
  if (e.oldValue === 'true' && e.value === 'FALSE') return;

  /* Look for the date in the Calendar sheet */
  const foundDateRow = findDateRow(s, row);

  /* Get the values on the Calendar sheet that matches the date */
  const calendarCells = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Calendário')
    .getRange('C1:F1827')
    .getValues()[foundDateRow.dateRow - 1];

  /* Loop throught found values */
  for (const cell of calendarCells) {
    /* See which checkbox was checked, continue if those */
    if ([7, 10, 11].includes(col)) continue;
    /* Check if it has something scheduled */
    if (!!cell) {
      /* Get user confirmation to overwrite */
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        'Já existe um agendamento para esta data, tem certeza que deseja continuar?',
        ui.ButtonSet.YES_NO,
      );

      /* If overwrite */
      if (response == ui.Button.YES) {
        const range = s.getRange(1, 5, s.getLastRow(), s.getLastColumn());
        /* Loop trought all solicitations and mark "Canceled" on duplicateds */
        for (let i = 0; i < range.getValues().length; i++) {
          if (
            range
              .getValues()
              [i][0].toLocaleString()
              .includes(calendarCells[2].toLocaleString().split(' ')[0]) &&
            (range.getValues()[i][2] || range.getValues()[i][3]) &&
            i + 1 !== row
          ) {
            s.getRange(i + 1, 7).setValues([['FALSE']]);
            s.getRange(i + 1, 8).setValues([['FALSE']]);
            s.getRange(i + 1, 9).setValues([['TRUE']]);
            s.getRange(i + 1, 10).setValues([['Cancelado']]);
          }
        }
        break;
      } else {
        /* If not overwrite, cancel user selection */
        return s.getRange(row, col).setValue('FALSE');
      }
    }
  }

  /* Invert checkboxes to mime radio buttons */
  invertCheckBoxes(s, row, col);

  /* If checkbox "In review" */
  if (col === 7)
    return updateCalendar({
      dateRow: foundDateRow.dateRow,
      values: [['', '', '', '']],
    });

  /* If checkbox "Confirmed" */
  if (col === 8) return updateCalendar(foundDateRow);

  /* If checkbox "Canceled" */
  if (col === 9)
    return updateCalendar({
      dateRow: foundDateRow.dateRow,
      values: [['', '', '', '']],
    });

  /* If checkbox "DELETE" */
  if (col === 11) return removeRow(s, row);

  /* Update sheet */
  SpreadsheetApp.flush();
}

/* Send confirmation email on new schedules */
function sendConfirmationEmail(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {
  /* Get data */
  const email = e.values[1];
  const usuario = e.values[2];
  const motivo = e.values[3];
  const data = e.values[4].split(' ')[0];

  /* User e-mail */
  MailApp.sendEmail(
    email,
    'Reserva Carro Oficial - Em análise',
    `Sua reserva para utilizar o Carro Oficial no dia ${data} foi recebida e está em análise. Você receberá outro e-mail caso o status seja atualizado.`,
  );

  /* Send admin e-mail */
  MailApp.sendEmail(
    'ADMIN@email.com',
    `Nova reserva Carro Oficial - ${usuario} - ${data}`,
    `Nova solicitação de reserva:
        
        Email: ${email}
        Usuario: ${usuario}
        Motivo: ${motivo}
        Data: ${data}
        
        
        Clique aqui para acessar a planilha de reservas: {{sheetslink}}`,
  );

  console.log('Nova reserva:', e.values);
}

/* Sends update email to user when admin Confirms or Cancel the solicitation */
function sendUpdateEmail(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    'Respostas ao formulário',
  );
  const types = {
    7: 'Em análise',
    8: 'Confirmado',
    9: 'Cancelado',
  };
  /* Check which checkbox was changed */
  const col = e.range.getColumn();
  const row = e.range.getRow();

  /* If NOT one of the checkboxes: "In review", "Confirmed" or "Canceled"  */
  if (![7, 8, 9].includes(col)) return;

  /* If checkbox was unchecked, return */
  if (e.oldValue === 'true' && e.value === 'FALSE') return;

  /* Get type as text */
  const type = types[col];

  /* Get schedule data */
  const data = s.getRange(`B${row}:J${row}`).getValues()[0];

  /* If there was no change (same checkbox as before), return */
  if (data[8] === type) return;

  const email = data[0];
  const message = `Sua solicitação teve o status alterado de ${data[8]} para ${type}.`;
  const subject = `Reserva Carro Oficial - ${type}`;

  /* Store old value on col 'J' to check later */
  s.getRange(`J${row}`).setValue(type);

  MailApp.sendEmail(email, subject, message);

  SpreadsheetApp.flush();

  console.log(`Email de status enviado de ${data[8]} para ${type}:`, data);
}

/* Create checkboxes on new schedules */
function createCheckBoxes(
  s: GoogleAppsScript.Spreadsheet.Sheet,
  row: number | undefined,
) {
  /* Check if it was manual or on new Form responses */
  if (!row) {
    s = SpreadsheetApp.getActiveSheet();
    row = (s as unknown as GoogleAppsScript.Events.SheetsOnEdit).range.getRow();
  }

  /* Create checkboxes and default to 'In review' */
  s.getRange(`G${row}`).insertCheckboxes().setValue('TRUE');
  s.getRange(`H${row}`).insertCheckboxes().setValue('FALSE');
  s.getRange(`I${row}`).insertCheckboxes().setValue('FALSE');
  s.getRange(`J${row}`).setValue('Em análise');
  s.getRange(`K${row}`).insertCheckboxes().setValue('FALSE');
}

/* Inver checkboxes on change to mime radio buttons */
function invertCheckBoxes(
  s: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
) {
  if (col === 7) {
    s.getRange(`H${row}`).setValue('FALSE');
    s.getRange(`I${row}`).setValue('FALSE');
  } else if (col === 8) {
    s.getRange(`G${row}`).setValue('FALSE');
    s.getRange(`I${row}`).setValue('FALSE');
  } else if (col === 9) {
    s.getRange(`G${row}`).setValue('FALSE');
    s.getRange(`H${row}`).setValue('FALSE');
  }

  console.log(
    `Checkbox invertida na linha ${row} para ${
      col === 7 ? 'Em análise' : col === 8 ? 'Confirmado' : 'Cancelado'
    }.`,
  );
}

/* Helper function to find dates on Calendar sheet */
function findDateRow(s: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendário');

  const cellsToCopy = s.getRange(`C${row}:F${row}`).getValues();

  const dateToConfirm = cellsToCopy[0][2].toLocaleString().split(' ')[0];

  const f = ss
    .getRange('A1:A1827')
    .getValues()
    .findIndex((v) => v.toLocaleString().includes(dateToConfirm));

  return {
    dateRow: f + 1,
    values: cellsToCopy,
  };
}

/* Helper function to write schedules on Calendar sheet */
function updateCalendar({
  dateRow,
  values,
}: {
  dateRow: number;
  values: string[][];
}) {
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendário');

  if (dateRow > 1) ss.getRange(`C${dateRow}:F${dateRow}`).setValues(values);

  console.log('Alteração no calendário', values);
}

function removeRow(s: GoogleAppsScript.Spreadsheet.Sheet, row: number) {
  const range = s.getRange(`A${row}:L${row}`);

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Você tem certeza que deseja excluir essa solicitação?',
    ui.ButtonSet.YES_NO,
  );

  if (response == ui.Button.YES) {
    if (range.getValues()[0][7])
      updateCalendar({
        dateRow: findDateRow(s, row).dateRow,
        values: [['', '', '', '']],
      });
    s.deleteRow(row);
  } else {
    s.getRange(`K${row}`).setValue('FALSE');
  }
}
