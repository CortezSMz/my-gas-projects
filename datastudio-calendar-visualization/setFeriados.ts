function setFeriados() {
  /* Calendar sheet with all dates */
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendário');
  const range = s.getRange(1, 1, s.getLastRow(), s.getLastColumn()).getValues();

  /* Get the starting year as number */
  let ano = s
    .getRange(2, 1)
    .getValue()
    .toLocaleString('pt-BR', { year: 'numeric' });
  /* Get the ending year as number */
  const anoFim = s
    .getRange(s.getLastRow(), 1)
    .getValue()
    .toLocaleString('pt-BR', { year: 'numeric' });

  /* Loop throught the years */
  for (ano; ano <= anoFim; ano++) {
    console.log(`Preenchendo feriados de ${ano}...`);

    /* Fetch all holidays for that year */
    const feriadosRes = UrlFetchApp.fetch(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`,
    );

    /* Parse the response */
    let feriados = JSON.parse(feriadosRes.getContentText()).map(
      (r: { name: string; date: string; type: string }) => {
        return {
          nome: r.name,
          data: new Date(`${r.date}T00:00:00`).toLocaleString('pt-BR'),
          tipo: r.type === 'national' ? 'Feriado Nacional' : r.type,
        };
      },
    );

    console.log(`${feriados.length} datas encontradas.`);
    /* Loop throught holidays found */
    for (const feriado of feriados) {
      /* If it's not what we want, continue */
      if (feriado.tipo !== 'Feriado Nacional') continue;

      /* Find the holiday in the calendar */
      const row = range.findIndex((r) => {
        return r[0].toLocaleString('pt-BR') === feriado.data;
      });

      /* If not found, continue */
      if (row < 1) {
        console.log(
          `Dia ${feriado.data} - ${feriado.nome} não encontrado na planilha calendário, continuando...`,
        );
        continue;
        /* Else, write it */
      } else {
        console.log(`Preenchendo dia ${feriado.data} - ${feriado.nome}`);
        s.getRange(row + 1, 3, 1, 4).setValues([
          [
            feriado.nome,
            feriado.tipo,
            feriado.data.split(' ')[0],
            feriado.data.split(' ')[0],
          ],
        ]);
      }
    }
  }
}
